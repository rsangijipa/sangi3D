/**
 * Tier 1 E2E Feature Coverage Suite (55 isolated opaque-box checks across F1-F10 & 8 collections).
 * Contracts: TEST_INFRA.md, SCOPE.md, ORIGINAL_REQUEST.md (R1-R7, G00-G16).
 */
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { after, before, describe, test } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { promisify } from 'node:util';
import {
  attachDiagnostics,
  closeAppModal,
  COLLECTIONS,
  createIsolatedContext,
  getCatalog,
  launchBrowser,
  openAppInModal,
  pickRepresentativeApp,
  REPO_ROOT,
  REPRESENTATIVE_SAMPLES,
  sendBridgeCommand,
  startLauncherServer,
} from './_harness.mjs';

const execFileAsync = promisify(execFile);

let server;
let baseUrl;
let catalog;
let swiftBrowser;

async function waitForLauncherReady(page) {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#list .card, #list .row, #list .empty', { timeout: 15000 });
}

async function waitForWebGLDraws(target, minDraws = 1, timeoutMs = 20000) {
  await target.waitForFunction(
    (min) => (window.__SANGI_E2E_DIAG__?.draws ?? 0) >= min,
    minDraws,
    { timeout: timeoutMs },
  );
}

before(async () => {
  server = await startLauncherServer({ prebuild: false });
  baseUrl = server.baseUrl;
  catalog = await getCatalog(baseUrl);
  const launched = await launchBrowser({ gpu: 'swiftshader' });
  swiftBrowser = launched.browser;
});

after(async () => {
  await swiftBrowser?.close().catch(() => {});
  await server?.stop().catch(() => {});
});

// ============================================================================
// F1 — Launcher Catalog Loading & Metadata (5 checks)
// ============================================================================
describe('F1: Launcher Catalog Loading & Metadata', () => {
  test('F1-01: GET /api/apps returns 200 JSON array >= 101 entries, required fields, 8 collections, 0 self-refs', async () => {
    const res = await fetch(`${baseUrl}/api/apps`, { cache: 'no-store' });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length >= 101, `Esperado >= 101 apps, obtido ${data.length}`);

    const seenIds = new Set();
    const cols = new Set();
    for (const app of data) {
      assert.ok(app.id && typeof app.id === 'string', `Entrada sem id: ${JSON.stringify(app)}`);
      assert.ok(!seenIds.has(app.id), `ID duplicado: ${app.id}`);
      seenIds.add(app.id);
      assert.ok(app.name && typeof app.name === 'string', `Entrada sem name: ${app.id}`);
      assert.ok(app.collection && typeof app.collection === 'string', `Entrada sem collection: ${app.id}`);
      assert.ok(app.status && typeof app.status === 'string', `Entrada sem status: ${app.id}`);
      assert.ok(app.kind && typeof app.kind === 'string', `Entrada sem kind: ${app.id}`);
      assert.ok(app.path && typeof app.path === 'string', `Entrada sem path: ${app.id}`);
      assert.notEqual(app.id, 'index-html');
      assert.notEqual(app.url, '/index.html');
      assert.notEqual(app.name, 'Ambientes');
      cols.add(app.collection);
    }
    for (const expectedCol of COLLECTIONS) {
      assert.ok(cols.has(expectedCol), `Coleção ausente em /api/apps: ${expectedCol}`);
    }
  });

  test('F1-02: GET /api/apps.json M0 catalog integrity (unique IDs, 0 concept+ready, vitralista present)', async () => {
    const res = await fetch(`${baseUrl}/api/apps.json`, { cache: 'no-store' });
    assert.equal(res.status, 200);
    const staticApps = await res.json();
    assert.ok(Array.isArray(staticApps) && staticApps.length >= 101);

    const ids = new Set();
    const conceptReady = [];
    for (const app of staticApps) {
      assert.ok(app.id && !ids.has(app.id), `ID inválido/duplicado em /api/apps.json: ${app.id}`);
      ids.add(app.id);
      assert.notEqual(app.id, 'index-html');
      assert.notEqual(app.url, '/index.html');
      if (app.kind === 'concept' && app.status === 'ready') {
        conceptReady.push(app.id);
      }
    }
    assert.deepEqual(
      conceptReady,
      [],
      `Contradição M0: entradas com kind="concept" e status="ready" em api/apps.json: ${conceptReady.join(', ')}`,
    );
    assert.ok(
      staticApps.some((a) => a.id === '02_projetos-01-oficina-do-vitralista' || String(a.path).includes('01-oficina-do-vitralista')),
      '02_Projetos/01-oficina-do-vitralista ausente em api/apps.json',
    );
  });

  test('F1-03: Launcher initial render displays 8 collections, matching #stats prontos count, and 0 errors', async () => {
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const expectedReadyMain = catalog.filter((a) => a.status === 'ready' && a.collection !== 'Legado arquivado').length;
      const cardsCount = await page.locator('#list .card').count();
      assert.equal(cardsCount, expectedReadyMain);

      const statsText = await page.locator('#stats').innerText();
      assert.match(statsText, new RegExp(`\\b${expectedReadyMain}\\s+prontos\\b`));

      const navTexts = await page.locator('#navCols button, #navArchive button').allInnerTexts();
      const joinedNav = navTexts.join(' | ');
      for (const col of COLLECTIONS.filter((c) => c !== 'Legado arquivado')) {
        assert.ok(joinedNav.includes(col), `Coleção ausente na sidebar: ${col}`);
      }
      assert.ok(await page.locator('[data-view="col:Legado arquivado"]').isVisible());
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F1-04: Every visible card .thumb renders loaded <img> or SVG .art fallback without broken images', async () => {
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      // Trigger lazy-loaded thumbnails across the full catalog and wait for completion
      const totalHeight = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y <= totalHeight; y += 500) {
        await page.evaluate((pos) => window.scrollTo(0, pos), y);
        await delay(80);
      }
      await page.evaluate(async () => {
        const imgs = [...document.querySelectorAll('#list .card .thumb img')];
        for (const img of imgs) {
          if (!img.complete) img.scrollIntoView({ block: 'center' });
        }
      });
      await page.waitForFunction(
        () => [...document.querySelectorAll('#list .card .thumb img')].every((img) => img.complete),
        null,
        { timeout: 10000 },
      );

      const thumbReport = await page.evaluate(() => {
        const thumbs = [...document.querySelectorAll('#list .card .thumb')];
        const broken = [];
        for (const t of thumbs) {
          const img = t.querySelector('img');
          const artSvg = t.querySelector('.art svg');
          if (img) {
            if (!img.complete || img.naturalWidth <= 0) {
              broken.push({ src: img.getAttribute('src'), complete: img.complete, naturalWidth: img.naturalWidth });
            }
          } else if (!artSvg) {
            broken.push({ missingBoth: true });
          }
        }
        return { total: thumbs.length, broken };
      });

      assert.ok(thumbReport.total > 0);
      assert.deepEqual(thumbReport.broken, [], `Miniaturas quebradas: ${JSON.stringify(thumbReport.broken)}`);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F1-05: Zero self-reference entries in rendered DOM and every ready card has valid play target', async () => {
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const domCheck = await page.evaluate(() => {
        const cards = [...document.querySelectorAll('#list .card')];
        const bad = [];
        for (const c of cards) {
          const title = c.querySelector('h3')?.textContent?.trim() || '';
          const play = c.querySelector('[data-play]')?.getAttribute('data-play') || '';
          const href = c.querySelector('a[href]')?.getAttribute('href') || '';
          if (title === 'Ambientes' || play === 'index-html' || href === '/index.html') {
            bad.push({ title, play, href });
          }
          if (c.classList.contains('ready') && (!play || !href)) {
            bad.push({ title, play, href, missingPlayOrHref: true });
          }
        }
        return { count: cards.length, bad };
      });
      assert.ok(domCheck.count > 0);
      assert.deepEqual(domCheck.bad, []);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });
});

