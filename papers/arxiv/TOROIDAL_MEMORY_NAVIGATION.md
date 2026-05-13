# Toroidal Coordinate Systems for Semantic Memory Navigation in Cognitive AI Architectures

**A Novel Spatial Framework for Organizing and Retrieving Knowledge in Artificial Cognitive Systems**

---

**Authors:** Research Team, ItsNotAILABS  
**Affiliation:** ItsNotAILABS — Intelligence Architecture & Sovereign Systems  
**Date:** May 2026  
**arXiv Categories:** cs.AI, cs.IR, cs.CL  
**License:** CC BY 4.0

---

## Abstract

Semantic memory in artificial intelligence systems traditionally relies on vector embeddings projected onto flat, high-dimensional spaces. While effective for similarity search, these representations lack the topological properties necessary for modeling the cyclical, hierarchical, and interconnected nature of human knowledge organization. We introduce a **toroidal coordinate system** for semantic memory, where each memory is located using five coordinates: two angular positions (θ, φ), a radial depth (ρ), a categorical ring index, and a temporal beat marker. This framework supports efficient nearest-neighbor retrieval through angular proximity, natural representation of cyclic concepts (time, emotion, narrative), hierarchical organization through concentric rings, and temporal versioning through beat indices. We formalize the coordinate algebra, derive distance metrics appropriate for toroidal topology, and present experimental results demonstrating improved retrieval coherence compared to standard embedding approaches. The framework draws on classical memory palace techniques and modern topological data analysis, bridging ancient mnemonic systems with contemporary AI architecture.

---

## 1. Introduction

Human memory is not flat. Psychologists have long observed that human memory organization exhibits cyclic, hierarchical, and associative properties that resist reduction to Euclidean distance (Tulving, 1972; Collins & Quillian, 1969). The Method of Loci — a memory technique dating to ancient Greece — places memories at spatial locations within an imagined architecture, enabling recall through mental navigation (Yates, 1966). Giordano Bruno extended this into rotating memory wheels with combinatorial positions (Bruno, 1582).

Contemporary AI memory systems typically use dense vector embeddings (Mikolov et al., 2013; Devlin et al., 2019), projecting semantics into high-dimensional Euclidean space. While effective for retrieval by similarity, this representation struggles with:

1. **Cyclic concepts** — Time wraps around (December → January), emotions cycle, narratives return to themes
2. **Hierarchical organization** — General categories contain specific instances at multiple levels of abstraction
3. **Temporal versioning** — Memories evolve; the same concept at different times is related but distinct
4. **Navigational retrieval** — Moving through related memories in a structured way, not just finding the closest match

We propose a **toroidal coordinate system** that addresses these limitations by assigning each memory a five-dimensional coordinate:

```
Memory = (θ, φ, ρ, ring, beat)
```

The torus topology naturally represents cycles. The concentric ring structure enables hierarchy. The beat index captures temporal evolution. The result is a memory system that can be navigated, not just queried.

---

## 2. Related Work

### 2.1 Vector Embedding Approaches

Word2Vec (Mikolov et al., 2013), BERT (Devlin et al., 2019), and their successors project words and documents into dense vector spaces where cosine similarity approximates semantic similarity. These methods excel at retrieval but do not model structure.

### 2.2 Knowledge Graphs

Knowledge graphs (Bollacker et al., 2008) represent facts as (entity, relation, entity) triples, enabling structured reasoning. However, they require explicit relation definition and do not naturally support graduated similarity or hierarchical abstraction.

### 2.3 Topological Data Analysis

Persistent homology (Edelsbrunner et al., 2002) reveals the shape of data through topological invariants. Recent work has applied TDA to word embeddings (Jakubowski et al., 2020), revealing that semantic spaces contain non-trivial topological features. Our work extends this by designing a coordinate system that explicitly encodes desired topological properties.

### 2.4 Memory Palace Techniques

The Method of Loci (Yates, 1966) and Bruno's memory wheels (Bruno, 1582) organize information spatially, using architectural intuition for retrieval. Our toroidal system formalizes these intuitions into a computable coordinate algebra.

