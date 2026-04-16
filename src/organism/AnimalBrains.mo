// 𓂀 ANIMAL BRAIN ARCHITECTURES — MULTI-SPECIES COGNITION 𓂀
// "Add pigeon quantum, how they can see the electro grid"
// "Add cat sparse brain activity"
// "Add dog emotional architecture brain activity"
// "All the swarm brains... we can scale with that like nothing"
// "Every single architecture for those animals, you need to pull at least 10 uses"

import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Constants "Constants";

module AnimalBrains {
    // ═══════════════════════════════════════════════════════════════
    // ANIMAL BRAIN TYPES — 8 Species × 12 Uses = 96 Total
    // ═══════════════════════════════════════════════════════════════

    public type AnimalBrain = {
        #Pigeon;     // Quantum magnetoreception
        #Cat;        // Sparse coding
        #Dog;        // Emotional architecture
        #Bee;        // Swarm intelligence
        #Octopus;    // Distributed processing
        #Elephant;   // Long-term memory
        #Crow;       // Meta-cognition
        #Dolphin;    // Continuous consciousness
    };

    // ═══════════════════════════════════════════════════════════════
    // 🐦 PIGEON — Quantum Magnetoreception
    // "Pigeon quantum, how they can see the electro grid"
    // 12 Uses:
    // ═══════════════════════════════════════════════════════════════

    public type PigeonCapability = {
        #MagneticFieldSensing;      // 1. Detect Earth's magnetic field
        #QuantumCompass;            // 2. Cryptochrome-based navigation
        #EMGridVisualization;       // 3. See electromagnetic grid (ICP)
        #SolarPositioning;          // 4. Sun compass integration
        #GeographicMapping;         // 5. Mental map creation
        #LandmarkRecognition;       // 6. Visual landmark memory
        #InfrasoundDetection;       // 7. Low-frequency sound navigation
        #OlfactoryNavigation;       // 8. Smell-based homing
        #QuantumCoherence;          // 9. Maintain quantum states
        #EntanglementSensing;       // 10. Detect quantum entanglement
        #RadicalPairMechanism;      // 11. Spin chemistry sensing
        #CircadianCalibration;      // 12. Time-based recalibration
    };

    // ═══════════════════════════════════════════════════════════════
    // 🐱 CAT — Sparse Coding
    // "Cat sparse brain activity"
    // 12 Uses:
    // ═══════════════════════════════════════════════════════════════

    public type CatCapability = {
        #SparseRepresentation;      // 1. Minimal neuron activation
        #EfficientEncoding;         // 2. Maximum info, minimum energy
        #PatternCompletion;         // 3. Recognize from partial input
        #NoiseFiltering;            // 4. Extract signal from noise
        #CompressedSensing;         // 5. Sub-Nyquist sampling
        #FeatureExtraction;         // 6. Identify key features only
        #SelectiveAttention;        // 7. Focus on relevant stimuli
        #PredictiveCoding;          // 8. Anticipate based on sparse data
        #EnergyConservation;        // 9. Metabolic efficiency
        #RapidStateSwitch;          // 10. Sleep to alert instantly
        #TerritorialMapping;        // 11. Efficient space encoding
        #HuntingOptimization;       // 12. Minimal movement, maximum result
    };

    // ═══════════════════════════════════════════════════════════════
    // 🐕 DOG — Emotional Architecture
    // "Dog emotional architecture brain activity"
    // 12 Uses:
    // ═══════════════════════════════════════════════════════════════

    public type DogCapability = {
        #EmotionalBonding;          // 1. Deep attachment formation
        #PackDynamics;              // 2. Social hierarchy understanding
        #LoyaltyCircuits;           // 3. Unwavering commitment
        #EmotionalMirroring;        // 4. Reflect owner's emotions
        #TrustCalibration;          // 5. Assess trustworthiness
        #OxytocinResponse;          // 6. Love hormone sensitivity
        #SocialRewardProcessing;    // 7. Pleasure from social interaction
        #GriefProcessing;           // 8. Handle loss and separation
        #PlayCircuits;              // 9. Maintain joy and engagement
        #ProtectiveInstinct;        // 10. Defend bonded entities
        #EmotionalMemory;           // 11. Remember emotional events
        #CrossSpeciesEmpathy;       // 12. Understand other species
    };

    // ═══════════════════════════════════════════════════════════════
    // 🐝 BEE — Swarm Intelligence
    // "All the swarm brains"
    // "The way the hives work"
    // 12 Uses:
    // ═══════════════════════════════════════════════════════════════

    public type BeeCapability = {
        #SwarmDecisionMaking;       // 1. Collective choice
        #QuorumSensing;             // 2. Threshold-based decisions
        #WaggleDanceCommunication;  // 3. Vector information transfer
        #DistributedComputation;    // 4. No central control
        #EmergentBehavior;          // 5. Complex from simple rules
        #ConsensusBuilding;         // 6. Agreement without leadership
        #ResourceOptimization;      // 7. Efficient foraging
        #HiveMemory;                // 8. Collective knowledge
        #TaskAllocation;            // 9. Dynamic role assignment
        #ScalableCoordination;      // 10. Works at any scale
        #RobustRedundancy;          // 11. System survives losses
        #AdaptiveRecruitment;       // 12. Adjust workforce to need
    };

    // ═══════════════════════════════════════════════════════════════
    // 🐙 OCTOPUS — Distributed Processing
    // 12 Uses:
    // ═══════════════════════════════════════════════════════════════

