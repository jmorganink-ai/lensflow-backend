import { useEffect } from "react";
import { toast } from "sonner";

export function useServiceWorker() {
  useEffect(() => {
    // SW update notifications
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                toast("Update available", {
                  description: "A new version of LensFlow AI is ready.",
                  action: {
                    label: "Reload",
                    onClick: () => window.location.reload(),
                  },
                  duration: Infinity,
                });
              }
            });
          });
        })
        .catch((err) => {
          console.warn("Service worker registration failed:", err);
        });
    }

    // Online / offline toasts
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
