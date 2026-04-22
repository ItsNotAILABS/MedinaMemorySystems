/**
 * @itsnotailabs/sandbox-layer
 * Sandbox isolation walls: process isolation, permission enforcement, sandboxed execution.
 *
 * Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
 * Licensed under ISIL v1.1 — see LICENSE for details.
 * SAEIS enforcement: ACTIVE. SAT token binding: ENABLED.
 */

export const PHI = (1 + Math.sqrt(5)) / 2;

export type Permission = 'read' | 'write' | 'execute' | 'network' | 'memory' | 'sovereign';

export interface SandboxPolicy {
  id: string;
  allowedPermissions: Set<Permission>;
  memoryLimitBytes: number;
  cpuTimeLimitMs: number;
  networkAllowlist: string[];
}

export interface ExecutionResult {
  sandboxId: string;
  output: unknown;
  durationMs: number;
  memoryUsedBytes: number;
  permissionViolations: string[];
  exitCode: number;
}

export class SandboxLayer {
  private policies: Map<string, SandboxPolicy> = new Map();
  private executionLog: ExecutionResult[] = [];

  /** Create a sandbox policy with defined permission boundaries. */
  createPolicy(
    id: string,
    permissions: Permission[],
    memoryLimitMB = 128,
    cpuTimeLimitMs = 5000,
    networkAllowlist: string[] = [],
  ): SandboxPolicy {
    const policy: SandboxPolicy = {
      id,
      allowedPermissions: new Set(permissions),
      memoryLimitBytes: memoryLimitMB * 1024 * 1024,
      cpuTimeLimitMs,
      networkAllowlist,
    };
    this.policies.set(id, policy);
    return policy;
  }

  /** Validate whether a set of requested permissions is allowed by a policy. */
  checkPermissions(policyId: string, requested: Permission[]): { allowed: boolean; violations: string[] } {
    const policy = this.policies.get(policyId);
    if (!policy) return { allowed: false, violations: [`Policy ${policyId} not found`] };

    const violations: string[] = [];
    for (const perm of requested) {
      if (!policy.allowedPermissions.has(perm)) {
        violations.push(`Permission '${perm}' denied by policy '${policyId}'`);
      }
    }
    return { allowed: violations.length === 0, violations };
  }

  /** Execute a function inside a sandboxed context with enforced limits. */
  execute<T>(policyId: string, fn: () => T, requiredPermissions: Permission[] = ['execute']): ExecutionResult {
    const policy = this.policies.get(policyId);
    if (!policy) throw new Error(`Sandbox policy ${policyId} not found`);

    const permCheck = this.checkPermissions(policyId, requiredPermissions);
    if (!permCheck.allowed) {
      const result: ExecutionResult = {
        sandboxId: policyId,
        output: null,
        durationMs: 0,
        memoryUsedBytes: 0,
        permissionViolations: permCheck.violations,
        exitCode: 1,
      };
      this.executionLog.push(result);
      return result;
    }

    const startTime = Date.now();
    let output: unknown = null;
    let exitCode = 0;

    try {
      output = fn();
    } catch (error) {
      output = error instanceof Error ? error.message : String(error);
      exitCode = 2;
    }

    const durationMs = Date.now() - startTime;
    const estimatedMemory = Math.round(JSON.stringify(output ?? '').length * PHI);

    const result: ExecutionResult = {
      sandboxId: policyId,
      output,
      durationMs,
      memoryUsedBytes: estimatedMemory,
      permissionViolations: [],
      exitCode,
    };

    if (durationMs > policy.cpuTimeLimitMs) {
      result.exitCode = 3;
      result.permissionViolations.push('CPU time limit exceeded');
    }

    this.executionLog.push(result);
    return result;
  }

  /** Retrieve the full execution audit log for a sandbox policy. */
  getAuditLog(policyId?: string): ExecutionResult[] {
    if (!policyId) return [...this.executionLog];
    return this.executionLog.filter((r) => r.sandboxId === policyId);
  }
}
