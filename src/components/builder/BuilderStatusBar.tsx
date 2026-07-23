'use client';

interface Props {
  branch?: string;
  project?: string;
  shell?: string;
  previewUrl?: string | null;
  orchestrating?: boolean;
}

export default function BuilderStatusBar({ branch = 'cursor/company-app-builder-51ae', project, shell, previewUrl, orchestrating }: Props) {
  return (
    <footer
      className="shrink-0 flex items-center justify-between h-[var(--mb-status-h)] px-3 text-[11px] border-t"
      style={{ background: 'var(--mb-accent)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.95)' }}
    >
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 opacity-90">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          {orchestrating ? 'Building…' : 'Ready'}
        </span>
        {project && <span className="opacity-80">{project}</span>}
        <span className="opacity-70 font-mono">{branch}</span>
      </div>
      <div className="flex items-center gap-4 opacity-90">
        {shell && <span>{shell}</span>}
        {previewUrl && (
          <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="hover:underline font-mono">
            {previewUrl.replace('http://', '')}
          </a>
        )}
        <span>UTF-8</span>
        <span>Medina v2.1</span>
      </div>
    </footer>
  );
}
