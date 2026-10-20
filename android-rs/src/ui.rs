//! Antarmuka aplikasi — digambar langsung dengan `egui`, tanpa WebView.
//!
//! Lima layar mengikuti versi web: beranda, materi, latihan menulis, kuis,
//! dan hasil beserta pembahasan.

use eframe::egui::{
    self, Align, Color32, CornerRadius, FontData, FontDefinitions, FontFamily, FontId, Layout,
    Margin, RichText, ScrollArea, Stroke, TextEdit, Vec2,
};

use crate::data::{level_name, Bank, Block};
use crate::progress::Progress;
use crate::quiz::{format_duration, headline, QuizSession};
use crate::theme::{self, Mode, Palette};

/// Huruf Korea, ditanam di dalam biner. Lisensi OFL (lihat fonts/OFL.txt).
const FONT_KO: &[u8] = include_bytes!("../fonts/NanumGothic-Regular.ttf");

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Screen {
    Home,
    Lesson,
    Writing,
    Quiz,
    Result,
}

pub struct App {
    bank: Bank,
    progress: Progress,
    mode: Mode,
    /// Mode yang paletnya sudah terpasang, supaya `apply` tidak dipanggil
    /// ulang setiap bingkai.
    applied_mode: Option<Mode>,
    screen: Screen,

    /// Topik yang sedang dibuka.
    topic_idx: usize,
    /// Minta daftar digulir ke atas saat layar berganti.
    scroll_top: bool,

    /// Latihan menulis: isian per baris dan mode tampilkan jawaban.
    lat_inputs: Vec<String>,
    lat_reveal: bool,

    /// Sesi kuis aktif.
    quiz: Option<QuizSession>,
    /// Benih pengacakan, berubah tiap sesi supaya urutan soal tidak selalu sama.
    seed: u64,
}

impl App {
    pub fn new(cc: &eframe::CreationContext<'_>) -> Self {
        Self::from_ctx(&cc.egui_ctx)
    }

    /// Membangun aplikasi dari `Context` saja. Dipakai `App::new` dan juga
    /// pengujian tanpa jendela.
    pub fn from_ctx(ctx: &egui::Context) -> Self {
        install_fonts(ctx);

        let bank = Bank::load();
        let progress = Progress::load();
        let mode = progress
            .theme
            .as_deref()
            .map(Mode::from_key)
            .unwrap_or(Mode::Dark);

        theme::apply(ctx, mode.palette());

        Self {
            bank,
            progress,
            mode,
            applied_mode: Some(mode),
            screen: Screen::Home,
            topic_idx: 0,
            scroll_top: true,
            lat_inputs: Vec::new(),
            lat_reveal: false,
            quiz: None,
            seed: 0x9E37_79B9_7F4A_7C15,
        }
    }

    fn p(&self) -> &'static Palette {
        self.mode.palette()
    }

    fn goto(&mut self, screen: Screen) {
        self.screen = screen;
        self.scroll_top = true;
    }

    /// Buka materi sebuah topik.
    pub fn open_topic(&mut self, idx: usize) {
        self.topic_idx = idx;
        self.lat_inputs.clear();
        self.lat_reveal = false;
        self.goto(Screen::Lesson);
    }

    /// Mulai kuis untuk topik aktif.
    pub fn start_quiz(&mut self, now: f64) {
        let Some(t) = self.bank.get(self.topic_idx) else {
            return;
        };
        let mut s = QuizSession::new(&t.id, &t.title, &t.icon, t.quiz.len(), None, now);
        self.seed = self
            .seed
            .wrapping_mul(6_364_136_223_846_793_005)
            .wrapping_add(1_442_695_040_888_963_407);
        s.shuffle(self.seed);
        self.quiz = Some(s);
        self.goto(Screen::Quiz);
    }

    /// Siapkan latihan menulis untuk topik aktif.
    pub fn start_writing(&mut self) {
        let n = self
            .bank
            .get(self.topic_idx)
            .map(|t| t.lat.len())
            .unwrap_or(0);
        self.lat_inputs = vec![String::new(); n];
        self.lat_reveal = false;
        self.goto(Screen::Writing);
    }

    pub fn toggle_theme(&mut self, ctx: &egui::Context) {
        self.mode = self.mode.toggled();
        theme::apply(ctx, self.p());
        self.applied_mode = Some(self.mode);
        self.progress.theme = Some(self.mode.as_key().to_string());
        self.progress.save();
    }
}

/// Daftarkan huruf Korea yang ditanam di dalam biner.
fn install_fonts(ctx: &egui::Context) {
    let mut fonts = FontDefinitions::default();

    fonts.font_data.insert(
        "nanum".to_owned(),
        std::sync::Arc::new(FontData::from_static(FONT_KO)),
    );

    // Nanum Gothic mencakup Latin + Hangul, jadi dipakai sebagai huruf utama.
    // Huruf bawaan egui tetap disimpan sebagai cadangan untuk lambang lain.
    fonts
        .families
        .entry(FontFamily::Proportional)
        .or_default()
        .insert(0, "nanum".to_owned());
    fonts
        .families
        .entry(FontFamily::Monospace)
        .or_default()
        .push("nanum".to_owned());

    ctx.set_fonts(fonts);
}

