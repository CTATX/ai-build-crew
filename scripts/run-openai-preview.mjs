import { runOpenAIPreview } from "../lib/openai-preview-runner.mjs";

const result = await runOpenAIPreview({ apiKey: process.env.OPENAI_API_KEY, ceilingUsd: 1 });
console.log(JSON.stringify({
  fixtureId: result.fixtureId,
  modelId: result.modelId,
  predictedMaximumUsd: result.predictedMaximumUsd,
  calculatedSpendUsd: result.calculatedSpendUsd,
  ceilingUsd: result.ceilingUsd,
  casesPassed: result.casesPassed,
  casesRun: result.casesRun,
  contentRetention: result.contentRetention,
  requestHash: result.requestHash,
  workloadHash: result.workloadHash,
  results: result.results.map((item) => ({ caseId: item.caseId, usage: item.usage, evaluation: item.evaluation, charge: item.charge, status: item.status, outputHash: item.retention.outputHash })),
}, null, 2));
