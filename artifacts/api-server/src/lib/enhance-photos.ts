import { GoogleGenAI, Modality } from "@google/genai";
import { logger } from "./logger";
import {
  fetchImageAsBase64,
  type SupportedMediaType,
} from "./analyse-photos";
import { ObjectStorageService } from "./objectStorage";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const objectStorageService = new ObjectStorageService();

const ENHANCE_MODEL = "gemini-2.5-flash-image";

/**
 * Real-estate "AI Glow-up" prompt. Deliberately conservative: improve how the
 * existing space looks without misrepresenting the property (no added/removed
 * fixtures, no structural changes — important for advertising compliance).
 */
const ENHANCE_PROMPT = `You are a professional real estate photo editor. Enhance this property photo to look like a premium magazine listing while keeping it truthful and realistic. Apply these edits:
- Brighten and balance the exposure; lift shadows and recover highlights.
- Correct white balance to natural, neutral tones.
- Increase clarity and sharpness so surfaces and finishes look crisp.
- If the sky is dull, grey or overcast, replace it with a clear, natural blue sky with soft clouds.
- Make grass and greenery look healthy and vibrant.
- Remove small distracting clutter (stray cables, bins, minor mess) but DO NOT add, remove or move furniture, fixtures, walls, or any structural feature.
- Keep the room layout, proportions and architecture exactly as they are.

Return only the enhanced photograph at the same composition and aspect ratio. Do not add text, watermarks or borders.`;

/**
 * Enhance a single base64 image via Gemini image editing. Returns the enhanced
 * image bytes + mime type, or null if the model returned no image.
 */
async function enhanceOne(
  data: string,
  mediaType: SupportedMediaType,
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const response = await ai.models.generateContent({
    model: ENHANCE_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: mediaType, data } },
          { text: ENHANCE_PROMPT },
        ],
      },
    ],
    config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find(
    (p: { inlineData?: { data?: string; mimeType?: string } }) => p.inlineData?.data,
  );
  if (!imagePart?.inlineData?.data) return null;

  return {
    buffer: Buffer.from(imagePart.inlineData.data, "base64"),
    mimeType: imagePart.inlineData.mimeType || "image/png",
  };
}

/**
 * Upload an enhanced image buffer to object storage and return a fully-qualified
 * public URL (same shape the upload route produces, so the SSRF allowlist and
 * the /api/storage serving route both accept it).
 */
async function uploadEnhanced(buffer: Buffer, mimeType: string): Promise<string> {
  const uploadURL = await objectStorageService.getObjectEntityUploadURL();
  const putRes = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    body: new Uint8Array(buffer),
  });
  if (!putRes.ok) {
    throw new Error(`Failed to upload enhanced image: ${putRes.status}`);
  }
  const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
  const domain = (process.env.REPLIT_DOMAINS ?? "").split(",")[0]?.trim();
  return domain
    ? `https://${domain}/api/storage${objectPath}`
    : `http://localhost:80/api/storage${objectPath}`;
}

/**
 * AI "Glow-up" for a set of property photos. For each original URL, fetches the
 * image, enhances it with Gemini, stores the result, and returns the enhanced
 * URL. Falls back to the original URL for any image that fails so the pipeline
 * never breaks (graceful degradation).
 */
export async function enhancePropertyPhotos(
  imageUrls: string[],
): Promise<{ enhanced: string[]; enhancedCount: number }> {
  const MAX_ENHANCE = 10;
  const toEnhance = imageUrls.slice(0, MAX_ENHANCE);
  const passthrough = imageUrls.slice(MAX_ENHANCE);
  const enhanced: string[] = [];
  let enhancedCount = 0;

  for (const url of toEnhance) {
    try {
      const fetched = await fetchImageAsBase64(url);
      if (!fetched) {
        enhanced.push(url);
        continue;
      }
      const result = await enhanceOne(fetched.data, fetched.mediaType);
      if (!result) {
        logger.warn({ url }, "Gemini returned no enhanced image — using original");
        enhanced.push(url);
        continue;
      }
      const publicUrl = await uploadEnhanced(result.buffer, result.mimeType);
      enhanced.push(publicUrl);
      enhancedCount += 1;
    } catch (err) {
      logger.warn({ err, url }, "Photo enhancement failed — using original");
      enhanced.push(url);
    }
  }

  // Photos beyond the enhancement cap are carried through untouched so the
  // returned array always matches the input length (no downstream drops).
  for (const url of passthrough) enhanced.push(url);

  logger.info(
    { total: imageUrls.length, enhancedCount },
    "AI photo enhancement complete",
  );
  return { enhanced, enhancedCount };
}
