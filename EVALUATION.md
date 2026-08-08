# Alpha evaluation

Evaluation date: August 8, 2026

## Acceptance criteria

1. The app renders the estimator without a credential.
2. Same normalized inputs and versions produce an identical result.
3. Cached input is priced separately from uncached input.
4. Low-complexity, low-risk work chooses the lowest-cost eligible tier.
5. Higher-risk, regulated, sensitive, or unknown-data work requires human review.
6. A manual comparison does not silently replace the recommended starting point.
7. Stale pricing, failed evaluation, audit mismatch, unsafe loops, or no eligible model blocks finalization.
8. Assumptions remain visible and create a warning.
9. Candidate ordering cannot change the deterministic recommendation, and a stated monthly ceiling cannot be exceeded.
10. No AI key or generative endpoint is required.

## Results

| Check | Result | Evidence |
|---|---|---|
| Production build | Pass | Five build stages completed; credential-free `/` emitted. |
| Server render | Pass | Automated test found the product title, estimator inputs, and model catalog. |
| Starter removal | Pass | Automated test confirmed starter placeholder copy is absent. |
| Determinism | Pass | Same frozen input and versions produced identical structured output. |
| Scenario ordering | Pass | Low ≤ expected ≤ high. |
| Governance fail-closed | Pass | High risk and unknown sensitivity require review; stale pricing and unsafe loops block. |
| Capability boundary | Pass | Unsupported modality blocks instead of forcing a candidate. |
| Ranking stability | Pass | Candidate order does not change the recommendation. |
| Budget boundary | Pass | A ceiling below every evidence-qualified option blocks with GOV-011; a sufficient ceiling permits the same deterministic recommendation. |
| Provider neutrality | Pass | Three providers are cost-visible; unevaluated Google and Anthropic entries cannot enter the recommendation ranking. |
| Secret boundary | Pass | No key or generative route is required by the app or static hub. |

Automated suite: **10 tests passed, 0 failed**. This includes nine decision/governance regression cases and one rendered-app smoke test.

## First-user test script

1. Enter one real workload you expect to run this month.
2. Predict which model you would choose before viewing the recommendation.
3. Compare the recommended model to the other two tiers.
4. Say aloud whether the reason is clear and whether any missing cost would change the decision.
5. Record confidence before and after on a 1–5 scale.

Success for the alpha: the user completes a defensible first estimate in under three minutes and can explain why the recommendation fits.
