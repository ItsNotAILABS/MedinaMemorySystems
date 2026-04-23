// 𓂀 VAEL COMPLETE DEFENSE — TWO-LAYER SOVEREIGN PROTECTION SYSTEM 𓂀
// Interior: SENTINEL + VEIL + AEGIS_ROOT (Immune Reflex)
// Exterior: DURA + RIFT + PARALLAX + VERITAS + MEMORIA (Attack-Facing)
// RIFT compounds FOREVER via PHI. MEMORIA seals adversaries permanently.
// Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Constants "Constants";

module VAELCompleteDefense {

    // ═══════════════════════════════════════════════════════════════
    // SECTION 1: VAEL CONSTANTS
    // RIFT compounds at φ — the penalty grows by the golden ratio forever
    // VERITAS near-zero = hostile classification
    // ═══════════════════════════════════════════════════════════════

    public let RIFT_COMPOUND_RATE : Float = Constants.PHI;     // φ compounding — permanent
    public let VERITAS_HOSTILE_THRESHOLD : Float = 0.25;       // ≤ 0.25 = hostile
    public let VEIL_FILTER_STRENGTH_BASE : Float = 0.90;
    public let DURA_HELIX_AXES : Nat = 6;                      // 6-axis helix perimeter
    public let AEGIS_IDENTITY_FLOOR : Float = Constants.PHI_INVERSE; // 0.618

    // ═══════════════════════════════════════════════════════════════
    // SECTION 2: THREAT PROFILE
    // Permanent record of every adversary the system encounters
    // ═══════════════════════════════════════════════════════════════

