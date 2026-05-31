/**
 * Runs once on the pipeline app startup.
 * If there's a pending job saved before auth (from the marketing site),
 * creates it and redirects the user straight to their job detail page.
 */
import { useEffect, useRef } from "react";
import { loadPendingJob, clearPendingJob } from "./SubmitForm";
import { useAuth } from "@workspace/replit-auth-web";

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
          body: JSON.stringify(pending),
        });
        if (!createRes.ok) return;
        const created = await createRes.json() as { id: string };

        await fetch(`/api/jobs/${created.id}/simulate`, {
          method: "POST",
          credentials: "include",
        });

        window.location.href = `/pipeline/jobs/${created.id}`;
      } catch {
        // Silently fail — user lands on dashboard normally
      }
    })();
  }, [isAuthenticated, isLoading]);

  return null;
}
