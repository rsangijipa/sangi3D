// Contrato de eventos com o launcher (rota ou iframe isolado). Versionado, origem validada.
// Nunca envia textos, nomes de fios ou dados pessoais: apenas contagens observáveis.

export const EVENT_SOURCE = 'tear-dos-vinculos';
export const EVENT_VERSION = 1;

export type OutEventType = 'ready' | 'pause' | 'resume' | 'complete' | 'exit' | 'summary';

export interface SummaryPayload {
  fileiras: number;
  cruzamentos: number;
  trechosCortados: number;
  reconexoes: number;
  pontasPresas: number;
  nos: number;
  modo: string;
  duracaoSegundos: number;
}

export interface OutEvent {
  source: typeof EVENT_SOURCE;
  version: typeof EVENT_VERSION;
  type: OutEventType;
  payload?: SummaryPayload | Record<string, never>;
}

/** Origens aceitas para o pai: a própria origem e servidores locais do launcher. */
export function allowedOrigin(origin: string): boolean {
  if (!origin || origin === 'null') return false;
  if (origin === location.origin) return true;
  try {
    const u = new URL(origin);
    return ['127.0.0.1', 'localhost', '[::1]'].includes(u.hostname);
  } catch {
    return false;
  }
}

function parentOrigin(): string | null {
  if (window.parent === window) return null;
  try {
    const ref = document.referrer ? new URL(document.referrer).origin : location.origin;
    return allowedOrigin(ref) ? ref : null;
  } catch {
    return null;
  }
}

export function emit(type: OutEventType, payload?: SummaryPayload): void {
  const target = parentOrigin() || '*';
  const ev: OutEvent = { source: EVENT_SOURCE, version: EVENT_VERSION, type, payload: payload ?? {} };
  if (window.parent && window.parent !== window) {
    try {
      window.parent.postMessage(ev, target);
      if (type === 'ready') {
        window.parent.postMessage({
          type: 'SANGI_APP_READY',
          id: 'tear-dos-vinculos',
          capabilities: { webgl2: true, touch: true, audio: true, physics: 'verlet' }
        }, target);
      }
    } catch {}
  }
  window.dispatchEvent(new CustomEvent('tear:event', { detail: ev }));
}

export type InCommand = 'pause' | 'resume' | 'exit';

export function listen(handler: (cmd: InCommand) => void): () => void {
  const fn = (e: MessageEvent) => {
    const d = e.data as { target?: string; version?: number; type?: string };
    if (!d || typeof d !== 'object') return;
    if (d.target === EVENT_SOURCE && d.version === EVENT_VERSION) {
      if (d.type === 'pause' || d.type === 'resume' || d.type === 'exit') handler(d.type);
    } else if (d.type === 'SANGI_APP_PAUSE') {
      handler('pause');
    } else if (d.type === 'SANGI_APP_RESUME') {
      handler('resume');
    } else if (d.type === 'SANGI_APP_DISPOSE' || d.type === 'SANGI_APP_EXIT') {
      handler('exit');
    }
  };
  window.addEventListener('message', fn);
  return () => window.removeEventListener('message', fn);
}
