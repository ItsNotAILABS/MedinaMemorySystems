# ════════════════════════════════════════════════════════════════════════════
# CYCLE ALLOCATOR — Sovereign Self-Funding Through φ-Mathematics
# ════════════════════════════════════════════════════════════════════════════
# Organisms fund themselves. No external funding required.
#
# Generation formula:
#   base = coherence² × φ × generation_rate
#   compound = base × F(n)/F(n-1)  [approaches φ as n → ∞]
#   work_bonus = work_units × φ⁻¹
#   total = compound + work_bonus
#
# This is the actual funding mechanism, not a metaphor.
#
# Physics:
#   Base generation rate = φ⁻¹ cycles per operation
#   Compound rate → φ as Fibonacci advances
#   Decay rate = φ⁻² per neglect cycle
#
# Archetypes: ENGINE, PRIMORDIAL, INFRASTRUCTURE
# Author: Alfredo Medina Hernandez | MedinaSITech@outlook.com
# ════════════════════════════════════════════════════════════════════════════

module CycleAllocator

using Dates

export SovereignCycleAllocator, CycleStatistics, AllocationRecord, GenerationEvent
export create_allocator, generate_cycles!, allocate_cycles!, release_cycles!
export burn_cycles!, decay_cycles!, auto_generate!, get_statistics
export fibonacci_at, fibonacci_ratio, adjust_generation_rate!, transfer_cycles!
export is_coherent, coherence_deficit, forecast_generation

# ── φ SUBSTRATE CONSTANTS ──────────────────────────────────────────────────────

"""The Golden Ratio - fundamental constant of sovereign mathematics"""
const PHI = 1.6180339887498948482

"""φ⁻¹ - The coherence gate, inverse of golden ratio"""
const PHI_INV = 0.6180339887498948482

"""φ⁻² - Decay rate for neglected cycles"""
const PHI_INV_SQ = 0.3819660112501051518

"""φ⁻⁴ - Glyph floor, minimum coherence threshold"""
const PHI_INV_4 = 0.2360679774997896

"""φ² - Squared golden ratio for enhanced operations"""
const PHI_SQ = 2.6180339887498948482

"""Coherence gate threshold - minimum for sovereign operations"""
const COHERENCE_GATE = PHI_INV

"""Decay rate per neglect period"""
const DECAY_RATE = PHI_INV_SQ

"""Heartbeat interval in milliseconds (Schumann resonance aligned)"""
const HEARTBEAT_MS = 873

# Fibonacci constants for history sizing
const F_8 = 21
const F_12 = 144
const F_13 = 233

# ── TYPE DEFINITIONS ───────────────────────────────────────────────────────────

"""Record of a cycle allocation event"""
struct AllocationRecord
    timestamp::DateTime
    amount::Float64
    purpose::String
    coherence_at::Float64
    released::Bool
end

"""Record of a cycle generation event"""
struct GenerationEvent
    timestamp::DateTime
    base_amount::Float64
    compound_amount::Float64
    work_bonus::Float64
    total_generated::Float64
    fib_state::Tuple{Int, Int}
    coherence::Float64
end

"""
    SovereignCycleAllocator

The main allocator for sovereign cycle management.
Implements φ-mathematics based self-funding mechanism.

# Fields
- `total_cycles`: Total available cycles
- `allocated_cycles`: Currently allocated cycles
- `generated_cycles`: Total ever generated
- `burned_cycles`: Cycles consumed/burned
- `generation_rate`: Base rate (starts at φ⁻¹)
- `compound_factor`: Current compound factor (→ φ)
- `coherence`: Current coherence level
- `fib_a`, `fib_b`: Fibonacci state F(n-1), F(n)
- `fib_generation`: Current Fibonacci generation n
- `last_generation`: Timestamp of last generation
- `last_allocation`: Timestamp of last allocation
- `operation_count`: Number of operations performed
- `allocation_history`: History of allocations
- `generation_history`: History of generations
"""
mutable struct SovereignCycleAllocator
    # Cycle balances
    total_cycles::Float64
    allocated_cycles::Float64
    generated_cycles::Float64
    burned_cycles::Float64
    
    # Generation parameters
    generation_rate::Float64
    compound_factor::Float64
    coherence::Float64
    
    # Fibonacci state
    fib_a::Int
    fib_b::Int
    fib_generation::Int
    
    # Tracking
    last_generation::DateTime
    last_allocation::DateTime
    operation_count::Int
    
    # History (circular buffers)
    allocation_history::Vector{AllocationRecord}
    generation_history::Vector{GenerationEvent}
end

"""Statistics about the cycle allocator state"""
struct CycleStatistics
    total_cycles::Float64
    allocated_cycles::Float64
    available_cycles::Float64
    generated_cycles::Float64
    burned_cycles::Float64
    compound_factor::Float64
    fib_generation::Int
    coherence::Float64
    operation_count::Int
    generation_rate::Float64
    efficiency_ratio::Float64
