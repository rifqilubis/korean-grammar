// patch3.js — perbaikan soal kembar + normalisasi escape berlebih (\\u003E -> \u003E)
const fs = require('fs');
const [,, src, dst] = process.argv;
let t = fs.readFileSync(src, 'utf8');

// 1. Normalisasi escape ganda dari proses sebelumnya.
//    File ini menyimpan escape sebagai teks, jadi tiap nyawa escape punya satu backslash.
const doubled = t.split('\\\\u').length - 1;
if (doubled > 0) {
  t = t.split('\\\\u').join('\\u');
}
console.log('escape ganda dinormalisasi:', doubled);

// 2. Soal "Lengkapi: 물___ 있어요." muncul dua kali (eun-neun & isseoyo).
//    Ganti soal di eun-neun menjadi kalimat tentang kopi agar fokus pada 은/는.
const MUL = '\\uBB3C';
const from = '{ q: "Lengkapi: ' + MUL + '___ \\uC788\\uC5B4\\uC694.", options: ["\\uC740", "\\uB294", "\\uC744", "\\uC774"], answer: 0,';
const to = '{ q: "Lengkapi: \\uCEE4\\uD53C___ \\uB9DB\\uC788\\uC5B4\\uC694. (Kopinya enak.)", options: ["\\uAC00", "\\uC774", "\\uB294", "\\uB97C"], answer: 0,';
if (t.includes(from)) { t = t.split(from).join(to); console.log('OK soal kembar eun-neun diganti'); }
else console.log('MISS soal kembar');

// 3. Pastikan tetap ASCII murni
const bad = [...t].filter((c) => c.codePointAt(0) > 127);
console.log('non-ascii setelah patch:', bad.length);
fs.writeFileSync(dst, t, 'ascii');
console.log('tersimpan:', dst);
