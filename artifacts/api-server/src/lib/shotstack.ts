import { logger } from "./logger";

const SHOTSTACK_API_BASE = "https://api.shotstack.io/v1";

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
): Promise<ShotstackResult> {
  const apiKey = process.env.SHOTSTACK_API_KEY;
  if (!apiKey) throw new Error("SHOTSTACK_API_KEY not set");

  const subtitle = propertyTitle ?? "Premium Property Listing";
  const domain = listingUrl
    ? (() => { try { return new URL(listingUrl).hostname.replace("www.", ""); } catch { return "lensflow.com.au"; } })()
    : "lensflow.com.au";

  const images = (propertyImages ?? []).filter(Boolean);
  const hasPhotos = images.length > 0;

  logger.info({ presenterVideoUrl, subtitle, photoCount: images.length }, "Submitting Shotstack render job");

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

  const timeline = {
    background: "#0a0f1e",
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
