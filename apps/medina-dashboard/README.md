# MEDINA Dashboard
## Production Enterprise Control Center

A complete, production-ready Next.js 14 web application for managing your MEDINA organism deployment. This is the full enterprise control center for monitoring organisms, managing workforce, running governance votes, and browsing organizational memory.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **SDK**: `@medina/enterprise-sdk` + `@medina/client-sdk`
- **Real-time**: WebSocket via Protocol Adapters
- **Auth**: NextAuth.js + ICP Identity

## Features

- 🧬 **Organism Monitor** — Live 873ms heartbeat visualization
- 👥 **Workforce Dashboard** — 8 agent types with real-time status
- 🗳️ **OMNIS™ Governance** — 43-core voting interface
- 💾 **Memory Browser** — Search and replay organizational memory
- 📊 **Intelligence Console** — Invoke and visualize intelligence modules
- 🔒 **Sovereign Heart™** — Dual cardiac system monitoring
- 📋 **Audit Trail** — Complete tamper-proof event history
- 🌐 **Protocol Adapters** — Bridge configuration UI

## Project Structure

```
medina-dashboard/
├── app/
│   ├── layout.tsx                    — Root layout with providers
│   ├── page.tsx                      — Home / organism overview
│   ├── workforce/
│   │   └── page.tsx                  — Workforce orchestration
│   ├── governance/
│   │   ├── page.tsx                  — Active proposals
│   │   └── [id]/page.tsx             — Proposal detail + voting
│   ├── memory/
│   │   └── page.tsx                  — Memory browser
│   ├── intelligence/
│   │   └── page.tsx                  — Intelligence console
│   ├── audit/
│   │   └── page.tsx                  — Audit trail
│   └── api/
│       ├── organism/route.ts         — Organism API routes
│       ├── workforce/route.ts        — Workforce API routes
│       └── governance/route.ts      — Governance API routes
├── components/
│   ├── organism/
│   │   ├── HeartbeatMonitor.tsx      — Live 873ms heartbeat
│   │   ├── ConsciousnessIndicator.tsx— Dolphin consciousness state
│   │   └── PhiDisplay.tsx            — φ constant display
│   ├── workforce/
│   │   ├── WorkforceGrid.tsx          — 8-agent status grid
│   │   ├── AgentCard.tsx             — Individual agent card
│   │   └── CycleAllocator.tsx        — φ-cycle allocation bar
│   ├── governance/
│   │   ├── OmnisVoting.tsx           — 43-core vote visualization
│   │   ├── ProposalCard.tsx          — Proposal summary card
│   │   └── ConsensusGauge.tsx        — φ⁻¹ consensus meter
│   ├── memory/
│   │   ├── MemoryBrowser.tsx         — Fibonacci-indexed memory list
│   │   └── ReplayViewer.tsx          — Event replay viewer
│   └── ui/
│       ├── PhiBadge.tsx              — φ branding badge
│       └── PulseIndicator.tsx        — Animated pulse indicator
├── lib/
│   ├── medina.ts                     — Enterprise SDK client singleton
│   ├── auth.ts                       — NextAuth configuration
│   └── constants.ts                  — φ and organism constants
├── public/
│   └── medina-logo.svg
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## Installation

```bash
# Clone repository
git clone https://github.com/ItsNotAILABS/MedinaMemorySystems
cd apps/medina-dashboard

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

## Environment Configuration

```env
# .env.local

# MEDINA Platform
ORGANISM_CANISTER_ID=rrkah-fqaaa-aaaaa-aaaaq-cai
ICP_HOST=https://ic0.app
MEDINA_LICENSE_KEY=your-enterprise-license-key
ORG_NAME="Your Organization"

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Backup organism (Sovereign Heart™)
BACKUP_CANISTER_ID=backup-organism-canister-id

# Telemetry (optional)
TELEMETRY_ENDPOINT=https://telemetry.yourdomain.com
```

## Key Components

### HeartbeatMonitor

