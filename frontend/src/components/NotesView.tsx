import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import confetti from 'canvas-confetti';
import CodeBlock from './CodeBlock';
import MermaidDiagram from './MermaidDiagram';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { Copy, Check, Download, Trash2, Plus, Sparkles, Video } from 'lucide-react';

type Props = {
  title: string;
  content: string;
  inputType?: 'url' | 'topic';
  input?: string;
  onNew?: () => void;
  onDelete?: () => void;
};

function cleanMarkdown(raw: string): string {
  if (!raw) return '';
  let text = raw.trim();

  // 1. If wrapped in JSON, extract content
  if (text.startsWith('{') && text.endsWith('}')) {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed.content === 'string') {
        text = parsed.content;
      }
    } catch {
      const contentMatch = text.match(/"content"\s*:\s*"([\s\S]*?)"(?:\s*\}|\s*,\s*"\w+":)/);
      if (contentMatch) {
        text = contentMatch[1];
      }
    }
  }

  // 2. If it contains escaped sequences, unescape them
  if (text.includes('\\n') || text.includes('\\t') || text.includes('\\"')) {
    text = text
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'");
  }

  return text;
}

export default function NotesView({ title, content, inputType, input, onNew, onDelete }: Props) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const displayContent = cleanMarkdown(content);

  async function handleCopyAll() {
    await navigator.clipboard.writeText(`# ${title}\n\n${displayContent}`);
    setCopiedAll(true);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.2 },
      colors: ['#6366f1', '#38bdf8', '#a855f7'],
    });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  function handleDownload() {
    const element = document.createElement('a');
    const file = new Blob([`# ${title}\n\n${displayContent}`], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function handleDeleteClick() {
    if (confirmDelete) {
      setConfirmDelete(false);
      onDelete?.();
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  }

  return (
    <div className="animate-fade-in-up mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 relative z-10">
      {/* 3D Glassmorphic Top Action Dock */}
      <div
        className={`mb-8 rounded-3xl p-6 shadow-3d transition-colors duration-300 ${
          isDark ? 'glass-panel-elevated' : 'glass-panel-elevated bg-white/95 border-slate-200'
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-4 border-b pb-5 ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              {inputType === 'url' ? (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-mono font-medium border ${
                    isDark
                      ? 'border-rose-500/30 bg-rose-950/40 text-rose-300'
                      : 'border-rose-200 bg-rose-50 text-rose-700'
                  }`}
                >
                  <Video className="h-3 w-3 text-rose-500" />
                  YouTube Transcript Synthesis
                </span>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-mono font-medium border ${
                    isDark
                      ? 'border-indigo-500/30 bg-indigo-950/40 text-cyan-300'
                      : 'border-indigo-200 bg-indigo-50 text-indigo-700'
                  }`}
                >
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  Antigravity Topic Note
                </span>
              )}
            </div>

            <h1
              className={`text-2xl font-extrabold tracking-tight sm:text-3xl font-display ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {title}
            </h1>

            {input && (
              <p
                className={`text-xs font-mono mt-1.5 truncate max-w-xl ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Source Reference:{' '}
                <span className={isDark ? 'text-slate-300 font-sans' : 'text-slate-700 font-sans'}>
                  {input}
                </span>
              </p>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2">
            <ThemeToggle />

            <button
              onClick={handleCopyAll}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition shadow-sm ${
                isDark
                  ? 'border-slate-700 bg-space-card text-slate-200 hover:bg-slate-800 hover:text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              {copiedAll ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              title="Download as Markdown file"
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition shadow-sm ${
                isDark
                  ? 'border-slate-700 bg-space-card text-slate-200 hover:bg-slate-800 hover:text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <Download className="h-3.5 w-3.5 text-cyan-500" />
              <span className="hidden sm:inline">Export .md</span>
            </button>

            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition shadow-sm ${
                  confirmDelete
                    ? 'border-rose-500 bg-rose-500/20 text-rose-500'
                    : isDark
                    ? 'border-slate-800 bg-space-card text-slate-400 hover:border-rose-500/50 hover:bg-rose-950/30 hover:text-rose-400'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600'
                }`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{confirmDelete ? 'Confirm?' : 'Delete'}</span>
              </button>
            )}

            {onNew && (
              <button
                onClick={onNew}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2 text-xs font-bold text-white transition hover:shadow-md hover:shadow-indigo-500/30 active:scale-[0.98]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Synthesis</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rendered Notes Markdown Document with Antigravity Styling */}
      <div
        className={`rounded-3xl p-6 sm:p-10 shadow-3d transition-colors duration-300 ${
          isDark ? 'glass-panel' : 'glass-panel bg-white/95 border-slate-200 shadow-xl'
        }`}
      >
        <div
          className={`prose max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h2:border-b prose-h2:pb-2.5 prose-h2:mt-10 prose-h3:text-lg prose-p:leading-relaxed prose-strong:font-semibold prose-blockquote:border-l-indigo-500 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl ${
            isDark
              ? 'prose-invert prose-headings:text-white prose-h2:border-slate-800 prose-h3:text-indigo-400 prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white prose-blockquote:bg-indigo-950/20'
              : 'prose-slate prose-headings:text-slate-900 prose-h2:border-slate-200 prose-h3:text-indigo-600 prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-900 prose-blockquote:bg-indigo-50/50'
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match?.[1] || '';
                const code = String(children).replace(/\n$/, '');

                const isBlock = Boolean(match);
                if (!isBlock) {
                  return (
                    <code
                      className={`rounded-md border px-1.5 py-0.5 text-xs font-mono ${
                        isDark
                          ? 'bg-slate-900 border-slate-800 text-cyan-300'
                          : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      }`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }

                if (language === 'mermaid') {
                  return <MermaidDiagram chart={code} />;
                }

                return (
                  <CodeBlock language={language} code={code}>
                    {children}
                  </CodeBlock>
                );
              },
            }}
          >
            {displayContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
