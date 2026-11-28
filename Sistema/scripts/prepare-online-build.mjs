// Sistema/scripts/prepare-online-build.mjs
// Compila os projetos desatualizados e monta a pasta "Publicacao_Online/" (fora do git) para publicar na Vercel.
// A pasta repete os mesmos endereços do launcher local:
//   index.html, loading.html, ids-antigos.js, capas/  (o vercel.json reescreve /launcher/* para /*)
//   Jogos/, Sistema/shared/, api/apps.json, vercel.json
// Uso: node Sistema/scripts/prepare-online-build.mjs [--rebuild] [--install-deps] [--output-only] [--no-build] [--out <pasta>]
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { isBuildProject, needsBuild, hasInstalledDependencies, readPackage } from '../launcher/builder.mjs';
import { generateCatalog, ROOT } from './generate-catalog.mjs';

const IGNORE_NAMES = new Set([
  'node_modules', '.git', '.vite', '_versoes', '.tmp', 'tmp',
  '.dist-launcher-backup', '.launcher-build', '.hyperframes', '.cache',
]);

const LAUNCHER_FILES = ['index.html', 'loading.html', 'ids-antigos.js', 'vercel.json'];

function fileHash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function copyFileIfChanged(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest)) {
    const srcStat = fs.statSync(src);
    const destStat = fs.statSync(dest);
    if (srcStat.size === destStat.size && fileHash(src) === fileHash(dest)) {
      return false;
    }
  }
  fs.copyFileSync(src, dest);
  return true;
}

function syncDir(src, dest, ignoreSet = IGNORE_NAMES) {
  if (!fs.existsSync(src)) return;
  const srcLstat = fs.lstatSync(src);
  if (srcLstat.isSymbolicLink()) return;
  if (ignoreSet.has(path.basename(src))) return;

  if (!srcLstat.isDirectory()) {
    copyFileIfChanged(src, dest);
    return;
  }

  fs.mkdirSync(dest, { recursive: true });
  const srcEntries = fs.readdirSync(src, { withFileTypes: true });
  const validNames = new Set();

  for (const entry of srcEntries) {
    if (ignoreSet.has(entry.name)) continue;
    if (entry.isSymbolicLink()) continue;
    validNames.add(entry.name);
  }

  for (const existing of fs.readdirSync(dest, { withFileTypes: true })) {
    if (!validNames.has(existing.name)) {
      fs.rmSync(path.join(dest, existing.name), { recursive: true, force: true });
    }
  }

  for (const name of validNames) {
    syncDir(path.join(src, name), path.join(dest, name), ignoreSet);
  }
}

async function findBuildProjects(gamesDir) {
  const found = [];
  const skipWalk = new Set([...IGNORE_NAMES, 'dist', 'src', 'public', 'assets', 'capturas', 'demonstracao', 'shared', 'test', 'tests', 'scripts']);
  async function walk(dir, depth) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    const files = entries.filter((e) => e.isFile()).map((e) => e.name);
    const dirs = entries.filter((e) => e.isDirectory() && !e.isSymbolicLink()).map((e) => e.name);
    if (dir !== gamesDir && await isBuildProject(dir, files)) { found.push(dir); return; }
    if (depth >= 3) return;
    for (const d of dirs) {
      if (skipWalk.has(d) || d.startsWith('_') || d.startsWith('.')) continue;
      await walk(path.join(dir, d), depth + 1);
    }
  }
  await walk(gamesDir, 0);
  return found;
}

function syncSharedToHtmlCollections(rootDir) {
  const sharedDir = path.join(rootDir, 'Sistema', 'shared');
  const copies = [
    ['imersivo.js', path.join(rootDir, 'Jogos', '1 - Jogos HTML', 'shared')],
    ['imersivo.js', path.join(rootDir, 'Jogos', '9 - Arquivados', 'shared')],
    ['sangi-bridge.js', path.join(rootDir, 'Jogos', '1 - Jogos HTML', 'shared')],
  ];
  for (const [name, destDir] of copies) {
    const src = path.join(sharedDir, name);
    if (fs.existsSync(src) && fs.existsSync(path.dirname(destDir))) copyFileIfChanged(src, path.join(destDir, name));
  }
}

