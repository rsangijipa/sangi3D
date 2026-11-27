import './build.mjs';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
const root=resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.glb':'model/gltf-binary','.svg':'image/svg+xml'};
const port=Number(process.env.ATLAS_PORT || 4173);
createServer(async (req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost');
  const file=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(root+sep)) throw Error();
  const content=await readFile(file);
  res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream'}).end(content);
 } catch {res.writeHead(404).end();}
}).listen(port,'127.0.0.1',()=>console.log('http://127.0.0.1:'+port));
