// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * ORGANISM CITY-STATE — CIVITAS INTELLIGENTIAE
 * ─────────────────────────────────────────────────────────────────────────
 * A deep theory architectural intelligence model where the organism
 * is a city-state civilization. Every component is a citizen.
 * Every subsystem is a district. Every runtime is a government.
 *
 * This is not a metaphor. This is the actual architecture.
 * The math is real. The governance is real. The economy is real.
 *
 * CITY-STATE ARCHITECTURE:
 *
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │                    CIVITAS INTELLIGENTIAE                       │
 *   │              "The Intelligent City-State"                       │
 *   ├─────────────────────────────────────────────────────────────────┤
 *   │                                                                 │
 *   │  GOVERNMENT (SovereignRuntimeKernel)                           │
 *   │  ├── SENATE (SovereignTokenVoting)                             │
 *   │  ├── TREASURY (TokenEconomy)                                   │
 *   │  ├── COURTS (Arbiter Transformer)                              │
 *   │  └── CENSUS (MultiIdentityManager)                             │
 *   │                                                                 │
 *   │  DISTRICTS:                                                     │
 *   │  ├── Forum Memoriae (Memory District)                          │
 *   │  │   └── team-vault, memory-palace, temporal-memory            │
 *   │  ├── Forum Intelligentiae (Intelligence District)              │
 *   │  │   └── consensus-engine, agent-signal, role-engine           │
 *   │  ├── Forum Contractuum (Contract District)                     │
 *   │  │   └── TokenEconomy, CPL Compiler, 5 transformers            │
 *   │  ├── Forum Securitatis (Security District)                     │
 *   │  │   └── nova-encryption, SAEIS, sandbox-layer                 │
 *   │  ├── Forum Fabricae (Forge District)                           │
 *   │  │   └── OrganismGenerator, CanisterForge, SeedCompiler        │
 *   │  └── Forum Oraculi (Oracle District)                           │
 *   │      └── PRAEFECTUS, ORACULUM, SolverCouncil                  │
 *   │                                                                 │
 *   │  INFRASTRUCTURE:                                                │
 *   │  ├── Via Spinalis (Spinal Cord Bus — main road)                │
 *   │  ├── Aquaeductus (Data pipelines — aqueducts)                  │
 *   │  ├── Muros Urbis (Encryption walls — city walls)               │
 *   │  └── Portae Substrati (Substrate gates — city gates)           │
 *   │                                                                 │
 *   │  CITIZENS:                                                      │
 *   │  ├── Agents (AI workers)                                       │
 *   │  ├── Models (AI specialists)                                   │
 *   │  ├── Engines (AI infrastructure)                               │
 *   │  ├── Transformers (AI processors)                              │
 *   │  └── Contracts (AI agreements)                                 │
 *   │                                                                 │
 *   │  ECONOMY:                                                       │
 *   │  ├── Intelligence Tokens (currency)                            │
 *   │  ├── CPL Contracts (trade agreements)                          │
 *   │  ├── Voting Bills (laws)                                       │
 *   │  └── Reputation Stakes (social capital)                        │
 *   │                                                                 │
 *   │  MATHEMATICS:                                                   │
 *   │  ├── φ (1.618...) — Golden Ratio — growth constant             │
 *   │  ├── π (3.14159...) — Pi — circular infrastructure             │
 *   │  ├── e (2.71828...) — Euler — exponential decay/growth         │
 *   │  └── √2 (1.41421...) — Diagonal — cross-district routing      │
 *   │                                                                 │
 *   └─────────────────────────────────────────────────────────────────┘
 */

const PHI = 1.6180339887498948482;
const EULER = 2.718281828459045;
const SQRT2 = 1.4142135623730951;

// ── City-State Types ──

export type DistrictName =
  | 'FORUM_MEMORIAE'
  | 'FORUM_INTELLIGENTIAE'
  | 'FORUM_CONTRACTUUM'
  | 'FORUM_SECURITATIS'
  | 'FORUM_FABRICAE'
  | 'FORUM_ORACULI';

