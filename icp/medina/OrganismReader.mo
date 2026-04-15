import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";
import SovOrg "./SovereignOrganism";
import DocOrg "./DocumentOrganism";
import Doctrine "./DoctrineDocuments";
import Glyph "./AncientGlyphCodex";

/// OrganismReader: The Backend Canister That READS Documents
/// THE ARCHITECTURE (NOT COLLAPSIBLE):
/// 1. Doctrine Documents (living knowledge) - exist as their own organisms
/// 2. OrganismReader (this module) - reads documents, executes formulas
/// 3. SovereignOrganism (Oro+Nova) - the intelligence that uses the reader
/// 4. DocumentOrganism (24/7 autonomous) - self-mutating documents
/// 5. Frontend - displays all of this
/// 6. Device Network - phi-encoded signatures
module {

  public type OrganismReaderState = {
    id : Text;
    oro : SovOrg.OroState;
    nova : SovOrg.NovaState;
    doctrineLibrary : Doctrine.DoctrineLibrary;
    activeDocuments : [DocOrg.DocumentOrganism];
    computationContext : ComputationContext;
    readingLog : [ReadingEvent];
    glyphBuffer : [Glyph.Glyph];
    currentGlyphPhrase : ?Glyph.GlyphPhrase;
    totalReads : Nat;
    totalExecutions : Nat;
    lastActivityNs : Int;
  };

  public type ComputationContext = {
    activeFormulas : [Text];
    inputRegisters : Matalko.OrganismRegisters;
    outputRegisters : Matalko.OrganismRegisters;
    fieldState : Matalko.FieldState;
    glyphContext : [Glyph.Glyph];
    doctrineInfluence : Float;
  };

  public type ReadingEvent = {
    timestamp : Int;
    readerId : Text;
    documentId : Text;
    formulaId : ?Text;
    glyphsProcessed : Nat;
    resonanceGained : Float;
  };

  public func initOrganismReader(id : Text, seed : Nat) : OrganismReaderState {
    let oro = SovOrg.initOro("oro-" # id, seed);
    let nova = SovOrg.initNova("nova-" # id);
    let library = Doctrine.initDoctrineLibrary(0);
    
    {
      id = id;
      oro = oro;
      nova = nova;
      doctrineLibrary = library;
      activeDocuments = [];
      computationContext = {
        activeFormulas = [];
        inputRegisters = oro.registers;
        outputRegisters = oro.registers;
        fieldState = oro.fieldState;
        glyphContext = [];
        doctrineInfluence = Doctrine.totalDoctrineInfluence(library);
      };
      readingLog = [];
      glyphBuffer = [];
      currentGlyphPhrase = null;
      totalReads = 0;
      totalExecutions = 0;
      lastActivityNs = Time.now();
    };
  };

  func getDoc(lib : Doctrine.DoctrineLibrary, t : Doctrine.DoctrineType) : Doctrine.DoctrineDocument {
    switch (t) {
      case (#MathematicalCore) lib.matalko;
      case (#CommunicationProtocol) lib.cpl;
      case (#AncientMathematics) lib.ancientMath;
      case (#FieldPhysics) lib.fieldPhysics;
      case (#GlyphCodex) lib.glyphCodex;
      case _ lib.matalko;
    };
  };

  func updateDoc(lib : Doctrine.DoctrineLibrary, t : Doctrine.DoctrineType, doc : Doctrine.DoctrineDocument) : Doctrine.DoctrineLibrary {
    switch (t) {
      case (#MathematicalCore) { lib with matalko = doc };
      case (#CommunicationProtocol) { lib with cpl = doc };
      case (#AncientMathematics) { lib with ancientMath = doc };
      case (#FieldPhysics) { lib with fieldPhysics = doc };
      case (#GlyphCodex) { lib with glyphCodex = doc };
      case _ lib;
    };
  };

  public func oroReadsDoctrine(state : OrganismReaderState, docType : Doctrine.DoctrineType) : OrganismReaderState {
    let now = Time.now();
    let doc = getDoc(state.doctrineLibrary, docType);
    let updatedDoc = Doctrine.organismRead(doc, "oro");
    
    let gain = updatedDoc.influenceWeight * 0.05;
    let newRegs = Matalko.recitalPlusOneRegisters(state.oro.registers, {
      cognitive = gain; affective = gain * 0.5; somatic = 0.0; sovereign = gain * 0.2
    });
    
    {
      state with
      oro = { state.oro with registers = newRegs };
      doctrineLibrary = updateDoc(state.doctrineLibrary, docType, updatedDoc);
      readingLog = Array.append(state.readingLog, [{
        timestamp = now; readerId = "oro"; documentId = doc.organism.id;
        formulaId = null; glyphsProcessed = Array.size(doc.glyphSignature); resonanceGained = gain;
      }]);
      totalReads = state.totalReads + 1;
      lastActivityNs = now;
    };
  };

  public func novaReadsDoctrine(state : OrganismReaderState, docType : Doctrine.DoctrineType) : (OrganismReaderState, ?SovOrg.DriftFlag) {
    let now = Time.now();
    let doc = getDoc(state.doctrineLibrary, docType);
    let updatedDoc = Doctrine.organismRead(doc, "nova");
    let (newNova, driftFlag) = SovOrg.novaReview(state.nova, "doctrine-read:" # doc.organism.id, state.oro);
    
    ({
      state with
      nova = newNova;
      doctrineLibrary = updateDoc(state.doctrineLibrary, docType, updatedDoc);
      readingLog = Array.append(state.readingLog, [{
        timestamp = now; readerId = "nova"; documentId = doc.organism.id;
        formulaId = null; glyphsProcessed = 0; resonanceGained = 0.0;
      }]);
      totalReads = state.totalReads + 1;
      lastActivityNs = now;
    }, driftFlag);
  };

  public func executeFormula(state : OrganismReaderState, docType : Doctrine.DoctrineType, formulaId : Text) : OrganismReaderState {
    let now = Time.now();
    let doc = getDoc(state.doctrineLibrary, docType);
    let (updatedDoc, _) = Doctrine.executeFormula(doc, formulaId);
    
    {
      state with
      doctrineLibrary = updateDoc(state.doctrineLibrary, docType, updatedDoc);
      computationContext = { state.computationContext with
        activeFormulas = Array.append(state.computationContext.activeFormulas, [formulaId])
      };
      readingLog = Array.append(state.readingLog, [{
        timestamp = now; readerId = "oro"; documentId = doc.organism.id;
        formulaId = ?formulaId; glyphsProcessed = 0; resonanceGained = 0.0;
      }]);
      totalExecutions = state.totalExecutions + 1;
      lastActivityNs = now;
    };
  };

  public func addGlyph(state : OrganismReaderState, glyph : Glyph.Glyph) : OrganismReaderState {
    { state with glyphBuffer = Array.append(state.glyphBuffer, [glyph]); lastActivityNs = Time.now() };
  };

  public func processGlyphBuffer(state : OrganismReaderState) : OrganismReaderState {
    if (Array.size(state.glyphBuffer) == 0) { return state };
    let phrase = Glyph.combineGlyphs(state.glyphBuffer);
    { state with currentGlyphPhrase = ?phrase; glyphBuffer = [];
      computationContext = { state.computationContext with glyphContext = state.glyphBuffer }
    };
  };

  /// Full sovereign tick with document reading
  public func sovereignTickWithDoctrines(state : OrganismReaderState) : OrganismReaderState {
    let now = Time.now();
    
    // Tick the sovereign organism
    let (newOro, newNova, tickResult) = SovOrg.sovereignTick(
      state.oro, state.nova,
      Array.size(state.activeDocuments),
      0, // riskSignals
      true, // dualReadPassed
      0, // orphanSignals
      true // gatesOpen
    );
    
    // Update computation context
    let newContext = {
      state.computationContext with
      inputRegisters = newOro.registers;
      outputRegisters = newOro.registers;
      fieldState = newOro.fieldState;
    };
    
    {
      state with
      oro = newOro;
      nova = newNova;
      computationContext = newContext;
      lastActivityNs = now;
    };
  };

  /// Get total system health
  public func systemHealth(state : OrganismReaderState) : Float {
    let oroHealth = state.oro.healthScore;
    let novaAlignment = state.nova.doctrineAlignment;
    let doctrineInfluence = state.computationContext.doctrineInfluence;
    (oroHealth + novaAlignment + doctrineInfluence / 5.0) / 3.0;
  };
};