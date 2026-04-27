/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  INTELLIGENCE & CONTENT FLOW                                                ║
 * ║  Document Absorption · Living Documents · Campaign Engine · Show Emission · ║
 * ║  Rituals · Message Engine · Voice · Command Parsing · Model Routing ·       ║
 * ║  Replay · Dual Read · Recital                                               ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  Autonomous AI-operated intelligence and content layer for the organism.    ║
 * ║  Absorbs documents, runs campaigns, emits shows, manages rituals, routes    ║
 * ║  all AI model traffic, records replay sessions — all self-running.          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { sovereignId } from './sovereign-id';
import { PHI, PHI_INVERSE, HEARTBEAT_MS } from './kernelCompression';

// ═══════════════════════════════════════════════════════════════════════════════
// §1  TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type DocumentAbsorptionState =
  | 'ingested'
  | 'decomposing'
  | 'synthesizing'
  | 'embedding'
  | 'absorbed'
  | 'failed';

export type ContentFormat =
  | 'text'
  | 'markdown'
  | 'pdf'
  | 'audio'
  | 'video'
  | 'structured-data'
  | 'code'
  | 'research';

export type CampaignFlowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';
export type ShowEmissionStatus = 'queued' | 'emitting' | 'propagating' | 'absorbed' | 'archived';
export type RitualFlowType =
  | 'knowledge-ingestion'
  | 'model-invocation'
  | 'content-emission'
  | 'replay-capture'
  | 'sovereign-assertion';
export type MessageStatus = 'draft' | 'queued' | 'sent' | 'delivered' | 'failed';
export type ModelFamily = 'gpt-4' | 'claude-3' | 'gemini-pro' | 'llama-3' | 'phi-sovereign' | 'mistral';
export type VoicePersona = 'oro' | 'nova' | 'luna' | 'sol' | 'sovereign';
export type ReplayEventType =
  | 'document-absorbed'
  | 'campaign-launched'
  | 'show-emitted'
  | 'ritual-completed'
  | 'model-invoked'
  | 'message-sent'
  | 'dual-read';

export interface AbsorbedDocument {
  id: string;
  title: string;
  format: ContentFormat;
  state: DocumentAbsorptionState;
  ingestedAt: string;
  absorbedAt?: string;
  sizeChars: number;
  intelligenceFragments: number;
  patternsExtracted: number;
  phiFrequency: number;       // absorption harmonic
  kernelsEmbedded: number;
  researchClassified: boolean;
  absorptionScore: number;    // 0-1
}

export interface ContentCampaign {
  id: string;
  name: string;
  type: 'awareness' | 'conversion' | 'retention' | 'research' | 'sovereign';
  status: CampaignFlowStatus;
  targetAudience: string;
  messageCount: number;
  showsScheduled: number;
  impressions: number;
  conversions: number;
  startedAt: string;
  completedAt?: string;
  autoManaged: boolean;
}

export interface EmittedShow {
  id: string;
  title: string;
  type: 'narrative' | 'data-report' | 'ritual-sequence' | 'sovereign-broadcast' | 'model-showcase';
  status: ShowEmissionStatus;
  memeticVector: string;
  subsystemTargets: string[];
  emittedAt: string;
  absorbedByCount: number;
  amplificationFactor: number;    // phi-based
}

export interface FlowRitual {
  id: string;
  type: RitualFlowType;
  phase: 'initiating' | 'active' | 'completing' | 'complete' | 'evolved';
  resonanceScore: number;         // 0-1
  narrativeWeight: 'minor' | 'moderate' | 'significant' | 'major' | 'epochal';
  lawEncoded: boolean;
  completedAt?: string;
  outcome: 'success' | 'partial' | 'evolved';
}

export interface FlowMessage {
  id: string;
  subject: string;
  body: string;
  from: string;
  to: string[];
  status: MessageStatus;
  channel: 'voice' | 'text' | 'sovereign-protocol' | 'icp-canister';
  sentAt?: string;
  deliveredCount: number;
  phiEncoded: boolean;
}

