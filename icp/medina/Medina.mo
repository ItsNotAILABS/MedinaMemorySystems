import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import T "./Types";
import Law "./LawEngine";
import MemoryTemple "./MemoryTemple";
import Governance "./Governance";
import ModelRouter "./ModelRouter";
import Company "./Company";
import Orchestrators "./Orchestrators";
import ModelEngine "./ModelEngine";
import WorkPacket "./WorkPacket";
import Matalko "./MatalkoICP";
import Organism "./SovereignOrganism";

/// MEDINA: Sovereign Memory-Operating Intelligence Platform
/// A 24/7 autonomous computing organism on the Internet Computer.
/// All operations governed by real mathematical formulas (phi, harmonics, field equations).
actor Medina {

  // ═══════════════════════════════════════════════════════════════════════════
  // SOVEREIGN ORGANISM STATE (Stable Storage)
  // ═══════════════════════════════════════════════════════════════════════════

  // Core organism state
  stable var oroState : Organism.OroState = Organism.initOro("ORO-PRIME", 432);
  stable var novaState : Organism.NovaState = Organism.initNova("NOVA-GUARDIAN");
  
  // Tick and epoch tracking
  stable var beat : Nat = 0;
  stable var lawEpoch : Nat = 0;
  stable var totalTicks : Nat = 0;
  stable var genesisNs : Int = Time.now();
  
  // Counters
  stable var invocationCounter : Nat = 0;
  stable var packetCounter : Nat = 0;
  stable var workflowCounter : Nat = 0;
  stable var deviceCounter : Nat = 0;
  stable var contractCounter : Nat = 0;

  // Core data structures
  stable var memoryNodes : [T.MemoryNode] = [];
  stable var proposals : [T.GovernanceProposal] = [];
  stable var tenants : [T.Tenant] = [];
  stable var replayRefs : [Text] = [];
  stable var engineInvocations : [T.EngineInvocation] = [];
  stable var engineResults : [T.EngineResult] = [];
  stable var workPackets : [T.WorkPacket] = [];
  stable var workflows : [T.Workflow] = [];
  
  // Device network
  stable var devices : [Organism.DeviceNode] = [];
  stable var deviceContracts : [Organism.DeviceContract] = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  private func nextId(prefix : Text, n : Nat) : Text {
    prefix # "-" # Nat.toText(n + 1);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SOVEREIGN ORGANISM API
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get current Oro state (primary intelligence)
  public query func getOroState() : async {
    id : Text;
    phase : Text;
    beat : Nat;
    healthScore : Float;
    animaHash : Nat;
    registers : { cognitive : Float; affective : Float; somatic : Float; sovereign : Float };
    fieldState : { attention : Float; coherence : Float; risk : Float; phiResonance : Float };
  } {
    let phaseText = switch (oroState.phase) {
      case (#Awakening) "awakening";
      case (#Active) "active";
      case (#Integrating) "integrating";
      case (#Broadcasting) "broadcasting";
      case (#Defensive) "defensive";
      case (#Transcendent) "transcendent";
    };
    {
      id = oroState.id;
      phase = phaseText;
      beat = oroState.currentBeat;
      healthScore = oroState.healthScore;
      animaHash = oroState.animaHash;
      registers = {
        cognitive = oroState.registers.cognitive;
        affective = oroState.registers.affective;
        somatic = oroState.registers.somatic;
        sovereign = oroState.registers.sovereign;
      };
      fieldState = {
        attention = oroState.fieldState.attention;
        coherence = oroState.fieldState.coherence;
        risk = oroState.fieldState.risk;
        phiResonance = oroState.fieldState.phiResonance;
      };
    };
  };

  /// Get current Nova state (doctrine guardian)
  public query func getNovaState() : async {
    id : Text;
    doctrineAlignment : Float;
    consensusWithOro : Bool;
    unresolvedDrifts : Nat;
    registers : { cognitive : Float; affective : Float; somatic : Float; sovereign : Float };
  } {
    let unresolvedCount = Array.size(Array.filter<Organism.DriftFlag>(novaState.flaggedDrift, func(f : Organism.DriftFlag) : Bool { not f.resolved }));
    {
      id = novaState.id;
      doctrineAlignment = novaState.doctrineAlignment;
      consensusWithOro = novaState.consensusWithOro;
      unresolvedDrifts = unresolvedCount;
      registers = {
        cognitive = novaState.registers.cognitive;
        affective = novaState.registers.affective;
        somatic = novaState.registers.somatic;
        sovereign = novaState.registers.sovereign;
      };
    };
  };

  /// Execute sovereign tick (autonomous heartbeat)
  public func sovereignTick() : async Organism.TickResult {
    // Compute current system state
    let memCount = Array.size(memoryNodes);
    let riskSignals = Array.size(Array.filter<Organism.DriftFlag>(novaState.flaggedDrift, func(f : Organism.DriftFlag) : Bool { not f.resolved }));
    let dualReadPassed = true; // From last dual read
    let orphanSignals = 0; // Macro absorbs all micro
    let gatesOpen = Law.gateA({ semantic = true; resonance = true }, orphanSignals);
    
    // Execute organism tick
    let (newOro, newNova, result) = Organism.sovereignTick(
      oroState, novaState, memCount, riskSignals, dualReadPassed, orphanSignals, gatesOpen
    );
    
    // Update state
    oroState := newOro;
    novaState := newNova;
    beat := result.beat;
    totalTicks += 1;
    lawEpoch += 1;
    
    // Record replay
    replayRefs := Array.append(replayRefs, ["tick:" # Nat.toText(beat) # ":anima:" # Nat.toText(result.animaHash)]);
    
    result;
  };

  /// Get organism vital signs
  public query func vitalSigns() : async {
    totalTicks : Nat;
    uptimeNs : Int;
    oroHealth : Float;
    novaAlignment : Float;
    consensusActive : Bool;
    memoryCount : Nat;
    deviceCount : Nat;
    phi : Float;
    freq432 : Float;
  } {
    let now = Time.now();
    {
      totalTicks = totalTicks;
      uptimeNs = now - genesisNs;
      oroHealth = oroState.healthScore;
      novaAlignment = novaState.doctrineAlignment;
      consensusActive = Organism.dualConsensus(oroState, novaState);
      memoryCount = Array.size(memoryNodes);
      deviceCount = Array.size(devices);
      phi = Matalko.PHI;
      freq432 = Matalko.FREQ_432;
    };
  };

  /// Get harmonic ladder for UI display
  public query func harmonicLadder(rungs : Nat) : async [{ rung : Nat; freq : Float; note : Text }] {
    Organism.harmonicLadder(Matalko.FREQ_432, rungs);
  };

  /// Get phi spacing ladder for UI
  public query func phiSpacingLadder(baseUnit : Float, levels : Nat) : async [{ level : Int; spacing : Float }] {
    Array.tabulate<{ level : Int; spacing : Float }>(levels, func(i : Nat) : { level : Int; spacing : Float } {
      let level = Int.abs(i) - (levels / 2);
      { level = level; spacing = Matalko.phiSpacing(baseUnit, level) };
    });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DEVICE NETWORK API
  // ═══════════════════════════════════════════════════════════════════════════

  /// Register a new device in the sovereign network
  public func registerDevice(
    deviceType : Text,
    permissions : [Text]
  ) : async {
    id : Text;
    frequencySignature : { fundamental : Float; phiModulation : Float };
    phiGridPosition : { x : Float; y : Float };
    trustScore : Float;
  } {
    deviceCounter += 1;
    let id = "device-" # Nat.toText(deviceCounter);
    let seed = deviceCounter * 137 + beat; // Unique seed
    
    let devType : Organism.DeviceType = switch (deviceType) {
      case "phone" #Phone;
      case "tablet" #Tablet;
      case "laptop" #Laptop;
      case "desktop" #Desktop;
      case "wifi" #WiFiNode;
      case "sensor" #Sensor;
      case _ #Unknown;
    };
    
    let perms = Array.mapFilter<Text, Organism.DevicePermission>(permissions, func(p : Text) : ?Organism.DevicePermission {
      switch (p) {
        case "microphone" ?#Microphone;
        case "camera" ?#Camera;
        case "location" ?#Location;
        case "motion" ?#Motion;
        case "notifications" ?#Notifications;
        case "storage" ?#Storage;
        case "network" ?#Network;
        case _ null;
      };
    });
    
    let device = Organism.registerDevice(id, devType, seed, perms);
    devices := Array.append(devices, [device]);
    
    {
      id = device.id;
      frequencySignature = { 
        fundamental = device.frequencySignature.fundamental; 
        phiModulation = device.frequencySignature.phiModulation;
      };
      phiGridPosition = device.phiGridPosition;
      trustScore = device.trustScore;
    };
  };

  /// Generate sovereign device contract
  public func generateDeviceContract(deviceId : Text) : async ?{
    id : Text;
    animaHash : Nat;
    blockchainAnchor : Text;
    phiGridSample : [[Float]];
  } {
    var targetDevice : ?Organism.DeviceNode = null;
    for (d in devices.vals()) {
      if (d.id == deviceId) {
        targetDevice := ?d;
      };
    };
    
    switch (targetDevice) {
      case null null;
      case (?device) {
        contractCounter += 1;
        let contract = Organism.generateDeviceContract(device, oroState);
        deviceContracts := Array.append(deviceContracts, [contract]);
        
        // Return first 4 rows of phi grid as sample
        let gridSample = Array.tabulate<[Float]>(4, func(i : Nat) : [Float] {
          if (i < Array.size(contract.phiGrid)) { contract.phiGrid[i] } else { [] };
        });
        
        ?{
          id = contract.id;
          animaHash = contract.animaHash;
          blockchainAnchor = contract.blockchainAnchor;
          phiGridSample = gridSample;
        };
      };
    };
  };

  /// List all registered devices
  public query func listDevices() : async [{
    id : Text;
    deviceType : Text;
    trustScore : Float;
    phiPosition : { x : Float; y : Float };
    hasContract : Bool;
  }] {
    Array.map<Organism.DeviceNode, {
      id : Text;
      deviceType : Text;
      trustScore : Float;
      phiPosition : { x : Float; y : Float };
      hasContract : Bool;
    }>(devices, func(d : Organism.DeviceNode) : {
      id : Text;
      deviceType : Text;
      trustScore : Float;
      phiPosition : { x : Float; y : Float };
      hasContract : Bool;
    } {
      let typeText = switch (d.deviceType) {
        case (#Phone) "phone";
        case (#Tablet) "tablet";
        case (#Laptop) "laptop";
        case (#Desktop) "desktop";
        case (#WiFiNode) "wifi";
        case (#Sensor) "sensor";
        case (#Unknown) "unknown";
      };
      let hasC = switch (d.contractHash) { case null false; case _ true; };
      {
        id = d.id;
        deviceType = typeText;
        trustScore = d.trustScore;
        phiPosition = d.phiGridPosition;
        hasContract = hasC;
      };
    });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MATHEMATICAL COMPUTATION API
  // ═══════════════════════════════════════════════════════════════════════════

  /// Compute phi-encoded value
  public query func phiEncode(value : Float) : async Float {
    Matalko.phiEncode(value);
  };

  /// Generate phi-spiral coordinates
  public query func phiSpiral(count : Nat, scale : Float) : async [{ x : Float; y : Float }] {
    Array.tabulate<{ x : Float; y : Float }>(count, func(i : Nat) : { x : Float; y : Float } {
      Matalko.phiSpiral(i, scale);
    });
  };

  /// Compute harmonic resonance between frequencies
  public query func harmonicResonance(f1 : Float, f2 : Float) : async Float {
    Matalko.harmonicResonance(f1, f2);
  };

  /// Generate frequency signature
  public query func generateFrequencySignature(seed : Nat) : async {
    fundamental : Float;
    harmonics : [Float];
    phiModulation : Float;
  } {
    let sig = Matalko.generateFrequencySignature(seed, 8);
    {
      fundamental = sig.fundamental;
      harmonics = sig.harmonics;
      phiModulation = sig.phiModulation;
    };
  };

  /// Compute field state from current organism
  public query func computeFieldState() : async Matalko.FieldState {
    oroState.fieldState;
  };

  /// Get Fibonacci sequence
  public query func fibonacci(n : Nat) : async Nat {
    Matalko.fibonacci(n);
  };

  /// Get universal constants
  public query func constants() : async {
    phi : Float;
    phiInverse : Float;
    phiSquared : Float;
    freq432 : Float;
    pi : Float;
    tau : Float;
    e : Float;
  } {
    {
      phi = Matalko.PHI;
      phiInverse = Matalko.PHI_INVERSE;
      phiSquared = Matalko.PHI_SQUARED;
      freq432 = Matalko.FREQ_432;
      pi = Matalko.PI;
      tau = Matalko.TAU;
      e = Matalko.E;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // LEGACY API (Backward Compatible)
  // ═══════════════════════════════════════════════════════════════════════════

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

  // ========== Model Engine Execution API ==========

  /// Invoke a model engine with full RUDN execution.
  public func modelInvoke(
    family : T.ModelFamily,
    taskRef : Text,
    contextMemoryId : ?Text,
    inputPayload : Text,
  ) : async T.EngineResult {
    invocationCounter += 1;
    let invocationId = nextId("inv", invocationCounter);
    
    // Create the invocation record
    let invocation = ModelEngine.createInvocation(
      invocationId,
      family,
      taskRef,
      contextMemoryId,
      inputPayload
    );
    engineInvocations := Array.append(engineInvocations, [invocation]);
    
    // Get relevant memory context
    let contextNodes = switch (contextMemoryId) {
      case null memoryNodes;
      case (?mid) {
        Array.filter<T.MemoryNode>(memoryNodes, func(n : T.MemoryNode) : Bool { 
          n.id == mid or n.lineage.parent == ?mid 
        });
      };
    };
    
    // Execute the engine with current system state
    let dualRead : T.DualReadStatus = { semantic = true; resonance = true };
    let workforceReady = true;
    let projectionSafe = true;
    
    let result = ModelEngine.execute(
      invocation,
      contextNodes,
      dualRead,
      workforceReady,
      projectionSafe
    );
    
    engineResults := Array.append(engineResults, [result]);
    replayRefs := Array.append(replayRefs, ["replay:invoke:" # invocationId]);
    
    result;
  };

  /// Get engine invocation history.
  public query func engineHistory() : async [T.EngineInvocation] {
    engineInvocations;
  };

  /// Get engine results history.
  public query func engineResultHistory() : async [T.EngineResult] {
    engineResults;
  };

  // ========== Work Packet API ==========

  /// Create and open a new work packet.
  public func workspaceCreate(
    title : Text,
    taskRef : Text,
    inputPayload : Text,
    registers : T.Register,
  ) : async T.WorkPacket {
    packetCounter += 1;
    let packetId = nextId("packet", packetCounter);
    
    let packet = WorkPacket.createPacket(
      packetId,
      title,
      taskRef,
      inputPayload,
      registers,
      null
    );
    
    let openedPacket = WorkPacket.openPacket(packet);
    workPackets := Array.append(workPackets, [openedPacket]);
    replayRefs := Array.append(replayRefs, ["replay:packet:" # packetId]);
    
    openedPacket;
  };

  /// Open an existing packet by ID (transition from Draft to Open).
  public func workspaceOpen(packetId : Text) : async ?T.WorkPacket {
    var found : ?T.WorkPacket = null;
    workPackets := Array.map<T.WorkPacket, T.WorkPacket>(
      workPackets,
      func(p : T.WorkPacket) : T.WorkPacket {
        if (p.id == packetId and p.status == #Draft) {
          let opened = WorkPacket.openPacket(p);
          found := ?opened;
          opened;
        } else if (p.id == packetId) {
          found := ?p;
          p;
        } else {
          p;
        };
      },
    );
    found;
  };

  /// Assign an engine to a packet and begin work.
  public func workspaceAssign(
    packetId : Text,
    family : T.ModelFamily,
  ) : async ?T.WorkPacket {
    let role = ModelEngine.determineRole(family, "");
    var found : ?T.WorkPacket = null;
    
    workPackets := Array.map<T.WorkPacket, T.WorkPacket>(
      workPackets,
      func(p : T.WorkPacket) : T.WorkPacket {
        if (p.id == packetId) {
          let assigned = WorkPacket.assignEngine(p, role, family);
          found := ?assigned;
          assigned;
        } else {
          p;
        };
      },
    );
    found;
  };

  /// Complete a packet with execution result.
  public func workspaceComplete(
    packetId : Text,
    outputPayload : Text,
  ) : async ?T.WorkPacket {
    var found : ?T.WorkPacket = null;
    
    workPackets := Array.map<T.WorkPacket, T.WorkPacket>(
      workPackets,
      func(p : T.WorkPacket) : T.WorkPacket {
        if (p.id == packetId) {
          let completed = WorkPacket.completePacket(p, outputPayload, "evidence:completed:" # packetId);
          found := ?completed;
          completed;
        } else {
          p;
        };
      },
    );
    found;
  };

  /// Get all work packets.
  public query func workspaceList() : async [T.WorkPacket] {
    workPackets;
  };

  /// Get a specific packet by ID.
  public query func workspaceGet(packetId : Text) : async ?T.WorkPacket {
    var found : ?T.WorkPacket = null;
    for (p in workPackets.vals()) {
      if (p.id == packetId) {
        found := ?p;
      };
    };
    found;
  };

  // ========== Workflow API ==========

  /// Create and start a new workflow.
  public func workflowCreate(
    name : Text,
    taskRefs : [Text],
  ) : async T.Workflow {
    workflowCounter += 1;
    let workflowId = nextId("workflow", workflowCounter);
    
    // Create steps from task refs
    var stepCounter = 0;
    let steps = Array.map<Text, T.WorkflowStep>(
      taskRefs,
      func(taskRef : Text) : T.WorkflowStep {
        stepCounter += 1;
        let stepId = workflowId # "-step-" # Nat.toText(stepCounter);
        
        // Determine step type and engine based on task
        let route = ModelRouter.routeForTask(taskRef, null);
        let engineRole = ?ModelEngine.determineRole(route.family, taskRef);
        let stepType : T.WorkflowStepType = if (stepCounter == 1) #Route 
                                            else if (stepCounter == Array.size(taskRefs)) #Complete 
                                            else #Execute;
        
        WorkPacket.createStep(stepId, stepType, engineRole, taskRef, true);
      }
    );
    
    let workflow = WorkPacket.createWorkflow(workflowId, name, steps);
    let started = WorkPacket.startWorkflow(workflow);
    
    workflows := Array.append(workflows, [started]);
    replayRefs := Array.append(replayRefs, ["replay:workflow:" # workflowId]);
    
    started;
  };

  /// Execute the current step of a workflow.
  public func workflowStep(workflowId : Text) : async ?T.WorkflowResult {
    var result : ?T.WorkflowResult = null;
    
    workflows := Array.map<T.Workflow, T.Workflow>(
      workflows,
      func(w : T.Workflow) : T.Workflow {
        if (w.id == workflowId and w.status == #Running) {
          let currentIdx = w.currentStepIndex;
          if (currentIdx < Array.size(w.steps)) {
            let step = w.steps[currentIdx];
            
            // Execute step based on engine role
            let stepOutput = switch (step.engineRole) {
              case null "Step " # Nat.toText(currentIdx) # " executed (no engine)";
              case (?role) {
                "Step " # Nat.toText(currentIdx) # " executed by " # 
                ModelEngine.roleName(role) # " engine for task: " # step.taskRef;
              };
            };
            
            // Create packet for this step
            packetCounter += 1;
            let packetId = nextId("packet", packetCounter);
            let registers : T.Register = {
              founder = "workflow:" # workflowId;
              builder = "step:" # step.id;
              organism = "medina";
              external = "";
            };
            let stepPacket = WorkPacket.createPacket(
              packetId,
              "Workflow step: " # step.taskRef,
              step.taskRef,
              stepOutput,
              registers,
              null
            );
            let completedPacket = WorkPacket.completePacket(
              WorkPacket.openPacket(stepPacket),
              stepOutput,
              "workflow:" # workflowId # ":step:" # Nat.toText(currentIdx)
            );
            workPackets := Array.append(workPackets, [completedPacket]);
            
            // Advance workflow
            let advanced = WorkPacket.advanceStep(w, stepOutput, ?packetId);
            
            // Build result
            let gates : T.GateStatus = { a = true; b = true; c = true };
            let r = WorkPacket.buildResult(advanced, ?stepOutput, gates);
            result := ?r;
            
            advanced;
          } else {
            w;
          };
        } else {
          w;
        };
      },
    );
    result;
  };

  /// Execute an entire workflow to completion.
  public func workflowRun(workflowId : Text) : async ?T.WorkflowResult {
    var finalResult : ?T.WorkflowResult = null;
    var continueRunning = true;
    
    // Find the workflow
    var targetWorkflow : ?T.Workflow = null;
    for (w in workflows.vals()) {
      if (w.id == workflowId) {
        targetWorkflow := ?w;
      };
    };
    
    switch (targetWorkflow) {
      case null null;
      case (?wf) {
        // Run all steps
        let numSteps = Array.size(wf.steps);
        var stepIdx = 0;
        while (stepIdx < numSteps and continueRunning) {
          let stepResult = await workflowStep(workflowId);
          switch (stepResult) {
            case null { continueRunning := false; };
            case (?r) {
              finalResult := ?r;
              if (r.status == #Completed or r.status == #Failed) {
                continueRunning := false;
              };
            };
          };
          stepIdx += 1;
        };
        finalResult;
      };
    };
  };

  /// Get workflow status.
  public query func workflowStatus(workflowId : Text) : async ?T.Workflow {
    var found : ?T.Workflow = null;
    for (w in workflows.vals()) {
      if (w.id == workflowId) {
        found := ?w;
      };
    };
    found;
  };

  /// List all workflows.
  public query func workflowList() : async [T.Workflow] {
    workflows;
  };

  // ========== Universal Command Executor ==========

  /// Universal control-plane command executor (typed command AST form).
  public func runCommand(cmd : T.Command) : async T.CommandResult {
    switch (cmd) {
      case (#MemoryFind c) {
        let results = MemoryTemple.find(memoryNodes, c.query, c.ring, c.depth, c.lineage);
        {
          status = #Ok;
          message = "memory.find: " # Nat.toText(Array.size(results)) # " results for query '" # c.query # "'";
          lineageId = null;
          gates = null;
          evidenceRefs = Array.map<T.MemoryNode, Text>(results, func(n : T.MemoryNode) : Text { n.id });
        };
      };
      case (#MemoryPin c) {
        // Pin a memory node (mark as promoted)
        let promoted = await memoryPromote(c.memoryId);
        {
          status = if (promoted) #Ok else #Error;
          message = if (promoted) "memory.pin: pinned " # c.memoryId else "memory.pin: not found " # c.memoryId;
          lineageId = ?c.memoryId;
          gates = null;
          evidenceRefs = ["pin:" # c.memoryId];
        };
      };
      case (#MemoryMap c) {
        // Map memory node relationships
        let related = MemoryTemple.find(memoryNodes, "", null, null, ?c.memoryId);
        {
          status = #Ok;
          message = "memory.map: " # c.memoryId # " mode=" # c.mode # " related=" # Nat.toText(Array.size(related));
          lineageId = ?c.memoryId;
          gates = null;
          evidenceRefs = Array.map<T.MemoryNode, Text>(related, func(n : T.MemoryNode) : Text { n.id });
        };
      };
      case (#GovernStatus c) {
        let status = await governStatus(c.proposalId);
        {
          status = #Ok;
          message = "govern.status: " # status;
          lineageId = c.proposalId;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#GovernPropose c) {
        // Create a governance proposal with default registers
        let defaultRegisters : T.Register = {
          founder = "cmd";
          builder = "cmd";
          organism = "medina";
          external = "";
        };
        let dualRead : T.DualReadStatus = { semantic = true; resonance = true };
        let gates : T.GateStatus = { a = true; b = true; c = true };
        let proposal = await governPropose(
          c.proposalType,
          c.payloadRef,
          defaultRegisters,
          "cmd:propose",
          c.proposalType,
          dualRead,
          gates
        );
        {
          status = #Ok;
          message = "govern.propose: created " # proposal.id # " type=" # c.proposalType;
          lineageId = ?proposal.id;
          gates = ?gates;
          evidenceRefs = ["proposal:" # proposal.id];
        };
      };
      case (#GovernApprove c) {
        let approved = await governApprove(c.proposalId, c.policy);
        switch (approved) {
          case null {
            {
              status = #Error;
              message = "govern.approve: proposal not found " # c.proposalId;
              lineageId = ?c.proposalId;
              gates = null;
              evidenceRefs = [];
            };
          };
          case (?p) {
            {
              status = if (p.status == #Accepted) #Ok else #Blocked;
              message = "govern.approve: " # c.proposalId # " -> " # Governance.statusText(p);
              lineageId = ?c.proposalId;
              gates = ?p.gateSnapshot;
              evidenceRefs = p.evidenceRefs;
            };
          };
        };
      };
      case (#ModelInvoke c) {
        // Execute model engine invocation
        let result = await modelInvoke(c.family, c.taskRef, c.contextMemory, "cmd:invoke:" # c.taskRef);
        let cmdStatus = switch (result.status) {
          case (#Completed) #Ok;
          case (#Blocked) #Blocked;
          case (#Fallback) #Ok;
          case (#Error) #Error;
        };
        {
          status = cmdStatus;
          message = "model.invoke: " # ModelEngine.roleName(
            ModelEngine.determineRole(c.family, c.taskRef)
          ) # " engine -> " # result.outputPayload;
          lineageId = ?result.invocationId;
          gates = ?result.gates;
          evidenceRefs = result.evidenceRefs;
        };
      };
      case (#ModelRoute c) {
        let route = ModelRouter.routeForTask(c.taskRef, c.policy);
        let role = ModelEngine.determineRole(route.family, c.taskRef);
        {
          status = #Ok;
          message = "model.route: task=" # c.taskRef # " -> " # 
                    ModelEngine.roleName(role) # " engine. " # route.rationale;
          lineageId = null;
          gates = null;
          evidenceRefs = ["route:" # c.taskRef];
        };
      };
      case (#WorkspaceOpen c) {
        // Open or create a workspace packet
        let existingPacket = await workspaceGet(c.packetId);
        switch (existingPacket) {
          case (?p) {
            let opened = await workspaceOpen(c.packetId);
            {
              status = #Ok;
              message = "workspace.open: opened existing packet " # c.packetId # " status=" # WorkPacket.packetStatusName(p.status);
              lineageId = ?c.packetId;
              gates = ?p.gates;
              evidenceRefs = p.evidenceRefs;
            };
          };
          case null {
            // Create new packet
            let defaultRegisters : T.Register = {
              founder = "cmd";
              builder = "cmd";
              organism = "medina";
              external = "";
            };
            let newPacket = await workspaceCreate(
              "Workspace: " # c.packetId,
              c.packetId,
              "cmd:workspace:open",
              defaultRegisters
            );
            {
              status = #Ok;
              message = "workspace.open: created new packet " # newPacket.id;
              lineageId = ?newPacket.id;
              gates = ?newPacket.gates;
              evidenceRefs = newPacket.evidenceRefs;
            };
          };
        };
      };
      case (#CompanyOnboard c) {
        let tenant = await companyOnboard(c.tenantId, c.mode, []);
        let modeName = switch (c.mode) {
          case (#Connect) "connect";
          case (#Internalize) "internalize";
          case (#Hybrid) "hybrid";
        };
        {
          status = #Ok;
          message = "company.onboard: tenant=" # c.tenantId # " mode=" # modeName;
          lineageId = ?c.tenantId;
          gates = null;
          evidenceRefs = ["tenant:" # c.tenantId];
        };
      };
      case (#CompanyConnect c) {
        // Find and update tenant with connector
        var found = false;
        tenants := Array.map<T.Tenant, T.Tenant>(
          tenants,
          func(t : T.Tenant) : T.Tenant {
            if (t.id == c.tenantId) {
              found := true;
              Company.connectRecord(t, c.connectorRef);
            } else {
              t;
            };
          },
        );
        {
          status = if (found) #Ok else #Error;
          message = if (found) "company.connect: " # c.tenantId # " -> " # c.connectorRef else "company.connect: tenant not found";
          lineageId = ?c.tenantId;
          gates = null;
          evidenceRefs = ["connect:" # c.connectorRef];
        };
      };
      case (#CompanyInternalize c) {
        // Find and update tenant with domain internalization
        var found = false;
        tenants := Array.map<T.Tenant, T.Tenant>(
          tenants,
          func(t : T.Tenant) : T.Tenant {
            if (t.id == c.tenantId) {
              found := true;
              Company.internalizeRecord(t, c.domainRef);
            } else {
              t;
            };
          },
        );
        {
          status = if (found) #Ok else #Error;
          message = if (found) "company.internalize: " # c.tenantId # " domain=" # c.domainRef else "company.internalize: tenant not found";
          lineageId = ?c.tenantId;
          gates = null;
          evidenceRefs = ["internalize:" # c.domainRef];
        };
      };
      case (#CompanyHybrid c) {
        // Find and update tenant with hybrid plan
        var found = false;
        tenants := Array.map<T.Tenant, T.Tenant>(
          tenants,
          func(t : T.Tenant) : T.Tenant {
            if (t.id == c.tenantId) {
              found := true;
              Company.hybridRecord(t, c.planRef);
            } else {
              t;
            };
          },
        );
        {
          status = if (found) #Ok else #Error;
          message = if (found) "company.hybrid: " # c.tenantId # " plan=" # c.planRef else "company.hybrid: tenant not found";
          lineageId = ?c.tenantId;
          gates = null;
          evidenceRefs = ["hybrid:" # c.planRef];
        };
      };
      case (#ReplayShow c) {
        // Show replay evidence for a workflow or bundle
        let refs = Array.filter<Text>(replayRefs, func(r : Text) : Bool { 
          r == c.workflowOrBundleId or 
          (r == "replay:workflow:" # c.workflowOrBundleId) or
          (r == "replay:beat:" # c.workflowOrBundleId) or
          (r == "replay:packet:" # c.workflowOrBundleId) or
          (r == "replay:invoke:" # c.workflowOrBundleId)
        });
        {
          status = #Ok;
          message = "replay.show: " # c.workflowOrBundleId # " -> " # Nat.toText(Array.size(refs)) # " replay refs";
          lineageId = ?c.workflowOrBundleId;
          gates = null;
          evidenceRefs = refs;
        };
      };
      case (#Run c) {
        // Run a workflow by reference
        // First try to find existing workflow
        var existingWorkflow : ?T.Workflow = null;
        for (w in workflows.vals()) {
          if (w.id == c.workflowRef or w.name == c.workflowRef) {
            existingWorkflow := ?w;
          };
        };
        
        switch (existingWorkflow) {
          case (?wf) {
            // Run existing workflow
            let result = await workflowRun(wf.id);
            switch (result) {
              case null {
                {
                  status = #Error;
                  message = "run: workflow execution failed for " # wf.id;
                  lineageId = ?wf.id;
                  gates = null;
                  evidenceRefs = wf.evidenceRefs;
                };
              };
              case (?r) {
                {
                  status = if (r.status == #Completed) #Ok else #Blocked;
                  message = "run: " # c.workflowRef # " -> " # WorkPacket.workflowStatusName(r.status) # 
                            " (" # Nat.toText(r.completedSteps) # "/" # Nat.toText(r.totalSteps) # " steps)";
                  lineageId = ?r.workflowId;
                  gates = ?r.gates;
                  evidenceRefs = r.evidenceRefs;
                };
              };
            };
          };
          case null {
            // Create new workflow from reference
            let newWorkflow = await workflowCreate(c.workflowRef, [c.workflowRef]);
            let result = await workflowRun(newWorkflow.id);
            switch (result) {
              case null {
                {
                  status = #Error;
                  message = "run: created and ran workflow " # newWorkflow.id # " but execution failed";
                  lineageId = ?newWorkflow.id;
                  gates = null;
                  evidenceRefs = newWorkflow.evidenceRefs;
                };
              };
              case (?r) {
                {
                  status = if (r.status == #Completed) #Ok else #Blocked;
                  message = "run: created " # newWorkflow.id # " -> " # WorkPacket.workflowStatusName(r.status);
                  lineageId = ?r.workflowId;
                  gates = ?r.gates;
                  evidenceRefs = r.evidenceRefs;
                };
              };
            };
          };
        };
      };
    };
  };
};
