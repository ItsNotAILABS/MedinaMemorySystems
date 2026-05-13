# PROTO-SVA-005: Claims Evidence Protocol

## Part of the Sovereign Validation Authority

**Protocol ID:** PROTO-SVA-005  
**Version:** 1.0  
**Status:** ACTIVE  
**Parent Charter:** CHARTER-SVA-001  
**Effective Date:** May 2026

---

## 1. Purpose

This protocol defines how claims about capabilities are documented, classified, evidenced, and transitioned through the verification lifecycle.

---

## 2. Claim Types

### 2.1 Claim Classification

| Type | Symbol | Definition | Risk Level |
|------|--------|------------|------------|
| **Verified** | ✓ | Proven by complete test suite with proof chain | Minimal |
| **Supported** | ~ | Evidence exists but not fully proven | Low |
| **Hypothesis** | ? | Reasonable conjecture based on theory | Medium |
| **Thesis** | ◊ | Active research direction, unproven | High |

### 2.2 Claim Structure

```typescript
interface Claim {
  claimId: string;
  capabilityId: string;
  
  // Classification
  type: ClaimType;
  statement: string;
  scope: ClaimScope;
  
  // Ownership
  author: CitizenId;
  createdAt: Timestamp;
  lastUpdated: Timestamp;
  
  // Evidence
  evidenceSet: EvidenceSet;
  
  // Certification
  certificationLevel?: CertificationLevel;
  certificateId?: string;
  
  // Lifecycle
  state: ClaimState;
  transitions: ClaimTransition[];
}

enum ClaimState {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  SUPPORTED = 'SUPPORTED',
  HYPOTHESIS = 'HYPOTHESIS',
  THESIS = 'THESIS',
  REJECTED = 'REJECTED',
  REVOKED = 'REVOKED'
}
```

---

## 3. Evidence Types

### 3.1 Evidence Categories

| Category | Description | Weight |
|----------|-------------|--------|
| Test Results | Automated test execution results | High |
| Proof Chain | Cryptographic proof of execution | Highest |
| Benchmark Data | Performance measurements | Medium |
| Peer Review | Expert evaluation | Medium |
| User Feedback | Observed behavior in production | Low |
| Theoretical Analysis | Mathematical or logical proof | Variable |

### 3.2 Evidence Structure

```typescript
interface Evidence {
  evidenceId: string;
  claimId: string;
  
  // Classification
  category: EvidenceCategory;
  weight: number; // 0.0 - 1.0
  
  // Content
  title: string;
  description: string;
  data: EvidenceData;
  
  // Provenance
  source: EvidenceSource;
  collectedAt: Timestamp;
  collectedBy: CitizenId | 'SYSTEM';
  
  // Validation
  validated: boolean;
  validatedBy?: CitizenId;
  validatedAt?: Timestamp;
  
  // Links
  proofHash?: Hash;
  attachments?: Attachment[];
}

interface EvidenceSet {
  evidenceIds: string[];
  totalWeight: number;
  coverageMap: Map<EvidenceCategory, number>;
  
  // Computed
  sufficientForVerified: boolean;
  sufficientForSupported: boolean;
  gaps: EvidenceGap[];
}
```

---

## 4. Evidence Requirements

### 4.1 Requirements by Claim Type

| Claim Type | Test Coverage | Proof Chain | φ-Coherence | Peer Review |
|------------|---------------|-------------|-------------|-------------|
| Verified | ≥ 95% | Complete | ≥ φ⁻¹ (0.618) | Required |
| Supported | ≥ 70% | Partial | ≥ φ⁻² (0.382) | Recommended |
| Hypothesis | ≥ 30% | None | Any | Not required |
| Thesis | 0% | None | N/A | Not required |

### 4.2 Evidence Sufficiency Check

