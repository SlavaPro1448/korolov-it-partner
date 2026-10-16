// Umwandlung zwischen Twilio (μ-law, 8 kHz) und OpenAI Realtime Translation (PCM16 LE, 24 kHz).
const MULAW_BIAS = 0x84;
const MULAW_CLIP = 32635;

export function mulawToPcm16(byte) {
  const value = ~byte & 0xff;
  const sample = ((((value & 0x0f) << 3) + MULAW_BIAS) << ((value >> 4) & 0x07)) - MULAW_BIAS;
  return value & 0x80 ? -sample : sample;
}

export function pcm16ToMulaw(sample) {
  let pcm = Math.max(-32768, Math.min(32767, sample | 0));
  let sign = 0;
  if (pcm < 0) {
    pcm = -pcm;
    sign = 0x80;
  }
  pcm = Math.min(MULAW_CLIP, pcm) + MULAW_BIAS;
  let exponent = 7;
  for (let mask = 0x4000; (pcm & mask) === 0 && exponent > 0; mask >>= 1) exponent -= 1;
  return ~(sign | (exponent << 4) | ((pcm >> (exponent + 3)) & 0x0f)) & 0xff;
}

// 8 kHz -> 24 kHz, linear interpoliert
export function twilioToRealtime(payloadBase64) {
  const mulaw = Buffer.from(payloadBase64, "base64");
  const out = Buffer.alloc(mulaw.length * 3 * 2);
  for (let i = 0; i < mulaw.length; i += 1) {
    const cur = mulawToPcm16(mulaw[i]);
    const next = i + 1 < mulaw.length ? mulawToPcm16(mulaw[i + 1]) : cur;
    for (let k = 0; k < 3; k += 1) {
      out.writeInt16LE(Math.round(cur + ((next - cur) * k) / 3), (i * 3 + k) * 2);
    }
  }
  return out.toString("base64");
}

// 24 kHz -> 8 kHz, je drei Samples gemittelt (einfacher Tiefpass gegen Aliasing)
export function realtimeToTwilio(deltaBase64) {
  const pcm = Buffer.from(deltaBase64, "base64");
  const frames = Math.floor(pcm.length / 6);
  const out = Buffer.alloc(frames);
  for (let i = 0; i < frames; i += 1) {
    const sum = pcm.readInt16LE(i * 6) + pcm.readInt16LE(i * 6 + 2) + pcm.readInt16LE(i * 6 + 4);
    out[i] = pcm16ToMulaw(Math.round(sum / 3));
  }
  return out.toString("base64");
}

// Deutsches Freizeichen: 425 Hz, 1 s Ton (die 4 s Pause entstehen durch das Sendeintervall)
export function ringbackTone() {
  const samples = 8000;
  const out = Buffer.alloc(samples);
  for (let i = 0; i < samples; i += 1) {
    out[i] = pcm16ToMulaw(Math.round(Math.sin((2 * Math.PI * 425 * i) / 8000) * 6000));
  }
  return out.toString("base64");
}

// Kurzer Doppelton (Gesprächspartner hat abgehoben): 2 × 120 ms bei 880 Hz
export function connectedTone() {
  const beep = 960,
    gap = 480;
  const out = Buffer.alloc(beep * 2 + gap, 0xff);
  for (const start of [0, beep + gap]) {
    for (let i = 0; i < beep; i += 1) {
      out[start + i] = pcm16ToMulaw(Math.round(Math.sin((2 * Math.PI * 880 * i) / 8000) * 5000));
    }
  }
  return out.toString("base64");
}

// Leiser Wartehinweis für Anrufer, während der Inhaber zurückgerufen wird: zwei weiche Töne
// (C5, E5, je 300 ms mit Ein- und Ausblenden), danach Stille bis zum nächsten Intervall
export function holdTone() {
  const note = 2400;
  const fade = 400;
  const out = Buffer.alloc(note * 2 + 800, 0xff);
  [523.25, 659.25].forEach((freq, n) => {
    const start = n * (note + 800);
    for (let i = 0; i < note; i += 1) {
      const envelope = Math.min(1, i / fade, (note - i) / fade);
      out[start + i] = pcm16ToMulaw(Math.round(Math.sin((2 * Math.PI * freq * i) / 8000) * 3500 * envelope));
    }
  });
  return out.toString("base64");
}

// Leiser machen (z. B. das Original des Gesprächspartners unter der Übersetzung)
export function attenuateMulaw(payloadBase64, gain) {
  const mulaw = Buffer.from(payloadBase64, "base64");
  const out = Buffer.alloc(mulaw.length);
  for (let i = 0; i < mulaw.length; i += 1)
    out[i] = pcm16ToMulaw(Math.round(mulawToPcm16(mulaw[i]) * gain));
  return out.toString("base64");
}
