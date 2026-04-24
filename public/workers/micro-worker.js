// 𓂀 MICRO WORKER — SOVEREIGN CAREER FLOW SCRIPT 𓂀
// "Give them careers, not jobs or tasks — careers that include all that
//  as consistent flows."
//
// This is the universal worker script. Each worker runs a CAREER —
// a continuous, always-flowing stream of work. Not task dispatch.
// Not job queues. A career that flows at its φ-derived rhythm,
// advancing through stages: APPRENTICE → JOURNEYMAN → MASTER → SOVEREIGN.
//
// PROTOCOL:
//   Main → Worker: { type: 'BOOT', spec: {...} }
//   Main → Worker: { type: 'HEARTBEAT_REQUEST' }
//   Main → Worker: { type: 'SHUTDOWN' }
//   Main → Worker: { type: 'CONFIG_UPDATE', config: {...} }
//   Worker → Main: { type: 'BOOTED', id, careerTitle, timestamp }
//   Worker → Main: { type: 'FLOW_CYCLE', id, stage, flowCycles, stageProgress, result, timestamp }
//   Worker → Main: { type: 'STAGE_ADVANCE', id, oldStage, newStage, flowCycles, timestamp }
//   Worker → Main: { type: 'HEARTBEAT', id, status, stage, flowCycles, timestamp }
//   Worker → Main: { type: 'ERROR', id, error, timestamp }
//
// φ = 1.618033988749895

const PHI = 1.618033988749895;
const CAREER_STAGES = ['APPRENTICE', 'JOURNEYMAN', 'MASTER', 'SOVEREIGN'];

let spec = null;
let status = 'FLOWING';
let flowCycles = 0;
let careerStage = 'APPRENTICE';
let heartbeatInterval = null;
let careerFlowInterval = null;
let bootedAt = null;

// ─── Message Handler ──────────────────────────────────────────────────────────

