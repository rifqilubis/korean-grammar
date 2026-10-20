/* validate.js — pemeriksa data & aset aplikasi 한국어 문법
   Jalankan: node tools/validate.js
   Tidak butuh dependensi. Keluar dengan kode 1 bila ada masalah. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const problems = [];
const warn = [];

const problem = (m) => problems.push(m);
const warning = (m) => warn.push(m);
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));

/* ---------------------------------------------------------------- muat data */
const sandbox = { window: {} };
vm.createContext(sandbox);
try {
  vm.runInContext(read('js/data.js'), sandbox, { filename: 'data.js' });
} catch (e) {
  console.error('GAGAL memuat js/data.js: ' + e.message);
  process.exit(1);
}

const topics = sandbox.window.KG_TOPICS;
if (!Array.isArray(topics)) {
  console.error('KG_TOPICS tidak ditemukan.');
  process.exit(1);
}

/* ---------------------------------------------------------------- 1. struktur */
const ids = new Set();
const nums = new Set();
const BLOCKS = ['heading', 'text', 'formula', 'rules', 'examples', 'note'];

topics.forEach((t, i) => {
  const tag = 'topik ' + (i + 1) + ' (' + (t.id || 'tanpa-id') + ')';
  ['id', 'no', 'title', 'titleId', 'level', 'icon', 'intro'].forEach((k) => {
    if (t[k] === undefined || t[k] === '') problem(tag + ': field ' + k + ' kosong');
  });
  if (ids.has(t.id)) problem(tag + ': id ganda');
  ids.add(t.id);
  if (nums.has(t.no)) problem(tag + ': nomor topik ganda');
  nums.add(t.no);
  if (![1, 2, 3].includes(t.level)) problem(tag + ': level harus 1, 2, atau 3');
  if (!/^[\uAC00-\uD7A3]$/.test(t.icon)) problem(tag + ': icon harus satu suku kata Hangul');
  if (!Array.isArray(t.blocks) || !t.blocks.length) problem(tag + ': blocks kosong');

  (t.blocks || []).forEach((b, bi) => {
    const btag = tag + ' blok ' + bi;
    if (!BLOCKS.includes(b.type)) { problem(btag + ': jenis blok tidak dikenal (' + b.type + ')'); return; }
    if (b.type === 'formula' && (!Array.isArray(b.parts) || b.parts.length < 2)) problem(btag + ': formula butuh minimal 2 bagian');
    if (b.type === 'rules' && (!Array.isArray(b.items) || !b.items.length)) problem(btag + ': rules kosong');
    if (b.type === 'examples' && (!Array.isArray(b.items) || !b.items.length)) problem(btag + ': examples kosong');
    if (['heading', 'text', 'note'].includes(b.type) && !b.text) problem(btag + ': teks kosong');
    (b.items || []).forEach((it, ii) => {
      if (b.type === 'examples' && !it.ko) problem(btag + ' contoh ' + ii + ': ko kosong');
      if (b.type === 'rules' && !it.a) problem(btag + ' baris ' + ii + ': kolom a kosong');
    });
  });
});

/* ---------------------------------------------------------------- 2. kuis */
let quizCount = 0;
const seenQuestion = new Map();

topics.forEach((t) => {
  if (!Array.isArray(t.quiz) || !t.quiz.length) { problem(t.id + ': tidak punya soal'); return; }
  if (t.quiz.length < 5) warning(t.id + ': hanya ' + t.quiz.length + ' soal (disarankan minimal 5)');

  t.quiz.forEach((q, qi) => {
    const tag = t.id + ' soal ' + (qi + 1);
    quizCount++;
    if (!q.q || !String(q.q).trim()) problem(tag + ': pertanyaan kosong');
    if (!Array.isArray(q.options) || q.options.length !== 4) problem(tag + ': harus tepat 4 pilihan');
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options || []).length) {
      problem(tag + ': answer harus indeks 0-3');
    }
    const opts = q.options || [];
    if (new Set(opts).size !== opts.length) problem(tag + ': ada pilihan ganda yang kembar');
    opts.forEach((o) => {
      if (typeof o !== 'string' || !o.trim()) problem(tag + ': ada pilihan kosong');
    });
    if (!q.why || !String(q.why).trim()) problem(tag + ': pembahasan (why) kosong');
    const key = String(q.q).trim();
    if (seenQuestion.has(key)) warning(tag + ': pertanyaan sama dengan ' + seenQuestion.get(key));
    else seenQuestion.set(key, tag);
  });
});

