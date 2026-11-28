import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

function createDomEnv({ inIframe = true } = {}) {
  const posted = [];
  const winListeners = new Map();
  const docListeners = new Map();

  class FakeCustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  }

  const listenerCount = (map, type) => (type ? (map.get(type)?.size || 0) : [...map.values()].reduce((s, set) => s + set.size, 0));

  const document = {
    readyState: 'complete',
    title: 'Test Ambiente',
    hidden: false,
    querySelectorAll: () => [],
    addEventListener(type, fn) {
      if (!docListeners.has(type)) docListeners.set(type, new Set());
      docListeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      docListeners.get(type)?.delete(fn);
    },
    dispatchEvent(ev) {
      for (const fn of [...(docListeners.get(ev.type) || [])]) fn(ev);
    }
  };

  const window = {
    document,
    location: { pathname: '/test/index.html' },
    WebGL2RenderingContext: function WebGL2() {},
    AudioContext: function AudioCtx() {},
    CustomEvent: FakeCustomEvent,
    parent: inIframe ? {
      postMessage(msg, target) {
        posted.push({ msg, target });
      }
    } : null,
    matchMedia: () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {}
    }),
    addEventListener(type, fn) {
      if (!winListeners.has(type)) winListeners.set(type, new Set());
      winListeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      winListeners.get(type)?.delete(fn);
    },
    dispatchEvent(ev) {
      for (const fn of [...(winListeners.get(ev.type) || [])]) fn(ev);
    }
  };
  if (!inIframe) window.parent = window;

  return {
    window,
    document,
    posted,
    CustomEvent: FakeCustomEvent,
    winListenerCount: (type) => listenerCount(winListeners, type),
    docListenerCount: (type) => listenerCount(docListeners, type),
    sendMessage(data) {
      window.dispatchEvent({ type: 'message', data });
    }
  };
}

function loadBridgeInto(env) {
  const code = fs.readFileSync(path.join(ROOT, 'Sistema', 'shared', 'sangi-bridge.js'), 'utf8');
  const context = vm.createContext({
    window: env.window,
    document: env.document,
    location: env.window.location,
    CustomEvent: env.CustomEvent,
    console,
    setTimeout,
    clearTimeout
  });
  vm.runInContext(code, context);
  return env.window.SangiBridge;
}

