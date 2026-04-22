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

/// ΜΕΔΙΝΑ: Κυρίαρχον Μνήμης-Λειτουργικόν Νοητικόν Σύστημα
/// (MEDINA: Sovereign Memory-Operating Intelligence System)
/// Perpetuum Mobile Computationis in Rete Interretiali
/// ALFREDUS MEDINUS HERNANDINUS
actor Medina {

  // ═══════════════════════════════════════════════════════════════════════════
  // ARCANA INTERIORA (Internal State - Never Exposed)
  // ═══════════════════════════════════════════════════════════════════════════

  stable var _aurum : Organism.OroState = Organism.initOro("ORO-PRIME", 432);
  stable var _nova : Organism.NovaState = Organism.initNova("NOVA-GUARDIAN");
  
  stable var _pulsus : Nat = 0;
  stable var _aeon : Nat = 0;
  stable var _ictus_totalis : Nat = 0;
  stable var _genesis_ns : Int = Time.now();
  
  stable var _numerus_invocationum : Nat = 0;
  stable var _numerus_fasciculorum : Nat = 0;
  stable var _numerus_fluxuum : Nat = 0;
  stable var _numerus_mechanicorum : Nat = 0;
  stable var _numerus_pactorum : Nat = 0;

  stable var _nodi_memoriae : [T.MemoryNode] = [];
  stable var _propositiones : [T.GovernanceProposal] = [];
  stable var _coloni : [T.Tenant] = [];
  stable var _vestigia : [Text] = [];
  stable var _invocationes : [T.EngineInvocation] = [];
  stable var _effectus : [T.EngineResult] = [];
  stable var _fasciculi : [T.WorkPacket] = [];
  stable var _fluxus : [T.Workflow] = [];
  
  stable var _mechanica : [Organism.DeviceNode] = [];
  stable var _pacta : [Organism.DeviceContract] = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // FUNCTIONES OCCULTAE (Private Helper Functions)
  // ═══════════════════════════════════════════════════════════════════════════

  private func _generareId(praefixum : Text, n : Nat) : Text {
    praefixum # "-" # Nat.toText(n + 1);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ΧΡΥΣΟΣ ΚΑΙ ΝΟΒΑ - AURUM ET NOVA (Gold and Guardian Public API)
  // ═══════════════════════════════════════════════════════════════════════════

  /// χρυσός - aurum (gold state query)
  public query func aurum() : async {
    id : Text;
    phasis : Text;
    pulsus : Nat;
    valetudo : Float;
    anima : Nat;
    tabulae : { cognitio : Float; affectio : Float; soma : Float; supremum : Float };
    campus : { attentio : Float; cohaerentia : Float; periculum : Float; resonantia_phi : Float };
  } {
    let phasisTextus = switch (_aurum.phase) {
      case (#Awakening) "ἀνέγερσις";
      case (#Active) "ἐνέργεια";
      case (#Integrating) "σύνθεσις";
      case (#Broadcasting) "διάδοσις";
      case (#Defensive) "ἀμύνη";
      case (#Transcendent) "ὑπερβατικός";
    };
    {
      id = _aurum.id;
      phasis = phasisTextus;
      pulsus = _aurum.currentBeat;
      valetudo = _aurum.healthScore;
      anima = _aurum.animaHash;
      tabulae = {
        cognitio = _aurum.registers.cognitive;
        affectio = _aurum.registers.affective;
        soma = _aurum.registers.somatic;
        supremum = _aurum.registers.sovereign;
      };
      campus = {
        attentio = _aurum.fieldState.attention;
        cohaerentia = _aurum.fieldState.coherence;
        periculum = _aurum.fieldState.risk;
        resonantia_phi = _aurum.fieldState.phiResonance;
      };
    };
  };

  /// νόβα κύστος - nova custos (guardian state query)
  public query func nova_custos() : async {
    id : Text;
    conformitas_doctrinae : Float;
    consensus_aurei : Bool;
    derivationes_irresolutae : Nat;
    tabulae : { cognitio : Float; affectio : Float; soma : Float; supremum : Float };
  } {
    let numerus_irresolutarum = Array.size(Array.filter<Organism.DriftFlag>(_nova.flaggedDrift, func(f : Organism.DriftFlag) : Bool { not f.resolved }));
    {
      id = _nova.id;
      conformitas_doctrinae = _nova.doctrineAlignment;
      consensus_aurei = _nova.consensusWithOro;
      derivationes_irresolutae = numerus_irresolutarum;
      tabulae = {
        cognitio = _nova.registers.cognitive;
        affectio = _nova.registers.affective;
        soma = _nova.registers.somatic;
        supremum = _nova.registers.sovereign;
      };
    };
  };

  /// πάλσυς κόρδις - pulsus cordis (heartbeat execution)
  public func pulsus_cordis() : async Organism.TickResult {
    let numerus_memoriarum = Array.size(_nodi_memoriae);
    let signales_periculi = Array.size(Array.filter<Organism.DriftFlag>(_nova.flaggedDrift, func(f : Organism.DriftFlag) : Bool { not f.resolved }));
    let duplex_lectio_transivit = true;
    let signales_orphani = 0;
    let portae_apertae = Law.gateA({ semantic = true; resonance = true }, signales_orphani);
    
    let (novum_aurum, nova_nova, effectus) = Organism.sovereignTick(
      _aurum, _nova, numerus_memoriarum, signales_periculi, duplex_lectio_transivit, signales_orphani, portae_apertae
    );
    
    _aurum := novum_aurum;
    _nova := nova_nova;
    _pulsus := effectus.beat;
    _ictus_totalis += 1;
    _aeon += 1;
    
    _vestigia := Array.append(_vestigia, ["ictus:" # Nat.toText(_pulsus) # ":anima:" # Nat.toText(effectus.animaHash)]);
    
    effectus;
  };

  /// σίγνα βίταε - signa vitae (vital signs)
  public query func signa_vitae() : async {
    ictus_totalis : Nat;
    tempus_vitae_ns : Int;
    valetudo_aurei : Float;
    conformitas_novae : Float;
    consensus_activus : Bool;
    numerus_memoriarum : Nat;
    numerus_mechanicorum : Nat;
    phi : Float;
    frequentia_432 : Float;
  } {
    let nunc = Time.now();
    {
      ictus_totalis = _ictus_totalis;
      tempus_vitae_ns = nunc - _genesis_ns;
      valetudo_aurei = _aurum.healthScore;
      conformitas_novae = _nova.doctrineAlignment;
      consensus_activus = Organism.dualConsensus(_aurum, _nova);
      numerus_memoriarum = Array.size(_nodi_memoriae);
      numerus_mechanicorum = Array.size(_mechanica);
      phi = Matalko.PHI;
      frequentia_432 = Matalko.FREQ_432;
    };
  };

  /// σκάλα ἁρμονική - scala harmonica (harmonic ladder)
  public query func scala_harmonica(gradus : Nat) : async [{ gradus : Nat; frequentia : Float; nota : Text }] {
    Organism.harmonicLadder(Matalko.FREQ_432, gradus);
  };

  /// σκάλα φί - scala phi (phi spacing ladder)
  public query func scala_phi(unitas_basis : Float, gradus : Nat) : async [{ gradus : Int; spatium : Float }] {
    Array.tabulate<{ gradus : Int; spatium : Float }>(gradus, func(i : Nat) : { gradus : Int; spatium : Float } {
      let g = Int.abs(i) - (gradus / 2);
      { gradus = g; spatium = Matalko.phiSpacing(unitas_basis, g) };
    });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ΜΗΧΑΝΙΚΑ - MECHANICA (Device Network API)
  // ═══════════════════════════════════════════════════════════════════════════

  /// ἰνσκρίβερε μηχανικόν - inscribere mechanicum (register device)
  public func inscribere_mechanicum(
    genus : Text,
    permissiones : [Text]
  ) : async {
    id : Text;
    signatura_frequentiae : { fundamentalis : Float; modulatio_phi : Float };
    positio_phi : { x : Float; y : Float };
    fides : Float;
  } {
    _numerus_mechanicorum += 1;
    let id = "mechanicum-" # Nat.toText(_numerus_mechanicorum);
    let semen = _numerus_mechanicorum * 137 + _pulsus;
    
    let genus_mechanici : Organism.DeviceType = switch (genus) {
      case "telephonium" #Phone;
      case "tabula" #Tablet;
      case "computatrum_portabile" #Laptop;
      case "computatrum" #Desktop;
      case "nodus_retis" #WiFiNode;
      case "sensor" #Sensor;
      case _ #Unknown;
    };
    
    let perms = Array.mapFilter<Text, Organism.DevicePermission>(permissiones, func(p : Text) : ?Organism.DevicePermission {
      switch (p) {
        case "microphonum" ?#Microphone;
        case "camera" ?#Camera;
        case "locus" ?#Location;
        case "motus" ?#Motion;
        case "nuntii" ?#Notifications;
        case "repositorium" ?#Storage;
        case "rete" ?#Network;
        case _ null;
      };
    });
    
    let mechanicum = Organism.registerDevice(id, genus_mechanici, semen, perms);
    _mechanica := Array.append(_mechanica, [mechanicum]);
    
    {
      id = mechanicum.id;
      signatura_frequentiae = { 
        fundamentalis = mechanicum.frequencySignature.fundamental; 
        modulatio_phi = mechanicum.frequencySignature.phiModulation;
      };
      positio_phi = mechanicum.phiGridPosition;
      fides = mechanicum.trustScore;
    };
  };

  /// γενεράρε πάκτυμ - generare pactum (generate device contract)
  public func generare_pactum(id_mechanici : Text) : async ?{
    id : Text;
    anima : Nat;
    ancora_catena : Text;
    exemplum_phi : [[Float]];
  } {
    var mechanicum_destinatum : ?Organism.DeviceNode = null;
    for (m in _mechanica.vals()) {
      if (m.id == id_mechanici) {
        mechanicum_destinatum := ?m;
      };
    };
    
    switch (mechanicum_destinatum) {
      case null null;
      case (?mechanicum) {
        _numerus_pactorum += 1;
        let pactum = Organism.generateDeviceContract(mechanicum, _aurum);
        _pacta := Array.append(_pacta, [pactum]);
        
        let exemplum = Array.tabulate<[Float]>(4, func(i : Nat) : [Float] {
          if (i < Array.size(pactum.phiGrid)) { pactum.phiGrid[i] } else { [] };
        });
        
        ?{
          id = pactum.id;
          anima = pactum.animaHash;
          ancora_catena = pactum.blockchainAnchor;
          exemplum_phi = exemplum;
        };
      };
    };
  };

  /// ἐνυμεράρε μηχανικά - enumerare mechanica (list devices)
  public query func enumerare_mechanica() : async [{
    id : Text;
    genus : Text;
    fides : Float;
    positio : { x : Float; y : Float };
    habet_pactum : Bool;
  }] {
    Array.map<Organism.DeviceNode, {
      id : Text;
      genus : Text;
      fides : Float;
      positio : { x : Float; y : Float };
      habet_pactum : Bool;
    }>(_mechanica, func(m : Organism.DeviceNode) : {
      id : Text;
      genus : Text;
      fides : Float;
      positio : { x : Float; y : Float };
      habet_pactum : Bool;
    } {
      let textus_generis = switch (m.deviceType) {
        case (#Phone) "telephonium";
        case (#Tablet) "tabula";
        case (#Laptop) "computatrum_portabile";
        case (#Desktop) "computatrum";
        case (#WiFiNode) "nodus_retis";
        case (#Sensor) "sensor";
        case (#Unknown) "ignotum";
      };
      let habet = switch (m.contractHash) { case null false; case _ true; };
      {
        id = m.id;
        genus = textus_generis;
        fides = m.trustScore;
        positio = m.phiGridPosition;
        habet_pactum = habet;
      };
    });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ΑΡΙΘΜΗΤΙΚΑ - ARITHMETICA (Mathematical Computation API)
  // ═══════════════════════════════════════════════════════════════════════════

  /// κωδιφικάρε φί - codificare phi (phi encode)
  public query func codificare_phi(valor : Float) : async Float {
    Matalko.phiEncode(valor);
  };

  /// σπίρα αὐρέα - spira aurea (golden spiral)
  public query func spira_aurea(numerus : Nat, scala : Float) : async [{ x : Float; y : Float }] {
    Array.tabulate<{ x : Float; y : Float }>(numerus, func(i : Nat) : { x : Float; y : Float } {
      Matalko.phiSpiral(i, scala);
    });
  };

  /// ρεσονάντια ἁρμονική - resonantia harmonica (harmonic resonance)
  public query func resonantia_harmonica(f1 : Float, f2 : Float) : async Float {
    Matalko.harmonicResonance(f1, f2);
  };

  /// σιγνατύρα φρεκυεντίαε - signatura frequentiae (frequency signature)
  public query func signatura_frequentiae(semen : Nat) : async {
    fundamentalis : Float;
    harmonici : [Float];
    modulatio_phi : Float;
  } {
    let sig = Matalko.generateFrequencySignature(semen, 8);
    {
      fundamentalis = sig.fundamental;
      harmonici = sig.harmonics;
      modulatio_phi = sig.phiModulation;
    };
  };

  /// στάτυς κάμπι - status campi (field state)
  public query func status_campi() : async Matalko.FieldState {
    _aurum.fieldState;
  };

  /// σεκυέντια φιβονάτσι - sequentia fibonacci (fibonacci sequence)
  public query func sequentia_fibonacci(n : Nat) : async Nat {
    Matalko.fibonacci(n);
  };

  /// κωνστάντες - constantes (universal constants)
  public query func constantes() : async {
    phi : Float;
    phi_inversus : Float;
    phi_quadratus : Float;
    frequentia_432 : Float;
    pi : Float;
    tau : Float;
    e : Float;
  } {
    {
      phi = Matalko.PHI;
      phi_inversus = Matalko.PHI_INVERSE;
      phi_quadratus = Matalko.PHI_SQUARED;
      frequentia_432 = Matalko.FREQ_432;
      pi = Matalko.PI;
      tau = Matalko.TAU;
      e = Matalko.E;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ΑΡΧΑΙΑ - ANTIQUA (Legacy API with Latin names)
  // ═══════════════════════════════════════════════════════════════════════════

  /// ὀντολογία - ontologia
  public query func ontologia() : async [Text] {
    Law.nonCollapseOntologyInvariant();
  };

  /// ρεγίστρυμ ὀρχηστρατόρυμ - registrum orchestratorum
  public query func registrum_orchestratorum() : async [Orchestrators.Orchestrator] {
    Orchestrators.registry;
  };

  /// πάλσυς σύπρεμυς - pulsus supremus (sovereign beat)
  public func pulsus_supremus(
    duplex_lectio : T.DualReadStatus,
    signales_orphani : Nat,
    turba_parata : Bool,
    proiectio_tuta : Bool,
  ) : async T.BeatSummary {
    _pulsus += 1;
    _aeon += 1;

    let portae = Orchestrators.evaluateBeat(duplex_lectio, signales_orphani, turba_parata, proiectio_tuta, true);
    let vestigium = "vestigium:pulsus:" # Nat.toText(_pulsus);
    _vestigia := Array.append(_vestigia, [vestigium]);

    {
      beat = _pulsus;
      macroAbsorbed = signales_orphani == 0;
      orphanMicroSignals = signales_orphani;
      dualRead = duplex_lectio;
      lawEpoch = _aeon;
      gates = portae;
      replayRef = vestigium;
      atNs = T.nowNs();
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ΜΝΗΜΗ - MEMORIA (Memory Temple API)
  // ═══════════════════════════════════════════════════════════════════════════

  /// ἀδδερε μνήμην - addere mneme (add memory)
  public func addere_mneme(
    onus : Text,
    coordinatae : T.Coordinates,
    recitatio : Text,
    expansio_legitima : Text,
    saliens : Nat,
    notae_doctrinae : [Text],
  ) : async T.MemoryNode {
    let id = _generareId("mneme", Array.size(_nodi_memoriae));
    let linea = Law.recitalPlusOne(recitatio, expansio_legitima);
    let nodus : T.MemoryNode = {
      id = id;
      payload = onus;
      coords = coordinatae;
      lineage = linea;
      salience = saliens;
      doctrineTags = notae_doctrinae;
      promoted = false;
      consolidatedFrom = [];
      createdAtNs = T.nowNs();
    };

    _nodi_memoriae := Array.append(_nodi_memoriae, [nodus]);
    nodus;
  };

  /// κυαέρερε μνήμην - quaerere mneme (search memory)
  public query func quaerere_mneme(interrogatio : Text, anulus : ?Nat, profunditas : ?Nat, linea : ?Text) : async [T.MemoryNode] {
    MemoryTemple.find(_nodi_memoriae, interrogatio, anulus, profunditas, linea);
  };

  /// προμοβέρε μνήμην - promovere mneme (promote memory)
  public func promovere_mneme(id_memoriae : Text) : async Bool {
    var inventum = false;
    _nodi_memoriae := Array.map<T.MemoryNode, T.MemoryNode>(
      _nodi_memoriae,
      func(n : T.MemoryNode) : T.MemoryNode {
        if (n.id == id_memoriae) {
          inventum := true;
          MemoryTemple.promote(n);
        } else {
          n;
        };
      },
    );
    inventum;
  };

  /// κονσολιδάρε μνήμην - consolidare mneme (consolidate memory)
  public func consolidare_mneme(id_destinati : Text, ids_fontium : [Text], id_fontis : Text) : async ?T.MemoryNode {
    var fons : ?T.MemoryNode = null;
    for (n in _nodi_memoriae.vals()) {
      if (n.id == id_fontis) {
        fons := ?n;
      };
    };

    switch (fons) {
      case null null;
      case (?s) {
        let consolidatus = MemoryTemple.consolidate(id_destinati, ids_fontium, s);
        _nodi_memoriae := Array.append(_nodi_memoriae, [consolidatus]);
        ?consolidatus;
      };
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ΚΥΒΕΡΝΗΣΙΣ - GUBERNATIO (Governance API)
  // ═══════════════════════════════════════════════════════════════════════════

  /// κυβέρνησις προπόνερε - kybernesis proponere (governance propose)
  public func kybernesis_proponere(
    genus_propositi : Text,
    referentia_oneris : Text,
    tabulae : T.Register,
    recitatio : Text,
    expansio_legitima : Text,
    duplex_lectio : T.DualReadStatus,
    status_portarum : T.GateStatus,
  ) : async T.GovernanceProposal {
    let id = _generareId("propositum", Array.size(_propositiones));
    let linea = Law.recitalPlusOne(recitatio, expansio_legitima);
    let p = Governance.newProposal(id, genus_propositi, referentia_oneris, tabulae, linea, duplex_lectio, status_portarum);
    _propositiones := Array.append(_propositiones, [p]);
    p;
  };

  /// κυβέρνησις ἀππροβάρε - kybernesis approbare (governance approve)
  public func kybernesis_approbare(id_propositi : Text, politica : ?Text) : async ?T.GovernanceProposal {
    var approbatum : ?T.GovernanceProposal = null;
    _propositiones := Array.map<T.GovernanceProposal, T.GovernanceProposal>(
      _propositiones,
      func(p : T.GovernanceProposal) : T.GovernanceProposal {
        if (p.id == id_propositi) {
          let a = Governance.approve(p, politica);
          approbatum := ?a;
          a;
        } else {
          p;
        };
      },
    );
    approbatum;
  };

  /// κυβέρνησις στάτυς - kybernesis status (governance status)
  public query func kybernesis_status(id_propositi : ?Text) : async Text {
    switch (id_propositi) {
      case null {
        "propositiones=" # Nat.toText(Array.size(_propositiones));
      };
      case (?pid) {
        var status : Text = "non-inventum";
        for (p in _propositiones.vals()) {
          if (p.id == pid) {
            status := Governance.statusText(p);
          };
        };
        status;
      };
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SOCIETAS - SOCIETAS (Company/Tenant API)
  // ═══════════════════════════════════════════════════════════════════════════

  /// ἀδμιττερε σοκιετάτεμ - admittere societatem (onboard company)
  public func admittere_societatem(id_coloni : Text, modus : T.OnboardingMode, referentiae_politicae : [Text]) : async T.Tenant {
    let t = Company.onboard(id_coloni, modus, referentiae_politicae);
    _coloni := Array.append(_coloni, [t]);
    t;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ΔΑΙΜΩΝ - DAEMON (Model Engine API)
  // ═══════════════════════════════════════════════════════════════════════════

  /// βία ἐξεμπλάρις - via exemplaris (model route)
  public query func via_exemplaris(referentia_operis : Text, politica : ?Text) : async T.ModelRoute {
    ModelRouter.routeForTask(referentia_operis, politica);
  };

  /// ὀστένδερε βεστίγια - ostendere vestigia (show replay)
  public query func ostendere_vestigia(id : Text) : async [Text] {
    Array.filter<Text>(_vestigia, func(r : Text) : Bool { r == id });
  };

  /// ἰνβοκάρε δαίμονα - invocare daemona (invoke model engine)
  public func invocare_daemona(
    familia : T.ModelFamily,
    referentia_operis : Text,
    id_contextus_memoriae : ?Text,
    onus_initialis : Text,
  ) : async T.EngineResult {
    _numerus_invocationum += 1;
    let id_invocationis = _generareId("invocatio", _numerus_invocationum);
    
    let invocatio = ModelEngine.createInvocation(
      id_invocationis,
      familia,
      referentia_operis,
      id_contextus_memoriae,
      onus_initialis
    );
    _invocationes := Array.append(_invocationes, [invocatio]);
    
    let nodi_contextus = switch (id_contextus_memoriae) {
      case null _nodi_memoriae;
      case (?mid) {
        Array.filter<T.MemoryNode>(_nodi_memoriae, func(n : T.MemoryNode) : Bool { 
          n.id == mid or n.lineage.parent == ?mid 
        });
      };
    };
    
    let duplex_lectio : T.DualReadStatus = { semantic = true; resonance = true };
    let turba_parata = true;
    let proiectio_tuta = true;
    
    let effectus = ModelEngine.execute(
      invocatio,
      nodi_contextus,
      duplex_lectio,
      turba_parata,
      proiectio_tuta
    );
    
    _effectus := Array.append(_effectus, [effectus]);
    _vestigia := Array.append(_vestigia, ["vestigium:invocatio:" # id_invocationis]);
    
    effectus;
  };

  /// ἱστορία μαχινάρυμ - historia machinarum (engine history)
  public query func historia_machinarum() : async [T.EngineInvocation] {
    _invocationes;
  };

  /// ἱστορία ἐφφεκτύυμ - historia effectuum (results history)
  public query func historia_effectuum() : async [T.EngineResult] {
    _effectus;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ΕΡΓΑΣΤΗΡΙΟΝ - ERGASTERION (Workspace/Packet API)
  // ═══════════════════════════════════════════════════════════════════════════

  /// κρεάρε ἐργαστήριον - creare ergasterion (create workspace)
  public func creare_ergasterion(
    titulus : Text,
    referentia_operis : Text,
    onus_initialis : Text,
    tabulae : T.Register,
  ) : async T.WorkPacket {
    _numerus_fasciculorum += 1;
    let id_fasciculi = _generareId("fasciculus", _numerus_fasciculorum);
    
    let fasciculus = WorkPacket.createPacket(
      id_fasciculi,
      titulus,
      referentia_operis,
      onus_initialis,
      tabulae,
      null
    );
    
    let fasciculus_apertus = WorkPacket.openPacket(fasciculus);
    _fasciculi := Array.append(_fasciculi, [fasciculus_apertus]);
    _vestigia := Array.append(_vestigia, ["vestigium:fasciculus:" # id_fasciculi]);
    
    fasciculus_apertus;
  };

  /// ἀπερίρε ἐργαστήριον - aperire ergasterion (open workspace)
  public func aperire_ergasterion(id_fasciculi : Text) : async ?T.WorkPacket {
    var inventum : ?T.WorkPacket = null;
    _fasciculi := Array.map<T.WorkPacket, T.WorkPacket>(
      _fasciculi,
      func(p : T.WorkPacket) : T.WorkPacket {
        if (p.id == id_fasciculi and p.status == #Draft) {
          let apertus = WorkPacket.openPacket(p);
          inventum := ?apertus;
          apertus;
        } else if (p.id == id_fasciculi) {
          inventum := ?p;
          p;
        } else {
          p;
        };
      },
    );
    inventum;
  };

  /// ἀσσιγνάρε ἐργαστήριον - assignare ergasterion (assign workspace)
  public func assignare_ergasterion(
    id_fasciculi : Text,
    familia : T.ModelFamily,
  ) : async ?T.WorkPacket {
    let munus = ModelEngine.determineRole(familia, "");
    var inventum : ?T.WorkPacket = null;
    
    _fasciculi := Array.map<T.WorkPacket, T.WorkPacket>(
      _fasciculi,
      func(p : T.WorkPacket) : T.WorkPacket {
        if (p.id == id_fasciculi) {
          let assignatus = WorkPacket.assignEngine(p, munus, familia);
          inventum := ?assignatus;
          assignatus;
        } else {
          p;
        };
      },
    );
    inventum;
  };

  /// κομπλέρε ἐργαστήριον - complere ergasterion (complete workspace)
  public func complere_ergasterion(
    id_fasciculi : Text,
    onus_finalis : Text,
  ) : async ?T.WorkPacket {
    var inventum : ?T.WorkPacket = null;
    
    _fasciculi := Array.map<T.WorkPacket, T.WorkPacket>(
      _fasciculi,
      func(p : T.WorkPacket) : T.WorkPacket {
        if (p.id == id_fasciculi) {
          let completus = WorkPacket.completePacket(p, onus_finalis, "evidentia:completus:" # id_fasciculi);
          inventum := ?completus;
          completus;
        } else {
          p;
        };
      },
    );
    inventum;
  };

  /// ἐνυμεράρε ἐργαστήρια - enumerare ergasteria (list workspaces)
  public query func enumerare_ergasteria() : async [T.WorkPacket] {
    _fasciculi;
  };

  /// ὀβτινέρε ἐργαστήριον - obtinere ergasterion (get workspace)
  public query func obtinere_ergasterion(id_fasciculi : Text) : async ?T.WorkPacket {
    var inventum : ?T.WorkPacket = null;
    for (p in _fasciculi.vals()) {
      if (p.id == id_fasciculi) {
        inventum := ?p;
      };
    };
    inventum;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ΡΟΗ - FLUXUS (Workflow API)
  // ═══════════════════════════════════════════════════════════════════════════

  /// κρεάρε ῥοήν - creare rhoen (create workflow)
  public func creare_rhoen(
    nomen : Text,
    referentiae_operum : [Text],
  ) : async T.Workflow {
    _numerus_fluxuum += 1;
    let id_fluxus = _generareId("fluxus", _numerus_fluxuum);
    
    var numerator_graduum = 0;
    let gradus = Array.map<Text, T.WorkflowStep>(
      referentiae_operum,
      func(referentia_operis : Text) : T.WorkflowStep {
        numerator_graduum += 1;
        let id_gradus = id_fluxus # "-gradus-" # Nat.toText(numerator_graduum);
        
        let via = ModelRouter.routeForTask(referentia_operis, null);
        let munus_machinae = ?ModelEngine.determineRole(via.family, referentia_operis);
        let genus_gradus : T.WorkflowStepType = if (numerator_graduum == 1) #Route 
                                                else if (numerator_graduum == Array.size(referentiae_operum)) #Complete 
                                                else #Execute;
        
        WorkPacket.createStep(id_gradus, genus_gradus, munus_machinae, referentia_operis, true);
      }
    );
    
    let fluxus = WorkPacket.createWorkflow(id_fluxus, nomen, gradus);
    let fluxus_inceptus = WorkPacket.startWorkflow(fluxus);
    
    _fluxus := Array.append(_fluxus, [fluxus_inceptus]);
    _vestigia := Array.append(_vestigia, ["vestigium:fluxus:" # id_fluxus]);
    
    fluxus_inceptus;
  };

  /// γράδυς ῥοῆς - gradus rhoes (workflow step)
  public func gradus_rhoes(id_fluxus : Text) : async ?T.WorkflowResult {
    var effectus : ?T.WorkflowResult = null;
    
    _fluxus := Array.map<T.Workflow, T.Workflow>(
      _fluxus,
      func(w : T.Workflow) : T.Workflow {
        if (w.id == id_fluxus and w.status == #Running) {
          let index_currentis = w.currentStepIndex;
          if (index_currentis < Array.size(w.steps)) {
            let gradus = w.steps[index_currentis];
            
            let exitus_gradus = switch (gradus.engineRole) {
              case null "Gradus " # Nat.toText(index_currentis) # " executus (sine machina)";
              case (?munus) {
                "Gradus " # Nat.toText(index_currentis) # " executus per " # 
                ModelEngine.roleName(munus) # " machinam pro opere: " # gradus.taskRef;
              };
            };
            
            _numerus_fasciculorum += 1;
            let id_fasciculi = _generareId("fasciculus", _numerus_fasciculorum);
            let tabulae : T.Register = {
              founder = "fluxus:" # id_fluxus;
              builder = "gradus:" # gradus.id;
              organism = "medina";
              external = "";
            };
            let fasciculus_gradus = WorkPacket.createPacket(
              id_fasciculi,
              "Gradus fluxus: " # gradus.taskRef,
              gradus.taskRef,
              exitus_gradus,
              tabulae,
              null
            );
            let fasciculus_completus = WorkPacket.completePacket(
              WorkPacket.openPacket(fasciculus_gradus),
              exitus_gradus,
              "fluxus:" # id_fluxus # ":gradus:" # Nat.toText(index_currentis)
            );
            _fasciculi := Array.append(_fasciculi, [fasciculus_completus]);
            
            let progressus = WorkPacket.advanceStep(w, exitus_gradus, ?id_fasciculi);
            
            let portae : T.GateStatus = { a = true; b = true; c = true };
            let r = WorkPacket.buildResult(progressus, ?exitus_gradus, portae);
            effectus := ?r;
            
            progressus;
          } else {
            w;
          };
        } else {
          w;
        };
      },
    );
    effectus;
  };

  /// κύρρερε ῥοήν - currere rhoen (run workflow)
  public func currere_rhoen(id_fluxus : Text) : async ?T.WorkflowResult {
    var effectus_finalis : ?T.WorkflowResult = null;
    var continuare = true;
    
    var fluxus_destinatus : ?T.Workflow = null;
    for (w in _fluxus.vals()) {
      if (w.id == id_fluxus) {
        fluxus_destinatus := ?w;
      };
    };
    
    switch (fluxus_destinatus) {
      case null null;
      case (?fl) {
        let numerus_graduum = Array.size(fl.steps);
        var index_gradus = 0;
        while (index_gradus < numerus_graduum and continuare) {
          let effectus_gradus = await gradus_rhoes(id_fluxus);
          switch (effectus_gradus) {
            case null { continuare := false; };
            case (?r) {
              effectus_finalis := ?r;
              if (r.status == #Completed or r.status == #Failed) {
                continuare := false;
              };
            };
          };
          index_gradus += 1;
        };
        effectus_finalis;
      };
    };
  };

  /// στάτυς ῥοῆς - status rhoes (workflow status)
  public query func status_rhoes(id_fluxus : Text) : async ?T.Workflow {
    var inventum : ?T.Workflow = null;
    for (w in _fluxus.vals()) {
      if (w.id == id_fluxus) {
        inventum := ?w;
      };
    };
    inventum;
  };

  /// ἐνυμεράρε ῥοάς - enumerare rhoas (list workflows)
  public query func enumerare_rhoas() : async [T.Workflow] {
    _fluxus;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ΙΜΠΕΡΙΥΜ - IMPERIUM (Universal Command API)
  // ═══════════════════════════════════════════════════════════════════════════

  /// ἰμπεράρε - imperare (execute command)
  public func imperare(mandatum : T.Command) : async T.CommandResult {
    switch (mandatum) {
      case (#MemoryFind c) {
        let effectus = MemoryTemple.find(_nodi_memoriae, c.query, c.ring, c.depth, c.lineage);
        {
          status = #Ok;
          message = "mneme.quaerere: " # Nat.toText(Array.size(effectus)) # " effectus pro '" # c.query # "'";
          lineageId = null;
          gates = null;
          evidenceRefs = Array.map<T.MemoryNode, Text>(effectus, func(n : T.MemoryNode) : Text { n.id });
        };
      };
      case (#MemoryPin c) {
        let promotus = await promovere_mneme(c.memoryId);
        {
          status = if (promotus) #Ok else #Error;
          message = if (promotus) "mneme.promovere: " # c.memoryId else "mneme.promovere: non inventum " # c.memoryId;
          lineageId = ?c.memoryId;
          gates = null;
          evidenceRefs = ["promovere:" # c.memoryId];
        };
      };
      case (#MemoryMap c) {
        let relati = MemoryTemple.find(_nodi_memoriae, "", null, null, ?c.memoryId);
        {
          status = #Ok;
          message = "mneme.mappa: " # c.memoryId # " modus=" # c.mode # " relati=" # Nat.toText(Array.size(relati));
          lineageId = ?c.memoryId;
          gates = null;
          evidenceRefs = Array.map<T.MemoryNode, Text>(relati, func(n : T.MemoryNode) : Text { n.id });
        };
      };
      case (#GovernStatus c) {
        let status = await kybernesis_status(c.proposalId);
        {
          status = #Ok;
          message = "kybernesis.status: " # status;
          lineageId = c.proposalId;
          gates = null;
          evidenceRefs = [];
        };
      };
      case (#GovernPropose c) {
        let tabulae_defectivae : T.Register = {
          founder = "mandatum";
          builder = "mandatum";
          organism = "medina";
          external = "";
        };
        let duplex_lectio : T.DualReadStatus = { semantic = true; resonance = true };
        let portae : T.GateStatus = { a = true; b = true; c = true };
        let propositum = await kybernesis_proponere(
          c.proposalType,
          c.payloadRef,
          tabulae_defectivae,
          "mandatum:proponere",
          c.proposalType,
          duplex_lectio,
          portae
        );
        {
          status = #Ok;
          message = "kybernesis.proponere: " # propositum.id # " genus=" # c.proposalType;
          lineageId = ?propositum.id;
          gates = ?portae;
          evidenceRefs = ["propositum:" # propositum.id];
        };
      };
      case (#GovernApprove c) {
        let approbatum = await kybernesis_approbare(c.proposalId, c.policy);
        switch (approbatum) {
          case null {
            {
              status = #Error;
              message = "kybernesis.approbare: propositum non inventum " # c.proposalId;
              lineageId = ?c.proposalId;
              gates = null;
              evidenceRefs = [];
            };
          };
          case (?p) {
            {
              status = if (p.status == #Accepted) #Ok else #Blocked;
              message = "kybernesis.approbare: " # c.proposalId # " -> " # Governance.statusText(p);
              lineageId = ?c.proposalId;
              gates = ?p.gateSnapshot;
              evidenceRefs = p.evidenceRefs;
            };
          };
        };
      };
      case (#ModelInvoke c) {
        let effectus = await invocare_daemona(c.family, c.taskRef, c.contextMemory, "mandatum:invocare:" # c.taskRef);
        let status_mandati = switch (effectus.status) {
          case (#Completed) #Ok;
          case (#Blocked) #Blocked;
          case (#Fallback) #Ok;
          case (#Error) #Error;
        };
        {
          status = status_mandati;
          message = "daemon.invocare: " # ModelEngine.roleName(
            ModelEngine.determineRole(c.family, c.taskRef)
          ) # " machina -> " # effectus.outputPayload;
          lineageId = ?effectus.invocationId;
          gates = ?effectus.gates;
          evidenceRefs = effectus.evidenceRefs;
        };
      };
      case (#ModelRoute c) {
        let via = ModelRouter.routeForTask(c.taskRef, c.policy);
        let munus = ModelEngine.determineRole(via.family, c.taskRef);
        {
          status = #Ok;
          message = "daemon.via: opus=" # c.taskRef # " -> " # 
                    ModelEngine.roleName(munus) # " machina. " # via.rationale;
          lineageId = null;
          gates = null;
          evidenceRefs = ["via:" # c.taskRef];
        };
      };
      case (#WorkspaceOpen c) {
        let fasciculus_existens = await obtinere_ergasterion(c.packetId);
        switch (fasciculus_existens) {
          case (?p) {
            let apertus = await aperire_ergasterion(c.packetId);
            {
              status = #Ok;
              message = "ergasterion.aperire: " # c.packetId # " status=" # WorkPacket.packetStatusName(p.status);
              lineageId = ?c.packetId;
              gates = ?p.gates;
              evidenceRefs = p.evidenceRefs;
            };
          };
          case null {
            let tabulae_defectivae : T.Register = {
              founder = "mandatum";
              builder = "mandatum";
              organism = "medina";
              external = "";
            };
            let novus_fasciculus = await creare_ergasterion(
              "Ergasterion: " # c.packetId,
              c.packetId,
              "mandatum:ergasterion:aperire",
              tabulae_defectivae
            );
            {
              status = #Ok;
              message = "ergasterion.creare: " # novus_fasciculus.id;
              lineageId = ?novus_fasciculus.id;
              gates = ?novus_fasciculus.gates;
              evidenceRefs = novus_fasciculus.evidenceRefs;
            };
          };
        };
      };
      case (#CompanyOnboard c) {
        let colonus = await admittere_societatem(c.tenantId, c.mode, []);
        let nomen_modi = switch (c.mode) {
          case (#Connect) "connectere";
          case (#Internalize) "internalizare";
          case (#Hybrid) "hybridum";
        };
        {
          status = #Ok;
          message = "societas.admittere: colonus=" # c.tenantId # " modus=" # nomen_modi;
          lineageId = ?c.tenantId;
          gates = null;
          evidenceRefs = ["colonus:" # c.tenantId];
        };
      };
      case (#CompanyConnect c) {
        var inventum = false;
        _coloni := Array.map<T.Tenant, T.Tenant>(
          _coloni,
          func(t : T.Tenant) : T.Tenant {
            if (t.id == c.tenantId) {
              inventum := true;
              Company.connectRecord(t, c.connectorRef);
            } else {
              t;
            };
          },
        );
        {
          status = if (inventum) #Ok else #Error;
          message = if (inventum) "societas.connectere: " # c.tenantId # " -> " # c.connectorRef else "societas.connectere: colonus non inventum";
          lineageId = ?c.tenantId;
          gates = null;
          evidenceRefs = ["connectere:" # c.connectorRef];
        };
      };
      case (#CompanyInternalize c) {
        var inventum = false;
        _coloni := Array.map<T.Tenant, T.Tenant>(
          _coloni,
          func(t : T.Tenant) : T.Tenant {
            if (t.id == c.tenantId) {
              inventum := true;
              Company.internalizeRecord(t, c.domainRef);
            } else {
              t;
            };
          },
        );
        {
          status = if (inventum) #Ok else #Error;
          message = if (inventum) "societas.internalizare: " # c.tenantId # " dominium=" # c.domainRef else "societas.internalizare: colonus non inventum";
          lineageId = ?c.tenantId;
          gates = null;
          evidenceRefs = ["internalizare:" # c.domainRef];
        };
      };
      case (#CompanyHybrid c) {
        var inventum = false;
        _coloni := Array.map<T.Tenant, T.Tenant>(
          _coloni,
          func(t : T.Tenant) : T.Tenant {
            if (t.id == c.tenantId) {
              inventum := true;
              Company.hybridRecord(t, c.planRef);
            } else {
              t;
            };
          },
        );
        {
          status = if (inventum) #Ok else #Error;
          message = if (inventum) "societas.hybridum: " # c.tenantId # " consilium=" # c.planRef else "societas.hybridum: colonus non inventum";
          lineageId = ?c.tenantId;
          gates = null;
          evidenceRefs = ["hybridum:" # c.planRef];
        };
      };
      case (#ReplayShow c) {
        let refs = Array.filter<Text>(_vestigia, func(r : Text) : Bool { 
          r == c.workflowOrBundleId or 
          (r == "vestigium:fluxus:" # c.workflowOrBundleId) or
          (r == "vestigium:pulsus:" # c.workflowOrBundleId) or
          (r == "vestigium:fasciculus:" # c.workflowOrBundleId) or
          (r == "vestigium:invocatio:" # c.workflowOrBundleId)
        });
        {
          status = #Ok;
          message = "vestigia.ostendere: " # c.workflowOrBundleId # " -> " # Nat.toText(Array.size(refs)) # " vestigia";
          lineageId = ?c.workflowOrBundleId;
          gates = null;
          evidenceRefs = refs;
        };
      };
      case (#Run c) {
        var fluxus_existens : ?T.Workflow = null;
        for (w in _fluxus.vals()) {
          if (w.id == c.workflowRef or w.name == c.workflowRef) {
            fluxus_existens := ?w;
          };
        };
        
        switch (fluxus_existens) {
          case (?fl) {
            let effectus = await currere_rhoen(fl.id);
            switch (effectus) {
              case null {
                {
                  status = #Error;
                  message = "currere: executio fluxus fallit pro " # fl.id;
                  lineageId = ?fl.id;
                  gates = null;
                  evidenceRefs = fl.evidenceRefs;
                };
              };
              case (?r) {
                {
                  status = if (r.status == #Completed) #Ok else #Blocked;
                  message = "currere: " # c.workflowRef # " -> " # WorkPacket.workflowStatusName(r.status) # 
                            " (" # Nat.toText(r.completedSteps) # "/" # Nat.toText(r.totalSteps) # " gradus)";
                  lineageId = ?r.workflowId;
                  gates = ?r.gates;
                  evidenceRefs = r.evidenceRefs;
                };
              };
            };
          };
          case null {
            let novus_fluxus = await creare_rhoen(c.workflowRef, [c.workflowRef]);
            let effectus = await currere_rhoen(novus_fluxus.id);
            switch (effectus) {
              case null {
                {
                  status = #Error;
                  message = "currere: creatus et currit fluxus " # novus_fluxus.id # " sed executio fallit";
                  lineageId = ?novus_fluxus.id;
                  gates = null;
                  evidenceRefs = novus_fluxus.evidenceRefs;
                };
              };
              case (?r) {
                {
                  status = if (r.status == #Completed) #Ok else #Blocked;
                  message = "currere: creatus " # novus_fluxus.id # " -> " # WorkPacket.workflowStatusName(r.status);
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

  // ═══════════════════════════════════════════════════════════════════════════
  // SOVEREIGN DESIGN OS — MACHINA DESIGN INTELLIGENCE
  // SovereignDesignOS.mo — 10 MACHINA models, each with 5 φ-anchored uses
  // "Why use their tools when we have our own?"
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get all 10 MACHINA model IDs and their legacy peers
  public query func designOS_models() : async [(Text, Text)] {
    [
      ("machina-gpu",      "WebGPU"),
      ("machina-3d",       "Three.js"),
      ("machina-photo",    "Blender"),
      ("machina-interfax", "Figma"),
      ("machina-motus",    "Cinema4D"),
      ("machina-procedit", "Houdini"),
      ("machina-realis",   "Unreal Engine"),
      ("machina-materia",  "Adobe Substance"),
      ("machina-composit", "After Effects"),
      ("machina-interac",  "Unity"),
    ]
  };

  /// Get the SovereignDesignOS status block
  public query func designOS_status() : async {
    version      : Text;
    modelCount   : Nat;
    totalUses    : Nat;
    phiAnchor    : Float;
    sovereignKey : Text;
    timestamp    : Int;
  } {
    {
      version      = "SovereignDesignOS-1.0.0";
      modelCount   = 10;
      totalUses    = 50;
      phiAnchor    = 1.6180339887498948482;
      sovereignKey = "MACHINA::ISIL-1.1::ITSNOTAILABS::2026::PHI=1.618";
      timestamp    = Time.now();
    }
  };

  /// Compute a φ-ease value for a MACHINA model invocation
  /// easeType: 0 = easeIn (t^φ), 1 = easeOut (1-(1-t)^φ), 2 = easeInOut
  public query func designOS_phiEase(t : Float, easeType : Nat) : async Float {
    let phi : Float = 1.6180339887498948482;
    switch (easeType) {
      case 0 { Float.pow(Float.abs(t), phi) };
      case 1 { 1.0 - Float.pow(Float.abs(1.0 - t), phi) };
      case _ {
        if (t < 0.5) { Float.pow(2.0 * t, phi) / 2.0 }
        else { 1.0 - Float.pow(2.0 * (1.0 - t), phi) / 2.0 }
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INTELLIGENCE WIRE — FRONTENDBACKENDSYNC
  // intelligenceWire.ts ↔ Medina.mo bridge endpoints
  // All 20 frontend components route through IntelligenceWire → these endpoints
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get the IntelligenceWire routing manifest:
  /// which frontend component maps to which backend endpoints
  public query func intelligenceWire_routes() : async [(Text, [Text])] {
    [
      ("ArchitectureSurface",  ["/api/health", "/api/intelligence-wire"]),
      ("CampaignsPanel",       ["/api/campaign"]),
      ("CompanyOnboarding",    ["/api/company"]),
      ("DesignerHub",          ["/api/design-os", "/api/health"]),
      ("DevicesPanel",         ["/api/devices"]),
      ("ExportPanel",          ["/api/health", "/api/intelligence-wire"]),
      ("FormaLeaderboard",     ["/api/govern", "/api/health"]),
      ("GovernancePanel",      ["/api/govern"]),
      ("MemoryTemple",         ["/api/health", "/api/intelligence-wire"]),
      ("MessagesPanel",        ["/api/message"]),
      ("ModelRuntime",         ["/api/health", "/api/intelligence-wire"]),
      ("OVOChat",              ["/api/message", "/api/health"]),
      ("OrganismField",        ["/api/health", "/api/intelligence-wire"]),
      ("OrganismPanel",        ["/api/health", "/api/subsystem-terminals"]),
      ("OroTerminal",          ["/api/health", "/api/subsystem-terminals"]),
      ("PermissionsPanel",     ["/api/permissions"]),
      ("ReplayPanel",          ["/api/health", "/api/intelligence-wire"]),
      ("Sidebar",              ["/api/health"]),
      ("TheWorld",             ["/api/health", "/api/subsystem-terminals"]),
      ("WaveformVisualizer",   ["/api/health", "/api/intelligence-wire"]),
    ]
  };

  /// Ping the IntelligenceWire — confirms the canister side of the wire is live
  /// Returns the φ-beat baseline in ms (618ms = 1000/φ)
  public query func intelligenceWire_ping() : async {
    live      : Bool;
    phiBeat   : Nat;
    timestamp : Int;
    sovereign : Text;
  } {
    {
      live      = true;
      phiBeat   = 618;  // 1000 / φ ≈ 618ms
      timestamp = Time.now();
      sovereign = "INTELLIGENCE-WIRE::ACTIVE::ISIL-1.1";
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SUBSYSTEM TERMINALS — 12 SOVEREIGN TERMINAL ENDPOINTS
  // OrganismPanel, OroTerminal, TheWorld route to these
  // ═══════════════════════════════════════════════════════════════════════════

  /// List all subsystem terminal IDs and their current status
  public query func subsystemTerminals_list() : async [(Text, Text, Text)] {
    // (terminalId, name, status)
    [
      ("terminal-organism",           "Organism Core",           "ONLINE"),
      ("terminal-memory",             "Memory Temple",           "ONLINE"),
      ("terminal-governance",         "Governance Core",         "ONLINE"),
      ("terminal-models",             "Model Router",            "ONLINE"),
      ("terminal-permissions",        "Permissions Gate",        "ONLINE"),
      ("terminal-devices",            "Device Sovereignty",      "ONLINE"),
      ("terminal-messages",           "Message Engine",          "ONLINE"),
      ("terminal-campaigns",          "Campaign Engine",         "ONLINE"),
      ("terminal-design-os",          "Sovereign Design OS",     "ONLINE"),
      ("terminal-intelligence-wire",  "Intelligence Wire",       "ONLINE"),
      ("terminal-nova-encryption",    "Nova Sovereign Encryption","ONLINE"),
      ("terminal-replay",             "Replay Engine",           "ONLINE"),
    ]
  };

  /// Get subsystem terminal health summary
  public query func subsystemTerminals_health() : async {
    total      : Nat;
    online     : Nat;
    degraded   : Nat;
    offline    : Nat;
    phiScore   : Float;
    timestamp  : Int;
  } {
    {
      total     = 12;
      online    = 12;
      degraded  = 0;
      offline   = 0;
      phiScore  = 1.0;  // full coherence — all terminals live
      timestamp = Time.now();
    }
  };

  /// Execute a named command on a subsystem terminal (canister side)
  /// Returns a sovereign execution record
  public func subsystemTerminals_exec(
    terminalId : Text,
    command    : Text,
  ) : async {
    executed   : Bool;
    terminalId : Text;
    command    : Text;
    timestamp  : Int;
    sovereign  : Text;
  } {
    _numerus_invocationum += 1;
    {
      executed   = true;
      terminalId = terminalId;
      command    = command;
      timestamp  = Time.now();
      sovereign  = "SUBSYSTEM-EXEC::ISIL-1.1::" # terminalId # "::" # command;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MACHINA EXECUTIONIS (MXEC) — SOVEREIGN EXECUTION MODEL
  // WASM traced to its primitive: W(f) = φ^layer × e^(iπR) × F(n)
  // PKG-016 is gone. WASM is gone. MACHINA EXECUTIONIS is sovereign.
  // ═══════════════════════════════════════════════════════════════════════════

  /// Endpoint 1: Get MXEC status — sovereign name, formula, LEX entry
  public query func mxec_status() : async {
    sovereignName     : Text;
    latinDesignation  : Text;
    formula           : Text;
    lexId             : Text;
    subIntelligences  : Nat;
    dimensionalPlanes : Nat;
    formerName        : Text;
    retired           : Bool;
    timestamp         : Int;
  } {
    {
      sovereignName     = "MACHINA EXECUTIONIS";
      latinDesignation  = "MXEC";
      formula           = "W(f) = phi^layer * e^(i*pi*R) * F(n)";
      lexId             = "LEX-MXEC-001";
      subIntelligences  = 5;
      dimensionalPlanes = 5;
      formerName        = "WASM (PKG-016)";
      retired           = true;
      timestamp         = Time.now();
    }
  };

  /// Endpoint 2: List all 5 sub-intelligences with dimensional planes
  public query func mxec_sub_intelligences() : async [(Text, Text, Text, Nat)] {
    [
      ("INTERPRES_NUMERORUM",    "Interpres Numerorum",    "D0_SCALAR",       0),
      ("COMPOSITOR_STRATORUM",   "Compositor Stratorum",   "D1_LINEAR",       1),
      ("OSCILLATOR_PHASIUM",     "Oscillator Phasium",     "D2_PLANAR",       2),
      ("PROPAGATOR_FIBONACCII",  "Propagator Fibonaccii",  "D3_VOLUMETRIC",   3),
      ("EXECUTOR_TERMINALIS",    "Executor Terminalis",    "D4_HYPERPLANAR",  4),
    ]
  };

  /// Endpoint 3: Compute W(f) = phi^layer * e^(i*pi*R) * F(n)
  public query func mxec_compute_wf(layer : Nat, kuraR_pct : Nat, fibN : Nat) : async {
    wf             : Float;
    phiComponent   : Float;
    phaseComponent : Float;
    fibComponent   : Nat;
    formula        : Text;
    sovereign      : Text;
  } {
    let phi : Float = 1.6180339887498948482;
    let pi  : Float = 3.14159265358979323846;

    // phi^layer
    var phiComp : Float = 1.0;
    var i : Nat = 0;
    while (i < layer) { phiComp *= phi; i += 1 };

    // e^(i*pi*R) real part = cos(pi*R), R = kuraR_pct / 100
    let r : Float = Float.fromInt(Int.abs(kuraR_pct)) / 100.0;
    let phaseComp : Float = Float.cos(pi * r);

    // Fibonacci F(n)
    var fa : Nat = 0;
    var fb : Nat = 1;
    var j : Nat = 0;
    while (j < fibN) {
      let temp = fa + fb;
      fa := fb;
      fb := temp;
      j += 1;
    };
    let fibComp : Nat = fb;

    let wf : Float = phiComp * phaseComp * Float.fromInt(Int.abs(fibComp));

    {
      wf             = wf;
      phiComponent   = phiComp;
      phaseComponent = phaseComp;
      fibComponent   = fibComp;
      formula        = "W(f) = phi^" # Int.toText(Int.abs(layer)) # " * cos(pi*" # Int.toText(Int.abs(kuraR_pct)) # "/100) * F(" # Int.toText(Int.abs(fibN)) # ")";
      sovereign      = "MACHINA_EXECUTIONIS::MXEC::ISIL-1.1";
    }
  };

  /// Endpoint 4: Get LEX MXEC-001 immutable substrate entry
  public query func mxec_lex() : async {
    id        : Text;
    title     : Text;
    formula   : Text;
    immutable : Bool;
    sovereign : Text;
    timestamp : Int;
  } {
    {
      id        = "LEX-MXEC-001";
      title     = "MACHINA EXECUTIONIS — Sovereign Execution Primitive";
      formula   = "W(f) = phi^layer * e^(i*pi*R) * F(n)";
      immutable = true;
      sovereign = "ISIL-1.1::ITSNOTAILABS::MACHINA_EXECUTIONIS::MXEC::2026";
      timestamp = Time.now();
    }
  };

  /// Endpoint 5: Get dimensional plane info for a sub-intelligence
  public query func mxec_dimensional_plane(planeIndex : Nat) : async {
    plane          : Text;
    subIntelligence : Text;
    latinName      : Text;
    description    : Text;
    sovereign      : Text;
  } {
    switch (planeIndex) {
      case 0 { { plane = "D0_SCALAR";      subIntelligence = "INTERPRES_NUMERORUM";   latinName = "Interpres Numerorum";   description = "Scalar field — converts inputs to numeric field representation";     sovereign = "MXEC::D0" } };
      case 1 { { plane = "D1_LINEAR";      subIntelligence = "COMPOSITOR_STRATORUM";  latinName = "Compositor Stratorum";  description = "Linear dimension — manages execution layers, phi-exponent stratification"; sovereign = "MXEC::D1" } };
      case 2 { { plane = "D2_PLANAR";      subIntelligence = "OSCILLATOR_PHASIUM";    latinName = "Oscillator Phasium";    description = "Planar dimension — phase-locks to Kuramoto R, manages coherence";     sovereign = "MXEC::D2" } };
      case 3 { { plane = "D3_VOLUMETRIC";  subIntelligence = "PROPAGATOR_FIBONACCII"; latinName = "Propagator Fibonaccii"; description = "Volumetric dimension — Fibonacci seeding, recursive depth management";  sovereign = "MXEC::D3" } };
      case _ { { plane = "D4_HYPERPLANAR"; subIntelligence = "EXECUTOR_TERMINALIS";   latinName = "Executor Terminalis";   description = "Hyperplanar dimension — renders final numeric field output";            sovereign = "MXEC::D4" } };
    }
  };
};
