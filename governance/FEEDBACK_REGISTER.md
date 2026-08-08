# Feedback and control register

Owner: CT  
Review date: August 8, 2026

| Feedback / risk | Classification | Product control | Verification |
|---|---|---|---|
| A recommendation system can violate its own prose instructions. | Absolute | Recommendation and disposition are versioned code and rules, not an LLM prompt. | Same-input and ordering-invariance tests. |
| Set the model as deterministic. | Absolute | No generative call in recommendation, evaluation, audit, governance, or approval. | Build inspection and deterministic snapshot test. |
| Evaluation must not grade its own work. | Absolute | Frozen result passes to an independent evaluator that cannot mutate it. | Eval pass plus audit non-mutation contract. |
| Audit and governance need separate authority. | Absolute | Auditor verifies evidence/invariants; governance applies absolute rules; neither selects. | Agent contracts and rule-ID findings. |
| The user may not have enough ideas or workload knowledge. | Requirement | Prompt-first intake offers guided, fast, and synthetic routes with “I don’t know.” | Guided-flow user test. |
| Stop asking when the user knows enough. | Requirement | A completeness check runs after each answer; Estimate now is always available. | Intake transition tests (next iteration). |
| The first-user persona must use the corrected name CT. | Absolute content rule | CT is the named first user and final decision owner in every artifact. | Repository text scan. |
| Original and Maven PRDs were missing from GitHub. | Release blocker | Both Markdown PRDs and the workbook live under `artifacts/`; README links are internal. | Link and file check. |
| Workflow, PPT, and a 2–3 minute script are required. | Deliverable | Publish all three as versioned repository artifacts. | Release checklist. |
| Other providers must be preserved. | Future requirement | Google Gemini and Anthropic Claude lead the provider-neutral P1 backlog. | Backlog review. |
| Imported GitHub agents may create supply-chain risk. | Absolute governance | Pin, inspect, sandbox, adversarially test, hard-border, approve, and re-review. | Import checklist. |
| Medical billing is a valid high-value future use case. | Safety constraint | High-risk, regulated, sensitive, and unknown-data work requires human review; alpha is not a medical production decision tool. | Governance regression cases. |

## Documentation evaluation

- **Strengthened:** determinism, human decision ownership, fail-closed rules, evaluation evidence, provider-neutral backlog.
- **Consolidated:** PRD, Maven template rendering, workflow, governance, and evaluation now use one shared product vocabulary.
- **Retained:** cost transparency, model comparison, future watchlist/network-value ideas.
- **Retired:** optional generative decision brief and duplicated GitHub Pages calculator logic.
- **Corrected:** all first-user references use CT.
- **Open evidence:** any additional class feedback not captured in this register must be added verbatim, classified, and mapped before final class submission.
