'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TaskForm from '@/components/TaskForm';
import { api } from '@/lib/api';
import { getSession } from '@/lib/auth';

// /tarefas/nova cria; /tarefas/<id> edita
export default function Editar({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === 'nova';
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getSession()) return router.replace('/');
    if (!isNew) api.get(id).then(setTask).catch((e) => setError(e.message));
  }, [id]);

  return (
    <div className="wrap">
      <Link href="/tarefas" className="btn ghost">← Voltar</Link>
      <div style={{ marginTop: 16 }}>
        <h1 style={{ marginBottom: 16 }}>{isNew ? 'Nova tarefa' : 'Editar tarefa'}</h1>
        {error && <div className="alert" role="alert">{error}</div>}
        {!isNew && !task && !error && <p role="status">Carregando…</p>}
        {(isNew || task) && <TaskForm task={task} />}
      </div>
    </div>
  );
}