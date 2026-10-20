# Bangun APK versi Rust murni (tanpa Gradle, tanpa Java/Kotlin di dalam APK).
#
#   powershell -ExecutionPolicy Bypass -File tools/build-rust-apk.ps1
#   powershell -ExecutionPolicy Bypass -File tools/build-rust-apk.ps1 -Debug
#
# Yang dilakukan skrip ini:
#   1. mencari Android SDK, NDK, dan JDK,
#   2. menulis ulang android-rs/.cargo/config.toml sesuai lokasi NDK di mesin ini,
#   3. memasang target Rust yang belum ada,
#   4. mengambil kata sandi keystore dari .keystore/keystore.properties,
#   5. menjalankan `cargo apk build`.
#
# Hasil: android-rs/target/release/apk/korean-grammar-rust.apk

param(
    # Build tanpa optimasi (lebih cepat, APK jauh lebih besar).
    [switch]$Debug,
    # Hanya satu ABI, mis. -Target aarch64-linux-android.
    [string]$Target
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$crate = Join-Path $root 'android-rs'

function Find-Dir([string[]]$candidates) {
    foreach ($c in $candidates) {
        if ($c -and (Test-Path $c)) { return (Resolve-Path $c).Path }
    }
    return $null
}

# ------------------------------------------------------------------ Android SDK
$sdk = Find-Dir @(
    $env:ANDROID_HOME,
    $env:ANDROID_SDK_ROOT,
    (Join-Path $env:LOCALAPPDATA 'Android\Sdk')
)
if (-not $sdk) {
    throw "Android SDK tidak ditemukan. Set ANDROID_HOME ke folder SDK."
}
Write-Host "SDK   : $sdk"

# ---------------------------------------------------------------------- NDK
# Pakai ANDROID_NDK_HOME bila ada, kalau tidak ambil versi NDK terbaru.
$ndk = $null
if ($env:ANDROID_NDK_HOME -and (Test-Path $env:ANDROID_NDK_HOME)) {
    $ndk = (Resolve-Path $env:ANDROID_NDK_HOME).Path
} else {
    $ndkRoot = Join-Path $sdk 'ndk'
    if (Test-Path $ndkRoot) {
        $latest = Get-ChildItem $ndkRoot -Directory |
            Sort-Object { [version]($_.Name -replace '[^0-9.]', '') } -Descending |
            Select-Object -First 1
        if ($latest) { $ndk = $latest.FullName }
    }
}
if (-not $ndk) {
    throw "NDK tidak ditemukan. Pasang lewat SDK Manager, atau set ANDROID_NDK_HOME."
}
Write-Host "NDK   : $ndk"

$toolchain = Join-Path $ndk 'toolchains\llvm\prebuilt\windows-x86_64\bin'
if (-not (Test-Path $toolchain)) {
    throw "Toolchain NDK tidak ditemukan di $toolchain"
}

# ---------------------------------------------------------------------- JDK
# Hanya dipakai cargo-apk untuk menjalankan aapt2/zipalign/apksigner.
$javaHome = Find-Dir @(
    $env:JAVA_HOME,
    'C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot',
    'C:\Program Files\Android\Android Studio\jbr',
    'C:\Program Files\Java\jdk-17'
)
if (-not $javaHome) {
    throw "JDK 17 tidak ditemukan. Set JAVA_HOME."
}
Write-Host "JDK   : $javaHome"

# --------------------------------------------------------------- lingkungan
$env:ANDROID_HOME = $sdk
$env:ANDROID_NDK_HOME = $ndk
$env:JAVA_HOME = $javaHome
$env:Path = "$toolchain;$(Join-Path $javaHome 'bin');$env:Path"

# -------------------------------------------------- .cargo/config.toml (linker)
# Path linker berbeda di setiap mesin, jadi berkas ini ditulis ulang setiap kali
# dan tidak disimpan di git.
$targets = @{
    'aarch64-linux-android'   = 'aarch64-linux-android24-clang.cmd'
    'armv7-linux-androideabi' = 'armv7a-linux-androideabi24-clang.cmd'
    'i686-linux-android'      = 'i686-linux-android24-clang.cmd'
    'x86_64-linux-android'    = 'x86_64-linux-android24-clang.cmd'
}

$lines = @(
    '# Konfigurasi cargo untuk build Android (Rust murni, tanpa Gradle).',
    '#',
    '# Dihasilkan otomatis oleh tools/build-rust-apk.ps1 dari ANDROID_NDK_HOME,',
    '# jadi path mesin tidak ditulis manual di sini. Jangan di-commit.',
    ''
)

foreach ($t in $targets.Keys | Sort-Object) {
    $linker = (Join-Path $toolchain $targets[$t]) -replace '\\', '/'
    $lines += "[target.$t]"
    $lines += "linker = `"$linker`""
    $lines += 'rustflags = ["-C", "link-arg=-Wl,-z,max-page-size=16384"]'
    $lines += ''
}

$cargoDir = Join-Path $crate '.cargo'
New-Item -ItemType Directory -Force -Path $cargoDir | Out-Null
$cfgPath = Join-Path $cargoDir 'config.toml'
[System.IO.File]::WriteAllText($cfgPath, ($lines -join "`n"), (New-Object System.Text.UTF8Encoding $false))
Write-Host "config: $cfgPath"

# ------------------------------------------------------------- target Rust
$wanted = if ($Target) { @($Target) } else { $targets.Keys | Sort-Object }
$installed = (& rustup target list --installed) -split "`r?`n"
foreach ($t in $wanted) {
    if ($installed -notcontains $t) {
        Write-Host "tambah target $t"
        & rustup target add $t
        if ($LASTEXITCODE -ne 0) { throw "gagal menambah target $t" }
    }
}

# ---------------------------------------------------------------- keystore
$props = Join-Path $root '.keystore\keystore.properties'
$store = Join-Path $root '.keystore\korean-grammar.jks'
$hasKey = (Test-Path $props) -and (Test-Path $store)

if ($hasKey) {
    $cfg = @{}
    Get-Content $props | Where-Object { $_ -match '^\s*[^#].*=' } | ForEach-Object {
        $k, $v = $_ -split '=', 2
        $cfg[$k.Trim()] = $v.Trim()
    }
    if (-not $cfg['storePassword']) {
        throw "storePassword tidak ada di $props"
    }
    $env:CARGO_APK_RELEASE_KEYSTORE = $store
    $env:CARGO_APK_RELEASE_KEYSTORE_PASSWORD = $cfg['storePassword']
    Write-Host "tanda tangan: $store"
} else {
    Write-Host "tanda tangan: dilewati (keystore tidak ada) - APK tidak bisa dipasang sebagai pembaruan" -ForegroundColor Yellow
}

# ------------------------------------------------------------------- build
Push-Location $crate
try {
    $cargoArgs = @('apk', 'build', '--lib')
    if (-not $Debug) { $cargoArgs += '--release' }
    if ($Target) { $cargoArgs += @('--target', $Target) }

    Write-Host "`n> cargo $($cargoArgs -join ' ')" -ForegroundColor Cyan

    # PowerShell 5.1 menganggap setiap baris stderr dari program native sebagai
    # error yang menghentikan skrip. Cargo menulis progres build ke stderr, jadi
    # perilaku itu harus dimatikan selama pemanggilan.
    $previous = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        & cargo @cargoArgs
        $code = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $previous
    }

    if ($code -ne 0) { throw "cargo apk build gagal (kode $code)" }
} finally {
    Pop-Location
}

# -------------------------------------------------------------------- hasil
$apkDir = if ($Debug) { 'debug' } else { 'release' }
$apk = Join-Path $crate "target\$apkDir\apk\korean-grammar-rust.apk"

if (Test-Path $apk) {
    $size = [math]::Round((Get-Item $apk).Length / 1MB, 2)
    Write-Host "`nAPK: $apk ($size MB)" -ForegroundColor Green
} else {
    throw "APK tidak ditemukan di $apk"
}
