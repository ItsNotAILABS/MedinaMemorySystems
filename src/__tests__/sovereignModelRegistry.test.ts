let sovereignModel: typeof import('@/lib/sovereign-model');
let bootSovereignRegistry: typeof import('@/lib/sovereign-registry').bootSovereignRegistry;
import type { SovereignModel } from '@/lib/sovereign-model';

const REGISTERED_FIELD_MODELS_FOR_BOUNDARY_TEST = 6;
const MAX_FIELD_POSSIBILITIES = 5;

describe('sovereign-model', () => {
  beforeEach(() => {
    jest.resetModules();
    sovereignModel = require('@/lib/sovereign-model');
  });

  const makeModel = (id: string, overrides: Partial<SovereignModel> = {}): SovereignModel => ({
    id,
    name: id,
    kind: 'intelligence',
    description: `desc-${id}`,
    capabilities: ['cap-a', 'cap-b', 'cap-c', 'cap-d', 'cap-e'],
    keywords: [id],
    resonance: () => 0.2,
    expand: () => [`${id}-expansion`],
    invoke: (input: string) => `${id}:${input}`,
    color: '#111111',
    ...overrides,
  });

  it('registers and retrieves models with kind filtering', () => {
    sovereignModel.registerModel(makeModel('intel-1', { kind: 'intelligence' }));
    sovereignModel.registerModel(makeModel('law-1', { kind: 'law' }));

    expect(sovereignModel.getModel('intel-1')?.id).toBe('intel-1');
    expect(sovereignModel.getModel('missing')).toBeUndefined();

    const all = sovereignModel.allModels();
    expect(all.map((m) => m.id)).toEqual(expect.arrayContaining(['intel-1', 'law-1']));

    const laws = sovereignModel.modelsByKind('law');
    expect(laws).toHaveLength(1);
    expect(laws[0].id).toBe('law-1');
  });

  it('scores and sorts models by resonance + keyword matches', () => {
    sovereignModel.registerModel(
      makeModel('alpha-strong', {
        keywords: ['alpha'],
        resonance: () => 0.2,
      }),
    );

    sovereignModel.registerModel(
      makeModel('alpha-weak', {
        keywords: ['alpha', 'beta'],
        resonance: () => 0.1,
      }),
    );

    const scored = sovereignModel.scoreAllModels('ALPHA signal');

    expect(scored[0].model.id).toBe('alpha-strong');
    expect(scored[0].score).toBeGreaterThan(scored[1].score);
  });

  it('expands from edge and builds bounded field of possibilities', () => {
    for (let i = 0; i < REGISTERED_FIELD_MODELS_FOR_BOUNDARY_TEST; i++) {
      sovereignModel.registerModel(
        makeModel(`m${i}`, {
          keywords: ['shared'],
          resonance: () => 0.5,
          expand: () => [`possibility-${i}`],
        }),
      );
    }

    sovereignModel.registerModel(
      makeModel('zero-score', {
        keywords: ['never-match'],
        resonance: () => 0,
        expand: () => ['should-not-appear'],
      }),
    );

    expect(sovereignModel.expandFromEdge('m0')).toEqual(['possibility-0']);
    expect(sovereignModel.expandFromEdge('does-not-exist')).toEqual([]);

    // fieldOfPossibilities explicitly caps output at top 5 scored models.
    const field = sovereignModel.fieldOfPossibilities('shared context');
    expect(field).toHaveLength(MAX_FIELD_POSSIBILITIES);
    expect(field.every((entry) => entry.possibilities.length > 0)).toBe(true);
    expect(field.some((entry) => entry.source === 'zero-score')).toBe(false);
  });
});

describe('sovereign-registry', () => {
  beforeEach(() => {
    jest.resetModules();
    sovereignModel = require('@/lib/sovereign-model');
    ({ bootSovereignRegistry } = require('@/lib/sovereign-registry'));
  });

  it('boots and registers core, field, and worker models', () => {
    const before = sovereignModel.allModels().length;

    bootSovereignRegistry();

    const models = sovereignModel.allModels();
    const ids = models.map((m) => m.id);

    expect(models.length).toBeGreaterThan(before);
    expect(ids).toContain('strategist');
    expect(ids).toContain('sovereign-id-model');
    expect(ids.some((id) => id.startsWith('field:'))).toBe(true);
    expect(ids.some((id) => id.startsWith('worker:'))).toBe(true);
  });

  it('is idempotent across repeated boot calls', () => {
    bootSovereignRegistry();
    const firstCount = sovereignModel.allModels().length;

    bootSovereignRegistry();
    const secondCount = sovereignModel.allModels().length;

    expect(secondCount).toBe(firstCount);
  });

  it('registers executable model behavior for representative entries', () => {
    bootSovereignRegistry();

    const strategist = sovereignModel.getModel('strategist');
    expect(strategist).toBeDefined();
    expect(strategist?.resonance('strategy plan vision')).toBeGreaterThan(0.5);
    expect(strategist?.invoke('design doctrine')).toContain('Strategic assessment');

    const anyField = sovereignModel.allModels().find((m) => m.id.startsWith('field:'));
    expect(anyField).toBeDefined();

    const fieldModel = anyField!;
    expect(fieldModel.resonance('pattern field intelligence')).toBeGreaterThanOrEqual(0);
    expect(fieldModel.expand().length).toBeGreaterThan(0);
    expect(fieldModel.invoke('signal')).toContain('processing');

    const possibilities = sovereignModel.fieldOfPossibilities('memory governance protocol');
    expect(possibilities.length).toBeGreaterThan(0);
    expect(possibilities.length).toBeLessThanOrEqual(5);
  });
});
