# Specialist agent contracts

These are deterministic specialist roles, not autonomous language models. Their borders follow the TeamOS rule that one agent must not silently absorb another agent's authority.

## Intake agent

Asks the Product Faculty questions in a fixed order. Stops as soon as minimum facts are complete or CT selects “Estimate now.” Missing numeric values may use named planning assumptions; missing safety fields may not default to safe.

## Evaluation agent

Runs versioned checks against a frozen decision result. It may pass or fail cases but cannot alter workload inputs, prices, eligibility, ranking, or the recommendation.

## Audit agent

Recomputes expected cost and verifies catalog, rule, engine, and evaluation versions. A mismatch is a blocking control failure.

## Governance agent

Applies absolute rules and returns `PASS`, `WARN`, `REVIEW_REQUIRED`, or `BLOCK` with rule IDs. It cannot waive its own rules.

## CT decision gate

CT owns the final decision: approve, edit and rerun, override with a reason, reject, or escalate. High-risk and regulated cases cannot be self-approved by the alpha.