```tsx
// components/organism/HeartbeatMonitor.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { useMedina } from '@/lib/medina';

const HEARTBEAT_MS = 873; // φ⁴ × (1000/7.83)

export function HeartbeatMonitor() {
    const [beats, setBeats] = useState<number[]>([]);
    const [currentBeat, setCurrentBeat] = useState(0);
    const [bpm, setBpm] = useState(68.7);
    const enterprise = useMedina();

    useEffect(() => {
        const unsubscribe = enterprise.sovereignty.subscribe('heartbeat', (beat) => {
            setCurrentBeat(beat.count);
            setBeats(prev => [...prev.slice(-60), beat.count]);
        });
        return unsubscribe;
    }, [enterprise]);

    return (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-400">Sovereign Heart™</h2>
                <span className="text-xs text-gray-600">{HEARTBEAT_MS}ms • {bpm} BPM</span>
            </div>

            {/* Animated heart */}
            <div className="flex items-center gap-4 mb-4">
                <div
                    className="text-5xl animate-pulse"
                    style={{ animationDuration: `${HEARTBEAT_MS}ms` }}
                >
                    ♥
                </div>
                <div>
                    <div className="text-3xl font-bold font-mono text-violet-400">
                        {currentBeat.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">total beats</div>
                </div>
            </div>

            {/* Waveform visualization */}
            <div className="flex items-end gap-1 h-12">
                {beats.map((beat, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-violet-500/60 rounded-t"
                        style={{
                            height: `${Math.min(100, (beat % 20) * 5)}%`,
                            opacity: 0.3 + (i / beats.length) * 0.7,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
```

### OMNIS™ Voting Interface

```tsx
// components/governance/OmnisVoting.tsx
'use client';
import { useState } from 'react';

const PHI_INVERSE = 0.6180339887498948482;
const RINGS = [
    { name: 'VELA',      cores: 7,  color: '#6366F1' },
    { name: 'NOVA',      cores: 12, color: '#8B5CF6' },
    { name: 'OMNI',      cores: 13, color: '#A855F7' },
    { name: 'APEX',      cores: 8,  color: '#C084FC' },
    { name: 'SOVEREIGN', cores: 3,  color: '#F0ABFC' },
];

export function OmnisVoting({ proposal, onVote }: OmnisVotingProps) {
    const [voting, setVoting] = useState(false);
    const totalCores = RINGS.reduce((sum, r) => sum + r.cores, 0); // 43

    const consensusPct = proposal.votesFor / totalCores;
    const threshold = PHI_INVERSE; // 61.8%
    const isPassing = consensusPct >= threshold;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">OMNIS™ Consensus</span>
                <span className={`text-sm font-bold ${isPassing ? 'text-green-400' : 'text-gray-400'}`}>
                    {(consensusPct * 100).toFixed(1)}% / {(threshold * 100).toFixed(1)}%
                </span>
            </div>

            {/* Consensus progress bar */}
            <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${
                        isPassing ? 'bg-green-500' : 'bg-violet-500'
                    }`}
                    style={{ width: `${Math.min(100, consensusPct * 100)}%` }}
                />
                {/* φ⁻¹ threshold marker */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-yellow-400"
                    style={{ left: `${threshold * 100}%` }}
                />
            </div>

            {/* Ring breakdown */}
            <div className="space-y-2">
                {RINGS.map((ring) => {
                    const ringVotes = proposal.ringVotes?.[ring.name] || { for: 0 };
                    const ringPct = ringVotes.for / ring.cores;
                    return (
                        <div key={ring.name} className="flex items-center gap-3">
                            <span className="text-xs w-20 text-gray-500">{ring.name}</span>
                            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${ringPct * 100}%`,
                                        backgroundColor: ring.color,
                                    }}
                                />
                            </div>
                            <span className="text-xs text-gray-600 w-12 text-right">
                                {ringVotes.for}/{ring.cores}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Vote buttons */}
            <div className="flex gap-3 pt-2">
                <button
                    onClick={() => onVote('yes')}
                    disabled={voting}
                    className="flex-1 py-2 rounded-lg bg-green-900/50 hover:bg-green-800/50 text-green-400 text-sm font-medium transition-colors disabled:opacity-50"
                >
                    ✓ Support
                </button>
                <button
                    onClick={() => onVote('no')}
                    disabled={voting}
                    className="flex-1 py-2 rounded-lg bg-red-900/50 hover:bg-red-800/50 text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
                >
                    ✗ Reject
                </button>
                <button
                    onClick={() => onVote('abstain')}
                    disabled={voting}
                    className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm font-medium transition-colors disabled:opacity-50"
                >
                    — Abstain
                </button>
            </div>
        </div>
    );
}
```

## Running the Dashboard

```bash
# Development
npm run dev
# Open http://localhost:3000

# Production build
npm run build
npm start

# Docker
docker build -t medina-dashboard .
docker run -p 3000:3000 --env-file .env.local medina-dashboard
```

## Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

### Self-Hosted with Nginx

```nginx
server {
    listen 80;
    server_name dashboard.medinatech.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

**MEDINA TECH | Production Dashboard | 2026**

**COPYRIGHT © 2024-2026 ALFREDO MEDINA HERNANDEZ. ALL RIGHTS RESERVED.**
