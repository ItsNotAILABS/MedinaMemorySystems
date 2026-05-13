# ════════════════════════════════════════════════════════════════════════════════
# CATEGORY THEORY ENGINE — Compositional Semantics for Sovereign Intelligence
# ════════════════════════════════════════════════════════════════════════════════
#
# Category theory provides the ultimate abstraction language:
# - Objects and morphisms as primitives
# - Functors as structure-preserving maps
# - Natural transformations as morphisms between functors
# - Monads for computational effects
# - Adjunctions as universal constructions
#
# φ-Integration: Enriched categories over φ-harmonic structures
#
# Archetypes: ENGINE, CATEGORICAL, COMPOSITIONAL, UNIVERSAL
# Author: MEDINA Sovereign Intelligence Architecture
# ════════════════════════════════════════════════════════════════════════════════

module CategoryTheoryEngine

using LinearAlgebra

export Category, Functor, NaturalTransformation, Monad, Adjunction
export create_category, compose, identity_morphism
export create_functor, functor_map, vertical_compose, horizontal_compose
export create_monad, monad_unit, monad_multiply, kleisli_compose
export create_adjunction, adjunction_unit, adjunction_counit
export yoneda_embedding, yoneda_lemma, limit, colimit
export terminal_object, initial_object, product, coproduct
export pullback, pushout, equalizer, coequalizer
export φ_enriched_category, φ_functor, sovereign_monad

# ── φ SUBSTRATE CONSTANTS ──────────────────────────────────────────────────────

const φ = 1.6180339887498948482
const φ_INV = 0.6180339887498948482
const PHI = φ

# ── CORE TYPE DEFINITIONS ──────────────────────────────────────────────────────

"""
    Morphism{T}

A morphism in a category, represented by domain, codomain, and data.
"""
struct Morphism{T}
    name::String
    domain::String
    codomain::String
    data::T
end

"""
    Category{T}

A category with objects, morphisms, and composition.
"""
mutable struct Category{T}
    name::String
    objects::Vector{String}
    morphisms::Dict{String, Morphism{T}}
    composition_table::Dict{Tuple{String, String}, String}
    identity_morphisms::Dict{String, String}
    
    # Optional: Enrichment
    hom_enrichment::Union{Nothing, Dict{Tuple{String, String}, T}}
end

"""
    Functor{S, T}

A functor F: C → D between categories.
"""
struct Functor{S, T}
    name::String
    source::Category{S}
    target::Category{T}
    object_map::Dict{String, String}
    morphism_map::Dict{String, String}
end

"""
    NaturalTransformation{S, T}

A natural transformation η: F ⇒ G between functors.
"""
struct NaturalTransformation{S, T}
    name::String
    source_functor::Functor{S, T}
    target_functor::Functor{S, T}
    components::Dict{String, String}  # For each object A, η_A: F(A) → G(A)
end

"""
    Monad{T}

A monad (T, η, μ) on a category C.
"""
struct Monad{T}
    name::String
    category::Category{T}
    endofunctor::Functor{T, T}
    unit::NaturalTransformation{T, T}      # η: Id ⇒ T
    multiply::NaturalTransformation{T, T}  # μ: T² ⇒ T
end

"""
    Adjunction{S, T}

An adjunction F ⊣ G between categories C and D.
"""
struct Adjunction{S, T}
    left_adjoint::Functor{S, T}   # F: C → D
    right_adjoint::Functor{T, S}  # G: D → C
    unit::NaturalTransformation{S, S}     # η: Id_C ⇒ GF
    counit::NaturalTransformation{T, T}   # ε: FG ⇒ Id_D
end

# ── CATEGORY CONSTRUCTORS ──────────────────────────────────────────────────────

"""
    create_category(name, objects, morphisms)

Create a category from objects and morphisms with composition.
"""
function create_category(
    name::String,
    objects::Vector{String},
    morphisms::Vector{Morphism{T}};
    composition_table::Dict{Tuple{String, String}, String} = Dict(),
    hom_enrichment::Union{Nothing, Dict{Tuple{String, String}, T}} = nothing
) where T
    
    morph_dict = Dict(m.name => m for m in morphisms)
    
    # Generate identity morphisms
    identities = Dict(obj => "id_$obj" for obj in objects)
    for obj in objects
        id_name = identities[obj]
        if !haskey(morph_dict, id_name)
            morph_dict[id_name] = Morphism{T}(id_name, obj, obj, one(T))
        end
    end
    
    # Add identity compositions if not present
    for obj in objects
        id_name = identities[obj]
        for (name, m) in morph_dict
            if m.domain == obj
                composition_table[(id_name, name)] = name
            end
            if m.codomain == obj
                composition_table[(name, id_name)] = name
            end
        end
    end
    
    Category{T}(name, objects, morph_dict, composition_table, identities, hom_enrichment)
