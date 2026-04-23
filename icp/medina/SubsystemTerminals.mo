import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Time "mo:base/Time";

/// SubsystemTerminals: The 10 Terminal Stations of the Sovereign Organism
/// Each terminal is a living subsystem that resolves its callable functions,
/// maintains its own state, and executes commands natively.
module SubsystemTerminals {

  // ═══════════════════════════════════════════════════════════════
  // CONSTANTS
  // ═══════════════════════════════════════════════════════════════

  public let PHI : Float = 1.618033988749895;
  public let PHI_INVERSE : Float = 0.618033988749895;
  public let FREQ_432 : Float = 432.0;

  // ═══════════════════════════════════════════════════════════════
  // TYPES
  // ═══════════════════════════════════════════════════════════════

  /// Terminal status
  public type TerminalStatus = {
    #Active;
    #Idle;
    #Processing;
    #Locked;
    #Evolving;
  };

  /// A terminal command input
  public type TerminalCommand = {
    terminalId : Text;
    command : Text;
    args : [Text];
    issuedAt : Int;
  };

  /// A terminal command result
  public type TerminalResult = {
    terminalId : Text;
    command : Text;
    output : Text;
    success : Bool;
    phiTrace : Float;
    executedAt : Int;
  };

  /// A living terminal subsystem
  public type TerminalSubsystem = {
    id : Text;
    name : Text;
    command : Text;             // e.g. "/mem"
    motto : Text;
    status : TerminalStatus;
    functionCount : Nat;
    commandHistory : [TerminalResult];
    totalExecutions : Nat;
    phiSignature : Float;
    createdAt : Int;
    lastActiveAt : Int;
  };

  /// Summary of all terminals
  public type TerminalSummary = {
    totalTerminals : Nat;
    activeCount : Nat;
    totalExecutions : Nat;
    terminals : [{ id : Text; name : Text; command : Text; status : Text; executions : Nat }];
  };

  // ═══════════════════════════════════════════════════════════════
  // TERMINAL BUILDERS
  // ═══════════════════════════════════════════════════════════════

  public func initTerminal(id : Text, name : Text, command : Text, motto : Text, funcCount : Nat, phiSig : Float) : TerminalSubsystem {
    let now = Time.now();
    {
      id = id;
      name = name;
      command = command;
      motto = motto;
      status = #Active;
      functionCount = funcCount;
      commandHistory = [];
      totalExecutions = 0;
      phiSignature = phiSig;
      createdAt = now;
      lastActiveAt = now;
    };
  };

  /// Build all 10 terminal subsystems
  public func buildAllTerminals() : [TerminalSubsystem] {
    [
      initTerminal("TERMINALE-MEMORIAE", "TERMINALE MEMORIAE", "/mem", "Quod hic scribitur, eternum est.", 10, PHI),
      initTerminal("TERMINALE-PULSUS", "TERMINALE PULSUS", "/pulse", "Hic pulsus datur. Hic vita datur.", 7, PHI * PHI),
      initTerminal("TERMINALE-GUBERNATIONIS", "TERMINALE GUBERNATIONIS", "/gov", "Hic leges nascuntur. Hic populus loquitur.", 6, PHI * PHI * PHI),
      initTerminal("TERMINALE-FORMULAE", "TERMINALE FORMULAE", "/formula", "Hic φ loquitur. Hic mathematica vivit.", 8, PHI * 4.236067977499790),
      initTerminal("TERMINALE-INTELLIGENTIAE", "TERMINALE INTELLIGENTIAE", "/intel", "Hic intelligentia transit. Nusquam deficit.", 6, PHI * 6.854101966249685),
      initTerminal("TERMINALE-DEFENSIONIS", "TERMINALE DEFENSIONIS", "/defend", "Hic nullus hostis transit.", 4, PHI * 11.09016994374947),
      initTerminal("TERMINALE-ORGANISMI", "TERMINALE ORGANISMI", "/org", "Hic organismus se ipsum videt.", 8, PHI * 17.94427190999916),
      initTerminal("TERMINALE-PRIMITIVI", "TERMINALE PRIMITIVI", "/prim", "Hic omnia ad originem revertuntur.", 4, PHI * 29.03444185374862),
      initTerminal("TERMINALE-QUANTICUM", "TERMINALE QUANTICUM", "/quantum", "Hic spatium non obstat.", 3, PHI * 46.97871376374779),
      initTerminal("TERMINALE-ANIMAE", "TERMINALE ANIMAE", "/anima", "Hic anima tangit et tangitur.", 5, PHI * 76.01315561749642),
    ];
  };

