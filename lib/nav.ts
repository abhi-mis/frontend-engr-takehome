// Header navigation copy. Labels are the live site's; none of them link anywhere
// in this rebuild, so they render as buttons rather than dead hrefs.
export interface NavItem {
  readonly label: string;
  readonly description?: string;

  readonly isNew?: boolean;
}

export interface NavGroup {
  readonly label: string;

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

export const HEADER_ACTIONS = {
  wishlistLabel: "Wishlist",
  ctaLabel: "Get Started",
  menuLabel: "Menu",
} as const;
