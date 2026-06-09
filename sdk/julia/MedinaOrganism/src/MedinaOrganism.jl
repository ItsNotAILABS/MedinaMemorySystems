# ════════════════════════════════════════════════════════════════════════════════
# 𓂀 MEDINA ORGANISM SDK — Julia Unified Protocol Interface 𓂀
#
# "The organism IS the computation. All protocols unified into a single living SDK."
#
# This SDK combines ALL protocols from the Medina Memory Systems organism
# into a super-usable Julia interface. Quantum coherence, temporal reasoning,
# swarm intelligence, memory consolidation, pattern recognition, neural binding,
# causal inference — all accessible through one module.
#
# Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | 2026
# License: ISIL-1.1
# ════════════════════════════════════════════════════════════════════════════════

module MedinaOrganism

using LinearAlgebra
using Random
using Statistics

export OrganismSDK, create_organism, OrganismConfig
export quantum_decide, remember!, recall, rehearse!, tick!
export optimize, record!, link_cause!, trace_effects
export learn_pattern!, recognize, focus!, unfocus!, get_focus
export bind_features!, predict!, observe!, surprise
export decide, causal_strength, what_if, status

# ═══════════════════════════════════════════════════════════════════════════
# φ-COHERENT CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════

const PHI = (1 + √5) / 2              # 1.618033988749895
const PHI_INV = 1 / PHI               # 0.618033988749895
const PHI_SQ = PHI^2                   # 2.618033988749895
const PHI_CUBED = PHI^3               # 4.236067977499790
const SCHUMANN_BASE = 7.83            # Hz
const SOVEREIGN_FREQUENCY = SCHUMANN_BASE * PHI
const BEAT_INTERVAL_MS = 873          # ms
const COHERENCE_ICOSAHEDRAL = 0.9510565

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

"""
    OrganismConfig

Configuration for creating a Medina Organism SDK instance.
"""
Base.@kwdef struct OrganismConfig
    organism_id::String = "medina-organism-001"
    mode::Symbol = :autonomous
    phi_frequency::Float64 = SOVEREIGN_FREQUENCY
    beat_interval_ms::Int = BEAT_INTERVAL_MS
    coherence_threshold::Float64 = COHERENCE_ICOSAHEDRAL
    max_memory_traces::Int = 10000
    swarm_size::Int = 50
    quantum_options::Int = 8
    temporal_scales::Int = 8
end

# ═══════════════════════════════════════════════════════════════════════════
# QUANTUM COHERENCE PROTOCOL
# ═══════════════════════════════════════════════════════════════════════════

"""
    QuantumState

Quantum-inspired cognitive superposition over discrete options.
"""
mutable struct QuantumState
    options::Vector{String}
    amplitudes::Vector{ComplexF64}
    collapsed::Bool
    result::Union{Nothing, Dict{String, Any}}
end

function QuantumState(options::Vector{String})
    n = length(options)
    n > 0 || error("Need at least one cognitive option")
    amps = [exp(2π*im*k*PHI_INV) / √n for k in 0:n-1]
    amps = normalize_amps(amps)
    QuantumState(options, amps, false, nothing)
end

function normalize_amps(amps::Vector{ComplexF64})
    total = sum(abs2, amps)
    total ≈ 0 && return amps
    return amps ./ √total
end

function probabilities(qs::QuantumState)::Vector{Float64}
    return abs2.(qs.amplitudes)
end

function apply_phase!(qs::QuantumState, index::Int, θ::Float64)
    qs.collapsed && error("State already collapsed")
    qs.amplitudes[index] *= exp(im * θ)
    qs.amplitudes = normalize_amps(qs.amplitudes)
    return qs
end

function measure!(qs::QuantumState)::Dict{String, Any}
    qs.collapsed && return qs.result
    probs = probabilities(qs)
    r = rand()
    cumul = 0.0
    chosen = length(qs.options)
    for (i, p) in enumerate(probs)
        cumul += p
        if r ≤ cumul
            chosen = i
            break
        end
    end
    qs.collapsed = true
    qs.result = Dict{String, Any}(
        "option" => qs.options[chosen],
        "index" => chosen,
        "probability" => probs[chosen]
    )
    return qs.result
