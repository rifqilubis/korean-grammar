//! Uji tanpa jendela: menggambar setiap layar dan menjalankan alur kuis
//! sampai selesai, memastikan tidak ada panic dan materi termuat utuh.
//!
//! Dijalankan dengan `cargo test`. Ini satu-satunya cara memeriksa aplikasi
//! tanpa perangkat Android.

use eframe::egui;

fn app() -> korean_grammar::ui::App {
    let ctx = egui::Context::default();
    korean_grammar::ui::App::from_ctx(&ctx)
}

/// Jalankan satu bingkai penuh pada ukuran layar HP.
fn frame(ctx: &egui::Context, app: &mut korean_grammar::ui::App) {
    let input = egui::RawInput {
        screen_rect: Some(egui::Rect::from_min_size(
            egui::Pos2::ZERO,
            egui::vec2(412.0, 915.0),
        )),
        ..Default::default()
    };
    let _ = ctx.run_ui(input, |ui| app.draw(ui));
}

#[test]
fn data_termuat_utuh() {
    let bank = korean_grammar::data::Bank::load();
    assert_eq!(bank.len(), 10, "jumlah topik harus 10");
    assert_eq!(bank.total_questions(), 82, "jumlah soal harus 82");

    let latihan: usize = bank.topics.iter().map(|t| t.lat.len()).sum();
    assert_eq!(latihan, 32, "jumlah latihan menulis harus 32");

    // Setiap soal harus punya jawaban yang sah dan pembahasan.
    for t in &bank.topics {
        assert!(!t.title.is_empty(), "judul topik kosong: {}", t.id);
        assert!(!t.blocks.is_empty(), "blok kosong: {}", t.id);
        for q in &t.quiz {
            assert!(q.answer < q.options.len(), "answer di luar batas: {}", q.q);
            assert!(!q.why.is_empty(), "pembahasan kosong: {}", q.q);
            assert!(q.options.len() >= 2, "pilihan terlalu sedikit: {}", q.q);
        }
    }

    // Huruf Korea harus benar-benar ada di data (bukan mojibake).
    let hangul = bank
        .topics
        .iter()
        .flat_map(|t| t.title.chars())
        .filter(|c| ('\u{AC00}'..='\u{D7A3}').contains(c))
        .count();
    assert!(hangul > 0, "tidak ada huruf Hangul di judul topik");
}

#[test]
fn semua_layar_bisa_digambar() {
    let ctx = egui::Context::default();
    let mut app = app();

    // Beranda beberapa bingkai (font perlu satu lintasan untuk dimuat).
    for _ in 0..3 {
        frame(&ctx, &mut app);
    }

    // Materi, latihan menulis, kuis, dan hasil untuk SETIAP topik.
    for idx in 0..10 {
        app.open_topic(idx);
        for _ in 0..2 {
            frame(&ctx, &mut app);
        }

        app.start_writing();
        for _ in 0..2 {
            frame(&ctx, &mut app);
        }

        app.start_quiz(0.0);
        for _ in 0..2 {
            frame(&ctx, &mut app);
        }
    }
}

#[test]
fn alur_kuis_menjawab_semua_soal() {
    let ctx = egui::Context::default();
    let mut app = app();
    frame(&ctx, &mut app);

    app.open_topic(0);
    app.start_quiz(0.0);
    frame(&ctx, &mut app);

    // Jawab semua soal dengan pilihan pertama, lalu lanjut sampai selesai.
    let total = app.quiz_total();
    assert!(total > 0, "sesi kuis tidak punya soal");

    for _ in 0..total {
        app.debug_answer(0);
        frame(&ctx, &mut app);
        app.debug_next(1.0);
        frame(&ctx, &mut app);
    }

    assert!(app.is_finished(), "kuis tidak selesai setelah semua soal");
    assert!(app.screen_is_result(), "layar tidak berpindah ke hasil");
}

#[test]
fn tema_bisa_diganti() {
    let ctx = egui::Context::default();
    let mut app = app();
    frame(&ctx, &mut app);

    let awal = app.mode_dark();
    app.debug_toggle_theme(&ctx);
    frame(&ctx, &mut app);
    assert_ne!(awal, app.mode_dark(), "tema tidak berubah");

    app.debug_toggle_theme(&ctx);
    frame(&ctx, &mut app);
    assert_eq!(awal, app.mode_dark(), "tema tidak kembali");
}

#[test]
fn latihan_menulis_mencocokkan_jawaban() {
    let ctx = egui::Context::default();
    let mut app = app();
    frame(&ctx, &mut app);

    app.open_topic(0);
    app.start_writing();
    frame(&ctx, &mut app);

    // Isi jawaban persis seperti kunci, lalu pastikan dianggap benar.
    let jumlah = app.lat_count();
    assert!(jumlah > 0, "topik ini tidak punya latihan menulis");
    for i in 0..jumlah {
        app.debug_fill_lat(i);
    }
    assert_eq!(app.lat_benar(), jumlah, "jawaban benar tidak terdeteksi");

    // Jawaban yang salah harus terdeteksi salah.
    app.debug_fill_lat_wrong(0);
    assert!(app.lat_benar() < jumlah, "jawaban salah dianggap benar");
}

#[test]
fn ukuran_layar_kecil_tidak_panic() {
    let ctx = egui::Context::default();
    let mut app = app();

    // Layar sangat sempit (mis. HP lama atau mode terbagi).
    let input = egui::RawInput {
        screen_rect: Some(egui::Rect::from_min_size(
            egui::Pos2::ZERO,
            egui::vec2(280.0, 420.0),
        )),
        ..Default::default()
    };
    for _ in 0..3 {
        let _ = ctx.run_ui(input.clone(), |ui| app.draw(ui));
    }
}
