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
    pinned : Bool;
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
    approvedBy : ?Text;
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
    label : Text;
    rationale : Text;
    fallbackSource : ?Text;
    incidentRef : ?Text;
  };

  public type ModelInvocation = {
    id : Text;
    family : ModelFamily;
    taskRef : Text;
    contextMemory : ?Text;
    routeRationale : Text;
    output : Text;
    fallbackSource : ?Text;
    incidentRef : ?Text;
    atNs : Int;
  };

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

  public type PermissionToggle = {
    scope : Text;
    enabled : Bool;
    updatedBy : Text;
    updatedAtNs : Int;
  };

  public type ReplayRecord = {
    id : Text;
    action : Text;
    lineageId : ?Text;
    gates : ?GateStatus;
    evidenceRefs : [Text];
    atNs : Int;
  };

  public type IncidentRecord = {
    id : Text;
    kind : Text;
    detail : Text;
    atNs : Int;
  };

  public type StateSnapshot = {
    id : Text;
    memoryNodes : [MemoryNode];
    proposals : [GovernanceProposal];
    tenants : [Tenant];
    beat : Nat;
    lawEpoch : Nat;
    replayCount : Nat;
    atNs : Int;
  };

  public type WorkspacePacket = {
    id : Text;
    constitution : Text;
    work : Text;
    arbitration : Text;
    integration : Text;
    replayBundle : ?Text;
    atNs : Int;
  };

  public type RuntimeHealth = {
    beat : Nat;
    lawEpoch : Nat;
    memoryCount : Nat;
    proposalCount : Nat;
    tenantCount : Nat;
    replayCount : Nat;
    incidentCount : Nat;
    dualReadHealthy : Bool;
    noOrphanMicroSignals : Bool;
  };

  public type MatalkoSnapshot = {
    macroField : Float;
    dualReadEnergy : Float;
    stability : Float;
    chemistryPotential : Float;
    atNs : Int;
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
    Time.now();
  };
};
