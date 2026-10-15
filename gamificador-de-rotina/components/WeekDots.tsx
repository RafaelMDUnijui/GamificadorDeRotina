'use client';
import { lastDays, type StreakTask } from '@/lib/streak';
import { useToday } from '@/lib/use-today';
import { CheckIcon } from './Icon';

// Mini-calendário dos últimos 7 dias. Uso: <WeekDots task={task} />
// Não depende só de cor: feito = círculo cheio com check; não feito = círculo vazio.
export default function WeekDots({ task }: { task: StreakTask }) {
  const now = useToday();
  if (!now) return <div className="weekdots-ph" aria-hidden="true" />;

  const days = lastDays(task, 7, now);
  return (
    <ul aria-label="Check-ins dos últimos 7 dias" className="weekdots">
      {days.map((d) => (
        <li key={d.date} className={`wd ${d.isToday ? 'today' : ''}`}>
          <span aria-hidden="true" className={`wd-dot ${d.done ? 'is-done' : ''}`}>
            {d.done && <CheckIcon size={14} />}
          </span>
          <span aria-hidden="true" className="wd-label">
            {d.label}
          </span>
          <span className="sr-only">{d.isToday ? 'hoje' : d.label}: {d.done ? 'feito' : 'não feito'}</span>
        </li>
      ))}
    </ul>
  );
}
