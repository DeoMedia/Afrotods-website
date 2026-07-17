import { useEffect } from "react";
import { useLocation } from "react-router";

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtag?: (...args: any[]) => void;
  }
}

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Push SPA pageview event for GTM
    window.dataLayer.push({
      event: "pageview",
      page_path: location.pathname,
      page_title: document.title,
      page_location: window.location.href,
    });

    // Optional direct GA4 support
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname,
        page_title: document.title,
        page_location: window.location.href,
      });
    }

    console.log("Tracked page:", location.pathname);

  }, [location]);
}