import { NextRequest, NextResponse } from 'next/server';
import { ensureStudioHydrated, studioBuildAndRun, studioFromPrompt } from '@/lib/studioApi';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Legacy route — delegates to studioApi */
export async function POST(req: NextRequest) {
  ensureStudioHydrated();
  const body = await req.json() as {
    action: string;
    projectId: string;
    prompt?: string;
    shell?: import('@/lib/localTerminal').ShellKind;
    sessionId?: string;
  };

  if (body.action === 'build-and-run') {
    const result = await studioBuildAndRun(body.projectId, { shell: body.shell, sessionId: body.sessionId });
    return NextResponse.json({ success: result.ok, data: result, error: (result as { error?: string }).error });
  }
  if (body.action === 'from-prompt' && body.prompt) {
    const result = await studioFromPrompt(body.projectId, body.prompt, { shell: body.shell, sessionId: body.sessionId });
    return NextResponse.json({ success: result.ok, data: result });
  }
  return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
}
