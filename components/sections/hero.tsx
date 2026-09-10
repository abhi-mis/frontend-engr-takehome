import { HeroRouteArt } from "@/components/brand/hero-route-art";
import { PrimaryCta } from "@/components/primary-cta";
import { HERO, STATS } from "@/lib/content";
import { TRUST_LOGOS } from "@/lib/logos.generated";

/**
 * Hero. Server Component, zero client JavaScript.
 *
 * The copy is Propsoch's own, unchanged. What the redesign changes is the
 * ORDER, the weight, and the motion.
 *
 * The original's mobile hero runs: headline, city selector, "Propsoch Kar",
 * "Already a member? Login", and only then the sentence that explains what the
 * service actually is. It asks before it explains. This one runs headline,
 * value proposition, single primary action, then the numbers and the trust
 * strip, which is UX fix 2.
 *
 * WHAT THIS PASS REMOVED, AND WHY THAT IS THE POINT
 *
 * The hero previously opened with an "Independent advisors" pill, then the
 * headline, then a full-bleed scrolling Bromatker ribbon underneath. Three
 * separate things competing to be looked at first, before a single one of them
 * had been read. Both the pill and the ribbon are gone. What is left is the
 * headline, one sentence, one action, the numbers, and the logos, which is the
 * actual hierarchy.
 *
 * A hero reads as premium when it is confident about what matters, and
 * confidence is mostly subtraction.
 *
 * COLOUR
 *
 * The brand orange is rgb(255, 109, 50), taken from Propsoch's own logo fill.
 * It cannot be text at any size (2.71:1 on this background, below even the 3:1
 * large-text bar), so it earns its presence here as FILL: the stat chips, the
 * artwork, the typewriter caret. Display type uses --color-brand-display, the
 * brightest orange that clears 3:1 at >=24px, so the headline reads as Propsoch
 * orange rather than as rust.
 *
 * LCP
 *
 * The h1 is the largest contentful element: server-rendered text with one
 * self-hosted font in front of it. Its first line NEVER animates. See the note
 * at the headline for how the typewriter stays off the critical path.
 */
