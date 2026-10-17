import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  headingId,
  tone = "light",
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  headingId?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
}) {
  const dark = tone === "dark";
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <div
        className={`text-sm font-semibold uppercase tracking-[0.14em] ${
          dark ? "text-[#9db8ff]" : "text-accent-blue"
        }`}
      >
        {eyebrow}
      </div>
      <h2
        id={headingId}
        className={`mt-3 text-3xl md:text-[2.75rem] font-bold leading-[1.08] tracking-[-0.03em] text-balance ${
          dark ? "text-white" : "text-brand"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 text-lg leading-relaxed ${dark ? "text-white/65" : "text-muted-foreground"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