end

"""
    create_discrete_category(objects)

Create a discrete category (only identity morphisms).
"""
function create_discrete_category(objects::Vector{String})
    morphisms = Morphism{Float64}[]
    create_category("Discrete", objects, morphisms)
end

"""
    create_monoid_category(monoid_elements, operation)

Create a single-object category from a monoid.
"""
function create_monoid_category(elements::Vector{String}, op::Function)
    objects = ["*"]
    morphisms = [Morphism{String}(e, "*", "*", e) for e in elements]
    
    composition_table = Dict{Tuple{String, String}, String}()
    for e1 in elements, e2 in elements
        composition_table[(e1, e2)] = op(e1, e2)
    end
    
    create_category("Monoid", objects, morphisms; composition_table = composition_table)
end

# ── CATEGORICAL OPERATIONS ─────────────────────────────────────────────────────

"""
    compose(C, f, g)

Compose morphisms: f ; g (f then g) = g ∘ f.
"""
function compose(C::Category{T}, f::String, g::String) where T
    f_morph = C.morphisms[f]
    g_morph = C.morphisms[g]
    
    @assert f_morph.codomain == g_morph.domain "Morphisms not composable: $f, $g"
    
    if haskey(C.composition_table, (f, g))
        return C.composition_table[(f, g)]
    end
    
    # Default: create composite name
    "($f ; $g)"
end

"""
    identity_morphism(C, obj)

Get the identity morphism on an object.
"""
function identity_morphism(C::Category, obj::String)
    C.identity_morphisms[obj]
end

"""
    hom_set(C, A, B)

Get the set of morphisms from A to B.
"""
function hom_set(C::Category, A::String, B::String)
    [name for (name, m) in C.morphisms if m.domain == A && m.codomain == B]
end

# ── FUNCTOR OPERATIONS ─────────────────────────────────────────────────────────

"""
    create_functor(name, source, target, obj_map, morph_map)

Create a functor between categories.
"""
function create_functor(
    name::String,
    source::Category{S},
    target::Category{T},
    obj_map::Dict{String, String},
    morph_map::Dict{String, String}
) where {S, T}
    
    # Verify functor preserves identities
    for (obj, id) in source.identity_morphisms
        target_obj = obj_map[obj]
        target_id = target.identity_morphisms[target_obj]
        @assert morph_map[id] == target_id "Functor must preserve identities"
    end
    
    Functor{S, T}(name, source, target, obj_map, morph_map)
end

"""
    functor_map(F, x)

Apply functor to an object or morphism.
"""
function functor_map(F::Functor, x::String)
    if haskey(F.object_map, x)
        return F.object_map[x]
    elseif haskey(F.morphism_map, x)
        return F.morphism_map[x]
    else
        error("$x not found in functor domain")
    end
end

"""
    compose_functors(F, G)

Compose functors: G ∘ F.
"""
function compose_functors(F::Functor{S, T}, G::Functor{T, U}) where {S, T, U}
    @assert F.target.name == G.source.name "Functors not composable"
    
    new_obj_map = Dict(k => G.object_map[v] for (k, v) in F.object_map)
    new_morph_map = Dict(k => G.morphism_map[v] for (k, v) in F.morphism_map)
    
    Functor{S, U}("$(G.name)∘$(F.name)", F.source, G.target, new_obj_map, new_morph_map)
end

# ── NATURAL TRANSFORMATIONS ────────────────────────────────────────────────────

"""
    create_natural_transformation(name, F, G, components)

Create a natural transformation η: F ⇒ G.
"""
function create_natural_transformation(
    name::String,
    F::Functor{S, T},
    G::Functor{S, T},
    components::Dict{String, String}
) where {S, T}
    
    # Verify naturality: for f: A → B, G(f) ∘ η_A = η_B ∘ F(f)
    # (This would require computing compositions)
    
    NaturalTransformation{S, T}(name, F, G, components)
