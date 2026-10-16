// Access Token für das Twilio Voice SDK der iOS-App (JWT, HS256, ohne Twilio-SDK).
// Format: https://www.twilio.com/docs/iam/access-tokens
import crypto from "node:crypto";

const base64url = (value) =>
  Buffer.from(typeof value === "string" ? value : JSON.stringify(value)).toString("base64url");

export function createVoiceToken({
  accountSid,
  apiKey,
  apiSecret,
  appSid,
  identity,
  pushCredentialSid = "",
  ttlSeconds = 3600,
  now = Math.floor(Date.now() / 1000),
}) {
  const header = { alg: "HS256", typ: "JWT", cty: "twilio-fpa;v=1" };
  const payload = {
    jti: `${apiKey}-${now}`,
    iss: apiKey,
    sub: accountSid,
    iat: now,
    nbf: now,
    exp: now + ttlSeconds,
    grants: {
      identity,
      // Eingehend nur mit Push Credential (VoIP-Push von Apple über Twilio)
      voice: {
        outgoing: { application_sid: appSid },
        incoming: { allow: Boolean(pushCredentialSid) },
        ...(pushCredentialSid ? { push_credential_sid: pushCredentialSid } : {}),
      },
    },
  };
  const unsigned = `${base64url(header)}.${base64url(payload)}`;
  const signature = crypto.createHmac("sha256", apiSecret).update(unsigned).digest("base64url");
  return { token: `${unsigned}.${signature}`, expiresAt: payload.exp };
}
