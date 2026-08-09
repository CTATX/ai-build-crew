"use client";

import { useMemo, useState } from "react";
import { analyzeWorkload, costFor, deterministicBrief, models, responseProfiles, taskRequirements } from "@/lib/decision-engine.mjs";
import { buildDecisionReport } from "@/lib/decision-report.mjs";

type Stage = "start" | "guided" | "estimate";

const guidedQuestions = [
  { id: "task", number: "01", prompt: "What job must the model perform?" },
  { id: "risk", number: "02", prompt: "What is the impact if the model fails?" },
  { id: "data", number: "03", prompt: "What kind of data will it handle?" },
  { id: "modality", number: "04", prompt: "What must the model understand?" },
  { id: "usage", number: "05", prompt: "Do you know the workload size?" },
];

function money(value: number) {
  if (value < 0.01) return `$${value.toFixed(4)}`;
  if (value < 100) return `$${value.toFixed(2)}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("start");
  const [question, setQuestion] = useState(0);
  const [idea, setIdea] = useState("");
  const [task, setTask] = useState("Product analysis");
  const [risk, setRisk] = useState("Unknown");
  const [dataSensitivity, setDataSensitivity] = useState("Unknown");
  const [modalities, setModalities] = useState<string[]>(["text"]);
  const [regulatedStatus, setRegulatedStatus] = useState<"Unknown" | "No" | "Yes">("Unknown");
  const [requests, setRequests] = useState(1000);
  const [inputTokens, setInputTokens] = useState(2400);
  const [responseSize, setResponseSize] = useState("Detailed answer");
  const [cache, setCache] = useState(20);
  const [primarySteps, setPrimarySteps] = useState(0);
  const [checkerSteps, setCheckerSteps] = useState(-1);
  const [budget, setBudget] = useState(0);
  const [assumptions, setAssumptions] = useState(["task", "risk", "dataSensitivity", "modalities", "regulated", "requests", "inputTokens", "responseSize", "cache", "primarySteps", "checkerSteps"]);
  const [selected, setSelected] = useState<string | null>(null);
  const [providerFilter, setProviderFilter] = useState("All");
  const [decision, setDecision] = useState("Not decided");
  const [decisionNote, setDecisionNote] = useState("");
  const [guidedAnswers, setGuidedAnswers] = useState<string[]>([]);

  const assessmentDate = new Date().toISOString().slice(0, 10);
  const result = useMemo(() => analyzeWorkload({ task, risk, dataSensitivity, modalities, regulated: regulatedStatus === "Yes", requests, inputTokens, responseSize, cache, primarySteps, checkerSteps, budget, assumptions, asOfDate: assessmentDate }), [task, risk, dataSensitivity, modalities, regulatedStatus, requests, inputTokens, responseSize, cache, primarySteps, checkerSteps, budget, assumptions, assessmentDate]);
  const active = models.find((model) => model.id === selected) ?? result.recommendation;
  const comparisonOnly = Boolean(selected && selected !== result.recommendation?.id);
  const activeScenarios = active ? { low: costFor(active, result.workload, "low"), expected: costFor(active, result.workload, "expected"), high: costFor(active, result.workload, "high") } : null;
  const visibleModels = providerFilter === "All" ? models : models.filter((model) => model.provider === providerFilter);

  function markKnown(field: string, value: number, setter: (value: number) => void) {
    setter(value);
    setAssumptions((current) => current.filter((item) => item !== field));
    setDecision("Not decided");
  }

  function startEstimate(route: "known" | "assisted" | "sample") {
    if (route === "sample") {
      setIdea("A product team needs a recurring model to analyze product requirements and draft decision briefs.");
      setTask("Product analysis"); setRisk("Medium"); setDataSensitivity("Public"); setModalities(["text"]); setRegulatedStatus("No");
      setRequests(1000); setInputTokens(2400); setResponseSize("Detailed answer"); setCache(20); setPrimarySteps(0); setCheckerSteps(-1); setBudget(0);
      setAssumptions(["task", "risk", "dataSensitivity", "modalities", "regulated", "requests", "inputTokens", "responseSize", "cache", "primarySteps", "checkerSteps"]);
      setStage("estimate");
    } else if (route === "known") {
      setStage("estimate");
      setTimeout(() => document.querySelector("#estimator")?.scrollIntoView({ behavior: "smooth" }), 50);
    } else {
      setStage("guided"); setQuestion(0); setGuidedAnswers([]);
    }
  }

  function markGuidedAnswer(id: string) {
    setGuidedAnswers((current) => current.includes(id) ? current : [...current, id]);
    const field = id === "data" ? "dataSensitivity" : id === "modality" ? "modalities" : id;
    setAssumptions((current) => current.filter((item) => item !== field));
  }

  function applyUsageProfile(profile: "experiment" | "pilot" | "launch" | "unknown") {
    const values = profile === "experiment"
      ? { requests: 25, input: 800, response: "Short answer" }
      : profile === "launch"
        ? { requests: 2500, input: 3500, response: "Detailed answer" }
        : profile === "pilot"
          ? { requests: 250, input: 2000, response: "Detailed answer" }
          : { requests: 100, input: 1500, response: "Short answer" };
    setRequests(values.requests); setInputTokens(values.input); setResponseSize(values.response); setPrimarySteps(0); setCheckerSteps(-1); setCache(0);
    setAssumptions((current) => [...new Set([...current, "requests", "inputTokens", "responseSize", "cache", "primarySteps", "checkerSteps"])]);
    markGuidedAnswer("usage");
  }

  function advanceGuided() {
    if (question >= guidedQuestions.length - 1) {
      setStage("estimate");
      setTimeout(() => document.querySelector("#estimator")?.scrollIntoView({ behavior: "smooth" }), 50);
    } else setQuestion((current) => current + 1);
  }

  const brief = deterministicBrief(result);
  const activeBrief = !active
    ? brief
    : active.recommendationReady && !comparisonOnly
    ? brief
    : `${active.name} is cost-visible from published ${active.provider} catalog data. It is not ranked against the baseline until the shared workload evaluation supplies quality, reliability, and latency evidence.${active.pricingNotes ? ` ${active.pricingNotes}` : ""}`;

  function downloadReport() {
    const generatedAt = new Date().toISOString();
    const report = buildDecisionReport({ generatedAt, idea, result, activeModel: active, activeScenarios, comparisonOnly, decision, decisionNote, assumptions });
    const url = URL.createObjectURL(new Blob([report], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-build-crew-assessment-${generatedAt.slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <main>
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="AI Build Crew home"><span className="brand-mark">A</span> AI Build Crew</a>
        <div className="nav-links"><a href="#intake">Guided start</a><a href="#estimator">Estimate</a><a href="#governance">Governance</a><a href="#about">About</a></div>
        <span className="alpha">Release candidate · 08</span>
      </nav>

      <section className="hero" id="top">
        <div className="eyebrow"><span /> Defensible model decisions</div>
        <h1>Pick the right model.<br /><em>Know the cost.</em></h1>
        <p className="lede"><strong>A decision workbench for builders who need a defensible model choice—not another pricing spreadsheet.</strong> Start with an everyday description; you do not need to know a model, token count, or technical architecture.</p>
        <a className="primary" href="#intake">Start with an idea <span>↘</span></a>
        <div className="hero-stamp"><span>RULESET</span><strong>1.3<br />LOCKED</strong><small>HUMAN-OWNED DECISION</small></div>
      </section>

      <section className="intake-section" id="intake">
        <div className="section-kicker">START WITH WHAT YOU KNOW</div>
        <div className="intake-shell">
          <div className="intake-copy">
            <h2>Describe what you want to build.<br /><em>Get a model starting point.</em></h2>
            <p>You do not need to know a model, token count, or technical architecture. AI Build Crew turns everyday product choices into a transparent cost-per-completed-task range, then checks the result before you decide.</p>
            <div className="control-line"><b>Fixed sequence</b><span>Facts → assumptions → estimate → evaluation → audit → governance → human decision</span></div>
          </div>
          <div className="prompt-card">
            {stage === "start" && <>
              <label htmlFor="idea">What are you thinking about building?</label>
              <textarea id="idea" value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="Example: A tool that reviews product requirements and drafts a decision brief for my team…" />
              <p className="prompt-help">Use everyday language. This description stays context until you confirm the workload assumptions. The workbench estimates model token charges—not development labor or complete application infrastructure.</p>
              <div className="route-buttons">
                <button onClick={() => startEstimate("assisted")}>Guide me to an estimate</button>
                <button onClick={() => startEstimate("known")}>I already know my usage</button>
                <button onClick={() => startEstimate("sample")}>Show me an example</button>
              </div>
            </>}
            {stage === "guided" && <GuidedQuestion index={question} answered={guidedAnswers.includes(guidedQuestions[question].id)} markAnswered={markGuidedAnswer} applyUsageProfile={applyUsageProfile} task={task} setTask={setTask} risk={risk} setRisk={setRisk} dataSensitivity={dataSensitivity} setDataSensitivity={setDataSensitivity} modalities={modalities} setModalities={setModalities} regulatedStatus={regulatedStatus} setRegulatedStatus={(value) => { setRegulatedStatus(value); setAssumptions((current) => value === "Unknown" ? [...new Set([...current, "regulated"])] : current.filter((item) => item !== "regulated")); }} advance={advanceGuided} estimateNow={() => setStage("estimate")} />}
            {stage === "estimate" && <div className="ready-card"><span>INTAKE READY</span><h3>{idea || "Workload details captured"}</h3><p>{assumptions.length ? `${assumptions.length} planning assumptions remain visible for your review.` : "All planning fields are currently treated as user-supplied."}</p><a href="#estimator">Review assumptions and run the checks ↓</a></div>}
          </div>
        </div>
      </section>

      <section className={`estimator ${stage !== "estimate" ? "pre-estimate-hidden" : ""}`} id="estimator" aria-hidden={stage !== "estimate"}>
        <div className="section-kicker">02 / FREEZE THE WORKLOAD</div>
        <div className="workbench">
          <div className="inputs">
            <div className="field wide prompt-input"><label htmlFor="workload-prompt">What are you building?</label><textarea id="workload-prompt" value={idea} onChange={(e) => { setIdea(e.target.value); setDecision("Not decided"); }} placeholder="Describe the product, user, workflow, and what the model needs to do." /><small>Your description provides context. Only the choices and assumptions you confirm below drive the calculation.</small></div>
            <div className="field wide"><label htmlFor="task">Work to perform {assumptions.includes("task") && <em>ASSUMED</em>}</label><select id="task" value={task} onChange={(e) => { setTask(e.target.value); setAssumptions((current) => current.filter((item) => item !== "task")); setSelected(null); setDecision("Not decided"); }}>{Object.keys(taskRequirements).map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="field"><label htmlFor="risk">Impact if the model fails {assumptions.includes("risk") && <em>ASSUMED</em>}</label><select id="risk" value={risk} onChange={(e) => { setRisk(e.target.value); setAssumptions((current) => current.filter((item) => item !== "risk")); setSelected(null); setDecision("Not decided"); }}><option>Unknown</option><option>Low</option><option>Medium</option><option>High</option></select><small className="field-hint">Failure includes an incorrect, incomplete, unreliable, or unavailable result.</small></div>
            <div className="field"><label htmlFor="data">Data class</label><select id="data" value={dataSensitivity} onChange={(e) => { setDataSensitivity(e.target.value); setAssumptions((current) => current.filter((item) => item !== "dataSensitivity")); }}><option>Unknown</option><option>Public</option><option>Internal</option><option>Sensitive</option><option>Protected</option></select></div>
            <div className="field wide"><label>Required formats for one model step {assumptions.includes("modalities") && <em>ASSUMED</em>}</label><div className="multi-select" role="group" aria-label="Required formats for one model step">{[["text", "Text"], ["image", "Images"], ["audio", "Audio"], ["video", "Video"]].map(([value, label]) => <button type="button" key={value} className={modalities.includes(value) ? "selected" : ""} aria-pressed={modalities.includes(value)} onClick={() => { const next = modalities.includes(value) ? modalities.filter((item) => item !== value) : [...modalities, value]; if (next.length) { setModalities(next); setAssumptions((current) => current.filter((item) => item !== "modalities")); setSelected(null); setDecision("Not decided"); } }}>{label}</button>)}</div><small className="field-hint">Select formats one model must understand together. If specialist stages handle speech, barcode/OCR, retrieval, and reasoning separately, estimate each stage for now; multi-model pipeline costing is a planned capability.</small></div>
            <div className="field"><label htmlFor="regulated">Regulated or compliance-controlled? {assumptions.includes("regulated") && <em>UNKNOWN</em>}</label><select id="regulated" value={regulatedStatus} onChange={(e) => { const value = e.target.value as "Unknown" | "No" | "Yes"; setRegulatedStatus(value); setAssumptions((current) => value === "Unknown" ? [...new Set([...current, "regulated"])] : current.filter((item) => item !== "regulated")); }}><option>Unknown</option><option>No</option><option>Yes</option></select></div>
            <NumberField label="Uses per day" value={requests} setValue={(v) => markKnown("requests", v, setRequests)} min={1} assumed={assumptions.includes("requests")} hint="How many times people or systems will ask the AI to do this job each day." />
            <NumberField label="Information going in" value={inputTokens} setValue={(v) => markKnown("inputTokens", v, setInputTokens)} min={1} assumed={assumptions.includes("inputTokens")} hint="Measured in tokens. About 750 tokens is roughly one page of ordinary English." />
            <div className="field"><label htmlFor="response-size">Result needed {assumptions.includes("responseSize") && <em>ASSUMED</em>}</label><select id="response-size" value={responseSize} onChange={(e) => { setResponseSize(e.target.value); setAssumptions((current) => current.filter((item) => item !== "responseSize")); setSelected(null); setDecision("Not decided"); }}>{Object.entries(responseProfiles).map(([name, profile]) => <option key={name} value={name}>{name} · {(profile as { description: string }).description}</option>)}</select><small className="field-hint">You choose the result shape. Each model supplies its own output-token distribution.</small></div>
            <NumberField label="Reusable input" value={cache} setValue={(v) => markKnown("cache", v, setCache)} min={0} max={100} assumed={assumptions.includes("cache")} hint="The percentage of repeated instructions a provider may bill at a cached rate." />
            <WorkflowStepField label="Primary AI steps" value={primarySteps} resolved={result.workload.primarySteps} setValue={(v) => { setPrimarySteps(v); setAssumptions((current) => v <= 0 ? [...new Set([...current, "primarySteps"])] : current.filter((item) => item !== "primarySteps")); setDecision("Not decided"); }} max={50} assumed={assumptions.includes("primarySteps")} hint="Choose Not sure and the workflow rule will recommend a visible starting architecture." />
            <WorkflowStepField label="Checker steps" value={checkerSteps} resolved={result.workload.checkerSteps} setValue={(v) => { setCheckerSteps(v); setAssumptions((current) => v < 0 ? [...new Set([...current, "checkerSteps"])] : current.filter((item) => item !== "checkerSteps")); setDecision("Not decided"); }} max={10} assumed={assumptions.includes("checkerSteps")} hint="Verification, critique, or repair calls per completed task. Retries are added separately by model profile." />
            <NumberField label="Optional spending ceiling per completed task" value={budget} setValue={(v) => { setBudget(v); setSelected(null); setDecision("Not decided"); }} min={0} prefix="$" hint="Leave at 0 to discover the range. Set this only when you already have a hard affordability limit; it filters results but never creates the estimate." />
            <div className="ledger wide"><b>WHAT THIS ESTIMATE ASSUMES</b><span>{assumptions.length ? `Planning assumptions: ${assumptions.map((field) => ({ task: "work to perform", risk: "impact if the model fails", dataSensitivity: "data class", modalities: "required formats", regulated: "regulatory status", requests: "completed tasks per day", inputTokens: "information going in", responseSize: "result shape", cache: "reusable input", primarySteps: "primary AI steps", checkerSteps: "checker steps" }[field] ?? field)).join(", ")}` : "Known: all workload values were confirmed by the user"}</span><span>{result.workflowSuggestion.applied ? `Workflow recommendation applied: ${result.workflowSuggestion.rationale}` : "Workflow steps were supplied by the user."} Output length and retry behavior come from the selected model profile.</span></div>
          </div>

          <aside className="result-card">
            <div className="result-label">{!active ? "Eligibility result" : comparisonOnly ? "Catalog-only comparison" : "Reproducible cost baseline"} · {(comparisonOnly ? "NOT EVALUATED" : result.disposition).replaceAll("_", " ")}</div>
            {active && activeScenarios ? <>
              <div className={`model-orbit ${active.accent}`}><span>{active.name.split(" ").at(-1)?.slice(0, 1)}</span></div>
              <h2>{active.name}</h2>
              <p>{active.lane}</p>
              {comparisonOnly && <div className="override">Comparison only · policy-baseline recommendation: {result.recommendation?.name ?? "none"}</div>}
              <div className="cost-grid">
                <div><small>LOW / COMPLETED TASK</small><strong>{money(activeScenarios.low.perCompletedTask)}</strong></div>
                <div><small>LIKELY / COMPLETED TASK</small><strong>{money(activeScenarios.expected.perCompletedTask)}</strong></div>
                <div><small>HIGH / COMPLETED TASK</small><strong>{money(activeScenarios.high.perCompletedTask)}</strong></div>
              </div>
              <div className={`budget-status ${budget > 0 && activeScenarios.expected.perCompletedTask > budget ? "over" : ""}`}><span>{budget > 0 ? `Per-task ceiling ${money(budget)}` : "No per-task budget ceiling set"}</span>{budget > 0 && <strong>{activeScenarios.expected.perCompletedTask <= budget ? `${money(budget - activeScenarios.expected.perCompletedTask)} remaining` : `${money(activeScenarios.expected.perCompletedTask - budget)} over ceiling`}</strong>}</div>
              <div className="annual-cost"><span>Scale context · {requests.toLocaleString()} completed tasks/day</span><strong>{money(activeScenarios.expected.monthlyAtPlannedVolume)} / month</strong></div>
              <div className="behavior-evidence"><span>LIKELY MODEL BEHAVIOR</span><b>{activeScenarios.expected.outputTokensPerPrimary.toLocaleString()} output tokens / primary call · {activeScenarios.expected.retryMultiplier.toFixed(2)}× attempts · {activeScenarios.expected.attemptedCallsPerTask.toFixed(2)} charged calls / completed task</b><small>{active.costBehavior.evidence}</small></div>
              <div className="behavior-evidence"><span>WHY THIS MODEL — AND WHAT CHANGES IT</span><b>Current gate: quality tier {result.required} · {result.workload.modalities.join(" + ")}</b><small>{task === "Product analysis" && risk === "Medium" ? "Terra is the cheapest evaluated model at tier 2. Choose Classification or Content with Low risk to test Luna; choose Complex reasoning or High risk to test Sol. Volume changes cost, not the required quality tier." : "The recommendation changes when task complexity, consequence of error, required formats, context size, or an optional spending ceiling changes eligibility."}</small></div>
              <div className="brief deterministic" aria-live="polite">{activeBrief}</div>
              <p className="coverage-boundary"><b>Estimator runtime:</b> deterministic code; no LLM call is made to calculate or audit this estimate. Model-token cost of the decision workflow itself is $0.00. The prices above forecast the workload you described.</p>
              <div className="version-line">Catalog {result.catalog.version} · Engine {result.audit.engineVersion} · Evidence {active.evidenceStatus}</div>
              <p className="coverage-boundary"><b>Included:</b> cataloged token prices, model-specific output distribution, retries, primary steps, and checker steps. <b>Not included:</b> build labor, hosting, databases, retrieval, storage, provider tool fees, monitoring, or human review.</p>
            </> : <div className="blocked-result">
              <div className="model-orbit orange"><span>!</span></div>
              <h2>No evaluated model</h2>
              <p>No cost is shown because no model passed every capability and evidence gate.</p>
              <div className="behavior-evidence"><span>WHY THIS STOPPED</span><b>Required together: {result.workload.modalities.join(" + ")} · quality tier {result.required}</b><small>{result.catalogEligible.length ? `${result.catalogEligible.map((model) => model.name).join(" and ")} list these formats in published catalog data, but they are not recommendation-ready until the shared workload evaluation runs.` : "No model in the current catalog lists every selected format for one model step."}</small></div>
              <div className="behavior-evidence"><span>ARCHITECTURE CHECK</span><b>This may be a multi-stage workflow rather than one multimodal call.</b><small>For the inventory example: capture/OCR or barcode scan → speech-to-text → inventory retrieval/tool call → response and order workflow. Estimate those stages separately until pipeline costing ships.</small></div>
              <div className="brief deterministic" aria-live="polite">{activeBrief}</div>
              <a className="blocked-link" href="#models">Inspect catalog candidates ↓</a>
              <div className="version-line">Catalog {result.catalog.version} · Engine {result.audit.engineVersion} · No model cost emitted</div>
            </div>}
          </aside>
        </div>
      </section>

      <section className={`pipeline-section ${stage !== "estimate" ? "pre-estimate-hidden" : ""}`} id="governance" aria-hidden={stage !== "estimate"}>
        <div className="section-kicker dark">03 / DOUBLE-CHECK THE RESULT</div>
        <div className="pipeline-head"><h2>A recommendation<br />does not approve itself.</h2><p>The deterministic Cost Evaluation Specialist enforces the versioned cost contract and independently recomputes the frozen estimate. A failure blocks governance. Independent deployed LLM agents remain future work.</p></div>
        <div className="pipeline">
          <StatusStep number="01" name="Estimate" status={result.recommendation ? "PASS" : "BLOCK"} detail={result.recommendation ? "Three cost scenarios calculated" : "No rule-eligible model"} />
          <StatusStep number="02" name="Cost evaluation" status={comparisonOnly ? "NOT RUN" : result.costEvaluation.status} detail={comparisonOnly ? "Shared workload evidence is required" : `${result.costEvaluation.checks.filter((item: { pass: boolean }) => item.pass).length}/${result.costEvaluation.checks.length} hard cost checks passed`} />
          <StatusStep number="03" name="Audit" status={comparisonOnly ? "NOT RUN" : result.audit.status} detail={comparisonOnly ? "No evaluated result to audit" : "Expected cost deterministically recomputed"} />
          <StatusStep number="04" name="Governance" status={comparisonOnly ? "NOT APPLIED" : result.governance.status} detail={comparisonOnly ? "Catalog facts are not an approval" : result.governance.findings.length ? result.governance.findings.map((item: { id: string }) => item.id).join(" · ") : "No findings"} />
        </div>
        <div className="governance-findings">
          <div><h3>Rule findings</h3>{comparisonOnly ? <p><b>EVAL REQUIRED</b>Catalog facts are visible, but baseline rule findings do not transfer to an unevaluated provider model.</p> : result.governance.findings.length ? result.governance.findings.map((finding: { id: string; severity: string; message: string }) => <p key={finding.id}><b>{finding.id} · {finding.severity}</b>{finding.message}</p>) : <><p><b>PASS</b>No governance exception detected.</p><p><b>{result.costEvaluation.version}</b>Output tokens rejected as workload input · model distributions ordered · retries and checker included · cost per completed task independently matched.</p></>}</div>
          <div className="decision-gate"><h3>Point-in-time decision report</h3><p>Capture this estimate as it stands now. The downloaded report records the workload, assumptions, cost spread, model evidence, rule findings, and your decision status without saving the idea to a database.</p><div className="decision-actions"><button disabled={comparisonOnly || result.disposition !== "READY_FOR_HUMAN_DECISION"} onClick={() => setDecision("Recommendation selected")}>Select recommendation</button><button onClick={() => setDecision("Held for review")}>Hold for review</button><button onClick={() => setDecision("Recommendation not selected")}>Do not select</button><button onClick={() => { setDecision("Not decided"); document.querySelector("#estimator")?.scrollIntoView({ behavior: "smooth" }); }}>Edit & rerun</button></div><label>Decision note · optional<input value={decisionNote} onChange={(e) => setDecisionNote(e.target.value)} placeholder="Why this choice was made, or what must be resolved next" /></label><button className="record-override" onClick={downloadReport}>Download point-in-time report</button><strong className="decision-state">Decision status · {decision}</strong></div>
        </div>
      </section>

      <section className={`model-section ${stage !== "estimate" ? "pre-estimate-hidden" : ""}`} id="models" aria-hidden={stage !== "estimate"}>
        <div className="section-head"><div><div className="section-kicker dark">04 / UNDERSTAND THE TRADE-OFF</div><h2>Published facts first.<br />Shared evals next.</h2></div><p>Catalog fields can be compared now. Cross-provider ranking waits for the same representative workload to measure quality, reliability, latency, and actual cost.</p></div>
        <div className="catalog-control"><div><b>CATALOG COVERAGE</b><span>{result.coverage.providers.length} providers · {models.length} models · {result.coverage.evaluatedProviders.length} provider currently rank-eligible</span></div><div className="provider-filters">{["All", ...result.coverage.providers].map((provider) => <button key={provider} className={providerFilter === provider ? "active" : ""} onClick={() => setProviderFilter(provider)}>{provider}</button>)}</div></div>
        <div className="model-table">
          <div className="table-row header"><span>MODEL</span><span>PROVIDER</span><span>LIKELY / TASK</span><span>EVIDENCE</span><span>FIT</span></div>
          {visibleModels.map((model) => {
            const expected = costFor(model, result.workload, "expected").perCompletedTask;
            const catalogFit = result.catalogEligible.some((item: { id: string }) => item.id === model.id);
            const rankFit = result.eligible.some((item: { id: string }) => item.id === model.id);
            const overBudget = budget > 0 && expected > budget;
            const status = !catalogFit ? "EXCLUDED" : overBudget && model.recommendationReady ? "OVER BUDGET" : rankFit ? "RANK-ELIGIBLE" : model.recommendationReady ? "BELOW RULE GATE" : "EVAL REQUIRED";
            return <button className={`table-row ${active?.id === model.id ? "active" : ""}`} key={model.id} onClick={() => setSelected(model.id)}><span><i className={model.accent} />{model.name}</span><span>{model.provider}</span><span>{money(expected)}</span><span>{model.evidenceStatus}</span><span className={rankFit ? "fit" : catalogFit ? "pending" : "miss"}>{status}</span></button>;
          })}
        </div>
        <p className="source-note">Catalog checked August 9, 2026 against <a href="https://developers.openai.com/api/docs/models/compare">OpenAI</a>, <a href="https://ai.google.dev/gemini-api/docs/pricing">Google Gemini</a>, and <a href="https://platform.claude.com/docs/en/about-claude/pricing">Anthropic Claude</a> model and pricing documentation. Price fields are published facts. Output-length and retry distributions are versioned planning heuristics until live evaluation replaces them with measured distributions; cache writes, storage, grounding, tools, batch modes, regional premiums, long-context premiums, and infrastructure remain itemized coverage gaps.</p>
      </section>

      <section className="about-section" id="about">
        <div className="about-grid"><h2>Built for builders who want evidence before commitment.</h2><div><p>AI Build Crew turns a rough product idea into a transparent workload estimate, an evidence-gated model comparison, and a governed decision that stays human-owned.</p><p className="badlabz">Developed by <a href="https://badlabz.com">BadLabz.com ↗</a> :)</p></div></div>
      </section>

      <footer><span>AI BUILD CREW · BADLABZ.COM</span><p><b>Current:</b> reviewed catalog snapshots, reproducible token math, and an OpenAI heuristic policy baseline. <b>Not yet measured:</b> cross-provider workload quality. <b>Decision owner:</b> human.</p><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}

function GuidedQuestion(props: { index: number; answered: boolean; markAnswered: (id: string) => void; applyUsageProfile: (profile: "experiment" | "pilot" | "launch" | "unknown") => void; task: string; setTask: (v: string) => void; risk: string; setRisk: (v: string) => void; dataSensitivity: string; setDataSensitivity: (v: string) => void; modalities: string[]; setModalities: (v: string[]) => void; regulatedStatus: "Unknown" | "No" | "Yes"; setRegulatedStatus: (v: "Unknown" | "No" | "Yes") => void; advance: () => void; estimateNow: () => void }) {
  const current = guidedQuestions[props.index];
  const choose = (value: string, setter: (value: string) => void) => { setter(value); props.markAnswered(current.id); };
  return <div className="guided-card"><span>QUESTION {current.number} OF 05</span><h3>{current.id === "modality" ? "Which formats must the workflow understand?" : current.prompt}</h3>{current.id === "task" && <select value={props.answered ? props.task : ""} onChange={(e) => choose(e.target.value, props.setTask)}><option value="" disabled>Choose the closest job</option><option>Not sure</option>{Object.keys(taskRequirements).map((item) => <option key={item}>{item}</option>)}</select>}{current.id === "risk" && <><p>Choose the consequence of an incorrect, incomplete, or unreliable result.</p><select value={props.answered ? props.risk : ""} onChange={(e) => choose(e.target.value, props.setRisk)}><option value="" disabled>Choose the impact of failure</option><option value="Unknown">Unknown — I need help assessing it</option><option value="Low">Low — easy to detect and correct</option><option value="Medium">Medium — causes rework, delay, or added cost</option><option value="High">High — could cause harm, financial loss, rights, or compliance impact</option></select></>}{current.id === "data" && <><select value={props.answered ? props.dataSensitivity : ""} onChange={(e) => choose(e.target.value, props.setDataSensitivity)}><option value="" disabled>Choose a data type—even “Unknown”</option><option>Unknown</option><option>Public</option><option>Internal</option><option>Sensitive</option><option>Protected</option></select><label className="guided-check">Regulated or compliance-controlled?<select value={props.regulatedStatus} onChange={(e) => props.setRegulatedStatus(e.target.value as "Unknown" | "No" | "Yes")}><option>Unknown</option><option>No</option><option>Yes</option></select></label></>}{current.id === "modality" && <><p>Select all that apply to the same completed task.</p><div className="profile-buttons">{[["text", "Text"], ["image", "Images"], ["audio", "Audio"], ["video", "Video"]].map(([value, label]) => <button type="button" key={value} aria-pressed={props.modalities.includes(value)} className={props.modalities.includes(value) && props.answered ? "selected" : ""} onClick={() => { const currentValues = props.answered ? props.modalities : []; const next = currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value]; if (next.length) { props.setModalities(next); props.markAnswered(current.id); } }}>{label}<small>{value === "text" ? "documents, prompts, code" : value === "image" ? "photos, scans, diagrams" : value === "audio" ? "speech or sound" : "moving image"}</small></button>)}</div></>}{current.id === "usage" && <><p>Choose a planning stage. You can inspect and edit every technical assumption before the calculation.</p><div className="profile-buttons"><button onClick={() => props.applyUsageProfile("experiment")}>Experiment<small>About 25 uses/day</small></button><button onClick={() => props.applyUsageProfile("pilot")}>Pilot<small>About 250 uses/day</small></button><button onClick={() => props.applyUsageProfile("launch")}>Launch<small>About 2,500 uses/day</small></button><button onClick={() => props.applyUsageProfile("unknown")}>Not sure<small>Use a visible starter profile</small></button></div></>}<div className="guided-actions"><button disabled={!props.answered} onClick={props.advance}>Continue</button><button onClick={props.estimateNow}>Estimate now with visible assumptions</button></div></div>;
}

function WorkflowStepField({ label, value, resolved, setValue, max, assumed, hint }: { label: string; value: number; resolved: number; setValue: (value: number) => void; max: number; assumed?: boolean; hint: string }) {
  return <div className="field"><label>{label} {assumed && <em>RECOMMENDED</em>}</label><select aria-label={label} value={value} onChange={(e) => setValue(Number(e.target.value))}><option value={label.startsWith("Primary") ? 0 : -1}>Not sure — recommend {resolved}</option>{Array.from({ length: max + (label.startsWith("Primary") ? 0 : 1) }, (_, index) => index + (label.startsWith("Primary") ? 1 : 0)).map((step) => <option value={step} key={step}>{step}</option>)}</select><small className="field-hint">{hint}</small></div>;
}

function NumberField({ label, value, setValue, min, max, assumed, prefix, hint }: { label: string; value: number; setValue: (value: number) => void; min: number; max?: number; assumed?: boolean; prefix?: string; hint?: string }) {
  return <div className="field"><label>{label} {assumed && <em>ASSUMED</em>}</label><div className="number-wrap">{prefix && <span>{prefix}</span>}<input aria-label={label} type="number" value={value} min={min} max={max} onChange={(e) => setValue(Math.max(min, max ? Math.min(max, Number(e.target.value)) : Number(e.target.value)))} /><span>{label.includes("%") ? "%" : ""}</span></div>{hint && <small className="field-hint">{hint}</small>}</div>;
}

function StatusStep({ number, name, status, detail }: { number: string; name: string; status: string; detail: string }) {
  return <article><span>{number}</span><h3>{name}</h3><b className={`status ${status.toLowerCase()}`}>{status.replaceAll("_", " ")}</b><p>{detail}</p></article>;
}
