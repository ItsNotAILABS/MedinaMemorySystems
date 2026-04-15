import type { ParsedCommand } from '@/types';

// ─── Command Grammar ─────────────────────────────────────────────────────────
// /module verb [args...] [--flag=value] [--bool-flag]

const COMMAND_MAP: Record<string, Record<string, string>> = {
  memory: {
    find: 'Search memory entries',
    store: 'Store a new memory',
    pin: 'Pin a memory entry',
    unpin: 'Unpin a memory entry',
    delete: 'Delete a memory entry',
    lineage: 'Show memory lineage',
    navigate: 'Navigate to coordinate',
    dual: 'Dual semantic+resonance read',
    list: 'List recent memories',
    root: 'Jump to root memory',
  },
  govern: {
    propose: 'Create a governance proposal',
    vote: 'Vote on a proposal',
    status: 'Show governance status',
    enact: 'Enact an approved proposal',
    audit: 'Show audit log',
    gates: 'Show gate statuses',
    list: 'List proposals',
  },
  model: {
    invoke: 'Invoke a model family',
    status: 'Show model statuses',
    route: 'Route a prompt to best model',
    list: 'List available models',
    health: 'Show model health',
  },
  company: {
    connect: 'Connect a company system',
    internalize: 'Internalize company data',
    hybrid: 'Set hybrid mode',
    status: 'Show company status',
    list: 'List connectors',
    sync: 'Sync a connector',
  },
  replay: {
    start: 'Start a replay session',
    stop: 'Stop current replay',
    play: 'Replay a session',
    list: 'List replay sessions',
    export: 'Export replay session',
  },
  permissions: {
    grant: 'Grant a permission',
    revoke: 'Revoke a permission',
    list: 'List permissions',
    check: 'Check permission',
  },
  organism: {
    status: 'Show organism state',
    register: 'Read a register',
    broadcast: 'Broadcast state',
    phase: 'Set organism phase',
  },
  help: {
    '': 'Show help',
    commands: 'List all commands',
  },
};

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();

  if (!trimmed.startsWith('/')) {
    return {
      raw: trimmed,
      verb: '',
      module: '',
      args: [],
      flags: {},
      valid: false,
      error: 'Not a command (no leading /)',
    };
  }

  const parts = trimmed.slice(1).split(/\s+/);
  const moduleRaw = parts[0]?.toLowerCase() ?? '';
  const verb = parts[1]?.toLowerCase() ?? '';
  const rawArgs = parts.slice(2);

  // Parse flags and positional args
  const flags: Record<string, string | boolean> = {};
  const args: string[] = [];

  for (const part of rawArgs) {
    if (part.startsWith('--')) {
      const eqIdx = part.indexOf('=');
      if (eqIdx !== -1) {
        flags[part.slice(2, eqIdx)] = part.slice(eqIdx + 1);
      } else {
        flags[part.slice(2)] = true;
      }
    } else {
      args.push(part);
    }
  }

  const moduleCommands = COMMAND_MAP[moduleRaw];
  if (!moduleCommands) {
    return {
      raw: trimmed,
      verb,
      module: moduleRaw,
      args,
      flags,
      valid: false,
      error: `Unknown module '/${moduleRaw}'. Try /help`,
    };
  }

  if (verb && !(verb in moduleCommands)) {
    return {
      raw: trimmed,
      verb,
      module: moduleRaw,
      args,
      flags,
      valid: false,
      error: `Unknown verb '${verb}' for /${moduleRaw}. Try /help ${moduleRaw}`,
    };
  }

  return {
    raw: trimmed,
    verb,
    module: moduleRaw,
    args,
    flags,
    valid: true,
  };
}

export function isCommand(input: string): boolean {
  return input.trim().startsWith('/');
}

export function getCommandHelp(module?: string): string {
  if (!module || !(module in COMMAND_MAP)) {
    const modules = Object.keys(COMMAND_MAP);
    return `Available modules: ${modules.map((m) => `/${m}`).join(', ')}\n\nType /help <module> for details.`;
  }

  const cmds = COMMAND_MAP[module];
  const lines = Object.entries(cmds)
    .filter(([v]) => v !== '')
    .map(([v, desc]) => `  /${module} ${v.padEnd(12)} — ${desc}`);
  return `/${module} commands:\n${lines.join('\n')}`;
}

export function suggestCommand(partial: string): string[] {
  if (!partial.startsWith('/')) return [];
  const parts = partial.slice(1).split(/\s+/);
  const moduleRaw = parts[0]?.toLowerCase() ?? '';

  if (parts.length === 1) {
    return Object.keys(COMMAND_MAP)
      .filter((m) => m.startsWith(moduleRaw))
      .map((m) => `/${m}`);
  }

  const verbs = COMMAND_MAP[moduleRaw];
  if (!verbs) return [];
  const verbPartial = parts[1]?.toLowerCase() ?? '';
  return Object.keys(verbs)
    .filter((v) => v.startsWith(verbPartial))
    .map((v) => `/${moduleRaw} ${v}`);
}
