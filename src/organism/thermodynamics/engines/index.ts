/**
 * 𓂀 THERMODYNAMICS ENGINES — INDEX 𓂀
 */

export {
  V_MAX, K_M, DELTA_E_A, K_B, R, T_STANDARD, PHI_CATALYST,
  michaelisMenten, arrhenius, turnoverNumber, catalyticEfficiency,
  selectivity, transformationEfficiency, phiScaledCatalyst,
  CatalystEngine, TransformerEngine, SynthesisEngine,
  IntakeSubmodel, ProcessSubmodel, OutputSubmodel, FeedbackSubmodel,
  IntelligenceDistributor, PlatinumCatalystModel, getPlatinumCatalystModel,
  type CatalystInput, type CatalystOutput, type AttentionWeights,
  type SynthesisInput, type FeedbackSignal, type IntelligenceNode,
  type PlatinumModelConfig,
} from './PlatinumCatalystEngine';
export {
  T_STD, CYCLE_INTERVAL,
  GoldEngine, TitaniumEngine, TungstenEngine, IridiumEngine, CopperEngine, SilverEngine,
  createEngineRegistry, getEngineRegistry, startAllEngines, stopAllEngines, getAllEngineMetrics,
  type EngineState, type EngineMetrics, type EngineEvent, type EngineListener, type EngineRegistry,
} from './MetalEngines';
export * from './AlphaModels';

export { default as PlatinumCatalyst } from './PlatinumCatalystEngine';
export { default as MetalEngines } from './MetalEngines';
export { default as AlphaModels } from './AlphaModels';
