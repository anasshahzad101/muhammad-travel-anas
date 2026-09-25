import type { LeadStage, LeadStatus } from "@/lib/leads/types";

/**
 * How each lead status looks on the dashboard. The four `mark` colours are
 * the chart palette, checked with the dataviz validator against the card
 * surface #fffdf9 in stack order (lightness band, chroma, colour-blind
 * separation, 3:1 contrast all pass). Text never wears them: badges use
 * darker text steps.
 */
export const STATUS_META: Record<LeadStatus, { label: string; hint: string; mark: string; badge: string }> = {
  unsent: {
    label: "Did not send",
    hint: "Left a number but never pressed send",
    mark: "#c7851a",
    badge: "bg-[#fbf0dc] text-[#6f4509] ring-[#efd9ae]",
  },
  sent: {
    label: "Sent on WhatsApp",
    hint: "Pressed through to WhatsApp",
    mark: "#0a8a6a",
    badge: "bg-[#e2f3ed] text-[#0a5343] ring-[#bfe3d6]",
  },
  direct: {
    label: "Direct contact",
    hint: "WhatsApp, calls and walk-ins you added",
    mark: "#9a5bc4",
    badge: "bg-[#f3ecfa] text-[#5b2f86] ring-[#e1d2f2]",
  },
  anonymous: {
    label: "No number",
    hint: "Started but left no usable number",
    mark: "#6d7fe0",
    badge: "bg-[#eceefb] text-[#34409a] ring-[#d3d8f5]",
  },
};

/** Stack order in the chart, bottom to top (the order the palette was validated in). */
export const STATUS_ORDER: LeadStatus[] = ["sent", "direct", "unsent", "anonymous"];

export const STAGE_STYLE: Record<LeadStage, string> = {
  new: "bg-white text-ink-700 ring-sand-300",
  contacted: "bg-[#eef3fb] text-[#2b4a7a] ring-[#d3e0f3]",
  qualified: "bg-[#e6f2f5] text-[#1d5563] ring-[#c9e2e9]",
  booked: "bg-[#e2f3ed] text-[#0a5343] ring-[#bfe3d6]",
  lost: "bg-sand-100 text-ink-500 ring-sand-300",
};
