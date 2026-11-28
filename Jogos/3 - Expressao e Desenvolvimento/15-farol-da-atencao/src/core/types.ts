import type * as THREE from 'three';
import type { Stage } from './stage';
import type { Interface } from '../ui/interface';
import type { Store } from '../game/state';
export interface Entity { id:string;type:string;x:number;y:number;z:number;angle:number;value:number;label:string;active:boolean }
export interface SceneState { entities:Entity[];values:Record<string,number>;strings:Record<string,string>;heights:number[];wet:number[];links:{a:string;b:string}[] }
export interface GameState {version:1;seed:number;mode:string;phase:string;preset:number;settings:{reducedMotion:boolean;snap:boolean};sceneState:SceneState;observations:string[]}
export interface Command {type:string;id?:string;value?:number;text?:string;x?:number;y?:number;z?:number;extra?:number}
export interface Config {id:string;title:string;subtitle:string;category:string;accent:string;palette:string[];intro:string;presets:string[];guide:string[];kind:number}
export interface Env {stage:Stage;ui:Interface;store:Store;config:Config;send:(command:Command)=>boolean;notify:(text:string)=>void;tone:(hz?:number)=>void;radio:(frequency:number,volume:number)=>void;complete:()=>void}
export interface Experience {root:THREE.Group;camera:[number,number,number];target:[number,number,number];tools:{label:string;id:string;help:string;draw:()=>void}[];sync:()=>void;step:(dt:number,t:number)=>void;pointer?:(id:string,p:THREE.Vector3,phase:'start'|'move'|'end')=>THREE.Plane|void;dispose?:()=>void;summary:()=>string}
export const entity=(id:string,type:string,x:number,y:number,z:number,label=''):Entity=>({id,type,x,y,z,angle:0,value:1,label,active:true});
export const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
