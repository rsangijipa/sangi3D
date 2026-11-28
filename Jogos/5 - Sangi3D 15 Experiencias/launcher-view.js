if (window.frameElement?.classList.contains('player-frame')) {
  const shell = document.querySelector('.shell');
  const panel = shell.querySelector('.panel');
  const settings = shell.querySelector('.global');
  const help = shell.querySelector('#helpBtn');
  const tools = document.createElement('details');
  tools.className = 'scene-tools';
  if (help) tools.classList.add('below-hud');

  const toggle = document.createElement('summary');
  toggle.textContent = 'Controles';
  panel.querySelector('h2').hidden = true;
  if (help) settings.append(help);
  panel.append(settings);
  tools.append(toggle, panel);
  shell.append(tools);
  document.documentElement.classList.add('launcher-embedded');

  tools.addEventListener('keydown', event => {
    if (event.key === 'Escape' && tools.open) {
      tools.open = false;
      toggle.focus();
    }
  });
}
