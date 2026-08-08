# AI Build Crew v0.1.0 — Audited Release Record

Release date: August 8, 2026  
Source commit: `cd7a8282a6964a049221e31c9682f8dd694d7efe`  
Audit status: **Source and GitHub Pages release; Sites deployment incomplete**

## Honest release statement

v0.1.0 placed the governed Alpha source, static artifact hub, requirements, evaluation evidence, and presentation materials in GitHub. The source included a prompt-first intake and governed deterministic estimator. The public Sites runtime was not redeployed from that commit and therefore continued to show the earlier Alpha 01 three-model calculator.

## What the v0.1.0 source contained

- A free-text workload prompt with known-workload, guided, and safe-example routes.
- Editable requests/day, input and output tokens/call, cached-input percentage, model calls/request, and an optional monthly budget.
- Deterministic low/expected/high token-cost scenarios.
- A dated eight-model catalog spanning OpenAI, Google, and Anthropic.
- OpenAI-only recommendation evidence; Google and Anthropic were cost-visible and held out of ranking.
- Logically separate estimate, evaluation, audit, governance, and human-decision outputs within one deterministic engine.
- Fail-closed findings for unsupported modality, stale catalog, unsafe loops, unknown/sensitive data, high-risk work, failed checks, and budget conflict.
- Ten automated checks: nine decision/governance tests and one rendered-app smoke test.
- PRDs, workbook, workflow, governance specification, evaluation report, backlog, six-slide presentation, and demo script.

## What was not delivered in v0.1.0

- The governed experience on Sites production.
- A synchronized custom-domain deployment.
- Automated live price or provider inventory refresh.
- Measured Google or Anthropic workload evaluations.
- Independent deployed agents.
- Saved forecasts, decision history, price history, or actual-cost tracking.
- Full application-development or infrastructure cost estimation.

## Drift classification

| Claim area | Audit result | Correction |
|---|---|---|
| Prompt-first intake | Retained in source; absent on Sites | State the channel explicitly |
| Three-provider comparison | Retained as catalog visibility | Do not call it cross-provider ranking |
| Independent stages | Weakened by wording | They are separate deterministic outputs, not deployed agents |
| Production verification | Unsupported for Sites | Separate build evidence from deployment evidence |
| GitHub Pages artifacts | Retained | Page existed, but linked main content and copy later drifted |
| Human ownership | Retained | Productized language now uses a generic human decision owner |

## Rollback evidence

The immutable baseline tag `alpha-baseline-2026-08-08` preserves this source state.
