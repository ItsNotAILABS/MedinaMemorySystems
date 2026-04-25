import {
  type ContentFormat, type CampaignFlowStatus, type ModelFamily, type VoicePersona,
  type RitualFlowType, type MessageStatus, type ReplayEventType,
  ingestDocument, absorbDocument, absorbAllPendingDocuments,
  getDocuments, getAbsorbedDocuments, getDocumentsByFormat,
  createContentCampaign, launchCampaign, completeCampaign, getCampaigns, getActiveCampaigns,
  emitShow, getShows, getShowsByType,
  initiateRitual, completeRitual, getRituals, getCompletedRituals,
  createFlowMessage, sendFlowMessage, getFlowMessages, getMessagesByStatus,
  invokeAIModel, getModelInvocations, getInvocationsByModel, getAvgModelLatencyMs,
  emitVoice, getVoiceEmissions, getVoiceEmissionsByPersona,
  performDualRead, getDualReads,
  startRecital, advanceAndCompleteRecital, getRecitals, getCompletedRecitals,
  getReplayEvents, getReplayEventsByType, getCurrentReplaySessionId,
  runIntelligenceContentCycle, getIntelligenceContentCycles, getIntelligenceContentDashboard,
} from '../lib/intelligenceContentFlow';

describe('Intelligence Content Flow — Document Absorption', () => {
  it('ingestDocument creates a document in ingested state', () => {
    const doc = ingestDocument('AGI Whitepaper', 'research', 'Content about AGI...');
    expect(doc.id).toBeTruthy();
    expect(doc.state).toBe('ingested');
    expect(doc.format).toBe('research');
    expect(doc.researchClassified).toBe(true);
    expect(doc.sizeChars).toBeGreaterThan(0);
    expect(doc.phiFrequency).toBeGreaterThan(0);
  });

  it('absorbDocument transitions through states to absorbed', () => {
    const doc = ingestDocument('Tech Report', 'pdf', 'PDF content here');
    const result = absorbDocument(doc.id);
    expect(result!.state).toBe('absorbed');
    expect(result!.absorbedAt).toBeTruthy();
    expect(result!.intelligenceFragments).toBeGreaterThanOrEqual(0);
    expect(result!.patternsExtracted).toBeGreaterThanOrEqual(0);
    expect(result!.kernelsEmbedded).toBeGreaterThanOrEqual(0);
    expect(result!.absorptionScore).toBeGreaterThanOrEqual(0);
  });

  it('absorbDocument returns undefined for unknown id', () => {
    expect(absorbDocument('ghost')).toBeUndefined();
  });

  it('absorbDocument is idempotent on already-absorbed document', () => {
    const doc = ingestDocument('Memo', 'text', 'Memo content');
    absorbDocument(doc.id);
    const result = absorbDocument(doc.id);
    expect(result!.state).toBe('absorbed');
  });

  it('getAbsorbedDocuments returns only absorbed', () => {
    for (const d of getAbsorbedDocuments()) expect(d.state).toBe('absorbed');
  });

  it('getDocumentsByFormat filters correctly', () => {
    ingestDocument('Code file', 'code', 'console.log("hello")');
    const code = getDocumentsByFormat('code');
    expect(code.length).toBeGreaterThan(0);
    for (const d of code) expect(d.format).toBe('code');
  });

  it('absorbAllPendingDocuments processes all ingested', () => {
    ingestDocument('Pending 1', 'text', 'text');
    ingestDocument('Pending 2', 'markdown', 'markdown');
    const results = absorbAllPendingDocuments();
    for (const d of results) expect(d.state).toBe('absorbed');
  });
});

describe('Intelligence Content Flow — Campaigns', () => {
  it('createContentCampaign returns a draft campaign', () => {
    const c = createContentCampaign('Awareness Drive', 'awareness', 'enterprise clients');
    expect(c.id).toBeTruthy();
    expect(c.status).toBe('draft');
    expect(c.autoManaged).toBe(true);
  });

  it('launchCampaign activates a campaign', () => {
    const c = createContentCampaign('Launch Test', 'conversion', 'all users');
    const result = launchCampaign(c.id);
    expect(result!.status).toBe('active');
    expect(result!.impressions).toBeGreaterThan(0);
    expect(result!.showsScheduled).toBeGreaterThan(0);
  });

  it('completeCampaign marks as completed', () => {
    const c = createContentCampaign('Complete Test', 'retention', 'premium users');
    launchCampaign(c.id);
    const result = completeCampaign(c.id);
    expect(result!.status).toBe('completed');
    expect(result!.completedAt).toBeTruthy();
  });

  it('getActiveCampaigns returns only active', () => {
    for (const c of getActiveCampaigns()) expect(c.status).toBe('active');
  });
});

