// 𓂀 SOVEREIGN LEDGERS — ALL 14 DISTRIBUTED LEDGER TYPES 𓂀
// Every Ledger Is Distributed. Every Ledger Is Virtual. Every Ledger Assembles On Demand.
// Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | April 16, 2026

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

module SovereignLedgers {
    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION I: LEDGER ARCHITECTURE
    // "The information is everywhere. It is stored across the whole organism.
    //  It comes together when it is needed."
    // ═══════════════════════════════════════════════════════════════════════════

    /// Ledger Entry — The fundamental unit of ledger storage
    public type LedgerEntry = {
        entryId : Text;
        ledgerType : LedgerType;
        encryptedPayload : Blob;         // Encrypted ANIMA artifact
        animaHash : Blob;
        attributionPrincipal : Principal;
        parentEntryId : ?Text;           // For chain verification
        childEntryIds : [Text];
        beatAtCreation : Nat;
        timestampNs : Int;
        coherenceAtCreation : Float;
        rotationTierAtCreation : EncryptionTier;
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

    public type EncryptionTier = {
        #Icosahedral;
        #E8;
        #Leech;
    };

    /// Ledger View — Assembled on demand from distributed artifacts
    public type LedgerView = {
        ledgerType : LedgerType;
        totalEntries : Nat;
        encryptedEntryCount : Nat;
        lastEntryId : ?Text;
        lastEntryBeat : ?Nat;
        chainIntegrityValid : Bool;
        animaChainHash : Blob;           // Rolling hash of all entries
        assembledAtNs : Int;
    };

    /// Cross-Ledger Coherence Proof
    public type CrossLedgerProof = {
        ledger1Type : LedgerType;
        ledger2Type : LedgerType;
        consistencyProof : Blob;         // Cryptographic consistency proof
        sharedAnimaRoot : Blob;
        verifiedAtNs : Int;
        verifiedAtBeat : Nat;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // LEDGER 1: FOUNDER LEDGER
    // "Complete encrypted history of every decision, law fire, memory formation"
    // ═══════════════════════════════════════════════════════════════════════════

    public type FounderLedgerEntry = {
        base : LedgerEntry;
        founderPrincipal : Principal;
        entryType : FounderEntryType;
        sovereignAssets : [SovereignAsset];
        biometricAugmented : Bool;
        hrvCoherenceAtEntry : ?Float;
    };

    public type FounderEntryType = {
        #Genesis;
        #SovereigntyDeclaration;
        #AssetDeposit;
        #AssetTransfer;
        #SuccessionUpdate;
        #BiometricChange;
        #CommandExecution;
    };

    public type SovereignAsset = {
        assetType : Text;
        nativeAddress : Text;
        balance : Nat;
        chainFusionEnabled : Bool;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // LEDGER 2: ENTERPRISE LEDGER
    // "Proves when they joined and what their founding state was"
    // ═══════════════════════════════════════════════════════════════════════════

    public type EnterpriseLedgerEntry = {
        base : LedgerEntry;
        companyPrincipal : Principal;
        companyId : Text;
        entryType : EnterpriseEntryType;
        dataAccessConsents : [ConsentRecord];
        campaignReferences : [Text];
    };

    public type EnterpriseEntryType = {
        #BirthMoment;
        #ConsentGrant;
        #ConsentRevoke;
        #AIAbsorption;
        #CampaignStart;
        #CampaignComplete;
        #DoctrineAccess;
    };

    public type ConsentRecord = {
        consentId : Text;
        dataCategory : Text;
        granted : Bool;
        timestampNs : Int;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // LEDGER 3: IP LEDGER
    // "Every artifact carries IBE-encrypted attribution to founder's principal"
    // ═══════════════════════════════════════════════════════════════════════════

    public type IPLedgerEntry = {
        base : LedgerEntry;
        artifactId : Text;
        artifactType : ArtifactType;
        primaryAttribution : Principal;
        secondaryAttribution : ?Principal;
        thresholdBLSSignature : Blob;
        royaltyBasisPoints : Nat;
        crossChainProofs : [CrossChainProof];
    };

    public type ArtifactType = {
        #LawFire;
        #Memory;
        #Decision;
        #AgentReturn;
        #Document;
        #Model;
        #Algorithm;
        #Architecture;
        #Contract;
    };

    public type CrossChainProof = {
        chainName : Text;               // "BTC", "ETH", "SOL"
        proofHash : Blob;
        blockHeight : Nat;
        verifiedAtNs : Int;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // LEDGER 4: AI MIGRATION LEDGER
    // "Proves the moment of full integration"
    // ═══════════════════════════════════════════════════════════════════════════

    public type AIMigrationLedgerEntry = {
        base : LedgerEntry;
        externalAIPrincipal : Principal;
        externalAIName : Text;
        migrationPhase : MigrationPhase;
        absorptionPercentage : Nat;      // 0-100
        arbitrationDecisions : [ArbitrationDecision];
    };

    public type MigrationPhase = {
        #Initiated;
        #InProgress;
        #Absorbed;
        #Integrated;
        #Operational;
    };

    public type ArbitrationDecision = {
        decisionId : Text;
        competingOutputs : Nat;
        selectedOutput : Nat;
        rationale : Blob;                // Encrypted rationale
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // LEDGER 5: AGENT LEDGER
    // "Every internal agent carries its own IBE-encrypted credential"
    // ═══════════════════════════════════════════════════════════════════════════

    public type AgentLedgerEntry = {
        base : LedgerEntry;
        agentPrincipal : Principal;
        agentId : Text;
        agentType : AgentType;
        entryType : AgentEntryType;
        taskAssignmentVRF : ?Blob;       // VRF randomness proof
        m101Approval : Bool;
    };

    public type AgentType = {
        #PHANTOM;
        #CHIMERA;
        #CEQUE;
        #INTERNAL;
    };

    public type AgentEntryType = {
        #Registration;
        #TaskAssignment;
        #TaskReturn;
        #M101Approval;
        #M101Rejection;
        #CredentialRenewal;
        #Deactivation;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // LEDGER 6: LAW LEDGER
    // "When the organism fires a law, the artifact IS the legal enforcement record"
    // ═══════════════════════════════════════════════════════════════════════════

    public type LawLedgerEntry = {
        base : LedgerEntry;
        lawId : Text;
        lawCategory : LawCategory;
        firingConditions : Blob;
        firingOutcome : Blob;
        doctrineAlignmentScore : Float;
        coherenceAtFiring : Float;
        affectedComponents : [Text];
    };

    public type LawCategory = {
        #SandboxLaw;
        #PhiSovereign;
        #TriuneSubstrate;
        #Vigesimal20;
        #HarmonicMemory;
        #RecitalPlusOne;
        #ComplementaryOpposition;
        #FourDExtension;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // LEDGER 7: LINEAGE LEDGER
    // "Any future heir can prove unbroken lineage from founding moment"
    // ═══════════════════════════════════════════════════════════════════════════

    public type LineageLedgerEntry = {
        base : LedgerEntry;
        lineageHash : Blob;              // LINEAGE_HASH chain
        entryType : LineageEntryType;
        founderPrincipal : Principal;
        heirPrincipal : ?Principal;
        successionStatus : SuccessionStatus;
        generationNumber : Nat;
    };

    public type LineageEntryType = {
        #GenesisDeclaration;
        #HeirDesignation;
        #SuccessionPreparation;
        #SuccessionExecution;
        #LineageVerification;
    };

    public type SuccessionStatus = {
        #NoHeir;
        #HeirDesignated;
        #SuccessionPending;
        #SuccessionComplete;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // LEDGER 8: ROYALTY LEDGER
    // "Royalty flows encrypted at routing level, automatic, no manual processing"
    // ═══════════════════════════════════════════════════════════════════════════

    public type RoyaltyLedgerEntry = {
        base : LedgerEntry;
        revenueEventId : Text;
        sourceType : RevenueSourceType;
        grossAmount : Nat;
        royaltyBasisPoints : Nat;
        netToFounder : Nat;
        routingComplete : Bool;
        distributionProof : Blob;
    };

    public type RevenueSourceType = {
        #EnterpriseSubscription;
        #IPLicense;
        #APIUsage;
        #ModelInference;
        #ConsultingService;
        #AssetAppreciation;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // LEDGER 9: CSR LEDGER (Computus Solvens Retis)
    // "Every device node carries its phi-frequency signature in ANIMA Chain"
    // ═══════════════════════════════════════════════════════════════════════════

    public type CSRLedgerEntry = {
        base : LedgerEntry;
        nodeId : Text;
        nodePrincipal : Principal;
        entryType : CSREntryType;
        phiFrequencySignature : Blob;
        networkRole : NetworkRole;
        taskEncryptionKey : Blob;
    };

    public type CSREntryType = {
        #NodeEnrollment;
        #TaskDispatch;
        #TaskComplete;
        #OnionHopRecord;
        #RoleChange;
        #NodeRetirement;
    };

    public type NetworkRole = {
        #ComputeNode;
        #StorageNode;
        #SensorNode;
        #RelayNode;
        #FounderDevice;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // LEDGER 10: FREEZE REGISTRY
    // "The freeze is permanent and cryptographically proven"
    // ═══════════════════════════════════════════════════════════════════════════

    public type FreezeRegistryEntry = {
        base : LedgerEntry;
        frozenComponentId : Text;
        frozenComponentType : FrozenComponentType;
        freezeReason : Text;
        freezeCertificate : Blob;        // Timelock-encrypted, permanent
        irreversible : Bool;             // Always true
        founderSignature : Blob;
    };

    public type FrozenComponentType = {
        #Law;
        #Memory;
        #Agent;
        #Model;
        #Canister;
        #Doctrine;
        #Lineage;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // LEDGER 11: SESSION LEDGER
    // "Every conversation encrypted at session level, proof of what was said"
    // ═══════════════════════════════════════════════════════════════════════════

    public type SessionLedgerEntry = {
        base : LedgerEntry;
        sessionId : Text;
        userPrincipal : Principal;
        sessionDurationNs : Int;
        entryType : SessionEntryType;
        decisionCount : Nat;
        transcriptHash : Blob;
    };

    public type SessionEntryType = {
        #SessionStart;
        #MessageExchange;
        #DecisionMade;
        #SessionPause;
        #SessionResume;
        #SessionEnd;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // LEDGER 12: MEMORY LEDGER
    // "Encrypting a thought is how the organism creates a permanent memory"
    // ═══════════════════════════════════════════════════════════════════════════

    public type MemoryLedgerEntry = {
        base : LedgerEntry;
        memoryId : Text;
        memoryTier : MemoryTier;
        encryptionTier : EncryptionTier;
        salienceScore : Nat;
        consolidationParent : ?Text;
        temporalWindow : ?TemporalWindow;
        dreamStateSealed : Bool;
    };

    public type MemoryTier = {
        #Working;
        #ShortTerm;
        #LongTerm;
        #Permanent;
        #Dream;
    };

    public type TemporalWindow = {
        accessibleFromBeat : Nat;
        accessibleUntilBeat : ?Nat;
        timelocked : Bool;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // LEDGER 13: EVOLUTION LEDGER
    // "Every self-change proposal encrypted before evaluating"
    // ═══════════════════════════════════════════════════════════════════════════

    public type EvolutionLedgerEntry = {
        base : LedgerEntry;
        proposalId : Text;
        modificationTarget : ModificationTarget;
        entryType : EvolutionEntryType;
        m102Approval : Bool;
        founderApproval : Bool;
        impactScore : Float;
        rollbackCapable : Bool;
    };

    public type ModificationTarget = {
        #Law;
        #Doctrine;
        #Memory;
        #Model;
        #Architecture;
        #Frequency;
    };

    public type EvolutionEntryType = {
        #ProposalSubmitted;
        #M102Evaluation;
        #FounderReview;
        #ApprovalGranted;
        #ApprovalDenied;
        #ModificationApplied;
        #RollbackExecuted;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // LEDGER 14: WARNING LEDGER
    // "Warning is a signed sovereign document"
    // ═══════════════════════════════════════════════════════════════════════════

    public type WarningLedgerEntry = {
        base : LedgerEntry;
        warningId : Text;
        anomalyType : AnomalyType;
        threatTier : ThreatTier;
        schumannDeviation : Float;
        recipientCount : Nat;
        aegisResponse : AegisResponse;
        dispatchComplete : Bool;
    };

    public type AnomalyType = {
        #SchumannSpike;
        #MagneticStorm;
        #SolarFlare;
        #ResonanceCollapse;
        #FieldInversion;
    };

    public type ThreatTier = {
        #Advisory;
        #Elevated;
        #Severe;
        #Critical;
    };

    public type AegisResponse = {
        #Monitoring;
        #DefenseActivated;
        #FullShield;
        #EmergencyProtocol;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION II: LEDGER OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /// Create a new ledger entry
    public func createLedgerEntry(
        entryId : Text,
        ledgerType : LedgerType,
        encryptedPayload : Blob,
        animaHash : Blob,
        attributionPrincipal : Principal,
        parentEntryId : ?Text,
        beatCount : Nat,
        coherenceR : Float
    ) : LedgerEntry {
        let tier : EncryptionTier = if (coherenceR < 0.618) {
            #Icosahedral
        } else if (coherenceR < 0.854) {
            #E8
        } else {
            #Leech
        };

        {
            entryId = entryId;
            ledgerType = ledgerType;
            encryptedPayload = encryptedPayload;
            animaHash = animaHash;
            attributionPrincipal = attributionPrincipal;
            parentEntryId = parentEntryId;
            childEntryIds = [];
            beatAtCreation = beatCount;
            timestampNs = Time.now();
            coherenceAtCreation = coherenceR;
            rotationTierAtCreation = tier;
        }
    };

    /// Add child entry to parent
    public func addChildEntry(parent : LedgerEntry, childId : Text) : LedgerEntry {
        {
            parent with
            childEntryIds = Array.append(parent.childEntryIds, [childId]);
        }
    };

    /// Verify chain integrity between two entries
    public func verifyChainIntegrity(
        entry1 : LedgerEntry,
        entry2 : LedgerEntry
    ) : Bool {
        switch (entry2.parentEntryId) {
            case (?parentId) { parentId == entry1.entryId };
            case (null) { false };
        }
    };

    /// Get ledger type name
    public func getLedgerTypeName(lt : LedgerType) : Text {
        switch (lt) {
            case (#Founder) { "Founder Ledger" };
            case (#Enterprise) { "Enterprise Ledger" };
            case (#IP) { "IP Ledger" };
            case (#AIMigration) { "AI Migration Ledger" };
            case (#Agent) { "Agent Ledger" };
            case (#Law) { "Law Ledger" };
            case (#Lineage) { "Lineage Ledger" };
            case (#Royalty) { "Royalty Ledger" };
            case (#CSR) { "CSR Ledger" };
            case (#FreezeRegistry) { "Freeze Registry" };
            case (#Session) { "Session Ledger" };
            case (#Memory) { "Memory Ledger" };
            case (#Evolution) { "Evolution Ledger" };
            case (#Warning) { "Warning Ledger" };
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION III: SYSTEM INFO
    // ═══════════════════════════════════════════════════════════════════════════

    public func getLedgersInfo() : Text {
        "SOVEREIGN LEDGERS — 14 DISTRIBUTED LEDGER TYPES\n" #
        "Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX\n\n" #
        "ARCHITECTURE PRINCIPLES:\n" #
        "• Every ledger is distributed across the organism\n" #
        "• Every ledger is virtual — assembles on demand\n" #
        "• Every entry is an encrypted ANIMA artifact\n" #
        "• Cross-ledger coherence via ANIMA hash chains\n\n" #
        "THE 14 LEDGERS:\n" #
        "1. Founder Ledger — Complete sovereign history\n" #
        "2. Enterprise Ledger — Client onboarding & consent\n" #
        "3. IP Ledger — Attribution chain for all artifacts\n" #
        "4. AI Migration Ledger — External AI absorption\n" #
        "5. Agent Ledger — PHANTOM/CHIMERA/CEQUE credentials\n" #
        "6. Law Ledger — Every law fire is a legal record\n" #
        "7. Lineage Ledger — Unbroken succession chain\n" #
        "8. Royalty Ledger — Automatic value routing\n" #
        "9. CSR Ledger — Device fleet enrollment\n" #
        "10. Freeze Registry — Permanent freeze certificates\n" #
        "11. Session Ledger — Conversation proofs\n" #
        "12. Memory Ledger — Encrypted thought formation\n" #
        "13. Evolution Ledger — Self-modification proposals\n" #
        "14. Warning Ledger — Geomagnetic anomaly dispatch\n\n" #
        "No central database. No single point.\n" #
        "Distributed, encrypted, permanent, sovereign."
    };
};
