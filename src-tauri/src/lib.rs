// =====================================================================
// 한국어 문법 — Tauri 2 shell (Rust)
//
// Lapisan Rust sengaja tipis: tugasnya hanya membungkus aplikasi web
// (HTML/CSS/JS) yang sudah ada menjadi aplikasi Android/desktop asli,
// dan menyediakan mesin suara (TTS) native untuk pelafalan Korea.
// Semua materi, kuis, dan progres tetap dijalankan oleh js/app.js.
// =====================================================================

use serde::Serialize;

/// Info singkat tentang shell native. Dipakai UI untuk menampilkan versi
/// aplikasi saat berjalan sebagai aplikasi terpasang (bukan di browser).
#[derive(Serialize)]
pub struct AppInfo {
    pub name: String,
    pub version: String,
    /// "android" | "ios" | "windows" | "macos" | "linux"
    pub platform: String,
    /// true bila berjalan di dalam shell native Tauri.
    pub native: bool,
}

#[tauri::command]
fn app_info() -> AppInfo {
    AppInfo {
        name: "한국어 문법".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        platform: std::env::consts::OS.to_string(),
        native: true,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Pelafalan contoh kalimat Korea memakai mesin suara bawaan sistem
        // (TextToSpeech di Android, WinRT/SAPI di Windows, AVSpeech di iOS).
        .plugin(tauri_plugin_tts::init())
        .invoke_handler(tauri::generate_handler![app_info])
        .run(tauri::generate_context!())
        .expect("gagal menjalankan aplikasi 한국어 문법");
}
