# AI Build Crew

AI Build Crew is one governed Decision Orchestrator with deterministic specialist stages. It does not use an LLM to calculate, rank, audit, or approve an estimate; the current decision workflow therefore costs $0.00 in model tokens.

**Describe an AI workload. Get a cost-per-completed-task range and a model starting point.**

AI Build Crew is a governed decision workbench for product builders. It guides an incomplete idea into a transparent model-usage estimate, recommends the least expensive rule-eligible model, and produces separate evaluation, audit, and governance findings before a human decision owner decides. It does not yet estimate software labor or complete application infrastructure cost.

## Current prototype scope

- Prompt-first fast, guided, and synthetic-example routes.
- Persona-based entry: a product-guided experience for people who know the user and outcome, plus an advanced-builder path for direct technical controls.
- Conversational task and average-day prompts followed by explicit product-language questions for job, result, risk, data, formats, information size, and daily volume.
- Derived input-token range and context requirement; technical values stay collapsed and optional for product-guided users.
- A persistent workload prompt with explicit input size, result shape, primary steps, and checker steps. Output tokens are never accepted as workload input.
- An optional hard cost-per-completed-task ceiling; the system blocks rather than recommends an over-budget model.
- A visible field-level assumption ledger; a richer per-field provenance record remains planned.
- Model-specific low, likely, and high output/retry scenarios.
- Explainable model eligibility based on task requirements and hard capability constraints.
- Published catalog comparison across three OpenAI, two Google Gemini, and three Anthropic Claude models.
- Cross-provider quality ranking held back until every provider runs the same workload evaluation.
- A hard deterministic Cost Evaluation Specialist, plus separate audit and governance outputs.
- A human decision gate; high-risk and uncertain safety cases fail closed.

Every model record carries a source date and evidence state, with provider-level source references. Field-level price provenance remains planned. The catalog was checked against published [OpenAI](https://developers.openai.com/api/docs/models/compare), [Google Gemini](https://ai.google.dev/gemini-api/docs/pricing), and [Anthropic Claude](https://platform.claude.com/docs/en/about-claude/pricing) documentation on August 9, 2026. That release audit corrected drift in the OpenAI Luna and Terra price rows before deployment.

## Phase 2 implementation status

- `/compare` provides a public, zero-spend catalog comparison with provider, format, context, price, and evidence filters.
- Live evaluation remains explicit and off by default for visitors; the public catalog makes no provider call.
- The owner-only OpenAI preview caps execution at one model, three synthetic cases, one repeat, zero retries, one concurrent call, and $1 per approved run.
- OpenAI, Google, and Anthropic runner adapters rehearse as no-network mocks against the same frozen request hash; only the OpenAI owner preview has a live provider path.
- Raw ideas, prompts, and outputs are rejected from the run contract; only aggregate usage is enabled for future retention by default.
- The synthetic inventory-assistant workload now rehearses all three adapters against the same frozen request without content retention or spending.
- The provider-result contract requires token usage, retry count, latency, provider-reported charge, calculated charge, and reconciliation status.
- The OpenAI Responses API adapter is implemented with `store: false`, hash-only output retention, a 300-output-token limit per case, no retries, a predicted maximum, and a hard $1 circuit breaker.
- Paid execution is guarded by the reviewed policy, protected provider secret, stable site-owner allowlist, explicit per-run approval, predicted maximum, and hard-dollar circuit breaker.
- Each completed provider case returns the approved structured evidence contract: provider/model, request/workload hashes, case/status, token classes, tool calls, latency, retries, charge reconciliation, retention flags, and output hash.
- The product-guided estimator translates familiar choices such as pages, documents, and completed daily tasks into visible token/context assumptions before deterministic costing.

## Cost method

```text
model output = chosen result shape × model low/likely/high output multiplier
attempted calls = (primary steps + checker steps) × model retry multiplier
cost per completed task = primary-call cost + checker-call cost, including retries
monthly scale context = cost per completed task × completed tasks per day × 30
```

Published token prices remain catalog facts. Output and retry distributions are versioned planning heuristics until live evaluations replace them with measured distributions. Provider-specific cache writes, cache storage, grounding/search, tools, batch modes, regional premiums, infrastructure, and human review remain explicit coverage gaps.

## Run locally

Requires Node.js 22+ and pnpm.

1. Install packages: `pnpm install`
2. Start: `pnpm dev`
3. Visit `http://localhost:3000`

The complete governed workflow works without an API key. The recommendation and approval path contains no generative model call.

## Evidence and artifacts

- [Persona-guided intake decision record](artifacts/PERSONA_GUIDED_INTAKE_DECISION_RECORD.md)
- [Governed cost-contract release notes](RELEASE_NOTES.md)
- [Audited v0.1.0 release record](artifacts/RELEASE_v0.1.0_AUDIT.md)
- [Capability and channel audit](artifacts/CAPABILITY_AND_CHANNEL_AUDIT.md)
- [Comparable market discovery](artifacts/MARKET_DISCOVERY.md)
- [Multi-agent provider platform plan](artifacts/MULTI_AGENT_PROVIDER_PLATFORM_PLAN.md)
- [Self-test cycle](artifacts/SELF_TEST_CYCLE.md)
- [Release manifest](RELEASE_MANIFEST.json)
- [Productization audit](artifacts/PRODUCTIZATION_AUDIT.md)
- [GitHub and Sites release workflow](artifacts/GIT_SITES_RELEASE_WORKFLOW.md)
- [Deployment record](artifacts/DEPLOYMENT_RECORD.md)
- [TeamOS specialist workflow](TEAM_OS.md)
- [Custom-domain setup](artifacts/CUSTOM_DOMAIN_SETUP.md)
- [Evaluation results](EVALUATION.md)
- [Future-state requirements](FUTURE_STATE.md)
- [Original product requirements document](artifacts/ORIGINAL_PRD.md)
- [Maven / Product Faculty PRD](artifacts/MAVEN_AGENTIC_AI_PRD.md)
- [Builder Badge workbook — corrected cost contract](artifacts/AI_Build_Crew_Agentic_AI_PRD_COST_CONTRACT.xlsx)
- [Repeatable governed workflow](WORKFLOW.md)
- [Governance and evaluation specification](governance/GOVERNANCE_AND_EVALUATION.md)
- [Feedback register](governance/FEEDBACK_REGISTER.md)
- [Product backlog](artifacts/BACKLOG.md)
- [Recording-ready presentation — corrected cost contract](artifacts/AI_BUILD_CREW_COST_CONTRACT_VIDEO_REVIEW.pptx)
- [Four-minute demo script](artifacts/DEMO_SCRIPT.md)
- [Cost-contract artifact alignment audit](artifacts/COST_CONTRACT_ARTIFACT_AUDIT.md)

## Publishing model

OpenAI Sites is the application runtime and custom-domain target. The `docs/` build is a key-free GitHub Pages artifact hub. The productized release is published to both only after they point to the same audited Git commit.

## Repeatable delivery loop

1. Discover one user, one recurring decision, and one measurable pain.
2. Design the smallest end-to-end workflow and define human approval points.
3. Develop deterministic logic first; add model intelligence only where it improves the decision.
4. Evaluate representative, boundary, and failure cases.
5. Deploy privately, validate, then broaden access intentionally.
6. Record results and the next learning in the PRD.
