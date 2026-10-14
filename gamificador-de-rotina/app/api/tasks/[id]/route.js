import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateTask } from '@/lib/validate';

// Procura a tarefa pelo id da URL. No Next 15, params é uma Promise, por isso o await.
const find = async (params) => {
  const { id } = await params;
  return db.find((t) => t.id === id);
};
const notFound = () => NextResponse.json({ message: 'Tarefa não encontrada.' }, { status: 404 });

// GET /api/tasks/:id: devolve uma tarefa
export async function GET(_, { params }) {
  const t = await find(params);
  return t ? NextResponse.json(t) : notFound();
}

// PUT /api/tasks/:id: edita os dados da tarefa
export async function PUT(req, { params }) {
  const t = await find(params);
  if (!t) return notFound();
  const body = await req.json().catch(() => ({}));
  const errors = validateTask(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ message: 'Dados inválidos.', errors }, { status: 400 });
  }
  Object.assign(t, { ...body, target: Number(body.target), id: t.id, checkins: t.checkins });
  return NextResponse.json(t);
}

// PATCH /api/tasks/:id: liga/desliga o check-in de uma data { date: 'AAAA-MM-DD' }
export async function PATCH(req, { params }) {
  const t = await find(params);
  if (!t) return notFound();
  const { date } = await req.json().catch(() => ({}));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) {
    return NextResponse.json({ message: 'Data inválida.' }, { status: 400 });
  }
  t.checkins = t.checkins.includes(date) ? t.checkins.filter((c) => c !== date) : [...t.checkins, date];
  return NextResponse.json(t);
}

// DELETE /api/tasks/:id: remove a tarefa
export async function DELETE(_, { params }) {
  const t = await find(params);
  if (!t) return notFound();
  db.splice(db.indexOf(t), 1);
  return new NextResponse(null, { status: 204 });
}