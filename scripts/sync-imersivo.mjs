// scripts/sync-imersivo.mjs
import fs from 'node:fs';
import path from 'node:path';

const source = '01_Jogos_HTML/Legado_Arquivado/ambientes-html/shared/imersivo.js';
let content = fs.readFileSync(source, 'utf8');

const bridgeHook = `
    // Sangi3D Universal Bridge
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage({
          type: 'SANGI_APP_READY',
          title: cfg.title || document.title,
          capabilities: { webgl2: true, touch: true, imersivo: true }
        }, '*');
      } catch (e) {}
    }
    window.addEventListener('message', function (e) {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'SANGI_APP_PAUSE') {
        if (typeof cfg.onPause === 'function') cfg.onPause();
      } else if (e.data.type === 'SANGI_APP_RESUME') {
        if (typeof cfg.onResume === 'function') cfg.onResume();
      } else if (e.data.type === 'SANGI_APP_DISPOSE') {
        if (typeof cfg.onDispose === 'function') cfg.onDispose();
      }
    });
`;

if (!content.includes('SANGI_APP_READY')) {
  content = content.replace('return api;', bridgeHook + '\n    return api;');
}

const targets = [
  'shared/imersivo.js',
  '01_Jogos_HTML/shared/imersivo.js',
  'launcher/shared/imersivo.js',
  '01_Jogos_HTML/Legado_Arquivado/ambientes-html/shared/imersivo.js'
];

targets.forEach(t => {
  fs.mkdirSync(path.dirname(t), { recursive: true });
  fs.writeFileSync(t, content, 'utf8');
  console.log('✅ Sincronizado:', t);
});
