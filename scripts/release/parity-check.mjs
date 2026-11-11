/**
 * release-parity: compare committed, names-only release/parity.json
 * against the repo's config files. Fail on drift.
 *
 * Never prints secret or variable VALUES — names only.
 * Does not call Cloudflare, Render, ShopMonkey, or any live host.
 */
"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = findRoot();
const MANIFEST_PATH = path.join(ROOT, "release", "parity.json");
const EXIT_DRIFT = 1;
const EXIT_USAGE = 2;

function findRoot() {
  // Walk up from cwd and from this script to the dir that has release/parity.json
  const starts = [process.cwd(), path.resolve(__dirname, "..", "..")];
  for (const start of starts) {
    let dir = start;
    for (let i = 0; i < 8; i++) {
      if (fs.existsSync(path.join(dir, "release", "parity.json"))) return dir;
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  return process.cwd();
}

function fail(msg) {
  console.error(`release-parity FAIL: ${msg}`);
  process.exit(EXIT_DRIFT);
}

function usage(msg) {
  console.error(`release-parity ERROR: ${msg}`);
  process.exit(EXIT_USAGE);
}

function readUtf8(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, "utf8");
}

function isSnakeName(s) {
  return /^[A-Z][A-Z0-9_]{1,127}$/.test(s);
}

/** Extract binding / var / secret NAMES from wrangler.toml (active + commented). */
function parseWranglerToml(text) {
  const names = new Set();
  const activeVars = new Set();
  let inVars = false;
  for (const raw of text.split(/\r?\n/)) {
    const trimmed = raw.trim();
    const uncommented = trimmed.replace(/^#+\s?/, "");
    const isComment = /^\s*#/.test(raw);
    if (/^\[vars\]/.test(uncommented)) {
      inVars = true;
      continue;
    }
    if (/^\[/.test(uncommented)) {
      inVars = false;
    }
    let m = uncommented.match(/^(?:binding|name)\s*=\s*"([^"]+)"/);
    if (m && isSnakeName(m[1])) names.add(m[1]);
    m = uncommented.match(/^([A-Z][A-Z0-9_]{1,127})\s*=/);
    if (m) {
      names.add(m[1]);
      if (inVars && !isComment) activeVars.add(m[1]);
    }
  }
  return { names, activeVars };
}

function parseEnvExample(text) {
  const names = new Set();
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/^\s*#+\s?/, "").trim();
    const m = line.match(/^([A-Z][A-Z0-9_]{1,127})\s*=/);
    if (m) names.add(m[1]);
  }
  return names;
}

function parseRenderYaml(text) {
  const names = new Set();
  const services = new Set();
  const healthPaths = new Set();
  for (const raw of text.split(/\r?\n/)) {
    let m = raw.match(/^\s*-\s*key:\s*([A-Z][A-Z0-9_]{1,127})\s*$/);
    if (m) names.add(m[1]);
    m = raw.match(/^\s*name:\s*([A-Za-z0-9._-]+)\s*$/);
    if (m) services.add(m[1]);
    m = raw.match(/^\s*healthCheckPath:\s*(\S+)\s*$/);
    if (m) healthPaths.add(m[1]);
  }
  return { names, services, healthPaths };
}

function parseGithubWorkflow(text) {
  const names = new Set();
  // ${{ vars.NAME }} or ${{ secrets.NAME }}
  const re = /\$\{\{\s*(?:vars|secrets)\.([A-Z][A-Z0-9_]{1,127})\s*\}\}/g;
  let m;
  while ((m = re.exec(text))) names.add(m[1]);
  return names;
}

function parseWorkerEnvInterface(text) {
  const names = new Set();
  // interface Env { NAME: ... }
  const block = text.match(/interface\s+Env\s*\{([\s\S]*?)\}/);
  if (block) {
    const re = /^\s*([A-Z][A-Z0-9_]{1,127})\s*[?:]/gm;
    let m;
    while ((m = re.exec(block[1]))) names.add(m[1]);
  }
  // env.NAME uses
  const use = /(?:\benv|cloudflare:workers)\b[\s\S]{0,40}?\b([A-Z][A-Z0-9_]{1,127})\b/g;
  let m;
  while ((m = use.exec(text))) {
    if (isSnakeName(m[1]) && m[1] !== "DB" ? true : true) names.add(m[1]);
  }
  // env.DB specifically
  const envDot = /\benv\.([A-Z][A-Z0-9_]{1,127})\b/g;
  while ((m = envDot.exec(text))) names.add(m[1]);
  return names;
}

function parseProcessEnv(text) {
  const names = new Set();
  const re = /process\.env\.([A-Z][A-Z0-9_]{1,127})/g;
  let m;
  while ((m = re.exec(text))) names.add(m[1]);
  return names;
}

function parseHostingJsonBindings(text) {
  const data = JSON.parse(text);
  // Names only. Never emit project_id or other identifiers.
  return {
    d1: data.d1 === undefined ? undefined : data.d1,
    r2: data.r2 === undefined ? undefined : data.r2,
  };
}

function unionNames(manifest) {
  const all = new Set();
  const envs = manifest.environments || {};
  for (const env of Object.values(envs)) {
    for (const key of ["bindings", "vars", "secrets", "mustBeUnset", "optionalBindings", "optionalSecrets", "optionalVars"]) {
      for (const n of env[key] || []) all.add(n);
    }
  }
  for (const n of manifest.documentedNames || []) all.add(n);
  return all;
}

function main() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    usage(`missing ${path.relative(ROOT, MANIFEST_PATH) || "release/parity.json"}`);
  }
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  } catch (err) {
    usage(`cannot parse release/parity.json: ${err.message}`);
  }
  if (!manifest.deployTarget || !manifest.sources || !Array.isArray(manifest.sources)) {
    usage("release/parity.json must have deployTarget and sources[]");
  }

  const found = new Set();
  const activeVars = new Set();
  const problems = [];
  const notes = [];

  for (const source of manifest.sources) {
    const rel = source.file;
    const text = readUtf8(rel);
    if (text === null) {
      if (source.required === false) {
        notes.push(`optional source missing: ${rel}`);
        continue;
      }
      problems.push(`required config file missing: ${rel}`);
      continue;
    }
    switch (source.type) {
      case "wrangler-toml": {
        const parsed = parseWranglerToml(text);
        parsed.names.forEach((n) => found.add(n));
        parsed.activeVars.forEach((n) => activeVars.add(n));
        break;
      }
      case "env-example": {
        parseEnvExample(text).forEach((n) => found.add(n));
        break;
      }
      case "render-yaml": {
        const parsed = parseRenderYaml(text);
        parsed.names.forEach((n) => found.add(n));
        const expectedServices = source.services || [];
        for (const s of expectedServices) {
          if (!parsed.services.has(s)) problems.push(`${rel}: missing service ${s}`);
        }
        for (const s of parsed.services) {
          if (expectedServices.length && !expectedServices.includes(s)) {
            problems.push(`${rel}: undeclared service ${s}`);
          }
        }
        const expectedHealth = source.healthCheckPaths || [];
        for (const h of expectedHealth) {
          if (!parsed.healthPaths.has(h)) problems.push(`${rel}: missing healthCheckPath ${h}`);
        }
        break;
      }
      case "github-workflow": {
        parseGithubWorkflow(text).forEach((n) => found.add(n));
        break;
      }
      case "worker-env-interface":
      case "source-env-names": {
        parseWorkerEnvInterface(text).forEach((n) => found.add(n));
        parseProcessEnv(text).forEach((n) => found.add(n));
        break;
      }
      case "hosting-json-bindings": {
        const bindings = parseHostingJsonBindings(text);
        const expected = source.expected || {};
        for (const key of ["d1", "r2"]) {
          const got = bindings[key] === null || bindings[key] === undefined ? null : String(bindings[key]);
          const want = expected[key] === undefined ? undefined : expected[key] === null ? null : String(expected[key]);
          if (want !== undefined && got !== want) {
            problems.push(`${rel}: ${key} binding name drift (manifest vs file; names only)`);
          }
          if (got && isSnakeName(got)) found.add(got);
        }
        break;
      }
      default:
        problems.push(`unknown source type: ${source.type}`);
    }
  }

  const expected = unionNames(manifest);
  if (expected.size === 0) {
    problems.push("manifest lists no binding/var/secret names — refusing no-op");
  }

  const ignoreFound = new Set(manifest.ignoreFoundNames || []);
  for (const n of found) {
    if (ignoreFound.has(n)) continue;
    if (!expected.has(n)) {
      problems.push(`config has name not in release/parity.json: ${n}`);
    }
  }
  const requireInConfig = new Set(manifest.requireInConfig || []);
  for (const n of requireInConfig) {
    if (!found.has(n)) problems.push(`manifest requireInConfig name missing from config: ${n}`);
  }

  const mustBeUnset = new Set();
  for (const env of Object.values(manifest.environments || {})) {
    for (const n of env.mustBeUnset || []) mustBeUnset.add(n);
  }
  for (const n of mustBeUnset) {
    if (activeVars.has(n)) {
      problems.push(`${n} is set in committed wrangler [vars]; must be unset in preview and prod`);
    }
  }

  // Honesty: if the manifest claims a preview target file that isn't sourced, say so.
  if (manifest.previewDeclaredInRepo === false) {
    notes.push(
      "preview target is not declared in repo config; D-2026-11-11-07 still requires a preview with identical settings before prod. Tess records that on the release checklist."
    );
  }

  console.log(`release-parity: repo=${manifest.repo || path.basename(ROOT)}`);
  console.log(`deployTarget=${manifest.deployTarget}`);
  console.log(`names in config: ${[...found].sort().join(", ") || "(none)"}`);
  console.log(`names in manifest union: ${[...expected].sort().join(", ")}`);
  if (activeVars.size) console.log(`active wrangler [vars]: ${[...activeVars].sort().join(", ")}`);
  for (const n of notes) console.log(`note: ${n}`);

  if (problems.length) {
    for (const p of problems) console.error(`- ${p}`);
    fail(`${problems.length} drift item(s)`);
  }
  console.log("release-parity PASS");
}

main();
