<?php
declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');

$GLOBALS['CONTACT_RESPONSE_SENT'] = false;
$GLOBALS['CONTACT_ENV_FILE'] = null;

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

function loadEnvFile(): ?string
{
    $candidates = [
        __DIR__ . '/../.env',
        __DIR__ . '/../../.env',
        dirname(__DIR__) . '/.env',
    ];

    $documentRoot = (string) ($_SERVER['DOCUMENT_ROOT'] ?? '');
    if ($documentRoot !== '') {
        $candidates[] = rtrim($documentRoot, DIRECTORY_SEPARATOR) . '/.env';
    }

    foreach ($candidates as $path) {
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

set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    error_log('[contact.php] PHP error: ' . $message . ' in ' . $file . ':' . $line . ' (' . $severity . ')');
    respond(500, false, 'Beim Senden ist ein Serverfehler aufgetreten.');
});

set_exception_handler(static function (Throwable $exception): void {
    error_log('[contact.php] Uncaught exception: ' . $exception->getMessage() . ' in ' . $exception->getFile() . ':' . $exception->getLine());
    respond(500, false, 'Beim Senden ist ein Serverfehler aufgetreten.');
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
        ], JSON_UNESCAPED_UNICODE);
    }
});

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

function smtp_expect($socket, array $codes): string
{
    $response = smtp_read($socket);
    $code = (int) substr($response, 0, 3);
    if (!in_array($code, $codes, true)) {
        throw new RuntimeException('Unexpected SMTP code ' . $code . ': ' . trim($response));
    }
    return $response;
}

function smtp_command($socket, string $command, array $codes): string
{
    fwrite($socket, $command . "\r\n");
    return smtp_expect($socket, $codes);
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
    string $replyTo
): void {
    $socket = @stream_socket_client(
        'ssl://' . $host . ':' . $port,
        $errno,
        $errstr,
        15,
        STREAM_CLIENT_CONNECT
    );

    if (!is_resource($socket)) {
        throw new RuntimeException('SMTP connect failed: ' . $errno . ' ' . $errstr);
    }

    stream_set_timeout($socket, 15);

    try {
        smtp_expect($socket, [220]);
        smtp_command($socket, 'EHLO ' . gethostname(), [250]);
        smtp_command($socket, 'AUTH LOGIN', [334]);
        smtp_command($socket, base64_encode($user), [334]);
        smtp_command($socket, base64_encode($pass), [235]);
        smtp_command($socket, 'MAIL FROM:<' . $from . '>', [250]);
        smtp_command($socket, 'RCPT TO:<' . $to . '>', [250, 251]);
        smtp_command($socket, 'DATA', [354]);

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

        fwrite($socket, implode("\r\n", $headers) . "\r\n\r\n" . $safeBody . "\r\n.\r\n");
        smtp_expect($socket, [250]);
        smtp_command($socket, 'QUIT', [221]);
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

$loadedEnvPath = loadEnvFile();
$GLOBALS['CONTACT_ENV_FILE'] = $loadedEnvPath;

$requiredEnvKeys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'MAIL_TO', 'MAIL_SUBJECT'];
$envPresence = [];
$missingEnvKeys = [];
foreach ($requiredEnvKeys as $key) {
    $exists = envValue($key) !== null;
    $envPresence[$key] = $exists;
    if (!$exists) {
        $missingEnvKeys[] = $key;
    }
}

$isDebugRequest = (($_GET['debug'] ?? '') === '1');
if ($isDebugRequest) {
    respond(200, true, 'Debug-Information', [
        'debug' => [
            'method' => (string) ($_SERVER['REQUEST_METHOD'] ?? ''),
            'php_version' => PHP_VERSION,
            'document_root' => (string) ($_SERVER['DOCUMENT_ROOT'] ?? ''),
            'current_dir' => __DIR__,
            'env_file_found' => $loadedEnvPath !== null,
            'env_file_path' => $loadedEnvPath,
            'env' => $envPresence,
            'missing_env' => $missingEnvKeys,
            'stream_socket_client_available' => function_exists('stream_socket_client'),
            'openssl_available' => extension_loaded('openssl'),
        ],
    ]);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, false, 'Methode nicht erlaubt.');
}

if (!empty($missingEnvKeys)) {
    error_log('[contact.php] Missing env configuration: ' . implode(', ', $missingEnvKeys));
    respond(500, false, 'Server-Konfiguration unvollständig.');
}

$rawBody = file_get_contents('php://input');
if (!is_string($rawBody) || trim($rawBody) === '') {
    respond(400, false, 'Leere Anfrage.');
}

$data = json_decode($rawBody, true);
if (!is_array($data)) {
    respond(400, false, 'Ungültige Anfrage.');
}

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
    respond(422, false, 'Bitte prüfen Sie Ihre Eingaben.', ['errors' => $errors]);
}

$ip = get_client_ip();
if (!check_rate_limit($ip, 5, 600)) {
    respond(429, false, 'Zu viele Anfragen. Bitte versuchen Sie es in einigen Minuten erneut.');
}

$userAgent = sanitize_text((string) ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown'));
$smtpHost = sanitize_header_value((string) envValue('SMTP_HOST', 'smtp.ionos.de'));
$smtpPort = (int) ((string) envValue('SMTP_PORT', '465'));
$smtpUser = (string) envValue('SMTP_USER', '');
$smtpPass = (string) envValue('SMTP_PASS', '');
$mailFrom = sanitize_header_value((string) envValue('MAIL_FROM', $smtpUser));
$mailTo = sanitize_header_value((string) envValue('MAIL_TO', $smtpUser));
$mailSubject = sanitize_header_value((string) envValue('MAIL_SUBJECT', 'Neue Anfrage über die Website'));

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

try {
    smtp_send_mail(
        $smtpHost,
        $smtpPort,
        $smtpUser,
        $smtpPass,
        $mailFrom,
        $mailTo,
        $finalSubject,
        $mailBody,
        $replyTo
    );
    respond(200, true, 'Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet.');
} catch (Throwable $e) {
    error_log('[contact.php] SMTP send failed: ' . $e->getMessage());
    respond(502, false, 'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
}
