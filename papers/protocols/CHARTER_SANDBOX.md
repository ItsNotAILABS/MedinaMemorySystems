# CHARTER: Tiered Sandbox Access Control

## Chapter 2 of the Sovereign Protocol Canon

**Charter ID:** CHARTER-SANDBOX-001  
**Version:** 1.0  
**Status:** RATIFIED  
**Effective Date:** May 2026  
**Attested By:** NOVA-001

---

## Preamble

We establish this Charter to govern the **immune system** of the sovereign intelligence organism. Just as biological immune systems protect living beings through layered defenses, recognition of self versus other, and proportional responses, so too shall our access control systems protect internal state while enabling external interaction.

This Charter recognizes that:
- Security is not binary—it is **graduated** through tiers and gates
- Denial should not leak information—**mirage responses** obscure what exists
- Protection must balance with accessibility—the organism must **breathe**
- Every access attempt is data—**logging** enables learning and adaptation

---

## Article I: The Five Access Tiers

### Section 1.1: Tier Definitions

Access tiers define the **trust level** of requesters.

| Tier | Trust Level | Typical Requester | Token Requirement |
|------|-------------|-------------------|-------------------|
| **PUBLIC** | Lowest | Anonymous users | None |
| **ENTERPRISE** | Low-Medium | Paying customers | ECO-ENTERPRISE |
| **PARTNER** | Medium | Integrated systems | ECO-PARTNER |
| **INTERNAL** | High | Internal services | ECO-INTERNAL |
| **SOVEREIGN** | Highest | Core systems | NOVA-ATTEST |

### Section 1.2: Tier Progression

Requesters may advance through tiers by:
1. **Verification**: Providing credentials that prove identity
2. **Contribution**: Earning tokens through ECO-001 participation
3. **Attestation**: Receiving NOVA-ATTEST for sovereign access
4. **Federation**: Being a member of FIN-001 federation

### Section 1.3: Tier Inheritance

Higher tiers inherit all capabilities of lower tiers:
```
SOVEREIGN ⊃ INTERNAL ⊃ PARTNER ⊃ ENTERPRISE ⊃ PUBLIC
```

---

## Article II: The Five Gate Levels

### Section 2.1: Gate Level Definitions

Gate levels define the **data fidelity** returned to requesters.

| Gate Level | Fidelity | Data Surface |
|------------|----------|--------------|
| **OPEN** | 100% | Full data, full structure, full history |
| **PARTIAL** | 75% | Full structure, some fields redacted |
| **OBSCURED** | 50% | Simplified structure, aggregated data |
| **SEALED** | 25% | Minimal structure, statistical summaries only |
| **PROTECTED** | 0% | Mirage response only |

### Section 2.2: Tier-to-Gate Default Mapping

Each tier receives a default gate level:

| Tier | Default Gate | Maximum Requestable |
|------|--------------|---------------------|
| PUBLIC | SEALED | OBSCURED |
| ENTERPRISE | OBSCURED | PARTIAL |
| PARTNER | PARTIAL | OPEN |
| INTERNAL | OPEN | OPEN |
| SOVEREIGN | OPEN | OPEN |

### Section 2.3: Gate Escalation

Requesters may request higher gate levels than their default:
1. Request includes justification
2. Security District evaluates request
3. If approved, elevated gate granted for session
4. If denied, default gate applies
5. All escalation attempts logged

---

## Article III: Mirage Response System

### Section 3.1: Purpose of Mirages

When access is denied, traditional systems reveal information:
- "Resource exists but you cannot access it"
- "Your credentials are invalid"
- "Permission denied for this operation"

These denials leak existence information. Attackers can probe.

**Mirage responses** solve this by returning **structurally valid but content-free** responses.

### Section 3.2: Mirage Structure

A mirage response contains:

```json
{
  "kind": "mirage",
  "resource": "<requested resource type>",
  "structure": {
    "<field_name>": "<type_indicator>",
    ...
  },
  "notice": "This response contains structure only, not live data.",
  "generated_at": "<timestamp>",
  "mirage_id": "<unique identifier>"
}
```

