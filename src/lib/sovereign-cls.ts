/**
 * MEDINA Sovereign Class Merger
 *
 * Merges CSS class names with conditional support. Replaces external
 * class-name utilities with a zero-dependency sovereign implementation.
 *
 * Usage:
 *   cls('base', condition && 'active', false && 'hidden', undefined, 'always')
 *   // => 'base active always'
 */

type ClsInput = string | boolean | null | undefined | Record<string, boolean | null | undefined>;

export function cls(...inputs: ClsInput[]): string {
  let result = '';
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (!input) continue;
    if (typeof input === 'string') {
      result += (result ? ' ' : '') + input;
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key) && input[key]) {
          result += (result ? ' ' : '') + key;
        }
      }
    }
  }
  return result;
}
