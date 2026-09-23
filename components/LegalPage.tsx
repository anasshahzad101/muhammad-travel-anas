import Breadcrumbs from "./Breadcrumbs";

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
    <div className="container-x py-10 lg:py-14">
      <Breadcrumbs items={[{ name: title, path }]} />
      <article className="mx-auto mt-8 max-w-3xl">
        <h1 className="text-[2.3rem] leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-ink-500">Last updated {updated}</p>
        <div className="prose-mt mt-8">{children}</div>
      </article>
    </div>
  );
}
