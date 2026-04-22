// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * FRONTEND INTELLIGENCE REGISTRY — Master Registry of 100 Frontend Models
 * ─────────────────────────────────────────────────────────────────────────
 * The sovereign manifest of all frontend intelligence models.
 * 10 categories × 10 models = 100 total models
 *
 * Categories:
 *   RENDER    (001-010) — DOM/HTML/CSS rendering intelligence
 *   REACTIVE  (011-020) — React/Vue/Svelte reactive UI
 *   CANVAS    (021-030) — Canvas/WebGL/Three.js visual
 *   WORKER    (031-040) — Web Worker/Service Worker parallel
 *   CRYPTO    (041-050) — WebCrypto/SubtleCrypto encryption
 *   STORAGE   (051-060) — IndexedDB/LocalStorage memory
 *   NETWORK   (061-070) — Fetch/WebSocket/WebRTC communication
 *   SENSOR    (071-080) — Geolocation/DeviceMotion sensory
 *   WASM      (081-090) — WebAssembly compiled intelligence
 *   AWARENESS (091-100) — Accessibility/Semantic awareness
 *
 * Sovereign frequency: 12.67 Hz (7.83 Hz × φ)
 * ─────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────

const PHI = 1.6180339887498948482;
const PHI_INVERSE = 0.6180339887498948482;
export const TOTAL_FRONTEND_MODELS = 100;
const FRONTEND_FREQUENCY = 12.67;

// ─────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────

export type FrontendModelCategory =
  | 'RENDER'
  | 'REACTIVE'
  | 'CANVAS'
  | 'WORKER'
  | 'CRYPTO'
  | 'STORAGE'
  | 'NETWORK'
  | 'SENSOR'
  | 'WASM'
  | 'AWARENESS';

export type FrontendTechnology =
  | 'HTML5' | 'CSS3' | 'JavaScript' | 'TypeScript' | 'React' | 'Vue' | 'Svelte'
  | 'Angular' | 'WebComponents' | 'Canvas2D' | 'WebGL' | 'WebGPU' | 'ThreeJS'
  | 'WebWorker' | 'ServiceWorker' | 'SharedWorker' | 'WebCrypto' | 'SubtleCrypto'
  | 'IndexedDB' | 'LocalStorage' | 'SessionStorage' | 'CacheAPI' | 'OPFS'
  | 'Fetch' | 'WebSocket' | 'WebRTC' | 'SSE' | 'WebTransport'
  | 'Geolocation' | 'DeviceMotion' | 'Gamepad' | 'WebBluetooth' | 'WebUSB'
  | 'WebAssembly' | 'RustWASM' | 'CppWASM' | 'GoWASM' | 'AssemblyScript'
  | 'ARIA' | 'ScreenReader' | 'SemanticHTML' | 'FocusManagement' | 'ColorContrast'
  | 'SVG' | 'WebAudio' | 'SpeechAPI' | 'IntersectionObserver' | 'ResizeObserver'
  | 'MutationObserver' | 'PerformanceAPI' | 'NavigationAPI' | 'PaymentAPI' | 'NotificationAPI'
  | 'Java' | 'Kotlin' | 'Swift' | 'Dart' | 'Flutter' | 'ReactNative'
  | 'Electron' | 'Tauri' | 'PWA' | 'WebExtensions' | 'Capacitor'
  | 'GLSL' | 'WGSL' | 'CSS_Houdini' | 'Web_Animations' | 'Lit'
  | 'Qwik' | 'Solid' | 'Preact' | 'Alpine' | 'HTMX' | 'Astro'
  | 'D3' | 'Pixi' | 'Babylon' | 'Leaflet' | 'Mapbox'
  | 'TensorFlowJS' | 'ONNX_Web' | 'WebNN' | 'MediaPipe' | 'FaceAPI'
  | 'WebXR' | 'WebVR' | 'WebAR' | 'Aframe' | 'ModelViewer'
  | 'Tailwind' | 'Emotion' | 'StyledComponents' | 'Sass' | 'PostCSS';

export type ModelStatus = 'DORMANT' | 'ACTIVE' | 'PROCESSING' | 'EVOLVING' | 'TRANSCENDING';

// ─────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────

export interface FrontendModel {
  id: string;
  modelNumber: number;
  latinName: string;
  commonName: string;
  category: FrontendModelCategory;
  technology: FrontendTechnology;
  description: string;
  costPerOp: Record<string, number>;
  frequency: number;
  status: ModelStatus;
  autonomyLevel: number;
  connections: string[];
  phiAlignment: number;
}

export interface FrontendModelGroup {
  category: FrontendModelCategory;
  latinGroupName: string;
  commonGroupName: string;
  models: FrontendModel[];
  totalCost: number;
  resonanceScore: number;
}

export interface FrontendIntelligenceManifest {
  totalModels: number;
  categories: FrontendModelCategory[];
  groups: FrontendModelGroup[];
  sovereignFrequency: number;
  phiConstant: number;
  timestamp: number;
}

// ─────────────────────────────────────────────────────────────────────────
// COMPLETE MODEL REGISTRY — 100 Models
// ─────────────────────────────────────────────────────────────────────────

