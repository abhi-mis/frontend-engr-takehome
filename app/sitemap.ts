import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

/**
 * Served at /sitemap.xml, generated at build time.
 *
 * One page, so this is short by nature. It exists because Lighthouse's SEO
 * audit and every crawler expect it, and because it is the canonical place to
 * declare the single URL rather than letting a crawler infer it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
