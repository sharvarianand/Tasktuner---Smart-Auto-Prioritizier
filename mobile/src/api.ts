const BASE_URL = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:3001/api';

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export const taskApi = {
  getTasks: () => api('/tasks'),
  getPrioritized: () => api('/tasks'), // backend already returns prioritized
};