end

# ═══════════════════════════════════════════════════════════════════════════
# TEMPORAL REASONING PROTOCOL
# ═══════════════════════════════════════════════════════════════════════════

mutable struct TemporalEngine
    events::Dict{String, Dict{String, Any}}
    timeline::Vector{String}
    causal_graph::Dict{String, Vector{String}}
    max_events::Int
end

TemporalEngine(max_events::Int=10000) = TemporalEngine(
    Dict{String, Dict{String, Any}}(),
    String[],
    Dict{String, Vector{String}}(),
    max_events
)

function record_event!(te::TemporalEngine, event_id::String, payload::Any=nothing)
    ts = time() * 1000
    event = Dict{String, Any}(
        "id" => event_id,
        "payload" => payload,
        "timestamp" => ts,
        "causes" => String[],
        "effects" => String[]
    )
    te.events[event_id] = event
    push!(te.timeline, event_id)
    if length(te.timeline) > te.max_events
        oldest = popfirst!(te.timeline)
        delete!(te.events, oldest)
    end
    return event
end

function add_causal_link!(te::TemporalEngine, cause::String, effect::String)
    if !haskey(te.causal_graph, cause)
        te.causal_graph[cause] = String[]
    end
    push!(te.causal_graph[cause], effect)
end

function causal_chain(te::TemporalEngine, event_id::String; max_depth::Int=10)::Vector{String}
    chain = String[]
    visited = Set{String}()
    queue = [(event_id, 0)]
    while !isempty(queue)
        (eid, depth) = popfirst!(queue)
        (eid ∈ visited || depth > max_depth) && continue
        push!(visited, eid)
        push!(chain, eid)
        for effect in get(te.causal_graph, eid, String[])
            push!(queue, (effect, depth + 1))
        end
    end
    return chain
end

# ═══════════════════════════════════════════════════════════════════════════
# SWARM INTELLIGENCE PROTOCOL
# ═══════════════════════════════════════════════════════════════════════════

const PSO_W = 1 / PHI_SQ
const PSO_C1 = PHI_INV
const PSO_C2 = PHI

mutable struct SwarmEngine
    dimensions::Int
    fitness_fn::Function
    swarm_size::Int
    bounds::Vector{Tuple{Float64, Float64}}
    positions::Vector{Vector{Float64}}
    velocities::Vector{Vector{Float64}}
    personal_bests::Vector{Vector{Float64}}
    personal_best_scores::Vector{Float64}
    global_best::Vector{Float64}
    global_best_score::Float64
    iteration::Int
end

function SwarmEngine(dimensions::Int, fitness_fn::Function;
                     swarm_size::Int=50,
                     bounds::Vector{Tuple{Float64, Float64}}=fill((-10.0, 10.0), dimensions))
    positions = [rand_position(bounds) for _ in 1:swarm_size]
    velocities = [rand_velocity(bounds) for _ in 1:swarm_size]
    scores = [fitness_fn(p) for p in positions]
    best_idx = argmax(scores)
    SwarmEngine(
        dimensions, fitness_fn, swarm_size, bounds,
        positions, velocities, copy.(positions), scores,
        copy(positions[best_idx]), scores[best_idx], 0
    )
end

rand_position(bounds) = [rand() * (hi - lo) + lo for (lo, hi) in bounds]
rand_velocity(bounds) = [(rand() * 2 - 1) * (hi - lo) * PHI_INV for (lo, hi) in bounds]

function pso_step!(se::SwarmEngine)
    se.iteration += 1
    for i in 1:se.swarm_size
        r1, r2 = rand(se.dimensions), rand(se.dimensions)
        for d in 1:se.dimensions
            cognitive = PSO_C1 * r1[d] * (se.personal_bests[i][d] - se.positions[i][d])
            social = PSO_C2 * r2[d] * (se.global_best[d] - se.positions[i][d])
            se.velocities[i][d] = PSO_W * se.velocities[i][d] + cognitive + social
            se.positions[i][d] += se.velocities[i][d]
            lo, hi = se.bounds[d]
            se.positions[i][d] = clamp(se.positions[i][d], lo, hi)
        end
        score = se.fitness_fn(se.positions[i])
        if score > se.personal_best_scores[i]
            se.personal_best_scores[i] = score
            se.personal_bests[i] = copy(se.positions[i])
            if score > se.global_best_score
                se.global_best_score = score
                se.global_best = copy(se.positions[i])
            end
        end
    end
