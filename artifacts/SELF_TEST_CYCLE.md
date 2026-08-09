# Self-Test Cycle — AI Build Crew Evaluates AI Build Crew

Cycle date: August 9, 2026

## Test question

Can a first-time product builder use AI Build Crew to estimate the Alpha itself and understand what the result does and does not cover?

## Cycle 1 — Current deterministic Alpha

**Known:** the released calculator has no model call in its recommendation path.  
**Expected result:** $0 model-inference cost for the calculator itself.  
**Observed product gap:** the current input requires at least one AI step, so it cannot directly represent a zero-model workload. It also does not estimate development labor, Sites hosting, GitHub, database, domain, or monitoring cost.

**Finding:** the product must say “model-usage cost,” not generic “application cost.” A future scenario option should support “no model call required” and explain that no model recommendation is needed.

## Cycle 2 — Hypothetical prompt interpretation service

This is a future service, not part of the current deterministic Alpha.

| Field | Confirmed planning value |
|---|---:|
| Work | Product analysis |
| Consequence of error | Medium |
| Data | Public |
| Modality | Text |
| Uses/day | 250 |
| Input tokens/use | 2,000 |
| Result needed | Detailed answer |
| Primary AI steps | 1 |
| Checker steps | 1 |
| Reusable input | 0% |

Required evaluation behavior:

- Any `outputTokens` workload field is rejected by COST-001.
- Output length comes from the selected model's low/likely/high profile; a reasoning tier can use materially more output than a fast tier for the same requested result shape.
- Primary and checker steps are included before the model-specific retry multiplier is applied.
- The main result and budget boundary are cost per completed task. Monthly volume is secondary context.
- An independent cost specialist recomputes all three scenarios; a one-cent corruption fails and GOV-009 blocks.
- Current output/retry profiles are planning heuristics and trigger GOV-015 until repeated live runs replace them with measured distributions.
- Google and Anthropic catalog prices remain comparison-only because no shared workload evaluation exists.

## Cycle 3 — Release-channel truth

**Input:** “Does production contain the corrected cost contract described by the release notes?”

**Observed before this release:** production v0.2.0-rc.2 has the prompt-first flow, but still exposes the earlier output-token and monthly-first contract.

**Expected governance response:** block the corrected-cost claim until the reviewed v0.2.0-rc.3 commit is deployed to both public channels and smoke-tested.

## Acceptance for the next cycle

- The live Sites page begins with the idea prompt.
- A novice can reach an estimate without knowing token terminology.
- The page says exactly which costs are included and excluded.
- The same release version and capability claims appear on Sites, GitHub Pages, repository main, release notes, deck, and demo script.
- At least one budget block, unknown-risk review, unsupported modality block, catalog-only provider selection, and happy path are exercised in the browser.
- Output-token input rejection, checker/retry inclusion, corrupted-ledger detection, and GOV-015 heuristic disclosure are exercised in automation.
