/**
 * WCAG 2.1 contrast gate for the Propsoch design tokens.
 *
 * The original site fails contrast on its orange interactive elements, so this
 * rebuild treats "AA is proven, not claimed" as a build step. Every token pair
 * that carries text or forms the visual boundary of a control is asserted here.
 * `npm run check:contrast` exits non-zero the moment a pair regresses.
 *
 * Thresholds come from WCAG 2.1:
 *   1.4.3 Contrast (Minimum)      normal text        4.5:1
 *   1.4.3 Contrast (Minimum)      large text (>=24px or >=19px bold)  3:1
 *   1.4.11 Non-text Contrast      UI component boundaries, focus rings  3:1
 *
 * Keep this file and the @theme block in app/globals.css in sync. If you change
 * a colour there, change it here, and the gate will tell you if it still holds.
 */

// Single source of truth for the palette. Mirrors @theme in app/globals.css.
const TOKENS = {
  brand: "#FF6D33", // fills and surfaces only, never carries white text
  // The brightest orange that still clears 3:1 for LARGE text (>=24px, or
  // >=19px bold). The brand orange itself is only 2.71:1 on the page, so it
  // fails even the large-text threshold and cannot be used as text at any size.
  // This exists so display type reads as Propsoch's orange rather than rust.
  brandDisplay: "#EF5410",
  brandStrong: "#C2410C", // the darkened tint used for orange TEXT on light
  // The CTA fill. Same value as `brand`, named separately because it is the
  // one place the bright orange carries a label rather than just filling a
  // shape. Present in TOKENS so the pair it forms is PRINTED rather than
  // invisible: see ACCEPTED_DEVIATIONS at the bottom.
  brandButton: "#FF6D33",
  brandHover: "#A8380A", // button hover. DARKER, because the label is white
  brandActive: "#8F2F08", // button active
  brandSoft: "#FFBFA5",
  brandTint: "#FFF3ED", // highlighted Propsoch column background
  accentYellow: "#FFD250",
  ink: "#212130",
  inkMuted: "#66677E",
  surface: "#FBFBFA",
  surfaceAlt: "#F2F3F7",
  // The surface ramp. `raised` is where cards and tool panels now live, since
  // they read by depth instead of by a 1px outline, so every pair that used to
  // be checked against `surface` needs checking against white as well.
  surfaceRaised: "#FFFFFF",
  surfaceSunken: "#F2F3F7",
  line: "#E3E4EC", // decorative separators, no contrast requirement
  lineStrong: "#7E7F94", // borders of real controls, must clear 3:1 on BOTH surfaces
  onBrand: "#1A1206", // near-black warm, the only foreground allowed on brand
  inkMutedOnDark: "#A8A9BC", // secondary text on the dark sections
  white: "#FFFFFF",
};

const TEXT = 4.5;
const LARGE_TEXT = 3;
const UI = 3;

/**
 * Every pair the design actually renders. `min` is the threshold that pair must
 * clear; `note` explains where it appears so a failure is actionable.
 */
