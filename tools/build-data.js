// build-data.js — menghasilkan js/data.js (ASCII-only, \uXXXX) dari tools/data-final.js
// Jalankan: node tools/build-data.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const here = __dirname;

// Muat bank soal
const sandbox = {};
global.window = sandbox;
eval(fs.readFileSync(path.join(here, 'data-final.js'), 'utf8'));
const topics = sandbox.KG_TOPICS;

if (!Array.isArray(topics) || topics.length === 0) {
  throw new Error('KG_TOPICS tidak ditemukan di data-final.js');
}

/* --------------------------------------------------------- sebar jawaban
   Di data-final.js semua soal menulis jawaban benar di indeks 0, sehingga
   pilihan A selalu benar dan kuis bisa dijawab tanpa membaca. Di sini posisi
   jawaban digilir secara deterministik (tanpa Math.random) supaya hasil build
   selalu sama, sekaligus memastikan keempat posisi A-D benar-benar terpakai. */
function spreadAnswers(topics) {
  let cursor = 0;
  const used = [0, 0, 0, 0];
  topics.forEach((t) => (t.quiz || []).forEach((q) => {
    const correct = q.options[q.answer];
    const n = q.options.length;
    // rotasi: posisi bergilir 0,1,2,3,0,1,...
    const target = cursor % n;
    cursor++;
    const rest = q.options.filter((_, i) => i !== q.answer);
    const options = rest.slice();
    options.splice(target, 0, correct);
    q.options = options;
    q.answer = target;
    used[target]++;
  }));
  return used;
}

const answerUse = spreadAnswers(topics);

const header = [
  '/* ===============================================================',
  '   KG Korean Grammar - bank data.',
  '   File ini dihasilkan otomatis oleh tools/build-data.js.',
  '   Jangan diubah manual; sunting tools/data-final.js lalu build ulang.',
  '   Struktur topik:',
  '     id, no, title, titleId, level, icon, intro',
  '     blocks : heading | text | formula | rules | examples | note',
  '     quiz   : { q, options[4], answer, why }',
  '     lat    : latihan singkat { ko, rom, id }',
  '   =============================================================== */',
  ''
].join('\n');

const toAscii = (s) => {
  let out = '';
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    out += cp < 128 ? ch : '\\u' + cp.toString(16).toUpperCase().padStart(4, '0');
  }
  return out;
};

const body = 'window.KG_TOPICS = ' + JSON.stringify(topics, null, 2) + ';\n';

const out = toAscii(header + body);
const dest = path.join(root, 'js', 'data.js');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out, 'ascii');

const nonAscii = [...out].filter((c) => c.codePointAt(0) > 127).length;
console.log('data.js: ' + topics.length + ' topik, ' +
  topics.reduce((n, t) => n + t.quiz.length, 0) + ' soal, ' + out.length + ' karakter, non-ASCII: ' + nonAscii + ' (harus 0)');
console.log('sebaran jawaban A/B/C/D: ' + answerUse.join(' / '));
