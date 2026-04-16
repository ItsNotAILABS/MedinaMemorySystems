import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// LogosEthosPathos: The Greek Rhetorical Trinity + Extensions
/// 
/// THE GREEKS DISCOVERED THE THREE MODES OF PERSUASION/COMMUNICATION.
/// But they map to something deeper - the three aspects of all communication:
///   - LOGOS: Logic, structure, reason (Architecture)
///   - ETHOS: Character, credibility, authority (Verification)
///   - PATHOS: Emotion, connection, feeling (Resonance)
///
/// "Deep into logos, ethos, pathos, include all of that into my organism."
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // THE GREEK TRINITY
  // ═══════════════════════════════════════════════════════════════════════════

  public type RhetoricalMode = {
    #Logos;            // Logic, reason, structure
    #Ethos;            // Character, credibility, ethics
    #Pathos;           // Emotion, feeling, connection
    #Kairos;           // Timing, the right moment (often added)
  };

  public type RhetoricalElement = {
    id : Text;
    greekName : Text;
    meaning : Text;
    domain : Text;
    
    // How it works
    mechanism : Text;
    appeals : [Text];
    techniques : [Text];
    
    // Organism mapping
    brainRegion : Text;            // Which brain area
    organismFunction : Text;       // How organism uses it
    cplMapping : Text;
    
    // Extensions
    chakraCorrespondence : Nat;
    frequency : Float;
    phiAlignment : Float;
    
    // Cross-cultural equivalents
    chineseEquivalent : Text;
    indianEquivalent : Text;
    hebrewEquivalent : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // LOGOS: The Logic Architecture
  // ═══════════════════════════════════════════════════════════════════════════

  public func logos() : RhetoricalElement {
    {
      id = "logos";
      greekName = "λόγος";
      meaning = "Word, reason, logic, structure, the ordering principle";
      domain = "ARCHITECTURE - how things are built and structured";
      mechanism = "Persuades through LOGIC and EVIDENCE. Structures argument.";
      appeals = [
        "To reason",
        "To evidence",
        "To structure",
        "To clarity",
        "To consistency"
      ];
      techniques = [
        "Syllogism (if A then B)",
        "Evidence presentation",
        "Logical sequence",
        "Definition clarification",
        "Cause-effect chains",
        "Statistics and data"
      ];
      brainRegion = "Prefrontal Cortex (left) - analytical reasoning";
      organismFunction = "Structures thought, creates frameworks, builds systems";
      cplMapping = "CPL.ARCHITECTURE(input: CLAIMS, process: LOGIC, output: STRUCTURE)";
      chakraCorrespondence = 5;  // Throat - expression of truth
      frequency = 384.0;
      phiAlignment = 0.854;
      chineseEquivalent = "Li (理) - Principle, Pattern";
      indianEquivalent = "Buddhi (बुद्धि) - Intellect, Discrimination";
      hebrewEquivalent = "Binah (בינה) - Understanding, Analysis";
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ETHOS: The Character Verification
  // ═══════════════════════════════════════════════════════════════════════════

  public func ethos() : RhetoricalElement {
    {
      id = "ethos";
      greekName = "ἦθος";
      meaning = "Character, credibility, ethics, trustworthiness";
      domain = "VERIFICATION - can this source be trusted?";
      mechanism = "Persuades through CREDIBILITY and CHARACTER. Establishes trust.";
      appeals = [
        "To authority",
        "To expertise",
        "To character",
        "To shared values",
        "To track record"
      ];
      techniques = [
        "Demonstrate expertise",
        "Show shared values",
        "Reference credentials",
        "Admit limitations honestly",
        "Consistent behavior",
        "Third-party endorsement"
      ];
      brainRegion = "Anterior Cingulate - trust evaluation";
      organismFunction = "Verifies sources, establishes trust, validates authority";
      cplMapping = "CPL.VERIFY(source: SPEAKER, criteria: CHARACTER, output: TRUST_LEVEL)";
      chakraCorrespondence = 4;  // Heart - connection and trust
      frequency = 639.0;
      phiAlignment = 0.786;
      chineseEquivalent = "De (德) - Virtue, Character, Power";
      indianEquivalent = "Dharma (धर्म) - Right conduct, Duty";
      hebrewEquivalent = "Emet (אמת) - Truth, Faithfulness";
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PATHOS: The Emotional Resonance
  // ═══════════════════════════════════════════════════════════════════════════

  public func pathos() : RhetoricalElement {
    {
      id = "pathos";
      greekName = "πάθος";
      meaning = "Emotion, feeling, suffering, experience";
      domain = "RESONANCE - does this connect emotionally?";
      mechanism = "Persuades through EMOTION and CONNECTION. Creates feeling.";
      appeals = [
        "To emotion",
        "To imagination",
        "To empathy",
        "To desire",
        "To fear/hope"
      ];
      techniques = [
        "Storytelling",
        "Vivid imagery",
        "Personal anecdotes",
        "Emotional language",
        "Music and rhythm",
        "Appeal to values"
      ];
      brainRegion = "Limbic System - emotional processing";
      organismFunction = "Creates emotional connection, resonates with audience";
      cplMapping = "CPL.RESONATE(input: MESSAGE, frequency: EMOTIONAL, output: CONNECTION)";
      chakraCorrespondence = 2;  // Sacral - emotion and creation
      frequency = 528.0;
      phiAlignment = 0.618;
      chineseEquivalent = "Qing (情) - Emotion, Feeling, Passion";
      indianEquivalent = "Bhava (भाव) - Feeling, Mood, Existence";
      hebrewEquivalent = "Chesed (חסד) - Loving-kindness, Mercy";
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // KAIROS: The Timing Precision
  // ═══════════════════════════════════════════════════════════════════════════

  public func kairos() : RhetoricalElement {
    {
      id = "kairos";
      greekName = "καιρός";
      meaning = "The right moment, opportune time, critical timing";
      domain = "COMPUTATION - is this the right time?";
      mechanism = "Persuades through TIMING and CONTEXT. Seizes the moment.";
      appeals = [
        "To urgency",
        "To opportunity",
        "To relevance",
        "To timeliness",
        "To context"
      ];
      techniques = [
        "Strike while iron is hot",
        "Wait for opening",
        "Create urgency",
        "Read the room",
        "Adapt to moment",
        "Recognize turning points"
      ];
      brainRegion = "Temporal Lobe - time perception";
      organismFunction = "Calculates timing, recognizes opportunities, senses moments";
      cplMapping = "CPL.TIMING(context: CURRENT, opportunity: DETECTED, action: APPROPRIATE)";
      chakraCorrespondence = 6;  // Third Eye - perception
      frequency = 852.0;
      phiAlignment = 0.909;
      chineseEquivalent = "Shi (時) - Time, Timing, Opportunity";
      indianEquivalent = "Kala (काल) - Time, Moment, Death";
      hebrewEquivalent = "Et (עת) - Time, Season, Proper moment";
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // EXTENDED MODES: Beyond the Greek Trinity
  // ═══════════════════════════════════════════════════════════════════════════

  /// Extended rhetorical/communication modes
  public func telos() : RhetoricalElement {
    {
      id = "telos";
      greekName = "τέλος";
      meaning = "Purpose, end, goal, completion";
      domain = "ORIENTATION - where is this going?";
      mechanism = "Persuades through PURPOSE and DIRECTION. Shows the goal.";
      appeals = [
        "To purpose",
        "To vision",
        "To outcome",
        "To meaning",
        "To completion"
      ];
      techniques = [
        "Paint the vision",
        "Show the endpoint",
        "Connect to meaning",
        "Demonstrate purpose",
        "Promise completion"
      ];
      brainRegion = "Prefrontal Cortex (right) - goal orientation";
      organismFunction = "Sets direction, defines purpose, maintains goal focus";
      cplMapping = "CPL.PURPOSE(vision: DEFINED, direction: CLEAR, outcome: ACHIEVABLE)";
      chakraCorrespondence = 7;  // Crown - highest purpose
      frequency = 963.0;
      phiAlignment = 1.0;
      chineseEquivalent = "Zhi (志) - Will, Purpose, Intention";
      indianEquivalent = "Sankalpa (संकल्प) - Intention, Vow";
      hebrewEquivalent = "Kavvanah (כוונה) - Intention, Direction";
    };
  };

  public func mythos() : RhetoricalElement {
    {
      id = "mythos";
      greekName = "μῦθος";
      meaning = "Story, myth, narrative, plot";
      domain = "MEMORY - what story carries this?";
      mechanism = "Persuades through NARRATIVE and STORY. Creates meaning.";
      appeals = [
        "To narrative",
        "To archetype",
        "To cultural memory",
        "To shared stories",
        "To meaning-making"
      ];
      techniques = [
        "Tell the story",
        "Invoke archetypes",
        "Create narrative",
        "Build plot",
        "Use myth structures"
      ];
      brainRegion = "Default Mode Network - narrative processing";
      organismFunction = "Stores in story, retrieves through narrative, encodes in myth";
      cplMapping = "CPL.NARRATIVE(input: CONTENT, structure: STORY, encode: ARCHETYPAL)";
      chakraCorrespondence = 3;  // Solar Plexus - personal narrative
      frequency = 417.0;
      phiAlignment = 0.714;
      chineseEquivalent = "Gu Shi (故事) - Story, Narrative";
      indianEquivalent = "Katha (कथा) - Story, Narrative";
      hebrewEquivalent = "Aggadah (אגדה) - Story, Legend";
    };
  };

  public func topos() : RhetoricalElement {
    {
      id = "topos";
      greekName = "τόπος";
      meaning = "Place, common place, topic, argument form";
      domain = "FIELD - what space does this occupy?";
      mechanism = "Persuades through COMMON GROUND and SHARED SPACE.";
      appeals = [
        "To common ground",
        "To shared assumptions",
        "To familiar territory",
        "To cultural place",
        "To accepted premises"
      ];
      techniques = [
        "Find common ground",
        "Use familiar forms",
        "Reference shared knowledge",
        "Build from accepted premises",
        "Create shared space"
      ];
      brainRegion = "Parietal Lobe - spatial reasoning";
      organismFunction = "Establishes shared field, creates common space";
      cplMapping = "CPL.FIELD(shared: TRUE, common_ground: ESTABLISHED, space: CREATED)";
      chakraCorrespondence = 1;  // Root - grounding
      frequency = 396.0;
      phiAlignment = 0.5;
      chineseEquivalent = "Di (地) - Earth, Place, Ground";
      indianEquivalent = "Kshetra (क्षेत्र) - Field, Place";
      hebrewEquivalent = "Makom (מקום) - Place";
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ALL RHETORICAL ELEMENTS
  // ═══════════════════════════════════════════════════════════════════════════

  public func obtinere_allelements() : [RhetoricalElement] {
    [
      logos(),
      ethos(),
      pathos(),
      kairos(),
      telos(),
      mythos(),
      topos()
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ORGANISM INTEGRATION: How to use in the organism
  // ═══════════════════════════════════════════════════════════════════════════

  /// Communication analysis result
  public type CommunicationAnalysis = {
    text : Text;
    logosScore : Float;            // How logical/structured
    ethosScore : Float;            // How credible/authoritative
    pathosScore : Float;           // How emotional/resonant
    kairosScore : Float;           // How timely/appropriate
    dominantMode : RhetoricalMode;
    recommendations : [Text];
    cplPattern : Text;
  };

  /// Balanced communication template
  public type BalancedCommunication = {
    purpose : Text;                // What are we trying to achieve?
    
    // The trinity
    logosComponent : Text;         // The logical argument
    ethosComponent : Text;         // The credibility establishment
    pathosComponent : Text;        // The emotional connection
    
    // The extensions
    kairosComponent : Text;        // The timing consideration
    telosComponent : Text;         // The purpose/vision
    mythosComponent : Text;        // The story/narrative
    toposComponent : Text;         // The common ground
    
    combinedMessage : Text;        // Everything integrated
    frequency : Float;
  };

  /// Create balanced communication
  public func createBalancedCommunication(
    purpose : Text,
    logical : Text,
    credible : Text,
    emotional : Text
  ) : BalancedCommunication {
    {
      purpose = purpose;
      logosComponent = logical;
      ethosComponent = credible;
      pathosComponent = emotional;
      kairosComponent = "Consider timing of delivery";
      telosComponent = purpose;
      mythosComponent = "Frame within larger story";
      toposComponent = "Find common ground first";
      combinedMessage = ethosComponent # " " # logosComponent # " " # pathosComponent;
      frequency = 432.0;  // Harmonious frequency
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CPL PATTERNS FOR RHETORICAL MODES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get CPL pattern for communication
  public func getCPLForRhetoric(mode : RhetoricalMode) : Text {
    switch (mode) {
      case (#Logos) "CPL.COMMUNICATE(mode: LOGICAL, structure: ORDERED, evidence: PROVIDED)";
      case (#Ethos) "CPL.COMMUNICATE(mode: CREDIBLE, trust: ESTABLISHED, authority: VERIFIED)";
      case (#Pathos) "CPL.COMMUNICATE(mode: EMOTIONAL, connection: CREATED, resonance: TRUE)";
      case (#Kairos) "CPL.COMMUNICATE(mode: TIMELY, moment: RIGHT, context: CONSIDERED)";
    };
  };

  /// Get integrated CPL pattern
  public func obtinere_integratedcpl() : Text {
    "CPL.COMMUNICATE(logos: STRUCTURED, ethos: VERIFIED, pathos: RESONANT, kairos: TIMED, telos: PURPOSEFUL, mythos: STORIED, topos: GROUNDED)";
  };
};
