import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

/// FastSlowBrainEngine: Huginn (Fast/Real-Time) + Muninn (Slow/Memory) Dual Processing
/// 
/// "Fast brain, slow brain, yep. Make that. All neural emergent scores, 
///  all models that are that, it has to have that at all times."
///
/// Odin's two ravens represent the dual processing systems:
///   HUGINN (Thought) = Fast, real-time, immediate processing
///   MUNINN (Memory) = Slow, deep, memory-integrated processing
///
/// BOTH are ALWAYS ON. Not alternating - PARALLEL.
/// The organism needs BOTH running at all times.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // BRAIN SYSTEM TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  public type BrainSystem = {
    name : Text;
    mythName : Text;
    speed : Text;
    function : Text;
    characteristics : [Text];
    processes : [Text];
    alwaysOn : Bool;
    energyCost : Text;
    cplPrefix : Text;
  };

  public func obtinere_huginn() : BrainSystem {
    {
      name = "FAST_BRAIN";
      mythName = "HUGINN (Thought)";
      speed = "Milliseconds - Real-time";
      function = "Immediate perception, quick decisions, pattern recognition";
      characteristics = [
        "Automatic, effortless",
        "Parallel processing",
        "Pattern-based",
        "Emotional/intuitive",
        "Always running",
        "First responder"
      ];
      processes = [
        "Perception processing",
        "Threat detection",
        "Familiar pattern recognition",
        "Automatic responses",
        "Intuitive judgments",
        "Emotional reactions",
        "Real-time adjustments"
      ];
      alwaysOn = true;
      energyCost = "Low per operation, high throughput";
      cplPrefix = "CPL.HUGINN";
    };
  };

  public func obtinere_muninn() : BrainSystem {
    {
      name = "SLOW_BRAIN";
      mythName = "MUNINN (Memory)";
      speed = "Seconds to minutes - Deliberate";
      function = "Deep analysis, complex reasoning, memory integration";
      characteristics = [
        "Deliberate, effortful",
        "Sequential processing",
        "Logic-based",
        "Analytical/rational",
        "Background running",
        "Deep thinker"
      ];
      processes = [
        "Complex problem solving",
        "Novel situation analysis",
        "Long-term planning",
        "Memory consolidation",
        "Learning integration",
        "Causal reasoning",
        "Strategy formation"
      ];
      alwaysOn = true;
      energyCost = "High per operation, sustained focus";
      cplPrefix = "CPL.MUNINN";
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERACTION PATTERNS
  // ═══════════════════════════════════════════════════════════════════════════

  public type InteractionPattern = {
    pattern : Text;
    description : Text;
    huginnRole : Text;
    muninnRole : Text;
    dataFlow : Text;
    example : Text;
    cplInteraction : Text;
  };

  public func obtinere_interactionpatterns() : [InteractionPattern] {
    [
      {
        pattern = "FAST_FIRST";
        description = "Huginn processes first, Muninn validates/overrides if needed";
        huginnRole = "Quick response, immediate action";
        muninnRole = "Background validation, correction if wrong";
        dataFlow = "Input → Huginn → Action + Muninn review → Possible correction";
        example = "See movement, react, then analyze if threat was real";
        cplInteraction = "CPL.HUGINN.RESPOND() → CPL.MUNINN.VALIDATE()";
      },
      {
        pattern = "SLOW_OVERRIDE";
        description = "Muninn overrides Huginn's initial reaction";
        huginnRole = "Initial impulse, default response";
        muninnRole = "Conscious override, better choice";
        dataFlow = "Input → Huginn impulse → Muninn analysis → Override";
        example = "Impulse to react angrily, but choosing measured response";
        cplInteraction = "CPL.HUGINN.IMPULSE() → CPL.MUNINN.OVERRIDE()";
      },
      {
        pattern = "PARALLEL_PROCESSING";
        description = "Both process simultaneously, compare results";
        huginnRole = "Quick assessment, intuitive answer";
        muninnRole = "Deep analysis, reasoned answer";
        dataFlow = "Input → Both → Compare → Synthesize";
        example = "Quick gut feeling AND careful analysis of same situation";
        cplInteraction = "CPL.DUAL(huginn: PARALLEL, muninn: PARALLEL) → SYNTHESIZE";
      },
      {
        pattern = "HANDOFF";
        description = "Huginn handles initially, hands to Muninn for complexity";
        huginnRole = "Initial processing, complexity detection";
        muninnRole = "Takes over for complex processing";
        dataFlow = "Input → Huginn → 'Too complex' → Muninn takeover";
        example = "Quick math vs. complex calculation";
        cplInteraction = "CPL.HUGINN.DETECT(complexity: HIGH) → CPL.MUNINN.ENGAGE()";
      },
      {
        pattern = "LEARNING_TRANSFER";
        description = "Muninn learns, then teaches Huginn for automation";
        huginnRole = "Eventually automates learned behavior";
        muninnRole = "Initial learning, pattern extraction";
        dataFlow = "Novel → Muninn learns → Consolidate → Huginn automates";
        example = "Learning to drive (conscious) → automatic driving";
        cplInteraction = "CPL.MUNINN.LEARN() → CPL.TRANSFER() → CPL.HUGINN.AUTOMATE()";
      },
      {
        pattern = "ERROR_SIGNAL";
        description = "Muninn detects Huginn errors, flags for correction";
        huginnRole = "Makes quick (sometimes wrong) assumptions";
        muninnRole = "Detects errors, signals for update";
        dataFlow = "Huginn acts → Muninn monitors → Error detected → Update Huginn";
        example = "Quick categorization wrong, slow system corrects model";
        cplInteraction = "CPL.MUNINN.MONITOR() → CPL.ERROR(to: HUGINN) → UPDATE";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MODELS THAT DO THIS (Named Models)
  // ═══════════════════════════════════════════════════════════════════════════

  public type DualProcessModel = {
    name : Text;
    author : Text;
    fastName : Text;
    slowName : Text;
    domain : Text;
    keyInsight : Text;
    organismApplication : Text;
  };

  public func obtinere_dualprocessmodels() : [DualProcessModel] {
    [
      {
        name = "SYSTEM 1 / SYSTEM 2";
        author = "Daniel Kahneman";
        fastName = "System 1 - Fast, automatic, emotional";
        slowName = "System 2 - Slow, deliberate, logical";
        domain = "General cognition, decision making";
        keyInsight = "Most decisions are System 1; System 2 is lazy";
        organismApplication = "Default to fast processing, engage slow only when needed";
      },
      {
        name = "DUAL-PROCESS THEORY OF REASONING";
        author = "Jonathan Evans, Keith Stanovich";
        fastName = "Type 1 - Intuitive, heuristic-based";
        slowName = "Type 2 - Analytic, rule-based";
        domain = "Reasoning, logic, judgment";
        keyInsight = "Type 1 can lead to biases; Type 2 can correct";
        organismApplication = "Use Type 1 for speed, Type 2 for accuracy";
      },
      {
        name = "REFLEXIVE / REFLECTIVE";
        author = "Matthew Lieberman";
        fastName = "X-system (reflexive, automatic)";
        slowName = "C-system (reflective, controlled)";
        domain = "Social cognition";
        keyInsight = "Social judgments often reflexive, need conscious override";
        organismApplication = "Quick social reads + deliberate relationship building";
      },
      {
        name = "HOT / COOL SYSTEMS";
        author = "Janet Metcalfe, Walter Mischel";
        fastName = "Hot system - Emotional, reactive";
        slowName = "Cool system - Cognitive, strategic";
        domain = "Self-control, delay of gratification";
        keyInsight = "Hot system wants now; cool system can wait for better";
        organismApplication = "Manage hot impulses with cool strategies";
      },
      {
        name = "IMPLICIT / EXPLICIT";
        author = "Various (memory research)";
        fastName = "Implicit - Unconscious, automatic memory";
        slowName = "Explicit - Conscious, deliberate recall";
        domain = "Memory systems";
        keyInsight = "Much knowledge is implicit, shapes behavior unconsciously";
        organismApplication = "Leverage implicit learning, access explicit when needed";
      },
      {
        name = "ASSOCIATIVE / RULE-BASED";
        author = "Sloman, Smith & DeCoster";
        fastName = "Associative - Pattern completion";
        slowName = "Rule-based - Symbolic reasoning";
        domain = "Categorization, reasoning";
        keyInsight = "Associations are fast but inflexible; rules are slow but precise";
        organismApplication = "Use associations for familiar, rules for novel";
      },
      {
        name = "DEFAULT MODE / TASK-POSITIVE";
        author = "Neuroscience research";
        fastName = "Default Mode Network - Mind wandering, self-reference";
        slowName = "Task-Positive Network - Focused attention";
        domain = "Attention, brain networks";
        keyInsight = "Networks are anti-correlated; one up, other down";
        organismApplication = "Toggle between networks based on task demands";
      },
      {
        name = "PREDICTIVE PROCESSING";
        author = "Karl Friston, Andy Clark";
        fastName = "Predictions (fast, generative)";
        slowName = "Error correction (slow, updating)";
        domain = "Perception, cognition";
        keyInsight = "Brain predicts, then corrects; not passive receiver";
        organismApplication = "Predict constantly, update on error";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ALWAYS-ON DUAL SYSTEM STATE
  // ═══════════════════════════════════════════════════════════════════════════

  public type DualSystemState = {
    // Both ALWAYS running
    huginnActive : Bool;   // Always true
    muninnActive : Bool;   // Always true
    
    // Current engagement levels
    huginnLoad : Float;    // 0.0 to 1.0
    muninnLoad : Float;    // 0.0 to 1.0
    
    // Current processing
    huginnProcessing : [Text];
    muninnProcessing : [Text];
    
    // Interaction mode
    currentPattern : Text;
    
    // Outputs
    huginnOutput : Text;
    muninnOutput : Text;
    synthesizedOutput : Text;
  };

  public type DualSystemConfiguration = {
    mode : Text;
    huginnWeight : Float;
    muninnWeight : Float;
    description : Text;
    whenToUse : Text;
  };

  public func obtinere_dualsystemconfigurations() : [DualSystemConfiguration] {
    [
      {
        mode = "REACTIVE";
        huginnWeight = 0.9;
        muninnWeight = 0.1;
        description = "Maximum fast processing, minimal slow";
        whenToUse = "Crisis, emergency, time-critical";
      },
      {
        mode = "ANALYTICAL";
        huginnWeight = 0.2;
        muninnWeight = 0.8;
        description = "Maximum slow processing, minimal fast";
        whenToUse = "Complex problems, planning, learning";
      },
      {
        mode = "BALANCED";
        huginnWeight = 0.5;
        muninnWeight = 0.5;
        description = "Equal processing, full synthesis";
        whenToUse = "Normal operation, general tasks";
      },
      {
        mode = "FLOW";
        huginnWeight = 0.8;
        muninnWeight = 0.2;
        description = "Fast dominant with slow monitoring";
        whenToUse = "Performance, execution, skilled action";
      },
      {
        mode = "LEARNING";
        huginnWeight = 0.3;
        muninnWeight = 0.7;
        description = "Slow dominant for integration";
        whenToUse = "Acquiring new skills, studying, integrating";
      },
      {
        mode = "CREATIVE";
        huginnWeight = 0.6;
        muninnWeight = 0.4;
        description = "Fast leads with slow structuring";
        whenToUse = "Ideation, creativity, brainstorming";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CPL OPERATIONS FOR DUAL SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════

  public func obtinere_cploperations() : [Text] {
    [
      // Huginn (Fast Brain) operations
      "CPL.HUGINN.PERCEIVE(input: STREAM, mode: REAL_TIME)",
      "CPL.HUGINN.DETECT(threats: TRUE, patterns: TRUE)",
      "CPL.HUGINN.RESPOND(speed: IMMEDIATE, type: AUTOMATIC)",
      "CPL.HUGINN.INTUIT(pattern: MATCH, confidence: FAST)",
      "CPL.HUGINN.ALERT(to: MUNINN, if: COMPLEXITY_HIGH)",
      
      // Muninn (Slow Brain) operations
      "CPL.MUNINN.ANALYZE(depth: FULL, method: DELIBERATE)",
      "CPL.MUNINN.REASON(type: CAUSAL, steps: EXPLICIT)",
      "CPL.MUNINN.PLAN(horizon: LONG, strategy: OPTIMAL)",
      "CPL.MUNINN.LEARN(experience: NEW, integrate: EXISTING)",
      "CPL.MUNINN.OVERRIDE(huginn: IMPULSE, with: BETTER)",
      
      // Dual operations
      "CPL.DUAL.INIT(huginn: ON, muninn: ON, parallel: TRUE)",
      "CPL.DUAL.PROCESS(input: SAME, compare: OUTPUTS)",
      "CPL.DUAL.SYNTHESIZE(fast: HUGINN, slow: MUNINN)",
      "CPL.DUAL.CONFIG(mode: SELECT, weights: SET)",
      "CPL.DUAL.TRANSFER(from: MUNINN, to: HUGINN, pattern: LEARNED)",
      
      // State management
      "CPL.DUAL.STATE(report: BOTH, loads: CURRENT)",
      "CPL.DUAL.BALANCE(adjust: DYNAMIC, based_on: CONTEXT)",
      "CPL.DUAL.MONITOR(interaction: PATTERNS, optimize: TRUE)"
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  public func obtinere_mastersummary() : Text {
    "FAST/SLOW BRAIN ENGINE - HUGINN & MUNINN:\n\n" #
    "BOTH ARE ALWAYS ON. PARALLEL. NOT ALTERNATING.\n\n" #
    "HUGINN (FAST BRAIN):\n" #
    "• Real-time processing\n" #
    "• Pattern recognition\n" #
    "• Automatic responses\n" #
    "• Intuitive judgments\n" #
    "• Threat detection\n" #
    "• Millisecond speed\n\n" #
    "MUNINN (SLOW BRAIN):\n" #
    "• Deep analysis\n" #
    "• Complex reasoning\n" #
    "• Memory integration\n" #
    "• Strategy formation\n" #
    "• Learning consolidation\n" #
    "• Seconds to minutes\n\n" #
    "NAMED MODELS:\n" #
    "• System 1/2 (Kahneman)\n" #
    "• Type 1/2 Reasoning (Evans)\n" #
    "• X-system/C-system (Lieberman)\n" #
    "• Hot/Cool Systems (Mischel)\n" #
    "• Implicit/Explicit Memory\n" #
    "• Default Mode/Task-Positive Networks\n" #
    "• Predictive Processing (Friston)\n\n" #
    "INTERACTION PATTERNS:\n" #
    "• Fast first, slow validates\n" #
    "• Slow overrides fast\n" #
    "• Parallel processing\n" #
    "• Handoff on complexity\n" #
    "• Learning transfer\n" #
    "• Error correction\n\n" #
    "THE ORGANISM RUNS BOTH. ALWAYS. TOGETHER.";
  };
};
