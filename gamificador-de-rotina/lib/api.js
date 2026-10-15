// Único lugar que chama fetch. Sempre lança { message, errors } em caso de problema.
async function req(url, opcoes = {}) {
  let r;
  try {
    r = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opcoes });
  } catch {
    throw { message: 'Sem conexão com o servidor. Tente novamente.' };
  }
  const data = r.status === 204 ? null : await r.json().catch(() => null);
  if (!r.ok) throw { message: data?.message || 'Erro inesperado. Tente novamente.', errors: data?.errors };
  return data;
}

// monta as opções de uma requisição com corpo JSON
const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  list: (filters = {}) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    const query = params.toString();
    return req(`/api/tasks${query ? `?${query}` : ''}`);
  },
  get: (id) => req(`/api/tasks/${id}`),
  create: (b) => req('/api/tasks', json('POST', b)),
  update: (id, b) => req(`/api/tasks/${id}`, json('PUT', b)),
  toggle: (id, date) => req(`/api/tasks/${id}`, json('PATCH', { date })),
  remove: (id) => req(`/api/tasks/${id}`, { method: 'DELETE' }),
};