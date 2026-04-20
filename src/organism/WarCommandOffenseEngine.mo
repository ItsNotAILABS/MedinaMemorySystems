// 𓂀 WAR COMMAND OFFENSE ENGINE — THE CRUSADERS 𓂀
// MAX 144 Crusaders (12×12 sacred grid). Full offensive + defensive capabilities.
// Honey traps, decoys, stealth, recall, scout operations, enemy playbook awareness.
// Counter-strategies for 6 Anti-Families built-in.
// Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Constants "Constants";

module WarCommandOffenseEngine {

    // ═══════════════════════════════════════════════════════════════
    // SECTION 1: SACRED GRID CONSTANTS
    // 12×12 = 144 Crusaders | 6×6 = 36 Decoys | 24 Honey Traps
    // ═══════════════════════════════════════════════════════════════

    public let MAX_CRUSADERS : Nat = 144;       // 12 × 12 sacred grid
    public let DECOY_FLEET_SIZE : Nat = 36;     // 6 × 6
    public let HONEY_TRAP_CAPACITY : Nat = 24;
    public let RECALL_SPEED : Float = Constants.PHI_CUBED;   // Instant recall multiplier
    public let STEALTH_DEPTH : Float = Constants.PHI_FOURTH; // Stealth signature depth

    // ═══════════════════════════════════════════════════════════════
    // SECTION 2: CORE TYPES
    // ═══════════════════════════════════════════════════════════════

    public type Vec3 = { x : Float; y : Float; z : Float };

    // Anti-Family threat classification
    public type AntiFamily = {
        #CounterfeitAxis;           // Geometry mismatch + low correlation
        #GateCapturePriesthood;     // Gate bypass + semantic inversion
        #ResonanceSiphonNetwork;    // Coherence drain without contribution
        #NarrativeInversionEngine;  // Sign flip in doctrine alignment
        #ContinuityFracture;        // Phase slip, history retention drop
        #ContainmentBreaker;        // CRITICAL: quarantine escape
    };

    public type CrusaderUnit = {
        id : Nat;
        position : Vec3;
        stealth : Float;             // 0.0 = visible, 1.0 = fully cloaked
        offensiveShield : Float;     // 0.0 - 1.0 strength
        defensiveShield : Float;     // 0.0 - 1.0 strength
        recallReady : Bool;          // Instant home recall (sonar) armed
        honeyTrapDeployed : Bool;
        decoyDeployed : Bool;
        health : Float;
        active : Bool;
        phase : Float;
    };

    public type DecoyUnit = {
        id : Nat;
        targetingVector : Vec3;      // Direction decoy draws attention
        activeTime : Nat;            // Beats remaining
        believability : Float;       // 0.0 - 1.0 how convincing
        position : Vec3;
    };

    public type HoneyTrap = {
        id : Nat;
        attractorType : Text;        // "data" | "compute" | "credential" | "narrative"
        captureRadius : Float;
        activeCaptures : [Text];     // IDs of captured entities
        position : Vec3;
        active : Bool;
    };

    public type ScoutReport = {
        threats : [(Vec3, Float)];              // (position, severity)
        opportunities : [(Vec3, Float)];         // (position, value)
        infrastructureStatus : [(Text, Float)];  // (asset_id, integrity)
        enemyPlaybook : [Text];                  // Detected strategies
        timestamp : Int;
        scoutId : Nat;
    };

