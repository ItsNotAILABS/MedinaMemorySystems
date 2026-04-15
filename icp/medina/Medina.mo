import Array "mo:base/Array";
import Nat "mo:base/Nat";
import T "./Types";
import Law "./LawEngine";
import MemoryTemple "./MemoryTemple";
import Governance "./Governance";
import ModelRouter "./ModelRouter";
import Company "./Company";
import Orchestrators "./Orchestrators";

actor Medina {
  stable var beat : Nat = 0;
  stable var lawEpoch : Nat = 0;

  stable var memoryNodes : [T.MemoryNode] = [];
  stable var proposals : [T.GovernanceProposal] = [];
  stable var tenants : [T.Tenant] = [];
  stable var replayRefs : [Text] = [];

  private func nextId(prefix : Text, n : Nat) : Text {
    prefix # "-" # Nat.toText(n + 1);
  };

  public query func ontology() : async [Text] {
    Law.nonCollapseOntologyInvariant();
  };

  public query func orchestratorRegistry() : async [Orchestrators.Orchestrator] {
    Orchestrators.registry;
  };

  public func sovereignBeat(
    dualRead : T.DualReadStatus,
    orphanMicroSignals : Nat,
    workforceReady : Bool,
    projectionSafe : Bool,
  ) : async T.BeatSummary {
    beat += 1;
    // H6 law epoch normalization: one authoritative law-write epoch per beat.
    lawEpoch += 1;

    let gates = Orchestrators.evaluateBeat(dualRead, orphanMicroSignals, workforceReady, projectionSafe, true);
    let replayRef = "replay:beat:" # Nat.toText(beat);
    replayRefs := Array.append(replayRefs, [replayRef]);

    {
      beat = beat;
      macroAbsorbed = orphanMicroSignals == 0;
      orphanMicroSignals = orphanMicroSignals;
      dualRead = dualRead;
      lawEpoch = lawEpoch;
      gates = gates;
      replayRef = replayRef;
      atNs = T.nowNs();
    };
  };

  public func memoryAdd(
    payload : Text,
    coords : T.Coordinates,
    recital : Text,
    lawfulExpansion : Text,
    salience : Nat,
    doctrineTags : [Text],
  ) : async T.MemoryNode {
    let id = nextId("mem", Array.size(memoryNodes));
    let lineage = Law.recitalPlusOne(recital, lawfulExpansion);
    let node : T.MemoryNode = {
      id = id;
      payload = payload;
      coords = coords;
      lineage = lineage;
      salience = salience;
      doctrineTags = doctrineTags;
      promoted = false;
      consolidatedFrom = [];
      createdAtNs = T.nowNs();
    };

    memoryNodes := Array.append(memoryNodes, [node]);
    node;
  };

  public query func memoryFind(query : Text, ring : ?Nat, depth : ?Nat, lineage : ?Text) : async [T.MemoryNode] {
    MemoryTemple.find(memoryNodes, query, ring, depth, lineage);
  };

  public func memoryPromote(memoryId : Text) : async Bool {
    var found = false;
    memoryNodes := Array.map<T.MemoryNode, T.MemoryNode>(
      memoryNodes,
      func(n : T.MemoryNode) : T.MemoryNode {
        if (n.id == memoryId) {
          found := true;
          MemoryTemple.promote(n);
        } else {
          n;
        };
      },
    );
    found;
  };

  public func memoryConsolidate(targetId : Text, sourceIds : [Text], fromId : Text) : async ?T.MemoryNode {
    var source : ?T.MemoryNode = null;
    for (n in memoryNodes.vals()) {
      if (n.id == fromId) {
        source := ?n;
      };
    };

    switch (source) {
      case null null;
      case (?s) {
        let merged = MemoryTemple.consolidate(targetId, sourceIds, s);
        memoryNodes := Array.append(memoryNodes, [merged]);
        ?merged;
      };
    };
  };

  public func governPropose(
    proposalType : Text,
    payloadRef : Text,
    registers : T.Register,
    recital : Text,
    lawfulExpansion : Text,
    dualRead : T.DualReadStatus,
    gateSnapshot : T.GateStatus,
  ) : async T.GovernanceProposal {
    let id = nextId("proposal", Array.size(proposals));
    let lineage = Law.recitalPlusOne(recital, lawfulExpansion);
    let p = Governance.newProposal(id, proposalType, payloadRef, registers, lineage, dualRead, gateSnapshot);
    proposals := Array.append(proposals, [p]);
    p;
  };

  public func governApprove(proposalId : Text, policy : ?Text) : async ?T.GovernanceProposal {
    var approved : ?T.GovernanceProposal = null;
    proposals := Array.map<T.GovernanceProposal, T.GovernanceProposal>(
      proposals,
      func(p : T.GovernanceProposal) : T.GovernanceProposal {
        if (p.id == proposalId) {
          let a = Governance.approve(p, policy);
          approved := ?a;
          a;
        } else {
          p;
        };
      },
    );
    approved;
  };

  public query func governStatus(proposalId : ?Text) : async Text {
    switch (proposalId) {
      case null {
        "proposals=" # Nat.toText(Array.size(proposals));
      };
      case (?pid) {
        var status : Text = "not-found";
        for (p in proposals.vals()) {
          if (p.id == pid) {
            status := Governance.statusText(p);
          };
        };
        status;
      };
    };
  };

  public func companyOnboard(tenantId : Text, mode : T.OnboardingMode, policyRefs : [Text]) : async T.Tenant {
    let t = Company.onboard(tenantId, mode, policyRefs);
    tenants := Array.append(tenants, [t]);
    t;
  };

  public query func modelRoute(taskRef : Text, policy : ?Text) : async T.ModelRoute {
    ModelRouter.routeForTask(taskRef, policy);
  };

  public query func replayShow(id : Text) : async [Text] {
    Array.filter<Text>(replayRefs, func(r : Text) : Bool { r == id });
  };

  // Universal control-plane command executor (typed command AST form).
  public func runCommand(cmd : T.Command) : async T.CommandResult {
    switch (cmd) {
      case (#MemoryFind c) {
        let results = MemoryTemple.find(memoryNodes, c.query, c.ring, c.depth, c.lineage);
        {
          status = #Ok;
          message = "memory.find results=" # Nat.toText(Array.size(results));
          lineageId = null;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#MemoryPin c) {
        {
          status = #Ok;
          message = "memory.pin " # c.memoryId;
          lineageId = ?c.memoryId;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#MemoryMap c) {
        {
          status = #Ok;
          message = "memory.map " # c.memoryId # " mode=" # c.mode;
          lineageId = ?c.memoryId;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#GovernStatus c) {
        {
          status = #Ok;
          message = await governStatus(c.proposalId);
          lineageId = null;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#GovernPropose c) {
        {
          status = #Ok;
          message = "govern.propose " # c.proposalType # " payload=" # c.payloadRef;
          lineageId = null;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#GovernApprove c) {
        {
          status = #Ok;
          message = "govern.approve " # c.proposalId;
          lineageId = ?c.proposalId;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#ModelInvoke c) {
        {
          status = #Ok;
          message = "model.invoke task=" # c.taskRef;
          lineageId = null;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#ModelRoute c) {
        {
          status = #Ok;
          message = "model.route task=" # c.taskRef;
          lineageId = null;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#WorkspaceOpen c) {
        {
          status = #Ok;
          message = "workspace.open packet=" # c.packetId;
          lineageId = ?c.packetId;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#CompanyOnboard c) {
        {
          status = #Ok;
          message = "company.onboard tenant=" # c.tenantId;
          lineageId = ?c.tenantId;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#CompanyConnect c) {
        {
          status = #Ok;
          message = "company.connect tenant=" # c.tenantId # " connector=" # c.connectorRef;
          lineageId = ?c.tenantId;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#CompanyInternalize c) {
        {
          status = #Ok;
          message = "company.internalize tenant=" # c.tenantId # " domain=" # c.domainRef;
          lineageId = ?c.tenantId;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#CompanyHybrid c) {
        {
          status = #Ok;
          message = "company.hybrid tenant=" # c.tenantId # " plan=" # c.planRef;
          lineageId = ?c.tenantId;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#ReplayShow c) {
        {
          status = #Ok;
          message = "replay.show " # c.workflowOrBundleId;
          lineageId = ?c.workflowOrBundleId;
          gates = null;
          evidenceRefs = [c.workflowOrBundleId];
        };
      };
      case (#Run c) {
        {
          status = #Ok;
          message = "run " # c.workflowRef;
          lineageId = ?c.workflowRef;
          gates = null;
          evidenceRefs = ["workflow:" # c.workflowRef];
        };
      };
    };
  };
};