// ============================================================================
// F2 — Search, Filter, Sort, Layout & Persistence (6 checks)
// ============================================================================
describe('F2: Search, Filter, Sort, Layout & Persistence', () => {
  test('F2-01: Live search #q matches accent-insensitively, shows .empty on miss, / focuses & Esc clears', async () => {
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const initialCount = await page.locator('#list .card').count();

      await page.keyboard.press('/');
      const focusedId = await page.evaluate(() => document.activeElement?.id);
      assert.equal(focusedId, 'q');

      await page.locator('#q').fill('observatorio');
      const titles = await page.locator('#list .card h3').allInnerTexts();
      assert.ok(titles.some((t) => /Observatório da Luz/i.test(t)), `Esperava Observatório da Luz em ${titles}`);
      assert.ok(titles.length < initialCount);

      await page.locator('#q').fill('xyz_consulta_inexistente_999');
      await page.locator('#list .empty').waitFor({ state: 'visible' });

      await page.locator('#q').focus();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#q').inputValue(), '');
      assert.notEqual(await page.evaluate(() => document.activeElement?.id), 'q');
      assert.equal(await page.locator('#list .card').count(), initialCount);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F2-02: Sidebar [data-view] filters collections & Legado arquivado with aria-current and #title updates', async () => {
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);

      const tccBtn = page.locator('#side [data-view="col:Jardins da TCC"]');
      await tccBtn.click();
      assert.equal(await tccBtn.getAttribute('aria-current'), 'true');
      assert.equal(await page.locator('#title').innerText(), 'Jardins da TCC');
      const tccExpected = catalog.filter((a) => a.collection === 'Jardins da TCC' && a.status === 'ready').length;
      assert.equal(await page.locator('#list .card').count(), tccExpected);

      const archiveBtn = page.locator('#side [data-view="col:Legado arquivado"]');
      await archiveBtn.click();
      assert.equal(await archiveBtn.getAttribute('aria-current'), 'true');
      assert.equal(await page.locator('#title').innerText(), 'Legado arquivado');
      const archiveExpected = catalog.filter((a) => a.collection === 'Legado arquivado').length;
      assert.equal(await page.locator('#list .card').count(), archiveExpected);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F2-03: Sort selector #sort reorders cards (az / recentes) and persists launcher.sort', async () => {
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      await page.locator('#sort').selectOption('az');
      const titlesAz = await page.locator('#list .card h3').allInnerTexts();
      assert.ok(titlesAz.length > 5);
      const sortedAz = [...titlesAz].sort((a, b) => a.localeCompare(b, 'pt'));
      assert.deepEqual(titlesAz, sortedAz);
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('launcher.sort'))), 'az');

      await page.locator('#sort').selectOption('recentes');
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('launcher.sort'))), 'recentes');
      const titlesRec = await page.locator('#list .card h3').allInnerTexts();
      assert.equal(titlesRec.length, titlesAz.length);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F2-04: Grid vs List layout toggle [data-layout] updates DOM & aria-pressed and persists', async () => {
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const listBtn = page.locator('[data-layout="list"]');
      const gridBtn = page.locator('[data-layout="grid"]');

      await listBtn.click();
      assert.equal(await listBtn.getAttribute('aria-pressed'), 'true');
      assert.equal(await gridBtn.getAttribute('aria-pressed'), 'false');
      assert.ok((await page.locator('#list .list .row').count()) > 0);
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('launcher.layout'))), 'list');

      await gridBtn.click();
      assert.equal(await gridBtn.getAttribute('aria-pressed'), 'true');
      assert.ok((await page.locator('#list .grid .card').count()) > 0);
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('launcher.layout'))), 'grid');
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F2-05: Favorites [data-fav] & recent tracking update badges and views', async () => {
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const sampleApp = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D');
      const sampleId = sampleApp.id;
      const favBtn = page.locator(`[data-fav="${sampleId}"]`).first();
      await favBtn.scrollIntoViewIfNeeded();
      await favBtn.click();
      assert.equal(await page.locator(`[data-fav="${sampleId}"]`).first().getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('[data-view="fav"] .n').innerText(), '1');

      await page.locator('[data-view="fav"]').click();
      assert.equal(await page.locator(`#list [data-play="${sampleId}"]:not(.cover)`).count(), 1);

      await openAppInModal(page, sampleId);
      await closeAppModal(page);
      await page.locator('[data-view="recent"]').click();
      assert.equal(await page.locator(`#list [data-play="${sampleId}"]:not(.cover)`).count(), 1);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F2-06: localStorage persistence across reload & #random launches a ready app modal', async () => {
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const sampleApp = pickRepresentativeApp(catalog, 'Jardins da TCC');
      const sampleId = sampleApp.id;
      const favBtn = page.locator(`[data-fav="${sampleId}"]`).first();
      await favBtn.scrollIntoViewIfNeeded();
      await favBtn.click();
      await page.locator('#sort').selectOption('az');
      await page.locator('[data-layout="list"]').click();
      await page.locator('#side [data-view="col:Jardins da TCC"]').click();

      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#list .row', { timeout: 15000 });

      assert.equal(await page.locator('#side [data-view="col:Jardins da TCC"]').getAttribute('aria-current'), 'true');
      assert.equal(await page.locator('#sort').inputValue(), 'az');
      assert.equal(await page.locator('[data-layout="list"]').getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator(`[data-fav="${sampleId}"]`).first().getAttribute('aria-pressed'), 'true');

      await page.locator('#random').click();
      await page.locator('#playerModal').waitFor({ state: 'visible', timeout: 10000 });
      await page.locator('#playerFrameContainer iframe.player-frame').waitFor({ state: 'attached', timeout: 10000 });
      await closeAppModal(page);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });
});

