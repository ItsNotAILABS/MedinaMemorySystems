import T "./Types";

module {
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

  public func routeForTask(taskRef : Text, policy : ?Text) : T.ModelRoute {
    if (taskRef == "governance" or taskRef == "law") {
      {
        family = #Governance;
        rationale = "Governance-sensitive workflow requires governance model.";
        fallbackSource = null;
        incidentRef = null;
      };
    } else if (taskRef == "memory") {
      {
        family = #MemoryCurator;
        rationale = "Memory mutation/retrieval requires memory curator model.";
        fallbackSource = null;
        incidentRef = null;
      };
    } else if (taskRef == "projection") {
      {
        family = #Projection;
        rationale = "External projection requires bounded projection model.";
        fallbackSource = null;
        incidentRef = null;
      };
    } else {
      {
        family = #Analyst;
        rationale = switch (policy) {
          case null "Default analytical route.";
          case (?p) "Policy-guided analytical route: " # p;
        };
        fallbackSource = null;
        incidentRef = null;
      };
    };
  };
};
