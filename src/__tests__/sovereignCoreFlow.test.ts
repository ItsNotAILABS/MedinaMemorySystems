import {
  type IdentityTier, type AccessStatus, type GateFlowStatus,
  type ProposalFlowStatus, type ContractFlowStatus, type EncryptionAlgorithm,
  type CoreFlowHealth,
  createSovereignIdentity, authenticateIdentity, suspendIdentity, revokeIdentity,
  getSovereignIdentities, getSovereignIdentity, getIdentitiesByTier, getAccessEvents, getDeniedAccessEvents,
  getEncryptionSurfaces, rotateEncryptionKey, rotateAllDueSurfaces, getSurfacesByAlgorithm,
  checkGateFlow, checkAllGateFlows, escalateGateFlow, getGateEntries, getChallengedGates,
  createGovernanceProposal, voteOnFlowProposal, enactFlowProposal, getGovernanceProposals, getProposalsByStatus,
  createSovereignContract, signContract, revokeContract, getSovereignContracts, getActiveContracts, getContractsByType,
  getCoreAuditLog, getAuditBySeverity,
  getSovereignCoreRecommendations, getPendingSovereignRecs, applySovereignRec,
  runSovereignCoreCycle, getSovereignCoreCycles, getSovereignCoreDashboard,
} from '../lib/sovereignCoreFlow';

describe('Sovereign Core Flow — Identity', () => {
  let id1: ReturnType<typeof createSovereignIdentity>;

  it('createSovereignIdentity creates an active identity', () => {
    id1 = createSovereignIdentity('founder-prime', 'founder');
    expect(id1.id).toBeTruthy();
    expect(id1.status).toBe('active');
    expect(id1.tier).toBe('founder');
    expect(id1.mfaEnabled).toBe(true);
    expect(id1.phiScore).toBeGreaterThanOrEqual(0);
    expect(id1.phiScore).toBeLessThanOrEqual(1);
  });

  it('createSovereignIdentity defaults to agent tier', () => {
    const id = createSovereignIdentity('agent-one');
    expect(id.tier).toBe('agent');
    expect(id.mfaEnabled).toBe(false);
  });

  it('authenticateIdentity grants access for active identity', () => {
    const event = authenticateIdentity(id1.id, 'vault://founder-data');
    expect(event.outcome).toBe('granted');
    expect(event.autoHandled).toBe(true);
  });

  it('authenticateIdentity denies for non-existent identity', () => {
    const event = authenticateIdentity('ghost-id', 'resource');
    expect(event.outcome).toBe('denied');
  });

  it('suspendIdentity changes status to suspended', () => {
    const agent = createSovereignIdentity('to-suspend', 'agent');
    const result = suspendIdentity(agent.id);
    expect(result).toBeDefined();
    expect(result!.status).toBe('suspended');
  });

  it('revokeIdentity changes status to revoked', () => {
    const agent = createSovereignIdentity('to-revoke', 'agent');
    const result = revokeIdentity(agent.id);
    expect(result).toBeDefined();
    expect(result!.status).toBe('revoked');
  });

  it('getSovereignIdentities accumulates', () => {
    expect(getSovereignIdentities().length).toBeGreaterThanOrEqual(3);
  });

  it('getSovereignIdentity retrieves by id', () => {
    const found = getSovereignIdentity(id1.id);
    expect(found).toBeDefined();
    expect(found!.principalName).toBe('founder-prime');
  });

  it('getIdentitiesByTier filters correctly', () => {
    createSovereignIdentity('op-1', 'operator');
    const ops = getIdentitiesByTier('operator');
    expect(ops.length).toBeGreaterThan(0);
    for (const i of ops) expect(i.tier).toBe('operator');
  });

  it('getDeniedAccessEvents returns only denied events', () => {
    for (const e of getDeniedAccessEvents()) expect(e.outcome).toBe('denied');
  });
});

describe('Sovereign Core Flow — Encryption', () => {
  it('getEncryptionSurfaces returns 5 pre-seeded surfaces', () => {
    expect(getEncryptionSurfaces().length).toBe(5);
  });

  it('encryption surfaces have valid algorithm', () => {
    const validAlgos: EncryptionAlgorithm[] = ['phi-lattice', 'schumann-aes', 'golden-chacha', 'sovereign-kyber'];
    for (const s of getEncryptionSurfaces()) {
      expect(validAlgos).toContain(s.algorithm);
    }
  });

  it('rotateEncryptionKey updates lastRotatedAt and clears rotation flag', () => {
    const surface = getEncryptionSurfaces().find(s => s.keyRotationDue)
      ?? getEncryptionSurfaces()[0];
    surface.keyRotationDue = true;
    const result = rotateEncryptionKey(surface.id);
    expect(result).toBeDefined();
    expect(result!.keyRotationDue).toBe(false);
    expect(result!.lastRotatedAt).toBeTruthy();
  });

  it('rotateEncryptionKey returns undefined for unknown id', () => {
    expect(rotateEncryptionKey('ghost')).toBeUndefined();
  });

  it('rotateAllDueSurfaces returns array', () => {
    expect(Array.isArray(rotateAllDueSurfaces())).toBe(true);
  });

  it('getSurfacesByAlgorithm filters correctly', () => {
    const phiSurfaces = getSurfacesByAlgorithm('phi-lattice');
    for (const s of phiSurfaces) expect(s.algorithm).toBe('phi-lattice');
  });
});

