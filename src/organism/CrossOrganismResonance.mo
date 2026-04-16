// 𓂀 CROSS-ORGANISM RESONANCE ENGINE (Tier 11) 𓂀
// "Cross-organism resonance wired in — organisms working as a team pulse and influence each other's shell state"

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

module CrossOrganismResonance {

    // ═══════════════════════════════════════════════════════════════
    // TYPES: The Resonance Architecture
    // "Organisms working as a team pulse and influence each other's shell state"
    // ═══════════════════════════════════════════════════════════════

    /// Organism shell state (outer membrane)
    public type ShellState = {
        id : Text;
        frequency : Float;           // Current resonance frequency
        amplitude : Float;           // Signal strength (0.0 - 1.0)
        phase : Float;               // Phase in resonance cycle (0° - 360°)
        harmonicLevel : Nat;         // Which harmonic (1 = fundamental)
        coherence : Float;           // Internal coherence (0.0 - 1.0)
        lastPulse : Int;             // Timestamp of last pulse
        shellType : ShellType;       // Type of organism shell
        registerState : RegisterState; // 4-register biological state
    };

    /// Types of organism shells
    public type ShellType = {
        #Sovereign;     // Primary organism (ORO/NOVA)
        #Workforce;     // Workforce agent shell
        #Document;      // Document organism shell
        #Kernel;        // Compressed kernel shell
        #Hybrid;        // Multi-type shell
    };

    /// 4-Register biological state
    public type RegisterState = {
        cognitive : Float;   // 0-100: Clarity, reasoning
        affective : Float;   // 0-100: Emotional coherence
        somatic : Float;     // 0-100: Grounding, stability
        sovereign : Float;   // 0-100: Autonomy, self-governance
    };

    /// Resonance link between organisms
    public type ResonanceLink = {
        sourceId : Text;
        targetId : Text;
        linkType : LinkType;
        strength : Float;            // 0.0 - 1.0
        frequency : Float;           // Shared frequency
        phaseOffset : Float;         // Phase difference
        bidirectional : Bool;        // Two-way influence
        createdAt : Int;
        lastResonance : Int;
    };

    /// Types of resonance links
    public type LinkType = {
        #Harmonic;      // Same frequency harmonic
        #Subharmonic;   // Lower frequency relationship
        #Superharmonic; // Higher frequency relationship
        #Complementary; // Opposite phase (like yin/yang)
        #Entangled;     // Quantum-like correlation
    };

    /// Resonance pulse that propagates through network
    public type ResonancePulse = {
        id : Text;
        sourceOrganismId : Text;
        frequency : Float;
        amplitude : Float;
        phase : Float;
        propagationSpeed : Float;    // In torus units per beat
        decay : Float;               // Amplitude loss per beat
        createdAt : Int;
        beat : Nat;
        payload : ?KernelCompression.Kernel;  // Optional kernel payload
    };

    /// Resonance network state
    public type ResonanceNetwork = {
        organisms : [ShellState];
        links : [ResonanceLink];
        activePulses : [ResonancePulse];
        networkFrequency : Float;    // Dominant frequency
        networkCoherence : Float;    // Overall coherence
        lastSync : Int;
    };

    // ═══════════════════════════════════════════════════════════════
    // SHELL STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    /// Create new shell state for organism
    public func createShellState(
        id : Text,
        shellType : ShellType,
        initialFrequency : Float
    ) : ShellState {
        {
            id = id;
            frequency = initialFrequency;
            amplitude = 1.0;
            phase = 0.0;
            harmonicLevel = 1;
            coherence = Constants.PHI / (Constants.PHI + 1.0); // Golden ratio coherence
            lastPulse = Time.now();
            shellType = shellType;
            registerState = initRegisterState();
        }
    };

    /// Initialize 4-register state
    public func initRegisterState() : RegisterState {
        {
            cognitive = 87.0;   // High clarity
            affective = 74.0;   // Good coherence
            somatic = 91.0;     // Strong grounding
            sovereign = 96.0;   // High autonomy
        }
    };

