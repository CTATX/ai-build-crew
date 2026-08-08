# AI Build Crew governance and evaluation

Authoritative version: 1.0  
Effective date: 2026-08-08  
Owner and final decision maker: CT

## Control statement

AI Build Crew organizes workload facts, applies reproducible calculations and rules, evaluates the result, and returns a reviewable recommendation. It does not independently approve a build or waive policy.

The required sequence is:

**Facts → Assumptions → Estimate → Eligibility → Evaluation → Audit → Governance → CT decision**

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
12. CT must approve, edit and rerun, reject, or provide an override reason before a decision is final.

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
| CT decision gate | Approve, edit/rerun, override with reason, reject, or escalate | Delegate final accountability to the system |

## Release gate

A result can be presented as `READY_FOR_CT_DECISION` only when:

- required intake fields are present or transparently assumed;
- at least one model is rule-eligible;
- the catalog is within its freshness window;
- cost recomputation matches;
- evaluation contains no failed case;
- governance contains no blocking finding.

High-risk and regulated cases may be estimated but remain `REVIEW_REQUIRED` and cannot self-approve.

## Documentation drift audit

Before release, verify:

- CT is the named first user and decision owner.
- Facts, assumptions, unknowns, and conclusions are separated.
- The PRD, workflow, app, eval report, presentation, and script describe the same behavior.
- No planned capability is reported as completed.
- Removed controls are classified as consolidated, replaced, retired, weakened, or lost.
- The authoritative rule, catalog, and evaluation versions are recorded.

If any answer is no, return to the earliest failed stage and rerun.
