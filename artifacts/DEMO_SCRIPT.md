# AI Build Crew — four-minute product review script

Target length: 3 minutes 45 seconds to 4 minutes.

## 0:00–0:30 — Why this matters

“AI model choice looks simple until someone has to defend it. Pricing is spread across providers, output length changes by model and run, and the cheapest-looking option can become expensive after retries and verification. The bad default is false precision: one output-token number, one call, and one monthly total that looks certain.”

## 0:30–1:00 — The product

“AI Build Crew is a decision workbench for builders. It turns a rough AI idea into a transparent cost-per-completed-task range, a rule-eligible model starting point, and a governed decision. The first user is a product builder who should not need to know model names or token math. A human remains accountable for the final choice.”

## 1:00–1:35 — Start with the idea

“The experience begins with an everyday description. I can take the guided path, enter what I already know, or use a safe example. The guided path asks about the job, consequence of error, data class, modality, and expected use. Before calculation, I review what is known, assumed, or unknown.”

## 1:35–2:20 — Show the corrected cost model

“The user describes the result needed—a label, short answer, detailed answer, or long artifact—but does not enter output tokens. Output length belongs to the model profile and appears as a low, likely, and high distribution. I also state the primary AI steps and checker steps. The model-specific retry multiplier is applied automatically. The main result is cost per completed task; projected monthly volume is secondary context.”

“That distinction matters. The same request can generate materially different output on a reasoning tier, and a cheap first call may need a retry or checker. The range is a planning distribution, not a guarantee.”

## 2:20–3:05 — Show the hard evaluation workflow

“The estimator freezes the three scenarios. A separate deterministic Cost Evaluation Specialist enforces six absolute rules: output tokens cannot be workload input; output and retry distributions must be ordered; primary and checker steps must be included; cost per completed task is the ranking unit; and the result must remain a range.”

“The specialist independently recomputes the ledger without calling the estimator formula. A corrupted result fails. That failed evaluation reaches governance as GOV-009 and blocks the decision. Because today’s output and retry profiles are planning heuristics rather than measured distributions, GOV-015 keeps that limitation visible.”

## 3:05–3:35 — Evidence and limits

“Fifteen automated cases pass, including forbidden output-token input, retry and checker inclusion, deliberate ledger corruption, governance propagation, fail-closed risk cases, candidate-order stability, and rendered-page smoke coverage. Published provider prices are dated facts. The behavior distributions are not yet measured provider performance, and Google and Anthropic remain unranked until shared evaluation exists.”

## 3:35–4:00 — Close

“The next increment runs repeated synthetic workloads by task and model and measures completed-task success, p10, p50, and p90 output, retries, latency, and actual charged cost. Those measurements replace heuristics only after the evidence threshold is met. AI Build Crew does not promise the estimate will be exact. It makes the uncertainty visible, tests the math, and gives the builder a decision they can explain.”

## Demo operator checklist

1. Start with **Guide me to an estimate**.
2. Show **Result needed** and confirm there is no output-token input.
3. Point out **Primary AI steps**, **Checker steps**, and the model-owned retry multiplier.
4. Show low/likely/high **cost per completed task**, then the secondary monthly scale context.
5. Point to Cost Evaluation Specialist and `cost-contract-1.0.0`.
6. Show GOV-015 so the heuristic evidence boundary is explicit.
7. Change risk to High or data to Unknown and show human review.
8. Close on 15/15 tests and the measured-distribution backlog.
