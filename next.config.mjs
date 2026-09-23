import path from "node:path";
import { fileURLToPath } from "node:url";

// Plain JavaScript on purpose: on hosts whose glibc is too old for Next's native
// compiler (Hostinger), Next falls back to its WebAssembly build, which cannot
// load a next.config.ts. The same hosts need `next build --webpack` (see
// package.json), because Turbopack only runs on the native compiler.

const root = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  // G:\Claude has its own package-lock.json; pin the root to this app.
  turbopack: { root },
  reactStrictMode: true,
  // Everything must render in the HTML source: AI crawlers (GPTBot, ClaudeBot,
  // PerplexityBot) don't execute JavaScript. Packages, prices and FAQs are all
  // server-rendered; only the enquiry form and analytics run in the browser.
  poweredByHeader: false,
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
  async redirects() {
    return [
      // One canonical host: www.muhammadtravels.com points at the same app, so send it
      // to the bare domain with a permanent redirect. Keep in sync with `url` in lib/site.ts.
      {
        // `(.*)` rather than `*` so the trailing slash is carried over: one hop, not two.
        source: "/:path(.*)",
        has: [{ type: "host", value: "www.muhammadtravels.com" }],
        destination: "https://muhammadtravels.com/:path",
        permanent: true,
      },
      // Browsers probe /favicon.ico regardless of <link rel="icon">; send it to the generated icon.
      { source: "/favicon.ico", destination: "/icon/", permanent: true },
    ];
  },
};

export default nextConfig;
