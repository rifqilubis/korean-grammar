# Buat ulang ikon peluncur Android dari icons/icon-512.png.
#
#   powershell -ExecutionPolicy Bypass -File tools/make-rust-icons.ps1
#
# Densitas mipmap Android butuh ukuran berbeda-beda; kalau semua densitas
# memakai berkas 512 px yang sama, peluncur akan menskalakan ulang dan
# ikonnya terlihat kabur.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$src = Join-Path $root 'icons\icon-512.png'
if (-not (Test-Path $src)) { throw "ikon sumber tidak ada: $src" }

# densitas -> ukuran piksel
$sizes = [ordered]@{
    'mdpi'    = 48
    'hdpi'    = 72
    'xhdpi'   = 96
    'xxhdpi'  = 144
    'xxxhdpi' = 192
}

$img = [System.Drawing.Image]::FromFile($src)
try {
    foreach ($density in $sizes.Keys) {
        $px = $sizes[$density]
        $dir = Join-Path $root "android-rs\res\mipmap-$density"
        New-Item -ItemType Directory -Force -Path $dir | Out-Null

        $bmp = New-Object System.Drawing.Bitmap $px, $px
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        try {
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $g.DrawImage($img, 0, 0, $px, $px)
        } finally {
            $g.Dispose()
        }

        $out = Join-Path $dir 'ic_launcher.png'
        $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        Write-Host ("{0,-10} {1,3} px -> {2}" -f $density, $px, $out)
    }
} finally {
    $img.Dispose()
}