/* ------------------------------------------------- 3. soal pilihan partikel */
/* Mendeteksi kalimat berpartikel salah yang khas: "kata+konsonan + 를",
   "kata+vokal + 을", "kata+konsonan + 는/가", "kata+vokal + 은/이". */
function hasBatchim(ch) {
  const c = ch.charCodeAt(0);
  if (c < 0xac00 || c > 0xd7a3) return null; // bukan suku kata Hangul
  return (c - 0xac00) % 28 !== 0;
}

function checkParticles(text, tag) {
  // Partikel harus berada di akhir kata: diikuti spasi, tanda baca, atau akhir teks.
  // (Lookahead lama melarang spasi, sehingga tidak pernah cocok sama sekali.)
  const re = /([\uAC00-\uD7A3])(을|를|은|는|이|가)(?=[\s.,!?\u2026]|$)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const batchim = hasBatchim(m[1]);
    if (batchim === null) continue;
    const p = m[2];
    const needsBatchim = p === '을' || p === '은' || p === '이';
    if (needsBatchim && !batchim) {
      warning(tag + ': "' + m[0] + '" memakai ' + p + ' setelah vokal');
    } else if (!needsBatchim && batchim) {
      warning(tag + ': "' + m[0] + '" memakai ' + p + ' setelah konsonan');
    }
  }
}

topics.forEach((t) => {
  (t.blocks || []).forEach((b) => {
    if (b.type === 'examples') b.items.forEach((ex) => checkParticles(ex.ko, t.id));
  });
  (t.lat || []).forEach((ex) => checkParticles(ex.ko, t.id + ' latihan'));
});

/* ---------------------------------------------------------------- 4. latihan */
topics.forEach((t) => {
  if (!t.lat) return;
  t.lat.forEach((it, i) => {
    if (!it.ko || !it.id) problem(t.id + ' latihan ' + (i + 1) + ': ko/id kosong');
  });
});

/* ------------------------------------------- 4b. kualitas bank soal (regresi) */
/* Semua soal pernah menaruh jawaban benar di pilihan A, sehingga kuis bisa
   dijawab benar tanpa membaca. Pastikan sebarannya tetap merata. */
const answerPos = [0, 0, 0, 0];
topics.forEach((t) => t.quiz.forEach((q) => { answerPos[q.answer]++; }));
const totalQuiz = answerPos.reduce((a, b) => a + b, 0);
if (totalQuiz > 8) {
  answerPos.forEach((n, i) => {
    if (n / totalQuiz < 0.15) {
      problem('sebaran jawaban tidak merata: pilihan ' + 'ABCD'[i] + ' hanya ' + n +
        ' dari ' + totalQuiz + ' soal (bangun ulang dengan node tools/build-data.js)');
    }
  });
}

/* Pembahasan tidak boleh menunjuk posisi huruf, karena urutan pilihan
   bisa berubah saat data dibangun ulang. */
topics.forEach((t) => t.quiz.forEach((q, i) => {
  if (/jawaban\s+[A-D]\b|pilihan\s+[A-D]\b|opsi\s+[A-D]\b/i.test(String(q.why))) {
    problem(t.id + ' soal ' + (i + 1) + ': pembahasan menunjuk posisi pilihan (A/B/C/D)');
  }
}));

