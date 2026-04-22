/**
 * @itsnotailabs/knowledge-graph
 * Sovereign knowledge graph: entity/relation store, φ-weighted edge ranking, inference engine.
 *
 * Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
 * Licensed under ISIL v1.1 — see LICENSE for details.
 * SAEIS enforcement: ACTIVE. SAT token binding: ENABLED.
 */

export const PHI = (1 + Math.sqrt(5)) / 2;

export interface Entity {
  id: string;
  type: string;
  properties: Record<string, unknown>;
}

export interface Relation {
  source: string;
  target: string;
  type: string;
  weight: number;
  metadata: Record<string, unknown>;
}

export interface InferenceResult {
  path: string[];
  confidence: number;
  relations: Relation[];
}

export class KnowledgeGraph {
  private entities: Map<string, Entity> = new Map();
  private relations: Relation[] = [];
  private adjacency: Map<string, Relation[]> = new Map();

  /** Add an entity node to the graph. */
  addEntity(id: string, type: string, properties: Record<string, unknown> = {}): Entity {
    const entity: Entity = { id, type, properties };
    this.entities.set(id, entity);
    if (!this.adjacency.has(id)) this.adjacency.set(id, []);
    return entity;
  }

  /** Add a φ-weighted relation edge between two entities. */
  addRelation(source: string, target: string, type: string, weight = 1.0, metadata: Record<string, unknown> = {}): Relation {
    if (!this.entities.has(source)) throw new Error(`Entity ${source} not found`);
    if (!this.entities.has(target)) throw new Error(`Entity ${target} not found`);

    const phiWeight = weight * (1 / PHI);
    const relation: Relation = { source, target, type, weight: phiWeight, metadata };
    this.relations.push(relation);
    this.adjacency.get(source)!.push(relation);
    return relation;
  }

  /** Rank all edges emanating from an entity by φ-weighted score descending. */
  rankEdges(entityId: string): Relation[] {
    const edges = this.adjacency.get(entityId);
    if (!edges) return [];
    return [...edges].sort((a, b) => b.weight - a.weight);
  }

  /** Run BFS-based inference to find the strongest path between two entities. */
  infer(sourceId: string, targetId: string, maxDepth = 5): InferenceResult | null {
    const visited = new Set<string>();
    const queue: { path: string[]; rels: Relation[]; confidence: number }[] = [
      { path: [sourceId], rels: [], confidence: 1.0 },
    ];

    let bestResult: InferenceResult | null = null;

    while (queue.length > 0) {
      const current = queue.shift()!;
      const node = current.path[current.path.length - 1];

      if (node === targetId) {
        if (!bestResult || current.confidence > bestResult.confidence) {
          bestResult = { path: current.path, confidence: current.confidence, relations: current.rels };
        }
        continue;
      }

      if (current.path.length > maxDepth || visited.has(node)) continue;
      visited.add(node);

      const edges = this.adjacency.get(node) ?? [];
      for (const edge of edges) {
        const nextConf = current.confidence * edge.weight;
        queue.push({
          path: [...current.path, edge.target],
          rels: [...current.rels, edge],
          confidence: nextConf,
        });
      }
    }

    return bestResult;
  }

  /** Query all entities of a given type. */
  queryByType(type: string): Entity[] {
    return Array.from(this.entities.values()).filter((e) => e.type === type);
  }
}