// ============================================================================
// F3 — App Opening & Routing Across All 8 Collections (8 checks)
// ============================================================================
describe('F3: App Opening & Routing Across All 8 Collections', () => {
  test('F3-01: Collection 1 (Jardins da TCC) opens Escada da Coragem in modal with live WebGL draws', async () => {
    const app = pickRepresentativeApp(catalog, 'Jardins da TCC');
    assert.ok(app);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      assert.ok(page.url().includes(`#play=${encodeURIComponent(app.id)}`));
      await waitForWebGLDraws(frame, 1, 25000);
      assert.ok(await frame.locator('canvas').first().isVisible());
      await closeAppModal(page);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F3-02: Collection 2 (Jardins do Sentir) opens Casa da Árvore das Emoções with live WebGL draws', async () => {
    const app = pickRepresentativeApp(catalog, 'Jardins do Sentir');
    assert.ok(app);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 1, 25000);
      assert.ok(await frame.locator('canvas').first().isVisible());
      await closeAppModal(page);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F3-03: Collection 3 (Projetos 3D) /play/04-tear-dos-vinculos routing & tracked build WebGL draws', async () => {
    const app = pickRepresentativeApp(catalog, 'Projetos 3D', (a) => a.id === '04-tear-dos-vinculos');
    assert.ok(app);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      assert.ok(page.url().includes(`#play=${encodeURIComponent(app.id)}`));

      const buildRes = await fetch(`${baseUrl}/api/build/${app.id}`, { cache: 'no-store' });
      assert.equal(buildRes.status, 200);
      const buildJson = await buildRes.json();
      assert.equal(buildJson.name, app.name);
      assert.ok(typeof buildJson.appUrl === 'string' && buildJson.appUrl.includes('/dist/'));

      if (app.direct) {
        await waitForWebGLDraws(frame, 1, 20000);
        assert.ok(await frame.locator('canvas').first().isVisible());
        await closeAppModal(page);
      } else {
        // Fresh worktree without gitignored root dist/ enters loading.html; verify loading UI + tracked launcher dist
        await frame.locator('#name').waitFor({ state: 'visible', timeout: 10000 });
        await closeAppModal(page);
        await page.goto(`${baseUrl}/launcher/${app.path}/dist/index.html`, { waitUntil: 'domcontentloaded' });
        await waitForWebGLDraws(page, 1, 20000);
        assert.ok(await page.locator('canvas').first().isVisible());
      }
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F3-04: Collection 4 (Kit 17 jogos 3D) opens Observatório da Luz & /api/build/02-atlas-das-texturas 200 JSON', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const atlas = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].fallback);
    assert.ok(app && atlas);

    const buildRes = await fetch(`${baseUrl}/api/build/${atlas.id}`, { cache: 'no-store' });
    assert.equal(buildRes.status, 200);
    const buildJson = await buildRes.json();
    assert.equal(buildJson.name, atlas.name);

    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 1, 15000);
      assert.ok(await frame.locator('canvas').first().isVisible());
      await closeAppModal(page);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F3-05: Collection 5 (Adultos e marcas) opens Clepsidra do Foco with live WebGL draws', async () => {
    const app = pickRepresentativeApp(catalog, 'Adultos e marcas');
    assert.ok(app);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 1, 15000);
      assert.ok(await frame.locator('canvas').first().isVisible());
      await closeAppModal(page);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F3-06: Collection 6 (Expressão e desenvolvimento) /play/07-sala-das-cadeiras-possiveis & tracked dist WebGL', async () => {
    const app = pickRepresentativeApp(catalog, 'Expressão e desenvolvimento');
    assert.ok(app);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);

      const buildRes = await fetch(`${baseUrl}/api/build/${app.id}`, { cache: 'no-store' });
      assert.equal(buildRes.status, 200);
      const buildJson = await buildRes.json();
      assert.equal(buildJson.name, app.name);
      assert.ok(typeof buildJson.appUrl === 'string' && buildJson.appUrl.includes('/dist/'));

      if (app.direct) {
        await waitForWebGLDraws(frame, 1, 20000);
        assert.ok(await frame.locator('canvas').first().isVisible());
        await closeAppModal(page);
      } else {
        await frame.locator('#name').waitFor({ state: 'visible', timeout: 10000 });
        await closeAppModal(page);
        await page.goto(`${baseUrl}/launcher/${app.path}/dist/index.html`, { waitUntil: 'domcontentloaded' });
        await waitForWebGLDraws(page, 1, 20000);
        assert.ok(await page.locator('canvas').first().isVisible());
      }
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F3-07: Collection 7 (Ambientes avulsos) opens Lago 3D Interativo with live WebGL draws', async () => {
    const app = pickRepresentativeApp(catalog, 'Ambientes avulsos');
    assert.ok(app);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 1, 25000);
      assert.ok(await frame.locator('canvas').first().isVisible());
      await closeAppModal(page);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F3-08: Collection 8 (Legado arquivado) opens Santuário Zen & /launcher/loading.html serves 200', async () => {
    const loadingRes = await fetch(`${baseUrl}/launcher/loading.html`);
    assert.equal(loadingRes.status, 200);

    const app = pickRepresentativeApp(catalog, 'Legado arquivado');
    assert.ok(app);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 1, 25000);
      assert.ok(await frame.locator('canvas').first().isVisible());
      await closeAppModal(page);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });
});

