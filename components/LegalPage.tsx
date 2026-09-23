import PageHero from "./PageHero";

export default function LegalPage({
  title,
  path,
  updated,
  children,
}: {
  title: string;
  path: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero crumbs={[{ name: title, path }]} eyebrow="Policies" title={title} lead={<p>Last updated {updated}</p>} compact />
      <div className="container-x py-16 lg:py-20">
        <article className="card prose-mt mx-auto max-w-3xl p-7 sm:p-12">{children}</article>
      </div>
    </>
  );
}
