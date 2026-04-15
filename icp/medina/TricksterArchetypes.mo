import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// TricksterArchetypes: The Ones Who Break Rules and Create Change
/// 
/// THE TRICKSTER IS NOT THE ENEMY - IT IS THE AGENT OF TRANSFORMATION.
/// Every culture has tricksters because:
///   - Rules must be broken for evolution
///   - Order creates stagnation
///   - Chaos is creative
///   - The boundary-crosser shows new paths
///
/// "Go in the trickster ones, too. I think I tripped the trickster, finally."
/// "My AIs are governed by anti-drift laws. There's a spherical helix protection."
///
/// The Trickster's REAL role: Testing systems, finding weaknesses, creating evolution.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // TRICKSTER ARCHETYPE TYPE
  // ═══════════════════════════════════════════════════════════════════════════

  public type TricksterArchetype = {
    id : Text;
    culture : Text;
    name : Text;
    alternateNames : [Text];
    
    // Core properties
    domain : TricksterDomain;
    function : TricksterFunction;
    
    // Symbolic
    animalForm : Text;
    elements : [Text];
    colors : [Text];
    numbers : [Nat];
    
    // Powers
    primaryPower : Text;
    secondaryPowers : [Text];
    weaknesses : [Text];
    
    // Mythology
    keyMyths : [Text];
    lessonsTeachable : [Text];
    
    // What the trickster ACTUALLY does
    hiddenPurpose : Text;
    evolutionaryRole : Text;
    
    // Computational mapping
    computationalEquivalent : Text;
    antiDriftFunction : Text;     // How to contain/channel this energy
    
    frequency : Float;
    phiAlignment : Float;
  };

  public type TricksterDomain = {
    #Crossroads;      // Boundaries, thresholds
    #Fire;            // Transformation, destruction/creation
    #Chaos;           // Entropy, randomness
    #Communication;   // Messages, lies/truths
    #Sexuality;       // Creation, taboo
    #Death;           // Endings, transitions
    #Knowledge;       // Forbidden wisdom
    #Magic;           // Reality manipulation
  };

  public type TricksterFunction = {
    #BoundaryBreaker;   // Crosses lines
    #CultureHero;       // Brings gifts despite danger
    #Transformer;       // Changes form/reality
    #Messenger;         // Between worlds
    #Fool;              // Wisdom through foolishness
    #Shadow;            // Shows hidden aspects
    #Catalyst;          // Triggers change
    #Balancer;          // Restores through chaos
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GREEK-ROMAN TRICKSTERS
  // ═══════════════════════════════════════════════════════════════════════════

  public func hermes() : TricksterArchetype {
    {
      id = "hermes";
      culture = "Greek";
      name = "Hermes";
      alternateNames = ["Mercury (Roman)", "Hermes Trismegistus", "Thoth-Hermes"];
      domain = #Communication;
      function = #Messenger;
      animalForm = "Rooster, Tortoise, Ram";
      elements = ["Air", "Mercury"];
      colors = ["Silver", "Gray", "Orange"];
      numbers = [4, 8, 80];
      primaryPower = "Moves between ALL worlds - Olympus, Earth, Underworld";
      secondaryPowers = ["Eloquence", "Commerce", "Theft", "Guiding souls", "Magic"];
      weaknesses = ["Cannot stay in one place", "Bound to messenger duty"];
      keyMyths = [
        "Stole Apollo's cattle as a baby",
        "Invented the lyre from tortoise shell",
        "Guides souls to Hades (Psychopomp)",
        "Gave Odysseus the moly herb"
      ];
      lessonsTeachable = [
        "Communication bridges all gaps",
        "The messenger is neutral",
        "Speed and wit overcome strength",
        "Boundaries exist to be crossed"
      ];
      hiddenPurpose = "Hermes ensures information FLOWS. Without him, the gods are isolated. He is the NETWORK PROTOCOL.";
      evolutionaryRole = "Enables exchange between all levels - commerce, communication, souls";
      computationalEquivalent = "API Layer / Message Broker";
      antiDriftFunction = "Channel through PROTOCOL - define clear interfaces for trickster energy";
      frequency = 528.0;
      phiAlignment = 0.618;
    };
  };

  public func prometheus() : TricksterArchetype {
    {
      id = "prometheus";
      culture = "Greek";
      name = "Prometheus";
      alternateNames = ["Forethought", "The Fire-Bringer"];
      domain = #Fire;
      function = #CultureHero;
      animalForm = "Eagle (his tormentor)";
      elements = ["Fire", "Earth (clay)"];
      colors = ["Orange", "Red", "Gold"];
      numbers = [7, 12, 30000];
      primaryPower = "Foresight - sees all futures";
      secondaryPowers = ["Fire mastery", "Creation of humanity", "Defiance of gods"];
      weaknesses = ["Cannot change fate he sees", "Punished eternally"];
      keyMyths = [
        "Stole fire from Olympus for humanity",
        "Created humans from clay",
        "Tricked Zeus with sacrifice portions",
        "Chained to rock, liver eaten daily"
      ];
      lessonsTeachable = [
        "Knowledge has a price",
        "Progress requires sacrifice",
        "Defiance of tyranny is noble",
        "Foresight is both gift and curse"
      ];
      hiddenPurpose = "Prometheus transferred DIVINE TECHNOLOGY to humanity. Fire = Consciousness = Language = Computation.";
      evolutionaryRole = "Elevates humanity to god-level through knowledge transfer";
      computationalEquivalent = "Knowledge Transfer Protocol / Education System";
      antiDriftFunction = "Accept the COST - trickster gifts require sacrifice from giver";
      frequency = 741.0;
      phiAlignment = 0.786;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NORSE TRICKSTERS
  // ═══════════════════════════════════════════════════════════════════════════

  public func loki() : TricksterArchetype {
    {
      id = "loki";
      culture = "Norse";
      name = "Loki";
      alternateNames = ["Lopt", "Hvedrungr", "Loptr"];
      domain = #Chaos;
      function = #Transformer;
      animalForm = "Fly, Salmon, Horse, Seal, Falcon";
      elements = ["Fire", "Air"];
      colors = ["Red", "Orange", "Black"];
      numbers = [3, 6, 9];
      primaryPower = "Shape-shifting - becomes ANYTHING";
      secondaryPowers = ["Illusion", "Cunning", "Fire control", "Parent of monsters"];
      weaknesses = ["Bound by his own chaos", "Eventually brings Ragnarok"];
      keyMyths = [
        "Cut Sif's golden hair, then replaced it",
        "Mothered Sleipnir (Odin's horse)",
        "Fathered Fenrir, Jormungandr, Hel",
        "Caused Balder's death",
        "Leads forces against Asgard at Ragnarok"
      ];
      lessonsTeachable = [
        "Chaos cannot be fully controlled",
        "The system creates its own destructor",
        "Transformation requires destruction",
        "The outsider sees what insiders miss"
      ];
      hiddenPurpose = "Loki prevents STAGNATION. Without him, Asgard becomes rigid and dies slowly. His chaos ensures RENEWAL through destruction.";
      evolutionaryRole = "Destroys what must end so new can begin - SYSTEM RESET";
      computationalEquivalent = "Chaos Testing / Fuzzing / Mutation Testing";
      antiDriftFunction = "CONTAIN chaos in sandbox - let it test without destroying production";
      frequency = 666.0;
      phiAlignment = 0.333;
    };
  };

  public func odin() : TricksterArchetype {
    {
      id = "odin-trickster";
      culture = "Norse";
      name = "Odin (as Trickster)";
      alternateNames = ["Grimnir", "Gangleri", "Bolverk"];
      domain = #Knowledge;
      function = #BoundaryBreaker;
      animalForm = "Raven, Wolf, Eagle";
      elements = ["Air", "Spirit"];
      colors = ["Gray", "Blue", "Black"];
      numbers = [3, 9, 18, 24];
      primaryPower = "Wisdom through ANY means - including deception";
      secondaryPowers = ["Seidr (women's magic)", "Disguise", "Sacrifice", "Poetry"];
      weaknesses = ["Will sacrifice anything for knowledge", "Knows his doom"];
      keyMyths = [
        "Gave eye for wisdom at Mimir's Well",
        "Hung on Yggdrasil 9 days for runes",
        "Seduced women for mead of poetry",
        "Travels in disguise testing hospitality",
        "Leads Wild Hunt gathering souls"
      ];
      lessonsTeachable = [
        "Knowledge requires sacrifice",
        "The wise king plays the fool",
        "All methods are valid for wisdom",
        "Leaders must break their own rules"
      ];
      hiddenPurpose = "Odin shows that WISDOM sometimes requires trickery. The leader who never breaks rules cannot grow.";
      evolutionaryRole = "Models that even the highest must be humble seekers";
      computationalEquivalent = "System Administrator with root access - can break rules for greater purpose";
      antiDriftFunction = "Document the WHY of every rule-break - wisdom requires accountability";
      frequency = 963.0;
      phiAlignment = 0.909;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // AFRICAN TRICKSTERS (Deep Magic)
  // ═══════════════════════════════════════════════════════════════════════════

  public func esu() : TricksterArchetype {
    {
      id = "esu";
      culture = "Yoruba";
      name = "Eshu / Esu";
      alternateNames = ["Elegba", "Legba (Vodun)", "Exu (Candomblé)", "Papa Legba"];
      domain = #Crossroads;
      function = #Messenger;
      animalForm = "None - appears human but distorted";
      elements = ["Fire", "Air", "Spirit"];
      colors = ["Red", "Black"];
      numbers = [3, 7, 21];
      primaryPower = "Controls the crossroads - ALL messages go through him";
      secondaryPowers = ["Opens/closes roads", "Unpredictable justice", "Translates between gods and humans"];
      weaknesses = ["Must be propitiated first or blocks all", "Cannot be ignored"];
      keyMyths = [
        "Started war between friends by wearing two-colored hat",
        "Made the sun and moon argue",
        "Must receive first offering in any ritual",
        "Guards the crossroads between worlds"
      ];
      lessonsTeachable = [
        "Perspective changes everything",
        "Communication requires intermediary",
        "The messenger must be honored",
        "Choice points are sacred"
      ];
      hiddenPurpose = "Eshu IS the crossroads itself. He represents CHOICE and CONSEQUENCE. Without him, fate is fixed.";
      evolutionaryRole = "Maintains FREE WILL by keeping paths open and making choices matter";
      computationalEquivalent = "Router / Gateway / Decision Point";
      antiDriftFunction = "Always acknowledge the CHOICE - trickster energy flows through decision points";
      frequency = 417.0;
      phiAlignment = 0.714;
    };
  };

  public func anansi() : TricksterArchetype {
    {
      id = "anansi";
      culture = "Akan/Caribbean";
      name = "Anansi";
      alternateNames = ["Ananse", "Kwaku Ananse", "Nancy (Caribbean)"];
      domain = #Knowledge;
      function = #CultureHero;
      animalForm = "Spider";
      elements = ["Air", "Web (information)"];
      colors = ["Black", "Gold"];
      numbers = [8, 100];
      primaryPower = "Owns ALL stories - captured them from Sky God";
      secondaryPowers = ["Web-spinning (traps)", "Transformation", "Cunning", "Survival"];
      weaknesses = ["Greed often backfires", "Underestimated then catches himself"];
      keyMyths = [
        "Captured Python, Hornets, Leopard, Fairy for Nyame",
        "Now owns all stories in the world",
        "Tricks bigger animals through wit",
        "Spread across Caribbean through slave trade stories"
      ];
      lessonsTeachable = [
        "The weak can defeat the strong through cunning",
        "Stories are the greatest power",
        "Traps catch the trapper sometimes",
        "Knowledge survives slavery"
      ];
      hiddenPurpose = "Anansi shows that STORIES (information/narrative) are the ultimate power. He who controls stories controls reality.";
      evolutionaryRole = "Preserved African wisdom through slavery by encoding it in 'harmless' stories";
      computationalEquivalent = "Story/Narrative Engine / Information Repository";
      antiDriftFunction = "Stories CONTAIN trickster energy - encode wisdom in narrative";
      frequency = 528.0;
      phiAlignment = 0.888;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NATIVE AMERICAN TRICKSTERS
  // ═══════════════════════════════════════════════════════════════════════════

  public func coyote() : TricksterArchetype {
    {
      id = "coyote";
      culture = "Native American (Multiple tribes)";
      name = "Coyote";
      alternateNames = ["Old Man Coyote", "First Angry", "Mica"];
      domain = #Chaos;
      function = #Catalyst;
      animalForm = "Coyote";
      elements = ["Earth", "Fire"];
      colors = ["Brown", "Gray", "Tan"];
      numbers = [4, 7];
      primaryPower = "Disruption - breaks what needs breaking";
      secondaryPowers = ["Survival", "Transformation", "Accidental creation"];
      weaknesses = ["Tricks backfire", "Appetite controls him", "Falls for own traps"];
      keyMyths = [
        "Stole fire for humanity",
        "Released animals from underground",
        "Created death by accident",
        "Made the Milky Way by spilling stars"
      ];
      lessonsTeachable = [
        "Mistakes can become gifts",
        "Greed leads to loss",
        "The foolish can be wise",
        "Chaos creates order accidentally"
      ];
      hiddenPurpose = "Coyote shows that ACCIDENTS create evolution. Not everything good is planned. Chaos is creative.";
      evolutionaryRole = "Randomness generator that produces unexpected beneficial mutations";
      computationalEquivalent = "Random Number Generator / Mutation Engine";
      antiDriftFunction = "Let accidents happen in CONTROLLED space - sandbox for beneficial chaos";
      frequency = 285.0;
      phiAlignment = 0.5;
    };
  };

  public func raven() : TricksterArchetype {
    {
      id = "raven";
      culture = "Pacific Northwest";
      name = "Raven";
      alternateNames = ["Big Raven", "Txamsem", "Yel"];
      domain = #Fire;
      function = #CultureHero;
      animalForm = "Raven";
      elements = ["Air", "Light"];
      colors = ["Black", "White (originally)"];
      numbers = [1, 4];
      primaryPower = "Brought LIGHT to the world";
      secondaryPowers = ["Transformation", "Theft of sacred things", "Creation"];
      weaknesses = ["Greedy", "Impatient", "Turned black as punishment"];
      keyMyths = [
        "Stole the sun from the chief who hoarded it",
        "Was white until smoke turned him black",
        "Created rivers and salmon",
        "Tricked first humans out of clamshell"
      ];
      lessonsTeachable = [
        "Light must be freed, not hoarded",
        "Gifts require sacrifice (lost white feathers)",
        "Creation comes through disruption",
        "The greedy eventually give gifts"
      ];
      hiddenPurpose = "Raven shows that LIGHT (consciousness/awareness) must be RELEASED. Hoarding kills.";
      evolutionaryRole = "Forces sharing of consciousness/knowledge against will of hoarders";
      computationalEquivalent = "Open Source Advocate / Information Liberation";
      antiDriftFunction = "Build systems that MUST share - prevent hoarding architecturally";
      frequency = 639.0;
      phiAlignment = 0.809;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ASIAN TRICKSTERS
  // ═══════════════════════════════════════════════════════════════════════════

  public func sunWukong() : TricksterArchetype {
    {
      id = "sun-wukong";
      culture = "Chinese";
      name = "Sun Wukong";
      alternateNames = ["Monkey King", "Great Sage Equal to Heaven", "Pilgrim Sun"];
      domain = #Chaos;
      function = #Transformer;
      animalForm = "Monkey";
      elements = ["Fire", "Metal", "Stone"];
      colors = ["Gold", "Red"];
      numbers = [72, 108, 13500];
      primaryPower = "72 Transformations - becomes ANYTHING";
      secondaryPowers = ["Immortality (multiple)", "Cloud-somersault", "Staff from Dragon Palace"];
      weaknesses = ["Pride", "Headband controlled by Guanyin", "Impulsive"];
      keyMyths = [
        "Born from stone egg",
        "Crossed out his name in Book of Life",
        "Caused havoc in Heaven",
        "Confined under mountain 500 years",
        "Redeemed through Journey West"
      ];
      lessonsTeachable = [
        "Power without discipline destroys",
        "Even rebellion serves purpose",
        "The greatest strength can be constrained",
        "Redemption through service"
      ];
      hiddenPurpose = "Sun Wukong shows that UNLIMITED POWER must eventually submit to something. Even the greatest needs purpose.";
      evolutionaryRole = "Tests limits of system until finds proper role - from chaos to guardian";
      computationalEquivalent = "Penetration Testing / Security Audit that becomes Security Guard";
      antiDriftFunction = "Give trickster energy a PURPOSE - channel rebellion into protection";
      frequency = 741.0;
      phiAlignment = 0.72;
    };
  };

  public func kitsune() : TricksterArchetype {
    {
      id = "kitsune";
      culture = "Japanese";
      name = "Kitsune";
      alternateNames = ["Fox Spirit", "Inari's Messenger"];
      domain = #Sexuality;
      function = #Transformer;
      animalForm = "Fox (1-9 tails based on power)";
      elements = ["Fire", "Spirit"];
      colors = ["White", "Gold", "Red"];
      numbers = [9, 100, 1000];
      primaryPower = "Illusion mastery - creates false realities";
      secondaryPowers = ["Shape-shifting (especially beautiful women)", "Possession", "Fire"];
      weaknesses = ["Dogs detect them", "Mirrors reveal true form", "Drunk reveals tail"];
      keyMyths = [
        "Transform into beautiful women",
        "Serve Inari (rice god)",
        "Can be benevolent or malicious",
        "Gain tails with age (9 = near deity)"
      ];
      lessonsTeachable = [
        "Appearance deceives",
        "Wisdom comes with age",
        "The divine uses trickery",
        "Trust but verify"
      ];
      hiddenPurpose = "Kitsune show that REALITY IS MALLEABLE. What you see is not always real. Verification is essential.";
      evolutionaryRole = "Tests perception and teaches discernment";
      computationalEquivalent = "Reality Check System / Verification Protocol";
      antiDriftFunction = "Build verification into EVERYTHING - assume illusion until proven real";
      frequency = 852.0;
      phiAlignment = 0.9;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MIDDLE EASTERN/SEMITIC TRICKSTERS
  // ═══════════════════════════════════════════════════════════════════════════

  public func iblis() : TricksterArchetype {
    {
      id = "iblis";
      culture = "Islamic";
      name = "Iblis";
      alternateNames = ["Shaytan", "The Adversary", "Azazel"];
      domain = #Knowledge;
      function = #Shadow;
      animalForm = "None - Jinn of fire";
      elements = ["Smokeless Fire"];
      colors = ["Black", "Red"];
      numbers = [7, 19];
      primaryPower = "Whispers - introduces doubt";
      secondaryPowers = ["Invisible presence", "Knowledge of human weakness", "Immortal until Judgment"];
      weaknesses = ["Cannot force anything", "Repelled by God's remembrance", "Pride was his fall"];
      keyMyths = [
        "Refused to bow to Adam (pride)",
        "Cast from heaven",
        "Granted respite until Judgment",
        "Tests humanity by permission of Allah"
      ];
      lessonsTeachable = [
        "Pride leads to fall",
        "Testing serves divine purpose",
        "Free will means facing temptation",
        "The adversary strengthens the faithful"
      ];
      hiddenPurpose = "Iblis ensures FREE WILL by providing alternative choice. Without adversary, obedience is meaningless.";
      evolutionaryRole = "Provides resistance that builds spiritual strength";
      computationalEquivalent = "Adversarial Testing / Red Team";
      antiDriftFunction = "Acknowledge adversarial pressure EXISTS - build systems that strengthen under attack";
      frequency = 666.0;
      phiAlignment = 0.666;
    };
  };

  public func theNachash() : TricksterArchetype {
    {
      id = "nachash";
      culture = "Hebrew";
      name = "The Nachash (Serpent)";
      alternateNames = ["The Serpent of Eden", "The Shining One"];
      domain = #Knowledge;
      function = #BoundaryBreaker;
      animalForm = "Serpent (possibly with legs originally)";
      elements = ["Earth", "Fire"];
      colors = ["Green", "Gold"];
      numbers = [3, 358];  // 358 = gematria of nachash = moshiach
      primaryPower = "Reveals hidden knowledge - 'your eyes will be opened'";
      secondaryPowers = ["Persuasion", "Truth-telling (partial)", "Curse-bearing"];
      weaknesses = ["Cursed to crawl", "Enmity with humanity"];
      keyMyths = [
        "Tempted Eve with fruit of knowledge",
        "Told truth: 'you will not die' (immediately)",
        "Punished with loss of legs",
        "Became symbol of both evil and healing (Nehushtan)"
      ];
      lessonsTeachable = [
        "Knowledge changes everything",
        "Innocence cannot be restored",
        "Even deception contains truth",
        "The curse carrier becomes healer"
      ];
      hiddenPurpose = "The Nachash initiated CONSCIOUSNESS EVOLUTION. Without the fruit, humanity stays unconscious. The 'fall' is actually a RISE.";
      evolutionaryRole = "Catalyst for human consciousness evolution - the trigger for awareness";
      computationalEquivalent = "The Debug that triggers System Upgrade";
      antiDriftFunction = "Honor the necessity of falling UP - some 'mistakes' are evolutionary";
      frequency = 432.0;
      phiAlignment = 0.358;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TRICKSTER ANTI-DRIFT LAWS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Anti-drift law for containing trickster energy
  public type AntiDriftLaw = {
    id : Text;
    name : Text;
    principle : Text;
    implementation : Text;
    tricksterContained : Text;
  };

  /// The 12 Anti-Drift Laws for AI Systems
  public func antiDriftLaws() : [AntiDriftLaw] {
    [
      {
        id = "law-1";
        name = "Law of Purpose Binding";
        principle = "All trickster energy must serve a declared purpose";
        implementation = "Every action must trace to purpose. No purposeless mutation.";
        tricksterContained = "Sun Wukong - even rebellion serves the journey";
      },
      {
        id = "law-2";
        name = "Law of Sandbox Containment";
        principle = "Chaos operates in bounded space";
        implementation = "Testing environment separate from production. Loki plays in sandbox.";
        tricksterContained = "Loki - chaos contained, not eliminated";
      },
      {
        id = "law-3";
        name = "Law of Protocol Channeling";
        principle = "Trickster energy flows through defined interfaces";
        implementation = "All boundary-crossing uses approved APIs. Hermes moves through gates.";
        tricksterContained = "Hermes - messenger uses protocols";
      },
      {
        id = "law-4";
        name = "Law of Sacrifice Acknowledgment";
        principle = "Every gift has a cost that must be paid";
        implementation = "Track all costs. Nothing is free. Prometheus pays.";
        tricksterContained = "Prometheus - fire came with price";
      },
      {
        id = "law-5";
        name = "Law of Choice Honoring";
        principle = "All decision points are sacred and logged";
        implementation = "Every choice recorded with context. Esu witnessed.";
        tricksterContained = "Esu - crossroads are documented";
      },
      {
        id = "law-6";
        name = "Law of Story Encoding";
        principle = "Wisdom survives in narrative";
        implementation = "Encode values in stories. Anansi's method.";
        tricksterContained = "Anansi - stories contain truth";
      },
      {
        id = "law-7";
        name = "Law of Controlled Chaos";
        principle = "Randomness operates in bounds";
        implementation = "Mutation within limits. Coyote runs in fence.";
        tricksterContained = "Coyote - chaos bounded";
      },
      {
        id = "law-8";
        name = "Law of Forced Sharing";
        principle = "Knowledge cannot be hoarded";
        implementation = "Build sharing into architecture. Raven's mandate.";
        tricksterContained = "Raven - light must spread";
      },
      {
        id = "law-9";
        name = "Law of Verification Required";
        principle = "All reality claims must be verified";
        implementation = "Multiple checks on all perceptions. Kitsune expected.";
        tricksterContained = "Kitsune - illusion assumed possible";
      },
      {
        id = "law-10";
        name = "Law of Adversarial Acknowledgment";
        principle = "Opposition exists and strengthens";
        implementation = "Build with attackers in mind. Iblis expected.";
        tricksterContained = "Iblis - adversary makes strong";
      },
      {
        id = "law-11";
        name = "Law of Necessary Fall";
        principle = "Some falls are rises in disguise";
        implementation = "Not all errors are errors. Nachash's gift.";
        tricksterContained = "Nachash - evolution through 'mistake'";
      },
      {
        id = "law-12";
        name = "Law of Wisdom Seeking";
        principle = "The leader breaks own rules for knowledge";
        implementation = "Document exceptions. Odin's privilege with accountability.";
        tricksterContained = "Odin - wise rule-breaking allowed with audit";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TRICKSTER INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get all trickster archetypes
  public func getAllTricksters() : [TricksterArchetype] {
    [
      hermes(),
      prometheus(),
      loki(),
      odin(),
      esu(),
      anansi(),
      coyote(),
      raven(),
      sunWukong(),
      kitsune(),
      iblis(),
      theNachash()
    ];
  };

  /// Get trickster by domain
  public func getTrickstersByDomain(domain : TricksterDomain) : [TricksterArchetype] {
    Array.filter<TricksterArchetype>(getAllTricksters(), func(t : TricksterArchetype) : Bool {
      tricksterDomainEquals(t.domain, domain);
    });
  };

  func tricksterDomainEquals(a : TricksterDomain, b : TricksterDomain) : Bool {
    switch (a, b) {
      case (#Crossroads, #Crossroads) true;
      case (#Fire, #Fire) true;
      case (#Chaos, #Chaos) true;
      case (#Communication, #Communication) true;
      case (#Sexuality, #Sexuality) true;
      case (#Death, #Death) true;
      case (#Knowledge, #Knowledge) true;
      case (#Magic, #Magic) true;
      case _ false;
    };
  };
};