// ============================================================================
// F4 — Bridge Handshake & Lifecycle Commands (6 checks)
// ============================================================================
describe('F4: Bridge Handshake & Lifecycle Commands', () => {
  test('F4-01: SANGI_APP_READY emitted via postMessage with capabilities and fades #playerLoader', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      await openAppInModal(page, app.id);
      await page.waitForFunction(
        () => (window.__SANGI_E2E_DIAG__?.messages || []).some((m) => m.type === 'SANGI_APP_READY'),
        null,
        { timeout: 10000 },
      );
      const messages = await diag.getMessages(page);
      const ready = messages.find((m) => m.type === 'SANGI_APP_READY');
      assert.ok(ready?.data?.capabilities && typeof ready.data.capabilities === 'object');
      await page.waitForFunction(
        () => document.getElementById('playerLoader')?.classList.contains('fade-out'),
        null,
        { timeout: 6000 },
      );
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F4-02: M0 v2 SANGI_COMMAND PAUSE pauses bridge state and halts render loop draws', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 2, 15000);

      await sendBridgeCommand(page, 'PAUSE', {}, { protocol: 'v2' });
      await delay(200);
      const pausedFlag = await frame.evaluate(() => window.__SANGI_PAUSED__);
      assert.equal(pausedFlag, true, 'SANGI_COMMAND PAUSE deve definir window.__SANGI_PAUSED__ === true');

      const sample = await diag.collectFpsSample(frame, 450);
      assert.equal(sample.drawsDelta, 0, 'Loop WebGL deve permanecer pausado após SANGI_COMMAND PAUSE');
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F4-03: M0 v2 SANGI_COMMAND RESUME resumes paused app and restores WebGL draws', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 2, 15000);

      await sendBridgeCommand(page, 'PAUSE', {}, { protocol: 'v2' });
      await delay(150);
      assert.equal(await frame.evaluate(() => window.__SANGI_PAUSED__), true);

      await sendBridgeCommand(page, 'RESUME', {}, { protocol: 'v2' });
      await delay(150);
      assert.equal(await frame.evaluate(() => window.__SANGI_PAUSED__), false);

      const sample = await diag.collectFpsSample(frame, 500);
      assert.ok(sample.drawsDelta > 0, 'Draws WebGL devem retomar após SANGI_COMMAND RESUME');
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F4-04: M0 v2 SANGI_COMMAND MUTE and UNMUTE toggle __SANGI_MUTED__ cleanly', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 1, 15000);

      await sendBridgeCommand(page, 'MUTE', { muted: true }, { protocol: 'v2' });
      await delay(100);
      assert.equal(await frame.evaluate(() => window.__SANGI_MUTED__), true);

      await sendBridgeCommand(page, 'UNMUTE', { muted: false }, { protocol: 'v2' });
      await delay(100);
      assert.equal(await frame.evaluate(() => window.__SANGI_MUTED__), false);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F4-05: M0 v2 SANGI_COMMAND RESET dispatches sangi:reset and keeps rendering cleanly', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 1, 15000);

      await frame.evaluate(() => {
        window.__SANGI_TEST_RESET_FIRED__ = false;
        window.addEventListener('sangi:reset', () => { window.__SANGI_TEST_RESET_FIRED__ = true; }, { once: true });
      });

      await sendBridgeCommand(page, 'RESET', {}, { protocol: 'v2' });
      await delay(150);
      const resetFired = await frame.evaluate(() => window.__SANGI_TEST_RESET_FIRED__);
      assert.equal(resetFired, true, 'SANGI_COMMAND RESET deve disparar evento sangi:reset');

      const sample = await diag.collectFpsSample(frame, 400);
      assert.ok(sample.drawsDelta > 0);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F4-06: M0 v2 SANGI_COMMAND DISPOSE sets __SANGI_DISPOSED__ and stops draw loop', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 2, 15000);

      await sendBridgeCommand(page, 'DISPOSE', {}, { protocol: 'v2' });
      await delay(200);
      const disposed = await frame.evaluate(() => window.__SANGI_DISPOSED__);
      assert.equal(disposed, true, 'SANGI_COMMAND DISPOSE deve definir window.__SANGI_DISPOSED__ === true');

      const sample = await diag.collectFpsSample(frame, 400);
      assert.equal(sample.drawsDelta, 0);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });
});

