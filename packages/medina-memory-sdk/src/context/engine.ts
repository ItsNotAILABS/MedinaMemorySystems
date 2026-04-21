/**
 * Sub-SDK 5: Context Engine
 * Build applications that truly understand context.
 * Tracks context windows, resolves references, and maintains coherence.
 */

export interface ContextFrame {
  id: string;
  topic: string;
  entities: Map<string, unknown>;
  facts: string[];
  openQuestions: string[];
  timestamp: number;
  depth: number;
}

export interface ContextResolution {
  resolved: boolean;
  value?: unknown;
  confidence: number;
  source: 'frame' | 'history' | 'inference' | 'none';
}

export class ContextEngine {
  private frames: ContextFrame[] = [];
  private maxFrames: number;

  constructor(options: { maxFrames?: number } = {}) {
    this.maxFrames = options.maxFrames ?? 20;
  }

  /**
   * Push a new context frame onto the stack.
   */
  push(topic: string): ContextFrame {
    const frame: ContextFrame = {
      id: `ctx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      topic,
      entities: new Map(),
      facts: [],
      openQuestions: [],
      timestamp: Date.now(),
      depth: this.frames.length,
    };
    this.frames.push(frame);
    if (this.frames.length > this.maxFrames) {
      this.frames.shift();
    }
    return frame;
  }

  /**
   * Pop the current context frame.
   */
  pop(): ContextFrame | undefined {
    return this.frames.pop();
  }

  /**
   * Get the current (topmost) context frame.
   */
  current(): ContextFrame | undefined {
    return this.frames[this.frames.length - 1];
  }

  /**
   * Assert an entity into the current context.
   */
  assertEntity(key: string, value: unknown): void {
    const frame = this.current();
    if (frame) frame.entities.set(key, value);
  }

  /**
   * Assert a fact into the current context.
   */
  assertFact(fact: string): void {
    const frame = this.current();
    if (frame && !frame.facts.includes(fact)) frame.facts.push(fact);
  }

  /**
   * Resolve a reference against the context stack.
   */
  resolve(key: string): ContextResolution {
    // Search from top of stack downward
    for (let i = this.frames.length - 1; i >= 0; i--) {
      const frame = this.frames[i];
      if (frame.entities.has(key)) {
        return { resolved: true, value: frame.entities.get(key), confidence: 1 - (this.frames.length - 1 - i) * 0.1, source: 'frame' };
      }
    }
    return { resolved: false, confidence: 0, source: 'none' };
  }

  /**
   * Get full context summary.
   */
  summary(): { depth: number; topics: string[]; entityCount: number; factCount: number } {
    return {
      depth: this.frames.length,
      topics: this.frames.map(f => f.topic),
      entityCount: this.frames.reduce((sum, f) => sum + f.entities.size, 0),
      factCount: this.frames.reduce((sum, f) => sum + f.facts.length, 0),
    };
  }
}
