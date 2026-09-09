import { describe, expect, it } from "vitest";
import {
  budgetToPosition,
  describeIndianCurrency,
  estimateSaving,
  formatIndianCurrency,
  positionToBudget,
} from "../currency";
import { CALCULATOR } from "../content";

const LAKH = 1_00_000;
const CRORE = 1_00_00_000;

describe("formatIndianCurrency", () => {
  it("renders whole lakh values without decimals", () => {
    expect(formatIndianCurrency(50 * LAKH)).toBe("₹50 L");
  });

  it("renders fractional lakh values to two decimals", () => {
    // The real published average saving.
    expect(formatIndianCurrency(4_78_000)).toBe("₹4.78 L");
  });

  it("switches to crore exactly at one crore, not before", () => {
    expect(formatIndianCurrency(CRORE - 1)).toContain("L");
    expect(formatIndianCurrency(CRORE)).toBe("₹1 Cr");
  });

  it("renders fractional crore values", () => {
    expect(formatIndianCurrency(1_20_00_000)).toBe("₹1.2 Cr");
    expect(formatIndianCurrency(25 * CRORE)).toBe("₹25 Cr");
  });

  it("strips trailing zeros rather than padding to two decimals", () => {
    expect(formatIndianCurrency(2 * CRORE)).toBe("₹2 Cr");
  });

  it("never renders a negative or non-finite amount", () => {
    expect(formatIndianCurrency(-500)).toBe("₹0 L");
    expect(formatIndianCurrency(Number.NaN)).toBe("₹0 L");
    expect(formatIndianCurrency(Number.POSITIVE_INFINITY)).toBe("₹0 L");
  });
});

describe("describeIndianCurrency", () => {
  it("spells the scale out for screen readers", () => {
    expect(describeIndianCurrency(1_20_00_000)).toBe("1.2 crore rupees");
    expect(describeIndianCurrency(50 * LAKH)).toBe("50 lakh rupees");
  });
});

describe("positionToBudget", () => {
  it("maps the track ends to the configured range", () => {
    expect(positionToBudget(0)).toBe(CALCULATOR.minBudget);
    expect(positionToBudget(100)).toBe(CALCULATOR.maxBudget);
  });

  it("clamps out-of-range positions instead of extrapolating", () => {
    expect(positionToBudget(-20)).toBe(CALCULATOR.minBudget);
    expect(positionToBudget(180)).toBe(CALCULATOR.maxBudget);
  });

  it("increases monotonically across the track", () => {
    let previous = -1;
    for (let p = 0; p <= 100; p += 1) {
      const budget = positionToBudget(p);
      expect(budget).toBeGreaterThanOrEqual(previous);
      previous = budget;
    }
  });

  it("snaps below one crore to 5 lakh increments", () => {
    for (let p = 0; p <= 100; p += 1) {
      const budget = positionToBudget(p);
      if (budget < CRORE) {
        expect(budget % (5 * LAKH)).toBe(0);
      }
    }
  });

  it("snaps at or above one crore to 25 lakh increments", () => {
    for (let p = 0; p <= 100; p += 1) {
      const budget = positionToBudget(p);
      if (budget >= CRORE) {
        expect(budget % (25 * LAKH)).toBe(0);
      }
    }
  });

  it("is logarithmic, so the midpoint is far below the linear midpoint", () => {
    // A linear scale would put the midpoint at about 12.75 Cr. Log puts it near
    // the geometric mean, sqrt(50L * 25Cr), which is about 3.53 Cr. This is the
    // whole reason for the log mapping, so it is worth asserting.
    const midpoint = positionToBudget(50);
    const linearMidpoint = (CALCULATOR.minBudget + CALCULATOR.maxBudget) / 2;

    expect(midpoint).toBeLessThan(linearMidpoint / 3);
    expect(midpoint).toBeGreaterThan(3 * CRORE);
    expect(midpoint).toBeLessThan(4 * CRORE);
  });
});

describe("budgetToPosition", () => {
  it("maps the range ends to the track ends", () => {
    expect(budgetToPosition(CALCULATOR.minBudget)).toBe(0);
    expect(budgetToPosition(CALCULATOR.maxBudget)).toBe(100);
  });

  it("clamps budgets outside the range", () => {
    expect(budgetToPosition(1000)).toBe(0);
    expect(budgetToPosition(500 * CRORE)).toBe(100);
  });

  it("round-trips stably with positionToBudget", () => {
    // Snapping means position -> budget -> position is not an identity, but the
    // BUDGET must be stable: re-deriving the position from a snapped budget and
    // mapping it back must land on the same budget. If that were not true the
    // slider thumb would drift every time the component re-rendered.
    for (let p = 0; p <= 100; p += 1) {
      const budget = positionToBudget(p);
      const backToBudget = positionToBudget(budgetToPosition(budget));
      expect(backToBudget).toBe(budget);
    }
  });
});

describe("estimateSaving", () => {
  it("applies the configured save rate", () => {
    expect(estimateSaving(1 * CRORE)).toBeCloseTo(4_80_000, 0);
  });

  it("is consistent with the published average saving", () => {
    // Propsoch publishes an average saving of about Rs 4.78 L. At a 4.8% rate
    // that implies an average ticket of about Rs 1 Cr, so the constant is
    // anchored to the real figure rather than invented. This test documents the
    // relationship so a future edit to the rate has to confront it.
    const impliedTicket = 4_78_000 / CALCULATOR.saveRate;
    expect(impliedTicket).toBeGreaterThan(0.95 * CRORE);
    expect(impliedTicket).toBeLessThan(1.05 * CRORE);
  });

  it("never returns a negative or non-finite saving", () => {
    expect(estimateSaving(-1)).toBe(0);
    expect(estimateSaving(Number.NaN)).toBe(0);
  });
});
