// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * @itsnotailabs/alpha-council
 * ─────────────────────────────────────────────────────────────────────────
 * Multi-modal alpha intelligence council for sovereign AI systems.
 *
 * INCLUDES:
 *   - 2 Alpha Models: PRAEFECTUS (Signal Commander) + ORACULUM (Machine Oracle)
 *   - 3 Solver Models: ARCHITECTUS + COGNITOR + VERIFICATOR
 *   - 3 Engines: MOTUS (Signal Motion) + VISIO (Prediction) + NEXUS (Binding)
 *   - City-State Civilization Architecture (Civitas Intelligentiae)
 *
 * This is a LIVING PACKAGE — it carries organism metadata and self-documents.
 */

export { AlphaModelRegistry, Praefectus, Oraculum, MotusEngine, VisioEngine, NexusEngine } from '../../../src/organism/models/AlphaModels';
export { SolverCouncil, Architectus, Cognitor, Verificator } from '../../../src/organism/models/SolverModels';
export { CivitasIntelligentiae, foundCivitas } from '../../../src/organism/civilizations/OrganismCityState';

export const PACKAGE_ORGANISM = {
  name: '@itsnotailabs/alpha-council',
  latinName: 'Consilium Alphae Intelligentiae',
  version: '1.0.0',
  class: 'PACKAGE.SOVEREIGN',
  livingDocument: true,
  alphaModels: {
    PRAEFECTUS: { cores: 5, uses: 10, cost: '$0.003/signal' },
    ORACULUM: { cores: 5, uses: 10, cost: '$0.005/prediction' },
  },
  solvers: {
    ARCHITECTUS: { cost: '$0.05/solve' },
    COGNITOR: { cost: '$0.03/solve' },
    VERIFICATOR: { cost: '$0.04/solve' },
  },
  engines: {
    MOTUS: { cost: '$0.001/route' },
    VISIO: { cost: '$0.004/prediction' },
    NEXUS: { cost: '$0.002/bind' },
  },
  cityState: 'CivitasIntelligentiae',
};
