import { Logo } from "@/components/brand/logo";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HeartIcon, SearchIcon, ShareIcon } from "@/components/icons";
import { PrimaryCta } from "@/components/primary-cta";
import { HEADER_ACTIONS } from "@/lib/nav";

/**
 * Site header, kept as Propsoch's own navigation bar.
 *
 * An earlier version of this file stripped the nav down to a logo and one CTA,
 * on the argument that the original's five dropdowns compete with the hero. That
 * was overridden: keep the navigation bar as it is. So the four real groups are
 * back, with Propsoch's real labels, descriptions, "New" badges and hrefs.
 *
 * The header shell itself is still a Server Component. Only two leaf subtrees
 * hydrate: `DesktopNav` and `MobileNav`. Everything else here, the logo, the
 * icon rail and the CTA, is server-rendered markup.
 *
 * NOTHING IN THE NAVIGATION NAVIGATES. Per instruction, the nav bar is user
 * interface only: every dropdown item and every icon in the rail is a real
 * <button> that does nothing on click. The one exception is the logo, which is
 * an in-page anchor to #main, because jumping to the top of the page is genuine
 * navigation that genuinely works here.
 *
 * A non-functional control still has to be a correct control: each one keeps an
 * accessible name, a visible focus ring and a 44px target.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-2 px-4 sm:px-6">
        <a
          href="#main"
          aria-label="Propsoch, back to top"
          // `min-h-11` rather than relying on padding: the logo is 27px tall at
          // this width and `py-2` gave the link a 43px box, one pixel under the
          // 44px target. Measured, not eyeballed.
          className="inline-flex min-h-11 shrink-0 items-center rounded-md py-2"
        >
          {/* The link supplies the accessible name, so the mark is decorative. */}
          <Logo width={116} decorative />
        </a>

        {/* Desktop dropdown navigation, centred. */}
        <div className="mx-auto hidden lg:block">
          <DesktopNav />
        </div>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          {/* Icon rail. Hidden on the smallest screens, where the Menu button
              and the CTA are the priority. */}
          <button
            type="button"
            className="hidden size-11 items-center justify-center rounded-lg text-ink hover:bg-surface-alt sm:inline-flex"
          >
            <SearchIcon aria-hidden className="size-[18px]" />
            <span className="sr-only">Search properties</span>
          </button>

          <button
            type="button"
            className="hidden size-11 items-center justify-center rounded-lg text-ink hover:bg-surface-alt sm:inline-flex"
          >
            <ShareIcon aria-hidden className="size-[18px]" />
            <span className="sr-only">Share this page</span>
          </button>

          <button
            type="button"
            className="hidden size-11 items-center justify-center rounded-lg text-ink hover:bg-surface-alt sm:inline-flex"
          >
            <HeartIcon aria-hidden className="size-[18px]" />
            <span className="sr-only">{HEADER_ACTIONS.wishlistLabel}</span>
          </button>

          <PrimaryCta className="ml-1 shrink-0">
            {HEADER_ACTIONS.ctaLabel}
          </PrimaryCta>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
