import { HeroArt } from "@/components/brand/hero-art";
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
    <section className="relative isolate overflow-hidden">
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
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-12 px-4 pt-7 pb-4 sm:px-6 sm:pt-9 lg:grid-cols-[minmax(0,1.04fr)_minmax(390px,0.96fr)] lg:gap-12 lg:px-10 lg:pt-12 lg:pb-8 xl:gap-20">
        <div className="relative flex flex-col items-start lg:pb-2">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-12 -left-10 hidden h-44 w-44 rounded-full border border-brand-soft/40 lg:block"
          />

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
          <h1 className="max-w-3xl text-4xl leading-[1.02] font-bold tracking-[-0.045em] text-ink sm:text-5xl lg:text-[clamp(3.6rem,4.35vw,4.75rem)]">
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
            className="animate-rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
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
            className="animate-rise mt-12 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
            style={{ "--delay": "240ms" } as React.CSSProperties}
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="hero-stat-card lift rounded-card px-3.5 py-3.5"
              >
                <dd className="text-2xl font-bold text-ink">{stat.value}</dd>
                <dt className="mt-0.5 text-xs leading-snug text-ink-muted">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        {/* The artwork.

            HIDDEN OUTRIGHT BELOW lg, not scaled down and not merely invisible.
            `hidden` is display:none, so it costs no layout box, no paint and no
            animation frames on a phone, and its subtree leaves the
            accessibility tree with it. On a 360px screen it was a decorative
            diagram squeezed under the fold, pushing the numbers and the logos
            further down for no informational gain.

            Inline SVG, so it costs no request either way, and its fixed viewBox
            reserves its own space so it cannot shift layout. */}
        <div
          className="hero-stage animate-rise relative isolate mx-auto hidden min-h-[410px] w-full max-w-[520px] items-center justify-center justify-self-center sm:min-h-[500px] lg:flex"
          style={{ "--delay": "320ms" } as React.CSSProperties}
        >
          <div
            aria-hidden
            className="hero-stage-glow absolute inset-[10%] rounded-full bg-[color-mix(in_oklch,var(--color-brand)_22%,transparent)] blur-[70px]"
          />
          <div
            aria-hidden
            className="hero-stage-grid absolute inset-[4%] rounded-[3rem] opacity-60"
          />
          <div
            aria-hidden
            className="hero-stage-orbit absolute inset-[8%] rounded-full border border-dashed border-brand-soft/55"
          />
          <div
            aria-hidden
            className="absolute inset-[18%] rounded-full border border-white/70 shadow-[inset_0_0_60px_rgba(255,255,255,0.6)]"
          />
          <div className="hero-stage-shell relative z-10 w-full max-w-[430px]">
            <HeroArt className="h-auto w-full" />

            {/* Floating figure card, pinned to the funnel's narrow end.
                Uses Propsoch's real published average saving, and the "~" is
                theirs too. It gives the artwork a focal point and explains what
                the narrowing is FOR, rather than leaving the diagram to be read
                as decoration. Floats on its own slow cycle. */}
            <div
              className="animate-float absolute right-0 bottom-[16%] rounded-card bg-surface-raised/95 px-3.5 py-2.5 shadow-lg backdrop-blur-sm sm:right-[-5%]"
              style={
                { "--dur": "8s", "--delay": "900ms" } as React.CSSProperties
              }
            >
              <p className="text-[0.65rem] font-bold tracking-wide text-ink-muted uppercase">
                Average saved
              </p>
              <p className="text-lg font-bold text-ink tabular-nums">
                ~₹4.78 L
              </p>
            </div>

            {/* And one on the narrowing, naming what the funnel does.
                Sits at 28% rather than at the top: at the top it covered one of
                the seven cards, which is the exact thing the graphic is
                counting. The figure is "20+ factors" rather than "700+" because
                700+ already appears in the stat chips directly below, and
                labelling the CURATION rather than the count adds information
                instead of repeating it. Both numbers are Propsoch's own. */}
            <div
              className="animate-float absolute top-[27%] left-0 rounded-card bg-surface-raised/95 px-3.5 py-2.5 shadow-lg backdrop-blur-sm sm:left-[-5%]"
              style={
                { "--dur": "7s", "--delay": "1200ms" } as React.CSSProperties
              }
            >
              <p className="text-[0.65rem] font-bold tracking-wide text-ink-muted uppercase">
                Curated on
              </p>
              <p className="text-lg font-bold text-ink tabular-nums">
                20+ factors
              </p>
            </div>
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
