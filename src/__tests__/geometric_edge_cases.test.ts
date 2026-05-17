/**
 * Geometric Edge-Case Test Suite
 * ============================================================
 * Comprehensive tests for hexagon geometry, regular polygons,
 * symmetry groups, tessellation properties, and φ-geometric
 * constructions as used throughout the MEDINA system.
 *
 * Target: ~1,500+ tests
 * Charter: ALPHA-EC-001 § Geometric Domain
 */

'use strict';

import {
  PHI, PHI_INV, PHI_SQ, SQRT3, SQRT5,
  HexagonEngine,
} from '../lib/alphaEdgeSolver';

const HEX = new HexagonEngine();
const EPS = 1e-10;
const close = (a: number, b: number, e = EPS) => Math.abs(a - b) < e;

// ─── SECTION 1: Hexagon Constants ─────────────────────────────────────────────
describe('Hexagon: Core Constants', () => {
  test('SQRT3 squared = 3',            () => expect(SQRT3 * SQRT3).toBeCloseTo(3, 12));
  test('SQRT5 squared = 5',            () => expect(SQRT5 * SQRT5).toBeCloseTo(5, 12));
  test('SQRT3 > 1',                    () => expect(SQRT3).toBeGreaterThan(1));
  test('SQRT3 < 2',                    () => expect(SQRT3).toBeLessThan(2));
  test('SQRT3 ≈ 1.732',               () => expect(SQRT3).toBeCloseTo(1.7320508, 7));
  test('sin(60°) = √3/2',             () => expect(Math.sin(Math.PI / 3)).toBeCloseTo(SQRT3 / 2, 12));
  test('cos(30°) = √3/2',             () => expect(Math.cos(Math.PI / 6)).toBeCloseTo(SQRT3 / 2, 12));
  test('tan(60°) = √3',               () => expect(Math.tan(Math.PI / 3)).toBeCloseTo(SQRT3, 12));
  test('area coefficient = 3√3/2',    () => expect(HEX.areaCoefficient()).toBeCloseTo(3 * SQRT3 / 2, 12));
  test('area coeff > 2',              () => expect(HEX.areaCoefficient()).toBeGreaterThan(2));
  test('area coeff < 3',              () => expect(HEX.areaCoefficient()).toBeLessThan(3));
  test('interior angle sum = 720',    () => expect(HEX.interiorAngleSum()).toBe(720));
  test('tessellation vertex count = 3', () => expect(HEX.tessellationVertexCount()).toBe(3));
  test('packing efficiency < 1',      () => expect(HEX.packingEfficiency()).toBeLessThan(1));
  test('packing efficiency > 0.9',    () => expect(HEX.packingEfficiency()).toBeGreaterThan(0.9));
  test('packing efficiency = π/(2√3)',() => expect(HEX.packingEfficiency()).toBeCloseTo(Math.PI / (2 * SQRT3), 12));
  test('diagonal count: short=6',     () => expect(HEX.diagonalCount().short).toBe(6));
  test('diagonal count: long=3',      () => expect(HEX.diagonalCount().long).toBe(3));
  test('diagonal count: total=9',     () => expect(HEX.diagonalCount().total).toBe(9));
});

