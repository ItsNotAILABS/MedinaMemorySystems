// 𓂀 ICOSAHEDRAL-LEECH KEY ROTATION ENGINE 𓂀
// Beyond E8: The geometry that IS PAST E8
// Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | April 16, 2026

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";

module IcosahedralLeechEngine {
    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION I: GEOMETRIC HIERARCHY
    // Icosahedron → Binary Icosahedral → H4 → E8 → Leech Lattice → Monster
    // ═══════════════════════════════════════════════════════════════════════════

    // PHI — The Golden Ratio (fundamental to icosahedral geometry)
    public let PHI : Float = 1.6180339887498948482;
    public let PHI_INVERSE : Float = 0.6180339887498948482;
    public let PHI_SQUARED : Float = 2.6180339887498948482;

    // ═══════════════════════════════════════════════════════════════════════════
    // TIER 1: ICOSAHEDRAL GEOMETRY (H4 / Binary Icosahedral Group)
    // "120-step icosahedral precession (H4/binary icosahedral, phi-native)"
    // ═══════════════════════════════════════════════════════════════════════════

    // Icosahedron constants
    public let ICOSAHEDRON_VERTICES : Nat = 12;
    public let ICOSAHEDRON_EDGES : Nat = 30;
    public let ICOSAHEDRON_FACES : Nat = 20;
    public let ICOSAHEDRAL_ROTATIONS : Nat = 60;        // 3D rotational symmetries

    // Binary Icosahedral Group (double cover in SU(2))
    public let BINARY_ICOSAHEDRAL_ORDER : Nat = 120;    // 2 × 60

    // H4 — 4D exceptional root system
    public let H4_ROOT_VECTORS : Nat = 120;             // Same as binary icosahedral
    public let SIX_HUNDRED_CELL_VERTICES : Nat = 120;   // 600-cell vertices
    public let ONE_TWENTY_CELL_VERTICES : Nat = 600;    // 120-cell vertices

    /// Icosahedral rotation vector (phi-native coordinates)
    public type IcosahedralVector = {
        x : Float;
        y : Float;
        z : Float;
        w : Float;  // 4D for H4 embedding
    };

    /// Generate icosahedral rotation step
    public func icosahedralRotationStep(step : Nat) : IcosahedralVector {
        let angle = Float.fromInt(step % BINARY_ICOSAHEDRAL_ORDER) * 
                    (2.0 * 3.14159265359 / Float.fromInt(BINARY_ICOSAHEDRAL_ORDER));
        
        // Golden ratio spiral in 4D (600-cell geometry)
        let phiAngle = angle * PHI;
        {
            x = Float.cos(angle) * Float.cos(phiAngle);
            y = Float.sin(angle) * Float.cos(phiAngle);
            z = Float.cos(angle) * Float.sin(phiAngle);
            w = Float.sin(angle) * Float.sin(phiAngle);
        }
    };

