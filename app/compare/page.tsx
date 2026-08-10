"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buildCatalogComparison, catalogReadiness, liveEvaluationPolicy } from "@/lib/provider-platform.mjs";

const providers = ["OpenAI", "Google", "Anthropic"];
const formats = ["text", "image", "audio", "video"];

function price(value: number) { return `$${value.toFixed(value < 1 ? 2 : 2)}`; }
function context(value: number) { return value >= 1_000_000 ? `${(value / 1_000_000).toFixed(value % 1_000_000 ? 2 : 0)}M` : `${Math.round(value / 1_000)}K`; }

export default function ComparePage() {
  const readiness = catalogReadiness();
  const [provider, setProvider] = useState("All");
  const [requiredFormats, setRequiredFormats] = useState<string[]>([]);
  const [minimumContext, setMinimumContext] = useState(0);
  const rows = useMemo(() => buildCatalogComparison({ providers: provider === "All" ? [] : [provider], modalities: requiredFormats, minimumContext }), [provider, requiredFormats, minimumContext]);

  function toggleFormat(format: string) {
    setRequiredFormats((current) => current.includes(format) ? current.filter((item) => item !== format) : [...current, format]);
  }

  return <main className="compare-page">
    <nav className="topbar">
      <Link className="brand" href="/" aria-label="AI Build Crew home"><span className="brand-mark">A</span> AI Build Crew</Link>
      <div className="nav-links"><Link href="/">Estimator</Link><a href="#catalog">Catalog</a><a href="#live">Live evaluation</a><a href="#controls">Controls</a></div>
      <span className="alpha">Phase 2 · catalog</span>
    </nav>

    <section className="compare-hero">
      <div className="eyebrow"><span /> Comparative model analysis</div>
      <h1>Compare the facts.<br /><em>Measure the rest.</em></h1>
      <p className="lede">Start with published price, context, format, tool, and availability facts. Quality, reliability, latency, and actual cost stay marked as unknown until every model runs the same controlled workload.</p>
      <div className="compare-status"><div><small>CATALOG SNAPSHOT</small><strong>{readiness.sourceDate}</strong></div><div><small>VISIBLE NOW</small><strong>{readiness.modelCount} models · {readiness.providers.length} providers</strong></div><div><small>LIVE SPEND</small><strong>$0 · locked</strong></div></div>
    </section>

    <section className="compare-catalog" id="catalog">
      <div className="section-kicker">01 / FILTER PUBLISHED FACTS</div>
      <div className="compare-filters">
        <fieldset><legend>Provider</legend><div className="filter-buttons">{["All", ...providers].map((item) => <button type="button" className={provider === item ? "selected" : ""} key={item} onClick={() => setProvider(item)}>{item}</button>)}</div></fieldset>
        <fieldset><legend>Formats required together</legend><div className="filter-buttons">{formats.map((item) => <button type="button" aria-pressed={requiredFormats.includes(item)} className={requiredFormats.includes(item) ? "selected" : ""} key={item} onClick={() => toggleFormat(item)}>{item}</button>)}</div></fieldset>
        <label>Minimum context<select value={minimumContext} onChange={(event) => setMinimumContext(Number(event.target.value))}><option value={0}>Any</option><option value={200000}>200K+</option><option value={1000000}>1M+</option></select></label>
      </div>

      <div className="compare-count"><strong>{rows.length}</strong> matching models <span>Prices shown per 1M tokens · USD</span></div>
      <div className="compare-table" aria-label="Provider model catalog comparison">
        <div className="compare-row compare-header"><span>Model</span><span>Input</span><span>Cached</span><span>Output</span><span>Context</span><span>Evidence</span></div>
        {rows.map((model) => <article className="compare-row" key={model.id}>
          <div><small>{model.provider}</small><h2>{model.name}</h2><p>{model.lane}</p><div className="format-list">{model.modalities.map((item) => <span key={item}>{item}</span>)}</div></div>
          <strong>{price(model.inputPerMillion)}</strong><strong>{price(model.cachedInputPerMillion)}</strong><strong>{price(model.outputPerMillion)}</strong><strong>{context(model.contextTokens)}</strong>
          <div><b className={model.recommendationReady ? "evidence-baseline" : "evidence-pending"}>{model.recommendationReady ? "HEURISTIC BASELINE" : "EVAL REQUIRED"}</b><p className="coverage-note">{model.pricingNotes}</p></div>
        </article>)}
        {!rows.length && <div className="empty-comparison"><h2>No catalog match</h2><p>No listed model supports every selected format and context requirement. Split the workflow or change the requirement; the page will not silently drop a format.</p></div>}
      </div>
      <p className="catalog-disclosure">Catalog prices are reviewed published facts as of {readiness.sourceDate}. They are not a quality ranking. Cache writes, storage, grounding, search, tools, batch modes, regional premiums, and long-context premiums remain model-specific coverage items. Review the official <a href="https://developers.openai.com/api/docs/pricing">OpenAI pricing</a>, <a href="https://ai.google.dev/gemini-api/docs/pricing">Gemini pricing</a>, and <a href="https://platform.claude.com/docs/en/about-claude/pricing">Claude pricing</a> before a funded run.</p>
    </section>

    <section className="live-section" id="live">
      <div className="section-kicker dark">02 / CONTROLLED LIVE EVALUATION</div>
      <div className="live-grid"><div><h2>One workload.<br />Same test.<br /><em>No surprise spend.</em></h2><p>The live comparison remains unavailable until sign-in, synthetic cases, provider credentials, predicted maximum cost, and explicit approval are in place.</p></div><div className="level-stack">
        <article><span>0</span><div><b>Catalog</b><p>No model calls. Available now.</p></div><strong>$0</strong></article>
        <article><span>1</span><div><b>Preview</b><p>3 models × 3 cases × 1 run</p></div><strong>cap ${liveEvaluationPolicy.levels.preview.maxSpendUsd}</strong></article>
        <article><span>2</span><div><b>Comparison</b><p>Up to 6 models × 10 cases × 3 repeats</p></div><strong>cap ${liveEvaluationPolicy.levels.comparison.maxSpendUsd}</strong></article>
        <button type="button" disabled>Live evaluation locked</button>
      </div></div>
    </section>

    <section className="control-section" id="controls">
      <div className="section-kicker">03 / WHAT HAPPENS BEFORE A MODEL RUNS</div>
      <div className="control-flow">{[
        ["01", "Shape", "A workflow architect proposes stages; you confirm them."],
        ["02", "Freeze", "The workload, cases, scoring, limits, and prompt hash stop changing."],
        ["03", "Run", "Provider adapters translate the same frozen case without changing it."],
        ["04", "Score", "Anonymous outputs are measured before provider and price are revealed."],
        ["05", "Report", "Cost, quality, latency, failures, and evidence limits share one report."],
      ].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      <div className="privacy-callout"><div><small>PRIVACY DEFAULT</small><h2>Your idea is not the database.</h2></div><p>The public catalog makes no provider call. Future live runs default to synthetic cases and retain aggregate usage—not raw ideas, prompts, or outputs. Download or delete remains part of the report contract.</p></div>
    </section>
    <footer><span>AI BUILD CREW · BADLABZ.COM</span><p><b>Current:</b> reviewed catalog comparison. <b>Next:</b> mocked runner rehearsal, then one explicitly capped provider connection.</p><Link href="/">Open estimator →</Link></footer>
  </main>;
}
