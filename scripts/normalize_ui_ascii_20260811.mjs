import fs from 'node:fs';

const files = [
  'c:/Users/ramachandran/Python/ai-audit-agent/index.html',
  'c:/Users/ramachandran/Python/ai-audit-agent/app.js'
];

const replacements = [
  ['\u2302', 'H'], ['\uFF0B', '+'], ['\u25C9', '*'], ['\u232C', '#'], ['\u2261', '='], ['\u2304', 'v'], ['\u2318', '@'],
  ['\u2315', '?'], ['\u2662', 'o'], ['\u2197', 'up'], ['\u21BB', 'refresh'], ['\u2192', '->'], ['\u2193', 'down'],
  ['\u21E2', '->'], ['\u21C4', '<->'], ['\u25A3', '[ ]'], ['\u25EB', '[]'], ['\u2301', '~'], ['\u2726', '*'],
  ['\u25CE', 'O'], ['\u26E8', '!'], ['\u26BF', 'S'], ['\u00A7', 'C'], ['\u2713', 'OK'], ['\u25C7', '<>'], ['\u25A4', '#'],
  ['\u25CC', 'o'], ['\u25B6', '>'], ['\u2161', 'II'], ['\u25A6', '#'], ['\u0192', 'f'], ['\u25B2', '^'], ['\u25C6', '<>'],
  ['\u25A0', '[]'], ['\u2605', '*'], ['\u2B22', '*'], ['\u25CF', '*'], ['\u25D4', '[1]'], ['\u25D1', '[2]'], ['\u25D5', '[3]'],
  ['\u203A', '>'], ['\u2212', '-'], ['\u2013', '-'], ['\u2014', '-'], ['\u201C', '"'], ['\u201D', '"'], ['\u2019', "'"],
  ['\u2026', '...'], ['\u00B7', ' - '], ['\u03A3', 'SUM'], ['\u00D7', 'x'], ['\u2022', '*']
];

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }
  text = text.replace(/[^\x00-\x7F]/g, '');
  fs.writeFileSync(file, text, 'utf8');
}

console.log('ASCII normalization pass complete.');