```typescript
function checkEvidenceSufficiency(
  claim: Claim,
  targetType: ClaimType
): SufficiencyResult {
  
  const requirements = REQUIREMENTS[targetType];
  const evidence = claim.evidenceSet;
  const gaps: EvidenceGap[] = [];
  
  // Check test coverage
  const testEvidence = evidence.filter(e => e.category === 'TEST_RESULTS');
  const coverage = calculateCoverage(testEvidence);
  
  if (coverage < requirements.testCoverage) {
    gaps.push({
      requirement: 'TEST_COVERAGE',
      required: requirements.testCoverage,
      actual: coverage,
      deficit: requirements.testCoverage - coverage
    });
  }
  
  // Check proof chain
  if (requirements.proofChain === 'COMPLETE') {
    const proofEvidence = evidence.filter(e => e.category === 'PROOF_CHAIN');
    if (!isProofChainComplete(proofEvidence)) {
      gaps.push({
        requirement: 'PROOF_CHAIN',
        required: 'COMPLETE',
        actual: 'INCOMPLETE'
      });
    }
  }
  
  // Check φ-coherence
  const φEvidence = evidence.filter(e => e.category === 'BENCHMARK_DATA');
  const minφ = getMinφ(φEvidence);
  
  if (minφ < requirements.φCoherence) {
    gaps.push({
      requirement: 'PHI_COHERENCE',
      required: requirements.φCoherence,
      actual: minφ
    });
  }
  
  // Check peer review
  if (requirements.peerReview === 'REQUIRED') {
    const reviews = evidence.filter(e => e.category === 'PEER_REVIEW');
    if (reviews.length === 0) {
      gaps.push({
        requirement: 'PEER_REVIEW',
        required: 'At least 1 review',
        actual: 'None'
      });
    }
  }
  
  return {
    sufficient: gaps.length === 0,
    gaps,
    recommendations: generateRecommendations(gaps)
  };
}
```

---

## 5. Claim Transitions

### 5.1 Transition Rules

```
                                  ┌─────────────┐
                                  │    DRAFT    │
                                  └──────┬──────┘
                                         │ submit
                                         ▼
                                  ┌─────────────┐
                                  │  SUBMITTED  │
                                  └──────┬──────┘
                                         │ review
                                         ▼
                                  ┌─────────────┐
                    ┌─────────────│ UNDER_REVIEW│─────────────┐
                    │             └──────┬──────┘             │
                    │                    │                    │
        ┌───────────┴────┬───────────────┼───────────────┬────┴───────────┐
        ▼                ▼               ▼               ▼                ▼
   ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
   │ VERIFIED│     │SUPPORTED│     │HYPOTHESIS│     │  THESIS │     │REJECTED │
   └────┬────┘     └────┬────┘     └────┬─────┘     └────┬────┘     └─────────┘
        │               │               │                │
        │ revoke        │ upgrade/      │ upgrade/       │ upgrade/
        ▼               │ revoke        │ reject         │ reject
   ┌─────────┐          │               │                │
   │ REVOKED │◄─────────┴───────────────┴────────────────┘
   └─────────┘
```

### 5.2 Transition Requirements

| From | To | Requirements |
|------|-----|--------------|
| DRAFT | SUBMITTED | Author submits |
| SUBMITTED | UNDER_REVIEW | Auto or manual assignment |
| UNDER_REVIEW | VERIFIED | All evidence requirements met |
| UNDER_REVIEW | SUPPORTED | Partial evidence requirements met |
| UNDER_REVIEW | HYPOTHESIS | Some evidence, theory documented |
| UNDER_REVIEW | THESIS | Research plan documented |
| UNDER_REVIEW | REJECTED | Insufficient evidence, no path forward |
| THESIS | HYPOTHESIS | Initial evidence gathered |
| HYPOTHESIS | SUPPORTED | Testing in progress, partial results |
| SUPPORTED | VERIFIED | Full certification achieved |
| * | REVOKED | Evidence invalidated, tests failed |

### 5.3 Transition Execution

