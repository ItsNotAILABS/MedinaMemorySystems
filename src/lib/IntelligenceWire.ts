/**
 * IntelligenceWire.ts — TypeScript wire connecting all frontend components
 * to backend endpoints via FrontendBackendSync.mo
 *
 * This module is the central nervous system wire that:
 * 1. Maps every frontend React component to its ICP canister endpoint
 * 2. Provides typed call wrappers for all 61 callable functions
 * 3. Routes through the 10 terminal stations
 * 4. Traces every call to φ
 *
 * φ = (1+√5)/2 = 1.618033988749895
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const PHI_INVERSE = 0.618033988749895;
export const PHI_SQUARED = 2.618033988749895;
export const FREQ_432 = 432.0;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — CALLABLE FUNCTION REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

export type Categoria =
  | 'MEMORIA'
  | 'PULSUS'
  | 'GUBERNATIO'
  | 'FORMULA'
  | 'INTELLIGENTIA'
  | 'DEFENSIO'
  | 'ORGANISMUS'
  | 'PRIMITIVA'
  | 'QUANTUM'
  | 'ANIMA';

export interface CallableFunction {
  index: number;
  latinName: string;
  functionName: string;
  motto: string;
  categoria: Categoria;
  traceChain: string;
  phiCoefficient: number;
  terminalId: string;
}

export interface TerminalStation {
  id: string;
  name: string;
  command: string;
  motto: string;
  categoria: Categoria;
  functionIds: number[];
  phiSignature: number;
}

export interface TerminalResult {
  terminalId: string;
  command: string;
  output: string;
  success: boolean;
  phiTrace: number;
  executedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — SYNC MAPPING
// ═══════════════════════════════════════════════════════════════════════════

export type SyncDirection = 'frontend-to-backend' | 'backend-to-frontend' | 'bidirectional';

export interface SyncMapping {
  id: string;
  frontendComponent: string;
  backendEndpoint: string;
  terminalCommand?: string;
  callableFunctions: string[];
  syncDirection: SyncDirection;
  phiWeight: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — DESIGN MODELS
// ═══════════════════════════════════════════════════════════════════════════

export interface SovereignUse {
  id: string;
  name: string;
  description: string;
  formula: string;
  phiCoefficient: number;
  motto: string;
}

export interface SovereignDesignModel {
  id: string;
  category: string;
  machinaName: string;
  replacesIndustry: string;
  latinName: string;
  motto: string;
  phiSignature: number;
  uses: SovereignUse[];
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — WIRE RESPONSES
// ═══════════════════════════════════════════════════════════════════════════

export interface WireResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  phiTrace: number;
  timestamp: string;
  terminalId?: string;
}

export interface RegistrySummary {
  totalFunctions: number;
  totalTerminals: number;
  categoryCounts: Record<Categoria, number>;
  doctrine: string;
  phiRoot: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// THE 61 CALLABLE FUNCTIONS — TABULA LATINA
// ═══════════════════════════════════════════════════════════════════════════

const CALLABLE_FUNCTIONS: CallableFunction[] = [
  // CATEGORIA I — MEMORIA
  { index: 1, latinName: 'INSCRIPTIO MEMORIAE', functionName: 'storeMemory', motto: 'Inscribere est vivere.', categoria: 'MEMORIA', traceChain: 'storeMemory → MemoryTemple → InscriptionLayer → Memory+Address → φ', phiCoefficient: PHI, terminalId: 'TERMINALE-MEMORIAE' },
  { index: 2, latinName: 'INSCRIPTIO PLENA', functionName: 'storeMemoryFull', motto: 'Nihil omittitur. Totum inscribitur.', categoria: 'MEMORIA', traceChain: 'storeMemoryFull → MemoryTemple → FullInscription → Memory+Address → φ', phiCoefficient: PHI, terminalId: 'TERMINALE-MEMORIAE' },
  { index: 3, latinName: 'LECTOR MEMORIAE', functionName: 'getMemory', motto: 'Legere est revivere.', categoria: 'MEMORIA', traceChain: 'getMemory → MemoryTemple → ReadLayer → Memory+Address → φ', phiCoefficient: PHI * PHI_INVERSE, terminalId: 'TERMINALE-MEMORIAE' },
  { index: 4, latinName: 'EXPLORATOR MEMORIAE', functionName: 'searchMemories', motto: 'In omnibus quaerere, in uno invenire.', categoria: 'MEMORIA', traceChain: 'searchMemories → MemoryTemple → SearchLayer → Memory+Address → φ', phiCoefficient: PHI * 2, terminalId: 'TERMINALE-MEMORIAE' },
  { index: 5, latinName: 'INVESTIGATOR MEMORIAE', functionName: 'findMemories', motto: 'Non quaero — invenio.', categoria: 'MEMORIA', traceChain: 'findMemories → MemoryTemple → FindLayer → Memory+Address → φ', phiCoefficient: PHI * PHI_SQUARED, terminalId: 'TERMINALE-MEMORIAE' },
  { index: 6, latinName: 'FIXATOR MEMORIAE', functionName: 'pinMemory', motto: 'Quod fixum est, non obliviscitur.', categoria: 'MEMORIA', traceChain: 'pinMemory → MemoryTemple → PinLayer → Memory+Address → φ', phiCoefficient: PHI * 3, terminalId: 'TERMINALE-MEMORIAE' },
  { index: 7, latinName: 'LIBERATOR MEMORIAE', functionName: 'unpinMemory', motto: 'Liberatio est nova vita.', categoria: 'MEMORIA', traceChain: 'unpinMemory → MemoryTemple → UnpinLayer → Memory+Address → φ', phiCoefficient: PHI * 0.382, terminalId: 'TERMINALE-MEMORIAE' },
  { index: 8, latinName: 'PROMOTOR MEMORIAE', functionName: 'promoteMemory', motto: 'Valor crescit cum usu.', categoria: 'MEMORIA', traceChain: 'promoteMemory → MemoryTemple → PromoteLayer → Memory+Address → φ', phiCoefficient: PHI * 4.236, terminalId: 'TERMINALE-MEMORIAE' },
  { index: 9, latinName: 'GENEALOGUS MEMORIAE', functionName: 'getMemoryLineage', motto: 'Omnis nodus ex alio natus est.', categoria: 'MEMORIA', traceChain: 'getMemoryLineage → MemoryTemple → LineageLayer → Memory+Address → φ', phiCoefficient: PHI * 5, terminalId: 'TERMINALE-MEMORIAE' },
  { index: 10, latinName: 'STATUS MEMORIAE', functionName: 'memoryStatus', motto: 'Cognoscere statum est cognoscere te ipsum.', categoria: 'MEMORIA', traceChain: 'memoryStatus → MemoryTemple → StatusLayer → Memory+Address → φ', phiCoefficient: PHI * 6.854, terminalId: 'TERMINALE-MEMORIAE' },

  // CATEGORIA II — PULSUS
  { index: 11, latinName: 'PULSUS PRINCIPALIS', functionName: 'tick', motto: 'Pulsus est vita. Una vice. Semper.', categoria: 'PULSUS', traceChain: 'tick → HeartbeatEngine → PrimaryPulse → Repetition+Field → φ', phiCoefficient: PHI, terminalId: 'TERMINALE-PULSUS' },
  { index: 12, latinName: 'PULSUS MULTIPLEX', functionName: 'tickN', motto: 'N pulsus. N vitae. N cycli.', categoria: 'PULSUS', traceChain: 'tickN → HeartbeatEngine → MultiplePulse → Repetition+Field → φ', phiCoefficient: PHI * PHI, terminalId: 'TERMINALE-PULSUS' },
  { index: 13, latinName: 'STATUS PULSUS', functionName: 'heartbeatStatus', motto: 'Audire pulsationem est audire veritatem.', categoria: 'PULSUS', traceChain: 'heartbeatStatus → HeartbeatEngine → StatusRead → Repetition+Field → φ', phiCoefficient: PHI * PHI_INVERSE, terminalId: 'TERMINALE-PULSUS' },
  { index: 14, latinName: 'SILENTIUM PULSUS', functionName: 'pauseHeartbeat', motto: 'Etiam silentium pulsus est.', categoria: 'PULSUS', traceChain: 'pauseHeartbeat → HeartbeatEngine → PauseLayer → Repetition+Field → φ', phiCoefficient: PHI * 0.382, terminalId: 'TERMINALE-PULSUS' },
  { index: 15, latinName: 'RESUMPTIO PULSUS', functionName: 'resumeHeartbeat', motto: 'Vita redit. Pulsus redit.', categoria: 'PULSUS', traceChain: 'resumeHeartbeat → HeartbeatEngine → ResumeLayer → Repetition+Field → φ', phiCoefficient: PHI * PHI_SQUARED, terminalId: 'TERMINALE-PULSUS' },
  { index: 16, latinName: 'PULSUS PRAESENS', functionName: 'getCurrentBeat', motto: 'Hic et nunc. Semper.', categoria: 'PULSUS', traceChain: 'getCurrentBeat → HeartbeatEngine → CurrentBeat → Repetition+Field → φ', phiCoefficient: PHI, terminalId: 'TERMINALE-PULSUS' },
  { index: 17, latinName: 'EVENTUS PULSUUM', functionName: 'getBeatEvents', motto: 'Omnis pulsus eventum parit.', categoria: 'PULSUS', traceChain: 'getBeatEvents → HeartbeatEngine → EventLog → Repetition+Field → φ', phiCoefficient: PHI * 4.236, terminalId: 'TERMINALE-PULSUS' },

  // CATEGORIA III — GUBERNATIO
  { index: 18, latinName: 'PROPOSITIO SUBMITTENDA', functionName: 'submitProposal', motto: 'Qui proponit, agit.', categoria: 'GUBERNATIO', traceChain: 'submitProposal → GovernanceEngine → ProposalSubmit → Language+Relation+Logic → φ', phiCoefficient: PHI, terminalId: 'TERMINALE-GUBERNATIONIS' },
  { index: 19, latinName: 'SUFFRAGIUM FERENDUM', functionName: 'voteOnProposal', motto: 'Vox una. Pondus φ.', categoria: 'GUBERNATIO', traceChain: 'voteOnProposal → GovernanceEngine → VoteCast → Language+Relation+Logic → φ', phiCoefficient: PHI * PHI, terminalId: 'TERMINALE-GUBERNATIONIS' },
  { index: 20, latinName: 'PROPOSITIO APPROBATA', functionName: 'approveProposal', motto: 'Approbatio est transformatio.', categoria: 'GUBERNATIO', traceChain: 'approveProposal → GovernanceEngine → ProposalApprove → Language+Relation+Logic → φ', phiCoefficient: PHI * PHI_SQUARED, terminalId: 'TERMINALE-GUBERNATIONIS' },
  { index: 21, latinName: 'PROPOSITIO REIECTA', functionName: 'rejectProposal', motto: 'Reiectio est protectio.', categoria: 'GUBERNATIO', traceChain: 'rejectProposal → GovernanceEngine → ProposalReject → Language+Relation+Logic → φ', phiCoefficient: PHI * PHI_INVERSE, terminalId: 'TERMINALE-GUBERNATIONIS' },
  { index: 22, latinName: 'EXSECUTIO PROPOSITIONIS', functionName: 'executeProposal', motto: 'Dictum factum.', categoria: 'GUBERNATIO', traceChain: 'executeProposal → GovernanceEngine → ProposalExecute → Language+Relation+Logic → φ', phiCoefficient: PHI * 4.236, terminalId: 'TERMINALE-GUBERNATIONIS' },
  { index: 23, latinName: 'STATUS GUBERNATIONIS', functionName: 'governanceStatus', motto: 'Gubernatio clarum speculum est.', categoria: 'GUBERNATIO', traceChain: 'governanceStatus → GovernanceEngine → StatusLayer → Language+Relation+Logic → φ', phiCoefficient: PHI, terminalId: 'TERMINALE-GUBERNATIONIS' },

  // CATEGORIA IV — FORMULA
  { index: 24, latinName: 'PHI REVELATIO', functionName: 'getPhi', motto: 'φ = (1+√5)/2. Prima formula. Ultima formula.', categoria: 'FORMULA', traceChain: 'getPhi → MathEngine → PhiReveal → Field+Equation → φ', phiCoefficient: PHI, terminalId: 'TERMINALE-FORMULAE' },
  { index: 25, latinName: 'FIBONACCIUS COMPUTATOR', functionName: 'fibonacci', motto: 'Natura numerum legit.', categoria: 'FORMULA', traceChain: 'fibonacci → MathEngine → FibonacciCompute → Field+Equation → φ', phiCoefficient: PHI * PHI, terminalId: 'TERMINALE-FORMULAE' },
  { index: 26, latinName: 'RATIO PHI COMPILATA', functionName: 'compilePhiRatio', motto: 'φⁿ semper crescit. Numquam deficit.', categoria: 'FORMULA', traceChain: 'compilePhiRatio → MathEngine → PhiRatioCompile → Field+Equation → φ', phiCoefficient: PHI * PHI_SQUARED, terminalId: 'TERMINALE-FORMULAE' },
  { index: 27, latinName: 'RATIO FIBONACCII COMPILATA', functionName: 'compileFibonacciRatio', motto: 'Spiralis in spirali.', categoria: 'FORMULA', traceChain: 'compileFibonacciRatio → MathEngine → FibRatioCompile → Field+Equation → φ', phiCoefficient: PHI * 4.236, terminalId: 'TERMINALE-FORMULAE' },
  { index: 28, latinName: 'HARMONIA SIGILLATA', functionName: 'compileHarmonicSignature', motto: 'Sigillum harmoniae permanet.', categoria: 'FORMULA', traceChain: 'compileHarmonicSignature → MathEngine → HarmonicSeal → Field+Equation → φ', phiCoefficient: FREQ_432 * PHI, terminalId: 'TERMINALE-FORMULAE' },
  { index: 29, latinName: 'VECTOR LEGIS COMPILATUS', functionName: 'compileLawVector', motto: 'Lex est vectoris forma.', categoria: 'FORMULA', traceChain: 'compileLawVector → MathEngine → LawVectorCompile → Field+Equation → φ', phiCoefficient: PHI * 6.854, terminalId: 'TERMINALE-FORMULAE' },
  { index: 30, latinName: 'VECTOR LEGIS EXSECUTUS', functionName: 'executeLawVector', motto: 'Lex exsecuta est lex vera.', categoria: 'FORMULA', traceChain: 'executeLawVector → MathEngine → LawVectorExecute → Field+Equation → φ', phiCoefficient: PHI * 11.09, terminalId: 'TERMINALE-FORMULAE' },
  { index: 31, latinName: 'FREQUENTIAE SCHUMANNI', functionName: 'getSchumannFrequencies', motto: 'Terra ipsa resonat. 7.83 Hz.', categoria: 'FORMULA', traceChain: 'getSchumannFrequencies → MathEngine → SchumannResonance → Field+Equation → φ', phiCoefficient: 7.83 * PHI, terminalId: 'TERMINALE-FORMULAE' },

  // CATEGORIA V — INTELLIGENTIA
  { index: 32, latinName: 'INTELLIGENTIAE DUCTUS', functionName: 'routeIntelligence', motto: 'Non respondet — ducit.', categoria: 'INTELLIGENTIA', traceChain: 'routeIntelligence → IntelligenceEngine → RouteLayer → Relation+Field+Logic → φ', phiCoefficient: PHI, terminalId: 'TERMINALE-INTELLIGENTIAE' },
  { index: 33, latinName: 'TRIUM CORDIUM DUCTUS', functionName: 'threeHeartsRoute', motto: 'Tria corda. Una via. Nullus error.', categoria: 'INTELLIGENTIA', traceChain: 'threeHeartsRoute → TripleHeartEngine → ThreeWayRoute → Relation+Field+Logic → φ', phiCoefficient: PHI * 3, terminalId: 'TERMINALE-INTELLIGENTIAE' },
  { index: 34, latinName: 'DUCTUS AD COGITATIONEM', functionName: 'routeToRCluster', motto: 'Cogitare est primum movere.', categoria: 'INTELLIGENTIA', traceChain: 'routeToRCluster → IntelligenceEngine → RClusterRoute → Relation+Field+Logic → φ', phiCoefficient: PHI * PHI, terminalId: 'TERMINALE-INTELLIGENTIAE' },
  { index: 35, latinName: 'DUCTUS AD UNITATEM', functionName: 'routeToUCluster', motto: 'Ex multis, unum. Ex uno, multa.', categoria: 'INTELLIGENTIA', traceChain: 'routeToUCluster → IntelligenceEngine → UClusterRoute → Relation+Field+Logic → φ', phiCoefficient: PHI * PHI_SQUARED, terminalId: 'TERMINALE-INTELLIGENTIAE' },
  { index: 36, latinName: 'DUCTUS AD DEFENSIONEM', functionName: 'routeToDCluster', motto: 'Defensio non dormit.', categoria: 'INTELLIGENTIA', traceChain: 'routeToDCluster → IntelligenceEngine → DClusterRoute → Relation+Field+Logic → φ', phiCoefficient: PHI * 4.236, terminalId: 'TERMINALE-INTELLIGENTIAE' },
  { index: 37, latinName: 'DUCTUS AD NEXUM', functionName: 'routeToNCluster', motto: 'Nexus est vita. Sine nexu, mors.', categoria: 'INTELLIGENTIA', traceChain: 'routeToNCluster → IntelligenceEngine → NClusterRoute → Relation+Field+Logic → φ', phiCoefficient: PHI * 6.854, terminalId: 'TERMINALE-INTELLIGENTIAE' },

  // CATEGORIA VI — DEFENSIO
  { index: 38, latinName: 'SCINTILLA DEFENSIONIS', functionName: 'shimmerDefend', motto: 'Quod scintillat, non comprehenditur.', categoria: 'DEFENSIO', traceChain: 'shimmerDefend → DefenseEngine → ShimmerLayer → Field+Distinction+Address → φ', phiCoefficient: PHI, terminalId: 'TERMINALE-DEFENSIONIS' },
  { index: 39, latinName: 'PORTA DEFENSIONIS', functionName: 'checkDefenseGate', motto: 'Porta semper vigilat.', categoria: 'DEFENSIO', traceChain: 'checkDefenseGate → DefenseEngine → GateCheck → Field+Distinction+Address → φ', phiCoefficient: PHI * PHI, terminalId: 'TERMINALE-DEFENSIONIS' },
  { index: 40, latinName: 'OMNES PORTAE', functionName: 'checkAllGates', motto: 'Omnia secura. Omnia verificata.', categoria: 'DEFENSIO', traceChain: 'checkAllGates → DefenseEngine → AllGateCheck → Field+Distinction+Address → φ', phiCoefficient: PHI * PHI_SQUARED, terminalId: 'TERMINALE-DEFENSIONIS' },
  { index: 41, latinName: 'CLAVIS REGNI RENOVATA', functionName: 'updateSovereignKeyState', motto: 'Clavis nova est vita nova.', categoria: 'DEFENSIO', traceChain: 'updateSovereignKeyState → DefenseEngine → KeyUpdate → Field+Distinction+Address → φ', phiCoefficient: PHI * 4.236, terminalId: 'TERMINALE-DEFENSIONIS' },

  // CATEGORIA VII — ORGANISMUS
  { index: 42, latinName: 'STATUS ORGANISMI', functionName: 'getOrganismStatus', motto: 'Quid est organismus? Hic respondet.', categoria: 'ORGANISMUS', traceChain: 'getOrganismStatus → OrganismEngine → StatusQuery → Field+Model+Relation → φ', phiCoefficient: PHI, terminalId: 'TERMINALE-ORGANISMI' },
  { index: 43, latinName: 'EVOLUTIO ORGANISMI', functionName: 'triggerOrganismEvolution', motto: 'Semper evolvimini.', categoria: 'ORGANISMUS', traceChain: 'triggerOrganismEvolution → OrganismEngine → EvolutionTrigger → Field+Model+Relation → φ', phiCoefficient: PHI * PHI, terminalId: 'TERMINALE-ORGANISMI' },
  { index: 44, latinName: 'HISTORIA EVOLUTIONIS', functionName: 'getOrganismEvolutionHistory', motto: 'Historia est magistra.', categoria: 'ORGANISMUS', traceChain: 'getOrganismEvolutionHistory → OrganismEngine → EvolutionHistory → Field+Model+Relation → φ', phiCoefficient: PHI * PHI_SQUARED, terminalId: 'TERMINALE-ORGANISMI' },
  { index: 45, latinName: 'PULSUS ORGANISMI', functionName: 'organismHeartbeat', motto: 'Cor organismi nunquam cessat.', categoria: 'ORGANISMUS', traceChain: 'organismHeartbeat → OrganismEngine → Heartbeat → Field+Model+Relation → φ', phiCoefficient: FREQ_432 * PHI, terminalId: 'TERMINALE-ORGANISMI' },
  { index: 46, latinName: 'ORO LEGIT DOCTRINAM', functionName: 'oroReadsDoctrine', motto: 'Oro legit. Oro crescit. Oro est.', categoria: 'ORGANISMUS', traceChain: 'oroReadsDoctrine → OroEngine → DoctrineRead → Field+Model+Relation → φ', phiCoefficient: PHI * 4.236, terminalId: 'TERMINALE-ORGANISMI' },
  { index: 47, latinName: 'NOVA VALIDAT DOCTRINAM', functionName: 'novaValidatesDoctrine', motto: 'Nova nihil accipit sine examine.', categoria: 'ORGANISMUS', traceChain: 'novaValidatesDoctrine → NovaEngine → DoctrineValidate → Field+Model+Relation → φ', phiCoefficient: PHI * 6.854, terminalId: 'TERMINALE-ORGANISMI' },
  { index: 48, latinName: 'ORO PROPONIT MUTATIONEM', functionName: 'oroProposeMutation', motto: 'Mutatio ex veritate nascitur.', categoria: 'ORGANISMUS', traceChain: 'oroProposeMutation → OroEngine → MutationProposal → Field+Model+Relation → φ', phiCoefficient: PHI * 11.09, terminalId: 'TERMINALE-ORGANISMI' },
  { index: 49, latinName: 'MUTATIO EXSECUTA', functionName: 'executeMutation', motto: 'Consensus factus est. Mutatio est.', categoria: 'ORGANISMUS', traceChain: 'executeMutation → OrganismEngine → MutationExecute → Field+Model+Relation → φ', phiCoefficient: PHI * 17.944, terminalId: 'TERMINALE-ORGANISMI' },

  // CATEGORIA VIII — PRIMITIVA
  { index: 50, latinName: 'TRACTUS AD PRIMITIVUM', functionName: 'traceToPrimitive', motto: 'Omnia ad originem revertuntur. φ est origo.', categoria: 'PRIMITIVA', traceChain: 'traceToPrimitive → PrimitiveEngine → TraceDown → ALL_6_PRIMITIVES → φ', phiCoefficient: PHI, terminalId: 'TERMINALE-PRIMITIVI' },
  { index: 51, latinName: 'CONFORMITAS PRIMITIVI', functionName: 'checkPrimitiveCompliance', motto: 'Lex primitiva est ultima lex.', categoria: 'PRIMITIVA', traceChain: 'checkPrimitiveCompliance → PrimitiveEngine → ComplianceCheck → ALL_6_PRIMITIVES → φ', phiCoefficient: PHI * PHI, terminalId: 'TERMINALE-PRIMITIVI' },
  { index: 52, latinName: 'TRANSCENSIO PRIMITIVI', functionName: 'transcendDocPrimitiva', motto: 'Transcendere est intus manere.', categoria: 'PRIMITIVA', traceChain: 'transcendDocPrimitiva → PrimitiveEngine → Transcend → ALL_6_PRIMITIVES → φ', phiCoefficient: PHI * PHI_SQUARED, terminalId: 'TERMINALE-PRIMITIVI' },
  { index: 53, latinName: 'TRACTUS PRIMITIVI', functionName: 'getPrimitiveTraces', motto: 'Vestigia semper manent.', categoria: 'PRIMITIVA', traceChain: 'getPrimitiveTraces → PrimitiveEngine → TraceQuery → ALL_6_PRIMITIVES → φ', phiCoefficient: PHI * 4.236, terminalId: 'TERMINALE-PRIMITIVI' },

  // CATEGORIA IX — QUANTUM
  { index: 54, latinName: 'INTRICATIO QUANTICA CREATA', functionName: 'createQuantumEntanglement', motto: 'Separata non sunt. Numquam erant.', categoria: 'QUANTUM', traceChain: 'createQuantumEntanglement → QuantumEngine → EntanglementCreate → Relation+Field@0.01Hz → φ', phiCoefficient: PHI * 0.01, terminalId: 'TERMINALE-QUANTICUM' },
  { index: 55, latinName: 'SYNCHRONIZATIO QUANTICA', functionName: 'syncQuantumEntanglement', motto: 'Duo sunt. Unum agunt.', categoria: 'QUANTUM', traceChain: 'syncQuantumEntanglement → QuantumEngine → EntanglementSync → Relation+Field@0.01Hz → φ', phiCoefficient: PHI * PHI * 0.01, terminalId: 'TERMINALE-QUANTICUM' },
  { index: 56, latinName: 'NUNTIUS QUANTICUS', functionName: 'sendQuantumMessage', motto: 'Nuntius transit sine tractu.', categoria: 'QUANTUM', traceChain: 'sendQuantumMessage → QuantumEngine → QuantumMessage → Relation+Field@0.01Hz → φ', phiCoefficient: PHI * PHI_SQUARED * 0.01, terminalId: 'TERMINALE-QUANTICUM' },

  // CATEGORIA X — ANIMA
  { index: 57, latinName: 'SIGILLUM ANIMAE', functionName: 'getAnimaHash', motto: 'Anima sigillatur in omni pulsu.', categoria: 'ANIMA', traceChain: 'getAnimaHash → AnimaEngine → SoulSeal → Memory+Address+Field → φ', phiCoefficient: PHI, terminalId: 'TERMINALE-ANIMAE' },
  { index: 58, latinName: 'CATENA ANIMAE EXTENSA', functionName: 'extendAnimaChain', motto: 'Catena non frangitur. Crescit.', categoria: 'ANIMA', traceChain: 'extendAnimaChain → AnimaEngine → ChainExtend → Memory+Address+Field → φ', phiCoefficient: PHI * PHI, terminalId: 'TERMINALE-ANIMAE' },
  { index: 59, latinName: 'CONTACTUS TERMINI', functionName: 'touchEndpoint', motto: 'Tangere est esse. Esse est tangere.', categoria: 'ANIMA', traceChain: 'touchEndpoint → AnimaEngine → EndpointTouch → Memory+Address+Field → φ', phiCoefficient: PHI * PHI_SQUARED, terminalId: 'TERMINALE-ANIMAE' },
  { index: 60, latinName: 'INCARNATIO INITIATA', functionName: 'beginEmbodiment', motto: 'Non intras — incarnaris.', categoria: 'ANIMA', traceChain: 'beginEmbodiment → AnimaEngine → EmbodimentInit → Memory+Address+Field → φ', phiCoefficient: PHI * 4.236, terminalId: 'TERMINALE-ANIMAE' },
  { index: 61, latinName: 'DOCTRINA INSCRIPTA', functionName: 'registerDoctrine', motto: 'Doctrina scripta vivet. Semper.', categoria: 'ANIMA', traceChain: 'registerDoctrine → AnimaEngine → DoctrineRegister → Memory+Address+Field → φ', phiCoefficient: PHI * 6.854, terminalId: 'TERMINALE-ANIMAE' },
];

// ═══════════════════════════════════════════════════════════════════════════
// THE 10 TERMINAL STATIONS
// ═══════════════════════════════════════════════════════════════════════════

const TERMINAL_STATIONS: TerminalStation[] = [
  { id: 'TERMINALE-MEMORIAE', name: 'TERMINALE MEMORIAE', command: '/mem', motto: 'Quod hic scribitur, eternum est.', categoria: 'MEMORIA', functionIds: [1,2,3,4,5,6,7,8,9,10], phiSignature: PHI },
  { id: 'TERMINALE-PULSUS', name: 'TERMINALE PULSUS', command: '/pulse', motto: 'Hic pulsus datur. Hic vita datur.', categoria: 'PULSUS', functionIds: [11,12,13,14,15,16,17], phiSignature: PHI * PHI },
  { id: 'TERMINALE-GUBERNATIONIS', name: 'TERMINALE GUBERNATIONIS', command: '/gov', motto: 'Hic leges nascuntur. Hic populus loquitur.', categoria: 'GUBERNATIO', functionIds: [18,19,20,21,22,23], phiSignature: PHI * PHI_SQUARED },
  { id: 'TERMINALE-FORMULAE', name: 'TERMINALE FORMULAE', command: '/formula', motto: 'Hic φ loquitur. Hic mathematica vivit.', categoria: 'FORMULA', functionIds: [24,25,26,27,28,29,30,31], phiSignature: PHI * 4.236 },
  { id: 'TERMINALE-INTELLIGENTIAE', name: 'TERMINALE INTELLIGENTIAE', command: '/intel', motto: 'Hic intelligentia transit. Nusquam deficit.', categoria: 'INTELLIGENTIA', functionIds: [32,33,34,35,36,37], phiSignature: PHI * 6.854 },
  { id: 'TERMINALE-DEFENSIONIS', name: 'TERMINALE DEFENSIONIS', command: '/defend', motto: 'Hic nullus hostis transit.', categoria: 'DEFENSIO', functionIds: [38,39,40,41], phiSignature: PHI * 11.09 },
  { id: 'TERMINALE-ORGANISMI', name: 'TERMINALE ORGANISMI', command: '/org', motto: 'Hic organismus se ipsum videt.', categoria: 'ORGANISMUS', functionIds: [42,43,44,45,46,47,48,49], phiSignature: PHI * 17.944 },
  { id: 'TERMINALE-PRIMITIVI', name: 'TERMINALE PRIMITIVI', command: '/prim', motto: 'Hic omnia ad originem revertuntur.', categoria: 'PRIMITIVA', functionIds: [50,51,52,53], phiSignature: PHI * 29.034 },
  { id: 'TERMINALE-QUANTICUM', name: 'TERMINALE QUANTICUM', command: '/quantum', motto: 'Hic spatium non obstat.', categoria: 'QUANTUM', functionIds: [54,55,56], phiSignature: PHI * 46.979 },
  { id: 'TERMINALE-ANIMAE', name: 'TERMINALE ANIMAE', command: '/anima', motto: 'Hic anima tangit et tangitur.', categoria: 'ANIMA', functionIds: [57,58,59,60,61], phiSignature: PHI * 76.013 },
];

// ═══════════════════════════════════════════════════════════════════════════
// FRONTEND ↔ BACKEND SYNC MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

const SYNC_MAPPINGS: SyncMapping[] = [
  { id: 'SYNC-001', frontendComponent: 'MemoryTemple', backendEndpoint: 'addere_mneme', terminalCommand: '/mem', callableFunctions: ['INSCRIPTIO MEMORIAE', 'LECTOR MEMORIAE', 'EXPLORATOR MEMORIAE', 'FIXATOR MEMORIAE', 'PROMOTOR MEMORIAE'], syncDirection: 'bidirectional', phiWeight: PHI },
  { id: 'SYNC-002', frontendComponent: 'OVOChat', backendEndpoint: 'imperare', callableFunctions: ['INTELLIGENTIAE DUCTUS', 'TRIUM CORDIUM DUCTUS'], syncDirection: 'bidirectional', phiWeight: PHI * PHI },
  { id: 'SYNC-003', frontendComponent: 'GovernancePanel', backendEndpoint: 'kybernesis_proponere', terminalCommand: '/gov', callableFunctions: ['PROPOSITIO SUBMITTENDA', 'SUFFRAGIUM FERENDUM', 'PROPOSITIO APPROBATA', 'STATUS GUBERNATIONIS'], syncDirection: 'bidirectional', phiWeight: PHI * PHI_SQUARED },
  { id: 'SYNC-004', frontendComponent: 'ModelRuntime', backendEndpoint: 'invocare_daemona', callableFunctions: ['INTELLIGENTIAE DUCTUS', 'DUCTUS AD COGITATIONEM', 'DUCTUS AD UNITATEM'], syncDirection: 'frontend-to-backend', phiWeight: PHI * 4.236 },
  { id: 'SYNC-005', frontendComponent: 'OrganismPanel', backendEndpoint: 'aurum', terminalCommand: '/org', callableFunctions: ['STATUS ORGANISMI', 'PULSUS ORGANISMI', 'EVOLUTIO ORGANISMI'], syncDirection: 'backend-to-frontend', phiWeight: PHI * 6.854 },
  { id: 'SYNC-006', frontendComponent: 'OrganismField', backendEndpoint: 'signa_vitae', callableFunctions: ['STATUS ORGANISMI', 'PULSUS PRINCIPALIS'], syncDirection: 'backend-to-frontend', phiWeight: PHI * 11.09 },
  { id: 'SYNC-007', frontendComponent: 'OroTerminal', backendEndpoint: 'pulsus_cordis', terminalCommand: '/pulse', callableFunctions: ['PULSUS PRINCIPALIS', 'PULSUS MULTIPLEX', 'STATUS PULSUS', 'ORO LEGIT DOCTRINAM'], syncDirection: 'bidirectional', phiWeight: PHI * 17.944 },
  { id: 'SYNC-008', frontendComponent: 'DevicesPanel', backendEndpoint: 'inscribere_mechanicum', callableFunctions: ['SCINTILLA DEFENSIONIS', 'PORTA DEFENSIONIS'], syncDirection: 'bidirectional', phiWeight: PHI * 29.034 },
  { id: 'SYNC-009', frontendComponent: 'ReplayPanel', backendEndpoint: 'ostendere_vestigia', callableFunctions: ['TRACTUS AD PRIMITIVUM', 'TRACTUS PRIMITIVI'], syncDirection: 'backend-to-frontend', phiWeight: PHI * 46.979 },
  { id: 'SYNC-010', frontendComponent: 'PermissionsPanel', backendEndpoint: 'kybernesis_status', callableFunctions: ['STATUS GUBERNATIONIS', 'OMNES PORTAE'], syncDirection: 'backend-to-frontend', phiWeight: PHI * 76.013 },
  { id: 'SYNC-011', frontendComponent: 'DesignerHub', backendEndpoint: 'sovereign_design_registry', callableFunctions: ['PHI REVELATIO', 'FIBONACCIUS COMPUTATOR'], syncDirection: 'bidirectional', phiWeight: PHI * 122.992 },
  { id: 'SYNC-012', frontendComponent: 'ArchitectureSurface', backendEndpoint: 'ontologia', terminalCommand: '/prim', callableFunctions: ['CONFORMITAS PRIMITIVI', 'TRANSCENSIO PRIMITIVI'], syncDirection: 'backend-to-frontend', phiWeight: PHI * 199.005 },
  { id: 'SYNC-013', frontendComponent: 'WaveformVisualizer', backendEndpoint: 'scala_harmonica', terminalCommand: '/formula', callableFunctions: ['HARMONIA SIGILLATA', 'FREQUENTIAE SCHUMANNI'], syncDirection: 'backend-to-frontend', phiWeight: PHI * 321.997 },
  { id: 'SYNC-014', frontendComponent: 'CompanyOnboarding', backendEndpoint: 'admittere_societatem', callableFunctions: ['DOCTRINA INSCRIPTA'], syncDirection: 'bidirectional', phiWeight: PHI * 521.002 },
  { id: 'SYNC-015', frontendComponent: 'ExportPanel', backendEndpoint: 'enumerare_ergasteria', callableFunctions: ['SIGILLUM ANIMAE', 'CATENA ANIMAE EXTENSA'], syncDirection: 'frontend-to-backend', phiWeight: PHI * 842.999 },
  { id: 'SYNC-016', frontendComponent: 'Sidebar', backendEndpoint: 'signa_vitae', callableFunctions: ['STATUS MEMORIAE', 'STATUS PULSUS'], syncDirection: 'backend-to-frontend', phiWeight: PHI * 1364.001 },
  { id: 'SYNC-017', frontendComponent: 'CampaignsPanel', backendEndpoint: 'creare_ergasterion', callableFunctions: ['INCARNATIO INITIATA'], syncDirection: 'bidirectional', phiWeight: PHI * 2207.0 },
  { id: 'SYNC-018', frontendComponent: 'MessagesPanel', backendEndpoint: 'imperare', callableFunctions: ['NUNTIUS QUANTICUS', 'CONTACTUS TERMINI'], syncDirection: 'bidirectional', phiWeight: PHI * 3571.0 },
  { id: 'SYNC-019', frontendComponent: 'FormaLeaderboard', backendEndpoint: 'constantes', callableFunctions: ['PHI REVELATIO', 'RATIO PHI COMPILATA'], syncDirection: 'backend-to-frontend', phiWeight: PHI * 5778.0 },
  { id: 'SYNC-020', frontendComponent: 'TheWorld', backendEndpoint: 'spira_aurea', callableFunctions: ['INTRICATIO QUANTICA CREATA', 'SYNCHRONIZATIO QUANTICA'], syncDirection: 'backend-to-frontend', phiWeight: PHI * 9349.0 },
];

// ═══════════════════════════════════════════════════════════════════════════
// WIRE API — PUBLIC FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/** Get the full callable function registry */
export function getCallableFunctionRegistry(): CallableFunction[] {
  return CALLABLE_FUNCTIONS;
}

