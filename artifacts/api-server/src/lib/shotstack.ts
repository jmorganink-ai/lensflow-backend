import { logger } from "./logger";

const MUSIC_TRACK_URLS: Record<string, string> = {
  uplifting: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3",
  cinematic: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/berlin.mp3",
  calm:      "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/berlin.mp3",
  corporate: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3",
  luxury:    "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/berlin.mp3",
  summer:    "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3",
  country:   "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/berlin.mp3",
  urban:     "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3",
};

function getShotstackConfig(): { apiKey: string; baseUrl: string } {
  const prodKey = (process.env.SHOTSTACK_PROD_API_KEY ?? process.env.SHOTSTACK_PRODUCTION_API_KEY)?.trim();
  const sandboxKey = (process.env.SHOTSTACK_API_KEY ?? process.env.SHOTSTACK_SANDBOX_API_KEY)?.trim();
  if (prodKey) return { apiKey: prodKey, baseUrl: "https://api.shotstack.io/edit/v1" };
  if (sandboxKey) {
    logger.warn("Using Shotstack sandbox key — set SHOTSTACK_PROD_API_KEY for production renders");
    return { apiKey: sandboxKey, baseUrl: "https://api.shotstack.io/edit/stage" };
  }
  throw new Error("No Shotstack API key set (SHOTSTACK_PROD_API_KEY or SHOTSTACK_API_KEY)");
}

function colourClip(colour: string, start: number, length: number, opacity?: number) {
  return {
    asset: { type: "shape", shape: "rectangle", fill: { color: colour } },
    start,
    length,
    ...(opacity !== undefined ? { opacity } : {}),
  };
}

async function pollUntilDone(
  renderId: string,
  apiKey: string,
  baseUrl: string,
  label: string,
): Promise<string> {
  logger.info({ renderId }, `${label} — waiting 30s before first poll`);
  await new Promise((r) => setTimeout(r, 30_000));

  const POLL_INTERVAL_MS = 10_000;
  const MAX_ATTEMPTS = 60;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    const statusRes = await fetch(`${baseUrl}/render/${renderId}`, {
      headers: { "x-api-key": apiKey },
    });
    if (!statusRes.ok) {
      logger.warn({ attempt, httpStatus: statusRes.status }, `${label} poll failed — retrying`);
      continue;
    }
    const statusData = (await statusRes.json()) as {
      success: boolean;
      response?: { status: string; url?: string };
    };
    const status = statusData.response?.status;
    logger.info({ renderId, status, attempt }, `${label} poll`);
    if (status === "done") {
      const videoUrl = statusData.response?.url;
      if (!videoUrl) throw new Error(`${label} done but no url returned`);
      logger.info({ renderId, videoUrl }, `${label} complete`);
      return videoUrl;
    }
    if (status === "failed") throw new Error(`${label} render failed (id=${renderId})`);
  }
  throw new Error(`${label} timed out after ${MAX_ATTEMPTS} polls (render_id=${renderId})`);
}

export interface ShotstackResult {
  videoUrl: string;
  renderId: string;
}

/**
 * Premium real estate presenter video:
 * - Cinematic opener: property title full-screen with dramatic fade-in (0–6s)
 * - Property photos: fast-cycling full-bleed background with energetic Ken Burns + slide effects
 * - AI presenter: large and prominent (65% scale), bottom-center, clearly visible
 * - Warm gold vignette overlay — depth without muddiness
 * - Animated lower thirds and callout text throughout
 * - Subtle music bed (voice stays front-and-centre)
 * - LensFlow brand mark — top-right, persistent
 */
