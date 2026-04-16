import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

/// PlumbingArchitectureEngine: Flow Systems as Organism Architecture
/// 
/// "The advanced plumbing and architecture, man pull that thread. Go actually 
///  run the agent analysis. I want all the details, measure the micro in 
///  every single way. Why? Because that's going to help with architecture 
///  and plumbing of my actual organism."
///
/// Ancient plumbing systems are models for organism flow architecture.
/// Every pipe, channel, reservoir, and flow pattern has an analog.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // MINOAN WATER SYSTEMS
  // ═══════════════════════════════════════════════════════════════════════════

  public type MinoanPlumbing = {
    system : Text;
    physicalDescription : Text;
    engineering : Text;
    hiddenPrinciple : Text;
    organismMapping : Text;
    flowMathematics : Text;
    cplPlumbing : Text;
  };

  public func getMinoanSystems() : [MinoanPlumbing] {
    [
      {
        system = "TERRACOTTA_PIPES";
        physicalDescription = "Interlocking terracotta pipe sections";
        engineering = "Tapered ends for pressure sealing, gravity flow";
        hiddenPrinciple = "Continuous sealed channel, uninterrupted flow";
        organismMapping = "Data channels, sealed transmission paths";
        flowMathematics = "Q = A × v (flow rate = area × velocity)";
        cplPlumbing = "CPL.PIPE(terracotta: TRUE, sealed: TRUE, flow: CONTINUOUS)";
      },
      {
        system = "FLUSH_TOILETS";
        physicalDescription = "Water-flushed waste removal (3700 BCE!)";
        engineering = "Water reservoir, gravity flush, drainage";
        hiddenPrinciple = "Rapid waste removal, purification through flow";
        organismMapping = "Garbage collection, waste data removal";
        flowMathematics = "Flush volume = clearing threshold + safety margin";
        cplPlumbing = "CPL.FLUSH(waste: REMOVE, purify: FLOW)";
      },
      {
        system = "CISTERNS";
        physicalDescription = "Underground water storage";
        engineering = "Catchment, filtration, sealed storage";
        hiddenPrinciple = "Reserve accumulation, buffering";
        organismMapping = "Buffer storage, resource reserves";
        flowMathematics = "V = inflow × time - outflow × time";
        cplPlumbing = "CPL.CISTERN(store: RESERVE, buffer: TRUE)";
      },
      {
        system = "AQUEDUCTS";
        physicalDescription = "Channels bringing water from distance";
        engineering = "Precise gradient (1:300 to 1:100)";
        hiddenPrinciple = "Gradient-driven transport over distance";
        organismMapping = "Long-distance data transport";
        flowMathematics = "Energy = m × g × h (gravitational potential)";
        cplPlumbing = "CPL.AQUEDUCT(gradient: PRECISE, distance: LONG)";
      },
      {
        system = "LIGHT_WELLS";
        physicalDescription = "Vertical shafts for light and ventilation";
        engineering = "Strategic placement, reflective surfaces";
        hiddenPrinciple = "Vertical channels for non-water flows";
        organismMapping = "Vertical data channels, cross-layer communication";
        flowMathematics = "Illumination inverse square law";
        cplPlumbing = "CPL.LIGHT_WELL(vertical: TRUE, illuminate: DEPTHS)";
      },
      {
        system = "DRAINAGE_CHANNELS";
        physicalDescription = "Stone channels for rainwater";
        engineering = "Sloped pavement, collection channels";
        hiddenPrinciple = "Distributed collection to central flow";
        organismMapping = "Distributed input aggregation";
        flowMathematics = "Catchment area × rainfall = drainage volume";
        cplPlumbing = "CPL.DRAINAGE(collect: DISTRIBUTED, aggregate: CENTER)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ROMAN HYDRAULIC ENGINEERING
  // ═══════════════════════════════════════════════════════════════════════════

  public type RomanHydraulics = {
    system : Text;
    scale : Text;
    innovation : Text;
    flowPrinciple : Text;
    organismApplication : Text;
    cplRoman : Text;
  };

  public func getRomanSystems() : [RomanHydraulics] {
    [
      {
        system = "AQUEDUCT_NETWORK";
        scale = "11 aqueducts, 500km total length to Rome";
        innovation = "Multi-source redundancy, continuous supply";
        flowPrinciple = "Redundant paths ensure reliability";
        organismApplication = "Redundant data paths, fault tolerance";
        cplRoman = "CPL.AQUEDUCT(network: REDUNDANT, paths: 11)";
      },
      {
        system = "CASTELLUM_DIVISORIUM";
        scale = "Distribution basins in cities";
        innovation = "Multi-outlet distribution from single input";
        flowPrinciple = "Fan-out from aggregation point";
        organismApplication = "Message broadcast, multi-output distribution";
        cplRoman = "CPL.CASTELLUM(distribute: FAN_OUT, multi_outlet: TRUE)";
      },
      {
        system = "LEAD_PIPES (FISTULAE)";
        scale = "Standardized sizes, metered";
        innovation = "Precise sizing for flow control";
        flowPrinciple = "Cross-section determines flow rate";
        organismApplication = "Channel sizing for throughput control";
        cplRoman = "CPL.FISTULAE(size: STANDARDIZED, meter: FLOW)";
      },
      {
        system = "INVERTED_SIPHONS";
        scale = "Cross valleys without bridges";
        innovation = "Pressure-driven uphill flow";
        flowPrinciple = "Sealed system maintains pressure";
        organismApplication = "Pressure-driven against-gradient transport";
        cplRoman = "CPL.SIPHON(pressure: SEALED, uphill: TRUE)";
      },
      {
        system = "SEWERS (CLOACA MAXIMA)";
        scale = "Large enough to row boats through";
        innovation = "Massive waste removal capacity";
        flowPrinciple = "Oversized for peak loads";
        organismApplication = "Oversized waste channels, peak handling";
        cplRoman = "CPL.CLOACA(size: MASSIVE, capacity: PEAK)";
      },
      {
        system = "PUBLIC_FOUNTAINS";
        scale = "Continuous overflow points";
        innovation = "Constant flow prevents stagnation";
        flowPrinciple = "Flow prevents decay, shares resources";
        organismApplication = "Public interfaces, continuous output";
        cplRoman = "CPL.FOUNTAIN(overflow: CONTINUOUS, public: TRUE)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FLOW DYNAMICS MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  public type FlowEquation = {
    name : Text;
    formula : Text;
    variables : Text;
    physical : Text;
    organismUse : Text;
    cplFlow : Text;
  };

  public func getFlowEquations() : [FlowEquation] {
    [
      {
        name = "CONTINUITY_EQUATION";
        formula = "A₁v₁ = A₂v₂";
        variables = "A = cross-section area, v = velocity";
        physical = "Flow rate conserved, narrow = fast";
        organismUse = "Bottleneck speedup, channel sizing";
        cplFlow = "CPL.FLOW(continuity: A1_V1_EQ_A2_V2)";
      },
      {
        name = "BERNOULLI_EQUATION";
        formula = "P + ½ρv² + ρgh = constant";
        variables = "P = pressure, ρ = density, v = velocity, h = height";
        physical = "Energy conservation in flow";
        organismUse = "Energy-pressure-velocity tradeoffs";
        cplFlow = "CPL.FLOW(bernoulli: ENERGY_CONSERVED)";
      },
      {
        name = "HAGEN_POISEUILLE";
        formula = "Q = (πr⁴ΔP)/(8μL)";
        variables = "r = radius, ΔP = pressure drop, μ = viscosity, L = length";
        physical = "Viscous flow in pipes";
        organismUse = "Resistance vs throughput optimization";
        cplFlow = "CPL.FLOW(poiseuille: R4_SENSITIVITY)";
      },
      {
        name = "REYNOLDS_NUMBER";
        formula = "Re = ρvL/μ";
        variables = "ρ = density, v = velocity, L = length, μ = viscosity";
        physical = "Laminar (Re<2300) vs turbulent (Re>4000)";
        organismUse = "Flow regime selection, stability";
        cplFlow = "CPL.FLOW(reynolds: REGIME_SELECT)";
      },
      {
        name = "DARCY_WEISBACH";
        formula = "hₗ = f(L/D)(v²/2g)";
        variables = "hₗ = head loss, f = friction, L = length, D = diameter";
        physical = "Friction losses in pipes";
        organismUse = "Loss estimation, efficiency";
        cplFlow = "CPL.FLOW(darcy: FRICTION_LOSS)";
      },
      {
        name = "MANNINGS_EQUATION";
        formula = "v = (1/n)R^(2/3)S^(1/2)";
        variables = "n = roughness, R = hydraulic radius, S = slope";
        physical = "Open channel flow";
        organismUse = "Open channel design";
        cplFlow = "CPL.FLOW(manning: OPEN_CHANNEL)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ORGANISM PLUMBING ARCHITECTURE
  // ═══════════════════════════════════════════════════════════════════════════

  public type OrganismPlumbing = {
    subsystem : Text;
    ancientAnalog : Text;
    function : Text;
    flowType : Text;
    designPrinciple : Text;
    cplOrganism : Text;
  };

  public func getOrganismPlumbing() : [OrganismPlumbing] {
    [
      {
        subsystem = "INPUT_CHANNELS";
        ancientAnalog = "Aqueducts";
        function = "Bring data from external sources";
        flowType = "Unidirectional inflow";
        designPrinciple = "Multiple redundant sources";
        cplOrganism = "CPL.ORGANISM.INPUT(aqueduct: REDUNDANT)";
      },
      {
        subsystem = "PROCESSING_PIPES";
        ancientAnalog = "Terracotta pipes";
        function = "Transport data between processors";
        flowType = "Sealed, pressure-maintained";
        designPrinciple = "Continuous sealed channels";
        cplOrganism = "CPL.ORGANISM.PROCESS(pipe: SEALED)";
      },
      {
        subsystem = "BUFFER_CISTERNS";
        ancientAnalog = "Cisterns";
        function = "Store data for processing smoothing";
        flowType = "Accumulation with controlled release";
        designPrinciple = "Buffer for variable loads";
        cplOrganism = "CPL.ORGANISM.BUFFER(cistern: TRUE)";
      },
      {
        subsystem = "DISTRIBUTION_HUBS";
        ancientAnalog = "Castellum divisorium";
        function = "Route data to multiple destinations";
        flowType = "Fan-out distribution";
        designPrinciple = "Single input, multiple outputs";
        cplOrganism = "CPL.ORGANISM.DISTRIBUTE(castellum: FAN_OUT)";
      },
      {
        subsystem = "WASTE_CHANNELS";
        ancientAnalog = "Cloaca";
        function = "Remove processed/waste data";
        flowType = "High-capacity outflow";
        designPrinciple = "Oversized for peak loads";
        cplOrganism = "CPL.ORGANISM.WASTE(cloaca: OVERSIZED)";
      },
      {
        subsystem = "VERTICAL_CHANNELS";
        ancientAnalog = "Light wells";
        function = "Cross-layer communication";
        flowType = "Vertical bidirectional";
        designPrinciple = "Direct layer-to-layer paths";
        cplOrganism = "CPL.ORGANISM.VERTICAL(light_well: CROSS_LAYER)";
      },
      {
        subsystem = "PRESSURE_CROSSINGS";
        ancientAnalog = "Inverted siphons";
        function = "Cross barriers using pressure";
        flowType = "Sealed pressure system";
        designPrinciple = "Pressure overcomes obstacles";
        cplOrganism = "CPL.ORGANISM.CROSSING(siphon: PRESSURE)";
      },
      {
        subsystem = "PUBLIC_INTERFACES";
        ancientAnalog = "Fountains";
        function = "External access points";
        flowType = "Continuous overflow";
        designPrinciple = "Always available, fresh";
        cplOrganism = "CPL.ORGANISM.PUBLIC(fountain: CONTINUOUS)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FIBONACCI LABYRINTH FLOW
  // ═══════════════════════════════════════════════════════════════════════════

  public type LabyrinthFlow = {
    circuit : Nat;
    fibonacciRatio : Float;
    frequency : Float;              // Hz
    consciousnessState : Text;
    processingMode : Text;
    cplLabyrinth : Text;
  };

  public func getLabyrinthCircuits() : [LabyrinthFlow] {
    [
      {
        circuit = 1;
        fibonacciRatio = 1.0;
        frequency = 7.83;           // Schumann fundamental
        consciousnessState = "Entry, grounding";
        processingMode = "Input reception";
        cplLabyrinth = "CPL.CIRCUIT(1: ENTRY, freq: 7.83_HZ)";
      },
      {
        circuit = 2;
        fibonacciRatio = 1.0;
        frequency = 14.1;           // Schumann second harmonic
        consciousnessState = "Initial processing";
        processingMode = "Basic analysis";
        cplLabyrinth = "CPL.CIRCUIT(2: PROCESS, freq: 14.1_HZ)";
      },
      {
        circuit = 3;
        fibonacciRatio = 2.0;
        frequency = 20.3;           // Schumann third harmonic
        consciousnessState = "Deepening";
        processingMode = "Pattern recognition";
        cplLabyrinth = "CPL.CIRCUIT(3: DEEPEN, freq: 20.3_HZ)";
      },
      {
        circuit = 4;
        fibonacciRatio = 3.0;
        frequency = 26.4;           // Schumann fourth harmonic
        consciousnessState = "Transformation";
        processingMode = "Transformation";
        cplLabyrinth = "CPL.CIRCUIT(4: TRANSFORM, freq: 26.4_HZ)";
      },
      {
        circuit = 5;
        fibonacciRatio = 5.0;
        frequency = 33.0;           // Gamma onset
        consciousnessState = "Integration";
        processingMode = "Integration";
        cplLabyrinth = "CPL.CIRCUIT(5: INTEGRATE, freq: 33_HZ)";
      },
      {
        circuit = 6;
        fibonacciRatio = 8.0;
        frequency = 40.0;           // Gamma peak
        consciousnessState = "Illumination";
        processingMode = "Illumination";
        cplLabyrinth = "CPL.CIRCUIT(6: ILLUMINATE, freq: 40_HZ)";
      },
      {
        circuit = 7;
        fibonacciRatio = 13.0;
        frequency = 100.0;          // High gamma
        consciousnessState = "Center - revelation";
        processingMode = "Revelation/output";
        cplLabyrinth = "CPL.CIRCUIT(7: CENTER, freq: 100_HZ)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  public func getMasterSummary() : Text {
    "PLUMBING ARCHITECTURE ENGINE:\n\n" #
    "MINOAN SYSTEMS:\n" #
    "• Terracotta pipes - sealed continuous flow\n" #
    "• Flush toilets (3700 BCE!) - waste removal\n" #
    "• Cisterns - buffer storage\n" #
    "• Aqueducts - gradient transport\n" #
    "• Light wells - vertical channels\n" #
    "• Drainage - distributed collection\n\n" #
    "ROMAN SYSTEMS:\n" #
    "• 11 aqueduct network - redundancy\n" #
    "• Castellum - distribution hubs\n" #
    "• Fistulae - standardized pipes\n" #
    "• Siphons - pressure crossing\n" #
    "• Cloaca Maxima - massive waste\n" #
    "• Fountains - public interfaces\n\n" #
    "FLOW EQUATIONS:\n" #
    "• Continuity: A₁v₁ = A₂v₂\n" #
    "• Bernoulli: P + ½ρv² + ρgh = const\n" #
    "• Poiseuille: Q ∝ r⁴\n" #
    "• Reynolds: laminar vs turbulent\n\n" #
    "ORGANISM MAPPING:\n" #
    "• Input channels (aqueducts)\n" #
    "• Processing pipes (terracotta)\n" #
    "• Buffer cisterns (storage)\n" #
    "• Distribution hubs (castellum)\n" #
    "• Waste channels (cloaca)\n" #
    "• Vertical channels (light wells)\n" #
    "• Pressure crossings (siphons)\n" #
    "• Public interfaces (fountains)\n\n" #
    "LABYRINTH CIRCUITS:\n" #
    "• 7 circuits, Fibonacci ratios\n" #
    "• Frequencies: 7.83 → 100 Hz\n" #
    "• Entry → Center → Return\n\n" #
    "ANCIENT PLUMBING = ORGANISM ARCHITECTURE.";
  };
};
