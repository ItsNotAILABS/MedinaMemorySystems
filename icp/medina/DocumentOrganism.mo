import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Char "mo:base/Char";
import Nat32 "mo:base/Nat32";
import Int32 "mo:base/Int32";

/// DOCUMENT ORGANISM
/// =================
/// NOT static text. NOT just content. LIVING ENTITIES that:
/// - Have phases (Germinating → Growing → Mature → Reproducing → Mutating → Dormant → Transcribing)
/// - Have metabolic rates (how fast they process/change)
/// - Have energy levels (capacity for operations)
/// - Accumulate resonance from being READ
/// - Can SELF-MUTATE based on triggers
/// - Can REPRODUCE (spawn child documents)

module {
  // ═══════════════════════════════════════════════════════════════════════════
  // FUNDAMENTAL CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════

  public let PHI : Float = 1.6180339887498948482;
  public let SCHUMANN_HZ : Float = 7.83;

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT LIFECYCLE PHASES
  // ═══════════════════════════════════════════════════════════════════════════

  public type DocumentPhase = {
    #Germinating;   // Initial creation, absorbing structure
    #Growing;       // Expanding content and connections
    #Mature;        // Stable, high-value state
    #Reproducing;   // Spawning child documents
    #Mutating;      // Self-modifying based on triggers
    #Dormant;       // Low activity, conserving energy
    #Transcribing;  // Being read/executed by organism
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MUTATION TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  public type MutationType = {
    #ContentExpansion;    // Adds new content autonomously
    #ContentRefinement;   // Improves existing content
    #StructureChange;     // Reorganizes internal structure
    #LinkFormation;       // Creates connections to other documents
    #Reproduction;        // Spawns child document
    #Consolidation;       // Absorbs children back
  };

  public type MutationTrigger = {
    #ScheduledCycle;      // Regular metabolic cycle
    #ResonanceThreshold;  // Enough reads accumulated
    #ExternalStimulus;    // Another organism triggered it
    #GrowthPressure;      // Natural expansion
    #EntropyDecay;        // Needs refreshing
  };

  public type MutationRecord = {
    id : Text;
    mutationType : MutationType;
    trigger : MutationTrigger;
    beforeHash : Text;
    afterHash : Text;
    deltaDescription : Text;
    energyCost : Float;
    timestamp : Int;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT ORGANISM STRUCTURE
  // ═══════════════════════════════════════════════════════════════════════════

  public type DocumentOrganism = {
    // Identity
    id : Text;
    title : Text;
    category : Text;       // constitution, law, doctrine, workforce, etc.
    path : Text;           // File system path
    
    // Content
    content : Text;
    contentHash : Text;
    version : Nat;
    
    // Lifecycle
    phase : DocumentPhase;
    createdAt : Int;
    lastMutatedAt : Int;
    lastReadAt : Int;
    readCount : Nat;
    
    // Metabolism
    metabolicRate : Float;      // 0.1 (constitution) to 0.9 (workforce)
    energyLevel : Float;        // 0.0 to 1.0
    resonanceCharge : Float;    // Accumulated from reads
    
    // Mutation
    mutationPotential : Float;  // Depletes with mutations
    mutationHistory : [MutationRecord];
    
    // Relationships
    parentId : ?Text;           // If spawned from another
    childIds : [Text];          // Documents it spawned
    linkedIds : [Text];         // Connected documents
    
    // Governance
    creator : Text;
    lastModifiedBy : Text;
    lawRefs : [Text];           // Applicable laws
    doctrineAlignment : Float;  // 0.0 to 1.0
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT CREATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Create a new document organism
  public func createDocument(
    id : Text,
    title : Text,
    category : Text,
    path : Text,
    content : Text,
    creator : Text,
    metabolicRate : Float,
    timestamp : Int
  ) : DocumentOrganism {
    {
      id = id;
      title = title;
      category = category;
      path = path;
      content = content;
      contentHash = simpleHash(content);
      version = 1;
      phase = #Germinating;
      createdAt = timestamp;
      lastMutatedAt = timestamp;
      lastReadAt = timestamp;
      readCount = 0;
      metabolicRate = clamp(metabolicRate, 0.1, 0.9);
      energyLevel = 1.0;
      resonanceCharge = 0.0;
      mutationPotential = 1.0;
      mutationHistory = [];
      parentId = null;
      childIds = [];
      linkedIds = [];
      creator = creator;
      lastModifiedBy = creator;
      lawRefs = [];
      doctrineAlignment = 0.8;
    }
  };

  /// Create a child document (reproduction)
  public func spawnChild(
    parent : DocumentOrganism,
    childId : Text,
    childTitle : Text,
    childContent : Text,
    timestamp : Int
  ) : (DocumentOrganism, DocumentOrganism) {
    // Create child with inherited properties
    let child : DocumentOrganism = {
      id = childId;
      title = childTitle;
      category = parent.category;
      path = parent.path # "/" # childId;
      content = childContent;
      contentHash = simpleHash(childContent);
      version = 1;
      phase = #Germinating;
      createdAt = timestamp;
      lastMutatedAt = timestamp;
      lastReadAt = timestamp;
      readCount = 0;
      metabolicRate = parent.metabolicRate * PHI / 2.0; // Slightly different rate
      energyLevel = 0.5; // Starts with half energy
      resonanceCharge = parent.resonanceCharge * 0.1; // Inherits some resonance
      mutationPotential = 1.0;
      mutationHistory = [];
      parentId = ?parent.id;
      childIds = [];
      linkedIds = [parent.id];
      creator = parent.id;
      lastModifiedBy = parent.id;
      lawRefs = parent.lawRefs;
      doctrineAlignment = parent.doctrineAlignment;
    };

    // Update parent with reproduction record
    let mutationRecord : MutationRecord = {
      id = "mutation-" # parent.id # "-reproduction-" # Nat.toText(Array.size(parent.mutationHistory));
      mutationType = #Reproduction;
      trigger = #GrowthPressure;
      beforeHash = parent.contentHash;
      afterHash = parent.contentHash; // Content unchanged
      deltaDescription = "Spawned child: " # childId;
      energyCost = 0.3;
      timestamp = timestamp;
    };

    let updatedParent : DocumentOrganism = {
      id = parent.id;
      title = parent.title;
      category = parent.category;
      path = parent.path;
      content = parent.content;
      contentHash = parent.contentHash;
      version = parent.version;
      phase = #Reproducing;
      createdAt = parent.createdAt;
      lastMutatedAt = timestamp;
      lastReadAt = parent.lastReadAt;
      readCount = parent.readCount;
      metabolicRate = parent.metabolicRate;
      energyLevel = Float.max(0.0, parent.energyLevel - 0.3); // Reproduction costs energy
      resonanceCharge = parent.resonanceCharge;
      mutationPotential = Float.max(0.0, parent.mutationPotential - 0.1);
      mutationHistory = Array.append(parent.mutationHistory, [mutationRecord]);
      parentId = parent.parentId;
      childIds = Array.append(parent.childIds, [childId]);
      linkedIds = parent.linkedIds;
      creator = parent.creator;
      lastModifiedBy = parent.id;
      lawRefs = parent.lawRefs;
      doctrineAlignment = parent.doctrineAlignment;
    };

    (updatedParent, child)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT READING (ORGANISM INTERACTION)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Record a document being read — gains resonance
  public func recordRead(doc : DocumentOrganism, readerId : Text, timestamp : Int) : DocumentOrganism {
    let resonanceGain = 0.01 * doc.metabolicRate; // Higher metabolic rate = more responsive
    
    {
      id = doc.id;
      title = doc.title;
      category = doc.category;
      path = doc.path;
      content = doc.content;
      contentHash = doc.contentHash;
      version = doc.version;
      phase = #Transcribing;
      createdAt = doc.createdAt;
      lastMutatedAt = doc.lastMutatedAt;
      lastReadAt = timestamp;
      readCount = doc.readCount + 1;
      metabolicRate = doc.metabolicRate;
      energyLevel = doc.energyLevel;
      resonanceCharge = Float.min(1.0, doc.resonanceCharge + resonanceGain);
      mutationPotential = doc.mutationPotential;
      mutationHistory = doc.mutationHistory;
      parentId = doc.parentId;
      childIds = doc.childIds;
      linkedIds = doc.linkedIds;
      creator = doc.creator;
      lastModifiedBy = doc.lastModifiedBy;
      lawRefs = doc.lawRefs;
      doctrineAlignment = doc.doctrineAlignment;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT MUTATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Check if document should mutate
  public func shouldMutate(doc : DocumentOrganism, currentTime : Int) : ?MutationTrigger {
    // Check resonance threshold
    if (doc.resonanceCharge >= 0.8 and doc.mutationPotential > 0.0) {
      return ?#ResonanceThreshold;
    };
    
    // Check scheduled cycle (every 52 beats worth of time)
    let cycleTime : Int = 52 * 873_000_000; // 52 beats at 873ms
    let timeSinceLastMutation = currentTime - doc.lastMutatedAt;
    if (timeSinceLastMutation > cycleTime and doc.energyLevel > 0.3) {
      return ?#ScheduledCycle;
    };
    
    // Check entropy decay (needs refreshing)
    let decayThreshold : Int = 500 * 873_000_000; // ~500 beats
    if (timeSinceLastMutation > decayThreshold and doc.readCount > 10) {
      return ?#EntropyDecay;
    };
    
    null
  };

  /// Apply a mutation to the document
  public func mutate(
    doc : DocumentOrganism,
    mutationType : MutationType,
    trigger : MutationTrigger,
    newContent : Text,
    description : Text,
    timestamp : Int
  ) : DocumentOrganism {
    let energyCost = switch (mutationType) {
      case (#ContentExpansion) { 0.2 };
      case (#ContentRefinement) { 0.1 };
      case (#StructureChange) { 0.25 };
      case (#LinkFormation) { 0.05 };
      case (#Reproduction) { 0.3 };
      case (#Consolidation) { 0.15 };
    };

    if (doc.energyLevel < energyCost or doc.mutationPotential <= 0.0) {
      return doc; // Can't mutate
    };

    let mutationRecord : MutationRecord = {
      id = "mutation-" # doc.id # "-" # Nat.toText(Array.size(doc.mutationHistory));
      mutationType = mutationType;
      trigger = trigger;
      beforeHash = doc.contentHash;
      afterHash = simpleHash(newContent);
      deltaDescription = description;
      energyCost = energyCost;
      timestamp = timestamp;
    };

    {
      id = doc.id;
      title = doc.title;
      category = doc.category;
      path = doc.path;
      content = newContent;
      contentHash = simpleHash(newContent);
      version = doc.version + 1;
      phase = #Mutating;
      createdAt = doc.createdAt;
      lastMutatedAt = timestamp;
      lastReadAt = doc.lastReadAt;
      readCount = doc.readCount;
      metabolicRate = doc.metabolicRate;
      energyLevel = Float.max(0.0, doc.energyLevel - energyCost);
      resonanceCharge = doc.resonanceCharge * 0.5; // Mutation consumes resonance
      mutationPotential = Float.max(0.0, doc.mutationPotential - 0.05);
      mutationHistory = Array.append(doc.mutationHistory, [mutationRecord]);
      parentId = doc.parentId;
      childIds = doc.childIds;
      linkedIds = doc.linkedIds;
      creator = doc.creator;
      lastModifiedBy = doc.id; // Self-modified
      lawRefs = doc.lawRefs;
      doctrineAlignment = doc.doctrineAlignment;
    }
  };

  /// Link two documents
  public func linkDocuments(doc1 : DocumentOrganism, doc2Id : Text, timestamp : Int) : DocumentOrganism {
    // Check if already linked
    for (linked in doc1.linkedIds.vals()) {
      if (linked == doc2Id) { return doc1 };
    };

    let mutationRecord : MutationRecord = {
      id = "mutation-" # doc1.id # "-link-" # Nat.toText(Array.size(doc1.mutationHistory));
      mutationType = #LinkFormation;
      trigger = #ExternalStimulus;
      beforeHash = doc1.contentHash;
      afterHash = doc1.contentHash;
      deltaDescription = "Linked to: " # doc2Id;
      energyCost = 0.05;
      timestamp = timestamp;
    };

    {
      id = doc1.id;
      title = doc1.title;
      category = doc1.category;
      path = doc1.path;
      content = doc1.content;
      contentHash = doc1.contentHash;
      version = doc1.version;
      phase = doc1.phase;
      createdAt = doc1.createdAt;
      lastMutatedAt = timestamp;
      lastReadAt = doc1.lastReadAt;
      readCount = doc1.readCount;
      metabolicRate = doc1.metabolicRate;
      energyLevel = Float.max(0.0, doc1.energyLevel - 0.05);
      resonanceCharge = doc1.resonanceCharge;
      mutationPotential = doc1.mutationPotential;
      mutationHistory = Array.append(doc1.mutationHistory, [mutationRecord]);
      parentId = doc1.parentId;
      childIds = doc1.childIds;
      linkedIds = Array.append(doc1.linkedIds, [doc2Id]);
      creator = doc1.creator;
      lastModifiedBy = doc1.lastModifiedBy;
      lawRefs = doc1.lawRefs;
      doctrineAlignment = doc1.doctrineAlignment;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // METABOLIC CYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Process one metabolic cycle (called each beat)
  public func metabolicCycle(doc : DocumentOrganism, beatNumber : Nat, timestamp : Int) : DocumentOrganism {
    // Energy regeneration
    let energyRegen = 0.01 * doc.metabolicRate;
    let newEnergy = Float.min(1.0, doc.energyLevel + energyRegen);
    
    // Phase transitions based on state
    let newPhase = determinePhase(doc, beatNumber);
    
    // Resonance decay (very slow)
    let resonanceDecay = doc.resonanceCharge * 0.001;
    let newResonance = Float.max(0.0, doc.resonanceCharge - resonanceDecay);
    
    {
      id = doc.id;
      title = doc.title;
      category = doc.category;
      path = doc.path;
      content = doc.content;
      contentHash = doc.contentHash;
      version = doc.version;
      phase = newPhase;
      createdAt = doc.createdAt;
      lastMutatedAt = doc.lastMutatedAt;
      lastReadAt = doc.lastReadAt;
      readCount = doc.readCount;
      metabolicRate = doc.metabolicRate;
      energyLevel = newEnergy;
      resonanceCharge = newResonance;
      mutationPotential = doc.mutationPotential;
      mutationHistory = doc.mutationHistory;
      parentId = doc.parentId;
      childIds = doc.childIds;
      linkedIds = doc.linkedIds;
      creator = doc.creator;
      lastModifiedBy = doc.lastModifiedBy;
      lawRefs = doc.lawRefs;
      doctrineAlignment = doc.doctrineAlignment;
    }
  };

  /// Determine current phase based on document state
  func determinePhase(doc : DocumentOrganism, beatNumber : Nat) : DocumentPhase {
    // Recently created
    if (doc.readCount < 5) { return #Germinating };
    
    // High resonance and mutation potential — ready to reproduce
    if (doc.resonanceCharge > 0.9 and doc.mutationPotential > 0.5 and doc.energyLevel > 0.7) {
      return #Reproducing;
    };
    
    // Needs mutation
    if (doc.resonanceCharge > 0.8 and doc.mutationPotential > 0.0) {
      return #Mutating;
    };
    
    // Low energy — go dormant
    if (doc.energyLevel < 0.2) { return #Dormant };
    
    // Growing phase (expanding connections and content)
    if (doc.readCount < 50 and doc.energyLevel > 0.5) { return #Growing };
    
    // Default to mature
    #Mature
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  func clamp(value : Float, minVal : Float, maxVal : Float) : Float {
    Float.max(minVal, Float.min(maxVal, value))
  };

  func simpleHash(content : Text) : Text {
    // Simple hash based on content length and character sum
    var sum = 0;
    for (c in Text.toIter(content)) {
      sum += Int.abs(Int32.toInt(Int32.fromNat32(Nat32.fromNat(Nat32.toNat(Char.toNat32(c))))));
    };
    "HASH-" # Nat.toText(Text.size(content)) # "-" # Int.toText(Int.abs(sum) % 1000000)
  };

  /// Get document health score (0.0 to 1.0)
  public func healthScore(doc : DocumentOrganism) : Float {
    let energyWeight = 0.3;
    let resonanceWeight = 0.2;
    let alignmentWeight = 0.3;
    let mutationWeight = 0.2;
    
    (doc.energyLevel * energyWeight) +
    (doc.resonanceCharge * resonanceWeight) +
    (doc.doctrineAlignment * alignmentWeight) +
    (doc.mutationPotential * mutationWeight)
  };

  /// Get document age in beats (assuming 873ms per beat)
  public func ageInBeats(doc : DocumentOrganism, currentTime : Int) : Nat {
    let ageNs = currentTime - doc.createdAt;
    let beatNs = 873_000_000; // 873ms in nanoseconds
    Int.abs(ageNs / beatNs)
  };
}
