/**
 * Verifies lib/pincodes.ts against India Post's public pincode API.
 *
 * Why this exists: a wrong pincode in the coverage map is a real bug, it tells
 * someone we serve an area we do not or turns away someone we do. Writing 85
 * pincodes from memory and hoping is not good enough, so this checks every one.
 *
 * For each entry it asserts:
 *   1. The pincode exists in India Post's database.
 *   2. Its district matches the city claimed in our data.
 *
 * It does NOT assert that our friendly area name matches India Post's post
 * office name, because those legitimately differ ("HSR Layout" versus
 * "Agara S.O."). It prints the real post office names so a human can sanity
 * check the label.
 *
 * This is a one-off data check, not part of `npm run verify`: it hits a third
 * party API over the network, so it has no business in a build pipeline. Run it
 * by hand when the coverage map changes:
 *
 *   node scripts/verify-pincodes.mjs
 */

import { readFileSync } from "node:fs";

const SOURCE = "lib/pincodes.ts";
const API = "https://api.postalpincode.in/pincode";

/** Districts India Post uses for each of our cities, lowercased. */
const DISTRICT_ALIASES = {
  Bangalore: ["bengaluru", "bangalore"],
  Mumbai: ["mumbai", "greater mumbai", "bombay", "mumbai suburban", "thane"],
};

/**
 * Parses the entries straight out of the TypeScript source, so the script can
 * never drift from the file it is checking. A regex is the right tool here: the
 * data is a flat literal with one entry per line by construction.
 */
function readEntries() {
  const text = readFileSync(SOURCE, "utf8");
  const pattern =
    /"(\d{6})":\s*\{\s*area:\s*"([^"]+)",\s*city:\s*"([^"]+)"\s*\}/g;

  const entries = [];
  for (const match of text.matchAll(pattern)) {
    entries.push({ pincode: match[1], area: match[2], city: match[3] });
  }
  return entries;
}

async function lookup(pincode) {
  const res = await fetch(`${API}/${pincode}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const body = await res.json();
  const record = Array.isArray(body) ? body[0] : body;

  if (record?.Status !== "Success" || !Array.isArray(record.PostOffice)) {
    return null;
  }

  return {
    districts: [...new Set(record.PostOffice.map((p) => p.District))],
    offices: record.PostOffice.map((p) => p.Name),
  };
}

const entries = readEntries();
console.log(`Verifying ${entries.length} pincodes from ${SOURCE}\n`);

const problems = [];
let checked = 0;

for (const entry of entries) {
  let result;
  try {
    result = await lookup(entry.pincode);
  } catch (error) {
    problems.push({
      ...entry,
      issue: `lookup failed: ${error.message}`,
      severity: "warn",
    });
    continue;
  }

  checked += 1;

  if (!result) {
    problems.push({
      ...entry,
      issue: "pincode not found in India Post database",
      severity: "error",
    });
    continue;
  }

  const allowed = DISTRICT_ALIASES[entry.city] ?? [];
  const districtMatches = result.districts.some((d) =>
    allowed.includes(String(d).toLowerCase())
  );

  if (!districtMatches) {
    problems.push({
      ...entry,
      issue: `district mismatch: API says ${result.districts.join(", ")}, we claim ${entry.city}`,
      severity: "error",
    });
    continue;
  }

  console.log(
    `  ok  ${entry.pincode}  ${entry.area.padEnd(26)} ${result.offices
      .slice(0, 3)
      .join(", ")}`
  );
}

const errors = problems.filter((p) => p.severity === "error");
const warnings = problems.filter((p) => p.severity === "warn");

console.log(`\nChecked ${checked} of ${entries.length}.`);

if (warnings.length) {
  console.log(`\n${warnings.length} could not be checked (network):`);
  for (const w of warnings) console.log(`  ${w.pincode} ${w.area}: ${w.issue}`);
}

if (errors.length) {
  console.log(`\n${errors.length} PROBLEM(S) that need fixing:`);
  for (const e of errors) console.log(`  ${e.pincode} ${e.area}: ${e.issue}`);
  process.exit(1);
}

console.log("\nAll verified pincodes are real and in the expected district.");
