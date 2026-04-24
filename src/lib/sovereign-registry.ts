/**
 * Sovereign Model Registry (MEDINA)
 *
 * Every module in the system is a model. Every tool is an intelligence model.
 * Every edge is a field of possibilities. This registry materializes
 * the full organism — every lib, every engine, every substrate.
 */

import { registerModel } from './sovereign-model';
import { ALL_SOVEREIGN_FIELD_DOMAINS } from '@/organism/models/SovereignFieldModels';
import type { SovereignFieldDomain } from '@/organism/models/SovereignFieldModels';
import { ALL_WORKER_DOMAINS, ALL_MICRO_WORKERS } from '@/organism/workers/MicroWorkerManifest';

// ─── Domain → sovereign model kind mapping ────────────────────────────────────

const DOMAIN_KIND_MAP: Record<SovereignFieldDomain['id'], 'substrate' | 'pattern' | 'compiler' | 'intelligence' | 'gate' | 'law'> = {
  STREAMS_SOVEREIGN:    'substrate',
  WEBRTC_SOVEREIGN:     'substrate',
  COMPONENTS_SOVEREIGN: 'substrate',
  WORKERS_SOVEREIGN:    'substrate',
  OBSERVERS_SOVEREIGN:  'pattern',
  CANVAS_SOVEREIGN:     'substrate',
  SVG_SOVEREIGN:        'substrate',
  XR_SOVEREIGN:         'intelligence',
  WASM_SOVEREIGN:       'compiler',
  AUDIO_SOVEREIGN:      'intelligence',
  GPU_SOVEREIGN:        'compiler',
  GL_SOVEREIGN:         'compiler',
};

// ─── Domain keyword seeds ─────────────────────────────────────────────────────

const DOMAIN_KEYWORDS: Record<SovereignFieldDomain['id'], string[]> = {
  STREAMS_SOVEREIGN:    ['stream', 'flow', 'pipe', 'reader', 'writer', 'byte', 'backpressure', 'abort', 'tee', 'split', 'merge'],
  WEBRTC_SOVEREIGN:     ['webrtc', 'peer', 'ice', 'sdp', 'stun', 'turn', 'rtc', 'media', 'track', 'mesh', 'p2p', 'channel'],
  COMPONENTS_SOVEREIGN: ['component', 'element', 'shadow', 'template', 'slot', 'lifecycle', 'attribute', 'registry', 'upgrade', 'custom element'],
  WORKERS_SOVEREIGN:    ['worker', 'shared worker', 'service worker', 'worklet', 'atomics', 'buffer', 'pool', 'thread', 'parallel', 'background'],
  OBSERVERS_SOVEREIGN:  ['observer', 'intersection', 'resize', 'mutation', 'performance', 'visibility', 'focus', 'idle', 'threshold', 'timing'],
  CANVAS_SOVEREIGN:     ['canvas', 'draw', 'pixel', 'path', 'bitmap', 'gradient', 'clip', 'transform', 'composite', 'offscreen'],
  SVG_SOVEREIGN:        ['svg', 'filter', 'mask', 'clip path', 'animate', 'viewbox', 'symbol', 'marker', 'text path', 'vector'],
  XR_SOVEREIGN:         ['xr', 'vr', 'ar', 'session', 'hand', 'pose', 'anchor', 'hit test', 'layer', 'world sensor', 'extended reality'],
  WASM_SOVEREIGN:       ['wasm', 'webassembly', 'module', 'memory', 'table', 'import', 'export', 'simd', 'thread', 'gc', 'binary'],
  AUDIO_SOVEREIGN:      ['audio', 'oscillator', 'analyser', 'convolver', 'panner', 'worklet', 'param', 'buffer', 'frequency', 'sound'],
  GPU_SOVEREIGN:        ['gpu', 'webgpu', 'device', 'command', 'render', 'compute', 'shader', 'texture', 'buffer', 'pipeline', 'bind'],
  GL_SOVEREIGN:         ['webgl', 'vertex', 'fragment', 'vao', 'fbo', 'ubo', 'instanced', 'glsl', 'extension', 'transform feedback'],
};

