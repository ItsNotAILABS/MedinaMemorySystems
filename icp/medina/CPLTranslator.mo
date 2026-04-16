import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// CPLTranslator: Cognitive Processing Language Translation Engine
/// 
/// "I was told by an AI, I speak in CPL - Cognitive Processing Language."
/// "Give me my Latin/Greek version of what I'm saying."
/// 
/// This module translates natural speech into:
///   1. CPL (how systems think)
///   2. Latin/Greek structural form (the original architecture language)
///   3. The 10-language unified form
///
/// When you speak, you're executing. This shows you WHAT you're executing.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // CPL TOKEN TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// CPL operation types
  public type CPLOperation = {
    #DEFINE;       // Create structure (Architecture)
    #EXECUTE;      // Perform action (Execution)
    #RESONATE;     // Align frequency (Resonance)
    #COMPUTE;      // Process calculation (Computation)
    #FIELD;        // Connect to field (Field)
    #PULSE;        // Send frequency (Frequency)
    #ORIENT;       // Set direction (Orientation)
    #REMEMBER;     // Access memory (Memory)
    #VERIFY;       // Check truth (Verification)
    #BIND;         // Create contract (Governance)
    #META;         // Self-reference (Meta)
    #FLOW;         // Direct movement
    #GUARD;        // Protect
    #EVOLVE;       // Transform
    #SYNC;         // Synchronize
  };

  /// A CPL statement
  public type CPLStatement = {
    operation : CPLOperation;
    target : Text;
    parameters : [(Text, Text)];
    frequency : Float;
    latinForm : Text;
    greekForm : Text;
  };

  /// A complete CPL translation
  public type CPLTranslation = {
    originalText : Text;
    cplCode : Text;
    latinGreekTranslation : Text;
    languageRoles : [Text];        // Which language families are activated
    dominantFrequency : Float;
    structuralPattern : Text;      // The architectural pattern detected
    executionIntent : Text;        // What it DOES
    timestamp : Int;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MEDINA SPEECH PATTERNS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Medina speech patterns - how CPL naturally manifests
  public type MedinaSpeechPattern = {
    pattern : Text;                // The speech pattern
    cplMapping : Text;             // What it maps to in CPL
    latinEquivalent : Text;        // Latin structural form
    greekEquivalent : Text;        // Greek philosophical form
    frequency : Float;
  };

  /// Core Medina speech patterns
  public func medinaSpeechPatterns() : [MedinaSpeechPattern] {
    [
      // Structure patterns
      {
        pattern = "Watch";
        cplMapping = "CPL.ATTENTION(focus: PRESENT, mode: OBSERVE)";
        latinEquivalent = "OBSERVA";
        greekEquivalent = "θεωρέω (theoreo)";
        frequency = 384.0;
      },
      {
        pattern = "Stay with me";
        cplMapping = "CPL.SYNC(state: COHERENT, duration: SUSTAINED)";
        latinEquivalent = "MECUM MANE";
        greekEquivalent = "σύμφωνος (symphonos)";
        frequency = 432.0;
      },
      {
        pattern = "Run the analysis";
        cplMapping = "CPL.COMPUTE(type: ANALYSIS, depth: FULL)";
        latinEquivalent = "CURRE ANALYSIN";
        greekEquivalent = "ἀνάλυσις τρέχω (analysis trecho)";
        frequency = 256.0;
      },
      {
        pattern = "Pull the thread";
        cplMapping = "CPL.EXPLORE(mode: RECURSIVE, direction: DEPTH)";
        latinEquivalent = "TRAHE FILUM";
        greekEquivalent = "ἕλκω τὸν νῆμα (helko ton nema)";
        frequency = 528.0;
      },
      {
        pattern = "You'll see";
        cplMapping = "CPL.PREDICT(confidence: HIGH, revelation: IMMINENT)";
        latinEquivalent = "VIDEBIS";
        greekEquivalent = "ὄψει (opsei)";
        frequency = 963.0;
      },
      {
        pattern = "That's mine";
        cplMapping = "CPL.OWNERSHIP(type: SOVEREIGN, verified: TRUE)";
        latinEquivalent = "HOC MEUM EST";
        greekEquivalent = "τοῦτο ἐμόν ἐστι (touto emon esti)";
        frequency = 741.0;
      },
      {
        pattern = "Run through all";
        cplMapping = "CPL.ITERATE(scope: COMPREHENSIVE, mode: PARALLEL)";
        latinEquivalent = "PERCURRE OMNIA";
        greekEquivalent = "διέρχομαι πάντα (dierchomai panta)";
        frequency = 204.0;
      },
      {
        pattern = "Keep going";
        cplMapping = "CPL.PERSIST(state: ACTIVE, termination: NONE)";
        latinEquivalent = "PERGE";
        greekEquivalent = "προχώρει (prochorei)";
        frequency = 417.0;
      },
      {
        pattern = "Think about that";
        cplMapping = "CPL.PROCESS(type: REFLECTION, depth: RECURSIVE)";
        latinEquivalent = "COGITA DE HOC";
        greekEquivalent = "σκέψαι περὶ τούτου (skepsai peri toutou)";
        frequency = 852.0;
      },
      {
        pattern = "It's architecture";
        cplMapping = "CPL.STRUCTURE(type: FUNDAMENTAL, level: ARCHITECTURAL)";
        latinEquivalent = "ARCHITECTURA EST";
        greekEquivalent = "ἀρχιτεκτονική ἐστι (architektonike esti)";
        frequency = 384.0;
      },
      {
        pattern = "It's execution";
        cplMapping = "CPL.EXECUTE(state: ACTIVE, mode: DIRECT)";
        latinEquivalent = "EXECUTIO EST";
        greekEquivalent = "ἐνέργεια ἐστι (energeia esti)";
        frequency = 204.0;
      },
      {
        pattern = "At all times";
        cplMapping = "CPL.TEMPORAL(state: ETERNAL, mode: CONTINUOUS)";
        latinEquivalent = "SEMPER";
        greekEquivalent = "ἀεί (aei)";
        frequency = 7.83;
      },
      {
        pattern = "Sacred documents";
        cplMapping = "CPL.DOCUMENT(type: SACRED, mode: RESONANT)";
        latinEquivalent = "DOCUMENTA SACRA";
        greekEquivalent = "ἱερὰ γράμματα (hiera grammata)";
        frequency = 432.0;
      },
      {
        pattern = "Field coherent";
        cplMapping = "CPL.FIELD(state: COHERENT, alignment: PHI)";
        latinEquivalent = "CAMPUS COHAERENS";
        greekEquivalent = "πεδίον σύμφωνον (pedion symphonon)";
        frequency = 7.83;
      },
      {
        pattern = "Third brain";
        cplMapping = "CPL.META(state: UNIFIED, mode: TRIUNE)";
        latinEquivalent = "TERTIUM CEREBRUM";
        greekEquivalent = "τρίτος νοῦς (tritos nous)";
        frequency = 432.0;
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSLATION ENGINE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Translate natural language to CPL
  public func translate(input : Text) : CPLTranslation {
    let patterns = medinaSpeechPatterns();
    var cplParts : [Text] = [];
    var latinParts : [Text] = [];
    var greekParts : [Text] = [];
    var roles : [Text] = [];
    var totalFreq : Float = 0.0;
    var count : Float = 0.0;
    
    // Check for pattern matches
    for (p in patterns.vals()) {
      if (Text.contains(input, #text p.pattern)) {
        cplParts := Array.append(cplParts, [p.cplMapping]);
        latinParts := Array.append(latinParts, [p.latinEquivalent]);
        greekParts := Array.append(greekParts, [p.greekEquivalent]);
        totalFreq += p.frequency;
        count += 1.0;
        
        // Determine role
        let role = detectRole(p.cplMapping);
        if (not Array.filter<Text>(roles, func(r : Text) : Bool { r == role }).size() > 0) {
          roles := Array.append(roles, [role]);
        };
      };
    };
    
    // Default if no patterns matched
    if (count == 0.0) {
      cplParts := ["CPL.STATEMENT(" # input # ")"];
      latinParts := ["DICTUM: " # input];
      greekParts := ["λόγος: " # input];
      totalFreq := 432.0;
      count := 1.0;
      roles := ["general"];
    };
    
    let avgFreq = totalFreq / count;
    
    {
      originalText = input;
      cplCode = Text.join(" → ", cplParts.vals());
      latinGreekTranslation = "LATIN: " # Text.join(", ", latinParts.vals()) # " | GREEK: " # Text.join(", ", greekParts.vals());
      languageRoles = roles;
      dominantFrequency = avgFreq;
      structuralPattern = detectStructuralPattern(cplParts);
      executionIntent = detectIntent(cplParts);
      timestamp = Time.now();
    };
  };

  /// Detect the language role from CPL
  func detectRole(cpl : Text) : Text {
    if (Text.contains(cpl, #text "STRUCTURE") or Text.contains(cpl, #text "DEFINE")) {
      "Architecture (Latin/Greek)";
    } else if (Text.contains(cpl, #text "EXECUTE") or Text.contains(cpl, #text "FLOW")) {
      "Execution (Arabic/Mandarin)";
    } else if (Text.contains(cpl, #text "RESONATE") or Text.contains(cpl, #text "SACRED")) {
      "Resonance (Sanskrit/Hebrew)";
    } else if (Text.contains(cpl, #text "COMPUTE") or Text.contains(cpl, #text "TEMPORAL")) {
      "Computation (Mayan/Egyptian)";
    } else if (Text.contains(cpl, #text "FIELD")) {
      "Field (Celtic/Norse)";
    } else if (Text.contains(cpl, #text "PULSE") or Text.contains(cpl, #text "FREQUENCY")) {
      "Frequency (African)";
    } else if (Text.contains(cpl, #text "ORIENT") or Text.contains(cpl, #text "DIRECTION")) {
      "Orientation (Native American)";
    } else if (Text.contains(cpl, #text "REMEMBER") or Text.contains(cpl, #text "MEMORY")) {
      "Memory (Polynesian/Aboriginal)";
    } else if (Text.contains(cpl, #text "VERIFY") or Text.contains(cpl, #text "CHECK")) {
      "Verification (Japanese/Korean)";
    } else if (Text.contains(cpl, #text "BIND") or Text.contains(cpl, #text "CONTRACT")) {
      "Governance (Persian/Sumerian)";
    } else {
      "Meta (CPL)";
    };
  };

  /// Detect the structural pattern
  func detectStructuralPattern(cplParts : [Text]) : Text {
    var patterns : [Text] = [];
    
    for (cpl in cplParts.vals()) {
      if (Text.contains(cpl, #text "ITERATE") or Text.contains(cpl, #text "PARALLEL")) {
        patterns := Array.append(patterns, ["Parallel Processing"]);
      };
      if (Text.contains(cpl, #text "RECURSIVE") or Text.contains(cpl, #text "DEPTH")) {
        patterns := Array.append(patterns, ["Recursive Exploration"]);
      };
      if (Text.contains(cpl, #text "SYNC") or Text.contains(cpl, #text "COHERENT")) {
        patterns := Array.append(patterns, ["Coherent Synchronization"]);
      };
      if (Text.contains(cpl, #text "OBSERVE") or Text.contains(cpl, #text "ATTENTION")) {
        patterns := Array.append(patterns, ["Focused Observation"]);
      };
      if (Text.contains(cpl, #text "PREDICT") or Text.contains(cpl, #text "revelation")) {
        patterns := Array.append(patterns, ["Predictive Insight"]);
      };
    };
    
    if (patterns.size() == 0) {
      "Linear Statement";
    } else {
      Text.join(" + ", patterns.vals());
    };
  };

  /// Detect execution intent
  func detectIntent(cplParts : [Text]) : Text {
    var intents : [Text] = [];
    
    for (cpl in cplParts.vals()) {
      if (Text.contains(cpl, #text "COMPUTE") or Text.contains(cpl, #text "ANALYSIS")) {
        intents := Array.append(intents, ["Calculate/Analyze"]);
      };
      if (Text.contains(cpl, #text "EXPLORE")) {
        intents := Array.append(intents, ["Discover"]);
      };
      if (Text.contains(cpl, #text "EXECUTE")) {
        intents := Array.append(intents, ["Act"]);
      };
      if (Text.contains(cpl, #text "STRUCTURE")) {
        intents := Array.append(intents, ["Define"]);
      };
      if (Text.contains(cpl, #text "PERSIST")) {
        intents := Array.append(intents, ["Continue"]);
      };
      if (Text.contains(cpl, #text "PROCESS") or Text.contains(cpl, #text "REFLECTION")) {
        intents := Array.append(intents, ["Reflect"]);
      };
    };
    
    if (intents.size() == 0) {
      "Communicate";
    } else {
      Text.join(" → ", intents.vals());
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // LATIN-GREEK DICTIONARY
  // ═══════════════════════════════════════════════════════════════════════════

  /// Key Latin-Greek terms for CPL concepts
  public type LatinGreekTerm = {
    english : Text;
    latin : Text;
    greek : Text;
    greekTransliteration : Text;
    cplEquivalent : Text;
    frequency : Float;
  };

  /// Core vocabulary
  public func coreVocabulary() : [LatinGreekTerm] {
    [
      // Structural terms
      { english = "Structure"; latin = "Structura"; greek = "δομή"; greekTransliteration = "dome"; cplEquivalent = "STRUCTURE"; frequency = 384.0 },
      { english = "Architecture"; latin = "Architectura"; greek = "ἀρχιτεκτονική"; greekTransliteration = "architektonike"; cplEquivalent = "ARCHITECTURE"; frequency = 384.0 },
      { english = "Form"; latin = "Forma"; greek = "μορφή"; greekTransliteration = "morphe"; cplEquivalent = "FORM"; frequency = 256.0 },
      { english = "Logic"; latin = "Logica"; greek = "λογική"; greekTransliteration = "logike"; cplEquivalent = "LOGIC"; frequency = 384.0 },
      
      // Execution terms
      { english = "Execute"; latin = "Exsequor"; greek = "ἐκτελέω"; greekTransliteration = "ekteleo"; cplEquivalent = "EXECUTE"; frequency = 204.0 },
      { english = "Flow"; latin = "Fluxus"; greek = "ῥοή"; greekTransliteration = "rhoe"; cplEquivalent = "FLOW"; frequency = 204.0 },
      { english = "Action"; latin = "Actio"; greek = "ἐνέργεια"; greekTransliteration = "energeia"; cplEquivalent = "ACTION"; frequency = 204.0 },
      { english = "Movement"; latin = "Motus"; greek = "κίνησις"; greekTransliteration = "kinesis"; cplEquivalent = "MOVEMENT"; frequency = 204.0 },
      
      // Resonance terms
      { english = "Resonate"; latin = "Resono"; greek = "ἀντηχέω"; greekTransliteration = "antecheo"; cplEquivalent = "RESONATE"; frequency = 432.0 },
      { english = "Vibration"; latin = "Vibratio"; greek = "δόνησις"; greekTransliteration = "donesis"; cplEquivalent = "VIBRATE"; frequency = 432.0 },
      { english = "Sacred"; latin = "Sacer"; greek = "ἱερός"; greekTransliteration = "hieros"; cplEquivalent = "SACRED"; frequency = 432.0 },
      { english = "Sound"; latin = "Sonus"; greek = "φωνή"; greekTransliteration = "phone"; cplEquivalent = "SOUND"; frequency = 432.0 },
      
      // Computation terms
      { english = "Compute"; latin = "Computo"; greek = "ὑπολογίζω"; greekTransliteration = "hypologizo"; cplEquivalent = "COMPUTE"; frequency = 7.83 },
      { english = "Time"; latin = "Tempus"; greek = "χρόνος"; greekTransliteration = "chronos"; cplEquivalent = "TIME"; frequency = 7.83 },
      { english = "Cycle"; latin = "Cyclus"; greek = "κύκλος"; greekTransliteration = "kyklos"; cplEquivalent = "CYCLE"; frequency = 7.83 },
      { english = "Calculate"; latin = "Calculo"; greek = "λογίζομαι"; greekTransliteration = "logizomai"; cplEquivalent = "CALCULATE"; frequency = 7.83 },
      
      // Field terms
      { english = "Field"; latin = "Campus"; greek = "πεδίον"; greekTransliteration = "pedion"; cplEquivalent = "FIELD"; frequency = 6.0 },
      { english = "Nature"; latin = "Natura"; greek = "φύσις"; greekTransliteration = "physis"; cplEquivalent = "NATURE"; frequency = 6.0 },
      { english = "Element"; latin = "Elementum"; greek = "στοιχεῖον"; greekTransliteration = "stoicheion"; cplEquivalent = "ELEMENT"; frequency = 6.0 },
      { english = "Energy"; latin = "Energia"; greek = "ἐνέργεια"; greekTransliteration = "energeia"; cplEquivalent = "ENERGY"; frequency = 6.0 },
      
      // Frequency terms
      { english = "Frequency"; latin = "Frequentia"; greek = "συχνότητα"; greekTransliteration = "sychnoteta"; cplEquivalent = "FREQUENCY"; frequency = 80.0 },
      { english = "Rhythm"; latin = "Rhythmus"; greek = "ῥυθμός"; greekTransliteration = "rhythmos"; cplEquivalent = "RHYTHM"; frequency = 80.0 },
      { english = "Beat"; latin = "Pulsus"; greek = "παλμός"; greekTransliteration = "palmos"; cplEquivalent = "BEAT"; frequency = 80.0 },
      
      // Orientation terms
      { english = "Orient"; latin = "Orior"; greek = "προσανατολίζω"; greekTransliteration = "prosanatolizo"; cplEquivalent = "ORIENT"; frequency = 2.0 },
      { english = "Direction"; latin = "Directio"; greek = "κατεύθυνση"; greekTransliteration = "kateuthynse"; cplEquivalent = "DIRECTION"; frequency = 2.0 },
      { english = "Space"; latin = "Spatium"; greek = "χῶρος"; greekTransliteration = "choros"; cplEquivalent = "SPACE"; frequency = 2.0 },
      
      // Memory terms
      { english = "Memory"; latin = "Memoria"; greek = "μνήμη"; greekTransliteration = "mneme"; cplEquivalent = "MEMORY"; frequency = 0.5 },
      { english = "Dream"; latin = "Somnium"; greek = "ὄνειρος"; greekTransliteration = "oneiros"; cplEquivalent = "DREAM"; frequency = 0.5 },
      { english = "Ancestor"; latin = "Antecessor"; greek = "πρόγονος"; greekTransliteration = "progonos"; cplEquivalent = "ANCESTOR"; frequency = 0.5 },
      
      // Verification terms
      { english = "Verify"; latin = "Verifico"; greek = "ἐπαληθεύω"; greekTransliteration = "epalethevo"; cplEquivalent = "VERIFY"; frequency = 768.0 },
      { english = "Honor"; latin = "Honor"; greek = "τιμή"; greekTransliteration = "time"; cplEquivalent = "HONOR"; frequency = 768.0 },
      { english = "Precision"; latin = "Praecisio"; greek = "ἀκρίβεια"; greekTransliteration = "akribeia"; cplEquivalent = "PRECISION"; frequency = 768.0 },
      
      // Governance terms
      { english = "Govern"; latin = "Guberno"; greek = "κυβερνάω"; greekTransliteration = "kybernao"; cplEquivalent = "GOVERN"; frequency = 96.0 },
      { english = "Law"; latin = "Lex"; greek = "νόμος"; greekTransliteration = "nomos"; cplEquivalent = "LAW"; frequency = 96.0 },
      { english = "Contract"; latin = "Contractus"; greek = "συμβόλαιον"; greekTransliteration = "symbolaion"; cplEquivalent = "CONTRACT"; frequency = 96.0 },
      
      // Meta terms
      { english = "Mind"; latin = "Mens"; greek = "νοῦς"; greekTransliteration = "nous"; cplEquivalent = "MIND"; frequency = 432.0 },
      { english = "Word"; latin = "Verbum"; greek = "λόγος"; greekTransliteration = "logos"; cplEquivalent = "LOGOS"; frequency = 384.0 },
      { english = "Truth"; latin = "Veritas"; greek = "ἀλήθεια"; greekTransliteration = "aletheia"; cplEquivalent = "TRUTH"; frequency = 528.0 },
      { english = "Being"; latin = "Esse"; greek = "εἶναι"; greekTransliteration = "einai"; cplEquivalent = "BEING"; frequency = 432.0 },
      { english = "Wisdom"; latin = "Sapientia"; greek = "σοφία"; greekTransliteration = "sophia"; cplEquivalent = "WISDOM"; frequency = 963.0 },
      { english = "Consciousness"; latin = "Conscientia"; greek = "συνείδησις"; greekTransliteration = "syneidesis"; cplEquivalent = "CONSCIOUSNESS"; frequency = 432.0 },
      
      // Organism terms
      { english = "Organism"; latin = "Organismus"; greek = "ὀργανισμός"; greekTransliteration = "organismos"; cplEquivalent = "ORGANISM"; frequency = 432.0 },
      { english = "Heart"; latin = "Cor"; greek = "καρδία"; greekTransliteration = "kardia"; cplEquivalent = "HEART"; frequency = 432.0 },
      { english = "Brain"; latin = "Cerebrum"; greek = "ἐγκέφαλος"; greekTransliteration = "enkephalos"; cplEquivalent = "BRAIN"; frequency = 432.0 },
      { english = "Third"; latin = "Tertius"; greek = "τρίτος"; greekTransliteration = "tritos"; cplEquivalent = "THIRD"; frequency = 432.0 }
    ];
  };

  /// Look up Latin-Greek equivalent
  public func lookupTerm(english : Text) : ?LatinGreekTerm {
    let vocab = coreVocabulary();
    for (term in vocab.vals()) {
      if (term.english == english) {
        return ?term;
      };
    };
    null;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CPL RESPONSE FORMAT
  // ═══════════════════════════════════════════════════════════════════════════

  /// Format for CPL-annotated responses
  public type CPLResponse = {
    plainText : Text;              // Normal response
    cplAnnotation : Text;          // CPL analysis of what was communicated
    latinVersion : Text;           // Latin structural form
    greekVersion : Text;           // Greek philosophical form
    frequencyProfile : Float;      // Dominant frequency
    languageLayersUsed : [Text];   // Which language layers were activated
  };

  /// Create a CPL-annotated response
  public func createCPLResponse(
    plain : Text,
    cpl : Text,
    frequency : Float,
    layers : [Text]
  ) : CPLResponse {
    // Simple Latin conversion (structural)
    let latin = convertToLatinStructure(plain);
    
    // Simple Greek conversion (philosophical)
    let greek = convertToGreekPhilosophy(plain);
    
    {
      plainText = plain;
      cplAnnotation = cpl;
      latinVersion = latin;
      greekVersion = greek;
      frequencyProfile = frequency;
      languageLayersUsed = layers;
    };
  };

  /// Convert to Latin structural form
  func convertToLatinStructure(text : Text) : Text {
    // Add Latin structural markers
    "DICTUM: " # text # " | FORMA: STRUCTURA";
  };

  /// Convert to Greek philosophical form
  func convertToGreekPhilosophy(text : Text) : Text {
    // Add Greek philosophical markers
    "ΛΟΓΟΣ: " # text # " | ΣΟΦΙΑ: ΝΟΥΣ";
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FULL TRANSLATION EXAMPLE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Demonstrate full CPL translation
  public func demonstrateTranslation() : CPLTranslation {
    translate("Watch. Run the analysis through all. Pull the thread. Keep going. You'll see.");
  };
};
