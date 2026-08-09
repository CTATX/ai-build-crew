# AI Build Crew deployment record

Release candidate: `v0.2.0-rc.3`

Status: **Release locked; live evidence is recorded on the GitHub release after same-commit verification**

Prepared: August 9, 2026

| Control | Locked value |
|---|---|
| Rollback release | `v0.2.0-rc.2` at `00d7532` |
| Original baseline | `alpha-baseline-2026-08-08` at `cd7a8282a6964a049221e31c9682f8dd694d7efe` |
| Release source | Immutable tag `v0.2.0-rc.3` on `main` |
| GitHub Pages | `https://ctatx.github.io/ai-build-crew/` |
| Sites application | `https://ai-build-crew.ctatx.chatgpt.site/` |
| Primary custom domain | `https://aibuildcrew.badlabz.com/` |
| Catalog | `provider-neutral-catalog-2026-08-09` |
| Cost contract | `cost-contract-1.0.0` |
| Governance | `governance-1.3.0` |
| Engine | `decision-engine-1.3.0` |
| Local release gates | 15/15 tests, build, lint, workbook QA, deck QA, drift scan, and official catalog check pass |
| Browser smoke target | Prompt, result shape, checker steps, cost-per-completed-task spread, COST-001, GOV-009/GOV-015 language, artifact links, and public access |
| Hosted secrets | No application secret required by the deterministic release |

The GitHub release for `v0.2.0-rc.3` is the authoritative live-deployment record. It must name the exact tag commit, GitHub Pages result, Sites result, custom-domain result, smoke checks, and rollback target. Never move an approved tag. Roll back Sites to its prior saved version and use a normal Git revert when needed.
