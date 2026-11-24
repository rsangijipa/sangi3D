// scripts/sync-imersivo.mjs
// Sincroniza shared/imersivo.js (fonte canônica) para os espelhos locais e do launcher.
import fs from 'node:fs';
import path from 'node:path';

const source = 'shared/imersivo.js';
const content = fs.readFileSync(source, 'utf8');

const targets = [
  '01_Jogos_HTML/shared/imersivo.js',
  '01_Jogos_HTML/Legado_Arquivado/ambientes-html/shared/imersivo.js',
  'launcher/shared/imersivo.js',
  'launcher/01_Jogos_HTML/shared/imersivo.js',
  'launcher/01_Jogos_HTML/Legado_Arquivado/ambientes-html/shared/imersivo.js'
];

for (const t of targets) {
  fs.mkdirSync(path.dirname(t), { recursive: true });
  fs.writeFileSync(t, content, 'utf8');
  console.log('✅ Sincronizado:', t);
}