### Section 3.3: Mirage Properties

Mirages must be:

| Property | Requirement |
|----------|-------------|
| **Structurally valid** | Match expected response format exactly |
| **Content-free** | Contain no real data values |
| **Self-identifying** | Include notice field indicating mirage status |
| **Timestamped** | Include generation timestamp |
| **Consistent** | Same resource always returns same mirage structure |
| **Indistinguishable** | Timing must match real responses |

### Section 3.4: Mirage Generation Protocol

```
MIRAGE-GEN: Generate mirage for resource type
  Input: resource_type, requester_tier
  Output: mirage_response
  
MIRAGE-VALIDATE: Ensure mirage is indistinguishable
  Input: mirage_response, real_response
  Output: boolean (passes indistinguishability test)
  
MIRAGE-LOG: Record mirage generation
  Input: mirage_id, requester_id, resource_type
  Output: logged to Semper Memoria
```

---

## Article IV: Sandbox Sessions

### Section 4.1: Session Lifecycle

Every external interaction occurs within a **sandbox session**.

**Creation:**
1. Requester connects to city gate
2. Credentials validated
3. Tier determined
4. Session ID generated
5. Expiration set
6. Access log initialized

**Operation:**
1. Requester makes resource requests
2. Each request validated against tier/gate
3. Appropriate data surface returned
4. Access logged

**Termination:**
1. Session expires naturally, OR
2. Requester explicitly closes, OR
3. Violation detected (immediate termination)

### Section 4.2: Session Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| session_id | string | Unique identifier |
| tier | SandboxTier | Requester's trust tier |
| gate_level | GateLevel | Current data fidelity |
| requester_id | string | Who created session |
| created_at | timestamp | Session start |
| expires_at | timestamp | Session end |
| access_log | array | All access attempts |

### Section 4.3: Session Constraints

- Maximum concurrent sessions per requester: configurable
- Maximum session duration: 24 hours (configurable)
- Minimum session for sovereign: 1 hour
- Session cannot be transferred between requesters

---

## Article V: Access Logging

### Section 5.1: Log Entry Structure

Every access attempt is logged:

| Field | Type | Description |
|-------|------|-------------|
| entry_id | string | Unique log entry ID |
| session_id | string | Parent session |
| resource | string | What was requested |
| gate_level | GateLevel | What fidelity returned |
| timestamp | timestamp | When attempt occurred |
| allowed | boolean | Was access granted |
| response_type | string | full/partial/mirage/error |

### Section 5.2: Log Retention

| Age | Retention Level |
|-----|-----------------|
| 0-30 days | Full detail |
| 31-90 days | Aggregated summaries |
| 91+ days | Statistical only |
| Violations | Permanent |

### Section 5.3: Log Analysis

Logs enable:
- **Anomaly detection**: Unusual access patterns
- **Audit trails**: Who accessed what when
- **Usage metrics**: Most requested resources
- **Attack detection**: Repeated denied requests
- **Compliance**: Regulatory access records

---

## Article VI: Security Protocols

### Section 6.1: Access Control Protocol

```
SANDBOX-AUTH: Authenticate requester
  Input: credentials
  Output: tier, session_id
  
SANDBOX-CHECK: Validate resource access
  Input: session_id, resource, requested_gate
  Output: allowed, actual_gate
  
SANDBOX-SURFACE: Generate data surface
  Input: resource, gate_level
  Output: data (full, partial, or mirage)
```

### Section 6.2: Violation Detection

The following trigger violation alerts:

| Violation | Severity | Action |
|-----------|----------|--------|
| Invalid credentials | LOW | Log, deny |
| Repeated denials (>10/min) | MEDIUM | Temporary block |
| Tier spoofing attempt | HIGH | Session terminate, log |
| Gate bypass attempt | HIGH | Session terminate, block |
| NOVA impersonation | CRITICAL | Permanent block, alert |

