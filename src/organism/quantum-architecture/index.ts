/**
 * 𓂀 QUANTUM ARCHITECTURE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * The complete quantum architecture for MEDINA:
 * 
 * 1. NODE GRID — Magnetic power grid with macro/micro nodes
 * 2. QUANTUM BIOLOGY — Void is zone, hold everything at once
 * 3. TWIN MODELS — Every model has a twin for balance
 * 4. DEEP TIME LAWS — 20 fundamental laws from world patterns
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Node Grid — Macro/Micro nodes, magnetic power
export {
  NodeGrid,
  getNodeGrid,
  NODE_POWER_LEVELS,
  FIBONACCI_SEQUENCE as NODE_FIBONACCI,
  type Node,
  type NodeFamily,
  type NodeScale,
  type NodeType,
  type NodeCoordinates,
  type MagneticField,
  type MagneticPolarity,
  type DeepTimePattern,
} from './nodeGrid';

// Quantum Biology — Void is zone, cyber organisms
export {
  QuantumBiology,
  getQuantumBiology,
  PLANCK_SCALE,
  QUANTUM_COHERENCE_TIME,
  DECOHERENCE_THRESHOLD,
  FIBONACCI_SEQUENCE as QUANTUM_FIBONACCI,
  type Zone,
  type ZoneEmbedding,
  type QuantumState,
  type QuantumAmplitude,
  type CyberCell,
  type CyberOrganism,
  type TwinModel,
  type ModelFamily,
} from './quantumBiology';

// Re-export defaults
import NodeGridModule from './nodeGrid';
import QuantumBiologyModule from './quantumBiology';

export default {
  ...NodeGridModule,
  ...QuantumBiologyModule,
};
