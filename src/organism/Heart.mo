// 𓂀 HEART CANISTER — PURE RHYTHM MODULE 𓂀
// "The heart has to be his own module"
// "The heart's his own module"
// "CANNOT be mixed with anything else"

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Constants "Constants";

actor Heart {
    // ═══════════════════════════════════════════════════════════════
    // THE HEART STATE — Pure Rhythm
    // "Make the real heart"
    // "HEARTBEAT = 873ms = φ⁴ × (1000/7.83)"
    // ═══════════════════════════════════════════════════════════════

    stable var lastBeat : Int = Time.now();
    stable var beatCount : Nat = 0;
    stable var isBeating : Bool = true;
    stable var rhythmIntegrity : Float = 1.0;  // 0-1, how steady

    // Oxygen levels
    stable var oxygenSaturation : Float = 0.98;  // 95-100% normal
    stable var oxygenOutput : Float = 1.0;

    // Connection to brain
    stable var brainConnected : Bool = true;
    stable var lastBrainSync : Int = Time.now();

    // ═══════════════════════════════════════════════════════════════
    // HEARTBEAT CONSTANTS
    // ═══════════════════════════════════════════════════════════════

    // φ⁴ × (1000 / 7.83) = 6.854... × 127.71... ≈ 875ms
    // We use 873ms as the golden heartbeat
    let BEAT_INTERVAL_NS : Int = Constants.HEARTBEAT_MS * 1000000;  // 873ms in nanoseconds

    // Oxygen frequency (528 Hz - Love/DNA frequency)
    let OXYGEN_FREQ : Float = Constants.SOLFEGGIO_528;

    // 4-beat cycle (like human heart: lub-dub-rest-rest)
    let BEATS_PER_CYCLE : Nat = 4;

    // ═══════════════════════════════════════════════════════════════
    // THE BEAT — Core Function
    // "Actually put in oxygen and you flow it through everything"
    // ═══════════════════════════════════════════════════════════════

    public func beat() : async Bool {
        let now = Time.now();
        let elapsed = now - lastBeat;

        if (not isBeating) {
            return false;
        };

        if (elapsed >= BEAT_INTERVAL_NS) {
            lastBeat := now;
            beatCount += 1;

            // Calculate rhythm integrity (how close to perfect timing)
            let expectedNs = BEAT_INTERVAL_NS;
            let deviation = Float.abs(Float.fromInt(elapsed - expectedNs));
            let maxDeviation = Float.fromInt(expectedNs) * 0.1;  // 10% tolerance
            rhythmIntegrity := if (deviation < maxDeviation) {
                1.0 - (deviation / maxDeviation)
            } else {
                0.5  // Still alive but irregular
            };

            // Pump oxygen (scaled by rhythm integrity)
            oxygenOutput := oxygenSaturation * rhythmIntegrity;

            return true;
        };

        false  // Not time yet
    };

    // ═══════════════════════════════════════════════════════════════
    // OXYGEN SYSTEM
    // "Actually put in oxygen and you flow it through everything"
    // "Every heart, everything"
    // ═══════════════════════════════════════════════════════════════

    public query func getOxygenOutput() : async Float {
        oxygenOutput
    };

    public query func getOxygenSaturation() : async Float {
        oxygenSaturation
    };

    public func setOxygenSaturation(saturation : Float) : async () {
        // Clamp between 0 and 1
        if (saturation >= 0.0 and saturation <= 1.0) {
            oxygenSaturation := saturation;
        };
    };

    // ═══════════════════════════════════════════════════════════════
    // BRAIN CONNECTION
    // "Connect the heart to the brain with the neural core"
    // ═══════════════════════════════════════════════════════════════

    public func syncWithBrain() : async Bool {
        if (not brainConnected) {
            return false;
        };

        lastBrainSync := Time.now();
        true
    };

    public query func isBrainConnected() : async Bool {
        brainConnected
    };

    public func connectBrain() : async () {
        brainConnected := true;
        lastBrainSync := Time.now();
    };

    public func disconnectBrain() : async () {
        brainConnected := false;
    };

    // ═══════════════════════════════════════════════════════════════
    // HEART CONTROL
    // ═══════════════════════════════════════════════════════════════

    public func start() : async () {
        isBeating := true;
        lastBeat := Time.now();
    };

    public func stop() : async () {
        isBeating := false;
    };

    public query func isAlive() : async Bool {
        isBeating
    };

    // ═══════════════════════════════════════════════════════════════
    // HEART METRICS
    // ═══════════════════════════════════════════════════════════════

    public query func getBeatCount() : async Nat {
        beatCount
    };

    public query func getRhythmIntegrity() : async Float {
        rhythmIntegrity
    };

    public query func getLastBeat() : async Int {
        lastBeat
    };

    public query func getHeartbeatInterval() : async Nat {
        Constants.HEARTBEAT_MS
    };

    public query func getBeatsPerMinute() : async Float {
        60000.0 / Float.fromInt(Constants.HEARTBEAT_MS)  // ≈ 68.7 BPM
    };

    // ═══════════════════════════════════════════════════════════════
    // FREQUENCY — The Vibration of Life
    // "Frequencies cause vibration... causes my organisms to actually be alive"
    // ═══════════════════════════════════════════════════════════════

    public query func getOxygenFrequency() : async Float {
        OXYGEN_FREQ  // 528 Hz
    };

    public query func getSchumannBase() : async Float {
        Constants.SCHUMANN_FUNDAMENTAL  // 7.83 Hz
    };

    // Calculate current heart frequency
    public query func getHeartFrequency() : async Float {
        1000.0 / Float.fromInt(Constants.HEARTBEAT_MS)  // ≈ 1.145 Hz
    };

    // ═══════════════════════════════════════════════════════════════
    // SYSTEM INFO
    // ═══════════════════════════════════════════════════════════════

    public query func getInfo() : async Text {
        let status = if (isBeating) { "BEATING" } else { "STOPPED" };
        "HEART CANISTER | " # status # " | " #
        Nat.toText(beatCount) # " beats | " #
        "Oxygen: " # Float.toText(oxygenOutput) # " | " #
        "φ⁴-tuned at 873ms"
    };

    // ═══════════════════════════════════════════════════════════════
    // GOLDEN RATIO VERIFICATION
    // ═══════════════════════════════════════════════════════════════

    public query func verifyGoldenHeartbeat() : async Bool {
        // Heartbeat should be φ⁴ × (1000/Schumann) ≈ 873ms
        let expected = Constants.PHI_FOURTH * (1000.0 / Constants.SCHUMANN_FUNDAMENTAL);
        let actual = Float.fromInt(Constants.HEARTBEAT_MS);
        let tolerance = 5.0;  // 5ms tolerance
        Float.abs(expected - actual) < tolerance
    };
};