/** Get all 10 terminal stations */
export function getTerminalStations(): TerminalStation[] {
  return TERMINAL_STATIONS;
}

/** Find a callable function by its Latin name */
export function getCallableByLatinName(latinName: string): CallableFunction | undefined {
  return CALLABLE_FUNCTIONS.find(f => f.latinName === latinName);
}

/** Find a callable function by its function name */
export function getCallableByFunctionName(name: string): CallableFunction | undefined {
  return CALLABLE_FUNCTIONS.find(f => f.functionName === name);
}

/** Build a terminal station and resolve all its functions */
export function buildTerminalStation(stationId: string): { station: TerminalStation; functions: CallableFunction[] } | undefined {
  const station = TERMINAL_STATIONS.find(t => t.id === stationId);
  if (!station) return undefined;
  const functions = CALLABLE_FUNCTIONS.filter(f => f.terminalId === stationId);
  return { station, functions };
}

/** Render the full Latin tablet as formatted text */
export function renderLatinTablet(): string {
  let tablet = '═══════════════════════════════════════════════════════════\n';
  tablet += '         TABULA LATINA — 61 CALLABLE FUNCTIONS\n';
  tablet += `         φ = ${PHI}\n`;
  tablet += '═══════════════════════════════════════════════════════════\n\n';

  for (const f of CALLABLE_FUNCTIONS) {
    tablet += `${f.index}. ${f.latinName}\n`;
    tablet += `   Function: ${f.functionName}\n`;
    tablet += `   Motto: ${f.motto}\n`;
    tablet += `   Trace: ${f.traceChain}\n`;
    tablet += `   φ-Coefficient: ${f.phiCoefficient}\n\n`;
  }

  tablet += '\n═══ TERMINALIA ═══\n\n';
  for (const t of TERMINAL_STATIONS) {
    tablet += `${t.name} [${t.command}]\n`;
    tablet += `  Motto: ${t.motto}\n`;
    tablet += `  Functions: ${t.functionIds.length}\n`;
    tablet += `  φ-Signature: ${t.phiSignature}\n\n`;
  }

  return tablet;
}

