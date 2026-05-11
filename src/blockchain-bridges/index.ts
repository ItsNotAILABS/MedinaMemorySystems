/**
 * 𓂀 MEDINA BLOCKCHAIN BRIDGES INDEX 𓂀
 * Central export point for all blockchain infrastructure
 *
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// CHAINS
// ═══════════════════════════════════════════════════════════════════════════

export * from './chains/MedinaSovereignChain';

// ═══════════════════════════════════════════════════════════════════════════
// BRIDGES
// ═══════════════════════════════════════════════════════════════════════════

export * from './bridges/EthereumBridge';
export * from './bridges/BitcoinBridge';

// ═══════════════════════════════════════════════════════════════════════════
// ENTANGLEMENT
// ═══════════════════════════════════════════════════════════════════════════

export * from './entanglement/CrossChainEntanglementProtocol';

// ═══════════════════════════════════════════════════════════════════════════
// COORDINATOR
// ═══════════════════════════════════════════════════════════════════════════

export * from './UnifiedMultiChainCoordinator';

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

import { medinaSovereignChain } from './chains/MedinaSovereignChain';
import { ethereumBridge } from './bridges/EthereumBridge';
import { bitcoinBridge } from './bridges/BitcoinBridge';
import {
  entanglementChannelManager,
  atomicExecutor,
  quantumTeleportation,
  entanglementSwapping,
} from './entanglement/CrossChainEntanglementProtocol';
import { multiChainCoordinator, CHAIN_REGISTRY } from './UnifiedMultiChainCoordinator';

/**
 * MEDINA Blockchain Infrastructure Summary
 */
export const BlockchainInfrastructure = {
  // Version
  version: '1.0.0',
  
  // Native Chain
  medinaSovereignChain,
  
  // Bridges
  bridges: {
    ethereum: ethereumBridge,
    bitcoin: bitcoinBridge,
  },
  
  // Entanglement
  entanglement: {
    channelManager: entanglementChannelManager,
    atomicExecutor,
    quantumTeleportation,
    entanglementSwapping,
  },
  
  // Coordinator
  coordinator: multiChainCoordinator,
  
  // Registry
  chainRegistry: CHAIN_REGISTRY,
  
  // Statistics
  getStats: () => ({
    ...multiChainCoordinator.getStatistics(),
    bridges: {
      ethereum: ethereumBridge.getStatistics(),
      bitcoin: bitcoinBridge.getStatistics(),
    },
    nativeChain: medinaSovereignChain.getStatistics(),
  }),
};

export default BlockchainInfrastructure;