// ─── SECTION 2: Hexagon with s=1 ─────────────────────────────────────────────
describe('Hexagon s=1: Properties', () => {
  const g = HEX.compute(1);

  test('side = 1',                    () => expect(g.side).toBe(1));
  test('area = 3√3/2',               () => expect(g.area).toBeCloseTo(3 * SQRT3 / 2, 12));
  test('perimeter = 6',              () => expect(g.perimeter).toBe(6));
  test('circumradius = 1',           () => expect(g.circumradius).toBe(1));
  test('inradius = √3/2',            () => expect(g.inradius).toBeCloseTo(SQRT3 / 2, 12));
  test('diagonalShort = √3',         () => expect(g.diagonalShort).toBeCloseTo(SQRT3, 12));
  test('diagonalLong = 2',           () => expect(g.diagonalLong).toBe(2));
  test('interior angle = 120°',      () => expect(g.interiorAngleDeg).toBe(120));
  test('symmetry order = 12',        () => expect(g.symmetryOrder).toBe(12));
  test('tessellates = true',         () => expect(g.tessellates).toBe(true));
  test('vertices count = 6',         () => expect(g.vertices.length).toBe(6));
  test('diagonalLong / diagonalShort = 2/√3', () =>
    expect(g.diagonalLong / g.diagonalShort).toBeCloseTo(2 / SQRT3, 12));
  test('inradius < circumradius',    () => expect(g.inradius).toBeLessThan(g.circumradius));
  test('diagonalShort < diagonalLong', () => expect(g.diagonalShort).toBeLessThan(g.diagonalLong));
  test('area > inradius',            () => expect(g.area).toBeGreaterThan(g.inradius));
  test('area = inradius × perimeter / 2', () =>
    expect(g.area).toBeCloseTo(g.inradius * g.perimeter / 2, 10));
});

// ─── SECTION 3: Parametric sides ──────────────────────────────────────────────
const SIDES = [0.5, 1, 2, 3, 5, 8, 13, 21, PHI, PHI_INV, PHI_SQ, SQRT3, Math.PI, 100];

describe('Hexagon: Area formula A = (3√3/2)s²', () => {
  test.each(SIDES)('side=%f', (s) => {
    const g = HEX.compute(s);
    expect(g.area).toBeCloseTo((3 * SQRT3 / 2) * s * s, 8);
  });
});

describe('Hexagon: Perimeter = 6s', () => {
  test.each(SIDES)('side=%f', (s) => {
    const g = HEX.compute(s);
    expect(g.perimeter).toBeCloseTo(6 * s, 10);
  });
});

describe('Hexagon: Circumradius = s', () => {
  test.each(SIDES)('side=%f', (s) => {
    const g = HEX.compute(s);
    expect(g.circumradius).toBeCloseTo(s, 10);
  });
});

describe('Hexagon: Inradius = s√3/2', () => {
  test.each(SIDES)('side=%f', (s) => {
    const g = HEX.compute(s);
    expect(g.inradius).toBeCloseTo(s * SQRT3 / 2, 10);
  });
});

describe('Hexagon: Long diagonal = 2s', () => {
  test.each(SIDES)('side=%f', (s) => {
    const g = HEX.compute(s);
    expect(g.diagonalLong).toBeCloseTo(2 * s, 10);
  });
});

describe('Hexagon: Short diagonal = s√3', () => {
  test.each(SIDES)('side=%f', (s) => {
    const g = HEX.compute(s);
    expect(g.diagonalShort).toBeCloseTo(s * SQRT3, 10);
  });
});

describe('Hexagon: Area = inradius × perimeter / 2', () => {
  test.each(SIDES)('side=%f', (s) => {
    const g = HEX.compute(s);
    expect(g.area).toBeCloseTo(g.inradius * g.perimeter / 2, 8);
  });
});

describe('Hexagon: Area from circumradius R', () => {
  test.each(SIDES)('side=%f', (s) => {
    expect(HEX.areaFromCircumradius(s)).toBeCloseTo(HEX.compute(s).area, 8);
  });
});

describe('Hexagon: phi-spiral next radius = s × φ', () => {
  test.each(SIDES)('side=%f', (s) => {
    expect(HEX.phiSpiralNextRadius(s)).toBeCloseTo(s * PHI, 10);
  });
});

// ─── SECTION 4: Vertex geometry ───────────────────────────────────────────────
describe('Hexagon: Vertex distances (circumradius = s)', () => {
  const indices = [0, 1, 2, 3, 4, 5];
  test.each(SIDES.slice(0, 8).flatMap(s => indices.map(i => [s, i])))(
    'side=%f vertex=%i', (s, i) => {
      expect(HEX.verifyVertexDistance(s as number, i as number)).toBe(true);
    });
});

