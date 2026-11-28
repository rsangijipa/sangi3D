export function layout(app:HTMLElement) {
  app.innerHTML = `
    <header class="bar">
      <div class="brand"><span class="crest" aria-hidden="true">◈</span><span>Ateliê das Reconstruções<small>KINTSUGI</small></span></div>
      <div class="bar-actions">
        <button data-action="sound" class="icon-button" aria-label="Ativar som" title="Som" aria-pressed="false">♬</button>
        <button data-action="settings" class="icon-button" aria-label="Configurações" title="Configurações">⚙</button>
        <button data-action="fullscreen" class="icon-button fullscreen" aria-label="Tela cheia" title="Tela cheia">⛶</button>
        <button data-action="pause" class="icon-button" aria-label="Pausar" title="Pausar">Ⅱ</button>
        <button data-action="exit" class="exit-button" aria-label="Sair da bancada" title="Sair da bancada"><span>Sair</span> ↗</button>
      </div>
    </header>
    <main id="experience">
      <div id="world"></div>
      <div id="fallback" hidden><p>Visualização 3D indisponível. Use o painel para encaixar, restaurar e comparar a peça.</p><div id="diagram" aria-hidden="true"></div></div>
      <div class="vignette"></div>
      <div id="scene-label"><span class="label-line"></span><span id="piece-name"></span></div>
      <section id="entry" class="entry" aria-labelledby="entry-title">
        <p class="eyebrow"><span></span> OFICINA DE CERÂMICA</p>
        <h1 id="entry-title">Ateliê das<br>Reconstruções<span>.</span></h1>
        <p class="intro">Reúna os fragmentos de uma cerâmica e desenhe suas junções com laca e ouro. Deixe a peça no estado que preferir.</p>
        <div class="entry-buttons">
          <button data-action="start" class="primary">Começar na bancada <span aria-hidden="true">→</span></button>
          <button data-action="activity" class="quiet">Escolher atividade</button>
        </div>
      </section>
      <aside id="panel" class="panel" aria-label="Painel de ferramentas" hidden></aside>
      <div id="status" class="status" role="status" aria-live="polite"></div>
      <div id="work-hud" hidden>
        <div class="bottom-wrap">
          <div class="dock" role="group" aria-label="Ferramentas da bancada">
            <button data-action="tool-fit" data-tool="fit"><i aria-hidden="true">◇</i><span>Encaixar<span class="desktop"> fragmentos</span></span></button>
            <button data-action="tool-lacquer" data-tool="lacquer"><i aria-hidden="true">∕</i><span><span class="desktop">Aplicar </span>laca</span></button>
            <button data-action="tool-finish" data-tool="finish"><i aria-hidden="true">✧</i><span>Acabamento</span></button>
            <button data-action="tool-orbit" data-tool="orbit"><i aria-hidden="true">↻</i><span>Girar</span></button>
            <button data-action="undo" class="history" aria-label="Desfazer" title="Desfazer"><i aria-hidden="true">↶</i><span>Desfazer</span></button>
          </div>
          <button data-action="review" class="review-button">Revisar <span aria-hidden="true">→</span></button>
        </div>
      </div>
      <button data-action="show" class="show-button" hidden>Mostrar controles</button>
    </main>
    <dialog id="dialog" aria-labelledby="dialog-title"><div id="dialog-content"></div></dialog>
  `
}
