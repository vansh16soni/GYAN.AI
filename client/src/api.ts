import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export type NoteSummary = {
  _id: string;
  title: string;
  input: string;
  createdAt: string;
};

export type Note = NoteSummary & {
  userId: string;
  inputType: 'url' | 'topic';
  content: string;
};

export type User = { id: string; username: string; email: string };

export async function register(username: string, email: string, password: string) {
  const { data } = await api.post<{ token: string; user: User }>('/auth/register', {
    username,
    email,
    password,
  });
  return data;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{ token: string; user: User }>('/auth/login', {
    email,
    password,
  });
  return data;
}

export async function generateNote(input: string) {
  const { data } = await api.post<{ note: Note }>('/notes/generate', { input });
  return data.note;
}

export async function fetchHistory() {
  const { data } = await api.get<NoteSummary[]>('/notes/history');
  return data;
}

export async function fetchNote(id: string) {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function deleteNote(id: string) {
  await api.delete(`/notes/${id}`);
}
