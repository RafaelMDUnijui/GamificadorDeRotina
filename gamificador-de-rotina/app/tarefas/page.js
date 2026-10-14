'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import TaskCard from '@/components/TaskCard';
import { api } from '@/lib/api';

export default function Tarefas() {
  const [tasks, setTasks] = useState(null);   // null = ainda carregando
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    api.list().then(setTasks).catch((e) => setError(e.message));
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="wrap">
      <main>
        <div className="actions" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Minhas tarefas</h1>
            <p style={{ color: '#aaa' }}>Acompanhe suas sequências</p>
          </div>
          <div className="actions">
            <button className="btn ghost" onClick={load}>🔄</button>
            <Link className="btn" href="/tarefas/nova" style={{ outline: 'none' }}>Nova tarefa</Link>
          </div>
        </div>

        {error && (
          <div className="alert">
            {error} <div className="btn ghost" onClick={load}>Tentar de novo</div>
          </div>
        )}
        {!tasks && !error && <p>Carregando tarefas…</p>}
        {tasks && !tasks.length && (
          <div className="card empty">
            <p>Você ainda não tem tarefas.</p>
            <Link href="/tarefas/nova">Clique aqui</Link>
          </div>
        )}
        <ul className="list">
          {(tasks || []).map((t) => (
            <TaskCard key={t.id} task={t} onToggle={() => {}} onDelete={() => {}} />
          ))}
        </ul>
      </main>
    </div>
  );
}