# MEDINA Dev Tools
## Development Utilities for MEDINA Platform

**Package**: `@medina/dev-tools`
**Version**: `1.0.0`
**Purpose**: Code generators, validators, scaffolding, and development utilities

---

## Overview

MEDINA Dev Tools provides comprehensive development utilities for building on the MEDINA platform. Generate boilerplate code, validate implementations, scaffold new projects, and automate common development tasks.

---

## Installation

```bash
npm install -g @medina/dev-tools
```

---

## Quick Start

```bash
# Generate new organism
medina-dev generate organism MyOrganism

# Create intelligence module
medina-dev generate module MyIntelligence --pillar neural

# Scaffold new project
medina-dev scaffold project my-medina-app

# Validate organism implementation
medina-dev validate organism ./src/organism/

# Generate Candid interface
medina-dev generate candid --from Organism.mo

# Create workforce agent
medina-dev generate agent Analyst --capacity phi2

# Generate test suite
medina-dev generate tests --for MyOrganism
```

---

## Commands

### 1. Code Generators

#### Generate Organism

```bash
medina-dev generate organism <name>
```

Creates a new organism implementation with:
- Heartbeat (873ms φ⁴)
- Pattern recognition
- Memory crystallization
- Animal consciousness selection
- φ-harmonic configuration

**Example:**
```bash
medina-dev generate organism MyOrganism --consciousness Dolphin
```

**Output:** `MyOrganism.mo` with complete implementation

---

#### Generate Intelligence Module

```bash
medina-dev generate module <name> --pillar <pillar>
```

Creates a new intelligence module in one of the 7 pillars:
- neural
- cognitive
- emergence
- adaptation
- scalability
- computing
- machine_learning

**Example:**
```bash
medina-dev generate module CustomNeural --pillar neural --type motoko
```

**Generated:**
```motoko
/// CustomNeural.mo
/// Neural pillar intelligence module

import Float "mo:base/Float";
import Constants "../organism/Constants";

module {
    public type State = {
        // Module state
    };

    public func init() : State {
        // Initialize module
    };

    public func process(state: State, input: Float) : Float {
        // Process neural computation
        // Uses φ-harmonic mathematics
        input * Constants.PHI
    };
}
```

---

#### Generate Workforce Agent

```bash
medina-dev generate agent <name> --capacity <phi-power>
```

Creates a workforce agent with φ-scaled capacity:
- `phi0` = 1.000 (φ⁰)
- `phi1` = 1.618 (φ¹)
- `phi2` = 2.618 (φ²)
- `phi3` = 4.236 (φ³)
- `phi4` = 6.854 (φ⁴)

**Example:**
```bash
medina-dev generate agent DataScientist --capacity phi3 --role research
```

---

#### Generate Candid Interface

```bash
medina-dev generate candid --from <motoko-file>
```

Automatically generates Candid interface definition from Motoko code.

**Example:**
```bash
medina-dev generate candid --from Organism.mo --output organism.did
```

**Generated:**
```candid
type OrganismState = record {
  heartbeat : nat64;
  phi : float64;
  consciousness : variant {
    Dolphin;
    Elephant;
    Octopus;
    Crow;
    Dog;
    Wolf;
    Whale;
    Eagle;
  };
};

service : {
  pulse : () -> (nat64);
  recognize : (text) -> (bool);
  getState : () -> (OrganismState) query;
}
```

---

#### Generate Test Suite

```bash
medina-dev generate tests --for <component>
```

Generates comprehensive test suite using `@medina/testing-tools`.

**Example:**
```bash
medina-dev generate tests --for MyOrganism --include heartbeat,memory,recognition
```

---

### 2. Project Scaffolding

#### Scaffold New Project

```bash
medina-dev scaffold project <name>
```

Creates complete project structure with:
- Organism implementation
- Intelligence modules
- Test suite
- Configuration files
- README and documentation

**Templates:**
- `organism` - Basic organism project
- `enterprise` - Enterprise application
- `integration` - Integration/middleware
- `fullstack` - Full-stack application (dashboard + API + organism)

**Example:**
```bash
medina-dev scaffold project my-organism --template organism
```

**Generated structure:**
```
my-organism/
├── src/
│   ├── organism/
│   │   ├── Main.mo
│   │   ├── Heart.mo
│   │   └── Constants.mo
│   ├── intelligence/
│   └── tests/
├── dfx.json
├── mops.toml
├── package.json
├── README.md
└── .env.example
```

---

#### Scaffold Intelligence Pillar

```bash
medina-dev scaffold pillar <name>
```

Creates a new intelligence pillar with module structure.

**Example:**
```bash
medina-dev scaffold pillar quantum --modules 15
```

---

### 3. Code Validation

#### Validate Organism

```bash
medina-dev validate organism <path>
```

Validates organism implementation:
- ✓ Heartbeat timing (873ms ±0.3%)
- ✓ φ-harmonic constants (19 decimal precision)
- ✓ Memory crystallization logic
- ✓ Pattern recognition implementation
- ✓ Candid interface correctness
- ✓ Animal consciousness configuration

**Example:**
```bash
medina-dev validate organism ./src/organism/
```

**Output:**
```
🔍 Validating Organism Implementation

✓ Heartbeat: 873ms (φ⁴ × 138ms) correct
✓ PHI constant: 1.6180339887498948482 (19 decimals)
✓ Memory crystallization: Fibonacci indexing present
✓ Pattern recognition: Implemented correctly
✓ Candid interface: Valid
✓ Consciousness: Dolphin configuration valid

✅ Validation passed (6/6 checks)
```

