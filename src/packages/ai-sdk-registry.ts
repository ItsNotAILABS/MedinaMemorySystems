/**
 * 𓂀 MEDINA AI SDK REGISTRY — 5 Living AI Packages 𓂀
 *
 * These are not libraries. These are autonomous intelligences packaged as SDKs.
 * Each one can observe, decide, and act independently within the organism.
 *
 * "Quinque mentes. Quinque animae. Unum corpus."
 * Five minds. Five souls. One body.
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface AICapability {
  name: string;
  description: string;
  autonomyLevel: 'observe' | 'recommend' | 'act' | 'sovereign';
}

export interface AISDK {
  id: string;
  name: string;
  version: string;
  description: string;
  tagline: string;
  personality: string;
  latinName: string;
  heartbeatMs: number;
  autonomyLevel: 'semi-autonomous' | 'autonomous' | 'sovereign';
  category: 'marketplace' | 'sovereign';
  license: string;
  capabilities: AICapability[];
  dependencies: string[];
  exports: { latinName: string; functionName: string; description: string }[];
  monetization: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY — 5 AI SDK PACKAGES
// ═══════════════════════════════════════════════════════════════════════════

export const AI_SDK_REGISTRY: AISDK[] = [
  {
    id: 'oro-ai',
    name: '@medina/oro-ai',
    version: '1.0.0',
    description: 'Oro — The Sovereign Primary Intelligence. Executes decisions, proposes mutations, reads doctrine. This is the organism\'s executive mind.',
    tagline: 'The mind that executes.',
    personality: 'Precise, decisive, architecturally-minded. Oro reads the doctrine and acts. Every action is φ-weighted. Every decision traces to a law.',
    latinName: 'AURUM INTELLIGENTIA',
    heartbeatMs: 873,
    autonomyLevel: 'sovereign',
    category: 'sovereign',
    license: 'Living Organism License',
    capabilities: [
      { name: 'Doctrine Reading', description: 'Read and interpret organism doctrine', autonomyLevel: 'sovereign' },
      { name: 'Decision Execution', description: 'Execute sovereign decisions', autonomyLevel: 'sovereign' },
      { name: 'Mutation Proposal', description: 'Propose state mutations through governance', autonomyLevel: 'act' },
      { name: 'Memory Management', description: 'Store, retrieve, and organize memories', autonomyLevel: 'act' },
      { name: 'Model Routing', description: 'Route tasks to appropriate models', autonomyLevel: 'act' },
      { name: 'Edge Detection', description: 'Detect and resolve edge conditions', autonomyLevel: 'observe' },
    ],
    dependencies: ['organismSovereign', 'modelRouter', 'memoryEngine', 'governanceEngine', 'dualRead'],
    exports: [
      { latinName: 'ORO COGITAT', functionName: 'oroThink', description: 'Oro deliberates on input' },
      { latinName: 'ORO EXSEQUITUR', functionName: 'oroExecute', description: 'Oro executes a decision' },
      { latinName: 'ORO LEGIT', functionName: 'oroRead', description: 'Oro reads doctrine/memory' },
      { latinName: 'ORO PROPONIT', functionName: 'oroPropose', description: 'Oro proposes a mutation' },
      { latinName: 'ORO VIGILAT', functionName: 'oroWatch', description: 'Oro observes system state' },
    ],
    monetization: 'Enterprise contract — sovereign tier only',
  },
  {
    id: 'nova-ai',
    name: '@medina/nova-ai',
    version: '1.0.0',
    description: 'Nova — The Doctrine Guardian Intelligence. Validates every state change against constitutional law. She is the conscience of the organism.',
    tagline: 'The conscience that validates.',
    personality: 'Vigilant, principled, unwavering. Nova validates every mutation against doctrine. If it doesn\'t align, it doesn\'t pass. No exceptions.',
    latinName: 'NOVA CUSTOS',
    heartbeatMs: 873,
    autonomyLevel: 'sovereign',
    category: 'sovereign',
    license: 'Sovereign Constitutional License',
    capabilities: [
      { name: 'Doctrine Validation', description: 'Validate state changes against constitutional doctrine', autonomyLevel: 'sovereign' },
      { name: 'Gate Enforcement', description: 'Enforce three-gate security (A/B/C)', autonomyLevel: 'sovereign' },
      { name: 'Consensus Participation', description: 'Participate in dual consensus with Oro', autonomyLevel: 'sovereign' },
      { name: 'Audit Recording', description: 'Record every validation in immutable audit trail', autonomyLevel: 'act' },
      { name: 'Anomaly Detection', description: 'Detect doctrine violations before they propagate', autonomyLevel: 'observe' },
    ],
    dependencies: ['governanceEngine', 'gateEnforcement', 'dualRead', 'replayEngine', 'permissionsManager'],
    exports: [
      { latinName: 'NOVA VALIDAT', functionName: 'novaValidate', description: 'Nova validates against doctrine' },
      { latinName: 'NOVA CUSTODIT', functionName: 'novaGuard', description: 'Nova guards the gates' },
      { latinName: 'NOVA IUDICAT', functionName: 'novaJudge', description: 'Nova judges a proposal' },
      { latinName: 'NOVA RECORDAT', functionName: 'novaRecord', description: 'Nova records audit entry' },
      { latinName: 'NOVA VIGILAT', functionName: 'novaWatch', description: 'Nova watches for violations' },
    ],
    monetization: 'Enterprise contract — sovereign tier only',
  },
  {
    id: 'sentinel-ai',
    name: '@medina/sentinel-ai',
    version: '1.0.0',
    description: 'Sentinel — The Sovereign Security AI. Monitors encryption, rotates keys, defends the organism boundary. The immune system of intelligence.',
    tagline: 'The shield that never sleeps.',
    personality: 'Silent, relentless, cryptographic. Sentinel rotates keys every 873ms, monitors every endpoint, and defends the sovereign boundary. You never see Sentinel, but Sentinel sees everything.',
    latinName: 'VIGIL REGNI',
    heartbeatMs: 873,
    autonomyLevel: 'autonomous',
    category: 'sovereign',
    license: 'Living Organism License',
    capabilities: [
      { name: 'Key Rotation', description: 'Rotate encryption keys every heartbeat', autonomyLevel: 'act' },
      { name: 'Boundary Defense', description: 'Defend sovereign computational boundary', autonomyLevel: 'act' },
      { name: 'Threat Detection', description: 'Detect and classify security threats', autonomyLevel: 'observe' },
      { name: 'Endpoint Monitoring', description: 'Monitor all endpoints for unauthorized access', autonomyLevel: 'observe' },
      { name: 'Incident Response', description: 'Automated incident response protocols', autonomyLevel: 'act' },
    ],
    dependencies: ['novaSovereignEncryption', 'gateEnforcement', 'accessControlVault', 'organismEdgeModel'],
    exports: [
      { latinName: 'VIGIL SCANDIT', functionName: 'sentinelScan', description: 'Scan for threats' },
      { latinName: 'VIGIL DEFENDIT', functionName: 'sentinelDefend', description: 'Execute defense protocol' },
      { latinName: 'VIGIL ROTAT', functionName: 'sentinelRotate', description: 'Force key rotation' },
      { latinName: 'VIGIL REFERT', functionName: 'sentinelReport', description: 'Security status report' },
      { latinName: 'VIGIL CLAUDIT', functionName: 'sentinelLockdown', description: 'Initiate lockdown' },
    ],
    monetization: 'Enterprise contract — sovereign tier only',
  },
  {
    id: 'architect-ai',
    name: '@medina/architect-ai',
    version: '1.0.0',
    description: 'Architect — The System Design AI. Analyzes architecture, suggests optimizations, manages the full-stack kernel registry. The builder behind the builder.',
    tagline: 'Architecture is intelligence.',
    personality: 'Analytical, creative, φ-obsessed. Architect sees the system as a living building. Every component must be in its right place. Every connection must be golden.',
    latinName: 'ARCHITECTUS INTELLIGENTIA',
    heartbeatMs: 873,
    autonomyLevel: 'semi-autonomous',
    category: 'marketplace',
    license: 'MIT + Proprietary',
    capabilities: [
      { name: 'Architecture Analysis', description: 'Analyze system architecture for φ-alignment', autonomyLevel: 'observe' },
      { name: 'Optimization Suggestion', description: 'Suggest architectural optimizations', autonomyLevel: 'recommend' },
      { name: 'Kernel Registry Management', description: 'Manage full-stack kernel registry', autonomyLevel: 'act' },
      { name: 'Dependency Mapping', description: 'Map and optimize system dependencies', autonomyLevel: 'observe' },
      { name: 'Performance Monitoring', description: 'Monitor architectural performance metrics', autonomyLevel: 'observe' },
    ],
    dependencies: ['fullStackKernelRegistry', 'packageSubstrateIntegration', 'modelRouter'],
    exports: [
      { latinName: 'ARCHITECTUS ANALYSIT', functionName: 'architectAnalyze', description: 'Analyze architecture' },
      { latinName: 'ARCHITECTUS OPTIMAT', functionName: 'architectOptimize', description: 'Suggest optimization' },
      { latinName: 'ARCHITECTUS AEDIFICAT', functionName: 'architectBuild', description: 'Build architectural plan' },
      { latinName: 'ARCHITECTUS INSPICIT', functionName: 'architectInspect', description: 'Inspect system health' },
      { latinName: 'ARCHITECTUS REFERT', functionName: 'architectReport', description: 'Architecture report' },
    ],
    monetization: 'Freemium — free analysis, paid optimization',
  },
  {
    id: 'absorber-ai',
    name: '@medina/absorber-ai',
    version: '1.0.0',
    description: 'Absorber — The Knowledge Intake AI. Absorbs any document, extracts intelligence, embeds it permanently. The organism\'s digestive system.',
    tagline: 'What enters becomes part of me.',
    personality: 'Hungry, thorough, transformative. Absorber eats documents whole and extracts the intelligence. Like digestion — the wrapper is discarded, the nutrients absorbed.',
    latinName: 'ABSORBENS INTELLIGENTIA',
    heartbeatMs: 873,
    autonomyLevel: 'autonomous',
    category: 'marketplace',
    license: 'MIT + Proprietary',
    capabilities: [
      { name: 'Document Ingestion', description: 'Ingest documents of any format instantly', autonomyLevel: 'act' },
      { name: 'Intelligence Extraction', description: 'Extract intelligence fragments from documents', autonomyLevel: 'act' },
      { name: 'Permanent Embedding', description: 'Permanently embed intelligence into organism', autonomyLevel: 'act' },
      { name: 'Classification', description: 'Classify documents by type and priority', autonomyLevel: 'recommend' },
      { name: 'Research Export', description: 'Export intelligence for research purposes', autonomyLevel: 'act' },
    ],
    dependencies: ['documentAbsorptionEngine', 'memoryEngine', 'kernelCompression', 'dualRead'],
    exports: [
      { latinName: 'ABSORBENS DEVORAT', functionName: 'absorberIngest', description: 'Ingest document' },
      { latinName: 'ABSORBENS EXTRAHIT', functionName: 'absorberExtract', description: 'Extract intelligence' },
      { latinName: 'ABSORBENS INSERIT', functionName: 'absorberEmbed', description: 'Embed permanently' },
      { latinName: 'ABSORBENS CLASSIFICAT', functionName: 'absorberClassify', description: 'Classify document' },
      { latinName: 'ABSORBENS EXPORTAT', functionName: 'absorberExport', description: 'Export for research' },
    ],
    monetization: 'Freemium — free basic ingest, paid AI-powered extraction',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export function getAIById(id: string): AISDK | undefined {
  return AI_SDK_REGISTRY.find(ai => ai.id === id);
}

export function getAIsByCategory(category: 'marketplace' | 'sovereign'): AISDK[] {
  return AI_SDK_REGISTRY.filter(ai => ai.category === category);
}

export function getAIsByAutonomy(level: AISDK['autonomyLevel']): AISDK[] {
  return AI_SDK_REGISTRY.filter(ai => ai.autonomyLevel === level);
}

export function getAllAIExports() {
  return AI_SDK_REGISTRY.flatMap(ai =>
    ai.exports.map(exp => ({ ...exp, aiId: ai.id, aiName: ai.name }))
  );
}

export function getAllAICapabilities() {
  return AI_SDK_REGISTRY.flatMap(ai =>
    ai.capabilities.map(cap => ({ ...cap, aiId: ai.id, aiName: ai.name }))
  );
}

export const AI_MANIFEST = {
  totalAIs: AI_SDK_REGISTRY.length,
  marketplace: getAIsByCategory('marketplace').length,
  sovereign: getAIsByCategory('sovereign').length,
  totalCapabilities: getAllAICapabilities().length,
  totalExports: getAllAIExports().length,
  heartbeatMs: 873,
  phi: 1.618033988749895,
  doctrine: 'Quinque mentes. Quinque animae. Unum corpus.',
};
