#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { version } from '../package.json';

const program = new Command();

program
  .name('medina')
  .description('MEDINA Memory Systems CLI - Organism Management Tool')
  .version(version);

// Init command
program
  .command('init')
  .description('Initialize MEDINA configuration')
  .option('--network <network>', 'Target network (local, ic)', 'ic')
  .option('--identity <name>', 'DFX identity to use', 'default')
  .action(async (options) => {
    const { init } = await import('./commands/init');
    await init(options);
  });

// Deploy command
program
  .command('deploy')
  .description('Deploy organism canister')
  .option('--network <network>', 'Target network', 'ic')
  .option('--identity <name>', 'DFX identity', 'default')
  .option('--with-args <json>', 'Constructor arguments', '{}')
  .option('--cycles <amount>', 'Initial cycles', '5000000000000')
  .action(async (options) => {
    const { deploy } = await import('./commands/deploy');
    await deploy(options);
  });

// Status command
program
  .command('status')
  .description('Get organism status and health metrics')
  .option('--canister <id>', 'Canister ID')
  .option('--json', 'Output as JSON', false)
  .option('--watch', 'Continuous monitoring', false)
  .action(async (options) => {
    const { status } = await import('./commands/status');
    await status(options);
  });

// Pulse command
program
  .command('pulse')
  .description('Monitor organism heartbeat in real-time')
  .option('--watch', 'Continuous monitoring', false)
  .option('--interval <ms>', 'Update interval', '873')
  .action(async (options) => {
    const { pulse } = await import('./commands/pulse');
    await pulse(options);
  });

// Query command
program
  .command('query <method>')
  .description('Query organism state (read-only)')
  .option('--args <json>', 'Method arguments', '{}')
  .option('--json', 'Output as JSON', false)
  .action(async (method, options) => {
    const { query } = await import('./commands/query');
    await query(method, options);
  });

// Call command
program
  .command('call <method>')
  .description('Call organism method (update call)')
  .option('--args <json>', 'Method arguments', '{}')
  .option('--cycles <amount>', 'Cycles to attach', '0')
  .action(async (method, options) => {
    const { call } = await import('./commands/call');
    await call(method, options);
  });

// Workforce command
const workforce = program
  .command('workforce')
  .description('Manage workforce agents');

workforce
  .command('list')
  .description('List all agents')
  .action(async () => {
    const { listAgents } = await import('./commands/workforce');
    await listAgents();
  });

workforce
  .command('status <agent>')
  .description('Get agent status')
  .action(async (agent) => {
    const { agentStatus } = await import('./commands/workforce');
    await agentStatus(agent);
  });

workforce
  .command('scale <agent> <factor>')
  .description('Scale agent capacity (φ-proportional)')
  .action(async (agent, factor) => {
    const { scaleAgent } = await import('./commands/workforce');
    await scaleAgent(agent, parseFloat(factor));
  });

// Governance command
const governance = program
  .command('governance')
  .description('Governance and voting');

governance
  .command('propose <title>')
  .description('Create governance proposal')
  .option('--description <text>', 'Proposal description')
  .option('--expiry <duration>', 'Expiry duration (e.g., 7d)', '7d')
  .action(async (title, options) => {
    const { createProposal } = await import('./commands/governance');
    await createProposal(title, options);
  });

governance
  .command('vote <id> <choice>')
  .description('Vote on proposal')
  .action(async (id, choice) => {
    const { vote } = await import('./commands/governance');
    await vote(id, choice);
  });

governance
  .command('list')
  .description('List proposals')
  .option('--status <status>', 'Filter by status')
  .action(async (options) => {
    const { listProposals } = await import('./commands/governance');
    await listProposals(options);
  });

// Memory command
const memory = program
  .command('memory')
  .description('Memory management');

memory
  .command('export')
  .description('Export memories')
  .option('--format <format>', 'Export format (json, csv)', 'json')
  .option('--output <path>', 'Output file', './memories.json')
  .action(async (options) => {
    const { exportMemory } = await import('./commands/memory');
    await exportMemory(options);
  });

memory
  .command('import <file>')
  .description('Import memories')
  .action(async (file) => {
    const { importMemory } = await import('./commands/memory');
    await importMemory(file);
  });

memory
  .command('stats')
  .description('Memory statistics')
  .action(async () => {
    const { memoryStats } = await import('./commands/memory');
    await memoryStats();
  });

// Intelligence command
const intelligence = program
  .command('intelligence')
  .description('Intelligence module management');

intelligence
  .command('list')
  .description('List all 823+ modules')
  .option('--pillar <name>', 'Filter by pillar')
  .action(async (options) => {
    const { listModules } = await import('./commands/intelligence');
    await listModules(options);
  });

intelligence
  .command('info <module>')
  .description('Module information')
  .action(async (module) => {
    const { moduleInfo } = await import('./commands/intelligence');
    await moduleInfo(module);
  });

intelligence
  .command('benchmark')
  .description('Run intelligence benchmarks')
  .option('--suite <name>', 'Benchmark suite')
  .action(async (options) => {
    const { benchmark } = await import('./commands/intelligence');
    await benchmark(options);
  });

// Logs command
program
  .command('logs')
  .description('View organism logs')
  .option('--follow', 'Follow logs in real-time', false)
  .option('--lines <n>', 'Number of lines', '100')
  .option('--filter <pattern>', 'Filter by pattern')
  .action(async (options) => {
    const { logs } = await import('./commands/logs');
    await logs(options);
  });

// Upgrade command
program
  .command('upgrade')
  .description('Upgrade organism canister')
  .option('--wasm <path>', 'WASM module path', './organism.wasm')
  .option('--args <json>', 'Upgrade arguments', '{}')
  .action(async (options) => {
    const { upgrade } = await import('./commands/upgrade');
    await upgrade(options);
  });

// Error handling
program.exitOverride();

try {
  program.parse(process.argv);
} catch (error: any) {
  if (error.code === 'commander.help') {
    process.exit(0);
  }
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
}
