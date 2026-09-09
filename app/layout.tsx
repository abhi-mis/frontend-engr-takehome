import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Splash } from "@/components/brand/splash";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FOOTER, SITE } from "@/lib/content";

/**
 * One font family for the whole site.
 *
 * A display face plus a body face is the conventional pairing and would look
 * richer, but it doubles font bytes on the critical path. The h1 is our LCP
 * element, so exactly one font file sits in front of it and the visual
 * distinction comes from the scale and weight jumps instead.
 *
 * next/font downloads and self-hosts the file at build time, so there is no
 * request to fonts.googleapis.com at runtime, and it generates a size-adjusted
 * local fallback automatically. That fallback is what keeps `display: "swap"`
 * from shifting layout when the real font arrives, which is how CLS stays at 0.
 */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

/**
 * Structured data, rendered on the server as a plain script tag. This is not a
 * client script, it never executes, so it costs nothing on the main thread and
 * still gives search engines the entity, the areas served and the real
 * registrations.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE.name,
  legalName: SITE.legalEntity,
  description: SITE.description,
  url: SITE.url,
  areaServed: FOOTER.cities.map((city) => ({
    "@type": "City",
    name: city,
  })),
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
    addressRegion: "Karnataka",
    addressLocality: "Bangalore",
  },
  identifier: FOOTER.rera.map((entry) => ({
    "@type": "PropertyValue",
    name: entry.state,
    value: entry.number,
  })),
};

// Typed explicitly rather than via Next's generated `LayoutProps` global, so
// `npm run typecheck` works standalone without needing a build to have run first.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={SITE.locale} className={`${jakarta.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        {/* First focusable element on the page, so keyboard users can jump the
            header instead of tabbing through it on every visit. */}
        <a
          href="#main"
          className="sr-only rounded-md focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-brand focus:shadow-lg"
        >
          Skip to main content
        </a>

        {/* The loading splash. A Server Component that removes itself with a
            CSS animation, so it needs no JavaScript and cannot outlast its own
            timeline waiting for hydration. See components/brand/splash.tsx. */}
        <Splash />

        <SiteHeader />
        {children}
        <SiteFooter />

        <script
          type="application/ld+json"
          // Server rendered constant, no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
