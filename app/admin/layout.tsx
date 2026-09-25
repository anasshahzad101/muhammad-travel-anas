import type { Metadata } from "next";

// Staff only: never indexed, never in the sitemap, and outside the (site) group,
// so no header, footer, popup or chatbot.
export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-[#f3eee3] text-ink-900">{children}</div>;
}
