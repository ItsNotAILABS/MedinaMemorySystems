/**
 * Tests for mcpToolRegistry.ts
 */

let mcp: typeof import('@/lib/mcpToolRegistry');

beforeEach(() => {
  jest.resetModules();
  mcp = require('@/lib/mcpToolRegistry');
});

describe('MCP Tool Registry', () => {
  describe('listMCPTools', () => {
    it('should list all tools', () => {
      const tools = mcp.listMCPTools();
      expect(tools.length).toBeGreaterThanOrEqual(14);
    });

    it('should filter medina tools', () => {
      const tools = mcp.listMCPTools({ server: 'medina' });
      expect(tools.length).toBe(6);
      tools.forEach((t) => expect(t.server).toBe('medina'));
    });

    it('should filter iphone-bridge tools', () => {
      const tools = mcp.listMCPTools({ server: 'iphone-bridge' });
      expect(tools.length).toBe(8);
      tools.forEach((t) => expect(t.server).toBe('iphone-bridge'));
    });
  });

  describe('getMCPTool', () => {
    it('should return medina tool by name', () => {
      const tool = mcp.getMCPTool('medina_memory_store');
      expect(tool?.server).toBe('medina');
      expect(tool?.parameters.required).toContain('content');
    });

    it('should return iphone tool by name', () => {
      const tool = mcp.getMCPTool('iphone_screenshot');
      expect(tool?.server).toBe('iphone-bridge');
    });

    it('should return undefined for unknown tool', () => {
      expect(mcp.getMCPTool('nonexistent_tool')).toBeUndefined();
    });
  });

  describe('listMCPServerInfo', () => {
    it('should list medina and iphone-bridge servers', () => {
      const servers = mcp.listMCPServerInfo();
      expect(servers).toHaveLength(2);
      expect(servers.map((s) => s.id)).toEqual(['medina', 'iphone-bridge']);
    });

    it('should include iphone-bridge connection info', () => {
      const servers = mcp.listMCPServerInfo();
      const iphone = servers.find((s) => s.id === 'iphone-bridge');
      expect(iphone?.connection?.serverId).toBe('iphone-bridge');
      expect(iphone?.connection?.goSystemId).toBe('MCP-31');
      expect(iphone?.connection?.args[0]).toContain('MESIEServer.py');
    });
  });

  describe('callMCPTool', () => {
    it('should execute medina_memory_stats', () => {
      const result = mcp.callMCPTool('medina_memory_stats');
      expect(result.success).toBe(true);
      expect(result.server).toBe('medina');
      expect(result.data).toBeDefined();
    });

    it('should store memory via medina_memory_store', () => {
      const result = mcp.callMCPTool('medina_memory_store', {
        content: 'MCP test memory',
        type: 'semantic',
      });
      expect(result.success).toBe(true);
      expect(result.tool).toBe('medina_memory_store');
    });

    it('should require bridge for iphone tools', () => {
      const result = mcp.callMCPTool('iphone_tap', { x: 100, y: 200 });
      expect(result.success).toBe(false);
      expect(result.bridgeRequired).toBe(true);
      expect(result.server).toBe('iphone-bridge');
      expect(result.connection?.cursorConfigPath).toBe('.cursor/mcp.json');
    });

    it('should fail for unknown tools', () => {
      const result = mcp.callMCPTool('unknown_tool');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown tool');
    });
  });
});
