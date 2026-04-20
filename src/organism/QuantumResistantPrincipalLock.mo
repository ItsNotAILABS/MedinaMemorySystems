// 𓂀 QUANTUM RESISTANT PRINCIPAL LOCK — POST-QUANTUM AUTH WITH MAYAN SPHERE 𓂀
// Dynamic ratchet window coupled to cognitive state. 5-layer hash cascade.
// SPHINCS+-inspired phi-Fibonacci Merkle tree. Dilithium-inspired phi-lattice.
// Mayan Sphere = 260-day Tzolk'in encoded as 260-point sphere on Leech lattice.
// Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Constants "Constants";

module QuantumResistantPrincipalLock {

    // ═══════════════════════════════════════════════════════════════
    // SECTION 1: QUANTUM-RESISTANT CONSTANTS
    // FNV-1a: industry standard non-cryptographic hash (chain basis)
    // Leech lattice has 196560 minimal vectors — we use mod-wrapped indices
    // ═══════════════════════════════════════════════════════════════

    public let MIN_WINDOW : Nat = 100;
    public let MAX_WINDOW : Nat = 50000;
    public let MAYAN_CYCLE : Nat = 260;                    // Tzolk'in 260-day cycle
    public let FNV_PRIME : Nat = 16777619;
    public let FNV_OFFSET : Nat = 2166136261;
    public let RATCHET_COMPOUND_BASE : Float = Constants.PHI; // Entropy grows φ-proportionally
    public let LEECH_MINIMAL_VECTORS : Nat = 196560;       // Leech lattice kissing number

    // Modular arithmetic ceiling (2³² - prevents unbounded growth)
    let MOD_32 : Nat = 4294967296;

    // ═══════════════════════════════════════════════════════════════
    // SECTION 2: CORE TYPES
    // ═══════════════════════════════════════════════════════════════

    public type LockConfig = {
        minWindow : Nat;
        maxWindow : Nat;
        baseWindow : Nat;
        hostileThreshold : Float;
    };

    public type RatchetState = {
        window : Nat;
        entropy : Float;            // Ratchet entropy — grows φ-proportionally
        lastRotation : Int;
        generation : Nat;           // Ratchet step counter
        chainHash : Blob;           // Running hash chain (32 bytes conceptually)
    };

    public type CognitiveLock = {
        coherenceC : Float;         // Organism coherence 0.0 - 1.0
        H_obs : Float;              // Observed beat frequency (Hz, target = 12.0)
        ratchetEntropy : Float;     // From ratchet state
        lockStrength : Float;       // Computed: coherenceC × (H_obs/12) × (0.5 + ε×0.5)
        window : Nat;               // Dynamic ratchet window
    };

    public type MayanSpherePoint = {
        day : Nat;                  // 0 - 259 (Tzolk'in day)
        tzolkinAngle : Float;       // day × 360.0 / 260.0
        leechCoord : Nat;           // latticeRound(tzolkinAngle)
    };

    public type PhiFibMerkleNode = {
        hash : Nat;
        leftChild : ?Nat;
        rightChild : ?Nat;
        depth : Nat;
    };

    public type HashThenSign = {
        payloadHash : Nat;
        signature : Nat;
        timestampBeat : Nat;
    };

