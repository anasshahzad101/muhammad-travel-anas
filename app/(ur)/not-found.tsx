import Link from "next/link";

/** The Urdu section's 404, inside the (ur) root layout (so lang="ur" dir="rtl"). */
export default function UrduNotFound() {
  return (
    <section className="section-night grain on-dark flex min-h-[70vh] items-center">
      <div className="container-x py-24 text-center">
        <p className="figure text-[5rem] font-extrabold text-gold-300" style={{ fontFamily: "var(--font-body)" }}>
          404
        </p>
        <h1 className="mt-4 text-[2.2rem] font-bold text-sand-50">یہ صفحہ نہیں ملا</h1>
        <p className="mx-auto mt-4 max-w-md text-[1.1rem] leading-[1.9] text-sand-200/85">
          آپ جو صفحہ ڈھونڈ رہے ہیں وہ موجود نہیں یا منتقل ہو چکا ہے۔
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/ur/" className="btn btn-gold btn-lg">
            اردو ہوم پیج
          </Link>
          <Link href="/" hrefLang="en-PK" className="btn btn-ghost btn-lg" style={{ fontFamily: "var(--font-body)" }}>
            English site
          </Link>
        </div>
      </div>
    </section>
  );
}
