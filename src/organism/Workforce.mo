// 𓂀 WORKFORCE CANISTER — 8 EXTERNAL BRAIN PARTS 𓂀
// "Another canister is the workforce"
// "That's where all the workforce models live"
// "They're extensions of the living architecture"

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Constants "Constants";

actor Workforce {
    // ═══════════════════════════════════════════════════════════════
    // WORKFORCE MODEL TYPES — φ-Scaled Cycles
    // "W-ANALYST 1.0M cycles (φ⁰)"
    // "TOTAL 15.944M ≈ 10×φ"
    // ═══════════════════════════════════════════════════════════════

    public type WorkforceType = {
        #Analyst;      // 1.0M cycles   (φ⁰)
        #Strategist;   // 1.618M cycles (φ¹)
        #Builder;      // 2.618M cycles (φ²)
        #Governance;   // 2.618M cycles (φ²)
        #Memory;       // 4.236M cycles (φ³)
        #Risk;         // 0.618M cycles (φ⁻¹)
        #Projection;   // 1.618M cycles (φ¹)
        #Operations;   // 1.618M cycles (φ¹)
    };

    public type WorkforceAgent = {
        id : Nat;
        agentType : WorkforceType;
        allocatedCycles : Nat;
        clientId : ?Principal;
        isActive : Bool;
        createdAt : Int;
        lastActivity : Int;
        doctrineLabels : [Text];
    };

    // ═══════════════════════════════════════════════════════════════
    // STATE: WORKFORCE POOL
    // "Workforce: 8 × N canisters (per-client)"
    // ═══════════════════════════════════════════════════════════════

    stable var nextAgentId : Nat = 1;
    stable var agents : [WorkforceAgent] = [];
    stable var totalCyclesAllocated : Nat = 0;

    // ═══════════════════════════════════════════════════════════════
    // GET CYCLES FOR TYPE — φ-Scaling
    // ═══════════════════════════════════════════════════════════════

    private func getCycles(agentType : WorkforceType) : Nat {
        switch(agentType) {
            case (#Analyst)    { Constants.W_ANALYST_CYCLES };    // 1.0M
            case (#Strategist) { Constants.W_STRATEGIST_CYCLES }; // 1.618M
            case (#Builder)    { Constants.W_BUILDER_CYCLES };    // 2.618M
            case (#Governance) { Constants.W_GOVERNANCE_CYCLES }; // 2.618M
            case (#Memory)     { Constants.W_MEMORY_CYCLES };     // 4.236M
            case (#Risk)       { Constants.W_RISK_CYCLES };       // 0.618M
            case (#Projection) { Constants.W_PROJECTION_CYCLES }; // 1.618M
            case (#Operations) { Constants.W_OPERATIONS_CYCLES }; // 1.618M
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SPAWN AGENT — Create Workforce Extension
    // "That's an extension of the living architecture"
    // ═══════════════════════════════════════════════════════════════

    public func spawnAgent(agentType : WorkforceType, clientId : ?Principal) : async Nat {
        let cycles = getCycles(agentType);
        let now = Time.now();

        let agent : WorkforceAgent = {
            id = nextAgentId;
            agentType = agentType;
            allocatedCycles = cycles;
            clientId = clientId;
            isActive = true;
            createdAt = now;
            lastActivity = now;
            doctrineLabels = [];
        };

        let buffer = Buffer.fromArray<WorkforceAgent>(agents);
        buffer.add(agent);
        agents := Buffer.toArray(buffer);

        totalCyclesAllocated += cycles;
        nextAgentId += 1;

        agent.id
    };

    // ═══════════════════════════════════════════════════════════════
    // SPAWN FULL WORKFORCE FOR CLIENT
    // "Workforce: 8 × N canisters (per-client)"
    // ═══════════════════════════════════════════════════════════════

    public func spawnFullWorkforce(clientId : Principal) : async [Nat] {
        let agentTypes : [WorkforceType] = [
            #Analyst, #Strategist, #Builder, #Governance,
            #Memory, #Risk, #Projection, #Operations
        ];

        let ids = Buffer.Buffer<Nat>(8);
        
        for (t in Iter.fromArray(agentTypes)) {
            let id = await spawnAgent(t, ?clientId);
            ids.add(id);
        };

        Buffer.toArray(ids)
    };

    // ═══════════════════════════════════════════════════════════════
    // LABEL WITH DOCTRINE
    // "It spins up whatever that category of task doctrine is"
    // "And it keeps that doctrine for any type of those tasks going forward"
    // "And it labels him on that"
    // ═══════════════════════════════════════════════════════════════

    public func labelWithDoctrine(agentId : Nat, doctrine : Text) : async Bool {
        let updated = Array.map<WorkforceAgent, WorkforceAgent>(agents, func(a) {
            if (a.id == agentId) {
                let buffer = Buffer.fromArray<Text>(a.doctrineLabels);
                buffer.add(doctrine);
                {
                    a with
                    doctrineLabels = Buffer.toArray(buffer);
                    lastActivity = Time.now();
                }
            } else {
                a
            }
        });
        agents := updated;
        true
    };

    // ═══════════════════════════════════════════════════════════════
    // QUERY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    public query func getAgent(agentId : Nat) : async ?WorkforceAgent {
        Array.find<WorkforceAgent>(agents, func(a) { a.id == agentId })
    };

    public query func getAgentsByType(agentType : WorkforceType) : async [WorkforceAgent] {
        Array.filter<WorkforceAgent>(agents, func(a) { a.agentType == agentType })
    };

    public query func getAgentsByClient(clientId : Principal) : async [WorkforceAgent] {
        Array.filter<WorkforceAgent>(agents, func(a) {
            switch(a.clientId) {
                case (?cid) { cid == clientId };
                case null { false };
            }
        })
    };

    public query func getTotalCycles() : async Nat {
        totalCyclesAllocated
    };

    public query func getAgentCount() : async Nat {
        Array.size(agents)
    };

    public query func getActiveAgentCount() : async Nat {
        Array.size(Array.filter<WorkforceAgent>(agents, func(a) { a.isActive }))
    };

    // ═══════════════════════════════════════════════════════════════
    // DEACTIVATE AGENT
    // ═══════════════════════════════════════════════════════════════

    public func deactivateAgent(agentId : Nat) : async Bool {
        let updated = Array.map<WorkforceAgent, WorkforceAgent>(agents, func(a) {
            if (a.id == agentId) {
                { a with isActive = false }
            } else {
                a
            }
        });
        agents := updated;
        true
    };

    // ═══════════════════════════════════════════════════════════════
    // SYSTEM INFO
    // ═══════════════════════════════════════════════════════════════

    public query func getInfo() : async Text {
        "WORKFORCE CANISTER | 8 Types | φ-Scaled | Total: " # 
        Nat.toText(Array.size(agents)) # " agents | " #
        Nat.toText(totalCyclesAllocated) # " cycles allocated"
    };
};

import Iter "mo:base/Iter";
