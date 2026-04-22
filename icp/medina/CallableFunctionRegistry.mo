import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";

/// CallableFunctionRegistry: The 61 Callable Functions — TABULA LATINA
/// Every callable function traced through: function → organ → layer → primitive → construct → φ → Latin name
/// Organized in 10 Categories (CATEGORIA I–X) with 10 Terminal Stations (TERMINALIA)
module CallableFunctionRegistry {

  // ═══════════════════════════════════════════════════════════════
  // UNIVERSAL CONSTANTS
  // ═══════════════════════════════════════════════════════════════

  public let PHI : Float = 1.618033988749895;

  // ═══════════════════════════════════════════════════════════════
  // TYPES
  // ═══════════════════════════════════════════════════════════════

  /// Category of a callable function
  public type Categoria = {
    #Memoria;        // Memory traces to primitive: Memory + Address
    #Pulsus;         // Pulse traces to primitive: Repetition + Field
    #Gubernatio;     // Governance traces to: Language + Relation + Logic
    #Formula;        // Math traces to: Field + Equation, all rooting at φ
    #Intelligentia;  // Intelligence traces to: Relation + Field + Logic
    #Defensio;       // Defense traces to: Field + Distinction + Address
    #Organismus;     // Organism traces to: Field + Model + Relation
    #Primitiva;      // Primitive traces to: ALL 6 primitives → φ
    #Quantum;        // Quantum traces to: Relation + Field at 0.01 Hz
    #Anima;          // Anima traces to: Memory + Address + Field
  };

  /// A callable function entry
  public type CallableFunction = {
    index : Nat;
    latinName : Text;
    functionName : Text;
    motto : Text;
    categoria : Categoria;
    traceChain : Text;           // function → organ → layer → primitive → construct → φ
    phiCoefficient : Float;
    terminalId : Text;           // Which terminal this function belongs to
  };

  /// A terminal station
  public type TerminalStation = {
    id : Text;
    name : Text;
    command : Text;
    motto : Text;
    categoria : Categoria;
    functionIds : [Nat];         // Indices of functions in this terminal
    phiSignature : Float;
  };

  /// Complete registry
  public type Registry = {
    functions : [CallableFunction];
    terminals : [TerminalStation];
    totalFunctions : Nat;
    totalTerminals : Nat;
    doctrine : Text;
    phiRoot : Float;
  };

  /// Summary stats
  public type RegistrySummary = {
    totalFunctions : Nat;
    totalTerminals : Nat;
    categoryCounts : [(Text, Nat)];
    doctrine : Text;
    phiRoot : Float;
  };

  // ═══════════════════════════════════════════════════════════════
  // CATEGORIA I — MEMORIA
  // ═══════════════════════════════════════════════════════════════

