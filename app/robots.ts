import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

/**
 * Served at /robots.txt, generated at build time.
 *
 * A route file rather than a static public/robots.txt so the sitemap URL stays
 * derived from the same SITE constant the metadata uses. Two places holding the
 * same origin is how a deploy ends up advertising a sitemap on the wrong domain.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
