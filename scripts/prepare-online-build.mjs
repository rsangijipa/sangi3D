// scripts/prepare-online-build.mjs
// Pipeline determinístico de build e espelhamento do launcher para publicação/uso offline.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { isBuildProject, needsBuild, hasInstalledDependencies, readPackage } from '../launcher/builder.mjs';
import { generateCatalog } from './generate-catalog.mjs';

const IGNORE_NAMES = new Set([
  'node_modules', '.git', '.vite', '_versoes', '.tmp', 'tmp',
  '.dist-launcher-backup', '.launcher-build', '.hyperframes', '.cache',
]);

const MIRROR_DIRS = [
  '01_Jogos_HTML',
  '02_Projetos',
  '03_Colecoes',
  '04-tear-dos-vinculos',
  'Kit_17_jogos_3D_mockups_e_prompts',
  'ambientes-interativos-adultos-e-marcas',
  'Sangi3D_15_Experiencias',
  'shared',
];

const ROOT_HTML_FILES = [
  'Colmeia Transparente.html',
  'Gerador de Mundos Climáticos.html',
  'Vulcão em Miniatura.html',
  'index.html',
];

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

async function findBuildProjects(rootDir) {
  const found = [];
  const skipWalk = new Set([...IGNORE_NAMES, 'dist', 'launcher', 'src', 'public', 'assets', 'capturas', 'demonstracao', 'shared', 'test', 'scripts']);

  async function walk(dir, depth) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    const files = entries.filter((e) => e.isFile()).map((e) => e.name);
    const dirs = entries.filter((e) => e.isDirectory() && !e.isSymbolicLink()).map((e) => e.name);

    if (dir !== rootDir && await isBuildProject(dir, files)) {
      found.push(dir);
      return;
    }
    if (depth >= 4) return;
    for (const d of dirs) {
      if (skipWalk.has(d) || d.startsWith('_') || d.startsWith('.')) continue;
      await walk(path.join(dir, d), depth + 1);
    }
  }

  await walk(rootDir, 0);
  return found;
}

function syncSharedToHtmlCollections(rootDir) {
  const sharedDir = path.join(rootDir, 'shared');
  const htmlRoot = path.join(rootDir, '01_Jogos_HTML');
  if (!fs.existsSync(sharedDir) || !fs.existsSync(htmlRoot)) return;

  const imersivoSrc = path.join(sharedDir, 'imersivo.js');
  if (fs.existsSync(imersivoSrc)) {
    copyFileIfChanged(imersivoSrc, path.join(htmlRoot, 'shared', 'imersivo.js'));
    const legadoShared = path.join(htmlRoot, 'Legado_Arquivado', 'ambientes-html', 'shared');
    if (fs.existsSync(legadoShared)) {
      copyFileIfChanged(imersivoSrc, path.join(legadoShared, 'imersivo.js'));
    }
  }

  const bridgeSrc = path.join(sharedDir, 'sangi-bridge.js');
  if (fs.existsSync(bridgeSrc)) {
    copyFileIfChanged(bridgeSrc, path.join(htmlRoot, 'shared', 'sangi-bridge.js'));
  }
}

export async function prepareOnlineBuild({
  rootDir = process.cwd(),
  rebuild = false,
  noBuild = false,
  quiet = false,
} = {}) {
  const log = (...args) => { if (!quiet) console.log(...args); };
  const launcherDir = path.join(rootDir, 'launcher');
  fs.mkdirSync(launcherDir, { recursive: true });

  if (!noBuild) {
    const projects = await findBuildProjects(rootDir);
    for (const dir of projects) {
      const stale = rebuild || await needsBuild(dir);
      if (!stale) continue;
      const pkg = await readPackage(dir);
      const deps = Object.keys({ ...pkg?.dependencies, ...pkg?.devDependencies });
      if (deps.length && !(await hasInstalledDependencies(dir, deps))) {
        throw new Error(`Dependências ausentes para compilar ${path.relative(rootDir, dir)}`);
      }
      log(`[build] Compilando ${path.relative(rootDir, dir)}...`);
      const res = spawnSync('npm run build', {
        cwd: dir,
        shell: true,
        windowsHide: true,
        stdio: quiet ? 'pipe' : 'inherit',
        env: { ...process.env, BROWSER: 'none', FORCE_COLOR: '0', NO_COLOR: '1' },
      });
      if (res.status !== 0) {
        throw new Error(`Falha ao compilar ${path.relative(rootDir, dir)} (exit ${res.status})`);
      }
    }
  }

  log('--- 1. Sincronizando shared/*.js para 01_Jogos_HTML/shared e Legado ---');
  syncSharedToHtmlCollections(rootDir);

  log('--- 2. Espelhando capas para launcher/launcher/capas ---');
  const capasSrc = path.join(launcherDir, 'capas');
  if (fs.existsSync(capasSrc)) {
    syncDir(capasSrc, path.join(launcherDir, 'launcher', 'capas'));
  }

  log('--- 3. Espelhando coleções, shared/ e HTMLs da raiz para launcher/ (removendo órfãos) ---');
  for (const dirName of MIRROR_DIRS) {
    const src = path.join(rootDir, dirName);
    if (fs.existsSync(src)) {
      syncDir(src, path.join(launcherDir, dirName));
    }
  }

  for (const fileName of ROOT_HTML_FILES) {
    const src = path.join(rootDir, fileName);
    if (fs.existsSync(src)) {
      copyFileIfChanged(src, path.join(launcherDir, fileName));
    }
  }

  log('--- 4. Gerando api/apps.json e launcher/api/apps.json determinísticos ---');
  const apps = await generateCatalog({ rootDir, quiet });
  log(`--- Preparação online concluída (${apps.length} apps). ---`);
  return apps;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const args = new Set(process.argv.slice(2));
  prepareOnlineBuild({
    rootDir: process.cwd(),
    rebuild: args.has('--rebuild'),
    noBuild: args.has('--no-build'),
  }).catch((err) => {
    console.error('❌ Erro em prepare-online-build:', err.message || err);
    process.exit(1);
  });
}
