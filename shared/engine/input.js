/**
 * shared/engine/input.js
 * Gerenciador unificado de ponteiro, touch e interações 3D
 */

export class InputManager {
  constructor(canvas, camera, scene) {
    this.canvas = canvas;
    this.camera = camera;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.isDown = false;
    this.hoveredObject = null;
    this.listeners = [];
    this.interactives = [];

    this._onPointerMove = this.onPointerMove.bind(this);
    this._onPointerDown = this.onPointerDown.bind(this);
    this._onPointerUp = this.onPointerUp.bind(this);

    this.canvas.addEventListener('pointermove', this._onPointerMove);
    this.canvas.addEventListener('pointerdown', this._onPointerDown);
    window.addEventListener('pointerup', this._onPointerUp);
    this.canvas.addEventListener('pointercancel', this._onPointerUp);
  }

  setInteractives(objects) {
    this.interactives = objects;
  }

  getPointerNDC(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1
    };
  }

  onPointerMove(event) {
    const ndc = this.getPointerNDC(event);
    this.pointer.x = ndc.x;
    this.pointer.y = ndc.y;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactives, true);

    if (intersects.length > 0) {
      const top = intersects[0];
      if (this.hoveredObject !== top.object) {
        this.canvas.style.cursor = 'pointer';
        this.hoveredObject = top.object;
        this.emit('hover', { object: top.object, intersect: top, event });
      }
    } else {
      if (this.hoveredObject) {
        this.canvas.style.cursor = 'default';
        this.hoveredObject = null;
        this.emit('unhover', { event });
      }
    }

    if (this.isDown) {
      this.emit('drag', { pointer: this.pointer, event, intersects });
    }
  }

  onPointerDown(event) {
    this.isDown = true;
    const ndc = this.getPointerNDC(event);
    this.pointer.x = ndc.x;
    this.pointer.y = ndc.y;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactives, true);

    if (intersects.length > 0) {
      this.emit('select', { object: intersects[0].object, intersect: intersects[0], event });
    } else {
      this.emit('miss', { event });
    }
  }

  onPointerUp(event) {
    this.isDown = false;
    this.emit('up', { event });
  }

  on(event, callback) {
    this.listeners.push({ event, callback });
  }

  emit(event, data) {
    for (let i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].event === event) {
        this.listeners[i].callback(data);
      }
    }
  }

  dispose() {
    this.canvas.removeEventListener('pointermove', this._onPointerMove);
    this.canvas.removeEventListener('pointerdown', this._onPointerDown);
    window.removeEventListener('pointerup', this._onPointerUp);
    this.canvas.removeEventListener('pointercancel', this._onPointerUp);
    this.listeners = [];
  }
}
