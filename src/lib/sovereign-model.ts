/**
 * Sovereign Model Abstraction (MEDINA)
 *
 * Everything is a model. Every module, every function, every edge point.
 * A model is a formula with multiple uses — it doesn't just do one thing.
 * The architecture speaks through its models.
 *
 * Every sovereign model has:
 * - An identity (who it is)
 * - Capabilities (what it can do — always 5+)
 * - A resonance function (how it responds to prompts)
 * - An expansion function (what new possibilities it opens)
 */

export interface SovereignModel {
  id: string;
  name: string;
  kind: 'intelligence' | 'substrate' | 'compiler' | 'pattern' | 'law' | 'gate';
  description: string;
  capabilities: string[];
  keywords: string[];
  resonance: (input: string) => number;
  expand: () => string[];
  invoke: (input: string) => string;
  color: string;
}

const models: Map<string, SovereignModel> = new Map();

export function registerModel(model: SovereignModel): void {
  models.set(model.id, model);
}

export function getModel(id: string): SovereignModel | undefined {
  return models.get(id);
}

export function allModels(): SovereignModel[] {
  return Array.from(models.values());
}

export function modelsByKind(kind: SovereignModel['kind']): SovereignModel[] {
  return Array.from(models.values()).filter((m) => m.kind === kind);
}

export function scoreAllModels(input: string): Array<{ model: SovereignModel; score: number }> {
  const lower = input.toLowerCase();
  const results = Array.from(models.values()).map((model) => {
    const resonance = model.resonance(lower);
    const keywordHits = model.keywords.filter((kw) => lower.includes(kw)).length;
    const keywordScore = keywordHits / Math.max(model.keywords.length, 1);
    const score = (resonance * 0.6) + (keywordScore * 0.4);
    return { model, score };
  });
  results.sort((a, b) => b.score - a.score);
  return results;
}

export function expandFromEdge(modelId: string): string[] {
  const model = models.get(modelId);
  if (!model) return [];
  return model.expand();
}

export function fieldOfPossibilities(input: string): Array<{ source: string; possibilities: string[] }> {
  const scored = scoreAllModels(input);
  return scored
    .filter((s) => s.score > 0)
    .slice(0, 5)
    .map((s) => ({
      source: s.model.id,
      possibilities: s.model.expand(),
    }));
}
