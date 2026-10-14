import Link from 'next/link';
import StreakBadge from './StreakBadge';
import { progress, today, UNIT, PERIOD } from '@/lib/streak';

export default function TaskCard({ task, onToggle, onDelete, busy }) {
  const p = progress(task);
  const cumprida = p >= task.target;
  const feitaHoje = task.checkins.includes(today());

  return (
    <li className="card task">
      <StreakBadge task={task} />
      <div>
        <h2>{task.name}</h2>
        <p className="meta">{task.category} · lembrete às {task.time} · meta: {task.target}x por {UNIT[task.frequency]}</p>
        <div className="bar" role="progressbar" aria-label={`Progresso ${PERIOD[task.frequency]}`}
             aria-valuemin={0} aria-valuemax={task.target} aria-valuenow={Math.min(p, task.target)}>
          <i style={{ width: `${Math.min(100, (p / task.target) * 100)}%` }} />
        </div>
        <p className="hint">{p}/{task.target} {PERIOD[task.frequency]}{task.plan && <> — {task.plan}</>}</p>
        <p className={cumprida ? 'done' : 'q'}>
          {cumprida ? 'Meta cumprida! 🎉' : `Você fez "${task.name}" hoje?`}
        </p>
        <div className="actions">
          <button className={`btn ${feitaHoje ? 'ghost' : ''}`} onClick={() => onToggle(task)} disabled={busy} aria-pressed={feitaHoje}>
            {feitaHoje ? 'Desfazer de hoje' : 'Sim, fiz hoje'}
          </button>
          <Link className="btn ghost" href={`/tarefas/${task.id}`} aria-label={`Editar ${task.name}`}>Editar</Link>
          <button className="btn ghost" onClick={() => onDelete(task)} aria-label={`Excluir ${task.name}`}>Excluir</button>
        </div>
      </div>
    </li>
  );
}