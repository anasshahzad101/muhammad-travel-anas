import type { MetadataRoute } from "next";
import { LOGO, plainDashes } from "@/lib/og";
import { site } from "@/lib/site";

/**
 * Web app manifest (/manifest.webmanifest): name, colours and icons for
 * "Add to Home Screen".
 *
 * display "browser", not "standalone": this is a brochure site whose growth
 * channel is people sharing page links on WhatsApp. A standalone window hides
 * the address bar and the browser's share button, there is no offline support
 * (no service worker) and nothing app-like to gain from it. A home-screen
 * shortcut that opens in the normal browser keeps sharing, and the wa.me and
 * tel: links, working as usual.
 *
 * Icons: the generated favicon and Apple touch icon (app/icon.tsx,
 * app/apple-icon.tsx; with trailingSlash on they are served at /icon/ and
 * /apple-icon/) plus the 512px logo, which keeps its mark inside the maskable
 * safe zone.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: site.name,
    short_name: site.name,
    description: plainDashes(site.description),
    start_url: "/",
    scope: "/",
    display: "browser",
    lang: site.language,
    dir: "ltr",
    theme_color: "#06120f",
    background_color: "#fbf7ef",
    categories: ["travel"],
    icons: [
      { src: "/icon/", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon/", sizes: "180x180", type: "image/png" },
      { src: LOGO.path, sizes: `${LOGO.size}x${LOGO.size}`, type: "image/png", purpose: "any" },
      { src: LOGO.path, sizes: `${LOGO.size}x${LOGO.size}`, type: "image/png", purpose: "maskable" },
    ],
  };
}
