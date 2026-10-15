export const CATEGORIES = ['Saúde', 'Trabalho', 'Estudos', 'Lazer', 'Casa'];
export const PLAN_MAX = 300;
export const WEEKDAYS = [
  { key: 'sun', label: 'Dom' }, { key: 'mon', label: 'Seg' }, { key: 'tue', label: 'Ter' },
  { key: 'wed', label: 'Qua' }, { key: 'thu', label: 'Qui' }, { key: 'fri', label: 'Sex' }, { key: 'sat', label: 'Sáb' },
];
const DAY_KEYS = WEEKDAYS.map((d) => d.key);
const MAX = { daily: 1, weekly: 7, monthly: 31 };

// usado no cliente (formulário) e no servidor (API)
// Recebe os dados e devolve { campo: 'mensagem' }. Objeto vazio = tudo certo.
export function validateTask(b) {
  const e = {};
  if (!b.name || b.name.trim().length < 3) e.name = 'Informe um nome com pelo menos 3 caracteres.';
  if (!CATEGORIES.includes(b.category)) e.category = 'Escolha uma categoria.';
  if (!MAX[b.frequency]) e.frequency = 'Escolha a frequência.';
  const t = Number(b.target);
  if (!Number.isInteger(t) || t < 1) e.target = 'Informe quantas vezes (mínimo 1).';
  else if (MAX[b.frequency] && t > MAX[b.frequency]) e.target = `O máximo para esta frequência é ${MAX[b.frequency]}.`;
  if (!/^\d{2}:\d{2}$/.test(b.time || '')) e.time = 'Informe o horário do lembrete.';
    if ((b.plan || '').length > PLAN_MAX) e.plan = `O planejamento aceita até ${PLAN_MAX} caracteres.`;
      if (b.days !== undefined && (!Array.isArray(b.days) || b.days.some((d) => !DAY_KEYS.includes(d)))) e.days = 'Dias da semana inválidos.';
  return e;
}


// devolve só dias válidos, sem repetir e na ordem da semana (dom → sáb)
export const cleanDays = (days) => DAY_KEYS.filter((k) => Array.isArray(days) && days.includes(k));