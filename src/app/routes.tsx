import { createBrowserRouter, Navigate } from "react-router";

import { Layout } from "./components/Layout";

import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Shop } from "./pages/Shop";
import { ShopProduct } from "./pages/ShopProduct";
import { ShopCart } from "./pages/ShopCart";
import { ShopCheckout } from "./pages/ShopCheckout";
import { ShopOrder } from "./pages/ShopOrder";
import { ContactUs } from "./pages/ContactUs";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsConditions } from "./pages/TermsConditions";

import TrackingProvider from "./TrackingProvider";
import { CartProvider } from "./shop/CartContext";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CartProvider>
        <TrackingProvider />
        <Layout />
      </CartProvider>
    ),
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "shop", Component: Shop },
      { path: "shop/cart", Component: ShopCart },
      { path: "shop/checkout", Component: ShopCheckout },
      { path: "shop/order/:reference", Component: ShopOrder },
      { path: "shop/:slug", Component: ShopProduct },
      { path: "contact", Component: ContactUs },

      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "terms-conditions", Component: TermsConditions },

      // Redirect old/simple URLs
      { path: "privacy", element: <Navigate to="/privacy-policy" replace /> },
      { path: "terms", element: <Navigate to="/terms-conditions" replace /> },
    ],
  },
]);