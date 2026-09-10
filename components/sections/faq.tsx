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
            button on the right. This keeps that shape and its three strings.

            THE FILL IS THE BUTTON'S OWN ORANGE, NOT THE DARKENED ONE.

            This card used to sit on `--color-brand-strong` (#C2410C), the
            same deep rust the primary button only ever reaches at its ACTIVE
            state. Every button on the page rests at the bright
            `--color-brand-button` (#FF6D33), so a card that opens on the
            button's resting colour and closes on its pressed one read as two
            different oranges rather than one brand.

            The fill is `bg-brand-button` now, matching the button family at
            rest, and the copy moved from white to `--color-on-brand`
            (#1A1206): white is only 2.80:1 on this brighter orange and fails
            AA, the same number the ORIGINAL site's white-on-orange button
            was called out for. `--color-on-brand` is the one foreground this
            palette allows on bright brand orange (6.61:1, the same pairing
            the Bromatker ribbon and the timeline markers already use), so
            the card gets the brighter fill without reintroducing the bug the
            darker fill existed to avoid.

            The one thing that does NOT get the full 6.61:1 treatment is the
            white "Book A Free Call" button's own edge against this fill: it
            softens from 5.18:1 (against the old dark rust) to 2.80:1 (against
            this brighter one), the same number as the text swap above. Its
            shadow is what now carries the boundary rather than the fill, which
            is a deliberate, visible trade rather than a silent one — see the
            ACCEPTED_DEVIATIONS entry in scripts/check-contrast.mjs.

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
        <div className="relative isolate mt-14 overflow-hidden rounded-panel bg-brand-button shadow-lg">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_140%_at_12%_0%,rgba(255,255,255,0.28)_0%,transparent_60%)]"
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
                <h3 className="text-2xl font-bold text-on-brand">
                  {FAQ_CTA.heading}
                </h3>
                {/* Solid on-brand, not on-brand/70.
                    Same lesson as before, moved to the new fill: an alpha's
                    contrast depends on what it composites against, not on the
                    number in the class name, and the earlier version of this
                    card was caught out by exactly that once already (see the
                    white/85 note this replaced). Hierarchy here comes from
                    size and weight instead, which cost nothing. */}
                <p className="text-base text-on-brand">{FAQ_CTA.sub}</p>
              </div>
            </div>

            {/* The one place a white-filled button is right, because here the
                surface behind it is the brand colour rather than the page. */}
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