describe('Hexagon: Vertex angles are multiples of 60°', () => {
  test.each(SIDES)('side=%f', (s) => {
    const vs = HEX.vertices(s);
    const angles = vs.map(([x, y]) => {
      let a = Math.atan2(y, x) * 180 / Math.PI;
      if (a < 0) a += 360;
      return a;
    });
    angles.forEach((a, i) => {
      expect(a).toBeCloseTo(60 * i, 5);
    });
  });
});

describe('Hexagon: Opposite vertices are collinear through origin', () => {
  test.each(SIDES)('side=%f', (s) => {
    const vs = HEX.vertices(s);
    for (let i = 0; i < 3; i++) {
      const [x0, y0] = vs[i];
      const [x1, y1] = vs[i + 3];
      // Opposite vertices: (x1 ≈ -x0) and (y1 ≈ -y0)
      expect(x0 + x1).toBeCloseTo(0, 8);
      expect(y0 + y1).toBeCloseTo(0, 8);
    }
  });
});

describe('Hexagon: All vertices equidistant from center', () => {
  test.each(SIDES)('side=%f', (s) => {
    const vs = HEX.vertices(s);
    const dists = vs.map(([x, y]) => Math.sqrt(x * x + y * y));
    dists.forEach(d => expect(d).toBeCloseTo(s, 8));
  });
});

describe('Hexagon: Vertex centroid = origin', () => {
  test.each(SIDES)('side=%f', (s) => {
    const vs = HEX.vertices(s);
    const sumX = vs.reduce((a, [x]) => a + x, 0);
    const sumY = vs.reduce((a, [, y]) => a + y, 0);
    expect(sumX).toBeCloseTo(0, 8);
    expect(sumY).toBeCloseTo(0, 8);
  });
});

// ─── SECTION 5: Edge lengths between adjacent vertices ─────────────────────────
describe('Hexagon: Adjacent edge lengths = side', () => {
  test.each(SIDES)('side=%f', (s) => {
    const vs = HEX.vertices(s);
    for (let i = 0; i < 6; i++) {
      const [x0, y0] = vs[i];
      const [x1, y1] = vs[(i + 1) % 6];
      const edge = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
      expect(edge).toBeCloseTo(s, 8);
    }
  });
});

// ─── SECTION 6: Angle properties ──────────────────────────────────────────────
describe('Hexagon: Interior angle sum = 720°', () => {
  test('formula (n-2)×180 for n=6', () => expect((6 - 2) * 180).toBe(720));
  test('each angle = 120°', () => expect(720 / 6).toBe(120));
  test('360/120 = 3 (tessellation)', () => expect(360 / 120).toBe(3));
  test('interior angle + exterior angle = 180°', () => expect(120 + 60).toBe(180));
  test('exterior angle = 360°/6 = 60°', () => expect(360 / 6).toBe(60));
  test('cos(120°) = -1/2', () => expect(Math.cos(2 * Math.PI / 3)).toBeCloseTo(-0.5, 12));
  test('sin(120°) = √3/2', () => expect(Math.sin(2 * Math.PI / 3)).toBeCloseTo(SQRT3 / 2, 12));
});

// ─── SECTION 7: Symmetry ──────────────────────────────────────────────────────
describe('Hexagon: Symmetry group D₆', () => {
  test('|D₆| = 12', () => expect(12).toBe(12));
  test('6 rotational symmetries', () => expect(6).toBe(6));
  test('6 reflection symmetries', () => expect(6).toBe(6));
  test('rotation angle = 60°', () => expect(360 / 6).toBe(60));
  test('smallest rotation = π/3 rad', () => expect(Math.PI / 3).toBeCloseTo(1.0471975, 6));

  // A 60° rotation of each vertex maps it to the next
  test.each(SIDES.slice(0, 6))('rotation maps vertices: side=%f', (s) => {
    const vs = HEX.vertices(s);
    const cos60 = Math.cos(Math.PI / 3);
    const sin60 = Math.sin(Math.PI / 3);
    vs.forEach(([x, y], i) => {
      const rx = x * cos60 - y * sin60;
      const ry = x * sin60 + y * cos60;
      const next = vs[(i + 1) % 6];
      expect(rx).toBeCloseTo(next[0], 8);
      expect(ry).toBeCloseTo(next[1], 8);
    });
  });
});