---

#### Validate Intelligence Module

```bash
medina-dev validate module <path>
```

Validates intelligence module:
- Correct pillar placement
- φ-harmonic mathematics usage
- Module interface compliance
- Performance characteristics

---

#### Validate φ-Harmonic Code

```bash
medina-dev validate phi-harmonic <path>
```

Checks for:
- Correct PHI constant (1.6180339887498948482)
- 19 decimal precision in calculations
- φ-scaled resource allocation
- Fibonacci sequence usage

---

### 4. Code Transformation

#### Convert TypeScript to Motoko

```bash
medina-dev convert ts-to-mo <input.ts> --output <output.mo>
```

Converts TypeScript intelligence modules to Motoko.

---

#### Optimize φ-Harmonic Code

```bash
medina-dev optimize phi <path>
```

Optimizes code to use φ-harmonic patterns:
- Replace arbitrary timing with 873ms heartbeat
- Convert linear scaling to φ-proportional
- Apply golden ratio to resource allocation

---

### 5. Documentation Generation

#### Generate API Docs

```bash
medina-dev docs generate --from <source-dir>
```

Generates API documentation from source code.

**Example:**
```bash
medina-dev docs generate --from ./src/organism/ --output ./docs/
```

---

#### Generate Architecture Diagram

```bash
medina-dev docs diagram --type architecture
```

Generates architectural diagrams:
- `architecture` - System architecture
- `dataflow` - Data flow diagram
- `phi-scaling` - φ-scaling visualization
- `intelligence` - Intelligence module map

---

### 6. Development Utilities

#### Check φ-Sync

```bash
medina-dev utils phi-sync <value>
```

Calculates φ-synchronization percentage.

**Example:**
```bash
medina-dev utils phi-sync 871
# Output: 99.77% φ-sync (target: 873ms)
```

---

#### Calculate Fibonacci Index

```bash
medina-dev utils fibonacci <n>
```

Calculates Fibonacci number F[n].

**Example:**
```bash
medina-dev utils fibonacci 21
# Output: F[21] = 10,946
```

---

#### Convert to φ-Scale

```bash
medina-dev utils to-phi <value>
```

Converts arbitrary value to φ-scaled equivalent.

**Example:**
```bash
medina-dev utils to-phi 100
# Output: 161.8 (100 × φ)
```

---

## Generator Templates

### Available Templates

| Template | Description | Output |
|----------|-------------|--------|
| `organism` | Complete organism | Organism.mo |
| `module` | Intelligence module | Module.mo/.ts |
| `agent` | Workforce agent | Agent config |
| `candid` | Candid interface | .did file |
| `tests` | Test suite | test files |
| `project` | Full project | directory structure |
| `pillar` | Intelligence pillar | pillar directory |

---

## Configuration

### `.medinadevcache` (local file generated globally so that you don't have to re-enter global preferences)

```json
{
  "preferences": {
    "default_consciousness": "Dolphin",
    "phi_precision": 19,
    "heartbeat_target": 873,
    "default_language": "motoko",
    "use_strict_validation": true
  },
  "templates": {
    "custom_templates_path": "./templates"
  },
  "generators": {
    "auto_format": true,
    "include_comments": true,
    "include_tests": true
  }
}
```

---

## Examples

### Complete Organism from Scratch

```bash
# 1. Scaffold project
medina-dev scaffold project MyOrganism --template organism

# 2. Generate additional modules
cd MyOrganism
medina-dev generate module CustomNeural --pillar neural

# 3. Generate tests
medina-dev generate tests --for Main

# 4. Validate implementation
medina-dev validate organism ./src/

# 5. Generate documentation
medina-dev docs generate --from ./src/ --output ./docs/
```

### Intelligence Module Development

```bash
# Generate module
medina-dev generate module QuantumCoherence --pillar cognitive

# Validate φ-harmonic usage
medina-dev validate phi-harmonic ./src/QuantumCoherence.mo

# Generate tests
medina-dev generate tests --for QuantumCoherence

# Run tests
medina-test QuantumCoherence
```

---

## CI/CD Integration

```yaml
# .github/workflows/validate.yml
name: Validate MEDINA Code

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install MEDINA dev tools
        run: npm install -g @medina/dev-tools

      - name: Validate organism
        run: medina-dev validate organism ./src/organism/

      - name: Validate φ-harmonic code
        run: medina-dev validate phi-harmonic ./src/

      - name: Check PHI precision
        run: medina-dev utils phi-sync 873
```

---

## Production Features

✅ **Code Generation** - Organism, modules, agents, interfaces
✅ **Project Scaffolding** - Complete project templates
✅ **Validation** - Organism, modules, φ-harmonic code
✅ **φ-Harmonic Utilities** - Sync check, Fibonacci, scaling
✅ **Documentation** - Auto-generate API docs and diagrams
✅ **Code Transformation** - TypeScript ↔ Motoko conversion
✅ **Template System** - Customizable code templates
✅ **CI/CD Ready** - Automation-friendly commands

---

## Requirements

- Node.js 20+
- MEDINA SDKs (for validation and testing)

---

**MEDINA TECH | ALFREDO MEDINA HERNANDEZ | DALLAS TX | 2026**

**COPYRIGHT © 2024-2026 ALFREDO MEDINA HERNANDEZ. ALL RIGHTS RESERVED.**
