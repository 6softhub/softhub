#!/usr/bin/env node
/**
 * i18n key coverage check.
 * Ensures every key that exists in the reference locale (en) is present
 * in every other supported locale. Exits non-zero on gaps or extras.
 * Run before production builds: `node scripts/check-i18n-coverage.mjs`
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, "..", "src", "locales");
const REFERENCE = "en";
const LOCALES = ["en", "es", "fr"];

function load(locale) {
  return JSON.parse(readFileSync(join(LOCALES_DIR, `${locale}.json`), "utf8"));
}

function flatten(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) out.push(...flatten(v, path));
    else out.push(path);
  }
  return out;
}

const ref = new Set(flatten(load(REFERENCE)));
let failed = false;

for (const locale of LOCALES) {
  if (locale === REFERENCE) continue;
  const keys = new Set(flatten(load(locale)));
  const missing = [...ref].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !ref.has(k));
  if (missing.length === 0 && extra.length === 0) {
    console.log(`✓ ${locale}: ${keys.size} keys, fully aligned with ${REFERENCE}`);
    continue;
  }
  failed = true;
  console.error(`✗ ${locale} out of sync with ${REFERENCE}`);
  if (missing.length) console.error(`  missing (${missing.length}):`, missing.join(", "));
  if (extra.length) console.error(`  extra (${extra.length}):`, extra.join(", "));
}

if (failed) {
  console.error("\ni18n coverage check failed.");
  process.exit(1);
}
console.log("\ni18n coverage check passed.");
