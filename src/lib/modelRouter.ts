import { sovereignId } from './sovereign-id';
import type { ModelDefinition, ModelFamily, ModelInvocation } from '@/types';

// ─── Model Registry ───────────────────────────────────────────────────────────

const modelRegistry: ModelDefinition[] = [
  {
    id: 'strategist',
    name: 'Strategist',
    description: 'Macro-level planning, vision synthesis, and sovereign decision support.',
    capabilities: ['long-range planning', 'doctrine synthesis', 'strategic analysis', 'cross-system coordination'],
    status: 'active',
    latency: 420,
    invocationCount: 0,
    color: '#3b82f6',
  },
  {
    id: 'builder',
    name: 'Builder',
    description: 'Construction, code generation, system design, and implementation tasks.',
    capabilities: ['code generation', 'system design', 'API construction', 'integration blueprints'],
    status: 'active',
    latency: 380,
    invocationCount: 0,
    color: '#10b981',
  },
  {
    id: 'analyst',
    name: 'Analyst',
    description: 'Deep data analysis, pattern recognition, and insight extraction.',
    capabilities: ['data analysis', 'pattern recognition', 'trend analysis', 'quantitative reasoning'],
    status: 'active',
    latency: 350,
    invocationCount: 0,
    color: '#6366f1',
  },
  {
    id: 'governance',
    name: 'Governance',
    description: 'Governance workflows, proposal synthesis, audit analysis, and doctrine enforcement.',
    capabilities: ['proposal drafting', 'audit analysis', 'compliance checking', 'doctrine alignment'],
    status: 'active',
    latency: 400,
    invocationCount: 0,
    color: '#f59e0b',
  },
  {
    id: 'memory-curator',
    name: 'Memory Curator',
    description: 'Memory triage, resonance scoring, lineage tracking, and spatial navigation.',
    capabilities: ['memory retrieval', 'resonance scoring', 'lineage tracking', 'coordinate navigation'],
    status: 'active',
    latency: 290,
    invocationCount: 0,
    color: '#8b5cf6',
  },
  {
    id: 'operations',
    name: 'Operations',
    description: 'Day-to-day operational management, task routing, and workflow execution.',
    capabilities: ['task management', 'workflow execution', 'resource allocation', 'status tracking'],
    status: 'active',
    latency: 320,
    invocationCount: 0,
    color: '#ec4899',
  },
  {
    id: 'risk',
    name: 'Risk',
    description: 'Risk identification, threat modeling, and gate enforcement logic.',
    capabilities: ['risk assessment', 'threat modeling', 'gate enforcement', 'anomaly detection'],
    status: 'idle',
    latency: 460,
    invocationCount: 0,
    color: '#ef4444',
  },
  {
    id: 'projection',
    name: 'Projection',
    description: 'Future state projection, scenario modeling, and resonance forecasting.',
    capabilities: ['scenario modeling', 'future projection', 'resonance forecasting', 'trajectory analysis'],
    status: 'idle',
    latency: 510,
    invocationCount: 0,
    color: '#06b6d4',
  },
];

const invocationHistory: ModelInvocation[] = [];

// ─── Routing Logic ────────────────────────────────────────────────────────────

const ROUTING_KEYWORDS: Record<ModelFamily, string[]> = {
  strategist: ['strategy', 'plan', 'vision', 'macro', 'sovereign', 'decide', 'direction', 'goal'],
  builder: ['build', 'create', 'code', 'implement', 'design', 'construct', 'generate', 'develop'],
  analyst: ['analyze', 'analysis', 'data', 'pattern', 'trend', 'insight', 'measure', 'metric'],
  governance: ['govern', 'proposal', 'vote', 'policy', 'doctrine', 'audit', 'compliance', 'enact'],
  'memory-curator': ['memory', 'remember', 'recall', 'store', 'find', 'coordinate', 'lineage', 'resonance'],
  operations: ['operate', 'task', 'workflow', 'execute', 'manage', 'run', 'process', 'schedule'],
  risk: ['risk', 'threat', 'danger', 'secure', 'gate', 'protect', 'vulnerability', 'anomaly'],
  projection: ['project', 'forecast', 'future', 'scenario', 'predict', 'trajectory', 'simulate'],
};

