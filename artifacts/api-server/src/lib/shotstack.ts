import { logger } from "./logger";

// Premium royalty-free tracks — varied genres with distinct energy
const MUSIC_TRACK_URLS: Record<string, string> = {
  uplifting:  "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3",
  cinematic:  "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/berlin.mp3",
  calm:       "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/ambisax.mp3",
  corporate:  "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/ambisax.mp3",
  luxury:     "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/berlin.mp3",
  summer:     "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3",
  country:    "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/ambisax.mp3",
  urban:      "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3",
};

function getShotstackConfig(): { apiKey: string; baseUrl: string } {
  const prodKey = (process.env.SHOTSTACK_PROD_API_KEY ?? process.env.SHOTSTACK_PRODUCTION_API_KEY)?.trim();
  const sandboxKey = (process.env.SHOTSTACK_API_KEY ?? process.env.SHOTSTACK_SANDBOX_API_KEY)?.trim();
  if (prodKey) return { apiKey: prodKey, baseUrl: "https://api.shotstack.io/edit/v1" };
  if (sandboxKey) {
    logger.warn("Using Shotstack sandbox key — set SHOTSTACK_PROD_API_KEY for production renders");
    return { apiKey: sandboxKey, baseUrl: "https://api.shotstack.io/edit/v1" };
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
 * Premium real estate presenter video — cinematic broadcast quality:
 * - True 1080p output at 30fps
 * - Dramatic 4-second property title opener before presenter reveals
 * - Full-bleed property photos with cinematic Ken Burns + slide effects (6s per photo)
 * - AI presenter: large (82% scale), bottom-centre, enters at 4s with fade-in
 * - Vibrant photos — lighter vignette so property looks its best
 * - Professional lower-third presenter badge
 * - Animated callout text and closing CTA
 * - Music bed at presence-filling volume, fades in/out
 * - LensFlow brand watermark — top-right, persistent
 */
export async function composePresenterVideo(
  presenterVideoUrl: string,
  propertyTitle?: string | null,
  listingUrl?: string | null,
  propertyImages?: string[] | null,
  musicTrack?: string | null,
  voiceName?: string | null,
  testMode = false,
  highlights?: string[] | null,
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

  // testMode: cheap short SD render for pipeline validation
  const PHOTO_DURATION = testMode ? 5 : 6;
  const TOTAL_DURATION = testMode ? 10 : 65;

  // Presenter enters at 4s — after the opening title card has landed
  const PRESENTER_START = testMode ? 0 : 4;
  const PRESENTER_LENGTH = TOTAL_DURATION - PRESENTER_START;

  logger.info(
    { presenterVideoUrl, subtitle, photoCount: images.length, presenterLabel, env: process.env.SHOTSTACK_PROD_API_KEY ? "production" : "sandbox" },
    "Submitting Shotstack render — premium 1080p layout",
  );

  // ── Photo track: vibrant full-bleed, cinematic Ken Burns + directional slides ──
  const PHOTO_EFFECTS = ["zoomIn", "zoomOut", "slideLeft", "slideRight", "zoomIn", "slideLeft"];
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

  // ── Vignette: light touch — frames the presenter without killing photo vibrancy ──
  const vignetteTrack = hasPhotos
    ? { clips: [colourClip("#080500", 0, TOTAL_DURATION, 0.28)] }
    : null;

  // ── Presenter: large, bottom-centre, reveals at 4s after title opener ──
  const presenterClip = {
    asset: { type: "video", src: presenterVideoUrl, volume: 1 },
    start: PRESENTER_START,
    length: PRESENTER_LENGTH,
    fit: "contain",
    scale: hasPhotos ? 0.82 : 1.0,
    position: hasPhotos ? "bottom" : "center",
    offset: hasPhotos ? { x: 0, y: 0.12 } : undefined,
    transition: { in: "fade" },
  };

  // ── Opening title card: property address, full-screen impact (0–5s) ──
  const openingTitle = {
    asset: {
      type: "title",
      text: subtitle,
      style: "future",
      color: "#FFFFFF",
      size: "large",
    },
    start: 0.5,
    length: 5,
    position: "center",
    offset: { x: 0, y: 0.15 },
    transition: { in: "fade", out: "fade" },
  };

  // ── "Exclusive Listing" badge: appears at 1s, holds through opening (0–5s) ──
  const exclusiveBadge = {
    asset: {
      type: "title",
      text: "EXCLUSIVE LISTING",
      style: "minimal",
      color: "#C9962A",
      size: "x-small",
    },
    start: 1,
    length: 4,
    position: "center",
    offset: { x: 0, y: 0.28 },
    transition: { in: "fade", out: "fade" },
  };

  // ── Presenter name badge: lower-third, slides up at 7s ──
  const presenterBadge = TOTAL_DURATION > 9 ? {
    asset: {
      type: "title",
      text: `PRESENTED BY  ${presenterLabel.toUpperCase()}`,
      style: "minimal",
      color: "#C9962A",
      size: "x-small",
    },
    start: 7,
    length: TOTAL_DURATION - 7,
    position: "bottom",
    offset: { x: 0, y: -0.02 },
    transition: { in: "slideUp" },
  } : null;

  // ── Mid-video domain watermark (persistent top-right) ──
  const watermarkClip = {
    asset: {
      type: "title",
      text: `lensflow.com.au  ·  ${domain}`,
      style: "minimal",
      color: "#F5E6C8",
      size: "x-small",
    },
    start: 0,
    length: TOTAL_DURATION,
    position: "topRight",
    offset: { x: -0.02, y: -0.04 },
    transition: { in: "fade" },
  };

  // ── Property highlight captions: 3-5 elegant phrases timed to photo changes ──
  // Appear in upper-left, staggered every ~11s starting at 8s — feels like premium campaign cards
  const highlightClips: object[] = [];
  if (!testMode && highlights && highlights.length > 0) {
    const startTimes = [8, 19, 30, 41, 52];
    highlights.slice(0, 5).forEach((phrase, i) => {
      const start = startTimes[i] ?? 8 + i * 11;
      if (start + 4 < TOTAL_DURATION - 9) {
        highlightClips.push({
          asset: {
            type: "title",
            text: phrase,
            style: "minimal",
            color: "#FFFFFF",
            size: "small",
          },
          start,
          length: 4,
          position: "topLeft",
          offset: { x: 0.04, y: -0.12 },
          transition: { in: "fade", out: "fade" },
        });
      }
    });
  }

  // ── Closing CTA: last 8 seconds — bold, centred above presenter ──
  const closingCta = TOTAL_DURATION > 9 ? {
    asset: {
      type: "title",
      text: "Book Your Inspection Today",
      style: "future",
      color: "#C9962A",
      size: "medium",
    },
    start: Math.max(0, TOTAL_DURATION - 8),
    length: Math.min(7, TOTAL_DURATION),
    position: "center",
    offset: { x: 0, y: 0.3 },
    transition: { in: "fade", out: "fade" },
  } : null;

  const tracks = [
    buildPhotoTrack(),
    ...(vignetteTrack ? [vignetteTrack] : []),
    { clips: [presenterClip] },
    { clips: [openingTitle] },
    { clips: [exclusiveBadge] },
    ...(presenterBadge ? [{ clips: [presenterBadge] }] : []),
    { clips: [watermarkClip] },
    ...(highlightClips.length > 0 ? highlightClips.map(c => ({ clips: [c] })) : []),
    ...(closingCta ? [{ clips: [closingCta] }] : []),
  ];

  const musicUrl = musicTrack ? MUSIC_TRACK_URLS[musicTrack] : MUSIC_TRACK_URLS["uplifting"];
  // 0.18 volume: present enough to feel premium, voice still sits on top
  const soundtrack = { src: musicUrl, effect: "fadeInFadeOut", volume: 0.18 };

  const renderRes = await fetch(`${baseUrl}/render`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      timeline: { background: "#0d1117", soundtrack, tracks },
      // "1080" = true 1080p; "hd" is only 720p in Shotstack's scale; 30fps for broadcast smoothness
      output: { format: "mp4", resolution: testMode ? "sd" : "1080", fps: 30 },
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
 * Compose a selfie (self-recorded) job video — 1080p 30fps.
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

  const overlayTrack = { clips: [colourClip("#000000", 0, TOTAL_DURATION, 0.30)] };

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
    body: JSON.stringify({ timeline: { background: "#0d1117", soundtrack, tracks }, output: { format: "mp4", resolution: "1080", fps: 30 } }),
  });

  if (!renderRes.ok) throw new Error(`Shotstack selfie render submit failed (${renderRes.status}): ${await renderRes.text()}`);

  const renderData = (await renderRes.json()) as { success: boolean; response?: { id: string }; message?: string };
  if (!renderData.success || !renderData.response?.id) throw new Error(`Shotstack selfie did not return render id: ${JSON.stringify(renderData)}`);

  const renderId = renderData.response.id;
  const videoUrl = await pollUntilDone(renderId, apiKey, baseUrl, "Shotstack selfie");
  return { videoUrl, renderId };
}

/**
 * Compose a voice + photos video (no AI presenter) — 1080p 30fps.
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

  const vignetteTrack = hasPhotos ? { clips: [colourClip("#0d0a05", 0, TOTAL_DURATION, 0.28)] } : null;
  const voiceoverTrack = voiceoverUrl ? { clips: [{ asset: { type: "audio", src: voiceoverUrl, volume: 1 }, start: 0, length: TOTAL_DURATION }] } : null;

  const titleClip = { asset: { type: "title", text: subtitle, style: "future", color: "#FFFFFF", size: "large" }, start: 1, length: 6, position: "center", offset: { x: 0, y: 0.1 }, transition: { in: "fade", out: "fade" } };
  const ctaClip = { asset: { type: "title", text: "Book Your Inspection Today", style: "future", color: "#C9962A", size: "medium" }, start: TOTAL_DURATION - 8, length: 7, position: "center", offset: { x: 0, y: 0.1 }, transition: { in: "fade", out: "fade" } };
  const watermarkClip = { asset: { type: "title", text: `lensflow.com.au  ·  ${domain}`, style: "minimal", color: "#C9962A", size: "x-small" }, start: 0, length: TOTAL_DURATION, position: "topRight", offset: { x: -0.02, y: -0.04 } };

  const musicUrl = musicTrack ? MUSIC_TRACK_URLS[musicTrack] : MUSIC_TRACK_URLS["uplifting"];
  const soundtrack = { src: musicUrl, effect: "fadeInFadeOut", volume: voiceoverUrl ? 0.18 : 0.45 };

  const tracks = [buildPhotoTrack(), ...(vignetteTrack ? [vignetteTrack] : []), ...(voiceoverTrack ? [voiceoverTrack] : []), { clips: [titleClip] }, { clips: [ctaClip] }, { clips: [watermarkClip] }];

  const renderRes = await fetch(`${baseUrl}/render`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ timeline: { background: "#0d1117", soundtrack, tracks }, output: { format: "mp4", resolution: "1080", fps: 30 } }),
  });

  if (!renderRes.ok) throw new Error(`Shotstack voice-photos render submit failed (${renderRes.status}): ${await renderRes.text()}`);

  const renderData = (await renderRes.json()) as { success: boolean; response?: { id: string }; message?: string };
  if (!renderData.success || !renderData.response?.id) throw new Error(`Shotstack voice-photos did not return render id: ${JSON.stringify(renderData)}`);

  const renderId = renderData.response.id;
  const videoUrl = await pollUntilDone(renderId, apiKey, baseUrl, "Shotstack voice-photos");
  return { videoUrl, renderId };
}
