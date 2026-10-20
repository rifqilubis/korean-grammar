# =====================================================================
# build-android.ps1  bangun APK Korean Grammar siap pasang dalam satu perintah.
#
#   powershell -ExecutionPolicy Bypass -File tools/build-android.ps1
#
# Langkah: setel variabel lingkungan Android -> `tauri android build`
# -> zipalign -> tanda tangan (keystore dibuat sekali, disimpan lokal)
# -> salin hasil ke build\korean-grammar.apk
# =====================================================================
param(
    [switch]$Aab,          # hasilkan .aab untuk Play Store, bukan .apk
    [switch]$NoSign,       # lewati penandatanganan (APK mentah)
    [string]$NdkVersion = "27.0.12077973"
)

$ErrorActionPreference = 'Continue'
# PowerShell 5.1 menganggap stderr dari program native sebagai error yang
# menghentikan skrip. Matikan perilaku itu; kita periksa $LASTEXITCODE sendiri.
$Root = Split-Path -Parent $PSScriptRoot

function Step($m) { Write-Host "`n==> $m" -ForegroundColor Cyan }
function Ok($m)   { Write-Host "    ok  $m" -ForegroundColor Green }
function Die($m)  { Write-Host "`nGAGAL: $m" -ForegroundColor Red; exit 1 }

# --------------------------------------------------------------- 1. Lingkungan
Step "Menyiapkan variabel lingkungan"

$sdk = $env:ANDROID_HOME
if (-not $sdk) { $sdk = $env:ANDROID_SDK_ROOT }
if (-not $sdk) { $sdk = "$env:LOCALAPPDATA\Android\Sdk" }
if (-not (Test-Path $sdk)) { Die "Android SDK tidak ditemukan. Jalankan tools/setup-android.ps1 dulu." }

$env:ANDROID_HOME = $sdk
$env:ANDROID_SDK_ROOT = $sdk
$env:ANDROID_NDK_HOME = "$sdk\ndk\$NdkVersion"
if (-not (Test-Path $env:ANDROID_NDK_HOME)) { Die "NDK $NdkVersion tidak ada di $sdk\ndk." }

$javaHome = $env:JAVA_HOME
if (-not $javaHome -or -not (Test-Path "$javaHome\bin\java.exe")) {
    $c = Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like "jdk-17*" } | Select-Object -First 1
    if ($c) { $javaHome = $c.FullName }
}
if (-not $javaHome) { Die "JDK 17 tidak ditemukan. Set JAVA_HOME." }
$env:JAVA_HOME = $javaHome

foreach ($p in @("C:\Program Files\nodejs", "$env:USERPROFILE\.cargo\bin", "$javaHome\bin", "$sdk\platform-tools")) {
    if ((Test-Path $p) -and ($env:Path -notlike "*$p*")) { $env:Path = "$p;$env:Path" }
}
Ok "SDK   : $sdk"
Ok "NDK   : $env:ANDROID_NDK_HOME"
Ok "JDK   : $javaHome"

# ---------------------------------------------------------------- 2. Build
Set-Location $Root

if ($Aab) {
    Step "Membangun AAB (release)"
    npx tauri android build --aab
} else {
    Step "Membangun APK (release, semua arsitektur)"
    npx tauri android build --apk
}
if ($LASTEXITCODE -ne 0) { Die "Build Gradle gagal. Lihat pesan di atas." }

# --------------------------------------------------------------- 3. Hasil
Step "Mencari berkas hasil"

$apkDir = Join-Path $Root "src-tauri\gen\android\app\build\outputs\apk\universal\release"
$apk = Get-ChildItem $apkDir -Filter "*.apk" -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -notlike "*unsigned*" } | Select-Object -First 1
if (-not $apk) {
    $apk = Get-ChildItem $apkDir -Filter "*.apk" -ErrorAction SilentlyContinue | Select-Object -First 1
}
$outDir = Join-Path $Root "build"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

if ($Aab) {
    $aab = Get-ChildItem (Join-Path $Root "src-tauri\gen\android\app\build\outputs\bundle") -Recurse -Filter "*.aab" -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $aab) { Die "AAB tidak ditemukan." }
    $final = Join-Path $outDir "korean-grammar.aab"
    Copy-Item $aab.FullName $final -Force
    Ok ("AAB: " + $final + "  (" + [math]::Round($aab.Length / 1MB, 2) + " MB)")
    exit 0
}

if (-not $apk) { Die "APK tidak ditemukan di $apkDir" }
Ok ("APK mentah: " + $apk.Name + "  (" + [math]::Round($apk.Length / 1MB, 2) + " MB)")

if ($NoSign) {
    $final = Join-Path $outDir "korean-grammar-unsigned.apk"
    Copy-Item $apk.FullName $final -Force
    Ok "APK: $final (belum ditandatangani, tidak bisa dipasang)"
    exit 0
}

# ------------------------------------------------------------ 4. Tanda tangan
Step "Menandatangani APK"

$buildTools = Get-ChildItem (Join-Path $sdk "build-tools") -Directory -ErrorAction SilentlyContinue |
    Sort-Object { [version]($_.Name -replace '[^0-9.]', '') } -Descending | Select-Object -First 1
if (-not $buildTools) { Die "build-tools tidak ditemukan." }

$zipalign = Join-Path $buildTools.FullName "zipalign.exe"
$apksigner = Join-Path $buildTools.FullName "apksigner.bat"