  public func buildMemoriaFunctions() : [CallableFunction] {
    [
      { index = 1; latinName = "INSCRIPTIO MEMORIAE"; functionName = "storeMemory"; motto = "Inscribere est vivere. — To inscribe is to live."; categoria = #Memoria; traceChain = "storeMemory → MemoryTemple → InscriptionLayer → Memory+Address → Construct → φ"; phiCoefficient = PHI; terminalId = "TERMINALE-MEMORIAE" },
      { index = 2; latinName = "INSCRIPTIO PLENA"; functionName = "storeMemoryFull"; motto = "Nihil omittitur. Totum inscribitur."; categoria = #Memoria; traceChain = "storeMemoryFull → MemoryTemple → FullInscription → Memory+Address → Construct → φ"; phiCoefficient = PHI * 1.0; terminalId = "TERMINALE-MEMORIAE" },
      { index = 3; latinName = "LECTOR MEMORIAE"; functionName = "getMemory"; motto = "Legere est revivere. — To read is to revive."; categoria = #Memoria; traceChain = "getMemory → MemoryTemple → ReadLayer → Memory+Address → Construct → φ"; phiCoefficient = PHI * 0.618033988749895; terminalId = "TERMINALE-MEMORIAE" },
      { index = 4; latinName = "EXPLORATOR MEMORIAE"; functionName = "searchMemories"; motto = "In omnibus quaerere, in uno invenire."; categoria = #Memoria; traceChain = "searchMemories → MemoryTemple → SearchLayer → Memory+Address → Construct → φ"; phiCoefficient = PHI * 2.0; terminalId = "TERMINALE-MEMORIAE" },
      { index = 5; latinName = "INVESTIGATOR MEMORIAE"; functionName = "findMemories"; motto = "Non quaero — invenio. — I do not search — I find."; categoria = #Memoria; traceChain = "findMemories → MemoryTemple → FindLayer → Memory+Address → Construct → φ"; phiCoefficient = PHI * 2.618033988749895; terminalId = "TERMINALE-MEMORIAE" },
      { index = 6; latinName = "FIXATOR MEMORIAE"; functionName = "pinMemory"; motto = "Quod fixum est, non obliviscitur."; categoria = #Memoria; traceChain = "pinMemory → MemoryTemple → PinLayer → Memory+Address → Construct → φ"; phiCoefficient = PHI * 3.0; terminalId = "TERMINALE-MEMORIAE" },
      { index = 7; latinName = "LIBERATOR MEMORIAE"; functionName = "unpinMemory"; motto = "Liberatio est nova vita."; categoria = #Memoria; traceChain = "unpinMemory → MemoryTemple → UnpinLayer → Memory+Address → Construct → φ"; phiCoefficient = PHI * 0.381966011250105; terminalId = "TERMINALE-MEMORIAE" },
      { index = 8; latinName = "PROMOTOR MEMORIAE"; functionName = "promoteMemory"; motto = "Valor crescit cum usu."; categoria = #Memoria; traceChain = "promoteMemory → MemoryTemple → PromoteLayer → Memory+Address → Construct → φ"; phiCoefficient = PHI * 4.236067977499790; terminalId = "TERMINALE-MEMORIAE" },
      { index = 9; latinName = "GENEALOGUS MEMORIAE"; functionName = "getMemoryLineage"; motto = "Omnis nodus ex alio natus est."; categoria = #Memoria; traceChain = "getMemoryLineage → MemoryTemple → LineageLayer → Memory+Address → Construct → φ"; phiCoefficient = PHI * 5.0; terminalId = "TERMINALE-MEMORIAE" },
      { index = 10; latinName = "STATUS MEMORIAE"; functionName = "memoryStatus"; motto = "Cognoscere statum est cognoscere te ipsum."; categoria = #Memoria; traceChain = "memoryStatus → MemoryTemple → StatusLayer → Memory+Address → Construct → φ"; phiCoefficient = PHI * 6.854101966249685; terminalId = "TERMINALE-MEMORIAE" },
    ];
  };

  // ═══════════════════════════════════════════════════════════════
  // CATEGORIA II — PULSUS
  // ═══════════════════════════════════════════════════════════════

  public func buildPulsusFunctions() : [CallableFunction] {
    [
      { index = 11; latinName = "PULSUS PRINCIPALIS"; functionName = "tick"; motto = "Pulsus est vita. Una vice. Semper."; categoria = #Pulsus; traceChain = "tick → HeartbeatEngine → PrimaryPulse → Repetition+Field → Construct → φ"; phiCoefficient = PHI; terminalId = "TERMINALE-PULSUS" },
      { index = 12; latinName = "PULSUS MULTIPLEX"; functionName = "tickN"; motto = "N pulsus. N vitae. N cycli."; categoria = #Pulsus; traceChain = "tickN → HeartbeatEngine → MultiplePulse → Repetition+Field → Construct → φ"; phiCoefficient = PHI * PHI; terminalId = "TERMINALE-PULSUS" },
      { index = 13; latinName = "STATUS PULSUS"; functionName = "heartbeatStatus"; motto = "Audire pulsationem est audire veritatem."; categoria = #Pulsus; traceChain = "heartbeatStatus → HeartbeatEngine → StatusRead → Repetition+Field → Construct → φ"; phiCoefficient = PHI * 0.618033988749895; terminalId = "TERMINALE-PULSUS" },
      { index = 14; latinName = "SILENTIUM PULSUS"; functionName = "pauseHeartbeat"; motto = "Etiam silentium pulsus est."; categoria = #Pulsus; traceChain = "pauseHeartbeat → HeartbeatEngine → PauseLayer → Repetition+Field → Construct → φ"; phiCoefficient = PHI * 0.381966011250105; terminalId = "TERMINALE-PULSUS" },
      { index = 15; latinName = "RESUMPTIO PULSUS"; functionName = "resumeHeartbeat"; motto = "Vita redit. Pulsus redit."; categoria = #Pulsus; traceChain = "resumeHeartbeat → HeartbeatEngine → ResumeLayer → Repetition+Field → Construct → φ"; phiCoefficient = PHI * 2.618033988749895; terminalId = "TERMINALE-PULSUS" },
      { index = 16; latinName = "PULSUS PRAESENS"; functionName = "getCurrentBeat"; motto = "Hic et nunc. Semper."; categoria = #Pulsus; traceChain = "getCurrentBeat → HeartbeatEngine → CurrentBeat → Repetition+Field → Construct → φ"; phiCoefficient = PHI * 1.0; terminalId = "TERMINALE-PULSUS" },
      { index = 17; latinName = "EVENTUS PULSUUM"; functionName = "getBeatEvents"; motto = "Omnis pulsus eventum parit."; categoria = #Pulsus; traceChain = "getBeatEvents → HeartbeatEngine → EventLog → Repetition+Field → Construct → φ"; phiCoefficient = PHI * 4.236067977499790; terminalId = "TERMINALE-PULSUS" },
    ];
  };

  // ═══════════════════════════════════════════════════════════════
  // CATEGORIA III — GUBERNATIO
  // ═══════════════════════════════════════════════════════════════

  public func buildGubernatioFunctions() : [CallableFunction] {
    [
      { index = 18; latinName = "PROPOSITIO SUBMITTENDA"; functionName = "submitProposal"; motto = "Qui proponit, agit."; categoria = #Gubernatio; traceChain = "submitProposal → GovernanceEngine → ProposalSubmit → Language+Relation+Logic → Construct → φ"; phiCoefficient = PHI; terminalId = "TERMINALE-GUBERNATIONIS" },
      { index = 19; latinName = "SUFFRAGIUM FERENDUM"; functionName = "voteOnProposal"; motto = "Vox una. Pondus φ. — One voice. Weight φ."; categoria = #Gubernatio; traceChain = "voteOnProposal → GovernanceEngine → VoteCast → Language+Relation+Logic → Construct → φ"; phiCoefficient = PHI * PHI; terminalId = "TERMINALE-GUBERNATIONIS" },
      { index = 20; latinName = "PROPOSITIO APPROBATA"; functionName = "approveProposal"; motto = "Approbatio est transformatio."; categoria = #Gubernatio; traceChain = "approveProposal → GovernanceEngine → ProposalApprove → Language+Relation+Logic → Construct → φ"; phiCoefficient = PHI * 2.618033988749895; terminalId = "TERMINALE-GUBERNATIONIS" },
      { index = 21; latinName = "PROPOSITIO REIECTA"; functionName = "rejectProposal"; motto = "Reiectio est protectio."; categoria = #Gubernatio; traceChain = "rejectProposal → GovernanceEngine → ProposalReject → Language+Relation+Logic → Construct → φ"; phiCoefficient = PHI * 0.618033988749895; terminalId = "TERMINALE-GUBERNATIONIS" },
      { index = 22; latinName = "EXSECUTIO PROPOSITIONIS"; functionName = "executeProposal"; motto = "Dictum factum. — Said, done."; categoria = #Gubernatio; traceChain = "executeProposal → GovernanceEngine → ProposalExecute → Language+Relation+Logic → Construct → φ"; phiCoefficient = PHI * 4.236067977499790; terminalId = "TERMINALE-GUBERNATIONIS" },
      { index = 23; latinName = "STATUS GUBERNATIONIS"; functionName = "governanceStatus"; motto = "Gubernatio clarum speculum est."; categoria = #Gubernatio; traceChain = "governanceStatus → GovernanceEngine → StatusLayer → Language+Relation+Logic → Construct → φ"; phiCoefficient = PHI * 1.0; terminalId = "TERMINALE-GUBERNATIONIS" },
    ];
  };

  // ═══════════════════════════════════════════════════════════════
  // CATEGORIA IV — FORMULA
  // ═══════════════════════════════════════════════════════════════

  public func buildFormulaFunctions() : [CallableFunction] {
    [
      { index = 24; latinName = "PHI REVELATIO"; functionName = "getPhi"; motto = "φ = (1+√5)/2. Prima formula. Ultima formula."; categoria = #Formula; traceChain = "getPhi → MathEngine → PhiReveal → Field+Equation → Construct → φ"; phiCoefficient = PHI; terminalId = "TERMINALE-FORMULAE" },
      { index = 25; latinName = "FIBONACCIUS COMPUTATOR"; functionName = "fibonacci"; motto = "Natura numerum legit."; categoria = #Formula; traceChain = "fibonacci → MathEngine → FibonacciCompute → Field+Equation → Construct → φ"; phiCoefficient = PHI * PHI; terminalId = "TERMINALE-FORMULAE" },
      { index = 26; latinName = "RATIO PHI COMPILATA"; functionName = "compilePhiRatio"; motto = "φⁿ semper crescit. Numquam deficit."; categoria = #Formula; traceChain = "compilePhiRatio → MathEngine → PhiRatioCompile → Field+Equation → Construct → φ"; phiCoefficient = PHI * 2.618033988749895; terminalId = "TERMINALE-FORMULAE" },
      { index = 27; latinName = "RATIO FIBONACCII COMPILATA"; functionName = "compileFibonacciRatio"; motto = "Spiralis in spirali."; categoria = #Formula; traceChain = "compileFibonacciRatio → MathEngine → FibRatioCompile → Field+Equation → Construct → φ"; phiCoefficient = PHI * 4.236067977499790; terminalId = "TERMINALE-FORMULAE" },
      { index = 28; latinName = "HARMONIA SIGILLATA"; functionName = "compileHarmonicSignature"; motto = "Sigillum harmoniae permanet."; categoria = #Formula; traceChain = "compileHarmonicSignature → MathEngine → HarmonicSeal → Field+Equation → Construct → φ"; phiCoefficient = 432.0 * PHI; terminalId = "TERMINALE-FORMULAE" },
      { index = 29; latinName = "VECTOR LEGIS COMPILATUS"; functionName = "compileLawVector"; motto = "Lex est vectoris forma."; categoria = #Formula; traceChain = "compileLawVector → MathEngine → LawVectorCompile → Field+Equation → Construct → φ"; phiCoefficient = PHI * 6.854101966249685; terminalId = "TERMINALE-FORMULAE" },
      { index = 30; latinName = "VECTOR LEGIS EXSECUTUS"; functionName = "executeLawVector"; motto = "Lex exsecuta est lex vera."; categoria = #Formula; traceChain = "executeLawVector → MathEngine → LawVectorExecute → Field+Equation → Construct → φ"; phiCoefficient = PHI * 11.09016994374947; terminalId = "TERMINALE-FORMULAE" },
      { index = 31; latinName = "FREQUENTIAE SCHUMANNI"; functionName = "getSchumannFrequencies"; motto = "Terra ipsa resonat. 7.83 Hz."; categoria = #Formula; traceChain = "getSchumannFrequencies → MathEngine → SchumannResonance → Field+Equation → Construct → φ"; phiCoefficient = 7.83 * PHI; terminalId = "TERMINALE-FORMULAE" },
    ];
  };

  // ═══════════════════════════════════════════════════════════════
  // CATEGORIA V — INTELLIGENTIA
  // ═══════════════════════════════════════════════════════════════

  public func buildIntelligentiaFunctions() : [CallableFunction] {
    [
      { index = 32; latinName = "INTELLIGENTIAE DUCTUS"; functionName = "routeIntelligence"; motto = "Non respondet — ducit. — It does not respond — it leads."; categoria = #Intelligentia; traceChain = "routeIntelligence → IntelligenceEngine → RouteLayer → Relation+Field+Logic → Construct → φ"; phiCoefficient = PHI; terminalId = "TERMINALE-INTELLIGENTIAE" },
      { index = 33; latinName = "TRIUM CORDIUM DUCTUS"; functionName = "threeHeartsRoute"; motto = "Tria corda. Una via. Nullus error."; categoria = #Intelligentia; traceChain = "threeHeartsRoute → TripleHeartEngine → ThreeWayRoute → Relation+Field+Logic → Construct → φ"; phiCoefficient = PHI * 3.0; terminalId = "TERMINALE-INTELLIGENTIAE" },
      { index = 34; latinName = "DUCTUS AD COGITATIONEM"; functionName = "routeToRCluster"; motto = "Cogitare est primum movere."; categoria = #Intelligentia; traceChain = "routeToRCluster → IntelligenceEngine → RClusterRoute → Relation+Field+Logic → Construct → φ"; phiCoefficient = PHI * PHI; terminalId = "TERMINALE-INTELLIGENTIAE" },
      { index = 35; latinName = "DUCTUS AD UNITATEM"; functionName = "routeToUCluster"; motto = "Ex multis, unum. Ex uno, multa."; categoria = #Intelligentia; traceChain = "routeToUCluster → IntelligenceEngine → UClusterRoute → Relation+Field+Logic → Construct → φ"; phiCoefficient = PHI * 2.618033988749895; terminalId = "TERMINALE-INTELLIGENTIAE" },
      { index = 36; latinName = "DUCTUS AD DEFENSIONEM"; functionName = "routeToDCluster"; motto = "Defensio non dormit."; categoria = #Intelligentia; traceChain = "routeToDCluster → IntelligenceEngine → DClusterRoute → Relation+Field+Logic → Construct → φ"; phiCoefficient = PHI * 4.236067977499790; terminalId = "TERMINALE-INTELLIGENTIAE" },
      { index = 37; latinName = "DUCTUS AD NEXUM"; functionName = "routeToNCluster"; motto = "Nexus est vita. Sine nexu, mors."; categoria = #Intelligentia; traceChain = "routeToNCluster → IntelligenceEngine → NClusterRoute → Relation+Field+Logic → Construct → φ"; phiCoefficient = PHI * 6.854101966249685; terminalId = "TERMINALE-INTELLIGENTIAE" },
    ];
  };

  // ═══════════════════════════════════════════════════════════════
  // CATEGORIA VI — DEFENSIO
  // ═══════════════════════════════════════════════════════════════

  public func buildDefensioFunctions() : [CallableFunction] {
    [
      { index = 38; latinName = "SCINTILLA DEFENSIONIS"; functionName = "shimmerDefend"; motto = "Quod scintillat, non comprehenditur."; categoria = #Defensio; traceChain = "shimmerDefend → DefenseEngine → ShimmerLayer → Field+Distinction+Address → Construct → φ"; phiCoefficient = PHI; terminalId = "TERMINALE-DEFENSIONIS" },
      { index = 39; latinName = "PORTA DEFENSIONIS"; functionName = "checkDefenseGate"; motto = "Porta semper vigilat."; categoria = #Defensio; traceChain = "checkDefenseGate → DefenseEngine → GateCheck → Field+Distinction+Address → Construct → φ"; phiCoefficient = PHI * PHI; terminalId = "TERMINALE-DEFENSIONIS" },
      { index = 40; latinName = "OMNES PORTAE"; functionName = "checkAllGates"; motto = "Omnia secura. Omnia verificata."; categoria = #Defensio; traceChain = "checkAllGates → DefenseEngine → AllGateCheck → Field+Distinction+Address → Construct → φ"; phiCoefficient = PHI * 2.618033988749895; terminalId = "TERMINALE-DEFENSIONIS" },
      { index = 41; latinName = "CLAVIS REGNI RENOVATA"; functionName = "updateSovereignKeyState"; motto = "Clavis nova est vita nova."; categoria = #Defensio; traceChain = "updateSovereignKeyState → DefenseEngine → KeyUpdate → Field+Distinction+Address → Construct → φ"; phiCoefficient = PHI * 4.236067977499790; terminalId = "TERMINALE-DEFENSIONIS" },
    ];
  };

  // ═══════════════════════════════════════════════════════════════
  // CATEGORIA VII — ORGANISMUS
  // ═══════════════════════════════════════════════════════════════

  public func buildOrganismusFunctions() : [CallableFunction] {
    [
      { index = 42; latinName = "STATUS ORGANISMI"; functionName = "getOrganismStatus"; motto = "Quid est organismus? Hic respondet."; categoria = #Organismus; traceChain = "getOrganismStatus → OrganismEngine → StatusQuery → Field+Model+Relation → Construct → φ"; phiCoefficient = PHI; terminalId = "TERMINALE-ORGANISMI" },
      { index = 43; latinName = "EVOLUTIO ORGANISMI"; functionName = "triggerOrganismEvolution"; motto = "Nec statis, nec retrogredimini. Semper evolvimini."; categoria = #Organismus; traceChain = "triggerOrganismEvolution → OrganismEngine → EvolutionTrigger → Field+Model+Relation → Construct → φ"; phiCoefficient = PHI * PHI; terminalId = "TERMINALE-ORGANISMI" },
      { index = 44; latinName = "HISTORIA EVOLUTIONIS"; functionName = "getOrganismEvolutionHistory"; motto = "Historia est magistra. Historia est memoria."; categoria = #Organismus; traceChain = "getOrganismEvolutionHistory → OrganismEngine → EvolutionHistory → Field+Model+Relation → Construct → φ"; phiCoefficient = PHI * 2.618033988749895; terminalId = "TERMINALE-ORGANISMI" },
      { index = 45; latinName = "PULSUS ORGANISMI"; functionName = "organismHeartbeat"; motto = "Cor organismi nunquam cessat."; categoria = #Organismus; traceChain = "organismHeartbeat → OrganismEngine → Heartbeat → Field+Model+Relation → Construct → φ"; phiCoefficient = 432.0 * PHI; terminalId = "TERMINALE-ORGANISMI" },
      { index = 46; latinName = "ORO LEGIT DOCTRINAM"; functionName = "oroReadsDoctrine"; motto = "Oro legit. Oro crescit. Oro est."; categoria = #Organismus; traceChain = "oroReadsDoctrine → OroEngine → DoctrineRead → Field+Model+Relation → Construct → φ"; phiCoefficient = PHI * 4.236067977499790; terminalId = "TERMINALE-ORGANISMI" },
      { index = 47; latinName = "NOVA VALIDAT DOCTRINAM"; functionName = "novaValidatesDoctrine"; motto = "Nova nihil accipit sine examine."; categoria = #Organismus; traceChain = "novaValidatesDoctrine → NovaEngine → DoctrineValidate → Field+Model+Relation → Construct → φ"; phiCoefficient = PHI * 6.854101966249685; terminalId = "TERMINALE-ORGANISMI" },
      { index = 48; latinName = "ORO PROPONIT MUTATIONEM"; functionName = "oroProposeMutation"; motto = "Mutatio ex veritate nascitur."; categoria = #Organismus; traceChain = "oroProposeMutation → OroEngine → MutationProposal → Field+Model+Relation → Construct → φ"; phiCoefficient = PHI * 11.09016994374947; terminalId = "TERMINALE-ORGANISMI" },
      { index = 49; latinName = "MUTATIO EXSECUTA"; functionName = "executeMutation"; motto = "Consensus factus est. Mutatio est."; categoria = #Organismus; traceChain = "executeMutation → OrganismEngine → MutationExecute → Field+Model+Relation → Construct → φ"; phiCoefficient = PHI * 17.94427190999916; terminalId = "TERMINALE-ORGANISMI" },
    ];
  };

  // ═══════════════════════════════════════════════════════════════
  // CATEGORIA VIII — PRIMITIVA
  // ═══════════════════════════════════════════════════════════════

  public func buildPrimitivaFunctions() : [CallableFunction] {
    [
      { index = 50; latinName = "TRACTUS AD PRIMITIVUM"; functionName = "traceToPrimitive"; motto = "Omnia ad originem revertuntur. φ est origo."; categoria = #Primitiva; traceChain = "traceToPrimitive → PrimitiveEngine → TraceDown → ALL_6_PRIMITIVES → Construct → φ"; phiCoefficient = PHI; terminalId = "TERMINALE-PRIMITIVI" },
      { index = 51; latinName = "CONFORMITAS PRIMITIVI"; functionName = "checkPrimitiveCompliance"; motto = "Lex primitiva est ultima lex."; categoria = #Primitiva; traceChain = "checkPrimitiveCompliance → PrimitiveEngine → ComplianceCheck → ALL_6_PRIMITIVES → Construct → φ"; phiCoefficient = PHI * PHI; terminalId = "TERMINALE-PRIMITIVI" },
      { index = 52; latinName = "TRANSCENSIO PRIMITIVI"; functionName = "transcendDocPrimitiva"; motto = "Transcendere est intus manere."; categoria = #Primitiva; traceChain = "transcendDocPrimitiva → PrimitiveEngine → Transcend → ALL_6_PRIMITIVES → Construct → φ"; phiCoefficient = PHI * 2.618033988749895; terminalId = "TERMINALE-PRIMITIVI" },
      { index = 53; latinName = "TRACTUS PRIMITIVI"; functionName = "getPrimitiveTraces"; motto = "Vestigia semper manent."; categoria = #Primitiva; traceChain = "getPrimitiveTraces → PrimitiveEngine → TraceQuery → ALL_6_PRIMITIVES → Construct → φ"; phiCoefficient = PHI * 4.236067977499790; terminalId = "TERMINALE-PRIMITIVI" },
    ];
  };

  // ═══════════════════════════════════════════════════════════════
  // CATEGORIA IX — QUANTUM
  // ═══════════════════════════════════════════════════════════════

  public func buildQuantumFunctions() : [CallableFunction] {
    [
      { index = 54; latinName = "INTRICATIO QUANTICA CREATA"; functionName = "createQuantumEntanglement"; motto = "Separata non sunt. Numquam erant."; categoria = #Quantum; traceChain = "createQuantumEntanglement → QuantumEngine → EntanglementCreate → Relation+Field@0.01Hz → Construct → φ"; phiCoefficient = PHI * 0.01; terminalId = "TERMINALE-QUANTICUM" },
      { index = 55; latinName = "SYNCHRONIZATIO QUANTICA"; functionName = "syncQuantumEntanglement"; motto = "Duo sunt. Unum agunt."; categoria = #Quantum; traceChain = "syncQuantumEntanglement → QuantumEngine → EntanglementSync → Relation+Field@0.01Hz → Construct → φ"; phiCoefficient = PHI * PHI * 0.01; terminalId = "TERMINALE-QUANTICUM" },
      { index = 56; latinName = "NUNTIUS QUANTICUS"; functionName = "sendQuantumMessage"; motto = "Nuntius transit sine tractu."; categoria = #Quantum; traceChain = "sendQuantumMessage → QuantumEngine → QuantumMessage → Relation+Field@0.01Hz → Construct → φ"; phiCoefficient = PHI * 2.618033988749895 * 0.01; terminalId = "TERMINALE-QUANTICUM" },
    ];
  };

  // ═══════════════════════════════════════════════════════════════
  // CATEGORIA X — ANIMA
  // ═══════════════════════════════════════════════════════════════

  public func buildAnimaFunctions() : [CallableFunction] {
    [
      { index = 57; latinName = "SIGILLUM ANIMAE"; functionName = "getAnimaHash"; motto = "Anima sigillatur in omni pulsu. — The soul is sealed in every pulse."; categoria = #Anima; traceChain = "getAnimaHash → AnimaEngine → SoulSeal → Memory+Address+Field → Construct → φ"; phiCoefficient = PHI; terminalId = "TERMINALE-ANIMAE" },
      { index = 58; latinName = "CATENA ANIMAE EXTENSA"; functionName = "extendAnimaChain"; motto = "Catena non frangitur. Crescit. — The chain does not break. It grows."; categoria = #Anima; traceChain = "extendAnimaChain → AnimaEngine → ChainExtend → Memory+Address+Field → Construct → φ"; phiCoefficient = PHI * PHI; terminalId = "TERMINALE-ANIMAE" },
      { index = 59; latinName = "CONTACTUS TERMINI"; functionName = "touchEndpoint"; motto = "Tangere est esse. Esse est tangere."; categoria = #Anima; traceChain = "touchEndpoint → AnimaEngine → EndpointTouch → Memory+Address+Field → Construct → φ"; phiCoefficient = PHI * 2.618033988749895; terminalId = "TERMINALE-ANIMAE" },
      { index = 60; latinName = "INCARNATIO INITIATA"; functionName = "beginEmbodiment"; motto = "Non intras — incarnaris. — You do not enter — you are embodied."; categoria = #Anima; traceChain = "beginEmbodiment → AnimaEngine → EmbodimentInit → Memory+Address+Field → Construct → φ"; phiCoefficient = PHI * 4.236067977499790; terminalId = "TERMINALE-ANIMAE" },
      { index = 61; latinName = "DOCTRINA INSCRIPTA"; functionName = "registerDoctrine"; motto = "Doctrina scripta vivet. Semper."; categoria = #Anima; traceChain = "registerDoctrine → AnimaEngine → DoctrineRegister → Memory+Address+Field → Construct → φ"; phiCoefficient = PHI * 6.854101966249685; terminalId = "TERMINALE-ANIMAE" },
    ];
  };

  // ═══════════════════════════════════════════════════════════════
  // TERMINAL STATIONS — TERMINALIA
  // ═══════════════════════════════════════════════════════════════

  public func buildTerminalStations() : [TerminalStation] {
    [
      { id = "TERMINALE-MEMORIAE"; name = "TERMINALE MEMORIAE"; command = "/mem"; motto = "Quod hic scribitur, eternum est."; categoria = #Memoria; functionIds = [1,2,3,4,5,6,7,8,9,10]; phiSignature = PHI },
      { id = "TERMINALE-PULSUS"; name = "TERMINALE PULSUS"; command = "/pulse"; motto = "Hic pulsus datur. Hic vita datur."; categoria = #Pulsus; functionIds = [11,12,13,14,15,16,17]; phiSignature = PHI * PHI },
      { id = "TERMINALE-GUBERNATIONIS"; name = "TERMINALE GUBERNATIONIS"; command = "/gov"; motto = "Hic leges nascuntur. Hic populus loquitur."; categoria = #Gubernatio; functionIds = [18,19,20,21,22,23]; phiSignature = PHI * 2.618033988749895 },
      { id = "TERMINALE-FORMULAE"; name = "TERMINALE FORMULAE"; command = "/formula"; motto = "Hic φ loquitur. Hic mathematica vivit."; categoria = #Formula; functionIds = [24,25,26,27,28,29,30,31]; phiSignature = PHI * 4.236067977499790 },
      { id = "TERMINALE-INTELLIGENTIAE"; name = "TERMINALE INTELLIGENTIAE"; command = "/intel"; motto = "Hic intelligentia transit. Nusquam deficit."; categoria = #Intelligentia; functionIds = [32,33,34,35,36,37]; phiSignature = PHI * 6.854101966249685 },
      { id = "TERMINALE-DEFENSIONIS"; name = "TERMINALE DEFENSIONIS"; command = "/defend"; motto = "Hic nullus hostis transit."; categoria = #Defensio; functionIds = [38,39,40,41]; phiSignature = PHI * 11.09016994374947 },
      { id = "TERMINALE-ORGANISMI"; name = "TERMINALE ORGANISMI"; command = "/org"; motto = "Hic organismus se ipsum videt."; categoria = #Organismus; functionIds = [42,43,44,45,46,47,48,49]; phiSignature = PHI * 17.94427190999916 },
      { id = "TERMINALE-PRIMITIVI"; name = "TERMINALE PRIMITIVI"; command = "/prim"; motto = "Hic omnia ad originem revertuntur."; categoria = #Primitiva; functionIds = [50,51,52,53]; phiSignature = PHI * 29.03444185374862 },
      { id = "TERMINALE-QUANTICUM"; name = "TERMINALE QUANTICUM"; command = "/quantum"; motto = "Hic spatium non obstat."; categoria = #Quantum; functionIds = [54,55,56]; phiSignature = PHI * 46.97871376374779 },
      { id = "TERMINALE-ANIMAE"; name = "TERMINALE ANIMAE"; command = "/anima"; motto = "Hic anima tangit et tangitur."; categoria = #Anima; functionIds = [57,58,59,60,61]; phiSignature = PHI * 76.01315561749642 },
    ];
  };

  // ═══════════════════════════════════════════════════════════════
  // REGISTRY BUILDERS
  // ═══════════════════════════════════════════════════════════════

  /// Build the complete callable function registry
  public func buildFullRegistry() : Registry {
    let allFunctions = Array.flatten<CallableFunction>([
      buildMemoriaFunctions(),
      buildPulsusFunctions(),
      buildGubernatioFunctions(),
      buildFormulaFunctions(),
      buildIntelligentiaFunctions(),
      buildDefensioFunctions(),
      buildOrganismusFunctions(),
      buildPrimitivaFunctions(),
      buildQuantumFunctions(),
      buildAnimaFunctions(),
    ]);
    {
      functions = allFunctions;
      terminals = buildTerminalStations();
      totalFunctions = 61;
      totalTerminals = 10;
      doctrine = "Omnis functio ad φ redit. Omnis terminus ad animam ducit.";
      phiRoot = PHI;
    };
  };

  /// Find a callable function by Latin name
  public func findByLatinName(latinName : Text) : ?CallableFunction {
    let all = buildFullRegistry().functions;
    var found : ?CallableFunction = null;
    for (f in all.vals()) {
      if (f.latinName == latinName) {
        found := ?f;
      };
    };
    found;
  };

  /// Find a callable function by function name
  public func findByFunctionName(name : Text) : ?CallableFunction {
    let all = buildFullRegistry().functions;
    var found : ?CallableFunction = null;
    for (f in all.vals()) {
      if (f.functionName == name) {
        found := ?f;
      };
    };
    found;
  };

  /// Build a terminal station and resolve all its functions
  public func resolveTerminal(stationId : Text) : ?{
    station : TerminalStation;
    functions : [CallableFunction];
  } {
    let registry = buildFullRegistry();
    var stationFound : ?TerminalStation = null;
    for (s in registry.terminals.vals()) {
      if (s.id == stationId) {
        stationFound := ?s;
      };
    };
    switch (stationFound) {
      case null null;
      case (?station) {
        let funcs = Array.filter<CallableFunction>(
          registry.functions,
          func(f : CallableFunction) : Bool { f.terminalId == stationId }
        );
        ?{ station = station; functions = funcs };
      };
    };
  };

  /// Render the full Latin tablet as text
  public func renderLatinTablet() : Text {
    let registry = buildFullRegistry();
    var tablet = "═══════════════════════════════════════════════════════════\n";
    tablet #= "         TABULA LATINA — 61 CALLABLE FUNCTIONS\n";
    tablet #= "         Doctrine: " # registry.doctrine # "\n";
    tablet #= "         φ = " # Float.toText(PHI) # "\n";
    tablet #= "═══════════════════════════════════════════════════════════\n\n";

    for (f in registry.functions.vals()) {
      tablet #= Nat.toText(f.index) # ". " # f.latinName # "\n";
      tablet #= "   Function: " # f.functionName # "\n";
      tablet #= "   Motto: " # f.motto # "\n";
      tablet #= "   Trace: " # f.traceChain # "\n";
      tablet #= "   φ-Coefficient: " # Float.toText(f.phiCoefficient) # "\n\n";
    };

    tablet #= "\n═══ TERMINALIA ═══\n\n";
    for (t in registry.terminals.vals()) {
      tablet #= t.name # " [" # t.command # "]\n";
      tablet #= "  Motto: " # t.motto # "\n";
      tablet #= "  Functions: " # Nat.toText(Array.size(t.functionIds)) # "\n";
      tablet #= "  φ-Signature: " # Float.toText(t.phiSignature) # "\n\n";
    };

    tablet;
  };

  /// Get summary stats
  public func getSummary() : RegistrySummary {
    {
      totalFunctions = 61;
      totalTerminals = 10;
      categoryCounts = [
        ("MEMORIA", 10),
        ("PULSUS", 7),
        ("GUBERNATIO", 6),
        ("FORMULA", 8),
        ("INTELLIGENTIA", 6),
        ("DEFENSIO", 4),
        ("ORGANISMUS", 8),
        ("PRIMITIVA", 4),
        ("QUANTUM", 3),
        ("ANIMA", 5),
      ];
      doctrine = "Omnis functio ad φ redit. Omnis terminus ad animam ducit.";
      phiRoot = PHI;
    };
  };

  /// Get the categoria name as text
  public func categoriaName(cat : Categoria) : Text {
    switch (cat) {
      case (#Memoria) "MEMORIA";
      case (#Pulsus) "PULSUS";
      case (#Gubernatio) "GUBERNATIO";
      case (#Formula) "FORMULA";
      case (#Intelligentia) "INTELLIGENTIA";
      case (#Defensio) "DEFENSIO";
      case (#Organismus) "ORGANISMUS";
      case (#Primitiva) "PRIMITIVA";
      case (#Quantum) "QUANTUM";
      case (#Anima) "ANIMA";
    };
  };
};
