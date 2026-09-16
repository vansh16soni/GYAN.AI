import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import CodeBlock from './CodeBlock';
import MermaidDiagram from './MermaidDiagram';

type Props = {
  title: string;
  content: string;
  inputType?: 'url' | 'topic';
  input?: string;
  onNew?: () => void;
  onDelete?: () => void;
};

export function cleanMarkdown(raw: string): string {
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
  const displayContent = cleanMarkdown(content);

  async function handleCopyAll() {
    await navigator.clipboard.writeText(`# ${title}\n\n${displayContent}`);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
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
    <div className="animate-fade-in mx-auto w-full max-w-4xl px-6 py-8">
      {/* Top action bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#222538] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {inputType === 'url' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2fd5f6]/30 bg-[#2fd5f6]/10 px-3 py-0.5 text-[11px] font-mono font-medium text-[#2fd5f6]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2fd5f6]" />
                YouTube Transcript Note
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7c87ff]/30 bg-[#7c87ff]/10 px-3 py-0.5 text-[11px] font-mono font-medium text-[#7c87ff]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7c87ff]" />
                Topic Synthesis
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f4f6ff] sm:text-3xl">{title}</h1>
          {input && (
            <p className="text-xs text-[#676d94] font-mono mt-1.5 truncate max-w-xl">
              Source: <span className="text-[#989fc2]">{input}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 rounded-xl border border-[#272a42] bg-[#161724] px-3.5 py-2 text-xs font-semibold text-[#d4d8ee] transition hover:bg-[#202236] hover:text-white shadow-sm"
          >
            <svg className="h-4 w-4 text-[#7c87ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>{copiedAll ? 'Copied' : 'Copy Markdown'}</span>
          </button>

          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition shadow-sm ${
                confirmDelete
                  ? 'border-[#f87171] bg-[#f87171]/20 text-[#f87171]'
                  : 'border-[#272a42] bg-[#161724] text-[#989fc2] hover:border-[#f87171]/50 hover:bg-[#1f161b] hover:text-[#f87171]'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>{confirmDelete ? 'Confirm Delete?' : 'Delete'}</span>
            </button>
          )}

          {onNew && (
            <button
              onClick={onNew}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#7c87ff] to-[#5c68e6] px-4 py-2 text-xs font-bold text-[#0c0d14] transition hover:brightness-110 active:scale-[0.98] shadow-sm shadow-[#7c87ff]/20"
            >
              <span>+ New Note</span>
            </button>
          )}
        </div>
      </div>

      {/* Rendered Notes Markdown */}
      <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#f4f6ff] prose-h2:text-xl prose-h2:border-b prose-h2:border-[#222538] prose-h2:pb-2.5 prose-h2:mt-10 prose-h3:text-lg prose-h3:text-[#7c87ff] prose-p:text-[#c5caea] prose-p:leading-relaxed prose-li:text-[#c5caea] prose-strong:text-[#f4f6ff] prose-strong:font-semibold">
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
                    className="rounded-md bg-[#191b2b] border border-[#272a42] px-1.5 py-0.5 text-xs text-[#2fd5f6] font-mono"
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
  );
}
