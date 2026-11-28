import { ClaySnapshot } from '../types';

export class ClayHistory {
  private undoStack: ClaySnapshot[] = [];
  private redoStack: ClaySnapshot[] = [];
  private readonly maxSnapshots: number = 30;
  private currentTransaction: ClaySnapshot | null = null;

  /**
   * Captures starting state when gesture begins.
   */
  public beginTransaction(snapshot: ClaySnapshot): void {
    this.currentTransaction = this.cloneSnapshot(snapshot);
  }

  /**
   * Commits the finished gesture transaction if changes occurred.
   */
  public commitTransaction(finalSnapshot: ClaySnapshot): boolean {
    if (!this.currentTransaction) return false;

    // Check if meaningful change occurred between begin and end
    if (!this.hasChanged(this.currentTransaction, finalSnapshot)) {
      this.currentTransaction = null;
      return false;
    }

    this.undoStack.push(this.currentTransaction);
    if (this.undoStack.length > this.maxSnapshots) {
      this.undoStack.shift();
    }

    // New action invalidates the redo stack
    this.redoStack.length = 0;
    this.currentTransaction = null;
    return true;
  }

  public cancelTransaction(): void {
    this.currentTransaction = null;
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public undo(currentSnapshot: ClaySnapshot): ClaySnapshot | null {
    if (!this.canUndo()) return null;
    const target = this.undoStack.pop()!;
    this.redoStack.push(this.cloneSnapshot(currentSnapshot));
    return target;
  }

  public redo(currentSnapshot: ClaySnapshot): ClaySnapshot | null {
    if (!this.canRedo()) return null;
    const target = this.redoStack.pop()!;
    this.undoStack.push(this.cloneSnapshot(currentSnapshot));
    return target;
  }

  public clear(): void {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
    this.currentTransaction = null;
  }

  private cloneSnapshot(snap: ClaySnapshot): ClaySnapshot {
    return {
      timestamp: snap.timestamp,
      height: snap.height,
      rotation: snap.rotation,
      radii: new Float32Array(snap.radii),
      thickness: new Float32Array(snap.thickness),
      marks: new Float32Array(snap.marks)
    };
  }

  private hasChanged(a: ClaySnapshot, b: ClaySnapshot): boolean {
    if (Math.abs(a.height - b.height) > 0.001) return true;
    if (Math.abs(a.rotation - b.rotation) > 0.001) return true;

    for (let i = 0; i < a.radii.length; i++) {
      if (Math.abs(a.radii[i] - b.radii[i]) > 0.0001) return true;
      if (Math.abs(a.marks[i] - b.marks[i]) > 0.0001) return true;
    }
    return false;
  }
}
