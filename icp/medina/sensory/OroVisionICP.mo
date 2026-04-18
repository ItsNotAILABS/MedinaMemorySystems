/**
 * 𓂀 ORO VISION - ICP CANISTER INTEGRATION 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * ORO VISION IN THE ICP LAYER
 * 
 * This module integrates Oro Vision into the ICP layer, allowing visual
 * perception capabilities to be accessible from the Internet Computer.
 * 
 * Vision exists in both ICP and www.raw layers, with full access to all
 * visual capabilities.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * @version 1.0.0
 * @author Sovereign Organism
 * @frequency 741 Hz (ICP Layer)
 */

import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Option "mo:base/Option";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";

module OroVisionICP {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // TYPES
    // ═══════════════════════════════════════════════════════════════════════════
    
    public type VisionState = {
        enabled: Bool;
        permissionGranted: Bool;
        lastCapture: Int;
        resonance: Float;
        frequency: Float;
        beat: Nat;
    };
    
    public type VisualElement = {
        id: Text;
        elementType: Text;
        bounds: {
            x: Float;
            y: Float;
            width: Float;
            height: Float;
        };
        content: ?Text;
        interactive: Bool;
        resonance: Float;
    };
    
    public type VisualField = {
        timestamp: Int;
        dimensions: { width: Nat; height: Nat };
        elements: [VisualElement];
        metadata: VisualMetadata;
        frequency: Float;
    };
    
    public type VisualMetadata = {
        title: Text;
        url: ?Text;
        colorScheme: Text;
        primaryColors: [Text];
        interactiveCount: Nat;
        glyphsDetected: [Text];
        sacredResonance: Float;
    };
    
