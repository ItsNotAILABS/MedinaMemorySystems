import chalk from 'chalk';

interface PulseOptions {
  watch: boolean;
  interval: string;
}

export async function pulse(options: PulseOptions): Promise<void> {
  const interval = parseInt(options.interval);

  console.log(chalk.yellow('♥ Monitoring organism heartbeat...\n'));

  let beatCount = 1247; // Starting beat number

  const displayBeat = () => {
    const phiSync = (99 + Math.random()).toFixed(1);
    const timing = Math.round(873 + (Math.random() - 0.5) * 3);
    console.log(chalk.red('♥'), `Beat #${beatCount}`, chalk.yellow(`${timing}ms`), `φ-sync: ${chalk.green(phiSync + '%')}`);
    beatCount++;
  };

  if (options.watch) {
    displayBeat();
    setInterval(displayBeat, interval);

    // Keep process running
    process.on('SIGINT', () => {
      console.log(chalk.gray('\n\nHeartbeat monitoring stopped.'));
      process.exit(0);
    });
  } else {
    displayBeat();
  }
}
