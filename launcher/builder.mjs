// Builder do launcher: compila (npm run build) os projetos que têm arquitetura própria
// quando o dist/ não existe ou está mais velho que o código-fonte. Um build por vez.
import { spawn } from 'node:child_process';
import { readdir, stat, readFile, writeFile, cp, rm, rename } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';

const BACKUP = '.dist-launcher-backup';
const STAMP = '.launcher-build';
const BUILD_TIMEOUT_MS = 6 * 60 * 1000;
// Pastas que não entram na comparação "código mais novo que o build".
const IGNORE_DIRS = new Set(['node_modules', 'dist', BACKUP, 'tests', 'test', 'e2e', '__tests__', 'coverage',
  'capturas', 'scripts', 'demonstracao']);
const CODE = /\.(ts|tsx|js|jsx|mjs|cjs|css|scss|html|json|glsl|vert|frag|wgsl)$/i;
const LAUNCHER_PILL = /<a\s+href="\/"[^>]*title="Voltar ao Launcher Principal"[^>]*>[\s\S]*?<\/a>/i;

const jobs = new Map(); // dir -> estado
const queue = [];
let running = false;

const exists = (p) => stat(p).then(() => true, () => false);
// Node também resolve dependências de uma coleção na pasta superior.
// Evita tentar baixar novamente os pacotes locais compartilhados.
export async function hasInstalledDependencies(dir, names) {
  for (const name of names) {
    let current = dir;
    let found = false;
    for (;;) {
      if (await exists(join(current, 'node_modules', name, 'package.json'))) { found = true; break; }
      const parent = dirname(current);
      if (parent === current) break;
      current = parent;
    }
    if (!found) return false;
  }
  return true;
}
const mtime = (p) => stat(p).then((s) => s.mtimeMs, () => 0);

export async function readPackage(dir) {
  try { return JSON.parse(await readFile(join(dir, 'package.json'), 'utf8')); } catch { return null; }
}

/** Projeto "com arquitetura própria": package.json com script build + index.html de entrada. */
export async function isBuildProject(dir, files) {
  if (!files.includes('package.json') || !files.includes('index.html')) return false;
  const pkg = await readPackage(dir);
  return Boolean(pkg?.scripts?.build);
}

async function newestSource(dir, top = dir) {
  let max = 0;
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return 0; }
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name.startsWith('_')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (IGNORE_DIRS.has(e.name)) continue;
      max = Math.max(max, await newestSource(p, top));
      continue;
    }
    const rel = relative(top, p);
    const inAssets = /^(src|public|assets)[\\/]/.test(rel);
    if (!inAssets && !CODE.test(e.name)) continue;
    if (/package-lock\.json$|\.tsbuildinfo$|\.timestamp-/i.test(e.name)) continue;
    max = Math.max(max, await mtime(p));
  }
  return max;
}

export async function needsBuild(dir) {
  // Alguns builds copiam o index.html mantendo a data antiga: vale também o carimbo do último build.
  const distM = Math.max(await mtime(join(dir, 'dist', 'index.html')), await mtime(join(dir, 'dist', STAMP)));
  if (!distM) return true;
  return (await newestSource(dir)) > distM + 1000;
}

function job(dir) {
  if (!jobs.has(dir)) jobs.set(dir, { state: 'idle', step: '', log: [], error: null, startedAt: 0, finishedAt: 0 });
  return jobs.get(dir);
}

export function snapshot(dir) {
  const j = jobs.get(dir);
  if (!j) return { state: 'idle' };
  return { state: j.state, step: j.step, error: j.error, startedAt: j.startedAt, finishedAt: j.finishedAt,
    log: j.log.slice(-40).join('\n'), position: j.state === 'queued' ? queue.indexOf(dir) + 1 : 0 };
}

/** Coloca na fila se precisar (ou se force). priority = vai para a frente da fila. */
export async function ensureBuilt(dir, { force = false, priority = false, name = '' } = {}) {
  const j = job(dir);
  if (name) j.name = name;
  if (j.state === 'building' || j.state === 'installing') return snapshot(dir);
  if (j.state === 'queued') {
    if (priority) { queue.splice(queue.indexOf(dir), 1); queue.unshift(dir); }
    return snapshot(dir);
  }
  // Depois de um erro, só tenta de novo sozinho se o código mudou desde a tentativa.
  if (!force && j.state === 'error' && (await newestSource(dir)) <= j.srcAtStart) return snapshot(dir);
  if (!force && !(await needsBuild(dir))) { j.state = 'ready'; return snapshot(dir); }
  j.state = 'queued'; j.error = null; j.log = []; j.step = 'Na fila';
  if (priority) queue.unshift(dir); else queue.push(dir);
  runQueue();
  return snapshot(dir);
}

