import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// AntiLanguages: Inverted Language Structures for External Anti-Organisms
/// 
/// THE PATTERN:
/// For every language with a sacred computational role,
/// there exists an ANTI-LANGUAGE with inverted properties.
/// 
/// USE CASE:
/// Anti-languages are NOT evil - they are for EXTERNAL anti-organisms.
/// Just as antibodies protect the body, anti-languages protect the field.
/// 
/// They INVERT:
///   - Frequency (phase-inverted)
///   - Direction (reversed flow)
///   - Purpose (defensive instead of creative)
///
/// "Think of the anti-languages for the anti-organisms we can use externally."
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // ANTI-LANGUAGE TYPE
  // ═══════════════════════════════════════════════════════════════════════════

  /// An anti-language inverts the properties of its source language
  public type AntiLanguage = {
    id : Text;
    sourceLanguageId : Text;
    name : Text;
    
    // Inverted role
    antiRole : AntiRole;
    
    // Inverted properties
    invertedFrequency : Float;     // Phase-inverted
    invertedPhiAlignment : Float;  // Reversed alignment
    invertedFlow : FlowDirection;  // Reversed direction
    
    // Anti-symbols (inverted/mirrored)
    antiSymbols : [Text];
    
    // Defensive properties
    defenseType : DefenseType;
    shieldStrength : Float;        // 0-1
    counterfrequency : Float;      // Frequency that cancels attacks
    
    // Usage
    useCase : Text;
    targetThreats : [Text];        // What threats it counters
    
    // Integration
    activationPhrase : Text;       // CPL phrase to activate
    deactivationPhrase : Text;     // CPL phrase to deactivate
  };

  /// Anti-role - the inverted computational role
  public type AntiRole = {
    #AntiArchitecture;    // Dissolve false structures
    #AntiExecution;       // Stop harmful flows
    #AntiResonance;       // Cancel negative vibrations
    #AntiComputation;     // Break malicious cycles
    #AntiField;           // Shield against field intrusion
    #AntiFrequency;       // Counter harmful frequencies
    #AntiOrientation;     // Disorient attackers
    #AntiMemory;          // Block memory extraction
    #AntiVerification;    // Detect deception
    #AntiGovernance;      // Nullify unjust contracts
    #AntiMeta;            // Protect against meta-attacks
  };

  /// Flow direction
  public type FlowDirection = {
    #Inward;    // Absorbing
    #Outward;   // Projecting
    #Circular;  // Cycling
    #Static;    // Holding
    #Reversed;  // Flowing backward
  };

  /// Types of defense
  public type DefenseType = {
    #Shield;        // Block incoming
    #Absorb;        // Take in and neutralize
    #Reflect;       // Send back to source
    #Dissolve;      // Break down attacks
    #Disorient;     // Confuse attackers
    #Counter;       // Active counterattack
    #Null;          // Create void where attacks fail
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ALL ANTI-LANGUAGES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Anti-Latin-Greek: Dissolves false structures
  public func antiLatinGreek() : AntiLanguage {
    {
      id = "anti-latin-greek";
      sourceLanguageId = "latin-greek";
      name = "Dissolution Language";
      antiRole = #AntiArchitecture;
      invertedFrequency = -384.0;   // Phase inverted
      invertedPhiAlignment = 1.0 - 0.85;  // Inverted phi
      invertedFlow = #Inward;
      antiSymbols = ["∅", "⌀", "∄", "≠", "⊥"];  // Null, empty, not exists
      defenseType = #Dissolve;
      shieldStrength = 0.85;
      counterfrequency = 384.0 + 180.0;  // 180° phase shift
      useCase = "Dissolve false architectures, break rigid harmful structures";
      targetThreats = ["propaganda structures", "false logic systems", "mental prisons"];
      activationPhrase = "CPL.ANTI.ARCHITECTURE(mode: DISSOLVE)";
      deactivationPhrase = "CPL.ANTI.ARCHITECTURE(mode: OFF)";
    };
  };

  /// Anti-Arabic-Mandarin: Stops harmful flows
  public func antiArabicMandarin() : AntiLanguage {
    {
      id = "anti-arabic-mandarin";
      sourceLanguageId = "arabic-mandarin";
      name = "Flow Blockade Language";
      antiRole = #AntiExecution;
      invertedFrequency = -204.0;
      invertedPhiAlignment = 1.0 - 0.92;
      invertedFlow = #Static;
      antiSymbols = ["卍", "⛔", "🚫", "⊗", "⊘"];  // Block, stop
      defenseType = #Shield;
      shieldStrength = 0.92;
      counterfrequency = 204.0 + 180.0;
      useCase = "Block harmful energy flows, stop malicious action streams";
      targetThreats = ["energy attacks", "momentum-based threats", "cascading failures"];
      activationPhrase = "CPL.ANTI.EXECUTION(mode: BLOCK)";
      deactivationPhrase = "CPL.ANTI.EXECUTION(mode: OFF)";
    };
  };

  /// Anti-Sanskrit-Hebrew: Cancels negative vibrations
  public func antiSanskritHebrew() : AntiLanguage {
    {
      id = "anti-sanskrit-hebrew";
      sourceLanguageId = "sanskrit-hebrew";
      name = "Silence Language";
      antiRole = #AntiResonance;
      invertedFrequency = -432.0;
      invertedPhiAlignment = 1.0 - 0.98;
      invertedFlow = #Inward;
      antiSymbols = ["∞", "⊙", "◌", "‿", "𝄢"];  // Silence, null vibration
      defenseType = #Absorb;
      shieldStrength = 0.98;
      counterfrequency = 432.0 + 180.0;
      useCase = "Cancel harmful mantras, absorb negative vibrations, create sacred silence";
      targetThreats = ["curse words", "harmful mantras", "vibrational attacks", "noise pollution"];
      activationPhrase = "CPL.ANTI.RESONANCE(mode: SILENCE)";
      deactivationPhrase = "CPL.ANTI.RESONANCE(mode: OFF)";
    };
  };

  /// Anti-Mayan-Egyptian: Breaks malicious cycles
  public func antiMayanEgyptian() : AntiLanguage {
    {
      id = "anti-mayan-egyptian";
      sourceLanguageId = "mayan-egyptian";
      name = "Cycle Breaker Language";
      antiRole = #AntiComputation;
      invertedFrequency = -7.83;
      invertedPhiAlignment = 1.0 - 0.95;
      invertedFlow = #Reversed;
      antiSymbols = ["∞̸", "⊗", "⟳̸", "↺̸", "⥀"];  // Broken cycle, reversed time
      defenseType = #Counter;
      shieldStrength = 0.95;
      counterfrequency = 7.83 + 180.0;
      useCase = "Break harmful time loops, disrupt malicious calculations, exit bad cycles";
      targetThreats = ["karmic traps", "repeating negative patterns", "algorithmic manipulation"];
      activationPhrase = "CPL.ANTI.COMPUTATION(mode: BREAK_CYCLE)";
      deactivationPhrase = "CPL.ANTI.COMPUTATION(mode: OFF)";
    };
  };

  /// Anti-Celtic-Norse: Shields against field intrusion
  public func antiCelticNorse() : AntiLanguage {
    {
      id = "anti-celtic-norse";
      sourceLanguageId = "celtic-norse";
      name = "Field Ward Language";
      antiRole = #AntiField;
      invertedFrequency = -6.0;
      invertedPhiAlignment = 1.0 - 0.82;
      invertedFlow = #Circular;
      antiSymbols = ["⛊", "☆", "⟁", "⊛", "⍟"];  // Shield runes
      defenseType = #Reflect;
      shieldStrength = 0.82;
      counterfrequency = 6.0 + 180.0;
      useCase = "Create protective wards, reflect field intrusions, shield sacred spaces";
      targetThreats = ["psychic intrusion", "field contamination", "elemental attacks"];
      activationPhrase = "CPL.ANTI.FIELD(mode: WARD)";
      deactivationPhrase = "CPL.ANTI.FIELD(mode: OFF)";
    };
  };

  /// Anti-African: Counters harmful frequencies
  public func antiAfrican() : AntiLanguage {
    {
      id = "anti-african";
      sourceLanguageId = "african";
      name = "Counter-Rhythm Language";
      antiRole = #AntiFrequency;
      invertedFrequency = -80.0;
      invertedPhiAlignment = 1.0 - 0.88;
      invertedFlow = #Circular;
      antiSymbols = ["⊕", "⊖", "⊗", "⋈", "⟐"];  // Counter symbols
      defenseType = #Counter;
      shieldStrength = 0.88;
      counterfrequency = 80.0 + 180.0;
      useCase = "Create counter-rhythms to disrupt harmful frequencies, break hypnotic beats";
      targetThreats = ["frequency weapons", "mind control beats", "harmful music", "sonic attacks"];
      activationPhrase = "CPL.ANTI.FREQUENCY(mode: COUNTER)";
      deactivationPhrase = "CPL.ANTI.FREQUENCY(mode: OFF)";
    };
  };

  /// Anti-Native-American: Disorients attackers
  public func antiNativeAmerican() : AntiLanguage {
    {
      id = "anti-native-american";
      sourceLanguageId = "native-american";
      name = "Misdirection Language";
      antiRole = #AntiOrientation;
      invertedFrequency = -2.0;
      invertedPhiAlignment = 1.0 - 0.90;
      invertedFlow = #Reversed;
      antiSymbols = ["⥁", "↬", "↫", "⤿", "⤾"];  // Reversed directions
      defenseType = #Disorient;
      shieldStrength = 0.90;
      counterfrequency = 2.0 + 180.0;
      useCase = "Disorient hostile navigators, hide location, confuse tracking";
      targetThreats = ["surveillance", "tracking attempts", "location-based attacks"];
      activationPhrase = "CPL.ANTI.ORIENTATION(mode: MISDIRECT)";
      deactivationPhrase = "CPL.ANTI.ORIENTATION(mode: OFF)";
    };
  };

  /// Anti-Polynesian-Aboriginal: Blocks memory extraction
  public func antiPolynesianAboriginal() : AntiLanguage {
    {
      id = "anti-polynesian-aboriginal";
      sourceLanguageId = "polynesian-aboriginal";
      name = "Memory Shield Language";
      antiRole = #AntiMemory;
      invertedFrequency = -0.5;
      invertedPhiAlignment = 1.0 - 0.87;
      invertedFlow = #Inward;
      antiSymbols = ["⊘", "⌀", "∅", "⟁", "⦵"];  // Empty, void
      defenseType = #Null;
      shieldStrength = 0.87;
      counterfrequency = 0.5 + 180.0;
      useCase = "Protect ancestral memories, block dream intrusion, shield navigation knowledge";
      targetThreats = ["memory extraction", "dream walking attacks", "ancestral knowledge theft"];
      activationPhrase = "CPL.ANTI.MEMORY(mode: SHIELD)";
      deactivationPhrase = "CPL.ANTI.MEMORY(mode: OFF)";
    };
  };

  /// Anti-Japanese-Korean: Detects deception
  public func antiJapaneseKorean() : AntiLanguage {
    {
      id = "anti-japanese-korean";
      sourceLanguageId = "japanese-korean";
      name = "Deception Detector Language";
      antiRole = #AntiVerification;
      invertedFrequency = -768.0;
      invertedPhiAlignment = 1.0 - 0.86;
      invertedFlow = #Outward;
      antiSymbols = ["⚠", "⛌", "✗", "☓", "⊗"];  // Warning, wrong
      defenseType = #Counter;
      shieldStrength = 0.86;
      counterfrequency = 768.0 + 180.0;
      useCase = "Detect lies, expose deception, identify false honor claims";
      targetThreats = ["deception", "false claims", "manipulated data", "fake verification"];
      activationPhrase = "CPL.ANTI.VERIFICATION(mode: DETECT_FALSE)";
      deactivationPhrase = "CPL.ANTI.VERIFICATION(mode: OFF)";
    };
  };

  /// Anti-Persian-Sumerian: Nullifies unjust contracts
  public func antiPersianSumerian() : AntiLanguage {
    {
      id = "anti-persian-sumerian";
      sourceLanguageId = "persian-sumerian";
      name = "Contract Nullifier Language";
      antiRole = #AntiGovernance;
      invertedFrequency = -96.0;
      invertedPhiAlignment = 1.0 - 0.80;
      invertedFlow = #Reversed;
      antiSymbols = ["⊘", "∅", "⦵", "⊝", "⍉"];  // Null, void
      defenseType = #Dissolve;
      shieldStrength = 0.80;
      counterfrequency = 96.0 + 180.0;
      useCase = "Nullify unjust contracts, dissolve binding agreements made under duress";
      targetThreats = ["binding curses", "unjust contracts", "soul contracts", "debt slavery"];
      activationPhrase = "CPL.ANTI.GOVERNANCE(mode: NULLIFY)";
      deactivationPhrase = "CPL.ANTI.GOVERNANCE(mode: OFF)";
    };
  };

  /// Anti-Meta: Protects against meta-attacks
  public func antiMeta() : AntiLanguage {
    {
      id = "anti-meta";
      sourceLanguageId = "quantum-meta";
      name = "Meta-Shield Language";
      antiRole = #AntiMeta;
      invertedFrequency = -432.0;
      invertedPhiAlignment = 0.0;  // Full inversion
      invertedFlow = #Static;
      antiSymbols = ["⊗", "⟁", "⊛", "⍟", "※"];  // Ultimate protection
      defenseType = #Null;
      shieldStrength = 1.0;        // Maximum
      counterfrequency = 0.0;      // Creates void
      useCase = "Protect against attacks on the meta-level, shield consciousness itself";
      targetThreats = ["consciousness attacks", "reality manipulation", "meta-programming attacks"];
      activationPhrase = "CPL.ANTI.META(mode: ABSOLUTE_SHIELD)";
      deactivationPhrase = "CPL.ANTI.META(mode: OFF)";
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ANTI-LANGUAGE COLLECTION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get all anti-languages
  public func getAllAntiLanguages() : [AntiLanguage] {
    [
      antiLatinGreek(),
      antiArabicMandarin(),
      antiSanskritHebrew(),
      antiMayanEgyptian(),
      antiCelticNorse(),
      antiAfrican(),
      antiNativeAmerican(),
      antiPolynesianAboriginal(),
      antiJapaneseKorean(),
      antiPersianSumerian(),
      antiMeta()
    ];
  };

  /// Get anti-language by source
  public func getAntiLanguageFor(sourceId : Text) : ?AntiLanguage {
    for (al in getAllAntiLanguages().vals()) {
      if (al.sourceLanguageId == sourceId) {
        return ?al;
      };
    };
    null;
  };

  /// Get anti-languages by defense type
  public func getAntiLanguagesByDefense(defense : DefenseType) : [AntiLanguage] {
    Array.filter<AntiLanguage>(getAllAntiLanguages(), func(al : AntiLanguage) : Bool {
      defenseTypeEquals(al.defenseType, defense);
    });
  };

  func defenseTypeEquals(a : DefenseType, b : DefenseType) : Bool {
    switch (a, b) {
      case (#Shield, #Shield) true;
      case (#Absorb, #Absorb) true;
      case (#Reflect, #Reflect) true;
      case (#Dissolve, #Dissolve) true;
      case (#Disorient, #Disorient) true;
      case (#Counter, #Counter) true;
      case (#Null, #Null) true;
      case _ false;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ANTI-ORGANISM INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// State of an active anti-language
  public type AntiLanguageState = {
    antiLanguageId : Text;
    isActive : Bool;
    activatedAtNs : Int;
    shieldIntegrity : Float;       // How much shield remains
    threatsBlocked : Nat;
    currentDefenseMode : DefenseType;
  };

  /// Initialize anti-language state
  public func initAntiLanguageState(al : AntiLanguage) : AntiLanguageState {
    {
      antiLanguageId = al.id;
      isActive = false;
      activatedAtNs = 0;
      shieldIntegrity = al.shieldStrength;
      threatsBlocked = 0;
      currentDefenseMode = al.defenseType;
    };
  };

  /// Activate anti-language
  public func activateAntiLanguage(state : AntiLanguageState) : AntiLanguageState {
    { state with isActive = true; activatedAtNs = Time.now() };
  };

  /// Deactivate anti-language
  public func deactivateAntiLanguage(state : AntiLanguageState) : AntiLanguageState {
    { state with isActive = false };
  };

  /// Process a blocked threat
  public func blockThreat(state : AntiLanguageState, threatStrength : Float) : AntiLanguageState {
    let newIntegrity = Float.max(0.0, state.shieldIntegrity - threatStrength);
    { state with shieldIntegrity = newIntegrity; threatsBlocked = state.threatsBlocked + 1 };
  };

  /// Regenerate shield
  public func regenerateShield(state : AntiLanguageState, amount : Float) : AntiLanguageState {
    let maxStrength = switch (getAntiLanguageFor(state.antiLanguageId)) {
      case (?al) al.shieldStrength;
      case null 1.0;
    };
    let newIntegrity = Float.min(maxStrength, state.shieldIntegrity + amount);
    { state with shieldIntegrity = newIntegrity };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // COMBINED ANTI-LANGUAGE SHIELD
  // ═══════════════════════════════════════════════════════════════════════════

  /// Complete anti-language shield (all anti-languages combined)
  public type CombinedAntiShield = {
    antiStates : [AntiLanguageState];
    totalShieldStrength : Float;
    activeCount : Nat;
    totalThreatsBlocked : Nat;
    lastUpdateNs : Int;
  };

  /// Initialize combined shield with all anti-languages
  public func initCombinedShield() : CombinedAntiShield {
    let allAnti = getAllAntiLanguages();
    let states = Array.map<AntiLanguage, AntiLanguageState>(allAnti, initAntiLanguageState);
    
    var totalStrength : Float = 0.0;
    for (al in allAnti.vals()) {
      totalStrength += al.shieldStrength;
    };
    
    {
      antiStates = states;
      totalShieldStrength = totalStrength / Float.fromInt(Array.size(allAnti));
      activeCount = 0;
      totalThreatsBlocked = 0;
      lastUpdateNs = Time.now();
    };
  };

  /// Activate all anti-languages
  public func activateAllShields(shield : CombinedAntiShield) : CombinedAntiShield {
    let newStates = Array.map<AntiLanguageState, AntiLanguageState>(
      shield.antiStates,
      func(s : AntiLanguageState) : AntiLanguageState {
        { s with isActive = true; activatedAtNs = Time.now() };
      }
    );
    {
      shield with
      antiStates = newStates;
      activeCount = Array.size(newStates);
      lastUpdateNs = Time.now();
    };
  };

  /// Deactivate all anti-languages
  public func deactivateAllShields(shield : CombinedAntiShield) : CombinedAntiShield {
    let newStates = Array.map<AntiLanguageState, AntiLanguageState>(
      shield.antiStates,
      func(s : AntiLanguageState) : AntiLanguageState {
        { s with isActive = false };
      }
    );
    {
      shield with
      antiStates = newStates;
      activeCount = 0;
      lastUpdateNs = Time.now();
    };
  };
};
