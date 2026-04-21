import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";
import CPL "./CPL";

/// DocumentOrganism: Living Document Entities
/// These are NOT static documents. They are 24/7 autonomous, self-mutating organisms.
/// Each document organism has its own lifecycle, metabolism, and evolutionary capacity.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT ORGANISM TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Document organism lifecycle phase
  public type DocPhase = {
    #Germinating;    // Initial creation, establishing structure
    #Growing;        // Accumulating content and connections
    #Mature;         // Stable, high-utility state
    #Reproducing;    // Spawning child documents
    #Mutating;       // Self-modification in progress
    #Dormant;        // Low activity, archival state
    #Transcribing;   // Being read/executed by other organisms
  };

  /// Document organism role in the ecosystem
  public type DocRole = {
    #Constitution;   // Foundational law (N1-N2 ring)
    #Doctrine;       // Governing principles (N2-N4)
    #Strategy;       // Strategic direction (N4-N5)
    #Operational;    // Day-to-day execution (N5-N7)
    #Memory;         // Knowledge storage (N7-N8)
    #Interface;      // External communication (N9-N11)
    #Archive;        // Historical record (N12)
    #Workforce;      // Active task execution (D1-D10)
  };

  /// The living document organism
  public type DocumentOrganism = {
    // Identity
    id : Text;
    title : Text;
    role : DocRole;
    
    // Lifecycle
    phase : DocPhase;
    generation : Nat;          // How many mutations from origin
    birthBeat : Nat;           // Beat when created
    lastMutationBeat : Nat;    // Beat of last self-mutation
    
    // Metabolism (activity rates)
    metabolicRate : Float;     // How fast it processes/changes
    energyLevel : Float;       // Current energy [0,1]
    resonanceCharge : Float;   // Accumulated resonance from reads
    
    // Coordinates in Memory Temple
    coordinates : Matalko.SphericalCoord;
    ring : Nat;                // N1-N12 macro hierarchy
    depth : Nat;               // Depth within ring
    
    // Content
    content : Text;
    contentHash : Nat;
    
    // Lineage
    parentId : ?Text;
    childIds : [Text];
    siblingIds : [Text];
    
    // Connections (how it relates to other organisms)
    inboundLinks : [Text];     // Documents that reference this
    outboundLinks : [Text];    // Documents this references
    resonancePartners : [Text]; // Documents it harmonizes with
    
    // Self-mutation genome
    mutationPotential : Float; // Capacity for self-change [0,1]
    mutationHistory : [MutationRecord];
    
    // Ancient encoding
    element : CPL.Element;     // Fire/Earth/Air/Water
    tetractysPosition : Nat;   // 1-10 sacred position
    phiSignature : Float;      // Golden ratio encoding
    harmonicFreq : Float;      // Base frequency
    
    // Governance
    gateRequired : ?Text;      // "A", "B", "C" for modifications
    doctrineAlignment : Float; // How aligned with canonical doctrine
    
    // Timestamps
    createdAtNs : Int;
    lastAccessedNs : Int;
    lastMutatedNs : Int;
  };

  /// Record of a self-mutation event
  public type MutationRecord = {
    id : Text;
    beat : Nat;
    mutationType : MutationType;
    beforeHash : Nat;
    afterHash : Nat;
    energyCost : Float;
    trigger : MutationTrigger;
    timestamp : Int;
  };

  /// Types of self-mutation
  public type MutationType = {
    #ContentExpansion;   // Added new content
    #ContentRefinement;  // Improved existing content
    #StructureChange;    // Reorganized structure
    #LinkFormation;      // Created new connections
    #LinkPruning;        // Removed weak connections
    #PhaseTransition;    // Changed lifecycle phase
    #Reproduction;       // Spawned child document
    #Consolidation;      // Absorbed content from children
    #Transcription;      // Converted format/encoding
  };

  /// What triggered the mutation
  public type MutationTrigger = {
    #ScheduledCycle;     // Regular metabolic cycle
    #ResonanceThreshold; // Accumulated enough resonance
    #ExternalStimulus;   // Another organism triggered it
    #EntropyCorrection;  // Self-repair from disorder
    #GrowthPressure;     // Natural expansion
    #ConsolidationNeed;  // Too many children, need merge
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT ORGANISM LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Create a new document organism
  public func germinate(
    id : Text,
    title : Text,
    role : DocRole,
    content : Text,
    parentId : ?Text,
    ring : Nat,
    currentBeat : Nat
  ) : DocumentOrganism {
    let now = Time.now();
    let hash = Text.hash(content);
    let phiSig = Matalko.phiEncode(Float.fromInt(hash));
    let freq = Matalko.FREQ_432 * (1.0 + phiSig);
    
    // Determine element from role
    let element = roleToElement(role);
    
    // Calculate coordinates using golden angle
    let theta = Matalko.optimalPlacementAngle(hash % 1000);
    let phi = Matalko.PI * (Float.fromInt(ring) / 12.0);
    let radius = Matalko.ringRadius(ring);
    
    {
      id = id;
      title = title;
      role = role;
      phase = #Germinating;
      generation = switch (parentId) { case null 0; case _ 1 };
      birthBeat = currentBeat;
      lastMutationBeat = currentBeat;
      metabolicRate = roleToMetabolicRate(role);
      energyLevel = 0.5;
      resonanceCharge = 0.0;
      coordinates = {
        theta = theta;
        phi = phi;
        radius = radius;
        ring = ring;
        depth = 1;
      };
      ring = ring;
      depth = 1;
      content = content;
      contentHash = hash;
      parentId = parentId;
      childIds = [];
      siblingIds = [];
      inboundLinks = [];
      outboundLinks = [];
      resonancePartners = [];
      mutationPotential = 0.5;
      mutationHistory = [];
      element = element;
      tetractysPosition = (hash % 10) + 1;
      phiSignature = phiSig;
      harmonicFreq = freq;
      gateRequired = roleToGate(role);
      doctrineAlignment = 1.0;
      createdAtNs = now;
      lastAccessedNs = now;
      lastMutatedNs = now;
    };
  };

  /// Role → Element mapping (Aristotelian correspondence)
  func roleToElement(role : DocRole) : CPL.Element {
    switch (role) {
      case (#Constitution) #Water;  // Sovereign, foundational
      case (#Doctrine) #Water;      // Sovereign authority
      case (#Strategy) #Fire;       // Transformative will
      case (#Operational) #Earth;   // Grounded execution
      case (#Memory) #Water;        // Flow, retention
      case (#Interface) #Air;       // Communication
      case (#Archive) #Earth;       // Stable storage
      case (#Workforce) #Fire;      // Active transformation
    };
  };

  /// Role → Metabolic rate (how active the document is)
  func roleToMetabolicRate(role : DocRole) : Float {
    switch (role) {
      case (#Constitution) 0.1;   // Very stable, slow change
      case (#Doctrine) 0.15;      // Stable
      case (#Strategy) 0.4;       // Moderate change
      case (#Operational) 0.7;    // Active
      case (#Memory) 0.3;         // Moderate
      case (#Interface) 0.8;      // Very active
      case (#Archive) 0.05;       // Very slow
      case (#Workforce) 0.9;      // Highly active
    };
  };

  /// Role → Gate requirement
  func roleToGate(role : DocRole) : ?Text {
    switch (role) {
      case (#Constitution) ?"A";  // Gate A for constitutional
      case (#Doctrine) ?"A";      // Gate A for doctrine
      case (#Strategy) ?"A";      // Gate A for strategy
      case (#Operational) ?"B";   // Gate B for workforce activation
      case (#Memory) null;        // No gate for memory
      case (#Interface) ?"C";     // Gate C for external projection
      case (#Archive) null;       // No gate for archive
      case (#Workforce) ?"B";     // Gate B for workforce
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTONOMOUS SELF-MUTATION (24/7 Operation)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Document organism metabolic tick (called every system beat)
  public func metabolicTick(
    doc : DocumentOrganism,
    currentBeat : Nat,
    systemEnergy : Float,
    externalStimuli : [Text]
  ) : (DocumentOrganism, ?MutationRecord) {
    let now = Time.now();
    
    // Calculate energy delta based on metabolic rate
    let energyGain = doc.metabolicRate * systemEnergy * 0.01;
    let energyDecay = doc.metabolicRate * 0.005; // Natural decay
    let newEnergy = Matalko.recitalPlusOneBounded(
      doc.energyLevel, 
      energyGain - energyDecay, 
      0.0, 
      1.0
    );
    
    // Accumulate resonance from any external stimuli
    let resonanceGain = Float.fromInt(Array.size(externalStimuli)) * 0.05;
    let newResonance = Matalko.recitalPlusOneBounded(
      doc.resonanceCharge,
      resonanceGain,
      0.0,
      10.0
    );
    
    // Check if mutation should occur
    let shouldMutate = checkMutationConditions(doc, newEnergy, newResonance, currentBeat);
    
    if (shouldMutate) {
      // Perform self-mutation
      let (mutatedDoc, mutation) = performMutation(doc, currentBeat, now);
      let finalDoc = {
        mutatedDoc with
        energyLevel = newEnergy - mutation.energyCost;
        resonanceCharge = if (mutation.mutationType == #ResonanceThreshold) 0.0 else newResonance;
        lastAccessedNs = now;
      };
      (finalDoc, ?mutation);
    } else {
      // Just update energy and resonance
      let updatedDoc = {
        doc with
        energyLevel = newEnergy;
        resonanceCharge = newResonance;
        lastAccessedNs = now;
      };
      (updatedDoc, null);
    };
  };

  /// Check if mutation conditions are met
  func checkMutationConditions(
    doc : DocumentOrganism,
    energy : Float,
    resonance : Float,
    currentBeat : Nat
  ) : Bool {
    // Condition 1: Enough energy
    if (energy < 0.3) { return false; };
    
    // Condition 2: Not mutated too recently (cooldown)
    let beatsSinceMutation = currentBeat - doc.lastMutationBeat;
    let cooldownBeats = Nat.max(10, Int.abs(Float.toInt(100.0 / doc.metabolicRate)));
    if (beatsSinceMutation < cooldownBeats) { return false; };
    
    // Condition 3: Has mutation potential
    if (doc.mutationPotential < 0.1) { return false; };
    
    // Condition 4: At least one trigger condition met
    let resonanceThreshold = resonance > 5.0;
    let scheduledCycle = beatsSinceMutation > cooldownBeats * 2;
    let growthPressure = doc.phase == #Growing and energy > 0.7;
    
    resonanceThreshold or scheduledCycle or growthPressure;
  };

  /// Perform the actual self-mutation
  func performMutation(
    doc : DocumentOrganism,
    currentBeat : Nat,
    now : Int
  ) : (DocumentOrganism, MutationRecord) {
    // Determine mutation type based on current state
    let mutationType = selectMutationType(doc);
    let trigger = determineTrigger(doc);
    
    // Calculate energy cost (more complex mutations cost more)
    let energyCost = mutationEnergyCost(mutationType);
    
    // Create mutation record
    let mutation : MutationRecord = {
      id = "mut-" # doc.id # "-" # Nat.toText(currentBeat);
      beat = currentBeat;
      mutationType = mutationType;
      beforeHash = doc.contentHash;
      afterHash = doc.contentHash + 1; // Simplified; real impl would rehash
      energyCost = energyCost;
      trigger = trigger;
      timestamp = now;
    };
    
    // Apply mutation effects
    let newPhase = mutationPhaseEffect(doc.phase, mutationType);
    let newPotential = Matalko.recitalPlusOneBounded(
      doc.mutationPotential,
      -0.05, // Each mutation slightly reduces potential
      0.0,
      1.0
    );
    
    let mutatedDoc = {
      doc with
      phase = newPhase;
      lastMutationBeat = currentBeat;
      mutationPotential = newPotential;
      mutationHistory = Array.append(doc.mutationHistory, [mutation]);
      contentHash = mutation.afterHash;
      lastMutatedNs = now;
    };
    
    (mutatedDoc, mutation);
  };

  /// Select mutation type based on document state
  func selectMutationType(doc : DocumentOrganism) : MutationType {
    switch (doc.phase) {
      case (#Germinating) #ContentExpansion;
      case (#Growing) #ContentExpansion;
      case (#Mature) #ContentRefinement;
      case (#Reproducing) #Reproduction;
      case (#Mutating) #StructureChange;
      case (#Dormant) #PhaseTransition;
      case (#Transcribing) #Transcription;
    };
  };

  /// Determine what triggered this mutation
  func determineTrigger(doc : DocumentOrganism) : MutationTrigger {
    if (doc.resonanceCharge > 5.0) { return #ResonanceThreshold; };
    if (doc.energyLevel > 0.8) { return #GrowthPressure; };
    if (Array.size(doc.childIds) > 10) { return #ConsolidationNeed; };
    #ScheduledCycle;
  };

  /// Energy cost for each mutation type
  func mutationEnergyCost(mutationType : MutationType) : Float {
    switch (mutationType) {
      case (#ContentExpansion) 0.15;
      case (#ContentRefinement) 0.1;
      case (#StructureChange) 0.2;
      case (#LinkFormation) 0.05;
      case (#LinkPruning) 0.03;
      case (#PhaseTransition) 0.25;
      case (#Reproduction) 0.4;
      case (#Consolidation) 0.3;
      case (#Transcription) 0.2;
    };
  };

  /// How mutation affects phase
  func mutationPhaseEffect(currentPhase : DocPhase, mutationType : MutationType) : DocPhase {
    switch (mutationType) {
      case (#Reproduction) #Reproducing;
      case (#PhaseTransition) {
        switch (currentPhase) {
          case (#Germinating) #Growing;
          case (#Growing) #Mature;
          case (#Mature) #Reproducing;
          case (#Reproducing) #Mature;
          case (#Mutating) #Growing;
          case (#Dormant) #Growing;
          case (#Transcribing) #Mature;
        };
      };
      case _ currentPhase;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT ORGANISM INTERACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Form a resonance link between two documents
  public func formResonanceLink(
    docA : DocumentOrganism,
    docB : DocumentOrganism
  ) : (DocumentOrganism, DocumentOrganism, Float) {
    // Calculate harmonic resonance between documents
    let resonance = Matalko.harmonicResonance(docA.harmonicFreq, docB.harmonicFreq);
    
    // Only form link if resonance is strong enough
    if (resonance < 0.5) {
      return (docA, docB, resonance);
    };
    
    let newDocA = {
      docA with
      resonancePartners = Array.append(docA.resonancePartners, [docB.id]);
      outboundLinks = Array.append(docA.outboundLinks, [docB.id]);
    };
    
    let newDocB = {
      docB with
      resonancePartners = Array.append(docB.resonancePartners, [docA.id]);
      inboundLinks = Array.append(docB.inboundLinks, [docA.id]);
    };
    
    (newDocA, newDocB, resonance);
  };

  /// Document reads another document (resonance transfer)
  public func documentRead(
    reader : DocumentOrganism,
    target : DocumentOrganism
  ) : (DocumentOrganism, DocumentOrganism) {
    let now = Time.now();
    
    // Reader gains knowledge (resonance)
    let readerGain = target.doctrineAlignment * 0.1;
    let newReader = {
      reader with
      resonanceCharge = Matalko.recitalPlusOneBounded(reader.resonanceCharge, readerGain, 0.0, 10.0);
      lastAccessedNs = now;
    };
    
    // Target gains resonance from being read
    let targetGain = reader.energyLevel * 0.05;
    let newTarget = {
      target with
      resonanceCharge = Matalko.recitalPlusOneBounded(target.resonanceCharge, targetGain, 0.0, 10.0);
      lastAccessedNs = now;
    };
    
    (newReader, newTarget);
  };

  /// Document organism reproduces (spawns child)
  public func reproduce(
    parent : DocumentOrganism,
    childId : Text,
    childTitle : Text,
    childContent : Text,
    currentBeat : Nat
  ) : (DocumentOrganism, DocumentOrganism) {
    // Create child
    let child = germinate(
      childId,
      childTitle,
      parent.role,
      childContent,
      ?parent.id,
      parent.ring + 1, // Child is one ring deeper
      currentBeat
    );
    
    // Inherit some properties from parent
    let inheritedChild = {
      child with
      generation = parent.generation + 1;
      siblingIds = parent.childIds;
      phiSignature = Matalko.phiEncode(parent.phiSignature * Matalko.PHI);
      doctrineAlignment = parent.doctrineAlignment * 0.95; // Slight drift
    };
    
    // Update parent
    let updatedParent = {
      parent with
      childIds = Array.append(parent.childIds, [childId]);
      energyLevel = parent.energyLevel - 0.3; // Reproduction costs energy
      phase = #Mature; // Return to mature after reproduction
    };
    
    (updatedParent, inheritedChild);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT ORGANISM HEALTH & METRICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Calculate document organism health score
  public func healthScore(doc : DocumentOrganism) : Float {
    let energyFactor = doc.energyLevel;
    let alignmentFactor = doc.doctrineAlignment;
    let potentialFactor = doc.mutationPotential;
    let connectionFactor = Float.min(1.0, Float.fromInt(
      Array.size(doc.inboundLinks) + 
      Array.size(doc.outboundLinks) + 
      Array.size(doc.resonancePartners)
    ) / 10.0);
    
    // Phi-weighted combination
    (energyFactor * Matalko.PHI_INVERSE * Matalko.PHI_INVERSE) +
    (alignmentFactor * Matalko.PHI_INVERSE) +
    (potentialFactor * Matalko.PHI_INVERSE) +
    (connectionFactor * 1.0);
  };

  /// Get document organism vital signs
  public func vitalSigns(doc : DocumentOrganism) : {
    health : Float;
    energy : Float;
    resonance : Float;
    alignment : Float;
    potential : Float;
    age : Nat;
    generation : Nat;
    childCount : Nat;
    linkCount : Nat;
  } {
    {
      health = healthScore(doc);
      energy = doc.energyLevel;
      resonance = doc.resonanceCharge;
      alignment = doc.doctrineAlignment;
      potential = doc.mutationPotential;
      age = doc.lastMutationBeat - doc.birthBeat;
      generation = doc.generation;
      childCount = Array.size(doc.childIds);
      linkCount = Array.size(doc.inboundLinks) + Array.size(doc.outboundLinks);
    };
  };
};
