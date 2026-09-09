/**
 * The one section heading treatment, reused by all four sections.
 *
 * WHY THIS EXISTS
 *
 * Before it, every section opened with a bare `h2` on a flat background. Each
 * one was individually fine and the page as a whole read as unfinished: no
 * visible structure, no sense of "you are here", and nothing to separate one
 * section's beginning from the previous section's end.
 *
 * The eyebrow plus a short rule fixes that for the cost of one component, and
 * because it is a component rather than a convention, all four are identical.
 * That consistency is most of what reads as "designed" rather than "assembled".
 *
 * The `tone` prop exists because the timeline runs on the dark surface. It
 * switches to NAMED dark-surface tokens rather than an alpha on the light ones:
 * an alpha has no fixed contrast ratio, since it depends on what it composites
 * against, which is exactly the bug found in shadcn's tab styling. Both tones
 * are asserted in scripts/check-contrast.mjs.
 */

interface SectionHeadingProps {
  readonly eyebrow: string;
  /**
   * A node rather than a string, so a heading can carry real emphasis markup.
   * The timeline needs "25 days" inside an <em>, and the alternative is a
   * string with tags in it going through dangerouslySetInnerHTML, which is a
   * lot of risk to buy one italic.
   */
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
