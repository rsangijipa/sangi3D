import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const publicRoot = fileURLToPath(new URL('../dist',import.meta.url));
const mime = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
  '.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json' };
try { await stat(resolve(publicRoot,'index.html')); }
catch {
  console.error('Build ausente. Execute npm ci e npm run build.');
  process.exit(1);
}
const server=createServer(async (req,res)=>{
  if (req.method!=='GET'&&req.method!=='HEAD') { res.writeHead(405,{Allow:'GET, HEAD'}).end(); return; }
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname).replaceAll('\\','/');
    const path=resolve(publicRoot,`.${pathname === '/' ? '/index.html' : pathname}`);
    if (!path.startsWith(publicRoot+sep)) { res.writeHead(404).end(); return; }
    const file=await stat(path);
    if(!file.isFile()) { res.writeHead(404).end(); return; }
    res.writeHead(200,{'Content-Type':mime[extname(path)]??'application/octet-stream','Content-Length':file.size});
    if(req.method==='HEAD')res.end();
    else createReadStream(path).on('error',()=>res.destroy()).pipe(res);
  } catch { if(!res.headersSent)res.writeHead(404); res.end(); }
});
server.listen(Number(process.env.BUSSOLA_PORT ?? 0),'127.0.0.1',()=>{
  const address=server.address();
  const url=`http://127.0.0.1:${address.port}/`;
  console.log('Bússola do Corpo — '+url);
  if(process.argv.includes('--open')&&process.platform==='win32') {
    const browser=spawn('cmd.exe',['/d','/c','start','',url],{windowsHide:true,stdio:'ignore'});
    browser.on('error',()=>{});
  }
});
