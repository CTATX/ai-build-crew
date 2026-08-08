# AI Build Crew v0.2.0-rc.1 — Productized Alpha

Status: Draft release candidate
Prepared: August 8, 2026
Developed by [BadLabz.com](https://badlabz.com)

AI Build Crew turns an incomplete AI product idea into a transparent workload estimate, an evidence-gated model comparison, and a governed decision that remains human-owned.

## What shipped

- A beginner-first promise: describe an idea, then get a monthly cost range and model starting point without needing to know tokens or architecture first.
- Person-neutral product authority using “you,” “human reviewer,” and “human decision owner” throughout the active app and artifacts.
- Explicit unanswered states in guided intake; hidden defaults can no longer pass as user facts.
- Plain-language planning profiles for Experiment, Pilot, Launch, and Not sure.
- Human-readable assumption labels and definitions for uses, input size, answer size, reusable input, and AI steps.
- A 12-month token forecast and separation between evaluated recommendation evidence and catalog-only comparisons.
- Real-time catalog freshness assessment instead of a fixed deployment date.
- TeamOS specialist contracts and a locked evidence-to-decision handoff chain.
- A rebuilt eight-slide product-marketing and product-review deck based on an original AI Build Crew visual template.
- Prompt-first intake with fast, guided, and synthetic-example routes.
- A persistent workload prompt plus explicit requests/day, input tokens/call, output tokens/call, cached-input percentage, and model calls/request.
- An optional hard monthly budget ceiling. If no evidence-qualified model fits, governance blocks the decision instead of silently exceeding the budget.
- Deterministic low, expected, and high token-cost scenarios with reproducible calculations.
- A sourced catalog covering three OpenAI, two Google Gemini, and three Anthropic Claude models.
- Evidence-gated ranking: Google and Anthropic are cost-visible but cannot enter cross-provider ranking before shared workload evaluations measure quality, reliability, latency, and actual cost.
- Independent Evaluation, Audit, and Governance stages followed by the human decision gate.
- Fail-closed controls for unsupported capabilities, stale pricing, unsafe agent loops, unknown or sensitive data, high-risk work, audit mismatch, failed evaluation, and budget conflict.
- Original PRD, Product Faculty/Maven PRD, Builder Badge workbook, workflow, governance specification, evaluation report, backlog, presentation, and 2–3 minute demo script.
- About and attribution for BadLabz.com.

## Verification

- 11 automated deterministic, governance, provider-neutrality, budget-boundary, unknown-risk, and rendered-app tests pass.
- Production build and lint pass.
- The governed calculation and recommendation path requires no AI credential and contains no generative model call.
- GitHub Pages publishes the assessment artifacts from the same repository.

## Known limitations

- Only the current OpenAI baseline is rank-eligible. Google and Anthropic remain catalog-only until the shared live evaluation framework is connected.
- Catalog values are dated snapshots, not automated live feeds.
- The estimate includes token input, cached reads, and output. Provider-specific cache writes, storage, grounding/search, tools, batch modes, regional premiums, infrastructure, and human-review cost remain coverage gaps.
- Plans and decision records are not yet persisted across devices.
- Live catalog refresh, saved price history, and forecast-versus-actual cost tracking are designed but not yet delivered.
- AI Build Crew does not purchase, provision, deploy, or approve regulated workloads.
- High-risk, regulated, sensitive, and uncertain cases require human or specialist review.

## Next

1. Complete the TeamOS drift review and merge the release candidate.
2. Publish the exact merged commit to GitHub Pages and Sites, then verify `aibuildcrew.badlabz.com`.
3. Run first-time-builder usability sessions and record the 2–3 minute Alpha overview.
4. Add governed provider inventory refresh and reviewed pricing changes.
5. Add authenticated saved forecasts and decisions, followed by price history and forecast-versus-actual cost tracking.
6. Add budget-capped shared live evaluation adapters for Google Gemini, then Anthropic Claude.

## Links

- [Artifact hub](https://ctatx.github.io/ai-build-crew/)
- [Source repository](https://github.com/CTATX/ai-build-crew)
- [Evaluation evidence](https://github.com/CTATX/ai-build-crew/blob/main/EVALUATION.md)
- [Governance specification](https://github.com/CTATX/ai-build-crew/blob/main/governance/GOVERNANCE_AND_EVALUATION.md)
