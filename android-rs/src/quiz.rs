//! Mesin kuis: satu soal aktif, penilaian, dan rekap hasil.
//!
//! Aturannya sama dengan versi web: soal diacak urutannya, tiap soal
//! dijawab sekali, jawaban salah dibahas di akhir.

use crate::data::Question;

/// Pilihan pemutaran materi dalam satu sesi kuis.
#[derive(Debug, Clone)]
pub struct QuizSession {
    pub topic_id: String,
    pub topic_title: String,
    pub topic_icon: String,
    /// Indeks soal sesuai urutan main.
    pub order: Vec<usize>,
    /// Berapa soal yang dikerjakan (bisa lebih sedikit dari total bank).
    pub total: usize,
    /// Soal ke berapa (0-based).
    pub index: usize,
    /// Indeks pilihan yang dipilih pemain pada soal aktif.
    pub picked: Option<usize>,
    pub correct: u32,
    /// Soal yang dijawab salah, untuk pembahasan di akhir: (indeks, pilihan).
    pub wrong: Vec<(usize, usize)>,
    /// Waktu mulai (detik sejak epoch), untuk menampilkan durasi.
    pub started_at: f64,
    pub finished_at: Option<f64>,
}

impl QuizSession {
    /// Membuat sesi baru. `limit` membatasi jumlah soal (None = semua).
    pub fn new(
        topic_id: &str,
        topic_title: &str,
        topic_icon: &str,
        count: usize,
        limit: Option<usize>,
        now: f64,
    ) -> Self {
        let total = limit.unwrap_or(count).min(count);
        Self {
            topic_id: topic_id.to_string(),
            topic_title: topic_title.to_string(),
            topic_icon: topic_icon.to_string(),
            order: (0..count).collect(),
            total,
            index: 0,
            picked: None,
            correct: 0,
            wrong: Vec::new(),
            started_at: now,
            finished_at: None,
        }
    }

    /// Acak urutan soal. `seed` membuat pengacakan tetap bisa diulang saat uji.
    pub fn shuffle(&mut self, seed: u64) {
        // xorshift sederhana: cukup untuk mengacak 82 soal, tanpa dependensi.
        let mut s = seed | 1;
        for i in (1..self.order.len()).rev() {
            s ^= s << 13;
            s ^= s >> 7;
            s ^= s << 17;
            let j = (s % (i as u64 + 1)) as usize;
            self.order.swap(i, j);
        }
    }

    pub fn is_last(&self) -> bool {
        self.index + 1 >= self.total
    }

    pub fn progress(&self) -> f32 {
        if self.total == 0 {
            return 0.0;
        }
        self.index as f32 / self.total as f32
    }

    /// Soal aktif.
    pub fn current<'a>(&self, questions: &'a [Question]) -> Option<&'a Question> {
        let qi = *self.order.get(self.index)?;
        questions.get(qi)
    }

    pub fn is_correct(&self, questions: &[Question]) -> bool {
        match (self.current(questions), self.picked) {
            (Some(q), Some(p)) => p == q.answer,
            _ => false,
        }
    }

    /// Menjawab soal aktif. Mengembalikan true kalau jawabannya benar.
    pub fn answer(&mut self, questions: &[Question], choice: usize) -> bool {
        if self.picked.is_some() {
            return self.is_correct(questions);
        }
        let Some(q) = self.current(questions) else {
            return false;
        };
        let ok = choice == q.answer;
        self.picked = Some(choice);
        if ok {
            self.correct += 1;
        } else {
            if let Some(qi) = self.order.get(self.index) {
                self.wrong.push((*qi, choice));
            }
        }
        ok
    }

    /// Lanjut ke soal berikutnya. Mengembalikan false kalau sesi selesai.
    pub fn next(&mut self, now: f64) -> bool {
        if self.is_last() {
            self.finished_at = Some(now);
            return false;
        }
        self.index += 1;
        self.picked = None;
        true
    }

    pub fn percent(&self) -> u32 {
        if self.total == 0 {
            return 0;
        }
        (self.correct * 100 / self.total as u32).min(100)
    }

    pub fn elapsed_secs(&self, now: f64) -> u64 {
        let end = self.finished_at.unwrap_or(now);
        (end - self.started_at).max(0.0) as u64
    }
}

/// Format detik menjadi `m:ss` seperti di versi web.
pub fn format_duration(secs: u64) -> String {
    format!("{}:{:02}", secs / 60, secs % 60)
}

/// Pesan hasil sesuai skor.
pub fn headline(percent: u32) -> &'static str {
    match percent {
        100 => "Sempurna!",
        80..=99 => "Bagus sekali!",
        60..=79 => "Lumayan, teruskan!",
        40..=59 => "Perlu diulang sedikit",
        _ => "Ayo baca materinya lagi",
    }
}
