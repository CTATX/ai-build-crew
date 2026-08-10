export function runMockProvider(envelope, expectedProvider) {
  if (envelope.provider !== expectedProvider) throw new Error("RUNNER-001: provider envelope mismatch");
  if (envelope.networkAllowed !== false || envelope.status !== "MOCK_ONLY") throw new Error("RUNNER-002: mocked runner cannot execute network calls");
  return Object.freeze({
    provider: expectedProvider,
    modelId: envelope.modelId,
    requestHash: envelope.requestHash,
    workloadHash: envelope.workloadHash,
    caseIds: Object.freeze([...envelope.caseIds]),
    status: "MOCKED_NO_NETWORK",
    usage: null,
    actualChargeUsd: null,
    outputs: null,
  });
}
