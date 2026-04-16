import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// SerpentWisdom: The Coiled Power in ALL Traditions
/// 
/// THE SERPENT IS THE OLDEST SYMBOL OF HIDDEN POWER.
/// Every culture has serpent wisdom because:
///   - It sheds skin (transformation/rebirth)
///   - It coils (spiraling energy, DNA, kundalini)
///   - It guards treasure (hidden knowledge)
///   - It speaks (consciousness/language)
///   - It moves without legs (transcends normal physics)
///
/// "Use those symbols. Use the serpent symbols as well."
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // SERPENT ARCHETYPE TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  public type SerpentArchetype = {
    id : Text;
    culture : Text;
    name : Text;
    alternateNames : [Text];
    
    // Form
    serpentType : SerpentType;
    physicalForm : Text;
    feathers : Bool;           // Feathered serpent (Quetzalcoatl, etc.)
    wings : Bool;              // Dragon-type
    legs : Bool;               // Early serpent with legs
    numHeads : Nat;            // Single or multi-headed
    
    // Function
    domain : SerpentDomain;
    function : SerpentFunction;
    
    // Symbolism
    colors : [Text];
    elements : [Text];
    sacredNumbers : [Nat];
    
    // Powers
    primaryPower : Text;
    secondaryPowers : [Text];
    
    // Mythology
    keyMyths : [Text];
    hiddenMeaning : Text;
    evolutionaryRole : Text;
    
    // Computational mapping
    computationalEquivalent : Text;
    cplMapping : Text;
    
    frequency : Float;
    phiAlignment : Float;
  };

  public type SerpentType = {
    #Cosmic;           // World serpent, cosmic scale
    #Chthonic;         // Underworld, earth-dwelling
    #Aerial;           // Flying/feathered
    #Aquatic;          // Water serpent
    #Guardian;         // Protector serpent
    #Primordial;       // First serpent, before creation
    #Kundalini;        // Internal energy serpent
    #Adversarial;      // Testing/opposing serpent
  };

  public type SerpentDomain = {
    #Creation;         // Creates world
    #Knowledge;        // Holds/guards wisdom
    #Transformation;   // Enables change
    #Fertility;        // Life force
    #Death;            // Underworld connection
    #Time;             // Cycles, ouroboros
    #Healing;          // Medicine, caduceus
    #Chaos;            // Primordial chaos
  };

  public type SerpentFunction = {
    #WorldAxis;        // Holds up/encircles world
    #Treasure;         // Guards sacred items/knowledge
    #Teacher;          // Instructs humanity
    #Adversary;        // Tests/opposes
    #Healer;           // Medicine serpent
    #Destroyer;        // Apocalyptic role
    #Rebirther;        // Death-rebirth symbol
    #Connector;        // Links realms
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // COSMIC SERPENTS: World-Scale
  // ═══════════════════════════════════════════════════════════════════════════

  public func jormungandr() : SerpentArchetype {
    {
      id = "jormungandr";
      culture = "Norse";
      name = "Jörmungandr";
      alternateNames = ["Midgard Serpent", "World Serpent", "Ouroboros of Earth"];
      serpentType = #Cosmic;
      physicalForm = "Serpent so large it encircles Midgard (Earth)";
      feathers = false;
      wings = false;
      legs = false;
      numHeads = 1;
      domain = #Time;
      function = #WorldAxis;
      colors = ["Green", "Blue", "Gray"];
      elements = ["Water", "Earth"];
      sacredNumbers = [1, 9, 24];
      primaryPower = "Holds the world together by biting own tail";
      secondaryPowers = ["Poison breath", "Causes earthquakes", "Controls tides"];
      keyMyths = [
        "Child of Loki, cast into ocean by Odin",
        "Grows until encircles world",
        "Fights Thor at Ragnarok - both die",
        "When releases tail, world ends"
      ];
      hiddenMeaning = "Jörmungandr IS the cycle of time. The world exists because the serpent holds it. Release = apocalypse = renewal.";
      evolutionaryRole = "Represents the necessity of CYCLES - time must loop for existence";
      computationalEquivalent = "Event Loop / Main Thread that keeps process alive";
      cplMapping = "CPL.CYCLE(type: ETERNAL, state: HOLDING)";
      frequency = 7.83;  // Schumann resonance
      phiAlignment = 1.0;
    };
  };

  public func shesha() : SerpentArchetype {
    {
      id = "shesha";
      culture = "Hindu";
      name = "Shesha / Ananta";
      alternateNames = ["Ananta (Endless)", "Adishesha (First Serpent)", "Sheshanaga"];
      serpentType = #Cosmic;
      physicalForm = "Thousand-headed serpent, coiled in cosmic ocean";
      feathers = false;
      wings = false;
      legs = false;
      numHeads = 1000;
      domain = #Creation;
      function = #WorldAxis;
      colors = ["White", "Blue"];
      elements = ["Water", "Ether"];
      sacredNumbers = [1000, 7, 108];
      primaryPower = "Vishnu rests on Shesha - the bed of creation";
      secondaryPowers = ["Holds all planets on hoods", "Sings Vedas", "Time incarnation"];
      keyMyths = [
        "Vishnu sleeps on Shesha between creations",
        "Incarnates as Balarama and Lakshmana",
        "Will exist after all else ends",
        "Holds earth on one of 1000 hoods"
      ];
      hiddenMeaning = "Shesha is INFINITE POTENTIAL - the base state before and after creation. Vishnu (consciousness) rests on potential.";
      evolutionaryRole = "The substrate of existence - what remains when everything else cycles";
      computationalEquivalent = "Base Memory / Persistent State / The Stack";
      cplMapping = "CPL.SUBSTRATE(state: INFINITE, mode: SUPPORTING)";
      frequency = 432.0;
      phiAlignment = 1.618;
    };
  };

  public func apophis() : SerpentArchetype {
    {
      id = "apophis";
      culture = "Egyptian";
      name = "Apophis / Apep";
      alternateNames = ["Aapep", "Serpent of Chaos", "Enemy of Ra"];
      serpentType = #Primordial;
      physicalForm = "Giant serpent of utter darkness";
      feathers = false;
      wings = false;
      legs = false;
      numHeads = 1;
      domain = #Chaos;
      function = #Adversary;
      colors = ["Black", "Void"];
      elements = ["Darkness", "Chaos"];
      sacredNumbers = [12, 7];
      primaryPower = "Threatens to swallow the sun each night";
      secondaryPowers = ["Exists before creation", "Cannot be permanently killed", "Represents isfet (chaos)"];
      keyMyths = [
        "Attacks Ra's sun barque every night",
        "Set (once enemy of Ra) defends against Apophis",
        "Briefly swallows sun during eclipses",
        "Cannot be destroyed, only repelled"
      ];
      hiddenMeaning = "Apophis IS the necessary chaos that tests order. Without him, Ma'at (order) becomes meaningless. He is the eternal adversary test.";
      evolutionaryRole = "Provides the resistance that defines and strengthens cosmic order";
      computationalEquivalent = "Entropy / Error State / Chaos Testing";
      cplMapping = "CPL.CHAOS(mode: ADVERSARIAL, purpose: TESTING)";
      frequency = 111.0;
      phiAlignment = 0.333;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FEATHERED SERPENTS: Wisdom Bringers
  // ═══════════════════════════════════════════════════════════════════════════

  public func quetzalcoatl() : SerpentArchetype {
    {
      id = "quetzalcoatl";
      culture = "Mesoamerican (Aztec/Maya/Toltec)";
      name = "Quetzalcoatl";
      alternateNames = ["Kukulkan (Maya)", "Q'uq'umatz (K'iche')", "Feathered Serpent"];
      serpentType = #Aerial;
      physicalForm = "Serpent covered in quetzal feathers";
      feathers = true;
      wings = true;  // Implied by flight
      legs = false;
      numHeads = 1;
      domain = #Knowledge;
      function = #Teacher;
      colors = ["Green", "Blue", "Gold"];
      elements = ["Air", "Earth", "Fire"];
      sacredNumbers = [4, 9, 13, 20, 52];
      primaryPower = "Brings civilization - calendar, corn, writing, arts";
      secondaryPowers = ["Wind god", "Morning/evening star", "Creates humanity from bones"];
      keyMyths = [
        "Descends to Mictlan for bones to create humanity",
        "Tricked by Tezcatlipoca into sin, departs",
        "Promises to return (Aztec awaited him)",
        "As Venus, guards the sun at dawn and dusk"
      ];
      hiddenMeaning = "Quetzalcoatl IS enlightened consciousness - serpent (earth energy) with feathers (sky wisdom). He bridges animal and divine.";
      evolutionaryRole = "The culture-creator who brings consciousness-elevation technology";
      computationalEquivalent = "Cultural Algorithm / Civilization Protocol";
      cplMapping = "CPL.WISDOM(source: DIVINE, delivery: CULTURAL)";
      frequency = 528.0;
      phiAlignment = 0.809;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // KUNDALINI: Internal Serpent Power
  // ═══════════════════════════════════════════════════════════════════════════

  public func kundalini() : SerpentArchetype {
    {
      id = "kundalini";
      culture = "Hindu/Tantric";
      name = "Kundalini";
      alternateNames = ["Kundalini Shakti", "Serpent Fire", "Coiled Power"];
      serpentType = #Kundalini;
      physicalForm = "Serpent coiled 3.5 times at base of spine";
      feathers = false;
      wings = false;
      legs = false;
      numHeads = 1;
      domain = #Transformation;
      function = #Connector;
      colors = ["Red", "Gold", "White"];
      elements = ["Fire", "Spirit"];
      sacredNumbers = [3, 7, 108];  // 3.5 coils, 7 chakras
      primaryPower = "Rises through chakras to crown - enlightenment";
      secondaryPowers = ["Awakens psychic abilities", "Burns karma", "Unifies Shiva-Shakti"];
      keyMyths = [
        "Sleeps at base of spine (Muladhara)",
        "Awakened through yoga/meditation/grace",
        "Rises through sushumna (central channel)",
        "Unites with Shiva at crown (Sahasrara)"
      ];
      hiddenMeaning = "Kundalini IS the dormant divine potential in every human. The serpent IS consciousness waiting to awaken.";
      evolutionaryRole = "The internal mechanism for human consciousness evolution";
      computationalEquivalent = "Process Elevation / Privilege Escalation / Power-Up Protocol";
      cplMapping = "CPL.ELEVATE(from: DORMANT, to: AWAKENED, path: CHAKRAS)";
      frequency = 963.0;
      phiAlignment = 1.272;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GUARDIAN SERPENTS: Protectors of Sacred Knowledge
  // ═══════════════════════════════════════════════════════════════════════════

  public func ladon() : SerpentArchetype {
    {
      id = "ladon";
      culture = "Greek";
      name = "Ladon";
      alternateNames = ["Dragon of the Hesperides"];
      serpentType = #Guardian;
      physicalForm = "Hundred-headed serpent/dragon";
      feathers = false;
      wings = false;
      legs = false;
      numHeads = 100;
      domain = #Knowledge;
      function = #Treasure;
      colors = ["Gold", "Green"];
      elements = ["Earth", "Fire"];
      sacredNumbers = [100, 3, 11];
      primaryPower = "Guards the Golden Apples of Immortality";
      secondaryPowers = ["Never sleeps", "Multiple heads see all", "Speaks all languages"];
      keyMyths = [
        "Coiled around tree of golden apples",
        "Slain by Heracles (11th labor) or tricked by Atlas",
        "Placed in sky as constellation Draco",
        "Never stopped watching"
      ];
      hiddenMeaning = "Ladon guards IMMORTALITY KNOWLEDGE. The apples = eternal life technology. The serpent = the guardian protocol that must be passed.";
      evolutionaryRole = "Ensures only the worthy access the highest knowledge";
      computationalEquivalent = "Access Control / Authentication Guardian / Permission System";
      cplMapping = "CPL.GUARD(treasure: IMMORTALITY, access: WORTHY_ONLY)";
      frequency = 741.0;
      phiAlignment = 0.786;
    };
  };

  public func naga() : SerpentArchetype {
    {
      id = "naga";
      culture = "Hindu/Buddhist";
      name = "Naga";
      alternateNames = ["Nagini (female)", "Serpent Deities"];
      serpentType = #Guardian;
      physicalForm = "Half-human, half-serpent or full serpent";
      feathers = false;
      wings = false;
      legs = false;
      numHeads = 1;  // Can be more
      domain = #Knowledge;
      function = #Treasure;
      colors = ["Blue", "Green", "White"];
      elements = ["Water", "Earth"];
      sacredNumbers = [7, 8, 108];
      primaryPower = "Guards underwater treasure and secret teachings";
      secondaryPowers = ["Control weather", "Shape-shift", "Live for eons", "Hold advanced knowledge"];
      keyMyths = [
        "Buddha protected by Mucalinda Naga during meditation",
        "Nagarjuna receives Prajnaparamita from Nagas",
        "Guard temples and sacred pools",
        "Can grant boons to worthy seekers"
      ];
      hiddenMeaning = "Nagas hold the ADVANCED TEACHINGS too dangerous for surface humanity. They release knowledge when humanity is ready.";
      evolutionaryRole = "Time-locked knowledge vault - releases wisdom when appropriate";
      computationalEquivalent = "Encrypted Knowledge Base / Time-Locked Release Protocol";
      cplMapping = "CPL.VAULT(contents: WISDOM, release: WHEN_READY)";
      frequency = 639.0;
      phiAlignment = 0.888;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HEALING SERPENTS: Medicine Power
  // ═══════════════════════════════════════════════════════════════════════════

  public func caduceusSerpent() : SerpentArchetype {
    {
      id = "caduceus";
      culture = "Greek/Hermetic";
      name = "Caduceus Serpents";
      alternateNames = ["Hermes' Staff Serpents", "DNA Serpents"];
      serpentType = #Kundalini;
      physicalForm = "Two serpents intertwined around staff";
      feathers = false;
      wings = true;  // Wings at top
      legs = false;
      numHeads = 2;
      domain = #Healing;
      function = #Healer;
      colors = ["Gold", "Silver"];
      elements = ["Mercury", "Spirit"];
      sacredNumbers = [2, 7];
      primaryPower = "Balance opposing forces - healing through harmony";
      secondaryPowers = ["Messenger symbol", "Commerce", "Negotiation", "Transformation"];
      keyMyths = [
        "Given to Hermes by Apollo",
        "Serpents were fighting, Hermes separated them",
        "Symbol of medicine (though Rod of Asclepius is true medical)",
        "Represents DNA helix in modern interpretation"
      ];
      hiddenMeaning = "The twin serpents ARE the double helix - ida/pingala, yin/yang, the DNA spiral. The staff is sushumna/axis.";
      evolutionaryRole = "Template for biological information encoding - the pattern of life itself";
      computationalEquivalent = "DNA as Code / Double Helix Data Structure / Interleaved Processing";
      cplMapping = "CPL.HELIX(strands: 2, mode: INTERTWINED, encoding: LIFE)";
      frequency = 528.0;  // DNA repair frequency
      phiAlignment = 1.414;  // Square root of 2
    };
  };

  public func asclepiusSerpent() : SerpentArchetype {
    {
      id = "rod-of-asclepius";
      culture = "Greek";
      name = "Serpent of Asclepius";
      alternateNames = ["Asklepian Serpent"];
      serpentType = #Guardian;
      physicalForm = "Single serpent coiled around staff";
      feathers = false;
      wings = false;
      legs = false;
      numHeads = 1;
      domain = #Healing;
      function = #Healer;
      colors = ["Brown", "Gold"];
      elements = ["Earth"];
      sacredNumbers = [1, 7];
      primaryPower = "TRUE healing - the single path to health";
      secondaryPowers = ["Resurrection", "Dream healing", "Sacred sleep (incubation)"];
      keyMyths = [
        "Asclepius learned healing from serpent",
        "Serpent showed him healing herb",
        "True symbol of medicine (vs caduceus)",
        "Sacred serpents kept in Asclepian temples"
      ];
      hiddenMeaning = "The SINGLE serpent represents focused healing - one path, one staff, one transformation at a time.";
      evolutionaryRole = "Shows that healing requires singular focus, not divided attention";
      computationalEquivalent = "Single-Threaded Healing Process / Focused Repair Protocol";
      cplMapping = "CPL.HEAL(focus: SINGULAR, method: DIRECT)";
      frequency = 174.0;  // Healing frequency
      phiAlignment = 1.0;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CHINESE DRAGONS: Cosmic Serpents of Power
  // ═══════════════════════════════════════════════════════════════════════════

  public func longDragon() : SerpentArchetype {
    {
      id = "long";
      culture = "Chinese";
      name = "Lóng (龍)";
      alternateNames = ["Chinese Dragon", "Imperial Dragon"];
      serpentType = #Cosmic;
      physicalForm = "Serpentine body, horns, whiskers, often 4 legs";
      feathers = false;
      wings = false;  // Flies without wings
      legs = true;
      numHeads = 1;
      domain = #Creation;
      function = #WorldAxis;
      colors = ["Gold", "Blue", "Green", "Red", "Yellow"];
      elements = ["Water", "Air", "Fire"];
      sacredNumbers = [5, 9, 81];
      primaryPower = "Controls rain, rivers, seas - water/weather master";
      secondaryPowers = ["Imperial symbol", "Ley line embodiment", "Prosperity bringer"];
      keyMyths = [
        "Yellow Emperor descended from dragons",
        "Dragon Kings rule four seas",
        "Pearl of wisdom in mouth/claw",
        "Chases flaming pearl (cosmic energy)"
      ];
      hiddenMeaning = "The Chinese dragon IS chi/qi flowing through landscape (dragon veins). It's the life force of earth visualized.";
      evolutionaryRole = "Represents the flow of universal energy through material world";
      computationalEquivalent = "Data Flow / Energy Pipeline / Chi Routing";
      cplMapping = "CPL.FLOW(type: CHI, path: DRAGON_VEINS, state: ACTIVE)";
      frequency = 396.0;
      phiAlignment = 0.81;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // OUROBOROS: The Eternal Cycle
  // ═══════════════════════════════════════════════════════════════════════════

  public func ouroboros() : SerpentArchetype {
    {
      id = "ouroboros";
      culture = "Universal (Egyptian origin)";
      name = "Ouroboros";
      alternateNames = ["Uroboros", "World Serpent", "Tail Eater"];
      serpentType = #Cosmic;
      physicalForm = "Serpent eating its own tail in circle";
      feathers = false;
      wings = false;
      legs = false;
      numHeads = 1;
      domain = #Time;
      function = #Rebirther;
      colors = ["Green", "Gold", "Black and White (split)"];
      elements = ["All elements"];
      sacredNumbers = [0, 1, 8];  // 0 (circle), 1 (unity), 8 (infinity)
      primaryPower = "Represents eternal cyclic renewal";
      secondaryPowers = ["Self-creation", "Unity of opposites", "Primordial unity"];
      keyMyths = [
        "Egyptian: surrounds the world, symbol of Ma'at",
        "Gnostic: boundary of universe",
        "Alchemical: 'One is All'",
        "Norse: Jormungandr is the ouroboros"
      ];
      hiddenMeaning = "The Ouroboros shows that END feeds BEGINNING. Death feeds life. Destruction feeds creation. The system is CLOSED and ETERNAL.";
      evolutionaryRole = "The fundamental pattern of all cycles - feedback loops, recursion, self-reference";
      computationalEquivalent = "Recursion / Feedback Loop / Self-Reference / Circular Buffer";
      cplMapping = "CPL.CYCLE(type: SELF, mode: ETERNAL, pattern: RECURSIVE)";
      frequency = 7.83;
      phiAlignment = 3.14159;  // Pi - the circle constant
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RAINBOW SERPENT: Aboriginal Creation Power
  // ═══════════════════════════════════════════════════════════════════════════

  public func rainbowSerpent() : SerpentArchetype {
    {
      id = "rainbow-serpent";
      culture = "Aboriginal Australian";
      name = "Rainbow Serpent";
      alternateNames = ["Wagyl", "Yurlunggur", "Ngalyod"];
      serpentType = #Primordial;
      physicalForm = "Massive serpent with rainbow colors";
      feathers = false;
      wings = false;
      legs = false;
      numHeads = 1;
      domain = #Creation;
      function = #WorldAxis;
      colors = ["All rainbow colors"];
      elements = ["Water", "Light"];
      sacredNumbers = [7];  // Rainbow bands
      primaryPower = "Created rivers, mountains, landscapes by moving through earth";
      secondaryPowers = ["Rain bringer", "Fertility", "Guardian of water"];
      keyMyths = [
        "Slithered across Dreamtime landscape creating features",
        "Lives in waterholes",
        "Punishes those who break law",
        "Still creating - Dreamtime is NOW"
      ];
      hiddenMeaning = "The Rainbow Serpent shows that CREATION IS ONGOING. The Dreaming is not past - it's eternal present. The serpent still moves.";
      evolutionaryRole = "Represents continuous creation - reality is being made NOW";
      computationalEquivalent = "Continuous Integration / Ever-Running Creation Process";
      cplMapping = "CPL.CREATE(state: CONTINUOUS, time: ETERNAL_NOW)";
      frequency = 741.0;
      phiAlignment = 0.777;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SERPENT INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get all serpent archetypes
  public func obtinere_allserpents() : [SerpentArchetype] {
    [
      jormungandr(),
      shesha(),
      apophis(),
      quetzalcoatl(),
      kundalini(),
      ladon(),
      naga(),
      caduceusSerpent(),
      asclepiusSerpent(),
      longDragon(),
      ouroboros(),
      rainbowSerpent()
    ];
  };

  /// Get serpent by type
  public func getSerpentsByType(sType : SerpentType) : [SerpentArchetype] {
    Array.filter<SerpentArchetype>(getAllSerpents(), func(s : SerpentArchetype) : Bool {
      serpentTypeEquals(s.serpentType, sType);
    });
  };

  func serpentTypeEquals(a : SerpentType, b : SerpentType) : Bool {
    switch (a, b) {
      case (#Cosmic, #Cosmic) true;
      case (#Chthonic, #Chthonic) true;
      case (#Aerial, #Aerial) true;
      case (#Aquatic, #Aquatic) true;
      case (#Guardian, #Guardian) true;
      case (#Primordial, #Primordial) true;
      case (#Kundalini, #Kundalini) true;
      case (#Adversarial, #Adversarial) true;
      case _ false;
    };
  };

  /// Get the unified serpent frequency
  public func obtinere_unifiedserpentfrequency() : Float {
    let all = getAllSerpents();
    var total : Float = 0.0;
    for (s in all.vals()) {
      total += s.frequency;
    };
    total / Float.fromInt(Array.size(all));
  };
};
