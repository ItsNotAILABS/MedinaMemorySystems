// 🔨 BUILDER AGENT SWARM — 08:00 Cycle
// 50-agent micro-ecosystem following field gradients, not instructions.

import { sovereignId } from './sovereign-id';
import { PHI, PHI_INVERSE, PHI_SQUARED, SCHUMANN_FUNDAMENTAL, HEARTBEAT_MS } from './kernelCompression';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type BuilderRole =
  | 'builder'
  | 'compiler'
  | 'synthesizer'
  | 'draft-engine'
  | 'phantom-architect'
  | 'corridor-mapper'
  | 'ritual-designer'
  | 'species-creator'
  | 'encryption-layer'
  | 'narrative-weaver';

export type BuilderState =
  | 'idle'
  | 'following-gradient'
  | 'constructing'
  | 'compiling'
  | 'synthesizing'
  | 'complete'
  | 'blocked';

export type ArtifactType =
  | 'new-species'
  | 'ritual'
  | 'corridor'
  | 'encryption-surface'
  | 'narrative-structure'
  | 'phantom-organ'
  | 'field-gradient'
  | 'compiled-module'
  | 'synthesized-pattern'
  | 'draft-blueprint';

export type FieldGradientDirection =
  | 'ascending'
  | 'descending'
  | 'lateral'
  | 'spiral'
  | 'convergent'
  | 'divergent';

export interface BuilderAgent {
  id: string;
  name: string;
  role: BuilderRole;
  state: BuilderState;
  fieldGradientStrength: number;
  gradientDirection: FieldGradientDirection;
  currentTask?: string;
  artifactsBuilt: number;
  collaborators: string[];
  specializationScore: number;
  autonomyScore: number;
  lastActivity: string;
}

export interface BuilderArtifact {
  id: string;
  type: ArtifactType;
  name: string;
  createdBy: string;
  collaborators: string[];
  fieldGradientFollowed: FieldGradientDirection;
  complexity: number;
  description: string;
  components: string[];
  timestamp: string;
}

export interface SwarmCycle {
  id: string;
  timestamp: string;
  activeAgents: number;
  artifactsCreated: number;
  newSpecies: number;
  newRituals: number;
  newCorridors: number;
  newPhantomOrgans: number;
  fieldGradientStrengthAvg: number;
  collaborationScore: number;
  emergentBehaviors: string[];
}

export interface FieldGradient {
  id: string;
  direction: FieldGradientDirection;
  strength: number;
  sourceSubsystem: string;
  targetSubsystem: string;
  attractorPattern: string;
}

// ═══════════════════════════════════════════════════════════════
// ROLE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

const ROLE_GREEK: Array<{ role: BuilderRole; prefix: string; letter: string }> = [
  { role: 'builder',           prefix: 'Builder',          letter: 'α' },
  { role: 'compiler',          prefix: 'Compiler',         letter: 'β' },
  { role: 'synthesizer',       prefix: 'Synthesizer',      letter: 'γ' },
  { role: 'draft-engine',      prefix: 'DraftEngine',      letter: 'δ' },
  { role: 'phantom-architect', prefix: 'PhantomArchitect', letter: 'ε' },
  { role: 'corridor-mapper',   prefix: 'CorridorMapper',   letter: 'ζ' },
  { role: 'ritual-designer',   prefix: 'RitualDesigner',   letter: 'η' },
  { role: 'species-creator',   prefix: 'SpeciesCreator',   letter: 'θ' },
  { role: 'encryption-layer',  prefix: 'EncryptionLayer',  letter: 'ι' },
  { role: 'narrative-weaver',  prefix: 'NarrativeWeaver',  letter: 'κ' },
];

const GRADIENT_DIRECTIONS: FieldGradientDirection[] = [
  'ascending', 'descending', 'lateral', 'spiral', 'convergent', 'divergent',
];