describe('Intelligence Content Flow — Shows', () => {
  it('emitShow creates an absorbed show', () => {
    const show = emitShow('Sovereign Broadcast #1', 'sovereign-broadcast');
    expect(show.id).toBeTruthy();
    expect(show.status).toBe('absorbed');
    expect(show.amplificationFactor).toBeGreaterThan(1);
    expect(show.absorbedByCount).toBeGreaterThan(0);
  });

  it('getShowsByType filters correctly', () => {
    emitShow('Data Report A', 'data-report');
    for (const s of getShowsByType('data-report')) expect(s.type).toBe('data-report');
  });

  it('shows accumulate', () => {
    const before = getShows().length;
    emitShow('Narrative Show', 'narrative');
    expect(getShows().length).toBe(before + 1);
  });
});

describe('Intelligence Content Flow — Rituals', () => {
  it('initiateRitual creates a ritual', () => {
    const r = initiateRitual('knowledge-ingestion');
    expect(r.id).toBeTruthy();
    expect(r.type).toBe('knowledge-ingestion');
    expect(r.phase).toBe('initiating');
    expect(r.resonanceScore).toBeGreaterThanOrEqual(0);
  });

  it('completeRitual marks as complete', () => {
    const r = initiateRitual('sovereign-assertion');
    const result = completeRitual(r.id);
    expect(result!.phase).toBe('complete');
    expect(result!.completedAt).toBeTruthy();
    expect(['success', 'evolved']).toContain(result!.outcome);
  });

  it('completeRitual returns undefined for unknown id', () => {
    expect(completeRitual('ghost')).toBeUndefined();
  });

  it('getCompletedRituals returns only complete', () => {
    for (const r of getCompletedRituals()) expect(r.phase).toBe('complete');
  });
});

describe('Intelligence Content Flow — Messages', () => {
  it('createFlowMessage creates a draft message', () => {
    const m = createFlowMessage('Update', 'Cycle complete', 'sovereign-ai', ['founder'], 'text');
    expect(m.id).toBeTruthy();
    expect(m.status).toBe('draft');
    expect(m.deliveredCount).toBe(0);
  });

  it('sendFlowMessage delivers the message', () => {
    const m = createFlowMessage('Notification', 'System OK', 'ai', ['user1', 'user2'], 'text');
    const result = sendFlowMessage(m.id);
    expect(result!.status).toBe('delivered');
    expect(result!.deliveredCount).toBe(2);
    expect(result!.sentAt).toBeTruthy();
  });

  it('getMessagesByStatus filters correctly', () => {
    for (const m of getMessagesByStatus('delivered')) expect(m.status).toBe('delivered');
  });
});

describe('Intelligence Content Flow — Model Routing', () => {
  it('invokeAIModel returns a valid invocation', () => {
    const inv = invokeAIModel('Analyze organism health');
    expect(inv.id).toBeTruthy();
    expect(inv.response).toBeTruthy();
    expect(inv.confidence).toBeGreaterThanOrEqual(0);
    expect(inv.confidence).toBeLessThanOrEqual(1);
    expect(inv.tokensIn).toBeGreaterThan(0);
    expect(inv.tokensOut).toBeGreaterThan(0);
    expect(inv.latencyMs).toBeGreaterThan(0);
  });

  it('invokeAIModel uses preferred model when specified', () => {
    const inv = invokeAIModel('Phi sovereign test', 'phi-sovereign');
    expect(inv.model).toBe('phi-sovereign');
  });

  it('getAvgModelLatencyMs returns positive number', () => {
    expect(getAvgModelLatencyMs()).toBeGreaterThan(0);
  });

  it('getInvocationsByModel filters correctly', () => {
    invokeAIModel('Claude test', 'claude-3');
    const invs = getInvocationsByModel('claude-3');
    expect(invs.length).toBeGreaterThan(0);
    for (const i of invs) expect(i.model).toBe('claude-3');
  });
});