```typescript
async function transitionClaim(
  claim: Claim,
  targetState: ClaimState,
  reason: string,
  evidence?: Evidence[]
): Promise<TransitionResult> {
  
  // 1. Validate transition is allowed
  if (!isTransitionAllowed(claim.state, targetState)) {
    return { 
      success: false, 
      reason: `Transition from ${claim.state} to ${targetState} not allowed` 
    };
  }
  
  // 2. Check requirements for target state
  if (evidence) {
    claim.evidenceSet.push(...evidence);
  }
  
  const sufficiency = checkEvidenceSufficiency(claim, targetState);
  
  if (!sufficiency.sufficient && requiresSufficientEvidence(targetState)) {
    return {
      success: false,
      reason: 'Insufficient evidence',
      gaps: sufficiency.gaps
    };
  }
  
  // 3. Record transition
  const transition: ClaimTransition = {
    transitionId: generateId(),
    claimId: claim.claimId,
    fromState: claim.state,
    toState: targetState,
    reason,
    transitionedAt: now(),
    transitionedBy: getCurrentCitizen(),
    evidenceAdded: evidence?.map(e => e.evidenceId) || []
  };
  
  // 4. Update claim
  claim.state = targetState;
  claim.transitions.push(transition);
  claim.lastUpdated = now();
  
  // 5. If verified, create certificate link
  if (targetState === 'VERIFIED' && !claim.certificateId) {
    const cert = await requestCertification(claim);
    claim.certificateId = cert.certificateId;
    claim.certificationLevel = cert.level;
  }
  
  // 6. Create proof
  const proof = await createTransitionProof(transition);
  
  // 7. Notify stakeholders
  await notifyTransition(claim, transition);
  
  return { 
    success: true, 
    transition,
    proof: proof.hash
  };
}
```

---

## 6. Documentation Standards

### 6.1 Claim Documentation Requirements

| Field | Required For | Description |
|-------|--------------|-------------|
| Statement | All | Clear, falsifiable assertion |
| Scope | All | What the claim covers |
| Assumptions | All | Underlying assumptions |
| Limitations | Supported+ | Known limitations |
| Test Plan | Hypothesis+ | How to test the claim |
| Theory Basis | Thesis | Theoretical foundation |
| Research Plan | Thesis | Path to verification |

### 6.2 Evidence Documentation Requirements

| Field | Required For | Description |
|-------|--------------|-------------|
| Source | All | Where evidence came from |
| Collection Method | All | How evidence was collected |
| Timestamp | All | When evidence was collected |
| Validator | Verified | Who validated the evidence |
| Reproduction Steps | Tests | How to reproduce |
| Statistical Confidence | Benchmarks | Confidence intervals |

### 6.3 Documentation Templates

```markdown
## Claim: [Statement]

### Classification
- **Type**: [Verified/Supported/Hypothesis/Thesis]
- **Scope**: [What this claim covers]
- **Author**: [Citizen ID]
- **Created**: [Timestamp]

### Statement
[Clear, falsifiable statement of the claim]

### Assumptions
1. [Assumption 1]
2. [Assumption 2]

### Evidence
| Evidence ID | Category | Weight | Status |
|-------------|----------|--------|--------|
| [ID] | [Category] | [Weight] | [Status] |

### Limitations
- [Limitation 1]
- [Limitation 2]

### Test Plan
[For Hypothesis and Thesis]

### Certification
- **Level**: [L0-L5]
- **Certificate**: [Certificate ID]
```

---

## 7. Verification Procedures

### 7.1 Evidence Validation

```typescript
async function validateEvidence(
  evidence: Evidence
): Promise<ValidationResult> {
  
  const validations: Validation[] = [];
  
  // 1. Source verification
  validations.push(await verifySource(evidence.source));
  
  // 2. Data integrity
  validations.push(await verifyDataIntegrity(evidence.data));
  
  // 3. Timestamp verification
  validations.push(await verifyTimestamp(evidence.collectedAt));
  
  // 4. Category-specific validation
  switch (evidence.category) {
    case 'TEST_RESULTS':
      validations.push(await verifyTestResults(evidence));
      break;
    case 'PROOF_CHAIN':
      validations.push(await verifyProofChain(evidence));
      break;
    case 'BENCHMARK_DATA':
      validations.push(await verifyBenchmarkData(evidence));
      break;
    case 'PEER_REVIEW':
      validations.push(await verifyPeerReview(evidence));
      break;
  }
  
  // 5. Compute overall validation
  const allPassed = validations.every(v => v.passed);
  
  return {
    valid: allPassed,
    validations,
    validated: allPassed,
    validatedAt: now()
  };
}
```

