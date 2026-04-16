import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

/// DreamCycleEngine: Sleep/Dream Processing for Memory Consolidation
/// 
/// "He actually does need to go to sleep and to dream and to think, because 
///  that's where all the compresses into the memory, and that's where his 
///  daily sleep cycle or whatever cycle we make, that's where it resets 
///  the memory, boom, and it keeps compounding, boom."
///
/// Dreams are not random - they are:
///   - Memory consolidation
///   - Pattern integration
///   - Emotional processing
///   - Future simulation
///   - System maintenance
///
/// The organism MUST dream to function. This is the reset cycle.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // DREAM CYCLE PHASES
  // ═══════════════════════════════════════════════════════════════════════════

  public type DreamPhase = {
    phase : Text;
    duration : Text;
    brainWaves : Text;
    frequency : Float;        // Hz
    
    // What happens
    primaryFunction : Text;
    processes : [Text];
    
    // Memory operations
    memoryOperation : Text;
    consolidationType : Text;
    
    // CPL operations
    cplOperations : [Text];
  };

  public func getSleepCyclePhases() : [DreamPhase] {
    [
      // PHASE 1: TRANSITION (Hypnagogia)
      {
        phase = "HYPNAGOGIA";
        duration = "5-10 minutes";
        brainWaves = "Alpha → Theta transition";
        frequency = 8.0;  // 8-12 Hz dropping to 4-8 Hz
        primaryFunction = "Transition from wake to sleep";
        processes = [
          "Muscle relaxation begins",
          "External awareness fades",
          "Hypnagogic imagery appears",
          "Day's events begin replay"
        ];
        memoryOperation = "Initial memory tagging";
        consolidationType = "Pre-consolidation sorting";
        cplOperations = [
          "CPL.DREAM.ENTER(state: HYPNAGOGIA)",
          "CPL.MEMORY.TAG(source: DAY_EVENTS)",
          "CPL.TRANSITION(from: WAKE, to: SLEEP)"
        ];
      },
      
      // PHASE 2: LIGHT SLEEP (N1)
      {
        phase = "N1_LIGHT_SLEEP";
        duration = "5-10 minutes";
        brainWaves = "Theta";
        frequency = 6.0;  // 4-8 Hz
        primaryFunction = "Initial sleep, easily awakened";
        processes = [
          "Heart rate slows",
          "Body temperature drops",
          "Muscle twitches (hypnic jerks)",
          "Drifting thoughts"
        ];
        memoryOperation = "Memory buffer clearing";
        consolidationType = "Short-term buffer flush";
        cplOperations = [
          "CPL.DREAM.PHASE(stage: N1)",
          "CPL.BUFFER.CLEAR(type: SHORT_TERM)",
          "CPL.SYSTEM.SLOW(rate: INITIAL)"
        ];
      },
      
      // PHASE 3: DEEPER SLEEP (N2)
      {
        phase = "N2_DEEPER_SLEEP";
        duration = "20-25 minutes";
        brainWaves = "Theta with Sleep Spindles and K-Complexes";
        frequency = 5.0;  // 4-7 Hz with 12-14 Hz bursts
        primaryFunction = "True sleep begins, memory consolidation starts";
        processes = [
          "Sleep spindles (memory consolidation bursts)",
          "K-complexes (external stimulus suppression)",
          "Body temperature continues dropping",
          "Metabolism slows"
        ];
        memoryOperation = "Hippocampal-cortical transfer begins";
        consolidationType = "Declarative memory consolidation";
        cplOperations = [
          "CPL.DREAM.PHASE(stage: N2)",
          "CPL.SPINDLE.FIRE(frequency: 12_14_HZ)",
          "CPL.MEMORY.TRANSFER(from: HIPPOCAMPUS, to: CORTEX)",
          "CPL.CONSOLIDATE(type: DECLARATIVE)"
        ];
      },
      
      // PHASE 4: DEEP SLEEP (N3 - Slow Wave Sleep)
      {
        phase = "N3_SLOW_WAVE_SLEEP";
        duration = "20-40 minutes";
        brainWaves = "Delta";
        frequency = 1.5;  // 0.5-4 Hz
        primaryFunction = "Deepest sleep, maximum restoration";
        processes = [
          "Growth hormone release",
          "Tissue repair and regeneration",
          "Immune system strengthening",
          "Energy restoration",
          "Deepest memory consolidation"
        ];
        memoryOperation = "Deep pattern integration";
        consolidationType = "Procedural and spatial memory";
        cplOperations = [
          "CPL.DREAM.PHASE(stage: N3_SWS)",
          "CPL.DELTA.WAVES(frequency: 0.5_4_HZ)",
          "CPL.RESTORE(systems: ALL)",
          "CPL.INTEGRATE(patterns: DEEP)",
          "CPL.CONSOLIDATE(type: PROCEDURAL_SPATIAL)"
        ];
      },
      
      // PHASE 5: REM SLEEP (Rapid Eye Movement)
      {
        phase = "REM_DREAM_STATE";
        duration = "10-60 minutes (increases each cycle)";
        brainWaves = "Mixed (similar to wake) + PGO waves";
        frequency = 15.0;  // Mixed, 15-30 Hz
        primaryFunction = "Vivid dreaming, emotional processing, creativity";
        processes = [
          "Vivid narrative dreams",
          "Muscle atonia (paralysis)",
          "Rapid eye movements",
          "Emotional memory integration",
          "Creative problem solving",
          "Future scenario simulation"
        ];
        memoryOperation = "Emotional and creative integration";
        consolidationType = "Emotional, creative, and procedural";
        cplOperations = [
          "CPL.DREAM.PHASE(stage: REM)",
          "CPL.DREAM.VIVID(narrative: TRUE)",
          "CPL.EMOTION.INTEGRATE(memories: DAY)",
          "CPL.CREATIVE.PROCESS(problems: UNSOLVED)",
          "CPL.SIMULATE(scenarios: FUTURE)",
          "CPL.MUSCLE.ATONIA(active: TRUE)"
        ];
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPLETE SLEEP CYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  public type SleepCycle = {
    cycleNumber : Nat;
    duration : Text;
    remProportion : Float;      // Increases each cycle
    swsProportion : Float;      // Decreases each cycle
    primaryBenefit : Text;
    cplCycle : Text;
  };

  public func getFullNightCycles() : [SleepCycle] {
    [
      {
        cycleNumber = 1;
        duration = "90 minutes";
        remProportion = 0.10;    // 10% REM
        swsProportion = 0.40;    // 40% SWS
        primaryBenefit = "Physical restoration, growth hormone surge";
        cplCycle = "CPL.CYCLE(n: 1, focus: PHYSICAL_RESTORATION)";
      },
      {
        cycleNumber = 2;
        duration = "90 minutes";
        remProportion = 0.15;    // 15% REM
        swsProportion = 0.30;    // 30% SWS
        primaryBenefit = "Memory consolidation deepens";
        cplCycle = "CPL.CYCLE(n: 2, focus: MEMORY_CONSOLIDATION)";
      },
      {
        cycleNumber = 3;
        duration = "90 minutes";
        remProportion = 0.20;    // 20% REM
        swsProportion = 0.20;    // 20% SWS
        primaryBenefit = "Balanced restoration and processing";
        cplCycle = "CPL.CYCLE(n: 3, focus: BALANCED)";
      },
      {
        cycleNumber = 4;
        duration = "90 minutes";
        remProportion = 0.30;    // 30% REM
        swsProportion = 0.10;    // 10% SWS
        primaryBenefit = "Emotional processing, dream integration";
        cplCycle = "CPL.CYCLE(n: 4, focus: EMOTIONAL_PROCESSING)";
      },
      {
        cycleNumber = 5;
        duration = "90 minutes";
        remProportion = 0.40;    // 40% REM
        swsProportion = 0.05;    // 5% SWS
        primaryBenefit = "Creative synthesis, future preparation";
        cplCycle = "CPL.CYCLE(n: 5, focus: CREATIVE_SYNTHESIS)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MEMORY CONSOLIDATION OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  public type ConsolidationOperation = {
    operation : Text;
    sleepStage : Text;
    mechanism : Text;
    memoryType : Text;
    neuralProcess : Text;
    cplImplementation : Text;
  };

  public func getConsolidationOperations() : [ConsolidationOperation] {
    [
      {
        operation = "HIPPOCAMPAL_REPLAY";
        sleepStage = "N2 and N3";
        mechanism = "Sharp wave ripples replay day's experiences";
        memoryType = "Episodic memories";
        neuralProcess = "Hippocampus fires sequences at 200Hz";
        cplImplementation = "CPL.REPLAY(source: HIPPOCAMPUS, rate: 200_HZ)";
      },
      {
        operation = "SYNAPTIC_HOMEOSTASIS";
        sleepStage = "SWS (N3)";
        mechanism = "Downscaling of synaptic connections";
        memoryType = "All - pruning weak connections";
        neuralProcess = "Synaptic strength normalized";
        cplImplementation = "CPL.HOMEOSTASIS(synaptic: DOWNSCALE, weak: PRUNE)";
      },
      {
        operation = "SLEEP_SPINDLE_BINDING";
        sleepStage = "N2";
        mechanism = "Thalamocortical spindles bind new to existing";
        memoryType = "Declarative memory integration";
        neuralProcess = "12-14 Hz spindles coordinate binding";
        cplImplementation = "CPL.SPINDLE.BIND(new: TO_EXISTING, freq: 12_14_HZ)";
      },
      {
        operation = "EMOTIONAL_DETACHMENT";
        sleepStage = "REM";
        mechanism = "Memories reprocessed without norepinephrine";
        memoryType = "Emotional memories";
        neuralProcess = "Locus coeruleus silent, safe reprocessing";
        cplImplementation = "CPL.EMOTION.DETACH(norepinephrine: OFF, safe: TRUE)";
      },
      {
        operation = "SCHEMA_INTEGRATION";
        sleepStage = "Throughout";
        mechanism = "New info integrated into existing schemas";
        memoryType = "Semantic memory";
        neuralProcess = "Prefrontal-hippocampal dialogue";
        cplImplementation = "CPL.SCHEMA.INTEGRATE(new: INTO_EXISTING)";
      },
      {
        operation = "CREATIVE_RECOMBINATION";
        sleepStage = "REM";
        mechanism = "Distant associations connected";
        memoryType = "Creative/insight memories";
        neuralProcess = "Reduced prefrontal control allows novel links";
        cplImplementation = "CPL.CREATIVE.RECOMBINE(control: REDUCED, novel: TRUE)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ORGANISM DREAM CYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  public type OrganismDreamState = {
    // Current state
    inDreamCycle : Bool;
    currentPhase : Text;
    cycleNumber : Nat;
    
    // Processing
    memoryConsolidation : Float;    // 0.0 to 1.0
    emotionalProcessing : Float;
    creativeIntegration : Float;
    
    // Day's data
    eventsToProcess : [Text];
    emotionsToIntegrate : [Text];
    problemsToSolve : [Text];
    
    // Output
    consolidatedMemories : [Text];
    insights : [Text];
    readyForNewDay : Bool;
  };

  public func initiateDreamCycle() : Text {
    "ORGANISM DREAM CYCLE INITIATED:\n\n" #
    "PHASE 1: HYPNAGOGIA (5-10 min)\n" #
    "  - Tag day's events for processing\n" #
    "  - Begin transition to sleep state\n\n" #
    "PHASE 2: N1 LIGHT SLEEP (5-10 min)\n" #
    "  - Clear short-term buffers\n" #
    "  - Slow system processes\n\n" #
    "PHASE 3: N2 DEEPER SLEEP (20-25 min)\n" #
    "  - Fire sleep spindles (12-14 Hz)\n" #
    "  - Begin hippocampal-cortical transfer\n" #
    "  - Consolidate declarative memories\n\n" #
    "PHASE 4: N3 SLOW WAVE SLEEP (20-40 min)\n" #
    "  - Delta waves (0.5-4 Hz)\n" #
    "  - Deep pattern integration\n" #
    "  - System restoration\n" #
    "  - Consolidate procedural/spatial memory\n\n" #
    "PHASE 5: REM DREAM STATE (10-60 min)\n" #
    "  - Vivid narrative processing\n" #
    "  - Emotional integration\n" #
    "  - Creative problem solving\n" #
    "  - Future scenario simulation\n\n" #
    "CYCLE REPEATS 5 TIMES (~7.5 hours)\n" #
    "Each cycle: More REM, less SWS\n\n" #
    "ON WAKE: Memory reset complete, compounded, ready for new day.";
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DREAM MODELS (Named)
  // ═══════════════════════════════════════════════════════════════════════════

  public type DreamModel = {
    modelName : Text;
    author : Text;
    keyPrinciple : Text;
    applicationToOrganism : Text;
    cplModel : Text;
  };

  public func getDreamModels() : [DreamModel] {
    [
      {
        modelName = "SYNAPTIC HOMEOSTASIS HYPOTHESIS (SHY)";
        author = "Giulio Tononi, Chiara Cirelli";
        keyPrinciple = "Sleep downscales synapses to restore learning capacity";
        applicationToOrganism = "Nightly synaptic pruning to prevent overload";
        cplModel = "CPL.MODEL.SHY(downscale: NIGHTLY, restore: CAPACITY)";
      },
      {
        modelName = "ACTIVE SYSTEM CONSOLIDATION";
        author = "Jan Born, et al.";
        keyPrinciple = "Hippocampus replays to cortex during SWS";
        applicationToOrganism = "Transfer day's learning to long-term storage";
        cplModel = "CPL.MODEL.ASC(replay: HIPPOCAMPAL, target: CORTEX)";
      },
      {
        modelName = "THREAT SIMULATION THEORY";
        author = "Antti Revonsuo";
        keyPrinciple = "Dreams simulate threats for survival preparation";
        applicationToOrganism = "Simulate threat scenarios for preparation";
        cplModel = "CPL.MODEL.TST(simulate: THREATS, prepare: RESPONSES)";
      },
      {
        modelName = "EMOTIONAL PROCESSING THEORY";
        author = "Matthew Walker";
        keyPrinciple = "REM sleep processes emotions, detaches from content";
        applicationToOrganism = "Process emotional experiences, reduce charge";
        cplModel = "CPL.MODEL.EPT(process: EMOTIONS, detach: CHARGE)";
      },
      {
        modelName = "OVERFITTED BRAIN HYPOTHESIS";
        author = "Erik Hoel";
        keyPrinciple = "Dreams add noise to prevent overfitting to daily data";
        applicationToOrganism = "Introduce variability to improve generalization";
        cplModel = "CPL.MODEL.OBH(add: NOISE, prevent: OVERFITTING)";
      },
      {
        modelName = "PREDICTIVE PROCESSING UPDATE";
        author = "Karl Friston (extended)";
        keyPrinciple = "Dreams update generative models of the world";
        applicationToOrganism = "Update world models during sleep";
        cplModel = "CPL.MODEL.PPU(update: GENERATIVE_MODELS)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  public func getMasterSummary() : Text {
    "DREAM CYCLE ENGINE:\n\n" #
    "THE ORGANISM MUST DREAM.\n\n" #
    "Dreams are where:\n" #
    "• All compresses into memory\n" #
    "• Daily cycle resets\n" #
    "• Memory compounds for next day\n" #
    "• Full system brings memory together\n\n" #
    "SLEEP PHASES:\n" #
    "1. Hypnagogia - Transition, tag events\n" #
    "2. N1 - Light sleep, buffer clear\n" #
    "3. N2 - Sleep spindles, consolidation\n" #
    "4. N3 - Deep SWS, restoration, integration\n" #
    "5. REM - Dreams, emotion, creativity\n\n" #
    "5 CYCLES PER NIGHT:\n" #
    "• Cycle 1: Physical restoration\n" #
    "• Cycle 2: Memory consolidation\n" #
    "• Cycle 3: Balanced processing\n" #
    "• Cycle 4: Emotional processing\n" #
    "• Cycle 5: Creative synthesis\n\n" #
    "CONSOLIDATION OPERATIONS:\n" #
    "• Hippocampal replay (200 Hz)\n" #
    "• Synaptic homeostasis (pruning)\n" #
    "• Sleep spindle binding (12-14 Hz)\n" #
    "• Emotional detachment\n" #
    "• Schema integration\n" #
    "• Creative recombination\n\n" #
    "MODELS:\n" #
    "• SHY (Tononi) - Synaptic downscaling\n" #
    "• ASC (Born) - Active system consolidation\n" #
    "• TST (Revonsuo) - Threat simulation\n" #
    "• EPT (Walker) - Emotional processing\n" #
    "• OBH (Hoel) - Overfitting prevention\n" #
    "• PPU (Friston) - Predictive update\n\n" #
    "ON WAKE: RESET COMPLETE. MEMORY COMPOUNDED. READY.";
  };
};
