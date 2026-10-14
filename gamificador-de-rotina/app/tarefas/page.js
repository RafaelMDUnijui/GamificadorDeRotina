'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';     
import TaskCard from '@/components/TaskCard';
import Modal from '@/components/Modal';
import Header from '@/components/Header';        
import { api } from '@/lib/api';
import { today } from '@/lib/streak';
import { getSession, logout } from '@/lib/auth';   

export default function Tarefas() {
  const router = useRouter();                       
  const [user, setUser] = useState(null);          // dados de quem está logado
  const [tasks, setTasks] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [freq, setFreq] = useState('all');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [toDelete, setToDelete] = useState(null);  //  tarefa que o modal vai excluir

  const load = () => {
    setError('');
    api.list().then(setTasks).catch((e) => setError(e.message));
  };

  // só carrega as tarefas se houver sessão; senão volta para o login
  useEffect(() => {
    const s = getSession();
    if (!s) return router.replace('/');
    setUser(s);
    load();
  }, []);

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

  // exclui de verdade (só chamada pelo botão do modal)
  async function remove() {
    try {
      await api.remove(toDelete.id);
      setTasks((lista) => lista.filter((x) => x.id !== toDelete.id));
      avisar('Tarefa excluída.');
    } catch (e) {
      avisar(e.message);
    }
    setToDelete(null);   // fecha o modal
  }

  return (
    <div className="wrap">
      {/* cabeçalho fixo no topo */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 5, background: 'var(--bg)', padding: '0 16px' }}>
        <Header
          name={user?.name || user?.email}
          onLogout={() => { logout(); router.push('/'); }}
        />
      </div>

      <main style={{ paddingTop: 72 }}>
        <div className="actions" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Minhas tarefas</h1>
            <p style={{ color: '#aaa' }}>Acompanhe suas sequências</p>
          </div>
          <div className="actions">
            <button className="btn ghost" onClick={load}>🔄</button>
            <Link className="btn" href="/tarefas/nova" tabIndex={2} style={{ outline: 'none' }}>Nova tarefa</Link>
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
            <TaskCard key={t.id} task={t} busy={busy} onToggle={toggle} onDelete={setToDelete} />
          ))}
        </ul>
      </main>

      {/* modal de confirmação */}
      <Modal open={!!toDelete} title="Excluir tarefa?" onClose={() => setToDelete(null)}>
        <span onClick={() => setToDelete(null)} style={{ float: 'right', cursor: 'pointer' }}>✕</span>
        <p style={{ color: '#999' }}>"{toDelete?.name}" e a sequência dela serão apagadas.</p>
        <div className="actions" style={{ marginTop: 16 }}>
          <button className="btn" style={{ background: '#e57373', borderColor: '#e57373', color: '#fff' }} onClick={remove}>
            Excluir
          </button>
          <button className="btn ghost" onClick={() => setToDelete(null)}>Cancelar</button>
        </div>
      </Modal>

      {/* aviso rápido */}
      {toast && (
        <div className="toast" style={{ background: '#888', color: '#fff' }}>
          {toast}
        </div>
      )}
    </div>
  );
}