/**
 * The navigation bar, kept exactly as Propsoch's own.
 *
 * Every label, description and "New" badge below was extracted from the live
 * site by opening each dropdown in a real browser, because the menus are
 * client-rendered and absent from the served HTML.
 *
 * NO ITEM NAVIGATES. This is the navigation bar as user interface only, per
 * instruction. There are deliberately no `href` values in this file at all,
 * which is the point: you cannot accidentally reintroduce a destination that
 * does not exist, because there is nowhere to put one.
 *
 * Each item renders as a real `<button type="button">` rather than an anchor.
 * That matters more than it looks:
 *
 *   - `<a>` without an `href` is not focusable and exposes no role, so it
 *     vanishes from the keyboard order and from a screen reader entirely.
 *   - `<a href="#">` is focusable but lies twice: it announces as a link, and
 *     clicking it actually jumps the user to the top of the page.
 *   - `<button>` is focusable, announces as a button, and doing nothing on
 *     click is a perfectly ordinary thing for a button to do.
 *
 * A non-functional control still has to be a correct control, which is the same
 * rule the page's calls to action already follow.
 */

export interface NavItem {
  readonly label: string;
  readonly description?: string;
  /** Renders the "New" badge the original shows on these items. */
  readonly isNew?: boolean;
}

export interface NavGroup {
  readonly label: string;
  /** Renders as a two column panel with these column headings. */
  readonly columns: readonly {
    readonly heading?: string;
    readonly items: readonly NavItem[];
  }[];
}

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: "Properties",
    columns: [
      {
        heading: "Properties",
        items: [
          {
            label: "Search & Filter Properties",
            description:
              "Search, filter and sort from 500+ RERA-approved properties in Bengaluru",
          },
          {
            label: "Compare Properties",
            description:
              "Compare properties exhaustively on 40+ parameters you won't find elsewhere",
          },
          {
            label: "Sell Your Property",
            description:
              "Share details & we'll match you with genuine homebuyers from our community",
          },
        ],
      },
    ],
  },
  {
    label: "Services",
    columns: [
      {
        heading: "Services",
        items: [
          {
            label: "Guided Homebuying",
            description:
              "Trusted by 1000+ intelligent buyers who bought their ideal homes confidently.",
          },
          {
            label: "Peace of Mind Report",
            description:
              "India's most comprehensive report covering 80+ critical data points",
          },
          {
            label: "NRI Advisory",
            description:
              "Independent guidance for NRIs buying property in India remotely",
            isNew: true,
          },
          {
            label: "Home Loans",
            description:
              "Compare lenders, get best offers & end-to-end guidance",
          },
          {
            label: "Legal Services",
            description:
              "Get complete title due diligence, agreement reviews & advisory at pre-negotiated prices",
          },
        ],
      },
    ],
  },
  {
    label: "Resources",
    columns: [
      {
        heading: "Learn",
        items: [
          {
            label: "Blog",
            description:
              "Get in-depth insights, guides & updates on India's real estate every week",
          },
          {
            label: "Homebuying Guide 101",
            description:
              "New to homebuying? This guide helps you navigate your journey with clarity",
          },
          {
            label: "Homebuying Checklist",
            description:
              "See if your dream home checks all the boxes with our ultimate checklist",
          },
          {
            label: "Bangalore Real Estate 2026",
            description:
              "See how the supply, demand & price trends are evolving in 2026",
          },
        ],
      },
      {
        heading: "Tools",
        items: [
          {
            label: "Loyalty Reward Calculator",
            description:
              "See what you'll earn in money, time & sanity when you work with Propsoch",
          },
          {
            label: "Fair Price Calculator",
            description:
              "Instantly check if your property's price is fair and discover its true market value.",
            isNew: true,
          },
          {
            label: "EMI Calculator",
            description:
              "Instantly calculate EMIs with prepayments and future possession dates",
            isNew: true,
          },
        ],
      },
    ],
  },
  {
    label: "Company",
    columns: [
      {
        heading: "Company",
        items: [
          { label: "About Us" },
          { label: "Customer Reviews" },
          {
            label: "Careers",
          },
        ],
      },
      {
        heading: "Community",
        items: [
          {
            label: "LinkedIn",
          },
          { label: "YouTube" },
          {
            label: "Join our WhatsApp community",
          },
        ],
      },
    ],
  },
] as const;

/** The header's own actions, verbatim from the original. */
export const HEADER_ACTIONS = {
  wishlistLabel: "Wishlist",
  ctaLabel: "Get Started",
  menuLabel: "Menu",
} as const;
