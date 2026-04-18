/**
 * 𓂀 NOVA HEARING - ICP CANISTER INTEGRATION 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * NOVA HEARING IN THE ICP LAYER
 * 
 * This module integrates Nova Hearing into the ICP layer, allowing audio
 * perception and voice command capabilities to be accessible from the
 * Internet Computer.
 * 
 * Hearing exists in both ICP and www.raw layers, with full access to all
 * audio capabilities.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * @version 1.0.0
 * @author Sovereign Organism
 * @frequency 741 Hz (ICP Layer)
 */

import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Option "mo:base/Option";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";

module NovaHearingICP {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // TYPES
    // ═══════════════════════════════════════════════════════════════════════════
    
    public type HearingState = {
        enabled: Bool;
        permissionGranted: Bool;
        isListening: Bool;
        lastTranscription: ?Text;
        lastProcessed: Int;
        resonance: Float;
        frequency: Float;
        beat: Nat;
    };
    
    public type FrequencyBand = {
        name: Text;
        centerFrequency: Float;
        amplitude: Float;
        resonance: Float;
    };
    
    public type AudioField = {
        timestamp: Int;
        duration: Float;
        sampleRate: Nat;
        frequencies: [FrequencyBand];
        dominantFrequency: Float;
        transcription: ?Text;
        emotion: ?EmotionAnalysis;
        metadata: AudioMetadata;
    };
    
    public type EmotionAnalysis = {
        primary: Text;
        confidence: Float;
        valence: Float;
        arousal: Float;
        dominance: Float;
    };
    
    public type AudioMetadata = {
        hasVoice: Bool;
        voiceCount: Nat;
        noiseLevel: Float;
        clarity: Float;
        sacredFrequencyAlignment: Float;
    };
    
    public type VoiceCommand = {
        commandType: Text; // QUERY, COMMAND, STATEMENT, UNKNOWN
        intent: Text;
        entities: [CommandEntity];
        confidence: Float;
        rawText: Text;
    };
    
    public type CommandEntity = {
        entityType: Text;
        value: Text;
        startPos: Nat;
        endPos: Nat;
    };
    
    public type SacredAlignment = {
        aligned: Bool;
        alignments: [SacredFrequencyMatch];
        overallResonance: Float;
        primaryAlignment: ?SacredFrequencyMatch;
    };
    
    public type SacredFrequencyMatch = {
        frequency: Float;
        name: Text;
        matchStrength: Float;
        harmonicNumber: Nat;
    };
    
