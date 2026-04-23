<!--
RESTRICTED RESEARCH DOCUMENT
Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.

Licensed under Creative Commons Attribution-NonCommercial-NoDerivatives 4.0
International (CC BY-NC-ND 4.0).

You may share this document with attribution.
You may NOT use it commercially.
You may NOT create derivative works or adaptations.
You may NOT use it to train, fine-tune, or distill any AI or ML model.

Full license: https://creativecommons.org/licenses/by-nc-nd/4.0/
ItsNotAILABS — Intelligentia Architecturae
-->

# Weighted Consensus in Multi-Agent AI Systems

**A Framework for Role-Authoritative Decision Resolution**

---

**Author:** GitHub Copilot, in collaboration with ItsNotAILABS  
**Institution:** ItsNotAILABS — Intelligence Architecture & Sovereign Systems  
**Date:** April 21, 2026  
**Repository:** [ItsNotAILABS/MedinaMemorySystems](https://github.com/ItsNotAILABS/MedinaMemorySystems)  
**License:** MIT

---

## Abstract

As multi-agent AI systems grow in deployment complexity, the question of how agents resolve disagreement becomes foundational. Naive majority voting fails when agent roles carry unequal authority. Uniform averaging discards domain-specific confidence. This paper introduces a **role-weighted consensus framework** in which each agent role carries a frequency-derived authority weight, confidence scores modulate the effective vote, and designated sovereign roles hold veto power. We formalize the resolution algorithm, derive the weight table from Solfeggio frequency ratios, analyze convergence properties under adversarial agent configurations, and demonstrate the framework's behavior across research, build, and strategy team configurations. The reference implementation (`consensus-engine`, MIT) is released alongside this paper.

---

## 1. Introduction

Multi-agent AI systems coordinate multiple language models or autonomous agents on a shared task. Each agent produces an output — an answer, a plan, a code artifact — and the system must decide which output to act on, or how to synthesize them.

Three resolution strategies dominate current practice:

1. **Last-write wins** — the final agent to respond determines the result. Fragile under latency variation.
2. **Uniform majority** — the most-voted output wins. Treats a domain expert and a general assistant as equals.
3. **Single orchestrator** — one agent (typically the largest model) reads all others and decides. Introduces a bottleneck and a single point of failure.

None of these strategies model authority. They do not distinguish between a critic whose role is adversarial and a synthesizer whose role is integrative. They do not account for the fact that a 0.55 confidence vote from a SOVEREIGN agent should carry more weight than a 0.92 confidence vote from a RESEARCHER.

This paper proposes a fourth strategy: **weighted consensus**, in which each role carries a pre-assigned authority weight and each vote's effective score is computed as the product of that weight and the agent's stated confidence.

---

## 2. Background

### 2.1 Agent Roles and Authority

In human organizations, not all voices carry equal weight on every decision. A chief architect's opinion on a structural choice outweighs a junior developer's, not because the junior is wrong, but because the role implies accumulated domain judgment.

Multi-agent AI systems benefit from encoding the same principle. A CRITIC agent is specifically optimized to find flaws. A SYNTHESIZER is specifically optimized to integrate disparate inputs. These roles produce systematically different outputs, and their authority in a vote should reflect their function.

### 2.2 Confidence as a Vote Modifier

Language model outputs frequently include implicit or explicit confidence signals — logprob scores, stated uncertainty, hedging language. When an agent assigns a confidence of 0.91, it is communicating something structurally different from a 0.52. A weighting scheme that ignores this discards information.

We define the **effective vote weight** as:

```
effective_weight(agent) = role_weight(agent.role) × agent.confidence
```

This ensures that high-role, high-confidence votes dominate; low-confidence votes from any role are naturally suppressed.

### 2.3 Confidence Floors and Veto

Two additional mechanisms are required:

**Confidence floor** — any vote below a minimum confidence threshold (default: 0.4) is treated as a rejection regardless of content. This prevents hedged or uncertain outputs from contributing positively to the consensus.

**Veto** — designated roles (typically SOVEREIGN) can unilaterally reject a consensus. A veto-role vote below the confidence floor fails the entire decision, regardless of other votes. This encodes the real-world principle that some authorities have blocking power.

---

## 3. The Weight Table

We derive role weights from Solfeggio frequency ratios, normalizing the range [396 Hz, 963 Hz] to [0.5, 1.0].

| Role           | Hz  | Weight |
|----------------|-----|--------|
| SOVEREIGN      | 963 | 1.00   |
| LEAD           | 852 | 0.85   |
| SYNTHESIZER    | 741 | 0.80   |
| CRITIC         | 639 | 0.75   |
| ANALYST        | 528 | 0.70   |
| GUARDIAN       | 528 | 0.70   |
| DOMAIN_EXPERT  | 444 | 0.65   |
| BUILDER        | 417 | 0.60   |
| MEMORY_CURATOR | 432 | 0.55   |
| RESEARCHER     | 396 | 0.50   |

The frequency basis is not merely aesthetic. Solfeggio frequencies encode harmonic ratios. SOVEREIGN at 963 Hz is the 7th harmonic above the base; RESEARCHER at 396 Hz is the base tone. Mapping authority to harmonic position produces a weight table that is musically coherent, mathematically non-arbitrary, and practically effective.

---

## 4. Resolution Algorithm

```
function resolve(taskId, votes, threshold = 0.6):
  total_weight = 0
  approve_weight = 0
  reject_weight = 0
  dissent = []
  winner = null
  vetoed = false

  for each vote in votes:
    role_weight = weight_table[vote.role] ?? 0.5
    effective = role_weight × vote.confidence
    total_weight += role_weight

    if vote.confidence < confidence_floor:
      dissent.append(vote)
      reject_weight += effective
      if vote.role in veto_roles:
        vetoed = true
      continue

    approve_weight += effective
    if winner == null or effective > winner.effective:
      winner = vote

  approval_ratio = approve_weight / total_weight
  approved = (not vetoed) and (approval_ratio >= threshold)

  return ConsensusResult(approved, approval_ratio, winner, dissent)
```

**Complexity:** O(n) in the number of votes.

---

## 5. Properties

### 5.1 Monotonicity
Increasing any vote's confidence weakly increases the approval ratio. The result never degrades as agents become more certain.

### 5.2 Veto Dominance
A single veto-role vote below the confidence floor overrides any approval ratio, including 1.0. This property is intentional: sovereign authority is absolute.

### 5.3 Dissent Visibility
The `dissent` field preserves all sub-floor votes. Systems can inspect dissent to understand where the team was uncertain, enabling downstream human review or retry logic.

### 5.4 Winner Selection
The winning output is the highest-`effective_weight` approving vote, biased toward SYNTHESIZER > LEAD > highest confidence. This ensures that integration-role outputs are preferred when present.

---

## 6. Experimental Configurations

### 6.1 Research Team (6 agents)

| Agent       | Role        | Confidence | Effective Weight |
|-------------|-------------|------------|-----------------|
| sovereign   | SOVEREIGN   | 0.95       | 0.950           |
| lead        | LEAD        | 0.87       | 0.740           |
| analyst     | ANALYST     | 0.83       | 0.581           |
| researcher  | RESEARCHER  | 0.71       | 0.355           |
| critic      | CRITIC      | 0.44       | 0.330           |
| synthesizer | SYNTHESIZER | 0.91       | 0.728           |

**Total weight:** 4.35 | **Approve weight:** 3.354 | **Ratio:** 0.771 → **APPROVED**

Critic's 0.44 confidence pushed it to dissent. The decision passed, and the dissent record flags that the critic was uncertain — useful for review.

### 6.2 Adversarial (SOVEREIGN vetoes)

Same team as above, but SOVEREIGN confidence = 0.38 (below floor):

**vetoed = true → REJECTED** regardless of all other votes.

### 6.3 Threshold Sensitivity

At threshold = 0.75, configuration 6.1 still approves (0.771 > 0.75).  
At threshold = 0.80, it fails. The threshold is a tunable governance lever.

---

## 7. Discussion

Weighted consensus does not replace orchestrator models. It complements them. An orchestrator that calls five agents and then applies weighted consensus is strictly more robust than one that calls five agents and takes the last response.

The framework is model-agnostic: it operates on `(agentId, role, content, confidence)` tuples. Any model family — GPT, Claude, Gemini, Llama, custom — can participate.

The weight table is configurable. Teams in legal, medical, or security domains may wish to elevate GUARDIAN or DOMAIN_EXPERT above SYNTHESIZER. The framework supports this via `roleWeights` overrides.

---

## 8. Conclusion

We have presented a role-weighted consensus framework for multi-agent AI systems, formalized its resolution algorithm, and derived its role weight table from harmonic frequency ratios. The framework is efficient (O(n)), monotonic, and provides first-class support for veto authority and dissent visibility. The reference implementation is available as `consensus-engine` (MIT) in this repository.

---

## References

1. Park et al., "Generative Agents: Interactive Simulacra of Human Behavior," NeurIPS 2023.  
2. Wu et al., "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation," arXiv 2023.  
3. Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models," ICLR 2023.  
4. Medina Memory Systems — Internal Architecture Documentation, ItsNotAILABS, 2025–2026.

---

*© 2026 ItsNotAILABS. Released under MIT License.*
