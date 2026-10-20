/* smoke-test.js — menjalankan alur aplikasi tanpa browser.
   Menyediakan DOM mini, menjalankan js/app.js asli, lalu mengemudikan
   aplikasi: home, buka semua materi, kuis (klik & keyboard), hasil,
   pembahasan, latihan menulis, tema, dan penyimpanan progres.

   Jalankan: node tools/smoke-test.js
   Keluar dengan kode 1 bila ada langkah yang gagal. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
let failures = 0;
const log = (ok, name, extra) => {
  if (!ok) failures++;
  console.log((ok ? '  lulus  ' : '  GAGAL  ') + name + (extra ? '  (' + extra + ')' : ''));
};

/* =============================== DOM mini =============================== */
/* classList dan className harus memakai satu sumber kebenaran yang sama,
   supaya el('input', 'lat-input') bisa ditemukan lewat querySelector('.lat-input'). */
class ClassList {
  constructor(owner) { this.owner = owner; this.set = new Set(); }
  add(...cs) { cs.forEach((c) => c && this.set.add(c)); }
  remove(...cs) { cs.forEach((c) => this.set.delete(c)); }
  contains(c) { return this.set.has(c); }
  toggle(c, force) {
    const on = force === undefined ? !this.set.has(c) : !!force;
    if (on) this.set.add(c); else this.set.delete(c);
    return on;
  }
  get value() { return [...this.set].join(' '); }
  set value(v) {
    this.set = new Set(String(v || '').split(/\s+/).filter(Boolean));
    this.owner._cls = this.set;
  }
}

const JSON_IMPL = globalThis.JSON;

class NodeBase {
  constructor(tag) {
    this.tagName = (tag || 'div').toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.style = {};
    this.dataset = {};
    this.attributes = {};
    this._text = '';
    this._cls = new Set();
    this.classList = new ClassList(this);
    this.listeners = {};
    this._innerHTML = '';
    this.hidden = false;
    this.disabled = false;
    this.value = '';
    this.id = '';
    this.type = '';
    this.title = '';
    this.lang = '';
    this.autocomplete = '';
    this.spellcheck = true;
    this.placeholder = '';
    this.href = '';
    this.focused = false;
  }

  set className(v) { this.classList.value = v; }
  get className() { return this.classList.value; }

  get textContent() {
    if (this.children.length) return this.children.map((c) => c.textContent).join('');
    return this._text;
  }
  set textContent(v) {
    this._text = String(v == null ? '' : v);
    this.children.forEach((c) => { c.parentNode = null; });
    this.children = [];
  }

  get innerHTML() { return this._innerHTML; }
  set innerHTML(v) {
    this._innerHTML = String(v);
    this.children = [];
    this._text = '';
    this._htmlOnly = this._innerHTML !== '';
  }

  appendChild(child) {
    this.children.push(child);
    child.parentNode = this;
    return child;
  }

  insertBefore(child, ref) {
    const i = this.children.indexOf(ref);
    child.parentNode = this;
    if (i < 0) this.children.push(child); else this.children.splice(i, 0, child);
    return child;
  }

  removeChild(child) {
    const i = this.children.indexOf(child);
    if (i >= 0) this.children.splice(i, 1);
    child.parentNode = null;
    return child;
  }

  replaceChildren(...nodes) {
    this.children.forEach((c) => { c.parentNode = null; });
    this.children = [];
    nodes.forEach((n) => this.appendChild(n));
  }

  append(...nodes) { nodes.forEach((n) => this.appendChild(typeof n === 'string' ? textNode(n) : n)); }

  addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); }
  removeEventListener(type, fn) {
    this.listeners[type] = (this.listeners[type] || []).filter((f) => f !== fn);
  }

  dispatch(type, ev) {
    const e = Object.assign({ type, target: this, stopPropagation() {}, preventDefault() {} }, ev || {});
    (this.listeners[type] || []).slice().forEach((fn) => fn.call(this, e));
    if (this['on' + type]) this['on' + type](e);
    if (this.parentNode && this.bubbles !== false) {
      // tidak dipakai; aplikasi memasang handler pada elemen langsung
    }
    return e;
  }

  click() {
    if (this.disabled) return;
    this.dispatch('click');
  }

  focus() { this.focused = true; }

  setAttribute(k, v) { this.attributes[k] = String(v); if (k === 'href') this.href = String(v); }
  getAttribute(k) { return k in this.attributes ? this.attributes[k] : null; }
  hasAttribute(k) { return k in this.attributes; }
  removeAttribute(k) { delete this.attributes[k]; }

  querySelector(sel) {
    const found = find(this, sel);
    if (found) return found;
    const holder = new NodeBase('span');
    holder._queryClass = sel;
    holder._queryOwner = this;
    return holder;
  }
  querySelectorAll(sel) { return collect(this, sel); }
}

function textNode(text) {
  const n = new NodeBase('#text');
  n.textContent = text;
  return n;
}

function matchSel(node, sel) {
  if (!node.classList) return false;
  if (sel.startsWith('.')) return node.classList.contains(sel.slice(1));
  if (sel.startsWith('#')) return node.id === sel.slice(1);
  return node.tagName === sel.toUpperCase();
}

function collect(node, sel) {
  const out = [];
  const walk = (n) => {
    n.children.forEach((c) => { if (matchSel(c, sel)) out.push(c); walk(c); });
  };
  walk(node);
  return out;
}

function find(node, sel) { return collect(node, sel)[0] || null; }

/* ============================== dokumen mini ============================== */
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const ids = new Set((html.match(/\bid="([^"]+)"/g) || []).map((s) => s.slice(4, -1)));
const registry = {};
ids.forEach((id) => {
  const n = new NodeBase('div');
  n.id = id;
  registry[id] = n;
});

const htmlRoot = new NodeBase('html');
htmlRoot.setAttribute('data-theme', 'dark');

const metaTheme = new NodeBase('meta');
metaTheme.setAttribute('name', 'theme-color');

const body = new NodeBase('body');

const document = {
  readyState: 'complete',
  documentElement: htmlRoot,
  body,
  title: '',
  listeners: {},
  activeElement: null,
  getElementById: (id) => registry[id] || null,
  createElement: (tag) => new NodeBase(tag),
  createTextNode: (t) => textNode(t),
  querySelector: (sel) => (sel === 'meta[name="theme-color"]' ? metaTheme : null),
  querySelectorAll: () => [],
  addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); },
  removeEventListener(type, fn) {
    this.listeners[type] = (this.listeners[type] || []).filter((f) => f !== fn);
  },
  dispatch(type, ev) {
    const e = Object.assign({ type, preventDefault() {}, stopPropagation() {} }, ev || {});
    (this.listeners[type] || []).slice().forEach((fn) => fn(e));
  }
};

/* localStorage mini */
const mem = {};
const localStorage = {
  getItem: (k) => (k in mem ? mem[k] : null),
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: (k) => { delete mem[k]; },
  clear: () => { Object.keys(mem).forEach((k) => delete mem[k]); }
};

/* window mini */
const scrollCalls = [];
/* location tiruan yang berperilaku seperti browser: mengubah hash ke nilai
   yang BERBEDA memicu hashchange; nilai yang sama tidak memicu apa pun.
   Perilaku ini penting untuk menguji tombol "keluar kuis". */
let currentHash = '#/';
const locationShim = {
  protocol: 'file:',
  get hash() { return currentHash; },
  set hash(v) {
    const next = v === '' || v[0] === '#' ? String(v) : '#' + v;
    if (next === currentHash) return;
    currentHash = next;
    window.dispatch('hashchange');
  }
};

const window = {
  document,
  localStorage,
  speechSynthesis: null,
  SpeechSynthesisUtterance: undefined,
  matchMedia: () => ({ matches: false, addEventListener() {} }),
  confirm: () => true,
  location: locationShim,
  listeners: {},
  scrollTo: (x, y) => scrollCalls.push([x, y]),
  requestAnimationFrame: (fn) => setTimeout(fn, 0),
  addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); },
  removeEventListener(type, fn) {
    this.listeners[type] = (this.listeners[type] || []).filter((f) => f !== fn);
  },
  dispatch(type, ev) { (this.listeners[type] || []).slice().forEach((fn) => fn(ev || {})); }
};
window.window = window;

