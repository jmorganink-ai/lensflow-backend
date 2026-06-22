/**
 * Runs once after authentication completes in the pipeline app.
 * If the agent submitted a job on the marketing site before signing in,
 * this picks it up from sessionStorage, creates it via API, and redirects
 * straight to the job detail page — so the agent lands on their running pipeline.
 */
import { useEffect, useRef } from "react";
import { useAuth } from "@workspace/replit-auth-web";

const PENDING_JOB_KEY = "lensflow_pending_job";

interface PendingJob {
  listingUrl: string;
  voiceId: string;
  voiceName: string;
  propertyImages: string[];
}

function loadPendingJob(): PendingJob | null {
  try {
    const raw = sessionStorage.getItem(PENDING_JOB_KEY);
    return raw ? (JSON.parse(raw) as PendingJob) : null;
  } catch {
    return null;
  }
}

function clearPendingJob() {
  sessionStorage.removeItem(PENDING_JOB_KEY);
}

export function PendingJobHandler() {
  const { isAuthenticated, isLoading } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated || handled.current) return;
    const pending = loadPendingJob();
    if (!pending) return;

    handled.current = true;
    clearPendingJob();

    (async () => {
      try {
        const createRes = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            listingUrl: pending.listingUrl,
            voiceId: pending.voiceId,
            voiceName: pending.voiceName,
            propertyImages: pending.propertyImages,
          }),
        });
        if (!createRes.ok) return;
        const created = (await createRes.json()) as { id: string };

        // Fire-and-forget: start the pipeline immediately
        fetch(`/api/jobs/${created.id}/simulate`, {
          method: "POST",
          credentials: "include",
        }).catch(() => {});

        // Navigate to job detail — base path already handled by wouter
        window.location.replace(`/pipeline/jobs/${created.id}`);
      } catch {
        // Silently fail — agent lands on dashboard normally and can submit again
      }
    })();
  }, [isAuthenticated, isLoading]);

  return null;
}