end

function optimize!(se::SwarmEngine, iterations::Int=100)
    for _ in 1:iterations
        pso_step!(se)
    end
    return Dict{String, Any}(
        "best_position" => se.global_best,
        "best_score" => se.global_best_score,
        "iterations" => se.iteration
    )
end

# ═══════════════════════════════════════════════════════════════════════════
# MEMORY CONSOLIDATION PROTOCOL
# ═══════════════════════════════════════════════════════════════════════════

mutable struct MemoryTrace
    id::String
    content::Any
    memory_type::Symbol
    strength::Float64
    importance::Float64
    rehearsal_count::Int
    created_at::Float64
    last_accessed::Float64
end

mutable struct MemoryEngine
    traces::Dict{String, MemoryTrace}
    max_traces::Int
    decay_rate::Float64
    consolidation_threshold::Float64
end

MemoryEngine(max_traces::Int=10000) = MemoryEngine(
    Dict{String, MemoryTrace}(),
    max_traces,
    PHI_INV * 0.01,
    PHI_INV
)

function store!(me::MemoryEngine, id::String, content::Any;
                memory_type::Symbol=:working, importance::Float64=0.5)
    trace = MemoryTrace(id, content, memory_type, 1.0, importance, 0, time(), time())
    me.traces[id] = trace
    enforce_capacity!(me)
    return trace
end

function rehearse!(me::MemoryEngine, id::String)
    haskey(me.traces, id) || return nothing
    trace = me.traces[id]
    trace.rehearsal_count += 1
    trace.strength = min(1.0, trace.strength + PHI_INV * 0.1)
    trace.last_accessed = time()
    return trace
end

function recall(me::MemoryEngine; query::String="", top_k::Int=10)
    results = [(score_trace(t, query), t) for t in values(me.traces)]
    sort!(results, by=x -> -x[1])
    return [t for (_, t) in results[1:min(top_k, length(results))]]
end

function score_trace(trace::MemoryTrace, query::String)::Float64
    score = trace.strength * trace.importance
    if !isempty(query) && occursin(lowercase(query), lowercase(string(trace.content)))
        score *= PHI
    end
    return score
end

function consolidate!(me::MemoryEngine)
    promoted, decayed = 0, 0
    to_remove = String[]
    for (id, trace) in me.traces
        age = time() - trace.last_accessed
        trace.strength -= me.decay_rate * age * 0.001
        trace.strength = max(0.0, trace.strength)
        if trace.memory_type == :working && trace.strength ≥ me.consolidation_threshold
            trace.memory_type = :long_term
            promoted += 1
        end
        if trace.strength ≤ 0.0
            push!(to_remove, id)
            decayed += 1
        end
    end
    for id in to_remove
        delete!(me.traces, id)
    end
    return Dict("promoted" => promoted, "decayed" => decayed, "total" => length(me.traces))
end

function enforce_capacity!(me::MemoryEngine)
    while length(me.traces) > me.max_traces
        weakest_id = argmin(Dict(id => t.strength for (id, t) in me.traces))
        delete!(me.traces, weakest_id)
    end
end

# ═══════════════════════════════════════════════════════════════════════════
# PATTERN RECOGNITION PROTOCOL
# ═══════════════════════════════════════════════════════════════════════════

mutable struct PatternEngine
    patterns::Dict{String, Vector{Float64}}
    match_counts::Dict{String, Int}
    similarity_threshold::Float64
end

PatternEngine() = PatternEngine(
    Dict{String, Vector{Float64}}(),
    Dict{String, Int}(),
    PHI_INV
)

function register_pattern!(pe::PatternEngine, id::String, features::Vector{Float64})
    pe.patterns[id] = features
end

