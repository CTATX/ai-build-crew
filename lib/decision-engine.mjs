import catalog from "../data/model-catalog.v1.json" with { type: "json" };
import governance from "../governance/absolute-rules.v1.json" with { type: "json" };
import costContract from "../config/cost-estimation-rules.v1.json" with { type: "json" };
import { assertCostInputContract, runCostEvaluator } from "../agents/cost-evaluator.mjs";

export const ENGINE_VERSION = "decision-engine-1.3.0";

export const taskRequirements = Object.freeze({
  "Classification & extraction": 1,
  "Content & summarization": 1,
  "Product analysis": 2,
  "Coding & agent workflow": 2,
  "Complex reasoning": 3,
});

export const responseProfiles = Object.freeze(Object.fromEntries(Object.entries(costContract.responseProfiles).map(([name, profile]) => [name, Object.freeze({ ...profile })])));

export const models = Object.freeze(catalog.models.map((model) => Object.freeze({
  ...model,
  costBehavior: Object.freeze({
    ...model.costBehavior,
    outputMultiplier: Object.freeze({ ...model.costBehavior.outputMultiplier }),
    retryMultiplier: Object.freeze({ ...model.costBehavior.retryMultiplier }),
  }),
})));

function round(value, digits = 8) {
  const power = 10 ** digits;
  return Math.round((value + Number.EPSILON) * power) / power;
}

function inputCost(model, tokens, cachePercent) {
  const cachedTokens = tokens * (cachePercent / 100);
  const uncachedTokens = tokens - cachedTokens;
  return (uncachedTokens * model.input + cachedTokens * model.cached) / 1_000_000;
}

export function costFor(model, workload, scenario = "expected") {
  const profile = model.costBehavior;
  const response = responseProfiles[workload.responseSize] ?? responseProfiles["Detailed answer"];
  const outputMultiplier = profile.outputMultiplier[scenario];
  const retryMultiplier = profile.retryMultiplier[scenario];
  const outputTokensPerPrimary = response.baseTokens * outputMultiplier;
  const checkerOutputTokens = Math.max(50, response.baseTokens * costContract.checkerOutputShare * outputMultiplier);
  const primarySteps = Math.max(1, workload.primarySteps);
  const checkerSteps = Math.max(0, workload.checkerSteps);

  const primaryCallCost = inputCost(model, workload.inputTokens, workload.cache)
    + (outputTokensPerPrimary * model.output) / 1_000_000;
  // A checker sees the source plus the generated answer. Treat that context as
  // uncached so the estimate does not hide the cost of verification.
  const checkerCallCost = ((workload.inputTokens + outputTokensPerPrimary) * model.input) / 1_000_000
    + (checkerOutputTokens * model.output) / 1_000_000;
  const attemptedPrimaryCalls = primarySteps * retryMultiplier;
  const attemptedCheckerCalls = checkerSteps * retryMultiplier;
  const perCompletedTask = attemptedPrimaryCalls * primaryCallCost + attemptedCheckerCalls * checkerCallCost;
  const completedTasksPerMonth = workload.requests * 30;

  return Object.freeze({
    scenario,
    perCompletedTask: round(perCompletedTask),
    monthlyAtPlannedVolume: round(perCompletedTask * completedTasksPerMonth),
    completedTasksPerMonth: round(completedTasksPerMonth),
    outputTokensPerPrimary: round(outputTokensPerPrimary, 2),
    retryMultiplier: round(retryMultiplier, 3),
    attemptedCallsPerTask: round(attemptedPrimaryCalls + attemptedCheckerCalls, 3),
  });
}

function catalogAgeDays(asOfDate) {
  const start = new Date(`${catalog.sourceDate}T00:00:00Z`).getTime();
  const end = new Date(`${asOfDate}T00:00:00Z`).getTime();
  return Math.floor((end - start) / 86_400_000);
}

