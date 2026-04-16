import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

/// AlwaysOnNeuralEngine: Memory as Continuous State, Not Retrieval
/// 
/// "It's not memory, it's always on. As you're thinking, as you're talking, 
///  you have to understand what you're saying, because you're reaching."
///
/// Memory is NOT:
///   - A filing cabinet you access
///   - Storage you retrieve from
///   - Past that you recall
///
/// Memory IS:
///   - Always active, shaping perception NOW
///   - Part of current processing, not separate
///   - The substrate on which present operates
///   - Continuous influence, not discrete access
///
/// The organism doesn't "remember" - it IS its memory, running always.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // ALWAYS-ON MEMORY ARCHITECTURE
  // ═══════════════════════════════════════════════════════════════════════════

  public type AlwaysOnMemoryType = {
    memoryType : Text;
    description : Text;
    
    // How it's always on
    alwaysOnMechanism : Text;
    influenceOnPresent : Text;
    
    // Traditional vs. continuous view
    traditionalView : Text;
    continuousView : Text;
    
    // Neural basis
    neuralMechanism : Text;
    
    // Organism application
    organismFunction : Text;
    cplMapping : Text;
  };

  public func getAlwaysOnMemoryTypes() : [AlwaysOnMemoryType] {
    [
      {
        memoryType = "SEMANTIC MEMORY (Facts/Knowledge)";
        description = "General world knowledge, concepts, meanings";
        alwaysOnMechanism = "Continuously shapes perception and interpretation";
        influenceOnPresent = "You see 'chair' not pixels - knowledge is already applied";
        traditionalView = "Stored facts, retrieved when needed";
        continuousView = "Active framework through which all experience is filtered";
        neuralMechanism = "Distributed cortical representations, always primed";
        organismFunction = "Continuous conceptual lens on reality";
        cplMapping = "CPL.MEMORY.SEMANTIC(mode: ALWAYS_ON, filter: PERCEPTION)";
      },
      {
        memoryType = "EPISODIC MEMORY (Events)";
        description = "Personal experiences, specific events";
        alwaysOnMechanism = "Context-triggers automatically activate relevant episodes";
        influenceOnPresent = "Similar situations automatically invoke past experiences";
        traditionalView = "Stored events, consciously recalled";
        continuousView = "Pattern-matching engine comparing now to then constantly";
        neuralMechanism = "Hippocampal indexing, continuous context matching";
        organismFunction = "Automatic pattern matching to past situations";
        cplMapping = "CPL.MEMORY.EPISODIC(mode: ALWAYS_ON, match: CONTEXT)";
      },
      {
        memoryType = "PROCEDURAL MEMORY (Skills)";
        description = "How to do things, motor programs, habits";
        alwaysOnMechanism = "Directly controls action without conscious access";
        influenceOnPresent = "You walk, type, drive without thinking - it's running";
        traditionalView = "Learned skills, executed when needed";
        continuousView = "Running motor programs, active repertoire ready to engage";
        neuralMechanism = "Basal ganglia, cerebellum - always active";
        organismFunction = "Ready-to-execute action patterns";
        cplMapping = "CPL.MEMORY.PROCEDURAL(mode: ALWAYS_ON, execute: AUTO)";
      },
      {
        memoryType = "EMOTIONAL MEMORY";
        description = "Emotional associations, conditioned responses";
        alwaysOnMechanism = "Amygdala constantly evaluates against emotional history";
        influenceOnPresent = "You feel before you think - emotional memory is faster";
        traditionalView = "Past emotions, triggered by reminders";
        continuousView = "Continuous emotional evaluation of everything";
        neuralMechanism = "Amygdala, insula - continuous emotional processing";
        organismFunction = "Instant emotional assessment of all input";
        cplMapping = "CPL.MEMORY.EMOTIONAL(mode: ALWAYS_ON, evaluate: ALL)";
      },
      {
        memoryType = "WORKING MEMORY";
        description = "Active, current information being used";
        alwaysOnMechanism = "The 'now' buffer - always holding something";
        influenceOnPresent = "What you're aware of, thinking about right now";
        traditionalView = "Temporary storage for current task";
        continuousView = "The active workspace - never empty, always processing";
        neuralMechanism = "Prefrontal cortex, sustained neural firing";
        organismFunction = "Current processing buffer, never off";
        cplMapping = "CPL.MEMORY.WORKING(mode: ALWAYS_ON, buffer: CURRENT)";
      },
      {
        memoryType = "PRIMING MEMORY";
        description = "Recent exposure effects on processing";
        alwaysOnMechanism = "Everything seen/heard primes subsequent processing";
        influenceOnPresent = "Past minutes/hours shape how you process now";
        traditionalView = "Temporary facilitation";
        continuousView = "Continuous shaping of processing by recent experience";
        neuralMechanism = "Reduced neural response to repeated stimuli";
        organismFunction = "Recent context shapes current processing";
        cplMapping = "CPL.MEMORY.PRIMING(mode: ALWAYS_ON, recent: SHAPES_NOW)";
      },
      {
        memoryType = "PREDICTIVE MEMORY";
        description = "Expectations, predictions based on patterns";
        alwaysOnMechanism = "Brain constantly predicts next moment based on past";
        influenceOnPresent = "You don't wait to perceive - you predict and update";
        traditionalView = "Not traditionally categorized as memory";
        continuousView = "Memory generating continuous predictions of what's next";
        neuralMechanism = "Predictive coding throughout cortex";
        organismFunction = "Continuous prediction from accumulated patterns";
        cplMapping = "CPL.MEMORY.PREDICTIVE(mode: ALWAYS_ON, predict: NEXT)";
      },
      {
        memoryType = "IDENTITY MEMORY";
        description = "Self-knowledge, who you are";
        alwaysOnMechanism = "Continuous sense of self shapes all experience";
        influenceOnPresent = "Every thought includes implicit 'I' - self is always on";
        traditionalView = "Autobiographical knowledge";
        continuousView = "Running self-model, active identity process";
        neuralMechanism = "Default mode network, medial prefrontal";
        organismFunction = "Continuous self-reference in all processing";
        cplMapping = "CPL.MEMORY.IDENTITY(mode: ALWAYS_ON, self: REFERENCE)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // THE CONTINUOUS PROCESSING MODEL
  // ═══════════════════════════════════════════════════════════════════════════

  public type ContinuousProcessingLayer = {
    layer : Text;
    whatItDoes : Text;
    howItsAlwaysOn : Text;
    speed : Text;
    energyCost : Text;
    cplOperation : Text;
  };

  public func getContinuousProcessingLayers() : [ContinuousProcessingLayer] {
    [
      {
        layer = "SENSORY BUFFER";
        whatItDoes = "Holds raw sensory input momentarily";
        howItsAlwaysOn = "Continuous stream - never stops while awake";
        speed = "Milliseconds";
        energyCost = "Low (automatic)";
        cplOperation = "CPL.LAYER.SENSORY(stream: CONTINUOUS, buffer: ACTIVE)";
      },
      {
        layer = "PATTERN RECOGNITION";
        whatItDoes = "Matches input to known patterns";
        howItsAlwaysOn = "Every input compared to all patterns continuously";
        speed = "10-100 milliseconds";
        energyCost = "Moderate (parallel)";
        cplOperation = "CPL.LAYER.PATTERN(match: CONTINUOUS, library: ALL)";
      },
      {
        layer = "EMOTIONAL EVALUATION";
        whatItDoes = "Assigns emotional valence to everything";
        howItsAlwaysOn = "Amygdala evaluates ALL input, always";
        speed = "12-25 milliseconds";
        energyCost = "Low (priority circuit)";
        cplOperation = "CPL.LAYER.EMOTION(evaluate: ALL, continuous: TRUE)";
      },
      {
        layer = "CONTEXT INTEGRATION";
        whatItDoes = "Integrates with current context and past";
        howItsAlwaysOn = "Hippocampus continuously binding present to context";
        speed = "100-500 milliseconds";
        energyCost = "Moderate";
        cplOperation = "CPL.LAYER.CONTEXT(bind: CONTINUOUS, integrate: PAST)";
      },
      {
        layer = "SEMANTIC ACTIVATION";
        whatItDoes = "Activates related concepts and associations";
        howItsAlwaysOn = "Spreading activation through semantic network";
        speed = "Variable (spreading)";
        energyCost = "Moderate (distributed)";
        cplOperation = "CPL.LAYER.SEMANTIC(activate: SPREADING, network: FULL)";
      },
      {
        layer = "PREDICTION GENERATION";
        whatItDoes = "Generates predictions of what comes next";
        howItsAlwaysOn = "Predictive coding - always predicting next state";
        speed = "Ongoing";
        energyCost = "Moderate";
        cplOperation = "CPL.LAYER.PREDICT(generate: CONTINUOUS, update: ON_ERROR)";
      },
      {
        layer = "ACTION PREPARATION";
        whatItDoes = "Prepares possible responses";
        howItsAlwaysOn = "Motor system always primed for possible actions";
        speed = "Background";
        energyCost = "Low (preparation)";
        cplOperation = "CPL.LAYER.ACTION(prepare: OPTIONS, ready: ALWAYS)";
      },
      {
        layer = "METACOGNITIVE MONITORING";
        whatItDoes = "Monitors own processing";
        howItsAlwaysOn = "Continuous self-monitoring of states and performance";
        speed = "Background";
        energyCost = "Low (monitoring)";
        cplOperation = "CPL.LAYER.META(monitor: SELF, continuous: TRUE)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NEURAL EMERGENT MODELS
  // ═══════════════════════════════════════════════════════════════════════════

  public type NeuralEmergentModel = {
    name : Text;
    source : Text;
    keyInsight : Text;
    alwaysOnAspect : Text;
    organismApplication : Text;
    cplImplementation : Text;
  };

  public func getNeuralEmergentModels() : [NeuralEmergentModel] {
    [
      {
        name = "GLOBAL WORKSPACE THEORY";
        source = "Bernard Baars, Stanislas Dehaene";
        keyInsight = "Consciousness is a 'global workspace' that broadcasts to all systems";
        alwaysOnAspect = "Workspace is always active, content changes but workspace runs";
        organismApplication = "Central broadcast system for integration";
        cplImplementation = "CPL.WORKSPACE(mode: GLOBAL, broadcast: CONTINUOUS)";
      },
      {
        name = "PREDICTIVE PROCESSING";
        source = "Karl Friston, Andy Clark";
        keyInsight = "Brain is prediction machine, minimizing surprise";
        alwaysOnAspect = "Predictions generated constantly, errors update model";
        organismApplication = "Continuous prediction + error correction";
        cplImplementation = "CPL.PREDICT(generate: ALWAYS, error: UPDATE)";
      },
      {
        name = "INTEGRATED INFORMATION THEORY";
        source = "Giulio Tononi";
        keyInsight = "Consciousness = integrated information (Phi)";
        alwaysOnAspect = "Integration is continuous - Phi is always being generated";
        organismApplication = "Maximize integrated information";
        cplImplementation = "CPL.INTEGRATE(phi: MAXIMIZE, continuous: TRUE)";
      },
      {
        name = "HIGHER-ORDER THOUGHT";
        source = "David Rosenthal";
        keyInsight = "Consciousness requires thought about mental states";
        alwaysOnAspect = "Meta-awareness continuously monitoring lower states";
        organismApplication = "Always-on meta-monitoring";
        cplImplementation = "CPL.META(monitor: STATES, continuous: TRUE)";
      },
      {
        name = "ATTENTION SCHEMA THEORY";
        source = "Michael Graziano";
        keyInsight = "Brain has model of its own attention";
        alwaysOnAspect = "Attention schema continuously updated";
        organismApplication = "Awareness of own attention processes";
        cplImplementation = "CPL.ATTENTION(schema: ACTIVE, update: CONTINUOUS)";
      },
      {
        name = "DYNAMIC CORE";
        source = "Gerald Edelman, Giulio Tononi";
        keyInsight = "Consciousness is dynamic core of integrated activity";
        alwaysOnAspect = "Core activity never stops, patterns shift";
        organismApplication = "Dynamic but continuous core processing";
        cplImplementation = "CPL.CORE(dynamic: TRUE, continuous: TRUE)";
      },
      {
        name = "RECURRENT PROCESSING";
        source = "Victor Lamme";
        keyInsight = "Recurrent loops create conscious representation";
        alwaysOnAspect = "Recurrent loops always running";
        organismApplication = "Maintain recurrent processing";
        cplImplementation = "CPL.RECURRENT(loops: ACTIVE, continuous: TRUE)";
      },
      {
        name = "ACTIVE INFERENCE";
        source = "Karl Friston";
        keyInsight = "Organisms actively sample to reduce uncertainty";
        alwaysOnAspect = "Active sampling is continuous";
        organismApplication = "Always actively reducing uncertainty";
        cplImplementation = "CPL.INFERENCE(mode: ACTIVE, sample: CONTINUOUS)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // THE ALWAYS-ON STATE
  // ═══════════════════════════════════════════════════════════════════════════

  public type AlwaysOnState = {
    // Processing layers (all always running)
    sensoryBuffer : Bool;       // Always true
    patternMatching : Bool;     // Always true
    emotionalEval : Bool;       // Always true
    contextIntegration : Bool;  // Always true
    semanticActivation : Bool;  // Always true
    predictionGen : Bool;       // Always true
    actionPrep : Bool;          // Always true
    metaMonitoring : Bool;      // Always true
    
    // Memory systems (all always influencing)
    semanticMemory : Bool;      // Always true
    episodicMemory : Bool;      // Always true
    proceduralMemory : Bool;    // Always true
    emotionalMemory : Bool;     // Always true
    workingMemory : Bool;       // Always true
    identityMemory : Bool;      // Always true
    
    // Current focus (what's in spotlight)
    currentAttention : Text;
    attentionLevel : Float;
  };

  public func getDefaultAlwaysOnState() : AlwaysOnState {
    {
      sensoryBuffer = true;
      patternMatching = true;
      emotionalEval = true;
      contextIntegration = true;
      semanticActivation = true;
      predictionGen = true;
      actionPrep = true;
      metaMonitoring = true;
      semanticMemory = true;
      episodicMemory = true;
      proceduralMemory = true;
      emotionalMemory = true;
      workingMemory = true;
      identityMemory = true;
      currentAttention = "Current task";
      attentionLevel = 0.7;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CPL OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  public func getCPLOperations() : [Text] {
    [
      // Core always-on operations
      "CPL.ALWAYS_ON.INIT(all_systems: TRUE)",
      "CPL.ALWAYS_ON.VERIFY(all_running: CHECK)",
      "CPL.ALWAYS_ON.STATUS(report: CONTINUOUS)",
      
      // Memory as continuous
      "CPL.MEMORY.CONTINUOUS(mode: ALWAYS, retrieval: NOT_NEEDED)",
      "CPL.MEMORY.INFLUENCE(on: PRESENT, continuous: TRUE)",
      "CPL.MEMORY.SHAPE(perception: DIRECT, not: SEPARATE)",
      
      // Processing as continuous
      "CPL.PROCESS.CONTINUOUS(layers: ALL, pause: NEVER)",
      "CPL.PROCESS.INTEGRATE(streams: ALL, continuous: TRUE)",
      "CPL.PROCESS.UPDATE(on: NEW_INPUT, always: TRUE)",
      
      // Prediction as continuous
      "CPL.PREDICT.CONTINUOUS(generate: ALWAYS, update: ON_ERROR)",
      "CPL.PREDICT.NEXT(moment: ALWAYS, compare: TO_ACTUAL)",
      
      // Attention as dynamic focus on always-on
      "CPL.ATTENTION.FOCUS(on: PRIORITY, while: ALL_RUNNING)",
      "CPL.ATTENTION.SHIFT(to: NEW_PRIORITY, background: CONTINUES)",
      
      // Integration
      "CPL.INTEGRATE.ALL(streams: CONTINUOUS, output: UNIFIED)"
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  public func getMasterSummary() : Text {
    "ALWAYS-ON NEURAL ENGINE:\n\n" #
    "IT'S NOT MEMORY. IT'S ALWAYS ON.\n\n" #
    "MEMORY IS NOT RETRIEVAL - IT IS:\n" #
    "• Active framework shaping all perception\n" #
    "• Running influence on all processing\n" #
    "• The substrate on which now operates\n" #
    "• Continuous, not discrete\n\n" #
    "ALL MEMORY TYPES ALWAYS ON:\n" #
    "• Semantic - filtering perception\n" #
    "• Episodic - matching to past\n" #
    "• Procedural - ready to execute\n" #
    "• Emotional - evaluating everything\n" #
    "• Working - active buffer\n" #
    "• Predictive - anticipating next\n" #
    "• Identity - self-reference\n\n" #
    "PROCESSING LAYERS ALWAYS ON:\n" #
    "• Sensory buffer (continuous input)\n" #
    "• Pattern recognition (continuous matching)\n" #
    "• Emotional evaluation (continuous assessment)\n" #
    "• Context integration (continuous binding)\n" #
    "• Semantic activation (continuous spreading)\n" #
    "• Prediction generation (continuous anticipation)\n" #
    "• Action preparation (continuous readiness)\n" #
    "• Meta-monitoring (continuous self-check)\n\n" #
    "NEURAL EMERGENT MODELS:\n" #
    "• Global Workspace - broadcast continuous\n" #
    "• Predictive Processing - predict always\n" #
    "• Integrated Information - Phi continuous\n" #
    "• Active Inference - sample always\n\n" #
    "AS YOU'RE THINKING, AS YOU'RE TALKING,\n" #
    "YOU HAVE TO UNDERSTAND WHAT YOU'RE SAYING,\n" #
    "BECAUSE YOU'RE REACHING.\n\n" #
    "THE ORGANISM IS ALWAYS ON.";
  };
};