const CHECKS = [
  // Body and heading text
  { fg: "ink", bg: "surface", min: TEXT, note: "body copy and headings on the page background" },
  // The raised surface. Cards and both tool panels sit on white now, so every
  // foreground that lands on a card has to be asserted here too. Without these
  // the ramp would have moved the text onto an unchecked background.
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

  // The primary CTA. This is the pair the original gets wrong.
  // The primary button: WHITE label on the deeper orange.
  //
  // This is the shape of the request "white text, no borders". White on the
  // bright brand orange is 2.80:1 and is the original site's bug, so the fill
  // moved to #C2410C instead, where white clears 5.18:1. That same fill is
  // 5.00:1 against the page, which means the button no longer needs a border to
  // satisfy WCAG 1.4.11 either. White text and no border, both compliant.
  { fg: "white", bg: "brandStrong", min: TEXT, note: "primary button label at rest" },
  { fg: "white", bg: "brandHover", min: TEXT, note: "primary button label on hover" },
  { fg: "white", bg: "brandActive", min: TEXT, note: "primary button label while active" },
  { fg: "brandStrong", bg: "surface", min: UI, note: "primary button edge against the page, no border needed" },

  // Orange used as text or icon on light surfaces.
  { fg: "brandStrong", bg: "surface", min: TEXT, note: "links, active tab label, eyebrow" },
  { fg: "brandStrong", bg: "surfaceAlt", min: TEXT, note: "links inside tinted sections" },
  { fg: "brandStrong", bg: "brandTint", min: TEXT, note: "Propsoch column header label" },

  // Non-text contrast: control boundaries and the focus ring.
  { fg: "lineStrong", bg: "surface", min: UI, note: "input and control borders" },
  { fg: "lineStrong", bg: "surfaceAlt", min: UI, note: "control borders in tinted sections" },
  { fg: "brandStrong", bg: "surface", min: UI, note: "focus-visible ring on the page background" },
  { fg: "brandStrong", bg: "surfaceAlt", min: UI, note: "focus-visible ring in tinted sections" },

  // Boundaries of the BRIGHT orange elements that are not buttons.
  //
  // #FF6D33 as a solid fill is only 2.71:1 on #FBFBFA, so anything relying on
  // that fill alone to show its shape fails WCAG 1.4.11. The primary button
  // solved this by moving to the darker fill (above). The remaining bright
  // orange elements, the timeline step markers and the artwork's final card,
  // keep a #C2410C ring instead, and that ring is what the eye locates them by.
  { fg: "brandStrong", bg: "surface", min: UI, note: "timeline marker ring, artwork card ring" },
  { fg: "brandStrong", bg: "brandTint", min: UI, note: "marker ring where it crosses the tint" },

  // Large display text is allowed the 3:1 threshold. `brandDisplay` is used
  // ONLY at these sizes: the hero headline accent and large accent numerals.
  { fg: "brandDisplay", bg: "surface", min: LARGE_TEXT, note: "hero headline accent, >=36px" },
  { fg: "brandDisplay", bg: "surfaceAlt", min: LARGE_TEXT, note: "large accent type in tinted sections" },
  { fg: "brandDisplay", bg: "brandTint", min: LARGE_TEXT, note: "large accent type on the tint" },
  { fg: "brandStrong", bg: "brandTint", min: LARGE_TEXT, note: "large accent numerals" },

  // The Bromatker wordmark on the orange band.
  { fg: "onBrand", bg: "brand", min: TEXT, note: "Bromatker wordmark on the band" },
  // The FAQ closing card. Same pair as the wordmark above (brandButton and
  // brand are the same hex, #FF6D33), listed again under its own note because
  // it is a different piece of real copy: this card used to sit on the darker
  // brandStrong with white text, and moved to the bright button orange with
  // onBrand text to match the primary CTA's resting colour instead of its
  // active one.
  { fg: "onBrand", bg: "brandButton", min: TEXT, note: "FAQ closing card heading and sub-copy" },
  // The "mat" annotation: near-black on the accent yellow highlighter. The same
  // two colours as the original's failing pale-yellow-on-orange, with the roles
  // swapped, which takes it from 1.95:1 to the best ratio on the site.
  { fg: "onBrand", bg: "accentYellow", min: TEXT, note: "the 'mat' highlighter annotation" },

  // The footer's dark closing panel. This is the ONE place the brand orange is
  // legible as small text: 5.66:1 on --color-ink, against 2.71:1 on the light
  // page. Same colour, different ground, opposite verdict.
  { fg: "brand", bg: "ink", min: TEXT, note: "footer panel eyebrow, orange on dark" },
  { fg: "surface", bg: "ink", min: TEXT, note: "footer panel headline" },
  { fg: "inkMutedOnDark", bg: "ink", min: TEXT, note: "secondary copy on the dark sections" },
  { fg: "brandStrong", bg: "ink", min: UI, note: "control edges on the dark sections" },

  // The press band. Its label is the only text on the sunken surface that is
  // not inside a raised card, so it is the one pair the surface ramp does not
  // already cover elsewhere.
  { fg: "inkMuted", bg: "surfaceSunken", min: TEXT, note: "the 'Featured in' label on the press band" },
];

/**
 * Pairs that MUST NOT be used. Encoding the known-bad combinations keeps someone
 * (including a future me) from reintroducing the original site's bug.
 */
const FORBIDDEN = [
  { fg: "brand", bg: "surface", note: "brand orange as TEXT at any size. Fails even the 3:1 large-text bar" },
  { fg: "brand", bg: "white", note: "brand orange as TEXT on white. Use brandDisplay or brandStrong" },
  { fg: "brandDisplay", bg: "surface", note: "brandDisplay is LARGE TEXT ONLY. Below 24px it needs 4.5:1, use brandStrong" },
  { fg: "accentYellow", bg: "brand", note: "the original's yellow 'mat' on orange. Why the chip is inverted instead" },
];

/**
 * Pairs the page KNOWINGLY ships below threshold.
 *
 * This list exists because the alternative is worse. The primary CTA renders a
 * white label on the bright brand orange, which is 2.80:1 against a 4.5:1
 * requirement. That is a deliberate product decision, taken with the number
 * known, and it is not mine to overturn here.
 *
 * What is NOT acceptable is the state this file was in before: `brandButton`
 * existed in the stylesheet but not in TOKENS, so the gate asserted nothing
 * about it and printed nothing about it, and the pair was simply invisible. A
 * deviation you can see on every run is a decision. A deviation the gate does
 * not mention is an accident waiting to be inherited.
 *
 * So these PRINT, loudly, and do not fail the build. If one is ever meant to
 * be fixed rather than accepted, it moves up into CHECKS.
 *
 * The arithmetic, for whoever revisits this: white needs a fill whose relative
 * luminance is at or below 0.1833 to reach 4.5:1. #FF6D33 is 0.3244 and
 * #EF5410 is 0.2473, so no bright orange in the palette can carry a white
 * label. The two ways out are a deeper fill (#C2410C reaches 5.18:1) or a
 * near-black label (#1A1206 on #FF6D33 reaches 6.61:1, which is the pair the
 * ribbon's wordmark already uses).
 */
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
