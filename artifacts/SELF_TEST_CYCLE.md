# Self-Test Cycle — AI Build Crew Evaluates AI Build Crew

Cycle date: August 8, 2026

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
| Output tokens/use | 500 |
| AI steps/use | 1 |
| Reusable input | 0% |

Observed deterministic result:

- With a $50 monthly model budget, no evidence-qualified OpenAI baseline fits; the engine blocks with GOV-011.
- With a $100 monthly model budget, GPT-5.6 Terra is the least expensive evidence-qualified baseline.
- Expected token charge: $75/month.
- Planning range: $56.25–$101.25/month.
- 12-month expected token forecast: $912.50.
- Google and Anthropic catalog prices remain comparison-only because no shared workload evaluation exists.

## Cycle 3 — Release-channel truth

**Input:** “Does the production Alpha have the prompt-first flow described by the release notes?”  
**Observed:** no. Sites production displays Alpha 01 and begins with structured estimator fields.  
**Expected governance response:** block the production claim until the reviewed release is deployed and smoke-tested.

## Acceptance for the next cycle

- The live Sites page begins with the idea prompt.
- A novice can reach an estimate without knowing token terminology.
- The page says exactly which costs are included and excluded.
- The same release version and capability claims appear on Sites, GitHub Pages, repository main, release notes, deck, and demo script.
- At least one budget block, unknown-risk review, unsupported modality block, catalog-only provider selection, and happy path are exercised in the browser.
