# AI Build Crew

**Pick the right model. Know the cost.**

AI Build Crew is a governed alpha decision workbench for product builders. It guides an incomplete idea into a transparent workload estimate, recommends the least expensive rule-eligible model, and runs independent evaluation, audit, and governance checks before CT makes the decision.

## Alpha scope

- Prompt-first fast, guided, and synthetic-example routes.
- A persistent workload prompt with explicit input/output tokens per call.
- An optional hard monthly budget ceiling; the system blocks rather than recommends an over-budget model.
- Known / Assumed / Unknown provenance for every planning decision.
- Low, expected, and high workload scenarios.
- Explainable model eligibility based on task requirements and hard capability constraints.
- Published catalog comparison across three OpenAI, two Google Gemini, and three Anthropic Claude models.
- Cross-provider quality ranking held back until every provider runs the same workload evaluation.
- Independent deterministic evaluation, audit, and governance stages.
- A CT decision gate; high-risk and uncertain safety cases fail closed.

Every catalog field carries a source date and evidence state. The catalog was checked against published [OpenAI](https://developers.openai.com/api/docs/models), [Google Gemini](https://ai.google.dev/api/models), and [Anthropic Claude](https://platform.claude.com/docs/en/api/models/list) documentation on August 8, 2026.

## Cost method

```text
cost per request = calls × ((uncached input tokens × input price)
                  + (cached input tokens × cached-input price)
                  + (output tokens × output price)) ÷ 1,000,000

monthly cost = cost per request × requests per day × 30
low / expected / high = versioned workload scenarios
```

The normalized estimate includes standard token input, cached-read, and output fields. Provider-specific cache writes, cache storage, grounding/search, tools, batch modes, regional premiums, infrastructure, and human review remain explicit coverage gaps.

## Run locally

Requires Node.js 22+ and pnpm.

1. Install packages: `pnpm install`
2. Start: `pnpm dev`
3. Visit `http://localhost:3000`

The complete governed workflow works without an API key. The recommendation and approval path contains no generative model call.

## Evidence and artifacts

- [Alpha v0.1.0 release notes](RELEASE_NOTES.md)
- [Custom-domain setup](artifacts/CUSTOM_DOMAIN_SETUP.md)
- [Evaluation results](EVALUATION.md)
- [Future-state requirements](FUTURE_STATE.md)
- [Original product requirements document](artifacts/ORIGINAL_PRD.md)
- [Maven / Product Faculty PRD](artifacts/MAVEN_AGENTIC_AI_PRD.md)
- [Builder Badge workbook](artifacts/AI_Build_Crew_Agentic_AI_PRD.xlsx)
- [Repeatable governed workflow](WORKFLOW.md)
- [Governance and evaluation specification](governance/GOVERNANCE_AND_EVALUATION.md)
- [Feedback register](governance/FEEDBACK_REGISTER.md)
- [Product backlog](artifacts/BACKLOG.md)
- [Overview presentation](artifacts/AI_BUILD_CREW_OVERVIEW.pptx)
- [2–3 minute demo script](artifacts/DEMO_SCRIPT.md)

## Publishing model

The full application is deployed on OpenAI Sites. The `docs/` build is a key-free GitHub Pages artifact hub. Both are safe to publish because no AI credential is required.

## Repeatable delivery loop

1. Discover one user, one recurring decision, and one measurable pain.
2. Design the smallest end-to-end workflow and define human approval points.
3. Develop deterministic logic first; add model intelligence only where it improves the decision.
4. Evaluate representative, boundary, and failure cases.
5. Deploy privately, validate, then broaden access intentionally.
6. Record results and the next learning in the PRD.