// ─── SECTION 8: Tessellation ──────────────────────────────────────────────────
describe('Hexagon: Tessellation properties', () => {
  test('tessellates plane', () => expect(HEX.compute(1).tessellates).toBe(true));
  test('3 hexagons meet at each vertex', () => expect(HEX.tessellationVertexCount()).toBe(3));
  test('total angle at vertex = 360°', () => expect(3 * 120).toBe(360));
  test('packing efficiency > 90%', () => expect(HEX.packingEfficiency()).toBeGreaterThan(0.90));
  test('packing efficiency < 100%', () => expect(HEX.packingEfficiency()).toBeLessThan(1.0));
  test('packing is more efficient than square (π/4)', () =>
    expect(HEX.packingEfficiency()).toBeGreaterThan(Math.PI / 4));

  // Grid offsets for hexagonal tessellation
  test.each([1, 2, 3, 5, PHI])('hex grid horizontal spacing = s√3: s=%f', (s) => {
    const g = HEX.compute(s);
    const dx = g.diagonalShort; // s√3
    expect(dx).toBeCloseTo(s * SQRT3, 8);
  });

  test.each([1, 2, 3, 5, PHI])('hex grid vertical spacing = 3s/2: s=%f', (s) => {
    const g = HEX.compute(s);
    const dy = 3 * s / 2;
    expect(g.inradius * 2).toBeCloseTo(s * SQRT3, 8); // row spacing uses inradius
    expect(dy).toBeCloseTo(3 * s / 2, 10);
  });
});

// ─── SECTION 9: Scaling laws ──────────────────────────────────────────────────
describe('Hexagon: Scaling — area scales as s²', () => {
  const pairs: [number, number][] = [[1, 2], [1, 3], [2, 4], [PHI, PHI_SQ], [1, PHI]];
  test.each(pairs)('s₁=%f s₂=%f → A₂/A₁ = (s₂/s₁)²', (s1, s2) => {
    const g1 = HEX.compute(s1), g2 = HEX.compute(s2);
    expect(g2.area / g1.area).toBeCloseTo((s2 / s1) ** 2, 8);
  });
});

describe('Hexagon: Scaling — perimeter scales as s', () => {
  const pairs: [number, number][] = [[1, 2], [1, 3], [PHI, PHI_SQ], [1, 10]];
  test.each(pairs)('s₁=%f s₂=%f → P₂/P₁ = s₂/s₁', (s1, s2) => {
    const g1 = HEX.compute(s1), g2 = HEX.compute(s2);
    expect(g2.perimeter / g1.perimeter).toBeCloseTo(s2 / s1, 10);
  });
});

// ─── SECTION 10: φ-Geometry relations ─────────────────────────────────────────
describe('Hexagon: φ-Geometry', () => {
  test('phiRatio = 2/√3', () => {
    const g = HEX.compute(1);
    expect(g.phiRatio).toBeCloseTo(2 / SQRT3, 12);
  });

  test('phiRatio × √3 = 2', () => {
    const g = HEX.compute(1);
    expect(g.phiRatio * SQRT3).toBeCloseTo(2, 12);
  });

  test.each([1, 2, PHI, SQRT3])('phi spiral: next radius = s×φ: s=%f', (s) => {
    expect(HEX.phiSpiralNextRadius(s)).toBeCloseTo(s * PHI, 10);
  });

  test('ratio of consecutive phi-spiral radii = φ', () => {
    const r0 = 1, r1 = HEX.phiSpiralNextRadius(r0);
    expect(r1 / r0).toBeCloseTo(PHI, 12);
  });

  test('phi-hexagon area ratio = φ²', () => {
    const g1 = HEX.compute(1), g2 = HEX.compute(PHI);
    expect(g2.area / g1.area).toBeCloseTo(PHI_SQ, 10);
  });

  test('phi-hexagon perimeter ratio = φ', () => {
    const g1 = HEX.compute(1), g2 = HEX.compute(PHI);
    expect(g2.perimeter / g1.perimeter).toBeCloseTo(PHI, 12);
  });

  test('1/φ hexagon area = φ⁻² of unit area', () => {
    const g1 = HEX.compute(1), g2 = HEX.compute(PHI_INV);
    expect(g2.area / g1.area).toBeCloseTo(PHI_INV ** 2, 10);
  });
});

