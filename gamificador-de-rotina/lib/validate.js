export const CATEGORIES = ['Saúde', 'Trabalho', 'Estudos', 'Lazer', 'Casa'];
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
  if ((b.plan || '').length > 300) e.plan = 'O planejamento aceita até 300 caracteres.';
  return e;
}