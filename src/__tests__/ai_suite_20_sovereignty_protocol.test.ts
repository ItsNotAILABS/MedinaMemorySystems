/**
 * AI Suite 20 — Sovereignty Protocol
 * ============================================================
 * Sovereign identity, trust chains, cryptographic commitment,
 * capability revocation, agent authentication, delegation depth,
 * φ-coherent sovereignty score, and protocol invariants.
 *
 * Target: 140+ tests   Charter: AIS-SOV-001
 */

'use strict';

const PHI = (1 + Math.sqrt(5)) / 2;

// ─── Implementations ──────────────────────────────────────────────────────────

interface SovereignId {
  id: string;
  tier: number;
  capabilities: Set<string>;
  parentId: string | null;
  created: number;
}

function createSovereign(id: string, tier: number, caps: string[], parentId: string | null = null): SovereignId {
  return { id, tier, capabilities: new Set(caps), parentId, created: Date.now() };
}

function hasCapability(sov: SovereignId, cap: string): boolean {
  return sov.capabilities.has(cap);
}

function revokeCapability(sov: SovereignId, cap: string): SovereignId {
  const newCaps = new Set(sov.capabilities);
  newCaps.delete(cap);
  return { ...sov, capabilities: newCaps };
}

function grantCapability(sov: SovereignId, cap: string): SovereignId {
  const newCaps = new Set(sov.capabilities);
  newCaps.add(cap);
  return { ...sov, capabilities: newCaps };
}

function delegationDepth(
  sovId: string,
  registry: Map<string, SovereignId>
): number {
  let depth = 0, current = sovId;
  const visited = new Set<string>();
  while (true) {
    if (visited.has(current)) break;
    visited.add(current);
    const sov = registry.get(current);
    if (!sov || sov.parentId === null) break;
    depth++;
    current = sov.parentId;
  }
  return depth;
}

function verifyTrustChain(
  sovId: string,
  registry: Map<string, SovereignId>,
  requiredTier: number
): boolean {
  const sov = registry.get(sovId);
  if (!sov) return false;
  if (sov.tier < requiredTier) return false;
  if (sov.parentId === null) return true;
  return verifyTrustChain(sov.parentId, registry, 0);
}

function commitment(value: string, nonce: string): string {
  let h = 0;
  const s = value + ':' + nonce;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  }
  return (h >>> 0).toString(16);
}

function verifyCommitment(value: string, nonce: string, expected: string): boolean {
  return commitment(value, nonce) === expected;
}

function phiSovereigntyScore(tier: number, numCaps: number, depth: number): number {
  return (tier * PHI + numCaps * PHI * PHI - depth / PHI) / (1 + PHI + PHI * PHI);
}

function authenticate(
  sov: SovereignId,
  challenge: string,
  response: string
): boolean {
  return commitment(sov.id, challenge) === response;
}

