# Versi Rust murni (tanpa WebView)

Folder `android-rs/` berisi aplikasi Android yang **seluruhnya ditulis dengan Rust**:
antarmuka digambar langsung ke permukaan OpenGL oleh `egui`, bukan HTML/CSS/JS di
dalam WebView. Tidak ada Java atau Kotlin di dalam APK (`android:hasCode="0"`).

Ini versi alternatif dari pembungkus Tauri di `src-tauri/`. Keduanya memakai
materi yang sama dan bisa dibangun berdampingan; versi web/PWA tidak terpengaruh.

| | Tauri (`src-tauri/`) | Rust murni (`android-rs/`) |
| --- | --- | --- |
| Tampilan | HTML/CSS/JS di WebView | Digambar langsung oleh `egui` |
| Ukuran APK | ~17 MB | ~2,7 MB (satu ABI) / ~12 MB (empat ABI) |
| Butuh Java/Kotlin | Ya (Gradle) | Tidak (`cargo-apk`) |
| Teks ke suara (TTS) | Ya, mesin Korea bawaan | Belum ada |
| Font Korea | Font sistem | Nanum Gothic ditanam (OFL) |

## Yang perlu dipasang

- **Rust** dengan `cargo` (`rustup`), versi 1.85 atau lebih baru.
- **Android SDK** dengan `platforms;android-34` dan `build-tools;34.0.0`.
- **Android NDK** (diuji dengan 27.0.12077973).
- **JDK 17** - dipakai `cargo-apk` untuk menjalankan `aapt2`, `zipalign`, dan
  `apksigner`. Java tidak ikut masuk ke dalam APK.
- **cargo-apk**:

  ```
  cargo install cargo-apk --version 0.10.0
  ```

Setel `ANDROID_HOME`, `ANDROID_NDK_HOME`, dan `JAVA_HOME` bila lokasinya tidak
standar. Skrip build mencari lokasi umum secara otomatis.

## Membangun APK

```
powershell -ExecutionPolicy Bypass -File tools/build-rust-apk.ps1
```

Atau lewat npm:

```
npm run android:rust:build
```

Hasilnya:

```
android-rs/target/release/apk/korean-grammar-rust.apk
```

Pilihan lain:

```
# hanya satu ABI (jauh lebih cepat)
powershell -ExecutionPolicy Bypass -File tools/build-rust-apk.ps1 -Target aarch64-linux-android

# build debug (tanpa optimasi, APK besar)
powershell -ExecutionPolicy Bypass -File tools/build-rust-apk.ps1 -Debug
```

APK bawaan berisi empat ABI: `arm64-v8a`, `armeabi-v7a`, `x86`, dan `x86_64`.
Untuk dibagikan, `arm64-v8a` saja sudah mencakup hampir semua HP Android modern.

Skrip build menulis ulang `android-rs/.cargo/config.toml` dengan path linker NDK
di mesin ini, jadi berkas itu tidak di-commit dan tidak perlu disunting manual.

## Tanda tangan

Sama seperti versi Tauri: `cargo-apk` membaca `CARGO_APK_RELEASE_KEYSTORE` dan
`CARGO_APK_RELEASE_KEYSTORE_PASSWORD`. Skrip build mengisinya sendiri dari
`.keystore/keystore.properties`.

Pakai keystore yang sama dengan versi Tauri supaya APK baru bisa dipasang
sebagai pembaruan, bukan aplikasi terpisah. `package` di `Cargo.toml`
(`com.rifqilubis.koreangrammar`) juga harus sama.

Bila keystore tidak ada, APK tetap terbangun tetapi tidak bertanda tangan rilis,
sehingga tidak bisa dipasang menimpa versi sebelumnya.

## Mencoba tanpa HP

Ada pratinjau desktop yang memakai kode tampilan yang sama:

```
cd android-rs
cargo run --release --example desktop
```

Layar awal bisa dipilih lewat variabel lingkungan - berguna untuk mengambil
tangkapan layar tanpa mengklik:

