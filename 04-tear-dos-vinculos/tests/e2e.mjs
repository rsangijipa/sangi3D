// Testes de interação automatizados (Playwright) sobre o build estático em dist/.
// Uso: npm run build && node tests/e2e.mjs
// Variáveis: TEAR_PLAYWRIGHT (caminho do pacote playwright), TEAR_ARTIFACTS (pasta de capturas).
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const pwPath = process.env.TEAR_PLAYWRIGHT
  || resolve('../Kit_17_jogos_3D_mockups_e_prompts/08-meteorologia-das-emocoes/node_modules/playwright');
const { chromium } = require(pwPath);
const DIST = resolve('dist');
const OUT = resolve(process.env.TEAR_ARTIFACTS || 'capturas');
await mkdir(OUT, { recursive: true });

// ---------- servidor estático mínimo (registra 404) ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
const notFound = [];
const server = createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = join(DIST, url === '/' ? 'index.html' : url);
  try {
    const s = await stat(file);
    if (!s.isFile()) throw new Error('dir');
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    notFound.push(url);
    res.writeHead(404); res.end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

// Usa o Chromium já instalado quando a versão do pacote não tem binário próprio (TEAR_CHROME sobrepõe).
const localChrome = process.env.TEAR_CHROME
  || [`${process.env.LOCALAPPDATA}/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe`].find((p) => existsSync(p));
const browser = await chromium.launch({ headless: true, executablePath: localChrome, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
const results = [];
const consoleErrors = [];
const sensitiveLeaks = [];

async function check(name, fn) {
  const t0 = Date.now();
  try { await fn(); results.push({ name, status: 'PASS', ms: Date.now() - t0 }); console.log(`PASS  ${name}`); }
  catch (e) { results.push({ name, status: 'FAIL', ms: Date.now() - t0, error: String(e?.message ?? e).slice(0, 400) }); console.log(`FAIL  ${name}\n      ${e?.message ?? e}`); }
}

async function open(viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: Boolean(opts.touch), isMobile: Boolean(opts.touch), acceptDownloads: true });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`${viewport.width}x${viewport.height}: ${m.text()}`); });
  page.on('pageerror', (e) => consoleErrors.push(`${viewport.width}x${viewport.height}: ${e.message}`));
  await page.addInitScript(() => {
    window.__events = [];
    window.addEventListener('tear:event', (e) => window.__events.push(e.detail));
  });
  await page.goto(BASE + `?perf&qualidade=${opts.q ?? process.env.TEAR_Q ?? 'leve'}`);
  page.setDefaultTimeout(120000);
  await page.waitForFunction(() => window.__tear && (window.__tear.world || window.__tear.world === null), null, { timeout: 90000 });
  return { ctx, page };
}

const scene = (page) => page.evaluate(() => JSON.parse(JSON.stringify(window.__tear.store.scene)));
const startMode = (page, mode = 'livre', cfg = null) => page.evaluate(([m, c]) => window.__tear.actions.start(m, c, false), [mode, cfg]);
const settle = (page, ms = 400) => page.waitForTimeout(ms);
const pt = (page, target) => page.evaluate((t) => window.__tear.world.screenPoint(t), target);

async function clickTarget(page, target) {
  const p = await pt(page, target);
  assert.ok(p, `alvo ${target} sem projeção`);
  await page.mouse.click(p.x, p.y);
  await settle(page, 250);
}

