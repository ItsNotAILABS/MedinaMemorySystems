import { NextRequest, NextResponse } from 'next/server';
import { getProject } from '@/lib/appBuilderEngine';
import { orchestrateBuild, orchestrateFromPrompt } from '@/lib/buildOrchestrator';
import type { ShellKind } from '@/lib/localTerminal';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    action: string;
    projectId: string;
    prompt?: string;
    shell?: ShellKind;
    sessionId?: string;
    port?: number;
  };

  const project = getProject(body.projectId);
  if (!project) {
    return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
  }

  const opts = {
    shell: body.shell ?? (process.platform === 'win32' ? 'powershell' as const : 'bash' as const),
    sessionId: body.sessionId ?? 'orchestrate',
    port: body.port,
  };

  switch (body.action) {
    case 'build-and-run': {
      const result = await orchestrateBuild(project, opts);
      return NextResponse.json({ success: result.ok, data: result });
    }
    case 'from-prompt': {
      if (!body.prompt) {
        return NextResponse.json({ success: false, error: 'prompt required' }, { status: 400 });
      }
      const result = await orchestrateFromPrompt(project, body.prompt, opts);
      return NextResponse.json({ success: result.ok, data: result });
    }
    default:
      return NextResponse.json({ success: false, error: 'unknown action' }, { status: 400 });
  }
}
