# AI Build Crew

**Pick the right model. Know the cost.**

AI Build Crew is an alpha decision workbench for product builders. It estimates token spend for a real workload, applies a task-complexity and consequence-of-error threshold, and recommends the least expensive model in the catalog that clears that quality bar.

## Alpha scope

- Adjustable workload assumptions: daily requests, input/output tokens, cached input, and model calls per request.
- Per-request, monthly, annual, and planning-range estimates.
- Explainable model eligibility based on task complexity and error consequence.
- Side-by-side comparison of GPT-5.6 Luna, Terra, and Sol.
- Optional AI decision brief through a server-only OpenAI API call.
- Safe deterministic fallback when the API is unavailable.

Pricing is a dated snapshot, not a guarantee. The catalog was checked against the [OpenAI model catalog](https://developers.openai.com/api/docs/models) on August 7, 2026.

## Cost method

```text
cost per request = calls × ((uncached input tokens × input price)
                  + (cached input tokens × cached-input price)
                  + (output tokens × output price)) ÷ 1,000,000

monthly cost = cost per request × requests per day × 30
planning range = 80% to 125% of monthly cost
```

Non-token storage, retrieval, web search, tools, infrastructure, and third-party charges are intentionally excluded from the alpha and clearly disclosed in the interface.

## Run locally

Requires Node.js 22+ and pnpm.

1. Install packages: `pnpm install`
2. Copy `.env.example` to `.env.local` and add `OPENAI_API_KEY` if you want AI-generated explanations.
3. Start: `pnpm dev`
4. Visit `http://localhost:3000`

The calculator and recommendations work without an API key. Never place a key in browser code or commit an `.env` file.

## Evidence and artifacts

- [Evaluation results](EVALUATION.md)
- [Future-state requirements](FUTURE_STATE.md)
- [Product requirements document](../maven-capstone/AI_BUILD_CREW_PRD.md)
- [Repeatable Maven workflow](../maven-capstone/REPEATABLE_WORKFLOW.md)
- [Builder Badge workbook](../outputs/019fd2e2-8e6f-7403-ae44-7480ddd7ecfc/AI_Build_Crew_Agentic_AI_PRD.xlsx)

## Publishing model

The full application is deployed on OpenAI Sites, where the API key remains a protected server secret. The `docs/` build is a key-free GitHub Pages demo: it performs the same transparent cost calculation but does not call OpenAI. This separation avoids exposing credentials in a static site.

## Repeatable delivery loop

1. Discover one user, one recurring decision, and one measurable pain.
2. Design the smallest end-to-end workflow and define human approval points.
3. Develop deterministic logic first; add model intelligence only where it improves the decision.
4. Evaluate representative, boundary, and failure cases.
5. Deploy privately, validate, then broaden access intentionally.
6. Record results and the next learning in the PRD.
