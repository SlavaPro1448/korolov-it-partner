export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  headingId,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  headingId?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">{eyebrow}</div>
      <h2 id={headingId} className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
