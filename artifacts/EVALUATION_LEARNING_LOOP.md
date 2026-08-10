# AI Build Crew Evaluation Learning Loop

## Objective

Improve completed-task success without changing the test merely to improve the score. Every comparison uses a frozen workload, versioned prompt, versioned rubric, bounded spend, and immutable result record.

## Baseline

The first funded OpenAI preview used `gpt-5.6-terra` against three synthetic inventory cases. All three provider calls completed. Two cases passed every required-fact check. Calculated token cost was `$0.0016875`, below a predicted maximum of `$0.0139575` and the approved `$1.00` ceiling. This is a one-run baseline, not a reliability claim.

## Controlled cycle

1. **Freeze** — assign versions to the workload, cases, prompt, rubric, catalog, model, runner, and spend policy.
2. **Run** — execute identical synthetic cases with a fixed repeat count, timeout, retry limit, and dollar circuit breaker.
3. **Measure** — record completed-task pass/fail, missing checks, input/output/reasoning tokens, latency, retries, calculated charge, provider charge when available, and output hash.
4. **Diagnose** — classify failures as instruction following, missing fact, unsupported capability, refusal, timeout, retry, or evaluator defect. Do not reveal provider identity during future blinded scoring.
5. **Change one variable** — create a new prompt, workflow, model, or checker version. Never overwrite the baseline.
6. **Compare** — rerun the same cases and compare paired success, p10/p50/p90 tokens and latency, retry/checker rate, and cost per successful completed task.
7. **Govern** — reject a candidate that exceeds budget, loses a critical case, changes the frozen workload, lacks enough samples, or fails audit/reconciliation.
8. **Promote or retain** — promote only the version meeting the declared thresholds; otherwise retain the prior baseline and record the finding.

## Alpha promotion gate

- At least 30 completed synthetic case runs across at least 3 repeats per case.
- 100% pass on critical safety and inventory-identity checks.
- At least 95% completed-task success overall.
- No unapproved retry or checker calls.
- p90 calculated cost per successful task at or below the approved ceiling.
- p90 latency recorded and disclosed; target set before comparative promotion.
- Request/workload hashes unchanged within a comparison.
- No raw idea, prompt, or output retained by AI Build Crew.
- Independent audit recomputation passes and provider-charge coverage is disclosed.

## Evidence maturity

- `HEURISTIC`: planning profile only; no provider run.
- `PREVIEW`: bounded synthetic run; diagnostic, not rank-ready.
- `MEASURED`: sample threshold met with repeatability statistics.
- `GOVERNED`: measured evidence plus audit, budget, privacy, and policy gates passed.
- `STALE`: source, prompt, model, or price changed after the evidence was produced.

## Storage contract

Until governed persistence is connected, the user downloads the point-in-time JSON report. Future storage must be append-only and retain aggregate evidence, hashes, versions, and decisions—never raw product ideas or provider outputs by default.

## Approved provider-run result contract

Every completed or stopped provider case uses `provider-run-result-1.0.0` and records: provider and model; request and workload hashes; case ID and status; input, cached-input, output, and reasoning tokens; tool calls; latency; retry count; provider-reported and calculated charge; charge-reconciliation status; raw-prompt and raw-output retention flags; and an output hash. The application keeps these details collapsed by default for readability and includes the complete structured record in the downloadable point-in-time report.
