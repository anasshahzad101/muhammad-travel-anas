import { renderLogo } from "@/lib/og-image";

/**
 * /logo.png - the 512x512 brand logo, prerendered at build time. Referenced by
 * the Organization schema (lib/schema.ts) and the web app manifest.
 */
export const dynamic = "force-static";

export function GET() {
  return renderLogo();
}
