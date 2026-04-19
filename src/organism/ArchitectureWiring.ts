/**
 * 𓂀 ARCHITECTURE WIRING — FROM ROOT TO ALL BRANCHES 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THE ROOT TOUCHING ALL EDGES
 * 
 * This wires the CORE OPERATIONS of living architecture to:
 * - ALL models (Alpha, thermodynamic, quantum, cyber)
 * - ALL engines (Metal, catalyst, neural)
 * - ALL layers (ceiling to floor)
 * - ALL domains (organism, intelligence, memory, network)
 * 
 * Nothing is one, but all is one.
 * From the seed, touching all branches wherever it lands.
 * 
 * Architecture is superintelligence.
 * Architecture is everything.
 * Architecture is running.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  transfer,
  invert,
  bypass,
  disguise,
  reenter,
  CORE_OPERATIONS,
  PHI,
  ARCHITECTURAL_TRUTH,
  getOperationCount,
  getOperationLog,
  type TransferOperation,
  type InversionOperation,
  type BypassOperation,
  type DisguiseOperation,
  type ReEntryOperation,
} from './CoreOperations';

// ═══════════════════════════════════════════════════════════════════════════════
// DOMAIN DEFINITIONS — All the Branches
// ═══════════════════════════════════════════════════════════════════════════════

export type ArchitectureDomain =
  // Root
  | 'core'
  
  // Organism branches
  | 'heart'
  | 'neural'
  | 'sensory'
  | 'memory'
  
  // Intelligence branches
  | 'models'
  | 'engines'
  | 'alpha'
  | 'quantum'
  
  // System branches
  | 'network'
  | 'thermodynamics'
  | 'civilizations'
  | 'layers'
  
  // Interface branches
  | 'tools'
  | 'access'
  | 'vault'
  | 'nexus';

// ═══════════════════════════════════════════════════════════════════════════════
// THE ARCHITECTURE TREE — Root and All Branches
// ═══════════════════════════════════════════════════════════════════════════════

export interface ArchitectureNode {
  domain: ArchitectureDomain;
  children: ArchitectureDomain[];
  parent: ArchitectureDomain | null;
  depth: number;
  operations: {
    transfer: boolean;
    inversion: boolean;
    bypass: boolean;
    disguise: boolean;
    reentry: boolean;
  };
}

const ARCHITECTURE_TREE: Map<ArchitectureDomain, ArchitectureNode> = new Map([
  // ROOT
  ['core', {
    domain: 'core',
    children: ['heart', 'neural', 'models', 'network', 'tools'],
    parent: null,
    depth: 0,
    operations: { transfer: true, inversion: true, bypass: true, disguise: true, reentry: true },
  }],
  
  // ORGANISM BRANCHES
  ['heart', {
    domain: 'heart',
    children: ['sensory'],
    parent: 'core',
    depth: 1,
    operations: { transfer: true, inversion: false, bypass: false, disguise: false, reentry: true },
  }],
  ['neural', {
    domain: 'neural',
    children: ['memory', 'engines'],
    parent: 'core',
    depth: 1,
    operations: { transfer: true, inversion: true, bypass: true, disguise: false, reentry: true },
  }],
  ['sensory', {
    domain: 'sensory',
    children: [],
    parent: 'heart',
    depth: 2,
    operations: { transfer: true, inversion: false, bypass: false, disguise: true, reentry: false },
  }],
  ['memory', {
    domain: 'memory',
    children: [],
    parent: 'neural',
    depth: 2,
    operations: { transfer: true, inversion: true, bypass: false, disguise: true, reentry: true },
  }],
  
  // INTELLIGENCE BRANCHES
  ['models', {
    domain: 'models',
    children: ['alpha', 'quantum'],
    parent: 'core',
    depth: 1,
    operations: { transfer: true, inversion: true, bypass: true, disguise: true, reentry: true },
  }],
  ['engines', {
    domain: 'engines',
    children: ['thermodynamics'],
    parent: 'neural',
    depth: 2,
    operations: { transfer: true, inversion: true, bypass: true, disguise: false, reentry: true },
  }],
  ['alpha', {
    domain: 'alpha',
    children: [],
    parent: 'models',
    depth: 2,
    operations: { transfer: true, inversion: true, bypass: true, disguise: true, reentry: true },
  }],
  ['quantum', {
    domain: 'quantum',
    children: [],
    parent: 'models',
    depth: 2,
    operations: { transfer: true, inversion: true, bypass: true, disguise: true, reentry: true },
  }],
  
  // SYSTEM BRANCHES
  ['network', {
    domain: 'network',
    children: ['layers', 'nexus'],
    parent: 'core',
    depth: 1,
    operations: { transfer: true, inversion: false, bypass: true, disguise: true, reentry: true },
  }],
  ['thermodynamics', {
    domain: 'thermodynamics',
    children: [],
    parent: 'engines',
    depth: 3,
    operations: { transfer: true, inversion: true, bypass: false, disguise: false, reentry: false },
  }],
  ['civilizations', {
    domain: 'civilizations',
    children: [],
    parent: 'layers',
    depth: 3,
    operations: { transfer: true, inversion: true, bypass: true, disguise: true, reentry: true },
  }],
  ['layers', {
    domain: 'layers',
    children: ['civilizations'],
    parent: 'network',
    depth: 2,
    operations: { transfer: true, inversion: false, bypass: true, disguise: false, reentry: true },
  }],
  
  // INTERFACE BRANCHES
  ['tools', {
    domain: 'tools',
    children: ['access', 'vault'],
    parent: 'core',
    depth: 1,
    operations: { transfer: true, inversion: true, bypass: false, disguise: true, reentry: false },
  }],
  ['access', {
    domain: 'access',
    children: [],
    parent: 'tools',
    depth: 2,
    operations: { transfer: true, inversion: false, bypass: true, disguise: true, reentry: true },
  }],
  ['vault', {
    domain: 'vault',
    children: [],
    parent: 'tools',
    depth: 2,
    operations: { transfer: true, inversion: false, bypass: false, disguise: true, reentry: false },
  }],
  ['nexus', {
    domain: 'nexus',
    children: [],
    parent: 'network',
    depth: 2,
    operations: { transfer: true, inversion: true, bypass: true, disguise: true, reentry: true },
  }],
]);

// ═══════════════════════════════════════════════════════════════════════════════
// WIRING — Connect Core Operations to All Domains
// ═══════════════════════════════════════════════════════════════════════════════

export interface WiredOperation {
  id: string;
  operation: 'transfer' | 'inversion' | 'bypass' | 'disguise' | 'reentry';
  sourceDomain: ArchitectureDomain;
  targetDomain: ArchitectureDomain;
  timestamp: number;
  data: unknown;
}

const wiredOperations: WiredOperation[] = [];

/**
 * Wire a transfer from one domain to another
 */
