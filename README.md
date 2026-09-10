# Propsoch Landing Page Rebuild

A performance-focused rebuild of the Propsoch real-estate advisory landing page using Next.js, TypeScript and Tailwind CSS.

The aim was simple: keep the Propsoch brand, content and personality, then make the experience faster, clearer, more accessible and more useful on every screen size.

**Live assignment rebuild:** [take-home-abhishek.vercel.app](https://take-home-abhishek.vercel.app/)

## Basic Setup

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

To run the production build locally:

```bash
npm run build
npm start
```

## Assignment Scope

This project follows the assignment in four parts:

### Analysis

The original Propsoch page was reviewed for Lighthouse performance,
accessibility, best practices and SEO. The key UX, UI, responsive and loading
issues are documented in this README, with the detailed performance evidence in
[ANALYSIS.md](ANALYSIS.md).

### Build

The landing page was rebuilt with a redesigned hero, responsive desktop and
mobile layouts, optimized WebP media, accessible interactions and additional
sections based on the original experience. The implementation uses Next.js,
TypeScript and Tailwind CSS.

### Short README

This document explains what was improved, why the changes were needed, how the
page is structured, and how the final build was verified.

### Submission Readiness

- Analysis is included in the repository documentation.
- The improved landing page is available through the local production build.
- Responsive behaviour is covered across mobile, tablet and desktop widths.
- Performance, accessibility and code quality checks are included in the project scripts.

## 1. Performance

The original mobile Lighthouse baseline was:

| Category | Original |
| --- | ---: |
| Performance | **42** |
| Accessibility | **84** |
| Best Practices | **100** |
| SEO | **92** |

The most important performance problems were caused by rendering and JavaScript work, not just by file size. Critical hero content depended on hydration, the page rendered separate mobile and desktop trees, and third-party resources added work before the page became useful.

The rebuild addresses that by:

- Rendering the important page content with Server Components.
- Keeping interactive behaviour inside small client components.
- Making the hero available in the initial HTML.
- Replacing JavaScript animation work with CSS where possible.
- Hiding the decorative route artwork on mobile.
- Deferring below-the-fold images and video loading.
- Using poster facades instead of loading video iframes immediately.
- Adding explicit media dimensions to protect CLS.
- Using responsive WebP assets and a self-hosted font.
- Removing unnecessary initial third-party requests.

The reported rebuild result is:

| Metric | Original | Rebuild |
| --- | ---: | ---: |
| Lighthouse Performance | **42** | **99** |
| Accessibility | 84 | **97** |
| Best Practices | 100 | **100** |
| SEO | 92 | **100** |
| LCP | 6.9s | Approximately 3.2s simulated, lower in focused production runs |
| TBT | 4.6s | **238ms** |
| Main-thread work | 14.0s | Approximately **4.0s** |
| JavaScript bootup | 5.5s | Approximately **1.0s** |
| DOM nodes | 2,029 | Reduced substantially |
| Initial third-party requests | 7 products | **0** |
| CLS | 0 | **0** |

Performance results depend on the device, browser and server conditions. The detailed diagnosis, measurements, tradeoffs and optimisation notes are in [ANALYSIS.md](ANALYSIS.md).

## 2. Issues Found and Fixed

The original page had a strong visual identity, but several parts made the experience slower, harder to understand and less useful on smaller screens. Each issue below is paired with the change made in the rebuild.

### Performance

**Issue:** The hero headline and CTA appeared only after client-side code finished running, which delayed the first meaningful view and pushed LCP to **6.9 seconds**.

**Fixed:** Critical content now renders through Server Components in the initial HTML. The hero lead remains stable while the typewriter effect changes only the decorative phrase treatment.

**Issue:** JavaScript bootup reached about **5.5 seconds**, TBT reached approximately **4.6 seconds**, and main-thread work reached roughly **14 seconds**. Separate mobile and desktop layouts also created about **2,029 DOM nodes**.

**Fixed:** Static content stays server-rendered, interactive behaviour is isolated to small client components, and duplicated responsive markup was removed where one responsive structure could serve both layouts.

**Issue:** The initial load made about **28 script requests**, including third-party scripts and embeds. Large artwork, video and media also loaded before visitors reached the sections that used them.

**Fixed:** Video testimonials use poster facades until play, below-the-fold media is lazy-loaded, the hero artwork is hidden on mobile, assets use responsive WebP files and the measured initial load has zero third-party requests.

**Issue:** Font subsets, the default favicon and media dimensions added avoidable requests, bytes and rendering risk.

**Fixed:** The font path was reduced to one required file, the favicon became a lightweight SVG, generated media includes intrinsic dimensions and layout-sensitive animation avoids shifting content. CLS remains **0**.

### UX and hierarchy

**Issue:** The hero asked visitors to act before explaining the advisory service, while several competing elements fought for attention above the fold.

**Fixed:** The hierarchy now reads **headline -> value proposition -> CTA -> context and stats**, so the visitor understands the service before being asked to continue.

**Issue:** The original 25-day process used an inner scroll area, which hid later steps from the main page flow.

**Fixed:** It is now a normal page-flow timeline using an ordered list. CSS scroll-driven progress shows movement through the process without a scroll listener or client-side scroll work.

**Issue:** All three testimonial stories had video and name mappings that placed the wrong person beside each story. The videos were also presented as heavy embeds rather than lightweight previews.

**Fixed:** Each story now uses its verified video mapping, a correctly labelled poster and a click-to-load dialog. The video provider is loaded only after the visitor chooses to play.

**Issue:** Press and media visibility was not clear enough, so the page did not show where Propsoch had been mentioned.

**Fixed:** A visible Featured in section presents the available press references with named links and optimised logos, making that proof easy to discover without an auto-scrolling media carousel.

**Issue:** The original page had no useful footer and left unnecessary space at the bottom on mobile.

**Fixed:** The redesigned footer closes the page with locations, partner builders, browse-by information, navigation, social links and the available legal details.

### Accessibility and visual quality

**Issue:** Interactive states used orange or alpha colours without enough contrast, and controls needed clearer focus states and larger touch targets.

**Fixed:** Contrast tokens are separated by purpose, focus rings use the stronger accessible orange, controls are built around the 44px target and the contrast script checks active, forbidden and accepted colour combinations.

**Issue:** Tab and accordion relationships lacked stable `aria-controls` targets, while decorative and meaningful SVGs did not always have a clear accessibility treatment.

**Fixed:** Panels stay mounted where relationships need to resolve, UI-only actions use buttons, decorative SVGs are explicitly hidden and meaningful SVGs carry titles or labels.

**Issue:** Motion lacked consistent reduced-motion handling and deliberate timing. Typography, heading weights, borders and section spacing also felt inconsistent.

**Fixed:** Route, typewriter and decorative animation have reduced-motion states, while shared heading styles, surface tokens, restrained shadows and consistent spacing create one visual language across the application.

## 3. Sections Added

These are the two genuinely new sections added to the original experience.

### How We Read a Plan

A practical guide to the checks that matter in a floor plan, including layout,
movement, light, services and possible issues. It gives visitors useful advisory
context before they make a decision instead of asking them to interpret a plan alone.

### Advisors and team

An introduction to the people behind the service, their roles, experience and
the guidance they provide. This adds the human expertise that was missing from
the original page and makes the advisory model easier to understand.

## 4. What I Redesigned

The remaining page areas were not presented as brand-new sections. They were
redesigned because the original hierarchy, loading behaviour, interactions and
responsive layout did not explain Propsoch's value clearly enough. The redesign
keeps the existing purpose and source content while improving how each part is
structured, read and used.

### Redesign goals

- Make the service explanation arrive before the CTA.
- Reduce duplicated markup, hydration work and unnecessary media loading.
- Make comparisons, testimonials and the buying process easier to follow.
- Replace hidden or unclear interactions with accessible page flow and controls.
- Give every section a consistent typographic and visual language.
- Keep the brand personality while making the page calmer and easier to scan.

### Hero

The hero now follows a clearer order:

**headline -> value proposition -> CTA -> context and stats**

The original Propsoch copy remains in place. The redesign comes from hierarchy, spacing, motion and composition. The headline uses a CSS-first typewriter treatment, while the stable lead text remains available immediately for loading performance and accessibility.

The route artwork is built from HTML and inline SVG. The road and car share the same path data, so the car stays on the road instead of approximating a curve with unrelated coordinates. It reaches the Propsoch logo, holds there for 0.6 seconds with the three-dot thinking bubble, and then travels to the house checkpoint.

The thinking bubble is intentionally small and only appears during that logo hold. It uses the same three-dot visual language as the FAQ question bubble, so the interface has one recognisable thinking motif.

### Navigation and page rhythm

The header keeps the real Propsoch navigation structure, with desktop and mobile behaviour that is keyboard accessible. UI-only items are buttons, while actual navigation remains navigation.

The page now uses a consistent section-heading treatment, clearer surface changes and a restrained shadow system. The typography is shared across the application so headings, labels and body copy feel like one product rather than separate sections assembled together.

### Testimonials and video experience

The testimonial section keeps the same customer-story purpose, but the videos
were presented in a new way. Each story now starts as a lightweight poster with
the correct person's name and a clear play action. The video iframe loads only
after the visitor chooses to watch, which keeps the initial page lighter and
prevents three third-party players from competing with the main content.

The source testimonial carousel also had all three stories mapped to the wrong
video names. That mapping was corrected so the poster, quote and video now refer
to the same person.

### Media visibility

The media and press proof was made easier to find through the redesigned
**Featured in** section. The publications are visible as real logo links in the
page flow instead of being hidden behind an auto-scrolling carousel or an unclear
media treatment. This gives the existing media presence a clear place in the
story without adding another continuously running dependency.

### The 25-day process

The original 25-day process used an inner scroll area, so the visitor could miss
later steps without realising more content existed. It was redesigned as a
normal semantic ordered timeline that moves with the page, making the complete
process visible and natural to read.

The progress line is CSS scroll-driven, with a complete static fallback for
browsers without support and for reduced-motion users. This preserves the sense
of progress without adding a scroll listener or another client-side animation.

### Accessibility

- One `h1` and a consistent heading hierarchy.
- Semantic sections, lists, tables, forms and landmarks.
- Keyboard support for tabs, accordions, sliders, dialogs and navigation.
- Focus-visible states and touch targets built around the 44px minimum.
- Stable `aria-controls` relationships for mounted panels.
- Accessible names and value text for sliders and icon controls.
- Explicit treatment for decorative and meaningful SVGs.
- Reduced-motion behaviour for route, typewriter and decorative animation.
- No dead `href="#"` controls.

### Visual system

Tailwind CSS 4 uses CSS-first tokens in `app/globals.css` rather than a JavaScript Tailwind configuration file.

- The bright Propsoch orange is used mainly for fills.
- Stronger orange tokens are used for small text, borders and focus rings.
- Large display text has its own accessible orange treatment.
- Dark sections give the brand orange a stronger, more confident presence.
- Cards use surface depth and restrained shadows instead of heavy outlines.
- Plus Jakarta Sans is loaded as one variable font family.
- Heading sizes, tracking and weights are shared across the application.

The contrast gate checks the active token pairs, forbidden combinations and deliberate accepted deviations. This keeps visual choices visible instead of allowing a low-contrast state to disappear into a utility class.

## Folder Structure

```text
.
├── app/
│   ├── globals.css                 # Tokens, component styling and keyframes
│   ├── layout.tsx                  # Font, metadata, JSON-LD, shell and skip link
│   ├── page.tsx                    # Main page composition and section order
│   ├── icon.svg                    # Lightweight brand favicon
│   ├── opengraph-image.tsx         # Build-time social image
│   ├── robots.ts                   # Robots route
│   └── sitemap.ts                  # Sitemap route
├── components/
│   ├── brand/
│   │   ├── bromatker.tsx           # Brand wordmark treatment
│   │   ├── hero-route-art.tsx       # SVG route, car and checkpoints
│   │   ├── logo.tsx                 # Inline Propsoch logo
│   │   ├── route-progress.tsx       # Client route progress synchronisation
│   │   └── splash.tsx               # CSS-only first-paint splash
│   ├── layout/
│   │   ├── desktop-nav.tsx          # Desktop navigation
│   │   ├── mobile-nav.tsx           # Mobile navigation
│   │   ├── site-footer.tsx          # Footer and legal information
│   │   └── site-header.tsx          # Header shell
│   ├── sections/
│   │   ├── hero.tsx                 # Above-the-fold composition
│   │   ├── comparison.tsx           # Competitor comparison shell
│   │   ├── comparison-tabs.tsx      # Client comparison controls
│   │   ├── testimonials.tsx         # Testimonial section shell
│   │   ├── testimonial-grid.tsx     # Video facades and dialog island
│   │   ├── reality-check.tsx        # Reality-check content
│   │   ├── plan-comparison.tsx      # Accessible image comparison slider
│   │   ├── floor-plan.tsx           # Plan-reading guide
│   │   ├── timeline.tsx             # CSS scroll-driven process timeline
│   │   ├── advisors.tsx             # Advisor and team section
│   │   ├── guided.tsx               # Guided-service CTA
│   │   ├── featured-in.tsx          # Press logos
│   │   ├── faq.tsx                  # FAQ shell
│   │   ├── faq-tabs.tsx             # FAQ client controls
│   │   └── savings-calculator.tsx   # Savings interaction
│   ├── primary-cta.tsx              # Shared primary CTA
│   ├── section-heading.tsx          # Shared section heading treatment
│   ├── tab-strip.ts                 # Shared tab styling
│   ├── icons.tsx                    # Tree-shaken react-icons exports
│   └── ui/                          # shadcn/Radix primitives
├── lib/
│   ├── content.ts                   # Typed page copy and content data
│   ├── currency.ts                  # Indian currency and calculator maths
│   ├── faq.ts                       # Structured FAQ content
│   ├── nav.ts                       # Navigation data
│   ├── pincodes.ts                  # Service-area data retained for reuse
│   ├── *generated.ts                # Generated logo, poster, press and plan manifests
│   ├── utils.ts                     # Shared utility helpers
│   └── __tests__/                   # Vitest unit tests
├── public/
│   ├── logos/                       # Partner and employer logos
│   ├── plan/                        # Responsive plan-comparison media
│   ├── posters/                     # Testimonial poster images
│   └── press/                       # Featured-in logos
├── scripts/
│   ├── check-contrast.mjs           # Contrast and accepted-deviation gate
│   ├── fetch-*.mjs                  # Media generation and manifest scripts
│   └── verify-pincodes.mjs          # India Post data verification
├── ANALYSIS.md                      # Performance analysis and optimisation notes
├── components.json                  # shadcn configuration
├── eslint.config.mjs                # ESLint configuration
├── next.config.ts                   # Next.js configuration
├── package.json                     # Scripts and dependencies
├── postcss.config.mjs               # Tailwind/PostCSS configuration
└── tsconfig.json                    # TypeScript configuration
```

## Verification

The main verification command is:

```bash
npm run verify
```

The rebuild has been checked for:

- TypeScript compilation
- Contrast regressions
- Unit tests
- Production build output
- Responsive layouts at 360, 390, 768, 1024 and 1280px
- Keyboard, focus, navigation, tab, accordion and slider behaviour
- Zero horizontal overflow
- One `h1` and one page header
- Zero console errors and warnings during production review
- CLS remaining at **0** through the hero animation cycle

The full performance evidence and measurement notes are in [ANALYSIS.md](ANALYSIS.md).
