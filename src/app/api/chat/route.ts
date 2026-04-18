import { NextRequest, NextResponse } from 'next/server';
import { parseCommand, isCommand, getCommandHelp } from '@/lib/commandParser';
import { routeToModel, invokeModel } from '@/lib/modelRouter';
import { queryMemory, storeMemory, pinMemory, unpinMemory, getMemoryStats, listMemories, getMemoryLineage, getRootMemory } from '@/lib/memoryEngine';
import { listProposals, createProposal, getGovernanceStats, getGates, getAuditLog } from '@/lib/governanceEngine';
import { getModels, getModelStats } from '@/lib/modelRouter';
import { getDefaultCompany, getOnboardingStats } from '@/lib/companyOnboarding';
import { getOrganismState, getRegisterSummary } from '@/lib/organismSovereign';
import { dualRead } from '@/lib/dualRead';
import { checkAllGates } from '@/lib/gateEnforcement';
import { ulriRoute, ulriConsensus } from '@/lib/ulriEngine';
import type { StructuredResponse, ModelFamily, ParsedCommand } from '@/types';
import { sovereignId } from '@/lib/sovereign-id';

export async function POST(req: NextRequest) {
  try {
    const { message, useConsensus } = await req.json() as { message: string; useConsensus?: boolean };
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const startTime = Date.now();

    if (isCommand(message)) {
      const parsed = parseCommand(message);
      const response = await handleCommand(parsed);
      return NextResponse.json({
        id: sovereignId(),
        role: 'assistant',
        content: response.title,
        commandParsed: parsed,
        structuredResponse: response,
        modelUsed: getModelForCommand(parsed.module),
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime,
      });
    }

    const ulriResult = useConsensus ? ulriConsensus(message, 3) : ulriRoute(message);

    return NextResponse.json({
      id: sovereignId(),
      role: 'assistant',
      content: ulriResult.consensus?.synthesized ?? ulriResult.invocation.response,
      modelUsed: ulriResult.primary,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime,
      ulriScores: ulriResult.scores.slice(0, 5),
      consensus: ulriResult.consensus ? {
        models: ulriResult.consensus.models,
        agreementScore: ulriResult.consensus.agreementScore,
      } : undefined,
      routingLatency: ulriResult.routingLatency,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

function getModelForCommand(module: string): ModelFamily {
  const map: Record<string, ModelFamily> = {
    memory: 'memory-curator',
    govern: 'governance',
    model: 'strategist',
    company: 'operations',
    replay: 'analyst',
    permissions: 'governance',
    organism: 'strategist',
    help: 'strategist',
  };
  return map[module] ?? 'strategist';
}

async function handleCommand(parsed: ParsedCommand): Promise<StructuredResponse> {
  if (!parsed.valid) {
    return {
      type: 'error',
      title: parsed.error ?? 'Invalid command',
      data: { suggestion: '/help' },
    };
  }

  const { module, verb, args, flags } = parsed;

  switch (module) {
    case 'memory': {
      switch (verb) {
        case 'find':
        case 'list': {
          const q = args.join(' ') || (flags['query'] as string) || '';
          if (verb === 'list' && !q) {
            const entries = listMemories(10);
            return { type: 'memory', title: `Memory: ${entries.length} recent entries`, data: { entries } };
          }
          const result = queryMemory({ query: q, limit: 10 });
          return { type: 'memory', title: `Memory search: "${q}" — ${result.totalCount} results`, data: result };
        }
        case 'store': {
          const content = args.join(' ');
          if (!content) return { type: 'error', title: 'Content required', data: {} };
          const entry = storeMemory(content, 'semantic', []);
          return { type: 'memory', title: `Memory stored: ${entry.id.slice(0, 8)}…`, data: { entry } };
        }
        case 'pin': {
          const id = args[0];
          if (!id) return { type: 'error', title: 'Memory ID required', data: {} };
          const entry = pinMemory(id);
          return { type: 'memory', title: entry ? `Pinned: ${id.slice(0, 8)}…` : 'Not found', data: { entry } };
        }
        case 'unpin': {
          const id = args[0];
          if (!id) return { type: 'error', title: 'Memory ID required', data: {} };
          const entry = unpinMemory(id);
          return { type: 'memory', title: entry ? `Unpinned: ${id.slice(0, 8)}…` : 'Not found', data: { entry } };
        }
        case 'dual': {
          const q = args.join(' ');
          const result = dualRead(q, 8);
          return { type: 'memory', title: `Dual read: semantic ${(result.semanticScore * 100).toFixed(0)}% | resonance ${(result.resonanceScore * 100).toFixed(0)}%`, data: result };
        }
        case 'lineage': {
          const id = args[0];
          if (!id) return { type: 'error', title: 'Lineage ID required', data: {} };
          const entries = getMemoryLineage(id);
          return { type: 'memory', title: `Lineage: ${entries.length} entries`, data: { entries } };
        }
        case 'root': {
          const root = getRootMemory();
          return { type: 'memory', title: root ? `Root memory: ${root.id.slice(0, 8)}…` : 'No root found', data: { entry: root } };
        }
        default:
          return { type: 'info', title: getCommandHelp('memory'), data: {} };
      }
    }

    case 'govern': {
      switch (verb) {
        case 'list': {
          const proposals = listProposals();
          return { type: 'governance', title: `Governance: ${proposals.length} proposals`, data: { proposals } };
        }
        case 'propose': {
          const title = args.join(' ');
          if (!title) return { type: 'error', title: 'Proposal title required', data: {} };
          const proposal = createProposal(title, `Proposal: ${title}`, 'User');
          return { type: 'governance', title: `Proposal created: ${proposal.id.slice(0, 8)}…`, data: { proposal } };
        }
        case 'status': {
          const stats = getGovernanceStats();
          return { type: 'governance', title: 'Governance Status', data: stats };
        }
        case 'gates': {
          const gates = getGates();
          return { type: 'governance', title: 'Gate Status', data: { gates } };
        }
        case 'audit': {
          const log = getAuditLog(20);
          return { type: 'governance', title: `Audit log: ${log.length} entries`, data: { log } };
        }
        default:
          return { type: 'info', title: getCommandHelp('govern'), data: {} };
      }
    }

    case 'model': {
      switch (verb) {
        case 'list':
        case 'status': {
          const models = getModels();
          const stats = getModelStats();
          return { type: 'model', title: `Models: ${models.length} families`, data: { models, stats } };
        }
        case 'invoke': {
          const modelId = args[0] as ModelFamily;
          const prompt = args.slice(1).join(' ');
          if (!modelId || !prompt) return { type: 'error', title: 'Model ID and prompt required', data: {} };
          const result = invokeModel(modelId, prompt);
          return { type: 'model', title: `${modelId}: ${result.response.slice(0, 60)}…`, data: { invocation: result } };
        }
        case 'route': {
          const prompt = args.join(' ');
          const model = routeToModel(prompt);
          return { type: 'model', title: `Routed to: ${model}`, data: { model, prompt } };
        }
        default:
          return { type: 'info', title: getCommandHelp('model'), data: {} };
      }
    }

    case 'organism': {
      const state = getOrganismState();
      const summary = getRegisterSummary();
      return { type: 'organism', title: `Organism: ${summary}`, data: { state } };
    }

    case 'company': {
      const company = getDefaultCompany();
      if (!company) return { type: 'error', title: 'No company found', data: {} };
      const stats = getOnboardingStats(company.id);
      return { type: 'company', title: `Company: ${company.name}`, data: { company, stats } };
    }

    case 'help': {
      const targetModule = args[0];
      return { type: 'help', title: getCommandHelp(targetModule), data: { modules: ['memory', 'govern', 'model', 'company', 'replay', 'permissions', 'organism'] } };
    }

    default:
      return { type: 'error', title: `Unknown module: ${module}`, data: {} };
  }
}
