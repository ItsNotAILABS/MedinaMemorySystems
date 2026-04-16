import Array "mo:base/Array";
import T "./Types";

module {
  public func withinRing(node : T.MemoryNode, ring : Nat) : Bool {
    node.coords.ring == ring;
  };

  public func withinDepth(node : T.MemoryNode, depth : Nat) : Bool {
    node.coords.depth <= depth;
  };

  public func lineageMatch(node : T.MemoryNode, lineage : Text) : Bool {
    node.lineage.recital == lineage or node.lineage.parent == ?lineage;
  };

  public func find(
    nodes : [T.MemoryNode],
    query : Text,
    ring : ?Nat,
    depth : ?Nat,
    lineage : ?Text,
  ) : [T.MemoryNode] {
    Array.filter<T.MemoryNode>(
      nodes,
      func(n : T.MemoryNode) : Bool {
        let queryHit = query == "" or n.payload == query;
        let ringHit = switch (ring) {
          case null true;
          case (?r) withinRing(n, r);
        };
        let depthHit = switch (depth) {
          case null true;
          case (?d) withinDepth(n, d);
        };
        let lineageHit = switch (lineage) {
          case null true;
          case (?l) lineageMatch(n, l);
        };
        queryHit and ringHit and depthHit and lineageHit;
      },
    );
  };

  public func findById(nodes : [T.MemoryNode], memoryId : Text) : ?T.MemoryNode {
    Array.find<T.MemoryNode>(nodes, func(n : T.MemoryNode) : Bool { n.id == memoryId });
  };

  public func consolidate(targetId : Text, sourceIds : [Text], source : T.MemoryNode) : T.MemoryNode {
    {
      id = targetId;
      payload = source.payload;
      coords = source.coords;
      lineage = source.lineage;
      salience = source.salience;
      doctrineTags = source.doctrineTags;
      pinned = source.pinned;
      promoted = source.promoted;
      consolidatedFrom = sourceIds;
      createdAtNs = T.nowNs();
    };
  };

  public func promote(node : T.MemoryNode) : T.MemoryNode {
    {
      id = node.id;
      payload = node.payload;
      coords = node.coords;
      lineage = node.lineage;
      salience = node.salience;
      doctrineTags = node.doctrineTags;
      pinned = node.pinned;
      promoted = true;
      consolidatedFrom = node.consolidatedFrom;
      createdAtNs = node.createdAtNs;
    };
  };

  public func pin(node : T.MemoryNode, reason : ?Text) : T.MemoryNode {
    let boosted = if (node.salience < 100) node.salience + 1 else node.salience;
    let reasonTag = switch (reason) {
      case null [];
      case (?r) ["pin:" # r];
    };

    {
      id = node.id;
      payload = node.payload;
      coords = node.coords;
      lineage = node.lineage;
      salience = boosted;
      doctrineTags = Array.append<Text>(node.doctrineTags, reasonTag);
      pinned = true;
      promoted = node.promoted;
      consolidatedFrom = node.consolidatedFrom;
      createdAtNs = node.createdAtNs;
    };
  };

  public func mapPath(node : T.MemoryNode, mode : Text) : Text {
    if (mode == "helix") {
      "helix(" # node.id # ") theta=" # debug_show (node.coords.theta) # " phi=" # debug_show (node.coords.phi) # " depth=" # debug_show (node.coords.depth);
    } else if (mode == "ring") {
      "ring(" # node.id # ") ring=" # debug_show (node.coords.ring) # " beat=" # debug_show (node.coords.beat);
    } else {
      "path(" # node.id # ") recital=" # node.lineage.recital # " parent=" # debug_show (node.lineage.parent);
    };
  };
};