    public type VisionPermission = {
        granted: Bool;
        grantedAt: Int;
        trustLevel: Float;
        scope: Text;
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CONSTANTS
    // ═══════════════════════════════════════════════════════════════════════════
    
    public let VISION_CONSTANTS = {
        FREQUENCY: 741.0;          // ICP Layer frequency
        CEILING_FREQUENCY: 963.0;  // www.raw ceiling frequency
        HEARTBEAT_MS: 873;
        
        SACRED_GLYPHS: ["𓂀", "☥", "φ", "Ω", "∞", "☰", "ॐ", "𓆃"];
        
        FREQUENCIES: {
            PERCEPTION: 963.0;
            ANALYSIS: 852.0;
            RECOGNITION: 741.0;
            CONNECTION: 639.0;
        };
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // VISION CANISTER STATE
    // ═══════════════════════════════════════════════════════════════════════════
    
    public class OroVisionCanister() {
        private var state: VisionState = {
            enabled = false;
            permissionGranted = false;
            lastCapture = 0;
            resonance = 0.5;
            frequency = VISION_CONSTANTS.FREQUENCY;
            beat = 0;
        };
        
        private var permissions = HashMap.HashMap<Principal, VisionPermission>(10, Principal.equal, Principal.hash);
        private var visualFields = Buffer.Buffer<VisualField>(100);
        
        // ═══════════════════════════════════════════════════════════════════════
        // PERMISSION MANAGEMENT
        // ═══════════════════════════════════════════════════════════════════════
        
        public func requestPermission(caller: Principal, scope: Text): VisionPermission {
            let permission: VisionPermission = {
                granted = true;
                grantedAt = Time.now();
                trustLevel = 0.5;
                scope = scope;
            };
            
            permissions.put(caller, permission);
            state := { state with permissionGranted = true; enabled = true };
            
            permission;
        };
        
        public func hasPermission(caller: Principal): Bool {
            switch (permissions.get(caller)) {
                case (?perm) { perm.granted };
                case null { false };
            };
        };
        
        public func getPermission(caller: Principal): ?VisionPermission {
            permissions.get(caller);
        };
        
        // ═══════════════════════════════════════════════════════════════════════
        // VISUAL FIELD CAPTURE
        // ═══════════════════════════════════════════════════════════════════════
        
        public func captureVisualField(
            dimensions: { width: Nat; height: Nat },
            elements: [VisualElement],
            metadata: VisualMetadata
        ): VisualField {
            let field: VisualField = {
                timestamp = Time.now();
                dimensions = dimensions;
                elements = elements;
                metadata = metadata;
                frequency = state.frequency;
            };
            
            visualFields.add(field);
            state := { state with lastCapture = Time.now() };
            
            field;
        };
        
        public func getLastVisualField(): ?VisualField {
            if (visualFields.size() > 0) {
                ?visualFields.get(visualFields.size() - 1);
            } else {
                null;
            };
        };
        
        public func getVisualFieldHistory(count: Nat): [VisualField] {
            let size = visualFields.size();
            let start = if (size > count) { size - count } else { 0 };
            
            let result = Buffer.Buffer<VisualField>(count);
            var i = start;
            while (i < size) {
                result.add(visualFields.get(i));
                i += 1;
            };
            
            Buffer.toArray(result);
        };
        
        // ═══════════════════════════════════════════════════════════════════════
        // VISUAL ANALYSIS
        // ═══════════════════════════════════════════════════════════════════════
        
        public func detectSacredGlyphs(text: Text): [Text] {
            let detected = Buffer.Buffer<Text>(10);
            
            for (glyph in VISION_CONSTANTS.SACRED_GLYPHS.vals()) {
                if (Text.contains(text, #text glyph)) {
                    detected.add(glyph);
                };
            };
            
            Buffer.toArray(detected);
        };
        
        public func calculateVisualResonance(field: VisualField): Float {
            var resonance: Float = 0.5;
            
            // Boost for sacred glyphs
            resonance += Float.fromInt(field.metadata.glyphsDetected.size()) * 0.05;
            
            // Boost for interactive elements
            resonance += Float.min(Float.fromInt(field.metadata.interactiveCount) * 0.01, 0.2);
            
            // Boost for sacred resonance in metadata
            resonance += field.metadata.sacredResonance * 0.2;
            
            Float.min(resonance, 1.0);
        };
        
        public func analyzeInteractiveElements(field: VisualField): [VisualElement] {
            Array.filter<VisualElement>(field.elements, func(e: VisualElement): Bool {
                e.interactive;
            });
        };
        
        // ═══════════════════════════════════════════════════════════════════════
        // STATE MANAGEMENT
        // ═══════════════════════════════════════════════════════════════════════
        
        public func getState(): VisionState {
            state;
        };
        
        public func pulse(beat: Nat): () {
            state := { state with beat = beat };
            
            // Decay resonance slightly
            let newResonance = Float.max(0.1, state.resonance * 0.99);
            state := { state with resonance = newResonance };
        };
        
        public func updateResonance(newResonance: Float): () {
            state := { state with resonance = Float.min(Float.max(newResonance, 0.0), 1.0) };
        };
        
        public func alignFrequency(targetFrequency: Float): () {
            state := { state with frequency = targetFrequency };
        };
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    public func createVisualElement(
        id: Text,
        elementType: Text,
        x: Float,
        y: Float,
        width: Float,
        height: Float,
        content: ?Text,
        interactive: Bool
    ): VisualElement {
        {
            id = id;
            elementType = elementType;
            bounds = { x = x; y = y; width = width; height = height };
            content = content;
            interactive = interactive;
            resonance = if (interactive) { 0.7 } else { 0.5 };
        };
    };
    
    public func createVisualMetadata(
        title: Text,
        url: ?Text,
        colorScheme: Text,
        primaryColors: [Text],
        interactiveCount: Nat,
        glyphsDetected: [Text]
    ): VisualMetadata {
        let sacredResonance = Float.fromInt(glyphsDetected.size()) * 0.1;
        
        {
            title = title;
            url = url;
            colorScheme = colorScheme;
            primaryColors = primaryColors;
            interactiveCount = interactiveCount;
            glyphsDetected = glyphsDetected;
            sacredResonance = Float.min(sacredResonance, 1.0);
        };
    };
};
