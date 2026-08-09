import assert from "node:assert/strict";
import test from "node:test";
import { analyzeWorkload, costFor, deterministicBrief, models, runGovernance } from "../lib/decision-engine.mjs";
import { runCostEvaluator } from "../agents/cost-evaluator.mjs";

const base = Object.freeze({
  task: "Product analysis",
  risk: "Medium",
  dataSensitivity: "Public",
  modality: "text",
  regulated: false,
  requests: 1000,
  inputTokens: 2400,
  responseSize: "Detailed answer",
  cache: 20,
  primarySteps: 1,
  checkerSteps: 1,
  budget: 0,
  asOfDate: "2026-08-09",
  assumptions: [],
});

test("same frozen input produces identical structured result", () => {
  const first = analyzeWorkload(base);
  const second = analyzeWorkload(base);
  assert.deepEqual(first, second);
  assert.equal(deterministicBrief(first), deterministicBrief(second));
});

test("model-behavior low likely and high task-cost scenarios are ordered", () => {
  const result = analyzeWorkload(base);
  assert.equal(result.evaluation.status, "PASS");
  assert.ok(result.scenarios.low.perCompletedTask < result.scenarios.expected.perCompletedTask);
  assert.ok(result.scenarios.expected.perCompletedTask < result.scenarios.high.perCompletedTask);
  assert.ok(Math.abs(result.scenarios.expected.monthlyAtPlannedVolume - (result.scenarios.expected.perCompletedTask * base.requests * 30)) < 0.000001);
  assert.ok(result.scenarios.expected.attemptedCallsPerTask > base.primarySteps);
});

test("output tokens are a model property rather than a user input", () => {
  const baseline = analyzeWorkload(base);
  assert.throws(() => analyzeWorkload({ ...base, outputTokens: 999999 }), /COST-001/);
  assert.equal(baseline.costEvaluation.status, "PASS");

  const luna = models.find((model) => model.id === "gpt-5.6-luna");
  const sol = models.find((model) => model.id === "gpt-5.6-sol");
  assert.ok(costFor(sol, baseline.workload, "high").outputTokensPerPrimary > costFor(luna, baseline.workload, "high").outputTokensPerPrimary);
});

test("checker steps and retry profiles increase cost per completed task", () => {
  const withoutChecker = analyzeWorkload({ ...base, checkerSteps: 0 });
  const withChecker = analyzeWorkload(base);
  assert.ok(withChecker.scenarios.expected.perCompletedTask > withoutChecker.scenarios.expected.perCompletedTask);
  assert.ok(withChecker.scenarios.high.retryMultiplier > withChecker.scenarios.low.retryMultiplier);
  assert.ok(withChecker.scenarios.high.attemptedCallsPerTask > withChecker.scenarios.low.attemptedCallsPerTask);
  assert.ok(withChecker.governance.findings.some((finding) => finding.id === "GOV-015"));
});

test("cost specialist fails a corrupted frozen estimate", () => {
  const result = analyzeWorkload(base);
  const corrupted = {
    ...result.scenarios,
    expected: { ...result.scenarios.expected, perCompletedTask: result.scenarios.expected.perCompletedTask + 0.01 },
  };
  const report = runCostEvaluator({ rawInput: base, workload: result.workload, model: result.recommendation, estimatedScenarios: corrupted });
  assert.equal(report.status, "FAIL");
  assert.equal(report.checks.find((check) => check.id === "COST-AUDIT-EXPECTED").pass, false);
});

test("failed cost evaluation blocks at governance", () => {
  const result = analyzeWorkload(base);
  const governance = runGovernance(result.workload, result.eligible, { status: "FAIL" }, result.audit, base.asOfDate, []);
  assert.equal(governance.status, "BLOCK");
  assert.ok(governance.findings.some((finding) => finding.id === "GOV-009"));
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

test("modality without an evaluated baseline blocks instead of forcing a model", () => {
  const result = analyzeWorkload({ ...base, modality: "audio" });
  assert.equal(result.recommendation, null);
  assert.equal(result.disposition, "BLOCKED");
  assert.ok(result.governance.findings.some((finding) => finding.id === "GOV-001"));
});

test("multi-format requirements are conjunctive and never silently reduced", () => {
  const textAndImage = analyzeWorkload({ ...base, modalities: ["text", "image"] });
  assert.deepEqual(textAndImage.workload.modalities, ["image", "text"]);
  assert.ok(textAndImage.catalogEligible.every((model) => model.modalities.includes("text") && model.modalities.includes("image")));
  const textAndAudio = analyzeWorkload({ ...base, modalities: ["text", "audio"] });
  assert.equal(textAndAudio.recommendation, null);
  assert.equal(textAndAudio.disposition, "BLOCKED");
});

test("unknown workflow steps receive a visible deterministic recommendation", () => {
  const suggested = analyzeWorkload({ ...base, primarySteps: 0, checkerSteps: -1, assumptions: ["primarySteps", "checkerSteps"] });
  assert.equal(suggested.workflowSuggestion.applied, true);
  assert.equal(suggested.workload.primarySteps, 2);
  assert.equal(suggested.workload.checkerSteps, 1);
  assert.match(suggested.workflowSuggestion.rationale, /product analysis/i);
});

test("recommendation changes when the eligibility tier changes", () => {
  assert.equal(analyzeWorkload({ ...base, task: "Classification & extraction", risk: "Low" }).recommendation.id, "gpt-5.6-luna");
  assert.equal(analyzeWorkload(base).recommendation.id, "gpt-5.6-terra");
  assert.equal(analyzeWorkload({ ...base, task: "Complex reasoning", risk: "High" }).recommendation.id, "gpt-5.6-sol");
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
  assert.equal(analyzeWorkload({ ...base, primarySteps: 8, checkerSteps: 1 }).governance.status, "WARN");
  assert.equal(analyzeWorkload({ ...base, primarySteps: 20, checkerSteps: 1 }).disposition, "BLOCKED");
});

test("candidate ordering cannot change deterministic recommendation", () => {
  const result = analyzeWorkload(base);
  assert.equal(result.recommendation.id, "gpt-5.6-terra");
  assert.equal(result.audit.status, "MATCH");
  assert.deepEqual(result.coverage.providers, ["Anthropic", "Google", "OpenAI"]);
  assert.deepEqual(result.coverage.evaluatedProviders, ["OpenAI"]);
  assert.ok(result.catalogEligible.some((model) => model.id === "gemini-3.6-flash"));
  assert.ok(!result.eligible.some((model) => model.provider !== "OpenAI"));

  const blocked = analyzeWorkload({ ...base, budget: 0.001 });
  assert.equal(blocked.recommendation, null);
  assert.equal(blocked.disposition, "BLOCKED");
  assert.ok(blocked.governance.findings.some((finding) => finding.id === "GOV-011"));

  const allowed = analyzeWorkload({ ...base, budget: 1 });
  assert.equal(allowed.recommendation.id, "gpt-5.6-terra");
  assert.ok(allowed.scenarios.expected.perCompletedTask <= 1);
});
