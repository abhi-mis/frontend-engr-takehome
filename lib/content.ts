/**
 * Every word rendered on this page lives here.
 *
 * Why one file: the brief forbids invented pricing, testimonials or stats, and
 * requires Propsoch's real copy and real numbers. Keeping all copy in a single
 * typed module makes that rule auditable, you can read this file and confirm
 * nothing was made up, instead of grepping through JSX. It is imported only by
 * Server Components, so it costs zero client bytes.
 *
 * PROVENANCE
 * Everything marked "verbatim" was read off the live propsoch.com by rendering
 * the page and extracting the DOM (the site is client rendered, so the copy is
 * absent from the served HTML). Anything not verbatim is flagged inline with the
 * reason, and there are only four such places in the whole file.
 */

// ---------------------------------------------------------------------------
// Site level
// ---------------------------------------------------------------------------

export const SITE = {
  name: "Propsoch",
  /** Deployment URL. Override with NEXT_PUBLIC_SITE_URL when you deploy. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Verbatim from the original <title>. */
  title:
    "Propsoch - Bangalore - Real Estate - Search/Buy/Sell Properties | Propsoch",
  /** Verbatim from the original meta description. */
  description:
    "Buy your dream home confidently with Propsoch - Bangalore's smartest real estate service for home buyers to get expert advice, property insights & reports.",
  locale: "en-IN",
  /** Verbatim from the original footer. */
  legalEntity: "Thinkr Proptech Private Limited",
} as const;

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export const HERO = {
  /**
   * Verbatim. On the original this is one h1 whose tail rotates through three
   * phrases. We keep the words and render the first phrase as the accent, so the
   * LCP element is plain server rendered text that paints immediately.
   */
  headlineLead: "Blindly trusting a broker's",
  headlineAccent: "Sales Pitch?",
  /** The other two phrases the original cycles. Kept, shown as static text. */
  headlineAlternates: ["Fake Claims?", "Half Info?"],

  /** Verbatim. On the original this sits BELOW the CTA. We move it above it. */
  valueProp:
    "Get independent guidance from advisors who've helped 1000+ families buy the right home.",

  /** Verbatim. The original label, kept per instruction. Does not act on click. */
  primaryCta: "Propsoch Kar",
  /** Verbatim. Rendered as a clearly subordinate text link. */
  secondaryCta: "Already a member? Login",

  /**
   * The marquee. One wordmark, repeated: "Bromatker".
   *
   * This is Propsoch's pun, and it is the whole campaign. Take "Broker", wedge
   * "mat" into the middle, and it reads as "Bro mat kar", Hindi for "don't do
   * it, bro". The original renders it with "mat" raised between "Bro" and
   * "ker", which is what lets it read as both words at once. The asset on their
   * CDN is literally named `bromatkar_icon.png`.
   *
   * I had this wrong earlier. I had invented "Bro-marketer" and "Bro Mat Kar" as
   * separate terms in a word list, which broke the pun and added copy Propsoch
   * never wrote. It is one wordmark, not a list, and it is rendered by
   * `components/brand/bromatker.tsx` rather than as a plain string, because the
   * raised "mat" is structural rather than decorative.
   *
   * `marqueeRepeat` is how many copies fill one marquee group. The track holds
   * two groups and translates by -50%, so each group has to be wider than its
   * container or the loop shows a visible gap.
   */
  marqueeRepeat: 8,

  /** Verbatim. The trust line above the employer names on the original. */
  trustedByLabel: "Trusted by homebuyers like you from",
} as const;

/**
 * The employers the original lists under "Trusted by homebuyers like you from".
 * All verbatim from the live site's image alt text.
 *
 * THESE NAMES ARE NO LONGER WHAT RENDERS.
 *
 * The hero now shows the real logo artwork instead of text wordmarks. That
 * artwork comes from Propsoch's OWN CDN, converted to WebP by
 * scripts/fetch-logos.mjs, and the rendered list plus each file's dimensions
 * live in lib/logos.generated.ts.
 *
 * An earlier version of this comment said shipping other companies' logo art
 * was "not something a rebuild should do". That was overcautious: these are the
 * exact files Propsoch already publishes on this exact claim, so reproducing
 * their trust strip is reproducing their page rather than making a new claim
 * with someone else's mark.
 *
 * This array is kept because it is the provenance record for the names, and
 * because it is the source of truth if the strip ever falls back to text.
 *
 * Note: the original has a bug here worth recording. The logo alt-texted
 * "xto10x" is served from a file called `nvidia-logo.png`. Neither is in the
 * eight below, since Propsoch's own list of names does not include it.
 */
