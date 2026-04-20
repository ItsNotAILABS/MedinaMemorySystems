// 𓂀 DRONE FLEET MANAGER — SCALE-INVARIANT SWARM COORDINATION 𓂀
// Fibonacci sphere packing, Kuramoto mean-field sync, golden angle formations.
// O(N) synchronization. Squadron scaling: ceil(sqrt(N/20)).
// Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Constants "Constants";

module DroneFleetManager {

    // ═══════════════════════════════════════════════════════════════
    // SECTION 1: FLEET CONSTANTS
    // Golden angle in radians = 2π/φ² ≈ 2.39996 rad
    // Value inheritance: organism values propagate at 95% rate
    // ═══════════════════════════════════════════════════════════════

    public let MAX_DRONES : Nat = 64;
    public let VALUE_INHERITANCE : Float = 0.95;
    public let GOLDEN_ANGLE_RAD : Float = 2.39996;     // 2π/φ² in radians
    public let KURAMOTO_K : Float = 2.5;               // Coupling strength
    public let SQUADRON_DIVISOR : Nat = 20;            // ceil(sqrt(N/20))
    public let BRAIN_NODES : Nat = 96;                 // Coupled neural nodes

    // ═══════════════════════════════════════════════════════════════
    // SECTION 2: CORE TYPES
    // ═══════════════════════════════════════════════════════════════

    public type Vec3 = { x : Float; y : Float; z : Float };

    public type FormationType = {
        #GoldenAngle;
        #FibonacciSpiral;
        #PhiLattice;
        #Perimeter;
        #Diamond;
        #Arrow;
    };

    public type Drone = {
        id : Nat;
        position : Vec3;
        velocity : Vec3;
        phase : Float;       // Kuramoto phase θᵢ
        health : Float;      // 0.0 - 1.0
        value : Float;       // Inherited from organism (0.0 - 1.0)
        squadId : Nat;
        naturalFrequency : Float; // ωᵢ
        active : Bool;
    };

    public type Squadron = {
        id : Nat;
        leaderId : Nat;
        formation : FormationType;
        drones : [Nat];      // Drone ids
        missionId : ?Nat;
        coherence : Float;
    };