$keystoreDir = Join-Path $Root ".keystore"
New-Item -ItemType Directory -Force -Path $keystoreDir | Out-Null
$keystore = Join-Path $keystoreDir "korean-grammar.jks"
$propsFile = Join-Path $keystoreDir "keystore.properties"

if (-not (Test-Path $keystore)) {
    Write-Host "    membuat keystore baru (sekali saja)..."
    # Kata sandi acak kuat, disimpan di keystore.properties (jangan di-commit).
    $bytes = New-Object byte[] 24
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $pass = [Convert]::ToBase64String($bytes) -replace '[^A-Za-z0-9]', 'x'

    # keytool menulis progres ke stderr; arahkan ke berkas agar PowerShell 5.1
    # tidak menganggapnya error yang menghentikan skrip.
    # Start-Process menggabungkan array argumen dengan spasi tanpa tanda kutip,
    # jadi nilai yang berisi spasi (dname) harus dikutip sendiri.
    $ktLog = Join-Path $env:TEMP "kg-keytool.log"
    $ktArgLine = @(
        "-genkeypair -v"
        "-keystore `"$keystore`""
        "-alias korean-grammar"
        "-keyalg RSA -keysize 2048 -validity 10950"
        "-storepass $pass -keypass $pass"
        "-dname `"CN=Korean Grammar, OU=Mobile, O=Rifqi Lubis, L=Jakarta, C=ID`""
    ) -join ' '
    $proc = Start-Process -FilePath "$javaHome\bin\keytool.exe" -ArgumentList $ktArgLine `
        -NoNewWindow -Wait -PassThru -RedirectStandardError $ktLog
    if ($proc.ExitCode -ne 0) {
        Get-Content $ktLog -ErrorAction SilentlyContinue | Select-Object -Last 10 | ForEach-Object { Write-Host "    $_" }
        Die "keytool gagal membuat keystore."
    }

    @(
        "# Keystore rilis Korean Grammar  JANGAN di-commit / dibagikan."
        "# Simpan berkas ini bersama .jks; tanpa keduanya pembaruan aplikasi"
        "# tidak bisa ditandatangani dengan identitas yang sama."
        "storeFile=korean-grammar.jks"
        "storePassword=$pass"
        "keyAlias=korean-grammar"
        "keyPassword=$pass"
    ) | Set-Content $propsFile -Encoding utf8
    Ok "keystore dibuat: $keystore"
} else {
    Ok "keystore sudah ada: $keystore"
}

$cfg = @{}
Get-Content $propsFile | Where-Object { $_ -match '^\s*[^#].*=' } | ForEach-Object {
    $k, $v = $_ -split '=', 2
    $cfg[$k.Trim()] = $v.Trim()
}
$storePass = $cfg['storePassword']
$keyPass = $cfg['keyPassword']
$alias = $cfg['keyAlias']
if (-not $storePass) { Die "storePassword tidak ada di $propsFile" }

# Jalankan perkakas native lewat Start-Process agar stderr-nya tidak memicu
# error PowerShell 5.1; hasilnya ditampilkan dari berkas log.
function RunTool($exe, $argLine, $label) {
    $log = Join-Path $env:TEMP "kg-tool.log"
    $p = Start-Process -FilePath $exe -ArgumentList $argLine -NoNewWindow -Wait -PassThru `
        -RedirectStandardOutput $log -RedirectStandardError "$log.err"
    $out = @()
    if (Test-Path $log)     { $out += Get-Content $log }
    if (Test-Path "$log.err") { $out += Get-Content "$log.err" }
    if ($p.ExitCode -ne 0) {
        $out | Select-Object -Last 15 | ForEach-Object { Write-Host "    $_" }
        Die "$label gagal (exit $($p.ExitCode))."
    }
    Remove-Item $log, "$log.err" -Force -ErrorAction SilentlyContinue
    return $out
}

$aligned = Join-Path $outDir "aligned.tmp.apk"
RunTool $zipalign "-f -p 4 `"$($apk.FullName)`" `"$aligned`"" "zipalign" | Out-Null
Ok "zipalign selesai"

$final = Join-Path $outDir "korean-grammar.apk"
# v4 (.idsig) tidak diperlukan untuk pemasangan manual; matikan agar hasilnya
# hanya satu berkas APK.
$signLine = "sign --v4-signing-enabled false --ks `"$keystore`" --ks-key-alias $alias " +
            "--ks-pass `"pass:$storePass`" --key-pass `"pass:$keyPass`" " +
            "--out `"$final`" `"$aligned`""
RunTool $apksigner $signLine "apksigner sign" | Out-Null
Remove-Item $aligned -Force -ErrorAction SilentlyContinue
Ok "APK ditandatangani"

Step "Memeriksa tanda tangan"
$verifyLines = RunTool $apksigner "verify --print-certs `"$final`"" "apksigner verify"
$verifyLines | Select-Object -First 6 | ForEach-Object { Write-Host "    $_" }

# ------------------------------------------------------------- 5. Ringkasan
$size = (Get-Item $final).Length / 1MB
Write-Host @"

APK siap dipasang:
    $final
    $([math]::Round($size, 2)) MB

Pasang ke HP (USB debugging aktif):
    adb install -r "$final"

Atau salin berkasnya ke HP lalu buka dari File Manager.
"@ -ForegroundColor Green
