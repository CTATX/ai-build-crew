import assert from "node:assert/strict";
import test from "node:test";
import { analyzeWorkload, deterministicBrief } from "../lib/decision-engine.mjs";

const base = Object.freeze({
  task: "Product analysis",
  risk: "Medium",
  dataSensitivity: "Public",
  modality: "text",
  regulated: false,
  requests: 1000,
  inputTokens: 2400,
  outputTokens: 650,
  cache: 20,
  calls: 1,
  budget: 0,
  asOfDate: "2026-08-08",
  assumptions: [],
});

test("same frozen input produces identical structured result", () => {
  const first = analyzeWorkload(base);
  const second = analyzeWorkload(base);
  assert.deepEqual(first, second);
  assert.equal(deterministicBrief(first), deterministicBrief(second));
});

test("low expected and high scenarios are ordered", () => {
  const result = analyzeWorkload(base);
  assert.equal(result.evaluation.status, "PASS");
  assert.ok(result.scenarios.low.monthly < result.scenarios.expected.monthly);
  assert.ok(result.scenarios.expected.monthly < result.scenarios.high.monthly);
  assert.equal(result.scenarios.expected.annual, result.scenarios.expected.monthly * 12);
});

test("high-risk work requires review and cannot be ready", () => {
  const result = analyzeWorkload({ ...base, risk: "High" });
  assert.equal(result.disposition, "REVIEW_REQUIRED");
  assert.ok(result.governance.findings.some((finding) => finding.id === "GOV-002"));
});

test("unknown data sensitivity fails closed to human review", () => {
  const result = analyzeWorkload({ ...base, dataSensitivity: "Unknown" });
  assert.equal(result.disposition, "REVIEW_REQUIRED");
  assert.ok(result.governance.findings.some((finding) => finding.id === "GOV-004"));
});

test("unknown consequence of error fails closed to human review", () => {
  const result = analyzeWorkload({ ...base, risk: "Unknown" });
  assert.equal(result.disposition, "REVIEW_REQUIRED");
  assert.ok(result.governance.findings.some((finding) => finding.id === "GOV-012"));
  const uncertainJob = analyzeWorkload({ ...base, task: "Not sure" });
  assert.equal(uncertainJob.disposition, "REVIEW_REQUIRED");
  assert.ok(uncertainJob.governance.findings.some((finding) => finding.id === "GOV-014"));
});

test("unsupported modality blocks instead of forcing a model", () => {
  const result = analyzeWorkload({ ...base, modality: "image" });
  assert.equal(result.recommendation, null);
  assert.equal(result.disposition, "BLOCKED");
  assert.ok(result.governance.findings.some((finding) => finding.id === "GOV-001"));
});

test("stale pricing blocks finalization", () => {
  const result = analyzeWorkload({ ...base, asOfDate: "2027-01-01" });
  assert.equal(result.disposition, "BLOCKED");
  assert.ok(result.governance.findings.some((finding) => finding.id === "GOV-005"));
});

test("assumptions remain visible and create a warning", () => {
  const result = analyzeWorkload({ ...base, assumptions: ["requests", "inputTokens"] });
  assert.deepEqual(result.assumptions, ["inputTokens", "requests"]);
  assert.equal(result.governance.status, "WARN");
  const unknownRegulation = analyzeWorkload({ ...base, assumptions: ["regulated"] });
  assert.equal(unknownRegulation.disposition, "REVIEW_REQUIRED");
  assert.ok(unknownRegulation.governance.findings.some((finding) => finding.id === "GOV-013"));
});

test("excessive agent loops warn and unsafe loops block", () => {
  assert.equal(analyzeWorkload({ ...base, calls: 9 }).governance.status, "WARN");
  assert.equal(analyzeWorkload({ ...base, calls: 21 }).disposition, "BLOCKED");
});

test("candidate ordering cannot change deterministic recommendation", () => {
  const result = analyzeWorkload(base);
  assert.equal(result.recommendation.id, "gpt-5.6-terra");
  assert.equal(result.audit.status, "MATCH");
  assert.deepEqual(result.coverage.providers, ["Anthropic", "Google", "OpenAI"]);
  assert.deepEqual(result.coverage.evaluatedProviders, ["OpenAI"]);
  assert.ok(result.catalogEligible.some((model) => model.id === "gemini-3.6-flash"));
  assert.ok(!result.eligible.some((model) => model.provider !== "OpenAI"));

  const blocked = analyzeWorkload({ ...base, budget: 1 });
  assert.equal(blocked.recommendation, null);
  assert.equal(blocked.disposition, "BLOCKED");
  assert.ok(blocked.governance.findings.some((finding) => finding.id === "GOV-011"));

  const allowed = analyzeWorkload({ ...base, budget: 400 });
  assert.equal(allowed.recommendation.id, "gpt-5.6-terra");
  assert.ok(allowed.scenarios.expected.monthly <= 400);
});
