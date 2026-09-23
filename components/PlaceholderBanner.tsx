import { missingForLaunch } from "@/lib/site";

/**
 * Loud, deliberate: shows on EVERY environment while launch-critical details are
 * missing, so a fake number or an unlicensed offer can never quietly go live.
 * Fill in lib/site.ts and it disappears.
 */
export default function PlaceholderBanner() {
  const missing = missingForLaunch();
  if (missing.length === 0) return null;
  return (
    <div role="status" className="relative z-[60] bg-[#7a1d1d] px-4 py-2 text-center text-[0.8rem] font-semibold text-white">
      Preview - not ready to publish. Missing: {missing.join(", ")}. Update <code>lib/site.ts</code>.
    </div>
  );
}
