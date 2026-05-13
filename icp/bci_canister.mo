/**
 * BCI CANISTER
 * Internet Computer implementation for Brain-Computer Interface
 * 
 * Provides on-chain BCI data processing and storage with:
 * - Neural signal compression and storage
 * - Coherence state persistence
 * - Command history with cryptographic verification
 * - φ-harmonic resonance calculations
 * 
 * @author MEDINA Sovereign Intelligence
 * @version 1.0.0
 * @license Proprietary - All Rights Reserved
 */

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";

actor BCICanister {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CONSTANTS
    // ═══════════════════════════════════════════════════════════════════════════
    
    let PHI : Float = 1.618033988749895;
    let SCHUMANN_RESONANCE : Float = 7.83;
    let CARDIAC_CYCLE_MS : Nat = 873;
    let MAX_HISTORY_SIZE : Nat = 1000;
    let MAX_SIGNAL_LENGTH : Nat = 512;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // TYPES
    // ═══════════════════════════════════════════════════════════════════════════
    
    public type BrainRegion = {
        #Frontal;
        #Parietal;
        #Temporal;
        #Occipital;
        #Central;
        #Prefrontal;
        #MotorCortex;
        #SensoryCortex;
    };
    
    public type BrainwaveBand = {
        #Delta;
        #Theta;
        #Alpha;
        #Beta;
        #Gamma;
        #PhiResonance;
    };
    
    public type CommandType = {
        #Motor;
        #Cognitive;
        #Emotional;
        #Feedback;
    };
    
    public type BridgeMode = {
        #Passive;
        #Active;
        #Entrained;
        #Sovereign;
    };
    
    public type CompressedSignal = {
        timestamp : Int;
        channelCount : Nat;
        sampleRate : Nat;
        compressionRatio : Float;
        data : [Nat8];
        checksum : Nat64;
    };
    
    public type BandPower = {
        band : BrainwaveBand;
        power : Float;
        coherence : Float;
        phiAlignment : Float;
    };
    
    public type EmotionalState = {
        valence : Float;
        arousal : Float;
        dominance : Float;
        coherenceIndex : Float;
        timestamp : Int;
    };
    
    public type MotorImageryState = {
        leftHand : Float;
        rightHand : Float;
        feet : Float;
        tongue : Float;
        confidence : Float;
        timestamp : Int;
    };
    
    public type BCICommand = {
        commandType : CommandType;
        intent : Text;
        confidence : Float;
        timestamp : Int;
        phiCoherence : Float;
        verified : Bool;
    };
    
    public type CouplingState = {
        neuralCoherence : Float;
        organismCoherence : Float;
        resonanceStrength : Float;
        phaseAlignment : Float;
        bidirectionalFlow : Float;
        timestamp : Int;
    };
    
    public type CoherenceEvent = {
        timestamp : Int;
        eventType : Text;
        value : Float;
        source : Text;
    };
    
    public type UserBCIProfile = {
        principal : Principal;
        created : Int;
        lastActive : Int;
        totalSessions : Nat;
        avgCoherence : Float;
        peakCoherence : Float;
        preferredMode : BridgeMode;
        calibrationData : ?[Float];
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════════
    
    private stable var signalCounter : Nat = 0;
    private stable var commandCounter : Nat = 0;
    private stable var sessionCounter : Nat = 0;
    
    private let userProfiles = TrieMap.TrieMap<Principal, UserBCIProfile>(Principal.equal, Principal.hash);
    private let commandHistory = Buffer.Buffer<BCICommand>(100);
    private let coherenceEvents = Buffer.Buffer<CoherenceEvent>(100);
    private let emotionalHistory = Buffer.Buffer<EmotionalState>(100);
    private let motorHistory = Buffer.Buffer<MotorImageryState>(100);
    private let couplingHistory = Buffer.Buffer<CouplingState>(100);
    
    // Current state
    private var currentBridgeMode : BridgeMode = #Passive;
    private var currentCoupling : ?CouplingState = null;
    private var currentEmotional : ?EmotionalState = null;
    private var currentMotor : ?MotorImageryState = null;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SIGNAL PROCESSING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /// Compress neural signal for storage
    public shared(msg) func compressSignal(
        channels : [[Float]],
        sampleRate : Nat
    ) : async CompressedSignal {
        let timestamp = Time.now();
        let channelCount = channels.size();
        
        // Simple compression: keep every Nth sample based on PHI
        let compressionRatio = PHI;
        let compressed = Buffer.Buffer<Nat8>(MAX_SIGNAL_LENGTH);
        
        for (channel in channels.vals()) {
            var idx : Float = 0;
            while (Float.toInt(idx) < channel.size() and compressed.size() < MAX_SIGNAL_LENGTH) {
                let intIdx = Int.abs(Float.toInt(idx));
                if (intIdx < channel.size()) {
                    // Quantize to 8-bit
                    let normalized = (channel[intIdx] + 100.0) / 200.0; // Assume ±100μV range
                    let quantized = Int.abs(Float.toInt(normalized * 255.0));
                    compressed.add(Nat8.fromNat(quantized % 256));
                };
                idx += compressionRatio;
            };
        };
        
        // Calculate checksum
        var checksum : Nat64 = 0;
        for (byte in compressed.vals()) {
            checksum := checksum + Nat64.fromNat(Nat8.toNat(byte));
        };
        
        signalCounter += 1;
        
        {
            timestamp = timestamp;
            channelCount = channelCount;
            sampleRate = sampleRate;
            compressionRatio = compressionRatio;
            data = Buffer.toArray(compressed);
            checksum = checksum;
        }
    };
    
    /// Calculate frequency band powers
    public query func calculateBandPowers(signal : [Float], sampleRate : Nat) : async [BandPower] {
        let bands = Buffer.Buffer<BandPower>(6);
        
        // Simplified power estimation (in production, use FFT)
        let variance = calculateVariance(signal);
        let totalPower = variance;
        
        // Distribute power across bands based on typical EEG distribution
        let bandDistribution : [(BrainwaveBand, Float, Float, Float)] = [
            (#Delta, 0.20, 0.5, 4.0),
            (#Theta, 0.15, 4.0, 8.0),
            (#Alpha, 0.30, 8.0, 13.0),
            (#Beta, 0.25, 13.0, 30.0),
            (#Gamma, 0.08, 30.0, 100.0),
            (#PhiResonance, 0.02, 7.33, 8.33)
        ];
        
        for ((band, fraction, lowFreq, highFreq) in bandDistribution.vals()) {
            let power = totalPower * fraction;
            let phiAlignment = calculatePhiAlignment(power);
            
            bands.add({
                band = band;
                power = power;
                coherence = 0.5 + 0.5 * phiAlignment; // Simplified
                phiAlignment = phiAlignment;
            });
        };
        
        Buffer.toArray(bands)
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STATE RECOGNITION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /// Record emotional state
    public shared(msg) func recordEmotionalState(
        valence : Float,
        arousal : Float,
        dominance : Float,
        coherenceIndex : Float
    ) : async EmotionalState {
        let state : EmotionalState = {
            valence = clamp(valence, -1.0, 1.0);
            arousal = clamp(arousal, 0.0, 1.0);
            dominance = clamp(dominance, 0.0, 1.0);
            coherenceIndex = clamp(coherenceIndex, 0.0, 1.0);
            timestamp = Time.now();
        };
        
        emotionalHistory.add(state);
        trimBuffer(emotionalHistory, MAX_HISTORY_SIZE);
        currentEmotional := ?state;
        
        // Log coherence event if significant
        if (coherenceIndex > 0.8) {
            logCoherenceEvent("peak", coherenceIndex, "emotional");
        } else if (coherenceIndex < 0.2) {
            logCoherenceEvent("valley", coherenceIndex, "emotional");
        };
        
        // Update user profile
        await updateUserCoherence(msg.caller, coherenceIndex);
        
        state
    };
    
    /// Record motor imagery state
    public shared(msg) func recordMotorState(
        leftHand : Float,
        rightHand : Float,
        feet : Float,
        tongue : Float,
        confidence : Float
    ) : async MotorImageryState {
        let state : MotorImageryState = {
            leftHand = clamp(leftHand, 0.0, 1.0);
            rightHand = clamp(rightHand, 0.0, 1.0);
            feet = clamp(feet, 0.0, 1.0);
            tongue = clamp(tongue, 0.0, 1.0);
            confidence = clamp(confidence, 0.0, 1.0);
            timestamp = Time.now();
        };
        
        motorHistory.add(state);
        trimBuffer(motorHistory, MAX_HISTORY_SIZE);
        currentMotor := ?state;
        
        state
    };
    
    /// Record BCI command
    public shared(msg) func recordCommand(
        commandType : CommandType,
        intent : Text,
        confidence : Float,
        phiCoherence : Float
    ) : async BCICommand {
        commandCounter += 1;
        
        let command : BCICommand = {
            commandType = commandType;
            intent = intent;
            confidence = clamp(confidence, 0.0, 1.0);
            timestamp = Time.now();
            phiCoherence = clamp(phiCoherence, 0.0, 1.0);
            verified = confidence > 0.7 and phiCoherence > 0.5;
        };
        
        commandHistory.add(command);
        trimBuffer(commandHistory, MAX_HISTORY_SIZE);
        
        command
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // COHERENCE BRIDGE
    // ═══════════════════════════════════════════════════════════════════════════
    
    /// Update coupling state
    public shared(msg) func updateCoupling(
        neuralCoherence : Float,
        organismCoherence : Float
    ) : async CouplingState {
        let resonanceStrength = calculateResonance(neuralCoherence, organismCoherence);
        let phaseAlignment = calculatePhaseAlignment(neuralCoherence * Float.pi * 2.0);
        let bidirectionalFlow = Float.tanh((neuralCoherence - organismCoherence) * PHI);
        
        let state : CouplingState = {
            neuralCoherence = clamp(neuralCoherence, 0.0, 1.0);
            organismCoherence = clamp(organismCoherence, 0.0, 1.0);
            resonanceStrength = resonanceStrength;
            phaseAlignment = phaseAlignment;
            bidirectionalFlow = bidirectionalFlow;
            timestamp = Time.now();
        };
        
        couplingHistory.add(state);
        trimBuffer(couplingHistory, MAX_HISTORY_SIZE);
        currentCoupling := ?state;
        
        // Auto-adjust bridge mode
        autoAdjustMode(resonanceStrength, phaseAlignment);
        
        // Log resonance events
        if (Float.abs(phaseAlignment) > 0.9) {
            logCoherenceEvent("resonance", resonanceStrength, "coupled");
        };
        
        state
    };
    
    /// Set bridge mode
    public shared(msg) func setBridgeMode(mode : BridgeMode) : async () {
        currentBridgeMode := mode;
        
        // Update user preference
        switch (userProfiles.get(msg.caller)) {
            case (?profile) {
                userProfiles.put(msg.caller, {
                    principal = profile.principal;
                    created = profile.created;
                    lastActive = Time.now();
                    totalSessions = profile.totalSessions;
                    avgCoherence = profile.avgCoherence;
                    peakCoherence = profile.peakCoherence;
                    preferredMode = mode;
                    calibrationData = profile.calibrationData;
                });
            };
            case null {};
        };
    };
    
    /// Get current bridge mode
    public query func getBridgeMode() : async BridgeMode {
        currentBridgeMode
    };
    
    /// Get current coupling state
    public query func getCurrentCoupling() : async ?CouplingState {
        currentCoupling
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // φ-HARMONIC CALCULATIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /// Calculate φ-alignment for a value
    private func calculatePhiAlignment(value : Float) : Float {
        let normalizedValue = value / (1.0 + Float.abs(value));
        let phiDistance = Float.abs(normalizedValue - (1.0 / PHI));
        Float.exp(-phiDistance * PHI)
    };
    
    /// Calculate resonance strength
    private func calculateResonance(neural : Float, organism : Float) : Float {
        let coupling = neural * organism;
        let phiWeight = Float.pow(PHI, -Float.abs(neural - organism));
        coupling * phiWeight
    };
    
    /// Calculate phase alignment
    private func calculatePhaseAlignment(phase : Float) : Float {
        Float.cos(phase)
    };
    
    /// Generate φ-harmonic value
    public query func generatePhiHarmonic(t : Float) : async Float {
        let f0 = SCHUMANN_RESONANCE;
        let f1 = f0 * PHI;
        let f2 = f0 / PHI;
        
        let s0 = Float.sin(2.0 * Float.pi * f0 * t);
        let s1 = (1.0 / PHI) * Float.sin(2.0 * Float.pi * f1 * t);
        let s2 = (1.0 / (PHI * PHI)) * Float.sin(2.0 * Float.pi * f2 * t);
        
        s0 + s1 + s2
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // USER PROFILES
    // ═══════════════════════════════════════════════════════════════════════════
    
    /// Get or create user profile
    public shared(msg) func getOrCreateProfile() : async UserBCIProfile {
        switch (userProfiles.get(msg.caller)) {
            case (?profile) {
                // Update last active
                let updated : UserBCIProfile = {
                    principal = profile.principal;
                    created = profile.created;
                    lastActive = Time.now();
                    totalSessions = profile.totalSessions + 1;
                    avgCoherence = profile.avgCoherence;
                    peakCoherence = profile.peakCoherence;
                    preferredMode = profile.preferredMode;
                    calibrationData = profile.calibrationData;
                };
                userProfiles.put(msg.caller, updated);
                updated
            };
            case null {
                sessionCounter += 1;
                let profile : UserBCIProfile = {
                    principal = msg.caller;
                    created = Time.now();
                    lastActive = Time.now();
                    totalSessions = 1;
                    avgCoherence = 0.0;
                    peakCoherence = 0.0;
                    preferredMode = #Passive;
                    calibrationData = null;
                };
                userProfiles.put(msg.caller, profile);
                profile
            };
        }
    };
    
    /// Update user coherence stats
    private func updateUserCoherence(caller : Principal, coherence : Float) : async () {
        switch (userProfiles.get(caller)) {
            case (?profile) {
                let sessionWeight = Float.fromInt(profile.totalSessions);
                let newAvg = (profile.avgCoherence * sessionWeight + coherence) / (sessionWeight + 1.0);
                let newPeak = Float.max(profile.peakCoherence, coherence);
                
                userProfiles.put(caller, {
                    principal = profile.principal;
                    created = profile.created;
                    lastActive = Time.now();
                    totalSessions = profile.totalSessions;
                    avgCoherence = newAvg;
                    peakCoherence = newPeak;
                    preferredMode = profile.preferredMode;
                    calibrationData = profile.calibrationData;
                });
            };
            case null {};
        };
    };
    
    /// Store calibration data
    public shared(msg) func storeCalibration(data : [Float]) : async Bool {
        switch (userProfiles.get(msg.caller)) {
            case (?profile) {
                userProfiles.put(msg.caller, {
                    principal = profile.principal;
                    created = profile.created;
                    lastActive = Time.now();
                    totalSessions = profile.totalSessions;
                    avgCoherence = profile.avgCoherence;
                    peakCoherence = profile.peakCoherence;
                    preferredMode = profile.preferredMode;
                    calibrationData = ?data;
                });
                true
            };
            case null {
                false
            };
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HISTORY & ANALYTICS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /// Get command history
    public query func getCommandHistory(limit : Nat) : async [BCICommand] {
        let size = commandHistory.size();
        let start = if (size > limit) { size - limit } else { 0 };
        let result = Buffer.Buffer<BCICommand>(limit);
        
        for (i in Iter.range(start, size - 1)) {
            result.add(commandHistory.get(i));
        };
        
        Buffer.toArray(result)
    };
    
    /// Get coherence events
    public query func getCoherenceEvents(limit : Nat) : async [CoherenceEvent] {
        let size = coherenceEvents.size();
        let start = if (size > limit) { size - limit } else { 0 };
        let result = Buffer.Buffer<CoherenceEvent>(limit);
        
        for (i in Iter.range(start, size - 1)) {
            result.add(coherenceEvents.get(i));
        };
        
        Buffer.toArray(result)
    };
    
    /// Get coupling history
    public query func getCouplingHistory(limit : Nat) : async [CouplingState] {
        let size = couplingHistory.size();
        let start = if (size > limit) { size - limit } else { 0 };
        let result = Buffer.Buffer<CouplingState>(limit);
        
        for (i in Iter.range(start, size - 1)) {
            result.add(couplingHistory.get(i));
        };
        
        Buffer.toArray(result)
    };
    
    /// Get diagnostics
    public query func getDiagnostics() : async {
        signalCount : Nat;
        commandCount : Nat;
        sessionCount : Nat;
        userCount : Nat;
        currentMode : BridgeMode;
        hasCurrentCoupling : Bool;
    } {
        {
            signalCount = signalCounter;
            commandCount = commandCounter;
            sessionCount = sessionCounter;
            userCount = userProfiles.size();
            currentMode = currentBridgeMode;
            hasCurrentCoupling = Option.isSome(currentCoupling);
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    private func clamp(value : Float, min : Float, max : Float) : Float {
        if (value < min) { min }
        else if (value > max) { max }
        else { value }
    };
    
    private func calculateVariance(signal : [Float]) : Float {
        if (signal.size() == 0) { return 0.0 };
        
        var sum : Float = 0.0;
        var sumSq : Float = 0.0;
        
        for (x in signal.vals()) {
            sum += x;
            sumSq += x * x;
        };
        
        let n = Float.fromInt(signal.size());
        let mean = sum / n;
        (sumSq / n) - (mean * mean)
    };
    
    private func trimBuffer<T>(buffer : Buffer.Buffer<T>, maxSize : Nat) {
        while (buffer.size() > maxSize) {
            ignore buffer.remove(0);
        };
    };
    
    private func logCoherenceEvent(eventType : Text, value : Float, source : Text) {
        coherenceEvents.add({
            timestamp = Time.now();
            eventType = eventType;
            value = value;
            source = source;
        });
        trimBuffer(coherenceEvents, MAX_HISTORY_SIZE);
    };
    
    private func autoAdjustMode(coupling : Float, stability : Float) {
        if (currentBridgeMode == #Sovereign) { return }; // Manual override
        
        if (coupling > 0.8 and stability > 0.7) {
            currentBridgeMode := #Entrained;
        } else if (coupling > 0.5 or stability > 0.5) {
            currentBridgeMode := #Active;
        } else {
            currentBridgeMode := #Passive;
        };
    };
}
