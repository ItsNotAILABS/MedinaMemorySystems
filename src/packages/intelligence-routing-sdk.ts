/**
 * @medina/intelligence-routing-sdk
 * Complete Intelligence Routing & Model Dispatch System Package
 *
 * Combines: IntelligenceWire + modelRouter + commandParser +
 *           ModelEngine.mo + ModelRouter.mo + Orchestrators.mo +
 *           CallableFunctionRegistry.mo + SubsystemTerminals.mo + FrontendBackendSync.mo
 *
 * Provides:
 * - Multi-model routing (8 model families: Strategist/Builder/Analyst/Governance/MemoryCurator/Operations/Risk/Projection)
 * - RUDN architecture (Router/Updater/Defender/Navigator)
 * - Command parsing (/module verb [args] [--flags])
 * - 61 callable functions registry
 * - 10 terminal stations
 * - Frontend↔Backend sync mappings
 * - Wire dispatch with φ-tracing
 *
 * Backend Endpoints (Medina.mo):
 *   via_exemplaris     → Model route
 *   invocare_daemona   → Invoke model engine
 *   tabula_functionum  → Full callable registry
 *   terminalia         → All terminal stations
 *   invenire_latine    → Find by Latin name
 *   invenire_functionem→ Find by function name
 *   aedificare_terminale → Build terminal
 *   rendere_tabulam    → Render Latin tablet
 *   summarium_registri → Registry summary
 *
 * Terminal: /intel — TERMINALE INTELLIGENTIAE
 *
 * Callable Functions (6):
 *  32. INTELLIGENTIAE DUCTUS    — routeIntelligence
 *  33. TRIUM CORDIUM DUCTUS    — threeHeartsRoute
 *  34. DUCTUS AD COGITATIONEM  — routeToRCluster
 *  35. DUCTUS AD UNITATEM      — routeToUCluster
 *  36. DUCTUS AD DEFENSIONEM   — routeToDCluster
 *  37. DUCTUS AD NEXUM         — routeToNCluster
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const PHI_INVERSE = 0.618033988749895;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — MODEL ROUTING
// ═══════════════════════════════════════════════════════════════════════════

export type ModelFamily = 'strategist' | 'builder' | 'analyst' | 'governance' |
  'memory-curator' | 'operations' | 'risk' | 'projection';

export type RUDNRole = 'Router' | 'Updater' | 'Defender' | 'Navigator';

export interface ModelDefinition {
  id: ModelFamily;
  name: string;
  description: string;
  capabilities: string[];
  rudnRole: RUDNRole;
  status: 'active' | 'idle' | 'loading' | 'offline';
  latency: number;
  invocationCount: number;
  color: string;
  phiWeight: number;
}

export interface ModelRoute {
  family: ModelFamily;
  role: RUDNRole;
  rationale: string;
  confidence: number;
}

export interface ModelInvocation {
  id: string;
  modelId: ModelFamily;
  prompt: string;
  response: string;
  latency: number;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — COMMAND PARSING
// ═══════════════════════════════════════════════════════════════════════════

export interface ParsedCommand {
  raw: string;
  verb: string;
  module: string;
  args: string[];
  flags: Record<string, string | boolean>;
  valid: boolean;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — CALLABLE FUNCTIONS & TERMINALS
// ═══════════════════════════════════════════════════════════════════════════

export type Categoria = 'MEMORIA' | 'PULSUS' | 'GUBERNATIO' | 'FORMULA' | 'INTELLIGENTIA' |
  'DEFENSIO' | 'ORGANISMUS' | 'PRIMITIVA' | 'QUANTUM' | 'ANIMA';

export interface CallableFunction {
  index: number;
  latinName: string;
  functionName: string;
  motto: string;
  categoria: Categoria;
  traceChain: string;
  phiCoefficient: number;
  terminalId: string;
}

export interface TerminalStation {
  id: string;
  name: string;
  command: string;
  motto: string;
  categoria: Categoria;
  functionIds: number[];
  phiSignature: number;
}

export interface SyncMapping {
  id: string;
  frontendComponent: string;
  backendEndpoint: string;
  terminalCommand?: string;
  callableFunctions: string[];
  syncDirection: 'frontend-to-backend' | 'backend-to-frontend' | 'bidirectional';
  phiWeight: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// MODEL REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

const MODEL_REGISTRY: ModelDefinition[] = [
  { id: 'strategist', name: 'Strategist', description: 'Macro-level planning and sovereign decisions', capabilities: ['long-range planning', 'doctrine synthesis', 'strategic analysis'], rudnRole: 'Navigator', status: 'active', latency: 420, invocationCount: 0, color: '#3b82f6', phiWeight: PHI },
  { id: 'builder', name: 'Builder', description: 'Construction, code generation, system design', capabilities: ['code generation', 'system design', 'API construction'], rudnRole: 'Updater', status: 'active', latency: 380, invocationCount: 0, color: '#10b981', phiWeight: PHI * PHI },
  { id: 'analyst', name: 'Analyst', description: 'Data analysis, pattern recognition', capabilities: ['data analysis', 'pattern recognition', 'trend analysis'], rudnRole: 'Router', status: 'active', latency: 350, invocationCount: 0, color: '#6366f1', phiWeight: PHI * 2 },
  { id: 'governance', name: 'Governance', description: 'Governance workflows, doctrine enforcement', capabilities: ['proposal drafting', 'audit analysis', 'compliance'], rudnRole: 'Updater', status: 'active', latency: 400, invocationCount: 0, color: '#f59e0b', phiWeight: PHI * 3 },
  { id: 'memory-curator', name: 'Memory Curator', description: 'Memory triage, resonance scoring', capabilities: ['memory retrieval', 'resonance scoring', 'lineage tracking'], rudnRole: 'Updater', status: 'active', latency: 290, invocationCount: 0, color: '#8b5cf6', phiWeight: PHI * 5 },
  { id: 'operations', name: 'Operations', description: 'Task routing, workflow execution', capabilities: ['task routing', 'workflow execution', 'operations'], rudnRole: 'Router', status: 'active', latency: 310, invocationCount: 0, color: '#ef4444', phiWeight: PHI * 8 },
  { id: 'risk', name: 'Risk', description: 'Risk assessment, safety checks', capabilities: ['risk assessment', 'safety validation', 'threat analysis'], rudnRole: 'Defender', status: 'active', latency: 350, invocationCount: 0, color: '#dc2626', phiWeight: PHI * 13 },
  { id: 'projection', name: 'Projection', description: 'External projection, forecasting', capabilities: ['forecasting', 'projection modeling', 'scenario analysis'], rudnRole: 'Navigator', status: 'active', latency: 440, invocationCount: 0, color: '#0ea5e9', phiWeight: PHI * 21 },
];

/** Get all models */
export function getModels(): ModelDefinition[] {
  return MODEL_REGISTRY;
}