// ======================= desktop 1280x720 =======================
{
  const { ctx, page } = await open({ width: 1280, height: 720 });
  await page.screenshot({ path: join(OUT, '01-entrada-1280x720.png') });

  await check('entrada → modo livre e HUD com rótulos do brief', async () => {
    await page.getByRole('button', { name: 'Começar', exact: true }).click();
    await settle(page, 1200);
    for (const label of ['Escolher fio', 'Entrelaçar', 'Tensionar', 'Separar', 'Ver tecido']) {
      assert.ok(await page.getByRole('button', { name: new RegExp(label) }).first().isVisible(), label);
    }
    const ev = await page.evaluate(() => window.__events.map((e) => e.type));
    assert.ok(ev.includes('ready'));
  });

  await check('escolher fio e espessura pela cena e pela doca', async () => {
    await clickTarget(page, 'yarn:telha');
    let s = await scene(page);
    assert.equal(s.selectedYarn, 'telha');
    await page.getByRole('button', { name: 'Fio Mostarda' }).click();
    await page.getByRole('button', { name: 'Grossa', exact: true }).click();
    s = await scene(page);
    assert.equal(s.selectedYarn, 'mostarda');
    assert.equal(s.thickness, 'grossa');
    await page.getByRole('button', { name: 'Média', exact: true }).click();
  });

  await check('cruzamentos seguem a ordem escolhida (teclado + chips 3D)', async () => {
    await page.keyboard.press('2');
    await settle(page, 900);
    const seq = ['over', 'over', 'under', 'over', 'under', 'under'];
    for (const c of seq.slice(0, 3)) await page.keyboard.press(c === 'over' ? 'ArrowUp' : 'ArrowDown');
    await clickTarget(page, 'chipOver');
    await clickTarget(page, 'chipUnder');
    await clickTarget(page, 'chipUnder');
    const s = await scene(page);
    assert.deepEqual(s.active.crossings, seq);
    await page.screenshot({ path: join(OUT, '02-entrelacar-1280x720.png') });
  });

  await check('arrastar a lançadeira completa a passada e o pente bate', async () => {
    const a = await pt(page, 'shuttle');
    const s0 = await scene(page);
    await page.mouse.move(a.x, a.y);
    await page.mouse.down();
    for (let i = 1; i <= 24; i++) await page.mouse.move(a.x + i * 30, a.y + 2, { steps: 2 });
    await page.mouse.up();
    await settle(page, 600);
    const s = await scene(page);
    assert.equal(s.active, null, 'passada concluída');
    assert.equal(s.fabric.length, s0.fabric.length + 1);
    assert.deepEqual(s.fabric.at(-1).crossings.slice(0, 6), ['over', 'over', 'under', 'over', 'under', 'under'], 'cruzamentos manuais preservados');
  });

  await check('desfazer/refazer (Ctrl+Z/Ctrl+Y) restauram o estado do tecido', async () => {
    const before = await scene(page);
    await page.keyboard.press('Control+z');
    const mid = await scene(page);
    assert.notDeepEqual(mid, before);
    await page.keyboard.press('Control+y');
    const after = await scene(page);
    assert.deepEqual(after.fabric, before.fabric);
  });

  // mais fileiras para os critérios de tensão/corte
  await page.evaluate(() => window.__tear.seed('tlmsltms', 0));
  await settle(page, 800);

  await check('tensão altera curvatura sem instabilidade (inclui extremos)', async () => {
    await page.getByRole('button', { name: /^Tensionar/ }).click();
    await settle(page, 300);
    const s = await scene(page);
    const row = s.fabric.filter((e) => e.kind === 'row').at(-2);
    await clickTarget(page, `row:${row.id}`);
    const focus = (await scene(page)).focusRowId;
    assert.equal(focus, row.id, 'fileira escolhida para tensionar');
    // Curvatura medida pela altura ocupada pela passada (ondulação vertical) e por valores não finitos.
    const curv = async () => page.evaluate((id) => {
      const m = window.__tear.world.fabric.rowMeshes().find((o) => o.userData.rowId === id);
      const p = m.geometry.getAttribute('position');
      let bad = 0;
      for (let i = 0; i < p.count; i++) if (!Number.isFinite(p.getY(i))) bad++;
      m.geometry.computeBoundingBox();
      const b = m.geometry.boundingBox;
      return { sum: b.max.y - b.min.y, bad };
    }, row.id);
    const slider = page.locator('input[data-tension]');
    await slider.fill('0');
    await settle(page, 300);
    const loose = await curv();
    await slider.fill('100');
    await settle(page, 300);
    const tight = await curv();
    assert.equal(loose.bad + tight.bad, 0);
    assert.ok(loose.sum > tight.sum * 1.1, `altura frouxo ${loose.sum.toFixed(4)} > tenso ${tight.sum.toFixed(4)}`);
    for (let i = 0; i < 40; i++) await page.keyboard.press('Minus');
    for (let i = 0; i < 40; i++) await page.keyboard.press('Equal');
    const fin = await page.evaluate(() => window.__tear.world.fabric.freeRope.isFinite());
    assert.ok(fin, 'fio Verlet finito após extremos');
    // pausa durante a simulação e retomada com dt limitado
    await page.keyboard.press('p');
    await settle(page, 1200);
    assert.equal(await page.evaluate(() => window.__tear.store.app.paused), true);
    await page.keyboard.press('Escape');
    await settle(page, 300);
    assert.equal(await page.evaluate(() => window.__tear.store.app.paused), false);
    await page.screenshot({ path: join(OUT, '03-tensionar-1280x720.png') });
  });

  let cutIds = [];
  let beforeCut = null;
  await check('corte só remove o trecho escolhido (com confirmação)', async () => {
    await page.getByRole('button', { name: /^Separar/ }).click();
    await settle(page, 300);
    beforeCut = await scene(page);
    const rows = beforeCut.fabric.filter((e) => e.kind === 'row');
    const a = rows.at(-4), b = rows.at(-3);
    await clickTarget(page, `row:${a.id}`);
    await clickTarget(page, `row:${b.id}`);
    const sel = (await scene(page)).selection;
    assert.ok(sel && sel.toId, 'trecho marcado');
    cutIds = beforeCut.fabric.slice(Math.min(beforeCut.fabric.findIndex((e) => e.id === sel.fromId), beforeCut.fabric.findIndex((e) => e.id === sel.toId)), Math.max(beforeCut.fabric.findIndex((e) => e.id === sel.fromId), beforeCut.fabric.findIndex((e) => e.id === sel.toId)) + 1).map((e) => e.id);
    await page.getByRole('button', { name: /Cortar trecho/ }).click();
    await page.getByRole('button', { name: 'Cancelar' }).click();
    assert.equal((await scene(page)).fabric.length, beforeCut.fabric.length, 'cancelar não corta');
    await page.getByRole('button', { name: /Cortar trecho/ }).click();
    await page.locator('dialog .btn.danger').click();
    await settle(page, 700);
    const s = await scene(page);
    const gap = s.fabric.find((e) => e.kind === 'gap');
    assert.ok(gap);
    assert.deepEqual([...gap.removedRowIds].sort(), [...cutIds].sort());
    const kept = beforeCut.fabric.filter((e) => !cutIds.includes(e.id));
    assert.deepEqual(s.fabric.filter((e) => e.kind === 'row'), kept);
    await page.screenshot({ path: join(OUT, '04-corte-1280x720.png') });
  });

  await check('reconectar preserva o desenho restante', async () => {
    await page.getByRole('button', { name: /Reconectar/ }).click();
    await settle(page, 600);
    const s = await scene(page);
    assert.equal(s.fabric.some((e) => e.kind === 'gap'), false);
    assert.deepEqual(s.fabric, beforeCut.fabric.filter((e) => !cutIds.includes(e.id)));
  });

  await check('prender ponta e dar nó (pré-condição validada)', async () => {
    const s0 = await scene(page);
    const end = s0.ends.find((e) => e.state === 'solta');
    assert.ok(end);
    await page.evaluate((id) => window.__tear.actions.knot(id), end.id);
    assert.equal((await scene(page)).ends.find((e) => e.id === end.id).state, 'solta', 'nó recusado antes de prender');
    await page.evaluate((id) => window.__tear.actions.secure(id), end.id);
    await page.evaluate((id) => window.__tear.actions.knot(id), end.id);
    assert.equal((await scene(page)).ends.find((e) => e.id === end.id).state, 'atada');
  });

  await check('ver tecido e exportar composição (PNG) e resumo sem nomes', async () => {
    await page.evaluate(() => window.__tear.store.dispatch({ type: 'setName', yarnId: 'telha', name: 'Ana' }));
    await page.keyboard.press('5');
    await settle(page, 1400);
    await page.screenshot({ path: join(OUT, '05-ver-tecido-1280x720.png') });
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Exportar imagem/ }).click()]);
    const png = join(OUT, 'export-composicao.png');
    await dl.saveAs(png);
    const buf = await readFile(png);
    assert.equal(buf.subarray(1, 4).toString(), 'PNG');
    assert.ok(buf.length > 20000, `PNG ${buf.length} bytes`);
    const [dj] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Resumo observável/ }).click()]);
    const jp = join(OUT, 'export-resumo.json');
    await dj.saveAs(jp);
    const txt = await readFile(jp, 'utf8');
    assert.ok(!txt.includes('Ana'), 'resumo sem nome dado ao fio');
    JSON.parse(txt);
  });

  await check('salvar explicitamente, reabrir e apagar (IndexedDB)', async () => {
    await page.getByPlaceholder('Título (opcional)').fill('Teste automatizado');
    await page.getByRole('button', { name: /Salvar criação/ }).click();
    await settle(page, 800);
    await page.getByRole('button', { name: /Abrir Teste automatizado/ }).click();
    await settle(page, 400);
    await page.getByRole('button', { name: /Apagar Teste automatizado/ }).click();
    await page.locator('dialog .btn.danger').click();
    await settle(page, 400);
    assert.equal(await page.getByRole('button', { name: /Abrir Teste automatizado/ }).count(), 0);
  });

  await check('reset exige confirmação; alternância de modo', async () => {
    await page.getByRole('button', { name: /Recomeçar/ }).click();
    await page.locator('dialog .btn.danger').click();
    await settle(page, 400);
    assert.equal((await scene(page)).fabric.length, 0);
    await page.evaluate(() => window.__tear.actions.backToEntry());
    await page.getByRole('button', { name: /Tecelagem compartilhada/ }).click();
    await page.getByRole('button', { name: 'Começar', exact: true }).click();
    await settle(page, 600);
    const s = await scene(page);
    assert.equal(s.shared, true);
    assert.equal(s.warpCount, 18);
  });

  await check('demonstração pulável restaura o estado', async () => {
    const before = await scene(page);
    await page.evaluate(() => window.__tear.actions.backToEntry());
    await page.getByRole('button', { name: /Ver demonstração antes/ }).click();
    await settle(page, 2600);
    await page.getByRole('button', { name: 'Pular demonstração' }).click();
    await settle(page, 400);
    const s = await scene(page);
    assert.equal(s.fabric.length, 0);
    assert.equal(s.active, null);
    void before;
  });

  try {
    const perf = await page.evaluate(async () => {
      window.__tear.actions.start('livre', null, false);
      window.__tear.seed();
      await new Promise((r) => setTimeout(r, 4000));
      return window.__tear.world.engine.stats();
    });
    results.push({ name: 'diagnóstico 1280x720 (SwiftShader, CPU — não representa GPU real)', status: 'INFO', perf });
    await page.screenshot({ path: join(OUT, '06-geral-com-tecido-1280x720.png') });
  } catch (e) { results.push({ name: 'diagnóstico 1280x720', status: 'NÃO TESTADO', error: String(e.message) }); }
  await ctx.close().catch(() => undefined);
}