describe('SangiBridge (shared/sangi-bridge.js)', () => {
  it('emits SANGI_APP_READY on load when in iframe and exposes getState()', () => {
    const env = createDomEnv({ inIframe: true });
    const bridge = loadBridgeInto(env);

    assert.ok(bridge, 'window.SangiBridge must be exposed');
    assert.equal(env.posted.length, 1);
    assert.equal(env.posted[0].msg.type, 'SANGI_APP_READY');
    assert.equal(env.posted[0].msg.title, 'Test Ambiente');
    assert.deepStrictEqual({ ...bridge.getState() }, {
      initialized: true,
      paused: false,
      muted: false,
      disposed: false,
      quality: null
    });
  });

  it('handles SANGI_COMMAND (PAUSE, RESUME, MUTE, UNMUTE, RESET, SET_QUALITY, DISPOSE) and cleans up listeners', () => {
    const env = createDomEnv({ inIframe: true });
    const bridge = loadBridgeInto(env);

    const events = [];
    for (const evName of ['sangi:pause', 'sangi:resume', 'sangi:mute', 'sangi:reset', 'sangi:quality', 'sangi:dispose']) {
      env.window.addEventListener(evName, (e) => events.push({ type: evName, detail: e.detail }));
    }

    env.sendMessage({ type: 'SANGI_COMMAND', command: 'PAUSE' });
    assert.equal(bridge.getState().paused, true);

    env.sendMessage({ type: 'SANGI_COMMAND', command: 'RESUME' });
    assert.equal(bridge.getState().paused, false);

    env.sendMessage({ type: 'SANGI_COMMAND', command: 'MUTE', payload: { muted: true } });
    assert.equal(bridge.getState().muted, true);

    env.sendMessage({ type: 'SANGI_COMMAND', command: 'UNMUTE' });
    assert.equal(bridge.getState().muted, false);

    env.sendMessage({ type: 'SANGI_COMMAND', command: 'SET_QUALITY', payload: { quality: 'BALANCED' } });
    assert.equal(bridge.getState().quality, 'BALANCED');

    env.sendMessage({ type: 'SANGI_COMMAND', command: 'RESET' });
    env.sendMessage({ type: 'SANGI_COMMAND', command: 'DISPOSE' });
    assert.equal(bridge.getState().disposed, true);

    // Our test added 6 listeners; bridge's own message/pagehide/load listeners must be removed
    assert.equal(env.winListenerCount('message'), 0);
    assert.equal(env.winListenerCount('pagehide'), 0);

    assert.deepEqual(events.map((e) => e.type), [
      'sangi:pause',
      'sangi:resume',
      'sangi:mute',
      'sangi:mute',
      'sangi:quality',
      'sangi:reset',
      'sangi:dispose'
    ]);
    assert.equal(events[2].detail.muted, true);
    assert.equal(events[3].detail.muted, false);
    assert.equal(events[4].detail.quality, 'BALANCED');
  });

  it('handles legacy SANGI_APP_* messages identically', () => {
    const env = createDomEnv({ inIframe: false });
    const bridge = loadBridgeInto(env);

    env.sendMessage({ type: 'SANGI_APP_PAUSE' });
    assert.equal(bridge.getState().paused, true);
    env.sendMessage({ type: 'SANGI_APP_MUTE', muted: true });
    assert.equal(bridge.getState().muted, true);
    env.sendMessage({ type: 'SANGI_APP_RESUME' });
    assert.equal(bridge.getState().paused, false);
    env.sendMessage({ type: 'SANGI_APP_DISPOSE' });
    assert.equal(bridge.getState().disposed, true);
  });
});

describe('LifecycleManager (shared/engine/lifecycle.js)', () => {
  it('cancels ready timer on early dispose, handles RESET/SET_QUALITY/UNMUTE, and removes all listeners', async () => {
    const env = createDomEnv({ inIframe: true });
    const prevWin = globalThis.window;
    const prevDoc = globalThis.document;
    const prevCustomEvent = globalThis.CustomEvent;
    const prevLocation = globalThis.location;
    globalThis.window = env.window;
    globalThis.document = env.document;
    globalThis.CustomEvent = env.CustomEvent;
    globalThis.location = env.window.location;

    try {
      const { LifecycleManager } = await import('../../shared/engine/lifecycle.js');
      const calls = [];
      const app = {
        onPause: () => calls.push('pause'),
        onResume: () => calls.push('resume'),
        onMute: (m) => calls.push(`mute:${m}`),
        onReset: () => calls.push('reset'),
        onQualityChange: (q) => calls.push(`quality:${q}`),
        dispose: () => calls.push('dispose')
      };

      const mgr = new LifecycleManager(app, { autoReady: true, bridgeReadyTimeout: 40 });
      env.sendMessage({ type: 'SANGI_COMMAND', command: 'PAUSE' });
      env.sendMessage({ type: 'SANGI_COMMAND', command: 'RESET' });
      env.sendMessage({ type: 'SANGI_COMMAND', command: 'SET_QUALITY', payload: { quality: 'LOW' } });
      env.sendMessage({ type: 'SANGI_COMMAND', command: 'MUTE' });
      env.sendMessage({ type: 'SANGI_COMMAND', command: 'UNMUTE' });
      mgr.dispose();
      // Double dispose should be a no-op
      mgr.dispose();

      await new Promise((r) => setTimeout(r, 70));
      // Ready should NOT have fired because dispose happened before 40ms
      assert.equal(env.posted.length, 0);
      assert.equal(env.winListenerCount(), 0);
      assert.equal(env.docListenerCount(), 0);
      assert.deepEqual(calls, ['pause', 'reset', 'quality:LOW', 'mute:true', 'mute:false', 'dispose']);
    } finally {
      globalThis.window = prevWin;
      globalThis.document = prevDoc;
      globalThis.CustomEvent = prevCustomEvent;
      globalThis.location = prevLocation;
    }
  });
});

