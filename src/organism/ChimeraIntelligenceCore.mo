// 𓂀 CHIMERA INTELLIGENCE CORE — DRONE SWARM EXECUTIVE BRAIN 𓂀
// The Chimera coordinates all drone intelligence, swarm coherence,
// and mission generation from doctrine. N² Superradiance. 96-node Kuramoto.
// Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Constants "Constants";

module ChimeraIntelligenceCore {

    // ═══════════════════════════════════════════════════════════════
    // SECTION 1: CHIMERA FREQUENCY CONSTANTS
    // Chimera operates at 12 Hz — synchronized with main brain
    // HEARTBEAT_MS basis: 1000/12 ≈ 83.3ms per chimera cycle
    // ═══════════════════════════════════════════════════════════════

    public let CHIMERA_FREQUENCY : Float = 12.0;       // Hz — executive brain clock
    public let CHIMERA_CYCLE_MS : Float = 1000.0 / 12.0; // 83.33ms per cycle
    public let KURAMOTO_NODES : Nat = 96;               // 96-node coupling to main brain
    public let KURAMOTO_K : Float = 2.5;                // Coupling strength K
    public let SUPERRADIANCE_THRESHOLD : Nat = 2;       // Min drones for N² amplification
    public let MAX_MISSION_QUEUE : Nat = 144;           // φ-sacred queue depth

    // ═══════════════════════════════════════════════════════════════
    // SECTION 2: CORE TYPES
    // DroneState, PheromoneField, MissionType, SwarmIntelligence
    // ═══════════════════════════════════════════════════════════════

    public type Vec3 = { x : Float; y : Float; z : Float };

    public type MissionType = {
        #Patrol : { zone : Nat };
        #Reconnaissance : { target : Vec3 };
        #Strike : { target : Vec3; force : Float };
        #Defend : { asset : Nat; radius : Float };
        #Gather : { resourceType : Text; location : Vec3 };
        #Transport : { payload : Nat; destination : Vec3 };
        #Monitor : { area : Nat; duration : Nat };
    };

    public type DroneState = {
        id : Nat;
        position : Vec3;
        phase : Float;           // Kuramoto phase θᵢ (radians)
        health : Float;          // 0.0 - 1.0
        mission : ?MissionType;
        sensorData : [Float];    // Raw sensor readings
        naturalFrequency : Float; // ωᵢ — intrinsic frequency
        clustered : Bool;        // Contributing to superradiance
    };

    public type PheromoneField = {
        strength : Float;        // Signal amplitude 0.0 - 1.0
        direction : Vec3;        // Normalized direction vector
        decay : Float;           // Decay rate per cycle (0.0 - 1.0)
        sourceId : Nat;          // Emitting drone id
        timestamp : Int;
    };

