// PROPRIETARY — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE.
// Unauthorized use, reproduction, or distribution strictly prohibited.
/**
 * Sub-SDK 1: Spatial Memory
 * Memory entries located in spherical coordinate space.
 */

export interface SpatialCoordinate {
  theta: number;  // 0–360 angular position
  phi: number;    // 0–180 elevation
  depth: number;  // layer depth
  ring: number;   // macro ring 1–12
  beat: number;   // temporal beat
}

export interface SpatialMemoryEntry {
  id: string;
  content: string;
  coordinates: SpatialCoordinate;
  salience: number;
  tags: string[];
  createdAt: number;
}

export class SpatialMemory {
  private entries: Map<string, SpatialMemoryEntry> = new Map();

  store(content: string, coordinates?: Partial<SpatialCoordinate>, tags: string[] = []): SpatialMemoryEntry {
    const id = `sm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const entry: SpatialMemoryEntry = {
      id,
      content,
      coordinates: {
        theta: coordinates?.theta ?? Math.random() * 360,
        phi: coordinates?.phi ?? Math.random() * 180,
        depth: coordinates?.depth ?? 1,
        ring: coordinates?.ring ?? 1,
        beat: coordinates?.beat ?? this.entries.size + 1,
      },
      salience: 0.5 + Math.random() * 0.5,
      tags,
      createdAt: Date.now(),
    };
    this.entries.set(id, entry);
    return entry;
  }

  findByRing(ring: number): SpatialMemoryEntry[] {
    return Array.from(this.entries.values()).filter(e => e.coordinates.ring === ring);
  }

  findNearby(coord: SpatialCoordinate, radius: number): SpatialMemoryEntry[] {
    return Array.from(this.entries.values()).filter(e => {
      const dTheta = Math.abs(e.coordinates.theta - coord.theta);
      const dPhi = Math.abs(e.coordinates.phi - coord.phi);
      return Math.sqrt(dTheta * dTheta + dPhi * dPhi) <= radius;
    });
  }

  getAll(): SpatialMemoryEntry[] {
    return Array.from(this.entries.values()).sort((a, b) => b.salience - a.salience);
  }
}
