"use client";

import { useMemo, useState } from "react";

type Model = {
  id: string;
  name: string;
  lane: string;
  input: number;
  cached: number;
  output: number;
  quality: number;
  accent: string;
};

const models: Model[] = [
  { id: "gpt-5.6-luna", name: "GPT-5.6 Luna", lane: "Fast, repeatable work", input: 0.2, cached: 0.02, output: 1.2, quality: 1, accent: "lime" },
  { id: "gpt-5.6-terra", name: "GPT-5.6 Terra", lane: "Balanced product work", input: 2, cached: 0.2, output: 12, quality: 2, accent: "violet" },
  { id: "gpt-5.6-sol", name: "GPT-5.6 Sol", lane: "Complex, high-stakes work", input: 5, cached: 0.5, output: 30, quality: 3, accent: "orange" },
];

const taskRequirements: Record<string, number> = {
  "Classification & extraction": 1,
  "Content & summarization": 1,
  "Product analysis": 2,
  "Coding & agent workflow": 2,
  "Complex reasoning": 3,
};

function money(value: number) {
  if (value < 0.01) return `$${value.toFixed(4)}`;
  if (value < 100) return `$${value.toFixed(2)}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default function Home() {
  const [task, setTask] = useState("Product analysis");
  const [risk, setRisk] = useState("Medium");
  const [requests, setRequests] = useState(1000);
  const [inputTokens, setInputTokens] = useState(2400);
  const [outputTokens, setOutputTokens] = useState(650);
  const [cache, setCache] = useState(20);
  const [calls, setCalls] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);

  const result = useMemo(() => {
    const riskLevel = risk === "High" ? 3 : risk === "Medium" ? 2 : 1;
    const needed = Math.max(taskRequirements[task], riskLevel);
    const eligible = models.filter((model) => model.quality >= needed);
    const recommendation = eligible.sort((a, b) => a.input + a.output - b.input - b.output)[0] ?? models[2];
    const active = models.find((model) => model.id === selected) ?? recommendation;
    const cachedTokens = inputTokens * (cache / 100);
    const uncachedTokens = inputTokens - cachedTokens;
    const perRequest = calls * ((uncachedTokens * active.input + cachedTokens * active.cached + outputTokens * active.output) / 1_000_000);
    const monthly = perRequest * requests * 30;
    return { needed, recommendation, active, perRequest, monthly, annual: monthly * 12 };
  }, [task, risk, requests, inputTokens, outputTokens, cache, calls, selected]);

  async function generateBrief() {
    setLoading(true);
    setBrief("");
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ task, risk, requests, inputTokens, outputTokens, cache, calls, model: result.active.name, monthly: result.monthly }),
      });
      const data = await response.json();
      setBrief(data.brief || "The deterministic recommendation is ready; an AI explanation is unavailable right now.");
    } catch {
      setBrief(`${result.active.name} is the lowest-cost model in the catalog that clears the ${risk.toLowerCase()}-risk quality threshold for ${task.toLowerCase()}. Start here, then validate quality with representative cases.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="AI Build Crew home"><span className="brand-mark">A</span> AI Build Crew</a>
        <div className="nav-links"><a href="#estimator">Estimator</a><a href="#models">Models</a><a href="#method">Method</a></div>
        <span className="alpha">Alpha · 01</span>
      </nav>

      <section className="hero" id="top">
        <div className="eyebrow"><span /> Model economics, made legible</div>
        <h1>Pick the right model.<br /><em>Know the cost.</em></h1>
        <p className="lede">A decision workbench for builders who need a defensible model choice—not another pricing spreadsheet.</p>
        <a className="primary" href="#estimator">Build an estimate <span>↘</span></a>
        <div className="hero-stamp"><span>PRICING SNAPSHOT</span><strong>AUG 07<br />2026</strong><small>USD · PER 1M TOKENS</small></div>
      </section>

      <section className="estimator" id="estimator">
        <div className="section-kicker">01 / DEFINE THE WORK</div>
        <div className="workbench">
          <div className="inputs">
            <div className="field wide"><label htmlFor="task">What are you building?</label><select id="task" value={task} onChange={(e) => { setTask(e.target.value); setSelected(null); }}>{Object.keys(taskRequirements).map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="field"><label htmlFor="risk">Consequence of error</label><select id="risk" value={risk} onChange={(e) => { setRisk(e.target.value); setSelected(null); }}><option>Low</option><option>Medium</option><option>High</option></select></div>
            <NumberField label="Requests / day" value={requests} setValue={setRequests} min={1} />
            <NumberField label="Input tokens / call" value={inputTokens} setValue={setInputTokens} min={1} />
            <NumberField label="Output tokens / call" value={outputTokens} setValue={setOutputTokens} min={1} />
            <NumberField label="Cached input %" value={cache} setValue={setCache} min={0} max={100} />
            <NumberField label="Model calls / request" value={calls} setValue={setCalls} min={1} max={50} />
            <p className="input-note">Change any assumption. The estimate updates instantly.</p>
          </div>

          <aside className="result-card">
            <div className="result-label">Recommended starting point</div>
            <div className={`model-orbit ${result.active.accent}`}><span>{result.active.name.split(" ").at(-1)?.slice(0, 1)}</span></div>
            <h2>{result.active.name}</h2>
            <p>{result.active.lane}</p>
            {selected && selected !== result.recommendation.id && <div className="override">Manual comparison · recommended: {result.recommendation.name}</div>}
            <div className="cost-grid">
              <div><small>PER REQUEST</small><strong>{money(result.perRequest)}</strong></div>
              <div><small>PER MONTH</small><strong>{money(result.monthly)}</strong></div>
              <div><small>ANNUAL RUN RATE</small><strong>{money(result.annual)}</strong></div>
            </div>
            <div className="range"><span>PLANNING RANGE</span><strong>{money(result.monthly * 0.8)} — {money(result.monthly * 1.25)} / month</strong></div>
            <button className="brief-button" onClick={generateBrief} disabled={loading}>{loading ? "Building decision brief…" : "Explain this choice with AI"}</button>
            {brief && <div className="brief" aria-live="polite">{brief}</div>}
          </aside>
        </div>
      </section>

      <section className="model-section" id="models">
        <div className="section-head"><div><div className="section-kicker dark">02 / COMPARE THE FIELD</div><h2>One workload.<br />Three economic profiles.</h2></div><p>Click a model to pressure-test the recommendation against the same workload assumptions.</p></div>
        <div className="model-table">
          <div className="table-row header"><span>MODEL</span><span>INPUT / MTOK</span><span>OUTPUT / MTOK</span><span>MONTHLY</span><span>FIT</span></div>
          {models.map((model) => {
            const cachedTokens = inputTokens * (cache / 100);
            const per = calls * (((inputTokens - cachedTokens) * model.input + cachedTokens * model.cached + outputTokens * model.output) / 1_000_000);
            const monthly = per * requests * 30;
            const fit = model.quality >= result.needed;
            return <button className={`table-row ${result.active.id === model.id ? "active" : ""}`} key={model.id} onClick={() => setSelected(model.id)}><span><i className={model.accent} />{model.name}</span><span>${model.input.toFixed(2)}</span><span>${model.output.toFixed(2)}</span><span>{money(monthly)}</span><span className={fit ? "fit" : "miss"}>{fit ? "ELIGIBLE" : "BELOW BAR"}</span></button>;
          })}
        </div>
        <p className="source-note">Pricing snapshot from OpenAI’s published model catalog. Estimates exclude non-token platform, storage, retrieval, and third-party tool charges.</p>
      </section>

      <section className="method" id="method">
        <div className="section-kicker">03 / THE DECISION RULE</div>
        <h2>Cost is a constraint.<br /><em>Quality is the gate.</em></h2>
        <div className="steps">
          <article><b>01</b><h3>Describe</h3><p>Size the real workload: volume, tokens, caching, and agent calls.</p></article>
          <article><b>02</b><h3>Qualify</h3><p>Set the task complexity and consequence-of-error threshold.</p></article>
          <article><b>03</b><h3>Choose</h3><p>Select the least expensive eligible model, then validate it with representative cases.</p></article>
        </div>
      </section>

      <footer><span>AI BUILD CREW · ALPHA</span><p>Decision support, not a guarantee. Measure production usage and re-evaluate as models and prices change.</p><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}

function NumberField({ label, value, setValue, min, max }: { label: string; value: number; setValue: (value: number) => void; min: number; max?: number }) {
  return <div className="field"><label>{label}</label><div className="number-wrap"><input aria-label={label} type="number" value={value} min={min} max={max} onChange={(e) => setValue(Math.max(min, max ? Math.min(max, Number(e.target.value)) : Number(e.target.value)))} /><span>{label.includes("%") ? "%" : ""}</span></div></div>;
}
