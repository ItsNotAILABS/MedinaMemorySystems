import { NextRequest, NextResponse } from 'next/server';
import {
  listProjects,
  getProject,
  createProject,
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
  getCompanyVault,
  listTemplates,
  getTemplate,
  templateCategories,
  listDeployTargets,
  APP_BUILDER_MANIFEST,
} from '@/lib/appBuilderEngine';
import type { ApiResponse } from '@/types';
import type { DeployTarget, TokenSpec } from '@/types/appBuilder';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'manifest';
  const id = searchParams.get('id') ?? undefined;
  const category = searchParams.get('category') ?? undefined;

  try {
    switch (action) {
      case 'manifest':
        return json({ success: true, data: APP_BUILDER_MANIFEST, timestamp: now() });
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
      default:
        return json({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

export async function POST(req: NextRequest) {
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
    };

    switch (body.action) {
      case 'create':
        return json({ success: true, data: createProject(body), timestamp: now() }, 201);
      case 'design':
        if (!body.id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        return json({ success: true, data: updateProjectDesign(body.id, body.design ?? {}), timestamp: now() });
      case 'ai-assist':
        if (!body.id || !body.prompt) return json({ success: false, error: 'id and prompt required', timestamp: now() }, 400);
        return json({ success: true, data: aiAssist(body.id, body.prompt), timestamp: now() });
      case 'scaffold':
        if (!body.id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        return json({ success: true, data: scaffold(body.id), timestamp: now() });
      case 'build-capsules':
        if (!body.id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        return json({ success: true, data: buildCapsules(body.id), timestamp: now() });
      case 'create-token':
        if (!body.id || !body.token) return json({ success: false, error: 'id and token required', timestamp: now() }, 400);
        return json({ success: true, data: createProjectToken(body.id, body.token), timestamp: now() });
      case 'deploy-plan':
        if (!body.id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        return json({ success: true, data: getDeployPlan(body.id, body.target), timestamp: now() });
      case 'attach-scripts':
        if (!body.id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        return json({ success: true, data: attachDeployScripts(body.id, body.target), timestamp: now() });
      case 'deploy':
        if (!body.id) return json({ success: false, error: 'id required', timestamp: now() }, 400);
        return json({ success: true, data: deploy(body.id, body.target), timestamp: now() });
      default:
        return json({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

function json<T>(data: ApiResponse<T>, status = 200) {
  return NextResponse.json(data, { status });
}
function now() { return new Date().toISOString(); }