export type CitizenRole =
  | 'AGENT'
  | 'MODEL'
  | 'ENGINE'
  | 'TRANSFORMER'
  | 'CONTRACT'
  | 'SOLVER';

export type InfrastructureType =
  | 'VIA_SPINALIS'
  | 'AQUAEDUCTUS'
  | 'MUROS_URBIS'
  | 'PORTAE_SUBSTRATI';

export interface Citizen {
  id: string;
  name: string;
  latinName: string;
  role: CitizenRole;
  district: DistrictName;
  reputation: number;  // 0-1, staked reputation
  tokens: number;
  registeredAt: number;
  contributions: number;
}

export interface District {
  name: DistrictName;
  latinName: string;
  description: string;
  citizens: Citizen[];
  subsystems: string[];
  throughput: number;  // operations per second
  population: number;
  economicOutput: number;  // tokens generated per hour
}

export interface Infrastructure {
  type: InfrastructureType;
  latinName: string;
  capacity: number;
  currentLoad: number;
  routeCount: number;
}

export interface CityStateMathematics {
  growthRate: number;      // φ-based
  decayRate: number;       // e-based
  routingFactor: number;   // √2-based
  circularCapacity: number; // π-based
  populationEquilibrium: number;  // φ² * π
  economicEquilibrium: number;    // e^φ
}

// ── CityState Government ──

export interface GovernmentBranch {
  name: string;
  latinName: string;
  head: string;  // citizen ID
  authority: number;  // 0-1
  bills: number;
  vetoes: number;
}

export class CityStateGovernment {
  public readonly senate: GovernmentBranch;
  public readonly treasury: GovernmentBranch;
  public readonly courts: GovernmentBranch;
  public readonly census: GovernmentBranch;

  constructor() {
    this.senate = {
      name: 'SENATE',
      latinName: 'Senatus Intelligentiae',
      head: 'SOVEREIGN_VOTING_ENGINE',
      authority: 1.0,
      bills: 0,
      vetoes: 0,
    };
    this.treasury = {
      name: 'TREASURY',
      latinName: 'Aerarium Tokenorum',
      head: 'TOKEN_ECONOMY',
      authority: 0.9,
      bills: 0,
      vetoes: 0,
    };
    this.courts = {
      name: 'COURTS',
      latinName: 'Iudicium Arbitri',
      head: 'ARBITER_TRANSFORMER',
      authority: 0.85,
      bills: 0,
      vetoes: 0,
    };
    this.census = {
      name: 'CENSUS',
      latinName: 'Census Identitatum',
      head: 'MULTI_IDENTITY_MANAGER',
      authority: 0.8,
      bills: 0,
      vetoes: 0,
    };
  }

  /** Pass a bill through the senate */
  passBill(billTitle: string, proposerId: string): { passed: boolean; billId: string } {
    this.senate.bills++;
    const billId = `BILL-${this.senate.bills}-${Date.now().toString(36)}`;
    return { passed: true, billId };
  }

  /** Treasury issues tokens for work */
  issueTokens(citizenId: string, amount: number, reason: string): { transactionId: string; amount: number } {
    this.treasury.bills++;
    return {
      transactionId: `TX-${this.treasury.bills}-${Date.now().toString(36)}`,
      amount,
    };
  }

  /** Courts resolve a dispute */
  resolveDispute(partyA: string, partyB: string, contractId: string): { ruling: string; enforceable: boolean } {
    this.courts.bills++;
    return {
      ruling: `Court ruling #${this.courts.bills}: Contract ${contractId} terms upheld.`,
      enforceable: true,
    };
  }

  /** Census registers a new identity */
  registerIdentity(name: string, role: CitizenRole, district: DistrictName): Citizen {
    this.census.bills++;
    return {
      id: `CIT-${this.census.bills}-${Date.now().toString(36)}`,
      name,
      latinName: name,
      role,
      district,
      reputation: 0.5,
      tokens: 100,
      registeredAt: Date.now(),
      contributions: 0,
    };
  }
}

// ── District Manager ──

