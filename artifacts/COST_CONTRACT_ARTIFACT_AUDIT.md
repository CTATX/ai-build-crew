# Cost-contract artifact alignment audit

Status: **aligned locally; not deployed**  
Review date: August 9, 2026

## Absolute correction

The current candidate treats output length and retry behavior as model-and-task behavior, not as fixed user workload facts. A user chooses the desired result shape, primary workflow steps, checker steps, volume, input size, and optional cost-per-completed-task ceiling. The engine applies evidence-labeled low, likely, and high output/retry profiles for each model.

The primary decision unit is low, likely, and high **cost per completed task**. Monthly cost is secondary scale context. COST-001 rejects a raw output-token input. The Cost Evaluation Specialist independently recomputes all three ledgers; a mismatch fails evaluation and GOV-009 blocks governance. GOV-015 keeps heuristic behavior profiles visible until repeated live evaluations replace them with measured distributions.

## Artifact map

| Artifact | Alignment evidence | State |
|---|---|---|
| Application and deterministic engine | Result shape replaces output tokens; primary/checker steps and per-task ceiling are explicit; model-owned output/retry profiles drive three completed-task scenarios. | Updated locally |
| Cost rules | COST-001 through COST-006 define the forbidden input, ordered distributions, workflow-step coverage, independent recomputation, primary reporting unit, and evidence labeling. | Updated locally |
| Evaluation and governance | 18/18 automated checks pass, including deliberate ledger corruption, multi-format eligibility, workflow-step guidance, model-tier switching, and GOV-009 propagation; GOV-015 discloses heuristic evidence. | Verified locally |
| Original PRD | Problem, workflow, output, evaluation, privacy, and limitations use the corrected contract. | Updated locally |
| Maven / Product Faculty PRD Markdown | Discovery, Design, Develop, Deploy, and final checks use the corrected contract and person-neutral first-user language. | Updated locally |
| Builder Badge workbook | All response cells are self-contained; the workbook contains no named-person decision authority and distinguishes published prices from heuristic behavior. | Rendered and verified |
| Workflow and TeamOS | The Cost Evaluation Specialist is a hard-bordered stage; failure returns to the earliest failed evidence stage. | Updated locally |
| Recording deck and talk track | Eight slides and four-minute notes tell the same problem → user → product → cost spread → hard evaluation → evidence → next-release story. | Rendered and verified |
| README, GitHub Pages copy, backlog, capability audit, and release notes | Current claims use cost per completed task and preserve live measurement, saved history, and provider-wide evaluation as future work. | Updated locally |

## Verification completed

- 18 automated application checks pass.
- Production build and lint pass locally.
- Workbook formula-error scan returns zero matches; the full sheet was rendered and visually reviewed.
- Presentation overflow and template-fidelity checks pass with zero issues; all eight slides and all eight source-note blocks were reviewed.
- Current-artifact drift scan finds no active output-token input, named decision-owner persona, or stale test-count claim. Historical release notes remain unchanged where they accurately describe the prior deployed version.

## Release boundary

This audit does not claim deployment. The public Sites application and GitHub Pages remain on the previously deployed release until the corrected candidate is reviewed, committed, tagged, deployed to both channels, and smoke-tested from the same commit. The prior workbook and presentation remain as historical artifacts; the corrected files are the release candidates linked from the README.