export function routeToModel(prompt: string): ModelFamily {
  const lower = prompt.toLowerCase();
  const scores: Record<ModelFamily, number> = {
    strategist: 0, builder: 0, analyst: 0, governance: 0,
    'memory-curator': 0, operations: 0, risk: 0, projection: 0,
  };

  for (const [family, keywords] of Object.entries(ROUTING_KEYWORDS) as [ModelFamily, string[]][]) {
    for (const kw of keywords) {
      if (lower.includes(kw)) scores[family]++;
    }
  }

  const best = (Object.entries(scores) as [ModelFamily, number][]).reduce(
    (a, b) => (b[1] > a[1] ? b : a),
    ['strategist', 0] as [ModelFamily, number],
  );

  return best[0];
}

// ─── Mock Responses ───────────────────────────────────────────────────────────

const MOCK_RESPONSES: Partial<Record<ModelFamily, string[]>> = {
  strategist: [
    'Strategic analysis complete. The optimal path involves establishing clear doctrine alignment before resource allocation.',
    'Macro-level assessment: Current trajectory supports sovereign objectives. Recommend Gate A reinforcement.',
    'Vision synthesis: Three viable pathways identified. Priority ordering based on resonance alignment.',
  ],
  builder: [
    'Implementation blueprint generated. Component tree structured for optimal modularity.',
    'Code architecture reviewed. Recommend separation of concerns across memory and governance layers.',
    'System design complete. Integration points identified across all model families.',
  ],
  analyst: [
    'Pattern analysis complete. Salience distribution shows clustering in rings 1–3.',
    'Data synthesis: 87% doctrine alignment across active memory entries.',
    'Quantitative review: Model invocation latency trending downward over last 10 beats.',
  ],
  governance: [
    'Governance review complete. All active proposals aligned with standing doctrine.',
    'Compliance check passed. Gate statuses nominal. Recommend opening Gate C amber review.',
    'Doctrine enforcement active. No violations detected in current session.',
  ],
  'memory-curator': [
    'Memory scan complete. 23 high-salience entries identified across rings 1–5.',
    'Lineage trace successful. Root memory anchored at beat 1, ring 1.',
    'Resonance scoring updated. Top entries show 0.94+ combined score.',
  ],
  operations: [
    'Operational status: All workflows nominal. 3 tasks pending scheduling.',
    'Task routing complete. Resources allocated across active model families.',
    'Workflow execution confirmed. Next beat cycle initiating in T+30.',
  ],
  risk: [
    'Risk assessment: Low-medium profile. Gate C amber requires monitoring.',
    'Threat model updated. No critical anomalies detected in current session.',
    'Gate enforcement review: Gates A and B green. Gate C requires attention.',
  ],
  projection: [
    'Projection: Based on current resonance trajectory, 3-beat amplification expected.',
    'Scenario modeling: Two primary futures identified. Dominant scenario (72%): stable expansion.',
    'Forecast: Memory salience will reach 0.95 average within 5 beat cycles at current rate.',
  ],
};

export function invokeModel(
  modelId: ModelFamily,
  prompt: string,
): ModelInvocation {
  const model = modelRegistry.find((m) => m.id === modelId);
  if (!model) throw new Error(`Unknown model: ${modelId}`);

  const responses = MOCK_RESPONSES[modelId] ?? ['Response generated.'];
  const response = responses[Math.floor(Math.random() * responses.length)];
  const latency = model.latency + Math.floor(Math.random() * 100);

  const invocation: ModelInvocation = {
    id: sovereignId(),
    modelId,
    prompt,
    response,
    latency,
    timestamp: new Date().toISOString(),
    tokens: Math.floor(prompt.length / 4) + Math.floor(response.length / 4),
  };

  invocationHistory.push(invocation);
  const idx = modelRegistry.findIndex((m) => m.id === modelId);
  if (idx !== -1) {
    modelRegistry[idx] = { ...modelRegistry[idx], invocationCount: modelRegistry[idx].invocationCount + 1, status: 'active' };
  }

  return invocation;
}

export function getModels(): ModelDefinition[] {
  return [...modelRegistry];
}

export function getModel(id: ModelFamily): ModelDefinition | undefined {
  return modelRegistry.find((m) => m.id === id);
}

export function getInvocationHistory(limit = 20): ModelInvocation[] {
  return invocationHistory.slice(-limit).reverse();
}

export function getModelStats(): {
  totalInvocations: number;
  activeModels: number;
  avgLatency: number;
} {
  const active = modelRegistry.filter((m) => m.status === 'active').length;
  const avgLatency = modelRegistry.reduce((sum, m) => sum + m.latency, 0) / modelRegistry.length;

  return {
    totalInvocations: invocationHistory.length,
    activeModels: active,
    avgLatency: Math.round(avgLatency),
  };
}
