import { z } from 'zod';

export const RelayAnalysisSchema = z.object({
  assetId: z.string().min(1),
  issueCategory: z.enum(['mechanical', 'electrical', 'building', 'safety', 'operations', 'other']),
  severity: z.enum(['low', 'medium', 'high', 'critical', 'undetermined']),
  observations: z.array(z.string()).default([]),
  knownFacts: z.array(z.string()).default([]),
  unverifiedItems: z.array(z.string()).default([]),
  missingEvidence: z.array(z.string()).default([]),
  recommendedNextAction: z.string().min(1),
  requiresHumanReview: z.boolean().default(true),
  caution: z.string().default('AI-generated draft. Verify before taking action.'),
});

export type RelayAnalysis = z.infer<typeof RelayAnalysisSchema>;

export type InferenceSource = 'ON_DEVICE' | 'IN_CLOUD' | 'UNKNOWN';

export interface RelayResult {
  analysis: RelayAnalysis;
  inferenceSource: InferenceSource;
  rawText: string;
  completedAt: string;
}
