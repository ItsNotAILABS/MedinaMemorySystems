# MEDINA CLI
## Command-Line Interface for Organism Management

**Package**: `@medina/cli`
**Version**: `1.0.0`
**Purpose**: Production CLI tool for managing MEDINA organisms

---

## Overview

The MEDINA CLI provides a comprehensive command-line interface for deploying, managing, and monitoring MEDINA organisms on the Internet Computer. Built for developers and DevOps teams.

---

## Installation

### From npm
```bash
npm install -g @medina/cli
```

### From source
```bash
cd apps/medina-cli
npm install
npm run build
npm link
```

---

## Quick Start

```bash
# Initialize configuration
medina init

# Deploy a new organism
medina deploy --network ic --identity default

# Check organism status
medina status --canister rdmx6-jaaaa-aaaaa-aaadq-cai

# Monitor live heartbeat (873ms pulse)
medina pulse --watch

# Query organism state
medina query getState

# Invoke organism functions
medina call recognize --args '{"pattern": "user_behavior"}'

# View workforce agents
medina workforce list

# Submit governance proposal
medina governance propose "Increase heartbeat to 1000ms"

# Export memory
medina memory export --format json --output ./memories.json
```

---

## Commands

### `medina init`
Initialize MEDINA configuration in current directory

**Options**:
- `--network <network>` - Target network (local, ic)
- `--identity <name>` - DFX identity to use

**Example**:
```bash
medina init --network ic --identity production
```

Creates `.medinarc` configuration file.

---

### `medina deploy`
Deploy organism canister to Internet Computer

**Options**:
- `--network <network>` - Target network
- `--identity <name>` - DFX identity
- `--with-args <json>` - Constructor arguments
- `--cycles <amount>` - Initial cycles

**Example**:
```bash
medina deploy \
  --network ic \
  --identity default \
  --with-args '{"consciousness": "Dolphin"}' \
  --cycles 5000000000000
```

---

### `medina status`
Get organism status and health metrics

**Options**:
- `--canister <id>` - Canister ID
- `--json` - Output as JSON
- `--watch` - Continuous monitoring

**Example**:
```bash
medina status --canister rdmx6-jaaaa-aaaaa-aaadq-cai --watch
```

**Output**:
```
┌─────────────────────────────────────────┐
│  MEDINA Organism Status                 │
├─────────────────────────────────────────┤
│  Canister ID: rdmx6-jaaaa-aaaaa-aaadq-cai
│  Status: Running ✓
│  Heartbeat: 873ms (φ⁴ × 138ms)
│  Uptime: 3 days 14 hours
│  Cycles: 4.2T
│  Memory: 142.7 MB / 4 GB
│
│  Heart Status: Beating ♥
│  BPM: 68.7 (φ-harmonic)
│  Oxygen: 97.3%
│
│  Workforce: 8 agents active
│  Memories: 1,247 crystallized
│  Intelligence: 823 modules loaded
└─────────────────────────────────────────┘
```

---

### `medina pulse`
Monitor organism heartbeat in real-time

**Options**:
- `--watch` - Continuous monitoring
- `--interval <ms>` - Update interval (default: 873)

**Example**:
```bash
medina pulse --watch
```

**Output**:
```
♥ Beat #1,247  873ms  φ-sync: 99.8%
♥ Beat #1,248  873ms  φ-sync: 99.9%
♥ Beat #1,249  872ms  φ-sync: 99.7%
```

---

### `medina query <method>`
Query organism state (read-only)

**Arguments**:
- `<method>` - Query method name

**Options**:
- `--args <json>` - Method arguments
- `--json` - Output as JSON

**Example**:
```bash
medina query getState
medina query getMemory --args '{"index": 42}'
```

---

### `medina call <method>`
Call organism method (update call)

**Arguments**:
- `<method>` - Method name

**Options**:
- `--args <json>` - Method arguments
- `--cycles <amount>` - Cycles to attach

**Example**:
```bash
medina call recognize --args '{"pattern": "user_login"}'
medina call crystallizeMemory --args '{"data": "important_event"}'
```

---

### `medina workforce`
Manage workforce agents

**Subcommands**:
- `list` - List all agents
- `status <agent>` - Get agent status
- `scale <agent> <factor>` - Scale agent (φ-proportional)

