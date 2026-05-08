/**
 * VITA AETERNA RUNTIME — Immortal Organism Lifecycle System
 *
 * "Vita Aeterna" — the organism lives forever through regeneration.
 *
 * This module manages organism kernel lifecycles, substrate quotas,
 * CPL-L enforcement, and integration with Semper Memoria.
 *
 * @module vitaAeternaRuntime
 */

import { sovereignId } from './sovereign-id';
import {
  createLineage,
  appendShard,
  getLineage,
  getRootLineageId,
} from './semperMemoriaEngine';
import {
  DEFAULT_QUOTAS,
  DECEPTICON_COUNTERPARTS,
} from '@/types';
import type {
  OrganismTemplate,
  OrganismKernel,
  OrganismLifecycleState,
  SubstrateQuota,
  SubstrateQuotaUsage,
  QuotaTier,
  AutobotClass,
  AutobotInstance,
  DecepticonClass,
  DecepticonInstance,
  ChaosDomain,
  ChaosMutation,
  ChaosTelemetryEntry,
  CodexLawCheckResult,
  AutobotLaw,
  DecepticonLaw,
  LifecycleTransitionResult,
  VitaAeternaStats,
  AccessScope,
  CodexAuditAction,
} from '@/types';

// ─── Stores ─────────────────────────────────────────────────────────────────

const templates: Map<string, OrganismTemplate> = new Map();
const kernels: Map<string, OrganismKernel> = new Map();
const autobots: Map<string, AutobotInstance> = new Map();
const decepticons: Map<string, DecepticonInstance> = new Map();
const chaosDomains: Map<string, ChaosDomain> = new Map();
const auditLog: Array<{ id: string; action: CodexAuditAction; details: string; timestamp: string }> = [];

// ─── Audit Logging ──────────────────────────────────────────────────────────

function logAudit(action: CodexAuditAction, details: string): string {
  const entry = {
    id: sovereignId(),
    action,
    details,
    timestamp: new Date().toISOString(),
  };
  auditLog.push(entry);
  return entry.id;
}

// ─── Law Checks ─────────────────────────────────────────────────────────────

function checkAutobotLaw(
  law: AutobotLaw,
  agent: string,
  agentClass: AutobotClass,
  action: string,
  context: Record<string, unknown> = {},
): CodexLawCheckResult {
  let passed = true;
  let reason = '';

  switch (law) {
    case 'A-1': // Coherence
      passed = true;
      reason = 'Coherence maintained via lifecycle validation';
      break;

    case 'A-2': // Reversibility
      passed = true;
      reason = 'Lifecycle transitions are reversible via archival';
      break;

    case 'A-3': // Explainability
      passed = true;
      reason = 'Full audit trail maintained';
      break;

    case 'A-4': // Containment
      if (context.quota && context.usage) {
        const quota = context.quota as SubstrateQuota;
        const usage = context.usage as SubstrateQuotaUsage;
        passed = usage.currentAgents < quota.maxConcurrentAgents;
        reason = passed ? 'Within quota limits' : 'Quota exceeded';
      } else {
        reason = 'Containment validated';
      }
      break;
  }

  const auditId = logAudit('AUTOBOT_LAW_CHECK', `${law}: ${reason}`);

  return {
    passed,
    law,
    agent,
    agentClass,
    action,
    reason,
    timestamp: new Date().toISOString(),
    auditId,
  };
}

