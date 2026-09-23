/**
 * Section heading: eyebrow, display-serif title and intro. `accent` names a
 * word or phrase inside the title to set in gold/green italic; the heading
 * text itself is unchanged, so what crawlers read is exactly the title.
 */
export default function SectionHeading({
  eyebrow,
  title,
  accent,
  intro,
  align = "left",
  as: Tag = "h2",
  id,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  intro?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  id?: string;
  className?: string;
}) {
  const center = align === "center";
  const at = accent ? title.indexOf(accent) : -1;
  const content =
    at >= 0 && accent ? (
      <>
        {title.slice(0, at)}
        <em className="accent">{accent}</em>
        {title.slice(at + accent.length)}
      </>
    ) : (
      title
    );

  return (
    <div className={`reveal ${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      {eyebrow && <p className={`eyebrow ${center ? "justify-center" : ""}`}>{eyebrow}</p>}
      <Tag id={id} className="h-section mt-4">
        {content}
      </Tag>
      {intro && <div className="mt-5 max-w-2xl text-[1.06rem] leading-relaxed text-ink-600 [.on-dark_&]:text-sand-200/80 [.text-center_&]:mx-auto">{intro}</div>}
    </div>
  );
}
