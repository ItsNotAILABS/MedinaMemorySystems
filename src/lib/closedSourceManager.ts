/**
 * MEDINA Closed Source Manager
 *
 * The organism's facade manager. Internal systems are registered with both a
 * private (internal) description and a sanitized public description. External
 * consumers see only the public projection; authorized actors may inspect the
 * full internal view.
 *
 * This pattern allows the sovereign architecture to expose capability surfaces
 * to partners and integrators without revealing implementation detail, security
 * posture, or architectural internals.
 *
 * Default authorized actors: 'Sovereign', 'Founder'.
 *
 * @module closedSourceManager
 */

import { sovereignId } from './sovereign-id';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ModuleRecord {
  id: string;
  moduleId: string;
  internalDescription: string;
  publicDescription: string;
  registeredAt: string;
  updatedAt: string;
}

export interface PublicModuleView {
  moduleId: string;
  description: string;
  registeredAt: string;
}

export interface InternalModuleView {
  moduleId: string;
  internalDescription: string;
  publicDescription: string;
  registeredAt: string;
  updatedAt: string;
}

export interface AuthorizedActor {
  actorId: string;
  grantedBy: string;
  grantedAt: string;
}

export interface ModuleStats {
  totalModules: number;
  authorizedActors: number;
  publicDescriptions: number;
  internalDescriptions: number;
}

// ─── State ──────────────────────────────────────────────────────────────────

const modules: Map<string, ModuleRecord> = new Map();
const authorizedActors: Map<string, AuthorizedActor> = new Map();

// Seed default authorized actors
(function seedDefaults() {
  const now = new Date().toISOString();
  authorizedActors.set('Sovereign', {
    actorId: 'Sovereign',
    grantedBy: 'System',
    grantedAt: now,
  });
  authorizedActors.set('Founder', {
    actorId: 'Founder',
    grantedBy: 'System',
    grantedAt: now,
  });
})();

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Register a module with both an internal and a public description.
 * If a module with the same moduleId already exists it is updated.
 */
export function registerModule(
  moduleId: string,
  internalDescription: string,
  publicDescription: string,
): ModuleRecord {
  const existing = modules.get(moduleId);
  const now = new Date().toISOString();

  const record: ModuleRecord = {
    id: existing?.id ?? sovereignId(),
    moduleId,
    internalDescription,
    publicDescription,
    registeredAt: existing?.registeredAt ?? now,
    updatedAt: now,
  };
  modules.set(moduleId, record);
  return record;
}

/**
 * Returns only the sanitized public description for the given module.
 */
export function getPublicView(moduleId: string): PublicModuleView | null {
  const record = modules.get(moduleId);
  if (!record) return null;
  return {
    moduleId: record.moduleId,
    description: record.publicDescription,
    registeredAt: record.registeredAt,
  };
}

/**
 * Returns the full internal view of a module. Only authorized actors may call
 * this; returns null for unauthorized callers.
 */
export function getInternalView(
  moduleId: string,
  actorId: string,
): InternalModuleView | null {
  if (!isAuthorized(actorId)) return null;

  const record = modules.get(moduleId);
  if (!record) return null;

  return {
    moduleId: record.moduleId,
    internalDescription: record.internalDescription,
    publicDescription: record.publicDescription,
    registeredAt: record.registeredAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Returns a sanitized list of all modules for public consumption.
 */
export function listPublicModules(): PublicModuleView[] {
  return Array.from(modules.values()).map((r) => ({
    moduleId: r.moduleId,
    description: r.publicDescription,
    registeredAt: r.registeredAt,
  }));
}

/**
 * Returns the full internal list of all modules. Only authorized actors may
 * call this; returns an empty array for unauthorized callers.
 */
export function listInternalModules(actorId: string): InternalModuleView[] {
  if (!isAuthorized(actorId)) return [];

  return Array.from(modules.values()).map((r) => ({
    moduleId: r.moduleId,
    internalDescription: r.internalDescription,
    publicDescription: r.publicDescription,
    registeredAt: r.registeredAt,
    updatedAt: r.updatedAt,
  }));
}

/**
 * Check whether an actor has been granted internal access.
 */
export function isAuthorized(actorId: string): boolean {
  return authorizedActors.has(actorId);
}

/**
 * Grant internal access to a new actor.
 */
export function addAuthorizedActor(
  actorId: string,
  grantedBy: string,
): AuthorizedActor {
  const existing = authorizedActors.get(actorId);
  if (existing) return existing;

  const entry: AuthorizedActor = {
    actorId,
    grantedBy,
    grantedAt: new Date().toISOString(),
  };
  authorizedActors.set(actorId, entry);
  return entry;
}

/**
 * Returns stats about registered modules and authorization state.
 */
export function getModuleStats(): ModuleStats {
  const all = Array.from(modules.values());
  return {
    totalModules: all.length,
    authorizedActors: authorizedActors.size,
    publicDescriptions: all.filter((m) => m.publicDescription.length > 0).length,
    internalDescriptions: all.filter((m) => m.internalDescription.length > 0).length,
  };
}
