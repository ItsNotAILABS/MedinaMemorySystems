/**
 * @itsnotailabs/temporal-memory
 * Time-anchored memory: temporal indexing, decay functions, Fibonacci-interval consolidation.
 *
 * Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
 * Licensed under ISIL v1.1 — see LICENSE for details.
 * SAEIS enforcement: ACTIVE. SAT token binding: ENABLED.
 */

export const PHI = (1 + Math.sqrt(5)) / 2;

export interface TemporalRecord {
  id: string;
  content: string;
  createdAt: number;
  lastAccessed: number;
  accessCount: number;
  strength: number;
}

export class TemporalMemory {
  private records: Map<string, TemporalRecord> = new Map();
  private consolidationSchedule: number[] = [];

  constructor(private readonly decayHalfLifeHours = 24) {
    this.consolidationSchedule = this.buildFibonacciSchedule(20);
  }

  /** Store a new temporal record with the current timestamp. */
  store(id: string, content: string): TemporalRecord {
    const now = Date.now();
    const record: TemporalRecord = {
      id,
      content,
      createdAt: now,
      lastAccessed: now,
      accessCount: 1,
      strength: 1.0,
    };
    this.records.set(id, record);
    return record;
  }

  /** Recall a record and strengthen it via temporal reinforcement. */
  recall(id: string): TemporalRecord | null {
    const record = this.records.get(id);
    if (!record) return null;
    record.lastAccessed = Date.now();
    record.accessCount++;
    record.strength = this.computeStrength(record);
    return record;
  }

  /** Apply exponential decay to all records and prune those below threshold. */
  applyDecay(pruneThreshold = 0.01): { pruned: string[]; remaining: number } {
    const pruned: string[] = [];
    for (const [id, record] of this.records) {
      record.strength = this.computeStrength(record);
      if (record.strength < pruneThreshold) {
        this.records.delete(id);
        pruned.push(id);
      }
    }
    return { pruned, remaining: this.records.size };
  }

  /** Consolidate memories at Fibonacci-spaced intervals from a reference time. */
  consolidate(referenceTime: number): TemporalRecord[] {
    const consolidated: TemporalRecord[] = [];
    const windows = this.consolidationSchedule.map((h) => referenceTime - h * 3_600_000);

    for (const record of this.records.values()) {
      for (let i = 0; i < windows.length - 1; i++) {
        if (record.createdAt <= windows[i] && record.createdAt > windows[i + 1]) {
          record.strength *= 1 + (1 / PHI);
          consolidated.push(record);
          break;
        }
      }
    }
    return consolidated;
  }

  /** Retrieve the top-N strongest memories ordered by temporal strength. */
  retrieveStrongest(topN = 10): TemporalRecord[] {
    const all = Array.from(this.records.values());
    for (const r of all) r.strength = this.computeStrength(r);
    all.sort((a, b) => b.strength - a.strength);
    return all.slice(0, topN);
  }

  private computeStrength(record: TemporalRecord): number {
    const ageHours = (Date.now() - record.lastAccessed) / 3_600_000;
    const decay = Math.pow(0.5, ageHours / this.decayHalfLifeHours);
    const rehearsalBoost = Math.log2(1 + record.accessCount);
    return decay * rehearsalBoost;
  }

  private buildFibonacciSchedule(count: number): number[] {
    const fibs: number[] = [1, 1];
    for (let i = 2; i < count; i++) fibs.push(fibs[i - 1] + fibs[i - 2]);
    return fibs;
  }
}
