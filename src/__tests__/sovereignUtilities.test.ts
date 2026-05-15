import { cls } from '@/lib/sovereign-cls';

describe('sovereign-cls', () => {
  it('merges string classes and skips falsy values', () => {
    expect(cls('base', false, null, undefined, 'active')).toBe('base active');
  });

  it('includes only truthy own object keys', () => {
    const proto = { inherited: true };
    const own = Object.create(proto) as Record<string, boolean>;
    own.visible = true;
    own.hidden = false;

    expect(cls('root', own)).toBe('root visible');
  });

  it('preserves input order across mixed arguments', () => {
    expect(cls('a', { b: true, c: false }, 'd')).toBe('a b d');
  });
});

describe('sovereign-id', () => {
  const originalCrypto = globalThis.crypto;

  afterEach(() => {
    jest.restoreAllMocks();
    Object.defineProperty(globalThis, 'crypto', {
      value: originalCrypto,
      configurable: true,
      writable: true,
    });
  });

  it('generates RFC-4122 shaped IDs and sets version/variant bits', () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        getRandomValues: (arr: Uint8Array) => {
          for (let i = 0; i < arr.length; i++) arr[i] = i;
          return arr;
        },
      },
      configurable: true,
      writable: true,
    });

    const { sovereignId } = require('@/lib/sovereign-id');
    const id = sovereignId();

    expect(id).toBe('00010203-0405-4607-8809-0a0b0c0d0e0f');
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('normalizes version/variant bits for high-byte inputs', () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        getRandomValues: (arr: Uint8Array) => {
          arr.fill(255);
          return arr;
        },
      },
      configurable: true,
      writable: true,
    });

    const { sovereignId } = require('@/lib/sovereign-id');
    const id = sovereignId();
    const [, , versionSegment, variantSegment] = id.split('-');

    expect(versionSegment[0]).toBe('4');
    expect(['8', '9', 'a', 'b']).toContain(variantSegment[0]);
  });

  it('falls back to Math.random when crypto.getRandomValues is unavailable', () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: {},
      configurable: true,
      writable: true,
    });

    jest.spyOn(Math, 'random').mockReturnValue(0);

    const { sovereignId } = require('@/lib/sovereign-id');
    const id = sovereignId();

    expect(id).toBe('00000000-0000-4000-8000-000000000000');
  });
});
