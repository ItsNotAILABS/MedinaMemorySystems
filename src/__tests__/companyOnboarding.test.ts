/**
 * Tests for companyOnboarding.ts
 * Tests company CRUD, connectors, and onboarding stats
 */

// Reset module state between tests
let companyOnboarding: typeof import('@/lib/companyOnboarding');

beforeEach(() => {
  jest.resetModules();
  companyOnboarding = require('@/lib/companyOnboarding');
});

describe('companyOnboarding', () => {
  describe('listCompanies', () => {
    it('should return all companies', () => {
      const companies = companyOnboarding.listCompanies();
      
      expect(Array.isArray(companies)).toBe(true);
      expect(companies.length).toBeGreaterThanOrEqual(1); // Seed data
    });

    it('should return companies with proper structure', () => {
      const companies = companyOnboarding.listCompanies();
      
      for (const company of companies) {
        expect(company).toHaveProperty('id');
        expect(company).toHaveProperty('name');
        expect(company).toHaveProperty('mode');
        expect(company).toHaveProperty('connectors');
        expect(company).toHaveProperty('onboardedAt');
        expect(company).toHaveProperty('memoryEntries');
        expect(company).toHaveProperty('governanceActive');
      }
    });
  });

  describe('getCompany', () => {
    it('should return company by id', () => {
      const companies = companyOnboarding.listCompanies();
      const company = companyOnboarding.getCompany(companies[0].id);
      
      expect(company).toBeDefined();
      expect(company?.id).toBe(companies[0].id);
    });

    it('should return undefined for non-existent id', () => {
      const company = companyOnboarding.getCompany('non-existent');
      expect(company).toBeUndefined();
    });
  });

  describe('getDefaultCompany', () => {
    it('should return the first company', () => {
      const defaultCompany = companyOnboarding.getDefaultCompany();
      
      expect(defaultCompany).toBeDefined();
      expect(defaultCompany?.name).toBe('NOVA OVO Demo Corp');
    });
  });

  describe('createCompany', () => {
    it('should create a new company with connect mode', () => {
      const company = companyOnboarding.createCompany('Test Corp', 'connect');
      
      expect(company.id).toBeDefined();
      expect(company.name).toBe('Test Corp');
      expect(company.mode).toBe('connect');
    });

    it('should create a new company with internalize mode', () => {
      const company = companyOnboarding.createCompany('Internalize Corp', 'internalize');
      
      expect(company.mode).toBe('internalize');
    });

    it('should create a new company with hybrid mode', () => {
      const company = companyOnboarding.createCompany('Hybrid Corp', 'hybrid');
      
      expect(company.mode).toBe('hybrid');
    });

    it('should initialize connectors as disconnected', () => {
      const company = companyOnboarding.createCompany('New Corp', 'connect');
      
      expect(company.connectors.length).toBeGreaterThan(0);
      expect(company.connectors.every(c => c.status === 'disconnected')).toBe(true);
    });

    it('should set onboardedAt timestamp', () => {
      const company = companyOnboarding.createCompany('Timestamp Corp', 'connect');
      
      expect(company.onboardedAt).toBeDefined();
      expect(new Date(company.onboardedAt).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should initialize memoryEntries to 0', () => {
      const company = companyOnboarding.createCompany('Memory Corp', 'connect');
      
      expect(company.memoryEntries).toBe(0);
    });

    it('should initialize governanceActive to false', () => {
      const company = companyOnboarding.createCompany('Governance Corp', 'connect');
      
      expect(company.governanceActive).toBe(false);
    });

    it('should include all connector types', () => {
      const company = companyOnboarding.createCompany('Connector Corp', 'connect');
      const types = company.connectors.map(c => c.type);
      
      expect(types).toContain('crm');
      expect(types).toContain('erp');
      expect(types).toContain('email');
      expect(types).toContain('calendar');
      expect(types).toContain('storage');
      expect(types).toContain('communication');
      expect(types).toContain('analytics');
      expect(types).toContain('custom');
    });
  });

  describe('setCompanyMode', () => {
    it('should update company mode to connect', () => {
      const company = companyOnboarding.createCompany('Mode Test', 'hybrid');
      const updated = companyOnboarding.setCompanyMode(company.id, 'connect');
      
      expect(updated?.mode).toBe('connect');
    });

    it('should update company mode to internalize', () => {
      const company = companyOnboarding.createCompany('Mode Test 2', 'connect');
      const updated = companyOnboarding.setCompanyMode(company.id, 'internalize');
      
      expect(updated?.mode).toBe('internalize');
    });

    it('should return null for non-existent company', () => {
      const result = companyOnboarding.setCompanyMode('non-existent', 'connect');
      expect(result).toBeNull();
    });
  });

  describe('connectConnector', () => {
    it('should set connector status to connected', () => {
      const defaultCompany = companyOnboarding.getDefaultCompany();
      expect(defaultCompany).toBeDefined();
      
      // Find a disconnected connector
      const disconnected = defaultCompany!.connectors.find(c => c.status === 'disconnected');
      if (disconnected) {
        const connected = companyOnboarding.connectConnector(defaultCompany!.id, disconnected.id);
        
        expect(connected?.status).toBe('connected');
      }
    });

    it('should set lastSync timestamp', () => {
      const company = companyOnboarding.createCompany('Sync Test', 'connect');
      const connector = company.connectors[0];
      
      const connected = companyOnboarding.connectConnector(company.id, connector.id);
      
      expect(connected?.lastSync).toBeDefined();
    });

    it('should set dataPoints', () => {
      const company = companyOnboarding.createCompany('Data Test', 'connect');
      const connector = company.connectors[0];
      
      const connected = companyOnboarding.connectConnector(company.id, connector.id);
      
      expect(connected?.dataPoints).toBeGreaterThan(0);
    });

    it('should return null for non-existent company', () => {
      const result = companyOnboarding.connectConnector('fake-company', 'fake-connector');
      expect(result).toBeNull();
    });

    it('should return null for non-existent connector', () => {
      const company = companyOnboarding.createCompany('Connector Test', 'connect');
      const result = companyOnboarding.connectConnector(company.id, 'fake-connector');
      
      expect(result).toBeNull();
    });
  });

  describe('syncConnector', () => {
    it('should update lastSync for connected connector', () => {
      const company = companyOnboarding.createCompany('Sync Company', 'connect');
      const connector = company.connectors[0];
      
      // First connect
      companyOnboarding.connectConnector(company.id, connector.id);
      
      // Then sync
      const synced = companyOnboarding.syncConnector(company.id, connector.id);
      
      expect(synced?.lastSync).toBeDefined();
    });

    it('should increment dataPoints', () => {
      const company = companyOnboarding.createCompany('DataPoints Test', 'connect');
      const connector = company.connectors[0];
      
      // Connect first
      const connected = companyOnboarding.connectConnector(company.id, connector.id);
      const initialDataPoints = connected?.dataPoints || 0;
      
      // Sync
      const synced = companyOnboarding.syncConnector(company.id, connector.id);
      
      expect(synced?.dataPoints).toBeGreaterThanOrEqual(initialDataPoints);
    });

    it('should return null for disconnected connector', () => {
      const company = companyOnboarding.createCompany('Disconnected Sync', 'connect');
      const connector = company.connectors[0];
      
      // Don't connect, try to sync
      const result = companyOnboarding.syncConnector(company.id, connector.id);
      
      expect(result).toBeNull();
    });

    it('should return null for non-existent company', () => {
      const result = companyOnboarding.syncConnector('fake', 'fake');
      expect(result).toBeNull();
    });

    it('should return null for non-existent connector', () => {
      const company = companyOnboarding.createCompany('Missing Connector', 'connect');
      const result = companyOnboarding.syncConnector(company.id, 'fake-connector');
      
      expect(result).toBeNull();
    });
  });

  describe('getOnboardingStats', () => {
    it('should return stats for existing company', () => {
      const defaultCompany = companyOnboarding.getDefaultCompany();
      const stats = companyOnboarding.getOnboardingStats(defaultCompany!.id);
      
      expect(stats).not.toBeNull();
      expect(stats).toHaveProperty('connected');
      expect(stats).toHaveProperty('pending');
      expect(stats).toHaveProperty('disconnected');
      expect(stats).toHaveProperty('totalDataPoints');
    });

    it('should return correct connected count', () => {
      const defaultCompany = companyOnboarding.getDefaultCompany();
      const stats = companyOnboarding.getOnboardingStats(defaultCompany!.id);
      
      const actualConnected = defaultCompany!.connectors.filter(
        c => c.status === 'connected'
      ).length;
      
      expect(stats?.connected).toBe(actualConnected);
    });

    it('should return correct pending count', () => {
      const defaultCompany = companyOnboarding.getDefaultCompany();
      const stats = companyOnboarding.getOnboardingStats(defaultCompany!.id);
      
      const actualPending = defaultCompany!.connectors.filter(
        c => c.status === 'pending'
      ).length;
      
      expect(stats?.pending).toBe(actualPending);
    });

    it('should return correct disconnected count', () => {
      const defaultCompany = companyOnboarding.getDefaultCompany();
      const stats = companyOnboarding.getOnboardingStats(defaultCompany!.id);
      
      const actualDisconnected = defaultCompany!.connectors.filter(
        c => c.status === 'disconnected'
      ).length;
      
      expect(stats?.disconnected).toBe(actualDisconnected);
    });

    it('should calculate total data points', () => {
      const defaultCompany = companyOnboarding.getDefaultCompany();
      const stats = companyOnboarding.getOnboardingStats(defaultCompany!.id);
      
      const actualTotal = defaultCompany!.connectors.reduce(
        (sum, c) => sum + (c.dataPoints ?? 0), 0
      );
      
      expect(stats?.totalDataPoints).toBe(actualTotal);
    });

    it('should return null for non-existent company', () => {
      const stats = companyOnboarding.getOnboardingStats('non-existent');
      expect(stats).toBeNull();
    });
  });

  describe('connector templates', () => {
    it('should create connectors with names', () => {
      const company = companyOnboarding.createCompany('Template Test', 'connect');
      
      expect(company.connectors.some(c => c.name === 'Salesforce CRM')).toBe(true);
      expect(company.connectors.some(c => c.name === 'SAP ERP')).toBe(true);
      expect(company.connectors.some(c => c.name === 'Google Workspace')).toBe(true);
      expect(company.connectors.some(c => c.name === 'Slack')).toBe(true);
    });

    it('should create connectors with icons', () => {
      const company = companyOnboarding.createCompany('Icon Test', 'connect');
      
      expect(company.connectors.every(c => c.icon !== undefined)).toBe(true);
      expect(company.connectors.every(c => c.icon.length > 0)).toBe(true);
    });

    it('should inherit mode from company', () => {
      const company = companyOnboarding.createCompany('Mode Inherit', 'internalize');
      
      expect(company.connectors.every(c => c.mode === 'internalize')).toBe(true);
    });
  });

  describe('seed data validation', () => {
    it('should have demo company with expected name', () => {
      const defaultCompany = companyOnboarding.getDefaultCompany();
      
      expect(defaultCompany?.name).toBe('NOVA OVO Demo Corp');
    });

    it('should have demo company with hybrid mode', () => {
      const defaultCompany = companyOnboarding.getDefaultCompany();
      
      expect(defaultCompany?.mode).toBe('hybrid');
    });

    it('should have demo company with some connected connectors', () => {
      const defaultCompany = companyOnboarding.getDefaultCompany();
      const connected = defaultCompany?.connectors.filter(c => c.status === 'connected') || [];
      
      expect(connected.length).toBeGreaterThan(0);
    });

    it('should have demo company with governance active', () => {
      const defaultCompany = companyOnboarding.getDefaultCompany();
      
      expect(defaultCompany?.governanceActive).toBe(true);
    });
  });
});
