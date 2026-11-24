                                                   
export function wire(panel            ,canvas                            ,act                          ,pause         ,state          ,dispatch                 ){
 panel.addEventListener('click',e=>{const button=(e.target               ).closest                   ('button[data-action]');if(button)act(button.dataset.action ,button.value);});
 panel.addEventListener('change',e=>{const el=e.target                     ;if(el.dataset.action)act(el.dataset.action,el.value);});
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){pause();return;}
  if(e.target instanceof HTMLElement && e.target.closest('dialog,button,select,input'))return;
  if(!state().started||state().paused)return;
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();act('rotate',e.key==='ArrowLeft'?'-15':'15');}
 });
 if(!canvas)return;
 canvas.setAttribute('aria-hidden','true');
 let drag                                        ;
 canvas.addEventListener('pointerdown',e=>{if(!state().started||state().paused||e.button!==0)return;
  canvas.setPointerCapture(e.pointerId);drag={id:e.pointerId,x:e.clientX,y:e.clientY};});
 canvas.addEventListener('pointermove',e=>{
  if(!drag||drag.id!==e.pointerId||state().paused)return;
  const s=state(),dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  drag.x=e.clientX;drag.y=e.clientY;
  if(s.zoom>1)dispatch({type:'move',x:s.magnifierPos[0]+dx*.005,z:s.magnifierPos[1]+dy*.005});
  else if(s.stage===2)dispatch({type:'light',value:s.lampAngle+dx*.4});
  else dispatch({type:'rotate',value:dx*.58});
 });
 for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,()=>{drag=undefined;});
}