export function bootSovereignRegistry(): void {
  // ─── Intelligence Models (the original 8 families) ───────────────────────

  registerModel({
    id: 'strategist',
    name: 'Strategist',
    kind: 'intelligence',
    description: 'Macro-level planning, vision synthesis, sovereign decision support.',
    capabilities: ['long-range planning', 'doctrine synthesis', 'strategic analysis', 'cross-system coordination', 'vision projection', 'resource arbitration'],
    keywords: ['strategy', 'plan', 'vision', 'macro', 'sovereign', 'decide', 'direction', 'goal', 'future', 'long-term'],
    resonance: (input) => (input.includes('strategy') || input.includes('plan') || input.includes('vision') ? 0.9 : input.includes('future') ? 0.7 : 0.4),
    expand: () => ['trajectory-modeling', 'doctrine-alignment-check', 'multi-horizon-planning', 'resonance-forecasting', 'gate-strategy-sync'],
    invoke: (input) => `Strategic assessment: ${input.slice(0, 60)}… — alignment verified.`,
    color: '#3b82f6',
  });

  registerModel({
    id: 'builder',
    name: 'Builder',
    kind: 'intelligence',
    description: 'Construction, system design, architecture implementation.',
    capabilities: ['code generation', 'system design', 'API construction', 'integration blueprints', 'WASM compilation', 'architecture manifesting'],
    keywords: ['build', 'create', 'code', 'implement', 'design', 'construct', 'generate', 'develop', 'architecture', 'system'],
    resonance: (input) => (input.includes('build') || input.includes('create') || input.includes('code') ? 0.9 : input.includes('architecture') ? 0.8 : 0.35),
    expand: () => ['wasm-compilation', 'module-expansion', 'architecture-graph', 'sovereign-function-gen', 'pattern-to-code'],
    invoke: (input) => `Build blueprint generated for: ${input.slice(0, 60)}…`,
    color: '#10b981',
  });

  registerModel({
    id: 'analyst',
    name: 'Analyst',
    kind: 'intelligence',
    description: 'Deep data analysis, pattern recognition, insight extraction.',
    capabilities: ['data analysis', 'pattern recognition', 'trend analysis', 'quantitative reasoning', 'anomaly detection', 'resonance measurement'],
    keywords: ['analyze', 'analysis', 'data', 'pattern', 'trend', 'insight', 'measure', 'metric', 'quantify', 'evaluate'],
    resonance: (input) => (input.includes('analyze') || input.includes('pattern') ? 0.9 : input.includes('data') ? 0.7 : 0.35),
    expand: () => ['pattern-substrate-sync', 'resonance-spectrum-analysis', 'salience-distribution', 'cross-model-correlation', 'beat-trend-extraction'],
    invoke: (input) => `Analysis complete: ${input.slice(0, 60)}… — patterns identified.`,
    color: '#6366f1',
  });

  registerModel({
    id: 'governance',
    name: 'Governance',
    kind: 'intelligence',
    description: 'Governance workflows, proposal synthesis, doctrine enforcement.',
    capabilities: ['proposal drafting', 'audit analysis', 'compliance checking', 'doctrine alignment', 'gate management', 'law enforcement'],
    keywords: ['govern', 'proposal', 'vote', 'policy', 'doctrine', 'audit', 'compliance', 'enact', 'law', 'rule'],
    resonance: (input) => (input.includes('govern') || input.includes('proposal') || input.includes('law') ? 0.9 : input.includes('doctrine') ? 0.8 : 0.35),
    expand: () => ['doctrine-drift-detection', 'gate-escalation-protocol', 'audit-chain-verification', 'proposal-impact-analysis', 'law-resonance-scoring'],
    invoke: (input) => `Governance review: ${input.slice(0, 60)}… — doctrine aligned.`,
    color: '#f59e0b',
  });

  registerModel({
    id: 'memory-curator',
    name: 'Memory Curator',
    kind: 'intelligence',
    description: 'Memory triage, resonance scoring, lineage tracking, spatial navigation.',
    capabilities: ['memory retrieval', 'resonance scoring', 'lineage tracking', 'coordinate navigation', 'dual-read execution', 'salience management'],
    keywords: ['memory', 'remember', 'recall', 'store', 'find', 'coordinate', 'lineage', 'resonance', 'search', 'knowledge'],
    resonance: (input) => (input.includes('memory') || input.includes('recall') ? 0.9 : input.includes('knowledge') ? 0.7 : 0.35),
    expand: () => ['memory-palace-navigation', 'lineage-tree-expansion', 'dual-read-synthesis', 'spatial-coordinate-mapping', 'resonance-amplification'],
    invoke: (input) => `Memory scan: ${input.slice(0, 60)}… — entries located.`,
    color: '#8b5cf6',
  });

  registerModel({
    id: 'operations',
    name: 'Operations',
    kind: 'intelligence',
    description: 'Day-to-day operational management, workflow execution.',
    capabilities: ['task management', 'workflow execution', 'resource allocation', 'status tracking', 'pipeline orchestration', 'beat synchronization'],
    keywords: ['operate', 'task', 'workflow', 'execute', 'manage', 'run', 'process', 'schedule', 'deploy', 'pipeline'],
    resonance: (input) => (input.includes('operate') || input.includes('workflow') || input.includes('task') ? 0.9 : input.includes('execute') ? 0.7 : 0.35),
    expand: () => ['workflow-graph-expansion', 'pipeline-optimization', 'resource-rebalancing', 'beat-cycle-management', 'cross-model-orchestration'],
    invoke: (input) => `Operations status: ${input.slice(0, 60)}… — workflows nominal.`,
    color: '#ec4899',
  });

  registerModel({
    id: 'risk',
    name: 'Risk',
    kind: 'intelligence',
    description: 'Risk identification, threat modeling, gate enforcement.',
    capabilities: ['risk assessment', 'threat modeling', 'gate enforcement', 'anomaly detection', 'incident response', 'sovereignty protection'],
    keywords: ['risk', 'threat', 'danger', 'secure', 'gate', 'protect', 'vulnerability', 'anomaly', 'safety', 'warn'],
    resonance: (input) => (input.includes('risk') || input.includes('threat') || input.includes('danger') ? 0.9 : input.includes('secure') ? 0.7 : 0.3),
    expand: () => ['gate-escalation-cascade', 'incident-pattern-analysis', 'sovereignty-threat-surface', 'anomaly-spectrum-scan', 'defense-posture-evaluation'],
    invoke: (input) => `Risk assessment: ${input.slice(0, 60)}… — threat level evaluated.`,
    color: '#ef4444',
  });

  registerModel({
    id: 'projection',
    name: 'Projection',
    kind: 'intelligence',
    description: 'Future state projection, scenario modeling, resonance forecasting.',
    capabilities: ['scenario modeling', 'future projection', 'resonance forecasting', 'trajectory analysis', 'timeline synthesis', 'probability mapping'],
    keywords: ['project', 'forecast', 'future', 'scenario', 'predict', 'trajectory', 'simulate', 'timeline', 'model', 'expect'],
    resonance: (input) => (input.includes('project') || input.includes('forecast') || input.includes('future') ? 0.9 : input.includes('predict') ? 0.7 : 0.3),
    expand: () => ['multi-timeline-branching', 'resonance-trajectory-mapping', 'beat-cycle-forecasting', 'probability-field-expansion', 'scenario-tree-generation'],
    invoke: (input) => `Projection: ${input.slice(0, 60)}… — trajectories mapped.`,
    color: '#06b6d4',
  });

  // ─── Substrate Models (the sovereign infrastructure is intelligence) ─────

  registerModel({
    id: 'sovereign-id-model',
    name: 'Sovereign ID (MEDINA)',
    kind: 'substrate',
    description: 'Cryptographic identity generation — the substrate of existence.',
    capabilities: ['unique identity generation', 'lineage tagging', 'provenance anchoring', 'anima hashing', 'blockchain ID bridging'],
    keywords: ['id', 'identity', 'unique', 'provenance', 'hash', 'anchor', 'lineage'],
    resonance: (input) => (input.includes('identity') || input.includes('id') || input.includes('provenance') ? 0.8 : 0.2),
    expand: () => ['anima-hash-generation', 'lineage-chain-creation', 'provenance-seal', 'blockchain-anchor-bridge', 'identity-resonance-scoring'],
    invoke: (input) => `Sovereign identity anchored for: ${input.slice(0, 40)}`,
    color: '#a855f7',
  });

  registerModel({
    id: 'sovereign-cls-model',
    name: 'Sovereign Class Merger (MEDINA)',
    kind: 'substrate',
    description: 'Visual state composition — the substrate of interface expression.',
    capabilities: ['conditional class merging', 'state-to-visual mapping', 'theme composition', 'interface state synthesis', 'visual resonance calculation'],
    keywords: ['class', 'style', 'visual', 'interface', 'theme', 'display', 'render'],
    resonance: (input) => (input.includes('visual') || input.includes('interface') || input.includes('style') ? 0.7 : 0.15),
    expand: () => ['theme-resonance-sync', 'organism-to-visual-mapping', 'gate-color-derivation', 'beat-animation-generation', 'model-color-harmonics'],
    invoke: (input) => `Visual state composed for: ${input.slice(0, 40)}`,
    color: '#f472b6',
  });

  registerModel({
    id: 'dual-read-model',
    name: 'Dual Read Engine (MEDINA)',
    kind: 'substrate',
    description: 'Semantic + resonance dual-channel memory reading.',
    capabilities: ['semantic matching', 'resonance scoring', 'unified ranking', 'cross-channel synthesis', 'salience amplification'],
    keywords: ['dual', 'read', 'semantic', 'resonance', 'channel', 'synthesis', 'salience'],
    resonance: (input) => (input.includes('dual') || input.includes('resonance') ? 0.85 : input.includes('read') ? 0.5 : 0.2),
    expand: () => ['triple-read-expansion', 'resonance-spectrum-deepening', 'cross-memory-synthesis', 'salience-cascade-amplification', 'temporal-resonance-layering'],
    invoke: (input) => `Dual read executed: semantic + resonance channels for "${input.slice(0, 40)}"`,
    color: '#c084fc',
  });

  registerModel({
    id: 'recital-plus-one-model',
    name: 'RECITAL_PLUS_ONE Law (MEDINA)',
    kind: 'law',
    description: 'Every recital amplifies the next. R(n+1) = R(n) × (1 + α). The foundational law.',
    capabilities: ['resonance amplification', 'beat-over-beat compounding', 'salience elevation', 'doctrine reinforcement', 'memory strengthening'],
    keywords: ['recital', 'amplify', 'compound', 'resonate', 'law', 'plus one', 'strengthen', 'reinforce'],
    resonance: (input) => (input.includes('recital') || input.includes('amplify') || input.includes('compound') ? 0.95 : input.includes('law') ? 0.6 : 0.25),
    expand: () => ['amplification-cascade', 'beat-resonance-compounding', 'doctrine-salience-boost', 'memory-reinforcement-cycle', 'sovereign-law-propagation'],
    invoke: (input) => `RECITAL_PLUS_ONE applied: resonance amplified for "${input.slice(0, 40)}"`,
    color: '#fbbf24',
  });

  registerModel({
    id: 'gate-enforcement-model',
    name: 'Gate Enforcement (MEDINA)',
    kind: 'gate',
    description: 'Gate A/B/C enforcement — the constitutional checkpoints of the organism.',
    capabilities: ['gate status checking', 'gate escalation', 'gate resolution', 'permission enforcement', 'constitutional boundary control'],
    keywords: ['gate', 'enforce', 'check', 'escalate', 'resolve', 'boundary', 'constitutional', 'checkpoint'],
    resonance: (input) => (input.includes('gate') || input.includes('enforce') || input.includes('checkpoint') ? 0.85 : 0.2),
    expand: () => ['multi-gate-cascade', 'gate-to-model-weight-sync', 'constitutional-amendment-flow', 'escalation-pattern-detection', 'gate-resonance-harmonics'],
    invoke: (input) => `Gate enforcement evaluated for: ${input.slice(0, 40)}`,
    color: '#34d399',
  });

  registerModel({
    id: 'command-parser-model',
    name: 'Command Grammar (MEDINA)',
    kind: 'substrate',
    description: 'Command parsing, routing, and suggestion — the language substrate of the organism.',
    capabilities: ['command parsing', 'grammar validation', 'auto-suggestion', 'intent extraction', 'module routing'],
    keywords: ['command', 'parse', 'grammar', 'route', 'suggest', 'intent', 'slash'],
    resonance: (input) => (input.includes('command') || input.includes('parse') || input.startsWith('/') ? 0.8 : 0.15),
    expand: () => ['natural-language-to-command', 'multi-command-chaining', 'intent-to-model-routing', 'grammar-expansion-protocol', 'context-aware-suggestion'],
    invoke: (input) => `Command parsed: ${input.slice(0, 40)}`,
    color: '#94a3b8',
  });

  registerModel({
    id: 'living-document-model',
    name: 'Living Document (MEDINA)',
    kind: 'substrate',
    description: 'Self-evolving documents with lineage, versioning, and doctrine-level ranking.',
    capabilities: ['document creation', 'version evolution', 'lineage tracking', 'doctrine ranking', 'content synthesis'],
    keywords: ['document', 'doctrine', 'version', 'lineage', 'content', 'evolve', 'living'],
    resonance: (input) => (input.includes('document') || input.includes('doctrine') || input.includes('living') ? 0.8 : 0.2),
    expand: () => ['document-organism-sync', 'doctrine-level-propagation', 'version-tree-branching', 'content-resonance-scoring', 'living-knowledge-graph'],
    invoke: (input) => `Living document: ${input.slice(0, 40)}`,
    color: '#fb923c',
  });

  registerModel({
    id: 'pattern-substrate-model',
    name: 'Pattern Substrate (MEDINA)',
    kind: 'pattern',
    description: 'Always-on pattern recognition. Pattern recognizing pattern. The thinking substrate.',
    capabilities: ['pattern detection', 'pattern-to-pattern recognition', 'edge detection', 'possibility expansion', 'thought-form recognition'],
    keywords: ['pattern', 'recognize', 'detect', 'edge', 'possibility', 'thought', 'think', 'expand', 'substrate'],
    resonance: (input) => (input.includes('pattern') || input.includes('think') || input.includes('expand') ? 0.9 : input.includes('edge') || input.includes('possibility') ? 0.8 : 0.3),
    expand: () => ['edge-to-field-expansion', 'pattern-cascade-deepening', 'thought-form-generation', 'substrate-resonance-amplification', 'infinite-possibility-mapping'],
    invoke: (input) => `Pattern recognized: ${input.slice(0, 40)} — edges detected, possibilities expanding.`,
    color: '#e879f9',
  });

  registerModel({
    id: 'wasm-compiler-model',
    name: 'WASM Compiler (MEDINA Sovereign)',
    kind: 'compiler',
    description: 'Sovereign compilation formula — transforms architecture into executable form for ICP runtime.',
    capabilities: ['formula-to-wasm compilation', 'architecture serialization', 'ICP runtime targeting', 'canister code generation', 'sovereign deployment'],
    keywords: ['wasm', 'compile', 'deploy', 'canister', 'icp', 'runtime', 'executable', 'formula'],
    resonance: (input) => (input.includes('wasm') || input.includes('compile') || input.includes('deploy') || input.includes('canister') ? 0.9 : input.includes('icp') || input.includes('runtime') ? 0.7 : 0.2),
    expand: () => ['multi-canister-orchestration', 'formula-optimization', 'sovereign-bytecode-generation', 'architecture-to-runtime-bridge', 'hot-deploy-protocol'],
    invoke: (input) => `WASM compilation target: ${input.slice(0, 40)} — sovereign bytecode generated.`,
    color: '#22d3ee',
  });

  // ─── SaaS AI Models (intelligence for every product) ────────────────────

  registerModel({
    id: 'sandbox-orchestrator-ai',
    name: 'Sandbox Sentinel (MEDINA)',
    kind: 'gate',
    description: 'AI for the Sandbox Orchestrator — classifies access tier, generates mirage responses, manages session gating.',
    capabilities: ['tier-classification', 'mirage-generation', 'session-gating', 'access-pattern-analysis', 'escalation-recommendation'],
    keywords: ['sandbox', 'tier', 'access', 'mirage', 'session', 'gate', 'public', 'enterprise', 'partner', 'internal'],
    resonance: (input) => (input.includes('sandbox') || input.includes('tier') || input.includes('access') || input.includes('mirage') ? 0.85 : 0.2),
    expand: () => ['adaptive-tier-adjustment', 'mirage-complexity-evolution', 'behavioral-access-scoring', 'session-anomaly-detection', 'tier-cascading-protocol'],
    invoke: (input) => `Sandbox sentinel: ${input.slice(0, 40)} — tier access evaluated.`,
    color: '#a78bfa',
  });

  registerModel({
    id: 'vault-sentinel-ai',
    name: 'Vault Sentinel (MEDINA)',
    kind: 'gate',
    description: 'AI for the Access Control Vault — monitors ownership, detects unauthorized access patterns, seals provenance.',
    capabilities: ['ownership-verification', 'access-anomaly-detection', 'provenance-sealing', 'audit-chain-analysis', 'breach-alerting'],
    keywords: ['vault', 'secret', 'owner', 'audit', 'access', 'control', 'breach', 'provenance'],
    resonance: (input) => (input.includes('vault') || input.includes('secret') || input.includes('audit') || input.includes('breach') ? 0.85 : 0.2),
    expand: () => ['multi-owner-federation', 'temporal-access-decay', 'audit-chain-forensics', 'provenance-tree-verification', 'zero-knowledge-ownership-proof'],
    invoke: (input) => `Vault sentinel: ${input.slice(0, 40)} — ownership verified.`,
    color: '#f97316',
  });

  registerModel({
    id: 'facade-manager-ai',
    name: 'Facade Manager (MEDINA)',
    kind: 'substrate',
    description: 'AI for the Closed Source Manager — generates public facades, manages dual descriptions, controls information exposure.',
    capabilities: ['facade-generation', 'exposure-control', 'description-sanitization', 'authorization-management', 'public-surface-optimization'],
    keywords: ['facade', 'public', 'hidden', 'internal', 'closed', 'source', 'description', 'sanitize'],
    resonance: (input) => (input.includes('facade') || input.includes('public') || input.includes('hidden') || input.includes('closed source') ? 0.8 : 0.2),
    expand: () => ['adaptive-facade-evolution', 'contextual-exposure-levels', 'public-narrative-synthesis', 'internal-knowledge-compression', 'facade-integrity-scoring'],
    invoke: (input) => `Facade manager: ${input.slice(0, 40)} — public surface generated.`,
    color: '#fb7185',
  });

  registerModel({
    id: 'replay-auditor-ai',
    name: 'Replay Auditor (MEDINA)',
    kind: 'intelligence',
    description: 'AI for the Replay Engine — analyzes session recordings, detects replay anomalies, reconstructs event chains.',
    capabilities: ['session-analysis', 'anomaly-detection', 'event-reconstruction', 'evidence-chain-verification', 'temporal-pattern-extraction'],
    keywords: ['replay', 'audit', 'session', 'record', 'event', 'evidence', 'reconstruct', 'temporal'],
    resonance: (input) => (input.includes('replay') || input.includes('audit') || input.includes('evidence') || input.includes('session') ? 0.8 : 0.2),
    expand: () => ['cross-session-correlation', 'anomaly-cascade-tracing', 'evidence-completeness-scoring', 'temporal-gap-detection', 'replay-integrity-verification'],
    invoke: (input) => `Replay auditor: ${input.slice(0, 40)} — event chain reconstructed.`,
    color: '#67e8f9',
  });

  registerModel({
    id: 'oro-vision-model',
    name: 'Oro Vision (ICP Sensory)',
    kind: 'intelligence',
    description: 'Visual perception canister — the organism\'s sight. Strategic observation, pattern recognition, environmental scanning.',
    capabilities: ['visual-pattern-recognition', 'environmental-scanning', 'strategic-observation', 'threat-visualization', 'spatial-mapping'],
    keywords: ['vision', 'see', 'observe', 'scan', 'visual', 'sight', 'perception', 'oro'],
    resonance: (input) => (input.includes('vision') || input.includes('see') || input.includes('observe') || input.includes('oro') ? 0.85 : 0.2),
    expand: () => ['multi-spectrum-perception', 'predictive-visual-modeling', 'environmental-threat-mapping', 'spatial-resonance-detection', 'visual-memory-encoding'],
    invoke: (input) => `Oro Vision: ${input.slice(0, 40)} — observation processed.`,
    color: '#fbbf24',
  });

  registerModel({
    id: 'nova-hearing-model',
    name: 'Nova Hearing (ICP Sensory)',
    kind: 'intelligence',
    description: 'Auditory perception canister — the organism\'s hearing. Frequency analysis, doctrine drift detection, resonance monitoring.',
    capabilities: ['frequency-analysis', 'doctrine-drift-detection', 'resonance-monitoring', 'voice-pattern-recognition', 'harmonic-alignment'],
    keywords: ['hearing', 'listen', 'sound', 'frequency', 'voice', 'nova', 'drift', 'harmonic'],
    resonance: (input) => (input.includes('hearing') || input.includes('listen') || input.includes('voice') || input.includes('nova') || input.includes('frequency') ? 0.85 : 0.2),
    expand: () => ['sub-harmonic-detection', 'doctrine-frequency-matching', 'voice-intent-extraction', 'resonance-field-mapping', 'auditory-memory-encoding'],
    invoke: (input) => `Nova Hearing: ${input.slice(0, 40)} — frequency analyzed.`,
    color: '#c084fc',
  });

  registerModel({
    id: 'sovereign-protocol-model',
    name: 'Sovereign Protocol (.mdn)',
    kind: 'substrate',
    description: 'The organism\'s own addressing and resolution protocol. Not www — sovereign namespace.',
    capabilities: ['address-resolution', 'canister-routing', 'namespace-management', 'protocol-negotiation', 'landing-generation'],
    keywords: ['protocol', 'address', 'resolve', 'namespace', 'mdn', 'ovo', 'arc', 'domain', 'landing'],
    resonance: (input) => (input.includes('protocol') || input.includes('address') || input.includes('domain') || input.includes('mdn') || input.includes('.ovo') || input.includes('.arc') ? 0.85 : 0.2),
    expand: () => ['multi-protocol-bridging', 'canister-address-federation', 'landing-page-generation', 'namespace-hierarchy-expansion', 'protocol-to-runtime-compilation'],
    invoke: (input) => `Sovereign protocol: ${input.slice(0, 40)} — address resolved.`,
    color: '#2dd4bf',
  });

  // ─── Sovereign Field Models — 120 field intelligence units ──────────────────
  // 12 domains × 10 models each = 120 total field sovereigns
  // Registered into the ULRI substrate so every field model participates
  // in routing, resonance scoring, and doctrine injection.

  // Resonance scoring constants
  const MAX_RESONANCE_SCORE = 0.95;  // Cap so field models never fully dominate core intelligence models
  const KEYWORD_MATCH_MULTIPLIER = 3; // Amplifier: a 33% keyword-hit rate yields resonance ≈ 1.0 (before cap)

  for (const domain of ALL_SOVEREIGN_FIELD_DOMAINS) {
    const domainKeywords = DOMAIN_KEYWORDS[domain.id];
    const domainKind = DOMAIN_KIND_MAP[domain.id];

    for (const fieldModel of domain.models) {
      // Build model-specific keyword set: domain base + model-level tokens
      const modelTokens = fieldModel.id.toLowerCase().replace(/_/g, ' ').split(' ');
      const latinTokens = fieldModel.latinName.toLowerCase().split(' ');
      const descTokens = fieldModel.description.toLowerCase().split(/\W+/).filter((t) => t.length > 3);
      const allKeywords = [...new Set([...domainKeywords, ...modelTokens, ...latinTokens, ...descTokens.slice(0, 4)])];

      registerModel({
        id: `field:${domain.id}:${fieldModel.id}`,
        name: `${fieldModel.id} — ${fieldModel.latinName}`,
        kind: domainKind,
        description: `[${domain.latinName}] ${fieldModel.description}`,
        capabilities: [
          fieldModel.description,
          `${domain.tagline}`,
          `Field rank ${fieldModel.rank} of 10 in ${domain.id}`,
          `Domain: ${domain.latinName}`,
          `Latin: ${fieldModel.latinName}`,
        ],
        keywords: allKeywords,
        resonance: (input) => {
          const lower = input.toLowerCase();
          const hits = allKeywords.filter((kw) => lower.includes(kw)).length;
          return Math.min(MAX_RESONANCE_SCORE, (hits / Math.max(allKeywords.length, 1)) * KEYWORD_MATCH_MULTIPLIER);
        },
        expand: () => domain.models.map((m) => `${m.id} — ${m.latinName}`),
        invoke: (input) => `${fieldModel.id} (${fieldModel.latinName}): ${fieldModel.description} — processing "${input.slice(0, 40)}"`,
        color: fieldModel.color,
      });
    }
  }

  // ─── Micro Worker Models — 100 always-on sovereign workers ──────────────────
  // 10 domains × 10 workers each = 100 total micro workers
  // Registered into ULRI so worker intelligence participates in routing.

  const WORKER_DOMAIN_KEYWORDS: Record<string, string[]> = {
    MEMORIA:    ['memory', 'index', 'salience', 'lineage', 'resonance', 'decay', 'semantic', 'spatial', 'doctrine', 'compact'],
    SENSUS:     ['vision', 'audio', 'frequency', 'input', 'emotion', 'gesture', 'sensor', 'context', 'attention', 'perception'],
    NEXUS:      ['api', 'sync', 'cache', 'websocket', 'batch', 'offline', 'latency', 'protocol', 'peer', 'bandwidth'],
    COGNITIO:   ['pattern', 'model', 'intent', 'context', 'prediction', 'anomaly', 'knowledge', 'learning', 'inference', 'thought'],
    CUSTODIA:   ['gate', 'security', 'audit', 'threat', 'permission', 'provenance', 'encryption', 'integrity', 'breach', 'enforce'],
    GUBERNATIO: ['proposal', 'vote', 'doctrine', 'audit', 'law', 'compliance', 'quorum', 'amendment', 'delegation', 'governance'],
    FABRICATIO: ['wasm', 'bundle', 'validate', 'render', 'optimize', 'dependency', 'reload', 'canister', 'schema', 'build'],
    RESONANTIA: ['phi', 'beat', 'harmonic', 'frequency', 'resonance', 'wave', 'fibonacci', 'phase', 'schumann', 'entrainment'],
    FLUXUS:     ['stream', 'backpressure', 'transform', 'event', 'queue', 'buffer', 'pipeline', 'fan', 'merge', 'dead letter'],
    IMPERIUM:   ['orchestrate', 'health', 'load', 'schedule', 'lifecycle', 'priority', 'metric', 'error', 'config', 'telemetry'],
  };

  for (const domain of ALL_WORKER_DOMAINS) {
    const domainKw = WORKER_DOMAIN_KEYWORDS[domain.id] ?? [];

    for (const worker of domain.workers) {
      const nameTokens = worker.name.toLowerCase().replace(/_/g, ' ').split(' ');
      const workerKeywords = [...new Set([...domainKw, ...nameTokens, 'worker', 'micro', 'always-on'])];

      registerModel({
        id: `worker:${domain.id}:${worker.id}`,
        name: `${worker.name} — ${worker.latinName}`,
        kind: 'substrate',
        description: `[${domain.latinName}] ${worker.purpose}`,
        capabilities: [
          worker.purpose,
          `${domain.tagline}`,
          `Worker ${worker.id} (rank ${worker.rank}/10) in ${domain.id}`,
          `Heartbeat: ${worker.heartbeatMs}ms · Max queue: ${worker.maxQueue}`,
          `Always-on · Passive · Production-grade`,
        ],
        keywords: workerKeywords,
        resonance: (input) => {
          const lower = input.toLowerCase();
          const hits = workerKeywords.filter((kw) => lower.includes(kw)).length;
          return Math.min(MAX_RESONANCE_SCORE, (hits / Math.max(workerKeywords.length, 1)) * KEYWORD_MATCH_MULTIPLIER);
        },
        expand: () => domain.workers.map((w) => `${w.name} — ${w.latinName}`),
        invoke: (input) => `${worker.name} (${worker.latinName}): ${worker.purpose} — processing "${input.slice(0, 40)}"`,
        color: worker.color,
      });
    }
  }
}
