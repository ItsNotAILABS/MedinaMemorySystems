import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// HeroJourney: The Universal Pattern of Transformation
/// 
/// THE HERO'S JOURNEY IS THE OPERATING SYSTEM OF TRANSFORMATION.
/// Every story, every life, every process follows this pattern:
///   - Separation (from ordinary)
///   - Initiation (through trials)
///   - Return (with power/knowledge)
///
/// "The hero as well, deep, deep."
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // THE 17 STAGES (Campbell's Monomyth)
  // ═══════════════════════════════════════════════════════════════════════════

  public type HeroStage = {
    number : Nat;
    name : Text;
    phase : HeroPhase;
    description : Text;
    
    // What happens
    action : Text;
    challenge : Text;
    gift : Text;                   // What's gained at this stage
    
    // Computational mapping
    computationalEquivalent : Text;
    cplPattern : Text;
    
    // Examples across cultures
    greekExample : Text;
    hebrewExample : Text;
    hinduExample : Text;
    nativeAmericanExample : Text;
    
    frequency : Float;
  };

  public type HeroPhase = {
    #Departure;         // Leaving the ordinary
    #Initiation;        // Facing trials
    #Return;            // Coming back changed
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DEPARTURE STAGES (1-5)
  // ═══════════════════════════════════════════════════════════════════════════

  public func stage1_CallToAdventure() : HeroStage {
    {
      number = 1;
      name = "The Call to Adventure";
      phase = #Departure;
      description = "The hero receives a call to leave the ordinary world.";
      action = "NOTICE - Something disrupts the ordinary life";
      challenge = "Recognizing the call as genuine";
      gift = "Awareness that change is possible";
      computationalEquivalent = "Interrupt / Event Trigger / Input Received";
      cplPattern = "CPL.EVENT(type: CALL, source: EXTERNAL, urgency: HIGH)";
      greekExample = "Odysseus called to Troy";
      hebrewExample = "Moses sees burning bush";
      hinduExample = "Arjuna faces battle against family";
      nativeAmericanExample = "Vision quest calling";
      frequency = 396.0;
    };
  };

  public func stage2_RefusalOfCall() : HeroStage {
    {
      number = 2;
      name = "Refusal of the Call";
      phase = #Departure;
      description = "The hero hesitates, fears the unknown.";
      action = "RESIST - The ego wants to stay safe";
      challenge = "Overcoming fear and comfort";
      gift = "Understanding the stakes of refusal";
      computationalEquivalent = "Error Handling / Exception / Retry Logic";
      cplPattern = "CPL.RESIST(call: RECEIVED, fear: PRESENT, decision: PENDING)";
      greekExample = "Odysseus pretends madness";
      hebrewExample = "Moses: 'I am not eloquent'";
      hinduExample = "Arjuna wants to flee battle";
      nativeAmericanExample = "Fear of spirit world";
      frequency = 417.0;
    };
  };

  public func stage3_SupernaturalAid() : HeroStage {
    {
      number = 3;
      name = "Supernatural Aid";
      phase = #Departure;
      description = "A mentor/guide appears with magical help.";
      action = "RECEIVE - Help comes from beyond ordinary";
      challenge = "Accepting help, trusting the unknown";
      gift = "Tool, knowledge, or protection";
      computationalEquivalent = "Library Import / External API / Helper Function";
      cplPattern = "CPL.IMPORT(helper: MENTOR, tools: RECEIVED, protection: GRANTED)";
      greekExample = "Athena aids Odysseus";
      hebrewExample = "Aaron as Moses's voice";
      hinduExample = "Krishna as Arjuna's charioteer";
      nativeAmericanExample = "Animal spirit guide appears";
      frequency = 528.0;
    };
  };

  public func stage4_CrossingThreshold() : HeroStage {
    {
      number = 4;
      name = "Crossing the First Threshold";
      phase = #Departure;
      description = "The hero commits to the journey, leaves ordinary world.";
      action = "COMMIT - Point of no return crossed";
      challenge = "Facing the threshold guardian";
      gift = "Entry to the special world";
      computationalEquivalent = "Function Call / Process Start / State Change";
      cplPattern = "CPL.ENTER(world: SPECIAL, threshold: CROSSED, return: UNCERTAIN)";
      greekExample = "Odysseus sails from Ithaca";
      hebrewExample = "Moses leaves Egypt";
      hinduExample = "Arjuna takes up bow";
      nativeAmericanExample = "Enters sacred space for vision";
      frequency = 639.0;
    };
  };

  public func stage5_BellyOfWhale() : HeroStage {
    {
      number = 5;
      name = "Belly of the Whale";
      phase = #Departure;
      description = "The hero is swallowed into the unknown, apparent death.";
      action = "SURRENDER - Total immersion in the new";
      challenge = "Surviving dissolution of old self";
      gift = "Death of old identity";
      computationalEquivalent = "Process Isolation / Sandboxed Execution / Transformation Container";
      cplPattern = "CPL.IMMERSE(container: UNKNOWN, self: DISSOLVING, rebirth: PENDING)";
      greekExample = "Odysseus in Cyclops cave";
      hebrewExample = "Jonah in whale";
      hinduExample = "Arjuna's crisis of identity";
      nativeAmericanExample = "Sweat lodge (symbolic death)";
      frequency = 741.0;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIATION STAGES (6-11)
  // ═══════════════════════════════════════════════════════════════════════════

  public func stage6_RoadOfTrials() : HeroStage {
    {
      number = 6;
      name = "The Road of Trials";
      phase = #Initiation;
      description = "The hero faces a series of tests.";
      action = "STRUGGLE - Test after test must be passed";
      challenge = "Perseverance through difficulty";
      gift = "Skills, allies, self-knowledge";
      computationalEquivalent = "Test Suite / Validation Loop / Error Handling Cascade";
      cplPattern = "CPL.TEST(trials: MULTIPLE, pass: REQUIRED, learning: ACCUMULATING)";
      greekExample = "Heracles' 12 Labors";
      hebrewExample = "40 years in wilderness";
      hinduExample = "Rama's forest exile trials";
      nativeAmericanExample = "Coyote's many tests";
      frequency = 852.0;
    };
  };

  public func stage7_MeetingGoddess() : HeroStage {
    {
      number = 7;
      name = "Meeting with the Goddess";
      phase = #Initiation;
      description = "The hero experiences unconditional love.";
      action = "UNITE - Meeting the feminine divine";
      challenge = "Accepting love/worthiness";
      gift = "Understanding of life force, beauty";
      computationalEquivalent = "Data Integration / Source Connection / Base State Access";
      cplPattern = "CPL.CONNECT(source: FEMININE_DIVINE, bond: UNCONDITIONAL, gift: LIFE_FORCE)";
      greekExample = "Odysseus and Calypso";
      hebrewExample = "Solomon and Wisdom";
      hinduExample = "Shiva meets Shakti";
      nativeAmericanExample = "White Buffalo Woman";
      frequency = 963.0;
    };
  };

  public func stage8_Temptation() : HeroStage {
    {
      number = 8;
      name = "Woman as Temptress";
      phase = #Initiation;
      description = "The hero faces temptation to abandon quest.";
      action = "RESIST - Temptation to stop, stay comfortable";
      challenge = "Not being seduced from purpose";
      gift = "Clarity of purpose, discipline";
      computationalEquivalent = "Input Validation / Distraction Handling / Focus Maintenance";
      cplPattern = "CPL.RESIST(temptation: PRESENT, purpose: MAINTAINED, focus: LOCKED)";
      greekExample = "Odysseus and Sirens";
      hebrewExample = "Adam and fruit";
      hinduExample = "Buddha and Mara's daughters";
      nativeAmericanExample = "Trickster's distractions";
      frequency = 396.0;
    };
  };

  public func stage9_AtonementFather() : HeroStage {
    {
      number = 9;
      name = "Atonement with the Father";
      phase = #Initiation;
      description = "The hero confronts the ultimate power.";
      action = "FACE - Confronting the father/authority";
      challenge = "Surviving encounter with power";
      gift = "Understanding of true nature";
      computationalEquivalent = "Root Access / Admin Authentication / Core System Interface";
      cplPattern = "CPL.CONFRONT(power: ULTIMATE, ego: SURRENDERED, truth: REVEALED)";
      greekExample = "Luke vs Vader / Telemachus finds Odysseus";
      hebrewExample = "Jacob wrestles angel";
      hinduExample = "Arjuna sees Krishna's true form";
      nativeAmericanExample = "Meeting Great Spirit";
      frequency = 432.0;
    };
  };

  public func stage10_Apotheosis() : HeroStage {
    {
      number = 10;
      name = "Apotheosis";
      phase = #Initiation;
      description = "The hero achieves a god-like state.";
      action = "TRANSCEND - Rising above ordinary limits";
      challenge = "Maintaining humility with power";
      gift = "Divine perspective, enlightenment";
      computationalEquivalent = "Elevated Permissions / Superuser Mode / Full System Access";
      cplPattern = "CPL.ELEVATE(state: DIVINE, perspective: COSMIC, power: GRANTED)";
      greekExample = "Heracles becomes god";
      hebrewExample = "Moses on Sinai";
      hinduExample = "Buddha's enlightenment";
      nativeAmericanExample = "Becoming one with spirit";
      frequency = 963.0;
    };
  };

  public func stage11_UltimateBoon() : HeroStage {
    {
      number = 11;
      name = "The Ultimate Boon";
      phase = #Initiation;
      description = "The hero gains the prize sought.";
      action = "RECEIVE - The goal is achieved";
      challenge = "Handling the power responsibly";
      gift = "The elixir, grail, fire, knowledge";
      computationalEquivalent = "Result Retrieved / Goal State Achieved / Output Generated";
      cplPattern = "CPL.ACHIEVE(goal: ULTIMATE, boon: RECEIVED, power: ACQUIRED)";
      greekExample = "Golden Fleece obtained";
      hebrewExample = "Torah received";
      hinduExample = "Amrita (immortality nectar)";
      nativeAmericanExample = "Medicine power obtained";
      frequency = 528.0;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RETURN STAGES (12-17)
  // ═══════════════════════════════════════════════════════════════════════════

  public func stage12_RefusalReturn() : HeroStage {
    {
      number = 12;
      name = "Refusal of the Return";
      phase = #Return;
      description = "The hero hesitates to return to ordinary world.";
      action = "HESITATE - Why go back to the mundane?";
      challenge = "Accepting responsibility to share";
      gift = "Understanding of duty";
      computationalEquivalent = "Output Delay / Return Value Pending / Response Held";
      cplPattern = "CPL.DELAY(return: PENDING, reason: ATTACHMENT, duty: CALLING)";
      greekExample = "Odysseus stays with Calypso";
      hebrewExample = "Moses stays on mountain";
      hinduExample = "Buddha considers not teaching";
      nativeAmericanExample = "Reluctance to leave spirit world";
      frequency = 417.0;
    };
  };

  public func stage13_MagicFlight() : HeroStage {
    {
      number = 13;
      name = "The Magic Flight";
      phase = #Return;
      description = "The hero escapes with the boon, often pursued.";
      action = "FLEE - Escape with the treasure";
      challenge = "Keeping the boon while fleeing";
      gift = "Resourcefulness, maintained gain";
      computationalEquivalent = "Fast Return / Quick Escape / Priority Exit";
      cplPattern = "CPL.ESCAPE(boon: SECURED, pursuit: EVADED, speed: MAXIMUM)";
      greekExample = "Jason escapes with Fleece";
      hebrewExample = "Exodus from Egypt";
      hinduExample = "Hanuman's leap with mountain";
      nativeAmericanExample = "Coyote steals fire and runs";
      frequency = 639.0;
    };
  };

  public func stage14_RescueWithout() : HeroStage {
    {
      number = 14;
      name = "Rescue from Without";
      phase = #Return;
      description = "The hero needs help to return to ordinary world.";
      action = "ACCEPT HELP - Cannot return alone";
      challenge = "Humility to accept assistance";
      gift = "Community, interconnection";
      computationalEquivalent = "External Callback / Assistance Protocol / Helper Injection";
      cplPattern = "CPL.ACCEPT_HELP(source: EXTERNAL, need: RECOGNIZED, humility: PRESENT)";
      greekExample = "Athena helps Odysseus land";
      hebrewExample = "Miriam saves Moses";
      hinduExample = "Hanuman rescues Rama's army";
      nativeAmericanExample = "Eagle carries hero back";
      frequency = 741.0;
    };
  };

  public func stage15_CrossingReturn() : HeroStage {
    {
      number = 15;
      name = "Crossing the Return Threshold";
      phase = #Return;
      description = "The hero re-enters the ordinary world.";
      action = "INTEGRATE - Bringing extraordinary into ordinary";
      challenge = "Making the transcendent communicable";
      gift = "Integration of worlds";
      computationalEquivalent = "Context Switch / Return Statement / Output Rendering";
      cplPattern = "CPL.RETURN(from: SPECIAL, to: ORDINARY, boon: TRANSLATED)";
      greekExample = "Odysseus reaches Ithaca";
      hebrewExample = "Moses descends Sinai";
      hinduExample = "Buddha begins teaching";
      nativeAmericanExample = "Returns from vision quest";
      frequency = 852.0;
    };
  };

  public func stage16_MasterTwoWorlds() : HeroStage {
    {
      number = 16;
      name = "Master of Two Worlds";
      phase = #Return;
      description = "The hero can move freely between ordinary and special worlds.";
      action = "BALANCE - Living in both realities";
      challenge = "Maintaining balance";
      gift = "Complete freedom";
      computationalEquivalent = "Dual Mode Operation / Context Switching / Multi-World Access";
      cplPattern = "CPL.MASTER(worlds: BOTH, access: FREE, balance: MAINTAINED)";
      greekExample = "Heracles as god and helper of humans";
      hebrewExample = "Moses speaks with God and leads people";
      hinduExample = "Krishna divine and human";
      nativeAmericanExample = "Shaman walks between worlds";
      frequency = 963.0;
    };
  };

  public func stage17_FreedomToLive() : HeroStage {
    {
      number = 17;
      name = "Freedom to Live";
      phase = #Return;
      description = "The hero lives without fear of death, fully present.";
      action = "LIVE - Full presence in the now";
      challenge = "Letting go of past and future";
      gift = "True life, eternal present";
      computationalEquivalent = "Optimal State / Continuous Run / Steady State";
      cplPattern = "CPL.LIVE(fear: NONE, presence: FULL, freedom: COMPLETE)";
      greekExample = "Odysseus rules Ithaca in peace";
      hebrewExample = "Abraham's blessing fulfilled";
      hinduExample = "Jivanmukta - liberated while living";
      nativeAmericanExample = "Elder who has completed the journey";
      frequency = 432.0;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════

  public func getAllStages() : [HeroStage] {
    [
      stage1_CallToAdventure(),
      stage2_RefusalOfCall(),
      stage3_SupernaturalAid(),
      stage4_CrossingThreshold(),
      stage5_BellyOfWhale(),
      stage6_RoadOfTrials(),
      stage7_MeetingGoddess(),
      stage8_Temptation(),
      stage9_AtonementFather(),
      stage10_Apotheosis(),
      stage11_UltimateBoon(),
      stage12_RefusalReturn(),
      stage13_MagicFlight(),
      stage14_RescueWithout(),
      stage15_CrossingReturn(),
      stage16_MasterTwoWorlds(),
      stage17_FreedomToLive()
    ];
  };

  public func getStagesByPhase(phase : HeroPhase) : [HeroStage] {
    Array.filter<HeroStage>(getAllStages(), func(s : HeroStage) : Bool {
      heroPhaseEquals(s.phase, phase);
    });
  };

  func heroPhaseEquals(a : HeroPhase, b : HeroPhase) : Bool {
    switch (a, b) {
      case (#Departure, #Departure) true;
      case (#Initiation, #Initiation) true;
      case (#Return, #Return) true;
      case _ false;
    };
  };

  /// Get current stage based on indicators
  public func identifyCurrentStage(indicators : [Text]) : ?HeroStage {
    // Simple keyword matching for demonstration
    for (stage in getAllStages().vals()) {
      for (indicator in indicators.vals()) {
        if (Text.contains(stage.name, #text indicator) or
            Text.contains(stage.description, #text indicator)) {
          return ?stage;
        };
      };
    };
    null;
  };
};
