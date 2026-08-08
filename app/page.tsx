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
  const [risk, setRisk] = useState("Medium");
  const [dataSensitivity, setDataSensitivity] = useState("Unknown");
  const [modality, setModality] = useState("text");
  const [regulated, setRegulated] = useState(false);
  const [requests, setRequests] = useState(1000);
  const [inputTokens, setInputTokens] = useState(2400);
  const [outputTokens, setOutputTokens] = useState(650);
  const [cache, setCache] = useState(20);
  const [calls, setCalls] = useState(1);
  const [assumptions, setAssumptions] = useState(["requests", "inputTokens", "outputTokens", "cache", "calls"]);
  const [selected, setSelected] = useState<string | null>(null);
  const [providerFilter, setProviderFilter] = useState("All");
  const [decision, setDecision] = useState("Not decided");
  const [overrideReason, setOverrideReason] = useState("");

  const result = useMemo(() => analyzeWorkload({ task, risk, dataSensitivity, modality, regulated, requests, inputTokens, outputTokens, cache, calls, assumptions, asOfDate: "2026-08-08" }), [task, risk, dataSensitivity, modality, regulated, requests, inputTokens, outputTokens, cache, calls, assumptions]);
  const active = models.find((model) => model.id === selected) ?? result.recommendation ?? models[0];
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
      setTask("Product analysis"); setRisk("Medium"); setDataSensitivity("Public"); setModality("text");
      setRequests(1000); setInputTokens(2400); setOutputTokens(650); setCache(20); setCalls(1);
      setAssumptions([]);
      setStage("estimate");
    } else if (route === "known") {
      setStage("estimate");
      setTimeout(() => document.querySelector("#estimator")?.scrollIntoView({ behavior: "smooth" }), 50);
    } else {
      setStage("guided"); setQuestion(0);
    }
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
        <div className="nav-links"><a href="#intake">Guided start</a><a href="#estimator">Estimate</a><a href="#governance">Governance</a><a href="#artifacts">Artifacts</a></div>
        <span className="alpha">Alpha · 02</span>
      </nav>

      <section className="hero" id="top">
        <div className="eyebrow"><span /> Governed model economics</div>
        <h1>Pick the right model.<br /><em>Prove the decision.</em></h1>
        <p className="lede">A deterministic decision workflow for product people who need the cost, the trade-offs, and the governance evidence—not another pricing spreadsheet.</p>
        <a className="primary" href="#intake">Start with what you know <span>↘</span></a>
        <div className="hero-stamp"><span>RULESET</span><strong>1.0<br />LOCKED</strong><small>CT OWNS DECISION</small></div>
      </section>

      <section className="intake-section" id="intake">
        <div className="section-kicker">01 / START WITH WHAT YOU KNOW</div>
        <div className="intake-shell">
          <div className="intake-copy">
            <h2>The prompt is the beginning.<br /><em>The rules finish the work.</em></h2>
            <p>CT can bring a complete workload, a rough idea, or nothing more than a product question. The intake stops as soon as enough facts exist to estimate safely.</p>
            <div className="control-line"><b>Fixed sequence</b><span>Facts → assumptions → estimate → eval → audit → governance → CT decision</span></div>
          </div>
          <div className="prompt-card">
            {stage === "start" && <>
              <label htmlFor="idea">CT, what are you considering building?</label>
              <textarea id="idea" value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="Example: I need to modernize a medical billing service and forecast the model, cost, and trade-offs…" />
              <div className="route-buttons">
                <button onClick={() => startEstimate("known")}>I know the workload</button>
                <button onClick={() => startEstimate("assisted")}>Help me shape it</button>
                <button onClick={() => startEstimate("sample")}>Use a safe example</button>
              </div>
            </>}
            {stage === "guided" && <GuidedQuestion index={question} task={task} setTask={setTask} risk={risk} setRisk={setRisk} dataSensitivity={dataSensitivity} setDataSensitivity={setDataSensitivity} modality={modality} setModality={setModality} regulated={regulated} setRegulated={setRegulated} advance={advanceGuided} estimateNow={() => setStage("estimate")} />}
            {stage === "estimate" && <div className="ready-card"><span>INTAKE READY</span><h3>{idea || "Workload details captured"}</h3><p>{assumptions.length ? `${assumptions.length} planning assumptions remain visible for CT review.` : "All planning fields are currently treated as CT-supplied."}</p><a href="#estimator">Run estimate, eval, audit, and governance ↓</a></div>}
          </div>
        </div>
      </section>

      <section className="estimator" id="estimator">
        <div className="section-kicker">02 / FREEZE THE WORKLOAD</div>
        <div className="workbench">
          <div className="inputs">
            <div className="field wide"><label htmlFor="task">Work to perform</label><select id="task" value={task} onChange={(e) => { setTask(e.target.value); setSelected(null); setDecision("Not decided"); }}>{Object.keys(taskRequirements).map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="field"><label htmlFor="risk">Consequence of error</label><select id="risk" value={risk} onChange={(e) => { setRisk(e.target.value); setSelected(null); setDecision("Not decided"); }}><option>Low</option><option>Medium</option><option>High</option></select></div>
            <div className="field"><label htmlFor="data">Data class</label><select id="data" value={dataSensitivity} onChange={(e) => setDataSensitivity(e.target.value)}><option>Unknown</option><option>Public</option><option>Internal</option><option>Sensitive</option><option>Protected</option></select></div>
            <div className="field"><label htmlFor="modality">Required modality</label><select id="modality" value={modality} onChange={(e) => setModality(e.target.value)}><option value="text">Text</option><option value="image">Image</option><option value="audio">Audio</option><option value="video">Video</option></select></div>
            <div className="field checkbox-field"><label><input type="checkbox" checked={regulated} onChange={(e) => setRegulated(e.target.checked)} /> Regulated domain or decision</label></div>
            <NumberField label="Requests / day" value={requests} setValue={(v) => markKnown("requests", v, setRequests)} min={1} assumed={assumptions.includes("requests")} />
            <NumberField label="Input tokens / call" value={inputTokens} setValue={(v) => markKnown("inputTokens", v, setInputTokens)} min={1} assumed={assumptions.includes("inputTokens")} />
            <NumberField label="Output tokens / call" value={outputTokens} setValue={(v) => markKnown("outputTokens", v, setOutputTokens)} min={1} assumed={assumptions.includes("outputTokens")} />
            <NumberField label="Cached input %" value={cache} setValue={(v) => markKnown("cache", v, setCache)} min={0} max={100} assumed={assumptions.includes("cache")} />
            <NumberField label="Model calls / request" value={calls} setValue={(v) => markKnown("calls", v, setCalls)} min={1} max={50} assumed={assumptions.includes("calls")} />
            <div className="ledger wide"><b>PROVENANCE LEDGER</b><span>{assumptions.length ? `Assumed: ${assumptions.join(", ")}` : "Known: all planning values confirmed by CT"}</span><span>Unknown safety fields trigger review; they never default to safe.</span></div>
          </div>

          <aside className="result-card">
            <div className="result-label">{active.recommendationReady ? "Deterministic baseline" : "Catalog-only comparison"} · {result.disposition.replaceAll("_", " ")}</div>
            <div className={`model-orbit ${active.accent}`}><span>{active.name.split(" ").at(-1)?.slice(0, 1)}</span></div>
            <h2>{result.recommendation ? active.name : "No eligible model"}</h2>
            <p>{result.recommendation ? active.lane : "Stop and resolve the capability or policy gap."}</p>
            {selected && selected !== result.recommendation?.id && <div className="override">Comparison only · evaluated-baseline recommendation: {result.recommendation?.name ?? "none"}</div>}
            <div className="cost-grid">
              <div><small>LOW / MONTH</small><strong>{money(activeScenarios.low.monthly)}</strong></div>
              <div><small>EXPECTED / MONTH</small><strong>{money(activeScenarios.expected.monthly)}</strong></div>
              <div><small>HIGH / MONTH</small><strong>{money(activeScenarios.high.monthly)}</strong></div>
            </div>
            <div className="brief deterministic" aria-live="polite">{activeBrief}</div>
            <div className="version-line">Catalog {result.catalog.version} · Engine {result.audit.engineVersion} · Evidence {active.evidenceStatus}</div>
          </aside>
        </div>
      </section>

      <section className="pipeline-section" id="governance">
        <div className="section-kicker dark">03 / DOUBLE-CHECK THE RESULT</div>
        <div className="pipeline-head"><h2>No model grades<br />its own homework.</h2><p>Each specialist sees a frozen result, performs one job, and cannot rewrite another specialist’s output.</p></div>
        <div className="pipeline">
          <StatusStep number="01" name="Estimate" status={result.recommendation ? "PASS" : "BLOCK"} detail={result.recommendation ? "Three cost scenarios calculated" : "No rule-eligible model"} />
          <StatusStep number="02" name="Evaluation" status={result.evaluation.status} detail={`${result.evaluation.checks.filter((item: { pass: boolean }) => item.pass).length}/${result.evaluation.checks.length} deterministic checks passed`} />
          <StatusStep number="03" name="Audit" status={result.audit.status} detail="Expected cost independently recomputed" />
          <StatusStep number="04" name="Governance" status={result.governance.status} detail={result.governance.findings.length ? result.governance.findings.map((item: { id: string }) => item.id).join(" · ") : "No findings"} />
        </div>
        <div className="governance-findings">
          <div><h3>Rule findings</h3>{result.governance.findings.length ? result.governance.findings.map((finding: { id: string; severity: string; message: string }) => <p key={finding.id}><b>{finding.id} · {finding.severity}</b>{finding.message}</p>) : <p><b>PASS</b>No governance exception detected.</p>}</div>
          <div className="decision-gate"><h3>CT decision gate</h3><p>CT owns the final judgment. A recommendation is evidence—not approval.</p><div className="decision-actions"><button disabled={result.disposition !== "READY_FOR_CT_DECISION"} onClick={() => setDecision("Approved by CT")}>Approve</button><button onClick={() => { setDecision("Edit and rerun"); document.querySelector("#estimator")?.scrollIntoView({ behavior: "smooth" }); }}>Edit & rerun</button><button onClick={() => setDecision("Escalated for review")}>Escalate</button></div><label>Override reason<input value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} placeholder="Required before recording an override" /></label><button className="record-override" disabled={!overrideReason.trim() || result.disposition !== "READY_FOR_CT_DECISION"} onClick={() => setDecision(`Overridden by CT: ${overrideReason}`)}>Record override</button><strong className="decision-state">{decision}</strong></div>
        </div>
      </section>

      <section className="model-section" id="models">
        <div className="section-head"><div><div className="section-kicker dark">04 / UNDERSTAND THE TRADE-OFF</div><h2>Published facts first.<br />Shared evals next.</h2></div><p>Catalog fields can be compared now. Cross-provider ranking waits for the same representative workload to measure quality, reliability, latency, and actual cost.</p></div>
        <div className="catalog-control"><div><b>CATALOG COVERAGE</b><span>{result.coverage.providers.length} providers · {models.length} models · {result.coverage.evaluatedProviders.length} provider currently rank-eligible</span></div><div className="provider-filters">{["All", ...result.coverage.providers].map((provider) => <button key={provider} className={providerFilter === provider ? "active" : ""} onClick={() => setProviderFilter(provider)}>{provider}</button>)}</div></div>
        <div className="model-table">
          <div className="table-row header"><span>MODEL</span><span>PROVIDER</span><span>EXPECTED</span><span>EVIDENCE</span><span>FIT</span></div>
          {visibleModels.map((model) => {
            const expected = costFor(model, result.workload, 1).monthly;
            const catalogFit = result.catalogEligible.some((item: { id: string }) => item.id === model.id);
            const rankFit = result.eligible.some((item: { id: string }) => item.id === model.id);
            const status = !catalogFit ? "EXCLUDED" : rankFit ? "RANK-ELIGIBLE" : model.recommendationReady ? "BELOW RULE GATE" : "EVAL REQUIRED";
            return <button className={`table-row ${active.id === model.id ? "active" : ""}`} key={model.id} onClick={() => setSelected(model.id)}><span><i className={model.accent} />{model.name}</span><span>{model.provider}</span><span>{money(expected)}</span><span>{model.evidenceStatus}</span><span className={rankFit ? "fit" : catalogFit ? "pending" : "miss"}>{status}</span></button>;
          })}
        </div>
        <p className="source-note">Catalog checked August 8, 2026 against <a href="https://developers.openai.com/api/docs/models">OpenAI</a>, <a href="https://ai.google.dev/api/models">Google Gemini</a>, and <a href="https://platform.claude.com/docs/en/api/models/list">Anthropic Claude</a> model documentation and their published pricing. Expected cost includes token input, cached-read, and output fields shown in the catalog; model-specific cache writes, storage, grounding, tools, batch modes, regional premiums, and infrastructure remain itemized coverage gaps.</p>
      </section>

      <section className="method artifacts" id="artifacts">
        <div className="section-kicker">05 / REVIEW THE EVIDENCE</div>
        <h2>The decision and<br /><em>its receipts.</em></h2>
        <div className="artifact-links"><a href="https://github.com/CTATX/ai-build-crew/blob/main/artifacts/ORIGINAL_PRD.md">Original product PRD ↗</a><a href="https://github.com/CTATX/ai-build-crew/blob/main/artifacts/MAVEN_AGENTIC_AI_PRD.md">Maven AI PRD ↗</a><a href="https://github.com/CTATX/ai-build-crew/raw/main/artifacts/AI_Build_Crew_Agentic_AI_PRD.xlsx">PRD workbook ↗</a><a href="https://github.com/CTATX/ai-build-crew/blob/main/WORKFLOW.md">Workflow ↗</a><a href="https://github.com/CTATX/ai-build-crew/blob/main/governance/GOVERNANCE_AND_EVALUATION.md">Governance ↗</a><a href="https://github.com/CTATX/ai-build-crew/blob/main/EVALUATION.md">Evaluation ↗</a><a href="https://github.com/CTATX/ai-build-crew/raw/main/artifacts/AI_BUILD_CREW_OVERVIEW.pptx">Presentation ↗</a><a href="https://github.com/CTATX/ai-build-crew/blob/main/artifacts/DEMO_SCRIPT.md">2–3 minute script ↗</a><a href="https://github.com/CTATX/ai-build-crew/blob/main/artifacts/BACKLOG.md">Provider backlog ↗</a></div>
      </section>

      <footer><span>AI BUILD CREW · GOVERNED ALPHA</span><p><b>Authoritative:</b> sourced catalog fields and deterministic math. <b>Evaluated:</b> shared workload evidence. <b>Decision owner:</b> CT.</p><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}