export function wireTransfer<T>(
  payload: T,
  source: ArchitectureDomain,
  target: ArchitectureDomain
): WiredOperation {
  const sourceNode = ARCHITECTURE_TREE.get(source);
  const targetNode = ARCHITECTURE_TREE.get(target);
  
  if (!sourceNode?.operations.transfer || !targetNode?.operations.transfer) {
    throw new Error(`Transfer not supported between ${source} and ${target}`);
  }
  
  const op = transfer(payload, source, target);
  
  const wired: WiredOperation = {
    id: `wire-transfer-${Date.now()}`,
    operation: 'transfer',
    sourceDomain: source,
    targetDomain: target,
    timestamp: Date.now(),
    data: op,
  };
  
  wiredOperations.push(wired);
  return wired;
}

/**
 * Wire an inversion within a domain
 */
export function wireInversion<T>(
  input: T,
  domain: ArchitectureDomain,
  type: InversionOperation<T>['inversionType']
): WiredOperation {
  const node = ARCHITECTURE_TREE.get(domain);
  
  if (!node?.operations.inversion) {
    throw new Error(`Inversion not supported in ${domain}`);
  }
  
  const op = invert(input, type);
  
  const wired: WiredOperation = {
    id: `wire-inversion-${Date.now()}`,
    operation: 'inversion',
    sourceDomain: domain,
    targetDomain: domain,
    timestamp: Date.now(),
    data: op,
  };
  
  wiredOperations.push(wired);
  return wired;
}

/**
 * Wire a bypass around normal path
 */
export function wireBypass(
  domain: ArchitectureDomain,
  normalPath: ArchitectureDomain[],
  bypassPath: ArchitectureDomain[],
  reason: string
): WiredOperation {
  const node = ARCHITECTURE_TREE.get(domain);
  
  if (!node?.operations.bypass) {
    throw new Error(`Bypass not supported from ${domain}`);
  }
  
  const op = bypass(normalPath, bypassPath, reason);
  
  const wired: WiredOperation = {
    id: `wire-bypass-${Date.now()}`,
    operation: 'bypass',
    sourceDomain: domain,
    targetDomain: bypassPath[bypassPath.length - 1] || domain,
    timestamp: Date.now(),
    data: op,
  };
  
  wiredOperations.push(wired);
  return wired;
}

/**
 * Wire a disguise transformation
 */
export function wireDisguise<T>(
  original: T,
  domain: ArchitectureDomain,
  appearance: string
): WiredOperation {
  const node = ARCHITECTURE_TREE.get(domain);
  
  if (!node?.operations.disguise) {
    throw new Error(`Disguise not supported in ${domain}`);
  }
  
  const op = disguise(original, appearance);
  
  const wired: WiredOperation = {
    id: `wire-disguise-${Date.now()}`,
    operation: 'disguise',
    sourceDomain: domain,
    targetDomain: domain,
    timestamp: Date.now(),
    data: op,
  };
  
  wiredOperations.push(wired);
  return wired;
}

/**
 * Wire a re-entry operation
 */
