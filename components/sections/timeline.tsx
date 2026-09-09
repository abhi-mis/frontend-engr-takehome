import { PrimaryCta } from "@/components/primary-cta";
import { SectionHeading } from "@/components/section-heading";
import { PROCESS_TESTIMONIAL, TIMELINE, TIMELINE_STEPS } from "@/lib/content";
import { PROCESS_AVATAR } from "@/lib/plan-media.generated";

/**
 * "Here's how you will find a home with us in 25 days."
 *
 * Server Component. ZERO client JavaScript, including the scroll progress.
 *
 * THE BUG THIS FIXES
 *
 * The original puts these steps inside an inner scroll container that gives no
 * affordance that it scrolls, so most people never learn there is more content.
 * The instinct is to add a scrollbar, a gradient hint or arrows. All of those
 * treat the symptom.
 *
 * The actual fix is to delete the inner scroll container. The steps now flow
 * with the page, so there is no hidden content to discover and no affordance
 * needed. A vertical timeline is the natural shape for an ordered process
 * anyway, and page scroll is an affordance every user already understands.
 *
 * WHY IT IS AN <ol>
 *
 * This is an ordered process where the order carries meaning. An `<ol>` makes a
 * screen reader announce "list, 5 items, item 1 of 5", which conveys both the
 * sequence and the length. A stack of `<div>`s conveys neither.
 *
 * HOW THE PROGRESS LINE WORKS
 *
 * CSS scroll-driven animations, see `.timeline` in app/globals.css. The rail is
 * a static track with a filled bar on top of it whose `scaleY` is driven by the
 * section's own view timeline.
 *
 * The important part is the fallback, not the animation. `.timeline-progress`
 * defaults to `scaleY(1)`, fully drawn, and `.timeline-marker` defaults to
 * `opacity: 1`. The `@supports (animation-timeline: view())` block then
 * OVERRIDES those to animate. So a browser without scroll-driven animation
 * support, or a visitor who has asked for reduced motion, gets a complete static
 * timeline rather than an empty one. The enhancement is the override and the
 * accessible state is the default, which is the right way round: write it the
 * other way and the fallback is the state you never test.
 */
export function Timeline() {
  return (
    <section
      id="timeline"
      // THE DARK SECTION.
      //
      // The page was four light sections in a row, which is most of why it read
      // as unfinished: no rhythm, nothing to break the scroll, every section
      // arriving with the same weight. One dark surface fixes that, and this is
      // the right section for it. The progress line and the step markers are
      // the page's most orange elements, and orange on near-black is where the
      // brand colour is at its strongest.
      //
      // It also unlocks something the light version could not have: on
      // --color-ink the bright #FF6D33 is 5.65:1, so the week markers can be
      // real orange TEXT here rather than the darkened tint they need on light.
      className="lazy-section bg-ink py-24 sm:py-32"
    >
      {/* Desktop layout note, and a deliberate deviation from the plan.
          The plan sketched a centred rail with steps alternating left and right.
          Built and looked at, that pattern has two real costs: the visual order
          stops matching the DOM order (so a sighted user's reading path and a
          screen reader user's differ), and alternating measure makes a five step
          process harder to scan than a single column. Instead the heading takes
          its own sticky column on large screens, which fills the space that was
          otherwise empty, keeps one reading column for the steps, and holds the
          section title in view while you scroll the process. */}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start lg:py-2">
          <SectionHeading
            eyebrow={TIMELINE.eyebrow}
            heading={
              <>
                {TIMELINE.headingLead}{" "}
                {/* Their own h2 sets this semibold italic, and it is the only
                    part of the sentence that is a promise rather than a
                    preamble. em rather than i, because the emphasis is
                    meaningful and not merely typographic. */}
                <em className="font-semibold text-brand italic">
                  {TIMELINE.headingEmphasis}
                </em>
              </>
            }
            sub={TIMELINE.sub}
            tone="dark"
          />

          {/* The CTA and the written testimonial, both of which their process
              section has and this rebuild was missing.

              They live in the sticky column rather than after the steps: on a
              large screen this column is pinned while the five steps scroll
              past it, so the action stays reachable for the whole section
              instead of only at the bottom of it. On small screens the column
              is not sticky and they simply sit above the steps, which is where
              their page puts them too. */}
          <div className="mt-9 flex flex-col gap-8">
            <PrimaryCta size="lg" withArrow className="lift w-fit shadow-sm">
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
                {/* Dimensioned and lazy like every other image here. The
                    brand-soft ring is the same colour their avatar component
                    uses, and it doubles as the fallback ground if the file
                    ever fails to load. */}
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

        {/* `.timeline` owns the view timeline that the progress bar animates
            against. `relative` anchors the rail. */}
        <ol className="timeline relative mt-12 flex flex-col gap-10 sm:gap-12 lg:mt-0">
          {/* The rail. Two layers: a static track, and a filled bar that grows
              with scroll. Both are aria-hidden, they are pure ornament, the
              sequence is already conveyed by the <ol>.

              Positioned at 15px from the left so it runs through the centre of
              the 30px markers on mobile. On sm and up the markers grow to 40px
              and the rail moves to 19px to stay centred. */}
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
              {/* Step marker. Brand fill with a brand-strong ring, which is the
                  bright brand orange with no ring. On the light page a ring was
                  required, because a #FF6D33 fill is 2.71:1 there and fails
                  WCAG 1.4.11. On --color-ink the same fill is 5.65:1, so the
                  boundary is legible on its own and the ring would only muddy
                  it. The 4px ink shadow is a spacer that keeps the rail from
                  touching the disc; the numeral is --color-on-brand at 6.61:1,
                  never white. */}
              <span
                aria-hidden
                className="timeline-marker relative z-10 flex size-[30px] shrink-0 items-center justify-center rounded-full bg-brand text-xs font-extrabold text-on-brand shadow-[0_0_0_4px_rgba(33,33,48,1),0_0_18px_rgba(255,109,50,0.5)] sm:size-10 sm:text-sm"
              >
                {index + 1}
              </span>

              <div className="min-w-0 flex-1 pt-0.5 sm:pt-1.5">
                {/* The week marker. Real text, so it is read out, and the step
                    number above is decorative rather than duplicated. */}
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