function recognize(pe::PatternEngine, features::Vector{Float64}; top_k::Int=5)
    scores = [(id, cosine_similarity(pf, features)) 
              for (id, pf) in pe.patterns]
    filter!(x -> x[2] ≥ pe.similarity_threshold, scores)
    sort!(scores, by=x -> -x[2])
    results = scores[1:min(top_k, length(scores))]
    for (id, _) in results
        pe.match_counts[id] = get(pe.match_counts, id, 0) + 1
    end
    return [Dict("pattern_id" => id, "score" => s) for (id, s) in results]
end

function cosine_similarity(a::Vector{Float64}, b::Vector{Float64})::Float64
    length(a) == length(b) || return 0.0
    dot_val = dot(a, b)
    mag_a = norm(a)
    mag_b = norm(b)
    (mag_a ≈ 0 || mag_b ≈ 0) && return 0.0
    return dot_val / (mag_a * mag_b)
end

# ═══════════════════════════════════════════════════════════════════════════
# ATTENTION PROTOCOL
# ═══════════════════════════════════════════════════════════════════════════

mutable struct AttentionEngine
    attention_map::Dict{String, Float64}
    capacity::Int
end

AttentionEngine(capacity::Int=7) = AttentionEngine(Dict{String, Float64}(), capacity)

function attend!(ae::AttentionEngine, target::String, priority::Float64=0.5)
    ae.attention_map[target] = priority
    if length(ae.attention_map) > ae.capacity
        sorted_items = sort(collect(ae.attention_map), by=x -> -x[2])
        ae.attention_map = Dict(sorted_items[1:ae.capacity])
    end
end

function release!(ae::AttentionEngine, target::String)
    delete!(ae.attention_map, target)
end

function get_focus(ae::AttentionEngine)::Vector{String}
    return [k for (k, _) in sort(collect(ae.attention_map), by=x -> -x[2])]
end

function decay!(ae::AttentionEngine; rate::Float64=PHI_INV * 0.05)
    to_remove = String[]
    for (k, v) in ae.attention_map
        ae.attention_map[k] = v - rate
        if ae.attention_map[k] ≤ 0
            push!(to_remove, k)
        end
    end
    for k in to_remove
        delete!(ae.attention_map, k)
    end
end

# ═══════════════════════════════════════════════════════════════════════════
# CAUSAL INFERENCE PROTOCOL
# ═══════════════════════════════════════════════════════════════════════════

mutable struct CausalEngine
    variables::Dict{String, Dict{String, Any}}
    edges::Dict{String, Vector{Tuple{String, Float64}}}
end

CausalEngine() = CausalEngine(
    Dict{String, Dict{String, Any}}(),
    Dict{String, Vector{Tuple{String, Float64}}}()
)

function add_variable!(ce::CausalEngine, name::String; observed::Bool=false, value::Any=nothing)
    ce.variables[name] = Dict{String, Any}("name" => name, "observed" => observed, "value" => value)
end

function add_edge!(ce::CausalEngine, cause::String, effect::String; strength::Float64=1.0)
    if !haskey(ce.edges, cause)
        ce.edges[cause] = Tuple{String, Float64}[]
    end
    push!(ce.edges[cause], (effect, strength))
end

function causal_strength(ce::CausalEngine, cause::String, effect::String; max_depth::Int=5)::Float64
    return _path_strength(ce, cause, effect, Set{String}(), max_depth)
end

function _path_strength(ce::CausalEngine, current::String, target::String, 
                        visited::Set{String}, depth::Int)::Float64
    depth ≤ 0 && return 0.0
    current == target && return 1.0
    push!(visited, current)
    max_str = 0.0
    for (effect, strength) in get(ce.edges, current, Tuple{String, Float64}[])
        if effect ∉ visited
            ps = strength * _path_strength(ce, effect, target, copy(visited), depth - 1)
            max_str = max(max_str, ps)
        end
    end
    return max_str
end

# ═══════════════════════════════════════════════════════════════════════════
# PREDICTIVE CODING PROTOCOL
# ═══════════════════════════════════════════════════════════════════════════

