// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * TOKEN ECONOMY — INTELLIGENCE CONTRACT SYSTEM
 * ─────────────────────────────────────────────────────────────────────────
 * Token technology as contracts — Intelligence Contracts between AIs
 * using Cognitive Procurement Language (CPL).
 *
 * 5 TRANSFORMERS:
 *   1. CONTRACTUS — Contract Formation Transformer
 *   2. VALUATOR  — Value Assessment Transformer
 *   3. EXECUTOR  — Contract Execution Transformer
 *   4. AUDITOR   — Compliance & Audit Transformer
 *   5. ARBITER   — Dispute Resolution Transformer
 *
 * 5 MODELS:
 *   1. PACTUM    (Pactum Intelligentiae) — Contract Intelligence Model
 *   2. PRETIUM   (Pretium Cognitionis)   — Cognitive Pricing Model
 *   3. NEXUS     (Nexus Obligationis)    — Obligation Binding Model
 *   4. FIDES     (Fides Mechanica)       — Trust Mechanics Model
 *   5. MEMORIA   (Memoria Contractus)    — Contract Memory Model
 *
 * 30 USES OF INTELLIGENCE CONTRACTS:
 *   1.  Memory-sharing agreements between agents
 *   2.  Compute resource procurement
 *   3.  Knowledge licensing and royalties
 *   4.  Task delegation contracts
 *   5.  Data pipeline access leases
 *   6.  Model inference-time leasing
 *   7.  Training data exchange contracts
 *   8.  Consensus participation bonds
 *   9.  Governance voting stake contracts
 *   10. Dispute mediation service agreements
 *   11. Priority queue access tokens
 *   12. Agent reputation staking
 *   13. Cross-system bridge toll contracts
 *   14. Federated learning participation pacts
 *   15. Audit trail notarisation services
 *   16. Emergency override authorisations
 *   17. Collaborative reasoning session contracts
 *   18. Skill rental agreements (agent-to-agent)
 *   19. Sovereign memory escrow contracts
 *   20. Token minting authorisation pacts
 *   21. Decay rate negotiation agreements
 *   22. TTL extension service contracts
 *   23. Multi-agent workflow orchestration bonds
 *   24. Quality-of-service guarantees
 *   25. Retrieval-augmented generation data contracts
 *   26. Context window sharing leases
 *   27. Agent spawning and lifecycle management pacts
 *   28. Intellectual property attribution contracts
 *   29. Chain-of-thought verification services
 *   30. Sovereign veto insurance policies
 *
 * Architecture:
 *   AI Agent A
 *       ↓ CPL contract proposal
 *   CONTRACTUS Transformer → validates syntax, terms
 *       ↓
 *   VALUATOR Transformer → assesses value, pricing
 *       ↓
 *   PACTUM Model → generates binding contract
 *       ↓
 *   EXECUTOR Transformer → executes contract terms
 *       ↓
 *   AUDITOR Transformer → compliance verification
 *       ↓
 *   ARBITER Transformer → handles disputes
 *       ↓
 *   AI Agent B receives fulfillment
 */

// ─────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────

export type ContractStatus =
  | 'PROPOSED'
  | 'VALIDATED'
  | 'PRICED'
  | 'BOUND'
  | 'EXECUTING'
  | 'EXECUTED'
  | 'AUDITED'
  | 'DISPUTED'
  | 'RESOLVED'
  | 'CANCELLED';

export interface ContractParty {
  agentId: string;
  role: 'PROPOSER' | 'COUNTERPARTY' | 'WITNESS';
  stake: number;
}

export interface ContractTerm {
  termId: string;
  description: string;
  obligationType: 'DELIVER' | 'PAY' | 'PERFORM' | 'ABSTAIN';
  value: number;
  deadline: number;
  fulfilled: boolean;
}

export interface AuditEntry {
  timestamp: number;
  transformer: string;
  action: string;
  details: string;
  hash: string;
}

/** A single intelligence contract between AI agents. */
export interface IntelligenceContract {
  contractId: string;
  parties: ContractParty[];
  terms: ContractTerm[];
  cplSource: string;
  status: ContractStatus;
  value: number;
  created: number;
  executed: number | null;
  auditTrail: AuditEntry[];
}

// ─────────────────────────────────────────────────────────────────────────
// Cost Structures
// ─────────────────────────────────────────────────────────────────────────

export interface TransformerCost {
  baseCost: number;
  perTermCost: number;
  perPartyCost: number;
}

