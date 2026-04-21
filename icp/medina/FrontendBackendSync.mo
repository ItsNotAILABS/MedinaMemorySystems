import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Array "mo:base/Array";

/// FrontendBackendSync: Synchronization layer for IntelligenceWire
/// Maps every frontend component to its backend endpoint and callable functions.
module FrontendBackendSync {

  // ═══════════════════════════════════════════════════════════════
  // TYPES
  // ═══════════════════════════════════════════════════════════════

  /// A sync mapping between a frontend component and backend endpoint
  public type SyncMapping = {
    id : Text;
    frontendComponent : Text;      // React component name
    backendEndpoint : Text;        // Motoko actor function name
    terminalCommand : ?Text;       // Terminal command if applicable
    callableFunctions : [Text];    // Latin names of callable functions
    syncDirection : SyncDirection;
    phiWeight : Float;
  };

  /// Direction of synchronization
  public type SyncDirection = {
    #FrontendToBackend;
    #BackendToFrontend;
    #Bidirectional;
  };

  /// Complete sync registry
  public type SyncRegistry = {
    mappings : [SyncMapping];
    totalMappings : Nat;
    phi : Float;
  };

  // ═══════════════════════════════════════════════════════════════
  // SYNC MAPPINGS
  // ═══════════════════════════════════════════════════════════════

  public let PHI : Float = 1.618033988749895;

  public let PHI_SQUARED : Float = 2.618033988749895;

