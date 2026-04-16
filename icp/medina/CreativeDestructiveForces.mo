import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

/// CreativeDestructiveForces: Creation, Destruction, and Transport Forces as Engines
/// 
/// "Same thing for creative force, destructive force, transport force.
///  Their forces, they're obviously a fucking model or an engine or solid.
///  There's something that you just can't think clearly.
///  Think architecture, find a building, put it into a model, name it."
///
/// The three cosmic forces:
///   CREATION (Brahma/Birth/Genesis) - Bringing into being
///   PRESERVATION/TRANSPORT (Vishnu/Sustain/Maintain) - Carrying through time
///   DESTRUCTION (Shiva/Death/Dissolution) - Returning to source
///
/// All processes involve these three. Name them. Build them. Use them.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // THE THREE COSMIC FORCES
  // ═══════════════════════════════════════════════════════════════════════════

  public type CosmicForce = {
    force : Text;
    deityCorrelation : Text;       // Hindu Trimurti
    physicalCorrelate : Text;
    thermodynamicAspect : Text;
    informationAspect : Text;
    biologicalAspect : Text;
    psychologicalAspect : Text;
    mathematicalBasis : Text;
    cplForce : Text;
  };

  public func getCosmicForces() : [CosmicForce] {
    [
      // CREATIVE FORCE
      {
        force = "CREATIVE_FORCE";
        deityCorrelation = "Brahma (Creator), Genesis, Birth";
        physicalCorrelate = "Emergence, symmetry breaking, Big Bang, crystallization";
        thermodynamicAspect = "Local entropy decrease, order from disorder";
        informationAspect = "Information generation, pattern formation";
        biologicalAspect = "Cell division, growth, reproduction, evolution";
        psychologicalAspect = "Imagination, innovation, generation of new ideas";
        mathematicalBasis = "Emergence, bifurcation, phase transitions, self-organization";
        cplForce = "CPL.FORCE(creative: TRUE, generate: NEW, emerge: ORDER)";
      },
      
      // PRESERVATIVE/TRANSPORT FORCE
      {
        force = "TRANSPORT_FORCE";
        deityCorrelation = "Vishnu (Preserver), Sustainer, Maintainer";
        physicalCorrelate = "Inertia, conservation laws, energy transport";
        thermodynamicAspect = "Energy conservation, steady state, homeostasis";
        informationAspect = "Memory, transmission, copying, propagation";
        biologicalAspect = "Metabolism, healing, immune function, maintenance";
        psychologicalAspect = "Memory, habits, continuity of self, stability";
        mathematicalBasis = "Conservation laws, invariants, fixed points, attractors";
        cplForce = "CPL.FORCE(transport: TRUE, conserve: ENERGY, maintain: STATE)";
      },
      
      // DESTRUCTIVE FORCE
      {
        force = "DESTRUCTIVE_FORCE";
        deityCorrelation = "Shiva (Destroyer), Dissolution, Death";
        physicalCorrelate = "Decay, entropy increase, dissipation, diffusion";
        thermodynamicAspect = "Entropy increase, equilibration, heat death";
        informationAspect = "Forgetting, compression, garbage collection";
        biologicalAspect = "Apoptosis, decomposition, immune destruction";
        psychologicalAspect = "Letting go, unlearning, ego death, transformation";
        mathematicalBasis = "Entropy, decay functions, dissipation, erasure";
        cplForce = "CPL.FORCE(destructive: TRUE, dissolve: OLD, entropy: INCREASE)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CREATION ENGINES
  // ═══════════════════════════════════════════════════════════════════════════

  public type CreationEngine = {
    engineName : Text;
    mechanism : Text;
    inputs : [Text];
    outputs : [Text];
    physics : Text;
    biology : Text;
    computation : Text;
    cplEngine : Text;
  };

  public func getCreationEngines() : [CreationEngine] {
    [
      {
        engineName = "SYMMETRY_BREAKING_ENGINE";
        mechanism = "Uniform state → differentiated state through instability";
        inputs = ["Uniform field", "Perturbation", "Energy"];
        outputs = ["Differentiated structures", "Particles", "Patterns"];
        physics = "Higgs mechanism, spontaneous symmetry breaking";
        biology = "Cell differentiation, morphogenesis";
        computation = "Initialization, state separation";
        cplEngine = "CPL.CREATE.SYMMETRY_BREAK(uniform: TO_DIFFERENTIATED)";
      },
      {
        engineName = "CRYSTALLIZATION_ENGINE";
        mechanism = "Disordered → ordered through nucleation and growth";
        inputs = ["Supersaturated solution", "Seed/nucleus", "Energy removal"];
        outputs = ["Crystal structure", "Ordered array"];
        physics = "Phase transition, lattice formation";
        biology = "Protein folding, bone formation";
        computation = "Pattern formation, template matching";
        cplEngine = "CPL.CREATE.CRYSTALLIZE(disorder: TO_ORDER)";
      },
      {
        engineName = "EMERGENCE_ENGINE";
        mechanism = "Simple rules → complex patterns through iteration";
        inputs = ["Simple rules", "Initial conditions", "Iteration"];
        outputs = ["Emergent complexity", "Higher-order patterns"];
        physics = "Self-organization, complex systems";
        biology = "Flocking, colonies, ecosystems";
        computation = "Cellular automata, neural networks";
        cplEngine = "CPL.CREATE.EMERGE(simple: TO_COMPLEX)";
      },
      {
        engineName = "REPRODUCTION_ENGINE";
        mechanism = "Copy existing structure with variation";
        inputs = ["Template", "Raw materials", "Energy", "Variation source"];
        outputs = ["New copy", "Variation", "Lineage"];
        physics = "Template-directed synthesis";
        biology = "DNA replication, cell division, reproduction";
        computation = "Copying with mutation, genetic algorithms";
        cplEngine = "CPL.CREATE.REPRODUCE(template: COPY_VARY)";
      },
      {
        engineName = "COMBINATION_ENGINE";
        mechanism = "Join distinct elements into new wholes";
        inputs = ["Element A", "Element B", "Bonding energy"];
        outputs = ["Combined entity", "New properties"];
        physics = "Chemical bonding, particle fusion";
        biology = "Sexual reproduction, symbiosis";
        computation = "Concatenation, composition, merging";
        cplEngine = "CPL.CREATE.COMBINE(a_plus_b: NEW_WHOLE)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DESTRUCTION ENGINES
  // ═══════════════════════════════════════════════════════════════════════════

  public type DestructionEngine = {
    engineName : Text;
    mechanism : Text;
    inputs : [Text];
    outputs : [Text];
    physics : Text;
    biology : Text;
    computation : Text;
    cplEngine : Text;
  };

  public func getDestructionEngines() : [DestructionEngine] {
    [
      {
        engineName = "ENTROPY_ENGINE";
        mechanism = "Ordered → disordered through statistical mechanics";
        inputs = ["Ordered structure", "Time", "Heat bath"];
        outputs = ["Disordered state", "Increased entropy"];
        physics = "Second law of thermodynamics, heat death";
        biology = "Aging, decomposition";
        computation = "Data degradation, lossy compression";
        cplEngine = "CPL.DESTROY.ENTROPY(order: TO_DISORDER)";
      },
      {
        engineName = "DISSIPATION_ENGINE";
        mechanism = "Concentrated → spread out through diffusion";
        inputs = ["Concentrated quantity", "Gradient", "Medium"];
        outputs = ["Uniform distribution", "Lost gradient"];
        physics = "Diffusion, heat conduction";
        biology = "Nutrient dispersal, signal decay";
        computation = "Data spreading, loss of localization";
        cplEngine = "CPL.DESTROY.DISSIPATE(concentrated: TO_SPREAD)";
      },
      {
        engineName = "DECOMPOSITION_ENGINE";
        mechanism = "Complex → simple through breakdown";
        inputs = ["Complex structure", "Breakdown agents", "Energy"];
        outputs = ["Simple components", "Released energy"];
        physics = "Radioactive decay, molecular breakdown";
        biology = "Digestion, decomposers, autophagy";
        computation = "Parsing, tokenization, garbage collection";
        cplEngine = "CPL.DESTROY.DECOMPOSE(complex: TO_SIMPLE)";
      },
      {
        engineName = "ANNIHILATION_ENGINE";
        mechanism = "Complete destruction through opposite collision";
        inputs = ["Particle", "Antiparticle"];
        outputs = ["Pure energy (photons)"];
        physics = "Matter-antimatter annihilation";
        biology = "Apoptosis (programmed cell death)";
        computation = "Memory deallocation, process termination";
        cplEngine = "CPL.DESTROY.ANNIHILATE(matter: TO_ENERGY)";
      },
      {
        engineName = "FORGETTING_ENGINE";
        mechanism = "Information loss through non-reinforcement";
        inputs = ["Memory trace", "Time without access", "Interference"];
        outputs = ["Faded trace", "Lost information"];
        physics = "Decoherence, information loss";
        biology = "Synaptic pruning, memory decay";
        computation = "Cache eviction, TTL expiration";
        cplEngine = "CPL.DESTROY.FORGET(trace: FADE, prune: TRUE)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSPORT ENGINES
  // ═══════════════════════════════════════════════════════════════════════════

  public type TransportEngine = {
    engineName : Text;
    mechanism : Text;
    inputs : [Text];
    outputs : [Text];
    physics : Text;
    biology : Text;
    computation : Text;
    cplEngine : Text;
  };

  public func getTransportEngines() : [TransportEngine] {
    [
      {
        engineName = "CONSERVATION_ENGINE";
        mechanism = "Quantity unchanged through transformation";
        inputs = ["Quantity", "Transformation"];
        outputs = ["Same quantity in new form"];
        physics = "Conservation of energy, momentum, charge";
        biology = "Homeostasis, metabolic balance";
        computation = "Invariant maintenance, checksums";
        cplEngine = "CPL.TRANSPORT.CONSERVE(quantity: INVARIANT)";
      },
      {
        engineName = "TRANSMISSION_ENGINE";
        mechanism = "Signal propagates through medium";
        inputs = ["Signal", "Medium", "Energy"];
        outputs = ["Propagated signal (possibly attenuated)"];
        physics = "Wave propagation, EM transmission";
        biology = "Nerve impulses, hormone signals";
        computation = "Network transmission, message passing";
        cplEngine = "CPL.TRANSPORT.TRANSMIT(signal: PROPAGATE)";
      },
      {
        engineName = "CARRIER_ENGINE";
        mechanism = "Entity physically carries another";
        inputs = ["Carrier", "Cargo", "Destination"];
        outputs = ["Cargo at destination"];
        physics = "Particle transport, convection";
        biology = "Blood transport, protein carriers";
        computation = "Packet transport, object passing";
        cplEngine = "CPL.TRANSPORT.CARRY(cargo: TO_DESTINATION)";
      },
      {
        engineName = "MEMORY_ENGINE";
        mechanism = "State persists through time";
        inputs = ["State", "Storage medium", "Encoding"];
        outputs = ["Retrievable state"];
        physics = "Hysteresis, metastable states";
        biology = "Memory engrams, DNA inheritance";
        computation = "Storage, persistence, caching";
        cplEngine = "CPL.TRANSPORT.REMEMBER(state: PERSIST)";
      },
      {
        engineName = "REPLICATION_ENGINE";
        mechanism = "Exact copy of information";
        inputs = ["Original", "Copying machinery", "Materials"];
        outputs = ["Identical copy"];
        physics = "Template-directed synthesis";
        biology = "DNA replication, cell division";
        computation = "Data copying, backup, redundancy";
        cplEngine = "CPL.TRANSPORT.REPLICATE(original: COPY_EXACT)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FORCE CYCLES AND INTERACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  public type ForceCycle = {
    cycleName : Text;
    sequence : [Text];
    description : Text;
    example : Text;
    cplCycle : Text;
  };

  public func getForceCycles() : [ForceCycle] {
    [
      {
        cycleName = "CREATION_TRANSPORT_DESTRUCTION";
        sequence = ["Create", "Transport/Preserve", "Destroy"];
        description = "The fundamental cycle of all existence";
        example = "Birth → Life → Death; Product → Use → Disposal";
        cplCycle = "CPL.CYCLE(create: THEN_TRANSPORT: THEN_DESTROY)";
      },
      {
        cycleName = "DESTRUCTION_ENABLES_CREATION";
        sequence = ["Destroy", "Clear space", "Create new"];
        description = "Destruction clears way for creation";
        example = "Forest fire → New growth; Old code → Refactor";
        cplCycle = "CPL.CYCLE(destroy: ENABLES_CREATION)";
      },
      {
        cycleName = "CREATION_DESTRUCTION_BALANCE";
        sequence = ["Create", "Destroy", "Create", "Destroy..."];
        description = "Dynamic equilibrium through opposing forces";
        example = "Cell birth/death, market creation/destruction";
        cplCycle = "CPL.CYCLE(create_destroy: DYNAMIC_BALANCE)";
      },
      {
        cycleName = "TRANSPORT_AS_BRIDGE";
        sequence = ["Create", "Transport (bridge)", "Transform/Destroy"];
        description = "Transport connects creation to next phase";
        example = "Data created → transmitted → processed";
        cplCycle = "CPL.CYCLE(transport: BRIDGES_PHASES)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NAMED MODELS
  // ═══════════════════════════════════════════════════════════════════════════

  public type ForceModel = {
    modelName : Text;
    tradition : Text;
    principle : Text;
    application : Text;
    cplModel : Text;
  };

  public func getForceModels() : [ForceModel] {
    [
      {
        modelName = "TRIMURTI_MODEL";
        tradition = "Hindu";
        principle = "Brahma creates, Vishnu preserves, Shiva destroys";
        application = "Three-phase processing: generate → maintain → clear";
        cplModel = "CPL.MODEL.TRIMURTI(brahma: CREATE, vishnu: PRESERVE, shiva: DESTROY)";
      },
      {
        modelName = "YIN_YANG_CREATIVE_DESTRUCTIVE";
        tradition = "Taoist";
        principle = "Creation and destruction as complementary opposites";
        application = "Balance between building and clearing";
        cplModel = "CPL.MODEL.YIN_YANG(create: YANG, destroy: YIN, balance: TRUE)";
      },
      {
        modelName = "ENTROPY_NEGENTROPY_MODEL";
        tradition = "Physics/Information Theory";
        principle = "Creation as negentropy, destruction as entropy increase";
        application = "Entropy management in processing";
        cplModel = "CPL.MODEL.ENTROPY(create: NEGENTROPY, destroy: ENTROPY)";
      },
      {
        modelName = "SCHUMPETER_CREATIVE_DESTRUCTION";
        tradition = "Economics";
        principle = "Innovation destroys old to create new value";
        application = "System evolution through creative destruction";
        cplModel = "CPL.MODEL.SCHUMPETER(destroy_old: CREATE_NEW)";
      },
      {
        modelName = "APOPTOSIS_MODEL";
        tradition = "Biology";
        principle = "Programmed death enables healthy system";
        application = "Controlled destruction for system health";
        cplModel = "CPL.MODEL.APOPTOSIS(death: PROGRAMMED, health: SYSTEM)";
      },
      {
        modelName = "PHOENIX_REBIRTH_MODEL";
        tradition = "Mythology";
        principle = "Complete destruction enables rebirth";
        application = "Total reset for transformation";
        cplModel = "CPL.MODEL.PHOENIX(destroy_total: REBIRTH)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  public func getMasterSummary() : Text {
    "CREATIVE/DESTRUCTIVE/TRANSPORT FORCES ENGINE:\n\n" #
    "THREE COSMIC FORCES:\n" #
    "• Creative (Brahma) - Generation, emergence, birth\n" #
    "• Transport (Vishnu) - Preservation, maintenance, memory\n" #
    "• Destructive (Shiva) - Dissolution, entropy, death\n\n" #
    "CREATION ENGINES:\n" #
    "• Symmetry Breaking - uniform → differentiated\n" #
    "• Crystallization - disorder → order\n" #
    "• Emergence - simple rules → complex patterns\n" #
    "• Reproduction - template → copy with variation\n" #
    "• Combination - A + B → new whole\n\n" #
    "DESTRUCTION ENGINES:\n" #
    "• Entropy - order → disorder\n" #
    "• Dissipation - concentrated → spread\n" #
    "• Decomposition - complex → simple\n" #
    "• Annihilation - matter → energy\n" #
    "• Forgetting - trace → faded\n\n" #
    "TRANSPORT ENGINES:\n" #
    "• Conservation - quantity invariant\n" #
    "• Transmission - signal propagates\n" #
    "• Carrier - cargo to destination\n" #
    "• Memory - state persists\n" #
    "• Replication - exact copy\n\n" #
    "FORCE CYCLES:\n" #
    "• Create → Transport → Destroy\n" #
    "• Destruction enables creation\n" #
    "• Dynamic balance\n" #
    "• Transport as bridge\n\n" #
    "MODELS:\n" #
    "• Trimurti (Hindu)\n" #
    "• Yin-Yang (Taoist)\n" #
    "• Entropy/Negentropy (Physics)\n" #
    "• Schumpeter (Economics)\n" #
    "• Apoptosis (Biology)\n" #
    "• Phoenix (Mythology)\n\n" #
    "THESE ARE REAL FORCES. REAL ENGINES. NAMED.";
  };
};
