import { NextRequest, NextResponse } from 'next/server';
import {
  clearSessionLog,
  getSessionLog,
  listDevServers,
  runCommand,
  runCommandStream,
  stopDevServer,
  getDevServer,
} from '@/lib/localTerminal';
import type { ShellKind } from '@/lib/localTerminal';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'log';
  const sessionId = searchParams.get('sessionId') ?? 'default';

  switch (action) {
    case 'log':
      return NextResponse.json({ success: true, data: getSessionLog(sessionId) });
    case 'servers':
      return NextResponse.json({ success: true, data: listDevServers() });
    case 'stream': {
      const shell = (searchParams.get('shell') ?? 'powershell') as ShellKind;
      const command = searchParams.get('command');
      if (!command) {
        return NextResponse.json({ success: false, error: 'command required' }, { status: 400 });
      }
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const send = (obj: unknown) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
          };
          send({ type: 'start', command, shell });
          await runCommandStream(decodeURIComponent(command), {
            shell,
            sessionId,
            onLine: (line) => send({ type: 'line', ...line }),
          });
          send({ type: 'end' });
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }
    default:
      return NextResponse.json({ success: false, error: 'unknown action' }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    action: string;
    command?: string;
    shell?: ShellKind;
    cwd?: string;
    sessionId?: string;
    serverId?: string;
  };

  const sessionId = body.sessionId ?? 'default';
  const shell = body.shell ?? (process.platform === 'win32' ? 'powershell' : 'bash');

  switch (body.action) {
    case 'exec':
      if (!body.command) return NextResponse.json({ success: false, error: 'command required' }, { status: 400 });
      {
        const result = await runCommand(body.command, { shell, cwd: body.cwd, sessionId });
        return NextResponse.json({ success: result.ok, data: result });
      }
    case 'clear':
      clearSessionLog(sessionId);
      return NextResponse.json({ success: true });
    case 'stop-server':
      if (!body.serverId) return NextResponse.json({ success: false, error: 'serverId required' }, { status: 400 });
      return NextResponse.json({ success: stopDevServer(body.serverId) });
    default:
      return NextResponse.json({ success: false, error: 'unknown action' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('serverId');
  if (!id) return NextResponse.json({ success: false }, { status: 400 });
  return NextResponse.json({ success: stopDevServer(id) });
}
