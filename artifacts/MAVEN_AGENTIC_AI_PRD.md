# Product Faculty — Agentic AI PRD: AI Build Crew

Owner: CT  
Agent name: AI Build Crew  
Workflow: A builder describes an AI workload; the system separates facts from assumptions, estimates scenario cost, selects the least expensive rule-eligible model, runs evaluation/audit/governance checks, and returns the decision to CT.  
Date: August 8, 2026

## Discover

| Template prompt | Answer |
|---|---|
| User | CT first; later product builders and team leads planning AI workflows. |
| Specific user need | Turn an incomplete idea into a costed, explainable, governed model decision quickly. |
| Recurring workflow | For each feature or agent idea, estimate workload, compare models, review risks, and record a decision. |
| Trigger | A new AI idea, architecture choice, budget review, provider change, or material workload change. |
| Current process | Visit pricing pages, make token guesses, compare broad capability claims, and capture rationale manually. |
| Pain point | The user may not know what to estimate; prices and capabilities are fragmented; assumptions disappear; powerful defaults waste money while cheap defaults can increase risk. |
| Agent opportunity | Guide only as far as needed, expose uncertainty, run deterministic math and policies, and prepare a human-owned decision. |
| Synthetic data | Versioned fictional workloads with no secrets or protected content. |
| Safe-fail data | Unknown sensitivity never defaults to safe; sensitive or regulated work requires human review. |
| Human boundary | CT owns approval. High-risk, regulated, sensitive, or unknown-data cases cannot self-approve. |
| Success metric | First estimate in under three minutes; user can explain the recommendation; all regression and governance cases pass. |

## Design

| Template prompt | Answer |
|---|---|
| Agent definition | A deterministic workload-estimation and model-decision workbench—not an autonomous purchaser or approver. |
| Agent role | Intake Orchestrator, Estimator/Selector, Evaluator, Auditor, Governance checker, deterministic Presenter, CT Decision Gate. |
| Target workflow | Prompt → route → guided or fast capture → Known/Assumed/Unknown confirmation → estimate → eligibility → evaluation → audit → governance → CT decision → export. |
| Agent loop | One versioned question at a time; stop when minimum facts are present or CT selects Estimate now. Evaluation, audit, and governance run once against a frozen result. |
| Inputs/context | Task, consequence of error, data class, regulation, modality, daily requests, input/output tokens, cache rate, calls, context requirement, and field provenance. |
| Tools/actions | Versioned model catalog, deterministic cost engine, eligibility rules, fixed eval cases, governance rules, audit recorder, and deterministic templates. |
| Memory | Store only normalized assumptions, decisions, versions, and findings. Never store API keys, secrets, PHI, or production prompts. |
| Output | Low/expected/high forecast, recommendation and alternatives, cost deltas, exclusions, eval evidence, governance disposition, and decision brief. |
| Escalation | BLOCKED for stale catalog, no eligible model, failed evaluation, audit mismatch, or unsafe loops. REVIEW_REQUIRED for high-risk, regulated, sensitive, or unknown data. |
| Approval | CT can approve only READY_FOR_CT_DECISION. Override requires rationale and never clears an absolute block. |
| Initial eval plan | Formula boundaries, stable ordering, capability exclusion, risk/data fail-closed rules, stale catalog, assumptions, loop limits, mutation resistance, and synthetic golden cases. |

## Develop

| Template prompt | Answer |
|---|---|
| Prototype | Responsive web workbench with prompt-first routing, guided questions, workload freeze, model comparison, four-stage evidence strip, findings, and CT decision actions. |
| User interaction | Mouse or keyboard; every unknown and assumption remains visible; Estimate now provides a fast escape from discovery. |
| Demo-safe data | A synthetic support-classification workload with Internal data and configurable usage. |
| Eval cases | Same-input determinism, scenario ordering, high risk, unknown sensitivity, unsupported modality, stale pricing, assumptions, loop thresholds, candidate-order invariance, and render smoke test. |
| Eval result | 10 passed, 0 failed on August 8, 2026. |
| Iteration | Removed the generative recommendation route; added provenance, guided intake, versioned rules/catalog, independent checks, and fail-closed dispositions. |
| Known limitations | Three-provider catalog comparison is implemented, but only the OpenAI baseline has heuristic rank eligibility. Google and Anthropic remain catalog-only until shared task evals measure quality, reliability, and latency. Tool, storage, retrieval, infrastructure, and human-review costs are incomplete; decisions are not yet persisted. |

## Deploy

| Template prompt | Answer |
|---|---|
| Working demo | Full app on OpenAI Sites; artifact hub on GitHub Pages; source and evidence in GitHub. |
| Pilot readiness | Ready for CT-only alpha on synthetic or non-sensitive planning inputs. Not production-ready for medical billing decisions. |
| Rollout | CT fast-path tests → synthetic failure tests → three real planning sessions → question/default revision → provider expansion. |
| Monitoring | Test pass rate, decision disposition counts, time-to-estimate, assumption rate, overrides, review/block causes, catalog freshness, and documentation drift. |
| Stop conditions | Any formula regression, stale catalog, policy mismatch, secret/PHI exposure, unsupported capability selection, or high-risk auto-approval. |
| Demo steps | Enter an idea, choose Help me shape it, answer or skip questions, freeze workload, review the recommendation and tradeoffs, inspect eval/audit/governance, and show CT decision ownership. |
| Demo narrative | AI Build Crew reduces guesswork without hiding uncertainty. Deterministic math and independent gates make the decision explainable and repeatable. |
| Next learning | Does CT trust the recommendation more, and which missing cost/capability changes the decision most often? |

## Final readiness check

- One specific first user: **Yes — CT.**
- One recurring workflow: **Yes — model and cost decision for an AI workload.**
- Clear agent actions and boundaries: **Yes.**
- Human approval point: **Yes — CT Decision Gate.**
- Synthetic demo-safe data: **Yes.**
- Defined evaluation plan and result: **Yes — 10/10 pass.**
- Honest limitations and stop conditions: **Yes.**
- End-to-end demo and deployment evidence: **Yes.**