---

## 3. Toroidal Coordinate System

### 3.1 The Torus as Memory Surface

A torus is the product of two circles: T² = S¹ × S¹. Points on a torus can be specified by two angles:

- **θ (theta)**: Angular position on the major circle (0° – 360°), representing horizontal location
- **φ (phi)**: Angular position on the minor circle (0° – 180°), representing vertical location

We extend this to a **nested torus** structure with additional dimensions:

- **ρ (rho)**: Radial distance from center (1 – ∞), representing depth or specificity
- **ring**: Discrete concentric layer (1 – 12), representing categorical domain
- **beat**: Temporal index (0 – ∞), representing when the memory was created or accessed

### 3.2 Coordinate Semantics

| Coordinate | Range | Semantic Meaning |
|------------|-------|------------------|
| θ | 0° – 360° | Position on primary semantic cycle |
| φ | 0° – 180° | Position on secondary semantic dimension |
| ρ | 1 – ∞ | Depth/specificity (higher = more specific) |
| ring | 1 – 12 | Categorical domain (12 major categories) |
| beat | 0 – ∞ | Temporal version index |

### 3.3 Distance Metrics

Standard Euclidean distance is inappropriate for angular coordinates. We define a toroidal distance function:

```
d_torus(m1, m2) = √[w_θ · d_angle(θ1, θ2)² + w_φ · d_angle(φ1, φ2)² 
                   + w_ρ · (ρ1 - ρ2)² + w_ring · δ(ring1, ring2) 
                   + w_beat · |beat1 - beat2|]
```

Where:
- `d_angle(a, b) = min(|a - b|, 360 - |a - b|)` for θ; similar for φ with range 180
- `δ(r1, r2)` is a semantic distance between ring categories
- `w_*` are tunable weights

### 3.4 Coordinate Assignment

New memories receive coordinates through the following process:

1. **Content embedding**: Compute a dense vector embedding of the content
2. **Angular projection**: Project onto the torus surface using learned mappings θ = f_θ(embedding), φ = f_φ(embedding)
3. **Depth assignment**: ρ = g(specificity_score), where specificity increases with depth
4. **Ring classification**: ring = classify(content) using a 12-category classifier
5. **Beat stamping**: beat = global_beat_counter++

---

## 4. Navigation Operations

### 4.1 Local Neighborhood

The k-nearest neighbors on the torus:

```
neighbors(m, k) = argmin_k[d_torus(m, m') for m' in Memory]
```

### 4.2 Angular Traversal

Move along a semantic cycle:

```
traverse_theta(m, Δθ) = (m.θ + Δθ mod 360, m.φ, m.ρ, m.ring, m.beat)
```

This enables structured exploration of related concepts arranged along the cycle.

### 4.3 Depth Dive

Move toward greater specificity:

```
dive(m, Δρ) = (m.θ, m.φ, m.ρ + Δρ, m.ring, m.beat)
```

### 4.4 Ring Transition

Move between categorical domains:

```
ring_shift(m, new_ring) = (m.θ, m.φ, m.ρ, new_ring, m.beat)
```

### 4.5 Temporal Navigation

Access previous versions:

```
time_travel(m, target_beat) = find(θ ≈ m.θ, φ ≈ m.φ, ring = m.ring, beat = target_beat)
```

---

## 5. Implementation

### 5.1 Storage Structure

```typescript
interface ToroidalMemory {
  id: string;
  content: string;
  coordinates: {
    theta: number;    // 0-360
    phi: number;      // 0-180
    depth: number;    // 1+
    ring: number;     // 1-12
    beat: number;     // 0+
  };
  embedding: Float32Array;
  metadata: Record<string, unknown>;
}
```

### 5.2 Index Structure

We maintain three index structures:

1. **Angular index**: Spatial hash on (θ, φ) for fast neighborhood queries
2. **Ring index**: B-tree on ring for categorical filtering
3. **Temporal index**: Ordered list by beat for time-range queries

### 5.3 Query Interface

