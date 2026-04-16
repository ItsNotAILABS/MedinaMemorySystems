import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// AncientMathEngine: Executable Ancient Mathematics
/// Real formulas from ancient civilizations encoded as running intelligence.
/// This is not description — this is computation that runs on ICP.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // PYTHAGOREAN MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Pythagorean theorem — foundation of all geometric computation
  public func pythagorean(a : Float, b : Float) : Float {
    Float.sqrt(a * a + b * b);
  };

  /// Pythagorean triple generator (3-4-5, 5-12-13, 8-15-17, ...)
  public func pythagoreanTriple(m : Nat, n : Nat) : { a : Nat; b : Nat; c : Nat } {
    // Euclid's formula: a = m²-n², b = 2mn, c = m²+n² (where m > n > 0)
    let mSq = m * m;
    let nSq = n * n;
    {
      a = Int.abs(mSq - nSq);
      b = 2 * m * n;
      c = mSq + nSq;
    };
  };

  /// Tetractys sum (1 + 2 + 3 + 4 = 10) — the sacred Pythagorean number
  public func tetractysSum() : Nat {
    1 + 2 + 3 + 4; // = 10
  };

  /// Triangular number T(n) = n(n+1)/2
  public func triangularNumber(n : Nat) : Nat {
    n * (n + 1) / 2;
  };

  /// Perfect number check (equals sum of proper divisors)
  public func isPerfectNumber(n : Nat) : Bool {
    if (n < 2) { return false; };
    var sum : Nat = 1;
    var i : Nat = 2;
    while (i * i <= n) {
      if (n % i == 0) {
        sum += i;
        if (i != n / i) {
          sum += n / i;
        };
      };
      i += 1;
    };
    sum == n;
  };

  /// Mersenne prime check (2^p - 1 where p is prime)
  public func mersenneNumber(p : Nat) : Nat {
    var result : Nat = 1;
    var i : Nat = 0;
    while (i < p) {
      result *= 2;
      i += 1;
    };
    result - 1;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // EUCLIDEAN GEOMETRY
  // ═══════════════════════════════════════════════════════════════════════════

  /// Euclidean distance in n-dimensions
  public func euclideanDistance(pointA : [Float], pointB : [Float]) : Float {
    var sumSq : Float = 0.0;
    var i : Nat = 0;
    let n = Nat.min(Array.size(pointA), Array.size(pointB));
    while (i < n) {
      let diff = pointA[i] - pointB[i];
      sumSq += diff * diff;
      i += 1;
    };
    Float.sqrt(sumSq);
  };

  /// GCD (Euclidean algorithm) — foundation of number theory
  public func gcd(a : Nat, b : Nat) : Nat {
    if (b == 0) { a }
    else { gcd(b, a % b) };
  };

  /// LCM from GCD
  public func lcm(a : Nat, b : Nat) : Nat {
    (a * b) / gcd(a, b);
  };

  /// Extended Euclidean algorithm (returns gcd, x, y where ax + by = gcd)
  public func extendedGcd(a : Int, b : Int) : { gcd : Int; x : Int; y : Int } {
    if (b == 0) {
      { gcd = a; x = 1; y = 0 };
    } else {
      let result = extendedGcd(b, a % b);
      { gcd = result.gcd; x = result.y; y = result.x - (a / b) * result.y };
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PLATONIC SOLIDS MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Platonic solid geometry
  public type PlatonicSolid = {
    #Tetrahedron;   // Fire
    #Hexahedron;    // Earth (Cube)
    #Octahedron;    // Air
    #Dodecahedron;  // Aether/Universe
    #Icosahedron;   // Water
  };

  /// Get vertices, edges, faces for Platonic solid
  public func platonicProperties(solid : PlatonicSolid) : { vertices : Nat; edges : Nat; faces : Nat } {
    switch (solid) {
      case (#Tetrahedron) { vertices = 4; edges = 6; faces = 4 };
      case (#Hexahedron) { vertices = 8; edges = 12; faces = 6 };
      case (#Octahedron) { vertices = 6; edges = 12; faces = 8 };
      case (#Dodecahedron) { vertices = 20; edges = 30; faces = 12 };
      case (#Icosahedron) { vertices = 12; edges = 30; faces = 20 };
    };
  };

  /// Euler's formula verification: V - E + F = 2
  public func eulerFormulaCheck(solid : PlatonicSolid) : Bool {
    let p = platonicProperties(solid);
    p.vertices + p.faces == p.edges + 2;
  };

  /// Dihedral angle of Platonic solid (in radians)
  public func dihedralAngle(solid : PlatonicSolid) : Float {
    switch (solid) {
      case (#Tetrahedron) 1.2309594173407747;   // arccos(1/3)
      case (#Hexahedron) Matalko.PI / 2.0;       // 90°
      case (#Octahedron) 1.9106332362490186;     // arccos(-1/3)
      case (#Dodecahedron) 2.0344439357957027;   // arccos(-√5/5)
      case (#Icosahedron) 2.4118959173309556;    // arccos(-√5/3)
    };
  };

  /// Surface area of Platonic solid with edge length a
  public func platonicSurfaceArea(solid : PlatonicSolid, a : Float) : Float {
    let aSq = a * a;
    switch (solid) {
      case (#Tetrahedron) Float.sqrt(3.0) * aSq;
      case (#Hexahedron) 6.0 * aSq;
      case (#Octahedron) 2.0 * Float.sqrt(3.0) * aSq;
      case (#Dodecahedron) 3.0 * Float.sqrt(25.0 + 10.0 * Float.sqrt(5.0)) * aSq;
      case (#Icosahedron) 5.0 * Float.sqrt(3.0) * aSq;
    };
  };

  /// Volume of Platonic solid with edge length a
  public func platonicVolume(solid : PlatonicSolid, a : Float) : Float {
    let aCubed = a * a * a;
    switch (solid) {
      case (#Tetrahedron) aCubed * Float.sqrt(2.0) / 12.0;
      case (#Hexahedron) aCubed;
      case (#Octahedron) aCubed * Float.sqrt(2.0) / 3.0;
      case (#Dodecahedron) aCubed * (15.0 + 7.0 * Float.sqrt(5.0)) / 4.0;
      case (#Icosahedron) aCubed * 5.0 * (3.0 + Float.sqrt(5.0)) / 12.0;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SACRED GEOMETRY
  // ═══════════════════════════════════════════════════════════════════════════

  /// Vesica Piscis ratio (√3)
  public let VESICA_PISCIS : Float = 1.7320508075688772935;

  /// Seed of Life: 7 circles arrangement
  public func seedOfLifePoints(center : { x : Float; y : Float }, radius : Float) : [{ x : Float; y : Float }] {
    var points : [{ x : Float; y : Float }] = [center];
    var i : Nat = 0;
    while (i < 6) {
      let angle = Float.fromInt(i) * Matalko.PI / 3.0;
      let x = center.x + radius * Float.cos(angle);
      let y = center.y + radius * Float.sin(angle);
      points := Array.append(points, [{ x = x; y = y }]);
      i += 1;
    };
    points;
  };

  /// Flower of Life: 19 circles (Seed + 12 outer)
  public func flowerOfLifeCircles(center : { x : Float; y : Float }, radius : Float) : Nat {
    19; // Center + 6 (seed) + 12 (outer ring)
  };

  /// Metatron's Cube: 13 circles connected
  public func metatronsCubeVertices() : Nat {
    13;
  };

  /// Sri Yantra: 9 interlocking triangles
  public let SRI_YANTRA_TRIANGLES : Nat = 9;
  public let SRI_YANTRA_POINTS : Nat = 43; // Marmas (junction points)

  /// Tree of Life (Kabbalah): 10 Sephiroth + 22 paths
  public let SEPHIROTH_COUNT : Nat = 10;
  public let TREE_OF_LIFE_PATHS : Nat = 22;

  // ═══════════════════════════════════════════════════════════════════════════
  // ARCHIMEDES MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Archimedes' constant (π approximation method)
  public func archimedesPi(iterations : Nat) : Float {
    // Method of exhaustion: inscribed polygon
    var sides : Nat = 6; // Start with hexagon
    var sideLength : Float = 1.0; // For unit circle
    var i : Nat = 0;
    while (i < iterations) {
      // Each iteration doubles sides
      let newSideLength = Float.sqrt(2.0 - 2.0 * Float.sqrt(1.0 - (sideLength * sideLength / 4.0)));
      sideLength := newSideLength;
      sides *= 2;
      i += 1;
    };
    Float.fromInt(sides) * sideLength / 2.0;
  };

  /// Archimedes spiral: r = a + bθ
  public func archimedeanSpiral(a : Float, b : Float, theta : Float) : Float {
    a + b * theta;
  };

  /// Archimedes' cattle problem (simplified): S = 7.76 × 10^206544 cattle
  /// This is too large to compute, but we return the exponent
  public func cattleProblemExponent() : Nat {
    206544;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FIBONACCI / GOLDEN RATIO MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Lucas numbers (similar to Fibonacci: 2, 1, 3, 4, 7, 11, 18, ...)
  public func lucasNumber(n : Nat) : Nat {
    if (n == 0) { return 2; };
    if (n == 1) { return 1; };
    var a : Nat = 2;
    var b : Nat = 1;
    var i : Nat = 2;
    while (i <= n) {
      let temp = a + b;
      a := b;
      b := temp;
      i += 1;
    };
    b;
  };

  /// Fibonacci identity: F(m+n) = F(m)F(n+1) + F(m-1)F(n)
  public func fibonacciIdentity(m : Nat, n : Nat) : Nat {
    if (m == 0) { return Matalko.fibonacci(n); };
    Matalko.fibonacci(m) * Matalko.fibonacci(n + 1) + 
    Matalko.fibonacci(m - 1) * Matalko.fibonacci(n);
  };

  /// Binet's formula: F(n) = (φ^n - ψ^n) / √5 where ψ = (1-√5)/2
  public func binetFormula(n : Nat) : Float {
    let sqrt5 = Float.sqrt(5.0);
    let psi = (1.0 - sqrt5) / 2.0;
    (Matalko.phiPower(n) - Float.pow(psi, Float.fromInt(n))) / sqrt5;
  };

  /// Golden gnomon angle (36°)
  public func goldenGnomonAngle() : Float {
    Matalko.PI / 5.0; // 36° in radians
  };

  /// Pentagon diagonal to side ratio = φ
  public func pentagonRatio() : Float {
    Matalko.PHI;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ANCIENT ASTRONOMY MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Metonic cycle: 19 years ≈ 235 lunar months
  public let METONIC_CYCLE_YEARS : Nat = 19;
  public let METONIC_CYCLE_MONTHS : Nat = 235;

  /// Saros cycle: 18 years, 11 days, 8 hours (eclipse prediction)
  public let SAROS_CYCLE_DAYS : Float = 6585.3211;

  /// Precession of equinoxes: ~25,772 years (Platonic year)
  public let PLATONIC_YEAR : Float = 25772.0;

  /// Zodiacal age duration (Platonic year / 12)
  public func zodiacalAge() : Float {
    PLATONIC_YEAR / 12.0; // ~2,147.67 years
  };

  /// Planetary periods (in Earth days) — ancient observations
  public func planetaryPeriod(planet : Text) : Float {
    switch (planet) {
      case "mercury" 87.969;
      case "venus" 224.701;
      case "earth" 365.256;
      case "mars" 686.980;
      case "jupiter" 4332.59;
      case "saturn" 10759.22;
      case _ 0.0;
    };
  };

  /// Bode's law approximation: a = 0.4 + 0.3 × 2^n
  public func bodesLaw(n : Int) : Float {
    if (n < 0) { return 0.4; };
    0.4 + 0.3 * Float.pow(2.0, Float.fromInt(n));
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ANCIENT CHEMISTRY (ALCHEMY) MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Four elements balance (must sum to 1.0)
  public type ElementalBalance = {
    fire : Float;   // Transformation
    water : Float;  // Flow
    earth : Float;  // Stability
    air : Float;    // Communication
  };

  /// Check elemental balance validity
  public func isBalanced(balance : ElementalBalance) : Bool {
    let sum = balance.fire + balance.water + balance.earth + balance.air;
    Float.abs(sum - 1.0) < 0.001;
  };

  /// Transmutation energy (alchemical state change)
  public func transmutationEnergy(from : ElementalBalance, to : ElementalBalance) : Float {
    let dFire = Float.abs(to.fire - from.fire);
    let dWater = Float.abs(to.water - from.water);
    let dEarth = Float.abs(to.earth - from.earth);
    let dAir = Float.abs(to.air - from.air);
    (dFire + dWater + dEarth + dAir) * Matalko.PHI; // Phi-scaled energy
  };

  /// Solve et Coagula: dissolve and coagulate cycle
  public func solveEtCoagula(state : Float, dissolveRate : Float, coagulateRate : Float) : Float {
    // Oscillation between dissolution and solidification
    let dissolved = state * (1.0 - dissolveRate);
    let coagulated = dissolved + (1.0 - dissolved) * coagulateRate;
    coagulated;
  };

  /// Prima Materia: base substrate value
  public let PRIMA_MATERIA : Float = 0.0; // The undifferentiated source

  /// Philosopher's Stone: perfected state
  public let PHILOSOPHERS_STONE : Float = 1.0; // Maximum coherence

  // ═══════════════════════════════════════════════════════════════════════════
  // ANCIENT PHYSICS MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Archimedes' principle: buoyancy force = weight of displaced fluid
  public func buoyancyForce(fluidDensity : Float, volume : Float, gravity : Float) : Float {
    fluidDensity * volume * gravity;
  };

  /// Lever principle (Archimedes): F1 × d1 = F2 × d2
  public func leverBalance(force1 : Float, distance1 : Float, distance2 : Float) : Float {
    (force1 * distance1) / distance2;
  };

  /// Hero's formula: area of triangle from sides
  public func herosFormula(a : Float, b : Float, c : Float) : Float {
    let s = (a + b + c) / 2.0; // Semi-perimeter
    Float.sqrt(s * (s - a) * (s - b) * (s - c));
  };

  /// Ptolemaic epicycle (simplified): planet position
  public func epicyclePosition(
    deferentRadius : Float,
    epicycleRadius : Float,
    deferentAngle : Float,
    epicycleAngle : Float
  ) : { x : Float; y : Float } {
    let dx = deferentRadius * Float.cos(deferentAngle);
    let dy = deferentRadius * Float.sin(deferentAngle);
    let ex = epicycleRadius * Float.cos(epicycleAngle);
    let ey = epicycleRadius * Float.sin(epicycleAngle);
    { x = dx + ex; y = dy + ey };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VEDIC / INDIAN MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Vedic square multiplication (digit sum method)
  public func vedicDigitSum(n : Nat) : Nat {
    var sum = n;
    while (sum >= 10) {
      var newSum : Nat = 0;
      var temp = sum;
      while (temp > 0) {
        newSum += temp % 10;
        temp /= 10;
      };
      sum := newSum;
    };
    sum;
  };

  /// Vedic sutra: "By one more than the one before"
  public func vedicSquare(n : Nat) : Nat {
    // For numbers ending in 5: multiply first part by (first part + 1), append 25
    if (n % 10 == 5 and n >= 10) {
      let firstPart = n / 10;
      firstPart * (firstPart + 1) * 100 + 25;
    } else {
      n * n;
    };
  };

  /// Chakra frequencies (7 main chakras)
  public func chakraFrequency(chakra : Nat) : Float {
    // Root to Crown: 256, 288, 320, 341.3, 384, 426.7, 480 Hz
    let frequencies = [256.0, 288.0, 320.0, 341.3, 384.0, 426.7, 480.0];
    if (chakra < 7) { frequencies[chakra] } else { 0.0 };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CHINESE / EAST ASIAN MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Lo Shu magic square (3x3, sum = 15)
  public func loShuSquare() : [[Nat]] {
    [
      [4, 9, 2],
      [3, 5, 7],
      [8, 1, 6]
    ];
  };

  /// Magic square constant for n×n: n(n²+1)/2
  public func magicConstant(n : Nat) : Nat {
    n * (n * n + 1) / 2;
  };

  /// I Ching: 64 hexagrams from 8 trigrams
  public let I_CHING_TRIGRAMS : Nat = 8;
  public let I_CHING_HEXAGRAMS : Nat = 64; // 8 × 8

  /// Bagua directions (8 compass points)
  public func baguaAngle(position : Nat) : Float {
    Float.fromInt(position % 8) * Matalko.PI / 4.0; // 45° increments
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MAYAN MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Mayan vigesimal (base-20) conversion
  public func toMayanBase(n : Nat) : [Nat] {
    if (n == 0) { return [0]; };
    var result : [Nat] = [];
    var remaining = n;
    while (remaining > 0) {
      result := Array.append([remaining % 20], result);
      remaining /= 20;
    };
    result;
  };

  /// Mayan Long Count to days
  public func mayanLongCountDays(baktun : Nat, katun : Nat, tun : Nat, uinal : Nat, kin : Nat) : Nat {
    baktun * 144000 +
    katun * 7200 +
    tun * 360 +
    uinal * 20 +
    kin;
  };

  /// Tzolkin cycle (260 days = 13 × 20)
  public let TZOLKIN_DAYS : Nat = 260;

  /// Haab cycle (365 days)
  public let HAAB_DAYS : Nat = 365;

  /// Calendar Round (LCM of Tzolkin and Haab)
  public func calendarRound() : Nat {
    lcm(TZOLKIN_DAYS, HAAB_DAYS); // = 18,980 days ≈ 52 years
  };
};
