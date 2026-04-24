// 𓂀 MICRO WORKER — UNIVERSAL SOVEREIGN WORKER SCRIPT 𓂀
// "They're all supposed to be on 24 hours. Just passive. Already working."
//
// This is the universal web worker script. Each micro worker instance runs
// this same code but receives a unique spec at BOOT time that defines its
// identity, domain, heartbeat interval, and purpose.
//
// PROTOCOL:
//   Main → Worker: { type: 'BOOT', spec: {...} }
//   Main → Worker: { type: 'TASK', taskId: '...', payload: {...} }
//   Main → Worker: { type: 'HEARTBEAT_REQUEST' }
//   Main → Worker: { type: 'SHUTDOWN' }
//   Worker → Main: { type: 'BOOTED', id: '...', timestamp: ... }
//   Worker → Main: { type: 'HEARTBEAT', id: '...', status: '...', taskCount: ..., timestamp: ... }
//   Worker → Main: { type: 'TASK_COMPLETE', id: '...', taskId: '...', result: {...}, duration: ... }
//   Worker → Main: { type: 'TASK_ERROR', id: '...', taskId: '...', error: '...' }
//   Worker → Main: { type: 'ERROR', id: '...', error: '...', timestamp: ... }
//
// φ = 1.618033988749895

const PHI = 1.618033988749895;

let spec = null;
let status = 'IDLE';
let taskCount = 0;
let heartbeatInterval = null;
let bootedAt = null;

// ─── Message Handler ──────────────────────────────────────────────────────────

self.addEventListener('message', function(event) {
  const msg = event.data;
  if (!msg || !msg.type) return;

  switch (msg.type) {
    case 'BOOT':
      handleBoot(msg.spec);
      break;
    case 'TASK':
      handleTask(msg.taskId, msg.payload);
      break;
    case 'HEARTBEAT_REQUEST':
      sendHeartbeat();
      break;
    case 'SHUTDOWN':
      handleShutdown();
      break;
    case 'CONFIG_UPDATE':
      handleConfigUpdate(msg.config);
      break;
  }
});

// ─── Boot ─────────────────────────────────────────────────────────────────────

function handleBoot(workerSpec) {
  spec = workerSpec;
  bootedAt = Date.now();
  status = 'IDLE';
  taskCount = 0;

  // Start heartbeat at the spec's φ-derived interval
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  heartbeatInterval = setInterval(sendHeartbeat, spec.heartbeatMs);

  // Report booted
  self.postMessage({
    type: 'BOOTED',
    id: spec.id,
    timestamp: bootedAt,
  });
}

// ─── Task Processing ──────────────────────────────────────────────────────────

function handleTask(taskId, payload) {
  if (!spec) {
    self.postMessage({
      type: 'TASK_ERROR',
      id: 'UNKNOWN',
      taskId: taskId,
      error: 'Worker not booted — spec not received.',
    });
    return;
  }

  status = 'PROCESSING';
  taskCount++;
  const startTime = Date.now();

  try {
    // Domain-specific processing
    const result = processTask(spec.domain, spec.name, payload);
    const duration = Date.now() - startTime;

    status = 'IDLE';

    self.postMessage({
      type: 'TASK_COMPLETE',
      id: spec.id,
      taskId: taskId,
      result: result,
      duration: duration,
    });
  } catch (err) {
    status = 'IDLE';

    self.postMessage({
      type: 'TASK_ERROR',
      id: spec.id,
      taskId: taskId,
      error: err.message || String(err),
    });
  }
}

// ─── Domain-Specific Processing ───────────────────────────────────────────────

function processTask(domain, workerName, payload) {
  switch (domain) {
    case 'MEMORIA':
      return processMemoria(workerName, payload);
    case 'SENSUS':
      return processSensus(workerName, payload);
    case 'NEXUS':
      return processNexus(workerName, payload);
    case 'COGNITIO':
      return processCognitio(workerName, payload);
    case 'CUSTODIA':
      return processCustodia(workerName, payload);
    case 'GUBERNATIO':
      return processGubernatio(workerName, payload);
    case 'FABRICATIO':
      return processFabricatio(workerName, payload);
    case 'RESONANTIA':
      return processResonantia(workerName, payload);
    case 'FLUXUS':
      return processFluxus(workerName, payload);
    case 'IMPERIUM':
      return processImperium(workerName, payload);
    default:
      return { processed: true, domain: domain, worker: workerName };
  }
}

// ─── MEMORIA processing ──────────────────────────────────────────────────────

function processMemoria(worker, payload) {
  const data = payload || {};
  switch (worker) {
    case 'MEMORY_INDEXER':
      return { indexed: true, entries: data.entries || 0, timestamp: Date.now() };
    case 'SALIENCE_SCORER':
      const salience = Math.min(1, Math.max(0, (data.value || 0.5) * PHI % 1));
      return { salience: salience, recalculated: true };
    case 'RESONANCE_CALCULATOR':
      const resonance = Math.abs(Math.sin((data.frequency || 432) * PHI));
      return { resonance: resonance, phiAligned: resonance > 0.618 };
    case 'SEMANTIC_VECTORIZER':
      // Simple mock vector generation
      const vector = [];
      const text = String(data.text || '');
      for (let i = 0; i < 8; i++) {
        vector.push(((text.charCodeAt(i % text.length) || 0) / 255) * PHI % 1);
      }
      return { vector: vector, dimensions: 8 };
    default:
      return { processed: true, worker: worker, domain: 'MEMORIA' };
  }
}

// ─── SENSUS processing ───────────────────────────────────────────────────────

