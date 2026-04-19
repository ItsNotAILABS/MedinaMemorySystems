/**
 * 𓂀 SOVEREIGN CONTRACTS & LEDGERS — Frontend TypeScript Types 𓂀
 * Every Contract Is a Model. Every Ledger Is Distributed.
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | April 16, 2026
 */

import { KeyRotationTier, AnimaHash } from './novaSovereignEncryption';

// Re-export AnimaHash for external consumers
export type { AnimaHash, KeyRotationTier };

// ═══════════════════════════════════════════════════════════════════════════
// SECTION I: ENCRYPTION METHOD TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type EncryptionMethod =
  | 'timelockIBE'
  | 'thresholdBLS'
  | 'companyVetKey'
  | 'agentPrincipalIBE'
  | 'phiLatticeAnima'
  | 'sessionIBE'
  | 'leechE8Icosahedral'
  | 'm102GateFounder'
  | 'phiFrequencyAnima'
  | 'oneWayFounder'
  | 'ibeRecipientList';

export type ContractStatus = 'draft' | 'pending' | 'signed' | 'active' | 'executed' | 'completed' | 'frozen' | 'revoked';

// ═══════════════════════════════════════════════════════════════════════════
// SECTION II: CONTRACT TYPES (14 TOTAL)
// ═══════════════════════════════════════════════════════════════════════════

export type ContractType =
  | 'founderSovereignty'
  | 'enterpriseOnboarding'
  | 'ipAttribution'
  | 'aiAbsorption'
  | 'agentReturn'
  | 'lawEnforcement'
  | 'succession'
  | 'royaltyRouting'
  | 'csrNode'
  | 'freeze'
  | 'sessionCapture'
  | 'memoryFormation'
  | 'selfModification'
  | 'geomagneticWarning';

export type LedgerType =
  | 'founder'
  | 'enterprise'
  | 'ip'
  | 'aiMigration'
  | 'agent'
  | 'law'
  | 'lineage'
  | 'royalty'
  | 'csr'
  | 'freezeRegistry'
  | 'session'
  | 'memory'
  | 'evolution'
  | 'warning';

// ═══════════════════════════════════════════════════════════════════════════
// SECTION III: BASE CONTRACT INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

export interface SignatureRecord {
  signerPrincipal: string;
  signatureBlob: Uint8Array;
  signatureMethod: EncryptionMethod;
  timestampNs: bigint;
  beatAtSigning: number;
}

