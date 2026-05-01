import chalk from 'chalk';

export async function logs(options: any): Promise<void> {
  console.log(chalk.cyan('📜 Organism logs\n'));
  console.log(chalk.gray('(showing last', options.lines, 'lines)'));

  if (options.follow) {
    console.log(chalk.gray('\nFollowing logs... (press Ctrl+C to exit)'));
  }
}

export async function upgrade(options: any): Promise<void> {
  console.log(chalk.yellow('⬆️  Upgrading organism canister'));
  console.log('WASM:', options.wasm);
  console.log(chalk.gray('This will upgrade your deployed organism.'));
}
