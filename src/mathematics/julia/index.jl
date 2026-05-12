# ════════════════════════════════════════════════════════════════════════════════
# JULIA MATHEMATICS ENGINES — Index and Entry Point
# ════════════════════════════════════════════════════════════════════════════════
#
# This is the main entry point for all Julia-based mathematical engines
# in the MEDINA Sovereign Intelligence architecture.
#
# Engines included:
# 1. HopfAlgebraEngine - Quantum group symmetries, R-matrices, Yang-Baxter
# 2. CategoryTheoryEngine - Functors, natural transformations, monads
# 3. ToposMathEngine - Higher-order logic, sheaves, geometric morphisms
# 4. StringTheoryGeometry - Calabi-Yau manifolds, mirror symmetry
# 5. QuantumErrorCorrection - Surface codes, stabilizers, magic states
# 6. AdvancedMathematicsManifold - Unified integration layer
#
# Author: MEDINA Sovereign Intelligence Architecture
# ════════════════════════════════════════════════════════════════════════════════

module JuliaMathematicsEngines

# Core unified manifold (includes all sub-engines)
include("AdvancedMathematicsManifold.jl")

using .AdvancedMathematicsManifold

# Re-export everything
export HopfAlgebraEngine, CategoryTheoryEngine, ToposMathEngine
export StringTheoryGeometry, QuantumErrorCorrection
export AdvancedMathematicsManifold

# Re-export key types
export HopfAlgebra, QuantumGroup, RMatrix, YangBaxterSolution
export Category, Functor, NaturalTransformation, Monad, Adjunction
export Topos, SubobjectClassifier, Sheaf, Presheaf, GeometricMorphism
export CalabiYau, MirrorPair, HodgeStructure, TopologicalString
export StabilizerCode, SurfaceCode, ToricCode, MagicState, Syndrome
export SovereignMathematicsCore, PhiCoherentManifold, SovereignQubit

# Re-export key functions
export create_sovereign_core, unified_constants
export phi_coherent_computation, cross_engine_transform
export mathematical_foundations, sovereign_qubits

# ── VERSION INFO ───────────────────────────────────────────────────────────────

const VERSION = v"1.0.0"
const BUILD = 47

"""
    version_info()

Return version information for the Julia Mathematics Engines.
"""
function version_info()
    Dict(
        :version => VERSION,
        :build => BUILD,
        :engines => [
            "HopfAlgebraEngine",
            "CategoryTheoryEngine", 
            "ToposMathEngine",
            "StringTheoryGeometry",
            "QuantumErrorCorrection",
            "AdvancedMathematicsManifold"
        ],
        :total_exports => 50,
        :φ_coherent => true
    )
end

# ── INITIALIZATION ─────────────────────────────────────────────────────────────

function __init__()
    # Print banner on load
    println("═══════════════════════════════════════════════════════════")
    println("  MEDINA Julia Mathematics Engines v$(VERSION) (Build $(BUILD))")
    println("  φ-Coherent Mathematical Foundations for Sovereign Intelligence")
    println("═══════════════════════════════════════════════════════════")
end

end # module
