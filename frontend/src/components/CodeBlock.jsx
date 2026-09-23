import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function CodeBlock({ language, code, children }) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className={`my-6 overflow-hidden rounded-2xl border shadow-2xl transition-colors duration-300 ${
        isDark ? 'border-slate-800/80 bg-[#07080d]' : 'border-slate-200 bg-slate-900 shadow-lg'
      }`}
    >
      {/* Code Header Bar */}
      <div
        className={`flex items-center justify-between border-b px-4 py-2.5 text-xs ${
          isDark
            ? 'border-slate-800/70 bg-space-card/80'
            : 'border-slate-800 bg-slate-800/90 text-slate-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-semibold text-emerald-400 ml-1">
            <Terminal className="h-3.5 w-3.5 text-emerald-500" />
            <span>{language || 'code'}</span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-emerald-200 transition hover:bg-emerald-950/60 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-emerald-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-200 bg-[#06070a]">
        <code>{children}</code>
      </pre>
    </div>
  );
}
