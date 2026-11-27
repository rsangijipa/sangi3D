(() => {
  'use strict';
  if (document.documentElement.classList.contains('azulejos-3d')) return;

  const panels = [
    {
      name: 'Rosácea de Cobalto', level: 'Iniciante', size: 3, style: 'rose',
      description: 'Siga as pétalas azuis até o centro da rosácea.',
      palette: ['#eee4cb', '#163c68', '#3670a3', '#be843c', '#532f40'],
      gaps: [0, 4, 5, 7], extras: []
    },
    {
      name: 'Jardim de Açafrão', level: 'Intermediário', size: 4, style: 'garden',
      description: 'Reconecte os ramos de um jardim pintado em verde e âmbar.',
      palette: ['#f0e5c4', '#244a3e', '#617b52', '#c38934', '#9a5440'],
      gaps: [1, 4, 6, 9, 11, 14], extras: [0, 10]
    },
    {
      name: 'Ondas da Maré', level: 'Avançado', size: 4, style: 'wave',
      description: 'Acompanhe as curvas e as interrupções no desenho das ondas.',
      palette: ['#e6e7d3', '#153d51', '#2e7682', '#bd764c', '#5c4260'],
      gaps: [0, 2, 5, 6, 9, 11, 12, 15], extras: [1, 7, 14]
    },
    {
      name: 'Estrela de Terracota', level: 'Especialista', size: 5, style: 'star',
      description: 'Reconstrua a estrela e os losangos da moldura entre peças parecidas.',
      palette: ['#f0dfc2', '#793d39', '#ac5745', '#bc8a48', '#334955'],
      gaps: [0, 2, 4, 6, 7, 10, 12, 13, 16, 19, 21, 23], extras: [1, 11, 17, 24]
    }
  ];

  const resolution = 1280;
  const extent = 1000;
  const tau = Math.PI * 2;

  function canvas(size) {
    const result = document.createElement('canvas');
    result.width = result.height = size;
    return result;
  }

  function paintMosaic(panel) {
    const picture = canvas(resolution);
    const pen = picture.getContext('2d');
    const [glaze, dark, blue, gold, accent] = panel.palette;
    pen.scale(resolution / extent, resolution / extent);
    pen.fillStyle = glaze;
    pen.fillRect(0, 0, extent, extent);
    pen.lineJoin = pen.lineCap = 'round';

    function ellipse(x, y, width, height, angle, color) {
      pen.beginPath();
      pen.ellipse(x, y, width, height, angle, 0, tau);
      pen.fillStyle = color;
      pen.fill();
    }

    function path(points, color, lineWidth = 0) {
      pen.beginPath();
      points.forEach(([x, y], i) => i === 0 ? pen.moveTo(x, y) : pen.lineTo(x, y));
      if (lineWidth) {
        pen.lineWidth = lineWidth;
        pen.strokeStyle = color;
        pen.stroke();
      } else {
        pen.closePath();
        pen.fillStyle = color;
        pen.fill();
      }
    }

    function petal(cx, cy, angle, length, width, outer, inner) {
      pen.save();
      pen.translate(cx, cy);
      pen.rotate(angle);
      pen.beginPath();
      pen.moveTo(0, 0);
      pen.bezierCurveTo(length * .24, -width, length * .83, -width, length, 0);
      pen.bezierCurveTo(length * .83, width, length * .24, width, 0, 0);
      pen.fillStyle = outer;
      pen.fill();
      path([[length * .14, 0], [length * .78, 0]], inner, 3);
      pen.restore();
    }

    function flower(x, y, radius, petals, color, trim, rotation = 0) {
      for (let i = 0; i < petals; i++) {
        petal(x, y, rotation + i * tau / petals, radius, radius * .27, color, trim);
      }
      ellipse(x, y, radius * .18, radius * .18, 0, trim);
    }

    function star(x, y, outer, inner, rays, color, rotation = -Math.PI / 2) {
      const points = Array.from({ length: rays * 2 }, (_, i) => {
        const angle = rotation + i * Math.PI / rays;
        const radius = i % 2 ? inner : outer;
        return [x + Math.cos(angle) * radius, y + Math.sin(angle) * radius];
      });
      path(points, color);
    }

    for (const [inset, width, color] of [[18, 13, dark], [34, 4, gold], [72, 6, dark], [83, 2, blue]]) {
      pen.lineWidth = width;
      pen.strokeStyle = color;
      pen.strokeRect(inset, inset, extent - inset * 2, extent - inset * 2);
    }
    for (let side = 0; side < 4; side++) {
      pen.save();
      pen.translate(500, 500);
      pen.rotate(side * Math.PI / 2);
      for (let x = -403; x <= 403; x += 62) {
        star(x, -447, 16, 6, 4, side % 2 ? gold : blue);
        ellipse(x + 30, -447, 3, 3, 0, dark);
      }
      pen.restore();
    }

    if (panel.style === 'rose') {
      ellipse(500, 505, 316, 316, 0, dark);
      ellipse(500, 505, 302, 302, 0, glaze);
      ellipse(500, 505, 291, 291, 0, gold);
      ellipse(500, 505, 280, 280, 0, glaze);
      flower(500, 505, 267, 8, dark, gold, Math.PI / 8);
      flower(500, 505, 166, 8, blue, glaze);
      star(500, 505, 61, 36, 8, gold);
      flower(500, 505, 31, 6, accent, glaze, .2);

      [[180, 173, 73, 6], [815, 188, 78, 7], [191, 828, 82, 5], [821, 811, 70, 8]]
        .forEach(([x, y, radius, petals], i) => flower(x, y, radius, petals, i === 2 ? gold : blue, dark, i * .32));
      [[503, 142], [850, 522], [530, 864], [142, 481]].forEach(([x, y], i) => star(x, y, 29 + i * 3, 13, 4, i % 2 ? gold : dark));
    }

    if (panel.style === 'garden') {
      const branches = [[20, 65, 0], [-28, -78, Math.PI]];
      branches.forEach(([dx, dy, angle], branch) => {
        pen.save();
        pen.translate(500 + dx, 500 + dy);
        pen.rotate(angle);
        pen.beginPath();
        pen.moveTo(-330, 250);
        pen.bezierCurveTo(220, 236, -232, -202, 295, -257);
        pen.lineWidth = 11;
        pen.strokeStyle = dark;
        pen.stroke();
        const leaves = [[-295, 236, -1.4], [-193, 204, .7], [-99, 124, -2.55], [-52, 33, -.19], [-18, -56, -2.4], [39, -149, -.12], [126, -207, -1.9], [226, -244, .4]];
        leaves.forEach(([x, y, turn], i) => petal(x, y, turn, 72 + (i % 3) * 10, 23, i % 2 ? dark : blue, glaze));
        flower(281, -256, 68, 6 + branch, gold, accent, .2);
        pen.restore();
      });
      [[199, 189, 65], [747, 241, 89], [773, 781, 62], [272, 781, 85], [486, 523, 102]]
        .forEach(([x, y, radius], i) => flower(x, y, radius, 5 + i, i % 2 ? accent : gold, dark, i * .4));
      [[318, 278], [729, 639], [163, 606], [384, 149], [627, 843]].forEach(([x, y]) => star(x, y, 16, 7, 4, accent));
    }

    if (panel.style === 'wave') {
      pen.save();
      pen.beginPath();
      pen.rect(86, 86, 828, 828);
      pen.clip();
      for (let wave = 0; wave < 9; wave++) {
        pen.beginPath();
        for (let x = 75; x <= 930; x += 5) {
          const y = 135 + wave * 94 + Math.sin(x / (72 + wave * 1.5) + wave * .83) * (28 + wave * 2)
            + Math.sin(x / 190 + wave * .56) * 18;
          if (x === 75) pen.moveTo(x, y);
          else pen.lineTo(x, y);
        }
        pen.lineWidth = wave % 3 === 0 ? 18 : 9;
        pen.strokeStyle = wave % 3 === 2 ? gold : wave % 2 ? blue : dark;
        pen.stroke();
      }
      [[240, 235, 58], [670, 352, 86], [377, 528, 76], [786, 638, 47], [190, 762, 62]]
        .forEach(([x, y, size], i) => {
          ellipse(x, y, size + 13, size * .75 + 12, -.34, glaze);
          petal(x - size, y + 22, -.32, size * 1.9, size * .59, i % 2 ? dark : blue, glaze);
          ellipse(x + size * .45, y - size * .13, size * .07, size * .07, 0, gold);
        });
      pen.restore();
    }

    if (panel.style === 'star') {
      for (let y = 167; y <= 850; y += 136) {
        for (let x = 167; x <= 850; x += 136) {
          const row = Math.round((y - 167) / 136);
          const col = Math.round((x - 167) / 136);
          if (Math.hypot(x - 500, y - 500) < 310) continue;
          const color = (row + col) % 2 ? blue : accent;
          star(x, y, 48, 24, 4, color);
          star(x, y, 27, 11, 4, glaze, Math.PI / 4);
          ellipse(x, y, 5, 5, 0, gold);
        }
      }
      const [x, y] = [493, 509];
      star(x, y, 382, 221, 8, dark);
      star(x, y, 354, 204, 8, glaze);
      star(x, y, 333, 192, 8, gold);
      star(x, y, 296, 169, 8, blue);
      star(x, y, 236, 130, 8, glaze, Math.PI / 8);
      flower(x, y, 142, 8, accent, gold, Math.PI / 8);
      star(x, y, 53, 28, 8, dark);
      ellipse(x, y, 13, 13, 0, gold);
      [[227, 340], [705, 274], [744, 692], [330, 791]].forEach(([cx, cy], i) => flower(cx, cy, 27 + i, 5, i % 2 ? gold : accent, glaze, i));
    }

    // Subtle kiln variations across colors remain readable at tray size.
    let seed = panel.size * 101 + panel.gaps[0];
    function grain() {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    }
    for (let i = 0; i < 10000; i++) {
      pen.fillStyle = i % 2 ? '#441e1012' : '#fffdf827';
      const length = .4 + grain() * 2.8;
      pen.fillRect(grain() * extent, grain() * extent, length, length * .63);
    }
    const sheen = pen.createLinearGradient(0, 0, extent, extent);
    sheen.addColorStop(0, '#ffffff25');
    sheen.addColorStop(.45, '#ffffff00');
    sheen.addColorStop(1, '#48271318');
    pen.fillStyle = sheen;
    pen.fillRect(0, 0, extent, extent);
    return picture;
  }

  function exportImage(source, size) {
    const target = canvas(size);
    target.getContext('2d').drawImage(source, 0, 0, size, size);
    return target.toDataURL('image/png');
  }

  function tileImages(picture, size) {
    const tile = canvas(256);
    const pen = tile.getContext('2d');
    const pitch = picture.width / size;
    return Array.from({ length: size * size }, (_, index) => {
      pen.clearRect(0, 0, tile.width, tile.height);
      pen.drawImage(picture, index % size * pitch, Math.floor(index / size) * pitch, pitch, pitch, 0, 0, tile.width, tile.height);
      return tile.toDataURL('image/png');
    });
  }

  function shuffle(values) {
    const shuffled = [...values];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function newPuzzle(panel) {
    const pieces = shuffle([...panel.gaps, ...panel.extras]);
    return {
      pieces,
      angles: Object.fromEntries(pieces.map((id, index) => [
        id, index === 0 && panel.size === 3 ? 0 : Math.floor(Math.random() * 4)
      ])),
      placed: []
    };
  }

  const storageKey = 'restauro-azulejos-puzzle-v1';
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch {}
  const games = panels.map((panel, index) => {
    const game = saved?.games?.[index];
    const catalog = [...panel.gaps, ...panel.extras];
    if (!Array.isArray(game?.pieces) || game.pieces.length !== catalog.length ||
        !catalog.every(id => game.pieces.includes(id) && [0, 1, 2, 3].includes(game.angles?.[id])) ||
        !Array.isArray(game.placed) || new Set(game.placed).size !== game.placed.length ||
        !game.placed.every(id => panel.gaps.includes(id) && game.angles[id] === 0)) {
      return newPuzzle(panel);
    }
    return game;
  });

  let active = Number.isInteger(saved?.active) && panels[saved.active] ? saved.active : 0;
  let selected = null;
  let hinted = null;
  let wrong = null;
  let dragged = null;
  const assetCache = panels.map(panel => {
    const picture = paintMosaic(panel);
    return { picture, thumbnail: exportImage(picture, 112), tiles: null };
  });

  const byId = id => document.getElementById(id);
  const board = byId('puzzle-board');
  const tray = byId('puzzle-tray');
  const collection = byId('puzzle-collection');
  const status = byId('puzzle-status');
  const reference = byId('puzzle-guide');
  const resetDialog = byId('puzzle-reset-dialog');
  const hintButton = byId('puzzle-hint');
  const left = byId('puzzle-ccw');
  const right = byId('puzzle-cw');
  const next = byId('puzzle-next');

  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify({ active, games })); } catch {}
  }

  function announce(message, kind = '') {
    status.textContent = message;
    status.dataset.kind = kind;
  }

  function image(src) {
    const img = new Image();
    img.alt = '';
    img.draggable = false;
    img.src = src;
    return img;
  }

  function render() {
    const panel = panels[active];
    const game = games[active];
    const assets = assetCache[active];
    assets.tiles ??= tileImages(assets.picture, panel.size);
    const complete = game.placed.length === panel.gaps.length;

    byId('puzzle-title').textContent = panel.name;
    byId('puzzle-level').textContent = panel.level + ' · ' + panel.size + '×' + panel.size;
    byId('puzzle-description').textContent = panel.description;
    byId('puzzle-progress').textContent = game.placed.length + ' de ' + panel.gaps.length + ' peças';
    byId('puzzle-meter').max = panel.gaps.length;
    byId('puzzle-meter').value = game.placed.length;
    byId('puzzle-remaining').textContent = complete ? '✓' : game.pieces.length - game.placed.length;
    hintButton.disabled = complete;

    const nextIndex = nextPanel();
    next.hidden = !complete || nextIndex === -1;
    if (!next.hidden) next.textContent = 'Jogar ' + panels[nextIndex].name + ' →';

    [...collection.children].forEach((button, index) => {
      button.setAttribute('aria-pressed', String(index === active));
      const done = games[index].placed.length === panels[index].gaps.length;
      button.querySelector('small').textContent = done ? 'Concluído ✓' : panels[index].size + '×' + panels[index].size;
    });

    board.style.setProperty('--size', panel.size);
    const cells = Array.from({ length: panel.size ** 2 }, (_, id) => {
      const cell = document.createElement('button');
      const open = panel.gaps.includes(id) && !game.placed.includes(id);
      const row = Math.floor(id / panel.size) + 1;
      const col = id % panel.size + 1;
      cell.type = 'button';
      cell.className = 'puzzle-cell';
      cell.dataset.slot = id;
      cell.disabled = !open;
      cell.setAttribute('aria-label', (open ? 'Vão' : 'Azulejo') + ', linha ' + row + ', coluna ' + col);
      if (open) {
        const marker = document.createElement('span');
        marker.className = 'puzzle-slot-mark';
        marker.textContent = '+';
        marker.setAttribute('aria-hidden', 'true');
        cell.append(marker);
      } else {
        cell.append(image(assets.tiles[id]));
      }
      return cell;
    });
    board.replaceChildren(...cells);

    const cards = game.pieces.flatMap((id, index) => {
      if (complete || game.placed.includes(id)) return [];
      const card = document.createElement('button');
      card.type = 'button';
      card.draggable = true;
      card.className = 'puzzle-piece';
      card.dataset.tile = id;
      card.dataset.label = 'Peça ' + (index + 1);
      const art = document.createElement('span');
      art.className = 'puzzle-piece-art';
      art.append(image(assets.tiles[id]));
      card.append(art);
      return [card];
    });
    tray.replaceChildren(...cards);
    updateSelection();
  }

  function updateSelection() {
    const { angles } = games[active];
    for (const card of tray.children) {
      const id = Number(card.dataset.tile);
      const degrees = angles[id] * 90;
      card.querySelector('img').style.transform = 'rotate(' + degrees + 'deg)';
      card.setAttribute('aria-label', card.dataset.label + ', rotação de ' + degrees + ' graus');
      card.setAttribute('aria-pressed', String(selected === id));
      card.classList.toggle('is-hinted', hinted === id);
    }
    for (const cell of board.children) {
      cell.classList.toggle('is-hinted', hinted === Number(cell.dataset.slot));
      cell.classList.toggle('is-wrong', wrong === Number(cell.dataset.slot));
    }
    left.disabled = right.disabled = selected === null;
    const activeCard = selected === null ? null : tray.querySelector('[data-tile="' + selected + '"]');
    byId('puzzle-selection').textContent = activeCard ? activeCard.dataset.label + ' · ' + angles[selected] * 90 + '°' : 'Selecione uma peça';
  }

  function select(id) {
    selected = id;
    wrong = null;
    updateSelection();
    announce('Peça selecionada. Compare as bordas e escolha um vão.');
  }

  function rotate(delta) {
    if (selected === null) return;
    const { angles } = games[active];
    angles[selected] = (angles[selected] + delta + 4) % 4;
    wrong = null;
    persist();
    updateSelection();
    announce('Peça girada. Observe a continuidade do desenho.');
  }

  function place(id) {
    if (selected === null) {
      announce('Escolha uma peça da bandeja primeiro.', 'warn');
      return;
    }
    const panel = panels[active];
    const game = games[active];
    if (!panel.gaps.includes(id) || game.placed.includes(id)) return;

    if (selected !== id || game.angles[selected] !== 0) {
      wrong = id;
      updateSelection();
      announce(selected === id
        ? 'Este é o vão certo. Gire a peça para alinhar o desenho.'
        : 'As bordas não continuam neste vão. Experimente outra posição ou peça.', 'warn');
      return;
    }
    const nextCard = tray.querySelector('[aria-pressed="true"]')?.nextElementSibling?.dataset.tile;
    const restoreFocus = board.contains(document.activeElement) || tray.contains(document.activeElement) ||
      document.activeElement === left || document.activeElement === right;
    game.placed.push(id);
    selected = wrong = null;
    if (hinted === id) hinted = null;
    persist();
    render();

    if (game.placed.length === panel.gaps.length) {
      const allDone = nextPanel() === -1;
      announce(allDone ? 'Coleção restaurada! Você completou os quatro painéis.' : 'Painel restaurado! Escolha outro desafio da coleção.', 'ok');
      if (restoreFocus) (next.hidden ? collection.children[active] : next).focus();
    } else {
      announce('Encaixe perfeito. Escolha a próxima peça.', 'ok');
      if (restoreFocus) (tray.querySelector('[data-tile="' + nextCard + '"]') ?? tray.firstElementChild)?.focus({ preventScroll: true });
    }
  }

  function nextPanel() {
    for (let offset = 1; offset < panels.length; offset++) {
      const index = (active + offset) % panels.length;
      if (games[index].placed.length < panels[index].gaps.length) return index;
    }
    return -1;
  }

  function openPanel(index) {
    active = index;
    selected = hinted = wrong = dragged = null;
    render();
    persist();
    announce(games[index].placed.length === panels[index].gaps.length
      ? 'Painel restaurado. Escolha outro desafio ou reinicie este.'
      : games[index].placed.length ? 'Seu restauro está salvo neste navegador.' : '');
  }

  panels.forEach((panel, index) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'puzzle-case';
    option.append(image(assetCache[index].thumbnail));
    const text = document.createElement('span');
    const title = document.createElement('strong');
    title.textContent = panel.name;
    text.append(title, document.createElement('small'));
    option.append(text);
    option.addEventListener('click', () => openPanel(index));
    collection.append(option);
  });
  tray.addEventListener('click', event => {
    const card = event.target.closest('[data-tile]');
    if (card) select(Number(card.dataset.tile));
  });
  board.addEventListener('click', event => {
    const cell = event.target.closest('button:enabled');
    if (cell) place(Number(cell.dataset.slot));
  });
  tray.addEventListener('dragstart', event => {
    const card = event.target.closest('[data-tile]');
    if (!card) return;
    dragged = Number(card.dataset.tile);
    select(dragged);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', card.dataset.label);
  });
  tray.addEventListener('dragend', () => {
    dragged = null;
    board.querySelector('.is-drop')?.classList.remove('is-drop');
  });
  board.addEventListener('dragover', event => {
    const cell = event.target.closest('button:enabled');
    if (dragged === null || !cell) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    board.querySelector('.is-drop')?.classList.remove('is-drop');
    cell.classList.add('is-drop');
  });
  board.addEventListener('dragleave', event => {
    const cell = event.target.closest('button:enabled');
    if (cell && !cell.contains(event.relatedTarget)) cell.classList.remove('is-drop');
  });
  board.addEventListener('drop', event => {
    const cell = event.target.closest('button:enabled');
    if (dragged === null || !cell) return;
    event.preventDefault();
    dragged = null;
    cell.classList.remove('is-drop');
    place(Number(cell.dataset.slot));
  });

  left.addEventListener('click', () => rotate(-1));
  right.addEventListener('click', () => rotate(1));
  document.addEventListener('keydown', event => {
    if (reference.open || resetDialog.open || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'q') rotate(-1);
    if (key === 'e') rotate(1);
  });
  hintButton.addEventListener('click', () => {
    const pending = panels[active].gaps.filter(id => !games[active].placed.includes(id));
    hinted = pending.includes(selected) ? selected : pending[0];
    select(hinted);
    announce('A peça e o vão destacados combinam. Gire a peça se o desenho estiver desalinhado.');
  });
  byId('puzzle-reference').addEventListener('click', () => {
    const panel = panels[active];
    const refImage = byId('puzzle-reference-image');
    const asset = assetCache[active];
    asset.reference ??= asset.picture.toDataURL('image/png');
    byId('puzzle-reference-title').textContent = panel.name;
    refImage.src = asset.reference;
    refImage.alt = 'Desenho completo de ' + panel.name;
    reference.showModal();
  });
  byId('puzzle-reset').addEventListener('click', () => {
    resetDialog.returnValue = '';
    resetDialog.showModal();
  });
  resetDialog.addEventListener('close', () => {
    if (resetDialog.returnValue !== 'reset') return;
    games[active] = newPuzzle(panels[active]);
    openPanel(active);
    announce('Peças embaralhadas. O painel está pronto para restaurar.');
  });
  next.addEventListener('click', () => {
    const index = nextPanel();
    if (index < 0) return;
    openPanel(index);
    collection.children[index].focus();
  });

  openPanel(active);
})();
