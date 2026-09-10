// diff.js <baselineDir> <candidateDir> <diffDir>
// Pixel-diffs every PNG pair (pixelmatch, threshold 0.1). Images of different heights are compared
// on a canvas of the larger size; the missing area counts as changed. Writes <id>.diff.png per pair
// and diff/stats.json.
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const [BASE, CAND, OUT] = process.argv.slice(2).map(p => path.resolve(p));
fs.mkdirSync(OUT, { recursive: true });

function read(p) { return PNG.sync.read(fs.readFileSync(p)); }
function pad(img, w, h) {
  if (img.width === w && img.height === h) return img;
  const out = new PNG({ width: w, height: h });
  out.data.fill(0);
  PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
  return out;
}

const files = fs.readdirSync(BASE).filter(f => f.endsWith('.png')).sort();
const stats = [];
for (const f of files) {
  const cp = path.join(CAND, f);
  if (!fs.existsSync(cp)) { stats.push({ file: f, missing: true }); continue; }
  const a = read(path.join(BASE, f)), b = read(cp);
  const w = Math.max(a.width, b.width), h = Math.max(a.height, b.height);
  const pa = pad(a, w, h), pb = pad(b, w, h);
  const diff = new PNG({ width: w, height: h });
  const changed = pixelmatch(pa.data, pb.data, diff.data, w, h, { threshold: 0.1, includeAA: false });
  const total = w * h;
  // first/last changed row, to say where on the page the change is
  let firstRow = -1, lastRow = -1;
  for (let y = 0; y < h && firstRow < 0; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; if (diff.data[i] === 255 && diff.data[i + 1] === 0) { firstRow = y; break; } }
  for (let y = h - 1; y >= 0 && lastRow < 0; y--) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; if (diff.data[i] === 255 && diff.data[i + 1] === 0) { lastRow = y; break; } }
  const diffFile = f.replace(/\.png$/, '.diff.png');
  fs.writeFileSync(path.join(OUT, diffFile), PNG.sync.write(diff));
  stats.push({ file: f, diffFile, baseline: { w: a.width, h: a.height }, candidate: { w: b.width, h: b.height }, changed, total, pct: +(100 * changed / total).toFixed(2), firstRow, lastRow });
  console.log(`${f.padEnd(52)} ${String(changed).padStart(8)} / ${total} (${(100 * changed / total).toFixed(2)}%)  ${a.width}x${a.height} -> ${b.width}x${b.height}`);
}
fs.writeFileSync(path.join(OUT, 'stats.json'), JSON.stringify(stats, null, 2));
