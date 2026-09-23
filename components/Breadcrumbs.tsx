import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail + BreadcrumbList schema. Home is prepended automatically. */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Breadcrumb" className="text-[0.82rem] text-ink-500">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-2">
              {i > 0 && <span className="text-gold-500">/</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className="font-semibold text-ink-700">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="hover:text-haram-700 hover:underline">
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
