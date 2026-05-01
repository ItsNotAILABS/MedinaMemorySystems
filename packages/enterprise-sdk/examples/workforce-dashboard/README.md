# Workforce Dashboard Example
## Real-Time Enterprise Workforce Monitoring

A production-ready Next.js dashboard for monitoring and managing MEDINA's 8 φ-scaled workforce agents in real time.

## Features

- Live heartbeat monitoring (873ms pulse)
- Workforce agent status dashboard
- Task queue and invocation
- OMNIS™ governance vote tracking
- Organizational memory browser
- Compliance report generation

## Prerequisites

- Node.js 20+
- MEDINA Enterprise SDK license key
- ICP organism canister deployed

## Installation

```bash
cd workforce-dashboard
npm install
cp .env.example .env.local
# Edit .env.local with your credentials
npm run dev
```

## Environment Variables

```env
MEDINA_LICENSE_KEY=your-license-key
ORGANISM_CANISTER_ID=rrkah-fqaaa-aaaaa-aaaaq-cai
ICP_HOST=https://ic0.app
ORG_NAME=Acme Corp
```

## Dashboard Code

### `app/page.tsx` — Main Dashboard

```tsx
'use client';
import { useEffect, useState } from 'react';
import { MedinaEnterprise } from '@medina/enterprise-sdk';

const PHI = 1.6180339887498948482;

const WORKFORCE_COLORS: Record<string, string> = {
  'W-ANALYST':    '#4F46E5',  // Indigo
  'W-STRATEGIST': '#7C3AED',  // Violet
  'W-BUILDER':    '#2563EB',  // Blue
  'W-GOVERNANCE': '#059669',  // Emerald
  'W-MEMORY':     '#D97706',  // Amber
  'W-RISK':       '#DC2626',  // Red
  'W-PROJECTION': '#0891B2',  // Cyan
  'W-OPERATIONS': '#65A30D',  // Lime
};

const WORKFORCE_CYCLES: Record<string, number> = {
  'W-ANALYST':    1.000,
  'W-STRATEGIST': PHI,
  'W-BUILDER':    PHI * PHI,
  'W-GOVERNANCE': PHI * PHI,
  'W-MEMORY':     PHI * PHI * PHI,
  'W-RISK':       1 / PHI,
  'W-PROJECTION': PHI,
  'W-OPERATIONS': PHI,
};

interface WorkforceAgent {
  type: string;
  status: 'active' | 'idle' | 'busy' | 'offline';
  tasksCompleted: number;
  cyclesUsed: number;
  lastActivity: Date;
}

export default function WorkforceDashboard() {
  const [heartbeat, setHeartbeat] = useState(0);
  const [agents, setAgents] = useState<WorkforceAgent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [enterprise, setEnterprise] = useState<MedinaEnterprise | null>(null);

  useEffect(() => {
    const client = new MedinaEnterprise({
      canisterId: process.env.NEXT_PUBLIC_ORGANISM_CANISTER_ID!,
      host: process.env.NEXT_PUBLIC_ICP_HOST!,
      organization: {
        name: process.env.NEXT_PUBLIC_ORG_NAME!,
        tier: 'enterprise',
        licenseKey: process.env.MEDINA_LICENSE_KEY!,
      },
    });

    client.connect().then(async () => {
      setIsConnected(true);
      setEnterprise(client);

      // Initialize workforce agents
      const workforce = await client.workforce.spawnAll();
      setAgents(workforce);

      // Subscribe to real-time heartbeat
      client.sovereignty.subscribe('heartbeat', (beat) => {
        setHeartbeat(beat.count);
      });

      // Subscribe to workforce status changes
      client.workforce.subscribe('status', (update) => {
        setAgents(prev =>
          prev.map(a => a.type === update.type ? { ...a, ...update } : a)
        );
      });
    });

    return () => { client?.disconnect(); };
  }, []);

  const invokeAgent = async (type: string) => {
    if (!enterprise) return;
    await enterprise.workforce.invoke({
      type,
      task: 'health-check',
      data: { timestamp: Date.now() },
    });
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">MEDINA™ Enterprise</h1>
          <p className="text-gray-400">Workforce Operations Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            isConnected ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isConnected ? 'bg-green-400' : 'bg-red-400'
            }`} />
            {isConnected ? 'Connected' : 'Connecting...'}
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono text-violet-400">♥ {heartbeat}</div>
            <div className="text-xs text-gray-500">873ms heartbeat</div>
          </div>
        </div>
      </div>

      {/* φ constant badge */}
      <div className="mb-6 text-xs text-gray-600 font-mono">
        φ = {PHI} | Heartbeat = φ⁴ × (1000/7.83) = 873ms
      </div>

      {/* Workforce Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {agents.map((agent) => (
          <div
            key={agent.type}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-300">{agent.type}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                agent.status === 'active' ? 'bg-green-900/50 text-green-400' :
                agent.status === 'busy'   ? 'bg-yellow-900/50 text-yellow-400' :
                agent.status === 'idle'   ? 'bg-gray-800 text-gray-500' :
                                            'bg-red-900/50 text-red-400'
              }`}>
                {agent.status}
              </span>
            </div>

            {/* Cycle allocation bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Cycles</span>
                <span>{WORKFORCE_CYCLES[agent.type].toFixed(3)}M</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(WORKFORCE_CYCLES[agent.type] / (PHI * PHI * PHI)) * 100}%`,
                    backgroundColor: WORKFORCE_COLORS[agent.type],
                  }}
                />
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div>Tasks: {agent.tasksCompleted}</div>
              <div>Cycles used: {(agent.cyclesUsed / 1e6).toFixed(2)}M</div>
            </div>

            <button
              onClick={() => invokeAgent(agent.type)}
              className="mt-3 w-full text-xs py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300"
            >
              Invoke
            </button>
          </div>
        ))}
      </div>

      {/* Total cycles summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Total Cycle Budget</h2>
        <div className="text-3xl font-bold text-violet-400 font-mono">
          15.944M cycles
        </div>
        <div className="text-xs text-gray-600 mt-1">≈ 10×φ | φ-harmonic total allocation</div>
      </div>
    </main>
  );
}
```

## Running in Production

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel
vercel --prod
```

## Deployment

This example is designed to be deployed alongside your MEDINA organism on ICP. The dashboard connects directly to the organism canister via the Enterprise SDK.

---

**MEDINA TECH | Enterprise SDK | Workforce Dashboard | 2026**
