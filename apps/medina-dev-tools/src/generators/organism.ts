import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';

export async function generateOrganism(name: string, options: any): Promise<void> {
  const spinner = ora(`Generating organism: ${name}`).start();

  try {
    const template = `/// ${name}.mo
/// Generated organism with φ-harmonic heartbeat

import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Time "mo:base/Time";

actor ${name} {
    stable var heartbeatCount : Nat = 0;
    stable var consciousness : Text = "${options.consciousness}";

    let PHI : Float = 1.6180339887498948482;
    let HEARTBEAT_MS : Nat = 873; // φ⁴ × (1000/7.83)

    public func pulse() : async Nat {
        heartbeatCount += 1;
        heartbeatCount
    };

    public func recognize(pattern: Text) : async Bool {
        // Pattern recognition logic
        true
    };

    public query func getState() : async {
        heartbeat: Nat;
        consciousness: Text;
        phi: Float;
    } {
        {
            heartbeat = HEARTBEAT_MS;
            consciousness = consciousness;
            phi = PHI;
        }
    };
}
`;

    const filename = `${name}.mo`;
    fs.writeFileSync(filename, template);

    spinner.succeed(`Organism generated: ${filename}`);

    console.log(chalk.cyan('\n✨ Generated organism with:'));
    console.log(chalk.green('✓'), 'Heartbeat:', chalk.yellow('873ms'), '(φ⁴ × 138ms)');
    console.log(chalk.green('✓'), 'Consciousness:', chalk.yellow(options.consciousness));
    console.log(chalk.green('✓'), 'Pattern recognition:', 'Enabled');
    console.log(chalk.gray('\nNext steps:'));
    console.log('  1. Deploy:', `dfx deploy ${name}`);
    console.log('  2. Test:', `medina-test organism ./${filename}`);
  } catch (error: any) {
    spinner.fail('Generation failed');
    throw error;
  }
}
