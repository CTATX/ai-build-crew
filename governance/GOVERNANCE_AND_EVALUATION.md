# AI Build Crew governance and evaluation

Authoritative version: 1.1  
Effective date: 2026-08-09
Owner and final decision maker: Human decision owner

## Control statement

AI Build Crew organizes workload facts, applies reproducible calculations and rules, evaluates the result, and returns a reviewable recommendation. It does not independently approve a build or waive policy.

The required sequence is:

**Facts → Assumptions → Estimate → Eligibility → Evaluation → Audit → Governance → human decision**

Never:

**Prompt → unverified recommendation**

This operating model adapts the TeamOS discovery-first pattern: collect evidence before interpretation, keep specialist responsibilities hard-bordered, preserve one authoritative ruleset, and run a drift audit before final output.

## Absolute rules

1. The same normalized inputs, catalog version, and rules version must produce the same structured result.
2. Missing safety or policy input means stop or require review; never silently default to safe.
3. User-supplied, assumed, unknown, and source-backed fields remain visibly distinct.
4. Unknown or stale pricing makes the recommendation provisional or blocked.
5. A model that fails modality, context, risk, or policy requirements cannot be recommended.
6. `NOT_EVALUATED` is not a pass.
7. No eligible model means stop and escalate.
8. High-risk, regulated, sensitive-data, contradictory-rule, or low-confidence cases require human review.
9. Provider sponsorship and commercial preference cannot change eligibility or ranking.
10. Model-generated prose cannot change calculations, rule findings, status, or approval.
11. The evaluation and governance functions cannot mutate the frozen workload or decision result.
12. A human decision owner must approve, edit and rerun, reject, or provide an override reason before a decision is final.
13. A stated cost-per-completed-task ceiling is a hard eligibility constraint; the system must block rather than recommend an evidence-qualified model above that ceiling.
14. Output tokens are never accepted as a workload input. Output length is a model-specific low/likely/high distribution.
15. Retry multipliers and checker steps are included before ranking. A single-call assumption cannot silently stand in for a completed task.
16. The Cost Evaluation Specialist must independently recompute all three cost scenarios. Any contract or ledger failure blocks through the evaluation-failed governance rule.

## Specialist contracts

| Specialist | Fixed responsibility | Cannot do |
|---|---|---|
| Intake | Ask Product Faculty questions and record known/assumed/unknown fields | Recommend a model |
| Estimator | Calculate low, expected, and high token scenarios | Change inputs or policy |
| Eligibility | Apply capability and policy gates | Invent capability evidence |
| Evaluator | Run fixed formula, stability, and boundary checks | Rewrite the recommendation |
| Auditor | Independently recompute totals and verify versions/provenance | Waive a mismatch |
| Governance | Return PASS, WARN, REVIEW_REQUIRED, or BLOCK with rule IDs | Alter price, score, or evidence |
| Presenter | Render structured results into fixed language | Add new claims |
| Human decision gate | Approve, edit/rerun, record a permitted override with reason, reject, or escalate | Delegate final accountability to the system |

## Release gate

A result can be presented as `READY_FOR_HUMAN_DECISION` only when:

- required intake fields are present or transparently assumed;
- at least one model is rule-eligible;
- at least one evidence-qualified model fits the stated cost-per-completed-task ceiling when one is provided;
- COST-001 through COST-006 pass, including independent low/likely/high ledger matches;
- the catalog is within its freshness window;
- cost recomputation matches;
- evaluation contains no failed case;
- governance contains no blocking finding.

High-risk and regulated cases may be estimated but remain `REVIEW_REQUIRED` and cannot self-approve.

## Documentation drift audit

Before release, verify:

- The target user and human decision owner are explicit.
- Facts, assumptions, unknowns, and conclusions are separated.
- The PRD, workflow, app, eval report, presentation, and script describe the same behavior.
- No planned capability is reported as completed.
- Removed controls are classified as consolidated, replaced, retired, weakened, or lost.
- The authoritative rule, catalog, and evaluation versions are recorded.

If any answer is no, return to the earliest failed stage and rerun.
