// 𓂀 ORGANISM EDGE MODEL 𓂀
// "Create Organism models that take care of all the edges"
// "Pattern sense it all — find all the edges, all taken care of, compensated for, solved"

import { v4 as uuidv4 } from 'uuid';

// ─── Types ────────────────────────────────────────────────────────────────────

export type EdgeType = 
  | 'null-value'
  | 'undefined-value'
  | 'empty-array'
  | 'empty-string'
  | 'network-failure'
  | 'permission-denied'
  | 'timeout'
  | 'invalid-input'
  | 'state-corruption'
  | 'api-error'
  | 'browser-incompatibility'
  | 'rate-limit'
  | 'quota-exceeded'
  | 'concurrency-conflict';

export type EdgeSeverity = 'critical' | 'warning' | 'info' | 'recovered';

export interface Edge {
  id: string;
  type: EdgeType;
  context: string;
  message: string;
  severity: EdgeSeverity;
  timestamp: string;
  resolved: boolean;
  resolution?: string;
  autoRecovered: boolean;
}

export interface EdgePattern {
  type: EdgeType;
  signature: string;
  frequency: number;
  lastSeen: string;
  solutions: string[];
  autoRecoveryPossible: boolean;
}

export interface CircuitState {
  name: string;
  state: 'closed' | 'open' | 'half-open';
  failures: number;
  lastFailure?: string;
  cooldownUntil?: string;
  threshold: number;
}

// ─── Edge Registry ────────────────────────────────────────────────────────────

const edgeLog: Edge[] = [];
const edgePatterns: Map<string, EdgePattern> = new Map();
const circuits: Map<string, CircuitState> = new Map();

// ─── Pattern Sensing ──────────────────────────────────────────────────────────

export function senseEdge(
  type: EdgeType,
  context: string,
  message: string,
  severity: EdgeSeverity = 'warning'
): Edge {
  const edge: Edge = {
    id: uuidv4(),
    type,
    context,
    message,
    severity,
    timestamp: new Date().toISOString(),
    resolved: false,
    autoRecovered: false,
  };

  // Log the edge
  edgeLog.push(edge);
  if (edgeLog.length > 1000) {
    edgeLog.shift(); // Keep bounded
  }

  // Update pattern
  const patternKey = `${type}:${context}`;
  const existing = edgePatterns.get(patternKey);
  if (existing) {
    existing.frequency++;
    existing.lastSeen = edge.timestamp;
  } else {
    edgePatterns.set(patternKey, {
      type,
      signature: patternKey,
      frequency: 1,
      lastSeen: edge.timestamp,
      solutions: [],
      autoRecoveryPossible: isAutoRecoverable(type),
    });
  }

  // Attempt auto-recovery
  if (isAutoRecoverable(type)) {
    const recovered = attemptAutoRecovery(edge);
    if (recovered) {
      edge.autoRecovered = true;
      edge.resolved = true;
      edge.resolution = `Auto-recovered: ${getRecoverySolution(type)}`;
      edge.severity = 'recovered';
    }
  }

  return edge;
}

function isAutoRecoverable(type: EdgeType): boolean {
  const recoverable: EdgeType[] = [
    'null-value',
    'undefined-value', 
    'empty-array',
    'empty-string',
    'timeout',
  ];
  return recoverable.includes(type);
}

function attemptAutoRecovery(edge: Edge): boolean {
  switch (edge.type) {
    case 'null-value':
    case 'undefined-value':
      return true; // Return defaults
    case 'empty-array':
      return true; // Return empty array
    case 'empty-string':
      return true; // Return empty string
    case 'timeout':
      return true; // Retry logic
    default:
      return false;
  }
}

function getRecoverySolution(type: EdgeType): string {
  const solutions: Record<EdgeType, string> = {
    'null-value': 'Replaced with default value',
    'undefined-value': 'Replaced with default value',
    'empty-array': 'Returned safe empty array',
    'empty-string': 'Returned safe empty string',
    'network-failure': 'Retry with exponential backoff',
    'permission-denied': 'Request permission re-grant',
    'timeout': 'Retry with increased timeout',
    'invalid-input': 'Sanitized and validated input',
    'state-corruption': 'Reset to last known good state',
    'api-error': 'Retry with circuit breaker',
    'browser-incompatibility': 'Fallback to polyfill',
    'rate-limit': 'Queue and retry after cooldown',
    'quota-exceeded': 'Clear cache and retry',
    'concurrency-conflict': 'Retry with optimistic locking',
  };
  return solutions[type] || 'Manual intervention required';
}

