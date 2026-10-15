// Testes do cálculo de streak. Rodar com: npx tsx lib/streak.test.ts
// Usa só o módulo nativo node:assert (sem dependências) e fixa a data de "hoje"
// passando o parâmetro opcional "now", para o resultado não mudar com o dia da execução.
import assert from 'node:assert/strict';
import { streak, bestStreak, progress, weekDays, iso } from './streak';
import type { Frequency, StreakTask } from './streak';

const NOW = '2026-10-14'; // quarta-feira; semana atual = seg 12/10 a dom 18/10

// data = NOW deslocada em n dias (n positivo = passado)
const ago = (n: number, base: string = NOW): string => {
  const d = new Date(base + 'T12:00:00');
  d.setDate(d.getDate() - n);
  return iso(d);
};
const task = (frequency: Frequency, target: number, checkins: string[]): StreakTask => ({ frequency, target, checkins });

let passed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ok   ${name}`); }
  catch (e) { console.error(`  FALHOU ${name}\n         ${(e as Error).message}`); process.exitCode = 1; }
}

console.log('Diário');
test('sem check-ins: streak 0', () => {
  assert.equal(streak(task('daily', 1, []), NOW), 0);
});
test('hoje + 2 dias anteriores seguidos: streak 3', () => {
  assert.equal(streak(task('daily', 1, [ago(0), ago(1), ago(2)]), NOW), 3);
});
test('período atual incompleto não quebra: ontem e anteontem feitos, hoje não = 2', () => {
  assert.equal(streak(task('daily', 1, [ago(1), ago(2)]), NOW), 2);
});
test('streak quebrado: falhou ontem, então streak 0 mesmo com dias antigos', () => {
  assert.equal(streak(task('daily', 1, [ago(2), ago(3), ago(4)]), NOW), 0);
});
test('buraco no meio interrompe a contagem: hoje, ontem, (falta -2), -3 = 2', () => {
  assert.equal(streak(task('daily', 1, [ago(0), ago(1), ago(3)]), NOW), 2);
});

console.log('Semanal (semana de segunda a domingo)');
test('meta 2x: três semanas seguidas cumpridas = 3', () => {
  const c = ['2026-10-12', '2026-10-13', '2026-10-05', '2026-10-06', '2026-09-28', '2026-09-29'];
  assert.equal(streak(task('weekly', 2, c), NOW), 3);
});
test('semana atual incompleta (1/2) não quebra: semanas anteriores cumpridas = 2', () => {
  const c = ['2026-10-12', '2026-10-05', '2026-10-06', '2026-09-28', '2026-09-29'];
  assert.equal(streak(task('weekly', 2, c), NOW), 2);
});
test('semana passada incompleta quebra a sequência: só a semana atual conta = 1', () => {
  const c = ['2026-10-12', '2026-10-13', '2026-10-05', '2026-09-28', '2026-09-29'];
  assert.equal(streak(task('weekly', 2, c), NOW), 1); // só a semana atual (já cumprida)
});
test('domingo pertence à semana anterior e segunda à seguinte', () => {
  // dom 11/10 conta para a semana 05-11/10; seg 12/10 conta para a semana atual
  const t = task('weekly', 1, ['2026-10-11']);
  assert.equal(progress(t, NOW), 0);
  assert.equal(streak(t, NOW), 1); // semana passada cumprida; atual ainda não
  assert.equal(progress(task('weekly', 1, ['2026-10-12']), NOW), 1);
});

console.log('Mensal');
test('meta 3x: mês atual incompleto, dois meses anteriores cumpridos = 2', () => {
  const c = ['2026-10-02', '2026-09-01', '2026-09-10', '2026-09-20', '2026-08-01', '2026-08-02', '2026-08-03'];
  assert.equal(streak(task('monthly', 3, c), NOW), 2);
});
test('mês atual cumprido também soma = 3', () => {
  const c = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-09-01', '2026-09-10', '2026-09-20', '2026-08-01', '2026-08-02', '2026-08-03'];
  assert.equal(streak(task('monthly', 3, c), NOW), 3);
});
test('virada de ano: janeiro/2027 conta dezembro e novembro de 2026', () => {
  const c = ['2026-12-05', '2026-12-06', '2026-11-05', '2026-11-06'];
  assert.equal(streak(task('monthly', 2, c), '2027-01-15'), 2);
});

console.log('Progresso');
test('progress conta só check-ins do período atual', () => {
  assert.equal(progress(task('daily', 1, [ago(0), ago(1)]), NOW), 1);
  assert.equal(progress(task('weekly', 4, ['2026-10-12', '2026-10-13', '2026-10-06']), NOW), 2);
});

console.log('Recorde (bestStreak)');
test('sem check-ins: recorde 0', () => {
  assert.equal(bestStreak(task('daily', 1, []), NOW), 0);
});
test('recorde antigo maior que o streak atual', () => {
  // atual = 2 (ontem e anteontem); recorde passado = 5 dias seguidos (de -10 a -6)
  const c = [ago(1), ago(2), ago(6), ago(7), ago(8), ago(9), ago(10)];
  const t = task('daily', 1, c);
  assert.equal(streak(t, NOW), 2);
  assert.equal(bestStreak(t, NOW), 5);
});
test('recorde nunca é menor que o streak atual', () => {
  const t = task('daily', 1, [ago(0), ago(1), ago(2), ago(3)]);
  assert.equal(bestStreak(t, NOW), 4);
});
test('com duas sequências no histórico, escolhe a maior', () => {
  const t = task('daily', 1, [ago(20), ago(21), ago(22), ago(10), ago(11)]);
  assert.equal(bestStreak(t, NOW), 3);
});
test('recorde semanal', () => {
  // meta 1x por semana: semanas de 17/8, 24/8 e 31/8 cumpridas, 7/9 não, 14/9 cumprida
  const c = ['2026-08-17', '2026-08-25', '2026-09-02', '2026-09-15'];
  assert.equal(bestStreak(task('weekly', 1, c), NOW), 3);
});

console.log('Semana atual (WeekDots)');
test('devolve domingo a sábado e destaca hoje na posição do dia da semana', () => {
  const d = weekDays(task('daily', 1, []), NOW);
  assert.equal(d.length, 7);
  assert.deepEqual(d.map((day) => day.label), ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']);
  assert.equal(d[3].date, NOW);
  assert.equal(d[3].isToday, true);
  assert.equal(d[0].date, '2026-10-11');
  assert.equal(d[6].date, '2026-10-17');
});
test('marca corretamente os dias com check-in', () => {
  const d = weekDays(task('daily', 1, [NOW, '2026-10-11']), NOW);
  assert.deepEqual(d.map((x) => x.done), [true, false, false, true, false, false, false]);
});

console.log(`\n${passed} testes passaram${process.exitCode ? ', mas houve falhas.' : '.'}`);
