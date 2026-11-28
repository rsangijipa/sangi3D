// scripts/check-all-games.mjs
// Abre cada jogo do catálogo num navegador headless (via Sistema/launcher/server.mjs) e lista os que falham:
// página com erro HTTP, erro de JavaScript, recurso 404 ou nenhum <canvas> renderizado.
// Uso: node scripts/check-all-games.mjs [trecho-do-id] [--wait 4000] [--port 5299]
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
const filter = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const BASE = `http://127.0.0.1:${PORT}`;

const server = spawn(process.execPath, ['Sistema/launcher/server.mjs', '--port', String(PORT), '--no-prebuild'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('Servidor não respondeu')), 15000);
  server.stdout.on('data', (d) => { if (String(d).includes('http://')) { clearTimeout(t); resolve(); } });
  server.on('exit', (c) => reject(new Error(`Servidor saiu (${c})`)));
});

const apps = await (await fetch(BASE + '/api/apps')).json();
const list = apps.filter((a) => a.url && (!filter || a.id.includes(filter)));
console.log(`Verificando ${list.length} jogos…`);

const { browser } = await launchBrowser({ headless: true });
const results = [];
let next = 0;
async function worker() {
  while (next < list.length) {
    const app = list[next++];
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    const errors = new Set();
    page.on('pageerror', (e) => errors.add('JS: ' + String(e.message).slice(0, 160)));
    page.on('response', (r) => {
      if (r.status() >= 400 && !/favicon\.ico$/.test(r.url())) errors.add(`${r.status()} ${decodeURIComponent(r.url().replace(BASE, ''))}`);
    });
    let status = 0;
    try {
      status = (await page.goto(BASE + app.url, { waitUntil: 'load', timeout: 30000 }))?.status() ?? 0;
      // Alguns jogos montam o canvas depois de carregar módulos e texturas.
      await page.waitForFunction(() => [...document.querySelectorAll('canvas')].some((c) => c.width > 50 && c.height > 50), null, { timeout: WAIT }).catch(() => {});
    } catch (e) { errors.add('Abrir: ' + e.message.split('\n')[0].slice(0, 140)); }
    const canvas = await page.evaluate(() => [...document.querySelectorAll('canvas')].filter((c) => c.width > 50 && c.height > 50).length).catch(() => 0);
    if (status >= 400) errors.add(`Página respondeu ${status}`);
    if (!canvas) errors.add('Nenhum canvas 3D apareceu');
    results.push({ id: app.id, name: app.name, url: app.url, ok: errors.size === 0, problems: [...errors].slice(0, 6) });
    process.stdout.write(errors.size ? 'x' : '.');
    await ctx.close();
  }
}
try {
  await Promise.all(Array.from({ length: 4 }, worker));
} finally {
  await browser.close();
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
