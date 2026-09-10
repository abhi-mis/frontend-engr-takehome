import { PrimaryCta } from "@/components/primary-cta";
import { SectionHeading } from "@/components/section-heading";
import { PROCESS_TESTIMONIAL, TIMELINE, TIMELINE_STEPS } from "@/lib/content";
import { PROCESS_AVATAR } from "@/lib/plan-media.generated";

// The 25 day process. Progress line and markers advance on scroll with CSS
// scroll-driven animations; without support everything is simply drawn in full.
export function Timeline() {
  return (
    <section
      id="timeline"
      className="lazy-section bg-ink py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start lg:py-2">
          <SectionHeading
            eyebrow={TIMELINE.eyebrow}
            heading={
              <>
                {TIMELINE.headingLead}{" "}

                <em className="font-semibold text-brand italic">
                  {TIMELINE.headingEmphasis}
                </em>
              </>
            }
            sub={TIMELINE.sub}
            tone="dark"
          />

          <div className="mt-9 flex flex-col gap-8">
            <PrimaryCta size="lg" withArrow className="lift w-fit">
              {TIMELINE.cta}
            </PrimaryCta>
            <figure className="flex max-w-[30rem] flex-col gap-4">
              <blockquote className="text-base leading-[1.6] text-ink-muted-on-dark">
                <p>
                  {PROCESS_TESTIMONIAL.quoteLead}
                  <em className="text-surface italic">
                    {PROCESS_TESTIMONIAL.quoteEmphasis}
                  </em>
                  {PROCESS_TESTIMONIAL.quoteTail}
                </p>
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <img
                  src={PROCESS_AVATAR.src}
                  width={PROCESS_AVATAR.width}
                  height={PROCESS_AVATAR.height}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-12 shrink-0 rounded-full bg-brand-soft object-cover"
                />
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-surface">
                    {PROCESS_TESTIMONIAL.name}
                  </span>
                  <span className="text-xs text-ink-muted-on-dark">
                    {PROCESS_TESTIMONIAL.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
        <ol className="timeline relative mt-12 flex flex-col gap-10 sm:gap-12 lg:mt-0">
          <div
            aria-hidden
            className="absolute top-2 bottom-2 left-[15px] w-0.5 rounded-full bg-surface/15 sm:left-[19px]"
          />
          <div
            aria-hidden
            className="timeline-progress absolute top-2 bottom-2 left-[15px] w-[3px] rounded-full bg-brand shadow-brand-glow sm:left-[18px]"
          />

          {TIMELINE_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative flex items-start gap-4 sm:gap-6"
            >
              <span
                aria-hidden
                className="timeline-marker relative z-10 flex size-[30px] shrink-0 items-center justify-center rounded-full bg-brand text-xs font-extrabold text-on-brand shadow-[0_0_0_4px_rgba(33,33,48,1),0_0_18px_rgba(255,109,50,0.5)] sm:size-10 sm:text-sm"
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1 pt-0.5 sm:pt-1.5">
                <p className="text-xs font-bold tracking-[0.14em] text-brand uppercase">
                  {step.marker}
                </p>
                <h3 className="mt-1.5 text-xl text-surface">{step.title}</h3>
                <p className="mt-2 max-w-xl text-base leading-relaxed text-ink-muted-on-dark">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
