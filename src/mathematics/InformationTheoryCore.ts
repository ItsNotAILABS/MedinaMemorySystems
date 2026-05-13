/**
 * INFORMATION THEORY CORE
 * =======================
 * Entropy, mutual information, and information-theoretic measures
 * 
 * Key Concepts:
 * - Shannon Entropy: H(X) = -Σ p(x) log p(x)
 * - Mutual Information: I(X;Y) = H(X) + H(Y) - H(X,Y)
 * - KL Divergence: D_KL(P||Q) = Σ p(x) log(p(x)/q(x))
 * - Fisher Information: Measures parameter sensitivity
 * - Integrated Information: φ (Tononi's IIT)
 * 
 * @author MEDINA Sovereign Intelligence
 * @version 1.0.0
 * @license Proprietary - All Rights Reserved
 */

import { PHI, E } from './PhiHarmonicMathematics';

// ═══════════════════════════════════════════════════════════════════════════════
// FUNDAMENTAL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const LOG2_E = Math.log2(E);
export const LN_2 = Math.log(2);
export const NAT_TO_BIT = 1 / LN_2;

// ═══════════════════════════════════════════════════════════════════════════════
// SHANNON ENTROPY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Shannon Entropy in bits: H(X) = -Σ p(x) log₂ p(x)
 * Measures average information content or uncertainty
 */
export function shannonEntropy(probabilities: number[]): number {
  let entropy = 0;
  
  for (const p of probabilities) {
    if (p > 0 && p <= 1) {
      entropy -= p * Math.log2(p);
    }
  }
  
  return entropy;
}

/**
 * Shannon Entropy in nats (natural units): H(X) = -Σ p(x) ln p(x)
 */
export function shannonEntropyNats(probabilities: number[]): number {
  let entropy = 0;
  
  for (const p of probabilities) {
    if (p > 0 && p <= 1) {
      entropy -= p * Math.log(p);
    }
  }
  
  return entropy;
}

/**
 * Binary Entropy: H(p) = -p log₂(p) - (1-p) log₂(1-p)
 * For binary random variable with P(X=1) = p
 */
export function binaryEntropy(p: number): number {
  if (p <= 0 || p >= 1) return 0;
  return -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
}

/**
 * Maximum entropy for n outcomes: log₂(n)
 * Achieved when all outcomes equally likely
 */
export function maxEntropy(n: number): number {
  return Math.log2(n);
}

/**
 * Normalized entropy (0 to 1): H(X) / H_max
 */
