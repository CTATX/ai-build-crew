# Alpha evaluation

Evaluation date: August 7, 2026

## Acceptance criteria

1. The app renders the estimator without a credential.
2. Cost changes immediately when a workload input changes.
3. Cached input is priced separately from uncached input.
4. Low-complexity, low-risk work chooses the lowest-cost eligible tier.
5. Higher-risk or more complex work raises the quality gate before comparing cost.
6. A manual comparison does not silently replace the recommended starting point.
7. If the OpenAI call or key is unavailable, the user receives a deterministic explanation instead of an error.
8. The OpenAI key never enters client code or GitHub Pages.

## Results

| Check | Result | Evidence |
|---|---|---|
| Production build | Pass | Five build stages completed; `/` and `/api/recommend` emitted. |
| Server render | Pass | Automated test found the product title, estimator inputs, and model catalog. |
| Starter removal | Pass | Automated test confirmed starter placeholder copy is absent. |
| Secret boundary | Pass | API key is read only in the server route; static demo has no API request. |
| Failure fallback | Pass | Server route returns a rules-based brief when key/network/model access fails. |

Automated suite: 1 test passed, 0 failed. Formula and recommendation boundary cases are represented directly in the alpha interface and should be expanded into a dedicated regression suite after user testing.

## First-user test script

1. Enter one real workload you expect to run this month.
2. Predict which model you would choose before viewing the recommendation.
3. Compare the recommended model to the other two tiers.
4. Say aloud whether the reason is clear and whether any missing cost would change the decision.
5. Record confidence before and after on a 1–5 scale.

Success for the alpha: the user completes a defensible first estimate in under three minutes and can explain why the recommendation fits.