function run(cmd, cwd, j) {
  return new Promise((resolveRun) => {
    const child = spawn(cmd, { cwd, shell: true, windowsHide: true,
      env: { ...process.env, BROWSER: 'none', FORCE_COLOR: '0', NO_COLOR: '1' } });
    const push = (buf) => {
      for (const line of buf.toString().split(/\r?\n/)) {
        const clean = line.replace(/\x1b\[[0-9;]*m/g, '').trimEnd();
        if (clean) { j.log.push(clean); if (j.log.length > 400) j.log.shift(); }
      }
    };
    child.stdout.on('data', push);
    child.stderr.on('data', push);
    const timer = setTimeout(() => {
      j.log.push(`Tempo esgotado (${BUILD_TIMEOUT_MS / 60000} min).`);
      if (process.platform === 'win32') spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true });
      else child.kill('SIGKILL');
    }, BUILD_TIMEOUT_MS);
    child.on('error', (err) => { j.log.push(String(err)); });
    child.on('close', (code) => { clearTimeout(timer); resolveRun(code ?? 1); });
  });
}

async function buildOne(dir) {
  const j = job(dir);
  const label = j.name || relative(process.cwd(), dir);
  j.startedAt = Date.now(); j.finishedAt = 0;
  j.srcAtStart = await newestSource(dir);
  const dist = join(dir, 'dist');
  const backup = join(dir, BACKUP);
  const pkg = await readPackage(dir);
  const deps = Object.keys({ ...pkg?.dependencies, ...pkg?.devDependencies });

  try {
    if (deps.length && !(await hasInstalledDependencies(dir, deps))) {
      j.state = 'installing'; j.step = 'Instalando dependências (só na primeira vez)';
      console.log(`[build] ${label}: instalando dependências…`);
      const hasLock = await exists(join(dir, 'package-lock.json'));
      const code = await run(hasLock ? 'npm ci --no-audit --no-fund' : 'npm install --no-audit --no-fund', dir, j);
      if (code !== 0) throw new Error('Falha ao instalar dependências');
    }

    j.state = 'building'; j.step = 'Compilando o jogo';
    console.log(`[build] ${label}: compilando…`);
    const oldIndex = await readFile(join(dist, 'index.html'), 'utf8').catch(() => '');
    const pill = oldIndex.match(LAUNCHER_PILL)?.[0];
    const hadDist = await exists(dist);
    await rm(backup, { recursive: true, force: true });
    if (hadDist) await cp(dist, backup, { recursive: true });

    const code = await run('npm run build', dir, j);
    const newIndexPath = join(dist, 'index.html');
    if (code !== 0 || !(await exists(newIndexPath))) {
      if (hadDist) {
        await rm(dist, { recursive: true, force: true });
        await rename(backup, dist);
        j.log.push('Build falhou — a versão anterior foi mantida.');
      }
      throw new Error('O build falhou');
    }
    // Mantém o botão "← Launcher" que existia no build anterior.
    if (pill) {
      const html = await readFile(newIndexPath, 'utf8');
      if (!/Voltar ao Launcher Principal/i.test(html)) await writeFile(newIndexPath, html.replace(/<body([^>]*)>/i, `<body$1>\n    ${pill}`));
    }
    await writeFile(join(dist, STAMP), new Date().toISOString());
    await rm(backup, { recursive: true, force: true });
    j.state = 'ready'; j.step = 'Pronto'; j.error = null;
    console.log(`[build] ${label}: pronto em ${Math.round((Date.now() - j.startedAt) / 1000)}s`);
  } catch (err) {
    j.state = 'error'; j.step = 'Erro'; j.error = err.message;
    console.log(`[build] ${label}: ERRO — ${err.message}`);
  } finally {
    j.finishedAt = Date.now();
  }
}

async function runQueue() {
  if (running) return;
  running = true;
  try {
    while (queue.length) await buildOne(queue.shift());
  } finally { running = false; }
}
