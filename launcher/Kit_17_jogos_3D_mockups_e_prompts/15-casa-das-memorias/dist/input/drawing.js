export function bindDrawing(canvas                  ,stored             ,save                          ){
 const c=canvas.getContext('2d');if(!c)return;
 const lines=structuredClone(stored);let current                =null;
 function paint(){if(!c)return;c.clearRect(0,0,canvas.width,canvas.height);c.lineWidth=3;c.lineCap='round';c.lineJoin='round';c.strokeStyle='#304937';
  for(const line of lines){if(!line.length)continue;c.beginPath();c.moveTo(line[0][0],line[0][1]);for(const [x,y] of line)c.lineTo(x,y);if(line.length===1)c.lineTo(line[0][0]+.1,line[0][1]);c.stroke();}}
 const point=(e             )=>{const r=canvas.getBoundingClientRect();return [Math.round((e.clientX-r.left)*canvas.width/r.width),Math.round((e.clientY-r.top)*canvas.height/r.height)];};
 canvas.onpointerdown=e=>{if(lines.length>=25)return;canvas.setPointerCapture(e.pointerId);current=[point(e)];lines.push(current);paint();};
 canvas.onpointermove=e=>{if(current&&current.length<190){current.push(point(e));paint();}};
 canvas.onpointercancel=canvas.onpointerup=()=>{if(current){current=null;save(lines);}};
 paint();
}