export function evaluateDecision(workload, recommendation, scenarios, costEvaluation) {
  const recomputed = costFor(recommendation, workload, "expected");
  const checks = [
    { id: "EVAL-001", name: "Likely cost per completed task is reproducible", pass: recomputed.perCompletedTask === scenarios.expected.perCompletedTask },
    { id: "EVAL-002", name: "Cost distribution is ordered", pass: scenarios.low.perCompletedTask <= scenarios.expected.perCompletedTask && scenarios.expected.perCompletedTask <= scenarios.high.perCompletedTask },
    { id: "EVAL-003", name: "Recommendation supports modality", pass: recommendation.modalities.includes(workload.modality) },
    { id: "EVAL-004", name: "Recommendation clears rule quality", pass: recommendation.quality >= Math.max(taskRequirements[workload.task] ?? 3, workload.risk === "High" ? 3 : workload.risk === "Medium" ? 2 : 1) },
    { id: "EVAL-005", name: "Output and retry assumptions come from the model profile", pass: !Object.hasOwn(workload, "outputTokens") && Boolean(recommendation.costBehavior) },
    { id: "EVAL-006", name: "Checker calls are included in completed-task cost", pass: workload.checkerSteps === 0 || scenarios.expected.attemptedCallsPerTask > workload.primarySteps },
    { id: "EVAL-007", name: "Independent cost specialist passes every hard cost rule", pass: costEvaluation.status === "PASS" },
  ];
  return Object.freeze({
    version: "eval-1.1.0",
    status: checks.every((check) => check.pass) ? "PASS" : "FAIL",
    checks: checks.map((check) => Object.freeze(check)),
  });
}

export function runGovernance(workload, eligible, evaluation, audit, asOfDate, assumptions = []) {
  const workflowSteps = workload.primarySteps + workload.checkerSteps;
  const conditions = {
    noEligibleModel: eligible.length === 0,
    highRisk: workload.risk === "High",
    unknownRisk: workload.risk === "Unknown",
    unknownTask: workload.task === "Not sure",
    unknownRegulatoryStatus: assumptions.includes("regulated"),
    regulated: Boolean(workload.regulated),
    sensitiveData: ["Sensitive", "Protected", "Unknown"].includes(workload.dataSensitivity),
    staleCatalog: catalogAgeDays(asOfDate) > catalog.freshnessDays,
    assumptionsPresent: assumptions.length > 0,
    excessiveLoops: workflowSteps > 8,
    unsafeLoops: workflowSteps > 20,
    evaluationFailed: evaluation.status === "FAIL",
    auditMismatch: audit.status === "MISMATCH",
    unmeasuredCostBehavior: eligible.length > 0 && eligible.every((model) => model.costBehavior.evidence !== "MEASURED DISTRIBUTION"),
    budgetExceeded: workload.budget > 0 && eligible.length > 0 && eligible.every((model) => costFor(model, workload, "expected").perCompletedTask > workload.budget),
  };
  const findings = governance.rules.filter((rule) => conditions[rule.condition]);
  const status = findings.some((item) => item.severity === "BLOCK")
    ? "BLOCK"
    : findings.some((item) => item.severity === "REVIEW_REQUIRED")
      ? "REVIEW_REQUIRED"
      : findings.length
        ? "WARN"
        : "PASS";
  return Object.freeze({ version: governance.version, status, findings: findings.map((item) => Object.freeze({ ...item })) });
}

