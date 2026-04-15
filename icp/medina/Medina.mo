import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Iter "mo:base/Iter";

import T "./Types";
import Law "./LawEngine";
import MemoryTemple "./MemoryTemple";
import Governance "./Governance";
import ModelRouter "./ModelRouter";
import Company "./Company";
import Orchestrators "./Orchestrators";
import Matalko "./MatalkoICP";

actor Medina {
  stable var beat : Nat = 0;
  stable var lawEpoch : Nat = 0;

  stable var memoryNodes : [T.MemoryNode] = [];
  stable var proposals : [T.GovernanceProposal] = [];
  stable var tenants : [T.Tenant] = [];

  stable var replayRecords : [T.ReplayRecord] = [];
  stable var incidents : [T.IncidentRecord] = [];
  stable var runtimePermissions : [T.PermissionToggle] = [];

  stable var workspacePackets : [T.WorkspacePacket] = [];
  stable var modelInvocations : [T.ModelInvocation] = [];
  stable var snapshots : [T.StateSnapshot] = [];

  stable var authorityCoreA : [Text] = ["core-a"];
  stable var authorityCoreB : [Text] = ["core-b"];
  stable var projectionEvidenceOnly : Bool = true;

  private func nextId(prefix : Text, n : Nat) : Text {
    prefix # "-" # Nat.toText(n + 1);
  };

  private func defaultRegisters() : T.Register {
    { founder = "founder"; builder = "builder"; organism = "organism"; external = "external" };
  };

  private func defaultDualRead() : T.DualReadStatus {
    { semantic = true; resonance = true };
  };

  private func hasCoreAAuthority(actorId : Text) : Bool {
    Array.find<Text>(authorityCoreA, func(a : Text) : Bool { a == actorId }) != null;
  };

  private func hasCoreBAuthority(actorId : Text) : Bool {
    Array.find<Text>(authorityCoreB, func(a : Text) : Bool { a == actorId }) != null;
  };

  private func appendReplay(action : Text, lineageId : ?Text, gates : ?T.GateStatus, evidenceRefs : [Text]) : T.ReplayRecord {
    let rec : T.ReplayRecord = {
      id = nextId("replay", Array.size(replayRecords));
      action = action;
      lineageId = lineageId;
      gates = gates;
      evidenceRefs = evidenceRefs;
      atNs = T.nowNs();
    };
    replayRecords := Array.append(replayRecords, [rec]);
    rec;
  };

  private func appendIncident(kind : Text, detail : Text) : T.IncidentRecord {
    let rec : T.IncidentRecord = {
      id = nextId("incident", Array.size(incidents));
      kind = kind;
      detail = detail;
      atNs = T.nowNs();
    };
    incidents := Array.append(incidents, [rec]);
    rec;
  };

  private func snapshotState(reason : Text) : T.StateSnapshot {
    let snap : T.StateSnapshot = {
      id = nextId("snapshot", Array.size(snapshots));
      memoryNodes = memoryNodes;
      proposals = proposals;
      tenants = tenants;
      beat = beat;
      lawEpoch = lawEpoch;
      replayCount = Array.size(replayRecords);
      atNs = T.nowNs();
    };
    snapshots := Array.append(snapshots, [snap]);
    ignore appendReplay("snapshot:" # reason, ?snap.id, null, ["snapshot"]);
    snap;
  };

  private func splitWords(raw : Text) : [Text] {
    Iter.toArray(Text.split(raw, #char ' '));
  };

  private func parseNat(text : Text) : ?Nat {
    Nat.fromText(text);
  };

  private func modeFromText(raw : Text) : ?T.OnboardingMode {
    if (raw == "connect") {
      ?#Connect;
    } else if (raw == "internalize") {
      ?#Internalize;
    } else if (raw == "hybrid") {
      ?#Hybrid;
    } else {
      null;
    };
  };

  private func extractOption(tokens : [Text], key : Text) : ?Text {
    var idx : Nat = 0;
    var out : ?Text = null;
    while (idx + 1 < Array.size(tokens)) {
      if (tokens[idx] == key) {
        out := ?tokens[idx + 1];
      };
      idx += 1;
    };
    out;
  };

  private func parseCommand(raw : Text) : ?T.Command {
    let tokens = splitWords(raw);
    if (Array.size(tokens) == 0) {
      return null;
    };

    if (tokens[0] == "/memory" and Array.size(tokens) >= 2) {
      if (tokens[1] == "find") {
        let query = if (Array.size(tokens) >= 3) tokens[2] else "";
        let ring = switch (extractOption(tokens, "--ring")) {
          case null null;
          case (?r) parseNat(r);
        };
        let depth = switch (extractOption(tokens, "--depth")) {
          case null null;
          case (?d) parseNat(d);
        };
        return ?#MemoryFind({ query = query; ring = ring; depth = depth; lineage = extractOption(tokens, "--lineage") });
      };
      if (tokens[1] == "pin" and Array.size(tokens) >= 3) {
        return ?#MemoryPin({ memoryId = tokens[2]; reason = extractOption(tokens, "--reason") });
      };
      if (tokens[1] == "map" and Array.size(tokens) >= 3) {
        let mode = switch (extractOption(tokens, "--mode")) {
          case null "path";
          case (?m) m;
        };
        return ?#MemoryMap({ memoryId = tokens[2]; mode = mode });
      };
    };

    if (tokens[0] == "/govern" and Array.size(tokens) >= 2) {
      if (tokens[1] == "status") {
        return ?#GovernStatus({ proposalId = extractOption(tokens, "--proposal") });
      };
      if (tokens[1] == "propose" and Array.size(tokens) >= 4) {
        return ?#GovernPropose({ proposalType = tokens[2]; payloadRef = tokens[3] });
      };
      if (tokens[1] == "approve" and Array.size(tokens) >= 3) {
        return ?#GovernApprove({ proposalId = tokens[2]; policy = extractOption(tokens, "--policy") });
      };
    };

    if (tokens[0] == "/model" and Array.size(tokens) >= 2) {
      if (tokens[1] == "invoke" and Array.size(tokens) >= 4) {
        switch (ModelRouter.parseFamily(tokens[2])) {
          case null return null;
          case (?family) {
            return ?#ModelInvoke({ family = family; taskRef = tokens[3]; contextMemory = extractOption(tokens, "--context") });
          };
        };
      };
      if (tokens[1] == "route" and Array.size(tokens) >= 3) {
        return ?#ModelRoute({ taskRef = tokens[2]; policy = extractOption(tokens, "--policy") });
      };
    };

    if (tokens[0] == "/workspace" and Array.size(tokens) >= 3 and tokens[1] == "open") {
      return ?#WorkspaceOpen({ packetId = tokens[2] });
    };

    if (tokens[0] == "/company" and Array.size(tokens) >= 2) {
      if (tokens[1] == "onboard" and Array.size(tokens) >= 3) {
        let mode = switch (extractOption(tokens, "--mode")) {
          case null ?#Connect;
          case (?m) modeFromText(m);
        };
        switch (mode) {
          case null return null;
          case (?md) return ?#CompanyOnboard({ tenantId = tokens[2]; mode = md });
        };
      };
      if (tokens[1] == "connect" and Array.size(tokens) >= 4) {
        return ?#CompanyConnect({ tenantId = tokens[2]; connectorRef = tokens[3] });
      };
      if (tokens[1] == "internalize" and Array.size(tokens) >= 4) {
        return ?#CompanyInternalize({ tenantId = tokens[2]; domainRef = tokens[3] });
      };
      if (tokens[1] == "hybrid" and Array.size(tokens) >= 4) {
        return ?#CompanyHybrid({ tenantId = tokens[2]; planRef = tokens[3] });
      };
    };

    if (tokens[0] == "/replay" and Array.size(tokens) >= 3 and tokens[1] == "show") {
      return ?#ReplayShow({ workflowOrBundleId = tokens[2] });
    };

    if (tokens[0] == "/run" and Array.size(tokens) >= 2) {
      return ?#Run({ workflowRef = tokens[1] });
    };

    null;
  };

  private func findMemoryById(memoryId : Text) : ?T.MemoryNode {
    MemoryTemple.findById(memoryNodes, memoryId);
  };

  private func putMemory(updated : T.MemoryNode) {
    memoryNodes := Array.map<T.MemoryNode, T.MemoryNode>(
      memoryNodes,
      func(n : T.MemoryNode) : T.MemoryNode {
        if (n.id == updated.id) { updated } else { n };
      },
    );
  };

  private func findTenantById(tenantId : Text) : ?T.Tenant {
    Array.find<T.Tenant>(tenants, func(t : T.Tenant) : Bool { t.id == tenantId });
  };

  private func putTenant(updated : T.Tenant) {
    tenants := Array.map<T.Tenant, T.Tenant>(
      tenants,
      func(t : T.Tenant) : T.Tenant {
        if (t.id == updated.id) { updated } else { t };
      },
    );
  };

  private func mutationGates(projectionSafe : Bool) : T.GateStatus {
    Orchestrators.evaluateBeat(defaultDualRead(), 0, true, projectionSafe, true);
  };

  private func allGatesPass(g : T.GateStatus) : Bool {
    Law.allGatesPass(g);
  };

  private func stateSummary() : Text {
    "memory=" # Nat.toText(Array.size(memoryNodes)) #
    ",proposals=" # Nat.toText(Array.size(proposals)) #
    ",tenants=" # Nat.toText(Array.size(tenants));
  };

  private func checkPermission(scope : Text) : Bool {
    switch (Array.find<T.PermissionToggle>(runtimePermissions, func(p : T.PermissionToggle) : Bool { p.scope == scope })) {
      case null false;
      case (?p) p.enabled;
    };
  };

  private func requirePermission(scope : Text) : ?T.CommandResult {
    if (checkPermission(scope)) {
      null;
    } else {
      let inc = appendIncident("permission", "missing permission: " # scope);
      ?{
        status = #Blocked;
        message = "permission blocked: " # scope;
        lineageId = null;
        gates = null;
        evidenceRefs = [inc.id];
      };
    };
  };

  public query func health() : async T.RuntimeHealth {
    {
      beat = beat;
      lawEpoch = lawEpoch;
      memoryCount = Array.size(memoryNodes);
      proposalCount = Array.size(proposals);
      tenantCount = Array.size(tenants);
      replayCount = Array.size(replayRecords);
      incidentCount = Array.size(incidents);
      dualReadHealthy = true;
      noOrphanMicroSignals = true;
    };
  };

  public query func ontology() : async [Text] {
    Law.nonCollapseOntologyInvariant();
  };

  public query func orchestratorRegistry() : async [Orchestrators.Orchestrator] {
    Orchestrators.registry;
  };

  public query func modelFamilies() : async [Text] {
    ModelRouter.modelFamilyNames();
  };

  public query func documentWorkforce() : async [Text] {
    ModelRouter.dWorkforce;
  };

  public query func sovereignHierarchy() : async [Text] {
    ModelRouter.nHierarchy;
  };

  public query func permissions() : async [T.PermissionToggle] {
    runtimePermissions;
  };

  public func setPermission(scope : Text, enabled : Bool, actorId : Text) : async T.PermissionToggle {
    runtimePermissions := Array.filter<T.PermissionToggle>(runtimePermissions, func(p : T.PermissionToggle) : Bool { p.scope != scope });
    let next : T.PermissionToggle = { scope = scope; enabled = enabled; updatedBy = actorId; updatedAtNs = T.nowNs() };
    runtimePermissions := Array.append(runtimePermissions, [next]);
    ignore appendReplay("permission.set", ?scope, null, ["audit:permission"]);
    next;
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
    if (not allGatesPass(gates)) { ignore appendIncident("gate-block", "beat failed Gate A/B/C checks"); };
    let replay = appendReplay("sovereign.beat", null, ?gates, ["beat:" # Nat.toText(beat)]);
    {
      beat = beat;
      macroAbsorbed = orphanMicroSignals == 0;
      orphanMicroSignals = orphanMicroSignals;
      dualRead = dualRead;
      lawEpoch = lawEpoch;
      gates = gates;
      replayRef = replay.id;
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
      pinned = false;
      promoted = false;
      consolidatedFrom = [];
      createdAtNs = T.nowNs();
    };
    memoryNodes := Array.append(memoryNodes, [node]);
    ignore appendReplay("memory.add", ?id, ?mutationGates(true), ["memory"]);
    node;
  };

  public query func memoryFind(query : Text, ring : ?Nat, depth : ?Nat, lineage : ?Text) : async [T.MemoryNode] {
    MemoryTemple.find(memoryNodes, query, ring, depth, lineage);
  };

  public query func memoryList(limit : Nat) : async [T.MemoryNode] {
    if (limit >= Array.size(memoryNodes)) {
      memoryNodes;
    } else {
      Array.tabulate<T.MemoryNode>(limit, func(i : Nat) : T.MemoryNode { memoryNodes[Array.size(memoryNodes) - limit + i] });
    };
  };

  public func memoryPromote(memoryId : Text, actorId : Text) : async Bool {
    if (not hasCoreBAuthority(actorId)) {
      ignore appendIncident("auth", "memoryPromote denied: requires Core B authority");
      return false;
    };
    switch (findMemoryById(memoryId)) {
      case null false;
      case (?node) {
        putMemory(MemoryTemple.promote(node));
        ignore appendReplay("memory.promote", ?memoryId, ?mutationGates(true), ["promotion"]);
        true;
      };
    };
  };

  public func memoryConsolidate(targetId : Text, sourceIds : [Text], fromId : Text, actorId : Text) : async ?T.MemoryNode {
    if (not hasCoreBAuthority(actorId)) {
      ignore appendIncident("auth", "memoryConsolidate denied: requires Core B authority");
      return null;
    };
    switch (findMemoryById(fromId)) {
      case null null;
      case (?source) {
        let merged = MemoryTemple.consolidate(targetId, sourceIds, source);
        memoryNodes := Array.append(memoryNodes, [merged]);
        ignore appendReplay("memory.consolidate", ?targetId, ?mutationGates(true), ["consolidation"]);
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
    ignore appendReplay("govern.propose", ?id, ?gateSnapshot, ["proposal"]);
    p;
  };

  public func governApprove(proposalId : Text, policy : ?Text, actorId : Text) : async ?T.GovernanceProposal {
    if (not hasCoreAAuthority(actorId)) {
      ignore appendIncident("auth", "governApprove denied: requires Core A authority");
      return null;
    };
    var approved : ?T.GovernanceProposal = null;
    proposals := Array.map<T.GovernanceProposal, T.GovernanceProposal>(
      proposals,
      func(p : T.GovernanceProposal) : T.GovernanceProposal {
        if (p.id == proposalId) {
          let next = Governance.approve(p, policy, actorId);
          approved := ?next;
          next;
        } else {
          p;
        };
      },
    );
    switch (approved) {
      case null {};
      case (?a) { ignore appendReplay("govern.approve", ?a.id, ?a.gateSnapshot, a.evidenceRefs); };
    };
    approved;
  };

  public query func governStatus(proposalId : ?Text) : async Text {
    switch (proposalId) {
      case null "proposals=" # Nat.toText(Array.size(proposals));
      case (?pid) {
        switch (Array.find<T.GovernanceProposal>(proposals, func(p : T.GovernanceProposal) : Bool { p.id == pid })) {
          case null "not-found";
          case (?p) Governance.statusText(p);
        };
      };
    };
  };

  public query func proposalList(limit : Nat) : async [T.GovernanceProposal] {
    if (limit >= Array.size(proposals)) {
      proposals;
    } else {
      Array.tabulate<T.GovernanceProposal>(limit, func(i : Nat) : T.GovernanceProposal { proposals[Array.size(proposals) - limit + i] });
    };
  };

  public func companyOnboard(tenantId : Text, mode : T.OnboardingMode, policyRefs : [Text]) : async T.Tenant {
    let existing = findTenantById(tenantId);
    let t = switch (existing) {
      case null Company.onboard(tenantId, mode, policyRefs);
      case (?old) { { id = old.id; mode = mode; isolated = true; policyRefs = policyRefs; replayRefs = old.replayRefs; createdAtNs = old.createdAtNs } };
    };
    tenants := Array.filter<T.Tenant>(tenants, func(v : T.Tenant) : Bool { v.id != tenantId });
    tenants := Array.append(tenants, [t]);
    ignore appendReplay("company.onboard", ?tenantId, ?mutationGates(true), ["tenant:onboard"]);
    t;
  };

  public func companyConnect(tenantId : Text, connectorRef : Text) : async ?T.Tenant {
    switch (findTenantById(tenantId)) {
      case null null;
      case (?tenant) {
        let updated = Company.connectRecord(tenant, connectorRef);
        putTenant(updated);
        ignore appendReplay("company.connect", ?tenantId, ?mutationGates(true), ["connector:" # connectorRef]);
        ?updated;
      };
    };
  };

  public func companyInternalize(tenantId : Text, domainRef : Text) : async ?T.Tenant {
    switch (findTenantById(tenantId)) {
      case null null;
      case (?tenant) {
        let updated = Company.internalizeRecord(tenant, domainRef);
        putTenant(updated);
        ignore appendReplay("company.internalize", ?tenantId, ?mutationGates(true), ["domain:" # domainRef]);
        ?updated;
      };
    };
  };

  public func companyHybrid(tenantId : Text, planRef : Text) : async ?T.Tenant {
    switch (findTenantById(tenantId)) {
      case null null;
      case (?tenant) {
        let updated = Company.hybridRecord(tenant, planRef);
        putTenant(updated);
        ignore appendReplay("company.hybrid", ?tenantId, ?mutationGates(true), ["plan:" # planRef]);
        ?updated;
      };
    };
  };

  public query func tenantList() : async [T.Tenant] {
    tenants;
  };

  public query func modelRoute(taskRef : Text, policy : ?Text) : async T.ModelRoute {
    ModelRouter.routeForTask(taskRef, policy);
  };

  private func modelOutput(family : T.ModelFamily, taskRef : Text, context : ?Text) : Text {
    let contextText = switch (context) {
      case null "none";
      case (?m) m;
    };
    switch (family) {
      case (#Strategist) "strategy-plan:" # taskRef # ":context=" # contextText;
      case (#Builder) "build-plan:" # taskRef # ":context=" # contextText;
      case (#Analyst) "analysis:" # taskRef # ":context=" # contextText;
      case (#Governance) "governance-verdict:" # taskRef;
      case (#MemoryCurator) "memory-curation:" # taskRef;
      case (#Operations) "ops-runbook:" # taskRef;
      case (#Defense) "defense-assessment:" # taskRef;
      case (#Projection) {
        if (projectionEvidenceOnly) { "projection-safe:" # taskRef } else { "projection-open:" # taskRef };
      };
    };
  };

  public func modelInvoke(family : T.ModelFamily, taskRef : Text, contextMemory : ?Text) : async T.ModelInvocation {
    let route = ModelRouter.routeForTask(taskRef, null);
    let routeAligned = route.family == family;
    let fallbackSource = if (routeAligned) null else ?"router-correction";
    let incidentRef = if (routeAligned) { null } else { ?appendIncident("route-mismatch", "requested model family differs from routed family").id };
    let invocation : T.ModelInvocation = {
      id = nextId("invoke", Array.size(modelInvocations));
      family = family;
      taskRef = taskRef;
      contextMemory = contextMemory;
      routeRationale = route.rationale;
      output = modelOutput(family, taskRef, contextMemory);
      fallbackSource = fallbackSource;
      incidentRef = incidentRef;
      atNs = T.nowNs();
    };
    modelInvocations := Array.append(modelInvocations, [invocation]);
    ignore appendReplay("model.invoke", ?invocation.id, ?mutationGates(true), ["model", ModelRouter.familyName(family)]);
    invocation;
  };

  public query func modelInvocationList(limit : Nat) : async [T.ModelInvocation] {
    if (limit >= Array.size(modelInvocations)) {
      modelInvocations;
    } else {
      Array.tabulate<T.ModelInvocation>(limit, func(i : Nat) : T.ModelInvocation { modelInvocations[Array.size(modelInvocations) - limit + i] });
    };
  };

  public func workspaceOpen(packetId : Text) : async T.WorkspacePacket {
    let packet : T.WorkspacePacket = {
      id = packetId;
      constitution = "constitution:" # packetId;
      work = "work:" # packetId;
      arbitration = "arbitration:" # packetId;
      integration = "integration:" # packetId;
      replayBundle = null;
      atNs = T.nowNs();
    };
    workspacePackets := Array.filter<T.WorkspacePacket>(workspacePackets, func(w : T.WorkspacePacket) : Bool { w.id != packetId });
    workspacePackets := Array.append(workspacePackets, [packet]);
    ignore appendReplay("workspace.open", ?packetId, ?mutationGates(true), ["workspace"]);
    packet;
  };

  public query func workspaceList(limit : Nat) : async [T.WorkspacePacket] {
    if (limit >= Array.size(workspacePackets)) {
      workspacePackets;
    } else {
      Array.tabulate<T.WorkspacePacket>(limit, func(i : Nat) : T.WorkspacePacket { workspacePackets[Array.size(workspacePackets) - limit + i] });
    };
  };

  public func runWorkflow(workflowRef : Text) : async T.CommandResult {
    let route = ModelRouter.routeForTask(workflowRef, null);
    let gates = mutationGates(projectionEvidenceOnly);
    if (not allGatesPass(gates)) {
      let incident = appendIncident("workflow-block", "workflow blocked by gate failure");
      return { status = #Blocked; message = "workflow blocked: " # incident.id; lineageId = ?workflowRef; gates = ?gates; evidenceRefs = [incident.id] };
    };
    let invocation = await modelInvoke(route.family, workflowRef, null);
    let replay = appendReplay("workflow.run:" # workflowRef, ?workflowRef, ?gates, ["route:" # route.label, invocation.id]);
    { status = #Ok; message = "workflow executed"; lineageId = ?workflowRef; gates = ?gates; evidenceRefs = [replay.id, invocation.id] };
  };

  public query func replayShow(id : Text) : async [T.ReplayRecord] {
    Array.filter<T.ReplayRecord>(replayRecords, func(r : T.ReplayRecord) : Bool { r.id == id or r.action == id or r.lineageId == ?id });
  };

  public query func replayAll(limit : Nat) : async [T.ReplayRecord] {
    if (limit >= Array.size(replayRecords)) {
      replayRecords;
    } else {
      Array.tabulate<T.ReplayRecord>(limit, func(i : Nat) : T.ReplayRecord { replayRecords[Array.size(replayRecords) - limit + i] });
    };
  };

  public query func incidentAll(limit : Nat) : async [T.IncidentRecord] {
    if (limit >= Array.size(incidents)) {
      incidents;
    } else {
      Array.tabulate<T.IncidentRecord>(limit, func(i : Nat) : T.IncidentRecord { incidents[Array.size(incidents) - limit + i] });
    };
  };

  public query func snapshotList(limit : Nat) : async [T.StateSnapshot] {
    if (limit >= Array.size(snapshots)) {
      snapshots;
    } else {
      Array.tabulate<T.StateSnapshot>(limit, func(i : Nat) : T.StateSnapshot { snapshots[Array.size(snapshots) - limit + i] });
    };
  };

  private func runParsedCommand(cmd : T.Command) : async T.CommandResult {
    switch (cmd) {
      case (#MemoryFind c) {
        let results = MemoryTemple.find(memoryNodes, c.query, c.ring, c.depth, c.lineage);
        { status = #Ok; message = "memory.find results=" # Nat.toText(Array.size(results)); lineageId = null; gates = null; evidenceRefs = [] };
      };
      case (#MemoryPin c) {
        switch (findMemoryById(c.memoryId)) {
          case null { { status = #Error; message = "memory not found"; lineageId = ?c.memoryId; gates = null; evidenceRefs = [] } };
          case (?node) {
            let pinned = MemoryTemple.pin(node, c.reason);
            putMemory(pinned);
            let replay = appendReplay("memory.pin", ?node.id, ?mutationGates(true), ["pin"]);
            { status = #Ok; message = "memory pinned"; lineageId = ?node.id; gates = ?mutationGates(true); evidenceRefs = [replay.id] };
          };
        };
      };
      case (#MemoryMap c) {
        switch (findMemoryById(c.memoryId)) {
          case null { { status = #Error; message = "memory not found"; lineageId = ?c.memoryId; gates = null; evidenceRefs = [] } };
          case (?node) {
            { status = #Ok; message = MemoryTemple.mapPath(node, c.mode); lineageId = ?node.id; gates = null; evidenceRefs = [] };
          };
        };
      };
      case (#GovernStatus c) { { status = #Ok; message = await governStatus(c.proposalId); lineageId = null; gates = null; evidenceRefs = [] } };
      case (#GovernPropose c) {
        let gates = mutationGates(true);
        let proposal = await governPropose(c.proposalType, c.payloadRef, defaultRegisters(), "runtime-truth", "proposal", defaultDualRead(), gates);
        { status = #Ok; message = "proposal created"; lineageId = ?proposal.id; gates = ?gates; evidenceRefs = ["proposal:" # proposal.id] };
      };
      case (#GovernApprove c) {
        let approved = await governApprove(c.proposalId, c.policy, "core-a");
        switch (approved) {
          case null { { status = #Blocked; message = "proposal approval denied"; lineageId = ?c.proposalId; gates = null; evidenceRefs = [] } };
          case (?p) { { status = #Ok; message = "proposal status=" # Governance.statusText(p); lineageId = ?p.id; gates = ?p.gateSnapshot; evidenceRefs = p.evidenceRefs } };
        };
      };
      case (#ModelInvoke c) {
        let invocation = await modelInvoke(c.family, c.taskRef, c.contextMemory);
        { status = #Ok; message = invocation.output; lineageId = ?invocation.id; gates = null; evidenceRefs = switch (invocation.incidentRef) { case null ["route-ok"]; case (?i) ["incident:" # i] } };
      };
      case (#ModelRoute c) {
        let route = await modelRoute(c.taskRef, c.policy);
        { status = #Ok; message = "model.route " # route.label; lineageId = null; gates = null; evidenceRefs = [route.rationale] };
      };
      case (#WorkspaceOpen c) {
        let packet = await workspaceOpen(c.packetId);
        { status = #Ok; message = "workspace.open " # packet.id; lineageId = ?packet.id; gates = ?mutationGates(true); evidenceRefs = ["packet:" # packet.id] };
      };
      case (#CompanyOnboard c) {
        switch (requirePermission("connectors")) {
          case (?blocked) blocked;
          case null {
            let tenant = await companyOnboard(c.tenantId, c.mode, ["policy:default"]);
            { status = #Ok; message = "tenant onboarded mode=" # Company.modeText(tenant.mode); lineageId = ?tenant.id; gates = ?mutationGates(true); evidenceRefs = ["tenant:" # tenant.id] };
          };
        };
      };
      case (#CompanyConnect c) {
        switch (requirePermission("connectors")) {
          case (?blocked) blocked;
          case null {
            switch (await companyConnect(c.tenantId, c.connectorRef)) {
              case null { { status = #Error; message = "tenant not found"; lineageId = ?c.tenantId; gates = null; evidenceRefs = [] } };
              case (?tenant) { { status = #Ok; message = "tenant connected"; lineageId = ?tenant.id; gates = ?mutationGates(true); evidenceRefs = ["connector:" # c.connectorRef] } };
            };
          };
        };
      };
      case (#CompanyInternalize c) {
        switch (requirePermission("filesystem")) {
          case (?blocked) blocked;
          case null {
            switch (await companyInternalize(c.tenantId, c.domainRef)) {
              case null { { status = #Error; message = "tenant not found"; lineageId = ?c.tenantId; gates = null; evidenceRefs = [] } };
              case (?tenant) { { status = #Ok; message = "tenant internalized"; lineageId = ?tenant.id; gates = ?mutationGates(true); evidenceRefs = ["domain:" # c.domainRef] } };
            };
          };
        };
      };
      case (#CompanyHybrid c) {
        switch (await companyHybrid(c.tenantId, c.planRef)) {
          case null { { status = #Error; message = "tenant not found"; lineageId = ?c.tenantId; gates = null; evidenceRefs = [] } };
          case (?tenant) { { status = #Ok; message = "tenant hybrid updated"; lineageId = ?tenant.id; gates = ?mutationGates(true); evidenceRefs = ["plan:" # c.planRef] } };
        };
      };
      case (#ReplayShow c) {
        let records = await replayShow(c.workflowOrBundleId);
        { status = #Ok; message = "replay records=" # Nat.toText(Array.size(records)); lineageId = ?c.workflowOrBundleId; gates = null; evidenceRefs = Array.map<T.ReplayRecord, Text>(records, func(r : T.ReplayRecord) : Text { r.id }) };
      };
      case (#Run c) { await runWorkflow(c.workflowRef) };
    };
  };

  public func runCommand(cmd : T.Command) : async T.CommandResult {
    let before = stateSummary();
    let res = await runParsedCommand(cmd);
    let after = stateSummary();
    ignore appendReplay("command.typed", res.lineageId, res.gates, Array.append<Text>(res.evidenceRefs, ["before:" # before, "after:" # after]));
    if (res.status == #Blocked or res.status == #Error) { ignore appendIncident("command", res.message) };
    res;
  };

  public func runTextCommand(raw : Text) : async T.CommandResult {
    switch (parseCommand(raw)) {
      case null {
        let inc = appendIncident("parse", "unable to parse command: " # raw);
        { status = #Error; message = "unable to parse command"; lineageId = null; gates = null; evidenceRefs = [inc.id] };
      };
      case (?cmd) {
        let before = stateSummary();
        let res = await runParsedCommand(cmd);
        let after = stateSummary();
        ignore appendReplay("command.text:" # raw, res.lineageId, res.gates, Array.append<Text>(res.evidenceRefs, ["before:" # before, "after:" # after]));
        if (res.status == #Blocked or res.status == #Error) { ignore appendIncident("command", res.message # " raw=" # raw) };
        res;
      };
    };
  };

  public func projectionPolicy(enabledEvidenceBoundary : Bool, actorId : Text) : async Bool {
    if (not hasCoreAAuthority(actorId)) {
      ignore appendIncident("auth", "projectionPolicy denied: requires Core A authority");
      return projectionEvidenceOnly;
    };
    projectionEvidenceOnly := enabledEvidenceBoundary;
    ignore appendReplay("projection.policy", null, ?mutationGates(enabledEvidenceBoundary), ["projection-boundary"]);
    projectionEvidenceOnly;
  };

  public query func projectionStatus() : async Bool {
    projectionEvidenceOnly;
  };

  public func bootstrapDemo(actorId : Text) : async Text {
    if (not hasCoreAAuthority(actorId)) {
      return "denied: requires core-a";
    };
    ignore await setPermission("filesystem", true, actorId);
    ignore await setPermission("connectors", true, actorId);
    ignore await setPermission("cloud-compute", true, actorId);
    ignore await memoryAdd("medina-runtime-origin", { theta = 0.0; phi = 0.0; depth = 0; ring = 0; beat = beat }, "bootstrap", "initial-memory", 10, ["origin", "runtime"]);
    ignore await companyOnboard("tenant-default", #Hybrid, ["policy:default", "policy:audit"]);
    ignore await runWorkflow("strategy");
    ignore snapshotState("bootstrap");
    "bootstrapped";
  };

  public func rollbackTo(snapshotId : Text, actorId : Text) : async Bool {
    if (not hasCoreAAuthority(actorId)) {
      ignore appendIncident("auth", "rollback denied: requires Core A authority");
      return false;
    };
    switch (Array.find<T.StateSnapshot>(snapshots, func(s : T.StateSnapshot) : Bool { s.id == snapshotId })) {
      case null false;
      case (?snap) {
        memoryNodes := snap.memoryNodes;
        proposals := snap.proposals;
        tenants := snap.tenants;
        beat := snap.beat;
        lawEpoch := snap.lawEpoch;
        ignore appendReplay("rollback", ?snapshotId, ?mutationGates(true), ["rollback"]);
        true;
      };
    };
  };

  public query func matalkoSnapshot() : async T.MatalkoSnapshot {
    let micro : [Float] = [Float.fromInt(Array.size(memoryNodes)), Float.fromInt(Array.size(proposals)), Float.fromInt(Array.size(tenants))];
    let macro = Matalko.macroAbsorption(1.0, micro);
    let energy = Matalko.dualReadEnergy(1.0, 1.0);
    let stability = Matalko.physicsStability(energy, 0.1);
    let chemistry = Matalko.chemistryPotential(1.0, 0.2);
    { macroField = macro; dualReadEnergy = energy; stability = stability; chemistryPotential = chemistry; atNs = T.nowNs() };
  };
};
