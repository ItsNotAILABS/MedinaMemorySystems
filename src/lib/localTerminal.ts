/**
 * Server-only: real shell execution (PowerShell, WSL, bash).
 * Used by medina-builder API — runs on the user's machine.
 */

import { spawn, type ChildProcess } from 'child_process';
import fs from 'fs';
import net from 'net';
import os from 'os';
import path from 'path';

export type ShellKind = 'powershell' | 'wsl' | 'bash';

export interface TerminalLine {
  ts: string;
  shell: ShellKind;
  stream: 'stdout' | 'stderr' | 'system';
  text: string;
}

export interface RunResult {
  ok: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
  lines: TerminalLine[];
}

export interface DevServerHandle {
  id: string;
  port: number;
  cwd: string;
  previewUrl: string;
  pid: number;
}

const sessionLogs = new Map<string, TerminalLine[]>();
const devServers = new Map<string, DevServerHandle>();
const devProcs = new Map<string, ChildProcess>();

function ts() {
  return new Date().toISOString();
}

function isWindows() {
  return process.platform === 'win32';
}

export function getRepoRoot(): string {
  // medina-builder runs from apps/medina-builder — repo root is two levels up
  const cwd = process.cwd();
  if (cwd.includes(`${path.sep}apps${path.sep}medina-builder`)) {
    return path.resolve(cwd, '../..');
  }
  return cwd;
}

export function resolveShell(shell: ShellKind): { cmd: string; args: (cmd: string) => string[] } {
  if (shell === 'powershell' && isWindows()) {
    return {
      cmd: 'powershell.exe',
      args: (c) => ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', c],
    };
  }
  if (shell === 'wsl') {
    return {
      cmd: 'wsl.exe',
      args: (c) => ['bash', '-lc', c],
    };
  }
  return {
    cmd: 'bash',
    args: (c) => ['-lc', c],
  };
}

export function appendLog(sessionId: string, line: TerminalLine) {
  const buf = sessionLogs.get(sessionId) ?? [];
  buf.push(line);
  if (buf.length > 5000) buf.splice(0, buf.length - 5000);
  sessionLogs.set(sessionId, buf);
}

export function getSessionLog(sessionId: string): TerminalLine[] {
  return sessionLogs.get(sessionId) ?? [];
}

export function clearSessionLog(sessionId: string) {
  sessionLogs.set(sessionId, []);
}

