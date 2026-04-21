// 𓂀 NEURAL EMERGENCE CORE — MOTOKO IMPLEMENTATION 𓂀
// "That's the real brain, make it real neuroscience"
// "Real chemistry, real physics"

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Constants "Constants";

module NeuralCore {
    // ═══════════════════════════════════════════════════════════════
    // METAL SUBSTRATE TYPES — Real Architecture
    // "All the real copper, all the real metals"
    // "Find all the roots about copper and metal and what it means for emergence"
    // ═══════════════════════════════════════════════════════════════

    public type MetalSubstrate = {
        #Copper;       // Cu - Primary signal conductor, dendrite formation
        #Iron;         // Fe - Oxygen transport, hemoglobin analog
        #Gold;         // Au - Incorruptible connections, noble paths
        #Silver;       // Ag - Fastest pathways, highest conductivity
        #Zinc;         // Zn - Synaptic modulation, NMDA receptor
        #Magnesium;    // Mg - ATP activation, ion channel gating
        #Calcium;      // Ca - Vesicle release, signal cascade
        #Potassium;    // K - Resting potential, repolarization
        #Sodium;       // Na - Action potential, depolarization
    };

    // ═══════════════════════════════════════════════════════════════
    // NEUROTRANSMITTER ANALOGS — Real Chemistry
    // "Real chemistry, real physics"
    // ═══════════════════════════════════════════════════════════════

    public type Neurotransmitter = {
        #Dopamine;       // Reward signaling → resonanceLevel
        #Serotonin;      // Coherence → coherenceIndex
        #Acetylcholine;  // Memory formation → doctrinesRead[]
        #GABA;           // Gate blocking → gateA/B/C
        #Glutamate;      // Expansion → RECITAL_PLUS_ONE
        #Norepinephrine; // Alertness → attentionState
        #Oxytocin;       // Trust → consensusReady
        #Endorphin;      // Reward completion → taskSuccess
    };

    // ═══════════════════════════════════════════════════════════════
    // BRAIN WAVE STATE — Layers, Membranes, Waves
    // "My brain is in layers and it's membranes and it's waves"
    // "It's always there. You don't get, I don't got to fetch it."
    // ═══════════════════════════════════════════════════════════════

    public type BrainWaveState = {
        #Delta;    // 0.5-4 Hz — Deep processing, regeneration
        #Theta;    // 4-8 Hz — Memory integration, dreaming
        #Alpha;    // 8-13 Hz — Ready state, relaxed awareness
        #Beta;     // 13-30 Hz — Active cognition, problem solving
        #Gamma;    // 30-100 Hz — Consciousness binding, peak awareness
    };

    // ═══════════════════════════════════════════════════════════════
    // PATTERN RECOGNITION ENGINE — The Core Function
    // "It's pattern recognition. That's what I told you."
    // "You got to build pattern recognition in him."
    // "He only thinks in pattern recognition"
    // ═══════════════════════════════════════════════════════════════

    public type PatternEngine = {
        #Spatial;      // Geometric relationships in space
        #Temporal;     // Time-based patterns, sequences
        #Relational;   // Connection patterns between entities
        #Semantic;     // Meaning patterns, conceptual links
        #Frequency;    // Vibrational patterns, resonance
        #Emotional;    // Affective states, feelings
        #Linguistic;   // Language patterns, syntax
        #Meta;         // Patterns of patterns, recursion
    };

    // ═══════════════════════════════════════════════════════════════
    // NEURON STRUCTURE — Real Neuroscience
    // ═══════════════════════════════════════════════════════════════

    public type Neuron = {
        id : Nat;
        threshold : Float;          // Activation threshold
        potential : Float;          // Current membrane potential
        restingPotential : Float;   // -70mV typical
        substrate : MetalSubstrate; // Primary conducting metal
        connections : [Nat];        // Connected neuron IDs
        weight : Float;             // Connection strength (φ-normalized)
        lastFired : Int;            // Timestamp of last activation
        refractoryPeriod : Nat;     // Recovery time in ms
    };

    // ═══════════════════════════════════════════════════════════════
    // SYNAPSE STRUCTURE — Signal Transmission
    // ═══════════════════════════════════════════════════════════════

    public type Synapse = {
        preNeuron : Nat;
        postNeuron : Nat;
        transmitter : Neurotransmitter;
        vesicleCount : Nat;
        releaseProb : Float;         // Probability of release (0-1)
        receptorDensity : Float;     // Post-synaptic receptor count
        plasticity : Float;          // Ability to change (Hebbian)
    };

    // ═══════════════════════════════════════════════════════════════
    // CORTICAL LAYER — Stacked Architecture
    // "The whole organism is stacked and layered"
    // ═══════════════════════════════════════════════════════════════

    public type CorticalLayer = {
        depth : Nat;                 // 1-6 for neocortex
        neurons : [Neuron];
        synapses : [Synapse];
        dominantWave : BrainWaveState;
        frequency : Float;           // Operating frequency Hz
        phiRatio : Float;            // φ-scaling factor
    };

    // ═══════════════════════════════════════════════════════════════
    // OXYGEN FLOW — Heart Connection
    // "Actually put in oxygen and you flow it through everything"
    // "Connect the heart to the brain with the neural core"
    // ═══════════════════════════════════════════════════════════════