export function Hero() {
  return (
    <section className="hero-home relative isolate overflow-hidden">
      {/* --------------------------------------------------------------
          Background. Three layers, all CSS, no image, so nothing here can
          compete with the headline to become the LCP element.
      -------------------------------------------------------------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* A warm base wash. ONE radial, not two.

            This used to layer an orange wash from the top left and a yellow one
            from the top right. Two washes crossing in the middle produced a
            muddy third colour where they met, and the hero was carrying five
            simultaneous effects on top of them. Subtracting is what made the
            section read as designed: a single light source is more convincing
            than several competing ones. */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_12%_-10%,color-mix(in_oklch,var(--color-brand)_12%,transparent)_0%,transparent_60%)]" />

        {/* A large blurred orange blob behind the artwork, drifting slowly.
            Gives the composition depth without an asset. Hidden below lg along
            with the artwork it sits behind: with nothing there to light, it was
            just a peach smear across the top of the phone screen. */}
        <div className="animate-drift absolute top-[-12%] right-[-12%] hidden size-[46rem] rounded-full bg-[color-mix(in_oklch,var(--color-brand)_18%,transparent)] blur-[90px] lg:block" />

        {/* A faint dot grid, masked so it fades out before the text. Pure CSS
            gradients, so it costs bytes in the stylesheet and nothing else. */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--color-line-strong) 1px, transparent 0)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(80% 60% at 50% 0%, black 0%, transparent 75%)",
          }}
        />
      </div>

      {/* Vertical rhythm is tighter at the top than it was. With the eyebrow
          pill gone the headline is the first thing in the column, so the old
          pt-12/16/20 left it floating in dead space instead of opening the
          page. */}
      <div className="hero-home-layout mx-auto grid w-full max-w-[1340px] grid-cols-1 items-center gap-8 px-5 pt-7 pb-6 sm:px-8 sm:pt-10 lg:grid-cols-[minmax(0,0.94fr)_minmax(460px,1.06fr)] lg:gap-8 lg:px-10 lg:pt-14 lg:pb-10 xl:gap-14">
        <div className="hero-home-copy relative flex flex-col items-start lg:pb-2">
          {/* The headline.

              THE LCP RULE, AND WHERE THE TYPEWRITER SITS RELATIVE TO IT

              The first line, "Blindly trusting a broker's", is NEVER animated.
              It paints at full opacity in the first frame. That matters because
              the headline is this page's LCP element, and fading an LCP element
              in from opacity 0 is the single most common self-inflicted LCP
              regression there is.

              The tail is a typewriter cycling Propsoch's own three phrases,
              which is what their live site does with this headline. It is safe
              for LCP for a specific reason rather than by luck: the phrases are
              revealed with a MASK, not by mounting text or animating opacity on
              the block. The text is painted and laid out from the first frame,
              and the grid reserves the widest phrase's box before anything
              moves, so neither the LCP candidate nor the layout changes as it
              runs. Measured, not assumed. See Implementation.md.

              ACCESSIBILITY

              The animated phrases are aria-hidden and a single visually hidden
              span carries all three, so a screen reader hears one steady
              sentence, "Blindly trusting a broker's Sales Pitch? Fake Claims?
              Half Info?", instead of a headline that rewrites itself every 3.2
              seconds. */}
          <h1 className="hero-home-heading max-w-3xl text-4xl leading-[0.99] font-bold tracking-[-0.055em] text-ink sm:text-5xl lg:text-[clamp(3.85rem,4.5vw,5rem)]">
            <span className="block">{HERO.headlineLead}</span>

            <span className="type-line mt-2 text-brand-display">
              {[HERO.headlineAccent, ...HERO.headlineAlternates].map(
                (phrase, i) => (
                  <span
                    key={phrase}
                    aria-hidden
                    className="type-item"
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <span className="type-text">{phrase}</span>
                    <span className="type-caret" />
                  </span>
                )
              )}

              {/* The leading space is deliberate. Without it the accessible
                  name concatenates to "...a broker'sSales Pitch?", because
                  neither the lead span nor this one contributes whitespace of
                  its own. Most screen readers pause at the block boundary
                  anyway, but the accessible name should be correct on its own
                  terms rather than rely on that. */}
              <span className="sr-only">
                {" " +
                  [HERO.headlineAccent, ...HERO.headlineAlternates].join(" ")}
              </span>
            </span>
          </h1>

          {/* 2. The value proposition. Verbatim, and moved ABOVE the ask. */}
          <p
            className="animate-rise mt-7 max-w-xl text-lg leading-[1.7] text-ink-muted"
            style={{ "--delay": "80ms" } as React.CSSProperties}
          >
            {HERO.valueProp}
          </p>

          {/* 3. One primary action, with a clearly subordinate secondary. */}
          <div
            className="hero-home-actions animate-rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
            style={{ "--delay": "160ms" } as React.CSSProperties}
          >
            <PrimaryCta size="lg" withArrow className="lift shadow-sm">
              {HERO.primaryCta}
            </PrimaryCta>

            <button
              type="button"
              className="inline-flex min-h-11 items-center rounded-md px-1 text-sm font-semibold text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-brand-strong hover:decoration-brand-strong"
            >
              {HERO.secondaryCta}
            </button>
          </div>

          {/* 4. The real numbers, as chips so the orange gets another fill. */}
          <dl
            className="hero-home-stats animate-rise mt-12 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
            style={{ "--delay": "240ms" } as React.CSSProperties}
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="hero-stat-card rounded-card px-3.5 py-3.5"
              >
                <dd className="hero-stat-value text-2xl font-bold text-ink">
                  {stat.value}
                </dd>
                <dt className="hero-stat-label mt-1 text-xs leading-[1.25] font-medium text-ink-muted">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        {/* The artwork.

            HIDDEN OUTRIGHT BELOW lg, not scaled down and not merely invisible.

            This comment was true of the intent and false of the code: the
            `hidden lg:flex` had gone, and the stage rendered 305x300 on a 360px
            screen behind a comment saying it did not. The mobile-only heights
            it carried (h-[300px] sm:h-[390px]) are gone with it, because a dead
            class that describes mobile sizing sitting next to a comment saying
            there is no mobile rendering is the same lie twice.
            `hidden` is display:none, so it costs no layout box, no paint and no
            animation frames on a phone, and its subtree leaves the
            accessibility tree with it. On a 360px screen it was a decorative
            diagram squeezed under the fold, pushing the numbers and the logos
            further down for no informational gain.

            Inline SVG, so it costs no request either way, and its fixed viewBox
            reserves its own space so it cannot shift layout. */}
        <div
          className="hero-route-stage animate-rise relative isolate mx-auto hidden h-[600px] w-full max-w-[660px] items-center justify-center justify-self-center lg:flex"
          style={{ "--delay": "320ms" } as React.CSSProperties}
        >
          <div
            aria-hidden
            className="hero-route-stage-glow absolute inset-[8%] rounded-full bg-[color-mix(in_oklch,var(--color-brand)_19%,transparent)] blur-[76px]"
          />
          <div
            aria-hidden
            className="hero-route-stage-grid absolute inset-[1%] rounded-[3rem] opacity-65"
          />
          <div
            aria-hidden
            className="hero-route-stage-orbit absolute inset-[5%] rounded-[3rem] border border-dashed border-brand-soft/55"
          />
          <div
            aria-hidden
            className="absolute inset-[14%] rounded-[3rem] border border-white/70 shadow-[inset_0_0_60px_rgba(255,255,255,0.6)]"
          />
          <div className="hero-route-shell relative z-10 h-full w-full">
            <HeroRouteArt className="h-full w-full" />

            {/* The two floating figure cards that used to sit here are
                gone. They read "Curated on 20+ factors" and "Average
                saved ~Rs 4.78 L", both real Propsoch numbers, and both
                already stated in words further down the page: the
                curation figure in the comparison table and the process
                step, the saving in the calculator, where it carries the
                illustrative-estimate note it needs.

                Saying them again as labels floating over a diagram made
                the artwork explain itself in text. The graphic now makes
                the same two points visually instead, which is what an
                illustration is for: three listings with one shortlisted,
                and a verified home at the end of the route. */}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------
          The trust strip.

          This used to render the eight employers as text wordmarks. It now
          uses the real logo artwork, converted to WebP by
          scripts/fetch-logos.mjs from Propsoch's OWN CDN, which is where their
          live site serves these same files from.

          NO LAYOUT SHIFT

          Each img carries the asset's exact intrinsic width and height from
          lib/logos.generated.ts. That gives the browser an aspect ratio to
          reserve the box with before a single byte of image arrives, which is
          what keeps CLS at zero while eight lazy-loaded files stream in.

          WHY EACH LOGO HAS ITS OWN HEIGHT

          The heights differ on purpose. Rendering every logo at one fixed
          height normalises their BOUNDING BOXES, which is not the same as
          normalising what the eye sees: an all-caps wordmark that fills its box
          then looks about 1.6x the size of a lowercase one with a mark tucked
          underneath. The per-brand optical scale is baked into the asset
          itself, so the strip reads level. --logo-scale shrinks the whole set
          together on small screens without flattening those relationships.

          PLAIN img, NOT next/image. These are eight fixed-size static assets
          with no art direction and no responsive variants to pick between. The
          component would add client JavaScript to solve a problem this strip
          does not have.
      -------------------------------------------------------------- */}
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-6 pb-14 sm:px-6 sm:pt-8 sm:pb-16 lg:pb-20">
        <p className="text-xs font-semibold tracking-[0.16em] text-ink-muted uppercase">
          {HERO.trustedByLabel}
        </p>

        <ul className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-5 [--logo-scale:0.78] sm:gap-x-10 sm:[--logo-scale:0.92] lg:gap-x-12 lg:[--logo-scale:1]">
          {TRUST_LOGOS.map((logo) => (
            <li key={logo.id} className="flex items-center">
              <img
                src={logo.src}
                alt={logo.label}
                width={logo.width}
                height={logo.height}
                loading="lazy"
                decoding="async"
                className="w-auto opacity-90"
                style={{
                  height: `calc(${logo.height / 2}px * var(--logo-scale, 1))`,
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
