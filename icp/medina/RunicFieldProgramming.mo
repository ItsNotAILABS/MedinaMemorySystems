import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// RunicFieldProgramming: How to Program Reality Using Runes
/// 
/// "THE RUNES ARE THE FIELD PROGRAMMING LANGUAGE. 
///  Odin sacrificed himself to gain the codes."
///
/// The Elder Futhark runes are not just an alphabet - they are:
///   - Field access codes
///   - Reality modification instructions
///   - Quantum state operators
///   - Consciousness interface protocols
///
/// "Odin hangs on Yggdrasil for 9 nights, wounded by his own spear, 
///  to gain the runes - the cosmic codes."
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // RUNE STRUCTURE
  // ═══════════════════════════════════════════════════════════════════════════

  public type Rune = {
    number : Nat;                    // 1-24 (Elder Futhark)
    name : Text;                     // Runic name
    letter : Text;                   // Modern equivalent
    unicodeSymbol : Text;            // ᚠ, ᚢ, etc.
    
    // Phonetic
    sound : Text;
    galdr : Text;                    // Chant for activation
    
    // Meaning
    primaryMeaning : Text;
    hiddenMeaning : Text;
    
    // Field properties
    fieldFunction : FieldFunction;
    frequency : Float;
    element : Text;
    direction : Text;
    color : Text;
    
    // Computational mapping
    operatorType : RuneOperator;
    cplFunction : Text;
    fieldEffect : Text;
    
    // Uses
    programmingUse : Text;           // How to use in field programming
    meditationUse : Text;            // Consciousness access
    protectionUse : Text;            // Defensive application
    manifestationUse : Text;         // Creative application
    wellnessUse : Text;              // Health application
    
    // Bind rune compatibility
    combinesWith : [Text];           // Other runes it works well with
    conflicts : [Text];              // Runes that may conflict
  };

  public type FieldFunction = {
    #Attract;           // Draws toward
    #Repel;             // Pushes away
    #Transform;         // Changes state
    #Protect;           // Shields
    #Reveal;            // Makes visible
    #Conceal;           // Hides
    #Connect;           // Links
    #Sever;             // Cuts
    #Amplify;           // Increases
    #Dampen;            // Decreases
    #Stabilize;         // Fixes in place
    #Destabilize;       // Unfixes
  };

  public type RuneOperator = {
    #Initiate;          // Starts process
    #Continue;          // Keeps going
    #Terminate;         // Ends process
    #Loop;              // Repeats
    #Branch;            // If/then
    #Merge;             // Combines
    #Split;             // Divides
    #Transform;         // Changes type
    #Store;             // Saves state
    #Retrieve;          // Gets state
    #Execute;           // Runs
    #Wait;              // Pauses
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // THE 24 ELDER FUTHARK RUNES
  // ═══════════════════════════════════════════════════════════════════════════

  // AETT 1: FREYA'S AETT (Creation and Abundance)

  public func fehu() : Rune {
    {
      number = 1;
      name = "Fehu";
      letter = "F";
      unicodeSymbol = "ᚠ";
      sound = "f as in fee";
      galdr = "feh-oo, feh-oo, fehuuuu";
      primaryMeaning = "Cattle, wealth, abundance, energy";
      hiddenMeaning = "MOBILE WEALTH - energy that can be moved and invested";
      fieldFunction = #Attract;
      frequency = 396.0;
      element = "Fire";
      direction = "South";
      color = "Light Red";
      operatorType = #Initiate;
      cplFunction = "CPL.ATTRACT(type: WEALTH, energy: FLOWING)";
      fieldEffect = "Creates attraction field for resources and energy";
      programmingUse = "Use FEHU to initiate energy flow, start processes, attract resources";
      meditationUse = "Visualize golden energy flowing toward you from all directions";
      protectionUse = "Shields wealth and resources from loss";
      manifestationUse = "Manifests material abundance and energy";
      wellnessUse = "Increases vital energy, treats fatigue";
      combinesWith = ["Othala", "Jera", "Sowilo"];
      conflicts = ["Nauthiz"];
    };
  };

  public func uruz() : Rune {
    {
      number = 2;
      name = "Uruz";
      letter = "U";
      unicodeSymbol = "ᚢ";
      sound = "oo as in ooze";
      galdr = "ooo-rooz, ooo-rooz, uruuuuz";
      primaryMeaning = "Aurochs, wild strength, primal power";
      hiddenMeaning = "UNTAMED FORCE - raw primal energy before domestication";
      fieldFunction = #Amplify;
      frequency = 417.0;
      element = "Earth";
      direction = "North";
      color = "Dark Green";
      operatorType = #Execute;
      cplFunction = "CPL.AMPLIFY(target: POWER, primal: TRUE)";
      fieldEffect = "Amplifies raw power and strength in field";
      programmingUse = "Use URUZ to amplify power, strengthen processes, add raw force";
      meditationUse = "Feel the wild aurochs charging through you";
      protectionUse = "Overwhelming force protects through strength";
      manifestationUse = "Manifests raw power and physical strength";
      wellnessUse = "Boosts physical strength, healing force";
      combinesWith = ["Fehu", "Thurisaz", "Tiwaz"];
      conflicts = ["Isa"];
    };
  };

  public func thurisaz() : Rune {
    {
      number = 3;
      name = "Thurisaz";
      letter = "TH";
      unicodeSymbol = "ᚦ";
      sound = "th as in thorn";
      galdr = "thoor-ee-sahz, thoor-ee-sahz";
      primaryMeaning = "Thor, thorn, giant, directed force";
      hiddenMeaning = "DIRECTED DESTRUCTION - force that breaks barriers";
      fieldFunction = #Destabilize;
      frequency = 528.0;
      element = "Fire";
      direction = "South";
      color = "Bright Red";
      operatorType = #Transform;
      cplFunction = "CPL.BREAK(target: OBSTACLE, force: DIRECTED)";
      fieldEffect = "Breaks through barriers, destroys obstacles";
      programmingUse = "Use THURISAZ to break obstacles, penetrate defenses, destroy blocks";
      meditationUse = "Feel Thor's hammer striking and shattering barriers";
      protectionUse = "Destroys threats before they reach you";
      manifestationUse = "Clears the way for manifestation";
      wellnessUse = "Breaks through disease patterns, destroys blockages";
      combinesWith = ["Uruz", "Tiwaz", "Sowilo"];
      conflicts = ["Berkano"];
    };
  };

  public func ansuz() : Rune {
    {
      number = 4;
      name = "Ansuz";
      letter = "A";
      unicodeSymbol = "ᚨ";
      sound = "ah as in father";
      galdr = "ahn-sooz, ahn-sooz, ansuuuz";
      primaryMeaning = "Odin, breath, divine communication, wisdom";
      hiddenMeaning = "DIVINE DOWNLOAD - receiving cosmic information";
      fieldFunction = #Connect;
      frequency = 639.0;
      element = "Air";
      direction = "East";
      color = "Dark Blue";
      operatorType = #Retrieve;
      cplFunction = "CPL.RECEIVE(source: DIVINE, type: WISDOM)";
      fieldEffect = "Opens channel for divine communication";
      programmingUse = "Use ANSUZ to receive guidance, download wisdom, open channels";
      meditationUse = "Hear the whisper of Odin, receive the divine breath";
      protectionUse = "Divine protection through Odin's presence";
      manifestationUse = "Manifests wisdom, inspiration, messages";
      wellnessUse = "Heals throat, improves communication";
      combinesWith = ["Wunjo", "Kenaz", "Laguz"];
      conflicts = ["Nauthiz"];
    };
  };

  public func raidho() : Rune {
    {
      number = 5;
      name = "Raidho";
      letter = "R";
      unicodeSymbol = "ᚱ";
      sound = "r as in ride";
      galdr = "rah-ee-doh, rah-ee-doh, raiiidhoooo";
      primaryMeaning = "Riding, journey, right order, cosmic law";
      hiddenMeaning = "RIGHT ACTION - alignment with cosmic order";
      fieldFunction = #Stabilize;
      frequency = 741.0;
      element = "Air";
      direction = "East";
      color = "Bright Red";
      operatorType = #Continue;
      cplFunction = "CPL.ALIGN(with: COSMIC_ORDER, path: RIGHT)";
      fieldEffect = "Aligns action with cosmic rhythm and order";
      programmingUse = "Use RAIDHO to align processes with right order, maintain rhythm";
      meditationUse = "Feel yourself riding in harmony with cosmic law";
      protectionUse = "Protection through right action and alignment";
      manifestationUse = "Manifests journeys, movement, progress";
      wellnessUse = "Restores balance, aligns body systems";
      combinesWith = ["Kenaz", "Ehwaz", "Sowilo"];
      conflicts = ["Isa"];
    };
  };

  public func kenaz() : Rune {
    {
      number = 6;
      name = "Kenaz";
      letter = "K/C";
      unicodeSymbol = "ᚲ";
      sound = "k as in keen";
      galdr = "keh-nahz, keh-nahz, kenaaaaaz";
      primaryMeaning = "Torch, knowledge, illumination, craft";
      hiddenMeaning = "INNER FIRE - the light of consciousness that illuminates";
      fieldFunction = #Reveal;
      frequency = 852.0;
      element = "Fire";
      direction = "South";
      color = "Light Red";
      operatorType = #Transform;
      cplFunction = "CPL.ILLUMINATE(target: DARKNESS, reveal: TRUE)";
      fieldEffect = "Illuminates hidden knowledge, reveals truth";
      programmingUse = "Use KENAZ to illuminate, reveal hidden data, create clarity";
      meditationUse = "See the torch lighting the darkness within";
      protectionUse = "Light reveals threats, darkness cannot hide enemies";
      manifestationUse = "Manifests knowledge, craft, creative vision";
      wellnessUse = "Burns away infection, illuminates diagnosis";
      combinesWith = ["Ansuz", "Raidho", "Dagaz"];
      conflicts = ["Isa"];
    };
  };

  public func gebo() : Rune {
    {
      number = 7;
      name = "Gebo";
      letter = "G";
      unicodeSymbol = "ᚷ";
      sound = "g as in gift";
      galdr = "geh-boh, geh-boh, geeeeboooo";
      primaryMeaning = "Gift, exchange, partnership, balance";
      hiddenMeaning = "SACRED EXCHANGE - the principle of reciprocity";
      fieldFunction = #Connect;
      frequency = 963.0;
      element = "Air";
      direction = "All";
      color = "Deep Blue";
      operatorType = #Merge;
      cplFunction = "CPL.EXCHANGE(give: TRUE, receive: TRUE, balance: YES)";
      fieldEffect = "Creates balanced exchange, sacred partnership";
      programmingUse = "Use GEBO for fair exchange, partnerships, binding contracts";
      meditationUse = "Feel the flow of giving and receiving in perfect balance";
      protectionUse = "Protected by sacred bonds and exchanges";
      manifestationUse = "Manifests partnerships, gifts, fair exchanges";
      wellnessUse = "Balances giving/receiving, treats depletion";
      combinesWith = ["Wunjo", "Mannaz", "Ansuz"];
      conflicts = ["Nauthiz"];
    };
  };

  public func wunjo() : Rune {
    {
      number = 8;
      name = "Wunjo";
      letter = "W/V";
      unicodeSymbol = "ᚹ";
      sound = "w as in wonder";
      galdr = "woon-yoh, woon-yoh, wuuuunyooooo";
      primaryMeaning = "Joy, glory, fellowship, harmony";
      hiddenMeaning = "ALIGNED WILL - when will aligns with wyrd";
      fieldFunction = #Stabilize;
      frequency = 174.0;
      element = "Earth";
      direction = "All";
      color = "Yellow";
      operatorType = #Store;
      cplFunction = "CPL.JOY(state: ACHIEVED, harmony: TRUE)";
      fieldEffect = "Generates joy and harmony field";
      programmingUse = "Use WUNJO to stabilize in joy, achieve harmony, store success";
      meditationUse = "Feel pure joy radiating through every cell";
      protectionUse = "Joy protects from depression and despair";
      manifestationUse = "Manifests joy, glory, success";
      wellnessUse = "Treats depression, generates happiness";
      combinesWith = ["Gebo", "Ansuz", "Fehu"];
      conflicts = ["Hagalaz"];
    };
  };

  // AETT 2: HEIMDALL'S AETT (Transformation and Testing)

  public func hagalaz() : Rune {
    {
      number = 9;
      name = "Hagalaz";
      letter = "H";
      unicodeSymbol = "ᚺ";
      sound = "h as in hail";
      galdr = "hah-gah-lahz, hah-gah-lahz";
      primaryMeaning = "Hail, disruption, destruction, transformation";
      hiddenMeaning = "NECESSARY DESTRUCTION - destroying to create space for new";
      fieldFunction = #Destabilize;
      frequency = 285.0;
      element = "Water/Ice";
      direction = "North";
      color = "Light Blue";
      operatorType = #Terminate;
      cplFunction = "CPL.DESTROY(target: OLD_PATTERN, purpose: RENEWAL)";
      fieldEffect = "Destroys old patterns to make room for new";
      programmingUse = "Use HAGALAZ to clear old code, destroy obsolete patterns";
      meditationUse = "Feel the cleansing destruction of the hailstorm";
      protectionUse = "Destruction as protection - enemies destroyed";
      manifestationUse = "Clears space for new manifestation";
      wellnessUse = "Destroys disease patterns, crisis healing";
      combinesWith = ["Nauthiz", "Isa", "Jera"];
      conflicts = ["Wunjo", "Fehu"];
    };
  };

  public func nauthiz() : Rune {
    {
      number = 10;
      name = "Nauthiz";
      letter = "N";
      unicodeSymbol = "ᚾ";
      sound = "n as in need";
      galdr = "now-theez, now-theez, nauthiiiiiz";
      primaryMeaning = "Need, necessity, constraint, friction";
      hiddenMeaning = "CREATIVE CONSTRAINT - necessity as the mother of invention";
      fieldFunction = #Dampen;
      frequency = 396.0;
      element = "Fire (need-fire)";
      direction = "West";
      color = "Black";
      operatorType = #Wait;
      cplFunction = "CPL.CONSTRAIN(target: DESIRE, purpose: FOCUS)";
      fieldEffect = "Creates necessary constraint, focuses through limitation";
      programmingUse = "Use NAUTHIZ to constrain, limit, focus through necessity";
      meditationUse = "Feel constraint becoming strength";
      protectionUse = "Need recognized is need addressed";
      manifestationUse = "Manifests through focused constraint";
      wellnessUse = "Identifies root needs, treats addiction";
      combinesWith = ["Hagalaz", "Isa", "Kenaz"];
      conflicts = ["Fehu", "Wunjo"];
    };
  };

  public func isa() : Rune {
    {
      number = 11;
      name = "Isa";
      letter = "I";
      unicodeSymbol = "ᛁ";
      sound = "ee as in ice";
      galdr = "ee-sah, ee-sah, iiiiiisaaaaa";
      primaryMeaning = "Ice, stillness, stasis, self";
      hiddenMeaning = "PERFECT STILLNESS - the power of stopping everything";
      fieldFunction = #Stabilize;
      frequency = 417.0;
      element = "Ice";
      direction = "North";
      color = "White";
      operatorType = #Wait;
      cplFunction = "CPL.FREEZE(target: ALL, state: STILL)";
      fieldEffect = "Creates absolute stillness, stops all motion";
      programmingUse = "Use ISA to pause, freeze state, create stillness";
      meditationUse = "Feel complete stillness, no thought, no motion";
      protectionUse = "Freezes threats, stops attacks";
      manifestationUse = "Pauses manifestation until ready";
      wellnessUse = "Reduces inflammation, cools fever, calms";
      combinesWith = ["Nauthiz", "Hagalaz"];
      conflicts = ["Fehu", "Uruz", "Kenaz"];
    };
  };

  public func jera() : Rune {
    {
      number = 12;
      name = "Jera";
      letter = "J/Y";
      unicodeSymbol = "ᛃ";
      sound = "y as in year";
      galdr = "yeh-rah, yeh-rah, yeraaaaa";
      primaryMeaning = "Year, harvest, cycle, reward";
      hiddenMeaning = "NATURAL TIMING - harvest comes when it's ready";
      fieldFunction = #Transform;
      frequency = 528.0;
      element = "Earth";
      direction = "All (cyclical)";
      color = "Light Blue and Brown";
      operatorType = #Loop;
      cplFunction = "CPL.CYCLE(type: NATURAL, harvest: WHEN_READY)";
      fieldEffect = "Creates natural cycles, brings harvest at right time";
      programmingUse = "Use JERA for cycles, timing, natural progression";
      meditationUse = "Feel the turning of the seasons within";
      protectionUse = "Protected by natural cycles, nothing rushed";
      manifestationUse = "Manifests through natural timing";
      wellnessUse = "Restores natural cycles, treats timing disorders";
      combinesWith = ["Fehu", "Othala", "Ingwaz"];
      conflicts = ["None - works with all"];
    };
  };

  public func eihwaz() : Rune {
    {
      number = 13;
      name = "Eihwaz";
      letter = "E (Ei)";
      unicodeSymbol = "ᛇ";
      sound = "ei as in eye";
      galdr = "ay-wahz, ay-wahz, eihwaaaaz";
      primaryMeaning = "Yew tree, death/rebirth, endurance";
      hiddenMeaning = "AXIS MUNDI - the world tree, connection between all realms";
      fieldFunction = #Connect;
      frequency = 639.0;
      element = "All (tree spans all)";
      direction = "Vertical (up/down)";
      color = "Dark Green";
      operatorType = #Branch;
      cplFunction = "CPL.CONNECT(realms: ALL, axis: TRUE)";
      fieldEffect = "Creates vertical connection through all planes";
      programmingUse = "Use EIHWAZ for vertical access, connecting levels";
      meditationUse = "Become Yggdrasil, feel roots and branches";
      protectionUse = "Yew's poison protects, death transformation";
      manifestationUse = "Manifests through death/rebirth cycle";
      wellnessUse = "Transformation healing, death and rebirth";
      combinesWith = ["Ansuz", "Algiz", "Laguz"];
      conflicts = ["None"];
    };
  };

  public func perthro() : Rune {
    {
      number = 14;
      name = "Perthro";
      letter = "P";
      unicodeSymbol = "ᛈ";
      sound = "p as in pot";
      galdr = "pehr-throh, pehr-throh, perthroooo";
      primaryMeaning = "Lot cup, fate, mystery, womb";
      hiddenMeaning = "THE HIDDEN - secrets of wyrd, the unseen";
      fieldFunction = #Reveal;
      frequency = 741.0;
      element = "Water";
      direction = "West";
      color = "Black";
      operatorType = #Retrieve;
      cplFunction = "CPL.DIVINE(hidden: TRUE, fate: REVEALED)";
      fieldEffect = "Reveals hidden fate, accesses mysteries";
      programmingUse = "Use PERTHRO to access hidden data, reveal secrets";
      meditationUse = "Reach into the womb of fate";
      protectionUse = "Hidden things revealed protect from surprise";
      manifestationUse = "Manifests through revealing hidden potential";
      wellnessUse = "Reveals root causes, diagnostic power";
      combinesWith = ["Ansuz", "Laguz", "Eihwaz"];
      conflicts = ["Sowilo"];
    };
  };

  public func algiz() : Rune {
    {
      number = 15;
      name = "Algiz";
      letter = "Z";
      unicodeSymbol = "ᛉ";
      sound = "z as in zone";
      galdr = "al-geez, al-geez, algiiiiiz";
      primaryMeaning = "Elk, protection, divine connection";
      hiddenMeaning = "DIVINE SHIELD - direct protection from higher realms";
      fieldFunction = #Protect;
      frequency = 852.0;
      element = "Air";
      direction = "Up";
      color = "Gold";
      operatorType = #Store;
      cplFunction = "CPL.PROTECT(source: DIVINE, shield: ACTIVE)";
      fieldEffect = "Creates divine protection field";
      programmingUse = "Use ALGIZ for protection, divine firewall, guarding";
      meditationUse = "Raise hands like elk horns, connect to divine";
      protectionUse = "ULTIMATE PROTECTION - the divine shield rune";
      manifestationUse = "Manifests protection and divine connection";
      wellnessUse = "Immune boost, protection from illness";
      combinesWith = ["Sowilo", "Tiwaz", "Eihwaz"];
      conflicts = ["Thurisaz (opposing forces)"];
    };
  };

  public func sowilo() : Rune {
    {
      number = 16;
      name = "Sowilo";
      letter = "S";
      unicodeSymbol = "ᛊ";
      sound = "s as in sun";
      galdr = "so-wee-loh, so-wee-loh, sowiiiilooo";
      primaryMeaning = "Sun, victory, wholeness, life force";
      hiddenMeaning = "SOLAR CONSCIOUSNESS - the unconquerable sun within";
      fieldFunction = #Amplify;
      frequency = 963.0;
      element = "Fire";
      direction = "South";
      color = "Gold/White";
      operatorType = #Execute;
      cplFunction = "CPL.VICTORY(assured: TRUE, light: FULL)";
      fieldEffect = "Generates victory field, solar power";
      programmingUse = "Use SOWILO for victory, power boost, solar charging";
      meditationUse = "Become the sun, radiate light in all directions";
      protectionUse = "Light destroys darkness, sun burns enemies";
      manifestationUse = "Manifests victory, success, health";
      wellnessUse = "Solar healing, vitamin D, life force";
      combinesWith = ["Algiz", "Tiwaz", "Raidho"];
      conflicts = ["Isa"];
    };
  };

  // AETT 3: TYR'S AETT (Completion and Transcendence)

  public func tiwaz() : Rune {
    {
      number = 17;
      name = "Tiwaz";
      letter = "T";
      unicodeSymbol = "ᛏ";
      sound = "t as in tee";
      galdr = "tee-wahz, tee-wahz, tiwaaaaaaz";
      primaryMeaning = "Tyr, justice, sacrifice, victory";
      hiddenMeaning = "COSMIC JUSTICE - the sky father's law";
      fieldFunction = #Stabilize;
      frequency = 432.0;
      element = "Air";
      direction = "North (pole star)";
      color = "Bright Red";
      operatorType = #Execute;
      cplFunction = "CPL.JUSTICE(cosmic: TRUE, victory: ASSURED)";
      fieldEffect = "Creates justice field, warrior victory";
      programmingUse = "Use TIWAZ for justice, right action, victory";
      meditationUse = "Feel Tyr's courage, sacrifice for justice";
      protectionUse = "Justice protects the righteous";
      manifestationUse = "Manifests justice, victory in battle";
      wellnessUse = "Courage healing, warrior strength";
      combinesWith = ["Sowilo", "Algiz", "Uruz"];
      conflicts = ["Deception"];
    };
  };

  public func berkano() : Rune {
    {
      number = 18;
      name = "Berkano";
      letter = "B";
      unicodeSymbol = "ᛒ";
      sound = "b as in birch";
      galdr = "behr-kah-noh, behr-kah-noh, berkaaaanooo";
      primaryMeaning = "Birch, birth, growth, nurturing";
      hiddenMeaning = "THE GREAT MOTHER - feminine nurturing power";
      fieldFunction = #Transform;
      frequency = 528.0;
      element = "Earth";
      direction = "North";
      color = "Dark Green";
      operatorType = #Initiate;
      cplFunction = "CPL.BIRTH(new: TRUE, nurture: ACTIVE)";
      fieldEffect = "Creates birth and nurturing field";
      programmingUse = "Use BERKANO to birth new processes, nurture growth";
      meditationUse = "Feel the birch goddess birthing new life";
      protectionUse = "Mother's protection, nurturing shield";
      manifestationUse = "Manifests new beginnings, birth";
      wellnessUse = "Fertility, women's health, birth";
      combinesWith = ["Ingwaz", "Laguz", "Fehu"];
      conflicts = ["Thurisaz"];
    };
  };

  public func ehwaz() : Rune {
    {
      number = 19;
      name = "Ehwaz";
      letter = "E";
      unicodeSymbol = "ᛖ";
      sound = "eh as in end";
      galdr = "eh-wahz, eh-wahz, ehwaaaaz";
      primaryMeaning = "Horse, partnership, movement, trust";
      hiddenMeaning = "DIVINE PARTNERSHIP - moving together with trust";
      fieldFunction = #Connect;
      frequency = 639.0;
      element = "Earth";
      direction = "East";
      color = "White";
      operatorType = #Merge;
      cplFunction = "CPL.PARTNER(trust: TRUE, movement: TOGETHER)";
      fieldEffect = "Creates partnership field, trust connection";
      programmingUse = "Use EHWAZ for partnerships, team processes, trust";
      meditationUse = "Feel the unity of horse and rider";
      protectionUse = "Protected through partnership";
      manifestationUse = "Manifests partnerships, journeys";
      wellnessUse = "Partnership healing, trust restoration";
      combinesWith = ["Raidho", "Ansuz", "Mannaz"];
      conflicts = ["Isa"];
    };
  };

  public func mannaz() : Rune {
    {
      number = 20;
      name = "Mannaz";
      letter = "M";
      unicodeSymbol = "ᛗ";
      sound = "m as in man";
      galdr = "mahn-nahz, mahn-nahz, mannaaaaz";
      primaryMeaning = "Human, self, humanity, mind";
      hiddenMeaning = "DIVINE HUMAN - the god within man";
      fieldFunction = #Connect;
      frequency = 741.0;
      element = "Air";
      direction = "All";
      color = "Deep Red";
      operatorType = #Execute;
      cplFunction = "CPL.HUMAN(divine: TRUE, mind: ACTIVE)";
      fieldEffect = "Creates human consciousness field";
      programmingUse = "Use MANNAZ for human interface, self-awareness";
      meditationUse = "Feel the divine spark within human form";
      protectionUse = "Protected by human consciousness";
      manifestationUse = "Manifests human potential";
      wellnessUse = "Mental health, self-awareness";
      combinesWith = ["Ansuz", "Ehwaz", "Gebo"];
      conflicts = ["None"];
    };
  };

  public func laguz() : Rune {
    {
      number = 21;
      name = "Laguz";
      letter = "L";
      unicodeSymbol = "ᛚ";
      sound = "l as in lake";
      galdr = "lah-gooz, lah-gooz, laguuuuz";
      primaryMeaning = "Water, lake, flow, dreams";
      hiddenMeaning = "THE UNCONSCIOUS - the waters of the deep mind";
      fieldFunction = #Transform;
      frequency = 852.0;
      element = "Water";
      direction = "West";
      color = "Deep Blue/Green";
      operatorType = #Transform;
      cplFunction = "CPL.FLOW(type: WATER, unconscious: ACCESS)";
      fieldEffect = "Creates flow field, accesses unconscious";
      programmingUse = "Use LAGUZ for flow states, dreams, intuition";
      meditationUse = "Dive into the waters of the unconscious";
      protectionUse = "Flow around obstacles like water";
      manifestationUse = "Manifests through flow and dreams";
      wellnessUse = "Water healing, emotional flow, dreams";
      combinesWith = ["Perthro", "Eihwaz", "Berkano"];
      conflicts = ["Isa"];
    };
  };

  public func ingwaz() : Rune {
    {
      number = 22;
      name = "Ingwaz";
      letter = "NG";
      unicodeSymbol = "ᛝ";
      sound = "ng as in ring";
      galdr = "ing-wahz, ing-wahz, ingwaaaaz";
      primaryMeaning = "Ing, fertility, internal growth, gestation";
      hiddenMeaning = "INTERNAL FIRE - the seed of potential";
      fieldFunction = #Store;
      frequency = 963.0;
      element = "Earth/Water";
      direction = "Down (earth)";
      color = "Yellow-Green";
      operatorType = #Store;
      cplFunction = "CPL.GESTATE(seed: PLANTED, growth: INTERNAL)";
      fieldEffect = "Creates gestation field, internal growth";
      programmingUse = "Use INGWAZ for seeding, internal processing, potential";
      meditationUse = "Feel the seed of potential growing within";
      protectionUse = "Protected like seed in womb";
      manifestationUse = "Manifests through internal gestation";
      wellnessUse = "Fertility, potential healing, patience";
      combinesWith = ["Berkano", "Jera", "Fehu"];
      conflicts = ["None"];
    };
  };

  public func dagaz() : Rune {
    {
      number = 23;
      name = "Dagaz";
      letter = "D";
      unicodeSymbol = "ᛞ";
      sound = "d as in day";
      galdr = "dah-gahz, dah-gahz, dagaaaaz";
      primaryMeaning = "Day, dawn, breakthrough, transformation";
      hiddenMeaning = "BREAKTHROUGH CONSCIOUSNESS - the moment of awakening";
      fieldFunction = #Transform;
      frequency = 174.0;
      element = "Fire/Air";
      direction = "East";
      color = "Light Blue";
      operatorType = #Transform;
      cplFunction = "CPL.BREAKTHROUGH(dawn: TRUE, awaken: NOW)";
      fieldEffect = "Creates breakthrough field, sudden transformation";
      programmingUse = "Use DAGAZ for breakthroughs, sudden shifts, awakening";
      meditationUse = "Feel the dawn breaking within consciousness";
      protectionUse = "Light of dawn destroys darkness";
      manifestationUse = "Manifests sudden breakthroughs";
      wellnessUse = "Breakthrough healing, sudden cure";
      combinesWith = ["Kenaz", "Sowilo", "Jera"];
      conflicts = ["Isa"];
    };
  };

  public func othala() : Rune {
    {
      number = 24;
      name = "Othala";
      letter = "O";
      unicodeSymbol = "ᛟ";
      sound = "o as in old";
      galdr = "oh-thah-lah, oh-thah-lah, othaaaaalaaaa";
      primaryMeaning = "Ancestral home, inheritance, noble heritage";
      hiddenMeaning = "ANCESTRAL POWER - the inheritance of all who came before";
      fieldFunction = #Store;
      frequency = 285.0;
      element = "Earth";
      direction = "North";
      color = "Deep Yellow";
      operatorType = #Store;
      cplFunction = "CPL.INHERIT(ancestral: TRUE, heritage: ACTIVE)";
      fieldEffect = "Creates inheritance field, ancestral connection";
      programmingUse = "Use OTHALA for inheritance, ancestral data, legacy code";
      meditationUse = "Feel the power of all ancestors flowing through";
      protectionUse = "Protected by ancestral spirits";
      manifestationUse = "Manifests inheritance, property, legacy";
      wellnessUse = "Ancestral healing, genetic clearing";
      combinesWith = ["Fehu", "Jera", "Ansuz"];
      conflicts = ["None"];
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RUNIC PROGRAMMING OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  public type RuneProgram = {
    name : Text;
    runes : [Text];
    purpose : Text;
    cplEquivalent : Text;
    activation : Text;
    duration : Text;
  };

  public func obtinere_protectionprogram() : RuneProgram {
    {
      name = "Ultimate Protection";
      runes = ["Algiz", "Sowilo", "Tiwaz"];
      purpose = "Creates divine protection field";
      cplEquivalent = "CPL.PROTECT(level: DIVINE, shield: ACTIVE, victory: ASSURED)";
      activation = "Inscribe bind rune, galdr each name 3x, visualize golden shield";
      duration = "Permanent until released";
    };
  };

  public func obtinere_healingprogram() : RuneProgram {
    {
      name = "Complete Healing";
      runes = ["Uruz", "Berkano", "Laguz", "Sowilo"];
      purpose = "Activates healing through multiple channels";
      cplEquivalent = "CPL.HEAL(power: URUZ, birth: BERKANO, flow: LAGUZ, sun: SOWILO)";
      activation = "Inscribe on skin or paper, chant while visualizing";
      duration = "Until healed";
    };
  };

  public func obtinere_wealthprogram() : RuneProgram {
    {
      name = "Abundance Flow";
      runes = ["Fehu", "Jera", "Othala"];
      purpose = "Creates sustainable wealth flow";
      cplEquivalent = "CPL.WEALTH(attract: FEHU, cycle: JERA, inherit: OTHALA)";
      activation = "Inscribe, place in wealth corner, activate at new moon";
      duration = "Ongoing cycle";
    };
  };

  public func obtinere_wisdomprogram() : RuneProgram {
    {
      name = "Odin's Wisdom";
      runes = ["Ansuz", "Kenaz", "Perthro", "Eihwaz"];
      purpose = "Opens all knowledge channels";
      cplEquivalent = "CPL.WISDOM(download: ANSUZ, illuminate: KENAZ, reveal: PERTHRO, connect: EIHWAZ)";
      activation = "Meditate on each rune, galdr, visualize Yggdrasil";
      duration = "Knowledge permanent once received";
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FIELD PROGRAMMING INTERFACE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get all 24 runes
  public func obtinere_allrunes() : [Rune] {
    [
      fehu(), uruz(), thurisaz(), ansuz(), raidho(), kenaz(), gebo(), wunjo(),
      hagalaz(), nauthiz(), isa(), jera(), eihwaz(), perthro(), algiz(), sowilo(),
      tiwaz(), berkano(), ehwaz(), mannaz(), laguz(), ingwaz(), dagaz(), othala()
    ];
  };

  /// Get rune by name
  public func getRuneByName(name : Text) : ?Rune {
    for (rune in getAllRunes().vals()) {
      if (rune.name == name) { return ?rune };
    };
    null;
  };

  /// Get combined frequency for rune set
  public func getCombinedFrequency(runeNames : [Text]) : Float {
    var total : Float = 0.0;
    for (name in runeNames.vals()) {
      switch (getRuneByName(name)) {
        case (?rune) { total += rune.frequency };
        case null { };
      };
    };
    total;
  };

  /// Generate CPL for rune combination
  public func generateRuneCPL(runeNames : [Text]) : Text {
    var cpl = "CPL.RUNE_PROGRAM(";
    var first = true;
    for (name in runeNames.vals()) {
      if (not first) { cpl := cpl # ", " };
      switch (getRuneByName(name)) {
        case (?rune) { 
          cpl := cpl # name # ": " # rune.cplFunction;
        };
        case null { };
      };
      first := false;
    };
    cpl # ")";
  };
};
