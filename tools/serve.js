/* =====================================================================
   serve.js — server statis kecil untuk menguji mode PWA/offline di
   browser, atau membuka aplikasi dari HP di jaringan lokal.
   Jalankan: node tools/serve.js [port]
   ===================================================================== */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.argv[2]) || 8123;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let rel = url === '/' ? 'index.html' : url.replace(/^\/+/, '');
  const file = path.resolve(ROOT, rel);

  /* Cegah keluar dari folder proyek. */
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end('403');
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 ' + rel);
      return;
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  const nets = os.networkInterfaces();
  const lan = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) lan.push(net.address);
    }
  }
  console.log('Melayani ' + ROOT);
  console.log('  lokal  : http://127.0.0.1:' + PORT);
  for (const ip of lan) console.log('  jaringan: http://' + ip + ':' + PORT);
  console.log('Tekan Ctrl+C untuk berhenti.');
});