    public type SwarmIntelligence = {
        coherence : Float;                  // r ∈ [0,1] — Kuramoto order parameter
        meanPhase : Float;                  // ψ — mean field phase
        threatMap : [(Vec3, Float)];        // (position, threat_level) pairs
        opportunityMap : [(Vec3, Float)];   // (position, opportunity_score) pairs
        missionQueue : [MissionType];
        pheromoneFields : [PheromoneField];
        superradianceGain : Float;          // Current N² amplification factor
        beatCount : Nat;
        lastSync : Int;
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 3: INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    public func initChimera() : SwarmIntelligence {
        {
            coherence = 0.0;
            meanPhase = 0.0;
            threatMap = [];
            opportunityMap = [];
            missionQueue = [];
            pheromoneFields = [];
            superradianceGain = 1.0;
            beatCount = 0;
            lastSync = Time.now();
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 4: DRONE FLEET MANAGEMENT
    // Add / remove drones from swarm tracking
    // ═══════════════════════════════════════════════════════════════

    public func addDrone(drones : [DroneState], id : Nat, position : Vec3) : [DroneState] {
        let newDrone : DroneState = {
            id = id;
            position = position;
            phase = Float.fromInt(id) * Constants.GOLDEN_ANGLE * (Constants.PI / 180.0);
            health = 1.0;
            mission = null;
            sensorData = [];
            naturalFrequency = CHIMERA_FREQUENCY + (Float.fromInt(id % 5) * 0.1 - 0.2);
            clustered = false;
        };
        let buf = Buffer.fromArray<DroneState>(drones);
        buf.add(newDrone);
        Buffer.toArray(buf)
    };

    public func removeDrone(drones : [DroneState], id : Nat) : [DroneState] {
        Array.filter<DroneState>(drones, func(d) { d.id != id })
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 5: KURAMOTO SYNCHRONIZATION
    // dθᵢ/dt = ωᵢ + K·r·sin(ψ - θᵢ)
    // Mean-field: r·exp(iψ) = (1/N) Σ exp(iθⱼ)
    // ═══════════════════════════════════════════════════════════════

    // Compute Kuramoto order parameter r and mean phase ψ
    public func computeKuramotoOrder(drones : [DroneState]) : (Float, Float) {
        let n = drones.size();
        if (n == 0) return (0.0, 0.0);
        var sumSin : Float = 0.0;
        var sumCos : Float = 0.0;
        for (d in drones.vals()) {
            sumSin += Float.sin(d.phase);
            sumCos += Float.cos(d.phase);
        };
        let nf = Float.fromInt(n);
        let r = Float.sqrt((sumSin / nf) * (sumSin / nf) + (sumCos / nf) * (sumCos / nf));
        let psi = Float.arctan(sumSin / (sumCos + 1e-12));
        (r, psi)
    };

    // Update drone phases via Kuramoto step (dt = 1 chimera cycle in seconds)
    public func kuramotoStep(drones : [DroneState], dt : Float) : [DroneState] {
        let (r, psi) = computeKuramotoOrder(drones);
        Array.map<DroneState, DroneState>(drones, func(d) {
            let dtheta = d.naturalFrequency + KURAMOTO_K * r * Float.sin(psi - d.phase);
            let newPhase = d.phase + dtheta * dt;
            { d with phase = newPhase }
        })
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 6: N² SUPERRADIANCE AMPLIFICATION
    // When N drones cluster: signal = baseSignal × N²
    // Quantum coherence emerges from synchronized emission
    // ═══════════════════════════════════════════════════════════════

    public func getSuperradianceAmplification(clusteredCount : Nat, baseSignal : Float) : Float {
        if (clusteredCount < SUPERRADIANCE_THRESHOLD) return baseSignal;
        let n = Float.fromInt(clusteredCount);
        baseSignal * (n * n)
    };

    // Count drones close enough to contribute to superradiance
    public func countClusteredDrones(drones : [DroneState], center : Vec3, radius : Float) : Nat {
        Array.filter<DroneState>(drones, func(d) {
            let dx = d.position.x - center.x;
            let dy = d.position.y - center.y;
            let dz = d.position.z - center.z;
            Float.sqrt(dx*dx + dy*dy + dz*dz) <= radius
        }).size()
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 7: SWARM COHERENCE COMPUTATION
    // Combines Kuramoto order parameter with health and mission status
    // ═══════════════════════════════════════════════════════════════

    public func computeSwarmCoherence(drones : [DroneState]) : Float {
        let n = drones.size();
        if (n == 0) return 0.0;
        let (r, _) = computeKuramotoOrder(drones);
        var healthSum : Float = 0.0;
        for (d in drones.vals()) { healthSum += d.health };
        let avgHealth = healthSum / Float.fromInt(n);
        // Coherence = geometric mean of Kuramoto order and average health
        Float.sqrt(r * avgHealth)
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 8: MISSION GENERATION FROM DOCTRINE
    // Generates missions based on threat/opportunity maps
    // ═══════════════════════════════════════════════════════════════

    public func generateMission(
        coherence : Float,
        threatMap : [(Vec3, Float)],
        opportunityMap : [(Vec3, Float)],
        beatCount : Nat
    ) : ?MissionType {
        // High coherence unlocks offensive missions
        if (coherence < 0.3) return null;

        // Select highest threat for response
        if (threatMap.size() > 0) {
            var maxThreat : Float = 0.0;
            var threatPos : Vec3 = { x = 0.0; y = 0.0; z = 0.0 };
            for ((pos, lvl) in threatMap.vals()) {
                if (lvl > maxThreat) {
                    maxThreat := lvl;
                    threatPos := pos;
                };
            };
            if (maxThreat > 0.7) {
                return ?#Strike({ target = threatPos; force = maxThreat * coherence });
            } else if (maxThreat > 0.3) {
                return ?#Defend({ asset = beatCount % 10; radius = 50.0 * coherence });
            };
        };

        // Patrol on beat cycle (every 12 beats = 1 second at CHIMERA_FREQUENCY)
        if (beatCount % 12 == 0) {
            return ?#Patrol({ zone = beatCount / 12 % 8 });
        };

        // Opportunity gathering
        if (opportunityMap.size() > 0) {
            let (oppPos, _) = opportunityMap[0];
            return ?#Gather({ resourceType = "intelligence"; location = oppPos });
        };

        ?#Monitor({ area = beatCount % 16; duration = 120 })
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 9: PHEROMONE FIELD MANAGEMENT
    // Chemical-inspired gradient coordination
    // ═══════════════════════════════════════════════════════════════

    public func updatePheromoneField(
        fields : [PheromoneField],
        newField : PheromoneField
    ) : [PheromoneField] {
        // Decay existing fields and add new one
        let decayed = Array.map<PheromoneField, PheromoneField>(fields, func(f) {
            { f with strength = f.strength * (1.0 - f.decay) }
        });
        // Remove fields below threshold
        let active = Array.filter<PheromoneField>(decayed, func(f) { f.strength > 0.01 });
        let buf = Buffer.fromArray<PheromoneField>(active);
        buf.add(newField);
        Buffer.toArray(buf)
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 10: EXTERNAL DATA PROCESSING
    // Integrates APIs, Azure feeds, blockchain data into intelligence
    // ═══════════════════════════════════════════════════════════════

    public type ExternalFeed = {
        source : Text;        // "azure" | "blockchain" | "api"
        dataType : Text;      // "threat" | "opportunity" | "market" | "sensor"
        payload : [Float];    // Normalized data values
        confidence : Float;   // 0.0 - 1.0
        timestamp : Int;
    };

    public func processExternalData(
        intel : SwarmIntelligence,
        feeds : [ExternalFeed]
    ) : SwarmIntelligence {
        var threats = Buffer.fromArray<(Vec3, Float)>(intel.threatMap);
        var opportunities = Buffer.fromArray<(Vec3, Float)>(intel.opportunityMap);

        for (feed in feeds.vals()) {
            let weight = feed.confidence * Constants.PHI_INVERSE;
            if (feed.dataType == "threat" and feed.payload.size() >= 4) {
                let pos : Vec3 = {
                    x = feed.payload[0];
                    y = feed.payload[1];
                    z = feed.payload[2];
                };
                threats.add((pos, feed.payload[3] * weight));
            } else if (feed.dataType == "opportunity" and feed.payload.size() >= 4) {
                let pos : Vec3 = {
                    x = feed.payload[0];
                    y = feed.payload[1];
                    z = feed.payload[2];
                };
                opportunities.add((pos, feed.payload[3] * weight));
            };
        };

        {
            intel with
            threatMap = Buffer.toArray(threats);
            opportunityMap = Buffer.toArray(opportunities);
            beatCount = intel.beatCount + 1;
            lastSync = Time.now();
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 11: MASTER CHIMERA UPDATE
    // Full swarm intelligence cycle — called every chimera beat
    // ═══════════════════════════════════════════════════════════════

    public func chimeraUpdate(
        intel : SwarmIntelligence,
        drones : [DroneState]
    ) : (SwarmIntelligence, [DroneState]) {
        let dt = CHIMERA_CYCLE_MS / 1000.0;
        let updatedDrones = kuramotoStep(drones, dt);
        let coherence = computeSwarmCoherence(updatedDrones);
        let (_, meanPhase) = computeKuramotoOrder(updatedDrones);

        // Compute superradiance from clustered drones
        let origin : Vec3 = { x = 0.0; y = 0.0; z = 0.0 };
        let clustered = countClusteredDrones(updatedDrones, origin, 100.0);
        let srGain = getSuperradianceAmplification(clustered, 1.0);

        // Generate new mission if queue has space
        let newMission = generateMission(
            coherence,
            intel.threatMap,
            intel.opportunityMap,
            intel.beatCount
        );
        let missionQueue = switch (newMission) {
            case null intel.missionQueue;
            case (?m) {
                if (intel.missionQueue.size() < MAX_MISSION_QUEUE) {
                    let buf = Buffer.fromArray<MissionType>(intel.missionQueue);
                    buf.add(m);
                    Buffer.toArray(buf)
                } else intel.missionQueue
            };
        };

        let updatedIntel : SwarmIntelligence = {
            intel with
            coherence = coherence;
            meanPhase = meanPhase;
            missionQueue = missionQueue;
            superradianceGain = srGain;
            beatCount = intel.beatCount + 1;
            lastSync = Time.now();
        };

        (updatedIntel, updatedDrones)
    };

}
