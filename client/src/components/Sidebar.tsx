import { useState } from 'react';
import { NoteSummary } from '../api';

type Props = {
  notes: NoteSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
};

function relativeDate(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function Sidebar({ notes, activeId, onSelect, onNew, onDelete, onLogout }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDeleteClick(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    e.preventDefault();
    if (deletingId === id) {
      // Confirmed deletion
      setDeletingId(null);
      onDelete(id);
    } else {
      // First click: prompt confirm
      setDeletingId(id);
      setTimeout(() => {
        setDeletingId((cur) => (cur === id ? null : cur));
      }, 3000);
    }
  }

  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col border-r border-[#222538] bg-[#10111a] select-none text-[#e2e6ff]">
      {/* Brand & New note header */}
      <div className="p-4 border-b border-[#222538]/70">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5c68e6] to-[#7c87ff] text-white font-bold text-sm shadow-md shadow-[#7c87ff]/20">
              <svg className="h-4 w-4 text-[#0c0d14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-[#f4f6ff] tracking-tight leading-tight flex items-center gap-1.5">
                gyan<span className="text-[#7c87ff]">.ai</span>
              </h1>
              <p className="text-[10px] text-[#2fd5f6] font-mono font-medium tracking-wider uppercase">
                Nocturne Synthetics
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7c87ff] to-[#5c68e6] px-3.5 py-2.5 text-xs font-semibold text-[#0c0d14] transition hover:brightness-110 active:scale-[0.98] shadow-sm shadow-[#7c87ff]/25"
        >
          <span className="text-base leading-none font-bold text-[#0c0d14]">+</span>
          <span className="font-sans font-bold">New note</span>
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        <div className="flex items-center justify-between px-2.5 py-1.5">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#676d94]">
            History ({notes.length})
          </span>
        </div>

        {notes.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <p className="text-xs text-[#676d94]">No notes generated yet.</p>
          </div>
        ) : (
          notes.map((n) => {
            const isActive = activeId === n._id;
            const isConfirming = deletingId === n._id;

            return (
              <div
                key={n._id}
                onClick={() => onSelect(n._id)}
                className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition cursor-pointer border ${
                  isActive
                    ? 'bg-[#1b1d2e] border-[#7c87ff]/40 text-[#f4f6ff] font-medium shadow-sm'
                    : 'border-transparent text-[#989fc2] hover:bg-[#161724] hover:text-[#e2e6ff] hover:border-[#272a42]'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full bg-[#7c87ff]" />
                )}
                <div className="min-w-0 flex-1 pr-2 pl-0.5">
                  <div className="truncate text-xs font-medium">{n.title || n.input}</div>
                  <div className="truncate text-[10px] text-[#676d94] font-mono mt-0.5">
                    {relativeDate(n.createdAt)}
                  </div>
                </div>

                <button
                  type="button"
                  title={isConfirming ? 'Click again to confirm delete' : 'Delete note'}
                  onClick={(e) => handleDeleteClick(e, n._id)}
                  className={`rounded-lg p-1.5 transition flex-shrink-0 ${
                    isConfirming
                      ? 'bg-[#f87171]/20 text-[#f87171] border border-[#f87171]/40 opacity-100'
                      : 'opacity-0 group-hover:opacity-100 text-[#676d94] hover:bg-[#272a42] hover:text-[#f87171]'
                  }`}
                >
                  {isConfirming ? (
                    <span className="text-[10px] font-mono font-bold text-[#f87171] px-1">Del?</span>
                  ) : (
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Logout */}
      <div className="border-t border-[#222538]/70 p-3 bg-[#0d0e16]">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#989fc2] transition hover:bg-[#161724] hover:text-[#f4f6ff]"
        >
          <svg className="h-4 w-4 text-[#7c87ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
