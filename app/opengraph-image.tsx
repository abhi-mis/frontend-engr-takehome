import { ImageResponse } from "next/og";
import { HERO, SITE } from "@/lib/content";

// OG image rendered at build time by next/og, so it costs no client JavaScript.
// Colours are literals because next/og cannot read CSS custom properties.
export const alt = `${SITE.name}: independent home buying advice`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
