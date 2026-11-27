import test from 'node:test';
import assert from 'node:assert/strict';

// Testes unitários para regras e FSM do jogo
test('GameStateManager - Inicialização e fluxo padrão', async () => {
  // Simular carregamento do content e state
  const { GameStateManager } = await import('../src/game/state.ts');
  const mgr = new GameStateManager();
  const s = mgr.getState();

  assert.equal(s.mode, 'mestre');
  assert.equal(s.currentStepIndex, 1, 'Inicia na Etapa 2 de 4 conforme mockup');
  assert.equal(s.sequence.length, 4);

  const target = mgr.getCurrentTarget();
  assert.ok(target);
  assert.equal(target.id, 'sino_azul');
  assert.equal(target.command, 'Toque no sino azul');
});

test('GameStateManager - Conclusão de etapa e progressão', async () => {
  const { GameStateManager } = await import('../src/game/state.ts');
  const mgr = new GameStateManager();

  // Testar proximidade com sino_azul [14.0, 3.2, -6.0]
  const reached = mgr.checkProximity([14.0, 3.2, -6.0]);
  assert.ok(reached, 'Deve registrar chegada ao Sino Azul');

  const s = mgr.getState();
  assert.equal(s.currentStepIndex, 2, 'Deve avançar para Etapa 3 (Tambor)');
  assert.equal(mgr.getCurrentTarget()?.id, 'tambor');
});

test('GameStateManager - Modo Minha Vez de Propor', async () => {
  const { GameStateManager } = await import('../src/game/state.ts');
  const mgr = new GameStateManager();

  mgr.setCustomSequence(['tambor', 'roda_dagua', 'cabana']);
  const s = mgr.getState();

  assert.equal(s.mode, 'propor');
  assert.equal(s.sequence.length, 3);
  assert.equal(s.currentStepIndex, 0);
  assert.equal(mgr.getCurrentTarget()?.id, 'tambor');
});

test('GameStateManager - Retorno a ponto seguro sem penalidade', async () => {
  const { GameStateManager } = await import('../src/game/state.ts');
  const mgr = new GameStateManager();

  const checkpoint = mgr.returnToSafeCheckpoint();
  assert.ok(Array.isArray(checkpoint));
  assert.equal(mgr.getState().metrics.timesFallenSafely, 1);
  // Não zera passos completados
  assert.ok(mgr.getState().metrics.completedStepsCount >= 1);
});
