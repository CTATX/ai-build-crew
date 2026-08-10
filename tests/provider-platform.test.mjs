import assert from "node:assert/strict";
import test from "node:test";
import { buildCatalogComparison, catalogReadiness, freezeEvaluationRequest, planMockProviderRuns } from "../lib/provider-platform.mjs";
import { runOpenAIMock } from "../agents/provider-runners/openai.mjs";
import { runGoogleMock } from "../agents/provider-runners/google.mjs";
import { runAnthropicMock } from "../agents/provider-runners/anthropic.mjs";

test("catalog comparison is provider-neutral and makes no live claim", () => {
  const readiness = catalogReadiness();
  assert.deepEqual(readiness.providers, ["Anthropic", "Google", "OpenAI"]);
  assert.equal(readiness.modelCount, 8);
  assert.equal(readiness.liveEvaluation, "LOCKED");
  assert.equal(buildCatalogComparison().length, 8);
  assert.ok(buildCatalogComparison({ modalities: ["audio", "video"] }).every((model) => model.provider === "Google"));
});

test("multi-format catalog filtering is conjunctive", () => {
  assert.equal(buildCatalogComparison({ modalities: ["text", "image", "audio", "video"] }).length, 2);
  assert.equal(buildCatalogComparison({ providers: ["OpenAI"], modalities: ["audio"] }).length, 0);
  assert.ok(buildCatalogComparison({ minimumContext: 1_000_000 }).every((model) => model.contextTokens >= 1_000_000));
});

test("frozen run contract rejects raw product content", () => {
  assert.throws(() => freezeEvaluationRequest({ idea: "private idea" }), /PRIVACY-001/);
  assert.throws(() => freezeEvaluationRequest({ rawPrompt: "secret" }), /PRIVACY-001/);
});

test("preview contract locks spend, cases, repeats, and provider envelopes", () => {
  const request = freezeEvaluationRequest({
    level: "preview",
    workloadHash: "fnv1a-workload",
    modelIds: ["gpt-5.6-terra", "gemini-3.6-flash", "claude-sonnet-5"],
    caseIds: ["case-03", "case-01", "case-02"],
    scoringRubricId: "rubric-1",
  });
  assert.equal(request.limits.maxSpendUsd, 1);
  assert.equal(request.limits.maxRetries, 1);
  assert.equal(request.retention.rawPrompts, false);
  assert.deepEqual(request.caseIds, ["case-01", "case-02", "case-03"]);
  const runs = planMockProviderRuns(request);
  assert.equal(runs.length, 3);
  assert.ok(runs.every((run) => run.requestHash === request.requestHash && run.networkAllowed === false));
  assert.equal(runOpenAIMock(runs.find((run) => run.provider === "OpenAI")).status, "MOCKED_NO_NETWORK");
  assert.equal(runGoogleMock(runs.find((run) => run.provider === "Google")).status, "MOCKED_NO_NETWORK");
  assert.equal(runAnthropicMock(runs.find((run) => run.provider === "Anthropic")).status, "MOCKED_NO_NETWORK");
});

test("bounded levels reject oversized or unknown runs", () => {
  const base = { level: "preview", workloadHash: "w", caseIds: ["1"], scoringRubricId: "r" };
  assert.throws(() => freezeEvaluationRequest({ ...base, modelIds: [] }), /RUN-002/);
  assert.throws(() => freezeEvaluationRequest({ ...base, modelIds: ["made-up-model"] }), /RUN-004/);
  assert.throws(() => freezeEvaluationRequest({ ...base, modelIds: ["gpt-5.6-terra"], caseIds: ["1", "2", "3", "4"] }), /RUN-003/);
});
