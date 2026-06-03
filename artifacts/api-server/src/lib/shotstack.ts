import { logger } from "./logger";

const MUSIC_TRACK_URLS: Record<string, string> = {
  uplifting: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/pegboard.mp3",
  cinematic: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/berlin.mp3",
  calm:      "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/morning.mp3",
  corporate: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3",
  // Extended library
  luxury:  "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/arcade.mp3",
  summer:  "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/daydreaming.mp3",
  country: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/slow.mp3",
  urban:   "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/chill.mp3",
};

// Use production key + endpoint when available, fall back to sandbox/staging
function getShotstackConfig(): { apiKey: string; baseUrl: string } {
  const prodKey = process.env.SHOTSTACK_PROD_API_KEY ?? process.env.SHOTSTACK_PRODUCTION_API_KEY;
  const sandboxKey = process.env.SHOTSTACK_API_KEY ?? process.env.SHOTSTACK_SANDBOX_API_KEY;

  if (prodKey) {
    return { apiKey: prodKey, baseUrl: "https://api.shotstack.io/v1" };
  }
  if (sandboxKey) {
    logger.warn("Using Shotstack sandbox/staging — set SHOTSTACK_PROD_API_KEY for production renders");
    return { apiKey: sandboxKey, baseUrl: "https://api.shotstack.io/stage/v1" };
  }
  throw new Error("No Shotstack API key set (SHOTSTACK_PROD_API_KEY or SHOTSTACK_API_KEY)");
}

export interface ShotstackResult {
  videoUrl: string;
  renderId: string;
}

/**
 * Build a professional property showcase video:
 * - Property photos as full-screen background slideshow with Ken Burns zoom
 * - AI presenter in bottom-right picture-in-picture
 * - Professional warm color grading on photos
 * - Branded title card and watermark
 */
