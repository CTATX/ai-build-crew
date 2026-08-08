# AI Build Crew productization audit

Audit date: August 8, 2026  
Baseline: `alpha-baseline-2026-08-08`  
Target branch: `agent/productized-alpha`

## Executive finding

The governed Alpha is a strong calculation and control prototype, but it is not yet a provider-neutral decision platform for a first-time builder. The next release must preserve its deterministic math and fail-closed rules while replacing the named-person workflow, expert-first language, static catalog assumptions, and unsaved results.

## TeamOS evidence classification

| Area | Classification | Evidence | Control point | Required action |
|---|---|---|---|---|
| Deterministic cost math | Retained | Same frozen workload and versions reproduce the result. | No generative model may alter math, eligibility, disposition, or approval. | Keep the engine pure and versioned. |
| Independent checks | Strengthened | Evaluation, audit, and governance are separate outputs. | A specialist cannot grade or mutate its own work. | Freeze every handoff and record hashes. |
| Human accountability | Retained and generalized | The Alpha ends at a human gate. | Product authority cannot be embedded in one named person. | Use `human decision owner` throughout the reusable product. |
| Idea-first intake | Partially delivered | The page accepts an idea and offers three routes. | Free text is context only and defaults can still be accepted silently. | Add explicit unanswered states, plain-language profiles, and confirmation. |
| Beginner usability | Weakened | Token, cache, call, modality, and governance terms appear before explanation. | A new builder must reach a labeled estimate without knowing AI vocabulary. | Put plain-language choices first and technical values under advanced details. |
| Provider neutrality | Partially delivered | OpenAI, Google, and Anthropic are cost-visible. | Only shared workload evidence may make a provider rank-eligible. | Separate catalog comparison from evaluated recommendation. |
| Live catalog | Not delivered | The current catalog is a checked-in snapshot. | “Live” means validated last-known-good data with freshness, provenance, diff, and approval. | Build inventory refresh and reviewed pricing pipelines. |
| Freshness rule | Lost in runtime behavior | The page supplies a fixed assessment date. | A deployed freshness rule must age with real time. | Use server/current date and test stale transitions. |
| Cost history | Not delivered | No estimates, decisions, catalog snapshots, or actuals are stored. | Historical decisions must reproduce against original versions. | Add authenticated D1 persistence before calling history durable. |
| Git and Sites | Connected but under-governed | GitHub `origin`, Sites remote, and `.openai/hosting.json` all exist. | A deployed version must point to one audited Git commit. | Merge, tag, save Sites version from that commit, deploy, and record URL/status. |
| Product deck | Weakened | The six-slide deck is mostly text with minimal brand or market story. | The deck must sell the problem, product, evidence, and roadmap. | Replace it with a branded eight-slide product review. |

## Locked artifact chain

Every governed decision release must preserve these artifacts without mutation:

1. Normalized workload and Known / User guess / Profile assumption / Unknown provenance.
2. Catalog snapshot and field-level sources.
3. Ruleset and engine versions.
4. Frozen recommendation result and input hash.
5. Evaluation report.
6. Independent audit report.
7. Governance disposition and rule IDs.
8. Human decision and any permitted override rationale.
9. Documentation drift report.
10. Git commit, release tag, Sites version, and deployed URL.

## Product release sequence

### P0 — Productize the Alpha

- Remove named-person authority from the app and reusable controls.
- Lead with “describe an idea; get a cost range and model starting point.”
- Require explicit answers in guided intake.
- Make planning profiles and assumptions visible before calculation.
- Prevent catalog-only models from inheriting evaluated statuses.
- Use the actual assessment date for catalog freshness.

### P1 — Honest workload scenarios

- Replace traffic-only low/high multipliers with versioned ranges for volume, input, output, calls, cache, and growth.
- Add deterministic cost-driver sensitivity.
- Store human labels and provenance, not implementation field names.

### P2 — Governed provider catalog

- Refresh provider inventory from official APIs.
- Ingest pricing separately from official pricing sources.
- Validate schema, diff candidate vs current, require review for material changes, and retain last-known-good history.
- Attach source, observed date, effective date, confidence, and coverage status to each field.

### P3 — Saved forecasts and decisions

- Add authenticated D1 records for projects, estimate runs, decision records, catalog snapshots, and audit events.
- Reproduce every historical result with its original catalog/rules/engine versions.

### P4 — Forecast vs actual

- Import read-only daily provider usage and billing aggregates.
- Store counts and charges only—never prompts or protected content.
- Explain variance by volume, token size, calls, model mix, price changes, and uncovered fees.

### P5 — Shared cross-provider evaluation

- Run budget-capped synthetic and representative cases through approved provider adapters.
- Measure quality, reliability, latency, tokens, and actual cost.
- Promote a model to rank-eligible only after the shared evaluation and governance gates pass.

## Release gate

The product is ready to publish only when tests and build pass; the person-neutral text scan passes; app, PRDs, workbook, workflow, deck, script, evaluation, governance, and backlog agree; catalog freshness uses real time; public artifacts contain no secrets; and the TeamOS drift classification is current.
