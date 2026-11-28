/* Território dos Vínculos — camada premium (respiração guiada, diário, progresso de climas, atalhos). */
(function () {
  'use strict';
  var KEY = 'tv-premium-v1';
  var EMOS = ['Alegria', 'Tristeza', 'Medo', 'Raiva', 'Surpresa'];
  var EMO_COLOR = { Alegria: '#f4c95d', Tristeza: '#7fa3c8', Medo: '#9b8bc4', Raiva: '#e0765a', Surpresa: '#7fcf9e' };
  var state = load();

  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY) || '{}'); return { seen: s.seen || [], notes: s.notes || [], intro: !!s.intro }; }
    catch (e) { return { seen: [], notes: [], intro: false }; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- áudio suave (Web Audio, criado só após gesto) ---------- */
  var actx = null, master = null;
  function audio() {
    if (actx) return actx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { actx = new AC(); master = actx.createGain(); master.gain.value = 0.18; master.connect(actx.destination); } catch (e) { actx = null; }
    return actx;
  }
  function chime(freq, dur, vol) {
    var c = audio(); if (!c) return;
    if (c.state === 'suspended') c.resume();
    var t = c.currentTime, o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = freq; o2.type = 'triangle'; o2.frequency.value = freq * 2.005;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.5, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 1.6));
    o.connect(g); o2.connect(g); g.connect(master);
    o.start(t); o2.start(t); o.stop(t + (dur || 1.6) + 0.05); o2.stop(t + (dur || 1.6) + 0.05);
  }
  var pad = null;
  function padOn(target, secs) {
    var c = audio(); if (!c) return;
    if (c.state === 'suspended') c.resume();
    if (!pad) {
      pad = { g: c.createGain(), f: c.createBiquadFilter(), os: [] };
      pad.g.gain.value = 0.0001; pad.f.type = 'lowpass'; pad.f.frequency.value = 600;
      [196, 246.94, 293.66].forEach(function (fq, i) {
        var o = c.createOscillator(); o.type = i ? 'sine' : 'triangle'; o.frequency.value = fq; o.detune.value = (i - 1) * 6;
        o.connect(pad.f); o.start(); pad.os.push(o);
      });
      pad.f.connect(pad.g); pad.g.connect(master);
    }
    var t = c.currentTime;
    pad.g.gain.cancelScheduledValues(t); pad.g.gain.setValueAtTime(Math.max(0.0001, pad.g.gain.value), t);
    pad.g.gain.exponentialRampToValueAtTime(Math.max(0.0001, target), t + secs);
    pad.f.frequency.cancelScheduledValues(t); pad.f.frequency.linearRampToValueAtTime(target > 0.1 ? 1400 : 500, t + secs);
  }
  function padOff() {
    if (!pad || !actx) return;
    var p = pad, t = actx.currentTime; pad = null;
    p.g.gain.cancelScheduledValues(t); p.g.gain.setValueAtTime(Math.max(0.0001, p.g.gain.value), t);
    p.g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
    setTimeout(function () { p.os.forEach(function (o) { try { o.stop(); } catch (e) {} }); }, 900);
  }

  /* ---------- UI ---------- */
  var root = el('div', 'tvp-root');
  var dock = el('div', 'tvp-dock');
  var prog = el('button', 'tvp-chip tvp-prog');
  prog.type = 'button'; prog.title = 'Climas visitados';
  var bBreath = el('button', 'tvp-fab', '<span aria-hidden="true">◎</span><b>Respirar</b>');
  bBreath.type = 'button'; bBreath.title = 'Respiração guiada (B)';
  var bDiary = el('button', 'tvp-fab', '<span aria-hidden="true">✎</span><b>Diário</b>');
  bDiary.type = 'button'; bDiary.title = 'Diário do território (J)';
  var bHelp = el('button', 'tvp-fab tvp-fab-sm', '<span aria-hidden="true">?</span>');
  bHelp.type = 'button'; bHelp.title = 'Como explorar (?)'; bHelp.setAttribute('aria-label', 'Como explorar');
  dock.append(prog, bBreath, bDiary, bHelp);
  var toast = el('div', 'tvp-toast'); toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
  root.append(dock, toast);

  function renderProg() {
    var dots = EMOS.map(function (e) {
      var on = state.seen.indexOf(e) >= 0;
      return '<i style="--c:' + EMO_COLOR[e] + '" class="' + (on ? 'on' : '') + '" title="' + e + '"></i>';
    }).join('');
    prog.innerHTML = '<span class="tvp-dots">' + dots + '</span><b>' + state.seen.length + '/' + EMOS.length + '</b>';
    prog.setAttribute('aria-label', 'Climas visitados: ' + state.seen.length + ' de ' + EMOS.length);
  }
  var toastT = 0;
  function say(msg, ms) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('show'); }, ms || 3200);
  }

  /* ---------- modal ---------- */
  var modal = null;
  function closeModal() {
    if (!modal) return;
    var m = modal; modal = null; m.classList.remove('show');
    if (m._onClose) m._onClose();
    setTimeout(function () { m.remove(); }, 260);
  }
  function openModal(title, body, onClose) {
    closeModal();
    var m = el('div', 'tvp-modal');
    m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', title);
    var card = el('div', 'tvp-card');
    var head = el('div', 'tvp-head', '<h2>' + esc(title) + '</h2>');
    var x = el('button', 'tvp-x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Fechar'); x.onclick = closeModal;
    head.append(x); card.append(head, body); m.append(card);
    m.addEventListener('pointerdown', function (e) { if (e.target === m) closeModal(); });
    m._onClose = onClose; root.append(m); modal = m;
    requestAnimationFrame(function () { m.classList.add('show'); });
    setTimeout(function () { var f = card.querySelector('textarea,button.tvp-primary'); if (f) f.focus(); }, 60);
    return card;
  }

  /* ---------- respiração ---------- */
  var PHASES = [['Inspire', 4, 1], ['Segure', 4, 1], ['Solte o ar', 6, 0]];
  function breathe() {
    var body = el('div', 'tvp-breath');
    body.innerHTML = '<div class="tvp-orb"><div class="tvp-ring"></div><span class="tvp-phase">Pronto?</span><small class="tvp-count"></small></div>' +
      '<p class="tvp-sub">Respire junto com a luz da clareira. Três ciclos de 14 segundos.</p>' +
      '<div class="tvp-row"><button type="button" class="tvp-primary">Começar</button></div>';
    var orb = body.querySelector('.tvp-orb'), ph = body.querySelector('.tvp-phase'), ct = body.querySelector('.tvp-count'), btn = body.querySelector('button');
    var timer = 0, running = false;
    function stop() { running = false; clearTimeout(timer); padOff(); }
    openModal('Respiração da clareira', body, stop);
    btn.onclick = function () {
      if (running) { stop(); btn.textContent = 'Começar'; ph.textContent = 'Pausado'; orb.style.setProperty('--s', 0.55); return; }
      running = true; btn.textContent = 'Pausar';
      var cycle = 0, i = 0;
      (function step() {
        if (!running) return;
        if (i >= PHASES.length) { i = 0; cycle++; }
        if (cycle >= 3) {
          stop(); btn.textContent = 'De novo'; ph.textContent = 'Muito bem'; ct.textContent = 'Seu corpo agradece.';
          orb.style.setProperty('--s', 0.7); chime(523.25, 2.4, 0.4); say('Respiração concluída. Perceba como está agora.');
          return;
        }
        var p = PHASES[i++];
        ph.textContent = p[0]; ct.textContent = 'ciclo ' + (cycle + 1) + ' de 3 · ' + p[1] + 's';
        orb.style.setProperty('--d', p[1] + 's');
        orb.style.setProperty('--s', p[0] === 'Segure' ? 1 : (p[2] ? 1 : 0.55));
        if (p[0] === 'Inspire') { padOn(0.35, p[1]); chime(392, 1.2, 0.2); }
        else if (p[0] === 'Solte o ar') { padOn(0.06, p[1]); chime(293.66, 1.4, 0.15); }
        timer = setTimeout(step, p[1] * 1000);
      })();
    };
  }

  /* ---------- diário ---------- */
  function diary() {
    var body = el('div', 'tvp-diary');
    var chips = EMOS.map(function (e) { return '<button type="button" class="tvp-emo" data-e="' + e + '" style="--c:' + EMO_COLOR[e] + '">' + e + '</button>'; }).join('');
    body.innerHTML = '<p class="tvp-sub">Como você chega ao território hoje?</p><div class="tvp-emos" role="group" aria-label="Emoção">' + chips + '</div>' +
      '<textarea maxlength="400" rows="3" placeholder="Escreva uma frase sobre o que sente ou sobre alguém importante…" aria-label="Anotação"></textarea>' +
      '<div class="tvp-row"><button type="button" class="tvp-primary">Guardar no diário</button></div><ul class="tvp-notes"></ul>';
    var pick = null, ta = body.querySelector('textarea'), list = body.querySelector('.tvp-notes');
    body.querySelectorAll('.tvp-emo').forEach(function (b) {
      b.onclick = function () {
        pick = b.dataset.e;
        body.querySelectorAll('.tvp-emo').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      };
    });
    function draw() {
      list.innerHTML = state.notes.length ? state.notes.slice().reverse().map(function (n) {
        var d = new Date(n.t);
        return '<li style="--c:' + (EMO_COLOR[n.e] || '#ccc') + '"><b>' + esc(n.e || '—') + '</b><span>' + esc(n.x) + '</span><time>' + d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + '</time></li>';
      }).join('') : '<li class="tvp-empty">Seu diário ainda está em branco.</li>';
    }
    body.querySelector('.tvp-primary').onclick = function () {
      var x = ta.value.trim();
      if (!x && !pick) { say('Escolha uma emoção ou escreva algo.'); return; }
      state.notes.push({ e: pick, x: x, t: Date.now() }); state.notes = state.notes.slice(-30); save();
      ta.value = ''; draw(); chime(659.25, 1.2, 0.25); say('Guardado no diário.');
      if (pick) clickEmotion(pick);
    };
    draw();
    openModal('Diário do território', body);
  }

  /* ---------- ajuda ---------- */
  function help() {
    var body = el('div', 'tvp-help');
    body.innerHTML = '<ul>' +
      '<li><kbd>Arrastar</kbd> gira a câmera · <kbd>Roda / pinça</kbd> aproxima</li>' +
      '<li><kbd>Toque</kbd> no balanço, na coruja ou nas lanternas para interagir</li>' +
      '<li><kbd>1</kbd>–<kbd>5</kbd> trocam o clima emocional</li>' +
      '<li><kbd>B</kbd> respiração guiada · <kbd>J</kbd> diário · <kbd>H</kbd> recolhe controles</li>' +
      '</ul><p class="tvp-sub">Visite os cinco climas para acender a constelação de vínculos. Cada emoção muda luz, vento, chuva e sons — e nenhuma delas é errada.</p>' +
      '<div class="tvp-row"><button type="button" class="tvp-primary">Explorar</button></div>';
    body.querySelector('.tvp-primary').onclick = closeModal;
    openModal('Como explorar o território', body, function () { state.intro = true; save(); });
  }

  /* ---------- integração com os botões existentes ---------- */
  function findBtn(label) {
    var bs = document.querySelectorAll('#root button');
    for (var i = 0; i < bs.length; i++) if ((bs[i].textContent || '').trim() === label) return bs[i];
    return null;
  }
  function clickEmotion(e) { var b = findBtn(e); if (b) b.click(); }
  function markSeen(e) {
    if (EMOS.indexOf(e) < 0 || state.seen.indexOf(e) >= 0) return;
    state.seen.push(e); save(); renderProg();
    prog.classList.remove('pulse'); void prog.offsetWidth; prog.classList.add('pulse');
    if (state.seen.length === EMOS.length) {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { setTimeout(function () { chime(f, 1.8, 0.3); }, i * 160); });
      say('Constelação completa! Você atravessou todos os climas — todos cabem no território.', 5200);
    } else {
      chime(440 + state.seen.length * 55, 1.1, 0.22);
      say('Novo clima visitado: ' + e + ' (' + state.seen.length + '/' + EMOS.length + ')');
    }
  }
  document.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest && ev.target.closest('#root button');
    if (b) markSeen((b.textContent || '').trim());
  }, true);

  bBreath.onclick = breathe; bDiary.onclick = diary; bHelp.onclick = help;
  prog.onclick = function () {
    var miss = EMOS.filter(function (e) { return state.seen.indexOf(e) < 0; });
    say(miss.length ? 'Faltam: ' + miss.join(', ') + '.' : 'Constelação completa. Volte quando quiser.');
  };

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    if (e.key === 'Escape' && modal) { closeModal(); return; }
    if (modal) return;
    var k = e.key.toLowerCase();
    if (k >= '1' && k <= '5') { clickEmotion(EMOS[+k - 1]); }
    else if (k === 'b') breathe();
    else if (k === 'j') diary();
    else if (k === '?') help();
  });
  window.addEventListener('sangi:pause', function () { if (actx && actx.state === 'running') actx.suspend(); });
  window.addEventListener('sangi:resume', function () { if (actx && actx.state === 'suspended') actx.resume(); });

  function mount() {
    document.body.append(root); renderProg();
    if (!state.intro) setTimeout(function () { if (!modal) help(); }, 2600);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
