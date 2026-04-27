/**
 * Sovereign AI Hub — Background Service Worker
 * AGI Orchestrator routing 10 Alpha Script AIs through MERIDIAN architecture.
 */

const API_BASE = 'http://localhost:3000';
const JARVIS_API = `${API_BASE}/api/jarvis`;
const CHAT_API = `${API_BASE}/api/chat`;

const ALPHA_AIS = [
  { id: 'chronos',     name: 'CHRONOS',     emoji: '⏳', specialty: 'Time, scheduling & calendar intelligence',        domain: 'scheduling, calendars, time management, deadlines, reminders, time zones' },
  { id: 'athena',      name: 'ATHENA',      emoji: '🦉', specialty: 'Research, analysis & strategy',                   domain: 'research, data analysis, strategic planning, competitive intelligence, market research' },
  { id: 'prometheus',  name: 'PROMETHEUS',  emoji: '🔥', specialty: 'Code generation & engineering',                   domain: 'software engineering, code generation, debugging, architecture, algorithms, programming' },
  { id: 'hermes',      name: 'HERMES',      emoji: '📨', specialty: 'Communication, translation & messaging',          domain: 'communication, translation, email drafting, messaging, language, diplomacy' },
  { id: 'apollo',      name: 'APOLLO',      emoji: '🎨', specialty: 'Creative, design & media',                        domain: 'creative writing, design, media production, art direction, branding, storytelling' },
  { id: 'hephaestus',  name: 'HEPHAESTUS',  emoji: '🔨', specialty: 'Infrastructure, deployment & DevOps',             domain: 'infrastructure, deployment, DevOps, CI/CD, cloud architecture, servers, containers' },
  { id: 'artemis',     name: 'ARTEMIS',     emoji: '🛡️', specialty: 'Security, privacy & encryption',                  domain: 'cybersecurity, privacy, encryption, threat analysis, compliance, access control' },
  { id: 'dionysus',    name: 'DIONYSUS',    emoji: '🎭', specialty: 'Entertainment, social & engagement',              domain: 'entertainment, social media, engagement, community, content creation, viral marketing' },
  { id: 'demeter',     name: 'DEMETER',     emoji: '📊', specialty: 'Data, analytics & dashboards',                    domain: 'data analytics, dashboards, visualization, metrics, KPIs, reporting, databases' },
  { id: 'ares',        name: 'ARES',        emoji: '⚔️',  specialty: 'Competitive analysis & market intelligence',      domain: 'competitive analysis, market intelligence, SWOT, industry trends, benchmarking' }
];

// --- Side Panel Behavior ---
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

// --- Message Router ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender).then(sendResponse).catch(err => {
    sendResponse({ success: false, error: err.message });
  });
  return true;
});

async function handleMessage(message) {
  switch (message.type) {
    case 'LIST_AIS':
      return { success: true, ais: ALPHA_AIS };

    case 'ROUTE_AI':
      return await routeToAI(message.aiId, message.prompt, message.context);

    case 'GENERATE_DOC':
      return await generateDocument(message.docType, message.title, message.context);

    case 'RESEARCH':
      return await runResearch(message.topic, message.context);

    case 'WORKFLOW_RUN':
      return await runWorkflow(message.workflow);

    case 'PROMPT_LIBRARY':
      return await handlePromptLibrary(message.action, message.data);

    case 'FEED':
      return await getIntelligenceFeed();

    case 'PING':
      return await pingServer();

    default:
      return { success: false, error: `Unknown message type: ${message.type}` };
  }
}

// --- AI Routing ---
async function routeToAI(aiId, prompt, context) {
  const ai = ALPHA_AIS.find(a => a.id === aiId);
  if (!ai) return { success: false, error: `Unknown AI: ${aiId}` };

  const systemPrefix = `You are ${ai.name} (${ai.emoji}), a sovereign AI specializing in ${ai.domain}. ` +
    `Respond as ${ai.name} with deep expertise in your domain. Be precise, actionable, and authoritative.`;

  const fullPrompt = context
    ? `${systemPrefix}\n\nPage context: ${context}\n\nUser request: ${prompt}`
    : `${systemPrefix}\n\nUser request: ${prompt}`;

  try {
    const response = await callAPI(fullPrompt);
    return { success: true, ai: ai.name, emoji: ai.emoji, response };
  } catch (err) {
    return { success: false, ai: ai.name, error: err.message };
  }
}

