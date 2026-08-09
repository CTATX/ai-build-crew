# Product Faculty — Agentic AI PRD: AI Build Crew

Owner: Product owner
Agent name: AI Build Crew  
Workflow: A builder describes an AI workload; the system separates facts from assumptions, estimates scenario cost, selects the least expensive rule-eligible model, runs evaluation/audit/governance checks, and returns the decision to a human.
Date: August 8, 2026

## Discover

| Template prompt | Answer |
|---|---|
| User | A first-time product builder; later product teams and team leads planning AI workflows. |
| Specific user need | Turn an incomplete idea into a costed, explainable, governed model decision quickly. |
| Recurring workflow | For each feature or agent idea, estimate workload, compare models, review risks, and record a decision. |
| Trigger | A new AI idea, architecture choice, budget review, provider change, or material workload change. |
| Current process | Visit pricing pages, make token guesses, compare broad capability claims, and capture rationale manually. |
| Pain point | The user may not know what to estimate; prices and capabilities are fragmented; assumptions disappear; powerful defaults waste money while cheap defaults can increase risk. |
| Agent opportunity | Guide only as far as needed, expose uncertainty, run deterministic math and policies, and prepare a human-owned decision. |
| Synthetic data | Versioned fictional workloads with no secrets or protected content. |
| Safe-fail data | Unknown sensitivity never defaults to safe; sensitive or regulated work requires human review. |
| Human boundary | A human owns approval. High-risk, regulated, sensitive, or unknown-data cases cannot self-approve. |
| Success metric | First estimate in under three minutes; user can explain the recommendation; all regression and governance cases pass. |

## Design

| Template prompt | Answer |
|---|---|
| Agent definition | A deterministic workload-estimation and model-decision workbench—not an autonomous purchaser or approver. |
| Agent role | Intake Orchestrator, Estimator/Selector, Cost Evaluation Specialist, Evaluator, Auditor, Governance checker, deterministic Presenter, Human Decision Gate. |
| Target workflow | Prompt → route → guided or fast capture → Known/Assumed/Unknown confirmation → estimate → independent cost evaluation → eligibility → evaluation → audit → governance → human decision → export. |
| Agent loop | One versioned question at a time; stop when minimum facts are present or the user selects Estimate now. Evaluation, audit, and governance run once against a frozen result. |
| Inputs/context | Task, consequence of error, data class, regulation, every required format, completed tasks/day, input size, desired result shape, cache rate, optional per-task affordability ceiling, context requirement, and field provenance. Output tokens are a model distribution, never a workload input. When primary/checker steps are unknown, a deterministic workflow rule recommends a visible starting architecture for confirmation. |
| Tools/actions | Versioned model catalog, deterministic cost engine, eligibility rules, fixed eval cases, governance rules, audit recorder, and deterministic templates. |
| Memory | Store only normalized assumptions, decisions, versions, and findings. Never store API keys, secrets, PHI, or production prompts. |
| Output | Low/likely/high cost per completed task, secondary monthly scale context, recommendation and alternatives, cost deltas, exclusions, cost-contract evidence, governance disposition, and decision brief. |
| Escalation | BLOCKED for stale catalog, no eligible model, failed evaluation, audit mismatch, or unsafe loops. REVIEW_REQUIRED for high-risk, regulated, sensitive, or unknown data. |
| Approval | A human can approve only READY_FOR_HUMAN_DECISION. A permitted override requires rationale and never clears an absolute block. |
| Initial eval plan | COST-001 through COST-006, independent three-scenario recomputation, corrupted-ledger blocking, formula boundaries, stable ordering, capability exclusion, risk/data fail-closed rules, stale catalog, assumptions, loop limits, mutation resistance, and synthetic golden cases. |

## Develop

| Template prompt | Answer |
|---|---|
| Prototype | Responsive web workbench with prompt-first routing, guided questions, workload freeze, model comparison, four-stage evidence strip, findings, and human decision actions. |
| User interaction | Mouse or keyboard; every unknown and assumption remains visible; Estimate now provides a fast escape from discovery. |
| Demo-safe data | A synthetic support-classification workload with Internal data and configurable usage. |
| Eval cases | Same-input determinism, model-owned output distributions, retry/checker inclusion, corrupted-ledger detection, governance propagation, scenario ordering, high risk, unknown sensitivity, conjunctive multi-format requirements, unknown-step workflow guidance, Luna/Terra/Sol tier switching, stale pricing, assumptions, loop thresholds, candidate-order invariance, and render smoke. |
| Eval result | 15 passed, 0 failed on August 8, 2026. Published prices are dated facts; output and retry distributions remain planning heuristics until repeated live evaluation measures them. |
| Iteration | Removed the generative recommendation route; added provenance, guided intake, versioned rules/catalog, independent checks, and fail-closed dispositions. |
| Known limitations | Three-provider catalog comparison is implemented, but only the OpenAI baseline has heuristic rank eligibility. Google and Anthropic remain catalog-only until shared task evals measure quality, reliability, and latency. Tool, storage, retrieval, infrastructure, and human-review costs are incomplete; decisions are not yet persisted. |

## Deploy

| Template prompt | Answer |
|---|---|
| Working demo | Full app on OpenAI Sites; artifact hub on GitHub Pages; source and evidence in GitHub. |
| Pilot readiness | Ready for a small Alpha on synthetic or non-sensitive planning inputs. Not production-ready for medical billing decisions. |
| Rollout | First-time-builder tests → synthetic failure tests → three real planning sessions → question/default revision → provider expansion. |
| Monitoring | Test pass rate, decision disposition counts, time-to-estimate, assumption rate, overrides, review/block causes, catalog freshness, and documentation drift. |
| Stop conditions | Any formula regression, stale catalog, policy mismatch, secret/PHI exposure, unsupported capability selection, or high-risk auto-approval. |
| Demo steps | Enter an idea, choose Guide me to an estimate, answer or skip questions, freeze workload, review the recommendation and tradeoffs, inspect evaluation/audit/governance, and show human decision ownership. |
| Demo narrative | AI Build Crew reduces guesswork without hiding uncertainty. Deterministic math and independent gates make the decision explainable and repeatable. |
| Next learning | Does a first-time builder trust the recommendation more, and which missing cost or capability changes the decision most often? |

## Final readiness check

- One specific first user: **Yes — a first-time product builder who does not know model economics.**
- One recurring workflow: **Yes — model and cost decision for an AI workload.**
- Clear agent actions and boundaries: **Yes.**
- Human approval point: **Yes — Human Decision Gate.**
- Synthetic demo-safe data: **Yes.**
- Defined evaluation plan and result: **Yes — 18/18 pass for the corrected decision contract. This proves deterministic selection and controls, not measured cross-provider quality.**
- Honest limitations and stop conditions: **Yes.**
- End-to-end demo and deployment evidence: **Yes.**