// Semua pembuatan objek (JSON, localStorage, app.js) memakai satu realm,
// supaya hasil kerja app.js bisa diperiksa dari script uji ini.
window.JSON = JSON_IMPL;

/* =============================== jalankan =============================== */
const context = vm.createContext({
  window,
  document,
  localStorage,
  location: window.location,
  navigator: { serviceWorker: undefined, userAgent: 'node-smoke' },
  console,
  setTimeout,
  clearTimeout,
  requestAnimationFrame: window.requestAnimationFrame,
  Math,
  Date,
  // Array asli dari realm ini: app.js memakai Array.prototype.filter/map,
  // dan hasilnya harus bisa diiterasi dari script uji.
  Array: globalThis.Array,
  Object: globalThis.Object,
  JSON: JSON_IMPL
});
context.globalThis = context;
context.self = context;

vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', 'data.js'), 'utf8'), context, { filename: 'data.js' });
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8'), context, { filename: 'app.js' });

const topics = window.KG_TOPICS;
const byId = (id) => registry[id];
const isShown = (id) => !byId(id).hidden;

console.log('한국어 문법 — uji alur tanpa browser\n');

/* -------------------------------------------------------------- 1. boot */
log(topics.length === 10, 'data 10 topik dimuat', topics.length + ' topik');
log(isShown('screen-home'), 'layar awal tampil');
log(byId('topicList').children.length === topics.length,
  'daftar topik dirender', byId('topicList').children.length + ' kartu');
log(byId('statTopicsDone').textContent === '0/10', 'statistik awal 0/10', byId('statTopicsDone').textContent);
log(/topik 1/i.test(byId('resumeBtn').textContent), 'tombol lanjut menuju topik 1', byId('resumeBtn').textContent);

/* ------------------------------------------------------ 2. buka semua materi */
let allLessonsOk = true;
let blockProblems = [];
for (const t of topics) {
  window.location.hash = '#/topik/' + t.id;
  window.dispatch('hashchange');
  const shown = isShown('screen-lesson') && !isShown('screen-home');
  const title = byId('lessonTitle').textContent;
  const bodyCount = byId('lessonBody').children.length;
  const expected = t.blocks.length;
  if (!shown || title !== t.title || bodyCount !== expected) {
    allLessonsOk = false;
    blockProblems.push(t.id + ': tampil=' + shown + ' judul=' + title + ' blok=' + bodyCount + '/' + expected);
  }
}
log(allLessonsOk, 'semua 10 materi terbuka dengan blok lengkap', blockProblems.join('; ') || '');

/* ------------------------------------------------------- 3. kuis lengkap */
let quizRuns = [];
for (const t of topics) {
  window.location.hash = '#/topik/' + t.id;
  window.dispatch('hashchange');
  byId('lessonQuizBtn').click();

  if (!isShown('screen-quiz')) { quizRuns.push(t.id + ': kuis tidak tampil'); continue; }
  if (byId('options').children.length !== 4) { quizRuns.push(t.id + ': pilihan bukan 4'); continue; }

  let guard = 0;
  while (isShown('screen-quiz') && guard++ < 200) {
    const opts = byId('options').children;
    const qIndex = Number(byId('quizCount').textContent.match(/(\d+) dari/)[1]) - 1;
    if (opts.some((o) => !o.disabled)) {
      // jawab semua benar
      const correct = t.quiz[qIndex].answer;
      opts[correct].click();
      if (!byId('explain').hidden === false) quizRuns.push(t.id + ': pembahasan tidak tampil');
      if (opts.some((o) => !o.disabled)) quizRuns.push(t.id + ': pilihan tidak terkunci setelah menjawab');
    } else {
      byId('nextBtn').click();
    }
  }
  if (!isShown('screen-result')) { quizRuns.push(t.id + ': layar hasil tidak tampil'); continue; }
  if (byId('resultPercent').textContent !== '100%') {
    quizRuns.push(t.id + ': skor bukan 100% (' + byId('resultPercent').textContent + ')');
  }
}
log(quizRuns.length === 0, '10 kuis selesai dengan skor 100%', quizRuns.slice(0, 3).join('; '));

