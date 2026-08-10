import { runMockProvider } from "./mock-runner.mjs";
export const runOpenAIMock = (envelope) => runMockProvider(envelope, "OpenAI");