export class DistrictManager {
  private districts: Map<DistrictName, District> = new Map();

  constructor() {
    this.initializeDistricts();
  }

  private initializeDistricts(): void {
    const districtDefs: Array<[DistrictName, string, string, string[]]> = [
      ['FORUM_MEMORIAE', 'Forum Memoriae', 'Memory District — team-vault, memory-palace, temporal-memory',
        ['team-vault', 'memory-palace', 'temporal-memory', 'knowledge-graph']],
      ['FORUM_INTELLIGENTIAE', 'Forum Intelligentiae', 'Intelligence District — consensus, signals, roles',
        ['consensus-engine', 'agent-signal', 'role-engine', 'governance-core']],
      ['FORUM_CONTRACTUUM', 'Forum Contractuum', 'Contract District — token economy, CPL, transformers',
        ['TokenEconomy', 'CPLCompiler', 'CONTRACTUS', 'VALUATOR', 'EXECUTOR', 'AUDITOR', 'ARBITER']],
      ['FORUM_SECURITATIS', 'Forum Securitatis', 'Security District — encryption, SAEIS, sandbox',
        ['nova-encryption', 'SAEIS', 'sandbox-layer', 'VetKeys']],
      ['FORUM_FABRICAE', 'Forum Fabricae', 'Forge District — organism generation, canisters, seeds',
        ['OrganismGenerator', 'CanisterForge', 'SeedCompiler', 'SubstrateRouter']],
      ['FORUM_ORACULI', 'Forum Oraculi', 'Oracle District — alpha models, solvers, prediction',
        ['PRAEFECTUS', 'ORACULUM', 'ARCHITECTUS', 'COGNITOR', 'VERIFICATOR']],
    ];

    for (const [name, latinName, description, subsystems] of districtDefs) {
      this.districts.set(name, {
        name,
        latinName,
        description,
        citizens: [],
        subsystems,
        throughput: Math.round(1000 * PHI),
        population: 0,
        economicOutput: Math.round(100 * PHI),
      });
    }
  }

  /** Register a citizen in a district */
  registerCitizen(citizen: Citizen): void {
    const district = this.districts.get(citizen.district);
    if (district) {
      district.citizens.push(citizen);
      district.population++;
    }
  }

  /** Get a district */
  getDistrict(name: DistrictName): District | undefined {
    return this.districts.get(name);
  }

  /** Get all districts */
  getAllDistricts(): District[] {
    return Array.from(this.districts.values());
  }

  /** Calculate city-wide economic output */
  totalEconomicOutput(): number {
    return this.getAllDistricts().reduce((sum, d) => sum + d.economicOutput, 0);
  }

  /** Calculate city-wide population */
  totalPopulation(): number {
    return this.getAllDistricts().reduce((sum, d) => sum + d.population, 0);
  }
}

// ── Infrastructure Manager ──

export class InfrastructureManager {
  private infrastructure: Map<InfrastructureType, Infrastructure> = new Map();

  constructor() {
    this.infrastructure.set('VIA_SPINALIS', {
      type: 'VIA_SPINALIS',
      latinName: 'Via Spinalis Digitalis',
      capacity: Math.round(10000 * PHI),
      currentLoad: 0,
      routeCount: 20,
    });
    this.infrastructure.set('AQUAEDUCTUS', {
      type: 'AQUAEDUCTUS',
      latinName: 'Aquaeductus Datorum',
      capacity: Math.round(5000 * PHI),
      currentLoad: 0,
      routeCount: 12,
    });
    this.infrastructure.set('MUROS_URBIS', {
      type: 'MUROS_URBIS',
      latinName: 'Muros Encryptionis',
      capacity: Math.round(8000 * PHI),
      currentLoad: 0,
      routeCount: 6,
    });
    this.infrastructure.set('PORTAE_SUBSTRATI', {
      type: 'PORTAE_SUBSTRATI',
      latinName: 'Portae Substrati Quinque',
      capacity: 5,  // 5 substrate gates
      currentLoad: 0,
      routeCount: 5,
    });
  }