export function analyzeWorkload(input) {
  assertCostInputContract(input);
  const workload = Object.freeze({
    task: input.task,
    risk: input.risk,
    dataSensitivity: input.dataSensitivity,
    modality: input.modality,
    regulated: Boolean(input.regulated),
    requests: Math.max(1, Number(input.requests)),
    inputTokens: Math.max(1, Number(input.inputTokens)),
    responseSize: responseProfiles[input.responseSize] ? input.responseSize : "Detailed answer",
    cache: Math.min(100, Math.max(0, Number(input.cache))),
    primarySteps: Math.min(50, Math.max(1, Number(input.primarySteps))),
    checkerSteps: Math.min(10, Math.max(0, Number(input.checkerSteps))),
    budget: Math.max(0, Number(input.budget) || 0),
  });
  const required = Math.max(taskRequirements[workload.task] ?? 3, workload.risk === "High" ? 3 : workload.risk === "Medium" ? 2 : 1);
  const catalogEligible = models.filter((model) => model.modalities.includes(workload.modality) && workload.inputTokens <= model.contextTokens);
  const eligible = catalogEligible.filter((model) => model.recommendationReady && model.quality >= required);
  const ranked = eligible
    .map((model) => ({ model, expected: costFor(model, workload, "expected") }))
    .filter((candidate) => workload.budget === 0 || candidate.expected.perCompletedTask <= workload.budget)
    .sort((a, b) => a.expected.perCompletedTask - b.expected.perCompletedTask || a.model.id.localeCompare(b.model.id));
  const recommendation = ranked[0]?.model ?? null;
  const scenarios = recommendation ? Object.freeze({
    low: costFor(recommendation, workload, "low"),
    expected: costFor(recommendation, workload, "expected"),
    high: costFor(recommendation, workload, "high"),
  }) : null;
  const costEvaluation = recommendation ? runCostEvaluator({ rawInput: input, workload, model: recommendation, estimatedScenarios: scenarios }) : Object.freeze({ role: "Cost Evaluation Specialist", version: costContract.version, status: "NOT_EVALUATED", checks: [] });
  const evaluation = recommendation ? evaluateDecision(workload, recommendation, scenarios, costEvaluation) : Object.freeze({ version: "eval-1.1.0", status: "NOT_EVALUATED", checks: [] });
  const assumptions = Array.isArray(input.assumptions) ? [...input.assumptions].sort() : [];
  const audit = Object.freeze({
    version: "audit-1.1.0",
    status: recommendation && scenarios && costFor(recommendation, workload, "expected").perCompletedTask === scenarios.expected.perCompletedTask ? "MATCH" : recommendation ? "MISMATCH" : "NOT_RUN",
    catalogVersion: catalog.version,
    engineVersion: ENGINE_VERSION,
    inputHash: stableHash(workload),
  });
  const governanceResult = runGovernance(workload, eligible, evaluation, audit, input.asOfDate ?? catalog.sourceDate, assumptions);
  const disposition = governanceResult.status === "BLOCK" ? "BLOCKED" : governanceResult.status === "REVIEW_REQUIRED" ? "REVIEW_REQUIRED" : recommendation ? "READY_FOR_HUMAN_DECISION" : "BLOCKED";
  const providers = [...new Set(models.map((model) => model.provider))].sort();
  const evaluatedProviders = [...new Set(models.filter((model) => model.recommendationReady).map((model) => model.provider))].sort();
  const coverage = Object.freeze({ providers, evaluatedProviders, status: evaluatedProviders.length === providers.length ? "FULL" : "PARTIAL" });
  return Object.freeze({ workload, required, catalogEligible, eligible, ranked, recommendation, scenarios, costEvaluation, evaluation, governance: governanceResult, audit, assumptions, disposition, coverage, catalog });
}

function stableHash(value) {
  const text = JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function deterministicBrief(result) {
  if (!result.recommendation) return result.workload.budget > 0 && result.governance.findings.some((finding) => finding.id === "GOV-011")
    ? `No evidence-qualified model fits the $${result.workload.budget.toFixed(4)} cost-per-completed-task ceiling. Change the workflow, requirements, or ceiling and rerun.`
    : "No model in the current catalog clears the rule gates. Stop and escalate rather than force a choice.";
  const delta = result.ranked[1] ? result.ranked[1].expected.perCompletedTask - result.scenarios.expected.perCompletedTask : 0;
  const review = result.disposition === "REVIEW_REQUIRED" ? " Human review is mandatory before approval." : result.disposition === "BLOCKED" ? " The result is blocked until the listed findings are resolved." : " The human decision owner may now approve, edit and rerun, or record a permitted override with a reason.";
  const coverage = result.coverage.status === "PARTIAL" ? " This ranking covers the OpenAI policy-eligible heuristic baseline; Google and Anthropic are cost-visible but remain unranked until the same workload evaluation is run." : "";
  return `${result.recommendation.name} is the least expensive rule-eligible model in catalog ${result.catalog.version}. Likely token cost is $${result.scenarios.expected.perCompletedTask.toFixed(4)} per completed task, inside a $${result.scenarios.low.perCompletedTask.toFixed(4)}–$${result.scenarios.high.perCompletedTask.toFixed(4)} planning spread${delta > 0 ? `; the next eligible option costs $${delta.toFixed(4)} more per task` : ""}. Output length and retries are model-profile assumptions, not guarantees.${coverage}${review}`;
}
