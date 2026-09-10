# Propsoch Landing Page Rebuild

I rebuilt the Propsoch real-estate advisory landing page using Next.js, TypeScript and Tailwind CSS.

I kept the Propsoch brand, content and personality in place, and focused on making the experience faster, clearer, more accessible and more usable on every screen size.

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

I approached this assignment in four parts:

### Analysis

I reviewed the original Propsoch page across performance, accessibility, best practices and SEO. I document the key UX, UI, responsive and loading findings in this README, with the full measurements and methodology in [ANALYSIS.md](ANALYSIS.md).

### Build

I rebuilt the landing page with a redesigned hero, responsive desktop and mobile layouts, optimized WebP media, accessible interactions and two additional sections based on the original experience. I built the implementation using Next.js, TypeScript and Tailwind CSS.

### Short README

This document explains what I changed, why I made each change, how the page is structured, and how I verified the final build.

### Submission Readiness

- I include the analysis in the repository documentation.
- I make the improved landing page available through the local production build.
- I cover responsive behaviour across mobile, tablet and desktop widths.
- I include performance, accessibility and code quality checks in the project scripts.

## 1. Performance

I benchmarked the original page against the rebuild across Lighthouse performance, accessibility, best practices and SEO, along with key metrics such as LCP, TBT, main-thread work and JavaScript bootup time. I document the full comparison, measurements and tradeoffs in [ANALYSIS.md](ANALYSIS.md).

To improve performance, I:

- Rendered the important page content with Server Components.
- Kept interactive behaviour inside small client components.
- Made the hero available in the initial HTML.
- Replaced JavaScript animation work with CSS where possible.
- Hid the decorative route artwork on mobile.
- Deferred below-the-fold images and video loading.
- Used poster facades instead of loading video iframes immediately.
- Added explicit media dimensions to protect CLS.
- Used responsive WebP assets and a self-hosted font.
- Removed unnecessary initial third-party requests.

## 2. Issues Found and Fixed

### Performance

| Issue | Fixed |
| --- | --- |
| The hero content waited on client-side JS before it showed up. | I moved it to Server Components so it's in the initial HTML. |
| Too much stuff was hydrating on the client for no reason. | I kept only the interactive bits as client components and cut the duplicate mobile/desktop markup. |
| Videos and images were loading upfront, even off-screen ones. | I added poster facades for the testimonial videos, lazy-loaded below-the-fold media, hid the hero art on mobile, and switched to responsive WebP. |
| Extra font weights, a heavy favicon and missing image dimensions were adding weight and layout shift risk. | I trimmed the font to one file, swapped in a lightweight SVG favicon, and added proper dimensions to media. |

### UX and Hierarchy

| Issue | Fixed |
| --- | --- |
| The hero pushed the CTA before explaining what the service actually does. | I reordered it to headline -> value proposition -> CTA -> stats. |
| The 25-day process was stuck in a small inner-scroll box, easy to miss steps. | I turned it into a normal timeline that flows with the page, with a CSS scroll-driven progress line. |
| The testimonial videos were mismatched with the wrong names and quotes. | I corrected the mappings and swapped the heavy embeds for click-to-load previews. |
| Press mentions weren't easy to find. | I added a proper "Featured in" section with named logos and links. |
| The footer was basically empty and left dead space on mobile. | I rebuilt it with locations, partner builders, navigation, social links and legal info. |

### Accessibility and Visual Quality

| Issue | Fixed |
| --- | --- |
| Some interactive states didn't have enough contrast, and touch targets were too small. | I separated the contrast tokens by purpose, used a stronger accessible orange for focus states, and built controls around a 44px minimum. |
| Tabs and accordions weren't wired up properly for screen readers, and SVGs had no clear accessibility treatment. | I added stable `aria-controls` relationships and marked decorative vs. meaningful SVGs explicitly. |
| Motion had no reduced-motion handling, and typography/spacing felt inconsistent across sections. | I added reduced-motion support everywhere and unified the type scale, weights and spacing. |

## 3. Sections Added

I added two new sections to the original experience.

### How We Read a Plan

A practical guide to the checks that matter in a floor plan, covering layout, movement, light, services and possible issues. It gives visitors useful advisory context before they make a decision.

### Advisors and Team

An introduction to the people behind the service, their roles, experience and the guidance they provide. This adds visible human expertise and makes the advisory model easier to understand.

## 4. What I Redesigned

I improved hierarchy, loading, interactions and responsiveness across the page while keeping the original content.

### Hero

- Reordered: headline -> value proposition -> CTA -> stats.
- Kept the original copy, rebuilt spacing and layout.
- CSS typewriter headline; main text loads instantly.
- Road-and-car SVG animation to the Propsoch logo and house.

### Navigation

- Kept Propsoch's nav structure, made it keyboard-friendly on mobile and desktop.

### Testimonials

- Poster-first videos, load only on click.
- Fixed wrong name/video/quote mappings.

### Featured In

- Real logo links instead of an auto-scrolling carousel.

### 25-Day Process

- Normal scrolling timeline instead of an inner-scroll box.
- CSS scroll-driven progress line, with a static fallback.

### Accessibility

- One `h1`, proper heading order, semantic HTML.
- Full keyboard support for tabs, accordions, sliders, dialogs.
- Visible focus states, 44px touch targets. 
- Correct `aria-controls`, accessible names, reduced-motion support.
- No dead `href="#"` links.

### Visual System

- Tailwind CSS 4, CSS-first tokens in `app/globals.css`.
- Consistent orange scale for fills, text, and focus states.
- Shared typography (Plus Jakarta Sans) and heading sizes.
- Contrast checker script to catch bad colour pairs.

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

I checked the rebuild for:

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

I document the full performance evidence and measurement notes in [ANALYSIS.md](ANALYSIS.md).
