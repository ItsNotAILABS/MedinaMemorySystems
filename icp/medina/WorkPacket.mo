import Array "mo:base/Array";
import Nat "mo:base/Nat";
import T "./Types";
import Law "./LawEngine";

/// WorkPacket provides work packet and workflow management contracts.
/// Implements packet lifecycle, workflow orchestration, and gate validation.
module {

  // ========== Work Packet Operations ==========

  /// Create a new work packet in Draft status.
  public func createPacket(
    id : Text,
    title : Text,
    taskRef : Text,
    inputPayload : Text,
    registers : T.Register,
    parentPacketId : ?Text,
  ) : T.WorkPacket {
    let lineage : T.Lineage = {
      parent = parentPacketId;
      recital = switch (parentPacketId) {
        case null "genesis";
        case (?pid) pid;
      };
      lawfulExpansion = "packet:" # id;
    };
    
    {
      id = id;
      title = title;
      taskRef = taskRef;
      assignedEngine = null;
      assignedFamily = null;
      status = #Draft;
      inputPayload = inputPayload;
      outputPayload = null;
      registers = registers;
      lineage = lineage;
      dualRead = { semantic = false; resonance = false };
      gates = { a = false; b = false; c = false };
      evidenceRefs = ["created:" # id];
      parentPacketId = parentPacketId;
      childPacketIds = [];
      createdAtNs = T.nowNs();
      updatedAtNs = T.nowNs();
    };
  };

  /// Open a packet for work (transition from Draft to Open).
  public func openPacket(packet : T.WorkPacket) : T.WorkPacket {
    if (packet.status != #Draft) {
      return packet;
    };
    
    {
      id = packet.id;
      title = packet.title;
      taskRef = packet.taskRef;
      assignedEngine = packet.assignedEngine;
      assignedFamily = packet.assignedFamily;
      status = #Open;
      inputPayload = packet.inputPayload;
      outputPayload = packet.outputPayload;
      registers = packet.registers;
      lineage = packet.lineage;
      dualRead = packet.dualRead;
      gates = packet.gates;
      evidenceRefs = Array.append(packet.evidenceRefs, ["opened:" # packet.id]);
      parentPacketId = packet.parentPacketId;
      childPacketIds = packet.childPacketIds;
      createdAtNs = packet.createdAtNs;
      updatedAtNs = T.nowNs();
    };
  };

  /// Assign an engine to the packet.
  public func assignEngine(
    packet : T.WorkPacket,
    engine : T.EngineRole,
    family : T.ModelFamily,
  ) : T.WorkPacket {
    {
      id = packet.id;
      title = packet.title;
      taskRef = packet.taskRef;
      assignedEngine = ?engine;
      assignedFamily = ?family;
      status = #InProgress;
      inputPayload = packet.inputPayload;
      outputPayload = packet.outputPayload;
      registers = packet.registers;
      lineage = packet.lineage;
      dualRead = packet.dualRead;
      gates = packet.gates;
      evidenceRefs = Array.append(packet.evidenceRefs, ["assigned:" # packet.id]);
      parentPacketId = packet.parentPacketId;
      childPacketIds = packet.childPacketIds;
      createdAtNs = packet.createdAtNs;
      updatedAtNs = T.nowNs();
    };
  };

  /// Update packet with gate check results.
  public func updateGates(
    packet : T.WorkPacket,
    dualRead : T.DualReadStatus,
    gates : T.GateStatus,
  ) : T.WorkPacket {
    let newStatus = if (gates.a and gates.b and gates.c) {
      packet.status;
    } else {
      #AwaitingGate;
    };
    
    {
      id = packet.id;
      title = packet.title;
      taskRef = packet.taskRef;
      assignedEngine = packet.assignedEngine;
      assignedFamily = packet.assignedFamily;
      status = newStatus;
      inputPayload = packet.inputPayload;
      outputPayload = packet.outputPayload;
      registers = packet.registers;
      lineage = packet.lineage;
      dualRead = dualRead;
      gates = gates;
      evidenceRefs = Array.append(packet.evidenceRefs, ["gatecheck:" # packet.id]);
      parentPacketId = packet.parentPacketId;
      childPacketIds = packet.childPacketIds;
      createdAtNs = packet.createdAtNs;
      updatedAtNs = T.nowNs();
    };
  };

  /// Complete a packet with output.
  public func completePacket(
    packet : T.WorkPacket,
    outputPayload : Text,
    evidenceRef : Text,
  ) : T.WorkPacket {
    {
      id = packet.id;
      title = packet.title;
      taskRef = packet.taskRef;
      assignedEngine = packet.assignedEngine;
      assignedFamily = packet.assignedFamily;
      status = #Completed;
      inputPayload = packet.inputPayload;
      outputPayload = ?outputPayload;
      registers = packet.registers;
      lineage = packet.lineage;
      dualRead = packet.dualRead;
      gates = packet.gates;
      evidenceRefs = Array.append(packet.evidenceRefs, [evidenceRef, "completed:" # packet.id]);
      parentPacketId = packet.parentPacketId;
      childPacketIds = packet.childPacketIds;
      createdAtNs = packet.createdAtNs;
      updatedAtNs = T.nowNs();
    };
  };

  /// Reject a packet.
  public func rejectPacket(packet : T.WorkPacket, reason : Text) : T.WorkPacket {
    {
      id = packet.id;
      title = packet.title;
      taskRef = packet.taskRef;
      assignedEngine = packet.assignedEngine;
      assignedFamily = packet.assignedFamily;
      status = #Rejected;
      inputPayload = packet.inputPayload;
      outputPayload = ?("REJECTED: " # reason);
      registers = packet.registers;
      lineage = packet.lineage;
      dualRead = packet.dualRead;
      gates = packet.gates;
      evidenceRefs = Array.append(packet.evidenceRefs, ["rejected:" # packet.id # ":" # reason]);
      parentPacketId = packet.parentPacketId;
      childPacketIds = packet.childPacketIds;
      createdAtNs = packet.createdAtNs;
      updatedAtNs = T.nowNs();
    };
  };

  /// Validate a packet's registers.
  public func validateRegisters(packet : T.WorkPacket) : Bool {
    Law.validateRegisters(packet.registers);
  };

  /// Check if packet passes all gates.
  public func passesAllGates(packet : T.WorkPacket) : Bool {
    packet.gates.a and packet.gates.b and packet.gates.c;
  };

  // ========== Workflow Operations ==========

  /// Create a new workflow.
  public func createWorkflow(
    id : Text,
    name : Text,
    steps : [T.WorkflowStep],
  ) : T.Workflow {
    let lineage : T.Lineage = {
      parent = null;
      recital = "workflow:" # id;
      lawfulExpansion = "create";
    };
    
    {
      id = id;
      name = name;
      steps = steps;
      currentStepIndex = 0;
      status = #Pending;
      packets = [];
      lineage = lineage;
      evidenceRefs = ["workflow:created:" # id];
      createdAtNs = T.nowNs();
      updatedAtNs = T.nowNs();
    };
  };

  /// Create a workflow step.
  public func createStep(
    id : Text,
    stepType : T.WorkflowStepType,
    engineRole : ?T.EngineRole,
    taskRef : Text,
    gateRequired : Bool,
  ) : T.WorkflowStep {
    {
      id = id;
      stepType = stepType;
      engineRole = engineRole;
      taskRef = taskRef;
      inputRefs = [];
      outputRef = null;
      gateRequired = gateRequired;
      completed = false;
    };
  };

  /// Start workflow execution.
  public func startWorkflow(workflow : T.Workflow) : T.Workflow {
    if (workflow.status != #Pending) {
      return workflow;
    };
    
    {
      id = workflow.id;
      name = workflow.name;
      steps = workflow.steps;
      currentStepIndex = 0;
      status = #Running;
      packets = workflow.packets;
      lineage = workflow.lineage;
      evidenceRefs = Array.append(workflow.evidenceRefs, ["workflow:started:" # workflow.id]);
      createdAtNs = workflow.createdAtNs;
      updatedAtNs = T.nowNs();
    };
  };

  /// Advance workflow to next step.
  public func advanceStep(
    workflow : T.Workflow,
    stepOutput : Text,
    packetId : ?Text,
  ) : T.Workflow {
    let currentIdx = workflow.currentStepIndex;
    let numSteps = Array.size(workflow.steps);
    
    if (currentIdx >= numSteps) {
      return workflow;
    };
    
    // Mark current step as completed
    let updatedSteps = Array.mapEntries<T.WorkflowStep, T.WorkflowStep>(
      workflow.steps,
      func(step : T.WorkflowStep, idx : Nat) : T.WorkflowStep {
        if (idx == currentIdx) {
          {
            id = step.id;
            stepType = step.stepType;
            engineRole = step.engineRole;
            taskRef = step.taskRef;
            inputRefs = step.inputRefs;
            outputRef = ?stepOutput;
            gateRequired = step.gateRequired;
            completed = true;
          };
        } else {
          step;
        };
      }
    );
    
    let newPackets = switch (packetId) {
      case null workflow.packets;
      case (?pid) Array.append(workflow.packets, [pid]);
    };
    
    let nextIdx = currentIdx + 1;
    let newStatus = if (nextIdx >= numSteps) #Completed else #Running;
    
    {
      id = workflow.id;
      name = workflow.name;
      steps = updatedSteps;
      currentStepIndex = nextIdx;
      status = newStatus;
      packets = newPackets;
      lineage = workflow.lineage;
      evidenceRefs = Array.append(workflow.evidenceRefs, ["workflow:step:" # Nat.toText(currentIdx)]);
      createdAtNs = workflow.createdAtNs;
      updatedAtNs = T.nowNs();
    };
  };

  /// Set workflow to awaiting gate status.
  public func awaitGate(workflow : T.Workflow) : T.Workflow {
    {
      id = workflow.id;
      name = workflow.name;
      steps = workflow.steps;
      currentStepIndex = workflow.currentStepIndex;
      status = #AwaitingGate;
      packets = workflow.packets;
      lineage = workflow.lineage;
      evidenceRefs = Array.append(workflow.evidenceRefs, ["workflow:awaiting:" # workflow.id]);
      createdAtNs = workflow.createdAtNs;
      updatedAtNs = T.nowNs();
    };
  };

  /// Fail a workflow.
  public func failWorkflow(workflow : T.Workflow, reason : Text) : T.Workflow {
    {
      id = workflow.id;
      name = workflow.name;
      steps = workflow.steps;
      currentStepIndex = workflow.currentStepIndex;
      status = #Failed;
      packets = workflow.packets;
      lineage = workflow.lineage;
      evidenceRefs = Array.append(workflow.evidenceRefs, ["workflow:failed:" # workflow.id # ":" # reason]);
      createdAtNs = workflow.createdAtNs;
      updatedAtNs = T.nowNs();
    };
  };

  /// Get workflow completion percentage.
  public func completionPercent(workflow : T.Workflow) : Nat {
    let total = Array.size(workflow.steps);
    if (total == 0) { return 100; };
    
    var completed = 0;
    for (step in workflow.steps.vals()) {
      if (step.completed) {
        completed += 1;
      };
    };
    
    (completed * 100) / total;
  };

  /// Build a workflow result summary.
  public func buildResult(
    workflow : T.Workflow,
    outputPayload : ?Text,
    gates : T.GateStatus,
  ) : T.WorkflowResult {
    var completedCount = 0;
    for (step in workflow.steps.vals()) {
      if (step.completed) {
        completedCount += 1;
      };
    };
    
    {
      workflowId = workflow.id;
      status = workflow.status;
      completedSteps = completedCount;
      totalSteps = Array.size(workflow.steps);
      outputPayload = outputPayload;
      gates = gates;
      evidenceRefs = workflow.evidenceRefs;
      executedAtNs = T.nowNs();
    };
  };

  /// Status name helper.
  public func packetStatusName(status : T.PacketStatus) : Text {
    switch (status) {
      case (#Draft) "draft";
      case (#Open) "open";
      case (#InProgress) "in-progress";
      case (#AwaitingGate) "awaiting-gate";
      case (#Completed) "completed";
      case (#Rejected) "rejected";
      case (#Cancelled) "cancelled";
    };
  };

  public func workflowStatusName(status : T.WorkflowStatus) : Text {
    switch (status) {
      case (#Pending) "pending";
      case (#Running) "running";
      case (#AwaitingGate) "awaiting-gate";
      case (#Completed) "completed";
      case (#Failed) "failed";
      case (#Rolled_Back) "rolled-back";
    };
  };
};
