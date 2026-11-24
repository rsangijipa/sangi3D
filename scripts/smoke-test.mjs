// scripts/smoke-test.mjs
// Teste de fumaça das rotas executáveis e APIs do catálogo Sangi3D
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = process.cwd();
const apps = JSON.parse(fs.readFileSync(path.join(ROOT, 'api', 'apps.json'), 'utf8'));
const readyApps = apps.filter((a) => a.status === 'ready' && a.url);

console.log(`Iniciando smoke test para ${readyApps.length} rotas executáveis...`);

const TEST_PORT = Number(process.env.SANGI_SMOKE_PORT || 5178);
const serverProcess = spawn('node', ['launcher/server.mjs', '--port', String(TEST_PORT), '--no-prebuild'], {
  cwd: ROOT,
  stdio: ['ignore', 'pipe', 'pipe'],
});

function waitServerReady() {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout iniciando server')), 8000);
    serverProcess.stdout.on('data', (d) => {
      if (d.toString().includes('http://')) {
        clearTimeout(timer);
        resolve();
      }
    });
    serverProcess.stderr.on('data', (d) => console.error('Server err:', d.toString()));
  });
}

function fetchRoute(routePath) {
  return new Promise((resolve) => {
    const url = `http://127.0.0.1:${TEST_PORT}${routePath}`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => resolve({ status: res.statusCode, length: data.length, body: data }));
    }).on('error', (err) => {
      resolve({ status: 500, error: err.message, length: 0, body: '' });
    });
  });
}

async function run() {
  try {
    await waitServerReady();
    console.log(`✅ Servidor de teste ativo na porta ${TEST_PORT}`);

    for (const apiRoute of ['/api/apps', '/api/apps.json']) {
      const catRes = await fetchRoute(apiRoute);
      if (catRes.status !== 200 || catRes.length === 0) {
        console.error(`❌ Falha na rota ${apiRoute} (Status: ${catRes.status})`);
        serverProcess.kill();
        process.exit(1);
      }
      console.log(`✅ ${apiRoute} respondeu 200 OK (${catRes.length} bytes)`);
    }

    let passed = 0;
    let failed = 0;

    for (const app of readyApps) {
      const targets = [app.url];
      if (app.direct && app.direct !== app.url) targets.push(app.direct);
      let ok = true;
      for (const route of targets) {
        const res = await fetchRoute(route);
        if (!(res.status >= 200 && res.status < 400 && res.length > 0)) {
          console.error(`❌ Falha na rota [${res.status}] para "${app.name}": ${route}`);
          ok = false;
        }
      }
      if (ok) passed++;
      else failed++;
    }

    console.log('\n======================================');
    console.log(`Resultado do Smoke Test: ${passed} rotas válidas de ${readyApps.length}.`);
    if (failed === 0) {
      console.log('✅ Todas as rotas do catálogo responderam com sucesso (200 OK)!');
    } else {
      console.error(`❌ ${failed} rotas falharam.`);
    }

    serverProcess.kill();
    process.exit(failed === 0 ? 0 : 1);
  } catch (err) {
    console.error('Erro no smoke test:', err);
    serverProcess.kill();
    process.exit(1);
  }
}

run();
