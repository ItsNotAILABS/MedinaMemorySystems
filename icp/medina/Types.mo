import Time "mo:base/Time";

module {
  public type Register = {
    founder : Text;
    builder : Text;
    organism : Text;
    external : Text;
  };

  public type DualReadStatus = {
    semantic : Bool;
    resonance : Bool;
  };

  public type GateStatus = {
    a : Bool;
    b : Bool;
    c : Bool;
  };

  public type Coordinates = {
    theta : Float;
    phi : Float;
    depth : Nat;
    ring : Nat;
    beat : Nat;
  };

  public type Lineage = {
    parent : ?Text;
    recital : Text;
    lawfulExpansion : Text;
  };

  public type MemoryNode = {
    id : Text;
    payload : Text;
    coords : Coordinates;
    lineage : Lineage;
    salience : Nat;
    doctrineTags : [Text];
    promoted : Bool;
    consolidatedFrom : [Text];
    createdAtNs : Int;
  };

  public type ProposalStatus = {
    #Pending;
    #Accepted;
    #Rejected;
  };

  public type GovernanceProposal = {
    id : Text;
    proposalType : Text;
    payloadRef : Text;
    registers : Register;
    lineage : Lineage;
    dualRead : DualReadStatus;
    gateSnapshot : GateStatus;
    status : ProposalStatus;
    evidenceRefs : [Text];
    createdAtNs : Int;
  };

  public type OnboardingMode = {
    #Connect;
    #Internalize;
    #Hybrid;
  };

  public type Tenant = {
    id : Text;
    mode : OnboardingMode;
    isolated : Bool;
    policyRefs : [Text];
    replayRefs : [Text];
    createdAtNs : Int;
  };

  public type ModelFamily = {
    #Strategist;
    #Builder;
    #Analyst;
    #Governance;
    #MemoryCurator;
    #Operations;
    #Defense;
    #Projection;
  };

  public type ModelRoute = {
    family : ModelFamily;
    rationale : Text;
    fallbackSource : ?Text;
    incidentRef : ?Text;
  };

  // ========== RUDN Model Engine Types ==========
  
  // Role-specialized engine types per MEDINA architecture
  public type EngineRole = {
    #Router;     // R - Routes tasks to appropriate handlers
    #Updater;    // U - Updates state, memory, governance
    #Defender;   // D - Defense, risk assessment, safety checks
    #Navigator;  // N - Navigation, pathfinding, projection
  };

  public type EngineCapability = {
    #ReadOnly;
    #WriteWithGate;
    #FullMutation;
  };

  public type EngineExecutionStatus = {
    #Completed;
    #Blocked;
    #Fallback;
    #Error;
  };

  public type EngineInvocation = {
    id : Text;
    role : EngineRole;
    family : ModelFamily;
    taskRef : Text;
    contextMemoryId : ?Text;
    inputPayload : Text;
    capability : EngineCapability;
    createdAtNs : Int;
  };

  public type EngineResult = {
    invocationId : Text;
    status : EngineExecutionStatus;
    outputPayload : Text;
    dualRead : DualReadStatus;
    gates : GateStatus;
    memoryMutations : [Text];
    evidenceRefs : [Text];
    fallbackReason : ?Text;
    executedAtNs : Int;
  };

  // ========== Work Packet/Workflow Types ==========

  public type PacketStatus = {
    #Draft;
    #Open;
    #InProgress;
    #AwaitingGate;
    #Completed;
    #Rejected;
    #Cancelled;
  };

  public type WorkPacket = {
    id : Text;
    title : Text;
    taskRef : Text;
    assignedEngine : ?EngineRole;
    assignedFamily : ?ModelFamily;
    status : PacketStatus;
    inputPayload : Text;
    outputPayload : ?Text;
    registers : Register;
    lineage : Lineage;
    dualRead : DualReadStatus;
    gates : GateStatus;
    evidenceRefs : [Text];
    parentPacketId : ?Text;
    childPacketIds : [Text];
    createdAtNs : Int;
    updatedAtNs : Int;
  };

  public type WorkflowStepType = {
    #Route;
    #Execute;
    #Validate;
    #GateCheck;
    #Branch;
    #Merge;
    #Complete;
  };

  public type WorkflowStep = {
    id : Text;
    stepType : WorkflowStepType;
    engineRole : ?EngineRole;
    taskRef : Text;
    inputRefs : [Text];
    outputRef : ?Text;
    gateRequired : Bool;
    completed : Bool;
  };

  public type WorkflowStatus = {
    #Pending;
    #Running;
    #AwaitingGate;
    #Completed;
    #Failed;
    #Rolled_Back;
  };

  public type Workflow = {
    id : Text;
    name : Text;
    steps : [WorkflowStep];
    currentStepIndex : Nat;
    status : WorkflowStatus;
    packets : [Text];
    lineage : Lineage;
    evidenceRefs : [Text];
    createdAtNs : Int;
    updatedAtNs : Int;
  };

  public type WorkflowResult = {
    workflowId : Text;
    status : WorkflowStatus;
    completedSteps : Nat;
    totalSteps : Nat;
    outputPayload : ?Text;
    gates : GateStatus;
    evidenceRefs : [Text];
    executedAtNs : Int;
  };

  // ========== Command Types ==========

  public type Command = {
    #MemoryFind : { query : Text; ring : ?Nat; depth : ?Nat; lineage : ?Text };
    #MemoryPin : { memoryId : Text; reason : ?Text };
    #MemoryMap : { memoryId : Text; mode : Text };
    #GovernStatus : { proposalId : ?Text };
    #GovernPropose : { proposalType : Text; payloadRef : Text };
    #GovernApprove : { proposalId : Text; policy : ?Text };
    #ModelInvoke : { family : ModelFamily; taskRef : Text; contextMemory : ?Text };
    #ModelRoute : { taskRef : Text; policy : ?Text };
    #WorkspaceOpen : { packetId : Text };
    #CompanyOnboard : { tenantId : Text; mode : OnboardingMode };
    #CompanyConnect : { tenantId : Text; connectorRef : Text };
    #CompanyInternalize : { tenantId : Text; domainRef : Text };
    #CompanyHybrid : { tenantId : Text; planRef : Text };
    #ReplayShow : { workflowOrBundleId : Text };
    #Run : { workflowRef : Text };
  };

  public type CommandResult = {
    status : { #Ok; #Blocked; #Error };
    message : Text;
    lineageId : ?Text;
    gates : ?GateStatus;
    evidenceRefs : [Text];
  };

  public type BeatSummary = {
    beat : Nat;
    macroAbsorbed : Bool;
    orphanMicroSignals : Nat;
    dualRead : DualReadStatus;
    lawEpoch : Nat;
    gates : GateStatus;
    replayRef : Text;
    atNs : Int;
  };

  public func nowNs() : Int {
    Time.now()
  };
};
