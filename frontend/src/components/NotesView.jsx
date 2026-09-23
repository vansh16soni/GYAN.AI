import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import confetti from 'canvas-confetti';
import CodeBlock from './CodeBlock.jsx';
import MermaidDiagram from './MermaidDiagram.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  exportToPDF,
  exportToWord,
  exportToMarkdown,
  exportToPlainText,
} from '../utils/exportUtils.js';
import {
  Copy,
  Check,
  Download,
  Trash2,
  Plus,
  Sparkles,
  Video,
  FileText,
  FileType,
  FileCode,
  FileSpreadsheet,
  ChevronDown,
  Loader2,
} from 'lucide-react';

function cleanMarkdown(raw) {
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

export default function NotesView({ title, content, inputType, input, onNew, onDelete }) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportingType, setExportingType] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const displayContent = cleanMarkdown(content);
  const documentRef = useRef(null);
  const exportMenuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  async function handleExportAction(type) {
    setExportingType(type);
    setShowExportMenu(false);
    try {
      if (type === 'pdf') {
        await exportToPDF(title, displayContent, documentRef.current);
      } else if (type === 'word') {
        exportToWord(title, displayContent);
      } else if (type === 'markdown') {
        exportToMarkdown(title, displayContent);
      } else if (type === 'txt') {
        exportToPlainText(title, displayContent);
      }

      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.25 },
        colors: ['#10b981', '#06b6d4', '#3b82f6'],
      });
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExportingType(null);
    }
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
      {/* Top Action Dock */}
      <div
        className="mb-8 rounded-3xl p-6 sm:p-7 shadow-3d transition-colors duration-300 glass-panel-elevated bg-space-card/95 backdrop-blur-xl border border-emerald-500/20"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono font-semibold border ${
                  isDark
                    ? 'border-emerald-800 bg-emerald-950/70 text-emerald-300'
                    : 'border-emerald-300/80 bg-emerald-100/80 text-emerald-900'
                }`}
              >
                {inputType === 'url' ? (
                  <>
                    <Video className="h-3.5 w-3.5" />
                    <span>Video Synthesis</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Concept Tree</span>
                  </>
                )}
              </span>

              {input && (
                <span className="truncate text-xs text-emerald-700 dark:text-emerald-400 font-mono">
                  {input}
                </span>
              )}
            </div>

            <h1
              className={`text-xl font-extrabold sm:text-2xl font-display tracking-tight leading-snug break-words ${
                isDark ? 'text-white' : 'text-emerald-950'
              }`}
            >
              {title}
            </h1>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap shrink-0 pt-1">
            {/* Copy Action */}
            <button
              onClick={handleCopyAll}
              title="Copy formatted Markdown"
              className={`btn-secondary ${
                copiedAll ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : ''
              }`}
            >
              {copiedAll ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedAll ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Export Multi-Format Dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu((prev) => !prev)}
                disabled={Boolean(exportingType)}
                title="Choose export format (PDF, Word, Markdown, Text)"
                className={`btn-secondary ${
                  showExportMenu ? 'border-emerald-500 ring-1 ring-emerald-500/40' : ''
                }`}
              >
                {exportingType ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                <span>{exportingType ? `Exporting ${exportingType.toUpperCase()}...` : 'Export'}</span>
                <ChevronDown className={`h-3 w-3 text-emerald-400 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showExportMenu && (
                <div
                  className={`absolute right-0 top-full mt-2 w-56 rounded-2xl border p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-fade-in-up ${
                    isDark
                      ? 'border-emerald-900/80 bg-space-card/95 text-white shadow-emerald-950/60'
                      : 'border-emerald-200 bg-white/95 text-emerald-950 shadow-emerald-200/50'
                  }`}
                >
                  <div className="px-3 py-1.5 border-b border-emerald-900/40 mb-1">
                    <p className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                      Export Formats
                    </p>
                  </div>

                  {/* PDF Option */}
                  <button
                    onClick={() => handleExportAction('pdf')}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                      isDark
                        ? 'hover:bg-emerald-950/60 hover:text-emerald-200 text-slate-200'
                        : 'hover:bg-emerald-50 hover:text-emerald-950 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        <FileType className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold block font-display">PDF Document</span>
                        <span className="text-xs text-slate-400 font-mono">Formatted & Printable</span>
                      </div>
                    </div>
                    <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-xs font-mono font-bold text-rose-400 border border-rose-500/20">
                      .pdf
                    </span>
                  </button>

                  {/* Word Option */}
                  <button
                    onClick={() => handleExportAction('word')}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                      isDark
                        ? 'hover:bg-emerald-950/60 hover:text-emerald-200 text-slate-200'
                        : 'hover:bg-emerald-50 hover:text-emerald-950 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        <FileText className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold block font-display">Microsoft Word</span>
                        <span className="text-xs text-slate-400 font-mono">Rich Word Document</span>
                      </div>
                    </div>
                    <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-xs font-mono font-bold text-blue-400 border border-blue-500/20">
                      .doc
                    </span>
                  </button>

                  {/* Markdown Option */}
                  <button
                    onClick={() => handleExportAction('markdown')}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                      isDark
                        ? 'hover:bg-emerald-950/60 hover:text-emerald-200 text-slate-200'
                        : 'hover:bg-emerald-50 hover:text-emerald-950 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <FileCode className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold block font-display">Markdown</span>
                        <span className="text-xs text-slate-400 font-mono">Obsidian & Notion</span>
                      </div>
                    </div>
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/20">
                      .md
                    </span>
                  </button>

                  {/* Plain Text Option */}
                  <button
                    onClick={() => handleExportAction('txt')}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                      isDark
                        ? 'hover:bg-emerald-950/60 hover:text-emerald-200 text-slate-200'
                        : 'hover:bg-emerald-50 hover:text-emerald-950 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-500/15 text-slate-400 border border-slate-500/30">
                        <FileSpreadsheet className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold block font-display">Plain Text</span>
                        <span className="text-xs text-slate-400 font-mono">Raw text summary</span>
                      </div>
                    </div>
                    <span className="rounded bg-slate-500/10 px-1.5 py-0.5 text-xs font-mono font-bold text-slate-400 border border-slate-500/20">
                      .txt
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* New Note Action */}
            {onNew && (
              <button
                onClick={onNew}
                className="btn-primary text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New</span>
              </button>
            )}

            {/* Delete Action */}
            {onDelete && (
              <div className="flex items-center pl-1 border-l border-emerald-900/40">
                <button
                  onClick={handleDeleteClick}
                  title={confirmDelete ? 'Click to confirm delete' : 'Delete note'}
                  className={`btn-danger ${
                    confirmDelete ? 'bg-rose-500/25 border-rose-500/60 text-white font-bold' : ''
                  }`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{confirmDelete ? 'Confirm Delete?' : 'Delete'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rendered Notes Markdown Document with Living Tree Styling */}
      <div
        ref={documentRef}
        className="rounded-3xl p-6 sm:p-10 shadow-3d transition-colors duration-300 glass-panel-elevated bg-space-card/95 backdrop-blur-xl border border-emerald-500/20"
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
