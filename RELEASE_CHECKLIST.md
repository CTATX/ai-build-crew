# AI Build Crew (Cost Estimator) release checklist

**Law:** D-2026-11-11-07 — "nothing goes without full validation" / "Let's make that law" / "For all of us".

**Role:** D-2026-11-11-08 — Tess – Release & Test (she/her) owns this checklist, the test harness, preview-vs-live parity, the signed-in smoke, and the recorded rollback target. She has a veto until the checks pass. She does not ship; only CT gives the prod go. D-2026-11-11-09 is the locked sequence that starts with filling this role.

**Mutual-check (CT, exact words):** "we check one another when we miss as I do and I did"

Anyone, CT included, who spots a skipped check calls it out before release.

Repo: `CTATX/ai-build-crew` (there is no `BLZFoundry/ai-build-crew`). This file is names and procedure only. Never write secret values here.

**Deploy targets (honest):** There is no `wrangler.toml` in this repo.

| Surface | Target |
|---|---|
| GitHub Pages (docs hub) | `https://ctatx.github.io/ai-build-crew/` (workflow publishes `docs/`) |
| Hosted application | ChatGPT Sites `https://ai-build-crew.ctatx.chatgpt.site/` |
| Custom domain | `https://aibuildcrew.badlabz.com/` (points at Sites) |
| Local / Workers runtime | vinext + Cloudflare Workers bindings in `worker/index.ts`: `ASSETS`, `DB`, `IMAGES`. `.openai/hosting.json` `d1` and `r2` are currently unbound (null). |

Preview-vs-live: D-2026-11-11-07 requires a preview with identical bindings, storage, and settings before prod. The repo does not declare a separate preview hosting target. Tess records the preview target below and does not invent one.

## 0. Gate

Nothing goes to production until every box below is checked and Tess signs GO.

## 1. Preview first

- [ ] Release is exercised on a **preview** with bindings, storage, and settings identical to prod.
- [ ] Preview target recorded: _____________
- [ ] `node scripts/release/parity-check.mjs` is PASS on the release SHA (`release-parity` CI green).
- [ ] Existing gates are green: lint, test, production build (`Hard release gates`).

## 2. Parity table (names only — never values)

| Name | Kind | Preview | Prod | Match? |
|---|---|---|---|---|
| ASSETS | Worker binding | | | |
| DB | Worker binding (D1) | | | |
| IMAGES | Worker binding | | | |
| PHASE2_LIVE_PREVIEW_ENABLED | var | | | |
| OPENAI_API_KEY | secret (present? Y/N only) | | | |
| PHASE2_PREVIEW_APPROVAL_TOKEN | secret (present? Y/N only) | | | |
| PHASE2_PREVIEW_ALLOWED_ACCOUNT_USER_IDS | secret / allowlist (present? Y/N only) | | | |

## 3. Signed-in / owner smoke (required)

- [ ] Live data / catalog loads on the hosted surfaces in this release
- [ ] Every page in this release opens
- [ ] The new feature works
- [ ] Owner-only paid preview path stays off for visitors unless this release explicitly turns it on with CT's go
- Who ran it: _____________
- When (America/Chicago): _____________
- SHA / preview URL: _____________

## 4. Rollback target (required — no release without it)

- Production Sites version / deploy id (current, before this ship): _____________
- Production commit SHA / tag: _____________
- GitHub Pages SHA (if this release publishes Pages): _____________
- Preview target / version: _____________
- Recorded by / when (America/Chicago): _____________

Keep the existing `artifacts/DEPLOYMENT_RECORD.md` / GitHub release record in sync after the ship. Do not move an approved tag.

## 5. Lesson (Nov 11 2026, sa-board; applies wherever we use KV)

KV allows about **1 write/sec per key**. Mocks must rate-limit. A refused write must not become a fatal 503.

- [ ] If this release writes to a rate-limited store, tests include a rate-limit case; otherwise N/A: _____________


## Rollback on failure (D-2026-11-11-10)

If a release check fails, or production fails, rollback to the recorded target is mandatory. No exceptions, no go/no-go debate. Work does not move forward past a failed gate.

- [ ] Rollback target above is usable now (id + commit verified)
- [ ] If this release already failed a gate, rollback was executed and recorded here: _____________

## 6. Sign-offs (all required before CT's prod go)

| Gate | Person | Result | SHA / date (CT) |
|---|---|---|---|
| Mira (product) | Mira | YES / no | |
| Clara (docs) | Clara | PASS at SHA / no | |
| Vera (auth / owner allowlist) | Vera | PASS / n/a / no | |
| Tess – Release & Test | Tess | **GO / NO-GO** | |
| CT prod go | CT only | go / wait | |

Tess's GO is required. A missed check is called out here, including by CT, before anything ships.
