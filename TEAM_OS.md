# AI Build Crew TeamOS

- Authoritative version: 1.1
Adapted from TeamOS People Leadership Agent v2.0

Product-intake authority: `ABC-INTAKE-001` in [artifacts/PERSONA_GUIDED_INTAKE_DECISION_RECORD.md](artifacts/PERSONA_GUIDED_INTAKE_DECISION_RECORD.md)

## Operating rule

Work in the order `FACT → CONTROL POINT → ACTION`. Separate facts, assumptions, hypotheses, unknowns, and conclusions. Keep one authoritative current version, preserve prior versions in Git, and run a drift audit before release.

## Hard-bordered workflow

1. **Intake Orchestrator** selects Product guided or Advanced builder, records the idea, and freezes User confirmed / User guess / Profile assumption / Derived planning assumption / Unknown fields. Conversational text remains context until the user confirms a structured value. It does not recommend a model.
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

The intake handoff must also contain the selected persona, provenance for every derived technical value, the user's confirmation state, and the applicable intake-contract version. Persona affects question language and disclosure only; it cannot affect selection or ranking after normalization.

## Persona-guided intake controls

- Product guided users are never required to supply tokens or a context window.
- Familiar task, result, information-size, daily-volume, risk, data, and format answers may derive technical planning assumptions only through versioned mappings.
- Derived values must be visible and editable before freeze.
- Free text cannot silently populate risk, data sensitivity, regulation, cost, eligibility, or approval fields.
- Any future Intake Agent is suggestion-only, consented, and non-authoritative; confirmed structured input is the estimator boundary.
- Raw ideas are not retained or sent to a provider by default.
- Product guided and Advanced builder routes must produce identical results for identical normalized workloads.

## Release drift classification

Compare the new release sequentially with the last approved release. Mark every behavior or control as retained, strengthened, consolidated, weakened, duplicated, lost, or retired. A weakened or lost absolute control blocks release until explicitly resolved.

Any change to intake personas, derivation profiles, provenance labels, or conversational processing must be compared against `ABC-INTAKE-001` and aligned across the application, PRDs, workflow, evaluation evidence, backlog, and release claims.
