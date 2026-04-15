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

  stable var organismDocs : [T.DocumentArtifact] = [];
  stable var sandboxArtifacts : [T.SandboxArtifact] = [];
  stable var contradictionCases : [T.ContradictionCase] = [];

  stable var voiceProfiles : [T.VoiceProfile] = [];
  stable var voiceFrames : [T.VoiceFrame] = [];
  stable var terminalEntries : [T.TerminalEntry] = [];
  stable var approvalLayers : [T.ApprovalLayerRecord] = [];
  stable var actionOutputs : [T.ActionOutput] = [];

  stable var deviceNodes : [T.DeviceNode] = [];
  stable var deviceJumpTokens : [T.DeviceJumpToken] = [];
  stable var sovereignContracts : [T.SovereignContract] = [];

  stable var novaReviews : [T.NovaReview] = [];
  stable var dualConsensus : [T.DualConsensus] = [];

  stable var workforceOrganisms : [T.WorkforceOrganism] = [];
  stable var cplPackets : [T.CplPacket] = [];

  stable var settingsHub : T.SettingsHub = {
    devicesTab = true;
    permissionsTab = true;
    contractsTab = true;
    frequenciesTab = true;
    harmonicLadder = [7.83, 432.0, 864.0];
    storageMode = "blockchain-only";
  };

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

  private func appendActionOutput(action : Text, payload : Text, format : Text, pathRef : Text) : T.ActionOutput {
    let out : T.ActionOutput = {
      id = nextId("output", Array.size(actionOutputs));
      action = action;
      payload = payload;
      format = format;
      pathRef = pathRef;
      atNs = T.nowNs();
    };
    actionOutputs := Array.append(actionOutputs, [out]);
    out;
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
        if (n.id == updated.id) {
          updated;
        } else {
          n;
        };
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
        if (t.id == updated.id) {
          updated;
        } else {
          t;
        };
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

  // ===== Document Organism Seeding =====
  private func seedDocument(path : Text, title : Text, category : Text, content : Text) {
    let doc : T.DocumentArtifact = {
      id = nextId("doc", Array.size(organismDocs));
      category = category;
      path = path;
      title = title;
      content = content;
      creator = "MEDINA-FOUNDER";
      version = 1;
      atNs = T.nowNs();
    };
    organismDocs := Array.append(organismDocs, [doc]);
  };

  private func ensureDocumentOrganismSeeded() {
    if (Array.size(organismDocs) > 0) {
      return;
    };

    seedDocument("ORGANISM_SPACE/GENOME/GENOME.artifact", "GENOME", "organism", "state(n+1)=recital(validated_state_n)+one_lawful_expansion");
    seedDocument("ORGANISM_SPACE/CONSCIOUSNESS_CORE/CONSCIOUSNESS_CORE.artifact", "CONSCIOUSNESS_CORE", "organism", "documents are intelligence substrate");
    seedDocument("ORGANISM_SPACE/MEMORY_PALACE/MEMORY_PALACE_MAP.artifact", "MEMORY_PALACE_MAP", "organism", "(theta,phi,depth,ring,beat) topology");
    seedDocument("ORGANISM_SPACE/CLIMATE/CLIMATE_STATE.artifact", "CLIMATE_STATE", "climate", "schumann,circadian,calendar,resonance");
    seedDocument("ORGANISM_SPACE/CLIMATE/SCHUMANN_ANCHORS.artifact", "SCHUMANN_ANCHORS", "climate", "7.83,14.3,20.8,27.3");
    seedDocument("ORGANISM_SPACE/FREQUENCY_LADDER/FREQUENCY_LADDER.artifact", "FREQUENCY_LADDER", "climate", "7.83/432/864 harmonic ladder");

    seedDocument("LAW_HOLDERS/PHI_SOVEREIGN/PHI_SOVEREIGN_LAW.artifact", "PHI_SOVEREIGN", "law", "phi = 1 + 1/phi");
    seedDocument("LAW_HOLDERS/TRIUNE_SUBSTRATE/TRIUNE_SUBSTRATE_LAW.artifact", "TRIUNE_SUBSTRATE", "law", "runtime truth + memory + interface triune");
    seedDocument("LAW_HOLDERS/RECITAL_PLUS_ONE/RECITAL_PLUS_ONE_LAW.artifact", "RECITAL_PLUS_ONE", "law", "state evolution with lineage");
    seedDocument("LAW_HOLDERS/VIGESIMAL_20/VIGESIMAL_20_LAW.artifact", "VIGESIMAL_20", "law", "base-20 indexing law");
    seedDocument("LAW_HOLDERS/FOUR_D_EXTENSION/FOUR_D_EXTENSION_LAW.artifact", "FOUR_D_EXTENSION", "law", "spatial-temporal extension law");
    seedDocument("LAW_HOLDERS/HARMONIC_MEMORY_PALACE/HARMONIC_MEMORY_PALACE_LAW.artifact", "HARMONIC_MEMORY_PALACE", "law", "harmonic loci law");
    seedDocument("LAW_HOLDERS/COMPLEMENTARY_OPPOSITION/COMPLEMENTARY_OPPOSITION_LAW.artifact", "COMPLEMENTARY_OPPOSITION", "law", "contradiction resolution law");

    seedDocument("LAW_HOLDERS/SANDBOX_LAWS/L33_SANDBOX_SOVEREIGNTY.artifact", "L33", "law", "no raw input touches core");
    seedDocument("LAW_HOLDERS/SANDBOX_LAWS/L34_TRANSLATION_COMPLETENESS.artifact", "L34", "law", "form changes, meaning does not");
    seedDocument("LAW_HOLDERS/SANDBOX_LAWS/L35_CONTRADICTION_VISIBILITY.artifact", "L35", "law", "no silent contradiction");
    seedDocument("LAW_HOLDERS/SANDBOX_LAWS/L36_PROVENANCE_IMMUTABILITY.artifact", "L36", "law", "immutable attribution chain");
    seedDocument("LAW_HOLDERS/SANDBOX_LAWS/L37_AGI_INTERFACE.artifact", "L37", "law", "sandbox is interface protocol");
    seedDocument("LAW_HOLDERS/SANDBOX_LAWS/L38_SELF_MODIFICATION_SOVEREIGNTY.artifact", "L38", "law", "self-modification governance gate");
    seedDocument("LAW_HOLDERS/SANDBOX_LAWS/L39_DREAM_TRANSLATION.artifact", "L39", "law", "autonomous outputs translated before ingestion");
    seedDocument("LAW_HOLDERS/SANDBOX_LAWS/L40_RESONANCE_GATE.artifact", "L40", "law", "below-floor resonance held");
    seedDocument("LAW_HOLDERS/SANDBOX_LAWS/L41_LINEAGE_SEAL.artifact", "L41", "law", "family-tier lineage seal required");

    var m : Nat = 92;
    while (m <= 108) {
      seedDocument("ORGANISM_SPACE/MODELS/M" # Nat.toText(m) # "_MODEL.artifact", "M" # Nat.toText(m), "model", "sandbox model M" # Nat.toText(m));
      m += 1;
    };

    var n : Nat = 1;
    while (n <= 12) {
      seedDocument("ORGANISM_SPACE/CANISTERS/N" # Nat.toText(n) # "_NODE.artifact", "N" # Nat.toText(n), "canister", "self-reading canister node N" # Nat.toText(n));
      n += 1;
    };

    seedDocument("BUILDER_WORKSPACE/DOCTRINE/DOCTRINE_OPERATING_SYSTEM.artifact", "BUILDER_DOCTRINE", "builder", "builders read doctrine before coding");
    seedDocument("FOUNDER_SPACE/FOUNDING_WORD/FOUNDING_WORD.artifact", "FOUNDING_WORD", "founder", "real architecture, real intelligence, real operations");
  };

  // ===== Sandbox Translation Layer =====
  private func structuralRecognition(raw : Text) : Text {
    if (Text.contains(raw, #text "=") or Text.contains(raw, #text "ratio")) {
      "ratio_or_equation";
    } else if (Text.contains(raw, #text "law") or Text.contains(raw, #text "doctrine")) {
      "law_statement";
    } else if (Text.contains(raw, #text "contradict") or Text.contains(raw, #text "conflict")) {
      "contradiction";
    } else if (Text.contains(raw, #text "frequency") or Text.contains(raw, #text "hz")) {
      "resonance_event";
    } else {
      "relational_claim";
    };
  };

  private func alphaAlignment(raw : Text) : (Float, Float) {
    var a1 : Float = 0.62;
    var a2 : Float = 0.62;

    if (Text.contains(raw, #text "phi") or Text.contains(raw, #text "1.618")) {
      a1 := 0.93;
    };
    if (Text.contains(raw, #text "prima") or Text.contains(raw, #text "distance")) {
      a2 := 0.9;
    };
    if (Text.contains(raw, #text "govern") or Text.contains(raw, #text "law")) {
      a1 := 0.88;
      a2 := 0.88;
    };

    (a1, a2);
  };

  private func frequencySignature(raw : Text) : Float {
    if (Text.contains(raw, #text "432")) {
      432.0;
    } else if (Text.contains(raw, #text "7.83")) {
      7.83;
    } else {
      144.0;
    };
  };

  private func findContradictions(raw : Text) : [Text] {
    if (Text.contains(raw, #text "not") and Text.contains(raw, #text "is")) {
      ["possible contradictory assertion"];
    } else {
      [];
    };
  };

  private func thoughtForm(raw : Text, structural : Text, a1 : Float, a2 : Float) : Text {
    "structure=" # structural #
    ";alpha1=" # Float.toText(a1) #
    ";alpha2=" # Float.toText(a2) #
    ";law_ref=RECITAL_PLUS_ONE" #
    ";content=" # raw;
  };

  private func animaHash(payload : Text) : Text {
    "ANIMA-" # Nat.toText(Text.size(payload)) # "-" # Nat.toText(Array.size(replayRecords) + Array.size(sandboxArtifacts));
  };

  private func createSandboxArtifact(rawInput : Text, sourceRef : Text, lawRefs : [Text]) : T.SandboxArtifact {
    let structural = structuralRecognition(rawInput);
    let align = alphaAlignment(rawInput);
    let a1 = align.0;
    let a2 = align.1;
    let hz = frequencySignature(rawInput);
    let contradictions = findContradictions(rawInput);
    let translated = thoughtForm(rawInput, structural, a1, a2);
    let doctrineScore = (a1 + a2) / 2.0;

    let pass : T.TranslationPass = {
      structuralType = structural;
      alpha1Alignment = a1;
      alpha2Alignment = a2;
      frequencyHz = hz;
      thoughtForm = translated;
      contradictions = contradictions;
    };

    {
      id = nextId("sandbox", Array.size(sandboxArtifacts));
      rawInput = rawInput;
      sourceRef = sourceRef;
      pass = pass;
      lawRefs = lawRefs;
      doctrineScore = doctrineScore;
      accepted = false;
      translatedOutput = translated;
      animaHash = animaHash(rawInput # translated);
      atNs = T.nowNs();
    };
  };

  // ===== Voice / Terminal / Approval / Nova =====
  private func recordTerminal(thinking : Text, working : Text, commandText : Text) : T.TerminalEntry {
    let t : T.TerminalEntry = {
      id = nextId("terminal", Array.size(terminalEntries));
      thinkingStream = thinking;
      workingStream = working;
      commandText = commandText;
      atNs = T.nowNs();
    };
    terminalEntries := Array.append(terminalEntries, [t]);
    t;
  };

  private func novaDriftReview(targetRef : Text, content : Text) : T.NovaReview {
    var drift : Float = 0.08;
    var flagged = false;
    var recommendation = "aligned";

    if (Text.contains(content, #text "bypass") or Text.contains(content, #text "ungoverned")) {
      drift := 0.74;
      flagged := true;
      recommendation := "flag_doctrine_drift";
    };

    let review : T.NovaReview = {
      id = nextId("nova", Array.size(novaReviews));
      targetRef = targetRef;
      doctrineDriftScore = drift;
      adreTrace = "ADRE::" # targetRef # "::" # Float.toText(drift);
      flagged = flagged;
      recommendation = recommendation;
      atNs = T.nowNs();
    };

    novaReviews := Array.append(novaReviews, [review]);
    review;
  };

  private func dualConsensusGate(taskRef : Text, oroAccept : Bool, novaAccept : Bool, reason : Text) : T.DualConsensus {
    let rec : T.DualConsensus = {
      id = nextId("consensus", Array.size(dualConsensus));
      taskRef = taskRef;
      oroAccept = oroAccept;
      novaAccept = novaAccept;
      finalAccept = oroAccept and novaAccept;
      reason = reason;
      atNs = T.nowNs();
    };
    dualConsensus := Array.append(dualConsensus, [rec]);
    ignore appendReplay("dual-consensus", ?taskRef, null, [rec.id]);
    rec;
  };

  // ===== Device Network =====
  private func createDeviceNode(owner : Text, kind : T.DeviceType, label : Text, permissions : T.DevicePermissions) : T.DeviceNode {
    let phi = 1.6180339887498948;
    let base = switch (kind) {
      case (#Phone) 432.0;
      case (#Tablet) 384.0;
      case (#Laptop) 528.0;
      case (#WifiNode) 256.0;
      case (#Other) 144.0;
    };

    let signature = base * phi;

    {
      id = nextId("device", Array.size(deviceNodes));
      owner = owner;
      kind = kind;
      label = label;
      phiFrequencySignature = signature;
      permissions = permissions;
      qrJumpToken = "QR-" # Nat.toText(Array.size(deviceNodes) + 1) # "-" # Float.toText(signature);
      createdAtNs = T.nowNs();
    };
  };

  private func contractForDevice(device : T.DeviceNode) : T.SovereignContract {
    {
      id = nextId("contract", Array.size(sovereignContracts));
      deviceId = device.id;
      animaHash = animaHash(device.id # device.label);
      phiGrid = "phi-grid:" # Float.toText(device.phiFrequencySignature);
      blockchainAnchorRef = "icp-anchor:" # device.id;
      pdfPayload = "Sovereign Device Contract for " # device.label # " / ANIMA=" # animaHash(device.id);
      atNs = T.nowNs();
    };
  };

  // ===== Dead Button Class Fixes =====
  private func exportAction(kind : T.ExportKind, title : Text, content : Text, lineageId : ?Text) : T.ExportArtifact {
    let artifact : T.ExportArtifact = {
      id = nextId("export", Array.size(actionOutputs));
      kind = kind;
      title = title;
      content = content;
      lineageId = lineageId;
      blockchainAnchor = "icp-anchor:export:" # title;
      createdAtNs = T.nowNs();
    };

    let format = switch (kind) {
      case (#Pdf) "pdf";
      case (#Excel) "xlsx";
      case (#Campaign) "campaign";
      case (#BusinessPlan) "business-plan";
      case (#SocialContent) "social";
      case (#Message) "message";
    };

    ignore appendActionOutput("export." # format, content, format, "artifact://" # artifact.id);
    ignore appendReplay("export.action", lineageId, null, [artifact.id]);

    artifact;
  };

  // ===== Workforce Domain and CPL =====
  public func registerWorkforceOrganism(tenantId : Text, role : Text) : async T.WorkforceOrganism {
    let w : T.WorkforceOrganism = {
      id = nextId("workforce", Array.size(workforceOrganisms));
      tenantId = tenantId;
      role = role;
      cplAddress = "cpl://" # tenantId # "/" # role;
      active = true;
      createdAtNs = T.nowNs();
    };

    workforceOrganisms := Array.append(workforceOrganisms, [w]);
    ignore appendReplay("workforce.register", ?w.id, null, [w.cplAddress]);
    w;
  };

  public query func workforceList(limit : Nat) : async [T.WorkforceOrganism] {
    if (limit >= Array.size(workforceOrganisms)) {
      workforceOrganisms;
    } else {
      Array.tabulate<T.WorkforceOrganism>(limit, func(i : Nat) : T.WorkforceOrganism { workforceOrganisms[Array.size(workforceOrganisms) - limit + i] });
    };
  };

  public func cplSend(fromAddress : Text, toAddress : Text, lawVector : [Text], mathPayload : Text, architecturePayload : Text) : async T.CplPacket {
    let packet : T.CplPacket = {
      id = nextId("cpl", Array.size(cplPackets));
      fromAddress = fromAddress;
      toAddress = toAddress;
      lawVector = lawVector;
      mathPayload = mathPayload;
      architecturePayload = architecturePayload;
      accepted = true;
      atNs = T.nowNs();
    };

    cplPackets := Array.append(cplPackets, [packet]);
    ignore appendReplay("cpl.send", ?packet.id, null, [fromAddress, toAddress]);
    packet;
  };

  public query func cplPacketsList(limit : Nat) : async [T.CplPacket] {
    if (limit >= Array.size(cplPackets)) {
      cplPackets;
    } else {
      Array.tabulate<T.CplPacket>(limit, func(i : Nat) : T.CplPacket { cplPackets[Array.size(cplPackets) - limit + i] });
    };
  };

  // ===== Runtime surfaces =====
  public query func health() : async T.RuntimeHealth {
    {
      beat = beat;
      lawEpoch = lawEpoch;
      memoryCount = Array.size(memoryNodes);
      proposalCount = Array.size(proposals);
      tenantCount = Array.size(tenants);
      replayCount = Array.size(replayRecords);
      incidentCount = Array.size(incidents);
      documentCount = Array.size(organismDocs);
      sandboxArtifactCount = Array.size(sandboxArtifacts);
      workforceCount = Array.size(workforceOrganisms);
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

  public func seedOrganismDocuments() : async Nat {
    ensureDocumentOrganismSeeded();
    Array.size(organismDocs);
  };

  public query func ancientArchitectureSynthesis() : async Text {
    "P1 canon-law pre-execution; P2 initiatory translation; P3 memory geometry; "
    # "P4 harmonic calibration; P5 dual witness consensus; P6 provenance chain; "
    # "P7 sovereign core + specialist workforce; P8 pattern sensing mandatory. "
    # "Mapped to MEDINA laws, sandbox, memory temple, CPL workforce, and consensus runtime.";
  };

  public query func organismDocuments(category : ?Text, limit : Nat) : async [T.DocumentArtifact] {
    let filtered = switch (category) {
      case null organismDocs;
      case (?c) Array.filter<T.DocumentArtifact>(organismDocs, func(d : T.DocumentArtifact) : Bool { d.category == c });
    };

    if (limit >= Array.size(filtered)) {
      filtered;
    } else {
      Array.tabulate<T.DocumentArtifact>(limit, func(i : Nat) : T.DocumentArtifact { filtered[Array.size(filtered) - limit + i] });
    };
  };

  public func ingestOrganismDocument(path : Text, content : Text, creator : Text, category : Text) : async T.DocumentArtifact {
    let doc : T.DocumentArtifact = {
      id = nextId("doc", Array.size(organismDocs));
      category = category;
      path = path;
      title = path;
      content = content;
      creator = creator;
      version = 1;
      atNs = T.nowNs();
    };
    organismDocs := Array.append(organismDocs, [doc]);
    ignore appendReplay("document.ingest", ?doc.id, null, [path]);
    doc;
  };

  public func sandboxTranslate(rawInput : Text, sourceRef : Text, lawRefs : [Text]) : async T.SandboxArtifact {
    let artifact = createSandboxArtifact(rawInput, sourceRef, lawRefs);
    sandboxArtifacts := Array.append(sandboxArtifacts, [artifact]);

    if (Array.size(artifact.pass.contradictions) > 0) {
      let cc : T.ContradictionCase = {
        id = nextId("contradiction", Array.size(contradictionCases));
        incomingRef = artifact.id;
        conflictingRef = "knowledge-graph-node";
        resolution = #Pending;
        resolvedBy = null;
        atNs = T.nowNs();
      };
      contradictionCases := Array.append(contradictionCases, [cc]);
    };

    ignore appendReplay("sandbox.translate", ?artifact.id, null, [artifact.animaHash]);
    artifact;
  };

  public func sandboxAccept(artifactId : Text, acceptedBy : Text) : async Bool {
    var accepted = false;

    sandboxArtifacts := Array.map<T.SandboxArtifact, T.SandboxArtifact>(
      sandboxArtifacts,
      func(a : T.SandboxArtifact) : T.SandboxArtifact {
        if (a.id == artifactId) {
          accepted := true;
          {
            id = a.id;
            rawInput = a.rawInput;
            sourceRef = a.sourceRef;
            pass = a.pass;
            lawRefs = a.lawRefs;
            doctrineScore = a.doctrineScore;
            accepted = true;
            translatedOutput = a.translatedOutput;
            animaHash = a.animaHash;
            atNs = a.atNs;
          };
        } else {
          a;
        };
      },
    );

    if (accepted) {
      ignore appendReplay("sandbox.accept", ?artifactId, null, ["accepted-by:" # acceptedBy]);
    };
    accepted;
  };

  public query func sandboxArtifactsList(limit : Nat) : async [T.SandboxArtifact] {
    if (limit >= Array.size(sandboxArtifacts)) {
      sandboxArtifacts;
    } else {
      Array.tabulate<T.SandboxArtifact>(limit, func(i : Nat) : T.SandboxArtifact { sandboxArtifacts[Array.size(sandboxArtifacts) - limit + i] });
    };
  };

  public query func contradictionList(limit : Nat) : async [T.ContradictionCase] {
    if (limit >= Array.size(contradictionCases)) {
      contradictionCases;
    } else {
      Array.tabulate<T.ContradictionCase>(limit, func(i : Nat) : T.ContradictionCase { contradictionCases[Array.size(contradictionCases) - limit + i] });
    };
  };

  public func resolveContradiction(caseId : Text, resolution : T.ContradictionResolution, actorId : Text) : async Bool {
    var changed = false;

    contradictionCases := Array.map<T.ContradictionCase, T.ContradictionCase>(
      contradictionCases,
      func(c : T.ContradictionCase) : T.ContradictionCase {
        if (c.id == caseId) {
          changed := true;
          {
            id = c.id;
            incomingRef = c.incomingRef;
            conflictingRef = c.conflictingRef;
            resolution = resolution;
            resolvedBy = ?actorId;
            atNs = c.atNs;
          };
        } else {
          c;
        };
      },
    );

    if (changed) {
      ignore appendReplay("contradiction.resolve", ?caseId, null, ["actor:" # actorId]);
    };

    changed;
  };

  public query func permissions() : async [T.PermissionToggle] {
    runtimePermissions;
  };

  public func setPermission(scope : Text, enabled : Bool, actorId : Text) : async T.PermissionToggle {
    runtimePermissions := Array.filter<T.PermissionToggle>(runtimePermissions, func(p : T.PermissionToggle) : Bool { p.scope != scope });

    let next : T.PermissionToggle = {
      scope = scope;
      enabled = enabled;
      updatedBy = actorId;
      updatedAtNs = T.nowNs();
    };

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

    if (not allGatesPass(gates)) {
      ignore appendIncident("gate-block", "beat failed Gate A/B/C checks");
    };

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
      case (?a) {
        ignore appendReplay("govern.approve", ?a.id, ?a.gateSnapshot, a.evidenceRefs);
      };
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
      case (?old) {
        {
          id = old.id;
          mode = mode;
          isolated = true;
          policyRefs = policyRefs;
          replayRefs = old.replayRefs;
          createdAtNs = old.createdAtNs;
        };
      };
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
        if (projectionEvidenceOnly) {
          "projection-safe:" # taskRef;
        } else {
          "projection-open:" # taskRef;
        };
      };
    };
  };

  public func modelInvoke(family : T.ModelFamily, taskRef : Text, contextMemory : ?Text) : async T.ModelInvocation {
    let route = ModelRouter.routeForTask(taskRef, null);
    let routeAligned = route.family == family;

    let fallbackSource = if (routeAligned) null else ?"router-correction";
    let incidentRef = if (routeAligned) {
      null;
    } else {
      ?appendIncident("route-mismatch", "requested model family differs from routed family").id;
    };

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
      return {
        status = #Blocked;
        message = "workflow blocked: " # incident.id;
        lineageId = ?workflowRef;
        gates = ?gates;
        evidenceRefs = [incident.id];
      };
    };

    let invocation = await modelInvoke(route.family, workflowRef, null);
    let review = novaDriftReview(invocation.id, invocation.output);
    let consensus = dualConsensusGate(workflowRef, true, not review.flagged, review.recommendation);

    if (not consensus.finalAccept) {
      let inc = appendIncident("consensus-block", "dual consensus rejected workflow");
      return {
        status = #Blocked;
        message = "dual consensus blocked";
        lineageId = ?workflowRef;
        gates = ?gates;
        evidenceRefs = [inc.id, review.id, consensus.id];
      };
    };

    let replay = appendReplay("workflow.run:" # workflowRef, ?workflowRef, ?gates, ["route:" # route.label, invocation.id, review.id, consensus.id]);

    {
      status = #Ok;
      message = "workflow executed";
      lineageId = ?workflowRef;
      gates = ?gates;
      evidenceRefs = [replay.id, invocation.id, review.id, consensus.id];
    };
  };

  public func setVoiceProfile(id : Text, persona : Text, tone : Text, language : Text, sampleRate : Nat, active : Bool) : async T.VoiceProfile {
    voiceProfiles := Array.filter<T.VoiceProfile>(voiceProfiles, func(v : T.VoiceProfile) : Bool { v.id != id });
    let profile : T.VoiceProfile = { id = id; persona = persona; tone = tone; language = language; sampleRate = sampleRate; active = active };
    voiceProfiles := Array.append(voiceProfiles, [profile]);
    ignore appendReplay("voice.profile", ?id, null, [persona]);
    profile;
  };

  public query func voiceProfilesList() : async [T.VoiceProfile] {
    voiceProfiles;
  };

  public func pushVoiceFrame(source : T.VoiceSource, amplitude : Float, frequency : Float) : async T.VoiceFrame {
    let frame : T.VoiceFrame = {
      id = nextId("voice-frame", Array.size(voiceFrames));
      source = source;
      amplitude = amplitude;
      frequency = frequency;
      timestampNs = T.nowNs();
    };
    voiceFrames := Array.append(voiceFrames, [frame]);
    frame;
  };

  public query func latestWaveform(limit : Nat) : async [T.VoiceFrame] {
    if (limit >= Array.size(voiceFrames)) {
      voiceFrames;
    } else {
      Array.tabulate<T.VoiceFrame>(limit, func(i : Nat) : T.VoiceFrame { voiceFrames[Array.size(voiceFrames) - limit + i] });
    };
  };

  public func terminalStream(thinking : Text, working : Text, commandText : Text) : async T.TerminalEntry {
    let t = recordTerminal(thinking, working, commandText);
    ignore appendReplay("terminal.stream", ?t.id, null, [commandText]);
    t;
  };

  public query func terminalHistory(limit : Nat) : async [T.TerminalEntry] {
    if (limit >= Array.size(terminalEntries)) {
      terminalEntries;
    } else {
      Array.tabulate<T.TerminalEntry>(limit, func(i : Nat) : T.TerminalEntry { terminalEntries[Array.size(terminalEntries) - limit + i] });
    };
  };

  public func openApprovalLayer(workCopyRef : Text, observationRef : Text) : async T.ApprovalLayerRecord {
    let rec : T.ApprovalLayerRecord = {
      id = nextId("approval", Array.size(approvalLayers));
      workingCopyRef = workCopyRef;
      observationRef = observationRef;
      approved = false;
      approvedSilently = false;
      approvedAtNs = null;
    };
    approvalLayers := Array.append(approvalLayers, [rec]);
    rec;
  };

  public func approveLayer(id : Text, silent : Bool) : async Bool {
    var ok = false;
    approvalLayers := Array.map<T.ApprovalLayerRecord, T.ApprovalLayerRecord>(
      approvalLayers,
      func(a : T.ApprovalLayerRecord) : T.ApprovalLayerRecord {
        if (a.id == id) {
          ok := true;
          {
            id = a.id;
            workingCopyRef = a.workingCopyRef;
            observationRef = a.observationRef;
            approved = true;
            approvedSilently = silent;
            approvedAtNs = ?T.nowNs();
          };
        } else {
          a;
        };
      },
    );

    if (ok) {
      ignore appendReplay("approval.accept", ?id, null, [if (silent) "silent" else "visible"]);
    };

    ok;
  };

  public query func approvalHistory(limit : Nat) : async [T.ApprovalLayerRecord] {
    if (limit >= Array.size(approvalLayers)) {
      approvalLayers;
    } else {
      Array.tabulate<T.ApprovalLayerRecord>(limit, func(i : Nat) : T.ApprovalLayerRecord { approvalLayers[Array.size(approvalLayers) - limit + i] });
    };
  };

  public func generatePdf(title : Text, body : Text, lineageId : ?Text) : async T.ExportArtifact {
    exportAction(#Pdf, title, "PDF::" # body, lineageId);
  };

  public func exportExcel(title : Text, csvPayload : Text, lineageId : ?Text) : async T.ExportArtifact {
    exportAction(#Excel, title, "XLSX::" # csvPayload, lineageId);
  };

  public func generateCampaign(title : Text, objective : Text, audience : Text) : async T.ExportArtifact {
    exportAction(#Campaign, title, "CAMPAIGN::objective=" # objective # ";audience=" # audience, null);
  };

  public func generateBusinessPlan(title : Text, market : Text, model : Text) : async T.ExportArtifact {
    exportAction(#BusinessPlan, title, "BUSINESS_PLAN::market=" # market # ";model=" # model, null);
  };

  public func generateSocialContent(title : Text, platform : Text, message : Text) : async T.ExportArtifact {
    exportAction(#SocialContent, title, "SOCIAL::platform=" # platform # ";message=" # message, null);
  };

  public func sendMessage(title : Text, recipient : Text, message : Text) : async T.ExportArtifact {
    exportAction(#Message, title, "MESSAGE::to=" # recipient # ";body=" # message, null);
  };

  public query func actionOutputsList(limit : Nat) : async [T.ActionOutput] {
    if (limit >= Array.size(actionOutputs)) {
      actionOutputs;
    } else {
      Array.tabulate<T.ActionOutput>(limit, func(i : Nat) : T.ActionOutput { actionOutputs[Array.size(actionOutputs) - limit + i] });
    };
  };

  public func registerDevice(owner : Text, kind : T.DeviceType, label : Text, permissions : T.DevicePermissions) : async T.DeviceNode {
    let node = createDeviceNode(owner, kind, label, permissions);
    deviceNodes := Array.append(deviceNodes, [node]);
    ignore appendReplay("device.register", ?node.id, null, [node.qrJumpToken]);
    node;
  };

  public func issueDeviceJump(deviceId : Text, ttlNs : Nat) : async ?T.DeviceJumpToken {
    switch (Array.find<T.DeviceNode>(deviceNodes, func(d : T.DeviceNode) : Bool { d.id == deviceId })) {
      case null null;
      case (?d) {
        let token : T.DeviceJumpToken = {
          id = nextId("jump", Array.size(deviceJumpTokens));
          deviceId = d.id;
          qrPayload = d.qrJumpToken;
          expiresAtNs = T.nowNs() + Nat.toInt(ttlNs);
          used = false;
        };
        deviceJumpTokens := Array.append(deviceJumpTokens, [token]);
        ?token;
      };
    };
  };

  public func consumeDeviceJump(tokenId : Text) : async Bool {
    var ok = false;
    deviceJumpTokens := Array.map<T.DeviceJumpToken, T.DeviceJumpToken>(
      deviceJumpTokens,
      func(t : T.DeviceJumpToken) : T.DeviceJumpToken {
        if (t.id == tokenId and not t.used and t.expiresAtNs > T.nowNs()) {
          ok := true;
          { id = t.id; deviceId = t.deviceId; qrPayload = t.qrPayload; expiresAtNs = t.expiresAtNs; used = true };
        } else {
          t;
        };
      },
    );
    ok;
  };

  public func generateSovereignContract(deviceId : Text) : async ?T.SovereignContract {
    switch (Array.find<T.DeviceNode>(deviceNodes, func(d : T.DeviceNode) : Bool { d.id == deviceId })) {
      case null null;
      case (?d) {
        let c = contractForDevice(d);
        sovereignContracts := Array.append(sovereignContracts, [c]);
        ignore appendReplay("device.contract", ?c.id, null, [c.blockchainAnchorRef]);
        ?c;
      };
    };
  };

  public query func deviceList(limit : Nat) : async [T.DeviceNode] {
    if (limit >= Array.size(deviceNodes)) {
      deviceNodes;
    } else {
      Array.tabulate<T.DeviceNode>(limit, func(i : Nat) : T.DeviceNode { deviceNodes[Array.size(deviceNodes) - limit + i] });
    };
  };

  public query func contractList(limit : Nat) : async [T.SovereignContract] {
    if (limit >= Array.size(sovereignContracts)) {
      sovereignContracts;
    } else {
      Array.tabulate<T.SovereignContract>(limit, func(i : Nat) : T.SovereignContract { sovereignContracts[Array.size(sovereignContracts) - limit + i] });
    };
  };

  public query func settings() : async T.SettingsHub {
    settingsHub;
  };

  public func updateSettings(devicesTab : Bool, permissionsTab : Bool, contractsTab : Bool, frequenciesTab : Bool, harmonicLadder : [Float], storageMode : Text) : async T.SettingsHub {
    settingsHub := {
      devicesTab = devicesTab;
      permissionsTab = permissionsTab;
      contractsTab = contractsTab;
      frequenciesTab = frequenciesTab;
      harmonicLadder = harmonicLadder;
      storageMode = storageMode;
    };
    settingsHub;
  };

  public func novaReviewTerminal(terminalEntryId : Text) : async ?T.NovaReview {
    switch (Array.find<T.TerminalEntry>(terminalEntries, func(t : T.TerminalEntry) : Bool { t.id == terminalEntryId })) {
      case null null;
      case (?t) {
        let r = novaDriftReview(t.id, t.thinkingStream # " " # t.workingStream);
        ?r;
      };
    };
  };

  public query func novaReviewList(limit : Nat) : async [T.NovaReview] {
    if (limit >= Array.size(novaReviews)) {
      novaReviews;
    } else {
      Array.tabulate<T.NovaReview>(limit, func(i : Nat) : T.NovaReview { novaReviews[Array.size(novaReviews) - limit + i] });
    };
  };

  public func decideDualConsensus(taskRef : Text, oroAccept : Bool, novaAccept : Bool, reason : Text) : async T.DualConsensus {
    dualConsensusGate(taskRef, oroAccept, novaAccept, reason);
  };

  public query func dualConsensusList(limit : Nat) : async [T.DualConsensus] {
    if (limit >= Array.size(dualConsensus)) {
      dualConsensus;
    } else {
      Array.tabulate<T.DualConsensus>(limit, func(i : Nat) : T.DualConsensus { dualConsensus[Array.size(dualConsensus) - limit + i] });
    };
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
          case (?node) { { status = #Ok; message = MemoryTemple.mapPath(node, c.mode); lineageId = ?node.id; gates = null; evidenceRefs = [] } };
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
    let term = recordTerminal("thinking:" # raw, "working:" # raw, raw);
    let review = novaDriftReview(term.id, raw);
    let preConsensus = dualConsensusGate(raw, true, not review.flagged, review.recommendation);

    if (not preConsensus.finalAccept) {
      return {
        status = #Blocked;
        message = "blocked by nova doctrine drift";
        lineageId = ?term.id;
        gates = null;
        evidenceRefs = [review.id, preConsensus.id];
      };
    };

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

  public func bootstrapMaximum(actorId : Text) : async Text {
    if (not hasCoreAAuthority(actorId)) {
      return "denied: requires core-a";
    };

    ensureDocumentOrganismSeeded();
    ignore await setVoiceProfile("oro", "Oro", "strategic", "en", 48000, true);
    ignore await setVoiceProfile("nova", "Nova", "doctrinal", "en", 48000, true);

    ignore await setPermission("filesystem", true, actorId);
    ignore await setPermission("connectors", true, actorId);
    ignore await setPermission("cloud-compute", true, actorId);

    ignore await memoryAdd("medina-runtime-origin", { theta = 0.0; phi = 0.0; depth = 0; ring = 0; beat = beat }, "bootstrap", "initial-memory", 10, ["origin", "runtime"]);
    ignore await companyOnboard("tenant-default", #Hybrid, ["policy:default", "policy:audit"]);

    ignore await registerWorkforceOrganism("tenant-default", "operations");
    ignore await cplSend("cpl://core", "cpl://tenant-default/operations", ["RECITAL_PLUS_ONE", "PHI_SOVEREIGN"], "phi=1.6180339887498948", "execute enterprise routine");

    ignore await registerDevice("founder", #Phone, "founder-phone", { microphone = true; camera = true; location = true; motion = true; notifications = true });

    ignore await runWorkflow("strategy");
    ignore snapshotState("bootstrap-maximum");

    "maximum bootstrapped";
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
    let micro : [Float] = [
      Float.fromInt(Array.size(memoryNodes)),
      Float.fromInt(Array.size(proposals)),
      Float.fromInt(Array.size(tenants)),
    ];
    let macro = Matalko.macroAbsorption(1.0, micro);
    let energy = Matalko.dualReadEnergy(1.0, 1.0);
    let stability = Matalko.physicsStability(energy, 0.1);
    let chemistry = Matalko.chemistryPotential(1.0, 0.2);
    { macroField = macro; dualReadEnergy = energy; stability = stability; chemistryPotential = chemistry; atNs = T.nowNs() };
  };
};
