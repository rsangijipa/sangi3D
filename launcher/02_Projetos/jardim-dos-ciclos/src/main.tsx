import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useGardenStore } from './store/useGardenStore';
import { gardenAudio } from './audio/gardenAudio';
import './styles/garden.css';
import './styles/imersivo.css';

const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

let disposed = false;
const disposeAll = () => {
  if (disposed) return;
  disposed = true;
  try { root.unmount(); } catch {}
  try { (gardenAudio as unknown as { dispose?: () => void })?.dispose?.(); } catch {}
};

window.addEventListener('sangi:mute', (e) => {
  const muted = Boolean((e as CustomEvent<{ muted?: boolean }>)?.detail?.muted);
  useGardenStore.setState({ audioEnabled: !muted });
});
window.addEventListener('sangi:dispose', disposeAll);
window.addEventListener('beforeunload', disposeAll);
window.addEventListener('message', (e) => {
  if (e.data?.type === 'SANGI_APP_DISPOSE') disposeAll();
});
