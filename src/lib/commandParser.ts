import type { ParsedCommand } from '@/types';

// ─── Command Grammar ─────────────────────────────────────────────────────────
// /module verb [args...] [--flag=value] [--bool-flag]
//
// 𓂀 SOVEREIGN OMNI-INTELLIGENCE COMMAND MAP 𓂀
// Wires ALL codebase functions into the CLI.
// Grouped by domain: Core → Engines → Organism → Packages → Language

const COMMAND_MAP: Record<string, Record<string, string>> = {

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE MODULES (existing + expanded)
  // ═══════════════════════════════════════════════════════════════════════════

  memory: {
    find: 'Search memory entries',
    store: 'Store a new memory',
    pin: 'Pin a memory entry',
    unpin: 'Unpin a memory entry',
    delete: 'Delete a memory entry',
    lineage: 'Show memory lineage',
    navigate: 'Navigate to coordinate',
    dual: 'Dual semantic+resonance read',
    list: 'List recent memories',
    root: 'Jump to root memory',
    update: 'Update a memory entry',
    stats: 'Show memory statistics',
    pinned: 'List all pinned memories',
  },
  govern: {
    propose: 'Create a governance proposal',
    vote: 'Vote on a proposal',
    status: 'Show governance status',
    enact: 'Enact an approved proposal',
    audit: 'Show audit log',
    gates: 'Show gate statuses',
    list: 'List proposals',
    open: 'Open proposal for voting',
    stats: 'Show governance statistics',
  },
  model: {
    invoke: 'Invoke a model family',
    status: 'Show model statuses',
    route: 'Route a prompt to best model',
    list: 'List available models',
    health: 'Show model health',
    history: 'Show invocation history',
    stats: 'Show model statistics',
  },
  company: {
    connect: 'Connect a company system',
    internalize: 'Internalize company data',
    hybrid: 'Set hybrid mode',
    status: 'Show company status',
    list: 'List connectors',
    sync: 'Sync a connector',
    create: 'Create a new company',
    get: 'Get company details',
    default: 'Get default company',
    stats: 'Show onboarding statistics',
  },
  replay: {
    start: 'Start a replay session',
    stop: 'Stop current replay',
    play: 'Replay a session',
    list: 'List replay sessions',
    export: 'Export replay session',
    record: 'Record a replay event',
    get: 'Get session details',
    current: 'Get current session',
    stats: 'Show replay statistics',
  },
  permissions: {
    grant: 'Grant a permission',
    revoke: 'Revoke a permission',
    list: 'List permissions',
    check: 'Check permission',
    principal: 'List permissions for principal',
    stats: 'Show permission statistics',
  },
  organism: {
    status: 'Show organism state',
    register: 'Read a register',
    broadcast: 'Broadcast state',
    phase: 'Set organism phase',
    pulse: 'Pulse the organism',
    summary: 'Show register summary',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ENGINE MODULES (from src/lib/ engines)
  // ═══════════════════════════════════════════════════════════════════════════

  campaign: {
    create: 'Create a new campaign',
    get: 'Get campaign details',
    update: 'Update a campaign',
    delete: 'Delete a campaign',
    list: 'List all campaigns',
    launch: 'Launch a campaign',
    pause: 'Pause an active campaign',
    complete: 'Complete a campaign',
    target: 'Add target to campaign',
    content: 'Add content to campaign',
    metrics: 'Update campaign metrics',
    simulate: 'Simulate campaign metrics',
    templates: 'List campaign templates',
    template: 'Get a campaign template',
    fromtemplate: 'Create from template',
    history: 'Show campaign history',
    stats: 'Show campaign statistics',
  },
  voice: {
    speak: 'Speak as Oro personality',
    nova: 'Speak as Nova personality',
    listen: 'Start voice listening',
    stop: 'Stop listening or speaking',
    waveform: 'Set waveform callback',
    recognition: 'Set recognition callback',
    state: 'Set listening state callback',
  },
  message: {
    draft: 'Create a message draft',
    update: 'Update a draft',
    delete: 'Delete a draft',
    get: 'Get draft details',
    list: 'List all drafts',
    attach: 'Add attachment to draft',
    detach: 'Remove attachment from draft',
    send: 'Send a message',
    approve: 'Approve and send message',
    reject: 'Reject a pending message',
    templates: 'List message templates',
    template: 'Get message template',
    apply: 'Apply template to draft',
    fromtemplate: 'Create from template',
    schedule: 'Schedule a draft',
    cancel: 'Cancel scheduled message',
    stats: 'Show messaging statistics',
    sent: 'List sent messages',
    pending: 'List pending approvals',
  },
  export: {
    pdf: 'Generate PDF export',
    excel: 'Generate Excel export',
    json: 'Generate JSON export',
    memories: 'Export memory entries',
    proposals: 'Export governance proposals',
    report: 'Export company report',
    bizplan: 'Generate business plan',
    social: 'Generate social content',
    execute: 'Execute export config',
  },
  document: {
    list: 'List living documents',
    get: 'Get document details',
    create: 'Create a living document',
    update: 'Update a living document',
  },
  device: {
    register: 'Register a new device',
    current: 'Get current device info',
    list: 'List all devices',
    request: 'Request sensor permissions',
    revoke: 'Revoke sensor permission',
    sensors: 'Start sensor collection',
    stop: 'Stop sensor collection',
    heartbeat: 'Send device heartbeat',
    state: 'Get device state',
    rerequest: 'Re-request expired permissions',
  },
  kernel: {
    create: 'Create an organism kernel',
    execute: 'Execute a kernel',
    cycle: 'Execute full organism cycle',
    transition: 'Transition kernel state',
    active: 'Check if kernel is active',
    frequency: 'Get kernel frequency',
    resonance: 'Get organism resonance',
    glyphs: 'Get all kernel glyphs',
    color: 'Get kernel state color',
    expand: 'Expand kernel intelligence',
    compress: 'Compress to kernel glyph',
    decompress: 'Expand compressed kernel',
    transcend: 'Transcend kernel to new state',
    merge: 'Merge two kernels',
    contract: 'Create kernel contract',
    mutate: 'Mutate kernel contract',
    verify: 'Verify kernel contract',
    signature: 'Generate glyph signature',
    formula: 'Execute a formula kernel',
    registry: 'Show full-stack registry',
    find: 'Find kernel by ID',
    count: 'Count all kernels',
    deps: 'Show kernel dependencies',
    list: 'List all kernel IDs',
    decode: 'Decode glyph signature',
    distance: 'Calculate torus distance',
    nearest: 'Find nearest kernels',
  },
  edge: {
    sense: 'Sense an edge condition',
    circuit: 'Initialize circuit breaker',
    failure: 'Record circuit failure',
    check: 'Check circuit state',
    reset: 'Reset circuit breaker',
    validate: 'Validate input schema',
    capture: 'Capture system state',
    restore: 'Restore system state',
    browser: 'Check browser support',
    stats: 'Show edge statistics',
    recent: 'Show recent edges',
    clear: 'Clear edge history',
  },
  resonance: {
    shell: 'Create a shell state',
    init: 'Initialize register state',
    update: 'Update shell state',
    link: 'Create resonance link',
    strengthen: 'Strengthen a link',
    weaken: 'Weaken a link',
    pulse: 'Create resonance pulse',
    propagate: 'Propagate pulse through network',
    decay: 'Apply pulse decay',
    active: 'Check if pulse is active',
    network: 'Create resonance network',
    add: 'Add organism to network',
    connect: 'Add link to network',
    tick: 'Advance network one tick',
    broadcast: 'Broadcast pulse to network',
    team: 'Create team resonance',
    sync: 'Synchronize team',
    score: 'Calculate resonance score',
    schumann: 'Align to Schumann resonance',
    harmonics: 'Show Schumann harmonics',
    color: 'Get shell color',
    opacity: 'Get link opacity',
    size: 'Get pulse size',
    health: 'Show network health score',
  },
  recital: {
    initiate: 'Initiate a recital sequence',
    advance: 'Advance recital step',
    complete: 'Complete a recital',
    get: 'Get recital details',
    calculate: 'Calculate resonance',
  },
  gate: {
    check: 'Check a gate condition',
    enforce: 'Enforce a gate',
    all: 'Check all gates',
    escalate: 'Escalate gate issue',
    resolve: 'Resolve gate escalation',
  },
  encryption: {
    key: 'Compute live key state',
    rotate: 'Select rotation tier',
    cycle: 'Get rotation cycle length',
    phi: 'Generate phi-Beatty sequence',
    fibonacci: 'Compute Fibonacci matrix',
    keylength: 'Calculate key length bits',
    derive: 'Derive next phi key',
    hash: 'Create anima hash',
    artifact: 'Create encrypted artifact',
    signature: 'Compute frequency signature',
    info: 'Show architecture info',
  },
  wire: {
    request: 'Send intelligence wire request',
    response: 'Handle wire response',
    audit: 'Show wire audit trail',
    sync: 'Sync frontend-backend state',
    route: 'Route to component',
  },
  icp: {
    phi: 'Calculate phi power',
    spacing: 'Calculate phi spacing',
    angle: 'Calculate golden angle',
    encode: 'Phi-encode a value',
    spiral: 'Generate phi spiral',
    fibonacci: 'Generate Fibonacci sequence',
    harmonic: 'Generate harmonic series',
    note: 'Calculate note frequency',
    octave: 'Calculate octave frequency',
    harmonize: 'Calculate harmonic resonance',
    signature: 'Generate frequency signature',
    recital: 'Recital+1 step',
    health: 'Get organism health',
    coherence: 'Get field coherence',
    energy: 'Dual-read energy levels',
    hash: 'Create anima hash',
    ladder: 'Show harmonic ladder',
    tick: 'Run local sovereign tick',
    oro: 'Get local Oro state',
    nova: 'Get local Nova state',
    vitals: 'Get local vital signs',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTRACT & LEDGER MODULES (Sovereign Contracts)
  // ═══════════════════════════════════════════════════════════════════════════

  contract: {
    create: 'Create a base contract',
    sign: 'Add signature to contract',
    types: 'List all contract types',
    founder: 'Founder sovereignty contract',
    enterprise: 'Enterprise onboarding contract',
    ip: 'IP attribution contract',
    absorption: 'AI absorption contract',
    agent: 'Agent return contract',
    law: 'Law enforcement contract',
    succession: 'Succession contract',
    royalty: 'Royalty routing contract',
    csr: 'CSR node contract',
    freeze: 'Freeze contract',
    session: 'Session capture contract',
    formation: 'Memory formation contract',
    selfmod: 'Self-modification contract',
    geomagnetic: 'Geomagnetic warning contract',
  },
  ledger: {
    types: 'List all ledger types',
    founder: 'View founder ledger',
    enterprise: 'View enterprise ledger',
    ip: 'View IP ledger',
    migration: 'View AI migration ledger',
    agent: 'View agent ledger',
    law: 'View law ledger',
    lineage: 'View lineage ledger',
    royalty: 'View royalty ledger',
    csr: 'View CSR ledger',
    freeze: 'View freeze registry',
    session: 'View session ledger',
    memory: 'View memory ledger',
    evolution: 'View evolution ledger',
    warning: 'View warning ledger',
    proof: 'Generate cross-ledger proof',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CPL — COGNITIVE PROCESSING LANGUAGE
  // ═══════════════════════════════════════════════════════════════════════════

  cpl: {
    status: 'Show CPL language status',
    fields: 'List mathematical fields (CC, Ψ, IQ, M, L)',
    perception: 'CPL Engine 01 — Perception',
    reasoning: 'CPL Engine 02 — Reasoning',
    memory: 'CPL Engine 03 — Memory',
    learning: 'CPL Engine 04 — Learning',
    attention: 'CPL Engine 05 — Attention',
    engines: 'List all CPL engines',
    syntax: 'Show CPL syntax definition',
    sovereign: 'Show CPL sovereign declaration',
    hybrid: 'Show CPL hybrid architecture',
    compression: 'Show CPL compression mechanics',
    glyphs: 'Show CPL glyph construction',
    vocabulary: 'Show CPL vocabulary',
    ledger: 'Show CPL ledger system',
    organism: 'Show CPL organism integration',
    primordial: 'Show CPL primordial sources',
    intent: 'CPL Intent types (Query, Assert, Command, Propose, Resonate, Procure, Yield, Witness)',
    palace: 'CPL Memory Palace operations',
    correspondence: 'Apply Hermetic correspondence',
    vibration: 'Apply Hermetic vibration',
    compile: 'Compile expression to CPL',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INTELLIGENCE MODULES (Frontend + Organism Models)
  // ═══════════════════════════════════════════════════════════════════════════

  intelligence: {
    list: 'List all 100 frontend intelligence models',
    get: 'Get intelligence model by ID',
    category: 'List models by category',
    technology: 'List models by technology',
    manifest: 'Get full intelligence manifest',
    render: 'Render intelligence models (001–010)',
    reactive: 'Reactive intelligence models (011–020)',
    canvas: 'Canvas intelligence models (021–030)',
    worker: 'Worker intelligence models (031–040)',
    crypto: 'Crypto intelligence models (041–050)',
    storage: 'Storage intelligence models (051–060)',
    network: 'Network intelligence models (061–070)',
    sensor: 'Sensor intelligence models (071–080)',
    wasm: 'WASM intelligence models (081–090)',
    awareness: 'Awareness intelligence models (091–100)',
    family: 'Sovereign family intelligence (50 entities)',
    cost: 'Calculate intelligence model cost',
    registry: 'Show complete model registry',
  },
  nexus: {
    link: 'Subject 01 — Link Technology',
    frontend: 'Subject 02 — Frontend All Languages',
    ui: 'Subject 03 — UI Intelligence Models',
    math: 'Subject 04 — Ruth Mathematical',
    flow: 'Subject 05/06 — Intelligence Flow',
    types: 'Subject 07 — Intelligence Types',
    extensions: 'Subject 08/09/10 — Extensions, Motoko, Wires',
    deep: 'Nexus Deep Link Technology',
    architecture: 'Complete Architectural Spec',
    enterprise: 'Complete Enterprise Architecture',
    organism: 'Nexus Complete Organism',
    backend: 'All Backend Tools',
    os: 'Nexus OS core operations',
    devtools: 'Nexus Developer Tools',
    client: 'Nexus Client integration',
    staffing: 'Nexus Staffing Agency',
    complete: 'Nexus Complete specification',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ORGANISM SUBSYSTEM MODULES
  // ═══════════════════════════════════════════════════════════════════════════

  deploy: {
    agent: 'Create a deployment agent',
    team: 'Create a deployment team',
    move: 'Move agent to new position',
    fill: 'Fill a branch with agents',
    probe: 'Probe an edge',
    test: 'Run test node',
    root: 'Deploy from root',
    multi: 'Deploy multi-dimensional',
  },
  synthesis: {
    synthesize: 'Synthesize knowledge system',
    knowledge: 'Get knowledge base',
    pass: 'Get synthesis pass',
    systems: 'List all systems',
    seed: 'Seed knowledge',
  },
  wiring: {
    transfer: 'Wire transfer between domains',
    inversion: 'Wire inversion operation',
    bypass: 'Wire bypass path',
    disguise: 'Wire disguise operation',
    reentry: 'Wire reentry operation',
    domains: 'List all domains',
    root: 'Get architecture root',
    edges: 'Get architecture edges',
  },
  thermodynamics: {
    alpha: 'Alpha thermodynamic models',
    engine: 'Thermodynamic engine state',
    entropy: 'Calculate entropy',
    equilibrium: 'Calculate equilibrium',
  },
  quantum: {
    state: 'Show quantum architecture state',
    entangle: 'Quantum entanglement operation',
    superpose: 'Quantum superposition',
  },
  compiler: {
    compile: 'Compile organism expression',
    parse: 'Parse organism code',
    emit: 'Emit compiled output',
  },
  network: {
    anima: 'AnimaNet network operations',
    peers: 'List network peers',
    connect: 'Connect to network node',
    broadcast: 'Broadcast to network',
  },
  os: {
    runtime: 'Medina Runtime status',
    anima: 'AnimaOS operations',
    boot: 'Boot sequence',
  },
  access: {
    check: 'Check access level',
    grant: 'Grant access',
    revoke: 'Revoke access',
    audit: 'Access audit log',
  },
  sandbox: {
    execute: 'Execute in sandbox',
    policy: 'Set sandbox policy',
    permissions: 'Sandbox permissions',
    status: 'Sandbox status',
  },
  sensory: {
    vision: 'Vision sensory input',
    audio: 'Audio sensory input',
    motion: 'Motion sensory input',
  },
  saas: {
    deploy: 'Deploy OSSaaS instance',
    status: 'OSSaaS status',
    configure: 'Configure OSSaaS',
  },
  civilization: {
    macro: 'Macro-organism operations',
    evolve: 'Evolve civilization',
    network: 'Civilization network',
    status: 'Civilization status',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PACKAGE MODULES (from packages/)
  // ═══════════════════════════════════════════════════════════════════════════

  signal: {
    emit: 'Emit a signal',
    listen: 'Listen for signals',
    channel: 'Create signal channel',
    bus: 'Signal bus operations',
  },
  consensus: {
    vote: 'Cast consensus vote',
    summarise: 'Summarise consensus',
    weights: 'Show role weights',
    result: 'Get consensus result',
  },
  frequency: {
    entrain: 'Entrain to frequency',
    band: 'Set brainwave band',
    profile: 'Get entrainment profile',
    schumann: 'Schumann resonance',
  },
  bus: {
    emit: 'Emit sovereign event',
    subscribe: 'Subscribe to channel',
    channel: 'Manage bus channel',
    dead: 'View dead letter queue',
  },
  vault: {
    store: 'Store in team vault',
    get: 'Get from vault',
    list: 'List vault entries',
    size: 'Show vault size',
    decay: 'Check vault decay',
    strength: 'Compute vault strength',
  },
  translate: {
    maven: 'Translate to Maven (Java)',
    nuget: 'Translate to NuGet (.NET)',
    ruby: 'Translate to RubyGems',
    docker: 'Translate to Docker',
    source: 'Set translation source',
    export: 'Export translation symbols',
  },
  council: {
    alpha: 'Alpha Model Registry',
    praefectus: 'Praefectus operations',
    oraculum: 'Oraculum intelligence',
    motus: 'Motus Engine',
    visio: 'Visio Engine',
    solver: 'Solver Council',
    architectus: 'Architectus operations',
    cognitor: 'Cognitor intelligence',
    verificator: 'Verificator checks',
    found: 'Found Civitas Intelligentiae',
  },
  role: {
    define: 'Define a role',
    assign: 'Assign role to entity',
    check: 'Check authority level',
    templates: 'Show role templates',
  },
  substrate: {
    identity: 'Multi-identity management',
    organism: 'Organism generation',
    spinal: 'Spinal cord bus',
    anima: 'Anima runtime',
  },
  sdk: {
    init: 'Initialize Medina SDK',
    store: 'Store via SDK',
    retrieve: 'Retrieve via SDK',
    spatial: 'Spatial memory SDK',
    documents: 'Document memory SDK',
    graph: 'Knowledge graph SDK',
    search: 'Knowledge search SDK',
    context: 'Context engine SDK',
    patterns: 'Pattern recognition SDK',
    temporal: 'Temporal memory SDK',
    harmonic: 'Harmonic computing SDK',
    teams: 'Multi-AI teams SDK',
  },
  marketplace: {
    list: 'List all tools in marketplace',
    find: 'Find a specific tool',
    install: 'Install a tool',
    public: 'List public sovereign tools',
    commercial: 'List commercial tools',
    internal: 'List internal organism tools',
    catalog: 'Print full catalog',
  },
  graph: {
    entity: 'Manage knowledge entities',
    relation: 'Manage entity relations',
    infer: 'Run graph inference',
    query: 'Query knowledge graph',
  },
  palace: {
    room: 'Manage memory rooms',
    fragment: 'Manage memory fragments',
    store: 'Store in memory palace',
    retrieve: 'Retrieve from palace',
  },
  temporal: {
    record: 'Record temporal event',
    retrieve: 'Retrieve temporal record',
    timeline: 'View timeline',
  },
  harmonic: {
    compute: 'Run harmonic computation',
    resonate: 'Calculate resonance',
    schumann: 'Schumann harmonics',
  },
  token: {
    economy: 'Token economy operations',
    vote: 'Token-weighted voting',
    weighted: 'Weighted token vote',
    sovereign: 'Sovereign token vote',
  },
  livingdoc: {
    engine: 'Living document engine',
    section: 'Manage document sections',
    access: 'Document access records',
  },
  incentive: {
    coordinator: 'Sovereign coordinator',
    claim: 'Claim records',
    resolution: 'Resolution records',
    standing: 'Standing records',
    covenant: 'Stage covenant',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HELP MODULE (expanded)
  // ═══════════════════════════════════════════════════════════════════════════

  help: {
    '': 'Show help',
    commands: 'List all commands',
    modules: 'List all modules by category',
    search: 'Search commands by keyword',
  },
};

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();

  if (!trimmed.startsWith('/')) {
    return {
      raw: trimmed,
      verb: '',
      module: '',
      args: [],
      flags: {},
      valid: false,
      error: 'Not a command (no leading /)',
    };
  }

  const parts = trimmed.slice(1).split(/\s+/);
  const moduleRaw = parts[0]?.toLowerCase() ?? '';
  const verb = parts[1]?.toLowerCase() ?? '';
  const rawArgs = parts.slice(2);

  // Parse flags and positional args
  const flags: Record<string, string | boolean> = {};
  const args: string[] = [];

  for (const part of rawArgs) {
    if (part.startsWith('--')) {
      const eqIdx = part.indexOf('=');
      if (eqIdx !== -1) {
        flags[part.slice(2, eqIdx)] = part.slice(eqIdx + 1);
      } else {
        flags[part.slice(2)] = true;
      }
    } else {
      args.push(part);
    }
  }

  const moduleCommands = COMMAND_MAP[moduleRaw];
  if (!moduleCommands) {
    return {
      raw: trimmed,
      verb,
      module: moduleRaw,
      args,
      flags,
      valid: false,
      error: `Unknown module '/${moduleRaw}'. Try /help`,
    };
  }

  if (verb && !(verb in moduleCommands)) {
    return {
      raw: trimmed,
      verb,
      module: moduleRaw,
      args,
      flags,
      valid: false,
      error: `Unknown verb '${verb}' for /${moduleRaw}. Try /help ${moduleRaw}`,
    };
  }

  return {
    raw: trimmed,
    verb,
    module: moduleRaw,
    args,
    flags,
    valid: true,
  };
}

export function isCommand(input: string): boolean {
  return input.trim().startsWith('/');
}

export function getCommandHelp(module?: string): string {
  if (!module || !(module in COMMAND_MAP)) {
    const modules = Object.keys(COMMAND_MAP);
    return `Available modules: ${modules.map((m) => `/${m}`).join(', ')}\n\nType /help <module> for details.`;
  }

  const cmds = COMMAND_MAP[module];
  const lines = Object.entries(cmds)
    .filter(([v]) => v !== '')
    .map(([v, desc]) => `  /${module} ${v.padEnd(12)} — ${desc}`);
  return `/${module} commands:\n${lines.join('\n')}`;
}

export function suggestCommand(partial: string): string[] {
  if (!partial.startsWith('/')) return [];
  const parts = partial.slice(1).split(/\s+/);
  const moduleRaw = parts[0]?.toLowerCase() ?? '';

  if (parts.length === 1) {
    return Object.keys(COMMAND_MAP)
      .filter((m) => m.startsWith(moduleRaw))
      .map((m) => `/${m}`);
  }

  const verbs = COMMAND_MAP[moduleRaw];
  if (!verbs) return [];
  const verbPartial = parts[1]?.toLowerCase() ?? '';
  return Object.keys(verbs)
    .filter((v) => v.startsWith(verbPartial))
    .map((v) => `/${moduleRaw} ${v}`);
}
