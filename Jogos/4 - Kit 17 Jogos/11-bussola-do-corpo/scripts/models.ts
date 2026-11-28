import * as T from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeBody } from '../scene/body';
import { buildObservatory } from '../scene/observatory';
import { icon } from '../ui/icons';
import { sensations } from '../game/content';

const source = new T.Scene();
const { heroAssets } = buildObservatory(source,1117);
const body = makeBody();
const turn = new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),Math.PI);
const rotation = new T.QuaternionKeyframeTrack('.quaternion',[0,.43],[0,0,0,1,turn.x,turn.y,turn.z,turn.w]);
const clip = new T.AnimationClip('Frente para costas',.43,[rotation]);

const ring = new T.Mesh(new T.TorusGeometry(.948,.0033,6,120),new T.MeshStandardMaterial({color:'#bd9558',metalness:.42,roughness:.55}));
ring.name = 'orbital_ring';
const tokens = new T.Group();
tokens.name = 'sensation_tokens';
Object.entries(sensations).forEach(([id,[label,symbol]],i) => {
  const a=i*Math.PI/4, token=new T.Group();
  token.name=id; token.userData.label=label;
  token.position.set(Math.sin(a)*.948,-Math.cos(a+Math.PI)*.948,.034);
  const clay = new T.MeshStandardMaterial({color:'#ead2ae',roughness:.85});
  const ink = new T.MeshStandardMaterial({color:'#234030',roughness:.85,side:T.DoubleSide});
  const disc=new T.Mesh(new T.CylinderGeometry(.155,.151,.026,48),clay);
  disc.rotation.x=Math.PI/2;
  token.add(disc);
  const rim=new T.Mesh(new T.TorusGeometry(.146,.006,6,48),clay);
  rim.position.z=.012; token.add(rim);
  const symbolGroup=new T.Group();
  symbolGroup.scale.set(.008,-.008,1); symbolGroup.position.set(-.096,.096,.016);
  const vector=new SVGLoader().parse(icon(symbol));
  for (const path of vector.paths) {
    const style=path.userData?.style;
    if (style?.stroke && style.stroke!=='none') {
      for (const segment of path.subPaths) {
        const points=segment.getPoints(18);
        if (points.length < 2) continue;
        const stroke=SVGLoader.pointsToStroke(points,style);
        if (stroke) symbolGroup.add(new T.Mesh(stroke,ink));
      }
    }
    if (style?.fill && style.fill!=='none') {
      for (const shape of SVGLoader.createShapes(path)) symbolGroup.add(new T.Mesh(new T.ShapeGeometry(shape,18),ink));
    }
  }
  token.add(symbolGroup); tokens.add(token);
});

// The runtime uses beam sprites and a filmic response. Supplementary files
// carry physical materials and original geometry for editing in other apps.
const files = [...heroAssets,body.surface,body.proxyGroup,ring,tokens];
const names = files.map(asset=>asset.name);
const exporter = new GLTFExporter();
const descriptions: Record<string,string> = {
  observatory:'Estrutura do domo, piso e vigas de madeira',
  body_neutral:'Figura em material fosco, com gesto de virar',
  region_proxy:'Faces separadas por região, usadas no raycast',
  orbital_ring:'Aro de latão',
  sensation_tokens:'Oito discos de cerâmica e símbolos gravados',
  rug:'Juta tramada', telescope:'Carvalho, latão e lente',
  moon_lamp:'Cerâmica lunar emissiva e base de latão',
  star_lamp:'Cúpula translúcida, base de latão e pontos de luz',
  shelf:'Carvalho e livros de papel',
  plant:'Folhagem e vaso de terracota',
  pouf:'Feltro de musgo e costuras',
};
Object.assign(window,{
  compassModels: names,
  async compassExport(id: string) {
    const original=files.find(model=>model.name===id);
    if (!original) throw new Error('Modelo desconhecido');
    const model=original.clone(true);
    model.position.set(0,0,0); model.rotation.set(0,0,0);
    const sprites: T.Object3D[]=[];
    model.traverse(node=>{
      node.visible=true;
      if (node instanceof T.Sprite) sprites.push(node);
      if (node instanceof T.Mesh && !Array.isArray(node.material)) {
        node.material=node.material.clone();
        if (node.material.color) node.material.color.setRGB(
          Math.min(1,node.material.color.r),Math.min(1,node.material.color.g),Math.min(1,node.material.color.b));
        if (node.material.bumpMap) node.material.bumpMap=null;
        const source = node.geometry.clone();
        source.deleteAttribute('zone');
        source.deleteAttribute('zoneEdge');
        node.geometry = mergeVertices(source);
        source.dispose();
        if (node.material.normalMap && node.geometry.hasAttribute('uv') && node.geometry.hasAttribute('normal')) {
          node.geometry.computeTangents();
          const normal=node.geometry.getAttribute('normal'), tangent=node.geometry.getAttribute('tangent');
          const axis=new T.Vector3();
          const n=new T.Vector3();
          for (let i=0;i<tangent.count;i++) {
            axis.fromBufferAttribute(tangent,i);
            if (Number.isFinite(axis.lengthSq()) && axis.lengthSq()>.001) continue;
            n.fromBufferAttribute(normal,i);
            axis.set(Math.abs(n.x)>.8?0:1,Math.abs(n.x)>.8?1:0,0).cross(n).normalize();
            tangent.setXYZW(i,axis.x,axis.y,axis.z,1);
          }
        }
      }
    });
    sprites.forEach(node=>node.removeFromParent());
    const result=await exporter.parseAsync(model,{
      binary:true, onlyVisible:true, animations:id==='body_neutral'?[clip]:[],
    }) as ArrayBuffer;
    const blob = new Blob([result],{type:'model/gltf-binary'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=id+'.glb'; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    return descriptions[id];
  },
});
