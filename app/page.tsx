"use client";

import { useMemo, useState } from "react";
import { analyzeWorkload, costFor, deterministicBrief, models, taskRequirements } from "@/lib/decision-engine.mjs";

type Stage = "start" | "guided" | "estimate";

const guidedQuestions = [
  { id: "task", number: "01", prompt: "What job must the model perform?" },
  { id: "risk", number: "02", prompt: "What happens if the model is wrong?" },
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
  const [modality, setModality] = useState("text");
  const [regulatedStatus, setRegulatedStatus] = useState<"Unknown" | "No" | "Yes">("Unknown");
  const [requests, setRequests] = useState(1000);
  const [inputTokens, setInputTokens] = useState(2400);
  const [outputTokens, setOutputTokens] = useState(650);
  const [cache, setCache] = useState(20);
  const [calls, setCalls] = useState(1);
  const [budget, setBudget] = useState(0);
  const [assumptions, setAssumptions] = useState(["task", "risk", "dataSensitivity", "modality", "regulated", "requests", "inputTokens", "outputTokens", "cache", "calls", "budget"]);
  const [selected, setSelected] = useState<string | null>(null);
  const [providerFilter, setProviderFilter] = useState("All");
  const [decision, setDecision] = useState("Not decided");
  const [overrideReason, setOverrideReason] = useState("");
  const [guidedAnswers, setGuidedAnswers] = useState<string[]>([]);

  const assessmentDate = new Date().toISOString().slice(0, 10);
  const result = useMemo(() => analyzeWorkload({ task, risk, dataSensitivity, modality, regulated: regulatedStatus === "Yes", requests, inputTokens, outputTokens, cache, calls, budget, assumptions, asOfDate: assessmentDate }), [task, risk, dataSensitivity, modality, regulatedStatus, requests, inputTokens, outputTokens, cache, calls, budget, assumptions, assessmentDate]);
  const active = models.find((model) => model.id === selected) ?? result.recommendation ?? models[0];
  const comparisonOnly = Boolean(selected && !active.recommendationReady);
  const activeScenarios = { low: costFor(active, result.workload, 0.75), expected: costFor(active, result.workload, 1), high: costFor(active, result.workload, 1.35) };
  const visibleModels = providerFilter === "All" ? models : models.filter((model) => model.provider === providerFilter);

  function markKnown(field: string, value: number, setter: (value: number) => void) {
    setter(value);
    setAssumptions((current) => current.filter((item) => item !== field));
    setDecision("Not decided");
  }

  function startEstimate(route: "known" | "assisted" | "sample") {
    if (route === "sample") {
      setIdea("A product team needs a recurring model to analyze product requirements and draft decision briefs.");
      setTask("Product analysis"); setRisk("Medium"); setDataSensitivity("Public"); setModality("text"); setRegulatedStatus("No");
      setRequests(1000); setInputTokens(2400); setOutputTokens(650); setCache(20); setCalls(1); setBudget(0);
      setAssumptions(["task", "risk", "dataSensitivity", "modality", "regulated", "requests", "inputTokens", "outputTokens", "cache", "calls", "budget"]);
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
    const field = id === "data" ? "dataSensitivity" : id;
    setAssumptions((current) => current.filter((item) => item !== field));
  }

  function applyUsageProfile(profile: "experiment" | "pilot" | "launch" | "unknown") {
    const values = profile === "experiment"
      ? { requests: 25, input: 800, output: 200, calls: 1 }
      : profile === "launch"
        ? { requests: 2500, input: 3500, output: 800, calls: 2 }
        : profile === "pilot"
          ? { requests: 250, input: 2000, output: 500, calls: 1 }
          : { requests: 100, input: 1500, output: 400, calls: 1 };
    setRequests(values.requests); setInputTokens(values.input); setOutputTokens(values.output); setCalls(values.calls); setCache(0);
    setAssumptions((current) => [...new Set([...current, "requests", "inputTokens", "outputTokens", "cache", "calls"])]);
    markGuidedAnswer("usage");
  }

  function advanceGuided() {
    if (question >= guidedQuestions.length - 1) {
      setStage("estimate");
      setTimeout(() => document.querySelector("#estimator")?.scrollIntoView({ behavior: "smooth" }), 50);
    } else setQuestion((current) => current + 1);
  }

  const brief = deterministicBrief(result);
  const activeBrief = active.recommendationReady
    ? brief
    : `${active.name} is cost-visible from published ${active.provider} catalog data. It is not ranked against the baseline until the shared workload evaluation supplies quality, reliability, and latency evidence.${active.pricingNotes ? ` ${active.pricingNotes}` : ""}`;

  return (
    <main>
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="AI Build Crew home"><span className="brand-mark">A</span> AI Build Crew</a>
        <div className="nav-links"><a href="#intake">Guided start</a><a href="#estimator">Estimate</a><a href="#governance">Governance</a><a href="#artifacts">Artifacts</a><a href="#about">About</a></div>
        <span className="alpha">Alpha · 02</span>
      </nav>

      <section className="hero" id="top">
        <div className="eyebrow"><span /> From idea to model-usage cost range</div>
        <h1>Describe what you want to build.<br /><em>Get a model starting point.</em></h1>
        <p className="lede">You do not need to know a model, token count, or technical architecture. AI Build Crew turns everyday product choices into a transparent monthly model-usage estimate, then checks the result before you decide.</p>
        <a className="primary" href="#intake">Guide me to an estimate <span>↘</span></a>
        <div className="hero-stamp"><span>RULESET</span><strong>1.2<br />LOCKED</strong><small>HUMAN-OWNED DECISION</small></div>
      </section>

      <section className="intake-section" id="intake">
        <div className="section-kicker">01 / START WITH WHAT YOU KNOW</div>
        <div className="intake-shell">
          <div className="intake-copy">
            <h2>The prompt is the beginning.<br /><em>The rules finish the work.</em></h2>
            <p>Bring a complete workload, a rough idea, or a simple product question. Use the five-question guide, enter known usage directly, or stop early and review every remaining assumption.</p>
            <div className="control-line"><b>Fixed sequence</b><span>Facts → assumptions → estimate → evaluation → audit → governance → human decision</span></div>
          </div>
          <div className="prompt-card">
            {stage === "start" && <>
              <label htmlFor="idea">What are you thinking about building?</label>
              <textarea id="idea" value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="Example: A tool that reviews product requirements and drafts a decision brief for my team…" />
              <p className="prompt-help">Use everyday language. This description stays context until you confirm the workload assumptions. The Alpha estimates model token charges—not development labor or complete application infrastructure.</p>
              <div className="route-buttons">
                <button onClick={() => startEstimate("assisted")}>Guide me to an estimate</button>
                <button onClick={() => startEstimate("known")}>I already know my usage</button>
                <button onClick={() => startEstimate("sample")}>Show me an example</button>
              </div>
            </>}
            {stage === "guided" && <GuidedQuestion index={question} answered={guidedAnswers.includes(guidedQuestions[question].id)} markAnswered={markGuidedAnswer} applyUsageProfile={applyUsageProfile} task={task} setTask={setTask} risk={risk} setRisk={setRisk} dataSensitivity={dataSensitivity} setDataSensitivity={setDataSensitivity} modality={modality} setModality={setModality} regulatedStatus={regulatedStatus} setRegulatedStatus={(value) => { setRegulatedStatus(value); setAssumptions((current) => value === "Unknown" ? [...new Set([...current, "regulated"])] : current.filter((item) => item !== "regulated")); }} advance={advanceGuided} estimateNow={() => setStage("estimate")} />}
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
            <div className="field"><label htmlFor="risk">Consequence of error {assumptions.includes("risk") && <em>ASSUMED</em>}</label><select id="risk" value={risk} onChange={(e) => { setRisk(e.target.value); setAssumptions((current) => current.filter((item) => item !== "risk")); setSelected(null); setDecision("Not decided"); }}><option>Unknown</option><option>Low</option><option>Medium</option><option>High</option></select></div>
            <div className="field"><label htmlFor="data">Data class</label><select id="data" value={dataSensitivity} onChange={(e) => { setDataSensitivity(e.target.value); setAssumptions((current) => current.filter((item) => item !== "dataSensitivity")); }}><option>Unknown</option><option>Public</option><option>Internal</option><option>Sensitive</option><option>Protected</option></select></div>
            <div className="field"><label htmlFor="modality">Required modality {assumptions.includes("modality") && <em>ASSUMED</em>}</label><select id="modality" value={modality} onChange={(e) => { setModality(e.target.value); setAssumptions((current) => current.filter((item) => item !== "modality")); }}><option value="text">Text</option><option value="image">Image</option><option value="audio">Audio</option><option value="video">Video</option></select></div>
            <div className="field"><label htmlFor="regulated">Regulated or compliance-controlled? {assumptions.includes("regulated") && <em>UNKNOWN</em>}</label><select id="regulated" value={regulatedStatus} onChange={(e) => { const value = e.target.value as "Unknown" | "No" | "Yes"; setRegulatedStatus(value); setAssumptions((current) => value === "Unknown" ? [...new Set([...current, "regulated"])] : current.filter((item) => item !== "regulated")); }}><option>Unknown</option><option>No</option><option>Yes</option></select></div>
            <NumberField label="Uses per day" value={requests} setValue={(v) => markKnown("requests", v, setRequests)} min={1} assumed={assumptions.includes("requests")} hint="How many times people or systems will ask the AI to do this job each day." />
            <NumberField label="Information going in" value={inputTokens} setValue={(v) => markKnown("inputTokens", v, setInputTokens)} min={1} assumed={assumptions.includes("inputTokens")} hint="Measured in tokens. About 750 tokens is roughly one page of ordinary English." />
            <NumberField label="Answer coming back" value={outputTokens} setValue={(v) => markKnown("outputTokens", v, setOutputTokens)} min={1} assumed={assumptions.includes("outputTokens")} hint="A short answer may be 100–300 tokens; a detailed page may be about 750." />
            <NumberField label="Reusable input" value={cache} setValue={(v) => markKnown("cache", v, setCache)} min={0} max={100} assumed={assumptions.includes("cache")} hint="The percentage of repeated instructions a provider may bill at a cached rate." />
            <NumberField label="AI steps per use" value={calls} setValue={(v) => markKnown("calls", v, setCalls)} min={1} max={50} assumed={assumptions.includes("calls")} hint="One answer is one step. Tool use or an agent loop may create several charged model calls." />
            <NumberField label="Maximum monthly budget" value={budget} setValue={(v) => { setBudget(v); setAssumptions((current) => current.filter((item) => item !== "budget")); setSelected(null); setDecision("Not decided"); }} min={0} prefix="$" hint="0 means no budget ceiling" assumed={assumptions.includes("budget")} />
            <div className="ledger wide"><b>WHAT THIS ESTIMATE ASSUMES</b><span>{assumptions.length ? `Planning assumptions: ${assumptions.map((field) => ({ task: "work to perform", risk: "consequence of error", dataSensitivity: "data class", modality: "content type", regulated: "regulatory status", requests: "uses per day", inputTokens: "information going in", outputTokens: "answer size", cache: "reusable input", calls: "AI steps", budget: "monthly budget" }[field] ?? field)).join(", ")}` : "Known: all planning values were confirmed by the user"}</span><span>Unknown safety fields trigger review; they never default to safe.</span></div>
          </div>

          <aside className="result-card">
            <div className="result-label">{active.recommendationReady ? "Reproducible cost baseline" : "Catalog-only comparison"} · {(comparisonOnly ? "NOT EVALUATED" : result.disposition).replaceAll("_", " ")}</div>
            <div className={`model-orbit ${active.accent}`}><span>{active.name.split(" ").at(-1)?.slice(0, 1)}</span></div>
            <h2>{result.recommendation ? active.name : "No eligible model"}</h2>
            <p>{result.recommendation ? active.lane : "Stop and resolve the capability or policy gap."}</p>
            {selected && selected !== result.recommendation?.id && <div className="override">Comparison only · policy-baseline recommendation: {result.recommendation?.name ?? "none"}</div>}
            <div className="cost-grid">
              <div><small>LOW / MONTH</small><strong>{money(activeScenarios.low.monthly)}</strong></div>
              <div><small>EXPECTED / MONTH</small><strong>{money(activeScenarios.expected.monthly)}</strong></div>
              <div><small>HIGH / MONTH</small><strong>{money(activeScenarios.high.monthly)}</strong></div>
            </div>
            <div className={`budget-status ${budget > 0 && activeScenarios.expected.monthly > budget ? "over" : ""}`}><span>{budget > 0 ? `Monthly ceiling ${money(budget)}` : "No monthly budget ceiling set"}</span>{budget > 0 && <strong>{activeScenarios.expected.monthly <= budget ? `${money(budget - activeScenarios.expected.monthly)} remaining` : `${money(activeScenarios.expected.monthly - budget)} over budget`}</strong>}</div>
            <div className="annual-cost"><span>12-month token forecast</span><strong>{money(costFor(active, result.workload, 1).annual)}</strong></div>
            <div className="brief deterministic" aria-live="polite">{activeBrief}</div>
            <div className="version-line">Catalog {result.catalog.version} · Engine {result.audit.engineVersion} · Evidence {active.evidenceStatus}</div>
            <p className="coverage-boundary"><b>Included:</b> cataloged model token input, cached reads, and output. <b>Not included:</b> build labor, hosting, databases, retrieval, storage, tools, monitoring, or human review.</p>
          </aside>
        </div>
      </section>

      <section className={`pipeline-section ${stage !== "estimate" ? "pre-estimate-hidden" : ""}`} id="governance" aria-hidden={stage !== "estimate"}>
        <div className="section-kicker dark">03 / DOUBLE-CHECK THE RESULT</div>
        <div className="pipeline-head"><h2>A recommendation<br />does not approve itself.</h2><p>The Alpha produces logically separate deterministic estimate, check, audit, and governance outputs. Independent deployed agents remain future work.</p></div>
        <div className="pipeline">
          <StatusStep number="01" name="Estimate" status={result.recommendation ? "PASS" : "BLOCK"} detail={result.recommendation ? "Three cost scenarios calculated" : "No rule-eligible model"} />
          <StatusStep number="02" name="Evaluation" status={comparisonOnly ? "NOT RUN" : result.evaluation.status} detail={comparisonOnly ? "Shared workload evidence is required" : `${result.evaluation.checks.filter((item: { pass: boolean }) => item.pass).length}/${result.evaluation.checks.length} deterministic checks passed`} />
          <StatusStep number="03" name="Audit" status={comparisonOnly ? "NOT RUN" : result.audit.status} detail={comparisonOnly ? "No evaluated result to audit" : "Expected cost deterministically recomputed"} />
          <StatusStep number="04" name="Governance" status={comparisonOnly ? "NOT APPLIED" : result.governance.status} detail={comparisonOnly ? "Catalog facts are not an approval" : result.governance.findings.length ? result.governance.findings.map((item: { id: string }) => item.id).join(" · ") : "No findings"} />
        </div>
        <div className="governance-findings">
          <div><h3>Rule findings</h3>{comparisonOnly ? <p><b>EVAL REQUIRED</b>Catalog facts are visible, but baseline rule findings do not transfer to an unevaluated provider model.</p> : result.governance.findings.length ? result.governance.findings.map((finding: { id: string; severity: string; message: string }) => <p key={finding.id}><b>{finding.id} · {finding.severity}</b>{finding.message}</p>) : <p><b>PASS</b>No governance exception detected.</p>}</div>
          <div className="decision-gate"><h3>Human decision gate</h3><p>The recommendation is evidence—not approval. A person remains accountable for the final judgment.</p><div className="decision-actions"><button disabled={comparisonOnly || result.disposition !== "READY_FOR_HUMAN_DECISION"} onClick={() => setDecision("Approved by decision owner")}>Approve</button><button onClick={() => { setDecision("Edit and rerun"); document.querySelector("#estimator")?.scrollIntoView({ behavior: "smooth" }); }}>Edit & rerun</button><button onClick={() => setDecision("Escalated for review")}>Escalate</button></div><label>Override reason<input value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} placeholder="Required before recording a permitted override" /></label><button className="record-override" disabled={comparisonOnly || !overrideReason.trim() || result.disposition !== "READY_FOR_HUMAN_DECISION"} onClick={() => setDecision(`Override recorded: ${overrideReason}`)}>Record override</button><strong className="decision-state">{decision}</strong></div>
        </div>
      </section>

      <section className={`model-section ${stage !== "estimate" ? "pre-estimate-hidden" : ""}`} id="models" aria-hidden={stage !== "estimate"}>
        <div className="section-head"><div><div className="section-kicker dark">04 / UNDERSTAND THE TRADE-OFF</div><h2>Published facts first.<br />Shared evals next.</h2></div><p>Catalog fields can be compared now. Cross-provider ranking waits for the same representative workload to measure quality, reliability, latency, and actual cost.</p></div>
        <div className="catalog-control"><div><b>CATALOG COVERAGE</b><span>{result.coverage.providers.length} providers · {models.length} models · {result.coverage.evaluatedProviders.length} provider currently rank-eligible</span></div><div className="provider-filters">{["All", ...result.coverage.providers].map((provider) => <button key={provider} className={providerFilter === provider ? "active" : ""} onClick={() => setProviderFilter(provider)}>{provider}</button>)}</div></div>
        <div className="model-table">
          <div className="table-row header"><span>MODEL</span><span>PROVIDER</span><span>EXPECTED</span><span>EVIDENCE</span><span>FIT</span></div>
          {visibleModels.map((model) => {
            const expected = costFor(model, result.workload, 1).monthly;
            const catalogFit = result.catalogEligible.some((item: { id: string }) => item.id === model.id);
            const rankFit = result.eligible.some((item: { id: string }) => item.id === model.id);
            const overBudget = budget > 0 && expected > budget;
            const status = !catalogFit ? "EXCLUDED" : overBudget && model.recommendationReady ? "OVER BUDGET" : rankFit ? "RANK-ELIGIBLE" : model.recommendationReady ? "BELOW RULE GATE" : "EVAL REQUIRED";
            return <button className={`table-row ${active.id === model.id ? "active" : ""}`} key={model.id} onClick={() => setSelected(model.id)}><span><i className={model.accent} />{model.name}</span><span>{model.provider}</span><span>{money(expected)}</span><span>{model.evidenceStatus}</span><span className={rankFit ? "fit" : catalogFit ? "pending" : "miss"}>{status}</span></button>;
          })}
        </div>
        <p className="source-note">Catalog checked August 8, 2026 against <a href="https://developers.openai.com/api/docs/models">OpenAI</a>, <a href="https://ai.google.dev/api/models">Google Gemini</a>, and <a href="https://platform.claude.com/docs/en/api/models/list">Anthropic Claude</a> model documentation and their published pricing. Expected cost includes token input, cached-read, and output fields shown in the catalog; model-specific cache writes, storage, grounding, tools, batch modes, regional premiums, and infrastructure remain itemized coverage gaps.</p>
      </section>

      <section className="method artifacts" id="artifacts">
        <div className="section-kicker">05 / REVIEW THE EVIDENCE</div>
        <h2>The decision and<br /><em>its receipts.</em></h2>
        <p className="artifact-intro">The public evidence set reports capability and limits without publishing the internal delivery playbook on this page.</p>
        <div className="artifact-links"><a href="https://github.com/CTATX/ai-build-crew/blob/main/RELEASE_NOTES.md">Release record ↗</a><a href="https://github.com/CTATX/ai-build-crew/blob/main/artifacts/CAPABILITY_AND_CHANNEL_AUDIT.md">Capability audit ↗</a><a href="https://github.com/CTATX/ai-build-crew/blob/main/artifacts/MARKET_DISCOVERY.md">Market discovery ↗</a><a href="https://github.com/CTATX/ai-build-crew/blob/main/artifacts/SELF_TEST_CYCLE.md">Self-test cycle ↗</a><a href="https://github.com/CTATX/ai-build-crew/raw/main/artifacts/AI_BUILD_CREW_OVERVIEW.pptx">Presentation ↗</a><a href="https://github.com/CTATX/ai-build-crew">Source repository ↗</a></div>
      </section>

      <section className="about-section" id="about">
        <div className="section-kicker">06 / ABOUT THE LAB</div>
        <div className="about-grid"><h2>Built for builders who want evidence before commitment.</h2><div><p>AI Build Crew turns a rough product idea into a transparent workload estimate, an evidence-gated model comparison, and a governed decision that stays human-owned.</p><p className="badlabz">Developed by <a href="https://badlabz.com">BadLabz.com ↗</a> :)</p></div></div>
      </section>

      <footer><span>AI BUILD CREW · BADLABZ.COM</span><p><b>Current:</b> reviewed catalog snapshots, reproducible token math, and an OpenAI heuristic policy baseline. <b>Not yet measured:</b> cross-provider workload quality. <b>Decision owner:</b> human.</p><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}

