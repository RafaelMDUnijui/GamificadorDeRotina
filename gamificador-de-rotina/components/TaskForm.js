'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Field from './Field';
import { api } from '@/lib/api';
import { CATEGORIES, validateTask } from '@/lib/validate';

const EMPTY = { name: '', category: '', frequency: 'daily', target: 1, time: '', plan: '' };

// Mesmo formulário para criar (task = null) e editar
export default function TaskForm({ task }) {
  const router = useRouter();
  const [v, setV] = useState(task || EMPTY);       // valores dos campos
  const [errors, setErrors] = useState({});         // erros por campo
  const [apiError, setApiError] = useState('');     // erro geral vindo da API
  const [saving, setSaving] = useState(false);      // está enviando?

  // set('name') devolve a função que atualiza só o campo 'name'
  const set = (k) => (e) => {
    const val = e.target.value;
    setV((o) => ({ ...o, [k]: val, ...(k === 'frequency' && val === 'daily' ? { target: 1 } : {}) }));
  };

  async function submit(e) {
    e.preventDefault();
    setApiError('');
    const errs = validateTask(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus(); // foca no primeiro campo com erro
      return;
    }
    setSaving(true);
    try {
      task ? await api.update(task.id, v) : await api.create(v);
      router.push('/tarefas');
    } catch (err) {
      setErrors(err.errors || {});
      setApiError(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="card">
      {apiError && <div className="alert" role="alert">{apiError}</div>}
      <Field id="name" label="Nome da tarefa" value={v.name} onChange={set('name')} error={errors.name} required placeholder="Ex.: Treinar violão" />
      <div className="grid2">
        <Field id="category" label="Categoria" as="select" value={v.category} onChange={set('category')} error={errors.category} required>
          <option value="">Selecione…</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </Field>
        <Field id="frequency" label="Frequência" as="select" value={v.frequency} onChange={set('frequency')} error={errors.frequency} required>
          <option value="daily">Todo dia</option>
          <option value="weekly">Toda semana</option>
          <option value="monthly">Todo mês</option>
        </Field>
        <Field id="target" label="Quantas vezes no período?" type="number" min="1" value={v.target} onChange={set('target')} error={errors.target} required
          disabled={v.frequency === 'daily'} hint="Ex.: 4 vezes por semana." />
        <Field id="time" label="Horário do lembrete" type="time" value={v.time} onChange={set('time')} error={errors.time} required />
      </div>
      <Field id="plan" label="Planejamento (opcional)" as="textarea" rows={3} value={v.plan} onChange={set('plan')} error={errors.plan} hint="O que fazer em cada dia. Máx. 300 caracteres." />
      <div className="actions">
        <button className="btn" disabled={saving}>{saving ? 'Salvando…' : task ? 'Salvar alterações' : 'Criar tarefa'}</button>
        <button type="button" className="btn ghost" onClick={() => router.push('/tarefas')}>Cancelar</button>
      </div>
    </form>
  );
}