end

"""
    vertical_compose(η, θ)

Vertical composition: θ ∘ η where η: F ⇒ G and θ: G ⇒ H.
"""
function vertical_compose(
    η::NaturalTransformation{S, T},
    θ::NaturalTransformation{S, T}
) where {S, T}
    
    @assert η.target_functor.name == θ.source_functor.name "Not composable"
    
    # For each object A, (θ ∘ η)_A = θ_A ∘ η_A
    new_components = Dict{String, String}()
    C = η.source_functor.target
    
    for obj in η.source_functor.source.objects
        η_A = η.components[obj]
        θ_A = θ.components[obj]
        new_components[obj] = compose(C, η_A, θ_A)
    end
    
    NaturalTransformation{S, T}(
        "$(θ.name)∘$(η.name)",
        η.source_functor,
        θ.target_functor,
        new_components
    )
end

"""
    horizontal_compose(η, θ)

Horizontal composition: θ * η where η: F ⇒ G and θ: H ⇒ K.
"""
function horizontal_compose(
    η::NaturalTransformation{S, T},
    θ::NaturalTransformation{T, U}
) where {S, T, U}
    
    # (θ * η)_A = θ_{G(A)} ∘ H(η_A) = K(η_A) ∘ θ_{F(A)}
    
    new_components = Dict{String, String}()
    
    for obj in η.source_functor.source.objects
        F_A = functor_map(η.source_functor, obj)
        G_A = functor_map(η.target_functor, obj)
        
        θ_GA = θ.components[G_A]
        H_ηA = functor_map(θ.source_functor, η.components[obj])
        
        new_components[obj] = compose(θ.source_functor.target, H_ηA, θ_GA)
    end
    
    # Composite functor
    HF = compose_functors(η.source_functor, θ.source_functor)
    KG = compose_functors(η.target_functor, θ.target_functor)
    
    NaturalTransformation{S, U}("$(θ.name)*$(η.name)", HF, KG, new_components)
end

# ── MONADS ─────────────────────────────────────────────────────────────────────

"""
    create_monad(name, C, T, η, μ)

Create a monad on category C.
"""
function create_monad(
    name::String,
    C::Category{T_type},
    T_functor::Functor{T_type, T_type},
    unit::NaturalTransformation{T_type, T_type},
    multiply::NaturalTransformation{T_type, T_type}
) where T_type
    
    # Verify monad laws:
    # μ ∘ Tμ = μ ∘ μT (associativity)
    # μ ∘ Tη = μ ∘ ηT = id_T (unit laws)
    
    Monad{T_type}(name, C, T_functor, unit, multiply)
end

"""
    monad_unit(M, A)

Get the unit η_A: A → T(A).
"""
function monad_unit(M::Monad, A::String)
    M.unit.components[A]
end

"""
    monad_multiply(M, A)

Get the multiplication μ_A: T(T(A)) → T(A).
"""
function monad_multiply(M::Monad, A::String)
    M.multiply.components[A]
end

"""
    kleisli_compose(M, f, g)

Kleisli composition: f >=> g for f: A → T(B), g: B → T(C).
"""
function kleisli_compose(M::Monad, f::String, g::String)
    # f >=> g = μ_C ∘ T(g) ∘ f
    # This requires knowing the types of f and g
    "($(f) >=> $(g))"
end

# ── ADJUNCTIONS ────────────────────────────────────────────────────────────────

"""
    create_adjunction(F, G, η, ε)

Create an adjunction F ⊣ G with unit η and counit ε.
"""
function create_adjunction(
    F::Functor{S, T},
    G::Functor{T, S},
    η::NaturalTransformation{S, S},
    ε::NaturalTransformation{T, T}
) where {S, T}
    
    # Verify triangle identities:
    # (εF) ∘ (Fη) = id_F
    # (Gε) ∘ (ηG) = id_G
    
    Adjunction{S, T}(F, G, η, ε)
end

"""
    adjunction_unit(adj, A)

Get the unit η_A: A → G(F(A)).
"""
function adjunction_unit(adj::Adjunction, A::String)
    adj.unit.components[A]