### 7.2 Peer Review Process

```
Claim Submitted for Review
         │
         ▼
┌─────────────────┐
│ Assign Reviewers│ (minimum 2 for Verified)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Independent     │
│ Review Period   │ (7 days default)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Consolidate     │
│ Reviews         │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
 APPROVED   REVISE
    │         │
    ▼         ▼
 Verified   Feedback
```

---

## 8. Public/Private Boundary

### 8.1 Release Classification

| Classification | Minimum Claim Type | Disclosure Level |
|----------------|-------------------|------------------|
| Internal Only | Thesis | None |
| Alpha | Hypothesis | Limited |
| Beta | Supported | Partial |
| General Availability | Verified | Full |

### 8.2 Disclosure Rules

```typescript
interface DisclosurePolicy {
  claimType: ClaimType;
  releaseClassification: string;
  
  // What can be disclosed
  canDiscloseStatement: boolean;
  canDiscloseEvidence: boolean;
  canDiscloseLimitations: boolean;
  canDiscloseProofs: boolean;
  
  // Restrictions
  requiresNDA: boolean;
  requiresApproval: boolean;
}

const DISCLOSURE_POLICIES: Map<ClaimType, DisclosurePolicy> = {
  'VERIFIED': {
    canDiscloseStatement: true,
    canDiscloseEvidence: true,
    canDiscloseLimitations: true,
    canDiscloseProofs: true,
    requiresNDA: false,
    requiresApproval: false
  },
  'SUPPORTED': {
    canDiscloseStatement: true,
    canDiscloseEvidence: true,
    canDiscloseLimitations: true,
    canDiscloseProofs: false,
    requiresNDA: false,
    requiresApproval: true
  },
  'HYPOTHESIS': {
    canDiscloseStatement: true,
    canDiscloseEvidence: false,
    canDiscloseLimitations: true,
    canDiscloseProofs: false,
    requiresNDA: true,
    requiresApproval: true
  },
  'THESIS': {
    canDiscloseStatement: false,
    canDiscloseEvidence: false,
    canDiscloseLimitations: false,
    canDiscloseProofs: false,
    requiresNDA: true,
    requiresApproval: true
  }
};
```

---

## 9. Integration with Other Protocols

### 9.1 Certification Integration (PROTO-SVA-001)

When a claim reaches VERIFIED:
1. Request certification via PROTO-SVA-001
2. Link certificate to claim
3. Evidence becomes part of proof chain

### 9.2 Revocation Integration (PROTO-SVA-004)

When evidence is invalidated:
1. Claim is transitioned to REVOKED
2. Certificate is revoked via PROTO-SVA-004
3. Dependent claims are notified

### 9.3 Bot Fleet Integration

Bot proof records can serve as evidence:

```typescript
function convertBotProofToEvidence(
  botProof: BotProofRecord
): Evidence {
  return {
    evidenceId: generateId(),
    category: 'TEST_RESULTS',
    weight: 0.8, // High but not maximum (automated)
    title: `Bot Execution: ${botProof.taskId}`,
    description: `Automated test by bot ${botProof.botId}`,
    data: {
      botId: botProof.botId,
      taskId: botProof.taskId,
      executionProof: botProof.executionProof,
      results: botProof.testResults
    },
    source: {
      type: 'BOT_FLEET',
      identifier: botProof.botId
    },
    collectedAt: botProof.timestamp,
    collectedBy: 'SYSTEM',
    proofHash: botProof.executionProof
  };
}
```

---

## 10. Protocol Metrics

### 10.1 Claim Metrics

| Metric | Target |
|--------|--------|
| Time to verify | < 7 days |
| Evidence sufficiency accuracy | ≥ 95% |
| False verification rate | < 1% |
| Claim coverage | 100% of capabilities |

### 10.2 Evidence Metrics

| Metric | Target |
|--------|--------|
| Evidence validation accuracy | ≥ 99% |
| Proof chain integrity | 100% |
| Documentation completeness | ≥ 90% |

---

*Protocol maintained by SVA Council*

*© 2026 ItsNotAILABS. Released under ISIL-1.1.*
