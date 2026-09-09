/**
 * The FAQ, lifted verbatim from Propsoch's own FAQ array.
 *
 * WHERE IT CAME FROM
 *
 * Their answers ship as HTML strings inside a JavaScript chunk, with <ol>,
 * <ul>, <li>, <strong> and <br/> in them. Rendering those with
 * dangerouslySetInnerHTML would mean trusting a scraped string to be markup
 * forever, so a one-off extractor parsed each answer into the small block shape
 * below and this file is its output. The words are untouched; only the
 * container changed, from a string of tags to real elements.
 *
 * TWO EDITS, BOTH THE SAME RULE
 *
 * Their content contains two exact duplicates, and both are dropped:
 *
 *   1. The "I am confused looking at various options" answer lists the bullet
 *      "Is this neighborhood safe?" twice in a row.
 *   2. "Why Work With Us" lists the Magicbricks/99Acres comparison question
 *      twice, at positions 1 and 3, with a byte-identical answer.
 *
 * An exact duplicate carries no information, and shipping one makes the rebuild
 * look broken rather than faithful. Nothing else is touched, including their
 * spelling of "neighborhood" here against "neighbourhood" two answers earlier.
 *
 * The second one was found by a browser console error, not by reading: React
 * warned about two children with the same key. A duplicate-key warning is
 * usually a bug in the markup; this time the markup was right and the data was
 * wrong.
 *
 * TWO WORDS THE PROJECT'S OWN RULES WOULD OTHERWISE FLAG
 *
 * One answer uses "empower", which is on this build's banned-word list, and the
 * project also bans em dashes. Both rules are about MY prose. This file is a
 * quotation of Propsoch's, and the instruction is to keep their text as it is,
 * so nothing here is reworded. The rule checker flags this file; that is the
 * checker being right about the word and wrong about whose word it is.
 *
 * 31 questions across 4 categories.
 */

export interface FaqBlock {
  readonly kind: "p" | "list";
  /** Set when kind is "p". */
  readonly text?: string;
  /** Set when kind is "list". */
  readonly ordered?: boolean;
  readonly items?: readonly { readonly lead: string | null; readonly text: string }[];
}

export interface FaqItem {
  readonly question: string;
  readonly blocks: readonly FaqBlock[];
}

export interface FaqGroup {
  readonly category: string;
  /**
   * The category name is the tab's LABEL. This is its VALUE.
   *
   * Radix builds element ids out of a tab's value, and `aria-controls` is a
   * space-separated list of ids. A value of "About the Service" therefore
   * produces aria-controls="...-About the Service", which a browser reads as
   * three separate id references, none of which exist. axe flags it, and a
   * screen reader following the relationship lands nowhere.
   *
   * Found by running an accessibility audit, not by reading the code.
   */
  readonly slug: string;
  readonly items: readonly FaqItem[];
}

export const FAQ_SECTION = {
  eyebrow: "Questions",
  /** Verbatim. */
  heading: "Frequently Asked Questions",
  /** Verbatim. */
  sub: "99% of your queries should get answered here, for others, you can always talk to us",
} as const;

/** The card under the FAQ. All three strings verbatim. */
export const FAQ_CTA = {
  heading: "Still have questions?",
  sub: "We are always here for you",
  cta: "Book A Free Call",
  /** Mine: their spectacles graphic is decorative, but it needs a name if it is ever exposed. */
  imageAlt: "",
} as const;

