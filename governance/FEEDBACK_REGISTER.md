# Feedback and control register

Owner: Product owner
Review date: August 10, 2026

Authoritative intake decision: `ABC-INTAKE-001` in [PERSONA_GUIDED_INTAKE_DECISION_RECORD.md](../artifacts/PERSONA_GUIDED_INTAKE_DECISION_RECORD.md)

| Feedback / risk | Classification | Product control | Verification |
|---|---|---|---|
| A recommendation system can violate its own prose instructions. | Absolute | Recommendation and disposition are versioned code and rules, not an LLM prompt. | Same-input and ordering-invariance tests. |
| Set the model as deterministic. | Absolute | No generative call in recommendation, evaluation, audit, governance, or approval. | Build inspection and deterministic snapshot test. |
| Evaluation must not grade its own work. | Absolute | Frozen result passes to an independent evaluator that cannot mutate it. | Eval pass plus audit non-mutation contract. |
| Audit and governance need separate authority. | Absolute | Auditor verifies evidence/invariants; governance applies absolute rules; neither selects. | Agent contracts and rule-ID findings. |
| The user may not have enough ideas or workload knowledge. | Requirement | Prompt-first intake offers guided, fast, and synthetic routes with “I don’t know.” | Guided-flow user test. |
| Stop asking when the user knows enough. | Requirement | A completeness check runs after each answer; Estimate now is always available. | Intake transition tests (next iteration). |
| Product authority must not be hard-coded to a named person. | Absolute content rule | Reusable product controls use user, human reviewer, or human decision owner. | Repository text scan. |
| Original and Maven PRDs were missing from GitHub. | Release blocker | Both Markdown PRDs and the workbook live under `artifacts/`; README links are internal. | Link and file check. |
| Workflow, PPT, and a concise recorded-review script are required. | Deliverable | Publish the workflow, twelve-slide deck, and current four-minute talk track as versioned repository artifacts. | Release checklist and slide-notes audit. |
| Other providers must be preserved. | Requirement delivered in catalog alpha | Google Gemini and Anthropic Claude are now cost-visible with evidence states; neither can enter ranking before shared evals. | Provider-neutral regression assertion and catalog review. |
| Imported GitHub agents may create supply-chain risk. | Absolute governance | Pin, inspect, sandbox, adversarially test, hard-border, approve, and re-review. | Import checklist. |
| Medical billing is a valid high-value future use case. | Safety constraint | High-risk, regulated, sensitive, and unknown-data work requires human review; alpha is not a medical production decision tool. | Governance regression cases. |
| Output tokens cannot be a user input; generation length varies by model and run. | Absolute cost rule | COST-001 rejects the field. Each model carries an evidence-labeled low/likely/high output distribution. | Forbidden-input and tier-distribution tests. |
| One call per request hides retries and checker cost. | Absolute cost rule | Primary steps and checker steps are explicit workflow fields; model-specific retry multipliers apply before completed-task cost. | Checker/retry monotonicity test. |
| Monthly cost creates false precision and hides unit economics. | Absolute reporting rule | Rank and headline low/likely/high cost per completed task; show monthly volume only as secondary scale context. | COST-005 and rendered-copy test. |
| Cost evaluation must not reuse the estimator formula. | Absolute audit rule | Cost Evaluation Specialist uses an independent ledger implementation and a corrupted estimate must fail into GOV-009. | Corruption-injection and governance-propagation tests. |
| The product experience must be written for the user, not the internal architecture. | Absolute content rule | Primary copy explains the result, consequence, and next action; specialist names, orchestration mechanics, and future-state implementation language stay behind Details. | Rendered-copy regression and per-release content audit. |
| Product people cannot be expected to estimate tokens or context windows. | Requirement / product-person feedback | Product guided mode asks about familiar task size and derives a labeled token range and context need. Technical values remain optional and inspectable. | Guided-flow, derivation, and rendered-copy tests. |
| A conversational starting task and average-day description better match how a product person thinks. | Requirement / product-person feedback | Begin Product guided intake with an ideal task story and completed-task volume, then ask explicit plain-language questions. | End-to-end first-time-user test. |
| Conversational prose can improve relevance but can also introduce unsupported assumptions. | Absolute intake rule | Free text remains context only. Confirmed structured fields alone enter the deterministic workload contract. | Freeze-boundary and same-input tests. |
| Experienced builders need direct control without the guided explanation. | Persona requirement | Provide Product guided and Advanced builder routes backed by one normalized workload contract and engine. | Cross-route parity test. |
| Technical detail can overwhelm a first-time user but must remain auditable. | Experience control | Collapse technical assumptions in Product guided mode and keep them visible and editable before freeze. | Progressive-disclosure accessibility test. |

## Documentation evaluation

- **Strengthened:** determinism, human decision ownership, fail-closed rules, evaluation evidence, provider-neutral backlog, persona-guided intake, and visible derivations.
- **Consolidated:** PRD, Maven template rendering, workflow, governance, and evaluation now use one shared product vocabulary.
- **Retained:** cost transparency, model comparison, future watchlist/network-value ideas.
- **Retired:** optional generative decision brief and duplicated GitHub Pages calculator logic.
- **Corrected:** reusable product authority is person-neutral; the prior named-user version remains preserved in the locked Git baseline.
- **Open evidence:** any additional class feedback not captured in this register must be added verbatim, classified, and mapped before final class submission.
