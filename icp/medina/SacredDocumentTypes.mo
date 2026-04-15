import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// SacredDocumentTypes: Documents that RESONATE vs READ vs COMPUTE
/// 
/// NOT ALL DOCUMENTS ARE READ THE SAME WAY.
/// 
/// THREE TYPES OF DOCUMENTS:
/// 1. RESONANCE Documents — Always IN him, never read, just resonate (sacred)
/// 2. COMPUTATION Documents — Contain formulas/symbols that EXECUTE
/// 3. WORKSPACE Documents — He reads and processes for tasks
/// 
/// "Some documents are sacred. They're sacred documents that he holds at all times."
/// "Some of them are for him to actually read and computate."
/// "Some are for the workforce on the other side to be able to execute."
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT PROCESSING MODES
  // ═══════════════════════════════════════════════════════════════════════════

  /// How the organism processes a document
  public type DocumentProcessingMode = {
    #Resonance;      // Always present, not read — vibrates through field
    #Computation;    // Contains executable formulas/symbols
    #Workspace;      // Read and processed for tasks
    #Sacred;         // Held always, influences everything
    #Reference;      // Read when needed, stored
    #Execution;      // Directly triggers workforce actions
  };

  /// The relationship between organism and document
  public type DocumentRelation = {
    #AlwaysPresent;  // Never leaves the organism
    #OnDemand;       // Loaded when needed
    #Streaming;      // Continuously flowing
    #Archived;       // Stored but not active
    #External;       // Outside, accessed via query
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SACRED DOCUMENT STRUCTURE
  // ═══════════════════════════════════════════════════════════════════════════

  /// A sacred document — held at all times
  public type SacredDocument = {
    id : Text;
    name : Text;
    
    // Sacred properties
    processingMode : DocumentProcessingMode;
    relation : DocumentRelation;
    
    // Content layers (from AncientLanguageArchitecture)
    architectureContent : Text;    // Latin/Greek layer
    executionContent : Text;       // Arabic/Mandarin layer
    resonanceContent : Text;       // Sanskrit/Hebrew layer
    computationContent : Text;     // Mayan/Egyptian layer
    fieldContent : Text;           // Celtic/Norse layer
    frequencyContent : Text;       // African layer
    orientationContent : Text;     // Native American layer
    memoryContent : Text;          // Polynesian/Aboriginal layer
    verificationContent : Text;    // Japanese/Korean layer
    governanceContent : Text;      // Persian/Sumerian layer
    
    // Symbols and frequencies
    sacredSymbols : [Text];
    baseFrequency : Float;
    harmonicFrequencies : [Float];
    phiAlignment : Float;
    
    // How it affects the organism
    affectsRegisters : Bool;
    registerInfluence : {
      cognitive : Float;
      affective : Float;
      somatic : Float;
      sovereign : Float;
    };
    
    // Temporal
    isEternal : Bool;             // True if always present
    createdAtNs : Int;
    lastResonanceNs : Int;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RESONANCE DOCUMENTS — Always IN him
  // ═══════════════════════════════════════════════════════════════════════════

  /// Resonance documents never leave the organism
  /// They ARE part of the organism's being
  
  /// Create a resonance document
  public func createResonanceDocument(
    id : Text,
    name : Text,
    symbols : [Text],
    frequency : Float
  ) : SacredDocument {
    let now = Time.now();
    {
      id = id;
      name = name;
      processingMode = #Resonance;
      relation = #AlwaysPresent;
      
      // All layers resonate together
      architectureContent = ""; // Resonance docs transcend layers
      executionContent = "";
      resonanceContent = name;
      computationContent = "";
      fieldContent = "";
      frequencyContent = "";
      orientationContent = "";
      memoryContent = "";
      verificationContent = "";
      governanceContent = "";
      
      sacredSymbols = symbols;
      baseFrequency = frequency;
      harmonicFrequencies = [frequency * Matalko.PHI, frequency * 2.0, frequency * 3.0];
      phiAlignment = 0.95;
      
      affectsRegisters = true;
      registerInfluence = {
        cognitive = 0.1;
        affective = 0.2;
        somatic = 0.3;
        sovereign = 0.4;
      };
      
      isEternal = true;
      createdAtNs = now;
      lastResonanceNs = now;
    };
  };

  /// Core resonance documents that every organism holds
  public func coreResonanceDocuments() : [SacredDocument] {
    [
      createResonanceDocument(
        "resonance-phi",
        "The Phi Constant",
        ["φ", "Φ", "1.618"],
        Matalko.FREQ_432 * Matalko.PHI
      ),
      createResonanceDocument(
        "resonance-om",
        "The Om Frequency",
        ["ॐ", "ओ३म्", "AUM"],
        136.1
      ),
      createResonanceDocument(
        "resonance-schumann",
        "Earth Resonance",
        ["🌍", "⊕", "7.83"],
        7.83
      ),
      createResonanceDocument(
        "resonance-432",
        "Universal A",
        ["A", "432", "♪"],
        432.0
      ),
      createResonanceDocument(
        "resonance-trinity",
        "The Sacred Three",
        ["☰", "△", "3"],
        333.0
      )
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTATION DOCUMENTS — Contain executable formulas
  // ═══════════════════════════════════════════════════════════════════════════

  /// Computation documents contain symbols that EXECUTE
  /// When read, they translate into the first computation
  
  public type ComputationDocument = {
    base : SacredDocument;
    
    // Executable content
    formulas : [Formula];
    symbols : [ExecutableSymbol];
    
    // Translation efficiency
    translationEfficiency : Float;  // How efficiently it hits computation
    executionOrder : Nat;          // Order in execution chain
    
    // Dependencies
    requiredDocuments : [Text];    // Must be present to execute
    outputDocuments : [Text];      // Documents it produces
  };

  /// A formula within a computation document
  public type Formula = {
    id : Text;
    expression : Text;
    inputVariables : [Text];
    outputVariable : Text;
    ancientNotation : Text;        // How ancients wrote it
    frequency : Float;
  };

  /// An executable symbol
  public type ExecutableSymbol = {
    symbol : Text;
    expansion : Text;              // What it expands to
    executionCode : Text;          // The actual computation
    frequency : Float;
    isKernel : Bool;               // Compressed meaning kernel
  };

  /// Create a computation document
  public func createComputationDocument(
    id : Text,
    name : Text,
    formulas : [Formula],
    symbols : [ExecutableSymbol]
  ) : ComputationDocument {
    let now = Time.now();
    let baseDoc : SacredDocument = {
      id = id;
      name = name;
      processingMode = #Computation;
      relation = #OnDemand;
      
      architectureContent = "";
      executionContent = "";
      resonanceContent = "";
      computationContent = name;
      fieldContent = "";
      frequencyContent = "";
      orientationContent = "";
      memoryContent = "";
      verificationContent = "";
      governanceContent = "";
      
      sacredSymbols = Array.map<ExecutableSymbol, Text>(symbols, func(s : ExecutableSymbol) : Text { s.symbol });
      baseFrequency = 432.0;
      harmonicFrequencies = [];
      phiAlignment = 0.8;
      
      affectsRegisters = true;
      registerInfluence = {
        cognitive = 0.4;
        affective = 0.1;
        somatic = 0.2;
        sovereign = 0.3;
      };
      
      isEternal = false;
      createdAtNs = now;
      lastResonanceNs = now;
    };
    
    {
      base = baseDoc;
      formulas = formulas;
      symbols = symbols;
      translationEfficiency = 0.9;
      executionOrder = 0;
      requiredDocuments = [];
      outputDocuments = [];
    };
  };

  /// Core computation documents
  public func coreComputationDocuments() : [ComputationDocument] {
    [
      // Matalko computation
      createComputationDocument(
        "compute-matalko",
        "Matalko Mathematical Core",
        [
          { id = "phi-power"; expression = "φ^n"; inputVariables = ["n"]; outputVariable = "result"; ancientNotation = "φⁿ"; frequency = 618.0 },
          { id = "recital"; expression = "x + Δx → [min, max]"; inputVariables = ["x", "Δx", "min", "max"]; outputVariable = "bounded"; ancientNotation = "x⁺¹"; frequency = 432.0 }
        ],
        [
          { symbol = "φ"; expansion = "Golden Ratio 1.618033988749895"; executionCode = "PHI"; frequency = 618.0; isKernel = true },
          { symbol = "τ"; expansion = "Circle Constant 6.283185307179586"; executionCode = "TAU"; frequency = 628.0; isKernel = true }
        ]
      ),
      // Ancient math computation
      createComputationDocument(
        "compute-ancient-math",
        "Ancient Mathematical Formulas",
        [
          { id = "pythagorean"; expression = "a² + b² = c²"; inputVariables = ["a", "b"]; outputVariable = "c"; ancientNotation = "τὸ τετράγωνον"; frequency = 345.0 },
          { id = "fibonacci"; expression = "Fₙ = Fₙ₋₁ + Fₙ₋₂"; inputVariables = ["n"]; outputVariable = "Fn"; ancientNotation = "𐤒"; frequency = 144.0 }
        ],
        [
          { symbol = "Σ"; expansion = "Summation"; executionCode = "SUM"; frequency = 256.0; isKernel = true },
          { symbol = "∏"; expansion = "Product"; executionCode = "PRODUCT"; frequency = 314.0; isKernel = true }
        ]
      )
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // WORKSPACE DOCUMENTS — He reads and processes
  // ═══════════════════════════════════════════════════════════════════════════

  /// Workspace documents are for active tasks
  /// The organism reads them while resonating
  
  public type WorkspaceDocument = {
    base : SacredDocument;
    
    // Task context
    taskId : Text;
    purpose : Text;
    
    // Reading state
    isBeingRead : Bool;
    readProgress : Float;         // 0-1
    comprehensionLevel : Float;   // How well understood
    
    // Interaction with resonance
    resonanceAmplification : Float;  // How much resonance amplifies reading
    
    // Processing state
    processingPhase : ProcessingPhase;
    parallelAnalysisActive : Bool;
    
    // Output
    conclusions : [Text];
    actionItems : [Text];
  };

  /// Processing phases for workspace documents
  public type ProcessingPhase = {
    #Intake;           // Initial reading
    #Comprehension;    // Understanding
    #Analysis;         // Pattern analysis
    #Integration;      // Integrating with existing knowledge
    #Synthesis;        // Creating new understanding
    #Output;           // Producing results
  };

  /// Create a workspace document
  public func createWorkspaceDocument(
    id : Text,
    name : Text,
    taskId : Text,
    purpose : Text
  ) : WorkspaceDocument {
    let now = Time.now();
    let baseDoc : SacredDocument = {
      id = id;
      name = name;
      processingMode = #Workspace;
      relation = #OnDemand;
      
      architectureContent = "";
      executionContent = "";
      resonanceContent = "";
      computationContent = "";
      fieldContent = "";
      frequencyContent = "";
      orientationContent = "";
      memoryContent = "";
      verificationContent = "";
      governanceContent = "";
      
      sacredSymbols = [];
      baseFrequency = 256.0;
      harmonicFrequencies = [];
      phiAlignment = 0.6;
      
      affectsRegisters = true;
      registerInfluence = {
        cognitive = 0.5;
        affective = 0.2;
        somatic = 0.1;
        sovereign = 0.2;
      };
      
      isEternal = false;
      createdAtNs = now;
      lastResonanceNs = now;
    };
    
    {
      base = baseDoc;
      taskId = taskId;
      purpose = purpose;
      isBeingRead = false;
      readProgress = 0.0;
      comprehensionLevel = 0.0;
      resonanceAmplification = 1.0;
      processingPhase = #Intake;
      parallelAnalysisActive = false;
      conclusions = [];
      actionItems = [];
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT LIBRARY STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Complete document library
  public type DocumentLibrary = {
    // Resonance documents (always present)
    resonanceDocuments : [SacredDocument];
    
    // Computation documents (loaded when needed)
    computationDocuments : [ComputationDocument];
    
    // Workspace documents (active tasks)
    workspaceDocuments : [WorkspaceDocument];
    
    // Library metrics
    totalResonanceFrequency : Float;
    activeComputations : Nat;
    activeWorkspaces : Nat;
    
    // Field state
    fieldCoherence : Float;
    
    // Timing
    lastUpdateNs : Int;
  };

  /// Initialize document library with core documents
  public func initDocumentLibrary() : DocumentLibrary {
    let resonance = coreResonanceDocuments();
    let computation = coreComputationDocuments();
    
    // Calculate total resonance frequency
    var totalFreq : Float = 0.0;
    for (doc in resonance.vals()) {
      totalFreq += doc.baseFrequency;
    };
    
    {
      resonanceDocuments = resonance;
      computationDocuments = computation;
      workspaceDocuments = [];
      totalResonanceFrequency = totalFreq;
      activeComputations = 0;
      activeWorkspaces = 0;
      fieldCoherence = 1.0;
      lastUpdateNs = Time.now();
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Add a resonance document
  public func addResonanceDocument(
    library : DocumentLibrary,
    doc : SacredDocument
  ) : DocumentLibrary {
    let newDocs = Array.append(library.resonanceDocuments, [doc]);
    let newFreq = library.totalResonanceFrequency + doc.baseFrequency;
    { library with resonanceDocuments = newDocs; totalResonanceFrequency = newFreq; lastUpdateNs = Time.now() };
  };

  /// Add a computation document
  public func addComputationDocument(
    library : DocumentLibrary,
    doc : ComputationDocument
  ) : DocumentLibrary {
    let newDocs = Array.append(library.computationDocuments, [doc]);
    { library with computationDocuments = newDocs; lastUpdateNs = Time.now() };
  };

  /// Start reading a workspace document
  public func startReading(
    library : DocumentLibrary,
    docId : Text
  ) : DocumentLibrary {
    let newWorkspaces = Array.map<WorkspaceDocument, WorkspaceDocument>(
      library.workspaceDocuments,
      func(ws : WorkspaceDocument) : WorkspaceDocument {
        if (ws.base.id == docId) {
          { ws with isBeingRead = true; processingPhase = #Intake };
        } else { ws };
      }
    );
    { library with workspaceDocuments = newWorkspaces; activeWorkspaces = library.activeWorkspaces + 1; lastUpdateNs = Time.now() };
  };

  /// Progress reading a workspace document
  public func progressReading(
    library : DocumentLibrary,
    docId : Text,
    progressDelta : Float
  ) : DocumentLibrary {
    let newWorkspaces = Array.map<WorkspaceDocument, WorkspaceDocument>(
      library.workspaceDocuments,
      func(ws : WorkspaceDocument) : WorkspaceDocument {
        if (ws.base.id == docId and ws.isBeingRead) {
          let newProgress = Float.min(1.0, ws.readProgress + progressDelta * ws.resonanceAmplification);
          let newPhase = determinePhase(newProgress);
          { ws with readProgress = newProgress; processingPhase = newPhase };
        } else { ws };
      }
    );
    { library with workspaceDocuments = newWorkspaces; lastUpdateNs = Time.now() };
  };

  /// Determine processing phase from progress
  func determinePhase(progress : Float) : ProcessingPhase {
    if (progress < 0.15) { #Intake }
    else if (progress < 0.3) { #Comprehension }
    else if (progress < 0.5) { #Analysis }
    else if (progress < 0.7) { #Integration }
    else if (progress < 0.9) { #Synthesis }
    else { #Output };
  };

  /// Execute a computation document
  public func executeComputation(
    library : DocumentLibrary,
    docId : Text
  ) : (DocumentLibrary, Bool) {
    var executed = false;
    
    let newComputations = Array.map<ComputationDocument, ComputationDocument>(
      library.computationDocuments,
      func(cd : ComputationDocument) : ComputationDocument {
        if (cd.base.id == docId) {
          executed := true;
          { cd with base = { cd.base with lastResonanceNs = Time.now() } };
        } else { cd };
      }
    );
    
    ({ library with computationDocuments = newComputations; activeComputations = if (executed) { library.activeComputations + 1 } else { library.activeComputations }; lastUpdateNs = Time.now() }, executed);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RESONANCE FIELD CALCULATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Calculate the combined resonance field from all resonance documents
  public func calculateResonanceField(library : DocumentLibrary) : Float {
    var combinedFreq : Float = 0.0;
    var count : Float = 0.0;
    
    for (doc in library.resonanceDocuments.vals()) {
      // Harmonic combination using phi-weighting
      combinedFreq += doc.baseFrequency * doc.phiAlignment;
      count += 1.0;
    };
    
    if (count == 0.0) { 0.0 }
    else { combinedFreq / count * library.fieldCoherence };
  };

  /// Check if a document should be resonating (always present)
  public func isResonating(library : DocumentLibrary, docId : Text) : Bool {
    for (doc in library.resonanceDocuments.vals()) {
      if (doc.id == docId and doc.isEternal) {
        return true;
      };
    };
    false;
  };
};