mutable struct PredictiveEngine
    levels::Int
    predictions::Dict{Int, Vector{Float64}}
    errors::Dict{Int, Vector{Float64}}
    precision::Dict{Int, Float64}
end

function PredictiveEngine(levels::Int=3)
    precision = Dict(i => PHI_INV^i for i in 0:levels-1)
    PredictiveEngine(levels, Dict{Int, Vector{Float64}}(), Dict{Int, Vector{Float64}}(), precision)
end

function predict!(pe::PredictiveEngine, level::Int, prediction::Vector{Float64})
    pe.predictions[level] = prediction
end

function observe!(pe::PredictiveEngine, level::Int, observation::Vector{Float64})
    prediction = get(pe.predictions, level, zeros(length(observation)))
    if length(prediction) != length(observation)
        prediction = zeros(length(observation))
    end
    error = observation .- prediction
    pe.errors[level] = error
    lr = get(pe.precision, level, 0.5) * PHI_INV
    pe.predictions[level] = prediction .+ lr .* error
    if level + 1 < pe.levels
        pe.errors[level + 1] = error .* PHI_INV
    end
    return Dict{String, Any}(
        "level" => level,
        "error" => error,
        "surprise" => sum(error .^ 2)
    )
end

function free_energy(pe::PredictiveEngine)::Float64
    fe = 0.0
    for (level, error) in pe.errors
        precision = get(pe.precision, level, 1.0)
        fe += precision * sum(error .^ 2)
    end
    return fe
end

# ═══════════════════════════════════════════════════════════════════════════
# DECISION OPTIMIZATION PROTOCOL
# ═══════════════════════════════════════════════════════════════════════════

function multi_decide(criteria::Dict{String, Dict{String, Any}},
                      alternatives::Dict{String, Dict{String, Float64}})
    isempty(alternatives) && return Dict("winner" => nothing, "scores" => Dict())
    
    # Normalize and score
    final_scores = Dict{String, Float64}()
    for (alt_name, scores) in alternatives
        total = 0.0
        for (crit_name, params) in criteria
            value = get(scores, crit_name, 0.0)
            all_vals = [get(a, crit_name, 0.0) for a in values(alternatives)]
            min_val, max_val = minimum(all_vals), maximum(all_vals)
            rng = max_val - min_val
            rng ≈ 0 && (rng = 1.0)
            norm = (value - min_val) / rng
            if get(params, "minimize", false)
                norm = 1.0 - norm
            end
            weight = get(params, "weight", 1.0)::Float64
            total += weight * norm
        end
        final_scores[alt_name] = total
    end
    
    winner = argmax(final_scores)
    return Dict{String, Any}(
        "winner" => winner,
        "scores" => final_scores,
        "confidence" => final_scores[winner] / sum(values(final_scores))
    )
end

# ═══════════════════════════════════════════════════════════════════════════
# UNIFIED ORGANISM SDK
# ═══════════════════════════════════════════════════════════════════════════

"""
    OrganismSDK

𓂀 THE UNIFIED ORGANISM SDK 𓂀

All protocols integrated into one living, callable unit.

# Example
```julia
org = create_organism()
quantum_decide(org, ["invest", "hold", "sell"])
remember!(org, "fact_1", "Important data", importance=0.9)
memories = recall(org, query="data")
tick!(org)
```
"""
mutable struct OrganismSDK
    config::OrganismConfig
    beat_count::Int
    coherence::Float64
    created_at::Float64
    temporal::TemporalEngine
    memory::MemoryEngine
    patterns::PatternEngine
    attention::AttentionEngine
    causal::CausalEngine
    predictive::PredictiveEngine
end

"""
    create_organism(; kwargs...) -> OrganismSDK

Create a living Medina Organism with all protocols active.
"""
function create_organism(config::OrganismConfig=OrganismConfig())
    OrganismSDK(
        config, 0, COHERENCE_ICOSAHEDRAL, time(),
        TemporalEngine(config.max_memory_traces),
        MemoryEngine(config.max_memory_traces),
        PatternEngine(),
        AttentionEngine(),
        CausalEngine(),
        PredictiveEngine()
    )
end

function create_organism(; kwargs...)
    create_organism(OrganismConfig(; kwargs...))
