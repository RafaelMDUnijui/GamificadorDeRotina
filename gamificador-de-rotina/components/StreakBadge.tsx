'use client';
import { bestStreak, streak, UNIT, UNIT_PL, type StreakTask } from '@/lib/streak';
import { useToday } from '@/lib/use-today';

// Selo de sequência: streak atual e recorde. Uso: <StreakBadge task={task} />
export default function StreakBadge({ task }: { task: StreakTask }) {
  const now = useToday();
  const box = 'flex min-w-[72px] flex-col items-center justify-center rounded-xl p-2 font-bold';
  if (!now) return <div className={`${box} min-h-[88px]`} aria-hidden="true" />;

  const s = streak(task, now);
  const best = bestStreak(task, now);
  const unit = (n: number) => (n === 1 ? UNIT[task.frequency] : UNIT_PL[task.frequency]);
  const tone = s
    ? 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200'
    : 'border border-dashed border-zinc-500 text-zinc-600 dark:text-zinc-400';
  return (
    <div className={`${box} ${tone}`}>
      <span aria-hidden="true">{s ? '🔥' : '·'}</span>
      <b aria-hidden="true" className="font-serif text-3xl leading-none">{s}</b>
      <span aria-hidden="true">{unit(s)}</span>
      <span className="sr-only">Sequência atual: {s} {unit(s)}. Recorde: {best}.</span>
      <small aria-hidden="true" className="mt-1 text-xs">Recorde: {best}</small>
    </div>
  );
}