export interface ModelInvocation {
  id: string;
  model: ModelFamily;
  prompt: string;
  response: string;
  confidence: number;           // 0-1
  latencyMs: number;
  tokensIn: number;
  tokensOut: number;
  invokedAt: string;
  routedBy: 'ulri' | 'sovereign-router' | 'cascade' | 'direct';
}

export interface VoiceEmission {
  id: string;
  persona: VoicePersona;
  text: string;
  durationMs: number;
  frequency: number;            // Hz
  phiModulated: boolean;
  emittedAt: string;
  received: boolean;
}

export interface DualReadResult {
  id: string;
  query: string;
  semanticResults: string[];
  resonanceResults: string[];
  mergedResults: string[];
  phiWeight: number;
  completedAt: string;
}

export interface RecitalSequence {
  id: string;
  input: string;
  output?: string;
  phase: 'initiated' | 'processing' | 'resonating' | 'complete';
  beats: number;
  resonanceScore: number;
  completedAt?: string;
}

export interface ReplayEvent {
  id: string;
  sessionId: string;
  type: ReplayEventType;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface IntelligenceContentCycle {
  id: string;
  startedAt: string;
  completedAt?: string;
  documentsAbsorbed: number;
  campaignsRun: number;
  showsEmitted: number;
  ritualsCompleted: number;
  modelsInvoked: number;
  messagesDispatched: number;
  voiceEmissions: number;
  dualReadsPerformed: number;
  recitalsCompleted: number;
  replayEventsRecorded: number;
  intelligenceScore: number;    // 0-1 composite
}

export interface IntelligenceContentDashboard {
  id: string;
  lastRefresh: string;
  absorbedDocuments: number;
  pendingAbsorptions: number;
  activeCampaigns: number;
  totalShows: number;
  activeRituals: number;
  modelInvocations: number;
  avgModelLatencyMs: number;
  messagesQueued: number;
  voiceEmissions: number;
  replayEvents: number;
  intelligenceScore: number;
  cyclesCompleted: number;
  contentHealth: 'thriving' | 'flowing' | 'stalled' | 'degraded';
}

// ═══════════════════════════════════════════════════════════════════════════════
// §2  INTERNAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const _now = () => new Date().toISOString();
const _clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

const _documents: AbsorbedDocument[] = [];
const _campaigns: ContentCampaign[] = [];
const _shows: EmittedShow[] = [];
const _rituals: FlowRitual[] = [];
const _messages: FlowMessage[] = [];
const _modelInvocations: ModelInvocation[] = [];
const _voiceEmissions: VoiceEmission[] = [];
const _dualReads: DualReadResult[] = [];
const _recitals: RecitalSequence[] = [];
const _replayEvents: ReplayEvent[] = [];
const _cycles: IntelligenceContentCycle[] = [];

let _replaySessionId: string | null = null;

const MODEL_FAMILIES: ModelFamily[] = ['gpt-4', 'claude-3', 'gemini-pro', 'llama-3', 'phi-sovereign', 'mistral'];
const ABSORPTION_FREQ = 432 * PHI_INVERSE;

// ═══════════════════════════════════════════════════════════════════════════════
// §3  DOCUMENT ABSORPTION
// ═══════════════════════════════════════════════════════════════════════════════

export function ingestDocument(
  title: string,
  format: ContentFormat,
  content: string,
): AbsorbedDocument {
  const doc: AbsorbedDocument = {
    id: sovereignId(),
    title,
    format,
    state: 'ingested',
    ingestedAt: _now(),
    sizeChars: content.length,
    intelligenceFragments: 0,
    patternsExtracted: 0,
    phiFrequency: ABSORPTION_FREQ,
    kernelsEmbedded: 0,
    researchClassified: format === 'research',
    absorptionScore: 0,
  };
  _documents.push(doc);
  _recordReplay('document-absorbed', { documentId: doc.id, title, format });
  return doc;
}

export function absorbDocument(documentId: string): AbsorbedDocument | undefined {
  const doc = _documents.find(d => d.id === documentId);
  if (!doc || doc.state === 'absorbed') return doc;

  doc.state = 'decomposing';
  doc.intelligenceFragments = Math.round(doc.sizeChars / 100 * PHI_INVERSE);
  doc.state = 'synthesizing';
  doc.patternsExtracted = Math.round(doc.intelligenceFragments * PHI_INVERSE);
  doc.state = 'embedding';
  doc.kernelsEmbedded = Math.round(doc.patternsExtracted * PHI_INVERSE);
  doc.state = 'absorbed';
  doc.absorbedAt = _now();
  doc.absorptionScore = _clamp(doc.kernelsEmbedded / Math.max(1, doc.intelligenceFragments) * PHI);
  return doc;
}

export function absorbAllPendingDocuments(): AbsorbedDocument[] {
  return _documents.filter(d => d.state === 'ingested').map(d => absorbDocument(d.id)!);
}

export function getDocuments(): AbsorbedDocument[] { return [..._documents]; }
export function getAbsorbedDocuments(): AbsorbedDocument[] {
  return _documents.filter(d => d.state === 'absorbed');
}
export function getDocumentsByFormat(format: ContentFormat): AbsorbedDocument[] {
  return _documents.filter(d => d.format === format);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §4  CAMPAIGNS
// ═══════════════════════════════════════════════════════════════════════════════

export function createContentCampaign(
  name: string,
  type: ContentCampaign['type'],
  targetAudience: string,
): ContentCampaign {
  const c: ContentCampaign = {
    id: sovereignId(),
    name,
    type,
    status: 'draft',
    targetAudience,
    messageCount: 0,
    showsScheduled: 0,
    impressions: 0,
    conversions: 0,
    startedAt: _now(),
    autoManaged: true,
  };
  _campaigns.push(c);
  return c;
}

export function launchCampaign(campaignId: string): ContentCampaign | undefined {
  const c = _campaigns.find(c => c.id === campaignId);
  if (!c || c.status === 'active') return c;
  c.status = 'active';
  c.impressions = Math.round(1000 + Math.random() * 49000);
  c.conversions = Math.round(c.impressions * 0.02 * Math.random());
  c.showsScheduled = Math.round(3 + Math.random() * 10);
  c.messageCount = Math.round(5 + Math.random() * 20);
  _recordReplay('campaign-launched', { campaignId, name: c.name });
  return c;
}

export function completeCampaign(campaignId: string): ContentCampaign | undefined {
  const c = _campaigns.find(c => c.id === campaignId);
  if (!c) return undefined;
  c.status = 'completed';
  c.completedAt = _now();
  return c;
}

export function getCampaigns(): ContentCampaign[] { return [..._campaigns]; }
export function getActiveCampaigns(): ContentCampaign[] {
  return _campaigns.filter(c => c.status === 'active');
}

// ═══════════════════════════════════════════════════════════════════════════════
// §5  SHOW EMISSION
// ═══════════════════════════════════════════════════════════════════════════════

export function emitShow(
  title: string,
  type: EmittedShow['type'],
  targets: string[] = ['all-subsystems'],
): EmittedShow {
  const show: EmittedShow = {
    id: sovereignId(),
    title,
    type,
    status: 'emitting',
    memeticVector: `phi-${type}-${Date.now().toString(36)}`,
    subsystemTargets: targets,
    emittedAt: _now(),
    absorbedByCount: 0,
    amplificationFactor: PHI,
  };
  // Propagate
  show.status = 'propagating';
  show.absorbedByCount = Math.round(targets.length * PHI);
  show.status = 'absorbed';
  _shows.push(show);
  _recordReplay('show-emitted', { showId: show.id, title, type });
  return show;
}

export function getShows(): EmittedShow[] { return [..._shows]; }
export function getShowsByType(type: EmittedShow['type']): EmittedShow[] {
  return _shows.filter(s => s.type === type);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §6  RITUALS
// ═══════════════════════════════════════════════════════════════════════════════

export function initiateRitual(type: RitualFlowType): FlowRitual {
  const r: FlowRitual = {
    id: sovereignId(),
    type,
    phase: 'initiating',
    resonanceScore: _clamp(PHI_INVERSE + Math.random() * 0.3),
    narrativeWeight: Math.random() > 0.5 ? 'significant' : 'moderate',
    lawEncoded: false,
    outcome: 'success',
  };
  _rituals.push(r);
  return r;
}

export function completeRitual(ritualId: string): FlowRitual | undefined {
  const r = _rituals.find(r => r.id === ritualId);
  if (!r) return undefined;
  r.phase = 'complete';
  r.completedAt = _now();
  r.lawEncoded = r.resonanceScore > 0.7;
  r.outcome = r.resonanceScore > 0.8 ? 'evolved' : 'success';
  _recordReplay('ritual-completed', { ritualId, type: r.type, outcome: r.outcome });
  return r;
}

export function getRituals(): FlowRitual[] { return [..._rituals]; }
export function getCompletedRituals(): FlowRitual[] {
  return _rituals.filter(r => r.phase === 'complete');
}

// ═══════════════════════════════════════════════════════════════════════════════
// §7  MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════

export function createFlowMessage(
  subject: string,
  body: string,
  from: string,
  to: string[],
  channel: FlowMessage['channel'] = 'text',
): FlowMessage {
  const m: FlowMessage = {
    id: sovereignId(),
    subject,
    body,
    from,
    to,
    status: 'draft',
    channel,
    deliveredCount: 0,
    phiEncoded: channel === 'sovereign-protocol',
  };
  _messages.push(m);
  return m;
}

export function sendFlowMessage(messageId: string): FlowMessage | undefined {
  const m = _messages.find(m => m.id === messageId);
  if (!m || m.status === 'sent') return m;
  m.status = 'sent';
  m.sentAt = _now();
  m.deliveredCount = m.to.length;
  m.status = 'delivered';
  _recordReplay('message-sent', { messageId, subject: m.subject, channel: m.channel });
  return m;
}

export function getFlowMessages(): FlowMessage[] { return [..._messages]; }
export function getMessagesByStatus(status: MessageStatus): FlowMessage[] {
  return _messages.filter(m => m.status === status);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §8  MODEL ROUTING
// ═══════════════════════════════════════════════════════════════════════════════

export function invokeAIModel(
  prompt: string,
  preferredModel?: ModelFamily,
): ModelInvocation {
  const model = preferredModel ?? MODEL_FAMILIES[Math.floor(Math.random() * MODEL_FAMILIES.length)];
  const tokens = Math.round(prompt.length / 4);
  const invocation: ModelInvocation = {
    id: sovereignId(),
    model,
    prompt,
    response: `[${model}] Sovereign response synthesized at φ = ${PHI.toFixed(4)}`,
    confidence: _clamp(PHI_INVERSE + Math.random() * 0.3),
    latencyMs: Math.round(100 + Math.random() * 900),
    tokensIn: tokens,
    tokensOut: Math.round(tokens * PHI_INVERSE),
    invokedAt: _now(),
    routedBy: 'ulri',
  };
  _modelInvocations.push(invocation);
  _recordReplay('model-invoked', { model, confidence: invocation.confidence });
  return invocation;
}

export function getModelInvocations(): ModelInvocation[] { return [..._modelInvocations]; }
export function getInvocationsByModel(model: ModelFamily): ModelInvocation[] {
  return _modelInvocations.filter(i => i.model === model);
}
export function getAvgModelLatencyMs(): number {
  if (_modelInvocations.length === 0) return 0;
  return _modelInvocations.reduce((s, i) => s + i.latencyMs, 0) / _modelInvocations.length;
}

// ═══════════════════════════════════════════════════════════════════════════════
// §9  VOICE
// ═══════════════════════════════════════════════════════════════════════════════

export function emitVoice(text: string, persona: VoicePersona = 'oro'): VoiceEmission {
  const v: VoiceEmission = {
    id: sovereignId(),
    persona,
    text,
    durationMs: Math.round(text.length * 60 + Math.random() * 500),
    frequency: 432 * PHI_INVERSE,
    phiModulated: true,
    emittedAt: _now(),
    received: true,
  };
  _voiceEmissions.push(v);
  return v;
}

export function getVoiceEmissions(): VoiceEmission[] { return [..._voiceEmissions]; }
export function getVoiceEmissionsByPersona(persona: VoicePersona): VoiceEmission[] {
  return _voiceEmissions.filter(v => v.persona === persona);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §10  DUAL READ
// ═══════════════════════════════════════════════════════════════════════════════

export function performDualRead(query: string): DualReadResult {
  const semanticResults = [
    `[semantic] ${query} → primary knowledge cluster`,
    `[semantic] ${query} → related context (phi-weighted)`,
  ];
  const resonanceResults = [
    `[resonance:${(432 * PHI_INVERSE).toFixed(1)}Hz] ${query} → harmonic match`,
    `[resonance:${(432 * PHI).toFixed(1)}Hz] ${query} → frequency correlation`,
  ];
  const result: DualReadResult = {
    id: sovereignId(),
    query,
    semanticResults,
    resonanceResults,
    mergedResults: [...semanticResults, ...resonanceResults],
    phiWeight: PHI_INVERSE,
    completedAt: _now(),
  };
  _dualReads.push(result);
  _recordReplay('dual-read', { query, resultCount: result.mergedResults.length });
  return result;
}

export function getDualReads(): DualReadResult[] { return [..._dualReads]; }

// ═══════════════════════════════════════════════════════════════════════════════
// §11  RECITAL
// ═══════════════════════════════════════════════════════════════════════════════

export function startRecital(input: string): RecitalSequence {
  const r: RecitalSequence = {
    id: sovereignId(),
    input,
    phase: 'initiated',
    beats: 0,
    resonanceScore: PHI_INVERSE,
  };
  _recitals.push(r);
  return r;
}

export function advanceAndCompleteRecital(recitalId: string, output: string): RecitalSequence | undefined {
  const r = _recitals.find(r => r.id === recitalId);
  if (!r) return undefined;
  r.phase = 'resonating';
  r.beats = Math.round(3 + Math.random() * 9);
  r.resonanceScore = _clamp(PHI_INVERSE * r.beats * 0.1 + PHI_INVERSE * 0.5);
  r.output = output;
  r.phase = 'complete';
  r.completedAt = _now();
  return r;
}

export function getRecitals(): RecitalSequence[] { return [..._recitals]; }
export function getCompletedRecitals(): RecitalSequence[] {
  return _recitals.filter(r => r.phase === 'complete');
}

// ═══════════════════════════════════════════════════════════════════════════════
// §12  REPLAY
// ═══════════════════════════════════════════════════════════════════════════════

function _recordReplay(type: ReplayEventType, payload: Record<string, unknown>): void {
  if (!_replaySessionId) _replaySessionId = sovereignId();
  _replayEvents.push({
    id: sovereignId(),
    sessionId: _replaySessionId,
    type,
    timestamp: _now(),
    payload,
  });
}

export function getReplayEvents(): ReplayEvent[] { return [..._replayEvents]; }
export function getReplayEventsByType(type: ReplayEventType): ReplayEvent[] {
  return _replayEvents.filter(e => e.type === type);
}
export function getCurrentReplaySessionId(): string | null { return _replaySessionId; }

// ═══════════════════════════════════════════════════════════════════════════════
// §13  AUTONOMOUS CYCLE
// ═══════════════════════════════════════════════════════════════════════════════

export function runIntelligenceContentCycle(): IntelligenceContentCycle {
  const start = _now();

  // 1. Ingest and absorb sample documents
  const docTopics = ['AGI research paper', 'sovereign architecture spec', 'phi-lattice encryption whitepaper'];
  let docsAbsorbed = 0;
  for (const topic of docTopics) {
    const d = ingestDocument(topic, 'research', `Content of ${topic}. φ = ${PHI.toFixed(6)}.`);
    absorbDocument(d.id);
    docsAbsorbed++;
  }

  // 2. Launch campaigns
  const campaignTypes: ContentCampaign['type'][] = ['awareness', 'research', 'sovereign'];
  let campaignsRun = 0;
  for (const type of campaignTypes) {
    const c = createContentCampaign(`auto-${type}-${_cycles.length}`, type, 'organism-wide');
    launchCampaign(c.id);
    campaignsRun++;
  }

  // 3. Emit shows
  const showTypes: EmittedShow['type'][] = ['narrative', 'data-report', 'sovereign-broadcast'];
  let showsEmitted = 0;
  for (const type of showTypes) {
    emitShow(`cycle-${_cycles.length}-${type}`, type);
    showsEmitted++;
  }

  // 4. Run rituals
  const ritualTypes: RitualFlowType[] = ['knowledge-ingestion', 'model-invocation', 'sovereign-assertion'];
  let ritualsCompleted = 0;
  for (const type of ritualTypes) {
    const r = initiateRitual(type);
    completeRitual(r.id);
    ritualsCompleted++;
  }

  // 5. Invoke models
  const prompts = [
    'Synthesize organism health report',
    'Analyze phi-coherence across subsystems',
    'Generate sovereignty assertion',
  ];
  let modelsInvoked = 0;
  for (const prompt of prompts) {
    invokeAIModel(prompt);
    modelsInvoked++;
  }

  // 6. Dispatch messages
  const m = createFlowMessage('Cycle Update', `Cycle ${_cycles.length} complete`, 'sovereign-ai', ['founder', 'operator'], 'sovereign-protocol');
  sendFlowMessage(m.id);

  // 7. Voice emission
  emitVoice(`Intelligence cycle ${_cycles.length} complete. Phi alignment: ${PHI.toFixed(3)}`, 'oro');

  // 8. Dual reads
  performDualRead('organism health status');
  performDualRead('phi coherence score');

  // 9. Recital
  const rec = startRecital('Sovereignty is the foundation of intelligence');
  advanceAndCompleteRecital(rec.id, 'φ = 1.618 — the recursion is the proof');

  const intelligenceScore = _clamp(
    (getAbsorbedDocuments().length / Math.max(1, _documents.length)) * 0.4 +
    (_clamp(1 - getAvgModelLatencyMs() / 2000)) * 0.3 +
    PHI_INVERSE * 0.3
  );

  const cycle: IntelligenceContentCycle = {
    id: sovereignId(),
    startedAt: start,
    completedAt: _now(),
    documentsAbsorbed: docsAbsorbed,
    campaignsRun: campaignsRun,
    showsEmitted: showsEmitted,
    ritualsCompleted: ritualsCompleted,
    modelsInvoked: modelsInvoked,
    messagesDispatched: 1,
    voiceEmissions: 1,
    dualReadsPerformed: 2,
    recitalsCompleted: 1,
    replayEventsRecorded: _replayEvents.length,
    intelligenceScore,
  };
  _cycles.push(cycle);
  return cycle;
}

export function getIntelligenceContentCycles(): IntelligenceContentCycle[] { return [..._cycles]; }

// ═══════════════════════════════════════════════════════════════════════════════
// §14  DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

export function getIntelligenceContentDashboard(): IntelligenceContentDashboard {
  const score = _documents.length > 0
    ? _clamp(getAbsorbedDocuments().length / _documents.length)
    : 0;
  return {
    id: 'intelligence-content-dashboard',
    lastRefresh: _now(),
    absorbedDocuments: getAbsorbedDocuments().length,
    pendingAbsorptions: _documents.filter(d => d.state === 'ingested').length,
    activeCampaigns: getActiveCampaigns().length,
    totalShows: _shows.length,
    activeRituals: _rituals.filter(r => r.phase !== 'complete').length,
    modelInvocations: _modelInvocations.length,
    avgModelLatencyMs: Math.round(getAvgModelLatencyMs()),
    messagesQueued: _messages.filter(m => m.status === 'draft' || m.status === 'queued').length,
    voiceEmissions: _voiceEmissions.length,
    replayEvents: _replayEvents.length,
    intelligenceScore: _clamp(score),
    cyclesCompleted: _cycles.length,
    contentHealth: score > 0.7 ? 'thriving' : score > 0.4 ? 'flowing' : score > 0.1 ? 'stalled' : 'degraded',
  };
}
