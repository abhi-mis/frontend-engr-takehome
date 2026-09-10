import { SectionHeading } from "@/components/section-heading";
import { TestimonialGrid } from "@/components/sections/testimonial-grid";
import { TESTIMONIALS, TESTIMONIALS_SECTION } from "@/lib/content";

// Section shell for the video testimonials.
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