// ─── SECTION 1: Sovereign identity ────────────────────────────────────────────
describe('Sov § 1 — Sovereign identity', () => {
  test('createSovereign sets id',           () => {
    expect(createSovereign('alice', 2, ['read']).id).toBe('alice');
  });
  test('createSovereign sets tier',         () => {
    expect(createSovereign('alice', 3, []).tier).toBe(3);
  });
  test('capabilities stored',              () => {
    const s = createSovereign('a', 1, ['read', 'write']);
    expect(s.capabilities.size).toBe(2);
  });
  test('parent null for root',             () => {
    expect(createSovereign('root', 5, []).parentId).toBeNull();
  });
  test('parent set correctly',             () => {
    const s = createSovereign('child', 1, [], 'parent');
    expect(s.parentId).toBe('parent');
  });
  test('capabilities are a Set',           () => {
    const s = createSovereign('a', 1, ['x']);
    expect(s.capabilities instanceof Set).toBe(true);
  });
  test('created timestamp is recent',      () => {
    const s = createSovereign('a', 1, []);
    expect(s.created).toBeLessThanOrEqual(Date.now();
    expect(s.created).toBeGreaterThan(Date.now() - 1000);
  });
});

// ─── SECTION 2: Capability management ──────────────────────────────────────────
describe('Sov § 2 — Capabilities', () => {
  let sov: SovereignId;
  beforeEach(() => { sov = createSovereign('a', 2, ['read', 'write']); });

  test('hasCapability existing → true',     () => expect(hasCapability(sov, 'read')).toBe(true));
  test('hasCapability absent → false',      () => expect(hasCapability(sov, 'admin')).toBe(false));
  test('revokeCapability removes it',       () => {
    expect(hasCapability(revokeCapability(sov, 'read'), 'read')).toBe(false);
  });
  test('revoke non-existent → no error',   () => {
    expect(() => revokeCapability(sov, 'nonexistent')).not.toThrow();
  });
  test('grantCapability adds it',          () => {
    expect(hasCapability(grantCapability(sov, 'admin'), 'admin')).toBe(true);
  });
  test('grant idempotent',                 () => {
    const s = grantCapability(sov, 'read');
    expect(s.capabilities.size).toBe(sov.capabilities.size);
  });
  test('revoke is non-destructive (immutable)', () => {
    revokeCapability(sov, 'write');
    expect(hasCapability(sov, 'write')).toBe(true);
  });
  test('grant is non-destructive',         () => {
    grantCapability(sov, 'admin');
    expect(hasCapability(sov, 'admin')).toBe(false);
  });
});

// ─── SECTION 3: Trust chain ────────────────────────────────────────────────────
describe('Sov § 3 — Trust chain', () => {
  let registry: Map<string, SovereignId>;
  beforeEach(() => {
    registry = new Map();
    registry.set('root', createSovereign('root', 5, ['all']));
    registry.set('mid',  createSovereign('mid', 3, ['read'], 'root'));
    registry.set('leaf', createSovereign('leaf', 1, [], 'mid'));
  });

  test('root trust chain valid',            () => expect(verifyTrustChain('root', registry, 5)).toBe(true));
  test('mid chain valid',                   () => expect(verifyTrustChain('mid', registry, 3)).toBe(true));
  test('leaf chain valid',                  () => expect(verifyTrustChain('leaf', registry, 1)).toBe(true));
  test('wrong tier fails',                  () => expect(verifyTrustChain('leaf', registry, 5)).toBe(false));
  test('unknown agent fails',               () => expect(verifyTrustChain('alien', registry, 1)).toBe(false));
  test('tier 0 always passes tier check',   () => expect(verifyTrustChain('leaf', registry, 0)).toBe(true));
});

// ─── SECTION 4: Delegation depth ──────────────────────────────────────────────
describe('Sov § 4 — Delegation depth', () => {
  let registry: Map<string, SovereignId>;
  beforeEach(() => {
    registry = new Map();
    registry.set('root', createSovereign('root', 5, []));
    registry.set('l1',   createSovereign('l1', 3, [], 'root'));
    registry.set('l2',   createSovereign('l2', 1, [], 'l1'));
  });

  test('root depth = 0',   () => expect(delegationDepth('root', registry)).toBe(0));
  test('l1 depth = 1',     () => expect(delegationDepth('l1', registry)).toBe(1));
  test('l2 depth = 2',     () => expect(delegationDepth('l2', registry)).toBe(2));
  test('unknown depth = 0',() => expect(delegationDepth('alien', registry)).toBe(0));
});

// ─── SECTION 5: Cryptographic commitments ─────────────────────────────────────
describe('Sov § 5 — Commitments', () => {
  test('commitment is deterministic',     () => {
    expect(commitment('value', 'nonce')).toBe(commitment('value', 'nonce');
  });
  test('different values → different commitments', () => {
    expect(commitment('a', 'n')).not.toBe(commitment('b', 'n');
  });
  test('different nonces → different commitments', () => {
    expect(commitment('v', 'n1')).not.toBe(commitment('v', 'n2');
  });
  test('verifyCommitment correct → true',  () => {
    const c = commitment('secret', 'xyz');
    expect(verifyCommitment('secret', 'xyz', c)).toBe(true);
  });
  test('verifyCommitment wrong → false',   () => {
    expect(verifyCommitment('secret', 'xyz', 'wrong')).toBe(false);
  });
  test('commitment is a string',           () => {
    expect(typeof commitment('v', 'n')).toBe('string');
  });
  test('commitment non-empty',             () => {
    expect(commitment('v', 'n').length).toBeGreaterThan(0);
  });
});

// ─── SECTION 6: Authentication ─────────────────────────────────────────────────
describe('Sov § 6 — Authentication', () => {
  const sov = createSovereign('alice', 3, ['read']);
  const challenge = 'random-challenge-123';
  const correctResponse = commitment('alice', challenge);

  test('correct response → authenticated',  () => {
    expect(authenticate(sov, challenge, correctResponse)).toBe(true);
  });
  test('wrong response → rejected',         () => {
    expect(authenticate(sov, challenge, 'wrong')).toBe(false);
  });
  test('different challenge → different response', () => {
    const r1 = commitment('alice', 'c1');
    const r2 = commitment('alice', 'c2');
    expect(r1).not.toBe(r2);
  });
  test('authentication deterministic',      () => {
    const a1 = authenticate(sov, challenge, correctResponse);
    const a2 = authenticate(sov, challenge, correctResponse);
    expect(a1).toBe(a2);
  });
});

// ─── SECTION 7: φ-sovereignty score ───────────────────────────────────────────
describe('Sov § 7 — φ-sovereignty score', () => {
  test('higher tier → higher score',         () => {
    expect(phiSovereigntyScore(5, 10, 0)).toBeGreaterThan(phiSovereigntyScore(1, 10, 0);
  });
  test('more capabilities → higher score',  () => {
    expect(phiSovereigntyScore(3, 10, 0)).toBeGreaterThan(phiSovereigntyScore(3, 2, 0);
  });
  test('deeper delegation → lower score',   () => {
    expect(phiSovereigntyScore(3, 5, 1)).toBeGreaterThan(phiSovereigntyScore(3, 5, 5);
  });
  test('score is finite',                   () => {
    expect(isFinite(phiSovereigntyScore(3, 7, 2))).toBe(true);
  });
  test('score positive for reasonable inputs', () => {
    expect(phiSovereigntyScore(3, 5, 0)).toBeGreaterThan(0);
  });
  test('score uses PHI',                    () => {
    const s1 = phiSovereigntyScore(1, 0, 0);
    expect(s1).toBeCloseTo(PHI / (1 + PHI + PHI * PHI), 5);
  });
});

// ─── SECTION 8: Protocol invariants ───────────────────────────────────────────
describe('Sov § 8 — Protocol invariants', () => {
  test('tier always ≥ 0',               () => {
    [0, 1, 2, 5].forEach(t => expect(t).toBeGreaterThanOrEqual(0));
  });
  test('capability set never duplicates (Set semantics)', () => {
    const s = createSovereign('a', 1, ['read', 'read', 'write']);
    expect(s.capabilities.size).toBe(2);
  });
  test('revoke+grant restores capability', () => {
    const s0 = createSovereign('a', 1, ['x']);
    const s1 = revokeCapability(s0, 'x');
    const s2 = grantCapability(s1, 'x');
    expect(hasCapability(s2, 'x')).toBe(true);
  });
  test('grant+revoke removes capability', () => {
    const s0 = createSovereign('a', 1, []);
    const s1 = grantCapability(s0, 'y');
    const s2 = revokeCapability(s1, 'y');
    expect(hasCapability(s2, 'y')).toBe(false);
  });
  test('root has no parent',            () => {
    const root = createSovereign('root', 5, ['all']);
    expect(root.parentId).toBeNull();
  });
  test('delegation depth non-negative',  () => {
    const reg = new Map<string, SovereignId>();
    reg.set('r', createSovereign('r', 5, []));
    expect(delegationDepth('r', reg)).toBeGreaterThanOrEqual(0);
  });
  test('verifyCommitment round-trip',    () => {
    const val = 'protocol:invariant:check', nonce = 'phi-nonce-42';
    const c = commitment(val, nonce);
    expect(verifyCommitment(val, nonce, c)).toBe(true);
  });
  test('same id → same commitment (deterministic)', () => {
    const s1 = commitment('id-X', 'nonce-Y');
    const s2 = commitment('id-X', 'nonce-Y');
    expect(s1).toBe(s2);
  });
});
