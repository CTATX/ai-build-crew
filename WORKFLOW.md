# Repeatable governed build workflow

This is the reusable Product Faculty + TeamOS delivery loop used for AI Build Crew.

## 1. Discover evidence

Name one user, one recurring decision, its trigger, the current workaround, and the consequence of a wrong answer. Separate facts, assumptions, hypotheses, and unknowns. Do not turn an unknown safety field into a safe default.

Exit when the problem can be stated as: “When ___, the user needs ___ so they can ___.”

## 2. Define the decision boundary

Write what the system calculates, recommends, records, and refuses to decide. Assign the human decision owner. Create absolute rules before designing prompts.

Exit when every high-consequence action has an explicit review or block.

## 3. Design the smallest path

Offer a fast path for a user who knows the inputs, a guided path for a user who does not, and a safe synthetic example. Ask one question at a time. After each answer, check completeness. Stop when minimum facts are present or the user selects Estimate now.

Exit when the workflow has no dead end and all assumptions are visible.

## 4. Build deterministic logic first

Normalize input, calculate scenarios, filter hard constraints, rank eligible choices, and serialize results with version identifiers. Keep generative prose outside the decision and approval path.

Exit when the same input plus versions produces the same result and hash.

## 5. Run hard-bordered checks

1. Estimator produces a frozen result.
2. Evaluator checks fixed formulas and cases; it cannot edit the result.
3. Auditor verifies evidence, versions, invariants, and non-mutation.
4. Governance applies absolute rules; it cannot recommend or waive findings.
5. The human decision owner approves, edits, rejects, escalates, or records a permitted override.

Exit only when evaluation passes, audit matches, governance does not block, and the human decision is explicit.

## 6. Evaluate the experience

Run happy paths, boundaries, failure cases, accessibility checks, and a first-user test. Record expected versus actual outcomes. A passing UI demo does not replace formula and governance regression tests.

Exit when evidence supports the acceptance criteria or the release is stopped.

## 7. Preserve artifacts without drift

Maintain one authoritative PRD, a Maven-template rendering, the rules, catalog, evaluation record, demo script, and backlog. Classify changes as retained, strengthened, consolidated, weakened, duplicated, lost, or retired. If evidence, control, ownership, or traceability is missing, return to evidence discovery.

Exit when every published link resolves and the app, PRDs, deck, and script use the same names, results, limitations, and claims.

## 8. Deploy and learn

Publish a private or narrow alpha, use synthetic/non-sensitive data, monitor stop conditions, and capture the next learning. Broaden access or provider coverage only after the current decision loop is understood.

## Release checklist

- [ ] User, job, trigger, and success measure are specific.
- [ ] Known, assumed, and unknown fields are visible.
- [ ] Catalog, rules, and engine versions are recorded.
- [ ] Deterministic and governance regression cases pass.
- [ ] High-risk and unknown-data cases fail closed.
- [ ] No secrets or protected content enter static assets or logs.
- [ ] A human owns the final decision.
- [ ] PRDs, evaluation, governance, deck, script, and backlog agree.
- [ ] Live links and repository links resolve.
- [ ] Next learning and stop conditions are recorded.
