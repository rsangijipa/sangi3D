# Sangi3D — Mapa de Dependências

## 1. Dependências do Runtime Web
- **Three.js**: Versão 0.160+ / r128 compatível.
- **Web Audio API**: Nativo dos navegadores modernos.
- **Sangi Bridge**: `shared/sangi-bridge.js` (comunicação postMessage bidirecional com o Launcher).
- **Ambientes Kit**: `shared/ambientes-kit.js` (botão de retorno, acessibilidade e utilitários).
- **Engine Compartilhada**: `shared/engine/*.js` (física, materiais, áudio, partículas, ciclo de vida).

## 2. Semântica de Rotas e Manifestos
- Catálogo primário: `api/apps.json`
- Catálogo espelhado do launcher: `launcher/api/apps.json`
- Servidor de desenvolvimento: `launcher/server.mjs`
