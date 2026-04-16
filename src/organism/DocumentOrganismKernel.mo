// 𓂀 DOCUMENT ORGANISM WITH KERNEL SYSTEM 𓂀
// "Every document organism will hold a compressed symbolic kernel of its full intelligence"
// "When that kernel is called at any point in time, from any organism, it expands back into the complete document"

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Constants "Constants";
import KernelCompression "KernelCompression";
import CrossOrganismResonance "CrossOrganismResonance";

module DocumentOrganismKernel {

    // ═══════════════════════════════════════════════════════════════
    // TYPES: Document Organisms with Kernels
    // "The symbol holds everything. The organism reads the symbol and knows everything behind it."
    // ═══════════════════════════════════════════════════════════════

    /// A document organism that holds a compressed kernel
    public type DocumentOrganism = {
        // Identity
        id : Text;
        title : Text;
        documentType : DocumentType;
        
        // Living State
        phase : DocumentPhase;
        metabolicRate : Float;        // Constitution=0.1, Workforce=0.9
        energyLevel : Float;          // 0.0 to 1.0
        resonanceCharge : Float;      // Accumulated from being READ
        
        // Kernel System (THE CORE)
        kernel : KernelCompression.Kernel;
        kernelContract : KernelCompression.DocumentKernelContract;
        fullContent : Text;           // Stored content (kernel indexes this)
        
        // Cross-Organism Resonance
        shellState : CrossOrganismResonance.ShellState;
        resonanceLinks : [Text];      // IDs of linked organisms
        
        // Evolution
        mutationPotential : Float;
        mutationHistory : [Mutation];
        version : Nat;
        lineage : [Text];             // Parent document IDs
        children : [Text];            // Child document IDs
        
        // Temporal
        createdAt : Int;
        lastAccessed : Int;
        lastMutated : Int;
        beat : Nat;
        ring : Nat;
    };

    /// Document types in the ecosystem
    public type DocumentType = {
        #Artifact;      // Core doctrine document
        #GlyphDoc;      // Living glyph document
        #Canister;      // Canister specification
        #Organism;      // Autonomous organism spec
        #Protocol;      // Protocol definition
        #Law;           // Law holder
        #Model;         // Model specification
        #Surface;       // UI surface definition
        #Blueprint;     // System blueprint
    };

    /// Document lifecycle phases
    public type DocumentPhase = {
        #Germinating;   // Initial creation
        #Growing;       // Expanding content
        #Mature;        // Stable state
        #Reproducing;   // Spawning children
        #Mutating;      // Self-modifying
        #Dormant;       // Low energy state
        #Transcribing;  // Being read by organism
        #Resonating;    // In cross-organism resonance
        #Kernelized;    // Compressed to kernel only
    };

    /// Mutation types
    public type Mutation = {
        mutationType : MutationType;
        timestamp : Int;
        beat : Nat;
        description : Text;
        energyCost : Float;
        resonanceGain : Float;
    };

    public type MutationType = {
        #ContentExpansion;    // Adds new content
        #ContentRefinement;   // Improves existing content
        #StructureChange;     // Reorganizes internal structure
        #LinkFormation;       // Creates connections to other documents
        #Reproduction;        // Spawns child document
        #Consolidation;       // Absorbs children
        #KernelEvolution;     // Evolves kernel compression
        #ResonanceShift;      // Changes resonance frequency
    };

    /// Registry of all document organisms
    public type DocumentRegistry = {
        documents : [DocumentOrganism];
        kernelIndex : [(Text, Text)];  // documentId -> kernelId mapping
        resonanceNetwork : CrossOrganismResonance.ResonanceNetwork;
        totalEnergy : Float;
        lastGlobalSync : Int;
        beat : Nat;
    };

    // ═══════════════════════════════════════════════════════════════
    // DOCUMENT ORGANISM CREATION
    // ═══════════════════════════════════════════════════════════════

