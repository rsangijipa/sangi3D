// Sistema/scripts/verify-catalog.mjs
// Confere a integridade de Sistema/api/apps.json: ids únicos, arquivos e capas existentes,
// builds presentes e cópias de Sistema/shared nas pastas de jogos HTML iguais à original.
// Uso: node Sistema/scripts/verify-catalog.mjs [--allow-missing-thumbs]
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from './generate-catalog.mjs';

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

/** Converte uma URL do catálogo no arquivo correspondente (o launcher serve /launcher/* de Sistema/launcher). */
export function resolveCatalogUrl(rootDir, rawUrl) {
  const cleanUrl = rawUrl.split('?')[0].split('#')[0];
  let rel = decodeURIComponent(cleanUrl).replace(/^\//, '');
  if (rel.startsWith('launcher/')) rel = path.join('Sistema', rel);
  let target = path.join(rootDir, rel);
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  return { cleanUrl, rel, target };
}

export function verifyCatalog({ rootDir = ROOT, catalogPath = null, allowMissingThumbs = false, quiet = false } = {}) {
  const errors = [];
  const warnings = [];
  const logError = (msg) => { errors.push(msg); if (!quiet) console.error(`❌ [ERRO] ${msg}`); };
  const logWarning = (msg) => { warnings.push(msg); if (!quiet) console.warn(`⚠️ [AVISO] ${msg}`); };
  const log = (msg) => { if (!quiet) console.log(msg); };

  const catPath = catalogPath ?? path.join(rootDir, 'Sistema', 'api', 'apps.json');
  const relPath = path.relative(rootDir, catPath);
  const summary = {};
  let apps = null;
  try { apps = JSON.parse(fs.readFileSync(catPath, 'utf8')); } catch (err) { logError(`Não consegui ler ${relPath}: ${err.message}`); }
  if (apps && !Array.isArray(apps)) { logError(`${relPath} não é uma lista`); apps = null; }

  if (apps) {
    log(`--- Validando ${relPath}: ${apps.length} entradas ---`);
    const ids = new Set();
    const urls = new Map();
    const names = new Map();
    let readyCount = 0, conceptCount = 0, archivedCount = 0, missingFiles = 0;

    for (const app of apps) {
      if (!app.id) logError(`Entrada sem 'id': "${app.name || app.fullTitle}"`);
      else if (ids.has(app.id)) logError(`ID duplicado: "${app.id}"`);
      else ids.add(app.id);

      if (app.name === 'Ambientes' || app.url === '/index.html' || app.path === 'index.html') {
        logError(`Autorreferência: "${app.id}"`);
      }
      if (app.status === 'ready') readyCount++;
      else if (app.status === 'concept') conceptCount++;
      if (app.collection === 'Legado arquivado') archivedCount++;

      if (app.status === 'ready' && (app.kind === 'concept' || app.isConcept === true)) {
        logError(`Contradição concept/ready em "${app.id}"`);
      }
      if (app.collection !== 'Legado arquivado' && app.name) {
        if (names.has(app.name) && names.get(app.name) !== app.id) logError(`Nome duplicado "${app.name}" em "${names.get(app.name)}" e "${app.id}"`);
        else names.set(app.name, app.id);
      }

      if (app.status === 'ready') {
        if (!app.thumb) { if (!allowMissingThumbs) logError(`Capa ausente para "${app.name}" (${app.id})`); }
        else if (!fs.existsSync(resolveCatalogUrl(rootDir, app.thumb).target)) logError(`Arquivo de capa ausente para "${app.id}": ${app.thumb}`);
      }
      if (app.kind === 'project' && app.path && !fs.existsSync(path.join(rootDir, app.path, 'dist', 'index.html'))) {
        logError(`dist/index.html ausente no projeto "${app.id}" (${app.path})`);
      }
      if (app.status === 'ready' && app.url) {
        const { cleanUrl, target } = resolveCatalogUrl(rootDir, app.url);
        if (!fs.existsSync(target)) { logError(`Arquivo do jogo ausente para "${app.name}" (${app.id}): ${cleanUrl}`); missingFiles++; }
        if (urls.has(cleanUrl) && urls.get(cleanUrl) !== app.id) logWarning(`URL compartilhada: "${cleanUrl}" (${urls.get(cleanUrl)} e ${app.id})`);
        else urls.set(cleanUrl, app.id);
      }
      if (app.status === 'concept' && app.url) logWarning(`Conceito com URL ativa: "${app.name}" (${app.url})`);
    }
    summary[relPath] = { total: apps.length, readyCount, conceptCount, archivedCount, missingFiles };
    log(`  Prontos: ${readyCount} · Conceitos: ${conceptCount} · Arquivados: ${archivedCount} · Arquivos ausentes: ${missingFiles}`);
  }

  // Cópias de Sistema/shared usadas pelos jogos HTML devem ser iguais à original.
  const sharedDir = path.join(rootDir, 'Sistema', 'shared');
  const copies = [
    ['imersivo.js', path.join('Jogos', '1 - Jogos HTML', 'shared')],
    ['sangi-bridge.js', path.join('Jogos', '1 - Jogos HTML', 'shared')],
    ['imersivo.js', path.join('Jogos', '9 - Arquivados', 'shared')],
  ];
  for (const [name, dir] of copies) {
    const src = path.join(sharedDir, name);
    const copy = path.join(rootDir, dir, name);
    if (!fs.existsSync(src) || !fs.existsSync(path.join(rootDir, dir))) continue;
    if (!fs.existsSync(copy) || sha256(src) !== sha256(copy)) logError(`Cópia desatualizada: ${path.join(dir, name)} (rode prepare-online-build)`);
  }

  return { errors, warnings, summary };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const result = verifyCatalog({ allowMissingThumbs: process.argv.includes('--allow-missing-thumbs') });
  console.log('\n======================================');
  if (result.errors.length === 0) {
    console.log(`✅ Catálogo validado. (avisos: ${result.warnings.length})`);
  } else {
    console.error(`❌ Validação falhou com ${result.errors.length} erro(s) e ${result.warnings.length} aviso(s).`);
    process.exit(1);
  }
}
