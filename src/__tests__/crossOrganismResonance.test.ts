/**
 * Tests for crossOrganismResonance.ts
 * "Organisms working as a team pulse and influence each other's shell state"
 */

import * as cor from '../lib/crossOrganismResonance';
import { PHI, PHI_INVERSE, SCHUMANN_FUNDAMENTAL } from '../lib/kernelCompression';

describe('Cross-Organism Resonance Library', () => {
  describe('Shell State Management', () => {
    describe('createShellState', () => {
      it('should create shell state with all required properties', () => {
        const shell = cor.createShellState('shell-1', 'Sovereign', 432);
        
        expect(shell).toHaveProperty('id', 'shell-1');
        expect(shell).toHaveProperty('shellType', 'Sovereign');
        expect(shell).toHaveProperty('frequency', 432);
        expect(shell).toHaveProperty('amplitude');
        expect(shell).toHaveProperty('phase');
        expect(shell).toHaveProperty('harmonicLevel');
        expect(shell).toHaveProperty('coherence');
        expect(shell).toHaveProperty('registerState');
      });

      it('should initialize with golden ratio coherence', () => {
        const shell = cor.createShellState('shell-1', 'Document', 528);
        expect(shell.coherence).toBeCloseTo(PHI / (PHI + 1.0), 10);
      });

      it('should initialize amplitude to 1.0', () => {
        const shell = cor.createShellState('shell-1', 'Kernel', 100);
        expect(shell.amplitude).toBe(1.0);
      });
    });

    describe('initRegisterState', () => {
      it('should return default register values', () => {
        const reg = cor.initRegisterState();
        expect(reg.cognitive).toBe(87.0);
        expect(reg.affective).toBe(74.0);
        expect(reg.somatic).toBe(91.0);
        expect(reg.sovereign).toBe(96.0);
      });
    });

    describe('updateShellState', () => {
      it('should update frequency based on influence', () => {
        const shell = cor.createShellState('shell-1', 'Sovereign', 100);
        const updated = cor.updateShellState(shell, 200, 0.5, 0);
        
        // Frequency should move toward influence frequency
        expect(updated.frequency).toBeGreaterThan(100);
      });

      it('should update phase', () => {
        const shell = cor.createShellState('shell-1', 'Document', 100);
        shell.phase = 0;
        const updated = cor.updateShellState(shell, 100, 1.0, 180);
        
        expect(updated.phase).not.toBe(0);
      });

      it('should clamp coherence between 0 and 1', () => {
        const shell = cor.createShellState('shell-1', 'Kernel', 100);
        shell.coherence = 0.99;
        
        const updated = cor.updateShellState(shell, 100, 1.0, 0);
        expect(updated.coherence).toBeLessThanOrEqual(1.0);
        expect(updated.coherence).toBeGreaterThanOrEqual(0.0);
      });

      it('should update lastPulse timestamp', () => {
        const shell = cor.createShellState('shell-1', 'Workforce', 100);
        const initialTime = shell.lastPulse;
        
        // Small delay to ensure different timestamp
        const updated = cor.updateShellState(shell, 150, 0.5, 45);
        expect(new Date(updated.lastPulse).getTime())
          .toBeGreaterThanOrEqual(new Date(initialTime).getTime());
      });
    });
  });

  describe('Resonance Links', () => {
    describe('createLink', () => {
      it('should create link with correct properties', () => {
        const link = cor.createLink('source-1', 'target-1', 'Harmonic', 432, true);
        
        expect(link.sourceId).toBe('source-1');
        expect(link.targetId).toBe('target-1');
        expect(link.linkType).toBe('Harmonic');
        expect(link.frequency).toBe(432);
        expect(link.bidirectional).toBe(true);
      });

      it('should set strength based on link type', () => {
        const harmonic = cor.createLink('a', 'b', 'Harmonic', 100, false);
        expect(harmonic.strength).toBeCloseTo(PHI / (PHI + 1.0), 10);

        const subharmonic = cor.createLink('a', 'b', 'Subharmonic', 100, false);
        expect(subharmonic.strength).toBeCloseTo(PHI_INVERSE, 10);

        const entangled = cor.createLink('a', 'b', 'Entangled', 100, false);
        expect(entangled.strength).toBe(1.0);
      });
    });

    describe('strengthenLink', () => {
      it('should increase strength', () => {
        const link = cor.createLink('a', 'b', 'Harmonic', 100, false);
        const strengthened = cor.strengthenLink(link);
        
        expect(strengthened.strength).toBeGreaterThan(link.strength);
      });

      it('should cap strength at 1.0', () => {
        let link = cor.createLink('a', 'b', 'Entangled', 100, false);
        link.strength = 0.99;
        
        const strengthened = cor.strengthenLink(link);
        expect(strengthened.strength).toBeLessThanOrEqual(1.0);
      });

      it('should update lastResonance', () => {
        const link = cor.createLink('a', 'b', 'Harmonic', 100, false);
        const strengthened = cor.strengthenLink(link);
        
        expect(new Date(strengthened.lastResonance).getTime())
          .toBeGreaterThanOrEqual(new Date(link.lastResonance).getTime());
      });
    });

    describe('weakenLink', () => {
      it('should decrease strength over time', () => {
        const link = cor.createLink('a', 'b', 'Harmonic', 100, false);
        // Simulate old link
        link.lastResonance = new Date(Date.now() - 100000).toISOString();
        
        const weakened = cor.weakenLink(link);
        expect(weakened.strength).toBeLessThan(link.strength);
      });

      it('should not go below 0', () => {
        const link = cor.createLink('a', 'b', 'Complementary', 100, false);
        link.strength = 0.01;
        link.lastResonance = new Date(Date.now() - 1000000).toISOString();
        
        const weakened = cor.weakenLink(link);
        expect(weakened.strength).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Pulse Propagation', () => {
    describe('createPulse', () => {
      it('should create pulse with required properties', () => {
        const pulse = cor.createPulse('org-1', 432, 0.8, 10);
        
        expect(pulse).toHaveProperty('id');
        expect(pulse.sourceOrganismId).toBe('org-1');
        expect(pulse.frequency).toBe(432);
        expect(pulse.amplitude).toBe(0.8);
        expect(pulse.beat).toBe(10);
      });

      it('should set propagation speed to PHI', () => {
        const pulse = cor.createPulse('org-1', 100, 1.0, 1);
        expect(pulse.propagationSpeed).toBe(PHI);
      });

      it('should allow kernel payload', () => {
        const pulse = cor.createPulse('org-1', 100, 1.0, 1, { id: 'kernel-1' } as any);
        expect(pulse.payload).toBeDefined();
        expect(pulse.payload!.id).toBe('kernel-1');
      });
    });

    describe('propagatePulse', () => {
      it('should affect connected shells', () => {
        const shells = [
          cor.createShellState('shell-1', 'Sovereign', 100),
          cor.createShellState('shell-2', 'Document', 200),
        ];
        const links = [cor.createLink('shell-1', 'shell-2', 'Harmonic', 150, false)];
        const pulse = cor.createPulse('shell-1', 150, 1.0, 1);
        
        const affected = cor.propagatePulse(pulse, shells, links);
        expect(affected.length).toBe(1);
        expect(affected[0].shell.id).toBe('shell-2');
      });

      it('should not affect source organism', () => {
        const shells = [cor.createShellState('shell-1', 'Sovereign', 100)];
        const links: cor.ResonanceLink[] = [];
        const pulse = cor.createPulse('shell-1', 150, 1.0, 1);
        
        const affected = cor.propagatePulse(pulse, shells, links);
        expect(affected.length).toBe(0);
      });

      it('should respect bidirectional links', () => {
        const shells = [
          cor.createShellState('shell-1', 'Sovereign', 100),
          cor.createShellState('shell-2', 'Document', 200),
        ];
        const links = [cor.createLink('shell-2', 'shell-1', 'Harmonic', 150, true)];
        const pulse = cor.createPulse('shell-1', 150, 1.0, 1);
        
        const affected = cor.propagatePulse(pulse, shells, links);
        expect(affected.length).toBe(1);
      });
    });

    describe('decayPulse', () => {
      it('should reduce amplitude', () => {
        const pulse = cor.createPulse('org-1', 432, 1.0, 1);
        const decayed = cor.decayPulse(pulse);
        
        expect(decayed.amplitude).toBeLessThan(pulse.amplitude);
      });
    });

    describe('isPulseActive', () => {
      it('should return true for amplitude > 0.01', () => {
        const pulse = cor.createPulse('org-1', 100, 0.5, 1);
        expect(cor.isPulseActive(pulse)).toBe(true);
      });

      it('should return false for very low amplitude', () => {
        const pulse = cor.createPulse('org-1', 100, 0.005, 1);
        expect(cor.isPulseActive(pulse)).toBe(false);
      });
    });
  });

  describe('Network Coordination', () => {
    describe('createNetwork', () => {
      it('should create empty network', () => {
        const network = cor.createNetwork();
        
        expect(network.organisms).toEqual([]);
        expect(network.links).toEqual([]);
        expect(network.activePulses).toEqual([]);
        expect(network.networkFrequency).toBe(SCHUMANN_FUNDAMENTAL);
        expect(network.networkCoherence).toBe(1.0);
      });
    });

    describe('addOrganism', () => {
      it('should add organism to network', () => {
        const network = cor.createNetwork();
        const shell = cor.createShellState('shell-1', 'Sovereign', 432);
        
        const updated = cor.addOrganism(network, shell);
        expect(updated.organisms.length).toBe(1);
        expect(updated.organisms[0].id).toBe('shell-1');
      });
    });

    describe('addLink', () => {
      it('should add link to network', () => {
        const network = cor.createNetwork();
        const link = cor.createLink('a', 'b', 'Harmonic', 100, true);
        
        const updated = cor.addLink(network, link);
        expect(updated.links.length).toBe(1);
      });
    });

    describe('networkTick', () => {
      it('should process active pulses', () => {
        let network = cor.createNetwork();
        network = cor.addOrganism(network, cor.createShellState('shell-1', 'Sovereign', 100));
        network = cor.addOrganism(network, cor.createShellState('shell-2', 'Document', 200));
        network = cor.addLink(network, cor.createLink('shell-1', 'shell-2', 'Harmonic', 150, false));
        network = cor.broadcastPulse(network, cor.createPulse('shell-1', 150, 1.0, 1));
        
        const ticked = cor.networkTick(network, 2);
        
        // Pulse should decay
        expect(ticked.activePulses[0].amplitude).toBeLessThan(1.0);
      });

      it('should remove very weak links', () => {
        let network = cor.createNetwork();
        const weakLink = cor.createLink('a', 'b', 'Complementary', 100, false);
        weakLink.strength = 0.05;
        weakLink.lastResonance = new Date(Date.now() - 100000).toISOString();
        network = cor.addLink(network, weakLink);
        
        const ticked = cor.networkTick(network, 1);
        expect(ticked.links.length).toBe(0);
      });

      it('should calculate network coherence', () => {
        let network = cor.createNetwork();
        network = cor.addOrganism(network, cor.createShellState('shell-1', 'Sovereign', 100));
        network = cor.addOrganism(network, cor.createShellState('shell-2', 'Document', 100));
        
        const ticked = cor.networkTick(network, 1);
        expect(ticked.networkCoherence).toBeGreaterThan(0);
        expect(ticked.networkCoherence).toBeLessThanOrEqual(1);
      });
    });

    describe('broadcastPulse', () => {
      it('should add pulse to network', () => {
        const network = cor.createNetwork();
        const pulse = cor.createPulse('org-1', 432, 1.0, 1);
        
        const updated = cor.broadcastPulse(network, pulse);
        expect(updated.activePulses.length).toBe(1);
      });
    });
  });

  describe('Team Resonance', () => {
    describe('createTeamResonance', () => {
      it('should create links between all team members', () => {
        const links = cor.createTeamResonance(['a', 'b', 'c'], 432);
        
        // 3 members = 3 pairs (a-b, a-c, b-c)
        expect(links.length).toBe(3);
      });

      it('should create bidirectional harmonic links', () => {
        const links = cor.createTeamResonance(['a', 'b'], 528);
        
        expect(links[0].bidirectional).toBe(true);
        expect(links[0].linkType).toBe('Harmonic');
      });
    });

    describe('synchronizeTeam', () => {
      it('should set all shells to target frequency', () => {
        const shells = [
          cor.createShellState('a', 'Sovereign', 100),
          cor.createShellState('b', 'Document', 200),
        ];
        
        const synced = cor.synchronizeTeam(shells, 432);
        expect(synced.every(s => s.frequency === 432)).toBe(true);
      });

      it('should reset phase to 0', () => {
        const shells = [cor.createShellState('a', 'Sovereign', 100)];
        shells[0].phase = 180;
        
        const synced = cor.synchronizeTeam(shells, 432);
        expect(synced[0].phase).toBe(0);
      });
    });

    describe('teamResonanceScore', () => {
      it('should return 0 for empty team', () => {
        expect(cor.teamResonanceScore([])).toBe(0);
      });

      it('should return higher score for synchronized team', () => {
        const syncedShells = [
          { ...cor.createShellState('a', 'Sovereign', 432), coherence: 0.9 },
          { ...cor.createShellState('b', 'Document', 432), coherence: 0.9 },
        ];
        const unsyncedShells = [
          { ...cor.createShellState('a', 'Sovereign', 100), coherence: 0.5 },
          { ...cor.createShellState('b', 'Document', 900), coherence: 0.5 },
        ];
        
        expect(cor.teamResonanceScore(syncedShells))
          .toBeGreaterThan(cor.teamResonanceScore(unsyncedShells));
      });
    });
  });

  describe('Schumann Frequency Alignment', () => {
    describe('alignToSchumann', () => {
      it('should set frequency to Schumann harmonic', () => {
        const shell = cor.createShellState('a', 'Sovereign', 432);
        const aligned = cor.alignToSchumann(shell, 3);
        
        expect(aligned.frequency).toBe(SCHUMANN_FUNDAMENTAL * 3);
        expect(aligned.harmonicLevel).toBe(3);
      });

      it('should boost coherence', () => {
        const shell = cor.createShellState('a', 'Sovereign', 432);
        const aligned = cor.alignToSchumann(shell, 1);
        
        expect(aligned.coherence).toBeGreaterThan(shell.coherence);
      });
    });

    describe('schumannHarmonics', () => {
      it('should return 7 Schumann harmonics', () => {
        const harmonics = cor.schumannHarmonics();
        expect(harmonics.length).toBe(7);
        expect(harmonics[0]).toBe(7.83);
      });
    });
  });

  describe('Visualization Helpers', () => {
    describe('getShellColor', () => {
      it('should return HSL color string', () => {
        const shell = cor.createShellState('a', 'Sovereign', 180);
        const color = cor.getShellColor(shell);
        expect(color).toMatch(/^hsl\(\d+(\.\d+)?, \d+(\.\d+)?%, \d+(\.\d+)?%\)$/);
      });
    });

    describe('getLinkOpacity', () => {
      it('should return opacity based on strength', () => {
        const link = cor.createLink('a', 'b', 'Harmonic', 100, false);
        const opacity = cor.getLinkOpacity(link);
        
        expect(opacity).toBeGreaterThanOrEqual(0.1);
        expect(opacity).toBeLessThanOrEqual(1);
      });
    });

    describe('getPulseSize', () => {
      it('should return size based on amplitude', () => {
        const pulse = cor.createPulse('a', 100, 1.0, 1);
        const size = cor.getPulseSize(pulse);
        
        expect(size).toBe(10 + 1.0 * 40);
      });
    });

    describe('networkHealthScore', () => {
      it('should calculate health from coherence, links, and organisms', () => {
        let network = cor.createNetwork();
        network = cor.addOrganism(network, cor.createShellState('a', 'Sovereign', 100));
        network = cor.addLink(network, cor.createLink('a', 'b', 'Harmonic', 100, false));
        
        const score = cor.networkHealthScore(network);
        expect(score).toBeGreaterThan(0);
      });
    });
  });
});
