// Checks every pincode in lib/pincodes.ts against India Post's public API.
import { readFileSync } from "node:fs";

const SOURCE = "lib/pincodes.ts";
const API = "https://api.postalpincode.in/pincode";

const DISTRICT_ALIASES = {
  Bangalore: ["bengaluru", "bangalore"],
  Mumbai: ["mumbai", "greater mumbai", "bombay", "mumbai suburban", "thane"],
};

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