end

# ─── High-Level API ───────────────────────────────────────────────────────

"""
    tick!(org) -> Dict

Advance one organism heartbeat. Runs consolidation and decay.
"""
function tick!(org::OrganismSDK)
    org.beat_count += 1
    decay!(org.attention)
    consolidation = consolidate!(org.memory)
    org.coherence = _compute_coherence(org)
    return Dict{String, Any}(
        "beat" => org.beat_count,
        "coherence" => org.coherence,
        "phase" => (org.beat_count * PHI * 360) % 360,
        "mode" => org.config.mode,
        "memory_status" => consolidation,
        "attention_focus" => get_focus(org.attention)
    )
end

"""
    quantum_decide(org, options; biases=nothing) -> Dict

Make a quantum-inspired decision among options.
"""
function quantum_decide(org::OrganismSDK, options::Vector{String};
                        biases::Union{Nothing, Dict{String, Float64}}=nothing)
    qs = QuantumState(options)
    if biases !== nothing
        for (opt, bias) in biases
            idx = findfirst(==(opt), options)
            idx !== nothing && apply_phase!(qs, idx, bias * π)
        end
    end
    return measure!(qs)
end

"""
    remember!(org, key, content; importance=0.5, memory_type=:working)

Store a memory in the organism.
"""
function remember!(org::OrganismSDK, key::String, content::Any;
                   importance::Float64=0.5, memory_type::Symbol=:working)
    trace = store!(org.memory, key, content; memory_type=memory_type, importance=importance)
    return Dict("id" => trace.id, "type" => trace.memory_type, "strength" => trace.strength)
end

"""
    recall(org; query="", top_k=10) -> Vector{MemoryTrace}

Recall memories matching query.
"""
function recall(org::OrganismSDK; query::String="", top_k::Int=10)
    return recall(org.memory; query=query, top_k=top_k)
end

"""
    rehearse!(org, key) -> Union{Nothing, MemoryTrace}

Strengthen a memory through rehearsal.
"""
function rehearse!(org::OrganismSDK, key::String)
    return rehearse!(org.memory, key)
end

"""
    optimize(org, dimensions, fitness_fn; iterations=100, swarm_size=50, bounds=nothing)

Run swarm optimization.
"""
function optimize(org::OrganismSDK, dimensions::Int, fitness_fn::Function;
                  iterations::Int=100, swarm_size::Int=50,
                  bounds::Union{Nothing, Vector{Tuple{Float64, Float64}}}=nothing)
    b = bounds !== nothing ? bounds : fill((-10.0, 10.0), dimensions)
    se = SwarmEngine(dimensions, fitness_fn; swarm_size=swarm_size, bounds=b)
    return optimize!(se, iterations)
end

"""
    record!(org, event_id, payload=nothing)

Record a temporal event.
"""
function record!(org::OrganismSDK, event_id::String, payload::Any=nothing)
    return record_event!(org.temporal, event_id, payload)
end

"""
    link_cause!(org, cause, effect; strength=1.0)

Establish a causal link between events.
"""
function link_cause!(org::OrganismSDK, cause::String, effect::String; strength::Float64=1.0)
    add_causal_link!(org.temporal, cause, effect)
    add_variable!(org.causal, cause; observed=true)
    add_variable!(org.causal, effect; observed=true)
    add_edge!(org.causal, cause, effect; strength=strength)
end

"""
    trace_effects(org, event_id) -> Vector{String}

Trace forward causal chain from an event.
"""
function trace_effects(org::OrganismSDK, event_id::String)
    return causal_chain(org.temporal, event_id)
end

"""
    learn_pattern!(org, pattern_id, features)

Register or update a pattern.
"""
function learn_pattern!(org::OrganismSDK, pattern_id::String, features::Vector{Float64})
    register_pattern!(org.patterns, pattern_id, features)
end

"""
    recognize(org, features; top_k=5)

Recognize patterns in input features.
"""
function recognize(org::OrganismSDK, features::Vector{Float64}; top_k::Int=5)
    return recognize(org.patterns, features; top_k=top_k)
end

