'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Field from './Field';
import { api } from '@/lib/api';
import { CATEGORIES, PLAN_MAX, WEEKDAYS, validateTask } from '@/lib/validate';
import styles from './TaskForm.module.css';

const EMPTY = { name: '', category: '', frequency: 'daily', target: 1, time: '', plan: '', days: [] };

// Mesmo formulário para criar (task = null) e editar
// onDirtyChange(bool): avisa a página se há alterações não salvas
// onCancel(): chamado ao clicar em Cancelar (a página decide se pede confirmação)
export default function TaskForm({ task, onDirtyChange, onCancel }) {
  const router = useRouter();
  const [v, setV] = useState({ ...EMPTY, ...task }); // valores dos campos
  const inicial = useRef(JSON.stringify({ ...EMPTY, ...task })); // "foto" do estado inicial
  const [errors, setErrors] = useState({});          // erros por campo
  const [apiError, setApiError] = useState('');      // erro geral vindo da API
  const [saving, setSaving] = useState(false);       // está enviando?

  // set('name') devolve a função que atualiza só o campo 'name'
  const set = (k) => (e) => {
    const val = e.target.value;
    setV((o) => ({ ...o, [k]: val, ...(k === 'frequency' && val === 'daily' ? { target: 1 } : {}) }));
  };

  // a cada mudança, compara com a foto inicial e avisa a página
  useEffect(() => {
    onDirtyChange?.(JSON.stringify(v) !== inicial.current);
  }, [v]);

  // marca ou desmarca um dia da semana
  const toggleDay = (k) =>
    setV((o) => ({ ...o, days: o.days.includes(k) ? o.days.filter((d) => d !== k) : [...o.days, k] }));

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
      const apiErrors = err.errors || {};
      setErrors(apiErrors);
      setApiError(err.message);
      setSaving(false);
      // erro vindo da API (ex.: 409 nome duplicado): leva o foco ao campo
      document.getElementById(Object.keys(apiErrors)[0])?.focus();
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

      <fieldset className={styles.days}>
        <legend>Dias da semana (opcional)</legend>
        <div className={styles.daysList}>
          {WEEKDAYS.map((d) => (
            <label key={d.key} className={styles.day}>
              <input type="checkbox" name="days" value={d.key} checked={v.days.includes(d.key)} onChange={() => toggleDay(d.key)} />
              {d.label}
            </label>
          ))}
        </div>
        {errors.days && <span className="err" role="alert">{errors.days}</span>}
      </fieldset>

      <Field id="plan" label="Planejamento (opcional)" as="textarea" rows={3} value={v.plan} onChange={set('plan')} error={errors.plan} hint={<>O que fazer em cada dia. <span style={v.plan.length > PLAN_MAX ? { color: 'var(--err)', fontWeight: 700 } : undefined}>{v.plan.length}/{PLAN_MAX} caracteres{v.plan.length > PLAN_MAX && ' (limite excedido)'}</span></>} />
      <div className="actions">
        <button className="btn" disabled={saving}>{saving ? 'Salvando…' : task ? 'Salvar alterações' : 'Criar tarefa'}</button>
        <button type="button" className="btn ghost" onClick={() => (onCancel ? onCancel() : router.push('/tarefas'))}>Cancelar</button>
      </div>
    </form>
  );
}