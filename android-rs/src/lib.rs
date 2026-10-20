//! 한국어 문법 — aplikasi belajar tata bahasa Korea.
//!
//! Seluruh aplikasi ditulis dengan Rust: tidak ada HTML, CSS, JavaScript,
//! maupun WebView. Antarmuka digambar langsung oleh `egui` di atas OpenGL
//! lewat `eframe`, dan materi disimpan sebagai data Rust yang dikompilasi
//! masuk ke dalam berkas biner.

pub mod data;
pub mod progress;
pub mod quiz;
pub mod theme;
pub mod ui;

use eframe::egui;

/// Titik masuk aplikasi untuk semua platform.
///
/// Di Android, `eframe` memanggil fungsi ini dari `android_main` dengan
/// `AndroidApp` milik Activity native. Di desktop dipanggil dari `main`.
pub fn run(android_app: Option<AndroidAppHandle>) {
    // Di desktop variabel ini tidak perlu diubah, jadi `mut` hanya dipakai
    // saat kompilasi untuk Android.
    #[cfg_attr(not(target_os = "android"), allow(unused_mut))]
    let mut options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default()
            .with_inner_size([430.0, 880.0])
            .with_min_inner_size([320.0, 480.0])
            .with_title("한국어 문법"),
        ..Default::default()
    };

    #[cfg(target_os = "android")]
    {
        options.android_app = android_app;
    }
    #[cfg(not(target_os = "android"))]
    {
        let _ = android_app;
    }

    let _ = eframe::run_native(
        "Korean Grammar",
        options,
        Box::new(|cc| Ok(Box::new(ui::App::new(cc)))),
    );
}

/// Alias supaya tanda tangan `run` sama di semua platform tanpa
/// menyebar `#[cfg]` ke berkas lain.
#[cfg(target_os = "android")]
pub type AndroidAppHandle = winit::platform::android::activity::AndroidApp;

#[cfg(not(target_os = "android"))]
pub type AndroidAppHandle = ();

// ---------------------------------------------------------------- Android
#[cfg(target_os = "android")]
#[no_mangle]
fn android_main(app: winit::platform::android::activity::AndroidApp) {
    // Log Android (logcat) supaya pesan panic/error terlihat saat uji di HP.
    android_logger::init_once(
        android_logger::Config::default()
            .with_max_level(log::LevelFilter::Info)
            .with_tag("KoreanGrammar"),
    );
    run(Some(app));
}
