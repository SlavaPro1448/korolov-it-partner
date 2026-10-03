import { handleVoiceWebhook } from "../server/voiceWebhookHandler.mjs";

export const config = {
  runtime: "nodejs",
};

// Web-Standard-Signatur statt (req, res): die Signaturprüfung braucht den
// unveränderten Request-Body.
export async function POST(request) {
  const rawBody = await request.text();
  try {
    const { status, body } = await handleVoiceWebhook({
      rawBody,
      signature: request.headers.get("elevenlabs-signature"),
    });
    return Response.json(body, { status });
  } catch (err) {
    console.error("[voice-webhook] unexpected:", err);
    return Response.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}