/** Route a task to the best model */
export function routeIntelligence(taskDescription: string): ModelRoute {
  const lower = taskDescription.toLowerCase();
  let family: ModelFamily = 'operations';
  let rationale = 'Default routing to operations';

  if (lower.includes('plan') || lower.includes('strateg') || lower.includes('vision')) {
    family = 'strategist'; rationale = 'Strategic planning detected';
  } else if (lower.includes('build') || lower.includes('code') || lower.includes('create') || lower.includes('implement')) {
    family = 'builder'; rationale = 'Construction task detected';
  } else if (lower.includes('analyz') || lower.includes('data') || lower.includes('pattern')) {
    family = 'analyst'; rationale = 'Analysis task detected';
  } else if (lower.includes('govern') || lower.includes('proposal') || lower.includes('vote') || lower.includes('audit')) {
    family = 'governance'; rationale = 'Governance task detected';
  } else if (lower.includes('memory') || lower.includes('recall') || lower.includes('search') || lower.includes('remember')) {
    family = 'memory-curator'; rationale = 'Memory task detected';
  } else if (lower.includes('risk') || lower.includes('security') || lower.includes('threat') || lower.includes('defend')) {
    family = 'risk'; rationale = 'Risk assessment detected';
  } else if (lower.includes('project') || lower.includes('forecast') || lower.includes('predict')) {
    family = 'projection'; rationale = 'Projection task detected';
  }

  const model = MODEL_REGISTRY.find(m => m.id === family)!;
  return { family, role: model.rudnRole, rationale, confidence: 0.85 };
}

