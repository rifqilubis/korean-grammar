# =====================================================================
# release.ps1  unggah APK ke GitHub Releases dalam satu perintah.
#
#   powershell -ExecutionPolicy Bypass -File tools/release.ps1
#   powershell -ExecutionPolicy Bypass -File tools/release.ps1 -Version 1.1.0
#
# Butuh: git (dengan remote origin), gh CLI yang sudah `gh auth login`,
# dan APK hasil `npm run android:build` di build/korean-grammar.apk.
#
# Berkas .keystore/ TIDAK pernah diunggah; yang naik hanya APK-nya.
# =====================================================================
param(
    [string]$Version,
    [string]$NotesFile,
    [switch]$SkipBuild,
    [switch]$Draft
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot

function Step($m) { Write-Host "`n==> $m" -ForegroundColor Cyan }
function Ok($m)   { Write-Host "    ok  $m" -ForegroundColor Green }
function Die($m)  { Write-Host "`nGAGAL: $m" -ForegroundColor Red; exit 1 }

# PowerShell 5.1 menganggap apa pun yang ditulis program native ke stderr
# sebagai error yang menghentikan skrip. git dan gh rutin menulis progres ke
# stderr, jadi semua pemanggilan lewat sini: keluaran dialihkan ke berkas,
# lalu kita periksa kode keluarnya sendiri.
function Invoke-Native($exe, $argLine) {
    $out = Join-Path $env:TEMP "kg-native.out"
    $err = Join-Path $env:TEMP "kg-native.err"
    $p = Start-Process -FilePath $exe -ArgumentList $argLine -NoNewWindow -Wait -PassThru `
        -RedirectStandardOutput $out -RedirectStandardError $err
    $text = @()
    if (Test-Path $out) { $text += Get-Content $out }
    if (Test-Path $err) { $text += Get-Content $err }
    Remove-Item $out, $err -Force -ErrorAction SilentlyContinue
    return [pscustomobject]@{ Code = $p.ExitCode; Text = $text }
}

Set-Location $Root

# --------------------------------------------------------- 1. versi & tag
Step "Menentukan versi"

if (-not $Version) {
    $Version = (Get-Content (Join-Path $Root "src-tauri\tauri.conf.json") -Raw |
        ConvertFrom-Json).version
}
if (-not $Version) { Die "Versi tidak diketahui; isi -Version." }

$tag = "v$Version"
Ok "versi : $Version"
Ok "tag   : $tag"

# Versi di tauri.conf.json dan package.json harus sama supaya tidak membingungkan.
$pkgVersion = (Get-Content (Join-Path $Root "package.json") -Raw | ConvertFrom-Json).version
if ($pkgVersion -ne $Version) {
    Die "package.json versinya $pkgVersion, tauri.conf.json $Version. Samakan dulu."
}

# ------------------------------------------------------------- 2. prasyarat
Step "Memeriksa prasyarat"

$gh = Get-Command gh -ErrorAction SilentlyContinue
if (-not $gh) { Die "gh CLI tidak ada. Pasang dari https://cli.github.com lalu jalankan gh auth login." }

$probe = Invoke-Native "gh" "auth status"
if ($probe.Code -ne 0) { Die "gh belum login. Jalankan: gh auth login" }
Ok "gh CLI siap"

# Riwayat git harus bersih: rilis harus bisa ditelusuri ke satu commit.
$dirty = (Invoke-Native "git" "status --porcelain").Text
if ($dirty) {
    $dirty | ForEach-Object { Write-Host "    $_" }
    Die "Masih ada perubahan yang belum di-commit. Commit dulu agar rilis bisa dilacak."
}
$commit = ((Invoke-Native "git" "rev-parse --short HEAD").Text | Select-Object -First 1).Trim()
Ok "commit: $commit"

# --------------------------------------------------------------- 3. build
if ($SkipBuild) {
    Step "Melewati build (-SkipBuild)"
} else {
    Step "Membangun APK rilis"
    & powershell -ExecutionPolicy Bypass -File (Join-Path $Root "tools\build-android.ps1")
    if ($LASTEXITCODE -ne 0) { Die "Build APK gagal." }
}

$apk = Join-Path $Root "build\korean-grammar.apk"
if (-not (Test-Path $apk)) { Die "APK tidak ada di $apk. Jalankan npm run android:build." }

$sizeMb = [math]::Round((Get-Item $apk).Length / 1MB, 2)
$sha = (Get-FileHash $apk -Algorithm SHA256).Hash.ToLower()
Ok "APK   : $apk ($sizeMb MB)"
Ok "sha256: $sha"

# Nama berkas yang diunduh orang: sertakan versi agar jelas mana yang terbaru.
$assetName = "korean-grammar-$Version.apk"
$assetPath = Join-Path $Root "build\$assetName"
Copy-Item $apk $assetPath -Force

# ------------------------------------------------------------ 4. tag git
Step "Menyiapkan tag $tag"

$existing = ((Invoke-Native "git" "tag -l $tag").Text) | Where-Object { $_ -eq $tag }
if ($existing) {
    Ok "tag $tag sudah ada"
} else {
    $r = Invoke-Native "git" "tag -a $tag -m `"Korean Grammar $Version`""
    if ($r.Code -ne 0) { $r.Text | ForEach-Object { Write-Host "    $_" }; Die "Gagal membuat tag $tag." }

    $r = Invoke-Native "git" "push origin $tag"
    if ($r.Code -ne 0) { $r.Text | ForEach-Object { Write-Host "    $_" }; Die "Gagal push tag $tag." }
    Ok "tag dibuat & di-push"
}

# -------------------------------------------------------- 5. catatan rilis
Step "Menyusun catatan rilis"

if (-not $NotesFile) {
    $NotesFile = Join-Path $env:TEMP "kg-release-notes.md"
    @(
        "Aplikasi Android versi $Version."
        ""
        "Belajar tata bahasa Korea dari nol: **10 topik materi**, **82 soal pilihan ganda**"
        "dengan pembahasan, dan **32 latihan menulis**. Antarmuka bahasa Indonesia."
        ""
        "### Cara pasang"
        ""
        "1. Unduh ``$assetName`` di bawah."
        "2. Buka berkasnya di HP. Kalau diminta, izinkan *Install unknown apps* untuk File Manager."
        "3. Pasang. Setelah itu aplikasi berjalan **tanpa internet**."
        ""
        "Butuh **Android 7.0 (API 24)** atau lebih baru. Satu berkas ini sudah memuat"
        "arm64-v8a, armeabi-v7a, x86, dan x86_64."
        ""
        "### Catatan"
        ""
        "- Pelafalan memakai mesin TTS bawaan Android. Kalau suara tidak keluar, pasang data"
        "  bahasa Korea di *Setelan - Aksesibilitas - Text-to-speech*."
        "- Progres belajar disimpan di perangkat, aman saat aplikasi diperbarui."
        "- APK ditandatangani; pembaruan memakai kunci yang sama."
        ""
        "### Berkas"
        ""
        "| Berkas | Ukuran | SHA-256 |"
        "| --- | --- | --- |"
        "| ``$assetName`` | $sizeMb MB | ``$sha`` |"
        ""
        "Versi web (tanpa pasang apa pun): https://rifqilubis.github.io/korean-grammar/"
    ) | Set-Content $NotesFile -Encoding utf8
    # Set-Content -Encoding utf8 di PowerShell 5.1 selalu menulis BOM, dan BOM
    # itu ikut tampil sebagai karakter aneh di awal catatan rilis GitHub.
    $plain = New-Object Text.UTF8Encoding($false)
    [IO.File]::WriteAllText($NotesFile, [IO.File]::ReadAllText($NotesFile, [Text.Encoding]::UTF8), $plain)
    Ok "catatan rilis dibuat otomatis"
} else {
    Ok "catatan rilis dari $NotesFile"
}

# ------------------------------------------------------------- 6. unggah
Step "Mengunggah ke GitHub Releases"

# Kalau release untuk tag ini sudah ada (mis. percobaan sebelumnya), unggah
# ulang APK-nya saja alih-alih gagal.
$view = Invoke-Native "gh" "release view `"$tag`" --json url"
if ($view.Code -eq 0) {
    Ok "release $tag sudah ada, memperbarui berkas"
    $r = Invoke-Native "gh" "release upload `"$tag`" `"$assetPath`" --clobber"
    if ($r.Code -ne 0) { $r.Text | ForEach-Object { Write-Host "    $_" }; Die "gh release upload gagal." }
    $url = (($view.Text -join ' ') -replace '.*"url":"([^"]+)".*', '$1')
} else {
    $releaseLine = @(
        "release create `"$tag`" `"$assetPath`""
        "--title `"Korean Grammar $Version`""
        "--notes-file `"$NotesFile`""
        "--latest"
    ) -join ' '
    if ($Draft) { $releaseLine += " --draft" }

    $rel = Invoke-Native "gh" $releaseLine
    if ($rel.Code -ne 0) {
        $rel.Text | Select-Object -Last 10 | ForEach-Object { Write-Host "    $_" }
        Die "gh release create gagal (exit $($rel.Code))."
    }
    # Baris keluaran `gh` yang berupa URL adalah alamat rilis.
    $url = ($rel.Text | Where-Object { $_ -match '^https?://' } | Select-Object -Last 1)
}
if (-not $url) { $url = "https://github.com/rifqilubis/korean-grammar/releases/latest" }

# ------------------------------------------------------------- 7. ringkasan
Write-Host @"

Rilis selesai:
    $url
    $assetName  ($sizeMb MB)

Unduh langsung:
    https://github.com/rifqilubis/korean-grammar/releases/latest
"@ -ForegroundColor Green
