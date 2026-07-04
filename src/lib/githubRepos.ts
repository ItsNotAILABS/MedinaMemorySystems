/**
 * GitHub org repos — public API, no auth required for public orgs.
 */

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  updated_at: string;
  stargazers_count: number;
  private: boolean;
  default_branch: string;
}

export const DEFAULT_GITHUB_ORG = 'ItsNotAILABS';

export async function fetchOrgRepos(org: string = DEFAULT_GITHUB_ORG): Promise<GitHubRepo[]> {
  const res = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=100&sort=updated`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Motoko: '#7a69c8',
  Python: '#3572A5',
  Rust: '#dea584',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
};
