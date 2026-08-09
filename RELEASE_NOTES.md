# AI Build Crew v0.2.0-rc.3 — Governed Cost Contract

Prepared and release-audited: August 9, 2026

Developed by [BadLabz.com](https://badlabz.com)

## Why this release matters

Evaluation found that the earlier estimator treated output tokens as a user workload input, held generation length constant across unlike model tiers, and allowed one call per request to hide retries and checker cost. That produced false precision in a monthly number.

This candidate corrects the decision contract. The user describes the result needed and the workflow steps. Each model supplies an evidence-labeled low, likely, and high output/retry profile. AI Build Crew reports and ranks low, likely, and high **cost per completed task**, with monthly volume shown only as secondary scale context.

## What changed

- Removed output tokens as a user input; COST-001 rejects the field if it reaches the engine.
- Added result-shape inputs: label or field, short answer, detailed answer, and long artifact.
- Separated primary AI steps from checker steps.
- Added model-specific output-length and retry distributions.
- Added a cost-per-completed-task ceiling instead of a monthly model budget.
- Added a hard-bordered Cost Evaluation Specialist that independently recomputes all three cost ledgers without calling the estimator formula.
- Added deliberate corruption testing: a one-cent mismatch fails evaluation and GOV-009 blocks governance.
- Added GOV-015 so heuristic behavior profiles remain visibly unmeasured until repeated live evaluations replace them.
- Updated the original PRD, Maven/Product Faculty PRD, Builder Badge workbook, TeamOS workflow, governance documents, four-minute script, and eight-slide recording deck.
- Added release-gate automation for build, test, lint, and drift checks.

## Catalog release audit

The August 9 release audit checked the catalog against official provider documentation. It corrected OpenAI Luna and Terra price and context-window drift before release. Google Gemini and Anthropic Claude standard token prices remained aligned.

The catalog is still a reviewed snapshot—not an automatic live feed. Published token prices are facts as of the source date. Output and retry profiles are planning heuristics. Cache writes, cache storage, grounding, searches, tools, batch and priority modes, long-context premiums, regional premiums, infrastructure, and human-review cost remain explicit coverage gaps unless a row says otherwise.

## Verified evidence

- 15 automated checks pass and 0 fail.
- Production build and lint pass.
- Same-input deterministic results and stable ranking pass.
- COST-001 through COST-006 pass.
- Checker/retry monotonicity, independent three-scenario recomputation, deliberate corruption, and GOV-009 propagation pass.
- High-risk, unknown-risk, sensitive, unsupported, stale, and excessive-loop cases fail closed.
- Workbook formula scan and visual review pass.
- Presentation overflow and template-fidelity checks pass with eight source-note blocks.
- Active-artifact person-neutral and claim-drift scans pass.
- The decision path makes zero generative model calls and needs no AI credential.

## Honest capability boundary

- OpenAI is the only policy-eligible heuristic baseline. Google and Anthropic are cost-visible but not rank-eligible until the same measured workload evaluation runs across providers.
- Behavior distributions are not measured production facts yet.
- Free text remains context; the user confirms every fact used by the engine.
- Ideas and workload values remain in browser memory and clear on refresh. There is no application database or saved history in this release.
- The estimator covers modeled inference-token charges. It does not yet cover software-development labor, hosting, retrieval, databases, storage, networking, monitoring, provider tool fees, or human review.
- The application does not purchase, provision, route production traffic, or approve regulated workloads.

## Release channels

The release is complete only when immutable tag `v0.2.0-rc.3`, GitHub `main`, GitHub Pages, Sites, and the custom domain resolve the same reviewed source. The previous `v0.2.0-rc.2` tag remains the immediate rollback target and `alpha-baseline-2026-08-08` remains the original baseline.

## Next increments

1. Measure task-by-model output, retry, checker, success, latency, and actual-charge distributions using budget-capped synthetic cases.
2. Add reviewed catalog refresh and price-change history.
3. Add explicit local export and clear-session controls before any cloud persistence.
4. Add authenticated saved forecasts and user-owned deletion/export.
5. Add forecast-versus-actual tracking, then shared Google and Anthropic live evaluation.

## Evidence

- [Cost-contract artifact audit](artifacts/COST_CONTRACT_ARTIFACT_AUDIT.md)
- [Capability and channel audit](artifacts/CAPABILITY_AND_CHANNEL_AUDIT.md)
- [Self-test cycle](artifacts/SELF_TEST_CYCLE.md)
- [Evaluation evidence](EVALUATION.md)
- [Governance specification](governance/GOVERNANCE_AND_EVALUATION.md)
- [Audited v0.1.0 record](artifacts/RELEASE_v0.1.0_AUDIT.md)
