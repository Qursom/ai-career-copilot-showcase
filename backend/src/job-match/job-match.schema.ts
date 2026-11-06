import { z } from 'zod';
import { zScore0to100, zStringList } from '../common/zod-llm-json';

export const RequirementImportanceSchema = z.enum([
  'required',
  'preferred',
  'responsibility',
  'nice-to-have',
]);

export const RequirementStatusSchema = z.enum([
  'matched',
  'partial',
  'missing',
  'unknown',
]);

/** "Nice to have" / "Required " → "nice-to-have" / "required". */
function normalizeEnumText(v: unknown): unknown {
  return typeof v === 'string'
    ? v.trim().toLowerCase().replace(/[\s_]+/g, '-')
    : v;
}

function trimmedString(max: number, fallback?: string) {
  return z.preprocess((v) => {
    const s = typeof v === 'string' ? v.trim().slice(0, max) : v;
    return s === '' && fallback !== undefined ? fallback : s;
  }, z.string().min(1).max(max));
}

export const RequirementMatchSchema = z.object({
  requirement: trimmedString(200),
  importance: z.preprocess(normalizeEnumText, RequirementImportanceSchema),
  status: z.preprocess(normalizeEnumText, RequirementStatusSchema),
  evidence: trimmedString(400, 'none'),
});

export const MatchResultSchema = z.object({
  score: zScore0to100,
  strengths: zStringList(1, 10),
  gaps: zStringList(0, 10),
  marketSignals: zStringList(0, 10).default([]),
  priorityGaps: zStringList(0, 10).default([]),
  citations: zStringList(0, 10).default([]),
  suggestions: zStringList(0, 10),
  requirements: z
    .preprocess(
      (v) => (Array.isArray(v) ? v.slice(0, 30) : v),
      z.array(RequirementMatchSchema),
    )
    .default([]),
});

export type RequirementMatch = z.infer<typeof RequirementMatchSchema>;
export type MatchResult = z.infer<typeof MatchResultSchema>;
