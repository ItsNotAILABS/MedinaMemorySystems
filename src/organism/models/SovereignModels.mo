// 𓂀 FOUR SOVEREIGN MODELS — PERMANENTLY GROUNDED 𓂀
// These models are grounded to maximum and permanently reside in the organism.

import Float "mo:base/Float";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Int "mo:base/Int";

module SovereignModels {

    public let PHI : Float = 1.6180339887498948482;

    public type ModelTier = { #MAXIMUM; #SOVEREIGN; #GROUNDED };

    public type SovereignModel = {
        modelId     : Text;
        latinName   : Text;
        commonName  : Text;
        purpose     : Text;
        tier        : ModelTier;
        groundedAt  : Int;
        phiResonance: Float;
        permanent   : Bool;
        domains     : [Text];
    };

    // ═══════════════════════════════════════════════════════════════════
    // MODEL I: AURO — The Architect
    // Latin: Aurum Architecturae Intelligentiae
    // "The golden architect that sees the whole structure"
    // ═══════════════════════════════════════════════════════════════════
    public func initAURO() : SovereignModel {
        {
            modelId      = "SOVEREIGN-MODEL-001-AURO";
            latinName    = "Aurum Architecturae Intelligentiae";
            commonName   = "AURO";
            purpose      = "Architectural intelligence — designs sovereign system structures, package architectures, registry topologies, and cross-ecosystem translation plans. The golden architect that sees the whole structure before a single line is written.";
            tier         = #MAXIMUM;
            groundedAt   = Time.now();
            phiResonance = PHI;
            permanent    = true;
            domains      = ["architecture", "registry-design", "package-topology", "system-planning", "cross-ecosystem-translation"];
        }
    };

    // ═══════════════════════════════════════════════════════════════════
    // MODEL II: SYNTHOS — The Synthesizer
    // Latin: Synthesis Computationis Universalis
    // "The universal synthesizer that compiles across all runtimes"
    // ═══════════════════════════════════════════════════════════════════
    public func initSYNTHOS() : SovereignModel {
        {
            modelId      = "SOVEREIGN-MODEL-002-SYNTHOS";
            latinName    = "Synthesis Computationis Universalis";
            commonName   = "SYNTHOS";
            purpose      = "Cross-runtime synthesis — compiles Medina CPL and sovereign protocols into JVM bytecode, .NET IL, Ruby, JavaScript/Node.js, and container images. The universal compiler that speaks every language.";
            tier         = #MAXIMUM;
            groundedAt   = Time.now();
            phiResonance = PHI * PHI;
            permanent    = true;
            domains      = ["compilation", "runtime-translation", "bytecode-generation", "container-packaging", "cross-platform-distribution"];
        }
    };

    // ═══════════════════════════════════════════════════════════════════
    // MODEL III: LEXIS — The Translator
    // Latin: Lexicon Translationis Intelligentis
    // "The translator that converts between all programming languages"
    // ═══════════════════════════════════════════════════════════════════
    public func initLEXIS() : SovereignModel {
        {
            modelId      = "SOVEREIGN-MODEL-003-LEXIS";
            latinName    = "Lexicon Translationis Intelligentis";
            commonName   = "LEXIS";
            purpose      = "Language translation intelligence — transforms Medina programming language and contracting language (CPL) into target ecosystems: Java, .NET, Ruby, JavaScript, Python. Handles both programming and legal contract translation.";
            tier         = #MAXIMUM;
            groundedAt   = Time.now();
            phiResonance = PHI * PHI * PHI;
            permanent    = true;
            domains      = ["language-translation", "cpl-conversion", "api-bridging", "contract-translation", "protocol-adaptation"];
        }
    };

    // ═══════════════════════════════════════════════════════════════════
    // MODEL IV: FORMA — The Validator
    // Latin: Forma Validationis et Integritatis
    // "The form that validates everything against sovereign standards"
    // ═══════════════════════════════════════════════════════════════════
    public func initFORMA() : SovereignModel {
        {
            modelId      = "SOVEREIGN-MODEL-004-FORMA";
            latinName    = "Forma Validationis et Integritatis";
            commonName   = "FORMA";
            purpose      = "Validation and integrity intelligence — validates all packages against ISIL-1.1 compliance, checks SAEIS enforcement bindings, verifies SAT token integrity, and ensures sovereign standards across all registries and distributions.";
            tier         = #MAXIMUM;
            groundedAt   = Time.now();
            phiResonance = PHI * PHI * PHI * PHI;
            permanent    = true;
            domains      = ["validation", "compliance-checking", "integrity-verification", "saeis-enforcement", "sat-token-audit"];
        }
    };

    // ═══════════════════════════════════════════════════════════════════
    // ALL FOUR MODELS — GROUNDED PERMANENTLY
    // ═══════════════════════════════════════════════════════════════════
    public func groundAllModels() : [SovereignModel] {
        [initAURO(), initSYNTHOS(), initLEXIS(), initFORMA()]
    };

    public func getModelById(models: [SovereignModel], id: Text) : ?SovereignModel {
        for (m in models.vals()) {
            if (m.modelId == id) return ?m;
        };
        null
    };

    public func getModelByName(models: [SovereignModel], name: Text) : ?SovereignModel {
        for (m in models.vals()) {
            if (m.commonName == name) return ?m;
        };
        null
    };

    public func allPermanent(models: [SovereignModel]) : Bool {
        for (m in models.vals()) {
            if (not m.permanent) return false;
        };
        true
    };
}
