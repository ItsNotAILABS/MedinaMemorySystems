/**
 * Tests for commandParser.ts
 * Tests command parsing, validation, suggestions, and help functionality
 */

import { parseCommand, isCommand, getCommandHelp, suggestCommand } from '@/lib/commandParser';

describe('commandParser', () => {
  describe('parseCommand', () => {
    describe('valid commands', () => {
      it('should parse a simple command with module and verb', () => {
        const result = parseCommand('/memory find');
        expect(result.valid).toBe(true);
        expect(result.module).toBe('memory');
        expect(result.verb).toBe('find');
        expect(result.args).toEqual([]);
        expect(result.flags).toEqual({});
      });

      it('should parse command with positional arguments', () => {
        const result = parseCommand('/memory find test query');
        expect(result.valid).toBe(true);
        expect(result.module).toBe('memory');
        expect(result.verb).toBe('find');
        expect(result.args).toEqual(['test', 'query']);
      });

      it('should parse command with flag values', () => {
        const result = parseCommand('/memory find --limit=10 --type=semantic');
        expect(result.valid).toBe(true);
        expect(result.flags).toEqual({ limit: '10', type: 'semantic' });
        expect(result.args).toEqual([]);
      });

      it('should parse command with boolean flags', () => {
        const result = parseCommand('/memory find --pinned --verbose');
        expect(result.valid).toBe(true);
        expect(result.flags).toEqual({ pinned: true, verbose: true });
      });

      it('should parse command with mixed args and flags', () => {
        const result = parseCommand('/memory find query --limit=5 another --verbose');
        expect(result.valid).toBe(true);
        expect(result.args).toEqual(['query', 'another']);
        expect(result.flags).toEqual({ limit: '5', verbose: true });
      });

      it('should handle case insensitivity for module and verb', () => {
        const result = parseCommand('/MEMORY FIND');
        expect(result.valid).toBe(true);
        expect(result.module).toBe('memory');
        expect(result.verb).toBe('find');
      });

      it('should parse all governance commands', () => {
        const verbs = ['propose', 'vote', 'status', 'enact', 'audit', 'gates', 'list'];
        for (const verb of verbs) {
          const result = parseCommand(`/govern ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('govern');
          expect(result.verb).toBe(verb);
        }
      });

      it('should parse all model commands', () => {
        const verbs = ['invoke', 'status', 'route', 'list', 'health'];
        for (const verb of verbs) {
          const result = parseCommand(`/model ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('model');
          expect(result.verb).toBe(verb);
        }
      });

      it('should parse all company commands', () => {
        const verbs = ['connect', 'internalize', 'hybrid', 'status', 'list', 'sync'];
        for (const verb of verbs) {
          const result = parseCommand(`/company ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('company');
        }
      });

      it('should parse all replay commands', () => {
        const verbs = ['start', 'stop', 'play', 'list', 'export'];
        for (const verb of verbs) {
          const result = parseCommand(`/replay ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all permissions commands', () => {
        const verbs = ['grant', 'revoke', 'list', 'check'];
        for (const verb of verbs) {
          const result = parseCommand(`/permissions ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all organism commands', () => {
        const verbs = ['status', 'register', 'broadcast', 'phase'];
        for (const verb of verbs) {
          const result = parseCommand(`/organism ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse help command with no verb', () => {
        const result = parseCommand('/help');
        expect(result.valid).toBe(true);
        expect(result.module).toBe('help');
        expect(result.verb).toBe('');
      });

      it('should parse help commands verb', () => {
        const result = parseCommand('/help commands');
        expect(result.valid).toBe(true);
        expect(result.module).toBe('help');
        expect(result.verb).toBe('commands');
      });
    });

    describe('invalid commands', () => {
      it('should return invalid for non-command input', () => {
        const result = parseCommand('just regular text');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Not a command (no leading /)');
      });

      it('should return invalid for unknown module', () => {
        const result = parseCommand('/unknown test');
        expect(result.valid).toBe(false);
        expect(result.error).toContain("Unknown module '/unknown'");
      });

      it('should return invalid for unknown verb', () => {
        const result = parseCommand('/memory badverb');
        expect(result.valid).toBe(false);
        expect(result.error).toContain("Unknown verb 'badverb'");
      });

      it('should handle empty input', () => {
        const result = parseCommand('');
        expect(result.valid).toBe(false);
      });

      it('should handle only whitespace', () => {
        const result = parseCommand('   ');
        expect(result.valid).toBe(false);
      });

      it('should handle only slash', () => {
        const result = parseCommand('/');
        expect(result.valid).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should trim whitespace around command', () => {
        const result = parseCommand('  /memory find  ');
        expect(result.valid).toBe(true);
        expect(result.module).toBe('memory');
      });

      it('should handle multiple spaces between parts', () => {
        const result = parseCommand('/memory   find   arg1');
        expect(result.valid).toBe(true);
        expect(result.args).toEqual(['arg1']);
      });

      it('should preserve raw command in result', () => {
        const raw = '/memory find test';
        const result = parseCommand(raw);
        expect(result.raw).toBe(raw);
      });
    });
  });

  describe('isCommand', () => {
    it('should return true for strings starting with /', () => {
      expect(isCommand('/memory find')).toBe(true);
      expect(isCommand('/help')).toBe(true);
      expect(isCommand('/')).toBe(true);
    });

    it('should return false for non-commands', () => {
      expect(isCommand('hello world')).toBe(false);
      expect(isCommand('memory find')).toBe(false);
      expect(isCommand('')).toBe(false);
    });

    it('should handle whitespace-prefixed commands', () => {
      expect(isCommand('  /help')).toBe(true);
    });
  });

  describe('getCommandHelp', () => {
    it('should return list of modules when no module specified', () => {
      const help = getCommandHelp();
      expect(help).toContain('Available modules:');
      expect(help).toContain('/memory');
      expect(help).toContain('/govern');
      expect(help).toContain('/model');
    });

    it('should return module-specific help', () => {
      const help = getCommandHelp('memory');
      expect(help).toContain('/memory commands:');
      expect(help).toContain('find');
      expect(help).toContain('store');
      expect(help).toContain('pin');
    });

    it('should return governance help', () => {
      const help = getCommandHelp('govern');
      expect(help).toContain('/govern commands:');
      expect(help).toContain('propose');
      expect(help).toContain('vote');
    });

    it('should return generic help for unknown module', () => {
      const help = getCommandHelp('unknown');
      expect(help).toContain('Available modules:');
    });
  });

  describe('suggestCommand', () => {
    it('should suggest modules matching partial input', () => {
      const suggestions = suggestCommand('/mem');
      expect(suggestions).toContain('/memory');
    });

    it('should suggest all modules for just /', () => {
      const suggestions = suggestCommand('/');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions).toContain('/memory');
      expect(suggestions).toContain('/govern');
    });

    it('should suggest verbs for complete module', () => {
      const suggestions = suggestCommand('/memory f');
      expect(suggestions).toContain('/memory find');
    });

    it('should suggest all verbs for module with space', () => {
      const suggestions = suggestCommand('/memory ');
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-command input', () => {
      const suggestions = suggestCommand('hello');
      expect(suggestions).toEqual([]);
    });

    it('should return empty array for unknown module', () => {
      const suggestions = suggestCommand('/unknown verb');
      expect(suggestions).toEqual([]);
    });

    it('should filter verbs by partial match', () => {
      const suggestions = suggestCommand('/memory pi');
      expect(suggestions).toContain('/memory pin');
    });
  });
});