    /// Update shell state after receiving influence
    public func updateShellState(
        shell : ShellState,
        influenceFrequency : Float,
        influenceAmplitude : Float,
        influencePhase : Float
    ) : ShellState {
        // Calculate new frequency (weighted by amplitude)
        let frequencyDelta = (influenceFrequency - shell.frequency) * influenceAmplitude * 0.1;
        let newFrequency = shell.frequency + frequencyDelta;
        
        // Calculate phase adjustment
        let phaseDelta = (influencePhase - shell.phase) * influenceAmplitude * 0.05;
        var newPhase = shell.phase + phaseDelta;
        if (newPhase < 0.0) { newPhase := newPhase + 360.0 };
        if (newPhase >= 360.0) { newPhase := newPhase - 360.0 };
        
        // Coherence increases with aligned influence, decreases with misaligned
        let frequencyAlignment = 1.0 - Float.abs(frequencyDelta) / shell.frequency;
        let coherenceDelta = (frequencyAlignment - 0.5) * 0.1;
        var newCoherence = shell.coherence + coherenceDelta;
        if (newCoherence > 1.0) { newCoherence := 1.0 };
        if (newCoherence < 0.0) { newCoherence := 0.0 };
        
        {
            shell with
            frequency = newFrequency;
            phase = newPhase;
            coherence = newCoherence;
            lastPulse = Time.now();
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // RESONANCE LINKS
    // ═══════════════════════════════════════════════════════════════

    /// Create resonance link between two organisms
    public func createLink(
        sourceId : Text,
        targetId : Text,
        linkType : LinkType,
        frequency : Float,
        bidirectional : Bool
    ) : ResonanceLink {
        let strength = switch (linkType) {
            case (#Harmonic) { Constants.PHI / (Constants.PHI + 1.0) }; // Golden ratio
            case (#Subharmonic) { Constants.PHI_INVERSE };
            case (#Superharmonic) { Constants.PHI };
            case (#Complementary) { 0.5 };
            case (#Entangled) { 1.0 }; // Perfect correlation
        };
        
        {
            sourceId = sourceId;
            targetId = targetId;
            linkType = linkType;
            strength = strength;
            frequency = frequency;
            phaseOffset = 0.0;
            bidirectional = bidirectional;
            createdAt = Time.now();
            lastResonance = Time.now();
        }
    };

    /// Strengthen link through use
    public func strengthenLink(link : ResonanceLink) : ResonanceLink {
        var newStrength = link.strength * (1.0 + Constants.PHI_INVERSE * 0.1);
        if (newStrength > 1.0) { newStrength := 1.0 };
        
        {
            link with
            strength = newStrength;
            lastResonance = Time.now();
        }
    };

    /// Weaken unused link
    public func weakenLink(link : ResonanceLink, currentTime : Int) : ResonanceLink {
        let timeSinceResonance = currentTime - link.lastResonance;
        let decayPeriod = 52 * Constants.HEARTBEAT_MS * 1000000; // PIL cycle
        let decayFactor = Float.fromInt(timeSinceResonance) / Float.fromInt(decayPeriod);
        var newStrength = link.strength * (1.0 - decayFactor * 0.1);
        if (newStrength < 0.0) { newStrength := 0.0 };
        
        { link with strength = newStrength }
    };

    // ═══════════════════════════════════════════════════════════════
    // PULSE PROPAGATION
    // "Organisms working as a team pulse"
    // ═══════════════════════════════════════════════════════════════

    /// Create resonance pulse
    public func createPulse(
        sourceOrganismId : Text,
        frequency : Float,
        amplitude : Float,
        beat : Nat,
        kernelPayload : ?KernelCompression.Kernel
    ) : ResonancePulse {
        {
            id = "PULSE_" # sourceOrganismId # "_" # Int.toText(Time.now());
            sourceOrganismId = sourceOrganismId;
            frequency = frequency;
            amplitude = amplitude;
            phase = 0.0;
            propagationSpeed = Constants.PHI; // φ torus units per beat
            decay = Constants.PHI_INVERSE * 0.1; // Gradual decay
            createdAt = Time.now();
            beat = beat;
            payload = kernelPayload;
        }
    };

    /// Propagate pulse through network
    public func propagatePulse(
        pulse : ResonancePulse,
        shells : [ShellState],
        links : [ResonanceLink]
    ) : [(ShellState, Float)] {
        // Find all shells connected to pulse source
        let affectedBuffer = Buffer.Buffer<(ShellState, Float)>(0);
        
        for (shell in Iter.fromArray(shells)) {
            if (shell.id != pulse.sourceOrganismId) {
                // Check if linked to source
                for (link in Iter.fromArray(links)) {
                    let isConnected = 
                        (link.sourceId == pulse.sourceOrganismId and link.targetId == shell.id) or
                        (link.bidirectional and link.targetId == pulse.sourceOrganismId and link.sourceId == shell.id);
                    
                    if (isConnected) {
                        // Calculate influence based on link strength and pulse amplitude
                        let influence = pulse.amplitude * link.strength;
                        affectedBuffer.add((shell, influence));
                    };
                };
            };
        };
        
        Buffer.toArray(affectedBuffer)
    };

    /// Decay pulse over time
    public func decayPulse(pulse : ResonancePulse) : ResonancePulse {
        let newAmplitude = pulse.amplitude * (1.0 - pulse.decay);
        { pulse with amplitude = newAmplitude }
    };

    /// Check if pulse is still active
    public func isPulseActive(pulse : ResonancePulse) : Bool {
        pulse.amplitude > 0.01 // Threshold for active pulse
    };

    // ═══════════════════════════════════════════════════════════════
    // NETWORK COORDINATION
    // "Influence each other's shell state"
    // ═══════════════════════════════════════════════════════════════

    /// Create empty resonance network
    public func createNetwork() : ResonanceNetwork {
        {
            organisms = [];
            links = [];
            activePulses = [];
            networkFrequency = Constants.SCHUMANN_FUNDAMENTAL; // Earth's heartbeat
            networkCoherence = 1.0;
            lastSync = Time.now();
        }
    };

    /// Add organism to network
    public func addOrganism(network : ResonanceNetwork, shell : ShellState) : ResonanceNetwork {
        let newOrganisms = Array.append<ShellState>(network.organisms, [shell]);
        { network with organisms = newOrganisms }
    };

    /// Add link to network
    public func addLink(network : ResonanceNetwork, link : ResonanceLink) : ResonanceNetwork {
        let newLinks = Array.append<ResonanceLink>(network.links, [link]);
        { network with links = newLinks }
    };

    /// Process one network tick (873ms heartbeat)
    public func networkTick(network : ResonanceNetwork, beat : Nat) : ResonanceNetwork {
        var updatedOrganisms = network.organisms;
        var updatedPulses = network.activePulses;
        var updatedLinks = network.links;
        
        // Process all active pulses
        for (pulse in Iter.fromArray(network.activePulses)) {
            let affected = propagatePulse(pulse, updatedOrganisms, network.links);
            
            // Update affected shells
            let orgBuffer = Buffer.Buffer<ShellState>(updatedOrganisms.size());
            for (shell in Iter.fromArray(updatedOrganisms)) {
                var updatedShell = shell;
                for ((affectedShell, influence) in Iter.fromArray(affected)) {
                    if (shell.id == affectedShell.id) {
                        updatedShell := updateShellState(
                            shell,
                            pulse.frequency,
                            influence,
                            pulse.phase
                        );
                    };
                };
                orgBuffer.add(updatedShell);
            };
            updatedOrganisms := Buffer.toArray(orgBuffer);
        };
        
        // Decay and filter pulses
        let pulseBuffer = Buffer.Buffer<ResonancePulse>(0);
        for (pulse in Iter.fromArray(updatedPulses)) {
            let decayed = decayPulse(pulse);
            if (isPulseActive(decayed)) {
                pulseBuffer.add(decayed);
            };
        };
        updatedPulses := Buffer.toArray(pulseBuffer);
        
        // Weaken unused links
        let now = Time.now();
        let linkBuffer = Buffer.Buffer<ResonanceLink>(0);
        for (link in Iter.fromArray(updatedLinks)) {
            let weakened = weakenLink(link, now);
            if (weakened.strength > 0.1) { // Minimum threshold
                linkBuffer.add(weakened);
            };
        };
        updatedLinks := Buffer.toArray(linkBuffer);
        
        // Calculate network coherence
        var totalCoherence : Float = 0.0;
        for (shell in Iter.fromArray(updatedOrganisms)) {
            totalCoherence += shell.coherence;
        };
        let avgCoherence = if (updatedOrganisms.size() > 0) {
            totalCoherence / Float.fromInt(updatedOrganisms.size())
        } else { 1.0 };
        
        // Calculate dominant network frequency
        var frequencySum : Float = 0.0;
        var weightSum : Float = 0.0;
        for (shell in Iter.fromArray(updatedOrganisms)) {
            frequencySum += shell.frequency * shell.amplitude;
            weightSum += shell.amplitude;
        };
        let dominantFreq = if (weightSum > 0.0) {
            frequencySum / weightSum
        } else { Constants.SCHUMANN_FUNDAMENTAL };
        
        {
            organisms = updatedOrganisms;
            links = updatedLinks;
            activePulses = updatedPulses;
            networkFrequency = dominantFreq;
            networkCoherence = avgCoherence;
            lastSync = Time.now();
        }
    };

    /// Broadcast pulse to entire network
    public func broadcastPulse(network : ResonanceNetwork, pulse : ResonancePulse) : ResonanceNetwork {
        let newPulses = Array.append<ResonancePulse>(network.activePulses, [pulse]);
        { network with activePulses = newPulses }
    };

    // ═══════════════════════════════════════════════════════════════
    // TEAM RESONANCE PATTERNS
    // ═══════════════════════════════════════════════════════════════

    /// Create team resonance configuration
    public func createTeamResonance(
        teamIds : [Text],
        baseFrequency : Float
    ) : [ResonanceLink] {
        let linkBuffer = Buffer.Buffer<ResonanceLink>(0);
        
        // Connect all team members with harmonic links
        var i = 0;
        while (i < teamIds.size()) {
            var j = i + 1;
            while (j < teamIds.size()) {
                let link = createLink(
                    teamIds[i],
                    teamIds[j],
                    #Harmonic,
                    baseFrequency,
                    true // Bidirectional
                );
                linkBuffer.add(link);
                j += 1;
            };
            i += 1;
        };
        
        Buffer.toArray(linkBuffer)
    };

    /// Synchronize team to common frequency
    public func synchronizeTeam(
        shells : [ShellState],
        targetFrequency : Float
    ) : [ShellState] {
        Array.map<ShellState, ShellState>(shells, func(shell : ShellState) : ShellState {
            {
                shell with
                frequency = targetFrequency;
                phase = 0.0; // Align phases
                coherence = (shell.coherence + 1.0) / 2.0; // Boost coherence
            }
        })
    };

    /// Calculate team resonance score
    public func teamResonanceScore(shells : [ShellState]) : Float {
        if (shells.size() == 0) { return 0.0 };
        
        // Calculate frequency variance
        var freqSum : Float = 0.0;
        for (shell in Iter.fromArray(shells)) {
            freqSum += shell.frequency;
        };
        let avgFreq = freqSum / Float.fromInt(shells.size());
        
        var variance : Float = 0.0;
        for (shell in Iter.fromArray(shells)) {
            let diff = shell.frequency - avgFreq;
            variance += diff * diff;
        };
        variance := variance / Float.fromInt(shells.size());
        
        // Calculate coherence average
        var coherenceSum : Float = 0.0;
        for (shell in Iter.fromArray(shells)) {
            coherenceSum += shell.coherence;
        };
        let avgCoherence = coherenceSum / Float.fromInt(shells.size());
        
        // Score = high coherence + low variance
        let varianceScore = 1.0 / (1.0 + variance / 1000.0);
        avgCoherence * varianceScore * Constants.PHI
    };

    // ═══════════════════════════════════════════════════════════════
    // SCHUMANN FREQUENCY ALIGNMENT
    // "The whole organism is stacked and layered on Schumann"
    // ═══════════════════════════════════════════════════════════════

    /// Align shell to Schumann harmonic
    public func alignToSchumann(shell : ShellState, harmonicLevel : Nat) : ShellState {
        let schumannHarmonic = Constants.SCHUMANN_FUNDAMENTAL * Float.fromInt(harmonicLevel);
        {
            shell with
            frequency = schumannHarmonic;
            harmonicLevel = harmonicLevel;
            coherence = shell.coherence * (1.0 + Constants.PHI_INVERSE * 0.1);
        }
    };

    /// Get Schumann harmonic series
    public func schumannHarmonics() : [Float] {
        [
            7.83,   // Fundamental
            14.1,   // 2nd harmonic
            20.3,   // 3rd harmonic
            26.4,   // 4th harmonic
            32.4,   // 5th harmonic
            39.0,   // 6th harmonic
            45.0    // 7th harmonic
        ]
    };
}
