/**
 * 𓂀 SANDBOX CANISTER - ICP DEPLOYMENT 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * The sandbox that users see on ICP. Not the real organism.
 * A controlled clone with gated access.
 * 
 * Click, deploy, boom.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Option "mo:base/Option";

module SandboxCanister {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // TYPES
    // ═══════════════════════════════════════════════════════════════════════════
    
    public type SandboxTier = {
        #Public;
        #Enterprise;
        #Partner;
        #Internal;
        #Sovereign;
    };
    
    public type GateLevel = {
        #Open;
        #Partial;
        #Obscured;
        #Sealed;
        #Protected;
    };
    
    public type SandboxGate = {
        id: Text;
        capability: Text;
        level: GateLevel;
        tier: SandboxTier;
        exposedMethods: [Text];
        frequency: Float;
    };
    
    public type SandboxState = {
        active: Bool;
        version: Text;
        tier: SandboxTier;
        gates: [SandboxGate];
        created: Int;
        lastAccess: Int;
        frequency: Float;
    };
    
    public type UserSession = {
        userId: Principal;
        tier: SandboxTier;
        created: Int;
        lastAccess: Int;
        apiCalls: Nat;
    };
    
    public type FeedbackEntry = {
        id: Text;
        userId: Principal;
        feedbackType: Text;
        content: Text;
        grade: ?Text;
        processed: Bool;
        created: Int;
    };
    
    public type ApiResponse = {
        success: Bool;
        data: ?Text;
        error: ?Text;
        frequency: Float;
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CONSTANTS
    // ═══════════════════════════════════════════════════════════════════════════
    
    public let SANDBOX_CONSTANTS = {
        VERSION: "1.0.0";
        HEARTBEAT_MS: 873;
        
        FREQUENCIES: {
            PUBLIC: 396.0;
            ENTERPRISE: 528.0;
            PARTNER: 639.0;
            INTERNAL: 852.0;
            SOVEREIGN: 963.0;
        };
        
        CAPABILITIES: [
            "MEMORY_VAULT",
            "DOCUMENT_INTELLIGENCE",
            "KNOWLEDGE_GRAPH",
            "SEMANTIC_SEARCH",
            "CONTEXT_ENGINE",
            "PATTERN_RECOGNITION",
            "TEMPORAL_MEMORY",
            "SACRED_GEOMETRY",
            "FREQUENCY_ALIGNMENT",
            "ORGANISM_SYNC"
        ];
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SANDBOX CANISTER CLASS
    // ═══════════════════════════════════════════════════════════════════════════
    
    public class Sandbox() {
        private var state: SandboxState = {
            active = false;
            version = SANDBOX_CONSTANTS.VERSION;
            tier = #Public;
            gates = [];
            created = Time.now();
            lastAccess = Time.now();
            frequency = SANDBOX_CONSTANTS.FREQUENCIES.PUBLIC;
        };
        
        private var sessions = HashMap.HashMap<Principal, UserSession>(100, Principal.equal, Principal.hash);
        private var feedback = Buffer.Buffer<FeedbackEntry>(1000);
        private var gatesMap = HashMap.HashMap<Text, SandboxGate>(50, Text.equal, Text.hash);
        
        // ═══════════════════════════════════════════════════════════════════════
        // INITIALIZATION
        // ═══════════════════════════════════════════════════════════════════════
        
        public func initialize(tier: SandboxTier): () {
            state := {
                state with
                active = true;
                tier = tier;
                created = Time.now();
                frequency = getFrequencyForTier(tier);
            };
            
            initializeGates(tier);
        };
        
        private func initializeGates(tier: SandboxTier): () {
            // Initialize gates for all capabilities
            for (capability in SANDBOX_CONSTANTS.CAPABILITIES.vals()) {
                let gate: SandboxGate = {
                    id = "gate_" # capability;
                    capability = capability;
                    level = getDefaultGateLevel(tier);
                    tier = tier;
                    exposedMethods = getExposedMethods(capability, tier);
                    frequency = getFrequencyForTier(tier);
                };
                
                gatesMap.put(capability, gate);
            };
        };
        
        private func getFrequencyForTier(tier: SandboxTier): Float {
            switch (tier) {
                case (#Public) { SANDBOX_CONSTANTS.FREQUENCIES.PUBLIC };
                case (#Enterprise) { SANDBOX_CONSTANTS.FREQUENCIES.ENTERPRISE };
                case (#Partner) { SANDBOX_CONSTANTS.FREQUENCIES.PARTNER };
                case (#Internal) { SANDBOX_CONSTANTS.FREQUENCIES.INTERNAL };
                case (#Sovereign) { SANDBOX_CONSTANTS.FREQUENCIES.SOVEREIGN };
            };
        };
        
        private func getDefaultGateLevel(tier: SandboxTier): GateLevel {
            switch (tier) {
                case (#Public) { #Partial };
                case (#Enterprise) { #Open };
                case (#Partner) { #Open };
                case (#Internal) { #Open };
                case (#Sovereign) { #Protected };
            };
        };
        
        private func getExposedMethods(capability: Text, tier: SandboxTier): [Text] {
            switch (tier) {
                case (#Public) { ["basic", "query"] };
                case (#Enterprise) { ["basic", "query", "advanced", "batch"] };
                case (#Partner) { ["basic", "query", "advanced", "batch", "custom"] };
                case (#Internal) { ["basic", "query", "advanced", "batch", "custom", "internal"] };
                case (#Sovereign) { ["basic", "query", "advanced", "batch", "custom", "internal", "sovereign"] };
            };
        };
        
        // ═══════════════════════════════════════════════════════════════════════
        // SESSION MANAGEMENT
        // ═══════════════════════════════════════════════════════════════════════
        
        public func createSession(userId: Principal, tier: SandboxTier): UserSession {
            let session: UserSession = {
                userId = userId;
                tier = tier;
                created = Time.now();
                lastAccess = Time.now();
                apiCalls = 0;
            };
            
            sessions.put(userId, session);
            session;
        };
        
        public func getSession(userId: Principal): ?UserSession {
            sessions.get(userId);
        };
        
        public func updateSessionAccess(userId: Principal): Bool {
            switch (sessions.get(userId)) {
                case (?session) {
                    let updated: UserSession = {
                        session with
                        lastAccess = Time.now();
                        apiCalls = session.apiCalls + 1;
                    };
                    sessions.put(userId, updated);
                    true;
                };
                case null { false };
            };
        };
        
        // ═══════════════════════════════════════════════════════════════════════
        // ACCESS CONTROL
        // ═══════════════════════════════════════════════════════════════════════
        
        public func canAccess(userId: Principal, capability: Text): Bool {
            switch (sessions.get(userId)) {
                case (?session) {
                    switch (gatesMap.get(capability)) {
                        case (?gate) {
                            canTierAccess(session.tier, gate.level);
                        };
                        case null { false };
                    };
                };
                case null { false };
            };
        };
        
        private func canTierAccess(userTier: SandboxTier, gateLevel: GateLevel): Bool {
            switch (gateLevel) {
                case (#Open) { true };
                case (#Partial) { true };
                case (#Obscured) { false };
                case (#Sealed) { false };
                case (#Protected) {
                    switch (userTier) {
                        case (#Sovereign) { true };
                        case (_) { false };
                    };
                };
            };
        };
        
        public func getExposedAPI(userId: Principal, capability: Text): [Text] {
            switch (sessions.get(userId)) {
                case (?session) {
                    switch (gatesMap.get(capability)) {
                        case (?gate) { gate.exposedMethods };
                        case null { [] };
                    };
                };
                case null { [] };
            };
        };
        
        // ═══════════════════════════════════════════════════════════════════════
        // API ENDPOINTS (What users see)
        // ═══════════════════════════════════════════════════════════════════════
        
        public func memoryVaultStore(userId: Principal, content: Text): ApiResponse {
            if (not canAccess(userId, "MEMORY_VAULT")) {
                return { success = false; data = null; error = ?"Access denied"; frequency = 0.0 };
            };
            
            ignore updateSessionAccess(userId);
            
            // Simulated storage (actual implementation would call real canister)
            {
                success = true;
                data = ?"Memory stored successfully";
                error = null;
                frequency = 528.0;
            };
        };
        
        public func memoryVaultRetrieve(userId: Principal, query: Text): ApiResponse {
            if (not canAccess(userId, "MEMORY_VAULT")) {
                return { success = false; data = null; error = ?"Access denied"; frequency = 0.0 };
            };
            
            ignore updateSessionAccess(userId);
            
            {
                success = true;
                data = ?"[Memory results for: " # query # "]";
                error = null;
                frequency = 528.0;
            };
        };
        
        public func semanticSearch(userId: Principal, query: Text): ApiResponse {
            if (not canAccess(userId, "SEMANTIC_SEARCH")) {
                return { success = false; data = null; error = ?"Access denied"; frequency = 0.0 };
            };
            
            ignore updateSessionAccess(userId);
            
            {
                success = true;
                data = ?"[Search results for: " # query # "]";
                error = null;
                frequency = 852.0;
            };
        };
        
        public func knowledgeGraphCreate(userId: Principal, node: Text): ApiResponse {
            if (not canAccess(userId, "KNOWLEDGE_GRAPH")) {
                return { success = false; data = null; error = ?"Access denied"; frequency = 0.0 };
            };
            
            ignore updateSessionAccess(userId);
            
            {
                success = true;
                data = ?"Node created: " # node;
                error = null;
                frequency = 741.0;
            };
        };
        
        // ═══════════════════════════════════════════════════════════════════════
        // FEEDBACK SYSTEM
        // ═══════════════════════════════════════════════════════════════════════
        
        public func submitFeedback(
            userId: Principal,
            feedbackType: Text,
            content: Text
        ): FeedbackEntry {
            let entry: FeedbackEntry = {
                id = "feedback_" # Int.toText(Time.now());
                userId = userId;
                feedbackType = feedbackType;
                content = content;
                grade = null;
                processed = false;
                created = Time.now();
            };
            
            feedback.add(entry);
            entry;
        };
        
        public func getFeedbackCount(): Nat {
            feedback.size();
        };
        
        // ═══════════════════════════════════════════════════════════════════════
        // STATE
        // ═══════════════════════════════════════════════════════════════════════
        
        public func getState(): SandboxState {
            state;
        };
        
        public func isActive(): Bool {
            state.active;
        };
        
        public func getVersion(): Text {
            state.version;
        };
        
        public func pulse(): () {
            state := { state with lastAccess = Time.now() };
        };
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    public func createPublicSandbox(): Sandbox {
        let sandbox = Sandbox();
        sandbox.initialize(#Public);
        sandbox;
    };
    
    public func createEnterpriseSandbox(): Sandbox {
        let sandbox = Sandbox();
        sandbox.initialize(#Enterprise);
        sandbox;
    };
};
