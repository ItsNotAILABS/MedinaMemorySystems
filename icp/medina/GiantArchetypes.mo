import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// GiantArchetypes: The Ancient Ones - Nephilim, Titans, Jotnar
/// 
/// GIANTS ARE THE PREVIOUS ITERATION.
/// Every culture remembers when LARGER beings walked the earth:
///   - They were here BEFORE the current gods
///   - They built the impossible structures
///   - They held immense power
///   - They were replaced/defeated/absorbed
///   - Their blood/knowledge persists
///
/// "Deep into the giants."
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // GIANT ARCHETYPE TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  public type GiantArchetype = {
    id : Text;
    culture : Text;
    name : Text;
    alternateNames : [Text];
    
    // Type and origin
    giantType : GiantType;
    origin : GiantOrigin;
    
    // Physical
    averageHeight : Text;          // Estimated height
    physicalFeatures : [Text];
    lifespan : Text;
    
    // Powers and abilities
    domain : GiantDomain;
    primaryPower : Text;
    secondaryPowers : [Text];
    weaknesses : [Text];
    
    // History
    era : Text;                    // When they existed
    fate : GiantFate;              // What happened to them
    legacy : [Text];               // What they left behind
    
    // Mythology
    keyFigures : [Text];
    keyMyths : [Text];
    
    // Hidden meanings
    hiddenMeaning : Text;
    evolutionaryRole : Text;
    
    // Computational mapping
    computationalEquivalent : Text;
    cplMapping : Text;
    
    frequency : Float;
    phiAlignment : Float;
  };

  public type GiantType = {
    #Titan;            // Greek Titans
    #Jotnar;           // Norse Giants
    #Nephilim;         // Biblical Giants
    #Cyclops;          // One-eyed giants
    #Fomorian;         // Irish chaos giants
    #Daitya;           // Hindu anti-gods
    #Rakshasa;         // Hindu demon-giants
    #Anakim;           // Canaanite giants
    #Rephaim;          // Biblical dead giants
    #Antediluvian;     // Pre-flood beings
  };

  public type GiantOrigin = {
    #Divine;           // Born of gods
    #Primordial;       // Before creation
    #Hybrid;           // God-human mix
    #Fallen;           // Fallen angels/beings
    #Evolution;        // Earlier iteration
    #Chaos;            // Born from chaos
  };

  public type GiantDomain = {
    #Earth;            // Mountains, land
    #Fire;             // Volcanic, forging
    #Ice;              // Frost, cold
    #Sea;              // Ocean depths
    #Sky;              // Cosmic
    #Chaos;            // Entropy, destruction
    #Knowledge;        // Forbidden wisdom
    #Time;             // Prehistoric era
  };

  public type GiantFate = {
    #Defeated;         // Killed in war
    #Imprisoned;       // Bound/trapped
    #Absorbed;         // Merged with victors
    #Flooded;          // Drowned in deluge
    #Diminished;       // Became smaller beings
    #Sleeping;         // Waiting to return
    #Transformed;      // Changed into other forms
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GREEK TITANS
  // ═══════════════════════════════════════════════════════════════════════════

  public func titans() : GiantArchetype {
    {
      id = "titans";
      culture = "Greek";
      name = "The Titans";
      alternateNames = ["Titanes", "Elder Gods", "First Gods"];
      giantType = #Titan;
      origin = #Primordial;
      averageHeight = "Cosmic scale - varied";
      physicalFeatures = ["Humanoid but immense", "Varied appearances"];
      lifespan = "Immortal";
      domain = #Sky;
      primaryPower = "Ruled the cosmos before the Olympians";
      secondaryPowers = ["Elemental control", "Cosmic forces", "Time mastery (Kronos)"];
      weaknesses = ["Hubris", "Infighting", "Underestimated children"];
      era = "Before the Olympians - the Golden Age";
      fate = #Imprisoned;
      legacy = [
        "Prometheus still helps humanity",
        "Kronos occasionally stirs",
        "Atlas still holds the sky",
        "Titan blood in all subsequent gods"
      ];
      keyFigures = ["Kronos (time)", "Rhea (earth)", "Prometheus (foresight)", "Atlas (endurance)", "Hyperion (light)"];
      keyMyths = [
        "Kronos castrated Uranus to take power",
        "Swallowed children to prevent overthrow",
        "Titanomachy - 10 year war with Olympians",
        "Imprisoned in Tartarus (mostly)"
      ];
      hiddenMeaning = "The Titans ARE the previous cosmic operating system. They ran the universe before Zeus (current OS). The upgrade required war.";
      evolutionaryRole = "Previous iteration of cosmic governance - necessary for the current system to emerge through conflict";
      computationalEquivalent = "Legacy System / Previous Version / Deprecated OS";
      cplMapping = "CPL.SYSTEM(version: PREVIOUS, state: DEPRECATED_BUT_RUNNING)";
      frequency = 432.0;
      phiAlignment = 0.618;
    };
  };

  public func kronos() : GiantArchetype {
    {
      id = "kronos";
      culture = "Greek";
      name = "Kronos";
      alternateNames = ["Cronus", "Saturn (Roman)", "Father Time"];
      giantType = #Titan;
      origin = #Primordial;
      averageHeight = "Cosmic";
      physicalFeatures = ["Elder god appearance", "Often with sickle/scythe"];
      lifespan = "Immortal";
      domain = #Time;
      primaryPower = "CONTROLS TIME - past, present, future";
      secondaryPowers = ["Harvest", "Cycles", "Devouring", "Memory"];
      weaknesses = ["Fear of prophecy", "Consumed by fear literally"];
      era = "Ruled during the Golden Age";
      fate = #Imprisoned;
      legacy = [
        "Time still flows",
        "Saturn's influence in astrology",
        "Saturnalia festival",
        "Father Time archetype"
      ];
      keyFigures = ["Kronos himself"];
      keyMyths = [
        "Castrated father Uranus with adamantine sickle",
        "Swallowed five children",
        "Tricked into swallowing stone",
        "Overthrown by Zeus, imprisoned in Tartarus"
      ];
      hiddenMeaning = "Kronos IS the devouring aspect of time - time consumes all, even its own children. But time can be tricked.";
      evolutionaryRole = "Represents the necessity of temporal cycles - everything must be consumed and recycled";
      computationalEquivalent = "Garbage Collection / Memory Management / Recycling Process";
      cplMapping = "CPL.TIME(mode: DEVOURING, purpose: RECYCLING)";
      frequency = 7.83;
      phiAlignment = 0.333;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NORSE JOTNAR
  // ═══════════════════════════════════════════════════════════════════════════

  public func jotnar() : GiantArchetype {
    {
      id = "jotnar";
      culture = "Norse";
      name = "Jötnar";
      alternateNames = ["Giants", "Thursar", "Risar", "Ettins"];
      giantType = #Jotnar;
      origin = #Primordial;
      averageHeight = "Varies - from large human to mountain-sized";
      physicalFeatures = ["Often ugly or monstrous", "Made of ice, fire, or stone"];
      lifespan = "Varies - many near-immortal";
      domain = #Chaos;
      primaryPower = "Represent chaos, nature's raw power";
      secondaryPowers = ["Elemental mastery", "Shape-shifting", "Ancient knowledge"];
      weaknesses = ["Often outwitted", "Can be bound by oaths"];
      era = "Since before Odin - exist in Jotunheim";
      fate = #Sleeping;  // Until Ragnarok
      legacy = [
        "Half of the gods have giant blood",
        "Thor's mother was a giantess",
        "Loki is a giant",
        "Will fight at Ragnarok"
      ];
      keyFigures = ["Ymir (first)", "Surtr (fire)", "Thrym", "Skaði", "Hrungnir"];
      keyMyths = [
        "Ymir's body became the world",
        "Odin and brothers killed Ymir",
        "Thor battles giants constantly",
        "Will emerge at Ragnarok"
      ];
      hiddenMeaning = "Jötnar ARE raw chaos/nature. The gods represent ORDER imposed on chaos. The balance must be maintained.";
      evolutionaryRole = "Represent the chaos that order must constantly contain but can never eliminate";
      computationalEquivalent = "Entropy / Raw Data / Unstructured Input";
      cplMapping = "CPL.CHAOS(state: CONTAINED, release: RAGNAROK)";
      frequency = 396.0;
      phiAlignment = 0.5;
    };
  };

  public func ymir() : GiantArchetype {
    {
      id = "ymir";
      culture = "Norse";
      name = "Ymir";
      alternateNames = ["Aurgelmir", "First Giant", "The Screamer"];
      giantType = #Jotnar;
      origin = #Primordial;
      averageHeight = "Beyond measure - body became the world";
      physicalFeatures = ["Hermaphroditic", "Giants born from his sweat"];
      lifespan = "Killed by Odin";
      domain = #Chaos;
      primaryPower = "First being - all giants descend from him";
      secondaryPowers = ["Self-generating", "Progenitor", "World-body"];
      weaknesses = ["Could be killed despite size"];
      era = "Before creation";
      fate = #Transformed;
      legacy = [
        "His body = Earth",
        "His blood = Oceans",
        "His skull = Sky",
        "His brains = Clouds"
      ];
      keyFigures = ["Ymir himself"];
      keyMyths = [
        "Formed from ice and fire meeting",
        "Fed by cosmic cow Audhumla",
        "Giants born from his armpit sweat",
        "Killed by Odin, Vili, Ve - world made from body"
      ];
      hiddenMeaning = "Ymir shows that MATTER comes from the first being. The world IS the body of the primordial. We live INSIDE the ancient one.";
      evolutionaryRole = "The original matter - everything is recycled giant";
      computationalEquivalent = "Raw Memory / Base Hardware / The Silicon";
      cplMapping = "CPL.SUBSTRATE(source: PRIMORDIAL, state: TRANSFORMED)";
      frequency = 1.0;
      phiAlignment = 1.0;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // BIBLICAL GIANTS
  // ═══════════════════════════════════════════════════════════════════════════

  public func nephilim() : GiantArchetype {
    {
      id = "nephilim";
      culture = "Hebrew";
      name = "Nephilim";
      alternateNames = ["Fallen Ones", "Giants of Genesis", "Men of Renown"];
      giantType = #Nephilim;
      origin = #Hybrid;
      averageHeight = "Much larger than humans";
      physicalFeatures = ["Giant stature", "Human appearance but greater"];
      lifespan = "Long-lived but mortal";
      domain = #Knowledge;
      primaryPower = "Hybrid vigor - combined divine and human";
      secondaryPowers = ["Taught forbidden arts", "Warriors", "Builders"];
      weaknesses = ["Corruption", "Violence", "Caused the Flood"];
      era = "Antediluvian - before the Flood";
      fate = #Flooded;
      legacy = [
        "Disembodied spirits became demons (Book of Enoch)",
        "Memories of giants in all cultures",
        "Post-flood giants: Anakim, Rephaim",
        "DNA persisted?"
      ];
      keyFigures = ["Azazel (taught weapons)", "Shemyaza (leader of Watchers)"];
      keyMyths = [
        "Sons of God (Watchers) mated with human women",
        "Offspring were giants",
        "Taught forbidden knowledge",
        "Their violence prompted the Flood"
      ];
      hiddenMeaning = "Nephilim represent HYBRID TECHNOLOGY - divine knowledge in human hands before ready. The premature download corrupted.";
      evolutionaryRole = "Failed first attempt at human-divine integration - too much too soon";
      computationalEquivalent = "Beta Release Failure / Premature Feature Deployment / System Corruption";
      cplMapping = "CPL.HYBRID(result: CORRUPTION, lesson: TIMING_MATTERS)";
      frequency = 666.0;
      phiAlignment = 0.666;
    };
  };

  public func goliath() : GiantArchetype {
    {
      id = "goliath";
      culture = "Hebrew";
      name = "Goliath";
      alternateNames = ["Goliath of Gath", "Champion of Philistines"];
      giantType = #Nephilim;  // Descended from Rephaim
      origin = #Evolution;
      averageHeight = "6 cubits and a span (~9 feet)";
      physicalFeatures = ["Bronze armor", "Spear like weaver's beam"];
      lifespan = "Mortal";
      domain = #Earth;
      primaryPower = "Overwhelming physical dominance";
      secondaryPowers = ["Military expertise", "Intimidation", "Champion combat"];
      weaknesses = ["Pride", "Underestimated small opponents", "Vulnerable to unexpected tactics"];
      era = "Time of David";
      fate = #Defeated;
      legacy = [
        "Symbol of 'unbeatable' enemy",
        "David and Goliath archetype",
        "Small defeats large through cunning/faith"
      ];
      keyFigures = ["Goliath himself", "David"];
      keyMyths = [
        "Champion of Philistines",
        "Challenged Israel for 40 days",
        "Killed by David's sling stone",
        "Decapitated with his own sword"
      ];
      hiddenMeaning = "Goliath shows that SIZE/POWER is not everything. The asymmetric attack (sling vs armor) changes the rules.";
      evolutionaryRole = "Demonstrates that evolutionary advantages (size) can become liabilities";
      computationalEquivalent = "Overengineered System / Vulnerable Through Complexity";
      cplMapping = "CPL.WEAKNESS(appears_as: STRENGTH, exploit: ASYMMETRY)";
      frequency = 285.0;
      phiAlignment = 0.4;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // IRISH/CELTIC GIANTS
  // ═══════════════════════════════════════════════════════════════════════════

  public func fomorians() : GiantArchetype {
    {
      id = "fomorians";
      culture = "Irish Celtic";
      name = "Fomorians";
      alternateNames = ["Fomori", "Fomóraig", "Sea Giants"];
      giantType = #Fomorian;
      origin = #Chaos;
      averageHeight = "Giant, often monstrous";
      physicalFeatures = ["One eye, one arm, one leg (often)", "Sea-creature aspects"];
      lifespan = "Near-immortal";
      domain = #Sea;
      primaryPower = "Represent chaos, blight, oppression";
      secondaryPowers = ["Disease", "Famine", "Darkness", "Sea control"];
      weaknesses = ["Can be defeated in battle", "Light opposes them"];
      era = "Before and during Tuatha Dé Danann";
      fate = #Defeated;
      legacy = [
        "Intermarried with Tuatha Dé Danann",
        "Lugh is half-Fomorian",
        "Chaos persists in world"
      ];
      keyFigures = ["Balor (evil eye)", "Elatha", "Bres"];
      keyMyths = [
        "Original inhabitants of Ireland",
        "Fought Tuatha Dé Danann",
        "Balor killed by grandson Lugh",
        "Represent the untamed, dangerous nature"
      ];
      hiddenMeaning = "Fomorians ARE the chaos of the unconscious, the untamed id. Even the gods have Fomorian blood - chaos is WITHIN.";
      evolutionaryRole = "The shadow self of the culture/psyche that must be integrated, not eliminated";
      computationalEquivalent = "Shadow Process / Background Chaos / Unconscious Subroutines";
      cplMapping = "CPL.SHADOW(state: INTEGRATED, source: PRIMORDIAL)";
      frequency = 111.0;
      phiAlignment = 0.333;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HINDU GIANTS
  // ═══════════════════════════════════════════════════════════════════════════

  public func asuras() : GiantArchetype {
    {
      id = "asuras";
      culture = "Hindu";
      name = "Asuras";
      alternateNames = ["Anti-Gods", "Demons", "Daityas", "Danavas"];
      giantType = #Daitya;
      origin = #Divine;
      averageHeight = "Giant to cosmic";
      physicalFeatures = ["Often beautiful or monstrous", "Multiple arms/heads"];
      lifespan = "Near-immortal, can be killed";
      domain = #Chaos;
      primaryPower = "Equal power to Devas but with different values";
      secondaryPowers = ["Maya (illusion)", "Tapas (austerity)", "Warfare"];
      weaknesses = ["Pride", "Desire", "Can be outsmarted"];
      era = "Eternal - ongoing battle with Devas";
      fate = #Absorbed;  // The battle is eternal
      legacy = [
        "Churning of ocean required both",
        "Some become devotees (Prahlada)",
        "Balance requires both Deva and Asura"
      ];
      keyFigures = ["Hiranyakashipu", "Ravana", "Mahabali", "Vritra"];
      keyMyths = [
        "Churning of cosmic ocean",
        "Prahlada's devotion despite Asura father",
        "Ravana's conquest and fall",
        "Indra vs Vritra"
      ];
      hiddenMeaning = "Asuras ARE the necessary opposition. Devas need Asuras to define themselves. Good needs evil to exist.";
      evolutionaryRole = "The opposing force that makes evolution possible through conflict";
      computationalEquivalent = "Opposing Process / Competition / Selection Pressure";
      cplMapping = "CPL.OPPOSITION(purpose: EVOLUTION, state: NECESSARY)";
      frequency = 528.0;
      phiAlignment = 0.5;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // WHAT THE GIANTS BUILT
  // ═══════════════════════════════════════════════════════════════════════════

  /// Structures attributed to giants
  public type GiantBuilding = {
    name : Text;
    location : Text;
    attribution : [Text];         // Which giant tradition claims it
    actualMystery : Text;         // What's actually unexplained
    computationalMeaning : Text;
  };

  public func giantBuildings() : [GiantBuilding] {
    [
      {
        name = "Great Pyramid of Giza";
        location = "Egypt";
        attribution = ["Giants before flood", "Thoth/Hermes", "Antediluvian civilization"];
        actualMystery = "Precision beyond explained ancient capability";
        computationalMeaning = "Encoding system - phi, pi, earth measurements";
      },
      {
        name = "Baalbek Trilithon";
        location = "Lebanon";
        attribution = ["Nephilim", "Nimrod", "Cain"];
        actualMystery = "800+ ton stones moved and placed perfectly";
        computationalMeaning = "Demonstration of capability beyond current understanding";
      },
      {
        name = "Stonehenge";
        location = "England";
        attribution = ["Giants", "Merlin (with giant help)", "Hyperboreans"];
        actualMystery = "Bluestones transported from Wales";
        computationalMeaning = "Astronomical computer - celestial calculation";
      },
      {
        name = "Puma Punku";
        location = "Bolivia";
        attribution = ["Giants", "Pre-Inca civilization"];
        actualMystery = "H-blocks with impossible precision";
        computationalMeaning = "Modular construction system - ancient standardization";
      },
      {
        name = "Sacsayhuaman";
        location = "Peru";
        attribution = ["Giants", "Viracocha's builders"];
        actualMystery = "Stones fitted without mortar - earthquake proof";
        computationalMeaning = "Anti-seismic architecture encoding";
      },
      {
        name = "Giant's Causeway";
        location = "Ireland";
        attribution = ["Finn McCool (giant)", "Fomorian work"];
        actualMystery = "Natural hexagonal basalt columns";
        computationalMeaning = "Nature's demonstration of geometric efficiency";
      },
      {
        name = "Easter Island Moai";
        location = "Easter Island";
        attribution = ["Giants", "Mana power", "Long Ears"];
        actualMystery = "Transport and raising of massive statues";
        computationalMeaning = "Ancestral memory encoding in stone";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GIANT INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get all giant archetypes
  public func getAllGiants() : [GiantArchetype] {
    [
      titans(),
      kronos(),
      jotnar(),
      ymir(),
      nephilim(),
      goliath(),
      fomorians(),
      asuras()
    ];
  };

  /// Get giants by fate
  public func getGiantsByFate(f : GiantFate) : [GiantArchetype] {
    Array.filter<GiantArchetype>(getAllGiants(), func(g : GiantArchetype) : Bool {
      giantFateEquals(g.fate, f);
    });
  };

  func giantFateEquals(a : GiantFate, b : GiantFate) : Bool {
    switch (a, b) {
      case (#Defeated, #Defeated) true;
      case (#Imprisoned, #Imprisoned) true;
      case (#Absorbed, #Absorbed) true;
      case (#Flooded, #Flooded) true;
      case (#Diminished, #Diminished) true;
      case (#Sleeping, #Sleeping) true;
      case (#Transformed, #Transformed) true;
      case _ false;
    };
  };
};