end

"""
    adjunction_counit(adj, X)

Get the counit ε_X: F(G(X)) → X.
"""
function adjunction_counit(adj::Adjunction, X::String)
    adj.counit.components[X]
end

# ── LIMITS AND COLIMITS ────────────────────────────────────────────────────────

"""
    terminal_object(C)

Find or construct the terminal object (if exists).
"""
function terminal_object(C::Category)
    # Terminal object 1: for every A, exists unique f: A → 1
    for obj in C.objects
        is_terminal = true
        for other in C.objects
            morphisms_to_obj = hom_set(C, other, obj)
            if length(morphisms_to_obj) != 1
                is_terminal = false
                break
            end
        end
        if is_terminal
            return obj
        end
    end
    nothing
end

"""
    initial_object(C)

Find or construct the initial object (if exists).
"""
function initial_object(C::Category)
    # Initial object 0: for every A, exists unique f: 0 → A
    for obj in C.objects
        is_initial = true
        for other in C.objects
            morphisms_from_obj = hom_set(C, obj, other)
            if length(morphisms_from_obj) != 1
                is_initial = false
                break
            end
        end
        if is_initial
            return obj
        end
    end
    nothing
end

"""
    product(C, A, B)

Construct the product A × B (if exists).
"""
function product(C::Category, A::String, B::String)
    # Product: object P with projections π₁: P → A, π₂: P → B
    # Universal: for any Q with f: Q → A, g: Q → B, exists unique ⟨f,g⟩: Q → P
    
    product_name = "$(A)×$(B)"
    
    (object = product_name, π₁ = "π₁_$product_name", π₂ = "π₂_$product_name")
end

"""
    coproduct(C, A, B)

Construct the coproduct A + B (if exists).
"""
function coproduct(C::Category, A::String, B::String)
    # Coproduct: object S with injections ι₁: A → S, ι₂: B → S
    # Universal: for any Q with f: A → Q, g: B → Q, exists unique [f,g]: S → Q
    
    coproduct_name = "$(A)+$(B)"
    
    (object = coproduct_name, ι₁ = "ι₁_$coproduct_name", ι₂ = "ι₂_$coproduct_name")
end

"""
    pullback(C, f, g)

Construct the pullback of f: A → C and g: B → C.
"""
function pullback(C::Category, f::String, g::String)
    f_morph = C.morphisms[f]
    g_morph = C.morphisms[g]
    
    @assert f_morph.codomain == g_morph.codomain "Morphisms must have same codomain"
    
    pb_name = "$(f_morph.domain)×_{$(f_morph.codomain)}$(g_morph.domain)"
    
    (object = pb_name, p₁ = "p₁_$pb_name", p₂ = "p₂_$pb_name")
end

"""
    pushout(C, f, g)

Construct the pushout of f: C → A and g: C → B.
"""
function pushout(C::Category, f::String, g::String)
    f_morph = C.morphisms[f]
    g_morph = C.morphisms[g]
    
    @assert f_morph.domain == g_morph.domain "Morphisms must have same domain"
    
    po_name = "$(f_morph.codomain)+_{$(f_morph.domain)}$(g_morph.codomain)"
    
    (object = po_name, i₁ = "i₁_$po_name", i₂ = "i₂_$po_name")
end

# ── YONEDA LEMMA ───────────────────────────────────────────────────────────────

"""
    yoneda_embedding(C, A)

The Yoneda embedding y: C → Set^{C^op}.
y(A) = Hom(-, A).
"""
function yoneda_embedding(C::Category, A::String)
    # Returns the representable functor Hom(-, A)
    
    obj_map = Dict{String, Vector{String}}()
    for B in C.objects
        obj_map[B] = hom_set(C, B, A)
    end
    
    (representable_functor = "Hom(-,$A)", object_mapping = obj_map)
end

"""
    yoneda_lemma(C, A, F)

Yoneda Lemma: Nat(Hom(-,A), F) ≅ F(A).
Returns the bijection.
"""
function yoneda_lemma(C::Category, A::String, F_on_A)
    # Natural transformations Hom(-, A) ⇒ F are in bijection with elements of F(A)
    # η ↦ η_A(id_A)
    # x ↦ (η_B(f) = F(f)(x) for f: B → A)
    
    (isomorphism = true, element = F_on_A, id_morphism = identity_morphism(C, A))
