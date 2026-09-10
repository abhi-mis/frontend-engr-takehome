import { describe, expect, it } from "vitest";
import { ADVISORS, ADVISORS_SECTION, FLOOR_PLAN_CHECKS } from "../content";
import { SERVICE_PINCODES } from "../pincodes";

/**
 * The advisors section names places. This file makes sure they are places we
 * actually claim to cover.
 *
 * WHY THIS TEST EXISTS
 *
 * "Covers: Whitefield, Sarjapur Road, Bellandur" is a promise, and it is the
 * kind of promise that rots quietly. Coverage is defined once, in
 * lib/pincodes.ts, where every entry was verified against India Post. Nothing
 * stops someone adding a fourth advisor here who covers a city we have never
 * been to, and nothing on the page would look wrong.
 *
 * This is not hypothetical. The first draft of ADVISORS listed "Devanahalli",
 * which is not in the pincode map, so the section would have claimed coverage
 * the checker itself would have denied. This test is what caught it.
 *
 * Karnataka and Maharashtra are allowed as coverage for the legal role because
 * they are STATES, not micromarkets, and they are the two states Propsoch
 * publishes a RERA registration in. Both appear in FOOTER_LEGAL.
 */

/** The two states the legal role covers, each backed by a real registration. */
const REGISTERED_STATES = new Set(["Karnataka", "Maharashtra"]);

/** Every area name the pincode map knows, deduplicated. */
const SERVICEABLE_AREAS = new Set(
  Object.values(SERVICE_PINCODES).map((entry) => entry.area)
);

describe("ADVISORS coverage", () => {
  it("only names areas that lib/pincodes.ts says we serve", () => {
    for (const advisor of ADVISORS) {
      for (const area of advisor.covers) {
        const known =
          SERVICEABLE_AREAS.has(area) || REGISTERED_STATES.has(area);

        expect(
          known,
          `"${area}" is claimed by the "${advisor.role}" card but is neither a serviceable area in lib/pincodes.ts nor a state we hold a RERA registration in`
        ).toBe(true);
      }
    }
  });

  it("gives every advisor at least two areas", () => {
    // One area reads as a single agent rather than coverage, and zero would
    // render an empty row with a label above it.
    for (const advisor of ADVISORS) {
      expect(advisor.covers.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("does not invent names, photographs or years of experience", () => {
    // The section deliberately ships roles rather than people. This asserts
    // the shape stays that way: a `credential` that contains a digit is almost
    // certainly a fabricated "9 years in residential design" line creeping
    // back in, which is exactly what the footnote promises the page does not
    // do. See the provenance block above ADVISORS in lib/content.ts.
    for (const advisor of ADVISORS) {
      expect(advisor.credential).not.toMatch(/\d/);
    }

    expect(ADVISORS_SECTION.footnote).toMatch(/Names, photographs/);
  });
});

describe("FLOOR_PLAN_CHECKS", () => {
  it("has a unique id per check, because the ids are also CSS selectors", () => {
    // app/globals.css hardcodes `#plan-<id>:checked ~ ...` for each of these,
    // and the component renders `id={"plan-" + check.id}`. A duplicate id
    // would give two radios the same id and silently break the pairing.
    const ids = FLOOR_PLAN_CHECKS.map((check) => check.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses ids that are safe in both an HTML id and a CSS selector", () => {
    for (const check of FLOOR_PLAN_CHECKS) {
      expect(check.id).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it("keeps every description short enough for the reserved height", () => {
    // .plan-list reserves a fixed min-height so that switching checks cannot
    // shift the page. That reservation is sized for the longest body here, so
    // a much longer one would reintroduce the layout shift it prevents.
    for (const check of FLOOR_PLAN_CHECKS) {
      expect(check.body.length).toBeLessThanOrEqual(240);
    }
  });
});