end

# ── CONSTRUCTOR ────────────────────────────────────────────────────────────────

"""
    create_allocator(initial_cycles::Float64) -> SovereignCycleAllocator

Create a new sovereign cycle allocator with initial cycles.

# Arguments
- `initial_cycles`: Starting cycle balance

# Returns
- Initialized `SovereignCycleAllocator`

# Example
```julia
allocator = create_allocator(1000.0)
```
"""
function create_allocator(initial_cycles::Float64)::SovereignCycleAllocator
    now = Dates.now()
    SovereignCycleAllocator(
        initial_cycles,    # total_cycles
        0.0,               # allocated_cycles
        initial_cycles,    # generated_cycles (initial counts as generated)
        0.0,               # burned_cycles
        PHI_INV,           # generation_rate
        1.0,               # compound_factor
        PHI_INV,           # coherence (start at equilibrium)
        1,                 # fib_a
        1,                 # fib_b
        2,                 # fib_generation
        now,               # last_generation
        now,               # last_allocation
        0,                 # operation_count
        AllocationRecord[],  # allocation_history
        GenerationEvent[]    # generation_history
    )
end

# ── FIBONACCI UTILITIES ────────────────────────────────────────────────────────

"""
    fibonacci_at(n::Int) -> Int

Calculate Fibonacci number at position n.
Uses iterative method for efficiency.
"""
function fibonacci_at(n::Int)::Int
    n <= 1 && return n
    
    a, b = 0, 1
    for _ in 2:n
        a, b = b, a + b
    end
    return b
end

"""
    fibonacci_ratio(n::Int) -> Float64

Calculate ratio F(n)/F(n-1) which approaches φ as n increases.
This is the fundamental property used in compound cycle generation.
"""
function fibonacci_ratio(n::Int)::Float64
    n <= 1 && return 1.0
    
    fn = fibonacci_at(n)
    fn1 = fibonacci_at(n - 1)
    
    return fn / fn1
end

# ── CORE OPERATIONS ────────────────────────────────────────────────────────────

"""
    generate_cycles!(allocator, current_coherence, work_units) -> Float64

Generate cycles through coherent mathematical operations.
This is the core sovereign funding mechanism.

# Formula
```
base = coherence² × φ × generation_rate
compound = base × (fib_b / fib_a)  [→ φ as generation increases]
work_bonus = work_units × φ⁻¹
total = compound + work_bonus
```

The compound factor (fib_b/fib_a) approaches φ asymptotically due to
the fundamental property of Fibonacci sequences:
    lim(n→∞) F(n)/F(n-1) = φ

This means organisms naturally become more productive over time,
approaching the golden ratio efficiency.

# Arguments
- `allocator`: The cycle allocator
- `current_coherence`: Current system coherence (0.0 - 1.0)
- `work_units`: Amount of useful work performed

# Returns
- Total cycles generated
"""
function generate_cycles!(
    allocator::SovereignCycleAllocator,
    current_coherence::Float64,
    work_units::Float64
)::Float64
    # Update coherence state
    allocator.coherence = current_coherence
    
    # Advance Fibonacci state
    new_fib = allocator.fib_a + allocator.fib_b
    allocator.fib_a = allocator.fib_b
    allocator.fib_b = new_fib
    allocator.fib_generation += 1
    
    # Calculate compound factor (approaches φ as Fibonacci advances)
    allocator.compound_factor = allocator.fib_b / allocator.fib_a
    
    # Base generation from coherence (quadratic relationship)
    base = current_coherence^2 * PHI * allocator.generation_rate
    
    # Compound with Fibonacci ratio
    compound = base * allocator.compound_factor
    
    # Work bonus — doing useful work generates cycles
    work_bonus = work_units * PHI_INV
    
    # Total generated this cycle
    total = compound + work_bonus
    
    # Update balances
    allocator.generated_cycles += total
    allocator.total_cycles += total
    allocator.operation_count += 1
    allocator.last_generation = Dates.now()
    
    # Record generation event
    event = GenerationEvent(
        Dates.now(),
        base,
        compound,
        work_bonus,
        total,
        (allocator.fib_a, allocator.fib_b),
        current_coherence
    )
    
    push!(allocator.generation_history, event)
    
    # Prune history if too long
    if length(allocator.generation_history) > F_13
        popfirst!(allocator.generation_history)
    end
    
    return total
end