export async function composePresenterVideo(
  presenterVideoUrl: string,
  propertyTitle?: string | null,
  listingUrl?: string | null,
  propertyImages?: string[] | null,
  musicTrack?: string | null,
  voiceName?: string | null,
  testMode = false,
): Promise<ShotstackResult> {
  const { apiKey, baseUrl } = getShotstackConfig();

  const subtitle = propertyTitle ?? "Premium Property Listing";
  const domain = listingUrl
    ? (() => { try { return new URL(listingUrl).hostname.replace("www.", ""); } catch { return "domain.com.au"; } })()
    : "domain.com.au";

  const presenterLabel = voiceName
    ? voiceName.charAt(0).toUpperCase() + voiceName.slice(1).toLowerCase()
    : "LensFlow AI";

  const images = (propertyImages ?? []).filter(Boolean);
  const hasPhotos = images.length > 0;

  // testMode: cheap 10s SD render for pipeline validation under low credits (~0.15 credits)
  const PHOTO_DURATION = testMode ? 5 : 5;
  const TOTAL_DURATION = testMode ? 10 : 65;

  logger.info(
    { presenterVideoUrl, subtitle, photoCount: images.length, presenterLabel, env: process.env.SHOTSTACK_PROD_API_KEY ? "production" : "sandbox" },
    "Submitting Shotstack render — premium layout",
  );

  // ── Photo track: full-bleed background, fast cycling, alternating effects ──
  const PHOTO_EFFECTS = ["zoomIn", "zoomOut", "slideLeft", "slideRight", "zoomIn", "zoomOut"];
  const PHOTO_TRANSITIONS_IN = ["fade", "wipeLeft", "wipeRight", "slideLeft", "slideRight", "fade"];

  const buildPhotoTrack = () => {
    if (!hasPhotos) return { clips: [colourClip("#0d1117", 0, TOTAL_DURATION)] };

    const clips: object[] = [];
    let t = 0;
    let idx = 0;
    while (t < TOTAL_DURATION) {
      const src = images[idx % images.length];
      const dur = Math.min(PHOTO_DURATION, TOTAL_DURATION - t);
      clips.push({
        asset: { type: "image", src },
        start: t,
        length: dur,
        fit: "cover",
        scale: 1,
        effect: PHOTO_EFFECTS[idx % PHOTO_EFFECTS.length],
        transition: {
          in: idx === 0 ? "fade" : PHOTO_TRANSITIONS_IN[idx % PHOTO_TRANSITIONS_IN.length],
          out: "fadeSlow",
        },
      });
      t += dur;
      idx++;
    }
    return { clips };
  };

  // ── Vignette: warm-dark overlay so presenter pops, but photos still vibrant ──
  const vignetteTrack = hasPhotos
    ? { clips: [colourClip("#0d0a05", 0, TOTAL_DURATION, 0.45)] }
    : null;

  // ── Presenter: large and prominent, bottom-centre ──
  const presenterClip = {
    asset: { type: "video", src: presenterVideoUrl, volume: 1 },
    start: 0,
    length: TOTAL_DURATION,
    fit: "contain",
    scale: hasPhotos ? 0.65 : 1.0,
    position: hasPhotos ? "bottomCenter" : "center",
    offset: hasPhotos ? { x: 0, y: 0.06 } : undefined,
    transition: { in: "fade" },
  };

  // ── Opening title card: property name, bold, centre-stage (1–7s) ──
  const openingTitle = {
    asset: {
      type: "title",
      text: subtitle,
      style: "future",
      color: "#FFFFFF",
      size: "large",
    },
    start: 1,
    length: 6,
    position: "center",
    offset: { x: 0, y: 0.2 },
    transition: { in: "fade", out: "fade" },
  };

  // ── Presenter name badge: slides in at 8s, stays visible ──
  const presenterBadge = {
    asset: {
      type: "title",
      text: `PRESENTED BY  ${presenterLabel.toUpperCase()}`,
      style: "minimal",
      color: "#C9962A",
      size: "x-small",
    },
    start: 8,
    length: TOTAL_DURATION - 8,
    position: "bottomCenter",
    offset: { x: 0, y: -0.03 },
    transition: { in: "slideUp" },
  };

  // ── Mid-video callout: domain branding slides in at 15s ──
  const midCallout = {
    asset: {
      type: "title",
      text: `lensflow.com.au  ·  ${domain}`,
      style: "minimal",
      color: "#F5E6C8",
      size: "x-small",
    },
    start: 15,
    length: TOTAL_DURATION - 15,
    position: "topRight",
    offset: { x: -0.02, y: -0.04 },
    transition: { in: "fade" },
  };

  // ── Closing CTA: last 8 seconds ──
  const closingCta = {
    asset: {
      type: "title",
      text: "Book Your Inspection Today",
      style: "future",
      color: "#C9962A",
      size: "medium",
    },
    start: TOTAL_DURATION - 8,
    length: 7,
    position: "center",
    offset: { x: 0, y: 0.22 },
    transition: { in: "fade", out: "fade" },
  };

  const tracks = [
    buildPhotoTrack(),
    ...(vignetteTrack ? [vignetteTrack] : []),
    { clips: [presenterClip] },
    { clips: [openingTitle] },
    { clips: [presenterBadge] },
    { clips: [midCallout] },
    { clips: [closingCta] },
  ];

  const musicUrl = musicTrack ? MUSIC_TRACK_URLS[musicTrack] : MUSIC_TRACK_URLS["uplifting"];
  const soundtrack = { src: musicUrl, effect: "fadeInFadeOut", volume: 0.12 };

  const renderRes = await fetch(`${baseUrl}/render`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      timeline: { background: "#0d1117", soundtrack, tracks },
      output: { format: "mp4", resolution: testMode ? "sd" : "hd", fps: 25 },
    }),
  });

  if (!renderRes.ok) {
    const text = await renderRes.text();
    throw new Error(`Shotstack render submit failed (${renderRes.status}): ${text}`);
  }

  const renderData = (await renderRes.json()) as {
    success: boolean;
    response?: { id: string };
    message?: string;
  };

  if (!renderData.success || !renderData.response?.id) {
    throw new Error(`Shotstack did not return a render id: ${JSON.stringify(renderData)}`);
  }

  const renderId = renderData.response.id;
  const videoUrl = await pollUntilDone(renderId, apiKey, baseUrl, "Shotstack presenter");
  return { videoUrl, renderId };
}

