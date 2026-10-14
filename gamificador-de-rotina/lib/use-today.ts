'use client';
import { useSyncExternalStore } from 'react';
import { today } from './streak';

// Data de hoje (AAAA-MM-DD) no fuso do navegador.
// No servidor (e na hidratação) devolve null; só no navegador devolve a data real.
// Isso evita que o servidor (que roda em UTC) e o navegador (UTC-3) calculem "hoje" diferente
// e causem erro de hidratação ou streak errado à noite.
const subscribe = () => () => {};
export const useToday = (): string | null => useSyncExternalStore(subscribe, today, () => null);
