/**
 * Product Surface Packet — Tests
 */
import {
  getAllProducts,
  getProductById,
  getUserProducts,
  getCompanyProducts,
  getProductsByStatus,
  getProductCatalog,
  getProductRoadmap,
  runProductDemo,
  getDemoHistory,
  getProductDemo,
  captureEvidence,
  getEvidenceLog,
  getGlobalEvidenceReport,
  verifyEvidence,
  getProductMetrics,
  getPortfolioMetrics,
  getTopProducts,
  getRevenueProjection,
  checkProductHealth,
  getSystemHealth,
  getProductDependencyGraph,
  _resetForTesting,
} from '@/lib/productSurfacePacket';

beforeEach(() => _resetForTesting());

// ─── Product Catalog ───────────────────────────────────────────────

describe('Product catalog', () => {
  it('contains exactly 10 products', () => {
    expect(getAllProducts()).toHaveLength(10);
  });

  it('each product has required fields', () => {
    for (const p of getAllProducts()) {
      expect(p.id).toBeDefined();
      expect(p.name).toBeTruthy();
      expect(p.version).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(['user-facing', 'company-facing']).toContain(p.category);
      expect(['live', 'beta', 'alpha', 'development']).toContain(p.status);
      expect(p.features.length).toBeGreaterThan(0);
      expect(p.apiEndpoints.length).toBeGreaterThan(0);
      expect(p.pricing).toBeDefined();
    }
  });

  it('all product ids are unique', () => {
    const ids = getAllProducts().map(p => p.id);
    expect(new Set(ids).size).toBe(10);
  });

  it('all product names are unique', () => {
    const names = getAllProducts().map(p => p.name);
    expect(new Set(names).size).toBe(10);
  });

  it('getProductById returns correct product', () => {
    const all = getAllProducts();
    const found = getProductById(all[0].id);
    expect(found).toBeDefined();
    expect(found!.name).toBe(all[0].name);
  });

  it('getProductById returns undefined for invalid id', () => {
    expect(getProductById('nonexistent')).toBeUndefined();
  });
});

// ─── Category separation ───────────────────────────────────────────

describe('Category separation', () => {
  it('getUserProducts returns only user-facing', () => {
    const user = getUserProducts();
    expect(user.length).toBeGreaterThan(0);
    for (const p of user) expect(p.category).toBe('user-facing');
  });

  it('getCompanyProducts returns only company-facing', () => {
    const co = getCompanyProducts();
    expect(co.length).toBeGreaterThan(0);
    for (const p of co) expect(p.category).toBe('company-facing');
  });

  it('user + company = all products', () => {
    expect(getUserProducts().length + getCompanyProducts().length).toBe(10);
  });

  it('getProductsByStatus filters correctly', () => {
    const live = getProductsByStatus('live');
    for (const p of live) expect(p.status).toBe('live');
  });
});

// ─── Product catalog & roadmap ─────────────────────────────────────

describe('Catalog and roadmap', () => {
  it('getProductCatalog returns entries for all 10', () => {
    expect(getProductCatalog()).toHaveLength(10);
  });

  it('catalog entries have pricing info', () => {
    for (const entry of getProductCatalog()) {
      expect(entry.pricing).toBeDefined();
      expect(['free', 'pro', 'enterprise']).toContain(entry.pricing.tier);
    }
  });

  it('getProductRoadmap returns entries', () => {
    const roadmap = getProductRoadmap();
    expect(roadmap.length).toBeGreaterThan(0);
    for (const r of roadmap) {
      expect(r.productId).toBeTruthy();
      expect(r.nextMilestone).toBeTruthy();
    }
  });
});

// ─── Demo system ───────────────────────────────────────────────────

