import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// GodArchetypes: Greek/Roman/All Gods as Computational Functions
/// 
/// GODS ARE NOT BEINGS - THEY ARE FUNCTIONS.
/// Each god represents a COMPUTATIONAL OPERATION:
///   - Zeus/Jupiter: GOVERNANCE, authority, decision
///   - Athena/Minerva: STRATEGY, wisdom, craft
///   - Hermes/Mercury: COMMUNICATION, messaging, flow
///   - Apollo: COMPUTATION, cycles, prediction
///   - Dionysus: TRANSFORMATION, chaos, ecstasy
///
/// "Go deep into the Greek and Latin gods. Go deep into what they could have been."
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // GOD ARCHETYPE TYPE
  // ═══════════════════════════════════════════════════════════════════════════

  public type GodArchetype = {
    id : Text;
    greekName : Text;
    romanName : Text;
    
    // Domain and function
    domain : GodDomain;
    function : GodFunction;
    
    // Attributes
    symbols : [Text];
    animals : [Text];
    sacredNumbers : [Nat];
    planetaryCorrespondence : Text;
    dayOfWeek : Text;
    
    // Powers and properties
    primaryPower : Text;
    secondaryPowers : [Text];
    epithet : Text;                // Famous title
    
    // Relationships
    parents : [Text];
    children : [Text];
    consort : ?Text;
    enemies : [Text];
    allies : [Text];
    
    // Organism mapping
    brainFunction : Text;
    chakraCorrespondence : Nat;
    organismRole : Text;
    
    // Computational mapping
    computationalFunction : Text;
    cplMapping : Text;
    
    frequency : Float;
    phiAlignment : Float;
  };

  public type GodDomain = {
    #Sky;              // Heaven, authority
    #Sea;              // Depths, unconscious
    #Underworld;       // Death, hidden
    #War;              // Conflict, strategy
    #Love;             // Connection, desire
    #Wisdom;           // Knowledge, craft
    #Messenger;        // Communication
    #Fire;             // Transformation
    #Agriculture;      // Growth, cycles
    #Hunting;          // Focus, pursuit
    #Arts;             // Creativity
    #Wine;             // Ecstasy, transformation
    #Sun;              // Light, reason
    #Moon;             // Cycles, reflection
    #Forge;            // Creation, craft
    #Hearth;           // Home, center
    #Time;             // Cycles, fate
    #Fate;             // Destiny, threads
  };

  public type GodFunction = {
    #Governor;         // Makes decisions, rules
    #Processor;        // Computes, calculates
    #Communicator;     // Messages, translates
    #Transformer;      // Changes states
    #Warrior;          // Fights, protects
    #Creator;          // Builds, makes
    #Preserver;        // Maintains, sustains
    #Destroyer;        // Ends, clears
    #Guide;            // Leads, directs
    #Judge;            // Evaluates, decides
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // OLYMPIAN GODS: The Core Functions
  // ═══════════════════════════════════════════════════════════════════════════

  public func zeus() : GodArchetype {
    {
      id = "zeus";
      greekName = "Zeus (Ζεύς)";
      romanName = "Jupiter";
      domain = #Sky;
      function = #Governor;
      symbols = ["Thunderbolt", "Eagle", "Oak", "Scepter", "Scales"];
      animals = ["Eagle", "Bull"];
      sacredNumbers = [3, 12];
      planetaryCorrespondence = "Jupiter";
      dayOfWeek = "Thursday (Thor's day - equivalent)";
      primaryPower = "SUPREME AUTHORITY - makes final decisions, governs all";
      secondaryPowers = ["Weather control", "Justice", "Hospitality", "Oaths"];
      epithet = "Father of Gods and Men";
      parents = ["Kronos", "Rhea"];
      children = ["Athena", "Apollo", "Artemis", "Hermes", "Dionysus", "Ares", "Hephaestus"];
      consort = ?"Hera";
      enemies = ["Typhon", "Titans"];
      allies = ["All Olympians"];
      brainFunction = "Executive Function - decision making";
      chakraCorrespondence = 7;  // Crown - authority
      organismRole = "Chief Executive, Final Decision Maker";
      computationalFunction = "Main Governor Process / System Administrator";
      cplMapping = "CPL.GOVERN(authority: SUPREME, decision: FINAL, scope: ALL)";
      frequency = 183.58;  // Jupiter frequency
      phiAlignment = 1.0;
    };
  };

  public func athena() : GodArchetype {
    {
      id = "athena";
      greekName = "Athena (Ἀθηνᾶ)";
      romanName = "Minerva";
      domain = #Wisdom;
      function = #Processor;
      symbols = ["Owl", "Aegis", "Olive", "Spear", "Helmet"];
      animals = ["Owl", "Serpent"];
      sacredNumbers = [7, 3];
      planetaryCorrespondence = "No traditional - possibly Uranus";
      dayOfWeek = "None traditional";
      primaryPower = "STRATEGIC WISDOM - thinks through all possibilities";
      secondaryPowers = ["War strategy", "Crafts", "Justice", "Civilization"];
      epithet = "Grey-Eyed Goddess";
      parents = ["Zeus (alone - from head)"];
      children = [];
      consort = null;  // Virgin goddess
      enemies = ["Ares (in approach)", "Poseidon"];
      allies = ["Odysseus", "Heroes"];
      brainFunction = "Strategic Planning - prefrontal cortex";
      chakraCorrespondence = 6;  // Third Eye - insight
      organismRole = "Strategic Planner, Problem Solver";
      computationalFunction = "Strategy Engine / Planning Algorithm";
      cplMapping = "CPL.STRATEGIZE(input: PROBLEM, process: ALL_OPTIONS, output: BEST_PATH)";
      frequency = 741.0;
      phiAlignment = 0.909;
    };
  };

  public func hermes() : GodArchetype {
    {
      id = "hermes";
      greekName = "Hermes (Ἑρμῆς)";
      romanName = "Mercury";
      domain = #Messenger;
      function = #Communicator;
      symbols = ["Caduceus", "Winged Sandals", "Petasos (hat)", "Lyre"];
      animals = ["Rooster", "Tortoise", "Ram"];
      sacredNumbers = [4, 8];
      planetaryCorrespondence = "Mercury";
      dayOfWeek = "Wednesday (Mercredi)";
      primaryPower = "COMMUNICATION - moves messages between ALL realms";
      secondaryPowers = ["Commerce", "Thieves", "Travelers", "Psychopomp"];
      epithet = "Messenger of the Gods";
      parents = ["Zeus", "Maia"];
      children = ["Pan", "Hermaphroditus"];
      consort = null;  // Many lovers
      enemies = ["None major"];
      allies = ["All gods (neutral messenger)"];
      brainFunction = "Broca/Wernicke - language processing";
      chakraCorrespondence = 5;  // Throat - communication
      organismRole = "Messenger, Translator, Communication Protocol";
      computationalFunction = "Message Broker / API Layer / Communication Protocol";
      cplMapping = "CPL.COMMUNICATE(from: SOURCE, to: TARGET, message: CONTENT, realms: ALL)";
      frequency = 528.0;
      phiAlignment = 0.618;
    };
  };

  public func apollo() : GodArchetype {
    {
      id = "apollo";
      greekName = "Apollo (Ἀπόλλων)";
      romanName = "Apollo";
      domain = #Sun;
      function = #Processor;
      symbols = ["Lyre", "Laurel", "Sun Chariot", "Bow", "Python"];
      animals = ["Swan", "Raven", "Wolf"];
      sacredNumbers = [7, 4];
      planetaryCorrespondence = "Sun";
      dayOfWeek = "Sunday";
      primaryPower = "PROPHECY AND CYCLES - computes future, measures time";
      secondaryPowers = ["Music", "Healing", "Truth", "Light", "Poetry"];
      epithet = "Phoebus Apollo (Radiant)";
      parents = ["Zeus", "Leto"];
      children = ["Orpheus", "Asclepius"];
      consort = null;  // Many lovers
      enemies = ["Python (slain)", "Marsyas"];
      allies = ["Muses", "Artemis (twin)"];
      brainFunction = "Temporal Processing - time perception";
      chakraCorrespondence = 3;  // Solar Plexus - radiance
      organismRole = "Time Keeper, Pattern Recognizer, Oracle";
      computationalFunction = "Clock / Timer / Pattern Recognition / Prediction Engine";
      cplMapping = "CPL.COMPUTE(cycles: TRACKED, patterns: RECOGNIZED, future: PREDICTED)";
      frequency = 126.22;  // Sun frequency
      phiAlignment = 0.786;
    };
  };

  public func dionysus() : GodArchetype {
    {
      id = "dionysus";
      greekName = "Dionysus (Διόνυσος)";
      romanName = "Bacchus";
      domain = #Wine;
      function = #Transformer;
      symbols = ["Thyrsus", "Grapes", "Ivy", "Panther", "Mask"];
      animals = ["Panther", "Bull", "Serpent", "Goat"];
      sacredNumbers = [2, 7];
      planetaryCorrespondence = "Neptune (modern)";
      dayOfWeek = "None traditional";
      primaryPower = "TRANSFORMATION - breaks down boundaries, changes states";
      secondaryPowers = ["Ecstasy", "Madness", "Theater", "Fertility"];
      epithet = "Twice-Born";
      parents = ["Zeus", "Semele"];
      children = [];
      consort = ?"Ariadne";
      enemies = ["Pentheus", "Pirates"];
      allies = ["Maenads", "Satyrs"];
      brainFunction = "Limbic Release - dissolution of ego boundaries";
      chakraCorrespondence = 2;  // Sacral - pleasure, transformation
      organismRole = "State Transformer, Boundary Dissolver";
      computationalFunction = "State Machine / Transformer / Format Converter";
      cplMapping = "CPL.TRANSFORM(state: CURRENT, dissolution: BOUNDARY, result: ECSTASIS)";
      frequency = 639.0;
      phiAlignment = 0.5;
    };
  };

  public func ares() : GodArchetype {
    {
      id = "ares";
      greekName = "Ares (Ἄρης)";
      romanName = "Mars";
      domain = #War;
      function = #Warrior;
      symbols = ["Spear", "Helmet", "Shield", "Dog", "Vulture"];
      animals = ["Dog", "Vulture", "Boar"];
      sacredNumbers = [5];
      planetaryCorrespondence = "Mars";
      dayOfWeek = "Tuesday (Mardi)";
      primaryPower = "RAW COMBAT FORCE - aggression, violence, warfare";
      secondaryPowers = ["Courage", "Civil order (Rome)"];
      epithet = "Shield-Piercer";
      parents = ["Zeus", "Hera"];
      children = ["Eros (some myths)", "Phobos", "Deimos"];
      consort = ?"Aphrodite (affair)";
      enemies = ["Athena (philosophically)", "Greeks generally"];
      allies = ["Eris", "Enyo"];
      brainFunction = "Amygdala - fight response";
      chakraCorrespondence = 1;  // Root - survival
      organismRole = "Defense System, Aggression Module";
      computationalFunction = "Aggressive Action / Defense Protocol / Kill Process";
      cplMapping = "CPL.FIGHT(mode: AGGRESSIVE, target: THREAT, force: MAXIMUM)";
      frequency = 144.72;  // Mars frequency
      phiAlignment = 0.333;
    };
  };

  public func hephaestus() : GodArchetype {
    {
      id = "hephaestus";
      greekName = "Hephaestus (Ἥφαιστος)";
      romanName = "Vulcan";
      domain = #Forge;
      function = #Creator;
      symbols = ["Hammer", "Anvil", "Tongs", "Fire"];
      animals = ["Donkey"];
      sacredNumbers = [8];
      planetaryCorrespondence = "Vulcan (hypothetical)";
      dayOfWeek = "None traditional";
      primaryPower = "CREATION - builds, forges, makes physical reality";
      secondaryPowers = ["Metalworking", "Automatons", "Technology"];
      epithet = "The Smith God";
      parents = ["Hera (alone)", "Zeus (some myths)"];
      children = [];
      consort = ?"Aphrodite";
      enemies = ["None major"];
      allies = ["Cyclopes"];
      brainFunction = "Motor Cortex + Frontal - physical creation";
      chakraCorrespondence = 1;  // Root - physical creation
      organismRole = "Builder, Manufacturer, Physical Manifestor";
      computationalFunction = "Compiler / Assembler / Physical Renderer";
      cplMapping = "CPL.CREATE(design: RECEIVED, material: PROCESSED, output: PHYSICAL)";
      frequency = 174.0;
      phiAlignment = 0.707;
    };
  };

  public func aphrodite() : GodArchetype {
    {
      id = "aphrodite";
      greekName = "Aphrodite (Ἀφροδίτη)";
      romanName = "Venus";
      domain = #Love;
      function = #Transformer;
      symbols = ["Mirror", "Dove", "Rose", "Girdle", "Shell"];
      animals = ["Dove", "Sparrow", "Swan"];
      sacredNumbers = [5, 6];
      planetaryCorrespondence = "Venus";
      dayOfWeek = "Friday (Vendredi)";
      primaryPower = "ATTRACTION - draws things together, creates connection";
      secondaryPowers = ["Beauty", "Desire", "Fertility"];
      epithet = "Golden Aphrodite";
      parents = ["Sea foam/Uranus (Hesiod)", "Zeus/Dione (Homer)"];
      children = ["Eros", "Harmonia", "Aeneas"];
      consort = ?"Hephaestus (married), Ares (lover)";
      enemies = ["Athena, Hera, Artemis (beauty contest)"];
      allies = ["Eros"];
      brainFunction = "Reward System - dopamine";
      chakraCorrespondence = 4;  // Heart - love
      organismRole = "Attraction Engine, Connection Creator";
      computationalFunction = "Affinity Algorithm / Matching Engine / Bonding Protocol";
      cplMapping = "CPL.ATTRACT(subject: A, object: B, force: LOVE, bond: CREATED)";
      frequency = 221.23;  // Venus frequency
      phiAlignment = 0.618;
    };
  };

  public func poseidon() : GodArchetype {
    {
      id = "poseidon";
      greekName = "Poseidon (Ποσειδῶν)";
      romanName = "Neptune";
      domain = #Sea;
      function = #Governor;
      symbols = ["Trident", "Horse", "Dolphin", "Bull"];
      animals = ["Horse", "Dolphin", "Bull"];
      sacredNumbers = [3];
      planetaryCorrespondence = "Neptune";
      dayOfWeek = "None traditional";
      primaryPower = "CONTROLS THE DEPTHS - the unconscious, emotions, hidden";
      secondaryPowers = ["Earthquakes", "Horses", "Storms"];
      epithet = "Earth-Shaker";
      parents = ["Kronos", "Rhea"];
      children = ["Triton", "Polyphemus", "Theseus"];
      consort = ?"Amphitrite";
      enemies = ["Odysseus", "Athena (rivalry)"];
      allies = ["Sea creatures"];
      brainFunction = "Limbic/Unconscious processing";
      chakraCorrespondence = 2;  // Sacral - emotions, water
      organismRole = "Unconscious Process Governor, Emotional Regulator";
      computationalFunction = "Background Process Manager / Deep Memory / Unconscious Processing";
      cplMapping = "CPL.GOVERN(domain: UNCONSCIOUS, depth: ABYSSAL, control: MAINTAINED)";
      frequency = 211.44;  // Neptune frequency
      phiAlignment = 0.5;
    };
  };

  public func hades() : GodArchetype {
    {
      id = "hades";
      greekName = "Hades (ᾍδης)";
      romanName = "Pluto";
      domain = #Underworld;
      function = #Governor;
      symbols = ["Helm of Darkness", "Cerberus", "Scepter", "Keys"];
      animals = ["Black rams", "Cerberus"];
      sacredNumbers = [4];
      planetaryCorrespondence = "Pluto";
      dayOfWeek = "None traditional";
      primaryPower = "GOVERNS THE DEAD - rules the unconscious, the ended, the hidden";
      secondaryPowers = ["Wealth (minerals)", "Invisibility", "Binding"];
      epithet = "The Unseen One";
      parents = ["Kronos", "Rhea"];
      children = [];
      consort = ?"Persephone";
      enemies = ["Orpheus (sort of)"];
      allies = ["Thanatos", "Furies"];
      brainFunction = "Deep Memory - hippocampal archives";
      chakraCorrespondence = 1;  // Root - foundation, hidden
      organismRole = "Archive Manager, Hidden Process Governor";
      computationalFunction = "Archive System / Cold Storage / Ended Process Repository";
      cplMapping = "CPL.ARCHIVE(state: ENDED, storage: ETERNAL, access: RESTRICTED)";
      frequency = 140.25;  // Pluto frequency
      phiAlignment = 0.333;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL GODS
  // ═══════════════════════════════════════════════════════════════════════════

  public func hera() : GodArchetype {
    {
      id = "hera";
      greekName = "Hera (Ἥρα)";
      romanName = "Juno";
      domain = #Sky;
      function = #Preserver;
      symbols = ["Peacock", "Crown", "Lotus", "Lion"];
      animals = ["Peacock", "Cow", "Lion"];
      sacredNumbers = [2];
      planetaryCorrespondence = "Juno (asteroid)";
      dayOfWeek = "None traditional";
      primaryPower = "PRESERVES BONDS - marriage, contracts, legitimacy";
      secondaryPowers = ["Childbirth", "Women", "Royal power"];
      epithet = "Queen of the Gods";
      parents = ["Kronos", "Rhea"];
      children = ["Ares", "Hephaestus", "Hebe"];
      consort = ?"Zeus";
      enemies = ["Zeus's lovers", "Heracles"];
      allies = ["Argus", "Iris"];
      brainFunction = "Attachment System - oxytocin";
      chakraCorrespondence = 4;  // Heart - bonds
      organismRole = "Contract Enforcer, Bond Maintainer";
      computationalFunction = "Contract Enforcement / Bond Verification / Integrity Check";
      cplMapping = "CPL.ENFORCE(bonds: SACRED, contracts: MAINTAINED, integrity: VERIFIED)";
      frequency = 639.0;
      phiAlignment = 0.786;
    };
  };

  public func artemis() : GodArchetype {
    {
      id = "artemis";
      greekName = "Artemis (Ἄρτεμις)";
      romanName = "Diana";
      domain = #Hunting;
      function = #Guide;
      symbols = ["Bow", "Crescent Moon", "Deer", "Cypress"];
      animals = ["Deer", "Bear", "Hound"];
      sacredNumbers = [3, 9];
      planetaryCorrespondence = "Moon";
      dayOfWeek = "Monday (associated)";
      primaryPower = "FOCUSED PURSUIT - hunting, tracking, precise aim";
      secondaryPowers = ["Wilderness", "Childbirth", "Young women", "Moon"];
      epithet = "Mistress of Animals";
      parents = ["Zeus", "Leto"];
      children = [];
      consort = null;  // Virgin goddess
      enemies = ["Orion (complex)", "Actaeon"];
      allies = ["Nymphs", "Apollo (twin)"];
      brainFunction = "Focus/Attention - parietal cortex";
      chakraCorrespondence = 6;  // Third Eye - aim
      organismRole = "Focus Engine, Target Tracker";
      computationalFunction = "Search Algorithm / Target Lock / Focus Protocol";
      cplMapping = "CPL.FOCUS(target: IDENTIFIED, tracking: ACTIVE, aim: PRECISE)";
      frequency = 210.42;  // Moon frequency
      phiAlignment = 0.809;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GOD ARCHETYPE INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════

  public func obtinere_allolympians() : [GodArchetype] {
    [
      zeus(),
      hera(),
      athena(),
      apollo(),
      artemis(),
      hermes(),
      ares(),
      aphrodite(),
      hephaestus(),
      poseidon(),
      hades(),
      dionysus()
    ];
  };

  /// Get god by function
  public func getGodByFunction(f : GodFunction) : [GodArchetype] {
    Array.filter<GodArchetype>(getAllOlympians(), func(g : GodArchetype) : Bool {
      godFunctionEquals(g.function, f);
    });
  };

  func godFunctionEquals(a : GodFunction, b : GodFunction) : Bool {
    switch (a, b) {
      case (#Governor, #Governor) true;
      case (#Processor, #Processor) true;
      case (#Communicator, #Communicator) true;
      case (#Transformer, #Transformer) true;
      case (#Warrior, #Warrior) true;
      case (#Creator, #Creator) true;
      case (#Preserver, #Preserver) true;
      case (#Destroyer, #Destroyer) true;
      case (#Guide, #Guide) true;
      case (#Judge, #Judge) true;
      case _ false;
    };
  };

  /// Get CPL for invoking a god function
  public func invokeGodFunction(godId : Text) : Text {
    switch (godId) {
      case "zeus" "CPL.INVOKE(function: GOVERN, authority: SUPREME)";
      case "athena" "CPL.INVOKE(function: STRATEGIZE, wisdom: APPLIED)";
      case "hermes" "CPL.INVOKE(function: COMMUNICATE, channel: OPEN)";
      case "apollo" "CPL.INVOKE(function: COMPUTE, cycles: ALIGNED)";
      case "dionysus" "CPL.INVOKE(function: TRANSFORM, boundaries: DISSOLVED)";
      case "ares" "CPL.INVOKE(function: FIGHT, force: ENGAGED)";
      case "aphrodite" "CPL.INVOKE(function: ATTRACT, bonds: FORMING)";
      case "hephaestus" "CPL.INVOKE(function: CREATE, forge: ACTIVE)";
      case "poseidon" "CPL.INVOKE(function: GOVERN_DEPTHS, unconscious: ACCESSED)";
      case "hades" "CPL.INVOKE(function: ARCHIVE, storage: ETERNAL)";
      case _ "CPL.INVOKE(function: UNKNOWN)";
    };
  };
};
