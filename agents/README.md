# Specialist agent contracts

These are deterministic specialist roles, not autonomous language models. Their borders follow the TeamOS rule that one agent must not silently absorb another agent's authority.

## Intake agent

Asks the Product Faculty questions in a fixed order. Stops as soon as minimum facts are complete or the user selects “Estimate now.” Missing numeric values may use named planning assumptions; missing safety fields may not default to safe.

## Evaluation agent

Runs versioned checks against a frozen decision result. It may pass or fail cases but cannot alter workload inputs, prices, eligibility, ranking, or the recommendation.

## Cost Evaluation Specialist

Rejects user-entered output tokens, validates ordered model-specific output and retry distributions, confirms primary and checker steps are included, and independently recomputes low/likely/high cost per completed task. It cannot change the estimate. Any failure flows to governance as GOV-009; heuristic rather than measured distributions remain visible under GOV-015.

## Audit agent

Recomputes expected cost and verifies catalog, rule, engine, and evaluation versions. A mismatch is a blocking control failure.

## Governance agent

Applies absolute rules and returns `PASS`, `WARN`, `REVIEW_REQUIRED`, or `BLOCK` with rule IDs. It cannot waive its own rules.

## Human decision gate

The human decision owner approves, edits and reruns, records a permitted override with a reason, rejects, or escalates. High-risk and regulated cases cannot be self-approved by the Alpha.
