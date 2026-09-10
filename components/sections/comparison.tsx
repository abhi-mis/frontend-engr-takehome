import { ComparisonTabs } from "@/components/sections/comparison-tabs";
import { SectionHeading } from "@/components/section-heading";
import { COMPARISON } from "@/lib/content";

// Section shell. Only the tab strip hydrates; both tables ship in the HTML.
export function Comparison() {
  return (
    <section
      id="comparison"
      className="lazy-section relative isolate bg-surface-sunken py-20 sm:py-28"
    >
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
