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
