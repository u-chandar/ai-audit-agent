$files = @(
  "c:\Users\ramachandran\Python\ai-audit-agent\index.html",
  "c:\Users\ramachandran\Python\ai-audit-agent\app.js"
)

$map = [ordered]@{
  '⌂'='H'; '＋'='+'; '◉'='*'; '⌬'='#'; '≡'='='; '⌄'='v'; '⌘'='@';
  '⌕'='?'; '♢'='o'; '↗'='up'; '↻'='refresh'; '→'='->'; '↓'='down';
  '⇢'='->'; '⇄'='<->'; '▣'='[ ]'; '◫'='[]'; '⌁'='~'; '✦'='*';
  '◎'='O'; '⛨'='!'; '⚿'='S'; '§'='C'; '✓'='OK'; '◇'='<>'; '▤'='#';
  '◌'='o'; '▶'='>'; 'Ⅱ'='II'; '▦'='#'; 'ƒ'='f'; '▲'='^'; '◆'='<>';
  '■'='[]'; '★'='*'; '⬢'='*'; '●'='*'; '◔'='[1]'; '◑'='[2]'; '◕'='[3]';
  '›'='>'; '−'='-'; '–'='-'; '—'='-'; '“'='"'; '”'='"'; '’'="'";
  '…'='...'; '·'=' - '; 'Σ'='SUM'; '×'='x'
}

foreach ($f in $files) {
  $txt = Get-Content -Raw -Encoding UTF8 $f
  foreach ($k in $map.Keys) {
    $txt = $txt.Replace($k, $map[$k])
  }
  Set-Content -Path $f -Value $txt -Encoding UTF8
}

Write-Output "ASCII normalization pass complete."
