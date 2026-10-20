//! Progres belajar: topik yang sudah tuntas, skor kuis, dan jawaban soal.
//!
//! Disimpan sebagai JSON kecil di penyimpanan aplikasi:
//! - Android: `<data_dir>/progress.json`
//! - Desktop: folder berkas lokal OS
//!
//! Kalau penyimpanan gagal (mis. izin), aplikasi tetap jalan — progres hanya
//! tidak bertahan setelah ditutup.

use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use std::path::PathBuf;

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct Progress {
    /// `topik id` -> skor terbaik (persen).
    #[serde(default)]
    pub best: BTreeMap<String, u32>,
    /// Topik yang materinya sudah dibaca sampai bawah.
    #[serde(default)]
    pub done: Vec<String>,
    /// `topik id` -> jumlah soal yang pernah dijawab benar.
    #[serde(default)]
    pub answered: BTreeMap<String, u32>,
    /// Pilihan tema: "dark" / "light".
    #[serde(default)]
    pub theme: Option<String>,
}

impl Progress {
    /// Lokasi berkas progres.
    fn path() -> Option<PathBuf> {
        let dir = data_dir()?;
        Some(dir.join("progress.json"))
    }

    pub fn load() -> Self {
        let Some(path) = Self::path() else {
            return Self::default();
        };
        let Ok(text) = std::fs::read_to_string(&path) else {
            return Self::default();
        };
        serde_json::from_str(&text).unwrap_or_default()
    }

    pub fn save(&self) {
        let Some(path) = Self::path() else { return };
        if let Some(parent) = path.parent() {
            let _ = std::fs::create_dir_all(parent);
        }
        if let Ok(text) = serde_json::to_string_pretty(self) {
            let _ = std::fs::write(path, text);
        }
    }

    pub fn is_done(&self, id: &str) -> bool {
        self.done.iter().any(|d| d == id)
    }

    pub fn mark_done(&mut self, id: &str) {
        if !self.is_done(id) {
            self.done.push(id.to_string());
        }
    }

    /// Simpan skor kalau lebih baik dari sebelumnya.
    pub fn record_score(&mut self, id: &str, percent: u32) {
        let entry = self.best.entry(id.to_string()).or_insert(0);
        if percent > *entry {
            *entry = percent;
        }
    }

    pub fn add_answered(&mut self, id: &str, n: u32) {
        *self.answered.entry(id.to_string()).or_insert(0) += n;
    }

    /// Rata-rata skor kuis dari semua topik yang pernah dikerjakan.
    pub fn average_score(&self) -> Option<u32> {
        if self.best.is_empty() {
            return None;
        }
        let sum: u32 = self.best.values().sum();
        Some(sum / self.best.len() as u32)
    }

    pub fn total_answered(&self) -> u32 {
        self.answered.values().sum()
    }

    pub fn reset(&mut self) {
        let theme = self.theme.clone();
        *self = Progress::default();
        self.theme = theme;
        self.save();
    }
}

/// Folder data aplikasi.
fn data_dir() -> Option<PathBuf> {
    #[cfg(target_os = "android")]
    {
        // Di Android, direktori kerja proses sudah berada di dalam folder
        // privat aplikasi (/data/data/<paket>/...), jadi bisa dipakai langsung.
        // Variabel TMPDIR juga menunjuk ke cache privat aplikasi.
        if let Ok(home) = std::env::var("HOME") {
            if !home.is_empty() {
                return Some(PathBuf::from(home));
            }
        }
        if let Ok(tmp) = std::env::var("TMPDIR") {
            if !tmp.is_empty() {
                return Some(PathBuf::from(tmp));
            }
        }
        Some(PathBuf::from("."))
    }

    #[cfg(not(target_os = "android"))]
    {
        if let Some(dir) = std::env::var_os("APPDATA") {
            return Some(PathBuf::from(dir).join("KoreanGrammar"));
        }
        if let Some(dir) = std::env::var_os("XDG_DATA_HOME") {
            return Some(PathBuf::from(dir).join("korean-grammar"));
        }
        std::env::var_os("HOME").map(|h| PathBuf::from(h).join(".korean-grammar"))
    }
}
