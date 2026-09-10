// One heading treatment for every section, so the type scale stays even.
// `tone` switches to named dark-surface tokens rather than an alpha.
interface SectionHeadingProps {
  readonly eyebrow: string;

  readonly heading: React.ReactNode;
  readonly sub?: string;
  readonly tone?: "light" | "dark";
  readonly className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  sub,
  tone = "light",
  className,
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`}>
      <p className="flex items-center gap-3">
        <span
          aria-hidden
          className={`h-px w-8 shrink-0 ${isDark ? "bg-brand" : "bg-brand-strong"}`}
        />
        <span
          className={`text-xs font-bold tracking-[0.16em] uppercase ${
            isDark ? "text-brand" : "text-brand-strong"
          }`}
        >
          {eyebrow}
        </span>
      </p>
      <h2
        className={`max-w-2xl text-3xl ${isDark ? "text-surface" : "text-ink"}`}
      >
        {heading}
      </h2>
      {sub && (
        <p
          className={`max-w-xl text-base ${
            isDark ? "text-ink-muted-on-dark" : "text-ink-muted"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
