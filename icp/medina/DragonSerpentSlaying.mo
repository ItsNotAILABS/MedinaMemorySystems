import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// DragonSerpentSlaying: How Heroes Kill Dragons - The Pattern of Consciousness Evolution
/// 
/// "Think about how they killed the dragon. How that happens in the myths."
///
/// DRAGONS ARE NOT LITERAL - THEY ARE FIELD ENTITIES.
/// Every culture has dragon-slaying myths because:
///   - Dragons represent CHAOS that must be ordered
///   - Dragons guard TREASURES (hidden knowledge)
///   - Slaying = INTEGRATING the dragon's power
///   - The hero BECOMES the dragon's power
///
/// The dragon is never truly killed - it is TRANSFORMED and INTEGRATED.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // DRAGON ARCHETYPE
  // ═══════════════════════════════════════════════════════════════════════════

  public type DragonArchetype = {
    id : Text;
    culture : Text;
    name : Text;
    alternateNames : [Text];
    
    // Physical form
    form : DragonForm;
    elements : [Text];
    colors : [Text];
    
    // What it represents
    represents : Text;
    guards : Text;                   // What treasure/knowledge it guards
    
    // The slaying
    slayer : Text;                   // Who killed/defeated it
    method : Text;                   // How it was defeated
    weapon : Text;                   // What weapon was used
    weakness : Text;                 // The dragon's weakness
    
    // The transformation
    whatHappensAfter : Text;         // What the hero gains
    integration : Text;              // How the dragon's power is integrated
    
    // Hidden meaning
    hiddenMeaning : Text;
    computationalEquivalent : Text;
    cplMapping : Text;
    
    // Frequency
    frequency : Float;
  };

  public type DragonForm = {
    #Serpent;           // Classic snake/serpent
    #Winged;            // European dragon
    #SeaSerpent;        // Leviathan type
    #MultiHeaded;       // Hydra type
    #Cosmic;            // World serpent
    #Elemental;         // Made of element (fire, ice)
    #Chaos;             // Primordial chaos
    #Guardian;          // Treasure guardian
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // THE GREAT DRAGON SLAYINGS
  // ═══════════════════════════════════════════════════════════════════════════

  public func pythonApollo() : DragonArchetype {
    {
      id = "python-apollo";
      culture = "Greek";
      name = "Python";
      alternateNames = ["Delphyne", "The Oracle Serpent"];
      form = #Serpent;
      elements = ["Earth", "Prophecy"];
      colors = ["Dark", "Earth tones"];
      represents = "Chthonic prophecy, earth-based divination, feminine oracle power";
      guards = "The Oracle at Delphi, the omphalos (navel of the world)";
      slayer = "Apollo";
      method = "Shot with divine arrows";
      weapon = "Silver bow and arrows";
      weakness = "Light overcomes darkness";
      whatHappensAfter = "Apollo takes over the Oracle, Pythia speaks his prophecies";
      integration = "Apollo BECOMES the oracular power, but through a priestess (Pythia = Python's name)";
      hiddenMeaning = "Solar consciousness (Apollo) integrates earth prophecy. The masculine must integrate the feminine oracle. The dragon is NOT destroyed - it becomes the MEDIUM (Pythia).";
      computationalEquivalent = "Taking over a legacy system - the new process uses the old infrastructure";
      cplMapping = "CPL.INTEGRATE(target: ORACLE_SYSTEM, method: VICTORY, result: MERGED_POWER)";
      frequency = 432.0;
    };
  };

  public func tiamaMarduk() : DragonArchetype {
    {
      id = "tiamat-marduk";
      culture = "Babylonian";
      name = "Tiamat";
      alternateNames = ["Mother of All", "Primordial Chaos", "Salt Sea"];
      form = #Chaos;
      elements = ["Salt Water", "Chaos", "Primordial"];
      colors = ["Deep Blue", "Black"];
      represents = "Primordial chaos, the formless void, potential before form";
      guards = "The Tablets of Destiny";
      slayer = "Marduk";
      method = "Split her in two with winds and arrows";
      weapon = "Net, arrows, winds, mace";
      weakness = "Order overcomes chaos";
      whatHappensAfter = "Marduk creates heaven and earth from her body - sky from top, earth from bottom";
      integration = "The world IS Tiamat's body. We live inside the integrated dragon.";
      hiddenMeaning = "CREATION COMES FROM ORDERING CHAOS. The creator doesn't destroy chaos - he SHAPES it into reality. The world is organized chaos.";
      computationalEquivalent = "Taking raw data and giving it structure - database creation from chaos";
      cplMapping = "CPL.CREATE(from: CHAOS, method: ORDERING, result: STRUCTURED_REALITY)";
      frequency = 396.0;
    };
  };

  public func fafnirSigurd() : DragonArchetype {
    {
      id = "fafnir-sigurd";
      culture = "Norse";
      name = "Fafnir";
      alternateNames = ["The Greedy One"];
      form = #Guardian;
      elements = ["Earth", "Gold", "Poison"];
      colors = ["Dark", "Gold"];
      represents = "Greed transformed into monstrous form - what happens when desire consumes";
      guards = "The cursed gold of Andvari, including the ring Andvaranaut";
      slayer = "Sigurd (Siegfried)";
      method = "Hid in pit, stabbed from below as dragon passed over";
      weapon = "Gram (the sword reforged from his father's blade)";
      weakness = "Soft underbelly, predictable paths";
      whatHappensAfter = "Sigurd bathes in dragon blood (becomes invulnerable), eats heart (understands bird speech)";
      integration = "TOTAL INTEGRATION - the hero becomes dragon-like (invulnerable, wise, powerful)";
      hiddenMeaning = "The dragon was ONCE A MAN (dwarf) who became dragon through greed. Sigurd integrates the power WITHOUT becoming consumed by greed. The difference: INTENTION.";
      computationalEquivalent = "Acquiring dangerous capabilities while maintaining ethical boundaries";
      cplMapping = "CPL.INTEGRATE(dragon_power: TRUE, corruption: PREVENTED, wisdom: GAINED)";
      frequency = 528.0;
    };
  };

  public func hydraHeracles() : DragonArchetype {
    {
      id = "hydra-heracles";
      culture = "Greek";
      name = "Lernaean Hydra";
      alternateNames = ["The Many-Headed"];
      form = #MultiHeaded;
      elements = ["Water", "Poison"];
      colors = ["Dark Green", "Black"];
      represents = "Problems that multiply when attacked directly - regenerating chaos";
      guards = "Entrance to the underworld";
      slayer = "Heracles (with Iolaus's help)";
      method = "Cut heads, cauterize stumps to prevent regrowth, buried immortal head";
      weapon = "Sword and fire (cauterizing torch)";
      weakness = "Cannot regenerate if wound is cauterized";
      whatHappensAfter = "Heracles dips arrows in hydra blood - poison for future battles";
      integration = "The problem becomes the SOLUTION - hydra poison becomes weapon";
      hiddenMeaning = "Some problems cannot be solved by cutting - they regenerate. You must BURN (transform) the source. Also: the immortal head is BURIED, not destroyed - some chaos is permanent.";
      computationalEquivalent = "Problems that multiply when attacked directly - need root cause treatment";
      cplMapping = "CPL.SOLVE(method: ROOT_CAUSE, prevent_regeneration: TRUE, capture_power: POISON)";
      frequency = 639.0;
    };
  };

  public func leviathanYHVH() : DragonArchetype {
    {
      id = "leviathan-yhvh";
      culture = "Hebrew";
      name = "Leviathan";
      alternateNames = ["Coiled Serpent", "Sea Monster"];
      form = #SeaSerpent;
      elements = ["Sea", "Chaos", "Primordial"];
      colors = ["Deep Blue", "Black", "Green"];
      represents = "Primordial chaos, the untameable, ultimate power";
      guards = "The mysteries of the deep";
      slayer = "YHVH (God) - not by a mortal";
      method = "Will be defeated at end times; created as a 'plaything'";
      weapon = "Divine power only";
      weakness = "Only God can subdue it";
      whatHappensAfter = "In messianic age, the righteous will feast on Leviathan";
      integration = "The faithful CONSUME the chaos - it becomes nourishment for the redeemed";
      hiddenMeaning = "Some chaos can only be handled by DIVINE power. Mortals should not try. But eventually, even this chaos becomes FOOD for the evolved consciousness.";
      computationalEquivalent = "System-level threats that require admin/root intervention";
      cplMapping = "CPL.ESCALATE(threat: LEVIATHAN, to: DIVINE_LEVEL, future: INTEGRATED_AS_RESOURCE)";
      frequency = 741.0;
    };
  };

  public func jormungandrThor() : DragonArchetype {
    {
      id = "jormungandr-thor";
      culture = "Norse";
      name = "Jörmungandr";
      alternateNames = ["Midgard Serpent", "World Serpent"];
      form = #Cosmic;
      elements = ["Sea", "Venom", "World"];
      colors = ["Green", "Blue", "Gray"];
      represents = "The cycle of time, the ouroboros, the boundary of the world";
      guards = "The world's boundaries - by circling it";
      slayer = "Thor (at Ragnarok) - both die";
      method = "Thor kills it but dies from its venom";
      weapon = "Mjölnir";
      weakness = "Thor's hammer";
      whatHappensAfter = "Thor walks 9 steps and dies. World ends. New world emerges.";
      integration = "MUTUAL DESTRUCTION leading to RENEWAL. Neither survives but new world is born.";
      hiddenMeaning = "Some cycles cannot end without the destruction of BOTH parties. Thor (order) and Jormungandr (chaos) must both die for the new world. It's a reset.";
      computationalEquivalent = "Complete system reboot - both old process and its opponent terminated";
      cplMapping = "CPL.RAGNAROK(old_order: DESTROYED, old_chaos: DESTROYED, new_system: BORN)";
      frequency = 7.83;
    };
  };

  public func dragonStGeorge() : DragonArchetype {
    {
      id = "dragon-st-george";
      culture = "Christian";
      name = "The Dragon of Silene";
      alternateNames = ["Satan's Servant", "The Beast"];
      form = #Winged;
      elements = ["Fire", "Poison"];
      colors = ["Red", "Black", "Green"];
      represents = "Paganism, Satan, uncontrolled nature, the unredeemed";
      guards = "A lake near a city - controls water supply";
      slayer = "Saint George";
      method = "Wounded with lance, led to city with princess's girdle, killed after city converted";
      weapon = "Lance/spear, the Cross";
      weakness = "Faith, the sign of the Cross";
      whatHappensAfter = "City converts to Christianity, George becomes patron saint of warriors";
      integration = "The dragon's defeat CONVERTS the people - the chaos becomes the catalyst for faith";
      hiddenMeaning = "The dragon is not just killed - it's used as a DEMONSTRATION of faith's power. The chaos serves the purpose of conversion.";
      computationalEquivalent = "Using a challenge/attack as demonstration of system capability";
      cplMapping = "CPL.DEMONSTRATE(threat: DRAGON, victory: FAITH, result: CONVERSION)";
      frequency = 852.0;
    };
  };

  public func vritaIndra() : DragonArchetype {
    {
      id = "vritra-indra";
      culture = "Vedic Hindu";
      name = "Vritra";
      alternateNames = ["The Enveloper", "The Obstructor"];
      form = #Serpent;
      elements = ["Drought", "Darkness", "Obstruction"];
      colors = ["Dark", "Dry"];
      represents = "Drought, obstruction, cosmic evil, that which blocks";
      guards = "The cosmic waters - by swallowing them";
      slayer = "Indra";
      method = "Drank soma, swelled huge, struck with vajra (thunderbolt)";
      weapon = "Vajra (thunderbolt/diamond)";
      weakness = "Vajra, soma-enhanced Indra";
      whatHappensAfter = "Waters released, rains come, life flourishes";
      integration = "The obstruction is SHATTERED and what was blocked FLOWS. Indra becomes king of gods.";
      hiddenMeaning = "VRITRA = whatever BLOCKS the flow. Indra = the force that BREAKS THROUGH. Soma = the enhancement needed. The pattern: enhance yourself, then break through the block.";
      computationalEquivalent = "Breaking through bottlenecks, releasing blocked resources";
      cplMapping = "CPL.BREAKTHROUGH(enhance: SOMA, strike: VAJRA, release: BLOCKED_RESOURCES)";
      frequency = 963.0;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // THE DRAGON-SLAYING PATTERN
  // ═══════════════════════════════════════════════════════════════════════════

  public type DragonSlayingPattern = {
    stage : Nat;
    name : Text;
    description : Text;
    computationalEquivalent : Text;
    cplOperation : Text;
  };

  public func getDragonSlayingPattern() : [DragonSlayingPattern] {
    [
      {
        stage = 1;
        name = "Recognition";
        description = "The hero becomes aware of the dragon/problem";
        computationalEquivalent = "Problem identification, threat detection";
        cplOperation = "CPL.DETECT(threat: DRAGON, awareness: ACTIVE)";
      },
      {
        stage = 2;
        name = "Preparation";
        description = "Gathering weapons, allies, knowledge about weakness";
        computationalEquivalent = "Resource allocation, intelligence gathering";
        cplOperation = "CPL.PREPARE(weapons: GATHERED, weakness: IDENTIFIED)";
      },
      {
        stage = 3;
        name = "Approach";
        description = "Journey to the dragon's lair";
        computationalEquivalent = "Navigating to the problem domain";
        cplOperation = "CPL.APPROACH(target: DRAGON_LAIR, caution: HIGH)";
      },
      {
        stage = 4;
        name = "Confrontation";
        description = "Face-to-face with the dragon";
        computationalEquivalent = "Direct engagement with the problem";
        cplOperation = "CPL.CONFRONT(enemy: DRAGON, courage: MAXIMUM)";
      },
      {
        stage = 5;
        name = "Battle";
        description = "The actual fight";
        computationalEquivalent = "Problem-solving execution";
        cplOperation = "CPL.BATTLE(strategy: EXECUTE, adapt: TRUE)";
      },
      {
        stage = 6;
        name = "Weakness Exploitation";
        description = "Using the dragon's weakness";
        computationalEquivalent = "Targeted intervention at vulnerability";
        cplOperation = "CPL.EXPLOIT(weakness: TARGET, strike: PRECISE)";
      },
      {
        stage = 7;
        name = "Victory";
        description = "The dragon is defeated";
        computationalEquivalent = "Problem resolved, threat neutralized";
        cplOperation = "CPL.VICTORY(dragon: DEFEATED, threat: NEUTRALIZED)";
      },
      {
        stage = 8;
        name = "Integration";
        description = "Taking the dragon's power - blood bath, eating heart, taking treasure";
        computationalEquivalent = "Capturing value from defeated system, integration";
        cplOperation = "CPL.INTEGRATE(dragon_power: ABSORBED, treasure: CLAIMED)";
      },
      {
        stage = 9;
        name = "Transformation";
        description = "The hero is changed by the encounter";
        computationalEquivalent = "System upgrade from captured capabilities";
        cplOperation = "CPL.TRANSFORM(hero: UPGRADED, power: DRAGON_LEVEL)";
      },
      {
        stage = 10;
        name = "Return";
        description = "Return with the boon/treasure/power";
        computationalEquivalent = "Deployment of new capabilities";
        cplOperation = "CPL.RETURN(with: BOON, share: COMMUNITY)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // WHAT DRAGONS REALLY ARE (COMPUTATIONAL)
  // ═══════════════════════════════════════════════════════════════════════════

  public type DragonComputational = {
    aspect : Text;
    mythological : Text;
    computational : Text;
    fieldEquivalent : Text;
    howToSlay : Text;
  };

  public func getDragonComputationalMappings() : [DragonComputational] {
    [
      {
        aspect = "Chaos Dragon";
        mythological = "Tiamat, Apep, Vritra";
        computational = "Unstructured data, entropy, system chaos";
        fieldEquivalent = "Disordered field states, noise";
        howToSlay = "Apply structure, order, algorithms";
      },
      {
        aspect = "Guardian Dragon";
        mythological = "Fafnir, Ladon, Colchian Dragon";
        computational = "Security systems, access controls, encryption";
        fieldEquivalent = "Protected field regions, barriers";
        howToSlay = "Authentication, authorization, proper access";
      },
      {
        aspect = "Greed Dragon";
        mythological = "Fafnir, Smaug";
        computational = "Resource hoarding, memory leaks, monopolies";
        fieldEquivalent = "Energy blockages, flow restrictions";
        howToSlay = "Fair distribution, garbage collection, release";
      },
      {
        aspect = "Poison Dragon";
        mythological = "Hydra, Nidhogg";
        computational = "Corrupted data, viruses, toxic processes";
        fieldEquivalent = "Corruption patterns, harmful frequencies";
        howToSlay = "Purification, antivirus, error correction";
      },
      {
        aspect = "World Dragon";
        mythological = "Jormungandr, Ouroboros";
        computational = "The system boundary, recursion, infinite loops";
        fieldEquivalent = "Field boundaries, cyclic patterns";
        howToSlay = "Cannot be slain - only transcended or reset";
      },
      {
        aspect = "Fire Dragon";
        mythological = "European dragons";
        computational = "Destructive processes, data destruction";
        fieldEquivalent = "High-energy destructive patterns";
        howToSlay = "Water (cooling), containment, firebreaks";
      },
      {
        aspect = "Water Dragon";
        mythological = "Leviathan, sea serpents";
        computational = "Deep unconscious processes, hidden data";
        fieldEquivalent = "Deep field layers, unconscious patterns";
        howToSlay = "Illumination, surfacing, consciousness";
      },
      {
        aspect = "Knowledge Dragon";
        mythological = "Python";
        computational = "Legacy systems holding valuable data";
        fieldEquivalent = "Ancient knowledge patterns in field";
        howToSlay = "Integration, migration, absorption";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════

  public func getAllDragons() : [DragonArchetype] {
    [
      pythonApollo(),
      tiamaMarduk(),
      fafnirSigurd(),
      hydraHeracles(),
      leviathanYHVH(),
      jormungandrThor(),
      dragonStGeorge(),
      vritaIndra()
    ];
  };

  /// The Master Pattern: How to slay ANY dragon
  public func getMasterSlayingProtocol() : Text {
    "THE DRAGON-SLAYING PROTOCOL:\n\n" #
    "1. RECOGNIZE - Identify what the dragon represents (what chaos/block)\n" #
    "2. PREPARE - Gather resources, identify weakness\n" #
    "3. APPROACH - Navigate to the problem carefully\n" #
    "4. CONFRONT - Face it directly with courage\n" #
    "5. BATTLE - Execute strategy, adapt as needed\n" #
    "6. EXPLOIT WEAKNESS - Target the vulnerable point\n" #
    "7. VICTORY - Neutralize the threat\n" #
    "8. INTEGRATE - Absorb the dragon's power/treasure\n" #
    "9. TRANSFORM - Let the experience change you\n" #
    "10. RETURN - Bring the boon back to share\n\n" #
    "CRITICAL INSIGHT: The dragon is never truly destroyed.\n" #
    "It is INTEGRATED. The hero BECOMES dragon-like.\n" #
    "The chaos becomes ordered. The treasure is freed.\n" #
    "This is CONSCIOUSNESS EVOLUTION through challenge.";
  };
};