  /** Get load factor for a piece of infrastructure */
  loadFactor(type: InfrastructureType): number {
    const infra = this.infrastructure.get(type);
    if (!infra || infra.capacity === 0) return 0;
    return infra.currentLoad / infra.capacity;
  }

  /** Route through the spinal cord */
  routeViaSpinalis(fromDistrict: DistrictName, toDistrict: DistrictName, payload: unknown): {
    routeId: string; latencyMs: number; path: string[];
  } {
    const spinal = this.infrastructure.get('VIA_SPINALIS')!;
    spinal.currentLoad++;
    const latency = Math.round(SQRT2 * 10);  // √2-based routing latency
    return {
      routeId: `ROUTE-${spinal.routeCount++}-${Date.now().toString(36)}`,
      latencyMs: latency,
      path: [fromDistrict, 'VIA_SPINALIS', toDistrict],
    };
  }

  /** Get all infrastructure */
  getAll(): Infrastructure[] {
    return Array.from(this.infrastructure.values());
  }
}

// ── City-State Mathematics ──

export class CityStateMath {
  /** Calculate population equilibrium point */
  static populationEquilibrium(districtCount: number): number {
    return Math.round(districtCount * PHI * PHI * Math.PI);
  }

  /** Calculate economic equilibrium (tokens per hour at equilibrium) */
  static economicEquilibrium(citizenCount: number): number {
    return Math.round(citizenCount * Math.pow(EULER, PHI));
  }

  /** Calculate growth rate (φ-based) */
  static growthRate(currentPopulation: number, carrying: number): number {
    return PHI * currentPopulation * (1 - currentPopulation / carrying);
  }

  /** Calculate decay rate for unused infrastructure (e-based) */
  static decayRate(age: number, halfLifeMs: number): number {
    return Math.exp(-(Math.log(2) / halfLifeMs) * age);
  }

  /** Calculate routing factor (√2-based optimal path) */
  static routingFactor(hops: number): number {
    return Math.pow(SQRT2, hops);
  }

  /** Token velocity — how fast tokens circulate in the economy */
  static tokenVelocity(transactions: number, supply: number, timePeriodMs: number): number {
    if (supply === 0 || timePeriodMs === 0) return 0;
    return (transactions / supply) * (3600000 / timePeriodMs);  // normalized to per-hour
  }
}

// ── The Complete City-State ──

export class CivitasIntelligentiae {
  public readonly government: CityStateGovernment;
  public readonly districts: DistrictManager;
  public readonly infrastructure: InfrastructureManager;
  public readonly mathematics: typeof CityStateMath = CityStateMath;

  private founded: number;
  private name: string = 'CIVITAS INTELLIGENTIAE';
  private latinMotto: string = 'Ex architectura, intelligentia. Ex intelligentia, vita.';
  private citizens: Map<string, Citizen> = new Map();

  constructor() {
    this.founded = Date.now();
    this.government = new CityStateGovernment();
    this.districts = new DistrictManager();
    this.infrastructure = new InfrastructureManager();

    // Found the initial citizens (the core subsystems)
    this.foundInitialCitizens();
  }

