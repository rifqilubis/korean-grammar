// Entry point desktop (Windows/macOS/Linux).
// Di Android & iOS, entry point ada di src/lib.rs lewat `tauri::mobile_entry_point`.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    korean_grammar_lib::run()
}
