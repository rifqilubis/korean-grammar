# 한국어 문법 — Belajar Grammar Korea untuk Pemula

Aplikasi web statis untuk belajar **tata bahasa Korea dari nol**, dengan antarmuka bahasa Indonesia.
Isinya **10 topik materi**, **82 soal pilihan ganda** dengan pembahasan, dan **32 latihan menulis**.

Dibuat dengan HTML, CSS, dan JavaScript biasa — tanpa framework, tanpa dependensi, dan tanpa
build step. Cukup buka `index.html`.

**Langsung pakai di browser:** **https://rifqilubis.github.io/korean-grammar/**

---

## Cara menjalankan

**Paling mudah:** klik dua kali `index.html` (atau klik kanan → *Open with* → browser).

**Lewat server lokal** (opsional, perlu untuk menguji mode offline/PWA dan kalau ingin dibuka dari HP):

```powershell
python -m http.server 8123
# lalu buka http://127.0.0.1:8123
```

## Isi materi

Sepuluh topik tersusun dari yang paling dasar sampai bisa membuat kalimat sendiri:

| No | Topik | Level |
| --- | --- | --- |
| 1 | 한글 — Huruf Korea (konsonan, vokal, 받침) | Dasar |
| 2 | 어순 — Urutan kalimat (pola S-O-P) | Dasar |
| 3 | 은/는 — Partikel topik kalimat | Dasar |
| 4 | 이/가 — Partikel subjek pelaku | Dasar |
| 5 | 을/를 — Partikel objek | Menengah |
| 6 | 이에요/예요 — "Adalah" (kopula) | Menengah |
| 7 | 있어요/없어요 — Ada / tidak ada | Menengah |
| 8 | 아요/어요 — Konjugasi kata kerja sopan | Menengah |
| 9 | 숫자 — Angka Sino dan angka asli | Lanjutan |
| 10 | 았어요/었어요 — Masa lalu dan negasi | Lanjutan |

Setiap topik berisi blok **rumus**, **tabel aturan**, **contoh kalimat** dengan romanisasi dan
terjemahan, serta **catatan** berisi kiat praktis.

## Fitur

| Fitur | Keterangan |
| --- | --- |
| Materi bertahap | 10 topik, dari huruf sampai masa lalu, dengan penanda level Dasar / Menengah / Lanjutan |
| Kuis pilihan ganda | 82 soal, selalu 4 pilihan, dengan pembahasan setiap jawaban |
| Pembahasan jawaban salah | Di akhir kuis, semua jawaban yang belum tepat dibahas ulang |
| Latihan menulis | Ketik kalimat Korea, dicocokkan tanpa melihat romanisasi |
| Pelafalan | Tombol 🔊 memakai Web Speech API (`ko-KR`) untuk membacakan contoh kalimat |
| Sebaran jawaban merata | Jawaban benar tersebar di posisi A–D, jadi tidak bisa ditebak dari posisinya |
| Progres otomatis | Topik tuntas, rata-rata skor, dan jumlah soal dijawab disimpan di `localStorage` |
| Tema | Gelap (default) dan terang, tersimpan di `localStorage` |
| Papan angka | Tekan `1`–`4` atau `A`–`D` untuk menjawab, `Enter` untuk lanjut |
| Responsif | Enak dipakai dari layar HP sampai desktop, aman untuk poni (notch) dan gesture bar |
| Bisa dipasang | PWA: dipasang ke layar utama, punya ikon sendiri, terbuka layar penuh |
| Mode offline | Setelah dipasang, seluruh materi dan soal tersimpan di perangkat |

## Pakai di ponsel (dan saat offline)

Aplikasi sudah dipasang di GitHub Pages, jadi bisa dibuka dari ponsel di mana saja:

**https://rifqilubis.github.io/korean-grammar/**

Supaya tampil seperti aplikasi biasa dan tetap bisa dibuka tanpa internet:

| Ponsel | Caranya |
| --- | --- |
| Android (Chrome) | Buka tautan → menu ⋮ → **Install app** / **Tambahkan ke layar utama** |
| iPhone / iPad (Safari) | Buka tautan → tombol **Bagikan** → **Tambahkan ke Layar Utama** |

Setelah dipasang, aplikasi muncul sebagai ikon di layar utama, terbuka layar penuh tanpa bilah
alamat, dan seluruh isinya tersimpan di perangkat.

**Kalau mengubah berkas:** naikkan angka `CACHE` di `sw.js` (mis. `kg-dsh-v2` → `kg-dsh-v3`),
supaya ponsel yang sudah memasang versi lama mengambil pembaruan, bukan salinan lama.

