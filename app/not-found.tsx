import Link from "next/link";
import StarPattern, { StarSeal } from "@/components/StarPattern";

export default function NotFound() {
  return (
    <section className="section-night grain on-dark relative -mt-[var(--header-h)] flex min-h-[80vh] items-center overflow-hidden pt-[var(--header-h)]">
      <StarPattern id="nf-lattice" className="text-gold-300 opacity-[0.04]" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-400/10">
        <StarSeal className="h-[36rem] w-[36rem] animate-spin-slow" strokeWidth={0.4} />
      </div>
      <div className="container-x relative flex flex-col items-center py-24 text-center">
        <p className="eyebrow justify-center">Page not found</p>
        <h1 className="h-display mt-5 max-w-3xl text-[2.8rem] text-sand-50 sm:text-6xl">This page has moved or never existed</h1>
        <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-sand-200/85">
          The package you were looking for may have been updated for the new season. All current packages are on one page.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/umrah-packages/" className="btn btn-gold btn-lg">
            See Umrah packages
          </Link>
          <Link href="/" className="btn btn-ghost btn-lg">
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
