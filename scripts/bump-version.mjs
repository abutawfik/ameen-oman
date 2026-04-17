// scripts/bump-version.mjs
// -----------------------------------------------------------------------------
// SemVer bump CLI for version.json at the repo root.
//
// Usage:
//   node scripts/bump-version.mjs major       → bump major, reset minor/patch/build to 0
//   node scripts/bump-version.mjs minor       → bump minor, reset patch/build to 0
//   node scripts/bump-version.mjs patch       → bump patch, reset build to 0
//   node scripts/bump-version.mjs build       → bump build only (CI auto-runs this)
//   node scripts/bump-version.mjs pre alpha   → set preRelease="alpha" (does not bump numbers)
//   node scripts/bump-version.mjs pre none    → clear preRelease (production release)
//
// The file is kept pretty-printed (2-space JSON) so diffs stay human-readable.
// The script fails loudly on invalid input — never silently succeeds.
// -----------------------------------------------------------------------------

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const versionPath = resolve(__dirname, "..", "version.json");

const [, , segmentRaw, preReleaseArg] = process.argv;
const segment = (segmentRaw ?? "").toLowerCase();

const validSegments = ["major", "minor", "patch", "build", "pre"];
if (!validSegments.includes(segment)) {
  console.error(`\nUsage: node scripts/bump-version.mjs <${validSegments.join("|")}> [pre-label]`);
  console.error(`Received: "${segmentRaw ?? "(nothing)"}"\n`);
  process.exit(1);
}

let raw;
try {
  raw = readFileSync(versionPath, "utf8");
} catch (err) {
  console.error(`Cannot read ${versionPath}:`, err.message);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error(`version.json is not valid JSON:`, err.message);
  process.exit(1);
}

// Preserve the _comment field even though we mutate the numeric ones.
const before = formatVersion(data);

switch (segment) {
  case "major":
    data.major = (data.major ?? 0) + 1;
    data.minor = 0;
    data.patch = 0;
    data.build = 0;
    break;
  case "minor":
    data.minor = (data.minor ?? 0) + 1;
    data.patch = 0;
    data.build = 0;
    break;
  case "patch":
    data.patch = (data.patch ?? 0) + 1;
    data.build = 0;
    break;
  case "build":
    data.build = (data.build ?? 0) + 1;
    break;
  case "pre":
    if (!preReleaseArg) {
      console.error("Usage: node scripts/bump-version.mjs pre <alpha|beta|rc|none>");
      process.exit(1);
    }
    data.preRelease = preReleaseArg === "none" ? null : preReleaseArg;
    break;
}

writeFileSync(versionPath, JSON.stringify(data, null, 2) + "\n", "utf8");

const after = formatVersion(data);
console.log(`version.json · ${segment.toUpperCase()} bump`);
console.log(`  before: ${before}`);
console.log(`  after:  ${after}`);

function formatVersion(v) {
  const base = `${v.major ?? 0}.${v.minor ?? 0}.${v.patch ?? 0}.${v.build ?? 0}`;
  return v.preRelease ? `${base}-${v.preRelease}` : base;
}