"""
    allocate_cycles!(allocator, required, purpose) -> Tuple{Float64, Float64}

Allocate cycles for a specific purpose.

# Arguments
- `allocator`: The cycle allocator
- `required`: Number of cycles needed
- `purpose`: Description of allocation purpose

# Returns
- Tuple of (allocated_amount, remaining_available)
"""
function allocate_cycles!(
    allocator::SovereignCycleAllocator,
    required::Float64,
    purpose::String
)::Tuple{Float64, Float64}
    available = allocator.total_cycles - allocator.allocated_cycles
    
    # Allocate what's available, up to required
    allocated = min(available, required)
    
    if allocated > 0.0
        allocator.allocated_cycles += allocated
        allocator.last_allocation = Dates.now()
        
        # Record allocation
        record = AllocationRecord(
            Dates.now(),
            allocated,
            purpose,
            allocator.coherence,
            false
        )
        
        push!(allocator.allocation_history, record)
        
        # Prune history
        if length(allocator.allocation_history) > F_13
            popfirst!(allocator.allocation_history)
        end
    end
    
    remaining = allocator.total_cycles - allocator.allocated_cycles
    return (allocated, remaining)
end

"""
    release_cycles!(allocator, amount)

Release allocated cycles back to the pool.
"""
function release_cycles!(allocator::SovereignCycleAllocator, amount::Float64)
    allocator.allocated_cycles = max(0.0, allocator.allocated_cycles - amount)
end

"""
    burn_cycles!(allocator, amount) -> Bool

Consume cycles permanently (removed from circulation).
Returns true if successful, false if insufficient funds.
"""
function burn_cycles!(allocator::SovereignCycleAllocator, amount::Float64)::Bool
    available = allocator.total_cycles - allocator.allocated_cycles
    
    if available >= amount
        allocator.total_cycles -= amount
        allocator.burned_cycles += amount
        return true
    else
        return false
    end
end

"""
    decay_cycles!(allocator, neglect_periods) -> Float64

Apply decay to unused cycles (incentivizes active use).
Decay rate = φ⁻² per neglect period.

# Arguments
- `allocator`: The cycle allocator
- `neglect_periods`: Number of periods of neglect

# Returns
- Amount of cycles decayed
"""
function decay_cycles!(
    allocator::SovereignCycleAllocator,
    neglect_periods::Int
)::Float64
    neglect_periods == 0 && return 0.0
    
    # Decay factor = (φ⁻²)^n
    decay_factor = PHI_INV_SQ^neglect_periods
    
    # Calculate decay amount from unallocated cycles
    unallocated = allocator.total_cycles - allocator.allocated_cycles
    decay_amount = unallocated * (1.0 - decay_factor)
    
    # Apply decay
    allocator.total_cycles -= decay_amount
    
    return decay_amount
end

"""
    auto_generate!(allocator, min_balance) -> Float64

Automatically generate cycles if balance is low.
Returns the amount generated.
"""
function auto_generate!(
    allocator::SovereignCycleAllocator,
    min_balance::Float64
)::Float64
    available = allocator.total_cycles - allocator.allocated_cycles
    
    if available < min_balance
        # Generate enough to reach min balance plus buffer
        deficit = min_balance - available
        work_needed = deficit / PHI_INV  # Reverse work bonus calculation
        
        # Generate with current coherence
        return generate_cycles!(allocator, allocator.coherence, work_needed)
    else
        return 0.0
    end
end

# ── STATISTICS & QUERIES ───────────────────────────────────────────────────────

"""
    get_statistics(allocator) -> CycleStatistics

Get current statistics about the allocator state.
"""
function get_statistics(allocator::SovereignCycleAllocator)::CycleStatistics
    available = allocator.total_cycles - allocator.allocated_cycles
    
    efficiency = if allocator.burned_cycles > 0.0
        allocator.generated_cycles / allocator.burned_cycles
    else
        allocator.generated_cycles  # Infinite efficiency if nothing burned
    end
    
    CycleStatistics(
        allocator.total_cycles,
        allocator.allocated_cycles,
        available,
        allocator.generated_cycles,
        allocator.burned_cycles,
        allocator.compound_factor,
        allocator.fib_generation,
        allocator.coherence,
        allocator.operation_count,
        allocator.generation_rate,
        efficiency
    )
end

"""
    is_coherent(allocator) -> Bool

Check if coherence is above the gate threshold (φ⁻¹).
"""
is_coherent(allocator::SovereignCycleAllocator)::Bool = 
    allocator.coherence >= COHERENCE_GATE

"""
    coherence_deficit(allocator) -> Float64

Get coherence deficit (how much below gate).
Returns 0.0 if above gate.
"""
function coherence_deficit(allocator::SovereignCycleAllocator)::Float64
    if allocator.coherence >= COHERENCE_GATE
        return 0.0
    else
        return COHERENCE_GATE - allocator.coherence
    end
end

# ── RATE ADJUSTMENT ────────────────────────────────────────────────────────────

