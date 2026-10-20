# =====================================================================
# setup-android.ps1 — memasang semua alat yang dibutuhkan untuk
# membangun APK 한국어 문법 dengan Rust + Tauri 2.
#
#   powershell -ExecutionPolicy Bypass -File tools/setup-android.ps1
#
# Aman dijalankan berulang: langkah yang sudah selesai akan dilewati.
# =====================================================================
param(
    [string]$NdkVersion = "27.0.12077973",
    [string]$Platform = "android-34",
    [string]$BuildTools = "34.0.0",
    [switch]$SkipSdk
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "    ok  $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "    !   $msg" -ForegroundColor Yellow }
function Die($msg)  { Write-Host "`nGAGAL: $msg" -ForegroundColor Red; exit 1 }

function Add-Path($dir) {
    if ($dir -and (Test-Path $dir) -and ($env:Path -notlike "*$dir*")) {
        $env:Path = "$dir;$env:Path"
    }
}

# --------------------------------------------------------------- 1. Rust
Step "Memeriksa Rust (rustup)"
Add-Path "$env:USERPROFILE\.cargo\bin"
$rustup = Get-Command rustup -ErrorAction SilentlyContinue
if (-not $rustup) {
    Die @"
Rust belum terpasang. Pasang dulu salah satu:
  winget install Rustlang.Rustup
  atau https://rustup.rs
lalu buka terminal baru dan jalankan skrip ini lagi.
"@
}
Ok ("rustup " + (rustup --version 2>&1 | Select-Object -First 1))

Step "Memasang target Rust untuk Android"
$targets = @(
    "aarch64-linux-android",      # HP modern (64-bit ARM)
    "armv7-linux-androideabi",    # HP lama (32-bit ARM)
    "i686-linux-android",         # emulator 32-bit
    "x86_64-linux-android"        # emulator 64-bit
)
$installed = rustup target list --installed
foreach ($t in $targets) {
    if ($installed -contains $t) {
        Ok "$t sudah ada"
    } else {
        rustup target add $t | Out-Null
        Ok "$t dipasang"
    }
}

# ---------------------------------------------------------------- 2. JDK
Step "Memeriksa JDK 17"
$javaHome = $env:JAVA_HOME
if (-not $javaHome -or -not (Test-Path "$javaHome\bin\java.exe")) {
    $candidates = Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like "jdk-17*" }
    if ($candidates) { $javaHome = $candidates[0].FullName }
}
if (-not $javaHome) {
    Warn "JDK 17 tidak ditemukan. Memasang lewat winget..."
    winget install --id EclipseAdoptium.Temurin.17.JDK -e --silent `
        --accept-package-agreements --accept-source-agreements | Out-Null
    $candidates = Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like "jdk-17*" }
    if ($candidates) { $javaHome = $candidates[0].FullName }
}
if (-not $javaHome) { Die "JDK 17 tidak terpasang. Pasang manual lalu set JAVA_HOME." }
$env:JAVA_HOME = $javaHome
Add-Path "$javaHome\bin"
Ok "JAVA_HOME = $javaHome"

# --------------------------------------------------------- 3. Android SDK
if (-not $SkipSdk) {
    Step "Memeriksa Android SDK"
    $sdk = $env:ANDROID_HOME
    if (-not $sdk) { $sdk = $env:ANDROID_SDK_ROOT }
    if (-not $sdk) { $sdk = "$env:LOCALAPPDATA\Android\Sdk" }

    $sdkmanager = "$sdk\cmdline-tools\latest\bin\sdkmanager.bat"
    if (-not (Test-Path $sdkmanager)) {
        Warn "cmdline-tools belum ada. Mengunduh..."
        New-Item -ItemType Directory -Force -Path "$sdk\cmdline-tools" | Out-Null
        $zip = Join-Path $env:TEMP "cmdline-tools.zip"
        curl.exe -L --fail --retry 3 -o $zip `
            "https://dl.google.com/android/repository/commandlinetools-win-13114758_latest.zip"
        if ($LASTEXITCODE -ne 0) { Die "Gagal mengunduh cmdline-tools." }
        $tmp = "$sdk\cmdline-tools\_tmp"
        if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
        Expand-Archive -Path $zip -DestinationPath $tmp -Force
        if (Test-Path "$sdk\cmdline-tools\latest") {
            Remove-Item "$sdk\cmdline-tools\latest" -Recurse -Force
        }
        Move-Item "$tmp\cmdline-tools" "$sdk\cmdline-tools\latest"
        Remove-Item $tmp -Recurse -Force
        Remove-Item $zip -Force
    }

    $env:ANDROID_HOME = $sdk
    $env:ANDROID_SDK_ROOT = $sdk
    Add-Path "$sdk\platform-tools"
    Ok "ANDROID_HOME = $sdk"

    Step "Menyetujui lisensi SDK"
    ("y`r`n" * 40) | & $sdkmanager --sdk_root=$sdk --licenses | Out-Null
    Ok "lisensi diterima"

    Step "Memasang paket SDK (platform, build-tools, NDK)"
    $packages = @("platform-tools", "platforms;$Platform", "build-tools;$BuildTools", "ndk;$NdkVersion")
    & $sdkmanager --sdk_root=$sdk @packages | Out-Null
    if ($LASTEXITCODE -ne 0) { Die "Instalasi paket SDK gagal." }
    Ok ($packages -join ", ")

    $env:ANDROID_NDK_HOME = "$sdk\ndk\$NdkVersion"
    Ok "ANDROID_NDK_HOME = $env:ANDROID_NDK_HOME"
}

# ------------------------------------------------------- 4. Tauri Android
Step "Memeriksa proyek Tauri Android"
if (Test-Path "src-tauri\gen\android") {
    Ok "src-tauri/gen/android sudah ada"
} else {
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Die "Node.js belum terpasang. Pasang Node 18+ lalu jalankan lagi."
    }
    if (-not (Test-Path "node_modules\@tauri-apps\cli")) {
        Write-Host "    memasang Tauri CLI (npm install)..."
        npm install --no-audit --no-fund
    }
    Write-Host "    menjalankan tauri android init..."
    npx tauri android init
    if ($LASTEXITCODE -ne 0) { Die "tauri android init gagal." }
    Ok "proyek Android dibuat"
}

# ------------------------------------------------------------- 5. Ringkas
Step "Selesai — ringkasan lingkungan"
@{
    "rustc"           = (rustc --version 2>&1 | Select-Object -First 1)
    "JAVA_HOME"       = $env:JAVA_HOME
    "ANDROID_HOME"    = $env:ANDROID_HOME
    "ANDROID_NDK_HOME" = $env:ANDROID_NDK_HOME
} | ForEach-Object { $_.GetEnumerator() | ForEach-Object { Write-Host ("    {0,-17} {1}" -f $_.Key, $_.Value) } }

Write-Host @"

Bangun APK:
    npm run android:build

Hasil:
    src-tauri\gen\android\app\build\outputs\apk\universal\release\app-universal-release.apk

Pasang ke HP (USB debugging aktif):
    adb install -r src-tauri\gen\android\app\build\outputs\apk\universal\release\app-universal-release.apk
"@ -ForegroundColor Cyan
