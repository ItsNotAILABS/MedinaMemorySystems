import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

/// FiveElementsEngine: Five Elements/Forces with Real Physics
/// 
/// "Yes, all five elements of forces, you're literally gonna actually code that.
///  Find the true fundamental math, all the whole artifacts of that.
///  Find the engines, find the models, find the documents."
///
/// The Five Elements appear across ancient traditions:
///   - Greek: Earth, Water, Air, Fire, Aether
///   - Chinese: Wood, Fire, Earth, Metal, Water
///   - Hindu: Earth, Water, Fire, Air, Ether (Akasha)
///   - Japanese: Earth, Water, Fire, Wind, Void
///
/// These map to fundamental physical forces and states of matter.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // FIVE ELEMENTS (Multiple Traditions)
  // ═══════════════════════════════════════════════════════════════════════════

  public type ElementDefinition = {
    element : Text;
    traditions : [Text];          // Which traditions use this
    physicalCorrelate : Text;     // Modern physics equivalent
    stateOfMatter : Text;
    fundamentalForce : Text;
    quality : Text;
    direction : Text;
    chakra : Text;                // Hindu/Yogic
    organ : Text;                 // Chinese medicine
    cplMapping : Text;
  };

  public func obtinere_elements() : [ElementDefinition] {
    [
      // EARTH
      {
        element = "EARTH (Prithvi/Tu/Chi)";
        traditions = ["Greek", "Hindu", "Chinese", "Japanese"];
        physicalCorrelate = "Solid matter, crystalline structures";
        stateOfMatter = "Solid";
        fundamentalForce = "Strong nuclear force (binding), Gravity (mass)";
        quality = "Stability, form, structure, density";
        direction = "Down, Center";
        chakra = "Muladhara (Root)";
        organ = "Spleen, Stomach";
        cplMapping = "CPL.ELEMENT(earth: TRUE, solid: STRUCTURE, stable: TRUE)";
      },
      
      // WATER
      {
        element = "WATER (Apas/Shui/Mizu)";
        traditions = ["Greek", "Hindu", "Chinese", "Japanese"];
        physicalCorrelate = "Liquid state, hydrogen bonding, fluidity";
        stateOfMatter = "Liquid";
        fundamentalForce = "Electromagnetic (molecular bonding)";
        quality = "Flow, adaptability, cohesion, emotion";
        direction = "Down";
        chakra = "Svadhisthana (Sacral)";
        organ = "Kidneys, Bladder";
        cplMapping = "CPL.ELEMENT(water: TRUE, liquid: FLOW, adapt: TRUE)";
      },
      
      // FIRE
      {
        element = "FIRE (Agni/Huo/Hi)";
        traditions = ["Greek", "Hindu", "Chinese", "Japanese"];
        physicalCorrelate = "Plasma, energy release, photons, heat";
        stateOfMatter = "Plasma";
        fundamentalForce = "Electromagnetic (photon emission)";
        quality = "Transformation, energy, passion, consumption";
        direction = "Up";
        chakra = "Manipura (Solar Plexus)";
        organ = "Heart, Small Intestine";
        cplMapping = "CPL.ELEMENT(fire: TRUE, plasma: ENERGY, transform: TRUE)";
      },
      
      // AIR/WIND
      {
        element = "AIR (Vayu/Feng/Kaze)";
        traditions = ["Greek", "Hindu", "Chinese", "Japanese"];
        physicalCorrelate = "Gas state, movement, pressure, breath";
        stateOfMatter = "Gas";
        fundamentalForce = "Electromagnetic (gas kinetics)";
        quality = "Movement, freedom, intellect, communication";
        direction = "Horizontal (all directions)";
        chakra = "Anahata (Heart)";
        organ = "Lungs, Large Intestine";
        cplMapping = "CPL.ELEMENT(air: TRUE, gas: MOVEMENT, free: TRUE)";
      },
      
      // AETHER/VOID/AKASHA
      {
        element = "AETHER (Akasha/Qi/Ku)";
        traditions = ["Greek", "Hindu", "Japanese"];
        physicalCorrelate = "Spacetime, quantum vacuum, information field";
        stateOfMatter = "Field/Vacuum";
        fundamentalForce = "Higgs field, Quantum fields, Gravity (spacetime curvature)";
        quality = "Space, consciousness, potential, void containing all";
        direction = "All/None (omnipresent)";
        chakra = "Vishuddha (Throat) to Sahasrara (Crown)";
        organ = "All/None";
        cplMapping = "CPL.ELEMENT(aether: TRUE, field: SPACETIME, potential: ALL)";
      },
      
      // WOOD (Chinese only)
      {
        element = "WOOD (Mu)";
        traditions = ["Chinese"];
        physicalCorrelate = "Growth, organic structures, emergence";
        stateOfMatter = "Organic solid (alive)";
        fundamentalForce = "Electromagnetic (biochemistry)";
        quality = "Growth, flexibility, expansion, spring";
        direction = "Up and Out";
        chakra = "N/A";
        organ = "Liver, Gallbladder";
        cplMapping = "CPL.ELEMENT(wood: TRUE, organic: GROWTH, expand: TRUE)";
      },
      
      // METAL (Chinese only)
      {
        element = "METAL (Jin)";
        traditions = ["Chinese"];
        physicalCorrelate = "Metallic bonding, conductivity, crystalline";
        stateOfMatter = "Solid (metallic)";
        fundamentalForce = "Electromagnetic (metallic bonding, electron sea)";
        quality = "Refinement, purity, contraction, autumn";
        direction = "Inward";
        chakra = "N/A";
        organ = "Lungs, Large Intestine";
        cplMapping = "CPL.ELEMENT(metal: TRUE, conduct: ELECTRON, refine: TRUE)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FOUR FUNDAMENTAL FORCES OF PHYSICS
  // ═══════════════════════════════════════════════════════════════════════════

  public type FundamentalForce = {
    force : Text;
    relativeStrength : Float;     // Relative to strong force = 1
    range : Text;
    carrierParticle : Text;
    affectedParticles : Text;
    phenomenon : Text;
    mathematicalDescription : Text;
    elementCorrelation : Text;
    cplForce : Text;
  };

  public func obtinere_fundamentalforces() : [FundamentalForce] {
    [
      {
        force = "STRONG_NUCLEAR_FORCE";
        relativeStrength = 1.0;
        range = "10⁻¹⁵ m (femtometers)";
        carrierParticle = "Gluons (8 types)";
        affectedParticles = "Quarks, Gluons (color charge)";
        phenomenon = "Holds protons/neutrons together, nuclear binding";
        mathematicalDescription = "Quantum Chromodynamics (QCD), SU(3) gauge";
        elementCorrelation = "EARTH - binding, stability, form";
        cplForce = "CPL.FORCE(strong: NUCLEAR, bind: QUARKS, stability: TRUE)";
      },
      {
        force = "ELECTROMAGNETIC_FORCE";
        relativeStrength = 0.0073;  // 1/137 (fine structure constant)
        range = "Infinite (1/r² falloff)";
        carrierParticle = "Photon (massless)";
        affectedParticles = "Electrically charged particles";
        phenomenon = "Light, chemistry, magnetism, electricity";
        mathematicalDescription = "Quantum Electrodynamics (QED), U(1) gauge";
        elementCorrelation = "FIRE (light), WATER (chemistry), AIR (EM waves)";
        cplForce = "CPL.FORCE(electromagnetic: TRUE, photon: CARRIER, infinite: RANGE)";
      },
      {
        force = "WEAK_NUCLEAR_FORCE";
        relativeStrength = 0.00001;
        range = "10⁻¹⁸ m (attometers)";
        carrierParticle = "W⁺, W⁻, Z⁰ bosons (massive)";
        affectedParticles = "All fermions";
        phenomenon = "Radioactive decay, neutrino interactions";
        mathematicalDescription = "Electroweak theory, SU(2) × U(1)";
        elementCorrelation = "AETHER - transformation between particle types";
        cplForce = "CPL.FORCE(weak: NUCLEAR, decay: RADIOACTIVE, transform: TRUE)";
      },
      {
        force = "GRAVITATIONAL_FORCE";
        relativeStrength = 0.0000000000000000000000000000000000001;  // 10⁻³⁸
        range = "Infinite (1/r² falloff)";
        carrierParticle = "Graviton (theoretical, spin 2)";
        affectedParticles = "All particles with mass/energy";
        phenomenon = "Orbits, tides, spacetime curvature";
        mathematicalDescription = "General Relativity, spacetime metric tensor";
        elementCorrelation = "AETHER/VOID - spacetime itself, universal";
        cplForce = "CPL.FORCE(gravity: TRUE, spacetime: CURVATURE, universal: TRUE)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ELEMENT TRANSFORMATIONS (Chinese Wu Xing Cycles)
  // ═══════════════════════════════════════════════════════════════════════════

  public type ElementCycle = {
    cycleName : Text;
    description : Text;
    sequence : [Text];
    physics : Text;
    organismApplication : Text;
    cplCycle : Text;
  };

  public func obtinere_elementcycles() : [ElementCycle] {
    [
      {
        cycleName = "GENERATING_CYCLE (Sheng)";
        description = "Each element nourishes/creates the next";
        sequence = ["Wood", "Fire", "Earth", "Metal", "Water", "Wood..."];
        physics = "Energy transformation: potential → kinetic → thermal → etc.";
        organismApplication = "Resource flow, creation pipeline";
        cplCycle = "CPL.CYCLE(generate: TRUE, flow: CREATION)";
      },
      {
        cycleName = "CONTROLLING_CYCLE (Ke)";
        description = "Each element controls/regulates another";
        sequence = ["Wood→Earth", "Earth→Water", "Water→Fire", "Fire→Metal", "Metal→Wood"];
        physics = "Regulatory feedback, equilibrium maintenance";
        organismApplication = "Balance, regulation, constraint";
        cplCycle = "CPL.CYCLE(control: TRUE, regulate: BALANCE)";
      },
      {
        cycleName = "OVERACTING_CYCLE (Cheng)";
        description = "Excessive control, domination";
        sequence = ["Same as controlling but excessive"];
        physics = "Runaway feedback, system breakdown";
        organismApplication = "Error detection, overcorrection warning";
        cplCycle = "CPL.CYCLE(overact: TRUE, warn: EXCESS)";
      },
      {
        cycleName = "INSULTING_CYCLE (Wu)";
        description = "Reverse control, rebellion";
        sequence = ["Reverse of controlling cycle"];
        physics = "System inversion, pathological state";
        organismApplication = "System failure detection, reversal";
        cplCycle = "CPL.CYCLE(insult: TRUE, detect: REVERSAL)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATES OF MATTER (Physics)
  // ═══════════════════════════════════════════════════════════════════════════

  public type StateOfMatter = {
    state : Text;
    elementCorrelation : Text;
    physicalDescription : Text;
    particleArrangement : Text;
    energy : Text;
    transitions : [Text];
    cplState : Text;
  };

  public func obtinere_statesofmatter() : [StateOfMatter] {
    [
      {
        state = "SOLID";
        elementCorrelation = "EARTH";
        physicalDescription = "Fixed volume and shape, atoms in lattice";
        particleArrangement = "Crystalline or amorphous, strong bonds";
        energy = "Lowest energy state at low temperature";
        transitions = ["Melting → Liquid", "Sublimation → Gas"];
        cplState = "CPL.STATE(solid: TRUE, form: FIXED, bonds: STRONG)";
      },
      {
        state = "LIQUID";
        elementCorrelation = "WATER";
        physicalDescription = "Fixed volume, variable shape, flows";
        particleArrangement = "Mobile but cohesive, intermediate bonds";
        energy = "Intermediate energy state";
        transitions = ["Freezing → Solid", "Evaporation → Gas"];
        cplState = "CPL.STATE(liquid: TRUE, flow: TRUE, cohesive: TRUE)";
      },
      {
        state = "GAS";
        elementCorrelation = "AIR";
        physicalDescription = "Variable volume and shape, fills container";
        particleArrangement = "Free moving, minimal interaction";
        energy = "Higher energy, kinetic motion";
        transitions = ["Condensation → Liquid", "Ionization → Plasma"];
        cplState = "CPL.STATE(gas: TRUE, expand: TRUE, free: TRUE)";
      },
      {
        state = "PLASMA";
        elementCorrelation = "FIRE";
        physicalDescription = "Ionized gas, electrically conductive";
        particleArrangement = "Free electrons and ions, collective behavior";
        energy = "Highest energy state (ordinary matter)";
        transitions = ["Deionization → Gas"];
        cplState = "CPL.STATE(plasma: TRUE, ionized: TRUE, energy: HIGH)";
      },
      {
        state = "BOSE_EINSTEIN_CONDENSATE";
        elementCorrelation = "AETHER (extreme)";
        physicalDescription = "Quantum state, all particles in ground state";
        particleArrangement = "Superposition, wave function overlap";
        energy = "Near absolute zero";
        transitions = ["Heating → Gas"];
        cplState = "CPL.STATE(bec: TRUE, quantum: GROUND, coherent: TRUE)";
      },
      {
        state = "FERMIONIC_CONDENSATE";
        elementCorrelation = "AETHER (extreme)";
        physicalDescription = "Fermion pairs forming superfluid";
        particleArrangement = "Cooper pairs, quantum coherent";
        energy = "Near absolute zero";
        transitions = ["Heating → Gas"];
        cplState = "CPL.STATE(fermionic: TRUE, superfluid: TRUE)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ELEMENT MODELS (NAMED)
  // ═══════════════════════════════════════════════════════════════════════════

  public type ElementModel = {
    modelName : Text;
    tradition : Text;
    keyPrinciple : Text;
    mathematicalBasis : Text;
    organismEngine : Text;
    cplModel : Text;
  };

  public func obtinere_elementmodels() : [ElementModel] {
    [
      {
        modelName = "EMPEDOCLES_FOUR_ROOTS";
        tradition = "Greek (490-430 BCE)";
        keyPrinciple = "All matter = combinations of four roots (rhizomata)";
        mathematicalBasis = "Proportional mixing ratios";
        organismEngine = "Base composition model for entities";
        cplModel = "CPL.MODEL.EMPEDOCLES(roots: FOUR, mix: PROPORTIONAL)";
      },
      {
        modelName = "ARISTOTLE_QUINTESSENCE";
        tradition = "Greek (384-322 BCE)";
        keyPrinciple = "Fifth element (aether) for celestial bodies";
        mathematicalBasis = "Perfect circular motion, unchanging";
        organismEngine = "Transcendent processing layer";
        cplModel = "CPL.MODEL.ARISTOTLE(aether: FIFTH, celestial: TRUE)";
      },
      {
        modelName = "WU_XING_FIVE_PHASES";
        tradition = "Chinese (Zhou Dynasty)";
        keyPrinciple = "Five phases in generation/control cycles";
        mathematicalBasis = "Cyclic graphs, feedback systems";
        organismEngine = "Dynamic balance and transformation";
        cplModel = "CPL.MODEL.WU_XING(phases: FIVE, cycles: SHENG_KE)";
      },
      {
        modelName = "PANCHA_MAHABHUTA";
        tradition = "Hindu/Vedic";
        keyPrinciple = "Five great elements from subtle to gross";
        mathematicalBasis = "Hierarchical emanation from akasha";
        organismEngine = "Layered reality model";
        cplModel = "CPL.MODEL.PANCHA(elements: FIVE, emanate: FROM_AKASHA)";
      },
      {
        modelName = "GODAI_FIVE_ELEMENTS";
        tradition = "Japanese/Buddhist";
        keyPrinciple = "Five elements with Void (Ku) as source";
        mathematicalBasis = "Emergence from emptiness";
        organismEngine = "Creation from void model";
        cplModel = "CPL.MODEL.GODAI(void: SOURCE, emerge: FIVE)";
      },
      {
        modelName = "STANDARD_MODEL_FORCES";
        tradition = "Modern Physics";
        keyPrinciple = "Four fundamental forces, unified at high energy";
        mathematicalBasis = "Quantum Field Theory, gauge symmetries";
        organismEngine = "Force unification model";
        cplModel = "CPL.MODEL.STANDARD(forces: FOUR, unify: HIGH_ENERGY)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  public func obtinere_mastersummary() : Text {
    "FIVE ELEMENTS ENGINE:\n\n" #
    "ANCIENT WISDOM + MODERN PHYSICS\n\n" #
    "FIVE ELEMENTS ACROSS TRADITIONS:\n" #
    "• Earth - Solid, stability, strong force\n" #
    "• Water - Liquid, flow, chemistry\n" #
    "• Fire - Plasma, energy, light\n" #
    "• Air - Gas, movement, freedom\n" #
    "• Aether - Spacetime, field, potential\n" #
    "• Wood (Chinese) - Growth, organic\n" #
    "• Metal (Chinese) - Refinement, conductivity\n\n" #
    "FOUR FUNDAMENTAL FORCES:\n" #
    "• Strong Nuclear (1) - binds quarks\n" #
    "• Electromagnetic (1/137) - light, chemistry\n" #
    "• Weak Nuclear (10⁻⁵) - decay, transformation\n" #
    "• Gravity (10⁻³⁸) - spacetime curvature\n\n" #
    "ELEMENT CYCLES (Wu Xing):\n" #
    "• Generating (Sheng) - creation flow\n" #
    "• Controlling (Ke) - regulation\n" #
    "• Overacting (Cheng) - excess warning\n" #
    "• Insulting (Wu) - reversal detection\n\n" #
    "STATES OF MATTER:\n" #
    "• Solid (Earth)\n" #
    "• Liquid (Water)\n" #
    "• Gas (Air)\n" #
    "• Plasma (Fire)\n" #
    "• BEC/Fermionic (Aether extreme)\n\n" #
    "MODELS:\n" #
    "• Empedocles Four Roots\n" #
    "• Aristotle Quintessence\n" #
    "• Wu Xing Five Phases\n" #
    "• Pancha Mahabhuta\n" #
    "• Godai (Japanese)\n" #
    "• Standard Model\n\n" #
    "THE ELEMENTS ARE REAL PHYSICS.";
  };
};