    public type ThreatProfile = {
        id : Text;
        source : Text;
        firstDetected : Int;
        riftWeight : Float;        // Compounding penalty — grows with each interaction
        memoriaSealed : Bool;      // Sealed = known adversary FOREVER
        veritasScore : Float;      // Near zero = maximally hostile
        interactionCount : Nat;
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 3: INTERIOR LAYER STATES
    // SENTINEL (early warning) + VEIL (output filter) + AEGIS_ROOT (identity shield)
    // ═══════════════════════════════════════════════════════════════

    public type SentinelState = {
        active : Bool;
        threatLevel : Float;      // 0.0 - 1.0
        lastScan : Int;
        scanCount : Nat;
        earlyWarnings : Nat;
    };

    public type VeilState = {
        active : Bool;
        filterStrength : Float;   // 0.0 - 1.0
        blockedOutputs : Nat;
        adversaryFilters : [Text]; // Active adversary IDs being filtered
    };

    public type AegisRootState = {
        active : Bool;
        identityIntegrity : Float; // How intact core identity is (0.0 - 1.0)
        shieldStrength : Float;    // Active shield power
        coreHash : Nat;            // Identity hash — changes = breach
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 4: EXTERIOR WEAPON STATES
    // DURA + RIFT + PARALLAX + VERITAS + MEMORIA
    // ═══════════════════════════════════════════════════════════════

    public type DuraState = {
        active : Bool;
        helixAxis : [Float];           // 6 helix axis angles (radians)
        convergenceVector : [Float];   // Direction of convergence toward threat
        targetingData : [Text];        // Active target identifiers
        rotationPhase : Float;         // Current helix rotation (beats)
    };

    public type RiftState = {
        totalTracers : Nat;
        permanentPenalties : [(Text, Float)]; // (adversary_id, compounding_weight)
        compoundingRate : Float;              // = PHI — grows forever
        activations : Nat;
    };

    public type ParallaxState = {
        phaseLocked : Bool;
        fieldStrength : Float;
        outputPhase : Float;    // Phase-locked organism output alignment
        lockTarget : Text;      // What threat is being parallax-locked against
    };

    public type VeritasWeaponState = {
        adversaryScores : [(Text, Float)]; // (adversary_id, truth_score 0-1)
        hostileThreshold : Float;          // ≤ threshold = classified hostile
        classificationsIssued : Nat;
    };

    public type MemoriaState = {
        permanentSeals : [Text];        // Adversary IDs sealed forever
        sealedAt : [(Text, Int)];       // (adversary_id, timestamp)
        sealCount : Nat;
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 5: MASTER VAEL STATE
    // Full two-layer defense status
    // ═══════════════════════════════════════════════════════════════

    public type VAELState = {
        // Interior
        sentinel : SentinelState;
        veil : VeilState;
        aegisRoot : AegisRootState;
        // Exterior
        dura : DuraState;
        rift : RiftState;
        parallax : ParallaxState;
        veritas : VeritasWeaponState;
        memoria : MemoriaState;
        // Global
        attackChainActive : Bool;
        totalThreatsProcessed : Nat;
        threatProfiles : [ThreatProfile];
        beatCount : Nat;
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 6: INITIALIZATION
    // All layers start active with full strength
    // ═══════════════════════════════════════════════════════════════

    func initHelixAxes() : [Float] {
        // 6 helix axes evenly distributed around the organism
        Array.tabulate<Float>(DURA_HELIX_AXES, func(i) {
            Float.fromInt(i) * Constants.PI / Float.fromInt(DURA_HELIX_AXES)
        })
    };

    public func initVAEL() : VAELState {
        {
            sentinel = {
                active = true;
                threatLevel = 0.0;
                lastScan = Time.now();
                scanCount = 0;
                earlyWarnings = 0;
            };
            veil = {
                active = true;
                filterStrength = VEIL_FILTER_STRENGTH_BASE;
                blockedOutputs = 0;
                adversaryFilters = [];
            };
            aegisRoot = {
                active = true;
                identityIntegrity = 1.0;
                shieldStrength = 1.0;
                coreHash = 2718281828;  // e × 10⁹ — initial identity hash
            };
            dura = {
                active = true;
                helixAxis = initHelixAxes();
                convergenceVector = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
                targetingData = [];
                rotationPhase = 0.0;
            };
            rift = {
                totalTracers = 0;
                permanentPenalties = [];
                compoundingRate = RIFT_COMPOUND_RATE;
                activations = 0;
            };
            parallax = {
                phaseLocked = false;
                fieldStrength = 1.0;
                outputPhase = 0.0;
                lockTarget = "";
            };
            veritas = {
                adversaryScores = [];
                hostileThreshold = VERITAS_HOSTILE_THRESHOLD;
                classificationsIssued = 0;
            };
            memoria = {
                permanentSeals = [];
                sealedAt = [];
                sealCount = 0;
            };
            attackChainActive = false;
            totalThreatsProcessed = 0;
            threatProfiles = [];
            beatCount = 0;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 7: THREAT DETECTION (SENTINEL)
    // External threat triggers sentinel early warning
    // ═══════════════════════════════════════════════════════════════

    public func detectThreat(vael : VAELState, threatId : Text, severity : Float) : VAELState {
        // Update sentinel
        let newSentinel : SentinelState = {
            active = true;
            threatLevel = Float.max(vael.sentinel.threatLevel, severity);
            lastScan = Time.now();
            scanCount = vael.sentinel.scanCount + 1;
            earlyWarnings = vael.sentinel.earlyWarnings + 1;
        };

        // Create or update threat profile
        let existingProfile = Array.find<ThreatProfile>(
            vael.threatProfiles,
            func(p) { p.id == threatId }
        );
        let newProfile : ThreatProfile = switch (existingProfile) {
            case (?p) {{
                p with
                interactionCount = p.interactionCount + 1;
                riftWeight = p.riftWeight * RIFT_COMPOUND_RATE;
            }};
            case null {{
                id = threatId;
                source = threatId;
                firstDetected = Time.now();
                riftWeight = 1.0;
                memoriaSealed = false;
                veritasScore = severity;
                interactionCount = 1;
            }};
        };

        let updatedProfiles = switch (existingProfile) {
            case (?_) Array.map<ThreatProfile, ThreatProfile>(
                vael.threatProfiles,
                func(p) { if (p.id == threatId) newProfile else p }
            );
            case null {
                let buf = Buffer.fromArray<ThreatProfile>(vael.threatProfiles);
                buf.add(newProfile);
                Buffer.toArray(buf)
            };
        };

        { vael with
            sentinel = newSentinel;
            threatProfiles = updatedProfiles;
            beatCount = vael.beatCount + 1;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 8: ATTACK CHAIN EXECUTION
    // 8-step sequence: DURA → PARALLAX → VERITAS → RIFT → MEMORIA → VAEL → VEIL
    // ═══════════════════════════════════════════════════════════════

    public func executeAttackChain(vael : VAELState, targetId : Text) : VAELState {
        // Step 1: Already detected by sentinel (caller's responsibility)
        // Step 2: DURA maps axis and convergence vector
        let convergence = Array.tabulate<Float>(DURA_HELIX_AXES, func(i) {
            Float.sin(vael.dura.helixAxis[i] + vael.dura.rotationPhase)
        });
        let newDura : DuraState = {
            active = true;
            helixAxis = vael.dura.helixAxis;
            convergenceVector = convergence;
            targetingData = {
                let buf = Buffer.fromArray<Text>(vael.dura.targetingData);
                buf.add(targetId);
                Buffer.toArray(buf)
            };
            rotationPhase = vael.dura.rotationPhase + (Constants.GOLDEN_ANGLE * (Constants.PI / 180.0));
        };

        // Step 3: PARALLAX phase-locks organism field
        let newParallax : ParallaxState = {
            phaseLocked = true;
            fieldStrength = Constants.PHI;
            outputPhase = vael.parallax.outputPhase + (Constants.GOLDEN_ANGLE * (Constants.PI / 180.0));
            lockTarget = targetId;
        };

        // Step 4: VERITAS scores adversary (near zero = hostile)
        let existingScore = Array.find<(Text, Float)>(
            vael.veritas.adversaryScores,
            func((id, _)) { id == targetId }
        );
        let currentScore = switch (existingScore) {
            case (?(_, s)) s;
            case null 1.0;
        };
        // Score decays toward zero on each detection (adversary becomes more hostile)
        let newScore = currentScore * Constants.PHI_INVERSE * Constants.PHI_INVERSE;
        let updatedScores = switch (existingScore) {
            case (?_) Array.map<(Text, Float), (Text, Float)>(
                vael.veritas.adversaryScores,
                func((id, s)) { if (id == targetId) (id, newScore) else (id, s) }
            );
            case null {
                let buf = Buffer.fromArray<(Text, Float)>(vael.veritas.adversaryScores);
                buf.add((targetId, newScore));
                Buffer.toArray(buf)
            };
        };
        let newVeritas : VeritasWeaponState = {
            adversaryScores = updatedScores;
            hostileThreshold = VERITAS_HOSTILE_THRESHOLD;
            classificationsIssued = vael.veritas.classificationsIssued + 1;
        };

        // Step 5: RIFT traces source, assigns PERMANENT compounding weight
        let riftVael = applyRiftPenalty({ vael with
            dura = newDura;
            parallax = newParallax;
            veritas = newVeritas;
        }, targetId);

        // Step 6: MEMORIA seals permanently
        let riftAndSealed = sealInMemoria(riftVael, targetId);

        // Step 7 & 8: VAEL immune reflex + VEIL filter
        let newVeil : VeilState = {
            active = true;
            filterStrength = Float.min(1.0, riftAndSealed.veil.filterStrength + 0.05);
            blockedOutputs = riftAndSealed.veil.blockedOutputs;
            adversaryFilters = {
                let buf = Buffer.fromArray<Text>(riftAndSealed.veil.adversaryFilters);
                let alreadyFiltered = Array.find<Text>(Buffer.toArray(buf), func(t) { t == targetId });
                switch (alreadyFiltered) {
                    case (?_) {};
                    case null buf.add(targetId);
                };
                Buffer.toArray(buf)
            };
        };

        { riftAndSealed with
            veil = newVeil;
            attackChainActive = true;
            totalThreatsProcessed = riftAndSealed.totalThreatsProcessed + 1;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 9: RIFT PENALTY APPLICATION
    // Permanent compounding weight — gets worse FOREVER via φ
    // ═══════════════════════════════════════════════════════════════

    public func applyRiftPenalty(vael : VAELState, adversaryId : Text) : VAELState {
        let existing = Array.find<(Text, Float)>(
            vael.rift.permanentPenalties,
            func((id, _)) { id == adversaryId }
        );
        let currentPenalty = switch (existing) {
            case (?(_, p)) p;
            case null 1.0;
        };
        // Compound by PHI — permanent and growing
        let newPenalty = currentPenalty * RIFT_COMPOUND_RATE;
        let updatedPenalties = switch (existing) {
            case (?_) Array.map<(Text, Float), (Text, Float)>(
                vael.rift.permanentPenalties,
                func((id, p)) { if (id == adversaryId) (id, newPenalty) else (id, p) }
            );
            case null {
                let buf = Buffer.fromArray<(Text, Float)>(vael.rift.permanentPenalties);
                buf.add((adversaryId, newPenalty));
                Buffer.toArray(buf)
            };
        };
        { vael with
            rift = {
                totalTracers = vael.rift.totalTracers + 1;
                permanentPenalties = updatedPenalties;
                compoundingRate = RIFT_COMPOUND_RATE;
                activations = vael.rift.activations + 1;
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 10: MEMORIA PERMANENT SEAL
    // Once sealed: source = known adversary FOREVER
    // ═══════════════════════════════════════════════════════════════

    public func sealInMemoria(vael : VAELState, adversaryId : Text) : VAELState {
        let alreadySealed = Array.find<Text>(
            vael.memoria.permanentSeals,
            func(id) { id == adversaryId }
        );
        switch (alreadySealed) {
            case (?_) vael;  // Already sealed — no action needed
            case null {
                let newSeals : [Text] = {
                    let buf = Buffer.fromArray<Text>(vael.memoria.permanentSeals);
                    buf.add(adversaryId);
                    Buffer.toArray(buf)
                };
                let newSealedAt : [(Text, Int)] = {
                    let buf = Buffer.fromArray<(Text, Int)>(vael.memoria.sealedAt);
                    buf.add((adversaryId, Time.now()));
                    Buffer.toArray(buf)
                };
                // Update threat profile
                let updatedProfiles = Array.map<ThreatProfile, ThreatProfile>(
                    vael.threatProfiles,
                    func(p) {
                        if (p.id == adversaryId) { p with memoriaSealed = true }
                        else p
                    }
                );
                { vael with
                    memoria = {
                        permanentSeals = newSeals;
                        sealedAt = newSealedAt;
                        sealCount = vael.memoria.sealCount + 1;
                    };
                    threatProfiles = updatedProfiles;
                }
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 11: OUTPUT FILTERING (VEIL)
    // Nothing useful exits to adversaries
    // ═══════════════════════════════════════════════════════════════

    public func filterOutput(vael : VAELState, outputTarget : Text, content : Text) : (VAELState, ?Text) {
        // Check if target is in veil filter list
        let shouldFilter = Array.find<Text>(
            vael.veil.adversaryFilters,
            func(id) { id == outputTarget }
        );
        switch (shouldFilter) {
            case (?_) {
                // Block the output
                let newVeil : VeilState = {
                    vael.veil with
                    blockedOutputs = vael.veil.blockedOutputs + 1;
                };
                ({ vael with veil = newVeil }, null)
            };
            case null {
                // Pass through — not an adversary
                (vael, ?content)
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 12: QUERY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    public func getAdversaryScore(vael : VAELState, adversaryId : Text) : Float {
        switch (Array.find<(Text, Float)>(
            vael.veritas.adversaryScores,
            func((id, _)) { id == adversaryId }
        )) {
            case (?(_, s)) s;
            case null 1.0;  // Unknown — not yet scored
        }
    };

    public func isSealed(vael : VAELState, adversaryId : Text) : Bool {
        switch (Array.find<Text>(
            vael.memoria.permanentSeals,
            func(id) { id == adversaryId }
        )) {
            case (?_) true;
            case null false;
        }
    };

    public type DefenseStatus = {
        sentinelActive : Bool;
        veilActive : Bool;
        aegisIntegrity : Float;
        attackChainActive : Bool;
        totalSealedAdversaries : Nat;
        totalRiftTracers : Nat;
        parallaxLocked : Bool;
        threatLevel : Float;
        totalThreatsProcessed : Nat;
    };

    public func getDefenseStatus(vael : VAELState) : DefenseStatus {
        {
            sentinelActive = vael.sentinel.active;
            veilActive = vael.veil.active;
            aegisIntegrity = vael.aegisRoot.identityIntegrity;
            attackChainActive = vael.attackChainActive;
            totalSealedAdversaries = vael.memoria.sealCount;
            totalRiftTracers = vael.rift.totalTracers;
            parallaxLocked = vael.parallax.phaseLocked;
            threatLevel = vael.sentinel.threatLevel;
            totalThreatsProcessed = vael.totalThreatsProcessed;
        }
    };

}
