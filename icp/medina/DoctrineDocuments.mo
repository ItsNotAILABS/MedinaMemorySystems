import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";
import CPL "./CPL";
import DocOrg "./DocumentOrganism";
import Glyph "./AncientGlyphCodex";

/// DoctrineDocuments: Living Document Organisms for Each Core Module
/// These are NOT static text - they are LIVING KNOWLEDGE ARTIFACTS that the
/// computational organism READS to inform its behavior.
/// 
/// The architecture:
/// 1. Each engine (MatalkoICP, CPL, AncientMath, FieldPhysics) has a DOCUMENT representation
/// 2. The Sovereign Organism (Oro+Nova) READS these documents
/// 3. The documents EVOLVE and MUTATE based on usage and system state
/// 4. Documents inform computation - they are not just descriptions
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCTRINE DOCUMENT TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// The type of doctrine a document encodes
  public type DoctrineType = {
    #MathematicalCore;      // MatalkoICP principles
    #CommunicationProtocol; // CPL substrate
    #AncientMathematics;    // AncientMathEngine formulas
    #FieldPhysics;          // FieldPhysicsEngine laws
    #GlyphCodex;            // AncientGlyphCodex symbols
    #SovereignLaw;          // RECITAL_PLUS_ONE and core laws
    #OrganismBehavior;      // How the organism acts
  };

  /// A doctrine document with encoded formulas
  public type DoctrineDocument = {
    // Base document organism properties
    organism : DocOrg.DocumentOrganism;
    
    // Doctrine-specific encoding
    doctrineType : DoctrineType;
    encodedFormulas : [EncodedFormula];
    glyphSignature : [Glyph.Glyph];
    
    // Reading/execution state
    lastReadBy : ?Text;
    readCount : Nat;
    executionCount : Nat;
    
    // Computational influence
    influenceWeight : Float;  // How much this affects organism behavior
    activeInComputation : Bool;
  };

  /// A formula encoded into a document
  public type EncodedFormula = {
    id : Text;
    name : Text;
    formulaType : FormulaType;
    parameters : [Text];
    implementation : Text;  // Motoko function reference
    ancientSource : Text;   // What ancient source it comes from
    glyphRepresentation : ?Glyph.GlyphPhrase;
    lastExecuted : ?Int;
    executionCount : Nat;
  };

  /// Types of formulas
  public type FormulaType = {
    #Constant;      // Fixed value (PHI, PI, etc.)
    #Unary;         // Single input (sqrt, log)
    #Binary;        // Two inputs (add, multiply)
    #Sequence;      // Series generation (fibonacci, harmonic)
    #Transform;     // State transformation (recitalPlusOne)
    #Field;         // Field computation (coherence, resonance)
    #Glyph;         // Glyph-based computation
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCTRINE DOCUMENT CREATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Create the MatalkoICP doctrine document
  public func createMatalkoDocument(beat : Nat) : DoctrineDocument {
    let content = "MATALKO ICP DOCTRINE\n" #
      "The Mathematical Core of Sovereign Computation\n\n" #
      "UNIVERSAL CONSTANTS:\n" #
      "PHI = 1.618033988749895 - The Golden Ratio\n" #
      "PHI_INVERSE = 0.618033988749895 - Inverse Golden Ratio\n" #
      "PHI_SQUARED = 2.618033988749895 - Phi Squared\n" #
      "FREQ_432 = 432 Hz - Universal Base Frequency\n" #
      "E = 2.718281828459045 - Euler Number\n" #
      "PI = 3.141592653589793 - Pi\n" #
      "TAU = 6.283185307179586 - Tau (2pi)\n\n" #
      "CORE LAWS:\n" #
      "1. RECITAL_PLUS_ONE: state(n+1) = recital(validated_state_n) + one_lawful_expansion\n" #
      "2. DUAL_READ: semantic_channel XOR resonance_channel\n" #
      "3. FIELD_COHERENCE: inverse variance across registers\n" #
      "4. GOLDEN_ANGLE: 137.5 degrees for optimal distribution\n" #
      "5. ANIMA_HASH: deterministic sovereign identity\n";
    
    let organism = DocOrg.germinate(
      "doctrine-matalko",
      "MatalkoICP Mathematical Core",
      #Constitution,
      content,
      null,
      1,  // Ring N1 - Constitutional
      beat
    );
    
    {
      organism = organism;
      doctrineType = #MathematicalCore;
      encodedFormulas = [
        { 
          id = "phi"; name = "Golden Ratio"; formulaType = #Constant;
          parameters = []; implementation = "Matalko.PHI";
          ancientSource = "Pythagoras, Euclid";
          glyphRepresentation = ?Glyph.combineGlyphs([Glyph.greekLetter("phi")]);
          lastExecuted = null; executionCount = 0;
        },
        {
          id = "recital-plus-one"; name = "RECITAL_PLUS_ONE"; formulaType = #Transform;
          parameters = ["state", "expansion"]; implementation = "Matalko.recitalPlusOne";
          ancientSource = "Sovereign Law";
          glyphRepresentation = null;
          lastExecuted = null; executionCount = 0;
        },
        {
          id = "golden-angle"; name = "Golden Angle"; formulaType = #Constant;
          parameters = []; implementation = "Matalko.goldenAngle";
          ancientSource = "Phyllotaxis";
          glyphRepresentation = null;
          lastExecuted = null; executionCount = 0;
        },
        {
          id = "harmonic-resonance"; name = "Harmonic Resonance"; formulaType = #Binary;
          parameters = ["f1", "f2"]; implementation = "Matalko.harmonicResonance";
          ancientSource = "Pythagorean Music Theory";
          glyphRepresentation = null;
          lastExecuted = null; executionCount = 0;
        }
      ];
      glyphSignature = [Glyph.greekLetter("phi"), Glyph.egyptianSymbol("pyramid")];
      lastReadBy = null;
      readCount = 0;
      executionCount = 0;
      influenceWeight = 1.0;
      activeInComputation = true;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ORGANISM READS DOCUMENTS
  // ═══════════════════════════════════════════════════════════════════════════

  /// When the organism reads a doctrine document
  public func organismRead(doc : DoctrineDocument, readerId : Text) : DoctrineDocument {
    let now = Time.now();
    
    // Update the base organism
    let newOrganism = {
      doc.organism with
      resonanceCharge = Matalko.recitalPlusOneBounded(
        doc.organism.resonanceCharge, 0.1, 0.0, 10.0
      );
      lastAccessedNs = now;
    };
    
    {
      doc with
      organism = newOrganism;
      lastReadBy = ?readerId;
      readCount = doc.readCount + 1;
    };
  };

  /// Execute a formula from a doctrine document
  public func executeFormula(doc : DoctrineDocument, formulaId : Text) : (DoctrineDocument, ?EncodedFormula) {
    let now = Time.now();
    var found : ?EncodedFormula = null;
    
    let newFormulas = Array.map<EncodedFormula, EncodedFormula>(doc.encodedFormulas, func(f : EncodedFormula) : EncodedFormula {
      if (f.id == formulaId) {
        found := ?f;
        { f with lastExecuted = ?now; executionCount = f.executionCount + 1 };
      } else { f };
    });
    
    ({
      doc with
      encodedFormulas = newFormulas;
      executionCount = doc.executionCount + 1;
    }, found);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCTRINE LIBRARY (All Core Documents)
  // ═══════════════════════════════════════════════════════════════════════════

  /// The complete doctrine library
  public type DoctrineLibrary = {
    matalko : DoctrineDocument;
    cpl : DoctrineDocument;
    ancientMath : DoctrineDocument;
    fieldPhysics : DoctrineDocument;
    glyphCodex : DoctrineDocument;
  };

  /// Initialize the complete doctrine library
  public func initDoctrineLibrary(beat : Nat) : DoctrineLibrary {
    {
      matalko = createMatalkoDocument(beat);
      cpl = createCPLDocument(beat);
      ancientMath = createAncientMathDocument(beat);
      fieldPhysics = createFieldPhysicsDocument(beat);
      glyphCodex = createGlyphCodexDocument(beat);
    };
  };

  /// Create CPL doctrine document
  public func createCPLDocument(beat : Nat) : DoctrineDocument {
    let content = "CPL - COGNITIVE PROCUREMENT LANGUAGE\n" #
      "The Communication Substrate Between Organisms\n\n" #
      "ANCIENT FOUNDATIONS:\n" #
      "- Plato: Five Platonic Solids\n" #
      "- Aristotle: Four Causes (Material, Formal, Efficient, Final)\n" #
      "- Pythagoras: Tetractys (1+2+3+4=10)\n" #
      "- Hermes: Seven Hermetic Principles\n" #
      "- Romans/Greeks: Method of Loci\n\n" #
      "ELEMENT TO REGISTER:\n" #
      "Fire -> Cognitive | Air -> Affective | Earth -> Somatic | Water -> Sovereign\n";
    
    let organism = DocOrg.germinate("doctrine-cpl", "CPL Protocol", #Doctrine, content, null, 2, beat);
    
    {
      organism = organism;
      doctrineType = #CommunicationProtocol;
      encodedFormulas = [];
      glyphSignature = [Glyph.egyptianSymbol("ankh")];
      lastReadBy = null;
      readCount = 0;
      executionCount = 0;
      influenceWeight = 0.9;
      activeInComputation = true;
    };
  };

  /// Create Ancient Math doctrine document
  public func createAncientMathDocument(beat : Nat) : DoctrineDocument {
    let content = "ANCIENT MATHEMATICS ENGINE\n" #
      "Real Formulas from Ancient Civilizations\n\n" #
      "PYTHAGOREAN: a^2 + b^2 = c^2, Tetractys\n" #
      "EUCLIDEAN: GCD, LCM, Extended Algorithm\n" #
      "PLATONIC: V-E+F=2, All 5 solids\n" #
      "MAYAN: Base-20, Long Count, Tzolkin\n" #
      "VEDIC: Digit sum, Chakra frequencies\n" #
      "CHINESE: Lo Shu, I Ching, Bagua\n";
    
    let organism = DocOrg.germinate("doctrine-ancient-math", "Ancient Math", #Doctrine, content, null, 2, beat);
    
    {
      organism = organism;
      doctrineType = #AncientMathematics;
      encodedFormulas = [];
      glyphSignature = [Glyph.mayanNumber(13)];
      lastReadBy = null;
      readCount = 0;
      executionCount = 0;
      influenceWeight = 0.85;
      activeInComputation = true;
    };
  };

  /// Create Field Physics doctrine document
  public func createFieldPhysicsDocument(beat : Nat) : DoctrineDocument {
    let content = "FIELD PHYSICS ENGINE\n" #
      "Real Physics for Organism Computation\n\n" #
      "ELECTROMAGNETIC: Coulomb, Lorentz\n" #
      "GRAVITATIONAL: Newton, Escape Velocity\n" #
      "WAVE: y = A sin(kx-wt+phi)\n" #
      "QUANTUM: |psi|^2, Uncertainty\n" #
      "THERMODYNAMIC: PV=nRT, Boltzmann\n";
    
    let organism = DocOrg.germinate("doctrine-field-physics", "Field Physics", #Doctrine, content, null, 2, beat);
    
    {
      organism = organism;
      doctrineType = #FieldPhysics;
      encodedFormulas = [];
      glyphSignature = [Glyph.greekLetter("omega")];
      lastReadBy = null;
      readCount = 0;
      executionCount = 0;
      influenceWeight = 0.8;
      activeInComputation = true;
    };
  };

  /// Create Glyph Codex doctrine document
  public func createGlyphCodexDocument(beat : Nat) : DoctrineDocument {
    let content = "ANCIENT GLYPH CODEX\n" #
      "Symbol-Based Transfer System\n\n" #
      "MAYAN: Base-20, Day signs, Long Count\n" #
      "CHINESE: Wu Xing, Bagua, I Ching\n" #
      "EGYPTIAN: Ankh, Eye, Djed, Fractions\n" #
      "VEDIC: Bija mantras, Chakras\n" #
      "HEBREW: Gematria, Tree of Life\n" #
      "GREEK: phi, pi, tau\n\n" #
      "These are TRANSFER MECHANISMS for power.\n";
    
    let organism = DocOrg.germinate("doctrine-glyph-codex", "Glyph Codex", #Doctrine, content, null, 2, beat);
    
    {
      organism = organism;
      doctrineType = #GlyphCodex;
      encodedFormulas = [];
      glyphSignature = [Glyph.vedicBija("om")];
      lastReadBy = null;
      readCount = 0;
      executionCount = 0;
      influenceWeight = 0.75;
      activeInComputation = true;
    };
  };

  /// Compute total doctrine influence on organism
  public func totalDoctrineInfluence(library : DoctrineLibrary) : Float {
    library.matalko.influenceWeight +
    library.cpl.influenceWeight +
    library.ancientMath.influenceWeight +
    library.fieldPhysics.influenceWeight +
    library.glyphCodex.influenceWeight;
  };
};