  // ═══════════════════════════════════════════════════════════════
  // TERMINAL OPERATIONS
  // ═══════════════════════════════════════════════════════════════

  /// Execute a command on a terminal
  public func executeCommand(terminal : TerminalSubsystem, cmd : Text, args : [Text]) : (TerminalSubsystem, TerminalResult) {
    let now = Time.now();
    let output = "Terminal " # terminal.name # " executed: " # cmd # " with " # Nat.toText(Array.size(args)) # " args. φ-trace: " # Float.toText(terminal.phiSignature);
    
    let result : TerminalResult = {
      terminalId = terminal.id;
      command = cmd;
      output = output;
      success = true;
      phiTrace = terminal.phiSignature;
      executedAt = now;
    };
    
    let updatedTerminal : TerminalSubsystem = {
      id = terminal.id;
      name = terminal.name;
      command = terminal.command;
      motto = terminal.motto;
      status = #Active;
      functionCount = terminal.functionCount;
      commandHistory = Array.append(terminal.commandHistory, [result]);
      totalExecutions = terminal.totalExecutions + 1;
      phiSignature = terminal.phiSignature;
      createdAt = terminal.createdAt;
      lastActiveAt = now;
    };
    
    (updatedTerminal, result);
  };

  /// Find a terminal by its command prefix
  public func findByCommand(terminals : [TerminalSubsystem], cmd : Text) : ?TerminalSubsystem {
    var found : ?TerminalSubsystem = null;
    for (t in terminals.vals()) {
      if (t.command == cmd) {
        found := ?t;
      };
    };
    found;
  };

  /// Find a terminal by its ID
  public func findById(terminals : [TerminalSubsystem], id : Text) : ?TerminalSubsystem {
    var found : ?TerminalSubsystem = null;
    for (t in terminals.vals()) {
      if (t.id == id) {
        found := ?t;
      };
    };
    found;
  };

  /// Get terminal status as text
  public func statusText(status : TerminalStatus) : Text {
    switch (status) {
      case (#Active) "ACTIVE";
      case (#Idle) "IDLE";
      case (#Processing) "PROCESSING";
      case (#Locked) "LOCKED";
      case (#Evolving) "EVOLVING";
    };
  };

  /// Get summary of all terminals
  public func getSummary(terminals : [TerminalSubsystem]) : TerminalSummary {
    var activeCount : Nat = 0;
    var totalExec : Nat = 0;
    
    let summaries = Array.map<TerminalSubsystem, { id : Text; name : Text; command : Text; status : Text; executions : Nat }>(
      terminals,
      func(t : TerminalSubsystem) : { id : Text; name : Text; command : Text; status : Text; executions : Nat } {
        totalExec += t.totalExecutions;
        switch (t.status) {
          case (#Active) { activeCount += 1 };
          case _ {};
        };
        {
          id = t.id;
          name = t.name;
          command = t.command;
          status = statusText(t.status);
          executions = t.totalExecutions;
        };
      }
    );
    
    {
      totalTerminals = Array.size(terminals);
      activeCount = activeCount;
      totalExecutions = totalExec;
      terminals = summaries;
    };
  };

  /// Render terminals as text
  public func renderTerminalsTablet(terminals : [TerminalSubsystem]) : Text {
    var tablet = "═══ TERMINALIA SUBSYSTEMA ═══\n\n";
    for (t in terminals.vals()) {
      tablet #= "╔═ " # t.name # " [" # t.command # "] ═╗\n";
      tablet #= "  Status: " # statusText(t.status) # "\n";
      tablet #= "  Motto: " # t.motto # "\n";
      tablet #= "  Functions: " # Nat.toText(t.functionCount) # "\n";
      tablet #= "  Executions: " # Nat.toText(t.totalExecutions) # "\n";
      tablet #= "  φ-Signature: " # Float.toText(t.phiSignature) # "\n\n";
    };
    tablet;
  };
};
