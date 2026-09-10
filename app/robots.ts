import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

// robots.txt, generated so the sitemap URL follows NEXT_PUBLIC_SITE_URL.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
