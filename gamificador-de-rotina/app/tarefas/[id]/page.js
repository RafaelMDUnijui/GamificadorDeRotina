'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TaskForm from '@/components/TaskForm';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { getSession } from '@/lib/auth';

// /tarefas/nova cria; /tarefas/<id> edita
export default function Editar({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === 'nova';
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false); // há alterações não salvas?
  const [confirmLeave, setConfirmLeave] = useState(false);

  // sair do formulário: se houver alterações, abre o modal antes
  const tryLeave = () => (dirty ? setConfirmLeave(true) : router.push('/tarefas'));

  // fechar a aba / recarregar com alterações: o navegador mostra o aviso dele
  useEffect(() => {
    if (!dirty) return;
    const aviso = (e) => e.preventDefault();
    window.addEventListener('beforeunload', aviso);
    return () => window.removeEventListener('beforeunload', aviso);
  }, [dirty]);

  useEffect(() => {
    if (!getSession()) {
      router.replace('/');
      return;
    }
    if (!isNew) api.get(id).then(setTask).catch((e) => setError(e.message));
  }, [id]);

  return (
    <div className="wrap">
      <Link
        href="/tarefas"
        className="btn ghost"
        onClick={(e) => {
          if (dirty) {
            e.preventDefault();
            setConfirmLeave(true);
          }
        }}
      >
        ← Voltar
      </Link>
      <div style={{ marginTop: 16 }}>
        <h1 style={{ marginBottom: 16 }}>{isNew ? 'Nova tarefa' : 'Editar tarefa'}</h1>
        {error && <div className="alert" role="alert">{error}</div>}
        {!isNew && !task && !error && <p role="status">Carregando…</p>}
        {(isNew || task) && <TaskForm task={task} onDirtyChange={setDirty} onCancel={tryLeave} />}
      </div>

      <Modal open={confirmLeave} title="Sair sem salvar?" onClose={() => setConfirmLeave(false)}>
        <p>Você tem alterações que ainda não foram salvas. Se sair agora, elas serão perdidas.</p>
        <div className="actions" style={{ marginTop: 16 }}>
          <button className="btn danger" onClick={() => router.push('/tarefas')}>Sair sem salvar</button>
          <button className="btn ghost" onClick={() => setConfirmLeave(false)}>Continuar editando</button>
        </div>
      </Modal>
    </div>
  );
}