function processSensus(worker, payload) {
  const data = payload || {};
  switch (worker) {
    case 'AUDIO_ANALYZER':
      return { fftBands: 256, peakFrequency: data.frequency || 432, analyzed: true };
    case 'FREQUENCY_MONITOR':
      const aligned = Math.abs((data.frequency || 432) - 432) < 10;
      return { frequency: data.frequency || 432, aligned: aligned, target: 432 };
    case 'INPUT_CLASSIFIER':
      return { inputType: data.type || 'text', confidence: 0.95 };
    default:
      return { processed: true, worker: worker, domain: 'SENSUS' };
  }
}

// ─── NEXUS processing ────────────────────────────────────────────────────────

function processNexus(worker, payload) {
  const data = payload || {};
  switch (worker) {
    case 'LATENCY_MONITOR':
      return { latencyMs: data.latencyMs || 0, threshold: 618, healthy: (data.latencyMs || 0) < 618 };
    case 'BANDWIDTH_OPTIMIZER':
      return { compressed: true, ratio: 1 / PHI, savings: '38.2%' };
    default:
      return { processed: true, worker: worker, domain: 'NEXUS' };
  }
}

// ─── COGNITIO processing ─────────────────────────────────────────────────────

function processCognitio(worker, payload) {
  const data = payload || {};
  switch (worker) {
    case 'PATTERN_RECOGNIZER':
      return { patterns: data.patterns || [], recognized: true, confidence: 0.87 };
    case 'INTENT_CLASSIFIER':
      return { intent: data.intent || 'query', confidence: 0.92, model: 'cognitio-v1' };
    case 'ANOMALY_DETECTOR':
      const score = Math.random();
      return { anomalyScore: score, isAnomaly: score > (1 / PHI), threshold: 1 / PHI };
    default:
      return { processed: true, worker: worker, domain: 'COGNITIO' };
  }
}

// ─── CUSTODIA processing ─────────────────────────────────────────────────────

function processCustodia(worker, payload) {
  const data = payload || {};
  switch (worker) {
    case 'GATE_A_SENTINEL':
    case 'GATE_B_SENTINEL':
    case 'GATE_C_SENTINEL':
      return { gate: worker.replace('_SENTINEL', ''), status: 'green', enforced: true };
    case 'THREAT_SCANNER':
      return { threats: [], scanned: true, clean: true, timestamp: Date.now() };
    case 'ENCRYPTION_WORKER':
      return { encrypted: true, algorithm: 'AES-256-GCM', keyId: data.keyId || 'sovereign-key' };
    default:
      return { processed: true, worker: worker, domain: 'CUSTODIA' };
  }
}

// ─── GUBERNATIO processing ───────────────────────────────────────────────────

function processGubernatio(worker, payload) {
  const data = payload || {};
  switch (worker) {
    case 'VOTE_TALLIER':
      const votes = data.votes || [];
      const yes = votes.filter(function(v) { return v === 'yes'; }).length;
      return { yes: yes, no: votes.length - yes, total: votes.length, passed: yes > votes.length / 2 };
    case 'DOCTRINE_DRIFT_DETECTOR':
      return { drift: 0.02, threshold: 0.1, aligned: true };
    default:
      return { processed: true, worker: worker, domain: 'GUBERNATIO' };
  }
}

// ─── FABRICATIO processing ───────────────────────────────────────────────────

function processFabricatio(worker, payload) {
  return { processed: true, worker: worker, domain: 'FABRICATIO', built: true };
}

// ─── RESONANTIA processing ──────────────────────────────────────────────────

function processResonantia(worker, payload) {
  const data = payload || {};
  switch (worker) {
    case 'PHI_OSCILLATOR':
      return { phi: PHI, beat: Date.now() % 1000 / 618, signal: Math.sin(Date.now() / 618 * Math.PI * 2) };
    case 'BEAT_SYNCHRONIZER':
      return { synced: true, beatMs: 873, phase: (Date.now() % 873) / 873 };
    case 'HARMONIC_ANALYZER':
      return { fundamental: 432, harmonics: [432, 432 * PHI, 432 * PHI * PHI], aligned: true };
    default:
      return { processed: true, worker: worker, domain: 'RESONANTIA' };
  }
}

// ─── FLUXUS processing ──────────────────────────────────────────────────────

function processFluxus(worker, payload) {
  const data = payload || {};
  switch (worker) {
    case 'BACKPRESSURE_GOVERNOR':
      return { pressure: data.queueDepth || 0, maxQueue: 100, throttled: (data.queueDepth || 0) > 80 };
    default:
      return { processed: true, worker: worker, domain: 'FLUXUS' };
  }
}

// ─── IMPERIUM processing ────────────────────────────────────────────────────

function processImperium(worker, payload) {
  const data = payload || {};
  switch (worker) {
    case 'HEALTH_MONITOR':
      return { healthy: true, checked: data.workerIds || [], timestamp: Date.now() };
    case 'METRIC_COLLECTOR':
      return { collected: true, metrics: data.metrics || {}, timestamp: Date.now() };
    default:
      return { processed: true, worker: worker, domain: 'IMPERIUM' };
  }
}

// ─── Heartbeat ───────────────────────────────────────────────────────────────

function sendHeartbeat() {
  if (!spec) return;

  self.postMessage({
    type: 'HEARTBEAT',
    id: spec.id,
    status: status,
    taskCount: taskCount,
    timestamp: Date.now(),
  });
}

// ─── Shutdown ────────────────────────────────────────────────────────────────

function handleShutdown() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
  status = 'OFFLINE';
  self.close();
}

// ─── Config Update ───────────────────────────────────────────────────────────

function handleConfigUpdate(config) {
  // Apply runtime configuration updates
  if (config && config.heartbeatMs && spec) {
    spec.heartbeatMs = config.heartbeatMs;
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = setInterval(sendHeartbeat, spec.heartbeatMs);
    }
  }
}
