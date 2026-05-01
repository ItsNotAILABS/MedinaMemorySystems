import chalk from 'chalk';

const PHI = 1.6180339887498948482;
const HEARTBEAT_TARGET = 873;

export async function calculatePhiSync(value: number): Promise<void> {
  const percentage = ((value / HEARTBEAT_TARGET) * 100).toFixed(2);
  const diff = Math.abs(value - HEARTBEAT_TARGET);

  console.log(chalk.cyan('\n🔷 φ-Synchronization Calculation\n'));
  console.log('Input value:', chalk.yellow(value + 'ms'));
  console.log('Target:', chalk.yellow(HEARTBEAT_TARGET + 'ms'));
  console.log('Sync:', chalk.green(percentage + '%'));
  console.log('Difference:', chalk.gray(`±${diff}ms`));
}

export async function calculateFibonacci(n: number): Promise<void> {
  const fib = (n: number): number => {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  };

  const result = fib(n);

  console.log(chalk.cyan('\n🔢 Fibonacci Calculation\n'));
  console.log(`F[${n}] =`, chalk.yellow(result.toLocaleString()));

  if (n > 1) {
    const prev = fib(n - 1);
    const ratio = result / prev;
    console.log('Ratio:', chalk.gray(`${ratio.toFixed(16)} ≈ φ`));
  }
}

export async function convertToPhiScale(value: number): Promise<void> {
  const phiScaled = value * PHI;

  console.log(chalk.cyan('\n🔷 φ-Scale Conversion\n'));
  console.log('Input:', chalk.yellow(value));
  console.log('φ-scaled:', chalk.green(`${phiScaled.toFixed(3)} (${value} × φ)`));
  console.log('φ =', chalk.gray(PHI));
}