// --------------------------------------------------------------- utilitas UI

fn muted(text: impl Into<String>, p: &Palette) -> RichText {
    RichText::new(text.into()).color(p.text_dim).size(13.5)
}

/// Kartu selebar halaman.
///
/// `egui::Frame` menyusut mengikuti isinya, jadi kartu berisi teks pendek akan
/// tampak lebih sempit daripada kartu lain di halaman yang sama. Helper ini
/// memberi lebar minimum sebesar lebar yang tersedia supaya semua kartu rata.
fn card_ui<R>(
    ui: &mut egui::Ui,
    p: &Palette,
    add: impl FnOnce(&mut egui::Ui) -> R,
) -> egui::InnerResponse<R> {
    let width = ui.available_width();
    theme::card(p).show(ui, |ui| {
        ui.set_min_width(width - 32.0);
        add(ui)
    })
}

/// Tombol utama dengan warna aksen penuh.
fn primary_button(ui: &mut egui::Ui, label: &str, p: &Palette) -> egui::Response {
    let btn = egui::Button::new(RichText::new(label).color(Color32::WHITE).size(15.5).strong())
        .fill(p.accent)
        .corner_radius(CornerRadius::same(12))
        .min_size(Vec2::new(ui.available_width(), 46.0));
    ui.add(btn)
}

/// Tombol sekunder bergaris tepi.
fn ghost_button(ui: &mut egui::Ui, label: &str, p: &Palette) -> egui::Response {
    let btn = egui::Button::new(RichText::new(label).color(p.text).size(15.5))
        .fill(p.surface_alt)
        .stroke(Stroke::new(1.0, p.border))
        .corner_radius(CornerRadius::same(12))
        .min_size(Vec2::new(ui.available_width(), 44.0));
    ui.add(btn)
}

/// Tombol ikon kecil (tema, tutup).
fn icon_button(ui: &mut egui::Ui, glyph: &str, p: &Palette) -> egui::Response {
    let btn = egui::Button::new(RichText::new(glyph).size(17.0).color(p.text))
        .fill(p.surface_alt)
        .stroke(Stroke::new(1.0, p.border))
        .corner_radius(CornerRadius::same(10))
        .min_size(Vec2::new(38.0, 36.0));
    ui.add(btn)
}

/// Kotak statistik kecil (nilai besar + label).
fn stat_box(ui: &mut egui::Ui, value: &str, label: &str, p: &Palette) {
    egui::Frame::NONE
        .fill(p.surface_alt)
        .corner_radius(CornerRadius::same(12))
        .inner_margin(Margin::same(9))
        .show(ui, |ui| {
            // Isi kotak mengikuti lebar kolom yang diberikan `ui.columns`,
            // dikurangi margin dalam bingkai di atas.
            ui.set_width(ui.available_width());
            ui.vertical_centered(|ui| {
                ui.label(RichText::new(value).size(18.0).strong().color(p.accent));
                ui.label(RichText::new(label).size(11.0).color(p.text_dim));
            });
        });
}

/// Satu baris berisi beberapa kotak statistik dengan lebar sama.
fn stat_row(ui: &mut egui::Ui, items: &[(&str, &str)], p: &Palette) {
    if items.is_empty() {
        return;
    }
    // `ui.columns` membagi lebar yang tersedia secara merata, jadi kotak
    // tidak akan meluber melewati tepi kanan layar.
    ui.columns(items.len(), |cols| {
        for (col, (value, label)) in cols.iter_mut().zip(items.iter()) {
            stat_box(col, value, label, p);
        }
    });
}

/// Pembungkus halaman: margin layar HP dan lebar maksimum di layar lebar.
fn page<R>(ui: &mut egui::Ui, add: impl FnOnce(&mut egui::Ui) -> R) -> R {
    let avail = ui.available_width();
    // Di layar sempit margin 14 px per sisi; di layar lebar konten dibatasi
    // 560 px lalu dipusatkan.
    let pad = if avail > 588.0 {
        (avail - 560.0) * 0.5
    } else {
        14.0_f32.min(avail * 0.05)
    };
    let width = (avail - pad * 2.0).clamp(120.0, 560.0);

    // Lebar harus diberikan eksplisit: `Ui` anak di dalam tata letak
    // horizontal tidak dibatasi lebarnya, sehingga `Label::wrap()` tidak tahu
    // harus membungkus di mana dan teks akan meluber ke luar layar.
    ui.horizontal_top(|ui| {
        ui.add_space(pad);
        ui.allocate_ui_with_layout(
            Vec2::new(width, 0.0),
            Layout::top_down(Align::Min),
            |ui| {
                ui.set_max_width(width);
                add(ui)
            },
        )
        .inner
    })
    .inner
}

// ------------------------------------------------------------------ render

impl eframe::App for App {
    fn ui(&mut self, ui: &mut egui::Ui, _frame: &mut eframe::Frame) {
        self.draw(ui);
    }
}