function GuidedQuestion(props: { index: number; answered: boolean; markAnswered: (id: string) => void; applyUsageProfile: (profile: "experiment" | "pilot" | "launch" | "unknown") => void; task: string; setTask: (v: string) => void; risk: string; setRisk: (v: string) => void; dataSensitivity: string; setDataSensitivity: (v: string) => void; modality: string; setModality: (v: string) => void; regulatedStatus: "Unknown" | "No" | "Yes"; setRegulatedStatus: (v: "Unknown" | "No" | "Yes") => void; advance: () => void; estimateNow: () => void }) {
  const current = guidedQuestions[props.index];
  const choose = (value: string, setter: (value: string) => void) => { setter(value); props.markAnswered(current.id); };
  return <div className="guided-card"><span>QUESTION {current.number} OF 05</span><h3>{current.prompt}</h3>{current.id === "task" && <select value={props.answered ? props.task : ""} onChange={(e) => choose(e.target.value, props.setTask)}><option value="" disabled>Choose the closest job</option><option>Not sure</option>{Object.keys(taskRequirements).map((item) => <option key={item}>{item}</option>)}</select>}{current.id === "risk" && <select value={props.answered ? props.risk : ""} onChange={(e) => choose(e.target.value, props.setRisk)}><option value="" disabled>Choose what fits best</option><option>Unknown</option><option>Low</option><option>Medium</option><option>High</option></select>}{current.id === "data" && <><select value={props.answered ? props.dataSensitivity : ""} onChange={(e) => choose(e.target.value, props.setDataSensitivity)}><option value="" disabled>Choose a data type—even “Unknown”</option><option>Unknown</option><option>Public</option><option>Internal</option><option>Sensitive</option><option>Protected</option></select><label className="guided-check">Regulated or compliance-controlled?<select value={props.regulatedStatus} onChange={(e) => props.setRegulatedStatus(e.target.value as "Unknown" | "No" | "Yes")}><option>Unknown</option><option>No</option><option>Yes</option></select></label></>}{current.id === "modality" && <select value={props.answered ? props.modality : ""} onChange={(e) => choose(e.target.value, props.setModality)}><option value="" disabled>Choose what the AI must understand</option><option value="text">Text</option><option value="image">Images</option><option value="audio">Audio</option><option value="video">Video</option></select>}{current.id === "usage" && <><p>Choose a planning stage. You can inspect and edit every technical assumption before the calculation.</p><div className="profile-buttons"><button onClick={() => props.applyUsageProfile("experiment")}>Experiment<small>About 25 uses/day</small></button><button onClick={() => props.applyUsageProfile("pilot")}>Pilot<small>About 250 uses/day</small></button><button onClick={() => props.applyUsageProfile("launch")}>Launch<small>About 2,500 uses/day</small></button><button onClick={() => props.applyUsageProfile("unknown")}>Not sure<small>Use a visible starter profile</small></button></div></>}<div className="guided-actions"><button disabled={!props.answered} onClick={props.advance}>Continue</button><button onClick={props.estimateNow}>Estimate now with visible assumptions</button></div></div>;
}

function NumberField({ label, value, setValue, min, max, assumed, prefix, hint }: { label: string; value: number; setValue: (value: number) => void; min: number; max?: number; assumed?: boolean; prefix?: string; hint?: string }) {
  return <div className="field"><label>{label} {assumed && <em>ASSUMED</em>}</label><div className="number-wrap">{prefix && <span>{prefix}</span>}<input aria-label={label} type="number" value={value} min={min} max={max} onChange={(e) => setValue(Math.max(min, max ? Math.min(max, Number(e.target.value)) : Number(e.target.value)))} /><span>{label.includes("%") ? "%" : ""}</span></div>{hint && <small className="field-hint">{hint}</small>}</div>;
}

function StatusStep({ number, name, status, detail }: { number: string; name: string; status: string; detail: string }) {
  return <article><span>{number}</span><h3>{name}</h3><b className={`status ${status.toLowerCase()}`}>{status.replaceAll("_", " ")}</b><p>{detail}</p></article>;
}
