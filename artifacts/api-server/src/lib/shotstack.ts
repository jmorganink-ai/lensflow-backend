import { logger } from "./logger";

// Production endpoint — uses /v1/ not /stage/
const SHOTSTACK_API_BASE = "https://api.shotstack.io/v1";

export interface ShotstackResult {
  videoUrl: string;
  renderId: string;
}

export async function composePresenterVideo(
  presenterVideoUrl: string,
  propertyTitle?: string | null,
  listingUrl?: string | null,
): Promise<ShotstackResult> {
  const apiKey = process.env.SHOTSTACK_API_KEY;
  if (!apiKey) throw new Error("SHOTSTACK_API_KEY not set");

  const subtitle = propertyTitle ?? "Premium Property Listing";
  const domain = listingUrl
    ? (() => { try { return new URL(listingUrl).hostname.replace("www.", ""); } catch { return "lensflow.com.au"; } })()
    : "lensflow.com.au";

  logger.info({ presenterVideoUrl, subtitle }, "Submitting Shotstack render job");

  const timeline = {
    background: "#0a0f1e",
    tracks: [
      // Track 1: Presenter video (full duration)
      {
        clips: [
          {
            asset: {
              type: "video",
              src: presenterVideoUrl,
              volume: 1,
            },
            start: 0,
            length: 60, // Shotstack trims to actual video length
            fit: "contain",
            scale: 1,
          },
        ],
      },
      // Track 2: Property title — lower third, fades in at 1s
      {
        clips: [
          {
            asset: {
              type: "title",
              text: subtitle,
              style: "minimal",
              color: "#F5E6C8",
              size: "medium",
            },
            start: 1,
            length: 4,
            position: "bottomLeft",
            offset: { x: 0.05, y: 0.12 },
            transition: { in: "fadeIn", out: "fadeOut" },
          },
        ],
      },
      // Track 3: LensFlow watermark — bottom right, full duration
      {
        clips: [
          {
            asset: {
              type: "title",
              text: `lensflow.com.au  ·  ${domain}`,
              style: "minimal",
              color: "#C9962A",
              size: "x-small",
            },
            start: 0,
            length: 60,
            position: "bottomRight",
            offset: { x: -0.03, y: 0.04 },
          },
        ],
      },
    ],
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

  // Poll up to 6 minutes
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
