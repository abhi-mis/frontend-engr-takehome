import { describe, expect, it } from "vitest";
import {
  SERVICE_PINCODES,
  lookupPincode,
  type ServiceCity,
} from "../pincodes";

const CITIES: readonly ServiceCity[] = ["Bangalore", "Mumbai"];

describe("lookupPincode validation", () => {
  it("rejects anything that is not six digits", () => {
    expect(lookupPincode("56003")).toEqual({ status: "invalid" });
    expect(lookupPincode("5600345")).toEqual({ status: "invalid" });
    expect(lookupPincode("")).toEqual({ status: "invalid" });
  });

  it("rejects non-numeric input", () => {
    expect(lookupPincode("56003a")).toEqual({ status: "invalid" });
    expect(lookupPincode("abcdef")).toEqual({ status: "invalid" });
    expect(lookupPincode("560 034")).toEqual({ status: "invalid" });
  });

  it("rejects a leading zero, which no Indian pincode has", () => {
    expect(lookupPincode("012345")).toEqual({ status: "invalid" });
  });

  it("tolerates surrounding whitespace, since people paste", () => {
    expect(lookupPincode("  560034  ")).toEqual({
      status: "covered",
      area: { area: "Koramangala", city: "Bangalore" },
    });
  });
});

describe("lookupPincode results", () => {
  it("returns the area for a covered pincode", () => {
    expect(lookupPincode("560102")).toEqual({
      status: "covered",
      area: { area: "HSR Layout", city: "Bangalore" },
    });
    expect(lookupPincode("400076")).toEqual({
      status: "covered",
      area: { area: "Powai", city: "Mumbai" },
    });
  });

  it("distinguishes a valid uncovered pincode from an invalid one", () => {
    // 110001 is Connaught Place, Delhi. A real pincode, outside our coverage.
    // This is the distinction that matters: showing "that is not a pincode" to
    // someone in Delhi would be wrong and confusing.
    expect(lookupPincode("110001")).toEqual({ status: "not-covered" });
    expect(lookupPincode("11000")).toEqual({ status: "invalid" });
  });
});

describe("SERVICE_PINCODES data integrity", () => {
  const entries = Object.entries(SERVICE_PINCODES);

  it("covers a useful number of areas in both cities", () => {
    const byCity = (city: ServiceCity) =>
      entries.filter(([, area]) => area.city === city).length;

    expect(byCity("Bangalore")).toBeGreaterThanOrEqual(30);
    expect(byCity("Mumbai")).toBeGreaterThanOrEqual(30);
  });

  it("has a six digit key with no leading zero for every entry", () => {
    for (const [pincode] of entries) {
      expect(pincode, `${pincode} is not a valid pincode key`).toMatch(
        /^[1-9][0-9]{5}$/
      );
    }
  });

  it("has no duplicate keys", () => {
    // Object literals silently drop duplicates, so a repeated pincode would
    // vanish rather than error. Comparing the parsed key count against the
    // count of pincode-shaped keys in the source is the only way to catch it,
    // and scripts/verify-pincodes.mjs does that against the file. Here we at
    // least assert the runtime shape is a clean set.
    const unique = new Set(entries.map(([pincode]) => pincode));
    expect(unique.size).toBe(entries.length);
  });

  it("uses only known cities", () => {
    for (const [pincode, area] of entries) {
      expect(CITIES, `${pincode} has an unknown city`).toContain(area.city);
    }
  });

  it("has a non-empty, human readable area name for every entry", () => {
    for (const [pincode, area] of entries) {
      expect(area.area.trim().length, `${pincode} has an empty area`).toBeGreaterThan(2);
      // India Post's internal suffixes should not leak into user-facing labels.
      expect(area.area, `${pincode} looks like a raw post office name`).not.toMatch(
        /\b(S\.O\.|B\.O\.|H\.O\.)$/
      );
    }
  });

  it("puts Bangalore pincodes in the 560xxx block and Mumbai in 400xxx", () => {
    for (const [pincode, area] of entries) {
      if (area.city === "Bangalore") {
        expect(pincode.startsWith("560"), `${pincode} is not a 560 block`).toBe(true);
      } else {
        expect(pincode.startsWith("400"), `${pincode} is not a 400 block`).toBe(true);
      }
    }
  });
});
