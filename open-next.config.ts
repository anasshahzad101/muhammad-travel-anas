import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Serves prerendered pages and images exactly as the build produced them. This
 * is not only for speed: lib/og-image.tsx reads fonts from assets/ on disk, which
 * only exists at build time, so the share images cannot be rendered on the Worker.
 *
 * The cache is read-only, so it suits this site only while no route uses
 * `revalidate`. Add one and that route will never refresh without a redeploy.
 */
export default defineCloudflareConfig({
	incrementalCache: staticAssetsIncrementalCache,
	enableCacheInterception: true,
});
