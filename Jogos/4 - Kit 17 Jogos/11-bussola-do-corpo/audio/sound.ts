import { Ambience } from '../scene/core/audio';
export class ObservatorySound {
  private ambience = new Ambience();
  private enabled = false;

  update(enabled: boolean, quiet: boolean, volume: number) {
    this.enabled = enabled && !quiet;
    this.ambience.setVolume(Math.min(0.35, volume));
    if (this.ambience.enabled !== this.enabled) this.ambience.setEnabled(this.enabled);
    this.ambience.layer('room', this.enabled ? 0.26 : 0);
  }
  touch() { if (this.enabled) this.ambience.tap(0.85); }
  dispose() {
    this.ambience.setEnabled(false);
    this.ambience.dispose();
    this.enabled = false;
  }
}