describe('ambientes-kit.js teardown contracts', () => {
  it('setupSangiBridge returns dispose() that unsubscribes listeners and handles SANGI_COMMAND', async () => {
    const env = createDomEnv({ inIframe: true });
    const prevWin = globalThis.window;
    const prevDoc = globalThis.document;
    globalThis.window = env.window;
    globalThis.document = env.document;

    try {
      const { setupSangiBridge, setupEnvironmentLifecycle } = await import('../../shared/ambientes-kit.js');
      const calls = [];
      const disposeBridge = setupSangiBridge({
        id: 'test-app',
        onPause: () => calls.push('pause'),
        onResume: () => calls.push('resume'),
        onMute: (m) => calls.push(`mute:${m}`),
        onReset: () => calls.push('reset'),
        onQualityChange: (q) => calls.push(`quality:${q}`),
        onDispose: () => calls.push('dispose')
      });
      const disposeEnv = setupEnvironmentLifecycle({
        onPause: () => {},
        onResume: () => {},
        onReducedMotionChange: () => {}
      });

      assert.equal(typeof disposeBridge, 'function');
      assert.equal(typeof disposeEnv, 'function');

      env.sendMessage({ type: 'SANGI_COMMAND', command: 'RESET' });
      env.sendMessage({ type: 'SANGI_COMMAND', command: 'SET_QUALITY', payload: { quality: 'BALANCED' } });
      env.sendMessage({ type: 'SANGI_COMMAND', command: 'UNMUTE' });
      env.sendMessage({ type: 'SANGI_COMMAND', command: 'DISPOSE' });

      disposeBridge();
      disposeEnv();

      assert.equal(env.winListenerCount(), 0);
      assert.equal(env.docListenerCount(), 0);
      assert.deepEqual(calls, ['reset', 'quality:BALANCED', 'mute:false', 'dispose']);
    } finally {
      globalThis.window = prevWin;
      globalThis.document = prevDoc;
    }
  });

  it('ZenAudioEngine.dispose() & ResponsiveAudio.dispose() stop nodes, cancel timers, and close AudioContext', async () => {
    let closedCount = 0;
    let windStopped = 0;
    class FakeAudioContext {
      constructor() {
        this.state = 'running';
        this.sampleRate = 48000;
        this.currentTime = 0;
        this.destination = {};
      }
      createGain() {
        return {
          gain: { setValueAtTime() {}, cancelScheduledValues() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime() {} },
          connect() {},
          disconnect() {}
        };
      }
      createOscillator() {
        return { type: 'sine', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} };
      }
      createBiquadFilter() {
        return { type: 'lowpass', frequency: { setValueAtTime() {} }, Q: { setValueAtTime() {} }, connect() {} };
      }
      createBuffer(ch, len) {
        return { getChannelData: () => new Float32Array(len) };
      }
      createBufferSource() {
        return { buffer: null, loop: false, connect() {}, disconnect() {}, start() {}, stop() { windStopped++; } };
      }
      resume() {}
      close() { closedCount++; this.state = 'closed'; }
    }

    const prevWin = globalThis.window;
    globalThis.window = { AudioContext: FakeAudioContext };
    try {
      const { ZenAudioEngine } = await import('../../shared/ambientes-kit.js');
      const { ResponsiveAudio } = await import('../../shared/engine/audio.js');

      const zen = new ZenAudioEngine();
      zen.startWind();
      zen.dispose();
      assert.equal(windStopped, 1);
      assert.equal(closedCount, 1);
      assert.equal(zen.ensureContext(), null);

      const resp = new ResponsiveAudio();
      resp.playTypewriterClack();
      resp.dispose();
      await new Promise((r) => setTimeout(r, 30));
      assert.equal(closedCount, 2);
      assert.equal(resp.ensureContext(), null);
    } finally {
      globalThis.window = prevWin;
    }
  });
});
