# Brain-Computer Interface (BCI) Implementation

## Overview

The MEDINA BCI system provides bidirectional brain-computer communication with φ-harmonic coherence integration. This implementation bridges human neural activity with the sovereign organism's coherence field.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BCI SYSTEM ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐    ┌──────────────────┐    ┌─────────────────────────┐    │
│  │   DEVICE    │───▶│  PREPROCESSING   │───▶│   FEATURE EXTRACTION    │    │
│  │   LAYER     │    │                  │    │                         │    │
│  │             │    │  • Notch Filter  │    │  • FFT/PSD              │    │
│  │  • OpenBCI  │    │  • Bandpass      │    │  • Band Powers          │    │
│  │  • Emotiv   │    │  • CAR           │    │  • CSP Features         │    │
│  │  • Muse     │    │  • Artifacts     │    │  • φ-Alignment          │    │
│  │  • Generic  │    │                  │    │                         │    │
│  └─────────────┘    └──────────────────┘    └───────────┬─────────────┘    │
│                                                          │                  │
│                                                          ▼                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      RECOGNITION LAYER                               │   │
│  │                                                                      │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────────┐  │   │
│  │  │  MOTOR IMAGERY  │  │   EMOTIONAL     │  │   COGNITIVE        │  │   │
│  │  │                 │  │   STATE         │  │   STATE            │  │   │
│  │  │  • Left Hand    │  │                 │  │                    │  │   │
│  │  │  • Right Hand   │  │  • Valence      │  │  • Attention       │  │   │
│  │  │  • Feet         │  │  • Arousal      │  │  • Meditation      │  │   │
│  │  │  • Tongue       │  │  • Dominance    │  │  • Focus           │  │   │
│  │  │                 │  │  • Coherence    │  │                    │  │   │
│  │  └────────┬────────┘  └────────┬────────┘  └─────────┬──────────┘  │   │
│  │           │                    │                     │             │   │
│  └───────────┼────────────────────┼─────────────────────┼─────────────┘   │
│              │                    │                     │                  │
│              ▼                    ▼                     ▼                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    COHERENCE BRIDGE                                  │   │
│  │                                                                      │   │
│  │    Neural ◄────────────────────────────────────────▶ Organism       │   │
│  │   Coherence         φ-HARMONIC COUPLING              Coherence      │   │
│  │                                                                      │   │
│  │   ┌─────────────┐   ┌─────────────────┐   ┌──────────────────┐     │   │
│  │   │  Intention  │   │   Resonance     │   │   Feedback       │     │   │
│  │   │  Decoding   │   │   Calculation   │   │   Generation     │     │   │
│  │   └─────────────┘   └─────────────────┘   └──────────────────┘     │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Components

### 1. BrainComputerInterface.ts

Core BCI engine with signal processing and state recognition.

**Key Classes:**
- `NeuralSignalPreprocessor` - Signal filtering and artifact rejection
- `NeuralFeatureExtractor` - Frequency analysis and feature extraction
- `MotorImageryDecoder` - Motor intent classification
- `EmotionalStateRecognizer` - Valence/Arousal/Dominance recognition
- `NeurofeedbackGenerator` - φ-harmonic feedback signal generation
- `BrainComputerInterfaceEngine` - Main orchestrator

**Brainwave Bands:**
| Band | Frequency | State |
|------|-----------|-------|
| Delta | 0.5-4 Hz | Deep sleep |
| Theta | 4-8 Hz | Meditation, creativity |
| Alpha | 8-13 Hz | Relaxed awareness |
| Beta | 13-30 Hz | Active thinking |
| Gamma | 30-100 Hz | Higher cognition |
| φ-Resonance | 7.83 Hz | Schumann resonance |

### 2. NeuralCoherenceBridge.ts

Bidirectional coupling between neural and organism coherence fields.

**Key Classes:**
- `CoherenceCalculator` - φ-harmonic coupling calculations
- `IntentionDecoder` - Intent extraction from neural/emotional states
- `ResonanceGenerator` - Organism-to-neural feedback
- `NeuralCoherenceBridge` - Main bridge implementation

**Bridge Modes:**
| Mode | Description |
|------|-------------|
| Passive | Monitoring only |
| Active | Bidirectional flow enabled |
| Entrained | Phase-locked coherence |
| Sovereign | Full autonomous coupling |