```
$env:KG_SCREEN="lesson"; $env:KG_TOPIC="2"; cargo run --release --example desktop
$env:KG_SCREEN="result"; cargo run --release --example desktop
$env:KG_THEME="light";   cargo run --release --example desktop
```

Nilai `KG_SCREEN`: `home`, `lesson`, `writing`, `quiz`, `result`.

## Pengujian

```
cd android-rs
cargo test --release
```

Uji berjalan tanpa jendela dan tanpa HP. Yang diperiksa:

- materi termuat utuh - 10 topik, 82 soal, 32 latihan menulis, semua soal punya
  kunci jawaban yang sah dan pembahasan;
- kelima layar bisa digambar untuk **setiap** topik tanpa panic;
- alur kuis dari soal pertama sampai layar hasil;
- pergantian tema terang/gelap;
- pencocokan jawaban latihan menulis;
- tata letak pada layar sangat sempit (280x420) tidak panic.

## Materi

Materi tidak ditulis ulang. Sumber tunggalnya tetap `tools/data-final.js`:

```
npm run data        # js/data.js  -> tools/data-final.js (versi web)
npm run rust:data   # js/data.js  -> android-rs/src/data.json (versi Rust)
```

`data.json` ditanam ke dalam biner dengan `include_str!`, jadi aplikasi tidak
membaca berkas apa pun saat berjalan dan tetap utuh tanpa internet.

Huruf Korea juga ditanam: `android-rs/fonts/NanumGothic-Regular.ttf` (2 MB,
lisensi OFL) lewat `include_bytes!`. Ini sebabnya `.so` berukuran ~6,8 MB
walaupun kodenya sendiri kecil. Font bawaan sistem Android tidak dipakai karena
tidak seragam antar perangkat.

## Struktur berkas

```
android-rs/
  Cargo.toml            # dependensi, metadata Android (paket, ikon, minSdk)
  .cargo/config.toml    # linker NDK - ditulis ulang skrip build, tidak di-commit
  res/mipmap-*/         # ikon peluncur, satu ukuran per densitas
  fonts/                # Nanum Gothic + lisensi OFL
  examples/desktop.rs   # pratinjau desktop
  src/lib.rs            # titik masuk, android_main
  src/ui.rs             # seluruh antarmuka: 5 layar
  src/theme.rs          # palet terang/gelap
  src/data.rs           # model materi (serde)
  src/quiz.rs           # sesi kuis: pengacakan, penilaian
  src/progress.rs       # simpan/muat progres
  src/data.json         # materi hasil generate
  tests/app.rs          # uji tanpa jendela
```

## Progres pengguna

Disimpan sebagai `progress.json` di direktori data aplikasi. Berisi topik yang
sudah tuntas, nilai kuis terbaik, jumlah soal dijawab, dan pilihan tema.

## Catatan teknis

- `eframe`/`egui` 0.37 dengan backend `glow` dan fitur `android-native-activity`.
- Activity yang dipakai adalah `android.app.NativeActivity` bawaan Android,
  tanpa kode Java. `lib_name` menunjuk ke `libkorean_grammar.so`.
- `minSdkVersion 24` (Android 7.0), `targetSdkVersion 34`.
- `versionCode` dihitung `cargo-apk` dari versi crate:
  `apk_id << 24 | major << 16 | minor << 8 | patch`. Untuk `2.0.0` hasilnya
  `16908288` - ini normal, bukan kesalahan.
- Ikon yang tidak ada di font tidak dipakai. Karakter yang aman:
  `● ○ ★ ☆ × √ ← → · — – … ‹ › ▶`. Emoji seperti `💡 🔊 ✓` akan tampil sebagai
  kotak kosong, jadi diganti teks atau simbol di atas.
- Tombol pelafalan (TTS) belum berfungsi di versi ini; yang muncul adalah
  keterangan bahwa pelafalan belum tersedia.