    public type HearingPermission = {
        granted: Bool;
        grantedAt: Int;
        trustLevel: Float;
        scope: Text;
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CONSTANTS
    // ═══════════════════════════════════════════════════════════════════════════
    
    public let HEARING_CONSTANTS = {
        FREQUENCY: 741.0;          // ICP Layer frequency
        CEILING_FREQUENCY: 963.0;  // www.raw ceiling frequency
        HEARTBEAT_MS: 873;
        
        // Sacred frequencies
        SACRED_FREQUENCIES: [
            { name = "Earth Om"; frequency = 136.1 },
            { name = "Love/DNA Repair"; frequency = 528.0 },
            { name = "Universal Harmony"; frequency = 432.0 },
            { name = "Awakening Intuition"; frequency = 741.0 },
            { name = "Divine Connection"; frequency = 963.0 },
            { name = "Liberation"; frequency = 396.0 },
            { name = "Change"; frequency = 417.0 },
            { name = "Connection"; frequency = 639.0 },
            { name = "Spiritual Order"; frequency = 852.0 },
        ];
        
        EMOTIONS: ["CALM", "EXCITED", "ANGRY", "SAD", "HAPPY", "NEUTRAL"];
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HEARING CANISTER STATE
    // ═══════════════════════════════════════════════════════════════════════════
    
    public class NovaHearingCanister() {
        private var state: HearingState = {
            enabled = false;
            permissionGranted = false;
            isListening = false;
            lastTranscription = null;
            lastProcessed = 0;
            resonance = 0.5;
            frequency = HEARING_CONSTANTS.FREQUENCY;
            beat = 0;
        };
        
        private var permissions = HashMap.HashMap<Principal, HearingPermission>(10, Principal.equal, Principal.hash);
        private var audioFields = Buffer.Buffer<AudioField>(100);
        private var commands = Buffer.Buffer<VoiceCommand>(50);
        
        // ═══════════════════════════════════════════════════════════════════════
        // PERMISSION MANAGEMENT
        // ═══════════════════════════════════════════════════════════════════════
        
        public func requestPermission(caller: Principal, scope: Text): HearingPermission {
            let permission: HearingPermission = {
                granted = true;
                grantedAt = Time.now();
                trustLevel = 0.5;
                scope = scope;
            };
            
            permissions.put(caller, permission);
            state := { state with permissionGranted = true; enabled = true };
            
            permission;
        };
        
        public func hasPermission(caller: Principal): Bool {
            switch (permissions.get(caller)) {
                case (?perm) { perm.granted };
                case null { false };
            };
        };
        
        public func getPermission(caller: Principal): ?HearingPermission {
            permissions.get(caller);
        };
        
        // ═══════════════════════════════════════════════════════════════════════
        // LISTENING CONTROL
        // ═══════════════════════════════════════════════════════════════════════
        
        public func startListening(): Bool {
            if (not state.permissionGranted) {
                return false;
            };
            
            state := { state with isListening = true };
            true;
        };
        
        public func stopListening(): () {
            state := { state with isListening = false };
        };
        
        // ═══════════════════════════════════════════════════════════════════════
        // AUDIO FIELD CAPTURE
        // ═══════════════════════════════════════════════════════════════════════
        
        public func captureAudioField(
            duration: Float,
            frequencies: [FrequencyBand],
            transcription: ?Text,
            emotion: ?EmotionAnalysis,
            metadata: AudioMetadata
        ): AudioField {
            let dominantFreq = findDominantFrequency(frequencies);
            
            let field: AudioField = {
                timestamp = Time.now();
                duration = duration;
                sampleRate = 44100;
                frequencies = frequencies;
                dominantFrequency = dominantFreq;
                transcription = transcription;
                emotion = emotion;
                metadata = metadata;
            };
            
            audioFields.add(field);
            state := { 
                state with 
                lastProcessed = Time.now();
                lastTranscription = transcription;
            };
            
            field;
        };
        
        private func findDominantFrequency(frequencies: [FrequencyBand]): Float {
            var maxAmplitude: Float = 0.0;
            var dominant: Float = 440.0;
            
            for (band in frequencies.vals()) {
                if (band.amplitude > maxAmplitude) {
                    maxAmplitude := band.amplitude;
                    dominant := band.centerFrequency;
                };
            };
            
            dominant;
        };
        
        public func getLastAudioField(): ?AudioField {
            if (audioFields.size() > 0) {
                ?audioFields.get(audioFields.size() - 1);
            } else {
                null;
            };
        };
        
        // ═══════════════════════════════════════════════════════════════════════
        // VOICE COMMAND PROCESSING
        // ═══════════════════════════════════════════════════════════════════════
        
        public func parseCommand(text: Text): VoiceCommand {
            let commandType = determineCommandType(text);
            let intent = extractIntent(text);
            let entities = extractEntities(text);
            
            let command: VoiceCommand = {
                commandType = commandType;
                intent = intent;
                entities = entities;
                confidence = 0.8;
                rawText = text;
            };
            
            commands.add(command);
            command;
        };
        
        private func determineCommandType(text: Text): Text {
            let lowerText = Text.toLowercase(text);
            
            if (Text.contains(lowerText, #text "?")) {
                return "QUERY";
            };
            
            let commandPrefixes = ["please", "can you", "show", "open", "find", "search"];
            for (prefix in commandPrefixes.vals()) {
                if (Text.startsWith(lowerText, #text prefix)) {
                    return "COMMAND";
                };
            };
            
            "STATEMENT";
        };
        
        private func extractIntent(text: Text): Text {
            let lowerText = Text.toLowercase(text);
            
            if (Text.contains(lowerText, #text "search") or Text.contains(lowerText, #text "find")) {
                return "SEARCH";
            };
            if (Text.contains(lowerText, #text "create") or Text.contains(lowerText, #text "make")) {
                return "CREATE";
            };
            if (Text.contains(lowerText, #text "open") or Text.contains(lowerText, #text "show")) {
                return "OPEN";
            };
            if (Text.contains(lowerText, #text "help")) {
                return "HELP";
            };
            
            "UNKNOWN";
        };
        
        private func extractEntities(text: Text): [CommandEntity] {
            // Simplified entity extraction
            [];
        };
        
        // ═══════════════════════════════════════════════════════════════════════
        // SACRED FREQUENCY ANALYSIS
        // ═══════════════════════════════════════════════════════════════════════
        
        public func analyzeSacredAlignment(field: AudioField): SacredAlignment {
            let alignments = Buffer.Buffer<SacredFrequencyMatch>(10);
            
            for (sacred in HEARING_CONSTANTS.SACRED_FREQUENCIES.vals()) {
                for (band in field.frequencies.vals()) {
                    let ratio = band.centerFrequency / sacred.frequency;
                    let roundedRatio = Float.nearest(ratio);
                    
                    if (Float.abs(ratio - roundedRatio) < 0.1 and band.amplitude > 0.3) {
                        alignments.add({
                            frequency = sacred.frequency;
                            name = sacred.name;
                            matchStrength = band.amplitude;
                            harmonicNumber = Int.abs(Float.toInt(roundedRatio));
                        });
                    };
                };
            };
            
            let alignmentArray = Buffer.toArray(alignments);
            let totalResonance = if (alignmentArray.size() > 0) {
                var sum: Float = 0.0;
                for (a in alignmentArray.vals()) {
                    sum += a.matchStrength;
                };
                sum / Float.fromInt(alignmentArray.size());
            } else {
                0.0;
            };
            
            {
                aligned = alignmentArray.size() > 0;
                alignments = alignmentArray;
                overallResonance = totalResonance;
                primaryAlignment = if (alignmentArray.size() > 0) { ?alignmentArray[0] } else { null };
            };
        };
        
        // ═══════════════════════════════════════════════════════════════════════
        // EMOTION ANALYSIS
        // ═══════════════════════════════════════════════════════════════════════
        
        public func analyzeEmotion(field: AudioField): EmotionAnalysis {
            // Simplified emotion analysis based on frequency distribution
            var primary = "NEUTRAL";
            var valence: Float = 0.0;
            var arousal: Float = 0.5;
            
            let midAmplitude = getAmplitudeForBand(field.frequencies, "Mid");
            let highAmplitude = getAmplitudeForBand(field.frequencies, "High Mid");
            let bassAmplitude = getAmplitudeForBand(field.frequencies, "Bass");
            
            if (highAmplitude > 0.7) {
                primary := "EXCITED";
                valence := 0.5;
                arousal := 0.8;
            } else if (bassAmplitude > 0.6 and midAmplitude < 0.4) {
                primary := "SAD";
                valence := -0.5;
                arousal := 0.3;
            } else if (midAmplitude > 0.7 and highAmplitude > 0.5) {
                primary := "HAPPY";
                valence := 0.7;
                arousal := 0.6;
            } else if (midAmplitude > 0.5 and bassAmplitude < 0.4) {
                primary := "CALM";
                valence := 0.3;
                arousal := 0.3;
            };
            
            {
                primary = primary;
                confidence = 0.7;
                valence = valence;
                arousal = arousal;
                dominance = (midAmplitude + highAmplitude) / 2.0;
            };
        };
        
        private func getAmplitudeForBand(frequencies: [FrequencyBand], name: Text): Float {
            for (band in frequencies.vals()) {
                if (band.name == name) {
                    return band.amplitude;
                };
            };
            0.5;
        };
        
        // ═══════════════════════════════════════════════════════════════════════
        // STATE MANAGEMENT
        // ═══════════════════════════════════════════════════════════════════════
        
        public func getState(): HearingState {
            state;
        };
        
        public func pulse(beat: Nat): () {
            state := { state with beat = beat };
            
            // Decay resonance slightly
            let newResonance = Float.max(0.1, state.resonance * 0.99);
            state := { state with resonance = newResonance };
        };
        
        public func updateResonance(newResonance: Float): () {
            state := { state with resonance = Float.min(Float.max(newResonance, 0.0), 1.0) };
        };
        
        public func alignFrequency(targetFrequency: Float): () {
            state := { state with frequency = targetFrequency };
        };
        
        public func getLastTranscription(): ?Text {
            state.lastTranscription;
        };
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    public func createFrequencyBand(
        name: Text,
        centerFrequency: Float,
        amplitude: Float
    ): FrequencyBand {
        {
            name = name;
            centerFrequency = centerFrequency;
            amplitude = amplitude;
            resonance = amplitude; // Simple resonance based on amplitude
        };
    };
    
    public func createAudioMetadata(
        hasVoice: Bool,
        voiceCount: Nat,
        noiseLevel: Float,
        clarity: Float,
        sacredAlignment: Float
    ): AudioMetadata {
        {
            hasVoice = hasVoice;
            voiceCount = voiceCount;
            noiseLevel = noiseLevel;
            clarity = clarity;
            sacredFrequencyAlignment = sacredAlignment;
        };
    };
    
    public func createDefaultFrequencyBands(): [FrequencyBand] {
        [
            { name = "Deep Bass"; centerFrequency = 60.0; amplitude = 0.3; resonance = 0.5 },
            { name = "Bass"; centerFrequency = 120.0; amplitude = 0.4; resonance = 0.6 },
            { name = "Low Mid"; centerFrequency = 250.0; amplitude = 0.6; resonance = 0.7 },
            { name = "Mid"; centerFrequency = 500.0; amplitude = 0.8; resonance = 0.8 },
            { name = "High Mid"; centerFrequency = 2000.0; amplitude = 0.5; resonance = 0.6 },
            { name = "High"; centerFrequency = 4000.0; amplitude = 0.3; resonance = 0.5 },
            { name = "Brilliance"; centerFrequency = 8000.0; amplitude = 0.2; resonance = 0.4 },
        ];
    };
};