describe('Sovereign Core Flow — Gates', () => {
  it('checkGateFlow returns a gate entry', () => {
    const entry = checkGateFlow('gate-sovereign');
    expect(entry.id).toBeTruthy();
    expect(entry.gateId).toBe('gate-sovereign');
    expect(['open', 'challenged', 'auto-resolved']).toContain(entry.status);
  });

  it('checkAllGateFlows checks 5 gates', () => {
    const results = checkAllGateFlows();
    expect(results.length).toBe(5);
  });

  it('escalateGateFlow escalates a challenged gate', () => {
    // Force a challenged gate entry
    const entry = checkGateFlow('gate-operator');
    if (entry.status !== 'auto-resolved') {
      const result = escalateGateFlow('gate-operator', 'sovereign-team');
      if (result) {
        expect(result.status).toBe('escalated');
        expect(result.escalatedTo).toBe('sovereign-team');
      }
    }
  });

  it('getGateEntries accumulates', () => {
    expect(getGateEntries().length).toBeGreaterThan(0);
  });

  it('getChallengedGates returns only challenged/escalated', () => {
    for (const g of getChallengedGates()) {
      expect(['challenged', 'escalated']).toContain(g.status);
    }
  });
});

describe('Sovereign Core Flow — Governance', () => {
  let proposalId: string;

  it('createGovernanceProposal returns a draft proposal', () => {
    const p = createGovernanceProposal('Adopt phi-lattice for all surfaces', 'Upgrade encryption everywhere');
    proposalId = p.id;
    expect(p.id).toBeTruthy();
    expect(p.status).toBe('draft');
    expect(p.votesFor).toBe(0);
  });

  it('voteOnFlowProposal adds votes', () => {
    const result = voteOnFlowProposal(proposalId, 'for', 2);
    expect(result).toBeDefined();
    expect(result!.votesFor).toBe(2);
  });

  it('voteOnFlowProposal sets quorumMet when enough votes', () => {
    voteOnFlowProposal(proposalId, 'for', 2);
    const p = getGovernanceProposals().find(p => p.id === proposalId);
    expect(p!.quorumMet).toBe(true);
  });

  it('enactFlowProposal enacts a passing proposal', () => {
    const result = enactFlowProposal(proposalId);
    expect(result).toBeDefined();
    expect(result!.status).toBe('enacted');
    expect(result!.enactedAt).toBeTruthy();
  });

  it('getProposalsByStatus filters correctly', () => {
    for (const p of getProposalsByStatus('enacted')) expect(p.status).toBe('enacted');
  });
});

describe('Sovereign Core Flow — Contracts', () => {
  let contractId: string;

  it('createSovereignContract creates a draft contract', () => {
    const c = createSovereignContract('Founder Access Grant', 'access-grant', ['founder', 'organism']);
    contractId = c.id;
    expect(c.id).toBeTruthy();
    expect(c.status).toBe('draft');
    expect(c.phiSeal).toBeTruthy();
    expect(c.parties.length).toBe(2);
  });

  it('signContract marks pending when not all signed', () => {
    const result = signContract(contractId, 'founder');
    expect(result).toBeDefined();
    expect(result!.status).toBe('pending');
    expect(result!.signedBy).toContain('founder');
  });

  it('signContract activates when all parties signed', () => {
    const result = signContract(contractId, 'organism');
    expect(result!.status).toBe('active');
    expect(result!.executedAt).toBeTruthy();
  });

  it('getActiveContracts returns active contracts', () => {
    const active = getActiveContracts();
    expect(active.length).toBeGreaterThan(0);
    for (const c of active) expect(c.status).toBe('active');
  });

  it('revokeContract changes status to revoked', () => {
    const c = createSovereignContract('Test Contract', 'data-processing', ['party-a']);
    const result = revokeContract(c.id);
    expect(result!.status).toBe('revoked');
    expect(result!.revokedAt).toBeTruthy();
  });

  it('getContractsByType filters correctly', () => {
    for (const c of getContractsByType('access-grant')) expect(c.type).toBe('access-grant');
  });
});

describe('Sovereign Core Flow — Audit & Recommendations', () => {
  it('getCoreAuditLog returns entries', () => {
    expect(getCoreAuditLog().length).toBeGreaterThan(0);
  });

  it('getAuditBySeverity filters correctly', () => {
    for (const e of getAuditBySeverity('info')) expect(e.severity).toBe('info');
  });

  it('applySovereignRec marks as applied', () => {
    runSovereignCoreCycle();
    const recs = getPendingSovereignRecs();
    if (recs.length > 0) {
      const result = applySovereignRec(recs[0].id);
      expect(result).toBeDefined();
      expect(result!.applied).toBe(true);
    }
  });
});

describe('Sovereign Core Flow — Cycle & Dashboard', () => {
  it('runSovereignCoreCycle returns a complete cycle', () => {
    const cycle = runSovereignCoreCycle();
    expect(cycle.id).toBeTruthy();
    expect(cycle.startedAt).toBeTruthy();
    expect(cycle.completedAt).toBeTruthy();
    expect(cycle.gatesChecked).toBe(5);
    expect(['sovereign', 'stable', 'stressed', 'compromised', 'unknown']).toContain(cycle.coreHealth);
  });

  it('getSovereignCoreCycles accumulates', () => {
    const before = getSovereignCoreCycles().length;
    runSovereignCoreCycle();
    expect(getSovereignCoreCycles().length).toBeGreaterThan(before);
  });

  it('getSovereignCoreDashboard returns correct structure', () => {
    const dash = getSovereignCoreDashboard();
    expect(dash.id).toBe('sovereign-core-dashboard');
    expect(dash.lastRefresh).toBeTruthy();
    expect(dash.encryptionSurfaces).toBe(5);
    expect(typeof dash.deniedAccessPct).toBe('number');
    expect(dash.deniedAccessPct).toBeGreaterThanOrEqual(0);
    expect(dash.deniedAccessPct).toBeLessThanOrEqual(1);
    expect(['sovereign', 'stable', 'stressed', 'compromised', 'unknown']).toContain(dash.coreHealth);
  });
});
