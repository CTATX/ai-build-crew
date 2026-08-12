# Product Faculty — Agentic AI PRD: AI Build Crew

Owner: Product owner
Agent name: AI Build Crew  
Workflow: A builder describes an AI workload; the system separates facts from assumptions, estimates scenario cost, selects the least expensive rule-eligible model, runs evaluation/audit/governance checks, and returns the decision to a human.
Date: August 10, 2026

Authoritative intake decision: `ABC-INTAKE-001`

## Discover

| Template prompt | Answer |
|---|---|
| User | Primary: a product builder who knows the user, job, and desired outcome but not model economics. Secondary: an advanced builder who knows the workload details and wants direct controls. |
| Specific user need | Turn an incomplete idea into a costed, explainable, governed model decision quickly. |
| Recurring workflow | For each feature or agent idea, estimate workload, compare models, review risks, and record a decision. |
| Trigger | A new AI idea, architecture choice, budget review, provider change, or material workload change. |
| Current process | Visit pricing pages, make token guesses, compare broad capability claims, and capture rationale manually. |
| Pain point | The user may not know what to estimate; prices and capabilities are fragmented; assumptions disappear; powerful defaults waste money while cheap defaults can increase risk. |
| Agent opportunity | Meet each persona at the right level, translate familiar product choices into visible technical planning assumptions, expose uncertainty, run deterministic math and policies, and prepare a human-owned decision. |
| Synthetic data | Versioned fictional workloads with no secrets or protected content. |
| Safe-fail data | Unknown sensitivity never defaults to safe; sensitive or regulated work requires human review. |
| Human boundary | A human owns approval. High-risk, regulated, sensitive, or unknown-data cases cannot self-approve. |
| Success metric | Primary: 100% of controlled cost cases match the known answer key at engine precision; any mismatch blocks release. Safety: zero fabricated price/capability claims and zero unsafe ready states. Secondary usability target: first estimate in under three minutes with one assumption and one alternative explained. |

## Design

| Template prompt | Answer |
|---|---|
| Agent definition | A deterministic workload-estimation and model-decision workbench—not an autonomous purchaser or approver. |
| Agent role | Intake Orchestrator, Estimator/Selector, Cost Evaluation Specialist, Evaluator, Auditor, Governance checker, deterministic Presenter, Human Decision Gate. |
| Target workflow | Persona → ideal task and average-day volume or direct technical capture → explicit plain-language choices → provenance review → frozen workload → estimate → independent cost evaluation → eligibility → evaluation → audit → governance → human decision → export. |
| Ranking rubric | Capability, context, every required format, freshness, risk/regulation, and minimum quality are pass/fail gates. Among surviving evaluated candidates, likely cost per completed task has 100% ranking weight. Latency and quality above the threshold have 0% weight until shared measured evidence exists. |
| Agent loop | Product guided asks one familiar question at a time; Advanced builder exposes direct controls. Free text is context only. The estimator starts only after structured values and their provenance are confirmed. Evaluation, audit, and governance run once against the frozen result. |
| Inputs/context | Ideal task, average-day completed-task volume, task type, desired result, consequence of failure, data class, regulation, every required format, familiar information size, cache rate, optional affordability ceiling, and field provenance. Product guided derives and labels tokens and context; Advanced builder may inspect or edit them. Output tokens are a model distribution, never a workload input. When primary/checker steps are unknown, a deterministic workflow rule recommends a visible starting architecture for confirmation. |
| Tools/actions | Versioned model catalog, deterministic cost engine, eligibility rules, fixed eval cases, governance rules, audit recorder, and deterministic templates. |
| Memory | Store only normalized assumptions, decisions, versions, and findings. Never store API keys, secrets, PHI, or production prompts. |
| Output | Low/likely/high cost per completed task, secondary monthly scale context, recommendation and alternatives, cost deltas, exclusions, cost-contract evidence, governance disposition, and decision brief. |
| Escalation | BLOCKED for stale catalog, no eligible model, failed evaluation, audit mismatch, or unsafe loops. REVIEW_REQUIRED for high-risk, regulated, sensitive, or unknown data. |
| Approval | A human can approve only READY_FOR_HUMAN_DECISION. A permitted override requires rationale and never clears an absolute block. |
| Initial eval plan | COST-001 through COST-006, independent three-scenario recomputation, corrupted-ledger blocking, formula boundaries, stable ordering, capability exclusion, risk/data fail-closed rules, stale catalog, assumptions, loop limits, mutation resistance, and synthetic golden cases. |

