import { PRESS } from "@/lib/content";
import { PRESS_LOGOS, type PressLogo } from "@/lib/press.generated";

/**
 * "Featured in India's top media."
 *
 * A warm band with the mastheads scrolling through it, continuously.
 *
 * WHAT THIS USED TO BE, AND WHY IT CHANGED
 *
 * This was a static flex row that wrapped, and the comment here argued for it:
 * their version is an Embla carousel with an autoscroll plugin, which is two
 * libraries and a requestAnimationFrame loop running forever to move five
 * logos that already fit on one line. That argument was against the COST, not
 * against the motion, and the band paid for it by being the flattest thing on
 * the page.
 *
 * So the motion is back and the cost is not. There is no carousel library, no
 * rAF loop and no client component. It is one CSS keyframe on a duplicated
 * row, which is the entire implementation.
 *
 * WHY THIS IS CHEAP, SPECIFICALLY
 *
 * The animation touches `transform` and nothing else. Transform is one of the
 * four properties Chrome can run entirely on the compositor, so a frame of
 * this costs no style resolution, no layout and no main-thread paint. That is
 * the distinction this codebase learned the hard way in
 * components/sections/typewriter.tsx, where animating a custom property that a
 * mask read cost 1.2 seconds of main thread over four seconds. Same page, same
 * kind of effect, opposite cost, because of which property is being animated.
 *
 * It also stops when nobody is looking. The section carries `lazy-section`,
 * which is `content-visibility: auto`, so while the band is outside the
 * viewport the browser skips its subtree entirely and the animation produces
 * no rendering work at all. The band is below the fold, so that is most of the
 * time on most visits.
 *
 * Nothing here can shift layout: every image carries its intrinsic width and
 * height, the cards are a fixed height, and the track is clipped rather than
 * sized by its contents.
 *
 * THE SECOND TRACK
 *
 * A seamless loop needs the row to be duplicated. Both copies translate by
 * -100% of their own width in lockstep, so at the moment the animation
 * restarts the second copy is sitting exactly where the first one began and
 * there is nothing to see. The duplicate is `aria-hidden` and its links are
 * `tabIndex={-1}`, so a screen reader reads five mastheads rather than ten and
 * the keyboard walks through five links rather than ten. The clones stay real
 * links anyway, because a logo scrolling past that does nothing when clicked
 * is worse than a duplicate in the DOM.
 *
 * PAUSING, AND WCAG 2.2.2
 *
 * Motion that starts on its own and runs longer than five seconds needs a way
 * to stop it. Three exist here: the track pauses on hover, it pauses on
 * `:focus-within` so a keyboard user is never chasing a moving link, and it is
 * switched off outright under `prefers-reduced-motion`, where the band falls
 * back to exactly the static wrapping row this section used to be.
 *
 * Every logo links to the actual article. A press logo that links nowhere is
 * decoration pretending to be evidence.
 */
export function FeaturedIn() {
  return (
    <section
      id="press"
      className="press-band lazy-section border-y border-line py-10 sm:py-12"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 px-4 sm:px-6 lg:flex-row lg:gap-10">
        {/* h2 because this is a section of the page, not a caption. Still
            small, so it labels the row rather than competing with it, but
            --color-ink rather than --color-ink-muted: this band is a warm
            wash now, and muted grey on it measured 4.3:1 at the saturated
            end. See the note on .press-band for why the text moved instead
            of the colour.

            The dot is the one spot of pure brand orange in the line, and it
            is a fill rather than text, which is the only thing #FF6D33 is
            allowed to be. */}
        <h2 className="flex items-center gap-2.5 text-center text-sm font-semibold tracking-[0.02em] text-ink lg:shrink-0 lg:text-left">
          <span aria-hidden className="press-dot" />
          {PRESS.heading}
        </h2>

        {/* The clip. Everything about the loop happens inside this box: the
            overflow that hides the second copy, and the mask that dissolves
            the logos at both edges instead of letting them hit a hard line. */}
        <div className="press-marquee">
          <ul className="press-track">
            {PRESS_LOGOS.map((logo) => (
              <PressItem key={logo.src} logo={logo} />
            ))}
          </ul>
          <ul className="press-track" aria-hidden="true">
            {PRESS_LOGOS.map((logo) => (
              <PressItem key={logo.src} logo={logo} cloned />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * One masthead.
 *
 * `cloned` marks the copy that exists only to close the loop: it keeps the
 * link so clicking still works, and loses its place in the tab order and the
 * accessibility tree so it is not announced twice.
 */
function PressItem({
  logo,
  cloned = false,
}: {
  readonly logo: PressLogo;
  readonly cloned?: boolean;
}) {
  return (
    <li>
      <a
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        // The link is named for what it does. The logo itself is then
        // decorative, so its alt is empty rather than repeating a name the
        // link already announces.
        aria-label={cloned ? undefined : PRESS.linkLabel(logo.name)}
        tabIndex={cloned ? -1 : undefined}
        className="press-card group/press"
      >
        <img
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt=""
          loading="lazy"
          decoding="async"
          // mix-blend-multiply is kept from the flat version, and it is still
          // load-bearing. These PNGs have transparent rounded CORNERS over an
          // opaque white plate, so the plate would show as a hard white
          // rectangle inside the card's rounded corners. Multiplying against
          // the white card erases the plate and leaves the artwork, and it
          // only works because the card underneath is white. Put these on a
          // dark ground and the logos disappear instead.
          //
          // Greyscale so five competing brand palettes read as one row, colour
          // on hover so the row rewards a look. Filter, opacity and blending
          // are all paint-only and none of them run per frame.
          className="h-[26px] w-auto opacity-90 mix-blend-multiply grayscale transition duration-200 group-hover/press:opacity-100 group-hover/press:grayscale-0 group-focus-visible/press:opacity-100 group-focus-visible/press:grayscale-0 sm:h-[30px]"
        />
      </a>
    </li>
  );
}
