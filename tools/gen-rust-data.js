/* =====================================================================
   gen-rust-data.js — mengubah materi web (js/data.js) menjadi data.json
   untuk aplikasi Rust murni.

   Sumber kebenaran tetap tools/data-final.js -> js/data.js. Skrip ini hanya
   menyalin isinya ke format yang dibaca serde, sehingga aplikasi Rust dan
   versi web selalu memakai materi yang sama persis.

   Jalankan: node tools/gen-rust-data.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'android-rs', 'src', 'data.json');

/* js/data.js menulis ke window.KG_TOPICS, jadi sediakan window tiruan. */
global.window = {};
require(path.join(ROOT, 'js', 'data.js'));

const topics = global.window.KG_TOPICS;
if (!Array.isArray(topics) || !topics.length) {
  console.error('GAGAL: window.KG_TOPICS kosong. Jalankan tools/build-data.js dulu.');
  process.exit(1);
}

/* ---- validasi: jangan pernah menulis data yang rusak ---- */
const problems = [];
const BLOCK_TYPES = ['heading', 'text', 'formula', 'rules', 'examples', 'note'];

topics.forEach((t, ti) => {
  const where = `topik ${ti + 1} (${t.id || 'tanpa id'})`;
  for (const key of ['id', 'no', 'title', 'titleId', 'level', 'icon', 'intro']) {
    if (t[key] === undefined || t[key] === null || t[key] === '') {
      problems.push(`${where}: field "${key}" kosong`);
    }
  }
  if (!Array.isArray(t.blocks) || !t.blocks.length) problems.push(`${where}: blocks kosong`);
  (t.blocks || []).forEach((b, bi) => {
    if (!BLOCK_TYPES.includes(b.type)) {
      problems.push(`${where} blok ${bi}: tipe "${b.type}" tidak dikenal`);
      return;
    }
    if (b.type === 'rules' && !Array.isArray(b.items)) problems.push(`${where} blok ${bi}: rules tanpa items`);
    if (b.type === 'examples' && !Array.isArray(b.items)) problems.push(`${where} blok ${bi}: examples tanpa items`);
    if (b.type === 'formula' && !Array.isArray(b.parts)) problems.push(`${where} blok ${bi}: formula tanpa parts`);
    if (['heading', 'text', 'note'].includes(b.type) && !b.text) {
      problems.push(`${where} blok ${bi}: ${b.type} tanpa text`);
    }
  });

  if (!Array.isArray(t.quiz) || !t.quiz.length) problems.push(`${where}: quiz kosong`);
  (t.quiz || []).forEach((q, qi) => {
    if (!q.q) problems.push(`${where} soal ${qi}: pertanyaan kosong`);
    if (!Array.isArray(q.options) || q.options.length < 2) {
      problems.push(`${where} soal ${qi}: pilihan < 2`);
    }
    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= (q.options || []).length) {
      problems.push(`${where} soal ${qi}: answer di luar jangkauan`);
    }
    if (!q.why) problems.push(`${where} soal ${qi}: pembahasan kosong`);
  });
});

if (problems.length) {
  console.error('Data tidak lolos validasi:');
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}

/* ---- tulis: hanya field yang dipakai aplikasi Rust ---- */
const clean = topics.map((t) => ({
  id: t.id,
  no: t.no,
  title: t.title,
  titleId: t.titleId,
  level: t.level,
  icon: t.icon,
  intro: t.intro,
  blocks: t.blocks.map((b) => {
    switch (b.type) {
      case 'heading':
      case 'text':
      case 'note':
        return { type: b.type, text: b.text };
      case 'formula':
        return { type: b.type, parts: b.parts };
      case 'rules':
        return { type: b.type, items: b.items.map((r) => ({ a: r.a, b: r.b, c: r.c })) };
      case 'examples':
        return {
          type: b.type,
          items: b.items.map((e) => ({ ko: e.ko, rom: e.rom || '', id: e.id, why: e.why || '' })),
        };
      default:
        throw new Error('tipe blok tidak tertangani: ' + b.type);
    }
  }),
  quiz: t.quiz.map((q) => ({ q: q.q, options: q.options, answer: q.answer, why: q.why })),
  lat: (t.lat || []).map((l) => ({ ko: l.ko, rom: l.rom || '', id: l.id })),
}));

fs.writeFileSync(OUT, JSON.stringify(clean, null, 2) + '\n');

const soal = clean.reduce((a, t) => a + t.quiz.length, 0);
const latihan = clean.reduce((a, t) => a + t.lat.length, 0);
const blok = clean.reduce((a, t) => a + t.blocks.length, 0);
console.log(`data.json siap: ${clean.length} topik, ${blok} blok, ${soal} soal, ${latihan} latihan`);
console.log('  -> ' + path.relative(ROOT, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
