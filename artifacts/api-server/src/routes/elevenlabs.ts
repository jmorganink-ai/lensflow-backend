import { Router, type IRouter } from "express";
import { ElevenLabsClient } from "elevenlabs";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function getClient(): ElevenLabsClient {
  return new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
}

// GET /api/elevenlabs/voices — list all voices in the user's account
router.get("/elevenlabs/voices", async (_req, res) => {
  try {
    const client = getClient();
    const response = await client.voices.getAll();
    const voices = (response.voices ?? []).map((v) => ({
      voice_id: v.voice_id,
      name: v.name ?? "Unnamed Voice",
      category: v.category ?? "generated",
      description: v.description ?? null,
      preview_url: v.preview_url ?? null,
      labels: v.labels ?? {},
    }));
    res.json(voices);
  } catch (err) {
    logger.error({ err }, "Failed to fetch ElevenLabs voices");
    res.status(500).json({ error: "Failed to fetch voices from ElevenLabs. Check your API key." });
  }
});

export default router;

// Re-export a helper for use in the jobs pipeline
export async function generateVoiceover(
  text: string,
  voiceId: string
): Promise<Buffer> {
  const client = getClient();
  const audioStream = await client.generate({
    voice: voiceId,
    model_id: "eleven_multilingual_v2",
    text,
  });

  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as ArrayBuffer));
  }
  return Buffer.concat(chunks);
}
