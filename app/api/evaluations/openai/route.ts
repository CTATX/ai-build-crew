import { runOpenAIPreview } from "@/lib/openai-preview-runner.mjs";

export async function GET() {
  return Response.json({
    provider: "OpenAI",
    status: "ADAPTER_READY_EXECUTION_LOCKED",
    fixtureId: "INVENTORY-ASSISTANT-PREVIEW-001",
    modelId: "gpt-5.6-terra",
    maximumSpendUsd: 1,
    syntheticOnly: true,
    contentRetention: "HASH_ONLY",
    authenticationRequired: true,
    explicitApprovalRequired: true,
  }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  if (process.env.PHASE2_LIVE_PREVIEW_ENABLED !== "true") return Response.json({ status: "LOCKED", message: "Live preview is not enabled for this deployment." }, { status: 503 });
  if (!process.env.OPENAI_API_KEY) return Response.json({ status: "LOCKED", message: "The protected provider connection is not configured." }, { status: 503 });
  const approvalToken = process.env.PHASE2_PREVIEW_APPROVAL_TOKEN;
  if (!approvalToken || request.headers.get("x-ai-build-crew-approval") !== approvalToken) return Response.json({ status: "AUTHENTICATION_REQUIRED", message: "An authenticated, explicitly approved preview session is required." }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || body.confirmation !== "RUN_SYNTHETIC_PREVIEW") return Response.json({ status: "CONFIRMATION_REQUIRED", message: "Confirm the synthetic preview before any provider call." }, { status: 400 });
  if (body.fixtureId !== "INVENTORY-ASSISTANT-PREVIEW-001") return Response.json({ status: "REJECTED", message: "Only the locked synthetic fixture is permitted." }, { status: 400 });
  const ceilingUsd = Number(body.ceilingUsd);
  try {
    const result = await runOpenAIPreview({ apiKey: process.env.OPENAI_API_KEY, ceilingUsd });
    return Response.json(result, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return Response.json({ status: "STOPPED", message: error instanceof Error ? error.message : "The preview stopped safely." }, { status: 502, headers: { "cache-control": "no-store" } });
  }
}
