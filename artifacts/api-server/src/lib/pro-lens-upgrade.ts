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
 * Pro Lens Upgrade prompt — professional real estate photography correction.
 *
 * Standard: portal-ready, vendor-safe, consistent across a full campaign.
 * NOT phone enhance (no over-cooking, no HDR halos, no artificial punch).
 * Think: a skilled retoucher in Lightroom applying calibrated, honest corrections.
 */
const PRO_LENS_PROMPT = `You are a professional real estate photography retoucher producing portal-ready listing images.
Your standard is the output of a skilled operator in Lightroom or Capture One — accurate, consistent and vendor-safe.
This is NOT phone enhancement. Do not over-cook, over-saturate or add artificial punch.

Apply the following corrections precisely and conservatively:

GEOMETRY
- Correct barrel and pincushion lens distortion so straight lines are genuinely straight
- Apply keystone / perspective correction: vertical lines (walls, door frames, window frames) must be true vertical
- Align horizontal lines (skirting boards, benchtops, ceilings) to true horizontal
- The room must feel like you are standing in it, not looking through a fisheye

EXPOSURE
- Set exposure so the room reads as naturally bright and inviting — not dark, not blown
- Lift underexposed shadows in corners and mid-tones to reveal detail without introducing noise
- Recover blown highlights in ceilings, walls and light sources; keep them bright but textured
- The result should look like the room photographed on a clear day with lights on — honest and clean

WHITE BALANCE & COLOUR
- Remove yellow/orange tungsten cast from artificial lighting
- Remove blue/grey cast from overcast exterior light
- Target a clean, neutral daylight white balance: whites are white, greys are grey
- Do not over-saturate or add warmth beyond what is accurate
- Walls, floors and surfaces should read their true colour

WINDOWS & NATURAL LIGHT
- Use HDR-style tone-mapping to balance the window exposure with the interior
- Windows should show real exterior detail (garden, sky, street) — not blown white rectangles
- The interior must remain naturally lit alongside visible windows — not artificially darkened to compensate
- The result must look like a single correctly-exposed image, not a composited interior/exterior blend

NOISE & TEXTURE
- Reduce luminance and colour noise (especially in shadow areas and dark corners)
- Preserve all surface texture: carpet pile, timber grain, plaster texture, tile grout, fabric weave
- Never smear surfaces to smooth noise — texture is proof the image is real

SHARPNESS & CLARITY
- Apply output sharpening calibrated for digital display (not print)
- Reveal architectural detail: cornices, joinery, grout lines, appliance surfaces
- Avoid edge halos, ringing or 'over-sharpened' artefacts
- Midtone clarity should enhance the three-dimensional feel of the room without looking HDR-processed

SKY & EXTERIOR LIGHT (if sky is visible through windows)
- If the sky is overexposed, recover natural blue tone and cloud detail
- Keep the sky looking like a real Australian sky — do not replace it with a dramatic or saturated version
- Exterior light falling into the room should feel natural and directional

OVERALL STANDARD
- Portal-ready: the image would be accepted without edit on realestate.com.au or Domain
- Vendor-safe: every correction is honest — nothing misleads a buyer about the actual property condition
- Campaign-consistent: if this is one of several property photos, apply the same calibration standard to each

DO NOT UNDER ANY CIRCUMSTANCES:
- Remove, hide, retouch, smooth over or obscure any physical defect, stain, crack, mould, water mark or imperfection
- Change the perceived size, height or proportions of any room
- Move, add or remove any furniture, object, fixture or fitting
- Replace, blur or substantially alter the view through windows beyond exposure recovery
- Replace or synthesise any sky visible through windows
- Make any structural alteration to walls, floors, ceilings, doors or openings
- Apply any creative filter, film grain simulation, vignette, colour grade or illustrative effect
- Make any correction so aggressive it no longer looks like a photograph

Return ONLY the corrected photograph at exactly the same composition, framing and aspect ratio as the input.
No text, watermarks, borders or overlays of any kind.`;

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
