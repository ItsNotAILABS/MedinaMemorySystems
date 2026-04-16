import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Matalko "./MatalkoICP";

/// AncientGlyphCodex: Symbol-Based Computational Transfer System
/// Ancient civilizations encoded computational principles into glyphs, characters, and symbols.
/// These are NOT just descriptions - they are TRANSFER MECHANISMS for meaning and power.
/// 
/// The insight: Chinese characters compress entire concepts into single forms.
/// Mayan glyphs encode astronomical computation. Egyptian hieroglyphs encode sacred geometry.
/// This module makes those transfer mechanisms COMPUTATIONAL.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // GLYPH TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// The civilization origin of a glyph
  public type GlyphOrigin = {
    #Mayan;
    #Egyptian;
    #Chinese;
    #Vedic;
    #Greek;
    #Hebrew;
    #Sumerian;
    #Celtic;
  };

  /// The computational function of a glyph
  public type GlyphFunction = {
    #Number;          // Encodes quantity
    #Operation;       // Encodes transformation
    #Direction;       // Encodes spatial orientation
    #Element;         // Encodes elemental force
    #Time;            // Encodes temporal cycle
    #Deity;           // Encodes archetypal force
    #Sound;           // Encodes vibrational frequency
    #Geometry;        // Encodes sacred form
  };

  /// A single glyph with its computational properties
  public type Glyph = {
    id : Text;
    origin : GlyphOrigin;
    function : GlyphFunction;
    symbol : Text;           // The actual character/symbol
    meaning : Text;          // Semantic meaning
    numericValue : ?Nat;     // Numeric encoding if applicable
    frequency : Float;       // Vibrational frequency
    phiPosition : Float;     // Position in golden spiral
    geometry : ?GeometryCode; // Sacred geometry encoding
    linkedGlyphs : [Text];   // Related glyphs for compound meaning
  };

  /// Sacred geometry encoding
  public type GeometryCode = {
    vertices : Nat;
    edges : Nat;
    faces : Nat;
    dimension : Nat;
    centerAngle : Float;
  };

  /// A compound glyph phrase (multiple glyphs forming computation)
  public type GlyphPhrase = {
    glyphs : [Glyph];
    combinedMeaning : Text;
    computationalResult : Float;
    resonanceSignature : Float;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MAYAN GLYPH SYSTEM (Vigesimal Computation)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Mayan number glyphs (0-19 in base 20)
  public func mayanNumber(n : Nat) : Glyph {
    let symbols = ["𝋠", "•", "••", "•••", "••••", "—", "—•", "—••", "—•••", "—••••",
                   "═", "═•", "═••", "═•••", "═••••", "≡", "≡•", "≡••", "≡•••", "≡••••"];
    let symbol = if (n < 20) { symbols[n] } else { "𝋡" };
    
    {
      id = "mayan-" # Nat.toText(n);
      origin = #Mayan;
      function = #Number;
      symbol = symbol;
      meaning = "Mayan number " # Nat.toText(n);
      numericValue = ?n;
      frequency = Matalko.FREQ_432 * (1.0 + Float.fromInt(n) / 20.0);
      phiPosition = Matalko.phiEncode(Float.fromInt(n));
      geometry = null;
      linkedGlyphs = [];
    };
  };

  /// Mayan day glyphs (Tzolkin 20 day signs)
  public func mayanDaySign(index : Nat) : Glyph {
    let names = ["Imix", "Ik", "Akbal", "Kan", "Chicchan", "Cimi", "Manik", "Lamat",
                 "Muluc", "Oc", "Chuen", "Eb", "Ben", "Ix", "Men", "Cib", "Caban", 
                 "Etznab", "Cauac", "Ahau"];
    let meanings = ["Crocodile/Water", "Wind/Breath", "Night/House", "Seed/Lizard",
                   "Serpent", "Death", "Deer/Hand", "Rabbit/Star", "Water/Moon", "Dog",
                   "Monkey", "Grass/Road", "Reed", "Jaguar", "Eagle", "Vulture/Owl",
                   "Earth", "Flint/Mirror", "Storm", "Sun/Lord"];
    
    let i = index % 20;
    let name = names[i];
    let meaning = meanings[i];
    
    {
      id = "mayan-day-" # name;
      origin = #Mayan;
      function = #Time;
      symbol = name;
      meaning = meaning;
      numericValue = ?(i + 1);
      frequency = Matalko.FREQ_432 * Matalko.phiPower(i % 8);
      phiPosition = Float.fromInt(i) / 20.0;
      geometry = ?{ vertices = 4; edges = 4; faces = 1; dimension = 2; centerAngle = Float.fromInt(i) * 18.0 };
      linkedGlyphs = [];
    };
  };

  /// Mayan Long Count computation
  public func mayanLongCount(baktun : Nat, katun : Nat, tun : Nat, uinal : Nat, kin : Nat) : GlyphPhrase {
    let totalDays = baktun * 144000 + katun * 7200 + tun * 360 + uinal * 20 + kin;
    
    {
      glyphs = [
        mayanNumber(baktun % 20),
        mayanNumber(katun % 20),
        mayanNumber(tun % 20),
        mayanNumber(uinal % 20),
        mayanNumber(kin % 20)
      ];
      combinedMeaning = "Long Count: " # Nat.toText(totalDays) # " days from creation";
      computationalResult = Float.fromInt(totalDays);
      resonanceSignature = Matalko.phiEncode(Float.fromInt(totalDays));
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CHINESE CHARACTER SYSTEM (Compressed Meaning Transfer)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Chinese elemental characters (Wu Xing)
  public func chineseElement(element : Text) : Glyph {
    let (symbol, meaning, freq) = switch (element) {
      case "wood" ("木", "Wood - Growth, Expansion", 297.0);
      case "fire" ("火", "Fire - Transformation, Action", 396.0);
      case "earth" ("土", "Earth - Stability, Center", 264.0);
      case "metal" ("金", "Metal - Contraction, Refinement", 528.0);
      case "water" ("水", "Water - Flow, Adaptability", 174.0);
      case _ ("氣", "Qi - Life Force", 432.0);
    };
    
    {
      id = "chinese-element-" # element;
      origin = #Chinese;
      function = #Element;
      symbol = symbol;
      meaning = meaning;
      numericValue = null;
      frequency = freq;
      phiPosition = Matalko.phiEncode(freq);
      geometry = null;
      linkedGlyphs = [];
    };
  };

  /// Chinese trigram (Bagua)
  public func chineseTrigram(index : Nat) : Glyph {
    let names = ["☰ Qian", "☱ Dui", "☲ Li", "☳ Zhen", "☴ Xun", "☵ Kan", "☶ Gen", "☷ Kun"];
    let meanings = ["Heaven/Creative", "Lake/Joyous", "Fire/Clinging", "Thunder/Arousing",
                   "Wind/Gentle", "Water/Abysmal", "Mountain/Stillness", "Earth/Receptive"];
    let symbols = ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"];
    
    let i = index % 8;
    
    {
      id = "trigram-" # Nat.toText(i);
      origin = #Chinese;
      function = #Geometry;
      symbol = symbols[i];
      meaning = meanings[i];
      numericValue = ?(i + 1);
      frequency = Matalko.FREQ_432 * (Float.fromInt(i + 1) / 8.0 + 1.0);
      phiPosition = Float.fromInt(i) / 8.0;
      geometry = ?{ vertices = 3; edges = 3; faces = 1; dimension = 2; centerAngle = Float.fromInt(i) * 45.0 };
      linkedGlyphs = [];
    };
  };

  /// I Ching hexagram computation
  public func iChingHexagram(lower : Nat, upper : Nat) : GlyphPhrase {
    let hexNum = (upper % 8) * 8 + (lower % 8) + 1;
    
    {
      glyphs = [chineseTrigram(lower), chineseTrigram(upper)];
      combinedMeaning = "Hexagram " # Nat.toText(hexNum) # ": " # hexagramName(hexNum);
      computationalResult = Float.fromInt(hexNum);
      resonanceSignature = Matalko.harmonicResonance(
        Matalko.FREQ_432 * Float.fromInt(lower + 1),
        Matalko.FREQ_432 * Float.fromInt(upper + 1)
      );
    };
  };

  func hexagramName(n : Nat) : Text {
    let names = ["The Creative", "The Receptive", "Difficulty at the Beginning", "Youthful Folly",
                "Waiting", "Conflict", "The Army", "Holding Together", "Small Taming", "Treading",
                "Peace", "Standstill", "Fellowship", "Great Possession", "Modesty", "Enthusiasm"];
    if (n <= 16) { names[n - 1] } else { "Hexagram " # Nat.toText(n) };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // EGYPTIAN HIEROGLYPHIC SYSTEM (Sacred Geometry Encoding)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Egyptian sacred symbols
  public func egyptianSymbol(name : Text) : Glyph {
    let (symbol, meaning, geom) : (Text, Text, GeometryCode) = switch (name) {
      case "ankh" ("☥", "Life/Eternal", { vertices = 5; edges = 5; faces = 2; dimension = 2; centerAngle = 0.0 });
      case "eye" ("𓂀", "Eye of Horus/Protection", { vertices = 6; edges = 6; faces = 1; dimension = 2; centerAngle = 0.0 });
      case "djed" ("𓊽", "Stability/Spine of Osiris", { vertices = 8; edges = 12; faces = 4; dimension = 3; centerAngle = 90.0 });
      case "was" ("𓌀", "Power/Dominion", { vertices = 4; edges = 4; faces = 1; dimension = 2; centerAngle = 45.0 });
      case "scarab" ("𓆣", "Transformation/Rebirth", { vertices = 6; edges = 6; faces = 1; dimension = 2; centerAngle = 60.0 });
      case "pyramid" ("△", "Ascension/Eternity", { vertices = 4; edges = 6; faces = 4; dimension = 3; centerAngle = 51.5 });
      case _ ("☉", "Ra/Sun/Source", { vertices = 1; edges = 0; faces = 1; dimension = 2; centerAngle = 360.0 });
    };
    
    {
      id = "egyptian-" # name;
      origin = #Egyptian;
      function = #Geometry;
      symbol = symbol;
      meaning = meaning;
      numericValue = null;
      frequency = Matalko.FREQ_432 * Matalko.PHI;
      phiPosition = Matalko.phiEncode(Float.fromInt(Text.hash(name)));
      geometry = ?geom;
      linkedGlyphs = [];
    };
  };

  /// Egyptian fraction computation (unit fractions)
  public func egyptianFraction(numerator : Nat, denominator : Nat) : GlyphPhrase {
    // Egyptians used only unit fractions (1/n)
    // Decompose any fraction into sum of unit fractions
    var remaining = numerator;
    var denom = denominator;
    var glyphs : [Glyph] = [];
    var value : Float = 0.0;
    
    while (remaining > 0 and Array.size(glyphs) < 10) {
      let unitDenom = (denom + remaining - 1) / remaining; // Ceiling division
      glyphs := Array.append(glyphs, [{
        id = "unit-frac-" # Nat.toText(unitDenom);
        origin = #Egyptian;
        function = #Number;
        symbol = "1/" # Nat.toText(unitDenom);
        meaning = "Unit fraction 1/" # Nat.toText(unitDenom);
        numericValue = ?unitDenom;
        frequency = Matalko.FREQ_432 / Float.fromInt(unitDenom);
        phiPosition = 1.0 / Float.fromInt(unitDenom);
        geometry = null;
        linkedGlyphs = [];
      }]);
      value += 1.0 / Float.fromInt(unitDenom);
      remaining := remaining * unitDenom - denom;
      denom := denom * unitDenom;
    };
    
    {
      glyphs = glyphs;
      combinedMeaning = "Egyptian fraction decomposition of " # Nat.toText(numerator) # "/" # Nat.toText(denominator);
      computationalResult = value;
      resonanceSignature = Matalko.phiEncode(value);
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VEDIC SYSTEM (Mantra/Frequency Encoding)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Vedic seed syllables (Bija mantras)
  public func vedicBija(syllable : Text) : Glyph {
    let (meaning, freq) : (Text, Float) = switch (syllable) {
      case "om" ("Primordial/Universal", 136.1);        // Om frequency
      case "lam" ("Root/Earth", 194.18);                 // C note
      case "vam" ("Sacral/Water", 210.42);               // D note  
      case "ram" ("Solar Plexus/Fire", 126.22);          // B note
      case "yam" ("Heart/Air", 136.1);                   // C# note
      case "ham" ("Throat/Ether", 141.27);               // C# note
      case "aum" ("Third Eye/Light", 221.23);            // A note
      case "silence" ("Crown/Consciousness", 172.06);    // F note
      case _ ("Shakti/Power", 432.0);
    };
    
    {
      id = "vedic-bija-" # syllable;
      origin = #Vedic;
      function = #Sound;
      symbol = syllable;
      meaning = meaning;
      numericValue = null;
      frequency = freq;
      phiPosition = Matalko.phiEncode(freq);
      geometry = null;
      linkedGlyphs = [];
    };
  };

  /// Vedic number encoding (Sanskrit numerals)
  public func vedicNumber(n : Nat) : Glyph {
    let names = ["shunya", "eka", "dvi", "tri", "chatur", "pancha", "shat", "sapta", "ashta", "nava"];
    let name = if (n < 10) { names[n] } else { "dasha" };
    
    {
      id = "vedic-num-" # Nat.toText(n);
      origin = #Vedic;
      function = #Number;
      symbol = name;
      meaning = "Sanskrit " # Nat.toText(n);
      numericValue = ?n;
      frequency = Matalko.FREQ_432 * (1.0 + Float.fromInt(n) / 10.0);
      phiPosition = Float.fromInt(n) / 10.0;
      geometry = null;
      linkedGlyphs = [];
    };
  };

  /// Chakra computation
  public func chakraGlyph(level : Nat) : Glyph {
    let names = ["Muladhara", "Svadhisthana", "Manipura", "Anahata", "Vishuddha", "Ajna", "Sahasrara"];
    let colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"];
    let frequencies = [256.0, 288.0, 320.0, 341.3, 384.0, 426.7, 480.0];
    
    let i = level % 7;
    
    {
      id = "chakra-" # Nat.toText(i + 1);
      origin = #Vedic;
      function = #Sound;
      symbol = names[i];
      meaning = names[i] # " (" # colors[i] # ")";
      numericValue = ?(i + 1);
      frequency = frequencies[i];
      phiPosition = Float.fromInt(i) / 7.0;
      geometry = ?{ 
        vertices = 4 + i * 2; // Increasing petals
        edges = 4 + i * 2;
        faces = 1;
        dimension = 2;
        centerAngle = 360.0 / Float.fromInt(4 + i * 2);
      };
      linkedGlyphs = [];
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HEBREW SYSTEM (Gematria Computation)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Hebrew letter with gematria value
  public func hebrewLetter(index : Nat) : Glyph {
    let letters = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י",
                  "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת"];
    let names = ["Aleph", "Bet", "Gimel", "Dalet", "He", "Vav", "Zayin", "Chet", "Tet", "Yod",
                "Kaf", "Lamed", "Mem", "Nun", "Samekh", "Ayin", "Pe", "Tsade", "Qof", "Resh", "Shin", "Tav"];
    let values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400];
    
    let i = index % 22;
    
    {
      id = "hebrew-" # names[i];
      origin = #Hebrew;
      function = #Number;
      symbol = letters[i];
      meaning = names[i] # " (Path " # Nat.toText(i + 1) # " on Tree of Life)";
      numericValue = ?values[i];
      frequency = Matalko.FREQ_432 * Float.fromInt(values[i]) / 400.0;
      phiPosition = Float.fromInt(i) / 22.0;
      geometry = null;
      linkedGlyphs = [];
    };
  };

  /// Gematria computation (word to number)
  public func gematria(word : Text) : GlyphPhrase {
    // Simplified: map ASCII to Hebrew positions
    var total : Nat = 0;
    var glyphs : [Glyph] = [];
    
    for (char in Text.toIter(word)) {
      let code = switch (char) {
        case 'a' 1; case 'b' 2; case 'c' 3; case 'd' 4; case 'e' 5;
        case 'f' 6; case 'g' 7; case 'h' 8; case 'i' 9; case 'j' 10;
        case 'k' 20; case 'l' 30; case 'm' 40; case 'n' 50; case 'o' 60;
        case 'p' 70; case 'q' 80; case 'r' 90; case 's' 100; case 't' 200;
        case 'u' 300; case 'v' 400; case 'w' 500; case 'x' 600; case 'y' 700;
        case 'z' 800;
        case _ 0;
      };
      total += code;
    };
    
    {
      glyphs = glyphs;
      combinedMeaning = "Gematria of \"" # word # "\" = " # Nat.toText(total);
      computationalResult = Float.fromInt(total);
      resonanceSignature = Matalko.phiEncode(Float.fromInt(total));
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GREEK SYSTEM (Mathematical Symbols)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Greek letter with mathematical meaning
  public func greekLetter(name : Text) : Glyph {
    let (symbol, meaning, value) : (Text, Text, Float) = switch (name) {
      case "phi" ("φ", "Golden Ratio", Matalko.PHI);
      case "pi" ("π", "Circle Ratio", Matalko.PI);
      case "tau" ("τ", "Full Rotation", Matalko.TAU);
      case "e" ("ε", "Euler's Number", Matalko.E);
      case "alpha" ("α", "Beginning/First", 1.0);
      case "omega" ("ω", "End/Last", 24.0);
      case "delta" ("Δ", "Change/Difference", 0.0);
      case "sigma" ("Σ", "Sum/Total", 0.0);
      case "theta" ("θ", "Angle", 0.0);
      case "lambda" ("λ", "Wavelength", 0.0);
      case _ ("γ", "Ratio", 0.0);
    };
    
    {
      id = "greek-" # name;
      origin = #Greek;
      function = #Operation;
      symbol = symbol;
      meaning = meaning;
      numericValue = null;
      frequency = Matalko.FREQ_432 * (if (value > 0.0) { value } else { 1.0 });
      phiPosition = if (value > 0.0) { Matalko.phiEncode(value) } else { 0.5 };
      geometry = null;
      linkedGlyphs = [];
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GLYPH PHRASE COMPUTATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Combine multiple glyphs into computational phrase
  public func combineGlyphs(glyphs : [Glyph]) : GlyphPhrase {
    var totalFreq : Float = 0.0;
    var combinedMeaning = "";
    var computedValue : Float = 0.0;
    
    for (glyph in glyphs.vals()) {
      totalFreq += glyph.frequency;
      combinedMeaning #= glyph.symbol # " ";
      switch (glyph.numericValue) {
        case (?n) { computedValue += Float.fromInt(n); };
        case null {};
      };
    };
    
    let avgFreq = totalFreq / Float.fromInt(Array.size(glyphs));
    
    {
      glyphs = glyphs;
      combinedMeaning = combinedMeaning;
      computationalResult = computedValue;
      resonanceSignature = Matalko.phiEncode(avgFreq);
    };
  };

  /// Calculate resonance between two glyphs
  public func glyphResonance(a : Glyph, b : Glyph) : Float {
    Matalko.harmonicResonance(a.frequency, b.frequency);
  };

  /// Translate number through multiple glyph systems
  public func multiSystemEncode(n : Nat) : [Glyph] {
    [
      mayanNumber(n % 20),
      vedicNumber(n % 10),
      hebrewLetter(n % 22),
      chineseTrigram(n % 8)
    ];
  };
};
