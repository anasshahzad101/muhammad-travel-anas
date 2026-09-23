/**
 * Two facts about the current visit, shared by the lead popup and the
 * "Let us help you" widget:
 *
 * - Did it start from a paid ad? Ad visitors clicked for a price, so nothing
 *   opens over the page until they have had time to read it.
 * - Has the visitor already been in touch (WhatsApp, call or a form)? Then
 *   nothing should open to ask for details they have just sent.
 *
 * Both live in sessionStorage, so a new visit starts fresh. Browser-only.
 */

const AD_KEY = "mt-ad-visit";
const CONTACTED_KEY = "mt-contacted";

/** Google Ads click IDs (gbraid/wbraid on iOS), or utm_medium=cpc on hand-tagged ads. */
function landedFromAd(): boolean {
  const q = new URLSearchParams(window.location.search);
  if (q.has("gclid") || q.has("gbraid") || q.has("wbraid")) return true;
  return /^(cpc|ppc|paid)/i.test(q.get("utm_medium") ?? "");
}

/**
 * Remembered for the whole visit, because the click ID is only in the URL of
 * the landing page. Both callers run on mount, so they see that URL.
 */
export function isAdVisit(): boolean {
  try {
    if (sessionStorage.getItem(AD_KEY) === "1") return true;
    if (!landedFromAd()) return false;
    sessionStorage.setItem(AD_KEY, "1");
    return true;
  } catch {
    return landedFromAd();
  }
}

export function markContacted(): void {
  try {
    sessionStorage.setItem(CONTACTED_KEY, "1");
  } catch {
    /* storage blocked: at worst the popup still opens once */
  }
}

export function hasContacted(): boolean {
  try {
    return sessionStorage.getItem(CONTACTED_KEY) === "1";
  } catch {
    return false;
  }
}