## Develop

| Template prompt | Answer |
|---|---|
| Prototype | Responsive web workbench with Product guided and Advanced builder entry, conversational task and average-day prompts, plain-language questions, visible technical derivations, workload freeze, model comparison, findings, and point-in-time report actions. |
| User interaction | Mouse or keyboard; every unknown and assumption remains visible; Estimate now provides a fast escape from discovery. |
| Demo-safe data | A synthetic support-classification workload with Internal data and configurable usage. |
| Eval cases | Same-input determinism, model-owned output distributions, retry/checker inclusion, corrupted-ledger detection, governance propagation, scenario ordering, high risk, unknown sensitivity, conjunctive multi-format requirements, unknown-step workflow guidance, Luna/Terra/Sol tier switching, stale pricing, assumptions, loop thresholds, candidate-order invariance, and render smoke. |
| Eval result | 36 passed, 0 failed on August 10, 2026. This verifies current deterministic and workflow controls, not universal persona comprehension or measured cross-provider quality. Published prices are dated facts; output and retry distributions remain planning heuristics until repeated live evaluation measures them. |
| Iteration | Removed the generative recommendation route; added provenance, persona-guided intake, conversational context fields, visible token/context derivation, versioned rules/catalog, independent checks, and fail-closed dispositions. |
| Known limitations | Three-provider catalog comparison is implemented, but only the OpenAI baseline has heuristic rank eligibility. Google and Anthropic remain catalog-only until shared task evals measure quality, reliability, and latency. Tool, storage, retrieval, infrastructure, and human-review costs are incomplete; decisions are not yet persisted. |

## Deploy

| Template prompt | Answer |
|---|---|
| Working demo | Full app on OpenAI Sites; artifact hub on GitHub Pages; source and evidence in GitHub. |
| Pilot readiness | Ready for a small Alpha on synthetic or non-sensitive planning inputs. Not production-ready for medical billing decisions. |
| Rollout | First-time-builder tests → synthetic failure tests → three real planning sessions → question/default revision → provider expansion. |
| Monitoring | Hard stops: any controlled-case answer-key mismatch blocks release; one confirmed fabricated capability/price rolls back the candidate catalog; catalog age beyond its freshness limit blocks. After actual-charge integration, absolute forecast variance above 20% across the first 30 comparable completed tasks pauses profile promotion. Rollback restores the previous immutable release/Sites version, preserves failed evidence, and uses a normal Git revert rather than moving a tag. |
| Stop conditions | Any formula regression, stale catalog, policy mismatch, secret/PHI exposure, unsupported capability selection, or high-risk auto-approval. |
| Demo steps | Enter an idea, choose Product guided, describe an ideal task and average day, answer plain-language questions, inspect the derived token/context assumptions, freeze the workload, review cost per completed task and tradeoffs, and export the point-in-time evidence. Then show the Advanced builder route uses the same engine. |
| Demo narrative | AI Build Crew reduces guesswork without hiding uncertainty. Deterministic math and independent gates make the decision explainable and repeatable. |
| Next learning | Does a first-time builder trust the recommendation more, and which missing cost or capability changes the decision most often? |

## Final readiness check

- One specific first user: **Yes — a first-time product builder who does not know model economics.**
- One recurring workflow: **Yes — model and cost decision for an AI workload.**
- Clear agent actions and boundaries: **Yes.**
- Human approval point: **Yes — Human Decision Gate.**
- Synthetic demo-safe data: **Yes.**
- Defined evaluation plan and result: **Yes — 36/36 pass for the current decision and persona-guided workflow controls. This proves deterministic behavior and implemented checks, not measured cross-provider quality or universal first-user comprehension.**
- Honest limitations and stop conditions: **Yes.**
- End-to-end demo and deployment evidence: **Yes.**