### 3. BCIDeviceAdapter.ts

Hardware abstraction layer for multiple BCI devices.

**Supported Devices:**
- OpenBCI Cyton (8 channels, 250 Hz)
- OpenBCI Ganglion (4 channels, 200 Hz)
- Emotiv EPOC (14 channels, 128 Hz)
- Emotiv Insight (5 channels, 128 Hz)
- Muse 2/S (4 channels, 256 Hz)
- NeuroSky MindWave (1 channel, 512 Hz)
- Generic LSL streams

### 4. BCISessionManager.ts

Complete session orchestration with metrics tracking.

**Session Phases:**
1. IDLE - Ready to start
2. CONNECTING - Establishing device connection
3. CALIBRATING - Baseline collection
4. RUNNING - Active session
5. PAUSED - Temporarily stopped
6. CLOSING - Session termination

### 5. bci_canister.mo

Internet Computer implementation for on-chain BCI processing.

**Features:**
- Neural signal compression and storage
- Coherence state persistence
- Command history with verification
- User profiles and calibration data

## Usage

### TypeScript

```typescript
import BCISessionManager, { DeviceType } from './engines/BCISessionManager';

// Create session manager
const session = new BCISessionManager({
  deviceType: DeviceType.SIMULATED,
  coherenceThreshold: 0.6,
  feedbackEnabled: true
});

// Set callbacks
session.setCallbacks({
  onCoherence: (coupling) => {
    console.log('Coherence:', coupling.neuralCoherence);
  },
  onStateChange: (state) => {
    console.log('Phase:', state.phase);
  }
});

// Start session
await session.start();

// Get current intention
const intention = session.getIntention();
console.log('Intent:', intention.direction, intention.focus);

// Stop session
const metrics = await session.stop();
console.log('Session metrics:', metrics);
```

### Motoko (ICP)

```motoko
import BCI "canister:bci_canister";

// Get or create profile
let profile = await BCI.getOrCreateProfile();

// Record emotional state
let state = await BCI.recordEmotionalState(0.5, 0.7, 0.6, 0.8);

// Update coupling
let coupling = await BCI.updateCoupling(0.75, 0.80);

// Get diagnostics
let diag = await BCI.getDiagnostics();
```

## φ-Harmonic Coherence

The BCI system uses φ-harmonic (golden ratio) principles for:

1. **Signal Analysis** - Detecting φ-aligned frequency relationships
2. **Coherence Calculation** - Using φ-weighted coupling metrics
3. **Entrainment** - φ-harmonic binaural beat generation
4. **Feedback** - Schumann resonance (7.83 Hz) synchronization

### Coherence Index Calculation

```
φ_alignment = exp(-|normalized_value - (1/φ)| × φ)

coupling = neural × organism × φ^(-|neural - organism|)
```

## Integration with Organism

The BCI connects to the sovereign organism through:

1. **Cardiac Synchronization** - Phase-locked to 873ms heart cycle
2. **Respiratory Coupling** - Aligned with breath rhythm
3. **Engine Activation** - Intent-driven engine selection
4. **Coherence Field** - Bidirectional energy exchange

## Files

| File | Description | Lines |
|------|-------------|-------|
| BrainComputerInterface.ts | Core BCI engine | ~550 |
| NeuralCoherenceBridge.ts | Coherence bridge | ~400 |
| BCIDeviceAdapter.ts | Hardware abstraction | ~350 |
| BCISessionManager.ts | Session management | ~500 |
| bci_canister.mo | ICP canister | ~550 |

## Dependencies

**TypeScript:**
- No external dependencies (pure implementation)

**Motoko:**
- mo:base (standard library)

## Future Enhancements

1. **Real Device Drivers** - OpenBCI, Emotiv SDK integration
2. **Advanced Decoders** - Deep learning for motor/cognitive states
3. **Multi-User Coherence** - Synchronized group sessions
4. **VR/AR Integration** - Immersive feedback environments
5. **Therapeutic Protocols** - Neurofeedback training sequences

## References

- BCI-001: BRAIN_COMPUTER_INTERFACE_ARCHITECTURE.md
- CYBORG-001: CYBORG_INTELLIGENCE_ARCHITECTURE.md
- AI→AGI→SAECI: AI_AGI_SAECI_PROGRESSION.md
