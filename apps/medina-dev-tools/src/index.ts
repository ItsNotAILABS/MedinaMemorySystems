#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { version } from '../package.json';

const program = new Command();

program
  .name('medina-dev')
  .description('MEDINA Dev Tools - Code generators, validators, and scaffolding')
  .version(version);

// Generate command
const generate = program
  .command('generate')
  .description('Generate code from templates');

generate
  .command('organism <name>')
  .description('Generate new organism implementation')
  .option('--consciousness <species>', 'Animal consciousness', 'Dolphin')
  .action(async (name, options) => {
    const { generateOrganism } = await import('./generators/organism');
    await generateOrganism(name, options);
  });

generate
  .command('module <name>')
  .description('Generate intelligence module')
  .option('--pillar <pillar>', 'Intelligence pillar', 'neural')
  .option('--type <type>', 'Language (motoko, typescript)', 'motoko')
  .action(async (name, options) => {
    const { generateModule } = await import('./generators/module');
    await generateModule(name, options);
  });

generate
  .command('agent <name>')
  .description('Generate workforce agent')
  .option('--capacity <phi>', 'φ-capacity (phi0-phi4)', 'phi1')
  .option('--role <role>', 'Agent role')
  .action(async (name, options) => {
    const { generateAgent } = await import('./generators/agent');
    await generateAgent(name, options);
  });

generate
  .command('candid')
  .description('Generate Candid interface')
  .option('--from <file>', 'Source Motoko file')
  .option('--output <file>', 'Output .did file')
  .action(async (options) => {
    const { generateCandid } = await import('./generators/candid');
    await generateCandid(options);
  });

generate
  .command('tests')
  .description('Generate test suite')
  .option('--for <component>', 'Component to test')
  .option('--include <tests>', 'Test types (comma-separated)')
  .action(async (options) => {
    const { generateTests } = await import('./generators/tests');
    await generateTests(options);
  });

// Scaffold command
const scaffold = program
  .command('scaffold')
  .description('Scaffold new projects and structures');

scaffold
  .command('project <name>')
  .description('Scaffold new project')
  .option('--template <name>', 'Project template', 'organism')
  .action(async (name, options) => {
    const { scaffoldProject } = await import('./generators/scaffold');
    await scaffoldProject(name, options);
  });

scaffold
  .command('pillar <name>')
  .description('Scaffold intelligence pillar')
  .option('--modules <n>', 'Number of modules', '10')
  .action(async (name, options) => {
    const { scaffoldPillar } = await import('./generators/scaffold');
    await scaffoldPillar(name, options);
  });

// Validate command
const validate = program
  .command('validate')
  .description('Validate implementations');

validate
  .command('organism <path>')
  .description('Validate organism implementation')
  .action(async (path) => {
    const { validateOrganism } = await import('./validators/organism');
    await validateOrganism(path);
  });

validate
  .command('module <path>')
  .description('Validate intelligence module')
  .action(async (path) => {
    const { validateModule } = await import('./validators/module');
    await validateModule(path);
  });

validate
  .command('phi-harmonic <path>')
  .description('Validate φ-harmonic code')
  .action(async (path) => {
    const { validatePhiHarmonic } = await import('./validators/phi');
    await validatePhiHarmonic(path);
  });

// Utils command
const utils = program
  .command('utils')
  .description('Development utilities');

utils
  .command('phi-sync <value>')
  .description('Calculate φ-synchronization percentage')
  .action(async (value) => {
    const { calculatePhiSync } = await import('./utils');
    await calculatePhiSync(parseFloat(value));
  });

utils
  .command('fibonacci <n>')
  .description('Calculate Fibonacci number F[n]')
  .action(async (n) => {
    const { calculateFibonacci } = await import('./utils');
    await calculateFibonacci(parseInt(n));
  });

utils
  .command('to-phi <value>')
  .description('Convert value to φ-scale')
  .action(async (value) => {
    const { convertToPhiScale } = await import('./utils');
    await convertToPhiScale(parseFloat(value));
  });

program.parse(process.argv);
