// Script para exportar o catálogo de apps para JSON estático (Vercel e offline)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

async function fetchFromRunningServer() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:5170/api/apps', (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Obtendo catálogo de apps...');
  let apps;
  try {
    apps = await fetchFromRunningServer();
    console.log(`Catálogo obtido via servidor local: ${apps.length} apps encontrados.`);
  } catch (err) {
    console.log('Servidor local não estava rodando ou falhou. Mantendo arquivos existentes.');
    return;
  }

  const jsonStr = JSON.stringify(apps, null, 2);
  fs.mkdirSync(path.join(ROOT, 'api'), { recursive: true });
  fs.mkdirSync(path.join(ROOT, 'launcher', 'api'), { recursive: true });

  fs.writeFileSync(path.join(ROOT, 'api', 'apps.json'), jsonStr, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'launcher', 'api', 'apps.json'), jsonStr, 'utf8');
  console.log('✅ api/apps.json e launcher/api/apps.json atualizados com sucesso!');
}

main().catch(console.error);
