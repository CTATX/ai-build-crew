import catalog from "../data/model-catalog.v1.json" with { type: "json" };
import { inventoryAssistantCases } from "../fixtures/provider-evaluation/inventory-assistant.cases.mjs";
import { freezeEvaluationRequest, stableHash } from "./provider-platform.mjs";

export const OPENAI_PREVIEW_VERSION = "openai-preview-runner-1.1.0";
export const OPENAI_PREVIEW_MODEL = "gpt-5.6-terra";
export const OPENAI_PREVIEW_MAX_OUTPUT_TOKENS = 300;

function round(value, digits = 8) {
  const power = 10 ** digits;
  return Math.round((value + Number.EPSILON) * power) / power;
}

function modelRecord(modelId) {
  const model = catalog.models.find((candidate) => candidate.id === modelId && candidate.provider === "OpenAI");
  if (!model) throw new Error("OPENAI-RUN-001: model is not in the reviewed OpenAI catalog");
  return model;
}

function approximateInputTokens(text) {
  return Math.ceil(text.length / 4);
}

export function predictedMaximumCharge({ modelId = OPENAI_PREVIEW_MODEL, cases = inventoryAssistantCases, maxOutputTokens = OPENAI_PREVIEW_MAX_OUTPUT_TOKENS } = {}) {
  const model = modelRecord(modelId);
  const inputTokens = cases.reduce((sum, item) => sum + approximateInputTokens(item.input), 0);
  return round((inputTokens * model.input + cases.length * maxOutputTokens * model.output) / 1_000_000);
}

function responseText(response) {
  return (response.output ?? []).flatMap((item) => item.content ?? []).filter((item) => item.type === "output_text").map((item) => item.text ?? "").join("\n").trim();
}

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

function usageFrom(response) {
  const usage = response.usage ?? {};
  return Object.freeze({
    inputTokens: Number(usage.input_tokens ?? 0),
    cachedInputTokens: Number(usage.input_tokens_details?.cached_tokens ?? 0),
    outputTokens: Number(usage.output_tokens ?? 0),
    reasoningTokens: usage.output_tokens_details?.reasoning_tokens == null ? null : Number(usage.output_tokens_details.reasoning_tokens),
    toolCalls: 0,
  });
}

function calculatedCharge(model, usage) {
  const uncached = Math.max(0, usage.inputTokens - usage.cachedInputTokens);
  return round((uncached * model.input + usage.cachedInputTokens * model.cached + usage.outputTokens * model.output) / 1_000_000);
}

export async function runOpenAIPreview({ apiKey, ceilingUsd = 1, fetchImpl = fetch, cases = inventoryAssistantCases, modelId = OPENAI_PREVIEW_MODEL } = {}) {
  if (!apiKey) throw new Error("OPENAI-RUN-002: server credential is unavailable");
  if (!(ceilingUsd > 0 && ceilingUsd <= 1)) throw new Error("OPENAI-RUN-003: preview ceiling must be greater than $0 and no more than $1");
  const predictedMaximumUsd = predictedMaximumCharge({ modelId, cases });
  if (predictedMaximumUsd > ceilingUsd) throw new Error("OPENAI-RUN-004: predicted maximum exceeds the approved ceiling");
  const model = modelRecord(modelId);
  const workloadHash = stableHash(cases.map(({ id, input, requiredTerms }) => ({ id, input, requiredTerms })));
  const frozenRequest = freezeEvaluationRequest({
    level: "preview",
    workloadHash,
    modelIds: [modelId],
    caseIds: cases.map((item) => item.id),
    scoringRubricId: "required-terms-v1",
  });
  const started = Date.now();
  const results = [];
  let calculatedSpendUsd = 0;

  for (const evaluationCase of cases) {
    if (calculatedSpendUsd >= ceilingUsd) throw new Error("OPENAI-RUN-005: hard-dollar circuit breaker reached");
    const caseStarted = Date.now();
    const response = await fetchImpl("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: modelId,
        input: evaluationCase.input,
        max_output_tokens: OPENAI_PREVIEW_MAX_OUTPUT_TOKENS,
        reasoning: { effort: "none" },
        store: false,
      }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      const failure = await response.json().catch(() => ({}));
      throw new Error(`OPENAI-RUN-006: provider request failed (${response.status}${failure?.error?.code ? ` ${failure.error.code}` : ""})`);
    }
    const payload = await response.json();
    const text = responseText(payload);
    const usage = usageFrom(payload);
    const calculatedUsd = calculatedCharge(model, usage);
    calculatedSpendUsd = round(calculatedSpendUsd + calculatedUsd);
    if (calculatedSpendUsd > ceilingUsd) throw new Error("OPENAI-RUN-007: calculated spend exceeded the approved ceiling");
    const passedTerms = evaluationCase.requiredTerms.filter((term) => text.toLowerCase().includes(term.toLowerCase()));
    const missingTerms = evaluationCase.requiredTerms.filter((term) => !passedTerms.includes(term));
    results.push(Object.freeze({
      contractVersion: "provider-run-result-1.0.0",
      provider: "OpenAI",
      modelId,
      requestHash: frozenRequest.requestHash,
      workloadHash,
      caseId: evaluationCase.id,
      status: "SUCCEEDED",
      usage,
      latencyMs: Date.now() - caseStarted,
      retryCount: 0,
      evaluation: Object.freeze({
        rubricVersion: "required-facts-1.0.0",
        passed: missingTerms.length === 0,
        checksPassed: passedTerms.length,
        checksRequired: evaluationCase.requiredTerms.length,
        missingChecks: Object.freeze(missingTerms),
      }),
      charge: Object.freeze({ currency: "USD", providerReportedUsd: null, calculatedUsd, reconciliationStatus: "PROVIDER_CHARGE_UNAVAILABLE" }),
      retention: Object.freeze({ rawPromptStored: false, rawOutputStored: false, outputHash: await sha256(text) }),
    }));
  }

  return Object.freeze({
    runnerVersion: OPENAI_PREVIEW_VERSION,
    modelId,
    fixtureId: "INVENTORY-ASSISTANT-PREVIEW-001",
    requestHash: frozenRequest.requestHash,
    workloadHash,
    predictedMaximumUsd,
    calculatedSpendUsd,
    ceilingUsd,
    durationMs: Date.now() - started,
    casesPassed: results.filter((item) => item.evaluation.passed).length,
    casesRun: results.length,
    results: Object.freeze(results),
    contentRetention: "HASH_ONLY",
  });
}
