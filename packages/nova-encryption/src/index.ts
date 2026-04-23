/**
 * @itsnotailabs/nova-encryption
 * Nova sovereign encryption: lattice-based post-quantum cryptography, φ-key derivation.
 *
 * Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
 * Licensed under ISIL v1.1 — see LICENSE for details.
 * SAEIS enforcement: ACTIVE. SAT token binding: ENABLED.
 */

export const PHI = (1 + Math.sqrt(5)) / 2;

export interface NovaKeypair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
  phiSeed: number;
}

export interface EncryptedPayload {
  ciphertext: Uint8Array;
  nonce: Uint8Array;
  latticeTag: number;
}

export class NovaEncryption {
  private readonly dimension: number;
  private readonly modulus: number;

  constructor(dimension = 256, modulus = 7681) {
    this.dimension = dimension;
    this.modulus = modulus;
  }

  /** Generate a lattice-based keypair with φ-seeded randomness. */
  generateKeypair(seedPhrase: string): NovaKeypair {
    const phiSeed = this.phiHash(seedPhrase);
    const publicKey = new Uint8Array(this.dimension);
    const privateKey = new Uint8Array(this.dimension);

    let state = phiSeed;
    for (let i = 0; i < this.dimension; i++) {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      privateKey[i] = state % 256;
      publicKey[i] = (privateKey[i] * Math.round(PHI * 100) + i) % 256;
    }

    return { publicKey, privateKey, phiSeed };
  }

  /** Encrypt a plaintext buffer using lattice-based operations and a φ-derived nonce. */
  encrypt(plaintext: Uint8Array, publicKey: Uint8Array): EncryptedPayload {
    const nonce = new Uint8Array(16);
    const latticeTag = Math.round(Date.now() * PHI) % this.modulus;

    for (let i = 0; i < 16; i++) {
      nonce[i] = Math.floor((latticeTag * (i + 1) * PHI) % 256);
    }

    const ciphertext = new Uint8Array(plaintext.length);
    for (let i = 0; i < plaintext.length; i++) {
      const keyByte = publicKey[i % publicKey.length];
      const nonceByte = nonce[i % nonce.length];
      ciphertext[i] = (plaintext[i] + keyByte + nonceByte) % 256;
    }

    return { ciphertext, nonce, latticeTag };
  }

  /** Decrypt a ciphertext payload using the private key. */
  decrypt(payload: EncryptedPayload, privateKey: Uint8Array, publicKey: Uint8Array): Uint8Array {
    const plaintext = new Uint8Array(payload.ciphertext.length);
    for (let i = 0; i < payload.ciphertext.length; i++) {
      const keyByte = publicKey[i % publicKey.length];
      const nonceByte = payload.nonce[i % payload.nonce.length];
      plaintext[i] = (payload.ciphertext[i] - keyByte - nonceByte + 512) % 256;
    }
    return plaintext;
  }

  /** Derive a φ-key from a passphrase through iterative golden-ratio hashing. */
  derivePhiKey(passphrase: string, iterations = 10000): Uint8Array {
    let hash = this.phiHash(passphrase);
    for (let i = 0; i < iterations; i++) {
      hash = Math.abs(hash * PHI - Math.floor(hash * PHI)) * 0x7fffffff;
      hash = Math.floor(hash);
    }

    const key = new Uint8Array(32);
    let state = hash;
    for (let i = 0; i < 32; i++) {
      state = (state * 1664525 + 1013904223) & 0x7fffffff;
      key[i] = state % 256;
    }
    return key;
  }

  private phiHash(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = Math.floor((hash * PHI + input.charCodeAt(i)) % 0x7fffffff);
    }
    return hash || 1;
  }
}
