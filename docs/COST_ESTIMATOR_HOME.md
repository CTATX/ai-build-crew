# Cost Estimator — ownership (locked 2026-08-19)

## Decision

**Canonical home:** [CTATX/ai-build-crew](https://github.com/CTATX/ai-build-crew)

The Agentic AI Engineer bootcamp Cost Estimator and the AI Product Management “AI Cost Planner” are the **same product**. Merge work lands here.

## System map

See [`SYSTEM_MAP.md`](SYSTEM_MAP.md) for the BraveLabz / GT International / AutoZyte / bootcamp / Projects diagram.

## Not this product

| Name | Role |
|------|------|
| **BraveLabz** (company; GitHub org still BadLabz until rename) | Your company |
| **GT International** | Client — shop/AutoZyte work, not Cost Estimator hosting |
| **AutoZyte** | Shop platform — separate repo ([BadLabz/autozyte](https://github.com/BadLabz/autozyte)) |
| **ai-eng-bootcamp** | Training scaffold — may keep a thin `/estimate` demo |
| **BadLabz/Projects** | Org portfolio hub — indexes products; not a runtime |

## Spend guards

Planning ceiling + live `$1` preview + platform billing backstop: [`SPEND_GUARDS.md`](SPEND_GUARDS.md).

## Merge backlog (later steps)

1. Fold remaining Product Management notes into `docs/` here.
2. Decide whether bootcamp keeps a simplified Python demo or links to this app.
3. Optional: rename GitHub repo to `cost-estimator` and/or move under BraveLabz org.
4. Org rename BadLabz → BraveLabz (links + hub) — separate pass.
