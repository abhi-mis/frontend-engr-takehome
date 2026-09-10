import { SectionHeading } from "@/components/section-heading";
import { FaqTabs } from "@/components/sections/faq-tabs";
import { PrimaryCta } from "@/components/primary-cta";
import { FAQ_CTA, FAQ_GROUPS, FAQ_SECTION } from "@/lib/faq";

/**
 * The FAQ, and the card underneath it.
 *
 * 32 questions in four categories, which is a lot of text to put on a landing
 * page, so the shape matters more than usual:
 *
 * - Categories are TABS, not four stacked lists. Four headings each followed by
 *   six to twelve collapsed rows makes a page you scroll past; one set of rows
 *   with a filter above it makes a page you use.
 * - Answers are an ACCORDION and start closed. A FAQ is a lookup table, not
 *   prose, and 32 open answers is not a page anyone reads.
 * - Every question is a real <h3> inside a button, so the section has a proper
 *   outline rather than 32 anonymous clickable divs.
 *
 * The section shell is a Server Component. Only the tabs and accordion
 * hydrate, and all 32 questions and all of their answers are in the served
 * HTML, so the whole FAQ is indexable and readable before any JavaScript.
 */
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

        {/* ----------------------------------------------------------------
            The closing card.

            Theirs is a flat orange band with the copy on the left and a white
            button on the right. This keeps that shape and its three strings,
            and fixes the two things wrong with it: a white button on bright
            orange is a 2.80:1 boundary, and a flat fill next to a page built
            on layered depth looks like a different site.

            So: the deep brand orange, which the white label and the card's own
            edge both clear comfortably, and a soft radial to give the fill some
            light.

            The artwork used to be Propsoch's spectacles graphic. It was a
            stock-feeling object that said nothing about this card, which is a
            card about talking to a person: "Still have questions?", "We are
            always here for you", "Book A Free Call". Two chat bubbles say that.
            The reply carries their four pointed spark, the same mark now in the
            hero pin, so the answer is visibly Propsoch's.

            Inline svg rather than an image, so it costs no request (the old
            graphic was an 11 KB fetch), scales without a srcset, and picks up
            currentColor instead of shipping baked-in pixels.
        ---------------------------------------------------------------- */}
        <div className="relative isolate mt-14 overflow-hidden rounded-panel bg-brand-strong shadow-lg">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_140%_at_12%_0%,rgba(255,255,255,0.22)_0%,transparent_60%)]"
          />

          <div className="flex flex-col items-center gap-6 px-6 py-8 text-center sm:px-10 md:flex-row md:justify-between md:gap-10 md:text-left lg:px-14 lg:py-10">
            <div className="flex flex-col items-center gap-5 md:flex-row md:gap-7">
              {/* A question and its answer. Decorative, so aria-hidden: the
                  heading beside it already says what this card is. */}
              <svg
                aria-hidden
                viewBox="0 0 132 104"
                fill="none"
                className="h-auto w-[7.5rem] shrink-0 drop-shadow-[0_10px_20px_rgba(26,18,6,0.22)] sm:w-32"
              >
                {/* The question, behind and translucent: someone else's, not
                    yet answered. Three dots rather than a "?" glyph, because a
                    punctuation mark at this size reads as a typo. */}
                <path
                  d="M8 18a12 12 0 0 1 12-12h58a12 12 0 0 1 12 12v28a12 12 0 0 1-12 12H36l-16 13V58a12 12 0 0 1-12-12Z"
                  fill="#fff"
                  fillOpacity="0.22"
                />
                {[36, 50, 64].map((cx) => (
                  <circle key={cx} cx={cx} cy="32" r="4" fill="#fff" fillOpacity="0.5" />
                ))}

                {/* The reply, in front and solid, carrying their mark. */}
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
                <h3 className="text-2xl font-bold text-white">
                  {FAQ_CTA.heading}
                </h3>
                {/* Solid white, not white/85.
                    I wrote the alpha first and then measured it: 85% white
                    composited over #C2410C resolves to #F6E3DB, which is
                    4.17:1 and FAILS AA for text this size. That is the same
                    mistake this build called out in shadcn's tab styling back
                    in entry 4, made by me, in the same way, because an alpha
                    looks like a colour and is not one. Hierarchy here comes
                    from size and weight instead, which cost nothing. */}
                <p className="text-base text-white">{FAQ_CTA.sub}</p>
              </div>
            </div>

            {/* The one place a white-filled button is right, because here the
                surface behind it is the brand colour rather than the page. */}
            <PrimaryCta
              size="lg"
              withArrow
              className="lift w-full shrink-0 bg-white text-brand-strong shadow-md hover:bg-white active:bg-white sm:w-auto"
            >
              {FAQ_CTA.cta}
            </PrimaryCta>
          </div>
        </div>
      </div>
    </section>
  );
}
