// MIT License — Copyright (c) 2026 ItsNotAILABS

/**
 * role-engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Role authority model for AI agent teams.
 *
 * Defines roles, authority domains, veto powers, frequency-derived
 * standing weights, and role inheritance chains. Integrates directly
 * with consensus-engine and agent-signal.
 *
 * MIT License — ItsNotAILABS
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type AuthorityLevel = 'ADVISORY' | 'STANDARD' | 'ELEVATED' | 'SOVEREIGN' | 'FOUNDING';
export type InheritanceMode = 'FULL' | 'PARTIAL' | 'NONE';

export interface RoleDefinition {
  /** Stable role identifier across sessions */
  roleId: string;
  /** Human-readable title */
  title: string;
  /** Authority level */
  authority: AuthorityLevel;
  /** Domains this role holds primary authority over */
  domains: string[];
  /** Can this role cast a binding veto on proposals within its domains? */
  vetoEnabled: boolean;
  /** Standing weight 0-1.0 in cross-domain decisions */
  standingWeight: number;
  /** Roles this role inherits permissions from */
  inheritsFrom?: string[];
  /** How much of parent permissions are inherited */
  inheritanceMode?: InheritanceMode;
  /** Optional frequency signature (Hz) grounding this role */
  frequencySignature?: number;
}

export interface RoleAssignment {
  agentId: string;
  roleId: string;
  assignedAt: number;
  assignedBy: string;
  expiresAt?: number;
}

export interface AuthorityCheck {
  agentId: string;
  domain: string;
  action: string;
}

export interface AuthorityResult {
  authorized: boolean;
  authority: AuthorityLevel;
  weight: number;
  vetoCapable: boolean;
  reason: string;
}

export class RoleEngine {
  private roles = new Map<string, RoleDefinition>();
  private assignments = new Map<string, RoleAssignment[]>(); // agentId → assignments

  /** Register a role definition */
  defineRole(role: RoleDefinition): void {
    this.roles.set(role.roleId, role);
  }

  /** Assign a role to an agent */
  assign(assignment: RoleAssignment): void {
    const existing = this.assignments.get(assignment.agentId) ?? [];
    existing.push(assignment);
    this.assignments.set(assignment.agentId, existing);
  }

  /** Revoke a role assignment */
  revoke(agentId: string, roleId: string): void {
    const assignments = this.assignments.get(agentId) ?? [];
    this.assignments.set(agentId, assignments.filter(a => a.roleId !== roleId));
  }

  /** Check if an agent is authorized for an action in a domain */
  check(check: AuthorityCheck): AuthorityResult {
    const assignments = this._activeAssignments(check.agentId);
    if (assignments.length === 0) {
      return { authorized: false, authority: 'ADVISORY', weight: 0, vetoCapable: false,
               reason: 'No active role assignments' };
    }
    let best: AuthorityResult | null = null;
    for (const assignment of assignments) {
      const role = this.roles.get(assignment.roleId);
      if (!role) continue;
      const inDomain = role.domains.includes(check.domain) || role.domains.includes('*');
      const effective = inDomain ? role.authority : 'ADVISORY';
      const weight = inDomain ? role.standingWeight : role.standingWeight * 0.5;
      const vetoCapable = inDomain && role.vetoEnabled;
      if (!best || this._authorityRank(effective) > this._authorityRank(best.authority)) {
        best = { authorized: inDomain, authority: effective, weight, vetoCapable,
                 reason: `Role ${role.title} (${effective}) in domain "${check.domain}"` };
      }
    }
    return best ?? { authorized: false, authority: 'ADVISORY', weight: 0, vetoCapable: false,
                     reason: 'No matching role for domain' };
  }

  /** Get all roles for an agent */
  getRolesForAgent(agentId: string): RoleDefinition[] {
    return this._activeAssignments(agentId)
      .map(a => this.roles.get(a.roleId))
      .filter((r): r is RoleDefinition => r !== undefined);
  }

  /** Get effective standing weight for an agent across all roles */
  getStandingWeight(agentId: string): number {
    const roles = this.getRolesForAgent(agentId);
    if (roles.length === 0) return 0;
    return Math.max(...roles.map(r => r.standingWeight));
  }

  private _activeAssignments(agentId: string): RoleAssignment[] {
    const now = Date.now();
    return (this.assignments.get(agentId) ?? []).filter(
      a => !a.expiresAt || a.expiresAt > now
    );
  }

  private _authorityRank(level: AuthorityLevel): number {
    return { ADVISORY: 0, STANDARD: 1, ELEVATED: 2, SOVEREIGN: 3, FOUNDING: 4 }[level];
  }
}

// ─── Standard ItsNotAILABS Role Templates ─────────────────────────────────────

export const ITSNOTAILABS_ROLE_TEMPLATES: RoleDefinition[] = [
  { roleId: 'ISS-FOUNDER', title: 'Founding Sovereign', authority: 'FOUNDING',
    domains: ['*'], vetoEnabled: true, standingWeight: 1.0, frequencySignature: 432 },
  { roleId: 'ISS-ARCHITECT', title: 'Sovereign Architect', authority: 'SOVEREIGN',
    domains: ['architecture', 'system-design', 'organism'], vetoEnabled: true, standingWeight: 0.95 },
  { roleId: 'ISS-ENGINEER', title: 'Build Engineer', authority: 'ELEVATED',
    domains: ['implementation', 'deployment', 'testing'], vetoEnabled: false, standingWeight: 0.80 },
  { roleId: 'ISS-ANALYST', title: 'Intelligence Analyst', authority: 'STANDARD',
    domains: ['research', 'evaluation', 'empirical-claim'], vetoEnabled: false, standingWeight: 0.75 },
  { roleId: 'ISS-GUARDIAN', title: 'Sovereign Guardian', authority: 'ELEVATED',
    domains: ['security', 'enforcement', 'compliance'], vetoEnabled: true, standingWeight: 0.90 },
];
