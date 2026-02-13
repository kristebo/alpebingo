const BASE_URL = '/api';

async function request<T>(metode: string, sti: string, data?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Hent token fra localStorage
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const respons = await fetch(`${BASE_URL}${sti}`, {
    method: metode,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!respons.ok) {
    const feil = await respons.json().catch(() => ({ feil: 'Ukjent feil' }));
    throw new Error(feil.feil || 'Noe gikk galt');
  }

  return await respons.json();
}

export const api = {
  get: <T>(sti: string) => request<T>('GET', sti),
  post: <T>(sti: string, data: unknown) => request<T>('POST', sti, data),
  put: <T>(sti: string, data: unknown) => request<T>('PUT', sti, data),
  delete: <T>(sti: string) => request<T>('DELETE', sti),
};