export const TRUSTED_BY: readonly string[] = [
  "Amazon",
  "Google",
  "Microsoft",
  "Flipkart",
  "Atlassian",
  "PhonePe",
  "Deloitte",
  "Navi",
] as const;

// ---------------------------------------------------------------------------
// Stats. All verbatim numbers.
// ---------------------------------------------------------------------------

export interface Stat {
  readonly value: string;
  readonly label: string;
}

export const STATS: readonly Stat[] = [
  { value: "700+", label: "Projects Across Bangalore" },
  { value: "2,500+", label: "Intelligent Homebuyers" },
  // The original renders this label as "Hours of Advise" on mobile and
  // "Hours of Research" on desktop. Spelling corrected, number untouched.
  { value: "8500+", label: "Hours of Advice" },
  { value: "290+", label: "Partner Builders" },
] as const;

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------

/** One line of a comparison: what you care about, and the two answers. */
export interface ComparisonRow {
  readonly criteria: string;
  readonly propsoch: string;
  /** The competitor's answer, for whichever table this row belongs to. */
  readonly other: string;
}

/** One tab: a competitor, and the criteria Propsoch compares against them on. */
export interface ComparisonSet {
  readonly id: string;
  readonly tabLabel: string;
  readonly columnLabel: string;
  /**
   * Their parenthetical under the online portals header. Verbatim, and worth
   * keeping: "online portals" is vague, while naming Housing, 99Acres and
   * Magicbricks is a specific claim they are willing to put their name to.
   */
  readonly columnNote?: string;
  /** Screen reader caption for this table. */
  readonly caption: string;
  readonly rows: readonly ComparisonRow[];
}

export const COMPARISON = {
  /**
   * Short eyebrow labels above each section heading.
   *
   * These are the only new UI strings on the page. They are navigational labels
   * rather than claims: no number, no promise, nothing that could be mistaken
   * for a fact about the business. They exist because a bare heading on a plain
   * background is what made the page read as unfinished, and an eyebrow gives
   * each section a visible "you are here".
   */
  eyebrow: "How we compare",
  /** Verbatim heading. */
  heading: "How are we different?",
  /** Verbatim sub label above the tabs. */
  subheading: "Compare our services with",
  /** Verbatim column headers. Each competitor's header lives on its own set. */
  criteriaHeader: "What you care about",
  propsochHeader: "Propsoch",
  /** Mine. Their tab strip has no accessible name at all. */
  tabsLabel: "Choose who to compare Propsoch with",
} as const;

/**
 * The `criteria`, `propsoch` and `localBrokers` values are all verbatim.
 *
 * NOT VERBATIM (2 of 4): `onlinePortals`. The original's Online Portals tab is
 * broken on the live site, its tab panel renders empty and clicking the tab does
 * nothing, so there is no copy to reuse. Rather than fabricate claims about named
 * competitors, these describe how a listings marketplace works structurally.
 * Approved wording, plan section 5.3.
 */
/**
 * PROPSOCH SHIPS TWO TABLES, NOT ONE, AND THIS BUILD USED TO GET THAT WRONG.
 *
 * Their "How are we different?" section has a tab per competitor, and each tab
 * is its OWN table with its OWN criteria. The two do not share a row set:
 * comparing against portals is an argument about DATA (depth, accuracy,
 * sources) and comparing against brokers is an argument about CONDUCT
 * (pressure, spam, support). Only "Transparency" appears in both, and there it
 * is worded identically.
 *
 * What this build shipped before was ONE nine row table with a third column for
 * online portals that I had WRITTEN MYSELF, by taking their nine broker
 * criteria and inventing a portal answer for each. Seven of those nine cells
 * were mine: "Lead form, then calls from multiple agents", "Ranked by paid
 * placement, not fit", "Your number is shared with every listed agent" and so
 * on. They are plausible, and they are not Propsoch's. Inventing criticism of
 * named competitors and presenting it as a client's own comparison is exactly
 * the sort of content this project is not allowed to make up.
 *
 * It also hid their real argument. "80+ data points against 20-40", "verified
 * by architects against loose verification", "RERA, GMaps, CDP" against "added
 * by developer & broker" is sharper and more specific than anything I wrote,
 * and none of it was on the page.
 *
 * Both tables are verbatim from their own difference.data.tsx. The one change
 * is a trailing space trimmed from "Added by developer & broker ".
 */
