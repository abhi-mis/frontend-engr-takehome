import { Logo } from "@/components/brand/logo";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HeartIcon, SearchIcon, ShareIcon } from "@/components/icons";
import { PrimaryCta } from "@/components/primary-cta";
import { HEADER_ACTIONS } from "@/lib/nav";

// Sticky header. Renders both navs; CSS decides which one is visible.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-2 px-4 sm:px-6">
        <a
          href="#main"
          aria-label="Propsoch, back to top"
          className="inline-flex min-h-11 shrink-0 items-center rounded-md py-2"
        >
          <Logo width={116} decorative />
        </a>
        <div className="mx-auto hidden lg:block">
          <DesktopNav />
        </div>
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
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
