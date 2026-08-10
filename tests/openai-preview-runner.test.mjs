import assert from "node:assert/strict";
import test from "node:test";
import { predictedMaximumCharge, runOpenAIPreview } from "../lib/openai-preview-runner.mjs";

function mockFetch(url, options) {
  assert.equal(url, "https://api.openai.com/v1/responses");
  assert.match(options.headers.authorization, /^Bearer /);
  const request = JSON.parse(options.body);
  assert.equal(request.store, false);
  assert.equal(request.max_output_tokens, 300);
  const text = request.input.includes("000104") ? "ALT-104 is in stock in BIN-A3 with quantity 2." : request.input.includes("BC-220") ? "BC-220 is unavailable in BIN-C7; order the part." : "WP-082 is available in SHELF-B2 with quantity 4.";
  return Promise.resolve(new Response(JSON.stringify({
    output: [{ type: "message", content: [{ type: "output_text", text }] }],
    usage: { input_tokens: 80, input_tokens_details: { cached_tokens: 0 }, output_tokens: 18, output_tokens_details: { reasoning_tokens: 0 } },
  }), { status: 200, headers: { "content-type": "application/json" } }));
}

test("OpenAI preview predicts a bounded maximum below the one-dollar policy", () => {
  const predicted = predictedMaximumCharge();
  assert.ok(predicted > 0);
  assert.ok(predicted < 1);
});

test("OpenAI preview sends only synthetic cases and retains hashes rather than content", async () => {
  const result = await runOpenAIPreview({ apiKey: "test-key-not-real", ceilingUsd: 1, fetchImpl: mockFetch });
  assert.equal(result.casesRun, 3);
  assert.equal(result.casesPassed, 3);
  assert.ok(result.calculatedSpendUsd < result.ceilingUsd);
  assert.equal(result.contentRetention, "HASH_ONLY");
  assert.ok(result.results.every((item) => item.retention.rawPromptStored === false && item.retention.rawOutputStored === false));
  assert.ok(result.results.every((item) => typeof item.retention.outputHash === "string" && item.retention.outputHash.length === 64));
  assert.doesNotMatch(JSON.stringify(result), /ALT-104 is in stock|water pump kit/i);
});

test("OpenAI preview stops ceilings outside the locked policy", async () => {
  await assert.rejects(() => runOpenAIPreview({ apiKey: "test", ceilingUsd: 0, fetchImpl: mockFetch }), /OPENAI-RUN-003/);
  await assert.rejects(() => runOpenAIPreview({ apiKey: "test", ceilingUsd: 1.01, fetchImpl: mockFetch }), /OPENAI-RUN-003/);
  await assert.rejects(() => runOpenAIPreview({ apiKey: "test", ceilingUsd: 0.001, fetchImpl: mockFetch }), /OPENAI-RUN-004/);
});

test("OpenAI preview reports provider credit exhaustion without retrying", async () => {
  let calls = 0;
  const exhausted = async () => {
    calls += 1;
    return new Response(JSON.stringify({ error: { code: "credit_balance_exhausted" } }), { status: 429, headers: { "content-type": "application/json" } });
  };
  await assert.rejects(() => runOpenAIPreview({ apiKey: "test", ceilingUsd: 1, fetchImpl: exhausted }), /429 credit_balance_exhausted/);
  assert.equal(calls, 1);
});
