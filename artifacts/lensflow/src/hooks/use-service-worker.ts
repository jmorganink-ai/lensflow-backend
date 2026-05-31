import { useEffect } from "react";
import { toast } from "sonner";

export function useServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

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
  }, []);
}
