# MEDINA Testing Tools
## Comprehensive Testing Harness for Intelligence Modules & Organisms

**Package**: `@medina/testing-tools`
**Version**: `1.0.0`
**Purpose**: Production testing, validation, and benchmarking tools

---

## Overview

MEDINA Testing Tools provides a comprehensive suite for testing all 823+ intelligence modules, validating φ-harmonic mathematics, and benchmarking organism performance. Essential for quality assurance and development.

---

## Installation

```bash
npm install -g @medina/testing-tools
```

---

## Quick Start

```bash
# Run full test suite
medina-test all

# Test specific pillar
medina-test neural

# Benchmark performance
medina-test benchmark --suite adaptation

# Validate φ-harmonic timing
medina-test phi-validation

# Test organism heartbeat accuracy
medina-test heartbeat --target 873

# Run chaos theory validation
medina-test chaos --lyapunov

# Test all animal cognition modules
medina-test animals --species all
```

---

## Test Suites

### 1. Intelligence Module Testing

**Test all 823+ modules across 7 pillars:**

```bash
# Test entire intelligence core
medina-test intelligence --comprehensive

# Test by pillar
medina-test neural        # 87+ neural modules
medina-test cognitive     # 64+ cognitive modules
medina-test emergence     # 53+ emergence modules
medina-test adaptation    # 71+ adaptation modules
medina-test scalability   # 42+ scalability modules
medina-test computing     # 89+ computing modules
medina-test ml            # 47+ ML modules
```

**Sample Output:**
```
🧠 Testing Neural Pillar (87 modules)

✓ NeuralCore.mo                19 decimal precision validated
✓ AnimalBrains.mo              96 capabilities (8 × 12) passed
✓ HebbianPlasticity.mo         Synaptic weights converged
✓ neurochemistry.ts            21 species validated
✓ metal-substrates.ts          9 metals (Cu, Fe, Au...) correct

Neural Pillar: 87/87 passed (100%) | Time: 3.42s
```

---

### 2. φ-Harmonic Validation

**Validate golden ratio mathematics (19 decimal places):**

```bash
# Test PHI constant precision
medina-test phi --precision 19

# Validate φ-harmonic timing
medina-test phi-timing --heartbeat 873

# Test Fibonacci sequence
medina-test fibonacci --range F0:F30

# Verify φ-scaled resource allocation
medina-test phi-scaling --workforce
```

**Validates**:
- φ = 1.6180339887498948482 (19 decimals)
- 873ms heartbeat = φ⁴ × (1000/7.83)
- Fibonacci indexing F[0] to F[30]
- φ-proportional agent scaling

---

### 3. Organism Testing

**Test organism functionality:**

```bash
# Test heartbeat accuracy
medina-test heartbeat --target 873 --samples 1000

# Test pattern recognition
medina-test recognition --patterns all

# Test memory crystallization
medina-test memory --crystallize

# Test workforce orchestration
medina-test workforce --agents 8 --phi-scale

# Test OMNIS voting
medina-test governance --cores 43
```

---

### 4. Chaos & Emergence Testing

**Validate chaos theory and emergence:**

```bash
# Lyapunov exponent calculation
medina-test lyapunov --system lorenz

# Test Kuramoto synchronization
medina-test kuramoto --oscillators 100

# Feigenbaum constant validation
medina-test feigenbaum --delta 4.669201609102991

# Ising model phase transition
medina-test ising --critical-temp 2.269

# Percolation threshold
medina-test percolation --pc 0.5927
```

---

### 5. Animal Cognition Testing

**Test all 8 species × 12 capabilities = 96 functions:**

```bash
# Test all animals
medina-test animals --species all

# Test specific species
medina-test animals --species Dolphin    # Echolocation, social
medina-test animals --species Elephant   # Memory, empathy
medina-test animals --species Octopus    # Distributed intelligence
medina-test animals --species Crow       # Tool use, problem-solving
medina-test animals --species Dog        # Loyalty, pattern recognition
medina-test animals --species Wolf       # Pack coordination
medina-test animals --species Whale      # Long-range communication
medina-test animals --species Eagle      # Vision, precision

# Test capability categories
medina-test animals --capability pattern_recognition
medina-test animals --capability social_intelligence
medina-test animals --capability spatial_navigation
```

**Output:**
```
🦅 Testing Animal Cognition: Eagle

✓ Visual acuity              8× human capability
✓ Motion detection           Validated
✓ Depth perception           Binocular vision correct
✓ Precision targeting        99.7% accuracy
✓ Spatial awareness          3D mapping functional
✓ Predator instincts         Behavioral model passed
✓ Thermal detection          IR sensing active
✓ Pattern recognition        Object identification working
✓ Territory mapping          Spatial memory validated
✓ Dive calculation           Physics model accurate
✓ Wind compensation          Flight dynamics correct
✓ Prey tracking              Multi-sensory integration passed

Eagle: 12/12 capabilities passed ✓
```

---

### 6. Performance Benchmarking

**Benchmark system performance:**

