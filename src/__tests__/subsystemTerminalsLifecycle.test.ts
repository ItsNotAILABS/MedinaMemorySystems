import type { NextRequest } from 'next/server';
import { GET, POST } from '@/app/_api/subsystem-terminals/route';

function postRequest(body: Record<string, unknown>): NextRequest {
  return new Request('http://localhost/api/subsystem-terminals', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

function getRequest(action: string, terminalId?: string): NextRequest {
  const url = new URL('http://localhost/api/subsystem-terminals');
  url.searchParams.set('action', action);
  if (terminalId) url.searchParams.set('terminalId', terminalId);
  return new Request(url.toString(), { method: 'GET' }) as unknown as NextRequest;
}

describe('subsystem terminals lifecycle route', () => {
  const terminalId = 'terminal-memory';

  it('supports create/activate/execute/status/deactivate flow', async () => {
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