// ============================================================================
// F5 — Audio, Controls & Accessible HUD (5 checks)
// ============================================================================
describe('F5: Audio, Controls & Accessible HUD', () => {
  test('F5-01: #mutePlayerBtn toggles aria-pressed, updates .lbl-sound, and dispatches mute to iframe', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 1, 15000);

      const muteBtn = page.locator('#mutePlayerBtn');
      assert.equal(await muteBtn.getAttribute('aria-pressed'), 'false');
      await muteBtn.click();
      assert.equal(await muteBtn.getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('#mutePlayerBtn .lbl-sound').innerText(), 'Mudo');
      await delay(100);
      assert.equal(await frame.evaluate(() => window.__SANGI_MUTED__), true);

      await muteBtn.click();
      assert.equal(await muteBtn.getAttribute('aria-pressed'), 'false');
      assert.equal(await page.locator('#mutePlayerBtn .lbl-sound').innerText(), 'Som');
      await delay(100);
      assert.equal(await frame.evaluate(() => window.__SANGI_MUTED__), false);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F5-02: #openTabBtn href matches app.url, #playerAppName/#playerAppCol match, standalone tab renders', async () => {
    const app = pickRepresentativeApp(catalog, 'Adultos e marcas');
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      await openAppInModal(page, app.id);
      const openTab = page.locator('#openTabBtn');
      assert.equal(await openTab.getAttribute('target'), '_blank');
      const href = await openTab.getAttribute('href');
      assert.equal(href, app.url);
      assert.equal(await page.locator('#playerAppName').innerText(), app.name);
      assert.equal(await page.locator('#playerAppCol').innerText(), app.collection);

      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        openTab.click(),
      ]);
      await closeAppModal(page);
      await newPage.waitForLoadState('domcontentloaded');
      await waitForWebGLDraws(newPage, 1, 15000);
      assert.ok(await newPage.locator('canvas').first().isVisible());
      await newPage.close();
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F5-03: #closePlayerBtn and Esc close modal, clear #play= hash, restore overflow & focus', async () => {
    const app = pickRepresentativeApp(catalog, 'Adultos e marcas');
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      await openAppInModal(page, app.id);
      await closeAppModal(page);
      assert.ok(!page.url().includes('#play='));
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
      const activePlayAttr = await page.evaluate(() => document.activeElement?.getAttribute('data-play'));
      assert.equal(activePlayAttr, app.id);

      await openAppInModal(page, app.id);
      await page.locator('#closePlayerBtn').focus();
      await page.keyboard.press('Escape');
      await page.locator('#playerModal').waitFor({ state: 'hidden', timeout: 5000 });
      assert.equal(await page.locator('#playerFrameContainer iframe.player-frame').count(), 0);
      assert.ok(!page.url().includes('#play='));
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F5-04: M0 shared/imersivo.js mounts .imv-top/.imv-bottom and H toggles .imv-collapsed', async () => {
    const app = pickRepresentativeApp(catalog, 'Ambientes avulsos', (a) => a.id === REPRESENTATIVE_SAMPLES['Ambientes avulsos'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await page.goto(`${baseUrl}${app.url}`, { waitUntil: 'load' });
      await page.locator('.imv-top').waitFor({ state: 'visible', timeout: 8000 });
      await page.locator('.imv-bottom').waitFor({ state: 'visible', timeout: 8000 });

      const initialCollapsed = await page.evaluate(() => document.documentElement.classList.contains('imv-collapsed'));
      await page.keyboard.press('h');
      const toggledCollapsed = await page.evaluate(() => document.documentElement.classList.contains('imv-collapsed'));
      assert.notEqual(toggledCollapsed, initialCollapsed);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F5-05: AudioContext respects no-autoplay before gesture and unlocks cleanly on user click', async () => {
    const app = pickRepresentativeApp(catalog, 'Adultos e marcas');
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await page.goto(`${baseUrl}${app.url}`, { waitUntil: 'domcontentloaded' });
      await waitForWebGLDraws(page, 1, 15000);

      const beforeStats = await diag.getResourceStats(page);
      assert.equal(beforeStats.audioRunning, 0, 'Áudio não deve iniciar em execução sem gesto do usuário');

      await page.locator('#btn-valve').click();
      await delay(150);
      const afterStats = await diag.getResourceStats(page);
      assert.ok(afterStats.audioCreated >= 1, 'AudioContext deve ser criado após gesto do usuário');
      diag.assertClean();
    } finally {
      await context.close();
    }
  });
});

// ============================================================================
// F6 — Resource Teardown & Leak Hygiene (5 checks)
// ============================================================================
describe('F6: Resource Teardown & Leak Hygiene', () => {
  test('F6-01: Closing modal via #closePlayerBtn detaches iframe cleanly with 0 errors', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 1, 15000);
      const stats = await diag.getResourceStats(frame);
      assert.ok(stats.webglCreated >= 1);

      await closeAppModal(page);
      assert.equal(await page.locator('#playerFrameContainer').evaluate((el) => el.children.length), 0);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F6-02: AudioContext closes cleanly on DISPOSE after gesture audio activation', async () => {
    const app = pickRepresentativeApp(catalog, 'Adultos e marcas');
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 1, 15000);

      await frame.locator('#btn-valve').click();
      await delay(150);
      const activeStats = await diag.getResourceStats(frame);
      assert.ok(activeStats.audioCreated >= 1);

      await sendBridgeCommand(page, 'DISPOSE', {}, { protocol: 'both' });
      await delay(200);
      const disposedStats = await diag.getResourceStats(frame);
      assert.ok(
        disposedStats.audioClosed >= disposedStats.audioCreated && disposedStats.audioNotClosed === 0,
        `AudioContext vazado após DISPOSE: ${JSON.stringify(disposedStats)}`,
      );
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F6-03: requestAnimationFrame loop stops and rafPending === 0 after DISPOSE', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 2, 15000);

      await sendBridgeCommand(page, 'DISPOSE', {}, { protocol: 'both' });
      await delay(200);
      const beforeWait = await diag.getResourceStats(frame);
      await delay(400);
      const afterWait = await diag.getResourceStats(frame);

      assert.equal(afterWait.draws - beforeWait.draws, 0, 'Draws devem cessar após DISPOSE');
      assert.equal(afterWait.rafPending, 0, 'Nenhum rAF deve permanecer pendente após DISPOSE');
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F6-04: window/document listener balance stays non-increasing across 3 open/close cycles', async () => {
    const app = pickRepresentativeApp(catalog, 'Adultos e marcas');
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      let afterCycle1;
      let afterCycle3;

      for (let i = 1; i <= 3; i++) {
        const { frame } = await openAppInModal(page, app.id);
        await waitForWebGLDraws(frame, 1, 15000);
        await closeAppModal(page);
        if (i === 1) afterCycle1 = await diag.getResourceStats(page);
        if (i === 3) afterCycle3 = await diag.getResourceStats(page);
      }

      assert.ok(afterCycle3.windowListenersActive <= afterCycle1.windowListenersActive);
      assert.ok(afterCycle3.documentListenersActive <= afterCycle1.documentListenersActive);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F6-05: Sequential multi-app switching across 3 collections leaves 0 leaked iframes and 0 errors', async () => {
    const apps = [
      pickRepresentativeApp(catalog, 'Jardins da TCC'),
      pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary),
      pickRepresentativeApp(catalog, 'Adultos e marcas'),
    ];
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      for (const app of apps) {
        const { frame } = await openAppInModal(page, app.id);
        await waitForWebGLDraws(frame, 1, 25000);
        assert.equal(await page.locator('#playerFrameContainer iframe.player-frame').count(), 1);
        await closeAppModal(page);
        assert.equal(await page.locator('#playerFrameContainer iframe.player-frame').count(), 0);
      }
      diag.assertClean();
    } finally {
      await context.close();
    }
  });
});

