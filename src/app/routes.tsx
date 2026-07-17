import { createBrowserRouter, Navigate } from "react-router";

import { Layout } from "./components/Layout";

import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Shop } from "./pages/Shop";
import { ContactUs } from "./pages/ContactUs";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsConditions } from "./pages/TermsConditions";

import TrackingProvider from "./TrackingProvider";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <TrackingProvider />
        <Layout />
      </>
    ),
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "shop", Component: Shop },
      { path: "contact", Component: ContactUs },

      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "terms-conditions", Component: TermsConditions },

      // Redirect old/simple URLs
      { path: "privacy", element: <Navigate to="/privacy-policy" replace /> },
      { path: "terms", element: <Navigate to="/terms-conditions" replace /> },
    ],
  },
]);