export function normalizedEntropy(probabilities: number[]): number {
  const H = shannonEntropy(probabilities);
  const Hmax = maxEntropy(probabilities.length);
  return Hmax > 0 ? H / Hmax : 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// JOINT AND CONDITIONAL ENTROPY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Joint Entropy: H(X,Y) = -Σᵢⱼ p(xᵢ,yⱼ) log₂ p(xᵢ,yⱼ)
 * @param jointProb - 2D matrix of joint probabilities
 */
export function jointEntropy(jointProb: number[][]): number {
  let entropy = 0;
  
  for (const row of jointProb) {
    for (const p of row) {
      if (p > 0 && p <= 1) {
        entropy -= p * Math.log2(p);
      }
    }
  }
  
  return entropy;
}

/**
 * Conditional Entropy: H(Y|X) = H(X,Y) - H(X)
 * Average uncertainty of Y given X
 */
export function conditionalEntropy(jointProb: number[][]): number {
  // Compute marginal distribution P(X)
  const marginalX: number[] = jointProb.map(row => 
    row.reduce((sum, p) => sum + p, 0)
  );
  
  const Hxy = jointEntropy(jointProb);
  const Hx = shannonEntropy(marginalX);
  
  return Hxy - Hx;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MUTUAL INFORMATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Mutual Information: I(X;Y) = H(X) + H(Y) - H(X,Y)
 * Measures shared information between X and Y
 */
export function mutualInformation(jointProb: number[][]): number {
  const nX = jointProb.length;
  const nY = jointProb[0].length;
  
  // Marginal P(X)
  const marginalX: number[] = new Array(nX).fill(0);
  for (let i = 0; i < nX; i++) {
    marginalX[i] = jointProb[i].reduce((sum, p) => sum + p, 0);
  }
  
  // Marginal P(Y)
  const marginalY: number[] = new Array(nY).fill(0);
  for (let j = 0; j < nY; j++) {
    for (let i = 0; i < nX; i++) {
      marginalY[j] += jointProb[i][j];
    }
  }
  
  const Hx = shannonEntropy(marginalX);
  const Hy = shannonEntropy(marginalY);
  const Hxy = jointEntropy(jointProb);
  
  return Hx + Hy - Hxy;
}

/**
 * Normalized Mutual Information: NMI = I(X;Y) / √(H(X)×H(Y))
 * Ranges from 0 to 1
 */
export function normalizedMutualInformation(jointProb: number[][]): number {
  const nX = jointProb.length;
  const nY = jointProb[0].length;
  
  // Marginal P(X)
  const marginalX: number[] = new Array(nX).fill(0);
  for (let i = 0; i < nX; i++) {
    marginalX[i] = jointProb[i].reduce((sum, p) => sum + p, 0);
  }
  
  // Marginal P(Y)
  const marginalY: number[] = new Array(nY).fill(0);
  for (let j = 0; j < nY; j++) {
    for (let i = 0; i < nX; i++) {
      marginalY[j] += jointProb[i][j];
    }
  }
  
  const Hx = shannonEntropy(marginalX);
  const Hy = shannonEntropy(marginalY);
  const I = mutualInformation(jointProb);
  
  const denom = Math.sqrt(Hx * Hy);
  return denom > 0 ? I / denom : 0;
}

/**
 * Pointwise Mutual Information: PMI(x,y) = log₂(p(x,y) / (p(x)×p(y)))
 * Measures association between specific outcomes
 */
export function pointwiseMutualInformation(
  pXY: number,
  pX: number,
  pY: number
): number {
  if (pXY <= 0 || pX <= 0 || pY <= 0) return 0;
  return Math.log2(pXY / (pX * pY));
}

// ═══════════════════════════════════════════════════════════════════════════════
// KL DIVERGENCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Kullback-Leibler Divergence: D_KL(P||Q) = Σ p(x) log(p(x)/q(x))
 * Measures how P differs from Q (not symmetric!)
 */
export function klDivergence(P: number[], Q: number[]): number {
  if (P.length !== Q.length) {
    throw new Error('Distributions must have same length');
  }
  
  let divergence = 0;
  
  for (let i = 0; i < P.length; i++) {
    if (P[i] > 0) {
      if (Q[i] <= 0) {
        return Infinity; // Q must be > 0 wherever P > 0
      }
      divergence += P[i] * Math.log2(P[i] / Q[i]);
    }
  }
  
  return divergence;
}

/**
 * Symmetric KL Divergence: (D_KL(P||Q) + D_KL(Q||P)) / 2
 */
export function symmetricKLDivergence(P: number[], Q: number[]): number {
  return (klDivergence(P, Q) + klDivergence(Q, P)) / 2;
}

/**
 * Jensen-Shannon Divergence: JSD(P||Q) = (D_KL(P||M) + D_KL(Q||M)) / 2
 * where M = (P + Q) / 2
 * Always finite and symmetric
 */
export function jsDivergence(P: number[], Q: number[]): number {
  const M = P.map((p, i) => (p + Q[i]) / 2);
  return (klDivergence(P, M) + klDivergence(Q, M)) / 2;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CROSS ENTROPY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Cross Entropy: H(P,Q) = -Σ p(x) log q(x)
 * Average bits needed to encode P using code optimized for Q
 */
export function crossEntropy(P: number[], Q: number[]): number {
  if (P.length !== Q.length) {
    throw new Error('Distributions must have same length');
  }
  
  let ce = 0;
  
  for (let i = 0; i < P.length; i++) {
    if (P[i] > 0) {
      if (Q[i] <= 0) {
        return Infinity;
      }
      ce -= P[i] * Math.log2(Q[i]);
    }
  }
  
  return ce;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIFFERENTIAL ENTROPY (Continuous)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Differential entropy of Gaussian: h(X) = (1/2) log(2πeσ²)
 */
export function gaussianDifferentialEntropy(variance: number): number {
  return 0.5 * Math.log2(2 * Math.PI * E * variance);
}

/**
 * Differential entropy of uniform distribution on [a,b]: h(X) = log(b-a)
 */
export function uniformDifferentialEntropy(a: number, b: number): number {
  return Math.log2(b - a);
}

/**
 * Differential entropy of exponential: h(X) = 1 - ln(λ)
 * where λ is rate parameter
 */
export function exponentialDifferentialEntropy(lambda: number): number {
  return 1 - Math.log(lambda);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FISHER INFORMATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fisher Information for Bernoulli: I(p) = 1/(p(1-p))
 */
export function fisherBernoulli(p: number): number {
  if (p <= 0 || p >= 1) return Infinity;
  return 1 / (p * (1 - p));
}

/**
 * Fisher Information for Gaussian (known variance): I(μ) = n/σ²
 */
export function fisherGaussianMean(n: number, variance: number): number {
  return n / variance;
}

/**
 * Fisher Information for Gaussian (known mean): I(σ²) = n/(2σ⁴)
 */
export function fisherGaussianVariance(n: number, variance: number): number {
  return n / (2 * variance * variance);
}

/**
 * Fisher Information for Poisson: I(λ) = n/λ
 */
export function fisherPoisson(n: number, lambda: number): number {
  return n / lambda;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RÉNYI ENTROPY (Generalized)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Rényi Entropy of order α: H_α(X) = (1/(1-α)) log₂(Σ p(x)^α)
 * 
 * Special cases:
 * α → 0: Hartley entropy (log of support size)
 * α → 1: Shannon entropy (limit)
 * α = 2: Collision entropy
 * α → ∞: Min-entropy
 */
export function renyiEntropy(probabilities: number[], alpha: number): number {
  if (alpha === 1) {
    return shannonEntropy(probabilities);
  }
  
  let sum = 0;
  for (const p of probabilities) {
    if (p > 0) {
      sum += Math.pow(p, alpha);
    }
  }
  
  if (sum === 0) return 0;
  return (1 / (1 - alpha)) * Math.log2(sum);
}

/**
 * Min-Entropy: H_∞(X) = -log₂(max_x p(x))
 * Most conservative measure of uncertainty
 */
export function minEntropy(probabilities: number[]): number {
  const maxP = Math.max(...probabilities);
  return maxP > 0 ? -Math.log2(maxP) : Infinity;
}

/**
 * Collision Entropy (Rényi α=2): H₂(X) = -log₂(Σ p(x)²)
 */
export function collisionEntropy(probabilities: number[]): number {
  const sumSquares = probabilities.reduce((sum, p) => sum + p * p, 0);
  return sumSquares > 0 ? -Math.log2(sumSquares) : Infinity;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSFER ENTROPY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Transfer Entropy: T_{X→Y} = H(Y_t|Y_{t-1},...,Y_{t-k}) - H(Y_t|Y_{t-1},...,Y_{t-k},X_{t-1},...,X_{t-l})
 * Measures directed information transfer from X to Y
 * 
 * @param X - Source time series
 * @param Y - Target time series
 * @param k - History length for Y
 * @param l - History length for X
 */
export function transferEntropy(
  X: number[],
  Y: number[],
  k: number = 1,
  l: number = 1,
  numBins: number = 10
): number {
  // Discretize continuous data
  const discreteX = discretize(X, numBins);
  const discreteY = discretize(Y, numBins);
  
  const n = Math.min(X.length, Y.length);
  
  // Build histograms
  const jointYYX = new Map<string, number>(); // P(Y_t, Y_past, X_past)
  const jointYY = new Map<string, number>();  // P(Y_t, Y_past)
  const jointYX = new Map<string, number>();  // P(Y_past, X_past)
  const marginalY = new Map<string, number>(); // P(Y_past)
  
  for (let t = Math.max(k, l); t < n; t++) {
    const Yt = discreteY[t];
    const Ypast = discreteY.slice(t - k, t).join(',');
    const Xpast = discreteX.slice(t - l, t).join(',');
    
    const keyYYX = `${Yt},${Ypast},${Xpast}`;
    const keyYY = `${Yt},${Ypast}`;
    const keyYX = `${Ypast},${Xpast}`;
    
    jointYYX.set(keyYYX, (jointYYX.get(keyYYX) || 0) + 1);
    jointYY.set(keyYY, (jointYY.get(keyYY) || 0) + 1);
    jointYX.set(keyYX, (jointYX.get(keyYX) || 0) + 1);
    marginalY.set(Ypast, (marginalY.get(Ypast) || 0) + 1);
  }
  
  // Normalize
  const total = n - Math.max(k, l);
  
  // Calculate transfer entropy
  let te = 0;
  for (const [keyYYX, countYYX] of jointYYX) {
    const [Yt, Ypast, Xpast] = keyYYX.split(',', 3);
    const pYYX = countYYX / total;
    const pYY = (jointYY.get(`${Yt},${Ypast}`) || 0) / total;
    const pYX = (jointYX.get(`${Ypast},${Xpast}`) || 0) / total;
    const pY = (marginalY.get(Ypast) || 0) / total;
    
    if (pYYX > 0 && pYX > 0 && pYY > 0 && pY > 0) {
      te += pYYX * Math.log2((pYYX * pY) / (pYY * pYX));
    }
  }
  
  return te;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTEGRATED INFORMATION (Simplified Φ)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Simplified Integrated Information (Φ)
 * Measures "consciousness" as information that is both integrated and irreducible
 * 
 * Based on Tononi's Integrated Information Theory (IIT)
 * Full computation is NP-hard; this is simplified version
 */
export function integratedInformation(
  connectivityMatrix: number[][],
  states: number[]
): number {
  const n = connectivityMatrix.length;
  if (n === 0) return 0;
  
  // Compute whole system mutual information
  const wholeSystemMI = computeSystemMI(connectivityMatrix, states);
  
  // Find minimum information partition (MIP)
  // For simplicity, try all bipartitions
  let minPartitionInfo = Infinity;
  
  for (let partition = 1; partition < Math.pow(2, n) - 1; partition++) {
    const partA: number[] = [];
    const partB: number[] = [];
    
    for (let i = 0; i < n; i++) {
      if ((partition >> i) & 1) {
        partA.push(i);
      } else {
        partB.push(i);
      }
    }
    
    if (partA.length === 0 || partB.length === 0) continue;
    
    // Compute information across partition
    const acrossInfo = computeAcrossPartitionInfo(
      connectivityMatrix, states, partA, partB
    );
    
    // Normalize by partition size
    const normalizedInfo = acrossInfo / Math.min(partA.length, partB.length);
    
    if (normalizedInfo < minPartitionInfo) {
      minPartitionInfo = normalizedInfo;
    }
  }
  
  return minPartitionInfo === Infinity ? wholeSystemMI : minPartitionInfo;
}

// ═══════════════════════════════════════════════════════════════════════════════
// φ-SCALED INFORMATION MEASURES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * φ-Entropy: Entropy weighted by golden ratio
 * H_φ(X) = φ × H(X) for systems in golden resonance
 */
export function phiEntropy(probabilities: number[]): number {
  return PHI * shannonEntropy(probabilities);
}

/**
 * φ-Mutual Information: I_φ(X;Y) = I(X;Y)^φ
 * Emphasizes strong correlations
 */
export function phiMutualInformation(jointProb: number[][]): number {
  const mi = mutualInformation(jointProb);
  return Math.pow(mi, PHI);
}

/**
 * Golden Information Ratio: GIR = I(X;Y) / (H(X) × φ)
 * Measures how much information is transmitted relative to golden capacity
 */
export function goldenInformationRatio(jointProb: number[][]): number {
  const nX = jointProb.length;
  const marginalX: number[] = new Array(nX).fill(0);
  for (let i = 0; i < nX; i++) {
    marginalX[i] = jointProb[i].reduce((sum, p) => sum + p, 0);
  }
  
  const Hx = shannonEntropy(marginalX);
  const I = mutualInformation(jointProb);
  
  return Hx > 0 ? I / (Hx * PHI) : 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function discretize(values: number[], numBins: number): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  
  return values.map(v => 
    Math.min(numBins - 1, Math.floor((v - min) / range * numBins))
  );
}

function computeSystemMI(
  connectivity: number[][],
  states: number[]
): number {
  // Simplified: sum of pairwise mutual information
  const n = connectivity.length;
  let totalMI = 0;
  
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (connectivity[i][j] > 0 || connectivity[j][i] > 0) {
        // Estimate MI from connectivity strength
        const strength = (connectivity[i][j] + connectivity[j][i]) / 2;
        totalMI += strength * Math.abs(states[i] - states[j]);
      }
    }
  }
  
  return totalMI;
}

function computeAcrossPartitionInfo(
  connectivity: number[][],
  states: number[],
  partA: number[],
  partB: number[]
): number {
  let acrossInfo = 0;
  
  for (const i of partA) {
    for (const j of partB) {
      const strength = (connectivity[i][j] + connectivity[j][i]) / 2;
      acrossInfo += strength * Math.abs(states[i] - states[j]);
    }
  }
  
  return acrossInfo;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Constants
  LOG2_E,
  LN_2,
  NAT_TO_BIT,
  
  // Shannon entropy
  shannonEntropy,
  shannonEntropyNats,
  binaryEntropy,
  maxEntropy,
  normalizedEntropy,
  
  // Joint/conditional
  jointEntropy,
  conditionalEntropy,
  
  // Mutual information
  mutualInformation,
  normalizedMutualInformation,
  pointwiseMutualInformation,
  
  // Divergences
  klDivergence,
  symmetricKLDivergence,
  jsDivergence,
  crossEntropy,
  
  // Differential
  gaussianDifferentialEntropy,
  uniformDifferentialEntropy,
  exponentialDifferentialEntropy,
  
  // Fisher
  fisherBernoulli,
  fisherGaussianMean,
  fisherGaussianVariance,
  fisherPoisson,
  
  // Rényi
  renyiEntropy,
  minEntropy,
  collisionEntropy,
  
  // Transfer
  transferEntropy,
  
  // Integrated information
  integratedInformation,
  
  // φ-scaled
  phiEntropy,
  phiMutualInformation,
  goldenInformationRatio
};
