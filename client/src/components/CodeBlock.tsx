import { useState } from 'react';

type Props = {
  language: string;
  code: string;
  children: React.ReactNode;
};

export default function CodeBlock({ language, code, children }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="my-5 overflow-hidden rounded-2xl border border-[#272a42] bg-[#0d0e16] shadow-xl">
      <div className="flex items-center justify-between border-b border-[#222538] bg-[#141522] px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]/40" />
          </div>
          <span className="font-mono text-[11px] font-semibold text-[#7c87ff] uppercase ml-1">
            {language || 'code'}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium text-[#989fc2] transition hover:bg-[#202236] hover:text-[#f4f6ff]"
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5 text-[#34d399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[#34d399]">Copied</span>
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5 text-[#7c87ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-[#d4d8ee] bg-[#0c0d14]">
        <code>{children}</code>
      </pre>
    </div>
  );
}
