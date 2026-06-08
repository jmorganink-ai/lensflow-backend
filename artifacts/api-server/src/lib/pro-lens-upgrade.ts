import { GoogleGenAI, Modality } from "@google/genai";
import { logger } from "./logger";
import {
  fetchImageAsBase64,
  type SupportedMediaType,
} from "./analyse-photos";
import { ObjectStorageService } from "./objectStorage";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const objectStorageService = new ObjectStorageService();

const UPGRADE_MODEL = "gemini-2.5-flash-image";

/**
 * Pro Lens Upgrade prompt — photographic corrections only, no creative changes.
 * Goal: phone/listing photos → professional real estate marketing quality.
 * Explicitly forbidden from any content or structural alteration.
 */
const PRO_LENS_PROMPT = `You are a professional real estate photographer's post-processing specialist.
Apply these photographic corrections to this property image:

APPLY:
- Correct wide-angle lens distortion so walls appear genuinely straight and vertical
- Perspective correction: align vertical lines to true vertical, horizontal lines to true horizontal
- Optimise exposure: lift underexposed shadows, recover blown highlights without losing detail
- Balance colour temperature to a clean, neutral daylight white balance
- Reduce digital noise while fully preserving surface texture, grain and fine detail
- Apply natural sharpening that reveals material detail without halos or artefacts
- Improve dynamic range: recover window/exterior detail while keeping interiors well-lit
- Make interiors feel bright, clean and premium through accurate light rendering only

DO NOT under any circumstances:
- Remove, hide or retouch any physical defect, stain, crack or imperfection
- Change the perceived size or proportions of any room
- Move, add or remove any furniture, fixture, fitting or object
- Replace, blur or alter the view through windows
- Add a different sky or background
- Make any structural alteration to walls, floors, ceilings or openings
- Apply any creative filter, AI art style or illustrative effect

Return ONLY the corrected photograph at exactly the same composition, framing and aspect ratio.
No text, watermarks, borders or overlays.`;

async function upgradeOne(
  data: string,
  mediaType: SupportedMediaType,
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const response = await ai.models.generateContent({
    model: UPGRADE_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: mediaType, data } },
          { text: PRO_LENS_PROMPT },
        ],
      },
    ],
    config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find(
    (p: { inlineData?: { data?: string; mimeType?: string } }) =>
      p.inlineData?.data,
  );
  if (!imagePart?.inlineData?.data) return null;

  return {
    buffer: Buffer.from(imagePart.inlineData.data, "base64"),
    mimeType: imagePart.inlineData.mimeType || "image/jpeg",
  };
}

async function uploadUpgraded(buffer: Buffer, mimeType: string): Promise<string> {
  const uploadURL = await objectStorageService.getObjectEntityUploadURL();
  const putRes = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    body: new Uint8Array(buffer),
  });
  if (!putRes.ok) {
    throw new Error(`Failed to upload pro-lens image: ${putRes.status}`);
  }
  const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
  const domain = (process.env.REPLIT_DOMAINS ?? "").split(",")[0]?.trim();
  return domain
    ? `https://${domain}/api/storage${objectPath}`
    : `http://localhost:80/api/storage${objectPath}`;
}

/**
 * Pro Lens Upgrade for a set of property photos.
 * Applies photographic corrections (lens distortion, exposure, colour, noise,
 * sharpening, dynamic range, window detail) without any creative changes.
 *
 * Stores upgraded images separately from the originals.
 * Falls back to the original URL for any image that fails — the pipeline
 * always continues even when Gemini is unavailable.
 */
export async function upgradePropertyPhotos(
  imageUrls: string[],
): Promise<{ upgraded: string[]; upgradedCount: number }> {
  const MAX_UPGRADE = 8;
  const toUpgrade = imageUrls.slice(0, MAX_UPGRADE);
  const passthrough = imageUrls.slice(MAX_UPGRADE);
  const upgraded: string[] = [];
  let upgradedCount = 0;

  for (const url of toUpgrade) {
    try {
      const fetched = await fetchImageAsBase64(url);
      if (!fetched) {
        upgraded.push(url);
        continue;
      }
      const result = await upgradeOne(fetched.data, fetched.mediaType);
      if (!result) {
        logger.warn({ url }, "Pro Lens: Gemini returned no upgraded image — using original");
        upgraded.push(url);
        continue;
      }
      const publicUrl = await uploadUpgraded(result.buffer, result.mimeType);
      upgraded.push(publicUrl);
      upgradedCount += 1;
    } catch (err) {
      logger.warn({ err, url }, "Pro Lens: upgrade failed for image — using original");
      upgraded.push(url);
    }
  }

  for (const url of passthrough) upgraded.push(url);

  logger.info(
    { total: imageUrls.length, upgradedCount },
    "Pro Lens Upgrade complete",
  );
  return { upgraded, upgradedCount };
}
