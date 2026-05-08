<?php
declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');

$GLOBALS['CONTACT_RESPONSE_SENT'] = false;
$GLOBALS['CONTACT_ENV_FILE'] = null;
$GLOBALS['CONTACT_RUNTIME_CONFIG'] = [];

function respond(int $status, bool $success, string $message, array $extra = []): void
{
    if ($GLOBALS['CONTACT_RESPONSE_SENT'] === true) {
        exit;
    }
    $GLOBALS['CONTACT_RESPONSE_SENT'] = true;
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode(array_merge([
        'success' => $success,
        'message' => $message,
    ], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

function loadEnvFile(array $paths): ?string
{
    foreach ($paths as $path) {
        if (!is_file($path) || !is_readable($path)) {
            continue;
        }

        $lines = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!is_array($lines)) {
            continue;
        }

        foreach ($lines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '' || str_starts_with($trimmed, '#')) {
                continue;
            }
            if (str_starts_with($trimmed, 'export ')) {
                $trimmed = trim(substr($trimmed, 7));
            }

            $parts = explode('=', $trimmed, 2);
            if (count($parts) !== 2) {
                continue;
            }

            $key = trim($parts[0]);
            $value = trim($parts[1]);
            if ($key === '') {
                continue;
            }

            if (
                (str_starts_with($value, '"') && str_ends_with($value, '"')) ||
                (str_starts_with($value, "'") && str_ends_with($value, "'"))
            ) {
                $value = substr($value, 1, -1);
            }

            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
            putenv($key . '=' . $value);
        }

        return $path;
    }

    return null;
}

function loadRuntimeConfig(array $paths): array
{
    foreach ($paths as $path) {
        if (!is_file($path) || !is_readable($path)) {
            continue;
        }

        $config = require $path;
        if (!is_array($config)) {
            error_log('[contact.php] runtime-config.php is not an array: ' . $path);
            continue;
        }

        return [$path, $config];
    }

    return [null, []];
}

function envValue(string $key, ?string $default = null): ?string
{
    $val = getenv($key);
    if ($val !== false && trim((string) $val) !== '') {
        return trim((string) $val);
    }
    if (isset($_ENV[$key]) && trim((string) $_ENV[$key]) !== '') {
        return trim((string) $_ENV[$key]);
    }
    if (isset($_SERVER[$key]) && trim((string) $_SERVER[$key]) !== '') {
        return trim((string) $_SERVER[$key]);
    }
    return $default;
}

function configValue(string $key, ?string $default = null): ?string
{
    $runtimeConfig = $GLOBALS['CONTACT_RUNTIME_CONFIG'];
    if (is_array($runtimeConfig) && array_key_exists($key, $runtimeConfig)) {
        $value = trim((string) $runtimeConfig[$key]);
        if ($value !== '') {
            return $value;
        }
    }

    return envValue($key, $default);
}

set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

set_exception_handler(static function (Throwable $exception): void {
    error_log('[contact.php] Uncaught exception: ' . $exception->getMessage() . ' in ' . $exception->getFile() . ':' . $exception->getLine());
    respond(500, false, 'Beim Senden ist ein Serverfehler aufgetreten.', ['error_code' => 'SERVER_ERROR']);
});

register_shutdown_function(static function (): void {
    $error = error_get_last();
    if ($error !== null && $GLOBALS['CONTACT_RESPONSE_SENT'] !== true) {
        error_log('[contact.php] Fatal shutdown error: ' . json_encode($error, JSON_UNESCAPED_UNICODE));
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
        }
        echo json_encode([
            'success' => false,
            'message' => 'Beim Senden ist ein Serverfehler aufgetreten.',
            'error_code' => 'SERVER_ERROR',
        ], JSON_UNESCAPED_UNICODE);
    }
});

final class SmtpException extends RuntimeException
{
    public string $errorCode;
    public string $failedStep;
    public string $lastResponse;
    public array $steps;

    public function __construct(string $errorCode, string $failedStep, string $lastResponse, string $message, array $steps = [])
    {
        parent::__construct($message);
        $this->errorCode = $errorCode;
        $this->failedStep = $failedStep;
        $this->lastResponse = $lastResponse;
        $this->steps = $steps;
    }
}

function sanitize_header_value(string $value): string
{
    return trim(str_replace(["\r", "\n"], ' ', $value));
}

function sanitize_text(string $value): string
{
    return trim(str_replace("\0", '', $value));
}

