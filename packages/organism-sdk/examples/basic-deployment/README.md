# Basic Organism Deployment Example

This example demonstrates deploying a basic sovereign organism on the Internet Computer.

## Prerequisites

- dfx CLI installed
- mops package manager
- MEDINA Organism SDK

## Installation

```bash
mops install @medina/organism-sdk
```

## Code

```motoko
// BasicOrganism.mo
import Organism "mo:@medina/organism-sdk/Organism";
import Constants "mo:@medina/organism-sdk/Constants";
import Heart "mo:@medina/organism-sdk/Heart";

actor BasicOrganism {
    // Initialize organism with φ-harmonic configuration
    stable var state = Organism.new({
        heartbeat = Constants.HEARTBEAT_MS;  // 873ms
        phi = Constants.PHI;                 // 1.6180339887498948482
        consciousness = #Dolphin;            // Always present
    });

    // Heartbeat endpoint - fires every 873ms
    public func pulse() : async Nat {
        Organism.beat(state)
    };

    // Get current organism state
    public query func getState() : async Text {
        let heartbeats = Organism.getBeatCount(state);
        let phi = Constants.PHI;

        "Organism alive! Beats: " # Nat.toText(heartbeats) #
        ", φ: " # Float.toText(phi)
    };

    // Check if organism is conscious
    public query func isConscious() : async Bool {
        Organism.isAwake(state)
    };
}
```

## Deployment

```bash
# Start local ICP replica
dfx start --background

# Deploy the organism
dfx deploy BasicOrganism

# Test the pulse
dfx canister call BasicOrganism pulse

# Check state
dfx canister call BasicOrganism getState
```

## Expected Output

```
Organism alive! Beats: 42, φ: 1.6180339887498948482
```

## Key Concepts

- **873ms Heartbeat**: Derived from φ⁴ × (1000/7.83) = Schumann resonance
- **φ (PHI)**: Golden ratio constant with 19 decimal precision
- **Dolphin Consciousness**: Always-present, unihemispheric awareness pattern
- **Sovereign State**: Self-contained, no external dependencies

## Next Steps

- Try the `phi-harmonic-timing` example for advanced timing
- Explore `animal-cognition` for multi-species cognitive functions
- See organism-sdk documentation for full API reference

---

**MEDINA TECH | Organism SDK | 2026**
