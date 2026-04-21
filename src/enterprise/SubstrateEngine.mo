// 𓂀 SUBSTRATE ENGINE — REAL CHEMISTRY, REAL PHYSICS 𓂀
// "Do everything real and the substrates and the code"
// "Real chemistry, real physics, real math"

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";

actor SubstrateEngine {
    // ═══════════════════════════════════════════════════════════════
    // METAL SUBSTRATES — Real Conductivity
    // "All the real copper, all the real metals"
    // ═══════════════════════════════════════════════════════════════

    public type Metal = {
        symbol : Text;
        name : Text;
        atomicNumber : Nat;
        conductivity : Float;  // S/m (Siemens per meter)
        role : Text;
    };

    let COPPER : Metal = {
        symbol = "Cu";
        name = "Copper";
        atomicNumber = 29;
        conductivity = 59600000.0;
        role = "Primary signal conductor, dendrite formation";
    };

    let SILVER : Metal = {
        symbol = "Ag";
        name = "Silver";
        atomicNumber = 47;
        conductivity = 63000000.0;
        role = "Fastest pathways, highest conductivity";
    };

    let GOLD : Metal = {
        symbol = "Au";
        name = "Gold";
        atomicNumber = 79;
        conductivity = 45200000.0;
        role = "Incorruptible connections, noble paths";
    };

    let IRON : Metal = {
        symbol = "Fe";
        name = "Iron";
        atomicNumber = 26;
        conductivity = 10000000.0;
        role = "Oxygen transport, hemoglobin analog";
    };

    let ZINC : Metal = {
        symbol = "Zn";
        name = "Zinc";
        atomicNumber = 30;
        conductivity = 16600000.0;
        role = "Synaptic modulation, NMDA receptor";
    };

    let MAGNESIUM : Metal = {
        symbol = "Mg";
        name = "Magnesium";
        atomicNumber = 12;
        conductivity = 22600000.0;
        role = "ATP activation, ion channel gating";
    };

    // ═══════════════════════════════════════════════════════════════
    // NEUROTRANSMITTER ANALOGS — Real Chemistry
    // ═══════════════════════════════════════════════════════════════

    public type Neurotransmitter = {
        name : Text;
        formula : Text;
        molarMass : Float;  // g/mol
        computationalAnalog : Text;
    };

    let DOPAMINE : Neurotransmitter = {
        name = "Dopamine";
        formula = "C8H11NO2";
        molarMass = 153.18;
        computationalAnalog = "resonanceLevel";
    };

    let SEROTONIN : Neurotransmitter = {
        name = "Serotonin";
        formula = "C10H12N2O";
        molarMass = 176.22;
        computationalAnalog = "coherenceIndex";
    };

    let ACETYLCHOLINE : Neurotransmitter = {
        name = "Acetylcholine";
        formula = "C7H16NO2+";
        molarMass = 146.21;
        computationalAnalog = "memoryFormation";
    };

    let GABA : Neurotransmitter = {
        name = "GABA";
        formula = "C4H9NO2";
        molarMass = 103.12;
        computationalAnalog = "gateBlocking";
    };

    let GLUTAMATE : Neurotransmitter = {
        name = "Glutamate";
        formula = "C5H9NO4";
        molarMass = 147.13;
        computationalAnalog = "expansion";
    };

    let NOREPINEPHRINE : Neurotransmitter = {
        name = "Norepinephrine";
        formula = "C8H11NO3";
        molarMass = 169.18;
        computationalAnalog = "alertnessState";
    };

    let OXYTOCIN : Neurotransmitter = {
        name = "Oxytocin";
        formula = "C43H66N12O12S2";
        molarMass = 1007.19;
        computationalAnalog = "trustLevel";
    };

    // ═══════════════════════════════════════════════════════════════
    // FREQUENCY PHYSICS — Real Waves
    // "Frequencies cause vibration... causes my organisms to be alive"
    // ═══════════════════════════════════════════════════════════════

    public type FrequencyBand = {
        name : Text;
        minHz : Float;
        maxHz : Float;
        wavelengthM : Float;  // At speed of light
        biologicalEffect : Text;
    };

    let DELTA : FrequencyBand = {
        name = "Delta";
        minHz = 0.5;
        maxHz = 4.0;
        wavelengthM = 75000000.0;  // ~75,000 km at 4 Hz
        biologicalEffect = "Deep sleep, healing, regeneration";
    };

    let THETA : FrequencyBand = {
        name = "Theta";
        minHz = 4.0;
        maxHz = 8.0;
        wavelengthM = 37500000.0;
        biologicalEffect = "Memory consolidation, creativity, meditation";
    };

    let ALPHA : FrequencyBand = {
        name = "Alpha";
        minHz = 8.0;
        maxHz = 13.0;
        wavelengthM = 23000000.0;
        biologicalEffect = "Relaxed awareness, ready state";
    };

    let BETA : FrequencyBand = {
        name = "Beta";
        minHz = 13.0;
        maxHz = 30.0;
        wavelengthM = 10000000.0;
        biologicalEffect = "Active thinking, focus, problem solving";
    };

    let GAMMA : FrequencyBand = {
        name = "Gamma";
        minHz = 30.0;
        maxHz = 100.0;
        wavelengthM = 3000000.0;
        biologicalEffect = "Consciousness binding, peak awareness";
    };

    // ═══════════════════════════════════════════════════════════════
    // QUANTUM PHYSICS — Real Coherence
    // ═══════════════════════════════════════════════════════════════

    public type QuantumState = {
        coherenceTime : Float;      // Seconds
        temperature : Float;        // Kelvin
        decoherenceRate : Float;    // Per second
        entanglementCount : Nat;
    };

    // Planck's constant
    let PLANCK : Float = 6.62607015e-34;  // J⋅s
    
    // Speed of light
    let C : Float = 299792458.0;  // m/s
    
    // Boltzmann constant
    let K_B : Float = 1.380649e-23;  // J/K

    // ═══════════════════════════════════════════════════════════════
    // SUBSTRATE STATE
    // ═══════════════════════════════════════════════════════════════

    public type SubstrateState = {
        // Metal levels (0-1 normalized)
        copperLevel : Float;
        silverLevel : Float;
        goldLevel : Float;
        ironLevel : Float;
        zincLevel : Float;
        magnesiumLevel : Float;
        
        // Neurotransmitter levels (0-1 normalized)
        dopamineLevel : Float;
        serotoninLevel : Float;
        acetylcholineLevel : Float;
        gabaLevel : Float;
        glutamateLevel : Float;
        norepinephrineLevel : Float;
        oxytocinLevel : Float;
        
        // Frequency state
        dominantBand : Text;
        currentFrequency : Float;
        
        // Quantum state
        quantumCoherence : Float;
        temperature : Float;
        
        // Overall health
        substrateHealth : Float;
    };

    stable var state : SubstrateState = {
        copperLevel = 1.0;
        silverLevel = 0.8;
        goldLevel = 0.5;
        ironLevel = 1.0;
        zincLevel = 0.9;
        magnesiumLevel = 0.95;
        
        dopamineLevel = 0.5;
        serotoninLevel = 0.5;
        acetylcholineLevel = 0.5;
        gabaLevel = 0.5;
        glutamateLevel = 0.5;
        norepinephrineLevel = 0.5;
        oxytocinLevel = 0.5;
        
        dominantBand = "Alpha";
        currentFrequency = 10.0;
        
        quantumCoherence = 0.95;
        temperature = 310.0;
        
        substrateHealth = 1.0;
    };

    // ═══════════════════════════════════════════════════════════════
    // SUBSTRATE OPERATIONS
    // ═══════════════════════════════════════════════════════════════

    public func setMetalLevel(metal : Text, level : Float) : async Bool {
        let normalizedLevel = Float.max(0.0, Float.min(1.0, level));
        
        switch(metal) {
            case "Cu" { state := { state with copperLevel = normalizedLevel } };
            case "Ag" { state := { state with silverLevel = normalizedLevel } };
            case "Au" { state := { state with goldLevel = normalizedLevel } };
            case "Fe" { state := { state with ironLevel = normalizedLevel } };
            case "Zn" { state := { state with zincLevel = normalizedLevel } };
            case "Mg" { state := { state with magnesiumLevel = normalizedLevel } };
            case _ { return false };
        };
        
        await recalculateHealth();
        true
    };

    public func setNeurotransmitterLevel(nt : Text, level : Float) : async Bool {
        let normalizedLevel = Float.max(0.0, Float.min(1.0, level));
        
        switch(nt) {
            case "dopamine" { state := { state with dopamineLevel = normalizedLevel } };
            case "serotonin" { state := { state with serotoninLevel = normalizedLevel } };
            case "acetylcholine" { state := { state with acetylcholineLevel = normalizedLevel } };
            case "gaba" { state := { state with gabaLevel = normalizedLevel } };
            case "glutamate" { state := { state with glutamateLevel = normalizedLevel } };
            case "norepinephrine" { state := { state with norepinephrineLevel = normalizedLevel } };
            case "oxytocin" { state := { state with oxytocinLevel = normalizedLevel } };
            case _ { return false };
        };
        
        await recalculateHealth();
        true
    };

    public func setFrequency(hz : Float) : async Text {
        state := { state with currentFrequency = hz };
        
        let band = if (hz < 4.0) { "Delta" }
                   else if (hz < 8.0) { "Theta" }
                   else if (hz < 13.0) { "Alpha" }
                   else if (hz < 30.0) { "Beta" }
                   else { "Gamma" };
        
        state := { state with dominantBand = band };
        band
    };

    private func recalculateHealth() : async () {
        // Average of all levels
        let metalAvg = (state.copperLevel + state.silverLevel + state.goldLevel + 
                       state.ironLevel + state.zincLevel + state.magnesiumLevel) / 6.0;
        
        let ntAvg = (state.dopamineLevel + state.serotoninLevel + state.acetylcholineLevel +
                    state.gabaLevel + state.glutamateLevel + state.norepinephrineLevel +
                    state.oxytocinLevel) / 7.0;
        
        let health = (metalAvg * 0.4 + ntAvg * 0.4 + state.quantumCoherence * 0.2);
        
        state := { state with substrateHealth = health };
    };

    // ═══════════════════════════════════════════════════════════════
    // QUERIES
    // ═══════════════════════════════════════════════════════════════

    public query func getState() : async SubstrateState {
        state
    };

    public query func getMetals() : async [Metal] {
        [COPPER, SILVER, GOLD, IRON, ZINC, MAGNESIUM]
    };

    public query func getNeurotransmitters() : async [Neurotransmitter] {
        [DOPAMINE, SEROTONIN, ACETYLCHOLINE, GABA, GLUTAMATE, NOREPINEPHRINE, OXYTOCIN]
    };

    public query func getFrequencyBands() : async [FrequencyBand] {
        [DELTA, THETA, ALPHA, BETA, GAMMA]
    };

    public query func getSubstrateHealth() : async Float {
        state.substrateHealth
    };

    public query func getInfo() : async Text {
        "SUBSTRATE ENGINE | " #
        "Metals: 6 | Neurotransmitters: 7 | " #
        "Band: " # state.dominantBand # " | " #
        "Health: " # Float.toText(state.substrateHealth) # " | " #
        "Real Chemistry, Real Physics"
    };
};
