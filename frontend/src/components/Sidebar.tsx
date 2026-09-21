import { useState, useEffect } from 'react';
import { NoteSummary } from '../api';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import {
  Plus,
  Search,
  Trash2,
  LogOut,
  FileText,
  Sparkles,
  ChevronRight,
  Activity,
  PanelLeftClose,
  X,
} from 'lucide-react';

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
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

export default function Sidebar({
  isOpen,
  onToggle,
  onClose,
  notes,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onLogout,
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredNotes = notes.filter((n) =>
    (n.title || n.input).toLowerCase().includes(search.toLowerCase())
  );

  function handleDeleteClick(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    e.preventDefault();
    if (deletingId === id) {
      setDeletingId(null);
      onDelete(id);
    } else {
      setDeletingId(id);
      setTimeout(() => {
        setDeletingId((cur) => (cur === id ? null : cur));
      }, 3000);
    }
  }

  function handleSelectNote(id: string) {
    onSelect(id);
    if (window.innerWidth < 768) {
      onClose();
    }
  }

  function handleNewNote() {
    onNew();
    if (window.innerWidth < 768) {
      onClose();
    }
  }

  let userName = 'Antigravity User';
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      if (u.username) userName = u.username;
      else if (u.email) userName = u.email.split('@')[0];
    }
  } catch {}

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${
          isOpen
            ? 'opacity-100 pointer-events-auto bg-black/60 backdrop-blur-sm'
            : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Main Sandwich Sidebar Drawer / Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-shrink-0 flex-col border-r select-none transition-all duration-300 ease-in-out md:relative ${
          isOpen
            ? 'translate-x-0 opacity-100 md:w-72 shadow-2xl md:shadow-none'
            : '-translate-x-full md:-translate-x-full md:w-0 md:border-r-0 md:opacity-0 pointer-events-none'
        } ${
          isDark
            ? 'border-slate-800/80 bg-space-sidebar text-slate-200'
            : 'border-slate-200 bg-white/95 text-slate-800 backdrop-blur-md'
        }`}
      >
        <div className="flex h-full w-72 flex-col overflow-hidden">
          {/* Brand & Sandwich / Collapse Toggle Header */}
          <div className={`p-4 border-b ${isDark ? 'border-slate-800/70' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-md shadow-indigo-500/25">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1
                    className={`text-base font-extrabold tracking-tight leading-tight flex items-center gap-1 font-display ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    gyan<span className="text-indigo-500">.ai</span>
                  </h1>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[10px] text-slate-400 font-mono font-medium tracking-wider uppercase truncate">
                      Antigravity Core
                    </p>
                  </div>
                </div>
              </div>

              {/* Sandwich / Collapse Toggle Button */}
              <button
                onClick={onToggle}
                title="Collapse sidebar (Ctrl+B)"
                aria-label="Collapse sidebar"
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                  isDark
                    ? 'border-slate-800 bg-space-card/80 text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-white shadow-sm'
                    : 'border-slate-200 bg-slate-100/80 text-slate-600 hover:border-slate-300 hover:bg-slate-200 hover:text-slate-900 shadow-sm'
                }`}
              >
                <PanelLeftClose className="h-4 w-4 hidden md:block" />
                <X className="h-4 w-4 md:hidden" />
              </button>
            </div>

            {/* Action Button: New Synthesis */}
            <button
              onClick={handleNewNote}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 px-3.5 py-2.5 text-xs font-bold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              <span className="font-display">New Note Synthesis</span>
            </button>

            {/* Quick Search */}
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className={`w-full rounded-xl border py-1.5 pl-8 pr-3 text-xs outline-none transition ${
                  isDark
                    ? 'border-slate-800 bg-space-card/80 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500'
                }`}
              />
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Synthesis Archive ({filteredNotes.length})
              </span>
            </div>

            {filteredNotes.length === 0 ? (
              <div className="px-3 py-10 text-center">
                <FileText className="mx-auto h-6 w-6 text-slate-400 mb-2" />
                <p className="text-xs text-slate-500 font-medium">No notes found.</p>
                <p className="text-[11px] text-slate-400 mt-1">Start by generating your first note.</p>
              </div>
            ) : (
              filteredNotes.map((n) => {
                const isActive = activeId === n._id;
                const isConfirming = deletingId === n._id;

                return (
                  <div
                    key={n._id}
                    onClick={() => handleSelectNote(n._id)}
                    className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition cursor-pointer border ${
                      isActive
                        ? isDark
                          ? 'bg-indigo-950/50 border-indigo-500/40 text-white font-medium shadow-sm'
                          : 'bg-indigo-50/90 border-indigo-200 text-indigo-950 font-semibold shadow-sm'
                        : isDark
                        ? 'border-transparent text-slate-300 hover:bg-space-card hover:text-white hover:border-slate-800'
                        : 'border-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 hover:border-slate-200'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
                    )}
                    <div className="min-w-0 flex-1 pr-2 pl-1">
                      <div className="truncate text-xs font-semibold font-display">
                        {n.title || n.input}
                      </div>
                      <div className="truncate text-[10px] text-slate-400 font-mono mt-0.5">
                        {relativeDate(n.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        title={isConfirming ? 'Click again to confirm delete' : 'Delete note'}
                        onClick={(e) => handleDeleteClick(e, n._id)}
                        className={`rounded-lg p-1 transition ${
                          isConfirming
                            ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 opacity-100'
                            : isDark
                            ? 'opacity-0 group-hover:opacity-100 text-slate-400 hover:bg-slate-800 hover:text-rose-400'
                            : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:bg-slate-200 hover:text-rose-500'
                        }`}
                      >
                        {isConfirming ? (
                          <span className="text-[10px] font-mono font-bold text-rose-500 px-1">Del?</span>
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <ChevronRight
                        className={`h-3.5 w-3.5 transition-transform ${
                          isActive
                            ? 'text-indigo-500'
                            : 'text-slate-400 opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer / Theme Toggle & User Profile */}
          <div
            className={`border-t p-3 transition-colors duration-300 ${
              isDark ? 'border-slate-800/80 bg-space-base' : 'border-slate-200 bg-slate-50'
            }`}
          >
            {/* Dynamic Theme Switcher in Sidebar */}
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-[11px] font-mono text-slate-400 font-medium">Interface Theme</span>
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-between gap-2 px-1 pt-2 border-t border-slate-700/20">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold font-mono uppercase ${
                    isDark
                      ? 'bg-indigo-900/60 border border-indigo-700/40 text-cyan-300'
                      : 'bg-indigo-100 border border-indigo-200 text-indigo-700'
                  }`}
                >
                  {userName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p
                    className={`truncate text-xs font-semibold ${
                      isDark ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    {userName}
                  </p>
                  <p className="truncate text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Activity className="h-2.5 w-2.5 text-emerald-400" />
                    Active Session
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log out"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-rose-500 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