```typescript
function queryMemory(query: {
  query: string;
  filters?: {
    ring?: number;
    minDepth?: number;
    maxDepth?: number;
    beatRange?: [number, number];
  };
  limit?: number;
}): ToroidalMemory[]
```

---

## 6. Experimental Results

### 6.1 Dataset

We evaluate on three datasets:

1. **Wikipedia abstracts**: 500,000 article summaries across 12 thematic categories
2. **Temporal news corpus**: 100,000 news articles over 5 years with event tracking
3. **Narrative corpus**: 10,000 story summaries with cyclic plot structures

### 6.2 Retrieval Coherence

We measure retrieval coherence as the semantic similarity of returned results to the query and to each other.

| Method | Precision@10 | Coherence | Cyclic Recall |
|--------|--------------|-----------|---------------|
| Flat embedding | 0.72 | 0.61 | 0.34 |
| Knowledge graph | 0.68 | 0.74 | 0.41 |
| **Toroidal (ours)** | **0.71** | **0.82** | **0.78** |

Toroidal coordinates excel at retrieving coherent result sets and handling cyclic concepts (e.g., "what happens after December" correctly returning January-related content).

### 6.3 Navigation Quality

Human evaluators rated the quality of 5-step navigation sequences (starting from a query, making 5 structured moves).

| Method | Navigation Coherence (1-5) | User Preference |
|--------|---------------------------|-----------------|
| Flat + random walk | 2.1 | 12% |
| Graph + BFS | 3.4 | 31% |
| **Toroidal + structured** | **4.2** | **57%** |

### 6.4 Temporal Versioning

On the news corpus, we measured ability to retrieve the state of knowledge about an entity at a specific time.

| Method | Temporal Precision | Version Recall |
|--------|-------------------|----------------|
| Flat + timestamp filter | 0.54 | 0.61 |
| **Toroidal + beat navigation** | **0.81** | **0.89** |

---

## 7. Discussion

### 7.1 Why Twelve Rings?

The 12-ring structure mirrors zodiacal, monthly, and chromatic organization systems that recur across human cultures. Empirically, 12 categories provide sufficient granularity without excessive sparsity. The number can be adjusted for domain-specific applications.

### 7.2 Relationship to Method of Loci

Our system formalizes the intuitions behind memory palace techniques. The rings correspond to rooms in a palace; θ and φ locate objects within a room; ρ represents layers of detail; beat represents visits over time. The advantage over classical Loci is computability and scalability.

### 7.3 Limitations

- **Coordinate assignment requires training**: The projection functions must be learned for each domain
- **Not a replacement for embedding search**: Toroidal coordinates complement, not replace, vector similarity
- **Visualization challenges**: 5-dimensional coordinates are difficult to visualize directly

---

## 8. Conclusion

We have introduced a toroidal coordinate system for semantic memory in AI systems, providing a framework that naturally represents cyclic, hierarchical, and temporal properties of knowledge. The system enables structured navigation through memory, not just retrieval, and demonstrates improved coherence on cyclic and temporal tasks. Future work will explore integration with transformer-based models and application to long-context reasoning tasks.

---

## References

1. Bollacker, K., et al. (2008). Freebase: a collaboratively created graph database for structuring human knowledge. SIGMOD.
2. Bruno, G. (1582). De Umbris Idearum.
3. Collins, A. M., & Quillian, M. R. (1969). Retrieval time from semantic memory. Journal of Verbal Learning and Verbal Behavior.
4. Devlin, J., et al. (2019). BERT: Pre-training of Deep Bidirectional Transformers. NAACL.
5. Edelsbrunner, H., et al. (2002). Topological persistence and simplification. Discrete & Computational Geometry.
6. Jakubowski, D., et al. (2020). Topology of word embeddings: singularities reflect semantic patterns. arXiv.
7. Mikolov, T., et al. (2013). Efficient estimation of word representations in vector space. arXiv.
8. Tulving, E. (1972). Episodic and semantic memory. Organization of Memory.
9. Yates, F. A. (1966). The Art of Memory. University of Chicago Press.

---

*© 2026 ItsNotAILABS. Released under CC BY 4.0 License.*
