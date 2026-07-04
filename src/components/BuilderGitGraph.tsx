'use client';

interface CommitNode {
  id: string;
  message: string;
  branch: string;
  color: string;
  lane: number;
}

const BRANCH_COLORS = ['#569cd6', '#4ec9b0', '#c586c0', '#dcdcaa', '#ce9178', '#6a9955'];

const DEMO_GRAPH: CommitNode[] = [
  { id: '1', message: 'Upgrade Next.js to 15.5.20', branch: 'cursor/company-app-builder-51ae', color: BRANCH_COLORS[0], lane: 0 },
  { id: '2', message: 'Add Code Studio with ZIP export', branch: 'cursor/company-app-builder-51ae', color: BRANCH_COLORS[0], lane: 0 },
  { id: '3', message: 'Build real runnable apps on disk', branch: 'cursor/company-app-builder-51ae', color: BRANCH_COLORS[0], lane: 0 },
  { id: '4', message: 'feat(builder): template library v2', branch: 'main', color: BRANCH_COLORS[1], lane: 1 },
  { id: '5', message: 'feat: integrate iphone-bridge MCP', branch: 'cursor/iphone-bridge-mcp', color: BRANCH_COLORS[2], lane: 2 },
  { id: '6', message: 'Merge PR #30 app builder', branch: 'main', color: BRANCH_COLORS[1], lane: 1 },
  { id: '7', message: 'Merge PR #29 iphone bridge', branch: 'main', color: BRANCH_COLORS[1], lane: 1 },
  { id: '8', message: 'Initial MedinaMemorySystems scaffold', branch: 'main', color: BRANCH_COLORS[1], lane: 1 },
];

export default function BuilderGitGraph() {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#858585] border-b border-[#2d2d2d] shrink-0">
        Git Graph
      </div>
      <div className="flex-1 overflow-y-auto p-2 font-mono text-[10px]">
        {DEMO_GRAPH.map((node, i) => (
          <div key={node.id} className="flex items-start gap-1 mb-0.5 group">
            <div className="w-8 shrink-0 flex flex-col items-center pt-1">
              <div
                className="w-2 h-2 rounded-full border border-[#1e1e1e]"
                style={{ background: node.color }}
              />
              {i < DEMO_GRAPH.length - 1 && (
                <div className="w-px flex-1 min-h-[14px] bg-[#404040] mt-0.5" />
              )}
            </div>
            <div className="flex-1 min-w-0 pb-2">
              <div className="text-[#cccccc] truncate group-hover:text-white" title={node.message}>
                {node.message}
              </div>
              <div className="text-[#6e7681] truncate" style={{ color: node.color }}>
                {node.branch}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