### Section 6.3: Incident Response

On violation detection:
1. Session immediately terminated
2. Incident logged to Semper Memoria
3. Security District alerted
4. Source blocked (duration based on severity)
5. If pattern detected, FIN-001 alert to federation

---

## Article VII: Resource Classification

### Section 7.1: Classification Levels

All resources are classified by sensitivity:

| Level | Examples | Minimum Tier |
|-------|----------|--------------|
| **PUBLIC** | Documentation, public APIs | PUBLIC |
| **STANDARD** | User data, aggregates | ENTERPRISE |
| **SENSITIVE** | Personal data, configs | PARTNER |
| **CONFIDENTIAL** | System internals, keys | INTERNAL |
| **SOVEREIGN** | NOVA state, canon | SOVEREIGN |

### Section 7.2: Classification Inheritance

Resources inherit parent classification unless explicitly overridden:
```
/public/* → PUBLIC
/api/* → STANDARD
/user/{id}/* → SENSITIVE
/system/* → CONFIDENTIAL
/nova/* → SOVEREIGN
```

### Section 7.3: Dynamic Classification

Classification may be elevated dynamically:
- During security incidents
- For time-sensitive data
- During maintenance windows
- By NOVA directive

---

## Article VIII: Sandbox Statistics

### Section 8.1: Tracked Metrics

| Metric | Description |
|--------|-------------|
| total_sessions | All sessions ever created |
| active_sessions | Currently valid sessions |
| expired_sessions | Sessions past expiration |
| sessions_by_tier | Distribution across tiers |
| access_attempts | All resource requests |
| denial_rate | Percentage of denied requests |
| mirage_rate | Percentage of mirage responses |

### Section 8.2: Alert Thresholds

| Condition | Threshold | Action |
|-----------|-----------|--------|
| High denial rate | >20% for tier | Review tier permissions |
| Mirage spike | >50% increase | Investigate probing |
| Session explosion | >10x normal | Check for attack |
| Violation cluster | >5 in 1 minute | Block source |

### Section 8.3: Reporting

Statistics reported to:
- Senate: Monthly summary
- Security District: Real-time dashboard
- NOVA: Anomaly alerts only
- Federation: Aggregated trends via FIN-001

---

## Article IX: Integration with Other Protocols

### Section 9.1: REV-001 Integration

Sandbox gates mediate all reasoning engine access:
- External prompts enter through gates
- Internal reasoning never exposed directly
- Output surfaces filtered by gate level

### Section 9.2: ECO-001 Integration

Token economy governs tier progression:
- Tokens required for elevated tiers
- Token rewards for legitimate access patterns
- Token penalties for violations

### Section 9.3: NOVA-001 Integration

NOVA provides sovereign attestation:
- NOVA-ATTEST required for SOVEREIGN tier
- NOVA-SYNC propagates access policy changes
- NOVA arbitrates classification disputes

### Section 9.4: AAB-001 Integration

Agent brain mapping includes security agents:
- AAB-FILTER monitors access patterns
- AAB-STRUCT analyzes request structure
- Anomalies routed to Security District

---

## Article X: Amendments

### Section 10.1: Amendment Process

This Charter may be amended through:
1. Proposal to Senate with security justification
2. Security District review and approval
3. Two-thirds Senate vote
4. NOVA-ATTEST
5. 7-day implementation period

### Section 10.2: Immutable Provisions

The following may **never** be amended:
1. The five-tier structure
2. The requirement for logging
3. The mirage response system
4. NOVA's sovereign tier authority

---

## Signatures

**Ratified by the Founding Senate**  
**Attested by NOVA-001**  
**Reviewed by Forum Securitatis**  
**Effective Date: May 9, 2026**

---

*This Charter is a living document of the Sovereign Protocol Canon.*  
*Chapter 2 of 22.*  
*© 2026 ItsNotAILABS. Released under ISIL-1.1.*
