import type { NextConfig } from "next";

const supabaseHost = "cxpgjjvteaqzhnpwkqzl.supabase.co";

// Content-Security-Policy: explicitly allow only what the site actually
// needs (Google Fonts, Supabase for API/storage/images, self for scripts).
// Everything else is denied by default.
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval'`, // Next.js requires inline/eval for hydration
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com`,
  `img-src 'self' data: blob: https://${supabaseHost}`,
  `connect-src 'self' https://${supabaseHost} wss://${supabaseHost}`,
  `frame-src 'self' https://www.google.com`, // for the embedded contact map
  `frame-ancestors 'none'`, // equivalent to X-Frame-Options: DENY
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

// Public content pages render fresh from Supabase on every request
// (dynamic = "force-dynamic"), but without an explicit Cache-Control
// header Vercel's edge network can still cache the HTML for anonymous
// (cookie-less) visitors while requests carrying an admin session
// cookie always bypass that cache — which is exactly why only the
// logged-in admin's browser was seeing fresh news/hero content.
// These headers force every edge/CDN/browser layer to skip caching
// for the pages backed by editable content.
const noStoreHeaders = [
  { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
];
const noStoreRoutes = [
  "/",
  "/news",
  "/news/:path*",
  "/about",
  "/accomplishments",
  "/academics",
  "/staff",
  "/gallery",
  "/gallery/:path*",
  "/contact",
  "/p/:path*",
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      ...noStoreRoutes.map((source) => ({ source, headers: noStoreHeaders })),
    ];
  },
  // Don't leak the specific Next.js version in response headers
  poweredByHeader: false,
};

export default nextConfig;
