import { SectionHeading } from "@/components/section-heading";
import { ADVISORS, ADVISORS_SECTION } from "@/lib/content";

// Roles rather than people: no names or photographs are invented. Coverage areas
// are asserted against lib/pincodes.ts by a test.
export function Advisors() {
  return (
    <section id="advisors" className="lazy-section bg-surface py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <SectionHeading
          eyebrow={ADVISORS_SECTION.eyebrow}
          heading={ADVISORS_SECTION.heading}
          sub={ADVISORS_SECTION.intro}
        />

        <ul className="mt-12 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
          {ADVISORS.map((advisor) => (
            <li
              key={advisor.role + advisor.covers[0]}
              className="advisor-card bg-surface-raised p-6 sm:p-7 lg:p-8"
            >
              <h3 className="text-xl font-bold text-ink">{advisor.role}</h3>
              <p className="mt-1.5 text-sm font-semibold text-brand-strong">
                {advisor.credential}
              </p>
              <dl className="mt-5 grid gap-4">
                <div>
                  <dt className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
                    {ADVISORS_SECTION.coversLabel}
                  </dt>
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
