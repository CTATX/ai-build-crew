import catalog from "../data/model-catalog.v1.json" with { type: "json" };
import governance from "../governance/absolute-rules.v1.json" with { type: "json" };

export const ENGINE_VERSION = "decision-engine-1.1.0";

export const taskRequirements = Object.freeze({
  "Classification & extraction": 1,
  "Content & summarization": 1,
  "Product analysis": 2,
  "Coding & agent workflow": 2,
  "Complex reasoning": 3,
});

export const models = Object.freeze(catalog.models.map((model) => Object.freeze({ ...model })));

function round(value, digits = 8) {
  const power = 10 ** digits;
  return Math.round((value + Number.EPSILON) * power) / power;
}

export function costFor(model, workload, factor = 1) {
  const requests = workload.requests * factor;
  const inputTokens = workload.inputTokens;
  const outputTokens = workload.outputTokens;
  const calls = Math.max(1, workload.calls);
  const cachedTokens = inputTokens * (workload.cache / 100);
  const uncachedTokens = inputTokens - cachedTokens;
  const perRequest = calls * ((uncachedTokens * model.input + cachedTokens * model.cached + outputTokens * model.output) / 1_000_000);
  return Object.freeze({
    perRequest: round(perRequest),
    monthly: round(perRequest * requests * 30),
    annual: round(perRequest * requests * 365),
  });
}

function catalogAgeDays(asOfDate) {
  const start = new Date(`${catalog.sourceDate}T00:00:00Z`).getTime();
  const end = new Date(`${asOfDate}T00:00:00Z`).getTime();
  return Math.floor((end - start) / 86_400_000);
}

export function evaluateDecision(workload, recommendation, scenarios) {
  const checks = [
    { id: "EVAL-001", name: "Expected cost is reproducible", pass: costFor(recommendation, workload, 1).monthly === scenarios.expected.monthly },
    { id: "EVAL-002", name: "Scenario costs are ordered", pass: scenarios.low.monthly <= scenarios.expected.monthly && scenarios.expected.monthly <= scenarios.high.monthly },
    { id: "EVAL-003", name: "Recommendation supports modality", pass: recommendation.modalities.includes(workload.modality) },
    { id: "EVAL-004", name: "Recommendation clears rule quality", pass: recommendation.quality >= Math.max(taskRequirements[workload.task] ?? 3, workload.risk === "High" ? 3 : workload.risk === "Medium" ? 2 : 1) },
  ];
  return Object.freeze({
    version: "eval-1.0.0",
    status: checks.every((check) => check.pass) ? "PASS" : "FAIL",
    checks: checks.map((check) => Object.freeze(check)),
  });
}