end

# ── φ-ENRICHED CATEGORIES ──────────────────────────────────────────────────────

"""
    φ_enriched_category(C)

Create a φ-enriched version of category C.
Hom-objects have φ-harmonic structure.
"""
function φ_enriched_category(C::Category{T}) where T
    n = length(C.objects)
    
    # Create φ-weighted hom enrichment
    enrichment = Dict{Tuple{String, String}, T}()
    
    for (i, A) in enumerate(C.objects)
        for (j, B) in enumerate(C.objects)
            # φ-weight based on "distance" in category
            weight = φ^(abs(i - j) / n)
            enrichment[(A, B)] = T(weight)
        end
    end
    
    Category{T}(
        "φ-$(C.name)",
        C.objects,
        C.morphisms,
        C.composition_table,
        C.identity_morphisms,
        enrichment
    )
end

"""
    φ_functor(F)

Create φ-enriched version of functor.
"""
function φ_functor(F::Functor{S, T}) where {S, T}
    # Scale morphism mappings by φ-weights
    
    new_morph_map = Dict{String, String}()
    for (k, v) in F.morphism_map
        # Add φ-annotation
        new_morph_map[k] = "φ($(v))"
    end
    
    Functor{S, T}(
        "φ-$(F.name)",
        F.source,
        F.target,
        F.object_map,
        new_morph_map
    )
end

"""
    sovereign_monad()

The Sovereign Monad: computational effects for sovereign intelligence.
Encapsulates: state, non-determinism, coherence tracking.
"""
function sovereign_monad(C::Category{T}) where T
    # T(A) = Coherence × (State → (A × State × [Log]))
    
    # Create endofunctor
    T_obj_map = Dict(obj => "Sovereign($obj)" for obj in C.objects)
    T_morph_map = Dict(m => "Sovereign($m)" for m in keys(C.morphisms))
    
    T_functor = Functor{T, T}(
        "Sovereign",
        C, C,
        T_obj_map,
        T_morph_map
    )
    
    # Unit η_A: A → T(A)
    # Pure computation with full coherence
    η_components = Dict(obj => "pure_$obj" for obj in C.objects)
    
    # For unit, we need identity functor
    Id_obj_map = Dict(obj => obj for obj in C.objects)
    Id_morph_map = Dict(m => m for m in keys(C.morphisms))
    Id_functor = Functor{T, T}("Id", C, C, Id_obj_map, Id_morph_map)
    
    η = NaturalTransformation{T, T}("η", Id_functor, T_functor, η_components)
    
    # Multiplication μ_A: T(T(A)) → T(A)
    # Composition with coherence multiplication
    T2_obj_map = Dict(obj => "Sovereign(Sovereign($obj))" for obj in C.objects)
    T2_morph_map = Dict(m => "Sovereign(Sovereign($m))" for m in keys(C.morphisms))
    T2_functor = Functor{T, T}("T²", C, C, T2_obj_map, T2_morph_map)
    
    μ_components = Dict(obj => "join_$obj" for obj in C.objects)
    μ = NaturalTransformation{T, T}("μ", T2_functor, T_functor, μ_components)
    
    Monad{T}("Sovereign", C, T_functor, η, μ)
end

# ── 2-CATEGORIES ───────────────────────────────────────────────────────────────

"""
    TwoCategory{T}

A 2-category with 0-cells, 1-cells (morphisms), and 2-cells (morphisms between morphisms).
"""
struct TwoCategory{T}
    name::String
    zero_cells::Vector{String}
    one_cells::Dict{Tuple{String, String}, Vector{String}}
    two_cells::Dict{Tuple{String, String}, Vector{String}}
    vertical_composition::Dict{Tuple{String, String}, String}
    horizontal_composition::Dict{Tuple{String, String}, String}
end

"""
    create_2category(name, zero_cells)

Create a 2-category.
"""
function create_2category(name::String, zero_cells::Vector{String})
    TwoCategory{Float64}(
        name,
        zero_cells,
        Dict{Tuple{String, String}, Vector{String}}(),
        Dict{Tuple{String, String}, Vector{String}}(),
        Dict{Tuple{String, String}, String}(),
        Dict{Tuple{String, String}, String}()
    )
end

end # module
