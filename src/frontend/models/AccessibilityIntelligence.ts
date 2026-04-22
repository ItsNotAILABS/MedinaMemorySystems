// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * ACCESSIBILITY INTELLIGENCE — Accessibility/Semantic Intelligence
 * ─────────────────────────────────────────────────────────────────────────
 * 10 Models (91-100) — Accessibility and semantic awareness intelligence
 *
 * From ARIA announcements to universal harmonization, these models govern
 * every inclusive interaction that makes the web perceivable to all users.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { FrontendModel, FrontendModelCategory, ModelStatus } from './FrontendIntelligenceRegistry';

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────

const AWARENESS_CATEGORY: FrontendModelCategory = 'AWARENESS';
const PHI = 1.6180339887498948482;

// ─────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────

export interface AccessibilityModel extends FrontendModel {
  category: 'AWARENESS';
  a11yDomain: string;
}

// ─────────────────────────────────────────────────────────────────────────
// MODEL 91 — ANNUNTIATOR ARIAE
// ─────────────────────────────────────────────────────────────────────────

export const ANNUNTIATOR_ARIAE: AccessibilityModel = {
  id: 'AWARENESS-091',
  modelNumber: 91,
  latinName: 'Annuntiator Ariae',
  commonName: 'The ARIA Announcer',
  category: AWARENESS_CATEGORY,
  technology: 'ARIA',
  description: 'ARIA live region intelligence. Manages aria-live polite/assertive announcements, role assignments, and dynamic content change notifications.',
  costPerOp: { announce: 0.001, role: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.88,
  connections: ['AWARENESS-092', 'AWARENESS-093'],
  phiAlignment: PHI * 0.93,
  a11yDomain: 'ARIA_LIVE',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 92 — NARRATOR SCREENALIS
// ─────────────────────────────────────────────────────────────────────────

export const NARRATOR_SCREENALIS: AccessibilityModel = {
  id: 'AWARENESS-092',
  modelNumber: 92,
  latinName: 'Narrator Screenalis',
  commonName: 'The Screen Narrator',
  category: AWARENESS_CATEGORY,
  technology: 'ScreenReader',
  description: 'Screen reader compatibility intelligence. Ensures accessible name computation, reading order, and interaction patterns work with NVDA, JAWS, and VoiceOver.',
  costPerOp: { narrate: 0.002, describe: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.86,
  connections: ['AWARENESS-091', 'AWARENESS-093'],
  phiAlignment: PHI * 0.92,
  a11yDomain: 'SCREEN_READER',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 93 — SEMANTICUS STRUCTURAE
// ─────────────────────────────────────────────────────────────────────────

export const SEMANTICUS_STRUCTURAE: AccessibilityModel = {
  id: 'AWARENESS-093',
  modelNumber: 93,
  latinName: 'Semanticus Structurae',
  commonName: 'The Semantic Structurer',
  category: AWARENESS_CATEGORY,
  technology: 'SemanticHTML',
  description: 'Semantic HTML intelligence. Enforces proper heading hierarchy, landmark regions, and native HTML element usage over ARIA role substitutions.',
  costPerOp: { structure: 0.001, landmark: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.90,
  connections: ['AWARENESS-091', 'AWARENESS-092'],
  phiAlignment: PHI * 0.94,
  a11yDomain: 'SEMANTIC_HTML',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 94 — CONTRASTOR CHROMATUM
// ─────────────────────────────────────────────────────────────────────────

export const CONTRASTOR_CHROMATUM: AccessibilityModel = {
  id: 'AWARENESS-094',
  modelNumber: 94,
  latinName: 'Contrastor Chromatum',
  commonName: 'The Color Contractor',
  category: AWARENESS_CATEGORY,
  technology: 'ColorContrast',
  description: 'WCAG color contrast intelligence. Computes luminance ratios, validates AA/AAA compliance, and suggests accessible color alternatives.',
  costPerOp: { check: 0.001, suggest: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.84,
  connections: ['AWARENESS-096', 'AWARENESS-097'],
  phiAlignment: PHI * 0.91,
  a11yDomain: 'COLOR_CONTRAST',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 95 — NAVIGATOR CLAVIATURAE
// ─────────────────────────────────────────────────────────────────────────

export const NAVIGATOR_CLAVIATURAE: AccessibilityModel = {
  id: 'AWARENESS-095',
  modelNumber: 95,
  latinName: 'Navigator Claviaturae',
  commonName: 'The Keyboard Navigator',
  category: AWARENESS_CATEGORY,
  technology: 'FocusManagement',
  description: 'Keyboard navigation intelligence. Manages focus traps, roving tabindex patterns, skip links, and logical tab order across interactive components.',
  costPerOp: { trap: 0.001, roam: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.87,
  connections: ['AWARENESS-091', 'AWARENESS-099'],
  phiAlignment: PHI * 0.92,
  a11yDomain: 'KEYBOARD_NAV',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 96 — REDUCTOR MOTUUM
// ─────────────────────────────────────────────────────────────────────────

export const REDUCTOR_MOTUUM: AccessibilityModel = {
  id: 'AWARENESS-096',
  modelNumber: 96,
  latinName: 'Reductor Motuum',
  commonName: 'The Motion Reducer',
  category: AWARENESS_CATEGORY,
  technology: 'CSS3',
  description: 'prefers-reduced-motion intelligence. Detects motion preferences, disables non-essential animations, and provides static fallbacks for vestibular safety.',
  costPerOp: { detect: 0.001, reduce: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.82,
  connections: ['AWARENESS-094', 'AWARENESS-097'],
  phiAlignment: PHI * 0.89,
  a11yDomain: 'MOTION_PREFERENCE',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 97 — MAGNIFICATOR TEXTUUM
// ─────────────────────────────────────────────────────────────────────────

export const MAGNIFICATOR_TEXTUUM: AccessibilityModel = {
  id: 'AWARENESS-097',
  modelNumber: 97,
  latinName: 'Magnificator Textuum',
  commonName: 'The Text Magnifier',
  category: AWARENESS_CATEGORY,
  technology: 'CSS3',
  description: 'Font scaling and zoom intelligence. Ensures text remains readable at 200% zoom, manages rem/em-based sizing, and handles reflow without horizontal scrolling.',
  costPerOp: { scale: 0.001, reflow: 0.002 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.80,
  connections: ['AWARENESS-094', 'AWARENESS-096'],
  phiAlignment: PHI * 0.88,
  a11yDomain: 'TEXT_SCALING',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 98 — DESCRIPTOR IMAGINUM
// ─────────────────────────────────────────────────────────────────────────

export const DESCRIPTOR_IMAGINUM: AccessibilityModel = {
  id: 'AWARENESS-098',
  modelNumber: 98,
  latinName: 'Descriptor Imaginum',
  commonName: 'The Image Describer',
  category: AWARENESS_CATEGORY,
  technology: 'HTML5',
  description: 'Alt text and aria-describedby intelligence. Generates meaningful alternative text, manages complex image descriptions, and validates decorative image marking.',
  costPerOp: { describe: 0.003, generate: 0.005 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.85,
  connections: ['AWARENESS-092', 'AWARENESS-093'],
  phiAlignment: PHI * 0.91,
  a11yDomain: 'IMAGE_ALT_TEXT',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 99 — VALIDATOR FORMULARUM
// ─────────────────────────────────────────────────────────────────────────

export const VALIDATOR_FORMULARUM: AccessibilityModel = {
  id: 'AWARENESS-099',
  modelNumber: 99,
  latinName: 'Validator Formularum',
  commonName: 'The Form Validator',
  category: AWARENESS_CATEGORY,
  technology: 'ARIA',
  description: 'Accessible form validation intelligence. Associates error messages via aria-describedby, announces validation state changes, and manages required field indicators.',
  costPerOp: { validate: 0.002, announce: 0.001 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.86,
  connections: ['AWARENESS-091', 'AWARENESS-095'],
  phiAlignment: PHI * 0.92,
  a11yDomain: 'FORM_VALIDATION',
};

// ─────────────────────────────────────────────────────────────────────────
// MODEL 100 — HARMONIZER UNIVERSALIS
// ─────────────────────────────────────────────────────────────────────────

export const HARMONIZER_UNIVERSALIS: AccessibilityModel = {
  id: 'AWARENESS-100',
  modelNumber: 100,
  latinName: 'Harmonizer Universalis',
  commonName: 'The Universal Harmonizer',
  category: AWARENESS_CATEGORY,
  technology: 'SemanticHTML',
  description: 'Cross-disability harmonization intelligence. Orchestrates all accessibility models to deliver a unified, inclusive experience across visual, motor, auditory, and cognitive needs.',
  costPerOp: { harmonize: 0.003, adapt: 0.004 },
  frequency: 12.67,
  status: 'ACTIVE' as ModelStatus,
  autonomyLevel: 0.93,
  connections: ['AWARENESS-091', 'AWARENESS-092', 'AWARENESS-093', 'AWARENESS-095'],
  phiAlignment: PHI * 0.96,
  a11yDomain: 'UNIVERSAL_HARMONY',
};

// ─────────────────────────────────────────────────────────────────────────
// COLLECTION & FACTORY
// ─────────────────────────────────────────────────────────────────────────

export const AWARENESS_MODELS: AccessibilityModel[] = [
  ANNUNTIATOR_ARIAE,
  NARRATOR_SCREENALIS,
  SEMANTICUS_STRUCTURAE,
  CONTRASTOR_CHROMATUM,
  NAVIGATOR_CLAVIATURAE,
  REDUCTOR_MOTUUM,
  MAGNIFICATOR_TEXTUUM,
  DESCRIPTOR_IMAGINUM,
  VALIDATOR_FORMULARUM,
  HARMONIZER_UNIVERSALIS,
];

export function createAccessibilityModel(overrides: Partial<AccessibilityModel> & Pick<AccessibilityModel, 'id' | 'modelNumber' | 'latinName' | 'commonName' | 'technology'>): AccessibilityModel {
  return {
    category: AWARENESS_CATEGORY as 'AWARENESS',
    description: '',
    costPerOp: {},
    frequency: 12.67,
    status: 'DORMANT' as ModelStatus,
    autonomyLevel: 0.5,
    connections: [],
    phiAlignment: PHI * 0.85,
    a11yDomain: 'CUSTOM',
    ...overrides,
  };
}

export function getAccessibilityModel(id: string): AccessibilityModel | undefined {
  return AWARENESS_MODELS.find((m) => m.id === id);
}

export function getAccessibilityModelByNumber(num: number): AccessibilityModel | undefined {
  return AWARENESS_MODELS.find((m) => m.modelNumber === num);
}

export function calculateAccessibilityCost(model: AccessibilityModel, operation: string, count: number = 1): number {
  const unitCost = model.costPerOp[operation] ?? 0;
  return unitCost * count;
}

export function getTotalAccessibilityCost(): number {
  return AWARENESS_MODELS.reduce((sum, m) => {
    const opCosts = Object.values(m.costPerOp);
    return sum + opCosts.reduce((a, b) => a + b, 0);
  }, 0);
}