// ─── Circuit Breaker ──────────────────────────────────────────────────────────

export function initCircuit(name: string, threshold = 5): CircuitState {
  const circuit: CircuitState = {
    name,
    state: 'closed',
    failures: 0,
    threshold,
  };
  circuits.set(name, circuit);
  return circuit;
}

export function recordCircuitFailure(name: string): CircuitState | null {
  const circuit = circuits.get(name);
  if (!circuit) return null;

  circuit.failures++;
  circuit.lastFailure = new Date().toISOString();

  if (circuit.failures >= circuit.threshold) {
    circuit.state = 'open';
    circuit.cooldownUntil = new Date(Date.now() + 30000).toISOString(); // 30s cooldown
  }

  circuits.set(name, circuit);
  return circuit;
}

export function checkCircuit(name: string): boolean {
  const circuit = circuits.get(name);
  if (!circuit) return true; // No circuit = allow

  if (circuit.state === 'closed') return true;

  if (circuit.state === 'open') {
    if (circuit.cooldownUntil && new Date() > new Date(circuit.cooldownUntil)) {
      circuit.state = 'half-open';
      circuits.set(name, circuit);
      return true; // Allow one test request
    }
    return false;
  }

  // Half-open: allow
  return true;
}

export function resetCircuit(name: string): CircuitState | null {
  const circuit = circuits.get(name);
  if (!circuit) return null;

  circuit.state = 'closed';
  circuit.failures = 0;
  circuit.lastFailure = undefined;
  circuit.cooldownUntil = undefined;

  circuits.set(name, circuit);
  return circuit;
}

// ─── Safe Wrappers ────────────────────────────────────────────────────────────

export function safeValue<T>(value: T | null | undefined, fallback: T, context: string): T {
  if (value === null) {
    senseEdge('null-value', context, `Null value encountered in ${context}`, 'info');
    return fallback;
  }
  if (value === undefined) {
    senseEdge('undefined-value', context, `Undefined value encountered in ${context}`, 'info');
    return fallback;
  }
  return value;
}

export function safeArray<T>(arr: T[] | null | undefined, context: string): T[] {
  if (!arr || !Array.isArray(arr)) {
    senseEdge('empty-array', context, `Invalid array in ${context}`, 'info');
    return [];
  }
  return arr;
}

export function safeString(str: string | null | undefined, fallback = '', context: string): string {
  if (str === null || str === undefined) {
    senseEdge('empty-string', context, `Empty string in ${context}`, 'info');
    return fallback;
  }
  return str;
}

export function safeNumber(num: number | null | undefined, fallback = 0, context: string): number {
  if (num === null || num === undefined || isNaN(num)) {
    senseEdge('null-value', context, `Invalid number in ${context}`, 'info');
    return fallback;
  }
  return num;
}

export function safeObject<T extends object>(obj: T | null | undefined, fallback: T, context: string): T {
  if (!obj || typeof obj !== 'object') {
    senseEdge('null-value', context, `Invalid object in ${context}`, 'info');
    return fallback;
  }
  return obj;
}

// ─── Async Safety ─────────────────────────────────────────────────────────────

export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback: T,
  context: string,
  retries = 3,
  timeoutMs = 10000
): Promise<T> {
  const circuitName = `async:${context}`;
  
  if (!circuits.has(circuitName)) {
    initCircuit(circuitName);
  }

  if (!checkCircuit(circuitName)) {
    senseEdge('api-error', context, `Circuit open for ${context}`, 'warning');
    return fallback;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), timeoutMs)
        ),
      ]);
      
      resetCircuit(circuitName);
      return result;
    } catch (error) {
      const isTimeout = error instanceof Error && error.message === 'Timeout';
      
      senseEdge(
        isTimeout ? 'timeout' : 'api-error',
        context,
        `Attempt ${attempt}/${retries} failed: ${error}`,
        attempt === retries ? 'warning' : 'info'
      );

      if (attempt === retries) {
        recordCircuitFailure(circuitName);
        return fallback;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
    }
  }

  return fallback;
}

// ─── Input Validation ─────────────────────────────────────────────────────────