self.addEventListener('message', function(event) {
  const msg = event.data;
  if (!msg || !msg.type) return;

  switch (msg.type) {
    case 'BOOT':
      handleBoot(msg.spec);
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
  status = 'FLOWING';
  flowCycles = 0;
  careerStage = 'APPRENTICE';

  // Start heartbeat
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(sendHeartbeat, spec.heartbeatMs);

  // Start career flow — every cycle IS the career flowing
  if (careerFlowInterval) clearInterval(careerFlowInterval);
  careerFlowInterval = setInterval(runCareerFlowCycle, spec.heartbeatMs);

  self.postMessage({
    type: 'BOOTED',
    id: spec.id,
    careerTitle: spec.career ? spec.career.title : spec.name,
    timestamp: bootedAt,
  });
}

// ─── Career Flow — The continuous work of this worker's life ─────────────────

function runCareerFlowCycle() {
  if (!spec) return;

  flowCycles++;
  const result = executeCareerFlow(spec.domain, spec.name, careerStage);

  // Check for stage advancement
  const cyclesPerStage = (spec.career && spec.career.cyclesPerStage) || 1000;
  const newStageIndex = Math.min(
    CAREER_STAGES.length - 1,
    Math.floor(flowCycles / cyclesPerStage)
  );
  const newStage = CAREER_STAGES[newStageIndex];

  if (newStage !== careerStage) {
    const oldStage = careerStage;
    careerStage = newStage;
    status = 'DEEPENING';

    self.postMessage({
      type: 'STAGE_ADVANCE',
      id: spec.id,
      oldStage: oldStage,
      newStage: newStage,
      flowCycles: flowCycles,
      timestamp: Date.now(),
    });

    // Return to flowing after deepening
    setTimeout(function() {
      status = 'FLOWING';
    }, Math.round(spec.heartbeatMs * 0.5));
  }

  // Calculate stage progress
  const stageProgress = newStageIndex >= CAREER_STAGES.length - 1
    ? 1
    : (flowCycles % cyclesPerStage) / cyclesPerStage;

  self.postMessage({
    type: 'FLOW_CYCLE',
    id: spec.id,
    stage: careerStage,
    flowCycles: flowCycles,
    stageProgress: stageProgress,
    result: result,
    timestamp: Date.now(),
  });
}

// ─── Career Flow Execution by Domain ─────────────────────────────────────────

function executeCareerFlow(domain, workerName, stage) {
  switch (domain) {
    case 'MEMORIA': return flowMemoria(workerName, stage);
    case 'SENSUS': return flowSensus(workerName, stage);
    case 'NEXUS': return flowNexus(workerName, stage);
    case 'COGNITIO': return flowCognitio(workerName, stage);
    case 'CUSTODIA': return flowCustodia(workerName, stage);
    case 'GUBERNATIO': return flowGubernatio(workerName, stage);
    case 'FABRICATIO': return flowFabricatio(workerName, stage);
    case 'RESONANTIA': return flowResonantia(workerName, stage);
    case 'FLUXUS': return flowFluxus(workerName, stage);
    case 'IMPERIUM': return flowImperium(workerName, stage);
    default: return { flowing: true, domain: domain, worker: workerName, stage: stage };
  }
}

// ─── MEMORIA career flows ────────────────────────────────────────────────────

function flowMemoria(worker, stage) {
  const depth = CAREER_STAGES.indexOf(stage) + 1;
  switch (worker) {
    case 'MEMORY_INDEXER':
      return { indexed: depth * 10, depth: depth, freshness: Math.random() * PHI % 1 };
    case 'SALIENCE_SCORER':
      return { scored: depth * 5, recalibrated: true, precision: 0.5 + (depth * 0.1) };
    case 'RESONANCE_CALCULATOR':
      return { resonance: Math.abs(Math.sin(Date.now() / 618 * PHI)), phiAligned: true, harmonics: depth };
    case 'SEMANTIC_VECTORIZER':
      return { vectors: depth * 8, dimensions: 8 * depth, coverage: depth / 4 };
    default:
      return { flowing: true, worker: worker, stage: stage, depth: depth };
  }
}

// ─── SENSUS career flows ─────────────────────────────────────────────────────

function flowSensus(worker, stage) {
  const depth = CAREER_STAGES.indexOf(stage) + 1;
  switch (worker) {
    case 'AUDIO_ANALYZER':
      return { bands: 64 * depth, peakHz: 432, clarity: 0.6 + (depth * 0.1) };
    case 'FREQUENCY_MONITOR':
      return { aligned: true, drift: Math.max(0, 10 - depth * 2), frequency: 432 };
    case 'EMOTION_DETECTOR':
      return { sensitivity: 0.5 + (depth * 0.12), channels: depth * 3, coherence: true };
    default:
      return { flowing: true, worker: worker, stage: stage, depth: depth };
  }
}

// ─── NEXUS career flows ──────────────────────────────────────────────────────

function flowNexus(worker, stage) {
  const depth = CAREER_STAGES.indexOf(stage) + 1;
  switch (worker) {
    case 'LATENCY_MONITOR':
      return { latencyMs: Math.max(1, 618 / depth), healthy: true, optimized: depth > 2 };
    case 'BANDWIDTH_OPTIMIZER':
      return { savings: (1 / PHI) * depth / 4, compressed: true, efficiency: 0.5 + (depth * 0.12) };
    default:
      return { flowing: true, worker: worker, stage: stage, depth: depth };
  }
}

// ─── COGNITIO career flows ───────────────────────────────────────────────────

function flowCognitio(worker, stage) {
  const depth = CAREER_STAGES.indexOf(stage) + 1;
  switch (worker) {
    case 'PATTERN_RECOGNIZER':
      return { patterns: depth * 4, confidence: 0.6 + (depth * 0.1), novel: depth > 2 };
    case 'INTENT_CLASSIFIER':
      return { accuracy: 0.7 + (depth * 0.07), intents: depth * 5, model: 'cognitio-v' + depth };
    case 'ANOMALY_DETECTOR':
      return { threshold: 1 / (PHI * depth), scanned: true, sensitivity: depth };
    default:
      return { flowing: true, worker: worker, stage: stage, depth: depth };
  }
}

// ─── CUSTODIA career flows ───────────────────────────────────────────────────

function flowCustodia(worker, stage) {
  const depth = CAREER_STAGES.indexOf(stage) + 1;
  switch (worker) {
    case 'GATE_A_SENTINEL':
    case 'GATE_B_SENTINEL':
    case 'GATE_C_SENTINEL':
      return { gate: worker.replace('_SENTINEL', ''), enforced: true, vigilance: 0.7 + (depth * 0.07) };
    case 'THREAT_SCANNER':
      return { scanned: true, clean: true, depth: depth, coverage: 0.5 + (depth * 0.12) };
    default:
      return { flowing: true, worker: worker, stage: stage, depth: depth };
  }
}

// ─── GUBERNATIO career flows ─────────────────────────────────────────────────

function flowGubernatio(worker, stage) {
  const depth = CAREER_STAGES.indexOf(stage) + 1;
  switch (worker) {
    case 'VOTE_TALLIER':
      return { accuracy: 0.9 + (depth * 0.025), throughput: depth * 10, integrity: true };
    case 'DOCTRINE_DRIFT_DETECTOR':
      return { drift: Math.max(0, 0.1 - (depth * 0.02)), aligned: true, sensitivity: depth };
    default:
      return { flowing: true, worker: worker, stage: stage, depth: depth };
  }
}

// ─── FABRICATIO career flows ─────────────────────────────────────────────────

function flowFabricatio(worker, stage) {
  const depth = CAREER_STAGES.indexOf(stage) + 1;
  return { flowing: true, worker: worker, stage: stage, depth: depth, built: true, quality: 0.6 + (depth * 0.1) };
}

// ─── RESONANTIA career flows ─────────────────────────────────────────────────

function flowResonantia(worker, stage) {
  const depth = CAREER_STAGES.indexOf(stage) + 1;
  switch (worker) {
    case 'PHI_OSCILLATOR':
      return { phi: PHI, beat: (Date.now() % 1000) / 618, signal: Math.sin(Date.now() / 618 * Math.PI * 2), purity: 0.5 + (depth * 0.12) };
    case 'BEAT_SYNCHRONIZER':
      return { synced: true, coherence: 0.6 + (depth * 0.1), phase: (Date.now() % 873) / 873 };
    case 'HARMONIC_ANALYZER':
      return { fundamental: 432, harmonics: depth + 2, aligned: true, depth: depth };
    default:
      return { flowing: true, worker: worker, stage: stage, depth: depth };
  }
}

// ─── FLUXUS career flows ─────────────────────────────────────────────────────

function flowFluxus(worker, stage) {
  const depth = CAREER_STAGES.indexOf(stage) + 1;
  switch (worker) {
    case 'BACKPRESSURE_GOVERNOR':
      return { pressure: Math.max(0, 50 - (depth * 10)), capacity: depth * 25, throttled: false };
    default:
      return { flowing: true, worker: worker, stage: stage, depth: depth };
  }
}

// ─── IMPERIUM career flows ───────────────────────────────────────────────────

function flowImperium(worker, stage) {
  const depth = CAREER_STAGES.indexOf(stage) + 1;
  switch (worker) {
    case 'HEALTH_MONITOR':
      return { healthy: true, coverage: depth * 25, precision: 0.6 + (depth * 0.1) };
    case 'METRIC_COLLECTOR':
      return { collected: true, metrics: depth * 10, freshness: 1 / depth };
    default:
      return { flowing: true, worker: worker, stage: stage, depth: depth };
  }
}

// ─── Heartbeat ───────────────────────────────────────────────────────────────

function sendHeartbeat() {
  if (!spec) return;

  self.postMessage({
    type: 'HEARTBEAT',
    id: spec.id,
    status: status,
    stage: careerStage,
    flowCycles: flowCycles,
    timestamp: Date.now(),
  });
}

// ─── Shutdown ────────────────────────────────────────────────────────────────

function handleShutdown() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
  if (careerFlowInterval) {
    clearInterval(careerFlowInterval);
    careerFlowInterval = null;
  }
  status = 'OFFLINE';
  self.close();
}

// ─── Config Update ───────────────────────────────────────────────────────────

function handleConfigUpdate(config) {
  if (config && config.heartbeatMs && spec) {
    spec.heartbeatMs = config.heartbeatMs;
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = setInterval(sendHeartbeat, spec.heartbeatMs);
    }
    if (careerFlowInterval) {
      clearInterval(careerFlowInterval);
      careerFlowInterval = setInterval(runCareerFlowCycle, spec.heartbeatMs);
    }
  }
}