/* Karakter non-Hangul yang sering salah tempel (mis. U+A9BE dari aksara Jawa). */
topics.forEach((t) => (t.blocks || []).forEach((b) => {
  (b.items || []).forEach((it, ii) => {
    ['a', 'b', 'c'].forEach((k) => {
      const v = it[k];
      if (typeof v !== 'string') return;
      for (const ch of v) {
        const cp = ch.codePointAt(0);
        if (cp >= 0xA980 && cp <= 0xA9DF) {
          problem(t.id + ' blok ' + b.type + ' baris ' + ii + ': ada aksara Jawa bukan Hangul (U+' +
            cp.toString(16).toUpperCase() + ') di kolom ' + k);
        }
      }
    });
  });
}));

/* Pembahasan soal "Lengkapi:" harus membahas kata yang ditanyakan. */
topics.forEach((t) => t.quiz.forEach((q, i) => {
  const m = String(q.q).match(/Lengkapi:\s*(\S+?)___/);
  if (!m) return;
  const word = m[1];
  const why = String(q.why || '');
  const answer = q.options[q.answer];
  // kata yang ditanyakan harus muncul di pembahasan, atau partikelnya disebut
  if (word && !why.includes(word) && !why.includes(answer)) {
    warning(t.id + ' soal ' + (i + 1) + ': pembahasan tidak menyebut "' + word + '" yang ditanyakan');
  }
}));

/* ---------------------------------------------------------------- 5. aset */
const assets = [
  'index.html', 'manifest.json', 'sw.js', 'css/style.css', 'js/app.js', 'js/data.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png', 'icons/favicon-32.png'
];
assets.forEach((a) => { if (!exists(a)) problem('aset hilang: ' + a); });

if (exists('manifest.json')) {
  try {
    const mf = JSON.parse(read('manifest.json'));
    ['name', 'short_name', 'start_url', 'display', 'icons'].forEach((k) => {
      if (!mf[k]) problem('manifest.json: field ' + k + ' hilang');
    });
    (mf.icons || []).forEach((ic) => {
      if (!exists(ic.src)) problem('manifest.json: ikon tidak ada ' + ic.src);
    });
  } catch (e) {
    problem('manifest.json tidak valid: ' + e.message);
  }
}

/* ------------------------------------------------- 6. referensi DOM di app.js */
const appjs = exists('js/app.js') ? read('js/app.js') : '';
const html = exists('index.html') ? read('index.html') : '';
const htmlIds = new Set((html.match(/\bid="([^"]+)"/g) || []).map((s) => s.slice(4, -1)));
const usedIds = new Set((appjs.match(/\$\('([A-Za-z0-9_-]+)'\)/g) || []).map((s) => s.slice(3, -2)));
usedIds.forEach((id) => {
  if (!htmlIds.has(id)) problem('app.js memakai #' + id + ' tetapi tidak ada di index.html');
});

/* --------------------------------------------- 7. berkas yang dirujuk index.html */
const refs = (html.match(/(?:src|href)="([^"#][^"]*)"/g) || [])
  .map((s) => s.replace(/^(?:src|href)="/, '').replace(/"$/, ''))
  .filter((p) => !/^(data:|https?:|mailto:|#)/.test(p));
refs.forEach((r) => { if (!exists(r)) problem('index.html merujuk berkas yang tidak ada: ' + r); });

/* ------------------------------------------------------------------ laporan */
const pad = (n) => String(n).padStart(2, '0');
console.log('한국어 문법 — pemeriksa data');
console.log('  topik    : ' + topics.length);
console.log('  soal     : ' + quizCount);
console.log('  latihan  : ' + topics.reduce((n, t) => n + (t.lat || []).length, 0));
console.log('  contoh   : ' + topics.reduce((n, t) => n + (t.blocks || [])
  .filter((b) => b.type === 'examples').reduce((k, b) => k + b.items.length, 0), 0));
console.log('');

if (warn.length) {
  console.log('Peringatan (' + warn.length + '):');
  warn.forEach((w, i) => console.log('  ' + pad(i + 1) + '. ' + w));
  console.log('');
}

if (problems.length) {
  console.log('MASALAH (' + problems.length + '):');
  problems.forEach((p, i) => console.log('  ' + pad(i + 1) + '. ' + p));
  process.exit(1);
}

console.log('Semua pemeriksaan lulus.');