/** Run a single command and collect output */
export function runCommand(
  command: string,
  opts: { shell?: ShellKind; cwd?: string; sessionId?: string } = {},
): Promise<RunResult> {
  const shell = opts.shell ?? (isWindows() ? 'powershell' : 'bash');
  const cwd = opts.cwd ?? getRepoRoot();
  const sessionId = opts.sessionId ?? 'default';
  const { cmd, args } = resolveShell(shell);

  return new Promise((resolve) => {
    const lines: TerminalLine[] = [];
    const push = (stream: TerminalLine['stream'], text: string) => {
      const line: TerminalLine = { ts: ts(), shell, stream, text };
      lines.push(line);
      appendLog(sessionId, line);
    };

    push('system', `$ ${command}`);
    push('system', `cwd: ${cwd} · shell: ${shell}`);

    const proc = spawn(cmd, args(command), {
      cwd,
      env: process.env,
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (d: Buffer) => {
      const t = d.toString();
      stdout += t;
      t.split(/\r?\n/).filter(Boolean).forEach((l) => push('stdout', l));
    });

    proc.stderr?.on('data', (d: Buffer) => {
      const t = d.toString();
      stderr += t;
      t.split(/\r?\n/).filter(Boolean).forEach((l) => push('stderr', l));
    });

    proc.on('error', (err) => {
      push('stderr', err.message);
      resolve({ ok: false, exitCode: 1, stdout, stderr: err.message, lines });
    });

    proc.on('close', (code) => {
      const exitCode = code ?? 1;
      push('system', `exit ${exitCode}`);
      resolve({ ok: exitCode === 0, exitCode, stdout, stderr, lines });
    });
  });
}

/** Stream command output via callback (for SSE) */
export function runCommandStream(
  command: string,
  opts: { shell?: ShellKind; cwd?: string; sessionId?: string; onLine?: (line: TerminalLine) => void },
): Promise<number> {
  const shell = opts.shell ?? (isWindows() ? 'powershell' : 'bash');
  const cwd = opts.cwd ?? getRepoRoot();
  const sessionId = opts.sessionId ?? 'default';
  const { cmd, args } = resolveShell(shell);

  const push = (stream: TerminalLine['stream'], text: string) => {
    const line: TerminalLine = { ts: ts(), shell, stream, text };
    appendLog(sessionId, line);
    opts.onLine?.(line);
  };

  push('system', `$ ${command}`);

  return new Promise((resolve) => {
    const proc = spawn(cmd, args(command), { cwd, env: process.env, windowsHide: true });
    proc.stdout?.on('data', (d: Buffer) => {
      d.toString().split(/\r?\n/).filter(Boolean).forEach((l) => push('stdout', l));
    });
    proc.stderr?.on('data', (d: Buffer) => {
      d.toString().split(/\r?\n/).filter(Boolean).forEach((l) => push('stderr', l));
    });
    proc.on('close', (code) => {
      push('system', `exit ${code ?? 1}`);
      resolve(code ?? 1);
    });
    proc.on('error', () => resolve(1));
  });
}

export async function findFreePort(start = 3020): Promise<number> {
  for (let port = start; port < start + 200; port++) {
    const free = await new Promise<boolean>((res) => {
      const srv = net.createServer();
      srv.once('error', () => res(false));
      srv.once('listening', () => { srv.close(); res(true); });
      srv.listen(port, '127.0.0.1');
    });
    if (free) return port;
  }
  return start;
}

/** Start npm run dev in background — returns preview URL */
export async function startDevServer(
  projectDir: string,
  opts: { port?: number; sessionId?: string } = {},
): Promise<DevServerHandle> {
  const port = opts.port ?? (await findFreePort());
  const sessionId = opts.sessionId ?? 'default';
  const id = `dev-${Date.now()}`;

  // Stop any existing server for same dir
  for (const [k, h] of devServers) {
    if (h.cwd === projectDir) {
      stopDevServer(k);
    }
  }

  const shell = isWindows() ? 'powershell' : 'bash';
  const command = isWindows()
    ? `$env:PORT=${port}; npm run dev -- -p ${port}`
    : `PORT=${port} npm run dev -- -p ${port}`;

  appendLog(sessionId, { ts: ts(), shell, stream: 'system', text: `Starting dev server on port ${port}…` });

  const { cmd, args } = resolveShell(shell);
  const proc = spawn(cmd, args(command), {
    cwd: projectDir,
    env: { ...process.env, PORT: String(port) },
    windowsHide: true,
    detached: false,
  });

  const push = (stream: TerminalLine['stream'], text: string) => {
    appendLog(sessionId, { ts: ts(), shell, stream, text });
  };

  proc.stdout?.on('data', (d: Buffer) => {
    d.toString().split(/\r?\n/).filter(Boolean).forEach((l) => push('stdout', l));
  });
  proc.stderr?.on('data', (d: Buffer) => {
    d.toString().split(/\r?\n/).filter(Boolean).forEach((l) => push('stderr', l));
  });

  devProcs.set(id, proc);
  const handle: DevServerHandle = {
    id,
    port,
    cwd: projectDir,
    previewUrl: `http://localhost:${port}`,
    pid: proc.pid ?? 0,
  };
  devServers.set(id, handle);

  proc.on('close', () => {
    devProcs.delete(id);
    devServers.delete(id);
  });

  return handle;
}

export function stopDevServer(id: string): boolean {
  const proc = devProcs.get(id);
  if (!proc) return false;
  proc.kill('SIGTERM');
  devProcs.delete(id);
  devServers.delete(id);
  return true;
}

export function listDevServers(): DevServerHandle[] {
  return Array.from(devServers.values());
}

export function getDevServer(id: string): DevServerHandle | undefined {
  return devServers.get(id);
}

/** Wait until localhost responds (dev server ready) */
export async function waitForPort(port: number, timeoutMs = 120000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const ok = await new Promise<boolean>((res) => {
      const req = net.connect(port, '127.0.0.1');
      req.once('connect', () => { req.destroy(); res(true); });
      req.once('error', () => res(false));
      setTimeout(() => { req.destroy(); res(false); }, 500);
    });
    if (ok) return true;
    await new Promise((r) => setTimeout(r, 1500));
  }
  return false;
}

export function writeFilesToDisk(baseDir: string, files: { path: string; content: string }[]): string[] {
  const written: string[] = [];
  fs.mkdirSync(baseDir, { recursive: true });
  for (const f of files) {
    const full = path.join(baseDir, f.path);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, f.content, 'utf8');
    written.push(f.path);
  }
  return written;
}
