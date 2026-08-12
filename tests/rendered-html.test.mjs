import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the AI Build Crew estimator", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /AI Build Crew/);
  assert.match(html, /Pick the right model/);
  assert.match(html, /Know the cost/);
  assert.match(html, /Describe what you want to build/);
  assert.match(html, /Get a model starting point/);
  assert.match(html, /Phase 2 · guided/);
  assert.doesNotMatch(html, /01 \/ START WITH WHAT YOU KNOW/);
  assert.doesNotMatch(html, /ABOUT THE LAB/);
  assert.match(html, /1\.3/);
  assert.match(html, /Describe one ideal starting task/);
  assert.match(html, /Uses per day/);
  assert.match(html, /Result needed/);
  assert.match(html, /Checker steps/);
  assert.match(html, /cost-per-completed-task range/);
  assert.doesNotMatch(html, /REVIEW THE EVIDENCE/);
  assert.doesNotMatch(html, /AI_Build_Crew_Agentic_AI_PRD_COST_CONTRACT\.xlsx/);
  assert.doesNotMatch(html, /Answer coming back/);
  assert.match(html, /Guide me conversationally/);
  assert.match(html, /Product guided/);
  assert.match(html, /Advanced builder/);
  assert.match(html, /Describe one ideal starting task/);
  assert.match(html, /Describe an average day/);
  assert.match(html, /Impact if the model fails/);
  assert.match(html, /Point-in-time decision report/);
  assert.match(html, /Download point-in-time report/);
  assert.doesNotMatch(html, /Human decision gate/);
  assert.match(html, /AI Build Crew calculates the cost twice using fixed rules/);
  assert.doesNotMatch(html, /Independent deployed LLM agents remain future work/);
  assert.match(html, /GPT-5\.6 Luna/);
  assert.doesNotMatch(html, /Your site is taking shape/);
});

test("guided intake scopes formats to one model step", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /What formats appear in the typical task\?/);
  assert.match(source, /Select every format involved in the typical task\./);
  assert.doesNotMatch(source, /Which formats must the workflow understand\?/);
});

test("product-guided intake derives tokens and context instead of asking for them", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /How much information goes into one typical task\?/);
  assert.match(source, /you do not need to estimate tokens or a context window/);
  assert.match(source, /Planning input range:/);
  assert.match(source, /Likely context need:/);
  assert.match(source, /Technical assumptions/);
  assert.match(source, /Short message or form/);
  assert.match(source, /Many documents or code/);
  assert.match(source, /What should a successful result look like\?/);
  assert.match(source, /Completed tasks per day/);
});

test("renders the approval-gated comparative model analysis page", async () => {
  const response = await render("/compare");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Compare the facts/);
  assert.match(html, /Measure the rest/);
  assert.match(html, /LIVE EVALUATION/);
  assert.match(html, /\$0 · approval required/);
  assert.match(html, /Gemini 3\.6 Flash/);
  assert.match(html, /Claude Opus 5/);
  assert.match(html, /Review controlled preview/);
  assert.match(html, /Your idea is not the database/);
  assert.match(html, /OpenAI preview ready/);
  assert.match(html, /\$1 hard ceiling/);
  assert.match(html, /Start with your idea/);
  assert.match(html, /href="\/#intake"/);
  assert.match(html, /Not sure what to compare yet/);
});

test("paid provider route is policy-locked and owner-restricted", async () => {
  const source = await readFile(new URL("../app/api/evaluations/openai/route.ts", import.meta.url), "utf8");
  assert.match(source, /liveEvaluationPolicy\.executionEnabled/);
  assert.match(source, /PHASE2_PREVIEW_ALLOWED_ACCOUNT_USER_IDS/);
  assert.match(source, /OWNER_APPROVAL_REQUIRED/);
  assert.match(source, /ownerIds\.has\(authenticatedUser\.userId\)/);
});
