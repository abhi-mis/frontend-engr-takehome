// Every string rendered on the page. Copy marked verbatim is Propsoch's own,
// read off the live site; anything else is flagged where it appears.
export const SITE = {
  name: "Propsoch",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title:
    "Propsoch - Bangalore - Real Estate - Search/Buy/Sell Properties | Propsoch",
  description:
    "Buy your dream home confidently with Propsoch - Bangalore's smartest real estate service for home buyers to get expert advice, property insights & reports.",
  locale: "en-IN",
  legalEntity: "Thinkr Proptech Private Limited",
} as const;

export const HERO = {
  headlineLead: "Blindly trusting a broker's",
  headlineAccent: "Sales Pitch?",
  headlineAlternates: ["Fake Claims?", "Half Info?"],
  valueProp:
    "Get independent guidance from advisors who've helped 1000+ families buy the right home.",
  primaryCta: "Propsoch Kar",
  secondaryCta: "Already a member? Login",
  marqueeRepeat: 8,
  trustedByLabel: "Trusted by homebuyers like you from",
} as const;

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

export interface Stat {
  readonly value: string;
  readonly label: string;
}

export const STATS: readonly Stat[] = [
  { value: "700+", label: "Projects Across Bangalore" },
  { value: "2,500+", label: "Intelligent Homebuyers" },
  { value: "8500+", label: "Hours of Advice" },
  { value: "290+", label: "Partner Builders" },
] as const;

export interface ComparisonRow {
  readonly criteria: string;
  readonly propsoch: string;

  readonly other: string;
}

export interface ComparisonSet {
  readonly id: string;
  readonly tabLabel: string;
  readonly columnLabel: string;

  readonly columnNote?: string;

  readonly caption: string;
  readonly rows: readonly ComparisonRow[];
}

export const COMPARISON = {
  eyebrow: "How we compare",
  heading: "How are we different?",
  subheading: "Compare our services with",
  criteriaHeader: "What you care about",
  propsochHeader: "Propsoch",
  tabsLabel: "Choose who to compare Propsoch with",
} as const;

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

export interface TestimonialPerson {
  readonly name: string;

  readonly role: string;
}

export interface Testimonial {
  readonly youtubeId: string;

  readonly quote: string;

  readonly people: readonly TestimonialPerson[];
}

export const TESTIMONIALS_SECTION = {
  eyebrow: "Testimonials",
  heading: "Real stories from people who've been there, bought that.",
} as const;

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    youtubeId: "Nid3XKVEApg",
    quote:
      "They helped me say no to impulse buying & yes to framework based buying",
    people: [
      { name: "Bharat Singh", role: "Investment Professional in VC" },
      { name: "Neerja Ahuja", role: "Founder of EthinxThread" },
    ],
  },
  {
    youtubeId: "XrsfHS7tCN0",
    quote:
      "We highly recommend every homebuyer get the Peace of Mind report – it's truly a peace of mind!",
    people: [
      { name: "Dr. Ankita Srivastava", role: "Dentist" },
      { name: "Vishal Srivastava", role: "Principal Engineer" },
    ],
  },
  {
    youtubeId: "OZMT9fgbH_c",
    quote:
      "The service Propsoch provides is outstanding, particularly for the price they offer!",
    people: [
      { name: "D.L. Narasimham", role: "Project Management Professional" },
    ],
  },
];

export const PRESS = {
  heading: "Featured in India's top media",
  linkLabel: (name: string) => `Read the article about Propsoch on ${name}`,
} as const;

export const REALITY = {
  eyebrow: "See the reality",
  heading: "Brokers show you the brochure. We show the reality.",
  body:
    "Uncover both the magic and the missteps in the layout and amenities, usually hidden in glamorous model-flats & fancy brochures.",
  brokerLabel: "Broker",
  propsochLabel: "Propsoch",
  dragLabel: "Drag",
  brokerAlt:
    "A builder's marketing site plan: a glossy aerial render with numbered amenities and landscaped grounds.",
  propsochAlt:
    "The same site as a sanctioned technical drawing, with Propsoch's annotations marking a high tension line and a water treatment plant.",
  sliderLabel:
    "Drag to compare the builder's brochure with Propsoch's analysis of the same plan",
} as const;

export interface FloorPlanCheck {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

export const FLOOR_PLAN = {
  eyebrow: "How we read a plan",
  heading: "Read a floor plan like an architect",
  intro:
    "The plan is the one document you are always handed and rarely taught to read. These are the five things our advisors look at first, before anyone mentions price.",
  groupLabel: "Choose what to look at on the plan",
  figureNote: "A representative two-bedroom plan, not a specific project.",
} as const;

export const FLOOR_PLAN_CHECKS: readonly FloorPlanCheck[] = [
  {
    id: "ventilation",
    title: "Cross ventilation",
    body:
      "Air needs a way in and a way out. Look for openings on opposite or adjacent walls rather than all on one face, so a room can clear itself without a fan.",
  },
  {
    id: "circulation",
    title: "Circulation space",
    body:
      "Every corridor is floor area you pay for and cannot furnish. A plan that moves you between rooms in short, direct runs leaves more of the carpet area usable.",
  },
  {
    id: "doors",
    title: "Door lines",
    body:
      "Swing each door open in your head. If it fouls a window, a switchboard or another door, the room loses a corner of itself every time somebody walks in.",
  },
  {
    id: "balcony",
    title: "Usable balcony depth",
    body:
      "A balcony shallower than about 1.2 metres will not hold a chair and a table at the same time. Depth is what decides whether it becomes a room or a drying rack.",
  },
  {
    id: "kitchen",
    title: "Kitchen and utility",
    body:
      "Check that the utility opens off the kitchen rather than through the living room, and that the sink, hob and fridge sit close enough to work between without crossing the floor.",
  },
] as const;

export interface TimelineStep {
  readonly marker: string;

