/**
 * How we arrange a visa: numbered steps on a gold thread that draws itself as
 * the section scrolls in (the same `steps-thread` as BookingSteps), set for a
 * night section. The thread runs down on phones and across from laptop width.
 */

export type VisaStep = {
  icon: (p: { className?: string }) => React.ReactNode;
  title: string;
  body: React.ReactNode;
  /** A short label under the step, restating its key point. */
  tag: string;
};

export default function VisaSteps({ steps }: { steps: VisaStep[] }) {
  return (
    <div className="relative">
      <div aria-hidden className="absolute bottom-6 left-[1.75rem] top-6 w-px bg-white/10 lg:left-0 lg:right-0 lg:top-[1.75rem] lg:bottom-auto lg:h-px lg:w-auto">
        <span className="steps-thread absolute inset-0 origin-top bg-gradient-to-b from-gold-300 to-gold-600 lg:origin-left lg:bg-gradient-to-r" />
      </div>
      <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-7">
        {steps.map((s, i) => (
          <li key={s.title} className="reveal group relative grid grid-cols-[3.5rem_1fr] gap-5 lg:block" style={{ "--i": i } as React.CSSProperties}>
            <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/55 bg-night-800 text-gold-300 shadow-[0_0_0_7px_var(--color-night-900)] transition duration-500 group-hover:border-gold-300 group-hover:bg-night-700">
              <s.icon className="h-[1.35rem] w-[1.35rem]" />
            </span>
            <div className="lg:mt-7">
              <p aria-hidden className="figure text-[2.6rem] font-extralight leading-none text-gold-300/90">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-[1.55rem] leading-tight text-sand-50">{s.title}</h3>
              <p className="mt-2 text-[0.96rem] leading-relaxed text-sand-200/80">{s.body}</p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-300/[0.08] px-3 py-1.5 text-[0.74rem] font-bold text-gold-200">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-300" />
                {s.tag}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
