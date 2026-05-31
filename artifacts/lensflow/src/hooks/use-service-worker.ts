import { useEffect } from "react";
import { toast } from "sonner";

// Tell the waiting SW to activate, then reload once it takes control.
function applyUpdate(registration: ServiceWorkerRegistration) {
  const waiting = registration.waiting;
  if (!waiting) return;

  // Listen for the SW swap before reloading
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!reloading) {
      reloading = true;
      window.location.reload();
    }
  });

  waiting.postMessage({ type: "SKIP_WAITING" });
}

// Show the update toast only when a genuine update is waiting.
// Guard: navigator.serviceWorker.controller is null on first install,
// so we never show the toast to a brand-new visitor.
function showUpdateToast(registration: ServiceWorkerRegistration) {
  if (!navigator.serviceWorker.controller) return;

  toast("Update available", {
    description: "A new version of LensFlow AI is ready.",
    action: {
      label: "Reload",
      onClick: () => applyUpdate(registration),
    },
    duration: Infinity,
  });
}

export function useServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // A worker was already waiting before this page loaded
        // (e.g. tab was open in the background during a deploy)
        if (registration.waiting) {
          showUpdateToast(registration);
        }

        // Normal update flow: new SW downloaded and installed
        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;

          installing.addEventListener("statechange", () => {
            if (installing.state === "installed") {
              showUpdateToast(registration);
            }
          });
        });
      })
      .catch((err) => {
        console.warn("[SW] Registration failed:", err);
      });

    // ── Online / offline status toasts
    let offlineToastId: string | number | undefined;

    function handleOffline() {
      offlineToastId = toast.warning("You're offline", {
        description: "Pipeline data may not load until your connection is restored.",
        duration: Infinity,
      });
    }

    function handleOnline() {
      if (offlineToastId !== undefined) {
        toast.dismiss(offlineToastId);
        offlineToastId = undefined;
      }
      toast.success("Connection restored", {
        description: "You're back online. Pick up where you left off.",
        duration: 4000,
      });
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}
