import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateTask } from '@/lib/validate';
import { nomeDuplicado } from '@/lib/tasks';

// GET /api/tasks: devolve a lista de tarefas
export async function GET() {
  return NextResponse.json(db);
}

// POST /api/tasks: cria uma tarefa nova
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const errors = validateTask(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ message: 'Dados inválidos.', errors }, { status: 400 });
  }
  if (nomeDuplicado(body.name)) {
    return NextResponse.json({ message: 'Já existe uma tarefa com esse nome.', errors: { name: 'Já existe uma tarefa com esse nome.' } }, { status: 409 });
  }
  const task = { ...body, target: Number(body.target), id: crypto.randomUUID(), checkins: [] };
  db.push(task);
  return NextResponse.json(task, { status: 201 });
}