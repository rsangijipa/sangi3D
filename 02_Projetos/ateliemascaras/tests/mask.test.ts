import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Raycaster, Mesh, Vector2, Vector3 } from 'three/webgpu';
import { createGeometry, updateGeometry, makeMask, deform, nearestVertex, forms, vertexCount } from '../src/mask.ts';

test('the editable shell contains two real eye apertures and a solid nose',()=>{
  const mask=makeMask();
  const geo=createGeometry();
  updateGeometry(geo,mask);
  const surface=new Mesh(geo.outer);
  const ray=new Raycaster();
  for (const x of [-.38,.38]) {
    ray.set(new Vector3(x,.237,3),new Vector3(0,0,-1));
    assert.equal(ray.intersectObject(surface).length,0);
  }
  ray.set(new Vector3(0,.237,3),new Vector3(0,0,-1));
  assert.ok(ray.intersectObject(surface).length);
  assert.ok(geo.rim.getIndex()!.count>0);
});

test('the shell closes every boundary edge with consistent winding',()=>{
  const geo=createGeometry();
  const edges = new Map<string,[number,number]>();
  for(const [g,offset] of [[geo.outer,0],[geo.inner,vertexCount],[geo.rim,0]] as const) {
    const array=g.getIndex()!.array;
    for(let i=0;i<array.length;i+=3) {
      for(let j=0;j<3;j++) {
        const a=array[i+j]+offset,b=array[i+(j+1)%3]+offset;
        const key=Math.min(a,b)+','+Math.max(a,b);
        const edge=edges.get(key)??[0,0];
        edge[a<b?0:1]++;
        edges.set(key,edge);
      }
    }
  }
  for(const edge of edges.values()) assert.deepEqual(edge,[1,1]);
});

test('sculpting one face preserves the opposite face and snapshots while maintaining thickness',()=>{
  const state=makeMask();
  const snapshot=structuredClone(state);
  const geo=createGeometry();
  updateGeometry(geo,state);
  const vertex=nearestVertex(new Vector2(.5,.51));
  const outer=geo.outer.getAttribute('position');
  const inner=geo.inner.getAttribute('position');
  const exterior=outer.getZ(vertex);
  const interior=inner.getZ(vertex);
  const hit=new Vector3().fromBufferAttribute(outer,vertex);
  deform(state,0,hit,'Puxar',.25,.15,false,0);
  updateGeometry(geo,state);
  assert.ok(outer.getZ(vertex)>exterior);
  assert.equal(inner.getZ(vertex),interior);
  assert.equal(snapshot.edits[0][vertex*2+1],0);
  deform(state,1,hit,'Puxar',.25,.15,false,0);
  updateGeometry(geo,state);
  assert.ok(inner.getZ(vertex)<interior);
  assert.ok(outer.getZ(vertex)-inner.getZ(vertex)>.024);
});

test('all formats and anatomical adjustment extremes have finite positions and normals',()=>{
  const state=makeMask();
  const geo=createGeometry();
  for(const form of forms) {
    state.form=form;
    state.morph=state.morph.map((_,i)=>i%2?1:-1);
    updateGeometry(geo,state);
    for(const g of [geo.outer,geo.inner,geo.rim])
      for(const name of ['position','normal']) assert.ok(g.getAttribute(name).array.every(Number.isFinite));
  }
});

test('symmetry applies a brush stroke to both sides of the same surface',()=>{
  const mask=makeMask();
  const right=nearestVertex(new Vector2(.67,.34));
  const left=nearestVertex(new Vector2(.33,.34));
  const geo=createGeometry();
  updateGeometry(geo,mask);
  const hit=new Vector3().fromBufferAttribute(geo.outer.getAttribute('position'),right);
  deform(mask,0,hit,'Inflar',.24,.1,true,0);
  assert.ok(mask.edits[0][right*2+1]>.1);
  assert.ok(Math.abs(mask.edits[0][right*2+1]-mask.edits[0][left*2+1])<.0001);
  assert.equal(mask.edits[1][right*2+1],0);
});
