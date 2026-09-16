import { ChangeEvent, KeyboardEvent, useRef } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

const SUGGESTIONS = [
  'Binary Search Tree',
  'TCP vs UDP 3-Way Handshake',
  'https://youtu.be/lO5r8EBdvYo',
  'Attention Mechanism in Transformers',
];

export default function InputBox({ value, onChange, onSubmit, loading }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
    const el = ref.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 5 * 24)}px`;
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !loading) onSubmit();
    }
  }

  return (
    <div className="w-full max-w-2xl px-4 animate-fade-in">
      {/* Title & Brand Intro */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5c68e6] via-[#7c87ff] to-[#2fd5f6] text-[#0c0d14] font-black text-2xl shadow-xl shadow-[#7c87ff]/20">
          <svg className="h-7 w-7 text-[#0c0d14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#272a42] bg-[#141522]/80 px-3 py-1 text-[11px] font-mono font-medium text-[#2fd5f6] mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2fd5f6] animate-pulse" />
          Nocturne Synthetics AI Notes
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-[#f4f6ff] sm:text-4xl">
          What do you want to learn?
        </h2>
        <p className="mt-2 text-sm text-[#989fc2]">
          Paste a YouTube link or enter a topic to synthesize comprehensive study notes with diagrams.
        </p>
      </div>

      {/* Main Input Card */}
      <div className="rounded-2xl border border-[#272a42] bg-[#141522]/90 p-3.5 shadow-2xl backdrop-blur-md transition-all focus-within:border-[#7c87ff]/80 focus-within:ring-2 focus-within:ring-[#7c87ff]/20">
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Paste a YouTube URL or type any topic (e.g. Binary Search Tree)…"
          className="max-h-[140px] min-h-[48px] w-full resize-none bg-transparent px-3 py-2 text-sm text-[#f4f6ff] outline-none placeholder:text-[#5d638a] leading-relaxed"
        />
        <div className="flex items-center justify-between border-t border-[#222538]/70 pt-2.5 px-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#676d94]">
            <span className="rounded bg-[#1c1e2e] px-1.5 py-0.5 text-[#989fc2]">Enter ↵</span>
            <span>to generate</span>
          </div>

          <button
            onClick={onSubmit}
            disabled={!value.trim() || loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c87ff] to-[#5c68e6] px-4 py-2 text-xs font-bold text-[#0c0d14] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 shadow-md shadow-[#7c87ff]/20"
          >
            {loading ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0c0d14] border-t-transparent" />
                <span>Synthesizing…</span>
              </>
            ) : (
              <>
                <span>Generate</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prompt suggestions */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-mono text-[#676d94]">Quick prompts:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className="truncate max-w-[240px] rounded-xl border border-[#222538] bg-[#141522]/60 px-3 py-1.5 text-xs text-[#989fc2] transition hover:border-[#7c87ff]/50 hover:bg-[#1a1c2d] hover:text-[#f4f6ff]"
          >
            {s.startsWith('http') ? '🎬 YouTube Demo' : s}
          </button>
        ))}
      </div>
    </div>
  );
}