```bash
# Run full benchmark suite
medina-test benchmark --all

# Benchmark specific operations
medina-test benchmark --operation heartbeat
medina-test benchmark --operation memory_crystallization
medina-test benchmark --operation pattern_recognition
medina-test benchmark --operation workforce_allocation

# Compare against baseline
medina-test benchmark --compare baseline-v1.0.0

# Generate performance report
medina-test benchmark --report --output ./performance.html
```

**Benchmark Categories:**
- **Heartbeat Timing**: 873ms ±0.3% precision
- **Memory Operations**: Crystallization, retrieval, Fibonacci indexing
- **Intelligence Modules**: Execution time per module
- **Workforce Scaling**: φ-proportional allocation efficiency
- **Chaos Detection**: Lyapunov calculation speed
- **Emergence Metrics**: Phase transition detection time

---

### 7. Integration Testing

**Test SDK integrations:**

```bash
# Test Client SDK
medina-test integration --sdk client

# Test Enterprise SDK
medina-test integration --sdk enterprise

# Test Protocol Adapters
medina-test integration --sdk protocols

# Full stack test
medina-test integration --full-stack
```

---

### 8. Stress Testing

**Load and stress testing:**

```bash
# Stress test heartbeat under load
medina-test stress --heartbeat --load 1000x

# Stress test memory with large datasets
medina-test stress --memory --size 10GB

# Stress test workforce with many agents
medina-test stress --workforce --agents 1000

# Chaos injection testing
medina-test stress --chaos --failures random
```

---

## Test Configuration

### `medina-test.config.json`

```json
{
  "precision": {
    "phi": 19,
    "constants": 19,
    "timing": 0.3
  },
  "heartbeat": {
    "target": 873,
    "tolerance_ms": 3,
    "samples": 1000
  },
  "intelligence": {
    "modules": 823,
    "pillars": 7,
    "validate_all": true
  },
  "animals": {
    "species": 8,
    "capabilities_per_species": 12,
    "test_all_combinations": true
  },
  "chaos": {
    "feigenbaum_delta": 4.669201609102991,
    "ising_critical_temp": 2.269,
    "percolation_threshold": 0.5927
  },
  "performance": {
    "benchmark_iterations": 1000,
    "warmup_runs": 100,
    "timeout_ms": 30000
  }
}
```

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: MEDINA Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Run full test suite
        run: medina-test all --ci

      - name: Run benchmarks
        run: medina-test benchmark --report

      - name: Validate φ-harmonic
        run: medina-test phi-validation --strict

      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: ./test-results/
```

---

## Test Reports

**Generate comprehensive reports:**

```bash
# HTML report
medina-test all --report html --output ./report.html

# JSON report for CI
medina-test all --report json --output ./results.json

# Markdown summary
medina-test all --report markdown --output ./TESTS.md

# Performance comparison
medina-test benchmark --compare v0.9.0 --report diff
```

---

## Validation Modes

### Strict Mode
```bash
medina-test all --strict
```
- Zero tolerance for precision errors
- All 823 modules must pass
- Timing must be within ±0.1%
- All animal capabilities must validate

### Quick Mode
```bash
medina-test all --quick
```
- Sample 10% of modules
- Faster execution
- Good for rapid iteration

### Comprehensive Mode
```bash
medina-test all --comprehensive
```
- Test every module
- Maximum precision validation
- Extended benchmarking
- Full animal cognition suite

---

## Test Categories Summary

| Category | Tests | What It Validates |
|----------|-------|-------------------|
| **Intelligence** | 823+ | All modules functional |
| **φ-Harmonic** | 47 | Golden ratio mathematics (19 decimals) |
| **Organism** | 35 | Core organism functions |
| **Chaos** | 28 | Lyapunov, Feigenbaum, Ising, etc. |
| **Animals** | 96 | 8 species × 12 capabilities |
| **Benchmarks** | 42 | Performance metrics |
| **Integration** | 18 | SDK interoperability |
| **Stress** | 12 | Load and failure testing |

**Total: 1,101+ automated tests**

---

## Exit Codes

- `0` - All tests passed
- `1` - Test failures detected
- `2` - Configuration error
- `3` - Runtime error
- `4` - Precision validation failed

---

## Production Features

✅ **Comprehensive Coverage** - 1,101+ tests across all systems
✅ **Precision Validation** - 19 decimal place verification
✅ **Animal Cognition** - All 96 functions (8 × 12) tested
✅ **Chaos Theory** - Lyapunov, Feigenbaum, Ising validated
✅ **Performance Benchmarks** - Detailed timing analysis
✅ **CI/CD Ready** - JSON output for automation
✅ **Report Generation** - HTML, JSON, Markdown formats
✅ **Stress Testing** - Load and chaos injection

---

## Requirements

- Node.js 20+
- MEDINA Intelligence SDK
- MEDINA Organism SDK

---

**MEDINA TECH | ALFREDO MEDINA HERNANDEZ | DALLAS TX | 2026**

**COPYRIGHT © 2024-2026 ALFREDO MEDINA HERNANDEZ. ALL RIGHTS RESERVED.**
