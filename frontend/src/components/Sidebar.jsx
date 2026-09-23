import { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  Plus,
  Search,
  Trash2,
  LogOut,
  FileText,
  Sparkles,
  ChevronRight,
  Settings,
  ShieldCheck,
  Menu,
} from 'lucide-react';

function relativeDate(iso) {
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
  isOpen = true,
  onToggle,
  notes = [],
  activeId,
  isSettingsActive = false,
  onSelect,
  onNew,
  onDelete,
  onLogout,
  onOpenSettings,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');

  const filteredNotes = notes.filter((n) =>
    (n.title || n.input).toLowerCase().includes(search.toLowerCase())
  );

  function handleDeleteClick(e, id) {
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

  let userName = 'Tree User';
  let userEmail = 'user@gyan.ai';
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      if (u.username) userName = u.username;
      else if (u.email) userName = u.email.split('@')[0];
      if (u.email) userEmail = u.email;
    }
  } catch {}

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-30 flex h-full flex-shrink-0 flex-col border-r select-none transition-all duration-300 ease-in-out ${
          isOpen
            ? 'w-72 translate-x-0 opacity-100'
            : 'w-0 -translate-x-full md:translate-x-0 md:w-0 opacity-0 pointer-events-none border-r-0'
        } ${
          isDark
            ? 'border-emerald-900/70 bg-space-sidebar text-slate-200'
            : 'border-emerald-200/80 bg-[#d8ece0]/95 text-emerald-950 backdrop-blur-xl'
        }`}
      >
        <div className="w-72 flex flex-col h-full overflow-hidden">
          {/* Brand & New note header */}
          <div className={`p-4 border-b ${isDark ? 'border-emerald-900/60' : 'border-emerald-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white shadow-md shadow-emerald-500/25">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div
                    className={`text-base font-extrabold tracking-tight leading-tight flex items-center gap-1 font-display ${
                      isDark ? 'text-white' : 'text-emerald-950'
                    }`}
                  >
                    gyan<span className="text-emerald-500">.ai</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium tracking-wide">
                      Living Tree Core
                    </p>
                  </div>
                </div>
              </div>

              {/* Collapse toggle button */}
              {onToggle && (
                <button
                  type="button"
                  onClick={onToggle}
                  title="Collapse sidebar"
                  className={`rounded-xl p-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isDark
                      ? 'text-emerald-300 hover:bg-space-card hover:text-white'
                      : 'text-emerald-700 hover:bg-emerald-100 hover:text-emerald-950'
                  }`}
                >
                  <Menu className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Action Button: New Synthesis */}
            <button
              onClick={onNew}
              className="btn-primary w-full text-xs font-bold shadow-md active:scale-[0.98]"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              <span className="font-display">New Tree Synthesis</span>
            </button>

            {/* Quick Search */}
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className={`w-full rounded-xl border py-2 pl-8 pr-3 text-xs outline-none transition ${
                  isDark
                    ? 'border-emerald-900/80 bg-space-card text-white placeholder:text-emerald-300/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    : 'border-emerald-200 bg-emerald-50/80 text-emerald-950 placeholder:text-emerald-700/60 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500'
                }`}
              />
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                Synthesis Archive ({filteredNotes.length})
              </span>
            </div>

            {filteredNotes.length === 0 ? (
              <div className="px-3 py-4 text-center">
                <FileText className="mx-auto h-6 w-6 text-emerald-600/60 dark:text-emerald-400/60 mb-2" />
                <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">No notes found.</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Start by generating your first note.</p>
              </div>
            ) : (
              filteredNotes.map((n) => {
                const isActive = !isSettingsActive && activeId === n._id;
                const isConfirming = deletingId === n._id;

                return (
                  <div
                    key={n._id}
                    onClick={() => onSelect(n._id)}
                    className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition cursor-pointer border ${
                      isActive
                        ? isDark
                          ? 'bg-emerald-950/70 border-emerald-500/50 text-white font-medium shadow-sm'
                          : 'bg-emerald-100 border-emerald-300 text-emerald-950 font-semibold shadow-sm'
                        : isDark
                        ? 'border-transparent text-emerald-200/90 hover:bg-space-card hover:text-white hover:border-emerald-900/60'
                        : 'border-transparent text-emerald-800 hover:bg-emerald-100/60 hover:text-emerald-950 hover:border-emerald-200'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-emerald-400 shadow-sm shadow-emerald-400/60" />
                    )}
                    <div className="min-w-0 flex-1 pr-2 pl-1">
                      <div className="truncate text-xs font-semibold font-display">
                        {n.title || n.input}
                      </div>
                      <div className="truncate text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                        {relativeDate(n.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        title={isConfirming ? 'Click again to confirm delete' : 'Delete note'}
                        onClick={(e) => handleDeleteClick(e, n._id)}
                        className={`rounded-lg p-1.5 transition ${
                          isConfirming
                            ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 opacity-100'
                            : isDark
                            ? 'opacity-0 group-hover:opacity-100 text-emerald-400 hover:bg-space-card hover:text-rose-400'
                            : 'opacity-0 group-hover:opacity-100 text-emerald-600 hover:bg-emerald-200 hover:text-rose-500'
                        }`}
                      >
                        {isConfirming ? (
                          <span className="text-xs font-mono font-bold text-rose-500 px-1">Del?</span>
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <ChevronRight
                        className={`h-3.5 w-3.5 transition-transform ${
                          isActive
                            ? 'text-emerald-500'
                            : 'text-emerald-400 opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Unified Footer: Single Profile & Settings Action */}
          <div
            className={`border-t p-3 transition-colors duration-300 ${
              isDark ? 'border-emerald-900/60 bg-space-base' : 'border-emerald-200 bg-emerald-50/90'
            }`}
          >
            <div
              className={`w-full flex items-center justify-between rounded-xl p-2.5 transition-all text-left border ${
                isSettingsActive
                  ? isDark
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-emerald-100 border-emerald-300 text-emerald-950 shadow-sm'
                  : isDark
                  ? 'border-emerald-900/60 bg-space-card/70 text-emerald-200'
                  : 'border-emerald-200 bg-white text-emerald-800'
              }`}
            >
              <button
                type="button"
                onClick={onOpenSettings}
                aria-label={`Open Tree Configuration for ${userName}`}
                className="flex items-center gap-2.5 flex-1 min-w-0 text-left group hover:opacity-90 transition"
              >
                <div
                  aria-hidden="true"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold font-mono uppercase shadow-sm ${
                    isDark
                      ? 'bg-gradient-to-tr from-emerald-900 to-emerald-700 text-emerald-200 border border-emerald-600/40'
                      : 'bg-gradient-to-tr from-emerald-200 to-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {userName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="truncate text-xs font-bold font-display block leading-tight text-emerald-950 dark:text-white">
                    {userName}
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5 whitespace-nowrap">
                    <Settings className={`h-3 w-3 shrink-0 ${isSettingsActive ? 'text-emerald-400 animate-spin-slow' : 'text-emerald-500'}`} />
                    <span>Tree Config</span>
                  </span>
                </div>
              </button>

              <div className="flex items-center gap-1.5 shrink-0 pl-1.5">
                <button
                  type="button"
                  onClick={onLogout}
                  title="Log out"
                  className="btn-danger p-1.5 rounded-lg text-xs"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:text-xs">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