async function callAPI(prompt) {
  const endpoints = [JARVIS_API, CHAT_API];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, prompt })
      });
      if (!res.ok) continue;
      const data = await res.json();
      return data.response || data.reply || data.message || JSON.stringify(data);
    } catch {
      continue;
    }
  }
  throw new Error('All API endpoints unreachable. Ensure the NOVA OVO server is running on localhost:3000.');
}

// --- Document Generator ---
const DOC_TEMPLATES = {
  report:   { label: 'Report',   prompt: 'Generate a detailed professional report on the following topic. Include an executive summary, key findings, analysis, and recommendations.' },
  summary:  { label: 'Summary',  prompt: 'Create a concise executive summary of the following. Highlight the most important points, key takeaways, and action items.' },
  analysis: { label: 'Analysis', prompt: 'Perform a thorough analysis of the following topic. Include data points, trends, strengths, weaknesses, and conclusions.' },
  proposal: { label: 'Proposal', prompt: 'Draft a professional proposal for the following. Include objectives, methodology, timeline, deliverables, and expected outcomes.' },
  email:    { label: 'Email',    prompt: 'Compose a professional email about the following topic. Use appropriate tone, clear subject line, and actionable closing.' },
  brief:    { label: 'Brief',    prompt: 'Create a strategic brief on the following. Include background, objectives, target audience, key messages, and success metrics.' },
  spec:     { label: 'Spec',     prompt: 'Write a technical specification for the following. Include requirements, architecture, interfaces, constraints, and acceptance criteria.' },
  plan:     { label: 'Plan',     prompt: 'Develop a comprehensive plan for the following. Include phases, milestones, resources, risks, and timeline.' }
};

