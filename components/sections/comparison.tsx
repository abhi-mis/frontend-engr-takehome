import { ComparisonTabs } from "@/components/sections/comparison-tabs";
import { SectionHeading } from "@/components/section-heading";
import { COMPARISON } from "@/lib/content";

/**
 * "How are we different?" Server Component shell.
 *
 * This used to hold a nine row, four column table for desktop AND a separate
 * tabbed card list for mobile, both in the DOM, toggled with `hidden md:block`.
 * It was the heaviest section on the page at 461 of its 1289 elements, and the
 * four column layout was only possible because a whole column of it was copy I
 * had invented to fill the gaps between two comparisons that do not share
 * criteria. See lib/content.ts.
 *
 * Both problems had the same fix. Propsoch compares against one competitor at a
 * time because each comparison has its own criteria, and once the table is
 * three columns instead of four it holds up at 360px, so the second DOM tree
 * stopped being necessary. Everything now lives in one tabbed component.
 */
export function Comparison() {
  return (
    <section
      id="comparison"
      className="lazy-section relative isolate bg-surface-sunken py-20 sm:py-28"
    >
      {/* One quiet signature per section, so the page's visual interest is
          spread across it instead of all spent in the hero. Decorative,
          aria-hidden, pointer-events-none, and behind the content on the
          z-axis, so it cannot intercept a click or reach a screen reader. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_86%_0%,color-mix(in_oklch,var(--color-brand)_9%,transparent)_0%,transparent_68%)]"
      />

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <SectionHeading
          eyebrow={COMPARISON.eyebrow}
          heading={COMPARISON.heading}
          sub={COMPARISON.subheading}
        />

        <ComparisonTabs />
      </div>
    </section>
  );
}
