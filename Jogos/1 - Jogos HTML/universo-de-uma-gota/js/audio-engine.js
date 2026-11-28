/**
 * Motor de áudio sensorial discreto (desligado inicialmente).
 * Separa ambiente de laboratório, sons de instrumentos e sonificação opcional de movimento.
 */

export function createAudioEngine(workbenchSound) {
  const settings = {
    enabled: false,
    ambience: false,
    instruments: true,
    sonification: false,
  };

  let lastFocusTick = 0;

  function playInstrument(type) {
    if (!settings.enabled || !settings.instruments) return;
    const now = performance.now();
    if (type === 'focus') {
      if (now - lastFocusTick < 65) return;
      lastFocusTick = now;
      workbenchSound({frequency: 310, end: 280, duration: 0.04, volume: 0.035, type: 'triangle'});
    } else if (type === 'turret') {
      workbenchSound({frequency: 240, end: 180, duration: 0.09, volume: 0.075, type: 'triangle'});
    } else if (type === 'pipette') {
      workbenchSound({frequency: 260, end: 420, duration: 0.14, volume: 0.07, type: 'sine'});
    } else if (type === 'shutter') {
      workbenchSound({frequency: 620, end: 380, duration: 0.08, volume: 0.08, type: 'triangle'});
    } else if (type === 'identify') {
      workbenchSound({frequency: 360, end: 540, duration: 0.22, volume: 0.075, type: 'sine'});
    }
  }

  function playSonification(speedUmPerSec) {
    if (!settings.enabled || !settings.sonification) return;
    const freq = Math.max(180, Math.min(720, 220 + speedUmPerSec * 1.4));
    workbenchSound({frequency: freq, end: freq * 1.04, duration: 0.12, volume: 0.03, type: 'sine'});
  }

  return {
    settings,
    playInstrument,
    playSonification,
    setEnabled(v) { settings.enabled = Boolean(v); },
    setInstruments(v) { settings.instruments = Boolean(v); },
    setSonification(v) { settings.sonification = Boolean(v); },
    setAmbience(v) { settings.ambience = Boolean(v); },
  };
}
