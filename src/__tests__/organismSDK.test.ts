/**
 * Comprehensive tests for src/lib/organismSDK.ts
 */
import {
  createOrganismSDK, startHeartbeat, stopHeartbeat, tickHeartbeat,
  absorbMultimodal, emitMultimodal, senseEdges, broadcastResonance,
  receiveResonance, runAutonomousCycle, connectSDKs, createMultimodalInput,
  type OrganismSDKInstance, type SDKConfig, type SDKMode, type MultimodalType,
  type SDKLinkType, type SDKEdgeSeverity, type MultimodalInput, type MultimodalOutput,
  type ResonancePulse, type SDKCycleReport, type DetectedEdge
} from '@/lib/organismSDK';
import { PHI, PHI_INVERSE, PHI_SQUARED, PHI_CUBED, BEAT_INTERVAL_MS, SOVEREIGN_FREQUENCY, COHERENCE_ICOSAHEDRAL, COHERENCE_E8 } from '@/lib/novaSovereignEncryption';

function makeConfig(overrides: Partial<SDKConfig> = {}): SDKConfig {
  return {
    organismId: 'test-org',
    initialMode: 'autonomous',
    edgeDomains: ['memory', 'encryption'],
    resonanceFrequency: 12.67,
    capabilities: ['absorption', 'emission'],
    ...overrides,
  };
}

