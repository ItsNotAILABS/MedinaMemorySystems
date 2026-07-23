/**
 * Full build pipeline: export → Python/Node write → npm install → dev server → preview URL
 */

import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
import {
  appendLog,
  getRepoRoot,
  runCommand,
  runCommandStream,
  startDevServer,
  waitForPort,
  writeFilesToDisk,
  type ShellKind,
} from '@/lib/localTerminal';
import { resolveProjectFiles } from '@/lib/projectFiles';
import { projectSlug } from '@/lib/fullProjectScaffold';
import type { AppProject } from '@/types/appBuilder';

export interface OrchestrateResult {
  ok: boolean;
  projectDir: string;
  previewUrl?: string;
  port?: number;
  devServerId?: string;
  fileCount: number;
  error?: string;
  usedPython: boolean;
}

function orchestratorPath(): string {
  return path.join(getRepoRoot(), 'integrations/builder-orchestrator/orchestrator.py');
}

function pythonAvailable(): boolean {
  try {
    const { execSync } = require('child_process');
    execSync(process.platform === 'win32' ? 'python --version' : 'python3 --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function runPythonOrchestrator(
  projectDir: string,
  files: { path: string; content: string }[],
  shell: ShellKind,
  sessionId: string,
): Promise<{ ok: boolean; port?: number }> {
  const script = orchestratorPath();
  if (!fs.existsSync(script)) return { ok: false };

  const payload = JSON.stringify({
    action: 'build',
    projectDir,
    files,
    shell: shell === 'powershell' ? 'powershell' : shell === 'wsl' ? 'wsl' : 'bash',
  });

  return new Promise((resolve) => {
    const py = process.platform === 'win32' ? 'python' : 'python3';
    const proc = spawn(py, [script], { cwd: getRepoRoot(), windowsHide: true });
    let port = 3020;

    proc.stdout?.on('data', (d: Buffer) => {
      d.toString().split('\n').filter(Boolean).forEach((line) => {
        try {
          const msg = JSON.parse(line);
          if (msg.type === 'stdout') {
            appendLog(sessionId, {
              ts: new Date().toISOString(),
              shell,
              stream: 'stdout',
              text: msg.line,
            });
          }
          if (msg.type === 'cmd') {
            appendLog(sessionId, {
              ts: new Date().toISOString(),
              shell,
              stream: 'system',
              text: `[python] ${msg.command}`,
            });
          }
          if (msg.type === 'done') port = msg.port ?? 3020;
        } catch { /* ignore */ }
      });
    });

    proc.stdin?.write(payload);
    proc.stdin?.end();

    proc.on('close', (code) => resolve({ ok: code === 0, port }));
  });
}

/** Build app on disk, install deps, start dev server, return live preview URL */
export async function orchestrateBuild(
  project: AppProject,
  opts: { shell?: ShellKind; sessionId?: string; port?: number } = {},
): Promise<OrchestrateResult> {
  const sessionId = opts.sessionId ?? 'orchestrate';
  const shell = opts.shell ?? (process.platform === 'win32' ? 'powershell' : 'bash');
  const slug = projectSlug(project.name);
  const projectDir = path.join(getRepoRoot(), 'generated', slug);
  const files = resolveProjectFiles(project).map((f) => ({ path: f.path, content: f.content }));

  try {
    let usedPython = false;

    if (pythonAvailable() && fs.existsSync(orchestratorPath())) {
      const pyResult = await runPythonOrchestrator(projectDir, files, shell, sessionId);
      if (pyResult.ok) {
        usedPython = true;
      } else {
        appendLog(sessionId, {
          ts: new Date().toISOString(),
          shell,
          stream: 'system',
          text: '[orchestrator] Python path failed — falling back to Node',
        });
      }
    }

    if (!usedPython) {
      writeFilesToDisk(projectDir, files);
      await runCommandStream('npm install', { shell, cwd: projectDir, sessionId });
    }

    const port = opts.port ?? (await import('@/lib/localTerminal').then((m) => m.findFreePort()));
    const dev = await startDevServer(projectDir, { port, sessionId });

    await runCommandStream(
      process.platform === 'win32'
        ? `Start-Sleep -Seconds 3`
        : `sleep 3`,
      { shell, sessionId },
    );

    const ready = await waitForPort(dev.port, 180000);

    return {
      ok: ready,
      projectDir,
      previewUrl: ready ? dev.previewUrl : undefined,
      port: dev.port,
      devServerId: dev.id,
      fileCount: files.length,
      usedPython,
      error: ready ? undefined : 'Dev server did not become ready in time — check Terminal output',
    };
  } catch (err) {
    return {
      ok: false,
      projectDir,
      fileCount: 0,
      usedPython: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/** AI agent: parse intent and run build */
export async function orchestrateFromPrompt(
  project: AppProject,
  prompt: string,
  opts: { shell?: ShellKind; sessionId?: string } = {},
): Promise<OrchestrateResult & { message: string }> {
  const lower = prompt.toLowerCase();
  const wantsRun = /run|start|dev|launch|preview|open|deploy|build/.test(lower);

  if (!wantsRun) {
    return {
      ...(await orchestrateBuild(project, opts)),
      message: 'Project built on disk. Say "run the app" to start preview.',
    };
  }

  const result = await orchestrateBuild(project, opts);
  return {
    ...result,
    message: result.ok
      ? `App running at ${result.previewUrl} — open Preview panel`
      : `Build failed: ${result.error}`,
  };
}
