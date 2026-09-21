import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import InputBox from '../components/InputBox';
import NotesView from '../components/NotesView';
import SynthesisProgress from '../components/SynthesisProgress';
import AntigravityCanvas from '../components/AntigravityCanvas';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { NoteSummary, Note, fetchHistory, fetchNote, generateNote, deleteNote } from '../api';
import { AlertTriangle, X } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [history, setHistory] = useState<NoteSummary[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const notes = await fetchHistory();
      setHistory(notes);
    } catch {
      // silent
    }
  }

  async function handleSelect(id: string) {
    setError('');
    try {
      const note = await fetchNote(id);
      setActiveNote(note);
    } catch {
      setError('Could not load that note.');
    }
  }

  function handleNew() {
    setActiveNote(null);
    setInput('');
    setError('');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  async function handleDelete(id: string) {
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

  async function handleGenerate() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError('');
    try {
      const note = await generateNote(input.trim());
      setActiveNote(note);
      setInput('');
      await loadHistory();
    } catch (err: any) {
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
        isDark ? 'bg-space-base text-space-text' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* 3D Antigravity Background Canvas */}
      <AntigravityCanvas interactive={true} opacity={isDark ? 0.7 : 0.55} />

      {/* Subtle Radial Glow Light Accents */}
      <div className="pointer-events-none absolute inset-0 bg-radial-gradient" />

      <Sidebar
        notes={history}
        activeId={activeNote?._id ?? null}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
        onLogout={handleLogout}
      />

      <main className="relative flex flex-1 flex-col overflow-y-auto bg-transparent">
        {/* Top Right Floating Theme Toggle (when on blank landing canvas) */}
        {!activeNote && (
          <div className="absolute top-5 right-6 z-20 hidden sm:block">
            <ThemeToggle showLabel={true} />
          </div>
        )}

        {activeNote ? (
          <NotesView
            title={activeNote.title}
            content={activeNote.content}
            inputType={activeNote.inputType}
            input={activeNote.input}
            onNew={handleNew}
            onDelete={() => handleDelete(activeNote._id)}
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
