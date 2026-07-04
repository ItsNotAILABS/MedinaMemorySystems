'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_GITHUB_ORG,
  fetchOrgRepos,
  LANG_COLORS,
  timeAgo,
  type GitHubRepo,
} from '@/lib/githubRepos';

interface Props {
  org?: string;
  onOpenRepo?: (repo: GitHubRepo) => void;
  embedded?: boolean;
  selectedRepo?: GitHubRepo | null;
  onBack?: () => void;
}

export default function BuilderGitHubPanel({ org = DEFAULT_GITHUB_ORG, onOpenRepo, embedded, selectedRepo, onBack }: Props) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchOrgRepos(org)
      .then(setRepos)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [org]);

  const filtered = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(filter.toLowerCase()) ||
      (r.description ?? '').toLowerCase().includes(filter.toLowerCase()),
  );

  if (embedded) {
    if (selectedRepo) {
      return <RepoDetail repo={selectedRepo} onBack={onBack} />;
    }
    return (
      <div className="h-full flex flex-col bg-[#0d1117] text-[#c9d1d9]">
        <div className="flex items-center gap-3 px-4 py-2 border-b border-[#21262d] bg-[#161b22] shrink-0">
          <svg className="w-5 h-5 text-white" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span className="text-sm font-semibold text-white">{org}</span>
          <span className="text-xs text-[#8b949e]">Repositories</span>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Find a repository…"
            className="ml-auto w-48 bg-[#0d1117] border border-[#30363d] rounded-md px-2 py-1 text-xs outline-none focus:border-[#58a6ff]"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading && <p className="text-xs text-[#8b949e]">Loading repositories…</p>}
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="space-y-3">
            {filtered.map((repo) => (
              <RepoCard key={repo.id} repo={repo} onOpen={() => onOpenRepo?.(repo)} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 bg-[#0d1117]">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <GitHubIcon />
          <h2 className="text-lg font-semibold text-white">{org}</h2>
          <span className="text-sm text-[#8b949e]">/ Repositories</span>
        </div>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Find a repository…"
          className="w-full mb-4 bg-[#161b22] border border-[#30363d] rounded-md px-3 py-2 text-sm outline-none focus:border-[#58a6ff]"
        />
        {loading && <p className="text-sm text-[#8b949e]">Loading…</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="border border-[#30363d] rounded-md divide-y divide-[#21262d]">
          {filtered.map((repo) => (
            <RepoRow key={repo.id} repo={repo} onOpen={onOpenRepo} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RepoCard({ repo, onOpen }: { repo: GitHubRepo; onOpen?: () => void }) {
  const langColor = LANG_COLORS[repo.language ?? ''] ?? '#8b949e';
  return (
    <button
      type="button"
      onClick={() => onOpen?.()}
      className="w-full text-left p-4 rounded-lg border border-[#30363d] bg-[#161b22] hover:border-[#58a6ff]/50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="text-[#58a6ff] font-semibold text-sm">{repo.name}</span>
        {repo.private && (
          <span className="text-[10px] border border-[#30363d] rounded-full px-2 py-0.5 text-[#8b949e]">Private</span>
        )}
      </div>
      {repo.description && (
        <p className="text-xs text-[#8b949e] mt-1 line-clamp-2">{repo.description}</p>
      )}
      <div className="flex items-center gap-4 mt-2 text-[11px] text-[#8b949e]">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: langColor }} />
            {repo.language}
          </span>
        )}
        <span>Updated {timeAgo(repo.updated_at)}</span>
        {repo.stargazers_count > 0 && <span>★ {repo.stargazers_count}</span>}
      </div>
    </button>
  );
}

function RepoRow({ repo, onOpen }: { repo: GitHubRepo; onOpen?: (repo: GitHubRepo) => void }) {
  const langColor = LANG_COLORS[repo.language ?? ''] ?? '#8b949e';
  return (
    <button
      type="button"
      onClick={() => onOpen?.()}
      className="w-full text-left px-4 py-3 hover:bg-[#161b22] transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="text-[#58a6ff] font-semibold">{repo.name}</span>
          {repo.description && (
            <p className="text-sm text-[#8b949e] mt-0.5 truncate">{repo.description}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5 text-xs text-[#8b949e]">
            {repo.language && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: langColor }} />
                {repo.language}
              </span>
            )}
            <span>Updated {timeAgo(repo.updated_at)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-6 h-6 text-white" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function RepoDetail({ repo, onBack }: { repo: GitHubRepo; onBack?: () => void }) {
  const langColor = LANG_COLORS[repo.language ?? ''] ?? '#8b949e';
  return (
    <div className="h-full flex flex-col bg-[#0d1117] text-[#c9d1d9]">
      <div className="px-4 py-3 border-b border-[#21262d] bg-[#161b22] shrink-0">
        <button type="button" onClick={onBack} className="text-xs text-[#58a6ff] hover:underline mb-2">← Repositories</button>
        <div className="flex items-center gap-2">
          <GitHubIcon />
          <span className="text-[#58a6ff] font-semibold">{repo.full_name}</span>
          {repo.private && <span className="text-[10px] border border-[#30363d] rounded-full px-2 py-0.5">Private</span>}
        </div>
        {repo.description && <p className="text-sm text-[#8b949e] mt-2">{repo.description}</p>}
        <div className="flex items-center gap-4 mt-3 text-xs text-[#8b949e]">
          {repo.language && (
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ background: langColor }} />
              {repo.language}
            </span>
          )}
          <span>Updated {timeAgo(repo.updated_at)}</span>
          <span>Branch: {repo.default_branch}</span>
          {repo.stargazers_count > 0 && <span>★ {repo.stargazers_count}</span>}
        </div>
        <div className="flex gap-2 mt-4">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#238636] text-white hover:bg-[#2ea043]"
          >
            Open on GitHub ↗
          </a>
          <a
            href={`${repo.html_url}/tree/${repo.default_branch}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs rounded-md border border-[#30363d] hover:border-[#8b949e]"
          >
            Browse code
          </a>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="border border-[#30363d] rounded-md bg-[#161b22] p-4 max-w-2xl">
          <h3 className="text-sm font-semibold text-white mb-2">About this repository</h3>
          <p className="text-sm text-[#8b949e]">{repo.description ?? 'No description provided.'}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="border border-[#21262d] rounded p-3">
              <div className="text-[#8b949e]">Default branch</div>
              <div className="text-[#58a6ff] font-mono mt-1">{repo.default_branch}</div>
            </div>
            <div className="border border-[#21262d] rounded p-3">
              <div className="text-[#8b949e]">Language</div>
              <div className="mt-1">{repo.language ?? '—'}</div>
            </div>
          </div>
          <p className="text-[10px] text-[#6e7681] mt-4">
            Clone: <code className="text-[#79c0ff]">git clone {repo.html_url}.git</code>
          </p>
        </div>
      </div>
    </div>
  );
}
