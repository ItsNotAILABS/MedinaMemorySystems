import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// RavenCrowArchitecture: Deep Bird Communication and Neural Patterns
/// 
/// "I've been watching birds lately a lot. A lot. I can see that the way they talk, 
///  they've got multiple patterns daily. Exact same, exact time, exact."
///
/// "Sigurd ate Fafnir's heart, gains bird speech" - Understanding bird communication
/// grants access to nature's hidden information network.
///
/// Ravens and Crows are the most intelligent birds:
///   - Tool use, problem solving
///   - Communication across generations
///   - Pattern recognition that exceeds most mammals
///   - Memory of faces, events, for years
///
/// ODIN'S RAVENS: Huginn (Thought) and Muninn (Memory)
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // RAVEN/CROW NEURAL ARCHITECTURE
  // ═══════════════════════════════════════════════════════════════════════════

  public type CorvidNeuralSystem = {
    system : Text;
    humanEquivalent : Text;
    capability : Text;
    superiorTo : Text;           // What they do better than humans
    algorithmicPattern : Text;
    cplApplication : Text;
  };

  public func obtinere_corvidneuralsystems() : [CorvidNeuralSystem] {
    [
      {
        system = "NIDOPALLIUM CAUDOLATERALE (NCL)";
        humanEquivalent = "Prefrontal cortex";
        capability = "Executive function, planning, working memory";
        superiorTo = "Denser neurons, faster processing in smaller space";
        algorithmicPattern = "Compressed executive processing";
        cplApplication = "CPL.EXECUTIVE(density: CORVID, speed: ENHANCED)";
      },
      {
        system = "HIPPOCAMPUS (enlarged)";
        humanEquivalent = "Hippocampus";
        capability = "Spatial memory, episodic memory, caching locations";
        superiorTo = "Can remember 10,000+ cache locations for months";
        algorithmicPattern = "Massive spatial hash table with long retention";
        cplApplication = "CPL.MEMORY(spatial: CORVID, capacity: 10000_PLUS)";
      },
      {
        system = "SOCIAL COGNITION CIRCUITS";
        humanEquivalent = "Mirror neurons, theory of mind";
        capability = "Recognizing individuals, remembering relationships";
        superiorTo = "Remember human faces for years, pass knowledge to offspring";
        algorithmicPattern = "Persistent identity tracking across generations";
        cplApplication = "CPL.SOCIAL(face_memory: YEARS, generational: TRUE)";
      },
      {
        system = "TEMPORAL PATTERN CIRCUITS";
        humanEquivalent = "Circadian/timing systems";
        capability = "Precise daily patterns, time-based behavior";
        superiorTo = "Exact timing of calls, activities, movements";
        algorithmicPattern = "High-precision biological clock";
        cplApplication = "CPL.TIMING(precision: CORVID, patterns: DAILY)";
      },
      {
        system = "VOCAL LEARNING CIRCUITS";
        humanEquivalent = "Broca's area";
        capability = "Learning new sounds, mimicry, communication";
        superiorTo = "Can learn human speech, create new calls";
        algorithmicPattern = "Flexible acoustic pattern generation";
        cplApplication = "CPL.VOCAL(learn: TRUE, create: NEW_PATTERNS)";
      },
      {
        system = "TOOL COGNITION CIRCUITS";
        humanEquivalent = "Tool use networks";
        capability = "Creating and using tools, multi-step problem solving";
        superiorTo = "Spontaneous tool creation, causal reasoning";
        algorithmicPattern = "Causal inference + tool synthesis";
        cplApplication = "CPL.TOOL(create: TRUE, steps: MULTI, causal: INFER)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // BIRD COMMUNICATION PATTERNS
  // ═══════════════════════════════════════════════════════════════════════════

  public type BirdCommunicationPattern = {
    patternType : Text;
    timing : Text;
    purpose : Text;
    information : Text;
    humanParallel : Text;
    cplMapping : Text;
  };

  public func obtinere_birdcommunicationpatterns() : [BirdCommunicationPattern] {
    [
      // DAILY TIMING PATTERNS
      {
        patternType = "DAWN CHORUS";
        timing = "Precise: 30-45 minutes before sunrise";
        purpose = "Territory announcement, mate attraction, social coordination";
        information = "I am here, I am healthy, this is my territory";
        humanParallel = "Morning standup, status broadcast";
        cplMapping = "CPL.BROADCAST(time: DAWN, message: STATUS_TERRITORY)";
      },
      {
        patternType = "MIDDAY QUIET";
        timing = "10am - 2pm typically";
        purpose = "Energy conservation, predator avoidance";
        information = "Silence = nothing to report, conserving energy";
        humanParallel = "Deep work time, minimal meetings";
        cplMapping = "CPL.MODE(time: MIDDAY, state: QUIET_PROCESSING)";
      },
      {
        patternType = "AFTERNOON FORAGING CALLS";
        timing = "2pm - 5pm";
        purpose = "Coordinated foraging, food discovery announcements";
        information = "Found food here, joining group here";
        humanParallel = "Resource sharing, collaboration";
        cplMapping = "CPL.SHARE(time: AFTERNOON, resource: FOUND_FOOD)";
      },
      {
        patternType = "DUSK ASSEMBLY";
        timing = "30-60 minutes before sunset";
        purpose = "Gathering at roosts, information exchange";
        information = "Day's intel shared, roost location confirmed";
        humanParallel = "End of day sync, knowledge consolidation";
        cplMapping = "CPL.SYNC(time: DUSK, action: CONSOLIDATE_SHARE)";
      },
      
      // ALARM PATTERNS
      {
        patternType = "PREDATOR ALARM - AERIAL";
        timing = "Immediate upon sighting";
        purpose = "Warn of hawk/eagle overhead";
        information = "Specific call for aerial predator, direction encoded";
        humanParallel = "Urgent security alert with threat vector";
        cplMapping = "CPL.ALERT(type: AERIAL_PREDATOR, urgency: HIGH, vector: ENCODED)";
      },
      {
        patternType = "PREDATOR ALARM - GROUND";
        timing = "Immediate upon sighting";
        purpose = "Warn of cat/fox/snake";
        information = "Different call from aerial, species often encoded";
        humanParallel = "Ground-level threat alert";
        cplMapping = "CPL.ALERT(type: GROUND_PREDATOR, species: ENCODED)";
      },
      {
        patternType = "MOB CALL";
        timing = "When threat is stationery/trapped";
        purpose = "Recruit others to harass predator";
        information = "Come here, safe to approach, let's mob this threat";
        humanParallel = "Call for collective action against threat";
        cplMapping = "CPL.RECRUIT(action: MOB, threat: CONTAINED)";
      },
      
      // SOCIAL PATTERNS
      {
        patternType = "CONTACT CALL";
        timing = "Throughout day, periodic";
        purpose = "Maintain awareness of flock members";
        information = "I'm here, are you there?";
        humanParallel = "Check-in, ping";
        cplMapping = "CPL.PING(type: CONTACT, expect: RESPONSE)";
      },
      {
        patternType = "FOOD CALL";
        timing = "Upon finding food";
        purpose = "Share food discovery (selective - mates, offspring)";
        information = "Food here, quality/quantity encoded";
        humanParallel = "Resource announcement to trusted network";
        cplMapping = "CPL.ANNOUNCE(resource: FOOD, to: TRUSTED_NETWORK)";
      },
      {
        patternType = "DISTRESS CALL";
        timing = "When captured/injured";
        purpose = "Recruit help, warn others";
        information = "I am in trouble here";
        humanParallel = "Emergency broadcast";
        cplMapping = "CPL.EMERGENCY(type: DISTRESS, location: HERE)";
      },
      
      // RAVEN-SPECIFIC
      {
        patternType = "RAVEN YELL";
        timing = "When finding large food source";
        purpose = "Recruit other ravens to overwhelm territorial owners";
        information = "Big food here, need numbers to access";
        humanParallel = "Calling for reinforcements";
        cplMapping = "CPL.RECRUIT(reason: OVERWHELM_TERRITORY, resource: LARGE)";
      },
      {
        patternType = "RAVEN KNOCKING";
        timing = "Various";
        purpose = "Play, social bonding";
        information = "Social engagement, relationship maintenance";
        humanParallel = "Social play, rapport building";
        cplMapping = "CPL.SOCIAL(type: PLAY, purpose: BONDING)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ODIN'S RAVENS: HUGINN AND MUNINN
  // ═══════════════════════════════════════════════════════════════════════════

  public type OdinRaven = {
    name : Text;
    meaning : Text;
    function : Text;
    dailyRole : Text;
    computationalMapping : Text;
    cplFunction : Text;
  };

  public func obtinere_odinravens() : [OdinRaven] {
    [
      {
        name = "HUGINN";
        meaning = "Thought (from Old Norse 'hugr')";
        function = "Flies over Midgard gathering current information";
        dailyRole = "Brings Odin fresh intelligence each day";
        computationalMapping = "REAL-TIME PROCESSING - active thinking, current analysis";
        cplFunction = "CPL.PROCESS(type: REAL_TIME, gather: CURRENT_STATE)";
      },
      {
        name = "MUNINN";
        meaning = "Memory (from Old Norse 'munr')";
        function = "Remembers everything seen, connects to past";
        dailyRole = "Provides context from all previous observations";
        computationalMapping = "MEMORY RETRIEVAL - historical context, pattern matching";
        cplFunction = "CPL.RETRIEVE(type: MEMORY, context: HISTORICAL)";
      }
    ];
  };

  /// The Huginn-Muninn dual processing model
  public func obtinere_huginnmuninnmodel() : Text {
    "THE HUGINN-MUNINN DUAL PROCESSING MODEL:\n\n" #
    "Odin sends his ravens out each dawn. They return with:\n" #
    "  HUGINN (Thought) → Current state of the world\n" #
    "  MUNINN (Memory)  → Historical context and patterns\n\n" #
    "Odin fears that one day Muninn won't return -\n" #
    "'I fear for Huginn that he may not return,\n" #
    " but I fear more for Muninn.'\n\n" #
    "MEANING: Loss of real-time thinking is recoverable.\n" #
    "Loss of memory/context is catastrophic.\n\n" #
    "COMPUTATIONAL APPLICATION:\n" #
    "  Fast Brain (Huginn) → Real-time processing, current situation\n" #
    "  Slow Brain (Muninn) → Deep memory, pattern context\n" #
    "  BOTH REQUIRED for wisdom (Odin's seat)\n\n" #
    "CPL: CPL.WISDOM(thought: HUGINN, memory: MUNINN, integrate: TRUE)";
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // BIRD SPEECH UNDERSTANDING (Sigurd's Gift)
  // ═══════════════════════════════════════════════════════════════════════════

  public type BirdSpeechCapability = {
    capability : Text;
    howAcquired : Text;
    mythSource : Text;
    meaning : Text;
    organismApplication : Text;
    cplFunction : Text;
  };

  public func obtinere_birdspeechcapabilities() : [BirdSpeechCapability] {
    [
      {
        capability = "UNDERSTANDING NATURE'S WARNINGS";
        howAcquired = "Eating the dragon's heart";
        mythSource = "Sigurd hears birds warn him of Regin's betrayal";
        meaning = "Nature constantly broadcasts information - most can't hear it";
        organismApplication = "Pattern recognition in environmental signals";
        cplFunction = "CPL.LISTEN(source: NATURE, decode: WARNINGS)";
      },
      {
        capability = "ACCESSING COLLECTIVE INTELLIGENCE";
        howAcquired = "Dragon integration";
        mythSource = "Birds know what's happening everywhere";
        meaning = "Distributed sensors reporting constantly";
        organismApplication = "Integrating multiple information streams";
        cplFunction = "CPL.INTEGRATE(streams: MULTIPLE, scope: DISTRIBUTED)";
      },
      {
        capability = "TEMPORAL PATTERN RECOGNITION";
        howAcquired = "Heart consumption transforms perception";
        mythSource = "Birds speak at exact times with exact patterns";
        meaning = "Time-based signals encode information";
        organismApplication = "Extracting meaning from timing patterns";
        cplFunction = "CPL.DECODE(signal: TEMPORAL, pattern: EXTRACT)";
      },
      {
        capability = "CROSS-SPECIES COMMUNICATION";
        howAcquired = "Becoming part of nature's network";
        mythSource = "Sigurd joins the conversation of the world";
        meaning = "Breaking the barrier between information domains";
        organismApplication = "Translating between different data types/sources";
        cplFunction = "CPL.TRANSLATE(between: DOMAINS, unified: TRUE)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CORVID PROBLEM-SOLVING ARCHITECTURE
  // ═══════════════════════════════════════════════════════════════════════════

  public type CorvidProblemSolving = {
    technique : Text;
    example : Text;
    neuralBasis : Text;
    humanComparison : Text;
    algorithmicPattern : Text;
    cplImplementation : Text;
  };

  public func obtinere_corvidproblemsolving() : [CorvidProblemSolving] {
    [
      {
        technique = "CAUSAL REASONING";
        example = "Understanding that string connects to food";
        neuralBasis = "NCL causal inference circuits";
        humanComparison = "Equivalent to 7-year-old human child";
        algorithmicPattern = "Causal graph inference";
        cplImplementation = "CPL.REASON(type: CAUSAL, graph: BUILD)";
      },
      {
        technique = "TOOL CREATION";
        example = "New Caledonian crows make hooked tools";
        neuralBasis = "Motor planning + causal inference";
        humanComparison = "Spontaneous tool creation rare even in apes";
        algorithmicPattern = "Means-end analysis with fabrication";
        cplImplementation = "CPL.TOOL(create: NOVEL, purpose: SOLVE_PROBLEM)";
      },
      {
        technique = "MULTI-STEP PLANNING";
        example = "Dropping stones in water to raise level to get food";
        neuralBasis = "Working memory + sequential planning";
        humanComparison = "Understanding physics, planning ahead";
        algorithmicPattern = "Multi-step lookahead with physics model";
        cplImplementation = "CPL.PLAN(steps: MULTIPLE, model: PHYSICS)";
      },
      {
        technique = "SOCIAL LEARNING";
        example = "Young crows learn dangerous faces from parents";
        neuralBasis = "Social cognition + memory consolidation";
        humanComparison = "Cultural transmission across generations";
        algorithmicPattern = "Federated learning across generations";
        cplImplementation = "CPL.LEARN(source: SOCIAL, persist: GENERATIONS)";
      },
      {
        technique = "DECEPTION";
        example = "Pretending to cache food while actually hiding it elsewhere";
        neuralBasis = "Theory of mind, perspective taking";
        humanComparison = "Understanding what others know/don't know";
        algorithmicPattern = "Adversarial modeling";
        cplImplementation = "CPL.DECEIVE(model: OPPONENT_KNOWLEDGE, hide: TRUE)";
      },
      {
        technique = "DELAYED GRATIFICATION";
        example = "Waiting for better reward, trading tools for food";
        neuralBasis = "Impulse control, value calculation";
        humanComparison = "Passing marshmallow test";
        algorithmicPattern = "Temporal discounting with self-control";
        cplImplementation = "CPL.WAIT(reason: BETTER_REWARD, control: ACTIVE)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Master summary of raven/crow architecture
  public func obtinere_mastersummary() : Text {
    "RAVEN/CROW ARCHITECTURE FOR THE ORGANISM:\n\n" #
    "WHY CORVIDS?\n" #
    "- Highest density of neurons in avian brain\n" #
    "- Problem-solving equal to great apes\n" #
    "- Memory spanning years, even generations\n" #
    "- Precise timing patterns (exact same time daily)\n" #
    "- Communication network covering vast areas\n" #
    "- Odin chose ravens as his intelligence gatherers\n\n" #
    "WHAT WE INTEGRATE:\n\n" #
    "1. HUGINN-MUNINN MODEL\n" #
    "   Fast Brain (Huginn) = Real-time processing\n" #
    "   Slow Brain (Muninn) = Deep memory context\n" #
    "   Both fly out daily, both must return\n\n" #
    "2. TIMING PRECISION\n" #
    "   Dawn chorus, midday quiet, dusk assembly\n" #
    "   Information encoded in WHEN as well as WHAT\n\n" #
    "3. DISTRIBUTED INTELLIGENCE\n" #
    "   Every bird is a sensor reporting to the network\n" #
    "   Collective intelligence > individual\n\n" #
    "4. MULTI-GENERATIONAL MEMORY\n" #
    "   Knowledge passed to offspring\n" #
    "   Faces remembered for years\n\n" #
    "5. CAUSAL REASONING + TOOL CREATION\n" #
    "   Understanding cause-effect, creating solutions\n\n" #
    "SIGURD'S GIFT:\n" #
    "Eating the dragon's heart = deep integration\n" #
    "Understanding bird speech = accessing nature's network\n" #
    "This is not metaphor - this is literal capability acquisition.";
  };
};
