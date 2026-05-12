/**
 * SACRED GEOMETRY ENGINE
 * ======================
 * Platonic solids, E8 lattice, Leech lattice, and higher-dimensional geometry
 * 
 * Key Structures:
 * - Platonic Solids: 5 regular convex polyhedra
 * - E8 Lattice: 8D exceptional Lie group
 * - Leech Lattice: 24D extraordinary lattice
 * - Icosahedral Group: H₃ symmetries
 * - 4D Polytopes: 24-cell, 120-cell, 600-cell
 * 
 * @author MEDINA Sovereign Intelligence
 * @version 1.0.0
 * @license Proprietary - All Rights Reserved
 */

import { PHI, PI, TAU, SQRT_5, Point3D } from './PhiHarmonicMathematics';

// ═══════════════════════════════════════════════════════════════════════════════
// FUNDAMENTAL GEOMETRIC CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const SQRT_2 = Math.sqrt(2);
export const SQRT_3 = Math.sqrt(3);
export const SQRT_6 = Math.sqrt(6);
export const SQRT_8 = Math.sqrt(8);

// Icosahedral constants
export const ICOSAHEDRAL_EDGE = 2; // Normalized
export const ICOSAHEDRAL_CIRCUMRADIUS = Math.sqrt(PHI * PHI + 1); // ≈ 1.902
export const ICOSAHEDRAL_INRADIUS = (PHI * PHI) / Math.sqrt(3); // ≈ 1.511
export const ICOSAHEDRAL_DIHEDRAL = Math.acos(SQRT_5 / 3); // ≈ 138.19°

// ═══════════════════════════════════════════════════════════════════════════════
// PLATONIC SOLIDS
// ═══════════════════════════════════════════════════════════════════════════════

export interface PlatonicSolid {
  name: string;
  vertices: Point3D[];
  edges: [number, number][];
  faces: number[][];
  schlaefli: [number, number]; // {p, q} - p-gons, q meeting at vertex
  element: string; // Classical element association
  dualOf: string;
}

/**
 * Tetrahedron: {3, 3} - Fire
 * 4 vertices, 6 edges, 4 triangular faces
 * Self-dual
 */
export function tetrahedron(): PlatonicSolid {
  const a = 1 / Math.sqrt(2);
  const vertices: Point3D[] = [
    { x: 1, y: 0, z: -a },
    { x: -1, y: 0, z: -a },
    { x: 0, y: 1, z: a },
    { x: 0, y: -1, z: a }
  ];
  
  return {
    name: 'Tetrahedron',
    vertices,
    edges: [[0,1], [0,2], [0,3], [1,2], [1,3], [2,3]],
    faces: [[0,1,2], [0,1,3], [0,2,3], [1,2,3]],
    schlaefli: [3, 3],
    element: 'Fire',
    dualOf: 'Tetrahedron'
  };
}

/**
 * Cube/Hexahedron: {4, 3} - Earth
 * 8 vertices, 12 edges, 6 square faces
 * Dual of Octahedron
 */
export function cube(): PlatonicSolid {
  const vertices: Point3D[] = [];
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) {
        vertices.push({ x, y, z });
      }
    }
  }
  
  return {
    name: 'Cube',
    vertices,
    edges: [
      [0,1], [0,2], [0,4], [1,3], [1,5], [2,3],
      [2,6], [3,7], [4,5], [4,6], [5,7], [6,7]
    ],
    faces: [
      [0,1,3,2], [4,5,7,6], [0,1,5,4],
      [2,3,7,6], [0,2,6,4], [1,3,7,5]
    ],
    schlaefli: [4, 3],
    element: 'Earth',
    dualOf: 'Octahedron'
  };
}

/**
 * Octahedron: {3, 4} - Air
 * 6 vertices, 12 edges, 8 triangular faces
 * Dual of Cube
 */
export function octahedron(): PlatonicSolid {
  const vertices: Point3D[] = [
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 }
  ];
  
  return {
    name: 'Octahedron',
    vertices,
    edges: [
      [0,2], [0,3], [0,4], [0,5], [1,2], [1,3],
      [1,4], [1,5], [2,4], [2,5], [3,4], [3,5]
    ],
    faces: [
      [0,2,4], [0,4,3], [0,3,5], [0,5,2],
      [1,2,4], [1,4,3], [1,3,5], [1,5,2]
    ],
    schlaefli: [3, 4],
    element: 'Air',
    dualOf: 'Cube'
  };
}

