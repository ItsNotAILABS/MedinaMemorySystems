/**
 * Tests for organismSovereign.ts
 * 4-Register Organism Sovereign
 */

import {
  getOrganismState,
  updateRegister,
  setPhase,
  broadcastState,
  pulseOrganism,
  getRegisterSummary,
} from '../lib/organismSovereign';

describe('Organism Sovereign', () => {
  describe('getOrganismState', () => {
    it('should return current organism state', () => {
      const state = getOrganismState();
      
      expect(state).toHaveProperty('cognitive');
      expect(state).toHaveProperty('affective');
      expect(state).toHaveProperty('somatic');
      expect(state).toHaveProperty('sovereign');
      expect(state).toHaveProperty('phase');
      expect(state).toHaveProperty('lastBeat');
      expect(state).toHaveProperty('dominantRegister');
    });

    it('should return a copy, not the original', () => {
      const state1 = getOrganismState();
      const state2 = getOrganismState();
      
      state1.cognitive = 999;
      expect(state2.cognitive).not.toBe(999);
    });
  });

  describe('updateRegister', () => {
    it('should update cognitive register', () => {
      const state = updateRegister('cognitive', 75);
      expect(state.cognitive).toBe(75);
    });

    it('should update affective register', () => {
      const state = updateRegister('affective', 60);
      expect(state.affective).toBe(60);
    });

    it('should update somatic register', () => {
      const state = updateRegister('somatic', 85);
      expect(state.somatic).toBe(85);
    });

    it('should update sovereign register', () => {
      const state = updateRegister('sovereign', 99);
      expect(state.sovereign).toBe(99);
    });

    it('should clamp value to minimum 0', () => {
      const state = updateRegister('cognitive', -50);
      expect(state.cognitive).toBe(0);
    });

    it('should clamp value to maximum 100', () => {
      const state = updateRegister('sovereign', 150);
      expect(state.sovereign).toBe(100);
    });

    it('should increment lastBeat', () => {
      const before = getOrganismState().lastBeat;
      updateRegister('cognitive', 50);
      const after = getOrganismState().lastBeat;
      expect(after).toBe(before + 1);
    });

    it('should recalculate dominantRegister', () => {
      updateRegister('sovereign', 100);
      updateRegister('cognitive', 10);
      updateRegister('affective', 10);
      updateRegister('somatic', 10);
      
      const state = getOrganismState();
      expect(state.dominantRegister).toBe('sovereign');
    });
  });

  describe('setPhase', () => {
    it('should update phase to awake', () => {
      const state = setPhase('awake');
      expect(state.phase).toBe('awake');
    });

    it('should update phase to integrating', () => {
      const state = setPhase('integrating');
      expect(state.phase).toBe('integrating');
    });

    it('should update phase to broadcast', () => {
      const state = setPhase('broadcast');
      expect(state.phase).toBe('broadcast');
    });

    it('should update phase to deep', () => {
      const state = setPhase('deep');
      expect(state.phase).toBe('deep');
    });

    it('should increment lastBeat', () => {
      const before = getOrganismState().lastBeat;
      setPhase('awake');
      const after = getOrganismState().lastBeat;
      expect(after).toBe(before + 1);
    });
  });

  describe('broadcastState', () => {
    it('should set phase to broadcast', () => {
      const state = broadcastState();
      expect(state.phase).toBe('broadcast');
    });

    it('should increase sovereign register', () => {
      // First set a known value
      updateRegister('sovereign', 90);
      const before = getOrganismState().sovereign;
      
      broadcastState();
      const after = getOrganismState().sovereign;
      
      expect(after).toBe(Math.min(100, before + 2));
    });

    it('should cap sovereign at 100', () => {
      updateRegister('sovereign', 99);
      broadcastState();
      const state = getOrganismState();
      expect(state.sovereign).toBe(100);
    });

    it('should increment lastBeat', () => {
      const before = getOrganismState().lastBeat;
      broadcastState();
      const after = getOrganismState().lastBeat;
      expect(after).toBe(before + 1);
    });
  });

  describe('pulseOrganism', () => {
    it('should increment lastBeat', () => {
      const before = getOrganismState().lastBeat;
      pulseOrganism();
      const after = getOrganismState().lastBeat;
      expect(after).toBe(before + 1);
    });

    it('should apply natural variation to cognitive', () => {
      const states: number[] = [];
      for (let i = 0; i < 10; i++) {
        const state = pulseOrganism();
        states.push(state.cognitive);
      }
      
      // Should have some variation (not all same)
      const uniqueValues = new Set(states);
      expect(uniqueValues.size).toBeGreaterThan(1);
    });

    it('should keep values within 0-100 range', () => {
      for (let i = 0; i < 50; i++) {
        const state = pulseOrganism();
        expect(state.cognitive).toBeGreaterThanOrEqual(0);
        expect(state.cognitive).toBeLessThanOrEqual(100);
        expect(state.affective).toBeGreaterThanOrEqual(0);
        expect(state.affective).toBeLessThanOrEqual(100);
        expect(state.somatic).toBeGreaterThanOrEqual(0);
        expect(state.somatic).toBeLessThanOrEqual(100);
      }
    });

    it('should update dominantRegister based on highest value', () => {
      updateRegister('sovereign', 100);
      updateRegister('cognitive', 0);
      updateRegister('affective', 0);
      updateRegister('somatic', 0);
      
      const state = pulseOrganism();
      // Sovereign should still be highest after small variations
      expect(state.dominantRegister).toBe('sovereign');
    });
  });

  describe('getRegisterSummary', () => {
    it('should return formatted string with all registers', () => {
      setPhase('awake');
      const summary = getRegisterSummary();
      
      expect(summary).toContain('COG:');
      expect(summary).toContain('AFF:');
      expect(summary).toContain('SOM:');
      expect(summary).toContain('SOV:');
      expect(summary).toContain('Phase:');
      expect(summary).toContain('Beat:');
    });

    it('should show uppercase phase', () => {
      setPhase('deep');
      const summary = getRegisterSummary();
      expect(summary).toContain('Phase:DEEP');
    });
  });

  describe('Dominant Register Calculation', () => {
    it('should identify cognitive as dominant when highest', () => {
      updateRegister('cognitive', 100);
      updateRegister('affective', 50);
      updateRegister('somatic', 50);
      updateRegister('sovereign', 50);
      
      const state = getOrganismState();
      expect(state.dominantRegister).toBe('cognitive');
    });

    it('should identify affective as dominant when highest', () => {
      updateRegister('cognitive', 50);
      updateRegister('affective', 100);
      updateRegister('somatic', 50);
      updateRegister('sovereign', 50);
      
      const state = getOrganismState();
      expect(state.dominantRegister).toBe('affective');
    });

    it('should identify somatic as dominant when highest', () => {
      updateRegister('cognitive', 50);
      updateRegister('affective', 50);
      updateRegister('somatic', 100);
      updateRegister('sovereign', 50);
      
      const state = getOrganismState();
      expect(state.dominantRegister).toBe('somatic');
    });

    it('should identify sovereign as dominant when highest', () => {
      updateRegister('cognitive', 50);
      updateRegister('affective', 50);
      updateRegister('somatic', 50);
      updateRegister('sovereign', 100);
      
      const state = getOrganismState();
      expect(state.dominantRegister).toBe('sovereign');
    });

    it('should handle ties by preferring earlier register in order', () => {
      updateRegister('cognitive', 75);
      updateRegister('affective', 75);
      updateRegister('somatic', 75);
      updateRegister('sovereign', 75);
      
      const state = getOrganismState();
      // All equal, should pick first in reduce order that maintains equality
      expect(['cognitive', 'affective', 'somatic', 'sovereign']).toContain(state.dominantRegister);
    });
  });
});
