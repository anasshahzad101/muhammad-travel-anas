/**
 * Global next/image loader (wired in next.config.mjs).
 *
 * Unsplash photos are resized by Unsplash's own imgix CDN, so no image
 * optimisation server is needed and the site can be hosted anywhere. Local
 * files under /public pass through untouched.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string {
  if (src.startsWith("https://images.unsplash.com/")) {
    const params = new URLSearchParams({ auto: "format", fit: "max", w: String(width), q: String(quality ?? 70) });
    return `${src}?${params.toString()}`;
  }
  return src;
}
