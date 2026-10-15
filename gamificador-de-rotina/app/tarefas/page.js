'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';     
import TaskCard from '@/components/TaskCard';
import Modal from '@/components/Modal';
import Header from '@/components/Header';
import { RefreshIcon, PlusIcon } from '@/components/Icon';
import { api } from '@/lib/api';
import { today } from '@/lib/streak';
import { getSession, logout } from '@/lib/auth';
import { useSession } from '@/lib/use-session';  

export default function Tarefas() {
  const router = useRouter();                       
  const user = useSession();                       // dados de quem está logado
  const [tasks, setTasks] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [freq, setFreq] = useState('all');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [toDelete, setToDelete] = useState(null);  //  tarefa que o modal vai excluir

  // busca as tarefas na API (usada na carga inicial)
  const load = useCallback(() => {
    api.list().then(setTasks).catch((e) => setError(e.message));
  }, []);

  // recarga manual (botão 🔄 e "Tentar de novo"): limpa o erro antes de buscar
  const retry = () => {
    setError('');
    load();
  };

  // só carrega as tarefas se houver sessão; senão volta para o login
  useEffect(() => {
    if (!getSession()) {
      router.replace('/');
      return;
    }
    load();
  }, [router, load]);

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
    <>
      {/* cabeçalho fixo no topo (largura total) */}
      <Header
        nomeUsuario={user?.name || user?.email || ''}
        onLogout={() => { logout(); router.push('/'); }}
      />

      <div className="wrap">
      <div>
        <div className="pagehead">
          <div>
            <h1>Minhas tarefas</h1>
            <p className="sub">Acompanhe suas sequências</p>
          </div>
          <div className="actions">
            <button className="btn ghost icon" onClick={retry} aria-label="Atualizar lista">
              <RefreshIcon size={18} />
            </button>
            <Link className="btn" href="/tarefas/nova" tabIndex={2}>
              <PlusIcon size={18} /> Nova tarefa
            </Link>
          </div>
        </div>

        {/*busca e filtro */}
        <div className="toolbar">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar tarefa"
            aria-label="Buscar tarefa"
          />
          {q && <button className="btn ghost" onClick={() => setQ('')}>✕</button>}
          <label>Frequência</label>
          <select
            value={freq}
            onChange={(e) => setFreq(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="daily">Diárias</option>
            <option value="weekly">Semanais</option>
            <option value="monthly">Mensais</option>
          </select>
        </div>

        {error && (
          <div className="alert">
            {error} <div className="btn ghost" onClick={retry}>Tentar de novo</div>
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
      </div>

      {/* modal de confirmação */}
      <Modal open={!!toDelete} title="Excluir tarefa?" onClose={() => setToDelete(null)}>
        <span onClick={() => setToDelete(null)} style={{ float: 'right', cursor: 'pointer' }}>✕</span>
        <p className="sub">&quot;{toDelete?.name}&quot; e a sequência dela serão apagadas.</p>
        <div className="actions" style={{ marginTop: 16 }}>
          <button className="btn danger" onClick={remove}>
            Excluir
          </button>
          <button className="btn ghost" onClick={() => setToDelete(null)}>Cancelar</button>
        </div>
      </Modal>

      {/* aviso rápido */}
      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
      </div>
    </>
  );
}