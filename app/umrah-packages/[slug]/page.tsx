import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryView from "@/components/views/CategoryView";
import PackageView from "@/components/views/PackageView";
import { categories, getCategory } from "@/lib/categories";
import { pageMetadata } from "@/lib/metadata";
import { ROOM_BASIS, fromPrice, getPackage, packages } from "@/lib/packages";
import { formatPKR } from "@/lib/site";
import { fillTokens } from "@/lib/tokens";

/**
 * One segment serves two page types: category landing pages
 * (/umrah-packages/15-days/) and single packages (/umrah-packages/15-days-3-star/).
 * Slugs are unique across both lists; a duplicate throws at build time.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = [...categories.map((c) => c.slug), ...packages.map((p) => p.slug)];
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dupes.length) throw new Error(`Duplicate /umrah-packages/ slugs: ${dupes.join(", ")}`);
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (category) {
    const list = packages.filter(category.filter);
    return pageMetadata({
      title: fillTokens(category.title, list),
      description: fillTokens(category.description, list),
      path: `/umrah-packages/${slug}/`,
      image: category.image,
    });
  }
  const p = getPackage(slug);
  if (!p) return {};
  const low = fromPrice(p);
  return pageMetadata({
    title: `${p.name} — ${formatPKR(low.amount)}`,
    description: `${p.days} days: ${p.nights.makkah} nights Makkah (${p.hotels.makkah.distance}) + ${p.nights.madinah} nights Madinah. Visa, return flights, hotels and transport from ${formatPKR(low.amount)} per person (${ROOM_BASIS[low.basis].label.toLowerCase()}). Book on WhatsApp.`,
    path: `/umrah-packages/${slug}/`,
    image: p.image,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (category) return <CategoryView category={category} />;
  const p = getPackage(slug);
  if (!p) notFound();
  return <PackageView p={p} />;
}
