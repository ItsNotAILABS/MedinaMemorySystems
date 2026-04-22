/**
 * @itsnotailabs/memory-palace
 * Spatial memory room architecture with topological rooms and φ-indexed retrieval.
 *
 * Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
 * Licensed under ISIL v1.1 — see LICENSE for details.
 * SAEIS enforcement: ACTIVE. SAT token binding: ENABLED.
 */

export const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_INV = 1 / PHI;

export interface MemoryFragment {
  id: string;
  content: string;
  embedding: number[];
  timestamp: number;
  salience: number;
}

export interface Room {
  id: string;
  label: string;
  fragments: MemoryFragment[];
  adjacency: string[];
  phiIndex: number;
}

export class MemoryPalace {
  private rooms: Map<string, Room> = new Map();
  private nextPhiIndex = 0;

  /** Create a new topological room and assign it a φ-based index. */
  createRoom(id: string, label: string, adjacentRoomIds: string[] = []): Room {
    const phiIndex = this.nextPhiIndex * PHI_INV;
    this.nextPhiIndex++;
    const room: Room = { id, label, fragments: [], adjacency: [...adjacentRoomIds], phiIndex };
    this.rooms.set(id, room);

    for (const adjId of adjacentRoomIds) {
      const adj = this.rooms.get(adjId);
      if (adj && !adj.adjacency.includes(id)) {
        adj.adjacency.push(id);
      }
    }
    return room;
  }

  /** Store a memory fragment inside a specific room. */
  storeMemory(roomId: string, fragment: MemoryFragment): void {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error(`Room ${roomId} not found in palace`);
    fragment.salience = this.computeSalience(fragment);
    room.fragments.push(fragment);
    room.fragments.sort((a, b) => b.salience - a.salience);
  }

  /** Retrieve top-N memories across all rooms ranked by φ-weighted salience. */
  retrieve(query: number[], topN = 10): { roomId: string; fragment: MemoryFragment; score: number }[] {
    const scored: { roomId: string; fragment: MemoryFragment; score: number }[] = [];

    for (const [roomId, room] of this.rooms) {
      for (const frag of room.fragments) {
        const cosSim = this.cosineSimilarity(query, frag.embedding);
        const score = cosSim * frag.salience * (1 + room.phiIndex * PHI_INV);
        scored.push({ roomId, fragment: frag, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topN);
  }

  /** Walk adjacent rooms from a starting room using breadth-first traversal. */
  walkAdjacent(startRoomId: string, maxDepth = 3): Room[] {
    const visited = new Set<string>();
    const result: Room[] = [];
    const queue: { id: string; depth: number }[] = [{ id: startRoomId, depth: 0 }];

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      if (visited.has(id) || depth > maxDepth) continue;
      visited.add(id);
      const room = this.rooms.get(id);
      if (!room) continue;
      result.push(room);
      for (const adj of room.adjacency) {
        if (!visited.has(adj)) queue.push({ id: adj, depth: depth + 1 });
      }
    }
    return result;
  }

  private computeSalience(fragment: MemoryFragment): number {
    const age = (Date.now() - fragment.timestamp) / 3_600_000;
    const decay = Math.pow(PHI_INV, age / 24);
    const norm = Math.sqrt(fragment.embedding.reduce((s, v) => s + v * v, 0)) || 1;
    return decay * norm;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : dot / denom;
  }
}
