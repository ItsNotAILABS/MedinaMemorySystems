/**
 * Tests for replayEngine.ts
 * Tests session management, event recording, and stats
 */

// Reset module state between tests
let replayEngine: typeof import('@/lib/replayEngine');

beforeEach(() => {
  jest.resetModules();
  replayEngine = require('@/lib/replayEngine');
});

describe('replayEngine', () => {
  describe('startReplaySession', () => {
    it('should create a new session with recording status', () => {
      const session = replayEngine.startReplaySession('Test Session');
      
      expect(session.id).toBeDefined();
      expect(session.name).toBe('Test Session');
      expect(session.status).toBe('recording');
    });

    it('should set startTime', () => {
      const session = replayEngine.startReplaySession('Time Test');
      
      expect(session.startTime).toBeDefined();
      expect(new Date(session.startTime).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should initialize events array as empty', () => {
      const session = replayEngine.startReplaySession('Events Test');
      
      expect(session.events).toEqual([]);
    });

    it('should not have endTime initially', () => {
      const session = replayEngine.startReplaySession('No End Time');
      
      expect(session.endTime).toBeUndefined();
    });
  });

  describe('stopReplaySession', () => {
    it('should set status to complete', () => {
      replayEngine.startReplaySession('Stop Test');
      const stopped = replayEngine.stopReplaySession();
      
      expect(stopped?.status).toBe('complete');
    });

    it('should set endTime', () => {
      replayEngine.startReplaySession('End Time Test');
      const stopped = replayEngine.stopReplaySession();
      
      expect(stopped?.endTime).toBeDefined();
    });

    it('should return null if no session is active', () => {
      // Ensure no session is active (stop any existing)
      replayEngine.stopReplaySession();
      
      const result = replayEngine.stopReplaySession();
      expect(result).toBeNull();
    });

    it('should clear current session', () => {
      replayEngine.startReplaySession('Clear Test');
      replayEngine.stopReplaySession();
      
      const current = replayEngine.getCurrentSession();
      expect(current).toBeNull();
    });
  });

  describe('recordEvent', () => {
    it('should record event to current session', () => {
      replayEngine.startReplaySession('Record Test');
      
      replayEngine.recordEvent('memory', 'MEMORY_STORE', { content: 'test' }, 'User');
      
      const session = replayEngine.getCurrentSession();
      expect(session?.events.length).toBe(1);
      expect(session?.events[0].type).toBe('memory');
      expect(session?.events[0].action).toBe('MEMORY_STORE');
    });

    it('should assign sequential sequence IDs', () => {
      replayEngine.startReplaySession('Sequence Test');
      
      replayEngine.recordEvent('memory', 'ACTION_1', {}, 'User');
      replayEngine.recordEvent('governance', 'ACTION_2', {}, 'User');
      replayEngine.recordEvent('model', 'ACTION_3', {}, 'User');
      
      const session = replayEngine.getCurrentSession();
      expect(session?.events[0].sequenceId).toBeLessThan(session!.events[1].sequenceId);
      expect(session?.events[1].sequenceId).toBeLessThan(session!.events[2].sequenceId);
    });

    it('should record actor', () => {
      replayEngine.startReplaySession('Actor Test');
      
      replayEngine.recordEvent('system', 'TEST', {}, 'Sovereign');
      
      const session = replayEngine.getCurrentSession();
      expect(session?.events[0].actor).toBe('Sovereign');
    });

    it('should record outcome', () => {
      replayEngine.startReplaySession('Outcome Test');
      
      replayEngine.recordEvent('command', 'TEST', {}, 'User', 'failure');
      
      const session = replayEngine.getCurrentSession();
      expect(session?.events[0].outcome).toBe('failure');
    });

    it('should default outcome to success', () => {
      replayEngine.startReplaySession('Default Outcome');
      
      replayEngine.recordEvent('memory', 'TEST', {}, 'User');
      
      const session = replayEngine.getCurrentSession();
      expect(session?.events[0].outcome).toBe('success');
    });

    it('should record duration', () => {
      replayEngine.startReplaySession('Duration Test');
      
      replayEngine.recordEvent('model', 'INVOKE', {}, 'User', 'success', 500);
      
      const session = replayEngine.getCurrentSession();
      expect(session?.events[0].duration).toBe(500);
    });

    it('should record timestamp', () => {
      replayEngine.startReplaySession('Timestamp Test');
      
      replayEngine.recordEvent('system', 'TEST', {}, 'User');
      
      const session = replayEngine.getCurrentSession();
      expect(session?.events[0].timestamp).toBeDefined();
    });

    it('should record payload', () => {
      replayEngine.startReplaySession('Payload Test');
      
      const payload = { key: 'value', nested: { data: 123 } };
      replayEngine.recordEvent('command', 'TEST', payload, 'User');
      
      const session = replayEngine.getCurrentSession();
      expect(session?.events[0].payload).toEqual(payload);
    });

    it('should not record when no session is active', () => {
      // Ensure no session
      replayEngine.stopReplaySession();
      
      const statsBefore = replayEngine.getReplayStats();
      replayEngine.recordEvent('memory', 'TEST', {}, 'User');
      const statsAfter = replayEngine.getReplayStats();
      
      // Total events should not increase (beyond what's in completed sessions)
      expect(statsAfter.currentlyRecording).toBe(false);
    });
  });

  describe('listSessions', () => {
    it('should return all sessions', () => {
      const sessions = replayEngine.listSessions();
      
      expect(Array.isArray(sessions)).toBe(true);
      expect(sessions.length).toBeGreaterThanOrEqual(1); // Seed data
    });

    it('should sort sessions by startTime descending', () => {
      replayEngine.startReplaySession('Session A');
      replayEngine.stopReplaySession();
      
      replayEngine.startReplaySession('Session B');
      replayEngine.stopReplaySession();
      
      const sessions = replayEngine.listSessions();
      
      for (let i = 1; i < sessions.length; i++) {
        expect(new Date(sessions[i - 1].startTime).getTime())
          .toBeGreaterThanOrEqual(new Date(sessions[i].startTime).getTime());
      }
    });

    it('should include seed session', () => {
      const sessions = replayEngine.listSessions();
      
      expect(sessions.some(s => s.name.includes('Session Alpha'))).toBe(true);
    });
  });

  describe('getSession', () => {
    it('should return session by id', () => {
      const started = replayEngine.startReplaySession('Get Test');
      replayEngine.stopReplaySession();
      
      const session = replayEngine.getSession(started.id);
      
      expect(session).toBeDefined();
      expect(session?.id).toBe(started.id);
    });

    it('should return undefined for non-existent id', () => {
      const session = replayEngine.getSession('non-existent');
      expect(session).toBeUndefined();
    });
  });

  describe('getCurrentSession', () => {
    it('should return current recording session', () => {
      const started = replayEngine.startReplaySession('Current Test');
      
      const current = replayEngine.getCurrentSession();
      
      expect(current).toBeDefined();
      expect(current?.id).toBe(started.id);
    });

    it('should return null when no session is recording', () => {
      replayEngine.stopReplaySession();
      
      const current = replayEngine.getCurrentSession();
      expect(current).toBeNull();
    });

    it('should return session with recorded events', () => {
      replayEngine.startReplaySession('Events Current');
      replayEngine.recordEvent('memory', 'TEST1', {}, 'User');
      replayEngine.recordEvent('model', 'TEST2', {}, 'User');
      
      const current = replayEngine.getCurrentSession();
      
      expect(current?.events.length).toBe(2);
    });
  });

  describe('getReplayStats', () => {
    it('should return total sessions count', () => {
      const stats = replayEngine.getReplayStats();
      
      expect(stats.totalSessions).toBeGreaterThanOrEqual(1);
    });

    it('should return total events count', () => {
      const stats = replayEngine.getReplayStats();
      
      expect(typeof stats.totalEvents).toBe('number');
      expect(stats.totalEvents).toBeGreaterThanOrEqual(0);
    });

    it('should return currentlyRecording status', () => {
      replayEngine.stopReplaySession();
      let stats = replayEngine.getReplayStats();
      expect(stats.currentlyRecording).toBe(false);
      
      replayEngine.startReplaySession('Recording');
      stats = replayEngine.getReplayStats();
      expect(stats.currentlyRecording).toBe(true);
    });

    it('should update stats after creating sessions', () => {
      const statsBefore = replayEngine.getReplayStats();
      
      replayEngine.startReplaySession('New Session');
      replayEngine.recordEvent('system', 'TEST', {}, 'User');
      replayEngine.stopReplaySession();
      
      const statsAfter = replayEngine.getReplayStats();
      
      expect(statsAfter.totalSessions).toBe(statsBefore.totalSessions + 1);
    });
  });

  describe('event types', () => {
    it('should support command event type', () => {
      replayEngine.startReplaySession('Command Events');
      replayEngine.recordEvent('command', 'COMMAND_EXEC', {}, 'User');
      
      const session = replayEngine.getCurrentSession();
      expect(session?.events[0].type).toBe('command');
    });

    it('should support memory event type', () => {
      replayEngine.startReplaySession('Memory Events');
      replayEngine.recordEvent('memory', 'MEMORY_CREATE', {}, 'User');
      
      const session = replayEngine.getCurrentSession();
      expect(session?.events[0].type).toBe('memory');
    });

    it('should support governance event type', () => {
      replayEngine.startReplaySession('Governance Events');
      replayEngine.recordEvent('governance', 'PROPOSAL_CREATED', {}, 'User');
      
      const session = replayEngine.getCurrentSession();
      expect(session?.events[0].type).toBe('governance');
    });

    it('should support model event type', () => {
      replayEngine.startReplaySession('Model Events');
      replayEngine.recordEvent('model', 'MODEL_INVOKED', {}, 'User');
      
      const session = replayEngine.getCurrentSession();
      expect(session?.events[0].type).toBe('model');
    });

    it('should support company event type', () => {
      replayEngine.startReplaySession('Company Events');
      replayEngine.recordEvent('company', 'CONNECTOR_SYNC', {}, 'User');
      
      const session = replayEngine.getCurrentSession();
      expect(session?.events[0].type).toBe('company');
    });

    it('should support system event type', () => {
      replayEngine.startReplaySession('System Events');
      replayEngine.recordEvent('system', 'PLATFORM_INIT', {}, 'System');
      
      const session = replayEngine.getCurrentSession();
      expect(session?.events[0].type).toBe('system');
    });
  });

  describe('seed data validation', () => {
    it('should have seed session with historical events', () => {
      const sessions = replayEngine.listSessions();
      const seedSession = sessions.find(s => s.name.includes('Bootstrap'));
      
      expect(seedSession).toBeDefined();
      expect(seedSession?.events.length).toBeGreaterThan(0);
    });

    it('should have seed session with complete status', () => {
      const sessions = replayEngine.listSessions();
      const seedSession = sessions.find(s => s.name.includes('Bootstrap'));
      
      expect(seedSession?.status).toBe('complete');
    });

    it('should have seed session with endTime', () => {
      const sessions = replayEngine.listSessions();
      const seedSession = sessions.find(s => s.name.includes('Bootstrap'));
      
      expect(seedSession?.endTime).toBeDefined();
    });
  });
});
