/* =====================================================================
   build-app.js — menyalin aset web ke dist/ untuk dikemas Tauri (Android
   & desktop). Folder dist/ adalah yang dibundel ke dalam APK.

   Aset sumber tetap di root repo supaya website/PWA (GitHub Pages) tidak
   berubah sama sekali. Jalankan: node tools/build-app.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'dist');

/* sw.js tidak ikut: di dalam APK seluruh berkas sudah lokal, service worker
   tidak berguna dan hanya menambah pekerjaan saat start. */
const FILES = [
  'index.html',
  'manifest.json',
  'css/style.css',
  'js/data.js',
  'js/app.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png',
];

function rmrf(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

function copy(rel) {
  const from = path.join(ROOT, rel);
  const to = path.join(OUT, rel);
  if (!fs.existsSync(from)) {
    throw new Error('berkas sumber tidak ada: ' + rel);
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function bytes(n) {
  return n > 1024 ? (n / 1024).toFixed(1) + ' KB' : n + ' B';
}

function main() {
  rmrf(OUT);
  fs.mkdirSync(OUT, { recursive: true });

  let total = 0;
  for (const rel of FILES) {
    copy(rel);
    total += fs.statSync(path.join(OUT, rel)).size;
  }

  /* Penanda versi supaya mudah memeriksa build mana yang terpasang. */
  fs.writeFileSync(
    path.join(OUT, 'build-info.json'),
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      files: FILES.length,
      bytes: total,
    }, null, 2) + '\n'
  );

  console.log('dist/ siap: ' + FILES.length + ' berkas, ' + bytes(total));
}

main();