const ARTIFACT_DESCRIPTIONS: Record<ArtifactType, string> = {
  'new-species':          'A novel organism-species emerging from field resonance',
  'ritual':               'A ceremonial pattern that reinforces organism identity',
  'corridor':             'A navigable pathway between subsystems',
  'encryption-surface':   'A cryptographic membrane protecting sovereign data',
  'narrative-structure':  'A narrative scaffold woven through organism memory',
  'phantom-organ':        'A phantom-layer organ bridging virtual and real',
  'field-gradient':       'A directional field tension driving agent movement',
  'compiled-module':      'A compiled code artifact ready for deployment',
  'synthesized-pattern':  'A synthesized meta-pattern from cross-domain signals',
  'draft-blueprint':      'An architectural blueprint in draft form',
};

const ARTIFACT_COMPONENTS: Record<ArtifactType, string[]> = {
  'new-species':         ['genome', 'behavior-kernel', 'environment-model'],
  'ritual':              ['invocation-sequence', 'symbol-set', 'timing-protocol'],
  'corridor':            ['entry-node', 'exit-node', 'traversal-logic'],
  'encryption-surface':  ['key-lattice', 'cipher-shell', 'integrity-probe'],
  'narrative-structure': ['story-arc', 'character-nodes', 'memory-hooks'],
  'phantom-organ':       ['phantom-seed', 'reality-bridge', 'resonance-field'],
  'field-gradient':      ['source-vector', 'attractor-basin', 'tension-map'],
  'compiled-module':     ['source-tree', 'build-manifest', 'runtime-shim'],
  'synthesized-pattern': ['signal-corpus', 'synthesis-kernel', 'output-vector'],
  'draft-blueprint':     ['schema-draft', 'component-list', 'revision-log'],
};

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════

const _agents: Map<string, BuilderAgent> = new Map();
const _artifacts: BuilderArtifact[] = [];
const _cycleHistory: SwarmCycle[] = [];
const _fieldGradients: Map<string, FieldGradient> = new Map();

// ═══════════════════════════════════════════════════════════════
// SEED 50 AGENTS (5 per role)
// ═══════════════════════════════════════════════════════════════

(function seedAgents() {
  const now = new Date().toISOString();
  const dirs = GRADIENT_DIRECTIONS;

  ROLE_GREEK.forEach(({ role, prefix, letter }) => {
    for (let i = 0; i < 5; i++) {
      const rawStrength = PHI_INVERSE * (0.5 + i * 0.1);
      const fieldGradientStrength = Math.min(1, Math.max(0, rawStrength));
      const agentId = sovereignId();
      const num = String(i + 1).padStart(2, '0');
      const agent: BuilderAgent = {
        id: agentId,
        name: `${prefix}-${letter}-${num}`,
        role,
        state: 'idle',
        fieldGradientStrength,
        gradientDirection: dirs[i % dirs.length],
        currentTask: undefined,
        artifactsBuilt: 0,
        collaborators: [],
        specializationScore: Math.min(1, PHI_INVERSE * (0.4 + i * 0.12)),
        autonomyScore: Math.min(1, PHI_INVERSE * (0.3 + i * 0.15)),
        lastActivity: now,
      };
      _agents.set(agentId, agent);
    }
  });
})();

// ═══════════════════════════════════════════════════════════════
// SEED FIELD GRADIENTS
// ═══════════════════════════════════════════════════════════════

(function seedGradients() {
  const seeds: Array<{
    direction: FieldGradientDirection;
    source: string;
    target: string;
    attractor: string;
    strength: number;
  }> = [
    { direction: 'ascending',   source: 'memory',         target: 'governance',  attractor: 'sovereignty-ascent',   strength: PHI_INVERSE },
    { direction: 'descending',  source: 'governance',     target: 'field',       attractor: 'field-descent',        strength: PHI_INVERSE * 0.9 },
    { direction: 'lateral',     source: 'narrative',      target: 'corridor',    attractor: 'narrative-corridor',   strength: PHI_INVERSE * 0.8 },
    { direction: 'spiral',      source: 'phantom',        target: 'reality',     attractor: 'phantom-spiral',       strength: PHI_INVERSE * PHI_INVERSE },
    { direction: 'convergent',  source: 'all-subsystems', target: 'core',        attractor: 'core-convergence',     strength: Math.min(1, PHI_INVERSE * PHI) },
  ];

  seeds.forEach(s => {
    const g: FieldGradient = {
      id: sovereignId(),
      direction: s.direction,
      strength: Math.min(1, Math.max(0, s.strength)),
      sourceSubsystem: s.source,
      targetSubsystem: s.target,
      attractorPattern: s.attractor,
    };
    _fieldGradients.set(g.id, g);
  });
})();

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function activeStates(): BuilderState[] {
  return ['following-gradient', 'constructing', 'compiling', 'synthesizing', 'complete'];
}

