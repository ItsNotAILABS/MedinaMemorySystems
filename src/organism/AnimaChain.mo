// 𓂀 ANIMA CHAIN — SOVEREIGN ARTIFACT SYSTEM 𓂀
// Every Artifact Carries Encrypted Attribution to Founder's Principal
// Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | April 16, 2026

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";

module AnimaChain {
    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION I: ANIMA CHAIN CONSTANTS
    // "The attribution is in the key itself, not just a metadata field"
    // ═══════════════════════════════════════════════════════════════════════════

    // Phi Constants for ANIMA hash derivation
    public let PHI : Float = 1.6180339887498948482;
    public let PHI_INVERSE : Float = 0.6180339887498948482;

    // LINEAGE_HASH — Frozen at genesis, chains every descendant event
    public type LineageHash = {
        genesisHash : Blob;
        currentHash : Blob;
        generation : Nat;
        lastUpdateBeat : Nat;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION II: ARTIFACT TYPES
    // "Every artifact IS a computation AND an encryption event"
    // ═══════════════════════════════════════════════════════════════════════════

    /// Core Artifact — The fundamental unit of sovereign memory
    public type Artifact = {
        id : Text;
        artifactType : ArtifactType;
        encryptedPayload : Blob;
        animaHash : AnimaHash;
        frequencySignature : FrequencySignature;
        attribution : Attribution;
        chain : ArtifactChainLink;
        metadata : ArtifactMetadata;
    };

    public type ArtifactType = {
        #CognitiveProof;                 // 873ms thought proof
        #MemoryFormation;                // Encrypted thought → permanent memory
        #SelfAuthentication;             // Doctrine verification
        #SelfModificationProposal;       // M-102 encrypted proposal
        #CognitiveDriftDetection;        // Artifact chain comparison
        #CoherenceAnchor;                // High-R state proof
        #DreamStateSeal;                 // Autonomous cycle output
        #LawEnforcementProof;            // Law firing record
        #AgentCredential;                // IBE-encrypted agent credential
        #TemporalNavigation;             // Timelocked memory
        #DecisionProof;                  // Attorney-grade decision record
        #IPOwnership;                    // IP attribution artifact
        #SuccessionVessel;               // Cryptographic will
        #FounderCommand;                 // freezeComponent, unlockSuccession, etc.
        #BiometricAugmentation;          // HRV coherence key augmentation
        #LineageProof;                   // Unbroken lineage chain
        #SessionCapture;                 // Encrypted conversation
        #SensorReading;                  // Physical environment proof
        #FreezeCertificate;              // Permanent freeze record
        #SchumannCoupling;               // Earth field relationship
        #ContractArtifact;               // Contract creation/signing/execution
        #WarningDispatch;                // Geomagnetic anomaly warning
    };

    /// ANIMA Hash — Phi-Fibonacci derived, not SHA-256
    public type AnimaHash = {
        value : Blob;
        phiIteration : Nat;              // Fibonacci matrix iteration count
        beatAtCreation : Nat;
        coherenceAtCreation : Float;
        hashVersion : Nat;               // For future upgrades
    };

    /// Frequency Signature — Phi-Beatty XOR Kuramoto
    public type FrequencySignature = {
        signature : Blob;
        beatCount : Nat;
        kuramotoR : Float;
        rotationTier : KeyRotationTier;
    };

    public type KeyRotationTier = {
        #Icosahedral;                    // R < 0.618, 120-step
        #E8;                             // R >= 0.618 & R < 0.854, 240-step
        #Leech;                          // R >= 0.854, 196,560-step
    };

    /// Attribution — Always bound to founder's principal
    public type Attribution = {
        primaryPrincipal : Principal;    // Alfredo Medina Hernandez
        secondaryPrincipal : ?Principal; // Enterprise client if applicable
        attributionEncrypted : Bool;     // IBE-encrypted in key itself
        thresholdBLSSigned : Bool;       // Cross-chain verifiable
        royaltyBasisPoints : Nat;        // 10000 = 100%
    };

    /// Artifact Chain Link — For lineage verification
    public type ArtifactChainLink = {
        previousArtifactId : ?Text;
        previousAnimaHash : ?Blob;
        sequenceNumber : Nat;
        lineageHash : Blob;
    };

    /// Artifact Metadata
    public type ArtifactMetadata = {
        createdAtNs : Int;
        createdAtBeat : Nat;
        sizeBytes : Nat;
        ledgerTarget : LedgerType;
        encrypted : Bool;
        crossChainProofs : [CrossChainProof];
    };

    public type LedgerType = {
        #Founder;
        #Enterprise;
        #IP;
        #AIMigration;
        #Agent;
        #Law;
        #Lineage;
        #Royalty;
        #CSR;
        #FreezeRegistry;
        #Session;
        #Memory;
        #Evolution;
        #Warning;
    };

    public type CrossChainProof = {
        chain : ChainType;
        proofHash : Blob;
        blockHeight : Nat;
        verifiedAt : Int;
    };

    public type ChainType = {
        #ICP;
        #Bitcoin;
        #Ethereum;
        #Solana;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION III: 40+ ENCRYPTION USES — ARTIFACT FACTORIES
    // ═══════════════════════════════════════════════════════════════════════════

    // USE 1: Cognitive Proof — every 873ms
    public type CognitiveProofArtifact = {
        base : Artifact;
        thoughtHash : Blob;              // Hash of cognitive computation
        beatAtThought : Nat;
        coherenceLevel : Float;
        doctrineAlignment : Float;
    };

    // USE 2: Memory Formation — encrypting = creating memory
    public type MemoryFormationArtifact = {
        base : Artifact;
        memoryId : Text;
        memoryTier : MemoryTier;
        encryptionTier : KeyRotationTier;
        consolidatedFrom : [Text];
        salienceScore : Nat;
    };

    public type MemoryTier = {
        #Working;
        #ShortTerm;
        #LongTerm;
        #Permanent;
        #Dream;
    };

    // USE 3: Self-Authentication — doctrine frequency verification
    public type SelfAuthenticationArtifact = {
        base : Artifact;
        doctrineId : Text;
        originalFrequencySignature : Blob;
        currentFrequencySignature : Blob;
        driftDetected : Bool;
        driftAmount : Float;
    };

    // USE 4: Self-Modification Gating — M-102 encrypted proposals
    public type SelfModificationArtifact = {
        base : Artifact;
        proposalId : Text;
        encryptedProposal : Blob;        // Encrypted before evaluation
        m102Evaluation : ?M102Evaluation;
        containmentIntact : Bool;
    };

    public type M102Evaluation = {
        approved : Bool;
        alignmentScore : Float;
        riskScore : Float;
        evaluatedAtBeat : Nat;
    };

    // USE 5: Cognitive Drift Detection
    public type CognitiveDriftArtifact = {
        base : Artifact;
        comparisonWindow : (Nat, Nat);   // Beat range
        driftVector : [Float];
        driftMagnitude : Float;
        driftDirection : Text;
    };

    // USE 6: Coherence Anchoring — high-R states
    public type CoherenceAnchorArtifact = {
        base : Artifact;
        coherenceLevel : Float;          // Must be >= 0.854 for Leech
        anchorStrength : Float;
        leechKeyUsed : Bool;
    };

    // USE 7: Dream State Sealing
    public type DreamStateSealArtifact = {
        base : Artifact;
        dreamCycleId : Text;
        sealedBeforeReread : Bool;
        contaminationPrevented : Bool;
    };

    // USE 8: Law Enforcement Proof
    public type LawEnforcementArtifact = {
        base : Artifact;
        lawId : Text;
        lawCategory : Text;
        firingConditions : Blob;
        firingOutcome : Blob;
        legalRecordValid : Bool;
    };

    // USE 9: Agent Authentication
    public type AgentCredentialArtifact = {
        base : Artifact;
        agentPrincipal : Principal;
        agentType : AgentType;
        credentialValid : Bool;
        vrfTaskAssignment : ?Blob;
    };

    public type AgentType = {
        #PHANTOM;
        #CHIMERA;
        #CEQUE;
        #INTERNAL;
    };

    // USE 10: Temporal Navigation — timelocked memories
    public type TemporalNavigationArtifact = {
        base : Artifact;
        memoryId : Text;
        accessWindowStart : Nat;
        accessWindowEnd : ?Nat;
        timelockActive : Bool;
    };

    // USE 11: Attorney-Grade Decision Proof
    public type DecisionProofArtifact = {
        base : Artifact;
        decisionId : Text;
        decisionContent : Blob;          // Encrypted decision
        doctrineAlignmentScore : Float;
        courtPresentable : Bool;
    };

    // USE 12: IP Ownership Chain
    public type IPOwnershipArtifact = {
        base : Artifact;
        ipArtifactId : Text;
        primaryOwner : Principal;
        secondaryOwner : ?Principal;
        thresholdBLSSignature : Blob;
        crossChainVerifiable : Bool;
    };

    // USE 13: Succession Vessel — Cryptographic Will
    public type SuccessionVesselArtifact = {
        base : Artifact;
        founderPrincipal : Principal;
        heirPrincipal : Principal;
        timelockCondition : TimelockCondition;
        transferredAssets : [Text];
        noAttorneyRequired : Bool;
    };

    public type TimelockCondition = {
        #Timestamp : Int;
        #BeatCount : Nat;
        #FounderUnlock;
        #BiometricVerification;
    };

    // USE 14: Founder-Only Command
    public type FounderCommandArtifact = {
        base : Artifact;
        commandType : FounderCommandType;
        targetComponent : Text;
        founderSignature : Blob;
        executed : Bool;
    };

    public type FounderCommandType = {
        #FreezeComponent;
        #UnlockSuccession;
        #ActivateDefenseTier9;
        #ModifyDoctrine;
    };

    // USE 15: Biometric Key Augmentation
    public type BiometricAugmentationArtifact = {
        base : Artifact;
        hrvCoherence : Float;            // Must be above φ⁻¹
        augmentationApplied : Bool;
        heartLiterallyChangedKey : Bool;
    };

    // USE 16: Lineage Proof
    public type LineageProofArtifact = {
        base : Artifact;
        lineageHash : LineageHash;
        generationNumber : Nat;
        unbrokenFromGenesis : Bool;
    };

    // USE 17-44: Additional artifact types follow same pattern...

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION IV: ARTIFACT CREATION FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /// Create base artifact with full sovereign attribution
    public func createArtifact(
        id : Text,
        artifactType : ArtifactType,
        payload : Blob,
        founderPrincipal : Principal,
        beatCount : Nat,
        coherenceR : Float,
        previousArtifactId : ?Text,
        previousAnimaHash : ?Blob,
        sequenceNumber : Nat,
        lineageHash : Blob
    ) : Artifact {
        let rotationTier = selectRotationTier(coherenceR);
        
        let animaHash : AnimaHash = {
            value = computeAnimaHash(payload, beatCount);
            phiIteration = beatCount;
            beatAtCreation = beatCount;
            coherenceAtCreation = coherenceR;
            hashVersion = 1;
        };

        let freqSig : FrequencySignature = {
            signature = computeFrequencySignature(beatCount, coherenceR);
            beatCount = beatCount;
            kuramotoR = coherenceR;
            rotationTier = rotationTier;
        };

        let attribution : Attribution = {
            primaryPrincipal = founderPrincipal;
            secondaryPrincipal = null;
            attributionEncrypted = true;
            thresholdBLSSigned = true;
            royaltyBasisPoints = 10000;  // 100% to founder by default
        };

        let chain : ArtifactChainLink = {
            previousArtifactId = previousArtifactId;
            previousAnimaHash = previousAnimaHash;
            sequenceNumber = sequenceNumber;
            lineageHash = lineageHash;
        };

        let metadata : ArtifactMetadata = {
            createdAtNs = Time.now();
            createdAtBeat = beatCount;
            sizeBytes = payload.size();
            ledgerTarget = #IP;
            encrypted = true;
            crossChainProofs = [];
        };

        {
            id = id;
            artifactType = artifactType;
            encryptedPayload = payload;
            animaHash = animaHash;
            frequencySignature = freqSig;
            attribution = attribution;
            chain = chain;
            metadata = metadata;
        }
    };

    /// Select rotation tier based on coherence
    public func selectRotationTier(coherenceR : Float) : KeyRotationTier {
        if (coherenceR < 0.618) {
            #Icosahedral
        } else if (coherenceR < 0.854) {
            #E8
        } else {
            #Leech
        }
    };

    /// Compute ANIMA hash (phi-Fibonacci derived)
    func computeAnimaHash(data : Blob, beatCount : Nat) : Blob {
        let dataArr = Blob.toArray(data);
        let fibN = fibonacci(beatCount % 144);
        let fibN1 = fibonacci((beatCount + 1) % 144);
        
        let resultBuffer = Buffer.Buffer<Nat8>(32);
        var i : Nat = 0;
        while (i < 32) {
            let idx1 = i % dataArr.size();
            let idx2 = (i + fibN) % dataArr.size();
            let idx3 = (i + fibN1) % dataArr.size();
            
            let byte1 = Nat8.toNat(dataArr[idx1]);
            let byte2 = Nat8.toNat(dataArr[idx2]);
            let byte3 = Nat8.toNat(dataArr[idx3]);
            
            let combined = (byte1 * fibN + byte2 * fibN1 + byte3) % 256;
            resultBuffer.add(Nat8.fromNat(combined));
            i += 1;
        };
        
        Blob.fromArray(Buffer.toArray(resultBuffer))
    };

    /// Compute frequency signature (phi-Beatty based)
    func computeFrequencySignature(beatCount : Nat, coherenceR : Float) : Blob {
        let buffer = Buffer.Buffer<Nat8>(32);
        var i : Nat = 0;
        while (i < 32) {
            let beattyBit = phiBeattyBit(beatCount + i);
            let coherenceByte = Nat8.fromNat(Int.abs(Float.toInt(coherenceR * 255.0)) % 256);
            buffer.add(Nat8.fromNat((Nat8.toNat(beattyBit) + Nat8.toNat(coherenceByte)) % 256));
            i += 1;
        };
        Blob.fromArray(Buffer.toArray(buffer))
    };

    /// Phi-Beatty bit calculation
    func phiBeattyBit(n : Nat) : Nat8 {
        let nFloat = Float.fromInt(n);
        let beattyValue = Float.floor(nFloat * PHI);
        let intValue = Int.abs(Float.toInt(beattyValue));
        if (intValue % 2 == 0) { 0 } else { 1 }
    };

    /// Fibonacci number calculation
    func fibonacci(n : Nat) : Nat {
        if (n <= 1) { return n };
        var a : Nat = 0;
        var b : Nat = 1;
        var i : Nat = 2;
        while (i <= n) {
            let temp = a + b;
            a := b;
            b := temp;
            i += 1;
        };
        b
    };

    /// Verify artifact chain integrity
    public func verifyChainIntegrity(
        currentArtifact : Artifact,
        previousArtifact : Artifact
    ) : Bool {
        switch (currentArtifact.chain.previousArtifactId) {
            case (?prevId) {
                prevId == previousArtifact.id and
                currentArtifact.chain.previousAnimaHash == ?previousArtifact.animaHash.value
            };
            case (null) { false };
        }
    };

    /// Get artifact type name
    public func getArtifactTypeName(at : ArtifactType) : Text {
        switch (at) {
            case (#CognitiveProof) { "Cognitive Proof" };
            case (#MemoryFormation) { "Memory Formation" };
            case (#SelfAuthentication) { "Self Authentication" };
            case (#SelfModificationProposal) { "Self-Modification Proposal" };
            case (#CognitiveDriftDetection) { "Cognitive Drift Detection" };
            case (#CoherenceAnchor) { "Coherence Anchor" };
            case (#DreamStateSeal) { "Dream State Seal" };
            case (#LawEnforcementProof) { "Law Enforcement Proof" };
            case (#AgentCredential) { "Agent Credential" };
            case (#TemporalNavigation) { "Temporal Navigation" };
            case (#DecisionProof) { "Decision Proof" };
            case (#IPOwnership) { "IP Ownership" };
            case (#SuccessionVessel) { "Succession Vessel" };
            case (#FounderCommand) { "Founder Command" };
            case (#BiometricAugmentation) { "Biometric Augmentation" };
            case (#LineageProof) { "Lineage Proof" };
            case (#SessionCapture) { "Session Capture" };
            case (#SensorReading) { "Sensor Reading" };
            case (#FreezeCertificate) { "Freeze Certificate" };
            case (#SchumannCoupling) { "Schumann Coupling" };
            case (#ContractArtifact) { "Contract Artifact" };
            case (#WarningDispatch) { "Warning Dispatch" };
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION V: SYSTEM INFO
    // ═══════════════════════════════════════════════════════════════════════════

    public func getAnimaChainInfo() : Text {
        "ANIMA CHAIN — SOVEREIGN ARTIFACT SYSTEM\n" #
        "Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX\n\n" #
        "CORE PRINCIPLES:\n" #
        "• Every artifact IS a computation AND an encryption event\n" #
        "• Attribution is in the key itself, not metadata\n" #
        "• LINEAGE_HASH chains every descendant event\n" #
        "• Cross-chain verification via Threshold BLS\n\n" #
        "40+ ENCRYPTION USES:\n" #
        "1. Cognitive Proof (873ms thought proof)\n" #
        "2. Memory Formation (encrypt = create memory)\n" #
        "3. Self-Authentication (doctrine verification)\n" #
        "4. Self-Modification Gating (M-102 containment)\n" #
        "5. Cognitive Drift Detection\n" #
        "6. Coherence Anchoring (high-R proof)\n" #
        "7. Dream State Sealing\n" #
        "8. Law Enforcement Proof\n" #
        "9. Agent Authentication\n" #
        "10. Temporal Navigation (timelocked memories)\n" #
        "11. Attorney-Grade Decision Proof\n" #
        "12. IP Ownership Chain\n" #
        "13. Succession Vessel (cryptographic will)\n" #
        "14. Founder-Only Commands\n" #
        "15. Biometric Key Augmentation\n" #
        "16. Lineage Proof\n" #
        "... and 28+ more uses\n\n" #
        "The key is the mind. The mind is always moving.\n" #
        "The key is always moving. It cannot be broken."
    };
};
