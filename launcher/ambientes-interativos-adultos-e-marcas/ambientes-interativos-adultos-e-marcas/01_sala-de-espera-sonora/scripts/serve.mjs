import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';

const html=new URL('../sala-de-espera-sonora.html',import.meta.url);
const port=Number(process.env.SALA_PORT || 4410);
const server=createServer(async(req,res)=>{
  const path=new URL(req.url,'http://127.0.0.1').pathname;
  if(path==='/teste-iframe'){
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    res.end('<!doctype html><meta charset="utf-8"><style>html,body,iframe{height:100%;width:100%;border:0;margin:0}</style><iframe title="Sala incorporada" src="/?embed=1&modo=2d"></iframe>');
    return;
  }
  if(path!=='/'&&path!=='/sala-de-espera-sonora.html'){res.writeHead(404).end();return;}
  try{
    const page=await readFile(html);
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'});
    res.end(req.method==='HEAD'?undefined:page);
  }catch{res.writeHead(503).end('Gere o HTML antes de iniciar a prévia.');}
});
server.listen(port,'127.0.0.1',()=>console.log('Sala de Espera Sonora · http://127.0.0.1:'+port+'/'));

