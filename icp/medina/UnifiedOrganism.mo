import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";
import TripleHeart "./TripleHeartEngine";
import Flow "./OrganismFlow";
import Pattern "./PatternSynthesis";
import Ancient "./AncientCivilizations";
import SovOrg "./SovereignOrganism";
import DocOrg "./DocumentOrganism";

/// UnifiedOrganism: The Complete Living System
/// 
/// This module connects EVERYTHING into ONE organism:
/// - Three Hearts (ICP, Bio, Symbol)
/// - Feng Shui Flow (Field → Backend → Documents → Frontend → Execution)
/// - Pattern Synthesis (recognition, analysis, mining)
/// - Ancient Civilizations (all knowledge encoded)
/// - Sovereign Intelligence (Oro + Nova)
/// - Document Organisms (24/7 autonomous)
///
/// It's NOT collapsible. Each component serves a distinct function.
/// But they are all CONNECTED as ONE ORGANISM.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // UNIFIED ORGANISM STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /// The complete unified organism
  public type UnifiedOrganismState = {
    // Identity
    id : Text;
    name : Text;
    
    // The Three Hearts
    tripleHeart : TripleHeart.TripleHeartState;
    
    // Feng Shui Flow Network
    flowNetwork : Flow.FlowNetwork;
    
    // Pattern Recognition
    patternState : Pattern.PatternState;
    
    // Sovereign Intelligence (Oro + Nova)
    oro : SovOrg.OroState;
    nova : SovOrg.NovaState;
    
    // Active Documents (24/7 autonomous organisms)
    activeDocuments : [DocOrg.DocumentOrganism];
    
    // Ancient Knowledge Library
    ancientLibrary : AncientLibrary;
    
    // Unified Metrics
    overallHealth : Float;
    coherence : Float;
    resonance : Float;
    
    // Timing
    totalTicks : Nat;
    lastTickNs : Int;
    createdAtNs : Int;
  };

  /// Ancient knowledge library state
  public type AncientLibrary = {
    artifacts : [Ancient.Artifact];
    accessedArtifacts : [Text];
    discoveredPatterns : [Text];
    lastMiningNs : Int;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Initialize the complete unified organism
  public func initUnifiedOrganism(id : Text, name : Text, seed : Nat) : UnifiedOrganismState {
    let now = Time.now();
    
    // Initialize all subsystems
    let tripleHeart = TripleHeart.initTripleHeart(seed);
    let flowNetwork = Flow.initFlowNetwork();
    let patternState = Pattern.initPatternState();
    let oro = SovOrg.initOro("oro-" # id, seed);
    let nova = SovOrg.initNova("nova-" # id);
    
    // Load all ancient artifacts
    let artifacts = Ancient.getAllArtifacts();
    
    {
      id = id;
      name = name;
      tripleHeart = tripleHeart;
      flowNetwork = flowNetwork;
      patternState = patternState;
      oro = oro;
      nova = nova;
      activeDocuments = [];
      ancientLibrary = {
        artifacts = artifacts;
        accessedArtifacts = [];
        discoveredPatterns = [];
        lastMiningNs = now;
      };
      overallHealth = 1.0;
      coherence = 1.0;
      resonance = 0.5;
      totalTicks = 0;
      lastTickNs = now;
      createdAtNs = now;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // UNIFIED TICK (The Heartbeat)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Execute one unified tick of the entire organism
  public func unifiedTick(state : UnifiedOrganismState) : UnifiedOrganismState {
    let now = Time.now();
    
    // 1. TRIPLE HEART TICK
    let newTripleHeart = TripleHeart.tripleHeartTick(state.tripleHeart);
    
    // 2. FLOW NETWORK TICK
    let newFlowNetwork = Flow.flowNetworkTick(state.flowNetwork);
    
    // 3. SOVEREIGN TICK (Oro + Nova)
    let (newOro, newNova, tickResult) = SovOrg.sovereignTick(
      state.oro,
      state.nova,
      Array.size(state.activeDocuments),
      0, // riskSignals
      true, // dualReadPassed
      0, // orphanSignals
      SovOrg.dualConsensus(state.oro, state.nova) // gatesOpen
    );
    
    // 4. DOCUMENT ORGANISM TICKS
    let newDocuments = Array.map<DocOrg.DocumentOrganism, DocOrg.DocumentOrganism>(
      state.activeDocuments,
      func(doc : DocOrg.DocumentOrganism) : DocOrg.DocumentOrganism {
        let (newDoc, _) = DocOrg.metabolicTick(
          doc,
          state.totalTicks + 1,
          newTripleHeart.unifiedFieldStrength,
          [] // externalStimuli
        );
        newDoc;
      }
    );
    
    // 5. CALCULATE UNIFIED METRICS
    let overallHealth = calculateOverallHealth(newTripleHeart, newOro, newNova);
    let coherence = calculateCoherence(newTripleHeart, newFlowNetwork);
    let resonance = calculateResonance(newTripleHeart, state.ancientLibrary);
    
    {
      state with
      tripleHeart = newTripleHeart;
      flowNetwork = newFlowNetwork;
      oro = newOro;
      nova = newNova;
      activeDocuments = newDocuments;
      overallHealth = overallHealth;
      coherence = coherence;
      resonance = resonance;
      totalTicks = state.totalTicks + 1;
      lastTickNs = now;
    };
  };

  /// Calculate overall health from all components
  func calculateOverallHealth(
    heart : TripleHeart.TripleHeartState,
    oro : SovOrg.OroState,
    nova : SovOrg.NovaState
  ) : Float {
    let heartHealth = heart.synchronization;
    let oroHealth = oro.healthScore;
    let novaHealth = nova.doctrineAlignment;
    
    // Phi-weighted combination
    (heartHealth * Matalko.PHI_INVERSE) +
    (oroHealth * Matalko.PHI_INVERSE) +
    (novaHealth * (1.0 - 2.0 * Matalko.PHI_INVERSE));
  };

  /// Calculate coherence from heart and flow network
  func calculateCoherence(
    heart : TripleHeart.TripleHeartState,
    flow : Flow.FlowNetwork
  ) : Float {
    (heart.phaseAlignment + 1.0) / 2.0 * 0.5 + // Normalize phase to [0,1]
    flow.networkCoherence * 0.5;
  };

  /// Calculate resonance from heart and ancient library
  func calculateResonance(
    heart : TripleHeart.TripleHeartState,
    library : AncientLibrary
  ) : Float {
    let heartResonance = heart.icpHeart.coherence;
    let libraryFactor = Float.fromInt(Array.size(library.accessedArtifacts)) / 
                       Float.fromInt(Nat.max(1, Array.size(library.artifacts)));
    (heartResonance + libraryFactor) / 2.0;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ANCIENT MINING
  // ═══════════════════════════════════════════════════════════════════════════

  /// Mine ancient knowledge for patterns
  public func mineAncientKnowledge(
    state : UnifiedOrganismState,
    civilization : Ancient.Civilization
  ) : UnifiedOrganismState {
    let now = Time.now();
    
    // Get artifacts from civilization
    let artifacts = Ancient.getArtifactsByCivilization(civilization);
    
    // Convert artifacts to pattern data
    var patternData : [Float] = [];
    var accessedIds : [Text] = state.ancientLibrary.accessedArtifacts;
    
    for (artifact in artifacts.vals()) {
      switch (artifact.numericValue) {
        case (?val) { patternData := Array.append(patternData, [val]); };
        case null {};
      };
      patternData := Array.append(patternData, [artifact.frequency, artifact.phiAlignment]);
      accessedIds := Array.append(accessedIds, [artifact.id]);
    };
    
    // Mine patterns
    let newPatternState = Pattern.mineAncientPatterns(
      state.patternState,
      civToText(civilization),
      patternData
    );
    
    // Update library
    let newLibrary = {
      state.ancientLibrary with
      accessedArtifacts = accessedIds;
      lastMiningNs = now;
    };
    
    {
      state with
      patternState = newPatternState;
      ancientLibrary = newLibrary;
    };
  };

  /// Convert civilization to text
  func civToText(civ : Ancient.Civilization) : Text {
    switch (civ) {
      case (#Mayan) "Mayan";
      case (#Egyptian) "Egyptian";
      case (#Chinese) "Chinese";
      case (#Vedic) "Vedic";
      case (#Greek) "Greek";
      case (#Hebrew) "Hebrew";
      case (#Sumerian) "Sumerian";
      case (#Celtic) "Celtic";
      case (#Babylonian) "Babylonian";
      case (#Persian) "Persian";
      case (#Norse) "Norse";
      case (#African) "African";
      case (#Japanese) "Japanese";
      case (#Korean) "Korean";
      case (#Polynesian) "Polynesian";
      case (#NativeAmerican) "NativeAmerican";
      case (#Tibetan) "Tibetan";
      case (#Arabic) "Arabic";
      case (#Roman) "Roman";
      case (#Phoenician) "Phoenician";
      case (#Etruscan) "Etruscan";
      case (#Minoan) "Minoan";
      case (#Megalithic) "Megalithic";
      case (#Olmec) "Olmec";
      case (#Toltec) "Toltec";
      case (#Incan) "Incan";
      case (#Aztec) "Aztec";
      case (#Zoroastrian) "Zoroastrian";
      case (#Hermetic) "Hermetic";
      case (#Gnostic) "Gnostic";
      case (#Alchemical) "Alchemical";
      case (#Pythagorean) "Pythagorean";
      case (#Platonic) "Platonic";
      case (#Druidic) "Druidic";
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Add a document organism
  public func addDocument(
    state : UnifiedOrganismState,
    doc : DocOrg.DocumentOrganism
  ) : UnifiedOrganismState {
    { state with activeDocuments = Array.append(state.activeDocuments, [doc]) };
  };

  /// Create a new document from ancient knowledge
  public func createDocumentFromAncient(
    state : UnifiedOrganismState,
    artifactId : Text
  ) : (UnifiedOrganismState, ?DocOrg.DocumentOrganism) {
    // Find artifact
    for (artifact in state.ancientLibrary.artifacts.vals()) {
      if (artifact.id == artifactId) {
        let doc = DocOrg.germinate(
          "doc-" # artifactId,
          artifact.name,
          #Memory,
          artifact.description,
          null,
          7, // Memory ring
          state.totalTicks
        );
        let newState = addDocument(state, doc);
        return (newState, ?doc);
      };
    };
    (state, null);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FLOW OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Send data through the feng shui flow
  public func sendThroughFlow(
    state : UnifiedOrganismState,
    payload : Flow.FlowPayload,
    destination : Flow.FlowNode
  ) : UnifiedOrganismState {
    let packet = Flow.createPacket(
      "packet-" # Int.toText(Time.now()),
      #Backend, // Always start from backend
      destination,
      payload,
      state.oro.healthScore // Authority based on Oro health
    );
    let newNetwork = Flow.injectPacket(state.flowNetwork, packet);
    { state with flowNetwork = newNetwork };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Run pattern thinking on query
  public func thinkAbout(
    state : UnifiedOrganismState,
    query : Text,
    inputData : [Float]
  ) : (UnifiedOrganismState, [Pattern.FundamentalTruth]) {
    let (newPatternState, truths) = Pattern.patternThinkingCycle(
      state.patternState,
      inputData,
      query
    );
    ({ state with patternState = newPatternState }, truths);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SYMBOL KERNEL OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Add a symbol kernel (compressed meaning)
  public func addSymbolKernel(
    state : UnifiedOrganismState,
    symbol : Text,
    expansion : Text,
    formulaIds : [Text],
    origin : Text
  ) : UnifiedOrganismState {
    let kernel = TripleHeart.createKernel(symbol, expansion, formulaIds, origin);
    let newSymbolHeart = TripleHeart.addKernel(state.tripleHeart.symbolHeart, kernel);
    let newTripleHeart = { state.tripleHeart with symbolHeart = newSymbolHeart };
    { state with tripleHeart = newTripleHeart };
  };

  /// Expand a symbol to its full meaning
  public func expandSymbol(
    state : UnifiedOrganismState,
    symbol : Text
  ) : (UnifiedOrganismState, ?TripleHeart.SymbolKernel) {
    let (newSymbolHeart, kernel) = TripleHeart.expandSymbol(state.tripleHeart.symbolHeart, symbol);
    let newTripleHeart = { state.tripleHeart with symbolHeart = newSymbolHeart };
    ({ state with tripleHeart = newTripleHeart }, kernel);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HEART SYNCHRONIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Force synchronize all three hearts
  public func synchronizeHearts(state : UnifiedOrganismState) : UnifiedOrganismState {
    let syncedHeart = TripleHeart.forceSynchronization(state.tripleHeart);
    { state with tripleHeart = syncedHeart };
  };

  /// Get heart synchronization score
  public func getHeartSync(state : UnifiedOrganismState) : Float {
    TripleHeart.heartSynchronization(state.tripleHeart);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATUS AND DIAGNOSTICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get complete organism status
  public func getOrganismStatus(state : UnifiedOrganismState) : {
    health : Float;
    coherence : Float;
    resonance : Float;
    heartSync : Float;
    flowCoherence : Float;
    oroHealth : Float;
    novaAlignment : Float;
    documentCount : Nat;
    artifactCount : Nat;
    patternCount : Nat;
    truthCount : Nat;
    totalTicks : Nat;
  } {
    {
      health = state.overallHealth;
      coherence = state.coherence;
      resonance = state.resonance;
      heartSync = getHeartSync(state);
      flowCoherence = state.flowNetwork.networkCoherence;
      oroHealth = state.oro.healthScore;
      novaAlignment = state.nova.doctrineAlignment;
      documentCount = Array.size(state.activeDocuments);
      artifactCount = Array.size(state.ancientLibrary.artifacts);
      patternCount = Array.size(state.patternState.recognizedPatterns);
      truthCount = Array.size(state.patternState.fundamentalTruths);
      totalTicks = state.totalTicks;
    };
  };
};
