import * as THREE from 'three';
import { WorkshopScene } from '../scene/WorkshopScene';
import { ClaySolver } from '../clay/ClaySolver';
import { ClayGeometry } from '../clay/ClayGeometry';
import { ClayHistory } from '../clay/ClayHistory';
import { MaterialAudio } from '../audio/MaterialAudio';
import { ToolType, ScopeType } from '../types';

export class PointerController {
  private scene: WorkshopScene;
  private solver: ClaySolver;
  private geometry: ClayGeometry;
  private history: ClayHistory;
  private audio: MaterialAudio;

  public activeTool: ToolType = 'modelar';
  public activeScope: ScopeType = 'ring';
  public brushRadius: number = 0.025; // meters
  public sensitivity: number = 0.55;

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  private isDragging: boolean = false;
  private pointerDownPos = new THREE.Vector2();
  private lastPointerPos = new THREE.Vector2();
  private lastContactPoint = new THREE.Vector3();
  private hasCrossedDeadzone: boolean = false;
  private activePointerId: number | null = null;

  private onSculptChangeCallback?: () => void;
  private onLimitReachedCallback?: () => void;

  constructor(
    scene: WorkshopScene,
    solver: ClaySolver,
    geometry: ClayGeometry,
    history: ClayHistory,
    audio: MaterialAudio
  ) {
    this.scene = scene;
    this.solver = solver;
    this.geometry = geometry;
    this.history = history;
    this.audio = audio;

    this.attachEvents();
  }

  public setCallbacks(onSculptChange?: () => void, onLimitReached?: () => void): void {
    this.onSculptChangeCallback = onSculptChange;
    this.onLimitReachedCallback = onLimitReached;
  }

  private attachEvents(): void {
    const el = this.scene.renderer.domElement;
    el.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerCancel);
  }

  private onPointerDown = (e: PointerEvent): void => {
    // Only respond to primary button (left click or single touch)
    if (e.button !== 0) return;

    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.scene.camera);
    const intersects = this.raycaster.intersectObject(this.scene.clayMesh, false);

    if (intersects.length > 0) {
      // Clicked on clay!
      this.isDragging = true;
      this.activePointerId = e.pointerId;
      this.scene.renderer.domElement.setPointerCapture(e.pointerId);

      // Disable orbit controls while sculpting
      this.scene.controls.enabled = false;

      this.pointerDownPos.set(e.clientX, e.clientY);
      this.lastPointerPos.set(e.clientX, e.clientY);
      this.hasCrossedDeadzone = false;

      // Local intersection point on clay mesh
      const hit = intersects[0];
      const localPoint = this.scene.clayMesh.worldToLocal(hit.point.clone());
      this.lastContactPoint.copy(localPoint);

      // Begin history transaction
      this.history.beginTransaction({
        timestamp: Date.now(),
        height: this.solver.height,
        rotation: this.solver.rotation,
        radii: this.solver.radii,
        thickness: this.solver.thickness,
        marks: this.solver.marks
      });

      this.audio.unlock();
    } else {
      // Clicked on empty space -> enable OrbitControls for camera
      this.scene.controls.enabled = true;
    }
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.isDragging || e.pointerId !== this.activePointerId) return;

    const dx = e.clientX - this.lastPointerPos.x;
    const dy = e.clientY - this.lastPointerPos.y;
    const totalDist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);

    const deadzone = e.pointerType === 'touch' ? 5.0 : 2.0;
    if (!this.hasCrossedDeadzone && totalDist < deadzone) return;
    this.hasCrossedDeadzone = true;

    // Raycast current position
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.scene.camera);
    const intersects = this.raycaster.intersectObject(this.scene.clayMesh, false);

    let contactY = this.lastContactPoint.y;
    let contactTheta = Math.atan2(this.lastContactPoint.z, this.lastContactPoint.x);

    if (intersects.length > 0) {
      const localPoint = this.scene.clayMesh.worldToLocal(intersects[0].point.clone());
      contactY = localPoint.y;
      contactTheta = Math.atan2(localPoint.z, localPoint.x);
      this.lastContactPoint.copy(localPoint);
    }

    const dxNorm = dx / window.innerWidth;
    const speed = Math.hypot(dx, dy) / 20.0;
    const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.5;

    // Apply Sculpting Action
    let changed = false;
    let hitLimit = false;

    if (this.activeTool === 'modelar') {
      const res = this.solver.applyModelar(
        contactY,
        contactTheta,
        dxNorm,
        this.activeScope,
        this.brushRadius,
        this.sensitivity
      );
      changed = res.changed;
      hitLimit = res.atLimit;
    } else if (this.activeTool === 'alisar') {
      const res = this.solver.applyAlisar(
        contactY,
        contactTheta,
        this.brushRadius,
        0.12 * this.sensitivity
      );
      changed = res.changed;
    } else if (this.activeTool === 'marcar') {
      const res = this.solver.applyMarcar(
        contactY,
        contactTheta,
        this.brushRadius * 0.65,
        0.0006 * this.sensitivity
      );
      changed = res.changed;
      hitLimit = res.atLimit;
    }

    if (changed) {
      // Update mesh geometry
      this.geometry.updatePositions(
        this.solver.radii,
        this.solver.thickness,
        this.solver.marks,
        this.solver.height
      );

      // Add local wetness shading
      const centerJ = Math.floor((contactY / this.solver.height) * (this.geometry.M - 1));
      const normTheta = (contactTheta + Math.PI * 2) % (Math.PI * 2);
      const centerI = Math.floor((normTheta / (Math.PI * 2)) * this.geometry.N);
      this.geometry.addWetness(centerJ, centerI, 4);

      if (this.onSculptChangeCallback) this.onSculptChangeCallback();
    }

    if (hitLimit && this.onLimitReachedCallback) {
      this.onLimitReachedCallback();
    }

    // Audio feedback
    this.audio.updateContact(speed, pressure, this.activeTool);
    this.lastPointerPos.set(e.clientX, e.clientY);
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (!this.isDragging || e.pointerId !== this.activePointerId) return;

    this.isDragging = false;
    this.activePointerId = null;
    this.scene.controls.enabled = true;
    this.audio.stopContact();

    try {
      this.scene.renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if capture was lost
    }

    // Commit snapshot to history
    this.history.commitTransaction({
      timestamp: Date.now(),
      height: this.solver.height,
      rotation: this.solver.rotation,
      radii: this.solver.radii,
      thickness: this.solver.thickness,
      marks: this.solver.marks
    });
  };

  private onPointerCancel = (e: PointerEvent): void => {
    if (this.isDragging && e.pointerId === this.activePointerId) {
      this.isDragging = false;
      this.activePointerId = null;
      this.scene.controls.enabled = true;
      this.audio.stopContact();
      this.history.cancelTransaction();
    }
  };

  public dispose(): void {
    const el = this.scene.renderer.domElement;
    el.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerCancel);
  }
}