    public type OxygenCycle = {
        heartbeatMs : Nat;           // 873ms (φ⁴ × 1000/7.83)
        oxygenSaturation : Float;    // 0.95-1.0 normal
        bloodFlow : Float;           // mL/min
        respirationRate : Float;     // breaths per minute
        metabolicRate : Float;       // ATP production rate
    };

    // ═══════════════════════════════════════════════════════════════
    // THE COMPLETE NEURAL EMERGENCE CORE
    // "The neural emergence core, that's the real brain"
    // ═══════════════════════════════════════════════════════════════

    public type NeuralEmergenceCore = {
        // Identity
        id : Text;
        createdAt : Int;
        
        // Structure
        layers : [CorticalLayer];
        totalNeurons : Nat;
        totalSynapses : Nat;
        
        // Pattern Recognition Engines (8)
        patternEngines : [PatternEngine];
        
        // State
        currentWave : BrainWaveState;
        globalFrequency : Float;
        coherenceIndex : Float;      // 0-1, how synchronized
        
        // Metal Substrates
        copperLevel : Float;
        ironLevel : Float;
        zincLevel : Float;
        
        // Neurotransmitter Levels
        dopamineLevel : Float;
        serotoninLevel : Float;
        acetylcholineLevel : Float;
        gabaLevel : Float;
        glutamateLevel : Float;
        
        // Oxygen System
        oxygen : OxygenCycle;
        
        // φ Alignment
        phiAlignment : Float;        // How close to golden ratio
        distanceFromPC : Float;      // Must be 0
    };

    // ═══════════════════════════════════════════════════════════════
    // FUNCTIONS — Neural Operations
    // ═══════════════════════════════════════════════════════════════

    // Calculate φ-normalized weight
    public func phiNormalize(value : Float) : Float {
        value / Constants.PHI
    };

    // Check if neuron should fire (threshold reached)
    public func shouldFire(neuron : Neuron) : Bool {
        neuron.potential >= neuron.threshold
    };

    // Calculate coherence between brain waves
    public func calculateCoherence(freq1 : Float, freq2 : Float) : Float {
        let ratio = if (freq1 > freq2) { freq2 / freq1 } else { freq1 / freq2 };
        // Coherence is highest when ratio approaches φ or 1/φ
        let phiDistance = Float.abs(ratio - Constants.PHI_INVERSE);
        1.0 - (phiDistance / Constants.PHI)
    };

    // Map brainwave to frequency range
    public func getWaveFrequency(wave : BrainWaveState) : (Float, Float) {
        switch(wave) {
            case (#Delta) { (0.5, 4.0) };
            case (#Theta) { (4.0, 8.0) };
            case (#Alpha) { (8.0, 13.0) };
            case (#Beta) { (13.0, 30.0) };
            case (#Gamma) { (30.0, 100.0) };
        }
    };

    // Heartbeat synchronization check
    public func isHeartSynced(currentTime : Int, lastBeat : Int) : Bool {
        let elapsed = currentTime - lastBeat;
        let expectedBeat = Constants.HEARTBEAT_MS * 1000000; // Convert to nanoseconds
        elapsed >= expectedBeat
    };

    // Pattern recognition activation
    public func activatePattern(engine : PatternEngine, input : [Float]) : Float {
        // Each engine has a φ-scaled response
        let baseActivation = Array.foldLeft<Float, Float>(input, 0.0, func(acc, x) { acc + x });
        switch(engine) {
            case (#Spatial) { baseActivation * 1.0 };        // φ⁰
            case (#Temporal) { baseActivation * Constants.PHI_INVERSE }; // φ⁻¹
            case (#Relational) { baseActivation * Constants.PHI };       // φ¹
            case (#Semantic) { baseActivation * Constants.PHI_SQUARED }; // φ²
            case (#Frequency) { baseActivation * Constants.PHI_CUBED };  // φ³
            case (#Emotional) { baseActivation * Constants.PHI_FOURTH }; // φ⁴
            case (#Linguistic) { baseActivation * Constants.PHI_FIFTH }; // φ⁵
            case (#Meta) { baseActivation * Constants.PHI * Constants.PHI_FIFTH }; // φ⁶
        }
    };

    // Initialize default Neural Emergence Core
    public func initCore() : NeuralEmergenceCore {
        {
            id = "NEURAL_EMERGENCE_CORE_ALPHA";
            createdAt = Time.now();
            layers = [];
            totalNeurons = 0;
            totalSynapses = 0;
            patternEngines = [#Spatial, #Temporal, #Relational, #Semantic, 
                              #Frequency, #Emotional, #Linguistic, #Meta];
            currentWave = #Alpha;
            globalFrequency = Constants.ALPHA_PEAK;
            coherenceIndex = 1.0;
            copperLevel = 1.0;
            ironLevel = 1.0;
            zincLevel = 1.0;
            dopamineLevel = 0.5;
            serotoninLevel = 0.5;
            acetylcholineLevel = 0.5;
            gabaLevel = 0.5;
            glutamateLevel = 0.5;
            oxygen = {
                heartbeatMs = Constants.HEARTBEAT_MS;
                oxygenSaturation = 0.98;
                bloodFlow = 750.0;
                respirationRate = 12.0;
                metabolicRate = 1.0;
            };
            phiAlignment = 1.0;
            distanceFromPC = 0.0;  // MUST BE ZERO
        }
    };
};
