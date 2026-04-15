import Array "mo:base/Array";
import Nat "mo:base/Nat";
import T "./Types";
import Law "./LawEngine";

/// ModelEngine provides role-specialized executable engines following RUDN architecture.
/// R = Router (route tasks to handlers)
/// U = Updater (state mutations with governance)
/// D = Defender (risk assessment, safety checks)
/// N = Navigator (pathfinding, projection, exploration)
module {

  // ========== Engine Role Determination ==========

  /// Determine the appropriate RUDN role for a given model family and task.
  public func determineRole(family : T.ModelFamily, taskRef : Text) : T.EngineRole {
    switch (family) {
      case (#Strategist) {
        // Strategists navigate and project
        #Navigator;
      };
      case (#Builder) {
        // Builders update state
        #Updater;
      };
      case (#Analyst) {
        // Analysts route and evaluate
        #Router;
      };
      case (#Governance) {
        // Governance updates with strong gates
        #Updater;
      };
      case (#MemoryCurator) {
        // Memory curators update memory state
        #Updater;
      };
      case (#Operations) {
        // Operations route and coordinate
        #Router;
      };
      case (#Defense) {
        // Defense defends and validates
        #Defender;
      };
      case (#Projection) {
        // Projection navigates externally
        #Navigator;
      };
    };
  };

  /// Determine capability level for a role.
  public func roleCapability(role : T.EngineRole) : T.EngineCapability {
    switch (role) {
      case (#Router) #ReadOnly;
      case (#Updater) #WriteWithGate;
      case (#Defender) #ReadOnly;
      case (#Navigator) #WriteWithGate;
    };
  };

  // ========== RUDN Engine Execution ==========

  /// Router Engine: Routes tasks to appropriate handlers, read-only analysis.
  public func executeRouter(
    invocation : T.EngineInvocation,
    memoryNodes : [T.MemoryNode],
  ) : T.EngineResult {
    // Router performs analysis and routing decision
    let analysisOutput = "ROUTER: Analyzed task '" # invocation.taskRef # "' with " # 
                         Nat.toText(Array.size(memoryNodes)) # " memory nodes in context.";
    
    {
      invocationId = invocation.id;
      status = #Completed;
      outputPayload = analysisOutput;
      dualRead = { semantic = true; resonance = true };
      gates = { a = true; b = true; c = true };
      memoryMutations = [];
      evidenceRefs = ["evidence:router:" # invocation.id];
      fallbackReason = null;
      executedAtNs = T.nowNs();
    };
  };

  /// Updater Engine: Performs state mutations with full gate validation.
  public func executeUpdater(
    invocation : T.EngineInvocation,
    dualRead : T.DualReadStatus,
    workforceReady : Bool,
    projectionSafe : Bool,
  ) : T.EngineResult {
    // Validate gates before mutation
    let gateA = Law.gateA(dualRead, 0);
    let gateB = Law.gateB(workforceReady, true);
    let gateC = Law.gateC(projectionSafe, true);
    
    let gates : T.GateStatus = { a = gateA; b = gateB; c = gateC };
    
    if (not gateA or not gateB) {
      // Blocked by gate check
      {
        invocationId = invocation.id;
        status = #Blocked;
        outputPayload = "UPDATER: Blocked by gate validation. Gate A=" # 
                        (if gateA "pass" else "fail") # ", Gate B=" #
                        (if gateB "pass" else "fail");
        dualRead = dualRead;
        gates = gates;
        memoryMutations = [];
        evidenceRefs = ["evidence:updater:blocked:" # invocation.id];
        fallbackReason = ?"Gate validation failed";
        executedAtNs = T.nowNs();
      };
    } else {
      // Execute mutation
      let mutationOutput = "UPDATER: Executed state mutation for task '" # invocation.taskRef # 
                           "'. Input: " # invocation.inputPayload;
      
      {
        invocationId = invocation.id;
        status = #Completed;
        outputPayload = mutationOutput;
        dualRead = dualRead;
        gates = gates;
        memoryMutations = ["mutation:" # invocation.taskRef # ":" # invocation.id];
        evidenceRefs = ["evidence:updater:" # invocation.id];
        fallbackReason = null;
        executedAtNs = T.nowNs();
      };
    };
  };

  /// Defender Engine: Performs risk assessment and safety validation.
  public func executeDefender(
    invocation : T.EngineInvocation,
    memoryNodes : [T.MemoryNode],
    dualRead : T.DualReadStatus,
  ) : T.EngineResult {
    // Defense analysis: check for risks in context
    var riskIndicators : Nat = 0;
    
    // Check dual read integrity
    if (not dualRead.semantic) {
      riskIndicators += 1;
    };
    if (not dualRead.resonance) {
      riskIndicators += 1;
    };
    
    // Check memory salience distribution for anomalies
    for (node in memoryNodes.vals()) {
      if (node.salience > 90) {
        riskIndicators += 1;
      };
    };
    
    let riskLevel = if (riskIndicators == 0) "LOW" 
                    else if (riskIndicators <= 2) "MEDIUM" 
                    else "HIGH";
    
    let defenseOutput = "DEFENDER: Risk assessment for '" # invocation.taskRef # 
                        "'. Risk level: " # riskLevel # 
                        ". Indicators: " # Nat.toText(riskIndicators) #
                        ". Memory nodes analyzed: " # Nat.toText(Array.size(memoryNodes));
    
    {
      invocationId = invocation.id;
      status = if (riskIndicators > 3) #Blocked else #Completed;
      outputPayload = defenseOutput;
      dualRead = dualRead;
      gates = { 
        a = dualRead.semantic and dualRead.resonance; 
        b = true; 
        c = riskIndicators <= 3;
      };
      memoryMutations = [];
      evidenceRefs = ["evidence:defender:" # invocation.id, "risk:" # riskLevel];
      fallbackReason = if (riskIndicators > 3) ?"High risk level detected" else null;
      executedAtNs = T.nowNs();
    };
  };

  /// Navigator Engine: Pathfinding, projection, and exploration.
  public func executeNavigator(
    invocation : T.EngineInvocation,
    memoryNodes : [T.MemoryNode],
    projectionSafe : Bool,
  ) : T.EngineResult {
    // Navigator performs pathfinding through memory space
    var pathNodes : [Text] = [];
    
    // Build navigation path based on lineage
    for (node in memoryNodes.vals()) {
      switch (node.lineage.parent) {
        case null {};
        case (?parent) {
          pathNodes := Array.append(pathNodes, [node.id # " <- " # parent]);
        };
      };
    };
    
    let pathDescription = if (Array.size(pathNodes) == 0) {
      "No lineage paths found"
    } else {
      "Found " # Nat.toText(Array.size(pathNodes)) # " lineage paths"
    };
    
    let navigatorOutput = "NAVIGATOR: Exploration for '" # invocation.taskRef # 
                          "'. " # pathDescription #
                          ". Projection safety: " # (if projectionSafe "safe" else "unsafe");
    
    let gateC = Law.gateC(projectionSafe, true);
    
    {
      invocationId = invocation.id;
      status = if (projectionSafe) #Completed else #Blocked;
      outputPayload = navigatorOutput;
      dualRead = { semantic = true; resonance = true };
      gates = { a = true; b = true; c = gateC };
      memoryMutations = [];
      evidenceRefs = Array.append(
        ["evidence:navigator:" # invocation.id],
        Array.map<Text, Text>(pathNodes, func(p : Text) : Text { "path:" # p })
      );
      fallbackReason = if (not projectionSafe) ?"Projection safety check failed" else null;
      executedAtNs = T.nowNs();
    };
  };

  // ========== Unified Engine Dispatch ==========

  /// Main engine execution dispatcher based on RUDN role.
  public func execute(
    invocation : T.EngineInvocation,
    memoryNodes : [T.MemoryNode],
    dualRead : T.DualReadStatus,
    workforceReady : Bool,
    projectionSafe : Bool,
  ) : T.EngineResult {
    switch (invocation.role) {
      case (#Router) {
        executeRouter(invocation, memoryNodes);
      };
      case (#Updater) {
        executeUpdater(invocation, dualRead, workforceReady, projectionSafe);
      };
      case (#Defender) {
        executeDefender(invocation, memoryNodes, dualRead);
      };
      case (#Navigator) {
        executeNavigator(invocation, memoryNodes, projectionSafe);
      };
    };
  };

  /// Create a new engine invocation record.
  public func createInvocation(
    id : Text,
    family : T.ModelFamily,
    taskRef : Text,
    contextMemoryId : ?Text,
    inputPayload : Text,
  ) : T.EngineInvocation {
    let role = determineRole(family, taskRef);
    let capability = roleCapability(role);
    {
      id = id;
      role = role;
      family = family;
      taskRef = taskRef;
      contextMemoryId = contextMemoryId;
      inputPayload = inputPayload;
      capability = capability;
      createdAtNs = T.nowNs();
    };
  };

  /// Check if an engine result indicates successful completion.
  public func isSuccess(result : T.EngineResult) : Bool {
    switch (result.status) {
      case (#Completed) true;
      case (#Blocked) false;
      case (#Fallback) true;
      case (#Error) false;
    };
  };

  /// Get role name as text.
  public func roleName(role : T.EngineRole) : Text {
    switch (role) {
      case (#Router) "Router";
      case (#Updater) "Updater";
      case (#Defender) "Defender";
      case (#Navigator) "Navigator";
    };
  };
};
