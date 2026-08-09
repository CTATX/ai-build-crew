import assert from "node:assert/strict";
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
  assert.match(html, /Release candidate · 03/);
  assert.match(html, /1\.3/);
  assert.match(html, /What are you thinking about building/);
  assert.match(html, /Uses per day/);
  assert.match(html, /Result needed/);
  assert.match(html, /Checker steps/);
  assert.match(html, /cost-per-completed-task range/);
  assert.match(html, /AI_Build_Crew_Agentic_AI_PRD_COST_CONTRACT\.xlsx/);
  assert.match(html, /AI_BUILD_CREW_COST_CONTRACT_VIDEO_REVIEW\.pptx/);
  assert.doesNotMatch(html, /Answer coming back/);
  assert.match(html, /Guide me to an estimate/);
  assert.match(html, /GPT-5\.6 Luna/);
  assert.doesNotMatch(html, /Your site is taking shape/);
});
