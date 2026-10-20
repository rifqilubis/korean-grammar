/* =====================================================================
   한국어 문법 — app.js
   Aplikasi tanpa framework: router hash sederhana, render materi,
   mesin kuis pilihan ganda, dan progres di localStorage.
   ===================================================================== */
(function () {
  'use strict';

  var TOPICS = window.KG_TOPICS || [];
  var STORE_KEY = 'kg-progress-v1';
  var THEME_KEY = 'kg-theme-v1';
  var LETTERS = ['A', 'B', 'C', 'D'];
  var LEVELS = { 1: 'Dasar', 2: 'Menengah', 3: 'Lanjutan' };

  var $ = function (id) { return document.getElementById(id); };
  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* ---------------------------------------------------------------- store */
  function blankStore() { return { version: 1, topics: {}, answered: 0 }; }

  function loadStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return blankStore();
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || !data.topics) return blankStore();
      return data;
    } catch (e) {
      return blankStore();
    }
  }

  function saveStore() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* mode privat */ }
  }

  var store = loadStore();

  function topicProgress(id) {
    return store.topics[id] || null;
  }

  function recordResult(id, correct, total) {
    var prev = store.topics[id];
    var bestPct = prev && typeof prev.bestPct === 'number' ? prev.bestPct : -1;
    var pct = total ? Math.round((correct / total) * 100) : 0;
    store.topics[id] = {
      bestPct: Math.max(bestPct, pct),
      bestCorrect: Math.max(prev ? (prev.bestCorrect || 0) : 0, correct),
      total: total,
      done: Math.max(prev ? (prev.done || 0) : 0, 1),
      lastAt: Date.now()
    };
    saveStore();
  }

  function countDone() {
    return TOPICS.filter(function (t) { return topicProgress(t.id); }).length;
  }

  function averageScore() {
    var total = 0;
    var n = 0;
    for (var i = 0; i < TOPICS.length; i++) {
      var p = topicProgress(TOPICS[i].id);
      if (p && typeof p.bestPct === 'number') { total += p.bestPct; n++; }
    }
    return n ? Math.round(total / n) : null;
  }

  /* ---------------------------------------------------------------- theme */
  function applyTheme(name) {
    document.documentElement.setAttribute('data-theme', name);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', name === 'light' ? '#f3f4f9' : '#0c0d16');
    try { localStorage.setItem(THEME_KEY, name); } catch (e) { /* abaikan */ }
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* abaikan */ }
    if (!saved) {
      saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    applyTheme(saved);
  }

  /* ------------------------------------------------------------------ TTS */
  var voice = null;

  function pickVoice() {
    if (!window.speechSynthesis) return;
    var list = window.speechSynthesis.getVoices() || [];
    for (var i = 0; i < list.length; i++) {
      if (/^ko([-_]|$)/i.test(list[i].lang)) { voice = list[i]; return; }
    }
  }

  function speak(text) {
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'ko-KR';
      u.rate = 0.92;
      if (voice) u.voice = voice;
      window.speechSynthesis.speak(u);
    } catch (e) { /* suara tidak tersedia */ }
  }

  var ttsAvailable = !!window.speechSynthesis;
  if (ttsAvailable) {
    pickVoice();
    if (typeof window.speechSynthesis.addEventListener === 'function') {
      window.speechSynthesis.addEventListener('voiceschanged', pickVoice);
    } else {
      window.speechSynthesis.onvoiceschanged = pickVoice;
    }
  }

  function speakButton(text) {
    var b = el('button', 'speak-btn');
    b.type = 'button';
    b.title = 'Dengarkan pelafalan';
    b.setAttribute('aria-label', 'Dengarkan pelafalan');
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.2L12 5.6v12.8L7.2 14.5H4z"></path>' +
      '<path d="M15.4 8.4a5 5 0 0 1 0 7.2M18 5.8a8.6 8.6 0 0 1 0 12.4" fill="none" stroke-linecap="round"></path></svg>';
    b.addEventListener('click', function (ev) {
      ev.stopPropagation();
      speak(text);
    });
    return b;
  }

  /* ------------------------------------------------------------------ DOM helpers */
  /* Ambil bagian yang perlu dibacakan mesin suara.
     Contoh "먹다 → 먹어요" cukup dibaca "먹어요", dan keterangan
     dalam tanda kurung dibuang supaya tidak ikut dilafalkan. */
  function speakText(ko) {
    var text = String(ko).replace(/\s*\([^)]*\)\s*$/, '').trim();
    var arrow = text.split('\u2192');
    if (arrow.length > 1) text = arrow[arrow.length - 1].trim();
    return text || String(ko).trim();
  }

  function exampleCard(ex) {
    var card = el('div', 'example');
    var top = el('div', 'example-ko');
    var left = el('div');
    left.appendChild(el('span', null, ex.ko));
    top.appendChild(left);
    if (ttsAvailable) top.appendChild(speakButton(speakText(ex.ko)));
    card.appendChild(top);
    if (ex.rom) card.appendChild(el('div', 'example-rom', ex.rom));
    if (ex.id) card.appendChild(el('div', 'example-id', ex.id));
    if (ex.why) card.appendChild(el('div', 'example-why', ex.why));
    return card;
  }

  function renderBlock(block) {
    switch (block.type) {
      case 'heading':
        return el('h3', 'block-heading', block.text);
      case 'text':
        return el('p', 'block-text', block.text);
      case 'formula': {
        var f = el('div', 'formula');
        block.parts.forEach(function (part, i) {
          if (i) f.appendChild(el('span', 'formula-plus', '+'));
          f.appendChild(el('span', 'formula-part', part));
        });
        return f;
      }
      case 'rules': {
        var wrap = el('div', 'rules');
        block.items.forEach(function (row) {
          var r = el('div', 'rule-row');
          r.appendChild(el('div', 'rule-a', row.a));
          r.appendChild(el('div', 'rule-b', row.b || ''));
          r.appendChild(el('div', 'rule-c', row.c || ''));
          wrap.appendChild(r);
        });
        return wrap;
      }
      case 'examples': {
        var box = el('div', 'examples');
        block.items.forEach(function (ex) { box.appendChild(exampleCard(ex)); });
        return box;
      }
      case 'note':
        return el('p', 'block-note', block.text);
      default:
        return null;
    }
  }

  /* ------------------------------------------------------------------ screens */
  var screens = ['screen-home', 'screen-lesson', 'screen-lat', 'screen-quiz', 'screen-result'];

  function show(name) {
    screens.forEach(function (id) {
      var node = $(id);
      if (node) node.hidden = (id !== name);
    });
  }

  /* ------------------------------------------------------------------ HOME */
  var keepScreen = null;

  function renderHome() {
    var list = $('topicList');
    list.innerHTML = '';

    TOPICS.forEach(function (t) {
      var prog = topicProgress(t.id);
      var a = el('a', 'topic-card' + (prog ? ' is-done' : ''));
      a.href = '#/topik/' + t.id;

      var icon = el('span', 'topic-icon', t.icon);
      var main = el('div', 'topic-main');
      main.appendChild(el('div', 'topic-name', t.no + '. ' + t.title));
      main.appendChild(el('div', 'topic-title-id', t.titleId));

      var side = el('div', 'topic-side');
      if (prog) {
        side.appendChild(el('span', 'badge badge--score', prog.bestPct + '%'));
      } else {
        side.appendChild(el('span', 'badge', LEVELS[t.level] || 'Dasar'));
      }

      a.appendChild(icon);
      a.appendChild(main);
      a.appendChild(side);
      list.appendChild(a);
    });

    $('statTopicsDone').textContent = countDone() + '/' + TOPICS.length;
    var avg = averageScore();
    $('statQuizScore').textContent = avg == null ? '\u2013' : avg + '%';
    $('statStreak').textContent = String(store.answered || 0);

    var resume = $('resumeBtn');
    var next = TOPICS.filter(function (t) { return !topicProgress(t.id); })[0] || TOPICS[0];
    resume.textContent = countDone() === TOPICS.length
      ? 'Ulangi dari topik 1'
      : 'Lanjut topik ' + next.no + ': ' + next.titleId;

    $('resetBtn').hidden = !Object.keys(store.topics).length && !store.answered;

    // Kembali ke layar yang sedang aktif? Jangan paksa pindah layar.
    if (keepScreen) show(keepScreen);
    else show('screen-home');
    document.title = '\uD55C\uAD6D\uC5B4 \uBB38\uBC95 \u2014 Belajar Grammar Korea untuk Pemula';
  }

  /* ------------------------------------------------------------------ LESSON */
  var currentTopic = null;
  var comingFrom = 'home';

  function findTopic(id) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].id === id) return TOPICS[i];
    return null;
  }

  function renderLesson(topic) {
    currentTopic = topic;
    comingFrom = 'lesson';

    $('lessonIcon').textContent = topic.icon;
    $('lessonMeta').textContent = 'Topik ' + topic.no + ' \u00b7 ' + (LEVELS[topic.level] || 'Dasar');
    $('lessonTitle').textContent = topic.title;
    $('lessonTitleId').textContent = topic.titleId;
    $('lessonIntro').textContent = topic.intro;

    var body = $('lessonBody');
    body.innerHTML = '';
    topic.blocks.forEach(function (b) {
      var node = renderBlock(b);
      if (node) body.appendChild(node);
    });

    var latBtn = $('lessonLatBtn');
    latBtn.hidden = !(topic.lat && topic.lat.length);
    $('lessonQuizBtn').textContent = 'Kuis topik ini (' + topic.quiz.length + ' soal)';

    var idx = TOPICS.indexOf(topic);
    var prev = TOPICS[idx - 1];
    var next = TOPICS[idx + 1];
    var prevBtn = $('prevTopicBtn');
    var nextBtn = $('nextTopicBtn');
    prevBtn.hidden = !prev;
    nextBtn.hidden = !next;
    if (prev) { prevBtn.href = '#/topik/' + prev.id; prevBtn.textContent = '\u2039 ' + prev.title; }
    if (next) { nextBtn.href = '#/topik/' + next.id; nextBtn.textContent = next.title + ' \u203A'; }

    window.scrollTo(0, 0);
    show('screen-lesson');
    document.title = topic.title + ' \u2014 \uD55C\uAD6D\uC5B4 \uBB38\uBC95';
  }

  /* ------------------------------------------------------------------ LATIHAN */
  function normalize(str) {
    return String(str)
      .replace(/\s+/g, ' ')
      .replace(/[\u3000]/g, ' ')
      .replace(/[.!?\u3002\uFF01\uFF1F]+$/g, '')
      .trim().toLowerCase();
  }

  function renderLat(topic) {
    $('latBack').href = '#/topik/' + topic.id;
    $('latBack').textContent = '\u2039 Kembali ke ' + topic.titleId;

    var list = $('latList');
    list.innerHTML = '';
    $('latStatus').textContent = '';

    topic.lat.forEach(function (item) {
      var wrap = el('div', 'lat-item');
      var hint = el('div', 'lat-id');
      hint.appendChild(document.createTextNode('Artinya: '));
      hint.appendChild(el('b', null, item.id));
      wrap.appendChild(hint);

      var input = el('input', 'lat-input');
      input.type = 'text';
      input.lang = 'ko';
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.placeholder = 'Tulis kalimat Korea\u2026';
      input.setAttribute('aria-label', 'Kalimat Korea');

      var out = el('div', 'lat-result');

      function check() {
        var ok = normalize(input.value) === normalize(item.ko);
        wrap.classList.toggle('is-ok', !!input.value && ok);
        wrap.classList.toggle('is-bad', !!input.value && !ok);
        out.className = 'lat-result' + (ok ? ' ok' : input.value ? ' bad' : '');
        out.textContent = ok ? 'Tepat!' : '';
      }

      input.addEventListener('input', check);
      wrap.appendChild(input);
      wrap.appendChild(out);
      list.appendChild(wrap);
    });

    window.scrollTo(0, 0);
    show('screen-lat');
  }

  /* ------------------------------------------------------------------ QUIZ */
  var quiz = null;

  var quizEls = {
    topic: null, count: null, question: null, options: null, explain: null,
    feedback: null, next: null, score: null, fill: null, bar: null
  };

  function startQuiz(topic) {
    var startFrom = comingFrom;
    quiz = {
      topic: topic,
      from: startFrom === 'lesson' ? 'lesson' : 'home',
      items: topic.quiz.map(function (q, i) { return { q: q, i: i }; }),
      index: 0,
      correct: 0,
      answered: false,
      picked: -1,
      wrong: [],
      startedAt: Date.now()
    };
    $('quizTopic').textContent = 'Topik ' + topic.no + ' \u00b7 ' + topic.titleId;
    $('scorePill').textContent = 'Benar 0';
    document.title = 'Kuis \u00b7 ' + topic.titleId;
    keepScreen = null;
    window.scrollTo(0, 0);
    show('screen-quiz');
    paintQuestion();
  }

  function currentItem() { return quiz.items[quiz.index]; }

  function paintQuestion() {
    var item = currentItem();
    var q = item.q;
    var n = quiz.items.length;

    $('quizCount').textContent = 'Soal ' + (quiz.index + 1) + ' dari ' + n;
    $('quizQuestion').textContent = q.q;

    var pct = Math.round((quiz.index / n) * 100);
    $('progressFill').style.width = pct + '%';
    $('progressBar').setAttribute('aria-valuenow', String(pct));

    var box = $('options');
    box.innerHTML = '';
    q.options.forEach(function (text, i) {
      var b = el('button', 'option');
      b.type = 'button';
      b.dataset.index = String(i);
      var letter = el('span', 'option-letter', LETTERS[i]);
      b.appendChild(letter);
      b.appendChild(el('span', null, text));
      b.addEventListener('click', function () { pick(i); });
      box.appendChild(b);
    });

    $('explain').hidden = true;
    $('explain').textContent = '';
    $('feedback').textContent = '';
    $('feedback').className = 'feedback';
    $('nextBtn').hidden = true;
    quiz.answered = false;
    quiz.picked = -1;
  }

  function pick(i) {
    if (!quiz || quiz.answered) return;
    var item = currentItem();
    var q = item.q;
    quiz.answered = true;
    quiz.picked = i;
    var ok = i === q.answer;

    var buttons = $('options').children;
    for (var k = 0; k < buttons.length; k++) {
      buttons[k].disabled = true;
      if (k === q.answer) buttons[k].classList.add('is-correct');
      else if (k === i) buttons[k].classList.add('is-wrong');
      else buttons[k].classList.add('is-dim');
    }

    store.answered = (store.answered || 0) + 1;

    if (ok) {
      quiz.correct++;
      $('feedback').textContent = '\uC798\uD588\uC5B4\uC694! Benar.';
      $('feedback').className = 'feedback ok';
      $('scorePill').textContent = 'Benar ' + quiz.correct;
    } else {
      $('feedback').textContent = 'Belum tepat. Jawaban benar: ' + q.options[q.answer];
      $('feedback').className = 'feedback bad';
      quiz.wrong.push({
        q: q.q,
        picked: q.options[i],
        right: q.options[q.answer],
        why: q.why || ''
      });
    }

    var ex = $('explain');
    if (q.why) {
      ex.textContent = q.why;
      ex.hidden = false;
    }

    var last = quiz.index === quiz.items.length - 1;
    var btn = $('nextBtn');
    btn.textContent = last ? 'Lihat hasil' : 'Lanjut';
    btn.hidden = false;
    btn.focus();
  }

  function nextQuestion() {
    if (!quiz || !quiz.answered) return;
    if (quiz.index < quiz.items.length - 1) {
      quiz.index++;
      paintQuestion();
      window.scrollTo(0, 0);
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    var total = quiz.items.length;
    var correct = quiz.correct;
    var pct = total ? Math.round((correct / total) * 100) : 0;
    var seconds = Math.max(1, Math.round((Date.now() - quiz.startedAt) / 1000));

    recordResult(quiz.topic.id, correct, total);

    $('resultPercent').textContent = pct + '%';
    $('resultFraction').textContent = correct + ' / ' + total;

    var ring = $('ringFill');
    var C = 2 * Math.PI * 52;
    ring.style.strokeDasharray = C.toFixed(1);
    ring.style.strokeDashoffset = String(C);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        ring.style.strokeDashoffset = (C * (1 - pct / 100)).toFixed(1);
      });
    });
    ring.style.stroke = pct >= 80 ? 'var(--ok)' : pct >= 50 ? 'var(--accent)' : 'var(--bad)';

    var head, msg;
    if (pct === 100) { head = 'Sempurna!'; msg = 'Semua jawaban tepat. Topik ini sudah dikuasai.'; }
    else if (pct >= 80) { head = 'Bagus sekali!'; msg = 'Tinggal sedikit lagi. Baca ulang bagian yang salah, lalu coba lagi.'; }
    else if (pct >= 50) { head = 'Sudah lumayan'; msg = 'Beberapa pola belum melekat. Buka materinya sebentar, lalu ulangi kuisnya.'; }
    else { head = 'Ayo coba lagi'; msg = 'Tidak apa-apa, ini topik baru. Baca materinya dulu, lalu kerjakan kuis sekali lagi.'; }
    $('resultHeadline').textContent = head;
    $('resultMsg').textContent = msg;

    $('statCorrect').textContent = String(correct);
    $('statWrong').textContent = String(total - correct);
    $('statTime').textContent = Math.floor(seconds / 60) + ':' + ('0' + (seconds % 60)).slice(-2);

    var review = $('reviewCard');
    var list = $('reviewList');
    list.innerHTML = '';
    quiz.wrong.forEach(function (w) {
      var li = el('li', 'review-item');
      li.appendChild(el('div', 'review-q', w.q));
      var a = el('div', 'review-line');
      a.appendChild(document.createTextNode('Jawabanmu: '));
      a.appendChild(el('span', 'wrong', w.picked));
      li.appendChild(a);
      var b = el('div', 'review-line');
      b.appendChild(document.createTextNode('Yang benar: '));
      b.appendChild(el('span', 'right', w.right));
      li.appendChild(b);
      if (w.why) li.appendChild(el('div', 'review-why', w.why));
      list.appendChild(li);
    });
    review.hidden = !quiz.wrong.length;

    var idx = TOPICS.indexOf(quiz.topic);
    var nextTopic = TOPICS[idx + 1];
    $('nextQuizTopicBtn').hidden = !nextTopic;

    window.scrollTo(0, 0);
    show('screen-result');
    document.title = 'Hasil \u00b7 ' + quiz.topic.titleId;
  }

  /* ------------------------------------------------------------------ ROUTER */
  /* Berpindah layar lewat hash. Bila hash-nya kebetulan sama dengan yang
     sekarang (misalnya keluar kuis menuju materi yang sedang dibuka),
     browser tidak memicu hashchange, jadi layar harus digambar ulang manual. */
  function goTo(hash) {
    if (location.hash === hash) route();
    else location.hash = hash;
  }

  function route() {
    var hash = (location.hash || '#/').replace(/^#/, '');
    var parts = hash.split('/').filter(Boolean);

    if (parts[0] === 'topik' && parts[1]) {
      var t = findTopic(parts[1]);
      if (t) { renderLesson(t); return; }
    }
    if (parts[0] === 'lat' && parts[1]) {
      var l = findTopic(parts[1]);
      if (l && l.lat && l.lat.length) { renderLat(l); return; }
    }
    renderHome();
  }
  /* ------------------------------------------------------------------ EVENTS */
  function bind() {
    $('themeBtn').addEventListener('click', function () {
      var now = document.documentElement.getAttribute('data-theme');
      applyTheme(now === 'dark' ? 'light' : 'dark');
    });

    $('resumeBtn').addEventListener('click', function () {
      var next = TOPICS.filter(function (t) { return !topicProgress(t.id); })[0] || TOPICS[0];
      location.hash = '#/topik/' + next.id;
    });

    $('resetBtn').addEventListener('click', function () {
      if (!window.confirm('Hapus semua progres belajar di perangkat ini?')) return;
      store = blankStore();
      saveStore();
      keepScreen = null;
      renderHome();
    });

    $('lessonQuizBtn').addEventListener('click', function () {
      if (currentTopic) startQuiz(currentTopic);
    });

    $('lessonLatBtn').addEventListener('click', function () {
      if (currentTopic) location.hash = '#/lat/' + currentTopic.id;
    });

    $('latRevealBtn').addEventListener('click', function () {
      if (!currentTopic || !currentTopic.lat) return;
      var items = $('latList').children;
      var okCount = 0;
      for (var i = 0; i < items.length; i++) {
        var data = currentTopic.lat[i];
        var input = items[i].querySelector('.lat-input');
        var result = items[i].querySelector('.lat-result');
        var ok = normalize(input.value) === normalize(data.ko);
        if (ok) { okCount++; continue; }
        items[i].classList.add('is-bad');
        result.className = 'lat-result bad';
        result.textContent = 'Jawaban: ' + data.ko + (data.rom ? ' (' + data.rom + ')' : '');
      }
      $('latStatus').textContent = okCount + ' dari ' + items.length + ' tepat.';
    });

    $('latResetBtn').addEventListener('click', function () {
      if (currentTopic) renderLat(currentTopic);
    });

    $('quizCloseBtn').addEventListener('click', function () {
      quiz = null;
      keepScreen = null;
      goTo('#/');
    });

    $('nextBtn').addEventListener('click', nextQuestion);

    $('retryBtn').addEventListener('click', function () {
      if (quiz) startQuiz(quiz.topic);
    });

    $('backLessonBtn').addEventListener('click', function () {
      if (quiz) goTo('#/topik/' + quiz.topic.id);
    });

    $('nextQuizTopicBtn').addEventListener('click', function () {
      if (!quiz) return;
      var idx = TOPICS.indexOf(quiz.topic);
      var next = TOPICS[idx + 1];
      if (next) goTo('#/topik/' + next.id);
    });

    document.addEventListener('keydown', function (ev) {
      if ($('screen-quiz').hidden || !quiz) {
        if (ev.key === 'Enter' && !$('screen-result').hidden) {
          var again = $('retryBtn');
          if (again && document.activeElement === again) { again.click(); }
        }
        return;
      }
      var k = ev.key;
      if (/^[1-4]$/.test(k) && !quiz.answered) { pick(parseInt(k, 10) - 1); return; }
      if (/^[a-dA-D]$/.test(k) && !quiz.answered) { pick(k.toUpperCase().charCodeAt(0) - 65); return; }
      if ((k === 'Enter' || k === ' ') && quiz.answered) {
        ev.preventDefault();
        nextQuestion();
      }
    });

    window.addEventListener('hashchange', route);

    window.addEventListener('storage', function (ev) {
      if (ev.key === STORE_KEY) {
        store = loadStore();
        if (!$('screen-home').hidden) renderHome();
      }
    });
  }

  /* ------------------------------------------------------------------ BOOT */
  function boot() {
    initTheme();
    bind();
    route();
    registerSW();
    if (!TOPICS.length) {
      $('topicList').textContent = 'Data materi tidak ditemukan. Pastikan js/data.js ada.';
    }
  }

  window.KG_APP = { store: function () { return store; }, route: route, startQuiz: startQuiz };

  /* Service worker hanya aktif lewat http(s). Saat dibuka dari file://
     aplikasi tetap berjalan penuh, hanya tanpa cache offline. */
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
    navigator.serviceWorker.register('sw.js').catch(function () { /* diabaikan */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
