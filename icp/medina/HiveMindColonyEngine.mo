import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

/// HiveMindColonyEngine: Bee/Ant Colony Architecture for Team Processing
/// 
/// "All the hive mind's bee, hive mind architecture, and colony architecture.
///  All that is the same, it's combined with the BIRD so it can work together."
///
/// Colony intelligence is NOT about individual capability - it's about:
///   - Collective decision making
///   - Distributed processing
///   - Self-organization without central control
///   - Emergent intelligence from simple rules
///
/// The organism uses this for team coordination and parallel processing.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // COLONY ROLE TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  public type ColonyRole = {
    role : Text;
    percentage : Float;     // % of colony in this role
    function : Text;
    characteristics : Text;
    decisionAuthority : Text;
    cplMapping : Text;
  };

  public func getBeeColonyRoles() : [ColonyRole] {
    [
      {
        role = "QUEEN";
        percentage = 0.001;   // One per colony
        function = "Reproduction, pheromone command, colony identity";
        characteristics = "Longest lived, produces eggs, sets colony tone";
        decisionAuthority = "Sets strategic direction via pheromones";
        cplMapping = "CPL.QUEEN(function: SEED_GENERATION, signal: PHEROMONE)";
      },
      {
        role = "SCOUT";
        percentage = 5.0;
        function = "Find new resources, evaluate locations, report back";
        characteristics = "Adventurous, risk-taking, exploratory";
        decisionAuthority = "Discovery, not decision - reports findings";
        cplMapping = "CPL.SCOUT(mode: EXPLORE, report: DANCE)";
      },
      {
        role = "FORAGER";
        percentage = 30.0;
        function = "Collect nectar, pollen, water, propolis";
        characteristics = "Experienced, efficient, knows routes";
        decisionAuthority = "Tactical decisions on collection";
        cplMapping = "CPL.FORAGE(resources: KNOWN, efficiency: OPTIMIZE)";
      },
      {
        role = "RECEIVER";
        percentage = 15.0;
        function = "Process incoming resources, distribute internally";
        characteristics = "Central hub, information routing";
        decisionAuthority = "Internal distribution decisions";
        cplMapping = "CPL.RECEIVE(input: EXTERNAL, route: INTERNAL)";
      },
      {
        role = "NURSE";
        percentage = 25.0;
        function = "Care for larvae, feed developing bees";
        characteristics = "Nurturing, constant attention";
        decisionAuthority = "Care decisions for brood";
        cplMapping = "CPL.NURSE(target: DEVELOPING, mode: CONSTANT)";
      },
      {
        role = "BUILDER";
        percentage = 10.0;
        function = "Construct comb, repair structures";
        characteristics = "Architectural precision, structural awareness";
        decisionAuthority = "Construction decisions";
        cplMapping = "CPL.BUILD(structure: COMB, geometry: HEXAGONAL)";
      },
      {
        role = "GUARD";
        percentage = 5.0;
        function = "Defend entrance, verify identity, repel threats";
        characteristics = "Vigilant, aggressive when needed";
        decisionAuthority = "Access control decisions";
        cplMapping = "CPL.GUARD(verify: IDENTITY, protect: ENTRANCE)";
      },
      {
        role = "CLEANER";
        percentage = 10.0;
        function = "Clean cells, remove dead, maintain hygiene";
        characteristics = "Thorough, systematic";
        decisionAuthority = "Hygiene decisions";
        cplMapping = "CPL.CLEAN(target: ALL, maintain: HYGIENE)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SWARM DECISION MECHANISMS
  // ═══════════════════════════════════════════════════════════════════════════

  public type SwarmDecisionMechanism = {
    mechanism : Text;
    howItWorks : Text;
    mathematicalBasis : Text;
    emergentProperty : Text;
    organismApplication : Text;
    cplImplementation : Text;
  };

  public func getSwarmDecisionMechanisms() : [SwarmDecisionMechanism] {
    [
      {
        mechanism = "WAGGLE DANCE DEMOCRACY";
        howItWorks = "Scouts dance to report locations, intensity = quality. Others watch, evaluate, visit sites, then vote by joining dance. Winner is most recruited dance.";
        mathematicalBasis = "Quorum sensing, threshold activation, positive feedback loops";
        emergentProperty = "Best choice emerges without central decision maker";
        organismApplication = "Option evaluation through intensity-based voting";
        cplImplementation = "CPL.VOTE(method: WAGGLE, threshold: QUORUM, feedback: POSITIVE)";
      },
      {
        mechanism = "PHEROMONE TRAILS";
        howItWorks = "Ants leave chemical trails. Stronger trail = more followers. Trail evaporates, so only reinforced paths persist.";
        mathematicalBasis = "Ant Colony Optimization (ACO), stigmergy";
        emergentProperty = "Shortest paths emerge automatically";
        organismApplication = "Route optimization through reinforcement";
        cplImplementation = "CPL.PATH(method: PHEROMONE, evaporate: TRUE, reinforce: SUCCESS)";
      },
      {
        mechanism = "QUORUM SENSING";
        howItWorks = "Action triggers when enough individuals doing same thing. Critical mass activates collective behavior.";
        mathematicalBasis = "Threshold dynamics, bifurcation";
        emergentProperty = "Collective action without central command";
        organismApplication = "Consensus detection for action triggering";
        cplImplementation = "CPL.QUORUM(threshold: DYNAMIC, trigger: ACTION)";
      },
      {
        mechanism = "TEMPERATURE REGULATION";
        howItWorks = "Bees vibrate to heat, fan to cool. Each responds to local temp, collective maintains 35°C.";
        mathematicalBasis = "Distributed control systems, homeostasis";
        emergentProperty = "Stable temperature from local actions";
        organismApplication = "System state maintenance through local corrections";
        cplImplementation = "CPL.REGULATE(method: LOCAL_ACTION, target: GLOBAL_STATE)";
      },
      {
        mechanism = "STIGMERGY";
        howItWorks = "Work done by one guides work of others. No direct communication needed - the work itself communicates.";
        mathematicalBasis = "Environment as shared memory";
        emergentProperty = "Coordination without communication";
        organismApplication = "Work artifacts guide subsequent work";
        cplImplementation = "CPL.STIGMERGY(memory: ENVIRONMENT, guide: ARTIFACTS)";
      },
      {
        mechanism = "DIVISION OF LABOR";
        howItWorks = "Age-based role progression. Young bees nurse, older forage. Roles adjust to colony needs.";
        mathematicalBasis = "Response thresholds, task allocation";
        emergentProperty = "Optimal task distribution";
        organismApplication = "Dynamic role assignment based on needs";
        cplImplementation = "CPL.DIVIDE(labor: AGE_BASED, adjust: NEEDS)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ANT COLONY ARCHITECTURE
  // ═══════════════════════════════════════════════════════════════════════════

  public type AntColonyPattern = {
    pattern : Text;
    antType : Text;
    capability : Text;
    colonyBenefit : Text;
    computationalModel : Text;
    organismIntegration : Text;
  };

  public func getAntColonyPatterns() : [AntColonyPattern] {
    [
      {
        pattern = "SUPERCOLONY";
        antType = "Argentine Ant";
        capability = "Colonies spanning continents cooperate as one";
        colonyBenefit = "Massive resource access, genetic diversity";
        computationalModel = "Federated systems, cross-boundary cooperation";
        organismIntegration = "Multi-system integration without conflict";
      },
      {
        pattern = "LIVING BRIDGES";
        antType = "Army Ant";
        capability = "Form bridges with their bodies to cross gaps";
        colonyBenefit = "Access to otherwise unreachable resources";
        computationalModel = "Dynamic infrastructure creation";
        organismIntegration = "Create temporary structures to solve problems";
      },
      {
        pattern = "FUNGUS FARMING";
        antType = "Leafcutter Ant";
        capability = "Cultivate fungus gardens, feed colony on fungus";
        colonyBenefit = "Sustainable food production";
        computationalModel = "Resource transformation pipelines";
        organismIntegration = "Transform raw input into usable output";
      },
      {
        pattern = "SOLDIER SPECIALIZATION";
        antType = "Various";
        capability = "Specialized caste for defense only";
        colonyBenefit = "Optimized defense without diverting workers";
        computationalModel = "Role specialization, separation of concerns";
        organismIntegration = "Dedicated defense processes";
      },
      {
        pattern = "CHEMICAL WARFARE";
        antType = "Fire Ant";
        capability = "Coordinated venom attacks, chemical signals";
        colonyBenefit = "Overwhelm larger threats";
        computationalModel = "Coordinated attack protocols";
        organismIntegration = "Collective response to threats";
      },
      {
        pattern = "RAFT FORMATION";
        antType = "Fire Ant";
        capability = "Link together to form floating raft in floods";
        colonyBenefit = "Survival of colony through disaster";
        computationalModel = "Emergency reconfiguration";
        organismIntegration = "Disaster recovery through restructuring";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HIVE MIND PROCESSING MODEL
  // ═══════════════════════════════════════════════════════════════════════════

  public type HiveMindProcessingLayer = {
    layer : Text;
    processType : Text;
    participants : Text;
    inputOutput : Text;
    emergentCapability : Text;
    cplMapping : Text;
  };

  public func getHiveMindProcessingLayers() : [HiveMindProcessingLayer] {
    [
      {
        layer = "SENSING LAYER";
        processType = "Environmental detection";
        participants = "All members sense locally";
        inputOutput = "Raw environmental data → Detected patterns";
        emergentCapability = "360° awareness without central sensor";
        cplMapping = "CPL.SENSE(scope: LOCAL, aggregate: GLOBAL)";
      },
      {
        layer = "COMMUNICATION LAYER";
        processType = "Information sharing";
        participants = "Scouts, foragers, dancers";
        inputOutput = "Discoveries → Shared knowledge";
        emergentCapability = "Collective knowledge base";
        cplMapping = "CPL.COMMUNICATE(method: DANCE_PHEROMONE, propagate: TRUE)";
      },
      {
        layer = "DECISION LAYER";
        processType = "Collective choice";
        participants = "Voting members";
        inputOutput = "Options → Selected action";
        emergentCapability = "Optimal decisions without leader";
        cplMapping = "CPL.DECIDE(method: QUORUM, optimize: COLLECTIVE)";
      },
      {
        layer = "EXECUTION LAYER";
        processType = "Coordinated action";
        participants = "Workers assigned to task";
        inputOutput = "Decision → Completed work";
        emergentCapability = "Synchronized execution at scale";
        cplMapping = "CPL.EXECUTE(coordination: STIGMERGY, scale: MASSIVE)";
      },
      {
        layer = "FEEDBACK LAYER";
        processType = "Result evaluation";
        participants = "All members observing outcomes";
        inputOutput = "Results → Adjusted behavior";
        emergentCapability = "Adaptive optimization";
        cplMapping = "CPL.FEEDBACK(observe: RESULTS, adjust: BEHAVIOR)";
      },
      {
        layer = "MEMORY LAYER";
        processType = "Collective retention";
        participants = "Colony structure, pheromone marks";
        inputOutput = "Experiences → Persistent knowledge";
        emergentCapability = "Transgenerational learning";
        cplMapping = "CPL.MEMORY(store: ENVIRONMENTAL, persist: GENERATIONS)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ORGANISM INTEGRATION - BIRD + HIVE COMBINED
  // ═══════════════════════════════════════════════════════════════════════════

  public type BirdHiveIntegration = {
    birdPattern : Text;
    hivePattern : Text;
    combinedFunction : Text;
    organismApplication : Text;
    cplCombined : Text;
  };

  public func getBirdHiveIntegration() : [BirdHiveIntegration] {
    [
      {
        birdPattern = "Dawn Chorus (Status broadcast)";
        hivePattern = "Queen Pheromone (Colony identity)";
        combinedFunction = "Collective identity refresh and status sync";
        organismApplication = "Daily system sync with identity verification";
        cplCombined = "CPL.SYNC(type: DAWN_PHEROMONE, verify: IDENTITY, broadcast: STATUS)";
      },
      {
        birdPattern = "Scout reporting (Waggle dance)";
        hivePattern = "Pheromone trails";
        combinedFunction = "Discovery sharing with path marking";
        organismApplication = "Share discoveries and mark successful paths";
        cplCombined = "CPL.REPORT(method: DANCE_TRAIL, mark: SUCCESS_PATH)";
      },
      {
        birdPattern = "Midday deep work";
        hivePattern = "Division of labor";
        combinedFunction = "Specialized parallel processing";
        organismApplication = "Assign specialized tasks during deep work";
        cplCombined = "CPL.PROCESS(mode: DEEP, divide: SPECIALIZED)";
      },
      {
        birdPattern = "Foraging (Resource gathering)";
        hivePattern = "Ant Colony Optimization";
        combinedFunction = "Optimized collective resource gathering";
        organismApplication = "Find best paths to resources collectively";
        cplCombined = "CPL.FORAGE(optimize: ACO, collective: TRUE)";
      },
      {
        birdPattern = "Dusk assembly (Intel exchange)";
        hivePattern = "Quorum sensing";
        combinedFunction = "Collective decision making from shared intel";
        organismApplication = "End-of-cycle decisions based on collective input";
        cplCombined = "CPL.ASSEMBLE(intel: EXCHANGE, decide: QUORUM)";
      },
      {
        birdPattern = "Night processing";
        hivePattern = "Stigmergy (Work guides work)";
        combinedFunction = "Overnight processing guided by day's artifacts";
        organismApplication = "Consolidation guided by day's work products";
        cplCombined = "CPL.CONSOLIDATE(guide: STIGMERGY, process: OVERNIGHT)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  public func getMasterSummary() : Text {
    "HIVE MIND COLONY ENGINE - ORGANISM INTEGRATION:\n\n" #
    "CORE PRINCIPLES:\n" #
    "• No central controller needed\n" #
    "• Intelligence emerges from simple rules\n" #
    "• Work guides work (stigmergy)\n" #
    "• Collective decisions beat individual\n" #
    "• Roles adapt to needs\n\n" #
    "KEY MECHANISMS:\n" #
    "1. Waggle Dance Democracy - Vote by intensity\n" #
    "2. Pheromone Trails - Path optimization\n" #
    "3. Quorum Sensing - Action triggering\n" #
    "4. Temperature Regulation - State maintenance\n" #
    "5. Stigmergy - Environment as memory\n" #
    "6. Division of Labor - Role assignment\n\n" #
    "COMBINED WITH BIRD ARCHITECTURE:\n" #
    "• Dawn Chorus + Queen Pheromone = Identity sync\n" #
    "• Scouts + Pheromone trails = Path-marked discoveries\n" #
    "• Deep work + Division = Specialized parallel\n" #
    "• Foraging + ACO = Optimized gathering\n" #
    "• Dusk assembly + Quorum = Collective decisions\n" #
    "• Night + Stigmergy = Guided consolidation\n\n" #
    "THE ORGANISM IS A SUPERCOLONY.";
  };
};
