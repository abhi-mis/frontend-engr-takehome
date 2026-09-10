import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

// Single-page sitemap. Same base URL as robots.ts.
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
