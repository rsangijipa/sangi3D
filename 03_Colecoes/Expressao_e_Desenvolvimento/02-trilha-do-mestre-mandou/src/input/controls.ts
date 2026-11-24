/**
 * Sistema de Entrada: Teclado, Mouse e Toque
 * Projeto: 02. Trilha do Mestre Mandou
 */

import * as THREE from 'three';

export interface InputState {
  forward: number;
  strafe: number;
  jumpPressed: boolean;
  interactPressed: boolean;
}

export class InputManager {
  private keys: Record<string, boolean> = {};
  public state: InputState = {
    forward: 0,
    strafe: 0,
    jumpPressed: false,
    interactPressed: false
  };

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor(
    private domElement: HTMLElement,
    private camera: THREE.Camera,
    private groundMesh: THREE.Mesh,
    private onDestinationClick: (point: THREE.Vector3) => void,
    private onTargetClick: (targetId: string) => void,
    private onInteract: () => void,
    private onJump: () => void,
    private onToggleCamera: () => void,
    private onToggleMute: () => void,
    private onPause: () => void
  ) {
    this.setupKeyboard();
    this.setupPointer();
  }

  private setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      this.keys[e.key.toLowerCase()] = true;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.onJump();
      } else if (e.key.toLowerCase() === 'e' || e.key === 'Enter') {
        this.onInteract();
      } else if (e.key.toLowerCase() === 'c') {
        this.onToggleCamera();
      } else if (e.key.toLowerCase() === 'm') {
        this.onToggleMute();
      } else if (e.key.toLowerCase() === 'p' || e.key === 'Escape') {
        this.onPause();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  private setupPointer() {
    const handlePointer = (clientX: number, clientY: number) => {
      const rect = this.domElement.getBoundingClientRect();
      this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      // 1. Checar se clicou em hitboxes interativas
      const hitboxes = [
        this.domElement.ownerDocument.querySelector('canvas') // fallback
      ];

      // Testar interseção com o chão da floresta
      const groundHits = this.raycaster.intersectObject(this.groundMesh, false);
      if (groundHits.length > 0) {
        this.onDestinationClick(groundHits[0].point);
      }
    };

    this.domElement.addEventListener('pointerdown', (e) => {
      // Ignora se o clique foi em elementos da interface sobreposta
      if ((e.target as HTMLElement).closest('.ui-interactive')) return;
      handlePointer(e.clientX, e.clientY);
    });
  }

  update() {
    let forward = 0;
    let strafe = 0;

    if (this.keys['w'] || this.keys['arrowup']) forward += 1;
    if (this.keys['s'] || this.keys['arrowdown']) forward -= 1;
    if (this.keys['d'] || this.keys['arrowright']) strafe += 1;
    if (this.keys['a'] || this.keys['arrowleft']) strafe -= 1;

    this.state.forward = forward;
    this.state.strafe = strafe;
  }
}
