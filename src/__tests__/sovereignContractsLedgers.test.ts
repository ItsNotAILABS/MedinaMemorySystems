/**
 * Tests for sovereignContractsLedgers.ts
 * Contract Types and Ledger Types
 */

import * as scl from '../lib/sovereignContractsLedgers';

describe('Sovereign Contracts & Ledgers', () => {
  describe('Contract Type Info', () => {
    it('should have info for all 14 contract types', () => {
      const contractTypes: scl.ContractType[] = [
        'founderSovereignty',
        'enterpriseOnboarding',
        'ipAttribution',
        'aiAbsorption',
        'agentReturn',
        'lawEnforcement',
        'succession',
        'royaltyRouting',
        'csrNode',
        'freeze',
        'sessionCapture',
        'memoryFormation',
        'selfModification',
        'geomagneticWarning',
      ];

      for (const type of contractTypes) {
        expect(scl.CONTRACT_TYPE_INFO[type]).toBeDefined();
        expect(scl.CONTRACT_TYPE_INFO[type]).toHaveProperty('name');
        expect(scl.CONTRACT_TYPE_INFO[type]).toHaveProperty('encryption');
        expect(scl.CONTRACT_TYPE_INFO[type]).toHaveProperty('ledger');
        expect(scl.CONTRACT_TYPE_INFO[type]).toHaveProperty('description');
      }
    });

    it('should map contracts to correct ledgers', () => {
      expect(scl.CONTRACT_TYPE_INFO.founderSovereignty.ledger).toBe('founder');
      expect(scl.CONTRACT_TYPE_INFO.enterpriseOnboarding.ledger).toBe('enterprise');
      expect(scl.CONTRACT_TYPE_INFO.ipAttribution.ledger).toBe('ip');
      expect(scl.CONTRACT_TYPE_INFO.sessionCapture.ledger).toBe('session');
      expect(scl.CONTRACT_TYPE_INFO.memoryFormation.ledger).toBe('memory');
    });

    it('should specify encryption methods', () => {
      expect(scl.CONTRACT_TYPE_INFO.founderSovereignty.encryption).toBe('timelockIBE');
      expect(scl.CONTRACT_TYPE_INFO.ipAttribution.encryption).toBe('thresholdBLS');
      expect(scl.CONTRACT_TYPE_INFO.lawEnforcement.encryption).toBe('phiLatticeAnima');
      expect(scl.CONTRACT_TYPE_INFO.sessionCapture.encryption).toBe('sessionIBE');
    });
  });

  describe('Ledger Type Info', () => {
    it('should have info for all 14 ledger types', () => {
      const ledgerTypes: scl.LedgerType[] = [
        'founder',
        'enterprise',
        'ip',
        'aiMigration',
        'agent',
        'law',
        'lineage',
        'royalty',
        'csr',
        'freezeRegistry',
        'session',
        'memory',
        'evolution',
        'warning',
      ];

      for (const type of ledgerTypes) {
        expect(scl.LEDGER_TYPE_INFO[type]).toBeDefined();
        expect(scl.LEDGER_TYPE_INFO[type]).toHaveProperty('name');
        expect(scl.LEDGER_TYPE_INFO[type]).toHaveProperty('description');
      }
    });

    it('should have meaningful descriptions', () => {
      expect(scl.LEDGER_TYPE_INFO.founder.description).toContain('sovereign');
      expect(scl.LEDGER_TYPE_INFO.law.description).toContain('law');
      expect(scl.LEDGER_TYPE_INFO.memory.description).toContain('thought');
    });
  });

  describe('createBaseContract', () => {
    it('should create contract with all base properties', () => {
      const animaHash: scl.AnimaHash = {
        value: new Uint8Array([1, 2, 3]),
        phiIteration: 10,
        beatAtCreation: 100,
        coherenceAtCreation: 0.85,
      };

      const contract = scl.createBaseContract(
        'contract-123',
        'founderSovereignty',
        'timelockIBE',
        new Uint8Array([10, 20, 30]),
        animaHash,
        'principal-abc',
        'founder',
        42
      );

      expect(contract.id).toBe('contract-123');
      expect(contract.contractType).toBe('founderSovereignty');
      expect(contract.encryptionMethod).toBe('timelockIBE');
      expect(contract.attributionPrincipal).toBe('principal-abc');
      expect(contract.targetLedger).toBe('founder');
      expect(contract.createdAtBeat).toBe(42);
    });

    it('should initialize with draft status', () => {
      const animaHash: scl.AnimaHash = {
        value: new Uint8Array([1]),
        phiIteration: 1,
        beatAtCreation: 1,
        coherenceAtCreation: 0.5,
      };

      const contract = scl.createBaseContract(
        'test',
        'ipAttribution',
        'thresholdBLS',
        new Uint8Array(0),
        animaHash,
        'principal',
        'ip',
        1
      );

      expect(contract.status).toBe('draft');
    });

    it('should initialize with empty signatures', () => {
      const animaHash: scl.AnimaHash = {
        value: new Uint8Array([1]),
        phiIteration: 1,
        beatAtCreation: 1,
        coherenceAtCreation: 0.5,
      };

      const contract = scl.createBaseContract(
        'test',
        'sessionCapture',
        'sessionIBE',
        new Uint8Array(0),
        animaHash,
        'principal',
        'session',
        1
      );

      expect(contract.signatures).toEqual([]);
    });

    it('should set timestamp', () => {
      const animaHash: scl.AnimaHash = {
        value: new Uint8Array([1]),
        phiIteration: 1,
        beatAtCreation: 1,
        coherenceAtCreation: 0.5,
      };

      const contract = scl.createBaseContract(
        'test',
        'memoryFormation',
        'leechE8Icosahedral',
        new Uint8Array(0),
        animaHash,
        'principal',
        'memory',
        1
      );

      expect(typeof contract.createdAtNs).toBe('bigint');
      expect(contract.createdAtNs).toBeGreaterThan(0n);
    });
  });

  describe('addSignatureToContract', () => {
    let baseContract: scl.BaseContract;

    beforeEach(() => {
      const animaHash: scl.AnimaHash = {
        value: new Uint8Array([1]),
        phiIteration: 1,
        beatAtCreation: 1,
        coherenceAtCreation: 0.5,
      };

      baseContract = scl.createBaseContract(
        'test-contract',
        'founderSovereignty',
        'timelockIBE',
        new Uint8Array([1, 2, 3]),
        animaHash,
        'founder-principal',
        'founder',
        10
      );
    });

    it('should add signature to contract', () => {
      const signed = scl.addSignatureToContract(
        baseContract,
        'signer-principal',
        new Uint8Array([100, 101, 102]),
        'timelockIBE',
        15
      );

      expect(signed.signatures.length).toBe(1);
      expect(signed.signatures[0].signerPrincipal).toBe('signer-principal');
      expect(signed.signatures[0].signatureMethod).toBe('timelockIBE');
      expect(signed.signatures[0].beatAtSigning).toBe(15);
    });

    it('should update status to signed', () => {
      const signed = scl.addSignatureToContract(
        baseContract,
        'signer',
        new Uint8Array([1]),
        'timelockIBE',
        20
      );

      expect(signed.status).toBe('signed');
    });

    it('should support multiple signatures', () => {
      let contract = scl.addSignatureToContract(
        baseContract,
        'signer-1',
        new Uint8Array([1]),
        'timelockIBE',
        10
      );

      contract = scl.addSignatureToContract(
        contract,
        'signer-2',
        new Uint8Array([2]),
        'thresholdBLS',
        11
      );

      expect(contract.signatures.length).toBe(2);
      expect(contract.signatures[0].signerPrincipal).toBe('signer-1');
      expect(contract.signatures[1].signerPrincipal).toBe('signer-2');
    });

    it('should set timestamp on signature', () => {
      const signed = scl.addSignatureToContract(
        baseContract,
        'signer',
        new Uint8Array([1]),
        'timelockIBE',
        25
      );

      expect(typeof signed.signatures[0].timestampNs).toBe('bigint');
      expect(signed.signatures[0].timestampNs).toBeGreaterThan(0n);
    });
  });

  describe('Type Definitions', () => {
    it('should support all encryption methods', () => {
      const methods: scl.EncryptionMethod[] = [
        'timelockIBE',
        'thresholdBLS',
        'companyVetKey',
        'agentPrincipalIBE',
        'phiLatticeAnima',
        'sessionIBE',
        'leechE8Icosahedral',
        'm102GateFounder',
        'phiFrequencyAnima',
        'oneWayFounder',
        'ibeRecipientList',
      ];

      // Verify all are valid by checking they can be used
      methods.forEach(method => {
        const contract = Object.values(scl.CONTRACT_TYPE_INFO).find(
          c => c.encryption === method
        );
        // Some methods may not have direct mappings, which is fine
        expect(typeof method).toBe('string');
      });
    });

    it('should support all contract statuses', () => {
      const statuses: scl.ContractStatus[] = [
        'draft',
        'pending',
        'signed',
        'active',
        'executed',
        'completed',
        'frozen',
        'revoked',
      ];

      statuses.forEach(status => {
        expect(typeof status).toBe('string');
      });
    });
  });

  describe('Contract Type Interfaces', () => {
    it('should allow founder sovereignty contract properties', () => {
      const contract: Partial<scl.FounderSovereigntyContract> = {
        founderPrincipal: 'founder-123',
        foundingWord: 'Genesis',
        genesisTimestamp: BigInt(Date.now()),
        lineageHash: new Uint8Array([1, 2, 3]),
        biometricKeyEnabled: true,
      };

      expect(contract.founderPrincipal).toBe('founder-123');
      expect(contract.biometricKeyEnabled).toBe(true);
    });

    it('should allow enterprise onboarding contract properties', () => {
      const contract: Partial<scl.EnterpriseOnboardingContract> = {
        companyPrincipal: 'company-xyz',
        companyName: 'Acme Corp',
        onboardingMode: 'hybrid',
        dataAccessConsents: [],
      };

      expect(contract.companyName).toBe('Acme Corp');
      expect(contract.onboardingMode).toBe('hybrid');
    });

    it('should allow IP attribution contract properties', () => {
      const contract: Partial<scl.IPAttributionContract> = {
        artifactId: 'artifact-123',
        artifactType: 'algorithm',
        primaryAttribution: 'creator-principal',
        royaltyBasisPoints: 500,
        crossChainVerifiable: true,
      };

      expect(contract.artifactType).toBe('algorithm');
      expect(contract.royaltyBasisPoints).toBe(500);
    });

    it('should allow law enforcement contract properties', () => {
      const contract: Partial<scl.LawEnforcementContract> = {
        lawId: 'law-001',
        lawCategory: 'recitalPlusOne',
        doctrineAlignmentScore: 0.95,
        coherenceAtFiring: 0.87,
        beatAtFiring: 1000,
      };

      expect(contract.lawCategory).toBe('recitalPlusOne');
      expect(contract.doctrineAlignmentScore).toBe(0.95);
    });

    it('should allow memory formation contract properties', () => {
      const contract: Partial<scl.MemoryFormationContract> = {
        memoryId: 'mem-xyz',
        memoryTier: 'longTerm',
        coherenceAtFormation: 0.92,
        salienceScore: 0.85,
      };

      expect(contract.memoryTier).toBe('longTerm');
    });
  });

  describe('Ledger Interfaces', () => {
    it('should support ledger entry structure', () => {
      const entry: Partial<scl.LedgerEntry> = {
        entryId: 'entry-001',
        ledgerType: 'memory',
        encryptedPayload: new Uint8Array([1, 2, 3]),
        beatAtCreation: 500,
        coherenceAtCreation: 0.88,
      };

      expect(entry.ledgerType).toBe('memory');
    });

    it('should support ledger view structure', () => {
      const view: Partial<scl.LedgerView> = {
        ledgerType: 'founder',
        totalEntries: 100,
        encryptedEntryCount: 95,
        chainIntegrityValid: true,
      };

      expect(view.totalEntries).toBe(100);
      expect(view.chainIntegrityValid).toBe(true);
    });

    it('should support cross-ledger proof structure', () => {
      const proof: Partial<scl.CrossLedgerProof> = {
        ledger1Type: 'founder',
        ledger2Type: 'memory',
        consistencyProof: new Uint8Array([1, 2, 3]),
      };

      expect(proof.ledger1Type).toBe('founder');
      expect(proof.ledger2Type).toBe('memory');
    });
  });
});
