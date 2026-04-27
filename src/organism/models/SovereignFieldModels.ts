// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * SOVEREIGN FIELD MODELS — 120 FIELD INTELLIGENCE UNITS
 * ─────────────────────────────────────────────────────────────────────────────
 * 12 sovereign domains × 10 field models each = 120 total
 *
 * Each domain is a sovereign field of directed intelligence.
 * Each model within a domain is a named, Latin-named intelligence unit
 * with a specific function. Together they form the complete field layer
 * of the MEDINA organism.
 *
 * DOMAINS:
 *   I.   STREAMS_SOVEREIGN   — Fluvius Regalis    (directed data flow)
 *   II.  WEBRTC_SOVEREIGN    — Nexus Directus     (peer-to-peer intelligence)
 *   III. COMPONENTS_SOVEREIGN — Corpus Modulare   (self-contained units)
 *   IV.  WORKERS_SOVEREIGN   — Exercitus Parallelus (parallel execution)
 *   V.   OBSERVERS_SOVEREIGN — Sensum Perpetuum   (perpetual sensing)
 *   VI.  CANVAS_SOVEREIGN    — Campus Pictoris    (pixel-level drawing)
 *   VII. SVG_SOVEREIGN       — Geometria Viva     (infinite-resolution geometry)
 *   VIII.XR_SOVEREIGN        — Praesentia Extensa (extended reality)
 *   IX.  WASM_SOVEREIGN      — Machina Pura       (bare-metal computation)
 *   X.   AUDIO_SOVEREIGN     — Anima Sonans       (sound as intelligence)
 *   XI.  GPU_SOVEREIGN       — Machina Massiva    (parallel GPU compute)
 *   XII. GL_SOVEREIGN        — Lux Prima          (math to photons)
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type SovereignDomain =
  | 'STREAMS_SOVEREIGN'
  | 'WEBRTC_SOVEREIGN'
  | 'COMPONENTS_SOVEREIGN'
  | 'WORKERS_SOVEREIGN'
  | 'OBSERVERS_SOVEREIGN'
  | 'CANVAS_SOVEREIGN'
  | 'SVG_SOVEREIGN'
  | 'XR_SOVEREIGN'
  | 'WASM_SOVEREIGN'
  | 'AUDIO_SOVEREIGN'
  | 'GPU_SOVEREIGN'
  | 'GL_SOVEREIGN';

export interface FieldModel {
  /** Sovereign code name e.g. FLOW_READER */
  id: string;
  /** Latin name e.g. Lector Fluvii */
  latinName: string;
  /** Human description of what it does */
  description: string;
  /** Parent sovereign domain */
  domain: SovereignDomain;
  /** Position within domain (1–10) */
  rank: number;
  /** UI accent color */
  color: string;
}

export interface SovereignFieldDomain {
  id: SovereignDomain;
  latinName: string;
  tagline: string;
  models: FieldModel[];
}

// ─────────────────────────────────────────────────────────────────────────────
// I. STREAMS_SOVEREIGN — Fluvius Regalis
// ─────────────────────────────────────────────────────────────────────────────

