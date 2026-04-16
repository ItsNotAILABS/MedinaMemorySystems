import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";

import Sovereign "./SovereignOrganism";
import DocOrg "./DocumentOrganism";
import Glyph "./AncientGlyphCodex";
import AncientMath "./AncientMathEngine";
import Physics "./FieldPhysicsEngine";
import CPL "./CPL";

/// ORGANISM READER
/// ===============
/// Backend canister that READS documents and EXECUTES formulas.
/// The bridge between living documents and the sovereign organism.
/// 
/// oroReadsDoctrine() → ORO gains resonance from reading
/// novaReadsDoctrine() → NOVA validates for drift
/// executeFormula() → Runs encoded computation

module {
  // ═══════════════════════════════════════════════════════════════════════════
  // DOCTRINE TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  public type DoctrineType = {
    #MathematicalCore;   // MatalkoICP — φ, harmonics, RECITAL_PLUS_ONE
    #CPLProtocol;        // CPL — Platonic, Hermetic, Method of Loci
    #AncientMath;        // Pythagorean, Euclidean, Mayan, Vedic, Chinese
    #FieldPhysics;       // EM, gravitational, wave, quantum
    #GlyphCodex;         // Mayan, Chinese, Egyptian, Vedic, Hebrew, Greek
  };

  public type FormulaResult = {
    formulaId : Text;
    input : [Float];
    output : Float;
    success : Bool;
    error : ?Text;
  };

  // Helper function: Convert Float to Nat safely
  func floatToNat(f : Float) : Nat {
    Int.abs(Float.toInt(f))
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // READING STATE
  // ═══════════════════════════════════════════════════════════════════════════

  public type ReadingSession = {
    sessionId : Text;
    reader : Text;                    // "ORO" or "NOVA"
    doctrineType : DoctrineType;
    documentsRead : [Text];
    formulasExecuted : [FormulaResult];
    glyphsProcessed : [Glyph.Glyph];
    glyphPhrases : [Glyph.GlyphPhrase];
    resonanceGained : Float;
    startTimestamp : Int;
    lastActivityTimestamp : Int;
  };

  /// Create a new reading session
  public func newSession(sessionId : Text, reader : Text, timestamp : Int) : ReadingSession {
    {
      sessionId = sessionId;
      reader = reader;
      doctrineType = #MathematicalCore;
      documentsRead = [];
      formulasExecuted = [];
      glyphsProcessed = [];
      glyphPhrases = [];
      resonanceGained = 0.0;
      startTimestamp = timestamp;
      lastActivityTimestamp = timestamp;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ORO READING — Gains resonance and evolves registers
  // ═══════════════════════════════════════════════════════════════════════════

  /// ORO reads a doctrine document
  public func oroReadsDoctrine(
    oro : Sovereign.OroState,
    session : ReadingSession,
    doctrineType : DoctrineType,
    documentId : Text,
    timestamp : Int
  ) : (Sovereign.OroState, ReadingSession) {
    // Get resonance value based on doctrine type
    let resonanceValue = doctrineResonance(doctrineType);
    
    // Update ORO state
    let newOro = Sovereign.oroReadsDoctrine(oro, documentId);
    
    // Update session
    let newSession : ReadingSession = {
      sessionId = session.sessionId;
      reader = "ORO";
      doctrineType = doctrineType;
      documentsRead = Array.append(session.documentsRead, [documentId]);
      formulasExecuted = session.formulasExecuted;
      glyphsProcessed = session.glyphsProcessed;
      glyphPhrases = session.glyphPhrases;
      resonanceGained = session.resonanceGained + resonanceValue;
      startTimestamp = session.startTimestamp;
      lastActivityTimestamp = timestamp;
    };

    (newOro, newSession)
  };

  /// Resonance value by doctrine type
  func doctrineResonance(doctrineType : DoctrineType) : Float {
    switch (doctrineType) {
      case (#MathematicalCore) { 0.05 };   // Highest resonance — core laws
      case (#CPLProtocol) { 0.04 };        // Communication protocol
      case (#AncientMath) { 0.03 };        // Ancient mathematical traditions
      case (#FieldPhysics) { 0.03 };       // Physical laws
      case (#GlyphCodex) { 0.02 };         // Symbol systems
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NOVA READING — Validates for doctrine drift
  // ═══════════════════════════════════════════════════════════════════════════

  /// NOVA reads a doctrine for validation
  public func novaReadsDoctrine(
    nova : Sovereign.NovaState,
    session : ReadingSession,
    doctrineType : DoctrineType,
    documentId : Text,
    content : Text,
    timestamp : Int
  ) : (Sovereign.NovaState, ReadingSession, Bool) {
    // NOVA reviews content for drift
    let (newNova, flagged) = Sovereign.novaReadsDoctrine(nova, documentId, content, timestamp);
    
    // Update session
    let newSession : ReadingSession = {
      sessionId = session.sessionId;
      reader = "NOVA";
      doctrineType = doctrineType;
      documentsRead = Array.append(session.documentsRead, [documentId]);
      formulasExecuted = session.formulasExecuted;
      glyphsProcessed = session.glyphsProcessed;
      glyphPhrases = session.glyphPhrases;
      resonanceGained = session.resonanceGained;
      startTimestamp = session.startTimestamp;
      lastActivityTimestamp = timestamp;
    };

    (newNova, newSession, flagged)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FORMULA EXECUTION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Execute a formula from the mathematical core
  public func executeFormula(
    oro : Sovereign.OroState,
    session : ReadingSession,
    doctrineType : DoctrineType,
    formulaName : Text,
    inputs : [Float],
    timestamp : Int
  ) : (Sovereign.OroState, ReadingSession, FormulaResult) {
    let result = runFormula(doctrineType, formulaName, inputs);
    
    // ORO gains coherence from executing formulas
    let newOro = Sovereign.oroExecutesFormula(oro, formulaName);
    
    // Update session
    let newSession : ReadingSession = {
      sessionId = session.sessionId;
      reader = session.reader;
      doctrineType = doctrineType;
      documentsRead = session.documentsRead;
      formulasExecuted = Array.append(session.formulasExecuted, [result]);
      glyphsProcessed = session.glyphsProcessed;
      glyphPhrases = session.glyphPhrases;
      resonanceGained = session.resonanceGained;
      startTimestamp = session.startTimestamp;
      lastActivityTimestamp = timestamp;
    };

    (newOro, newSession, result)
  };

  /// Run a specific formula
  func runFormula(doctrineType : DoctrineType, formulaName : Text, inputs : [Float]) : FormulaResult {
    switch (doctrineType) {
      case (#MathematicalCore) { runMathematicalFormula(formulaName, inputs) };
      case (#AncientMath) { runAncientMathFormula(formulaName, inputs) };
      case (#FieldPhysics) { runPhysicsFormula(formulaName, inputs) };
      case (#CPLProtocol) { runCPLFormula(formulaName, inputs) };
      case (#GlyphCodex) { runGlyphFormula(formulaName, inputs) };
    }
  };

  /// Mathematical core formulas
  func runMathematicalFormula(name : Text, inputs : [Float]) : FormulaResult {
    switch (name) {
      case ("phi") {
        { formulaId = "phi"; input = inputs; output = AncientMath.PHI; success = true; error = null }
      };
      case ("phi_inverse") {
        { formulaId = "phi_inverse"; input = inputs; output = AncientMath.PHI_INVERSE; success = true; error = null }
      };
      case ("phi_power") {
        if (inputs.size() >= 1) {
          let result = AncientMath.phiPower(inputs[0]);
          { formulaId = "phi_power"; input = inputs; output = result; success = true; error = null }
        } else {
          { formulaId = "phi_power"; input = inputs; output = 0.0; success = false; error = ?"Missing input: exponent" }
        }
      };
      case ("schumann") {
        { formulaId = "schumann"; input = inputs; output = Physics.schumannFundamental(); success = true; error = null }
      };
      case ("schumann_harmonic") {
        if (inputs.size() >= 1) {
          let n = floatToNat(inputs[0]);
          let result = Physics.schumannMode(n);
          { formulaId = "schumann_harmonic"; input = inputs; output = result; success = true; error = null }
        } else {
          { formulaId = "schumann_harmonic"; input = inputs; output = 0.0; success = false; error = ?"Missing input: harmonic number" }
        }
      };
      case ("phi_heartbeat") {
        { formulaId = "phi_heartbeat"; input = inputs; output = Physics.phiHeartbeat(); success = true; error = null }
      };
      case (_) {
        { formulaId = name; input = inputs; output = 0.0; success = false; error = ?"Unknown formula" }
      };
    }
  };

  /// Ancient math formulas
  func runAncientMathFormula(name : Text, inputs : [Float]) : FormulaResult {
    switch (name) {
      case ("pythagorean") {
        if (inputs.size() >= 2) {
          let result = AncientMath.pythagorean(inputs[0], inputs[1]);
          { formulaId = "pythagorean"; input = inputs; output = result; success = true; error = null }
        } else {
          { formulaId = "pythagorean"; input = inputs; output = 0.0; success = false; error = ?"Need two sides" }
        }
      };
      case ("fibonacci") {
        if (inputs.size() >= 1) {
          let n = floatToNat(inputs[0]);
          let result = Float.fromInt(AncientMath.fibonacci(n));
          { formulaId = "fibonacci"; input = inputs; output = result; success = true; error = null }
        } else {
          { formulaId = "fibonacci"; input = inputs; output = 0.0; success = false; error = ?"Need position" }
        }
      };
      case ("golden_rectangle") {
        if (inputs.size() >= 1) {
          let (short, long) = AncientMath.goldenRectangle(inputs[0]);
          { formulaId = "golden_rectangle"; input = inputs; output = long; success = true; error = null }
        } else {
          { formulaId = "golden_rectangle"; input = inputs; output = 0.0; success = false; error = ?"Need short side" }
        }
      };
      case ("geometric_mean") {
        if (inputs.size() >= 2) {
          let result = AncientMath.geometricMean(inputs[0], inputs[1]);
          { formulaId = "geometric_mean"; input = inputs; output = result; success = true; error = null }
        } else {
          { formulaId = "geometric_mean"; input = inputs; output = 0.0; success = false; error = ?"Need two values" }
        }
      };
      case ("harmonic_mean") {
        if (inputs.size() >= 2) {
          let result = AncientMath.harmonicMean(inputs[0], inputs[1]);
          { formulaId = "harmonic_mean"; input = inputs; output = result; success = true; error = null }
        } else {
          { formulaId = "harmonic_mean"; input = inputs; output = 0.0; success = false; error = ?"Need two values" }
        }
      };
      case ("solfeggio") {
        // Return 528 Hz (Mi/Transformation)
        { formulaId = "solfeggio"; input = inputs; output = AncientMath.solfeggio("mi"); success = true; error = null }
      };
      case (_) {
        { formulaId = name; input = inputs; output = 0.0; success = false; error = ?"Unknown ancient math formula" }
      };
    }
  };

  /// Physics formulas
  func runPhysicsFormula(name : Text, inputs : [Float]) : FormulaResult {
    switch (name) {
      case ("photon_energy") {
        if (inputs.size() >= 1) {
          let result = Physics.photonEnergy(inputs[0]);
          { formulaId = "photon_energy"; input = inputs; output = result; success = true; error = null }
        } else {
          { formulaId = "photon_energy"; input = inputs; output = 0.0; success = false; error = ?"Need frequency" }
        }
      };
      case ("wave_velocity") {
        if (inputs.size() >= 2) {
          let result = Physics.waveVelocity(inputs[0], inputs[1]);
          { formulaId = "wave_velocity"; input = inputs; output = result; success = true; error = null }
        } else {
          { formulaId = "wave_velocity"; input = inputs; output = 0.0; success = false; error = ?"Need frequency and wavelength" }
        }
      };
      case ("coulomb_force") {
        if (inputs.size() >= 3) {
          let result = Physics.coulombForce(inputs[0], inputs[1], inputs[2]);
          { formulaId = "coulomb_force"; input = inputs; output = result; success = true; error = null }
        } else {
          { formulaId = "coulomb_force"; input = inputs; output = 0.0; success = false; error = ?"Need charge1, charge2, distance" }
        }
      };
      case ("orbital_period") {
        if (inputs.size() >= 2) {
          let result = Physics.orbitalPeriod(inputs[0], inputs[1]);
          { formulaId = "orbital_period"; input = inputs; output = result; success = true; error = null }
        } else {
          { formulaId = "orbital_period"; input = inputs; output = 0.0; success = false; error = ?"Need mass and radius" }
        }
      };
      case (_) {
        { formulaId = name; input = inputs; output = 0.0; success = false; error = ?"Unknown physics formula" }
      };
    }
  };

  /// CPL formulas
  func runCPLFormula(name : Text, inputs : [Float]) : FormulaResult {
    switch (name) {
      case ("sacred_ratio_phi") {
        { formulaId = "sacred_ratio_phi"; input = inputs; output = CPL.sacredRatio("phi"); success = true; error = null }
      };
      case ("sacred_ratio_sqrt2") {
        { formulaId = "sacred_ratio_sqrt2"; input = inputs; output = CPL.sacredRatio("sqrt2"); success = true; error = null }
      };
      case ("loci_distance") {
        if (inputs.size() >= 4) {
          // theta1, phi1, theta2, phi2
          let l1 = CPL.createLocus("l1", "l1", inputs[0], inputs[1], 1, 1);
          let l2 = CPL.createLocus("l2", "l2", inputs[2], inputs[3], 1, 1);
          let result = CPL.lociDistance(l1, l2);
          { formulaId = "loci_distance"; input = inputs; output = result; success = true; error = null }
        } else {
          { formulaId = "loci_distance"; input = inputs; output = 0.0; success = false; error = ?"Need theta1, phi1, theta2, phi2" }
        }
      };
      case (_) {
        { formulaId = name; input = inputs; output = 0.0; success = false; error = ?"Unknown CPL formula" }
      };
    }
  };

  /// Glyph formulas
  func runGlyphFormula(name : Text, inputs : [Float]) : FormulaResult {
    switch (name) {
      case ("mayan_long_count") {
        if (inputs.size() >= 5) {
          let result = Float.fromInt(Glyph.mayanLongCount(
            floatToNat(inputs[0]),
            floatToNat(inputs[1]),
            floatToNat(inputs[2]),
            floatToNat(inputs[3]),
            floatToNat(inputs[4])
          ));
          { formulaId = "mayan_long_count"; input = inputs; output = result; success = true; error = null }
        } else {
          { formulaId = "mayan_long_count"; input = inputs; output = 0.0; success = false; error = ?"Need baktun, katun, tun, uinal, kin" }
        }
      };
      case ("gematria") {
        // Return gematria of "medina"
        let result = Float.fromInt(Glyph.gematria("medina"));
        { formulaId = "gematria"; input = inputs; output = result; success = true; error = null }
      };
      case (_) {
        { formulaId = name; input = inputs; output = 0.0; success = false; error = ?"Unknown glyph formula" }
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GLYPH PROCESSING
  // ═══════════════════════════════════════════════════════════════════════════

  /// Add a glyph to the processing buffer
  public func addGlyph(session : ReadingSession, glyph : Glyph.Glyph, timestamp : Int) : ReadingSession {
    {
      sessionId = session.sessionId;
      reader = session.reader;
      doctrineType = session.doctrineType;
      documentsRead = session.documentsRead;
      formulasExecuted = session.formulasExecuted;
      glyphsProcessed = Array.append(session.glyphsProcessed, [glyph]);
      glyphPhrases = session.glyphPhrases;
      resonanceGained = session.resonanceGained + glyph.frequency / 10000.0;
      startTimestamp = session.startTimestamp;
      lastActivityTimestamp = timestamp;
    }
  };

  /// Process accumulated glyphs into a phrase
  public func processGlyphBuffer(session : ReadingSession, intent : Text, timestamp : Int) : ReadingSession {
    if (session.glyphsProcessed.size() == 0) {
      return session;
    };

    let phrase = Glyph.combineGlyphs(session.glyphsProcessed, intent, timestamp);
    
    {
      sessionId = session.sessionId;
      reader = session.reader;
      doctrineType = session.doctrineType;
      documentsRead = session.documentsRead;
      formulasExecuted = session.formulasExecuted;
      glyphsProcessed = []; // Clear buffer
      glyphPhrases = Array.append(session.glyphPhrases, [phrase]);
      resonanceGained = session.resonanceGained + phrase.combinedResonance / 100.0;
      startTimestamp = session.startTimestamp;
      lastActivityTimestamp = timestamp;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPLETE READING WORKFLOW
  // ═══════════════════════════════════════════════════════════════════════════

  public type ReadingWorkflow = {
    session : ReadingSession;
    sovereignState : Sovereign.SovereignState;
    documents : [DocOrg.DocumentOrganism];
    consensusHistory : [Sovereign.DualConsensus];
  };

  /// Initialize a complete reading workflow
  public func initWorkflow(timestamp : Int) : ReadingWorkflow {
    {
      session = newSession("workflow-main", "ORO", timestamp);
      sovereignState = Sovereign.initSovereign(timestamp);
      documents = [];
      consensusHistory = [];
    }
  };

  /// Full read-process-validate cycle
  public func fullReadCycle(
    workflow : ReadingWorkflow,
    doctrineType : DoctrineType,
    documentId : Text,
    content : Text,
    timestamp : Int
  ) : ReadingWorkflow {
    // Step 1: ORO reads
    let (newOro, sessionAfterOro) = oroReadsDoctrine(
      workflow.sovereignState.oro,
      workflow.session,
      doctrineType,
      documentId,
      timestamp
    );

    // Step 2: NOVA validates
    let (newNova, sessionAfterNova, flagged) = novaReadsDoctrine(
      workflow.sovereignState.nova,
      sessionAfterOro,
      doctrineType,
      documentId,
      content,
      timestamp
    );

    // Step 3: Form consensus
    let consensusId = "consensus-" # documentId # "-" # Nat.toText(workflow.consensusHistory.size());
    let newConsensus = Sovereign.formConsensus(
      consensusId,
      documentId,
      newOro,
      newNova,
      timestamp
    );

    // Update sovereign state
    let newSovereignState : Sovereign.SovereignState = {
      oro = newOro;
      nova = newNova;
      lastConsensus = ?newConsensus;
      gateA = workflow.sovereignState.gateA;
      gateB = workflow.sovereignState.gateB;
      gateC = newConsensus.finalConsensus;
      organismPhase = workflow.sovereignState.organismPhase;
      healthIndex = workflow.sovereignState.healthIndex;
    };

    {
      session = sessionAfterNova;
      sovereignState = newSovereignState;
      documents = workflow.documents;
      consensusHistory = Array.append(workflow.consensusHistory, [newConsensus]);
    }
  };
}