"""
    adjust_generation_rate!(allocator, avg_coherence)

Adjust generation rate based on sustained coherence.

# Formula
```
Rate = φ⁻¹ × (1 + (coherence - φ⁻¹) × φ)
```

At coherence = φ⁻¹: rate = φ⁻¹
At coherence = 1.0: rate ≈ 1.0
"""
function adjust_generation_rate!(
    allocator::SovereignCycleAllocator,
    avg_coherence::Float64
)
    adjustment = (avg_coherence - PHI_INV) * PHI
    new_rate = PHI_INV * (1.0 + adjustment)
    
    # Clamp to reasonable range [φ⁻², 1.0]
    allocator.generation_rate = clamp(new_rate, PHI_INV_SQ, 1.0)
end

# ── INTER-ORGANISM COMMERCE ────────────────────────────────────────────────────

"""
    transfer_cycles!(source, destination, amount) -> Bool

Transfer cycles between allocators (for inter-organism commerce).
Applies a φ-tax where recipient gets φ⁻¹ (61.8%) and the tax
becomes newly generated cycles.

# Arguments
- `source`: Source allocator
- `destination`: Destination allocator
- `amount`: Amount to transfer

# Returns
- `true` if transfer successful, `false` if insufficient funds
"""
function transfer_cycles!(
    source::SovereignCycleAllocator,
    destination::SovereignCycleAllocator,
    amount::Float64
)::Bool
    available = source.total_cycles - source.allocated_cycles
    
    if available >= amount
        # Deduct from source
        source.total_cycles -= amount
        
        # Apply φ-tax (38.2% tax, 61.8% to recipient)
        tax_rate = 1.0 - PHI_INV
        taxed_amount = amount * PHI_INV
        tax = amount * tax_rate
        
        # Credit destination
        destination.total_cycles += taxed_amount
        destination.generated_cycles += tax  # Tax becomes generated
        
        return true
    else
        return false
    end
end

# ── FORECASTING ────────────────────────────────────────────────────────────────

"""
    forecast_generation(allocator, operations, assumed_coherence, assumed_work_per_op) -> Float64

Forecast cycles to be generated over n operations.

# Arguments
- `allocator`: The cycle allocator
- `operations`: Number of future operations
- `assumed_coherence`: Assumed coherence level
- `assumed_work_per_op`: Assumed work units per operation

# Returns
- Forecasted total cycles to be generated
"""
function forecast_generation(
    allocator::SovereignCycleAllocator,
    operations::Int,
    assumed_coherence::Float64,
    assumed_work_per_op::Float64
)::Float64
    total = 0.0
    fib_a = allocator.fib_a
    fib_b = allocator.fib_b
    
    for _ in 1:operations
        # Advance Fibonacci
        fib_a, fib_b = fib_b, fib_a + fib_b
        
        compound = fib_b / fib_a
        base = assumed_coherence^2 * PHI * allocator.generation_rate
        per_op = base * compound + assumed_work_per_op * PHI_INV
        
        total += per_op
    end
    
    return total
end

# ── DISPLAY METHODS ────────────────────────────────────────────────────────────

function Base.show(io::IO, stats::CycleStatistics)
    println(io, "╔══════════════════════════════════════════════════════════════╗")
    println(io, "║           SOVEREIGN CYCLE ALLOCATOR STATISTICS               ║")
    println(io, "╠══════════════════════════════════════════════════════════════╣")
    println(io, "║ Total Cycles:      $(lpad(round(stats.total_cycles, digits=4), 12))                 ║")
    println(io, "║ Allocated:         $(lpad(round(stats.allocated_cycles, digits=4), 12))                 ║")
    println(io, "║ Available:         $(lpad(round(stats.available_cycles, digits=4), 12))                 ║")
    println(io, "║ Generated (Total): $(lpad(round(stats.generated_cycles, digits=4), 12))                 ║")
    println(io, "║ Burned:            $(lpad(round(stats.burned_cycles, digits=4), 12))                 ║")
    println(io, "╠══════════════════════════════════════════════════════════════╣")
    println(io, "║ Coherence:         $(lpad(round(stats.coherence, digits=6), 12))                 ║")
    println(io, "║ Compound Factor:   $(lpad(round(stats.compound_factor, digits=6), 12)) → φ           ║")
    println(io, "║ Generation Rate:   $(lpad(round(stats.generation_rate, digits=6), 12))                 ║")
    println(io, "║ Fib Generation:    $(lpad(stats.fib_generation, 12))                 ║")
    println(io, "║ Operations:        $(lpad(stats.operation_count, 12))                 ║")
    println(io, "║ Efficiency Ratio:  $(lpad(round(stats.efficiency_ratio, digits=4), 12))                 ║")
    println(io, "╚══════════════════════════════════════════════════════════════╝")
end

function Base.show(io::IO, allocator::SovereignCycleAllocator)
    stats = get_statistics(allocator)
    show(io, stats)
end

end # module
