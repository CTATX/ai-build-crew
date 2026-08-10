import { runOpenAIPreview } from "@/lib/openai-preview-runner.mjs";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import liveEvaluationPolicy from "@/config/live-evaluation-policy.v1.json";

function previewOwnerIds() {
  return new Set(
    (process.env.PHASE2_PREVIEW_ALLOWED_ACCOUNT_USER_IDS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

export async function GET() {
  return Response.json({
    provider: "OpenAI",
    status: liveEvaluationPolicy.executionEnabled ? "OWNER_PREVIEW_READY" : "ADAPTER_READY_EXECUTION_LOCKED",
    fixtureId: "INVENTORY-ASSISTANT-PREVIEW-001",
    modelId: "gpt-5.6-terra",
    maximumSpendUsd: 1,
    syntheticOnly: true,
    contentRetention: "HASH_ONLY",
    authenticationRequired: true,
    explicitApprovalRequired: true,
    ownerRestricted: true,
  }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  if (!liveEvaluationPolicy.executionEnabled) return Response.json({ status: "LOCKED", message: "The reviewed evaluation policy does not permit provider execution." }, { status: 503 });
  if (process.env.PHASE2_LIVE_PREVIEW_ENABLED !== "true") return Response.json({ status: "LOCKED", message: "Live preview is not enabled for this deployment." }, { status: 503 });
  if (!process.env.OPENAI_API_KEY) return Response.json({ status: "LOCKED", message: "The protected provider connection is not configured." }, { status: 503 });
  const approvalToken = process.env.PHASE2_PREVIEW_APPROVAL_TOKEN;
  const tokenApproved = Boolean(approvalToken && request.headers.get("x-ai-build-crew-approval") === approvalToken);
  const authenticatedUser = await getChatGPTUser();
  if (!authenticatedUser && !tokenApproved) return Response.json({ status: "AUTHENTICATION_REQUIRED", message: "Sign in before approving a paid evaluation. The public catalog and estimator remain available without sign-in.", signInPath: "/signin-with-chatgpt?return_to=%2Fcompare%23live" }, { status: 401, headers: { "cache-control": "no-store" } });
  const ownerIds = previewOwnerIds();
  if (!tokenApproved && (!authenticatedUser || !ownerIds.has(authenticatedUser.userId))) return Response.json({ status: "OWNER_APPROVAL_REQUIRED", message: "The paid preview is currently limited to the site owner. The public catalog and estimator remain available without a provider call." }, { status: 403, headers: { "cache-control": "no-store" } });
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
