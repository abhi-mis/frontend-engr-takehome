import { CALCULATOR } from "./content";

/**
 * Indian currency formatting and the slider's budget mapping.
 *
 * Pure functions, no React, no DOM. They live here rather than inside the
 * calculator component for two reasons: they are the only place in this build
 * where a silent wrong answer is plausible (a formatting bug shows a confident
 * incorrect number rather than crashing), and being pure they are cheap to unit
 * test. See lib/__tests__/currency.test.ts.
 */

const LAKH = 1_00_000;
const CRORE = 1_00_00_000;

/**
 * Formats a number to at most `maxDecimals` places, stripping trailing zeros,
 * with Indian digit grouping on the integer part.
 *
 * `en-IN` grouping matters: 1234567 groups as 12,34,567 in India, not 1,234,567.
 * Intl handles that correctly and hand-rolled grouping usually does not.
 */
function formatCompact(value: number, maxDecimals = 2): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  }).format(value);
}

/**
 * Renders rupees in the lakh and crore scale Indian buyers actually use.
 *
 *   50_00_000    -> "Rs 50 L"
 *   4_78_000     -> "Rs 4.78 L"
 *   1_20_00_000  -> "Rs 1.2 Cr"
 *   25_00_00_000 -> "Rs 25 Cr"
 *
 * (The real rupee glyph is used in the output. It is spelled out here only to
 * keep this comment plain ASCII.)
 *
 * Deliberately NOT using Intl's `notation: "compact"` with currency INR: that
 * produces "T" for thousand and "1.2Cr" style output inconsistently across
 * engines and ICU versions, and gets lakh wrong on several. Doing the scale
 * division ourselves and using Intl only for digit grouping is predictable.
 */
export function formatIndianCurrency(rupees: number): string {
  const safe = Number.isFinite(rupees) ? Math.max(0, rupees) : 0;

  if (safe >= CRORE) {
    return `₹${formatCompact(safe / CRORE)} Cr`;
  }

  return `₹${formatCompact(safe / LAKH)} L`;
}

/**
 * A spoken form for screen readers.
 *
 * A Radix Slider announces `aria-valuenow`, which here would be a slider
 * position like "62". That is meaningless to a listener. This supplies
 * `aria-valuetext` instead, so the thumb announces "1.2 crore rupees".
 */
export function describeIndianCurrency(rupees: number): string {
  const safe = Number.isFinite(rupees) ? Math.max(0, rupees) : 0;

  if (safe >= CRORE) {
    return `${formatCompact(safe / CRORE)} crore rupees`;
  }

  return `${formatCompact(safe / LAKH)} lakh rupees`;
}

/**
 * Snaps a budget to an increment a buyer would actually say out loud.
 *
 * Below a crore, budgets move in 5 lakh steps. Above it, 25 lakh steps. Without
 * this the log mapping produces numbers like 1,03,47,281, which reads as a
 * calculation rather than a budget.
 */
function snapBudget(rupees: number): number {
  const step = rupees < CRORE ? 5 * LAKH : 25 * LAKH;
  return Math.round(rupees / step) * step;
}

/**
 * Slider position (0 to 100) to a budget in rupees, on a LOGARITHMIC scale.
 *
 * Why logarithmic. The range is 50 Lakh to 25 Crore, a 50x span. Mapped
 * linearly, the midpoint of the track lands at about 12.75 Crore, and every
 * budget under 2.5 Crore, which is where most buyers actually are, is crammed
 * into the first 8% of the track. One pixel of thumb movement would jump the
 * budget by roughly 25 Lakh.
 *
 * A logarithmic scale gives each *doubling* of budget equal track distance, so
 * the control has fine resolution at the low end and coarse resolution at the
 * top, which matches how the precision people need actually scales.
 */
export function positionToBudget(position: number): number {
  const { minBudget, maxBudget } = CALCULATOR;
  const clamped = Math.min(100, Math.max(0, position));

  const ratio = maxBudget / minBudget;
  const raw = minBudget * Math.pow(ratio, clamped / 100);

  const snapped = snapBudget(raw);
  return Math.min(maxBudget, Math.max(minBudget, snapped));
}

/**
 * The inverse: a budget in rupees back to a slider position (0 to 100).
 *
 * Needed so the component can be driven from a budget value rather than having
 * to store the raw position, and so the mapping is verifiably reversible.
 */
export function budgetToPosition(rupees: number): number {
  const { minBudget, maxBudget } = CALCULATOR;
  const clamped = Math.min(maxBudget, Math.max(minBudget, rupees));

  const ratio = maxBudget / minBudget;
  const position = (100 * Math.log(clamped / minBudget)) / Math.log(ratio);

  return Math.min(100, Math.max(0, position));
}

/**
 * The headline number: Propsoch's average save rate applied to a budget.
 *
 * The rate is a single constant in lib/content.ts, alongside the note that the
 * published average saving of about Rs 4.78 L divided by 4.8% implies an average
 * ticket near Rs 1 Crore, so the rate is consistent with the real published
 * figure rather than being an arbitrary number.
 */
export function estimateSaving(budget: number): number {
  const safe = Number.isFinite(budget) ? Math.max(0, budget) : 0;
  return safe * CALCULATOR.saveRate;
}
