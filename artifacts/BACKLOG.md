# AI Build Crew backlog

The alpha remains intentionally narrow. This backlog preserves future value without weakening current release gates.

## P1 — provider-neutral comparison

- Add versioned catalog adapters for Google Gemini and Anthropic Claude with official source date, input/output/cache price, supported modalities, context, availability, and regional constraints.
- Replace the single quality tier with workload-specific measured eval scores and confidence intervals.
- Normalize provider differences without implying false equivalence; show missing or incomparable fields.
- Add provider filters, a pinned-model watchlist, and price/capability/deprecation alerts.
- Add rule tests proving provider order, sponsorship, or default placement cannot influence rank.

Acceptance: the same normalized workload is evaluated by one published schema; unsupported or stale entries are excluded; every displayed price has a source date; provider preference is disclosed but never masquerades as quality evidence.

## P2 — real task evaluation

- Bring user-owned provider keys through server-side secret storage only.
- Run a small, consented evaluation set against eligible models; keep prompts synthetic until data controls are approved.
- Capture quality, latency, error type, and full system cost—not token price alone.
- Add confidence and “insufficient evidence” outcomes.
- Add replayable eval fixtures for classification, extraction, generation, RAG, tool use, and agent loops.

## P3 — operating model

- Import anonymized usage from IDE traces, agent telemetry, and invoices.
- Add portfolio forecasts by team, environment, and growth scenario.
- Add storage, retrieval, search, tool, infrastructure, observability, and human-review cost.
- Add organization policies for allowed providers, residency, retention, budgets, and medical/financial/legal profiles.
- Keep an append-only historical decision log so old estimates reproduce against their original catalog and rules.

## P4 — network value

- Explore opt-in privacy-preserving benchmarks from builders.
- Test watchlist, savings-share, or very small transaction-fee models.
- Evaluate “network of networks” incentives and value storage only after privacy, legal, accounting, and anti-gaming review.

## Importing agents from GitHub

An external agent is software supply-chain input, not trusted governance. Before adoption:

1. Record repository, license, owner, commit hash, and maintenance status.
2. Inspect prompts, tools, permissions, network calls, secret access, file writes, and deletion paths.
3. Pin the reviewed commit; do not execute a moving branch.
4. Run in a sandbox with synthetic data and least privilege.
5. Test prompt injection, data exfiltration, unauthorized writes, rule bypass, and output mutation.
6. Map it to one hard-bordered role; reject agents that combine recommendation, evaluation, and approval.
7. Require evaluation, audit, and governance evidence before CT accepts it.
8. Re-review on every update and retain a rollback path.
