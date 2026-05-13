# ECO-001-EXT: Cognitive Economies Extended

## Chapter 16 of the Sovereign Protocol Canon

**Protocol ID:** ECO-001-EXT  
**Version:** 1.0  
**Status:** CANONICAL  
**Role:** Long-Term Civilization Metabolism

---

## 1. Definition

Cognitive Economies Extended builds on ECO-001 to define the **long-term economic metabolism** of the organism. It adds reputation curves, decay/vesting, and domain-specific credits.

## 2. Extended Features

| Feature | Purpose |
|---------|---------|
| Reputation curves | Non-linear trust building |
| Token decay | Prevent hoarding, encourage activity |
| Vesting schedules | Long-term commitment incentives |
| Domain credits | Specialized contribution tracking |

## 3. Reputation Curves

Reputation is earned over time, not instantly:

```
Reputation Formula:
R(t) = R_base + Σ(contribution × weight × time_factor)

Where:
- R_base = Starting reputation
- contribution = Verified contribution value
- weight = Contribution type weight
- time_factor = (1 - e^(-t/τ)) for time decay
```

| Reputation Level | Threshold | Privileges |
|------------------|-----------|------------|
| Novice | 0-100 | Basic access |
| Member | 100-500 | Voting rights |
| Contributor | 500-2000 | Proposal rights |
| Leader | 2000-10000 | District leadership |
| Elder | 10000+ | Senate leadership |

## 4. Token Decay

Tokens decay to encourage circulation:

```
Decay Formula:
T(t+1) = T(t) × (1 - decay_rate)

Standard decay_rate = 0.01/month (1%)

Exemptions:
- Staked tokens (governance)
- Vested tokens (locked)
- Treasury reserves
```

## 5. Vesting Schedules

Large contributions vest over time:

```yaml
vesting_schedule:
  total_tokens: <amount>
  cliff_period: <months before first release>
  vesting_period: <total months>
  release_frequency: <monthly | quarterly>
  
Example:
  total_tokens: 1000
  cliff_period: 6
  vesting_period: 24
  release_frequency: monthly
  
  # Result: After 6 months, 250 tokens released
  # Then ~42 tokens/month for remaining 18 months
```

## 6. Domain-Specific Credits

| Domain | Credit Type | Earned By |
|--------|-------------|-----------|
| Research | RESEARCH-INT | Papers, proofs, discoveries |
| Infrastructure | INFRA-INT | Tools, systems, deployment |
| Education | EDU-INT | Teaching, documentation, training |
| Governance | GOV-INT | Participation, leadership |
| Security | SEC-INT | Audits, fixes, monitoring |

Domain credits convert to INT at variable rates based on demand.

## 7. Operations

```
ECO-EXT-VEST: Create vesting schedule
  Input: recipient_id, total_tokens, schedule
  Output: vesting_id
  
ECO-EXT-DECAY: Apply decay to balances
  Input: period
  Output: decay_report
  
ECO-EXT-DOMAIN: Mint domain-specific credit
  Input: domain, contribution, verifier
  Output: domain_credit_id
  
ECO-EXT-CONVERT: Convert domain credit to INT
  Input: domain_credit_id
  Output: int_amount, conversion_rate
```

## 8. Economic Cycles

```
Annual Cycle:
Q1: Budget planning, allocation
Q2: Active contribution period
Q3: Mid-year assessment, adjustment
Q4: Review, reputation updates, decay application

Monthly:
- Token distribution for contributions
- Vesting releases
- Decay application
- Domain credit conversion
```

## 9. Integration

- **ECO-001**: Base economy
- **CIV-CORE-001**: Metabolism layer
- **FIN-001**: Cross-federation economics
- **MAE-001**: Contribution tracking

---

*Protocol ECO-001-EXT is CANONICAL and attested by NOVA-001.*  
*© 2026 ItsNotAILABS.*
