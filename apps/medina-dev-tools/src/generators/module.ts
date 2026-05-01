import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';

export async function generateModule(name: string, options: any): Promise<void> {
  const spinner = ora(`Generating ${options.pillar} module: ${name}`).start();

  try {
    const template = options.type === 'motoko' ? `/// ${name}.mo
/// ${options.pillar.charAt(0).toUpperCase() + options.pillar.slice(1)} pillar intelligence module

import Float "mo:base/Float";

module {
    let PHI : Float = 1.6180339887498948482;

    public type State = {
        value: Float;
    };

    public func init() : State {
        { value = 0.0 }
    };

    public func process(state: State, input: Float) : Float {
        // φ-harmonic processing
        input * PHI
    };
}
` : `// ${name}.ts
// ${options.pillar.charAt(0).toUpperCase() + options.pillar.slice(1)} pillar intelligence module

const PHI = 1.6180339887498948482;

export interface State {
  value: number;
}

export function init(): State {
  return { value: 0 };
}

export function process(state: State, input: number): number {
  // φ-harmonic processing
  return input * PHI;
}
`;

    const ext = options.type === 'motoko' ? 'mo' : 'ts';
    const filename = `${name}.${ext}`;
    fs.writeFileSync(filename, template);

    spinner.succeed(`Module generated: ${filename}`);

    console.log(chalk.cyan('\n✨ Generated module in'), chalk.yellow(options.pillar), 'pillar');
  } catch (error: any) {
    spinner.fail('Generation failed');
    throw error;
  }
}
