import axios from 'axios';

let rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
rawBase = rawBase.trim().replace(/\/+$/, '');
const BASE_URL = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

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

export async function register(username, email, password) {
  const { data } = await api.post('/auth/register', {
    username,
    email,
    password,
  });
  return data;
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', {
    email,
    password,
  });
  return data;
}

export async function generateNote(input) {
  const { data } = await api.post('/notes/generate', { input });
  return data.note;
}

export async function fetchHistory() {
  const { data } = await api.get('/notes/history');
  return data;
}

export async function fetchNote(id) {
  const { data } = await api.get(`/notes/${id}`);
  return data;
}

export async function deleteNote(id) {
  await api.delete(`/notes/${id}`);
}

export async function fetchSettings() {
  const { data } = await api.get('/settings');
  return data;
}

export async function updateSettings(partialSettings) {
  const { data } = await api.put('/settings', partialSettings);
  return data;
}

export async function resetSettings() {
  const { data } = await api.post('/settings/reset');
  return data;
}

export async function applyPreset(preset) {
  const { data } = await api.post('/settings/apply-preset', { preset });
  return data;
}

export async function exportSettings() {
  const res = await api.get('/settings/export', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'gyanai-settings.json');
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function deleteUserData() {
  const { data } = await api.delete('/settings/data');
  return data;
}