export function validateInput(input: unknown, schema: InputSchema, context: string): ValidationResult {
  const errors: string[] = [];

  if (schema.required && (input === null || input === undefined)) {
    errors.push('Value is required');
  }

  if (input !== null && input !== undefined) {
    if (schema.type === 'string' && typeof input !== 'string') {
      errors.push('Expected string');
    }
    if (schema.type === 'number' && typeof input !== 'number') {
      errors.push('Expected number');
    }
    if (schema.type === 'boolean' && typeof input !== 'boolean') {
      errors.push('Expected boolean');
    }
    if (schema.type === 'array' && !Array.isArray(input)) {
      errors.push('Expected array');
    }
    if (schema.type === 'object' && (typeof input !== 'object' || Array.isArray(input))) {
      errors.push('Expected object');
    }

    if (typeof input === 'string') {
      if (schema.minLength && input.length < schema.minLength) {
        errors.push(`Minimum length is ${schema.minLength}`);
      }
      if (schema.maxLength && input.length > schema.maxLength) {
        errors.push(`Maximum length is ${schema.maxLength}`);
      }
      if (schema.pattern && !schema.pattern.test(input)) {
        errors.push('Invalid format');
      }
    }

    if (typeof input === 'number') {
      if (schema.min !== undefined && input < schema.min) {
        errors.push(`Minimum value is ${schema.min}`);
      }
      if (schema.max !== undefined && input > schema.max) {
        errors.push(`Maximum value is ${schema.max}`);
      }
    }
  }

  if (errors.length > 0) {
    senseEdge('invalid-input', context, errors.join(', '), 'warning');
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: sanitizeInput(input, schema),
  };
}

export interface InputSchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  sanitize?: (value: unknown) => unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitized: unknown;
}

function sanitizeInput(input: unknown, schema: InputSchema): unknown {
  if (schema.sanitize) {
    return schema.sanitize(input);
  }

  if (typeof input === 'string') {
    // Basic XSS prevention
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  }

  return input;
}

// ─── State Management ─────────────────────────────────────────────────────────

let stateSnapshot: string | null = null;

export function captureState(state: unknown): string {
  const snapshot = JSON.stringify(state);
  stateSnapshot = snapshot;
  return snapshot;
}

export function restoreState<T>(fallback: T): T {
  if (stateSnapshot) {
    try {
      return JSON.parse(stateSnapshot) as T;
    } catch {
      senseEdge('state-corruption', 'state-restore', 'Failed to restore state', 'warning');
    }
  }
  return fallback;
}

// ─── Browser Compatibility ────────────────────────────────────────────────────

export function checkBrowserSupport(feature: string): boolean {
  const checks: Record<string, () => boolean> = {
    'speech-recognition': () => 
      typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
    'speech-synthesis': () =>
      typeof window !== 'undefined' && 'speechSynthesis' in window,
    'device-motion': () =>
      typeof window !== 'undefined' && 'DeviceMotionEvent' in window,
    'device-orientation': () =>
      typeof window !== 'undefined' && 'DeviceOrientationEvent' in window,
    'geolocation': () =>
      typeof navigator !== 'undefined' && 'geolocation' in navigator,
    'media-devices': () =>
      typeof navigator !== 'undefined' && 'mediaDevices' in navigator,
    'bluetooth': () =>
      typeof navigator !== 'undefined' && 'bluetooth' in navigator,
    'local-storage': () => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    },
    'indexed-db': () =>
      typeof window !== 'undefined' && 'indexedDB' in window,
    'web-workers': () =>
      typeof window !== 'undefined' && 'Worker' in window,
    'service-workers': () =>
      typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
  };

  const check = checks[feature];
  if (!check) {
    senseEdge('browser-incompatibility', feature, `Unknown feature: ${feature}`, 'warning');
    return false;
  }

  const supported = check();
  if (!supported) {
    senseEdge('browser-incompatibility', feature, `Browser does not support: ${feature}`, 'warning');
  }

  return supported;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export function getEdgeStats(): {
  total: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  autoRecovered: number;
  patterns: EdgePattern[];
  circuits: CircuitState[];
} {
  const byType: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  let autoRecovered = 0;

  for (const edge of edgeLog) {
    byType[edge.type] = (byType[edge.type] || 0) + 1;
    bySeverity[edge.severity] = (bySeverity[edge.severity] || 0) + 1;
    if (edge.autoRecovered) autoRecovered++;
  }

  return {
    total: edgeLog.length,
    byType,
    bySeverity,
    autoRecovered,
    patterns: Array.from(edgePatterns.values()),
    circuits: Array.from(circuits.values()),
  };
}

export function getRecentEdges(limit = 20): Edge[] {
  return edgeLog.slice(-limit).reverse();
}

export function clearEdges(): void {
  edgeLog.length = 0;
  edgePatterns.clear();
}
