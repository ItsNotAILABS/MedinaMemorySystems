/**
 * AI Suite 06 — Probabilistic Reasoning
 * ============================================================
 * Bayesian inference, prior/likelihood/posterior, Bayes theorem,
 * naive Bayes classifier, conjugate priors, entropy, KL divergence,
 * mutual information, and Monte Carlo estimation.
 *
 * Target: 150+ tests   Charter: AIS-PROB-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;
const EPS = 1e-10;

// ─── Implementations ──────────────────────────────────────────────────────────

function bayesUpdate(prior: number, likelihood: number, marginal: number): number {
  if (marginal === 0) return 0;
  return (likelihood * prior) / marginal;
}

function marginalLikelihood(priorTrue: number, likTrue: number, likFalse: number): number {
  return priorTrue * likTrue + (1 - priorTrue) * likFalse;
}

function normalize(probs: number[]): number[] {
  const sum = probs.reduce((a, b) => a + b, 0);
  if (sum === 0) return probs.map(() => 1 / probs.length);
  return probs.map(p => p / sum);
}

function entropyBits(probs: number[]): number {
  return -probs.reduce((s, p) => p > 0 ? s + p * Math.log2(p) : s, 0);
}

function klDivergence(p: number[], q: number[]): number {
  return p.reduce((s, pi, i) => {
    if (pi === 0) return s;
    const qi = q[i] + EPS;
    return s + pi * Math.log(pi / qi);
  }, 0);
}

function mutualInformation(joint: number[][], margP: number[], margQ: number[]): number {
  let mi = 0;
  for (let i = 0; i < joint.length; i++)
    for (let j = 0; j < joint[0].length; j++) {
      const pij = joint[i][j];
      if (pij > 0) mi += pij * Math.log(pij / (margP[i] * margQ[j] + EPS));
    }
  return mi;
}

function naiveBayes(
  features: number[], classPriors: number[],
  likelihoods: number[][]
): number {
  const scores = classPriors.map((prior, c) =>
    Math.log(prior + EPS) + features.reduce((s, f, i) =>
      s + Math.log((likelihoods[c][i] || EPS)), 0));
  return scores.indexOf(Math.max(...scores));
}

function monteCarloEstimate(fn: (x: number) => number, samples: number, lo = 0, hi = 1): number {
  let sum = 0;
  for (let i = 0; i < samples; i++) {
    const x = lo + ((i + 0.5) / samples) * (hi - lo);
    sum += fn(x);
  }
  return sum / samples * (hi - lo);
}

function betaPosterior(alpha: number, beta: number, heads: number, tails: number): { alpha: number; beta: number } {
  return { alpha: alpha + heads, beta: beta + tails };
}

function dirichletMean(alphas: number[]): number[] {
  const sum = alphas.reduce((a, b) => a + b, 0);
  return alphas.map(a => a / sum);
}

// ─── SECTION 1: Bayes theorem ─────────────────────────────────────────────────
describe('Prob § 1 — Bayes theorem', () => {
  test('bayesUpdate with certain likelihood', () => {
    const p = bayesUpdate(0.5, 1, 0.5);
    expect(p).toBeCloseTo(1, 8);
  });
  test('bayesUpdate = 0 for impossible event', () => {
    expect(bayesUpdate(0.5, 0, 0.5)).toBe(0);
  });
  test('prior=1 → posterior=1', () => {
    const m = marginalLikelihood(1, 0.9, 0.1);
    expect(bayesUpdate(1, 0.9, m)).toBeCloseTo(1, 5);
  });
  test('prior=0 → posterior=0', () => {
    const m = marginalLikelihood(0, 0.9, 0.2);
    expect(bayesUpdate(0, 0.9, m)).toBe(0);
  });
  test('posterior ∈ [0,1]', () => {
    const m = marginalLikelihood(0.3, 0.7, 0.2);
    const post = bayesUpdate(0.3, 0.7, m);
    expect(post).toBeGreaterThanOrEqual(0);
    expect(post).toBeLessThanOrEqual(1 + EPS);
  });
  test('Bayes complements: P(H|E) + P(¬H|E) ≈ 1', () => {
    const prior = 0.4;
    const likTrue = 0.8, likFalse = 0.3;
    const m = marginalLikelihood(prior, likTrue, likFalse);
    const pH  = bayesUpdate(prior,         likTrue,  m);
    const pnH = bayesUpdate(1 - prior, likFalse, m);
    expect(pH + pnH).toBeCloseTo(1, 5);
  });
  test('marginalLikelihood is weighted average', () => {
    const m = marginalLikelihood(0.5, 0.8, 0.2);
    expect(m).toBeCloseTo(0.5, 5);
  });
  test('symmetric prior → posterior proportional to likelihood', () => {
    const m = marginalLikelihood(0.5, 0.9, 0.1);
    const post = bayesUpdate(0.5, 0.9, m);
    expect(post).toBeGreaterThan(0.8);
  });
});

// ─── SECTION 2: Normalization ──────────────────────────────────────────────────
describe('Prob § 2 — Probability normalization', () => {
  test('normalize sums to 1',    () => {
    const n = normalize([1, 2, 3]);
    expect(n.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });
  test('already normalized unchanged', () => {
    const p = [0.5, 0.3, 0.2];
    normalize(p).forEach((v, i) => expect(v).toBeCloseTo(p[i]));
  });
  test('all-equal → uniform',    () => {
    normalize([5, 5, 5]).forEach(v => expect(v).toBeCloseTo(1 / 3, 8));
  });
  test('zero vector → uniform',  () => {
    normalize([0, 0]).forEach(v => expect(v).toBeCloseTo(0.5));
  });
  test('normalize preserves length', () => expect(normalize([1, 2, 3]).length).toBe(3));
  test('single element → 1',    () => expect(normalize([7])[0]).toBe(1));
});

// ─── SECTION 3: Entropy ────────────────────────────────────────────────────────
describe('Prob § 3 — Shannon entropy', () => {
  test('certain event → entropy = 0',     () => expect(entropyBits([1])).toBeCloseTo(0));
  test('fair coin → entropy = 1 bit',     () => expect(entropyBits([0.5, 0.5])).toBeCloseTo(1));
  test('uniform 4-class → entropy = 2',   () => expect(entropyBits([0.25, 0.25, 0.25, 0.25])).toBeCloseTo(2));
  test('entropy non-negative',             () => expect(entropyBits([0.7, 0.3])).toBeGreaterThanOrEqual(0));
  test('entropy maximized by uniform',     () => {
    expect(entropyBits([0.25, 0.25, 0.25, 0.25])).toBeGreaterThan(entropyBits([0.9, 0.05, 0.03, 0.02]));
  });
  test('zero-prob elements ignored',      () => {
    expect(entropyBits([0.5, 0.5, 0])).toBeCloseTo(1);
  });
  test('monotone with n for uniform',     () => {
    const h2 = entropyBits([0.5, 0.5]);
    const h4 = entropyBits([0.25, 0.25, 0.25, 0.25]);
    expect(h4).toBeGreaterThan(h2);
  });
});

// ─── SECTION 4: KL divergence ─────────────────────────────────────────────────
describe('Prob § 4 — KL divergence', () => {
  test('KL(P||P) = 0',               () => {
    const p = [0.5, 0.5];
    expect(klDivergence(p, p)).toBeCloseTo(0, 3);
  });
  test('KL non-negative',             () => {
    expect(klDivergence([0.7, 0.3], [0.5, 0.5])).toBeGreaterThanOrEqual(0);
  });
  test('KL not symmetric',            () => {
    const p = [0.8, 0.2], q = [0.5, 0.5];
    expect(klDivergence(p, q)).not.toBeCloseTo(klDivergence(q, p), 2);
  });
  test('same uniform → KL = 0',      () => {
    const u = [0.25, 0.25, 0.25, 0.25];
    expect(klDivergence(u, u)).toBeCloseTo(0, 5);
  });
  test('large P-Q divergence → large KL', () => {
    const kl_near = klDivergence([0.6, 0.4], [0.55, 0.45]);
    const kl_far  = klDivergence([0.9, 0.1], [0.1, 0.9]);
    expect(kl_far).toBeGreaterThan(kl_near);
  });
});

// ─── SECTION 5: Mutual information ────────────────────────────────────────────
describe('Prob § 5 — Mutual information', () => {
  test('independent vars → MI = 0', () => {
    const joint = [[0.25, 0.25], [0.25, 0.25]];
    const mP = [0.5, 0.5], mQ = [0.5, 0.5];
    expect(mutualInformation(joint, mP, mQ)).toBeCloseTo(0, 2);
  });
  test('perfect correlation → MI > 0', () => {
    const joint = [[0.5, 0], [0, 0.5]];
    const mP = [0.5, 0.5], mQ = [0.5, 0.5];
    expect(mutualInformation(joint, mP, mQ)).toBeGreaterThan(0);
  });
  test('MI non-negative', () => {
    const joint = [[0.3, 0.2], [0.1, 0.4]];
    const mP = [0.5, 0.5], mQ = [0.4, 0.6];
    expect(mutualInformation(joint, mP, mQ)).toBeGreaterThanOrEqual(0);
  });
});

// ─── SECTION 6: Naive Bayes ────────────────────────────────────────────────────
describe('Prob § 6 — Naive Bayes classifier', () => {
  const priors = [0.6, 0.4];
  const likelihoods = [
    [0.8, 0.6, 0.2],
    [0.2, 0.4, 0.9],
  ];

  test('classifies class 0 features correctly', () => {
    expect(naiveBayes([0.8, 0.6, 0.1], priors, likelihoods)).toBe(0);
  });
  test('returns valid class index', () => {
    const cls = naiveBayes([0.5, 0.5, 0.5], priors, likelihoods);
    expect(cls).toBeGreaterThanOrEqual(0);
    expect(cls).toBeLessThan(priors.length);
  });
  test('prior-dominant with equal likelihoods', () => {
    const equalLik = [[0.5, 0.5], [0.5, 0.5]];
    expect(naiveBayes([0.5, 0.5], [0.9, 0.1], equalLik)).toBe(0);
  });
  test('deterministic', () => {
    const a = naiveBayes([0.3, 0.7, 0.8], priors, likelihoods);
    const b = naiveBayes([0.3, 0.7, 0.8], priors, likelihoods);
    expect(a).toBe(b);
  });
});

// ─── SECTION 7: Beta-Dirichlet conjugacy ──────────────────────────────────────
describe('Prob § 7 — Beta posterior', () => {
  test('prior alpha=1,beta=1 → uniform', () => {
    const { alpha, beta } = betaPosterior(1, 1, 0, 0);
    expect(alpha / (alpha + beta)).toBeCloseTo(0.5);
  });
  test('update increases alpha with heads', () => {
    const { alpha } = betaPosterior(1, 1, 5, 0);
    expect(alpha).toBe(6);
  });
  test('update increases beta with tails', () => {
    const { beta } = betaPosterior(1, 1, 0, 5);
    expect(beta).toBe(6);
  });
  test('mean = alpha/(alpha+beta)', () => {
    const { alpha, beta } = betaPosterior(2, 2, 8, 2);
    expect(alpha / (alpha + beta)).toBeCloseTo(10 / 14, 5);
  });
  test('Dirichlet mean sums to 1', () => {
    const mean = dirichletMean([1, 2, 3, 4]);
    expect(mean.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });
  test('Dirichlet mean proportional to alphas', () => {
    const mean = dirichletMean([2, 2]);
    expect(mean[0]).toBeCloseTo(mean[1]);
  });
});

// ─── SECTION 8: Monte Carlo estimation ────────────────────────────────────────
describe('Prob § 8 — Monte Carlo integration', () => {
  test('∫₀¹ 1 dx = 1', () => {
    expect(monteCarloEstimate(() => 1, 1000)).toBeCloseTo(1, 2);
  });
  test('∫₀¹ x dx = 0.5', () => {
    expect(monteCarloEstimate(x => x, 10000)).toBeCloseTo(0.5, 1);
  });
  test('∫₀¹ x² dx ≈ 1/3', () => {
    expect(monteCarloEstimate(x => x * x, 10000)).toBeCloseTo(1 / 3, 1);
  });
  test('∫₀¹ sin(x) dx ≈ 1-cos(1)', () => {
    expect(monteCarloEstimate(Math.sin, 10000)).toBeCloseTo(1 - Math.cos(1), 1);
  });
  test('more samples → better estimate', () => {
    const err100  = Math.abs(monteCarloEstimate(x => x * x, 100)   - 1 / 3);
    const err1000 = Math.abs(monteCarloEstimate(x => x * x, 1000)  - 1 / 3);
    const err10000= Math.abs(monteCarloEstimate(x => x * x, 10000) - 1 / 3);
    expect(err10000).toBeLessThanOrEqual(err1000 + 0.01);
    expect(err1000).toBeLessThanOrEqual(err100 + 0.1);
  });
  test('constant function exact', () => {
    expect(monteCarloEstimate(() => 5, 100)).toBeCloseTo(5, 5);
  });
});
