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

  public func familyName(f : T.ModelFamily) : Text {
    switch (f) {
      case (#Strategist) "strategist";
      case (#Builder) "builder";
      case (#Analyst) "analyst";
      case (#Governance) "governance";
      case (#MemoryCurator) "memory-curator";
      case (#Operations) "operations";
      case (#Defense) "defense";
      case (#Projection) "projection";
    };
  };

  public func modelFamilyNames() : [Text] {
    [
      "strategist",
      "builder",
      "analyst",
      "governance",
      "memory-curator",
      "operations",
      "defense",
      "projection",
    ];
  };

  public func parseFamily(name : Text) : ?T.ModelFamily {
    if (name == "strategist") {
      ?#Strategist;
    } else if (name == "builder") {
      ?#Builder;
    } else if (name == "analyst") {
      ?#Analyst;
    } else if (name == "governance") {
      ?#Governance;
    } else if (name == "memory-curator" or name == "memory_curator" or name == "memory") {
      ?#MemoryCurator;
    } else if (name == "operations" or name == "ops") {
      ?#Operations;
    } else if (name == "defense" or name == "risk" or name == "defense-risk") {
      ?#Defense;
    } else if (name == "projection") {
      ?#Projection;
    } else {
      null;
    };
  };

  public func routeForTask(taskRef : Text, policy : ?Text) : T.ModelRoute {
    if (taskRef == "governance" or taskRef == "law") {
      {
        family = #Governance;
        label = "governance";
        rationale = "Governance-sensitive workflow requires governance model.";
        fallbackSource = null;
        incidentRef = null;
      };
    } else if (taskRef == "memory") {
      {
        family = #MemoryCurator;
        label = "memory-curator";
        rationale = "Memory mutation/retrieval requires memory curator model.";
        fallbackSource = null;
        incidentRef = null;
      };
    } else if (taskRef == "projection") {
      {
        family = #Projection;
        label = "projection";
        rationale = "External projection requires bounded projection model.";
        fallbackSource = null;
        incidentRef = null;
      };
    } else if (taskRef == "build") {
      {
        family = #Builder;
        label = "builder";
        rationale = "Build tasks require builder model.";
        fallbackSource = null;
        incidentRef = null;
      };
    } else if (taskRef == "strategy") {
      {
        family = #Strategist;
        label = "strategist";
        rationale = "Strategic planning routes to strategist model.";
        fallbackSource = null;
        incidentRef = null;
      };
    } else {
      {
        family = #Analyst;
        label = "analyst";
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
