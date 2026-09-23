const steps = [
  {
    title: "Choose a package",
    body: "Pick a package here, or send us your dates, city and number of pilgrims on WhatsApp for a quote.",
  },
  {
    title: "Send your documents",
    body: "A clear photo of each passport (valid 6+ months), CNIC and a white-background photo. We check them before anything is paid.",
  },
  {
    title: "Pay and we apply",
    body: "Pay by bank transfer against a written invoice, then we apply for your Umrah visa and confirm flights and hotels.",
  },
  {
    title: "Fly with everything in hand",
    body: "Your e-visa, e-tickets, hotel vouchers and transport schedule arrive on WhatsApp before you fly, with a number to call in Saudi Arabia.",
  },
];

export default function BookingSteps() {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.title} className="card relative p-6">
          <span className="font-display text-4xl font-semibold text-gold-500">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 text-xl">{s.title}</h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-600">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
