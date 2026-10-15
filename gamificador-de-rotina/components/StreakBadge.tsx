'use client';
import { bestStreak, streak, UNIT, UNIT_PL, type StreakTask } from '@/lib/streak';
import { useToday } from '@/lib/use-today';
import { FlameIcon } from './Icon';

// Selo de sequência: streak atual e recorde. Uso: <StreakBadge task={task} />
export default function StreakBadge({ task }: { task: StreakTask }) {
  const now = useToday();
  if (!now) return <div className="streak-box" aria-hidden="true" />;

  const s = streak(task, now);
  const best = bestStreak(task, now);
  const unit = (n: number) => (n === 1 ? UNIT[task.frequency] : UNIT_PL[task.frequency]);
  return (
    <div className={`streak-box ${s ? 'on' : 'off'}`}>
      <FlameIcon size={22} />
      <b aria-hidden="true" className="streak-n">{s}</b>
      <span aria-hidden="true" className="streak-u">{unit(s)}</span>
      <span className="sr-only">Sequência atual: {s} {unit(s)}. Recorde: {best}.</span>
      <small aria-hidden="true" className="streak-best">Recorde: {best}</small>
    </div>
  );
}
