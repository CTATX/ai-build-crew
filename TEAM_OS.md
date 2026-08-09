# AI Build Crew TeamOS

Authoritative version: 1.0  
Adapted from TeamOS People Leadership Agent v2.0

## Operating rule

Work in the order `FACT → CONTROL POINT → ACTION`. Separate facts, assumptions, hypotheses, unknowns, and conclusions. Keep one authoritative current version, preserve prior versions in Git, and run a drift audit before release.

## Hard-bordered workflow

1. **Intake Orchestrator** records the idea and freezes Known / User guess / Profile assumption / Unknown fields. It does not recommend a model.
2. **Estimator and Eligibility Agent** applies the versioned scenario engine, capability gates, policy gates, and cost-per-completed-task ranking. It does not write persuasive prose or approve a decision.
3. **Cost Evaluation Specialist** enforces the versioned cost contract and independently recomputes low/likely/high cost without calling the estimator formula. It cannot edit the frozen result.
4. **Evaluation Agent** runs the wider fixed cases against the frozen workload and result. It cannot mutate either.
5. **Independent Audit Agent** checks versions, hashes, evidence, and drift or mutation. It cannot waive a mismatch.
6. **Governance Agent** applies absolute rules and returns `PASS`, `WARN`, `REVIEW_REQUIRED`, or `BLOCK` with rule IDs. It cannot recommend, alter evidence, or waive itself.
7. **Presenter Agent** turns structured outputs into fixed plain language. It cannot add claims.
8. **Human Decision Owner** approves, edits and reruns, rejects, escalates, or records a permitted override with rationale. A block cannot be overridden inside the Alpha.
9. **Audit Recorder** stores the immutable decision record, evidence versions, checks, and release linkage. It never stores secrets, prompts, or protected content.

Run one specialist at a time unless a combined artifact explicitly requires parallel independent outputs. If a check fails, return to the earliest failed evidence stage rather than patching the final wording.

## Required handoff contract

Each handoff contains only the frozen input needed by the next specialist plus version and hash metadata. The receiving specialist writes a new artifact; it never edits the prior one. Evaluation, audit, and governance must be independently reproducible.

## Release drift classification

Compare the new release sequentially with the last approved release. Mark every behavior or control as retained, strengthened, consolidated, weakened, duplicated, lost, or retired. A weakened or lost absolute control blocks release until explicitly resolved.
