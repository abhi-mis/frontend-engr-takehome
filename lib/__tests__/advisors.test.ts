import { describe, expect, it } from "vitest";
import { ADVISORS, ADVISORS_SECTION, FLOOR_PLAN_CHECKS } from "../content";
import { SERVICE_PINCODES } from "../pincodes";

// Guards the advisors section against claiming coverage we do not have, and
// against fabricated credentials creeping back in.
const REGISTERED_STATES = new Set(["Karnataka", "Maharashtra"]);

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
    for (const advisor of ADVISORS) {
      expect(advisor.covers.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("does not invent names, photographs or years of experience", () => {
    for (const advisor of ADVISORS) {
      expect(advisor.credential).not.toMatch(/\d/);
    }

    expect(ADVISORS_SECTION.footnote).toMatch(/Names, photographs/);
  });
});

describe("FLOOR_PLAN_CHECKS", () => {
  it("has a unique id per check, because the ids are also CSS selectors", () => {
    const ids = FLOOR_PLAN_CHECKS.map((check) => check.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses ids that are safe in both an HTML id and a CSS selector", () => {
    for (const check of FLOOR_PLAN_CHECKS) {
      expect(check.id).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it("keeps every description short enough for the reserved height", () => {
    for (const check of FLOOR_PLAN_CHECKS) {
      expect(check.body.length).toBeLessThanOrEqual(240);
    }
  });
});