impl App {
    /// Menggambar satu bingkai penuh. Dipisah dari `eframe::App::ui` supaya
    /// bisa dijalankan tanpa jendela saat pengujian.
    pub fn draw(&mut self, ui: &mut egui::Ui) {
        let ctx = ui.ctx().clone();
        let now = ctx.input(|i| i.time);

        // Tema hanya dipasang ulang saat benar-benar berubah.
        if self.applied_mode != Some(self.mode) {
            theme::apply(&ctx, self.p());
            self.applied_mode = Some(self.mode);
        }

        let p = self.p();

        // ---------------------------------------------------------- bilah atas
        egui::Panel::top("topbar")
            .show_separator_line(false)
            .frame(
                egui::Frame::NONE
                    .fill(p.surface)
                    .stroke(Stroke::new(1.0, p.border))
                    .inner_margin(Margin {
                        left: 16,
                        right: 16,
                        top: 8,
                        bottom: 8,
                    }),
            )
            .show(ui, |ui| {
                ui.horizontal(|ui| {
                    ui.label(RichText::new("한국어").size(19.0).color(p.accent).strong());
                    ui.label(RichText::new("문법").size(19.0).color(p.text).strong());
                    ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                        let glyph = if self.mode.is_dark() { "★" } else { "☆" };
                        if icon_button(ui, glyph, p)
                            .on_hover_text("Ganti tema terang/gelap")
                            .clicked()
                        {
                            self.toggle_theme(&ctx);
                        }
                    });
                });
            });

        // ------------------------------------------------------------- isi
        egui::CentralPanel::default()
            .frame(egui::Frame::NONE.fill(p.bg))
            .show(ui, |ui| {
                let mut area = ScrollArea::vertical().auto_shrink([false, false]);
                if self.scroll_top {
                    area = area.vertical_scroll_offset(0.0);
                    self.scroll_top = false;
                }
                area.show(ui, |ui| {
                    page(ui, |ui| match self.screen {
                        Screen::Home => self.home(ui),
                        Screen::Lesson => self.lesson(ui),
                        Screen::Writing => self.writing(ui),
                        Screen::Quiz => self.quiz_screen(ui, now),
                        Screen::Result => self.result(ui, now),
                    });
                });
            });
    }
}

impl App {
    // ------------------------------------------------------------- beranda
    fn home(&mut self, ui: &mut egui::Ui) {
        let p = self.p();
        ui.add_space(10.0);

        let total_topics = self.bank.len();
        let done = self.progress.done.len().min(total_topics);
        let avg = self
            .progress
            .average_score()
            .map(|v| format!("{v}%"))
            .unwrap_or_else(|| "–".to_string());
        let answered = self.progress.total_answered();
        let next = self
            .bank
            .topics
            .iter()
            .position(|t| !self.progress.is_done(&t.id))
            .unwrap_or(0);

        card_ui(ui, p, |ui| {
            ui.label(muted("안녕하세요! Mulai dari sini", p));
            ui.add_space(2.0);
            ui.add(
                egui::Label::new(RichText::new("Grammar Korea untuk pemula").size(22.0).strong())
                    .wrap(),
            );
            ui.add_space(6.0);
            ui.add(
                egui::Label::new(
                    RichText::new(
                        "10 topik dari nol sampai bisa menyusun kalimat sendiri. \
                         Baca materinya, lalu uji pemahaman dengan kuis pilihan ganda.",
                    )
                    .size(14.5)
                    .color(p.text_dim),
                )
                .wrap(),
            );

            ui.add_space(14.0);
            stat_row(
                ui,
                &[
                    (&format!("{done}/{total_topics}"), "topik tuntas"),
                    (&avg, "rata-rata kuis"),
                    (&answered.to_string(), "soal dijawab"),
                ],
                p,
            );

            ui.add_space(14.0);
            let label = if total_topics > 0 && done >= total_topics {
                "Ulangi dari topik 1".to_string()
            } else {
                format!("Lanjut ke topik {}", next + 1)
            };
            if primary_button(ui, &label, p).clicked() {
                self.open_topic(next);
            }

            if done > 0 {
                ui.add_space(8.0);
                if ghost_button(ui, "Hapus progres", p).clicked() {
                    self.progress.reset();
                }
            }
        });

        ui.add_space(20.0);
        ui.label(RichText::new("Daftar materi").size(18.0).strong());
        ui.add_space(8.0);

        let mut open: Option<usize> = None;
        for (i, t) in self.bank.topics.iter().enumerate() {
            let is_done = self.progress.is_done(&t.id);
            let best = self.progress.best.get(&t.id).copied();

            let resp = card_ui(ui, p, |ui| {
                    ui.horizontal(|ui| {
                        egui::Frame::NONE
                            .fill(p.surface_alt)
                            .corner_radius(CornerRadius::same(12))
                            .inner_margin(Margin::symmetric(12, 7))
                            .show(ui, |ui| {
                                ui.label(RichText::new(&t.icon).size(21.0).color(p.accent));
                            });

                        ui.vertical(|ui| {
                            ui.label(muted(
                                format!("Topik {} · {}", t.no, level_name(t.level)),
                                p,
                            ));
                            ui.label(RichText::new(&t.title).size(15.5).strong());
                            ui.label(RichText::new(&t.title_id).size(12.5).color(p.text_dim));
                        });

                        ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                            if is_done {
                                ui.label(RichText::new("√").size(17.0).color(p.ok));
                            }
                            if let Some(b) = best {
                                ui.label(muted(format!("{b}%"), p));
                            }
                        });
                    });
                })
                .response
                .interact(egui::Sense::click());

