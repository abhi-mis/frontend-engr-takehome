import { SectionHeading } from "@/components/section-heading";
import { PlanComparison } from "@/components/sections/plan-comparison";
import { REALITY } from "@/lib/content";

// The one place the page shows rather than tells: the builder's brochure against
// the sanctioned drawing of the same site.
export function RealityCheck() {
  return (
    <section
      id="reality"
      className="lazy-section bg-surface-sunken py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <div className="grid items-center gap-10 rounded-panel bg-surface-raised p-5 shadow-lg sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14 lg:p-12">
          <div>
            <SectionHeading
              eyebrow={REALITY.eyebrow}
              heading={REALITY.heading}
              sub={REALITY.body}
            />
          </div>
          <PlanComparison />
        </div>
      </div>
    </section>
  );
}