    public type Fleet = {
        drones : [Drone];
        squadrons : [Squadron];
        totalCoherence : Float;
        beatCount : Nat;
        valueInheritance : Float;
        brainPhase : Float;  // Current 96-node brain mean phase
        lastUpdate : Int;
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 3: INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    public func initFleet() : Fleet {
        {
            drones = [];
            squadrons = [];
            totalCoherence = 0.0;
            beatCount = 0;
            valueInheritance = VALUE_INHERITANCE;
            brainPhase = 0.0;
            lastUpdate = Time.now();
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 4: FIBONACCI SPHERE POSITION
    // Position drone id on sphere via golden angle packing
    // θ = id × GOLDEN_ANGLE_RAD  (sunflower/Vogel distribution)
    // ═══════════════════════════════════════════════════════════════

    public func fibonacciSpherePosition(id : Nat, radius : Float, total : Nat) : Vec3 {
        let n = Float.fromInt(id);
        let totalF = Float.fromInt(if (total < 1) 1 else total);
        // Golden angle spiral on sphere
        let theta = n * GOLDEN_ANGLE_RAD;
        // Latitude from evenly spaced z-values
        let z = radius * (1.0 - 2.0 * n / totalF);
        let rFlat = Float.sqrt(Float.max(0.0, radius * radius - z * z));
        {
            x = rFlat * Float.cos(theta);
            y = rFlat * Float.sin(theta);
            z = z;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 5: DRONE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    public func addDrone(fleet : Fleet, inheritedValue : Float) : Fleet {
        let n = fleet.drones.size();
        if (n >= MAX_DRONES) return fleet;

        let id = n;
        let pos = fibonacciSpherePosition(id, 100.0, MAX_DRONES);
        let drone : Drone = {
            id = id;
            position = pos;
            velocity = { x = 0.0; y = 0.0; z = 0.0 };
            phase = Float.fromInt(id) * GOLDEN_ANGLE_RAD;
            health = 1.0;
            value = inheritedValue * VALUE_INHERITANCE;
            squadId = 0;
            naturalFrequency = 12.0 + (Float.fromInt(id % 7) * 0.1 - 0.3);
            active = true;
        };
        let buf = Buffer.fromArray<Drone>(fleet.drones);
        buf.add(drone);
        { fleet with drones = Buffer.toArray(buf) }
    };

    public func removeDrone(fleet : Fleet, id : Nat) : Fleet {
        { fleet with
            drones = Array.filter<Drone>(fleet.drones, func(d) { d.id != id })
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 6: SQUADRON ASSIGNMENT
    // Scale-invariant: squadCount = ceil(sqrt(N / 20))
    // N=64 → ceil(sqrt(3.2)) = 2 squads
    // N=100 → 3, N=500 → 5, N=50000 → 50
    // ═══════════════════════════════════════════════════════════════

    // Integer square root (floor)
    func isqrt(n : Nat) : Nat {
        if (n == 0) return 0;
        var x = n;
        var y = (x + 1) / 2;
        while (y < x) {
            x := y;
            y := (x + n / x) / 2;
        };
        x
    };

    func ceilSqrt(n : Nat) : Nat {
        let s = isqrt(n);
        if (s * s == n) s else s + 1
    };

    public func computeSquadronCount(droneCount : Nat) : Nat {
        if (droneCount == 0) return 0;
        let ratio = (droneCount + SQUADRON_DIVISOR - 1) / SQUADRON_DIVISOR;
        let sq = ceilSqrt(ratio);
        if (sq < 1) 1 else sq
    };

    public func assignSquadrons(fleet : Fleet) : Fleet {
        let n = fleet.drones.size();
        if (n == 0) return fleet;

        let squadCount = computeSquadronCount(n);
        let dronesPerSquad = (n + squadCount - 1) / squadCount;

        let formations : [FormationType] = [
            #GoldenAngle, #FibonacciSpiral, #PhiLattice,
            #Perimeter, #Diamond, #Arrow
        ];

        let squads = Array.tabulate<Squadron>(squadCount, func(sid) {
            let startIdx = sid * dronesPerSquad;
            let endIdx = Nat.min(startIdx + dronesPerSquad, n);
            let count = if (endIdx > startIdx) endIdx - startIdx else 0;
            let droneIds = Array.tabulate<Nat>(count, func(i) {
                fleet.drones[startIdx + i].id
            });
            let leaderId = if (droneIds.size() > 0) droneIds[0] else 0;
            let formation = formations[sid % formations.size()];
            {
                id = sid;
                leaderId = leaderId;
                formation = formation;
                drones = droneIds;
                missionId = null;
                coherence = 0.0;
            }
        });

        // Tag drones with their squad
        let taggedDrones = Array.map<Drone, Drone>(fleet.drones, func(d) {
            let squadId = d.id / dronesPerSquad;
            { d with squadId = Nat.min(squadId, squadCount - 1) }
        });

        { fleet with drones = taggedDrones; squadrons = squads }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 7: KURAMOTO SYNCHRONIZATION (O(N) MEAN FIELD)
    // dθᵢ/dt = ωᵢ + K·r·sin(ψ - θᵢ)
    // Computed via single pass mean-field — O(N)
    // ═══════════════════════════════════════════════════════════════

    func computeMeanField(drones : [Drone]) : (Float, Float) {
        let n = drones.size();
        if (n == 0) return (0.0, 0.0);
        var sumSin : Float = 0.0;
        var sumCos : Float = 0.0;
        for (d in drones.vals()) {
            if (d.active) {
                sumSin += Float.sin(d.phase);
                sumCos += Float.cos(d.phase);
            };
        };
        let nf = Float.fromInt(n);
        let r = Float.sqrt(sumSin * sumSin + sumCos * sumCos) / nf;
        let psi = Float.arctan(sumSin / (sumCos + 1e-12));
        (r, psi)
    };

    public func kuramotoStep(fleet : Fleet, dt : Float) : Fleet {
        let (r, psi) = computeMeanField(fleet.drones);
        let updatedDrones = Array.map<Drone, Drone>(fleet.drones, func(d) {
            if (not d.active) return d;
            let dtheta = d.naturalFrequency + KURAMOTO_K * r * Float.sin(psi - d.phase);
            { d with phase = d.phase + dtheta * dt }
        });
        { fleet with
            drones = updatedDrones;
            totalCoherence = r;
            beatCount = fleet.beatCount + 1;
            lastUpdate = Time.now();
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 8: VALUE INHERITANCE
    // Organism doctrine values propagate down to drones at 95% rate
    // drones.value = organism.value × VALUE_INHERITANCE
    // ═══════════════════════════════════════════════════════════════

    public func inheritValues(fleet : Fleet, organismValue : Float) : Fleet {
        let inheritedValue = organismValue * VALUE_INHERITANCE;
        let updatedDrones = Array.map<Drone, Drone>(fleet.drones, func(d) {
            // Gradual convergence toward inherited value
            let newValue = d.value + (inheritedValue - d.value) * 0.1;
            { d with value = newValue }
        });
        { fleet with drones = updatedDrones }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 9: FORMATION POSITIONS
    // Each formation type produces a grid of target positions
    // ═══════════════════════════════════════════════════════════════

    public func getFormationPositions(
        formation : FormationType,
        center : Vec3,
        count : Nat,
        scale : Float
    ) : [Vec3] {
        switch (formation) {
            case (#GoldenAngle) {
                Array.tabulate<Vec3>(count, func(i) {
                    let angle = Float.fromInt(i) * GOLDEN_ANGLE_RAD;
                    let r = scale * Float.sqrt(Float.fromInt(i + 1));
                    {
                        x = center.x + r * Float.cos(angle);
                        y = center.y + r * Float.sin(angle);
                        z = center.z;
                    }
                })
            };
            case (#FibonacciSpiral) {
                Array.tabulate<Vec3>(count, func(i) {
                    fibonacciSpherePosition(i, scale, count)
                })
            };
            case (#PhiLattice) {
                Array.tabulate<Vec3>(count, func(i) {
                    let row = Float.fromInt(i / 8);
                    let col = Float.fromInt(i % 8);
                    {
                        x = center.x + col * scale * Constants.PHI_INVERSE;
                        y = center.y + row * scale * Constants.PHI_INVERSE;
                        z = center.z;
                    }
                })
            };
            case (#Perimeter) {
                Array.tabulate<Vec3>(count, func(i) {
                    let angle = Float.fromInt(i) * Constants.TAU / Float.fromInt(count);
                    {
                        x = center.x + scale * Float.cos(angle);
                        y = center.y + scale * Float.sin(angle);
                        z = center.z;
                    }
                })
            };
            case (#Diamond) {
                Array.tabulate<Vec3>(count, func(i) {
                    let angle = Float.fromInt(i) * Constants.TAU / Float.fromInt(count);
                    let r = if (i % 2 == 0) scale else scale * Constants.PHI_INVERSE;
                    {
                        x = center.x + r * Float.cos(angle);
                        y = center.y + r * Float.sin(angle);
                        z = center.z;
                    }
                })
            };
            case (#Arrow) {
                Array.tabulate<Vec3>(count, func(i) {
                    let fi = Float.fromInt(i);
                    {
                        x = center.x + fi * scale * 0.5;
                        y = center.y - Float.abs(fi - Float.fromInt(count) / 2.0) * scale * 0.3;
                        z = center.z;
                    }
                })
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 10: FLEET COHERENCE
    // ═══════════════════════════════════════════════════════════════

    public func computeFleetCoherence(fleet : Fleet) : Float {
        let n = fleet.drones.size();
        if (n == 0) return 0.0;
        let (r, _) = computeMeanField(fleet.drones);
        var healthSum : Float = 0.0;
        var valueSum : Float = 0.0;
        for (d in fleet.drones.vals()) {
            healthSum += d.health;
            valueSum += d.value;
        };
        let nf = Float.fromInt(n);
        let avgHealth = healthSum / nf;
        let avgValue = valueSum / nf;
        // Triple coherence: phase sync × health × value alignment
        Float.pow(r * avgHealth * avgValue, 1.0 / 3.0)
    };

}
