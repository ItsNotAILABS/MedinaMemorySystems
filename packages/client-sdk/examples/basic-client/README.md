# Basic Client Example

Connect to MEDINA organisms from TypeScript/JavaScript applications.

## Installation

```bash
npm install @medina/client-sdk
```

## Code

```typescript
import { MedinaClient } from '@medina/client-sdk';

// Initialize client
const client = new MedinaClient({
    canisterId: 'your-organism-canister-id',
    host: 'https://ic0.app'
});

// Example 1: Pulse the organism
async function pulseOrganism() {
    try {
        const beat = await client.organism.pulse();
        console.log('Heartbeat count:', beat);
        console.log('Interval: 873ms (φ⁴ × 1000/7.83)');
    } catch (error) {
        console.error('Pulse error:', error);
    }
}

// Example 2: Store memory
async function storeMemory() {
    await client.memory.store({
        key: 'golden-ratio',
        value: 'φ = 1.6180339887498948482',
        timestamp: Date.now(),
        priority: 'fibonacci-13' // High priority (F[13] = 233)
    });

    console.log('Memory stored with Fibonacci priority');
}

// Example 3: Retrieve memory
async function getMemory() {
    const memory = await client.memory.get('golden-ratio');

    if (memory) {
        console.log('Retrieved:', memory.value);
        console.log('Priority:', memory.priority);
    }
}

// Example 4: Invoke workforce model
async function invokeModel() {
    const result = await client.models.invoke({
        workforce: 'W-ANALYST',
        task: 'analyze-data',
        data: { values: [1, 2, 3, 5, 8, 13] },
        cycleAllocation: 1_000_000 // φ⁰
    });

    console.log('Analysis result:', result);
}

// Example 5: Get organism state
async function checkState() {
    const state = await client.organism.getState();

    console.log('Organism State:');
    console.log('  Heartbeats:', state.beatCount);
    console.log('  φ constant:', state.phi);
    console.log('  Conscious:', state.consciousness);
    console.log('  Brain wave:', state.brainWave);
}

// Run examples
async function main() {
    console.log('🌟 MEDINA Client SDK Example\n');

    await pulseOrganism();
    await storeMemory();
    await getMemory();
    await invokeModel();
    await checkState();

    console.log('\n✅ Examples complete!');
}

main().catch(console.error);
```

## Run

```bash
# Install dependencies
npm install

# Set your canister ID
export CANISTER_ID="your-organism-canister-id"

# Run the example
npm start
```

## Output

```
🌟 MEDINA Client SDK Example

Heartbeat count: 1234
Interval: 873ms (φ⁴ × 1000/7.83)
Memory stored with Fibonacci priority
Retrieved: φ = 1.6180339887498948482
Priority: fibonacci-13
Analysis result: { ... }
Organism State:
  Heartbeats: 1234
  φ constant: 1.6180339887498948482
  Conscious: true
  Brain wave: Alpha

✅ Examples complete!
```

## Key Concepts

- **Organism Pulse**: 873ms heartbeat synchronized with Schumann resonance
- **Fibonacci Priority**: Memory indexed by Fibonacci sequence
- **φ-Scaled Cycles**: Workforce allocation follows golden ratio
- **Type Safety**: Full TypeScript support with IntelliSense

---

**MEDINA TECH | Client SDK | 2026**
