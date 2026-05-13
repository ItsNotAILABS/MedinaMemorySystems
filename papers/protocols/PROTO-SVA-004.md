# PROTO-SVA-004: Certification Revocation Protocol

## Part of the Sovereign Validation Authority

**Protocol ID:** PROTO-SVA-004  
**Version:** 1.0  
**Status:** ACTIVE  
**Parent Charter:** CHARTER-SVA-001  
**Effective Date:** May 2026

---

## 1. Purpose

This protocol defines how capability certificates are revoked, including triggers, cascade rules, notification requirements, and appeal processes.

---

## 2. Revocation Triggers

### 2.1 Automatic Triggers

| Trigger | Severity | Grace Period | Cascade |
|---------|----------|--------------|---------|
| Test failure (T1) | Medium | 1 hour | No |
| Test failure (T2+) | High | None | Dependent |
| φ-coherence < threshold | High | 15 minutes | Dependent |
| Security vulnerability | Critical | None | All |
| Dependency revoked | High | None | Dependent |
| Certificate expiration | Normal | 7-day warning | No |
| Resource violation | Medium | 30 minutes | No |
| Behavioral anomaly | Variable | Investigation | Variable |

### 2.2 Manual Triggers

| Trigger | Authority Required | Approval |
|---------|-------------------|----------|
| Component owner request | Owner | None |
| Security team request | Security Team | Immediate |
| SVA Council decision | Council | 2/3 vote |
| Emergency revocation | Chief Validator | Single approval |

### 2.3 Trigger Detection

```typescript
class RevocationTriggerDetector {
  private watchers: Map<TriggerType, TriggerWatcher>;
  
  async detectTriggers(component: Component): Promise<Trigger[]> {
    const triggers: Trigger[] = [];
    
    // Check test results
    const testResults = await getRecentTestResults(component);
    if (testResults.hasFailures) {
      triggers.push({
        type: 'TEST_FAILURE',
        severity: determineSeverity(testResults),
        evidence: testResults
      });
    }
    
    // Check φ-coherence
    const φLevel = await measureφ(component);
    if (φLevel < component.certificate.requiredφ) {
      triggers.push({
        type: 'PHI_DROP',
        severity: 'HIGH',
        evidence: { current: φLevel, required: component.certificate.requiredφ }
      });
    }
    
    // Check dependencies
    const deps = await checkDependencyCertificates(component);
    if (deps.some(d => d.revoked)) {
      triggers.push({
        type: 'DEPENDENCY_REVOKED',
        severity: 'HIGH',
        evidence: deps.filter(d => d.revoked)
      });
    }
    
    return triggers;
  }
}
```

---

## 3. Revocation Process

### 3.1 Process Flow

```
Trigger Detected
      │
      ▼
┌─────────────┐
│   Verify    │ Confirm trigger is valid
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Assess    │ Determine severity and cascade
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Grace     │ Apply grace period (if any)
└──────┬──────┘
       │ expired
       ▼
┌─────────────┐
│   Revoke    │ Mark certificate as revoked
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Cascade    │ Handle dependent certificates
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Notify    │ Inform all stakeholders
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Record    │ Create proof record
└─────────────┘
```

### 3.2 Revocation Execution

```typescript
interface RevocationRequest {
  certificateId: string;
  trigger: Trigger;
  reason: string;
  cascadePolicy: CascadePolicy;
  gracePeriod?: Duration;
  requestor: CitizenId;
  timestamp: Timestamp;
}

async function revokeCertificate(
  request: RevocationRequest
): Promise<RevocationResult> {
  
  const cert = await getCertificate(request.certificateId);
  
  // 1. Verify certificate exists and is active
  if (!cert || cert.revoked) {
    return { success: false, reason: 'CERTIFICATE_NOT_ACTIVE' };
  }
  
  // 2. Apply grace period if specified
  if (request.gracePeriod) {
    await scheduleRevocation(request, request.gracePeriod);
    return { success: true, status: 'SCHEDULED' };
  }
  
  // 3. Create revocation record
  const revocation: RevocationRecord = {
    revocationId: generateId(),
    certificateId: cert.id,
    revokedAt: now(),
    reason: request.reason,
    trigger: request.trigger,
    revokedBy: request.requestor
  };
  
  // 4. Mark certificate as revoked
  cert.revoked = true;
  cert.revokedAt = revocation.revokedAt;
  cert.revocationReason = revocation.reason;
  await updateCertificate(cert);
  
  // 5. Handle cascade
  if (request.cascadePolicy !== 'NONE') {
    await handleCascade(cert, request.cascadePolicy);
  }
  
  // 6. Create proof
  const proof = await createRevocationProof(revocation);
  
  // 7. Notify stakeholders
  await notifyRevocation(cert, revocation);
  
  return { 
    success: true, 
    status: 'REVOKED',
    revocationId: revocation.revocationId,
    proof: proof.hash
  };
}
```

