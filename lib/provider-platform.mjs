import catalog from "../data/model-catalog.v1.json" with { type: "json" };
import policy from "../config/live-evaluation-policy.v1.json" with { type: "json" };

export const PROVIDER_PLATFORM_VERSION = "provider-platform-0.1.0";
export const liveEvaluationPolicy = Object.freeze(policy);

export function stableHash(value) {
  const text = JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildCatalogComparison({ providers = [], modalities = [], minimumContext = 0 } = {}) {
  const providerSet = new Set(providers);
  const requiredFormats = [...new Set(modalities)].sort();
  return Object.freeze(catalog.models
    .filter((model) => providerSet.size === 0 || providerSet.has(model.provider))
    .filter((model) => requiredFormats.every((format) => model.modalities.includes(format)))
    .filter((model) => model.contextTokens >= minimumContext)
    .map((model) => Object.freeze({
      id: model.id,
      provider: model.provider,
      name: model.name,
      lane: model.lane,
      inputPerMillion: model.input,
      cachedInputPerMillion: model.cached,
      outputPerMillion: model.output,
      contextTokens: model.contextTokens,
      modalities: Object.freeze([...model.modalities]),
      tools: Object.freeze([...model.tools]),
      availability: model.availability,
      evidenceStatus: model.evidenceStatus,
      sourceDate: model.sourceDate,
      pricingNotes: model.pricingNotes,
      recommendationReady: model.recommendationReady,
    })));
}

export function freezeEvaluationRequest(input) {
  if (input.idea || input.rawPrompt || input.rawOutput) throw new Error("PRIVACY-001: raw idea, prompt, or output cannot enter the frozen run contract");
  const levelName = input.level ?? "preview";
  const limits = policy.levels[levelName];
  if (!limits || levelName === "catalog") throw new Error("RUN-001: live evaluation requires a bounded execution level");
  const modelIds = [...new Set(input.modelIds ?? [])].sort();
  const caseIds = [...new Set(input.caseIds ?? [])].sort();
  if (!modelIds.length || modelIds.length > limits.models) throw new Error(`RUN-002: ${levelName} permits 1-${limits.models} models`);
  if (!caseIds.length || caseIds.length > limits.cases) throw new Error(`RUN-003: ${levelName} permits 1-${limits.cases} cases`);
  for (const modelId of modelIds) if (!catalog.models.some((model) => model.id === modelId)) throw new Error(`RUN-004: unknown model ${modelId}`);
  const frozen = {
    platformVersion: PROVIDER_PLATFORM_VERSION,
    policyVersion: policy.version,
    catalogVersion: catalog.version,
    level: levelName,
    workloadHash: input.workloadHash,
    modelIds,
    caseIds,
    scoringRubricId: input.scoringRubricId,
    limits: {
      maxSpendUsd: limits.maxSpendUsd,
      maxConcurrency: limits.maxConcurrency,
      maxRetries: limits.maxRetries,
      repeats: limits.repeats,
    },
    retention: {
      rawIdea: false,
      rawPrompts: false,
      rawOutputs: false,
      aggregateUsage: true,
    },
  };
  return Object.freeze({ ...frozen, requestHash: stableHash(frozen) });
}

export function planMockProviderRuns(frozenRequest) {
  return Object.freeze(frozenRequest.modelIds.map((modelId) => {
    const model = catalog.models.find((candidate) => candidate.id === modelId);
    return Object.freeze({
      provider: model.provider,
      modelId,
      requestHash: frozenRequest.requestHash,
      workloadHash: frozenRequest.workloadHash,
      caseIds: frozenRequest.caseIds,
      scoringRubricId: frozenRequest.scoringRubricId,
      limits: frozenRequest.limits,
      status: "MOCK_ONLY",
      networkAllowed: false,
    });
  }));
}

export function catalogReadiness() {
  const providers = [...new Set(catalog.models.map((model) => model.provider))].sort();
  const evaluatedProviders = [...new Set(catalog.models.filter((model) => model.recommendationReady).map((model) => model.provider))].sort();
  return Object.freeze({
    catalogVersion: catalog.version,
    sourceDate: catalog.sourceDate,
    providers,
    modelCount: catalog.models.length,
    evaluatedProviders,
    liveEvaluation: policy.executionEnabled ? "ENABLED" : "LOCKED",
  });
}
