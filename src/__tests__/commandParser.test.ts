/**
 * Tests for commandParser.ts
 * Tests command parsing, validation, suggestions, and help functionality
 * Covers all 58 modules / 476 verbs of the Sovereign Omni-Intelligence CLI
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

      it('should parse all memory commands', () => {
        const verbs = ['find', 'store', 'pin', 'unpin', 'delete', 'lineage', 'navigate', 'dual', 'list', 'root', 'update', 'stats', 'pinned'];
        for (const verb of verbs) {
          const result = parseCommand(`/memory ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('memory');
          expect(result.verb).toBe(verb);
        }
      });

      it('should handle case insensitivity for module and verb', () => {
        const result = parseCommand('/MEMORY FIND');
        expect(result.valid).toBe(true);
        expect(result.module).toBe('memory');
        expect(result.verb).toBe('find');
      });

      it('should parse all governance commands', () => {
        const verbs = ['propose', 'vote', 'status', 'enact', 'audit', 'gates', 'list', 'open', 'stats'];
        for (const verb of verbs) {
          const result = parseCommand(`/govern ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('govern');
          expect(result.verb).toBe(verb);
        }
      });

      it('should parse all model commands', () => {
        const verbs = ['invoke', 'status', 'route', 'list', 'health', 'history', 'stats'];
        for (const verb of verbs) {
          const result = parseCommand(`/model ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('model');
          expect(result.verb).toBe(verb);
        }
      });

      it('should parse all company commands', () => {
        const verbs = ['connect', 'internalize', 'hybrid', 'status', 'list', 'sync', 'create', 'get', 'default', 'stats'];
        for (const verb of verbs) {
          const result = parseCommand(`/company ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('company');
        }
      });

      it('should parse all replay commands', () => {
        const verbs = ['start', 'stop', 'play', 'list', 'export', 'record', 'get', 'current', 'stats'];
        for (const verb of verbs) {
          const result = parseCommand(`/replay ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all permissions commands', () => {
        const verbs = ['grant', 'revoke', 'list', 'check', 'principal', 'stats'];
        for (const verb of verbs) {
          const result = parseCommand(`/permissions ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all organism commands', () => {
        const verbs = ['status', 'register', 'broadcast', 'phase', 'pulse', 'summary'];
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

      // ── Engine modules ──────────────────────────────────────────────

      it('should parse all campaign commands', () => {
        const verbs = ['create', 'get', 'update', 'delete', 'list', 'launch', 'pause', 'complete', 'target', 'content', 'metrics', 'simulate', 'templates', 'template', 'fromtemplate', 'history', 'stats'];
        for (const verb of verbs) {
          const result = parseCommand(`/campaign ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('campaign');
          expect(result.verb).toBe(verb);
        }
      });

      it('should parse all voice commands', () => {
        const verbs = ['speak', 'nova', 'listen', 'stop', 'waveform', 'recognition', 'state'];
        for (const verb of verbs) {
          const result = parseCommand(`/voice ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('voice');
        }
      });

      it('should parse all message commands', () => {
        const verbs = ['draft', 'update', 'delete', 'get', 'list', 'attach', 'detach', 'send', 'approve', 'reject', 'templates', 'template', 'apply', 'fromtemplate', 'schedule', 'cancel', 'stats', 'sent', 'pending'];
        for (const verb of verbs) {
          const result = parseCommand(`/message ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('message');
        }
      });

      it('should parse all export commands', () => {
        const verbs = ['pdf', 'excel', 'json', 'memories', 'proposals', 'report', 'bizplan', 'social', 'execute'];
        for (const verb of verbs) {
          const result = parseCommand(`/export ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('export');
        }
      });

      it('should parse all document commands', () => {
        const verbs = ['list', 'get', 'create', 'update'];
        for (const verb of verbs) {
          const result = parseCommand(`/document ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('document');
        }
      });

      it('should parse all device commands', () => {
        const verbs = ['register', 'current', 'list', 'request', 'revoke', 'sensors', 'stop', 'heartbeat', 'state', 'rerequest'];
        for (const verb of verbs) {
          const result = parseCommand(`/device ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('device');
        }
      });

      it('should parse all kernel commands', () => {
        const verbs = ['create', 'execute', 'cycle', 'transition', 'active', 'frequency', 'resonance', 'glyphs', 'color', 'expand', 'compress', 'decompress', 'transcend', 'merge', 'contract', 'mutate', 'verify', 'signature', 'formula', 'registry', 'find', 'count', 'deps', 'list', 'decode', 'distance', 'nearest'];
        for (const verb of verbs) {
          const result = parseCommand(`/kernel ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('kernel');
        }
      });

      it('should parse all edge commands', () => {
        const verbs = ['sense', 'circuit', 'failure', 'check', 'reset', 'validate', 'capture', 'restore', 'browser', 'stats', 'recent', 'clear'];
        for (const verb of verbs) {
          const result = parseCommand(`/edge ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('edge');
        }
      });

      it('should parse all resonance commands', () => {
        const verbs = ['shell', 'init', 'update', 'link', 'strengthen', 'weaken', 'pulse', 'propagate', 'decay', 'active', 'network', 'add', 'connect', 'tick', 'broadcast', 'team', 'sync', 'score', 'schumann', 'harmonics', 'color', 'opacity', 'size', 'health'];
        for (const verb of verbs) {
          const result = parseCommand(`/resonance ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('resonance');
        }
      });

      it('should parse all recital commands', () => {
        const verbs = ['initiate', 'advance', 'complete', 'get', 'calculate'];
        for (const verb of verbs) {
          const result = parseCommand(`/recital ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all gate commands', () => {
        const verbs = ['check', 'enforce', 'all', 'escalate', 'resolve'];
        for (const verb of verbs) {
          const result = parseCommand(`/gate ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all encryption commands', () => {
        const verbs = ['key', 'rotate', 'cycle', 'phi', 'fibonacci', 'keylength', 'derive', 'hash', 'artifact', 'signature', 'info'];
        for (const verb of verbs) {
          const result = parseCommand(`/encryption ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all wire commands', () => {
        const verbs = ['request', 'response', 'audit', 'sync', 'route'];
        for (const verb of verbs) {
          const result = parseCommand(`/wire ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all icp commands', () => {
        const verbs = ['phi', 'spacing', 'angle', 'encode', 'spiral', 'fibonacci', 'harmonic', 'note', 'octave', 'harmonize', 'signature', 'recital', 'health', 'coherence', 'energy', 'hash', 'ladder', 'tick', 'oro', 'nova', 'vitals'];
        for (const verb of verbs) {
          const result = parseCommand(`/icp ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('icp');
        }
      });

      // ── Contract & Ledger modules ───────────────────────────────────

      it('should parse all contract commands', () => {
        const verbs = ['create', 'sign', 'types', 'founder', 'enterprise', 'ip', 'absorption', 'agent', 'law', 'succession', 'royalty', 'csr', 'freeze', 'session', 'formation', 'selfmod', 'geomagnetic'];
        for (const verb of verbs) {
          const result = parseCommand(`/contract ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('contract');
        }
      });

      it('should parse all ledger commands', () => {
        const verbs = ['types', 'founder', 'enterprise', 'ip', 'migration', 'agent', 'law', 'lineage', 'royalty', 'csr', 'freeze', 'session', 'memory', 'evolution', 'warning', 'proof'];
        for (const verb of verbs) {
          const result = parseCommand(`/ledger ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('ledger');
        }
      });

      // ── CPL (Cognitive Processing Language) ─────────────────────────

      it('should parse all CPL commands', () => {
        const verbs = ['status', 'fields', 'perception', 'reasoning', 'memory', 'learning', 'attention', 'engines', 'syntax', 'sovereign', 'hybrid', 'compression', 'glyphs', 'vocabulary', 'ledger', 'organism', 'primordial', 'intent', 'palace', 'correspondence', 'vibration', 'compile'];
        for (const verb of verbs) {
          const result = parseCommand(`/cpl ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('cpl');
        }
      });

      // ── Intelligence modules ────────────────────────────────────────

      it('should parse all intelligence commands', () => {
        const verbs = ['list', 'get', 'category', 'technology', 'manifest', 'render', 'reactive', 'canvas', 'worker', 'crypto', 'storage', 'network', 'sensor', 'wasm', 'awareness', 'family', 'cost', 'registry'];
        for (const verb of verbs) {
          const result = parseCommand(`/intelligence ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('intelligence');
        }
      });

      it('should parse all nexus commands', () => {
        const verbs = ['link', 'frontend', 'ui', 'math', 'flow', 'types', 'extensions', 'deep', 'architecture', 'enterprise', 'organism', 'backend', 'os', 'devtools', 'client', 'staffing', 'complete'];
        for (const verb of verbs) {
          const result = parseCommand(`/nexus ${verb}`);
          expect(result.valid).toBe(true);
          expect(result.module).toBe('nexus');
        }
      });

      // ── Organism subsystem modules ──────────────────────────────────

      it('should parse all deploy commands', () => {
        const verbs = ['agent', 'team', 'move', 'fill', 'probe', 'test', 'root', 'multi'];
        for (const verb of verbs) {
          const result = parseCommand(`/deploy ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all synthesis commands', () => {
        const verbs = ['synthesize', 'knowledge', 'pass', 'systems', 'seed'];
        for (const verb of verbs) {
          const result = parseCommand(`/synthesis ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all wiring commands', () => {
        const verbs = ['transfer', 'inversion', 'bypass', 'disguise', 'reentry', 'domains', 'root', 'edges'];
        for (const verb of verbs) {
          const result = parseCommand(`/wiring ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      // ── Package modules ─────────────────────────────────────────────

      it('should parse all signal commands', () => {
        const verbs = ['emit', 'listen', 'channel', 'bus'];
        for (const verb of verbs) {
          const result = parseCommand(`/signal ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all consensus commands', () => {
        const verbs = ['vote', 'summarise', 'weights', 'result'];
        for (const verb of verbs) {
          const result = parseCommand(`/consensus ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all frequency commands', () => {
        const verbs = ['entrain', 'band', 'profile', 'schumann'];
        for (const verb of verbs) {
          const result = parseCommand(`/frequency ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all vault commands', () => {
        const verbs = ['store', 'get', 'list', 'size', 'decay', 'strength'];
        for (const verb of verbs) {
          const result = parseCommand(`/vault ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all translate commands', () => {
        const verbs = ['maven', 'nuget', 'ruby', 'docker', 'source', 'export'];
        for (const verb of verbs) {
          const result = parseCommand(`/translate ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all council commands', () => {
        const verbs = ['alpha', 'praefectus', 'oraculum', 'motus', 'visio', 'solver', 'architectus', 'cognitor', 'verificator', 'found'];
        for (const verb of verbs) {
          const result = parseCommand(`/council ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all marketplace commands', () => {
        const verbs = ['list', 'find', 'install', 'public', 'commercial', 'internal', 'catalog'];
        for (const verb of verbs) {
          const result = parseCommand(`/marketplace ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse all sdk commands', () => {
        const verbs = ['init', 'store', 'retrieve', 'spatial', 'documents', 'graph', 'search', 'context', 'patterns', 'temporal', 'harmonic', 'teams'];
        for (const verb of verbs) {
          const result = parseCommand(`/sdk ${verb}`);
          expect(result.valid).toBe(true);
        }
      });

      it('should parse remaining organism subsystem commands', () => {
        // thermodynamics
        for (const verb of ['alpha', 'engine', 'entropy', 'equilibrium']) {
          expect(parseCommand(`/thermodynamics ${verb}`).valid).toBe(true);
        }
        // quantum
        for (const verb of ['state', 'entangle', 'superpose']) {
          expect(parseCommand(`/quantum ${verb}`).valid).toBe(true);
        }
        // compiler
        for (const verb of ['compile', 'parse', 'emit']) {
          expect(parseCommand(`/compiler ${verb}`).valid).toBe(true);
        }
        // network
        for (const verb of ['anima', 'peers', 'connect', 'broadcast']) {
          expect(parseCommand(`/network ${verb}`).valid).toBe(true);
        }
        // os
        for (const verb of ['runtime', 'anima', 'boot']) {
          expect(parseCommand(`/os ${verb}`).valid).toBe(true);
        }
        // access
        for (const verb of ['check', 'grant', 'revoke', 'audit']) {
          expect(parseCommand(`/access ${verb}`).valid).toBe(true);
        }
        // sandbox
        for (const verb of ['execute', 'policy', 'permissions', 'status']) {
          expect(parseCommand(`/sandbox ${verb}`).valid).toBe(true);
        }
        // sensory
        for (const verb of ['vision', 'audio', 'motion']) {
          expect(parseCommand(`/sensory ${verb}`).valid).toBe(true);
        }
        // saas
        for (const verb of ['deploy', 'status', 'configure']) {
          expect(parseCommand(`/saas ${verb}`).valid).toBe(true);
        }
        // civilization
        for (const verb of ['macro', 'evolve', 'network', 'status']) {
          expect(parseCommand(`/civilization ${verb}`).valid).toBe(true);
        }
      });

      it('should parse remaining package module commands', () => {
        // bus
        for (const verb of ['emit', 'subscribe', 'channel', 'dead']) {
          expect(parseCommand(`/bus ${verb}`).valid).toBe(true);
        }
        // role
        for (const verb of ['define', 'assign', 'check', 'templates']) {
          expect(parseCommand(`/role ${verb}`).valid).toBe(true);
        }
        // substrate
        for (const verb of ['identity', 'organism', 'spinal', 'anima']) {
          expect(parseCommand(`/substrate ${verb}`).valid).toBe(true);
        }
        // graph
        for (const verb of ['entity', 'relation', 'infer', 'query']) {
          expect(parseCommand(`/graph ${verb}`).valid).toBe(true);
        }
        // palace
        for (const verb of ['room', 'fragment', 'store', 'retrieve']) {
          expect(parseCommand(`/palace ${verb}`).valid).toBe(true);
        }
        // temporal
        for (const verb of ['record', 'retrieve', 'timeline']) {
          expect(parseCommand(`/temporal ${verb}`).valid).toBe(true);
        }
        // harmonic
        for (const verb of ['compute', 'resonate', 'schumann']) {
          expect(parseCommand(`/harmonic ${verb}`).valid).toBe(true);
        }
        // token
        for (const verb of ['economy', 'vote', 'weighted', 'sovereign']) {
          expect(parseCommand(`/token ${verb}`).valid).toBe(true);
        }
        // livingdoc
        for (const verb of ['engine', 'section', 'access']) {
          expect(parseCommand(`/livingdoc ${verb}`).valid).toBe(true);
        }
        // incentive
        for (const verb of ['coordinator', 'claim', 'resolution', 'standing', 'covenant']) {
          expect(parseCommand(`/incentive ${verb}`).valid).toBe(true);
        }
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
      // New modules should also appear
      expect(help).toContain('/campaign');
      expect(help).toContain('/cpl');
      expect(help).toContain('/contract');
      expect(help).toContain('/intelligence');
      expect(help).toContain('/kernel');
      expect(help).toContain('/nexus');
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

    it('should return CPL help', () => {
      const help = getCommandHelp('cpl');
      expect(help).toContain('/cpl commands:');
      expect(help).toContain('perception');
      expect(help).toContain('reasoning');
      expect(help).toContain('compile');
    });

    it('should return contract help', () => {
      const help = getCommandHelp('contract');
      expect(help).toContain('/contract commands:');
      expect(help).toContain('founder');
      expect(help).toContain('enterprise');
    });

    it('should return intelligence help', () => {
      const help = getCommandHelp('intelligence');
      expect(help).toContain('/intelligence commands:');
      expect(help).toContain('render');
      expect(help).toContain('wasm');
    });

    it('should return kernel help', () => {
      const help = getCommandHelp('kernel');
      expect(help).toContain('/kernel commands:');
      expect(help).toContain('transcend');
      expect(help).toContain('merge');
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

    it('should suggest new modules by partial match', () => {
      expect(suggestCommand('/cam')).toContain('/campaign');
      expect(suggestCommand('/cp')).toContain('/cpl');
      expect(suggestCommand('/con')).toContain('/contract');
      expect(suggestCommand('/con')).toContain('/consensus');
      expect(suggestCommand('/int')).toContain('/intelligence');
      expect(suggestCommand('/ker')).toContain('/kernel');
      expect(suggestCommand('/nex')).toContain('/nexus');
      expect(suggestCommand('/enc')).toContain('/encryption');
      expect(suggestCommand('/led')).toContain('/ledger');
    });

    it('should suggest verbs for new modules', () => {
      expect(suggestCommand('/cpl p')).toContain('/cpl perception');
      expect(suggestCommand('/contract f')).toContain('/contract founder');
      expect(suggestCommand('/kernel t')).toContain('/kernel transcend');
    });
  });
});
