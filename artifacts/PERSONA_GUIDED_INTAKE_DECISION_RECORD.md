# AI Build Crew — Persona-Guided Intake Decision Record

- Artifact ID: ABC-INTAKE-001
- Version: 1.0
- Owner: Product owner
- Status: Active authoritative reference
- Effective date: August 10, 2026
- Validated release: v0.3.0-rc.2

## Purpose

This record preserves the product-person feedback, the resulting persona and intake decisions, and the controls that must remain aligned across the application, PRDs, workflow, evaluation plan, TeamOS, backlog, presentation, and release notes.

It separates observed feedback from product decisions and future hypotheses so later releases do not turn an idea into a claimed capability or lose the original reason for a control.

## Evidence and classification

| Evidence | Classification | Product decision | Verification |
|---|---|---|---|
| The comparison experience asks questions that are too technical for a product person. | User feedback | Select an intake persona before asking workload questions. | First-time product-person usability test. |
| A product person is unlikely to know token volume or required context window. | User feedback / requirement | Tokens and context are derived planning assumptions in Product guided mode, never required inputs. | Guided-flow and rendered-copy tests. |
| “Describe your ideal starting task” and “describe your average day” are familiar entry points. | User feedback / product decision | Begin Product guided mode with a task story and daily-volume description. | End-to-end guided-flow test. |
| Conversational input may improve relevance but can also silently invent decision facts. | Control risk | Free text supplies context only. Confirmed structured choices alone enter the deterministic engine. | Workload-freeze and same-input tests. |
| Technical users may already know workload and architecture details. | Persona evidence | Preserve an Advanced builder route with direct technical controls. | Route-parity test. |
| The same business workload should not receive a different answer because of UI persona. | Absolute rule | Both routes normalize into the same workload contract and use the same engine, catalog, and rules. | Normalized-input parity test. |

## Personas and jobs to be done

### Product guided

When considering an AI-enabled product, feature, or agent, a product builder who knows the user and desired outcome—but not model economics—needs to translate an everyday task into a transparent cost and model starting point so they can make a defensible planning decision without first learning token terminology.

### Advanced builder

When a builder already understands the intended workload and architecture, they need direct access to volume, input size, formats, steps, cache, and constraints so they can inspect or challenge the assumptions without repeating introductory discovery.

## Experience contract

The controlled sequence is:

`Persona → task story → average-day volume → plain-language choices → assumption review → frozen workload → deterministic estimate → evidence checks → point-in-time report`

Product guided mode asks, in familiar language:

1. What is one ideal starting task, from what goes in to a successful result?
2. On an average day, about how many completed tasks should the service handle?
3. What should AI do most often?
4. What kind of result should come back?
5. How much information goes in each time?
6. What happens if the model is wrong—how serious is the risk of failure?
7. What information and formats are involved?

Every question permits uncertainty. Unknown safety information does not become a safe default. Technical assumptions remain collapsed for the product persona but are always inspectable before the estimate is frozen.

## Derivation and evidence contract

- A plain-language information-size choice maps to a versioned input-token planning range.
- The likely context requirement is a planning heuristic derived from instructions, input material, expected supporting context, output allowance, and safety margin. It is not presented as a provider fact.
- Output tokens are a model-specific low/likely/high distribution, not a user-entered workload value.
- Retries, primary steps, checker steps, tools, and retrieval are either confirmed, visibly assumed, or marked outside coverage. They are never hidden inside a single-call estimate.
- Cost per completed task is the primary unit. Monthly cost is secondary scale context based on confirmed or visibly assumed volume.
- Every derived value displays its source as user-confirmed, user guess, profile assumption, derived planning assumption, or unknown.

## Hard controls

| Rule ID | Control |
|---|---|
| INTAKE-001 | Product guided mode never requires token or context-window expertise. |
| INTAKE-002 | Free text cannot silently become a cost, eligibility, safety, or approval fact. |
| INTAKE-003 | A derived token or context value must be labeled as a planning assumption and be inspectable before freeze. |
| INTAKE-004 | Unknown risk, regulation, or data sensitivity must warn, require review, or block; it cannot default to safe. |
| INTAKE-005 | Persona choice cannot affect ranking after two routes produce the same normalized workload. |
| INTAKE-006 | Raw ideas and task descriptions are not retained by default or sent to a provider without explicit consent. |
| INTAKE-007 | Any future LLM-assisted intake may propose structured fields, but the user must confirm each field before the deterministic engine can use it. |

## Acceptance criteria

- A first-time product builder can reach a labeled estimate in under three minutes without opening technical details.
- Tokens and context window are never required Product guided inputs.
- No task, risk, data, or format choice is accepted without an explicit selection or visible Unknown state.
- Before calculation, every number is labeled as confirmed, guessed, assumed, derived, or unknown.
- The user can explain one assumption, one cost driver, and why a candidate was excluded.
- Product guided and Advanced builder routes return the same result and hash for the same normalized workload and versions.
- The full flow works by keyboard and on a mobile viewport without horizontal overflow.
- The same frozen input, catalog, rules, and engine versions always produce the same structured result.

## Current evidence and limitations

The v0.3.0-rc.2 build implements the two routes, conversational task and average-day entry, plain-language guided questions, a visible derived input range and context estimate, collapsed technical assumptions, and one shared deterministic engine. The automated release suite passes 36 of 36 checks.

This does not prove that the assumption profiles are accurate for every product idea. The free-text descriptions are context only; no deployed conversational agent extracts workload facts. Moderated first-time-user testing and measured task-by-model evaluation remain required.

## Future assisted-intake contract

A future Intake Agent may read a user brief only after explicit consent and return structured suggestions with source spans, confidence, and Unknown states. It may not select a provider, recommend a model, assign safety values silently, or send the estimate forward until the user confirms the frozen workload. Raw content should be cleared, exported, or deleted at the user's direction and should not be retained by default.

The learning loop is:

`conversational brief → confirmed workload → estimate → synthetic evaluation → measured tokens/retries/latency/charge → forecast-versus-actual review → governed profile update`

Only measured evidence meeting the defined sample and confidence threshold may replace a planning heuristic.

## Change control

This is the authoritative intake decision record. A release that changes personas, questions, derivations, provenance, privacy, or the workload-freeze boundary must version this artifact and update the PRDs, workflow, TeamOS, evaluation plan, backlog, and public claims in the same change. Git preserves superseded versions.
