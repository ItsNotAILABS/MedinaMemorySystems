/**
 * Tests for governanceEngine.ts
 * Tests gates, proposals, voting, and audit functionality
 */

// Reset module state between tests
let governanceEngine: typeof import('@/lib/governanceEngine');

beforeEach(() => {
  jest.resetModules();
  governanceEngine = require('@/lib/governanceEngine');
});

describe('governanceEngine', () => {
  describe('gates', () => {
    describe('getGates', () => {
      it('should return all gates', () => {
        const gates = governanceEngine.getGates();
        
        expect(gates.length).toBe(3);
        expect(gates.map(g => g.id)).toContain('A');
        expect(gates.map(g => g.id)).toContain('B');
        expect(gates.map(g => g.id)).toContain('C');
      });

      it('should return gates with proper structure', () => {
        const gates = governanceEngine.getGates();
        
        for (const gate of gates) {
          expect(gate).toHaveProperty('id');
          expect(gate).toHaveProperty('name');
          expect(gate).toHaveProperty('status');
          expect(gate).toHaveProperty('description');
          expect(gate).toHaveProperty('lastChecked');
        }
      });
    });

    describe('getGate', () => {
      it('should return specific gate by id', () => {
        const gateA = governanceEngine.getGate('A');
        
        expect(gateA).toBeDefined();
        expect(gateA?.id).toBe('A');
        expect(gateA?.name).toBe('Governance Gate');
      });

      it('should return undefined for invalid gate id', () => {
        const gate = governanceEngine.getGate('Z' as any);
        expect(gate).toBeUndefined();
      });
    });

    describe('setGateStatus', () => {
      it('should update gate status to green', () => {
        const updated = governanceEngine.setGateStatus('C', 'green');
        
        expect(updated).not.toBeNull();
        expect(updated?.status).toBe('green');
      });

      it('should update gate status to amber', () => {
        const updated = governanceEngine.setGateStatus('A', 'amber');
        
        expect(updated).not.toBeNull();
        expect(updated?.status).toBe('amber');
      });

      it('should update gate status to red', () => {
        const updated = governanceEngine.setGateStatus('B', 'red');
        
        expect(updated).not.toBeNull();
        expect(updated?.status).toBe('red');
      });

      it('should update lastChecked timestamp', () => {
        const before = governanceEngine.getGate('A');
        const updated = governanceEngine.setGateStatus('A', 'green');
        
        expect(new Date(updated!.lastChecked).getTime())
          .toBeGreaterThanOrEqual(new Date(before!.lastChecked).getTime());
      });

      it('should return null for invalid gate id', () => {
        const result = governanceEngine.setGateStatus('X' as any, 'green');
        expect(result).toBeNull();
      });

      it('should create audit log entry', () => {
        governanceEngine.setGateStatus('A', 'amber');
        const auditLog = governanceEngine.getAuditLog();
        
        expect(auditLog.some(e => e.action === 'GATE_STATUS_CHANGE')).toBe(true);
      });
    });
  });

  describe('proposals', () => {
    describe('createProposal', () => {
      it('should create a new proposal with draft status', () => {
        const proposal = governanceEngine.createProposal(
          'Test Proposal',
          'A test description',
          'TestAuthor'
        );
        
        expect(proposal.id).toBeDefined();
        expect(proposal.title).toBe('Test Proposal');
        expect(proposal.description).toBe('A test description');
        expect(proposal.author).toBe('TestAuthor');
        expect(proposal.status).toBe('draft');
      });

      it('should initialize votes to zero', () => {
        const proposal = governanceEngine.createProposal(
          'Vote Test',
          'Description',
          'Author'
        );
        
        expect(proposal.votes.for).toBe(0);
        expect(proposal.votes.against).toBe(0);
        expect(proposal.votes.abstain).toBe(0);
      });

      it('should set affected gates', () => {
        const proposal = governanceEngine.createProposal(
          'Gate Test',
          'Description',
          'Author',
          ['A', 'B']
        );
        
        expect(proposal.affectedGates).toEqual(['A', 'B']);
      });

      it('should set doctrine reference', () => {
        const proposal = governanceEngine.createProposal(
          'Doctrine Test',
          'Description',
          'Author',
          [],
          'DOC-100'
        );
        
        expect(proposal.doctrineRef).toBe('DOC-100');
      });

      it('should create audit log entry', () => {
        governanceEngine.createProposal('Audit Test', 'Desc', 'Author');
        const auditLog = governanceEngine.getAuditLog();
        
        expect(auditLog.some(e => e.action === 'PROPOSAL_CREATED')).toBe(true);
      });
    });

    describe('listProposals', () => {
      it('should return all proposals', () => {
        const proposals = governanceEngine.listProposals();
        
        // Seed data creates 3 proposals
        expect(proposals.length).toBeGreaterThanOrEqual(3);
      });

      it('should filter by status', () => {
        const openProposals = governanceEngine.listProposals('open');
        
        expect(openProposals.every(p => p.status === 'open')).toBe(true);
      });

      it('should sort by createdAt descending', () => {
        const proposals = governanceEngine.listProposals();
        
        for (let i = 1; i < proposals.length; i++) {
          expect(new Date(proposals[i - 1].createdAt).getTime())
            .toBeGreaterThanOrEqual(new Date(proposals[i].createdAt).getTime());
        }
      });

      it('should filter enacted proposals', () => {
        const enacted = governanceEngine.listProposals('enacted');
        
        expect(enacted.every(p => p.status === 'enacted')).toBe(true);
        expect(enacted.length).toBeGreaterThanOrEqual(1); // Seed has one
      });
    });

    describe('getProposal', () => {
      it('should retrieve proposal by id', () => {
        const created = governanceEngine.createProposal('Get Test', 'Desc', 'Author');
        const retrieved = governanceEngine.getProposal(created.id);
        
        expect(retrieved).toEqual(created);
      });

      it('should return undefined for non-existent id', () => {
        const result = governanceEngine.getProposal('non-existent');
        expect(result).toBeUndefined();
      });
    });

    describe('openProposal', () => {
      it('should change status from draft to open', () => {
        const proposal = governanceEngine.createProposal('Open Test', 'Desc', 'Author');
        const opened = governanceEngine.openProposal(proposal.id);
        
        expect(opened?.status).toBe('open');
      });

      it('should set updatedAt timestamp on open', () => {
        const proposal = governanceEngine.createProposal('Time Test', 'Desc', 'Author');
        
        const opened = governanceEngine.openProposal(proposal.id);
        
        // Just verify updatedAt is set to a valid timestamp
        expect(opened?.updatedAt).toBeDefined();
        expect(new Date(opened!.updatedAt).getTime()).toBeLessThanOrEqual(Date.now());
      });

      it('should return null for non-draft proposals', () => {
        // Get an already open proposal from seeds
        const openProposals = governanceEngine.listProposals('open');
        if (openProposals.length > 0) {
          const result = governanceEngine.openProposal(openProposals[0].id);
          expect(result).toBeNull();
        }
      });

      it('should return null for non-existent proposal', () => {
        const result = governanceEngine.openProposal('fake-id');
        expect(result).toBeNull();
      });

      it('should create audit log entry', () => {
        const proposal = governanceEngine.createProposal('Audit Open', 'Desc', 'Author');
        governanceEngine.openProposal(proposal.id);
        
        const auditLog = governanceEngine.getAuditLog();
        expect(auditLog.some(e => e.action === 'PROPOSAL_OPENED')).toBe(true);
      });
    });

    describe('voteOnProposal', () => {
      it('should increment for vote count', () => {
        // Get an open proposal
        const openProposals = governanceEngine.listProposals('open');
        expect(openProposals.length).toBeGreaterThan(0);
        
        const proposal = openProposals[0];
        const originalFor = proposal.votes.for;
        
        const updated = governanceEngine.voteOnProposal(proposal.id, 'for', 'Voter1');
        
        expect(updated?.votes.for).toBe(originalFor + 1);
      });

      it('should increment against vote count', () => {
        const openProposals = governanceEngine.listProposals('open');
        const proposal = openProposals[0];
        const originalAgainst = proposal.votes.against;
        
        const updated = governanceEngine.voteOnProposal(proposal.id, 'against', 'Voter1');
        
        expect(updated?.votes.against).toBe(originalAgainst + 1);
      });

      it('should increment abstain vote count', () => {
        const openProposals = governanceEngine.listProposals('open');
        const proposal = openProposals[0];
        const originalAbstain = proposal.votes.abstain;
        
        const updated = governanceEngine.voteOnProposal(proposal.id, 'abstain', 'Voter1');
        
        expect(updated?.votes.abstain).toBe(originalAbstain + 1);
      });

      it('should auto-approve when for votes reach 5', () => {
        const proposal = governanceEngine.createProposal('Auto Approve', 'Desc', 'Author');
        governanceEngine.openProposal(proposal.id);
        
        // Cast 5 for votes
        for (let i = 0; i < 5; i++) {
          governanceEngine.voteOnProposal(proposal.id, 'for', `Voter${i}`);
        }
        
        const updated = governanceEngine.getProposal(proposal.id);
        expect(updated?.status).toBe('approved');
      });

      it('should return null for non-open proposal', () => {
        const proposal = governanceEngine.createProposal('Draft Vote', 'Desc', 'Author');
        // Not opened, still draft
        
        const result = governanceEngine.voteOnProposal(proposal.id, 'for', 'Voter');
        expect(result).toBeNull();
      });

      it('should return null for non-existent proposal', () => {
        const result = governanceEngine.voteOnProposal('fake-id', 'for', 'Voter');
        expect(result).toBeNull();
      });

      it('should create audit log entry', () => {
        const openProposals = governanceEngine.listProposals('open');
        governanceEngine.voteOnProposal(openProposals[0].id, 'for', 'AuditVoter');
        
        const auditLog = governanceEngine.getAuditLog();
        expect(auditLog.some(e => e.action === 'VOTE_CAST')).toBe(true);
      });
    });

    describe('enactProposal', () => {
      it('should enact an approved proposal', () => {
        const approvedProposals = governanceEngine.listProposals('approved');
        expect(approvedProposals.length).toBeGreaterThan(0);
        
        const proposal = approvedProposals[0];
        const enacted = governanceEngine.enactProposal(proposal.id);
        
        expect(enacted?.status).toBe('enacted');
        expect(enacted?.enactedAt).toBeDefined();
      });

      it('should return null when Gate A is red', () => {
        const approvedProposals = governanceEngine.listProposals('approved');
        if (approvedProposals.length === 0) {
          // Create and approve a proposal
          const proposal = governanceEngine.createProposal('For Enact', 'Desc', 'Author');
          governanceEngine.openProposal(proposal.id);
          for (let i = 0; i < 5; i++) {
            governanceEngine.voteOnProposal(proposal.id, 'for', `V${i}`);
          }
        }
        
        // Set Gate A to red
        governanceEngine.setGateStatus('A', 'red');
        
        const approved = governanceEngine.listProposals('approved');
        const result = governanceEngine.enactProposal(approved[0].id);
        
        expect(result).toBeNull();
      });

      it('should return null for non-approved proposal', () => {
        const proposal = governanceEngine.createProposal('Not Approved', 'Desc', 'Author');
        const result = governanceEngine.enactProposal(proposal.id);
        
        expect(result).toBeNull();
      });

      it('should return null for non-existent proposal', () => {
        const result = governanceEngine.enactProposal('fake-id');
        expect(result).toBeNull();
      });

      it('should create audit log entry', () => {
        const approvedProposals = governanceEngine.listProposals('approved');
        if (approvedProposals.length > 0) {
          governanceEngine.enactProposal(approvedProposals[0].id);
          
          const auditLog = governanceEngine.getAuditLog();
          expect(auditLog.some(e => e.action === 'PROPOSAL_ENACTED')).toBe(true);
        }
      });
    });
  });

  describe('audit', () => {
    describe('getAuditLog', () => {
      it('should return audit entries', () => {
        const auditLog = governanceEngine.getAuditLog();
        
        expect(Array.isArray(auditLog)).toBe(true);
        expect(auditLog.length).toBeGreaterThan(0); // Seed data creates entries
      });

      it('should return entries with proper structure', () => {
        const auditLog = governanceEngine.getAuditLog();
        
        for (const entry of auditLog) {
          expect(entry).toHaveProperty('id');
          expect(entry).toHaveProperty('action');
          expect(entry).toHaveProperty('actor');
          expect(entry).toHaveProperty('timestamp');
          expect(entry).toHaveProperty('details');
        }
      });

      it('should respect limit parameter', () => {
        // Create some activity to ensure enough audit entries
        governanceEngine.createProposal('Audit 1', 'Desc', 'Author');
        governanceEngine.createProposal('Audit 2', 'Desc', 'Author');
        governanceEngine.createProposal('Audit 3', 'Desc', 'Author');
        
        const limited = governanceEngine.getAuditLog(2);
        
        expect(limited.length).toBeLessThanOrEqual(2);
      });

      it('should return most recent entries first', () => {
        const auditLog = governanceEngine.getAuditLog();
        
        // Reversed order means most recent first
        for (let i = 1; i < auditLog.length; i++) {
          expect(new Date(auditLog[i - 1].timestamp).getTime())
            .toBeGreaterThanOrEqual(new Date(auditLog[i].timestamp).getTime());
        }
      });
    });
  });

  describe('getGovernanceStats', () => {
    it('should return total proposals count', () => {
      const stats = governanceEngine.getGovernanceStats();
      
      expect(stats.totalProposals).toBeGreaterThanOrEqual(3); // Seed data
    });

    it('should return open proposals count', () => {
      const stats = governanceEngine.getGovernanceStats();
      
      expect(typeof stats.open).toBe('number');
    });

    it('should return enacted proposals count', () => {
      const stats = governanceEngine.getGovernanceStats();
      
      expect(stats.enacted).toBeGreaterThanOrEqual(1); // Seed has one
    });

    it('should return approved proposals count', () => {
      const stats = governanceEngine.getGovernanceStats();
      
      expect(typeof stats.approved).toBe('number');
    });

    it('should return gate statuses', () => {
      const stats = governanceEngine.getGovernanceStats();
      
      expect(stats.gateStatuses).toBeDefined();
      expect(stats.gateStatuses['A']).toBeDefined();
      expect(stats.gateStatuses['B']).toBeDefined();
      expect(stats.gateStatuses['C']).toBeDefined();
    });
  });
});
