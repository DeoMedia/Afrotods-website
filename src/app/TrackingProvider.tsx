import Cookies from "js-cookie";
import { usePageTracking } from "../hooks/usePageTracking";

export default function TrackingProvider() {
  const consent = Cookies.get("afrotods_cookie_consent");

  if (consent !== "accepted") {
    return null;
  }

  usePageTracking();

  return null;
}