export async function composePresenterVideo(
  presenterVideoUrl: string,
  propertyTitle?: string | null,
  listingUrl?: string | null,
  propertyImages?: string[] | null,
  musicTrack?: string | null,
): Promise<ShotstackResult> {
  const { apiKey, baseUrl: SHOTSTACK_API_BASE } = getShotstackConfig();

  const subtitle = propertyTitle ?? "Premium Property Listing";
  const domain = listingUrl
    ? (() => { try { return new URL(listingUrl).hostname.replace("www.", ""); } catch { return "lensflow.com.au"; } })()
    : "lensflow.com.au";

  const images = (propertyImages ?? []).filter(Boolean);
  const hasPhotos = images.length > 0;

  logger.info({ presenterVideoUrl, subtitle, photoCount: images.length, env: process.env.SHOTSTACK_PROD_API_KEY ? "production" : "sandbox" }, "Submitting Shotstack render job");

  // Photo slideshow duration — each photo shown for 8 seconds, looped if needed
  const PHOTO_DURATION = 8;
  const TOTAL_DURATION = 60; // Shotstack trims to actual presenter video length

  // Build photo background track — Ken Burns zoom effect on each image
  const buildPhotoTrack = () => {
    if (!hasPhotos) {
      return {
        clips: [
          {
            asset: { type: "colour", colour: "#0a0f1e" },
            start: 0,
            length: TOTAL_DURATION,
          },
        ],
      };
    }

    const clips = images.map((src, i) => ({
      asset: {
        type: "image",
        src,
      },
      start: i * PHOTO_DURATION,
      length: PHOTO_DURATION,
      fit: "cover",
      scale: 1,
      effect: i % 2 === 0 ? "zoomIn" : "zoomOut",
      filter: "contrast",
      opacity: 1,
      transition: {
        in: i === 0 ? "fade" : "fadeSlow",
        out: "fadeSlow",
      },
    }));

    // Loop photos if video is longer than photos * PHOTO_DURATION
    const totalPhotoDuration = images.length * PHOTO_DURATION;
    if (totalPhotoDuration < TOTAL_DURATION) {
      const extraLoops = Math.ceil((TOTAL_DURATION - totalPhotoDuration) / totalPhotoDuration);
      for (let loop = 0; loop < extraLoops; loop++) {
        images.forEach((src, i) => {
          const offset = totalPhotoDuration * (loop + 1);
          clips.push({
            asset: { type: "image", src },
            start: offset + i * PHOTO_DURATION,
            length: PHOTO_DURATION,
            fit: "cover",
            scale: 1,
            effect: i % 2 === 0 ? "zoomIn" : "zoomOut",
            filter: "contrast",
            opacity: 1,
            transition: { in: "fadeSlow", out: "fadeSlow" },
          });
        });
      }
    }

    return { clips };
  };

  // Dark gradient overlay over photos — helps text/presenter legibility
  const gradientOverlayTrack = hasPhotos
    ? {
        clips: [
          {
            asset: { type: "colour", colour: "#000000" },
            start: 0,
            length: TOTAL_DURATION,
            opacity: 0.35,
          },
        ],
      }
    : null;

  // Presenter video — bottom-right PiP when photos present, full-screen when no photos
  const presenterClip = hasPhotos
    ? {
        asset: {
          type: "video",
          src: presenterVideoUrl,
          volume: 1,
        },
        start: 0,
        length: TOTAL_DURATION,
        fit: "contain",
        scale: 0.32,
        position: "bottomRight",
        offset: { x: -0.02, y: 0.04 },
        transition: { in: "fade" },
      }
    : {
        asset: {
          type: "video",
          src: presenterVideoUrl,
          volume: 1,
        },
        start: 0,
        length: TOTAL_DURATION,
        fit: "contain",
        scale: 1,
      };

  // Property title card — lower third, fades in at 1s
  const titleClip = {
    asset: {
      type: "title",
      text: subtitle,
      style: "minimal",
      color: "#F5E6C8",
      size: "medium",
    },
    start: 1,
    length: 5,
    position: "bottomLeft",
    offset: { x: 0.04, y: hasPhotos ? 0.35 : 0.12 },
    transition: { in: "slideRight", out: "fadeOut" },
  };

  // LensFlow watermark — top-left, subtle
  const watermarkClip = {
    asset: {
      type: "title",
      text: `lensflow.com.au  ·  ${domain}`,
      style: "minimal",
      color: "#C9962A",
      size: "x-small",
    },
    start: 0,
    length: TOTAL_DURATION,
    position: "topLeft",
    offset: { x: 0.03, y: -0.04 },
  };

  const tracks = [
    buildPhotoTrack(),
    ...(gradientOverlayTrack ? [gradientOverlayTrack] : []),
    { clips: [presenterClip] },
    { clips: [titleClip] },
    { clips: [watermarkClip] },
  ];

  const musicUrl = musicTrack ? MUSIC_TRACK_URLS[musicTrack] : undefined;
  const soundtrack = musicUrl
    ? { src: musicUrl, effect: "fadeInFadeOut", volume: 0.4 }
    : undefined;

  const timeline = {
    background: "#0a0f1e",
    ...(soundtrack ? { soundtrack } : {}),
    tracks,
  };

  const renderRes = await fetch(`${SHOTSTACK_API_BASE}/render`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeline,
      output: {
        format: "mp4",
        resolution: "hd",
        fps: 25,
      },
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
  logger.info({ renderId }, "Shotstack render queued — polling for completion");

  const POLL_INTERVAL_MS = 6_000;
  const MAX_ATTEMPTS = 60;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const statusRes = await fetch(`${SHOTSTACK_API_BASE}/renders/${renderId}`, {
      headers: { "x-api-key": apiKey },
    });

    if (!statusRes.ok) {
      logger.warn({ attempt, status: statusRes.status }, "Shotstack poll failed — retrying");
      continue;
    }

    const statusData = (await statusRes.json()) as {
      success: boolean;
      response?: { status: string; url?: string };
    };

    const status = statusData.response?.status;
    logger.info({ renderId, status, attempt }, "Shotstack poll");

    if (status === "done") {
      const videoUrl = statusData.response?.url;
      if (!videoUrl) throw new Error("Shotstack done but no url returned");
      logger.info({ renderId, videoUrl }, "Shotstack render complete");
      return { videoUrl, renderId };
    }

    if (status === "failed") {
      throw new Error(`Shotstack render failed (id=${renderId})`);
    }
  }

  throw new Error(`Shotstack timed out after ${MAX_ATTEMPTS} polls (render_id=${renderId})`);
}

