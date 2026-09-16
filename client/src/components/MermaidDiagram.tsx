import { useEffect, useState } from 'react';
import mermaid from 'mermaid';

let idCounter = 0;

export default function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#12131e',
        primaryColor: '#7c87ff',
        primaryTextColor: '#0c0d14',
        primaryBorderColor: '#9da7ff',
        lineColor: '#2fd5f6',
        secondaryColor: '#5c68e6',
        tertiaryColor: '#1a1b2b',
        fontFamily: 'JetBrains Mono, monospace',
      },
    });
    const id = `m-${idCounter++}`;

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
  }, [chart]);

  if (error) {
    return (
      <pre className="my-5 overflow-x-auto rounded-2xl border border-[#272a42] bg-[#0c0d14] p-4 font-mono text-xs text-[#989fc2]">
        {chart}
      </pre>
    );
  }

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[#272a42] bg-[#12131e]/90 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-[#222538] bg-[#141522] px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#2fd5f6] animate-pulse" />
          <span className="font-mono text-[11px] font-semibold text-[#2fd5f6] uppercase">
            Mermaid Diagram
          </span>
        </div>
      </div>
      <div
        className="flex justify-center overflow-x-auto p-6 text-center [&>svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