export function runGovernance(workload, eligible, evaluation, audit, asOfDate, assumptions = []) {
  const conditions = {
    noEligibleModel: eligible.length === 0,
    highRisk: workload.risk === "High",
    regulated: Boolean(workload.regulated),
    sensitiveData: ["Sensitive", "Protected", "Unknown"].includes(workload.dataSensitivity),
    staleCatalog: catalogAgeDays(asOfDate) > catalog.freshnessDays,
    assumptionsPresent: assumptions.length > 0,
    excessiveLoops: workload.calls > 8,
    unsafeLoops: workload.calls > 20,
    evaluationFailed: evaluation.status === "FAIL",
    auditMismatch: audit.status === "MISMATCH",
    budgetExceeded: workload.budget > 0 && eligible.length > 0 && eligible.every((model) => costFor(model, workload, 1).monthly > workload.budget),
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
  const workload = Object.freeze({
    task: input.task,
    risk: input.risk,
    dataSensitivity: input.dataSensitivity,
    modality: input.modality,
    regulated: Boolean(input.regulated),
    requests: Number(input.requests),
    inputTokens: Number(input.inputTokens),
    outputTokens: Number(input.outputTokens),
    cache: Number(input.cache),
    calls: Number(input.calls),
    budget: Math.max(0, Number(input.budget) || 0),
  });
  const required = Math.max(taskRequirements[workload.task] ?? 3, workload.risk === "High" ? 3 : workload.risk === "Medium" ? 2 : 1);
  const catalogEligible = models.filter((model) => model.modalities.includes(workload.modality) && workload.inputTokens <= model.contextTokens);
  const eligible = catalogEligible.filter((model) => model.recommendationReady && model.quality >= required);
  const ranked = eligible.map((model) => ({ model, expected: costFor(model, workload, 1) })).filter((candidate) => workload.budget === 0 || candidate.expected.monthly <= workload.budget).sort((a, b) => a.expected.monthly - b.expected.monthly || a.model.id.localeCompare(b.model.id));
  const recommendation = ranked[0]?.model ?? null;
  const scenarios = recommendation ? Object.freeze({ low: costFor(recommendation, workload, 0.75), expected: costFor(recommendation, workload, 1), high: costFor(recommendation, workload, 1.35) }) : null;
  const evaluation = recommendation ? evaluateDecision(workload, recommendation, scenarios) : Object.freeze({ version: "eval-1.0.0", status: "NOT_EVALUATED", checks: [] });
  const assumptions = Array.isArray(input.assumptions) ? [...input.assumptions].sort() : [];
  const audit = Object.freeze({
    version: "audit-1.0.0",
    status: recommendation && scenarios && costFor(recommendation, workload, 1).monthly === scenarios.expected.monthly ? "MATCH" : recommendation ? "MISMATCH" : "NOT_RUN",
    catalogVersion: catalog.version,
    engineVersion: ENGINE_VERSION,
    inputHash: stableHash(workload),
  });
  const governanceResult = runGovernance(workload, eligible, evaluation, audit, input.asOfDate ?? catalog.sourceDate, assumptions);
  const disposition = governanceResult.status === "BLOCK" ? "BLOCKED" : governanceResult.status === "REVIEW_REQUIRED" ? "REVIEW_REQUIRED" : recommendation ? "READY_FOR_CT_DECISION" : "BLOCKED";
  const providers = [...new Set(models.map((model) => model.provider))].sort();
  const evaluatedProviders = [...new Set(models.filter((model) => model.recommendationReady).map((model) => model.provider))].sort();
  const coverage = Object.freeze({ providers, evaluatedProviders, status: evaluatedProviders.length === providers.length ? "FULL" : "PARTIAL" });
  return Object.freeze({ workload, required, catalogEligible, eligible, ranked, recommendation, scenarios, evaluation, governance: governanceResult, audit, assumptions, disposition, coverage, catalog });
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
  if (!result.recommendation) return result.workload.budget > 0 && result.governance.findings.some((finding) => finding.id === "GOV-011") ? `No evidence-qualified model fits the $${result.workload.budget.toFixed(2)} monthly ceiling. Change the workload, requirements, or budget and rerun.` : "No model in the current catalog clears the rule gates. Stop and escalate rather than force a choice.";
  const delta = result.ranked[1] ? result.ranked[1].expected.monthly - result.scenarios.expected.monthly : 0;
  const review = result.disposition === "REVIEW_REQUIRED" ? " Human review is mandatory before approval." : result.disposition === "BLOCKED" ? " The result is blocked until the listed findings are resolved." : " CT may now approve, edit and rerun, or override with a recorded reason.";
  const coverage = result.coverage.status === "PARTIAL" ? " This ranking covers the evaluated OpenAI baseline; Google and Anthropic are cost-visible but remain unranked until the same workload eval is run." : "";
  return `${result.recommendation.name} is the least expensive rule-eligible model in catalog ${result.catalog.version}. Expected token cost is $${result.scenarios.expected.monthly.toFixed(2)} per month${delta > 0 ? `; the next eligible option costs $${delta.toFixed(2)} more` : ""}.${coverage}${review}`;
}