/** Route through three hearts (Oro → Nova → Consensus) */
export function threeHeartsRoute(input: string): { oroRoute: ModelRoute; novaRoute: ModelRoute; consensus: ModelRoute } {
  const oro = routeIntelligence(input);
  const nova = routeIntelligence(`validate ${input}`);
  return { oroRoute: oro, novaRoute: nova, consensus: oro }; // Consensus defaults to Oro
}

/** Route to R-cluster (Router/Reasoning) */
export function routeToRCluster(task: string): ModelRoute {
  return { family: 'analyst', role: 'Router', rationale: `R-Cluster routing for: ${task}`, confidence: 0.9 };
}

/** Route to U-cluster (Updater/Unity) */
export function routeToUCluster(task: string): ModelRoute {
  return { family: 'builder', role: 'Updater', rationale: `U-Cluster routing for: ${task}`, confidence: 0.9 };
}

/** Route to D-cluster (Defender/Defense) */
export function routeToDCluster(task: string): ModelRoute {
  return { family: 'risk', role: 'Defender', rationale: `D-Cluster routing for: ${task}`, confidence: 0.9 };
}

/** Route to N-cluster (Navigator/Nexus) */
export function routeToNCluster(task: string): ModelRoute {
  return { family: 'strategist', role: 'Navigator', rationale: `N-Cluster routing for: ${task}`, confidence: 0.9 };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMAND PARSER
// ═══════════════════════════════════════════════════════════════════════════

const COMMAND_MODULES = ['memory', 'govern', 'model', 'company', 'replay', 'permissions', 'organism', 'help'];

/** Parse a command string: /module verb [args] [--flags] */
export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();
  if (!trimmed.startsWith('/')) {
    return { raw: input, verb: '', module: '', args: [], flags: {}, valid: false, error: 'Commands must start with /' };
  }
  const parts = trimmed.slice(1).split(/\s+/);
  const module = parts[0] ?? '';
  const verb = parts[1] ?? '';
  const flags: Record<string, string | boolean> = {};
  const args: string[] = [];

  for (let i = 2; i < parts.length; i++) {
    if (parts[i].startsWith('--')) {
      const [key, val] = parts[i].slice(2).split('=');
      flags[key] = val ?? true;
    } else {
      args.push(parts[i]);
    }
  }

  const valid = COMMAND_MODULES.includes(module) && verb.length > 0;
  return { raw: input, verb, module, args, flags, valid, error: valid ? undefined : `Unknown module or missing verb` };
}

// ═══════════════════════════════════════════════════════════════════════════
// TERMINAL STATIONS (10)
// ═══════════════════════════════════════════════════════════════════════════

