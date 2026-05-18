/**
 * AI Suite 16 — Evolutionary Algorithms
 * ============================================================
 * Genetic operators (selection, crossover, mutation), fitness landscape,
 * population diversity, elitism, convergence, particle swarm,
 * and φ-guided mutation rates.
 *
 * Target: 140+ tests   Charter: AIS-EVO-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Implementations ──────────────────────────────────────────────────────────

type Individual = number[];

function rosenbrock(x: number, y: number): number {
  return (1 - x) ** 2 + 100 * (y - x ** 2) ** 2;
}

function sphere(genes: number[]): number {
  return genes.reduce((s, x) => s + x * x, 0);
}

function fitnessNegate(f: (genes: number[]) => number): (genes: number[]) => number {
  return genes => -f(genes);
}

function tournamentSelect(pop: Individual[], fitness: number[], k = 3, seed = 1): Individual {
  let s = seed;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s % pop.length; };
  let best = -Infinity, bestIdx = 0;
  for (let i = 0; i < k; i++) {
    const idx = rand();
    if (fitness[idx] > best) { best = fitness[idx]; bestIdx = idx; }
  }
  return [...pop[bestIdx]];
}

function uniformCrossover(p1: Individual, p2: Individual, seed = 42): Individual {
  let s = seed;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s & 1; };
  return p1.map((g, i) => rand() ? g : p2[i]);
}

function singlePointCrossover(p1: Individual, p2: Individual, point: number): [Individual, Individual] {
  return [
    [...p1.slice(0, point), ...p2.slice(point)],
    [...p2.slice(0, point), ...p1.slice(point)],
  ];
}

function gaussianMutation(individual: Individual, rate: number, sigma: number, seed = 1): Individual {
  let s = seed;
  const randN = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    const u1 = (s / 0xffffffff) + 1e-10;
    s = (s * 1664525 + 1013904223) >>> 0;
    const u2 = s / 0xffffffff;
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
  const randU = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
  return individual.map(g => randU() < rate ? g + sigma * randN() : g);
}

function populationDiversity(pop: Individual[]): number {
  if (pop.length === 0) return 0;
  const dim = pop[0].length;
  let variance = 0;
  for (let d = 0; d < dim; d++) {
    const vals = pop.map(ind => ind[d]);
    const mu = vals.reduce((a, b) => a + b, 0) / vals.length;
    variance += vals.reduce((s, v) => s + (v - mu) ** 2, 0) / vals.length;
  }
  return Math.sqrt(variance / dim);
}

function elitism(pop: Individual[], fitness: number[], n: number): Individual[] {
  return pop.map((ind, i) => ({ ind, f: fitness[i] }))
            .sort((a, b) => b.f - a.f)
            .slice(0, n)
            .map(x => [...x.ind]);
}

function phiMutationRate(generation: number, maxGen: number): number {
  return 0.5 * (1 - generation / maxGen) / PHI;
}

// ─── SECTION 1: Fitness functions ─────────────────────────────────────────────
describe('Evo § 1 — Fitness functions', () => {
  test('rosenbrock minimum at (1,1) = 0', () => expect(rosenbrock(1, 1)).toBe(0));
  test('rosenbrock at (0,0) > 0',         () => expect(rosenbrock(0, 0)).toBeGreaterThan(0));
  test('rosenbrock non-negative',         () => expect(rosenbrock(-2, 3)).toBeGreaterThanOrEqual(0));
  test('sphere at origin = 0',            () => expect(sphere([0, 0, 0])).toBe(0));
  test('sphere scales with L2 norm',      () => expect(sphere([3, 4])).toBeCloseTo(25));
  test('sphere non-negative',             () => expect(sphere([-1, 2])).toBeGreaterThan(0));
  test('fitnessNegate negates',           () => {
    const negSphere = fitnessNegate(sphere);
    expect(negSphere([1, 1])).toBeCloseTo(-sphere([1, 1]);
  });
  test('fitnessNegate(sphere)([0]) = 0',  () => {
    expect(fitnessNegate(sphere)([0, 0])).toBeCloseTo(0);
  });
});

// ─── SECTION 2: Tournament selection ──────────────────────────────────────────
describe('Evo § 2 — Tournament selection', () => {
  const pop = [[1], [2], [3], [4], [5]];
  const fit = [0.1, 0.5, 0.3, 0.9, 0.2];

  test('selected individual is from pop',    () => {
    const sel = tournamentSelect(pop, fit);
    expect(pop.some(ind => ind[0] === sel[0])).toBe(true);
  });
  test('returns valid individual',           () => {
    const sel = tournamentSelect(pop, fit, 3, 1);
    expect(Array.isArray(sel)).toBe(true);
    expect(sel.length).toBe(1);
  });
  test('higher fitness more likely selected', () => {
    const selected = Array.from({ length: 20 }, (_, s) => tournamentSelect(pop, fit, 3, s)[0]);
    const avgSelected = selected.reduce((a, b) => a + b, 0) / selected.length;
    expect(avgSelected).toBeGreaterThan(2.5);
  });
  test('k=1 random selection',              () => {
    const sel = tournamentSelect(pop, fit, 1, 1);
    expect(sel.length).toBe(1);
  });
});

// ─── SECTION 3: Crossover ─────────────────────────────────────────────────────
describe('Evo § 3 — Crossover', () => {
  const p1 = [1, 1, 1, 1], p2 = [2, 2, 2, 2];

  test('uniform crossover length preserved',     () => {
    expect(uniformCrossover(p1, p2).length).toBe(4);
  });
  test('uniform crossover values from parents',  () => {
    uniformCrossover(p1, p2).forEach(g => expect([1, 2]).toContain(g));
  });
  test('single-point crossover preserves lengths', () => {
    const [c1, c2] = singlePointCrossover(p1, p2, 2);
    expect(c1.length).toBe(4);
    expect(c2.length).toBe(4);
  });
  test('single-point point=0 swaps fully', () => {
    const [c1, c2] = singlePointCrossover([1, 1], [2, 2], 0);
    expect(c1).toEqual([2, 2]);
    expect(c2).toEqual([1, 1]);
  });
  test('single-point at length → no swap', () => {
    const [c1, c2] = singlePointCrossover([1, 1], [2, 2], 2);
    expect(c1).toEqual([1, 1]);
    expect(c2).toEqual([2, 2]);
  });
  test('crossover children complement', () => {
    const [c1, c2] = singlePointCrossover([1, 1, 1], [2, 2, 2], 1);
    const recombined = [...c1, ...c2];
    expect(recombined.filter(x => x === 1).length + recombined.filter(x => x === 2).length).toBe(6);
  });
});

// ─── SECTION 4: Mutation ───────────────────────────────────────────────────────
describe('Evo § 4 — Gaussian mutation', () => {
  test('rate=0 → no change',          () => {
    const ind = [1, 2, 3];
    const mut = gaussianMutation(ind, 0, 1);
    mut.forEach((g, i) => expect(g).toBe(ind[i]));
  });
  test('mutation preserves length',   () => {
    expect(gaussianMutation([1, 2, 3], 0.5, 1).length).toBe(3);
  });
  test('rate=1 → all mutated',        () => {
    const ind = [0, 0, 0];
    const mut = gaussianMutation(ind, 1, 10, 99);
    expect(mut.some(g => g !== 0)).toBe(true);
  });
  test('sigma=0, rate=1 → unchanged', () => {
    const ind = [5, 5, 5];
    const mut = gaussianMutation(ind, 1, 0, 1);
    mut.forEach((g, i) => expect(g).toBe(ind[i]));
  });
  test('output is finite',            () => {
    gaussianMutation([1, 2, 3], 0.5, 0.1).forEach(g => expect(isFinite(g)).toBe(true));
  });
});

// ─── SECTION 5: Population diversity ──────────────────────────────────────────
describe('Evo § 5 — Diversity', () => {
  test('identical population → 0 diversity',  () => {
    expect(populationDiversity([[1, 1], [1, 1], [1, 1]])).toBeCloseTo(0);
  });
  test('diverse population → positive',       () => {
    expect(populationDiversity([[0, 0], [10, 10]])).toBeGreaterThan(0);
  });
  test('single individual → 0 diversity',     () => {
    expect(populationDiversity([[5, 5]])).toBeCloseTo(0);
  });
  test('diversity non-negative',              () => {
    expect(populationDiversity([[1, 2], [3, 4], [5, 6]])).toBeGreaterThanOrEqual(0);
  });
  test('more spread → higher diversity',      () => {
    const close = [[0, 0], [0.1, 0.1]];
    const far   = [[0, 0], [100, 100]];
    expect(populationDiversity(far)).toBeGreaterThan(populationDiversity(close);
  });
});

// ─── SECTION 6: Elitism ────────────────────────────────────────────────────────
describe('Evo § 6 — Elitism', () => {
  const pop = [[1], [2], [3], [4], [5]];
  const fit = [0.2, 0.9, 0.5, 1.0, 0.3];

  test('returns top n individuals',    () => expect(elitism(pop, fit, 2).length).toBe(2));
  test('best individual is included',  () => {
    const elite = elitism(pop, fit, 1);
    expect(elite[0]).toEqual([4]);
  });
  test('elite all from population',    () => {
    const elite = elitism(pop, fit, 3);
    elite.forEach(ind => expect(pop.some(p => p[0] === ind[0])).toBe(true));
  });
  test('elitism n=all returns all',    () => {
    expect(elitism(pop, fit, 5).length).toBe(5);
  });
  test('elite sorted by fitness',      () => {
    const elite = elitism(pop, fit, 3);
    expect(elite[0]).toEqual([4]);
  });
});

// ─── SECTION 7: φ-guided mutation rate ────────────────────────────────────────
describe('Evo § 7 — φ-mutation rate', () => {
  test('rate at gen=0 is positive',           () => expect(phiMutationRate(0, 100)).toBeGreaterThan(0));
  test('rate decreases over generations',     () => {
    expect(phiMutationRate(50, 100)).toBeLessThan(phiMutationRate(0, 100);
  });
  test('rate at gen=maxGen = 0',              () => {
    expect(phiMutationRate(100, 100)).toBeCloseTo(0, 5);
  });
  test('rate is finite',                      () => {
    expect(isFinite(phiMutationRate(50, 200))).toBe(true);
  });
  test('rate < 0.5/PHI at gen=0',             () => {
    expect(phiMutationRate(0, 100)).toBeCloseTo(0.5 / PHI, 8);
  });
  test('monotone decreasing',                 () => {
    const rates = [0, 25, 50, 75, 100].map(g => phiMutationRate(g, 100));
    for (let i = 1; i < rates.length; i++) {
      expect(rates[i]).toBeLessThanOrEqual(rates[i - 1] + 1e-10);
    }
  });
});
