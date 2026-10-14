export type Frequency = 'daily' | 'weekly' | 'monthly';
// só os campos que o cálculo do streak precisa; a Task completa do projeto já encaixa aqui
export type StreakTask = { frequency: Frequency; target: number; checkins: string[] };
export type DayInfo = { date: string; label: string; done: boolean; isToday: boolean };

const pad = (n: number) => String(n).padStart(2, '0');
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const today = () => iso(new Date());

// início do período (dia, semana seg-dom ou mês) que contém a data s
const start = (s: string, f: Frequency): Date => {
  const d = new Date(s + 'T12:00:00');
  if (f === 'weekly') d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  if (f === 'monthly') d.setDate(1);
  return d;
};
const prev = (d: Date, f: Frequency): Date => {
  const p = new Date(d);
  if (f === 'daily') p.setDate(p.getDate() - 1);
  else if (f === 'weekly') p.setDate(p.getDate() - 7);
  else p.setMonth(p.getMonth() - 1);
  return p;
};
const nextPeriod = (d: Date, f: Frequency): Date => {
  const p = new Date(d);
  if (f === 'daily') p.setDate(p.getDate() + 1);
  else if (f === 'weekly') p.setDate(p.getDate() + 7);
  else p.setMonth(p.getMonth() + 1);
  return p;
};
const count = (t: StreakTask, key: string) => t.checkins.filter((c) => iso(start(c, t.frequency)) === key).length;

export const progress = (t: StreakTask, now: string = today()) => count(t, iso(start(now, t.frequency)));

// períodos consecutivos com meta batida; o período atual só soma se já estiver cumprido
// (o parâmetro opcional "now" existe para os testes poderem fixar a data de hoje)
export function streak(t: StreakTask, now: string = today()): number {
  let d = start(now, t.frequency), n = 0;
  if (count(t, iso(d)) >= t.target) n++;
  d = prev(d, t.frequency);
  while (count(t, iso(d)) >= t.target) { n++; d = prev(d, t.frequency); }
  return n;
}

// recorde: a maior sequência de períodos consecutivos com meta batida em todo o histórico
export function bestStreak(t: StreakTask, now: string = today()): number {
  const met = new Set<string>();
  for (const c of t.checkins) {
    const key = iso(start(c, t.frequency));
    if (count(t, key) >= t.target) met.add(key);
  }
  let best = 0;
  for (const key of met) {
    // só começa a contar de um período que NÃO tem um anterior cumprido (início de sequência)
    if (met.has(iso(prev(start(key, t.frequency), t.frequency)))) continue;
    let n = 0, d = start(key, t.frequency);
    while (met.has(iso(d))) { n++; d = nextPeriod(d, t.frequency); }
    best = Math.max(best, n);
  }
  return Math.max(best, streak(t, now));
}

// últimos n dias (do mais antigo ao de hoje), marcando em quais houve check-in
const WEEKDAY = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
export function lastDays(t: StreakTask, n = 7, now: string = today()): DayInfo[] {
  const out: DayInfo[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now + 'T12:00:00');
    d.setDate(d.getDate() - i);
    const date = iso(d);
    out.push({ date, label: WEEKDAY[d.getDay()], done: t.checkins.includes(date), isToday: i === 0 });
  }
  return out;
}

export const UNIT: Record<Frequency, string> = { daily: 'dia', weekly: 'semana', monthly: 'mês' };
export const UNIT_PL: Record<Frequency, string> = { daily: 'dias', weekly: 'semanas', monthly: 'meses' };
export const PERIOD: Record<Frequency, string> = { daily: 'hoje', weekly: 'esta semana', monthly: 'este mês' };
