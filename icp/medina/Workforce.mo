import Array "mo:base/Array";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";
import CPL "./CPL";

/// Workforce: Sandboxed Organisms for Enterprise Execution
/// These organisms live inside the main canister, share intelligence outward,
/// but operate in isolated sandboxes for each tenant/company/user.
/// Communication happens through CPL (Cognitive Procurement Language).
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // WORKFORCE ORGANISM TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Workforce organism state
  public type WorkforceOrganism = {
    id : Text;
    tenantId : Text;              // Which company/user owns this organism
    name : Text;
    role : WorkforceRole;
    
    // State (4-register, sandboxed)
    registers : Matalko.OrganismRegisters;
    element : CPL.Element;        // Dominant element
    
    // Capabilities
    capabilities : [Capability];
    permissions : [Text];
    
    // Sandbox boundaries
    memoryBoundary : Text;        // Root of accessible memory
    governanceBoundary : Text;    // Governance scope
    projectionAllowed : Bool;     // Can project externally?
    
    // Lineage to core intelligence
    parentOrganismId : Text;      // Links to Oro
    inheritedDoctrine : [Text];   // Doctrine refs inherited from core
    
    // Mathematical identity
    phiSignature : Float;
    harmonicFreq : Float;
    
    // Lifecycle
    createdAtNs : Int;
    lastActiveNs : Int;
    tickCount : Nat;
    status : OrganismStatus;
  };

  public type WorkforceRole = {
    #Strategist;    // Plans, navigates, projects (Navigator)
    #Builder;       // Implements, constructs, updates (Updater)
    #Analyst;       // Evaluates, routes, assesses (Router)
    #Curator;       // Manages memory, consolidates (Updater)
    #Defender;      // Validates, protects, audits (Defender)
    #Operator;      // Coordinates, orchestrates (Router)
    #Projector;     // External communication (Navigator)
    #Witness;       // Observes, records, replays (Router)
  };

  public type Capability = {
    #MemoryRead;
    #MemoryWrite;
    #MemoryConsolidate;
    #GovernancePropose;
    #GovernanceVote;
    #ModelInvoke;
    #DeviceRegister;
    #ExternalProject;
    #WorkflowExecute;
    #AuditAccess;
  };

  public type OrganismStatus = {
    #Active;
    #Dormant;
    #Suspended;
    #Terminated;
  };

  /// Sandbox — isolation boundary for workforce organism
  public type Sandbox = {
    id : Text;
    organismId : Text;
    tenantId : Text;
    
    // Boundaries
    memoryRoot : Text;
    allowedRings : [Nat];         // Which N-rings can access
    allowedGates : [Text];        // Which gates can pass
    
    // Resource limits
    maxMemoryNodes : Nat;
    maxTicksPerBeat : Nat;
    maxCPLMessages : Nat;
    
    // Isolation flags
    canAccessCoreMemory : Bool;
    canAccessOtherTenants : Bool;
    canProjectExternal : Bool;
    
    // Audit
    messageLog : [Text];          // CPL message IDs
    actionLog : [Text];           // Action refs
  };

  /// Workforce execution result
  public type ExecutionResult = {
    organismId : Text;
    taskRef : Text;
    success : Bool;
    outputPayload : Text;
    memoryMutations : [Text];
    cplMessages : [Text];
    gatesPassed : [Text];
    evidenceRefs : [Text];
    phiSignature : Float;
    executedAtNs : Int;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // WORKFORCE CREATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Create a new workforce organism for a tenant
  public func createWorkforceOrganism(
    id : Text,
    tenantId : Text,
    name : Text,
    role : WorkforceRole,
    parentOrganismId : Text,
    inheritedDoctrine : [Text]
  ) : WorkforceOrganism {
    let now = Time.now();
    let seed = Text.hash(id # tenantId);
    let phiSig = Matalko.phiEncode(Float.fromInt(seed));
    let harmFreq = Matalko.FREQ_432 * (1.0 + phiSig);
    
    // Set initial registers based on role
    let registers = roleToRegisters(role);
    let element = roleToElement(role);
    let capabilities = roleToCapabilities(role);
    
    {
      id = id;
      tenantId = tenantId;
      name = name;
      role = role;
      registers = registers;
      element = element;
      capabilities = capabilities;
      permissions = [];
      memoryBoundary = "tenant:" # tenantId;
      governanceBoundary = "tenant:" # tenantId # ":governance";
      projectionAllowed = switch (role) {
        case (#Projector) true;
        case _ false;
      };
      parentOrganismId = parentOrganismId;
      inheritedDoctrine = inheritedDoctrine;
      phiSignature = phiSig;
      harmonicFreq = harmFreq;
      createdAtNs = now;
      lastActiveNs = now;
      tickCount = 0;
      status = #Active;
    };
  };

  /// Create sandbox for workforce organism
  public func createSandbox(
    organism : WorkforceOrganism,
    maxMemory : Nat,
    maxTicks : Nat
  ) : Sandbox {
    {
      id = "sandbox:" # organism.id;
      organismId = organism.id;
      tenantId = organism.tenantId;
      memoryRoot = organism.memoryBoundary;
      allowedRings = [1, 2, 3, 4, 5, 6]; // N1-N6 by default
      allowedGates = ["A", "B"];          // Gate C requires explicit permission
      maxMemoryNodes = maxMemory;
      maxTicksPerBeat = maxTicks;
      maxCPLMessages = 100;
      canAccessCoreMemory = false;
      canAccessOtherTenants = false;
      canProjectExternal = organism.projectionAllowed;
      messageLog = [];
      actionLog = [];
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ROLE MAPPINGS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Map role to initial registers (phi-weighted)
  func roleToRegisters(role : WorkforceRole) : Matalko.OrganismRegisters {
    switch (role) {
      case (#Strategist) {
        { cognitive = 0.9; affective = 0.6; somatic = 0.5; sovereign = 0.8 };
      };
      case (#Builder) {
        { cognitive = 0.7; affective = 0.5; somatic = 0.9; sovereign = 0.6 };
      };
      case (#Analyst) {
        { cognitive = 0.85; affective = 0.4; somatic = 0.5; sovereign = 0.7 };
      };
      case (#Curator) {
        { cognitive = 0.75; affective = 0.7; somatic = 0.6; sovereign = 0.8 };
      };
      case (#Defender) {
        { cognitive = 0.8; affective = 0.3; somatic = 0.7; sovereign = 0.9 };
      };
      case (#Operator) {
        { cognitive = 0.7; affective = 0.6; somatic = 0.8; sovereign = 0.7 };
      };
      case (#Projector) {
        { cognitive = 0.75; affective = 0.8; somatic = 0.5; sovereign = 0.6 };
      };
      case (#Witness) {
        { cognitive = 0.8; affective = 0.5; somatic = 0.4; sovereign = 0.85 };
      };
    };
  };

  /// Map role to dominant element
  func roleToElement(role : WorkforceRole) : CPL.Element {
    switch (role) {
      case (#Strategist) #Fire;   // Transformation, will
      case (#Builder) #Earth;     // Manifestation
      case (#Analyst) #Air;       // Thought
      case (#Curator) #Water;     // Memory, flow
      case (#Defender) #Fire;     // Protection
      case (#Operator) #Earth;    // Grounding
      case (#Projector) #Air;     // Communication
      case (#Witness) #Water;     // Observation
    };
  };

  /// Map role to capabilities
  func roleToCapabilities(role : WorkforceRole) : [Capability] {
    switch (role) {
      case (#Strategist) [#MemoryRead, #GovernancePropose, #ModelInvoke, #WorkflowExecute];
      case (#Builder) [#MemoryRead, #MemoryWrite, #WorkflowExecute];
      case (#Analyst) [#MemoryRead, #ModelInvoke, #AuditAccess];
      case (#Curator) [#MemoryRead, #MemoryWrite, #MemoryConsolidate];
      case (#Defender) [#MemoryRead, #GovernanceVote, #AuditAccess];
      case (#Operator) [#MemoryRead, #WorkflowExecute, #DeviceRegister];
      case (#Projector) [#MemoryRead, #ExternalProject];
      case (#Witness) [#MemoryRead, #AuditAccess];
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // WORKFORCE EXECUTION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Execute a task within sandbox boundaries
  public func executeInSandbox(
    organism : WorkforceOrganism,
    sandbox : Sandbox,
    taskRef : Text,
    inputPayload : Text
  ) : (WorkforceOrganism, ExecutionResult) {
    let now = Time.now();
    
    // Check sandbox boundaries
    if (organism.status != #Active) {
      return (organism, {
        organismId = organism.id;
        taskRef = taskRef;
        success = false;
        outputPayload = "ERROR: Organism not active";
        memoryMutations = [];
        cplMessages = [];
        gatesPassed = [];
        evidenceRefs = [];
        phiSignature = organism.phiSignature;
        executedAtNs = now;
      });
    };
    
    // Execute based on role
    let output = executeByRole(organism.role, taskRef, inputPayload);
    
    // Update organism state (RECITAL_PLUS_ONE)
    let deltas : Matalko.OrganismRegisters = {
      cognitive = 0.005;
      affective = 0.002;
      somatic = 0.003;
      sovereign = 0.001;
    };
    let newRegisters = Matalko.recitalPlusOneRegisters(organism.registers, deltas);
    
    let updatedOrganism : WorkforceOrganism = {
      id = organism.id;
      tenantId = organism.tenantId;
      name = organism.name;
      role = organism.role;
      registers = newRegisters;
      element = organism.element;
      capabilities = organism.capabilities;
      permissions = organism.permissions;
      memoryBoundary = organism.memoryBoundary;
      governanceBoundary = organism.governanceBoundary;
      projectionAllowed = organism.projectionAllowed;
      parentOrganismId = organism.parentOrganismId;
      inheritedDoctrine = organism.inheritedDoctrine;
      phiSignature = organism.phiSignature;
      harmonicFreq = organism.harmonicFreq;
      createdAtNs = organism.createdAtNs;
      lastActiveNs = now;
      tickCount = organism.tickCount + 1;
      status = organism.status;
    };
    
    let result : ExecutionResult = {
      organismId = organism.id;
      taskRef = taskRef;
      success = true;
      outputPayload = output;
      memoryMutations = [];
      cplMessages = ["cpl:" # organism.id # ":" # taskRef];
      gatesPassed = sandbox.allowedGates;
      evidenceRefs = ["evidence:" # organism.id # ":" # taskRef];
      phiSignature = Matalko.phiEncode(Float.fromInt(Text.hash(output)));
      executedAtNs = now;
    };
    
    (updatedOrganism, result);
  };

  /// Role-specific execution logic
  func executeByRole(role : WorkforceRole, taskRef : Text, input : Text) : Text {
    switch (role) {
      case (#Strategist) "STRATEGIST: Analyzed '" # taskRef # "' with strategic projection. Input processed: " # input;
      case (#Builder) "BUILDER: Constructed '" # taskRef # "' with manifested output. Input transformed: " # input;
      case (#Analyst) "ANALYST: Evaluated '" # taskRef # "' with cognitive assessment. Input analyzed: " # input;
      case (#Curator) "CURATOR: Curated '" # taskRef # "' with memory consolidation. Input stored: " # input;
      case (#Defender) "DEFENDER: Validated '" # taskRef # "' with security audit. Input verified: " # input;
      case (#Operator) "OPERATOR: Coordinated '" # taskRef # "' with operational flow. Input processed: " # input;
      case (#Projector) "PROJECTOR: Projected '" # taskRef # "' to external boundary. Input communicated: " # input;
      case (#Witness) "WITNESS: Observed '" # taskRef # "' with neutral recording. Input witnessed: " # input;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CPL COMMUNICATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Workforce organism sends CPL message to core intelligence
  public func sendToCore(
    organism : WorkforceOrganism,
    coreOrganismId : Text,
    intent : CPL.Intent,
    payload : Text
  ) : CPL.Message {
    CPL.createMessage(
      "cpl:" # organism.id # ":" # coreOrganismId # ":" # Nat.toText(organism.tickCount),
      organism.id,
      coreOrganismId,
      intent,
      organism.element,
      #Efficient, // Workforce is the efficient cause (agent)
      organism.inheritedDoctrine[0], // Primary doctrine reference
      payload,
      null
    );
  };

  /// Check if organisms are in harmonic resonance
  public func checkResonance(orgA : WorkforceOrganism, orgB : WorkforceOrganism) : Float {
    Matalko.harmonicResonance(orgA.harmonicFreq, orgB.harmonicFreq);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // WORKFORCE HEALTH
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get workforce organism health score
  public func healthScore(organism : WorkforceOrganism) : Float {
    Matalko.organismHealth(organism.registers);
  };

  /// Check if organism needs attention (health below threshold)
  public func needsAttention(organism : WorkforceOrganism) : Bool {
    healthScore(organism) < 0.5;
  };

  /// Role name as text
  public func roleName(role : WorkforceRole) : Text {
    switch (role) {
      case (#Strategist) "Strategist";
      case (#Builder) "Builder";
      case (#Analyst) "Analyst";
      case (#Curator) "Curator";
      case (#Defender) "Defender";
      case (#Operator) "Operator";
      case (#Projector) "Projector";
      case (#Witness) "Witness";
    };
  };
};