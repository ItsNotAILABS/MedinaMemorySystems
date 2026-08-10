import {
  buildTerminalProtocolDescriptor,
  compareVersions,
  determineTerminalHealth,
  negotiateTerminalProtocol,
} from '@/lib/terminalProtocol';

describe('terminalProtocol', () => {
  it('compares semantic versions correctly', () => {
    expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
    expect(compareVersions('1.2.0', '1.1.9')).toBe(1);
    expect(compareVersions('0.9.9', '1.0.0')).toBe(-1);
  });

  it('negotiates compatible protocol/capability requests', () => {
    const descriptor = buildTerminalProtocolDescriptor('terminal-alpha', [
      'command-execution',
      'lifecycle-control',
      'health-check',
    ]);

    const result = negotiateTerminalProtocol(
      descriptor,
      {
        minimumProtocolVersion: '1.0.0',
        compatibleApiVersions: ['v1'],
        requiredCapabilities: ['command-execution'],
      },
      {
        terminalId: 'terminal-alpha',
        requestedApiVersion: 'v1',
        requestedCapabilities: ['command-execution', 'health-check'],
        clientProtocolVersion: '1.0.0',
      },
    );

    expect(result.compatible).toBe(true);
    expect(result.enabledCapabilities).toEqual(['command-execution', 'health-check']);
  });

  it('reports incompatibilities during negotiation', () => {
    const descriptor = buildTerminalProtocolDescriptor('terminal-beta', [
      'command-routing',
    ]);
    const result = negotiateTerminalProtocol(
      descriptor,
      {
        minimumProtocolVersion: '1.0.0',
        compatibleApiVersions: ['v1'],
        requiredCapabilities: ['command-execution'],
      },
      {
        terminalId: 'terminal-beta',
        requestedApiVersion: 'v2',
        requestedCapabilities: ['streaming-output'],
        clientProtocolVersion: '0.9.0',
      },
    );

    expect(result.compatible).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it('derives runtime health from heartbeat age', () => {
    const now = Date.now();
    expect(determineTerminalHealth(now, now)).toBe('ONLINE');
    expect(determineTerminalHealth(now - 180_000, now)).toBe('DEGRADED');
    expect(determineTerminalHealth(now - 400_000, now)).toBe('OFFLINE');
  });
});
