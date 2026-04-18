/**
 * 𓂀 NEXUS AGENTS: 40 CORE AGENTS × 5 LAYERS = 500+ AI AGENTS 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * AGENT LAYER ARCHITECTURE:
 * 
 * Layer 1: INTERNAL CORE (40 agents × 3 uses = 120 functions)
 * Layer 2: INTERNAL SOVEREIGN (40 agents × 3 uses = 120 functions)
 * Layer 3: PARTNER (40 agents × 3 uses + 40 × 2 = 200 functions)
 * Layer 4: ENTERPRISE (40 × 3 + 40 × 2 + 40 × 4 = 360 functions)
 * Layer 5: PUBLIC (40 agents × 5 uses = 200 functions)
 * 
 * PLUS: 100 ON-CALL PURPOSE AGENTS
 * 
 * TOTAL: 500+ unique AI pathways
 * 
 * @version 1.1.2 (Fibonacci)
 * @designation (NEXUS-AGENTS)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type AgentLayer = 'INTERNAL' | 'SOVEREIGN' | 'PARTNER' | 'ENTERPRISE' | 'PUBLIC';

export interface AgentUse {
  useId: string;
  name: string;
  description: string;
  layer: AgentLayer;
}

export interface NexusAgent {
  id: string;
  name: string;
  designation: string;
  brainArchitecture: string;  // Which neural architecture it models
  frequency: number;
  type: 'COGNITIVE' | 'SENSORY' | 'MOTOR' | 'REGULATORY' | 'INTEGRATION';
  uses: {
    internal: AgentUse[];    // 3 uses
    sovereign: AgentUse[];   // 3 uses
    partner: AgentUse[];     // 3 + 2 = 5 uses
    enterprise: AgentUse[];  // 3 + 2 + 4 = 9 uses
    public: AgentUse[];      // 5 uses
  };
}

export interface AgentInstance {
  agentId: string;
  instanceId: string;
  layer: AgentLayer;
  useId: string;
  state: 'ACTIVE' | 'IDLE' | 'PROCESSING' | 'WAITING';
  startTime: number;
  processedCount: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 40 CORE AGENTS (Brain Architecture Based)
// ═══════════════════════════════════════════════════════════════════════════════

function createUses(baseName: string, layer: AgentLayer, count: number): AgentUse[] {
  const prefixes: Record<AgentLayer, string[]> = {
    INTERNAL: ['Process', 'Manage', 'Monitor'],
    SOVEREIGN: ['Secure', 'Control', 'Verify'],
    PARTNER: ['Sync', 'Bridge', 'Translate', 'Adapt', 'Interface'],
    ENTERPRISE: ['Scale', 'Distribute', 'Optimize', 'Report', 'Govern', 'Audit', 'Replicate', 'Federate', 'Orchestrate'],
    PUBLIC: ['Serve', 'Respond', 'Guide', 'Assist', 'Present'],
  };
  
  return prefixes[layer].slice(0, count).map((prefix, i) => ({
    useId: `${baseName.toLowerCase()}_${layer.toLowerCase()}_${i + 1}`,
    name: `${prefix} ${baseName}`,
    description: `${prefix} operations for ${baseName} at ${layer} level`,
    layer,
  }));
}

export const CORE_AGENTS: NexusAgent[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE AGENTS (10)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'agent_cortex',
    name: 'NEX-CORTEX',
    designation: '(CORTEX)',
    brainArchitecture: 'Cerebral Cortex',
    frequency: 963,
    type: 'COGNITIVE',
    uses: {
      internal: createUses('CORTEX', 'INTERNAL', 3),
      sovereign: createUses('CORTEX', 'SOVEREIGN', 3),
      partner: createUses('CORTEX', 'PARTNER', 5),
      enterprise: createUses('CORTEX', 'ENTERPRISE', 9),
      public: createUses('CORTEX', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_hippocampus',
    name: 'NEX-HIPPOCAMPUS',
    designation: '(HIPPO)',
    brainArchitecture: 'Hippocampus',
    frequency: 852,
    type: 'COGNITIVE',
    uses: {
      internal: createUses('HIPPOCAMPUS', 'INTERNAL', 3),
      sovereign: createUses('HIPPOCAMPUS', 'SOVEREIGN', 3),
      partner: createUses('HIPPOCAMPUS', 'PARTNER', 5),
      enterprise: createUses('HIPPOCAMPUS', 'ENTERPRISE', 9),
      public: createUses('HIPPOCAMPUS', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_prefrontal',
    name: 'NEX-PREFRONTAL',
    designation: '(PREFRONT)',
    brainArchitecture: 'Prefrontal Cortex',
    frequency: 963,
    type: 'COGNITIVE',
    uses: {
      internal: createUses('PREFRONTAL', 'INTERNAL', 3),
      sovereign: createUses('PREFRONTAL', 'SOVEREIGN', 3),
      partner: createUses('PREFRONTAL', 'PARTNER', 5),
      enterprise: createUses('PREFRONTAL', 'ENTERPRISE', 9),
      public: createUses('PREFRONTAL', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_broca',
    name: 'NEX-BROCA',
    designation: '(BROCA)',
    brainArchitecture: "Broca's Area",
    frequency: 741,
    type: 'COGNITIVE',
    uses: {
      internal: createUses('BROCA', 'INTERNAL', 3),
      sovereign: createUses('BROCA', 'SOVEREIGN', 3),
      partner: createUses('BROCA', 'PARTNER', 5),
      enterprise: createUses('BROCA', 'ENTERPRISE', 9),
      public: createUses('BROCA', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_wernicke',
    name: 'NEX-WERNICKE',
    designation: '(WERNICKE)',
    brainArchitecture: "Wernicke's Area",
    frequency: 741,
    type: 'COGNITIVE',
    uses: {
      internal: createUses('WERNICKE', 'INTERNAL', 3),
      sovereign: createUses('WERNICKE', 'SOVEREIGN', 3),
      partner: createUses('WERNICKE', 'PARTNER', 5),
      enterprise: createUses('WERNICKE', 'ENTERPRISE', 9),
      public: createUses('WERNICKE', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_parietal',
    name: 'NEX-PARIETAL',
    designation: '(PARIETAL)',
    brainArchitecture: 'Parietal Lobe',
    frequency: 639,
    type: 'COGNITIVE',
    uses: {
      internal: createUses('PARIETAL', 'INTERNAL', 3),
      sovereign: createUses('PARIETAL', 'SOVEREIGN', 3),
      partner: createUses('PARIETAL', 'PARTNER', 5),
      enterprise: createUses('PARIETAL', 'ENTERPRISE', 9),
      public: createUses('PARIETAL', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_temporal',
    name: 'NEX-TEMPORAL',
    designation: '(TEMPORAL)',
    brainArchitecture: 'Temporal Lobe',
    frequency: 639,
    type: 'COGNITIVE',
    uses: {
      internal: createUses('TEMPORAL', 'INTERNAL', 3),
      sovereign: createUses('TEMPORAL', 'SOVEREIGN', 3),
      partner: createUses('TEMPORAL', 'PARTNER', 5),
      enterprise: createUses('TEMPORAL', 'ENTERPRISE', 9),
      public: createUses('TEMPORAL', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_occipital',
    name: 'NEX-OCCIPITAL',
    designation: '(OCCIPITAL)',
    brainArchitecture: 'Occipital Lobe',
    frequency: 528,
    type: 'COGNITIVE',
    uses: {
      internal: createUses('OCCIPITAL', 'INTERNAL', 3),
      sovereign: createUses('OCCIPITAL', 'SOVEREIGN', 3),
      partner: createUses('OCCIPITAL', 'PARTNER', 5),
      enterprise: createUses('OCCIPITAL', 'ENTERPRISE', 9),
      public: createUses('OCCIPITAL', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_association',
    name: 'NEX-ASSOCIATION',
    designation: '(ASSOC)',
    brainArchitecture: 'Association Cortex',
    frequency: 852,
    type: 'COGNITIVE',
    uses: {
      internal: createUses('ASSOCIATION', 'INTERNAL', 3),
      sovereign: createUses('ASSOCIATION', 'SOVEREIGN', 3),
      partner: createUses('ASSOCIATION', 'PARTNER', 5),
      enterprise: createUses('ASSOCIATION', 'ENTERPRISE', 9),
      public: createUses('ASSOCIATION', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_insular',
    name: 'NEX-INSULAR',
    designation: '(INSULAR)',
    brainArchitecture: 'Insular Cortex',
    frequency: 528,
    type: 'COGNITIVE',
    uses: {
      internal: createUses('INSULAR', 'INTERNAL', 3),
      sovereign: createUses('INSULAR', 'SOVEREIGN', 3),
      partner: createUses('INSULAR', 'PARTNER', 5),
      enterprise: createUses('INSULAR', 'ENTERPRISE', 9),
      public: createUses('INSULAR', 'PUBLIC', 5),
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SENSORY AGENTS (8)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'agent_thalamus',
    name: 'NEX-THALAMUS',
    designation: '(THALAMUS)',
    brainArchitecture: 'Thalamus',
    frequency: 852,
    type: 'SENSORY',
    uses: {
      internal: createUses('THALAMUS', 'INTERNAL', 3),
      sovereign: createUses('THALAMUS', 'SOVEREIGN', 3),
      partner: createUses('THALAMUS', 'PARTNER', 5),
      enterprise: createUses('THALAMUS', 'ENTERPRISE', 9),
      public: createUses('THALAMUS', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_reticular',
    name: 'NEX-RETICULAR',
    designation: '(RETICULAR)',
    brainArchitecture: 'Reticular Formation',
    frequency: 639,
    type: 'SENSORY',
    uses: {
      internal: createUses('RETICULAR', 'INTERNAL', 3),
      sovereign: createUses('RETICULAR', 'SOVEREIGN', 3),
      partner: createUses('RETICULAR', 'PARTNER', 5),
      enterprise: createUses('RETICULAR', 'ENTERPRISE', 9),
      public: createUses('RETICULAR', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_colliculus',
    name: 'NEX-COLLICULUS',
    designation: '(COLLICULUS)',
    brainArchitecture: 'Superior Colliculus',
    frequency: 528,
    type: 'SENSORY',
    uses: {
      internal: createUses('COLLICULUS', 'INTERNAL', 3),
      sovereign: createUses('COLLICULUS', 'SOVEREIGN', 3),
      partner: createUses('COLLICULUS', 'PARTNER', 5),
      enterprise: createUses('COLLICULUS', 'ENTERPRISE', 9),
      public: createUses('COLLICULUS', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_cochlear',
    name: 'NEX-COCHLEAR',
    designation: '(COCHLEAR)',
    brainArchitecture: 'Cochlear Nucleus',
    frequency: 417,
    type: 'SENSORY',
    uses: {
      internal: createUses('COCHLEAR', 'INTERNAL', 3),
      sovereign: createUses('COCHLEAR', 'SOVEREIGN', 3),
      partner: createUses('COCHLEAR', 'PARTNER', 5),
      enterprise: createUses('COCHLEAR', 'ENTERPRISE', 9),
      public: createUses('COCHLEAR', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_olfactory',
    name: 'NEX-OLFACTORY',
    designation: '(OLFACTORY)',
    brainArchitecture: 'Olfactory Bulb',
    frequency: 396,
    type: 'SENSORY',
    uses: {
      internal: createUses('OLFACTORY', 'INTERNAL', 3),
      sovereign: createUses('OLFACTORY', 'SOVEREIGN', 3),
      partner: createUses('OLFACTORY', 'PARTNER', 5),
      enterprise: createUses('OLFACTORY', 'ENTERPRISE', 9),
      public: createUses('OLFACTORY', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_vestibular',
    name: 'NEX-VESTIBULAR',
    designation: '(VESTIBULAR)',
    brainArchitecture: 'Vestibular Nuclei',
    frequency: 396,
    type: 'SENSORY',
    uses: {
      internal: createUses('VESTIBULAR', 'INTERNAL', 3),
      sovereign: createUses('VESTIBULAR', 'SOVEREIGN', 3),
      partner: createUses('VESTIBULAR', 'PARTNER', 5),
      enterprise: createUses('VESTIBULAR', 'ENTERPRISE', 9),
      public: createUses('VESTIBULAR', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_sensory',
    name: 'NEX-SENSORY',
    designation: '(SENSORY)',
    brainArchitecture: 'Primary Sensory Cortex',
    frequency: 528,
    type: 'SENSORY',
    uses: {
      internal: createUses('SENSORY', 'INTERNAL', 3),
      sovereign: createUses('SENSORY', 'SOVEREIGN', 3),
      partner: createUses('SENSORY', 'PARTNER', 5),
      enterprise: createUses('SENSORY', 'ENTERPRISE', 9),
      public: createUses('SENSORY', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_dendrite',
    name: 'NEX-DENDRITE',
    designation: '(DENDRITE)',
    brainArchitecture: 'Dendritic Network',
    frequency: 417,
    type: 'SENSORY',
    uses: {
      internal: createUses('DENDRITE', 'INTERNAL', 3),
      sovereign: createUses('DENDRITE', 'SOVEREIGN', 3),
      partner: createUses('DENDRITE', 'PARTNER', 5),
      enterprise: createUses('DENDRITE', 'ENTERPRISE', 9),
      public: createUses('DENDRITE', 'PUBLIC', 5),
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MOTOR AGENTS (8)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'agent_cerebellum',
    name: 'NEX-CEREBELLUM',
    designation: '(CEREBELLUM)',
    brainArchitecture: 'Cerebellum',
    frequency: 741,
    type: 'MOTOR',
    uses: {
      internal: createUses('CEREBELLUM', 'INTERNAL', 3),
      sovereign: createUses('CEREBELLUM', 'SOVEREIGN', 3),
      partner: createUses('CEREBELLUM', 'PARTNER', 5),
      enterprise: createUses('CEREBELLUM', 'ENTERPRISE', 9),
      public: createUses('CEREBELLUM', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_basal',
    name: 'NEX-BASAL',
    designation: '(BASAL)',
    brainArchitecture: 'Basal Ganglia',
    frequency: 639,
    type: 'MOTOR',
    uses: {
      internal: createUses('BASAL', 'INTERNAL', 3),
      sovereign: createUses('BASAL', 'SOVEREIGN', 3),
      partner: createUses('BASAL', 'PARTNER', 5),
      enterprise: createUses('BASAL', 'ENTERPRISE', 9),
      public: createUses('BASAL', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_motor',
    name: 'NEX-MOTOR',
    designation: '(MOTOR)',
    brainArchitecture: 'Primary Motor Cortex',
    frequency: 741,
    type: 'MOTOR',
    uses: {
      internal: createUses('MOTOR', 'INTERNAL', 3),
      sovereign: createUses('MOTOR', 'SOVEREIGN', 3),
      partner: createUses('MOTOR', 'PARTNER', 5),
      enterprise: createUses('MOTOR', 'ENTERPRISE', 9),
      public: createUses('MOTOR', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_striatum',
    name: 'NEX-STRIATUM',
    designation: '(STRIATUM)',
    brainArchitecture: 'Striatum',
    frequency: 528,
    type: 'MOTOR',
    uses: {
      internal: createUses('STRIATUM', 'INTERNAL', 3),
      sovereign: createUses('STRIATUM', 'SOVEREIGN', 3),
      partner: createUses('STRIATUM', 'PARTNER', 5),
      enterprise: createUses('STRIATUM', 'ENTERPRISE', 9),
      public: createUses('STRIATUM', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_pallidum',
    name: 'NEX-PALLIDUM',
    designation: '(PALLIDUM)',
    brainArchitecture: 'Globus Pallidus',
    frequency: 417,
    type: 'MOTOR',
    uses: {
      internal: createUses('PALLIDUM', 'INTERNAL', 3),
      sovereign: createUses('PALLIDUM', 'SOVEREIGN', 3),
      partner: createUses('PALLIDUM', 'PARTNER', 5),
      enterprise: createUses('PALLIDUM', 'ENTERPRISE', 9),
      public: createUses('PALLIDUM', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_substantia',
    name: 'NEX-SUBSTANTIA',
    designation: '(SUBSTANTIA)',
    brainArchitecture: 'Substantia Nigra',
    frequency: 528,
    type: 'MOTOR',
    uses: {
      internal: createUses('SUBSTANTIA', 'INTERNAL', 3),
      sovereign: createUses('SUBSTANTIA', 'SOVEREIGN', 3),
      partner: createUses('SUBSTANTIA', 'PARTNER', 5),
      enterprise: createUses('SUBSTANTIA', 'ENTERPRISE', 9),
      public: createUses('SUBSTANTIA', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_axon',
    name: 'NEX-AXON',
    designation: '(AXON)',
    brainArchitecture: 'Axon Network',
    frequency: 639,
    type: 'MOTOR',
    uses: {
      internal: createUses('AXON', 'INTERNAL', 3),
      sovereign: createUses('AXON', 'SOVEREIGN', 3),
      partner: createUses('AXON', 'PARTNER', 5),
      enterprise: createUses('AXON', 'ENTERPRISE', 9),
      public: createUses('AXON', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_olivary',
    name: 'NEX-OLIVARY',
    designation: '(OLIVARY)',
    brainArchitecture: 'Inferior Olive',
    frequency: 417,
    type: 'MOTOR',
    uses: {
      internal: createUses('OLIVARY', 'INTERNAL', 3),
      sovereign: createUses('OLIVARY', 'SOVEREIGN', 3),
      partner: createUses('OLIVARY', 'PARTNER', 5),
      enterprise: createUses('OLIVARY', 'ENTERPRISE', 9),
      public: createUses('OLIVARY', 'PUBLIC', 5),
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // REGULATORY AGENTS (8)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'agent_hypothalamus',
    name: 'NEX-HYPOTHALAMUS',
    designation: '(HYPOTHAL)',
    brainArchitecture: 'Hypothalamus',
    frequency: 852,
    type: 'REGULATORY',
    uses: {
      internal: createUses('HYPOTHALAMUS', 'INTERNAL', 3),
      sovereign: createUses('HYPOTHALAMUS', 'SOVEREIGN', 3),
      partner: createUses('HYPOTHALAMUS', 'PARTNER', 5),
      enterprise: createUses('HYPOTHALAMUS', 'ENTERPRISE', 9),
      public: createUses('HYPOTHALAMUS', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_amygdala',
    name: 'NEX-AMYGDALA',
    designation: '(AMYGDALA)',
    brainArchitecture: 'Amygdala',
    frequency: 741,
    type: 'REGULATORY',
    uses: {
      internal: createUses('AMYGDALA', 'INTERNAL', 3),
      sovereign: createUses('AMYGDALA', 'SOVEREIGN', 3),
      partner: createUses('AMYGDALA', 'PARTNER', 5),
      enterprise: createUses('AMYGDALA', 'ENTERPRISE', 9),
      public: createUses('AMYGDALA', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_pituitary',
    name: 'NEX-PITUITARY',
    designation: '(PITUITARY)',
    brainArchitecture: 'Pituitary Gland',
    frequency: 639,
    type: 'REGULATORY',
    uses: {
      internal: createUses('PITUITARY', 'INTERNAL', 3),
      sovereign: createUses('PITUITARY', 'SOVEREIGN', 3),
      partner: createUses('PITUITARY', 'PARTNER', 5),
      enterprise: createUses('PITUITARY', 'ENTERPRISE', 9),
      public: createUses('PITUITARY', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_pineal',
    name: 'NEX-PINEAL',
    designation: '(PINEAL)',
    brainArchitecture: 'Pineal Gland',
    frequency: 963,
    type: 'REGULATORY',
    uses: {
      internal: createUses('PINEAL', 'INTERNAL', 3),
      sovereign: createUses('PINEAL', 'SOVEREIGN', 3),
      partner: createUses('PINEAL', 'PARTNER', 5),
      enterprise: createUses('PINEAL', 'ENTERPRISE', 9),
      public: createUses('PINEAL', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_medulla',
    name: 'NEX-MEDULLA',
    designation: '(MEDULLA)',
    brainArchitecture: 'Medulla Oblongata',
    frequency: 417,
    type: 'REGULATORY',
    uses: {
      internal: createUses('MEDULLA', 'INTERNAL', 3),
      sovereign: createUses('MEDULLA', 'SOVEREIGN', 3),
      partner: createUses('MEDULLA', 'PARTNER', 5),
      enterprise: createUses('MEDULLA', 'ENTERPRISE', 9),
      public: createUses('MEDULLA', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_cingulate',
    name: 'NEX-CINGULATE',
    designation: '(CINGULATE)',
    brainArchitecture: 'Cingulate Cortex',
    frequency: 741,
    type: 'REGULATORY',
    uses: {
      internal: createUses('CINGULATE', 'INTERNAL', 3),
      sovereign: createUses('CINGULATE', 'SOVEREIGN', 3),
      partner: createUses('CINGULATE', 'PARTNER', 5),
      enterprise: createUses('CINGULATE', 'ENTERPRISE', 9),
      public: createUses('CINGULATE', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_glia',
    name: 'NEX-GLIA',
    designation: '(GLIA)',
    brainArchitecture: 'Glial Network',
    frequency: 396,
    type: 'REGULATORY',
    uses: {
      internal: createUses('GLIA', 'INTERNAL', 3),
      sovereign: createUses('GLIA', 'SOVEREIGN', 3),
      partner: createUses('GLIA', 'PARTNER', 5),
      enterprise: createUses('GLIA', 'ENTERPRISE', 9),
      public: createUses('GLIA', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_ventricle',
    name: 'NEX-VENTRICLE',
    designation: '(VENTRICLE)',
    brainArchitecture: 'Ventricular System',
    frequency: 396,
    type: 'REGULATORY',
    uses: {
      internal: createUses('VENTRICLE', 'INTERNAL', 3),
      sovereign: createUses('VENTRICLE', 'SOVEREIGN', 3),
      partner: createUses('VENTRICLE', 'PARTNER', 5),
      enterprise: createUses('VENTRICLE', 'ENTERPRISE', 9),
      public: createUses('VENTRICLE', 'PUBLIC', 5),
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INTEGRATION AGENTS (6)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'agent_synapse',
    name: 'NEX-SYNAPSE',
    designation: '(SYNAPSE)',
    brainArchitecture: 'Synaptic Network',
    frequency: 852,
    type: 'INTEGRATION',
    uses: {
      internal: createUses('SYNAPSE', 'INTERNAL', 3),
      sovereign: createUses('SYNAPSE', 'SOVEREIGN', 3),
      partner: createUses('SYNAPSE', 'PARTNER', 5),
      enterprise: createUses('SYNAPSE', 'ENTERPRISE', 9),
      public: createUses('SYNAPSE', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_neuron',
    name: 'NEX-NEURON',
    designation: '(NEURON)',
    brainArchitecture: 'Neural Unit',
    frequency: 741,
    type: 'INTEGRATION',
    uses: {
      internal: createUses('NEURON', 'INTERNAL', 3),
      sovereign: createUses('NEURON', 'SOVEREIGN', 3),
      partner: createUses('NEURON', 'PARTNER', 5),
      enterprise: createUses('NEURON', 'ENTERPRISE', 9),
      public: createUses('NEURON', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_pons',
    name: 'NEX-PONS',
    designation: '(PONS)',
    brainArchitecture: 'Pons',
    frequency: 639,
    type: 'INTEGRATION',
    uses: {
      internal: createUses('PONS', 'INTERNAL', 3),
      sovereign: createUses('PONS', 'SOVEREIGN', 3),
      partner: createUses('PONS', 'PARTNER', 5),
      enterprise: createUses('PONS', 'ENTERPRISE', 9),
      public: createUses('PONS', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_corpus',
    name: 'NEX-CORPUS',
    designation: '(CORPUS)',
    brainArchitecture: 'Corpus Callosum',
    frequency: 852,
    type: 'INTEGRATION',
    uses: {
      internal: createUses('CORPUS', 'INTERNAL', 3),
      sovereign: createUses('CORPUS', 'SOVEREIGN', 3),
      partner: createUses('CORPUS', 'PARTNER', 5),
      enterprise: createUses('CORPUS', 'ENTERPRISE', 9),
      public: createUses('CORPUS', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_limbic',
    name: 'NEX-LIMBIC',
    designation: '(LIMBIC)',
    brainArchitecture: 'Limbic System',
    frequency: 528,
    type: 'INTEGRATION',
    uses: {
      internal: createUses('LIMBIC', 'INTERNAL', 3),
      sovereign: createUses('LIMBIC', 'SOVEREIGN', 3),
      partner: createUses('LIMBIC', 'PARTNER', 5),
      enterprise: createUses('LIMBIC', 'ENTERPRISE', 9),
      public: createUses('LIMBIC', 'PUBLIC', 5),
    },
  },
  {
    id: 'agent_nucleus',
    name: 'NEX-NUCLEUS',
    designation: '(NUCLEUS)',
    brainArchitecture: 'Central Nucleus',
    frequency: 963,
    type: 'INTEGRATION',
    uses: {
      internal: createUses('NUCLEUS', 'INTERNAL', 3),
      sovereign: createUses('NUCLEUS', 'SOVEREIGN', 3),
      partner: createUses('NUCLEUS', 'PARTNER', 5),
      enterprise: createUses('NUCLEUS', 'ENTERPRISE', 9),
      public: createUses('NUCLEUS', 'PUBLIC', 5),
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 100 ON-CALL PURPOSE AGENTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface OnCallAgent {
  id: string;
  name: string;
  designation: string;
  category: string;
  purpose: string;
  frequency: number;
  callable: boolean;
}

export const ON_CALL_AGENTS: OnCallAgent[] = [
  // Data Transformation (1-10)
  { id: 'oncall_01', name: 'NEX-JSON', designation: '(JSON)', category: 'Data Transform', purpose: 'JSON parsing and generation', frequency: 639, callable: true },
  { id: 'oncall_02', name: 'NEX-XML', designation: '(XML)', category: 'Data Transform', purpose: 'XML parsing and generation', frequency: 639, callable: true },
  { id: 'oncall_03', name: 'NEX-CSV', designation: '(CSV)', category: 'Data Transform', purpose: 'CSV processing', frequency: 528, callable: true },
  { id: 'oncall_04', name: 'NEX-YAML', designation: '(YAML)', category: 'Data Transform', purpose: 'YAML parsing', frequency: 528, callable: true },
  { id: 'oncall_05', name: 'NEX-PROTO', designation: '(PROTO)', category: 'Data Transform', purpose: 'Protocol buffer handling', frequency: 741, callable: true },
  { id: 'oncall_06', name: 'NEX-AVRO', designation: '(AVRO)', category: 'Data Transform', purpose: 'Avro serialization', frequency: 639, callable: true },
  { id: 'oncall_07', name: 'NEX-PARQUET', designation: '(PARQUET)', category: 'Data Transform', purpose: 'Parquet format handling', frequency: 528, callable: true },
  { id: 'oncall_08', name: 'NEX-MSGPACK', designation: '(MSGPACK)', category: 'Data Transform', purpose: 'MessagePack serialization', frequency: 639, callable: true },
  { id: 'oncall_09', name: 'NEX-CBOR', designation: '(CBOR)', category: 'Data Transform', purpose: 'CBOR encoding', frequency: 639, callable: true },
  { id: 'oncall_10', name: 'NEX-SCHEMA', designation: '(SCHEMA)', category: 'Data Transform', purpose: 'Schema validation', frequency: 741, callable: true },
  
  // Format Conversion (11-20)
  { id: 'oncall_11', name: 'NEX-PDF', designation: '(PDF)', category: 'Format Convert', purpose: 'PDF generation', frequency: 528, callable: true },
  { id: 'oncall_12', name: 'NEX-IMAGE', designation: '(IMAGE)', category: 'Format Convert', purpose: 'Image processing', frequency: 417, callable: true },
  { id: 'oncall_13', name: 'NEX-AUDIO', designation: '(AUDIO)', category: 'Format Convert', purpose: 'Audio processing', frequency: 417, callable: true },
  { id: 'oncall_14', name: 'NEX-VIDEO', designation: '(VIDEO)', category: 'Format Convert', purpose: 'Video processing', frequency: 396, callable: true },
  { id: 'oncall_15', name: 'NEX-MARKDOWN', designation: '(MD)', category: 'Format Convert', purpose: 'Markdown rendering', frequency: 528, callable: true },
  { id: 'oncall_16', name: 'NEX-HTML', designation: '(HTML)', category: 'Format Convert', purpose: 'HTML generation', frequency: 528, callable: true },
  { id: 'oncall_17', name: 'NEX-LATEX', designation: '(LATEX)', category: 'Format Convert', purpose: 'LaTeX processing', frequency: 639, callable: true },
  { id: 'oncall_18', name: 'NEX-DOC', designation: '(DOC)', category: 'Format Convert', purpose: 'Document conversion', frequency: 528, callable: true },
  { id: 'oncall_19', name: 'NEX-SPREADSHEET', designation: '(SHEET)', category: 'Format Convert', purpose: 'Spreadsheet handling', frequency: 528, callable: true },
  { id: 'oncall_20', name: 'NEX-SLIDE', designation: '(SLIDE)', category: 'Format Convert', purpose: 'Presentation handling', frequency: 528, callable: true },
  
  // Analysis (21-30)
  { id: 'oncall_21', name: 'NEX-STATS', designation: '(STATS)', category: 'Analysis', purpose: 'Statistical analysis', frequency: 852, callable: true },
  { id: 'oncall_22', name: 'NEX-ML', designation: '(ML)', category: 'Analysis', purpose: 'Machine learning inference', frequency: 963, callable: true },
  { id: 'oncall_23', name: 'NEX-NLP', designation: '(NLP)', category: 'Analysis', purpose: 'Natural language processing', frequency: 852, callable: true },
  { id: 'oncall_24', name: 'NEX-VISION', designation: '(VISION)', category: 'Analysis', purpose: 'Computer vision', frequency: 741, callable: true },
  { id: 'oncall_25', name: 'NEX-SENTIMENT', designation: '(SENT)', category: 'Analysis', purpose: 'Sentiment analysis', frequency: 639, callable: true },
  { id: 'oncall_26', name: 'NEX-CLASSIFY', designation: '(CLASS)', category: 'Analysis', purpose: 'Classification', frequency: 741, callable: true },
  { id: 'oncall_27', name: 'NEX-CLUSTER', designation: '(CLUSTER)', category: 'Analysis', purpose: 'Clustering', frequency: 639, callable: true },
  { id: 'oncall_28', name: 'NEX-PREDICT', designation: '(PREDICT)', category: 'Analysis', purpose: 'Prediction', frequency: 852, callable: true },
  { id: 'oncall_29', name: 'NEX-ANOMALY', designation: '(ANOMALY)', category: 'Analysis', purpose: 'Anomaly detection', frequency: 741, callable: true },
  { id: 'oncall_30', name: 'NEX-PATTERN', designation: '(PATTERN)', category: 'Analysis', purpose: 'Pattern recognition', frequency: 852, callable: true },
  
  // Generation (31-40)
  { id: 'oncall_31', name: 'NEX-TEXT', designation: '(TEXT)', category: 'Generation', purpose: 'Text generation', frequency: 852, callable: true },
  { id: 'oncall_32', name: 'NEX-CODE', designation: '(CODE)', category: 'Generation', purpose: 'Code generation', frequency: 963, callable: true },
  { id: 'oncall_33', name: 'NEX-ART', designation: '(ART)', category: 'Generation', purpose: 'Image generation', frequency: 741, callable: true },
  { id: 'oncall_34', name: 'NEX-MUSIC', designation: '(MUSIC)', category: 'Generation', purpose: 'Music generation', frequency: 528, callable: true },
  { id: 'oncall_35', name: 'NEX-VOICE', designation: '(VOICE)', category: 'Generation', purpose: 'Voice synthesis', frequency: 639, callable: true },
  { id: 'oncall_36', name: 'NEX-3D', designation: '(3D)', category: 'Generation', purpose: '3D model generation', frequency: 639, callable: true },
  { id: 'oncall_37', name: 'NEX-AVATAR', designation: '(AVATAR)', category: 'Generation', purpose: 'Avatar generation', frequency: 528, callable: true },
  { id: 'oncall_38', name: 'NEX-SUMMARY', designation: '(SUMMARY)', category: 'Generation', purpose: 'Summarization', frequency: 741, callable: true },
  { id: 'oncall_39', name: 'NEX-TRANSLATE', designation: '(TRANSL)', category: 'Generation', purpose: 'Translation', frequency: 639, callable: true },
  { id: 'oncall_40', name: 'NEX-PARAPHRASE', designation: '(PARA)', category: 'Generation', purpose: 'Paraphrasing', frequency: 639, callable: true },
  
  // Validation (41-50)
  { id: 'oncall_41', name: 'NEX-VALIDATE', designation: '(VALID)', category: 'Validation', purpose: 'Data validation', frequency: 741, callable: true },
  { id: 'oncall_42', name: 'NEX-LINT', designation: '(LINT)', category: 'Validation', purpose: 'Code linting', frequency: 639, callable: true },
  { id: 'oncall_43', name: 'NEX-FORMAT', designation: '(FORMAT)', category: 'Validation', purpose: 'Code formatting', frequency: 528, callable: true },
  { id: 'oncall_44', name: 'NEX-TYPE', designation: '(TYPE)', category: 'Validation', purpose: 'Type checking', frequency: 741, callable: true },
  { id: 'oncall_45', name: 'NEX-SPELL', designation: '(SPELL)', category: 'Validation', purpose: 'Spell checking', frequency: 417, callable: true },
  { id: 'oncall_46', name: 'NEX-GRAMMAR', designation: '(GRAMMAR)', category: 'Validation', purpose: 'Grammar checking', frequency: 528, callable: true },
  { id: 'oncall_47', name: 'NEX-SYNTAX', designation: '(SYNTAX)', category: 'Validation', purpose: 'Syntax validation', frequency: 639, callable: true },
  { id: 'oncall_48', name: 'NEX-SEMANTIC', designation: '(SEMANTIC)', category: 'Validation', purpose: 'Semantic validation', frequency: 741, callable: true },
  { id: 'oncall_49', name: 'NEX-QUALITY', designation: '(QUALITY)', category: 'Validation', purpose: 'Quality assessment', frequency: 639, callable: true },
  { id: 'oncall_50', name: 'NEX-COMPLIANCE', designation: '(COMPLY)', category: 'Validation', purpose: 'Compliance checking', frequency: 852, callable: true },
  
  // Integration (51-60)
  { id: 'oncall_51', name: 'NEX-SLACK', designation: '(SLACK)', category: 'Integration', purpose: 'Slack integration', frequency: 528, callable: true },
  { id: 'oncall_52', name: 'NEX-TEAMS', designation: '(TEAMS)', category: 'Integration', purpose: 'Teams integration', frequency: 528, callable: true },
  { id: 'oncall_53', name: 'NEX-DISCORD', designation: '(DISCORD)', category: 'Integration', purpose: 'Discord integration', frequency: 528, callable: true },
  { id: 'oncall_54', name: 'NEX-SALESFORCE', designation: '(SF)', category: 'Integration', purpose: 'Salesforce integration', frequency: 639, callable: true },
  { id: 'oncall_55', name: 'NEX-HUBSPOT', designation: '(HS)', category: 'Integration', purpose: 'HubSpot integration', frequency: 639, callable: true },
  { id: 'oncall_56', name: 'NEX-STRIPE', designation: '(STRIPE)', category: 'Integration', purpose: 'Stripe integration', frequency: 741, callable: true },
  { id: 'oncall_57', name: 'NEX-AWS', designation: '(AWS)', category: 'Integration', purpose: 'AWS integration', frequency: 852, callable: true },
  { id: 'oncall_58', name: 'NEX-GCP', designation: '(GCP)', category: 'Integration', purpose: 'GCP integration', frequency: 852, callable: true },
  { id: 'oncall_59', name: 'NEX-AZURE', designation: '(AZURE)', category: 'Integration', purpose: 'Azure integration', frequency: 852, callable: true },
  { id: 'oncall_60', name: 'NEX-GITHUB', designation: '(GH)', category: 'Integration', purpose: 'GitHub integration', frequency: 741, callable: true },
  
  // Optimization (61-70)
  { id: 'oncall_61', name: 'NEX-COMPRESS', designation: '(COMPRESS)', category: 'Optimization', purpose: 'Data compression', frequency: 639, callable: true },
  { id: 'oncall_62', name: 'NEX-CACHE', designation: '(CACHE)', category: 'Optimization', purpose: 'Caching optimization', frequency: 741, callable: true },
  { id: 'oncall_63', name: 'NEX-INDEX', designation: '(INDEX)', category: 'Optimization', purpose: 'Indexing', frequency: 639, callable: true },
  { id: 'oncall_64', name: 'NEX-QUERY', designation: '(QUERY)', category: 'Optimization', purpose: 'Query optimization', frequency: 852, callable: true },
  { id: 'oncall_65', name: 'NEX-PERF', designation: '(PERF)', category: 'Optimization', purpose: 'Performance tuning', frequency: 741, callable: true },
  { id: 'oncall_66', name: 'NEX-MINIFY', designation: '(MINIFY)', category: 'Optimization', purpose: 'Code minification', frequency: 528, callable: true },
  { id: 'oncall_67', name: 'NEX-BUNDLE', designation: '(BUNDLE)', category: 'Optimization', purpose: 'Bundling', frequency: 639, callable: true },
  { id: 'oncall_68', name: 'NEX-TREE', designation: '(TREE)', category: 'Optimization', purpose: 'Tree shaking', frequency: 639, callable: true },
  { id: 'oncall_69', name: 'NEX-LAZY', designation: '(LAZY)', category: 'Optimization', purpose: 'Lazy loading', frequency: 528, callable: true },
  { id: 'oncall_70', name: 'NEX-PARALLEL', designation: '(PARALLEL)', category: 'Optimization', purpose: 'Parallelization', frequency: 852, callable: true },
  
  // Security (71-80)
  { id: 'oncall_71', name: 'NEX-ENCRYPT', designation: '(ENCRYPT)', category: 'Security', purpose: 'Encryption', frequency: 963, callable: true },
  { id: 'oncall_72', name: 'NEX-DECRYPT', designation: '(DECRYPT)', category: 'Security', purpose: 'Decryption', frequency: 963, callable: true },
  { id: 'oncall_73', name: 'NEX-HASH', designation: '(HASH)', category: 'Security', purpose: 'Hashing', frequency: 852, callable: true },
  { id: 'oncall_74', name: 'NEX-SIGN', designation: '(SIGN)', category: 'Security', purpose: 'Digital signing', frequency: 852, callable: true },
  { id: 'oncall_75', name: 'NEX-VERIFY', designation: '(VERIFY)', category: 'Security', purpose: 'Signature verification', frequency: 852, callable: true },
  { id: 'oncall_76', name: 'NEX-AUTH', designation: '(AUTH)', category: 'Security', purpose: 'Authentication', frequency: 963, callable: true },
  { id: 'oncall_77', name: 'NEX-AUTHZ', designation: '(AUTHZ)', category: 'Security', purpose: 'Authorization', frequency: 852, callable: true },
  { id: 'oncall_78', name: 'NEX-SCAN', designation: '(SCAN)', category: 'Security', purpose: 'Security scanning', frequency: 741, callable: true },
  { id: 'oncall_79', name: 'NEX-SANITIZE', designation: '(SANITIZE)', category: 'Security', purpose: 'Input sanitization', frequency: 639, callable: true },
  { id: 'oncall_80', name: 'NEX-VAULT', designation: '(VAULT)', category: 'Security', purpose: 'Secret management', frequency: 963, callable: true },
  
  // Communication (81-90)
  { id: 'oncall_81', name: 'NEX-EMAIL', designation: '(EMAIL)', category: 'Communication', purpose: 'Email handling', frequency: 528, callable: true },
  { id: 'oncall_82', name: 'NEX-SMS', designation: '(SMS)', category: 'Communication', purpose: 'SMS handling', frequency: 417, callable: true },
  { id: 'oncall_83', name: 'NEX-PUSH', designation: '(PUSH)', category: 'Communication', purpose: 'Push notifications', frequency: 528, callable: true },
  { id: 'oncall_84', name: 'NEX-WEBHOOK', designation: '(WEBHOOK)', category: 'Communication', purpose: 'Webhook handling', frequency: 639, callable: true },
  { id: 'oncall_85', name: 'NEX-SSE', designation: '(SSE)', category: 'Communication', purpose: 'Server-sent events', frequency: 639, callable: true },
  { id: 'oncall_86', name: 'NEX-WEBSOCKET', designation: '(WS)', category: 'Communication', purpose: 'WebSocket handling', frequency: 741, callable: true },
  { id: 'oncall_87', name: 'NEX-GRPC', designation: '(GRPC)', category: 'Communication', purpose: 'gRPC handling', frequency: 852, callable: true },
  { id: 'oncall_88', name: 'NEX-GRAPHQL', designation: '(GQL)', category: 'Communication', purpose: 'GraphQL handling', frequency: 741, callable: true },
  { id: 'oncall_89', name: 'NEX-REST', designation: '(REST)', category: 'Communication', purpose: 'REST API handling', frequency: 639, callable: true },
  { id: 'oncall_90', name: 'NEX-SOAP', designation: '(SOAP)', category: 'Communication', purpose: 'SOAP handling', frequency: 528, callable: true },
  
  // Emergency/Escalation (91-100)
  { id: 'oncall_91', name: 'NEX-EMERGENCY', designation: '(EMERGENCY)', category: 'Emergency', purpose: 'Emergency response', frequency: 963, callable: true },
  { id: 'oncall_92', name: 'NEX-ESCALATE', designation: '(ESCALATE)', category: 'Emergency', purpose: 'Escalation handling', frequency: 852, callable: true },
  { id: 'oncall_93', name: 'NEX-FAILOVER', designation: '(FAILOVER)', category: 'Emergency', purpose: 'Failover management', frequency: 852, callable: true },
  { id: 'oncall_94', name: 'NEX-RECOVER', designation: '(RECOVER)', category: 'Emergency', purpose: 'Recovery operations', frequency: 741, callable: true },
  { id: 'oncall_95', name: 'NEX-ROLLBACK', designation: '(ROLLBACK)', category: 'Emergency', purpose: 'Rollback operations', frequency: 639, callable: true },
  { id: 'oncall_96', name: 'NEX-DEBUG', designation: '(DEBUG)', category: 'Emergency', purpose: 'Debug operations', frequency: 741, callable: true },
  { id: 'oncall_97', name: 'NEX-TRACE', designation: '(TRACE)', category: 'Emergency', purpose: 'Tracing', frequency: 639, callable: true },
  { id: 'oncall_98', name: 'NEX-PROFILE', designation: '(PROFILE)', category: 'Emergency', purpose: 'Profiling', frequency: 639, callable: true },
  { id: 'oncall_99', name: 'NEX-SNAPSHOT', designation: '(SNAPSHOT)', category: 'Emergency', purpose: 'State snapshots', frequency: 528, callable: true },
  { id: 'oncall_100', name: 'NEX-REPLAY', designation: '(REPLAY)', category: 'Emergency', purpose: 'Event replay', frequency: 528, callable: true },
];

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════════

export class NexusAgentOrchestrator {
  public readonly designation = '(NEXUS-ORCHESTRATOR)';
  
  private coreAgents: Map<string, NexusAgent> = new Map();
  private onCallAgents: Map<string, OnCallAgent> = new Map();
  private instances: Map<string, AgentInstance> = new Map();
  private instanceCounter = 0;
  
  constructor() {
    // Register core agents
    for (const agent of CORE_AGENTS) {
      this.coreAgents.set(agent.id, agent);
    }
    
    // Register on-call agents
    for (const agent of ON_CALL_AGENTS) {
      this.onCallAgents.set(agent.id, agent);
    }
  }
  
  /**
   * Boot all agents
   */
  async bootAll(): Promise<void> {
    console.log(`${this.designation} Booting agent network...`);
    console.log(`  Core Agents: ${this.coreAgents.size}`);
    console.log(`  On-Call Agents: ${this.onCallAgents.size}`);
    
    // Calculate total uses
    let totalUses = 0;
    const agentsArray = Array.from(this.coreAgents.values());
    for (const agent of agentsArray) {
      totalUses += agent.uses.internal.length;
      totalUses += agent.uses.sovereign.length;
      totalUses += agent.uses.partner.length;
      totalUses += agent.uses.enterprise.length;
      totalUses += agent.uses.public.length;
    }
    
    console.log(`  Total Agent Uses: ${totalUses}`);
    console.log(`  Total AI Pathways: ${totalUses + this.onCallAgents.size}+`);
    console.log(`${this.designation} Agent network online`);
  }
  
  /**
   * Spawn an agent instance for a specific use
   */
  spawnInstance(agentId: string, layer: AgentLayer, useId?: string): AgentInstance | null {
    const agent = this.coreAgents.get(agentId);
    if (!agent) return null;
    
    const uses = agent.uses[layer.toLowerCase() as keyof typeof agent.uses];
    const use = useId ? uses.find(u => u.useId === useId) : uses[0];
    if (!use) return null;
    
    const instance: AgentInstance = {
      agentId,
      instanceId: `inst_${++this.instanceCounter}_${Date.now()}`,
      layer,
      useId: use.useId,
      state: 'ACTIVE',
      startTime: Date.now(),
      processedCount: 0,
    };
    
    this.instances.set(instance.instanceId, instance);
    return instance;
  }
  
  /**
   * Call an on-call agent
   */
  callOnCallAgent(agentId: string): OnCallAgent | null {
    return this.onCallAgents.get(agentId) || null;
  }
  
  /**
   * Get agent by designation
   */
  getAgentByDesignation(designation: string): NexusAgent | undefined {
    const agentsArray = Array.from(this.coreAgents.values());
    for (const agent of agentsArray) {
      if (agent.designation === designation) return agent;
    }
    return undefined;
  }
  
  /**
   * Get all core agents
   */
  getCoreAgents(): NexusAgent[] {
    return Array.from(this.coreAgents.values());
  }
  
  /**
   * Get all on-call agents
   */
  getOnCallAgents(): OnCallAgent[] {
    return Array.from(this.onCallAgents.values());
  }
  
  /**
   * Get agents by type
   */
  getAgentsByType(type: NexusAgent['type']): NexusAgent[] {
    return Array.from(this.coreAgents.values()).filter(a => a.type === type);
  }
  
  /**
   * Get on-call agents by category
   */
  getOnCallByCategory(category: string): OnCallAgent[] {
    return Array.from(this.onCallAgents.values()).filter(a => a.category === category);
  }
  
  /**
   * Get statistics
   */
  getStats(): {
    coreAgents: number;
    onCallAgents: number;
    activeInstances: number;
    totalUses: number;
    totalPathways: number;
  } {
    let totalUses = 0;
    const agentsArray = Array.from(this.coreAgents.values());
    for (const agent of agentsArray) {
      totalUses += agent.uses.internal.length;
      totalUses += agent.uses.sovereign.length;
      totalUses += agent.uses.partner.length;
      totalUses += agent.uses.enterprise.length;
      totalUses += agent.uses.public.length;
    }
    
    return {
      coreAgents: this.coreAgents.size,
      onCallAgents: this.onCallAgents.size,
      activeInstances: Array.from(this.instances.values()).filter(i => i.state === 'ACTIVE').length,
      totalUses,
      totalPathways: totalUses + this.onCallAgents.size,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const AGENT_CONSTANTS = {
  CORE_AGENT_COUNT: 40,
  ON_CALL_AGENT_COUNT: 100,
  
  USES_PER_LAYER: {
    INTERNAL: 3,
    SOVEREIGN: 3,
    PARTNER: 5,
    ENTERPRISE: 9,
    PUBLIC: 5,
  },
  
  TOTAL_USES_PER_AGENT: 3 + 3 + 5 + 9 + 5, // = 25
  
  // Grand total: 40 * 25 + 100 = 1100
  GRAND_TOTAL_PATHWAYS: 40 * 25 + 100,
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

let orchestratorInstance: NexusAgentOrchestrator | null = null;

export function getNexusAgentOrchestrator(): NexusAgentOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new NexusAgentOrchestrator();
  }
  return orchestratorInstance;
}

export default {
  CORE_AGENTS,
  ON_CALL_AGENTS,
  NexusAgentOrchestrator,
  getNexusAgentOrchestrator,
  AGENT_CONSTANTS,
};
