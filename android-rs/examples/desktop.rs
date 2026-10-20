//! Contoh aplikasi desktop.
//!
//! Berguna untuk mencoba antarmuka tanpa memasang APK ke HP:
//!     cargo run --release --example desktop
//!
//! Kode yang digambar sama persis dengan yang berjalan di Android.
//!
//! Untuk memeriksa satu layar tertentu (mis. saat mengambil tangkapan layar),
//! layar awal bisa dipilih lewat variabel lingkungan:
//!
//!     KG_SCREEN=lesson KG_TOPIC=2 cargo run --release --example desktop
//!     KG_SCREEN=result KG_TOPIC=0 cargo run --release --example desktop
//!     KG_THEME=light   cargo run --release --example desktop
//!
//! Nilai `KG_SCREEN`: `home`, `lesson`, `writing`, `quiz`, `result`.

fn main() -> eframe::Result<()> {
    let options = eframe::NativeOptions {
        viewport: eframe::egui::ViewportBuilder::default()
            .with_inner_size([430.0, 900.0])
            .with_min_inner_size([320.0, 480.0])
            .with_title("한국어 문법"),
        ..Default::default()
    };

    eframe::run_native(
        "Korean Grammar",
        options,
        Box::new(|cc| {
            let mut app = korean_grammar::ui::App::new(cc);

            if let Ok(screen) = std::env::var("KG_SCREEN") {
                let topic = std::env::var("KG_TOPIC")
                    .ok()
                    .and_then(|v| v.parse::<usize>().ok())
                    .unwrap_or(0);

                match screen.as_str() {
                    "lesson" => app.open_topic(topic),
                    "writing" => {
                        app.open_topic(topic);
                        app.start_writing();
                    }
                    "quiz" => {
                        app.open_topic(topic);
                        app.start_quiz(0.0);
                        // KG_ANSWER=1 menjawab soal pertama supaya warna
                        // benar/salah dan pembahasannya bisa diperiksa.
                        if std::env::var("KG_ANSWER").is_ok() {
                            app.debug_answer(0);
                        }
                    }
                    "result" => {
                        app.open_topic(topic);
                        app.start_quiz(0.0);
                        // Jawab semua soal dengan pilihan pertama, lalu masuk
                        // ke layar hasil.
                        for _ in 0..app.quiz_total() {
                            app.debug_answer(0);
                            app.debug_next(1.0);
                        }
                    }
                    _ => {}
                }
            }

            if std::env::var("KG_THEME").as_deref() == Ok("light") {
                app.toggle_theme(&cc.egui_ctx);
            }

            Ok(Box::new(app))
        }),
    )
}