## Struktur berkas

```
korean-grammar/
├─ index.html            # kerangka layar: daftar materi, materi, latihan, kuis, hasil
├─ manifest.json         # identitas PWA (nama, ikon, mode mandiri)
├─ sw.js                 # service worker: aplikasi tetap jalan tanpa internet
├─ css/style.css         # tema gelap & terang, tata letak, animasi
├─ js/
│  ├─ app.js             # router hash, render materi, mesin kuis, progres
│  └─ data.js            # bank materi & soal (dihasilkan otomatis, ASCII-only)
├─ icons/                # ikon PWA: 192, 512, maskable, apple-touch, favicon
└─ tools/
   ├─ data-final.js      # sumber materi yang diedit manusia
   ├─ build-data.js      # menghasilkan js/data.js dari data-final.js
   ├─ validate.js        # pemeriksa data, partikel, aset, dan referensi DOM
   ├─ smoke-test.js      # uji seluruh alur aplikasi tanpa browser (DOM mini)
   └─ make-icons.py      # bikin ulang ikon dari font Korea (butuh Pillow)
```

## Menambah atau mengubah materi

Jangan menyunting `js/data.js` langsung — berkas itu hasil build. Sunting **`tools/data-final.js`**,
lalu bangun ulang:

```powershell
node tools/build-data.js
```

Struktur satu topik:

```js
{
  id: "hangeul", no: 1, title: "한글 — Huruf Korea", titleId: "Hangeul: dasar membaca",
  level: 1, icon: "한", intro: "…",
  blocks: [
    { type: "heading",  text: "Konsonan dasar" },
    { type: "text",     text: "…" },
    { type: "formula",  parts: ["Subjek 은/는", "Objek 을/를", "Kata kerja"] },
    { type: "rules",    items: [{ a: "…", b: "…", c: "…" }] },
    { type: "examples", items: [{ ko: "…", rom: "…", id: "…", why: "…" }] },
    { type: "note",     text: "…" }
  ],
  quiz: [{ q: "…", options: ["…", "…", "…", "…"], answer: 0, why: "…" }],
  lat:  [{ ko: "…", rom: "…", id: "…" }]
}
```

`build-data.js` juga **menggilir posisi jawaban benar** secara deterministik, supaya pilihan A–D
terpakai merata dan kuis tidak bisa dijawab hanya dengan menebak posisi. Di `data-final.js` kamu
tetap menulis jawaban di indeks `0`; build yang memindahkannya.

Setelah mengubah, jalankan kedua pemeriksa (butuh Node.js):

```powershell
node tools/validate.js    # data, partikel, aset, referensi DOM
node tools/smoke-test.js  # seluruh alur aplikasi
```

`validate.js` memastikan setiap topik punya field lengkap, setiap soal punya 4 pilihan dan
pembahasan, partikel 은/는·이/가·을/를 cocok dengan 받침 kata sebelumnya, sebaran jawaban merata,
tidak ada aksara non-Hangul yang salah tempel, dan semua elemen yang dipakai `app.js` benar-benar
ada di `index.html`.

`smoke-test.js` menyediakan DOM mini, lalu menjalankan `app.js` yang asli dan mengemudikan aplikasi
sampai selesai: membuka semua materi, mengerjakan 10 kuis sampai 100%, menjawab salah, melihat
pembahasan, latihan menulis, papan angka, ganti tema, keluar kuis, dan hapus progres.

## Menyesuaikan warna

Semua warna ada di bagian atas `css/style.css` sebagai variabel CSS:

```css
html[data-theme="dark"] {
  --accent: #e14b6a;   /* merah aksen */
  --ok: #17a673;       /* hijau jawaban benar */
  --bad: #e5484d;      /* merah jawaban salah */
  --surface: #171a28;  /* latar kartu */
}
```

## Catatan teknis

- Ditulis dengan HTML, CSS, dan JavaScript biasa (tanpa framework, tanpa CDN, tanpa font eksternal),
  jadi tetap jalan saat dibuka langsung dari berkas (`file://`) maupun offline.
- `js/data.js` sengaja disimpan **ASCII-only** (Karakter Korea ditulis sebagai `\uXXXX`) supaya
  tidak rusak oleh perbedaan encoding di editor mana pun.
- Suara pelafalan bergantung pada suara `ko-KR` yang terpasang di sistem. Bila tidak ada, tombol 🔊
  tidak muncul.
- Progres belajar hanya tersimpan di perangkat (localStorage); tidak ada server dan tidak ada data
  yang dikirim ke mana pun.
