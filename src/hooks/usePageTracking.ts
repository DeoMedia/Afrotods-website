import { useEffect } from "react";
import { useLocation } from "react-router";

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Pushes a pageview to GTM/GA4 on each route change.
 * `enabled` gates on cookie consent — the hook itself always runs, so the
 * hook order stays stable no matter what the visitor has chosen.
 */
export function usePageTracking(enabled = true) {
  const location = useLocation();

  useEffect(() => {
    if (!enabled) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "pageview",
      page_path: location.pathname,
      page_title: document.title,
      page_location: window.location.href,
    });

    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [location, enabled]);
}