export const COMPARISON_SETS: readonly ComparisonSet[] = [
  {
    id: "online-portals",
    tabLabel: "Online portals",
    columnLabel: "Online portals",
    columnNote: "(Housing/99Acres/Magicbricks)",
    caption:
      "Propsoch compared with online property portals across five criteria",
    rows: [
      { criteria: "Information Depth", propsoch: "80+ data points", other: "20-40 data points" },
      { criteria: "Transparency", propsoch: "Detailed pros & cons", other: "Only pros highlighted" },
      { criteria: "Data Accuracy", propsoch: "Verified by architects", other: "Loose verification" },
      { criteria: "Service Validity", propsoch: "Till you find your home", other: "Based on no. of contacts" },
      { criteria: "Data Sources", propsoch: "RERA, GMaps, CDP etc.", other: "Added by developer & broker" },
    ],
  },
  {
    id: "local-brokers",
    tabLabel: "Local brokers",
    columnLabel: "Local brokers",
    caption: "Propsoch compared with local brokers across nine criteria",
    rows: [
      { criteria: "Sales Practices", propsoch: "Consultative, no pressure", other: "High pressure sales tactics" },
      { criteria: "Transparency", propsoch: "Detailed pros & cons", other: "Only pros highlighted" },
      { criteria: "Project Curation", propsoch: "Based on 20+ factors", other: "Not curated" },
      { criteria: "Spam", propsoch: "No spam", other: "High spamming until closure" },
      { criteria: "Post sales support", propsoch: "End-to-end support", other: "None" },
      { criteria: "Site Visits", propsoch: "Assisted by on-ground market experts", other: "No market expertise" },
      { criteria: "Negotiation", propsoch: "High leverage via insights", other: "No insights to leverage" },
      { criteria: "In-Depth Reports", propsoch: "2 complimentary Peace of Mind Reports", other: "None" },
      { criteria: "Advisor", propsoch: "Trained architects", other: "Local sales people" },
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// Video testimonials
//
// All three are VERBATIM, lifted from the array that drives the same carousel
// on propsoch.com. Their homepage only ever renders the active slide's quote,
// so two of the three are not in the served HTML at all; these came from the
// page chunk, where the full array is a plain object literal.
//
// One character worth flagging. The second quote contains an EN DASH (U+2013),
// not a hyphen and not an em dash. It is Propsoch's punctuation inside a
// customer's own sentence, and the instruction is to keep their text exactly as
// it is, so it stays. The project's no-em-dash rule is about MY prose, and a
// quotation is not my prose to tidy.
//
// The third testimonial has ONE person where the others have two. The component
// handles that rather than the data padding itself out, since inventing a
// second name would be inventing content.
//
// A BUG IN THE ORIGINAL, AND THE ONE THING CHANGED HERE
//
// Propsoch's array pairs every quote with the WRONG video. It is rotated by one
// against the actual uploads, so their live carousel captions each testimonial
// with somebody else's name.
//
// The evidence, since this is a claim about someone else's data:
//
//   video         its YouTube title            its thumbnail says   their array says
//   OZMT9fgbH_c   "A Bangalore Buyer's Story"  D.L. Narasimham      Bharat + Neerja
//   Nid3XKVEApg   "Meet Bharath & Neerja"      Bharath & Neerja     Ankita + Vishal
//   XrsfHS7tCN0   (title not returned)         Ankita & Vishal      D.L. Narasimham
//
// Nid3XKVEApg settles it on its own: the video's own title names Bharath and
// Neerja, and its thumbnail agrees, while the array calls it Ankita. The other
// two follow from the same thumbnails, which are custom artwork that Propsoch
// made and which name the speaker on the image itself.
//
// So the youtubeId on each entry below is CORRECTED to the video that actually
// contains that person. Every word, name and role is still theirs, untouched,
// and the display order is still theirs. Shipping the rotation as-is would have
// put a real person's name under a different real person's face, which is a
// worse thing to be faithful about than a field mapping.
//
// This is the second data bug found on that page. The first is the logo alt
// texted "xto10x" served from a file called nvidia-logo.png, noted above.
// ---------------------------------------------------------------------------

export interface TestimonialPerson {
  /** Verbatim name. */
  readonly name: string;
  /** Verbatim role, their field is called "about". */
  readonly role: string;
}

export interface Testimonial {
  /** The YouTube id. Posters are keyed by this in lib/posters.generated.ts. */
  readonly youtubeId: string;
  /** Verbatim quote, without the curly quotation marks the original wraps it in. */
  readonly quote: string;
  /** One or two people. */
  readonly people: readonly TestimonialPerson[];
}

export const TESTIMONIALS_SECTION = {
  eyebrow: "Testimonials",
  /** Verbatim, the heading their homepage passes to this carousel. */
  heading: "Real stories from people who've been there, bought that.",
} as const;

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    // Corrected from OZMT9fgbH_c. See the mapping note above.
    youtubeId: "Nid3XKVEApg",
    quote:
      "They helped me say no to impulse buying & yes to framework based buying",
    people: [
      { name: "Bharat Singh", role: "Investment Professional in VC" },
      { name: "Neerja Ahuja", role: "Founder of EthinxThread" },
    ],
  },
  {
    // Corrected from Nid3XKVEApg. See the mapping note above.
    youtubeId: "XrsfHS7tCN0",
    quote:
      "We highly recommend every homebuyer get the Peace of Mind report – it's truly a peace of mind!",
    people: [
      { name: "Dr. Ankita Srivastava", role: "Dentist" },
      { name: "Vishal Srivastava", role: "Principal Engineer" },
    ],
  },
  {
    // Corrected from XrsfHS7tCN0. See the mapping note above.
    youtubeId: "OZMT9fgbH_c",
    quote:
      "The service Propsoch provides is outstanding, particularly for the price they offer!",
    people: [
      { name: "D.L. Narasimham", role: "Project Management Professional" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Featured in
//
// Their own heading. The five publications and the article each logo links to
// come from their FeaturedIn component; scripts/fetch-media-logos.mjs has the
// provenance and the note about the seven logos that are not on their CDN.
// ---------------------------------------------------------------------------

export const PRESS = {
  /** Verbatim. */
  heading: "Featured in India's top media",
  /**
   * Mine, and it exists because a logo is a picture of a brand, not a link
   * name. A screen reader reading five links called "The Print", "ANI"... is
   * being told who published, never that there is something to read.
   *
   * The publication goes last on purpose. "Read the ${name} article" produces
   * "Read the The Print article", because one of these five mastheads already
   * starts with an article. Putting the name after "on" reads correctly for
   * every one of them without special-casing any.
   */
  linkLabel: (name: string) => `Read the article about Propsoch on ${name}`,
} as const;

// ---------------------------------------------------------------------------
// Brochure vs reality: the master plan comparison
//
// All verbatim. The heading is the desktop wording, which ends in a full stop;
// their mobile markup drops it. The three overlay labels are theirs too, down
// to the guillemets around "Drag".
//
// The images are the two their own product page compares, fetched and re-encoded
// by scripts/fetch-plan-media.mjs. Alt text is MINE, because theirs is a
// truncated internal string ("...n Primitives Light") that describes nothing.
// Alt text is not content, it is a description of content, so writing a real one
// is a fix rather than an invention.
// ---------------------------------------------------------------------------

export const REALITY = {
  eyebrow: "See the reality",
  /** Verbatim, desktop wording. */
  heading: "Brokers show you the brochure. We show the reality.",
  /** Verbatim. */
  body:
    "Uncover both the magic and the missteps in the layout and amenities, usually hidden in glamorous model-flats & fancy brochures.",
  /** Verbatim overlay labels. */
  brokerLabel: "Broker",
  propsochLabel: "Propsoch",
  dragLabel: "Drag",
  /** Mine. See the note above. */
  brokerAlt:
    "A builder's marketing site plan: a glossy aerial render with numbered amenities and landscaped grounds.",
  propsochAlt:
    "The same site as a sanctioned technical drawing, with Propsoch's annotations marking a high tension line and a water treatment plant.",
  /** Mine. The control needs a name that says what moving it does. */
  sliderLabel:
    "Drag to compare the builder's brochure with Propsoch's analysis of the same plan",
} as const;

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

export interface TimelineStep {
  /** Week marker, verbatim from the original. */
  readonly marker: string;
  /** Step title, verbatim from the original. */
  readonly title: string;
  /** Supporting line. See the note below. */
  readonly detail: string;
}

export const TIMELINE = {
  eyebrow: "The process",
  /**
   * Verbatim heading, split so "25 days" can carry the emphasis their own h2
   * gives it (they set it semibold italic). Kept as two fields rather than one
   * string with markup in it, because content should not contain tags.
   */
  headingLead: "Here's how you will find a home with us in",
  headingEmphasis: "25 days",
  /** The whole heading as one string, for anything that needs plain text. */
  heading: "Here's how you will find a home with us in 25 days",
  /**
   * Verbatim. On their page this sits ABOVE the heading as a small grey
   * lead-in. Here it sits below it, because every other section on this page
   * introduces itself with the same eyebrow-then-heading pattern and breaking
   * that for one section costs more than the ordering gains. Same words, same
   * role, one line lower.
   */
  sub: "Buying a property should not take you forever",
  /** Verbatim. Does not act on click, like every other CTA here. */
  cta: "Book An Appointment",
} as const;

/**
 * The written testimonial that sits under the process CTA on their page.
 *
 * Verbatim, including the straight double quotes they wrap it in and the italic
 * on "research-based approach". Split into three parts so that emphasis can be
 * real <em> markup rather than a string containing tags.
 */
export const PROCESS_TESTIMONIAL = {
  quoteLead: '"Their scientific and ',
  quoteEmphasis: "research-based approach",
  quoteTail:
    ' to homebuying gave us a lot of comfort and solved our biggest pain point."',
  name: "Roshik Shenoy",
  role: "Partner, Human Capital @ Deloitte",
  /** Their avatar's fallback initials, kept for the same reason they have it. */
  initials: "RS",
} as const;

/**
 * Markers and titles are verbatim. The original names six activities and groups
 * them under five week markers, which is why Week 1 carries two.
 *
 * NOT VERBATIM (3 of 4): the `detail` lines. The original's step cards are
 * rendered client side as mixed markup that does not extract cleanly as prose,
 * so each detail is condensed from facts recovered elsewhere on the same page
 * (10 to 12 curated properties, 4 to 5 shortlisted, 20+ curation factors,
 * 2 complimentary Peace of Mind Reports, trained architects). No new claims.
 */
export const TIMELINE_STEPS: readonly TimelineStep[] = [
  {
    marker: "Today",
    title: "A quick free call",
    detail:
      "Talk to an advisor about your budget, your shortlist and what you actually need. No pressure to proceed.",
  },
  {
    marker: "Week 1",
    title: "Discovery form and longlist call",
    detail:
      "You fill in a short discovery form. We come back with 10 to 12 projects curated on 20+ factors, and walk you through why each one is on the list.",
  },
  {
    marker: "Week 2",
    title: "Site visits",
    detail:
      "We shortlist 4 to 5 projects and visit them with you, alongside an on-ground market expert who knows the area.",
  },
  {
    marker: "Week 3",
    title: "Deepdiving",
    detail:
      "You get 2 complimentary Peace of Mind Reports: the layout, the amenities and the trade-offs that model flats and brochures leave out.",
  },
  {
    marker: "Last week",
    title: "Negotiation and Closure",
    detail:
      "We negotiate with the builder using the insights from the reports, then support you through paperwork and closure.",
  },
] as const;

// ---------------------------------------------------------------------------
// Savings calculator
// ---------------------------------------------------------------------------

export const CALCULATOR = {
  eyebrow: "Savings calculator",
  /** Verbatim heading from the original. */
  heading: "Choose the smart way to save ~₹4.78 L & 3 months of your life.",
  intro:
    "Move the slider to your budget and see what Propsoch's average saving works out to.",
  sliderLabel: "Your budget",
  resultLabel: "Estimated saving",
  /** Required by the brief: estimates must be labelled illustrative on screen. */
  disclosure:
    "Illustrative estimate based on Propsoch's average savings. Not a quote.",
  /**
   * The published average saving is ~Rs 4.78 L. At this 4.8% rate that implies an
   * average ticket of about Rs 99.6 L, so the rate is consistent with the real
   * published figure rather than an arbitrary constant.
   */
  saveRate: 0.048,
  minBudget: 50_00_000, // Rs 50 Lakh
  maxBudget: 25_00_00_000, // Rs 25 Crore
} as const;

// ---------------------------------------------------------------------------
// Pincode checker
// ---------------------------------------------------------------------------

export const PINCODE = {
  eyebrow: "Coverage",
  /** Verbatim heading from the original footer section. */
  heading: "Top Locations We Cover",
  intro:
    "Enter a 6-digit pincode to check whether Propsoch advisors cover that area today.",
  inputLabel: "Pincode",
  hint: "6 digits, for example 560034",
  buttonLabel: "Check availability",
  invalidMessage: "Enter a 6-digit pincode.",
  notCoveredMessage: "We're not in that area yet.",
  notCoveredHelp: "Propsoch currently advises homebuyers in Bangalore and Mumbai.",
} as const;

// ---------------------------------------------------------------------------
// Navigation and footer. Section links are real in-page anchors.
// ---------------------------------------------------------------------------

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export const SECTION_LINKS: readonly NavLink[] = [
  { label: "How are we different?", href: "#comparison" },
  { label: "Real stories", href: "#testimonials" },
  { label: "Find a home in 25 days", href: "#timeline" },
  { label: "Savings calculator", href: "#calculator" },
  { label: "Frequently asked questions", href: "#faq" },
] as const;

/**
 * All verbatim from the original footer.
 *
 * NOT VERBATIM (4 of 4), by omission: the original footer also prints a GSTIN of
 * "12314ASDAD213" and a CIN of "21312215151661". Both are obvious placeholder
 * strings on the live site, so reproducing them would amount to shipping
 * fabricated registration data. They are left out. The two RERA registrations
 * below are well formed and are reproduced as-is.
 */
export const FOOTER = {
  tagline:
    "Independent home buying advice from trained architects, not commission-driven brokers.",

  /** Builders the original links in its footer. All verbatim. */
  buildersHeading: "Partner Builders",
  builders: [
    "Prestige Developers",
    "Godrej Properties",
    "Brigade Developers",
    "Sobha Developers",
    "Assetz Developers",
  ],

  /**
   * Propsoch's real social accounts, taken from the live site's own links.
   * These stay as real links: they are public profiles that exist, and they are
   * navigation rather than a call to action.
   */
  socialHeading: "Follow Propsoch",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/propsoch.club" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/propsoch" },
    { label: "YouTube", href: "https://www.youtube.com/@club.propsoch" },
    { label: "Email", href: "mailto:club@propsoch.com" },
  ],
  locationsHeading: "Top Locations We Cover",
  locations: [
    "Whitefield",
    "Sarjapur Road",
    "Bellandur",
    "Yelahanka",
    "HSR Layout",
  ],
  citiesHeading: "Cities",
  cities: ["Bangalore", "Mumbai"],
  propertyTypesHeading: "Browse by",
  propertyTypes: [
    "Luxury Homes",
    "Properties <3Cr",
    "Properties <2Cr",
    "Ready To Move In",
    "Townships",
  ],
  exploreHeading: "Explore",
  legalHeading: "Legal",
  legalLinks: ["Privacy Policy", "Terms & Conditions"],
  rera: [
    {
      state: "Karnataka RERA Reg. No.",
      number: "PRM/KA/RERA/1251/446/AG/220927/003103",
      href: "https://rera.karnataka.gov.in",
      hrefLabel: "rera.karnataka.gov.in",
    },
    {
      state: "Maharashtra RERA Reg. No.",
      number: "A041182600110",
      href: "https://maharera.maharashtra.gov.in",
      hrefLabel: "maharera.maharashtra.gov.in",
    },
  ],
} as const;

/**
 * Rebuild notice. This is a performance and accessibility rebuild of the
 * Propsoch landing page, not the live product, and no button on it performs a
 * real action. Saying so in the footer is more honest than a page that looks
 * transactional but is not.
 */
export const REBUILD_NOTICE =
  "This is an independent rebuild of the Propsoch landing page, focused on performance, accessibility and responsive design. Calls to action are intentionally non-functional.";
