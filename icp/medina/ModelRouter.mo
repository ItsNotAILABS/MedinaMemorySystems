import T "./Types";

/// ModelRouter provides model family routing and RUDN role determination.
/// Routes tasks to appropriate model families based on task type and policy.
module {
  /// D1-D10 document organisms remain active workforce.
  public let dWorkforce : [Text] = [
    "D1",
    "D2",
    "D3",
    "D4",
    "D5",
    "D6",
    "D7",
    "D8",
    "D9",
    "D10",
  ];

  /// N1-N12 sovereign macro hierarchy remains control topology.
  public let nHierarchy : [Text] = [
    "N1",
    "N2",
    "N3",
    "N4",
    "N5",
    "N6",
    "N7",
    "N8",
    "N9",
    "N10",
    "N11",
    "N12",
  ];

  /// Task categories for routing decisions.
  public type TaskCategory = {
    #Governance;     // Law, proposal, approval tasks
    #Memory;         // Memory retrieval, mutation, consolidation
    #Projection;     // External output, projection
    #Analysis;       // Analysis, evaluation, assessment
    #Strategy;       // Planning, strategy, roadmap
    #Build;          // Implementation, construction
    #Operations;     // Coordination, orchestration
    #Defense;        // Risk, security, validation
  };

  /// Categorize a task reference.
  public func categorizeTask(taskRef : Text) : TaskCategory {
    if (taskRef == "governance" or taskRef == "law" or taskRef == "proposal" or taskRef == "approve") {
      #Governance;
    } else if (taskRef == "memory" or taskRef == "retrieve" or taskRef == "consolidate" or taskRef == "promote") {
      #Memory;
    } else if (taskRef == "projection" or taskRef == "external" or taskRef == "output") {
      #Projection;
    } else if (taskRef == "strategy" or taskRef == "plan" or taskRef == "roadmap") {
      #Strategy;
    } else if (taskRef == "build" or taskRef == "implement" or taskRef == "construct") {
      #Build;
    } else if (taskRef == "operations" or taskRef == "coordinate" or taskRef == "orchestrate") {
      #Operations;
    } else if (taskRef == "defense" or taskRef == "risk" or taskRef == "security" or taskRef == "validate") {
      #Defense;
    } else {
      #Analysis;
    };
  };

  /// Route task to appropriate model family.
  public func routeForTask(taskRef : Text, policy : ?Text) : T.ModelRoute {
    let category = categorizeTask(taskRef);
    
    switch (category) {
      case (#Governance) {
        {
          family = #Governance;
          rationale = "Governance-sensitive workflow requires governance model with strong gate validation.";
          fallbackSource = ?("Analyst fallback available");
          incidentRef = null;
        };
      };
      case (#Memory) {
        {
          family = #MemoryCurator;
          rationale = "Memory mutation/retrieval requires memory curator model with lineage tracking.";
          fallbackSource = ?("Analyst fallback available");
          incidentRef = null;
        };
      };
      case (#Projection) {
        {
          family = #Projection;
          rationale = "External projection requires bounded projection model with Gate C validation.";
          fallbackSource = null;
          incidentRef = null;
        };
      };
      case (#Strategy) {
        {
          family = #Strategist;
          rationale = "Strategic planning requires strategist model with navigation capability.";
          fallbackSource = ?("Analyst fallback available");
          incidentRef = null;
        };
      };
      case (#Build) {
        {
          family = #Builder;
          rationale = "Implementation tasks require builder model with update capability.";
          fallbackSource = ?("Operations fallback available");
          incidentRef = null;
        };
      };
      case (#Operations) {
        {
          family = #Operations;
          rationale = "Coordination tasks require operations model with routing capability.";
          fallbackSource = ?("Analyst fallback available");
          incidentRef = null;
        };
      };
      case (#Defense) {
        {
          family = #Defense;
          rationale = "Security/risk assessment requires defense model with validation capability.";
          fallbackSource = null;
          incidentRef = null;
        };
      };
      case (#Analysis) {
        {
          family = #Analyst;
          rationale = switch (policy) {
            case null "Default analytical route for general tasks.";
            case (?p) "Policy-guided analytical route: " # p;
          };
          fallbackSource = null;
          incidentRef = null;
        };
      };
    };
  };

  /// Get fallback model family for a primary family.
  public func fallbackFamily(primary : T.ModelFamily) : ?T.ModelFamily {
    switch (primary) {
      case (#Strategist) ?#Analyst;
      case (#Builder) ?#Operations;
      case (#Analyst) null;
      case (#Governance) ?#Analyst;
      case (#MemoryCurator) ?#Analyst;
      case (#Operations) ?#Analyst;
      case (#Defense) null;
      case (#Projection) null;
    };
  };

  /// Check if a task requires gate validation before execution.
  public func requiresGate(taskRef : Text) : Bool {
    let category = categorizeTask(taskRef);
    switch (category) {
      case (#Governance) true;
      case (#Memory) true;
      case (#Projection) true;
      case (#Defense) true;
      case _ false;
    };
  };

  /// Determine if task should be handled by D workforce or N hierarchy.
  public func workforceOrHierarchy(taskRef : Text) : { #Workforce; #Hierarchy } {
    let category = categorizeTask(taskRef);
    switch (category) {
      case (#Governance) #Hierarchy;
      case (#Strategy) #Hierarchy;
      case (#Build) #Workforce;
      case (#Operations) #Workforce;
      case (#Analysis) #Workforce;
      case (#Memory) #Hierarchy;
      case (#Projection) #Hierarchy;
      case (#Defense) #Hierarchy;
    };
  };

  /// Get model family name as text.
  public func familyName(family : T.ModelFamily) : Text {
    switch (family) {
      case (#Strategist) "Strategist";
      case (#Builder) "Builder";
      case (#Analyst) "Analyst";
      case (#Governance) "Governance";
      case (#MemoryCurator) "MemoryCurator";
      case (#Operations) "Operations";
      case (#Defense) "Defense";
      case (#Projection) "Projection";
    };
  };
};