/**
 * Compose a selfie (self-recorded) job video:
 * - Virtual background image or clip fills the full frame
 * - Agent's self-recorded video as a centred picture-in-picture
 * - Optional ElevenLabs narration audio track
 * - Optional background music soundtrack
 * - Branded title card and watermark
 */
export async function composeSelfieVideo(
  agentVideoUrl: string,
  backgroundUrl?: string | null,
  narrationUrl?: string | null,
  musicTrack?: string | null,
  propertyTitle?: string | null,
  listingUrl?: string | null,
): Promise<ShotstackResult> {
  const { apiKey, baseUrl: SHOTSTACK_API_BASE } = getShotstackConfig();

  const TOTAL_DURATION = 90;
  const subtitle = propertyTitle ?? "Property Listing";
  const domain = listingUrl
    ? (() => { try { return new URL(listingUrl).hostname.replace("www.", ""); } catch { return "lensflow.com.au"; } })()
    : "lensflow.com.au";

  const isVideoBackground = !!backgroundUrl && backgroundUrl.toLowerCase().includes(".mp4");

  logger.info(
    { agentVideoUrl, backgroundUrl: backgroundUrl ?? "(none)", narration: !!narrationUrl, musicTrack, env: process.env.SHOTSTACK_PROD_API_KEY ? "production" : "sandbox" },
    "Composing selfie video via Shotstack",
  );

  const backgroundTrack = backgroundUrl
    ? {
        clips: [
          {
            asset: isVideoBackground
              ? { type: "video", src: backgroundUrl, volume: 0 }
              : { type: "image", src: backgroundUrl },
            start: 0,
            length: TOTAL_DURATION,
            fit: "cover",
            position: "center",
          },
        ],
      }
    : {
        clips: [
          {
            asset: { type: "colour", colour: "#0a0f1e" },
            start: 0,
            length: TOTAL_DURATION,
          },
        ],
      };

  const overlayTrack = {
    clips: [
      {
        asset: { type: "colour", colour: "#000000" },
        start: 0,
        length: TOTAL_DURATION,
        opacity: 0.4,
      },
    ],
  };

  const agentTrack = {
    clips: [
      {
        asset: { type: "video", src: agentVideoUrl, volume: 1 },
        start: 0,
        length: TOTAL_DURATION,
        fit: "contain",
        scale: 0.75,
        position: "center",
        transition: { in: "fade", out: "fade" },
      },
    ],
  };

  const narrationTrack = narrationUrl
    ? {
        clips: [
          {
            asset: { type: "audio", src: narrationUrl, volume: 0.85 },
            start: 0,
            length: TOTAL_DURATION,
          },
        ],
      }
    : null;

  const titleClip = {
    asset: {
      type: "title",
      text: subtitle,
      style: "minimal",
      color: "#F5E6C8",
      size: "medium",
    },
    start: 1,
    length: 5,
    position: "bottomLeft",
    offset: { x: 0.04, y: 0.12 },
    transition: { in: "slideRight", out: "fadeOut" },
  };

  const watermarkClip = {
    asset: {
      type: "title",
      text: `lensflow.com.au  ·  ${domain}`,
      style: "minimal",
      color: "#C9962A",
      size: "x-small",
    },
    start: 0,
    length: TOTAL_DURATION,
    position: "topLeft",
    offset: { x: 0.03, y: -0.04 },
  };

  const musicUrl = musicTrack ? MUSIC_TRACK_URLS[musicTrack] : undefined;
  const soundtrack = musicUrl
    ? { src: musicUrl, effect: "fadeInFadeOut", volume: narrationUrl ? 0.2 : 0.4 }
    : undefined;

  const tracks = [
    backgroundTrack,
    overlayTrack,
    agentTrack,
    ...(narrationTrack ? [narrationTrack] : []),
    { clips: [titleClip] },
    { clips: [watermarkClip] },
  ];

  const timeline = {
    background: "#0a0f1e",
    ...(soundtrack ? { soundtrack } : {}),
    tracks,
  };

  const renderRes = await fetch(`${SHOTSTACK_API_BASE}/render`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      timeline,
      output: { format: "mp4", resolution: "hd", fps: 25 },
    }),
  });

  if (!renderRes.ok) {
    const text = await renderRes.text();
    throw new Error(`Shotstack selfie render submit failed (${renderRes.status}): ${text}`);
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
  logger.info({ renderId }, "Shotstack selfie render queued — polling for completion");

  const POLL_INTERVAL_MS = 6_000;
  const MAX_ATTEMPTS = 60;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const statusRes = await fetch(`${SHOTSTACK_API_BASE}/renders/${renderId}`, {
      headers: { "x-api-key": apiKey },
    });

    if (!statusRes.ok) {
      logger.warn({ attempt, status: statusRes.status }, "Shotstack selfie poll failed — retrying");
      continue;
    }

    const statusData = (await statusRes.json()) as {
      success: boolean;
      response?: { status: string; url?: string };
    };

    const status = statusData.response?.status;
    logger.info({ renderId, status, attempt }, "Shotstack selfie poll");

    if (status === "done") {
      const videoUrl = statusData.response?.url;
      if (!videoUrl) throw new Error("Shotstack done but no url returned");
      logger.info({ renderId, videoUrl }, "Shotstack selfie render complete");
      return { videoUrl, renderId };
    }

    if (status === "failed") {
      throw new Error(`Shotstack selfie render failed (id=${renderId})`);
    }
  }

  throw new Error(`Shotstack selfie timed out after ${MAX_ATTEMPTS} polls (render_id=${renderId})`);
}

