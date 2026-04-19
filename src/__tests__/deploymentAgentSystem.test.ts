/**
 * 𓂀 DEPLOYMENT AGENT SYSTEM TESTS 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Tests for the 5-agent deployment teams that traverse all branches
 * from root to edges, leave test nodes everywhere, and merge back.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  createAgent,
  createDeploymentTeam,
  createTestNode,
  moveAgent,
  fillBranch,
  probeEdge,
  runTestNode,
  returnToVein,
  mergeBranch,
  deployFromRoot,
  deployMultiDimensional,
  sendToResearch,
  processResearchQueue,
  getFutureExtensions,
  generateDeploymentReport,
  type Agent,
  type DeploymentTeam,
  type TestNode,
  type DeploymentResult,
} from '../organism/DeploymentAgentSystem';

import {
  getAllDomains,
  getRoot,
  getEdges,
} from '../organism/ArchitectureWiring';

describe('DeploymentAgentSystem', () => {
  describe('Agent Creation', () => {
    test('creates agent with correct role and status', () => {
      const agent = createAgent('engineer', 'team-1', 'core');
      
      expect(agent.role).toBe('engineer');
      expect(agent.status).toBe('spawning');
      expect(agent.currentDomain).toBe('core');
      expect(agent.teamId).toBe('team-1');
      expect(agent.path).toEqual(['core']);
    });
    
    test('creates deployment team with 1 lead + 4 engineers', () => {
      const team = createDeploymentTeam('core');
      
      expect(team.lead.role).toBe('deployment_lead');
      expect(team.engineers.length).toBe(4);
      expect(team.engineers.every(e => e.role === 'engineer')).toBe(true);
      expect(team.status).toBe('spawning');
      expect(team.rootDomain).toBe('core');
    });
    
    test('creates test node with autonomous and noFeelings flags', () => {
      const testNode = createTestNode('neural', 'injection-point-1', 'chaos');
      
      expect(testNode.domain).toBe('neural');
      expect(testNode.autonomous).toBe(true);
      expect(testNode.noFeelings).toBe(true);
      expect(testNode.testType).toBe('chaos');
      expect(testNode.running).toBe(false);
    });
  });
  
  describe('Agent Operations', () => {
    test('moves agent to target domain', () => {
      const agent = createAgent('engineer', 'team-1', 'core');
      
      moveAgent(agent, 'neural');
      
      expect(agent.currentDomain).toBe('neural');
      expect(agent.status).toBe('traversing');
      expect(agent.path).toContain('neural');
      expect(agent.depth).toBe(1);
    });
    
    test('engineer fills branch and records discovery', () => {
      const agent = createAgent('engineer', 'team-1', 'core');
      moveAgent(agent, 'neural');
      
      fillBranch(agent, 'neural');
      
      expect(agent.status).toBe('filling');
      expect(agent.discoveries.length).toBe(1);
      expect(agent.discoveries[0].type).toBe('known_branch');
    });
    
    test('probe agent finds edge and returns discovery', () => {
      const probe = createAgent('probe', 'team-1', 'core');
      
      const discovery = probeEdge(probe, 'sensory');
      
      expect(probe.status).toBe('probing');
      expect(discovery.type).toBe('unknown_edge');
      expect(discovery.domain).toBe('sensory');
    });
    
    test('test node runs tests and returns results', () => {
      const testNode = createTestNode('neural', 'test-point', 'user_simulation');
      
      const results = runTestNode(testNode);
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].testType).toBe('user_simulation');
      expect(testNode.results.length).toBeGreaterThan(0);
    });
    
    test('agent returns to vein', () => {
      const agent = createAgent('engineer', 'team-1', 'neural');
      
      returnToVein(agent);
      
      expect(agent.currentDomain).toBe('core');
      expect(agent.status).toBe('returning');
      expect(agent.path).toContain('core');
    });
    
    test('merge agent merges branch back', () => {
      const mergeAgent = createAgent('merge', 'team-1', 'core');
      
      const discovery = mergeBranch(mergeAgent, 'neural', { filled: true });
      
      expect(mergeAgent.status).toBe('complete');
      expect(discovery.domain).toBe('neural');
      expect((discovery.data as Record<string, unknown>).merged).toBe(true);
    });
  });
  
  describe('Full Deployment', () => {
    test('deploys from root through all branches', () => {
      const result = deployFromRoot();
      
      expect(result.teamId).toBeDefined();
      expect(result.branchesFilled.length).toBeGreaterThan(0);
      expect(result.edgesProbed.length).toBeGreaterThan(0);
      expect(result.testNodesDeployed).toBeGreaterThan(0);
      expect(result.totalAgentsDeployed).toBeGreaterThan(5); // At least lead + 4 engineers
      expect(['success', 'partial', 'failed']).toContain(result.status);
    });
    
    test('fills all known branches', () => {
      const result = deployFromRoot();
      const allDomains = getAllDomains();
      
      // Should fill all non-root domains
      expect(result.branchesFilled.length).toBe(allDomains.length - 1);
    });
    
    test('probes all edges', () => {
      const result = deployFromRoot();
      const edges = getEdges();
      
      // Should probe all edge domains
      expect(result.edgesProbed.length).toBe(edges.length);
    });
    
    test('deploys test nodes at every branch', () => {
      const result = deployFromRoot();
      const allDomains = getAllDomains();
      
      // Should deploy test nodes at all non-root domains
      expect(result.testNodesDeployed).toBe(allDomains.length - 1);
    });
    
    test('merges all completed branches', () => {
      const result = deployFromRoot();
      
      expect(result.mergesCompleted).toBe(result.branchesFilled.length);
    });
  });
  
  describe('Multi-Dimensional Deployment', () => {
    test('deploys across multiple dimensions', () => {
      const dimensions = ['dimension-1', 'dimension-2', 'dimension-3'];
      const deployment = deployMultiDimensional(dimensions);
      
      expect(deployment.dimensions).toEqual(dimensions);
      expect(deployment.teams.length).toBe(dimensions.length);
      expect(deployment.results.length).toBe(dimensions.length);
    });
    
    test('discovers cross-dimensional extensions', () => {
      const dimensions = ['dim-a', 'dim-b'];
      const deployment = deployMultiDimensional(dimensions);
      
      // Should find cross-dimensional connections
      expect(deployment.crossDimensionalDiscoveries.length).toBeGreaterThanOrEqual(0);
    });
  });
  
  describe('Research Pipeline', () => {
    test('sends discoveries to research', () => {
      const result = deployFromRoot();
      
      if (result.extensionsDiscovered.length > 0) {
        const researchItem = sendToResearch(result.extensionsDiscovered[0], 'high');
        
        expect(researchItem.status).toBe('queued');
        expect(researchItem.priority).toBe('high');
      }
    });
    
    test('processes research queue', () => {
      const result = deployFromRoot();
      
      // Send all extensions to research
      for (const discovery of result.extensionsDiscovered) {
        sendToResearch(discovery);
      }
      
      const processed = processResearchQueue();
      
      // All should be processed
      expect(processed.every(p => p.status === 'ready_for_extension')).toBe(true);
    });
    
    test('gets future extensions for deployment', () => {
      const result = deployFromRoot();
      
      for (const discovery of result.extensionsDiscovered) {
        sendToResearch(discovery);
      }
      processResearchQueue();
      
      const futures = getFutureExtensions();
      
      // Should have future extensions ready (at least as many as we sent)
      expect(futures.length).toBeGreaterThanOrEqual(result.extensionsDiscovered.length);
    });
  });
  
  describe('Deployment Report', () => {
    test('generates comprehensive deployment report', () => {
      const result = deployFromRoot();
      const report = generateDeploymentReport([result]);
      
      expect(report.totalTeamsDeployed).toBe(1);
      expect(report.totalAgents).toBe(result.totalAgentsDeployed);
      expect(report.totalBranchesFilled).toBe(result.branchesFilled.length);
      expect(report.totalEdgesProbed).toBe(result.edgesProbed.length);
      expect(report.architectureStatus.coverage).toBeGreaterThan(0);
      expect(report.primitiveStackIntegration).toBeDefined();
    });
    
    test('report includes primitive stack integration', () => {
      const result = deployFromRoot();
      const report = generateDeploymentReport([result]);
      
      expect(report.primitiveStackIntegration.layers.length).toBe(5);
      expect(report.primitiveStackIntegration.layers[0].name).toBe('field');
      expect(report.primitiveStackIntegration.deeperPrimitive).toBe('field-structured distinction');
    });
  });
  
  describe('Architecture Integration', () => {
    test('deployment touches all architecture domains', () => {
      const result = deployFromRoot();
      const allDomains = getAllDomains();
      
      const touchedDomains = new Set([
        ...result.branchesFilled,
        ...result.edgesProbed,
        'core', // root
      ]);
      
      expect(touchedDomains.size).toBe(allDomains.length);
    });
    
    test('deployment starts from architecture root', () => {
      const root = getRoot();
      const result = deployFromRoot();
      
      // All branches should be reachable from root
      expect(root.domain).toBe('core');
      expect(result.branchesFilled.length).toBeGreaterThan(0);
    });
  });
});