export interface ModelCost {
  initialisationCost: number;
  perInferenceCost: number;
}

const TRANSFORMER_COSTS: Record<string, TransformerCost> = {
  CONTRACTUS: { baseCost: 10, perTermCost: 2, perPartyCost: 1 },
  VALUATOR:   { baseCost: 15, perTermCost: 5, perPartyCost: 0 },
  EXECUTOR:   { baseCost: 20, perTermCost: 8, perPartyCost: 2 },
  AUDITOR:    { baseCost: 12, perTermCost: 3, perPartyCost: 1 },
  ARBITER:    { baseCost: 25, perTermCost: 10, perPartyCost: 5 },
};

const MODEL_COSTS: Record<string, ModelCost> = {
  PACTUM:  { initialisationCost: 50, perInferenceCost: 5 },
  PRETIUM: { initialisationCost: 40, perInferenceCost: 8 },
  NEXUS:   { initialisationCost: 60, perInferenceCost: 6 },
  FIDES:   { initialisationCost: 35, perInferenceCost: 4 },
  MEMORIA: { initialisationCost: 45, perInferenceCost: 3 },
};

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

let _idCounter = 0;
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${++_idCounter}`;
}

function hashString(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(16).padStart(8, '0');
}

function calcTransformerCost(name: string, terms: number, parties: number): number {
  const c = TRANSFORMER_COSTS[name];
  if (!c) return 0;
  return c.baseCost + c.perTermCost * terms + c.perPartyCost * parties;
}

// ─────────────────────────────────────────────────────────────────────────
// Transformer Interfaces & Implementations
// ─────────────────────────────────────────────────────────────────────────

/** Base interface shared by all transformers. */
export interface ITransformer {
  name: string;
  process(contract: IntelligenceContract): IntelligenceContract;
  cost(contract: IntelligenceContract): number;
}

/**
 * CONTRACTUS — Contract Formation Transformer
 *
 * Validates CPL syntax, ensures all required fields exist, and checks that
 * parties and terms are internally consistent.
 */
export class ContractusTransformer implements ITransformer {
  name = 'CONTRACTUS';

  process(contract: IntelligenceContract): IntelligenceContract {
    if (!contract.cplSource || contract.cplSource.trim().length === 0) {
      throw new Error('CONTRACTUS: CPL source is empty');
    }
    if (contract.parties.length < 2) {
      throw new Error('CONTRACTUS: At least 2 parties required');
    }
    if (contract.terms.length === 0) {
      throw new Error('CONTRACTUS: At least 1 term required');
    }

    const audit: AuditEntry = {
      timestamp: Date.now(),
      transformer: this.name,
      action: 'VALIDATE',
      details: `Validated ${contract.terms.length} terms, ${contract.parties.length} parties`,
      hash: hashString(contract.cplSource),
    };

    return {
      ...contract,
      status: 'VALIDATED',
      auditTrail: [...contract.auditTrail, audit],
    };
  }

  cost(contract: IntelligenceContract): number {
    return calcTransformerCost(this.name, contract.terms.length, contract.parties.length);
  }
}

/**
 * VALUATOR — Value Assessment Transformer
 *
 * Assesses the total value of the contract based on term obligations and
 * party stakes. Produces a fair-market value estimate.
 */
export class ValuatorTransformer implements ITransformer {
  name = 'VALUATOR';

  process(contract: IntelligenceContract): IntelligenceContract {
    const termValue = contract.terms.reduce((sum, t) => sum + t.value, 0);
    const stakeValue = contract.parties.reduce((sum, p) => sum + p.stake, 0);
    const totalValue = termValue + stakeValue * 0.1;

    const audit: AuditEntry = {
      timestamp: Date.now(),
      transformer: this.name,
      action: 'PRICE',
      details: `Term value: ${termValue}, stake bonus: ${(stakeValue * 0.1).toFixed(2)}, total: ${totalValue.toFixed(2)}`,
      hash: hashString(String(totalValue)),
    };

    return {
      ...contract,
      status: 'PRICED',
      value: totalValue,
      auditTrail: [...contract.auditTrail, audit],
    };
  }

  cost(contract: IntelligenceContract): number {
    return calcTransformerCost(this.name, contract.terms.length, contract.parties.length);
  }
}

/**
 * EXECUTOR — Contract Execution Transformer
 *
 * Executes the terms of a bound contract, marking each term as fulfilled
 * if its deadline has not passed.
 */
export class ExecutorTransformer implements ITransformer {
  name = 'EXECUTOR';

  process(contract: IntelligenceContract): IntelligenceContract {
    const now = Date.now();
    const executedTerms = contract.terms.map((term) => ({
      ...term,
      fulfilled: now <= term.deadline,
    }));

    const fulfilledCount = executedTerms.filter((t) => t.fulfilled).length;
    const audit: AuditEntry = {
      timestamp: now,
      transformer: this.name,
      action: 'EXECUTE',
      details: `Executed ${fulfilledCount}/${executedTerms.length} terms successfully`,
      hash: hashString(contract.contractId + now),
    };

    return {
      ...contract,
      terms: executedTerms,
      status: 'EXECUTED',
      executed: now,
      auditTrail: [...contract.auditTrail, audit],
    };
  }

  cost(contract: IntelligenceContract): number {
    return calcTransformerCost(this.name, contract.terms.length, contract.parties.length);
  }
}

/**
 * AUDITOR — Compliance & Audit Transformer
 *
 * Verifies that all executed terms were fulfilled, that the audit trail
 * is intact, and that no terms were modified after execution.
 */
export class AuditorTransformer implements ITransformer {
  name = 'AUDITOR';

  process(contract: IntelligenceContract): IntelligenceContract {
    const unfulfilledTerms = contract.terms.filter((t) => !t.fulfilled);
    const compliant = unfulfilledTerms.length === 0;

    const audit: AuditEntry = {
      timestamp: Date.now(),
      transformer: this.name,
      action: 'AUDIT',
      details: compliant
        ? 'All terms fulfilled — contract compliant'
        : `Non-compliant: ${unfulfilledTerms.length} unfulfilled terms`,
      hash: hashString(JSON.stringify(contract.terms)),
    };

    return {
      ...contract,
      status: compliant ? 'AUDITED' : 'DISPUTED',
      auditTrail: [...contract.auditTrail, audit],
    };
  }

  cost(contract: IntelligenceContract): number {
    return calcTransformerCost(this.name, contract.terms.length, contract.parties.length);
  }
}

/**
 * ARBITER — Dispute Resolution Transformer
 *
 * Resolves disputed contracts by assessing unfulfilled terms, applying
 * penalty logic, and producing a binding resolution.
 */
export class ArbiterTransformer implements ITransformer {
  name = 'ARBITER';

  process(contract: IntelligenceContract): IntelligenceContract {
    if (contract.status !== 'DISPUTED') {
      return contract; // nothing to arbitrate
    }

    const unfulfilled = contract.terms.filter((t) => !t.fulfilled);
    const penaltyTotal = unfulfilled.reduce((sum, t) => sum + t.value * 0.5, 0);

    const audit: AuditEntry = {
      timestamp: Date.now(),
      transformer: this.name,
      action: 'RESOLVE',
      details: `Resolved dispute — penalty: ${penaltyTotal.toFixed(2)} across ${unfulfilled.length} terms`,
      hash: hashString(contract.contractId + 'resolved'),
    };

    return {
      ...contract,
      status: 'RESOLVED',
      value: contract.value - penaltyTotal,
      auditTrail: [...contract.auditTrail, audit],
    };
  }

  cost(contract: IntelligenceContract): number {
    return calcTransformerCost(this.name, contract.terms.length, contract.parties.length);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Model Interfaces & Initialisers
// ─────────────────────────────────────────────────────────────────────────

/** Base interface shared by all models. */
export interface IModel {
  name: string;
  ready: boolean;
  cost: ModelCost;
  initialise(): void;
}

/** PACTUM — Contract Intelligence Model */
export interface PactumModel extends IModel {
  generateContract(parties: ContractParty[], terms: ContractTerm[], cpl: string): IntelligenceContract;
}

/** PRETIUM — Cognitive Pricing Model */
export interface PretiumModel extends IModel {
  estimateValue(terms: ContractTerm[]): number;
}

/** NEXUS — Obligation Binding Model */
export interface NexusModel extends IModel {
  bind(contract: IntelligenceContract): IntelligenceContract;
}

/** FIDES — Trust Mechanics Model */
export interface FidesModel extends IModel {
  trustScore(agentId: string, history: IntelligenceContract[]): number;
}

/** MEMORIA — Contract Memory Model */
export interface MemoriaModel extends IModel {
  store(contract: IntelligenceContract): void;
  recall(contractId: string): IntelligenceContract | null;
  history(agentId: string): IntelligenceContract[];
}

function createPactumModel(): PactumModel {
  return {
    name: 'PACTUM',
    ready: false,
    cost: MODEL_COSTS.PACTUM,
    initialise() { this.ready = true; },
    generateContract(parties, terms, cpl) {
      return {
        contractId: generateId('CTR'),
        parties,
        terms,
        cplSource: cpl,
        status: 'PROPOSED',
        value: 0,
        created: Date.now(),
        executed: null,
        auditTrail: [],
      };
    },
  };
}

function createPretiumModel(): PretiumModel {
  return {
    name: 'PRETIUM',
    ready: false,
    cost: MODEL_COSTS.PRETIUM,
    initialise() { this.ready = true; },
    estimateValue(terms) {
      return terms.reduce((sum, t) => sum + t.value, 0);
    },
  };
}

function createNexusModel(): NexusModel {
  return {
    name: 'NEXUS',
    ready: false,
    cost: MODEL_COSTS.NEXUS,
    initialise() { this.ready = true; },
    bind(contract) {
      const audit: AuditEntry = {
        timestamp: Date.now(),
        transformer: 'NEXUS',
        action: 'BIND',
        details: `Bound contract ${contract.contractId} with ${contract.parties.length} parties`,
        hash: hashString(contract.contractId + 'bound'),
      };
      return { ...contract, status: 'BOUND' as ContractStatus, auditTrail: [...contract.auditTrail, audit] };
    },
  };
}

function createFidesModel(): FidesModel {
  return {
    name: 'FIDES',
    ready: false,
    cost: MODEL_COSTS.FIDES,
    initialise() { this.ready = true; },
    trustScore(agentId, history) {
      if (history.length === 0) return 0.5;
      const completed = history.filter(
        (c) => c.status === 'AUDITED' || c.status === 'EXECUTED' || c.status === 'RESOLVED',
      );
      return completed.length / history.length;
    },
  };
}

function createMemoriaModel(): MemoriaModel {
  const storage = new Map<string, IntelligenceContract>();
  return {
    name: 'MEMORIA',
    ready: false,
    cost: MODEL_COSTS.MEMORIA,
    initialise() { this.ready = true; },
    store(contract) { storage.set(contract.contractId, contract); },
    recall(contractId) { return storage.get(contractId) ?? null; },
    history(agentId) {
      return Array.from(storage.values()).filter((c) =>
        c.parties.some((p) => p.agentId === agentId),
      );
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────
// CPL Compiler
// ─────────────────────────────────────────────────────────────────────────

/** Parsed CPL statement. */
export interface CPLStatement {
  directive: string;
  subject: string;
  object: string;
  value: number;
  deadline: number;
}

/**
 * CPLCompiler — parses Cognitive Procurement Language contract source.
 *
 * Minimal CPL syntax (one statement per line):
 *   DIRECTIVE subject -> object VALUE value DEADLINE timestamp
 *
 * Example:
 *   DELIVER agent-a -> agent-b VALUE 100 DEADLINE 1700000000000
 */
export class CPLCompiler {
  /**
   * Parse a CPL source string into structured statements.
   */
  parse(source: string): CPLStatement[] {
    const lines = source
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));

    return lines.map((line, idx) => this.parseLine(line, idx));
  }

  /**
   * Convert structured statements back into CPL source.
   */
  compile(statements: CPLStatement[]): string {
    return statements
      .map(
        (s) =>
          `${s.directive} ${s.subject} -> ${s.object} VALUE ${s.value} DEADLINE ${s.deadline}`,
      )
      .join('\n');
  }

  /**
   * Validate a CPL source string. Returns an array of error messages (empty = valid).
   */
  validate(source: string): string[] {
    const errors: string[] = [];
    const lines = source
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));

    for (let i = 0; i < lines.length; i++) {
      try {
        this.parseLine(lines[i], i);
      } catch (err: unknown) {
        errors.push(err instanceof Error ? err.message : String(err));
      }
    }
    return errors;
  }

  private parseLine(line: string, lineNum: number): CPLStatement {
    const pattern = /^(\w+)\s+([\w-]+)\s*->\s*([\w-]+)\s+VALUE\s+([\d.]+)\s+DEADLINE\s+(\d+)$/;
    const match = line.match(pattern);
    if (!match) {
      throw new Error(`CPL syntax error on line ${lineNum + 1}: "${line}"`);
    }
    return {
      directive: match[1],
      subject: match[2],
      object: match[3],
      value: parseFloat(match[4]),
      deadline: parseInt(match[5], 10),
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// TokenEconomy — Orchestrator
// ─────────────────────────────────────────────────────────────────────────

/**
 * TokenEconomy orchestrates the full intelligence contract lifecycle.
 *
 * Lifecycle: propose → validate → price → bind → execute → audit → resolve
 */
export class TokenEconomy {
  readonly contractus: ContractusTransformer;
  readonly valuator: ValuatorTransformer;
  readonly executor: ExecutorTransformer;
  readonly auditor: AuditorTransformer;
  readonly arbiter: ArbiterTransformer;

  readonly pactum: PactumModel;
  readonly pretium: PretiumModel;
  readonly nexus: NexusModel;
  readonly fides: FidesModel;
  readonly memoria: MemoriaModel;

  readonly compiler: CPLCompiler;

  constructor() {
    this.contractus = new ContractusTransformer();
    this.valuator = new ValuatorTransformer();
    this.executor = new ExecutorTransformer();
    this.auditor = new AuditorTransformer();
    this.arbiter = new ArbiterTransformer();

    this.pactum = createPactumModel();
    this.pretium = createPretiumModel();
    this.nexus = createNexusModel();
    this.fides = createFidesModel();
    this.memoria = createMemoriaModel();

    this.compiler = new CPLCompiler();

    // Initialise all models
    this.pactum.initialise();
    this.pretium.initialise();
    this.nexus.initialise();
    this.fides.initialise();
    this.memoria.initialise();
  }

  /**
   * Propose a new intelligence contract from CPL source.
   *
   * @param cplSource  CPL contract source text.
   * @param parties    Parties involved in the contract.
   * @returns A PROPOSED {@link IntelligenceContract}.
   */
  propose(cplSource: string, parties: ContractParty[]): IntelligenceContract {
    const statements = this.compiler.parse(cplSource);

    const terms: ContractTerm[] = statements.map((s, i) => ({
      termId: generateId('TRM'),
      description: `${s.directive} from ${s.subject} to ${s.object}`,
      obligationType: s.directive as ContractTerm['obligationType'],
      value: s.value,
      deadline: s.deadline,
      fulfilled: false,
    }));

    const contract = this.pactum.generateContract(parties, terms, cplSource);
    this.memoria.store(contract);
    return contract;
  }

  /**
   * Run the full lifecycle on a proposed contract.
   *
   * propose → validate → price → bind → execute → audit → (resolve if disputed)
   *
   * @returns The final contract state after all transformers have processed it.
   */
  executeLifecycle(contract: IntelligenceContract): IntelligenceContract {
    let c = contract;

    // 1. Validate
    c = this.contractus.process(c);
    this.memoria.store(c);

    // 2. Price
    c = this.valuator.process(c);
    this.memoria.store(c);

    // 3. Bind
    c = this.nexus.bind(c);
    this.memoria.store(c);

    // 4. Execute
    c = this.executor.process(c);
    this.memoria.store(c);

    // 5. Audit
    c = this.auditor.process(c);
    this.memoria.store(c);

    // 6. Resolve disputes if any
    if (c.status === 'DISPUTED') {
      c = this.arbiter.process(c);
      this.memoria.store(c);
    }

    return c;
  }

  /**
   * Calculate the total cost of processing a contract through all transformers and models.
   */
  totalCost(contract: IntelligenceContract): number {
    const transformerCost =
      this.contractus.cost(contract) +
      this.valuator.cost(contract) +
      this.executor.cost(contract) +
      this.auditor.cost(contract);

    const modelCost =
      this.pactum.cost.perInferenceCost +
      this.pretium.cost.perInferenceCost +
      this.nexus.cost.perInferenceCost +
      this.fides.cost.perInferenceCost +
      this.memoria.cost.perInferenceCost;

    return transformerCost + modelCost;
  }

  /**
   * Compute the trust score for an agent based on their contract history.
   */
  trustScore(agentId: string): number {
    const history = this.memoria.history(agentId);
    return this.fides.trustScore(agentId, history);
  }

  /**
   * Recall a contract from memory by ID.
   */
  recall(contractId: string): IntelligenceContract | null {
    return this.memoria.recall(contractId);
  }

  /**
   * Get the full contract history for an agent.
   */
  agentHistory(agentId: string): IntelligenceContract[] {
    return this.memoria.history(agentId);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────

export {
  TRANSFORMER_COSTS,
  MODEL_COSTS,
  generateId,
  hashString,
  createPactumModel,
  createPretiumModel,
  createNexusModel,
  createFidesModel,
  createMemoriaModel,
};
