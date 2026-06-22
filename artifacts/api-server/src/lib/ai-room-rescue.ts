import { GoogleGenAI, Modality } from "@google/genai";
import { logger } from "./logger";
import {
  fetchImageAsBase64,
  type SupportedMediaType,
} from "./analyse-photos";
import { ObjectStorageService } from "./objectStorage";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_LENSFLOW_API_KEY ?? process.env.GEMINI_API_KEY });
const objectStorageService = new ObjectStorageService();

const RESCUE_MODEL = "gemini-2.0-flash-exp";

export type RoomRescueMode = "declutter" | "staging";

/**
 * DECLUTTER: remove clutter, tidy the space, make it look clean and presentable.
 * Critical compliance rule: never hide structural defects (mould, cracks, water damage).
 */
const DECLUTTER_PROMPT = `You are a professional real estate photo editor specialising in virtual decluttering.
Transform this room photo to look clean, tidy and market-ready.

REMOVE OR TIDY:
- Loose clothing, towels, shoes, bags and personal accessories
- Rubbish, tissue boxes, water bottles, plastic bags and general waste
- Cluttered benchtops, overcrowded shelves, excess toys and scattered household items
- Messy, unmade or dishevelled bedding — replace with a neatly made bed if a bed is present
- Personal photos, documents, papers and mail
- Food packaging, dirty dishes and kitchen mess

KEEP EXACTLY AS-IS — NEVER ALTER:
- All fixed property features: walls, floors, ceilings, windows, doors, architraves
- All permanent fixtures: kitchen cabinets, benchtops, appliances, bathroom fittings, light fittings, skirting boards
- All structural features: room size, proportions, layout and all spatial relationships
- Mould, cracks, water damage, stains, peeling paint, damp patches, or any structural defect — you MUST NOT remove, hide, retouch or obscure any defect that could mislead a buyer
- The actual view through windows (outdoor scene, neighbouring buildings, trees, sky)
- Furniture that is a permanent fixture or part of the property

Return ONLY the transformed photograph at exactly the same composition, angle and aspect ratio.
No text, watermarks, borders or overlays.`;

/**
 * VIRTUAL STAGING: add tasteful contemporary furniture to an empty or bare room.
 * Critical compliance rule: never alter existing permanent features or hide any defect.
 */
const STAGING_PROMPT = `You are a professional real estate photo editor specialising in virtual staging.
This room is empty or sparsely furnished. Add tasteful, contemporary furniture and styling.

ADD (appropriate to the room type):
- Bedroom: bed frame, mattress, clean neutral bedding, bedside tables, bedside lamps, styled pillows
- Living room: sofa, coffee table, side tables, floor lamp, rug, artwork or prints on walls
- Dining room: dining table and matching chairs, pendant light, centrepiece, artwork
- Study / office: desk, chair, shelving with books, desk lamp
- Decorative accessories: plants, cushions, throws, vases, framed artwork — styled to a premium lifestyle

KEEP EXACTLY AS-IS — NEVER ALTER:
- All fixed features: walls, floors, ceilings, windows, doors, architraves, skirting boards
- All permanent fixtures: light fittings, power points, radiators, built-in wardrobes, kitchen fittings, bathroom fittings
- Room size, proportions, ceiling height, spatial relationships and layout
- The actual outdoor scene visible through windows
- Mould, cracks, water damage, stains, peeling paint, damp patches, or any structural defect — you MUST NOT remove, hide, retouch or obscure any defect that could mislead a buyer

Ensure all added furniture fits naturally within the existing room dimensions and perspective.
Return ONLY the staged photograph at exactly the same composition, angle and aspect ratio.
No text, watermarks, borders or overlays.`;

function getPrompt(mode: RoomRescueMode): string {
  return mode === "staging" ? STAGING_PROMPT : DECLUTTER_PROMPT;
}

async function rescueOne(
  data: string,
  mediaType: SupportedMediaType,
  mode: RoomRescueMode,
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const response = await ai.models.generateContent({
    model: RESCUE_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: mediaType, data } },
          { text: getPrompt(mode) },
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

async function uploadRescued(buffer: Buffer, mimeType: string): Promise<string> {
  const uploadURL = await objectStorageService.getObjectEntityUploadURL();
  const putRes = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    body: new Uint8Array(buffer),
  });
  if (!putRes.ok) {
    throw new Error(`Failed to upload room rescue image: ${putRes.status}`);
  }
  const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
  const domain = (process.env.REPLIT_DOMAINS ?? "").split(",")[0]?.trim();
  return domain
    ? `https://${domain}/api/storage${objectPath}`
    : `http://localhost:80/api/storage${objectPath}`;
}

/**
 * AI Room Rescue — compliance-safe declutter or virtual staging.
 *
 * For each original photo, applies the selected mode transformation and stores
 * the result separately (originals are NEVER overwritten for compliance).
 * Falls back to the original URL for any image that fails so the pipeline
 * continues gracefully even when Gemini is unavailable.
 *
 * Mode "declutter": removes clutter, tidies the space.
 * Mode "staging": adds furniture and styling to empty/bare rooms.
 *
 * COMPLIANCE: neither prompt removes structural defects, mould, cracks or
 * any permanent damage — the property is always represented truthfully.
 */
export async function rescuePropertyPhotos(
  imageUrls: string[],
  mode: RoomRescueMode,
): Promise<{ rescued: string[]; rescuedCount: number }> {
const MAX_RESCUE = 12;
  const toRescue = imageUrls.slice(0, MAX_RESCUE);
  const passthrough = imageUrls.slice(MAX_RESCUE);
  const rescued: string[] = [];
  let rescuedCount = 0;

  for (const url of toRescue) {
    try {
      const fetched = await fetchImageAsBase64(url);
      if (!fetched) {
        rescued.push(url);
        continue;
      }
      const result = await rescueOne(fetched.data, fetched.mediaType, mode);
      if (!result) {
        logger.warn({ url, mode }, "AI Room Rescue: Gemini returned no image — using original");
        rescued.push(url);
        continue;
      }
      const publicUrl = await uploadRescued(result.buffer, result.mimeType);
      rescued.push(publicUrl);
      rescuedCount += 1;
    } catch (err) {
      logger.warn({ err, url, mode }, "AI Room Rescue: transformation failed — using original");
      rescued.push(url);
    }
  }

  for (const url of passthrough) rescued.push(url);

  logger.info(
    { total: imageUrls.length, rescuedCount, mode },
    "AI Room Rescue complete",
  );
  return { rescued, rescuedCount };
}