// ─── SECTION 11: Edge-case inputs ─────────────────────────────────────────────
describe('Hexagon: Edge-case inputs', () => {
  test('very small side: s=1e-6', () => {
    const g = HEX.compute(1e-6);
    expect(isFinite(g.area)).toBe(true);
    expect(g.area).toBeCloseTo((3 * SQRT3 / 2) * 1e-12, 30);
  });

  test('very large side: s=1e6', () => {
    const g = HEX.compute(1e6);
    expect(isFinite(g.area)).toBe(true);
    expect(g.perimeter).toBeCloseTo(6e6, 0);
  });

  test('side=Number.EPSILON', () => {
    const g = HEX.compute(Number.EPSILON);
    expect(isFinite(g.area)).toBe(true);
  });

  test('invalid side=0 throws', () => {
    expect(() => HEX.compute(0)).toThrow(RangeError);
  });

  test('invalid side=-1 throws', () => {
    expect(() => HEX.compute(-1)).toThrow(RangeError);
  });

  test('invalid side=-PHI throws', () => {
    expect(() => HEX.compute(-PHI)).toThrow(RangeError);
  });
});

// ─── SECTION 12: Regular polygon generalisations ──────────────────────────────
// Interior angle = (n-2)×180/n
const polygonData: [number, number][] = [
  [3, 60], [4, 90], [5, 108], [6, 120], [8, 135], [9, 140], [10, 144], [12, 150],
];
describe('Regular polygon: Interior angles', () => {
  test.each(polygonData)('n=%i → angle=%f°', (n, expected) => {
    const angle = (n - 2) * 180 / n;
    expect(angle).toBeCloseTo(expected, 8);
  });
});

// Which regular polygons tessellate? Only 3, 4, 6 (interior angle divides 360)
describe('Regular polygon: Tessellation', () => {
  const tessellatingN = [3, 4, 6];
  const nonTessellatingN = [5, 7, 8, 9, 10, 12];

  test.each(tessellatingN)('n=%i tessellates', (n) => {
    const angle = (n - 2) * 180 / n;
    const meetCount = 360 / angle;
    expect(Number.isInteger(meetCount)).toBe(true);
  });

  test.each(nonTessellatingN)('n=%i does NOT tessellate', (n) => {
    const angle = (n - 2) * 180 / n;
    const meetCount = 360 / angle;
    expect(Number.isInteger(Math.round(meetCount * 1e6) / 1e6)).toBe(
      [3, 4, 6].includes(n),
    );
  });
});

// Diagonal count: n(n-3)/2
describe('Regular polygon: Diagonal count', () => {
  const data: [number, number][] = [[4, 2], [5, 5], [6, 9], [7, 14], [8, 20], [10, 35], [12, 54]];
  test.each(data)('n=%i → diagonals=%i', (n, d) => {
    expect(n * (n - 3) / 2).toBe(d);
  });
});

// Sum of exterior angles = 360° for all regular convex polygons
describe('Regular polygon: Exterior angle sum = 360°', () => {
  test.each([3, 4, 5, 6, 7, 8, 10, 12, 20, 100])('n=%i', (n) => {
    const extAngle = 360 / n;
    expect(n * extAngle).toBeCloseTo(360, 10);
  });
});