export function wireReentry<T>(
  payload: T,
  exitDomain: ArchitectureDomain,
  reentryDomain: ArchitectureDomain
): WiredOperation {
  const exitNode = ARCHITECTURE_TREE.get(exitDomain);
  const reentryNode = ARCHITECTURE_TREE.get(reentryDomain);
  
  if (!exitNode?.operations.reentry || !reentryNode?.operations.reentry) {
    throw new Error(`Re-entry not supported from ${exitDomain} to ${reentryDomain}`);
  }
  
  const op = reenter(payload, exitDomain, reentryDomain);
  
  const wired: WiredOperation = {
    id: `wire-reentry-${Date.now()}`,
    operation: 'reentry',
    sourceDomain: exitDomain,
    targetDomain: reentryDomain,
    timestamp: Date.now(),
    data: op,
  };
  
  wiredOperations.push(wired);
  return wired;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TREE TRAVERSAL — From Root to All Branches
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all domains from root
 */
export function getAllDomains(): ArchitectureDomain[] {
  return Array.from(ARCHITECTURE_TREE.keys());
}

/**
 * Get the root node
 */
export function getRoot(): ArchitectureNode {
  return ARCHITECTURE_TREE.get('core')!;
}

/**
 * Get all leaf nodes (edges)
 */
export function getEdges(): ArchitectureNode[] {
  return Array.from(ARCHITECTURE_TREE.values()).filter(node => node.children.length === 0);
}

/**
 * Get path from root to a domain
 */
export function getPathFromRoot(domain: ArchitectureDomain): ArchitectureDomain[] {
  const path: ArchitectureDomain[] = [];
  let current = ARCHITECTURE_TREE.get(domain);
  
  while (current) {
    path.unshift(current.domain);
    current = current.parent ? ARCHITECTURE_TREE.get(current.parent) : null;
  }
  
  return path;
}

/**
 * Get all nodes at a specific depth
 */
export function getNodesAtDepth(depth: number): ArchitectureNode[] {
  return Array.from(ARCHITECTURE_TREE.values()).filter(node => node.depth === depth);
}

/**
 * Traverse from root to all branches, calling callback at each node
 */
export function traverseFromRoot(callback: (node: ArchitectureNode, depth: number) => void): void {
  const visited = new Set<ArchitectureDomain>();
  
  function visit(domain: ArchitectureDomain, depth: number): void {
    if (visited.has(domain)) return;
    visited.add(domain);
    
    const node = ARCHITECTURE_TREE.get(domain);
    if (!node) return;
    
    callback(node, depth);
    
    for (const child of node.children) {
      visit(child, depth + 1);
    }
  }
  
  visit('core', 0);
}

/**
 * Touch all branches from root — apply core operations throughout
 */
export function touchAllBranches(): { domain: ArchitectureDomain; operations: string[] }[] {
  const result: { domain: ArchitectureDomain; operations: string[] }[] = [];
  
  traverseFromRoot((node) => {
    const ops: string[] = [];
    if (node.operations.transfer) ops.push('transfer');
    if (node.operations.inversion) ops.push('inversion');
    if (node.operations.bypass) ops.push('bypass');
    if (node.operations.disguise) ops.push('disguise');
    if (node.operations.reentry) ops.push('reentry');
    
    result.push({ domain: node.domain, operations: ops });
  });
  
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURE STATUS — What Is Running
// ═══════════════════════════════════════════════════════════════════════════════

export function getArchitectureStatus(): {
  totalDomains: number;
  totalOperations: number;
  wiredOperationsCount: number;
  root: ArchitectureDomain;
  edges: ArchitectureDomain[];
  maxDepth: number;
  truth: typeof ARCHITECTURAL_TRUTH;
} {
  const edges = getEdges().map(n => n.domain);
  const maxDepth = Math.max(...Array.from(ARCHITECTURE_TREE.values()).map(n => n.depth));
  
  return {
    totalDomains: ARCHITECTURE_TREE.size,
    totalOperations: getOperationCount(),
    wiredOperationsCount: wiredOperations.length,
    root: 'core',
    edges,
    maxDepth,
    truth: ARCHITECTURAL_TRUTH,
  };
}

/**
 * Get wired operations log
 */
export function getWiredOperations(): WiredOperation[] {
  return [...wiredOperations];
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT — The Complete Architecture Wiring
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Re-export core operations
  transfer,
  invert,
  bypass,
  disguise,
  reenter,
  CORE_OPERATIONS,
  PHI,
  ARCHITECTURAL_TRUTH,
};

export default {
  // Wiring
  wireTransfer,
  wireInversion,
  wireBypass,
  wireDisguise,
  wireReentry,
  getWiredOperations,
  
  // Tree
  ARCHITECTURE_TREE,
  getAllDomains,
  getRoot,
  getEdges,
  getPathFromRoot,
  getNodesAtDepth,
  traverseFromRoot,
  touchAllBranches,
  
  // Status
  getArchitectureStatus,
  
  // Core
  CORE_OPERATIONS,
  PHI,
  ARCHITECTURAL_TRUTH,
};