function isActive(agent: BuilderAgent): boolean {
  return activeStates().includes(agent.state);
}

function randomGradient(): FieldGradient {
  const gs = Array.from(_fieldGradients.values());
  return gs[Math.floor(Math.random() * gs.length)];
}

function roleArtifactMap(): Record<BuilderRole, ArtifactType> {
  return {
    'builder':           'corridor',
    'compiler':          'compiled-module',
    'synthesizer':       'synthesized-pattern',
    'draft-engine':      'draft-blueprint',
    'phantom-architect': 'phantom-organ',
    'corridor-mapper':   'corridor',
    'ritual-designer':   'ritual',
    'species-creator':   'new-species',
    'encryption-layer':  'encryption-surface',
    'narrative-weaver':  'narrative-structure',
  };
}

// ═══════════════════════════════════════════════════════════════
// EXPORTED FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function getAgent(id: string): BuilderAgent | undefined {
  return _agents.get(id);
}

export function listAgents(): BuilderAgent[] {
  return Array.from(_agents.values());
}

export function getAgentsByRole(role: BuilderRole): BuilderAgent[] {
  return listAgents().filter(a => a.role === role);
}

export function wakeAgent(id: string): BuilderAgent | undefined {
  const agent = _agents.get(id);
  if (!agent) return undefined;
  if (agent.state === 'idle') {
    agent.state = 'following-gradient';
    agent.lastActivity = new Date().toISOString();
  }
  return agent;
}

export function wakeAllAgents(): BuilderAgent[] {
  return listAgents().map(a => wakeAgent(a.id)!);
}

export function assignGradient(agentId: string, gradient: FieldGradient): BuilderAgent | undefined {
  const agent = _agents.get(agentId);
  if (!agent) return undefined;
  agent.gradientDirection = gradient.direction;
  agent.fieldGradientStrength = clamp01(gradient.strength * PHI_INVERSE);
  agent.currentTask = `Follow ${gradient.attractorPattern} toward ${gradient.targetSubsystem}`;
  agent.state = 'following-gradient';
  agent.lastActivity = new Date().toISOString();
  return agent;
}

export function buildArtifact(
  agentId: string,
  type: ArtifactType,
  name: string,
): BuilderArtifact | undefined {
  const agent = _agents.get(agentId);
  if (!agent || !isActive(agent)) return undefined;

  const collaboratorIds = listAgents()
    .filter(a => a.id !== agentId && isActive(a))
    .slice(0, 3)
    .map(a => a.id);

  const artifact: BuilderArtifact = {
    id: sovereignId(),
    type,
    name,
    createdBy: agentId,
    collaborators: collaboratorIds,
    fieldGradientFollowed: agent.gradientDirection,
    complexity: clamp01(PHI_INVERSE * agent.specializationScore * PHI),
    description: ARTIFACT_DESCRIPTIONS[type],
    components: [...ARTIFACT_COMPONENTS[type]],
    timestamp: new Date().toISOString(),
  };

  _artifacts.push(artifact);
  agent.artifactsBuilt++;
  agent.collaborators = [...new Set([...agent.collaborators, ...collaboratorIds])];
  agent.state = 'complete';
  agent.lastActivity = new Date().toISOString();

  return artifact;
}

