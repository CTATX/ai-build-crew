import assert from "node:assert/strict";
import test from "node:test";
import { buildDecisionReport } from "../lib/decision-report.mjs";
import { analyzeWorkload, models } from "../lib/decision-engine.mjs";

test("builds a point-in-time report with costs, evidence, decision, and reproducibility fields", () => {
  const result = analyzeWorkload({ task: "Product analysis", risk: "Medium", dataSensitivity: "Public", modalities: ["text"], regulated: false, requests: 100, inputTokens: 1200, responseSize: "Short answer", cache: 0, primarySteps: 1, checkerSteps: 1, budget: 0, assumptions: ["requests"], asOfDate: "2026-08-09" });
  const model = result.recommendation ?? models[0];
  const report = buildDecisionReport({ generatedAt: "2026-08-09T12:00:00.000Z", idea: "A requirements review tool", result, activeModel: model, activeScenarios: result.scenarios, comparisonOnly: false, decision: "Recommendation selected", decisionNote: "Pilot first", assumptions: ["requests"] });
  assert.match(report, /Point-in-Time Model Assessment/);
  assert.match(report, /A requirements review tool/);
  assert.match(report, /Low cost per completed task/);
  assert.match(report, /Cost evaluation: PASS/);
  assert.match(report, /Recommendation selected/);
  assert.match(report, /Pilot first/);
  assert.match(report, /Input hash:/);
});

test("blocked report records no model and never invents a fallback cost", () => {
  const result = analyzeWorkload({ task: "Classification & extraction", risk: "Low", dataSensitivity: "Public", modalities: ["audio", "image", "text", "video"], regulated: false, requests: 250, inputTokens: 1200, responseSize: "Short answer", cache: 0, primarySteps: 1, checkerSteps: 0, budget: 0, assumptions: [], asOfDate: "2026-08-09" });
  const report = buildDecisionReport({ generatedAt: "2026-08-09T12:00:00.000Z", idea: "A multimodal parts inventory", result, activeModel: null, activeScenarios: null, comparisonOnly: false, decision: "Held for review", decisionNote: "Split into stages", assumptions: [] });
  assert.match(report, /Model shown: None/);
  assert.match(report, /Cost: Not emitted/);
  assert.match(report, /Gemini 3\.6 Flash/);
  assert.doesNotMatch(report, /Low cost per completed task/);
});
