'use client';
import { useMemo, useSyncExternalStore } from 'react';

type Session = { name: string; email: string };

// Lê a sessão do localStorage sem precisar de useEffect + useState.
// No servidor (e na hidratação) devolve null; no navegador devolve a sessão real.
// Mesmo padrão do use-today.ts.
const subscribe = (cb: () => void) => {
  window.addEventListener('storage', cb);
  return () => window.removeEventListener('storage', cb);
};

export function useSession(): Session | null {
  const raw = useSyncExternalStore(subscribe, () => localStorage.getItem('session'), () => null);
  return useMemo(() => {
    try { return raw ? (JSON.parse(raw) as Session) : null; }
    catch { return null; }
  }, [raw]);
}