            if resp.hovered() {
                ui.ctx().set_cursor_icon(egui::CursorIcon::PointingHand);
            }
            if resp.clicked() {
                open = Some(i);
            }
            ui.add_space(8.0);
        }
        if let Some(i) = open {
            self.open_topic(i);
        }

        ui.add_space(4.0);
        ui.add(
            egui::Label::new(muted(
                "Progres disimpan otomatis di perangkat ini. Aplikasi bisa dipakai tanpa internet.",
                p,
            ))
            .wrap(),
        );
        ui.add_space(16.0);
    }

    // -------------------------------------------------------------- materi
    fn lesson(&mut self, ui: &mut egui::Ui) {
        let p = self.p();
        let Some(topic) = self.bank.get(self.topic_idx).cloned() else {
            self.goto(Screen::Home);
            return;
        };
        let idx = self.topic_idx;

        // Membaca materi sampai selesai dianggap tuntas.
        if !self.progress.is_done(&topic.id) {
            self.progress.mark_done(&topic.id);
            self.progress.save();
        }

        ui.add_space(8.0);
        if ui
            .link(RichText::new("‹ Kembali ke daftar").size(14.0))
            .clicked()
        {
            self.goto(Screen::Home);
            return;
        }
        ui.add_space(10.0);

        ui.horizontal(|ui| {
            egui::Frame::NONE
                .fill(p.surface_alt)
                .corner_radius(CornerRadius::same(14))
                .inner_margin(Margin::symmetric(14, 9))
                .show(ui, |ui| {
                    ui.label(RichText::new(&topic.icon).size(25.0).color(p.accent));
                });
            ui.vertical(|ui| {
                ui.label(muted(
                    format!("Topik {} · {}", topic.no, level_name(topic.level)),
                    p,
                ));
                ui.add(
                    egui::Label::new(RichText::new(&topic.title).size(21.0).strong()).wrap(),
                );
                ui.label(muted(&topic.title_id, p));
            });
        });

        ui.add_space(12.0);
        card_ui(ui, p, |ui| {
            ui.add(
                egui::Label::new(RichText::new(&topic.intro).size(14.5).color(p.text_dim)).wrap(),
            );
        });

        ui.add_space(12.0);
        for block in &topic.blocks {
            self.block_ui(ui, block);
            ui.add_space(10.0);
        }

        ui.add_space(10.0);
        let now = ui.ctx().input(|i| i.time);
        if primary_button(ui, "Kerjakan kuis topik ini", p).clicked() {
            self.start_quiz(now);
            return;
        }
        if !topic.lat.is_empty() {
            ui.add_space(8.0);
            if ghost_button(ui, "Latihan menulis", p).clicked() {
                self.start_writing();
                return;
            }
        }

        ui.add_space(16.0);
        ui.horizontal(|ui| {
            if idx > 0 && ui.link(RichText::new("‹ Sebelumnya").size(14.5)).clicked() {
                self.open_topic(idx - 1);
            }
            ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                if idx + 1 < self.bank.len()
                    && ui.link(RichText::new("Berikutnya ›").size(14.5)).clicked()
                {
                    self.open_topic(idx + 1);
                }
            });
        });
        ui.add_space(20.0);
    }

    /// Menggambar satu blok materi.
    fn block_ui(&self, ui: &mut egui::Ui, block: &Block) {
        let p = self.p();
        match block {
            Block::Heading { text } => {
                ui.add_space(4.0);
                ui.add(egui::Label::new(
                    RichText::new(text).size(17.0).strong().color(p.accent),
                ));
            }
            Block::Text { text } => {
                ui.add(egui::Label::new(RichText::new(text).size(14.5)).wrap());
            }
            Block::Note { text } => {
                egui::Frame::NONE
                    .fill(p.surface_alt)
                    .stroke(Stroke::new(1.0, p.border))
                    .corner_radius(CornerRadius::same(12))
                    .inner_margin(Margin::symmetric(13, 9))
                    .show(ui, |ui| {
                        ui.horizontal_top(|ui| {
                            ui.label(RichText::new("!").size(14.0));
                            ui.add(
                                egui::Label::new(
                                    RichText::new(text).size(14.0).color(p.text_dim),
                                )
                                .wrap(),
                            );
                        });
                    });
            }
            Block::Formula { parts } => {
                egui::Frame::NONE
                    .fill(p.surface_alt)
                    .stroke(Stroke::new(1.0, p.accent_dim))
                    .corner_radius(CornerRadius::same(12))
                    .inner_margin(Margin::symmetric(13, 10))
                    .show(ui, |ui| {
                        ui.label(muted("Pola kalimat", p));
                        ui.add_space(3.0);
                        for (i, part) in parts.iter().enumerate() {
                            ui.label(RichText::new(part).size(15.0).strong());
                            if i + 1 < parts.len() {
                                ui.label(muted("+", p));
                            }
                        }
                    });
            }
            Block::Rules { items } => {
                egui::Frame::NONE
                    .fill(p.surface)
                    .stroke(Stroke::new(1.0, p.border))
                    .corner_radius(CornerRadius::same(12))
                    .inner_margin(Margin::same(10))
                    .show(ui, |ui| {
                        egui::Grid::new(("rules", items.len(), items.first().map(|r| &r.a)))
                            .num_columns(3)
                            .spacing(Vec2::new(12.0, 8.0))
                            .striped(true)
                            .show(ui, |ui| {
                                for row in items {
                                    ui.label(RichText::new(&row.a).size(14.5).strong());
                                    ui.label(RichText::new(&row.b).size(14.0));
                                    ui.label(
                                        RichText::new(&row.c).size(14.0).color(p.text_dim),
                                    );
                                    ui.end_row();
                                }
                            });
                    });
            }
            Block::Examples { items } => {
                for ex in items {
                    egui::Frame::NONE
                        .fill(p.surface)
                        .stroke(Stroke::new(1.0, p.border))
                        .corner_radius(CornerRadius::same(12))
                        .inner_margin(Margin::symmetric(13, 9))
                        .show(ui, |ui| {
                            ui.horizontal(|ui| {
                                ui.label(RichText::new(&ex.ko).size(18.0));
                                ui.with_layout(
                                    Layout::right_to_left(Align::Center),
                                    |ui| {
                                        let btn = egui::Button::new(
                                            RichText::new("▶").size(13.0).color(p.text_dim),
                                        )
                                        .frame(false);
                                        ui.add(btn).on_hover_text(
                                            "Pelafalan belum tersedia di versi Rust",
                                        );
                                    },
                                );
                            });
                            if !ex.rom.is_empty() {
                                ui.label(muted(&ex.rom, p));
                            }
                            ui.label(RichText::new(&ex.id).size(14.0).color(p.text_dim));
                            if !ex.why.is_empty() {
                                ui.add(
                                    egui::Label::new(
                                        RichText::new(&ex.why)
                                            .size(12.5)
                                            .italics()
                                            .color(p.text_dim),
                                    )
                                    .wrap(),
                                );
                            }
                        });
                    ui.add_space(6.0);
                }
            }
        }
    }

    // ----------------------------------------------------- latihan menulis
    fn writing(&mut self, ui: &mut egui::Ui) {
        let p = self.p();
        let Some(topic) = self.bank.get(self.topic_idx).cloned() else {
            self.goto(Screen::Home);
            return;
        };

        ui.add_space(8.0);
        if ui
            .link(RichText::new("‹ Kembali ke materi").size(14.0))
            .clicked()
        {
            self.goto(Screen::Lesson);
            return;
        }
        ui.add_space(10.0);

        card_ui(ui, p, |ui| {
            ui.label(muted("Latihan menulis", p));
            ui.add_space(2.0);
            ui.add(egui::Label::new(RichText::new("Tulis dalam bahasa Korea").size(21.0).strong()));
            ui.add_space(4.0);
            ui.add(
                egui::Label::new(
                    RichText::new("Ketik kalimatnya, lalu cocokkan tanpa melihat romanisasi.")
                        .size(14.0)
                        .color(p.text_dim),
                )
                .wrap(),
            );
        });

        ui.add_space(12.0);

        if self.lat_inputs.len() != topic.lat.len() {
            self.lat_inputs = vec![String::new(); topic.lat.len()];
        }

        let reveal = self.lat_reveal;
        let mut benar = 0usize;
        let mut any_filled = false;

        for (i, item) in topic.lat.iter().enumerate() {
            // Ambil isian keluar sementara supaya `self` tetap bisa dibaca
            // di dalam penutup `show`.
            let mut buf = std::mem::take(&mut self.lat_inputs[i]);
            let filled = !buf.trim().is_empty();
            let ok = normalize(&buf) == normalize(&item.ko);
            if filled {
                any_filled = true;
            }
            if ok {
                benar += 1;
            }
            let n_char = item.ko.chars().count();

            card_ui(ui, p, |ui| {
                ui.horizontal(|ui| {
                    ui.label(muted(format!("{}.", i + 1), p));
                    ui.add(egui::Label::new(RichText::new(&item.id).size(15.0)).wrap());
                    ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                        if reveal {
                            ui.label(RichText::new(&item.ko).size(15.5).color(p.accent));
                        } else if filled {
                            if ok {
                                ui.label(RichText::new("√ benar").size(12.5).color(p.ok));
                            } else {
                                ui.label(RichText::new("belum tepat").size(12.5).color(p.bad));
                            }
                        }
                    });
                });

                ui.add_space(4.0);
                ui.add(
                    TextEdit::singleline(&mut buf)
                        .hint_text("tulis dalam hangul…")
                        .desired_width(f32::INFINITY)
                        .font(FontId::proportional(17.0)),
                );

                if reveal {
                    if !item.rom.is_empty() {
                        ui.label(muted(&item.rom, p));
                    }
                } else {
                    ui.label(muted(format!("{n_char} karakter"), p));
                }
            });

            self.lat_inputs[i] = buf;
            ui.add_space(8.0);
        }

        let total = topic.lat.len();
        let status = if !any_filled {
            "Isi jawabanmu untuk mulai mencocokkan.".to_string()
        } else if benar == total {
            "Semua benar! 잘했어요".to_string()
        } else {
            format!("{benar} dari {total} sudah benar.")
        };
        let all_ok = any_filled && benar == total;
        ui.label(
            RichText::new(status)
                .size(14.0)
                .color(if all_ok { p.ok } else { p.text_dim }),
        );

        ui.add_space(10.0);
        if ghost_button(
            ui,
            if reveal {
                "Sembunyikan jawaban"
            } else {
                "Tampilkan jawaban"
            },
            p,
        )
        .clicked()
        {
            self.lat_reveal = !self.lat_reveal;
        }
        ui.add_space(8.0);
        if ghost_button(ui, "Kosongkan isian", p).clicked() {
            for s in &mut self.lat_inputs {
                s.clear();
            }
            self.lat_reveal = false;
        }

        ui.add_space(16.0);
        if ghost_button(ui, "Kembali ke materi", p).clicked() {
            self.goto(Screen::Lesson);
        }
        ui.add_space(20.0);
    }

    // ----------------------------------------------------------------- kuis
    fn quiz_screen(&mut self, ui: &mut egui::Ui, now: f64) {
        let p = self.p();
        let (Some(session), Some(topic)) = (
            self.quiz.clone(),
            self.bank.get(self.topic_idx).cloned(),
        ) else {
            self.goto(Screen::Home);
            return;
        };
        let questions = topic.quiz.clone();
        let Some(q) = session.current(&questions).cloned() else {
            self.goto(Screen::Home);
            return;
        };

        let mut close = false;
        let mut answer_choice: Option<usize> = None;
        let mut advance = false;

        ui.add_space(8.0);
        ui.horizontal(|ui| {
            if icon_button(ui, "×", p)
                .on_hover_text("Keluar dari kuis")
                .clicked()
            {
                close = true;
            }
            ui.add(
                egui::Label::new(muted(
                format!("Topik {} · {}", topic.no, topic.title),
                    p,
                ))
                .truncate(),
            );
            ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                egui::Frame::NONE
                    .fill(p.surface_alt)
                    .corner_radius(CornerRadius::same(20))
                    .inner_margin(Margin::symmetric(12, 4))
                    .show(ui, |ui| {
                        ui.label(
                            RichText::new(format!("Benar {}", session.correct))
                                .size(12.5)
                                .color(p.ok),
                        );
                    });
            });
        });

        ui.add_space(10.0);

        // Bilah kemajuan.
        let frac = if session.total == 0 {
            0.0
        } else {
            (session.index + 1) as f32 / session.total as f32
        };
        let (rect, _) =
            ui.allocate_exact_size(Vec2::new(ui.available_width(), 7.0), egui::Sense::hover());
        let painter = ui.painter().clone();
        painter.rect_filled(rect, CornerRadius::same(4), p.surface_alt);
        let mut filled = rect;
        filled.set_width(rect.width() * frac);
        painter.rect_filled(filled, CornerRadius::same(4), p.accent);

        ui.add_space(14.0);

        card_ui(ui, p, |ui| {
            ui.label(muted(
                format!("Soal {} dari {}", session.index + 1, session.total),
                p,
            ));
            ui.add_space(6.0);
            ui.add(egui::Label::new(RichText::new(&q.q).size(17.5).strong()).wrap());
            ui.add_space(12.0);

            let answered = session.picked;
            for (i, opt) in q.options.iter().enumerate() {
                let is_answer = i == q.answer;
                let is_picked = answered == Some(i);

                let (stroke_col, text_col) = match answered {
                    None => (p.border, p.text),
                    Some(_) if is_answer => (p.ok, p.ok),
                    Some(_) if is_picked => (p.bad, p.bad),
                    _ => (p.border, p.text_dim),
                };

                let btn = egui::Button::new(
                    RichText::new(format!("{}.  {}", i + 1, opt))
                        .size(15.0)
                        .color(text_col),
                )
                .fill(p.surface_alt)
                .stroke(Stroke::new(1.5, stroke_col))
                .corner_radius(CornerRadius::same(12))
                .min_size(Vec2::new(ui.available_width(), 46.0));

                let resp = ui.add(btn);
                if answered.is_none() && resp.clicked() {
                    answer_choice = Some(i);
                }
                ui.add_space(6.0);
            }

            // Pembahasan setelah menjawab.
            if let Some(picked) = answered {
                ui.add_space(6.0);
                let ok = picked == q.answer;
                let full = ui.available_width();
                egui::Frame::NONE
                    .fill(p.surface_alt)
                    .stroke(Stroke::new(1.0, if ok { p.ok } else { p.bad }))
                    .corner_radius(CornerRadius::same(12))
                    .inner_margin(Margin::symmetric(13, 9))
                    .show(ui, |ui| {
                        ui.set_min_width(full - 26.0);
                        ui.label(
                            RichText::new(if ok { "√ Tepat!" } else { "× Belum tepat" })
                                .size(14.0)
                                .strong()
                                .color(if ok { p.ok } else { p.bad }),
                        );
                        ui.add(
                            egui::Label::new(
                                RichText::new(&q.why).size(13.5).color(p.text_dim),
                            )
                            .wrap(),
                        );
                    });

                ui.add_space(10.0);
                let label = if session.is_last() {
                    "Lihat hasil"
                } else {
                    "Lanjut"
                };
                if primary_button(ui, label, p).clicked() {
                    advance = true;
                }
            }
        });

        ui.add_space(10.0);
        ui.label(muted("Pintasan: 1–4 memilih jawaban · Enter melanjutkan", p));
        ui.add_space(16.0);

        // Pintasan papan ketik (berguna saat dijalankan di desktop).
        let (key_pick, enter) = ui.ctx().input(|i| {
            let mut pick = None;
            for (idx, key) in [
                egui::Key::Num1,
                egui::Key::Num2,
                egui::Key::Num3,
                egui::Key::Num4,
            ]
            .iter()
            .enumerate()
            {
                if i.key_pressed(*key) {
                    pick = Some(idx);
                }
            }
            (pick, i.key_pressed(egui::Key::Enter))
        });
        if session.picked.is_none() {
            if let Some(k) = key_pick {
                if k < q.options.len() {
                    answer_choice = Some(k);
                }
            }
        } else if enter {
            advance = true;
        }

        // Terapkan aksi setelah semua pinjaman data selesai.
        if close {
            self.quiz = None;
            self.goto(Screen::Lesson);
            return;
        }
        if let Some(choice) = answer_choice {
            if let Some(s) = &mut self.quiz {
                s.answer(&questions, choice);
            }
        }
        if advance {
            if let Some(s) = &mut self.quiz {
                if s.next(now) {
                    return;
                }
                let (id, pct, correct) = (s.topic_id.clone(), s.percent(), s.correct);
                self.progress.record_score(&id, pct);
                self.progress.add_answered(&id, correct);
                if pct >= 60 {
                    self.progress.mark_done(&id);
                }
                self.progress.save();
            }
            self.goto(Screen::Result);
        }
    }

    // ---------------------------------------------------------------- hasil
    fn result(&mut self, ui: &mut egui::Ui, now: f64) {
        let p = self.p();
        let (Some(session), Some(topic)) = (
            self.quiz.clone(),
            self.bank.get(self.topic_idx).cloned(),
        ) else {
            self.goto(Screen::Home);
            return;
        };

        let pct = session.percent();
        let wrong_count = session.wrong.len();
        let correct = session.correct;
        let elapsed = session.elapsed_secs(now);
        let mut action: Option<u8> = None;

        ui.add_space(12.0);
        card_ui(ui, p, |ui| {
            // Lingkaran skor.
            let (rect, _) =
                ui.allocate_exact_size(Vec2::new(ui.available_width(), 150.0), egui::Sense::hover());
            let center = rect.center();
            let radius = 58.0;
            let painter = ui.painter().clone();
            painter.circle_stroke(center, radius, Stroke::new(9.0, p.surface_alt));

            let start = -std::f32::consts::FRAC_PI_2;
            let sweep = std::f32::consts::TAU * (pct as f32 / 100.0);
            let steps = 72;
            let mut prev = center + Vec2::angled(start) * radius;
            for i in 1..=steps {
                let a = start + sweep * (i as f32 / steps as f32);
                let cur = center + Vec2::angled(a) * radius;
                painter.line_segment([prev, cur], Stroke::new(9.0, p.accent));
                prev = cur;
            }
            painter.text(
                center - Vec2::new(0.0, 10.0),
                egui::Align2::CENTER_CENTER,
                format!("{pct}%"),
                FontId::proportional(28.0),
                p.text,
            );
            painter.text(
                center + Vec2::new(0.0, 18.0),
                egui::Align2::CENTER_CENTER,
                format!("{correct} / {}", session.total),
                FontId::proportional(13.0),
                p.text_dim,
            );

            ui.add_space(8.0);
            ui.vertical_centered(|ui| {
                ui.label(RichText::new(headline(pct)).size(20.0).strong());
                ui.add_space(2.0);
                ui.add(
                    egui::Label::new(muted(
                        format!("Topik {} · {}", topic.no, topic.title),
                        p,
                    ))
                    .wrap(),
                );
            });

            ui.add_space(14.0);
            stat_row(
                ui,
                &[
                    (&correct.to_string(), "Benar"),
                    (&wrong_count.to_string(), "Salah"),
                    (&format_duration(elapsed), "Waktu"),
                ],
                p,
            );

            ui.add_space(14.0);
            if primary_button(ui, "Ulangi kuis", p).clicked() {
                action = Some(1);
            }
            ui.add_space(8.0);
            if ghost_button(ui, "Baca materi lagi", p).clicked() {
                action = Some(2);
            }
            if self.topic_idx + 1 < self.bank.len() {
                ui.add_space(8.0);
                if ghost_button(ui, "Topik berikutnya", p).clicked() {
                    action = Some(3);
                }
            }
        });

        // Pembahasan jawaban yang salah.
        if !session.wrong.is_empty() {
            ui.add_space(14.0);
            card_ui(ui, p, |ui| {
                ui.label(
                    RichText::new("Pembahasan jawaban yang belum tepat")
                        .size(15.0)
                        .strong(),
                );
                ui.add_space(8.0);
                for (n, (qi, picked)) in session.wrong.iter().enumerate() {
                    let Some(q) = topic.quiz.get(*qi) else {
                        continue;
                    };
                    if n > 0 {
                        ui.separator();
                        ui.add_space(4.0);
                    }
                    ui.add(egui::Label::new(RichText::new(&q.q).size(14.0)).wrap());
                    ui.label(
                        RichText::new(format!(
                            "Jawabanmu: {}",
                            q.options.get(*picked).map(String::as_str).unwrap_or("—")
                        ))
                        .size(13.0)
                        .color(p.bad),
                    );
                    ui.label(
                        RichText::new(format!(
                            "Benar: {}",
                            q.options.get(q.answer).map(String::as_str).unwrap_or("—")
                        ))
                        .size(13.0)
                        .color(p.ok),
                    );
                    ui.add(
                        egui::Label::new(RichText::new(&q.why).size(12.5).color(p.text_dim))
                            .wrap(),
                    );
                    ui.add_space(6.0);
                }
            });
        }

        ui.add_space(16.0);
        if ghost_button(ui, "Kembali ke daftar materi", p).clicked() {
            action = Some(4);
        }
        ui.add_space(20.0);

        match action {
            Some(1) => self.start_quiz(now),
            Some(2) => self.goto(Screen::Lesson),
            Some(3) => {
                let next = self.topic_idx + 1;
                self.open_topic(next);
            }
            Some(4) => self.goto(Screen::Home),
            _ => {}
        }
    }
}

