import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import InputBox from '../components/InputBox';
import NotesView from '../components/NotesView';
import { NoteSummary, Note, fetchHistory, fetchNote, generateNote, deleteNote } from '../api';

export default function Home() {
  const navigate = useNavigate();
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
    <div className="flex h-screen overflow-hidden bg-[#0c0d14] text-[#e2e6ff]">
      <Sidebar
        notes={history}
        activeId={activeNote?._id ?? null}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
        onLogout={handleLogout}
      />

      <main className="flex flex-1 flex-col overflow-y-auto bg-[#0c0d14] bg-dot-pattern">
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
          <div className="flex flex-1 flex-col items-center justify-center p-6">
            {loading ? (
              <div className="flex flex-col items-center gap-5 text-center animate-fade-in">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute h-full w-full animate-ping rounded-2xl bg-[#7c87ff]/20" />
                  <div className="h-12 w-12 animate-spin rounded-2xl border-2 border-[#272a42] border-t-[#7c87ff] border-r-[#2fd5f6]" />
                </div>
                <div>
                  <p className="text-base font-bold text-[#f4f6ff] tracking-tight">
                    Synthesizing study notes…
                  </p>
                  <p className="text-xs text-[#676d94] font-mono mt-1.5">
                    Analyzing content, generating Mermaid flowcharts & code examples
                  </p>
                </div>
              </div>
            ) : (
              <>
                <InputBox
                  value={input}
                  onChange={setInput}
                  onSubmit={handleGenerate}
                  loading={loading}
                />
                {error && (
                  <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-[#f87171]/30 bg-[#1e1319] px-4 py-3 text-xs text-[#fca5a5] max-w-lg shadow-lg">
                    <svg className="h-4 w-4 flex-shrink-0 text-[#f87171]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
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