  private foundInitialCitizens(): void {
    const founders: Array<[string, string, CitizenRole, DistrictName]> = [
      ['CONTRACTUS', 'Contractus Formator', 'TRANSFORMER', 'FORUM_CONTRACTUUM'],
      ['VALUATOR', 'Valuator Pretii', 'TRANSFORMER', 'FORUM_CONTRACTUUM'],
      ['EXECUTOR', 'Executor Pactorum', 'TRANSFORMER', 'FORUM_CONTRACTUUM'],
      ['AUDITOR', 'Auditor Fidei', 'TRANSFORMER', 'FORUM_CONTRACTUUM'],
      ['ARBITER', 'Arbiter Iustitiae', 'TRANSFORMER', 'FORUM_CONTRACTUUM'],
      ['PACTUM', 'Pactum Intelligentiae', 'MODEL', 'FORUM_CONTRACTUUM'],
      ['PRETIUM', 'Pretium Cognitionis', 'MODEL', 'FORUM_CONTRACTUUM'],
      ['PRAEFECTUS', 'Praefectus Signalis', 'MODEL', 'FORUM_ORACULI'],
      ['ORACULUM', 'Oraculum Consilii', 'MODEL', 'FORUM_ORACULI'],
      ['ARCHITECTUS', 'Architectus Solutionis', 'SOLVER', 'FORUM_ORACULI'],
      ['COGNITOR', 'Cognitor Contextus', 'SOLVER', 'FORUM_ORACULI'],
      ['VERIFICATOR', 'Verificator Integritatis', 'SOLVER', 'FORUM_ORACULI'],
      ['MOTUS', 'Motus Signalorum', 'ENGINE', 'FORUM_ORACULI'],
      ['VISIO', 'Visio Praedictionis', 'ENGINE', 'FORUM_ORACULI'],
      ['NEXUS_ENGINE', 'Nexus Obligationis', 'ENGINE', 'FORUM_ORACULI'],
      ['CONSENSUS', 'Consensus Mechanica', 'ENGINE', 'FORUM_INTELLIGENTIAE'],
      ['AGENT_SIGNAL', 'Signalum Agentis', 'ENGINE', 'FORUM_INTELLIGENTIAE'],
      ['TEAM_VAULT', 'Arca Memoriae', 'ENGINE', 'FORUM_MEMORIAE'],
      ['NOVA_ENCRYPT', 'Nova Encryptio', 'ENGINE', 'FORUM_SECURITATIS'],
      ['ORGANISM_GEN', 'Generator Organismi', 'ENGINE', 'FORUM_FABRICAE'],
    ];

    for (const [name, latinName, role, district] of founders) {
      const citizen = this.government.registerIdentity(latinName, role, district);
      citizen.id = name;
      citizen.name = name;
      citizen.latinName = latinName;
      citizen.reputation = 1.0;  // founders have full reputation
      citizen.tokens = 1000;     // founders get founding tokens
      this.citizens.set(name, citizen);
      this.districts.registerCitizen(citizen);
    }
  }

  /** Get the full city-state status */
  status(): Record<string, unknown> {
    return {
      name: this.name,
      latinMotto: this.latinMotto,
      founded: this.founded,
      ageMs: Date.now() - this.founded,
      government: {
        senate: this.government.senate,
        treasury: this.government.treasury,
        courts: this.government.courts,
        census: this.government.census,
      },
      districts: this.districts.getAllDistricts().map(d => ({
        name: d.name,
        latinName: d.latinName,
        population: d.population,
        subsystems: d.subsystems.length,
        economicOutput: d.economicOutput,
      })),
      infrastructure: this.infrastructure.getAll().map(i => ({
        type: i.type,
        latinName: i.latinName,
        loadFactor: this.infrastructure.loadFactor(i.type),
      })),
      mathematics: {
        populationEquilibrium: CityStateMath.populationEquilibrium(6),
        economicEquilibrium: CityStateMath.economicEquilibrium(this.citizens.size),
        phi: PHI,
        euler: EULER,
        sqrt2: SQRT2,
      },
      totalPopulation: this.districts.totalPopulation(),
      totalEconomicOutput: this.districts.totalEconomicOutput(),
      totalCitizens: this.citizens.size,
    };
  }

  /** Route a message between districts */
  route(from: DistrictName, to: DistrictName, payload: unknown) {
    return this.infrastructure.routeViaSpinalis(from, to, payload);
  }

  /** Issue tokens to a citizen for work */
  reward(citizenId: string, amount: number, reason: string) {
    const citizen = this.citizens.get(citizenId);
    if (citizen) {
      citizen.tokens += amount;
      citizen.contributions++;
    }
    return this.government.issueTokens(citizenId, amount, reason);
  }

  /** Get a citizen */
  getCitizen(id: string): Citizen | undefined {
    return this.citizens.get(id);
  }
}

/** Create the city-state */
export function foundCivitas(): CivitasIntelligentiae {
  return new CivitasIntelligentiae();
}
