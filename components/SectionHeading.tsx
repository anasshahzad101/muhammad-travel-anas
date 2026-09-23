export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Tag = "h2",
  id,
}: {
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  id?: string;
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className={`eyebrow ${center ? "justify-center" : ""}`}>{eyebrow}</p>}
      <Tag id={id} className="mt-3 text-3xl sm:text-[2.6rem]">
        {title}
      </Tag>
      {intro && <div className="mt-4 text-[1.05rem] leading-relaxed text-ink-600">{intro}</div>}
    </div>
  );
}
