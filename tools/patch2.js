// patch2.js — perbaiki soal kembar & struktur data-final.js
const fs = require('fs');
const [,, src, dst] = process.argv;
let t = fs.readFileSync(src, 'utf8');
const H = (...c) => String.fromCharCode(...c);

const MUL_I = H(0xBB3C) + '\uC774';        // 물이
const GWEN = H(0xAD1C, 0xCC2E, 0x2C) + ' '; // 괜찮

// Soal kembar: "Lengkapi: 물___ 있어요." muncul di eun-neun dan isseoyo.
// Untuk eun-neun, ganti kata bendanya menjadi 커피 supaya fokus ke pemilihan 은/는.
const from = '{ q: "Lengkapi: ' + MUL_I + '___ \uC788\uC5B4\uC694.", options: ["\uC740", "\uB294", "\uC744", "\uC774"], answer: 0,';
const to = '{ q: "Lengkapi: \uCEE4\uD53C___ \uB9DB\uC788\uC5B4\uC694. (Kopinya enak.)", options: ["\uAC00", "\uC774", "\uB294", "\uB97C"], answer: 0,';
if (t.includes(from)) { t = t.split(from).join(to); console.log('OK eun-neun soal 2 diganti'); }
else console.log('MISS soal kembar (eun-neun)');

// Simpan sebagai ASCII-only
let a = '';
for (const ch of t) {
  const cp = ch.codePointAt(0);
  a += cp < 128 ? ch : '\\u' + cp.toString(16).toUpperCase().padStart(4, '0');
}
fs.writeFileSync(dst, a, 'ascii');
console.log('saved, nonascii', [...a].filter((c) => c.codePointAt(0) > 127).length);