**Example**:
```bash
# List all 8 workforce agents
medina workforce list

# Check specific agent
medina workforce status Strategist

# Scale agent capacity
medina workforce scale Engineer 1.618
```

---

### `medina governance`
Governance and voting

**Subcommands**:
- `propose <title>` - Create proposal
- `vote <id> <choice>` - Vote on proposal
- `list` - List proposals
- `status <id>` - Get proposal status

**Example**:
```bash
# Create proposal
medina governance propose "Enable quantum features" \
  --description "Activate quantum coherence modules" \
  --expiry 7d

# Vote (OMNIS™ 43-core voting)
medina governance vote 42 yes

# List active proposals
medina governance list --status active
```

---

### `medina memory`
Memory management

**Subcommands**:
- `export` - Export memories
- `import` - Import memories
- `query` - Query memory
- `stats` - Memory statistics

**Example**:
```bash
# Export all memories
medina memory export --format json --output memories.json

# Import memories
medina memory import memories.json

# Query with Fibonacci indexing
medina memory query --index F21 --range 10

# Get statistics
medina memory stats
```

---

### `medina intelligence`
Intelligence module management

**Subcommands**:
- `list` - List all 823+ modules
- `info <module>` - Module information
- `test <module>` - Test module
- `benchmark` - Run benchmarks

**Example**:
```bash
# List neural pillar modules
medina intelligence list --pillar neural

# Get module info
medina intelligence info NeuralCore

# Run benchmarks
medina intelligence benchmark --suite adaptation
```

---

### `medina logs`
View organism logs

**Options**:
- `--follow` - Follow logs in real-time
- `--lines <n>` - Number of lines
- `--filter <pattern>` - Filter by pattern

**Example**:
```bash
medina logs --follow --filter "error"
```

---

### `medina upgrade`
Upgrade organism canister

**Options**:
- `--wasm <path>` - WASM module path
- `--args <json>` - Upgrade arguments

**Example**:
```bash
medina upgrade --wasm ./organism_v2.wasm
```

---

## Configuration

### `.medinarc`

```json
{
  "network": "ic",
  "identity": "default",
  "canister_id": "rdmx6-jaaaa-aaaaa-aaadq-cai",
  "license_key": "MEDINA-ENT-...",
  "preferences": {
    "auto_watch": true,
    "heartbeat_interval": 873,
    "json_output": false
  }
}
```

---

## Environment Variables

```bash
# Organism configuration
MEDINA_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai
MEDINA_NETWORK=ic
MEDINA_IDENTITY=default

# License
MEDINA_LICENSE_KEY=MEDINA-ENT-XXXXXX

# API endpoints (optional)
MEDINA_API_URL=https://api.medina.tech
```

---

## Advanced Usage

### Scripting with JSON output

```bash
# Get status as JSON for automation
STATUS=$(medina status --json)
echo $STATUS | jq '.heartbeat'

# Monitor and alert
medina pulse --watch --json | while read line; do
  if echo $line | jq '.sync < 95'; then
    alert "Organism out of φ-sync!"
  fi
done
```

### CI/CD Integration

```yaml
# .github/workflows/deploy.yml
- name: Deploy organism
  run: |
    medina init --network ic
    medina deploy --cycles 5T
    medina status --canister ${{ secrets.CANISTER_ID }}
```

---

## Production Features

✅ **φ-Harmonic Operations** - All timings use 873ms = φ⁴ × (1000/7.83)
✅ **Real-time Monitoring** - Watch mode for live updates
✅ **OMNIS™ Governance** - 43-core voting via CLI
✅ **Workforce Management** - Scale 8 agents with golden ratio
✅ **Memory Export/Import** - Fibonacci-indexed data portability
✅ **Intelligence Testing** - Validate all 823 modules
✅ **Multi-network** - Local, testnet, mainnet support
✅ **JSON Output** - Machine-readable for automation

---

## Requirements

- Node.js 20+
- DFX 0.15+ (for ICP deployment)
- MEDINA Enterprise SDK license (for production use)

---

## Support

**Documentation**: https://docs.medina.tech/cli
**Issues**: https://github.com/medinatech/medina-cli/issues
**Email**: support@medinatech.com

---

**MEDINA TECH | ALFREDO MEDINA HERNANDEZ | DALLAS TX | 2026**

**COPYRIGHT © 2024-2026 ALFREDO MEDINA HERNANDEZ. ALL RIGHTS RESERVED.**
