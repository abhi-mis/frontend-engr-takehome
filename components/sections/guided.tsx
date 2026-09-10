import { SectionHeading } from "@/components/section-heading";
import { PrimaryCta } from "@/components/primary-cta";
import { CheckIcon } from "@/components/icons";
import { GUIDED, GUIDED_CAPABILITIES } from "@/lib/content";

/**
 * "Choose the smart way to save ~Rs 4.78 L & 3 months of your life."
 *
 * The closing argument. Everything the service does, in one list, beside what
 * it is worth and what it costs to start.
 *
 * WHY IT SITS HERE
 *
 * Last of the argument sections, after the advisors and before the press band
 * and the FAQ. The page has by this point made the case (how we differ),
 * proved it (testimonials), shown the evidence (the reality check), taught the
 * skill (the floor plan), laid out the process (25 days) and introduced the
 * people. This is the summary you get once all of that is behind you, which is
 * the only point at which a list of six capabilities is a recap rather than a
 * list of claims you have no reason to believe yet.
 *
 * WHAT THE REDESIGN CHANGED
 *
 * Propsoch's own version is a dark band with a dark card inside it. Two things
 * argued against copying that directly:
 *
 * 1. This page already spends its dark surface. The timeline is `--color-ink`
 *    and so is the footer's closing panel. A third dark block, two sections
 *    from the second one, would stop reading as emphasis and start reading as
 *    the page's default.
 * 2. A dark card on a dark band is the one arrangement where their own layout
 *    struggles: the card is distinguishable from the ground almost entirely by
 *    a hairline border.
 *
 * So the ground is the sunken step and the card is raised white, which is the
 * same figure-and-ground language the comparison table, the reality check and
 * both tool panels already use. The card earns its weight from the brand
 * orange and one shadow rather than from darkness, and the savings figure gets
 * to be the loudest thing in the section instead of competing with a dark
 * panel for attention.
 *
 * Server Component. No state, no interaction, zero client JavaScript.
 */
export function Guided() {
  return (
    <section id="guided" className="lazy-section bg-surface-sunken py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          {/* Left: the recap. */}
          <div>
            <SectionHeading
              eyebrow={GUIDED.eyebrow}
              heading={GUIDED.heading}
              sub={GUIDED.intro}
            />

            {/* Six capabilities, two columns from sm up.
                A plain list with a tick against each, rather than six cards:
                these are one thing said six ways, and giving each its own
                surface would have made them read as six separate offers. */}
            <ul className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {GUIDED_CAPABILITIES.map((capability) => (
                <li key={capability} className="flex items-start gap-3">
                  {/* The tick is the same brand-strong on brand-tint chip the
                      comparison table uses for a Propsoch cell, so "this is
                      something you get" looks the same wherever it appears. */}
                  <span
                    aria-hidden
                    className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint"
                  >
                    <CheckIcon className="size-3.5 text-brand-strong" />
                  </span>
                  <span className="text-[0.9375rem] leading-snug text-ink">
                    {capability}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: the offer. */}
          <div className="guided-card rounded-panel bg-surface-raised p-6 shadow-lg sm:p-8">
            <h3 className="text-xl font-bold text-ink">{GUIDED.cardTitle}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
              {GUIDED.cardBody}
            </p>

            {/* The number, and the loudest thing in the section.
                brand-display rather than brand: at this size it clears the
                3:1 large-text bar (3.41:1), where the bright brand orange is
                2.71:1 and cannot be text at any size. Same rule as the hero
                headline accent. */}
            <p className="mt-7 flex flex-wrap items-baseline gap-x-2.5">
              <span className="text-sm font-semibold tracking-[0.08em] text-ink-muted uppercase">
                {GUIDED.savingsLabel}
              </span>
              <span className="text-2xl font-extrabold tracking-[-0.03em] text-brand-display tabular-nums">
                {GUIDED.savingsValue}
              </span>
            </p>

            {/* Required by the brief: an estimate is labelled illustrative on
                screen, not in a tooltip. Propsoch print this figure bare
                because on their page it sits under a calculator you have just
                moved the sliders on. Here it does not. */}
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              {GUIDED.note}
            </p>

            <hr className="mt-6 border-line" />

            <p className="mt-6 text-sm leading-relaxed text-ink">
              {GUIDED.cardFooter}
            </p>

            {/* Side by side only while the card is full width. In the narrow
                right hand column at lg and up there is not room for two, and
                "See How You Will Save" was wrapping onto a second line inside
                its own button. */}
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row lg:flex-col">
              <PrimaryCta withArrow className="lift w-full justify-center sm:w-auto lg:w-full">
                {GUIDED.primaryCta}
              </PrimaryCta>

              {/* Subordinate, and an outline rather than a second filled
                  button: two equal-weight CTAs side by side is the exact
                  problem this rebuild's hero was fixing. */}
              <button
                type="button"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-line-strong px-5 text-sm font-semibold text-ink transition-colors hover:border-brand-strong hover:text-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong sm:w-auto lg:w-full"
              >
                {GUIDED.secondaryCta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
