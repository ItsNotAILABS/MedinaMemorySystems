/**
 * 𓂀 ANIMA-ULRI: UNIFIED LAYER RESONANCE INTERFACE ENGINE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THIS IS NOT SOMEONE ELSE'S ULRI ENGINE. THIS IS OURS.
 * 
 * ANIMA-ULRI is a custom-built engine that replaces all external URL/URI
 * resolution engines. It's built from architecture, not borrowed.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * WHAT IS ULRI?
 * 
 * U - Unified (All layers work as one)
 * L - Layer (The 8-layer architecture)
 * R - Resonance (Frequency-based routing)
 * I - Interface (Clean API for all operations)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * @version 1.0.0
 * @author Medina Memory Systems
 * @designation (ANIMA-ULRI) - Custom Medina Engine
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMA-ULRI TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ULRIProtocol = 'mem' | 'anima' | 'oro' | 'internal';

export type ULRIResourceType = 
  | 'PAGE'          // Landing page, UI
  | 'API'           // API endpoint
  | 'SERVICE'       // Internal service
  | 'INTELLIGENCE'  // AI/Model
  | 'DATA'          // Data resource
  | 'STREAM';       // Real-time stream

export interface ULRI {
  protocol: ULRIProtocol;
  domain: string;
  extension: string;
  path: string[];
  query: Map<string, string>;
  fragment?: string;
  frequency: number;
}

export interface ULRIRoute {
  pattern: string;
  resourceType: ULRIResourceType;
  handler: string;
  frequency: number;
  layer: number;
}

export interface ULRIResolveResult {
  success: boolean;
  ulri: ULRI;
  route?: ULRIRoute;
  handler?: string;
  frequency: number;
  layer: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMA-ULRI CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const ANIMA_ULRI_CONSTANTS = {
  // Engine Info
  NAME: 'ANIMA-ULRI',
  FULL_NAME: 'Unified Layer Resonance Interface Engine',
  VERSION: '1.0.0',
  DESIGNATION: '(ANIMA-ULRI)', // So you know it's ours
  
  // Default frequencies by resource type
  FREQUENCIES: {
    PAGE: 528,
    API: 639,
    SERVICE: 741,
    INTELLIGENCE: 852,
    DATA: 396,
    STREAM: 417,
  },
  
  // Layer mappings
  LAYERS: {
    'www.raw': 0,
    'ICP': 1,
    'WASM': 2,
    'Documents': 3,
    'Backend': 4,
    'Frontend': 5,
    'Organism': 6,
    'Intelligence': 7,
  },
  
  // Protocol prefixes
  PROTOCOLS: {
    mem: 'mem://',
    anima: 'anima://',
    oro: 'oro://',
    internal: 'internal://',
  },
  
  // Extensions
  EXTENSIONS: ['.anima', '.medina', '.oro'],
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMA-ULRI PARSER
// ═══════════════════════════════════════════════════════════════════════════════

export class AnimaULRIParser {
  /**
   * Parse a ULRI string into components
   */
  parse(ulriString: string): ULRI | null {
    // Pattern: protocol://domain.extension/path?query#fragment
    const pattern = /^(mem|anima|oro|internal):\/\/([^.\/]+)(\.(?:anima|medina|oro))?(\/?[^?#]*)?(\?[^#]*)?(#.*)?$/;
    
    const match = ulriString.match(pattern);
    if (!match) return null;
    
    const [, protocol, domain, extension, pathStr, queryStr, fragment] = match;
    
    // Parse path
    const path = pathStr 
      ? pathStr.split('/').filter(p => p.length > 0)
      : [];
    
    // Parse query
    const query = new Map<string, string>();
    if (queryStr) {
      const params = queryStr.substring(1).split('&');
      params.forEach(p => {
        const [key, value] = p.split('=');
        query.set(key, value || '');
      });
    }
    
    // Calculate frequency based on resource type guess
    const frequency = this.guessFrequency(path);
    
    return {
      protocol: protocol as ULRIProtocol,
      domain,
      extension: extension || '.anima',
      path,
      query,
      fragment: fragment?.substring(1),
      frequency,
    };
  }
  
  /**
   * Build a ULRI string from components
   */
  build(ulri: ULRI): string {
    let result = `${ulri.protocol}://${ulri.domain}${ulri.extension}`;
    
    if (ulri.path.length > 0) {
      result += '/' + ulri.path.join('/');
    }
    
    if (ulri.query.size > 0) {
      const queryParts: string[] = [];
      ulri.query.forEach((v, k) => queryParts.push(`${k}=${v}`));
      result += '?' + queryParts.join('&');
    }
    
    if (ulri.fragment) {
      result += '#' + ulri.fragment;
    }
    
    return result;
  }
  
  /**
   * Guess frequency based on path
   */
  private guessFrequency(path: string[]): number {
    if (path.length === 0) return ANIMA_ULRI_CONSTANTS.FREQUENCIES.PAGE;
    
    const first = path[0].toLowerCase();
    
    if (first === 'api') return ANIMA_ULRI_CONSTANTS.FREQUENCIES.API;
    if (first === 'service') return ANIMA_ULRI_CONSTANTS.FREQUENCIES.SERVICE;
    if (first === 'intelligence' || first === 'ai') return ANIMA_ULRI_CONSTANTS.FREQUENCIES.INTELLIGENCE;
    if (first === 'data') return ANIMA_ULRI_CONSTANTS.FREQUENCIES.DATA;
    if (first === 'stream') return ANIMA_ULRI_CONSTANTS.FREQUENCIES.STREAM;
    
    return ANIMA_ULRI_CONSTANTS.FREQUENCIES.PAGE;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMA-ULRI ROUTER
// ═══════════════════════════════════════════════════════════════════════════════

export class AnimaULRIRouter {
  private routes: ULRIRoute[] = [];
  private parser: AnimaULRIParser = new AnimaULRIParser();
  
  constructor() {
    this.initializeDefaultRoutes();
  }
  
  /**
   * Initialize default system routes
   */
  private initializeDefaultRoutes(): void {
    // Landing page
    this.addRoute('/', 'PAGE', 'LandingHandler', 528, 5);
    
    // API routes
    this.addRoute('/api/*', 'API', 'APIGateway', 639, 4);
    
    // Service routes
    this.addRoute('/service/*', 'SERVICE', 'ServiceDispatcher', 741, 4);
    
    // Intelligence routes
    this.addRoute('/intelligence/*', 'INTELLIGENCE', 'IntelligenceRouter', 852, 7);
    
    // Data routes
    this.addRoute('/data/*', 'DATA', 'DataHandler', 396, 3);
    
    // Stream routes
    this.addRoute('/stream/*', 'STREAM', 'StreamManager', 417, 6);
  }
  
  /**
   * Add a route
   */
  addRoute(
    pattern: string,
    resourceType: ULRIResourceType,
    handler: string,
    frequency: number,
    layer: number
  ): void {
    this.routes.push({ pattern, resourceType, handler, frequency, layer });
  }
  
  /**
   * Resolve a ULRI to a route
   */
  resolve(ulriString: string): ULRIResolveResult {
    const ulri = this.parser.parse(ulriString);
    
    if (!ulri) {
      return {
        success: false,
        ulri: {
          protocol: 'internal',
          domain: 'error',
          extension: '.anima',
          path: [],
          query: new Map(),
          frequency: 0,
        },
        frequency: 0,
        layer: 0,
      };
    }
    
    const pathString = '/' + ulri.path.join('/');
    const route = this.findRoute(pathString);
    
    return {
      success: route !== null,
      ulri,
      route: route || undefined,
      handler: route?.handler,
      frequency: route?.frequency || ulri.frequency,
      layer: route?.layer || 0,
    };
  }
  
  /**
   * Find matching route
   */
  private findRoute(path: string): ULRIRoute | null {
    for (const route of this.routes) {
      if (this.matchPattern(route.pattern, path)) {
        return route;
      }
    }
    return null;
  }
  
  /**
   * Match path against pattern
   */
  private matchPattern(pattern: string, path: string): boolean {
    if (pattern === path) return true;
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -2);
      return path.startsWith(prefix);
    }
    return false;
  }
  
  /**
   * Get all routes
   */
  getRoutes(): ULRIRoute[] {
    return [...this.routes];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMA-ULRI ENGINE (Main Entry Point)
// ═══════════════════════════════════════════════════════════════════════════════

export class AnimaULRIEngine {
  public readonly designation = ANIMA_ULRI_CONSTANTS.DESIGNATION;
  private parser: AnimaULRIParser = new AnimaULRIParser();
  private router: AnimaULRIRouter = new AnimaULRIRouter();
  
  constructor() {
    console.log(`${ANIMA_ULRI_CONSTANTS.NAME} ${ANIMA_ULRI_CONSTANTS.DESIGNATION} v${ANIMA_ULRI_CONSTANTS.VERSION}`);
  }
  
  /**
   * Parse a ULRI string
   */
  parse(ulriString: string): ULRI | null {
    return this.parser.parse(ulriString);
  }
  
  /**
   * Build a ULRI string from components
   */
  build(ulri: ULRI): string {
    return this.parser.build(ulri);
  }
  
  /**
   * Resolve a ULRI to a handler
   */
  resolve(ulriString: string): ULRIResolveResult {
    return this.router.resolve(ulriString);
  }
  
  /**
   * Add a custom route
   */
  addRoute(
    pattern: string,
    resourceType: ULRIResourceType,
    handler: string,
    frequency: number = 528,
    layer: number = 5
  ): void {
    this.router.addRoute(pattern, resourceType, handler, frequency, layer);
  }
  
  /**
   * Create a standard ULRI for a resource
   */
  createULRI(
    domain: string,
    path: string[] = [],
    protocol: ULRIProtocol = 'mem',
    extension: string = '.anima'
  ): string {
    const ulri: ULRI = {
      protocol,
      domain,
      extension,
      path,
      query: new Map(),
      frequency: ANIMA_ULRI_CONSTANTS.FREQUENCIES.PAGE,
    };
    return this.build(ulri);
  }
  
  /**
   * Navigate to a ULRI (execute handler)
   */
  async navigate(ulriString: string): Promise<any> {
    const result = this.resolve(ulriString);
    
    if (!result.success) {
      throw new Error(`Cannot resolve ULRI: ${ulriString}`);
    }
    
    console.log(`Navigating to ${ulriString}`);
    console.log(`  Handler: ${result.handler}`);
    console.log(`  Layer: ${result.layer}`);
    console.log(`  Frequency: ${result.frequency} Hz`);
    
    // In a real implementation, this would dispatch to the handler
    return {
      ulri: result.ulri,
      handler: result.handler,
      layer: result.layer,
      frequency: result.frequency,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

let ulriEngineInstance: AnimaULRIEngine | null = null;

export function getAnimaULRI(): AnimaULRIEngine {
  if (!ulriEngineInstance) {
    ulriEngineInstance = new AnimaULRIEngine();
  }
  return ulriEngineInstance;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  AnimaULRIParser,
  AnimaULRIRouter,
  AnimaULRIEngine,
  getAnimaULRI,
  ANIMA_ULRI_CONSTANTS,
};