const ALL_MODES: SDKMode[] = ['autonomous', 'guided', 'dormant', 'resonating', 'absorbing'];
const ALL_MULTIMODAL_TYPES: MultimodalType[] = ['text', 'voice', 'image', 'sensor', 'document'];
const ALL_LINK_TYPES: SDKLinkType[] = ['resonance', 'synaptic', 'sovereign', 'harmonic'];
const ALL_CAPABILITIES = ['absorption', 'emission', 'edge-sensing', 'resonance', 'governance', 'encryption', 'memory', 'consciousness'] as const;

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1: createOrganismSDK (~55 tests)
// ═══════════════════════════════════════════════════════════════════════════
describe('createOrganismSDK', () => {
  it('sets id from config.organismId', () => {
    const sdk = createOrganismSDK(makeConfig({ organismId: 'alpha' }));
    expect(sdk.id).toBe('alpha');
  });

  it('sets mode from config.initialMode', () => {
    const sdk = createOrganismSDK(makeConfig({ initialMode: 'guided' }));
    expect(sdk.mode).toBe('guided');
  });

  it('heartbeat.isAlive is false', () => {
    expect(createOrganismSDK(makeConfig()).heartbeat.isAlive).toBe(false);
  });

  it('heartbeat.beatNumber is 0', () => {
    expect(createOrganismSDK(makeConfig()).heartbeat.beatNumber).toBe(0);
  });

  it('heartbeat.intervalMs equals BEAT_INTERVAL_MS', () => {
    expect(createOrganismSDK(makeConfig()).heartbeat.intervalMs).toBe(BEAT_INTERVAL_MS);
  });

  it('heartbeat.phiPhase is 0', () => {
    expect(createOrganismSDK(makeConfig()).heartbeat.phiPhase).toBe(0);
  });

  it('heartbeat.coherence equals COHERENCE_ICOSAHEDRAL', () => {
    expect(createOrganismSDK(makeConfig()).heartbeat.coherence).toBe(COHERENCE_ICOSAHEDRAL);
  });

  it('heartbeat.frequency equals SOVEREIGN_FREQUENCY', () => {
    expect(createOrganismSDK(makeConfig()).heartbeat.frequency).toBe(SOVEREIGN_FREQUENCY);
  });

  it('heartbeat.timestamp is a valid ISO string', () => {
    const sdk = createOrganismSDK(makeConfig());
    expect(() => new Date(sdk.heartbeat.timestamp)).not.toThrow();
    expect(new Date(sdk.heartbeat.timestamp).toISOString()).toBe(sdk.heartbeat.timestamp);
  });

  it('absorptionChannel.queue is empty', () => {
    expect(createOrganismSDK(makeConfig()).absorptionChannel.queue).toEqual([]);
  });

  it('absorptionChannel.isOpen is true', () => {
    expect(createOrganismSDK(makeConfig()).absorptionChannel.isOpen).toBe(true);
  });

  it('absorptionChannel.totalAbsorbed is 0', () => {
    expect(createOrganismSDK(makeConfig()).absorptionChannel.totalAbsorbed).toBe(0);
  });

  it('absorptionChannel.phiCapacity equals PHI_CUBED * 100', () => {
    expect(createOrganismSDK(makeConfig()).absorptionChannel.phiCapacity).toBe(PHI_CUBED * 100);
  });

  it('absorptionChannel.acceptedTypes has 5 types', () => {
    expect(createOrganismSDK(makeConfig()).absorptionChannel.acceptedTypes).toHaveLength(5);
  });

  it.each(ALL_MULTIMODAL_TYPES)('absorptionChannel.acceptedTypes includes "%s"', (t) => {
    expect(createOrganismSDK(makeConfig()).absorptionChannel.acceptedTypes).toContain(t);
  });

  it('creates exactly 2 resonance ports', () => {
    expect(createOrganismSDK(makeConfig()).resonancePorts).toHaveLength(2);
  });

  it('first port frequency equals config.resonanceFrequency', () => {
    const sdk = createOrganismSDK(makeConfig({ resonanceFrequency: 7.5 }));
    expect(sdk.resonancePorts[0].frequency).toBe(7.5);
  });

  it('second port frequency equals config.resonanceFrequency * PHI', () => {
    const sdk = createOrganismSDK(makeConfig({ resonanceFrequency: 7.5 }));
    expect(sdk.resonancePorts[1].frequency).toBe(7.5 * PHI);
  });

  it('first port amplitude equals PHI_INVERSE', () => {
    expect(createOrganismSDK(makeConfig()).resonancePorts[0].amplitude).toBe(PHI_INVERSE);
  });

  it('second port amplitude equals PHI_INVERSE^2', () => {
    expect(createOrganismSDK(makeConfig()).resonancePorts[1].amplitude).toBe(PHI_INVERSE * PHI_INVERSE);
  });

  it('first port phase is 0', () => {
    expect(createOrganismSDK(makeConfig()).resonancePorts[0].phase).toBe(0);
  });

  it('second port phase is 180', () => {
    expect(createOrganismSDK(makeConfig()).resonancePorts[1].phase).toBe(180);
  });

  it('ports are not transmitting initially', () => {
    const sdk = createOrganismSDK(makeConfig());
    sdk.resonancePorts.forEach((p) => expect(p.isTransmitting).toBe(false));
  });

  it('ports are not receiving initially', () => {
    const sdk = createOrganismSDK(makeConfig());
    sdk.resonancePorts.forEach((p) => expect(p.isReceiving).toBe(false));
  });

  it('ports have empty connectedOrganisms', () => {
    const sdk = createOrganismSDK(makeConfig());
    sdk.resonancePorts.forEach((p) => expect(p.connectedOrganisms).toEqual([]));
  });

  it('edgeSensors length matches edgeDomains', () => {
    const sdk = createOrganismSDK(makeConfig({ edgeDomains: ['a', 'b', 'c'] }));
    expect(sdk.edgeSensors).toHaveLength(3);
  });

  it('sensor domains match edgeDomains order', () => {
    const sdk = createOrganismSDK(makeConfig({ edgeDomains: ['alpha', 'beta'] }));
    expect(sdk.edgeSensors[0].domain).toBe('alpha');
    expect(sdk.edgeSensors[1].domain).toBe('beta');
  });

  it('sensor sensitivity follows PHI_INVERSE + index*0.01', () => {
    const sdk = createOrganismSDK(makeConfig({ edgeDomains: ['a', 'b', 'c'] }));
    expect(sdk.edgeSensors[0].sensitivity).toBeCloseTo(PHI_INVERSE, 10);
    expect(sdk.edgeSensors[1].sensitivity).toBeCloseTo(PHI_INVERSE + 0.01, 10);
    expect(sdk.edgeSensors[2].sensitivity).toBeCloseTo(PHI_INVERSE + 0.02, 10);
  });

  it('sensors have edgesDetected = 0', () => {
    createOrganismSDK(makeConfig()).edgeSensors.forEach((s) => expect(s.edgesDetected).toBe(0));
  });

  it('sensors are active', () => {
    createOrganismSDK(makeConfig()).edgeSensors.forEach((s) => expect(s.isActive).toBe(true));
  });

  it('sensors severity is nominal', () => {
    createOrganismSDK(makeConfig()).edgeSensors.forEach((s) => expect(s.severity).toBe('nominal'));
  });

  it('capabilities length matches config', () => {
    const sdk = createOrganismSDK(makeConfig({ capabilities: ['absorption', 'emission', 'memory'] }));
    expect(sdk.capabilities).toHaveLength(3);
  });

  it('capability name follows pattern', () => {
    const sdk = createOrganismSDK(makeConfig({ capabilities: ['governance'] }));
    expect(sdk.capabilities[0].name).toBe('governance-capability');
  });

  it('capability version is 1.0.0-sovereign', () => {
    createOrganismSDK(makeConfig()).capabilities.forEach((c) => expect(c.version).toBe('1.0.0-sovereign'));
  });

  it('capabilities are active', () => {
    createOrganismSDK(makeConfig()).capabilities.forEach((c) => expect(c.isActive).toBe(true));
  });

  it('capability phiWeight is PHI_INVERSE', () => {
    createOrganismSDK(makeConfig()).capabilities.forEach((c) => expect(c.phiWeight).toBe(PHI_INVERSE));
  });

  it('links is empty', () => { expect(createOrganismSDK(makeConfig()).links).toEqual([]); });
  it('absorptionHistory is empty', () => { expect(createOrganismSDK(makeConfig()).absorptionHistory).toEqual([]); });
  it('emissionHistory is empty', () => { expect(createOrganismSDK(makeConfig()).emissionHistory).toEqual([]); });
  it('edgeHistory is empty', () => { expect(createOrganismSDK(makeConfig()).edgeHistory).toEqual([]); });
  it('cycleReports is empty', () => { expect(createOrganismSDK(makeConfig()).cycleReports).toEqual([]); });
  it('totalHeartbeats is 0', () => { expect(createOrganismSDK(makeConfig()).totalHeartbeats).toBe(0); });
  it('totalAbsorptions is 0', () => { expect(createOrganismSDK(makeConfig()).totalAbsorptions).toBe(0); });
  it('totalEmissions is 0', () => { expect(createOrganismSDK(makeConfig()).totalEmissions).toBe(0); });
  it('totalEdgesFound is 0', () => { expect(createOrganismSDK(makeConfig()).totalEdgesFound).toBe(0); });
  it('totalResonancesSent is 0', () => { expect(createOrganismSDK(makeConfig()).totalResonancesSent).toBe(0); });
  it('totalResonancesReceived is 0', () => { expect(createOrganismSDK(makeConfig()).totalResonancesReceived).toBe(0); });
  it('uptimeMs is 0', () => { expect(createOrganismSDK(makeConfig()).uptimeMs).toBe(0); });

  it('createdAt is a valid ISO timestamp', () => {
    const sdk = createOrganismSDK(makeConfig());
    expect(new Date(sdk.createdAt).toISOString()).toBe(sdk.createdAt);
  });

  it('lastTickAt equals createdAt', () => {
    const sdk = createOrganismSDK(makeConfig());
    expect(sdk.lastTickAt).toBe(sdk.createdAt);
  });

  it('handles empty edgeDomains', () => {
    const sdk = createOrganismSDK(makeConfig({ edgeDomains: [] }));
    expect(sdk.edgeSensors).toHaveLength(0);
  });

  it('handles empty capabilities', () => {
    const sdk = createOrganismSDK(makeConfig({ capabilities: [] }));
    expect(sdk.capabilities).toHaveLength(0);
  });

  it.each(ALL_MODES)('creates SDK with mode "%s"', (mode) => {
    expect(createOrganismSDK(makeConfig({ initialMode: mode })).mode).toBe(mode);
  });

  it('channelId starts with "channel-"', () => {
    expect(createOrganismSDK(makeConfig()).absorptionChannel.channelId).toMatch(/^channel-/);
  });

  it('sensor sensorId starts with "sensor-"', () => {
    createOrganismSDK(makeConfig()).edgeSensors.forEach((s) => expect(s.sensorId).toMatch(/^sensor-/));
  });

  it('port portId starts with "port-"', () => {
    createOrganismSDK(makeConfig()).resonancePorts.forEach((p) => expect(p.portId).toMatch(/^port-/));
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2: startHeartbeat / stopHeartbeat (~45 tests)
// ═══════════════════════════════════════════════════════════════════════════
describe('startHeartbeat', () => {
  it('sets isAlive to true', () => {
    const sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    expect(sdk.heartbeat.isAlive).toBe(true);
  });

  it('changes dormant mode to autonomous', () => {
    const sdk = startHeartbeat(createOrganismSDK(makeConfig({ initialMode: 'dormant' })));
    expect(sdk.mode).toBe('autonomous');
  });

  it('keeps autonomous mode as autonomous', () => {
    const sdk = startHeartbeat(createOrganismSDK(makeConfig({ initialMode: 'autonomous' })));
    expect(sdk.mode).toBe('autonomous');
  });

  it('keeps guided mode as guided', () => {
    const sdk = startHeartbeat(createOrganismSDK(makeConfig({ initialMode: 'guided' })));
    expect(sdk.mode).toBe('guided');
  });

  it('keeps resonating mode as resonating', () => {
    const sdk = startHeartbeat(createOrganismSDK(makeConfig({ initialMode: 'resonating' })));
    expect(sdk.mode).toBe('resonating');
  });

  it('keeps absorbing mode as absorbing', () => {
    const sdk = startHeartbeat(createOrganismSDK(makeConfig({ initialMode: 'absorbing' })));
    expect(sdk.mode).toBe('absorbing');
  });

  it('updates heartbeat timestamp', () => {
    const orig = createOrganismSDK(makeConfig());
    const sdk = startHeartbeat(orig);
    expect(new Date(sdk.heartbeat.timestamp).getTime()).toBeGreaterThanOrEqual(new Date(orig.heartbeat.timestamp).getTime());
  });

  it('does not change beatNumber', () => {
    expect(startHeartbeat(createOrganismSDK(makeConfig())).heartbeat.beatNumber).toBe(0);
  });

  it('does not change coherence', () => {
    expect(startHeartbeat(createOrganismSDK(makeConfig())).heartbeat.coherence).toBe(COHERENCE_ICOSAHEDRAL);
  });

  it('does not change phiPhase', () => {
    expect(startHeartbeat(createOrganismSDK(makeConfig())).heartbeat.phiPhase).toBe(0);
  });

  it('preserves id', () => {
    expect(startHeartbeat(createOrganismSDK(makeConfig({ organismId: 'x' }))).id).toBe('x');
  });

  it('preserves capabilities', () => {
    const sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    expect(sdk.capabilities).toHaveLength(2);
  });

  it('preserves edgeSensors', () => {
    const sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    expect(sdk.edgeSensors).toHaveLength(2);
  });

  it('double start keeps isAlive true', () => {
    const sdk = startHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.heartbeat.isAlive).toBe(true);
  });

  it.each(ALL_MODES)('startHeartbeat with initial mode "%s" sets isAlive true', (mode) => {
    const sdk = startHeartbeat(createOrganismSDK(makeConfig({ initialMode: mode })));
    expect(sdk.heartbeat.isAlive).toBe(true);
  });
});

describe('stopHeartbeat', () => {
  it('sets isAlive to false', () => {
    const sdk = stopHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.heartbeat.isAlive).toBe(false);
  });

  it('sets mode to dormant', () => {
    const sdk = stopHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.mode).toBe('dormant');
  });

  it('sets mode to dormant from guided', () => {
    const sdk = stopHeartbeat(createOrganismSDK(makeConfig({ initialMode: 'guided' })));
    expect(sdk.mode).toBe('dormant');
  });

  it('sets mode to dormant from resonating', () => {
    const sdk = stopHeartbeat(createOrganismSDK(makeConfig({ initialMode: 'resonating' })));
    expect(sdk.mode).toBe('dormant');
  });

  it('preserves beatNumber', () => {
    const started = startHeartbeat(createOrganismSDK(makeConfig()));
    const ticked = tickHeartbeat(started);
    const stopped = stopHeartbeat(ticked);
    expect(stopped.heartbeat.beatNumber).toBe(1);
  });

  it('stop then start restores isAlive', () => {
    const sdk = startHeartbeat(stopHeartbeat(startHeartbeat(createOrganismSDK(makeConfig()))));
    expect(sdk.heartbeat.isAlive).toBe(true);
  });

  it('stop then start changes dormant to autonomous', () => {
    const sdk = startHeartbeat(stopHeartbeat(startHeartbeat(createOrganismSDK(makeConfig()))));
    expect(sdk.mode).toBe('autonomous');
  });

  it('double stop keeps dormant', () => {
    const sdk = stopHeartbeat(stopHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.mode).toBe('dormant');
  });

  it('preserves id after stop', () => {
    expect(stopHeartbeat(createOrganismSDK(makeConfig({ organismId: 'z' }))).id).toBe('z');
  });

  it('preserves links after stop', () => {
    expect(stopHeartbeat(createOrganismSDK(makeConfig())).links).toEqual([]);
  });

  it.each(ALL_MODES)('stopHeartbeat from "%s" mode becomes dormant', (mode) => {
    const sdk = stopHeartbeat(createOrganismSDK(makeConfig({ initialMode: mode })));
    expect(sdk.mode).toBe('dormant');
  });

  it.each(ALL_MODES)('stopHeartbeat from "%s" sets isAlive false', (mode) => {
    const sdk = stopHeartbeat(startHeartbeat(createOrganismSDK(makeConfig({ initialMode: mode }))));
    expect(sdk.heartbeat.isAlive).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3: tickHeartbeat (~50 tests)
// ═══════════════════════════════════════════════════════════════════════════
describe('tickHeartbeat', () => {
  it('returns unchanged sdk when not alive', () => {
    const sdk = createOrganismSDK(makeConfig());
    expect(tickHeartbeat(sdk)).toBe(sdk);
  });

  it('increments beatNumber by 1', () => {
    const sdk = tickHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.heartbeat.beatNumber).toBe(1);
  });

  it('increments totalHeartbeats by 1', () => {
    const sdk = tickHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.totalHeartbeats).toBe(1);
  });

  it('adds BEAT_INTERVAL_MS to uptimeMs', () => {
    const sdk = tickHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.uptimeMs).toBe(BEAT_INTERVAL_MS);
  });

  it('updates phiPhase', () => {
    const sdk = tickHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    const expected = (1 * PHI * 360) % 360;
    expect(sdk.heartbeat.phiPhase).toBeCloseTo(expected, 5);
  });

  it('updates coherence', () => {
    const sdk = tickHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.heartbeat.coherence).not.toBe(COHERENCE_ICOSAHEDRAL);
  });

  it('updates lastTickAt', () => {
    const orig = startHeartbeat(createOrganismSDK(makeConfig()));
    const ticked = tickHeartbeat(orig);
    expect(new Date(ticked.lastTickAt).getTime()).toBeGreaterThanOrEqual(new Date(orig.lastTickAt).getTime());
  });

  it('two ticks give beatNumber 2', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = tickHeartbeat(tickHeartbeat(sdk));
    expect(sdk.heartbeat.beatNumber).toBe(2);
  });

  it('two ticks give totalHeartbeats 2', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = tickHeartbeat(tickHeartbeat(sdk));
    expect(sdk.totalHeartbeats).toBe(2);
  });

  it('two ticks give uptimeMs 2*BEAT_INTERVAL_MS', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = tickHeartbeat(tickHeartbeat(sdk));
    expect(sdk.uptimeMs).toBe(2 * BEAT_INTERVAL_MS);
  });

  it('five ticks give beatNumber 5', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    for (let i = 0; i < 5; i++) sdk = tickHeartbeat(sdk);
    expect(sdk.heartbeat.beatNumber).toBe(5);
  });

  it('five ticks give uptimeMs 5*BEAT_INTERVAL_MS', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    for (let i = 0; i < 5; i++) sdk = tickHeartbeat(sdk);
    expect(sdk.uptimeMs).toBe(5 * BEAT_INTERVAL_MS);
  });

  it('processes one item from absorption queue', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    const input = createMultimodalInput('text', 'hello', {});
    sdk = absorbMultimodal(sdk, input);
    expect(sdk.absorptionChannel.queue).toHaveLength(1);
    sdk = tickHeartbeat(sdk);
    expect(sdk.absorptionChannel.queue).toHaveLength(0);
  });

  it('moves absorbed item to absorptionHistory', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    const input = createMultimodalInput('text', 'data', {});
    sdk = absorbMultimodal(sdk, input);
    sdk = tickHeartbeat(sdk);
    expect(sdk.absorptionHistory).toHaveLength(1);
    expect(sdk.absorptionHistory[0].data).toBe('data');
  });

  it('increments totalAbsorptions when processing queue', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'x', {}));
    sdk = tickHeartbeat(sdk);
    expect(sdk.totalAbsorptions).toBe(1);
  });

  it('processes only one item per tick', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'a', {}));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'b', {}));
    expect(sdk.absorptionChannel.queue).toHaveLength(2);
    sdk = tickHeartbeat(sdk);
    expect(sdk.absorptionChannel.queue).toHaveLength(1);
    expect(sdk.absorptionHistory).toHaveLength(1);
  });

  it('second tick processes second queued item', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'a', {}));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'b', {}));
    sdk = tickHeartbeat(tickHeartbeat(sdk));
    expect(sdk.absorptionChannel.queue).toHaveLength(0);
    expect(sdk.absorptionHistory).toHaveLength(2);
  });

  it('increments channel totalAbsorbed', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'x', {}));
    sdk = tickHeartbeat(sdk);
    expect(sdk.absorptionChannel.totalAbsorbed).toBe(1);
  });

  it('does not increment totalAbsorptions when queue is empty', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = tickHeartbeat(sdk);
    expect(sdk.totalAbsorptions).toBe(0);
  });

  it('preserves isAlive true after tick', () => {
    const sdk = tickHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.heartbeat.isAlive).toBe(true);
  });

  it('coherence is between 0 and 1 after tick', () => {
    const sdk = tickHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.heartbeat.coherence).toBeGreaterThanOrEqual(0);
    expect(sdk.heartbeat.coherence).toBeLessThanOrEqual(1);
  });

  it('phiPhase is between 0 and 360 after tick', () => {
    const sdk = tickHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.heartbeat.phiPhase).toBeGreaterThanOrEqual(0);
    expect(sdk.heartbeat.phiPhase).toBeLessThan(360);
  });

  it('does not modify mode on tick', () => {
    const sdk = tickHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.mode).toBe('autonomous');
  });

  it('preserves id after tick', () => {
    expect(tickHeartbeat(startHeartbeat(createOrganismSDK(makeConfig({ organismId: 'org1' })))).id).toBe('org1');
  });

  it('ten ticks accumulate correctly', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    for (let i = 0; i < 10; i++) sdk = tickHeartbeat(sdk);
    expect(sdk.heartbeat.beatNumber).toBe(10);
    expect(sdk.totalHeartbeats).toBe(10);
    expect(sdk.uptimeMs).toBe(10 * BEAT_INTERVAL_MS);
  });

  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])('after %i tick(s) beatNumber equals %i', (n) => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    for (let i = 0; i < n; i++) sdk = tickHeartbeat(sdk);
    expect(sdk.heartbeat.beatNumber).toBe(n);
  });

  it('tick after stop returns unchanged', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = tickHeartbeat(sdk);
    sdk = stopHeartbeat(sdk);
    const stopped = sdk;
    expect(tickHeartbeat(stopped)).toBe(stopped);
  });

  it('preserves frequency after tick', () => {
    const sdk = tickHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.heartbeat.frequency).toBe(SOVEREIGN_FREQUENCY);
  });

  it('preserves intervalMs after tick', () => {
    const sdk = tickHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.heartbeat.intervalMs).toBe(BEAT_INTERVAL_MS);
  });

  it('preserves edgeSensors after tick', () => {
    const sdk = tickHeartbeat(startHeartbeat(createOrganismSDK(makeConfig())));
    expect(sdk.edgeSensors).toHaveLength(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4: createMultimodalInput (~40 tests)
// ═══════════════════════════════════════════════════════════════════════════
describe('createMultimodalInput', () => {
  it('sets type correctly', () => {
    expect(createMultimodalInput('text', 'hello', {}).type).toBe('text');
  });

  it('sets data correctly', () => {
    expect(createMultimodalInput('text', 'hello world', {}).data).toBe('hello world');
  });

  it('sets metadata correctly', () => {
    const m = { key: 'val' };
    expect(createMultimodalInput('text', '', m).metadata).toEqual(m);
  });

  it('sets sourceOrganism to external', () => {
    expect(createMultimodalInput('text', '', {}).sourceOrganism).toBe('external');
  });

  it('sets timestamp as valid ISO string', () => {
    const input = createMultimodalInput('text', '', {});
    expect(new Date(input.timestamp).toISOString()).toBe(input.timestamp);
  });

  it('id starts with input-', () => {
    expect(createMultimodalInput('text', '', {}).id).toMatch(/^input-/);
  });

  it('phiSignature equals PHI * data.length * PHI_INVERSE', () => {
    const input = createMultimodalInput('text', 'hello', {});
    expect(input.phiSignature).toBeCloseTo(PHI * 5 * PHI_INVERSE, 10);
  });

  it('phiSignature for empty data is 0', () => {
    expect(createMultimodalInput('text', '', {}).phiSignature).toBe(0);
  });

  it('phiSignature for single char', () => {
    expect(createMultimodalInput('text', 'x', {}).phiSignature).toBeCloseTo(PHI * 1 * PHI_INVERSE, 10);
  });

  it('phiSignature scales with data length', () => {
    const short = createMultimodalInput('text', 'ab', {});
    const long = createMultimodalInput('text', 'abcd', {});
    expect(long.phiSignature).toBeCloseTo(short.phiSignature * 2, 5);
  });

  it.each(ALL_MULTIMODAL_TYPES)('creates input with type "%s"', (t) => {
    expect(createMultimodalInput(t, 'data', {}).type).toBe(t);
  });

  it('metadata with number value', () => {
    expect(createMultimodalInput('text', 'x', { count: 42 }).metadata.count).toBe(42);
  });

  it('metadata with boolean value', () => {
    expect(createMultimodalInput('text', 'x', { flag: true }).metadata.flag).toBe(true);
  });

  it('metadata with string value', () => {
    expect(createMultimodalInput('text', 'x', { name: 'a' }).metadata.name).toBe('a');
  });

  it('metadata with multiple keys', () => {
    const m = { a: 'x', b: 1, c: false };
    const input = createMultimodalInput('text', '', m);
    expect(input.metadata).toEqual(m);
  });

  it('each call generates unique id', () => {
    const a = createMultimodalInput('text', '', {});
    const b = createMultimodalInput('text', '', {});
    expect(a.id).not.toBe(b.id);
  });

  it('long data string', () => {
    const data = 'a'.repeat(1000);
    const input = createMultimodalInput('text', data, {});
    expect(input.data).toBe(data);
    expect(input.phiSignature).toBeCloseTo(PHI * 1000 * PHI_INVERSE, 5);
  });

  it('voice type with metadata', () => {
    const input = createMultimodalInput('voice', 'audio-data', { sampleRate: 44100 });
    expect(input.type).toBe('voice');
    expect(input.metadata.sampleRate).toBe(44100);
  });

  it('image type', () => {
    expect(createMultimodalInput('image', 'base64img', {}).type).toBe('image');
  });

  it('sensor type', () => {
    expect(createMultimodalInput('sensor', '{"temp":72}', {}).type).toBe('sensor');
  });

  it('document type', () => {
    expect(createMultimodalInput('document', 'pdf-content', {}).type).toBe('document');
  });

  it.each([0, 1, 5, 10, 50, 100, 255])('phiSignature correct for data length %i', (len) => {
    const input = createMultimodalInput('text', 'x'.repeat(len), {});
    expect(input.phiSignature).toBeCloseTo(PHI * len * PHI_INVERSE, 10);
  });

  it('empty metadata object', () => {
    expect(createMultimodalInput('text', 'x', {}).metadata).toEqual({});
  });

  it('preserves special characters in data', () => {
    const data = '🌀\n\t"quotes"';
    expect(createMultimodalInput('text', data, {}).data).toBe(data);
  });

  it.each(ALL_MULTIMODAL_TYPES)('phiSignature computation is consistent for type "%s"', (t) => {
    const input = createMultimodalInput(t, 'test', {});
    expect(input.phiSignature).toBeCloseTo(PHI * 4 * PHI_INVERSE, 10);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 5: absorbMultimodal (~40 tests)
// ═══════════════════════════════════════════════════════════════════════════
describe('absorbMultimodal', () => {
  it('adds input to queue', () => {
    const sdk = createOrganismSDK(makeConfig());
    const input = createMultimodalInput('text', 'hello', {});
    const result = absorbMultimodal(sdk, input);
    expect(result.absorptionChannel.queue).toHaveLength(1);
  });

  it('queue contains the absorbed input', () => {
    const sdk = createOrganismSDK(makeConfig());
    const input = createMultimodalInput('text', 'hello', {});
    const result = absorbMultimodal(sdk, input);
    expect(result.absorptionChannel.queue[0]).toBe(input);
  });

  it('sets mode to absorbing', () => {
    const sdk = createOrganismSDK(makeConfig());
    const input = createMultimodalInput('text', 'hello', {});
    expect(absorbMultimodal(sdk, input).mode).toBe('absorbing');
  });

  it('returns unchanged sdk when channel is closed', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = { ...sdk, absorptionChannel: { ...sdk.absorptionChannel, isOpen: false } };
    const input = createMultimodalInput('text', 'hello', {});
    expect(absorbMultimodal(sdk, input)).toBe(sdk);
  });

  it('multiple absorptions grow queue', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'a', {}));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'b', {}));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'c', {}));
    expect(sdk.absorptionChannel.queue).toHaveLength(3);
  });

  it('queue maintains insertion order', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'first', {}));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'second', {}));
    expect(sdk.absorptionChannel.queue[0].data).toBe('first');
    expect(sdk.absorptionChannel.queue[1].data).toBe('second');
  });

  it('preserves id', () => {
    const sdk = createOrganismSDK(makeConfig({ organismId: 'myorg' }));
    expect(absorbMultimodal(sdk, createMultimodalInput('text', '', {})).id).toBe('myorg');
  });

  it('preserves heartbeat', () => {
    const sdk = createOrganismSDK(makeConfig());
    const result = absorbMultimodal(sdk, createMultimodalInput('text', '', {}));
    expect(result.heartbeat.isAlive).toBe(false);
  });

  it('does not change totalAbsorptions directly', () => {
    const sdk = createOrganismSDK(makeConfig());
    expect(absorbMultimodal(sdk, createMultimodalInput('text', '', {})).totalAbsorptions).toBe(0);
  });

  it('preserves absorptionHistory', () => {
    const sdk = createOrganismSDK(makeConfig());
    expect(absorbMultimodal(sdk, createMultimodalInput('text', '', {})).absorptionHistory).toEqual([]);
  });

  it('preserves edgeSensors', () => {
    const sdk = createOrganismSDK(makeConfig());
    expect(absorbMultimodal(sdk, createMultimodalInput('text', '', {})).edgeSensors).toHaveLength(2);
  });

  it.each(ALL_MULTIMODAL_TYPES)('absorbs "%s" type input', (t) => {
    const sdk = createOrganismSDK(makeConfig());
    const input = createMultimodalInput(t, 'data', {});
    const result = absorbMultimodal(sdk, input);
    expect(result.absorptionChannel.queue).toHaveLength(1);
    expect(result.absorptionChannel.queue[0].type).toBe(t);
  });

  it('closed channel returns same reference', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = { ...sdk, absorptionChannel: { ...sdk.absorptionChannel, isOpen: false } };
    const ref = sdk;
    expect(absorbMultimodal(sdk, createMultimodalInput('text', '', {}))).toBe(ref);
  });

  it('absorb after start heartbeat', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'hi', {}));
    expect(sdk.absorptionChannel.queue).toHaveLength(1);
    expect(sdk.mode).toBe('absorbing');
  });

  it('preserves resonancePorts', () => {
    const sdk = createOrganismSDK(makeConfig());
    expect(absorbMultimodal(sdk, createMultimodalInput('text', '', {})).resonancePorts).toHaveLength(2);
  });

  it('preserves capabilities', () => {
    const sdk = createOrganismSDK(makeConfig());
    expect(absorbMultimodal(sdk, createMultimodalInput('text', '', {})).capabilities).toHaveLength(2);
  });

  it('preserves links', () => {
    const sdk = createOrganismSDK(makeConfig());
    expect(absorbMultimodal(sdk, createMultimodalInput('text', '', {})).links).toEqual([]);
  });

  it('absorb five items', () => {
    let sdk = createOrganismSDK(makeConfig());
    for (let i = 0; i < 5; i++) {
      sdk = absorbMultimodal(sdk, createMultimodalInput('text', `item-${i}`, {}));
    }
    expect(sdk.absorptionChannel.queue).toHaveLength(5);
  });

  it('ten absorptions', () => {
    let sdk = createOrganismSDK(makeConfig());
    for (let i = 0; i < 10; i++) {
      sdk = absorbMultimodal(sdk, createMultimodalInput('text', `msg-${i}`, {}));
    }
    expect(sdk.absorptionChannel.queue).toHaveLength(10);
  });

  it('absorb preserves channelId', () => {
    const sdk = createOrganismSDK(makeConfig());
    const channelId = sdk.absorptionChannel.channelId;
    const result = absorbMultimodal(sdk, createMultimodalInput('text', '', {}));
    expect(result.absorptionChannel.channelId).toBe(channelId);
  });

  it('absorb preserves isOpen true', () => {
    const sdk = createOrganismSDK(makeConfig());
    expect(absorbMultimodal(sdk, createMultimodalInput('text', '', {})).absorptionChannel.isOpen).toBe(true);
  });

  it('preserves phiCapacity', () => {
    const sdk = createOrganismSDK(makeConfig());
    expect(absorbMultimodal(sdk, createMultimodalInput('text', '', {})).absorptionChannel.phiCapacity).toBe(PHI_CUBED * 100);
  });

  it.each([1, 2, 3, 5, 8])('absorbing %i items gives queue length %i', (n) => {
    let sdk = createOrganismSDK(makeConfig());
    for (let i = 0; i < n; i++) sdk = absorbMultimodal(sdk, createMultimodalInput('text', `${i}`, {}));
    expect(sdk.absorptionChannel.queue).toHaveLength(n);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 6: emitMultimodal (~35 tests)
// ═══════════════════════════════════════════════════════════════════════════
describe('emitMultimodal', () => {
  function sdkWithAbsorption(data = 'hello'): OrganismSDKInstance {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', data, { source: 'test' }));
    sdk = tickHeartbeat(sdk);
    return sdk;
  }

  it('returns null output when no absorptionHistory', () => {
    const sdk = createOrganismSDK(makeConfig());
    const { output } = emitMultimodal(sdk, 'ch1');
    expect(output).toBeNull();
  });

  it('returns same sdk when no absorptionHistory', () => {
    const sdk = createOrganismSDK(makeConfig());
    const { sdk: result } = emitMultimodal(sdk, 'ch1');
    expect(result).toBe(sdk);
  });

  it('returns output when absorptionHistory exists', () => {
    const { output } = emitMultimodal(sdkWithAbsorption(), 'primary');
    expect(output).not.toBeNull();
  });

  it('output data has [Organism-processed] prefix', () => {
    const { output } = emitMultimodal(sdkWithAbsorption('world'), 'ch');
    expect(output!.data).toBe('[Organism-processed] world');
  });

  it('output type matches last absorbed type', () => {
    const { output } = emitMultimodal(sdkWithAbsorption(), 'ch');
    expect(output!.type).toBe('text');
  });

  it('output targetChannel matches parameter', () => {
    const { output } = emitMultimodal(sdkWithAbsorption(), 'my-channel');
    expect(output!.targetChannel).toBe('my-channel');
  });

  it('output phiSignature equals lastAbsorbed.phiSignature * PHI_INVERSE', () => {
    const sdk = sdkWithAbsorption('hello');
    const lastAbsorbed = sdk.absorptionHistory[sdk.absorptionHistory.length - 1];
    const { output } = emitMultimodal(sdk, 'ch');
    expect(output!.phiSignature).toBeCloseTo(lastAbsorbed.phiSignature * PHI_INVERSE, 10);
  });

  it('output coherenceAtEmission matches heartbeat coherence', () => {
    const sdk = sdkWithAbsorption();
    const { output } = emitMultimodal(sdk, 'ch');
    expect(output!.coherenceAtEmission).toBe(sdk.heartbeat.coherence);
  });

  it('output id starts with output-', () => {
    const { output } = emitMultimodal(sdkWithAbsorption(), 'ch');
    expect(output!.id).toMatch(/^output-/);
  });

  it('output timestamp is valid ISO', () => {
    const { output } = emitMultimodal(sdkWithAbsorption(), 'ch');
    expect(new Date(output!.timestamp).toISOString()).toBe(output!.timestamp);
  });

  it('increments totalEmissions', () => {
    const { sdk } = emitMultimodal(sdkWithAbsorption(), 'ch');
    expect(sdk.totalEmissions).toBe(1);
  });

  it('adds output to emissionHistory', () => {
    const { sdk } = emitMultimodal(sdkWithAbsorption(), 'ch');
    expect(sdk.emissionHistory).toHaveLength(1);
  });

  it('double emit increments totalEmissions to 2', () => {
    let { sdk } = emitMultimodal(sdkWithAbsorption(), 'ch');
    const result = emitMultimodal(sdk, 'ch2');
    expect(result.sdk.totalEmissions).toBe(2);
  });

  it('output metadata includes processedByOrganism', () => {
    const { output } = emitMultimodal(sdkWithAbsorption(), 'ch');
    expect(output!.metadata.processedByOrganism).toBe('test-org');
  });

  it('output metadata includes heartbeatAtEmission', () => {
    const sdk = sdkWithAbsorption();
    const { output } = emitMultimodal(sdk, 'ch');
    expect(output!.metadata.heartbeatAtEmission).toBe(sdk.heartbeat.beatNumber);
  });

  it('output metadata merges original metadata', () => {
    const { output } = emitMultimodal(sdkWithAbsorption(), 'ch');
    expect(output!.metadata.source).toBe('test');
  });

  it('preserves id after emit', () => {
    const { sdk } = emitMultimodal(sdkWithAbsorption(), 'ch');
    expect(sdk.id).toBe('test-org');
  });

  it('preserves heartbeat after emit', () => {
    const before = sdkWithAbsorption();
    const { sdk } = emitMultimodal(before, 'ch');
    expect(sdk.heartbeat.beatNumber).toBe(before.heartbeat.beatNumber);
  });

  it('preserves absorptionHistory after emit', () => {
    const { sdk } = emitMultimodal(sdkWithAbsorption(), 'ch');
    expect(sdk.absorptionHistory).toHaveLength(1);
  });

  it.each(ALL_MULTIMODAL_TYPES)('emits from absorbed "%s" type', (t) => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = absorbMultimodal(sdk, createMultimodalInput(t, 'data', {}));
    sdk = tickHeartbeat(sdk);
    const { output } = emitMultimodal(sdk, 'ch');
    expect(output!.type).toBe(t);
  });

  it('emit with different channel names', () => {
    const sdk = sdkWithAbsorption();
    expect(emitMultimodal(sdk, 'alpha').output!.targetChannel).toBe('alpha');
    expect(emitMultimodal(sdk, 'beta').output!.targetChannel).toBe('beta');
  });

  it('emit uses last absorbed item when multiple in history', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'first', {}));
    sdk = tickHeartbeat(sdk);
    sdk = absorbMultimodal(sdk, createMultimodalInput('voice', 'second', {}));
    sdk = tickHeartbeat(sdk);
    const { output } = emitMultimodal(sdk, 'ch');
    expect(output!.data).toBe('[Organism-processed] second');
    expect(output!.type).toBe('voice');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 7: senseEdges (~35 tests)
// ═══════════════════════════════════════════════════════════════════════════
describe('senseEdges', () => {
  function sdkWithCoherence(coherence: number): OrganismSDKInstance {
    const sdk = createOrganismSDK(makeConfig());
    return { ...sdk, heartbeat: { ...sdk.heartbeat, coherence } };
  }

  it('returns edges array', () => {
    const { edges } = senseEdges(createOrganismSDK(makeConfig()));
    expect(Array.isArray(edges)).toBe(true);
  });

  it('no edges with high coherence', () => {
    const { edges } = senseEdges(sdkWithCoherence(0.95));
    expect(edges).toHaveLength(0);
  });

  it('detects edges with low coherence', () => {
    const { edges } = senseEdges(sdkWithCoherence(0.1));
    expect(edges.length).toBeGreaterThan(0);
  });

  it('detects edges from both sensors at coherence 0.1', () => {
    const { edges } = senseEdges(sdkWithCoherence(0.1));
    expect(edges).toHaveLength(2);
  });

  it('no edges at coherence 1.0', () => {
    const { edges } = senseEdges(sdkWithCoherence(1.0));
    expect(edges).toHaveLength(0);
  });

  it('edge has correct domain', () => {
    const { edges } = senseEdges(sdkWithCoherence(0.1));
    const domains = edges.map((e) => e.domain);
    expect(domains).toContain('memory');
    expect(domains).toContain('encryption');
  });

  it('edge has sensorId', () => {
    const { edges } = senseEdges(sdkWithCoherence(0.1));
    edges.forEach((e) => expect(e.sensorId).toMatch(/^sensor-/));
  });

  it('edge has timestamp', () => {
    const { edges } = senseEdges(sdkWithCoherence(0.1));
    edges.forEach((e) => expect(new Date(e.timestamp).toISOString()).toBe(e.timestamp));
  });

  it('edge has description', () => {
    const { edges } = senseEdges(sdkWithCoherence(0.1));
    edges.forEach((e) => expect(e.description).toContain('Edge detected'));
  });

  it('edge severity is info or warning', () => {
    const { edges } = senseEdges(sdkWithCoherence(0.1));
    edges.forEach((e) => expect(['info', 'warning']).toContain(e.severity));
  });

  it('updates totalEdgesFound', () => {
    const { sdk } = senseEdges(sdkWithCoherence(0.1));
    expect(sdk.totalEdgesFound).toBe(2);
  });

  it('adds edges to edgeHistory', () => {
    const { sdk } = senseEdges(sdkWithCoherence(0.1));
    expect(sdk.edgeHistory).toHaveLength(2);
  });

  it('increments sensor edgesDetected', () => {
    const { sdk } = senseEdges(sdkWithCoherence(0.1));
    sdk.edgeSensors.forEach((s) => expect(s.edgesDetected).toBe(1));
  });

  it('updates sensor lastEdge', () => {
    const { sdk } = senseEdges(sdkWithCoherence(0.1));
    sdk.edgeSensors.forEach((s) => expect(s.lastEdge).toContain('Edge detected'));
  });

  it('no edge detection does not update sensors', () => {
    const { sdk } = senseEdges(sdkWithCoherence(0.95));
    sdk.edgeSensors.forEach((s) => expect(s.edgesDetected).toBe(0));
  });

  it('edge phiAlignment is computed', () => {
    const { edges } = senseEdges(sdkWithCoherence(0.1));
    edges.forEach((e) => expect(e.phiAlignment).toBeGreaterThan(0));
  });

  it('edge autoResolvable property exists', () => {
    const { edges } = senseEdges(sdkWithCoherence(0.1));
    edges.forEach((e) => expect(typeof e.autoResolvable).toBe('boolean'));
  });

  it('with empty edgeDomains no edges detected', () => {
    const sdk = createOrganismSDK(makeConfig({ edgeDomains: [] }));
    const low = { ...sdk, heartbeat: { ...sdk.heartbeat, coherence: 0.01 } };
    const { edges } = senseEdges(low);
    expect(edges).toHaveLength(0);
  });

  it('inactive sensor does not detect edges', () => {
    let sdk = sdkWithCoherence(0.1);
    sdk = {
      ...sdk,
      edgeSensors: sdk.edgeSensors.map((s) => ({ ...s, isActive: false })),
    };
    const { edges } = senseEdges(sdk);
    expect(edges).toHaveLength(0);
  });

  it('double sense accumulates edgeHistory', () => {
    const low = sdkWithCoherence(0.1);
    const { sdk: after1 } = senseEdges(low);
    const still = { ...after1, heartbeat: { ...after1.heartbeat, coherence: 0.1 } };
    const { sdk: after2 } = senseEdges(still);
    expect(after2.edgeHistory).toHaveLength(4);
  });

  it('edge probability formula: sensitivity * (1-coherence) * PHI', () => {
    const coherence = 0.2;
    const sdk = sdkWithCoherence(coherence);
    const prob = sdk.edgeSensors[0].sensitivity * (1 - coherence) * PHI;
    expect(prob).toBeGreaterThan(COHERENCE_ICOSAHEDRAL);
    const { edges } = senseEdges(sdk);
    expect(edges.length).toBeGreaterThan(0);
  });

  it('coherence at exact boundary (0.618) means (1-0.618)=0.382, prob ~0.382, no edge', () => {
    const { edges } = senseEdges(sdkWithCoherence(COHERENCE_ICOSAHEDRAL));
    expect(edges).toHaveLength(0);
  });

  it.each([0.0, 0.05, 0.1, 0.15, 0.2])('detects edges at coherence %f', (c) => {
    const { edges } = senseEdges(sdkWithCoherence(c));
    expect(edges.length).toBeGreaterThan(0);
  });

  it.each([0.8, 0.9, 0.95, 1.0])('no edges at coherence %f', (c) => {
    const { edges } = senseEdges(sdkWithCoherence(c));
    expect(edges).toHaveLength(0);
  });

  it('preserves id after sense', () => {
    const { sdk } = senseEdges(sdkWithCoherence(0.1));
    expect(sdk.id).toBe('test-org');
  });

  it('preserves mode after sense', () => {
    const { sdk } = senseEdges(sdkWithCoherence(0.1));
    expect(sdk.mode).toBe('autonomous');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 8: broadcastResonance / receiveResonance (~50 tests)
// ═══════════════════════════════════════════════════════════════════════════
describe('broadcastResonance', () => {
  it('returns a pulse', () => {
    const sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    const { pulse } = broadcastResonance(sdk, 10, 0.5);
    expect(pulse).toBeDefined();
  });

  it('pulse.sourceOrganismId matches sdk.id', () => {
    const sdk = startHeartbeat(createOrganismSDK(makeConfig({ organismId: 'org-x' })));
    const { pulse } = broadcastResonance(sdk, 10, 0.5);
    expect(pulse.sourceOrganismId).toBe('org-x');
  });

  it('pulse.frequency matches parameter', () => {
    const { pulse } = broadcastResonance(createOrganismSDK(makeConfig()), 7.83, 0.5);
    expect(pulse.frequency).toBe(7.83);
  });

  it('pulse.amplitude matches parameter', () => {
    const { pulse } = broadcastResonance(createOrganismSDK(makeConfig()), 10, 0.75);
    expect(pulse.amplitude).toBe(0.75);
  });

  it('pulse.phase matches heartbeat phiPhase', () => {
    const sdk = createOrganismSDK(makeConfig());
    const { pulse } = broadcastResonance(sdk, 10, 0.5);
    expect(pulse.phase).toBe(sdk.heartbeat.phiPhase);
  });

  it('pulse.payload contains beat number', () => {
    const sdk = createOrganismSDK(makeConfig());
    const { pulse } = broadcastResonance(sdk, 10, 0.5);
    expect(pulse.payload).toContain(`resonance-${sdk.heartbeat.beatNumber}`);
  });

  it('pulse.phiSignature = frequency * amplitude * PHI_INVERSE', () => {
    const { pulse } = broadcastResonance(createOrganismSDK(makeConfig()), 10, 0.5);
    expect(pulse.phiSignature).toBeCloseTo(10 * 0.5 * PHI_INVERSE, 10);
  });

  it('pulse.timestamp is valid ISO', () => {
    const { pulse } = broadcastResonance(createOrganismSDK(makeConfig()), 10, 0.5);
    expect(new Date(pulse.timestamp).toISOString()).toBe(pulse.timestamp);
  });

  it('sets mode to resonating', () => {
    const { sdk } = broadcastResonance(createOrganismSDK(makeConfig()), 10, 0.5);
    expect(sdk.mode).toBe('resonating');
  });

  it('increments totalResonancesSent', () => {
    const { sdk } = broadcastResonance(createOrganismSDK(makeConfig()), 10, 0.5);
    expect(sdk.totalResonancesSent).toBe(1);
  });

  it('double broadcast gives totalResonancesSent 2', () => {
    let { sdk } = broadcastResonance(createOrganismSDK(makeConfig()), 10, 0.5);
    ({ sdk } = broadcastResonance(sdk, 10, 0.5));
    expect(sdk.totalResonancesSent).toBe(2);
  });

  it('sets ports to isTransmitting true', () => {
    const { sdk } = broadcastResonance(createOrganismSDK(makeConfig()), 10, 0.5);
    sdk.resonancePorts.forEach((p) => expect(p.isTransmitting).toBe(true));
  });

  it('updates port amplitude to amplitude * PHI_INVERSE', () => {
    const { sdk } = broadcastResonance(createOrganismSDK(makeConfig()), 10, 0.5);
    sdk.resonancePorts.forEach((p) => expect(p.amplitude).toBeCloseTo(0.5 * PHI_INVERSE, 10));
  });

  it('first port frequency equals passed frequency (phase 0)', () => {
    const { sdk } = broadcastResonance(createOrganismSDK(makeConfig()), 15, 0.5);
    expect(sdk.resonancePorts[0].frequency).toBe(15);
  });

  it('second port frequency equals frequency * PHI (phase 180)', () => {
    const { sdk } = broadcastResonance(createOrganismSDK(makeConfig()), 15, 0.5);
    expect(sdk.resonancePorts[1].frequency).toBeCloseTo(15 * PHI, 10);
  });

  it('preserves id', () => {
    const { sdk } = broadcastResonance(createOrganismSDK(makeConfig({ organismId: 'z' })), 10, 0.5);
    expect(sdk.id).toBe('z');
  });

  it.each([1, 5, 10, 20, 50])('broadcast with frequency %f', (f) => {
    const { pulse } = broadcastResonance(createOrganismSDK(makeConfig()), f, 0.5);
    expect(pulse.frequency).toBe(f);
  });

  it.each([0.1, 0.3, 0.5, 0.7, 1.0])('broadcast with amplitude %f', (a) => {
    const { pulse } = broadcastResonance(createOrganismSDK(makeConfig()), 10, a);
    expect(pulse.amplitude).toBe(a);
    expect(pulse.phiSignature).toBeCloseTo(10 * a * PHI_INVERSE, 10);
  });
});

describe('receiveResonance', () => {
  function makePulse(overrides: Partial<ResonancePulse> = {}): ResonancePulse {
    return {
      sourceOrganismId: 'sender-org',
      frequency: SOVEREIGN_FREQUENCY,
      amplitude: PHI_INVERSE,
      phase: 90,
      payload: 'test-pulse',
      timestamp: new Date().toISOString(),
      phiSignature: SOVEREIGN_FREQUENCY * PHI_INVERSE * PHI_INVERSE,
      ...overrides,
    };
  }

  it('increments totalResonancesReceived', () => {
    const sdk = receiveResonance(createOrganismSDK(makeConfig()), makePulse());
    expect(sdk.totalResonancesReceived).toBe(1);
  });

  it('double receive gives totalResonancesReceived 2', () => {
    let sdk = receiveResonance(createOrganismSDK(makeConfig()), makePulse());
    sdk = receiveResonance(sdk, makePulse({ sourceOrganismId: 'other' }));
    expect(sdk.totalResonancesReceived).toBe(2);
  });

  it('adds sourceOrganismId to ports connectedOrganisms', () => {
    const sdk = receiveResonance(createOrganismSDK(makeConfig()), makePulse());
    sdk.resonancePorts.forEach((p) => expect(p.connectedOrganisms).toContain('sender-org'));
  });

  it('sets ports isReceiving true', () => {
    const sdk = receiveResonance(createOrganismSDK(makeConfig()), makePulse());
    sdk.resonancePorts.forEach((p) => expect(p.isReceiving).toBe(true));
  });

  it('does not duplicate sourceOrganismId on second receive', () => {
    let sdk = receiveResonance(createOrganismSDK(makeConfig()), makePulse());
    sdk = receiveResonance(sdk, makePulse());
    const count = sdk.resonancePorts[0].connectedOrganisms.filter((o) => o === 'sender-org').length;
    expect(count).toBe(1);
  });

  it('adjusts phiPhase', () => {
    const orig = createOrganismSDK(makeConfig());
    const sdk = receiveResonance(orig, makePulse({ phase: 90 }));
    expect(sdk.heartbeat.phiPhase).not.toBe(orig.heartbeat.phiPhase);
  });

  it('boosts coherence', () => {
    const orig = createOrganismSDK(makeConfig());
    const sdk = receiveResonance(orig, makePulse());
    expect(sdk.heartbeat.coherence).toBeGreaterThanOrEqual(orig.heartbeat.coherence);
  });

  it('coherence does not exceed 1', () => {
    let sdk = createOrganismSDK(makeConfig());
    for (let i = 0; i < 100; i++) sdk = receiveResonance(sdk, makePulse());
    expect(sdk.heartbeat.coherence).toBeLessThanOrEqual(1);
  });

  it('phiPhase stays in [0, 360)', () => {
    const sdk = receiveResonance(createOrganismSDK(makeConfig()), makePulse({ phase: 350 }));
    expect(sdk.heartbeat.phiPhase).toBeGreaterThanOrEqual(0);
    expect(sdk.heartbeat.phiPhase).toBeLessThan(360);
  });

  it('preserves id', () => {
    expect(receiveResonance(createOrganismSDK(makeConfig({ organismId: 'recv' })), makePulse()).id).toBe('recv');
  });

  it('preserves mode', () => {
    expect(receiveResonance(createOrganismSDK(makeConfig()), makePulse()).mode).toBe('autonomous');
  });

  it('coherenceBoost capped at 0.1', () => {
    const orig = createOrganismSDK(makeConfig());
    const sdk = receiveResonance(orig, makePulse({ phiSignature: 9999 }));
    const boost = sdk.heartbeat.coherence - orig.heartbeat.coherence;
    expect(boost).toBeLessThanOrEqual(0.1 + 1e-10);
  });

  it('multiple different sources added to connectedOrganisms', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = receiveResonance(sdk, makePulse({ sourceOrganismId: 'a' }));
    sdk = receiveResonance(sdk, makePulse({ sourceOrganismId: 'b' }));
    expect(sdk.resonancePorts[0].connectedOrganisms).toContain('a');
    expect(sdk.resonancePorts[0].connectedOrganisms).toContain('b');
  });

  it('preserves absorptionChannel', () => {
    const sdk = receiveResonance(createOrganismSDK(makeConfig()), makePulse());
    expect(sdk.absorptionChannel.isOpen).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 9: runAutonomousCycle (~40 tests)
// ═══════════════════════════════════════════════════════════════════════════
describe('runAutonomousCycle', () => {
  it('starts heartbeat', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS);
    expect(sdk.heartbeat.isAlive).toBe(true);
  });

  it('produces cycle report', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS);
    expect(sdk.cycleReports).toHaveLength(1);
  });

  it('cycle report heartbeats equals floor(duration/BEAT_INTERVAL_MS)', () => {
    const duration = BEAT_INTERVAL_MS * 5;
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), duration);
    expect(sdk.cycleReports[0].heartbeats).toBe(5);
  });

  it('cycle report durationMs matches input', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), 5000);
    expect(sdk.cycleReports[0].durationMs).toBe(5000);
  });

  it('cycle report cycleNumber is 1 for first cycle', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS);
    expect(sdk.cycleReports[0].cycleNumber).toBe(1);
  });

  it('totalHeartbeats reflects beats run', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS * 3);
    expect(sdk.totalHeartbeats).toBe(3);
  });

  it('uptimeMs reflects beats run', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS * 3);
    expect(sdk.uptimeMs).toBe(3 * BEAT_INTERVAL_MS);
  });

  it('zero duration produces 0 beats', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), 0);
    expect(sdk.cycleReports[0].heartbeats).toBe(0);
  });

  it('sub-interval duration produces 0 beats', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS - 1);
    expect(sdk.cycleReports[0].heartbeats).toBe(0);
  });

  it('second cycle increments cycleNumber', () => {
    let sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS);
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS);
    expect(sdk.cycleReports).toHaveLength(2);
    expect(sdk.cycleReports[1].cycleNumber).toBe(2);
  });

  it('cycle report timestamp is valid ISO', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS);
    expect(new Date(sdk.cycleReports[0].timestamp).toISOString()).toBe(sdk.cycleReports[0].timestamp);
  });

  it('cycle report has phiCoherence', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS);
    expect(sdk.cycleReports[0].phiCoherence).toBeGreaterThanOrEqual(0);
    expect(sdk.cycleReports[0].phiCoherence).toBeLessThanOrEqual(1);
  });

  it('dormant mode starts heartbeat and becomes autonomous', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig({ initialMode: 'dormant' })), BEAT_INTERVAL_MS);
    expect(sdk.heartbeat.isAlive).toBe(true);
  });

  it('resonance is sent during autonomous cycle', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS * 3);
    expect(sdk.totalResonancesSent).toBeGreaterThan(0);
  });

  it('cycle report resonancesSent > 0 for multi-beat cycle', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS * 3);
    expect(sdk.cycleReports[0].resonancesSent).toBeGreaterThan(0);
  });

  it('with queued input, cycle processes absorptions', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'cycle-data', {}));
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS * 2);
    expect(sdk.absorptionHistory.length).toBeGreaterThan(0);
  });

  it('cycle with absorptions produces emissions', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'data', {}));
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS * 5);
    expect(sdk.totalEmissions).toBeGreaterThan(0);
  });

  it('preserves id through cycle', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig({ organismId: 'cycle-org' })), BEAT_INTERVAL_MS);
    expect(sdk.id).toBe('cycle-org');
  });

  it.each([1, 2, 3, 5, 8, 10])('cycle with %i beats has correct totalHeartbeats', (n) => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS * n);
    expect(sdk.totalHeartbeats).toBe(n);
  });

  it.each([1, 2, 3, 5, 8, 10])('cycle with %i beats has correct uptimeMs', (n) => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS * n);
    expect(sdk.uptimeMs).toBe(n * BEAT_INTERVAL_MS);
  });

  it('beatNumber matches totalHeartbeats after cycle', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS * 4);
    expect(sdk.heartbeat.beatNumber).toBe(sdk.totalHeartbeats);
  });

  it('edge sensing occurs during cycle', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS * 5);
    expect(sdk.cycleReports[0].edgesDetected).toBeDefined();
  });

  it('cycle report resonancesReceived is 0 when no pulses received', () => {
    const sdk = runAutonomousCycle(createOrganismSDK(makeConfig()), BEAT_INTERVAL_MS);
    expect(sdk.cycleReports[0].resonancesReceived).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 10: connectSDKs (~30 tests)
// ═══════════════════════════════════════════════════════════════════════════
describe('connectSDKs', () => {
  it('creates link from A to B', () => {
    const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const { sdkA } = connectSDKs(a, b, 'resonance');
    expect(sdkA.links).toHaveLength(1);
    expect(sdkA.links[0].localSDKId).toBe('a');
    expect(sdkA.links[0].remoteSDKId).toBe('b');
  });

  it('creates link from B to A', () => {
    const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const { sdkB } = connectSDKs(a, b, 'resonance');
    expect(sdkB.links).toHaveLength(1);
    expect(sdkB.links[0].localSDKId).toBe('b');
    expect(sdkB.links[0].remoteSDKId).toBe('a');
  });

  it('link type matches parameter', () => {
    const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const { sdkA } = connectSDKs(a, b, 'synaptic');
    expect(sdkA.links[0].linkType).toBe('synaptic');
  });

  it('link strength is PHI_INVERSE', () => {
    const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const { sdkA } = connectSDKs(a, b, 'resonance');
    expect(sdkA.links[0].strength).toBe(PHI_INVERSE);
  });

  it('link has establishedAt timestamp', () => {
    const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const { sdkA } = connectSDKs(a, b, 'resonance');
    expect(new Date(sdkA.links[0].establishedAt).toISOString()).toBe(sdkA.links[0].establishedAt);
  });

  it('link linkId starts with link-', () => {
    const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const { sdkA } = connectSDKs(a, b, 'resonance');
    expect(sdkA.links[0].linkId).toMatch(/^link-/);
  });

  it('A ports include B id in connectedOrganisms', () => {
    const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const { sdkA } = connectSDKs(a, b, 'resonance');
    sdkA.resonancePorts.forEach((p) => expect(p.connectedOrganisms).toContain('b'));
  });

  it('B ports include A id in connectedOrganisms', () => {
    const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const { sdkB } = connectSDKs(a, b, 'resonance');
    sdkB.resonancePorts.forEach((p) => expect(p.connectedOrganisms).toContain('a'));
  });

  it('double connect does not duplicate connectedOrganisms', () => {
    const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const first = connectSDKs(a, b, 'resonance');
    const second = connectSDKs(first.sdkA, first.sdkB, 'synaptic');
    const count = second.sdkA.resonancePorts[0].connectedOrganisms.filter((o) => o === 'b').length;
    expect(count).toBe(1);
  });

  it('double connect adds second link', () => {
    const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const first = connectSDKs(a, b, 'resonance');
    const second = connectSDKs(first.sdkA, first.sdkB, 'synaptic');
    expect(second.sdkA.links).toHaveLength(2);
  });

  it('preserves A id', () => {
    const { sdkA } = connectSDKs(
      createOrganismSDK(makeConfig({ organismId: 'alpha' })),
      createOrganismSDK(makeConfig({ organismId: 'beta' })),
      'resonance'
    );
    expect(sdkA.id).toBe('alpha');
  });

  it('preserves B id', () => {
    const { sdkB } = connectSDKs(
      createOrganismSDK(makeConfig({ organismId: 'alpha' })),
      createOrganismSDK(makeConfig({ organismId: 'beta' })),
      'resonance'
    );
    expect(sdkB.id).toBe('beta');
  });

  it.each(ALL_LINK_TYPES)('connects with linkType "%s"', (lt) => {
    const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const { sdkA, sdkB } = connectSDKs(a, b, lt);
    expect(sdkA.links[0].linkType).toBe(lt);
    expect(sdkB.links[0].linkType).toBe(lt);
  });

  it('link lastResonanceAt equals establishedAt', () => {
    const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const { sdkA } = connectSDKs(a, b, 'resonance');
    expect(sdkA.links[0].lastResonanceAt).toBe(sdkA.links[0].establishedAt);
  });

  it('preserves heartbeat state', () => {
    const a = startHeartbeat(createOrganismSDK(makeConfig({ organismId: 'a' })));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const { sdkA } = connectSDKs(a, b, 'resonance');
    expect(sdkA.heartbeat.isAlive).toBe(true);
  });

  it('preserves capabilities', () => {
    const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const { sdkA } = connectSDKs(a, b, 'resonance');
    expect(sdkA.capabilities).toHaveLength(2);
  });

  it('three-way connection', () => {
    const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const c = createOrganismSDK(makeConfig({ organismId: 'c' }));
    const ab = connectSDKs(a, b, 'resonance');
    const ac = connectSDKs(ab.sdkA, c, 'synaptic');
    expect(ac.sdkA.links).toHaveLength(2);
    expect(ac.sdkA.resonancePorts[0].connectedOrganisms).toContain('b');
    expect(ac.sdkA.resonancePorts[0].connectedOrganisms).toContain('c');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 11: Integration (~55 tests)
// ═══════════════════════════════════════════════════════════════════════════
describe('Integration', () => {
  it('full lifecycle: create → start → absorb → tick → emit', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = startHeartbeat(sdk);
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'hello', {}));
    sdk = tickHeartbeat(sdk);
    const { sdk: after, output } = emitMultimodal(sdk, 'out');
    expect(output).not.toBeNull();
    expect(output!.data).toBe('[Organism-processed] hello');
    expect(after.totalEmissions).toBe(1);
  });

  it('create → start → tick → sense → broadcast', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = tickHeartbeat(sdk);
    const { edges } = senseEdges(sdk);
    const { sdk: after, pulse } = broadcastResonance(sdk, SOVEREIGN_FREQUENCY, PHI_INVERSE);
    expect(pulse.sourceOrganismId).toBe('test-org');
    expect(after.totalResonancesSent).toBe(1);
  });

  it('two organisms exchange resonance', () => {
    let a = startHeartbeat(createOrganismSDK(makeConfig({ organismId: 'a' })));
    let b = startHeartbeat(createOrganismSDK(makeConfig({ organismId: 'b' })));
    const { pulse } = broadcastResonance(a, SOVEREIGN_FREQUENCY, PHI_INVERSE);
    b = receiveResonance(b, pulse);
    expect(b.totalResonancesReceived).toBe(1);
    expect(b.resonancePorts[0].connectedOrganisms).toContain('a');
  });

  it('connect then broadcast then receive', () => {
    const a0 = createOrganismSDK(makeConfig({ organismId: 'a' }));
    const b0 = createOrganismSDK(makeConfig({ organismId: 'b' }));
    const { sdkA, sdkB } = connectSDKs(a0, b0, 'resonance');
    const { sdk: aAfter, pulse } = broadcastResonance(startHeartbeat(sdkA), SOVEREIGN_FREQUENCY, PHI_INVERSE);
    const bAfter = receiveResonance(startHeartbeat(sdkB), pulse);
    expect(aAfter.totalResonancesSent).toBe(1);
    expect(bAfter.totalResonancesReceived).toBe(1);
  });

  it('absorb → cycle processes it', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'cycle-input', {}));
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS * 5);
    expect(sdk.absorptionHistory.length).toBeGreaterThan(0);
  });

  it('stop then cycle restarts heartbeat', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = stopHeartbeat(sdk);
    expect(sdk.heartbeat.isAlive).toBe(false);
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS);
    expect(sdk.heartbeat.isAlive).toBe(true);
  });

  it('multiple cycles accumulate reports', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS * 2);
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS * 3);
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS);
    expect(sdk.cycleReports).toHaveLength(3);
    expect(sdk.cycleReports[0].cycleNumber).toBe(1);
    expect(sdk.cycleReports[1].cycleNumber).toBe(2);
    expect(sdk.cycleReports[2].cycleNumber).toBe(3);
  });

  it('absorb multiple then tick processes one at a time', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    for (let i = 0; i < 5; i++) {
      sdk = absorbMultimodal(sdk, createMultimodalInput('text', `msg-${i}`, {}));
    }
    expect(sdk.absorptionChannel.queue).toHaveLength(5);
    for (let i = 0; i < 5; i++) sdk = tickHeartbeat(sdk);
    expect(sdk.absorptionChannel.queue).toHaveLength(0);
    expect(sdk.absorptionHistory).toHaveLength(5);
  });

  it('edge detection after many ticks with varying coherence', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    for (let i = 0; i < 10; i++) sdk = tickHeartbeat(sdk);
    const { edges } = senseEdges(sdk);
    expect(Array.isArray(edges)).toBe(true);
  });

  it('emit after multiple absorptions emits last one', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'first', {}));
    sdk = tickHeartbeat(sdk);
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'second', {}));
    sdk = tickHeartbeat(sdk);
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'third', {}));
    sdk = tickHeartbeat(sdk);
    const { output } = emitMultimodal(sdk, 'ch');
    expect(output!.data).toBe('[Organism-processed] third');
  });

  it('connect → broadcast → receive → emit chain', () => {
    let a = createOrganismSDK(makeConfig({ organismId: 'sender' }));
    let b = createOrganismSDK(makeConfig({ organismId: 'receiver' }));
    const connected = connectSDKs(a, b, 'synaptic');
    a = startHeartbeat(connected.sdkA);
    b = startHeartbeat(connected.sdkB);
    b = absorbMultimodal(b, createMultimodalInput('text', 'msg', {}));
    b = tickHeartbeat(b);
    const { pulse } = broadcastResonance(a, 10, 0.5);
    b = receiveResonance(b, pulse);
    const { output } = emitMultimodal(b, 'out');
    expect(output!.data).toBe('[Organism-processed] msg');
    expect(b.resonancePorts[0].connectedOrganisms).toContain('sender');
  });

  it('coherence is bounded after many operations', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    for (let i = 0; i < 20; i++) {
      sdk = tickHeartbeat(sdk);
      const { sdk: s2 } = senseEdges(sdk);
      sdk = s2;
    }
    expect(sdk.heartbeat.coherence).toBeLessThanOrEqual(1);
    expect(sdk.heartbeat.coherence).toBeGreaterThanOrEqual(0);
  });

  it('full cycle with all operations', () => {
    let sdk = createOrganismSDK(makeConfig({ organismId: 'full-test' }));
    sdk = startHeartbeat(sdk);
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'input1', {}));
    sdk = absorbMultimodal(sdk, createMultimodalInput('voice', 'input2', {}));
    sdk = tickHeartbeat(sdk);
    sdk = tickHeartbeat(sdk);
    const { sdk: s1 } = senseEdges(sdk);
    sdk = s1;
    const { sdk: s2, pulse } = broadcastResonance(sdk, 10, 0.5);
    sdk = s2;
    const { sdk: s3, output } = emitMultimodal(sdk, 'primary');
    sdk = s3;
    expect(sdk.totalHeartbeats).toBe(2);
    expect(sdk.totalAbsorptions).toBe(2);
    expect(sdk.totalEmissions).toBe(1);
    expect(sdk.totalResonancesSent).toBe(1);
    expect(output).not.toBeNull();
  });

  it('uptime accumulates across operations', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = tickHeartbeat(sdk);
    sdk = tickHeartbeat(sdk);
    expect(sdk.uptimeMs).toBe(2 * BEAT_INTERVAL_MS);
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS * 3);
    expect(sdk.uptimeMs).toBe(5 * BEAT_INTERVAL_MS);
  });

  it('heartbeat numbers accumulate across operations', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = tickHeartbeat(sdk);
    sdk = tickHeartbeat(sdk);
    expect(sdk.heartbeat.beatNumber).toBe(2);
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS * 3);
    expect(sdk.heartbeat.beatNumber).toBe(5);
  });

  it('create with all capabilities', () => {
    const sdk = createOrganismSDK(makeConfig({
      capabilities: [...ALL_CAPABILITIES],
    }));
    expect(sdk.capabilities).toHaveLength(8);
    ALL_CAPABILITIES.forEach((cat) => {
      expect(sdk.capabilities.find((c) => c.category === cat)).toBeDefined();
    });
  });

  it('many edge domains', () => {
    const domains = Array.from({ length: 10 }, (_, i) => `domain-${i}`);
    const sdk = createOrganismSDK(makeConfig({ edgeDomains: domains }));
    expect(sdk.edgeSensors).toHaveLength(10);
    sdk.edgeSensors.forEach((s, i) => {
      expect(s.domain).toBe(`domain-${i}`);
      expect(s.sensitivity).toBeCloseTo(PHI_INVERSE + i * 0.01, 10);
    });
  });

  it('stopped sdk returns unchanged on tick', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = tickHeartbeat(sdk);
    sdk = stopHeartbeat(sdk);
    const ref = sdk;
    expect(tickHeartbeat(sdk)).toBe(ref);
  });

  it('absorb on closed channel is no-op', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = { ...sdk, absorptionChannel: { ...sdk.absorptionChannel, isOpen: false } };
    const ref = sdk;
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'blocked', {}));
    expect(sdk).toBe(ref);
    expect(sdk.absorptionChannel.queue).toHaveLength(0);
  });

  it('emissionHistory grows with each emit', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'a', {}));
    sdk = tickHeartbeat(sdk);
    let result = emitMultimodal(sdk, 'ch1');
    result = emitMultimodal(result.sdk, 'ch2');
    result = emitMultimodal(result.sdk, 'ch3');
    expect(result.sdk.emissionHistory).toHaveLength(3);
    expect(result.sdk.totalEmissions).toBe(3);
  });

  it('multiple cycles accumulate heartbeats', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS * 2);
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS * 3);
    expect(sdk.totalHeartbeats).toBe(5);
    expect(sdk.heartbeat.beatNumber).toBe(5);
  });

  it('edge history persists across senseEdges calls', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = { ...sdk, heartbeat: { ...sdk.heartbeat, coherence: 0.1 } };
    const { sdk: s1, edges: e1 } = senseEdges(sdk);
    const s2 = { ...s1, heartbeat: { ...s1.heartbeat, coherence: 0.1 } };
    const { sdk: s3, edges: e2 } = senseEdges(s2);
    expect(s3.edgeHistory.length).toBe(e1.length + e2.length);
  });

  it('receive resonance from multiple organisms', () => {
    let sdk = createOrganismSDK(makeConfig());
    for (let i = 0; i < 5; i++) {
      sdk = receiveResonance(sdk, {
        sourceOrganismId: `org-${i}`,
        frequency: 10,
        amplitude: 0.5,
        phase: 0,
        payload: '',
        timestamp: new Date().toISOString(),
        phiSignature: 1,
      });
    }
    expect(sdk.totalResonancesReceived).toBe(5);
    expect(sdk.resonancePorts[0].connectedOrganisms).toHaveLength(5);
  });

  it('connect 4 SDKs in a chain', () => {
    const sdks = Array.from({ length: 4 }, (_, i) =>
      createOrganismSDK(makeConfig({ organismId: `chain-${i}` }))
    );
    let prev = sdks[0];
    for (let i = 1; i < sdks.length; i++) {
      const { sdkA, sdkB } = connectSDKs(prev, sdks[i], 'harmonic');
      prev = sdkA;
    }
    expect(prev.links.length).toBe(3);
  });

  it('absorb then cycle then emit', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'pre-cycle', {}));
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS * 5);
    expect(sdk.absorptionHistory.length).toBeGreaterThan(0);
    const { output } = emitMultimodal(sdk, 'post');
    expect(output).not.toBeNull();
  });

  it('tick does not crash with no sensors', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig({ edgeDomains: [] })));
    sdk = tickHeartbeat(sdk);
    expect(sdk.heartbeat.beatNumber).toBe(1);
  });

  it('sense edges with no sensors returns empty', () => {
    const sdk = createOrganismSDK(makeConfig({ edgeDomains: [] }));
    const { edges } = senseEdges(sdk);
    expect(edges).toHaveLength(0);
  });

  it('resonance port count stays at 2 through operations', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    sdk = tickHeartbeat(sdk);
    const { sdk: s2 } = broadcastResonance(sdk, 10, 0.5);
    expect(s2.resonancePorts).toHaveLength(2);
  });

  it('cycle report absorptions matches actual', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'a', {}));
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'b', {}));
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS * 3);
    expect(sdk.cycleReports[0].absorptions).toBe(2);
  });

  it('three sequential absorb-tick-emit rounds', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    for (let round = 0; round < 3; round++) {
      sdk = absorbMultimodal(sdk, createMultimodalInput('text', `round-${round}`, {}));
      sdk = tickHeartbeat(sdk);
      const { sdk: updated } = emitMultimodal(sdk, `ch-${round}`);
      sdk = updated;
    }
    expect(sdk.totalAbsorptions).toBe(3);
    expect(sdk.totalEmissions).toBe(3);
    expect(sdk.absorptionHistory).toHaveLength(3);
    expect(sdk.emissionHistory).toHaveLength(3);
  });

  it('broadcastResonance preserves absorption channel', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'x', {}));
    const { sdk: after } = broadcastResonance(sdk, 10, 0.5);
    expect(after.absorptionChannel.queue).toHaveLength(1);
  });

  it('receiveResonance preserves absorption channel', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'x', {}));
    sdk = receiveResonance(sdk, {
      sourceOrganismId: 'other',
      frequency: 10,
      amplitude: 0.5,
      phase: 0,
      payload: '',
      timestamp: new Date().toISOString(),
      phiSignature: 1,
    });
    expect(sdk.absorptionChannel.queue).toHaveLength(1);
  });

  it('connect then cycle', () => {
    const a = createOrganismSDK(makeConfig({ organismId: 'ca' }));
    const b = createOrganismSDK(makeConfig({ organismId: 'cb' }));
    const { sdkA } = connectSDKs(a, b, 'resonance');
    const result = runAutonomousCycle(sdkA, BEAT_INTERVAL_MS * 2);
    expect(result.heartbeat.isAlive).toBe(true);
    expect(result.resonancePorts[0].connectedOrganisms).toContain('cb');
  });

  it('dormant → cycle → stop → start → tick works', () => {
    let sdk = createOrganismSDK(makeConfig({ initialMode: 'dormant' }));
    sdk = runAutonomousCycle(sdk, BEAT_INTERVAL_MS);
    sdk = stopHeartbeat(sdk);
    sdk = startHeartbeat(sdk);
    sdk = tickHeartbeat(sdk);
    expect(sdk.heartbeat.isAlive).toBe(true);
    expect(sdk.heartbeat.beatNumber).toBeGreaterThan(0);
  });

  it('phiPhase wraps around after many ticks', () => {
    let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
    for (let i = 0; i < 100; i++) sdk = tickHeartbeat(sdk);
    expect(sdk.heartbeat.phiPhase).toBeGreaterThanOrEqual(0);
    expect(sdk.heartbeat.phiPhase).toBeLessThan(360);
  });

  it('all counters are non-negative after full lifecycle', () => {
    let sdk = createOrganismSDK(makeConfig());
    sdk = startHeartbeat(sdk);
    sdk = absorbMultimodal(sdk, createMultimodalInput('text', 'data', {}));
    sdk = tickHeartbeat(sdk);
    const { sdk: s2 } = senseEdges(sdk);
    const { sdk: s3 } = broadcastResonance(s2, 10, 0.5);
    const { sdk: s4 } = emitMultimodal(s3, 'ch');
    expect(s4.totalHeartbeats).toBeGreaterThanOrEqual(0);
    expect(s4.totalAbsorptions).toBeGreaterThanOrEqual(0);
    expect(s4.totalEmissions).toBeGreaterThanOrEqual(0);
    expect(s4.totalEdgesFound).toBeGreaterThanOrEqual(0);
    expect(s4.totalResonancesSent).toBeGreaterThanOrEqual(0);
    expect(s4.totalResonancesReceived).toBeGreaterThanOrEqual(0);
    expect(s4.uptimeMs).toBeGreaterThanOrEqual(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 12: Parametric tests (~45 tests)
// ═══════════════════════════════════════════════════════════════════════════
describe('Parametric tests', () => {
  describe.each(ALL_MODES)('mode "%s"', (mode) => {
    it('createOrganismSDK sets mode', () => {
      expect(createOrganismSDK(makeConfig({ initialMode: mode })).mode).toBe(mode);
    });

    it('stopHeartbeat transitions to dormant', () => {
      expect(stopHeartbeat(createOrganismSDK(makeConfig({ initialMode: mode }))).mode).toBe('dormant');
    });

    it('startHeartbeat sets isAlive', () => {
      expect(startHeartbeat(createOrganismSDK(makeConfig({ initialMode: mode }))).heartbeat.isAlive).toBe(true);
    });

    it('sdk id is preserved through start/stop', () => {
      let sdk = createOrganismSDK(makeConfig({ initialMode: mode, organismId: `org-${mode}` }));
      sdk = startHeartbeat(sdk);
      sdk = stopHeartbeat(sdk);
      expect(sdk.id).toBe(`org-${mode}`);
    });
  });

  describe.each(ALL_MULTIMODAL_TYPES)('multimodal type "%s"', (t) => {
    it('createMultimodalInput sets type', () => {
      expect(createMultimodalInput(t, 'data', {}).type).toBe(t);
    });

    it('absorb adds to queue', () => {
      const sdk = createOrganismSDK(makeConfig());
      const input = createMultimodalInput(t, 'test', {});
      expect(absorbMultimodal(sdk, input).absorptionChannel.queue).toHaveLength(1);
    });

    it('absorb → tick → emit preserves type', () => {
      let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
      sdk = absorbMultimodal(sdk, createMultimodalInput(t, 'data', {}));
      sdk = tickHeartbeat(sdk);
      const { output } = emitMultimodal(sdk, 'ch');
      expect(output!.type).toBe(t);
    });

    it('phiSignature computed correctly', () => {
      const input = createMultimodalInput(t, 'abc', {});
      expect(input.phiSignature).toBeCloseTo(PHI * 3 * PHI_INVERSE, 10);
    });
  });

  describe.each(ALL_LINK_TYPES)('link type "%s"', (lt) => {
    it('connectSDKs uses link type', () => {
      const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
      const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
      const { sdkA, sdkB } = connectSDKs(a, b, lt);
      expect(sdkA.links[0].linkType).toBe(lt);
      expect(sdkB.links[0].linkType).toBe(lt);
    });

    it('link strength is PHI_INVERSE', () => {
      const a = createOrganismSDK(makeConfig({ organismId: 'a' }));
      const b = createOrganismSDK(makeConfig({ organismId: 'b' }));
      const { sdkA } = connectSDKs(a, b, lt);
      expect(sdkA.links[0].strength).toBe(PHI_INVERSE);
    });
  });

  describe.each(ALL_CAPABILITIES)('capability "%s"', (cap) => {
    it('createOrganismSDK maps capability', () => {
      const sdk = createOrganismSDK(makeConfig({ capabilities: [cap] }));
      expect(sdk.capabilities).toHaveLength(1);
      expect(sdk.capabilities[0].category).toBe(cap);
      expect(sdk.capabilities[0].name).toBe(`${cap}-capability`);
    });
  });

  describe('edge domain counts', () => {
    it.each([0, 1, 2, 3, 5, 10])('creates %i sensors for %i domains', (n) => {
      const domains = Array.from({ length: n }, (_, i) => `d${i}`);
      expect(createOrganismSDK(makeConfig({ edgeDomains: domains })).edgeSensors).toHaveLength(n);
    });
  });

  describe('tick counts', () => {
    it.each([1, 2, 3, 5, 10, 15, 20])('%i ticks yield correct uptimeMs', (n) => {
      let sdk = startHeartbeat(createOrganismSDK(makeConfig()));
      for (let i = 0; i < n; i++) sdk = tickHeartbeat(sdk);
      expect(sdk.uptimeMs).toBe(n * BEAT_INTERVAL_MS);
    });
  });

  describe('resonance frequency values', () => {
    it.each([1, 5, 7.83, 12.67, 25, 100])('broadcast with frequency %f', (f) => {
      const { pulse } = broadcastResonance(createOrganismSDK(makeConfig()), f, 0.5);
      expect(pulse.frequency).toBe(f);
      expect(pulse.phiSignature).toBeCloseTo(f * 0.5 * PHI_INVERSE, 10);
    });
  });
});
