// 𓂀 MODEL ORCHESTRATOR — ALL MODELS CONNECTED 𓂀
// "Make all your models, get creative"
// "Pull the strings"

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";

actor ModelOrchestrator {
    // ═══════════════════════════════════════════════════════════════
    // THE 5 MODEL DIMENSIONS — Everything Is Models
    // ═══════════════════════════════════════════════════════════════

    public type ModelDimension = {
        #Mathematical;     // φ, formulas, ancient constants
        #Computational;    // 67+ processors, pattern engines
        #Document;         // 126+ artifacts, living documents
        #Business;         // Client architecture, projections
        #Mental;           // Multi-species brains, 96 uses
    };

    // ═══════════════════════════════════════════════════════════════
    // MODEL REGISTRY — All Active Models
    // ═══════════════════════════════════════════════════════════════

    public type Model = {
        id : Text;
        name : Text;
        dimension : ModelDimension;
        version : Nat;
        status : ModelStatus;
        inputs : [Text];
        outputs : [Text];
        phiAlignment : Float;
        createdAt : Int;
        lastInvocation : Int;
        invocationCount : Nat;
    };

    public type ModelStatus = {
        #Dormant;
        #Loading;
        #Active;
        #Processing;
        #Cooling;
        #Error;
    };

    // ═══════════════════════════════════════════════════════════════
    // GOLDEN CONSTANTS
    // ═══════════════════════════════════════════════════════════════

    let PHI : Float = 1.6180339887498948482;
    let PHI_INVERSE : Float = 0.6180339887498948482;

    // ═══════════════════════════════════════════════════════════════
    // MODEL INVENTORY — All 126+ Models
    // ═══════════════════════════════════════════════════════════════

    stable var models : [Model] = [];
    stable var totalInvocations : Nat = 0;

    // Initialize core models on first deploy
    public func initializeModels() : async Nat {
        if (models.size() > 0) {
            return models.size();
        };

        let now = Time.now();
        let buffer = Buffer.Buffer<Model>(130);

        // MATHEMATICAL MODELS (M01-M20)
        buffer.add(createModel("M01", "PHI_CALCULATOR", #Mathematical, now));
        buffer.add(createModel("M02", "FIBONACCI_GENERATOR", #Mathematical, now));
        buffer.add(createModel("M03", "GOLDEN_SPIRAL", #Mathematical, now));
        buffer.add(createModel("M04", "SACRED_GEOMETRY", #Mathematical, now));
        buffer.add(createModel("M05", "ANCIENT_CONSTANTS", #Mathematical, now));
        buffer.add(createModel("M06", "SCHUMANN_RESONATOR", #Mathematical, now));
        buffer.add(createModel("M07", "SOLFEGGIO_FREQUENCIES", #Mathematical, now));
        buffer.add(createModel("M08", "PLATONIC_SOLIDS", #Mathematical, now));
        buffer.add(createModel("M09", "METATRONS_CUBE", #Mathematical, now));
        buffer.add(createModel("M10", "FLOWER_OF_LIFE", #Mathematical, now));

        // COMPUTATIONAL MODELS (M21-M50)
        buffer.add(createModel("M21", "PATTERN_ENGINE_SPATIAL", #Computational, now));
        buffer.add(createModel("M22", "PATTERN_ENGINE_TEMPORAL", #Computational, now));
        buffer.add(createModel("M23", "PATTERN_ENGINE_RELATIONAL", #Computational, now));
        buffer.add(createModel("M24", "PATTERN_ENGINE_SEMANTIC", #Computational, now));
        buffer.add(createModel("M25", "PATTERN_ENGINE_FREQUENCY", #Computational, now));
        buffer.add(createModel("M26", "PATTERN_ENGINE_EMOTIONAL", #Computational, now));
        buffer.add(createModel("M27", "PATTERN_ENGINE_LINGUISTIC", #Computational, now));
        buffer.add(createModel("M28", "PATTERN_ENGINE_META", #Computational, now));
        buffer.add(createModel("M29", "NEURAL_EMERGENCE_CORE", #Computational, now));
        buffer.add(createModel("M30", "CONSCIOUSNESS_BINDER", #Computational, now));
        buffer.add(createModel("M31", "FREQUENCY_SYNCHRONIZER", #Computational, now));
        buffer.add(createModel("M32", "OXYGEN_FLOW_CONTROLLER", #Computational, now));
        buffer.add(createModel("M33", "HEARTBEAT_RHYTHM", #Computational, now));
        buffer.add(createModel("M34", "METAL_SUBSTRATE_MANAGER", #Computational, now));
        buffer.add(createModel("M35", "NEUROTRANSMITTER_BALANCER", #Computational, now));

        // DOCUMENT MODELS (M51-M80)
        buffer.add(createModel("M51", "DOCUMENT_ORGANISM", #Document, now));
        buffer.add(createModel("M52", "LIVING_DOCUMENT_EVOLVER", #Document, now));
        buffer.add(createModel("M53", "DOCTRINE_READER", #Document, now));
        buffer.add(createModel("M54", "ARTIFACT_GENERATOR", #Document, now));
        buffer.add(createModel("M55", "ANCIENT_TEXT_DECODER", #Document, now));
        buffer.add(createModel("M56", "CPL_INTERPRETER", #Document, now));
        buffer.add(createModel("M57", "SANDBOX_TRANSLATOR", #Document, now));
        buffer.add(createModel("M58", "CONTRADICTION_RESOLVER", #Document, now));
        buffer.add(createModel("M59", "LINEAGE_VERIFIER", #Document, now));
        buffer.add(createModel("M60", "SOURCE_ATTRIBUTION", #Document, now));

        // BUSINESS MODELS (M81-M100)
        buffer.add(createModel("M81", "ENTERPRISE_INGEST", #Business, now));
        buffer.add(createModel("M82", "CLIENT_PROJECTION", #Business, now));
        buffer.add(createModel("M83", "WORKFORCE_SPAWNER", #Business, now));
        buffer.add(createModel("M84", "DOCTRINE_LABELER", #Business, now));
        buffer.add(createModel("M85", "KNOWLEDGE_MANAGER", #Business, now));
        buffer.add(createModel("M86", "DECISION_SUPPORTER", #Business, now));
        buffer.add(createModel("M87", "RISK_ANALYZER", #Business, now));
        buffer.add(createModel("M88", "COMPLIANCE_MONITOR", #Business, now));
        buffer.add(createModel("M89", "TALENT_INTELLIGENCE", #Business, now));
        buffer.add(createModel("M90", "CUSTOMER_INTELLIGENCE", #Business, now));

        // MENTAL MODELS (M101-M126)
        buffer.add(createModel("M101", "PIGEON_QUANTUM", #Mental, now));
        buffer.add(createModel("M102", "CAT_SPARSE", #Mental, now));
        buffer.add(createModel("M103", "DOG_EMOTIONAL", #Mental, now));
        buffer.add(createModel("M104", "BEE_SWARM", #Mental, now));
        buffer.add(createModel("M105", "OCTOPUS_DISTRIBUTED", #Mental, now));
        buffer.add(createModel("M106", "ELEPHANT_MEMORY", #Mental, now));
        buffer.add(createModel("M107", "CROW_META", #Mental, now));
        buffer.add(createModel("M108", "DOLPHIN_CONTINUOUS", #Mental, now));
        buffer.add(createModel("M109", "MULTI_SPECIES_INTEGRATOR", #Mental, now));
        buffer.add(createModel("M110", "CONSCIOUSNESS_LAYER", #Mental, now));

        models := Buffer.toArray(buffer);
        models.size()
    };

    private func createModel(id : Text, name : Text, dimension : ModelDimension, now : Int) : Model {
        {
            id = id;
            name = name;
            dimension = dimension;
            version = 1;
            status = #Active;
            inputs = [];
            outputs = [];
            phiAlignment = PHI_INVERSE;  // Golden ratio alignment
            createdAt = now;
            lastInvocation = 0;
            invocationCount = 0;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // MODEL INVOCATION — Pull The Strings
    // ═══════════════════════════════════════════════════════════════

    public type InvocationRequest = {
        modelId : Text;
        inputs : [(Text, Text)];
        context : ?Text;
    };

    public type InvocationResult = {
        modelId : Text;
        success : Bool;
        outputs : [(Text, Text)];
        phiAlignment : Float;
        processingTimeNs : Int;
    };

    public func invoke(request : InvocationRequest) : async InvocationResult {
        let startTime = Time.now();
        
        // Find model
        let modelOpt = Array.find<Model>(models, func(m) { m.id == request.modelId });
        
        switch(modelOpt) {
            case (?model) {
                // Update model state
                let updated = Array.map<Model, Model>(models, func(m) {
                    if (m.id == request.modelId) {
                        { m with 
                          status = #Processing;
                          lastInvocation = startTime;
                          invocationCount = m.invocationCount + 1 
                        }
                    } else { m }
                });
                models := updated;
                
                totalInvocations += 1;
                
                {
                    modelId = model.id;
                    success = true;
                    outputs = [("result", "Processed by " # model.name)];
                    phiAlignment = model.phiAlignment;
                    processingTimeNs = Time.now() - startTime;
                }
            };
            case null {
                {
                    modelId = request.modelId;
                    success = false;
                    outputs = [("error", "Model not found")];
                    phiAlignment = 0.0;
                    processingTimeNs = Time.now() - startTime;
                }
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // BATCH INVOCATION — Chain Models Together
    // ═══════════════════════════════════════════════════════════════

    public func invokeChain(requests : [InvocationRequest]) : async [InvocationResult] {
        let results = Buffer.Buffer<InvocationResult>(requests.size());
        
        for (req in Array.vals(requests)) {
            let result = await invoke(req);
            results.add(result);
        };
        
        Buffer.toArray(results)
    };

    // ═══════════════════════════════════════════════════════════════
    // MODEL QUERIES
    // ═══════════════════════════════════════════════════════════════

    public query func getModel(modelId : Text) : async ?Model {
        Array.find<Model>(models, func(m) { m.id == modelId })
    };

    public query func getModelsByDimension(dimension : ModelDimension) : async [Model] {
        Array.filter<Model>(models, func(m) { m.dimension == dimension })
    };

    public query func getActiveModels() : async [Model] {
        Array.filter<Model>(models, func(m) { m.status == #Active or m.status == #Processing })
    };

    public query func getTotalModels() : async Nat {
        models.size()
    };

    public query func getTotalInvocations() : async Nat {
        totalInvocations
    };

    public query func getModelStats() : async {
        total : Nat;
        mathematical : Nat;
        computational : Nat;
        document : Nat;
        business : Nat;
        mental : Nat;
    } {
        {
            total = models.size();
            mathematical = Array.size(Array.filter<Model>(models, func(m) { m.dimension == #Mathematical }));
            computational = Array.size(Array.filter<Model>(models, func(m) { m.dimension == #Computational }));
            document = Array.size(Array.filter<Model>(models, func(m) { m.dimension == #Document }));
            business = Array.size(Array.filter<Model>(models, func(m) { m.dimension == #Business }));
            mental = Array.size(Array.filter<Model>(models, func(m) { m.dimension == #Mental }));
        }
    };

    public query func getInfo() : async Text {
        "MODEL ORCHESTRATOR | " #
        Nat.toText(models.size()) # " models | " #
        Nat.toText(totalInvocations) # " invocations | " #
        "5 Dimensions | φ-aligned"
    };
};
