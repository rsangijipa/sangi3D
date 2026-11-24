import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { access, readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('dist', import.meta.url));
const mediaTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };

try {
  await access(resolve(root, 'index.html'));
} catch {
  console.error('Build ausente. Execute npm install e npm run build nesta pasta.');
  process.exit(1);
}

const port = 4179;
const server = createServer(async (request, response) => {
  try {
    const { pathname } = new URL(request.url, 'http://localhost');
    const file = resolve(root, '.' + decodeURIComponent(pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + sep)) return response.writeHead(404).end();
    const content = await readFile(file);
    response.writeHead(200, { 'Content-Type': mediaTypes[extname(file)] ?? 'application/octet-stream' }).end(content);
  } catch {
    response.writeHead(404).end();
  }
});
server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`A porta ${port} já está em uso. Se a Oficina estiver aberta, acesse http://127.0.0.1:${port}/.`);
  } else {
    console.error(error.message);
  }
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', function () {
  const url = `http://127.0.0.1:${this.address().port}/`;
  console.log(`Oficina do Vitralista: ${url}\nMantenha esta janela aberta enquanto usa a oficina.`);
  if (process.argv.includes('--abrir') && process.platform === 'win32') {
    const launcher = spawn('rundll32.exe', ['url.dll,FileProtocolHandler', url], { detached: true, stdio: 'ignore' });
    launcher.on('error', () => console.log('Abra o endereço acima no navegador.'));
    launcher.unref();
  }
});
