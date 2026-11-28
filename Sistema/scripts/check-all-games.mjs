// scripts/check-all-games.mjs
// Abre cada jogo do catálogo num navegador headless (via Sistema/launcher/server.mjs) e lista os que falham:
// página com erro HTTP, falha de recurso ou sem o sinal esperado de inicialização.
// Uso: node Sistema/scripts/check-all-games.mjs [trecho-do-id] [--wait 4000] [--port 5299] [--workers 4] [--offline]
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from '../test/lib/playwright-resolver.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const PORT = Number(opt('--port', 5299));
const WAIT = Number(opt('--wait', 4000));
const WORKERS = Number(opt('--workers', 4));
const filter = args.find((a, i) => !a.startsWith('--') && !['--wait', '--port', '--workers'].includes(args[i - 1]));
const offline = args.includes('--offline');
assert.ok(Number.isInteger(WORKERS) && WORKERS > 0, 'Use um número positivo de workers.');
const BASE = `http://127.0.0.1:${PORT}`;

const visibleCanvas = () => [...document.querySelectorAll('canvas')].some((canvas) => {
  const bounds = canvas.getBoundingClientRect();
  return canvas.width > 50 && canvas.height > 50 && bounds.width > 0 && bounds.height > 0
    && getComputedStyle(canvas).visibility === 'visible';
});

async function verifyDomPuzzle(page) {
  await page.locator('#puzzle-reference').click();
  await page.locator('#puzzle-guide').waitFor({ state: 'visible' });
}

async function verifyShellPhotography(page) {
  await page.locator('#btn-photo-mode').click();
  const macro = page.locator('[data-framing-btn="macro"]');
  await macro.click();
  assert.match(await macro.getAttribute('class'), /\bactive\b/);
  const [file] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#btn-capture-png').click(),
  ]);
  const data = fs.readFileSync(await file.path());
  assert.deepEqual([...data.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.ok(data.length > 1000, 'A captura deve conter a cena.');
}

const server = spawn(process.execPath, ['Sistema/launcher/server.mjs', '--port', String(PORT), '--no-prebuild'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('Servidor não respondeu')), 15000);
  server.stdout.on('data', (d) => { if (String(d).includes('http://')) { clearTimeout(t); resolve(); } });
  server.on('exit', (c) => reject(new Error(`Servidor saiu (${c})`)));
});

const apps = await (await fetch(BASE + '/api/apps')).json();
const list = apps.filter((a) => a.url && (!filter || a.id.includes(filter)));
console.log(`Verificando ${list.length} jogos…`);

let browser;
const results = [];
let next = 0;
async function worker() {
  while (next < list.length) {
    const app = list[next++];
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
    const page = await ctx.newPage();
    page.setDefaultTimeout(WAIT);
    const errors = new Set();
    if (offline) {
      await ctx.route('**/*', (route) => {
        const request = route.request();
        return new URL(request.url()).origin === BASE ? route.continue() : route.abort('internetdisconnected');
      });
    }
    page.on('pageerror', (e) => errors.add('JS: ' + String(e.message).slice(0, 160)));
    page.on('requestfailed', (request) => {
      const reason = request.failure()?.errorText;
      if (reason === 'net::ERR_ABORTED' || /\/favicon\.ico(?:\?|$)/.test(request.url())) return;
      const scope = new URL(request.url()).origin === BASE ? 'Recurso local' : 'Recurso externo';
      errors.add(scope + ' (' + request.resourceType() + '): ' + reason + ' ' + request.url().replace(BASE, ''));
    });
    page.on('response', (r) => {
      if (r.status() >= 400 && !/favicon\.ico$/.test(r.url())) errors.add(`${r.status()} ${decodeURIComponent(r.url().replace(BASE, ''))}`);
    });
    let status = 0;
    let check = 'canvas visível';
    try {
      status = (await page.goto(BASE + app.url, { waitUntil: 'load', timeout: 30000 }))?.status() ?? 0;
      if (app.id.includes('-restauro-de-azulejos-')) {
        check = 'referência do quebra-cabeça';
        await verifyDomPuzzle(page);
      } else if (app.id.includes('-geometria-das-conchas-')) {
        check = 'fotografia macro';
        await verifyShellPhotography(page);
      } else {
        await page.waitForFunction(visibleCanvas, null, { timeout: WAIT });
      }
    } catch (e) {
      errors.add(check + ': ' + e.message.split('\n')[0].slice(0, 140));
    }
    if (status < 200 || status >= 400) errors.add(`Página respondeu ${status}`);
    results.push({ id: app.id, name: app.name, url: app.url, check, ok: errors.size === 0, problems: [...errors].slice(0, 6) });
    process.stdout.write(errors.size ? 'x' : '.');
    await ctx.close();
  }
}
try {
  assert.ok(list.length > 0, 'Nenhuma entrada corresponde ao filtro.');
  ({ browser } = await launchBrowser({ headless: true }));
  await Promise.all(Array.from({ length: Math.min(WORKERS, list.length) }, worker));
} finally {
  await browser?.close();
  server.kill();
}

const bad = results.filter((r) => !r.ok);
const out = path.join(ROOT, '.tmp', 'check-all-games.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(results, null, 2));
console.log(`\n\n${results.length - bad.length}/${results.length} jogos abriram sem problemas.`);
for (const r of bad) console.log(`\n✗ ${r.name}  ${r.url}\n    ${r.problems.join('\n    ')}`);
console.log(`\nRelatório: ${path.relative(ROOT, out)}`);
process.exit(bad.length ? 1 : 0);