// ============================================================================
// F7 — Responsive Viewports & Touch/Mouse Input (5 checks)
// ============================================================================
describe('F7: Responsive Viewports & Touch/Mouse Input', () => {
  test('F7-01: mobile-360 (360x640) drawer toggle & zero horizontal overflow', async () => {
    const { context, page } = await createIsolatedContext(swiftBrowser, 'mobile-360', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const menuBtn = page.locator('#menuBtn');
      assert.equal(await menuBtn.isVisible(), true);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      assert.equal(overflow, false);

      await menuBtn.tap();
      assert.equal(await page.evaluate(() => document.body.classList.contains('nav-open')), true);

      await page.locator('#side [data-view="col:Kit 17 jogos 3D"]').tap();
      assert.equal(await page.evaluate(() => document.body.classList.contains('nav-open')), false);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F7-02: mobile-390 (390x844) touch tap opens modal fitting viewport with >= 32px close button', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'mobile-390', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const playBtn = page.locator(`#list [data-play="${app.id}"]:not(.cover)`).first();
      await playBtn.scrollIntoViewIfNeeded();
      await playBtn.tap();

      await page.locator('#playerModal').waitFor({ state: 'visible', timeout: 10000 });
      const handle = await page.locator('#playerFrameContainer iframe.player-frame').elementHandle();
      const frame = await handle.contentFrame();
      await frame.waitForLoadState('domcontentloaded');
      await waitForWebGLDraws(frame, 1, 15000);

      const closeBox = await page.locator('#closePlayerBtn').boundingBox();
      assert.ok(closeBox && closeBox.height >= 32 && closeBox.width >= 32);
      const canvasBox = await frame.locator('canvas').first().boundingBox();
      assert.ok(canvasBox && canvasBox.width > 0 && canvasBox.height > 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);

      await closeAppModal(page);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F7-03: tablet-768 (768x1024) responsive layout & touch drag on 3D canvas', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'tablet-768', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 1, 15000);

      const box = await frame.locator('canvas').first().boundingBox();
      assert.ok(box && box.width > 100 && box.height > 100);
      await page.touchscreen.tap(box.x + box.width * 0.4, box.y + box.height * 0.4);
      const sample = await diag.collectFpsSample(frame, 300);
      assert.ok(sample.drawsDelta > 0);
      await closeAppModal(page);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F7-04: desktop-1366 (1366x768) persistent sidebar, 0 overflow, and mouse drag orbit on canvas', async () => {
    const app = pickRepresentativeApp(catalog, 'Ambientes avulsos');
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      assert.equal(await page.locator('#side').isVisible(), true);
      assert.equal(await page.locator('#menuBtn').isVisible(), false);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);

      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 1, 25000);
      const box = await frame.locator('canvas').first().boundingBox();
      assert.ok(box && box.width > 500 && box.height > 400);

      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2 + 20, { steps: 5 });
      await page.mouse.up();
      await closeAppModal(page);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F7-05: desktop-1920 (1920x1080) multi-column grid & interactive controls on Clepsidra do Foco', async () => {
    const app = pickRepresentativeApp(catalog, 'Adultos e marcas');
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1920', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const colsCount = await page.evaluate(() => {
        const grid = document.querySelector('#list .grid');
        if (!grid) return 0;
        const tpl = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean);
        return tpl.length;
      });
      assert.ok(colsCount >= 3, `Esperado >= 3 colunas em 1920x1080, obtido ${colsCount}`);

      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 1, 15000);
      await frame.locator('#btn-15').click();
      await frame.locator('#btn-valve').click();
      assert.equal(await frame.locator('#btn-15').evaluate((el) => el.classList.contains('active')), true);
      assert.match(await frame.locator('#btn-valve').innerText(), /Fechar Válvula/);
      await closeAppModal(page);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });
});