describe('Demo system', () => {
  it('getProductDemo returns demo for valid product', () => {
    const all = getAllProducts();
    const demo = getProductDemo(all[0].id);
    expect(demo).toBeDefined();
    expect(demo!.steps.length).toBeGreaterThan(0);
  });

  it('runProductDemo returns a valid DemoResult', () => {
    const all = getAllProducts();
    const result = runProductDemo(all[0].id);
    expect(result.productId).toBe(all[0].id);
    expect(result.success).toBe(true);
    expect(result.timing).toBeGreaterThanOrEqual(0);
    expect(result.outputs.length).toBeGreaterThan(0);
  });

  it('runProductDemo works for all 10 products', () => {
    for (const p of getAllProducts()) {
      const result = runProductDemo(p.id);
      expect(result.success).toBe(true);
      expect(result.productId).toBe(p.id);
    }
  });

  it('getDemoHistory accumulates results', () => {
    const all = getAllProducts();
    runProductDemo(all[0].id);
    runProductDemo(all[1].id);
    const hist = getDemoHistory();
    expect(hist.length).toBeGreaterThanOrEqual(2);
  });

  it('demo for invalid product throws', () => {
    expect(() => runProductDemo('nonexistent')).toThrow();
  });
});

// ─── Evidence layer ────────────────────────────────────────────────

describe('Evidence layer', () => {
  it('captureEvidence returns valid evidence', () => {
    const all = getAllProducts();
    const ev = captureEvidence(all[0].id);
    expect(ev.productId).toBe(all[0].id);
    expect(ev.lastRunTimestamp).toBeTruthy();
    expect(ev.executionProof).toBeTruthy();
    expect(typeof ev.isRealComputation).toBe('boolean');
  });

  it('verifyEvidence passes for valid evidence', () => {
    const ev = captureEvidence(getAllProducts()[0].id);
    expect(verifyEvidence(ev)).toBe(true);
  });

  it('verifyEvidence fails for tampered evidence', () => {
    const ev = captureEvidence(getAllProducts()[0].id);
    ev.executionProof = 'tampered';
    expect(verifyEvidence(ev)).toBe(false);
  });

  it('getEvidenceLog accumulates', () => {
    const id = getAllProducts()[0].id;
    captureEvidence(id);
    captureEvidence(id);
    expect(getEvidenceLog(id).length).toBeGreaterThanOrEqual(2);
  });

  it('getGlobalEvidenceReport covers all products', () => {
    for (const p of getAllProducts()) captureEvidence(p.id);
    const report = getGlobalEvidenceReport();
    expect(report.totalEvidenceEntries).toBeGreaterThanOrEqual(10);
    expect(report.productsWithEvidence).toBe(10);
  });
});

// ─── Metrics ───────────────────────────────────────────────────────

describe('Metrics', () => {
  it('getProductMetrics returns metrics for valid product', () => {
    const m = getProductMetrics(getAllProducts()[0].id);
    expect(m).toBeDefined();
    expect(m!.activeUsers).toBeGreaterThanOrEqual(0);
  });

  it('getProductMetrics returns undefined for invalid id', () => {
    expect(getProductMetrics('bad')).toBeUndefined();
  });

  it('getPortfolioMetrics aggregates', () => {
    const pm = getPortfolioMetrics();
    expect(pm.totalProducts).toBe(10);
    expect(pm.totalActiveUsers).toBeGreaterThanOrEqual(0);
  });

  it('getTopProducts returns sorted list', () => {
    const top = getTopProducts();
    for (let i = 1; i < top.length; i++) {
      expect(top[i - 1].metrics.satisfactionScore).toBeGreaterThanOrEqual(top[i].metrics.satisfactionScore);
    }
  });

  it('getRevenueProjection returns numbers', () => {
    const rp = getRevenueProjection();
    expect(rp.monthly).toBeGreaterThanOrEqual(0);
    expect(rp.annual).toBeGreaterThanOrEqual(0);
  });
});

// ─── Health ────────────────────────────────────────────────────────

describe('Health monitoring', () => {
  it('checkProductHealth returns valid report', () => {
    const h = checkProductHealth(getAllProducts()[0].id);
    expect(['up', 'degraded', 'down']).toContain(h.status);
    expect(h.productId).toBe(getAllProducts()[0].id);
  });

  it('getSystemHealth returns 10 reports', () => {
    expect(getSystemHealth()).toHaveLength(10);
  });

  it('dependency graph has nodes and edges', () => {
    const g = getProductDependencyGraph();
    expect(g.nodes.length).toBeGreaterThan(0);
    expect(g.edges.length).toBeGreaterThan(0);
  });
});
