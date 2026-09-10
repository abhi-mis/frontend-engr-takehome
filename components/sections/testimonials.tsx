import { SectionHeading } from "@/components/section-heading";
import { TestimonialGrid } from "@/components/sections/testimonial-grid";
import { TESTIMONIALS, TESTIMONIALS_SECTION } from "@/lib/content";

/**
 * Video testimonials, placed directly after the comparison.
 *
 * WHY HERE
 *
 * The comparison is the page's argument: here is what a broker does, here is
 * what we do. An argument invites the obvious question, which is "says who".
 * Three real customers answering it in their own recorded voices is the
 * strongest possible next beat, and putting it anywhere later would mean asking
 * the reader to take the comparison on trust through two more sections first.
 *
 * The section shell is a SERVER component and only the grid hydrates. All three
 * quotes, both names on each, every role and all three posters are in the
 * served HTML, so the social proof is readable before any JavaScript arrives
 * and a crawler sees all of it. That is worth stating because the original does
 * the opposite: its carousel keeps only the active slide's quote in the DOM, so
 * two thirds of this content is invisible to a crawler at any moment.
 */
export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="testimonials-section lazy-section bg-surface py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow={TESTIMONIALS_SECTION.eyebrow}
          heading={TESTIMONIALS_SECTION.heading}
          className="testimonials-heading"
        />

        <TestimonialGrid items={TESTIMONIALS} />
      </div>
    </section>
  );
}
