'use client';
import { weekDays, type StreakTask } from '@/lib/streak';
import { useToday } from '@/lib/use-today';
import { CheckIcon } from './Icon';

// Mini-calendário da semana atual, de domingo a sábado.
// Não depende só de cor: feito = círculo cheio com check; não feito = círculo vazio.
export default function WeekDots({ task }: { task: StreakTask }) {
  const now = useToday();
  if (!now) return <div className="weekdots-ph" aria-hidden="true" />;

  const days = weekDays(task, now);
  return (
    <ul aria-label="Check-ins desta semana" className="weekdots">
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