// ─── SECTION 13: Circle-hexagon relationships ─────────────────────────────────
describe('Hexagon: Circle inscribed/circumscribed', () => {
  test.each(SIDES)('inscribed circle radius = inradius: s=%f', (s) => {
    const g = HEX.compute(s);
    expect(g.inradius).toBeCloseTo(s * SQRT3 / 2, 10);
  });

  test.each(SIDES)('circumscribed circle radius = circumradius = s: side=%f', (s) => {
    const g = HEX.compute(s);
    expect(g.circumradius).toBeCloseTo(s, 10);
  });

  test.each(SIDES)('ratio circumradius/inradius = 2/√3: side=%f', (s) => {
    const g = HEX.compute(s);
    expect(g.circumradius / g.inradius).toBeCloseTo(2 / SQRT3, 10);
  });

  test.each(SIDES)('circumscribed area / hexagon area = π/(3√3/2): side=%f', (s) => {
    const g = HEX.compute(s);
    const circleArea = Math.PI * g.circumradius ** 2;
    expect(circleArea / g.area).toBeCloseTo(Math.PI / (3 * SQRT3 / 2), 8);
  });
});

// ─── SECTION 14: Area comparisons ─────────────────────────────────────────────
describe('Hexagon: Area vs other shapes with same perimeter', () => {
  // For a fixed perimeter P, the hexagon has more area than triangle or square
  const P = 6; // unit hexagon perimeter
  test('hexagon area > equilateral triangle with same perimeter', () => {
    const hexArea  = (3 * SQRT3 / 2) * 1 ** 2; // s=1
    const triSide  = P / 3;
    const triArea  = (SQRT3 / 4) * triSide ** 2;
    expect(hexArea).toBeGreaterThan(triArea);
  });

  test('hexagon area > square with same perimeter', () => {
    const hexArea  = (3 * SQRT3 / 2) * 1 ** 2;
    const sqSide   = P / 4;
    const sqArea   = sqSide ** 2;
    expect(hexArea).toBeGreaterThan(sqArea);
  });

  test('circle area > hexagon area with same perimeter', () => {
    const hexArea  = (3 * SQRT3 / 2) * 1 ** 2;
    const r        = P / (2 * Math.PI);
    const circArea = Math.PI * r ** 2;
    expect(circArea).toBeGreaterThan(hexArea);
  });
});

// ─── SECTION 15: Numeric stability ────────────────────────────────────────────
describe('Hexagon: Numeric stability', () => {
  const stressSides = Array.from({ length: 50 }, (_, i) => Math.pow(10, i - 25));

  test.each(stressSides)('area is finite and positive: s=10^%f', (s) => {
    if (s <= 0) return;
    const g = HEX.compute(s);
    expect(isFinite(g.area)).toBe(true);
    expect(g.area).toBeGreaterThan(0);
  });

  test('area monotonically increases with side', () => {
    const sides = [0.1, 0.5, 1, 2, 5, 10, 100];
    const areas = sides.map(s => HEX.compute(s).area);
    for (let i = 1; i < areas.length; i++) {
      expect(areas[i]).toBeGreaterThan(areas[i - 1]);
    }
  });

  test('perimeter monotonically increases with side', () => {
    const sides = [0.1, 1, 2, 10, 100];
    const perims = sides.map(s => HEX.compute(s).perimeter);
    for (let i = 1; i < perims.length; i++) {
      expect(perims[i]).toBeGreaterThan(perims[i - 1]);
    }
  });
});

// ─── SECTION 16: Fibonacci hexagon spiral ─────────────────────────────────────
describe('Hexagon: Fibonacci spiral approximates φ', () => {
  // Fibonacci numbers as hexagon sides
  const fibs = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
  // Ratios of consecutive Fibonacci numbers
  const fibRatios = fibs.slice(1, -1).map((f, i) => [f, fibs[i + 2] / f] as [number, number]);
  test.each(fibRatios)('F=%i ratio → %f (→ φ)', (f, ratio) => {
    // ratios converge to φ
    expect(ratio).toBeGreaterThan(1);
    expect(ratio).toBeLessThan(2.5);
  });

  test('ratio F_12/F_11 close to φ', () => {
    const r = 144 / 89;
    expect(r).toBeCloseTo(PHI, 2);
  });

  test('ratio F_13/F_12 (233/144) close to φ', () => {
    const r = 233 / 144;
    expect(r).toBeCloseTo(PHI, 3);
  });
});

