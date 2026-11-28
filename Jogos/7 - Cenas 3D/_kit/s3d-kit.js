/* S3D Kit — camada comum das Cenas 3D Sangi3D (derivada do piloto S3D-117).
 * Script clássico (sem módulo). Expõe window.S3DKit.
 *
 * Fornece: tutorial pulável, Diário de campo (metas opcionais, sem placar/tempo), toast,
 * foto PNG local, qualidade LOW/BALANCED/HIGH/AUTO, pausa (usuário × host × aba oculta),
 * tela de erro com "Tentar novamente", storage seguro, estatísticas de frame e hook de QA.
 *
 * Uso:
 *   var kit = S3DKit.create({
 *     id: 's3d118', title: 'Nome', tutorial: ['passo 1', 'passo 2', 'passo 3'],
 *     goals: [{ id: 'x', label: 'Faça X' }],
 *     meter: { label: 'Umidade' },                        // opcional
 *     canvas: function () { return renderer.domElement; },
 *     render: function () { renderer.render(scene, camera); },
 *     setPaused: function (paused) { ... },               // pausa RAF/áudio da cena
 *     applyQuality: function (level) { ... },             // 'low' | 'balanced' | 'high'
 *     onReset: function () { ... },                       // opcional (botão Reiniciar)
 *     qa: { nome: function () {...} }                      // checks expostos em window.__S3D__
 *   });
 *   kit.frame(dtSeconds)  // chamar 1x por frame no loop (estatísticas + AUTO)
 *   kit.goal('x')         // marcar descoberta
 */