---

## 4. Cascade Rules

### 4.1 Cascade Policies

| Policy | Behavior |
|--------|----------|
| NONE | No cascade, only revoke target |
| DIRECT | Revoke immediate dependents |
| TRANSITIVE | Revoke all transitive dependents |
| WARN | Warn dependents, don't revoke |
| DOWNGRADE | Downgrade dependents to L0 |

### 4.2 Cascade Execution

```typescript
async function handleCascade(
  revokedCert: Certificate,
  policy: CascadePolicy
): Promise<CascadeResult> {
  
  const dependents = await getDependentCertificates(revokedCert.capabilityId);
  const results: CascadeResult = { affected: [] };
  
  switch (policy) {
    case 'DIRECT':
      for (const dep of dependents.direct) {
        const result = await revokeCertificate({
          certificateId: dep.id,
          trigger: { type: 'DEPENDENCY_REVOKED', source: revokedCert.id },
          reason: `Dependency ${revokedCert.capabilityId} was revoked`,
          cascadePolicy: 'NONE'
        });
        results.affected.push({ certId: dep.id, action: 'REVOKED' });
      }
      break;
      
    case 'TRANSITIVE':
      const allDeps = await getTransitiveDependents(revokedCert.capabilityId);
      for (const dep of allDeps) {
        await revokeCertificate({ /* ... */ });
        results.affected.push({ certId: dep.id, action: 'REVOKED' });
      }
      break;
      
    case 'WARN':
      for (const dep of dependents.all) {
        await sendWarning(dep, revokedCert);
        results.affected.push({ certId: dep.id, action: 'WARNED' });
      }
      break;
      
    case 'DOWNGRADE':
      for (const dep of dependents.all) {
        await downgradeCertificate(dep, CertificationLevel.L0);
        results.affected.push({ certId: dep.id, action: 'DOWNGRADED' });
      }
      break;
  }
  
  return results;
}
```

### 4.3 Dependency Graph

```
                    Core.Auth (REVOKED)
                         │
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
       API.User      API.Admin     Service.Payment
           │             │             │
           ▼             ▼             ▼
       UI.Profile   Admin.Dashboard  Checkout
           │
           ▼
       Widget.Avatar
```

With TRANSITIVE cascade, all above would be revoked.

---

## 5. Notification Requirements

### 5.1 Notification Recipients

| Recipient | Trigger Level | Content |
|-----------|---------------|---------|
| Certificate owner | All | Full details |
| Dependent owners | All | Impact notice |
| SVA Council | Critical | Summary |
| Security team | Security-related | Full details |
| All citizens | Emergency | Brief alert |

### 5.2 Notification Structure

```typescript
interface RevocationNotification {
  // Target
  recipient: CitizenId;
  
  // Identity
  certificateId: string;
  capabilityId: string;
  
  // Revocation details
  revokedAt: Timestamp;
  reason: string;
  severity: Severity;
  
  // Impact
  cascadeLevel: CascadePolicy;
  affectedDependents: string[];
  
  // Recovery
  recertificationPath?: string;
  appealDeadline?: Timestamp;
  
  // Links
  incidentUrl: string;
  proofUrl: string;
}
```

### 5.3 Notification Timing

| Notification Type | Timing |
|-------------------|--------|
| Pre-revocation warning | 7 days before expiration |
| Grace period notice | At trigger detection |
| Revocation notice | Immediately upon revocation |
| Cascade notice | Within 1 minute of cascade |
| Appeal window notice | Upon revocation |

---

## 6. Appeal Process

### 6.1 Appeal Eligibility

Appeals are allowed when:
- Revocation was triggered by automated system
- Owner believes trigger was false positive
- Mitigating circumstances exist
- Within 7-day appeal window

### 6.2 Appeal Submission