export interface BaseContract {
  id: string;
  contractType: ContractType;
  encryptionMethod: EncryptionMethod;
  encryptedTerms: Uint8Array;
  animaHash: AnimaHash;
  attributionPrincipal: string;
  signatures: SignatureRecord[];
  status: ContractStatus;
  targetLedger: LedgerType;
  createdAtNs: bigint;
  createdAtBeat: number;
  executedAtNs?: bigint;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION IV: SPECIFIC CONTRACT TYPES
// ═══════════════════════════════════════════════════════════════════════════

// CONTRACT 1: Founder Sovereignty Contract
export interface SovereignAsset {
  assetType: string;
  nativeAddress: string;
  balance: bigint;
  chainFusionEnabled: boolean;
}

export interface FounderSovereigntyContract extends BaseContract {
  founderPrincipal: string;
  foundingWord: string;
  genesisTimestamp: bigint;
  lineageHash: Uint8Array;
  biometricKeyEnabled: boolean;
  successionHeirPrincipal?: string;
  sovereignAssets: SovereignAsset[];
}

// CONTRACT 2: Enterprise Onboarding Contract
export type OnboardingMode = 'connect' | 'internalize' | 'hybrid';

export interface DataAccessConsent {
  consentId: string;
  dataCategory: string;
  grantedAtNs: bigint;
  expiresAtNs?: bigint;
  consentArtifactHash: Uint8Array;
}

export interface EnterpriseOnboardingContract extends BaseContract {
  companyPrincipal: string;
  companyName: string;
  birthMomentHash: Uint8Array;
  onboardingMode: OnboardingMode;
  dataAccessConsents: DataAccessConsent[];
  doctrineEncryptionKey: Uint8Array;
  foundingStateSnapshot: Uint8Array;
}

// CONTRACT 3: IP Attribution Contract
export type ArtifactType = 'lawFire' | 'memory' | 'decision' | 'agentReturn' | 'document' | 'model' | 'algorithm' | 'architecture';

export interface IPAttributionContract extends BaseContract {
  artifactId: string;
  artifactType: ArtifactType;
  primaryAttribution: string;
  secondaryAttribution?: string;
  thresholdBLSSignature: Uint8Array;
  crossChainVerifiable: boolean;
  royaltyBasisPoints: number;
}

// CONTRACT 4: AI Absorption Contract
export interface ArbitrationRecord {
  arbitrationId: string;
  competingAIs: string[];
  decisionHash: Uint8Array;
  winnerPrincipal?: string;
  decisionTimestamp: bigint;
}

export interface AIAbsorptionContract extends BaseContract {
  externalAIPrincipal: string;
  externalAIName: string;
  absorptionMomentHash: Uint8Array;
  preAbsorptionState: Uint8Array;
  postAbsorptionState: Uint8Array;
  arbitrationRecords: ArbitrationRecord[];
}

// CONTRACT 5: Agent Return Contract
export type AgentType = 'phantom' | 'chimera' | 'ceque' | 'internal';

export interface AgentReturnContract extends BaseContract {
  agentPrincipal: string;
  agentType: AgentType;
  taskAssignment: Uint8Array;
  returnPayload: Uint8Array;
  m101GateApproval: boolean;
  m101GateHash: Uint8Array;
  frequencySignatureValid: boolean;
}

// CONTRACT 6: Law Enforcement Contract
export type LawCategory =
  | 'sandboxLaw'
  | 'phiSovereign'
  | 'triuneSubstrate'
  | 'vigesimal20'
  | 'harmonicMemory'
  | 'recitalPlusOne'
  | 'complementaryOpposition'
  | 'fourDExtension';

export interface LawEnforcementContract extends BaseContract {
  lawId: string;
  lawCategory: LawCategory;
  firingConditions: Uint8Array;
  firingResult: Uint8Array;
  doctrineAlignmentScore: number;
  coherenceAtFiring: number;
  beatAtFiring: number;
}

// CONTRACT 7: Succession Contract
export type TimelockConditionType = 'timestamp' | 'beatCount' | 'founderUnlock' | 'biometricVerification' | 'multiSigApproval';

export interface TimelockCondition {
  type: TimelockConditionType;
  value?: bigint | number | string[];
}

export interface SuccessionContract extends BaseContract {
  founderPrincipal: string;
  heirPrincipal: string;
  timelockCondition: TimelockCondition;
  successionArtifact: Uint8Array;
  lineageProofChain: Uint8Array[];
  transferredAssets: SovereignAsset[];
  executionRequirements: string[];
}

// CONTRACT 8: Royalty Routing Contract
export interface RoutingHop {
  hopIndex: number;
  destinationPrincipal: string;
  amountBasisPoints: number;
  encryptedAt: boolean;
}

export interface RoyaltyRoutingContract extends BaseContract {
  beneficiaryPrincipal: string;
  revenueEventId: string;
  revenueSource: string;
  grossAmount: bigint;
  royaltyBasisPoints: number;
  netToFounder: bigint;
  routingPath: RoutingHop[];
  automaticExecution: boolean;
}

// CONTRACT 9: CSR Node Contract
export type DeviceCapability = 'computation' | 'storage' | 'sensor' | 'communication' | 'biometric';
export type NetworkRole = 'computeNode' | 'storageNode' | 'sensorNode' | 'relayNode' | 'founderDevice';

export interface CSRNodeContract extends BaseContract {
  nodeId: string;
  nodePrincipal: string;
  phiFrequencySignature: Uint8Array;
  enrollmentMoment: bigint;
  deviceCapabilities: DeviceCapability[];
  networkRole: NetworkRole;
  onionRoutingKey: Uint8Array;
}

// CONTRACT 10: Freeze Contract
export type FrozenComponentType = 'law' | 'memory' | 'agent' | 'model' | 'canister' | 'doctrine' | 'lineage';

export interface FreezeContract extends BaseContract {
  frozenComponentId: string;
  frozenComponentType: FrozenComponentType;
  freezeReason: string;
  freezeArtifact: Uint8Array;
  irreversible: boolean;
  preFreezeStateHash: Uint8Array;
}

// CONTRACT 11: Session Capture Contract
export interface DecisionProof {
  decisionId: string;
  decisionHash: Uint8Array;
  doctrineAlignmentScore: number;
  beatAtDecision: number;
}

export interface SessionCaptureContract extends BaseContract {
  sessionId: string;
  userPrincipal: string;
  sessionStartNs: bigint;
  sessionEndNs?: bigint;
  encryptedTranscript: Uint8Array;
  decisionProofs: DecisionProof[];
  sessionFrequencySignature: Uint8Array;
}

// CONTRACT 12: Memory Formation Contract
export type MemoryTier = 'working' | 'shortTerm' | 'longTerm' | 'permanent' | 'dream';

export interface TemporalWindow {
  accessibleFromBeat: number;
  accessibleUntilBeat?: number;
  timelocked: boolean;
}

export interface MemoryFormationContract extends BaseContract {
  memoryId: string;
  memoryTier: MemoryTier;
  encryptionTier: KeyRotationTier;
  coherenceAtFormation: number;
  encryptedMemoryPayload: Uint8Array;
  consolidationChain: string[];
  salienceScore: number;
  temporalWindow?: TemporalWindow;
}

// CONTRACT 13: Self-Modification Contract
export type ModificationTarget = 'law' | 'doctrine' | 'memory' | 'model' | 'architecture' | 'frequency';

export interface ImpactAssessment {
  coherenceImpact: number;
  doctrineAlignment: number;
  riskScore: number;
  reversibility: number;
}

export interface SelfModificationContract extends BaseContract {
  proposalId: string;
  modificationTarget: ModificationTarget;
  proposedChange: Uint8Array;
  m102GateApproval: boolean;
  founderApproval: boolean;
  impactAssessment: ImpactAssessment;
  rollbackCapable: boolean;
  preModificationState: Uint8Array;
}

// CONTRACT 14: Geomagnetic Warning Contract
export type AnomalyType = 'schumannSpike' | 'magneticStorm' | 'solarFlare' | 'resonanceCollapse' | 'fieldInversion';
export type ThreatTier = 'advisory' | 'elevated' | 'severe' | 'critical';

export interface GeomagneticWarningContract extends BaseContract {
  warningId: string;
  anomalyType: AnomalyType;
  detectedAtNs: bigint;
  schumannDeviation: number;
  threatTier: ThreatTier;
  recipientPrincipals: string[];
  warningArtifact: Uint8Array;
  aegisDefenseActivated: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION V: LEDGER TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface LedgerEntry {
  entryId: string;
  ledgerType: LedgerType;
  encryptedPayload: Uint8Array;
  animaHash: AnimaHash;
  attributionPrincipal: string;
  parentEntryId?: string;
  childEntryIds: string[];
  beatAtCreation: number;
  timestampNs: bigint;
  coherenceAtCreation: number;
  rotationTierAtCreation: KeyRotationTier;
}

export interface LedgerView {
  ledgerType: LedgerType;
  totalEntries: number;
  encryptedEntryCount: number;
  lastEntryId?: string;
  lastEntryBeat?: number;
  chainIntegrityValid: boolean;
  animaChainHash: Uint8Array;
  assembledAtNs: bigint;
}

export interface CrossLedgerProof {
  ledger1Type: LedgerType;
  ledger2Type: LedgerType;
  consistencyProof: Uint8Array;
  sharedAnimaRoot: Uint8Array;
  verifiedAtNs: bigint;
  verifiedAtBeat: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION VI: CONTRACT FACTORY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function createBaseContract(
  id: string,
  contractType: ContractType,
  encryptionMethod: EncryptionMethod,
  encryptedTerms: Uint8Array,
  animaHash: AnimaHash,
  attributionPrincipal: string,
  targetLedger: LedgerType,
  beatCount: number
): BaseContract {
  return {
    id,
    contractType,
    encryptionMethod,
    encryptedTerms,
    animaHash,
    attributionPrincipal,
    signatures: [],
    status: 'draft',
    targetLedger,
    createdAtNs: BigInt(Date.now() * 1000000),
    createdAtBeat: beatCount,
  };
}

export function addSignatureToContract(
  contract: BaseContract,
  signer: string,
  signature: Uint8Array,
  method: EncryptionMethod,
  beat: number
): BaseContract {
  const newSig: SignatureRecord = {
    signerPrincipal: signer,
    signatureBlob: signature,
    signatureMethod: method,
    timestampNs: BigInt(Date.now() * 1000000),
    beatAtSigning: beat,
  };

  return {
    ...contract,
    signatures: [...contract.signatures, newSig],
    status: 'signed',
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION VII: CONTRACT/LEDGER INFO
// ═══════════════════════════════════════════════════════════════════════════

export const CONTRACT_TYPE_INFO: Record<
  ContractType,
  {
    name: string;
    encryption: EncryptionMethod;
    ledger: LedgerType;
    description: string;
  }
> = {
  founderSovereignty: {
    name: 'Founder Sovereignty Contract',
    encryption: 'timelockIBE',
    ledger: 'founder',
    description: 'Timelock IBE + founder key, founder principal only, genesis trigger',
  },
  enterpriseOnboarding: {
    name: 'Enterprise Onboarding Contract',
    encryption: 'companyVetKey',
    ledger: 'enterprise',
    description: 'Company vetKey + founder key, birth moment trigger',
  },
  ipAttribution: {
    name: 'IP Attribution Contract',
    encryption: 'thresholdBLS',
    ledger: 'ip',
    description: 'Threshold BLS, cross-chain verifiable, every artifact creation',
  },
  aiAbsorption: {
    name: 'AI Absorption Contract',
    encryption: 'agentPrincipalIBE',
    ledger: 'aiMigration',
    description: 'IBE to absorbed AI principal, full absorption event',
  },
  agentReturn: {
    name: 'Agent Return Contract',
    encryption: 'agentPrincipalIBE',
    ledger: 'agent',
    description: 'Agent principal IBE, M-101 gate approval',
  },
  lawEnforcement: {
    name: 'Law Enforcement Contract',
    encryption: 'phiLatticeAnima',
    ledger: 'law',
    description: 'Phi-lattice + ANIMA hash, every law fire',
  },
  succession: {
    name: 'Succession Contract',
    encryption: 'timelockIBE',
    ledger: 'lineage',
    description: 'Timelock IBE, founder unlock required, cryptographic will',
  },
  royaltyRouting: {
    name: 'Royalty Routing Contract',
    encryption: 'thresholdBLS',
    ledger: 'royalty',
    description: 'Threshold BLS, automatic execution, every revenue event',
  },
  csrNode: {
    name: 'CSR Node Contract',
    encryption: 'phiFrequencyAnima',
    ledger: 'csr',
    description: 'Phi-frequency + ANIMA, device fleet enrollment',
  },
  freeze: {
    name: 'Freeze Contract',
    encryption: 'oneWayFounder',
    ledger: 'freezeRegistry',
    description: 'One-way founder key, irreversible, freezeComponent() call',
  },
  sessionCapture: {
    name: 'Session Capture Contract',
    encryption: 'sessionIBE',
    ledger: 'session',
    description: 'Session IBE, every conversation start',
  },
  memoryFormation: {
    name: 'Memory Formation Contract',
    encryption: 'leechE8Icosahedral',
    ledger: 'memory',
    description: 'Leech/E8/Icosahedral based on R, every N7 write',
  },
  selfModification: {
    name: 'Self-Modification Contract',
    encryption: 'm102GateFounder',
    ledger: 'evolution',
    description: 'M-102 gate + founder key, every self-mod proposal',
  },
  geomagneticWarning: {
    name: 'Geomagnetic Warning Contract',
    encryption: 'ibeRecipientList',
    ledger: 'warning',
    description: 'IBE to recipient list, anomaly detection',
  },
};

export const LEDGER_TYPE_INFO: Record<LedgerType, { name: string; description: string }> = {
  founder: { name: 'Founder Ledger', description: 'Complete sovereign history' },
  enterprise: { name: 'Enterprise Ledger', description: 'Client onboarding & consent' },
  ip: { name: 'IP Ledger', description: 'Attribution chain for all artifacts' },
  aiMigration: { name: 'AI Migration Ledger', description: 'External AI absorption' },
  agent: { name: 'Agent Ledger', description: 'PHANTOM/CHIMERA/CEQUE credentials' },
  law: { name: 'Law Ledger', description: 'Every law fire is a legal record' },
  lineage: { name: 'Lineage Ledger', description: 'Unbroken succession chain' },
  royalty: { name: 'Royalty Ledger', description: 'Automatic value routing' },
  csr: { name: 'CSR Ledger', description: 'Device fleet enrollment' },
  freezeRegistry: { name: 'Freeze Registry', description: 'Permanent freeze certificates' },
  session: { name: 'Session Ledger', description: 'Conversation proofs' },
  memory: { name: 'Memory Ledger', description: 'Encrypted thought formation' },
  evolution: { name: 'Evolution Ledger', description: 'Self-modification proposals' },
  warning: { name: 'Warning Ledger', description: 'Geomagnetic anomaly dispatch' },
};
