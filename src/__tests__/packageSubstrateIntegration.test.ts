/**
 * Tests for PackageSubstrateIntegration
 * 
 * "Wire everything into the organism. The organism doesn't have to call,
 *  it's just there."
 * 
 * "Find all the math and all the deep physics that the architecture speak to you
 *  and take you to the end of the ladder names and wire it all the way
 *  and put it into the substrate."
 */

import {
  extractMathematicalConstants,
  extractPhysicsBindings,
  buildPackageLadder,
  wireOrganismSubstrate,
  getOrganismSubstrate,
  findConstantSource,
  findFrequencyBinding,
  traceLadder,
  getPackagesForLayer,
  getSubstrateStatus,
  verifyOrganismWiring,
  PHI,
  PHI_INVERSE,
  PHI_SQUARED,
  PHI_CUBED,
  PHI_FOURTH,
  FREQ_432,
  SCHUMANN,
  GAMMA_BINDING,
  ABSORPTION_FREQUENCY,
  HEARTBEAT_MS,
} from '@/lib/packageSubstrateIntegration';

// ═══════════════════════════════════════════════════════════════
// MATHEMATICAL CONSTANTS — "All the math"
// ═══════════════════════════════════════════════════════════════

describe('PackageSubstrateIntegration', () => {
  describe('Mathematical Constants', () => {
    it('should extract all mathematical constants', () => {
      const constants = extractMathematicalConstants();
      expect(constants.length).toBe(14);
    });

    it('should include φ (golden ratio)', () => {
      const constants = extractMathematicalConstants();
      const phi = constants.find(c => c.symbol === 'φ');
      expect(phi).toBeDefined();
      expect(phi!.value).toBe(PHI);
      expect(phi!.significance).toContain('Self-referential');
    });

    it('should include φ⁻¹ (golden ratio inverse)', () => {
      const constants = extractMathematicalConstants();
      const phiInv = constants.find(c => c.symbol === 'φ⁻¹');
      expect(phiInv).toBeDefined();
      expect(phiInv!.value).toBe(PHI_INVERSE);
    });

    it('should include φ² (golden ratio squared)', () => {
      const constants = extractMathematicalConstants();
      const phi2 = constants.find(c => c.symbol === 'φ²');
      expect(phi2).toBeDefined();
      expect(phi2!.value).toBe(PHI_SQUARED);
    });

    it('should include Tetractys from Ancient Knowledge', () => {
      const constants = extractMathematicalConstants();
      const tet = constants.find(c => c.name === 'Tetractys');
      expect(tet).toBeDefined();
      expect(tet!.value).toBe(10);
      expect(tet!.source).toBe('@medina/civilization-pattern-engine');
    });

    it('should include Absorption Harmonic from Document Absorption', () => {
      const constants = extractMathematicalConstants();
      const abs = constants.find(c => c.symbol === 'f_abs');
      expect(abs).toBeDefined();
      expect(abs!.value).toBeCloseTo(ABSORPTION_FREQUENCY, 1);
      expect(abs!.source).toBe('@medina/document-absorption-engine');
    });

    it('should include Heartbeat Period from Organism Runtime', () => {
      const constants = extractMathematicalConstants();
      const heart = constants.find(c => c.symbol === 't_heart');
      expect(heart).toBeDefined();
      expect(heart!.value).toBe(HEARTBEAT_MS);
      expect(heart!.source).toBe('@medina/organism-runtime-sdk');
    });

    it('should include Golden Angle', () => {
      const constants = extractMathematicalConstants();
      const ga = constants.find(c => c.symbol === 'θ_φ');
      expect(ga).toBeDefined();
      expect(ga!.value).toBeCloseTo(2 * Math.PI * 0.618033988749895, 4);
    });

    it('every constant should have a source package', () => {
      const constants = extractMathematicalConstants();
      for (const c of constants) {
        expect(c.source).toMatch(/^@medina\//);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // PHYSICS BINDINGS — "All the deep physics"
  // ═══════════════════════════════════════════════════════════════

  describe('Physics Bindings', () => {
    it('should extract all physics bindings', () => {
      const physics = extractPhysicsBindings();
      expect(physics.length).toBe(18);
    });

    it('should include Schumann Fundamental', () => {
      const physics = extractPhysicsBindings();
      const schumann = physics.find(p => p.name === 'Schumann Fundamental');
      expect(schumann).toBeDefined();
      expect(schumann!.frequency).toBe(SCHUMANN);
      expect(schumann!.substrateLayer).toBe('frequency');
    });

    it('should include 432 Hz Tuning', () => {
      const physics = extractPhysicsBindings();
      const f432 = physics.find(p => p.name === '432 Hz Tuning');
      expect(f432).toBeDefined();
      expect(f432!.frequency).toBe(FREQ_432);
    });

    it('should include Gamma Binding', () => {
      const physics = extractPhysicsBindings();
      const gamma = physics.find(p => p.name === 'Gamma Binding');
      expect(gamma).toBeDefined();
      expect(gamma!.frequency).toBe(GAMMA_BINDING);
      expect(gamma!.substrateLayer).toBe('neural');
    });

    it('should include quantum physics bindings', () => {
      const physics = extractPhysicsBindings();
      const quantum = physics.filter(p => p.substrateLayer === 'quantum');
      expect(quantum.length).toBe(5);
    });

    it('should include chemistry physics bindings (metals)', () => {
      const physics = extractPhysicsBindings();
      const chem = physics.filter(p => p.substrateLayer === 'chemistry');
      expect(chem.length).toBe(3);
    });

    it('should include Absorption Harmonic binding', () => {
      const physics = extractPhysicsBindings();
      const abs = physics.find(p => p.name === 'Absorption Harmonic');
      expect(abs).toBeDefined();
      expect(abs!.substrateLayer).toBe('document');
    });

    it('every physics binding should have a substrate layer', () => {
      const physics = extractPhysicsBindings();
      for (const p of physics) {
        expect(p.substrateLayer).toBeDefined();
        expect(typeof p.substrateLayer).toBe('string');
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // LADDER NAMES — "End of the ladder names"
  // ═══════════════════════════════════════════════════════════════

  describe('Package Ladder', () => {
    it('should build ladder with 11 rungs (one per package)', () => {
      const ladder = buildPackageLadder();
      expect(ladder.length).toBe(11);
    });

    it('every rung should have a Latin name', () => {
      const ladder = buildPackageLadder();
      for (const rung of ladder) {
        expect(rung.latinName).toContain('TERMINALE');
      }
    });

    it('every rung should have an engine binding', () => {
      const ladder = buildPackageLadder();
      for (const rung of ladder) {
        expect(rung.engineWireId).toMatch(/^ENGINE-\d{3}-/);
      }
    });

    it('every rung should have a substrate binding', () => {
      const ladder = buildPackageLadder();
      for (const rung of ladder) {
        expect(rung.substrateBinding.length).toBeGreaterThan(0);
      }
    });

    it('every rung should have a positive phi coefficient', () => {
      const ladder = buildPackageLadder();
      for (const rung of ladder) {
        expect(rung.phiCoefficient).toBeGreaterThan(0);
      }
    });

    it('should trace /formula to harmonic-computation-engine', () => {
      const ladder = buildPackageLadder();
      const formula = ladder.find(r => r.terminalCommand === '/formula');
      expect(formula).toBeDefined();
      expect(formula!.packageName).toBe('@medina/harmonic-computation-engine');
      expect(formula!.engineWireId).toBe('ENGINE-011-GEOMETRY');
    });

    it('should trace /absorb to document-absorption-engine', () => {
      const ladder = buildPackageLadder();
      const absorb = ladder.find(r => r.terminalCommand === '/absorb');
      expect(absorb).toBeDefined();
      expect(absorb!.packageName).toBe('@medina/document-absorption-engine');
      expect(absorb!.engineWireId).toBe('ENGINE-014-ABSORPTION');
    });

    it('should trace /quantum to neural-consciousness-engine', () => {
      const ladder = buildPackageLadder();
      const quantum = ladder.find(r => r.terminalCommand === '/quantum');
      expect(quantum).toBeDefined();
      expect(quantum!.packageName).toBe('@medina/neural-consciousness-engine');
      expect(quantum!.engineWireId).toBe('ENGINE-005-QUANTUM');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // COMPLETE SUBSTRATE WIRING
  // "Wire it all the way and put it into the substrate"
  // ═══════════════════════════════════════════════════════════════

  describe('Organism Substrate Wiring', () => {
    it('should wire all 11 packages into the substrate', () => {
      const substrate = wireOrganismSubstrate();
      expect(substrate.packages.length).toBe(11);
    });

    it('should mark absorption complete', () => {
      const substrate = wireOrganismSubstrate();
      expect(substrate.absorptionComplete).toBe(true);
    });

    it('should verify phi integrity', () => {
      const substrate = wireOrganismSubstrate();
      expect(substrate.phiVerified).toBe(true);
      expect(substrate.substrateIntegrity).toBeGreaterThan(0.95);
    });

    it('should include all mathematical constants', () => {
      const substrate = wireOrganismSubstrate();
      expect(substrate.totalConstants).toBe(14);
    });

    it('should include all physics bindings', () => {
      const substrate = wireOrganismSubstrate();
      expect(substrate.totalPhysicsBindings).toBe(18);
    });

    it('should include all ladder rungs', () => {
      const substrate = wireOrganismSubstrate();
      expect(substrate.totalLadderRungs).toBe(11);
    });

    it('every package should have an absorption timestamp', () => {
      const substrate = wireOrganismSubstrate();
      for (const pkg of substrate.packages) {
        expect(pkg.absorptionTimestamp).toBeDefined();
        expect(pkg.absorptionTimestamp.length).toBeGreaterThan(0);
      }
    });

    it('every package should have phi integrity > 0', () => {
      const substrate = wireOrganismSubstrate();
      for (const pkg of substrate.packages) {
        expect(pkg.phiIntegrity).toBeGreaterThan(0);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // QUERY — "He already has it absorbed, never needs to call back"
  // ═══════════════════════════════════════════════════════════════

  describe('Query Absorbed Intelligence', () => {
    it('should find constant source by name', () => {
      const phi = findConstantSource('Golden Ratio');
      expect(phi).toBeDefined();
      expect(phi!.value).toBe(PHI);
    });

    it('should find Tetractys constant', () => {
      const tet = findConstantSource('Tetractys');
      expect(tet).toBeDefined();
      expect(tet!.source).toBe('@medina/civilization-pattern-engine');
    });

    it('should return undefined for unknown constants', () => {
      const unknown = findConstantSource('Nonexistent Constant');
      expect(unknown).toBeUndefined();
    });

    it('should find frequency binding by value', () => {
      const schumann = findFrequencyBinding(7.83);
      expect(schumann).toBeDefined();
      expect(schumann!.name).toBe('Schumann Fundamental');
    });

    it('should trace terminal to ladder rung', () => {
      const ladder = traceLadder('/mem');
      expect(ladder).toBeDefined();
      expect(ladder!.packageName).toBe('@medina/sovereign-memory-sdk');
    });

    it('should get packages for quantum layer', () => {
      const quantumPkgs = getPackagesForLayer('quantum');
      expect(quantumPkgs.length).toBeGreaterThan(0);
    });

    it('should get packages for neural layer', () => {
      const neuralPkgs = getPackagesForLayer('neural');
      expect(neuralPkgs.length).toBeGreaterThan(0);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // STATUS & VERIFICATION
  // ═══════════════════════════════════════════════════════════════

  describe('Status & Verification', () => {
    it('should return complete substrate status', () => {
      const status = getSubstrateStatus();
      expect(status.totalPackages).toBe(11);
      expect(status.totalConstants).toBe(14);
      expect(status.totalPhysicsBindings).toBe(18);
      expect(status.totalLadderRungs).toBe(11);
      expect(status.absorptionComplete).toBe(true);
    });

    it('should verify complete organism wiring', () => {
      const result = verifyOrganismWiring();
      expect(result.verified).toBe(true);
      expect(result.packageCount).toBe(11);
      expect(result.constantCount).toBe(14);
      expect(result.physicsCount).toBe(18);
      expect(result.ladderCount).toBe(11);
      expect(result.message).toContain('ORGANISM FULLY WIRED');
      expect(result.message).toContain('φ-verified');
    });

    it('should have integrity > 0.95', () => {
      const result = verifyOrganismWiring();
      expect(result.integrity).toBeGreaterThan(0.95);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // SINGLETON — "It's just there"
  // ═══════════════════════════════════════════════════════════════

  describe('Singleton Substrate', () => {
    it('should return same instance on repeated calls', () => {
      const a = getOrganismSubstrate();
      const b = getOrganismSubstrate();
      expect(a).toBe(b); // Same reference
    });

    it('should be wired from the start', () => {
      const substrate = getOrganismSubstrate();
      expect(substrate.absorptionComplete).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // CONSTANTS VERIFICATION — φ self-consistency
  // ═══════════════════════════════════════════════════════════════

  describe('Phi Self-Consistency', () => {
    it('φ should equal 1 + 1/φ', () => {
      expect(PHI).toBeCloseTo(1 + 1 / PHI, 10);
    });

    it('φ² should equal φ + 1', () => {
      expect(PHI_SQUARED).toBeCloseTo(PHI + 1, 10);
    });

    it('φ³ should equal 2φ + 1', () => {
      expect(PHI_CUBED).toBeCloseTo(2 * PHI + 1, 10);
    });

    it('φ × φ⁻¹ should equal 1', () => {
      expect(PHI * PHI_INVERSE).toBeCloseTo(1.0, 10);
    });

    it('absorption frequency should equal 432 × φ⁻¹', () => {
      expect(ABSORPTION_FREQUENCY).toBeCloseTo(FREQ_432 * PHI_INVERSE, 1);
    });
  });
});
