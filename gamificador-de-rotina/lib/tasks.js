import { db } from './db';

// Nome repetido? Ignora maiúsculas/minúsculas e espaços nas pontas.
// ignoreId evita que a própria tarefa seja considerada duplicada ao editar (PUT).
export const nomeDuplicado = (name, ignoreId) => {
  const alvo = String(name).trim().toLowerCase();
  return db.some((t) => t.id !== ignoreId && t.name.trim().toLowerCase() === alvo);
};