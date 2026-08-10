# AI Build Crew deployment record

Release candidate: `v0.3.0-rc.1`

Status: **Release locked; live evidence is recorded on the GitHub release after same-commit verification**

Prepared: August 10, 2026

| Control | Locked value |
|---|---|
| Rollback release | `v0.2.0-rc.10` at `d2a22d4d6f56b540a6ef994235b7fa66d6215d5d` |
| Original baseline | `alpha-baseline-2026-08-08` at `cd7a8282a6964a049221e31c9682f8dd694d7efe` |
| Release source | Immutable tag `v0.3.0-rc.1` on `main` |
| GitHub Pages | `https://ctatx.github.io/ai-build-crew/` |
| Sites application | `https://ai-build-crew.ctatx.chatgpt.site/` |
| Primary custom domain | `https://aibuildcrew.badlabz.com/` |
| Catalog | `provider-neutral-catalog-2026-08-09` |
| Cost contract | `cost-contract-1.0.0` |
| Governance | `governance-1.3.0` |
| Engine | `decision-engine-1.4.1` |
| Local release gates | 35/35 tests, build, lint, responsive Phase 2 visual QA, structured-result contract, owner authorization, and spend controls pass |
| Browser smoke target | Prompt, multi-format selection, workflow-step guidance, optional ceiling, model-switch explanation, cost-per-completed-task spread, COST-001, GOV-009/GOV-015 language, artifact links, and public access |
| Hosted secrets | Provider key and owner allowlist are protected server values; neither is present in GitHub, browser code, or downloaded reports |

The GitHub release for `v0.3.0-rc.1` is the authoritative live-deployment record. It must name the exact tag commit, GitHub Pages result, Sites result, custom-domain result, smoke checks, and rollback target. Never move an approved tag. Roll back Sites to its prior saved version and use a normal Git revert when needed.
