import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Splash } from "@/components/brand/splash";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FOOTER, SITE } from "@/lib/content";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Root layout: self-hosted font, metadata, JSON-LD and the skip link.
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={SITE.locale} className={`${jakarta.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <a
          href="#main"
          className="sr-only rounded-md focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-brand focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Splash />

        <SiteHeader />
        {children}
        <SiteFooter />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
