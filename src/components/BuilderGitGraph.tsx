'use client';

const BRANCH_COLORS = ['#6366f1', '#22c55e', '#a78bfa', '#eab308', '#f472b6', '#38bdf8'];

const DEMO_GRAPH = [
  { message: 'Upgrade Next.js to 15.5.20', branch: 'cursor/company-app-builder-51ae', color: BRANCH_COLORS[0] },
  { message: 'Real terminal + Python orchestrator', branch: 'cursor/company-app-builder-51ae', color: BRANCH_COLORS[0] },
  { message: 'Add Code Studio with live preview', branch: 'cursor/company-app-builder-51ae', color: BRANCH_COLORS[0] },
  { message: 'feat(builder): template library v2', branch: 'main', color: BRANCH_COLORS[1] },
  { message: 'feat: integrate iphone-bridge MCP', branch: 'cursor/iphone-bridge-mcp', color: BRANCH_COLORS[2] },
  { message: 'Merge PR #30 app builder', branch: 'main', color: BRANCH_COLORS[1] },
];

export default function BuilderGitGraph() {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="mb-panel-header border-0">Git Graph</div>
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {DEMO_GRAPH.map((node, i) => (
          <div key={i} className="flex gap-2 mb-1 group">
            <div className="flex flex-col items-center w-4 pt-1.5 shrink-0">
              <div className="w-2 h-2 rounded-full ring-2 ring-offset-1" style={{ background: node.color, ringColor: 'var(--mb-bg-surface)', '--tw-ring-offset-color': 'var(--mb-bg-surface)' } as React.CSSProperties} />
              {i < DEMO_GRAPH.length - 1 && <div className="w-px flex-1 min-h-[18px] mt-0.5" style={{ background: 'var(--mb-border-strong)' }} />}
            </div>
            <div className="pb-2 min-w-0">
              <div className="text-[11px] truncate" style={{ color: 'var(--mb-text-secondary)' }}>{node.message}</div>
              <div className="text-[10px] font-mono truncate" style={{ color: node.color }}>{node.branch}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