```typescript
interface RevocationAppeal {
  appealId: string;
  revocationId: string;
  certificateId: string;
  
  // Appellant
  appellant: CitizenId;
  submittedAt: Timestamp;
  
  // Grounds
  grounds: AppealGrounds;
  evidence: Evidence[];
  
  // Request
  requestedAction: 'REINSTATE' | 'REDUCE_SEVERITY' | 'EXTEND_GRACE';
}

enum AppealGrounds {
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  MITIGATING_CIRCUMSTANCES = 'MITIGATING_CIRCUMSTANCES',
  PROCEDURAL_ERROR = 'PROCEDURAL_ERROR',
  TEMPORARY_ISSUE_RESOLVED = 'TEMPORARY_ISSUE_RESOLVED'
}
```

### 6.3 Appeal Review

```
Appeal Submitted
      │
      ▼
┌─────────────┐
│  Validate   │ Check eligibility
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Assign    │ Assign reviewer
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Evaluate   │ Review evidence
└──────┬──────┘
       │
   ┌───┴───┐
   ▼       ▼
ACCEPT   REJECT
   │       │
   ▼       ▼
Reinstate  Uphold
```

### 6.4 Appeal Timeline

| Stage | Duration |
|-------|----------|
| Submission window | 7 days |
| Initial response | 24 hours |
| Evidence review | 3 days |
| Final decision | 7 days |
| Reinstatement (if approved) | 24 hours |

---

## 7. Emergency Revocation

### 7.1 Emergency Criteria

Emergency revocation bypasses normal process when:
- Active security breach detected
- φ-collapse threatening organism
- Malicious activity confirmed
- Critical infrastructure at risk

### 7.2 Emergency Process

```typescript
async function emergencyRevoke(
  target: string | string[],
  reason: string,
  authorizer: CitizenId
): Promise<EmergencyRevocationResult> {
  
  // 1. Verify authorizer has emergency powers
  if (!hasEmergencyAuthority(authorizer)) {
    throw new UnauthorizedError('No emergency authority');
  }
  
  // 2. Log emergency invocation
  await logEmergency({
    type: 'REVOCATION',
    target,
    reason,
    authorizer,
    timestamp: now()
  });
  
  // 3. Immediate revocation (no grace period)
  const targets = Array.isArray(target) ? target : [target];
  const results = [];
  
  for (const certId of targets) {
    const result = await revokeCertificate({
      certificateId: certId,
      trigger: { type: 'EMERGENCY', authorizer },
      reason: `EMERGENCY: ${reason}`,
      cascadePolicy: 'TRANSITIVE',
      gracePeriod: null
    });
    results.push(result);
  }
  
  // 4. Immediate notification to Council
  await notifyCouncil({
    type: 'EMERGENCY_REVOCATION',
    targets,
    reason,
    authorizer,
    timestamp: now()
  });
  
  // 5. Create emergency proof
  const proof = await createEmergencyProof(results);
  
  return { results, proof: proof.hash };
}
```

---

## 8. Revocation Records

### 8.1 Record Structure

```typescript
interface RevocationRecord {
  revocationId: string;
  certificateId: string;
  capabilityId: string;
  
  // Revocation details
  revokedAt: Timestamp;
  reason: string;
  trigger: Trigger;
  severity: Severity;
  
  // Authority
  revokedBy: CitizenId | 'SYSTEM';
  approvedBy?: CitizenId;
  
  // Cascade
  cascadePolicy: CascadePolicy;
  affectedCertificates: string[];
  
  // Appeals
  appealed: boolean;
  appealOutcome?: AppealOutcome;
  
  // Proof
  proofHash: Hash;
  merkleRoot: Hash;
}
```

### 8.2 Retention

| Record Type | Retention |
|-------------|-----------|
| Active revocations | Permanent |
| Appealed (overturned) | 1 year |
| Expired certificates | 90 days |
| Emergency revocations | Permanent |

---

## 9. Protocol Metrics

### 9.1 Revocation Metrics

| Metric | Target |
|--------|--------|
| Time to revoke | < 1 minute |
| Cascade completion | < 5 minutes |
| Notification delivery | < 1 minute |
| False positive rate | < 1% |

### 9.2 Appeal Metrics

| Metric | Target |
|--------|--------|
| Appeals processed on time | ≥ 95% |
| Successful appeals | < 10% |
| Time to reinstatement | < 24 hours |

---

*Protocol maintained by SVA Council*

*© 2026 ItsNotAILABS. Released under ISIL-1.1.*