describe('Intelligence Content Flow — Voice', () => {
  it('emitVoice creates a voice emission', () => {
    const v = emitVoice('Sovereign greetings, organism initialized', 'oro');
    expect(v.id).toBeTruthy();
    expect(v.persona).toBe('oro');
    expect(v.durationMs).toBeGreaterThan(0);
    expect(v.frequency).toBeGreaterThan(0);
    expect(v.phiModulated).toBe(true);
    expect(v.received).toBe(true);
  });

  it('getVoiceEmissionsByPersona filters correctly', () => {
    emitVoice('Nova speaks', 'nova');
    for (const v of getVoiceEmissionsByPersona('nova')) expect(v.persona).toBe('nova');
  });
});

describe('Intelligence Content Flow — Dual Read', () => {
  it('performDualRead returns merged results', () => {
    const result = performDualRead('organism sovereignty');
    expect(result.id).toBeTruthy();
    expect(result.query).toBe('organism sovereignty');
    expect(result.semanticResults.length).toBeGreaterThan(0);
    expect(result.resonanceResults.length).toBeGreaterThan(0);
    expect(result.mergedResults.length).toBeGreaterThanOrEqual(
      result.semanticResults.length + result.resonanceResults.length
    );
    expect(result.phiWeight).toBeGreaterThan(0);
  });

  it('getDualReads accumulates', () => {
    const before = getDualReads().length;
    performDualRead('test query');
    expect(getDualReads().length).toBe(before + 1);
  });
});

describe('Intelligence Content Flow — Recital', () => {
  it('startRecital creates a recital in initiated phase', () => {
    const r = startRecital('The organism is the proof');
    expect(r.id).toBeTruthy();
    expect(r.phase).toBe('initiated');
    expect(r.beats).toBe(0);
  });

  it('advanceAndCompleteRecital completes the recital', () => {
    const r = startRecital('φ = 1.618');
    const result = advanceAndCompleteRecital(r.id, 'Proof complete');
    expect(result!.phase).toBe('complete');
    expect(result!.output).toBe('Proof complete');
    expect(result!.beats).toBeGreaterThan(0);
    expect(result!.resonanceScore).toBeGreaterThanOrEqual(0);
    expect(result!.completedAt).toBeTruthy();
  });

  it('getCompletedRecitals returns only complete', () => {
    for (const r of getCompletedRecitals()) expect(r.phase).toBe('complete');
  });
});

describe('Intelligence Content Flow — Replay', () => {
  it('getReplayEvents returns events', () => {
    expect(Array.isArray(getReplayEvents())).toBe(true);
  });

  it('getCurrentReplaySessionId returns a session id after activity', () => {
    expect(getCurrentReplaySessionId()).toBeTruthy();
  });

  it('getReplayEventsByType filters correctly', () => {
    for (const e of getReplayEventsByType('model-invoked')) {
      expect(e.type).toBe('model-invoked');
    }
  });
});

describe('Intelligence Content Flow — Cycle & Dashboard', () => {
  it('runIntelligenceContentCycle returns a complete cycle', () => {
    const cycle = runIntelligenceContentCycle();
    expect(cycle.id).toBeTruthy();
    expect(cycle.documentsAbsorbed).toBe(3);
    expect(cycle.campaignsRun).toBe(3);
    expect(cycle.showsEmitted).toBe(3);
    expect(cycle.ritualsCompleted).toBe(3);
    expect(cycle.modelsInvoked).toBe(3);
    expect(cycle.intelligenceScore).toBeGreaterThanOrEqual(0);
    expect(cycle.intelligenceScore).toBeLessThanOrEqual(1);
  });

  it('getIntelligenceContentCycles accumulates', () => {
    const before = getIntelligenceContentCycles().length;
    runIntelligenceContentCycle();
    expect(getIntelligenceContentCycles().length).toBeGreaterThan(before);
  });

  it('getIntelligenceContentDashboard returns correct structure', () => {
    const dash = getIntelligenceContentDashboard();
    expect(dash.id).toBe('intelligence-content-dashboard');
    expect(dash.absorbedDocuments).toBeGreaterThan(0);
    expect(dash.modelInvocations).toBeGreaterThan(0);
    expect(dash.intelligenceScore).toBeGreaterThanOrEqual(0);
    expect(dash.intelligenceScore).toBeLessThanOrEqual(1);
    expect(['thriving', 'flowing', 'stalled', 'degraded']).toContain(dash.contentHealth);
  });
});