function get_client_ip(): string
{
    $xff = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if (is_string($xff) && $xff !== '') {
        $parts = explode(',', $xff);
        return trim($parts[0]);
    }
    return (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

function smtp_read($socket): string
{
    $response = '';
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (preg_match('/^\d{3}\s/', $line) === 1) {
            break;
        }
    }
    if ($response === '') {
        throw new RuntimeException('No SMTP response');
    }
    return $response;
}

function smtp_expect($socket, array $codes, string $errorCode, string $step): string
{
    $response = smtp_read($socket);
    $code = (int) substr($response, 0, 3);
    if (!in_array($code, $codes, true)) {
        throw new SmtpException($errorCode, $step, trim($response), 'Unexpected SMTP code ' . $code);
    }
    return $response;
}

function smtp_command($socket, string $command, array $codes, string $errorCode, string $step): string
{
    fwrite($socket, $command . "\r\n");
    return smtp_expect($socket, $codes, $errorCode, $step);
}

function smtp_send_mail(
    string $host,
    int $port,
    string $user,
    string $pass,
    string $from,
    string $to,
    string $subject,
    string $bodyText,
    string $replyTo,
    bool $debugMode = false
): array {
    $smtpDebug = [
        'attempted' => true,
        'transport' => 'ssl://' . $host . ':' . $port,
        'steps' => [],
        'failed_step' => null,
        'last_response' => null,
    ];

    $smtpDebug['steps'][] = 'connect';
    $socket = @stream_socket_client(
        'ssl://' . $host . ':' . $port,
        $errno,
        $errstr,
        15,
        STREAM_CLIENT_CONNECT
    );

    if (!is_resource($socket)) {
        throw new SmtpException('SMTP_CONNECTION_FAILED', 'connect', trim($errno . ' ' . $errstr), 'SMTP connect failed', $smtpDebug['steps']);
    }

    stream_set_timeout($socket, 15);

    try {
        $smtpDebug['steps'][] = 'greeting';
        $smtpDebug['last_response'] = trim(smtp_expect($socket, [220], 'SMTP_CONNECTION_FAILED', 'greeting'));

        $smtpDebug['steps'][] = 'EHLO';
        $smtpDebug['last_response'] = trim(smtp_command($socket, 'EHLO ' . gethostname(), [250], 'SMTP_CONNECTION_FAILED', 'EHLO'));

        $smtpDebug['steps'][] = 'AUTH LOGIN';
        $smtpDebug['last_response'] = trim(smtp_command($socket, 'AUTH LOGIN', [334], 'SMTP_AUTH_FAILED', 'AUTH LOGIN'));

        $smtpDebug['steps'][] = 'username sent';
        $smtpDebug['last_response'] = trim(smtp_command($socket, base64_encode($user), [334], 'SMTP_AUTH_FAILED', 'username sent'));

        $smtpDebug['steps'][] = 'password sent';
        $smtpDebug['last_response'] = trim(smtp_command($socket, base64_encode($pass), [235], 'SMTP_AUTH_FAILED', 'password sent'));

        $smtpDebug['steps'][] = 'MAIL FROM';
        $smtpDebug['last_response'] = trim(smtp_command($socket, 'MAIL FROM:<' . $from . '>', [250], 'SMTP_MAIL_FROM_FAILED', 'MAIL FROM'));

        $smtpDebug['steps'][] = 'RCPT TO';
        $smtpDebug['last_response'] = trim(smtp_command($socket, 'RCPT TO:<' . $to . '>', [250, 251], 'SMTP_RCPT_TO_FAILED', 'RCPT TO'));

        $smtpDebug['steps'][] = 'DATA';
        $smtpDebug['last_response'] = trim(smtp_command($socket, 'DATA', [354], 'SMTP_DATA_FAILED', 'DATA'));

        $headers = [
            'Date: ' . date(DATE_RFC2822),
            'From: ' . $from,
            'To: ' . $to,
            'Reply-To: ' . $replyTo,
            'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
        ];

        $normalizedBody = preg_replace("/\r\n|\r|\n/", "\r\n", $bodyText) ?? $bodyText;
        $safeBody = preg_replace('/^\./m', '..', $normalizedBody) ?? $normalizedBody;

        $smtpDebug['steps'][] = 'message body';
        fwrite($socket, implode("\r\n", $headers) . "\r\n\r\n" . $safeBody . "\r\n.\r\n");
        $smtpDebug['last_response'] = trim(smtp_expect($socket, [250], 'SMTP_DATA_FAILED', 'message body'));

        $smtpDebug['steps'][] = 'QUIT';
        $smtpDebug['last_response'] = trim(smtp_command($socket, 'QUIT', [221], 'SMTP_CONNECTION_FAILED', 'QUIT'));

        return $smtpDebug;
    } catch (SmtpException $e) {
        $smtpDebug['failed_step'] = $e->failedStep;
        $smtpDebug['last_response'] = $e->lastResponse;
        throw new SmtpException($e->errorCode, $e->failedStep, $e->lastResponse, $e->getMessage(), $smtpDebug['steps']);
    } catch (Throwable $e) {
        $smtpDebug['failed_step'] = $smtpDebug['failed_step'] ?? 'unknown';
        $smtpDebug['last_response'] = $smtpDebug['last_response'] ?? 'unexpected_error';
        throw new SmtpException('SERVER_ERROR', (string) $smtpDebug['failed_step'], (string) $smtpDebug['last_response'], $e->getMessage(), $smtpDebug['steps']);
    } finally {
        fclose($socket);
    }
}

function check_rate_limit(string $ip, int $maxRequests = 5, int $windowSeconds = 600): bool
{
    $key = hash('sha256', $ip);
    $file = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'contact_rate_' . $key . '.json';
    $now = time();

    $timestamps = [];
    if (is_file($file)) {
        $raw = @file_get_contents($file);
        if (is_string($raw) && $raw !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                foreach ($decoded as $ts) {
                    if (is_int($ts) || ctype_digit((string) $ts)) {
                        $timestamps[] = (int) $ts;
                    }
                }
            }
        }
    }

    $fresh = [];
    foreach ($timestamps as $ts) {
        if (($now - $ts) < $windowSeconds) {
            $fresh[] = $ts;
        }
    }

    if (count($fresh) >= $maxRequests) {
        return false;
    }

    $fresh[] = $now;
    @file_put_contents($file, json_encode($fresh), LOCK_EX);
    return true;
}

