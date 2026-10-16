import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "../globals.css";

// Staff only: never indexed, never in the sitemap, and outside the (site) and
// (ur) groups, so no header, footer, popup or chatbot. With multiple root
// layouts there is no app/layout.tsx, so this layout is admin's root and must
// render <html> itself.
export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <div className="min-h-dvh bg-[#f3eee3] text-ink-900">{children}</div>
      </body>
    </html>
  );
}
