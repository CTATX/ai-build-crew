# AI Build Crew v0.2.0-rc.1 — Productized Alpha

Status: **Validated release candidate; not yet deployed to production**

Prepared: August 8, 2026

Developed by [BadLabz.com](https://badlabz.com)

AI Build Crew is a prompt-first, pre-build decision workbench for product builders. It converts a rough AI workload into visible assumptions, reproducible model-usage cost scenarios, evidence-gated eligibility, separate evaluation/audit/governance findings, and a human-owned decision.

## Channel status

| Channel | Version observed | Status |
|---|---|---|
| Sites production | Alpha 01 | Earlier three-model OpenAI calculator; no prompt-first intake |
| GitHub Pages | v0.1 artifact hub | Governed artifacts published, but older personalized copy remains visible |
| GitHub `main` | v0.1 governed source | Prompt routes and governed engine exist in source; not synchronized to Sites |
| GitHub release-candidate branch | v0.2.0-rc.1 | Beginner-first, person-neutral candidate described below |

“Included in this candidate” does not mean “available in production.” Production claims begin only after the exact reviewed commit is deployed and smoke-tested on both Sites and GitHub Pages.

## Included in this candidate

- An idea prompt with guided, known-usage, and synthetic-example routes.
- A beginner-first path that does not require the user to know models, tokens, or architecture before starting.
- Explicit unanswered states and visible planning assumptions; unknown safety fields never silently become safe defaults.
- Plain-language Experiment, Pilot, Launch, and Not sure workload profiles.
- Editable uses/day, input tokens/use, output tokens/use, reusable-input percentage, AI steps/use, and an optional monthly model-usage budget.
- Deterministic low, expected, and high token-cost scenarios plus a 12-month token-cost forecast.
- A dated catalog containing three OpenAI, two Google Gemini, and three Anthropic Claude entries.
- Evidence-gated ranking: Google and Anthropic costs are visible but those models remain unranked until shared workload evaluations exist.
- Logically separate deterministic estimate, evaluation, audit, governance, and human-decision outputs. These are currently modules in one application, not independently deployed autonomous agents.
- Fail-closed controls for unsupported capabilities, stale pricing, unsafe loops, unknown or sensitive data, high-risk work, audit mismatch, failed evaluation, and budget conflict.
- Person-neutral product and governance language.
- Original PRD, Maven/Product Faculty PRD, Builder Badge workbook, workflow, TeamOS operating model, governance specification, evaluation report, backlog, presentation, and 2–3 minute demo script.

## Verified candidate evidence

- 11 automated deterministic, governance, provider-neutrality, budget-boundary, unknown-risk, and rendered-app checks pass.
- The candidate production build and lint complete successfully in the local release workspace.
- The calculation and recommendation path requires no AI credential and contains no generative model call.
- A person-neutral scan passes across active text, workbook, and presentation content.
- PowerPoint overflow checks pass.

These checks verify the candidate package. They do not prove that Sites production has been updated.

## Service capability boundary

The current product estimates **model inference token charges** for a described workload. It does not yet estimate software-development labor, hosting, databases, retrieval, storage, networking, monitoring, vendor tools, or human-review cost. It also does not currently parse free text into authoritative workload facts; the user confirms every field used by the decision engine.

## Known limitations

- Only the current OpenAI baseline is rank-eligible. Google and Anthropic remain catalog-only until the same measured evaluation is run.
- Catalog values are reviewed snapshots, not automated live feeds.
- Model-list APIs do not provide every price component; pricing refresh remains a separately reviewed process.
- Provider-specific cache writes, storage, grounding/search, tools, batch modes, regional premiums, infrastructure, and human-review cost remain explicit coverage gaps.
- Forecasts and decision records are not persisted across devices.
- The 12-month value is a projection from the confirmed workload, not actual-spend tracking.
- Live catalog refresh, saved price history, forecast-versus-actual reconciliation, and live multi-provider evaluation are planned—not shipped.
- AI Build Crew does not purchase, provision, deploy, or approve regulated workloads.

## Release gate

1. Complete the final claim, catalog, secret, accessibility, and failure-path checks.
2. Review and merge the release candidate.
3. Record the exact release commit and artifact hashes.
4. Tag the immutable v0.2.0 release.
5. Deploy that exact commit to GitHub Pages and Sites.
6. Verify the prompt-first path, custom domain, HTTPS, artifact links, and rollback target.
7. Record the deployment evidence and publish the final release notes.

## Next product increments

1. Run first-time-builder usability cycles and capture where users cannot translate an idea into workload assumptions.
2. Add governed provider inventory refresh and reviewed pricing changes.
3. Add authenticated saved forecasts and decisions.
4. Add price history and forecast-versus-actual cost tracking.
5. Add budget-capped shared live evaluations for Google Gemini, then Anthropic Claude.

## Evidence

- [Audited v0.1.0 record](artifacts/RELEASE_v0.1.0_AUDIT.md)
- [Capability and channel audit](artifacts/CAPABILITY_AND_CHANNEL_AUDIT.md)
- [Market discovery](artifacts/MARKET_DISCOVERY.md)
- [Self-test cycle](artifacts/SELF_TEST_CYCLE.md)
- [Evaluation evidence](EVALUATION.md)
- [Governance specification](governance/GOVERNANCE_AND_EVALUATION.md)
