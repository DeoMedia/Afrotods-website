import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { usePageTracking } from "../hooks/usePageTracking";

export const CONSENT_COOKIE = "afrotods_cookie_consent";
export const CONSENT_EVENT = "afrotods:consent-changed";

/**
 * Pushes SPA pageviews to GTM, but only once the visitor has accepted cookies.
 *
 * Two things this has to get right:
 *  - Hooks must run unconditionally. Returning early before usePageTracking()
 *    changes the hook count between renders, which React rejects outright.
 *  - Consent has to be reactive. The banner lives outside the router tree, so
 *    without listening for the change, tracking would not start until the
 *    visitor happened to reload the page.
 */
export default function TrackingProvider() {
  const [consented, setConsented] = useState(() => Cookies.get(CONSENT_COOKIE) === "accepted");

  useEffect(() => {
    const sync = () => setConsented(Cookies.get(CONSENT_COOKIE) === "accepted");
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("focus", sync); // consent given in another tab
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  usePageTracking(consented);

  return null;
}