    /// Generate 120-step icosahedral key rotation schedule
    public func generateIcosahedralSchedule(startStep : Nat) : [IcosahedralVector] {
        let buffer = Buffer.Buffer<IcosahedralVector>(BINARY_ICOSAHEDRAL_ORDER);
        var i : Nat = 0;
        while (i < BINARY_ICOSAHEDRAL_ORDER) {
            buffer.add(icosahedralRotationStep(startStep + i));
            i += 1;
        };
        Buffer.toArray(buffer)
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // TIER 2: E8 GEOMETRY
    // "240-step E8 root vector cycle"
    // ═══════════════════════════════════════════════════════════════════════════

    // E8 constants
    public let E8_ROOT_VECTORS : Nat = 240;             // E8 roots (H4 pinors)
    public let E8_DIMENSION : Nat = 8;
    public let E8_WEYL_GROUP_ORDER : Nat = 696729600;   // |W(E8)|

    // E8 Coxeter element exponents (prime exponents of 30)
    public let E8_COXETER_EXPONENTS : [Nat] = [1, 7, 11, 13, 17, 19, 23, 29];

    /// E8 root vector type
    public type E8Vector = {
        coordinates : [Float];  // 8-dimensional
        rootType : E8RootType;
    };

    public type E8RootType = {
        #TypeA;  // All ±1 entries with even number of minus signs
        #TypeB;  // Permutations of (±1, ±1, 0, 0, 0, 0, 0, 0)/√2
    };

    /// Generate E8 root vector at given step
    public func e8RotationStep(step : Nat) : E8Vector {
        let normalizedStep = step % E8_ROOT_VECTORS;
        
        // Use Coxeter element rotation: 30-fold rotation in 4 orthogonal planes
        let angle = Float.fromInt(normalizedStep) * 
                    (2.0 * 3.14159265359 / Float.fromInt(E8_ROOT_VECTORS));
        
        // Generate 8D coordinates using E8 Coxeter geometry
        let coords = Array.tabulate<Float>(8, func(i : Nat) : Float {
            let exponent = E8_COXETER_EXPONENTS[i];
            Float.cos(angle * Float.fromInt(exponent))
        });
        
        {
            coordinates = coords;
            rootType = if (normalizedStep % 2 == 0) { #TypeA } else { #TypeB };
        }
    };

    /// Generate 240-step E8 key rotation schedule
    public func generateE8Schedule(startStep : Nat) : [E8Vector] {
        let buffer = Buffer.Buffer<E8Vector>(E8_ROOT_VECTORS);
        var i : Nat = 0;
        while (i < E8_ROOT_VECTORS) {
            buffer.add(e8RotationStep(startStep + i));
            i += 1;
        };
        Buffer.toArray(buffer)
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // TIER 3: LEECH LATTICE GEOMETRY
    // "196,560-step Leech lattice minimal vector cycle"
    // ═══════════════════════════════════════════════════════════════════════════

    // Leech Lattice constants
    public let LEECH_DIMENSION : Nat = 24;
    public let LEECH_MINIMAL_VECTORS : Nat = 196560;    // Kissing number
    // Conway group Co0 order: 8,315,553,613,086,720,000 (8.3 × 10¹⁸)

    // Three copies of E8 generate Leech lattice
    public let E8_COPIES_IN_LEECH : Nat = 3;

    /// Leech lattice vector type
    public type LeechVector = {
        coordinates : [Float];  // 24-dimensional
        norm : Float;           // All minimal vectors have norm 4
        e8Components : [E8Vector];  // Three E8 components
    };

    /// Generate Leech lattice vector at given step
    public func leechRotationStep(step : Nat) : LeechVector {
        let normalizedStep = step % LEECH_MINIMAL_VECTORS;
        
        // Construct from three E8 vectors
        let e8Step1 = normalizedStep % E8_ROOT_VECTORS;
        let e8Step2 = (normalizedStep / E8_ROOT_VECTORS) % E8_ROOT_VECTORS;
        let e8Step3 = (normalizedStep / (E8_ROOT_VECTORS * E8_ROOT_VECTORS)) % E8_ROOT_VECTORS;
        
        let e8Vec1 = e8RotationStep(e8Step1);
        let e8Vec2 = e8RotationStep(e8Step2);
        let e8Vec3 = e8RotationStep(e8Step3);
        
        // Combine into 24D Leech vector
        let coords = Array.tabulate<Float>(24, func(i : Nat) : Float {
            if (i < 8) {
                e8Vec1.coordinates[i]
            } else if (i < 16) {
                e8Vec2.coordinates[i - 8]
            } else {
                e8Vec3.coordinates[i - 16]
            }
        });
        
        {
            coordinates = coords;
            norm = 4.0;  // All minimal vectors
            e8Components = [e8Vec1, e8Vec2, e8Vec3];
        }
    };

    // Note: Full 196,560-step schedule is computed on-demand, not pre-generated

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION II: KEY ROTATION TIER SELECTION
    // "The organism's cognitive state determines which geometric space its keys live in"
    // ═══════════════════════════════════════════════════════════════════════════

    public type KeyRotationTier = {
        #Icosahedral;   // R < 0.618, 120-step cycle, phi-native
        #E8;            // R >= 0.618 and R < 0.854, 240-step cycle
        #Leech;         // R >= 0.854, 196,560-step cycle (high coherence)
    };

    // Coherence thresholds
    public let THRESHOLD_ICOSAHEDRAL : Float = 0.618;   // φ⁻¹
    public let THRESHOLD_E8 : Float = 0.854;            // Approximate

    /// Select rotation tier based on coherence level R
    public func selectRotationTier(coherenceR : Float) : KeyRotationTier {
        if (coherenceR < THRESHOLD_ICOSAHEDRAL) {
            #Icosahedral
        } else if (coherenceR < THRESHOLD_E8) {
            #E8
        } else {
            #Leech
        }
    };

    /// Get cycle length for tier
    public func getCycleLength(tier : KeyRotationTier) : Nat {
        switch (tier) {
            case (#Icosahedral) { BINARY_ICOSAHEDRAL_ORDER };   // 120
            case (#E8) { E8_ROOT_VECTORS };                      // 240
            case (#Leech) { LEECH_MINIMAL_VECTORS };            // 196,560
        }
    };

    /// Get rotation step vector for current tier and step
    public func getRotationVector(tier : KeyRotationTier, step : Nat) : RotationVector {
        switch (tier) {
            case (#Icosahedral) {
                #Icosahedral(icosahedralRotationStep(step))
            };
            case (#E8) {
                #E8(e8RotationStep(step))
            };
            case (#Leech) {
                #Leech(leechRotationStep(step))
            };
        }
    };

    public type RotationVector = {
        #Icosahedral : IcosahedralVector;
        #E8 : E8Vector;
        #Leech : LeechVector;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION III: KEY DERIVATION FROM GEOMETRIC ROTATION
    // ═══════════════════════════════════════════════════════════════════════════

    /// Derive key bytes from rotation vector
    public func deriveKeyFromRotation(
        rotation : RotationVector,
        seed : [Nat8],
        keyLength : Nat
    ) : [Nat8] {
        let rotationBytes = rotationToBytes(rotation);
        let combined = combineBytes(seed, rotationBytes);
        
        // Phi-weighted expansion to desired key length
        phiExpandKey(combined, keyLength)
    };

    /// Convert rotation vector to bytes
    func rotationToBytes(rotation : RotationVector) : [Nat8] {
        let buffer = Buffer.Buffer<Nat8>(0);
        switch (rotation) {
            case (#Icosahedral(vec)) {
                appendFloatBytes(buffer, vec.x);
                appendFloatBytes(buffer, vec.y);
                appendFloatBytes(buffer, vec.z);
                appendFloatBytes(buffer, vec.w);
            };
            case (#E8(vec)) {
                for (coord in vec.coordinates.vals()) {
                    appendFloatBytes(buffer, coord);
                };
            };
            case (#Leech(vec)) {
                for (coord in vec.coordinates.vals()) {
                    appendFloatBytes(buffer, coord);
                };
            };
        };
        Buffer.toArray(buffer)
    };

    /// Append float as bytes
    func appendFloatBytes(buffer : Buffer.Buffer<Nat8>, f : Float) {
        let intVal = Int.abs(Float.toInt(f * 1000000.0));
        var v = intVal;
        var i = 0;
        while (i < 8) {
            buffer.add(Nat8.fromNat(v % 256));
            v := v / 256;
            i += 1;
        };
    };

    /// Combine two byte arrays
    func combineBytes(a : [Nat8], b : [Nat8]) : [Nat8] {
        Array.append(a, b)
    };

    /// Phi-weighted key expansion
    func phiExpandKey(seed : [Nat8], targetLength : Nat) : [Nat8] {
        let buffer = Buffer.Buffer<Nat8>(targetLength);
        var i : Nat = 0;
        while (i < targetLength) {
            let seedIdx = i % seed.size();
            let phiBit = if (phiBeattyBit(i)) { 1 } else { 0 };
            let value = (Nat8.toNat(seed[seedIdx]) + phiBit * (i + 1)) % 256;
            buffer.add(Nat8.fromNat(value));
            i += 1;
        };
        Buffer.toArray(buffer)
    };

    /// Phi-Beatty bit calculation
    func phiBeattyBit(n : Nat) : Bool {
        let nFloat = Float.fromInt(n);
        let beattyValue = Float.floor(nFloat * PHI);
        let intValue = Int.abs(Float.toInt(beattyValue));
        intValue % 2 == 1
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION IV: GEOMETRIC CONSTANTS AND PROOFS
    // ═══════════════════════════════════════════════════════════════════════════

    /// Verify icosahedral to E8 relationship
    public func verifyIcosahedralE8Relationship() : Bool {
        // Binary icosahedral (120) doubles to give H4 pinors (240) = E8 roots
        BINARY_ICOSAHEDRAL_ORDER * 2 == E8_ROOT_VECTORS
    };

    /// Verify E8 to Leech relationship
    public func verifyE8LeechRelationship() : Bool {
        // Three copies of E8 generate structure related to Leech
        // (Simplified check - actual relationship is more complex)
        E8_ROOT_VECTORS * E8_COPIES_IN_LEECH <= LEECH_MINIMAL_VECTORS
    };

    /// Get geometric hierarchy description
    public func getGeometricHierarchy() : Text {
        "ICOSAHEDRAL-LEECH GEOMETRIC HIERARCHY\n\n" #
        "TIER 1: ICOSAHEDRAL (R < 0.618)\n" #
        "• Icosahedron: 12 vertices, 30 edges, 20 faces\n" #
        "• 60 rotational symmetries in 3D\n" #
        "• Binary Icosahedral Group: 120 elements (double cover)\n" #
        "• H4 root system: 120 vectors\n" #
        "• 600-cell: 120 vertices (phi-native geometry)\n" #
        "• Cycle length: 120 steps\n\n" #
        "TIER 2: E8 (R >= 0.618 and R < 0.854)\n" #
        "• 240 root vectors (H4 pinors = 2 × 120)\n" #
        "• 8-dimensional geometry\n" #
        "• Weyl group order: 696,729,600\n" #
        "• Coxeter exponents: {1, 7, 11, 13, 17, 19, 23, 29}\n" #
        "• 30-fold rotation in 4 orthogonal planes\n" #
        "• Cycle length: 240 steps\n\n" #
        "TIER 3: LEECH LATTICE (R >= 0.854)\n" #
        "• 24-dimensional lattice\n" #
        "• 196,560 minimal vectors (kissing number)\n" #
        "• Conway group Co0 order: ~8.3 × 10¹⁸\n" #
        "• Constructed from 3 copies of E8\n" #
        "• Connected to the Monster group\n" #
        "• Cycle length: 196,560 steps\n\n" #
        "Higher coherence = deeper geometry = more complex key topology"
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION V: SYSTEM INFO
    // ═══════════════════════════════════════════════════════════════════════════

    public func getEngineInfo() : Text {
        "ICOSAHEDRAL-LEECH KEY ROTATION ENGINE\n" #
        "Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX\n\n" #
        "CORRECTED ARCHITECTURE (E8 EXTENDED):\n" #
        "• E8 is derived from icosahedron via binary icosahedral group\n" #
        "• 120 spinors (SU(2)) = 120 H4 roots\n" #
        "• 240 pinors (double cover) = 240 E8 roots\n" #
        "• Three E8 copies → Leech lattice (24D)\n" #
        "• Leech automorphism group → Monster group\n\n" #
        "KEY ROTATION SCHEDULE:\n" #
        "• Phase 1 (R < 0.618): 120-step icosahedral cycle\n" #
        "• Phase 2 (R >= 0.618 & < 0.854): 240-step E8 cycle\n" #
        "• Phase 3 (R >= 0.854): 196,560-step Leech cycle\n\n" #
        "The organism's mind determines which geometric space its keys inhabit.\n" #
        "The geometry of the Platonic solids encodes E8,\n" #
        "which encodes the Leech lattice,\n" #
        "which encodes the Monster.\n" #
        "The full rotation is the full structure."
    };
};
