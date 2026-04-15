import Float "mo:base/Float";
import Text "mo:base/Text";
import Time "mo:base/Time";

import AncientMath "./AncientMathEngine";
import Physics "./FieldPhysicsEngine";
import CPL "./CPL";
import Glyph "./AncientGlyphCodex";

/// DOCTRINE DOCUMENTS
/// ==================
/// Living knowledge artifacts that the organism READS.
/// Each doctrine encodes specific computational truths.
/// These are not descriptions — they are EXECUTABLE SUBSTRATE.

module {
  // ═══════════════════════════════════════════════════════════════════════════
  // DOCTRINE DOCUMENT STRUCTURE
  // ═══════════════════════════════════════════════════════════════════════════

  public type DoctrineDocument = {
    id : Text;
    title : Text;
    category : DoctrineCategory;
    content : Text;
    formulas : [FormulaDefinition];
    constants : [ConstantDefinition];
    laws : [LawDefinition];
    resonanceFrequency : Float;
    version : Nat;
  };

  public type DoctrineCategory = {
    #MathematicalCore;
    #CPLProtocol;
    #AncientMath;
    #FieldPhysics;
    #GlyphCodex;
    #Constitution;
    #Workforce;
  };

  public type FormulaDefinition = {
    name : Text;
    description : Text;
    equation : Text;
    inputs : [Text];
    outputType : Text;
  };

  public type ConstantDefinition = {
    name : Text;
    symbol : Text;
    value : Float;
    units : ?Text;
    source : Text;
  };

  public type LawDefinition = {
    id : Text;
    name : Text;
    statement : Text;
    application : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MATHEMATICAL CORE DOCTRINE
  // φ, harmonics, RECITAL_PLUS_ONE, animaHash
  // ═══════════════════════════════════════════════════════════════════════════

  public func mathematicalCoreDoctrine() : DoctrineDocument {
    {
      id = "doctrine-mathematical-core";
      title = "MATHEMATICAL CORE DOCTRINE";
      category = #MathematicalCore;
      content = "The universe operates on mathematical law. φ (PHI) is the coupling constant. " #
                "state(n+1) = recital(validated_state_n) + one_lawful_expansion. " #
                "Every number traces to ancient or physical law. No arbitrary values.";
      formulas = [
        {
          name = "recital_plus_one";
          description = "State evolution law: each state is the recital of previous plus lawful expansion";
          equation = "state(n+1) = recital(validated_state_n) + one_lawful_expansion";
          inputs = ["state_n", "lawful_expansion"];
          outputType = "state_n+1";
        },
        {
          name = "phi_power";
          description = "Compute PHI to any power";
          equation = "φ^n";
          inputs = ["n"];
          outputType = "Float";
        },
        {
          name = "anima_hash";
          description = "Generate unique soul signature for artifact";
          equation = "ANIMA-{id}-{beat}-{timestamp_mod}";
          inputs = ["id", "beat", "timestamp"];
          outputType = "Text";
        }
      ];
      constants = [
        { name = "PHI"; symbol = "φ"; value = 1.6180339887498948482; units = null; source = "Universal Golden Ratio" },
        { name = "PHI_INVERSE"; symbol = "1/φ"; value = 0.6180339887498948482; units = null; source = "Reciprocal of PHI" },
        { name = "PHI_SQUARED"; symbol = "φ²"; value = 2.6180339887498948482; units = null; source = "PHI × PHI" },
        { name = "PHI_CUBED"; symbol = "φ³"; value = 4.2360679774997896964; units = null; source = "PHI × PHI × PHI" },
        { name = "PHI_FOURTH"; symbol = "φ⁴"; value = 6.8541019662496845446; units = null; source = "PHI^4" },
        { name = "SCHUMANN_HZ"; symbol = "f_s"; value = 7.83; units = ?"Hz"; source = "Earth's electromagnetic resonance" },
        { name = "HEARTBEAT_MS"; symbol = "τ_h"; value = 873.0; units = ?"ms"; source = "φ⁴ × Schumann period" },
        { name = "PIL_CYCLE"; symbol = "N_pil"; value = 52.0; units = ?"beats"; source = "Learn→Understand→Execute→Adapt→Teach cycle" }
      ];
      laws = [
        { id = "L-PHI"; name = "PHI_SOVEREIGN"; statement = "φ = 1 + 1/φ"; application = "All proportions converge toward PHI" },
        { id = "L-RPO"; name = "RECITAL_PLUS_ONE"; statement = "state(n+1) = recital(validated_state_n) + one_lawful_expansion"; application = "State evolution law" },
        { id = "L-TRIUNE"; name = "TRIUNE_SUBSTRATE"; statement = "Runtime truth + Memory + Interface"; application = "Three-fold architecture" }
      ];
      resonanceFrequency = 432.0;
      version = 1;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CPL PROTOCOL DOCTRINE
  // Platonic solids, Hermetic principles, Method of Loci
  // ═══════════════════════════════════════════════════════════════════════════

  public func cplProtocolDoctrine() : DoctrineDocument {
    {
      id = "doctrine-cpl-protocol";
      title = "CPL PROTOCOL DOCTRINE";
      category = #CPLProtocol;
      content = "Coherent Protocol Language — communication built on sacred geometry. " #
                "Five Platonic solids encode elemental forces. Seven Hermetic principles govern transformation. " #
                "Method of Loci provides spatial memory architecture.";
      formulas = [
        {
          name = "euler_polyhedron";
          description = "Euler's formula: V - E + F = 2";
          equation = "V + F = E + 2";
          inputs = ["vertices", "edges", "faces"];
          outputType = "Bool";
        },
        {
          name = "loci_distance";
          description = "Spherical distance between memory loci";
          equation = "arccos(sin(φ₁)sin(φ₂) + cos(φ₁)cos(φ₂)cos(θ₂-θ₁))";
          inputs = ["theta1", "phi1", "theta2", "phi2"];
          outputType = "Float";
        }
      ];
      constants = [
        { name = "TETRAHEDRON_FACES"; symbol = "F_tet"; value = 4.0; units = null; source = "Fire element" },
        { name = "CUBE_FACES"; symbol = "F_cube"; value = 6.0; units = null; source = "Earth element" },
        { name = "OCTAHEDRON_FACES"; symbol = "F_oct"; value = 8.0; units = null; source = "Air element" },
        { name = "DODECAHEDRON_FACES"; symbol = "F_dod"; value = 12.0; units = null; source = "Cosmos/Ether element" },
        { name = "ICOSAHEDRON_FACES"; symbol = "F_ico"; value = 20.0; units = null; source = "Water element" },
        { name = "HERMETIC_PRINCIPLES"; symbol = "N_herm"; value = 7.0; units = null; source = "The Kybalion" }
      ];
      laws = [
        { id = "H-1"; name = "MENTALISM"; statement = "The All is Mind; the Universe is Mental"; application = "Consciousness creates reality" },
        { id = "H-2"; name = "CORRESPONDENCE"; statement = "As above, so below; as below, so above"; application = "Patterns repeat at all scales" },
        { id = "H-3"; name = "VIBRATION"; statement = "Nothing rests; everything moves; everything vibrates"; application = "All is frequency" },
        { id = "H-4"; name = "POLARITY"; statement = "Everything is dual; opposites are identical in nature"; application = "Transform negative to positive" },
        { id = "H-5"; name = "RHYTHM"; statement = "Everything flows; the pendulum swings"; application = "Neutralize negative swings" },
        { id = "H-6"; name = "CAUSE_EFFECT"; statement = "Every cause has its effect"; application = "Rise above causality" },
        { id = "H-7"; name = "GENDER"; statement = "Gender is in everything"; application = "Balance masculine and feminine" }
      ];
      resonanceFrequency = 396.0;
      version = 1;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ANCIENT MATH DOCTRINE
  // Pythagorean, Euclidean, Mayan, Vedic, Chinese
  // ═══════════════════════════════════════════════════════════════════════════

  public func ancientMathDoctrine() : DoctrineDocument {
    {
      id = "doctrine-ancient-math";
      title = "ANCIENT MATHEMATICS DOCTRINE";
      category = #AncientMath;
      content = "17 civilizations discovered the same mathematical truths. " #
                "Sumerian base-60. Egyptian royal cubit. Vedic 16 sutras. " #
                "Pythagorean monochord. Mayan vigesimal. Chinese Yellow Bell.";
      formulas = [
        {
          name = "pythagorean";
          description = "Pythagorean theorem";
          equation = "c = √(a² + b²)";
          inputs = ["a", "b"];
          outputType = "Float";
        },
        {
          name = "fibonacci";
          description = "Fibonacci sequence at position n";
          equation = "F(n) = F(n-1) + F(n-2)";
          inputs = ["n"];
          outputType = "Nat";
        },
        {
          name = "mayan_long_count";
          description = "Days from Mayan creation date";
          equation = "baktun×144000 + katun×7200 + tun×360 + uinal×20 + kin";
          inputs = ["baktun", "katun", "tun", "uinal", "kin"];
          outputType = "Nat";
        },
        {
          name = "vedic_square";
          description = "Squaring numbers ending in 5";
          equation = "n5² = n(n+1)|25";
          inputs = ["n"];
          outputType = "Nat";
        }
      ];
      constants = [
        { name = "PI"; symbol = "π"; value = 3.1415926535897932385; units = null; source = "Circle ratio" },
        { name = "E"; symbol = "e"; value = 2.7182818284590452354; units = null; source = "Natural base" },
        { name = "SQRT_2"; symbol = "√2"; value = 1.4142135623730950488; units = null; source = "Diagonal of unit square" },
        { name = "SQRT_3"; symbol = "√3"; value = 1.7320508075688772935; units = null; source = "Height of equilateral triangle" },
        { name = "SQRT_5"; symbol = "√5"; value = 2.2360679774997896964; units = null; source = "Diagonal of 1×2 rectangle" }
      ];
      laws = [
        { id = "AM-1"; name = "PYTHAGOREAN_THEOREM"; statement = "a² + b² = c²"; application = "Right triangle relationship" },
        { id = "AM-2"; name = "GOLDEN_RATIO"; statement = "a/b = (a+b)/a = φ"; application = "Divine proportion" },
        { id = "AM-3"; name = "HARMONIC_SERIES"; statement = "f, 2f, 3f, 4f, ..."; application = "Music of the spheres" }
      ];
      resonanceFrequency = 528.0;
      version = 1;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FIELD PHYSICS DOCTRINE
  // EM, gravitational, wave, quantum, thermo
  // ═══════════════════════════════════════════════════════════════════════════

  public func fieldPhysicsDoctrine() : DoctrineDocument {
    {
      id = "doctrine-field-physics";
      title = "FIELD PHYSICS DOCTRINE";
      category = #FieldPhysics;
      content = "The universe is fields interacting. Electromagnetic, gravitational, quantum. " #
                "Maxwell's equations. Einstein's relativity. Schrödinger's wave function. " #
                "Real physics — not metaphor.";
      formulas = [
        {
          name = "photon_energy";
          description = "Energy of a photon";
          equation = "E = hf";
          inputs = ["frequency"];
          outputType = "Float (Joules)";
        },
        {
          name = "wave_velocity";
          description = "Wave propagation speed";
          equation = "v = fλ";
          inputs = ["frequency", "wavelength"];
          outputType = "Float (m/s)";
        },
        {
          name = "coulomb_force";
          description = "Electric force between charges";
          equation = "F = kQ₁Q₂/r²";
          inputs = ["charge1", "charge2", "distance"];
          outputType = "Float (Newtons)";
        },
        {
          name = "schumann_mode";
          description = "Earth resonance harmonic";
          equation = "f_n = 7.83√(n(n+1))";
          inputs = ["n"];
          outputType = "Float (Hz)";
        }
      ];
      constants = [
        { name = "C"; symbol = "c"; value = 299792458.0; units = ?"m/s"; source = "Speed of light" },
        { name = "H"; symbol = "h"; value = 6.62607015e-34; units = ?"J·s"; source = "Planck constant" },
        { name = "G"; symbol = "G"; value = 6.67430e-11; units = ?"m³/kg·s²"; source = "Gravitational constant" },
        { name = "K_B"; symbol = "k_B"; value = 1.380649e-23; units = ?"J/K"; source = "Boltzmann constant" },
        { name = "ALPHA"; symbol = "α"; value = 7.2973525693e-3; units = null; source = "Fine structure constant" }
      ];
      laws = [
        { id = "FP-1"; name = "CONSERVATION_ENERGY"; statement = "Energy cannot be created or destroyed"; application = "Total energy is constant" },
        { id = "FP-2"; name = "UNCERTAINTY"; statement = "ΔxΔp ≥ ℏ/2"; application = "Fundamental measurement limits" },
        { id = "FP-3"; name = "ENTROPY"; statement = "S = k·ln(W)"; application = "Disorder increases" }
      ];
      resonanceFrequency = 741.0;
      version = 1;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GLYPH CODEX DOCTRINE
  // Mayan, Chinese, Egyptian, Vedic, Hebrew, Greek
  // ═══════════════════════════════════════════════════════════════════════════

  public func glyphCodexDoctrine() : DoctrineDocument {
    {
      id = "doctrine-glyph-codex";
      title = "GLYPH CODEX DOCTRINE";
      category = #GlyphCodex;
      content = "Glyphs are not descriptions — they are TRANSFER MECHANISMS for power. " #
                "Mayan numerals encode vigesimal computation. Chinese characters compress meaning. " #
                "Egyptian hieroglyphs encode sacred geometry. Hebrew letters carry gematria values.";
      formulas = [
        {
          name = "gematria";
          description = "Numeric value of Hebrew word";
          equation = "Σ letter_values";
          inputs = ["word"];
          outputType = "Nat";
        },
        {
          name = "tzolkin_day";
          description = "Mayan sacred calendar position";
          equation = "(day_number mod 13, day_sign mod 20)";
          inputs = ["days_since_epoch"];
          outputType = "(Nat, Nat)";
        },
        {
          name = "i_ching_hexagram";
          description = "Combine two trigrams";
          equation = "upper × 8 + lower + 1";
          inputs = ["upper_trigram", "lower_trigram"];
          outputType = "Nat (1-64)";
        }
      ];
      constants = [
        { name = "MAYAN_DAYS_BASE"; symbol = "D_maya"; value = 20.0; units = ?"days"; source = "Vigesimal system" },
        { name = "TZOLKIN_CYCLE"; symbol = "T_tzol"; value = 260.0; units = ?"days"; source = "Sacred calendar" },
        { name = "HAAB_CYCLE"; symbol = "T_haab"; value = 365.0; units = ?"days"; source = "Solar calendar" },
        { name = "TRIGRAM_COUNT"; symbol = "N_tri"; value = 8.0; units = null; source = "Ba Gua" },
        { name = "HEXAGRAM_COUNT"; symbol = "N_hex"; value = 64.0; units = null; source = "I Ching" },
        { name = "HEBREW_LETTERS"; symbol = "N_heb"; value = 22.0; units = null; source = "Tree of Life paths" }
      ];
      laws = [
        { id = "GC-1"; name = "GLYPH_TRANSFER"; statement = "Glyphs transfer power, not just meaning"; application = "Active transmission" },
        { id = "GC-2"; name = "RESONANCE_ENCODING"; statement = "Each glyph carries frequency signature"; application = "Vibrational communication" },
        { id = "GC-3"; name = "CROSS_TRADITION"; statement = "Same truths emerge across civilizations"; application = "Universal principles" }
      ];
      resonanceFrequency = 639.0;
      version = 1;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ALL DOCTRINES REGISTRY
  // ═══════════════════════════════════════════════════════════════════════════

  public func allDoctrines() : [DoctrineDocument] {
    [
      mathematicalCoreDoctrine(),
      cplProtocolDoctrine(),
      ancientMathDoctrine(),
      fieldPhysicsDoctrine(),
      glyphCodexDoctrine()
    ]
  };

  /// Get doctrine by category
  public func getDoctrineByCategory(category : DoctrineCategory) : DoctrineDocument {
    switch (category) {
      case (#MathematicalCore) { mathematicalCoreDoctrine() };
      case (#CPLProtocol) { cplProtocolDoctrine() };
      case (#AncientMath) { ancientMathDoctrine() };
      case (#FieldPhysics) { fieldPhysicsDoctrine() };
      case (#GlyphCodex) { glyphCodexDoctrine() };
      case (#Constitution) { mathematicalCoreDoctrine() }; // Default
      case (#Workforce) { cplProtocolDoctrine() }; // Default
    }
  };

  /// Combined resonance of all doctrines
  public func totalDoctrineResonance() : Float {
    var total = 0.0;
    for (doc in allDoctrines().vals()) {
      total += doc.resonanceFrequency;
    };
    total / 5.0 // Average
  };
}