export function runSwarmCycle(): SwarmCycle {
  const before = _artifacts.length;

  // Wake all agents
  wakeAllAgents();

  // Assign gradients and build artifacts
  const agents = listAgents();
  const gradients = Array.from(_fieldGradients.values());
  const artMap = roleArtifactMap();

  agents.forEach((agent, idx) => {
    const gradient = gradients[idx % gradients.length];
    assignGradient(agent.id, gradient);
    const artType = artMap[agent.role];
    buildArtifact(agent.id, artType, `${agent.name}-${artType}-${sovereignId().slice(0, 6)}`);
  });

  const after = _artifacts.length;
  const created = after - before;
  const newArtifacts = _artifacts.slice(before);

  const newSpecies  = newArtifacts.filter(a => a.type === 'new-species').length;
  const newRituals  = newArtifacts.filter(a => a.type === 'ritual').length;
  const newCorridors = newArtifacts.filter(a => a.type === 'corridor').length;
  const newPhantoms  = newArtifacts.filter(a => a.type === 'phantom-organ').length;

  const avgStrength = agents.reduce((s, a) => s + a.fieldGradientStrength, 0) / agents.length;

  const emergentBehaviors = [
    `Φ-resonance at ${(avgStrength * SCHUMANN_FUNDAMENTAL).toFixed(2)} Hz`,
    `Swarm heartbeat: ${HEARTBEAT_MS}ms`,
    `PHI² convergence: ${(avgStrength * PHI_SQUARED).toFixed(4)}`,
    created > 40 ? 'mass-artifact-emergence' : 'steady-construction',
  ];

  const cycle: SwarmCycle = {
    id: sovereignId(),
    timestamp: new Date().toISOString(),
    activeAgents: agents.filter(a => isActive(a)).length,
    artifactsCreated: created,
    newSpecies,
    newRituals,
    newCorridors,
    newPhantomOrgans: newPhantoms,
    fieldGradientStrengthAvg: clamp01(avgStrength),
    collaborationScore: calculateCollaborationScore(),
    emergentBehaviors,
  };

  _cycleHistory.push(cycle);
  return cycle;
}

export function getSwarmCycleHistory(): SwarmCycle[] {
  return [..._cycleHistory];
}

export function listArtifacts(): BuilderArtifact[] {
  return [..._artifacts];
}

export function getArtifactsByType(type: ArtifactType): BuilderArtifact[] {
  return _artifacts.filter(a => a.type === type);
}

export function getFieldGradients(): FieldGradient[] {
  return Array.from(_fieldGradients.values());
}

export function getFieldGradient(id: string): FieldGradient | undefined {
  return _fieldGradients.get(id);
}

export function calculateCollaborationScore(): number {
  const agents = listAgents();
  if (agents.length === 0) return 0;
  const totalCollabs = agents.reduce((sum, a) => sum + a.collaborators.length, 0);
  const maxPossible = agents.length * (agents.length - 1);
  return clamp01(totalCollabs / (maxPossible || 1) * PHI);
}

export function getAgentCount(): number {
  return _agents.size;
}

export function getSwarmStatus(): {
  totalAgents: number;
  activeAgents: number;
  idleAgents: number;
  artifactsBuilt: number;
  swarmCycles: number;
  avgFieldStrength: number;
  collaborationScore: number;
} {
  const agents = listAgents();
  const active = agents.filter(a => isActive(a));
  const idle   = agents.filter(a => a.state === 'idle');
  const avgStrength = agents.length
    ? agents.reduce((s, a) => s + a.fieldGradientStrength, 0) / agents.length
    : 0;

  return {
    totalAgents: agents.length,
    activeAgents: active.length,
    idleAgents: idle.length,
    artifactsBuilt: _artifacts.length,
    swarmCycles: _cycleHistory.length,
    avgFieldStrength: clamp01(avgStrength),
    collaborationScore: calculateCollaborationScore(),
  };
}

// ═══════════════════════════════════════════════════════════════
// RE-EXPORT CONSTANTS (convenience)
// ═══════════════════════════════════════════════════════════════

export { PHI, PHI_INVERSE, PHI_SQUARED, SCHUMANN_FUNDAMENTAL, HEARTBEAT_MS };
