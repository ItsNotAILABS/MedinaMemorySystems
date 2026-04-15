import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Text "mo:base/Text";

/// ANCIENT MATH ENGINE
/// ===================
/// All ancient formulas as live computation.
/// Pythagorean, Euclidean, Mayan, Vedic, Chinese mathematical traditions.
/// These are not descriptions — they are EXECUTABLE TRUTH.

module {
  // ═══════════════════════════════════════════════════════════════════════════
  // UNIVERSAL CONSTANTS (to 19 decimal precision where applicable)
  // ═══════════════════════════════════════════════════════════════════════════

  public let PHI : Float = 1.6180339887498948482;
  public let PHI_INVERSE : Float = 0.6180339887498948482;
  public let PHI_SQUARED : Float = 2.6180339887498948482;
  public let PHI_CUBED : Float = 4.2360679774997896964;
  public let PHI_FOURTH : Float = 6.8541019662496845446;
  
  public let PI : Float = 3.1415926535897932385;
  public let TAU : Float = 6.2831853071795864769;
  public let E : Float = 2.7182818284590452354;
  
  public let SQRT_2 : Float = 1.4142135623730950488;
  public let SQRT_3 : Float = 1.7320508075688772935;
  public let SQRT_5 : Float = 2.2360679774997896964;
  
  public let SCHUMANN_HZ : Float = 7.83;
  public let SACRED_432_HZ : Float = 432.0;
  public let SOLFEGGIO_396 : Float = 396.0;
  public let SOLFEGGIO_528 : Float = 528.0;

  // ═══════════════════════════════════════════════════════════════════════════
  // PYTHAGOREAN MATHEMATICS (570 BCE)
  // Music of the Spheres — the universe is fundamentally mathematical
  // ═══════════════════════════════════════════════════════════════════════════

  /// Pythagorean theorem: a² + b² = c²
  public func pythagorean(a : Float, b : Float) : Float {
    Float.sqrt(a * a + b * b)
  };

  /// Generate Pythagorean triple: (m² - n², 2mn, m² + n²)
  public func pythagoreanTriple(m : Nat, n : Nat) : (Nat, Nat, Nat) {
    if (m <= n) { return (0, 0, 0) };
    let a = m * m - n * n;
    let b = 2 * m * n;
    let c = m * m + n * n;
    (a, b, c)
  };

  /// Pythagorean monochord ratios — the basis of harmonic music
  /// Octave = 2:1, Fifth = 3:2, Fourth = 4:3
  public func monochordRatio(interval : Text) : Float {
    switch (interval) {
      case ("unison") { 1.0 };
      case ("octave") { 2.0 };
      case ("fifth") { 3.0 / 2.0 };
      case ("fourth") { 4.0 / 3.0 };
      case ("major_third") { 5.0 / 4.0 };
      case ("minor_third") { 6.0 / 5.0 };
      case ("major_sixth") { 5.0 / 3.0 };
      case ("minor_sixth") { 8.0 / 5.0 };
      case (_) { 1.0 };
    }
  };

  /// Pythagorean comma — the gap in the circle of fifths
  /// (3/2)^12 / 2^7 = 531441/524288 ≈ 1.01364
  public func pythagoreanComma() : Float {
    Float.pow(1.5, 12.0) / Float.pow(2.0, 7.0)
  };

  /// Tetractys — the sacred 10 (1+2+3+4)
  public func tetractys() : Nat {
    1 + 2 + 3 + 4
  };

  /// Mean proportional: x = √(ab) where a:x = x:b
  public func geometricMean(a : Float, b : Float) : Float {
    Float.sqrt(a * b)
  };

  /// Harmonic mean: 2ab/(a+b)
  public func harmonicMean(a : Float, b : Float) : Float {
    if (a + b == 0.0) { return 0.0 };
    2.0 * a * b / (a + b)
  };

  /// Arithmetic mean
  public func arithmeticMean(a : Float, b : Float) : Float {
    (a + b) / 2.0
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // EUCLIDEAN GEOMETRY (300 BCE)
  // The Elements — pure geometric reasoning
  // ═══════════════════════════════════════════════════════════════════════════

  /// Euclidean distance in 2D
  public func euclideanDistance(x1 : Float, y1 : Float, x2 : Float, y2 : Float) : Float {
    let dx = x2 - x1;
    let dy = y2 - y1;
    Float.sqrt(dx * dx + dy * dy)
  };

  /// Euclidean distance in 3D
  public func euclideanDistance3D(x1 : Float, y1 : Float, z1 : Float, x2 : Float, y2 : Float, z2 : Float) : Float {
    let dx = x2 - x1;
    let dy = y2 - y1;
    let dz = z2 - z1;
    Float.sqrt(dx * dx + dy * dy + dz * dz)
  };

  /// Greatest Common Divisor (Euclidean algorithm)
  public func gcd(a : Nat, b : Nat) : Nat {
    var x = a;
    var y = b;
    while (y != 0) {
      let temp = y;
      y := x % y;
      x := temp;
    };
    x
  };

  /// Least Common Multiple
  public func lcm(a : Nat, b : Nat) : Nat {
    if (a == 0 or b == 0) { return 0 };
    (a * b) / gcd(a, b)
  };

  /// Golden ratio from Euclid: "divide a line in extreme and mean ratio"
  /// a/b = (a+b)/a = φ
  public func extremeAndMeanRatio(total : Float) : (Float, Float) {
    let longer = total / PHI;
    let shorter = total - longer;
    (longer, shorter)
  };

  /// Area of triangle (Heron's formula)
  public func triangleArea(a : Float, b : Float, c : Float) : Float {
    let s = (a + b + c) / 2.0;
    Float.sqrt(s * (s - a) * (s - b) * (s - c))
  };

  /// Circumference of circle
  public func circumference(radius : Float) : Float {
    TAU * radius
  };

  /// Area of circle
  public func circleArea(radius : Float) : Float {
    PI * radius * radius
  };

  /// Volume of sphere
  public func sphereVolume(radius : Float) : Float {
    (4.0 / 3.0) * PI * radius * radius * radius
  };

  /// Surface area of sphere
  public func sphereSurfaceArea(radius : Float) : Float {
    4.0 * PI * radius * radius
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GOLDEN RATIO MATHEMATICS
  // The divine proportion found throughout nature and ancient architecture
  // ═══════════════════════════════════════════════════════════════════════════

  /// Fibonacci sequence at position n
  public func fibonacci(n : Nat) : Nat {
    if (n == 0) { return 0 };
    if (n == 1) { return 1 };
    
    var a = 0;
    var b = 1;
    var i = 2;
    while (i <= n) {
      let temp = a + b;
      a := b;
      b := temp;
      i += 1;
    };
    b
  };

  /// Fibonacci using Binet's formula (golden ratio)
  public func fibonacciBinet(n : Nat) : Float {
    let nf = Float.fromInt(Int.abs(n));
    (Float.pow(PHI, nf) - Float.pow(-PHI_INVERSE, nf)) / SQRT_5
  };

  /// Lucas numbers (related to Fibonacci)
  public func lucas(n : Nat) : Nat {
    if (n == 0) { return 2 };
    if (n == 1) { return 1 };
    
    var a = 2;
    var b = 1;
    var i = 2;
    while (i <= n) {
      let temp = a + b;
      a := b;
      b := temp;
      i += 1;
    };
    b
  };

  /// Golden rectangle dimensions
  public func goldenRectangle(shortSide : Float) : (Float, Float) {
    (shortSide, shortSide * PHI)
  };

  /// Golden spiral radius at angle theta
  public func goldenSpiralRadius(theta : Float) : Float {
    Float.pow(PHI, theta / (PI / 2.0))
  };

  /// PHI power (φⁿ)
  public func phiPower(n : Float) : Float {
    Float.pow(PHI, n)
  };

  /// Check if two values are in golden ratio
  public func isGoldenRatio(a : Float, b : Float, tolerance : Float) : Bool {
    if (b == 0.0) { return false };
    let ratio = a / b;
    Float.abs(ratio - PHI) < tolerance or Float.abs(ratio - PHI_INVERSE) < tolerance
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MAYAN MATHEMATICS (600 CE)
  // Vigesimal (base-20) system with zero concept
  // ═══════════════════════════════════════════════════════════════════════════

  /// Convert decimal to vigesimal (base-20)
  public func toVigesimal(decimal : Nat) : [Nat] {
    if (decimal == 0) { return [0] };
    
    var n = decimal;
    var digits : [Nat] = [];
    
    while (n > 0) {
      digits := Array.append([n % 20], digits);
      n := n / 20;
    };
    digits
  };

  /// Convert vigesimal to decimal
  public func fromVigesimal(vigesimal : [Nat]) : Nat {
    var result = 0;
    var multiplier = 1;
    var i = Array.size(vigesimal);
    
    while (i > 0) {
      i -= 1;
      result += vigesimal[i] * multiplier;
      multiplier *= 20;
    };
    result
  };

  /// Mayan Long Count to days
  public func longCountToDays(baktun : Nat, katun : Nat, tun : Nat, uinal : Nat, kin : Nat) : Nat {
    baktun * 144000 + katun * 7200 + tun * 360 + uinal * 20 + kin
  };

  /// Days to Mayan Long Count
  public func daysToLongCount(totalDays : Nat) : (Nat, Nat, Nat, Nat, Nat) {
    var remaining = totalDays;
    let baktun = remaining / 144000;
    remaining := remaining % 144000;
    let katun = remaining / 7200;
    remaining := remaining % 7200;
    let tun = remaining / 360;
    remaining := remaining % 360;
    let uinal = remaining / 20;
    let kin = remaining % 20;
    (baktun, katun, tun, uinal, kin)
  };

  /// Tzolkin day calculation (260-day sacred calendar)
  /// Returns (day number 1-13, day sign 0-19)
  public func tzolkinDay(daysSinceEpoch : Nat) : (Nat, Nat) {
    let dayNumber = (daysSinceEpoch % 13) + 1;
    let daySign = daysSinceEpoch % 20;
    (dayNumber, daySign)
  };

  /// Haab day calculation (365-day solar calendar)
  /// Returns (day of month 0-19 or 0-4 for Wayeb, month 0-18)
  public func haabDay(daysSinceEpoch : Nat) : (Nat, Nat) {
    let dayOfYear = daysSinceEpoch % 365;
    if (dayOfYear >= 360) {
      // Wayeb (unlucky 5 days)
      (dayOfYear - 360, 18)
    } else {
      let month = dayOfYear / 20;
      let day = dayOfYear % 20;
      (day, month)
    }
  };

  /// Calendar Round (Tzolkin + Haab sync every 18,980 days ≈ 52 years)
  public func calendarRound(daysSinceEpoch : Nat) : Nat {
    daysSinceEpoch % 18980
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VEDIC MATHEMATICS (1500 BCE)
  // The 16 Sutras — mental calculation techniques
  // ═══════════════════════════════════════════════════════════════════════════

  /// Nikhilam (All from 9, last from 10) - Subtraction shortcut
  /// For numbers near a base (10, 100, 1000, etc.)
  public func nikhilam(n : Nat, base : Nat) : Int {
    Int.abs(base) - Int.abs(n)
  };

  /// Ekadhikena Purvena (By one more than the previous)
  /// For squaring numbers ending in 5: n5² = n(n+1)25
  public func squareEndingIn5(n : Nat) : Nat {
    let tens = n / 10;
    let prefix = tens * (tens + 1);
    prefix * 100 + 25
  };

  /// Urdhva Tiryagbhyam (Vertically and Crosswise)
  /// Fast multiplication technique
  public func urdhvaTiryak(a : Nat, b : Nat) : Nat {
    // Simplified for 2-digit numbers
    if (a < 10 and b < 10) { return a * b };
    
    let a1 = a / 10;
    let a0 = a % 10;
    let b1 = b / 10;
    let b0 = b % 10;
    
    let p0 = a0 * b0;
    let p1 = a1 * b0 + a0 * b1;
    let p2 = a1 * b1;
    
    p2 * 100 + p1 * 10 + p0
  };

  /// Yavadunam (Whatever the extent of deficiency)
  /// For squaring numbers near a base
  public func yavadunamSquare(n : Nat, base : Nat) : Nat {
    if (n >= base) {
      let excess = n - base;
      let firstPart = n + excess;
      let secondPart = excess * excess;
      firstPart * base + secondPart
    } else {
      let deficiency = base - n;
      let firstPart = n - deficiency;
      let secondPart = deficiency * deficiency;
      firstPart * base + secondPart
    }
  };

  /// Anurupyena (Proportionality)
  public func proportional(a : Nat, b : Nat, c : Nat) : Nat {
    // If a:b = c:x, then x = bc/a
    (b * c) / a
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CHINESE MATHEMATICS (2698 BCE - Yellow Emperor)
  // Lo Shu magic square, I Ching binary, rod numerals
  // ═══════════════════════════════════════════════════════════════════════════

  /// Lo Shu magic square (3x3) — constant sum 15
  /// 4 9 2
  /// 3 5 7
  /// 8 1 6
  public func loShu() : [[Nat]] {
    [[4, 9, 2], [3, 5, 7], [8, 1, 6]]
  };

  /// Lo Shu magic constant
  public func loShuMagicConstant() : Nat {
    15
  };

  /// General magic constant for n×n square
  public func magicConstant(n : Nat) : Nat {
    n * (n * n + 1) / 2
  };

  /// Convert I Ching hexagram to binary (6 bits)
  public func hexagramToBinary(hexagram : Nat) : [Bool] {
    var result : [Bool] = [];
    var n = hexagram % 64;
    var i = 0;
    while (i < 6) {
      result := Array.append([n % 2 == 1], result);
      n := n / 2;
      i += 1;
    };
    result
  };

  /// Chinese remainder theorem
  /// Find x such that x ≡ r1 (mod m1) and x ≡ r2 (mod m2)
  public func chineseRemainder(r1 : Nat, m1 : Nat, r2 : Nat, m2 : Nat) : Nat {
    // Extended Euclidean algorithm to find modular inverse
    var x = r1;
    while (x % m2 != r2) {
      x += m1;
      if (x > m1 * m2 * 2) { return 0 }; // Prevent infinite loop
    };
    x
  };

  /// Yellow Bell calculation — the fundamental pitch
  /// Using 2/3 and 4/3 ratios to generate 12 pitches
  public func yellowBellPitch(step : Nat) : Float {
    let baseFreq = 366.0; // Approximate Yellow Bell frequency in Hz
    var freq = baseFreq;
    var i = 0;
    while (i < step % 12) {
      if (i % 2 == 0) {
        freq := freq * 4.0 / 3.0;
      } else {
        freq := freq * 2.0 / 3.0;
      };
      // Keep in same octave
      while (freq >= baseFreq * 2.0) { freq := freq / 2.0 };
      while (freq < baseFreq) { freq := freq * 2.0 };
      i += 1;
    };
    freq
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SACRED GEOMETRY
  // Universal patterns found in nature and ancient architecture
  // ═══════════════════════════════════════════════════════════════════════════

  /// Vesica Piscis dimensions (two overlapping circles)
  public func vesicaPiscis(radius : Float) : { width : Float; height : Float; area : Float } {
    let width = radius;
    let height = radius * SQRT_3;
    let area = radius * radius * (2.0 * PI / 3.0 - SQRT_3 / 2.0);
    { width; height; area }
  };

  /// Flower of Life — circles in hexagonal pattern
  public func flowerOfLifeCircles(layers : Nat) : Nat {
    if (layers == 0) { return 1 };
    1 + 6 * layers * (layers + 1) / 2
  };

  /// Seed of Life (7 circles)
  public func seedOfLife() : Nat { 7 };

  /// Fruit of Life (13 circles)
  public func fruitOfLife() : Nat { 13 };

  /// Metatron's Cube vertices
  public func metatronsCube() : Nat { 13 };

  /// Sri Yantra triangles (4 up, 5 down)
  public func sriYantraTriangles() : (Nat, Nat) { (4, 5) };

  /// Platonic solid properties
  public type PlatonicSolid = {
    name : Text;
    vertices : Nat;
    edges : Nat;
    faces : Nat;
    faceShape : Text;
    element : Text;
    dualSolid : Text;
  };

  public func tetrahedron() : PlatonicSolid {
    { name = "Tetrahedron"; vertices = 4; edges = 6; faces = 4; 
      faceShape = "Triangle"; element = "Fire"; dualSolid = "Tetrahedron" }
  };

  public func cube() : PlatonicSolid {
    { name = "Cube/Hexahedron"; vertices = 8; edges = 12; faces = 6;
      faceShape = "Square"; element = "Earth"; dualSolid = "Octahedron" }
  };

  public func octahedron() : PlatonicSolid {
    { name = "Octahedron"; vertices = 6; edges = 12; faces = 8;
      faceShape = "Triangle"; element = "Air"; dualSolid = "Cube" }
  };

  public func dodecahedron() : PlatonicSolid {
    { name = "Dodecahedron"; vertices = 20; edges = 30; faces = 12;
      faceShape = "Pentagon"; element = "Ether/Cosmos"; dualSolid = "Icosahedron" }
  };

  public func icosahedron() : PlatonicSolid {
    { name = "Icosahedron"; vertices = 12; edges = 30; faces = 20;
      faceShape = "Triangle"; element = "Water"; dualSolid = "Dodecahedron" }
  };

  /// Euler's polyhedron formula: V - E + F = 2
  public func eulerPolyhedronCheck(vertices : Nat, edges : Nat, faces : Nat) : Bool {
    vertices + faces == edges + 2
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RESONANCE & FREQUENCY MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Harmonic series: f, 2f, 3f, 4f, ...
  public func harmonicSeries(fundamental : Float, n : Nat) : Float {
    fundamental * Float.fromInt(Int.abs(n))
  };

  /// Phi-scaled frequency ladder
  public func phiFrequency(base : Float, n : Int) : Float {
    base * Float.pow(PHI, Float.fromInt(n))
  };

  /// Schumann resonance harmonics (7.83, 14.3, 20.8, 27.3, 33.8 Hz)
  public func schumannHarmonic(n : Nat) : Float {
    if (n == 0) { return 0.0 };
    SCHUMANN_HZ * Float.sqrt(Float.fromInt(Int.abs(n * (n + 1))))
  };

  /// Calculate beat frequency between two tones
  public func beatFrequency(f1 : Float, f2 : Float) : Float {
    Float.abs(f1 - f2)
  };

  /// Wavelength from frequency (assuming speed of sound 343 m/s)
  public func wavelength(frequency : Float) : Float {
    if (frequency == 0.0) { return 0.0 };
    343.0 / frequency
  };

  /// Solfeggio frequencies
  public func solfeggio(note : Text) : Float {
    switch (note) {
      case ("ut") { 396.0 };  // Liberation from fear
      case ("re") { 417.0 };  // Undoing situations
      case ("mi") { 528.0 };  // Transformation/DNA repair
      case ("fa") { 639.0 };  // Connecting/relationships
      case ("sol") { 741.0 }; // Awakening intuition
      case ("la") { 852.0 };  // Returning to spiritual order
      case (_) { 528.0 };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ASTRONOMICAL MATHEMATICS
  // Ancient sky calculations
  // ═══════════════════════════════════════════════════════════════════════════

  /// Synodic month (Moon cycle) ≈ 29.53 days
  public func synodicMonth() : Float { 29.530588853 };

  /// Sidereal month ≈ 27.32 days
  public func siderealMonth() : Float { 27.321661 };

  /// Tropical year ≈ 365.24 days
  public func tropicalYear() : Float { 365.24219 };

  /// Sidereal year ≈ 365.26 days
  public func siderealYear() : Float { 365.25636 };

  /// Metonic cycle (19 years ≈ 235 lunations)
  public func metonicCycle() : Float { 19.0 * tropicalYear() };

  /// Saros cycle for eclipse prediction ≈ 18 years 11 days
  public func sarosCycle() : Float { 6585.3211 }; // days

  /// Precession of equinoxes (one full cycle ≈ 25,772 years)
  public func precessionCycle() : Float { 25772.0 };

  /// Great Year / Platonic Year
  public func greatYear() : Float { precessionCycle() };
}