$documentRoot = rtrim((string) ($_SERVER['DOCUMENT_ROOT'] ?? ''), DIRECTORY_SEPARATOR);
$configPaths = [
    __DIR__ . '/runtime-config.php',
    __DIR__ . '/.env',
    __DIR__ . '/../.env',
    $documentRoot !== '' ? $documentRoot . '/api/runtime-config.php' : '',
    $documentRoot !== '' ? $documentRoot . '/api/.env' : '',
    $documentRoot !== '' ? $documentRoot . '/.env' : '',
];
$configPaths = array_values(array_filter($configPaths, static fn($p) => $p !== ''));

$runtimeConfigPaths = [];
$envPaths = [];
foreach ($configPaths as $path) {
    if (str_ends_with($path, 'runtime-config.php')) {
        $runtimeConfigPaths[] = $path;
    } else {
        $envPaths[] = $path;
    }
}

[$runtimeConfigPath, $runtimeConfig] = loadRuntimeConfig($runtimeConfigPaths);
$GLOBALS['CONTACT_RUNTIME_CONFIG'] = $runtimeConfig;
$loadedEnvPath = loadEnvFile($envPaths);
$GLOBALS['CONTACT_ENV_FILE'] = $loadedEnvPath;

$requiredEnvKeys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'MAIL_TO', 'MAIL_SUBJECT'];
$envPresence = [];
$missingEnvKeys = [];
foreach ($requiredEnvKeys as $key) {
    $exists = configValue($key) !== null;
    $envPresence[$key] = $exists;
    if (!$exists) {
        $missingEnvKeys[] = $key;
    }
}

$debugMode = isset($_GET['debug']) && $_GET['debug'] === '1';
$requestMethod = (string) ($_SERVER['REQUEST_METHOD'] ?? '');
$baseDebug = [
    'method' => $requestMethod,
    'runtime_config_found' => $runtimeConfigPath !== null,
    'runtime_config_path' => $runtimeConfigPath,
    'env_file_found' => $loadedEnvPath !== null,
    'env_checked_paths' => $envPaths,
    'config' => $envPresence,
    'missing_env' => $missingEnvKeys,
    'stream_socket_client_available' => function_exists('stream_socket_client'),
    'openssl_available' => extension_loaded('openssl'),
];

if ($debugMode && $requestMethod === 'GET') {
    respond(200, true, 'Debug-Information', [
        'debug' => array_merge($baseDebug, [
            'php_version' => PHP_VERSION,
            'document_root' => (string) ($_SERVER['DOCUMENT_ROOT'] ?? ''),
            'current_dir' => __DIR__,
        ]),
    ]);
}

if ($requestMethod !== 'POST') {
    respond(405, false, 'Methode nicht erlaubt.', ['error_code' => 'METHOD_NOT_ALLOWED']);
}

