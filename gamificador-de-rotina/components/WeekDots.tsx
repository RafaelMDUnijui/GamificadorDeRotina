'use client';
import { lastDays, type StreakTask } from '@/lib/streak';
import { useToday } from '@/lib/use-today';

// Mini-calendário dos últimos 7 dias. Uso: <WeekDots task={task} />
// Não depende só de cor: feito = círculo cheio com ✓; não feito = círculo vazio.
export default function WeekDots({ task }: { task: StreakTask }) {
  const now = useToday();
  if (!now) return <div className="mb-2.5 h-[50px]" aria-hidden="true" />;

  const days = lastDays(task, 7, now);
  return (
    <ul aria-label="Check-ins dos últimos 7 dias" className="mb-2.5 flex gap-1.5">
      {days.map((d) => (
        <li key={d.date} className="flex flex-col items-center gap-0.5 text-xs text-zinc-600 dark:text-zinc-400">
          <span
            aria-hidden="true"
            className={`flex size-6 items-center justify-center rounded-full border-2 font-bold leading-none ${
              d.done
                ? 'border-teal-800 bg-teal-800 text-white dark:border-teal-300 dark:bg-teal-300 dark:text-teal-950'
                : 'border-zinc-500'
            }`}
          >
            {d.done ? '✓' : ''}
          </span>
          <span aria-hidden="true" className={d.isToday ? 'font-bold text-zinc-950 underline dark:text-zinc-50' : ''}>
            {d.label}
          </span>
          <span className="sr-only">{d.isToday ? 'hoje' : d.label}: {d.done ? 'feito' : 'não feito'}</span>
        </li>
      ))}
    </ul>
  );
}
