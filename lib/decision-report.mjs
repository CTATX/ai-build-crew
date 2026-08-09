function dollars(value) {
  return `$${Number(value).toFixed(4)}`;
}

export function buildDecisionReport({ generatedAt, idea, result, activeModel, activeScenarios, comparisonOnly, decision, decisionNote, assumptions }) {
  const findings = result.governance.findings.length
    ? result.governance.findings.map((finding) => `- ${finding.id} · ${finding.severity}: ${finding.message}`).join("\n")
    : "- PASS: No governance exception detected.";
  const assumptionList = assumptions.length ? assumptions.map((item) => `- ${item}`).join("\n") : "- None recorded; workload values were user-confirmed.";
  const evidenceStatus = comparisonOnly ? "CATALOG ONLY — NOT EVALUATED" : `${result.costEvaluation.status} / ${result.audit.status} / ${result.governance.status}`;
  const modelSection = activeModel && activeScenarios ? `- Model shown: ${activeModel.name} (${activeModel.provider})
- Evidence boundary: ${comparisonOnly ? "Published catalog comparison only; this model has not passed the shared workload evaluation." : "Policy-eligible heuristic baseline with deterministic cost evaluation and audit."}
- Low cost per completed task: ${dollars(activeScenarios.low.perCompletedTask)}
- Likely cost per completed task: ${dollars(activeScenarios.expected.perCompletedTask)}
- High cost per completed task: ${dollars(activeScenarios.high.perCompletedTask)}
- Likely monthly token cost at planned volume: ${dollars(activeScenarios.expected.monthlyAtPlannedVolume)}
- Likely output tokens per primary call: ${activeScenarios.expected.outputTokensPerPrimary}
- Likely retry multiplier: ${activeScenarios.expected.retryMultiplier.toFixed(2)}x
- Likely charged calls per completed task: ${activeScenarios.expected.attemptedCallsPerTask.toFixed(2)}` : `- Model shown: None
- Evidence boundary: No evaluated model passed every capability and evidence gate.
- Cost: Not emitted. A fallback model cost would be misleading.
- Catalog-capable candidates pending evaluation: ${result.catalogEligible.map((model) => model.name).join(", ") || "None in the current catalog"}`;

  return `# AI Build Crew — Point-in-Time Model Assessment

- Generated: ${generatedAt}
- Project idea: ${idea.trim() || "Not supplied"}
- Decision status: ${decision}
- Evidence status: ${evidenceStatus}

## Workload snapshot

- Work to perform: ${result.workload.task}
- Consequence of failure: ${result.workload.risk}
- Data class: ${result.workload.dataSensitivity}
- Required formats: ${result.workload.modalities.join(", ")}
- Uses per day: ${result.workload.requests}
- Input tokens per primary call: ${result.workload.inputTokens}
- Primary AI steps: ${result.workload.primarySteps}
- Checker steps: ${result.workload.checkerSteps}
- Reusable input: ${result.workload.cache}%

## Model and cost snapshot

${modelSection}

## Assumptions still visible

${assumptionList}

## Evaluation, audit, and governance

- Cost evaluation: ${comparisonOnly ? "NOT RUN" : result.costEvaluation.status}
- Audit: ${comparisonOnly ? "NOT RUN" : result.audit.status}
- Governance: ${comparisonOnly ? "NOT APPLIED" : result.governance.status}
- Final disposition: ${comparisonOnly ? "NOT EVALUATED" : result.disposition}

${comparisonOnly ? "- Catalog facts do not transfer baseline evaluation or governance evidence to this model." : findings}

## Decision record

- Status: ${decision}
- Note: ${decisionNote.trim() || "No note supplied."}

## Reproducibility

- Catalog: ${result.catalog.version}
- Cost contract: ${result.costEvaluation.version}
- Engine: ${result.audit.engineVersion}
- Input hash: ${result.audit.inputHash}

## Coverage boundary

This report estimates cataloged model-token charges. It does not include development labor, hosting, databases, retrieval, storage, provider tool fees, monitoring, or human review. Output length and retry behavior are versioned planning profiles until measured workload evidence replaces them.
`;
}
