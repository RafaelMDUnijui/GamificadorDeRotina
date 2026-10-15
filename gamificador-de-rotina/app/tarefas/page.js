'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TaskCard from '@/components/TaskCard';
import Modal from '@/components/Modal';
import Header from '@/components/Header';
import Toast from '@/components/Toast';
import { RefreshIcon, PlusIcon } from '@/components/Icon';
import { api } from '@/lib/api';
import { progress, streak, today } from '@/lib/streak';
import { getSession, logout } from '@/lib/auth';
import { useSession } from '@/lib/use-session';

export default function Tarefas() {
  const router = useRouter();
  const user = useSession();
  const [q, setQ] = useState('');
  const [frequency, setFrequency] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const addTaskLink = useRef(null);
  const restoreFocusAfterDelete = useRef(false);
  const toastTimer = useRef(null);
  const requestKey = JSON.stringify([q, frequency, refresh]);
  const [loaded, setLoaded] = useState({ key: '', tasks: null, error: '' });
  const tasks = loaded.key === requestKey ? loaded.tasks : null;
  const error = loaded.key === requestKey ? loaded.error : '';

  useEffect(() => {
    if (!getSession()) {
      router.replace('/');
      return;
    }

    let active = true;
    api.list({ q, frequency })
      .then((result) => {
        if (active) setLoaded({ key: requestKey, tasks: result, error: '' });
      })
      .catch((requestError) => {
        if (active) setLoaded({ key: requestKey, tasks: null, error: requestError.message });
      });

    return () => {
      active = false;
    };
  }, [router, q, frequency, refresh, requestKey]);

  useEffect(() => {
    if (restoreFocusAfterDelete.current) {
      addTaskLink.current?.focus();
      restoreFocusAfterDelete.current = false;
    }
  }, [tasks]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const retry = () => {
    setRefresh((current) => current + 1);
  };

  const avisar = (message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(''), 2500);
  };

  const filteredTasks = tasks || [];
  const completedCount = filteredTasks.filter(
    (task) => progress(task) >= task.target
  ).length;
  const longestStreak = filteredTasks.reduce(
    (longest, task) => Math.max(longest, streak(task)),
    0
  );
  const shown = filteredTasks;

  async function toggle(task) {
    setBusy(true);
    try {
      const updated = await api.toggle(task.id, today());
      setLoaded((current) => current.key === requestKey
        ? { ...current, tasks: current.tasks.map((item) => item.id === updated.id ? updated : item) }
        : current);
      avisar('Check-in atualizado!');
    } catch (actionError) {
      avisar(actionError.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!toDelete) return;
    try {
      await api.remove(toDelete.id);
      setLoaded((current) => current.key === requestKey
        ? { ...current, tasks: current.tasks.filter((task) => task.id !== toDelete.id) }
        : current);
      restoreFocusAfterDelete.current = true;
      avisar('Tarefa excluída.');
    } catch (actionError) {
      avisar(actionError.message);
    } finally {
      setToDelete(null);
    }
  }

  return (
    <>
      <Header
        nomeUsuario={user?.name || user?.email || ''}
        onLogout={() => { logout(); router.push('/'); }}
      />

      <main id="conteudo" className="wrap">
        <div className="pagehead">
          <div>
            <h1>Minhas tarefas</h1>
            <p className="sub">Acompanhe suas sequências</p>
          </div>
          <div className="actions">
            <button type="button" className="btn ghost icon" onClick={retry} aria-label="Atualizar lista">
              <RefreshIcon size={18} />
            </button>
            <Link ref={addTaskLink} className="btn" href="/tarefas/nova">
              <PlusIcon size={18} /> Nova tarefa
            </Link>
          </div>
        </div>

        {tasks && (
          <section className="summary card" aria-label="Resumo das tarefas">
            <p className="summary-item">
              <strong>{tasks.length}</strong>
              <span>{tasks.length === 1 ? 'tarefa encontrada' : 'tarefas encontradas'}</span>
            </p>
            <p className="summary-item">
              <strong>{completedCount}</strong>
              <span>{completedCount === 1 ? 'meta cumprida' : 'metas cumpridas'} no período</span>
            </p>
            <p className="summary-item">
              <strong>{longestStreak}</strong>
              <span>maior sequência</span>
            </p>
          </section>
        )}

        <div className="toolbar">
          <input
            id="busca-tarefa"
            type="search"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Buscar tarefa"
            aria-label="Buscar tarefa"
          />
          {q && (
            <button type="button" className="btn ghost icon" onClick={() => setQ('')} aria-label="Limpar busca">
              ✕
            </button>
          )}
          <label htmlFor="filtro-frequencia">Frequência</label>
          <select
            id="filtro-frequencia"
            value={frequency}
            onChange={(event) => setFrequency(event.target.value)}
          >
            <option value="">Todas</option>
            <option value="daily">Diárias</option>
            <option value="weekly">Semanais</option>
            <option value="monthly">Mensais</option>
          </select>
        </div>

        {tasks && (
          <p className="result-count" role="status" aria-live="polite">
            Mostrando {shown.length} de {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}.
          </p>
        )}

        {error && (
          <div className="alert" role="alert">
            <span>{error}</span>
            <button type="button" className="btn ghost" onClick={retry}>Tentar de novo</button>
          </div>
        )}
        {!tasks && !error && <p role="status" aria-live="polite">Carregando tarefas…</p>}
        {tasks && !shown.length && (
          <div className="card empty">
            <p>{tasks.length ? 'Nenhuma tarefa encontrada com esses filtros.' : 'Você ainda não tem tarefas.'}</p>
            {!tasks.length && <Link href="/tarefas/nova">Criar sua primeira tarefa</Link>}
          </div>
        )}
        <ul className="list">
          {shown.map((task) => (
            <TaskCard key={task.id} task={task} busy={busy} onToggle={toggle} onDelete={setToDelete} />
          ))}
        </ul>
      </main>

      <Modal open={!!toDelete} title="Excluir tarefa?" onClose={() => setToDelete(null)}>
        <button
          type="button"
          className="btn ghost sm modal-close"
          onClick={() => setToDelete(null)}
          aria-label="Fechar confirmação"
        >
          ✕
        </button>
        <p className="sub">&quot;{toDelete?.name}&quot; e a sequência dela serão apagadas.</p>
        <div className="actions" style={{ marginTop: 16 }}>
          <button type="button" className="btn danger" onClick={remove}>
            Excluir
          </button>
          <button type="button" className="btn ghost" onClick={() => setToDelete(null)}>Cancelar</button>
        </div>
      </Modal>

      <Toast message={toast} />
    </>
  );
}
