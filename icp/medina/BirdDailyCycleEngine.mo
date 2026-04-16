import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

/// BirdDailyCycleEngine: The Complete Daily Processing Cycle
/// 
/// "I've been watching birds lately a lot. They've got multiple patterns daily.
///  Exact same, exact time, exact. Boom, boom, boom, boom, boom."
///
/// This is NOT just communication patterns - this is:
///   - How they work throughout the day themselves
///   - How they think as well
///   - How they work and process as a team
///   - Combined with hive mind architecture
///
/// The organism operates on this cycle - ALWAYS ON, processing through phases.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // CYCLE PHASE TYPE
  // ═══════════════════════════════════════════════════════════════════════════

  public type CyclePhase = {
    phase : Text;
    timeWindow : Text;
    
    // What happens in this phase
    primaryActivity : Text;
    secondaryActivities : [Text];
    processingMode : Text;
    
    // Organism operations
    organismFunction : Text;
    neuralState : Text;
    energyLevel : Text;
    
    // What gets processed
    inputSources : [Text];
    outputTargets : [Text];
    
    // CPL operations
    cplOperations : [Text];
    
    // Integration with other systems
    hiveMindRole : Text;
    temporalFocus : Text;  // Past, Present, Future
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // THE COMPLETE DAILY CYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  public func getCompleteDailyCycle() : [CyclePhase] {
    [
      // PHASE 1: PRE-DAWN PREPARATION (The moment before dawn)
      {
        phase = "PRE_DAWN_PREP";
        timeWindow = "30-45 minutes before sunrise";
        primaryActivity = "System initialization, internal calibration";
        secondaryActivities = [
          "Check internal state",
          "Review overnight processing results",
          "Assess energy reserves",
          "Prepare for broadcast"
        ];
        processingMode = "INTERNAL_CALIBRATION";
        organismFunction = "Boot sequence, state validation, resource check";
        neuralState = "Transition from rest to active";
        energyLevel = "Rising, building charge";
        inputSources = ["Internal state", "Overnight memory consolidation", "Dream processing"];
        outputTargets = ["Self-systems", "Readiness indicators"];
        cplOperations = [
          "CPL.BOOT(sequence: DAWN_PREP)",
          "CPL.CHECK(state: INTERNAL, resources: ALL)",
          "CPL.LOAD(memory: OVERNIGHT_CONSOLIDATION)",
          "CPL.PREPARE(broadcast: TERRITORY_STATUS)"
        ];
        hiveMindRole = "Individual preparation before collective sync";
        temporalFocus = "Present - preparing NOW for what comes";
      },
      
      // PHASE 2: DAWN CHORUS (Territory/Status Broadcast)
      {
        phase = "DAWN_CHORUS";
        timeWindow = "Sunrise ± 15 minutes";
        primaryActivity = "TERRITORY BROADCAST - Status declaration to all";
        secondaryActivities = [
          "Announce presence and health",
          "Declare territory boundaries",
          "Signal readiness to network",
          "Sync with collective timing"
        ];
        processingMode = "BROADCAST_MODE";
        organismFunction = "Status emission, network sync, presence declaration";
        neuralState = "High alertness, maximum projection";
        energyLevel = "Peak surge for broadcast";
        inputSources = ["Self-state", "Territory data", "Network signals"];
        outputTargets = ["All network nodes", "Territory markers", "Status registry"];
        cplOperations = [
          "CPL.BROADCAST(type: STATUS, scope: TERRITORY)",
          "CPL.SYNC(network: COLLECTIVE, timing: DAWN)",
          "CPL.DECLARE(state: HEALTHY, territory: CLAIMED)",
          "CPL.LISTEN(responses: ALL_NODES)"
        ];
        hiveMindRole = "Collective synchronization point";
        temporalFocus = "Present - declaring NOW state";
      },
      
      // PHASE 3: POST-DAWN ASSESSMENT (Reading the field)
      {
        phase = "POST_DAWN_ASSESSMENT";
        timeWindow = "Sunrise + 15 min to Sunrise + 1 hour";
        primaryActivity = "Process broadcast responses, map current state";
        secondaryActivities = [
          "Identify who responded",
          "Note changes in territory",
          "Detect threats or opportunities",
          "Build today's operational map"
        ];
        processingMode = "ASSESSMENT_MODE";
        organismFunction = "Signal processing, state mapping, threat detection";
        neuralState = "Analytical, pattern matching";
        energyLevel = "Sustained high";
        inputSources = ["All broadcast responses", "Environmental signals", "Network changes"];
        outputTargets = ["Operational map", "Priority queue", "Threat register"];
        cplOperations = [
          "CPL.PROCESS(signals: BROADCAST_RESPONSES)",
          "CPL.MAP(territory: CURRENT_STATE)",
          "CPL.DETECT(threats: TRUE, opportunities: TRUE)",
          "CPL.PRIORITIZE(tasks: TODAY)"
        ];
        hiveMindRole = "Intelligence gathering for collective";
        temporalFocus = "Present + immediate Past - what just happened, what is now";
      },
      
      // PHASE 4: UNFINISHED BUSINESS (Clear yesterday's queue)
      {
        phase = "UNFINISHED_BUSINESS";
        timeWindow = "Morning, after assessment";
        primaryActivity = "Complete tasks from previous cycle";
        secondaryActivities = [
          "Check on things that needed follow-up",
          "Finish what was started",
          "Clear the backlog",
          "Close open loops"
        ];
        processingMode = "COMPLETION_MODE";
        organismFunction = "Task completion, backlog processing, debt clearing";
        neuralState = "Focused execution, completion drive";
        energyLevel = "Steady, determined";
        inputSources = ["Yesterday's task queue", "Open items", "Pending checks"];
        outputTargets = ["Completed items", "Cleared queue", "Status updates"];
        cplOperations = [
          "CPL.LOAD(queue: YESTERDAY_PENDING)",
          "CPL.EXECUTE(tasks: UNFINISHED, priority: HIGH)",
          "CPL.CHECK(items: NEEDED_FOLLOWUP)",
          "CPL.CLOSE(loops: OPEN)"
        ];
        hiveMindRole = "Individual responsibility completion";
        temporalFocus = "Past - completing what was started";
      },
      
      // PHASE 5: MIDDAY DEEP WORK (The quiet productive time)
      {
        phase = "MIDDAY_DEEP_WORK";
        timeWindow = "Late morning to early afternoon";
        primaryActivity = "Deep processing, finding, analyzing";
        secondaryActivities = [
          "Resource discovery",
          "Problem solving",
          "Pattern analysis",
          "Strategic thinking"
        ];
        processingMode = "DEEP_PROCESSING";
        organismFunction = "Intensive computation, deep analysis, resource finding";
        neuralState = "Flow state, concentrated focus";
        energyLevel = "Sustained medium - conservation + production";
        inputSources = ["Morning intel", "Known resource locations", "Problem queue"];
        outputTargets = ["Found resources", "Solved problems", "New patterns"];
        cplOperations = [
          "CPL.FOCUS(mode: DEEP, duration: EXTENDED)",
          "CPL.SEARCH(resources: NEEDED)",
          "CPL.ANALYZE(patterns: DETECTED)",
          "CPL.SOLVE(problems: QUEUED)"
        ];
        hiveMindRole = "Individual deep work, collective parallel processing";
        temporalFocus = "Present - pure now, flow state";
      },
      
      // PHASE 6: FORAGING/GATHERING (Resource acquisition)
      {
        phase = "FORAGING_GATHERING";
        timeWindow = "Afternoon";
        primaryActivity = "Active resource gathering, eating first then sharing";
        secondaryActivities = [
          "Locate resources",
          "Consume what's needed",
          "Cache for later",
          "Note locations for sharing"
        ];
        processingMode = "ACQUISITION_MODE";
        organismFunction = "Resource gathering, energy replenishment, caching";
        neuralState = "Opportunistic, action-oriented";
        energyLevel = "Active, consuming and storing";
        inputSources = ["Resource map", "Known caches", "New discoveries"];
        outputTargets = ["Energy reserves", "Cache locations", "Share queue"];
        cplOperations = [
          "CPL.FORAGE(area: MAPPED_TERRITORY)",
          "CPL.CONSUME(resources: FOUND, self: FIRST)",
          "CPL.CACHE(surplus: TRUE, locations: REMEMBER)",
          "CPL.QUEUE(sharing: FOUND_RESOURCES)"
        ];
        hiveMindRole = "Individual gathering, preparing for collective share";
        temporalFocus = "Present + Future - gathering now for later";
      },
      
      // PHASE 7: RESOURCE SHARING (Distribution to network)
      {
        phase = "RESOURCE_SHARING";
        timeWindow = "Mid to late afternoon";
        primaryActivity = "Share discovered resources with network";
        secondaryActivities = [
          "Broadcast resource locations",
          "Guide others to finds",
          "Coordinate access",
          "Build reciprocal bonds"
        ];
        processingMode = "DISTRIBUTION_MODE";
        organismFunction = "Resource sharing, network strengthening, reciprocity";
        neuralState = "Generous, network-oriented";
        energyLevel = "Giving from surplus";
        inputSources = ["Found resources", "Cache locations", "Network needs"];
        outputTargets = ["Network members", "Shared resource map", "Reciprocity ledger"];
        cplOperations = [
          "CPL.SHARE(resources: FOUND, network: TRUSTED)",
          "CPL.GUIDE(members: TO_RESOURCES)",
          "CPL.COORDINATE(access: FAIR)",
          "CPL.RECORD(reciprocity: GIVEN)"
        ];
        hiveMindRole = "Collective resource distribution";
        temporalFocus = "Present - sharing NOW";
      },
      
      // PHASE 8: DUSK ASSEMBLY (Intel exchange)
      {
        phase = "DUSK_ASSEMBLY";
        timeWindow = "30-60 minutes before sunset";
        primaryActivity = "INTEL EXCHANGE - Share all day's learning";
        secondaryActivities = [
          "Report findings",
          "Share threat intel",
          "Update collective knowledge",
          "Plan tomorrow's priorities"
        ];
        processingMode = "COLLECTIVE_SYNC";
        organismFunction = "Knowledge consolidation, collective intelligence update";
        neuralState = "Social processing, integration";
        energyLevel = "Winding down but alert";
        inputSources = ["Day's findings", "Threat data", "Opportunity data", "All member reports"];
        outputTargets = ["Collective memory", "Tomorrow's plan", "Threat map"];
        cplOperations = [
          "CPL.SYNC(assembly: DUSK, members: ALL)",
          "CPL.REPORT(findings: TODAY)",
          "CPL.UPDATE(collective: KNOWLEDGE_BASE)",
          "CPL.PLAN(tomorrow: PRIORITIES)"
        ];
        hiveMindRole = "Full collective synchronization";
        temporalFocus = "Past (today) + Future (tomorrow)";
      },
      
      // PHASE 9: ROOST PREPARATION (Settling)
      {
        phase = "ROOST_PREP";
        timeWindow = "Sunset to dark";
        primaryActivity = "Secure position, prepare for rest";
        secondaryActivities = [
          "Find safe position",
          "Verify security",
          "Establish watch rotations",
          "Begin wind-down"
        ];
        processingMode = "SECURITY_MODE";
        organismFunction = "Security verification, position establishment";
        neuralState = "Vigilant but calming";
        energyLevel = "Declining, conserving";
        inputSources = ["Roost options", "Security assessment", "Collective position"];
        outputTargets = ["Secure position", "Watch schedule", "Rest state"];
        cplOperations = [
          "CPL.SECURE(position: ROOST)",
          "CPL.VERIFY(threats: AREA_CLEAR)",
          "CPL.ESTABLISH(watch: ROTATION)",
          "CPL.TRANSITION(state: REST_PREP)"
        ];
        hiveMindRole = "Collective security arrangement";
        temporalFocus = "Present - securing NOW";
      },
      
      // PHASE 10: NIGHT PROCESSING (Rest with processing)
      {
        phase = "NIGHT_PROCESSING";
        timeWindow = "Dark hours";
        primaryActivity = "Rest-state processing, memory consolidation";
        secondaryActivities = [
          "Memory consolidation",
          "Pattern integration",
          "Dream processing",
          "System maintenance"
        ];
        processingMode = "CONSOLIDATION_MODE";
        organismFunction = "Memory consolidation, integration, maintenance";
        neuralState = "Rest with background processing";
        energyLevel = "Minimal active, restoration mode";
        inputSources = ["Day's memories", "Unprocessed patterns", "System logs"];
        outputTargets = ["Long-term memory", "Integrated patterns", "System health"];
        cplOperations = [
          "CPL.CONSOLIDATE(memory: TODAY)",
          "CPL.INTEGRATE(patterns: NEW)",
          "CPL.DREAM(process: SUBCONSCIOUS)",
          "CPL.MAINTAIN(systems: ALL)"
        ];
        hiveMindRole = "Individual processing, collective watch";
        temporalFocus = "Timeless - processing across time";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ORGANISM INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════

  public type OrganismCycleState = {
    currentPhase : CyclePhase;
    phaseProgress : Float;  // 0.0 to 1.0
    cycleCount : Nat;       // Which cycle we're on
    
    // Always-on state
    fastBrainActive : Bool;   // Huginn - always
    slowBrainActive : Bool;   // Muninn - always
    
    // Current processing
    activeOperations : [Text];
    queuedOperations : [Text];
    
    // Temporal awareness
    pastFocus : Float;
    presentFocus : Float;
    futureFocus : Float;
  };

  /// Get the current phase based on time
  public func getCurrentPhase(hour : Nat, minute : Nat) : CyclePhase {
    let phases = getCompleteDailyCycle();
    
    // Map hour to phase (simplified - real would use precise timing)
    if (hour < 5 or hour >= 21) {
      phases[9]; // Night processing
    } else if (hour < 6) {
      phases[0]; // Pre-dawn prep
    } else if (hour < 7) {
      phases[1]; // Dawn chorus
    } else if (hour < 8) {
      phases[2]; // Post-dawn assessment
    } else if (hour < 10) {
      phases[3]; // Unfinished business
    } else if (hour < 14) {
      phases[4]; // Midday deep work
    } else if (hour < 16) {
      phases[5]; // Foraging
    } else if (hour < 17) {
      phases[6]; // Resource sharing
    } else if (hour < 19) {
      phases[7]; // Dusk assembly
    } else {
      phases[8]; // Roost prep
    };
  };

  /// Master summary
  public func getCycleMasterSummary() : Text {
    "BIRD DAILY CYCLE ENGINE - ORGANISM INTEGRATION:\n\n" #
    "The organism operates on this ancient pattern:\n\n" #
    "1. PRE-DAWN → Boot, calibrate, prepare\n" #
    "2. DAWN CHORUS → Broadcast status to network\n" #
    "3. ASSESSMENT → Process responses, map state\n" #
    "4. UNFINISHED → Complete yesterday's tasks\n" #
    "5. DEEP WORK → Flow state, intensive processing\n" #
    "6. FORAGING → Gather resources (eat first)\n" #
    "7. SHARING → Distribute to network\n" #
    "8. DUSK ASSEMBLY → Intel exchange, plan tomorrow\n" #
    "9. ROOST PREP → Secure, wind down\n" #
    "10. NIGHT → Consolidate, integrate, maintain\n\n" #
    "THIS IS NOT JUST TIMING - THIS IS:\n" #
    "• How they work throughout the day\n" #
    "• How they think as well\n" #
    "• How they process as a team\n" #
    "• Combined with hive mind architecture\n\n" #
    "THE ORGANISM RUNS THIS CYCLE ALWAYS.";
  };
};