/**
 * Compose an Option B "voice + photos" video:
 * - Property photos as full-screen background slideshow with Ken Burns zoom
 * - ElevenLabs voiceover narration as an audio track (no HeyGen presenter)
 * - Branded title card and watermark
 * - Optional background music underneath the voiceover
 */
export async function composeVoicePhotosVideo(
  voiceoverUrl: string | null | undefined,
  propertyTitle?: string | null,
  listingUrl?: string | null,
  propertyImages?: string[] | null,
  musicTrack?: string | null,
): Promise<ShotstackResult> {
  const { apiKey, baseUrl: SHOTSTACK_API_BASE } = getShotstackConfig();

  const subtitle = propertyTitle ?? "Premium Property Listing";
  const domain = listingUrl
    ? (() => { try { return new URL(listingUrl).hostname.replace("www.", ""); } catch { return "lensflow.com.au"; } })()
    : "lensflow.com.au";

  const images = (propertyImages ?? []).filter(Boolean);
  const hasPhotos = images.length > 0;
  const PHOTO_DURATION = 8;
  const TOTAL_DURATION = 90;

  logger.info({ voiceoverUrl, subtitle, photoCount: images.length }, "Composing voice-photos video via Shotstack");

  const buildPhotoTrack = () => {
    if (!hasPhotos) {
      return {
        clips: [
          { asset: { type: "colour", colour: "#0a0f1e" }, start: 0, length: TOTAL_DURATION },
        ],
      };
    }
    const clips = images.map((src, i) => ({
      asset: { type: "image", src },
      start: i * PHOTO_DURATION,
      length: PHOTO_DURATION,
      fit: "cover",
      scale: 1,
      effect: i % 2 === 0 ? "zoomIn" : "zoomOut",
      filter: "contrast",
      opacity: 1,
      transition: { in: i === 0 ? "fade" : "fadeSlow", out: "fadeSlow" },
    }));
    const totalPhotoDuration = images.length * PHOTO_DURATION;
    if (totalPhotoDuration < TOTAL_DURATION) {
      const extraLoops = Math.ceil((TOTAL_DURATION - totalPhotoDuration) / totalPhotoDuration);
      for (let loop = 0; loop < extraLoops; loop++) {
        images.forEach((src, i) => {
          clips.push({
            asset: { type: "image", src },
            start: totalPhotoDuration * (loop + 1) + i * PHOTO_DURATION,
            length: PHOTO_DURATION,
            fit: "cover",
            scale: 1,
            effect: i % 2 === 0 ? "zoomIn" : "zoomOut",
            filter: "contrast",
            opacity: 1,
            transition: { in: "fadeSlow", out: "fadeSlow" },
          });
        });
      }
    }
    return { clips };
  };

  const gradientOverlayTrack = hasPhotos
    ? { clips: [{ asset: { type: "colour", colour: "#000000" }, start: 0, length: TOTAL_DURATION, opacity: 0.3 }] }
    : null;

  const voiceoverTrack = voiceoverUrl
    ? { clips: [{ asset: { type: "audio", src: voiceoverUrl, volume: 1 }, start: 0, length: TOTAL_DURATION }] }
    : null;

  const titleClip = {
    asset: { type: "title", text: subtitle, style: "minimal", color: "#F5E6C8", size: "large" },
    start: 1,
    length: 6,
    position: "center",
    offset: { x: 0, y: 0.1 },
    transition: { in: "fadeIn", out: "fadeOut" },
  };

  const watermarkClip = {
    asset: { type: "title", text: `lensflow.com.au  ·  ${domain}`, style: "minimal", color: "#C9962A", size: "x-small" },
    start: 0,
    length: TOTAL_DURATION,
    position: "topLeft",
    offset: { x: 0.03, y: -0.04 },
  };

  const tracks = [
    buildPhotoTrack(),
    ...(gradientOverlayTrack ? [gradientOverlayTrack] : []),
    ...(voiceoverTrack ? [voiceoverTrack] : []),
    { clips: [titleClip] },
    { clips: [watermarkClip] },
  ];

  const musicUrl = musicTrack ? MUSIC_TRACK_URLS[musicTrack] : undefined;
  const soundtrack = musicUrl
    ? { src: musicUrl, effect: "fadeInFadeOut", volume: voiceoverUrl ? 0.2 : 0.5 }
    : undefined;

  const renderRes = await fetch(`${SHOTSTACK_API_BASE}/render`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      timeline: { background: "#0a0f1e", ...(soundtrack ? { soundtrack } : {}), tracks },
      output: { format: "mp4", resolution: "hd", fps: 25 },
    }),
  });

  if (!renderRes.ok) {
    const text = await renderRes.text();
    throw new Error(`Shotstack voice-photos render submit failed (${renderRes.status}): ${text}`);
  }

  const renderData = (await renderRes.json()) as {
    success: boolean;
    response?: { id: string };
    message?: string;
  };

  if (!renderData.success || !renderData.response?.id) {
    throw new Error(`Shotstack voice-photos did not return a render id: ${JSON.stringify(renderData)}`);
  }

  const renderId = renderData.response.id;
  logger.info({ renderId }, "Shotstack voice-photos render queued — polling");

  const POLL_INTERVAL_MS = 6_000;
  const MAX_ATTEMPTS = 60;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    const statusRes = await fetch(`${SHOTSTACK_API_BASE}/renders/${renderId}`, {
      headers: { "x-api-key": apiKey },
    });
    if (!statusRes.ok) { logger.warn({ attempt }, "Shotstack voice-photos poll failed — retrying"); continue; }
    const statusData = (await statusRes.json()) as { success: boolean; response?: { status: string; url?: string } };
    const status = statusData.response?.status;
    logger.info({ renderId, status, attempt }, "Shotstack voice-photos poll");
    if (status === "done") {
      const videoUrl = statusData.response?.url;
      if (!videoUrl) throw new Error("Shotstack voice-photos done but no url returned");
      logger.info({ renderId, videoUrl }, "Shotstack voice-photos render complete");
      return { videoUrl, renderId };
    }
    if (status === "failed") throw new Error(`Shotstack voice-photos render failed (id=${renderId})`);
  }

  throw new Error(`Shotstack voice-photos timed out after ${MAX_ATTEMPTS} polls (render_id=${renderId})`);
}