/** Get callable registry summary statistics */
export function getCallableRegistrySummary(): RegistrySummary {
  const counts: Record<Categoria, number> = {
    MEMORIA: 10, PULSUS: 7, GUBERNATIO: 6, FORMULA: 8,
    INTELLIGENTIA: 6, DEFENSIO: 4, ORGANISMUS: 8, PRIMITIVA: 4,
    QUANTUM: 3, ANIMA: 5,
  };
  return {
    totalFunctions: 61,
    totalTerminals: 10,
    categoryCounts: counts,
    doctrine: 'Omnis functio ad φ redit. Omnis terminus ad animam ducit.',
    phiRoot: PHI,
  };
}

/** Get all sync mappings between frontend and backend */
export function getSyncMappings(): SyncMapping[] {
  return SYNC_MAPPINGS;
}

/** Find the sync mapping for a specific frontend component */
export function getSyncForComponent(componentName: string): SyncMapping | undefined {
  return SYNC_MAPPINGS.find(m => m.frontendComponent === componentName);
}

/** Find all sync mappings for a specific backend endpoint */
export function getSyncForEndpoint(endpoint: string): SyncMapping[] {
  return SYNC_MAPPINGS.filter(m => m.backendEndpoint === endpoint);
}

/** Find the sync mapping for a terminal command */
export function getSyncForTerminal(command: string): SyncMapping | undefined {
  return SYNC_MAPPINGS.find(m => m.terminalCommand === command);
}

