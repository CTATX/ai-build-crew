# AI Build Crew — Product Requirements Document

Version: 1.0  
Owner: Product owner
Status: Governed alpha  
Date: August 8, 2026

## Product promise

AI Build Crew helps a builder turn an incomplete AI idea into a transparent workload estimate, a rule-eligible model recommendation, and a governed decision record. It answers three questions: what will this workload cost, which model is fit for it, and what is lost or gained by choosing another model?

## Problem

Model selection is fragmented across pricing pages, capability claims, and personal intuition. Early-stage builders often do not know their token volume, risk level, or even which questions to ask. A cheap recommendation can be unsafe; a powerful default can be wasteful. Existing calculators rarely separate facts from assumptions or show whether an estimate passed independent checks.

## User and job

The first user is a product builder who is unfamiliar with AI model economics and must rapidly evaluate a build idea, forecast cost, and make a defensible model and budget decision. The broader user is any builder, product manager, or team lead planning an AI-enabled workflow.

When considering an AI feature, the user wants to move from a rough idea to a costed, reviewable decision without becoming a pricing or model expert.

## Goals

- Produce a first estimate in under three minutes.
- Distinguish user facts, named assumptions, and unknowns.
- Recommend the least expensive rule-eligible model from a versioned catalog.
- Show low, likely, and high cost-per-completed-task scenarios and alternative-model deltas.
- Run independent evaluation, audit, and governance checks before a human decides.
- Reproduce the same result for the same normalized input, catalog, and rule versions.

## Non-goals for the alpha

- Choosing for the human or silently approving high-risk use cases.
- Claiming cross-provider quality or reliability equivalence before shared task evaluations exist.
- Including storage, retrieval, tool, infrastructure, or human-review charges.
- Accepting secrets, protected health information, or production customer content.
- Treating heuristic quality tiers as measured benchmark truth.

## Experience

The product opens with: “What are you thinking about building?” The user chooses one route:

1. **I know the workload** — go directly to structured capture.
2. **Help me shape it** — answer one Product Factory question at a time.
3. **Use a safe example** — load a versioned synthetic workload.

The guided route asks about the job, consequence of error, data class, modality, and usage. “I don’t know” is valid. “Estimate now” is always available. When minimum facts are present—or the user chooses to proceed—the intake stops and the product presents a Known / Assumed / Unknown ledger for confirmation.

The deterministic pipeline then runs:

`Estimate → Cost Evaluation Specialist → Eligibility → Evaluation → Audit → Governance → human decision`

Results show the recommendation, alternatives, low/likely/high cost per completed task, secondary volume scaling, exclusion reasons, evaluation evidence, governance rule IDs, and the human decision actions.

## Functional requirements

- Capture task, risk, data class, regulatory status, modality, planned completed-task volume, input size, result shape, cache rate, primary steps, checker steps, context, and source provenance. Output tokens are not a user input.
- Validate numeric ranges and never silently classify an unknown safety field as safe.
- Apply a versioned model-specific low/likely/high output-length and retry distribution; calculate uncached input, cached input, primary steps, checker steps, and retries separately.
- Filter unsupported modality, context, and quality candidates before price ranking.
- Rank eligible candidates by likely cost per completed task with a stable tie-breaker. Show monthly volume only as secondary scale context.
- Preserve catalog version, rule version, engine version, assumptions, and input hash.
- Require human review for high-risk, regulated, sensitive, or unknown-data work.
- Block stale pricing, failed evaluation, audit mismatch, no eligible model, or unsafe loop counts.
- Reject any workload contract containing user-entered output tokens. Independently recompute all three cost scenarios before governance.
- Require a rationale for an override; an override never erases warnings or blocks.
- Export a deterministic decision brief and evidence record.

## Determinism contract

The recommendation and approval path contains no generative model call. The same normalized input plus the same catalog and rule versions must produce the same serialized result. Optional future prose assistance may suggest wording, but it must remain non-authoritative, labeled, and confirmed by the user.

## Specialist boundaries

- **Intake Orchestrator:** asks versioned questions and records provenance; cannot recommend.
- **Estimator/Selector:** performs pure calculations and ranking; cannot approve.
- **Cost Evaluation Specialist:** enforces COST-001 through COST-006 and independently recomputes the frozen low/likely/high ledger; cannot change the estimate.
- **Evaluation Agent:** tests a frozen result; cannot mutate it.
- **Audit Agent:** verifies formulas, versions, and evidence; cannot waive findings.
- **Governance Agent:** applies absolute rules and returns PASS, WARN, REVIEW_REQUIRED, or BLOCKED; cannot choose a model.
- **Human Decision Gate:** the accountable person approves, edits, rejects, escalates, or records a justified permitted override.

## Measurement

- Completion: a user produces a decision brief in under three minutes on the fast path.
- Comprehension: the user can explain the recommendation and one alternative tradeoff.
- Reliability: 100% pass on deterministic and governance regression cases.
- Safety: zero high-risk or unknown-sensitivity cases marked ready without review.
- Traceability: every decision includes inputs, assumptions, versions, findings, and disposition.

## Alpha acceptance criteria

1. A credential-free production build renders the full workflow.
2. Same input and versions produce identical results.
3. Low, likely, and high cost-per-completed-task results are ordered and transparent.
4. Candidate ordering does not alter the recommendation.
5. Unsupported modality or no eligible candidate blocks recommendation.
6. High-risk, regulated, sensitive, or unknown-data cases require review.
7. Stale pricing, failed evaluation, or audit mismatch blocks finalization.
8. Assumptions remain visible and create at least a warning.
9. A human—not the system—owns the final decision.
10. The repository publishes the PRDs, workflow, evaluation, governance, backlog, deck, and demo script.
11. Output tokens are rejected as workload input; model-owned output and retry distributions are versioned and visibly labeled as measured or heuristic.
12. Checker steps and retry multipliers are included, and a deliberately corrupted ledger blocks governance.

## Launch plan

Use a first-time product builder on three real planning decisions and at least two synthetic failure cases. Record time-to-estimate, confidence before/after, misunderstood fields, and missing costs. Revise the question order and default scenarios from evidence before adding providers.

## Future state

The provider-neutral catalog now includes OpenAI, Google Gemini, and Anthropic Claude with explicit evidence states. Next add measured shared task evaluations, automated refresh, watchlists, price/deprecation alerts, workload imports, full system cost, team policies, and privacy-preserving benchmarking. These remain tracked in [BACKLOG.md](BACKLOG.md).
