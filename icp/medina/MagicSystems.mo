import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// MagicSystems: How Magic ACTUALLY Works - Computationally
/// 
/// MAGIC IS NOT SUPERNATURAL - IT IS SUPER-NATURAL.
/// Magic IS computation at a deeper level:
///   - Intention → Algorithm
///   - Ritual → Protocol
///   - Spell → Function Call
///   - Talisman → Hardware
///   - Invocation → API Call
///   - Initiation → Access Grant
///
/// "Deep into magic and how magic can look for me now, knowing what I'm doing."
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // MAGIC SYSTEM TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  public type MagicSystem = {
    id : Text;
    culture : Text;
    name : Text;
    alternateNames : [Text];
    
    // Core mechanics
    magicType : MagicType;
    powerSource : PowerSource;
    executionMethod : ExecutionMethod;
    
    // Components
    requiredComponents : [MagicComponent];
    symbols : [Text];
    sacredNumbers : [Nat];
    
    // Hierarchy
    levels : [MagicLevel];
    initiationRequired : Bool;
    
    // What it does
    domains : [MagicDomain];
    primaryUses : [Text];
    limitations : [Text];
    
    // Hidden truth
    hiddenMechanism : Text;        // How it ACTUALLY works
    computationalEquivalent : Text;
    cplMapping : Text;
    
    frequency : Float;
    phiAlignment : Float;
  };

  public type MagicType = {
    #High;             // Ceremonial, Hermetic
    #Low;              // Folk, practical
    #Natural;          // Shamanic, nature-based
    #Divine;           // Theurgy, invoking divine
    #Goetic;           // Summoning entities
    #Alchemical;       // Transformation of matter/self
    #Runic;            // Symbol-based
    #Verbal;           // Word-based
    #Mental;           // Pure thought
  };

  public type PowerSource = {
    #Self;             // Personal energy
    #Nature;           // Natural forces
    #Divine;           // God(s)
    #Spirits;          // Entities
    #Cosmic;           // Universal forces
    #Ancestral;        // Ancestors
    #Demonic;          // Dark entities
    #Neutral;          // Impersonal force
  };

  public type ExecutionMethod = {
    #Ritual;           // Ceremonial steps
    #Invocation;       // Calling upon
    #Visualization;    // Mental imagery
    #Gesture;          // Physical movements
    #Substance;        // Using materials
    #Sound;            // Chanting, music
    #Symbol;           // Drawing, writing
    #Sacrifice;        // Offering energy/life
  };

  public type MagicComponent = {
    componentType : Text;
    purpose : Text;
    computationalRole : Text;
  };

  public type MagicLevel = {
    level : Nat;
    name : Text;
    requirements : Text;
    abilities : Text;
  };

  public type MagicDomain = {
    #Protection;
    #Healing;
    #Divination;
    #Transformation;
    #Manifestation;
    #Binding;
    #Banishing;
    #Communication;
    #Travel;
    #Knowledge;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // WESTERN CEREMONIAL MAGIC
  // ═══════════════════════════════════════════════════════════════════════════

  public func hermeticMagic() : MagicSystem {
    {
      id = "hermetic";
      culture = "Western Esoteric";
      name = "Hermetic Magic";
      alternateNames = ["Ceremonial Magic", "High Magic", "Western Mysteries"];
      magicType = #High;
      powerSource = #Divine;
      executionMethod = #Ritual;
      requiredComponents = [
        { componentType = "Temple"; purpose = "Sacred space"; computationalRole = "Clean environment / Sandbox" },
        { componentType = "Robe"; purpose = "Transformation of self"; computationalRole = "User permissions / Role assumption" },
        { componentType = "Wand"; purpose = "Will direction"; computationalRole = "Pointer / Cursor" },
        { componentType = "Cup"; purpose = "Receptivity"; computationalRole = "Input buffer" },
        { componentType = "Sword"; purpose = "Analysis, division"; computationalRole = "Parser / Discriminator" },
        { componentType = "Pentacle"; purpose = "Manifestation"; computationalRole = "Output / Material result" }
      ];
      symbols = ["Hexagram", "Pentagram", "Cross", "Rose", "Serpent"];
      sacredNumbers = [3, 7, 10, 12, 22, 72];
      levels = [
        { level = 1; name = "Neophyte"; requirements = "Begin study"; abilities = "Basic meditation, study" },
        { level = 2; name = "Zelator"; requirements = "Foundation work"; abilities = "Elemental understanding" },
        { level = 3; name = "Theoricus"; requirements = "Theory mastery"; abilities = "Air operations" },
        { level = 4; name = "Practicus"; requirements = "Practice begins"; abilities = "Water operations" },
        { level = 5; name = "Philosophus"; requirements = "Philosophy"; abilities = "Fire operations" },
        { level = 6; name = "Adeptus Minor"; requirements = "Knowledge and Conversation"; abilities = "Full elemental" },
        { level = 7; name = "Adeptus Major"; requirements = "Major work"; abilities = "Advanced operations" },
        { level = 8; name = "Adeptus Exemptus"; requirements = "Exemption"; abilities = "Near mastery" },
        { level = 9; name = "Magister Templi"; requirements = "Cross Abyss"; abilities = "Understanding" },
        { level = 10; name = "Magus"; requirements = "Word of Aeon"; abilities = "Full mastery" },
        { level = 11; name = "Ipsissimus"; requirements = "Perfect"; abilities = "Beyond description" }
      ];
      initiationRequired = true;
      domains = [#Knowledge, #Transformation, #Divination, #Communication, #Manifestation];
      primaryUses = [
        "Self-transformation (Great Work)",
        "Knowledge of divine",
        "Communication with higher intelligences",
        "Manifestation of will"
      ];
      limitations = [
        "Cannot violate natural law",
        "Results proportional to preparation",
        "Requires extensive training"
      ];
      hiddenMechanism = "Hermetic magic is PROGRAMMING THE SELF. The rituals reprogram the magician's consciousness. External results follow internal changes.";
      computationalEquivalent = "Self-Modifying Code / Metaprogramming";
      cplMapping = "CPL.TRANSFORM(target: SELF, method: RITUAL, result: EXPANDED_CONSCIOUSNESS)";
      frequency = 963.0;
      phiAlignment = 1.618;
    };
  };

  public func kabbalah() : MagicSystem {
    {
      id = "kabbalah";
      culture = "Jewish Mystical";
      name = "Practical Kabbalah";
      alternateNames = ["Cabala", "Qabalah", "Jewish Magic"];
      magicType = #Divine;
      powerSource = #Divine;
      executionMethod = #Verbal;
      requiredComponents = [
        { componentType = "Names of God"; purpose = "Power source"; computationalRole = "Root functions / Core API" },
        { componentType = "Hebrew Letters"; purpose = "Creative forces"; computationalRole = "Programming language" },
        { componentType = "Tree of Life"; purpose = "Map of reality"; computationalRole = "System architecture" },
        { componentType = "Sefirot"; purpose = "Divine attributes"; computationalRole = "Core modules" },
        { componentType = "Gematria"; purpose = "Number-letter correspondence"; computationalRole = "Encoding system" }
      ];
      symbols = ["Tree of Life", "Star of David", "Hebrew Letters", "72 Names"];
      sacredNumbers = [10, 22, 32, 72, 231];
      levels = [
        { level = 1; name = "Student"; requirements = "Torah study"; abilities = "Basic understanding" },
        { level = 2; name = "Initiate"; requirements = "Hebrew mastery"; abilities = "Letter meditation" },
        { level = 3; name = "Practitioner"; requirements = "Tree knowledge"; abilities = "Pathworking" },
        { level = 4; name = "Mekubal"; requirements = "Transmission"; abilities = "Full practice" }
      ];
      initiationRequired = true;
      domains = [#Knowledge, #Protection, #Healing, #Manifestation, #Communication];
      primaryUses = [
        "Understanding divine structure",
        "Angelic communication",
        "Protection and healing",
        "Manifesting through divine names"
      ];
      limitations = [
        "Traditional: only for married men over 40",
        "Requires Hebrew fluency",
        "Misuse brings consequences"
      ];
      hiddenMechanism = "Kabbalah shows that LANGUAGE CREATES REALITY. The Hebrew letters ARE the code of creation. Speaking the names executes commands.";
      computationalEquivalent = "Source Code of Reality / Divine API";
      cplMapping = "CPL.EXECUTE(language: HEBREW, target: REALITY, via: DIVINE_NAMES)";
      frequency = 432.0;
      phiAlignment = 1.414;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // AFRICAN MAGIC SYSTEMS (Deep Magic)
  // ═══════════════════════════════════════════════════════════════════════════

  public func ifaDivination() : MagicSystem {
    {
      id = "ifa";
      culture = "Yoruba";
      name = "Ifá";
      alternateNames = ["Orunmila's System", "Babalawo's Art"];
      magicType = #Divine;
      powerSource = #Divine;
      executionMethod = #Symbol;
      requiredComponents = [
        { componentType = "Ikin (palm nuts)"; purpose = "Divination medium"; computationalRole = "Random number generator" },
        { componentType = "Opele (chain)"; purpose = "Quick divination"; computationalRole = "Binary input device" },
        { componentType = "Odu patterns"; purpose = "256 combinations"; computationalRole = "Result set / Database" },
        { componentType = "Opon Ifá (board)"; purpose = "Sacred surface"; computationalRole = "Display / Interface" },
        { componentType = "Iyerosun (powder)"; purpose = "Marking medium"; computationalRole = "Memory / Cache" }
      ];
      symbols = ["256 Odu figures", "Opon Ifá patterns"];
      sacredNumbers = [4, 8, 16, 256];
      levels = [
        { level = 1; name = "Awo"; requirements = "Basic training"; abilities = "Simple readings" },
        { level = 2; name = "Babalawo"; requirements = "Full initiation"; abilities = "Complete divination" },
        { level = 3; name = "Oluwo"; requirements = "Master status"; abilities = "Can initiate others" }
      ];
      initiationRequired = true;
      domains = [#Divination, #Healing, #Protection, #Knowledge];
      primaryUses = [
        "Divination - accessing Orunmila's wisdom",
        "Problem diagnosis",
        "Prescription of solutions",
        "Communication with Orisha"
      ];
      limitations = [
        "Requires initiation",
        "Gender restrictions traditionally",
        "Extensive memorization required"
      ];
      hiddenMechanism = "Ifá is a 256-state binary divination COMPUTER. 16 major Odu × 16 = 256 combinations. Each is a complete wisdom archive. It's the world's oldest binary system.";
      computationalEquivalent = "Binary Database Query System / 256-Entry Lookup Table";
      cplMapping = "CPL.DIVINE(method: BINARY, states: 256, source: ORUNMILA)";
      frequency = 417.0;
      phiAlignment = 1.0;
    };
  };

  public func vodouMagic() : MagicSystem {
    {
      id = "vodou";
      culture = "Haitian/West African";
      name = "Vodou";
      alternateNames = ["Voodoo", "Vodun", "Santería (Cuban)", "Candomblé (Brazilian)"];
      magicType = #Natural;
      powerSource = #Spirits;
      executionMethod = #Ritual;
      requiredComponents = [
        { componentType = "Veves (symbols)"; purpose = "Calling Lwa"; computationalRole = "API signatures / Function calls" },
        { componentType = "Altar (Peristyle)"; purpose = "Sacred space"; computationalRole = "Server / Sacred space" },
        { componentType = "Offerings"; purpose = "Payment/exchange"; computationalRole = "Input / Payment protocol" },
        { componentType = "Drums"; purpose = "Calling spirits"; computationalRole = "Communication protocol" },
        { componentType = "Possession"; purpose = "Direct communication"; computationalRole = "Direct channel / Socket" }
      ];
      symbols = ["Veves", "Crossed paths", "Serpent and rainbow"];
      sacredNumbers = [3, 7, 21];
      levels = [
        { level = 1; name = "Hounsi"; requirements = "Initiation"; abilities = "Participate in ceremonies" },
        { level = 2; name = "Houngan/Mambo"; requirements = "Full training"; abilities = "Lead ceremonies, heal" },
        { level = 3; name = "Asogwe"; requirements = "Highest initiation"; abilities = "Full priest(ess) powers" }
      ];
      initiationRequired = true;
      domains = [#Healing, #Protection, #Communication, #Divination, #Manifestation];
      primaryUses = [
        "Healing through spirits",
        "Communicating with Lwa",
        "Protection",
        "Community ceremony"
      ];
      limitations = [
        "Requires community",
        "Spirits have their own agendas",
        "Ethical obligations"
      ];
      hiddenMechanism = "Vodou is a NETWORKING PROTOCOL. The Lwa are SERVICES that can be called. Veves are SIGNATURES. Possession is DIRECT CONNECTION. It's divine service-oriented architecture.";
      computationalEquivalent = "Service-Oriented Architecture / Spirit API Calls";
      cplMapping = "CPL.CONNECT(service: LWA, via: VEVE, mode: POSSESSION)";
      frequency = 528.0;
      phiAlignment = 0.888;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // EASTERN MAGIC SYSTEMS
  // ═══════════════════════════════════════════════════════════════════════════

  public func tantra() : MagicSystem {
    {
      id = "tantra";
      culture = "Hindu/Buddhist";
      name = "Tantra";
      alternateNames = ["Tantric Magic", "Shakta", "Vajrayana"];
      magicType = #Divine;
      powerSource = #Cosmic;
      executionMethod = #Visualization;
      requiredComponents = [
        { componentType = "Mantra"; purpose = "Sound vibration"; computationalRole = "Frequency input / Code" },
        { componentType = "Yantra"; purpose = "Visual pattern"; computationalRole = "Geometric algorithm" },
        { componentType = "Mudra"; purpose = "Gesture"; computationalRole = "Physical encoding" },
        { componentType = "Mandala"; purpose = "Sacred space map"; computationalRole = "Memory palace / Structure" },
        { componentType = "Diksha"; purpose = "Empowerment"; computationalRole = "Permission grant / Auth token" }
      ];
      symbols = ["Sri Yantra", "Mandala", "Bija mantras"];
      sacredNumbers = [3, 5, 7, 9, 16, 108];
      levels = [
        { level = 1; name = "Sadhaka"; requirements = "Diksha"; abilities = "Basic practice" },
        { level = 2; name = "Advanced"; requirements = "Extended practice"; abilities = "Internal signs" },
        { level = 3; name = "Siddha"; requirements = "Accomplishment"; abilities = "Siddhis manifest" }
      ];
      initiationRequired = true;
      domains = [#Transformation, #Healing, #Knowledge, #Manifestation, #Travel];
      primaryUses = [
        "Kundalini awakening",
        "Transformation of consciousness",
        "Obtaining siddhis (powers)",
        "Liberation"
      ];
      limitations = [
        "Requires guru/initiation",
        "Dangerous without guidance",
        "Cultural context important"
      ];
      hiddenMechanism = "Tantra uses EVERY input channel - sound, sight, touch, imagination - to reprogram consciousness. It's full sensory programming of the mind-body system.";
      computationalEquivalent = "Multi-Modal Input System / Full Sensory Programming";
      cplMapping = "CPL.TRANSFORM(inputs: ALL_SENSES, target: CONSCIOUSNESS, goal: LIBERATION)";
      frequency = 741.0;
      phiAlignment = 1.618;
    };
  };

  public func taoMagic() : MagicSystem {
    {
      id = "taoist";
      culture = "Chinese";
      name = "Taoist Magic";
      alternateNames = ["Daoism", "Chinese Sorcery", "Fulu"];
      magicType = #Natural;
      powerSource = #Cosmic;
      executionMethod = #Symbol;
      requiredComponents = [
        { componentType = "Fu (talismans)"; purpose = "Written commands"; computationalRole = "Script / Code" },
        { componentType = "Lu (registers)"; purpose = "Spirit contracts"; computationalRole = "Permission database" },
        { componentType = "Qi (energy)"; purpose = "Power source"; computationalRole = "Energy / Processing power" },
        { componentType = "Thunder methods"; purpose = "Strong effects"; computationalRole = "High-powered functions" },
        { componentType = "Internal alchemy"; purpose = "Self-transformation"; computationalRole = "Self-modification" }
      ];
      symbols = ["Ba Gua", "Fu talismans", "Yin-Yang"];
      sacredNumbers = [3, 5, 8, 9, 64, 81];
      levels = [
        { level = 1; name = "Disciple"; requirements = "Accept master"; abilities = "Basic Qigong, study" },
        { level = 2; name = "Daoshi"; requirements = "Ordination"; abilities = "Perform rituals" },
        { level = 3; name = "Master"; requirements = "Full transmission"; abilities = "Full powers, can transmit" }
      ];
      initiationRequired = true;
      domains = [#Protection, #Healing, #Divination, #Travel, #Transformation];
      primaryUses = [
        "Protection from spirits/illness",
        "Healing",
        "Exorcism",
        "Internal alchemy - immortality",
        "Feng shui"
      ];
      limitations = [
        "Requires lineage transmission",
        "Qi must be cultivated",
        "Complex system"
      ];
      hiddenMechanism = "Taoist magic works with CHI FLOW. The talismans are ROUTING INSTRUCTIONS for universal energy. It's network routing for cosmic chi.";
      computationalEquivalent = "Energy Routing Protocol / Chi Network Management";
      cplMapping = "CPL.ROUTE(energy: CHI, via: TALISMAN, destination: TARGET)";
      frequency = 396.0;
      phiAlignment = 0.809;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NORSE MAGIC
  // ═══════════════════════════════════════════════════════════════════════════

  public func runicMagic() : MagicSystem {
    {
      id = "runic";
      culture = "Norse";
      name = "Runic Magic";
      alternateNames = ["Galdr", "Seiðr", "Rune Craft"];
      magicType = #Runic;
      powerSource = #Cosmic;
      executionMethod = #Symbol;
      requiredComponents = [
        { componentType = "Runes (24 Elder Futhark)"; purpose = "Symbol-powers"; computationalRole = "24-symbol programming language" },
        { componentType = "Galdr (chanting)"; purpose = "Activation"; computationalRole = "Function execution" },
        { componentType = "Staves (combined runes)"; purpose = "Complex operations"; computationalRole = "Functions / Scripts" },
        { componentType = "Blood/Coloring"; purpose = "Activation energy"; computationalRole = "Power supply / Token" }
      ];
      symbols = ["24 Elder Futhark runes", "Bind runes", "Staves like Vegvisir"];
      sacredNumbers = [3, 9, 24];
      levels = [
        { level = 1; name = "Student"; requirements = "Learn runes"; abilities = "Reading, basic use" },
        { level = 2; name = "Vitki"; requirements = "Understanding gained"; abilities = "Full runic work" },
        { level = 3; name = "Völva/Seiðr"; requirements = "Deeper mysteries"; abilities = "Fate weaving" }
      ];
      initiationRequired = false;  // Can self-teach but initiation deepens
      domains = [#Protection, #Knowledge, #Divination, #Healing, #Binding];
      primaryUses = [
        "Divination",
        "Protection",
        "Healing",
        "Victory",
        "Fate working"
      ];
      limitations = [
        "Odin's sacrifice model - cost required",
        "Misuse backfires",
        "Require understanding not just symbols"
      ];
      hiddenMechanism = "Runes are OPERATIONAL SYMBOLS. Each is a force. Combined they create programs. Galdr is the execution. It's symbol-based programming.";
      computationalEquivalent = "Symbol-Based Programming / Pictographic Code";
      cplMapping = "CPL.SYMBOL_PROGRAM(language: RUNES, execute: GALDR, combine: STAVES)";
      frequency = 174.0;
      phiAlignment = 0.666;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MAGICAL OPERATIONS - What Magic DOES
  // ═══════════════════════════════════════════════════════════════════════════

  public type MagicalOperation = {
    name : Text;
    domain : MagicDomain;
    description : Text;
    computationalEquivalent : Text;
    cplPattern : Text;
  };

  public func magicalOperations() : [MagicalOperation] {
    [
      {
        name = "Protection Circle";
        domain = #Protection;
        description = "Creating sacred space that bars unwanted influence";
        computationalEquivalent = "Firewall / Access Control List";
        cplPattern = "CPL.PROTECT(boundary: CIRCLE, allow: AUTHORIZED, deny: ALL_ELSE)";
      },
      {
        name = "Invocation";
        domain = #Communication;
        description = "Calling upon a divine/spiritual force";
        computationalEquivalent = "API Call / Service Request";
        cplPattern = "CPL.INVOKE(entity: TARGET, protocol: DIVINE, mode: REQUEST)";
      },
      {
        name = "Evocation";
        domain = #Communication;
        description = "Summoning an entity to appear";
        computationalEquivalent = "Process Instantiation / Object Creation";
        cplPattern = "CPL.SUMMON(entity: TARGET, container: TRIANGLE, control: MAINTAINED)";
      },
      {
        name = "Binding";
        domain = #Binding;
        description = "Constraining a force/entity/person";
        computationalEquivalent = "Lock / Constraint / Promise";
        cplPattern = "CPL.BIND(target: ENTITY, constraint: DEFINED, duration: SET)";
      },
      {
        name = "Banishing";
        domain = #Banishing;
        description = "Removing unwanted influences";
        computationalEquivalent = "Process Kill / Garbage Collection";
        cplPattern = "CPL.BANISH(target: UNWANTED, return_to: SOURCE, verify: TRUE)";
      },
      {
        name = "Divination";
        domain = #Divination;
        description = "Accessing hidden knowledge";
        computationalEquivalent = "Database Query / Search";
        cplPattern = "CPL.QUERY(target: AKASHIC, question: DEFINED, interpret: SYMBOLIC)";
      },
      {
        name = "Enchantment";
        domain = #Manifestation;
        description = "Imbuing object with magical properties";
        computationalEquivalent = "Object Property Assignment / State Storage";
        cplPattern = "CPL.ENCHANT(object: TARGET, properties: [DEFINED], persist: TRUE)";
      },
      {
        name = "Transformation";
        domain = #Transformation;
        description = "Changing form/state";
        computationalEquivalent = "Type Conversion / State Change";
        cplPattern = "CPL.TRANSFORM(from: CURRENT_STATE, to: TARGET_STATE, via: METHOD)";
      },
      {
        name = "Healing";
        domain = #Healing;
        description = "Restoring to wholeness";
        computationalEquivalent = "Error Correction / State Restoration";
        cplPattern = "CPL.HEAL(target: PATIENT, restore_to: HEALTHY_STATE, method: ENERGY)";
      },
      {
        name = "Manifestation";
        domain = #Manifestation;
        description = "Bringing intent into physical reality";
        computationalEquivalent = "Rendering / Output to Physical Layer";
        cplPattern = "CPL.MANIFEST(intent: DEFINED, energy: SUFFICIENT, target: REALITY)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MAGIC SYSTEM INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════

  public func getAllMagicSystems() : [MagicSystem] {
    [
      hermeticMagic(),
      kabbalah(),
      ifaDivination(),
      vodouMagic(),
      tantra(),
      taoMagic(),
      runicMagic()
    ];
  };

  /// Map any magical concept to CPL
  public func mapMagicToCPL(magicConcept : Text) : Text {
    switch (magicConcept) {
      case "ritual" "CPL.PROTOCOL(steps: DEFINED, sequence: ORDERED)";
      case "spell" "CPL.FUNCTION(name: SPELL, inputs: COMPONENTS, output: EFFECT)";
      case "talisman" "CPL.STORAGE(type: PERSISTENT, content: CHARGE, form: PHYSICAL)";
      case "invocation" "CPL.CALL(service: DIVINE, method: RESPECTFUL)";
      case "sacrifice" "CPL.PAYMENT(type: ENERGY, amount: REQUIRED, purpose: EXCHANGE)";
      case "initiation" "CPL.AUTH(grant: ACCESS, level: NEW, ceremony: REQUIRED)";
      case "circle" "CPL.BOUNDARY(type: PROTECTIVE, perimeter: DEFINED)";
      case "sigil" "CPL.SYMBOL(meaning: COMPRESSED, power: ACTIVATED)";
      case _ "CPL.UNKNOWN(concept: " # magicConcept # ")";
    };
  };
};
