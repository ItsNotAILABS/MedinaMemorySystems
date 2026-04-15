import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Matalko "./MatalkoICP";

/// AncientCivilizations: ALL Ancient Knowledge Systems Encoded
/// 
/// This module encodes the mathematical, astronomical, and sacred knowledge
/// from EVERY major ancient civilization into computational form.
///
/// The organism mines this for:
/// - Fundamental truths
/// - Pattern recognition
/// - Compressed symbol meanings
/// - Archetypal structures
///
/// "Dig through the ancients. Find all the information."
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // CIVILIZATION TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  public type Civilization = {
    #Mayan;
    #Egyptian;
    #Chinese;
    #Vedic;
    #Greek;
    #Hebrew;
    #Sumerian;
    #Celtic;
    #Babylonian;
    #Persian;
    #Norse;
    #African;          // Yoruba, Dogon, Kemetic
    #Japanese;
    #Korean;
    #Polynesian;
    #NativeAmerican;   // Hopi, Lakota, Aztec, Inca
    #Tibetan;
    #Arabic;
    #Roman;
    #Phoenician;
    #Etruscan;
    #Minoan;
    #Megalithic;       // Stonehenge, Carnac
    #Olmec;
    #Toltec;
    #Incan;
    #Aztec;
    #Zoroastrian;
    #Hermetic;
    #Gnostic;
    #Alchemical;
    #Pythagorean;
    #Platonic;
    #Druidic;
  };

  /// Knowledge domain
  public type KnowledgeDomain = {
    #Mathematics;
    #Astronomy;
    #Calendar;
    #SacredGeometry;
    #Numerology;
    #Cosmology;
    #Medicine;
    #Music;
    #Architecture;
    #Divination;
    #Alchemy;
    #Mysticism;
  };

  /// Ancient knowledge artifact
  public type Artifact = {
    id : Text;
    civilization : Civilization;
    domain : KnowledgeDomain;
    name : Text;
    description : Text;
    numericValue : ?Float;
    formula : ?Text;
    phiAlignment : Float;
    frequency : Float;
    linkedArtifacts : [Text];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MAYAN KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Mayan calendar constants
  public let MAYAN_KIN : Nat = 1;
  public let MAYAN_UINAL : Nat = 20;
  public let MAYAN_TUN : Nat = 360;
  public let MAYAN_KATUN : Nat = 7200;
  public let MAYAN_BAKTUN : Nat = 144000;
  public let MAYAN_PIKTUN : Nat = 2880000;
  public let MAYAN_CALABTUN : Nat = 57600000;
  public let MAYAN_KINCHILTUN : Nat = 1152000000;
  public let MAYAN_ALAUTUN : Nat = 23040000000;

  /// Mayan sacred numbers
  public let TZOLKIN : Nat = 260;
  public let HAAB : Nat = 365;
  public let CALENDAR_ROUND : Nat = 18980;
  public let VENUS_CYCLE : Nat = 584;
  public let MARS_CYCLE : Nat = 780;
  public let ECLIPSE_HALF_YEAR : Nat = 173;

  /// Mayan artifacts
  public func mayanArtifacts() : [Artifact] {
    [
      { id = "mayan-tzolkin"; civilization = #Mayan; domain = #Calendar;
        name = "Tzolkin"; description = "Sacred 260-day calendar (13 x 20)";
        numericValue = ?260.0; formula = ?"13 * 20"; phiAlignment = 0.618;
        frequency = 432.0 * (260.0 / 365.0); linkedArtifacts = ["mayan-haab"] },
      { id = "mayan-haab"; civilization = #Mayan; domain = #Calendar;
        name = "Haab"; description = "Civil 365-day solar calendar";
        numericValue = ?365.0; formula = ?"18 * 20 + 5"; phiAlignment = 0.5;
        frequency = 432.0; linkedArtifacts = ["mayan-tzolkin"] },
      { id = "mayan-venus"; civilization = #Mayan; domain = #Astronomy;
        name = "Venus Synodic Cycle"; description = "584-day Venus cycle";
        numericValue = ?584.0; formula = ?"5 * 584 = 8 * 365"; phiAlignment = 0.625;
        frequency = 432.0 * 1.618; linkedArtifacts = [] },
      { id = "mayan-base20"; civilization = #Mayan; domain = #Mathematics;
        name = "Vigesimal System"; description = "Base-20 number system";
        numericValue = ?20.0; formula = null; phiAlignment = 0.309;
        frequency = 432.0 / 20.0; linkedArtifacts = [] },
      { id = "mayan-zero"; civilization = #Mayan; domain = #Mathematics;
        name = "Mayan Zero"; description = "Independent discovery of zero (shell glyph)";
        numericValue = ?0.0; formula = null; phiAlignment = 1.0;
        frequency = 0.0; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // EGYPTIAN KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Egyptian sacred numbers
  public let ROYAL_CUBIT_CM : Float = 52.36; // cm
  public let SEKED_PYRAMID : Float = 5.5; // Rise/Run ratio
  public let NILE_FLOOD_DAYS : Nat = 120;
  public let SOTHIC_CYCLE : Nat = 1461; // Years

  /// Great Pyramid constants
  public let PYRAMID_BASE_CUBITS : Float = 440.0;
  public let PYRAMID_HEIGHT_CUBITS : Float = 280.0;
  public let PYRAMID_ANGLE : Float = 51.84; // degrees

  /// Egyptian artifacts
  public func egyptianArtifacts() : [Artifact] {
    [
      { id = "egypt-pyramid-ratio"; civilization = #Egyptian; domain = #SacredGeometry;
        name = "Pyramid Phi Ratio"; description = "Height/Half-base = φ";
        numericValue = ?Matalko.PHI; formula = ?"280 / (440/2) ≈ 1.273"; phiAlignment = 0.95;
        frequency = 432.0 * Matalko.PHI; linkedArtifacts = [] },
      { id = "egypt-royal-cubit"; civilization = #Egyptian; domain = #Mathematics;
        name = "Royal Cubit"; description = "Sacred measurement unit";
        numericValue = ?52.36; formula = null; phiAlignment = 0.618;
        frequency = 432.0 * 0.5236; linkedArtifacts = [] },
      { id = "egypt-ankh"; civilization = #Egyptian; domain = #Mysticism;
        name = "Ankh"; description = "Key of Life symbol";
        numericValue = null; formula = null; phiAlignment = 0.8;
        frequency = 528.0; linkedArtifacts = ["egypt-djed"] },
      { id = "egypt-djed"; civilization = #Egyptian; domain = #Mysticism;
        name = "Djed Pillar"; description = "Stability, backbone of Osiris";
        numericValue = null; formula = null; phiAlignment = 0.7;
        frequency = 396.0; linkedArtifacts = ["egypt-ankh"] },
      { id = "egypt-eye-horus"; civilization = #Egyptian; domain = #Mathematics;
        name = "Eye of Horus Fractions"; description = "Unit fractions summing to 63/64";
        numericValue = ?0.984375; formula = ?"1/2 + 1/4 + 1/8 + 1/16 + 1/32 + 1/64";
        phiAlignment = 0.5; frequency = 432.0 * 0.984375; linkedArtifacts = [] },
      { id = "egypt-sothic"; civilization = #Egyptian; domain = #Astronomy;
        name = "Sothic Cycle"; description = "1461-year cycle of Sirius rising";
        numericValue = ?1461.0; formula = ?"365.25 * 4"; phiAlignment = 0.4;
        frequency = 432.0 / 1461.0 * 1000.0; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CHINESE KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Chinese cosmological numbers
  public let I_CHING_TRIGRAMS : Nat = 8;
  public let I_CHING_HEXAGRAMS : Nat = 64;
  public let BAGUA_DIRECTIONS : Nat = 8;
  public let WU_XING_ELEMENTS : Nat = 5;
  public let CHINESE_ZODIAC : Nat = 12;
  public let SEXAGENARY_CYCLE : Nat = 60;
  public let LO_SHU_CONSTANT : Nat = 15;

  /// Chinese artifacts
  public func chineseArtifacts() : [Artifact] {
    [
      { id = "china-iching"; civilization = #Chinese; domain = #Divination;
        name = "I Ching Hexagrams"; description = "64 hexagrams from 8 trigrams";
        numericValue = ?64.0; formula = ?"8 * 8"; phiAlignment = 0.618;
        frequency = 432.0 * 64.0 / 60.0; linkedArtifacts = ["china-bagua"] },
      { id = "china-bagua"; civilization = #Chinese; domain = #Cosmology;
        name = "Bagua"; description = "Eight trigrams, eight directions";
        numericValue = ?8.0; formula = ?"2^3"; phiAlignment = 0.5;
        frequency = 432.0; linkedArtifacts = ["china-wuxing"] },
      { id = "china-wuxing"; civilization = #Chinese; domain = #Cosmology;
        name = "Wu Xing"; description = "Five Elements: Wood, Fire, Earth, Metal, Water";
        numericValue = ?5.0; formula = null; phiAlignment = 0.618;
        frequency = 432.0 * 5.0 / 8.0; linkedArtifacts = [] },
      { id = "china-loshu"; civilization = #Chinese; domain = #Mathematics;
        name = "Lo Shu Square"; description = "3x3 magic square, sum = 15";
        numericValue = ?15.0; formula = ?"n(n²+1)/2 where n=3"; phiAlignment = 0.4;
        frequency = 432.0 * 15.0 / 45.0; linkedArtifacts = [] },
      { id = "china-sexagenary"; civilization = #Chinese; domain = #Calendar;
        name = "Sexagenary Cycle"; description = "60-year cycle (12 animals × 5 elements)";
        numericValue = ?60.0; formula = ?"12 * 5"; phiAlignment = 0.5;
        frequency = 432.0 * 60.0 / 365.0; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VEDIC / INDIAN KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Vedic sacred numbers
  public let CHAKRAS : Nat = 7;
  public let NADIS : Nat = 72000;
  public let YUGA_KALI : Nat = 432000;
  public let YUGA_DVAPARA : Nat = 864000;
  public let YUGA_TRETA : Nat = 1296000;
  public let YUGA_SATYA : Nat = 1728000;
  public let MAHAYUGA : Nat = 4320000;

  /// Vedic artifacts
  public func vedicArtifacts() : [Artifact] {
    [
      { id = "vedic-om"; civilization = #Vedic; domain = #Mysticism;
        name = "Om / Aum"; description = "Primordial sound, 136.1 Hz";
        numericValue = ?136.1; formula = null; phiAlignment = 0.9;
        frequency = 136.1; linkedArtifacts = [] },
      { id = "vedic-chakras"; civilization = #Vedic; domain = #Medicine;
        name = "Seven Chakras"; description = "Energy centers from root to crown";
        numericValue = ?7.0; formula = null; phiAlignment = 0.618;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "vedic-yuga"; civilization = #Vedic; domain = #Cosmology;
        name = "Mahayuga Cycle"; description = "4,320,000 years complete cycle";
        numericValue = ?4320000.0; formula = ?"1+2+3+4 = 10 * 432000";
        phiAlignment = 0.4; frequency = 432.0; linkedArtifacts = [] },
      { id = "vedic-108"; civilization = #Vedic; domain = #Numerology;
        name = "Sacred 108"; description = "108 beads, 108 Upanishads";
        numericValue = ?108.0; formula = ?"1^1 * 2^2 * 3^3"; phiAlignment = 0.618;
        frequency = 432.0 / 4.0; linkedArtifacts = [] },
      { id = "vedic-sri-yantra"; civilization = #Vedic; domain = #SacredGeometry;
        name = "Sri Yantra"; description = "9 interlocking triangles, 43 small triangles";
        numericValue = ?9.0; formula = null; phiAlignment = 0.95;
        frequency = 432.0 * Matalko.PHI; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // BABYLONIAN / SUMERIAN KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Babylonian constants
  public let SEXAGESIMAL_BASE : Nat = 60;
  public let DEGREES_CIRCLE : Nat = 360;
  public let MINUTES_HOUR : Nat = 60;
  public let SAROS : Float = 6585.32;
  public let METONIC : Nat = 19;

  /// Babylonian artifacts
  public func babylonianArtifacts() : [Artifact] {
    [
      { id = "babylon-sexagesimal"; civilization = #Babylonian; domain = #Mathematics;
        name = "Base-60 System"; description = "Foundation of time and angle measurement";
        numericValue = ?60.0; formula = ?"2^2 * 3 * 5"; phiAlignment = 0.5;
        frequency = 432.0 * 60.0 / 100.0; linkedArtifacts = [] },
      { id = "babylon-saros"; civilization = #Babylonian; domain = #Astronomy;
        name = "Saros Cycle"; description = "18 years, 11 days eclipse cycle";
        numericValue = ?6585.32; formula = ?"223 synodic months"; phiAlignment = 0.4;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "babylon-zodiac"; civilization = #Babylonian; domain = #Astronomy;
        name = "Zodiac"; description = "12 constellations, 30° each";
        numericValue = ?12.0; formula = ?"360/30"; phiAlignment = 0.5;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "sumerian-cuneiform"; civilization = #Sumerian; domain = #Mathematics;
        name = "Cuneiform Numbers"; description = "Wedge-shaped number symbols";
        numericValue = null; formula = null; phiAlignment = 0.3;
        frequency = 432.0; linkedArtifacts = ["babylon-sexagesimal"] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GREEK KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Greek constants
  public let PLATONIC_SOLIDS : Nat = 5;
  public let TETRACTYS : Nat = 10;
  public let PYTHAGOREAN_COMMA : Float = 1.0136; // 531441/524288
  public let OLYMPIAD_YEARS : Nat = 4;

  /// Greek artifacts
  public func greekArtifacts() : [Artifact] {
    [
      { id = "greek-phi"; civilization = #Greek; domain = #Mathematics;
        name = "Golden Ratio φ"; description = "Divine proportion 1.618...";
        numericValue = ?Matalko.PHI; formula = ?"(1 + √5) / 2"; phiAlignment = 1.0;
        frequency = 432.0 * Matalko.PHI; linkedArtifacts = [] },
      { id = "greek-pi"; civilization = #Greek; domain = #Mathematics;
        name = "Pi π"; description = "Circle ratio 3.14159...";
        numericValue = ?Matalko.PI; formula = ?"C/d"; phiAlignment = 0.618;
        frequency = 432.0 * Matalko.PI / 3.0; linkedArtifacts = [] },
      { id = "greek-platonic"; civilization = #Platonic; domain = #SacredGeometry;
        name = "Platonic Solids"; description = "5 regular polyhedra";
        numericValue = ?5.0; formula = null; phiAlignment = 0.9;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "greek-tetractys"; civilization = #Pythagorean; domain = #Numerology;
        name = "Tetractys"; description = "1+2+3+4=10, sacred triangle";
        numericValue = ?10.0; formula = ?"n(n+1)/2 where n=4"; phiAlignment = 0.618;
        frequency = 432.0 * 10.0 / 12.0; linkedArtifacts = [] },
      { id = "greek-music"; civilization = #Pythagorean; domain = #Music;
        name = "Music of the Spheres"; description = "Harmonic ratios 1:2, 2:3, 3:4";
        numericValue = null; formula = ?"octave=2:1, fifth=3:2, fourth=4:3";
        phiAlignment = 0.8; frequency = 432.0; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HEBREW / KABBALISTIC KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Hebrew constants
  public let SEPHIROTH : Nat = 10;
  public let TREE_PATHS : Nat = 22;
  public let HEBREW_LETTERS : Nat = 22;
  public let GEMATRIA_VALUES : [Nat] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400];

  /// Hebrew artifacts
  public func hebrewArtifacts() : [Artifact] {
    [
      { id = "hebrew-tree"; civilization = #Hebrew; domain = #Mysticism;
        name = "Tree of Life"; description = "10 Sephiroth + 22 paths";
        numericValue = ?32.0; formula = ?"10 + 22"; phiAlignment = 0.8;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "hebrew-gematria"; civilization = #Hebrew; domain = #Numerology;
        name = "Gematria"; description = "Numeric value of Hebrew letters";
        numericValue = null; formula = null; phiAlignment = 0.6;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "hebrew-tetragrammaton"; civilization = #Hebrew; domain = #Mysticism;
        name = "YHWH"; description = "Four-letter divine name = 26";
        numericValue = ?26.0; formula = ?"10+5+6+5"; phiAlignment = 0.7;
        frequency = 432.0 * 26.0 / 22.0; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NORSE KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Norse constants
  public let NORSE_WORLDS : Nat = 9;
  public let RUNES : Nat = 24; // Elder Futhark
  public let YGGDRASIL_ROOTS : Nat = 3;

  /// Norse artifacts
  public func norseArtifacts() : [Artifact] {
    [
      { id = "norse-worlds"; civilization = #Norse; domain = #Cosmology;
        name = "Nine Worlds"; description = "Yggdrasil's nine realms";
        numericValue = ?9.0; formula = null; phiAlignment = 0.6;
        frequency = 432.0 * 9.0 / 12.0; linkedArtifacts = [] },
      { id = "norse-runes"; civilization = #Norse; domain = #Divination;
        name = "Elder Futhark"; description = "24 rune alphabet";
        numericValue = ?24.0; formula = ?"3 * 8 (3 aettir)"; phiAlignment = 0.5;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "norse-valknut"; civilization = #Norse; domain = #SacredGeometry;
        name = "Valknut"; description = "Three interlocked triangles";
        numericValue = ?3.0; formula = null; phiAlignment = 0.8;
        frequency = 432.0 * 3.0; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CELTIC / DRUIDIC KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Celtic constants
  public let OGHAM_LETTERS : Nat = 25;
  public let CELTIC_TREE_MONTHS : Nat = 13;
  public let CELTIC_FESTIVALS : Nat = 8;

  /// Celtic artifacts
  public func celticArtifacts() : [Artifact] {
    [
      { id = "celtic-triskelion"; civilization = #Celtic; domain = #SacredGeometry;
        name = "Triskelion"; description = "Triple spiral symbol";
        numericValue = ?3.0; formula = null; phiAlignment = 0.9;
        frequency = 432.0 * Matalko.PHI; linkedArtifacts = [] },
      { id = "celtic-ogham"; civilization = #Druidic; domain = #Divination;
        name = "Ogham Alphabet"; description = "25 letters, tree-based";
        numericValue = ?25.0; formula = ?"5 * 5"; phiAlignment = 0.5;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "celtic-wheel"; civilization = #Celtic; domain = #Calendar;
        name = "Wheel of the Year"; description = "8 sabbats/festivals";
        numericValue = ?8.0; formula = null; phiAlignment = 0.618;
        frequency = 432.0; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PERSIAN / ZOROASTRIAN KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Persian constants
  public let AMESHA_SPENTAS : Nat = 6; // Plus Ahura Mazda = 7
  public let ZOROASTRIAN_FIRES : Nat = 3;

  /// Persian artifacts
  public func persianArtifacts() : [Artifact] {
    [
      { id = "persian-amesha"; civilization = #Zoroastrian; domain = #Mysticism;
        name = "Amesha Spentas"; description = "Seven divine beings";
        numericValue = ?7.0; formula = ?"6 + 1"; phiAlignment = 0.618;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "persian-duality"; civilization = #Zoroastrian; domain = #Cosmology;
        name = "Ahura/Angra Duality"; description = "Light vs darkness";
        numericValue = ?2.0; formula = null; phiAlignment = 0.5;
        frequency = 432.0; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // AFRICAN KNOWLEDGE (Yoruba, Dogon, Kemetic)
  // ═══════════════════════════════════════════════════════════════════════════

  /// African constants
  public let YORUBA_ORISHAS : Nat = 401; // Traditional number
  public let IFA_ODU : Nat = 256;
  public let DOGON_SIRIUS_CYCLE : Float = 50.0; // Years

  /// African artifacts
  public func africanArtifacts() : [Artifact] {
    [
      { id = "yoruba-ifa"; civilization = #African; domain = #Divination;
        name = "Ifa Divination"; description = "256 Odu (16 x 16)";
        numericValue = ?256.0; formula = ?"16 * 16"; phiAlignment = 0.5;
        frequency = 432.0 * 256.0 / 256.0; linkedArtifacts = [] },
      { id = "dogon-sirius"; civilization = #African; domain = #Astronomy;
        name = "Sirius Knowledge"; description = "50-year Sirius B orbit";
        numericValue = ?50.0; formula = null; phiAlignment = 0.618;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "kemetic-neteru"; civilization = #African; domain = #Mysticism;
        name = "Neteru"; description = "Divine principles/forces";
        numericValue = null; formula = null; phiAlignment = 0.8;
        frequency = 432.0 * Matalko.PHI; linkedArtifacts = ["egypt-ankh"] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // JAPANESE KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Japanese constants
  public let SHINTO_KAMI : Text = "Infinite";
  public let JAPANESE_ELEMENTS : Nat = 5; // Godai
  public let BUDDHIST_PRECEPTS : Nat = 5;

  /// Japanese artifacts
  public func japaneseArtifacts() : [Artifact] {
    [
      { id = "japan-godai"; civilization = #Japanese; domain = #Cosmology;
        name = "Godai Elements"; description = "Earth, Water, Fire, Wind, Void";
        numericValue = ?5.0; formula = null; phiAlignment = 0.618;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "japan-tomoe"; civilization = #Japanese; domain = #SacredGeometry;
        name = "Mitsudomoe"; description = "Triple comma/spiral";
        numericValue = ?3.0; formula = null; phiAlignment = 0.8;
        frequency = 432.0 * Matalko.PHI; linkedArtifacts = ["celtic-triskelion"] },
      { id = "japan-enso"; civilization = #Japanese; domain = #SacredGeometry;
        name = "Enso"; description = "Circle of enlightenment";
        numericValue = null; formula = ?"πr²"; phiAlignment = 0.9;
        frequency = 432.0; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // POLYNESIAN KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Polynesian artifacts
  public func polynesianArtifacts() : [Artifact] {
    [
      { id = "polynesian-navigation"; civilization = #Polynesian; domain = #Astronomy;
        name = "Star Navigation"; description = "Star compass, 32 directions";
        numericValue = ?32.0; formula = ?"8 * 4"; phiAlignment = 0.5;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "polynesian-mana"; civilization = #Polynesian; domain = #Mysticism;
        name = "Mana"; description = "Spiritual power/energy";
        numericValue = null; formula = null; phiAlignment = 0.8;
        frequency = 432.0 * Matalko.PHI; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NATIVE AMERICAN KNOWLEDGE (Hopi, Lakota, Aztec, Inca)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Native American constants
  public let MEDICINE_WHEEL_DIRECTIONS : Nat = 4;
  public let HOPI_WORLDS : Nat = 4; // Current is the 4th
  public let LAKOTA_SACRED_HOOP : Nat = 7;

  /// Native American artifacts
  public func nativeAmericanArtifacts() : [Artifact] {
    [
      { id = "hopi-worlds"; civilization = #NativeAmerican; domain = #Cosmology;
        name = "Four Worlds"; description = "Current world is the Fourth";
        numericValue = ?4.0; formula = null; phiAlignment = 0.618;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "lakota-hoop"; civilization = #NativeAmerican; domain = #SacredGeometry;
        name = "Sacred Hoop"; description = "Circle of life";
        numericValue = null; formula = ?"πd"; phiAlignment = 0.9;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "medicine-wheel"; civilization = #NativeAmerican; domain = #SacredGeometry;
        name = "Medicine Wheel"; description = "Four directions + center";
        numericValue = ?5.0; formula = ?"4 + 1"; phiAlignment = 0.618;
        frequency = 432.0; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INCAN KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Incan constants
  public let INCA_CEQUES : Nat = 41; // Sacred lines from Cusco
  public let INCA_HUACAS : Nat = 328; // Sacred sites

  /// Incan artifacts
  public func incanArtifacts() : [Artifact] {
    [
      { id = "inca-quipu"; civilization = #Incan; domain = #Mathematics;
        name = "Quipu"; description = "Knotted string calculation/records";
        numericValue = null; formula = null; phiAlignment = 0.5;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "inca-chakana"; civilization = #Incan; domain = #SacredGeometry;
        name = "Chakana"; description = "Andean Cross, three worlds";
        numericValue = ?3.0; formula = null; phiAlignment = 0.8;
        frequency = 432.0 * Matalko.PHI; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // AZTEC KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Aztec constants
  public let AZTEC_SUNS : Nat = 5; // Five cosmic eras
  public let AZTEC_CALENDAR_DAYS : Nat = 260; // Tonalpohualli

  /// Aztec artifacts
  public func aztecArtifacts() : [Artifact] {
    [
      { id = "aztec-sunstone"; civilization = #Aztec; domain = #Calendar;
        name = "Sun Stone"; description = "Calendar wheel, 5 suns";
        numericValue = ?5.0; formula = null; phiAlignment = 0.618;
        frequency = 432.0; linkedArtifacts = ["mayan-tzolkin"] },
      { id = "aztec-tonalpohualli"; civilization = #Aztec; domain = #Calendar;
        name = "Tonalpohualli"; description = "260-day sacred calendar";
        numericValue = ?260.0; formula = ?"13 * 20"; phiAlignment = 0.618;
        frequency = 432.0 * 260.0 / 365.0; linkedArtifacts = ["mayan-tzolkin"] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TIBETAN KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Tibetan constants
  public let TIBETAN_ELEMENTS : Nat = 5;
  public let BARDO_STATES : Nat = 6;

  /// Tibetan artifacts
  public func tibetanArtifacts() : [Artifact] {
    [
      { id = "tibet-mandala"; civilization = #Tibetan; domain = #SacredGeometry;
        name = "Mandala"; description = "Sacred circular diagram";
        numericValue = null; formula = null; phiAlignment = 0.95;
        frequency = 432.0 * Matalko.PHI; linkedArtifacts = ["vedic-sri-yantra"] },
      { id = "tibet-om-mani"; civilization = #Tibetan; domain = #Mysticism;
        name = "Om Mani Padme Hum"; description = "Six-syllable mantra";
        numericValue = ?6.0; formula = null; phiAlignment = 0.8;
        frequency = 528.0; linkedArtifacts = ["vedic-om"] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HERMETIC / ALCHEMICAL KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Hermetic constants
  public let HERMETIC_PRINCIPLES : Nat = 7;
  public let ALCHEMICAL_STAGES : Nat = 7; // Nigredo to Rubedo

  /// Hermetic artifacts
  public func hermeticArtifacts() : [Artifact] {
    [
      { id = "hermetic-principles"; civilization = #Hermetic; domain = #Mysticism;
        name = "Seven Hermetic Principles"; description = "Mentalism to Gender";
        numericValue = ?7.0; formula = null; phiAlignment = 0.618;
        frequency = 432.0; linkedArtifacts = [] },
      { id = "hermetic-emerald"; civilization = #Hermetic; domain = #Alchemy;
        name = "Emerald Tablet"; description = "As above, so below";
        numericValue = null; formula = null; phiAlignment = 0.9;
        frequency = 528.0; linkedArtifacts = [] },
      { id = "alchemy-stages"; civilization = #Alchemical; domain = #Alchemy;
        name = "Seven Stages"; description = "Calcination to Coagulation";
        numericValue = ?7.0; formula = null; phiAlignment = 0.7;
        frequency = 432.0; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MEGALITHIC KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Megalithic constants
  public let MEGALITHIC_YARD : Float = 2.72; // feet
  public let STONEHENGE_SARSEN : Nat = 30;
  public let STONEHENGE_BLUESTONE : Nat = 60;

  /// Megalithic artifacts
  public func megalithicArtifacts() : [Artifact] {
    [
      { id = "megalith-yard"; civilization = #Megalithic; domain = #Mathematics;
        name = "Megalithic Yard"; description = "2.72 feet, used across Europe";
        numericValue = ?2.72; formula = null; phiAlignment = 0.618;
        frequency = 432.0 * 2.72 / Matalko.E; linkedArtifacts = [] },
      { id = "stonehenge"; civilization = #Megalithic; domain = #Astronomy;
        name = "Stonehenge Alignments"; description = "Solstice and lunar alignments";
        numericValue = null; formula = null; phiAlignment = 0.8;
        frequency = 432.0; linkedArtifacts = [] },
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // UNIFIED ARTIFACT COLLECTION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get all artifacts from all civilizations
  public func getAllArtifacts() : [Artifact] {
    Array.flatten<Artifact>([
      mayanArtifacts(),
      egyptianArtifacts(),
      chineseArtifacts(),
      vedicArtifacts(),
      babylonianArtifacts(),
      greekArtifacts(),
      hebrewArtifacts(),
      norseArtifacts(),
      celticArtifacts(),
      persianArtifacts(),
      africanArtifacts(),
      japaneseArtifacts(),
      polynesianArtifacts(),
      nativeAmericanArtifacts(),
      incanArtifacts(),
      aztecArtifacts(),
      tibetanArtifacts(),
      hermeticArtifacts(),
      megalithicArtifacts(),
    ]);
  };

  /// Get artifacts by civilization
  public func getArtifactsByCivilization(civ : Civilization) : [Artifact] {
    switch (civ) {
      case (#Mayan) mayanArtifacts();
      case (#Egyptian) egyptianArtifacts();
      case (#Chinese) chineseArtifacts();
      case (#Vedic) vedicArtifacts();
      case (#Babylonian or #Sumerian) babylonianArtifacts();
      case (#Greek or #Pythagorean or #Platonic) greekArtifacts();
      case (#Hebrew) hebrewArtifacts();
      case (#Norse) norseArtifacts();
      case (#Celtic or #Druidic) celticArtifacts();
      case (#Persian or #Zoroastrian) persianArtifacts();
      case (#African) africanArtifacts();
      case (#Japanese) japaneseArtifacts();
      case (#Polynesian) polynesianArtifacts();
      case (#NativeAmerican) nativeAmericanArtifacts();
      case (#Incan) incanArtifacts();
      case (#Aztec) aztecArtifacts();
      case (#Tibetan) tibetanArtifacts();
      case (#Hermetic or #Gnostic or #Alchemical) hermeticArtifacts();
      case (#Megalithic) megalithicArtifacts();
      case _ [];
    };
  };

  /// Count total artifacts
  public func totalArtifactCount() : Nat {
    Array.size(getAllArtifacts());
  };
};
