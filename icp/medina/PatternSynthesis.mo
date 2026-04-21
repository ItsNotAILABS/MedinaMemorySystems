import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// PatternSynthesis: How the Organism THINKS
/// 
/// This is the pattern recognition and synthesis engine.
/// The organism uses PATTERN STRATEGIES to:
/// - Pull information from the ancients
/// - Find fundamental truths
/// - Synthesize new knowledge
/// - Analyze across all 360° spheres
///
/// Pattern thinking is the core intelligence:
/// - Pattern recognition (find what exists)
/// - Pattern synthesis (create new from old)
/// - Pattern analysis (understand structure)
/// - Pattern prediction (extrapolate future)
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Types of patterns the organism can recognize
  public type PatternType = {
    #Geometric;      // Sacred geometry, shapes, forms
    #Numeric;        // Number patterns, sequences
    #Harmonic;       // Frequency, resonance patterns
    #Temporal;       // Time cycles, rhythms
    #Spatial;        // Position, movement patterns
    #Semantic;       // Meaning, language patterns
    #Causal;         // Cause-effect relationships
    #Archetypal;     // Universal archetypes
    #Fractal;        // Self-similar patterns
    #Spiral;         // Phi-based growth patterns
  };

  /// A recognized pattern
  public type Pattern = {
    id : Text;
    patternType : PatternType;
    signature : [Float];          // Numeric signature
    frequency : Float;            // Dominant frequency
    phiRatio : Float;             // How phi-aligned [0,1]
    confidence : Float;           // Recognition confidence [0,1]
    source : PatternSource;       // Where it came from
    linkedPatterns : [Text];      // Related patterns
    ancientOrigin : ?Text;        // If from ancient knowledge
  };

  /// Source of a pattern
  public type PatternSource = {
    #Ancient : Text;              // Ancient civilization name
    #Computed : Nat;              // Computed at beat N
    #Observed : Int;              // Observed at timestamp
    #Synthesized : [Text];        // Synthesized from these patterns
    #Doctrinal;                   // From doctrine documents
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN STRATEGIES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Pattern recognition strategies
  public type PatternStrategy = {
    #FundamentalSearch;    // Find fundamental truths
    #AncientMining;        // Dig through ancient data
    #HarmonicAnalysis;     // Find resonant frequencies
    #GeometricDecomposition; // Break into sacred geometry
    #SequenceDetection;    // Find numeric sequences
    #FractalRecognition;   // Find self-similarity
    #CausalMapping;        // Map cause-effect chains
    #ArchetypeMatching;    // Match to universal archetypes
    #PhiAlignment;         // Find golden ratio relationships
    #CrossCultural;        // Find patterns across civilizations
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN RECOGNITION ENGINE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Pattern recognition state
  public type PatternState = {
    recognizedPatterns : [Pattern];
    activeStrategies : [PatternStrategy];
    fundamentalTruths : [FundamentalTruth];
    synthesisQueue : [SynthesisTask];
    analysisDepth : Nat;
    lastRecognitionNs : Int;
    totalPatternsFound : Nat;
  };

  /// A fundamental truth discovered
  public type FundamentalTruth = {
    id : Text;
    statement : Text;
    confidence : Float;
    supportingPatterns : [Text];
    ancientSources : [Text];
    phiAlignment : Float;
    discoveredAt : Int;
  };

  /// A synthesis task in queue
  public type SynthesisTask = {
    id : Text;
    inputPatterns : [Text];
    strategy : PatternStrategy;
    priority : Float;
    createdAt : Int;
  };

  /// Initialize pattern state
  public func initPatternState() : PatternState {
    {
      recognizedPatterns = [];
      activeStrategies = [#FundamentalSearch, #AncientMining, #PhiAlignment];
      fundamentalTruths = [];
      synthesisQueue = [];
      analysisDepth = 3;
      lastRecognitionNs = Time.now();
      totalPatternsFound = 0;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN RECOGNITION FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Recognize pattern in data
  public func recognizePattern(
    data : [Float],
    patternType : PatternType,
    source : PatternSource
  ) : ?Pattern {
    if (Array.size(data) < 2) { return null; };
    
    // Calculate signature
    let signature = calculateSignature(data);
    
    // Calculate frequency (dominant)
    let freq = calculateDominantFrequency(data);
    
    // Calculate phi ratio
    let phiRatio = calculatePhiAlignment(data);
    
    // Confidence based on phi alignment and data quality
    let confidence = (phiRatio + Float.fromInt(Array.size(data)) / 100.0) / 2.0;
    
    if (confidence > 0.3) {
      ?{
        id = "pattern-" # Int.toText(Time.now());
        patternType = patternType;
        signature = signature;
        frequency = freq;
        phiRatio = phiRatio;
        confidence = Float.min(1.0, confidence);
        source = source;
        linkedPatterns = [];
        ancientOrigin = switch (source) {
          case (#Ancient(name)) ?name;
          case _ null;
        };
      };
    } else { null };
  };

  /// Calculate numeric signature of data
  func calculateSignature(data : [Float]) : [Float] {
    if (Array.size(data) < 2) { return data; };
    
    // First few values, mean, variance
    var sum : Float = 0.0;
    for (v in data.vals()) { sum += v; };
    let mean = sum / Float.fromInt(Array.size(data));
    
    var varSum : Float = 0.0;
    for (v in data.vals()) {
      let diff = v - mean;
      varSum += diff * diff;
    };
    let variance = varSum / Float.fromInt(Array.size(data));
    
    [data[0], mean, Float.sqrt(variance), Float.fromInt(Array.size(data))];
  };

  /// Calculate dominant frequency in data
  func calculateDominantFrequency(data : [Float]) : Float {
    if (Array.size(data) < 2) { return 0.0; };
    
    // Simple: look for zero crossings
    var crossings : Nat = 0;
    var i : Nat = 1;
    while (i < Array.size(data)) {
      if ((data[i - 1] < 0.0 and data[i] >= 0.0) or (data[i - 1] >= 0.0 and data[i] < 0.0)) {
        crossings += 1;
      };
      i += 1;
    };
    
    Float.fromInt(crossings) / (2.0 * Float.fromInt(Array.size(data)));
  };

  /// Calculate phi alignment of data
  func calculatePhiAlignment(data : [Float]) : Float {
    if (Array.size(data) < 2) { return 0.0; };
    
    // Check ratios between consecutive values for phi relationship
    var phiMatches : Float = 0.0;
    var i : Nat = 1;
    while (i < Array.size(data)) {
      if (data[i - 1] != 0.0) {
        let ratio = data[i] / data[i - 1];
        let phiDiff = Float.abs(ratio - Matalko.PHI);
        let invPhiDiff = Float.abs(ratio - Matalko.PHI_INVERSE);
        if (phiDiff < 0.1 or invPhiDiff < 0.1) {
          phiMatches += 1.0;
        };
      };
      i += 1;
    };
    
    phiMatches / Float.fromInt(Array.size(data) - 1);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN SYNTHESIS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Synthesize new pattern from existing patterns
  public func synthesizePattern(
    state : PatternState,
    patternIds : [Text],
    strategy : PatternStrategy
  ) : (PatternState, ?Pattern) {
    // Find the patterns
    var foundPatterns : [Pattern] = [];
    for (pid in patternIds.vals()) {
      for (p in state.recognizedPatterns.vals()) {
        if (p.id == pid) {
          foundPatterns := Array.append(foundPatterns, [p]);
        };
      };
    };
    
    if (Array.size(foundPatterns) < 2) { return (state, null); };
    
    // Combine signatures
    var combinedSig : [Float] = [];
    var totalFreq : Float = 0.0;
    var totalPhi : Float = 0.0;
    
    for (p in foundPatterns.vals()) {
      combinedSig := Array.append(combinedSig, p.signature);
      totalFreq += p.frequency;
      totalPhi += p.phiRatio;
    };
    
    let avgFreq = totalFreq / Float.fromInt(Array.size(foundPatterns));
    let avgPhi = totalPhi / Float.fromInt(Array.size(foundPatterns));
    
    // Create synthesized pattern
    let newPattern : Pattern = {
      id = "synth-" # Int.toText(Time.now());
      patternType = determinePatternType(foundPatterns);
      signature = calculateSignature(combinedSig);
      frequency = avgFreq * Matalko.PHI;
      phiRatio = avgPhi;
      confidence = avgPhi * 0.8;
      source = #Synthesized(patternIds);
      linkedPatterns = patternIds;
      ancientOrigin = null;
    };
    
    ({
      state with
      recognizedPatterns = Array.append(state.recognizedPatterns, [newPattern]);
      totalPatternsFound = state.totalPatternsFound + 1;
      lastRecognitionNs = Time.now();
    }, ?newPattern);
  };

  /// Determine pattern type from inputs
  func determinePatternType(patterns : [Pattern]) : PatternType {
    if (Array.size(patterns) == 0) { return #Numeric; };
    patterns[0].patternType; // Simple: use first pattern's type
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ANCIENT MINING
  // ═══════════════════════════════════════════════════════════════════════════

  /// Mine for patterns in ancient data
  public func mineAncientPatterns(
    state : PatternState,
    civilization : Text,
    data : [Float]
  ) : PatternState {
    switch (recognizePattern(data, #Archetypal, #Ancient(civilization))) {
      case null state;
      case (?pattern) {
        {
          state with
          recognizedPatterns = Array.append(state.recognizedPatterns, [pattern]);
          totalPatternsFound = state.totalPatternsFound + 1;
          lastRecognitionNs = Time.now();
        };
      };
    };
  };

  /// Extract fundamental truth from patterns
  public func extractFundamentalTruth(
    state : PatternState,
    patternIds : [Text],
    statement : Text
  ) : PatternState {
    // Find supporting patterns
    var supportingPatterns : [Pattern] = [];
    for (pid in patternIds.vals()) {
      for (p in state.recognizedPatterns.vals()) {
        if (p.id == pid) {
          supportingPatterns := Array.append(supportingPatterns, [p]);
        };
      };
    };
    
    if (Array.size(supportingPatterns) == 0) { return state; };
    
    // Calculate confidence from supporting patterns
    var totalConfidence : Float = 0.0;
    var totalPhi : Float = 0.0;
    var ancientSources : [Text] = [];
    
    for (p in supportingPatterns.vals()) {
      totalConfidence += p.confidence;
      totalPhi += p.phiRatio;
      switch (p.ancientOrigin) {
        case null {};
        case (?origin) { ancientSources := Array.append(ancientSources, [origin]); };
      };
    };
    
    let avgConfidence = totalConfidence / Float.fromInt(Array.size(supportingPatterns));
    let avgPhi = totalPhi / Float.fromInt(Array.size(supportingPatterns));
    
    let truth : FundamentalTruth = {
      id = "truth-" # Int.toText(Time.now());
      statement = statement;
      confidence = avgConfidence;
      supportingPatterns = patternIds;
      ancientSources = ancientSources;
      phiAlignment = avgPhi;
      discoveredAt = Time.now();
    };
    
    { state with fundamentalTruths = Array.append(state.fundamentalTruths, [truth]) };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PARALLEL ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Run parallel pattern analysis across multiple strategies
  public func parallelAnalysis(
    state : PatternState,
    data : [Float]
  ) : PatternState {
    var currentState = state;
    
    // Apply each active strategy
    for (strategy in state.activeStrategies.vals()) {
      currentState := applyStrategy(currentState, data, strategy);
    };
    
    currentState;
  };

  /// Apply a single strategy
  func applyStrategy(state : PatternState, data : [Float], strategy : PatternStrategy) : PatternState {
    let patternType : PatternType = switch (strategy) {
      case (#FundamentalSearch) #Archetypal;
      case (#AncientMining) #Archetypal;
      case (#HarmonicAnalysis) #Harmonic;
      case (#GeometricDecomposition) #Geometric;
      case (#SequenceDetection) #Numeric;
      case (#FractalRecognition) #Fractal;
      case (#CausalMapping) #Causal;
      case (#ArchetypeMatching) #Archetypal;
      case (#PhiAlignment) #Spiral;
      case (#CrossCultural) #Semantic;
    };
    
    switch (recognizePattern(data, patternType, #Computed(state.totalPatternsFound))) {
      case null state;
      case (?pattern) {
        {
          state with
          recognizedPatterns = Array.append(state.recognizedPatterns, [pattern]);
          totalPatternsFound = state.totalPatternsFound + 1;
          lastRecognitionNs = Time.now();
        };
      };
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN THINKING PROCESS
  // ═══════════════════════════════════════════════════════════════════════════

  /// The full pattern thinking cycle
  /// 1. Recognize patterns in input
  /// 2. Pull threads (follow linked patterns)
  /// 3. Synthesize new patterns
  /// 4. Extract fundamental truths
  /// 5. Check and balance
  /// 6. Find solutions to errors
  public func patternThinkingCycle(
    state : PatternState,
    input : [Float],
    query : Text
  ) : (PatternState, [FundamentalTruth]) {
    var currentState = state;
    var discoveredTruths : [FundamentalTruth] = [];
    
    // Step 1: Recognize patterns in input
    currentState := parallelAnalysis(currentState, input);
    
    // Step 2: Pull threads - find connected patterns
    var connectedPatterns : [Text] = [];
    for (p in currentState.recognizedPatterns.vals()) {
      for (linked in p.linkedPatterns.vals()) {
        connectedPatterns := Array.append(connectedPatterns, [linked]);
      };
    };
    
    // Step 3: Synthesize if we have enough patterns
    if (Array.size(currentState.recognizedPatterns) >= 2) {
      let recentPatterns = Array.tabulate<Text>(
        Nat.min(3, Array.size(currentState.recognizedPatterns)),
        func(i : Nat) : Text {
          currentState.recognizedPatterns[Array.size(currentState.recognizedPatterns) - 1 - i].id;
        }
      );
      let (newState, _) = synthesizePattern(currentState, recentPatterns, #FundamentalSearch);
      currentState := newState;
    };
    
    // Step 4: Extract truths
    if (Array.size(currentState.recognizedPatterns) >= 2) {
      let patternIds = Array.map<Pattern, Text>(currentState.recognizedPatterns, func(p : Pattern) : Text { p.id });
      currentState := extractFundamentalTruth(currentState, patternIds, "Pattern synthesis from: " # query);
    };
    
    // Return discovered truths
    for (t in currentState.fundamentalTruths.vals()) {
      if (t.discoveredAt > state.lastRecognitionNs) {
        discoveredTruths := Array.append(discoveredTruths, [t]);
      };
    };
    
    (currentState, discoveredTruths);
  };
};