await check('eventos de integração sem dados pessoais', async () => {
  const { ctx, page } = await open({ width: 1280, height: 720 });
  await startMode(page);
  await settle(page, 800);
    await page.evaluate(() => window.__tear.store.dispatch({ type: 'setName', yarnId: 'linho', name: 'Maria' }));
    await page.evaluate(() => window.__tear.actions.exit());
    await page.locator('dialog .btn.primary').click();
    await settle(page, 300);
    const evs = await page.evaluate(() => window.__events);
    const types = evs.map((e) => e.type);
    for (const t of ['ready', 'summary', 'exit']) assert.ok(types.includes(t), t);
    const raw = JSON.stringify(evs);
    if (raw.includes('Maria') || raw.includes('Ana')) sensitiveLeaks.push(raw);
    assert.ok(!raw.includes('Maria'));
    assert.ok(evs.every((e) => e.source === 'tear-dos-vinculos' && e.version === 1));
    await ctx.close();
});

// ======================= matriz de viewports =======================
const VIEWS = [
  { w: 1920, h: 1080, name: 'desktop-1920x1080' },
  { w: 1280, h: 720, name: 'desktop-1280x720' },
  { w: 1024, h: 768, name: 'tablet-paisagem-1024x768', touch: true },
  { w: 390, h: 844, name: 'celular-390x844', touch: true },
  { w: 360, h: 640, name: 'celular-360x640', touch: true },
];
for (const v of VIEWS) {
  await check(`layout ${v.name}: sem rolagem horizontal, alvos ≥44px, HUD fora da área central`, async () => {
    const { ctx, page } = await open({ width: v.w, height: v.h }, { touch: v.touch });
    await startMode(page);
    await page.evaluate(() => window.__tear.seed());
    await page.evaluate(() => window.__tear.actions.tool('entrelacar'));
    await settle(page, 2500);
    const m = await page.evaluate(() => {
      const small = [...document.querySelectorAll('#hud button')].filter((b) => {
        const r = b.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && getComputedStyle(b).visibility !== 'hidden' && (r.width < 44 || r.height < 44) && !b.classList.contains('grabber');
      }).map((b) => b.getAttribute('aria-label') || b.textContent.trim()).slice(0, 6);
      return { overflow: document.documentElement.scrollWidth > innerWidth, small, chip: window.__tear.world.screenPoint('chipOver') };
    });
    assert.equal(m.overflow, false);
    assert.deepEqual(m.small, [], `alvos pequenos: ${m.small.join(', ')}`);
    // o chip "cima" (zona de manipulação) não pode estar coberto pelo HUD
    const covered = await page.evaluate(({ x, y }) => { const el = document.elementFromPoint(x, y); return el && el.tagName !== 'CANVAS' ? el.className : null; }, m.chip);
    assert.equal(covered, null, `zona de manipulação coberta por ${covered}`);
    await page.screenshot({ path: join(OUT, `07-${v.name}.png`) });
    if (v.w === 390) {
      await page.evaluate(() => window.__tear.actions.tool('separar'));
      await settle(page, 800);
      await page.screenshot({ path: join(OUT, `08-${v.name}-separar.png`) });
    }
    await ctx.close();
  });
}

