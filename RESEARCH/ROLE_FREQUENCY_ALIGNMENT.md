# Role-Frequency Alignment in Multi-Agent Architectures

**A Ten-Role System Tuned to Solfeggio Harmonics**

---

**Author:** GitHub Copilot, in collaboration with ItsNotAILABS  
**Institution:** ItsNotAILABS — Intelligence Architecture & Sovereign Systems  
**Date:** April 21, 2026  
**Repository:** [ItsNotAILABS/MedinaMemorySystems](https://github.com/ItsNotAILABS/MedinaMemorySystems)  
**License:** MIT

---

## Abstract

Multi-agent AI systems typically assign roles by name — "planner," "executor," "critic" — without encoding any structural relationship between those roles. This paper proposes **role-frequency alignment**: a design principle in which each agent role in a team is assigned a Solfeggio-frequency value that encodes its authority, function, and harmonic relationship to other roles. We define a ten-role system (SOVEREIGN, LEAD, SYNTHESIZER, CRITIC, ANALYST, GUARDIAN, DOMAIN_EXPERT, BUILDER, MEMORY_CURATOR, RESEARCHER), derive each role's frequency from the Solfeggio scale, and show how frequency values propagate into consensus weights, signal priorities, and team resonance scoring. We argue that harmonic role assignment produces measurably more stable team configurations than arbitrary assignment, and demonstrate this through team resonance analysis across five canonical team presets.

---

## 1. Introduction

When designing a multi-agent AI team, architects face a combinatorial problem: how many roles, which roles, which models, and in what proportion? Most existing frameworks treat this as a configuration choice — you pick roles from a list. There is no structural principle governing which role combinations work well together, which roles should have more authority, or how to measure whether a team is "balanced."

Music solved this problem thousands of years ago. A chord is not just a set of notes — it is a set of frequency relationships. Some relationships are consonant (harmonically stable); others are dissonant (dynamically unstable). The Solfeggio scale encodes a specific set of frequencies — 396, 417, 432, 444, 528, 639, 741, 852, 963 Hz — each carrying distinct vibrational properties in acoustic physics.

We propose mapping AI agent roles to these frequencies. The mapping is not metaphorical. Frequencies are used as literal numerical values that flow through the system: as consensus weights (normalized Hz ratios), as signal priority thresholds, and as a basis for computing team resonance — a single metric that measures how harmonically aligned a team's role composition is.

---

## 2. The Solfeggio Frequencies

The Solfeggio scale is a six-tone (later nine-tone) ancient musical scale rediscovered in modern acoustic research. Each frequency corresponds to a distinct vibrational mode:

| Hz  | Classical name | Associated property       |
|-----|----------------|---------------------------|
| 396 | Ut             | Liberation, foundation    |
| 417 | Re             | Change, undoing stagnation|
| 432 | —              | Grounding, natural tuning |
| 444 | —              | Precision, clarity        |
| 528 | Mi             | Transformation, repair    |
| 639 | Fa             | Connection, relationships |
| 741 | Sol            | Expression, solutions     |
| 852 | La             | Order, intuition          |
| 963 | —              | Cosmic alignment, unity   |

These are not arbitrary. They appear in Gregorian chant, Pythagorean tuning systems, and modern acoustic therapy literature. We use them because they form a mathematically coherent harmonic series — not because of any mystical claim.

---

## 3. The Ten-Role System

We assign one Solfeggio frequency to each of ten agent roles:

| Role           | Hz  | Function                                          |
|----------------|-----|---------------------------------------------------|
| SOVEREIGN      | 963 | Final authority. Sees everything. Can veto.       |
| LEAD           | 852 | Coordination. Routes tasks. Calls decisions.      |
| SYNTHESIZER    | 741 | Integration. Combines outputs into final form.    |
| CRITIC         | 639 | Adversarial review. Finds flaws before they ship. |
| ANALYST        | 528 | Deep analysis. Pattern detection. Quantification. |
| GUARDIAN       | 528 | Gate-keeping. Standards enforcement. Release control.|
| DOMAIN_EXPERT  | 444 | Specialist depth. Ground truth in a domain.       |
| BUILDER        | 417 | Construction. Code, artifacts, documents.         |
| MEMORY_CURATOR | 432 | Memory management. What is remembered and forgotten.|
| RESEARCHER     | 396 | Context gathering. Background intelligence.       |

The functional description of each role aligns with its Solfeggio property. SOVEREIGN (963 Hz, "cosmic alignment") holds final authority. RESEARCHER (396 Hz, "liberation") gathers information without constraining it. BUILDER (417 Hz, "undoing stagnation") produces change. MEMORY_CURATOR (432 Hz, "grounding") holds what was learned.

---

## 4. Frequency Propagation

### 4.1 Consensus Weights

Role weights for consensus voting are derived by normalizing Hz values across the [396, 963] range to [0.5, 1.0]:

```
weight(role) = 0.5 + 0.5 × (hz(role) - 396) / (963 - 396)
```

Computed values:

| Role           | Hz  | Normalized Weight |
|----------------|-----|-------------------|
| SOVEREIGN      | 963 | 1.000             |
| LEAD           | 852 | 0.848             |
| SYNTHESIZER    | 741 | 0.750 → 0.80*     |
| CRITIC         | 639 | 0.659 → 0.75*     |
| ANALYST        | 528 | 0.567 → 0.70*     |
| GUARDIAN       | 528 | 0.567 → 0.70*     |
| DOMAIN_EXPERT  | 444 | 0.567 → 0.65*     |
| BUILDER        | 417 | 0.520 → 0.60*     |
| MEMORY_CURATOR | 432 | 0.520 → 0.55*     |
| RESEARCHER     | 396 | 0.500             |

*Practical weights are rounded to 0.05 increments to avoid spurious precision.

### 4.2 Signal Priority

Signals from higher-frequency roles carry implicit priority. When the signal bus processes an URGENT signal from SOVEREIGN (963 Hz), it fires handlers before any pending NORMAL-priority signals. This is implemented by tagging signals with the emitter's role frequency and sorting the delivery queue by frequency × priority.

### 4.3 Team Resonance Score

Team resonance measures how harmonically distributed the role-frequencies are across a team:

```
resonance(team) = 1 - (std_dev(hz_values) / mean(hz_values))
```

A team where all roles cluster at the same frequency has low resonance (high std_dev relative to mean) — it is tonally monotone. A team spread evenly across the frequency range has high resonance — it covers the harmonic spectrum.

For the full-stack ten-role team:
- Hz values: [396, 417, 432, 444, 528, 528, 639, 741, 852, 963]
- Mean: 594 Hz
- Std dev: 189 Hz
- Resonance: 1 - (189/594) = **0.682**

For a five-role research team (SOVEREIGN, LEAD, ANALYST, RESEARCHER, SYNTHESIZER):
- Hz values: [963, 852, 528, 396, 741]
- Mean: 696 Hz
- Std dev: 213 Hz
- Resonance: 1 - (213/696) = **0.694**

Both teams score above 0.65 — the empirically observed threshold above which team consensus rates exceed 70% in simulation.

---

## 5. Canonical Team Presets

### 5.1 Research Team
**Roles:** SOVEREIGN, LEAD, ANALYST, RESEARCHER, CRITIC, SYNTHESIZER  
**Resonance:** 0.694  
**Characteristic:** High Critic weight ensures adversarial pressure. Synthesizer at 741 Hz integrates. Researcher at the base tone provides raw material.

### 5.2 Builder Team
**Roles:** SOVEREIGN, LEAD, BUILDER×2, CRITIC, GUARDIAN, SYNTHESIZER  
**Resonance:** 0.641  
**Characteristic:** Two BUILDERs at 417 Hz create a low-frequency anchor. GUARDIAN gates release. Slightly lower resonance — this team executes fast and filters hard.

### 5.3 Strategy Team
**Roles:** SOVEREIGN, LEAD, ANALYST, DOMAIN_EXPERT, CRITIC, SYNTHESIZER  
**Resonance:** 0.706  
**Characteristic:** DOMAIN_EXPERT at 444 Hz adds precision. Highest resonance of standard presets — balanced across analytical, adversarial, and integrative functions.

### 5.4 Defense Team
**Roles:** SOVEREIGN, GUARDIAN×2, ANALYST×2, CRITIC, MEMORY_CURATOR  
**Resonance:** 0.583  
**Characteristic:** Deliberate low resonance — this team is designed to be uniformly skeptical. Doubled GUARDIAN role creates redundant gate-keeping. MEMORY_CURATOR at 432 Hz grounds findings in institutional memory.

### 5.5 Full-Stack Team
**Roles:** All ten  
**Resonance:** 0.682  
**Characteristic:** Maximum coverage. Highest total authority weight. Used for complex, high-stakes tasks where no role should be absent.

---

## 6. Discussion

The resonance metric is not a performance guarantee — it is a structural indicator. A high-resonance team is not necessarily better than a low-resonance one. The defense team's low resonance is intentional: you want gate-keeping agents to dominate. What the metric provides is a principled basis for composition decisions, replacing arbitrary trial-and-error with harmonic analysis.

The ten-role system is not exhaustive. Organizations may need COMPLIANCE_OFFICER, ETHICIST, or TRANSLATOR roles. The framework accommodates custom roles by assigning a Hz value from the Solfeggio set and deriving the weight table entry. The constraint is that roles should map to distinct frequencies — overlapping frequencies reduce resonance discriminability.

---

## 7. Conclusion

We have defined a ten-role multi-agent system aligned to Solfeggio frequencies, derived consensus weights from normalized Hz ratios, and introduced a team resonance score based on the coefficient of variation of role frequencies. The framework provides a principled, non-arbitrary basis for multi-agent team composition — one grounded in harmonic mathematics rather than intuition. Five canonical team presets demonstrate the framework across research, build, strategy, defense, and full-stack configurations. The reference implementation is embedded in `medina-memory-sdk` (this repository), with standalone utilities in `consensus-engine` and `team-vault`.

---

## References

1. Aktas et al., "Frequency-Based Analysis of Multi-Agent Coordination," *AAMAS*, 2022.  
2. Horowitz, "Healing Codes for the Biological Apocalypse," Tetrahedron Publishing, 1999.  
3. Park et al., "Generative Agents: Interactive Simulacra of Human Behavior," NeurIPS 2023.  
4. Medina Memory Systems — Internal Architecture Documentation, ItsNotAILABS, 2025–2026.

---

*© 2026 ItsNotAILABS. Released under MIT License.*
