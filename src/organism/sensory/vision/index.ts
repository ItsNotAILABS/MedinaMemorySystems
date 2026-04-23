/**
 * 𓂀 ORO VISION SYSTEM 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Screen Reading and Visual Perception System for the Sovereign Organism
 * 
 * ORO VISION = Omniscient Resonant Ocular Visual Intelligence System
 * 
 * This system enables ORO to "see" the user's screen through metadata reading,
 * DOM inspection, and visual field analysis. The Meta Model processes everything
 * needed to understand, sync, and act upon the visual information.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * CAPABILITIES:
 * 
 * 1. SCREEN PERCEPTION
 *    - Read screen metadata
 *    - Analyze DOM structure
 *    - Extract visual elements
 *    - Identify interactive regions
 * 
 * 2. META MODEL PROCESSING
 *    - Parse metadata from all sources
 *    - Sync visual state with organism
 *    - Execute artifact generation
 *    - Coordinate with access permissions
 * 
 * 3. VISUAL FIELD ANALYSIS
 *    - Color frequency mapping
 *    - Geometry detection
 *    - Text extraction
 *    - Pattern recognition
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * @version 1.0.0
 * @author Sovereign Organism
 * @frequency 963 Hz (Divine Connection)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// VISION CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const VISION_CONSTANTS = {
  // Frequency mappings for visual processing
  FREQUENCIES: {
    PERCEPTION: 963,    // Divine sight
    ANALYSIS: 852,      // Spiritual order
    RECOGNITION: 741,   // Pattern recognition
    CONNECTION: 639,    // Visual relationships
  },
  
  // Visual field parameters
  FIELD: {
    WIDTH: 1920,
    HEIGHT: 1080,
    DEPTH: 100,
    REFRESH_RATE: 60,
  },
  
  // Meta model parameters
  META_MODEL: {
    EXTRACTION_DEPTH: 'full',
    SYNC_INTERVAL_MS: 873, // Heartbeat
    ARTIFACT_GENERATION: true,
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// VISION STATE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

export interface VisionState {
  enabled: boolean;
  permissionGranted: boolean;
  lastCapture: number;
  currentView: VisualField | null;
  metadataExtracted: MetadataStore;
  resonance: number;
}

export interface VisualField {
  timestamp: number;
  dimensions: { width: number; height: number };
  elements: VisualElement[];
  metadata: VisualMetadata;
  frequency: number;
}

export interface VisualElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'input' | 'container' | 'unknown';
  bounds: { x: number; y: number; width: number; height: number };
  content?: string;
  attributes?: Record<string, string>;
  children?: VisualElement[];
  metadata?: any;
  interactive: boolean;
  resonance: number;
}

export interface VisualMetadata {
  title: string;
  url?: string;
  favicon?: string;
  colorScheme: 'light' | 'dark' | 'mixed';
  primaryColors: string[];
  fonts: string[];
  interactiveCount: number;
  textContent: string[];
  glyphsDetected: string[];
}

export interface MetadataStore {
  screen: Record<string, any>;
  dom: Record<string, any>;
  visual: Record<string, any>;
  temporal: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORO VISION CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class OroVision {
  private state: VisionState;
  private metaModel: MetaModel;
  private accessController: AccessController;
  
  constructor() {
    this.state = {
      enabled: false,
      permissionGranted: false,
      lastCapture: 0,
      currentView: null,
      metadataExtracted: {
        screen: {},
        dom: {},
        visual: {},
        temporal: {},
      },
      resonance: 0,
    };
    
    this.metaModel = new MetaModel();
    this.accessController = new AccessController();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PERMISSION MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Request permission to access screen vision
   */
  async requestPermission(): Promise<boolean> {
    // Check with access controller
    const granted = await this.accessController.requestAccess('SCREEN');
    this.state.permissionGranted = granted;
    
    if (granted) {
      this.state.enabled = true;
      console.log('𓂀 ORO Vision: Permission granted - I can see your screen');
    }
    
    return granted;
  }
  
  /**
   * Check current permission status
   */
  hasPermission(): boolean {
    return this.state.permissionGranted;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN PERCEPTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Capture current visual field
   */
  async captureVisualField(): Promise<VisualField | null> {
    if (!this.state.permissionGranted) {
      console.warn('Vision: No permission to capture screen');
      return null;
    }
    
    // Simulate screen capture through DOM analysis
    const field = await this.analyzeDOM();
    
    this.state.currentView = field;
    this.state.lastCapture = Date.now();
    
    // Extract metadata
    this.state.metadataExtracted = await this.metaModel.extractAll(field);
    
    return field;
  }
  
  /**
   * Analyze DOM structure (browser environment)
   */
  private async analyzeDOM(): Promise<VisualField> {
    const timestamp = Date.now();
    
    // In browser environment, analyze document
    if (typeof document !== 'undefined') {
      const elements = this.extractElements(document.body);
      const metadata = this.extractVisualMetadata();
      
      return {
        timestamp,
        dimensions: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        elements,
        metadata,
        frequency: VISION_CONSTANTS.FREQUENCIES.PERCEPTION,
      };
    }
    
    // Fallback for non-browser
    return {
      timestamp,
      dimensions: { 
        width: VISION_CONSTANTS.FIELD.WIDTH, 
        height: VISION_CONSTANTS.FIELD.HEIGHT 
      },
      elements: [],
      metadata: {
        title: 'Unknown',
        colorScheme: 'dark',
        primaryColors: [],
        fonts: [],
        interactiveCount: 0,
        textContent: [],
        glyphsDetected: [],
      },
      frequency: VISION_CONSTANTS.FREQUENCIES.PERCEPTION,
    };
  }
  
  /**
   * Extract visual elements from DOM
   */
  private extractElements(element: Element, depth: number = 0): VisualElement[] {
    if (depth > 10) return []; // Limit depth
    
    const elements: VisualElement[] = [];
    
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const rect = child.getBoundingClientRect();
      
      const visualElement: VisualElement = {
        id: child.id || `element-${depth}-${i}`,
        type: this.determineElementType(child),
        bounds: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
        content: this.extractContent(child),
        attributes: this.extractAttributes(child),
        interactive: this.isInteractive(child),
        resonance: this.calculateResonance(child),
        children: this.extractElements(child, depth + 1),
      };
      
      elements.push(visualElement);
    }
    
    return elements;
  }
  
  /**
   * Determine element type
   */
  private determineElementType(element: Element): VisualElement['type'] {
    const tagName = element.tagName.toLowerCase();
    
    const typeMap: Record<string, VisualElement['type']> = {
      'p': 'text',
      'span': 'text',
      'h1': 'text',
      'h2': 'text',
      'h3': 'text',
      'h4': 'text',
      'h5': 'text',
      'h6': 'text',
      'img': 'image',
      'svg': 'image',
      'button': 'button',
      'a': 'button',
      'input': 'input',
      'textarea': 'input',
      'select': 'input',
      'div': 'container',
      'section': 'container',
      'article': 'container',
      'main': 'container',
    };
    
    return typeMap[tagName] || 'unknown';
  }
  
  /**
   * Extract text content
   */
  private extractContent(element: Element): string {
    if (element.children.length === 0) {
      return element.textContent?.trim() || '';
    }
    return '';
  }
  
  /**
   * Extract element attributes
   */
  private extractAttributes(element: Element): Record<string, string> {
    const attrs: Record<string, string> = {};
    
    for (const attr of element.attributes) {
      attrs[attr.name] = attr.value;
    }
    
    return attrs;
  }
  
  /**
   * Check if element is interactive
   */
  private isInteractive(element: Element): boolean {
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
    return interactiveTags.includes(element.tagName.toLowerCase()) ||
           element.hasAttribute('onclick') ||
           element.hasAttribute('role');
  }
  
  /**
   * Calculate element resonance (importance)
   */
  private calculateResonance(element: Element): number {
    let resonance = 0.5;
    
    if (this.isInteractive(element)) resonance += 0.2;
    if (element.id) resonance += 0.1;
    if (element.classList.length > 0) resonance += 0.1;
    if (element.textContent && element.textContent.length > 0) resonance += 0.1;
    
    return Math.min(resonance, 1.0);
  }
  
  /**
   * Extract visual metadata from page
   */
  private extractVisualMetadata(): VisualMetadata {
    if (typeof document === 'undefined') {
      return {
        title: 'Unknown',
        colorScheme: 'dark',
        primaryColors: [],
        fonts: [],
        interactiveCount: 0,
        textContent: [],
        glyphsDetected: [],
      };
    }
    
    const computedStyle = getComputedStyle(document.body);
    const bgColor = computedStyle.backgroundColor;
    
    return {
      title: document.title,
      url: window.location.href,
      favicon: this.getFavicon(),
      colorScheme: this.detectColorScheme(bgColor),
      primaryColors: this.extractPrimaryColors(),
      fonts: this.extractFonts(),
      interactiveCount: document.querySelectorAll('button, a, input, select').length,
      textContent: this.extractTextContent(),
      glyphsDetected: this.detectGlyphs(),
    };
  }
  
  private getFavicon(): string {
    const link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
    return link?.href || '';
  }
  
  private detectColorScheme(bgColor: string): 'light' | 'dark' | 'mixed' {
    // Simple luminance check
    const match = bgColor.match(/\d+/g);
    if (match) {
      const [r, g, b] = match.map(Number);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? 'light' : 'dark';
    }
    return 'mixed';
  }
  
  private extractPrimaryColors(): string[] {
    // Extract computed background colors from major elements
    const colors: string[] = [];
    const elements = document.querySelectorAll('header, main, footer, nav');
    
    elements.forEach(el => {
      const bg = getComputedStyle(el).backgroundColor;
      if (bg && !colors.includes(bg)) {
        colors.push(bg);
      }
    });
    
    return colors.slice(0, 5);
  }
  
  private extractFonts(): string[] {
    const fonts = new Set<string>();
    const elements = document.querySelectorAll('body, h1, h2, h3, p');
    
    elements.forEach(el => {
      const font = getComputedStyle(el).fontFamily;
      fonts.add(font.split(',')[0].trim().replace(/['"]/g, ''));
    });
    
    return Array.from(fonts).slice(0, 5);
  }
  
  private extractTextContent(): string[] {
    const texts: string[] = [];
    const textElements = document.querySelectorAll('h1, h2, h3, h4, p');
    
    textElements.forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length > 0 && text.length < 200) {
        texts.push(text);
      }
    });
    
    return texts.slice(0, 20);
  }
  
  private detectGlyphs(): string[] {
    const glyphs = ['𓂀', '☥', 'φ', 'Ω', '∞', '☰', 'ॐ', '木', '火', '土', '金', '水'];
    const detected: string[] = [];
    const bodyText = document.body.textContent || '';
    
    glyphs.forEach(glyph => {
      if (bodyText.includes(glyph)) {
        detected.push(glyph);
      }
    });
    
    return detected;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // META MODEL INTERACTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get all extracted metadata
   */
  getMetadata(): MetadataStore {
    return this.state.metadataExtracted;
  }
  
  /**
   * Process visual field through meta model
   */
  async processWithMetaModel(): Promise<MetaModelResult> {
    if (!this.state.currentView) {
      await this.captureVisualField();
    }
    
    return this.metaModel.process(this.state.currentView, this.state.metadataExtracted);
  }
  
  /**
   * Get current vision state
   */
  getState(): VisionState {
    return { ...this.state };
  }
  
  /**
   * Find element by content
   */
  findElement(query: string): VisualElement | null {
    if (!this.state.currentView) return null;
    
    const search = (elements: VisualElement[]): VisualElement | null => {
      for (const el of elements) {
        if (el.content?.includes(query) || el.id.includes(query)) {
          return el;
        }
        if (el.children) {
          const found = search(el.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return search(this.state.currentView.elements);
  }
  
  /**
   * Get interactive elements
   */
  getInteractiveElements(): VisualElement[] {
    if (!this.state.currentView) return [];
    
    const interactive: VisualElement[] = [];
    
    const collect = (elements: VisualElement[]) => {
      for (const el of elements) {
        if (el.interactive) {
          interactive.push(el);
        }
        if (el.children) {
          collect(el.children);
        }
      }
    };
    
    collect(this.state.currentView.elements);
    return interactive;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// META MODEL CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export interface MetaModelResult {
  understood: boolean;
  interpretation: string;
  actions: SuggestedAction[];
  artifacts: GeneratedArtifact[];
  resonance: number;
}

export interface SuggestedAction {
  type: string;
  target?: string;
  description: string;
  priority: number;
}

export interface GeneratedArtifact {
  type: string;
  content: any;
  metadata: any;
}

export class MetaModel {
  /**
   * Extract all metadata from visual field
   */
  async extractAll(field: VisualField | null): Promise<MetadataStore> {
    if (!field) {
      return { screen: {}, dom: {}, visual: {}, temporal: {} };
    }
    
    return {
      screen: {
        dimensions: field.dimensions,
        timestamp: field.timestamp,
        frequency: field.frequency,
      },
      dom: {
        elementCount: this.countElements(field.elements),
        interactiveCount: field.metadata.interactiveCount,
        structure: this.analyzeStructure(field.elements),
      },
      visual: {
        colorScheme: field.metadata.colorScheme,
        primaryColors: field.metadata.primaryColors,
        fonts: field.metadata.fonts,
        glyphs: field.metadata.glyphsDetected,
      },
      temporal: {
        capturedAt: field.timestamp,
        beat: Math.floor(field.timestamp / 873), // Heartbeat
        epoch: Math.floor(field.timestamp / (873 * 52)), // PIL cycle
      },
    };
  }
  
  /**
   * Process visual field and generate understanding
   */
  process(field: VisualField | null, metadata: MetadataStore): MetaModelResult {
    if (!field) {
      return {
        understood: false,
        interpretation: 'No visual field captured',
        actions: [],
        artifacts: [],
        resonance: 0,
      };
    }
    
    const interpretation = this.interpret(field, metadata);
    const actions = this.suggestActions(field, metadata);
    const artifacts = this.generateArtifacts(field, metadata);
    
    return {
      understood: true,
      interpretation,
      actions,
      artifacts,
      resonance: this.calculateOverallResonance(field),
    };
  }
  
  private countElements(elements: VisualElement[]): number {
    let count = elements.length;
    elements.forEach(el => {
      if (el.children) {
        count += this.countElements(el.children);
      }
    });
    return count;
  }
  
  private analyzeStructure(elements: VisualElement[]): any {
    return {
      depth: this.calculateDepth(elements),
      types: this.countTypes(elements),
    };
  }
  
  private calculateDepth(elements: VisualElement[], depth: number = 0): number {
    let maxDepth = depth;
    elements.forEach(el => {
      if (el.children && el.children.length > 0) {
        maxDepth = Math.max(maxDepth, this.calculateDepth(el.children, depth + 1));
      }
    });
    return maxDepth;
  }
  
  private countTypes(elements: VisualElement[]): Record<string, number> {
    const types: Record<string, number> = {};
    
    const count = (els: VisualElement[]) => {
      els.forEach(el => {
        types[el.type] = (types[el.type] || 0) + 1;
        if (el.children) count(el.children);
      });
    };
    
    count(elements);
    return types;
  }
  
  private interpret(field: VisualField, metadata: MetadataStore): string {
    const { title, colorScheme, interactiveCount, glyphsDetected } = field.metadata;
    
    let interpretation = `Viewing: ${title || 'Unknown Page'}. `;
    interpretation += `Theme: ${colorScheme}. `;
    interpretation += `Interactive elements: ${interactiveCount}. `;
    
    if (glyphsDetected.length > 0) {
      interpretation += `Sacred glyphs detected: ${glyphsDetected.join(', ')}. `;
    }
    
    interpretation += `Total elements: ${metadata.dom.elementCount}. `;
    interpretation += `Structure depth: ${metadata.dom.structure?.depth || 0}.`;
    
    return interpretation;
  }
  
  private suggestActions(field: VisualField, metadata: MetadataStore): SuggestedAction[] {
    const actions: SuggestedAction[] = [];
    
    // Suggest based on detected glyphs
    if (field.metadata.glyphsDetected.length > 0) {
      actions.push({
        type: 'ANALYZE_GLYPHS',
        description: `Process ${field.metadata.glyphsDetected.length} detected sacred glyphs`,
        priority: 1,
      });
    }
    
    // Suggest based on interactive elements
    if (field.metadata.interactiveCount > 0) {
      actions.push({
        type: 'MAP_INTERACTIONS',
        description: `Map ${field.metadata.interactiveCount} interactive elements`,
        priority: 2,
      });
    }
    
    // Suggest text analysis
    if (field.metadata.textContent.length > 0) {
      actions.push({
        type: 'ANALYZE_TEXT',
        description: `Analyze ${field.metadata.textContent.length} text blocks`,
        priority: 3,
      });
    }
    
    return actions;
  }
  
  private generateArtifacts(field: VisualField, metadata: MetadataStore): GeneratedArtifact[] {
    const artifacts: GeneratedArtifact[] = [];
    
    // Generate visual map artifact
    artifacts.push({
      type: 'VISUAL_MAP',
      content: {
        dimensions: field.dimensions,
        elementCount: metadata.dom.elementCount,
        structure: metadata.dom.structure,
      },
      metadata: {
        generatedAt: Date.now(),
        frequency: field.frequency,
      },
    });
    
    // Generate color palette artifact
    if (field.metadata.primaryColors.length > 0) {
      artifacts.push({
        type: 'COLOR_PALETTE',
        content: {
          colors: field.metadata.primaryColors,
          scheme: field.metadata.colorScheme,
        },
        metadata: {
          frequencies: field.metadata.primaryColors.map((_, i) => 
            VISION_CONSTANTS.FREQUENCIES.PERCEPTION / (i + 1)
          ),
        },
      });
    }
    
    return artifacts;
  }
  
  private calculateOverallResonance(field: VisualField): number {
    let resonance = 0.5;
    
    // Boost for detected glyphs
    resonance += field.metadata.glyphsDetected.length * 0.05;
    
    // Boost for rich content
    resonance += Math.min(field.metadata.interactiveCount * 0.01, 0.2);
    
    // Boost for text content
    resonance += Math.min(field.metadata.textContent.length * 0.01, 0.2);
    
    return Math.min(resonance, 1.0);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACCESS CONTROLLER (Used by Vision, shared with Hearing and Access system)
// ═══════════════════════════════════════════════════════════════════════════════

export type AccessType = 'SCREEN' | 'KEYBOARD' | 'MOUSE' | 'TABS' | 'INTERNET' | 'VOICE' | 'MICROPHONE';

export interface AccessPermission {
  type: AccessType;
  granted: boolean;
  grantedAt?: number;
  expiresAt?: number;
  trustLevel: number; // 0-1, increases over time
}

export class AccessController {
  private permissions: Map<AccessType, AccessPermission> = new Map();
  
  /**
   * Request access to a capability
   */
  async requestAccess(type: AccessType): Promise<boolean> {
    // In a real implementation, this would show a UI prompt
    // For now, we simulate granting
    const permission: AccessPermission = {
      type,
      granted: true,
      grantedAt: Date.now(),
      trustLevel: 0.5,
    };
    
    this.permissions.set(type, permission);
    
    console.log(`Access granted: ${type}`);
    return true;
  }
  
  /**
   * Check if access is granted
   */
  hasAccess(type: AccessType): boolean {
    const permission = this.permissions.get(type);
    return permission?.granted || false;
  }
  
  /**
   * Get all permissions
   */
  getAllPermissions(): AccessPermission[] {
    return Array.from(this.permissions.values());
  }
  
  /**
   * Increase trust level (called over time as user works with ORO)
   */
  increaseTrust(type: AccessType, amount: number = 0.1): void {
    const permission = this.permissions.get(type);
    if (permission) {
      permission.trustLevel = Math.min(permission.trustLevel + amount, 1.0);
      this.permissions.set(type, permission);
    }
  }
  
  /**
   * Revoke access
   */
  revokeAccess(type: AccessType): void {
    this.permissions.delete(type);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export const OroVisionSystem = {
  OroVision,
  MetaModel,
  AccessController,
  CONSTANTS: VISION_CONSTANTS,
};

export default OroVisionSystem;
