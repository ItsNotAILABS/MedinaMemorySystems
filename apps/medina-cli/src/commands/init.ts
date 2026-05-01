import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';

interface InitOptions {
  network: string;
  identity: string;
}

export async function init(options: InitOptions): Promise<void> {
  const spinner = ora('Initializing MEDINA configuration...').start();

  try {
    const config = {
      network: options.network,
      identity: options.identity,
      canister_id: '',
      license_key: '',
      preferences: {
        auto_watch: true,
        heartbeat_interval: 873,
        json_output: false,
      },
    };

    const configPath = path.join(process.cwd(), '.medinarc');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    spinner.succeed('Configuration initialized');

    console.log(chalk.cyan('\n📋 Configuration created at:'), configPath);
    console.log(chalk.yellow('\n⚠️  Remember to set:'));
    console.log('  - canister_id: Your organism canister ID');
    console.log('  - license_key: Your MEDINA Enterprise license key');
    console.log(chalk.gray('\nEdit .medinarc to configure these values.'));
  } catch (error: any) {
    spinner.fail('Initialization failed');
    throw error;
  }
}