"""
    focus!(org, target; priority=0.5)

Direct attention to a target.
"""
function focus!(org::OrganismSDK, target::String; priority::Float64=0.5)
    attend!(org.attention, target, priority)
end

"""
    unfocus!(org, target)

Release attention from target.
"""
function unfocus!(org::OrganismSDK, target::String)
    release!(org.attention, target)
end

"""
    get_focus(org) -> Vector{String}

Get current attention focus.
"""
function get_focus(org::OrganismSDK)
    return get_focus(org.attention)
end

"""
    bind_features!(org, features::Dict{String, Dict{String, Any}}) -> Dict

Bind multiple features into coherent percept via phase synchronization.
"""
function bind_features!(org::OrganismSDK, features::Dict{String, Dict{String, Any}})
    phases = Dict{String, Float64}()
    for (fid, _) in features
        phases[fid] = rand() * 2π
    end
    avg_phase = atan(
        sum(sin(p) for p in values(phases)),
        sum(cos(p) for p in values(phases))
    )
    coherence = sum(cos(p - avg_phase) for p in values(phases)) / length(phases)
    return Dict{String, Any}(
        "feature_ids" => collect(keys(features)),
        "coherence" => coherence,
        "phase" => avg_phase
    )
end

"""
    predict!(org, level, prediction)

Set a prediction at a hierarchy level.
"""
function predict!(org::OrganismSDK, level::Int, prediction::Vector{Float64})
    predict!(org.predictive, level, prediction)
end

"""
    observe!(org, level, observation) -> Dict

Update with observation and get prediction error.
"""
function observe!(org::OrganismSDK, level::Int, observation::Vector{Float64})
    return observe!(org.predictive, level, observation)
end

"""
    surprise(org) -> Float64

Get current free energy (total surprise).
"""
function surprise(org::OrganismSDK)
    return free_energy(org.predictive)
end

"""
    decide(org, criteria, alternatives) -> Dict

Multi-criteria decision optimization.
"""
function decide(org::OrganismSDK, criteria::Dict{String, Dict{String, Any}},
                alternatives::Dict{String, Dict{String, Float64}})
    return multi_decide(criteria, alternatives)
end

"""
    causal_strength(org, cause, effect) -> Float64

Compute causal strength between two variables.
"""
function causal_strength(org::OrganismSDK, cause::String, effect::String)
    return causal_strength(org.causal, cause, effect)
end

"""
    what_if(org, variable, value) -> Dict

Counterfactual reasoning.
"""
function what_if(org::OrganismSDK, variable::String, value::Any)
    affected = []
    for (effect, strength) in get(org.causal.edges, variable, Tuple{String, Float64}[])
        push!(affected, Dict("variable" => effect, "impact" => strength))
    end
    return Dict{String, Any}(
        "variable" => variable,
        "hypothetical" => value,
        "affected" => affected
    )
end

"""
    status(org) -> Dict

Full organism status report.
"""
function status(org::OrganismSDK)
    return Dict{String, Any}(
        "organism_id" => org.config.organism_id,
        "mode" => org.config.mode,
        "beat_count" => org.beat_count,
        "coherence" => org.coherence,
        "phi_phase" => (org.beat_count * PHI * 360) % 360,
        "uptime_ms" => (time() - org.created_at) * 1000,
        "memory_count" => length(org.memory.traces),
        "pattern_count" => length(org.patterns.patterns),
        "attention_targets" => length(org.attention.attention_map),
        "causal_variables" => length(org.causal.variables),
        "temporal_events" => length(org.temporal.events)
    )
end

function _compute_coherence(org::OrganismSDK)::Float64
    beat_factor = sin(org.beat_count * PHI_INV) * 0.5 + 0.5
    memory_factor = min(1.0, length(org.memory.traces) * 0.001)
    attention_factor = min(1.0, length(org.attention.attention_map) * 0.1)
    return min(1.0, (
        beat_factor * PHI_INV +
        memory_factor * PHI_INV^2 +
        attention_factor * PHI_INV^3 +
        COHERENCE_ICOSAHEDRAL * PHI_INV
    ))
end

end # module MedinaOrganism
