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

I reviewed the original Propsoch page across performance, accessibility, best practices and SEO.

The performance measurements, Web Vitals and optimisation details are documented in [ANALYSIS.md](ANALYSIS.md).

The UX, UI, responsive and accessibility improvements are documented in [IMPROVEMENTS.md](IMPROVEMENTS.md).

### Build

I rebuilt the landing page with a redesigned hero, responsive desktop and mobile layouts, optimized WebP media, accessible interactions and two additional sections based on the original experience. I built the implementation using Next.js, TypeScript and Tailwind CSS.

### Documentation

This repository separates the work into three documents:

- [README.md](README.md): Basic project and assignment details.
- [ANALYSIS.md](ANALYSIS.md): Web Vitals, Lighthouse results, performance issues and how they were fixed.
- [IMPROVEMENTS.md](IMPROVEMENTS.md): UX, UI, accessibility and design improvements, including what changed and why.

### Submission Readiness

- I include the analysis in the repository documentation.
- I make the improved landing page available through the local production build.
- I cover responsive behaviour across mobile, tablet and desktop widths.
- I include performance, accessibility and code quality checks in the project scripts.

## Performance Summary

The final mobile Lighthouse result is:

| Metric | Original | Rebuild |
| --- | ---: | ---: |
| Performance | **42** | **99** |
| Accessibility | 84 | **97** |
| Best Practices | 100 | **100** |
| SEO | 92 | **100** |

Full Web Vitals and performance measurements are available in [ANALYSIS.md](ANALYSIS.md).

## Folder Structure

```text
.
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── icon.svg
│   ├── opengraph-image.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── brand/
│   ├── layout/
│   ├── sections/
│   ├── primary-cta.tsx
│   ├── section-heading.tsx
│   ├── tab-strip.ts
│   ├── icons.tsx
│   └── ui/
├── lib/
│   ├── content.ts
│   ├── currency.ts
│   ├── faq.ts
│   ├── nav.ts
│   ├── pincodes.ts
│   ├── *generated.ts
│   ├── utils.ts
│   └── __tests__/
├── public/
│   ├── logos/
│   ├── plan/
│   ├── posters/
│   └── press/
├── scripts/
│   ├── check-contrast.mjs
│   ├── fetch-*.mjs
│   └── verify-pincodes.mjs
├── README.md
├── ANALYSIS.md
├── IMPROVEMENTS.md
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```