/// Normalisasi jawaban latihan: buang spasi dan tanda baca, kecilkan huruf.
fn normalize(s: &str) -> String {
    s.chars()
        .filter(|c| !c.is_whitespace() && !matches!(c, '.' | ',' | '!' | '?' | '~' | '…'))
        .flat_map(|c| c.to_lowercase())
        .collect()
}

// ------------------------------------------------------- kait untuk pengujian
//
// Aplikasi ini tidak punya perangkat Android untuk diuji, jadi seluruh alur
// dijalankan lewat `tests/app.rs` tanpa jendela. Metode di bawah hanya
// jembatan untuk menggerakkan state dari luar crate.
#[doc(hidden)]
impl App {
    pub fn quiz_total(&self) -> usize {
        self.quiz.as_ref().map(|q| q.total).unwrap_or(0)
    }

    /// Menjawab soal aktif dengan pilihan ke-`choice`.
    pub fn debug_answer(&mut self, choice: usize) {
        let questions = match self.bank.get(self.topic_idx) {
            Some(t) => t.quiz.clone(),
            None => return,
        };
        if let Some(s) = &mut self.quiz {
            s.answer(&questions, choice);
        }
    }

    /// Lanjut ke soal berikutnya atau pindah ke layar hasil.
    pub fn debug_next(&mut self, now: f64) {
        let Some(s) = &mut self.quiz else { return };
        if s.next(now) {
            return;
        }
        let (id, pct, correct) = (s.topic_id.clone(), s.percent(), s.correct);
        self.progress.record_score(&id, pct);
        self.progress.add_answered(&id, correct);
        if pct >= 60 {
            self.progress.mark_done(&id);
        }
        self.progress.save();
        self.goto(Screen::Result);
    }

