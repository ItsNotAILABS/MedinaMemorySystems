import chalk from 'chalk';
import { table } from 'table';

const WORKFORCE_AGENTS = [
  { name: 'Strategist', role: 'Strategic Planning', capacity: 'φ⁰ = 1.000', status: 'Active' },
  { name: 'Architect', role: 'System Design', capacity: 'φ¹ = 1.618', status: 'Active' },
  { name: 'Engineer', role: 'Implementation', capacity: 'φ² = 2.618', status: 'Active' },
  { name: 'Scientist', role: 'Research', capacity: 'φ³ = 4.236', status: 'Active' },
  { name: 'Artist', role: 'Creative Solutions', capacity: 'φ¹ = 1.618', status: 'Active' },
  { name: 'Analyst', role: 'Data Analysis', capacity: 'φ² = 2.618', status: 'Active' },
  { name: 'Guardian', role: 'Security', capacity: 'φ¹ = 1.618', status: 'Active' },
  { name: 'Coordinator', role: 'Orchestration', capacity: 'φ⁴ = 6.854', status: 'Active' },
];

export async function listAgents(): Promise<void> {
  console.log(chalk.cyan('\n👥 Workforce Agents (φ-Scaled)\n'));

  const data = [
    ['Agent', 'Role', 'Capacity', 'Status'],
    ...WORKFORCE_AGENTS.map(agent => [
      chalk.bold(agent.name),
      agent.role,
      chalk.yellow(agent.capacity),
      chalk.green(agent.status),
    ]),
  ];

  console.log(table(data));
}

export async function agentStatus(agent: string): Promise<void> {
  const found = WORKFORCE_AGENTS.find(a => a.name.toLowerCase() === agent.toLowerCase());

  if (!found) {
    console.log(chalk.red('Agent not found:'), agent);
    return;
  }

  console.log(chalk.cyan('\n👤 Agent Status\n'));
  console.log('Name:', chalk.bold(found.name));
  console.log('Role:', found.role);
  console.log('Capacity:', chalk.yellow(found.capacity));
  console.log('Status:', chalk.green(found.status));
}

export async function scaleAgent(agent: string, factor: number): Promise<void> {
  console.log(chalk.yellow('⚖️  Scaling agent'), chalk.bold(agent), 'by factor', factor);
  console.log(chalk.gray('φ-proportional scaling maintains golden ratio relationships.'));
}
