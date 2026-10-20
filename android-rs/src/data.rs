//! Bank materi dan soal.
//!
//! Data ini dihasilkan dari `js/data.js` (sumber aslinya `tools/data-final.js`)
//! oleh `tools/gen-rust-data.js`, lalu disimpan sebagai `data.json` yang
//! ditanam ke dalam biner lewat `include_str!`. Jadi tidak ada berkas materi
//! yang perlu disalin ke HP: semuanya ikut terkompilasi.

use serde::Deserialize;

/// Satu topik pelajaran.
#[derive(Debug, Clone, Deserialize)]
pub struct Topic {
    pub id: String,
    pub no: u32,
    /// Judul Korea, mis. "한글 — Huruf Korea".
    pub title: String,
    /// Subjudul bahasa Indonesia.
    #[serde(rename = "titleId")]
    pub title_id: String,
    /// 1 = dasar, 2 = menengah, 3 = lanjutan.
    pub level: u8,
    /// Huruf besar sebagai ikon, mis. "한".
    pub icon: String,
    pub intro: String,
    pub blocks: Vec<Block>,
    pub quiz: Vec<Question>,
    #[serde(default)]
    pub lat: Vec<Writing>,
}

/// Satu potongan isi materi.
#[derive(Debug, Clone, Deserialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum Block {
    /// Subjudul di dalam materi.
    Heading { text: String },
    /// Paragraf biasa.
    Text { text: String },
    /// Rumus pola kalimat: bagian-bagian yang disusun berurutan.
    Formula { parts: Vec<String> },
    /// Tabel tiga kolom (bentuk / arti / catatan).
    Rules { items: Vec<RuleRow> },
    /// Daftar contoh kalimat.
    Examples { items: Vec<Example> },
    /// Catatan penting.
    Note { text: String },
}

#[derive(Debug, Clone, Deserialize)]
pub struct RuleRow {
    pub a: String,
    pub b: String,
    pub c: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct Example {
    /// Kalimat Korea.
    pub ko: String,
    /// Romanisasi.
    #[serde(default)]
    pub rom: String,
    /// Arti bahasa Indonesia.
    pub id: String,
    /// Keterangan cara membaca (opsional).
    #[serde(default)]
    pub why: String,
}

/// Satu soal pilihan ganda.
#[derive(Debug, Clone, Deserialize)]
pub struct Question {
    pub q: String,
    pub options: Vec<String>,
    /// Indeks jawaban benar pada `options`.
    pub answer: usize,
    /// Pembahasan.
    pub why: String,
}

/// Satu latihan menulis.
#[derive(Debug, Clone, Deserialize)]
pub struct Writing {
    pub ko: String,
    #[serde(default)]
    pub rom: String,
    pub id: String,
}

/// Seluruh bank materi, sudah diurutkan berdasarkan `no`.
pub struct Bank {
    pub topics: Vec<Topic>,
}

impl Bank {
    /// Memuat materi yang ditanam di dalam biner.
    pub fn load() -> Self {
        let raw = include_str!("data.json");
        let mut topics: Vec<Topic> =
            serde_json::from_str(raw).expect("data.json tidak valid — jalankan tools/gen-rust-data.js");
        topics.sort_by_key(|t| t.no);
        Self { topics }
    }

    pub fn get(&self, index: usize) -> Option<&Topic> {
        self.topics.get(index)
    }

    /// Indeks topik berdasarkan `id`, dipakai untuk melanjutkan progres.
    pub fn index_of(&self, id: &str) -> Option<usize> {
        self.topics.iter().position(|t| t.id == id)
    }

    pub fn len(&self) -> usize {
        self.topics.len()
    }

    pub fn is_empty(&self) -> bool {
        self.topics.is_empty()
    }

    /// Total soal di semua topik.
    pub fn total_questions(&self) -> usize {
        self.topics.iter().map(|t| t.quiz.len()).sum()
    }
}

/// Nama tingkat berdasarkan `level`.
pub fn level_name(level: u8) -> &'static str {
    match level {
        1 => "Dasar",
        2 => "Menengah",
        _ => "Lanjutan",
    }
}