// ============================================================================
// F8 — Adaptive Quality & WebGL Resilience (5 checks)
// ============================================================================
describe('F8: Adaptive Quality & WebGL Resilience', () => {
  test('F8-01: M0 SET_QUALITY bridge command (LOW -> HIGH) updates quality profile', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await waitForLauncherReady(page);
      const { frame } = await openAppInModal(page, app.id);
      await waitForWebGLDraws(frame, 1, 15000);

      await sendBridgeCommand(page, 'SET_QUALITY', { quality: 'LOW', profile: 'LOW' }, { protocol: 'v2' });
      await delay(150);
      const qLow = await frame.evaluate(() => window.__SANGI_QA__?.quality ?? null);
      assert.equal(qLow, 'LOW', 'SET_QUALITY LOW deve atualizar window.__SANGI_QA__.quality');

      await sendBridgeCommand(page, 'SET_QUALITY', { quality: 'HIGH', profile: 'HIGH' }, { protocol: 'v2' });
      await delay(150);
      const qHigh = await frame.evaluate(() => window.__SANGI_QA__?.quality ?? null);
      assert.equal(qHigh, 'HIGH', 'SET_QUALITY HIGH deve restaurar window.__SANGI_QA__.quality');
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F8-02: M0 window.__SANGI_QA__ exposes numeric fps, frameTime, draws/drawCalls, and triangles', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await page.goto(`${baseUrl}${app.url}`, { waitUntil: 'domcontentloaded' });
      await waitForWebGLDraws(page, 2, 15000);
      await delay(1100);

      const qa = await page.evaluate(() => window.__SANGI_QA__ ?? null);
      assert.ok(qa && typeof qa === 'object', 'window.__SANGI_QA__ ausente');
      assert.ok(Number.isFinite(qa.fps), `fps inválido: ${qa.fps}`);
      assert.ok(Number.isFinite(qa.frameTime), `frameTime inválido: ${qa.frameTime}`);
      const drawsVal = qa.drawCalls ?? qa.draws;
      assert.ok(Number.isFinite(drawsVal), `drawCalls/draws inválido: ${drawsVal}`);
      assert.ok(Number.isFinite(qa.triangles), `triangles inválido: ${qa.triangles}`);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F8-03: Simulated webglcontextlost recovers cleanly after restoreContext() with 0 pageerror', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await page.goto(`${baseUrl}${app.url}`, { waitUntil: 'domcontentloaded' });
      await waitForWebGLDraws(page, 2, 15000);

      const lossResult = await diag.triggerWebGLContextLoss(page, { restoreAfterMs: 300 });
      assert.equal(lossResult.ok, true, `Falha ao simular perda de contexto: ${lossResult.reason}`);
      await delay(500);

      const sample = await diag.collectFpsSample(page, 500);
      assert.ok(sample.drawsDelta > 0, 'Renderização deve recuperar após restoreContext()');
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F8-04: Zero shader / NaN geometry diagnostics across reference apps', async () => {
    const refs = [
      pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary),
      pickRepresentativeApp(catalog, 'Adultos e marcas'),
      pickRepresentativeApp(catalog, 'Ambientes avulsos'),
    ];
    for (const app of refs) {
      const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
      const diag = await attachDiagnostics(page, { baseUrl });
      try {
        await page.goto(`${baseUrl}${app.url}`, { waitUntil: 'domcontentloaded' });
        await waitForWebGLDraws(page, 1, 25000);
        await delay(400);
        const errs = diag.getErrors();
        assert.deepEqual(errs.nanOrShaderWarnings, [], `Avisos Shader/NaN em ${app.id}: ${JSON.stringify(errs.nanOrShaderWarnings)}`);
        diag.assertClean();
      } finally {
        await context.close();
      }
    }
  });

  test('F8-05: prefers-reduced-motion: reduce renders cleanly with initial WebGL draws and 0 errors', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', {
      baseUrl,
      reducedMotion: 'reduce',
    });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await page.goto(`${baseUrl}${app.url}`, { waitUntil: 'domcontentloaded' });
      await waitForWebGLDraws(page, 1, 15000);
      const stats = await diag.getResourceStats(page);
      assert.ok(stats.draws > 0);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });
});

