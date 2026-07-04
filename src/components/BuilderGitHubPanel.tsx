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

  if (embedded && selectedRepo) {
    return <RepoDetail repo={selectedRepo} onBack={onBack} />;
  }

  if (embedded) {
    return (
      <div className="h-full flex flex-col" style={{ background: '#0d1117', color: '#c9d1d9' }}>
        <div className="flex items-center gap-3 px-5 py-3 border-b shrink-0" style={{ borderColor: '#21262d', background: '#161b22' }}>
          <GitHubMark />
          <div>
            <div className="text-[14px] font-semibold text-white">{org}</div>
            <div className="text-[11px]" style={{ color: '#8b949e' }}>Repositories</div>
          </div>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Find a repository…"
            className="ml-auto w-56 rounded-lg px-3 py-2 text-[12px] outline-none"
            style={{ background: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9' }}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {loading && <p className="text-[12px]" style={{ color: '#8b949e' }}>Loading repositories…</p>}
          {error && <p className="text-[12px] text-red-400">{error}</p>}
          <div className="grid gap-3 max-w-4xl">
            {filtered.map((repo) => (
              <RepoCard key={repo.id} repo={repo} onOpen={() => onOpenRepo?.(repo)} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function RepoCard({ repo, onOpen }: { repo: GitHubRepo; onOpen?: () => void }) {
  const langColor = LANG_COLORS[repo.language ?? ''] ?? '#8b949e';
  return (
    <button
      type="button"
      onClick={() => onOpen?.()}
      className="w-full text-left p-4 rounded-xl transition-all hover:border-[#58a6ff]/40"
      style={{ background: '#161b22', border: '1px solid #30363d' }}
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[14px]" style={{ color: '#58a6ff' }}>{repo.name}</span>
      </div>
      {repo.description && <p className="text-[12px] mt-1.5 line-clamp-2" style={{ color: '#8b949e' }}>{repo.description}</p>}
      <div className="flex items-center gap-4 mt-3 text-[11px]" style={{ color: '#8b949e' }}>
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: langColor }} />
            {repo.language}
          </span>
        )}
        <span>Updated {timeAgo(repo.updated_at)}</span>
      </div>
    </button>
  );
}

function RepoDetail({ repo, onBack }: { repo: GitHubRepo; onBack?: () => void }) {
  const langColor = LANG_COLORS[repo.language ?? ''] ?? '#8b949e';
  return (
    <div className="h-full flex flex-col" style={{ background: '#0d1117', color: '#c9d1d9' }}>
      <div className="px-5 py-4 border-b shrink-0" style={{ borderColor: '#21262d', background: '#161b22' }}>
        <button type="button" onClick={onBack} className="text-[12px] mb-3 hover:underline" style={{ color: '#58a6ff' }}>← Repositories</button>
        <div className="flex items-center gap-2">
          <GitHubMark />
          <span className="font-semibold text-[16px]" style={{ color: '#58a6ff' }}>{repo.full_name}</span>
        </div>
        {repo.description && <p className="text-[13px] mt-2" style={{ color: '#8b949e' }}>{repo.description}</p>}
        <div className="flex items-center gap-4 mt-3 text-[12px]" style={{ color: '#8b949e' }}>
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: langColor }} />
              {repo.language}
            </span>
          )}
          <span>Updated {timeAgo(repo.updated_at)}</span>
        </div>
        <div className="flex gap-2 mt-4">
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-[12px] font-medium rounded-lg text-white" style={{ background: '#238636' }}>
            Open on GitHub ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function GitHubMark() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
