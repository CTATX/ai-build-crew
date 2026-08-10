# AI Build Crew — four-minute recording script

Target length: 3 minutes 45 seconds to 4 minutes.

Recording objective: show the product problem, complete one real web estimate, download the point-in-time outcome, and close with the governed Phase 2 architecture. The recording should feel like a product story with a live proof—not a narrated tour of every field.

## Stable demo setup

- Deck: `AI_BUILD_CREW_COST_CONTRACT_VIDEO_REVIEW.pptx`
- Web experience: `https://aibuildcrew.badlabz.com/`
- Browser: one clean tab, notifications off, zoom set so the complete result card is readable
- Download folder: clear enough that the new report is easy to identify
- Demo idea:

> A product team needs a recurring assistant to review public product requirements, summarize key risks, and draft a decision brief.

- Guided answers:
  - Job: Product analysis
  - Impact if wrong: Medium — causes rework, delay, or added cost
  - Data: Public
  - Regulated: No
  - Required format: Text
  - Stage: Pilot — about 250 uses per day
- Expected stable result from the current rules:
  - GPT-5.6 Terra
  - Two primary AI steps plus one checker step
  - Likely 1,200 output tokens per primary call
  - 1.15× likely retry multiplier
  - 3.45 likely charged calls per completed task
  - Low / likely / high cost per completed task: approximately $0.04 / $0.07 / $0.14
  - Cost evaluation: 9 of 9 checks pass
  - Governance: WARN because assumptions and unmeasured behavior distributions remain visible

## Recording map

| Time | What the viewer sees | Purpose |
|---|---|---|
| 0:00–0:35 | Deck slides 1–3 | Establish the problem, audience, and job to be done |
| 0:35–0:52 | Deck slide 4 | Explain the idea-first experience |
| 0:52–1:12 | Live site: hero and prompt box | Show that the user starts in ordinary language |
| 1:12–1:48 | Live site: five guided questions | Show explicit facts, unknowns, and multi-format intake |
| 1:48–2:25 | Live site: workload and result card | Explain the corrected cost contract and cost spread |
| 2:25–2:58 | Live site: checks and point-in-time report | Demonstrate the double-check and downloadable outcome |
| 2:58–3:20 | Deck slides 5–7 | Summarize the evidence behind the prototype |
| 3:20–3:48 | Deck slides 8, 10, and 12 | Show the controlled path from estimator to provider-neutral platform |
| 3:48–4:00 | Deck slide 12 | Close on the value and product URL |

Slides 9 and 11 are supporting slides for questions or a longer recording. Do not rush through them merely to show every slide.

## 0:00–0:35 — Problem, user, and job to be done

**On screen:** slides 1, 2, and 3.

“AI model choice looks simple until someone has to defend it. Provider prices use different units, output length changes by model and by run, and a cheap first call can become expensive after retries and verification. The bad default is false precision: one output-token number, one call, and one monthly total that looks certain.

AI Build Crew is for the product builder who owns the go or no-go choice but should not need a model name, token count, or workflow design just to begin. The job is to turn an unclear build choice into a reproducible model and cost starting point—so the builder can commit, investigate, or stop.”

## 0:35–0:52 — Product experience

**On screen:** slide 4.

“The product deliberately starts with the idea. It then shapes the minimum workload facts and asks the user to confirm them. ‘I don’t know’ remains valid, assumptions stay visible, and the calculation does not run until the user reaches the workload review.”

## 0:52–1:12 — Begin on the web

**On screen:** switch to `aibuildcrew.badlabz.com`. Pause briefly on the headline, then select **Start with an idea**. Paste the stable demo idea and select **Guide me to an estimate**.

“Here is the working experience. I begin in everyday language. This idea provides context, but it does not silently become a pricing fact. I choose the guided path so the workbench can collect the facts its deterministic rules actually use.”

## 1:12–1:48 — Complete the guided questions

**On screen:** answer the five questions using the stable demo answers. On the format question, select **Text**. On the final question, select **Pilot**, then **Continue**.

