import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // G:\Claude has its own package-lock.json; pin the root to this app.
  turbopack: { root: path.resolve(__dirname) },
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
  // Browsers probe /favicon.ico regardless of <link rel="icon">; send it to the generated icon.
  async redirects() {
    return [{ source: "/favicon.ico", destination: "/icon/", permanent: true }];
  },
};

export default nextConfig;
