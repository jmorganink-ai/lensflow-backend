import { logger } from "./logger";

/**
 * Google Street View Static API — fetches real street-level imagery for a property address.
 * Returns image URLs that can be passed directly to Shotstack as background scenes.
 *
 * Requires GOOGLE_MAPS_API_KEY secret.
 * Gracefully returns [] if no key is set — pipeline continues without street view shots.
 */

const BASE = "https://maps.googleapis.com/maps/api/streetview";

interface StreetViewOptions {
  /** Width x Height in pixels — 1600x900 gives widescreen cinematic ratio */
  size?: string;
  /** Camera pitch: positive = look up, negative = look down. 5–10 is natural eye level */
  pitch?: number;
  /** Field of view in degrees (0–120). Lower = more zoomed in. 80 is natural */
  fov?: number;
}

/**
 * Returns up to 3 Street View image URLs for the given address:
 * - Straight-on (heading 0)
 * - Slight left angle (heading 340)
 * - Slight right angle (heading 20)
 *
 * Each URL is a static JPEG served directly by Google — no SDK needed.
 */
export async function getStreetViewImages(
  address: string,
  options: StreetViewOptions = {},
): Promise<string[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();
  if (!apiKey) {
    logger.info({ address }, "GOOGLE_MAPS_API_KEY not set — skipping Street View");
    return [];
  }

  const { size = "1600x900", pitch = 8, fov = 80 } = options;

  // Three cinematic angles: straight-on, gentle left, gentle right
  const headings = [0, 340, 20];

  const urls: string[] = [];

  for (const heading of headings) {
    const params = new URLSearchParams({
      size,
      location: address,
      heading: String(heading),
      pitch: String(pitch),
      fov: String(fov),
      key: apiKey,
      source: "outdoor",       // prefer outdoor street photography over interior
      return_error_code: "true", // 404 if no imagery rather than a grey placeholder
    });

    const url = `${BASE}?${params.toString()}`;

    // Verify the image exists before adding it — Street View returns 404 for addresses
    // with no coverage rather than a placeholder when return_error_code=true
    try {
      const check = await fetch(url, { method: "HEAD" });
      if (check.ok) {
        urls.push(url);
      } else {
        logger.info({ address, heading, status: check.status }, "Street View: no coverage for this angle");
      }
    } catch (err) {
      logger.warn({ err, address, heading }, "Street View HEAD check failed — skipping angle");
    }
  }

  logger.info({ address, count: urls.length }, "Street View images fetched");
  return urls;
}