  readonly title: string;

  readonly detail: string;
}

export const TIMELINE = {
  eyebrow: "The process",
  headingLead: "Here's how you will find a home with us in",
  headingEmphasis: "25 days",
  heading: "Here's how you will find a home with us in 25 days",
  sub: "Buying a property should not take you forever",
  cta: "Book An Appointment",
} as const;

export const PROCESS_TESTIMONIAL = {
  quoteLead: '"Their scientific and ',
  quoteEmphasis: "research-based approach",
  quoteTail:
    ' to homebuying gave us a lot of comfort and solved our biggest pain point."',
  name: "Roshik Shenoy",
  role: "Partner, Human Capital @ Deloitte",
  initials: "RS",
} as const;

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

export interface Advisor {
  readonly role: string;

  readonly credential: string;

  readonly covers: readonly string[];

  readonly looksAt: string;
}

export const ADVISORS_SECTION = {
  eyebrow: "The team",
  heading: "The people who will actually advise you",
  intro:
    "Not a call centre and not a broker. Every shortlist is put together by someone who has drawn buildings for a living and walked the micromarket you are buying in.",
  coversLabel: "Covers",
  looksAtLabel: "Looks at",
  footnote:
    "Roles, coverage and focus are drawn from Propsoch's own published claims. Names, photographs and registration numbers are theirs to fill in.",
} as const;

export const ADVISORS: readonly Advisor[] = [
  {
    role: "Principal advisor",
    credential: "Trained architect",
    covers: ["Whitefield", "Sarjapur Road", "Bellandur"],
    looksAt: "Floor plan efficiency, daylight and ventilation, sanctioned plan checks",
  },
  {
    role: "Advisor",
    credential: "Trained architect, urban design",
    covers: ["HSR Layout", "Koramangala", "Indiranagar"],
    looksAt: "Micromarket pricing, project curation on 20+ factors, site visits",
  },
  {
    role: "Advisor",
    credential: "Urban planner",
    covers: ["Yelahanka", "Hebbal", "Kalyan Nagar"],
    looksAt: "Infrastructure timelines, future development, connectivity risk",
  },
  {
    role: "Legal and diligence",
    credential: "Property title specialist",
    covers: ["Karnataka", "Maharashtra"],
    looksAt: "Title, encumbrance, RERA registration, litigation history",
  },
] as const;

export const GUIDED = {
  eyebrow: "Why Propsoch",
  heading: "Choose the smart way to save ~₹4.78 L & 3 months of your life.",
  intro:
    "You're about to make the biggest purchase of your life. We make sure you do it intelligently.",
  cardTitle: "Guided Home Buying",
  cardBody:
    "9 in 10 homebuyers have bought a home via us within 25 days. Trusted by 1000+ buyers from Google, Amazon, Peak XV etc.",
  savingsLabel: "Save",
  savingsValue: "₹4,78,125/-",
  cardFooter:
    "Experience truly unbiased advisory & get total peace of mind",
  primaryCta: "Book A Free Call",
  secondaryCta: "See How You Will Save",
  note: "Illustrative estimate based on Propsoch's published figures. Not a quote.",
} as const;

export const GUIDED_CAPABILITIES: readonly string[] = [
  "Work with trained architects",
  "Check builders, areas & projects",
  "See pros & cons exhaustively",
  "Assess livability & financial risks",
  "Lowest price negotiations",
  "Get rewarded handsomely",
] as const;

export const CALCULATOR = {
  eyebrow: "Savings calculator",
  heading: "Choose the smart way to save ~₹4.78 L & 3 months of your life.",
  intro:
    "Move the slider to your budget and see what Propsoch's average saving works out to.",
  sliderLabel: "Your budget",
  resultLabel: "Estimated saving",
  disclosure:
    "Illustrative estimate based on Propsoch's average savings. Not a quote.",
  saveRate: 0.048,
  minBudget: 50_00_000,
  maxBudget: 25_00_00_000,
} as const;

export const PINCODE = {
  eyebrow: "Coverage",
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

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export const SECTION_LINKS: readonly NavLink[] = [
  { label: "How are we different?", href: "#comparison" },
  { label: "Real stories", href: "#testimonials" },
  { label: "Read a floor plan", href: "#floor-plan" },
  { label: "Find a home in 25 days", href: "#timeline" },
  { label: "Who advises you", href: "#advisors" },
  { label: "Frequently asked questions", href: "#faq" },
] as const;

export const FOOTER = {
  tagline:
    "Independent home buying advice from trained architects, not commission-driven brokers.",
  buildersHeading: "Partner Builders",
  builders: [
    "Prestige Developers",
    "Godrej Properties",
    "Brigade Developers",
    "Sobha Developers",
    "Assetz Developers",
  ],
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

export const REBUILD_NOTICE =
  "This is an independent rebuild of the Propsoch landing page, focused on performance, accessibility and responsive design. Calls to action are intentionally non-functional.";