(function (root) {
  'use strict';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function fatal(msg) {
    var f = document.querySelector('.s3dk-fatal');
    if (!f) {
      f = el('div', 's3dk-fatal');
      document.body.appendChild(f);
    }
    f.innerHTML = '';
    f.appendChild(el('div', '', msg));
    var b = el('button', 's3dk-primary', 'Tentar novamente');
    b.type = 'button';
    b.addEventListener('click', function () { location.reload(); });
    f.appendChild(b);
    f.setAttribute('role', 'alert');
  }

  function webglAvailable() {
    try {
      var c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (e) { return false; }
  }

  function create(cfg) {
    var KEY = 'sangi.' + cfg.id + '.v1';
    function load() {
      try {
        var raw = root.localStorage.getItem(KEY);
        var o = raw ? JSON.parse(raw) : null;
        return o && typeof o === 'object' && !Array.isArray(o) ? o : {};
      } catch (e) { return {}; }
    }
    function save() { try { root.localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }
    var store = load();
    var reducedMotion = false;
    try { reducedMotion = root.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    var disposed = false;
    var listeners = [];
    function on(target, type, fn, opt) { target.addEventListener(type, fn, opt); listeners.push([target, type, fn, opt]); }

    // ---------- DOM ----------
    var bar = el('div', 's3dk-bar');
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Ferramentas da cena');
    var qSel = el('select', 's3dk-select');
    qSel.setAttribute('aria-label', 'Qualidade gráfica');
    qSel.title = 'Qualidade gráfica';
    qSel.innerHTML = '<option value="auto">Auto</option><option value="low">Leve</option><option value="balanced">Equilibrada</option><option value="high">Alta</option>';
    var bPhoto = el('button', 's3dk-btn', '📷 <span>Foto</span>');
    bPhoto.type = 'button'; bPhoto.title = 'Fotografar (P)'; bPhoto.setAttribute('aria-label', 'Fotografar');
    var bPause = el('button', 's3dk-btn', '⏸ <span>Pausa</span>');
    bPause.type = 'button'; bPause.title = 'Pausar (Esc)'; bPause.setAttribute('aria-label', 'Pausar');
    var bHelp = el('button', 's3dk-btn', '?');
    bHelp.type = 'button'; bHelp.title = 'Tutorial'; bHelp.setAttribute('aria-label', 'Abrir tutorial');
    if (!cfg.noQuality) bar.appendChild(qSel);
    if (!cfg.noPhoto) bar.appendChild(bPhoto); bar.appendChild(bPause); bar.appendChild(bHelp);

    var goals = cfg.goals || [];
    var journal = el('aside', 's3dk-journal');
    journal.setAttribute('aria-label', 'Diário de campo');
    var jHead = el('div', 's3dk-jhead');
    var jTitle = el('h3', '', 'Diário de campo <span>0/' + goals.length + '</span>');
    var jToggle = el('button', 's3dk-toggle', '–');
    jToggle.type = 'button'; jToggle.setAttribute('aria-expanded', 'true');
    jHead.appendChild(jTitle); jHead.appendChild(jToggle);
    var jBody = el('div', 's3dk-jbody');
    var ul = el('ul');
    goals.forEach(function (g) {
      var li = el('li', '', g.label);
      li.setAttribute('data-goal', g.id);
      ul.appendChild(li);
    });
    jBody.appendChild(ul);
    var meterBar = null, meterVal = null;
    if (cfg.meter) {
      var m = el('div', 's3dk-meter', cfg.meter.label + ' <span>0%</span><div><b></b></div>');
      meterVal = m.querySelector('span'); meterBar = m.querySelector('b');
      jBody.appendChild(m);
    }
    journal.appendChild(jHead); journal.appendChild(jBody);

    var toastEl = el('div', 's3dk-toast');
    toastEl.setAttribute('role', 'status'); toastEl.setAttribute('aria-live', 'polite');
    var flash = el('div', 's3dk-flash'); flash.setAttribute('aria-hidden', 'true');

    var tut = el('div', 's3dk-overlay');
    tut.hidden = true;
    tut.setAttribute('role', 'dialog'); tut.setAttribute('aria-modal', 'true');
    tut.innerHTML = '<div class="s3dk-card"><h2></h2><p></p><div class="s3dk-dots" aria-hidden="true"></div>' +
      '<div class="s3dk-actions"><button type="button" class="s3dk-ghost">Pular</button><button type="button" class="s3dk-primary">Próximo</button></div></div>';
    var tutSteps = cfg.tutorial || [];
    tut.querySelector('h2').textContent = cfg.title || document.title;
    var tutText = tut.querySelector('p');
    var tutDots = tut.querySelector('.s3dk-dots');
    tutSteps.forEach(function () { tutDots.appendChild(el('i')); });
    var tutSkip = tut.querySelector('.s3dk-ghost');
    var tutNext = tut.querySelector('.s3dk-primary');

    var pauseOv = el('div', 's3dk-overlay');
    pauseOv.hidden = true;
    pauseOv.setAttribute('role', 'dialog'); pauseOv.setAttribute('aria-modal', 'true');
    pauseOv.innerHTML = '<div class="s3dk-card" style="text-align:center"><h2>Pausado</h2><p>A cena espera por você.</p>' +
      '<div class="s3dk-actions" style="justify-content:center"><button type="button" class="s3dk-ghost" data-a="reset">Reiniciar cena</button>' +
      '<button type="button" class="s3dk-ghost" data-a="help">Ver tutorial</button><button type="button" class="s3dk-primary" data-a="resume">Continuar</button></div></div>';

    [bar, journal, toastEl, flash, tut, pauseOv].forEach(function (n) { document.body.appendChild(n); });
    if (cfg.top) document.documentElement.style.setProperty('--s3dk-top', cfg.top);
    if (cfg.side === 'left') { bar.classList.add('s3dk-left'); journal.classList.add('s3dk-left'); }
    if (cfg.toastBottom) document.documentElement.style.setProperty('--s3dk-toast-bottom', cfg.toastBottom);

    // ---------- Toast & sound ----------
    var toastTimer = null;
    function toast(html, ms) {
      toastEl.innerHTML = html;
      toastEl.classList.add('show');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, ms || 4200);
    }
    function tick(freq) {
      var a = cfg.audio && cfg.audio();
      if (!a || !a.ctx || !a.out || a.ctx.state !== 'running') return;
      var now = a.ctx.currentTime, o = a.ctx.createOscillator(), g = a.ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq || 700, now);
      o.frequency.exponentialRampToValueAtTime((freq || 700) * 1.5, now + 0.08);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.05, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      o.connect(g); g.connect(a.out); o.start(now); o.stop(now + 0.18);
    }

    // ---------- Journal ----------
    var done = {};
    if (store.goals && typeof store.goals === 'object') goals.forEach(function (g) { done[g.id] = store.goals[g.id] === true; });
    function renderJournal() {
      var n = 0;
      goals.forEach(function (g) {
        var li = ul.querySelector('li[data-goal="' + g.id + '"]');
        if (li) li.classList.toggle('done', !!done[g.id]);
        if (done[g.id]) n++;
      });
      jTitle.querySelector('span').textContent = n + '/' + goals.length;
    }
    function goal(id, html) {
      if (done[id] || !goals.some(function (g) { return g.id === id; })) return false;
      done[id] = true; store.goals = done; save(); renderJournal();
      if (html) toast(html);
      tick(900);
      if (goals.every(function (g) { return done[g.id]; })) {
        setTimeout(function () { toast('<b>Diário completo.</b> Continue explorando no modo livre.', 5200); }, 1800);
      }
      return true;
    }
    function setCollapsed(c) {
      journal.classList.toggle('collapsed', c);
      jToggle.textContent = c ? '+' : '–';
      jToggle.setAttribute('aria-expanded', String(!c));
      jToggle.title = c ? 'Abrir diário' : 'Recolher diário';
      store.journalCollapsed = c; save();
    }
    jToggle.addEventListener('click', function () { setCollapsed(!journal.classList.contains('collapsed')); });
    setCollapsed(store.journalCollapsed === true || (store.journalCollapsed === undefined && root.innerWidth <= 600));
    renderJournal();
    function meter(v) {
      if (!meterBar) return;
      var p = Math.round(Math.max(0, Math.min(1, v)) * 100);
      meterBar.style.width = p + '%'; meterVal.textContent = p + '%';
    }

    // ---------- Tutorial ----------
    var step = 0;
    function renderTut() {
      tutText.innerHTML = tutSteps[step] || '';
      Array.prototype.forEach.call(tutDots.children, function (d, i) { d.classList.toggle('on', i === step); });
      tutNext.textContent = step === tutSteps.length - 1 ? 'Explorar' : 'Próximo';
    }
    function openTutorial() { if (!tutSteps.length) return; step = 0; renderTut(); tut.hidden = false; tutNext.focus(); }
    function closeTutorial() { tut.hidden = true; store.tutorialDone = true; save(); }
    tutNext.addEventListener('click', function () { if (step < tutSteps.length - 1) { step++; renderTut(); } else closeTutorial(); });
    tutSkip.addEventListener('click', closeTutorial);
    bHelp.addEventListener('click', openTutorial);

    // ---------- Pause arbitration ----------
    var userPaused = false, hostPaused = !!root.__SANGI_PAUSED__, tabHidden = !!document.hidden, paused = false;
    function sync() {
      var should = userPaused || hostPaused || tabHidden || disposed;
      if (should !== paused) {
        paused = should;
        try { cfg.setPaused(paused); } catch (e) {}
        if (!paused) lastT = 0;
      }
    }
    function setUserPaused(p) {
      userPaused = p; pauseOv.hidden = !p; sync();
      if (p) pauseOv.querySelector('[data-a="resume"]').focus();
    }
    bPause.addEventListener('click', function () { setUserPaused(true); });
    pauseOv.addEventListener('click', function (e) {
      var a = e.target && e.target.getAttribute && e.target.getAttribute('data-a');
      if (a === 'resume') setUserPaused(false);
      else if (a === 'reset') { if (cfg.onReset) cfg.onReset(); setUserPaused(false); }
      else if (a === 'help') { setUserPaused(false); openTutorial(); }
    });
    on(document, 'visibilitychange', function () { tabHidden = document.hidden; sync(); });
    on(root, 'sangi:pause', function () { hostPaused = true; sync(); });
    on(root, 'sangi:resume', function () { hostPaused = false; sync(); });

    // ---------- Quality ----------
    var mode = 'auto';
    var level = (root.innerWidth <= 600 || (navigator.hardwareConcurrency || 8) <= 4) ? 'balanced' : 'high';
    function applyLevel(l) { level = l; try { cfg.applyQuality && cfg.applyQuality(l); } catch (e) {} }
    function setQuality(m, persist) {
      m = String(m || 'auto').toLowerCase();
      if (m === 'medium') m = 'balanced';
      if (['auto', 'low', 'balanced', 'high'].indexOf(m) < 0) return;
      mode = m; qSel.value = m;
      if (persist) { store.quality = m; save(); }
      applyLevel(m === 'auto' ? level : m);
    }
    qSel.addEventListener('change', function () { setQuality(qSel.value, true); });
    on(root, 'sangi:quality', function (e) { if (e && e.detail && e.detail.quality) setQuality(e.detail.quality, false); });

    var times = new Float32Array(600), ti = 0, tn = 0, win = [], cool = 0, good = 0, lastT = 0;
    function frame() {
      var now = performance.now();
      if (!lastT) { lastT = now; return; }
      var ms = now - lastT; lastT = now;
      times[ti] = ms; ti = (ti + 1) % times.length; if (tn < times.length) tn++;
      if (mode !== 'auto') return;
      cool -= ms / 1000;
      win.push(ms);
      if (win.length < 90) return;
      var avg = win.reduce(function (a, b) { return a + b; }, 0) / win.length;
      win.length = 0;
      if (cool > 0) return;
      if (avg > 26 && level !== 'low') { applyLevel(level === 'high' ? 'balanced' : 'low'); cool = 4; good = 0; }
      else if (avg < 13) {
        good += 1.5;
        if (good > 9 && level !== 'high') { applyLevel(level === 'low' ? 'balanced' : 'high'); cool = 6; good = 0; }
      } else good = 0;
    }
    function stats() {
      var a = Array.prototype.slice.call(times, 0, tn).sort(function (x, y) { return x - y; });
      var at = function (p) { return a.length ? +a[Math.min(a.length - 1, Math.floor(a.length * p))].toFixed(2) : null; };
      var info = cfg.rendererInfo ? cfg.rendererInfo() : null;
      return {
        samples: a.length, p50: at(0.5), p95: at(0.95), quality: mode + ':' + level,
        drawCalls: info ? info.render.calls : null, triangles: info ? info.render.triangles : null,
        geometries: info ? info.memory.geometries : null, textures: info ? info.memory.textures : null
      };
    }

    // ---------- Photo ----------
    var lastPhoto = null;
    function photo() {
      if (disposed) return;
      var src;
      try { cfg.render(); src = cfg.canvas(); } catch (e) { toast('Não foi possível fotografar.'); return; }
      var c = document.createElement('canvas');
      c.width = src.width; c.height = src.height;
      c.getContext('2d').drawImage(src, 0, 0);
      lastPhoto = c;
      var stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      var name = (cfg.photoName || cfg.id) + '-' + stamp + '.png';
      try {
        c.toBlob(function (b) {
          if (!b) return;
          var url = URL.createObjectURL(b), a = document.createElement('a');
          a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
        }, 'image/png');
      } catch (e) { toast('Não foi possível salvar a foto neste navegador.'); return; }
      flash.classList.add('on');
      setTimeout(function () { flash.classList.remove('on'); }, 60);
      tick(1200);
      goal('photo');
      toast('<b>Foto salva</b> na pasta de downloads.');
    }
    bPhoto.addEventListener('click', photo);
    function photoMean() {
      if (!lastPhoto) return null;
      var t = document.createElement('canvas'); t.width = t.height = 32;
      var x = t.getContext('2d'); x.drawImage(lastPhoto, 0, 0, 32, 32);
      var d = x.getImageData(0, 0, 32, 32).data, s = 0;
      for (var i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2];
      return +(s / (32 * 32 * 3)).toFixed(1);
    }

    // ---------- Keyboard ----------
    on(root, 'keydown', function (e) {
      var tg = e.target && e.target.tagName;
      if (tg === 'INPUT' || tg === 'SELECT' || tg === 'TEXTAREA') return;
      if (!tut.hidden) { if (e.key === 'Escape') { closeTutorial(); e.preventDefault(); } return; }
      if (e.key === 'Escape') { setUserPaused(!userPaused); e.preventDefault(); }
      else if ((e.key === 'p' || e.key === 'P') && !userPaused && !cfg.noPhoto) { photo(); e.preventDefault(); }
    });

    // ---------- Context loss ----------
    try {
      var cv = cfg.canvas();
      if (cv) on(cv, 'webglcontextlost', function (ev) { ev.preventDefault(); fatal('O contexto gráfico foi perdido (memória da GPU). Recarregue para continuar.'); });
    } catch (e) {}

    function dispose() {
      if (disposed) return;
      disposed = true;
      listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); });
      if (toastTimer) clearTimeout(toastTimer);
      [bar, journal, toastEl, flash, tut, pauseOv].forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
    }
    on(root, 'sangi:dispose', dispose);

    // ---------- Init ----------
    if (!cfg.noQuality) setQuality(root.__SANGI_QUALITY__ || store.quality || 'auto', false);
    else { mode = 'external'; if (root.__SANGI_QUALITY__) setQuality(root.__SANGI_QUALITY__, false); }
    sync();
    if (!store.tutorialDone) setTimeout(openTutorial, 400);

    var api = {
      goal: goal, toast: toast, tick: tick, meter: meter, frame: frame, stats: stats, photo: photo,
      isPaused: function () { return paused; }, reducedMotion: reducedMotion,
      level: function () { return level; }, openTutorial: openTutorial, dispose: dispose,
      setUIHidden: function (h) { document.body.classList.toggle('s3dk-ui-hidden', !!h); }
    };
    var qa = {
      stats: stats, goals: function () { return JSON.parse(JSON.stringify(done)); },
      isPaused: api.isPaused, lastPhotoMean: photoMean
    };
    if (cfg.qa) for (var k in cfg.qa) if (Object.prototype.hasOwnProperty.call(cfg.qa, k)) qa[k] = cfg.qa[k];
    root.__S3D__ = qa;
    return api;
  }

  root.S3DKit = { create: create, fatal: fatal, webglAvailable: webglAvailable };
})(window);
