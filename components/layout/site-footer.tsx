import { Bromatker } from "@/components/brand/bromatker";
import { Logo } from "@/components/brand/logo";
import { ArrowRightIcon, MapPinIcon } from "@/components/icons";
import { PrimaryCta } from "@/components/primary-cta";
import {
  FOOTER,
  HERO,
  REBUILD_NOTICE,
  SECTION_LINKS,
  SITE,
  TRUSTED_BY,
} from "@/lib/content";

// Columns, then the legal strip, then the dark brand panel last so the page
// closes on the signature rather than on fine print.
export function SiteFooter() {
  return (
    <footer className="bg-surface">
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-14 pb-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <Logo width={124} decorative />
            <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
              {FOOTER.tagline}
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              {FOOTER.cities.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-3 py-1 text-xs font-semibold text-ink"
                >
                  <MapPinIcon aria-hidden className="size-3 text-brand-strong" />
                  {city}
                </span>
              ))}
            </div>
            <h2 className="mt-5 text-xs font-bold tracking-wide text-ink uppercase">
              {FOOTER.socialHeading}
            </h2>
            <ul className="flex flex-wrap gap-x-4">
              {FOOTER.social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-h-11 items-center text-sm font-medium text-ink-muted underline-offset-4 hover:text-brand-strong hover:underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <nav aria-labelledby="footer-explore" className="flex flex-col gap-3">
            <h2
              id="footer-explore"
              className="text-xs font-bold tracking-wide text-ink uppercase"
            >
              {FOOTER.exploreHeading}
            </h2>
            <ul className="flex flex-col gap-1">
              {SECTION_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex min-h-11 items-center gap-1.5 text-sm text-ink-muted hover:text-brand-strong"
                  >
                    {link.label}
                    <ArrowRightIcon
                      aria-hidden
                      className="size-3 opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold tracking-wide text-ink uppercase">
              {FOOTER.locationsHeading}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {FOOTER.locations.map((location) => (
                <li key={location} className="text-sm text-ink-muted">
                  {location}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold tracking-wide text-ink uppercase">
              {FOOTER.buildersHeading}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {FOOTER.builders.map((builder) => (
                <li key={builder} className="text-sm text-ink-muted">
                  {builder}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold tracking-wide text-ink uppercase">
              {FOOTER.propertyTypesHeading}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {FOOTER.propertyTypes.map((type) => (
                <li key={type} className="text-sm text-ink-muted">
                  {type}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold text-ink">{SITE.legalEntity}</p>
            <ul className="flex flex-col gap-2 sm:flex-row sm:gap-8">
              {FOOTER.rera.map((entry) => (
                <li key={entry.number} className="text-xs text-ink-muted">
                  <span className="block font-semibold text-ink">
                    {entry.state}
                  </span>
                  <span className="block tabular-nums">{entry.number}</span>
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-h-11 items-center text-brand-strong underline underline-offset-2"
                  >
                    {entry.hrefLabel}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {FOOTER.legalLinks.map((item) => (
                <li key={item} className="text-xs text-ink-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-ink-muted lg:text-right">
            {REBUILD_NOTICE}
          </p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-14 sm:px-6">
        <div className="relative isolate overflow-hidden rounded-panel bg-ink px-6 py-10 shadow-lg sm:px-10 sm:py-12">
          <div
            aria-hidden
            className="animate-drift pointer-events-none absolute top-[-40%] right-[-10%] -z-10 size-[30rem] rounded-full bg-[color-mix(in_oklch,var(--color-brand)_38%,transparent)] blur-[80px]"
          />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold tracking-[0.14em] text-brand uppercase">
                Guided Homebuying
              </p>
              <p className="mt-3 text-2xl font-bold text-surface">
                {HERO.valueProp}
              </p>
              <p className="mt-5 text-3xl text-brand sm:text-4xl">
                <Bromatker />
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-3">
              <PrimaryCta size="lg" withArrow className="lift">
                {HERO.primaryCta}
              </PrimaryCta>
              <p className="max-w-[16rem] text-xs leading-relaxed text-surface/65">
                {HERO.trustedByLabel} {TRUSTED_BY.slice(0, 3).join(", ")} and
                more
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