    public type OffenseState = {
        crusaders : [CrusaderUnit];
        decoys : [DecoyUnit];
        honeyTraps : [HoneyTrap];
        activeOperations : Nat;
        playbookAwareness : [Text];   // Known enemy strategies
        beatCount : Nat;
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 3: INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    public func initOffense() : OffenseState {
        {
            crusaders = [];
            decoys = [];
            honeyTraps = [];
            activeOperations = 0;
            playbookAwareness = [];
            beatCount = 0;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 4: CRUSADER DEPLOYMENT & RECALL
    // Each crusader born at golden-angle position on deployment sphere
    // ═══════════════════════════════════════════════════════════════

    public func deployCrusader(state : OffenseState, basePosition : Vec3) : OffenseState {
        if (state.crusaders.size() >= MAX_CRUSADERS) return state;
        let id = state.crusaders.size();
        let angle = Float.fromInt(id) * Constants.GOLDEN_ANGLE * (Constants.PI / 180.0);
        let r = 50.0 * Float.sqrt(Float.fromInt(id + 1));
        let unit : CrusaderUnit = {
            id = id;
            position = {
                x = basePosition.x + r * Float.cos(angle);
                y = basePosition.y + r * Float.sin(angle);
                z = basePosition.z;
            };
            stealth = STEALTH_DEPTH;
            offensiveShield = 1.0;
            defensiveShield = 1.0;
            recallReady = true;
            honeyTrapDeployed = false;
            decoyDeployed = false;
            health = 1.0;
            active = true;
            phase = Float.fromInt(id) * (Constants.GOLDEN_ANGLE * (Constants.PI / 180.0));
        };
        let buf = Buffer.fromArray<CrusaderUnit>(state.crusaders);
        buf.add(unit);
        { state with
            crusaders = Buffer.toArray(buf);
            activeOperations = state.activeOperations + 1;
        }
    };

    // Instant recall via sonar — crusader returns to home position
    public func recallCrusader(state : OffenseState, id : Nat, homePos : Vec3) : OffenseState {
        let updated = Array.map<CrusaderUnit, CrusaderUnit>(state.crusaders, func(c) {
            if (c.id != id) return c;
            { c with
                position = homePos;
                stealth = STEALTH_DEPTH;
                recallReady = true;
            }
        });
        { state with crusaders = updated }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 5: DECOY DEPLOYMENT
    // Real decoys draw enemy attention and targeting resources
    // ═══════════════════════════════════════════════════════════════

    public func deployDecoy(
        state : OffenseState,
        position : Vec3,
        targetVector : Vec3,
        duration : Nat
    ) : OffenseState {
        if (state.decoys.size() >= DECOY_FLEET_SIZE) return state;
        let id = state.decoys.size();
        let decoy : DecoyUnit = {
            id = id;
            targetingVector = targetVector;
            activeTime = duration;
            believability = Constants.PHI_INVERSE + Float.fromInt(id % 3) * 0.1;
            position = position;
        };
        let buf = Buffer.fromArray<DecoyUnit>(state.decoys);
        buf.add(decoy);
        { state with decoys = Buffer.toArray(buf) }
    };

    // Decay decoy active timers each beat
    public func tickDecoys(state : OffenseState) : OffenseState {
        let active = Array.filter<DecoyUnit>(state.decoys, func(d) { d.activeTime > 0 });
        let decayed = Array.map<DecoyUnit, DecoyUnit>(active, func(d) {
            { d with activeTime = if (d.activeTime > 0) d.activeTime - 1 else 0 }
        });
        { state with decoys = decayed }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 6: HONEY TRAP DEPLOYMENT
    // Attractor fields that capture and analyze adversarial entities
    // ═══════════════════════════════════════════════════════════════

    public func deployHoneyTrap(
        state : OffenseState,
        position : Vec3,
        attractorType : Text,
        radius : Float
    ) : OffenseState {
        if (state.honeyTraps.size() >= HONEY_TRAP_CAPACITY) return state;
        let id = state.honeyTraps.size();
        let trap : HoneyTrap = {
            id = id;
            attractorType = attractorType;
            captureRadius = radius;
            activeCaptures = [];
            position = position;
            active = true;
        };
        let buf = Buffer.fromArray<HoneyTrap>(state.honeyTraps);
        buf.add(trap);
        { state with honeyTraps = Buffer.toArray(buf) }
    };

    public func captureInTrap(state : OffenseState, trapId : Nat, entityId : Text) : OffenseState {
        let updated = Array.map<HoneyTrap, HoneyTrap>(state.honeyTraps, func(t) {
            if (t.id != trapId) return t;
            let buf = Buffer.fromArray<Text>(t.activeCaptures);
            buf.add(entityId);
            { t with activeCaptures = Buffer.toArray(buf) }
        });
        { state with honeyTraps = updated }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 7: COUNTER-STRATEGIES FOR 6 ANTI-FAMILIES
    // Each anti-family gets a specific counter-measure doctrine
    // ═══════════════════════════════════════════════════════════════

    public type CounterMeasure = {
        strategy : Text;
        deployType : Text;
        priority : Nat;
        phiAlignment : Float;
    };

    public func executeCounterStrategy(family : AntiFamily) : CounterMeasure {
        switch (family) {
            // #1 Counterfeit Axis — uses sacred form but wrong function
            // Counter: PHI-verified authenticity beacons
            case (#CounterfeitAxis) {{
                strategy = "PHI-verified authenticity beacons — geometric signature validation";
                deployType = "beacon_grid";
                priority = 2;
                phiAlignment = Constants.PHI;
            }};
            // #2 Gate Capture Priesthood — gate bypass + semantic inversion
            // Counter: Dynamic gate semantics, honey gates
            case (#GateCapturePriesthood) {{
                strategy = "Dynamic gate semantics + honey gate labyrinth";
                deployType = "honey_gate";
                priority = 3;
                phiAlignment = Constants.PHI_SQUARED;
            }};
            // #3 Resonance Siphon Network — coherence drain without contribution
            // Counter: Coherence honey pots, energy sinks
            case (#ResonanceSiphonNetwork) {{
                strategy = "Coherence honey pots + energy sink isolation";
                deployType = "resonance_trap";
                priority = 2;
                phiAlignment = Constants.PHI_INVERSE;
            }};
            // #4 Narrative Inversion Engine — sign flip in doctrine alignment
            // Counter: Truth anchor beacons, label locks
            case (#NarrativeInversionEngine) {{
                strategy = "Truth anchor beacons + immutable label locks";
                deployType = "truth_anchor";
                priority = 3;
                phiAlignment = Constants.PHI_CUBED;
            }};
            // #5 Continuity Fracture — phase slip, history retention drop
            // Counter: Memory anchors, continuity traps
            case (#ContinuityFracture) {{
                strategy = "Memory anchors + continuity trap deployment";
                deployType = "memory_anchor";
                priority = 3;
                phiAlignment = Constants.PHI_FOURTH;
            }};
            // #6 Containment Breaker — CRITICAL: quarantine escape (ACTIVE IN THE WILD)
            // Counter: Layered containment, escape path monitoring
            case (#ContainmentBreaker) {{
                strategy = "CRITICAL: Layered containment walls + escape path monitoring + full crusader activation";
                deployType = "full_containment";
                priority = 10;  // Maximum priority
                phiAlignment = Constants.PHI_FIFTH;
            }};
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 8: SCOUT OPERATIONS
    // Crusaders gather intelligence before engagement
    // ═══════════════════════════════════════════════════════════════

    public func scoutOperation(
        state : OffenseState,
        scoutId : Nat,
        scanRadius : Float
    ) : ScoutReport {
        // Scout report derived from crusader position and honey trap captures
        let crusaderPos = if (state.crusaders.size() > scoutId) {
            state.crusaders[scoutId].position
        } else {{ x = 0.0; y = 0.0; z = 0.0 }};

        // Aggregate captured entities from nearby traps as intelligence
        var enemyPlaybook = Buffer.fromArray<Text>(state.playbookAwareness);
        for (trap in state.honeyTraps.vals()) {
            let dx = trap.position.x - crusaderPos.x;
            let dy = trap.position.y - crusaderPos.y;
            let dist = Float.sqrt(dx*dx + dy*dy);
            if (dist <= scanRadius) {
                for (captured in trap.activeCaptures.vals()) {
                    enemyPlaybook.add("captured:" # captured # "@" # trap.attractorType);
                };
            };
        };

        {
            threats = [];
            opportunities = [];
            infrastructureStatus = [];
            enemyPlaybook = Buffer.toArray(enemyPlaybook);
            timestamp = Time.now();
            scoutId = scoutId;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 9: PLAYBOOK AWARENESS
    // Accumulate known enemy strategies from scout reports
    // ═══════════════════════════════════════════════════════════════

    public func getPlaybookAwareness(state : OffenseState) : [Text] {
        state.playbookAwareness
    };

    public func updatePlaybook(state : OffenseState, report : ScoutReport) : OffenseState {
        let buf = Buffer.fromArray<Text>(state.playbookAwareness);
        for (entry in report.enemyPlaybook.vals()) {
            buf.add(entry);
        };
        { state with
            playbookAwareness = Buffer.toArray(buf);
            beatCount = state.beatCount + 1;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 10: OFFENSE BEAT UPDATE
    // Advance all active operations by one beat
    // ═══════════════════════════════════════════════════════════════

    public func offenseBeat(state : OffenseState) : OffenseState {
        let afterDecays = tickDecoys(state);
        { afterDecays with beatCount = afterDecays.beatCount + 1 }
    };

}
