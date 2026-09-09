import { SectionHeading } from "@/components/section-heading";
import { PlanComparison } from "@/components/sections/plan-comparison";
import { REALITY } from "@/lib/content";

/**
 * "Brokers show you the brochure. We show the reality."
 *
 * WHY IT SITS HERE
 *
 * Between the testimonials and the process. The page argues in order: here is
 * how we differ, here are customers saying it is true, here is the single
 * clearest piece of evidence, and now here is what working with us looks like.
 * This section is the evidence step, and it is the only place on the page that
 * shows rather than tells, so it earns the position immediately before the
 * process it justifies.
 *
 * The section shell is a Server Component. Only the slider hydrates, and the
 * heading, the body copy and both images are in the served HTML.
 */
export function RealityCheck() {
  return (
    <section
      id="reality"
      className="lazy-section bg-surface-sunken py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        {/* A raised card, the same treatment the comparison table and both tool
            panels use. It is what makes the ground read as a ground. */}
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
