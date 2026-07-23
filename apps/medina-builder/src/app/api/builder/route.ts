import { NextRequest, NextResponse } from 'next/server';
import {
  listProjects,
  getProject,
  updateProjectDesign,
  aiAssist,
  scaffold,
  buildCapsules,
  createProjectToken,
  deploy,
  getDeployPlan,
  attachDeployScripts,
  listDeployHistory,
  exportProjectBundle,
  getProjectSourceFiles,
  listTemplates,
  getTemplate,
  templateCategories,
  listDeployTargets,
  getCompanyVault,
  APP_BUILDER_MANIFEST,
} from '@/lib/appBuilderEngine';
import {
  ensureStudioHydrated,
  persistStudio,
  studioCapabilities,
  studioCreate,
  studioUpdateFile,
  studioExportDisk,
  studioBuildAndRun,
  studioFromPrompt,
} from '@/lib/studioApi';
import type { ApiResponse } from '@/types';
import type { DeployTarget, TokenSpec } from '@/types/appBuilder';
import type { ShellKind } from '@/lib/localTerminal';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  ensureStudioHydrated();
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'manifest';
  const id = searchParams.get('id') ?? undefined;

  try {
    switch (action) {
      case 'manifest':
        return json({ success: true, data: { ...APP_BUILDER_MANIFEST, capabilities: studioCapabilities() }, timestamp: now() });
      case 'capabilities':
        return json({ success: true, data: studioCapabilities(), timestamp: now() });
      case 'projects':
        return json({ success: true, data: listProjects(), timestamp: now() });
      case 'project':
        if (!id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        return json({ success: true, data: getProject(id), timestamp: now() });
      case 'templates': {
        const cat = searchParams.get('category');
        return json({
          success: true,
          data: cat ? listTemplates({ category: cat as import('@/types/appBuilder').TemplateCategory }) : listTemplates(),
          timestamp: now(),
        });
      }
      case 'template':
        if (!id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        return json({ success: true, data: getTemplate(id), timestamp: now() });
      case 'template-categories':
        return json({ success: true, data: templateCategories(), timestamp: now() });
      case 'deploy-targets':
        return json({ success: true, data: listDeployTargets(), timestamp: now() });
      case 'deploy-plan':
        if (!id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        return json({
          success: true,
          data: getDeployPlan(id, searchParams.get('target') as DeployTarget | undefined),
          timestamp: now(),
        });
      case 'vault':
        return json({ success: true, data: getCompanyVault(), timestamp: now() });
      case 'deployments':
        return json({ success: true, data: listDeployHistory(id), timestamp: now() });
      case 'export':
        if (!id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        return json({ success: true, data: exportProjectBundle(id), timestamp: now() });
      case 'source-files':
        if (!id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        return json({ success: true, data: getProjectSourceFiles(id), timestamp: now() });
      default:
        return json({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

export async function POST(req: NextRequest) {
  ensureStudioHydrated();
  try {
    const body = await req.json() as {
      action: string;
      id?: string;
      name?: string;
      description?: string;
      templateId?: string;
      tier?: 'standard' | 'pro';
      backend?: 'motoko' | 'rust' | 'python';
      frontend?: 'react' | 'html';
      proStack?: 'node' | 'java';
      aiMode?: 'local' | 'cloud' | 'hybrid';
      deployTarget?: DeployTarget;
      prompt?: string;
      design?: Record<string, unknown>;
      token?: TokenSpec;
      target?: DeployTarget;
      path?: string;
      content?: string;
      sessionId?: string;
      shell?: ShellKind;
    };

    switch (body.action) {
      case 'create': {
        const project = studioCreate(body);
        return json({ success: true, data: project, timestamp: now() }, 201);
      }
      case 'create-and-run': {
        const project = studioCreate(body);
        const result = await studioBuildAndRun(project.id, { shell: body.shell, sessionId: body.sessionId });
        return json({ success: result.ok, data: { project, ...result }, timestamp: now() }, result.ok ? 201 : 500);
      }
      case 'build-and-run': {
        if (!body.id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        const result = await studioBuildAndRun(body.id, { shell: body.shell, sessionId: body.sessionId });
        return json({ success: result.ok, data: result, error: result.error, timestamp: now() }, result.ok ? 200 : 500);
      }
      case 'from-prompt': {
        if (!body.id || !body.prompt) return json({ success: false, error: 'id and prompt required', timestamp: now() }, 400);
        const result = await studioFromPrompt(body.id, body.prompt, { shell: body.shell, sessionId: body.sessionId });
        return json({ success: result.ok, data: result, timestamp: now() });
      }
      case 'design':
        if (!body.id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        { const p = updateProjectDesign(body.id, body.design ?? {}); persistStudio(); return json({ success: true, data: p, timestamp: now() }); }
      case 'ai-assist':
        if (!body.id || !body.prompt) return json({ success: false, error: 'id and prompt required', timestamp: now() }, 400);
        return json({ success: true, data: aiAssist(body.id, body.prompt), timestamp: now() });
      case 'scaffold':
        if (!body.id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        { const p = scaffold(body.id); persistStudio(); return json({ success: true, data: p, timestamp: now() }); }
      case 'build-capsules':
        if (!body.id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        { const p = buildCapsules(body.id); persistStudio(); return json({ success: true, data: p, timestamp: now() }); }
      case 'create-token':
        if (!body.id || !body.token) return json({ success: false, error: 'id and token required', timestamp: now() }, 400);
        { const p = createProjectToken(body.id, body.token); persistStudio(); return json({ success: true, data: p, timestamp: now() }); }
      case 'deploy-plan':
        if (!body.id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        return json({ success: true, data: getDeployPlan(body.id, body.target), timestamp: now() });
      case 'attach-scripts':
        if (!body.id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        { const p = attachDeployScripts(body.id, body.target); persistStudio(); return json({ success: true, data: p, timestamp: now() }); }
      case 'deploy':
        if (!body.id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        { const d = deploy(body.id, body.target); persistStudio(); return json({ success: true, data: d, timestamp: now() }); }
      case 'export-disk':
        if (!body.id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        {
          const result = studioExportDisk(body.id);
          if (!result) return json({ success: false, error: 'Project not found', timestamp: now() }, 404);
          if (!result.ok) return json({ success: false, error: result.error ?? 'Export failed', timestamp: now() }, 500);
          return json({ success: true, data: result, timestamp: now() });
        }
      case 'update-file':
        if (!body.id || !body.path || body.content === undefined) {
          return json({ success: false, error: 'id, path, and content required', timestamp: now() }, 400);
        }
        return json({ success: true, data: studioUpdateFile(body.id, body.path, body.content), timestamp: now() });
      default:
        return json({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

function json<T>(data: ApiResponse<T> & { error?: string }, status = 200) {
  return NextResponse.json(data, { status });
}
function now() { return new Date().toISOString(); }
