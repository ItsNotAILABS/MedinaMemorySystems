import T "./Types";
import Law "./LawEngine";

module {
  public func newProposal(
    id : Text,
    proposalType : Text,
    payloadRef : Text,
    registers : T.Register,
    lineage : T.Lineage,
    dualRead : T.DualReadStatus,
    gateSnapshot : T.GateStatus,
  ) : T.GovernanceProposal {
    {
      id = id;
      proposalType = proposalType;
      payloadRef = payloadRef;
      registers = registers;
      lineage = lineage;
      dualRead = dualRead;
      gateSnapshot = gateSnapshot;
      status = #Pending;
      evidenceRefs = [];
      approvedBy = null;
      createdAtNs = T.nowNs();
    };
  };

  public func approve(p : T.GovernanceProposal, policy : ?Text, actorId : Text) : T.GovernanceProposal {
    let policyEvidence = switch (policy) {
      case null ["policy:none"];
      case (?pid) ["policy:" # pid];
    };

    let allowed =
      Law.validateRegisters(p.registers) and Law.validateDualRead(p.dualRead) and Law.allGatesPass(p.gateSnapshot);

    {
      id = p.id;
      proposalType = p.proposalType;
      payloadRef = p.payloadRef;
      registers = p.registers;
      lineage = p.lineage;
      dualRead = p.dualRead;
      gateSnapshot = p.gateSnapshot;
      status = if (allowed) #Accepted else #Rejected;
      evidenceRefs = policyEvidence;
      approvedBy = ?actorId;
      createdAtNs = p.createdAtNs;
    };
  };

  public func statusText(p : T.GovernanceProposal) : Text {
    switch (p.status) {
      case (#Pending) "pending";
      case (#Accepted) "accepted";
      case (#Rejected) "rejected";
    };
  };
};
