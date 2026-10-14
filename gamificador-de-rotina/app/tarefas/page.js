'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import TaskCard from '@/components/TaskCard';
import { api } from '@/lib/api';
import { today } from '@/lib/streak';        // 

export default function Tarefas() {
  const [tasks, setTasks] = useState(null);   // null = ainda carregando
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [freq, setFreq] = useState('all');
  const [busy, setBusy] = useState(false);    // requisição em andamento
  const [toast, setToast] = useState('');     // mensagem rápida

  const load = () => {
    setError('');
    api.list().then(setTasks).catch((e) => setError(e.message));
  };
  useEffect(() => { load(); }, []);

  // NÃO é state, é calculado a cada desenho a partir de tasks, q e freq
  const shown = (tasks || []).filter(
    (t) => (freq === 'all' || t.frequency === freq) && t.name.toLowerCase().includes(q.toLowerCase())
  );

  // mostra uma mensagem e some depois de 2,5 s
  const avisar = (m) => {
    setToast(m);
    setTimeout(() => setToast(''), 2500);
  };

  // liga/desliga o check-in de hoje
  async function toggle(t) {
    setBusy(true);
    try {
      const atualizada = await api.toggle(t.id, today());
      setTasks((lista) => lista.map((x) => (x.id === atualizada.id ? atualizada : x)));
      avisar('Check-in atualizado!');
    } catch (e) {
      avisar(e.message);
    }
    setBusy(false);
  }

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

        {/*busca e filtro */}
        <div className="toolbar">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar tarefa"
            style={{ flex: 1, minWidth: 160, minHeight: 44, padding: '8px 10px', border: '1px solid #ddd', borderRadius: 8 }}
          />
          {q && <button className="btn ghost" onClick={() => setQ('')}>✕</button>}
          <label>Frequência</label>
          <select
            value={freq}
            onChange={(e) => setFreq(e.target.value)}
            style={{ minHeight: 44, padding: '8px 10px', border: '1px solid #ddd', borderRadius: 8 }}
          >
            <option value="all">Todas</option>
            <option value="daily">Diárias</option>
            <option value="weekly">Semanais</option>
            <option value="monthly">Mensais</option>
          </select>
        </div>

        {error && (
          <div className="alert">
            {error} <div className="btn ghost" onClick={load}>Tentar de novo</div>
          </div>
        )}
        {!tasks && !error && <p>Carregando tarefas…</p>}
        {tasks && !shown.length && (
          <div className="card empty">
            <p>{tasks.length ? 'Nenhuma tarefa encontrada com esse filtro.' : 'Você ainda não tem tarefas.'}</p>
            {!tasks.length && <Link href="/tarefas/nova">Clique aqui</Link>}
          </div>
        )}
        <ul className="list">
          {shown.map((t) => (
            <TaskCard key={t.id} task={t} busy={busy} onToggle={toggle} onDelete={() => {}} />
          ))}
        </ul>
      </main>

      {/* aviso rápido */}
      {toast && (
        <div className="toast" style={{ background: '#888', color: '#fff' }}>
          {toast}
        </div>
      )}
    </div>
  );
}