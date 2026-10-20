//! Tema warna terang/gelap, mengikuti palet `css/style.css` versi web.

use eframe::egui::{self, Color32, CornerRadius, FontId, Stroke, TextStyle, Vec2};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Mode {
    Dark,
    Light,
}

/// Satu set warna untuk sebuah mode.
#[derive(Debug, Clone, Copy)]
pub struct Palette {
    pub bg: Color32,
    pub surface: Color32,
    pub surface_alt: Color32,
    pub border: Color32,
    pub text: Color32,
    pub text_dim: Color32,
    pub accent: Color32,
    pub accent_dim: Color32,
    pub ok: Color32,
    pub bad: Color32,
    pub warn: Color32,
}

pub const DARK: Palette = Palette {
    bg: Color32::from_rgb(0x0c, 0x0d, 0x16),
    surface: Color32::from_rgb(0x16, 0x18, 0x25),
    surface_alt: Color32::from_rgb(0x1e, 0x21, 0x31),
    border: Color32::from_rgb(0x2a, 0x2e, 0x42),
    text: Color32::from_rgb(0xee, 0xf0, 0xf7),
    text_dim: Color32::from_rgb(0x9a, 0xa0, 0xb8),
    accent: Color32::from_rgb(0xe1, 0x4b, 0x6a),
    accent_dim: Color32::from_rgb(0x8c, 0x2f, 0x44),
    ok: Color32::from_rgb(0x4a, 0xc3, 0x8a),
    bad: Color32::from_rgb(0xe5, 0x60, 0x5e),
    warn: Color32::from_rgb(0xe2, 0xb3, 0x4a),
};

pub const LIGHT: Palette = Palette {
    bg: Color32::from_rgb(0xf6, 0xf6, 0xfa),
    surface: Color32::from_rgb(0xff, 0xff, 0xff),
    surface_alt: Color32::from_rgb(0xee, 0xf0, 0xf6),
    border: Color32::from_rgb(0xda, 0xdc, 0xe8),
    text: Color32::from_rgb(0x1b, 0x1d, 0x28),
    text_dim: Color32::from_rgb(0x64, 0x69, 0x80),
    accent: Color32::from_rgb(0xd0, 0x3a, 0x5a),
    accent_dim: Color32::from_rgb(0x8c, 0x2f, 0x44),
    ok: Color32::from_rgb(0x1f, 0x9d, 0x66),
    bad: Color32::from_rgb(0xc8, 0x3f, 0x3f),
    warn: Color32::from_rgb(0xa8, 0x7d, 0x14),
};

impl Mode {
    pub fn palette(self) -> &'static Palette {
        match self {
            Mode::Dark => &DARK,
            Mode::Light => &LIGHT,
        }
    }

    pub fn toggled(self) -> Self {
        match self {
            Mode::Dark => Mode::Light,
            Mode::Light => Mode::Dark,
        }
    }

    pub fn is_dark(self) -> bool {
        matches!(self, Mode::Dark)
    }

    /// Disimpan ke `progress.json`, jadi nilainya harus stabil.
    pub fn as_key(self) -> &'static str {
        match self {
            Mode::Dark => "dark",
            Mode::Light => "light",
        }
    }

    pub fn from_key(s: &str) -> Self {
        if s == "light" {
            Mode::Light
        } else {
            Mode::Dark
        }
    }
}

/// Terapkan palet ke seluruh gaya `egui`.
///
/// `egui` 0.37 menyimpan gaya terpisah untuk tema terang dan gelap, dan
/// tidak lagi punya `Context::set_style`. Karena aplikasi ini memakai palet
/// sendiri, kedua tema diisi dengan warna yang sama supaya tampilan tidak
/// berubah-ubah mengikuti setelan sistem.
pub fn apply(ctx: &egui::Context, p: &Palette) {
    let dark = p.bg.r() < 128;

    ctx.set_theme(if dark {
        egui::Theme::Dark
    } else {
        egui::Theme::Light
    });

    ctx.all_styles_mut(|style| {
        let vis = &mut style.visuals;
        vis.dark_mode = dark;
        vis.panel_fill = p.bg;
        vis.window_fill = p.surface;
        vis.extreme_bg_color = p.surface_alt;
        vis.faint_bg_color = p.surface_alt;
        vis.code_bg_color = p.surface_alt;
        vis.override_text_color = Some(p.text);
        vis.hyperlink_color = p.accent;
        vis.warn_fg_color = p.warn;
        vis.error_fg_color = p.bad;

        vis.window_corner_radius = CornerRadius::same(14);
        vis.menu_corner_radius = CornerRadius::same(12);

        let w = &mut vis.widgets;

        w.noninteractive.bg_fill = p.surface;
        w.noninteractive.weak_bg_fill = p.surface;
        w.noninteractive.bg_stroke = Stroke::new(1.0, p.border);
        w.noninteractive.fg_stroke = Stroke::new(1.0, p.text);
        w.noninteractive.corner_radius = CornerRadius::same(12);

        w.inactive.bg_fill = p.surface_alt;
        w.inactive.weak_bg_fill = p.surface_alt;
        w.inactive.bg_stroke = Stroke::new(1.0, p.border);
        w.inactive.fg_stroke = Stroke::new(1.0, p.text);
        w.inactive.corner_radius = CornerRadius::same(12);

        w.hovered.bg_fill = p.border;
        w.hovered.weak_bg_fill = p.border;
        w.hovered.bg_stroke = Stroke::new(1.0, p.accent);
        w.hovered.fg_stroke = Stroke::new(1.0, p.text);
        w.hovered.corner_radius = CornerRadius::same(12);

        w.active.bg_fill = p.accent_dim;
        w.active.weak_bg_fill = p.accent_dim;
        w.active.bg_stroke = Stroke::new(1.0, p.accent);
        w.active.fg_stroke = Stroke::new(1.0, p.text);
        w.active.corner_radius = CornerRadius::same(12);

        w.open.bg_fill = p.surface_alt;
        w.open.weak_bg_fill = p.surface_alt;
        w.open.bg_stroke = Stroke::new(1.0, p.border);
        w.open.fg_stroke = Stroke::new(1.0, p.text);
        w.open.corner_radius = CornerRadius::same(12);

        vis.selection.bg_fill = p.accent_dim;
        vis.selection.stroke = Stroke::new(1.0, p.text);

        // Jarak dan ukuran sentuh: lebih lega dari bawaan, karena dipakai di HP.
        style.spacing.item_spacing = Vec2::new(10.0, 10.0);
        style.spacing.button_padding = Vec2::new(14.0, 9.0);
        style.spacing.interact_size.y = 42.0;

        // Ukuran huruf dasar.
        style
            .text_styles
            .insert(TextStyle::Heading, FontId::proportional(26.0));
        style
            .text_styles
            .insert(TextStyle::Body, FontId::proportional(16.0));
        style
            .text_styles
            .insert(TextStyle::Button, FontId::proportional(16.0));
        style
            .text_styles
            .insert(TextStyle::Small, FontId::proportional(13.0));
    });
}

/// Kerangka kartu: latar `surface`, garis tepi tipis, sudut membulat.
pub fn card(p: &Palette) -> egui::Frame {
    egui::Frame::NONE
        .fill(p.surface)
        .stroke(Stroke::new(1.0, p.border))
        .corner_radius(CornerRadius::same(16))
        .inner_margin(egui::Margin::same(16))
}
