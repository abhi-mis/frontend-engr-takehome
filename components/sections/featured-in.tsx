import { PRESS } from "@/lib/content";
import { PRESS_LOGOS } from "@/lib/press.generated";

/**
 * "Featured in India's top media."
 *
 * Deliberately the quietest section on the page: one line and a row of logos.
 * Press coverage is a credibility stamp, not an argument, and giving it a full
 * heading block and a card would make it shout louder than the customer
 * testimonials it is meant to support.
 *
 * ZERO JAVASCRIPT
 *
 * Theirs is an Embla carousel with an autoscroll plugin, which is two libraries
 * and a rAF loop running forever to move five logos that already fit on one
 * line. This is a flex row that wraps. It costs nothing to run, it is readable
 * when stopped, and it does not animate in the background for the whole visit.
 *
 * Every logo links to the actual article. A press logo that links nowhere is
 * decoration pretending to be evidence.
 */
export function FeaturedIn() {
  return (
    <section
      id="press"
      className="lazy-section border-y border-line bg-surface-sunken py-10 sm:py-12"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 px-4 sm:px-6 lg:flex-row lg:justify-between lg:gap-10">
        {/* h2 because this is a section of the page, not a caption. Small and
            muted, because its job is to label the row, not to compete with it. */}
        <h2 className="text-center text-sm font-semibold tracking-[0.02em] text-ink-muted lg:shrink-0 lg:text-left">
          {PRESS.heading}
        </h2>

        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-10 lg:justify-end">
          {PRESS_LOGOS.map((logo) => (
            <li key={logo.src}>
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                // The link is named for what it does. The logo itself is then
                // decorative, so its alt is empty rather than repeating a name
                // the link already announces.
                aria-label={PRESS.linkLabel(logo.name)}
                className="group/press flex min-h-11 items-center rounded-inner focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-strong"
              >
                <img
                  src={logo.src}
                  width={logo.width}
                  height={logo.height}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  // mix-blend-multiply, and it is load-bearing rather than a
                  // flourish. These PNGs have transparent rounded CORNERS but an
                  // opaque white plate behind the artwork, so on this grey band
                  // each logo rendered as a white card. Multiplying white
                  // against the background yields the background, so the plate
                  // disappears and the dark artwork survives. It only works
                  // because this band is light; on a dark ground it would erase
                  // the logos instead.
                  //
                  // Greyscale so five competing brand palettes read as one row,
                  // colour on hover so the row still feels alive. Filter,
                  // opacity and blending are all paint-only.
                  className="h-[26px] w-auto opacity-70 mix-blend-multiply grayscale transition duration-200 group-hover/press:opacity-100 group-hover/press:grayscale-0 group-focus-visible/press:opacity-100 group-focus-visible/press:grayscale-0 sm:h-[30px]"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
