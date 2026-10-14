import { db } from './db';

// Nome repetido? Ignora maiúsculas/minúsculas e espaços nas pontas.
// ignoreId evita que a própria tarefa seja considerada duplicada ao editar (PUT).
export const nomeDuplicado = (name, ignoreId) => {
  const alvo = String(name).trim().toLowerCase();
  return db.some((t) => t.id !== ignoreId && t.name.trim().toLowerCase() === alvo);
};

// tira acentos e põe em minúsculas: "Violão" e "violao" viram o mesmo texto
const norm = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export const FREQUENCIES = ['daily', 'weekly', 'monthly'];

// Filtra a lista por ?frequency=weekly&q=violão&category=Lazer (todos opcionais)
export function filterTasks(list, { frequency, q, category } = {}) {
  return list.filter(
    (t) =>
      (!frequency || t.frequency === frequency) &&
      (!category || t.category === category) &&
      (!q || norm(t.name).includes(norm(q.trim())))
  );
}