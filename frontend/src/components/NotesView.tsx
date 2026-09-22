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
      particleCount: 40,
      spread: 70,
      origin: { y: 0.2 },
      colors: ['#10b981', '#34d399', '#6ee7b7', '#00ff9d'],
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
        className={`mb-8 rounded-3xl p-6 shadow-3d transition-colors duration-300 glass-panel-elevated`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold border ${
                  isDark
                    ? 'border-emerald-800 bg-emerald-950/70 text-emerald-300'
                    : 'border-emerald-300/80 bg-emerald-100/80 text-emerald-900'
                }`}
              >
                {inputType === 'url' ? (
                  <>
                    <Video className="h-3 w-3" />
                    <span>Video Synthesis</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
                    <span>Concept Tree</span>
                  </>
                )}
              </span>

              {input && (
                <span className="truncate text-xs text-emerald-800/80 dark:text-emerald-400/60 font-mono">
                  {input}
                </span>
              )}
            </div>

            <h1
              className={`text-xl font-extrabold sm:text-2xl font-display tracking-tight leading-snug ${
                isDark ? 'text-white' : 'text-emerald-950'
              }`}
            >
              {title}
            </h1>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={handleCopyAll}
              title="Copy formatted Markdown"
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                copiedAll
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                  : isDark
                  ? 'border-emerald-900 bg-space-card text-emerald-200 hover:border-emerald-500/50 hover:text-white'
                  : 'border-emerald-300/80 bg-emerald-100/70 text-emerald-900 hover:border-emerald-400 hover:bg-emerald-200/80'
              }`}
            >
              {copiedAll ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedAll ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              title="Download Markdown file"
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                isDark
                  ? 'border-emerald-900 bg-space-card text-emerald-200 hover:border-emerald-500/50 hover:text-white'
                  : 'border-emerald-300/80 bg-emerald-100/70 text-emerald-900 hover:border-emerald-400 hover:bg-emerald-200/80'
              }`}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </button>

            {onDelete && (
              <button
                onClick={handleDeleteClick}
                title={confirmDelete ? 'Click to confirm delete' : 'Delete note'}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                  confirmDelete
                    ? 'border-rose-500/60 bg-rose-500/20 text-rose-400'
                    : isDark
                    ? 'border-emerald-900 bg-space-card text-emerald-300/70 hover:border-rose-500/40 hover:text-rose-400'
                    : 'border-emerald-300/80 bg-emerald-100/70 text-emerald-900 hover:border-rose-400 hover:text-rose-600'
                }`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{confirmDelete ? 'Confirm?' : 'Delete'}</span>
              </button>
            )}

            {onNew && (
              <button
                onClick={onNew}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-500/25 transition-all hover:shadow-lg active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New</span>
              </button>
            )}

            <div className="ml-1 pl-2 border-l border-emerald-900/60">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Rendered Notes Markdown Document with Living Tree Styling */}
      <div
        className={`rounded-3xl p-6 sm:p-10 shadow-3d transition-colors duration-300 glass-panel`}
      >
        <div
          className={`prose max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h2:border-b prose-h2:pb-2.5 prose-h2:mt-10 prose-h3:text-lg prose-p:leading-relaxed prose-strong:font-semibold prose-blockquote:border-l-emerald-500 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl ${
            isDark
              ? 'prose-invert prose-headings:text-white prose-h2:border-emerald-900/60 prose-h3:text-emerald-400 prose-p:text-emerald-200/90 prose-li:text-emerald-200/90 prose-strong:text-white prose-blockquote:bg-emerald-950/20'
              : 'prose-emerald prose-headings:text-emerald-950 prose-h2:border-emerald-200 prose-h3:text-emerald-700 prose-p:text-emerald-900/90 prose-li:text-emerald-900/90 prose-strong:text-emerald-950 prose-blockquote:bg-emerald-50/60'
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
