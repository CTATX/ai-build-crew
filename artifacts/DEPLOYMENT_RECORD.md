# AI Build Crew deployment record

Release candidate: `v0.2.0-rc.2`

Status: **Deployed and smoke-tested**

Release date: August 8, 2026

| Control | Recorded value |
|---|---|
| Locked baseline | `alpha-baseline-2026-08-08` at `cd7a8282a6964a049221e31c9682f8dd694d7efe` |
| Release source | Immutable tag `v0.2.0-rc.2` on `main` |
| GitHub Pages | `https://ctatx.github.io/ai-build-crew/` — verified product/about page |
| Sites application | `https://ai-build-crew.ctatx.chatgpt.site/` — verified prompt-first Alpha 02 |
| Primary custom domain | `https://aibuildcrew.badlabz.com/` — active HTTPS, access-controlled |
| Hosted environment | No application secrets remain; the unused `OPENAI_API_KEY` was removed |
| Catalog | `provider-neutral-catalog-2026-08-08` |
| Governance | `governance-1.2.0` |
| Engine | `decision-engine-1.2.1` |
| Browser smoke | Prompt, guided question, explicit-answer gate, provider isolation, budget block, and public landing page passed |
| Rollback | Baseline Git tag plus prior successful Sites version at source commit `8a1bd0d` |

The hosting provider’s saved-version metadata is the authoritative record of the exact commit and deployment ID. Never move an approved release tag. Roll back Sites to a prior saved version and use a normal Git revert when needed.
