import { CALCULATOR } from "./content";

// Indian currency formatting. Pure functions, unit tested in __tests__.
const LAKH = 1_00_000;
const CRORE = 1_00_00_000;

function formatCompact(value: number, maxDecimals = 2): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  }).format(value);
}

export function formatIndianCurrency(rupees: number): string {
  const safe = Number.isFinite(rupees) ? Math.max(0, rupees) : 0;

  if (safe >= CRORE) {
    return `₹${formatCompact(safe / CRORE)} Cr`;
  }

  return `₹${formatCompact(safe / LAKH)} L`;
}

export function describeIndianCurrency(rupees: number): string {
  const safe = Number.isFinite(rupees) ? Math.max(0, rupees) : 0;

  if (safe >= CRORE) {
    return `${formatCompact(safe / CRORE)} crore rupees`;
  }

  return `${formatCompact(safe / LAKH)} lakh rupees`;
}

function snapBudget(rupees: number): number {
  const step = rupees < CRORE ? 5 * LAKH : 25 * LAKH;
  return Math.round(rupees / step) * step;
}

export function positionToBudget(position: number): number {
  const { minBudget, maxBudget } = CALCULATOR;
  const clamped = Math.min(100, Math.max(0, position));

  const ratio = maxBudget / minBudget;
  const raw = minBudget * Math.pow(ratio, clamped / 100);

  const snapped = snapBudget(raw);
  return Math.min(maxBudget, Math.max(minBudget, snapped));
}

export function budgetToPosition(rupees: number): number {
  const { minBudget, maxBudget } = CALCULATOR;
  const clamped = Math.min(maxBudget, Math.max(minBudget, rupees));

  const ratio = maxBudget / minBudget;
  const position = (100 * Math.log(clamped / minBudget)) / Math.log(ratio);

  return Math.min(100, Math.max(0, position));
}

export function estimateSaving(budget: number): number {
  const safe = Number.isFinite(budget) ? Math.max(0, budget) : 0;
  return safe * CALCULATOR.saveRate;
}