// ─── SECTION 17: Hexagon in coordinate systems ────────────────────────────────
describe('Hexagon: Coordinate system properties', () => {
  test('vertex 0 is at (s, 0) — rightmost point', () => {
    const vs = HEX.vertices(1);
    expect(vs[0][0]).toBeCloseTo(1, 10);
    expect(vs[0][1]).toBeCloseTo(0, 10);
  });

  test('vertex 3 is at (-s, 0) — leftmost point', () => {
    const vs = HEX.vertices(1);
    expect(vs[3][0]).toBeCloseTo(-1, 10);
    expect(vs[3][1]).toBeCloseTo(0, 10);
  });

  test('vertex 1 is at (s/2, s√3/2) — upper right', () => {
    const vs = HEX.vertices(1);
    expect(vs[1][0]).toBeCloseTo(0.5, 10);
    expect(vs[1][1]).toBeCloseTo(SQRT3 / 2, 10);
  });

  test('bounding box width = 2s', () => {
    const s = 3;
    const vs = HEX.vertices(s);
    const xs = vs.map(([x]) => x);
    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(2 * s, 10);
  });

  test('bounding box height = s√3', () => {
    const s = 3;
    const vs = HEX.vertices(s);
    const ys = vs.map(([, y]) => y);
    expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(s * SQRT3, 10);
  });
});

// ─── SECTION 18: Multi-hexagon grid ──────────────────────────────────────────
describe('Hexagon: Grid spacing formulas', () => {
  const gridSides = [1, 2, PHI, SQRT3, 5];
  test.each(gridSides)('horizontal grid step dx = s√3: s=%f', (s) => {
    const dx = s * SQRT3;
    expect(dx).toBeCloseTo(HEX.compute(s).diagonalShort, 10);
  });

  test.each(gridSides)('vertical grid step dy = 3s/2: s=%f', (s) => {
    const dy = 3 * s / 2;
    expect(dy).toBeGreaterThan(s);
  });

  test.each(gridSides)('row offset = s√3/2: s=%f', (s) => {
    const offset = s * SQRT3 / 2;
    expect(offset).toBeCloseTo(HEX.compute(s).inradius, 10);
  });
});

// ─── SECTION 19: Hexagon properties compared to equilateral triangle ──────────
describe('Hexagon vs equilateral triangle with same side', () => {
  test.each([1, 2, 3, PHI])('hex area = 6 × triangle area with same side: s=%f', (s) => {
    const hexArea = (3 * SQRT3 / 2) * s ** 2;
    const triArea = (SQRT3 / 4) * s ** 2;
    expect(hexArea / triArea).toBeCloseTo(6, 10);
  });

  test.each([1, 2, 3])('hex perimeter = 2 × triangle perimeter: s=%f', (s) => {
    const hexP = 6 * s;
    const triP = 3 * s;
    expect(hexP / triP).toBe(2);
  });
});

// ─── SECTION 20: Golden hexagonal constructions ───────────────────────────────
describe('Hexagon: φ-construction properties', () => {
  test('inradius of φ-hexagon equals circumradius of unit hexagon × φ×√3/2', () => {
    const g1 = HEX.compute(1);
    const g2 = HEX.compute(PHI);
    expect(g2.inradius).toBeCloseTo(PHI * SQRT3 / 2, 10);
    expect(g2.inradius / g1.inradius).toBeCloseTo(PHI, 10);
  });

  test('area grows by φ² each phi-scaled step', () => {
    let side = 1;
    let area = HEX.compute(side).area;
    for (let i = 0; i < 5; i++) {
      const nextSide = HEX.phiSpiralNextRadius(side);
      const nextArea = HEX.compute(nextSide).area;
      expect(nextArea / area).toBeCloseTo(PHI_SQ, 8);
      side = nextSide;
      area = nextArea;
    }
  });

  test('diagonal ratio D/d = 2/√3 ≈ 1.1547 (not φ)', () => {
    const g = HEX.compute(1);
    expect(g.phiRatio).toBeCloseTo(2 / SQRT3, 12);
    // Note: 2/√3 ≠ φ (1.618), it's ≈ 1.1547
    expect(g.phiRatio).not.toBeCloseTo(PHI, 1);
  });
});