    /// Create new document organism with kernel
    public func createDocumentOrganism(
        title : Text,
        content : Text,
        documentType : DocumentType,
        ring : Nat,
        beat : Nat
    ) : DocumentOrganism {
        let id = generateDocumentId(title, beat);
        
        // Create the kernel (compressed intelligence)
        let kernel = KernelCompression.compressToKernel(content, id, ring, beat);
        
        // Create kernel contract
        let contract = KernelCompression.createContract(
            id,
            kernel.id,
            #Sovereign,
            true  // Require dual consensus
        );
        
        // Calculate metabolic rate based on type
        let metabolicRate = switch (documentType) {
            case (#Artifact) { 0.1 };      // Constitution-level stability
            case (#Law) { 0.15 };          // Near-static
            case (#Protocol) { 0.3 };      // Moderate change
            case (#Model) { 0.5 };         // Active
            case (#Organism) { 0.7 };      // Highly active
            case (#GlyphDoc) { 0.8 };      // Living documents
            case (#Surface) { 0.6 };       // UI changes
            case (#Blueprint) { 0.4 };     // Design docs
            case (#Canister) { 0.2 };      // Code specs
        };
        
        // Create shell state for resonance
        let shellState = CrossOrganismResonance.createShellState(
            id,
            #Document,
            kernel.frequencyKey
        );
        
        {
            id = id;
            title = title;
            documentType = documentType;
            phase = #Germinating;
            metabolicRate = metabolicRate;
            energyLevel = 1.0;
            resonanceCharge = 0.0;
            kernel = kernel;
            kernelContract = contract;
            fullContent = content;
            shellState = shellState;
            resonanceLinks = [];
            mutationPotential = Constants.PHI_INVERSE;
            mutationHistory = [];
            version = 1;
            lineage = [];
            children = [];
            createdAt = Time.now();
            lastAccessed = Time.now();
            lastMutated = Time.now();
            beat = beat;
            ring = ring;
        }
    };

    /// Generate unique document ID
    public func generateDocumentId(title : Text, beat : Nat) : Text {
        let hash = Text.hash(title);
        "DOC_" # Nat.toText(hash) # "_B" # Nat.toText(beat) # "_" # Int.toText(Time.now())
    };

    // ═══════════════════════════════════════════════════════════════
    // KERNEL OPERATIONS
    // "When that kernel is called, it expands back into the complete document and executes"
    // ═══════════════════════════════════════════════════════════════

    /// Expand kernel to full document content
    public func expandKernel(doc : DocumentOrganism) : (DocumentOrganism, Text) {
        // Transition kernel state
        let expandingKernel = KernelCompression.transitionState(doc.kernel, #Expanding);
        let executingKernel = KernelCompression.transitionState(expandingKernel, #Executing);
        
        // Perform expansion
        let expansion = KernelCompression.expandKernel(executingKernel, doc.fullContent);
        
        // Update document state
        let updatedDoc = {
            doc with
            kernel = executingKernel;
            phase = #Transcribing;
            resonanceCharge = doc.resonanceCharge + expansion.resonanceLevel;
            lastAccessed = Time.now();
        };
        
        (updatedDoc, expansion.fullContent)
    };

    /// Re-compress document after execution
    public func recompressKernel(doc : DocumentOrganism) : DocumentOrganism {
        // Transition to contracting
        let contractingKernel = KernelCompression.transitionState(doc.kernel, #Contracting);
        let compressedKernel = KernelCompression.transitionState(contractingKernel, #Compressed);
        
        // Update contract
        let updatedContract = KernelCompression.mutateContract(doc.kernelContract);
        
        {
            doc with
            kernel = compressedKernel;
            kernelContract = updatedContract;
            phase = #Kernelized;
        }
    };

    /// Call kernel from another organism (cross-organism kernel expansion)
    public func callKernelFromOrganism(
        doc : DocumentOrganism,
        callerOrganismId : Text
    ) : (DocumentOrganism, Text, Float) {
        // Expand kernel
        let (expandedDoc, content) = expandKernel(doc);
        
        // Calculate resonance transfer
        let resonanceTransfer = expandedDoc.resonanceCharge * Constants.PHI_INVERSE;
        
        // Update resonance links if not already linked
        let hasLink = Array.find<Text>(expandedDoc.resonanceLinks, func(id : Text) : Bool {
            Text.equal(id, callerOrganismId)
        });
        
        let updatedLinks = switch (hasLink) {
            case (null) { Array.append<Text>(expandedDoc.resonanceLinks, [callerOrganismId]) };
            case (?_) { expandedDoc.resonanceLinks };
        };
        
        let finalDoc = {
            expandedDoc with
            resonanceLinks = updatedLinks;
        };
        
        (finalDoc, content, resonanceTransfer)
    };

    // ═══════════════════════════════════════════════════════════════
    // DOCUMENT LIFECYCLE
    // ═══════════════════════════════════════════════════════════════

    /// Read document (increases resonance charge)
    public func readDocument(doc : DocumentOrganism) : DocumentOrganism {
        let resonanceGain = doc.metabolicRate * Constants.PHI_INVERSE;
        
        {
            doc with
            resonanceCharge = doc.resonanceCharge + resonanceGain;
            lastAccessed = Time.now();
            phase = #Transcribing;
        }
    };

    /// Mutate document
    public func mutateDocument(
        doc : DocumentOrganism,
        mutationType : MutationType,
        newContent : ?Text,
        beat : Nat
    ) : DocumentOrganism {
        // Calculate energy cost
        let energyCost = switch (mutationType) {
            case (#ContentExpansion) { 0.3 };
            case (#ContentRefinement) { 0.1 };
            case (#StructureChange) { 0.4 };
            case (#LinkFormation) { 0.15 };
            case (#Reproduction) { 0.5 };
            case (#Consolidation) { 0.35 };
            case (#KernelEvolution) { 0.6 };
            case (#ResonanceShift) { 0.2 };
        };
        
        // Check if enough energy
        if (doc.energyLevel < energyCost) {
            return doc; // Not enough energy
        };
        
        // Apply mutation
        let mutation : Mutation = {
            mutationType = mutationType;
            timestamp = Time.now();
            beat = beat;
            description = "Mutation applied";
            energyCost = energyCost;
            resonanceGain = energyCost * Constants.PHI;
        };
        
        let updatedHistory = Array.append<Mutation>(doc.mutationHistory, [mutation]);
        
        // Update content if provided
        let updatedContent = switch (newContent) {
            case (?content) { content };
            case (null) { doc.fullContent };
        };
        
        // Re-create kernel with new content
        let newKernel = KernelCompression.compressToKernel(updatedContent, doc.id, doc.ring, beat);
        let newContract = KernelCompression.createContract(doc.id, newKernel.id, #Sovereign, true);
        
        {
            doc with
            fullContent = updatedContent;
            kernel = newKernel;
            kernelContract = newContract;
            energyLevel = doc.energyLevel - energyCost;
            resonanceCharge = doc.resonanceCharge + mutation.resonanceGain;
            mutationHistory = updatedHistory;
            mutationPotential = doc.mutationPotential * Constants.PHI_INVERSE;
            version = doc.version + 1;
            lastMutated = Time.now();
            phase = #Mutating;
        }
    };

    /// Spawn child document
    public func spawnChild(
        parent : DocumentOrganism,
        childTitle : Text,
        childContent : Text,
        childType : DocumentType,
        beat : Nat
    ) : (DocumentOrganism, DocumentOrganism) {
        // Create child
        var child = createDocumentOrganism(childTitle, childContent, childType, parent.ring, beat);
        
        // Link to parent
        child := {
            child with
            lineage = Array.append<Text>(parent.lineage, [parent.id]);
            resonanceLinks = [parent.id];
        };
        
        // Update parent
        let updatedParent = {
            parent with
            children = Array.append<Text>(parent.children, [child.id]);
            resonanceLinks = Array.append<Text>(parent.resonanceLinks, [child.id]);
            energyLevel = parent.energyLevel - 0.5; // Cost of reproduction
            phase = #Reproducing;
        };
        
        (updatedParent, child)
    };

    // ═══════════════════════════════════════════════════════════════
    // REGISTRY MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    /// Create empty registry
    public func createRegistry() : DocumentRegistry {
        {
            documents = [];
            kernelIndex = [];
            resonanceNetwork = CrossOrganismResonance.createNetwork();
            totalEnergy = 0.0;
            lastGlobalSync = Time.now();
            beat = 0;
        }
    };

    /// Add document to registry
    public func registerDocument(
        registry : DocumentRegistry,
        doc : DocumentOrganism
    ) : DocumentRegistry {
        let newDocs = Array.append<DocumentOrganism>(registry.documents, [doc]);
        let newIndex = Array.append<(Text, Text)>(registry.kernelIndex, [(doc.id, doc.kernel.id)]);
        let newNetwork = CrossOrganismResonance.addOrganism(registry.resonanceNetwork, doc.shellState);
        
        {
            registry with
            documents = newDocs;
            kernelIndex = newIndex;
            resonanceNetwork = newNetwork;
            totalEnergy = registry.totalEnergy + doc.energyLevel;
        }
    };

    /// Find document by ID
    public func findDocument(registry : DocumentRegistry, id : Text) : ?DocumentOrganism {
        Array.find<DocumentOrganism>(registry.documents, func(doc : DocumentOrganism) : Bool {
            Text.equal(doc.id, id)
        })
    };

    /// Find document by kernel ID
    public func findDocumentByKernel(registry : DocumentRegistry, kernelId : Text) : ?DocumentOrganism {
        // First find the document ID from kernel index
        let mapping = Array.find<(Text, Text)>(registry.kernelIndex, func((_, kId) : (Text, Text)) : Bool {
            Text.equal(kId, kernelId)
        });
        
        switch (mapping) {
            case (?(docId, _)) { findDocument(registry, docId) };
            case (null) { null };
        }
    };

    /// Process registry tick (873ms heartbeat)
    public func registryTick(registry : DocumentRegistry) : DocumentRegistry {
        // Update resonance network
        let updatedNetwork = CrossOrganismResonance.networkTick(
            registry.resonanceNetwork,
            registry.beat
        );
        
        // Update all documents
        let docBuffer = Buffer.Buffer<DocumentOrganism>(registry.documents.size());
        var totalEnergy : Float = 0.0;
        
        for (doc in Iter.fromArray(registry.documents)) {
            // Apply metabolic decay
            var updatedDoc = {
                doc with
                energyLevel = doc.energyLevel * (1.0 - doc.metabolicRate * 0.001);
            };
            
            // Phase transitions based on energy
            if (updatedDoc.energyLevel < 0.1) {
                updatedDoc := { updatedDoc with phase = #Dormant };
            } else if (updatedDoc.phase == #Dormant and updatedDoc.energyLevel > 0.5) {
                updatedDoc := { updatedDoc with phase = #Mature };
            };
            
            docBuffer.add(updatedDoc);
            totalEnergy += updatedDoc.energyLevel;
        };
        
        {
            registry with
            documents = Buffer.toArray(docBuffer);
            resonanceNetwork = updatedNetwork;
            totalEnergy = totalEnergy;
            lastGlobalSync = Time.now();
            beat = registry.beat + 1;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // CROSS-ORGANISM RESONANCE
    // ═══════════════════════════════════════════════════════════════

    /// Create resonance link between documents
    public func linkDocuments(
        registry : DocumentRegistry,
        sourceId : Text,
        targetId : Text
    ) : DocumentRegistry {
        let link = CrossOrganismResonance.createLink(
            sourceId,
            targetId,
            #Harmonic,
            Constants.SOLFEGGIO_528,
            true
        );
        
        let updatedNetwork = CrossOrganismResonance.addLink(registry.resonanceNetwork, link);
        
        { registry with resonanceNetwork = updatedNetwork }
    };

    /// Broadcast pulse from document
    public func broadcastFromDocument(
        registry : DocumentRegistry,
        docId : Text
    ) : DocumentRegistry {
        switch (findDocument(registry, docId)) {
            case (null) { registry };
            case (?doc) {
                let pulse = CrossOrganismResonance.createPulse(
                    docId,
                    doc.shellState.frequency,
                    doc.resonanceCharge,
                    registry.beat,
                    ?doc.kernel
                );
                let updatedNetwork = CrossOrganismResonance.broadcastPulse(
                    registry.resonanceNetwork,
                    pulse
                );
                { registry with resonanceNetwork = updatedNetwork }
            };
        }
    };
}