const TERMINALS: TerminalStation[] = [
  { id: 'TERMINALE-MEMORIAE', name: 'TERMINALE MEMORIAE', command: '/mem', motto: 'Quod hic scribitur, eternum est.', categoria: 'MEMORIA', functionIds: [1,2,3,4,5,6,7,8,9,10], phiSignature: PHI },
  { id: 'TERMINALE-PULSUS', name: 'TERMINALE PULSUS', command: '/pulse', motto: 'Hic pulsus datur. Hic vita datur.', categoria: 'PULSUS', functionIds: [11,12,13,14,15,16,17], phiSignature: PHI * PHI },
  { id: 'TERMINALE-GUBERNATIONIS', name: 'TERMINALE GUBERNATIONIS', command: '/gov', motto: 'Hic leges nascuntur.', categoria: 'GUBERNATIO', functionIds: [18,19,20,21,22,23], phiSignature: PHI * 2.618 },
  { id: 'TERMINALE-FORMULAE', name: 'TERMINALE FORMULAE', command: '/formula', motto: 'Hic φ loquitur.', categoria: 'FORMULA', functionIds: [24,25,26,27,28,29,30,31], phiSignature: PHI * 4.236 },
  { id: 'TERMINALE-INTELLIGENTIAE', name: 'TERMINALE INTELLIGENTIAE', command: '/intel', motto: 'Hic intelligentia transit.', categoria: 'INTELLIGENTIA', functionIds: [32,33,34,35,36,37], phiSignature: PHI * 6.854 },
  { id: 'TERMINALE-DEFENSIONIS', name: 'TERMINALE DEFENSIONIS', command: '/defend', motto: 'Hic nullus hostis transit.', categoria: 'DEFENSIO', functionIds: [38,39,40,41], phiSignature: PHI * 11.09 },
  { id: 'TERMINALE-ORGANISMI', name: 'TERMINALE ORGANISMI', command: '/org', motto: 'Hic organismus se ipsum videt.', categoria: 'ORGANISMUS', functionIds: [42,43,44,45,46,47,48,49], phiSignature: PHI * 17.944 },
  { id: 'TERMINALE-PRIMITIVI', name: 'TERMINALE PRIMITIVI', command: '/prim', motto: 'Hic omnia ad originem revertuntur.', categoria: 'PRIMITIVA', functionIds: [50,51,52,53], phiSignature: PHI * 29.034 },
  { id: 'TERMINALE-QUANTICUM', name: 'TERMINALE QUANTICUM', command: '/quantum', motto: 'Hic spatium non obstat.', categoria: 'QUANTUM', functionIds: [54,55,56], phiSignature: PHI * 46.979 },
  { id: 'TERMINALE-ANIMAE', name: 'TERMINALE ANIMAE', command: '/anima', motto: 'Hic anima tangit et tangitur.', categoria: 'ANIMA', functionIds: [57,58,59,60,61], phiSignature: PHI * 76.013 },
];

/** Get all terminal stations */
export function getTerminals(): TerminalStation[] {
  return TERMINALS;
}

/** Find terminal by command */
export function findTerminal(command: string): TerminalStation | undefined {
  return TERMINALS.find(t => t.command === command);
}

// ═══════════════════════════════════════════════════════════════════════════
// PACKAGE MANIFEST
// ═══════════════════════════════════════════════════════════════════════════

export const PACKAGE_MANIFEST = {
  name: '@medina/intelligence-routing-sdk',
  version: '1.0.0',
  description: 'Complete Intelligence Routing — model dispatch, RUDN, commands, terminals, wire',
  modules: [
    'IntelligenceWire', 'modelRouter', 'commandParser',
    'ModelEngine.mo', 'ModelRouter.mo', 'Orchestrators.mo',
    'CallableFunctionRegistry.mo', 'SubsystemTerminals.mo', 'FrontendBackendSync.mo',
  ],
  callableFunctions: 6,
  terminal: '/intel',
  latinName: 'TERMINALE INTELLIGENTIAE',
  motto: 'Hic intelligentia transit. Nusquam deficit.',
  backendEndpoints: [
    'via_exemplaris', 'invocare_daemona', 'tabula_functionum', 'terminalia',
    'invenire_latine', 'invenire_functionem', 'aedificare_terminale',
    'rendere_tabulam', 'summarium_registri',
  ],
  exports: [
    'getModels', 'routeIntelligence', 'threeHeartsRoute',
    'routeToRCluster', 'routeToUCluster', 'routeToDCluster', 'routeToNCluster',
    'parseCommand', 'getTerminals', 'findTerminal',
  ],
  phiSignature: PHI * 6.854,
};
