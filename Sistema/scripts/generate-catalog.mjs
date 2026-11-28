// Sistema/scripts/generate-catalog.mjs
// Gera Sistema/api/apps.json (catálogo estático dos jogos em Jogos/) via scripts/lib/catalog.mjs.
// Uso: node Sistema/scripts/generate-catalog.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { scanCatalog } from './lib/catalog.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export async function generateCatalog({ rootDir = ROOT, outFiles = null, quiet = false } = {}) {
  const catalogPath = path.join(rootDir, 'Sistema', 'api', 'apps.json');
  const targets = outFiles ?? [catalogPath];

  let existingCatalog = null;
  try { existingCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8')); } catch { existingCatalog = null; }

  const { apps } = await scanCatalog({
    rootDir,
    coverDir: path.join(rootDir, 'Sistema', 'launcher', 'capas'),
    staticMode: true,
    existingCatalog,
  });

  const cleanApps = apps.map((app) => {
    const copy = { ...app };
    delete copy.build;
    if (copy.kind === 'project' && copy.path && !copy.url) {
      copy.url = '/' + copy.path.replace(/\\/g, '/').split('/').map(encodeURIComponent).join('/') + '/dist/index.html';
    }
    if (copy.status === 'concept' && !copy.url) copy.isConcept = true;
    return copy;
  });

  const jsonStr = JSON.stringify(cleanApps, null, 2) + '\n';
  for (const file of targets) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, jsonStr, 'utf8');
  }
  if (!quiet) console.log(`✅ Catálogo gerado: ${cleanApps.length} jogos em ${targets.map((f) => path.relative(rootDir, f)).join(', ')}.`);
  return cleanApps;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  generateCatalog().catch((err) => {
    console.error('❌ Erro ao gerar catálogo:', err);
    process.exit(1);
  });
}
