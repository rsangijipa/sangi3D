export type ToolType = 'modelar' | 'alisar' | 'marcar';
export type ScopeType = 'ring' | 'local';

export interface ClayConfig {
  rings: number;       // M height divisions (default 40 desktop, 28 mobile)
  segments: number;    // N angular divisions (default 96 desktop, 64 mobile)
  height: number;      // Current piece height in meters [0.10, 0.38]
  minThickness: number; // 0.008 m
  targetThickness: number; // 0.012 m
  baseThickness: number; // 0.018 m
  minRadius: number;   // 0.035 m
  maxRadius: number;   // 0.22 m
}

export interface ClaySnapshot {
  timestamp: number;
  height: number;
  radii: Float32Array;      // Size M * N
  thickness: Float32Array;  // Size M * N
  marks: Float32Array;      // Size M * N
  rotation: number;         // Pottery wheel rotation in radians
}

export type GuidedState =
  | 'IDLE'
  | 'SETUP'
  | 'ARRIVE'
  | 'TOUCH'
  | 'EXPERIMENT'
  | 'OBSERVE'
  | 'CLOSE'
  | 'FINISHED'
  | 'PAUSED';

export type DurationChoice = 'brief' | 'timed' | 'timeless';

export interface GuidedStepContent {
  step: number;
  title: string;
  primaryText: string;
  auxiliaryText: string;
  suggestedTool?: ToolType;
  suggestedScope?: ScopeType;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  suggestedDurationSeconds: {
    brief: number;
    timed: number;
  };
}

export interface CameraPreset {
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface SessionData {
  version: 1;
  timestamp: number;
  name?: string;
  rings: number;
  segments: number;
  height: number;
  radii: number[];
  thickness: number[];
  marks: number[];
  rotation: number;
  preferences: {
    audioEnabled: boolean;
    volume: number;
    speechEnabled: boolean;
    reducedMotion: boolean;
    quality: 'auto' | 'high' | 'low';
  };
  reflectionNote?: string;
}