“The guide asks what job the model performs, what happens if it is wrong, what data it handles, which formats one model must understand together, and the likely operating stage. These are explicit choices. Unknown risk or data never defaults to safe. Format is multi-select because a real workflow may require more than one format; unsupported combinations stop rather than being quietly reduced.”

## 1:48–2:25 — Explain the estimate

**On screen:** in **Freeze the workload**, point to **Result needed**, **Primary AI steps**, **Checker steps**, and the optional ceiling. Then move to the result card and point to the low / likely / high cost range and **Likely model behavior**.

“The user chooses the result needed, but does not enter output tokens. Output length belongs to the model profile because the same prompt can produce a different distribution on a different model. I did not know the workflow depth, so the visible rule recommends two primary steps and one checker step. Retries are added separately.

The result is GPT-5.6 Terra with a low, likely, and high cost per completed task. Monthly scale is secondary context. The optional ceiling is left at zero because this run is discovering the cost; a ceiling filters candidates only when the user already has a real affordability limit.”

## 2:25–2:58 — Double-check and capture the outcome

**On screen:** scroll to **Double-check the result**. Point to Estimate, Cost evaluation, Audit, and Governance. Show the 9/9 cost checks. Point to GOV-006 and GOV-015. Under **Point-in-time decision report**, select **Recommendation selected**, enter `Pilot first; calibrate with measured use.`, and select **Download point-in-time report**.

“AI Build Crew calculates the estimate and independently recomputes the ledger. Six cost-contract rules reject user-authored output tokens, require ordered distributions, include retries and checker steps, and preserve cost per completed task as a range. Three independent ledger checks then match the low, likely, and high results. If they disagree, the workflow stops.

Governance keeps the remaining assumptions and the unmeasured behavior profile visible. The outcome is this point-in-time report: workload, assumptions, cost spread, evidence versions, findings, and decision status—downloaded without saving the idea to a product database.”

## 2:58–3:20 — Evidence behind the prototype

**On screen:** return to the deck and show slides 5, 6, and 7.

“This is a spread, not a promised number. The current product uses one deterministic orchestrator with hard-bordered software specialists. Twenty-two automated cases pass, including output-token rejection, retry and checker inclusion, deliberate ledger corruption, governance propagation, multimodal blocking, deterministic ranking, point-in-time report behavior, and rendered-page coverage. No generative model can change the calculation or approval state.”

## 3:20–3:48 — Phase 2 architecture

**On screen:** show slide 8, then slide 10, then slide 12.

“The next release turns the estimator into the control plane for provider-neutral evidence. One confirmed workload goes to a deterministic orchestrator, then to controlled OpenAI, Gemini, Claude, and Bedrock runners. Results are frozen before blinded evaluation. Cost and governance rules run after scoring, and the outcome is one comparative point-in-time report.

Provider keys stay protected. Evidence can be retained without retaining the user’s idea. RAG may ground sources and explanations, but it never changes cost math or policy.”

## 3:48–4:00 — Close

**On screen:** remain on slide 12 with the product URL visible.

“AI Build Crew does not promise that an estimate will be exact. It makes uncertainty visible, tests the math, and gives the builder a decision they can explain. That is the product today—and the controlled path to the provider-neutral platform next.”

## Operator checklist

1. Rehearse the guided path once before recording; reload the page to clear the state.
2. Keep the stable demo answers above unchanged so the result remains predictable.
3. Do not select Google or Anthropic catalog rows during the four-minute recording; they are correctly marked as evaluation required.
4. Do not use the four-format inventory example as the primary happy path; it correctly blocks because no recommendation-ready model supports that combined requirement.
5. Pause briefly after the low / likely / high range so viewers can read it.
6. Show the 9/9 cost checks, GOV-015, and the downloaded report—those are the proof points.
7. If time runs long, omit slide 5 and move directly from the downloaded report to slides 6, 7, 8, 10, and 12.
8. End on the custom domain, not an internal deployment URL.