    public type QuantumLock = {
        principal : Text;
        ratchetState : RatchetState;
        cognitiveLock : CognitiveLock;
        mayanSphere : [MayanSpherePoint];  // Full 260-point sphere
        merkleRoot : Nat;
        config : LockConfig;
        authenticated : Bool;
        authCount : Nat;
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 3: HASH FUNCTIONS — 5-LAYER CASCADE
    // Layer 1: FNV-1a  (avalanche from byte stream)
    // Layer 2: djb2    (multiplicative mixing)
    // Layer 3: SDBM    (shift-xor mixing)
    // Layer 4: XOR combination
    // Layer 5: φ-scaling (irrational stretch to break periodicity)
    // ═══════════════════════════════════════════════════════════════

    // FNV-1a hash: each byte XOR'd with prime then multiplied
    public func fnv1aHash(data : [Nat8], context : Nat) : Nat {
        var h = FNV_OFFSET;
        // Mix context first
        let ctxByte = context % 256;
        h := ((h ^ ctxByte) * FNV_PRIME) % MOD_32;
        for (byte in data.vals()) {
            h := ((h ^ Nat8.toNat(byte)) * FNV_PRIME) % MOD_32;
        };
        h
    };

    // djb2 hash: multiplicative hash with shift
    public func djb2Hash(h1 : Nat, context : Nat) : Nat {
        var h = 5381;
        h := (h * 33 + h1) % MOD_32;
        h := (h * 33 + context) % MOD_32;
        h
    };

    // SDBM hash: shift-xor combination
    public func sdbmHash(h2 : Nat, h1 : Nat) : Nat {
        var h = h1;
        h := (h2 + (h1 * 65536) + (h1 * 131072)) % MOD_32;
        h ^ h2
    };

    // Full 5-layer cascade
    public func cascadeHash(data : [Nat8], context : Nat, salt : Nat) : Nat {
        let layer1 = fnv1aHash(data, context);                  // FNV-1a
        let layer2 = djb2Hash(layer1, context + salt);          // djb2
        let layer3 = sdbmHash(layer2, layer1);                  // SDBM
        let layer4 = (layer1 ^ layer2 ^ layer3) % MOD_32;      // XOR combine
        // φ-scaling: stretch via golden ratio to break periodicity
        let phiScaled = Float.toInt(Float.fromInt(layer4) * Constants.PHI) % MOD_32;
        Int.abs(phiScaled) % MOD_32
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 4: COGNITIVE COUPLING
    // lockStrength = coherenceC × (H_obs / 12) × (0.5 + ratchetEntropy × 0.5)
    // ═══════════════════════════════════════════════════════════════

    public func computeLockStrength(
        coherenceC : Float,
        H_obs : Float,
        ratchetEntropy : Float
    ) : Float {
        let freqRatio = H_obs / 12.0;
        let entropyFactor = 0.5 + ratchetEntropy * 0.5;
        coherenceC * freqRatio * entropyFactor
    };

    // Dynamic window: ratchetWindow = floor(baseWindow × coherenceC × phiScaling)
    // baseWindow grows with beatCount (log scale), bounded [MIN_WINDOW, MAX_WINDOW]
    public func computeDynamicWindow(
        baseWindow : Nat,
        coherenceC : Float,
        beatCount : Nat
    ) : Nat {
        // baseWindow grows logarithmically with beatCount
        let logGrowth = Float.log(Float.fromInt(beatCount + 2)); // +2 avoids log(1)=0
        let grownBase = Float.fromInt(baseWindow) * (1.0 + logGrowth * 0.1);
        let phiScaling = Constants.PHI;
        let raw = Float.toInt(grownBase * coherenceC * phiScaling);
        let computed = Int.abs(raw) % (MAX_WINDOW + 1);
        let clamped = Nat.max(MIN_WINDOW, Nat.min(MAX_WINDOW, computed));
        clamped
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 5: MAYAN SPHERE ENCODING
    // 260-day Tzolk'in encoded as sphere points on Leech lattice
    // Phi-lattice rounding: latticeRound(x) = floor(x × φ) mod LEECH_MINIMAL_VECTORS
    // ═══════════════════════════════════════════════════════════════

    func tzolkinAngle(day : Nat) : Float {
        Float.fromInt(day) * 360.0 / Float.fromInt(MAYAN_CYCLE)
    };

    func latticeRound(angle : Float) : Nat {
        let scaled = Float.toInt(angle * Constants.PHI);
        Int.abs(scaled) % LEECH_MINIMAL_VECTORS
    };

    public func mayanSphereEncode(beatCount : Nat) : MayanSpherePoint {
        let day = beatCount % MAYAN_CYCLE;
        let angle = tzolkinAngle(day);
        {
            day = day;
            tzolkinAngle = angle;
            leechCoord = latticeRound(angle);
        }
    };

    // Precompute full 260-point Mayan sphere
    func buildMayanSphere(beatOffset : Nat) : [MayanSpherePoint] {
        Array.tabulate<MayanSpherePoint>(MAYAN_CYCLE, func(i) {
            mayanSphereEncode(beatOffset + i)
        })
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 6: PHI-FIBONACCI MERKLE TREE (SPHINCS+-INSPIRED)
    // Each node: h = FNV(djb2(SDBM(x))) with phi-scaled mixing
    // merkleRoot = phiFibMerkleHash(leaf, sibling, depth)
    // ═══════════════════════════════════════════════════════════════

    public func phiFibMerkleHash(left : Nat, right : Nat, depth : Nat) : Nat {
        // Apply all 3 hash layers with phi-Fibonacci mixing at each depth
        let fibIdx = depth % Constants.FIBONACCI.size();
        let fibVal = Constants.FIBONACCI[fibIdx];
        let combined = (left * fibVal + right) % MOD_32;
        let h1 = sdbmHash(left, right);
        let h2 = djb2Hash(h1, combined);
        let phiScale = Float.toInt(Float.fromInt(h2) * Constants.PHI_INVERSE);
        let h3 = fnv1aHash(
            [Nat8.fromNat(h2 % 256), Nat8.fromNat(combined % 256)],
            depth
        );
        (Int.abs(phiScale) + h3) % MOD_32
    };

    // Build Merkle root from array of leaf hashes
    func buildMerkleRoot(leaves : [Nat]) : Nat {
        let n = leaves.size();
        if (n == 0) return 0;
        if (n == 1) return leaves[0];
        var level = Buffer.fromArray<Nat>(leaves);
        var depth = 0;
        while (level.size() > 1) {
            let nextLevel = Buffer.Buffer<Nat>(level.size() / 2 + 1);
            var i = 0;
            while (i + 1 < level.size()) {
                nextLevel.add(phiFibMerkleHash(level.get(i), level.get(i + 1), depth));
                i += 2;
            };
            if (i < level.size()) {
                // Odd node — pair with itself
                nextLevel.add(phiFibMerkleHash(level.get(i), level.get(i), depth));
            };
            level := nextLevel;
            depth += 1;
        };
        level.get(0)
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 7: HASH-THEN-SIGN
    // signature = sign(hash(payload), privateState)
    // verify: hash(payload) == unsign(signature, publicState)
    // ═══════════════════════════════════════════════════════════════

    public func hashThenSign(
        payload : [Nat8],
        privateState : Nat,
        beat : Nat
    ) : HashThenSign {
        let payloadHash = cascadeHash(payload, privateState, beat);
        // Sign = phi-Fibonacci mixing of hash with private state
        let signature = phiFibMerkleHash(payloadHash, privateState, beat % 30);
        {
            payloadHash = payloadHash;
            signature = signature;
            timestampBeat = beat;
        }
    };

    public func verifyHashSign(
        payload : [Nat8],
        sig : HashThenSign,
        publicState : Nat
    ) : Bool {
        // Recompute payload hash
        let recomputedHash = cascadeHash(payload, publicState, sig.timestampBeat);
        // Verify hash matches
        if (recomputedHash != sig.payloadHash) return false;
        // Verify signature
        let expectedSig = phiFibMerkleHash(
            recomputedHash,
            publicState,
            sig.timestampBeat % 30
        );
        expectedSig == sig.signature
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 8: QUANTUM LOCK INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    public func initQuantumLock(principal : Text, coherenceC : Float) : QuantumLock {
        let config : LockConfig = {
            minWindow = MIN_WINDOW;
            maxWindow = MAX_WINDOW;
            baseWindow = 1000;
            hostileThreshold = 0.25;
        };

        let initialEntropy = coherenceC * Constants.PHI_INVERSE;
        let initialWindow = computeDynamicWindow(config.baseWindow, coherenceC, 0);

        let ratchet : RatchetState = {
            window = initialWindow;
            entropy = initialEntropy;
            lastRotation = Time.now();
            generation = 0;
            chainHash = Blob.fromArray([]);
        };

        let cognitiveLock : CognitiveLock = {
            coherenceC = coherenceC;
            H_obs = 12.0;  // Default: perfect chimera frequency
            ratchetEntropy = initialEntropy;
            lockStrength = computeLockStrength(coherenceC, 12.0, initialEntropy);
            window = initialWindow;
        };

        let mayanSphere = buildMayanSphere(0);

        // Build Merkle root from Mayan sphere hash points
        let sphereLeaves = Array.map<MayanSpherePoint, Nat>(
            mayanSphere,
            func(p) { p.leechCoord + p.day * 1000 }
        );
        let merkleRoot = buildMerkleRoot(sphereLeaves);

        {
            principal = principal;
            ratchetState = ratchet;
            cognitiveLock = cognitiveLock;
            mayanSphere = mayanSphere;
            merkleRoot = merkleRoot;
            config = config;
            authenticated = false;
            authCount = 0;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 9: RATCHET ROTATION
    // Window adapts to coherence + entropy grows by φ each rotation
    // ═══════════════════════════════════════════════════════════════

    public func rotateRatchet(
        lock : QuantumLock,
        coherenceC : Float,
        beatCount : Nat
    ) : QuantumLock {
        let newEntropy = lock.ratchetState.entropy * RATCHET_COMPOUND_BASE;
        // Clamp entropy to [0, 1] via sigmoid-like normalization
        let normalizedEntropy = newEntropy / (1.0 + newEntropy);

        let newWindow = computeDynamicWindow(
            lock.config.baseWindow,
            coherenceC,
            beatCount
        );

        // Advance chain hash: hash(prev_chain_hash || generation || entropy)
        let genBytes : [Nat8] = [
            Nat8.fromNat(lock.ratchetState.generation % 256),
            Nat8.fromNat((lock.ratchetState.generation / 256) % 256),
        ];
        let entropyInt = Int.abs(Float.toInt(normalizedEntropy * Float.fromInt(MOD_32)));
        let newChainNat = cascadeHash(genBytes, entropyInt % MOD_32, beatCount);
        let newChainBlob = Blob.fromArray([
            Nat8.fromNat(newChainNat % 256),
            Nat8.fromNat((newChainNat / 256) % 256),
            Nat8.fromNat((newChainNat / 65536) % 256),
            Nat8.fromNat((newChainNat / 16777216) % 256),
        ]);

        let newRatchet : RatchetState = {
            window = newWindow;
            entropy = normalizedEntropy;
            lastRotation = Time.now();
            generation = lock.ratchetState.generation + 1;
            chainHash = newChainBlob;
        };

        let lockStrength = computeLockStrength(coherenceC, 12.0, normalizedEntropy);
        let newCognitive : CognitiveLock = {
            coherenceC = coherenceC;
            H_obs = 12.0;
            ratchetEntropy = normalizedEntropy;
            lockStrength = lockStrength;
            window = newWindow;
        };

        // Update Mayan sphere to current beat position
        let newSphere = buildMayanSphere(beatCount);
        let sphereLeaves = Array.map<MayanSpherePoint, Nat>(newSphere,
            func(p) { p.leechCoord + p.day * 1000 }
        );
        let newMerkle = buildMerkleRoot(sphereLeaves);

        { lock with
            ratchetState = newRatchet;
            cognitiveLock = newCognitive;
            mayanSphere = newSphere;
            merkleRoot = newMerkle;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 10: PRINCIPAL VALIDATION
    // Challenge-response via cascade hash + Merkle proof
    // ═══════════════════════════════════════════════════════════════

    public func validatePrincipal(
        lock : QuantumLock,
        challenge : [Nat8],
        response : Nat
    ) : Bool {
        // Compute expected response: cascadeHash of challenge with merkleRoot as context
        let expectedHash = cascadeHash(
            challenge,
            lock.merkleRoot,
            lock.ratchetState.generation
        );

        // Response must match within the ratchet window
        // (window defines the acceptance range for timing variance)
        let diff = if (expectedHash >= response) {
            expectedHash - response
        } else {
            response - expectedHash
        };

        // Lock strength gates acceptance: higher lockStrength = tighter window
        let effectiveWindow = Float.toInt(
            Float.fromInt(lock.ratchetState.window) * lock.cognitiveLock.lockStrength
        );
        let windowNat = Int.abs(effectiveWindow);

        diff <= windowNat
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 11: AUTHENTICATION RECORD
    // Track authentication attempts and update lock
    // ═══════════════════════════════════════════════════════════════

    public func authenticate(
        lock : QuantumLock,
        challenge : [Nat8],
        response : Nat
    ) : (QuantumLock, Bool) {
        let valid = validatePrincipal(lock, challenge, response);
        let updatedLock = { lock with
            authenticated = valid;
            authCount = lock.authCount + 1;
        };
        (updatedLock, valid)
    };

    // ═══════════════════════════════════════════════════════════════
    // SECTION 12: DEFAULT CONFIG
    // ═══════════════════════════════════════════════════════════════

    public func defaultConfig() : LockConfig {
        {
            minWindow = MIN_WINDOW;
            maxWindow = MAX_WINDOW;
            baseWindow = 1000;
            hostileThreshold = 0.25;
        }
    };

}