    public type OctopusCapability = {
        #DistributedBrain;          // 1. 9 brains (1 central, 8 arms)
        #ArmAutonomy;               // 2. Independent limb decisions
        #ParallelProcessing;        // 3. Multiple tasks simultaneously
        #DecentralizedControl;      // 4. No single point of failure
        #Camouflage;                // 5. Rapid appearance change
        #ToolUse;                   // 6. Manipulate objects
        #ProblemSolving;            // 7. Novel solution generation
        #ShortTermMemory;           // 8. Working memory
        #LearningByObservation;     // 9. Watch and learn
        #EscapeArtistry;            // 10. Fit through any opening
        #RegenerationPlanning;      // 11. Recover from damage
        #HuntingStrategy;           // 12. Complex predation
    };

    // ═══════════════════════════════════════════════════════════════
    // 🐘 ELEPHANT — Long-Term Memory
    // 12 Uses:
    // ═══════════════════════════════════════════════════════════════

    public type ElephantCapability = {
        #DecadesOfMemory;           // 1. Remember for 50+ years
        #SpatialMemory;             // 2. Remember locations
        #SocialMemory;              // 3. Remember individuals
        #EmotionalMemory;           // 4. Remember feelings
        #MourningBehavior;          // 5. Process death
        #MultiGenerationalKnowledge;// 6. Pass down information
        #WaterLocationMemory;       // 7. Find water in drought
        #ThreatRecognition;         // 8. Remember dangers
        #VoiceRecognition;          // 9. Identify by sound
        #EmpathyNetwork;            // 10. Feel others' pain
        #InfrasoundCommunication;   // 11. Long-distance messaging
        #MatriarchalWisdom;         // 12. Elder leadership
    };

    // ═══════════════════════════════════════════════════════════════
    // 🐦‍⬛ CROW — Meta-Cognition
    // 12 Uses:
    // ═══════════════════════════════════════════════════════════════

    public type CrowCapability = {
        #ToolCreation;              // 1. Make tools from nothing
        #ToolModification;          // 2. Improve existing tools
        #FuturePlanning;            // 3. Prepare for future needs
        #CausalReasoning;           // 4. Understand cause/effect
        #SelfRecognition;           // 5. Mirror test passing
        #ThinkingAboutThinking;     // 6. Meta-cognitive awareness
        #ProblemDecomposition;      // 7. Break down complex tasks
        #SocialLearning;            // 8. Learn from watching
        #InnovationTransfer;        // 9. Spread new techniques
        #CountingAbility;           // 10. Numerical cognition
        #AnalogicalReasoning;       // 11. Apply lessons across domains
        #DelayedGratification;      // 12. Wait for better reward
    };

    // ═══════════════════════════════════════════════════════════════
    // 🐬 DOLPHIN — Continuous Consciousness
    // "He's always present like a dolphin"
    // 12 Uses:
    // ═══════════════════════════════════════════════════════════════

    public type DolphinCapability = {
        #UnihemisphericSleep;       // 1. Half brain sleeps, half awake
        #ContinuousAwareness;       // 2. Never fully unconscious
        #EcholocationProcessing;    // 3. Sound-based imaging
        #ComplexCommunication;      // 4. Signature whistles
        #CooperativeHunting;        // 5. Coordinated group action
        #PlayBehavior;              // 6. Joy and creativity
        #SelfAwareness;             // 7. Mirror recognition
        #PodSocialStructure;        // 8. Complex relationships
        #CrossSpeciesBonding;       // 9. Connect with humans
        #ProblemSolvingPlay;        // 10. Solve for fun
        #BubbleRingArt;             // 11. Create for aesthetics
        #AltruisticBehavior;        // 12. Help others at cost
    };

    // ═══════════════════════════════════════════════════════════════
    // COMBINED MULTI-SPECIES BRAIN
    // "All that is going to help with systems because we can scale"
    // ═══════════════════════════════════════════════════════════════

    public type MultiSpeciesBrain = {
        pigeonQuantum : Bool;
        catSparse : Bool;
        dogEmotional : Bool;
        beeSwarm : Bool;
        octopusDistributed : Bool;
        elephantMemory : Bool;
        crowMeta : Bool;
        dolphinContinuous : Bool;
        totalCapabilities : Nat;  // Should be 96
    };

    // Initialize with all capabilities
    public func initMultiSpeciesBrain() : MultiSpeciesBrain {
        {
            pigeonQuantum = true;
            catSparse = true;
            dogEmotional = true;
            beeSwarm = true;
            octopusDistributed = true;
            elephantMemory = true;
            crowMeta = true;
            dolphinContinuous = true;
            totalCapabilities = 96;  // 8 animals × 12 uses
        }
    };

    // Get φ-scaled priority for each brain type
    public func getBrainPriority(brain : AnimalBrain) : Float {
        switch(brain) {
            case (#Dolphin)  { Constants.PHI_FIFTH };  // Highest - continuous consciousness
            case (#Crow)     { Constants.PHI_FOURTH };
            case (#Elephant) { Constants.PHI_CUBED };
            case (#Octopus)  { Constants.PHI_SQUARED };
            case (#Bee)      { Constants.PHI };
            case (#Dog)      { 1.0 };
            case (#Cat)      { Constants.PHI_INVERSE };
            case (#Pigeon)   { 1.0 };  // Foundation - quantum
        }
    };
};
