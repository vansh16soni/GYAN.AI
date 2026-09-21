import { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { GitGraph, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

let idCounter = 0;

export default function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    let cancelled = false;
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      themeVariables: isDark
        ? {
            darkMode: true,
            background: '#090a10',
            primaryColor: '#6366f1',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#818cf8',
            lineColor: '#38bdf8',
            secondaryColor: '#4f46e5',
            tertiaryColor: '#131622',
            fontFamily: 'JetBrains Mono, monospace',
          }
        : {
            darkMode: false,
            background: '#ffffff',
            primaryColor: '#e0e7ff',
            primaryTextColor: '#1e1b4b',
            primaryBorderColor: '#6366f1',
            lineColor: '#4f46e5',
            secondaryColor: '#f1f5f9',
            tertiaryColor: '#ffffff',
            fontFamily: 'JetBrains Mono, monospace',
          },
    });
    const id = `mermaid-dag-${idCounter++}`;

    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [chart, isDark]);

  if (error) {
    return (
      <div
        className={`my-6 rounded-2xl border p-4 text-xs ${
          isDark ? 'border-slate-800 bg-[#06070a]' : 'border-slate-200 bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-2 text-slate-500 mb-2 font-mono">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span>Raw Diagram Spec</span>
        </div>
        <pre className={`overflow-x-auto font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div
      className={`my-8 overflow-hidden rounded-3xl shadow-3d transition-colors duration-300 ${
        isDark ? 'glass-panel-elevated' : 'bg-white border border-slate-200 shadow-xl'
      }`}
    >
      {/* Diagram Header */}
      <div
        className={`flex items-center justify-between border-b px-4 py-2.5 text-xs ${
          isDark
            ? 'border-slate-800/80 bg-space-card/90'
            : 'border-slate-200 bg-slate-50/90'
        }`}
      >
        <div className="flex items-center gap-2">
          <GitGraph className="h-4 w-4 text-indigo-500" />
          <span className="font-mono text-[11px] font-bold text-indigo-500 uppercase tracking-wider">
            Interactive Flowchart & Architectural DAG
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Rendered via Mermaid</span>
        </div>
      </div>

      <div
        className={`flex justify-center overflow-x-auto p-8 text-center [&>svg]:max-w-full [&>svg]:h-auto ${
          isDark ? 'bg-[#07080f]/80' : 'bg-white'
        }`}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
