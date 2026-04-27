import type { Gate, GateId, GateStatus } from '@/types';
import { getGates, setGateStatus } from './governanceEngine';
import { PORTA_SOVEREIGNA } from './sovereignLanguage';

// ─── Gate Enforcement — PORTA SOVEREIGNA ─────────────────────────────────────
//
// PORTA SOVEREIGNA: the single enforcement surface through which all
// inter-organism, inter-domain, and external communications must pass.
// Gates A, B, and C are the three portals of this sovereign gateway.
//
// Doctrine: PORTA SOVEREIGNA.doctrine
export { PORTA_SOVEREIGNA };

export interface GateCheckResult {
  allowed: boolean;
  gate: Gate;
  reason: string;
}

const GATE_RULES: Record<GateId, Record<GateStatus, { allowed: boolean; reason: string }>> = {
  A: {
    green: { allowed: true, reason: 'Gate A is green. Governance operations permitted.' },
    amber: { allowed: true, reason: 'Gate A is amber. Dual approval required for enactment.' },
    red: { allowed: false, reason: 'Gate A is red. Governance enactment blocked.' },
  },
  B: {
    green: { allowed: true, reason: 'Gate B is green. Full memory access permitted.' },
    amber: { allowed: true, reason: 'Gate B is amber. Write operations require justification.' },
    red: { allowed: false, reason: 'Gate B is red. Memory is read-only.' },
  },
  C: {
    green: { allowed: true, reason: 'Gate C is green. Sovereign operations active.' },
    amber: { allowed: true, reason: 'Gate C is amber. Broadcast operations limited.' },
    red: { allowed: false, reason: 'Gate C is red. Organism is in hibernation mode.' },
  },
};

export function checkGate(gateId: GateId): GateCheckResult {
  const gates = getGates();
  const gate = gates.find((g) => g.id === gateId);
  if (!gate) {
    return { allowed: false, gate: { id: gateId, name: 'Unknown', status: 'red', description: '', lastChecked: new Date().toISOString() }, reason: `Gate ${gateId} not found.` };
  }

  const rule = GATE_RULES[gateId][gate.status];
  return { allowed: rule.allowed, gate, reason: rule.reason };
}

export function enforceGate(gateId: GateId, operation: string): void | never {
  const result = checkGate(gateId);
  if (!result.allowed) {
    throw new Error(`Gate ${gateId} enforcement: ${result.reason} (Operation: ${operation})`);
  }
}

export function checkAllGates(): Record<GateId, GateCheckResult> {
  return {
    A: checkGate('A'),
    B: checkGate('B'),
    C: checkGate('C'),
  };
}

export function escalateGate(gateId: GateId): Gate | null {
  const gates = getGates();
  const gate = gates.find((g) => g.id === gateId);
  if (!gate) return null;

  const escalation: Record<GateStatus, GateStatus | null> = {
    green: 'amber',
    amber: 'red',
    red: null,
  };

  const next = escalation[gate.status];
  if (!next) return gate; // Already at max
  return setGateStatus(gateId, next);
}

export function resolveGate(gateId: GateId): Gate | null {
  const gates = getGates();
  const gate = gates.find((g) => g.id === gateId);
  if (!gate) return null;

  const resolution: Record<GateStatus, GateStatus | null> = {
    red: 'amber',
    amber: 'green',
    green: null,
  };

  const next = resolution[gate.status];
  if (!next) return gate;
  return setGateStatus(gateId, next);
}
