// Capturas de referência com GPU real (ANGLE/D3D11) para comparação com o mockup e miniatura do launcher.
// Uso: npm run build && node tests/capture.mjs
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { mkdir, readFile, stat, writeFile, copyFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.TEAR_PLAYWRIGHT || resolve('../Kit_17_jogos_3D_mockups_e_prompts/08-meteorologia-das-emocoes/node_modules/playwright'));
const DIST = resolve('dist');
const OUT = resolve('capturas');
await mkdir(OUT, { recursive: true });
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = join(DIST, url === '/' ? 'index.html' : url);
  try { if (!(await stat(file)).isFile()) throw 0; res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' }); res.end(await readFile(file)); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/`;
const exe = process.env.TEAR_CHROME || [`${process.env.LOCALAPPDATA}/ms-playwright/chromium-1243/chrome-win64/chrome.exe`].find((p) => existsSync(p));
const browser = await chromium.launch({ headless: true, executablePath: exe, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'] });

const shots = [
  { name: 'cinema-1920x1080-geral', vw: 1920, vh: 1080, q: 'cinema', view: 'geral', tool: 'entrelacar' },
  { name: 'cinema-1920x1080-cruzamento', vw: 1920, vh: 1080, q: 'cinema', view: 'cruzamento', tool: 'entrelacar', hud: false },
  { name: 'cinema-1920x1080-tecido', vw: 1920, vh: 1080, q: 'cinema', view: 'tecido', tool: 'tecido', hud: false },
  { name: 'cinema-1920x1080-novelos', vw: 1920, vh: 1080, q: 'cinema', view: 'novelos', tool: 'fio' },
  { name: 'equilibrada-1280x720-geral', vw: 1280, vh: 720, q: 'equilibrada', view: 'geral', tool: 'entrelacar' },
  { name: 'leve-1280x720-geral', vw: 1280, vh: 720, q: 'leve', view: 'geral', tool: 'entrelacar' },
  { name: 'celular-390x844-geral', vw: 390, vh: 844, q: 'equilibrada', view: 'geral', tool: 'entrelacar', touch: true },
  { name: 'celular-360x640-geral', vw: 360, vh: 640, q: 'leve', view: 'geral', tool: 'entrelacar', touch: true },
];
const report = [];
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: { width: s.vw, height: s.vh }, deviceScaleFactor: 1, hasTouch: Boolean(s.touch), isMobile: Boolean(s.touch) });
  const page = await ctx.newPage();
  await page.goto(`${BASE}?qualidade=${s.q}`);
  await page.waitForFunction(() => window.__tear?.world, null, { timeout: 120000 });
  await page.evaluate(({ tool, view, hud }) => {
    const t = window.__tear;
    t.actions.start('livre', null, false);
    t.seed();
    t.actions.tool(tool);
    if (tool !== 'fio') t.ui.closePanel();
    t.world.setView(view, true);
    if (hud === false) document.getElementById('hud').classList.add('collapsed');
  }, s);
  await page.waitForTimeout(3500);
  const stats = await page.evaluate(() => window.__tear.world.engine.stats());
  const gpu = await page.evaluate(() => { const gl = window.__tear.world.engine.renderer.getContext(); const d = gl.getExtension('WEBGL_debug_renderer_info'); return d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'n/d'; });
  await page.screenshot({ path: join(OUT, `${s.name}.png`) });
  report.push({ ...s, gpu, stats });
  console.log(s.name, stats.tier, `p50 ${stats.p50.toFixed(1)}ms p95 ${stats.p95.toFixed(1)}ms`, `calls ${stats.calls}`, `tris ${stats.triangles}`, gpu);
  await ctx.close();
}
await browser.close();
server.close();
await writeFile(join(OUT, 'capturas-gpu.json'), JSON.stringify(report, null, 2));
await copyFile(join(OUT, 'cinema-1920x1080-geral.png'), resolve('miniatura.png'));
