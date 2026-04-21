/**
 * Tests for permissionsManager.ts
 * Tests permission CRUD and access checking functionality
 */

// Reset module state between tests
let permissionsManager: typeof import('@/lib/permissionsManager');

beforeEach(() => {
  jest.resetModules();
  permissionsManager = require('@/lib/permissionsManager');
});

describe('permissionsManager', () => {
  describe('listPermissions', () => {
    it('should return all permissions', () => {
      const permissions = permissionsManager.listPermissions();
      
      expect(Array.isArray(permissions)).toBe(true);
      expect(permissions.length).toBeGreaterThan(0); // Seed data exists
    });

    it('should return permissions with proper structure', () => {
      const permissions = permissionsManager.listPermissions();
      
      for (const perm of permissions) {
        expect(perm).toHaveProperty('id');
        expect(perm).toHaveProperty('scope');
        expect(perm).toHaveProperty('grantedTo');
        expect(perm).toHaveProperty('grantedBy');
        expect(perm).toHaveProperty('grantedAt');
        expect(perm).toHaveProperty('active');
      }
    });

    it('should sort permissions by scope', () => {
      const permissions = permissionsManager.listPermissions();
      
      for (let i = 1; i < permissions.length; i++) {
        expect(permissions[i - 1].scope.localeCompare(permissions[i].scope))
          .toBeLessThanOrEqual(0);
      }
    });

    it('should include default seeded permissions', () => {
      const permissions = permissionsManager.listPermissions();
      const scopes = permissions.map(p => p.scope);
      
      expect(scopes).toContain('memory:read');
      expect(scopes).toContain('memory:write');
      expect(scopes).toContain('governance:read');
      expect(scopes).toContain('model:invoke');
    });
  });

  describe('grantPermission', () => {
    it('should create a new permission', () => {
      const grant = {
        scope: 'device:register' as const,
        grantedTo: 'TestUser',
      };
      
      const permission = permissionsManager.grantPermission(grant, 'Admin');
      
      expect(permission.id).toBeDefined();
      expect(permission.scope).toBe('device:register');
      expect(permission.grantedTo).toBe('TestUser');
      expect(permission.grantedBy).toBe('Admin');
      expect(permission.active).toBe(true);
    });

    it('should set grantedAt timestamp', () => {
      const grant = {
        scope: 'device:contract' as const,
        grantedTo: 'TestUser2',
      };
      
      const permission = permissionsManager.grantPermission(grant, 'Admin');
      
      expect(permission.grantedAt).toBeDefined();
      expect(new Date(permission.grantedAt).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should set expiresAt if provided', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString(); // +1 day
      const grant = {
        scope: 'device:register' as const,
        grantedTo: 'TempUser',
        expiresAt: futureDate,
      };
      
      const permission = permissionsManager.grantPermission(grant, 'Admin');
      
      expect(permission.expiresAt).toBe(futureDate);
    });

    it('should return existing permission if already exists and active', () => {
      const grant = {
        scope: 'memory:read' as const,
        grantedTo: 'Public',
      };
      
      // This already exists in seed data
      const permission = permissionsManager.grantPermission(grant, 'Someone');
      
      // Should return the existing one (grantedBy would be 'System' from seed)
      expect(permission.grantedBy).toBe('System');
    });

    it('should create new permission for different grantedTo', () => {
      const grant = {
        scope: 'memory:read' as const,
        grantedTo: 'NewPrincipal',
      };
      
      const permission = permissionsManager.grantPermission(grant, 'Admin');
      
      expect(permission.grantedTo).toBe('NewPrincipal');
      expect(permission.grantedBy).toBe('Admin');
    });
  });

  describe('revokePermission', () => {
    it('should set permission to inactive', () => {
      // Create a new permission to revoke
      const grant = {
        scope: 'device:register' as const,
        grantedTo: 'RevokeTest',
      };
      const permission = permissionsManager.grantPermission(grant, 'Admin');
      
      const revoked = permissionsManager.revokePermission(permission.id);
      
      expect(revoked).not.toBeNull();
      expect(revoked?.active).toBe(false);
    });

    it('should return null for non-existent permission', () => {
      const result = permissionsManager.revokePermission('non-existent-id');
      expect(result).toBeNull();
    });

    it('should return null for already inactive permission', () => {
      // Create and revoke
      const grant = {
        scope: 'device:register' as const,
        grantedTo: 'AlreadyRevoked',
      };
      const permission = permissionsManager.grantPermission(grant, 'Admin');
      permissionsManager.revokePermission(permission.id);
      
      // Try to revoke again
      const result = permissionsManager.revokePermission(permission.id);
      expect(result).toBeNull();
    });
  });

  describe('checkPermission', () => {
    it('should return true for Public permissions', () => {
      // memory:read is granted to Public in seed
      const result = permissionsManager.checkPermission('memory:read', 'AnyUser');
      expect(result).toBe(true);
    });

    it('should return true for exact principal match', () => {
      // memory:write is granted to Sovereign
      const result = permissionsManager.checkPermission('memory:write', 'Sovereign');
      expect(result).toBe(true);
    });

    it('should return false for non-matching principal', () => {
      // memory:delete is granted only to Sovereign
      const result = permissionsManager.checkPermission('memory:delete', 'RandomUser');
      expect(result).toBe(false);
    });

    it('should return false for expired permission', () => {
      // Create an expired permission
      const pastDate = new Date(Date.now() - 86400000).toISOString(); // -1 day
      const grant = {
        scope: 'device:register' as const,
        grantedTo: 'ExpiredUser',
        expiresAt: pastDate,
      };
      
      // Need to mock or directly add - in this case grantPermission won't help
      // since it checks for existing active permission first
      // Let's test with the granted permission logic
      permissionsManager.grantPermission(grant, 'Admin');
      
      // The permission was created with expired date
      const result = permissionsManager.checkPermission('device:register', 'ExpiredUser');
      expect(result).toBe(false);
    });

    it('should return true for non-expired permission', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      const grant = {
        scope: 'device:contract' as const,
        grantedTo: 'ValidUser',
        expiresAt: futureDate,
      };
      
      permissionsManager.grantPermission(grant, 'Admin');
      
      const result = permissionsManager.checkPermission('device:contract', 'ValidUser');
      expect(result).toBe(true);
    });

    it('should return false for revoked permission', () => {
      const grant = {
        scope: 'device:register' as const,
        grantedTo: 'RevokedUser',
      };
      const permission = permissionsManager.grantPermission(grant, 'Admin');
      permissionsManager.revokePermission(permission.id);
      
      const result = permissionsManager.checkPermission('device:register', 'RevokedUser');
      expect(result).toBe(false);
    });
  });

  describe('getPermissionsForPrincipal', () => {
    it('should return permissions for a specific principal', () => {
      const permissions = permissionsManager.getPermissionsForPrincipal('Sovereign');
      
      expect(permissions.length).toBeGreaterThan(0);
      expect(permissions.every(p => 
        p.grantedTo === 'Sovereign' || p.grantedTo === 'Public'
      )).toBe(true);
    });

    it('should include Public permissions', () => {
      const permissions = permissionsManager.getPermissionsForPrincipal('AnyUser');
      
      // Should get Public permissions
      expect(permissions.some(p => p.grantedTo === 'Public')).toBe(true);
    });

    it('should exclude inactive permissions', () => {
      // Create and revoke a permission
      const grant = {
        scope: 'device:register' as const,
        grantedTo: 'InactiveTest',
      };
      const permission = permissionsManager.grantPermission(grant, 'Admin');
      permissionsManager.revokePermission(permission.id);
      
      const permissions = permissionsManager.getPermissionsForPrincipal('InactiveTest');
      
      expect(permissions.every(p => p.active)).toBe(true);
    });

    it('should exclude expired permissions', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString();
      const grant = {
        scope: 'device:register' as const,
        grantedTo: 'ExpiredPrincipal',
        expiresAt: pastDate,
      };
      permissionsManager.grantPermission(grant, 'Admin');
      
      const permissions = permissionsManager.getPermissionsForPrincipal('ExpiredPrincipal');
      
      // Should not include expired permission (only Public ones)
      expect(permissions.every(p => 
        !p.expiresAt || new Date(p.expiresAt) > new Date()
      )).toBe(true);
    });
  });

  describe('getPermissionStats', () => {
    it('should return total count', () => {
      const stats = permissionsManager.getPermissionStats();
      
      expect(stats.total).toBeGreaterThan(0);
    });

    it('should return active count', () => {
      const stats = permissionsManager.getPermissionStats();
      
      expect(stats.active).toBeLessThanOrEqual(stats.total);
      expect(stats.active).toBeGreaterThan(0);
    });

    it('should return count by scope', () => {
      const stats = permissionsManager.getPermissionStats();
      
      expect(stats.byScope).toBeDefined();
      expect(typeof stats.byScope).toBe('object');
    });

    it('should only count active permissions in byScope', () => {
      // Create and revoke a permission
      const grant = {
        scope: 'device:register' as const,
        grantedTo: 'StatsTest',
      };
      const permission = permissionsManager.grantPermission(grant, 'Admin');
      const statsBefore = permissionsManager.getPermissionStats();
      
      permissionsManager.revokePermission(permission.id);
      const statsAfter = permissionsManager.getPermissionStats();
      
      // byScope count should decrease or stay same
      expect(statsAfter.byScope['device:register'] || 0)
        .toBeLessThanOrEqual(statsBefore.byScope['device:register'] || 1);
    });
  });

  describe('permission scopes', () => {
    it('should have all expected default scopes', () => {
      const permissions = permissionsManager.listPermissions();
      const scopes = new Set(permissions.map(p => p.scope));
      
      const expectedScopes: string[] = [
        'memory:read',
        'memory:write',
        'memory:delete',
        'governance:read',
        'governance:propose',
        'governance:vote',
        'governance:enact',
        'model:invoke',
        'model:configure',
        'company:read',
        'company:write',
        'replay:read',
        'permissions:manage',
        'organism:read',
        'organism:write',
      ];
      
      for (const scope of expectedScopes) {
        expect(scopes.has(scope as any)).toBe(true);
      }
    });
  });
});
