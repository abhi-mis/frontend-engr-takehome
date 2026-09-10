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

/**
 * Site footer. Server Component, zero client JavaScript.
 *
 * This fixes UX issue 5. The original has no real footer, and because its
 * mobile layout collapses several sections to nothing, the page ends in a band
 * of empty space with no closure.
 *
 * Structure, top to bottom:
 *
 *   1. Five content columns of the original's real footer content.
 *   2. A legal strip: entity, both RERA registrations, and the rebuild notice.
 *   3. A dark closing panel: the brand, the real value proposition, the primary
 *      action, and the Bromatker mark. The page's one dark surface, so it reads
 *      as an ending rather than as another section, and it sits LAST, at the
 *      true bottom of the page, rather than above the content columns. It used
 *      to open the footer, which put the page's one moment of closure before
 *      five columns of links and a legal strip, so the actual last thing a
 *      reader saw was fine print. Now the fine print resolves into the
 *      signature instead.
 *
 * THE DARK PANEL AND CONTRAST
 *
 * Inverting to `--color-ink` is the one place the brand orange can be used as
 * TEXT at small sizes. `#FF6D33` on `#212130` is 5.66:1, comfortably past the
 * 4.5:1 bar, where the same orange on the light page is 2.71:1 and fails. Same
 * colour, different ground, opposite verdict. It is a good reminder that the
 * palette's rules are about pairs and not about colours.
 *
 * ON LINKS
 *
 * Consistent with the rest of the page: in-page anchors are real and work, the
 * two RERA registrations and the social profiles are real public destinations
 * so they are real links, and the content that has no destination in this
 * rebuild (locations, property types, builders, legal pages) is rendered as
 * plain text rather than as `href="#"`. A link that goes nowhere is a broken
 * promise to anyone using a screen reader, and it pollutes the link graph.
 *
 * The original also has a contact column. It carries no phone number or postal
 * address I could recover, and the brief forbids inventing details, so the
 * recoverable contact route (their real public email) sits in the social column
 * instead.
 */
export function SiteFooter() {
  // No border-t any more. The section above the footer is the sunken step, so
  // the change of surface already draws the line that the 1px rule used to.
  return (
    <footer className="bg-surface">
      {/* ------------------------------------------------------------------
          1. Content columns.
      ------------------------------------------------------------------ */}
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

            {/* Social sits in the brand column rather than under "Browse by".
                Stacked there it made one column roughly twice the height of
                the other four, which is what made the row look unbalanced.
                These are real public profiles, so they are real links. */}
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

          {/* Real, working in-page navigation. */}
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

        {/* ----------------------------------------------------------------
            2. Legal strip.
        ---------------------------------------------------------------- */}
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
                  {/* On its own line as an inline-flex target: as an inline
                      link inside the sentence this measured 16px tall. WCAG
                      2.5.8 exempts links inside a block of text, but an
                      exemption is not the same as a good target. */}
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

      {/* ------------------------------------------------------------------
          3. The closing panel. The literal last thing on the page.

          Same panel as before, moved rather than rebuilt: the dark surface,
          the ambient glow, the value proposition, the CTA and the Bromatker
          mark are unchanged, because the design already read as a signature,
          it was just signing the page in the wrong place. `pb-14` on this
          wrapper is the page's actual bottom margin now, in place of the
          `pt-14` it carried when something else closed the page beneath it.
      ------------------------------------------------------------------ */}
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-14 sm:px-6">
        <div className="relative isolate overflow-hidden rounded-panel bg-ink px-6 py-10 shadow-lg sm:px-10 sm:py-12">
          {/* Ambient brand glow. Pure CSS, drifts slowly, clipped by the
              panel's overflow. */}
          <div
            aria-hidden
            className="animate-drift pointer-events-none absolute top-[-40%] right-[-10%] -z-10 size-[30rem] rounded-full bg-[color-mix(in_oklch,var(--color-brand)_38%,transparent)] blur-[80px]"
          />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              {/* On the dark panel the brand orange is finally legible as
                  small text, at 5.66:1. */}
              <p className="text-xs font-bold tracking-[0.14em] text-brand uppercase">
                Guided Homebuying
              </p>
              <p className="mt-3 text-2xl font-bold text-surface">
                {HERO.valueProp}
              </p>

              {/* The wordmark in the brand orange, which only works because
                  this panel is dark: #FF6D33 is 5.65:1 on --color-ink and
                  2.71:1 on the light page. At `text-surface/70` it read as
                  washed-out grey and wasted the one surface where the real
                  orange is legible as text. */}
              <p className="mt-5 text-3xl text-brand sm:text-4xl">
                <Bromatker />
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-3">
              <PrimaryCta size="lg" withArrow className="lift">
                {HERO.primaryCta}
              </PrimaryCta>
              {/* Sourced from TRUSTED_BY rather than typed inline, so the
                  employer names live in exactly one place. */}
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