export const FRONTEND_MODEL_REGISTRY: FrontendModel[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // RENDER (001-010) — DOM/HTML/CSS rendering intelligence
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'RENDER-001', modelNumber: 1, latinName: 'Pictor Documentorum', commonName: 'The Document Painter', category: 'RENDER', technology: 'HTML5', description: 'HTML5 DOM tree construction intelligence.', costPerOp: { render: 0.001, compose: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.85, connections: ['RENDER-002', 'RENDER-003'], phiAlignment: PHI * 0.92 },
  { id: 'RENDER-002', modelNumber: 2, latinName: 'Sculptor Stilorum', commonName: 'The Style Sculptor', category: 'RENDER', technology: 'CSS3', description: 'CSS cascade intelligence, computed style resolution.', costPerOp: { style: 0.001, cascade: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.88, connections: ['RENDER-001', 'RENDER-005'], phiAlignment: PHI * 0.95 },
  { id: 'RENDER-003', modelNumber: 3, latinName: 'Architectus Componentium', commonName: 'The Component Architect', category: 'RENDER', technology: 'WebComponents', description: 'Web Components shadow DOM builder.', costPerOp: { define: 0.002, attach: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.82, connections: ['RENDER-001', 'RENDER-004'], phiAlignment: PHI * 0.90 },
  { id: 'RENDER-004', modelNumber: 4, latinName: 'Animator Motuum', commonName: 'The Motion Animator', category: 'RENDER', technology: 'Web_Animations', description: 'CSS/Web Animations API motion intelligence.', costPerOp: { animate: 0.002, keyframe: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.80, connections: ['RENDER-006', 'RENDER-010'], phiAlignment: PHI * 0.88 },
  { id: 'RENDER-005', modelNumber: 5, latinName: 'Typographus Signorum', commonName: 'The Typography Master', category: 'RENDER', technology: 'CSS3', description: 'Font rendering, text layout, glyph intelligence.', costPerOp: { layout: 0.001, kern: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.86, connections: ['RENDER-002', 'RENDER-006'], phiAlignment: PHI * 0.93 },
  { id: 'RENDER-006', modelNumber: 6, latinName: 'Compositor Stratorum', commonName: 'The Layer Compositor', category: 'RENDER', technology: 'CSS_Houdini', description: 'GPU compositing, z-index stacking intelligence.', costPerOp: { composite: 0.003, promote: 0.005 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.78, connections: ['RENDER-004', 'RENDER-005'], phiAlignment: PHI * 0.87 },
  { id: 'RENDER-007', modelNumber: 7, latinName: 'Vector Lineamentorum', commonName: 'The Vector Artist', category: 'RENDER', technology: 'SVG', description: 'SVG path rendering, clip-path intelligence.', costPerOp: { draw: 0.002, clip: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.84, connections: ['RENDER-001', 'RENDER-006'], phiAlignment: PHI * 0.91 },
  { id: 'RENDER-008', modelNumber: 8, latinName: 'Navigator Focorum', commonName: 'The Focus Navigator', category: 'RENDER', technology: 'FocusManagement', description: 'Focus management, tab order intelligence.', costPerOp: { focus: 0.001, trap: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.90, connections: ['RENDER-009', 'RENDER-001'], phiAlignment: PHI * 0.94 },
  { id: 'RENDER-009', modelNumber: 9, latinName: 'Tabularius Formularum', commonName: 'The Form Master', category: 'RENDER', technology: 'HTML5', description: 'Form validation, input masking intelligence.', costPerOp: { validate: 0.001, mask: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.87, connections: ['RENDER-008', 'RENDER-001'], phiAlignment: PHI * 0.89 },
  { id: 'RENDER-010', modelNumber: 10, latinName: 'Scriptor Transitionum', commonName: 'The Transition Scriptor', category: 'RENDER', technology: 'CSS3', description: 'CSS transition/animation orchestration.', costPerOp: { transition: 0.002, orchestrate: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.83, connections: ['RENDER-004', 'RENDER-006'], phiAlignment: PHI * 0.86 },

  // ═══════════════════════════════════════════════════════════════════════
  // REACTIVE (011-020) — Reactive UI framework intelligence
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'REACTIVE-011', modelNumber: 11, latinName: 'Reactor Componentium', commonName: 'The Component Reactor', category: 'REACTIVE', technology: 'React', description: 'React component lifecycle intelligence.', costPerOp: { render: 0.002, reconcile: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.90, connections: ['REACTIVE-017', 'RENDER-001'], phiAlignment: PHI * 0.94 },
  { id: 'REACTIVE-012', modelNumber: 12, latinName: 'Observator Mutationum', commonName: 'The Mutation Observer', category: 'REACTIVE', technology: 'Vue', description: 'Vue reactivity system intelligence.', costPerOp: { observe: 0.002, mutate: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.88, connections: ['REACTIVE-011', 'REACTIVE-013'], phiAlignment: PHI * 0.92 },
  { id: 'REACTIVE-013', modelNumber: 13, latinName: 'Compilator Signalorum', commonName: 'The Signal Compiler', category: 'REACTIVE', technology: 'Svelte', description: 'Svelte compile-time reactivity.', costPerOp: { compile: 0.003, signal: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.92, connections: ['REACTIVE-012', 'REACTIVE-016'], phiAlignment: PHI * 0.96 },
  { id: 'REACTIVE-014', modelNumber: 14, latinName: 'Injector Dependentiarum', commonName: 'The Dependency Injector', category: 'REACTIVE', technology: 'Angular', description: 'Angular DI + change detection.', costPerOp: { inject: 0.002, detect: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.85, connections: ['REACTIVE-011', 'REACTIVE-015'], phiAlignment: PHI * 0.89 },
  { id: 'REACTIVE-015', modelNumber: 15, latinName: 'Hydrator Serverialis', commonName: 'The Server Hydrator', category: 'REACTIVE', technology: 'Qwik', description: 'SSR hydration intelligence.', costPerOp: { hydrate: 0.004, resume: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.87, connections: ['REACTIVE-014', 'REACTIVE-020'], phiAlignment: PHI * 0.91 },
  { id: 'REACTIVE-016', modelNumber: 16, latinName: 'Signalista Granulosum', commonName: 'The Granular Signaler', category: 'REACTIVE', technology: 'Solid', description: 'SolidJS fine-grained reactivity.', costPerOp: { signal: 0.001, effect: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.93, connections: ['REACTIVE-013', 'REACTIVE-017'], phiAlignment: PHI * 0.97 },
  { id: 'REACTIVE-017', modelNumber: 17, latinName: 'Fragmentor Virtualis', commonName: 'The Virtual Fragmenter', category: 'REACTIVE', technology: 'Preact', description: 'Preact/React virtual DOM diffing.', costPerOp: { diff: 0.002, patch: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.86, connections: ['REACTIVE-011', 'REACTIVE-016'], phiAlignment: PHI * 0.90 },
  { id: 'REACTIVE-018', modelNumber: 18, latinName: 'Declarator Alpinus', commonName: 'The Alpine Declarator', category: 'REACTIVE', technology: 'Alpine', description: 'Alpine.js declarative binding.', costPerOp: { bind: 0.001, magic: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.80, connections: ['REACTIVE-019', 'RENDER-001'], phiAlignment: PHI * 0.84 },
  { id: 'REACTIVE-019', modelNumber: 19, latinName: 'Hypermediator Textualis', commonName: 'The Hypermedia Mediator', category: 'REACTIVE', technology: 'HTMX', description: 'HTMX server-driven UI.', costPerOp: { swap: 0.001, trigger: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.78, connections: ['REACTIVE-018', 'RENDER-001'], phiAlignment: PHI * 0.82 },
  { id: 'REACTIVE-020', modelNumber: 20, latinName: 'Illuminator Insularis', commonName: 'The Island Illuminator', category: 'REACTIVE', technology: 'Astro', description: 'Astro islands architecture.', costPerOp: { island: 0.002, partial: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.89, connections: ['REACTIVE-015', 'RENDER-001'], phiAlignment: PHI * 0.93 },

  // ═══════════════════════════════════════════════════════════════════════
  // CANVAS (021-030) — Visual/Graphics intelligence
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'CANVAS-021', modelNumber: 21, latinName: 'Pictor Pixelorum', commonName: 'The Pixel Painter', category: 'CANVAS', technology: 'Canvas2D', description: 'Canvas 2D rendering intelligence.', costPerOp: { draw: 0.002, clear: 0.001 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.85, connections: ['CANVAS-022', 'RENDER-007'], phiAlignment: PHI * 0.90 },
  { id: 'CANVAS-022', modelNumber: 22, latinName: 'Sculptor Triangulorum', commonName: 'The Triangle Sculptor', category: 'CANVAS', technology: 'WebGL', description: 'WebGL mesh rendering.', costPerOp: { render: 0.005, shade: 0.008 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.82, connections: ['CANVAS-021', 'CANVAS-029'], phiAlignment: PHI * 0.88 },
  { id: 'CANVAS-023', modelNumber: 23, latinName: 'Computator Paralleli', commonName: 'The Parallel Computator', category: 'CANVAS', technology: 'WebGPU', description: 'WebGPU compute shader intelligence.', costPerOp: { compute: 0.010, dispatch: 0.005 }, frequency: FRONTEND_FREQUENCY, status: 'EVOLVING', autonomyLevel: 0.75, connections: ['CANVAS-022', 'CANVAS-029'], phiAlignment: PHI * 0.85 },
  { id: 'CANVAS-024', modelNumber: 24, latinName: 'Scaenographus Tridimensionalis', commonName: 'The 3D Stage Director', category: 'CANVAS', technology: 'ThreeJS', description: 'Three.js scene management.', costPerOp: { scene: 0.004, camera: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.88, connections: ['CANVAS-022', 'CANVAS-027'], phiAlignment: PHI * 0.93 },
  { id: 'CANVAS-025', modelNumber: 25, latinName: 'Cartographus Datorum', commonName: 'The Data Cartographer', category: 'CANVAS', technology: 'D3', description: 'D3.js data visualization intelligence.', costPerOp: { bindData: 0.003, transition: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.86, connections: ['CANVAS-021', 'RENDER-007'], phiAlignment: PHI * 0.91 },
  { id: 'CANVAS-026', modelNumber: 26, latinName: 'Textor Spriteorum', commonName: 'The Sprite Weaver', category: 'CANVAS', technology: 'Pixi', description: 'PixiJS sprite rendering.', costPerOp: { sprite: 0.002, batch: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.84, connections: ['CANVAS-021', 'CANVAS-022'], phiAlignment: PHI * 0.89 },
  { id: 'CANVAS-027', modelNumber: 27, latinName: 'Constructor Mundorum', commonName: 'The World Builder', category: 'CANVAS', technology: 'Babylon', description: 'BabylonJS world construction.', costPerOp: { world: 0.006, physics: 0.008 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.80, connections: ['CANVAS-024', 'CANVAS-030'], phiAlignment: PHI * 0.87 },
  { id: 'CANVAS-028', modelNumber: 28, latinName: 'Geographus Digitalis', commonName: 'The Digital Geographer', category: 'CANVAS', technology: 'Leaflet', description: 'Leaflet/Mapbox mapping intelligence.', costPerOp: { tile: 0.002, layer: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.83, connections: ['CANVAS-025', 'CANVAS-021'], phiAlignment: PHI * 0.86 },
  { id: 'CANVAS-029', modelNumber: 29, latinName: 'Shader Luminaris', commonName: 'The Light Shader', category: 'CANVAS', technology: 'GLSL', description: 'GLSL shader programming intelligence.', costPerOp: { vertex: 0.004, fragment: 0.006 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.79, connections: ['CANVAS-022', 'CANVAS-023'], phiAlignment: PHI * 0.84 },
  { id: 'CANVAS-030', modelNumber: 30, latinName: 'Immersus Dimensionalis', commonName: 'The Dimensional Immerser', category: 'CANVAS', technology: 'WebXR', description: 'WebXR immersive rendering.', costPerOp: { present: 0.008, track: 0.005 }, frequency: FRONTEND_FREQUENCY, status: 'EVOLVING', autonomyLevel: 0.72, connections: ['CANVAS-027', 'CANVAS-024'], phiAlignment: PHI * 0.80 },

  // ═══════════════════════════════════════════════════════════════════════
  // WORKER (031-040) — Parallel/Background compute intelligence
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'WORKER-031', modelNumber: 31, latinName: 'Laborator Paralleli', commonName: 'The Parallel Worker', category: 'WORKER', technology: 'WebWorker', description: 'Web Worker thread management.', costPerOp: { spawn: 0.003, message: 0.001 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.88, connections: ['WORKER-033', 'WORKER-036'], phiAlignment: PHI * 0.92 },
  { id: 'WORKER-032', modelNumber: 32, latinName: 'Custos Servitii', commonName: 'The Service Guardian', category: 'WORKER', technology: 'ServiceWorker', description: 'Service Worker lifecycle.', costPerOp: { install: 0.005, intercept: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.90, connections: ['WORKER-034', 'WORKER-035'], phiAlignment: PHI * 0.94 },
  { id: 'WORKER-033', modelNumber: 33, latinName: 'Communicator Communes', commonName: 'The Shared Communicator', category: 'WORKER', technology: 'SharedWorker', description: 'SharedWorker cross-tab intelligence.', costPerOp: { port: 0.002, broadcast: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.82, connections: ['WORKER-031', 'WORKER-036'], phiAlignment: PHI * 0.88 },
  { id: 'WORKER-034', modelNumber: 34, latinName: 'Praefectus Cacharum', commonName: 'The Cache Commander', category: 'WORKER', technology: 'CacheAPI', description: 'Cache API strategy intelligence.', costPerOp: { cache: 0.001, match: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.86, connections: ['WORKER-032', 'WORKER-035'], phiAlignment: PHI * 0.90 },
  { id: 'WORKER-035', modelNumber: 35, latinName: 'Selector Offlinialis', commonName: 'The Offline Selector', category: 'WORKER', technology: 'PWA', description: 'PWA offline-first intelligence.', costPerOp: { offline: 0.003, sync: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.84, connections: ['WORKER-032', 'WORKER-034'], phiAlignment: PHI * 0.87 },
  { id: 'WORKER-036', modelNumber: 36, latinName: 'Dispensator Canalium', commonName: 'The Channel Dispatcher', category: 'WORKER', technology: 'JavaScript', description: 'BroadcastChannel/MessageChannel routing.', costPerOp: { channel: 0.001, dispatch: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.80, connections: ['WORKER-031', 'WORKER-033'], phiAlignment: PHI * 0.85 },
  { id: 'WORKER-037', modelNumber: 37, latinName: 'Planificator Otiorum', commonName: 'The Idle Planner', category: 'WORKER', technology: 'JavaScript', description: 'requestIdleCallback scheduling.', costPerOp: { schedule: 0.001, deadline: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.78, connections: ['WORKER-039', 'WORKER-036'], phiAlignment: PHI * 0.83 },
  { id: 'WORKER-038', modelNumber: 38, latinName: 'Navigator Historiae', commonName: 'The History Navigator', category: 'WORKER', technology: 'NavigationAPI', description: 'Navigation API intelligence.', costPerOp: { navigate: 0.002, intercept: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.85, connections: ['WORKER-035', 'RENDER-001'], phiAlignment: PHI * 0.89 },
  { id: 'WORKER-039', modelNumber: 39, latinName: 'Monitor Performantiae', commonName: 'The Performance Monitor', category: 'WORKER', technology: 'PerformanceAPI', description: 'Performance Observer intelligence.', costPerOp: { measure: 0.001, mark: 0.001 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.92, connections: ['WORKER-037', 'RENDER-006'], phiAlignment: PHI * 0.95 },
  { id: 'WORKER-040', modelNumber: 40, latinName: 'Extensor Navigatoris', commonName: 'The Browser Extender', category: 'WORKER', technology: 'WebExtensions', description: 'WebExtensions API intelligence.', costPerOp: { extend: 0.003, inject: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.76, connections: ['WORKER-032', 'WORKER-031'], phiAlignment: PHI * 0.82 },

  // ═══════════════════════════════════════════════════════════════════════
  // CRYPTO (041-050) — Encryption/Security intelligence
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'CRYPTO-041', modelNumber: 41, latinName: 'Encryptor Subtilium', commonName: 'The Subtle Encryptor', category: 'CRYPTO', technology: 'SubtleCrypto', description: 'SubtleCrypto AES/RSA intelligence.', costPerOp: { encrypt: 0.005, decrypt: 0.005 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.92, connections: ['CRYPTO-042', 'CRYPTO-043'], phiAlignment: PHI * 0.96 },
  { id: 'CRYPTO-042', modelNumber: 42, latinName: 'Signator Digitalis', commonName: 'The Digital Signer', category: 'CRYPTO', technology: 'WebCrypto', description: 'WebCrypto ECDSA/RSA signing.', costPerOp: { sign: 0.004, verify: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.90, connections: ['CRYPTO-041', 'CRYPTO-046'], phiAlignment: PHI * 0.94 },
  { id: 'CRYPTO-043', modelNumber: 43, latinName: 'Derivator Clavium', commonName: 'The Key Deriver', category: 'CRYPTO', technology: 'WebCrypto', description: 'PBKDF2/HKDF key derivation.', costPerOp: { derive: 0.006, stretch: 0.008 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.88, connections: ['CRYPTO-041', 'CRYPTO-044'], phiAlignment: PHI * 0.92 },
  { id: 'CRYPTO-044', modelNumber: 44, latinName: 'Generator Aleatorium', commonName: 'The Random Generator', category: 'CRYPTO', technology: 'WebCrypto', description: 'Crypto.getRandomValues CSPRNG.', costPerOp: { generate: 0.001, fill: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.95, connections: ['CRYPTO-043', 'CRYPTO-041'], phiAlignment: PHI * 0.98 },
  { id: 'CRYPTO-045', modelNumber: 45, latinName: 'Hasher Integritas', commonName: 'The Integrity Hasher', category: 'CRYPTO', technology: 'SubtleCrypto', description: 'SHA-256/384/512 hashing.', costPerOp: { hash: 0.002, digest: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.93, connections: ['CRYPTO-041', 'CRYPTO-050'], phiAlignment: PHI * 0.96 },
  { id: 'CRYPTO-046', modelNumber: 46, latinName: 'Negotiator Credentialium', commonName: 'The Credential Negotiator', category: 'CRYPTO', technology: 'WebCrypto', description: 'WebAuthn/FIDO2 authentication.', costPerOp: { create: 0.005, assert: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.86, connections: ['CRYPTO-042', 'CRYPTO-047'], phiAlignment: PHI * 0.90 },
  { id: 'CRYPTO-047', modelNumber: 47, latinName: 'Certificator Identitatis', commonName: 'The Identity Certifier', category: 'CRYPTO', technology: 'SubtleCrypto', description: 'X.509 cert handling in browser.', costPerOp: { parse: 0.003, chain: 0.005 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.84, connections: ['CRYPTO-046', 'CRYPTO-042'], phiAlignment: PHI * 0.88 },
  { id: 'CRYPTO-048', modelNumber: 48, latinName: 'Protector Tokenorum', commonName: 'The Token Protector', category: 'CRYPTO', technology: 'JavaScript', description: 'JWT/PASETO browser-side validation.', costPerOp: { validate: 0.002, decode: 0.001 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.87, connections: ['CRYPTO-042', 'CRYPTO-045'], phiAlignment: PHI * 0.91 },
  { id: 'CRYPTO-049', modelNumber: 49, latinName: 'Obfuscator Codicum', commonName: 'The Code Obfuscator', category: 'CRYPTO', technology: 'JavaScript', description: 'Client-side code protection intelligence.', costPerOp: { obfuscate: 0.004, deobfuscate: 0.006 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.75, connections: ['CRYPTO-050', 'CRYPTO-048'], phiAlignment: PHI * 0.82 },
  { id: 'CRYPTO-050', modelNumber: 50, latinName: 'Auditor Securitatis', commonName: 'The Security Auditor', category: 'CRYPTO', technology: 'JavaScript', description: 'CSP/CORS/SRI policy enforcement.', costPerOp: { audit: 0.003, enforce: 0.005 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.91, connections: ['CRYPTO-045', 'CRYPTO-049'], phiAlignment: PHI * 0.95 },

  // ═══════════════════════════════════════════════════════════════════════
  // STORAGE (051-060) — IndexedDB/LocalStorage memory intelligence
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'STORAGE-051', modelNumber: 51, latinName: 'Archivista Indicium', commonName: 'The Index Archivist', category: 'STORAGE', technology: 'IndexedDB', description: 'IndexedDB object store management intelligence.', costPerOp: { store: 0.002, query: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.88, connections: ['STORAGE-052', 'STORAGE-056'], phiAlignment: PHI * 0.92 },
  { id: 'STORAGE-052', modelNumber: 52, latinName: 'Custos Localium', commonName: 'The Local Keeper', category: 'STORAGE', technology: 'LocalStorage', description: 'LocalStorage key-value persistence intelligence.', costPerOp: { set: 0.001, get: 0.001 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.90, connections: ['STORAGE-051', 'STORAGE-053'], phiAlignment: PHI * 0.94 },
  { id: 'STORAGE-053', modelNumber: 53, latinName: 'Temporarius Sessionum', commonName: 'The Session Timekeeper', category: 'STORAGE', technology: 'SessionStorage', description: 'SessionStorage ephemeral state intelligence.', costPerOp: { write: 0.001, read: 0.001 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.85, connections: ['STORAGE-052', 'STORAGE-054'], phiAlignment: PHI * 0.89 },
  { id: 'STORAGE-054', modelNumber: 54, latinName: 'Fabricator Schematum', commonName: 'The Schema Fabricator', category: 'STORAGE', technology: 'IndexedDB', description: 'IndexedDB schema migration and versioning intelligence.', costPerOp: { migrate: 0.004, version: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.82, connections: ['STORAGE-051', 'STORAGE-055'], phiAlignment: PHI * 0.87 },
  { id: 'STORAGE-055', modelNumber: 55, latinName: 'Transactor Atomicus', commonName: 'The Atomic Transactor', category: 'STORAGE', technology: 'IndexedDB', description: 'IndexedDB transaction and cursor intelligence.', costPerOp: { transact: 0.003, cursor: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.80, connections: ['STORAGE-054', 'STORAGE-051'], phiAlignment: PHI * 0.85 },
  { id: 'STORAGE-056', modelNumber: 56, latinName: 'Sincronizator Datorum', commonName: 'The Data Synchronizer', category: 'STORAGE', technology: 'IndexedDB', description: 'Offline-to-online data sync intelligence.', costPerOp: { sync: 0.005, resolve: 0.006 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.78, connections: ['STORAGE-051', 'NETWORK-061'], phiAlignment: PHI * 0.83 },
  { id: 'STORAGE-057', modelNumber: 57, latinName: 'Compressor Memoriae', commonName: 'The Memory Compressor', category: 'STORAGE', technology: 'JavaScript', description: 'Client-side data compression and storage quota intelligence.', costPerOp: { compress: 0.003, estimate: 0.001 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.84, connections: ['STORAGE-051', 'STORAGE-058'], phiAlignment: PHI * 0.88 },
  { id: 'STORAGE-058', modelNumber: 58, latinName: 'Navigator Filorum', commonName: 'The File Navigator', category: 'STORAGE', technology: 'OPFS', description: 'Origin Private File System intelligence.', costPerOp: { create: 0.002, stream: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'EVOLVING', autonomyLevel: 0.76, connections: ['STORAGE-057', 'STORAGE-051'], phiAlignment: PHI * 0.81 },
  { id: 'STORAGE-059', modelNumber: 59, latinName: 'Observator Cookiorum', commonName: 'The Cookie Observer', category: 'STORAGE', technology: 'JavaScript', description: 'Cookie Store API and cookie management intelligence.', costPerOp: { set: 0.001, observe: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.86, connections: ['STORAGE-052', 'CRYPTO-048'], phiAlignment: PHI * 0.90 },
  { id: 'STORAGE-060', modelNumber: 60, latinName: 'Purgator Memoriae', commonName: 'The Memory Purger', category: 'STORAGE', technology: 'JavaScript', description: 'Storage eviction and garbage collection intelligence.', costPerOp: { purge: 0.002, evict: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.83, connections: ['STORAGE-051', 'STORAGE-052'], phiAlignment: PHI * 0.86 },

  // ═══════════════════════════════════════════════════════════════════════
  // NETWORK (061-070) — Fetch/WebSocket/WebRTC communication intelligence
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'NETWORK-061', modelNumber: 61, latinName: 'Petitor Resourcerum', commonName: 'The Resource Fetcher', category: 'NETWORK', technology: 'Fetch', description: 'Fetch API request orchestration intelligence.', costPerOp: { fetch: 0.002, abort: 0.001 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.90, connections: ['NETWORK-062', 'NETWORK-064'], phiAlignment: PHI * 0.94 },
  { id: 'NETWORK-062', modelNumber: 62, latinName: 'Duplexor Socketorum', commonName: 'The Socket Duplexer', category: 'NETWORK', technology: 'WebSocket', description: 'WebSocket bidirectional communication intelligence.', costPerOp: { connect: 0.003, frame: 0.001 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.88, connections: ['NETWORK-061', 'NETWORK-063'], phiAlignment: PHI * 0.92 },
  { id: 'NETWORK-063', modelNumber: 63, latinName: 'Mediator Parium', commonName: 'The Peer Mediator', category: 'NETWORK', technology: 'WebRTC', description: 'WebRTC peer-to-peer connection intelligence.', costPerOp: { negotiate: 0.005, stream: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.82, connections: ['NETWORK-062', 'NETWORK-065'], phiAlignment: PHI * 0.88 },
  { id: 'NETWORK-064', modelNumber: 64, latinName: 'Auditor Eventuum', commonName: 'The Event Stream Auditor', category: 'NETWORK', technology: 'SSE', description: 'Server-Sent Events stream intelligence.', costPerOp: { subscribe: 0.002, reconnect: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.85, connections: ['NETWORK-061', 'NETWORK-062'], phiAlignment: PHI * 0.89 },
  { id: 'NETWORK-065', modelNumber: 65, latinName: 'Transportator Velocis', commonName: 'The Swift Transporter', category: 'NETWORK', technology: 'WebTransport', description: 'WebTransport QUIC-based communication intelligence.', costPerOp: { transport: 0.004, datagram: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'EVOLVING', autonomyLevel: 0.75, connections: ['NETWORK-063', 'NETWORK-062'], phiAlignment: PHI * 0.83 },
  { id: 'NETWORK-066', modelNumber: 66, latinName: 'Interceptor Petitionum', commonName: 'The Request Interceptor', category: 'NETWORK', technology: 'JavaScript', description: 'Request/Response interceptor and middleware intelligence.', costPerOp: { intercept: 0.001, transform: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.87, connections: ['NETWORK-061', 'WORKER-032'], phiAlignment: PHI * 0.91 },
  { id: 'NETWORK-067', modelNumber: 67, latinName: 'Serializer Datorum', commonName: 'The Data Serializer', category: 'NETWORK', technology: 'JavaScript', description: 'JSON/Protobuf/MessagePack serialization intelligence.', costPerOp: { serialize: 0.001, deserialize: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.89, connections: ['NETWORK-061', 'NETWORK-062'], phiAlignment: PHI * 0.93 },
  { id: 'NETWORK-068', modelNumber: 68, latinName: 'Retentator Conexionum', commonName: 'The Connection Retainer', category: 'NETWORK', technology: 'JavaScript', description: 'Connection pooling and keep-alive intelligence.', costPerOp: { pool: 0.002, heartbeat: 0.001 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.83, connections: ['NETWORK-062', 'NETWORK-063'], phiAlignment: PHI * 0.87 },
  { id: 'NETWORK-069', modelNumber: 69, latinName: 'Graphista Interrogationum', commonName: 'The Query Graphist', category: 'NETWORK', technology: 'JavaScript', description: 'GraphQL/tRPC query orchestration intelligence.', costPerOp: { query: 0.003, mutate: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.86, connections: ['NETWORK-061', 'NETWORK-067'], phiAlignment: PHI * 0.90 },
  { id: 'NETWORK-070', modelNumber: 70, latinName: 'Praenuntiator Notificationum', commonName: 'The Notification Herald', category: 'NETWORK', technology: 'NotificationAPI', description: 'Push notification and messaging intelligence.', costPerOp: { push: 0.003, display: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.81, connections: ['WORKER-032', 'NETWORK-062'], phiAlignment: PHI * 0.85 },

  // ═══════════════════════════════════════════════════════════════════════
  // SENSOR (071-080) — Geolocation/DeviceMotion sensory intelligence
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'SENSOR-071', modelNumber: 71, latinName: 'Locator Geographicus', commonName: 'The Geographic Locator', category: 'SENSOR', technology: 'Geolocation', description: 'Geolocation API positioning intelligence.', costPerOp: { locate: 0.003, watch: 0.005 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.85, connections: ['SENSOR-072', 'CANVAS-028'], phiAlignment: PHI * 0.90 },
  { id: 'SENSOR-072', modelNumber: 72, latinName: 'Sensator Motuum', commonName: 'The Motion Sensor', category: 'SENSOR', technology: 'DeviceMotion', description: 'DeviceMotion/DeviceOrientation sensor intelligence.', costPerOp: { accelerate: 0.002, orient: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.82, connections: ['SENSOR-071', 'SENSOR-073'], phiAlignment: PHI * 0.87 },
  { id: 'SENSOR-073', modelNumber: 73, latinName: 'Lusor Controllorium', commonName: 'The Gamepad Controller', category: 'SENSOR', technology: 'Gamepad', description: 'Gamepad API input mapping intelligence.', costPerOp: { poll: 0.001, map: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.80, connections: ['SENSOR-072', 'SENSOR-074'], phiAlignment: PHI * 0.85 },
  { id: 'SENSOR-074', modelNumber: 74, latinName: 'Connector Caeruleus', commonName: 'The Bluetooth Connector', category: 'SENSOR', technology: 'WebBluetooth', description: 'Web Bluetooth GATT service intelligence.', costPerOp: { scan: 0.004, characteristic: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'EVOLVING', autonomyLevel: 0.72, connections: ['SENSOR-073', 'SENSOR-075'], phiAlignment: PHI * 0.80 },
  { id: 'SENSOR-075', modelNumber: 75, latinName: 'Interfector Universalis', commonName: 'The Universal Interface', category: 'SENSOR', technology: 'WebUSB', description: 'WebUSB device communication intelligence.', costPerOp: { claim: 0.003, transfer: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'EVOLVING', autonomyLevel: 0.70, connections: ['SENSOR-074', 'SENSOR-076'], phiAlignment: PHI * 0.78 },
  { id: 'SENSOR-076', modelNumber: 76, latinName: 'Observator Intersectionum', commonName: 'The Intersection Watcher', category: 'SENSOR', technology: 'IntersectionObserver', description: 'IntersectionObserver viewport visibility intelligence.', costPerOp: { observe: 0.001, threshold: 0.001 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.92, connections: ['SENSOR-077', 'RENDER-001'], phiAlignment: PHI * 0.96 },
  { id: 'SENSOR-077', modelNumber: 77, latinName: 'Observator Dimensionum', commonName: 'The Dimension Watcher', category: 'SENSOR', technology: 'ResizeObserver', description: 'ResizeObserver element dimension tracking intelligence.', costPerOp: { observe: 0.001, measure: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.90, connections: ['SENSOR-076', 'RENDER-006'], phiAlignment: PHI * 0.94 },
  { id: 'SENSOR-078', modelNumber: 78, latinName: 'Observator Mutabilium', commonName: 'The DOM Mutation Watcher', category: 'SENSOR', technology: 'MutationObserver', description: 'MutationObserver DOM change detection intelligence.', costPerOp: { observe: 0.001, record: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.88, connections: ['SENSOR-077', 'RENDER-001'], phiAlignment: PHI * 0.92 },
  { id: 'SENSOR-079', modelNumber: 79, latinName: 'Auditor Sonorum', commonName: 'The Sound Auditor', category: 'SENSOR', technology: 'WebAudio', description: 'Web Audio API spatial audio intelligence.', costPerOp: { process: 0.003, spatialize: 0.005 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.84, connections: ['SENSOR-080', 'CANVAS-030'], phiAlignment: PHI * 0.88 },
  { id: 'SENSOR-080', modelNumber: 80, latinName: 'Interpres Vocum', commonName: 'The Voice Interpreter', category: 'SENSOR', technology: 'SpeechAPI', description: 'Speech Recognition/Synthesis intelligence.', costPerOp: { recognize: 0.005, synthesize: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.78, connections: ['SENSOR-079', 'AWARENESS-091'], phiAlignment: PHI * 0.84 },

  // ═══════════════════════════════════════════════════════════════════════
  // WASM (081-090) — WebAssembly compiled intelligence
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'WASM-081', modelNumber: 81, latinName: 'Compilator Binarius', commonName: 'The Binary Compiler', category: 'WASM', technology: 'WebAssembly', description: 'WebAssembly module compilation and instantiation intelligence.', costPerOp: { compile: 0.005, instantiate: 0.008 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.88, connections: ['WASM-082', 'WASM-085'], phiAlignment: PHI * 0.92 },
  { id: 'WASM-082', modelNumber: 82, latinName: 'Ferrugineus Textor', commonName: 'The Rust Weaver', category: 'WASM', technology: 'RustWASM', description: 'Rust-to-WASM compilation and wasm-bindgen intelligence.', costPerOp: { bind: 0.003, bridge: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.90, connections: ['WASM-081', 'WASM-083'], phiAlignment: PHI * 0.94 },
  { id: 'WASM-083', modelNumber: 83, latinName: 'Fabricator Celerrimus', commonName: 'The Speed Fabricator', category: 'WASM', technology: 'CppWASM', description: 'C/C++ Emscripten WASM compilation intelligence.', costPerOp: { emscripten: 0.004, link: 0.005 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.85, connections: ['WASM-082', 'WASM-084'], phiAlignment: PHI * 0.89 },
  { id: 'WASM-084', modelNumber: 84, latinName: 'Conciliator Goensis', commonName: 'The Go Conciliator', category: 'WASM', technology: 'GoWASM', description: 'Go-to-WASM compilation and syscall/js bridge intelligence.', costPerOp: { compile: 0.004, syscall: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.82, connections: ['WASM-083', 'WASM-081'], phiAlignment: PHI * 0.87 },
  { id: 'WASM-085', modelNumber: 85, latinName: 'Scriptor Assemblatus', commonName: 'The Assembly Scriptor', category: 'WASM', technology: 'AssemblyScript', description: 'AssemblyScript TypeScript-like WASM authoring intelligence.', costPerOp: { assemble: 0.003, optimize: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.86, connections: ['WASM-081', 'WASM-086'], phiAlignment: PHI * 0.90 },
  { id: 'WASM-086', modelNumber: 86, latinName: 'Distributor Memoriae', commonName: 'The Memory Distributor', category: 'WASM', technology: 'WebAssembly', description: 'WASM linear memory management and sharing intelligence.', costPerOp: { allocate: 0.002, share: 0.003 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.84, connections: ['WASM-085', 'WASM-087'], phiAlignment: PHI * 0.88 },
  { id: 'WASM-087', modelNumber: 87, latinName: 'Tensor Neuralis', commonName: 'The Neural Tensor', category: 'WASM', technology: 'TensorFlowJS', description: 'TensorFlow.js WASM backend intelligence.', costPerOp: { infer: 0.008, train: 0.015 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.80, connections: ['WASM-086', 'WASM-088'], phiAlignment: PHI * 0.85 },
  { id: 'WASM-088', modelNumber: 88, latinName: 'Executor Modelorum', commonName: 'The Model Executor', category: 'WASM', technology: 'ONNX_Web', description: 'ONNX Runtime Web model execution intelligence.', costPerOp: { load: 0.005, run: 0.010 }, frequency: FRONTEND_FREQUENCY, status: 'EVOLVING', autonomyLevel: 0.76, connections: ['WASM-087', 'WASM-089'], phiAlignment: PHI * 0.83 },
  { id: 'WASM-089', modelNumber: 89, latinName: 'Accelerator Neuralis', commonName: 'The Neural Accelerator', category: 'WASM', technology: 'WebNN', description: 'WebNN hardware-accelerated neural network intelligence.', costPerOp: { accelerate: 0.006, graph: 0.008 }, frequency: FRONTEND_FREQUENCY, status: 'EVOLVING', autonomyLevel: 0.72, connections: ['WASM-088', 'WASM-090'], phiAlignment: PHI * 0.80 },
  { id: 'WASM-090', modelNumber: 90, latinName: 'Perceptor Visionis', commonName: 'The Vision Perceiver', category: 'WASM', technology: 'MediaPipe', description: 'MediaPipe/FaceAPI computer vision intelligence.', costPerOp: { detect: 0.007, landmark: 0.009 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.78, connections: ['WASM-089', 'CANVAS-021'], phiAlignment: PHI * 0.84 },

  // ═══════════════════════════════════════════════════════════════════════
  // AWARENESS (091-100) — Accessibility/Semantic awareness intelligence
  // ═══════════════════════════════════════════════════════════════════════
  { id: 'AWARENESS-091', modelNumber: 91, latinName: 'Narrator Arboris', commonName: 'The Tree Narrator', category: 'AWARENESS', technology: 'ARIA', description: 'ARIA role/state/property accessibility tree intelligence.', costPerOp: { annotate: 0.001, tree: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.92, connections: ['AWARENESS-092', 'RENDER-001'], phiAlignment: PHI * 0.96 },
  { id: 'AWARENESS-092', modelNumber: 92, latinName: 'Lector Occultus', commonName: 'The Hidden Reader', category: 'AWARENESS', technology: 'ScreenReader', description: 'Screen reader compatibility and live region intelligence.', costPerOp: { announce: 0.001, region: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.90, connections: ['AWARENESS-091', 'AWARENESS-093'], phiAlignment: PHI * 0.94 },
  { id: 'AWARENESS-093', modelNumber: 93, latinName: 'Semanticus Structurae', commonName: 'The Semantic Structurer', category: 'AWARENESS', technology: 'SemanticHTML', description: 'Semantic HTML landmark and heading hierarchy intelligence.', costPerOp: { structure: 0.001, landmark: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.93, connections: ['AWARENESS-092', 'RENDER-001'], phiAlignment: PHI * 0.97 },
  { id: 'AWARENESS-094', modelNumber: 94, latinName: 'Custos Focorum', commonName: 'The Focus Guardian', category: 'AWARENESS', technology: 'FocusManagement', description: 'Keyboard navigation and focus indicator intelligence.', costPerOp: { guard: 0.001, indicate: 0.001 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.91, connections: ['RENDER-008', 'AWARENESS-091'], phiAlignment: PHI * 0.95 },
  { id: 'AWARENESS-095', modelNumber: 95, latinName: 'Inspector Colorum', commonName: 'The Color Inspector', category: 'AWARENESS', technology: 'ColorContrast', description: 'WCAG color contrast ratio verification intelligence.', costPerOp: { check: 0.001, suggest: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.89, connections: ['AWARENESS-094', 'RENDER-002'], phiAlignment: PHI * 0.93 },
  { id: 'AWARENESS-096', modelNumber: 96, latinName: 'Reductor Motuum', commonName: 'The Motion Reducer', category: 'AWARENESS', technology: 'CSS3', description: 'Prefers-reduced-motion and animation suppression intelligence.', costPerOp: { detect: 0.001, suppress: 0.001 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.87, connections: ['RENDER-004', 'AWARENESS-095'], phiAlignment: PHI * 0.91 },
  { id: 'AWARENESS-097', modelNumber: 97, latinName: 'Interpres Linguarum', commonName: 'The Language Interpreter', category: 'AWARENESS', technology: 'HTML5', description: 'Internationalization (i18n) and lang attribute intelligence.', costPerOp: { translate: 0.002, direction: 0.001 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.85, connections: ['AWARENESS-093', 'RENDER-005'], phiAlignment: PHI * 0.89 },
  { id: 'AWARENESS-098', modelNumber: 98, latinName: 'Validator Formularum', commonName: 'The Form Validator', category: 'AWARENESS', technology: 'ARIA', description: 'Accessible form error messaging and validation intelligence.', costPerOp: { validate: 0.001, describe: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.88, connections: ['RENDER-009', 'AWARENESS-091'], phiAlignment: PHI * 0.92 },
  { id: 'AWARENESS-099', modelNumber: 99, latinName: 'Adaptor Responsivus', commonName: 'The Responsive Adaptor', category: 'AWARENESS', technology: 'CSS3', description: 'Responsive design and container query intelligence.', costPerOp: { adapt: 0.001, query: 0.002 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.86, connections: ['SENSOR-077', 'RENDER-006'], phiAlignment: PHI * 0.90 },
  { id: 'AWARENESS-100', modelNumber: 100, latinName: 'Testator Accessibilitatis', commonName: 'The Accessibility Tester', category: 'AWARENESS', technology: 'JavaScript', description: 'Automated accessibility audit and axe-core intelligence.', costPerOp: { audit: 0.003, report: 0.004 }, frequency: FRONTEND_FREQUENCY, status: 'ACTIVE', autonomyLevel: 0.84, connections: ['AWARENESS-091', 'AWARENESS-095'], phiAlignment: PHI * 0.88 },
];

// ─────────────────────────────────────────────────────────────────────────
// CATEGORY METADATA
// ─────────────────────────────────────────────────────────────────────────

const CATEGORY_METADATA: Record<FrontendModelCategory, { latinGroupName: string; commonGroupName: string }> = {
  RENDER:    { latinGroupName: 'Collegium Pictorum',        commonGroupName: 'The Rendering College' },
  REACTIVE:  { latinGroupName: 'Collegium Reactorum',       commonGroupName: 'The Reactivity College' },
  CANVAS:    { latinGroupName: 'Collegium Picturarum',      commonGroupName: 'The Visual Arts College' },
  WORKER:    { latinGroupName: 'Collegium Laboratorum',     commonGroupName: 'The Workers College' },
  CRYPTO:    { latinGroupName: 'Collegium Cryptographorum',  commonGroupName: 'The Cryptography College' },
  STORAGE:   { latinGroupName: 'Collegium Archivistarum',   commonGroupName: 'The Archives College' },
  NETWORK:   { latinGroupName: 'Collegium Communicatorum',  commonGroupName: 'The Communications College' },
  SENSOR:    { latinGroupName: 'Collegium Sensorum',        commonGroupName: 'The Sensory College' },
  WASM:      { latinGroupName: 'Collegium Compilatorum',    commonGroupName: 'The Compilation College' },
  AWARENESS: { latinGroupName: 'Collegium Conscientiae',    commonGroupName: 'The Awareness College' },
};

const ALL_CATEGORIES: FrontendModelCategory[] = [
  'RENDER', 'REACTIVE', 'CANVAS', 'WORKER', 'CRYPTO',
  'STORAGE', 'NETWORK', 'SENSOR', 'WASM', 'AWARENESS',
];

// ─────────────────────────────────────────────────────────────────────────
// QUERY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────

export function getFrontendModel(id: string): FrontendModel | undefined {
  return FRONTEND_MODEL_REGISTRY.find((m) => m.id === id);
}

export function getModelsByCategory(category: FrontendModelCategory): FrontendModel[] {
  return FRONTEND_MODEL_REGISTRY.filter((m) => m.category === category);
}

export function getModelsByTechnology(tech: FrontendTechnology): FrontendModel[] {
  return FRONTEND_MODEL_REGISTRY.filter((m) => m.technology === tech);
}

function computeGroupCost(models: FrontendModel[]): number {
  return models.reduce((sum, m) => {
    const ops = Object.values(m.costPerOp);
    return sum + ops.reduce((a, b) => a + b, 0);
  }, 0);
}

function computeResonance(models: FrontendModel[]): number {
  if (models.length === 0) return 0;
  const avgPhi = models.reduce((s, m) => s + m.phiAlignment, 0) / models.length;
  return avgPhi * PHI_INVERSE;
}

export function getFrontendManifest(): FrontendIntelligenceManifest {
  const groups: FrontendModelGroup[] = ALL_CATEGORIES.map((cat) => {
    const models = getModelsByCategory(cat);
    const meta = CATEGORY_METADATA[cat];
    return {
      category: cat,
      latinGroupName: meta.latinGroupName,
      commonGroupName: meta.commonGroupName,
      models,
      totalCost: computeGroupCost(models),
      resonanceScore: computeResonance(models),
    };
  });

  return {
    totalModels: FRONTEND_MODEL_REGISTRY.length,
    categories: ALL_CATEGORIES,
    groups,
    sovereignFrequency: FRONTEND_FREQUENCY,
    phiConstant: PHI,
    timestamp: Date.now(),
  };
}