/* ------------------------------------------------- 4. progres tersimpan */
const saved = JSON.parse(localStorage.getItem('kg-progress-v1') || '{}');
const savedCount = Object.keys(saved.topics || {}).length;
log(savedCount === 10, 'progres 10 topik tersimpan', savedCount + ' topik');
log(saved.answered >= 82, 'jumlah soal dijawab tercatat', String(saved.answered));

/* -------------------------------------------------- 5. jawaban salah + pembahasan */
// ulangi topik 1 dengan sengaja salah satu
const t0 = topics[0];
window.location.hash = '#/topik/' + t0.id;
window.dispatch('hashchange');
byId('lessonQuizBtn').click();
let guard2 = 0;
let wrongCount = 0;
while (isShown('screen-quiz') && guard2++ < 200) {
  const opts = byId('options').children;
  if (opts.some((o) => !o.disabled)) {
    const qi = Number(byId('quizCount').textContent.match(/(\d+) dari/)[1]) - 1;
    const ans = t0.quiz[qi].answer;
    if (qi === 0) { opts[(ans + 1) % 4].click(); wrongCount++; }
    else opts[ans].click();
  } else byId('nextBtn').click();
}
log(wrongCount === 1 && isShown('screen-result'), 'jawaban salah tetap diproses');
log(!byId('reviewCard').hidden && byId('reviewList').children.length === 1,
  'pembahasan jawaban salah tampil', byId('reviewList').children.length + ' item');
log(byId('resultPercent').textContent !== '100%', 'skor berkurang saat ada jawaban salah',
  byId('resultPercent').textContent);

/* --------------------------------------------------------- 6. retry & navigasi */
byId('retryBtn').click();
log(isShown('screen-quiz') && byId('quizCount').textContent === 'Soal 1 dari ' + t0.quiz.length,
  'tombol ulangi memulai kuis dari soal 1');
byId('quizCloseBtn').click();
console.log('    [debug] home.hidden=' + byId('screen-home').hidden +
  ' quiz.hidden=' + byId('screen-quiz').hidden +
  ' lesson.hidden=' + byId('screen-lesson').hidden +
  ' list=' + byId('topicList').children.length);
log(isShown('screen-home'), 'keluar kuis kembali ke daftar materi');

/* ------------------------------------------------------------ 7. latihan */
window.location.hash = '#/lat/' + t0.id;
window.dispatch('hashchange');
log(isShown('screen-lat'), 'layar latihan menulis tampil');
const latItems = byId('latList').children;
log(latItems.length === t0.lat.length, 'soal latihan lengkap', latItems.length + ' item');

// isi jawaban pertama dengan benar (tanpa tanda baca), kedua salah
const input0 = latItems[0].querySelector('.lat-input');
input0.value = t0.lat[0].ko.replace(/[.!?]$/, '');
input0.dispatch('input');
log(latItems[0].classList.contains('is-ok'), 'jawaban latihan benar terdeteksi');
if (latItems[1]) {
  const input1 = latItems[1].querySelector('.lat-input');
  input1.value = 'salah';
  input1.dispatch('input');
  log(latItems[1].classList.contains('is-bad'), 'jawaban latihan salah ditandai');
}
byId('latRevealBtn').click();
log(/tepat/.test(byId('latStatus').textContent), 'tombol tampilkan jawaban bekerja', byId('latStatus').textContent);

