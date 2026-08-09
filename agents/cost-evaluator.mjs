import contract from "../config/cost-estimation-rules.v1.json" with { type: "json" };

const scenarios = Object.freeze(["low", "expected", "high"]);

function ordered(values) {
  return values.every((value) => Number.isFinite(value)) && values[0] <= values[1] && values[1] <= values[2];
}

function round(value, digits = 8) {
  const power = 10 ** digits;
  return Math.round((value + Number.EPSILON) * power) / power;
}

// Independent ledger used by the cost specialist. It intentionally does not
// call the estimator's costFor function, so a shared formula defect is visible.
function independentCost(model, workload, scenario) {
  const baseTokens = contract.responseProfiles[workload.responseSize].baseTokens;
  const outputMultiplier = model.costBehavior.outputMultiplier[scenario];
  const retryMultiplier = model.costBehavior.retryMultiplier[scenario];
  const outputTokens = baseTokens * outputMultiplier;
  const checkerOutputTokens = Math.max(50, baseTokens * contract.checkerOutputShare * outputMultiplier);
  const cachedTokens = workload.inputTokens * (workload.cache / 100);
  const uncachedTokens = workload.inputTokens - cachedTokens;
  const primary = ((uncachedTokens * model.input) + (cachedTokens * model.cached) + (outputTokens * model.output)) / 1_000_000;
  const checker = (((workload.inputTokens + outputTokens) * model.input) + (checkerOutputTokens * model.output)) / 1_000_000;
  return round(retryMultiplier * ((workload.primarySteps * primary) + (workload.checkerSteps * checker)));
}

export function runCostEvaluator({ rawInput, workload, model, estimatedScenarios }) {
  const outputProfile = scenarios.map((scenario) => model.costBehavior?.outputMultiplier?.[scenario]);
  const retryProfile = scenarios.map((scenario) => model.costBehavior?.retryMultiplier?.[scenario]);
  const checks = [
    { id: "COST-001", pass: !Object.hasOwn(rawInput, "outputTokens"), evidence: "The normalized workload contains no user-authored output-token value." },
    { id: "COST-002", pass: ordered(outputProfile), evidence: `Output multipliers: ${outputProfile.join(" / ")}` },
    { id: "COST-003", pass: ordered(retryProfile) && retryProfile.every((value) => value >= 1), evidence: `Retry multipliers: ${retryProfile.join(" / ")}` },
    { id: "COST-004", pass: workload.primarySteps >= 1 && workload.checkerSteps >= 0 && estimatedScenarios.expected.attemptedCallsPerTask >= workload.primarySteps + workload.checkerSteps, evidence: `${workload.primarySteps} primary + ${workload.checkerSteps} checker steps; ${estimatedScenarios.expected.attemptedCallsPerTask} likely attempted calls.` },
    { id: "COST-005", pass: scenarios.every((scenario) => Number.isFinite(estimatedScenarios[scenario].perCompletedTask)) && !Object.hasOwn(estimatedScenarios.expected, "perRequest"), evidence: "All scenarios expose cost per completed task as the primary unit." },
    { id: "COST-006", pass: estimatedScenarios.low.perCompletedTask <= estimatedScenarios.expected.perCompletedTask && estimatedScenarios.expected.perCompletedTask <= estimatedScenarios.high.perCompletedTask, evidence: "Low, likely, and high costs are ordered." },
    ...scenarios.map((scenario) => ({
      id: `COST-AUDIT-${scenario.toUpperCase()}`,
      pass: independentCost(model, workload, scenario) === estimatedScenarios[scenario].perCompletedTask,
      evidence: `Independent ${scenario} ledger matches the frozen estimator output.`,
    })),
  ];
  return Object.freeze({
    role: "Cost Evaluation Specialist",
    version: contract.version,
    status: checks.every((check) => check.pass) ? "PASS" : "FAIL",
    checks: checks.map((check) => Object.freeze(check)),
  });
}

export function assertCostInputContract(rawInput) {
  if (Object.hasOwn(rawInput, "outputTokens")) {
    throw new TypeError("COST-001: outputTokens is a model-behavior property and is forbidden as workload input.");
  }
}
