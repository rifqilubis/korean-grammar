# Menjalankan sebagai aplikasi Android (Rust + Tauri)

Folder ini juga bisa dijalankan sebagai **aplikasi Android asli**, bukan hanya situs web.
Pembungkusnya ditulis dengan **Rust** memakai [Tauri 2](https://tauri.app): lapisan Rust
membuat WebView native, menyediakan mesin suara (TTS) Korea bawaan HP, dan menangani tombol
*Back*. Seluruh materi, kuis, dan progres tetap dijalankan oleh `js/` yang sudah ada —
jadi tidak ada materi yang ditulis dua kali.

```
Web (HTML/CSS/JS)  ──►  dist/  ──►  APK Android
                          ▲            │
                          └── dibundel ke dalam aplikasi
```

## Hasil akhir

| | |
| --- | --- |
| Berkas | `build/korean-grammar.apk` (sudah ditandatangani, siap pasang) |
| Nama di layar utama | 한국어 문법 |
| Ukuran APK | ± 17 MB — berisi kode Rust untuk 4 arsitektur sekaligus |
| Android minimal | 7.0 (API 24) |
| Butuh internet | tidak — seluruh materi ada di dalam APK |
| Suara pelafalan | mesin TTS bawaan Android (Google TTS, `ko-KR`) |

Ukuran 17 MB itu karena satu APK memuat `arm64-v8a`, `armeabi-v7a`, `x86`, dan `x86_64`
sekaligus agar bisa dipasang di HP apa pun. Kalau hanya butuh satu arsitektur (misalnya
`arm64-v8a` untuk HP modern), APK-nya bisa turun ke sekitar 6 MB.

## Yang perlu dipasang sekali saja

| Alat | Versi | Catatan |
| --- | --- | --- |
| Rust | 1.77+ | `rustup` — pasang target Android sekaligus |
| Android SDK | platform 37, build-tools 34+ | lewat Android Studio atau `sdkmanager` |
| Android NDK | 27.x | dipakai `rustc` untuk menargetkan ARM |
| JDK | 17 | wajib untuk Gradle |
| Node.js | 18+ | hanya untuk Tauri CLI dan skrip build |

Kalau memakai Android Studio, cukup pasang **Android SDK Platform 37**, **NDK 27**, dan **JDK 17**
lewat SDK Manager. Kalau tanpa Android Studio, jalankan saja skrip bootstrap di bawah.

### Skrip bootstrap (Windows)

```powershell
powershell -ExecutionPolicy Bypass -File tools/setup-android.ps1
```

Skrip ini memasang target Rust Android, Android SDK + NDK, dan membuat
`src-tauri/gen/android` lewat `tauri android init`. Aman dijalankan berulang — bagian yang
sudah ada akan dilewati.

## Membangun APK

```powershell
npm install            # sekali saja: memasang Tauri CLI
npm run android:build  # build + zipalign + tanda tangan -> build/korean-grammar.apk
```

Hasilnya:

```
build/korean-grammar.apk     <- pasang yang ini
```

Prosesnya: `dist/` dibuat ulang → Rust dikompilasi untuk 4 arsitektur → Gradle merakit APK
→ `zipalign` → ditandatangani `apksigner` → disalin ke `build/`.

### Kunci tanda tangan (keystore)

Pada build pertama, `tools/build-android.ps1` membuat sendiri keystore di
`.keystore/korean-grammar.jks` beserta kata sandinya di `.keystore/keystore.properties`.
Keduanya **jangan di-commit** (sudah masuk `.gitignore`) dan **harus disimpan** — tanpa
keduanya, pembaruan aplikasi tidak bisa ditandatangani dengan identitas yang sama, sehingga
harus di-uninstall dulu sebelum memasang versi baru.

Kalau ingin memakai keystore sendiri, timpa berkas di `.keystore/` lalu sesuaikan
`keystore.properties`.

Pasang ke HP yang tersambung lewat USB:

```powershell
adb install -r build/korean-grammar.apk
```

Atau salin `build/korean-grammar.apk` ke HP dan buka lewat File Manager (perlu izin
*Install unknown apps*).

Pilihan lain dari skrip yang sama:

```powershell
powershell -ExecutionPolicy Bypass -File tools/build-android.ps1 -NoSign   # APK mentah
powershell -ExecutionPolicy Bypass -File tools/build-android.ps1 -Aab      # .aab untuk Play Store
```

### Selama ngoprek tampilan

```powershell
npm run android:dev
```

Perintah ini memasang aplikasi debug, menyambungkan konsol ke WebView, dan **memuat ulang
otomatis** setiap kali `js/`, `css/`, atau `index.html` disimpan.

### Membuat file AAB untuk Play Store

```powershell
npm run android:build:aab
```

Hasilnya `build/korean-grammar.aab`. Play Store mewajibkan AAB ditandatangani dengan
keystore unggahan; pakai keystore dari `.keystore/` atau milik sendiri.

## Apa yang berbeda saat berjalan sebagai aplikasi Android

| Hal | Di browser | Di aplikasi Android |
| --- | --- | --- |
| Sumber berkas | `index.html` di folder | dibundel di dalam APK (`asset://localhost`) |
| Suara pelafalan | Web Speech API | plugin TTS native lewat Rust (`ko-KR`) |
| Tombol *Back* HP | — | tutup kuis → daftar materi → keluar aplikasi |
| Service worker | aktif (mode offline PWA) | tidak didaftarkan — tidak perlu, aset sudah lokal |
| Progres belajar | `localStorage` | `localStorage` WebView (bertahan antar pembaruan) |
| Izin internet | — | dideklarasikan Tauri, tetapi aplikasi tidak pernah memakainya — semua materi lokal |

## Struktur berkas khusus Android

```
package.json                   # skrip npm + Tauri CLI
src-tauri/
├─ Cargo.toml                  # dependensi Rust (tauri, plugin TTS)
├─ build.rs                    # hook build Tauri
├─ tauri.conf.json             # nama aplikasi, ikon, jendela, minSdk
├─ capabilities/default.json   # izin plugin (core + tts)
├─ icons/                      # ikon semua ukuran, termasuk Android mipmap
├─ src/
│  ├─ lib.rs                   # entry point Android/iOS + perintah Rust
│  └─ main.rs                  # entry point desktop
└─ gen/android/                # proyek Gradle (dibuat `tauri android init`)
tools/
├─ build-app.js                # menyalin aset web ke dist/
├─ build-android.ps1           # build + tanda tangan -> build/korean-grammar.apk
├─ serve.js                    # server lokal untuk uji PWA
└─ setup-android.ps1           # pemasang alat-alat Android
dist/                          # hasil build-app.js (tidak di-commit)
build/                         # APK/AAB hasil akhir (tidak di-commit)
.keystore/                     # kunci tanda tangan (tidak di-commit, simpan!)
```

## Memperbarui materi

Alurnya tidak berubah: sunting `tools/data-final.js`, lalu

```powershell
node tools/build-data.js     # bangun ulang js/data.js
node tools/validate.js       # periksa data
node tools/smoke-test.js     # uji seluruh alur
npm run android:build        # bangun ulang APK
```

`tools/build-app.js` selalu menyalin ulang `js/` dan `css/` terbaru ke `dist/`, jadi APK
selalu memakai materi versi terakhir.

## Ganti nama paket

Nama paket ada di `src-tauri/tauri.conf.json` pada `identifier`
(`com.rifqilubis.koreangrammar`). Kalau diubah setelah `gen/android` dibuat, jalankan ulang
`npm run android:init` agar folder Gradle menyesuaikan.

## Kalau build gagal

| Gejala | Sebab dan solusi |
| --- | --- |
| `npm error Missing script: "tauri"` | Skrip `"tauri": "tauri"` hilang dari `package.json`; Gradle memanggil `npm run tauri` |
| `failed to create .tauri directory: Access is denied` | Sisa folder dari build sebelumnya di dalam registry Cargo. Hapus `%USERPROFILE%\.cargo\registry\src\index.crates.io-*\tauri-plugin-tts-0.2.1\android\.tauri`, lalu build ulang |
| `link.exe not found` | Kurang *Visual Studio Build Tools* (C++) — hanya perlu untuk build desktop, bukan Android |
| `NDK not found` / `linker 'aarch64-linux-android-clang' not found` | NDK belum terpasang atau `ANDROID_NDK_HOME` belum diset; jalankan `tools/setup-android.ps1` |
| `Unsupported class file major version` | Gradle memakai JDK yang salah; pastikan `JAVA_HOME` menunjuk ke JDK 17 |
| `SDK location not found` | Set `ANDROID_HOME`, atau buat `src-tauri/gen/android/local.properties` berisi `sdk.dir=C:\\Users\\<nama>\\AppData\\Local\\Android\\Sdk` |
| Aplikasi terbuka tapi layar putih | `dist/` kosong; jalankan `node tools/build-app.js` lebih dulu |
| Suara tidak keluar | HP belum punya data bahasa Korea: *Setelan → Aksesibilitas → Text-to-speech → pasang bahasa Korea* |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | APK lama ditandatangani kunci berbeda; uninstall dulu aplikasinya, atau pakai `.keystore/` yang sama |
| `App not installed` saat memasang manual | Aktifkan *Install unknown apps* untuk File Manager, dan pastikan versi Android ≥ 7.0 |

## Catatan teknis

- Tauri 2 menanamkan `dist/` ke dalam pustaka Rust (dikompres Brotli), jadi isi APK tidak
  memuat `assets/index.html` secara terpisah — itu normal.
- Tanda tangan memakai skema v2 + v3 (bukan v1/JAR). Skema v2 sudah didukung sejak
  Android 7.0, jadi cocok dengan `minSdk` 24.
- Tombol *Back* ditangani di JavaScript lewat event `tauri://backbutton`, karena
  `TauriActivity` tidak menangani navigasi back secara bawaan.
