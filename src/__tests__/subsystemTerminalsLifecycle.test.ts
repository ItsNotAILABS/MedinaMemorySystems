import type { NextRequest } from 'next/server';
import { URL as NodeURL } from 'url';

function postRequest(body: Record<string, unknown>): NextRequest {
  return {
    url: 'http://localhost/api/subsystem-terminals',
    json: async () => body,
  } as unknown as NextRequest;
}

function getRequest(action: string, terminalId?: string): NextRequest {
  const url = new NodeURL('http://localhost/api/subsystem-terminals');
  url.searchParams.set('action', action);
  if (terminalId) url.searchParams.set('terminalId', terminalId);
  return {
    url: url.toString(),
    json: async () => ({}),
  } as unknown as NextRequest;
}

describe('subsystem terminals lifecycle route', () => {
  const terminalId = 'terminal-memory';

  it('supports create/activate/execute/status/deactivate flow', async () => {
    (globalThis as any).URL = NodeURL;

    if (typeof globalThis.Request === 'undefined') {
      (globalThis as any).Request = class {
        url: string;
        constructor(input: string) {
          this.url = input;
        }
      };
    }
    if (typeof globalThis.Headers === 'undefined') {
      (globalThis as any).Headers = class {
        private map = new Map<string, string>();
        constructor(init?: Record<string, string>) {
          if (init) {
            for (const [key, value] of Object.entries(init)) this.map.set(key.toLowerCase(), value);
          }
        }
        append(key: string, value: string) { this.map.set(key.toLowerCase(), value); }
        set(key: string, value: string) { this.map.set(key.toLowerCase(), value); }
        get(key: string) { return this.map.get(key.toLowerCase()) ?? null; }
        delete(key: string) { this.map.delete(key.toLowerCase()); }
        getSetCookie() { return []; }
      };
    }
    if (typeof globalThis.Response === 'undefined') {
      (globalThis as any).Response = class {
        body: string;
        status: number;
        headers: any;
        constructor(body?: string, init?: { status?: number; headers?: Record<string, string> }) {
          this.body = body ?? '';
          this.status = init?.status ?? 200;
          this.headers = new (globalThis as any).Headers(init?.headers);
        }
        static json(data: unknown, init?: { status?: number; headers?: Record<string, string> }) {
          return new (this as any)(JSON.stringify(data), { status: init?.status ?? 200, headers: init?.headers });
        }
        async json() {
          return JSON.parse(this.body || 'null');
        }
      };
    }

    const { GET, POST } = await import('@/app/_api/subsystem-terminals/route');

    const createRes = await POST(postRequest({ action: 'create', terminalId }));
    const createBody = await createRes.json();
    expect(createBody.success).toBe(true);

    const activateRes = await POST(postRequest({
      action: 'activate',
      terminalId,
      requestedApiVersion: 'v1',
      requestedCapabilities: ['command-execution', 'lifecycle-control'],
      clientProtocolVersion: '1.0.0',
    }));
    const activateBody = await activateRes.json();
    expect(activateBody.success).toBe(true);
    expect(activateBody.data.lifecycleState).toBe('active');

    const execRes = await POST(postRequest({
      action: 'execute',
      terminalId,
      command: 'status',
    }));
    const execBody = await execRes.json();
    expect(execBody.success).toBe(true);
    expect(execBody.data.output.terminalId).toBe(terminalId);

    const statusRes = await GET(getRequest('status', terminalId));
    const statusBody = await statusRes.json();
    expect(statusBody.success).toBe(true);
    expect(statusBody.data.commandCount).toBeGreaterThanOrEqual(1);

    const deactivateRes = await POST(postRequest({ action: 'deactivate', terminalId }));
    const deactivateBody = await deactivateRes.json();
    expect(deactivateBody.success).toBe(true);
  });
});
