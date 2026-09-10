// WCAG contrast gate. Exits non-zero if any rendered colour pair regresses.
// Keep TOKENS in sync with the @theme block in app/globals.css.
const TOKENS = {
  brand: "#FF6D33",
  brandDisplay: "#EF5410",
  brandStrong: "#C2410C",
  brandButton: "#FF6D33",
  brandHover: "#A8380A",
  brandActive: "#8F2F08",
  brandSoft: "#FFBFA5",
  brandTint: "#FFF3ED",
  accentYellow: "#FFD250",
  ink: "#212130",
  inkMuted: "#66677E",
  surface: "#FBFBFA",
  surfaceAlt: "#F2F3F7",
  surfaceRaised: "#FFFFFF",
  surfaceSunken: "#F2F3F7",
  line: "#E3E4EC",
  lineStrong: "#7E7F94",
  onBrand: "#1A1206",
  inkMutedOnDark: "#A8A9BC",
  white: "#FFFFFF",
};

const TEXT = 4.5;
const LARGE_TEXT = 3;
const UI = 3;

const CHECKS = [
  { fg: "ink", bg: "surface", min: TEXT, note: "body copy and headings on the page background" },
  { fg: "ink", bg: "surfaceRaised", min: TEXT, note: "card and tool panel copy" },
  { fg: "inkMuted", bg: "surfaceRaised", min: TEXT, note: "secondary copy on cards, inactive tab labels" },
  { fg: "brandStrong", bg: "surfaceRaised", min: TEXT, note: "orange labels and links on cards" },
  { fg: "brandStrong", bg: "surfaceRaised", min: UI, note: "focus ring and control edges on cards" },
  { fg: "lineStrong", bg: "surfaceRaised", min: UI, note: "the pincode input border, now on a white panel" },
  { fg: "ink", bg: "surfaceAlt", min: TEXT, note: "body copy on the alternate section background" },
  { fg: "ink", bg: "brandTint", min: TEXT, note: "Propsoch column cells" },
  { fg: "inkMuted", bg: "surface", min: TEXT, note: "secondary copy, stat labels, disclosures" },
  { fg: "inkMuted", bg: "surfaceAlt", min: TEXT, note: "secondary copy in tinted sections" },
  { fg: "inkMuted", bg: "brandTint", min: TEXT, note: "secondary copy in the Propsoch column" },
  { fg: "white", bg: "brandStrong", min: TEXT, note: "primary button label at rest" },
  { fg: "white", bg: "brandHover", min: TEXT, note: "primary button label on hover" },
  { fg: "white", bg: "brandActive", min: TEXT, note: "primary button label while active" },
  { fg: "brandStrong", bg: "surface", min: UI, note: "primary button edge against the page, no border needed" },
  { fg: "brandStrong", bg: "surface", min: TEXT, note: "links, active tab label, eyebrow" },
  { fg: "brandStrong", bg: "surfaceAlt", min: TEXT, note: "links inside tinted sections" },
  { fg: "brandStrong", bg: "brandTint", min: TEXT, note: "Propsoch column header label" },
  { fg: "lineStrong", bg: "surface", min: UI, note: "input and control borders" },
  { fg: "lineStrong", bg: "surfaceAlt", min: UI, note: "control borders in tinted sections" },
  { fg: "brandStrong", bg: "surface", min: UI, note: "focus-visible ring on the page background" },
  { fg: "brandStrong", bg: "surfaceAlt", min: UI, note: "focus-visible ring in tinted sections" },
  { fg: "brandStrong", bg: "surface", min: UI, note: "timeline marker ring, artwork card ring" },
  { fg: "brandStrong", bg: "brandTint", min: UI, note: "marker ring where it crosses the tint" },
  { fg: "brandDisplay", bg: "surface", min: LARGE_TEXT, note: "hero headline accent, >=36px" },
  { fg: "brandDisplay", bg: "surfaceAlt", min: LARGE_TEXT, note: "large accent type in tinted sections" },
  { fg: "brandDisplay", bg: "brandTint", min: LARGE_TEXT, note: "large accent type on the tint" },
  { fg: "brandStrong", bg: "brandTint", min: LARGE_TEXT, note: "large accent numerals" },
  { fg: "onBrand", bg: "brand", min: TEXT, note: "Bromatker wordmark on the band" },
  { fg: "onBrand", bg: "brandButton", min: TEXT, note: "FAQ closing card heading and sub-copy" },
  { fg: "onBrand", bg: "accentYellow", min: TEXT, note: "the 'mat' highlighter annotation" },
  { fg: "brand", bg: "ink", min: TEXT, note: "footer panel eyebrow, orange on dark" },
  { fg: "surface", bg: "ink", min: TEXT, note: "footer panel headline" },
  { fg: "inkMutedOnDark", bg: "ink", min: TEXT, note: "secondary copy on the dark sections" },
  { fg: "brandStrong", bg: "ink", min: UI, note: "control edges on the dark sections" },
  { fg: "inkMuted", bg: "surfaceSunken", min: TEXT, note: "the 'Featured in' label on the press band" },
];

