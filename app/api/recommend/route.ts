export async function POST(request: Request) {
  const payload = await request.json();
  const fallback = `${payload.model} is the least expensive model in this catalog that clears the ${String(payload.risk).toLowerCase()}-risk quality bar for ${String(payload.task).toLowerCase()}. The expected token run rate is about $${Number(payload.monthly).toFixed(2)} per month. Validate it with representative cases before production.`;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return Response.json({ brief: fallback, source: "rules" });

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        max_output_tokens: 180,
        input: `Write a concise, plain-English model selection brief (3 sentences, no markdown). Explain the recommendation, one cost caveat, and one evaluation next step. Facts: ${JSON.stringify(payload)}`,
      }),
    });
    if (!response.ok) return Response.json({ brief: fallback, source: "rules" });
    const data = await response.json() as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
    const text = data.output_text ?? data.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text;
    return Response.json({ brief: text || fallback, source: text ? "openai" : "rules" });
  } catch {
    return Response.json({ brief: fallback, source: "rules" });
  }
}
