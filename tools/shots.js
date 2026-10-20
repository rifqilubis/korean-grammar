// Driver tangkapan layar: menjalankan aplikasi desktop pada layar tertentu
// lalu memotret jendelanya. Dipakai untuk memeriksa tampilan tanpa HP.
//
//   node tools/shots.js
//
'use strict';
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXE = path.join(ROOT, 'android-rs', 'target', 'release', 'examples', 'desktop.exe');

// [nama berkas, KG_SCREEN, KG_TOPIC, KG_THEME]
const SHOTS = [
  ['shot-1-home.png', 'home', 0, 'dark'],
  ['shot-2-lesson.png', 'lesson', 0, 'dark'],
  ['shot-3-writing.png', 'writing', 0, 'dark'],
  ['shot-4-quiz.png', 'quiz', 0, 'dark'],
  ['shot-4b-quiz-answered.png', 'quiz', 0, 'dark', '1'],
  ['shot-5-result.png', 'result', 0, 'dark'],
  ['shot-6-home-light.png', 'home', 0, 'light'],
];
const HEAD = [
  'Add-Type -AssemblyName System.Windows.Forms,System.Drawing',
  "$sig = @'",
  '[DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);',
  '[DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);',
  '[DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);',
  '[DllImport("user32.dll")] public static extern bool SetProcessDPIAware();',
  'public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }',
  "'@",
  'Add-Type -MemberDefinition $sig -Name W -Namespace N',
  // Tanpa ini, GetWindowRect mengembalikan koordinat virtual (diskalakan DPI)
  // sedangkan CopyFromScreen memakai koordinat fisik, sehingga hasil potret
  // hanya menangkap sebagian jendela.
  '[N.W]::SetProcessDPIAware() | Out-Null',
];

function run(lines, name) {
  const f = path.join(__dirname, `_${name}.ps1`);
  fs.writeFileSync(f, '\ufeff' + lines.join('\n') + '\n', 'utf8');
  return execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${f}"`, {
    encoding: 'utf8',
  }).trim();
}

const FIND = 'Get-Process desktop -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1';

function windowRect() {
  const out = run(
    [
      ...HEAD,
      `$p = ${FIND}`,
      'if (-not $p) { Write-Output "NO"; exit 1 }',
      '[N.W]::ShowWindow($p.MainWindowHandle, 9) | Out-Null',
      '[N.W]::SetForegroundWindow($p.MainWindowHandle) | Out-Null',
      'Start-Sleep -Milliseconds 400',
      '$r = New-Object N.W+RECT',
      '[N.W]::GetWindowRect($p.MainWindowHandle, [ref]$r) | Out-Null',
      'Write-Output "$($r.Left),$($r.Top),$($r.Right),$($r.Bottom)"',
    ],
    'rect'
  );
  const [l, t, r, b] = out.split(',').map(Number);
  return { l, t, w: r - l, h: b - t };
}

function capture(out) {
  return run(
    [
      ...HEAD,
      `$p = ${FIND}`,
      'if (-not $p) { Write-Output "NO"; exit 1 }',
      '$r = New-Object N.W+RECT',
      '[N.W]::GetWindowRect($p.MainWindowHandle, [ref]$r) | Out-Null',
      '$w = $r.Right - $r.Left; $hh = $r.Bottom - $r.Top',
      '$bmp = New-Object System.Drawing.Bitmap $w, $hh',
      '$g = [System.Drawing.Graphics]::FromImage($bmp)',
      '$g.CopyFromScreen($r.Left, $r.Top, 0, 0, $bmp.Size)',
      `$bmp.Save("${out.replace(/\\/g, '\\\\')}", [System.Drawing.Imaging.ImageFormat]::Png)`,
      '$g.Dispose(); $bmp.Dispose()',
      'Write-Output "$w x $hh"',
    ],
    'cap'
  );
}

function kill() {
  try {
    execSync('powershell -NoProfile -Command "Get-Process desktop -ErrorAction SilentlyContinue | Stop-Process -Force"', {
      stdio: 'ignore',
    });
  } catch {}
}

async function main() {
  if (!fs.existsSync(EXE)) {
    console.error('belum dibangun:', EXE);
    process.exit(1);
  }

  for (const [name, screen, topic, theme, answer] of SHOTS) {
    kill();
    await new Promise((r) => setTimeout(r, 400));

    const child = spawn(EXE, [], {
      env: {
        ...process.env,
        KG_SCREEN: screen,
        KG_TOPIC: String(topic),
        KG_THEME: theme,
        ...(answer ? { KG_ANSWER: answer } : {}),
      },
      detached: true,
      stdio: 'ignore',
    });
    child.unref();

    await new Promise((r) => setTimeout(r, 2500));

    const rect = windowRect();
    const out = path.join(ROOT, name);
    const info = capture(out);
    console.log(`${name.padEnd(22)} ${screen.padEnd(8)} ${info}`);
  }

  kill();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
