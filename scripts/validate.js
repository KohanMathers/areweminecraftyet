#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const VALID_COMPLIANCE = ["full", "mostly", "partial", "experimental", "forked"];
const VALID_LANGUAGES = ["java", "rust", "go", "cpp", "csharp"];
const VALID_TYPES = ["reimplementation", "fork"];
const VALID_STATUSES = ["active", "wip", "abandoned"];

const filePath = path.join(__dirname, "..", "servers.json");

let raw;
try {
  raw = fs.readFileSync(filePath, "utf8");
} catch (e) {
  console.error("Could not read servers.json:", e.message);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error("servers.json is not valid JSON:", e.message);
  process.exit(1);
}

if (!Array.isArray(data.servers)) {
  console.error('servers.json must have a top-level "servers" array.');
  process.exit(1);
}

const errors = [];
const seenNames = new Set();

data.servers.forEach((s, i) => {
  const id = `servers[${i}] (${s.name ?? "unnamed"})`;

  const requiredStrings = ["name", "url", "sourceLabel", "mcVersion", "description"];
  for (const field of requiredStrings) {
    if (typeof s[field] !== "string" || s[field].trim() === "") {
      errors.push(`${id}: "${field}" must be a non-empty string.`);
    }
  }

  if (!VALID_COMPLIANCE.includes(s.compliance)) {
    errors.push(`${id}: "compliance" must be one of [${VALID_COMPLIANCE.join(", ")}], got "${s.compliance}".`);
  }

  if (!VALID_LANGUAGES.includes(s.language)) {
    errors.push(`${id}: "language" must be one of [${VALID_LANGUAGES.join(", ")}], got "${s.language}".`);
  }

  if (!VALID_TYPES.includes(s.type)) {
    errors.push(`${id}: "type" must be one of [${VALID_TYPES.join(", ")}], got "${s.type}".`);
  }

  if (!VALID_STATUSES.includes(s.status)) {
    errors.push(`${id}: "status" must be one of [${VALID_STATUSES.join(", ")}], got "${s.status}".`);
  }

  if (s.forkNote !== null && typeof s.forkNote !== "string") {
    errors.push(`${id}: "forkNote" must be a string or null.`);
  }

  try {
    new URL(s.url);
  } catch {
    errors.push(`${id}: "url" is not a valid URL: "${s.url}".`);
  }

  if (s.name && seenNames.has(s.name)) {
    errors.push(`${id}: duplicate name "${s.name}".`);
  }
  if (s.name) seenNames.add(s.name);
});

if (errors.length > 0) {
  console.error(`servers.json validation failed with ${errors.length} error(s):\n`);
  errors.forEach(e => console.error("  -", e));
  process.exit(1);
}

console.log(`servers.json is valid. ${data.servers.length} server(s) listed.`);