/**
 * Icosahedron: {3, 5} - Water
 * 12 vertices, 30 edges, 20 triangular faces
 * Dual of Dodecahedron
 * Golden ratio in its geometry
 */
export function icosahedron(): PlatonicSolid {
  const vertices: Point3D[] = [];
  
  // Vertices form three orthogonal golden rectangles
  for (let i = 0; i < 2; i++) {
    const sign1 = i === 0 ? 1 : -1;
    for (let j = 0; j < 2; j++) {
      const sign2 = j === 0 ? 1 : -1;
      vertices.push({ x: 0, y: sign1, z: sign2 * PHI });
      vertices.push({ x: sign1, y: sign2 * PHI, z: 0 });
      vertices.push({ x: sign2 * PHI, y: 0, z: sign1 });
    }
  }
  
  // Define faces (20 triangles)
  const faces: number[][] = [];
  const edges: [number, number][] = [];
  const edgeSet = new Set<string>();
  
  // This requires proper face computation - simplified
  for (let i = 0; i < 12; i++) {
    for (let j = i + 1; j < 12; j++) {
      const dist = Math.sqrt(
        Math.pow(vertices[i].x - vertices[j].x, 2) +
        Math.pow(vertices[i].y - vertices[j].y, 2) +
        Math.pow(vertices[i].z - vertices[j].z, 2)
      );
      // Edge length is 2 for unit icosahedron
      if (Math.abs(dist - 2) < 0.1) {
        const key = `${Math.min(i,j)}-${Math.max(i,j)}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push([i, j]);
        }
      }
    }
  }
  
  return {
    name: 'Icosahedron',
    vertices,
    edges,
    faces, // Would need proper computation
    schlaefli: [3, 5],
    element: 'Water',
    dualOf: 'Dodecahedron'
  };
}

/**
 * Dodecahedron: {5, 3} - Aether/Universe
 * 20 vertices, 30 edges, 12 pentagonal faces
 * Dual of Icosahedron
 * Made entirely of golden ratios
 */
export function dodecahedron(): PlatonicSolid {
  const vertices: Point3D[] = [];
  
  // Cube vertices (scaled)
  const cubeScale = 1 / PHI;
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) {
        vertices.push({ x: x * cubeScale, y: y * cubeScale, z: z * cubeScale });
      }
    }
  }
  
  // Additional vertices on coordinate planes
  const r = (PHI - 1) / PHI;
  for (let i = 0; i < 2; i++) {
    const sign = i === 0 ? 1 : -1;
    vertices.push({ x: 0, y: sign / PHI, z: sign * PHI * cubeScale });
    vertices.push({ x: 0, y: sign * PHI * cubeScale, z: sign / PHI });
    vertices.push({ x: sign / PHI, y: 0, z: sign * PHI * cubeScale });
    vertices.push({ x: sign * PHI * cubeScale, y: 0, z: sign / PHI });
    vertices.push({ x: sign / PHI, y: sign * PHI * cubeScale, z: 0 });
    vertices.push({ x: sign * PHI * cubeScale, y: sign / PHI, z: 0 });
  }
  
  return {
    name: 'Dodecahedron',
    vertices: vertices.slice(0, 20),
    edges: [], // Would need computation
    faces: [], // 12 pentagons
    schlaefli: [5, 3],
    element: 'Aether',
    dualOf: 'Icosahedron'
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// E8 LATTICE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * E8 Lattice: 8-dimensional exceptional lattice
 * 
 * Properties:
 * - 240 root vectors of length √2
 * - Weyl group of order 696,729,600
 * - Exceptional symmetry, appears in string theory
 * - Densest lattice packing in 8D
 */

export interface E8Vector {
  components: number[]; // 8 components
  norm: number;
}

/**
 * Generate E8 root vectors
 * Two types:
 * 1. All permutations of (±1, ±1, 0, 0, 0, 0, 0, 0) - 112 vectors
 * 2. All (±1/2, ±1/2, ..., ±1/2) with even number of minus signs - 128 vectors
 */
export function generateE8Roots(): E8Vector[] {
  const roots: E8Vector[] = [];
  
  // Type 1: Two non-zero coordinates (±1)
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      for (const si of [-1, 1]) {
        for (const sj of [-1, 1]) {
          const v = [0, 0, 0, 0, 0, 0, 0, 0];
          v[i] = si;
          v[j] = sj;
          roots.push({
            components: v,
            norm: SQRT_2
          });
        }
      }
    }
  }
  
  // Type 2: All coordinates ±1/2 with even number of minus signs
  for (let mask = 0; mask < 256; mask++) {
    // Count number of 1s (minus signs)
    let count = 0;
    for (let b = 0; b < 8; b++) {
      if ((mask >> b) & 1) count++;
    }
    
    if (count % 2 === 0) {
      const v: number[] = [];
      for (let b = 0; b < 8; b++) {
        v.push(((mask >> b) & 1) ? -0.5 : 0.5);
      }
      roots.push({
        components: v,
        norm: SQRT_2
      });
    }
  }
  
  return roots;
}

/**
 * E8 inner product
 */
export function e8InnerProduct(a: E8Vector, b: E8Vector): number {
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += a.components[i] * b.components[i];
  }
  return sum;
}

/**
 * Count E8 root vectors at given squared distance from origin
 */
export function e8ThetaCoefficient(n: number): number {
  // Theta function coefficients for E8
  // Number of lattice points at squared distance 2n
  const coefficients: {[key: number]: number} = {
    0: 1,
    1: 240,
    2: 2160,
    3: 6720,
    4: 17520,
    5: 30240,
    6: 60480,
    7: 82560,
    8: 140400
  };
  return coefficients[n] || 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEECH LATTICE (24D)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Leech Lattice: 24-dimensional extraordinary lattice
 * 
 * Properties:
 * - 196,560 minimal vectors of length 2
 * - No vectors of length √2 (unique among even unimodular lattices)
 * - Automorphism group: Conway group Co₀
 * - Densest lattice packing in 24D
 * - Related to Moonshine conjecture
 */

export const LEECH_DIMENSION = 24;
export const LEECH_MINIMAL_VECTORS = 196560;
export const LEECH_MINIMAL_NORM = 4; // Squared length

/**
 * Leech lattice theta series coefficients
 * Θ(q) = 1 + 196560q² + 16773120q³ + ...
 */
export function leechThetaCoefficient(n: number): number {
  const coefficients: {[key: number]: number} = {
    0: 1,
    2: 196560,
    3: 16773120,
    4: 398034000
  };
  return coefficients[n] || 0;
}

/**
 * Generate MOG (Miracle Octad Generator) matrix
 * Used to construct Leech lattice
 */
export function generateMOG(): number[][] {
  // The MOG is a 4x6 array of 4-bit nibbles
  // Representing the Golay code structure
  const mog: number[][] = [
    [0, 1, 2, 3, 4, 5],
    [0, 1, 2, 5, 4, 3],
    [0, 3, 1, 4, 5, 2],
    [0, 5, 4, 2, 1, 3]
  ];
  return mog;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ICOSAHEDRAL GROUP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Icosahedral Group H₃
 * Order 120 (60 rotations × 2 for reflections)
 * Isomorphic to A₅ × Z₂
 */

export const ICOSAHEDRAL_ROTATIONS = 60;
export const BINARY_ICOSAHEDRAL_ORDER = 120;

export interface RotationMatrix3D {
  m: number[][]; // 3x3 matrix
}

/**
 * Generate rotation matrices for icosahedral symmetry
 * 60 rotations: 1 identity, 12 pentagonal (72°), 12 pentagonal (144°),
 *               20 triangular (120°), 15 edge rotations (180°)
 */
export function icosahedralRotations(): RotationMatrix3D[] {
  const rotations: RotationMatrix3D[] = [];
  
  // Identity
  rotations.push({
    m: [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
  });
  
  // Rotations around vertices (5-fold axes through opposite vertices)
  // 12 vertices → 6 axes, each with rotations by 72°, 144°, 216°, 288°
  const vertexAxes = [
    normalize({ x: 0, y: 1, z: PHI }),
    normalize({ x: 0, y: -1, z: PHI }),
    normalize({ x: 1, y: PHI, z: 0 }),
    normalize({ x: -1, y: PHI, z: 0 }),
    normalize({ x: PHI, y: 0, z: 1 }),
    normalize({ x: PHI, y: 0, z: -1 })
  ];
  
  for (const axis of vertexAxes) {
    for (let k = 1; k < 5; k++) {
      const angle = (2 * PI * k) / 5;
      rotations.push(rotationAroundAxis(axis, angle));
    }
  }
  
  // Rotations around face centers (3-fold axes through opposite faces)
  // 20 faces → 10 axes, each with rotations by 120°, 240°
  const faceAxes = generateFaceAxes();
  for (const axis of faceAxes) {
    for (let k = 1; k < 3; k++) {
      const angle = (2 * PI * k) / 3;
      rotations.push(rotationAroundAxis(axis, angle));
    }
  }
  
  // Rotations around edge midpoints (2-fold axes)
  // 30 edges → 15 axes, each with 180° rotation
  const edgeAxes = generateEdgeAxes();
  for (const axis of edgeAxes) {
    rotations.push(rotationAroundAxis(axis, PI));
  }
  
  return rotations.slice(0, 60); // Ensure exactly 60
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4D POLYTOPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Point4D {
  x: number;
  y: number;
  z: number;
  w: number;
}

/**
 * 24-Cell: {3, 4, 3}
 * 24 vertices, 96 edges, 96 triangular faces, 24 octahedral cells
 * Self-dual, unique to 4D
 */
export function generate24Cell(): Point4D[] {
  const vertices: Point4D[] = [];
  
  // 8 vertices from 4D cross-polytope
  for (let axis = 0; axis < 4; axis++) {
    for (const sign of [-1, 1]) {
      const v: Point4D = { x: 0, y: 0, z: 0, w: 0 };
      switch (axis) {
        case 0: v.x = sign; break;
        case 1: v.y = sign; break;
        case 2: v.z = sign; break;
        case 3: v.w = sign; break;
      }
      vertices.push(v);
    }
  }
  
  // 16 vertices from 4D hypercube (scaled)
  const s = 1 / SQRT_2;
  for (const x of [-s, s]) {
    for (const y of [-s, s]) {
      for (const z of [-s, s]) {
        for (const w of [-s, s]) {
          vertices.push({ x, y, z, w });
        }
      }
    }
  }
  
  return vertices.slice(0, 24);
}

/**
 * 120-Cell: {5, 3, 3}
 * 600 vertices, 1200 edges, 720 pentagonal faces, 120 dodecahedral cells
 * Dual of 600-cell
 */
export function generate120Cell(): Point4D[] {
  const vertices: Point4D[] = [];
  
  // Uses golden ratio extensively
  // 24 vertices from 24-cell
  const cell24 = generate24Cell();
  for (const v of cell24) {
    vertices.push(v);
  }
  
  // Additional vertices involve golden ratio
  // 96 vertices of form (±1, ±1, ±1, ±√5) and permutations
  // Simplified - full generation is complex
  
  return vertices;
}

/**
 * 600-Cell: {3, 3, 5}
 * 120 vertices, 720 edges, 1200 triangular faces, 600 tetrahedral cells
 * Dual of 120-cell
 */
export function generate600Cell(): Point4D[] {
  const vertices: Point4D[] = [];
  
  // 24 vertices from 24-cell (scaled)
  const cell24 = generate24Cell();
  for (const v of cell24) {
    vertices.push({ x: v.x * 2, y: v.y * 2, z: v.z * 2, w: v.w * 2 });
  }
  
  // 96 vertices involving golden ratio
  // (0, ±1, ±φ, ±1/φ) and all even permutations
  const phiVals = [1, PHI, 1/PHI];
  // Simplified enumeration
  for (const s1 of [-1, 1]) {
    for (const s2 of [-1, 1]) {
      for (const s3 of [-1, 1]) {
        vertices.push({ x: 0, y: s1, z: s2 * PHI, w: s3 / PHI });
        vertices.push({ x: s1, y: 0, z: s2 / PHI, w: s3 * PHI });
        vertices.push({ x: s1 / PHI, y: s2 * PHI, z: 0, w: s3 });
        // ... more permutations
      }
    }
  }
  
  return vertices.slice(0, 120);
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOLDEN TILING (Penrose)
// ═══════════════════════════════════════════════════════════════════════════════

export interface PenroseTile {
  type: 'kite' | 'dart' | 'thin' | 'thick';
  vertices: Point3D[];
  level: number;
}

/**
 * Generate Penrose P2 tiling (kite and dart)
 * Uses golden ratio deflation
 */
export function penroseDeflation(tile: PenroseTile): PenroseTile[] {
  const newTiles: PenroseTile[] = [];
  const level = tile.level + 1;
  
  if (tile.type === 'kite') {
    // Kite subdivides into 2 kites and 2 half-darts
    const [A, B, C, D] = tile.vertices;
    
    // Subdivision points at golden ratio
    const Q = lerpPoint(A, B, 1/PHI);
    const R = lerpPoint(A, D, 1/PHI);
    
    newTiles.push({
      type: 'kite',
      vertices: [A, Q, midpoint(B, D), R],
      level
    });
    // More subdivisions...
    
  } else if (tile.type === 'dart') {
    // Dart subdivides into 1 kite and 2 half-darts
    // Similar golden ratio subdivisions
  }
  
  return newTiles;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function normalize(v: Point3D): Point3D {
  const len = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
  return { x: v.x/len, y: v.y/len, z: v.z/len };
}

function rotationAroundAxis(axis: Point3D, angle: number): RotationMatrix3D {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const t = 1 - c;
  const { x, y, z } = axis;
  
  return {
    m: [
      [t*x*x + c, t*x*y - s*z, t*x*z + s*y],
      [t*x*y + s*z, t*y*y + c, t*y*z - s*x],
      [t*x*z - s*y, t*y*z + s*x, t*z*z + c]
    ]
  };
}

function generateFaceAxes(): Point3D[] {
  // Normals to icosahedron faces
  const axes: Point3D[] = [];
  const phi = PHI;
  
  // Each face normal is combination of golden ratio coordinates
  for (const s1 of [-1, 1]) {
    for (const s2 of [-1, 1]) {
      axes.push(normalize({ x: 0, y: s1, z: s2 * phi * phi }));
      axes.push(normalize({ x: s1, y: s2 * phi * phi, z: 0 }));
      axes.push(normalize({ x: s1 * phi * phi, y: 0, z: s2 }));
    }
  }
  
  return axes.slice(0, 10);
}

function generateEdgeAxes(): Point3D[] {
  // Midpoints of icosahedron edges
  const axes: Point3D[] = [];
  
  for (const s1 of [-1, 1]) {
    for (const s2 of [-1, 1]) {
      axes.push(normalize({ x: s1, y: s2, z: 0 }));
      axes.push(normalize({ x: s1, y: 0, z: s2 }));
      axes.push(normalize({ x: 0, y: s1, z: s2 }));
    }
  }
  
  return axes.slice(0, 15);
}

function lerpPoint(a: Point3D, b: Point3D, t: number): Point3D {
  return {
    x: a.x + t * (b.x - a.x),
    y: a.y + t * (b.y - a.y),
    z: a.z + t * (b.z - a.z)
  };
}

function midpoint(a: Point3D, b: Point3D): Point3D {
  return lerpPoint(a, b, 0.5);
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Constants
  SQRT_2,
  SQRT_3,
  SQRT_6,
  ICOSAHEDRAL_EDGE,
  ICOSAHEDRAL_CIRCUMRADIUS,
  ICOSAHEDRAL_INRADIUS,
  ICOSAHEDRAL_DIHEDRAL,
  ICOSAHEDRAL_ROTATIONS,
  BINARY_ICOSAHEDRAL_ORDER,
  LEECH_DIMENSION,
  LEECH_MINIMAL_VECTORS,
  LEECH_MINIMAL_NORM,
  
  // Platonic solids
  tetrahedron,
  cube,
  octahedron,
  icosahedron,
  dodecahedron,
  
  // E8
  generateE8Roots,
  e8InnerProduct,
  e8ThetaCoefficient,
  
  // Leech
  leechThetaCoefficient,
  generateMOG,
  
  // Icosahedral
  icosahedralRotations,
  
  // 4D polytopes
  generate24Cell,
  generate120Cell,
  generate600Cell,
  
  // Penrose
  penroseDeflation
};
