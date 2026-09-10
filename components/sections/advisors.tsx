import { SectionHeading } from "@/components/section-heading";
import { ADVISORS, ADVISORS_SECTION } from "@/lib/content";

/**
 * "The people who will actually advise you."
 *
 * WHY IT SITS HERE
 *
 * Directly after the timeline. The page has just spent five steps describing
 * what happens in 25 days, and the obvious next question about a service sold
 * on judgement is "whose judgement". Putting it before the process would have
 * been four job titles arriving before there was any work for them to do.
 *
 * WHAT MAKES IT A SECTION RATHER THAN A TEAM PAGE
 *
 * There are no faces and no names, and that is the design rather than a gap
 * waiting to be filled. The comparison table's claim is "Trained architects"
 * against "Local sales people", which is a claim about QUALIFICATION and
 * COVERAGE, not about individuals. So the card leads with the role, states the
 * qualification in Propsoch's own words, and then answers the two questions a
 * buyer actually has: do you know my area, and what will you look at. A
 * headshot answers neither.
 *
 * The honesty line at the bottom is on screen, not in this comment. See the
 * provenance block above ADVISORS in lib/content.ts for what is quoted and
 * what is deliberately absent.
 *
 * ONE HAIRLINE GRID, NOT FOUR FLOATING CARDS
 *
 * The four sit in a single bordered panel divided by hairlines, which is the
 * `gap-px` over a `bg-line` ground trick: the parent's background shows
 * through one pixel gaps between opaque children. Four separate shadowed cards
 * would have read as four separate offers. These four are one team, and the
 * shared frame is what says so.
 *
 * Server Component. No state, no interaction, zero client JavaScript.
 */
export function Advisors() {
  return (
    <section id="advisors" className="lazy-section bg-surface py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <SectionHeading
          eyebrow={ADVISORS_SECTION.eyebrow}
          heading={ADVISORS_SECTION.heading}
          sub={ADVISORS_SECTION.intro}
        />

        {/* The hairline grid. `overflow-hidden` is what lets the rounded
            corners clip the opaque children, and it is why the children carry
            no radius of their own. */}
        <ul className="mt-12 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
          {ADVISORS.map((advisor) => (
            <li
              key={advisor.role + advisor.covers[0]}
              className="advisor-card bg-surface-raised p-6 sm:p-7 lg:p-8"
            >
              <h3 className="text-xl font-bold text-ink">{advisor.role}</h3>

              {/* brand-strong, not brand. At this size the bright orange is
                  2.71:1 and cannot be text at all; the darkened one is 5.00:1
                  on this surface. Same rule as every other orange label on the
                  page, asserted in scripts/check-contrast.mjs. */}
              <p className="mt-1.5 text-sm font-semibold text-brand-strong">
                {advisor.credential}
              </p>

              <dl className="mt-5 grid gap-4">
                <div>
                  <dt className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
                    {ADVISORS_SECTION.coversLabel}
                  </dt>
                  {/* The areas are a list semantically and a sentence
                      visually. The separator is a real character rather than a
                      border, so it survives a line wrap in the middle of the
                      row without leaving a hanging rule. */}
                  <dd className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9375rem] leading-snug text-ink">
                    {advisor.covers.map((area, i) => (
                      <span key={area} className="flex items-center gap-2">
                        {i > 0 && (
                          <span aria-hidden className="advisor-dot" />
                        )}
                        {area}
                      </span>
                    ))}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
                    {ADVISORS_SECTION.looksAtLabel}
                  </dt>
                  <dd className="mt-1.5 text-[0.9375rem] leading-snug text-ink">
                    {advisor.looksAt}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

        <p className="mt-5 max-w-3xl text-xs leading-relaxed text-ink-muted">
          {ADVISORS_SECTION.footnote}
        </p>
      </div>
    </section>
  );
}
