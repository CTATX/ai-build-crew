"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buildCatalogComparison, catalogReadiness, liveEvaluationPolicy } from "@/lib/provider-platform.mjs";

const providers = ["OpenAI", "Google", "Anthropic"];
const formats = ["text", "image", "audio", "video"];

type PreviewResult = {
  requestHash: string;
  workloadHash: string;
  modelId: string;
  fixtureId: string;
  predictedMaximumUsd: number;
  calculatedSpendUsd: number;
  ceilingUsd: number;
  durationMs: number;
  casesPassed: number;
  casesRun: number;
  contentRetention: string;
  results: Array<{
    provider: string;
    modelId: string;
    requestHash: string;
    workloadHash: string;
    caseId: string;
    status: string;
    latencyMs: number;
    retryCount: number;
    evaluation: { rubricVersion: string; passed: boolean; checksPassed: number; checksRequired: number; missingChecks: string[] };
    usage: { inputTokens: number; cachedInputTokens: number; outputTokens: number; reasoningTokens: number | null; toolCalls: number };
    charge: { currency: string; providerReportedUsd: number | null; calculatedUsd: number; reconciliationStatus: string };
    retention: { rawPromptStored: false; rawOutputStored: false; outputHash: string };
  }>;
};

function price(value: number) { return `$${value.toFixed(value < 1 ? 2 : 2)}`; }
function context(value: number) { return value >= 1_000_000 ? `${(value / 1_000_000).toFixed(value % 1_000_000 ? 2 : 0)}M` : `${Math.round(value / 1_000)}K`; }

