import { renderShareCard } from "@/lib/og-image";
import { shareCardById, shareCards } from "@/lib/og";

/**
 * /og/{card}.jpg - branded share cards (Open Graph and Twitter images), one
 * per page. Every card is prerendered at build time; unknown paths 404.
 * lib/metadata.ts links each page to its card. The card list and design live
 * in lib/og.ts and lib/og-image.tsx.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return shareCards().map((c) => ({ slug: `${c.id}.jpg`.split("/") }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const file = slug.join("/");
  const card = file.endsWith(".jpg") ? shareCardById(file.slice(0, -".jpg".length)) : undefined;
  if (!card) return new Response("Not found", { status: 404 });
  return renderShareCard(card);
}
