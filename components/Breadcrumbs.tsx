import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail + BreadcrumbList schema. Home is prepended automatically. */
export default function Breadcrumbs({ items, onDark = false }: { items: Crumb[]; onDark?: boolean }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Breadcrumb" className={`text-[0.8rem] ${onDark ? "text-sand-200/60" : "text-ink-500"}`}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-2">
              {i > 0 && (
                <svg viewBox="0 0 24 24" className="h-2 w-2 text-gold-500/70" fill="currentColor" aria-hidden>
                  <path d="M12 0l2.6 6.3L21 3.5l-2.8 6.4L24 12l-5.8 2.1L21 20.5l-6.4-2.8L12 24l-2.6-6.3L3 20.5l2.8-6.4L0 12l5.8-2.1L3 3.5l6.4 2.8z" />
                </svg>
              )}
              {i === all.length - 1 ? (
                <span aria-current="page" className={`font-semibold ${onDark ? "text-sand-100" : "text-ink-700"}`}>
                  {c.name}
                </span>
              ) : (
                <Link
                  href={c.path}
                  // The ::after pad makes each crumb a full 44px tap target without changing the layout
                  className={`relative transition after:absolute after:-inset-x-1.5 after:-inset-y-3.5 after:content-[''] ${onDark ? "hover:text-gold-300" : "hover:text-haram-700"}`}
                >
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
