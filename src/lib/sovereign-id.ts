/**
 * MEDINA Sovereign ID Generator
 *
 * Generates cryptographically strong unique identifiers without external dependencies.
 * Uses Web Crypto API (available in Node 19+ and all modern browsers) with a
 * fallback to Math.random for environments where crypto is unavailable.
 *
 * Format: 8-4-4-4-12 hex (RFC 4122 v4 shape)
 */

function getRandomBytes(n: number): Uint8Array {
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
    return globalThis.crypto.getRandomValues(new Uint8Array(n));
  }
  const bytes = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}

function toHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

export function sovereignId(): string {
  const bytes = getRandomBytes(16);
  // Set version (4) and variant (RFC 4122) bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const h = toHex(bytes);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}
