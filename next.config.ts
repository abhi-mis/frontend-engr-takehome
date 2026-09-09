import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 writes AGENTS.md and CLAUDE.md into the project root on dev start.
  // This repo documents itself through README.md and Implementation.md, so the
  // generated files are noise in the deliverable.
  agentRules: false,

  // No third-party tag stack ships on this page, by design. The baseline's
  // 4.6s TBT is mostly GTM, GA4, Google Ads, Facebook Pixel, Facebook CAPI,
  // Clarity and Sentry executing on the main thread. If analytics is ever
  // needed, add it as a next/script with strategy="lazyOnload" so it cannot
  // block interaction. See README.md for the snippet.
};

export default nextConfig;
