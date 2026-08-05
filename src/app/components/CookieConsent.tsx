// CookieConsent.tsx
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { CONSENT_COOKIE, CONSENT_EVENT } from "../TrackingProvider";

// Pages where the cookie banner must not appear —
// Google's crawler visits these pages and flags a banner as blocking the content.
const EXCLUDED_PATHS = ["/privacy-policy", "/terms-conditions"];

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Never show on legal pages — use window.location since this component
    // lives outside the RouterProvider context.
    if (EXCLUDED_PATHS.includes(window.location.pathname)) {
      setShowBanner(false);
      return;
    }

    const consent = Cookies.get(CONSENT_COOKIE);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const record = (choice: "accepted" | "rejected") => {
    Cookies.set(CONSENT_COOKIE, choice, {
      expires: 365,
      sameSite: "Lax",
      // `secure` cookies are dropped on plain http, which silently breaks the
      // banner (and so tracking) on localhost. Only set it where it applies.
      secure: window.location.protocol === "https:",
    });
    // TrackingProvider sits in a separate tree and cannot see this state
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setShowBanner(false);
  };

  const acceptCookies = () => record("accepted");
  const rejectCookies = () => record("rejected");

  if (!showBanner) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-black/95 backdrop-blur-md text-white px-4 py-5 shadow-2xl border-t border-zinc-800 rounded-t-2xl"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">

        <p className="text-sm md:text-base leading-relaxed max-w-4xl">
          THE AFROTODS uses cookies to improve your browsing experience,
          understand website traffic, and support marketing performance.
          Read our{" "}
          <a
            href="/privacy-policy"
            className="underline font-semibold hover:text-orange-400 transition"
          >
            Privacy Policy
          </a>.
        </p>

        <div className="flex w-full lg:w-auto gap-3 shrink-0">
          <button
            onClick={rejectCookies}
            className="flex-1 lg:flex-none px-5 py-3 rounded-xl border border-white/40 text-white text-sm font-medium hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
          >
            Reject
          </button>

          <button
            onClick={acceptCookies}
            className="flex-1 lg:flex-none px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 hover:scale-105 text-black text-sm font-bold transition-all duration-300 shadow-lg"
          >
            Accept
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CookieConsent;