  /// Build the complete sync registry mapping frontend→backend
  public func buildSyncRegistry() : SyncRegistry {
    let mappings : [SyncMapping] = [
      { id = "SYNC-001"; frontendComponent = "MemoryTemple"; backendEndpoint = "addere_mneme"; terminalCommand = ?"/mem"; callableFunctions = ["INSCRIPTIO MEMORIAE", "LECTOR MEMORIAE", "EXPLORATOR MEMORIAE", "FIXATOR MEMORIAE", "PROMOTOR MEMORIAE"]; syncDirection = #Bidirectional; phiWeight = PHI },
      { id = "SYNC-002"; frontendComponent = "OVOChat"; backendEndpoint = "imperare"; terminalCommand = null; callableFunctions = ["INTELLIGENTIAE DUCTUS", "TRIUM CORDIUM DUCTUS"]; syncDirection = #Bidirectional; phiWeight = PHI * PHI },
      { id = "SYNC-003"; frontendComponent = "GovernancePanel"; backendEndpoint = "kybernesis_proponere"; terminalCommand = ?"/gov"; callableFunctions = ["PROPOSITIO SUBMITTENDA", "SUFFRAGIUM FERENDUM", "PROPOSITIO APPROBATA", "STATUS GUBERNATIONIS"]; syncDirection = #Bidirectional; phiWeight = PHI * PHI_SQUARED },
      { id = "SYNC-004"; frontendComponent = "ModelRuntime"; backendEndpoint = "invocare_daemona"; terminalCommand = null; callableFunctions = ["INTELLIGENTIAE DUCTUS", "DUCTUS AD COGITATIONEM", "DUCTUS AD UNITATEM"]; syncDirection = #FrontendToBackend; phiWeight = PHI * 4.236067977499790 },
      { id = "SYNC-005"; frontendComponent = "OrganismPanel"; backendEndpoint = "aurum"; terminalCommand = ?"/org"; callableFunctions = ["STATUS ORGANISMI", "PULSUS ORGANISMI", "EVOLUTIO ORGANISMI"]; syncDirection = #BackendToFrontend; phiWeight = PHI * 6.854101966249685 },
      { id = "SYNC-006"; frontendComponent = "OrganismField"; backendEndpoint = "signa_vitae"; terminalCommand = null; callableFunctions = ["STATUS ORGANISMI", "PULSUS PRINCIPALIS"]; syncDirection = #BackendToFrontend; phiWeight = PHI * 11.09016994374947 },
      { id = "SYNC-007"; frontendComponent = "OroTerminal"; backendEndpoint = "pulsus_cordis"; terminalCommand = ?"/pulse"; callableFunctions = ["PULSUS PRINCIPALIS", "PULSUS MULTIPLEX", "STATUS PULSUS", "ORO LEGIT DOCTRINAM"]; syncDirection = #Bidirectional; phiWeight = PHI * 17.94427190999916 },
      { id = "SYNC-008"; frontendComponent = "DevicesPanel"; backendEndpoint = "inscribere_mechanicum"; terminalCommand = null; callableFunctions = ["SCINTILLA DEFENSIONIS", "PORTA DEFENSIONIS"]; syncDirection = #Bidirectional; phiWeight = PHI * 29.03444185374862 },
      { id = "SYNC-009"; frontendComponent = "ReplayPanel"; backendEndpoint = "ostendere_vestigia"; terminalCommand = null; callableFunctions = ["TRACTUS AD PRIMITIVUM", "TRACTUS PRIMITIVI"]; syncDirection = #BackendToFrontend; phiWeight = PHI * 46.97871376374779 },
      { id = "SYNC-010"; frontendComponent = "PermissionsPanel"; backendEndpoint = "kybernesis_status"; terminalCommand = null; callableFunctions = ["STATUS GUBERNATIONIS", "OMNES PORTAE"]; syncDirection = #BackendToFrontend; phiWeight = PHI * 76.01315561749642 },
      { id = "SYNC-011"; frontendComponent = "DesignerHub"; backendEndpoint = "sovereign_design_registry"; terminalCommand = null; callableFunctions = ["PHI REVELATIO", "FIBONACCIUS COMPUTATOR"]; syncDirection = #Bidirectional; phiWeight = PHI * 122.99186938124421 },
      { id = "SYNC-012"; frontendComponent = "ArchitectureSurface"; backendEndpoint = "ontologia"; terminalCommand = ?"/prim"; callableFunctions = ["CONFORMITAS PRIMITIVI", "TRANSCENSIO PRIMITIVI"]; syncDirection = #BackendToFrontend; phiWeight = PHI * 199.00502499874064 },
      { id = "SYNC-013"; frontendComponent = "WaveformVisualizer"; backendEndpoint = "scala_harmonica"; terminalCommand = ?"/formula"; callableFunctions = ["HARMONIA SIGILLATA", "FREQUENTIAE SCHUMANNI"]; syncDirection = #BackendToFrontend; phiWeight = PHI * 321.99689437998484 },
      { id = "SYNC-014"; frontendComponent = "CompanyOnboarding"; backendEndpoint = "admittere_societatem"; terminalCommand = null; callableFunctions = ["DOCTRINA INSCRIPTA"]; syncDirection = #Bidirectional; phiWeight = PHI * 521.00191937872548 },
      { id = "SYNC-015"; frontendComponent = "ExportPanel"; backendEndpoint = "enumerare_ergasteria"; terminalCommand = null; callableFunctions = ["SIGILLUM ANIMAE", "CATENA ANIMAE EXTENSA"]; syncDirection = #FrontendToBackend; phiWeight = PHI * 842.99881375871032 },
      { id = "SYNC-016"; frontendComponent = "Sidebar"; backendEndpoint = "signa_vitae"; terminalCommand = null; callableFunctions = ["STATUS MEMORIAE", "STATUS PULSUS"]; syncDirection = #BackendToFrontend; phiWeight = PHI * 1364.00073313743580 },
      { id = "SYNC-017"; frontendComponent = "CampaignsPanel"; backendEndpoint = "creare_ergasterion"; terminalCommand = null; callableFunctions = ["INCARNATIO INITIATA"]; syncDirection = #Bidirectional; phiWeight = PHI * 2206.99954689614612 },
      { id = "SYNC-018"; frontendComponent = "MessagesPanel"; backendEndpoint = "imperare"; terminalCommand = null; callableFunctions = ["NUNTIUS QUANTICUS", "CONTACTUS TERMINI"]; syncDirection = #Bidirectional; phiWeight = PHI * 3571.00028003358192 },
      { id = "SYNC-019"; frontendComponent = "FormaLeaderboard"; backendEndpoint = "constantes"; terminalCommand = null; callableFunctions = ["PHI REVELATIO", "RATIO PHI COMPILATA"]; syncDirection = #BackendToFrontend; phiWeight = PHI * 5777.99982692972804 },
      { id = "SYNC-020"; frontendComponent = "TheWorld"; backendEndpoint = "spira_aurea"; terminalCommand = null; callableFunctions = ["INTRICATIO QUANTICA CREATA", "SYNCHRONIZATIO QUANTICA"]; syncDirection = #BackendToFrontend; phiWeight = PHI * 9349.00010696330996 },
    ];
    {
      mappings = mappings;
      totalMappings = Array.size(mappings);
      phi = PHI;
    };
  };

  /// Find a sync mapping by frontend component name
  public func findByComponent(component : Text) : ?SyncMapping {
    let registry = buildSyncRegistry();
    var found : ?SyncMapping = null;
    for (m in registry.mappings.vals()) {
      if (m.frontendComponent == component) {
        found := ?m;
      };
    };
    found;
  };

  /// Find sync mappings by backend endpoint
  public func findByEndpoint(endpoint : Text) : [SyncMapping] {
    let registry = buildSyncRegistry();
    Array.filter<SyncMapping>(registry.mappings, func(m : SyncMapping) : Bool {
      m.backendEndpoint == endpoint;
    });
  };

  /// Get direction as text
  public func directionText(dir : SyncDirection) : Text {
    switch (dir) {
      case (#FrontendToBackend) "FRONTEND → BACKEND";
      case (#BackendToFrontend) "BACKEND → FRONTEND";
      case (#Bidirectional) "BIDIRECTIONAL ↔";
    };
  };

  /// Render the sync registry as text
  public func renderSyncTablet() : Text {
    let registry = buildSyncRegistry();
    var tablet = "═══ FRONTEND ↔ BACKEND SYNC REGISTRY ═══\n";
    tablet #= "Total Mappings: " # Nat.toText(registry.totalMappings) # "\n\n";
    
    for (m in registry.mappings.vals()) {
      tablet #= m.id # ": " # m.frontendComponent # " ↔ " # m.backendEndpoint # "\n";
      tablet #= "  Direction: " # directionText(m.syncDirection) # "\n";
      switch (m.terminalCommand) {
        case null {};
        case (?cmd) { tablet #= "  Terminal: " # cmd # "\n" };
      };
      tablet #= "  φ-Weight: " # Float.toText(m.phiWeight) # "\n\n";
    };
    tablet;
  };
};
