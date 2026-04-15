import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Array "mo:base/Array";

/// ANCIENT GLYPH CODEX
/// ===================
/// Glyphs are not descriptions — they are TRANSFER MECHANISMS for power.
/// Each glyph carries frequency, geometry, and meaning as computational unit.

module {
  // ═══════════════════════════════════════════════════════════════════════════
  // UNIVERSAL GLYPH TYPE
  // ═══════════════════════════════════════════════════════════════════════════

  public type Glyph = {
    symbol : Text;
    meaning : Text;
    frequency : Float;
    tradition : Text;
    geometry : ?GeometricForm;
    numericValue : ?Nat;
  };

  public type GeometricForm = {
    vertices : Nat;
    edges : Nat;
    faces : Nat;
    symmetryOrder : Nat;
  };

  public type GlyphPhrase = {
    glyphs : [Glyph];
    combinedResonance : Float;
    intentVector : Text;
    timestamp : Int;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FUNDAMENTAL CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════

  public let PHI : Float = 1.6180339887498948482;
  public let PHI_INVERSE : Float = 0.6180339887498948482;
  public let SCHUMANN_HZ : Float = 7.83;
  public let SACRED_432_HZ : Float = 432.0;

  // ═══════════════════════════════════════════════════════════════════════════
  // MAYAN GLYPHS — Vigesimal (Base-20) Computation
  // ═══════════════════════════════════════════════════════════════════════════

  /// Mayan numeral symbols (0-19 in vigesimal)
  public func mayanNumber(n : Nat) : Glyph {
    let ones = n % 5;
    let fives = (n % 20) / 5;
    
    // Build dot-bar representation
    var symbol = "";
    var i = 0;
    while (i < fives) {
      symbol := symbol # "═";
      i += 1;
    };
    i := 0;
    while (i < ones) {
      symbol := symbol # "•";
      i += 1;
    };
    if (n == 0) {
      symbol := "⊝"; // Shell glyph for zero
    };

    {
      symbol = symbol;
      meaning = "Mayan " # Nat.toText(n);
      frequency = SACRED_432_HZ * (1.0 + Float.fromInt(Int.abs(n)) * 0.05);
      tradition = "Mayan";
      geometry = null;
      numericValue = ?n;
    }
  };

  /// 20 Mayan day signs (Tzolkin calendar)
  public func mayanDaySign(index : Nat) : Glyph {
    let signs = [
      ("Imix", "Crocodile/Water Lily", 1),
      ("Ik", "Wind/Breath", 2),
      ("Akbal", "Night/House", 3),
      ("Kan", "Seed/Lizard", 4),
      ("Chicchan", "Serpent", 5),
      ("Cimi", "Death/Transformation", 6),
      ("Manik", "Deer/Hand", 7),
      ("Lamat", "Rabbit/Star", 8),
      ("Muluc", "Water/Jade", 9),
      ("Oc", "Dog", 10),
      ("Chuen", "Monkey/Artisan", 11),
      ("Eb", "Road/Grass", 12),
      ("Ben", "Reed/Corn", 13),
      ("Ix", "Jaguar/Wizard", 14),
      ("Men", "Eagle", 15),
      ("Cib", "Vulture/Owl", 16),
      ("Caban", "Earth/Movement", 17),
      ("Etznab", "Flint/Mirror", 18),
      ("Cauac", "Storm/Rain", 19),
      ("Ahau", "Sun/Lord", 20)
    ];

    let idx = index % 20;
    let (name, meaning, vertices) = signs[idx];

    {
      symbol = name;
      meaning = meaning;
      frequency = SCHUMANN_HZ * Float.fromInt(vertices);
      tradition = "Mayan";
      geometry = ?{
        vertices = vertices;
        edges = vertices;
        faces = 1;
        symmetryOrder = vertices;
      };
      numericValue = ?idx;
    }
  };

  /// Mayan Long Count calculation
  /// Computes days from creation (August 11, 3114 BCE)
  public func mayanLongCount(baktun : Nat, katun : Nat, tun : Nat, uinal : Nat, kin : Nat) : Nat {
    // 1 kin = 1 day
    // 1 uinal = 20 kin
    // 1 tun = 360 kin
    // 1 katun = 7,200 kin
    // 1 baktun = 144,000 kin
    (baktun * 144000) + (katun * 7200) + (tun * 360) + (uinal * 20) + kin
  };

  /// Tzolkin day number (1-260)
  public func tzolkinDay(dayNumber : Nat, daySign : Nat) : Glyph {
    let num = (dayNumber % 13) + 1;
    let sign = mayanDaySign(daySign);
    
    {
      symbol = Nat.toText(num) # " " # sign.symbol;
      meaning = "Tzolkin: " # Nat.toText(num) # " " # sign.meaning;
      frequency = SACRED_432_HZ * PHI * Float.fromInt(num) / 13.0;
      tradition = "Mayan";
      geometry = sign.geometry;
      numericValue = ?((num - 1) * 20 + daySign);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CHINESE GLYPHS — Compressed Meaning Transfer
  // ═══════════════════════════════════════════════════════════════════════════

  /// Five Elements (Wu Xing)
  public func chineseElement(element : Text) : Glyph {
    switch (element) {
      case ("wood") {
        symbol = "木";
        meaning = "Growth/Spring/East";
        frequency = 396.0;
        tradition = "Chinese";
        geometry = ?{ vertices = 4; edges = 4; faces = 1; symmetryOrder = 4 };
        numericValue = ?1;
      };
      case ("fire") {
        symbol = "火";
        meaning = "Transformation/Summer/South";
        frequency = 417.0;
        tradition = "Chinese";
        geometry = ?{ vertices = 3; edges = 3; faces = 1; symmetryOrder = 3 };
        numericValue = ?2;
      };
      case ("earth") {
        symbol = "土";
        meaning = "Stability/Center";
        frequency = 528.0;
        tradition = "Chinese";
        geometry = ?{ vertices = 4; edges = 4; faces = 1; symmetryOrder = 4 };
        numericValue = ?3;
      };
      case ("metal") {
        symbol = "金";
        meaning = "Contraction/Autumn/West";
        frequency = 639.0;
        tradition = "Chinese";
        geometry = ?{ vertices = 6; edges = 6; faces = 1; symmetryOrder = 6 };
        numericValue = ?4;
      };
      case ("water") {
        symbol = "水";
        meaning = "Flowing/Winter/North";
        frequency = 741.0;
        tradition = "Chinese";
        geometry = ?{ vertices = 5; edges = 5; faces = 1; symmetryOrder = 5 };
        numericValue = ?5;
      };
      case (_) {
        symbol = "道";
        meaning = "The Way/Tao";
        frequency = 852.0;
        tradition = "Chinese";
        geometry = null;
        numericValue = ?0;
      };
    }
  };

  /// Eight Trigrams (Ba Gua)
  public func chineseTrigram(index : Nat) : Glyph {
    let trigrams = [
      ("☰", "Qian/Heaven/Creative", 111),    // ≡≡≡
      ("☱", "Dui/Lake/Joyous", 110),         // ≡≡  
      ("☲", "Li/Fire/Clinging", 101),        // ≡ ≡
      ("☳", "Zhen/Thunder/Arousing", 100),   // ≡  
      ("☴", "Xun/Wind/Gentle", 011),         //  ≡≡
      ("☵", "Kan/Water/Abysmal", 010),       //  ≡ 
      ("☶", "Gen/Mountain/Stillness", 001),  //   ≡
      ("☷", "Kun/Earth/Receptive", 000)      //    
    ];

    let idx = index % 8;
    let (symbol, meaning, binary) = trigrams[idx];

    {
      symbol = symbol;
      meaning = meaning;
      frequency = SCHUMANN_HZ * Float.fromInt(idx + 1) * PHI;
      tradition = "Chinese";
      geometry = ?{ vertices = 3; edges = 3; faces = 1; symmetryOrder = 2 };
      numericValue = ?binary;
    }
  };

  /// I Ching Hexagram (64 combinations)
  public func iChingHexagram(upper : Nat, lower : Nat) : Glyph {
    let upperTrigram = chineseTrigram(upper % 8);
    let lowerTrigram = chineseTrigram(lower % 8);
    let hexNumber = (upper % 8) * 8 + (lower % 8) + 1;

    {
      symbol = upperTrigram.symbol # lowerTrigram.symbol;
      meaning = "Hexagram " # Nat.toText(hexNumber) # ": " # upperTrigram.meaning # " over " # lowerTrigram.meaning;
      frequency = (upperTrigram.frequency + lowerTrigram.frequency) / 2.0 * PHI;
      tradition = "Chinese";
      geometry = ?{ vertices = 6; edges = 6; faces = 1; symmetryOrder = 2 };
      numericValue = ?hexNumber;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // EGYPTIAN HIEROGLYPHS — Sacred Geometry
  // ═══════════════════════════════════════════════════════════════════════════

  /// Key Egyptian symbols
  public func egyptianSymbol(name : Text) : Glyph {
    switch (name) {
      case ("ankh") {
        symbol = "☥";
        meaning = "Life/Eternal/Key of Life";
        frequency = SACRED_432_HZ;
        tradition = "Egyptian";
        geometry = ?{ vertices = 5; edges = 5; faces = 1; symmetryOrder = 1 };
        numericValue = ?1;
      };
      case ("eye") {
        symbol = "𓂀";
        meaning = "Eye of Horus/Protection/Royal Power";
        frequency = SACRED_432_HZ * PHI;
        tradition = "Egyptian";
        geometry = ?{ vertices = 6; edges = 9; faces = 1; symmetryOrder = 1 };
        numericValue = ?64; // 1/2 + 1/4 + 1/8 + 1/16 + 1/32 + 1/64
      };
      case ("scarab") {
        symbol = "𓆣";
        meaning = "Khepri/Transformation/Rebirth";
        frequency = SCHUMANN_HZ * SACRED_432_HZ / 100.0;
        tradition = "Egyptian";
        geometry = ?{ vertices = 8; edges = 12; faces = 6; symmetryOrder = 2 };
        numericValue = ?3;
      };
      case ("pyramid") {
        symbol = "△";
        meaning = "Sacred Mountain/Ascension/Immortality";
        frequency = SACRED_432_HZ / PHI;
        tradition = "Egyptian";
        geometry = ?{ vertices = 4; edges = 6; faces = 4; symmetryOrder = 4 };
        numericValue = ?4;
      };
      case ("djed") {
        symbol = "𓊽";
        meaning = "Stability/Osiris Spine/Endurance";
        frequency = SCHUMANN_HZ * 4.0;
        tradition = "Egyptian";
        geometry = ?{ vertices = 4; edges = 4; faces = 1; symmetryOrder = 1 };
        numericValue = ?5;
      };
      case ("was") {
        symbol = "𓌀";
        meaning = "Power/Dominion/Set Scepter";
        frequency = 528.0;
        tradition = "Egyptian";
        geometry = ?{ vertices = 3; edges = 2; faces = 1; symmetryOrder = 1 };
        numericValue = ?6;
      };
      case (_) {
        symbol = "𓆇";
        meaning = "Ma'at/Truth/Justice/Cosmic Order";
        frequency = SACRED_432_HZ * 2.0;
        tradition = "Egyptian";
        geometry = ?{ vertices = 7; edges = 7; faces = 1; symmetryOrder = 1 };
        numericValue = ?42; // Ma'at's 42 laws
      };
    }
  };

  /// Egyptian unit fraction decomposition
  /// Egyptians expressed fractions as sums of unit fractions (1/n)
  public func egyptianFraction(numerator : Nat, denominator : Nat) : [Nat] {
    // Greedy algorithm for Egyptian fraction decomposition
    var num = numerator;
    var den = denominator;
    var result : [Nat] = [];
    
    while (num > 0 and Array.size(result) < 10) {
      // Find smallest unit fraction ≤ num/den
      let unitDen = (den / num) + (if (den % num == 0) { 0 } else { 1 });
      result := Array.append(result, [unitDen]);
      
      // num/den - 1/unitDen = (num*unitDen - den) / (den*unitDen)
      num := num * unitDen - den;
      den := den * unitDen;
      
      // Reduce fraction
      if (num > 0) {
        var gcd = num;
        var b = den;
        while (b != 0) {
          let temp = b;
          b := gcd % b;
          gcd := temp;
        };
        num := num / gcd;
        den := den / gcd;
      };
    };
    
    result
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VEDIC SANSKRIT — Frequency Encoding
  // ═══════════════════════════════════════════════════════════════════════════

  /// Bija (seed) mantras
  public func vedicBija(mantra : Text) : Glyph {
    switch (mantra) {
      case ("om") {
        symbol = "ॐ";
        meaning = "Primordial/Universal/A-U-M";
        frequency = 136.1; // Om resonance frequency
        tradition = "Vedic";
        geometry = ?{ vertices = 3; edges = 3; faces = 1; symmetryOrder = 3 };
        numericValue = ?1;
      };
      case ("lam") {
        symbol = "लं";
        meaning = "Earth/Root Chakra/Muladhara";
        frequency = 194.18; // C note
        tradition = "Vedic";
        geometry = ?{ vertices = 4; edges = 4; faces = 1; symmetryOrder = 4 };
        numericValue = ?1;
      };
      case ("vam") {
        symbol = "वं";
        meaning = "Water/Sacral Chakra/Svadhisthana";
        frequency = 210.42; // D note
        tradition = "Vedic";
        geometry = ?{ vertices = 6; edges = 6; faces = 1; symmetryOrder = 6 };
        numericValue = ?2;
      };
      case ("ram") {
        symbol = "रं";
        meaning = "Fire/Solar Plexus/Manipura";
        frequency = 126.22; // B note
        tradition = "Vedic";
        geometry = ?{ vertices = 10; edges = 10; faces = 1; symmetryOrder = 10 };
        numericValue = ?3;
      };
      case ("yam") {
        symbol = "यं";
        meaning = "Air/Heart Chakra/Anahata";
        frequency = 136.1; // Om frequency
        tradition = "Vedic";
        geometry = ?{ vertices = 12; edges = 12; faces = 1; symmetryOrder = 12 };
        numericValue = ?4;
      };
      case ("ham") {
        symbol = "हं";
        meaning = "Ether/Throat Chakra/Vishuddha";
        frequency = 141.27; // F# note
        tradition = "Vedic";
        geometry = ?{ vertices = 16; edges = 16; faces = 1; symmetryOrder = 16 };
        numericValue = ?5;
      };
      case ("aum") {
        symbol = "ॐ";
        meaning = "Third Eye/Ajna";
        frequency = 221.23; // A note
        tradition = "Vedic";
        geometry = ?{ vertices = 2; edges = 2; faces = 1; symmetryOrder = 2 };
        numericValue = ?6;
      };
      case (_) {
        symbol = "ॐ";
        meaning = "Crown/Sahasrara/Silence";
        frequency = 172.06; // F note
        tradition = "Vedic";
        geometry = ?{ vertices = 1000; edges = 1000; faces = 1; symmetryOrder = 1000 };
        numericValue = ?7;
      };
    }
  };

  /// Seven Chakra glyphs
  public func chakraGlyph(chakraNumber : Nat) : Glyph {
    let chakras = [
      ("Muladhara", "Root", 194.18, "Red", 4),
      ("Svadhisthana", "Sacral", 210.42, "Orange", 6),
      ("Manipura", "Solar Plexus", 126.22, "Yellow", 10),
      ("Anahata", "Heart", 136.1, "Green", 12),
      ("Vishuddha", "Throat", 141.27, "Blue", 16),
      ("Ajna", "Third Eye", 221.23, "Indigo", 2),
      ("Sahasrara", "Crown", 172.06, "Violet", 1000)
    ];

    let idx = chakraNumber % 7;
    let (name, meaning, freq, _color, petals) = chakras[idx];

    {
      symbol = name;
      meaning = meaning # " Chakra";
      frequency = freq;
      tradition = "Vedic";
      geometry = ?{ vertices = petals; edges = petals; faces = 1; symmetryOrder = petals };
      numericValue = ?(idx + 1);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HEBREW LETTERS — Gematria & Tree of Life
  // ═══════════════════════════════════════════════════════════════════════════

  /// 22 Hebrew letters with gematria values
  public func hebrewLetter(index : Nat) : Glyph {
    let letters = [
      ("א", "Aleph", 1, "Breath/Ox"),
      ("ב", "Bet", 2, "House"),
      ("ג", "Gimel", 3, "Camel"),
      ("ד", "Dalet", 4, "Door"),
      ("ה", "He", 5, "Window"),
      ("ו", "Vav", 6, "Hook/Nail"),
      ("ז", "Zayin", 7, "Sword"),
      ("ח", "Chet", 8, "Fence"),
      ("ט", "Tet", 9, "Serpent"),
      ("י", "Yod", 10, "Hand"),
      ("כ", "Kaf", 20, "Palm"),
      ("ל", "Lamed", 30, "Goad"),
      ("מ", "Mem", 40, "Water"),
      ("נ", "Nun", 50, "Fish"),
      ("ס", "Samekh", 60, "Support"),
      ("ע", "Ayin", 70, "Eye"),
      ("פ", "Pe", 80, "Mouth"),
      ("צ", "Tsade", 90, "Hook"),
      ("ק", "Qof", 100, "Needle Eye"),
      ("ר", "Resh", 200, "Head"),
      ("ש", "Shin", 300, "Tooth/Fire"),
      ("ת", "Tav", 400, "Cross/Mark")
    ];

    let idx = index % 22;
    let (symbol, name, value, meaning) = letters[idx];

    {
      symbol = symbol;
      meaning = name # " - " # meaning # " (Path " # Nat.toText(idx + 1) # " on Tree of Life)";
      frequency = SCHUMANN_HZ * Float.fromInt(value) / 10.0;
      tradition = "Hebrew";
      geometry = ?{ vertices = idx + 1; edges = idx + 1; faces = 1; symmetryOrder = 1 };
      numericValue = ?value;
    }
  };

  /// Calculate gematria value of a word
  public func gematria(word : Text) : Nat {
    // Simple mapping for demonstration
    var total = 0;
    for (c in Text.toIter(word)) {
      let value = switch (c) {
        case ('a') { 1 }; case ('b') { 2 }; case ('c') { 3 }; case ('d') { 4 };
        case ('e') { 5 }; case ('f') { 6 }; case ('g') { 7 }; case ('h') { 8 };
        case ('i') { 9 }; case ('j') { 10 }; case ('k') { 20 }; case ('l') { 30 };
        case ('m') { 40 }; case ('n') { 50 }; case ('o') { 60 }; case ('p') { 70 };
        case ('q') { 80 }; case ('r') { 90 }; case ('s') { 100 }; case ('t') { 200 };
        case ('u') { 300 }; case ('v') { 400 }; case ('w') { 500 }; case ('x') { 600 };
        case ('y') { 700 }; case ('z') { 800 }; case (_) { 0 };
      };
      total += value;
    };
    total
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GREEK LETTERS — Mathematical Constants
  // ═══════════════════════════════════════════════════════════════════════════

  /// Greek mathematical symbols
  public func greekLetter(name : Text) : Glyph {
    switch (name) {
      case ("alpha") {
        symbol = "α";
        meaning = "First/Beginning/Fine structure constant";
        frequency = 7.297e-3 * 1e6; // Fine structure constant scaled
        tradition = "Greek";
        geometry = null;
        numericValue = ?1;
      };
      case ("phi") {
        symbol = "φ";
        meaning = "Golden Ratio";
        frequency = PHI * 100.0;
        tradition = "Greek";
        geometry = ?{ vertices = 5; edges = 5; faces = 1; symmetryOrder = 5 };
        numericValue = null;
      };
      case ("pi") {
        symbol = "π";
        meaning = "Circle Ratio";
        frequency = 3.14159265358979 * 100.0;
        tradition = "Greek";
        geometry = ?{ vertices = 0; edges = 1; faces = 2; symmetryOrder = 1000 }; // Circle
        numericValue = null;
      };
      case ("omega") {
        symbol = "Ω";
        meaning = "Last/End/Ohm/Resistance";
        frequency = SACRED_432_HZ * 2.0;
        tradition = "Greek";
        geometry = null;
        numericValue = ?800;
      };
      case ("delta") {
        symbol = "Δ";
        meaning = "Change/Triangle/Fourth";
        frequency = SCHUMANN_HZ * 4.0;
        tradition = "Greek";
        geometry = ?{ vertices = 3; edges = 3; faces = 1; symmetryOrder = 3 };
        numericValue = ?4;
      };
      case ("theta") {
        symbol = "θ";
        meaning = "Angle/Soul/Divine";
        frequency = 360.0;
        tradition = "Greek";
        geometry = null;
        numericValue = ?9;
      };
      case ("lambda") {
        symbol = "λ";
        meaning = "Wavelength/Half-life";
        frequency = 299792458.0 / 1e9; // Speed of light in GHz
        tradition = "Greek";
        geometry = null;
        numericValue = ?30;
      };
      case (_) {
        symbol = "∞";
        meaning = "Infinity/Apeiron";
        frequency = 0.0;
        tradition = "Greek";
        geometry = null;
        numericValue = null;
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GLYPH COMBINATION & RESONANCE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Combine glyphs into a phrase with unified resonance
  public func combineGlyphs(glyphs : [Glyph], intent : Text, timestamp : Int) : GlyphPhrase {
    var totalFreq : Float = 0.0;
    var count : Float = 0.0;

    for (g in glyphs.vals()) {
      totalFreq += g.frequency;
      count += 1.0;
    };

    let avgFreq = if (count > 0.0) { totalFreq / count } else { SCHUMANN_HZ };
    
    // Apply golden ratio modulation for harmonic resonance
    let resonance = avgFreq * PHI / (PHI + 1.0);

    {
      glyphs = glyphs;
      combinedResonance = resonance;
      intentVector = intent;
      timestamp = timestamp;
    }
  };

  /// Calculate resonance between two glyphs (0.0 to 1.0)
  public func glyphResonance(g1 : Glyph, g2 : Glyph) : Float {
    let freqRatio = if (g1.frequency > g2.frequency) {
      g2.frequency / g1.frequency;
    } else {
      g1.frequency / g2.frequency;
    };
    
    // Check for PHI relationship
    let phiDiff = Float.abs(freqRatio - PHI_INVERSE);
    let phiResonance = 1.0 - (phiDiff * 2.0);
    
    // Check for harmonic relationship (octave, fifth, fourth)
    let octaveRes = Float.abs(freqRatio - 0.5);
    let fifthRes = Float.abs(freqRatio - 0.666666);
    let fourthRes = Float.abs(freqRatio - 0.75);
    
    let harmonicRes = 1.0 - Float.min(Float.min(octaveRes, fifthRes), fourthRes) * 2.0;
    
    Float.max(0.0, Float.max(phiResonance, harmonicRes))
  };

  /// Check if glyphs form a sacred pattern
  public func isSacredCombination(glyphs : [Glyph]) : Bool {
    let size = Array.size(glyphs);
    
    // Fibonacci numbers are sacred
    let fibs = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    var isFib = false;
    for (f in fibs.vals()) {
      if (size == f) { isFib := true };
    };
    
    // Powers of 2 (octave doubling)
    let isPowerOf2 = size == 1 or size == 2 or size == 4 or size == 8 or size == 16 or size == 32;
    
    // Sacred numbers: 3, 7, 12, 22, 108
    let isSacredNum = size == 3 or size == 7 or size == 12 or size == 22 or size == 108;
    
    isFib or isPowerOf2 or isSacredNum
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CROSS-TRADITION MAPPINGS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Map chakra to element
  public func chakraToElement(chakra : Nat) : Glyph {
    switch (chakra % 7) {
      case (0) { chineseElement("earth") };
      case (1) { chineseElement("water") };
      case (2) { chineseElement("fire") };
      case (3) { chineseElement("wood") }; // Air ~ Wood (growth/expansion)
      case (4) { chineseElement("metal") }; // Ether ~ Metal (refinement)
      case (5) { greekLetter("theta") }; // Third eye ~ Pure consciousness
      case (_) { greekLetter("omega") }; // Crown ~ Infinity
    }
  };

  /// Map number to multi-tradition glyphs
  public func numberToGlyphs(n : Nat) : [Glyph] {
    [
      mayanNumber(n % 20),
      hebrewLetter(n % 22),
      chakraGlyph(n % 7)
    ]
  };
}
