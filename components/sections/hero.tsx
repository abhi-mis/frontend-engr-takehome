import { HeroRouteArt } from "@/components/brand/hero-route-art";
import { Typewriter } from "@/components/sections/typewriter";
import { PrimaryCta } from "@/components/primary-cta";
import { HERO, STATS } from "@/lib/content";
import { TRUST_LOGOS } from "@/lib/logos.generated";

// The h1 is the LCP element and never animates. Stats move into the artwork at lg
// but stay in the DOM, since the artwork is aria-hidden.
export function Hero() {
  return (
    <section className="hero-home relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_12%_-10%,color-mix(in_oklch,var(--color-brand)_12%,transparent)_0%,transparent_60%)]" />

        <div className="animate-drift absolute top-[-12%] right-[-12%] hidden size-[46rem] rounded-full bg-[color-mix(in_oklch,var(--color-brand)_18%,transparent)] blur-[90px] lg:block" />

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
      <div className="hero-home-layout mx-auto grid w-full max-w-[1340px] grid-cols-1 items-center gap-8 px-5 pt-7 pb-6 sm:px-8 sm:pt-10 lg:grid-cols-[minmax(0,0.94fr)_minmax(460px,1.06fr)] lg:gap-8 lg:px-10 lg:pt-14 lg:pb-10 xl:gap-14">
        <div className="hero-home-copy relative z-10 flex flex-col items-start lg:pb-2">
          <h1 className="hero-home-heading max-w-3xl text-4xl leading-[0.99] font-bold tracking-[-0.055em] text-ink sm:text-5xl lg:text-[clamp(3.85rem,4.5vw,5rem)]">
            <span className="block">{HERO.headlineLead}</span>
            <span className="type-line mt-2 text-brand-display">
              {[HERO.headlineAccent, ...HERO.headlineAlternates].map(
                (phrase, i) => (
                  <span
                    key={phrase}
                    aria-hidden
                    className="type-item"
                    data-i={i}
                  >
                    <span className="type-text">{phrase}</span>
                    <span className="type-caret" />
                  </span>
                )
              )}

              <span className="sr-only">
                {" " +
                  [HERO.headlineAccent, ...HERO.headlineAlternates].join(" ")}
              </span>
              <Typewriter />
            </span>
          </h1>
          <p
            className="animate-rise mt-7 max-w-xl text-lg leading-[1.7] text-ink-muted"
            style={{ "--delay": "80ms" } as React.CSSProperties}
          >
            {HERO.valueProp}
          </p>
          <div
            className="hero-home-actions animate-rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
            style={{ "--delay": "160ms" } as React.CSSProperties}
          >
            <PrimaryCta size="lg" withArrow className="lift">
              {HERO.primaryCta}
            </PrimaryCta>
            <button
              type="button"
              className="inline-flex min-h-11 items-center rounded-md px-1 text-sm font-semibold text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-brand-strong hover:decoration-brand-strong"
            >
              {HERO.secondaryCta}
            </button>
          </div>
          <dl
            className="hero-home-stats animate-rise mt-12 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 lg:sr-only lg:mt-0"
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
        <div
          className="hero-route-stage animate-rise relative hidden h-[560px] w-full justify-self-center lg:block xl:h-[620px]"
          style={{ "--delay": "320ms" } as React.CSSProperties}
        >
          <div className="hero-route-bleed pointer-events-none">
            <div
              aria-hidden
              className="absolute inset-[12%] rounded-full bg-[color-mix(in_oklch,var(--color-brand)_17%,transparent)] blur-[86px]"
            />
            <HeroRouteArt />
          </div>
        </div>
      </div>
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
