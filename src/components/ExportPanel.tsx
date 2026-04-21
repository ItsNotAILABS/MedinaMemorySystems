'use client';

import { useState, useCallback } from 'react';
import clsx from 'clsx';

type ExportFormat = 'pdf' | 'excel' | 'json';
type DataType = 'memory' | 'governance' | 'company';

interface ExportState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

export default function ExportPanel() {
  const [state, setState] = useState<ExportState>({
    loading: false,
    error: null,
    success: null,
  });

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [selectedData, setSelectedData] = useState<DataType>('memory');

  const handleExport = useCallback(async () => {
    setState({ loading: true, error: null, success: null });

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataType: selectedData,
          format: selectedFormat,
        }),
      });

      const data = await res.json() as { success: boolean; filename?: string; error?: string };

      if (data.success) {
        setState({
          loading: false,
          error: null,
          success: `Export successful: ${data.filename}`,
        });
      } else {
        setState({
          loading: false,
          error: data.error || 'Export failed',
          success: null,
        });
      }
    } catch (err) {
      setState({
        loading: false,
        error: String(err),
        success: null,
      });
    }
  }, [selectedFormat, selectedData]);

  const formatOptions: { value: ExportFormat; label: string; icon: string; description: string }[] = [
    { value: 'pdf', label: 'PDF', icon: '📄', description: 'Portable Document Format' },
    { value: 'excel', label: 'Excel/CSV', icon: '📊', description: 'Spreadsheet format' },
    { value: 'json', label: 'JSON', icon: '{ }', description: 'JavaScript Object Notation' },
  ];

  const dataOptions: { value: DataType; label: string; icon: string; description: string }[] = [
    { value: 'memory', label: 'Memory', icon: '🧠', description: 'Export all memory entries' },
    { value: 'governance', label: 'Governance', icon: '⚖️', description: 'Export proposals and audit log' },
    { value: 'company', label: 'Company', icon: '🏢', description: 'Export company report' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d15]">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-lg">📤</span>
          <h1 className="text-sm font-semibold text-slate-200">Export</h1>
          <span className="text-xs text-slate-500">Download & Share Data</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Status Messages */}
          {state.error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <span className="text-red-400 text-sm">❌ {state.error}</span>
            </div>
          )}
          {state.success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <span className="text-green-400 text-sm">✓ {state.success}</span>
            </div>
          )}

          {/* Select Data Type */}
          <div>
            <h2 className="text-sm text-slate-300 font-medium mb-3">Select Data to Export</h2>
            <div className="space-y-2">
              {dataOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedData(option.value)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left',
                    selectedData === option.value
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-[#1e1e2e] bg-[#12121a] hover:bg-[#1a1a2a]'
                  )}
                >
                  <span className="text-xl">{option.icon}</span>
                  <div className="flex-1">
                    <div className={clsx(
                      'text-sm font-medium',
                      selectedData === option.value ? 'text-green-400' : 'text-slate-200'
                    )}>
                      {option.label}
                    </div>
                    <div className="text-xs text-slate-500">{option.description}</div>
                  </div>
                  {selectedData === option.value && (
                    <span className="text-green-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Select Format */}
          <div>
            <h2 className="text-sm text-slate-300 font-medium mb-3">Select Format</h2>
            <div className="grid grid-cols-3 gap-2">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFormat(option.value)}
                  className={clsx(
                    'flex flex-col items-center gap-2 px-4 py-4 rounded-lg border transition-all',
                    selectedFormat === option.value
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-[#1e1e2e] bg-[#12121a] hover:bg-[#1a1a2a]'
                  )}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className={clsx(
                    'text-sm font-medium',
                    selectedFormat === option.value ? 'text-green-400' : 'text-slate-200'
                  )}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <div>
            <button
              onClick={() => void handleExport()}
              disabled={state.loading}
              className={clsx(
                'w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2',
                state.loading
                  ? 'bg-[#1e1e2e] text-slate-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-500 text-white'
              )}
            >
              {state.loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Exporting...
                </>
              ) : (
                <>
                  <span>📥</span>
                  Export {selectedData.charAt(0).toUpperCase() + selectedData.slice(1)} as {selectedFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>

          {/* Quick Export Section */}
          <div className="pt-6 border-t border-[#1e1e2e]">
            <h2 className="text-sm text-slate-300 font-medium mb-3">Quick Exports</h2>
            <div className="grid grid-cols-2 gap-2">
              <QuickExportButton
                label="Memory PDF"
                dataType="memory"
                format="pdf"
                icon="🧠"
              />
              <QuickExportButton
                label="Memory CSV"
                dataType="memory"
                format="excel"
                icon="🧠"
              />
              <QuickExportButton
                label="Governance PDF"
                dataType="governance"
                format="pdf"
                icon="⚖️"
              />
              <QuickExportButton
                label="Company Report"
                dataType="company"
                format="pdf"
                icon="🏢"
              />
            </div>
          </div>

          {/* Export Info */}
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4">
            <h3 className="text-xs text-slate-500 mb-2">Export Information</h3>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• PDF exports include formatted content with headers</li>
              <li>• Excel/CSV exports are compatible with spreadsheet software</li>
              <li>• JSON exports contain raw data for programmatic use</li>
              <li>• All exports include timestamps and metadata</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickExportButton({
  label,
  dataType,
  format,
  icon,
}: {
  label: string;
  dataType: DataType;
  format: ExportFormat;
  icon: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataType, format }),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={() => void handleClick()}
      disabled={loading}
      className={clsx(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors',
        loading
          ? 'bg-[#1e1e2e] text-slate-500'
          : 'bg-[#1e1e2e] text-slate-300 hover:bg-[#2a2a3a] hover:text-slate-100'
      )}
    >
      <span>{icon}</span>
      {loading ? 'Exporting...' : label}
    </button>
  );
}