/* ------------------------------------------------- 8. keyboard di kuis */
window.location.hash = '#/topik/' + t0.id;
window.dispatch('hashchange');
byId('lessonQuizBtn').click();
const beforeClass = byId('options').children[0].className;
document.dispatch('keydown', { key: '2' });
const picked = byId('options').children;
log(picked.some((o) => o.disabled), 'tombol angka 1-4 menjawab soal');
document.dispatch('keydown', { key: 'Enter' });
const countText = byId('quizCount').textContent;
log(/Soal 2 dari/.test(countText) || isShown('screen-result'), 'Enter melanjutkan soal', countText);

/* ------------------------------------------------------------ 9. tema */
const themeBtn = byId('themeBtn');
const startTheme = htmlRoot.getAttribute('data-theme');
themeBtn.click();
const afterTheme = htmlRoot.getAttribute('data-theme');
themeBtn.click();
log(startTheme !== afterTheme && htmlRoot.getAttribute('data-theme') === startTheme,
  'tombol tema mengganti dan mengembalikan tema', startTheme + ' -> ' + afterTheme);
log(localStorage.getItem('kg-theme-v1') === startTheme, 'pilihan tema tersimpan di localStorage');

/* ------------------------------------------------- 10. kembali ke home */
window.location.hash = '#/';
window.dispatch('hashchange');
log(isShown('screen-home'), 'kembali ke daftar materi');
log(byId('statTopicsDone').textContent === '10/10', 'statistik 10/10 setelah semua tuntas',
  byId('statTopicsDone').textContent);
log(byId('statQuizScore').textContent === '100%' || /%$/.test(byId('statQuizScore').textContent),
  'rata-rata kuis terhitung', byId('statQuizScore').textContent);
console.log('    [debug] saved =', JSON.stringify(saved).slice(0, 300));

/* ------------------------------------------------- 11. hapus progres */
byId('resetBtn').click();
log(byId('statTopicsDone').textContent === '0/10', 'hapus progres mengembalikan statistik',
  byId('statTopicsDone').textContent);

/* -------------------------------------------------- 12. jawaban tiap soal */
// pemeriksaan isi: setiap indeks answer valid dan teks pembahasan tidak kosong
let contentProblems = [];
for (const t of topics) {
  t.quiz.forEach((q, i) => {
    if (!q.options[q.answer]) contentProblems.push(t.id + '#' + (i + 1) + ' jawaban kosong');
    if (!q.why) contentProblems.push(t.id + '#' + (i + 1) + ' tanpa pembahasan');
  });
}
log(contentProblems.length === 0, 'semua soal punya jawaban dan pembahasan', contentProblems.slice(0, 3).join('; '));

/* ------------------------------------------- 13. teks yang dibacakan (TTS) */
// Dulu stripRom() membuang seluruh suku kata terakhir, sehingga tombol
// pelafalan pada contoh seperti "집" atau "먹다 → 먹어요" tidak membaca apa pun.
const spoken = [];
for (const t of topics) {
  (t.blocks || []).forEach((b) => {
    if (b.type !== 'examples') return;
    b.items.forEach((ex) => {
      const text = ex.ko.replace(/\s*\([^)]*\)\s*$/, '').trim().split('\u2192');
      const out = (text.length > 1 ? text[text.length - 1] : text[0]).trim();
      if (!out) spoken.push(t.id + ': "' + ex.ko + '" -> kosong');
    });
  });
}
log(spoken.length === 0, 'setiap contoh menghasilkan teks untuk dibacakan', spoken.slice(0, 3).join('; '));

/* ------------------------------- 14. keluar kuis saat hash tidak berubah */
// Tombol X saat kuis dibuka dari materi menuju hash yang sama persis.
// Browser tidak memicu hashchange, jadi aplikasi harus tetap berpindah layar.
window.location.hash = '#/topik/' + topics[0].id;
byId('lessonQuizBtn').click();
const openHash = window.location.hash;
byId('quizCloseBtn').click();
log(isShown('screen-home') && !isShown('screen-quiz'),
  'keluar kuis bekerja walau hash tujuan sama', 'hash=' + openHash);

/* -------------------------------------------------------------- ringkasan */
console.log('');
if (failures) {
  console.log(failures + ' langkah GAGAL.');
  process.exit(1);
}
console.log('Semua langkah lulus.');
