# Market Discovery — AI Build Crew

Research date: August 8, 2026  
Method: official product and documentation sources

## Market frame

AI Build Crew sits before implementation. It helps a product builder turn an incomplete idea into a confirmable model workload, model-usage cost forecast, evidence boundary, and governed human decision. It is not yet a model gateway, benchmark laboratory, or production observability platform.

## Comparable products

| Category | Product | Established capability | Implication for AI Build Crew |
|---|---|---|---|
| Marketplace and routing | [OpenRouter](https://openrouter.ai/openrouter) | Unified model access plus pricing, context, benchmark, capability comparison, and routing | Do not compete on breadth or runtime routing; integrate later if useful |
| Model intelligence | [Artificial Analysis](https://artificialanalysis.ai/models) | Broad quality, speed, latency, price, context, benchmark, and cost-per-task comparisons | Use as external market evidence, not as a substitute for workload-specific evaluation |
| Evaluation | [Braintrust](https://www.braintrust.dev/docs/evaluate) | Versioned datasets, scorers, experiments, comparisons, and production evaluation | AI Build Crew can define the decision and hand an evaluation plan to deeper infrastructure |
| Evaluation and cost observability | [LangSmith](https://docs.langchain.com/langsmith/evaluation) | Offline/online evaluation, tracing, and token/cost tracking | A likely downstream source for actual-versus-forecast evidence |
| Open-source observability | [Langfuse](https://langfuse.com/docs/observability/features/token-and-cost-tracking) | Model usage, token, cost, latency, and custom pricing tracking | A likely actual-cost integration; it operates after calls exist |
| Provider-neutral gateway | [LiteLLM](https://docs.litellm.ai/) | Unified API, provider adapters, routing/fallback, and spend management | A possible future execution layer beneath governed evaluations |
| Gateway and runtime control | [Portkey](https://portkey.ai/docs/product/ai-gateway) | Routing, retries, fallbacks, budgets, limits, and observability | Stronger runtime control plane; AI Build Crew remains a pre-build decision layer |
| Cloud calculator | [Azure pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator/) | Broad cloud-service estimates | Demonstrates the value of a saved TCO estimate, but does not guide model eligibility |

## Honest differentiation

AI Build Crew is a prompt-first pre-build decision workbench for product builders. It turns an incomplete idea into visible assumptions, reproducible model-usage cost scenarios, evidence-gated eligibility, separate evaluation/audit/governance findings, and a human-owned decision.

Do not claim “first,” “only,” “best,” or universal provider-neutral ranking. The current Alpha has provider-neutral catalog visibility, while recommendation evidence remains OpenAI-only.

## Product opportunity

The most defensible wedge is the handoff between product discovery and technical evaluation:

1. Help a non-expert describe the proposed workload.
2. Make every inferred or defaulted assumption visible.
3. Estimate model token economics reproducibly.
4. Identify what evidence is missing before a model can be compared or approved.
5. Export a workload and evaluation specification to gateways, evaluation platforms, and observability tools.
6. Later reconcile the pre-build forecast with measured production usage.

## Discovery questions for five interviews

1. When did you last choose a model before you had production data?
2. Which workload facts were known, guessed, or missing?
3. Did you estimate only token price, or total delivery cost?
4. What evidence changed the initial model choice?
5. Where are forecast, evaluation, approval, and actual cost recorded today?