    pub fn is_finished(&self) -> bool {
        self.quiz
            .as_ref()
            .map(|q| q.finished_at.is_some())
            .unwrap_or(false)
    }

    pub fn screen_is_result(&self) -> bool {
        self.screen == Screen::Result
    }

    pub fn mode_dark(&self) -> bool {
        self.mode.is_dark()
    }

    pub fn debug_toggle_theme(&mut self, ctx: &egui::Context) {
        self.toggle_theme(ctx);
    }

    pub fn lat_count(&self) -> usize {
        self.lat_inputs.len()
    }

    /// Isi baris ke-`i` dengan kunci jawaban yang benar.
    pub fn debug_fill_lat(&mut self, i: usize) {
        let Some(t) = self.bank.get(self.topic_idx) else {
            return;
        };
        if let Some(item) = t.lat.get(i) {
            let ko = item.ko.clone();
            if let Some(slot) = self.lat_inputs.get_mut(i) {
                *slot = ko;
            }
        }
    }

    /// Isi baris ke-`i` dengan jawaban yang pasti salah.
    pub fn debug_fill_lat_wrong(&mut self, i: usize) {
        if let Some(slot) = self.lat_inputs.get_mut(i) {
            *slot = "salah-sekali".to_string();
        }
    }

    /// Jumlah baris yang isiannya cocok dengan kunci.
    pub fn lat_benar(&self) -> usize {
        let Some(t) = self.bank.get(self.topic_idx) else {
            return 0;
        };
        t.lat
            .iter()
            .enumerate()
            .filter(|(i, item)| {
                self.lat_inputs
                    .get(*i)
                    .map(|v| normalize(v) == normalize(&item.ko))
                    .unwrap_or(false)
            })
            .count()
    }
}