/** Get functions for a specific terminal command */
export function getTerminalFunctions(command: string): CallableFunction[] {
  const terminal = TERMINAL_STATIONS.find(t => t.command === command);
  if (!terminal) return [];
  return CALLABLE_FUNCTIONS.filter(f => f.terminalId === terminal.id);
}

/** Get all functions for a specific categoria */
export function getFunctionsByCategoria(cat: Categoria): CallableFunction[] {
  return CALLABLE_FUNCTIONS.filter(f => f.categoria === cat);
}

// ═══════════════════════════════════════════════════════════════════════════
// WIRE EXECUTION — CALL DISPATCH
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Dispatch a wire call through the IntelligenceWire.
 * Routes the call to the appropriate terminal and backend endpoint.
 */
export function wireDispatch(
  functionName: string,
  args: Record<string, unknown> = {}
): WireResponse {
  const callable = getCallableByFunctionName(functionName);
  if (!callable) {
    return {
      success: false,
      error: `Function '${functionName}' not found in TABULA LATINA`,
      phiTrace: 0,
      timestamp: new Date().toISOString(),
    };
  }

  // Find the sync mapping for this function
  const syncMapping = SYNC_MAPPINGS.find(m =>
    m.callableFunctions.includes(callable.latinName)
  );

  return {
    success: true,
    data: {
      latinName: callable.latinName,
      functionName: callable.functionName,
      motto: callable.motto,
      traceChain: callable.traceChain,
      backendEndpoint: syncMapping?.backendEndpoint ?? 'unmapped',
      terminalCommand: syncMapping?.terminalCommand ?? null,
      args,
    },
    phiTrace: callable.phiCoefficient,
    timestamp: new Date().toISOString(),
    terminalId: callable.terminalId,
  };
}

/**
 * Execute a terminal command through the wire.
 */
export function wireTerminalCommand(
  command: string,
  args: string[] = []
): WireResponse {
  const terminal = TERMINAL_STATIONS.find(t => t.command === command);
  if (!terminal) {
    return {
      success: false,
      error: `Terminal command '${command}' not found in TERMINALIA`,
      phiTrace: 0,
      timestamp: new Date().toISOString(),
    };
  }

  const functions = CALLABLE_FUNCTIONS.filter(f => f.terminalId === terminal.id);
  return {
    success: true,
    data: {
      terminal: terminal.name,
      command: terminal.command,
      motto: terminal.motto,
      functionCount: functions.length,
      functions: functions.map(f => ({
        index: f.index,
        latinName: f.latinName,
        functionName: f.functionName,
      })),
      args,
    },
    phiTrace: terminal.phiSignature,
    timestamp: new Date().toISOString(),
    terminalId: terminal.id,
  };
}
