import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await register(username, email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err: any) {
      setError(
        err?.response?.data?.error === 'EMAIL_TAKEN'
          ? 'Email already registered.'
          : 'Something went wrong. Try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[#0c0d14] bg-dot-pattern">
      <div className="w-full max-w-md rounded-2xl border border-[#272a42] bg-[#141522]/95 p-8 shadow-2xl backdrop-blur-md animate-fade-in relative overflow-hidden">
        {/* Glow accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7c87ff] via-[#5c68e6] to-[#2fd5f6]" />

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5c68e6] to-[#7c87ff] text-[#0c0d14] font-bold text-xl shadow-lg shadow-[#7c87ff]/20">
            <svg className="h-6 w-6 text-[#0c0d14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f4f6ff]">gyan.ai</h1>
          <p className="text-xs text-[#2fd5f6] font-mono tracking-wider uppercase mt-0.5">
            Nocturne Synthetics
          </p>
          <p className="mt-2 text-xs text-[#989fc2]">Create an account to start generating notes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#d4d8ee]">Username</label>
            <input
              type="text"
              required
              minLength={2}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alex"
              className="w-full rounded-xl border border-[#272a42] bg-[#0c0d14] px-3.5 py-2.5 text-xs text-[#f4f6ff] outline-none transition placeholder:text-[#5d638a] focus:border-[#7c87ff] focus:ring-1 focus:ring-[#7c87ff]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#d4d8ee]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full rounded-xl border border-[#272a42] bg-[#0c0d14] px-3.5 py-2.5 text-xs text-[#f4f6ff] outline-none transition placeholder:text-[#5d638a] focus:border-[#7c87ff] focus:ring-1 focus:ring-[#7c87ff]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#d4d8ee]">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-[#272a42] bg-[#0c0d14] px-3.5 py-2.5 text-xs text-[#f4f6ff] outline-none transition placeholder:text-[#5d638a] focus:border-[#7c87ff] focus:ring-1 focus:ring-[#7c87ff]"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-[#f87171]/30 bg-[#1e1319] p-2.5 text-xs text-[#fca5a5]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#7c87ff] to-[#5c68e6] px-4 py-2.5 text-xs font-bold text-[#0c0d14] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50 shadow-md shadow-[#7c87ff]/20"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#989fc2]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#7c87ff] hover:text-[#9da7ff] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
