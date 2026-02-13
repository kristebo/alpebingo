const BASE_URL = '/api';

let getTokenFn: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>) {
  console.log('[API] Token getter satt');
  getTokenFn = fn;
}

async function request<T>(metode: string, sti: string, data?: unknown): Promise<T> {
  console.log(`[API] ${metode} ${sti}`);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (getTokenFn) {
    console.log('[API] Henter token...');
    const token = await getTokenFn();
    console.log('[API] Token hentet:', token ? `${token.substring(0, 20)}...` : 'null');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } else {
    console.log('[API] Ingen token getter satt!');
  }

  console.log('[API] Sender request til:', `${BASE_URL}${sti}`);
  const respons = await fetch(`${BASE_URL}${sti}`, {
    method: metode,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  console.log('[API] Respons status:', respons.status, respons.statusText);

  if (!respons.ok) {
    const feil = await respons.json().catch(() => ({ feil: 'Ukjent feil' }));
    console.error('[API] Feil:', feil);
    throw new Error(feil.feil || 'Noe gikk galt');
  }

  const json = await respons.json();
  console.log('[API] Respons data:', json);
  return json;
}

export const api = {
  get: <T>(sti: string) => request<T>('GET', sti),
  post: <T>(sti: string, data: unknown) => request<T>('POST', sti, data),
  put: <T>(sti: string, data: unknown) => request<T>('PUT', sti, data),
  delete: <T>(sti: string) => request<T>('DELETE', sti),
};