export async function prepareOnlineBuild({
  rootDir = ROOT,
  outDir = path.join(rootDir, 'Publicacao_Online'),
  rebuild = false,
  noBuild = false,
  installDeps = false,
  outputOnly = false,
  quiet = false,
} = {}) {
  const log = (...args) => { if (!quiet) console.log(...args); };
  const launcherDir = path.join(rootDir, 'Sistema', 'launcher');

  if (!noBuild) {
    const run = (command, dir) => spawnSync(command, {
      cwd: dir, shell: true, windowsHide: true, stdio: quiet ? 'pipe' : 'inherit',
      env: { ...process.env, BROWSER: 'none', FORCE_COLOR: '0', NO_COLOR: '1' },
    });
    for (const dir of await findBuildProjects(path.join(rootDir, 'Jogos'))) {
      if (!rebuild && !(await needsBuild(dir))) continue;
      const pkg = await readPackage(dir);
      const deps = Object.keys({ ...pkg?.dependencies, ...pkg?.devDependencies });
      if (deps.length && !(await hasInstalledDependencies(dir, deps))) {
        if (!installDeps) throw new Error(`Dependências ausentes para compilar ${path.relative(rootDir, dir)}`);
        const command = fs.existsSync(path.join(dir, 'package-lock.json')) ? 'npm ci' : 'npm install';
        log(`[build] Instalando dependências de ${path.relative(rootDir, dir)}...`);
        const install = run(command + ' --include=dev --no-audit --no-fund', dir);
        if (install.status !== 0) throw new Error(`Falha ao instalar dependências de ${path.relative(rootDir, dir)} (exit ${install.status})`);
      }
      log(`[build] Compilando ${path.relative(rootDir, dir)}...`);
      const res = run('npm run build', dir);
      if (res.status !== 0) throw new Error(`Falha ao compilar ${path.relative(rootDir, dir)} (exit ${res.status})`);
    }
  }

  log('--- 1. Sincronizando Sistema/shared/*.js nas pastas de jogos HTML ---');
  syncSharedToHtmlCollections(rootDir);

  log(`--- 2. Montando ${path.relative(rootDir, outDir) || outDir} (removendo arquivos que sobraram) ---`);
  fs.mkdirSync(outDir, { recursive: true });
  const keep = new Set([...LAUNCHER_FILES, 'capas', 'Jogos', 'Sistema', 'api']);
  for (const e of fs.readdirSync(outDir)) if (!keep.has(e)) fs.rmSync(path.join(outDir, e), { recursive: true, force: true });
  for (const name of LAUNCHER_FILES) {
    const src = path.join(launcherDir, name);
    if (fs.existsSync(src)) copyFileIfChanged(src, path.join(outDir, name));
  }
  syncDir(path.join(launcherDir, 'capas'), path.join(outDir, 'capas'));
  syncDir(path.join(rootDir, 'Jogos'), path.join(outDir, 'Jogos'));
  fs.mkdirSync(path.join(outDir, 'Sistema'), { recursive: true });
  for (const e of fs.readdirSync(path.join(outDir, 'Sistema'))) {
    if (e !== 'shared') fs.rmSync(path.join(outDir, 'Sistema', e), { recursive: true, force: true });
  }
  syncDir(path.join(rootDir, 'Sistema', 'shared'), path.join(outDir, 'Sistema', 'shared'));

  log('--- 3. Gerando catálogo estático ---');
  const onlineCatalog = path.join(outDir, 'api', 'apps.json');
  const apps = await generateCatalog({
    rootDir, quiet,
    outFiles: outputOnly ? [onlineCatalog] : [path.join(rootDir, 'Sistema', 'api', 'apps.json'), onlineCatalog],
  });
  log(`--- Publicação pronta em ${outDir} (${apps.length} jogos). ---`);
  return apps;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const argv = process.argv.slice(2);
  const args = new Set(argv);
  const outIdx = argv.indexOf('--out');
  prepareOnlineBuild({
    outDir: outIdx >= 0 ? path.resolve(argv[outIdx + 1]) : undefined,
    rebuild: args.has('--rebuild'),
    noBuild: args.has('--no-build'),
    installDeps: args.has('--install-deps'),
    outputOnly: args.has('--output-only'),
  }).catch((err) => {
    console.error('❌ Erro em prepare-online-build:', err.message || err);
    process.exit(1);
  });
}
