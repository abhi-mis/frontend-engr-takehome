import { SectionHeading } from "@/components/section-heading";
import { PrimaryCta } from "@/components/primary-cta";
import { CheckIcon } from "@/components/icons";
import { GUIDED, GUIDED_CAPABILITIES } from "@/lib/content";

// The closing argument. Light section with a raised card, rather than the dark
// band Propsoch use, because the page already spends its dark surface twice.
export function Guided() {
  return (
    <section id="guided" className="lazy-section bg-surface-sunken py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={GUIDED.eyebrow}
              heading={GUIDED.heading}
              sub={GUIDED.intro}
            />

            <ul className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {GUIDED_CAPABILITIES.map((capability) => (
                <li key={capability} className="flex items-start gap-3">
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
          <div className="guided-card rounded-panel bg-surface-raised p-6 shadow-lg sm:p-8">
            <h3 className="text-xl font-bold text-ink">{GUIDED.cardTitle}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
              {GUIDED.cardBody}
            </p>
            <p className="mt-7 flex flex-wrap items-baseline gap-x-2.5">
              <span className="text-sm font-semibold tracking-[0.08em] text-ink-muted uppercase">
                {GUIDED.savingsLabel}
              </span>
              <span className="text-2xl font-extrabold tracking-[-0.03em] text-brand-display tabular-nums">
                {GUIDED.savingsValue}
              </span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              {GUIDED.note}
            </p>
            <hr className="mt-6 border-line" />

            <p className="mt-6 text-sm leading-relaxed text-ink">
              {GUIDED.cardFooter}
            </p>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row lg:flex-col">
              <PrimaryCta withArrow className="lift w-full justify-center sm:w-auto lg:w-full">
                {GUIDED.primaryCta}
              </PrimaryCta>
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