$contentType = (string) ($_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '');
$rawBody = '';
$fieldsPresent = [
    'name' => false,
    'email' => false,
    'phone' => false,
    'company' => false,
    'subject' => false,
    'message' => false,
    'consent' => false,
];
$smtpSteps = [];
$smtpFailedStep = null;
$smtpLastResponse = null;
$runtimeConfigFound = $runtimeConfigPath !== null;
$smtpHost = null;
$smtpPort = null;
$smtpUser = null;
$smtpPass = null;
$mailFrom = null;
$mailTo = null;
$mailSubject = null;

try {
    if (!empty($missingEnvKeys)) {
        throw new RuntimeException('Server-Konfiguration unvollständig: ' . implode(', ', $missingEnvKeys));
    }

    $rawBody = (string) file_get_contents('php://input');
    if (trim($rawBody) === '') {
        respond(400, false, 'Leere Anfrage.', ['error_code' => 'INVALID_REQUEST']);
    }

    $data = json_decode($rawBody, true);
    if (!is_array($data)) {
        respond(400, false, 'Ungültige Anfrage.', ['error_code' => 'INVALID_REQUEST']);
    }

    if (($data['debug'] ?? false) === true) {
        $debugMode = true;
    }

    $fieldsPresent = [
        'name' => array_key_exists('name', $data),
        'email' => array_key_exists('email', $data),
        'phone' => array_key_exists('phone', $data),
        'company' => array_key_exists('company', $data),
        'subject' => array_key_exists('subject', $data) || array_key_exists('topic', $data) || array_key_exists('service', $data) || array_key_exists('type', $data),
        'message' => array_key_exists('message', $data),
        'consent' => array_key_exists('consent', $data),
    ];

    $honeypot = sanitize_text((string) ($data['_honey'] ?? $data['website'] ?? ''));
    if ($honeypot !== '') {
        respond(200, true, 'Ihre Anfrage wurde angenommen.');
    }

    $name = sanitize_header_value((string) ($data['name'] ?? ''));
    $email = sanitize_header_value((string) ($data['email'] ?? ''));
    $phone = sanitize_text((string) ($data['phone'] ?? ''));
    $company = sanitize_text((string) ($data['company'] ?? ''));
    $topic = sanitize_header_value((string) ($data['topic'] ?? $data['service'] ?? $data['subject'] ?? $data['type'] ?? ''));
    $message = sanitize_text((string) ($data['message'] ?? ''));
    $consent = (bool) ($data['consent'] ?? false);

    $errors = [];
    if ($name === '' || mb_strlen($name) < 2) {
        $errors['name'] = 'Bitte geben Sie einen gültigen Namen ein.';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    }
    if ($topic === '') {
        $errors['topic'] = 'Bitte wählen Sie ein Anliegen.';
    }
    if ($message === '' || mb_strlen($message) < 10) {
        $errors['message'] = 'Bitte geben Sie eine Nachricht mit mindestens 10 Zeichen ein.';
    }
    if (!$consent) {
        $errors['consent'] = 'Bitte bestätigen Sie die Datenschutzerklärung.';
    }
    if ($phone !== '' && preg_match('/^[\d\s+\-()]+$/', $phone) !== 1) {
        $errors['phone'] = 'Telefonnummer enthält ungültige Zeichen.';
    }
    if (!empty($errors)) {
        respond(422, false, 'Bitte prüfen Sie Ihre Eingaben.', ['error_code' => 'VALIDATION_ERROR', 'errors' => $errors]);
    }

    $ip = get_client_ip();
    if (!check_rate_limit($ip, 5, 600)) {
        respond(429, false, 'Zu viele Anfragen. Bitte versuchen Sie es in einigen Minuten erneut.', ['error_code' => 'RATE_LIMIT_EXCEEDED']);
    }

    $userAgent = sanitize_text((string) ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown'));
    $smtpHost = sanitize_header_value((string) configValue('SMTP_HOST', 'smtp.ionos.de'));
    $smtpPort = (int) ((string) configValue('SMTP_PORT', '465'));
    $smtpUser = (string) configValue('SMTP_USER', '');
    $smtpPass = (string) configValue('SMTP_PASS', '');
    $mailFrom = sanitize_header_value((string) configValue('MAIL_FROM', $smtpUser));
    $mailTo = sanitize_header_value((string) configValue('MAIL_TO', $smtpUser));
    $mailSubject = sanitize_header_value((string) configValue('MAIL_SUBJECT', 'Neue Anfrage über die Website'));

    $subjectSuffix = $topic !== '' ? ' - ' . $topic : '';
    $finalSubject = sanitize_header_value($mailSubject . $subjectSuffix);
    $replyTo = sanitize_header_value($email);

    $mailBody = "Neue Anfrage über die Website\n\n"
        . "Name: " . ($name !== '' ? $name : '-') . "\n"
        . "E-Mail: " . ($email !== '' ? $email : '-') . "\n"
        . "Telefon: " . ($phone !== '' ? $phone : '-') . "\n"
        . "Firma: " . ($company !== '' ? $company : '-') . "\n"
        . "Service: " . ($topic !== '' ? $topic : '-') . "\n\n"
        . "Nachricht:\n" . $message . "\n\n"
        . "Datum/Zeit: " . date('Y-m-d H:i:s T') . "\n"
        . "IP-Adresse: " . $ip . "\n"
        . "User-Agent: " . $userAgent . "\n";

    $smtpDebug = smtp_send_mail(
        $smtpHost,
        $smtpPort,
        $smtpUser,
        $smtpPass,
        $mailFrom,
        $mailTo,
        $finalSubject,
        $mailBody,
        $replyTo,
        $debugMode
    );
    $smtpSteps = $smtpDebug['steps'] ?? [];
    $smtpFailedStep = $smtpDebug['failed_step'] ?? null;
    $smtpLastResponse = $smtpDebug['last_response'] ?? null;

    $extra = [];
    if ($debugMode) {
        $extra['debug'] = array_merge($baseDebug, [
            'request' => [
                'content_type' => $contentType,
                'raw_body_length' => strlen($rawBody),
                'json_decoded' => true,
                'fields_present' => $fieldsPresent,
            ],
            'smtp' => $smtpDebug,
        ]);
    }
    respond(200, true, 'Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet.', $extra);
} catch (SmtpException $e) {
    $smtpSteps = $e->steps;
    $smtpFailedStep = $e->failedStep;
    $smtpLastResponse = $e->lastResponse;

    $response = [
        'success' => false,
        'message' => 'Beim Senden ist ein Serverfehler aufgetreten.',
        'error_code' => $e->errorCode,
    ];
    if ($debugMode) {
        $response['debug'] = [
            'exception_class' => get_class($e),
            'exception_message' => $e->getMessage(),
            'exception_file' => $e->getFile(),
            'exception_line' => $e->getLine(),
            'smtp_steps' => $smtpSteps,
            'smtp_failed_step' => $smtpFailedStep,
            'smtp_last_response' => $smtpLastResponse,
            'runtime_config_found' => $runtimeConfigFound,
            'config_available' => [
                'SMTP_HOST' => !empty($smtpHost),
                'SMTP_PORT' => !empty($smtpPort),
                'SMTP_USER' => !empty($smtpUser),
                'SMTP_PASS' => !empty($smtpPass),
                'MAIL_FROM' => !empty($mailFrom),
                'MAIL_TO' => !empty($mailTo),
                'MAIL_SUBJECT' => !empty($mailSubject),
            ],
            'request' => [
                'content_type' => $contentType,
                'raw_body_length' => strlen($rawBody),
                'json_decoded' => true,
                'fields_present' => $fieldsPresent,
            ],
        ];
    }
    error_log('[contact.php] SMTP send failed [' . $e->errorCode . '][' . $e->failedStep . ']: ' . $e->lastResponse);
    http_response_code(500);
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
} catch (Throwable $e) {
    $response = [
        'success' => false,
        'message' => 'Beim Senden ist ein Serverfehler aufgetreten.',
        'error_code' => 'SERVER_ERROR',
    ];
    if ($debugMode) {
        $response['debug'] = [
            'exception_class' => get_class($e),
            'exception_message' => $e->getMessage(),
            'exception_file' => $e->getFile(),
            'exception_line' => $e->getLine(),
            'smtp_steps' => $smtpSteps ?? [],
            'smtp_failed_step' => $smtpFailedStep ?? null,
            'smtp_last_response' => $smtpLastResponse ?? null,
            'runtime_config_found' => $runtimeConfigFound ?? null,
            'config_available' => [
                'SMTP_HOST' => !empty($smtpHost ?? null),
                'SMTP_PORT' => !empty($smtpPort ?? null),
                'SMTP_USER' => !empty($smtpUser ?? null),
                'SMTP_PASS' => !empty($smtpPass ?? null),
                'MAIL_FROM' => !empty($mailFrom ?? null),
                'MAIL_TO' => !empty($mailTo ?? null),
                'MAIL_SUBJECT' => !empty($mailSubject ?? null),
            ],
            'request' => [
                'content_type' => $contentType,
                'raw_body_length' => strlen($rawBody),
                'json_decoded' => is_array(json_decode($rawBody, true)),
                'fields_present' => $fieldsPresent,
            ],
        ];
    }
    error_log('[contact.php] Unexpected send error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
