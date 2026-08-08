# Alpha evaluation

Evaluation date: August 8, 2026

## Acceptance criteria

1. The app renders the estimator without a credential.
2. Same normalized inputs and versions produce an identical result.
3. Cached input is priced separately from uncached input.
4. Low-complexity, low-risk work chooses the lowest-cost eligible tier.
5. Higher-risk, regulated, sensitive, unknown-task, unknown-risk, unknown-regulatory-status, or unknown-data work requires human review.
6. A manual comparison does not silently replace the recommended starting point.
7. Stale pricing, failed evaluation, audit mismatch, unsafe loops, or no eligible model blocks finalization.
8. Assumptions remain visible and create a warning.
9. Candidate ordering cannot change the deterministic recommendation, and a stated monthly ceiling cannot be exceeded.
10. No AI key or generative endpoint is required.
11. Unknown consequences of error require human review rather than inheriting a safe default.
12. The displayed 12-month forecast equals twelve 30-day monthly planning periods.

## Results

| Check | Result | Evidence |
|---|---|---|
| Production build | Pass | Five build stages completed; credential-free `/` emitted. |
| Server render | Pass | Automated test found the product title, estimator inputs, and model catalog. |
| Starter removal | Pass | Automated test confirmed starter placeholder copy is absent. |
| Determinism | Pass | Same frozen input and versions produced identical structured output. |
| Scenario ordering | Pass | Low ≤ expected ≤ high. |
| Governance fail-closed | Pass | High risk, unknown risk, and unknown sensitivity require review; stale pricing and unsafe loops block. |
| Capability boundary | Pass | Unsupported modality blocks instead of forcing a candidate. |
| Ranking stability | Pass | Candidate order does not change the recommendation. |
| Budget boundary | Pass | A ceiling below every evidence-qualified option blocks with GOV-011; a sufficient ceiling permits the same deterministic recommendation. |
| Provider neutrality | Pass | Three providers are cost-visible; unevaluated Google and Anthropic entries cannot enter the recommendation ranking. |
| Secret boundary | Pass | No key or generative route is required by the app or static hub. |
| Forecast label/math | Pass | The 12-month forecast equals expected monthly cost × 12. |

Automated suite: **11 tests passed, 0 failed**. This includes ten decision/governance regression cases and one rendered-app smoke test.

## Browser test cycles

| Cycle | Result | Observed evidence |
|---|---|---|
| Prompt gate | Pass | The estimator is hidden before route selection and the idea prompt is the first interactive field. |
| Explicit-answer gate | Pass | Guided Continue is disabled until the current question receives an explicit answer. |
| Novice uncertainty | Pass | “Not sure” task and “Unknown” risk reach an estimate with GOV-014 and GOV-012 review findings. |
| Sample provenance | Pass | The synthetic example remains labeled as planning assumptions rather than user-supplied facts. |
| Provider isolation | Pass | Selecting Gemini shows NOT EVALUATED / NOT RUN / NOT APPLIED, hides baseline findings, and disables approval. |
| Budget failure | Pass | A $1 ceiling blocks the sample with GOV-011. |
| Public landing page | Pass | The retained design renders cleanly with person-neutral copy and without the public internal-artifact checklist. |

These are controlled Alpha browser checks. They are not a substitute for moderated usability testing with first-time builders.

## First-user test script

1. Describe one application, agent, or tool idea in everyday language.
2. Use the guided route without opening technical documentation.
3. Explain the assumptions shown before the estimate and correct anything that feels wrong.
4. Compare the recommended model with one alternative and say what is known versus not evaluated.
5. Say aloud whether the result is clear and whether any missing cost would change the decision.
6. Record confidence before and after on a 1–5 scale.

Success for the alpha: the user completes a defensible first estimate in under three minutes and can explain why the recommendation fits.
