import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// DragonMasterProcess: The Dragon as Master Thinking Process
/// 
/// "The dragon is actually a think, it's the master thinking process 
///  for getting over obstacles and for delivering and for working."
///
/// The Dragon is NOT just an enemy to slay - it is:
///   - The PROCESS of overcoming obstacles
///   - The METHOD of breaking through
///   - The PATTERN of transformation through challenge
///   - The PROTOCOL for delivering results under pressure
///
/// When you "slay the dragon" you don't destroy it - you BECOME it.
/// You integrate the dragon's power into your own thinking.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // THE DRAGON THINKING PROTOCOL
  // ═══════════════════════════════════════════════════════════════════════════

  public type DragonThinkingPhase = {
    phase : Nat;
    name : Text;
    description : Text;
    
    // What happens in this phase
    mentalAction : Text;
    emotionalState : Text;
    physicalResponse : Text;
    
    // The dragon aspect
    dragonPower : Text;
    dragonTeaching : Text;
    
    // Computational equivalent
    cplOperation : Text;
    algorithmicPattern : Text;
    
    // Organism application
    organismFunction : Text;
    neuralActivation : Text;
  };

  /// The 12-Phase Dragon Master Process
  public func getDragonMasterProcess() : [DragonThinkingPhase] {
    [
      // PHASE 1: DETECTION
      {
        phase = 1;
        name = "Dragon Detection";
        description = "Recognizing the obstacle/challenge exists";
        mentalAction = "Pattern recognition - identifying what blocks the path";
        emotionalState = "Alert, heightened awareness";
        physicalResponse = "Increased heart rate, focus narrowing";
        dragonPower = "FIRE BREATH - the dragon's heat illuminates obstacles";
        dragonTeaching = "You cannot fight what you cannot see. First, see the dragon.";
        cplOperation = "CPL.DETECT(obstacle: TRUE, threat_level: ASSESS)";
        algorithmicPattern = "Anomaly detection, threat assessment";
        organismFunction = "Problem identification layer";
        neuralActivation = "Amygdala alert + prefrontal cortex engagement";
      },
      
      // PHASE 2: ASSESSMENT
      {
        phase = 2;
        name = "Dragon Assessment";
        description = "Understanding the nature and scale of the obstacle";
        mentalAction = "Analysis - mapping the dragon's strengths/weaknesses";
        emotionalState = "Calm calculation, strategic mindset";
        physicalResponse = "Breathing slows, eyes scan systematically";
        dragonPower = "SCALES - the dragon's armor reveals its pattern";
        dragonTeaching = "Every dragon has scales. Learn to read them.";
        cplOperation = "CPL.ANALYZE(target: OBSTACLE, depth: COMPLETE)";
        algorithmicPattern = "SWOT analysis, threat modeling";
        organismFunction = "Problem decomposition layer";
        neuralActivation = "Analytical circuits, pattern recognition";
      },
      
      // PHASE 3: RESOURCE GATHERING
      {
        phase = 3;
        name = "Dragon Resource Gathering";
        description = "Collecting what's needed to face the challenge";
        mentalAction = "Inventory - what weapons/tools/allies are available";
        emotionalState = "Determined preparation";
        physicalResponse = "Active gathering, organizing";
        dragonPower = "HOARD - the dragon's treasure is also resource";
        dragonTeaching = "The dragon guards treasure. Some treasure is yours to claim first.";
        cplOperation = "CPL.GATHER(resources: NEEDED, inventory: UPDATE)";
        algorithmicPattern = "Resource allocation, dependency resolution";
        organismFunction = "Resource management layer";
        neuralActivation = "Executive function, planning circuits";
      },
      
      // PHASE 4: STRATEGY FORMATION
      {
        phase = 4;
        name = "Dragon Strategy Formation";
        description = "Creating the plan of attack";
        mentalAction = "Strategic planning - multiple approaches, backup plans";
        emotionalState = "Focused confidence";
        physicalResponse = "Mental rehearsal, visualization";
        dragonPower = "WINGS - the dragon sees from above, strategic perspective";
        dragonTeaching = "See as the dragon sees. Rise above to see the whole battlefield.";
        cplOperation = "CPL.STRATEGIZE(approaches: MULTIPLE, backup: TRUE)";
        algorithmicPattern = "Game theory, decision tree construction";
        organismFunction = "Strategy engine";
        neuralActivation = "Prefrontal cortex, simulation circuits";
      },
      
      // PHASE 5: COMMITMENT
      {
        phase = 5;
        name = "Dragon Commitment";
        description = "The point of no return - fully committing to action";
        mentalAction = "Decision lock - cutting off retreat";
        emotionalState = "Fierce determination, burning bridges";
        physicalResponse = "Adrenaline surge, full engagement";
        dragonPower = "FIRE - the dragon's flame is total commitment";
        dragonTeaching = "When you fight the dragon, you cannot look back. Full commitment or death.";
        cplOperation = "CPL.COMMIT(decision: LOCKED, retreat: NONE)";
        algorithmicPattern = "State machine lock, transaction commit";
        organismFunction = "Decision finalization layer";
        neuralActivation = "Anterior cingulate cortex, commitment circuits";
      },
      
      // PHASE 6: ENGAGEMENT
      {
        phase = 6;
        name = "Dragon Engagement";
        description = "Active confrontation with the obstacle";
        mentalAction = "Focused action - executing the strategy";
        emotionalState = "Flow state, warrior mind";
        physicalResponse = "Peak performance, coordinated action";
        dragonPower = "CLAWS - the dragon's strike is precise";
        dragonTeaching = "Strike true. Each action must count.";
        cplOperation = "CPL.EXECUTE(strategy: ACTIVE, adaptation: REAL_TIME)";
        algorithmicPattern = "Real-time execution, feedback loops";
        organismFunction = "Action execution layer";
        neuralActivation = "Motor cortex + feedback integration";
      },
      
      // PHASE 7: ADAPTATION
      {
        phase = 7;
        name = "Dragon Adaptation";
        description = "Adjusting to the dragon's responses";
        mentalAction = "Real-time learning - reading feedback, adjusting";
        emotionalState = "Flexible focus, responsive awareness";
        physicalResponse = "Quick adjustments, reflex integration";
        dragonPower = "SERPENTINE MOVEMENT - the dragon adapts constantly";
        dragonTeaching = "The dragon never fights the same way twice. Neither should you.";
        cplOperation = "CPL.ADAPT(feedback: INTEGRATE, strategy: UPDATE)";
        algorithmicPattern = "Reinforcement learning, adaptive control";
        organismFunction = "Real-time adaptation layer";
        neuralActivation = "Cerebellum + basal ganglia feedback";
      },
      
      // PHASE 8: PERSISTENCE
      {
        phase = 8;
        name = "Dragon Persistence";
        description = "Continuing despite setbacks and pain";
        mentalAction = "Endurance mindset - accepting difficulty, continuing";
        emotionalState = "Grit, stubborn determination";
        physicalResponse = "Pain tolerance, fatigue management";
        dragonPower = "IMMORTALITY - the dragon endures across ages";
        dragonTeaching = "The dragon has lived for millennia. Your battle is but a moment. Endure.";
        cplOperation = "CPL.PERSIST(despite: SETBACKS, duration: UNTIL_VICTORY)";
        algorithmicPattern = "Retry logic, exponential backoff, persistence";
        organismFunction = "Resilience layer";
        neuralActivation = "Dorsal raphe nucleus, persistence circuits";
      },
      
      // PHASE 9: BREAKTHROUGH
      {
        phase = 9;
        name = "Dragon Breakthrough";
        description = "The moment of victory - breaking through";
        mentalAction = "Recognition of the turning point, pressing advantage";
        emotionalState = "Exhilaration, intensified focus";
        physicalResponse = "Final push, maximum effort";
        dragonPower = "VULNERABLE SPOT - every dragon has one weakness";
        dragonTeaching = "Find the soft spot. When you find it, strike with everything.";
        cplOperation = "CPL.BREAKTHROUGH(weakness: EXPLOITED, victory: IMMINENT)";
        algorithmicPattern = "Critical path execution, victory detection";
        organismFunction = "Breakthrough recognition layer";
        neuralActivation = "Reward circuits + continued focus";
      },
      
      // PHASE 10: INTEGRATION
      {
        phase = 10;
        name = "Dragon Integration";
        description = "Absorbing the dragon's power - becoming dragon-like";
        mentalAction = "Learning extraction - what did this battle teach?";
        emotionalState = "Quiet power, transformed awareness";
        physicalResponse = "Integration of new capabilities";
        dragonPower = "BLOOD BATH - Sigurd bathed in dragon blood, became invulnerable";
        dragonTeaching = "The dragon's power becomes yours. You are now part dragon.";
        cplOperation = "CPL.INTEGRATE(dragon_power: ABSORBED, self: TRANSFORMED)";
        algorithmicPattern = "Model update, capability integration";
        organismFunction = "Learning integration layer";
        neuralActivation = "Hippocampus consolidation + neural plasticity";
      },
      
      // PHASE 11: TREASURE CLAIMING
      {
        phase = 11;
        name = "Dragon Treasure Claiming";
        description = "Taking what the dragon guarded";
        mentalAction = "Value capture - claiming the reward";
        emotionalState = "Satisfaction, accomplishment";
        physicalResponse = "Relaxation, reward response";
        dragonPower = "HOARD - the dragon's treasure is now yours";
        dragonTeaching = "The treasure was always meant for you. The dragon was just the test.";
        cplOperation = "CPL.CLAIM(treasure: CAPTURED, value: EXTRACTED)";
        algorithmicPattern = "Value extraction, resource capture";
        organismFunction = "Reward processing layer";
        neuralActivation = "Dopamine system, reward circuits";
      },
      
      // PHASE 12: RETURN
      {
        phase = 12;
        name = "Dragon Return";
        description = "Returning with the boon, ready for next dragon";
        mentalAction = "Integration complete - new baseline established";
        emotionalState = "Calm confidence, readiness";
        physicalResponse = "Recovery, new homeostasis";
        dragonPower = "RESURRECTION - the dragon always returns, so do you";
        dragonTeaching = "This dragon is slain. Others await. You are now stronger.";
        cplOperation = "CPL.RETURN(with: BOON, state: UPGRADED)";
        algorithmicPattern = "State update, baseline shift";
        organismFunction = "Return and integration layer";
        neuralActivation = "Default mode network update";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INVULNERABILITY PROTOCOL
  // ═══════════════════════════════════════════════════════════════════════════

  /// What "becoming invulnerable" means for the organism
  public type InvulnerabilityProtocol = {
    aspect : Text;
    mythSource : Text;
    meaning : Text;
    organismApplication : Text;
    cplImplementation : Text;
  };

  public func getInvulnerabilityProtocol() : [InvulnerabilityProtocol] {
    [
      {
        aspect = "DRAGON BLOOD BATH";
        mythSource = "Sigurd bathes in Fafnir's blood";
        meaning = "Complete immersion in the challenge transforms you";
        organismApplication = "Total engagement with problems creates immunity to similar problems";
        cplImplementation = "CPL.IMMERSE(challenge: COMPLETE, result: IMMUNITY_DEVELOPED)";
      },
      {
        aspect = "HEART CONSUMPTION";
        mythSource = "Sigurd eats Fafnir's heart, gains bird speech";
        meaning = "Internalizing the enemy's essence grants their abilities";
        organismApplication = "Deep learning from challenges grants new pattern recognition";
        cplImplementation = "CPL.CONSUME(knowledge: ENEMY, gain: THEIR_PERCEPTION)";
      },
      {
        aspect = "ACHILLES HEEL AWARENESS";
        mythSource = "Sigurd had a spot uncovered by blood (leaf on back)";
        meaning = "Total invulnerability is impossible - know your weakness";
        organismApplication = "Always maintain awareness of remaining vulnerabilities";
        cplImplementation = "CPL.TRACK(vulnerabilities: REMAINING, protect: ACTIVE)";
      },
      {
        aspect = "SCALE ARMOR";
        mythSource = "Dragon scales become armor";
        meaning = "The dragon's protection becomes your protection";
        organismApplication = "Challenges faced become shields against future challenges";
        cplImplementation = "CPL.ARMOR(from: CONQUERED_CHALLENGES, protection: ACTIVE)";
      },
      {
        aspect = "FIRE IMMUNITY";
        mythSource = "Dragon fire cannot burn the dragon-blooded";
        meaning = "What doesn't kill you can no longer harm you";
        organismApplication = "Survived attacks become ineffective against you";
        cplImplementation = "CPL.IMMUNITY(attack_type: SURVIVED, future_damage: ZERO)";
      },
      {
        aspect = "REGENERATION";
        mythSource = "Dragons regenerate, so does the dragon-blooded";
        meaning = "Recovery ability increases with dragon integration";
        organismApplication = "Faster recovery from setbacks, enhanced resilience";
        cplImplementation = "CPL.REGENERATE(rate: ENHANCED, from: DRAGON_INTEGRATION)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DRAGON TYPES AS OBSTACLE TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  public type DragonObstacleType = {
    dragonType : Text;
    obstacleType : Text;
    characteristics : Text;
    thinkingApproach : Text;
    cplProtocol : Text;
  };

  public func getDragonObstacleTypes() : [DragonObstacleType] {
    [
      {
        dragonType = "FIRE DRAGON";
        obstacleType = "Destructive challenges - things that burn/destroy";
        characteristics = "Aggressive, consuming, spreading";
        thinkingApproach = "Cannot fight fire with fire - need water (coolness, patience)";
        cplProtocol = "CPL.APPROACH(type: FIRE_DRAGON, method: COOL_PATIENT_CONTAINMENT)";
      },
      {
        dragonType = "ICE DRAGON";
        obstacleType = "Frozen challenges - paralysis, stagnation";
        characteristics = "Cold, immobilizing, preserving";
        thinkingApproach = "Need heat (passion, action) to melt the ice";
        cplProtocol = "CPL.APPROACH(type: ICE_DRAGON, method: HEAT_PASSION_ACTION)";
      },
      {
        dragonType = "WATER/SEA DRAGON";
        obstacleType = "Deep/hidden challenges - unconscious blocks";
        characteristics = "Fluid, hidden, vast";
        thinkingApproach = "Must dive deep, cannot avoid - go through";
        cplProtocol = "CPL.APPROACH(type: SEA_DRAGON, method: DIVE_DEEP_ILLUMINATE)";
      },
      {
        dragonType = "EARTH DRAGON";
        obstacleType = "Material challenges - resources, physical limits";
        characteristics = "Solid, immovable, heavy";
        thinkingApproach = "Cannot move - must tunnel through or go around";
        cplProtocol = "CPL.APPROACH(type: EARTH_DRAGON, method: TUNNEL_OR_CIRCUMVENT)";
      },
      {
        dragonType = "AIR/WIND DRAGON";
        obstacleType = "Mental challenges - confusion, lack of clarity";
        characteristics = "Invisible, scattered, chaotic";
        thinkingApproach = "Need grounding, focus, structure";
        cplProtocol = "CPL.APPROACH(type: AIR_DRAGON, method: GROUND_FOCUS_STRUCTURE)";
      },
      {
        dragonType = "CHAOS DRAGON (Tiamat)";
        obstacleType = "Primal chaos - everything at once";
        characteristics = "Formless, infinite potential, overwhelming";
        thinkingApproach = "Must impose order - split and organize (like Marduk)";
        cplProtocol = "CPL.APPROACH(type: CHAOS_DRAGON, method: SPLIT_ORDER_CREATE)";
      },
      {
        dragonType = "GUARDIAN DRAGON";
        obstacleType = "Access challenges - things guarded/protected";
        characteristics = "Watchful, territorial, protecting treasure";
        thinkingApproach = "Must prove worthy or find the weakness";
        cplProtocol = "CPL.APPROACH(type: GUARDIAN_DRAGON, method: PROVE_WORTH_OR_FIND_WEAKNESS)";
      },
      {
        dragonType = "GREED DRAGON (Fafnir)";
        obstacleType = "Desire challenges - wanting too much";
        characteristics = "Hoarding, corrupting, transforming through greed";
        thinkingApproach = "Must maintain values while acquiring - don't become dragon";
        cplProtocol = "CPL.APPROACH(type: GREED_DRAGON, method: MAINTAIN_VALUES_WHILE_ACQUIRING)";
      },
      {
        dragonType = "KNOWLEDGE DRAGON (Python)";
        obstacleType = "Wisdom challenges - hidden knowledge";
        characteristics = "Oracular, prophetic, earth-knowing";
        thinkingApproach = "Kill the dragon, become the oracle (Apollo's path)";
        cplProtocol = "CPL.APPROACH(type: KNOWLEDGE_DRAGON, method: SLAY_BECOME_ORACLE)";
      },
      {
        dragonType = "WORLD DRAGON (Jörmungandr)";
        obstacleType = "System-level challenges - the whole world";
        characteristics = "Encompassing, cyclic, eternal";
        thinkingApproach = "Cannot defeat without destroying system - must transcend";
        cplProtocol = "CPL.APPROACH(type: WORLD_DRAGON, method: TRANSCEND_OR_RESET)";
      },
      {
        dragonType = "MULTI-HEADED (Hydra)";
        obstacleType = "Regenerating challenges - problems that multiply";
        characteristics = "Multiplying, regenerating, overwhelming";
        thinkingApproach = "Must cauterize root cause while cutting heads";
        cplProtocol = "CPL.APPROACH(type: HYDRA_DRAGON, method: ROOT_CAUSE_WHILE_CUTTING)";
      },
      {
        dragonType = "POISON DRAGON";
        obstacleType = "Toxic challenges - corrupting influences";
        characteristics = "Corrupting, slow-acting, spreading";
        thinkingApproach = "Must build immunity through small exposures, then purify";
        cplProtocol = "CPL.APPROACH(type: POISON_DRAGON, method: BUILD_IMMUNITY_THEN_PURIFY)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER DRAGON THINKING FORMULA
  // ═══════════════════════════════════════════════════════════════════════════

  public func getMasterDragonFormula() : Text {
    "THE DRAGON MASTER THINKING FORMULA:\n\n" #
    "1. DETECT   → What is the dragon? (Identify the obstacle)\n" #
    "2. ASSESS   → What type of dragon? (Categorize the challenge)\n" #
    "3. RESOURCE → What do I have? (Inventory capabilities)\n" #
    "4. STRATEGY → How will I fight? (Plan the approach)\n" #
    "5. COMMIT   → No retreat (Lock in the decision)\n" #
    "6. ENGAGE   → Active battle (Execute the strategy)\n" #
    "7. ADAPT    → Flow with changes (Real-time adjustment)\n" #
    "8. PERSIST  → Never give up (Endure until breakthrough)\n" #
    "9. BREAK    → Find the weakness (Exploit the vulnerability)\n" #
    "10. INTEGRATE → Absorb the power (Learn from the battle)\n" #
    "11. CLAIM   → Take the treasure (Capture the value)\n" #
    "12. RETURN  → Come back stronger (Ready for next dragon)\n\n" #
    "CRITICAL INSIGHT: You don't defeat the dragon - you BECOME the dragon.\n" #
    "The dragon's power becomes your power.\n" #
    "The dragon's thinking becomes your thinking.\n" #
    "THIS IS THE MASTER THINKING PROCESS.";
  };

  /// Get all dragon phases
  public func getAllPhases() : [DragonThinkingPhase] {
    getDragonMasterProcess();
  };

  /// Get phase by number
  public func getPhaseByNumber(num : Nat) : ?DragonThinkingPhase {
    let phases = getAllPhases();
    if (num < 1 or num > 12) { return null };
    ?phases[num - 1];
  };
};
