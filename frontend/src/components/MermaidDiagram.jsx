import { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { GitGraph, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

let idCounter = 0;

export default function MermaidDiagram({ chart }) {
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
            background: '#040d0a',
            primaryColor: '#059669',
            primaryTextColor: '#e1f5ec',
            primaryBorderColor: '#34d399',
            lineColor: '#6ee7b7',
            secondaryColor: '#047857',
            tertiaryColor: '#0c261b',
            fontFamily: 'JetBrains Mono, monospace',
          }
        : {
            darkMode: false,
            background: '#ffffff',
            primaryColor: '#d1fae5',
            primaryTextColor: '#064e3b',
            primaryBorderColor: '#10b981',
            lineColor: '#059669',
            secondaryColor: '#f0fdf4',
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
          isDark ? 'border-emerald-900/80 bg-[#040d0a]' : 'border-emerald-200 bg-emerald-50/50'
        }`}
      >
        <div className="flex items-center gap-2 text-emerald-500 mb-2 font-mono">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span>Raw Diagram Spec</span>
        </div>
        <pre className={`overflow-x-auto font-mono ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div
      className={`my-8 overflow-hidden rounded-3xl shadow-3d transition-colors duration-300 ${
        isDark ? 'glass-panel-elevated' : 'bg-white border border-emerald-200 shadow-xl'
      }`}
    >
      {/* Diagram Header */}
      <div
        className={`flex items-center justify-between border-b px-4 py-2.5 text-xs ${
          isDark
            ? 'border-emerald-900/80 bg-space-card/90'
            : 'border-emerald-200 bg-emerald-50/80'
        }`}
      >
        <div className="flex items-center gap-2">
          <GitGraph className="h-4 w-4 text-emerald-400" />
          <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Interactive Flowchart & Living DAG
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Rendered via Mermaid</span>
        </div>
      </div>

      <div
        className={`flex justify-center overflow-x-auto p-8 text-center [&>svg]:max-w-full [&>svg]:h-auto ${
          isDark ? 'bg-[#030a07]/80' : 'bg-white'
        }`}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