async function generateDocument(docType, title, context) {
  const template = DOC_TEMPLATES[docType];
  if (!template) return { success: false, error: `Unknown document type: ${docType}` };

  const prompt = `${template.prompt}\n\nTitle: ${title}\n${context ? `Context from current page:\n${context}` : ''}`;

  try {
    const response = await callAPI(prompt);
    const doc = {
      id: `doc_${Date.now()}`,
      type: docType,
      label: template.label,
      title,
      content: response,
      createdAt: new Date().toISOString()
    };

    const stored = await getFromStorage('hub_documents') || [];
    stored.unshift(doc);
    await saveToStorage('hub_documents', stored.slice(0, 50));

    return { success: true, document: doc };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// --- Research Workflow ---
async function runResearch(topic, context) {
  const steps = [
    { id: 'gather',     label: 'Gathering Sources',   prompt: `You are a research assistant. Gather and list key sources, facts, and data points about: ${topic}. ${context ? `Additional context: ${context}` : ''} List at least 5 key findings with details.` },
    { id: 'analyze',    label: 'Analyzing Data',       prompt: `You are an analyst. Given this research topic: ${topic}, analyze the key patterns, trends, correlations, and insights. Provide structured analysis with evidence.` },
    { id: 'synthesize', label: 'Synthesizing Insights', prompt: `You are a strategic synthesizer. For the topic: ${topic}, combine all gathered data and analysis into a coherent narrative. Identify the overarching themes and their implications.` },
    { id: 'conclude',   label: 'Drawing Conclusions',  prompt: `You are a senior advisor. For the topic: ${topic}, provide final conclusions, actionable recommendations, and a prioritized list of next steps. Be specific and practical.` }
  ];

  const results = [];
  for (const step of steps) {
    try {
      const response = await callAPI(step.prompt);
      results.push({ ...step, status: 'complete', response });
    } catch (err) {
      results.push({ ...step, status: 'error', error: err.message });
    }
  }

  const report = {
    id: `research_${Date.now()}`,
    topic,
    steps: results,
    createdAt: new Date().toISOString()
  };

  const stored = await getFromStorage('hub_research') || [];
  stored.unshift(report);
  await saveToStorage('hub_research', stored.slice(0, 20));

  return { success: true, report };
}

// --- Workflow Engine ---
async function runWorkflow(workflow) {
  if (!workflow || !workflow.steps || workflow.steps.length === 0) {
    return { success: false, error: 'Workflow has no steps.' };
  }

  const results = [];
  let previousOutput = '';

  for (const step of workflow.steps) {
    const ai = ALPHA_AIS.find(a => a.id === step.aiId);
    if (!ai) {
      results.push({ step: step.name, status: 'error', error: `Unknown AI: ${step.aiId}` });
      continue;
    }

    const prompt = previousOutput
      ? `${step.action}\n\nPrevious step output:\n${previousOutput}`
      : step.action;

    try {
      const result = await routeToAI(step.aiId, prompt);
      previousOutput = result.response || '';
      results.push({ step: step.name, ai: ai.name, emoji: ai.emoji, status: 'complete', response: result.response });
    } catch (err) {
      results.push({ step: step.name, ai: ai.name, status: 'error', error: err.message });
      previousOutput = '';
    }
  }

  return { success: true, workflowName: workflow.name, results };
}

// --- Prompt Library ---
async function handlePromptLibrary(action, data) {
  let prompts = await getFromStorage('hub_prompts') || [];

  switch (action) {
    case 'list':
      return { success: true, prompts };

    case 'create': {
      const newPrompt = {
        id: `prompt_${Date.now()}`,
        name: data.name || 'Untitled',
        category: data.category || 'General',
        text: data.text || '',
        variables: data.variables || [],
        createdAt: new Date().toISOString()
      };
      prompts.unshift(newPrompt);
      await saveToStorage('hub_prompts', prompts);
      return { success: true, prompt: newPrompt, prompts };
    }

    case 'update': {
      const idx = prompts.findIndex(p => p.id === data.id);
      if (idx === -1) return { success: false, error: 'Prompt not found' };
      prompts[idx] = { ...prompts[idx], ...data, updatedAt: new Date().toISOString() };
      await saveToStorage('hub_prompts', prompts);
      return { success: true, prompt: prompts[idx], prompts };
    }

    case 'delete': {
      prompts = prompts.filter(p => p.id !== data.id);
      await saveToStorage('hub_prompts', prompts);
      return { success: true, prompts };
    }

    default:
      return { success: false, error: `Unknown prompt action: ${action}` };
  }
}

// --- Intelligence Feed ---
async function getIntelligenceFeed() {
  const docs = await getFromStorage('hub_documents') || [];
  const research = await getFromStorage('hub_research') || [];
  const prompts = await getFromStorage('hub_prompts') || [];
  const workflows = await getFromStorage('hub_workflows') || [];

  const feed = [];

  docs.slice(0, 5).forEach(d => {
    feed.push({ type: 'document', icon: '📄', title: `${d.label}: ${d.title}`, time: d.createdAt });
  });
  research.slice(0, 5).forEach(r => {
    feed.push({ type: 'research', icon: '🔬', title: `Research: ${r.topic}`, time: r.createdAt });
  });
  prompts.slice(0, 5).forEach(p => {
    feed.push({ type: 'prompt', icon: '📚', title: `Prompt: ${p.name}`, time: p.createdAt });
  });
  workflows.slice(0, 5).forEach(w => {
    feed.push({ type: 'workflow', icon: '⚡', title: `Workflow: ${w.name}`, time: w.createdAt });
  });

  feed.sort((a, b) => new Date(b.time) - new Date(a.time));

  return { success: true, feed: feed.slice(0, 20) };
}

// --- Server Ping ---
async function pingServer() {
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'ping' })
    });
    return { success: res.ok, status: res.ok ? 'online' : 'error' };
  } catch {
    return { success: false, status: 'offline' };
  }
}

// --- Storage Helpers ---
function getFromStorage(key) {
  return new Promise(resolve => {
    chrome.storage.local.get([key], result => resolve(result[key]));
  });
}

function saveToStorage(key, value) {
  return new Promise(resolve => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
}