export const FAQ_GROUPS: readonly FaqGroup[] = [
  {
    category: "About the Service",
    slug: "about-the-service",
    items: [
      {
        question: "What is Guided Home Buying? How does it work?",
        blocks: [
          { kind: "p", text: "We have divided the home-buying journey into five stages:" },
          {
            kind: "list",
            ordered: true,
            items: [
              { lead: "Discovery", text: "This is where we understand your needs in incredible detail so we can really personalise your journey. Usually it takes ~10 minutes for you to share the details with us." },
              { lead: "Shortlisting", text: "We will curate a list of projects that closely match your preferences & discuss pros & cons of the neighbourhood, developer, project & its floor plans so you’re well armed with information before visiting the site." },
              { lead: "Site Visits", text: "Our architects will schedule and accompany you to visit the shortlisted projects with a checklist of tradeoffs to review. We will get the exact availability & quoted price of the units while inspecting the location, the approach road and the project along with you." },
              { lead: "Deep Dive", text: "Once we know the exact units you like, we analyse the floor plans in detail, check ventilation, lighting, vastu, pricing and a lot more so we can see the complete picture and identify the levers we need to either reject it or negotiate a great deal for you." },
              { lead: "Booking", text: "We will help you negotiate, connect with loan & financing experts, navigate the payment terms, and seal the deal for a property you can really call home. But that’s not all, we will help you after you book the property too." },
            ],
          },
        ],
      },
      {
        question: "Will you assist with negotiations?",
        blocks: [
          { kind: "p", text: "Yes absolutely. Our market experts have been trained on various negotiation strategies. They also leverage the insights we find during our research to get you the best-possible offer for the deal." },
          { kind: "p", text: "Since we are aware of the transactions being done on-ground in real time, we understand the demand, the supply and how far we can push the builder on your behalf." },
        ],
      },
      {
        question: "I am confused looking at various options, how can this service help?",
        blocks: [
          { kind: "p", text: "Home Buying is overwhelming. If you’ve been in the market for a couple of weeks / months, you would have already got these questions keeping you awake at night." },
          {
            kind: "list",
            ordered: false,
            items: [
              { lead: null, text: "How do I even know if I'm getting a good deal?" },
              { lead: null, text: "Is this neighborhood safe?" },
              { lead: null, text: "Is the developer reliable?" },
              { lead: null, text: "Am I paying too much?" },
              { lead: null, text: "Will I regret this decision later?" },
            ],
          },
          { kind: "p", text: "Our team has expertly crafted the guided home buying so you can confidently answer these questions with our insights, tools and intel. Guided Home Buying is a structured approach, a method to the madness of home buying." },
        ],
      },
      {
        question: "What are the timelines?",
        blocks: [
          { kind: "p", text: "On an average, every homebuyer takes 24 days to book a property with us. Once you sign up," },
          {
            kind: "list",
            ordered: true,
            items: [
              { lead: null, text: "We will instantly create a WhatsApp group with you, your dedicated advisor and one of our Customer Success Partners that serves as a direct communication channel for any updates, queries and expert guidance." },
              { lead: null, text: "You’ll receive a link in the group to schedule your Discovery Call. Within 24 hours, the Subject Matter Expert will connect with you to better understand your budget, preferences and lifestyle for tailoring the best options." },
              { lead: null, text: "Based on your preferences, our Research and Advisory team carefully selects properties from our extensive database of 500+ RERA-approved projects. They curate a list of 10-12 options that perfectly align with your requirements. This process typically takes 48 hours." },
              { lead: null, text: "Once you have narrowed down the final 4-5 properties, we schedule property tours at your convenience. Our Subject Matter Expert accompany you to the shortlisted options to ensure you get a first-hand look at each property." },
              { lead: null, text: "Within 24 hours of your site visits, you receive a detailed Peace of Mind Report that covers 80+ parameters on neighborhood analysis, builder credibility, hidden costs, legal and compliance check, among others." },
              { lead: null, text: "Once you choose your preferred property, we assist with price negotiations and deal closure, which usually takes 5-7 days." },
              { lead: null, text: "Post that, we guide you through the entire closing process (if required) - from legal verifications to final paperwork to ensure everything is in place. This typically takes another 7-10 days, depending on the developer and documentation requirements." },
            ],
          },
        ],
      },
      {
        question: "Do you also assist with home loans, taxation & legal matters?",
        blocks: [
          { kind: "p", text: "Yes, we have tied up with vendors and experts who can help you understand the financial implications, compare home loans, choose banks and get home loans hassle free." },
          { kind: "p", text: "We have also tied with CAs who can help you with capital gains, taxes and related matters. Whether you’re selling a property and buying a new one, or buying it for investments, we have built tools to help you visualise your cash flows and make informed decisions." },
          { kind: "p", text: "On legal matters, we have tied up with lawyers who bring many years of experience reviewing real estate agreements. So you can be rest assured that what you’ll consider will be legally clean." },
          { kind: "p", text: "However, please note the fees for each of these vendors would be paid separately as we progress to the booking stage. We’ve tied up and negotiated a price that’s a win-win for you and the vendors." },
        ],
      },
      {
        question: "What kind of properties will you recommend?",
        blocks: [
          { kind: "p", text: "We specialise in gated communities across Bangalore. So we can help buy" },
          {
            kind: "list",
            ordered: true,
            items: [
              { lead: null, text: "Under Construction - RERA approved plots, villas or apartments directly from the builder" },
              { lead: null, text: "Ready to Move - RERA approved plots, villas or apartments directly from the builder" },
              { lead: null, text: "Plots, villas or apartments in pre-launch phase which are set to receive RERA approval soon" },
              { lead: null, text: "We have also slowly started building a database of resale opportunities in the market." },
            ],
          },
        ],
      },
      {
        question: "Will you also help me buy individual / standalone houses?",
        blocks: [
          { kind: "p", text: "Unfortunately no, we do not work on individual houses / standalone buildings yet." },
        ],
      },
      {
        question: "Will you directly liaise with the builder for the deal, or is there a third party involved?",
        blocks: [
          { kind: "p", text: "Propsoch will liaise directly with the builders and keep you posted on the progress. Unless you want to visit the site or proceed with the negotiations, we will not share your information with the builders. Also, there is no third party involved in this journey. You will have a single point of contact for a hassle-free experience." },
        ],
      },
      {
        question: "How many properties can I visit with you?",
        blocks: [
          { kind: "p", text: "You can visit as many properties as you like, but it wouldn’t be the best use of your time or ours. Our shortlisting process helps you make informed decisions about which properties are relevant for you and once we have the latest availability and pricing, we plan the site visits accordingly. On an average, our customers visit 4-6 sites before making a decision." },
        ],
      },
      {
        question: "What happens if I have already seen or visited a few properties?",
        blocks: [
          { kind: "p", text: "If you have already seen / visited a few properties, we can provide you with a quick analysis on how they compare with the curation we have done for you. After we present the comparative analysis, you can choose to:" },
          {
            kind: "list",
            ordered: true,
            items: [
              { lead: "Proceed with a property you’ve already visited", text: "Since we are not the registered partner, we cannot negotiate on your behalf or help you with end-to-end support after the booking. Also, since we are not eligible to collect our referral fees from the builders here, you can avail the Peace of Mind report at a cost of ₹9999." },
              { lead: "Proceed with a property we’ve recommended", text: "As registered partners, we will help you end-to-end support, negotiations and 2 complementary Peace of Mind reports (worth ₹14,999) to help you compare and make a decision confidently." },
            ],
          },
          { kind: "p", text: "Please note that at no point, will we advise you against a property that you’ve already visited if it matches the preferences you’ve shared. If the property is a great match for you, we will recommend you to proceed." },
        ],
      },
      {
        question: "Does someone physically travel to the property to analyse them?",
        blocks: [
          { kind: "p", text: "Yes, our on-ground team is constantly monitoring the latest pricing, availability, and upcoming developments across Bangalore." },
          { kind: "p", text: "They will help you with both pros and cons of the neighbourhood, give you insights into pricing strategies and builder’s pedigree when you visit the sites with them." },
          { kind: "p", text: "Most importantly, they will shield you from high pressure sales tactics to avoid a bad decision and facilitate a transparent and fair negotiation during the booking." },
        ],
      },
      {
        question: "What kind of questions will I get answers to during the process?",
        blocks: [
          { kind: "p", text: "We will answer all your queries like:" },
          {
            kind: "list",
            ordered: true,
            items: [
              { lead: null, text: "Should I buy an apartment, villa or a plot? What is the ideal step for me, personally?" },
              { lead: null, text: "How can we compare all the neighbourhoods, builders, projects, floor plans exhaustively?" },
              { lead: null, text: "Which projects are coming up? What is the future development planned around?" },
              { lead: null, text: "How do I invest my capital gains well? How do I assess the resalability of my investment?" },
              { lead: null, text: "What is the right budget for my needs? Is the market overpriced or undervalued?" },
              { lead: null, text: "What is the history of the XYZ builder? What’s the construction quality? Can I trust them?" },
              { lead: null, text: "What are the key risks in a particular project or a builder? How can I mitigate them?" },
              { lead: null, text: "What will be the approximate rental yield or CAGR of my investment?" },
              { lead: null, text: "and a lot more…" },
            ],
          },
          { kind: "p", text: "We will deliver deeply researched insights on the locations, investment strategies, builder’s history and pedigree, project’s master plans, floor plans, pricing, payment terms, flooding, air quality, livability, privacy and other risks. Our Peace of Mind report is a great way to get a holistic understanding of the depth of our research. Check out a sample of our Peace of Mind report above." },
          { kind: "p", text: "Essentially, everything you need to buy a home, without headaches. We really mean it." },
        ],
      },
    ],
  },
  {
    category: "Fees",
    slug: "fees",
    items: [
      {
        question: "What are the charges for Guided Home Buying?",
        blocks: [
          { kind: "p", text: "We charge a flat service fee of ₹4999, inclusive of taxes. The fee is valid for 6 months. In the rare case that you are not satisfied with our service, we will refund this entire amount to you, no questions asked." },
        ],
      },
      {
        question: "Is the signup fee a one-time charge, or will there be additional charges?",
        blocks: [
          { kind: "p", text: "There are no additional charges for availing our services. For ₹4999, you get access to our database of 500+, our subject matter expert architects, our on-ground market experts who’ll leave no stone unturned to help you shortlist, visit and buy a home confidently." },
        ],
      },
      {
        question: "If none of the suggested properties meet my expectations, will you refund the service fee?",
        blocks: [
          { kind: "p", text: "Yes, we will refund the service fees if we are unable to match your expectations or if you’re unsatisfied. As we are an early startup, we would urge you to share your feedback with us candidly so we can serve you better." },
        ],
      },
      {
        question: "What is the refund policy?",
        blocks: [
          { kind: "p", text: "In the event that you leverage our insights and services, but proceed with another channel partner or directly with the builder for the options we have curated for you, we will not be able to refund our fees. In any other case, we are happy to refund you the fees if you’re unsatisfied with our service." },
        ],
      },
      {
        question: "How does Propsoch make money?",
        blocks: [
          { kind: "p", text: "We are eligible to collect a referral fee from the builder when you buy through us." },
        ],
      },
      {
        question: "How long is the Guided Home Buying service valid for?",
        blocks: [
          { kind: "p", text: "The validity of our Guided Home Buying Service is six months from the date you sign up. In 6 months, the market dynamics, availability, prices and products would have changed drastically. Our insights might not be relevant then, hence we keep an outer boundary of six months." },
        ],
      },
      {
        question: "What happens after the service validity is over?",
        blocks: [
          { kind: "p", text: "While 70% of our customers do find their ideal property within a month, we know everyone’s journey is unique. Our Guided Home Buying Service is designed to assist you throughout this process with a support period of 6 months from the date you sign up. If, for any reason, you haven't found the right property by then, you can always sign-up for our service again. We’re here to help you at every step, no matter how long it takes." },
        ],
      },
    ],
  },
  {
    category: "Why Work With Us",
    slug: "why-work-with-us",
    items: [
      {
        question: "How does it compare to other online platforms like Magicbricks, 99Acres, NoBroker or Housing?",
        blocks: [
          { kind: "p", text: "Other online platforms like Magicbricks, 99Acres or Housing are classified ad platforms where builders and brokers promote the projects which they’ve vested interests in and pay to get your contact information. Data is provided by builders and brokers. There is no independent verification of information added on these platforms. Basic information like floor plans, marketing brochures or approval documents are locked behind sign up forms that lead to incredible spam and FoMO creation." },
          { kind: "p", text: "Meanwhile, Propsoch has an independent team of architects that curate information from various sources like RERA, subregistrar portals, Google Maps, Google Earth, on-ground staff and conduct in-depth research to ensure data is accurate and unbiased. You do NOT have to compromise your privacy or get spammed to access basic information on Propsoch. We’re adding new projects on our website everyday, please bear with us if a property you’re interested in doesn’t exist on our platform today." },
          { kind: "p", text: "A short comparison table is attached above on the page for your reference." },
        ],
      },
      {
        question: "What is the difference between Propsoch & other channel partners / brokers?",
        blocks: [
          { kind: "p", text: "A channel partner / broker is an extended marketing arm of builders. They are notorious to leverage high pressure sales tactics, spam, FOMO etc, and build a rosy, fairy, but incomplete narrative of projects. Usually, they have localised operations in a particular market like Whitefield / HSR Layout and only present options from their portfolio. There are false promises of privacy, negotiations, cashbacks and post-sales support." },
          { kind: "p", text: "Propsoch, is a team of industry experts and architects who act on your behalf - the buyer. We deliver intelligent insights in a consultative approach without creating any sense of urgency or FoMo. We highlight both pros and cons so you can make informed decisions & avoid remorse. Our architects have analysed more than 500+ properties across Bangalore. Our team will negotiate on your behalf, fight for favorable terms for you and ensure you’ve end-to-end support till you get the keys to your home. Think of us as Ditto Insurance, but for Real Estate." },
          { kind: "p", text: "A short comparison table is attached above on the page for your reference." },
        ],
      },
      {
        question: "What are the benefits of going with this service vs doing it myself?",
        blocks: [
          { kind: "p", text: "We understand that home buying is one of the most important decisions of your life and steering through the process alone can be overwhelming. But with our Guided Home Buying Service, we make this journey easier, faster and even more efficient:" },
          {
            kind: "list",
            ordered: true,
            items: [
              { lead: null, text: "Instead of you spending months researching online listings, our market wizards evaluate potential RERA-approved projects and handpick 10-12 options that perfectly match your requirements that save you dozens of hours spent cold calls and unnecessary site visits." },
              { lead: null, text: "Unlike self-search, where you're limited to marketing materials, we deeply analyze the pros and cons of properties - from pricing, builder track records to project approvals and future developments - so you can make stress-free decisions." },
              { lead: null, text: "Endless site visits, confusing layouts and pushy sales pitches make househunting a tedious process. Our Subject Matter Experts accompany you and break down everything - floor plans, amenities, pricing and even legal checks - so you see beyond the surface level details." },
              { lead: null, text: "Individual buyers often struggle to get the best deals while builders have sales teams working in their favour. Our market experts negotiate on your behalf by using real market data, securing better prices, flexible payment terms and added perks that aren’t even advertised." },
              { lead: "only for you", text: "Unlike other platforms, we work - not for builder commissions. Our transparent, fixed-fee model ensures our recommendations are purely in your best interest, not influenced by hidden incentives." },
              { lead: null, text: "We don’t disappear after showing you properties. From answering your questions to handling paperwork, legal checks and finalizing the deal, we stay with you at every step." },
            ],
          },
        ],
      },
      {
        question: "I want to invest my money, would it make sense for me to sign up?",
        blocks: [
          { kind: "p", text: "Yes, absolutely. If you're looking to invest in real estate, signing up for our Guided Home Buying Service will hold a great choice!" },
          { kind: "p", text: "Whether you’re eyeing a property for rental income or planning on capital appreciation through resale in the future, our team is here to help you find options that align with your goals. We can guide you through the entire process - understanding market trends, spotting suitable properties, evaluating possession timeline, cashflow breakdowns, investment returns to finalise the deal." },
          { kind: "p", text: "That said, if you’re looking for rental income, capital appreciation or both, we provide expert advice and resources to make the process smoother." },
        ],
      },
      {
        question: "I want to live in this property, would it make sense for me to sign up?",
        blocks: [
          { kind: "p", text: "Absolutely! If you're an end user, signing up for our Guided Home Buying Service can make the process much easier. Here’s how we can help:" },
          {
            kind: "list",
            ordered: true,
            items: [
              { lead: null, text: "We’ll begin by getting to know your preferences, such as location, budget, lifestyle needs and any specific requirements for your future home." },
              { lead: null, text: "Based on what you’ve shared, we’ll create a list of suitable properties that match your criteria from 500+ RERA approved projects." },
              { lead: null, text: "Through our Peace of Mind Report, we’ll provide insights into the market conditions, pricing analysis, neighbourhood, lighting & ventilation, vastu and a lot more." },
              { lead: null, text: "We’ll then coordinate site visits with you and offer professional advice to help you assess the properties thoroughly." },
              { lead: null, text: "When you finally zero in on a property, we’ll guide you through making a fair offer by helping with the negotiation process and sealing the best deal." },
            ],
          },
          { kind: "p", text: "With our experience and resources, you can feel confident knowing that we’re by your side every step of the way." },
        ],
      },
    ],
  },
  {
    category: "Trust",
    slug: "trust",
    items: [
      {
        question: "What’s Propsoch? How long have you been in the market?",
        blocks: [
          { kind: "p", text: "We started Propsoch more than 3 years ago. In the first year, we only collected & analysed data for 500+ projects in Bangalore to build India’s most exhaustive real-estate dictionary. Think of it as the USA’s version of MLS. After that, we were confident we can help people like you buy homes with utmost transparency and clarity." },
          { kind: "p", text: "Founded by Ashish Acharya, an industry veteran with 17+ years of experience in assessing land risks at Godrej and Anarock, we are a team armed with expertise across geographic, architectural, legal and financial factors." },
          { kind: "p", text: "We aim to bring transparency in the opaque world of real estate and call out both the pros & cons when the rest of the world only shows you the glossy, rosy picture. Our core purpose is to bring genuine insights to empower you to make an informed decision." },
        ],
      },
      {
        question: "Is Propsoch just a channel partner?",
        blocks: [
          { kind: "p", text: "No, Propsoch is not just a channel partner. We are a Buyer centric home buying advisory platform where we leverage subject matter experts & technology to help homebuyers make informed decisions. We have empaneled with 200+ builders to provide the widest range of projects in the city, and are not limited to certain builders or locations." },
        ],
      },
      {
        question: "Why should I trust you?",
        blocks: [
          { kind: "p", text: "Because we’ve got your back at every step! We’re not just another listed platform like 99 Acres/Magicbricks but your trusted partner who ensures you get the finest property with verified, unbiased insights at the best price." },
          {
            kind: "list",
            ordered: true,
            items: [
              { lead: null, text: "200+ smart homebuyers trusted us alone last year who have already found their perfect homes with Propsoch." },
              { lead: null, text: "While online portals give you just 20-40 data points, we deep-dive with 80+ parameters verified by architects that cover everything from legal clearances to future resale value." },
              { lead: null, text: "Unlike listings that only highlight the pros, we give you a detailed pros & cons report so you know exactly what you’re getting into." },
              { lead: null, text: "Our data comes straight from RERA, Google Maps, CDP, and other trusted sources, not just what a developer or broker wants you to see." },
              { lead: null, text: "Online portals work based on the number of contacts, but we stay with you from search to site visits, negotiations, legal checks and final paperwork - so your home buying journey is smooth and stress-free." },
            ],
          },
        ],
      },
      {
        question: "Who else has bought homes via Guided Home Buying?",
        blocks: [
          { kind: "p", text: "At Propsoch, we’ve had the privilege of guiding over 500 smart buyers through our Guided Home Buying Service, with 200+ just in the last year. We’ve worked with VPs, Technical Architects, Senior Product Managers, Marketing Directors - people who value real, data-backed insights before making a big decision." },
          { kind: "p", text: "Whether it’s a first-time buyer taking that big step, a family upgrading to their dream home, an investor looking for the right opportunity or an NRI wanting a purchase back home - we’ve helped them all find the right place, at the right price with zero guesswork." },
        ],
      },
      {
        question: "What if I am not satisfied with the service?",
        blocks: [
          { kind: "p", text: "We understand that finding the right home is about trust, time and real effort. That’s exactly what we put in to make sure you get the best options based on your needs." },
          { kind: "p", text: "That said, if you ever feel that our service hasn’t lived up to your expectations and we haven't been able to find suitable properties, we’ll take another look to refine our search and send you a fresh list that better matches your needs." },
          { kind: "p", text: "If you're still not satisfied within the service validity period, just let your advisor know and we’ll process a full refund within 15 working days. However, please note that this will not be applicable post conducting site visits with or without our team." },
          { kind: "p", text: "Your time and money are valuable and we want you to feel confident that you're in safe hands with us." },
        ],
      },
      {
        question: "What can you not help me with?",
        blocks: [
          { kind: "p", text: "In our Guided Home Buying Service, there are a few areas we do not cover:" },
          {
            kind: "list",
            ordered: true,
            items: [
              { lead: null, text: "We only work with RERA-approved properties, so independent buildings or non-RERA properties are not part of our services." },
              { lead: null, text: "We do not support resale properties, independent buildings or commercial properties." },
            ],
          },
        ],
      },
      {
        question: "Who should NOT consider signing up for Guided Home Buying?",
        blocks: [
          {
            kind: "list",
            ordered: true,
            items: [
              { lead: null, text: "If you’ve already found your ideal property and are just finalizing the deal, you would not need the ongoing support we provide in Guided Home Buying Service." },
              { lead: null, text: "If you're not ready to buy and are simply exploring the market out of curiosity, you might not need the full support our service offers. You can consider searching & researching properties on our website." },
              { lead: null, text: "If you're not yet committed to purchasing and want to delay the process, we’d recommend holding off on signing up as our service will not be necessary just yet. We’re happy to support you when you're all set to begin." },
            ],
          },
        ],
      },
    ],
  },
];