/**
 * Compose a selfie (self-recorded) job video.
 */
export async function composeSelfieVideo(
  agentVideoUrl: string,
  backgroundUrl?: string | null,
  narrationUrl?: string | null,
  musicTrack?: string | null,
  propertyTitle?: string | null,
  listingUrl?: string | null,
): Promise<ShotstackResult> {
  const { apiKey, baseUrl } = getShotstackConfig();

  const TOTAL_DURATION = 90;
  const subtitle = propertyTitle ?? "Property Listing";
  const domain = listingUrl
    ? (() => { try { return new URL(listingUrl).hostname.replace("www.", ""); } catch { return "lensflow.com.au"; } })()
    : "lensflow.com.au";

  const isVideoBackground = !!backgroundUrl && backgroundUrl.toLowerCase().includes(".mp4");

  logger.info(
    { agentVideoUrl, backgroundUrl: backgroundUrl ?? "(none)", narration: !!narrationUrl, musicTrack },
    "Composing selfie video via Shotstack",
  );

  const backgroundTrack = backgroundUrl
    ? { clips: [{ asset: isVideoBackground ? { type: "video", src: backgroundUrl, volume: 0 } : { type: "image", src: backgroundUrl }, start: 0, length: TOTAL_DURATION, fit: "cover", position: "center" }] }
    : { clips: [colourClip("#0d1117", 0, TOTAL_DURATION)] };

  const overlayTrack = { clips: [colourClip("#000000", 0, TOTAL_DURATION, 0.35)] };

  const agentTrack = { clips: [{ asset: { type: "video", src: agentVideoUrl, volume: 1 }, start: 0, length: TOTAL_DURATION, fit: "contain", scale: 0.75, position: "center", transition: { in: "fade", out: "fade" } }] };

  const narrationTrack = narrationUrl
    ? { clips: [{ asset: { type: "audio", src: narrationUrl, volume: 0.85 }, start: 0, length: TOTAL_DURATION }] }
    : null;

  const titleClip = { asset: { type: "title", text: subtitle, style: "future", color: "#F5E6C8", size: "medium" }, start: 1, length: 5, position: "bottomLeft", offset: { x: 0.04, y: 0.12 }, transition: { in: "slideRight", out: "fade" } };
  const watermarkClip = { asset: { type: "title", text: `lensflow.com.au  ·  ${domain}`, style: "minimal", color: "#C9962A", size: "x-small" }, start: 0, length: TOTAL_DURATION, position: "topRight", offset: { x: -0.02, y: -0.04 } };

  const musicUrl = musicTrack ? MUSIC_TRACK_URLS[musicTrack] : MUSIC_TRACK_URLS["uplifting"];
  const soundtrack = { src: musicUrl, effect: "fadeInFadeOut", volume: narrationUrl ? 0.12 : 0.35 };

  const tracks = [backgroundTrack, overlayTrack, agentTrack, ...(narrationTrack ? [narrationTrack] : []), { clips: [titleClip] }, { clips: [watermarkClip] }];

  const renderRes = await fetch(`${baseUrl}/render`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ timeline: { background: "#0d1117", soundtrack, tracks }, output: { format: "mp4", resolution: "hd", fps: 25 } }),
  });

  if (!renderRes.ok) throw new Error(`Shotstack selfie render submit failed (${renderRes.status}): ${await renderRes.text()}`);

  const renderData = (await renderRes.json()) as { success: boolean; response?: { id: string }; message?: string };
  if (!renderData.success || !renderData.response?.id) throw new Error(`Shotstack selfie did not return render id: ${JSON.stringify(renderData)}`);

  const renderId = renderData.response.id;
  const videoUrl = await pollUntilDone(renderId, apiKey, baseUrl, "Shotstack selfie");
  return { videoUrl, renderId };
}

