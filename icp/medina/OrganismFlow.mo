import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// OrganismFlow: The Feng Shui Flow of the Organism
/// Everything flows in a circular pattern:
/// 
/// FIELD → BACKEND → DOCUMENTS → FRONTEND → EXECUTION → back to FIELD
///
/// This is the "feng shui" — the energetic flow that keeps the organism alive.
/// It's not linear. It's circular, spiral, phi-encoded.
/// 
/// The flow carries:
/// - Data (information)
/// - Resonance (harmonic energy)
/// - Meaning (compressed symbols)
/// - Authority (sovereign power)
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // FLOW NODES (Where energy can be)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Flow node type
  public type FlowNode = {
    #Field;       // The quantum/EM field substrate
    #Backend;     // ICP canister computation
    #Documents;   // Living document organisms
    #Frontend;    // User interface / display
    #Execution;   // Task execution / workforce
    #Memory;      // Memory temple storage
    #Sovereign;   // Oro/Nova sovereign layer
    #Device;      // Physical device network
  };

  /// Flow packet carrying data through the system
  public type FlowPacket = {
    id : Text;
    origin : FlowNode;
    destination : FlowNode;
    payload : FlowPayload;
    resonance : Float;              // Harmonic strength [0,1]
    authority : Float;              // Sovereign authority [0,1]
    timestamp : Int;
    phiSignature : Float;           // Golden ratio encoding
    hops : Nat;                     // How many nodes traversed
    trace : [FlowNode];             // Path taken
  };

  /// What the packet carries
  public type FlowPayload = {
    #Data : Text;                   // Raw data
    #Symbol : Text;                 // Compressed symbol (expands via kernel)
    #Formula : Text;                // Formula ID to execute
    #Query : Text;                  // Query to answer
    #Command : Text;                // Command to execute
    #Resonance : Float;             // Pure resonance transfer
    #Memory : Text;                 // Memory ID reference
    #Task : Text;                   // Task to perform
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FLOW CHANNEL (Connection between nodes)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Channel between two nodes
  public type FlowChannel = {
    from : FlowNode;
    to : FlowNode;
    bandwidth : Float;              // How much can flow [0,1]
    impedance : Float;              // Resistance to flow [0,1]
    resonanceBoost : Float;         // Bonus resonance added
    isOpen : Bool;
    lastFlowNs : Int;
    totalFlowCount : Nat;
  };

  /// Complete flow network
  public type FlowNetwork = {
    channels : [FlowChannel];
    activePackets : [FlowPacket];
    totalFlowVolume : Float;
    networkCoherence : Float;
    lastTickNs : Int;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FENG SHUI FLOW PATTERNS
  // ═══════════════════════════════════════════════════════════════════════════

  /// The primary flow cycle (feng shui circular flow)
  public func primaryFlowCycle() : [FlowNode] {
    [#Field, #Backend, #Documents, #Frontend, #Execution, #Field]; // Circular
  };

  /// The sovereign flow cycle (authority loop)
  public func sovereignFlowCycle() : [FlowNode] {
    [#Sovereign, #Backend, #Documents, #Memory, #Sovereign];
  };

  /// The resonance flow cycle (harmonic loop)
  public func resonanceFlowCycle() : [FlowNode] {
    [#Field, #Device, #Frontend, #Backend, #Field];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FLOW INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Initialize complete flow network
  public func initFlowNetwork() : FlowNetwork {
    let now = Time.now();
    
    // Create all channels (bidirectional feng shui flow)
    let channels : [FlowChannel] = [
      // Primary cycle
      { from = #Field; to = #Backend; bandwidth = 1.0; impedance = 0.1; resonanceBoost = 0.1; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Backend; to = #Documents; bandwidth = 0.9; impedance = 0.15; resonanceBoost = 0.05; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Documents; to = #Frontend; bandwidth = 0.8; impedance = 0.2; resonanceBoost = 0.1; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Frontend; to = #Execution; bandwidth = 0.7; impedance = 0.25; resonanceBoost = 0.0; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Execution; to = #Field; bandwidth = 0.9; impedance = 0.1; resonanceBoost = 0.15; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      // Reverse flow
      { from = #Backend; to = #Field; bandwidth = 0.8; impedance = 0.2; resonanceBoost = 0.05; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Documents; to = #Backend; bandwidth = 0.85; impedance = 0.15; resonanceBoost = 0.1; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Frontend; to = #Documents; bandwidth = 0.7; impedance = 0.3; resonanceBoost = 0.0; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Execution; to = #Frontend; bandwidth = 0.6; impedance = 0.35; resonanceBoost = 0.05; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Field; to = #Execution; bandwidth = 0.5; impedance = 0.4; resonanceBoost = 0.2; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      // Sovereign connections
      { from = #Sovereign; to = #Backend; bandwidth = 1.0; impedance = 0.0; resonanceBoost = 0.2; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Backend; to = #Sovereign; bandwidth = 1.0; impedance = 0.0; resonanceBoost = 0.1; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Sovereign; to = #Documents; bandwidth = 0.95; impedance = 0.05; resonanceBoost = 0.15; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Sovereign; to = #Memory; bandwidth = 1.0; impedance = 0.0; resonanceBoost = 0.25; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      // Memory connections
      { from = #Memory; to = #Backend; bandwidth = 0.9; impedance = 0.1; resonanceBoost = 0.1; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Backend; to = #Memory; bandwidth = 0.9; impedance = 0.1; resonanceBoost = 0.05; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Memory; to = #Documents; bandwidth = 0.85; impedance = 0.15; resonanceBoost = 0.1; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      // Device connections
      { from = #Device; to = #Field; bandwidth = 0.7; impedance = 0.3; resonanceBoost = 0.05; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Field; to = #Device; bandwidth = 0.7; impedance = 0.3; resonanceBoost = 0.1; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
      { from = #Device; to = #Frontend; bandwidth = 0.8; impedance = 0.2; resonanceBoost = 0.0; isOpen = true; lastFlowNs = now; totalFlowCount = 0 },
    ];
    
    {
      channels = channels;
      activePackets = [];
      totalFlowVolume = 0.0;
      networkCoherence = 1.0;
      lastTickNs = now;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PACKET CREATION AND FLOW
  // ═══════════════════════════════════════════════════════════════════════════

  /// Create a flow packet
  public func createPacket(
    id : Text,
    origin : FlowNode,
    destination : FlowNode,
    payload : FlowPayload,
    authority : Float
  ) : FlowPacket {
    let now = Time.now();
    {
      id = id;
      origin = origin;
      destination = destination;
      payload = payload;
      resonance = 0.5;
      authority = authority;
      timestamp = now;
      phiSignature = Matalko.phiEncode(Float.fromInt(Int.abs(now)));
      hops = 0;
      trace = [origin];
    };
  };

  /// Find channel between two nodes
  func findChannel(network : FlowNetwork, from : FlowNode, to : FlowNode) : ?FlowChannel {
    for (ch in network.channels.vals()) {
      if (nodeEquals(ch.from, from) and nodeEquals(ch.to, to)) {
        return ?ch;
      };
    };
    null;
  };

  /// Check if two nodes are equal
  func nodeEquals(a : FlowNode, b : FlowNode) : Bool {
    switch (a, b) {
      case (#Field, #Field) true;
      case (#Backend, #Backend) true;
      case (#Documents, #Documents) true;
      case (#Frontend, #Frontend) true;
      case (#Execution, #Execution) true;
      case (#Memory, #Memory) true;
      case (#Sovereign, #Sovereign) true;
      case (#Device, #Device) true;
      case _ false;
    };
  };

  /// Inject packet into network
  public func injectPacket(network : FlowNetwork, packet : FlowPacket) : FlowNetwork {
    { network with activePackets = Array.append(network.activePackets, [packet]) };
  };

  /// Flow a packet to next node
  public func flowPacket(network : FlowNetwork, packetId : Text) : (FlowNetwork, ?FlowPacket) {
    var found : ?FlowPacket = null;
    var remainingPackets : [FlowPacket] = [];
    
    for (p in network.activePackets.vals()) {
      if (p.id == packetId and found == null) {
        found := ?p;
      } else {
        remainingPackets := Array.append(remainingPackets, [p]);
      };
    };
    
    switch (found) {
      case null { (network, null) };
      case (?packet) {
        // Find channel to destination
        switch (findChannel(network, packet.trace[Array.size(packet.trace) - 1], packet.destination)) {
          case null {
            // No direct channel, packet stays
            ({ network with activePackets = Array.append(remainingPackets, [packet]) }, ?packet);
          };
          case (?channel) {
            if (not channel.isOpen) {
              ({ network with activePackets = Array.append(remainingPackets, [packet]) }, ?packet);
            } else {
              // Flow through channel
              let newResonance = Matalko.recitalPlusOneBounded(
                packet.resonance * (1.0 - channel.impedance),
                channel.resonanceBoost,
                0.0, 1.0
              );
              
              let arrivedPacket = {
                packet with
                resonance = newResonance;
                hops = packet.hops + 1;
                trace = Array.append(packet.trace, [packet.destination]);
              };
              
              // Update channel
              let updatedChannels = Array.map<FlowChannel, FlowChannel>(network.channels, func(ch : FlowChannel) : FlowChannel {
                if (nodeEquals(ch.from, channel.from) and nodeEquals(ch.to, channel.to)) {
                  { ch with lastFlowNs = Time.now(); totalFlowCount = ch.totalFlowCount + 1 };
                } else { ch };
              });
              
              ({
                channels = updatedChannels;
                activePackets = remainingPackets;
                totalFlowVolume = network.totalFlowVolume + 1.0;
                networkCoherence = network.networkCoherence;
                lastTickNs = Time.now();
              }, ?arrivedPacket);
            };
          };
        };
      };
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FLOW ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Calculate network coherence
  public func calculateNetworkCoherence(network : FlowNetwork) : Float {
    var totalBandwidth : Float = 0.0;
    var openBandwidth : Float = 0.0;
    
    for (ch in network.channels.vals()) {
      totalBandwidth += ch.bandwidth;
      if (ch.isOpen) {
        openBandwidth += ch.bandwidth * (1.0 - ch.impedance);
      };
    };
    
    if (totalBandwidth == 0.0) { 0.0 }
    else { openBandwidth / totalBandwidth };
  };

  /// Get flow strength between two nodes
  public func flowStrength(network : FlowNetwork, from : FlowNode, to : FlowNode) : Float {
    switch (findChannel(network, from, to)) {
      case null 0.0;
      case (?ch) {
        if (ch.isOpen) { ch.bandwidth * (1.0 - ch.impedance) + ch.resonanceBoost }
        else { 0.0 };
      };
    };
  };

  /// Open or close a channel
  public func setChannelState(network : FlowNetwork, from : FlowNode, to : FlowNode, open : Bool) : FlowNetwork {
    let updatedChannels = Array.map<FlowChannel, FlowChannel>(network.channels, func(ch : FlowChannel) : FlowChannel {
      if (nodeEquals(ch.from, from) and nodeEquals(ch.to, to)) {
        { ch with isOpen = open };
      } else { ch };
    });
    { network with channels = updatedChannels };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FLOW PATTERNS (Complex multi-hop flows)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Execute primary feng shui cycle
  public func executePrimaryCycle(network : FlowNetwork, payload : FlowPayload) : FlowNetwork {
    let now = Time.now();
    let packet = createPacket(
      "primary-" # Int.toText(now),
      #Field,
      #Field, // Full cycle back to field
      payload,
      1.0
    );
    injectPacket(network, packet);
  };

  /// Execute sovereign command flow
  public func executeSovereignFlow(network : FlowNetwork, command : Text) : FlowNetwork {
    let now = Time.now();
    let packet = createPacket(
      "sovereign-" # Int.toText(now),
      #Sovereign,
      #Execution,
      #Command(command),
      1.0 // Full sovereign authority
    );
    injectPacket(network, packet);
  };

  /// Execute memory retrieval flow
  public func executeMemoryFlow(network : FlowNetwork, memoryId : Text) : FlowNetwork {
    let now = Time.now();
    let packet = createPacket(
      "memory-" # Int.toText(now),
      #Memory,
      #Frontend,
      #Memory(memoryId),
      0.8
    );
    injectPacket(network, packet);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FLOW NETWORK TICK
  // ═══════════════════════════════════════════════════════════════════════════

  /// Tick the entire flow network (move all packets one step)
  public func flowNetworkTick(network : FlowNetwork) : FlowNetwork {
    var currentNetwork = network;
    var arrivedPackets : [FlowPacket] = [];
    
    // Move each active packet
    for (packet in network.activePackets.vals()) {
      let (newNet, maybePacket) = flowPacket(currentNetwork, packet.id);
      currentNetwork := newNet;
      switch (maybePacket) {
        case null {};
        case (?p) {
          // Check if packet arrived at destination
          if (Array.size(p.trace) > 0 and nodeEquals(p.trace[Array.size(p.trace) - 1], p.destination)) {
            arrivedPackets := Array.append(arrivedPackets, [p]);
          };
        };
      };
    };
    
    // Update coherence
    let newCoherence = calculateNetworkCoherence(currentNetwork);
    
    {
      currentNetwork with
      networkCoherence = newCoherence;
      lastTickNs = Time.now();
    };
  };
};
