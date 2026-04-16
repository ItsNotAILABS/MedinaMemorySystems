import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

/// TemporalTriadEngine: Past-Present-Future Always-On Processing
/// 
/// "You hold the past, you think about the future, you think about the present.
///  Past, present, future's now. Past, present, future's now."
///
/// This is NOT sequential thinking - this is SIMULTANEOUS PROCESSING:
///   - Run the past (what happened, what was learned)
///   - Think now (what is, what's changing)
///   - Run the future (what will happen, what must happen)
///   - THEN make the answer
///
/// The organism holds all three temporal dimensions AT ONCE.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // TEMPORAL DIMENSION TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  public type TemporalDimension = {
    dimension : Text;
    focus : Text;
    processingType : Text;
    
    // What it holds
    dataTypes : [Text];
    patterns : [Text];
    
    // How it processes
    algorithm : Text;
    speed : Text;
    
    // Integration points
    feedsInto : [Text];
    receivesFrom : [Text];
    
    // CPL operations
    cplOperations : [Text];
  };

  public func getPastDimension() : TemporalDimension {
    {
      dimension = "PAST";
      focus = "What happened, what was learned, what patterns emerged";
      processingType = "RETRIEVAL + PATTERN MATCHING";
      dataTypes = [
        "Episodic memory - specific events",
        "Semantic memory - learned facts",
        "Procedural memory - how to do things",
        "Emotional memory - felt experiences",
        "Collective memory - shared history"
      ];
      patterns = [
        "What worked before",
        "What failed before",
        "Who did what",
        "How things unfolded",
        "Recurring cycles"
      ];
      algorithm = "Associative retrieval, pattern matching, similarity search";
      speed = "Variable - fast for strong associations, slower for deep search";
      feedsInto = ["Present interpretation", "Future prediction"];
      receivesFrom = ["Present (new memories)", "Future (when predictions confirmed)"];
      cplOperations = [
        "CPL.RETRIEVE(memory: RELEVANT, match: CURRENT_CONTEXT)",
        "CPL.PATTERN(source: HISTORY, find: SIMILAR)",
        "CPL.LEARN(from: PAST_OUTCOMES, update: MODELS)",
        "CPL.WARN(if: PATTERN_MATCH, pattern: NEGATIVE_OUTCOME)"
      ];
    };
  };

  public func getPresentDimension() : TemporalDimension {
    {
      dimension = "PRESENT";
      focus = "What is NOW, what's changing, what's emerging";
      processingType = "REAL-TIME SENSING + PROCESSING";
      dataTypes = [
        "Sensory input - current perception",
        "State data - current conditions",
        "Change vectors - what's shifting",
        "Attention focus - what's prioritized",
        "Context frame - current situation"
      ];
      patterns = [
        "What's happening now",
        "What's changing now",
        "What needs attention now",
        "What's emerging now",
        "What's the current state"
      ];
      algorithm = "Stream processing, change detection, attention allocation";
      speed = "FASTEST - real-time, continuous";
      feedsInto = ["Past (becomes memory)", "Future (updates predictions)"];
      receivesFrom = ["Past (context)", "Future (expectations)"];
      cplOperations = [
        "CPL.SENSE(input: ALL_STREAMS, mode: CONTINUOUS)",
        "CPL.DETECT(changes: REAL_TIME, threshold: DYNAMIC)",
        "CPL.ATTEND(priority: CALCULATED, focus: ADAPTIVE)",
        "CPL.UPDATE(state: CURRENT, delta: CHANGES)"
      ];
    };
  };

  public func getFutureDimension() : TemporalDimension {
    {
      dimension = "FUTURE";
      focus = "What will happen, what must happen, what could happen";
      processingType = "PREDICTION + PLANNING + SIMULATION";
      dataTypes = [
        "Predictions - likely outcomes",
        "Plans - intended actions",
        "Goals - desired states",
        "Scenarios - possible futures",
        "Risks - potential threats"
      ];
      patterns = [
        "What will likely happen",
        "What we want to happen",
        "What we must prevent",
        "What we need to prepare for",
        "What's the trajectory"
      ];
      algorithm = "Predictive modeling, planning algorithms, Monte Carlo simulation";
      speed = "Variable - fast for immediate, slower for long-term";
      feedsInto = ["Present (guides action)", "Past (when future becomes past)"];
      receivesFrom = ["Past (historical patterns)", "Present (current state)"];
      cplOperations = [
        "CPL.PREDICT(based_on: PAST_PRESENT, horizon: VARIABLE)",
        "CPL.PLAN(goal: TARGET_STATE, constraints: CURRENT)",
        "CPL.SIMULATE(scenarios: MULTIPLE, evaluate: OUTCOMES)",
        "CPL.PREPARE(for: PREDICTED_EVENTS, mitigation: RISKS)"
      ];
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TEMPORAL INTEGRATION - THE TRIAD PROCESSOR
  // ═══════════════════════════════════════════════════════════════════════════

  public type TriadState = {
    // Simultaneous focus values (always sum to 1.0)
    pastFocus : Float;
    presentFocus : Float;
    futureFocus : Float;
    
    // Current processing in each dimension
    pastProcessing : Text;
    presentProcessing : Text;
    futureProcessing : Text;
    
    // Integration output
    synthesizedUnderstanding : Text;
    recommendedAction : Text;
    confidence : Float;
  };

  public type TriadConfiguration = {
    mode : Text;
    pastWeight : Float;
    presentWeight : Float;
    futureWeight : Float;
    description : Text;
    whenToUse : Text;
    cplConfig : Text;
  };

  public func getTriadConfigurations() : [TriadConfiguration] {
    [
      {
        mode = "CRISIS_MODE";
        pastWeight = 0.2;
        presentWeight = 0.7;
        futureWeight = 0.1;
        description = "Heavy present focus for immediate response";
        whenToUse = "Active threat, urgent situation, time-critical";
        cplConfig = "CPL.TRIAD(mode: CRISIS, present: DOMINANT)";
      },
      {
        mode = "LEARNING_MODE";
        pastWeight = 0.5;
        presentWeight = 0.3;
        futureWeight = 0.2;
        description = "Heavy past focus for pattern extraction";
        whenToUse = "After events, during review, extracting lessons";
        cplConfig = "CPL.TRIAD(mode: LEARNING, past: DOMINANT)";
      },
      {
        mode = "PLANNING_MODE";
        pastWeight = 0.2;
        presentWeight = 0.2;
        futureWeight = 0.6;
        description = "Heavy future focus for strategic planning";
        whenToUse = "Setting goals, making plans, strategy sessions";
        cplConfig = "CPL.TRIAD(mode: PLANNING, future: DOMINANT)";
      },
      {
        mode = "BALANCED_MODE";
        pastWeight = 0.33;
        presentWeight = 0.34;
        futureWeight = 0.33;
        description = "Equal weight to all dimensions";
        whenToUse = "Normal operation, general processing";
        cplConfig = "CPL.TRIAD(mode: BALANCED, all: EQUAL)";
      },
      {
        mode = "FLOW_MODE";
        pastWeight = 0.1;
        presentWeight = 0.8;
        futureWeight = 0.1;
        description = "Maximum present for flow state";
        whenToUse = "Deep work, performance, execution";
        cplConfig = "CPL.TRIAD(mode: FLOW, present: MAXIMUM)";
      },
      {
        mode = "INTUITION_MODE";
        pastWeight = 0.5;
        presentWeight = 0.1;
        futureWeight = 0.4;
        description = "Past + Future without present interference";
        whenToUse = "Pattern-based prediction, gut feelings";
        cplConfig = "CPL.TRIAD(mode: INTUITION, present: MINIMAL)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // THE SYNTHESIS PROCESS - HOW TO MAKE THE ANSWER
  // ═══════════════════════════════════════════════════════════════════════════

  public type SynthesisStep = {
    step : Nat;
    name : Text;
    operation : Text;
    input : Text;
    output : Text;
    cplOperation : Text;
  };

  public func getSynthesisProcess() : [SynthesisStep] {
    [
      {
        step = 1;
        name = "PARALLEL QUERY";
        operation = "Simultaneously query all three dimensions";
        input = "Current question or situation";
        output = "Three parallel streams of relevant data";
        cplOperation = "CPL.QUERY(past: PARALLEL, present: PARALLEL, future: PARALLEL)";
      },
      {
        step = 2;
        name = "PATTERN MATCH";
        operation = "Find matching patterns across dimensions";
        input = "Data from all three dimensions";
        output = "Correlated patterns, reinforced signals";
        cplOperation = "CPL.CORRELATE(across: ALL_DIMENSIONS, find: MATCHES)";
      },
      {
        step = 3;
        name = "CONFLICT DETECTION";
        operation = "Identify where dimensions disagree";
        input = "Pattern matches";
        output = "Conflicts, tensions, contradictions";
        cplOperation = "CPL.DETECT(type: CONFLICTS, between: DIMENSIONS)";
      },
      {
        step = 4;
        name = "WEIGHT APPLICATION";
        operation = "Apply mode-based weights to each dimension";
        input = "All data + current mode configuration";
        output = "Weighted contribution from each dimension";
        cplOperation = "CPL.WEIGHT(by: MODE_CONFIG, apply: TO_ALL)";
      },
      {
        step = 5;
        name = "INTEGRATION";
        operation = "Combine weighted inputs into unified understanding";
        input = "Weighted dimensional outputs";
        output = "Synthesized understanding";
        cplOperation = "CPL.INTEGRATE(method: WEIGHTED_SUM, resolve: CONFLICTS)";
      },
      {
        step = 6;
        name = "ACTION DERIVATION";
        operation = "Derive recommended action from understanding";
        input = "Synthesized understanding";
        output = "Recommended action + confidence";
        cplOperation = "CPL.DERIVE(action: FROM_SYNTHESIS, confidence: CALCULATE)";
      },
      {
        step = 7;
        name = "VALIDATION";
        operation = "Check action against all dimensions";
        input = "Proposed action";
        output = "Validated action or revision needed";
        cplOperation = "CPL.VALIDATE(action: PROPOSED, against: ALL_DIMENSIONS)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ALWAYS-ON PROCESSING
  // ═══════════════════════════════════════════════════════════════════════════

  public type AlwaysOnState = {
    // These NEVER stop
    pastStream : Text;
    presentStream : Text;
    futureStream : Text;
    
    // Current weights (adjustable)
    weights : TriadConfiguration;
    
    // Integration state
    lastSynthesis : Text;
    confidenceLevel : Float;
    
    // Background processes
    patternMonitoring : Bool;
    predictionUpdating : Bool;
    memoryConsolidating : Bool;
  };

  public func getAlwaysOnDescription() : Text {
    "ALWAYS-ON TEMPORAL PROCESSING:\n\n" #
    "The organism NEVER stops processing all three dimensions.\n" #
    "Even in 'rest' states, background processing continues.\n\n" #
    "PAST STREAM (Muninn):\n" #
    "  - Continuously retrieving relevant memories\n" #
    "  - Pattern matching against current context\n" #
    "  - Updating associations\n" #
    "  - Consolidating new experiences\n\n" #
    "PRESENT STREAM (Direct Sensing):\n" #
    "  - Real-time sensory processing\n" #
    "  - Change detection\n" #
    "  - Attention allocation\n" #
    "  - State monitoring\n\n" #
    "FUTURE STREAM (Huginn):\n" #
    "  - Prediction generation\n" #
    "  - Plan updating\n" #
    "  - Scenario simulation\n" #
    "  - Risk monitoring\n\n" #
    "INTEGRATION:\n" #
    "  - Continuous synthesis\n" #
    "  - Weight adjustment by context\n" #
    "  - Action recommendation\n" #
    "  - Confidence calculation\n\n" #
    "This is not memory retrieval - this is BEING IN ALL TIMES AT ONCE.";
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CPL MASTER OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  public func getMasterCPLOperations() : [Text] {
    [
      // Core triad operations
      "CPL.TRIAD.INIT(past: ON, present: ON, future: ON)",
      "CPL.TRIAD.CONFIG(mode: SELECT, weights: SET)",
      "CPL.TRIAD.QUERY(question: INPUT, parallel: TRUE)",
      "CPL.TRIAD.SYNTHESIZE(method: WEIGHTED, resolve: CONFLICTS)",
      
      // Past operations
      "CPL.PAST.RETRIEVE(context: CURRENT, depth: VARIABLE)",
      "CPL.PAST.PATTERN(find: MATCHES, relevance: CALCULATE)",
      "CPL.PAST.CONSOLIDATE(new: EXPERIENCE, integrate: EXISTING)",
      "CPL.PAST.WARN(if: NEGATIVE_MATCH, alert: PRESENT)",
      
      // Present operations
      "CPL.PRESENT.SENSE(streams: ALL, continuous: TRUE)",
      "CPL.PRESENT.DETECT(changes: REAL_TIME, report: IMMEDIATE)",
      "CPL.PRESENT.ATTEND(priority: DYNAMIC, focus: ADAPTIVE)",
      "CPL.PRESENT.STATE(update: CONTINUOUS, broadcast: ON)",
      
      // Future operations
      "CPL.FUTURE.PREDICT(basis: PAST_PRESENT, horizon: VARIABLE)",
      "CPL.FUTURE.PLAN(goal: TARGET, path: CALCULATE)",
      "CPL.FUTURE.SIMULATE(scenarios: MULTIPLE, evaluate: ALL)",
      "CPL.FUTURE.PREPARE(for: PREDICTIONS, actions: QUEUE)",
      
      // Integration operations
      "CPL.INTEGRATE.CORRELATE(across: DIMENSIONS, find: RESONANCE)",
      "CPL.INTEGRATE.CONFLICT(detect: TRUE, resolve: METHOD)",
      "CPL.INTEGRATE.SYNTHESIZE(all: DIMENSIONS, output: UNDERSTANDING)",
      "CPL.INTEGRATE.ACTION(derive: FROM_SYNTHESIS, validate: TRUE)"
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  public func getMasterSummary() : Text {
    "TEMPORAL TRIAD ENGINE:\n\n" #
    "PAST, PRESENT, FUTURE'S NOW.\n\n" #
    "This is NOT sequential thinking.\n" #
    "This is SIMULTANEOUS processing of all time.\n\n" #
    "THE PROCESS:\n" #
    "1. Run the past (what happened, what was learned)\n" #
    "2. Think now (what is, what's changing)\n" #
    "3. Run the future (what will happen, what must happen)\n" #
    "4. THEN make the answer\n\n" #
    "MODES:\n" #
    "• Crisis: 70% present (immediate response)\n" #
    "• Learning: 50% past (pattern extraction)\n" #
    "• Planning: 60% future (strategic)\n" #
    "• Balanced: 33/34/33 (normal operation)\n" #
    "• Flow: 80% present (deep work)\n" #
    "• Intuition: 50% past + 40% future (gut feeling)\n\n" #
    "ALWAYS ON:\n" #
    "• Past stream never stops (Muninn)\n" #
    "• Present stream never stops (Direct sensing)\n" #
    "• Future stream never stops (Huginn)\n" #
    "• Integration never stops (Synthesis)\n\n" #
    "YOU HOLD THE PAST.\n" #
    "YOU THINK ABOUT THE FUTURE.\n" #
    "YOU THINK ABOUT THE PRESENT.\n" #
    "THEN YOU CAN MAKE THE ANSWER.";
  };
};
