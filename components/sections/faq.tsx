import { SectionHeading } from "@/components/section-heading";
import { FaqTabs } from "@/components/sections/faq-tabs";
import { PrimaryCta } from "@/components/primary-cta";
import { FAQ_CTA, FAQ_GROUPS, FAQ_SECTION } from "@/lib/faq";

// 32 questions as tabs plus an accordion. All of it is in the served HTML.
export function Faq() {
  return (
    <section id="faq" className="lazy-section bg-surface py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <SectionHeading
          eyebrow={FAQ_SECTION.eyebrow}
          heading={FAQ_SECTION.heading}
          sub={FAQ_SECTION.sub}
        />

        <FaqTabs groups={FAQ_GROUPS} />

        <div className="relative isolate mt-14 overflow-hidden rounded-panel bg-brand-button shadow-lg">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_140%_at_12%_0%,rgba(255,255,255,0.28)_0%,transparent_60%)]"
          />

          <div className="flex flex-col items-center gap-6 px-6 py-8 text-center sm:px-10 md:flex-row md:justify-between md:gap-10 md:text-left lg:px-14 lg:py-10">
            <div className="flex flex-col items-center gap-5 md:flex-row md:gap-7">
              <svg
                aria-hidden
                viewBox="0 0 132 104"
                fill="none"
                className="h-auto w-[7.5rem] shrink-0 drop-shadow-[0_10px_20px_rgba(26,18,6,0.22)] sm:w-32"
              >
                <path
                  d="M8 18a12 12 0 0 1 12-12h58a12 12 0 0 1 12 12v28a12 12 0 0 1-12 12H36l-16 13V58a12 12 0 0 1-12-12Z"
                  fill="#fff"
                  fillOpacity="0.22"
                />
                {[36, 50, 64].map((cx) => (
                  <circle key={cx} cx={cx} cy="32" r="4" fill="#fff" fillOpacity="0.5" />
                ))}

                <path
                  d="M124 56a12 12 0 0 0-12-12H62a12 12 0 0 0-12 12v22a12 12 0 0 0 12 12h44l16 12V78a12 12 0 0 0 2-22Z"
                  fill="#fff"
                />
                <path
                  d="M87 55c0 6.63 5.37 12 12 12-6.63 0-12 5.37-12 12 0-6.63-5.37-12-12-12 6.63 0 12-5.37 12-12Z"
                  fill="var(--color-brand-strong)"
                />
              </svg>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-2xl font-bold text-on-brand">
                  {FAQ_CTA.heading}
                </h3>
                <p className="text-base text-on-brand">{FAQ_CTA.sub}</p>
              </div>
            </div>
            <PrimaryCta
              size="lg"
              withArrow
              className="lift w-full shrink-0 bg-white text-brand-strong shadow-lg hover:bg-white active:bg-white sm:w-auto"
            >
              {FAQ_CTA.cta}
            </PrimaryCta>
          </div>
        </div>
      </div>
    </section>
  );
}
