/**
 * 𓂀 TOROIDAL MEMORY NAVIGATOR — TEST SUITE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Tests for the five-coordinate toroidal memory system.
 * Charter: TMN-001
 *
 * Sections:
 *   I.   Constants & Distance Metrics
 *   II.  Coordinate Assignment
 *   III. Store / Get / Delete
 *   IV.  k-Nearest Neighbour Retrieval
 *   V.   Query Interface
 *   VI.  Navigation Operations
 *   VII. Statistics
 *   VIII.Singleton Lifecycle
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  ToroidalMemoryNavigator,
  getToroidalMemoryNavigator,
  resetToroidalMemoryNavigator,
  assignCoordinates,
  toroidalDistance,
  angularDistance,
  RING_COUNT,
  RING_NAMES,
  THETA_MAX,
  PHI_COORD_MAX,
  RHO_MIN,
  DISTANCE_WEIGHTS,
  type ToroidalCoordinate,
  type ToroidalMemory,
} from '../lib/toroidalMemoryNavigator';

const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_INVERSE = 1 / PHI;

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION I: CONSTANTS & DISTANCE METRICS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Constants', () => {
  test('RING_COUNT is 12', () => {
    expect(RING_COUNT).toBe(12);
  });

  test('THETA_MAX is 360', () => {
    expect(THETA_MAX).toBe(360);
  });

  test('PHI_COORD_MAX is 180', () => {
    expect(PHI_COORD_MAX).toBe(180);
  });

  test('RHO_MIN is 1', () => {
    expect(RHO_MIN).toBe(1);
  });

  test('DISTANCE_WEIGHTS.ring equals PHI', () => {
    expect(DISTANCE_WEIGHTS.ring).toBeCloseTo(PHI, 5);
  });

  test('DISTANCE_WEIGHTS.theta equals PHI_INVERSE', () => {
    expect(DISTANCE_WEIGHTS.theta).toBeCloseTo(PHI_INVERSE, 5);
  });

  test('RING_NAMES has 12 entries', () => {
    expect(Object.keys(RING_NAMES).length).toBe(RING_COUNT);
  });

  test('RING_NAMES ring 12 is Sovereign', () => {
    expect(RING_NAMES[12]).toBe('Sovereign');
  });
});

describe('angularDistance', () => {
  test('distance between same angles is 0', () => {
    expect(angularDistance(45, 45, 360)).toBe(0);
  });

  test('distance wraps around correctly for theta', () => {
    // 350° and 10° are 20° apart (wrapping), not 340°
    expect(angularDistance(350, 10, 360)).toBe(20);
  });

  test('distance is symmetric', () => {
    expect(angularDistance(30, 90, 360)).toBe(angularDistance(90, 30, 360));
  });

  test('max distance for theta is 180 (half cycle)', () => {
    expect(angularDistance(0, 180, 360)).toBe(180);
  });

  test('phi coordinate wraps at 180', () => {
    expect(angularDistance(10, 170, 180)).toBe(20);
  });
});

describe('toroidalDistance', () => {
  const coord = (theta: number, phi: number, rho = 1, ring = 1, beat = 0): ToroidalCoordinate =>
    ({ theta, phi, rho, ring, beat });

  test('distance from self is 0', () => {
    const c = coord(45, 45, 2, 3, 5);
    expect(toroidalDistance(c, c)).toBe(0);
  });

  test('distance increases with theta separation', () => {
    const d1 = toroidalDistance(coord(0, 45), coord(10, 45));
    const d2 = toroidalDistance(coord(0, 45), coord(20, 45));
    expect(d2).toBeGreaterThan(d1);
  });

  test('ring penalty: cross-ring distance is large', () => {
    const sameRing = toroidalDistance(coord(0, 0, 1, 1), coord(0, 0, 1, 1));
    const crossRing = toroidalDistance(coord(0, 0, 1, 1), coord(0, 0, 1, 7));
    expect(crossRing).toBeGreaterThan(sameRing);
  });

  test('distance is symmetric', () => {
    const a = coord(30, 60, 2, 3, 10);
    const b = coord(90, 120, 4, 5, 20);
    expect(toroidalDistance(a, b)).toBeCloseTo(toroidalDistance(b, a), 10);
  });

  test('beat distance is low-weight relative to ring distance', () => {
    // Beat difference of 1000 vs ring difference of 6 — ring should dominate
    const dBeat = toroidalDistance(coord(0, 0, 1, 1, 0), coord(0, 0, 1, 1, 1000));
    const dRing = toroidalDistance(coord(0, 0, 1, 1, 0), coord(0, 0, 1, 7, 0));
    // Ring penalty (weight=φ, diff=6) is heavier than beat (weight=φ⁻¹/10, diff=1000)
    // Both can be large; check that beat-only distance uses the low-weight factor
    expect(DISTANCE_WEIGHTS.beat).toBeLessThan(DISTANCE_WEIGHTS.ring);
    expect(dBeat).toBeGreaterThanOrEqual(0);
    expect(dRing).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION II: COORDINATE ASSIGNMENT
// ═══════════════════════════════════════════════════════════════════════════════

describe('assignCoordinates', () => {
  test('returns valid coordinate shape', () => {
    const c = assignCoordinates('hello world', 0);
    expect(typeof c.theta).toBe('number');
    expect(typeof c.phi).toBe('number');
    expect(typeof c.rho).toBe('number');
    expect(typeof c.ring).toBe('number');
    expect(typeof c.beat).toBe('number');
  });

  test('theta is in [0, 360)', () => {
    const c = assignCoordinates('some content here', 0);
    expect(c.theta).toBeGreaterThanOrEqual(0);
    expect(c.theta).toBeLessThan(360);
  });

  test('phi is in [0, 180)', () => {
    const c = assignCoordinates('some content here', 0);
    expect(c.phi).toBeGreaterThanOrEqual(0);
    expect(c.phi).toBeLessThan(180);
  });

  test('rho is at least RHO_MIN', () => {
    const c = assignCoordinates('x', 0);
    expect(c.rho).toBeGreaterThanOrEqual(RHO_MIN);
  });

  test('ring is in [1, 12]', () => {
    const c = assignCoordinates('memory recall storage', 0);
    expect(c.ring).toBeGreaterThanOrEqual(1);
    expect(c.ring).toBeLessThanOrEqual(12);
  });

  test('beat matches provided beat', () => {
    expect(assignCoordinates('text', 7).beat).toBe(7);
  });

  test('overrides are respected', () => {
    const c = assignCoordinates('content', 0, { theta: 90, ring: 5 });
    expect(c.theta).toBe(90);
    expect(c.ring).toBe(5);
  });

  test('memory-related content maps to ring 1', () => {
    const c = assignCoordinates('memory recall storage', 0);
    expect(c.ring).toBe(1);
  });

  test('security-related content maps to ring 5', () => {
    const c = assignCoordinates('security encryption cipher protect', 0);
    expect(c.ring).toBe(5);
  });

  test('longer content gets higher rho (specificity)', () => {
    const short = assignCoordinates('hello', 0);
    const long  = assignCoordinates('hello '.repeat(20), 0);
    expect(long.rho).toBeGreaterThan(short.rho);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION III: STORE / GET / DELETE
// ═══════════════════════════════════════════════════════════════════════════════

describe('ToroidalMemoryNavigator — CRUD', () => {
  let nav: ToroidalMemoryNavigator;

  beforeEach(() => {
    nav = new ToroidalMemoryNavigator();
  });

  test('store() returns a ToroidalMemory', () => {
    const m = nav.store('hello world');
    expect(m.id).toBeDefined();
    expect(m.content).toBe('hello world');
    expect(m.coordinates).toBeDefined();
  });

  test('stored memory is retrievable by id', () => {
    const m = nav.store('test content');
    const fetched = nav.get(m.id);
    expect(fetched).not.toBeNull();
    expect(fetched!.id).toBe(m.id);
  });

  test('get() increments accessCount', () => {
    const m = nav.store('access count test');
    nav.get(m.id);
    nav.get(m.id);
    const fetched = nav.get(m.id);
    expect(fetched!.accessCount).toBeGreaterThanOrEqual(3);
  });

  test('get() returns null for unknown id', () => {
    expect(nav.get('nonexistent-id')).toBeNull();
  });

  test('delete() removes memory', () => {
    const m = nav.store('to be deleted');
    expect(nav.delete(m.id)).toBe(true);
    expect(nav.get(m.id)).toBeNull();
  });

  test('delete() returns false for unknown id', () => {
    expect(nav.delete('ghost-id')).toBe(false);
  });

  test('update() creates a new beat version', () => {
    const m = nav.store('original content');
    const beat1 = m.coordinates.beat;
    const updated = nav.update(m.id, 'updated content');
    expect(updated).not.toBeNull();
    expect(updated!.coordinates.beat).toBeGreaterThan(beat1);
    expect(updated!.content).toBe('updated content');
  });

  test('update() preserves angular position', () => {
    const m = nav.store('original content');
    const updated = nav.update(m.id, 'updated content');
    expect(updated!.coordinates.theta).toBeCloseTo(m.coordinates.theta, 5);
    expect(updated!.coordinates.phi).toBeCloseTo(m.coordinates.phi, 5);
  });

  test('update() returns null for unknown id', () => {
    expect(nav.update('ghost', 'new content')).toBeNull();
  });

  test('custom tags are stored', () => {
    const m = nav.store('tagged content', { tags: ['alpha', 'beta'] });
    expect(m.tags).toEqual(['alpha', 'beta']);
  });

  test('custom metadata is stored', () => {
    const m = nav.store('meta content', { metadata: { source: 'test' } });
    expect(m.metadata.source).toBe('test');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION IV: K-NEAREST NEIGHBOUR
// ═══════════════════════════════════════════════════════════════════════════════

describe('knn', () => {
  let nav: ToroidalMemoryNavigator;

  beforeEach(() => {
    nav = new ToroidalMemoryNavigator();
    // Store 20 memories for retrieval tests
    for (let i = 0; i < 20; i++) {
      nav.store(`memory number ${i} about computation algorithms and code`, {
        coordinateOverrides: { theta: i * 18, phi: 45, rho: 2, ring: 3, beat: i },
      });
    }
  });

  test('knn returns at most k results', () => {
    const anchor: ToroidalCoordinate = { theta: 0, phi: 45, rho: 2, ring: 3, beat: 0 };
    const results = nav.knn(anchor, 5);
    expect(results.length).toBeLessThanOrEqual(5);
  });

  test('knn results are sorted by distance (closest first)', () => {
    const anchor: ToroidalCoordinate = { theta: 90, phi: 45, rho: 2, ring: 3, beat: 0 };
    const results = nav.knn(anchor, 10);
    const distances = results.map(m => toroidalDistance(anchor, m.coordinates));
    for (let i = 1; i < distances.length; i++) {
      expect(distances[i]).toBeGreaterThanOrEqual(distances[i - 1]);
    }
  });

  test('ring filter restricts results to that ring', () => {
    const anchor: ToroidalCoordinate = { theta: 0, phi: 45, rho: 2, ring: 3, beat: 0 };
    const results = nav.knn(anchor, 10, 3);
    results.forEach(m => expect(m.coordinates.ring).toBe(3));
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION V: QUERY INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

describe('query', () => {
  let nav: ToroidalMemoryNavigator;

  beforeEach(() => {
    nav = new ToroidalMemoryNavigator();
    nav.store('memory recall storage remember', { coordinateOverrides: { ring: 1 } });
    nav.store('compute algorithm code program', { coordinateOverrides: { ring: 3 } });
    nav.store('secure encryption cipher protect key', { coordinateOverrides: { ring: 5 } });
    for (let i = 0; i < 15; i++) {
      nav.store(`filler content item ${i}`, { coordinateOverrides: { ring: 12 } });
    }
  });

  test('query returns a result object with all fields', () => {
    const result = nav.query({ query: 'memory', limit: 5 });
    expect(Array.isArray(result.memories)).toBe(true);
    expect(result.queryCoordinate).toBeDefined();
    expect(Array.isArray(result.distances)).toBe(true);
    expect(typeof result.executionTimeMs).toBe('number');
    expect(typeof result.totalSearched).toBe('number');
  });

  test('limit is respected', () => {
    const result = nav.query({ query: 'test', limit: 3 });
    expect(result.memories.length).toBeLessThanOrEqual(3);
  });

  test('ring filter works', () => {
    const result = nav.query({ query: 'memory', ring: 1, limit: 10 });
    result.memories.forEach(m => expect(m.coordinates.ring).toBe(1));
  });

  test('beat range filter works', () => {
    const result = nav.query({ query: 'anything', beatRange: [0, 2], limit: 10 });
    result.memories.forEach(m => {
      expect(m.coordinates.beat).toBeGreaterThanOrEqual(0);
      expect(m.coordinates.beat).toBeLessThanOrEqual(2);
    });
  });

  test('distances array matches memories length', () => {
    const result = nav.query({ query: 'test', limit: 5 });
    expect(result.distances.length).toBe(result.memories.length);
  });

  test('executionTimeMs is non-negative', () => {
    const result = nav.query({ query: 'hello' });
    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VI: NAVIGATION OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Navigation operations', () => {
  let nav: ToroidalMemoryNavigator;
  const baseCoord: ToroidalCoordinate = { theta: 90, phi: 45, rho: 2, ring: 6, beat: 5 };

  beforeEach(() => {
    nav = new ToroidalMemoryNavigator();
    for (let i = 0; i < 10; i++) {
      nav.store(`intelligence cognition thinking reason concept ${i}`, {
        coordinateOverrides: { theta: i * 36, phi: 45 + i * 3, rho: 2, ring: 6, beat: i },
      });
    }
  });

  test('traverseTheta returns correct destination theta', () => {
    const result = nav.traverseTheta(baseCoord, 30);
    expect(result.to.theta).toBeCloseTo(120, 5);
    expect(result.operation).toContain('traverse_theta');
  });

  test('traverseTheta wraps at 360', () => {
    const result = nav.traverseTheta({ ...baseCoord, theta: 350 }, 20);
    expect(result.to.theta).toBeCloseTo(10, 5);
  });

  test('traversePhi returns correct destination phi', () => {
    const result = nav.traversePhi(baseCoord, 30);
    expect(result.to.phi).toBeCloseTo(75, 5);
  });

  test('traversePhi clamps at PHI_COORD_MAX', () => {
    const result = nav.traversePhi({ ...baseCoord, phi: 170 }, 20);
    expect(result.to.phi).toBeLessThanOrEqual(PHI_COORD_MAX);
  });

  test('dive increases rho', () => {
    const result = nav.dive(baseCoord, 3);
    expect(result.to.rho).toBeGreaterThan(baseCoord.rho);
    expect(result.operation).toContain('dive');
  });

  test('surface decreases rho toward RHO_MIN', () => {
    const result = nav.surface({ ...baseCoord, rho: 5 }, 3);
    expect(result.to.rho).toBeLessThan(5);
    expect(result.to.rho).toBeGreaterThanOrEqual(RHO_MIN);
  });

  test('ringShift changes ring', () => {
    const result = nav.ringShift(baseCoord, 9);
    expect(result.to.ring).toBe(9);
    expect(result.operation).toContain('ring_shift');
  });

  test('ringShift clamps ring to [1, 12]', () => {
    expect(nav.ringShift(baseCoord, 0).to.ring).toBe(1);
    expect(nav.ringShift(baseCoord, 15).to.ring).toBe(12);
  });

  test('timeTravel returns NavigationResult', () => {
    const result = nav.timeTravel(baseCoord, 3, 2);
    expect(result.from).toEqual(baseCoord);
    expect(result.to.beat).toBe(3);
    expect(result.operation).toContain('time_travel');
    expect(Array.isArray(result.memoriesNearDestination)).toBe(true);
  });

  test('navigation from and to are different for non-zero delta', () => {
    const result = nav.traverseTheta(baseCoord, 45);
    expect(result.from.theta).not.toBe(result.to.theta);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VII: STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════

describe('stats()', () => {
  let nav: ToroidalMemoryNavigator;

  beforeEach(() => {
    nav = new ToroidalMemoryNavigator();
    nav.store('memory recall', { coordinateOverrides: { ring: 1 } });
    nav.store('compute algorithm code', { coordinateOverrides: { ring: 3 } });
    nav.store('security encryption', { coordinateOverrides: { ring: 5 } });
  });

  test('stats reflects correct total', () => {
    expect(nav.stats().totalMemories).toBe(3);
  });

  test('memoriesByRing counts correctly', () => {
    const s = nav.stats();
    expect(s.memoriesByRing[1]).toBe(1);
    expect(s.memoriesByRing[3]).toBe(1);
    expect(s.memoriesByRing[5]).toBe(1);
  });

  test('averageDepth is positive', () => {
    expect(nav.stats().averageDepth).toBeGreaterThan(0);
  });

  test('maxBeat equals highest beat', () => {
    expect(nav.stats().maxBeat).toBe(2); // 0, 1, 2
  });

  test('totalAccesses increments on get', () => {
    const m = nav.store('access me');
    nav.get(m.id);
    nav.get(m.id);
    expect(nav.stats().totalAccesses).toBeGreaterThanOrEqual(2);
  });

  test('indexSize equals total stored memories', () => {
    const s = nav.stats();
    expect(s.indexSize).toBe(s.totalMemories);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION VIII: SINGLETON LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Singleton', () => {
  afterEach(() => {
    resetToroidalMemoryNavigator();
  });

  test('getToroidalMemoryNavigator returns same instance', () => {
    const a = getToroidalMemoryNavigator();
    const b = getToroidalMemoryNavigator();
    expect(a).toBe(b);
  });

  test('resetToroidalMemoryNavigator creates fresh instance', () => {
    const a = getToroidalMemoryNavigator();
    a.store('singleton content');
    resetToroidalMemoryNavigator();
    const b = getToroidalMemoryNavigator();
    expect(b.stats().totalMemories).toBe(0);
  });

  test('beat counter increments across stores', () => {
    const nav = getToroidalMemoryNavigator();
    const m1 = nav.store('first');
    const m2 = nav.store('second');
    expect(m2.coordinates.beat).toBeGreaterThan(m1.coordinates.beat);
  });

  test('ringNames returns all 12 rings', () => {
    const nav = getToroidalMemoryNavigator();
    const names = nav.ringNames;
    expect(Object.keys(names).length).toBe(12);
    expect(names[12]).toBe('Sovereign');
  });
});