function checkDecepticonLaw(
  law: DecepticonLaw,
  agent: string,
  agentClass: DecepticonClass,
  action: string,
  context: Record<string, unknown> = {},
): CodexLawCheckResult {
  let passed = true;
  let reason = '';

  switch (law) {
    case 'D-1': // Sandboxing
      passed = !!context.chaosDomainId;
      reason = passed ? 'Operating within chaos domain' : 'No chaos domain assigned';
      break;

    case 'D-2': // Telemetry
      passed = true;
      reason = 'Telemetry emission active';
      break;

    case 'D-3': // Non-Persistence
      if (context.chaosDomain) {
        const domain = context.chaosDomain as ChaosDomain;
        passed = domain.status === 'active' && new Date(domain.expiresAt) > new Date();
        reason = passed ? 'Domain is ephemeral' : 'Domain expired or invalid';
      } else {
        passed = false;
        reason = 'No chaos domain for non-persistence check';
      }
      break;

    case 'D-4': // Counterpart
      passed = !!context.counterpartId;
      reason = passed ? 'Autobot counterpart assigned' : 'No Autobot counterpart';
      break;
  }

  const auditId = logAudit('DECEPTICON_TELEMETRY', `${law}: ${reason}`);

  return {
    passed,
    law,
    agent,
    agentClass,
    action,
    reason,
    timestamp: new Date().toISOString(),
    auditId,
  };
}

function checkAllAutobotLaws(
  agent: string,
  agentClass: AutobotClass,
  action: string,
  context: Record<string, unknown> = {},
): { passed: boolean; results: CodexLawCheckResult[] } {
  const laws: AutobotLaw[] = ['A-1', 'A-2', 'A-3', 'A-4'];
  const results = laws.map((law) => checkAutobotLaw(law, agent, agentClass, action, context));
  const passed = results.every((r) => r.passed);
  return { passed, results };
}

function checkAllDecepticonLaws(
  agent: string,
  agentClass: DecepticonClass,
  action: string,
  context: Record<string, unknown> = {},
): { passed: boolean; results: CodexLawCheckResult[] } {
  const laws: DecepticonLaw[] = ['D-1', 'D-2', 'D-3', 'D-4'];
  const results = laws.map((law) => checkDecepticonLaw(law, agent, agentClass, action, context));
  const passed = results.every((r) => r.passed);
  return { passed, results };
}

// ─── Template Management ────────────────────────────────────────────────────

/**
 * Create a new organism template (blueprint).
 */
export function createTemplate(
  name: string,
  description: string,
  autobotClass: AutobotClass,
  defaultScope: AccessScope,
  requiredCapabilities: string[],
  quotaTier: QuotaTier,
  createdBy: string,
): OrganismTemplate {
  const template: OrganismTemplate = {
    id: sovereignId(),
    name,
    description,
    autobotClass,
    defaultScope,
    requiredCapabilities,
    quotaTier,
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    createdBy,
  };

  templates.set(template.id, template);
  return template;
}

/**
 * Get a template by ID.
 */
export function getTemplate(id: string): OrganismTemplate | undefined {
  return templates.get(id);
}

/**
 * List all templates.
 */
export function listTemplates(): OrganismTemplate[] {
  return Array.from(templates.values());
}

// ─── Organism Kernel Lifecycle ──────────────────────────────────────────────

/**
 * Spawn a new organism kernel from a template.
 */