// ======================= sessões repetidas, resize, contexto =======================
await check('sessões repetidas e resize não acumulam geometrias', async () => {
  const { ctx, page } = await open({ width: 1280, height: 720 });
  const geo = [];
  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => { window.__tear.actions.start('livre', null, false); window.__tear.seed(); });
    await settle(page, 700);
    await page.setViewportSize(i % 2 ? { width: 1280, height: 720 } : { width: 800, height: 900 });
    await settle(page, 500);
    geo.push(await page.evaluate(() => window.__tear.world.engine.renderer.info.memory.geometries));
  }
  assert.ok(geo[3] <= geo[1] + 12, `geometrias ${geo.join(' → ')}`);
  await ctx.close();
});

await check('perda de contexto WebGL mostra alternativa DOM funcional e recupera', async () => {
  const { ctx, page } = await open({ width: 1280, height: 720 });
  await startMode(page);
  await page.evaluate(() => { const gl = window.__tear.world.engine.renderer.getContext(); window.__lose = gl.getExtension('WEBGL_lose_context'); window.__lose.loseContext(); });
  await settle(page, 600);
  assert.equal(await page.locator('.fallback').count(), 1);
  await page.keyboard.press('2');
  await page.keyboard.press('ArrowUp');
  assert.equal((await scene(page)).active.crossings.length, 1, 'tecer continua no rascunho');
  await page.screenshot({ path: join(OUT, '09-alternativa-dom.png') });
  await page.evaluate(() => window.__lose.restoreContext());
  await settle(page, 1500);
  assert.equal(await page.locator('.fallback').count(), 0);
  await ctx.close();
});

await browser.close();
server.close();

await check('sem erros de console e sem 404', async () => {
  assert.deepEqual(consoleErrors, []);
  assert.deepEqual(notFound.filter((u) => !u.endsWith('favicon.ico')), []);
});

await writeFile(join(OUT, 'resultado-e2e.json'), JSON.stringify({ quando: new Date().toISOString(), resultados: results, consoleErrors, notFound, sensitiveLeaks }, null, 2));
const failed = results.filter((r) => r.status === 'FAIL');
console.log(`\n${results.filter((r) => r.status === 'PASS').length} PASS · ${failed.length} FAIL`);
process.exit(failed.length ? 1 : 0);
