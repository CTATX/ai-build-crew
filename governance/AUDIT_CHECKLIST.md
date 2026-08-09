# Decision and release audit checklist

## Per decision

- [ ] Input fields are normalized and marked user, preset, assumed, or unknown.
- [ ] No secrets, PHI, or protected production content are present.
- [ ] Catalog, rules, and engine versions are recorded.
- [ ] Output tokens are absent from workload input and model output/retry profiles are versioned and evidence-labeled.
- [ ] Primary and checker steps plus retries are included in the frozen low/likely/high scenarios.
- [ ] Independent cost-ledger recomputation matches every scenario.
- [ ] Recommendation is the least expensive eligible likely-cost-per-completed-task candidate.
- [ ] Evaluation passed against the frozen result.
- [ ] Audit did not detect mutation, missing evidence, or version mismatch.
- [ ] Governance findings include rule IDs and a final disposition.
- [ ] Review and block conditions remain visible.
- [ ] The human decision and any permitted override rationale are explicit.

## Per release

- [ ] All automated tests pass.
- [ ] COST-001 through COST-006, deliberate ledger corruption, and governance propagation pass.
- [ ] Production build succeeds without an AI credential.
- [ ] Pricing catalog freshness is within policy.
- [ ] High-risk, unknown-data, stale-catalog, unsupported-modality, and unsafe-loop cases fail closed.
- [ ] App, PRDs, workbook, workflow, deck, script, evaluation, governance, and backlog agree.
- [ ] Published artifact links resolve.
- [ ] Static output contains no secret or server-only endpoint.
- [ ] TeamOS documentation drift classification is current.
