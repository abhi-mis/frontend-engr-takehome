import { CheckIcon, CrossIcon } from "@/components/icons";
import { ComparisonTabs } from "@/components/sections/comparison-tabs";
import { SectionHeading } from "@/components/section-heading";
import { COMPARISON, COMPARISON_ROWS } from "@/lib/content";

/**
 * "How are we different?" Server Component shell.
 *
 * Two layouts, and this is the ONE place on the page where two DOM trees are
 * justified. A semantic four column `<table>` and a two-up tabbed list are
 * genuinely different components, not the same content at two sizes. Everywhere
 * else responsiveness is CSS over a single tree, because the original renders
 * its entire page twice (716 mobile nodes plus 780 desktop nodes out of 2029
 * total) and pays the hydration cost for both on every visit.
 *
 * The desktop table is a Server Component and ships zero JavaScript. Only the
 * mobile tabs are a client island.
 *
 * Both trees sit in the DOM and are toggled with `hidden md:block` and
 * `md:hidden`. `display: none` removes a subtree from the accessibility tree, so
 * a screen reader encounters exactly one copy of the comparison, not two.
 */
export function Comparison() {
  return (
    <section
      id="comparison"
      className="lazy-section relative isolate bg-surface-sunken py-20 sm:py-28"
    >
      {/* One quiet signature per section, so the page's visual interest is
          spread across it instead of all spent in the hero. A soft brand wash
          in the corner the Propsoch column sits under, aimed at the same top
          right the table's highlighted column occupies.

          Decorative, aria-hidden, pointer-events-none, and behind the content
          on the z-axis, so it cannot intercept a click or reach a screen
          reader. */}
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

        {/* ------------------------------------------------------------------
            Mobile and small tablet: the tabbed two-up comparison.
        ------------------------------------------------------------------ */}
        <div className="mt-8 md:hidden">
          <ComparisonTabs />
        </div>

        {/* ------------------------------------------------------------------
            Desktop: a real table. Zero JavaScript.

            Semantics matter here beyond passing an audit. With `scope="col"` on
            the provider headers and `scope="row"` on each criterion, a screen
            reader announces "Transparency, Propsoch, Detailed pros and cons"
            when navigating cells. Without the scopes it reads a flat grid of
            phrases with no idea which column it is in.
        ------------------------------------------------------------------ */}
        <div className="mt-10 hidden md:block">
          {/* The table now sits on a RAISED card rather than directly on the
              section. With the section moved to the sunken step, a card is
              what separates the data from the ground, and it does it with
              depth rather than with the 1px outline this used to rely on. */}
          <div className="rounded-card bg-surface-raised p-3 shadow-md sm:p-5">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">{COMPARISON.caption}</caption>

            <thead>
              <tr>
                <th
                  scope="col"
                  className="w-[24%] border-b border-line px-4 py-4 align-bottom text-xs font-bold tracking-wide text-ink-muted uppercase"
                >
                  {COMPARISON.criteriaHeader}
                </th>

                {/* The Propsoch column is highlighted with a tint, a brand top
                    edge and a stronger label. Deliberately NOT with a larger
                    font or extra padding, which would knock the columns out of
                    alignment and make the table harder to scan across. */}
                <th
                  scope="col"
                  className="w-[28%] rounded-t-card border-t-4 border-brand bg-brand-tint px-4 py-4 align-bottom text-base font-bold text-brand-strong"
                >
                  {COMPARISON.propsochHeader}
                </th>

                <th
                  scope="col"
                  className="w-[24%] border-b border-line px-4 py-4 align-bottom text-base font-semibold text-ink-muted"
                >
                  {COMPARISON.localBrokersHeader}
                </th>

                <th
                  scope="col"
                  className="w-[24%] border-b border-line px-4 py-4 align-bottom text-base font-semibold text-ink-muted"
                >
                  {COMPARISON.onlinePortalsHeader}
                </th>
              </tr>
            </thead>

            <tbody>
              {COMPARISON_ROWS.map((row, index) => {
                const isLast = index === COMPARISON_ROWS.length - 1;

                return (
                  <tr key={row.criteria}>
                    <th
                      scope="row"
                      className="border-b border-line px-4 py-4 align-top text-sm font-semibold text-ink"
                    >
                      {row.criteria}
                    </th>

                    <td
                      className={`bg-brand-tint px-4 py-4 align-top text-sm font-medium text-ink ${
                        isLast ? "rounded-b-xl" : ""
                      }`}
                    >
                      <span className="flex items-start gap-2">
                        <CheckIcon
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0 text-brand-strong"
                        />
                        {row.propsoch}
                      </span>
                    </td>

                    <td className="border-b border-line px-4 py-4 align-top text-sm text-ink-muted">
                      <span className="flex items-start gap-2">
                        <CrossIcon
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0 text-ink-muted"
                        />
                        {row.localBrokers}
                      </span>
                    </td>

                    <td className="border-b border-line px-4 py-4 align-top text-sm text-ink-muted">
                      <span className="flex items-start gap-2">
                        <CrossIcon
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0 text-ink-muted"
                        />
                        {row.onlinePortals}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </section>
  );
}