export default function ComparePage() {
  const readiness = catalogReadiness();
  const [provider, setProvider] = useState("All");
  const [requiredFormats, setRequiredFormats] = useState<string[]>([]);
  const [minimumContext, setMinimumContext] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [spendApproved, setSpendApproved] = useState(false);
  const [previewState, setPreviewState] = useState<"READY" | "RUNNING" | "COMPLETE" | "STOPPED">("READY");
  const [previewResult, setPreviewResult] = useState<PreviewResult | null>(null);
  const [previewMessage, setPreviewMessage] = useState("");
  const [signInPath, setSignInPath] = useState("");
  const rows = useMemo(() => buildCatalogComparison({ providers: provider === "All" ? [] : [provider], modalities: requiredFormats, minimumContext }), [provider, requiredFormats, minimumContext]);

  function toggleFormat(format: string) {
    setRequiredFormats((current) => current.includes(format) ? current.filter((item) => item !== format) : [...current, format]);
  }

  async function runPreview() {
    if (!spendApproved || previewState === "RUNNING") return;
    setPreviewState("RUNNING");
    setPreviewMessage("");
    setSignInPath("");
    try {
      const response = await fetch("/api/evaluations/openai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ confirmation: "RUN_SYNTHETIC_PREVIEW", fixtureId: "INVENTORY-ASSISTANT-PREVIEW-001", ceilingUsd: 1 }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setPreviewState("STOPPED");
        setPreviewMessage(payload.message ?? "The evaluation stopped safely before completion.");
        setSignInPath(payload.signInPath ?? "");
        return;
      }
      setPreviewResult(payload);
      setPreviewState("COMPLETE");
    } catch {
      setPreviewState("STOPPED");
      setPreviewMessage("The evaluation could not reach the protected runner. No automatic retry was attempted.");
    }
  }

  function downloadPreviewReport() {
    if (!previewResult) return;
    const payload = JSON.stringify({ generatedAt: new Date().toISOString(), reportType: "AI_BUILD_CREW_CONTROLLED_PROVIDER_PREVIEW", ...previewResult }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ai-build-crew-${previewResult.requestHash}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
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
      <div className="compare-status"><div><small>CATALOG SNAPSHOT</small><strong>{readiness.sourceDate}</strong></div><div><small>VISIBLE NOW</small><strong>{readiness.modelCount} models · {readiness.providers.length} providers</strong></div><div><small>LIVE EVALUATION</small><strong>{previewResult ? `$${previewResult.calculatedSpendUsd.toFixed(6)} · complete` : "$0 · approval required"}</strong></div></div>
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
      <div className="live-grid"><div><h2>One workload.<br />Same test.<br /><em>No surprise spend.</em></h2><p>The first provider lane uses three synthetic inventory cases. Review the limit, explicitly approve the run, and receive a point-in-time evidence report. The API key stays on the protected server. During this release-candidate test, only the site owner can start a paid run.</p></div><div className="level-stack">
        <div className="provider-lane-status"><small>OWNER TEST LANE</small><b>OpenAI preview ready</b><span>1 model · 3 synthetic cases · no retries · $1 hard ceiling · hash-only retention</span></div>
        <article><span>0</span><div><b>Catalog</b><p>No model calls. Available now.</p></div><strong>$0</strong></article>
        <article><span>1</span><div><b>First preview</b><p>GPT-5.6 Terra × 3 cases × 1 run</p></div><strong>cap ${liveEvaluationPolicy.levels.preview.maxSpendUsd}</strong></article>
        <article><span>2</span><div><b>Comparison</b><p>Up to 6 models × 10 cases × 3 repeats</p></div><strong>cap ${liveEvaluationPolicy.levels.comparison.maxSpendUsd}</strong></article>
        <button type="button" className="preview-open" onClick={() => setPreviewOpen((current) => !current)}>{previewOpen ? "Close preview controls" : "Review controlled preview"}</button>
        {previewOpen && <div className="preview-panel">
          <div className="preview-contract"><span>MODEL<strong>GPT-5.6 Terra</strong></span><span>FIXTURE<strong>3 synthetic inventory cases</strong></span><span>MAXIMUM<strong>$1.00 USD</strong></span><span>RETENTION<strong>Hashes + aggregate usage only</strong></span></div>
          <label className="preview-approval"><input type="checkbox" checked={spendApproved} onChange={(event) => setSpendApproved(event.target.checked)} /> I approve this synthetic run up to the $1 hard ceiling.</label>
          <button type="button" className="preview-run" disabled={!spendApproved || previewState === "RUNNING"} onClick={runPreview}>{previewState === "RUNNING" ? "Running controlled evaluation…" : "Approve and run preview"}</button>
          {previewState === "STOPPED" && <div className="preview-stop" role="alert"><b>Run stopped safely</b><p>{previewMessage}</p>{signInPath && <a href={signInPath}>Sign in to approve the paid run →</a>}</div>}
          {previewResult && <div className="preview-report" aria-live="polite">
            <div className="report-head"><div><small>POINT-IN-TIME REPORT</small><h3>{previewResult.casesPassed}/{previewResult.casesRun} cases passed</h3></div><strong>${previewResult.calculatedSpendUsd.toFixed(6)}</strong></div>
            <div className="report-metrics"><span>Model<b>{previewResult.modelId}</b></span><span>Duration<b>{(previewResult.durationMs / 1000).toFixed(2)}s</b></span><span>Maximum approved<b>${previewResult.ceilingUsd.toFixed(2)}</b></span><span>Raw content retained<b>No</b></span></div>
            <div className="report-cases">{previewResult.results.map((item) => <article key={item.caseId}>
              <div><b>{item.caseId.replaceAll("-", " ")}</b><small>{item.evaluation.passed ? "PASS" : `CHECK REQUIRED · missing ${item.evaluation.missingChecks.join(", ")}`}</small></div>
              <span>{item.usage.inputTokens} in · {item.usage.outputTokens} out</span><span>{item.latencyMs} ms</span><span>${item.charge.calculatedUsd.toFixed(6)}</span>
              <details className="technical-run-evidence"><summary>Technical evidence</summary><dl>
                <div><dt>Provider · model</dt><dd>{item.provider} · {item.modelId}</dd></div>
                <div><dt>Status · case</dt><dd>{item.status} · {item.caseId}</dd></div>
                <div><dt>Request hash</dt><dd>{item.requestHash}</dd></div>
                <div><dt>Workload hash</dt><dd>{item.workloadHash}</dd></div>
                <div><dt>Tokens</dt><dd>{item.usage.inputTokens} input · {item.usage.cachedInputTokens} cached · {item.usage.outputTokens} output · {item.usage.reasoningTokens ?? "not reported"} reasoning</dd></div>
                <div><dt>Calls · attempts</dt><dd>{item.usage.toolCalls} tool calls · {item.retryCount} retries</dd></div>
                <div><dt>Latency</dt><dd>{item.latencyMs} ms</dd></div>
                <div><dt>Charge</dt><dd>{item.charge.providerReportedUsd == null ? "Provider charge unavailable" : `$${item.charge.providerReportedUsd.toFixed(6)} provider`} · ${item.charge.calculatedUsd.toFixed(6)} calculated · {item.charge.reconciliationStatus}</dd></div>
                <div><dt>Raw content retained</dt><dd>Prompt {item.retention.rawPromptStored ? "yes" : "no"} · output {item.retention.rawOutputStored ? "yes" : "no"}</dd></div>
                <div><dt>Output hash</dt><dd>{item.retention.outputHash}</dd></div>
              </dl></details>
            </article>)}</div>
            <p className="report-evidence">Request {previewResult.requestHash} · Workload {previewResult.workloadHash} · Output retained as hashes only. Passing means the required inventory facts appeared; it is not yet a blinded quality evaluation.</p>
            <button type="button" className="report-download" onClick={downloadPreviewReport}>Download point-in-time report</button>
          </div>}
        </div>}
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
    <footer><span>AI BUILD CREW · BADLABZ.COM</span><p><b>Current:</b> reviewed catalog comparison and an approval-gated OpenAI synthetic preview. <b>Next:</b> add equivalent provider runners and blinded shared-workload evaluation.</p><Link href="/">Open estimator →</Link></footer>
  </main>;
}
