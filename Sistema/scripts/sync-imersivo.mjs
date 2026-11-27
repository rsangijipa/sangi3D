// Sistema/scripts/sync-imersivo.mjs
// Copia Sistema/shared/imersivo.js (original) para as pastas de jogos HTML que usam uma cópia local.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './generate-catalog.mjs';

const source = path.join(ROOT, 'Sistema', 'shared', 'imersivo.js');
const content = fs.readFileSync(source, 'utf8');
const targets = [
  path.join(ROOT, 'Jogos', '1 - Jogos HTML', 'shared', 'imersivo.js'),
  path.join(ROOT, 'Jogos', '9 - Arquivados', 'shared', 'imersivo.js'),
];
for (const t of targets) {
  fs.mkdirSync(path.dirname(t), { recursive: true });
  fs.writeFileSync(t, content, 'utf8');
  console.log('✅ Sincronizado:', path.relative(ROOT, t));
}
