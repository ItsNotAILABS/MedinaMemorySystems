# MEDINA V1 Weakness Hardening Evidence (H1-H8)

Classification: BUILDER_CONFIDENTIAL

This document defines mandatory hardening controls and required evidence artifacts.

## H1 API Parity

**Requirement**: Enforce orchestrator/module export parity contracts.

- Control: static parity registry comparing declared vs exported interfaces
- Evidence:
  - `reports/h1-api-parity.json`
  - CI check `hardening:h1`
- Pass criteria: zero missing exports for declared orchestrator/module contracts

## H2 Memory Navigation Parity

**Requirement**: Unify backend/frontend memory navigation interfaces.

- Control: shared schema package for coordinate and traversal payloads
- Evidence:
  - `reports/h2-memory-nav-parity.json`
  - contract test logs
- Pass criteria: backend and frontend schemas version-aligned, no breaking drift

## H3 Organism Model Unification

**Requirement**: Remove drift between shell organism model and command-center model.

- Control: canonical organism state schema and compatibility tests
- Evidence:
  - `reports/h3-organism-unification.json`
  - drift diff snapshots
- Pass criteria: no unapproved field or semantic divergence

## H4 UI Route Clarity

**Requirement**: Eliminate duplicate/overshadowed surface ambiguity.

- Control: route registry uniqueness lint and collision tests
- Evidence:
  - `reports/h4-ui-route-clarity.json`
- Pass criteria: single canonical route per operator surface, zero collisions

## H5 Runtime Beat Budget

**Requirement**: Cadence classes and instruction budget enforcement.

- Control: beat scheduler with `every_beat`, `n_beat`, `event_driven`
- Evidence:
  - `reports/h5-beat-budget.json`
  - runtime metrics dashboard snapshot
- Pass criteria: budget violations are blocked or throttled with incident records

## H6 Law Epoch Normalization

**Requirement**: One authoritative law-write epoch per beat.

- Control: epoch singleton guard in sovereign tick runtime
- Evidence:
  - `reports/h6-law-epoch.json`
- Pass criteria: max 1 law-write epoch per beat, no duplicate acceptance windows

## H7 Fallback Transparency

**Requirement**: Explicit source badge and incident evidence on prolonged fallback.

- Control: fallback detector + UI badge + incident emitter
- Evidence:
  - `reports/h7-fallback-transparency.json`
  - incident replay bundle references
- Pass criteria: fallback > threshold always labeled with evidence link

## H8 Engine Inventory Integrity

**Requirement**: Auto-report imported vs invoked module inventory.

- Control: runtime inventory probe and diff checks
- Evidence:
  - `reports/h8-engine-inventory.json`
- Pass criteria: imported/invoked inventory mismatch within approved tolerance only

## Hardening Review Protocol

- Run all H1-H8 controls in CI and release candidate pipelines
- Fail release if any pass criteria are unmet
- Attach evidence files to Gate A/B/C review packet
