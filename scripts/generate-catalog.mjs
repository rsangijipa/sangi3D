// scripts/generate-catalog.mjs
// Gera api/apps.json e launcher/api/apps.json de forma determinística e offline via scripts/lib/catalog.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { scanCatalog } from './lib/catalog.mjs';

export async function generateCatalog({ rootDir = process.cwd(), quiet = false } = {}) {
  const apiDir = path.join(rootDir, 'api');
  const launcherApiDir = path.join(rootDir, 'launcher', 'api');
  const rootCatalogPath = path.join(apiDir, 'apps.json');
  const launcherCatalogPath = path.join(launcherApiDir, 'apps.json');

  let existingCatalog = null;
  if (fs.existsSync(rootCatalogPath)) {
    try {
      existingCatalog = JSON.parse(fs.readFileSync(rootCatalogPath, 'utf8'));
    } catch {
      existingCatalog = null;
    }
  }

  const { apps } = await scanCatalog({
    rootDir,
    coverDir: path.join(rootDir, 'launcher', 'capas'),
    staticMode: true,
    existingCatalog,
  });

  const cleanApps = apps.map((app) => {
    const copy = { ...app };
    delete copy.build;
    if (copy.kind === 'project' && copy.path && !copy.url) {
      const normPath = copy.path.replace(/\\/g, '/');
      copy.url = `/${normPath}/dist/index.html`;
    }
    if (copy.status === 'concept' && !copy.url) {
      copy.isConcept = true;
    }
    return copy;
  });

  const jsonStr = JSON.stringify(cleanApps, null, 2) + '\n';
  fs.mkdirSync(apiDir, { recursive: true });
  fs.mkdirSync(launcherApiDir, { recursive: true });
  fs.writeFileSync(rootCatalogPath, jsonStr, 'utf8');
  fs.writeFileSync(launcherCatalogPath, jsonStr, 'utf8');

  if (!quiet) {
    console.log(`✅ Catálogo gerado offline: ${cleanApps.length} entradas em api/apps.json e launcher/api/apps.json.`);
  }
  return cleanApps;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  generateCatalog().catch((err) => {
    console.error('❌ Erro ao gerar catálogo:', err);
    process.exit(1);
  });
}
