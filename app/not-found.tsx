import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow justify-center">Page not found</p>
      <h1 className="mt-4 text-4xl sm:text-5xl">This page has moved or never existed</h1>
      <p className="mt-4 max-w-lg text-ink-600">
        The package you were looking for may have been updated for the new season. All current packages are on one page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/umrah-packages/" className="btn btn-primary">
          See Umrah packages
        </Link>
        <Link href="/" className="btn btn-ghost">
          Home
        </Link>
      </div>
    </section>
  );
}
