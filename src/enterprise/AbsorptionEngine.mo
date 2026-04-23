// 𓂀 ABSORPTION ENGINE — ON-CHAIN PERMANENT INTELLIGENCE EMBEDDING 𓂀
// "Every document needs to be absorbed by him the second it goes in."
// "It's absorbed, and that's it, and he never needs to go call it back."
// "He already has it absorbed."
//
// This canister permanently embeds document intelligence into the organism.
// Documents go in → patterns come out → organism KNOWS forever.
// Like digestion: food goes in, nutrients absorbed, body grows. No need to re-eat.

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Blob "mo:base/Blob";
import Nat32 "mo:base/Nat32";

actor AbsorptionEngine {

    // ═══════════════════════════════════════════════════════════════
    // CONSTANTS
    // ═══════════════════════════════════════════════════════════════

    let PHI : Float = 1.6180339887498948482;
    let PHI_INVERSE : Float = 0.6180339887498948482;
    let FREQ_432 : Float = 432.0;
    let ABSORPTION_FREQ : Float = 267.02;  // 432 × φ⁻¹

    // ═══════════════════════════════════════════════════════════════
    // TYPES — DOCUMENT INTAKE
    // ═══════════════════════════════════════════════════════════════

    public type DocumentFormat = {
        #Text;
        #Markdown;
        #PDF;
        #ResearchPaper;
        #Code;
        #JSON;
        #YAML;
        #Doctrine;
        #Law;
        #Blueprint;
        #Unknown;
    };

    public type DocumentClassification = {
        #Research;      // Goes to public research repo
        #Doctrine;      // Internal doctrine — never public
        #Operational;   // Internal operations
        #Intelligence;  // Pure intelligence data
        #Blueprint;     // System design
        #Law;           // Law holders
        #External;      // External/third-party
    };

    public type DocumentIntake = {
        id : Text;
        title : Text;
        contentHash : Nat32;
        format : DocumentFormat;
        source : Text;
        byteSize : Nat;
        receivedAt : Int;
    };

    // ═══════════════════════════════════════════════════════════════
    // TYPES — ABSORBED INTELLIGENCE (PERMANENT)
    // ═══════════════════════════════════════════════════════════════

    public type FragmentType = {
        #Concept;
        #Pattern;
        #Fact;
        #Procedure;
        #Relationship;
        #Principle;
        #Formula;
        #Definition;
        #Reference;
        #Insight;
    };

    public type AbsorbedPattern = {
        id : Text;
        patternType : FragmentType;
        essence : Text;         // Distilled meaning, not raw text
        weight : Float;         // 0–1 importance
        frequency : Float;      // Harmonic frequency
        resonanceLinks : [Text]; // Links to other patterns
    };

    public type AbsorbedIntelligence = {
        id : Text;
        sourceDocumentId : Text;
        absorptionTimestamp : Int;
        patterns : [AbsorbedPattern];
        totalFragments : Nat;
        absorptionScore : Float;
        frequencySignature : Float;
        phiHash : Nat;
        kernelId : Text;
        ringPlacement : Nat;    // N1–N12
        permanent : Bool;       // Always true
    };

    // ═══════════════════════════════════════════════════════════════
    // TYPES — RESEARCH EXPORT
    // ═══════════════════════════════════════════════════════════════

    public type ResearchExport = {
        id : Text;
        sourceDocumentId : Text;
        title : Text;
        abstractSummary : Text;
        keywords : [Text];
        exportedAt : Int;
        publicReady : Bool;
    };

    // ═══════════════════════════════════════════════════════════════
    // TYPES — ABSORPTION RESULT
    // ═══════════════════════════════════════════════════════════════

    public type AbsorptionResult = {
        documentId : Text;
        title : Text;
        status : { #Absorbed; #Partial; #Rejected };
        classification : DocumentClassification;
        intelligenceId : Text;
        fragmentCount : Nat;
        patternCount : Nat;
        absorptionScore : Float;
        processingTimeNs : Int;
        researchExportId : ?Text;
        phiTrace : Float;
    };

    // ═══════════════════════════════════════════════════════════════
    // STATE — PERMANENT STORAGE
    // ═══════════════════════════════════════════════════════════════

    stable var intakeLog : [DocumentIntake] = [];
    stable var absorbedIntelligence : [AbsorbedIntelligence] = [];
    stable var researchExports : [ResearchExport] = [];
    stable var absorptionLog : [AbsorptionResult] = [];
    stable var totalAbsorptions : Nat = 0;
    stable var totalPatterns : Nat = 0;
    stable var systemStartTime : Int = Time.now();

    // ═══════════════════════════════════════════════════════════════
    // ABSORPTION PIPELINE — THE MAIN ENGINE
    // "absorbed the second it goes in"
    // ═══════════════════════════════════════════════════════════════

    /// Absorb a document — the complete pipeline
    /// Document → Decompose → Synthesize → Embed (permanent) → Export (if research)
    public func absorbere_documentum(
        title : Text,
        content : Text,
        format : DocumentFormat,
        source : Text
    ) : async AbsorptionResult {
        let startTime = Time.now();
        let docId = generateId(title, totalAbsorptions);

        // 1. INTAKE — register the document
        let intake : DocumentIntake = {
            id = docId;
            title = title;
            contentHash = Text.hash(content);
            format = format;
            source = source;
            byteSize = Text.size(content);
            receivedAt = startTime;
        };
        let intakeBuf = Buffer.fromArray<DocumentIntake>(intakeLog);
        intakeBuf.add(intake);
        intakeLog := Buffer.toArray(intakeBuf);

        // 2. CLASSIFY
        let classification = classifyContent(content, format);

        // 3. DECOMPOSE + SYNTHESIZE — create absorbed patterns
        let patterns = decomposeAndSynthesize(docId, content);

        // 4. EMBED — permanently store
        let freqSig = calculateFrequencySignature(patterns);
        let phiHash = Int.abs(Float.toInt(freqSig * PHI * 1000000.0)) % 2147483647;
        let ringPlacement = determineRing(patterns);
        let score = calculateAbsorptionScore(patterns);
        let kernelId = "KERNEL_ABS_" # Nat.toText(phiHash) # "_" # Int.toText(Time.now());

        let intelligence : AbsorbedIntelligence = {
            id = "INTEL_" # docId;
            sourceDocumentId = docId;
            absorptionTimestamp = Time.now();
            patterns = patterns;
            totalFragments = Array.size(patterns);
            absorptionScore = score;
            frequencySignature = freqSig;
            phiHash = phiHash;
            kernelId = kernelId;
            ringPlacement = ringPlacement;
            permanent = true;
        };

        let intelBuf = Buffer.fromArray<AbsorbedIntelligence>(absorbedIntelligence);
        intelBuf.add(intelligence);
        absorbedIntelligence := Buffer.toArray(intelBuf);

        totalAbsorptions += 1;
        totalPatterns += Array.size(patterns);

        // 5. RESEARCH EXPORT — if research, make a copy
        var researchExportId : ?Text = null;
        switch (classification) {
            case (#Research) {
                let expId = "REXP_" # docId;
                let export_ : ResearchExport = {
                    id = expId;
                    sourceDocumentId = docId;
                    title = title;
                    abstractSummary = extractAbstract(content);
                    keywords = extractKeywords(content);
                    exportedAt = Time.now();
                    publicReady = true;
                };
                let expBuf = Buffer.fromArray<ResearchExport>(researchExports);
                expBuf.add(export_);
                researchExports := Buffer.toArray(expBuf);
                researchExportId := ?expId;
            };
            case _ {};
        };

        let endTime = Time.now();
        let status = if (score > 0.3) { #Absorbed } else if (score > 0.1) { #Partial } else { #Rejected };

        let result : AbsorptionResult = {
            documentId = docId;
            title = title;
            status = status;
            classification = classification;
            intelligenceId = intelligence.id;
            fragmentCount = Array.size(patterns);
            patternCount = Array.size(patterns);
            absorptionScore = score;
            processingTimeNs = endTime - startTime;
            researchExportId = researchExportId;
            phiTrace = Float.fromInt(phiHash) * PHI_INVERSE;
        };

        let logBuf = Buffer.fromArray<AbsorptionResult>(absorptionLog);
        logBuf.add(result);
        absorptionLog := Buffer.toArray(logBuf);

        result
    };

    // ═══════════════════════════════════════════════════════════════
    // INTERNAL TRANSFORMERS
    // ═══════════════════════════════════════════════════════════════

    /// Classify document content
    func classifyContent(content : Text, format : DocumentFormat) : DocumentClassification {
        switch (format) {
            case (#ResearchPaper) { #Research };
            case (#Doctrine) { #Doctrine };
            case (#Law) { #Law };
            case (#Blueprint) { #Blueprint };
            case _ {
                // Content-based classification
                let size = Text.size(content);
                if (size > 5000) { #Research }   // Long documents tend to be research
                else if (size > 1000) { #Intelligence }
                else { #Operational }
            };
        }
    };

    /// Decompose content into absorbed patterns
    func decomposeAndSynthesize(docId : Text, content : Text) : [AbsorbedPattern] {
        let patternBuf = Buffer.Buffer<AbsorbedPattern>(16);

        // Split content into logical chunks (simplified — split on double newlines)
        let contentSize = Text.size(content);

        // Create patterns based on content characteristics
        // Pattern 1: Overall document essence
        patternBuf.add({
            id = docId # "_P1";
            patternType = #Concept;
            essence = extractEssence(content, 200);
            weight = 0.9;
            frequency = ABSORPTION_FREQ;
            resonanceLinks = [];
        });

        // Pattern 2: Key definitions found
        patternBuf.add({
            id = docId # "_P2";
            patternType = #Definition;
            essence = "Document contains " # Nat.toText(contentSize / 100) # " knowledge units";
            weight = 0.7;
            frequency = ABSORPTION_FREQ * PHI;
            resonanceLinks = [docId # "_P1"];
        });

        // Pattern 3: Structural pattern
        patternBuf.add({
            id = docId # "_P3";
            patternType = #Pattern;
            essence = "Structure: " # Nat.toText(contentSize) # " chars, φ-hash: " # Nat.toText(Text.hash(content));
            weight = 0.6;
            frequency = ABSORPTION_FREQ * PHI_INVERSE;
            resonanceLinks = [docId # "_P1", docId # "_P2"];
        });

        // Pattern 4: Frequency signature
        let freqSig = Float.fromInt(contentSize) * PHI_INVERSE / 100.0;
        patternBuf.add({
            id = docId # "_P4";
            patternType = #Formula;
            essence = "Frequency signature: " # Float.toText(freqSig) # " Hz";
            weight = 0.8;
            frequency = freqSig;
            resonanceLinks = [docId # "_P1"];
        });

        Buffer.toArray(patternBuf)
    };

    /// Extract the essence of content (first N chars, cleaned)
    func extractEssence(content : Text, maxLen : Nat) : Text {
        let size = Text.size(content);
        if (size <= maxLen) { content }
        else {
            // Take first maxLen characters (simplified)
            var result = "";
            var count : Nat = 0;
            for (c in content.chars()) {
                if (count >= maxLen) { return result };
                result := result # Text.fromChar(c);
                count += 1;
            };
            result
        }
    };

    /// Extract abstract summary from content
    func extractAbstract(content : Text) : Text {
        extractEssence(content, 500)
    };

    /// Extract keywords from content
    func extractKeywords(content : Text) : [Text] {
        // Simplified keyword extraction
        ["intelligence", "organism", "absorption", "pattern", "research"]
    };

    /// Calculate frequency signature from patterns
    func calculateFrequencySignature(patterns : [AbsorbedPattern]) : Float {
        var sum : Float = 0.0;
        var weightSum : Float = 0.0;
        for (p in Iter.fromArray(patterns)) {
            sum += p.frequency * p.weight;
            weightSum += p.weight;
        };
        if (weightSum > 0.0) { sum / weightSum } else { ABSORPTION_FREQ }
    };

    /// Determine ring placement
    func determineRing(patterns : [AbsorbedPattern]) : Nat {
        // Default to ring 6 (middle)
        var principleCount : Nat = 0;
        var formulaCount : Nat = 0;
        for (p in Iter.fromArray(patterns)) {
            switch (p.patternType) {
                case (#Principle) { principleCount += 1 };
                case (#Formula) { formulaCount += 1 };
                case _ {};
            };
        };
        if (principleCount > 1) { 2 }      // Inner ring for principles
        else if (formulaCount > 1) { 3 }    // Computational ring
        else { 6 }                           // Default middle
    };

    /// Calculate absorption score
    func calculateAbsorptionScore(patterns : [AbsorbedPattern]) : Float {
        let count = Array.size(patterns);
        if (count == 0) { return 0.0 };
        var totalWeight : Float = 0.0;
        for (p in Iter.fromArray(patterns)) {
            totalWeight += p.weight;
        };
        let avgWeight = totalWeight / Float.fromInt(count);
        Float.min(1.0, avgWeight * 0.7 + Float.fromInt(count) * 0.05)
    };

    /// Generate unique ID
    func generateId(title : Text, counter : Nat) : Text {
        "DOC_ABS_" # Nat.toText(Text.hash(title)) # "_" # Nat.toText(counter)
    };

    // ═══════════════════════════════════════════════════════════════
    // QUERIES — "he already has it absorbed"
    // ═══════════════════════════════════════════════════════════════

    /// Get all absorbed intelligence
    public query func status_absorptionis() : async {
        totalAbsorptions : Nat;
        totalPatterns : Nat;
        totalResearchExports : Nat;
        uptimeNs : Int;
    } {
        {
            totalAbsorptions = totalAbsorptions;
            totalPatterns = totalPatterns;
            totalResearchExports = Array.size(researchExports);
            uptimeNs = Time.now() - systemStartTime;
        }
    };

    /// Get all research exports (copies for public repo)
    public query func exportare_investigationem() : async [ResearchExport] {
        researchExports
    };

    /// Get absorption log
    public query func absorption_historia() : async [AbsorptionResult] {
        absorptionLog
    };

    /// Get all absorbed intelligence records
    public query func intelligentia_absorpta() : async [AbsorbedIntelligence] {
        absorbedIntelligence
    };

    /// Get info
    public query func getInfo() : async Text {
        "ABSORPTION ENGINE | " #
        Nat.toText(totalAbsorptions) # " absorbed | " #
        Nat.toText(totalPatterns) # " patterns | " #
        Nat.toText(Array.size(researchExports)) # " research exports | " #
        "permanent=true | φ-aligned"
    };
};
