import { ImageResponse } from "next/og";
import { HERO, SITE } from "@/lib/content";

/**
 * The Open Graph card, rendered at BUILD time by next/og.
 *
 * Worth being explicit about why this is free: `next/og` runs Satori on the
 * server during the build and emits a PNG. Nothing here ships to the browser,
 * so a share image costs zero client bytes and zero main-thread work. The
 * alternative, hand-exporting a PNG in a design tool, is the same bytes for the
 * crawler but drifts from the site's copy and palette the moment either changes.
 * This reads the real content and the real hex values.
 */

export const alt = `${SITE.name}: independent home buying advice`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The tokens are repeated as literals because Satori resolves no CSS custom
// properties: it has no cascade and no stylesheet, only inline styles.
const BRAND = "#FF6D33";
const BRAND_STRONG = "#C2410C";
const INK = "#212130";
const INK_MUTED = "#66677E";
const SURFACE = "#FBFBFA";
const ON_BRAND = "#1A1206";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: SURFACE,
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark, with the house glyph drawn as plain divs. Satori supports
            a useful subset of flexbox but no SVG paths, so the mark is
            simplified to a rounded brand square rather than the full logo. */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: BRAND,
              border: `3px solid ${BRAND_STRONG}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: ON_BRAND,
              fontSize: "30px",
              fontWeight: 800,
            }}
          >
            P
          </div>
          <div style={{ fontSize: "38px", fontWeight: 800, color: INK }}>
            Propsoch
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 800,
              color: INK,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {HERO.headlineLead}{" "}
            <span style={{ color: BRAND_STRONG, marginLeft: "16px" }}>
              {HERO.headlineAccent}
            </span>
          </div>

          <div
            style={{
              marginTop: "26px",
              fontSize: "30px",
              color: INK_MUTED,
              lineHeight: 1.4,
              maxWidth: "900px",
            }}
          >
            {HERO.valueProp}
          </div>
        </div>

        {/* The real numbers. */}
        <div style={{ display: "flex", gap: "56px" }}>
          {[
            ["700+", "Projects in Bangalore"],
            ["2,500+", "Homebuyers"],
            ["8500+", "Hours of advice"],
          ].map(([value, label]) => (
            <div
              key={label}
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <div style={{ fontSize: "40px", fontWeight: 800, color: INK }}>
                {value}
              </div>
              <div style={{ fontSize: "22px", color: INK_MUTED }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