export const STREAMS_SOVEREIGN: SovereignFieldDomain = {
  id: 'STREAMS_SOVEREIGN',
  latinName: 'Fluvius Regalis',
  tagline: 'The field of directed data flow. Water with intelligence.',
  models: [
    { id: 'FLOW_READER',        latinName: 'Lector Fluvii',      description: 'Pulls data from any source into the organism in real time.',                               domain: 'STREAMS_SOVEREIGN', rank: 1,  color: '#3b82f6' },
    { id: 'FLOW_WRITER',        latinName: 'Scriptor Fluvii',    description: "Pushes the organism's output anywhere, continuously.",                                    domain: 'STREAMS_SOVEREIGN', rank: 2,  color: '#2563eb' },
    { id: 'FLOW_TRANSFORMER',   latinName: 'Mutator Fluvii',     description: 'Intercepts data mid-flow and reshapes it before it arrives.',                             domain: 'STREAMS_SOVEREIGN', rank: 3,  color: '#1d4ed8' },
    { id: 'FLOW_PIPE',          latinName: 'Canalis Primus',     description: 'Chains readers and writers so data moves without stopping.',                              domain: 'STREAMS_SOVEREIGN', rank: 4,  color: '#1e40af' },
    { id: 'FLOW_SPLITTER',      latinName: 'Divisor Fluvii',     description: 'Splits one stream into many parallel streams simultaneously.',                            domain: 'STREAMS_SOVEREIGN', rank: 5,  color: '#1e3a8a' },
    { id: 'FLOW_MERGER',        latinName: 'Confluens',          description: 'Merges multiple streams into one unified output.',                                        domain: 'STREAMS_SOVEREIGN', rank: 6,  color: '#312e81' },
    { id: 'BYTE_SOVEREIGN',     latinName: 'Octetus Rex',        description: 'Handles raw binary — audio, video, file data at byte level.',                            domain: 'STREAMS_SOVEREIGN', rank: 7,  color: '#4338ca' },
    { id: 'BACKPRESSURE_ENGINE', latinName: 'Resistor Fluvii',  description: 'Slows intake when the organism is at capacity — no overflow.',                            domain: 'STREAMS_SOVEREIGN', rank: 8,  color: '#4f46e5' },
    { id: 'ABORT_SOVEREIGN',    latinName: 'Terminator Fluvii',  description: 'Cancels any stream cleanly mid-flow, no leaks.',                                         domain: 'STREAMS_SOVEREIGN', rank: 9,  color: '#6366f1' },
    { id: 'TEED_FIELD',         latinName: 'Geminus Fluvii',     description: 'Duplicates a live stream — one source, two independent readers.',                        domain: 'STREAMS_SOVEREIGN', rank: 10, color: '#818cf8' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// II. WEBRTC_SOVEREIGN — Nexus Directus
// ─────────────────────────────────────────────────────────────────────────────

export const WEBRTC_SOVEREIGN: SovereignFieldDomain = {
  id: 'WEBRTC_SOVEREIGN',
  latinName: 'Nexus Directus',
  tagline: 'Two organisms finding each other and talking directly. No server in the middle.',
  models: [
    { id: 'PEER_FIELD',         latinName: 'Campus Parium',       description: 'Opens a direct channel between two sovereign intelligences.',                             domain: 'WEBRTC_SOVEREIGN', rank: 1,  color: '#10b981' },
    { id: 'ICE_NAVIGATOR',      latinName: 'Navigator Glaciei',   description: 'Finds the fastest path through any network to the other side.',                          domain: 'WEBRTC_SOVEREIGN', rank: 2,  color: '#059669' },
    { id: 'SDP_CODEX',          latinName: 'Codex Sessionis',     description: 'The handshake document — two fields agreeing on how to talk.',                           domain: 'WEBRTC_SOVEREIGN', rank: 3,  color: '#047857' },
    { id: 'DATA_CHANNEL',       latinName: 'Canalis Datae',       description: 'Sends any data peer-to-peer — no server, no latency.',                                   domain: 'WEBRTC_SOVEREIGN', rank: 4,  color: '#065f46' },
    { id: 'TRACK_SOVEREIGN',    latinName: 'Tractus Medii',       description: 'Carries live audio or video between peers in real time.',                                 domain: 'WEBRTC_SOVEREIGN', rank: 5,  color: '#064e3b' },
    { id: 'STUN_FINDER',        latinName: 'Explorator Retis',    description: "Discovers the organism's real network address from outside.",                            domain: 'WEBRTC_SOVEREIGN', rank: 6,  color: '#14532d' },
    { id: 'TURN_RELAY',         latinName: 'Relais Transitum',    description: 'Routes traffic when direct peer connection is blocked.',                                  domain: 'WEBRTC_SOVEREIGN', rank: 7,  color: '#166534' },
    { id: 'MEDIA_CAPTURE',      latinName: 'Captor Medii',        description: 'Grabs mic, camera, or screen as a live sovereign input.',                                 domain: 'WEBRTC_SOVEREIGN', rank: 8,  color: '#15803d' },
    { id: 'CONNECTION_MONITOR', latinName: 'Custos Nexus',        description: 'Watches link quality and fires alerts when signal degrades.',                             domain: 'WEBRTC_SOVEREIGN', rank: 9,  color: '#16a34a' },
    { id: 'MULTIPARTY_MESH',    latinName: 'Retis Multiplex',     description: 'Connects many peers simultaneously — swarm communication.',                               domain: 'WEBRTC_SOVEREIGN', rank: 10, color: '#22c55e' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// III. COMPONENTS_SOVEREIGN — Corpus Modulare
// ─────────────────────────────────────────────────────────────────────────────

export const COMPONENTS_SOVEREIGN: SovereignFieldDomain = {
  id: 'COMPONENTS_SOVEREIGN',
  latinName: 'Corpus Modulare',
  tagline: 'Self-contained sovereign intelligence units that live anywhere on the page.',
  models: [
    { id: 'ELEMENT_GENESIS',    latinName: 'Genesis Elementi',      description: 'Creates a brand new HTML element with sovereign behavior.',                             domain: 'COMPONENTS_SOVEREIGN', rank: 1,  color: '#f59e0b' },
    { id: 'SHADOW_FIELD',       latinName: 'Campus Umbrae',         description: "Wraps a component's internals — nothing outside can touch it.",                        domain: 'COMPONENTS_SOVEREIGN', rank: 2,  color: '#d97706' },
    { id: 'TEMPLATE_CODEX',     latinName: 'Codex Formae',          description: 'Holds dormant HTML structure, stamped to life when called.',                           domain: 'COMPONENTS_SOVEREIGN', rank: 3,  color: '#b45309' },
    { id: 'SLOT_RECEIVER',      latinName: 'Receptor Loci',         description: 'Opens a port in a component where outside content flows in.',                          domain: 'COMPONENTS_SOVEREIGN', rank: 4,  color: '#92400e' },
    { id: 'LIFECYCLE_ENGINE',   latinName: 'Motor Vitae',           description: 'Fires intelligence when a component is born, changed, or dies.',                       domain: 'COMPONENTS_SOVEREIGN', rank: 5,  color: '#78350f' },
    { id: 'STYLE_ADOPTANT',     latinName: 'Adoptator Stili',       description: 'Shares styles across shadow boundaries without leaking.',                              domain: 'COMPONENTS_SOVEREIGN', rank: 6,  color: '#451a03' },
    { id: 'ATTRIBUTE_OBSERVER', latinName: 'Custos Attributi',      description: "Watches an element's attributes and reacts when they change.",                        domain: 'COMPONENTS_SOVEREIGN', rank: 7,  color: '#7c2d12' },
    { id: 'REGISTRY_SOVEREIGN', latinName: 'Registrum Elementorum', description: 'The master ledger of every custom element in the organism.',                          domain: 'COMPONENTS_SOVEREIGN', rank: 8,  color: '#9a3412' },
    { id: 'UPGRADE_ENGINE',     latinName: 'Motor Ascensus',        description: 'Turns a plain HTML element into a living sovereign component.',                        domain: 'COMPONENTS_SOVEREIGN', rank: 9,  color: '#c2410c' },
    { id: 'PART_EXPOSER',       latinName: 'Expositor Partis',      description: 'Lets outside styles target specific internals of a shadow DOM.',                       domain: 'COMPONENTS_SOVEREIGN', rank: 10, color: '#ea580c' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// IV. WORKERS_SOVEREIGN — Exercitus Parallelus
// ─────────────────────────────────────────────────────────────────────────────

export const WORKERS_SOVEREIGN: SovereignFieldDomain = {
  id: 'WORKERS_SOVEREIGN',
  latinName: 'Exercitus Parallelus',
  tagline: 'Parallel sovereign execution. The organism running many minds at once.',
  models: [
    { id: 'DEDICATED_WORKER',  latinName: 'Miles Solitarius',   description: 'One background mind doing heavy work — UI never freezes.',                                  domain: 'WORKERS_SOVEREIGN', rank: 1,  color: '#ec4899' },
    { id: 'SHARED_WORKER',     latinName: 'Miles Communis',     description: 'One worker shared across every tab — single source of truth.',                              domain: 'WORKERS_SOVEREIGN', rank: 2,  color: '#db2777' },
    { id: 'SERVICE_SENTINEL',  latinName: 'Sentinella Servitii', description: 'Lives between the organism and the network — intercepts all requests.',                   domain: 'WORKERS_SOVEREIGN', rank: 3,  color: '#be185d' },
    { id: 'WORKLET_PRIME',     latinName: 'Primum Opificium',   description: 'Lightweight worker that runs at the render pipeline level.',                                domain: 'WORKERS_SOVEREIGN', rank: 4,  color: '#9d174d' },
    { id: 'MODULE_WORKER',     latinName: 'Miles Modularis',    description: 'Worker with full ES module support — clean, typed, sovereign.',                             domain: 'WORKERS_SOVEREIGN', rank: 5,  color: '#831843' },
    { id: 'ATOMICS_FIELD',     latinName: 'Campus Atomicus',    description: "Locks shared memory so parallel workers don't corrupt each other.",                        domain: 'WORKERS_SOVEREIGN', rank: 6,  color: '#500724' },
    { id: 'SHARED_BUFFER',     latinName: 'Memoria Communis',   description: 'Raw memory that multiple workers read/write simultaneously.',                               domain: 'WORKERS_SOVEREIGN', rank: 7,  color: '#701a75' },
    { id: 'WORKER_POOL',       latinName: 'Piscina Militum',    description: 'A fleet of workers — distribute one job across many minds.',                               domain: 'WORKERS_SOVEREIGN', rank: 8,  color: '#86198f' },
    { id: 'MESSAGE_BRIDGE',    latinName: 'Pons Nuntiorum',     description: 'The channel workers use to talk to the main thread and each other.',                       domain: 'WORKERS_SOVEREIGN', rank: 9,  color: '#a21caf' },
    { id: 'TRANSFER_ENGINE',   latinName: 'Motor Translationis', description: 'Moves data between workers with zero copy — pure speed.',                                 domain: 'WORKERS_SOVEREIGN', rank: 10, color: '#c026d3' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// V. OBSERVERS_SOVEREIGN — Sensum Perpetuum
// ─────────────────────────────────────────────────────────────────────────────

export const OBSERVERS_SOVEREIGN: SovereignFieldDomain = {
  id: 'OBSERVERS_SOVEREIGN',
  latinName: 'Sensum Perpetuum',
  tagline: "The organism's nervous system. It perceives without asking.",
  models: [
    { id: 'INTERSECTION_EYE',    latinName: 'Oculus Sectionis',   description: 'Knows exactly when any element enters or leaves the viewport.',                          domain: 'OBSERVERS_SOVEREIGN', rank: 1,  color: '#a855f7' },
    { id: 'RESIZE_NERVE',        latinName: 'Nervus Magnitudinis', description: 'Fires the instant any element changes size.',                                            domain: 'OBSERVERS_SOVEREIGN', rank: 2,  color: '#9333ea' },
    { id: 'MUTATION_NERVE',      latinName: 'Nervus Mutationis',  description: 'Detects every change to the DOM — attributes, children, text.',                          domain: 'OBSERVERS_SOVEREIGN', rank: 3,  color: '#7e22ce' },
    { id: 'PERFORMANCE_EYE',     latinName: 'Oculus Performae',   description: "Watches the organism's own speed — every frame, every load.",                           domain: 'OBSERVERS_SOVEREIGN', rank: 4,  color: '#6b21a8' },
    { id: 'REPORTING_EYE',       latinName: 'Oculus Relationis',  description: 'Catches errors, security violations, deprecations silently.',                             domain: 'OBSERVERS_SOVEREIGN', rank: 5,  color: '#581c87' },
    { id: 'VISIBILITY_SOVEREIGN', latinName: 'Rex Visibilitatis', description: 'Knows when the page is hidden, backgrounded, or inactive.',                              domain: 'OBSERVERS_SOVEREIGN', rank: 6,  color: '#3b0764' },
    { id: 'FOCUS_OBSERVER',      latinName: 'Custos Foci',        description: 'Tracks focus movement through the entire document.',                                      domain: 'OBSERVERS_SOVEREIGN', rank: 7,  color: '#4c1d95' },
    { id: 'IDLE_DETECTOR',       latinName: 'Detector Otii',      description: 'Knows when the user is idle — organism can shift priorities.',                           domain: 'OBSERVERS_SOVEREIGN', rank: 8,  color: '#5b21b6' },
    { id: 'ENTRY_TIMING',        latinName: 'Temporis Ingressus', description: 'Measures exactly how long any observed event took.',                                      domain: 'OBSERVERS_SOVEREIGN', rank: 9,  color: '#6d28d9' },
    { id: 'THRESHOLD_FIELD',     latinName: 'Campus Liminis',     description: 'Fires at precise visibility percentages — 25%, 50%, 75%, 100%.',                         domain: 'OBSERVERS_SOVEREIGN', rank: 10, color: '#7c3aed' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// VI. CANVAS_SOVEREIGN — Campus Pictoris
// ─────────────────────────────────────────────────────────────────────────────

export const CANVAS_SOVEREIGN: SovereignFieldDomain = {
  id: 'CANVAS_SOVEREIGN',
  latinName: 'Campus Pictoris',
  tagline: 'The coordinate field where the organism draws its world pixel by pixel.',
  models: [
    { id: 'CONTEXT_PRIME',     latinName: 'Contextus Primus',      description: "Opens the 2D drawing field — the organism's drawing surface.",                          domain: 'CANVAS_SOVEREIGN', rank: 1,  color: '#14b8a6' },
    { id: 'PATH_SOVEREIGN',    latinName: 'Via Regalis',           description: 'Draws any shape — lines, curves, arcs — as a field trace.',                            domain: 'CANVAS_SOVEREIGN', rank: 2,  color: '#0d9488' },
    { id: 'PIXEL_FIELD',       latinName: 'Campus Pixelis',        description: 'Direct read/write access to every individual pixel.',                                   domain: 'CANVAS_SOVEREIGN', rank: 3,  color: '#0f766e' },
    { id: 'COMPOSITE_ENGINE',  latinName: 'Motor Compositus',      description: 'Controls how layers blend — multiply, screen, overlay, etc.',                           domain: 'CANVAS_SOVEREIGN', rank: 4,  color: '#115e59' },
    { id: 'OFFSCREEN_MIND',    latinName: 'Mens Absconsa',         description: 'Draws in a background worker — zero UI thread cost.',                                   domain: 'CANVAS_SOVEREIGN', rank: 5,  color: '#134e4a' },
    { id: 'BITMAP_SOVEREIGN',  latinName: 'Rex Imaginis',          description: 'Handles decoded image data as a raw intelligence surface.',                             domain: 'CANVAS_SOVEREIGN', rank: 6,  color: '#042f2e' },
    { id: 'GRADIENT_FIELD',    latinName: 'Campus Gradientis',     description: 'Generates color transitions as spatial field expressions.',                             domain: 'CANVAS_SOVEREIGN', rank: 7,  color: '#164e63' },
    { id: 'CLIP_SOVEREIGN',    latinName: 'Decusor Regionis',      description: 'Masks the draw surface — only specific regions receive paint.',                         domain: 'CANVAS_SOVEREIGN', rank: 8,  color: '#155e75' },
    { id: 'TRANSFORM_MATRIX',  latinName: 'Matrix Transformationis', description: 'Scales, rotates, skews the entire coordinate field.',                                domain: 'CANVAS_SOVEREIGN', rank: 9,  color: '#0e7490' },
    { id: 'HIT_DETECTOR',      latinName: 'Detector Contactus',    description: 'Knows if a point touches any drawn path — spatial intelligence.',                       domain: 'CANVAS_SOVEREIGN', rank: 10, color: '#0891b2' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// VII. SVG_SOVEREIGN — Geometria Viva
// ─────────────────────────────────────────────────────────────────────────────

export const SVG_SOVEREIGN: SovereignFieldDomain = {
  id: 'SVG_SOVEREIGN',
  latinName: 'Geometria Viva',
  tagline: 'Infinite resolution geometry. Mathematical truth expressed visually.',
  models: [
    { id: 'FILTER_SOVEREIGN',   latinName: 'Rex Filtri',           description: 'Applies blur, glow, distortion, shadow at the math level.',                            domain: 'SVG_SOVEREIGN', rank: 1,  color: '#f43f5e' },
    { id: 'MASK_FIELD',         latinName: 'Campus Larvae',        description: 'Uses one shape to reveal or hide another — luminance masking.',                         domain: 'SVG_SOVEREIGN', rank: 2,  color: '#e11d48' },
    { id: 'CLIP_PATH',          latinName: 'Via Incisura',         description: 'Hard cuts a shape from any element — pixel perfect.',                                   domain: 'SVG_SOVEREIGN', rank: 3,  color: '#be123c' },
    { id: 'GRADIENT_VECTOR',    latinName: 'Vectus Coloris',       description: 'Color fields along a path — not pixels, pure math.',                                    domain: 'SVG_SOVEREIGN', rank: 4,  color: '#9f1239' },
    { id: 'ANIMATE_SOVEREIGN',  latinName: 'Motor Animationis',    description: 'Moves SVG properties along time — native, no JavaScript.',                              domain: 'SVG_SOVEREIGN', rank: 5,  color: '#881337' },
    { id: 'VIEWBOX_FIELD',      latinName: 'Campus Visus',         description: 'Infinite zoom — the coordinate space scales to any size.',                              domain: 'SVG_SOVEREIGN', rank: 6,  color: '#4c0519' },
    { id: 'FOREIGN_PORTAL',     latinName: 'Porta Aliena',         description: 'Embeds HTML inside SVG — two worlds in one coordinate space.',                          domain: 'SVG_SOVEREIGN', rank: 7,  color: '#7f1d1d' },
    { id: 'SYMBOL_BANK',        latinName: 'Thesaurus Symbolorum', description: 'Define once, stamp anywhere — sovereign reusable geometry.',                           domain: 'SVG_SOVEREIGN', rank: 8,  color: '#991b1b' },
    { id: 'MARKER_ENGINE',      latinName: 'Motor Signorum',       description: 'Attaches arrowheads, dots, symbols to path endpoints.',                                 domain: 'SVG_SOVEREIGN', rank: 9,  color: '#b91c1c' },
    { id: 'TEXT_PATH',          latinName: 'Via Litterarum',       description: 'Flows text along any curve — text follows the field.',                                  domain: 'SVG_SOVEREIGN', rank: 10, color: '#dc2626' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// VIII. XR_SOVEREIGN — Praesentia Extensa
// ─────────────────────────────────────────────────────────────────────────────

export const XR_SOVEREIGN: SovereignFieldDomain = {
  id: 'XR_SOVEREIGN',
  latinName: 'Praesentia Extensa',
  tagline: 'The organism extending its body into physical space.',
  models: [
    { id: 'SESSION_SOVEREIGN',  latinName: 'Rex Sessionis',       description: 'Opens AR or VR mode — organism enters the physical field.',                              domain: 'XR_SOVEREIGN', rank: 1,  color: '#06b6d4' },
    { id: 'REFERENCE_SPACE',    latinName: 'Spatium Referentiae', description: "Anchors the organism's coordinate system to real-world space.",                         domain: 'XR_SOVEREIGN', rank: 2,  color: '#0891b2' },
    { id: 'INPUT_SOVEREIGN',    latinName: 'Rex Inputus',         description: 'Reads controllers, hands, and gaze as sovereign inputs.',                                domain: 'XR_SOVEREIGN', rank: 3,  color: '#0e7490' },
    { id: 'HAND_FIELD',         latinName: 'Campus Manus',        description: 'Full 25-joint hand tracking — hands become intelligence inputs.',                        domain: 'XR_SOVEREIGN', rank: 4,  color: '#155e75' },
    { id: 'HIT_TESTER',         latinName: 'Explorator Contactus', description: 'Fires a ray into the real world and finds what it hits.',                              domain: 'XR_SOVEREIGN', rank: 5,  color: '#164e63' },
    { id: 'ANCHOR_ENGINE',      latinName: 'Motor Anchorae',      description: 'Pins virtual objects to real-world positions permanently.',                               domain: 'XR_SOVEREIGN', rank: 6,  color: '#083344' },
    { id: 'LAYER_COMPOSER',     latinName: 'Compositor Stratorum', description: 'Stacks XR rendering layers for depth and performance.',                                 domain: 'XR_SOVEREIGN', rank: 7,  color: '#0c4a6e' },
    { id: 'POSE_READER',        latinName: 'Lector Positurae',    description: 'Reads exact head, hand, and body position every frame.',                                 domain: 'XR_SOVEREIGN', rank: 8,  color: '#075985' },
    { id: 'VIEWPORT_XR',        latinName: 'Visus Extensus',      description: 'Manages dual-eye rendering — left and right independently.',                             domain: 'XR_SOVEREIGN', rank: 9,  color: '#0369a1' },
    { id: 'WORLD_SENSOR',       latinName: 'Sensor Mundi',        description: 'Reads real-world light, planes, and surfaces into the organism.',                        domain: 'XR_SOVEREIGN', rank: 10, color: '#0284c7' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// IX. WASM_SOVEREIGN — Machina Pura
// ─────────────────────────────────────────────────────────────────────────────

export const WASM_SOVEREIGN: SovereignFieldDomain = {
  id: 'WASM_SOVEREIGN',
  latinName: 'Machina Pura',
  tagline: "Sovereign computation at bare-metal speed inside the browser. The organism's inner engine.",
  models: [
    { id: 'MODULE_PRIME',       latinName: 'Modulus Primus',       description: 'The compiled WASM binary — a sovereign executable unit.',                               domain: 'WASM_SOVEREIGN', rank: 1,  color: '#22d3ee' },
    { id: 'INSTANCE_ENGINE',    latinName: 'Motor Instantiae',     description: 'Runs the module with its own isolated memory and state.',                               domain: 'WASM_SOVEREIGN', rank: 2,  color: '#06b6d4' },
    { id: 'MEMORY_FIELD',       latinName: 'Campus Memoriae',      description: "Raw linear memory — the organism's direct RAM access.",                                 domain: 'WASM_SOVEREIGN', rank: 3,  color: '#0891b2' },
    { id: 'TABLE_SOVEREIGN',    latinName: 'Mensa Regalis',        description: 'Holds function references — callable intelligence pointers.',                           domain: 'WASM_SOVEREIGN', rank: 4,  color: '#0e7490' },
    { id: 'IMPORT_BRIDGE',      latinName: 'Pons Importi',         description: 'Lets WASM call JavaScript functions — two substrates talking.',                         domain: 'WASM_SOVEREIGN', rank: 5,  color: '#155e75' },
    { id: 'EXPORT_GATE',        latinName: 'Porta Exporti',        description: 'Exposes WASM functions to JavaScript — sovereignty flows out.',                         domain: 'WASM_SOVEREIGN', rank: 6,  color: '#164e63' },
    { id: 'SIMD_ENGINE',        latinName: 'Motor Parallelus',     description: 'Runs 4–8 operations in one instruction — pure computation speed.',                     domain: 'WASM_SOVEREIGN', rank: 7,  color: '#083344' },
    { id: 'THREAD_SOVEREIGN',   latinName: 'Rex Filorum',          description: 'Parallel WASM threads sharing one memory field simultaneously.',                        domain: 'WASM_SOVEREIGN', rank: 8,  color: '#0c4a6e' },
    { id: 'EXCEPTION_FIELD',    latinName: 'Campus Exceptionis',   description: 'Native WASM error handling — no JavaScript overhead.',                                  domain: 'WASM_SOVEREIGN', rank: 9,  color: '#075985' },
    { id: 'GC_SOVEREIGN',       latinName: 'Rex Collectionis',     description: 'Manages WASM objects that live alongside JavaScript — unified memory.',                 domain: 'WASM_SOVEREIGN', rank: 10, color: '#0369a1' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// X. AUDIO_SOVEREIGN — Anima Sonans
// ─────────────────────────────────────────────────────────────────────────────

export const AUDIO_SOVEREIGN: SovereignFieldDomain = {
  id: 'AUDIO_SOVEREIGN',
  latinName: 'Anima Sonans',
  tagline: "The organism's voice and hearing. Sound as intelligence moving through time.",
  models: [
    { id: 'CONTEXT_AUDIO',        latinName: 'Contextus Sonicus',   description: 'The master audio field — everything runs through this.',                               domain: 'AUDIO_SOVEREIGN', rank: 1,  color: '#f97316' },
    { id: 'ANALYSER_FIELD',       latinName: 'Campus Analysoris',   description: 'Real-time FFT — turns sound into visual intelligence data.',                          domain: 'AUDIO_SOVEREIGN', rank: 2,  color: '#ea580c' },
    { id: 'OSCILLATOR_PRIME',     latinName: 'Oscillator Primus',   description: "Generates pure tones — the organism's voice from nothing.",                           domain: 'AUDIO_SOVEREIGN', rank: 3,  color: '#c2410c' },
    { id: 'CONVOLVER_SOVEREIGN',  latinName: 'Rex Convoluti',       description: "Applies real-space acoustics — rooms, halls, distances.",                              domain: 'AUDIO_SOVEREIGN', rank: 4,  color: '#9a3412' },
    { id: 'FILTER_AUDIO',         latinName: 'Filtrum Sonicum',     description: "Cuts or boosts frequencies — shapes the organism's sound.",                           domain: 'AUDIO_SOVEREIGN', rank: 5,  color: '#7c2d12' },
    { id: 'DYNAMICS_ENGINE',      latinName: 'Motor Dynamicus',     description: 'Compresses, limits, gates audio — controls signal power.',                             domain: 'AUDIO_SOVEREIGN', rank: 6,  color: '#431407' },
    { id: 'PANNER_FIELD',         latinName: 'Campus Locatus',      description: 'Places sound in 3D space — left, right, near, far.',                                  domain: 'AUDIO_SOVEREIGN', rank: 7,  color: '#78350f' },
    { id: 'WORKLET_AUDIO',        latinName: 'Opificium Sonicum',   description: 'Custom audio processing at sample level — deepest access.',                           domain: 'AUDIO_SOVEREIGN', rank: 8,  color: '#92400e' },
    { id: 'PARAM_AUTOMATION',     latinName: 'Automatio Parametri', description: 'Schedules parameter changes with frame-perfect timing.',                              domain: 'AUDIO_SOVEREIGN', rank: 9,  color: '#b45309' },
    { id: 'BUFFER_SOVEREIGN',     latinName: 'Rex Bufferi',         description: 'Holds decoded audio as raw sample data — direct playback.',                            domain: 'AUDIO_SOVEREIGN', rank: 10, color: '#d97706' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// XI. GPU_SOVEREIGN — Machina Massiva
// ─────────────────────────────────────────────────────────────────────────────

export const GPU_SOVEREIGN: SovereignFieldDomain = {
  id: 'GPU_SOVEREIGN',
  latinName: 'Machina Massiva',
  tagline: "Thousands of execution units running in parallel. The organism's most powerful compute field.",
  models: [
    { id: 'DEVICE_PRIME',       latinName: 'Primum Instrumentum',  description: 'The gateway to the GPU — all operations flow through here.',                            domain: 'GPU_SOVEREIGN', rank: 1,  color: '#8b5cf6' },
    { id: 'COMMAND_ENCODER',    latinName: 'Scriptor Mandatorum',  description: 'Records every GPU instruction before sending — batched execution.',                     domain: 'GPU_SOVEREIGN', rank: 2,  color: '#7c3aed' },
    { id: 'RENDER_PIPELINE',    latinName: 'Canalis Redditionis',  description: 'The full vertex-to-pixel rendering sequence as one sovereign object.',                  domain: 'GPU_SOVEREIGN', rank: 3,  color: '#6d28d9' },
    { id: 'COMPUTE_PIPELINE',   latinName: 'Canalis Computationis', description: 'Runs massively parallel computation with no rendering — pure GPU intelligence.',       domain: 'GPU_SOVEREIGN', rank: 4,  color: '#5b21b6' },
    { id: 'BIND_GROUP',         latinName: 'Coetus Vinculi',       description: 'Connects data (buffers, textures) to shaders — resource binding.',                      domain: 'GPU_SOVEREIGN', rank: 5,  color: '#4c1d95' },
    { id: 'SHADER_MODULE',      latinName: 'Modulus Umbrae',       description: 'WGSL shader code compiled to GPU instructions — the intelligence kernel.',              domain: 'GPU_SOVEREIGN', rank: 6,  color: '#3b0764' },
    { id: 'BUFFER_GPU',         latinName: 'Memoria Graphica',     description: 'GPU-side memory — vertex data, uniforms, compute results.',                             domain: 'GPU_SOVEREIGN', rank: 7,  color: '#4338ca' },
    { id: 'TEXTURE_SOVEREIGN',  latinName: 'Rex Texturae',         description: 'Image data on the GPU — sampled by shaders at full speed.',                             domain: 'GPU_SOVEREIGN', rank: 8,  color: '#4f46e5' },
    { id: 'SAMPLER_FIELD',      latinName: 'Campus Sampleri',      description: 'Defines how textures are read — filtering, wrapping, interpolation.',                   domain: 'GPU_SOVEREIGN', rank: 9,  color: '#6366f1' },
    { id: 'COMPUTE_SHADER',     latinName: 'Umbra Computans',      description: 'The most powerful model here — arbitrary parallel math on the GPU at scale.',           domain: 'GPU_SOVEREIGN', rank: 10, color: '#818cf8' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// XII. GL_SOVEREIGN — Lux Prima
// ─────────────────────────────────────────────────────────────────────────────

export const GL_SOVEREIGN: SovereignFieldDomain = {
  id: 'GL_SOVEREIGN',
  latinName: 'Lux Prima',
  tagline: "Where math becomes photons. The organism's direct line to the GPU field.",
  models: [
    { id: 'VERTEX_SOVEREIGN',    latinName: 'Rex Verticis',                description: 'Positions every point in 3D space — geometry is born here.',                   domain: 'GL_SOVEREIGN', rank: 1,  color: '#e879f9' },
    { id: 'FRAGMENT_SOVEREIGN',  latinName: 'Rex Fragmenti',               description: 'Colors every pixel — where the world gets its skin.',                           domain: 'GL_SOVEREIGN', rank: 2,  color: '#d946ef' },
    { id: 'VAO_FIELD',           latinName: 'Campus Attributi',            description: 'Remembers all vertex configurations — no repeat binding.',                      domain: 'GL_SOVEREIGN', rank: 3,  color: '#c026d3' },
    { id: 'FBO_SOVEREIGN',       latinName: 'Rex Bufferis Formae',         description: 'Renders to a texture instead of screen — recursive world building.',            domain: 'GL_SOVEREIGN', rank: 4,  color: '#a21caf' },
    { id: 'UBO_ENGINE',          latinName: 'Motor Uniformis',             description: 'Shares data across all shaders at once — one update, all know.',                domain: 'GL_SOVEREIGN', rank: 5,  color: '#86198f' },
    { id: 'INSTANCED_FIELD',     latinName: 'Campus Instantiarum',         description: 'Draws thousands of identical objects in one GPU call.',                          domain: 'GL_SOVEREIGN', rank: 6,  color: '#701a75' },
    { id: 'TRANSFORM_FEEDBACK',  latinName: 'Retroactus Transformationis', description: 'Captures vertex shader output back into a buffer — GPU feeds itself.',          domain: 'GL_SOVEREIGN', rank: 7,  color: '#500724' },
    { id: 'TEXTURE_ENGINE',      latinName: 'Motor Texturae',              description: 'Manages every image surface the organism renders.',                              domain: 'GL_SOVEREIGN', rank: 8,  color: '#831843' },
    { id: 'GLSL_SOVEREIGN',      latinName: 'Rex Linguae Graphicae',       description: "The shader language itself — the organism's native GPU tongue.",                domain: 'GL_SOVEREIGN', rank: 9,  color: '#9d174d' },
    { id: 'EXTENSION_FIELD',     latinName: 'Campus Extensionis',          description: 'Unlocks hardware-specific GPU capabilities beyond the standard.',                domain: 'GL_SOVEREIGN', rank: 10, color: '#be185d' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE REGISTRY — ALL 12 DOMAINS, 120 MODELS
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_SOVEREIGN_FIELD_DOMAINS: SovereignFieldDomain[] = [
  STREAMS_SOVEREIGN,
  WEBRTC_SOVEREIGN,
  COMPONENTS_SOVEREIGN,
  WORKERS_SOVEREIGN,
  OBSERVERS_SOVEREIGN,
  CANVAS_SOVEREIGN,
  SVG_SOVEREIGN,
  XR_SOVEREIGN,
  WASM_SOVEREIGN,
  AUDIO_SOVEREIGN,
  GPU_SOVEREIGN,
  GL_SOVEREIGN,
];

/** Flat list of all 120 field models */
export const ALL_FIELD_MODELS: FieldModel[] = ALL_SOVEREIGN_FIELD_DOMAINS.flatMap((d) => d.models);

/** Lookup a field model by its ID */
export function getFieldModel(id: string): FieldModel | undefined {
  return ALL_FIELD_MODELS.find((m) => m.id === id);
}

/** Get all models for a specific domain */
export function getDomainModels(domain: SovereignDomain): FieldModel[] {
  return ALL_FIELD_MODELS.filter((m) => m.domain === domain);
}