function GuidedQuestion(props: { index: number; task: string; setTask: (v: string) => void; risk: string; setRisk: (v: string) => void; dataSensitivity: string; setDataSensitivity: (v: string) => void; modality: string; setModality: (v: string) => void; regulated: boolean; setRegulated: (v: boolean) => void; advance: () => void; estimateNow: () => void }) {
  const current = guidedQuestions[props.index];
  return <div className="guided-card"><span>QUESTION {current.number} OF 05</span><h3>{current.prompt}</h3>{current.id === "task" && <select value={props.task} onChange={(e) => props.setTask(e.target.value)}>{Object.keys(taskRequirements).map((item) => <option key={item}>{item}</option>)}</select>}{current.id === "risk" && <select value={props.risk} onChange={(e) => props.setRisk(e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select>}{current.id === "data" && <><select value={props.dataSensitivity} onChange={(e) => props.setDataSensitivity(e.target.value)}><option>Unknown</option><option>Public</option><option>Internal</option><option>Sensitive</option><option>Protected</option></select><label className="guided-check"><input type="checkbox" checked={props.regulated} onChange={(e) => props.setRegulated(e.target.checked)} /> Regulated domain or decision</label></>}{current.id === "modality" && <select value={props.modality} onChange={(e) => props.setModality(e.target.value)}><option value="text">Text</option><option value="image">Image</option><option value="audio">Audio</option><option value="video">Video</option></select>}{current.id === "usage" && <p>Choose “Continue” to use the visible planning assumptions, or “Estimate now” to stop questioning and review them directly.</p>}<div className="guided-actions"><button onClick={props.advance}>Continue</button><button onClick={props.estimateNow}>Estimate now</button></div></div>;
}

function NumberField({ label, value, setValue, min, max, assumed }: { label: string; value: number; setValue: (value: number) => void; min: number; max?: number; assumed?: boolean }) {
  return <div className="field"><label>{label} {assumed && <em>ASSUMED</em>}</label><div className="number-wrap"><input aria-label={label} type="number" value={value} min={min} max={max} onChange={(e) => setValue(Math.max(min, max ? Math.min(max, Number(e.target.value)) : Number(e.target.value)))} /><span>{label.includes("%") ? "%" : ""}</span></div></div>;
}

function StatusStep({ number, name, status, detail }: { number: string; name: string; status: string; detail: string }) {
  return <article><span>{number}</span><h3>{name}</h3><b className={`status ${status.toLowerCase()}`}>{status.replaceAll("_", " ")}</b><p>{detail}</p></article>;
}
