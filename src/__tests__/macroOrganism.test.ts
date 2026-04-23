/**
 * 𓂀 MACRO-ORGANISMAL ARCHITECTURE — TEST SUITE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Tests for the macro-organismal reading of ancient civilizations
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  // Architectural Objects
  PYRAMID,
  CODEX,
  CITY_GRID,
  TEMPLE,
  CALENDAR,
  TRADE_ROUTE,
  IRRIGATION_SYSTEM,
  BURIAL_SYSTEM,
  GLYPH_SYSTEM,
  LEGAL_FORM,
  ASTRONOMICAL_ALIGNMENT,
  METALLURGY,
  ARCHITECTURAL_OBJECTS,
  
  // Trickster
  TRICKSTER_OPERATIONS,
  TRICKSTER_INSIGHT,
  TRICKSTERS,
  createTrickster,
  
  // Civilizations
  EGYPT,
  MESOPOTAMIA,
  MESOAMERICA,
  CHINA,
  GREECE,
  ROME,
  INDIA,
  NORDIC,
  WEST_AFRICA,
  POLYNESIA,
  PACIFIC_NORTHWEST,
  ANCIENT_CIVILIZATIONS,
  
  // Tech Stack
  TECH_STACK_MAPPINGS,
  
  // Analysis Functions
  getObjectsStabilizing,
  getCivilizationsWithRelation,
  getTricksterOperations,
  countDeepFunctions,
  readObject,
  
  // Types
  type ArchitecturalRelation,
  type TricksterOperation,
} from '../organism/civilizations';

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURAL OBJECTS — Not "Just" Artifacts
// ═══════════════════════════════════════════════════════════════════════════════

describe('Macro-Organismal Architecture - Architectural Objects', () => {
  test('PYRAMID is not just a monument', () => {
    expect(PYRAMID.surfaceReading).toBe('just a monument');
    expect(PYRAMID.deepFunctions).toContain('vertical hierarchy');
    expect(PYRAMID.deepFunctions).toContain('field anchoring');
    expect(PYRAMID.deepFunctions).toContain('directional alignment');
    expect(PYRAMID.deepFunctions).toContain('memory sealing');
    expect(PYRAMID.deepFunctions).toContain('labor coordination');
    expect(PYRAMID.deepFunctions).toContain('symbolic compression');
    expect(PYRAMID.deepFunctions).toContain('sovereign continuity');
  });
  
  test('CODEX is not just a book', () => {
    expect(CODEX.surfaceReading).toBe('just a book');
    expect(CODEX.deepFunctions).toContain('memory persistence');
    expect(CODEX.deepFunctions).toContain('law transfer');
    expect(CODEX.deepFunctions).toContain('ritual replay');
    expect(CODEX.deepFunctions).toContain('compressed world-model');
  });
  
  test('CITY_GRID is not just urban design', () => {
    expect(CITY_GRID.surfaceReading).toBe('just urban design');
    expect(CITY_GRID.deepFunctions).toContain('circulation');
    expect(CITY_GRID.deepFunctions).toContain('allocation');
    expect(CITY_GRID.deepFunctions).toContain('defense');
    expect(CITY_GRID.deepFunctions).toContain('hierarchy');
    expect(CITY_GRID.deepFunctions).toContain('value flow made physical');
  });
  
  test('There are 12 architectural objects', () => {
    expect(ARCHITECTURAL_OBJECTS.length).toBe(12);
  });
  
  test('All objects have deep functions', () => {
    for (const obj of ARCHITECTURAL_OBJECTS) {
      expect(obj.deepFunctions.length).toBeGreaterThanOrEqual(4);
    }
  });
  
  test('All objects stabilize at least 2 relations', () => {
    for (const obj of ARCHITECTURAL_OBJECTS) {
      expect(obj.stabilizes.length).toBeGreaterThanOrEqual(2);
    }
  });
  
  test('readObject produces correct format', () => {
    const reading = readObject(PYRAMID);
    expect(reading).toContain('Pyramid is NOT "just a monument"');
    expect(reading).toContain('It IS:');
    expect(reading).toContain('vertical hierarchy');
  });
  
  test('countDeepFunctions totals all functions', () => {
    const total = countDeepFunctions();
    expect(total).toBeGreaterThanOrEqual(60); // At least 5 per object × 12
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// THE TRICKSTER — The Vein's Illegal Engineer
// ═══════════════════════════════════════════════════════════════════════════════

describe('Macro-Organismal Architecture - The Trickster', () => {
  test('Trickster insight is encoded', () => {
    expect(TRICKSTER_INSIGHT.toLowerCase()).toContain('transfer');
    expect(TRICKSTER_INSIGHT.toLowerCase()).toContain('inversion');
    expect(TRICKSTER_INSIGHT.toLowerCase()).toContain('bypass');
    expect(TRICKSTER_INSIGHT.toLowerCase()).toContain('disguise');
    expect(TRICKSTER_INSIGHT.toLowerCase()).toContain('re-entry');
    expect(TRICKSTER_INSIGHT.toLowerCase()).toContain('core operations');
  });
  
  test('All 5 trickster operations exist', () => {
    const ops: TricksterOperation[] = ['transfer', 'inversion', 'bypass', 'disguise', 'reentry'];
    for (const op of ops) {
      expect(TRICKSTER_OPERATIONS[op]).toBeDefined();
    }
  });
  
  test('HERMES uses transfer, bypass, disguise', () => {
    expect(TRICKSTERS.HERMES.operations).toContain('transfer');
    expect(TRICKSTERS.HERMES.operations).toContain('bypass');
    expect(TRICKSTERS.HERMES.operations).toContain('disguise');
  });
  
  test('LOKI uses inversion, disguise, reentry', () => {
    expect(TRICKSTERS.LOKI.operations).toContain('inversion');
    expect(TRICKSTERS.LOKI.operations).toContain('disguise');
    expect(TRICKSTERS.LOKI.operations).toContain('reentry');
  });
  
  test('createTrickster creates valid trickster', () => {
    const custom = createTrickster('Custom', ['transfer', 'bypass'], 'Custom discovery');
    expect(custom.name).toBe('Custom');
    expect(custom.operations).toContain('transfer');
    expect(custom.discovery).toBe('Custom discovery');
  });
  
  test('There are 8 named tricksters', () => {
    expect(Object.keys(TRICKSTERS).length).toBe(8);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CIVILIZATIONS — Macro-Organismal Architectures
// ═══════════════════════════════════════════════════════════════════════════════

describe('Macro-Organismal Architecture - Civilizations', () => {
  test('There are 11 ancient civilizations', () => {
    expect(ANCIENT_CIVILIZATIONS.length).toBe(11);
  });
  
  test('EGYPT has correct architecture', () => {
    expect(EGYPT.name).toBe('Ancient Egypt');
    expect(EGYPT.objects).toContain(PYRAMID);
    expect(EGYPT.objects).toContain(TEMPLE);
    expect(EGYPT.objects).toContain(BURIAL_SYSTEM);
    expect(EGYPT.primaryRelations).toContain('memory');
    expect(EGYPT.primaryRelations).toContain('power');
    expect(EGYPT.primaryRelations).toContain('field');
    expect(EGYPT.insight).toContain('Nile');
  });
  
  test('MESOAMERICA has correct architecture', () => {
    expect(MESOAMERICA.name).toBe('Mesoamerica');
    expect(MESOAMERICA.objects).toContain(PYRAMID);
    expect(MESOAMERICA.objects).toContain(CALENDAR);
    expect(MESOAMERICA.primaryRelations).toContain('ritual');
    expect(MESOAMERICA.tricksters[0].name).toBe('Quetzalcoatl');
  });
  
  test('GREECE has Hermes and Prometheus as tricksters', () => {
    const tricksterNames = GREECE.tricksters.map(t => t.name);
    expect(tricksterNames).toContain('Hermes');
    expect(tricksterNames).toContain('Prometheus');
  });
  
  test('NORDIC has Loki as trickster', () => {
    expect(NORDIC.tricksters[0].name).toBe('Loki');
  });
  
  test('WEST_AFRICA has Anansi and Eshu as tricksters', () => {
    const tricksterNames = WEST_AFRICA.tricksters.map(t => t.name);
    expect(tricksterNames).toContain('Anansi');
    expect(tricksterNames).toContain('Eshu');
  });
  
  test('All civilizations have insights', () => {
    for (const civ of ANCIENT_CIVILIZATIONS) {
      expect(civ.insight.length).toBeGreaterThan(10);
    }
  });
  
  test('All civilizations have at least 4 objects', () => {
    for (const civ of ANCIENT_CIVILIZATIONS) {
      expect(civ.objects.length).toBeGreaterThanOrEqual(4);
    }
  });
  
  test('All civilizations have at least 1 trickster', () => {
    for (const civ of ANCIENT_CIVILIZATIONS) {
      expect(civ.tricksters.length).toBeGreaterThanOrEqual(1);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURAL RELATIONS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Macro-Organismal Architecture - Relations', () => {
  test('getObjectsStabilizing returns correct objects', () => {
    const memoryObjects = getObjectsStabilizing('memory');
    expect(memoryObjects).toContain(PYRAMID);
    expect(memoryObjects).toContain(CODEX);
    expect(memoryObjects).toContain(BURIAL_SYSTEM);
    expect(memoryObjects).toContain(GLYPH_SYSTEM);
  });
  
  test('getCivilizationsWithRelation returns correct civilizations', () => {
    const ritualCivs = getCivilizationsWithRelation('ritual');
    const civNames = ritualCivs.map(c => c.name);
    expect(civNames).toContain('Mesoamerica');
    expect(civNames).toContain('Ancient Greece');
  });
  
  test('getTricksterOperations extracts all operations', () => {
    const ops = getTricksterOperations(GREECE);
    expect(ops).toContain('transfer');
    expect(ops).toContain('bypass');
    expect(ops).toContain('disguise');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TECH STACK MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Macro-Organismal Architecture - Tech Stack Mappings', () => {
  test('There are 6 tech stack mappings', () => {
    expect(TECH_STACK_MAPPINGS.length).toBe(6);
  });
  
  test('Body maps to Burial System', () => {
    const bodyMapping = TECH_STACK_MAPPINGS.find(m => m.layer === 'Body');
    expect(bodyMapping?.civilizationAnalog).toBe(BURIAL_SYSTEM);
    expect(bodyMapping?.organismFunction).toContain('Soma');
  });
  
  test('City maps to City Grid', () => {
    const cityMapping = TECH_STACK_MAPPINGS.find(m => m.layer === 'City');
    expect(cityMapping?.civilizationAnalog).toBe(CITY_GRID);
    expect(cityMapping?.organismFunction).toContain('Circulation');
  });
  
  test('Network maps to Trade Route', () => {
    const networkMapping = TECH_STACK_MAPPINGS.find(m => m.layer === 'Network');
    expect(networkMapping?.civilizationAnalog).toBe(TRADE_ROUTE);
    expect(networkMapping?.organismFunction).toContain('Transfer');
  });
  
  test('All mappings have organism functions', () => {
    for (const mapping of TECH_STACK_MAPPINGS) {
      expect(mapping.organismFunction.length).toBeGreaterThan(5);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// THE CORE INSIGHT
// ═══════════════════════════════════════════════════════════════════════════════

describe('Macro-Organismal Architecture - Core Insight', () => {
  test('Civilizations externalize internal architecture through objects', () => {
    // Every civilization maps its internal architecture to external objects
    for (const civ of ANCIENT_CIVILIZATIONS) {
      // Objects should stabilize the same relations the civilization prioritizes
      const objectRelations = new Set<ArchitecturalRelation>();
      for (const obj of civ.objects) {
        for (const rel of obj.stabilizes) {
          objectRelations.add(rel);
        }
      }
      
      // The civilization's primary relations should be covered by its objects
      for (const rel of civ.primaryRelations) {
        expect(objectRelations.has(rel)).toBe(true);
      }
    }
  });
  
  test('Trickster operations are core, not accidental', () => {
    // Count how many civilizations use each operation
    const opCounts: Record<TricksterOperation, number> = {
      transfer: 0,
      inversion: 0,
      bypass: 0,
      disguise: 0,
      reentry: 0,
    };
    
    for (const civ of ANCIENT_CIVILIZATIONS) {
      const ops = getTricksterOperations(civ);
      for (const op of ops) {
        opCounts[op]++;
      }
    }
    
    // Every operation should appear in multiple civilizations — they're universal
    for (const op of Object.keys(opCounts) as TricksterOperation[]) {
      expect(opCounts[op]).toBeGreaterThanOrEqual(2);
    }
  });
  
  test('Transfer is the most common trickster operation', () => {
    let transferCount = 0;
    for (const civ of ANCIENT_CIVILIZATIONS) {
      const ops = getTricksterOperations(civ);
      if (ops.includes('transfer')) transferCount++;
    }
    expect(transferCount).toBeGreaterThanOrEqual(8);
  });
});
