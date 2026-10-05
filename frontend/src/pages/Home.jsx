import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import InputBox from '../components/InputBox.jsx';
import NotesView from '../components/NotesView.jsx';
import SettingsView from '../components/SettingsView.jsx';
import DataflowView from '../components/DataflowView.jsx';
import SynthesisProgress from '../components/SynthesisProgress.jsx';
import TreeCanvas from '../components/TreeCanvas.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { DEFAULT_SETTINGS } from '../config/presets.js';
import { fetchHistory, fetchNote, generateNote, deleteNote, fetchSettings } from '../api.js';
import { AlertTriangle, X, Menu } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [history, setHistory] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDataflowOpen, setIsDataflowOpen] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  useEffect(() => {
    loadHistory();
    loadUserPreferences();
  }, []);

  async function loadUserPreferences() {
    try {
      const data = await fetchSettings();
      if (data && typeof data === 'object') {
        setSettings(data);
        try {
          localStorage.setItem('gyanai_settings', JSON.stringify(data));
        } catch {}
        return;
      }
    } catch {
      // fallback to local cache
    }

    try {
      const cached = localStorage.getItem('gyanai_settings');
      if (cached) {
        setSettings(JSON.parse(cached));
      }
    } catch {}
  }

  async function loadHistory() {
    try {
      const notes = await fetchHistory();
      setHistory(notes);
    } catch {
      // silent
    }
  }

  async function handleSelect(id) {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    setError('');
    setIsSettingsOpen(false);
    try {
      const note = await fetchNote(id);
      setActiveNote(note);
    } catch {
      setError('Could not load that note.');
    }
  }

  function handleNew() {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    setIsSettingsOpen(false);
    setIsDataflowOpen(false);
    setActiveNote(null);
    setInput('');
    setError('');
  }

  function handleOpenSettings() {
    setActiveNote(null);
    setIsDataflowOpen(false);
    setIsSettingsOpen(true);
    setError('');
  }

  function handleOpenDataflow() {
    setIsSettingsOpen(false);
    setIsDataflowOpen(true);
    setError('');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  async function handleDelete(id) {
    // Optimistic UI update
    setHistory((prev) => prev.filter((n) => n._id !== id));
    if (activeNote?._id === id) {
      setActiveNote(null);
    }

    try {
      await deleteNote(id);
    } catch (err) {
      console.error('Failed to delete note from server:', err);
      // Re-sync on failure
      await loadHistory();
      setError('Failed to delete note on server.');
    }
  }

  async function handleGenerate(modeOverride = 'comprehensive') {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError('');
    try {
      const mode = typeof modeOverride === 'string' ? modeOverride : 'comprehensive';
      const note = await generateNote(input.trim(), mode);
      setActiveNote(note);
      setIsSettingsOpen(false);
      setIsDataflowOpen(false);
      setInput('');
      await loadHistory();
    } catch (err) {
      const resp = err?.response?.data;
      if (resp?.message) {
        setError(resp.message);
      } else if (resp?.error === 'UNSUPPORTED_SOURCE') {
        setError("That source isn't supported yet — try a YouTube link or a plain topic.");
      } else if (resp?.error === 'TRANSCRIPTION_FAILED') {
        setError('Could not extract captions from this YouTube video. Please try a video with English captions.');
      } else if (resp?.error === 'OPENAI_KEY_MISSING') {
        setError('OpenAI API key is missing. Please set OPENAI_API_KEY in the server .env file.');
      } else {
        setError('Something went wrong generating notes. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`relative flex h-screen overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-space-base text-space-text' : 'bg-[#d8ece0] text-emerald-950'
      }`}
    >
      {/* 3D Gyan Forest Background Canvas */}
      <TreeCanvas interactive={true} opacity={0.95} />

      {/* Subtle Radial Glow Light Accents */}
      <div className="pointer-events-none absolute inset-0 bg-radial-gradient" />

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        notes={history}
        activeId={activeNote?._id ?? null}
        isSettingsActive={isSettingsOpen}
        isDataflowActive={isDataflowOpen}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
        onLogout={handleLogout}
        onOpenSettings={handleOpenSettings}
        onOpenDataflow={handleOpenDataflow}
      />

      <main className="relative flex flex-1 flex-col overflow-y-auto bg-transparent">
        {/* Top Right Floating Theme Toggle Button */}
        <div className="fixed top-4 right-4 z-30">
          <ThemeToggle />
        </div>

        {/* Floating Sandwich Toggle Button (when sidebar is collapsed) */}
        {!sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            title="Open sidebar"
            className={`fixed top-4 left-4 z-30 flex h-10 w-10 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 ${
              isDark
                ? 'border-emerald-900/80 bg-space-card/90 text-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 shadow-emerald-950/40'
                : 'border-emerald-200 bg-white/90 text-emerald-800 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 shadow-emerald-200/50'
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {isSettingsOpen ? (
          <SettingsView
            onBack={() => {
              setIsSettingsOpen(false);
              loadUserPreferences();
            }}
            onLogout={handleLogout}
          />
        ) : isDataflowOpen ? (
          <DataflowView
            activeNote={activeNote}
            notes={history}
            onSelectNote={handleSelect}
            onBack={() => setIsDataflowOpen(false)}
          />
        ) : activeNote ? (
          <NotesView
            title={activeNote.title}
            content={activeNote.content}
            inputType={activeNote.inputType}
            input={activeNote.input}
            onNew={handleNew}
            onDelete={() => handleDelete(activeNote._id)}
            onOpenDataflow={handleOpenDataflow}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10 my-auto">
            {loading ? (
              <SynthesisProgress />
            ) : (
              <>
                <InputBox
                  value={input}
                  onChange={setInput}
                  onSubmit={handleGenerate}
                  loading={loading}
                  settings={settings}
                  onOpenSettings={handleOpenSettings}
                />

                {error && (
                  <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 backdrop-blur-md px-4 py-3 text-xs text-rose-500 max-w-lg shadow-xl animate-fade-in-up">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
                      <span>{error}</span>
                    </div>
                    <button
                      onClick={() => setError('')}
                      className="rounded p-1 hover:bg-rose-500/20 text-rose-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
