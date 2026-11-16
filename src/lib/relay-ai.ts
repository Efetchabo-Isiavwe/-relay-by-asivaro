import { RelayAnalysisSchema, type InferenceSource, type RelayResult } from './contracts';
import { relayModel } from './firebase';

export interface AnalyzeInput {
  assetId: string;
  siteName: string;
  observation: string;
}

export interface ModelCallbacks {
  onStatus?: (message: string) => void;
  onProgress?: (progress: number) => void;
}

function parseJsonResponse(text: string): unknown {
  const withoutFence = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');

  const firstBrace = withoutFence.indexOf('{');
  const lastBrace = withoutFence.lastIndexOf('}');
  if (firstBrace < 0 || lastBrace <= firstBrace) {
    throw new Error('The AI response did not contain a JSON object. Please retry.');
  }
  return JSON.parse(withoutFence.slice(firstBrace, lastBrace + 1)) as unknown;
}

export async function prepareLocalModel(callbacks: ModelCallbacks = {}): Promise<void> {
  if (!relayModel) throw new Error('Connect Firebase and configure App Check before preparing AI.');
  callbacks.onStatus?.('Preparing the on-device model. The first download can take several minutes.');

  // Firebase requires this to be called from a user interaction before inference.
  // A failed local initialisation must not prevent PREFER_ON_DEVICE cloud fallback.
  try {
    await relayModel.initializeDeviceModel((value: number) => {
      callbacks.onProgress?.(Math.max(0, Math.min(100, Math.round(value * 100))));
    });
    callbacks.onStatus?.('Local model initialisation completed.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Local model is unavailable on this browser/device.';
    callbacks.onStatus?.(`Local model unavailable; cloud fallback remains configured. ${message}`);
  }
}

export async function analyzeObservation(
  input: AnalyzeInput,
  callbacks: ModelCallbacks = {},
): Promise<RelayResult> {
  if (!relayModel) throw new Error('Firebase is not connected. Complete the Firebase setup in README.md.');
  if (!input.observation.trim()) throw new Error('Enter an observation before running the analysis.');

  callbacks.onStatus?.('Analysing observation with Firebase AI Logic hybrid inference…');

  const prompt = `
You are analysing an operational field observation for RELAY, an operational continuity product.
Your task is a single structured inference task, not a conversation.

Asset ID: ${input.assetId}
Site: ${input.siteName}
Field observation:
${input.observation}

Return ONLY a JSON object with exactly these keys:
{
  "assetId": "string",
  "issueCategory": "mechanical | electrical | building | safety | operations | other",
  "severity": "low | medium | high | critical | undetermined",
  "observations": ["brief observation"],
  "knownFacts": ["facts explicitly present in the supplied report"],
  "unverifiedItems": ["important claims or interpretations not yet verified"],
  "missingEvidence": ["specific evidence needed to verify the issue"],
  "recommendedNextAction": "one practical next step requiring human review",
  "requiresHumanReview": true,
  "caution": "brief safety and verification note"
}

Rules:
- Do not invent measurements, dates, events, asset conditions or history.
- Distinguish observations from diagnosis. Do not diagnose equipment.
- If evidence is insufficient, state that clearly.
- Never instruct anyone to perform hazardous work.
- Always require human review before operational action.
- Keep each list concise and specific.
`;

  const result = await relayModel.generateContent(prompt);
  const rawText = result.response.text();
  const parsed = RelayAnalysisSchema.safeParse(parseJsonResponse(rawText));
  if (!parsed.success) {
    throw new Error(`AI output failed validation: ${parsed.error.issues.map((issue) => issue.message).join('; ')}`);
  }

  const rawSource = result.response.inferenceSource;
  const inferenceSource: InferenceSource = rawSource === 'ON_DEVICE' || rawSource === 'IN_CLOUD'
    ? rawSource
    : 'UNKNOWN';

  callbacks.onStatus?.(`Analysis complete. Actual inference source: ${inferenceSource}.`);
  return {
    analysis: parsed.data,
    inferenceSource,
    rawText,
    completedAt: new Date().toISOString(),
  };
}
