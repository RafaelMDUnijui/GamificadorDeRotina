// "Banco" em memória (mock). Reinicia quando o servidor reinicia.

// devolve a data de n dias atrás no formato 'AAAA-MM-DD'
const dia = (n) => {
  const x = new Date();
  x.setDate(x.getDate() - n);
  return x.toISOString().slice(0, 10);
};

globalThis.__tasks ||= [
  {
    id: '1', name: 'Acordar às 6h30', category: 'Trabalho', frequency: 'daily', target: 1,
    time: '06:30', plan: 'Sem soneca. Água e luz natural.',
    checkins: [dia(1), dia(2), dia(3), dia(4)],
  },
  {
    id: '2', name: 'Treinar violão', category: 'Lazer', frequency: 'weekly', target: 4,
    time: '19:00', plan: 'Seg: escalas. Ter: acordes. Qui: música nova. Sáb: improvisar.',
    checkins: [dia(8), dia(9), dia(10), dia(11), dia(15)],
  },
  {
    id: '3', name: 'Ler um livro', category: 'Estudos', frequency: 'monthly', target: 8,
    time: '21:00', plan: '', checkins: [],
  },
];

export const db = globalThis.__tasks;