const FORBIDDEN = [
  { fg: "brand", bg: "surface", note: "brand orange as TEXT at any size. Fails even the 3:1 large-text bar" },
  { fg: "brand", bg: "white", note: "brand orange as TEXT on white. Use brandDisplay or brandStrong" },
  { fg: "brandDisplay", bg: "surface", note: "brandDisplay is LARGE TEXT ONLY. Below 24px it needs 4.5:1, use brandStrong" },
  { fg: "accentYellow", bg: "brand", note: "the original's yellow 'mat' on orange. Why the chip is inverted instead" },
];

const ACCEPTED_DEVIATIONS = [
  {
    fg: "white",
    bg: "brandButton",
    min: TEXT,
    note: "primary CTA label. Accepted by product decision, see the note above",
  },
  {
    fg: "white",
    bg: "brandButton",
    min: UI,
    note:
      "FAQ closing card: the white button's own edge against the card fill. " +
      "It was 5.18:1 against the darker brandStrong fill the card used to sit " +
      "on; moving the card to brandButton (see the TEXT check above) softens " +
      "that boundary to the same 2.80:1 as the pair above it. The button's own " +
      "shadow-lg carries the boundary instead of the fill here.",
  },
];

function srgbToLinear(channel) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`Not a 6 digit hex colour: ${hex}`);
  const int = parseInt(m[1], 16);
  const r = srgbToLinear((int >> 16) & 0xff);
  const g = srgbToLinear((int >> 8) & 0xff);
  const b = srgbToLinear(int & 0xff);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hexA, hexB) {
  const a = relativeLuminance(hexA);
  const b = relativeLuminance(hexB);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function resolve(name) {
  const value = TOKENS[name];
  if (!value) throw new Error(`Unknown token: ${name}`);
  return value;
}

const GREEN = "[32m";
const RED = "[31m";
const DIM = "[2m";
const RESET = "[0m";

let failures = 0;

console.log("\nWCAG contrast gate: required pairs\n");
console.log(
  `  ${"foreground".padEnd(14)}${"background".padEnd(14)}${"ratio".padStart(7)}  ${"min".padStart(4)}  result`
);
console.log(`  ${"-".repeat(60)}`);

for (const check of CHECKS) {
  const ratio = contrastRatio(resolve(check.fg), resolve(check.bg));
  const pass = ratio >= check.min;
  if (!pass) failures += 1;
  const mark = pass ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
  console.log(
    `  ${check.fg.padEnd(14)}${check.bg.padEnd(14)}${ratio.toFixed(2).padStart(7)}  ${String(
      check.min
    ).padStart(4)}  ${mark}`
  );
  if (!pass) {
    console.log(`  ${RED}      ^ ${check.note}${RESET}`);
  } else {
    console.log(`  ${DIM}      ${check.note}${RESET}`);
  }
}

console.log("");
console.log("Accepted deviations: shipped below threshold, on purpose, and printed so");
console.log("");
for (const dev of ACCEPTED_DEVIATIONS) {
  const ratio = contrastRatio(resolve(dev.fg), resolve(dev.bg));
  const verdict =
    ratio < dev.min ? RED + "BELOW " + dev.min + RESET : GREEN + "now clears" + RESET;
  console.log(
    "  " +
      dev.fg.padEnd(14) +
      dev.bg.padEnd(14) +
      ratio.toFixed(2).padStart(7) +
      "  " +
      verdict
  );
  console.log("  " + DIM + "      " + dev.note + RESET);
}
console.log("");
console.log("Forbidden pairs: these must stay below the AA threshold or be unused");
console.log("");
for (const bad of FORBIDDEN) {
  const ratio = contrastRatio(resolve(bad.fg), resolve(bad.bg));
  console.log(`  ${bad.fg.padEnd(14)}${bad.bg.padEnd(14)}${ratio.toFixed(2).padStart(7)}  ${DIM}${bad.note}${RESET}`);
}

if (failures > 0) {
  console.log(`\n${RED}Contrast gate failed: ${failures} pair(s) below threshold.${RESET}\n`);
  process.exit(1);
}

console.log(`\n${GREEN}Contrast gate passed: ${CHECKS.length} pairs all clear their threshold.${RESET}\n`);
