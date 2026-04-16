// 𓂀 SOVEREIGN CONTRACTS — ALL 14 CONTRACT TYPES 𓂀
// Every Contract Is a Model. Every Model Is Built.
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

module SovereignContracts {
    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION I: ENCRYPTION TYPES FOR CONTRACTS
    // "Every contract signs via threshold BLS or IBE"
    // ═══════════════════════════════════════════════════════════════════════════

    public type EncryptionMethod = {
        #TimelockIBE;           // For succession, founder contracts
        #ThresholdBLS;          // For IP attribution, royalty routing
        #CompanyVetKey;         // Enterprise onboarding
        #AgentPrincipalIBE;     // Agent return contracts
        #PhiLatticeAnima;       // Law enforcement contracts
        #SessionIBE;            // Session capture
        #LeechE8Icosahedral;    // Memory formation (based on R)
        #M102GateFounder;       // Self-modification
        #PhiFrequencyAnima;     // CSR node contracts
        #OneWayFounder;         // Freeze contracts
        #IBERecipientList;      // Geomagnetic warning
    };

    public type ContractStatus = {
        #Draft;
        #Pending;
        #Signed;
        #Active;
        #Executed;
        #Completed;
        #Frozen;
        #Revoked;
    };

    public type SignatureRecord = {
        signerPrincipal : Principal;
        signatureBlob : Blob;
        signatureMethod : EncryptionMethod;
        timestampNs : Int;
        beatAtSigning : Nat;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION II: BASE CONTRACT TYPE
    // "The moment a contract is generated, its terms are encrypted on-chain"
    // ═══════════════════════════════════════════════════════════════════════════

    public type BaseContract = {
        id : Text;
        contractType : ContractType;
        encryptionMethod : EncryptionMethod;
        encryptedTerms : Blob;
        animaHash : Blob;
        attributionPrincipal : Principal;  // Always Alfredo Medina Hernandez
        signatures : [SignatureRecord];
        status : ContractStatus;
        targetLedger : LedgerType;
        createdAtNs : Int;
        createdAtBeat : Nat;
        executedAtNs : ?Int;
    };

    public type ContractType = {
        #FounderSovereignty;
        #EnterpriseOnboarding;
        #IPAttribution;
        #AIAbsorption;
        #AgentReturn;
        #LawEnforcement;
        #Succession;
        #RoyaltyRouting;
        #CSRNode;
        #Freeze;
        #SessionCapture;
        #MemoryFormation;
        #SelfModification;
        #GeomagneticWarning;
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

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTRACT 1: FOUNDER SOVEREIGNTY CONTRACT
    // Encryption: Timelock IBE + founder key
    // Signers: Founder principal only
    // Trigger: Genesis
    // Ledger: Founder Ledger
    // ═══════════════════════════════════════════════════════════════════════════

    public type FounderSovereigntyContract = {
        base : BaseContract;
        founderPrincipal : Principal;
        foundingWord : Text;
        genesisTimestamp : Int;
        lineageHash : Blob;              // LINEAGE_HASH frozen at genesis
        biometricKeyEnabled : Bool;
        successionHeirPrincipal : ?Principal;
        sovereignAssets : [SovereignAsset];
    };

    public type SovereignAsset = {
        assetType : Text;               // "BTC", "ICP", "ETH"
        nativeAddress : Text;           // Chain Fusion address
        balance : Nat;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTRACT 2: ENTERPRISE ONBOARDING CONTRACT
    // Encryption: Company vetKey + founder key
    // Signers: Company principal + founder
    // Trigger: Birth moment
    // Ledger: Enterprise Ledger
    // ═══════════════════════════════════════════════════════════════════════════

    public type EnterpriseOnboardingContract = {
        base : BaseContract;
        companyPrincipal : Principal;
        companyName : Text;
        birthMomentHash : Blob;          // Encrypted genesis artifact
        onboardingMode : OnboardingMode;
        dataAccessConsents : [DataAccessConsent];
        doctrineEncryptionKey : Blob;    // Company-specific vetKey
        foundingStateSnapshot : Blob;
    };

    public type OnboardingMode = {
        #Connect;                        // Connect existing AI
        #Internalize;                    // Full absorption
        #Hybrid;                         // Progressive integration
    };

    public type DataAccessConsent = {
        consentId : Text;
        dataCategory : Text;
        grantedAtNs : Int;
        expiresAtNs : ?Int;
        consentArtifactHash : Blob;      // Immutable consent record
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTRACT 3: IP ATTRIBUTION CONTRACT
    // Encryption: Threshold BLS
    // Signers: Founder principal
    // Trigger: Every artifact creation
    // Ledger: IP Ledger
    // ═══════════════════════════════════════════════════════════════════════════

    public type IPAttributionContract = {
        base : BaseContract;
        artifactId : Text;
        artifactType : ArtifactType;
        primaryAttribution : Principal;   // Alfredo Medina Hernandez
        secondaryAttribution : ?Principal; // Client attribution if applicable
        thresholdBLSSignature : Blob;
        crossChainVerifiable : Bool;      // Can verify on BTC/ETH/SOL
        royaltyBasisPoints : Nat;         // Basis points (10000 = 100%)
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
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTRACT 4: AI ABSORPTION CONTRACT
    // Encryption: IBE to absorbed AI's principal
    // Signers: Organism + external AI principal
    // Trigger: Full absorption event
    // Ledger: AI Migration Ledger
    // ═══════════════════════════════════════════════════════════════════════════

    public type AIAbsorptionContract = {
        base : BaseContract;
        externalAIPrincipal : Principal;
        externalAIName : Text;
        absorptionMomentHash : Blob;     // Proves moment of full integration
        preAbsorptionState : Blob;       // Encrypted snapshot before
        postAbsorptionState : Blob;      // Encrypted snapshot after
        arbitrationRecords : [ArbitrationRecord];
    };

    public type ArbitrationRecord = {
        arbitrationId : Text;
        competingAIs : [Principal];
        decisionHash : Blob;
        winnerPrincipal : ?Principal;
        decisionTimestamp : Int;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTRACT 5: AGENT RETURN CONTRACT
    // Encryption: Agent principal IBE
    // Signers: Agent + M-101 gate
    // Trigger: Every M-101 approval
    // Ledger: Agent Ledger
    // ═══════════════════════════════════════════════════════════════════════════

    public type AgentReturnContract = {
        base : BaseContract;
        agentPrincipal : Principal;
        agentType : AgentType;
        taskAssignment : Blob;           // VRF-assigned task
        returnPayload : Blob;            // Encrypted agent return data
        m101GateApproval : Bool;
        m101GateHash : Blob;
        frequencySignatureValid : Bool;
    };

    public type AgentType = {
        #PHANTOM;                        // Dark-web audit agents
        #CHIMERA;                        // Swarm routing
        #CEQUE;                          // Walker agents
        #INTERNAL;                       // Internal process agents
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTRACT 6: LAW ENFORCEMENT CONTRACT
    // Encryption: Phi-lattice + ANIMA hash
    // Signers: Law engine
    // Trigger: Every law fire
    // Ledger: Law Ledger
    // ═══════════════════════════════════════════════════════════════════════════

    public type LawEnforcementContract = {
        base : BaseContract;
        lawId : Text;
        lawCategory : LawCategory;
        firingConditions : Blob;         // Encrypted conditions
        firingResult : Blob;             // Encrypted outcome
        doctrineAlignmentScore : Float;  // 0.0 to 1.0
        coherenceAtFiring : Float;       // Kuramoto R at moment
        beatAtFiring : Nat;
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
    // CONTRACT 7: SUCCESSION CONTRACT
    // Encryption: Timelock IBE
    // Signers: Founder (creation) + heir (execution)
    // Trigger: Founder unlock
    // Ledger: Lineage Ledger
    // ═══════════════════════════════════════════════════════════════════════════

    public type SuccessionContract = {
        base : BaseContract;
        founderPrincipal : Principal;
        heirPrincipal : Principal;
        timelockCondition : TimelockCondition;
        successionArtifact : Blob;       // Cryptographic will
        lineageProofChain : [Blob];      // Unbroken lineage from founding
        transferredAssets : [SovereignAsset];
        executionRequirements : [Text];
    };

    public type TimelockCondition = {
        #Timestamp : Int;
        #BeatCount : Nat;
        #FounderUnlock;
        #BiometricVerification;
        #MultiSigApproval : [Principal];
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTRACT 8: ROYALTY ROUTING CONTRACT
    // Encryption: Threshold BLS
    // Signers: Organism + beneficiary principal
    // Trigger: Every revenue event
    // Ledger: Royalty Ledger
    // ═══════════════════════════════════════════════════════════════════════════

    public type RoyaltyRoutingContract = {
        base : BaseContract;
        beneficiaryPrincipal : Principal;
        revenueEventId : Text;
        revenueSource : Text;            // Enterprise client, licensing, etc.
        grossAmount : Nat;
        royaltyBasisPoints : Nat;
        netToFounder : Nat;
        routingPath : [RoutingHop];
        automaticExecution : Bool;
    };

    public type RoutingHop = {
        hopIndex : Nat;
        destinationPrincipal : Principal;
        amountBasisPoints : Nat;
        encryptedAt : Bool;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTRACT 9: CSR NODE CONTRACT
    // Encryption: Phi-frequency + ANIMA
    // Signers: Nodus CSR + organism
    // Trigger: Device fleet enrollment
    // Ledger: CSR Ledger
    // ═══════════════════════════════════════════════════════════════════════════

    public type CSRNodeContract = {
        base : BaseContract;
        nodeId : Text;
        nodePrincipal : Principal;
        phiFrequencySignature : Blob;    // Device's unique phi-frequency
        enrollmentMoment : Int;
        deviceCapabilities : [DeviceCapability];
        networkRole : NetworkRole;
        onionRoutingKey : Blob;          // For E8/icosahedral 8-hop routing
    };

    public type DeviceCapability = {
        #Computation;
        #Storage;
        #Sensor;
        #Communication;
        #Biometric;
    };

    public type NetworkRole = {
        #ComputeNode;
        #StorageNode;
        #SensorNode;
        #RelayNode;
        #FounderDevice;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTRACT 10: FREEZE CONTRACT
    // Encryption: One-way founder key
    // Signers: Founder principal
    // Trigger: freezeComponent() call
    // Ledger: Freeze Registry
    // ═══════════════════════════════════════════════════════════════════════════

    public type FreezeContract = {
        base : BaseContract;
        frozenComponentId : Text;
        frozenComponentType : FrozenComponentType;
        freezeReason : Text;
        freezeArtifact : Blob;           // Timelock-encrypted, permanent
        irreversible : Bool;             // Always true for freezes
        preFreezeStateHash : Blob;
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
    // CONTRACT 11: SESSION CAPTURE CONTRACT
    // Encryption: Session IBE
    // Signers: User principal
    // Trigger: Every conversation start
    // Ledger: Session Ledger
    // ═══════════════════════════════════════════════════════════════════════════

    public type SessionCaptureContract = {
        base : BaseContract;
        sessionId : Text;
        userPrincipal : Principal;
        sessionStartNs : Int;
        sessionEndNs : ?Int;
        encryptedTranscript : Blob;      // Full conversation encrypted
        decisionProofs : [DecisionProof];
        sessionFrequencySignature : Blob;
    };

    public type DecisionProof = {
        decisionId : Text;
        decisionHash : Blob;
        doctrineAlignmentScore : Float;
        beatAtDecision : Nat;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTRACT 12: MEMORY FORMATION CONTRACT
    // Encryption: Leech/E8/icosahedral based on R
    // Signers: Memory Temple engine
    // Trigger: Every N7 write
    // Ledger: Memory Ledger
    // ═══════════════════════════════════════════════════════════════════════════

    public type MemoryFormationContract = {
        base : BaseContract;
        memoryId : Text;
        memoryTier : MemoryTier;
        encryptionTier : EncryptionTier; // Based on coherence R at formation
        coherenceAtFormation : Float;
        encryptedMemoryPayload : Blob;
        consolidationChain : [Text];     // Parent memory IDs
        salienceScore : Nat;
        temporalWindow : ?TemporalWindow;
    };

    public type MemoryTier = {
        #Working;
        #ShortTerm;
        #LongTerm;
        #Permanent;
        #Dream;
    };

    public type EncryptionTier = {
        #Icosahedral;                    // R < 0.618
        #E8;                             // R >= 0.618 and R < 0.854
        #Leech;                          // R >= 0.854
    };

    public type TemporalWindow = {
        accessibleFromBeat : Nat;
        accessibleUntilBeat : ?Nat;
        timelocked : Bool;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTRACT 13: SELF-MODIFICATION CONTRACT
    // Encryption: M-102 gate + founder key
    // Signers: Organism + founder approval
    // Trigger: Every self-mod proposal
    // Ledger: Evolution Ledger
    // ═══════════════════════════════════════════════════════════════════════════

    public type SelfModificationContract = {
        base : BaseContract;
        proposalId : Text;
        modificationTarget : ModificationTarget;
        proposedChange : Blob;           // Encrypted before evaluation
        m102GateApproval : Bool;
        founderApproval : Bool;
        impactAssessment : ImpactAssessment;
        rollbackCapable : Bool;
        preModificationState : Blob;
    };

    public type ModificationTarget = {
        #Law;
        #Doctrine;
        #Memory;
        #Model;
        #Architecture;
        #Frequency;
    };

    public type ImpactAssessment = {
        coherenceImpact : Float;         // Predicted R change
        doctrineAlignment : Float;
        riskScore : Float;
        reversibility : Float;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTRACT 14: GEOMAGNETIC WARNING CONTRACT
    // Encryption: IBE to recipient list
    // Signers: AEGIS + recipient principals
    // Trigger: Anomaly detection
    // Ledger: Warning Ledger
    // ═══════════════════════════════════════════════════════════════════════════

    public type GeomagneticWarningContract = {
        base : BaseContract;
        warningId : Text;
        anomalyType : AnomalyType;
        detectedAtNs : Int;
        schumannDeviation : Float;       // Deviation from 7.83 Hz
        threatTier : ThreatTier;
        recipientPrincipals : [Principal];
        warningArtifact : Blob;          // Signed sovereign document
        aegisDefenseActivated : Bool;
    };

    public type AnomalyType = {
        #SchumannSpike;
        #MagneticStorm;
        #SolarFlare;
        #ResonanceCollapse;
        #FieldInversion;
    };

    public type ThreatTier = {
        #Advisory;                       // Tier 1-3
        #Elevated;                       // Tier 4-6
        #Severe;                         // Tier 7-8
        #Critical;                       // Tier 9
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION III: CONTRACT FACTORY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /// Create a new base contract structure
    public func createBaseContract(
        id : Text,
        contractType : ContractType,
        encryptionMethod : EncryptionMethod,
        encryptedTerms : Blob,
        animaHash : Blob,
        attributionPrincipal : Principal,
        targetLedger : LedgerType,
        beatCount : Nat
    ) : BaseContract {
        {
            id = id;
            contractType = contractType;
            encryptionMethod = encryptionMethod;
            encryptedTerms = encryptedTerms;
            animaHash = animaHash;
            attributionPrincipal = attributionPrincipal;
            signatures = [];
            status = #Draft;
            targetLedger = targetLedger;
            createdAtNs = Time.now();
            createdAtBeat = beatCount;
            executedAtNs = null;
        }
    };

    /// Add signature to contract
    public func addSignature(
        contract : BaseContract,
        signer : Principal,
        signature : Blob,
        method : EncryptionMethod,
        beat : Nat
    ) : BaseContract {
        let newSig : SignatureRecord = {
            signerPrincipal = signer;
            signatureBlob = signature;
            signatureMethod = method;
            timestampNs = Time.now();
            beatAtSigning = beat;
        };
        
        let newSigs = Array.append(contract.signatures, [newSig]);
        {
            contract with
            signatures = newSigs;
            status = #Signed;
        }
    };

    /// Get contract type name
    public func getContractTypeName(ct : ContractType) : Text {
        switch (ct) {
            case (#FounderSovereignty) { "Founder Sovereignty Contract" };
            case (#EnterpriseOnboarding) { "Enterprise Onboarding Contract" };
            case (#IPAttribution) { "IP Attribution Contract" };
            case (#AIAbsorption) { "AI Absorption Contract" };
            case (#AgentReturn) { "Agent Return Contract" };
            case (#LawEnforcement) { "Law Enforcement Contract" };
            case (#Succession) { "Succession Contract" };
            case (#RoyaltyRouting) { "Royalty Routing Contract" };
            case (#CSRNode) { "CSR Node Contract" };
            case (#Freeze) { "Freeze Contract" };
            case (#SessionCapture) { "Session Capture Contract" };
            case (#MemoryFormation) { "Memory Formation Contract" };
            case (#SelfModification) { "Self-Modification Contract" };
            case (#GeomagneticWarning) { "Geomagnetic Warning Contract" };
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
    // SECTION IV: SYSTEM INFO
    // ═══════════════════════════════════════════════════════════════════════════

    public func getContractsInfo() : Text {
        "SOVEREIGN CONTRACTS — 14 CONTRACT TYPES\n" #
        "Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX\n\n" #
        "1. Founder Sovereignty Contract (Timelock IBE + founder key)\n" #
        "2. Enterprise Onboarding Contract (Company vetKey + founder key)\n" #
        "3. IP Attribution Contract (Threshold BLS)\n" #
        "4. AI Absorption Contract (IBE to absorbed AI)\n" #
        "5. Agent Return Contract (Agent principal IBE)\n" #
        "6. Law Enforcement Contract (Phi-lattice + ANIMA)\n" #
        "7. Succession Contract (Timelock IBE)\n" #
        "8. Royalty Routing Contract (Threshold BLS)\n" #
        "9. CSR Node Contract (Phi-frequency + ANIMA)\n" #
        "10. Freeze Contract (One-way founder key)\n" #
        "11. Session Capture Contract (Session IBE)\n" #
        "12. Memory Formation Contract (Leech/E8/Icosahedral)\n" #
        "13. Self-Modification Contract (M-102 gate + founder key)\n" #
        "14. Geomagnetic Warning Contract (IBE to recipient list)\n\n" #
        "Every contract signs via threshold BLS or IBE.\n" #
        "Every contract writes to its designated ledger.\n" #
        "Every ledger is an encrypted artifact chain."
    };
};