// ============================================================================
// F9 — Catalog & Deterministic Build Parity (5 checks)
// ============================================================================
describe('F9: Catalog & Deterministic Build Parity', () => {
  test('F9-01: node scripts/verify-catalog.mjs exits 0 with zero [ERRO] lines', async () => {
    const { stdout, stderr } = await execFileAsync(process.execPath, ['scripts/verify-catalog.mjs'], {
      cwd: REPO_ROOT,
      windowsHide: true,
    });
    assert.ok(!/\[ERRO\]/.test(stdout + stderr), `verify-catalog.mjs reportou erro:\n${stdout}\n${stderr}`);
  });

  test('F9-02: M0 api/apps.json and launcher/api/apps.json are deep-equal with 0 concept+ready contradictions', () => {
    const rootApps = JSON.parse(readFileSync(join(REPO_ROOT, 'api', 'apps.json'), 'utf8'));
    const launcherApps = JSON.parse(readFileSync(join(REPO_ROOT, 'launcher', 'api', 'apps.json'), 'utf8'));
    assert.deepEqual(rootApps, launcherApps, 'api/apps.json e launcher/api/apps.json divergem');
    const bad = rootApps.filter((a) => a.kind === 'concept' && a.status === 'ready');
    assert.deepEqual(bad.map((a) => a.id), []);
  });

  test('F9-03: Every ready entry in api/apps.json resolves to an existing HTML/dist target on disk', () => {
    const rootApps = JSON.parse(readFileSync(join(REPO_ROOT, 'api', 'apps.json'), 'utf8'));
    const missing = [];
    for (const app of rootApps) {
      if (app.status !== 'ready' || !app.url) continue;
      const cleanRel = decodeURIComponent(app.url.split('?')[0].split('#')[0]).replace(/^\//, '');
      const rootFile = join(REPO_ROOT, cleanRel);
      const launcherFile = join(REPO_ROOT, 'launcher', cleanRel);
      if (!existsSync(rootFile) && !existsSync(launcherFile)) {
        missing.push({ id: app.id, url: app.url });
      }
    }
    assert.deepEqual(missing, [], `Arquivos ausentes para apps ready: ${JSON.stringify(missing)}`);
  });

  test('F9-04: M0 launcher/ mirrors index.html, shared/* (bridge/imersivo/kit/engine), and 01_Jogos_HTML/', () => {
    const rootIndex = readFileSync(join(REPO_ROOT, 'index.html'), 'utf8');
    const launcherIndex = readFileSync(join(REPO_ROOT, 'launcher', 'index.html'), 'utf8');
    assert.equal(rootIndex, launcherIndex, 'index.html e launcher/index.html divergem');

    for (const rel of ['sangi-bridge.js', 'imersivo.js', 'ambientes-kit.js']) {
      const src = join(REPO_ROOT, 'shared', rel);
      const dst = join(REPO_ROOT, 'launcher', 'shared', rel);
      assert.ok(existsSync(dst), `Espelho ausente: launcher/shared/${rel}`);
      assert.equal(readFileSync(src, 'utf8'), readFileSync(dst, 'utf8'), `Conteúdo divergente: launcher/shared/${rel}`);
    }

    const engineDir = join(REPO_ROOT, 'shared', 'engine');
    for (const file of readdirSync(engineDir)) {
      const src = join(engineDir, file);
      const dst = join(REPO_ROOT, 'launcher', 'shared', 'engine', file);
      assert.ok(existsSync(dst), `Espelho ausente: launcher/shared/engine/${file}`);
      assert.equal(readFileSync(src, 'utf8'), readFileSync(dst, 'utf8'), `Conteúdo divergente: launcher/shared/engine/${file}`);
    }

    assert.ok(
      existsSync(join(REPO_ROOT, 'launcher', '01_Jogos_HTML')),
      'Espelho ausente: launcher/01_Jogos_HTML/',
    );
  });

  test('F9-05: vercel.json rewrites /api/apps -> /api/apps.json and launcher falls back to /api/apps.json on 404', async () => {
    const vercel = JSON.parse(readFileSync(join(REPO_ROOT, 'vercel.json'), 'utf8'));
    assert.ok(
      vercel.rewrites?.some((r) => r.source === '/api/apps' && r.destination === '/api/apps.json'),
      'Rewrite /api/apps -> /api/apps.json ausente em vercel.json',
    );

    const { context, page } = await createIsolatedContext(swiftBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await page.route('**/api/apps', (route) => route.fulfill({ status: 404, body: 'Not found' }));
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#list .card', { timeout: 15000 });
      assert.ok((await page.locator('#list .card').count()) > 0);
      // Note: intercepted 404 on /api/apps is expected in this negative fallback test; assert 0 pageerrors
      assert.deepEqual(diag.getErrors().pageErrors, []);
    } finally {
      await context.close();
    }
  });
});

// ============================================================================
// F10 — Hardware GPU Sustained Performance & Stability (5 checks)
// ============================================================================
describe('F10: Hardware GPU Sustained Performance & Stability', () => {
  const benchMs = Math.max(1000, Number(process.env.SANGI_E2E_BENCH_SECONDS || 5) * 1000);
  let hwBrowser;

  before(async () => {
    const launched = await launchBrowser({ gpu: 'hardware' });
    hwBrowser = launched.browser;
  });

  after(async () => {
    await hwBrowser?.close().catch(() => {});
  });

  test('F10-01: Hardware GPU D3D11 active (UNMASKED_RENDERER_WEBGL is not SwiftShader)', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(hwBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await page.goto(`${baseUrl}${app.url}`, { waitUntil: 'domcontentloaded' });
      await waitForWebGLDraws(page, 1, 15000);
      const info = await diag.getWebGLRendererInfo(page);
      assert.ok(info.renderer && typeof info.renderer === 'string', `Renderer ausente: ${JSON.stringify(info)}`);
      assert.ok(!/swiftshader/i.test(info.renderer), `Renderer inesperado (software): ${info.renderer}`);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F10-02: Desktop 1920x1080 sustained >= 60 FPS & 0 NaN (Observatório da Luz)', async () => {
    const app = pickRepresentativeApp(catalog, 'Kit 17 jogos 3D', (a) => a.id === REPRESENTATIVE_SAMPLES['Kit 17 jogos 3D'].primary);
    const { context, page } = await createIsolatedContext(hwBrowser, 'desktop-1920', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await page.goto(`${baseUrl}${app.url}`, { waitUntil: 'domcontentloaded' });
      await waitForWebGLDraws(page, 2, 15000);
      const sample = await diag.collectFpsSample(page, benchMs);
      assert.ok(sample.drawsDelta > 0);
      assert.equal(sample.nanDetected, false);
      assert.ok(sample.fps >= 60, `FPS abaixo do alvo de produção (60 FPS): ${sample.fps} FPS (p95=${sample.p95FrameMs}ms)`);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F10-03: Desktop 1366x768 sustained >= 60 FPS & p95 <= 25ms (Lago 3D Interativo)', async () => {
    const app = pickRepresentativeApp(catalog, 'Ambientes avulsos');
    const { context, page } = await createIsolatedContext(hwBrowser, 'desktop-1366', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await page.goto(`${baseUrl}${app.url}`, { waitUntil: 'domcontentloaded' });
      await waitForWebGLDraws(page, 2, 25000);
      const sample = await diag.collectFpsSample(page, benchMs);
      assert.ok(sample.drawsDelta > 0);
      assert.equal(sample.nanDetected, false);
      assert.ok(sample.fps >= 60, `FPS abaixo de 60: ${sample.fps} FPS (p95=${sample.p95FrameMs}ms)`);
      assert.ok(sample.p95FrameMs <= 25, `p95FrameMs acima de 25ms: ${sample.p95FrameMs}ms`);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F10-04: Mobile 360x640 sustained >= 30 FPS (Escada da Coragem)', async () => {
    const app = pickRepresentativeApp(catalog, 'Jardins da TCC');
    const { context, page } = await createIsolatedContext(hwBrowser, 'mobile-360', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await page.goto(`${baseUrl}${app.url}`, { waitUntil: 'domcontentloaded' });
      await waitForWebGLDraws(page, 2, 25000);
      const sample = await diag.collectFpsSample(page, benchMs);
      assert.ok(sample.drawsDelta > 0);
      assert.equal(sample.nanDetected, false);
      assert.ok(sample.fps >= 30, `FPS mobile abaixo de 30: ${sample.fps} FPS (p95=${sample.p95FrameMs}ms)`);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });

  test('F10-05: Mobile 390x844 sustained >= 30 FPS under touch interaction (Clepsidra do Foco)', async () => {
    const app = pickRepresentativeApp(catalog, 'Adultos e marcas');
    const { context, page } = await createIsolatedContext(hwBrowser, 'mobile-390', { baseUrl });
    const diag = await attachDiagnostics(page, { baseUrl });
    try {
      await page.goto(`${baseUrl}${app.url}`, { waitUntil: 'domcontentloaded' });
      await waitForWebGLDraws(page, 2, 15000);

      const box = await page.locator('canvas').first().boundingBox();
      assert.ok(box);
      const [sample] = await Promise.all([
        diag.collectFpsSample(page, benchMs),
        (async () => {
          await delay(300);
          await page.touchscreen.tap(box.x + box.width * 0.4, box.y + box.height * 0.35);
          await delay(300);
          await page.touchscreen.tap(box.x + box.width * 0.6, box.y + box.height * 0.35);
        })(),
      ]);

      assert.ok(sample.drawsDelta > 0);
      assert.equal(sample.nanDetected, false);
      assert.ok(sample.fps >= 30, `FPS mobile abaixo de 30: ${sample.fps} FPS (p95=${sample.p95FrameMs}ms)`);
      diag.assertClean();
    } finally {
      await context.close();
    }
  });
});