/**
 * Compose a voice + photos video (no AI presenter).
 */
export async function composeVoicePhotosVideo(
  voiceoverUrl: string | null | undefined,
  propertyTitle?: string | null,
  listingUrl?: string | null,
  propertyImages?: string[] | null,
  musicTrack?: string | null,
): Promise<ShotstackResult> {
  const { apiKey, baseUrl } = getShotstackConfig();

  const subtitle = propertyTitle ?? "Premium Property Listing";
  const domain = listingUrl
    ? (() => { try { return new URL(listingUrl).hostname.replace("www.", ""); } catch { return "lensflow.com.au"; } })()
    : "lensflow.com.au";

  const images = (propertyImages ?? []).filter(Boolean);
  const hasPhotos = images.length > 0;
  const PHOTO_DURATION = 6;
  const TOTAL_DURATION = 90;

  logger.info({ voiceoverUrl, subtitle, photoCount: images.length }, "Composing voice-photos video via Shotstack");

  const buildPhotoTrack = () => {
    if (!hasPhotos) return { clips: [colourClip("#0d1117", 0, TOTAL_DURATION)] };
    const effects = ["zoomIn", "zoomOut", "slideLeft", "slideRight"];
    const clips: object[] = [];
    let t = 0; let idx = 0;
    while (t < TOTAL_DURATION) {
      const src = images[idx % images.length];
      const dur = Math.min(PHOTO_DURATION, TOTAL_DURATION - t);
      clips.push({ asset: { type: "image", src }, start: t, length: dur, fit: "cover", scale: 1, effect: effects[idx % effects.length], transition: { in: idx === 0 ? "fade" : "wipeLeft", out: "fadeSlow" } });
      t += dur; idx++;
    }
    return { clips };
  };

  const vignetteTrack = hasPhotos ? { clips: [colourClip("#0d0a05", 0, TOTAL_DURATION, 0.35)] } : null;
  const voiceoverTrack = voiceoverUrl ? { clips: [{ asset: { type: "audio", src: voiceoverUrl, volume: 1 }, start: 0, length: TOTAL_DURATION }] } : null;

  const titleClip = { asset: { type: "title", text: subtitle, style: "future", color: "#FFFFFF", size: "large" }, start: 1, length: 6, position: "center", offset: { x: 0, y: 0.1 }, transition: { in: "fade", out: "fade" } };
  const ctaClip = { asset: { type: "title", text: "Book Your Inspection Today", style: "future", color: "#C9962A", size: "medium" }, start: TOTAL_DURATION - 8, length: 7, position: "center", offset: { x: 0, y: 0.1 }, transition: { in: "fade", out: "fade" } };
  const watermarkClip = { asset: { type: "title", text: `lensflow.com.au  ·  ${domain}`, style: "minimal", color: "#C9962A", size: "x-small" }, start: 0, length: TOTAL_DURATION, position: "topRight", offset: { x: -0.02, y: -0.04 } };

  const musicUrl = musicTrack ? MUSIC_TRACK_URLS[musicTrack] : MUSIC_TRACK_URLS["uplifting"];
  const soundtrack = { src: musicUrl, effect: "fadeInFadeOut", volume: voiceoverUrl ? 0.12 : 0.45 };

  const tracks = [buildPhotoTrack(), ...(vignetteTrack ? [vignetteTrack] : []), ...(voiceoverTrack ? [voiceoverTrack] : []), { clips: [titleClip] }, { clips: [ctaClip] }, { clips: [watermarkClip] }];

  const renderRes = await fetch(`${baseUrl}/render`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ timeline: { background: "#0d1117", soundtrack, tracks }, output: { format: "mp4", resolution: "hd", fps: 25 } }),
  });

  if (!renderRes.ok) throw new Error(`Shotstack voice-photos render submit failed (${renderRes.status}): ${await renderRes.text()}`);

  const renderData = (await renderRes.json()) as { success: boolean; response?: { id: string }; message?: string };
  if (!renderData.success || !renderData.response?.id) throw new Error(`Shotstack voice-photos did not return render id: ${JSON.stringify(renderData)}`);

  const renderId = renderData.response.id;
  const videoUrl = await pollUntilDone(renderId, apiKey, baseUrl, "Shotstack voice-photos");
  return { videoUrl, renderId };
}