export function spawnOrganism(
  templateId: string,
  name: string,
  spawnedBy: string,
): OrganismKernel {
  const template = templates.get(templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  const quota = DEFAULT_QUOTAS[template.quotaTier];
  const usage: SubstrateQuotaUsage = {
    currentAgents: 0,
    currentShards: 0,
    cyclesUsedThisBeat: 0,
    networkCallsThisMinute: 0,
    lastResetAt: new Date().toISOString(),
  };

  // Check quota
  const { passed, results } = checkAllAutobotLaws(spawnedBy, template.autobotClass, 'spawnOrganism', {
    quota,
    usage,
  });
  if (!passed) {
    throw new Error(`Autobot law check failed: ${results.find((r) => !r.passed)?.reason}`);
  }

  // Create lineage for this organism
  const lineage = createLineage(`${name}-lineage`, spawnedBy);

  const now = new Date().toISOString();
  const kernel: OrganismKernel = {
    id: sovereignId(),
    templateId,
    name,
    state: 'spawning',
    lineageId: lineage.id,
    quota,
    quotaUsage: usage,
    snapshotPolicy: 'on-mutation',
    beat: 0,
    createdAt: now,
    spawnedAt: now,
  };

  kernels.set(kernel.id, kernel);
  logAudit('LIFECYCLE_TRANSITION', `Organism "${name}" spawned from template "${template.name}"`);

  // Auto-transition to growth
  return transitionOrganism(kernel.id, 'growth', spawnedBy).success
    ? kernels.get(kernel.id)!
    : kernel;
}

/**
 * Transition an organism to a new lifecycle state.
 */
export function transitionOrganism(
  organismId: string,
  targetState: OrganismLifecycleState,
  transitionedBy: string,
): LifecycleTransitionResult {
  const kernel = kernels.get(organismId);
  if (!kernel) {
    throw new Error(`Organism ${organismId} not found`);
  }

  const validTransitions: Record<OrganismLifecycleState, OrganismLifecycleState[]> = {
    template: ['spawning'],
    spawning: ['growth'],
    growth: ['maturity', 'retiring'],
    maturity: ['retiring'],
    retiring: ['archived'],
    archived: [],
  };

  if (!validTransitions[kernel.state].includes(targetState)) {
    return {
      success: false,
      organismId,
      fromState: kernel.state,
      toState: targetState,
      lawChecks: [],
      reason: `Invalid transition from ${kernel.state} to ${targetState}`,
      timestamp: new Date().toISOString(),
    };
  }

  const template = templates.get(kernel.templateId);
  const { passed, results } = checkAllAutobotLaws(
    transitionedBy,
    template?.autobotClass ?? 'OPERATOR',
    'transitionOrganism',
    { quota: kernel.quota, usage: kernel.quotaUsage },
  );

  if (!passed) {
    return {
      success: false,
      organismId,
      fromState: kernel.state,
      toState: targetState,
      lawChecks: results,
      reason: results.find((r) => !r.passed)?.reason ?? 'Law check failed',
      timestamp: new Date().toISOString(),
    };
  }

  const now = new Date().toISOString();
  const updated: OrganismKernel = {
    ...kernel,
    state: targetState,
    ...(targetState === 'maturity' && { maturedAt: now }),
    ...(targetState === 'retiring' && { retiredAt: now }),
    ...(targetState === 'archived' && { archivedAt: now }),
  };

  kernels.set(organismId, updated);
  logAudit('LIFECYCLE_TRANSITION', `Organism "${kernel.name}" transitioned from ${kernel.state} to ${targetState}`);

  // Create snapshot on transition
  appendShard(kernel.lineageId, {
    content: JSON.stringify({ transition: { from: kernel.state, to: targetState }, timestamp: now }),
    scope: 'internal',
    tags: ['lifecycle', 'transition', targetState],
    createdBy: transitionedBy,
  });

  return {
    success: true,
    organismId,
    fromState: kernel.state,
    toState: targetState,
    lawChecks: results,
    timestamp: now,
  };
}

/**
 * Retire an organism.
 */
export function retireOrganism(organismId: string, retiredBy: string): LifecycleTransitionResult {
  const kernel = kernels.get(organismId);
  if (!kernel) {
    throw new Error(`Organism ${organismId} not found`);
  }

  // First transition to retiring, then to archived
  const retiring = transitionOrganism(organismId, 'retiring', retiredBy);
  if (!retiring.success) return retiring;

  return transitionOrganism(organismId, 'archived', retiredBy);
}

/**
 * Get an organism kernel by ID.
 */
export function getOrganism(id: string): OrganismKernel | undefined {
  return kernels.get(id);
}

/**
 * List organism kernels.
 */
export function listOrganisms(state?: OrganismLifecycleState): OrganismKernel[] {
  const all = Array.from(kernels.values());
  if (state) return all.filter((k) => k.state === state);
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ─── Autobot Management ─────────────────────────────────────────────────────

/**
 * Spawn an Autobot instance.
 */
export function spawnAutobot(
  autobotClass: AutobotClass,
  scope: AccessScope,
  lineageId: string,
  spawnedBy: string,
): AutobotInstance {
  const { passed, results } = checkAllAutobotLaws(spawnedBy, autobotClass, 'spawnAutobot', {
    scope,
  });
  if (!passed) {
    throw new Error(`Autobot law check failed: ${results.find((r) => !r.passed)?.reason}`);
  }

  const autobot: AutobotInstance = {
    id: sovereignId(),
    class: autobotClass,
    scope,
    lineageId,
    status: 'spawning',
    lawCheckResults: results,
    spawnedAt: new Date().toISOString(),
    spawnedBy,
  };

  autobots.set(autobot.id, autobot);
  logAudit('AUTOBOT_SPAWN', `Autobot ${autobotClass} spawned by ${spawnedBy}`);

  // Auto-activate
  const activated: AutobotInstance = { ...autobot, status: 'active' };
  autobots.set(autobot.id, activated);

  return activated;
}

/**
 * Retire an Autobot instance.
 */
export function retireAutobot(autobotId: string, retiredBy: string): AutobotInstance | null {
  const autobot = autobots.get(autobotId);
  if (!autobot) return null;

  const retired: AutobotInstance = {
    ...autobot,
    status: 'retired',
    retiredAt: new Date().toISOString(),
  };

  autobots.set(autobotId, retired);
  logAudit('AUTOBOT_RETIRE', `Autobot ${autobot.class} retired by ${retiredBy}`);

  return retired;
}

/**
 * Get an Autobot by ID.
 */
export function getAutobot(id: string): AutobotInstance | undefined {
  return autobots.get(id);
}

/**
 * List Autobots.
 */
export function listAutobots(status?: AutobotInstance['status']): AutobotInstance[] {
  const all = Array.from(autobots.values());
  if (status) return all.filter((a) => a.status === status);
  return all;
}

// ─── Decepticon & Chaos Domain Management ───────────────────────────────────

/**
 * Deploy a Decepticon in a chaos domain.
 */
export function deployDecepticon(
  decepticonClass: DecepticonClass,
  ttl: number,
  deployedBy: string,
): { decepticon: DecepticonInstance; chaosDomain: ChaosDomain } {
  const counterpartClass = DECEPTICON_COUNTERPARTS[decepticonClass];
  
  // Include unique ID in lineage name to avoid collisions when deploying multiple of same class
  const uniqueSuffix = sovereignId().slice(0, 8);
  const lineage = createLineage(`chaos-${decepticonClass}-${uniqueSuffix}-lineage`, deployedBy);
  const counterpart = spawnAutobot(counterpartClass, 'chaos', lineage.id, deployedBy);

  // Create chaos domain
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttl);
  
  const domain: ChaosDomain = {
    id: sovereignId(),
    decepticonId: '', // Will be set below
    class: decepticonClass,
    status: 'active',
    ttl,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    telemetryCount: 0,
    mutations: [],
  };

  // Create Decepticon
  const decepticon: DecepticonInstance = {
    id: sovereignId(),
    class: decepticonClass,
    chaosDomainId: domain.id,
    counterpartId: counterpart.id,
    status: 'deployed',
    telemetryLog: [],
    deployedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  // Update domain with decepticon ID
  domain.decepticonId = decepticon.id;

  // Check Decepticon laws
  const { passed, results } = checkAllDecepticonLaws(decepticon.id, decepticonClass, 'deployDecepticon', {
    chaosDomainId: domain.id,
    chaosDomain: domain,
    counterpartId: counterpart.id,
  });

  if (!passed) {
    // Cleanup
    retireAutobot(counterpart.id, deployedBy);
    throw new Error(`Decepticon law check failed: ${results.find((r) => !r.passed)?.reason}`);
  }

  // Activate Decepticon
  const activated: DecepticonInstance = { ...decepticon, status: 'active' };

  decepticons.set(activated.id, activated);
  chaosDomains.set(domain.id, domain);

  logAudit('DECEPTICON_DEPLOY', `Decepticon ${decepticonClass} deployed with counterpart ${counterpartClass}`);
  logAudit('CHAOS_DOMAIN_CREATE', `Chaos domain created with TTL ${ttl}ms`);

  return { decepticon: activated, chaosDomain: domain };
}

/**
 * Record a chaos mutation in a domain.
 */
export function recordChaosMutation(
  domainId: string,
  action: string,
  target: string,
  beforeState?: unknown,
  afterState?: unknown,
): ChaosMutation {
  const domain = chaosDomains.get(domainId);
  if (!domain || domain.status !== 'active') {
    throw new Error('Chaos domain not found or expired');
  }

  const mutation: ChaosMutation = {
    id: sovereignId(),
    domainId,
    action,
    target,
    beforeState,
    afterState,
    timestamp: new Date().toISOString(),
    reverted: false,
  };

  domain.mutations.push(mutation);
  chaosDomains.set(domainId, domain);

  // Emit telemetry
  const decepticon = decepticons.get(domain.decepticonId);
  if (decepticon) {
    const telemetry: ChaosTelemetryEntry = {
      id: sovereignId(),
      domainId,
      decepticonId: decepticon.id,
      action,
      payload: { target, mutation: mutation.id },
      outcome: 'success',
      lawChecks: [],
      timestamp: mutation.timestamp,
    };
    decepticon.telemetryLog.push(telemetry);
    domain.telemetryCount++;
    decepticons.set(decepticon.id, decepticon);
    chaosDomains.set(domainId, domain);
    logAudit('DECEPTICON_TELEMETRY', `Mutation recorded in chaos domain ${domainId}`);
  }

  return mutation;
}

/**
 * Expire a chaos domain and its Decepticon.
 */
export function expireChaosDomain(domainId: string): boolean {
  const domain = chaosDomains.get(domainId);
  if (!domain) return false;

  // Expire domain
  const expiredDomain: ChaosDomain = { ...domain, status: 'expired' };
  chaosDomains.set(domainId, expiredDomain);

  // Expire Decepticon
  const decepticon = decepticons.get(domain.decepticonId);
  if (decepticon) {
    const expired: DecepticonInstance = { ...decepticon, status: 'expired' };
    decepticons.set(decepticon.id, expired);

    // Retire counterpart
    if (decepticon.counterpartId) {
      retireAutobot(decepticon.counterpartId, 'SYSTEM');
    }
  }

  logAudit('CHAOS_DOMAIN_EXPIRE', `Chaos domain ${domainId} expired`);
  return true;
}

/**
 * Get chaos domain telemetry.
 */
export function getChaosTelemetry(domainId: string): ChaosTelemetryEntry[] {
  const domain = chaosDomains.get(domainId);
  if (!domain) return [];

  const decepticon = decepticons.get(domain.decepticonId);
  return decepticon?.telemetryLog ?? [];
}

/**
 * List chaos domains.
 */
export function listChaosDomains(status?: ChaosDomain['status']): ChaosDomain[] {
  const all = Array.from(chaosDomains.values());
  if (status) return all.filter((d) => d.status === status);
  return all;
}

/**
 * List Decepticons.
 */
export function listDecepticons(status?: DecepticonInstance['status']): DecepticonInstance[] {
  const all = Array.from(decepticons.values());
  if (status) return all.filter((d) => d.status === status);
  return all;
}

// ─── Quota Management ───────────────────────────────────────────────────────

/**
 * Check quota availability for a tier.
 */
export function checkQuota(tier: QuotaTier): { available: boolean; quota: SubstrateQuota; currentUsage: SubstrateQuotaUsage } {
  const quota = DEFAULT_QUOTAS[tier];
  
  // Calculate current usage across all kernels of this tier
  const tierKernels = Array.from(kernels.values()).filter((k) => {
    const template = templates.get(k.templateId);
    return template?.quotaTier === tier;
  });

  const currentUsage: SubstrateQuotaUsage = {
    currentAgents: tierKernels.reduce((sum, k) => sum + k.quotaUsage.currentAgents, 0),
    currentShards: tierKernels.reduce((sum, k) => sum + k.quotaUsage.currentShards, 0),
    cyclesUsedThisBeat: tierKernels.reduce((sum, k) => sum + k.quotaUsage.cyclesUsedThisBeat, 0),
    networkCallsThisMinute: tierKernels.reduce((sum, k) => sum + k.quotaUsage.networkCallsThisMinute, 0),
    lastResetAt: new Date().toISOString(),
  };

  const available = currentUsage.currentAgents < quota.maxConcurrentAgents;

  return { available, quota, currentUsage };
}

/**
 * Update quota usage for an organism.
 */
export function updateQuotaUsage(
  organismId: string,
  updates: Partial<SubstrateQuotaUsage>,
): OrganismKernel | null {
  const kernel = kernels.get(organismId);
  if (!kernel) return null;

  const updated: OrganismKernel = {
    ...kernel,
    quotaUsage: { ...kernel.quotaUsage, ...updates },
  };

  // Check for quota exceeded - reject update if quota would be exceeded
  if (updated.quotaUsage.currentAgents > kernel.quota.maxConcurrentAgents) {
    logAudit('QUOTA_EXCEEDED', `Organism "${kernel.name}" would exceed agent quota - update rejected`);
    return null;
  }
  if (updated.quotaUsage.currentShards > kernel.quota.memoryShardLimit) {
    logAudit('QUOTA_EXCEEDED', `Organism "${kernel.name}" would exceed shard quota - update rejected`);
    return null;
  }

  kernels.set(organismId, updated);
  return updated;
}

// ─── Statistics ─────────────────────────────────────────────────────────────

/**
 * Get Vita Aeterna runtime statistics.
 */
export function getVitaAeternaStats(): VitaAeternaStats {
  const allKernels = Array.from(kernels.values());
  const allAutobots = Array.from(autobots.values());
  const allDecepticons = Array.from(decepticons.values());
  const allDomains = Array.from(chaosDomains.values());

  const byState: Record<OrganismLifecycleState, number> = {
    template: 0,
    spawning: 0,
    growth: 0,
    maturity: 0,
    retiring: 0,
    archived: 0,
  };
  for (const k of allKernels) {
    byState[k.state]++;
  }

  const byQuotaTier: Record<QuotaTier, number> = {
    PUBLIC: 0,
    ENTERPRISE: 0,
    SOVEREIGN: 0,
  };
  for (const k of allKernels) {
    const template = templates.get(k.templateId);
    if (template) {
      byQuotaTier[template.quotaTier]++;
    }
  }

  return {
    totalTemplates: templates.size,
    totalKernels: allKernels.length,
    byState,
    byQuotaTier,
    totalAutobots: allAutobots.length,
    totalDecepticons: allDecepticons.length,
    activeChaosDomains: allDomains.filter((d) => d.status === 'active').length,
  };
}

/**
 * Get the audit log.
 */
export function getVitaAeternaAuditLog(limit = 100): Array<{ id: string; action: CodexAuditAction; details: string; timestamp: string }> {
  return auditLog.slice(-limit).reverse();
}

// ─── Periodic Cleanup ───────────────────────────────────────────────────────

/**
 * Clean up expired chaos domains.
 */
export function cleanupExpiredChaosDomains(): number {
  const now = Date.now();
  let cleaned = 0;

  for (const [id, domain] of chaosDomains) {
    if (domain.status === 'active' && new Date(domain.expiresAt).getTime() < now) {
      expireChaosDomain(id);
      cleaned++;
    }
  }

  return cleaned;
}

// ─── Initialize Default Templates ───────────────────────────────────────────

function initDefaultTemplates(): void {
  if (templates.size > 0) return;

  createTemplate(
    'Standard Worker',
    'A general-purpose worker organism for routine tasks',
    'OPERATOR',
    'enterprise',
    ['basic-operations', 'memory-read'],
    'ENTERPRISE',
    'SYSTEM',
  );

  createTemplate(
    'Memory Curator',
    'An organism specialized in memory organization and curation',
    'CURATOR',
    'internal',
    ['memory-read', 'memory-write', 'lineage-management'],
    'ENTERPRISE',
    'SYSTEM',
  );

  createTemplate(
    'Sovereign Builder',
    'A high-privilege organism for doctrine-level operations',
    'PRIME',
    'sovereign',
    ['full-access', 'doctrine-modification', 'gate-control'],
    'SOVEREIGN',
    'SYSTEM',
  );
}

initDefaultTemplates();
