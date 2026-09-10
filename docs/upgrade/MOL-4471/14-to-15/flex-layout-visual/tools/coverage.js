// coverage.js <manifest.json> <out COVERAGE.md>
// Maps every template in the flex-layout inventory to the route screenshot(s) that render it.
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '../../../../../..');
const inv = require(path.join(REPO, 'docs/upgrade/MOL-4471/14-to-15/00-baseline-14/flex-layout-inventory.json'));
const manifest = require(path.resolve(process.argv[2]));
const OUT = path.resolve(process.argv[3]);

function walk(d, a = []) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p, a) : a.push(p); } return a; }
const files = walk(path.join(REPO, 'src/app')).filter(f => !f.endsWith('.spec.ts'));
const read = f => fs.readFileSync(f, 'utf8');
const html = files.filter(f => f.endsWith('.html')).map(f => [f, read(f)]);
const ts = files.filter(f => f.endsWith('.ts')).map(f => [f, read(f)]);

// feature prefix -> app route prefix (app-routing.module.ts)
const featurePrefix = { dashboard: '/dashboard', accounts: '/accounts', transfers: '/transfers', 'bill-pay': '/bill-pay', cards: '/cards', statements: '/statements', alerts: '/alerts', profile: '/profile', messages: '/messages', rewards: '/rewards', onboarding: '/open-account', help: '/help', disclosures: '/disclosures', errors: '' };
// component class -> route path (from *-routing.module.ts)
const routed = {};
for (const [f, c] of ts.filter(([f]) => /routing\.module\.ts$/.test(f))) {
  const feat = (f.match(/features\/([^/]+)\//) || [])[1];
  const prefix = feat ? featurePrefix[feat] : '';
  for (const m of c.matchAll(/path:\s*'([^']*)'\s*,\s*component:\s*(\w+)/g)) {
    (routed[m[2]] = routed[m[2]] || []).push((prefix + '/' + m[1]).replace(/\/+/g, '/').replace(/\/$/, '') || '/');
  }
}
// shell routes (app-routing)
for (const m of read(path.join(REPO, 'src/app/app-routing.module.ts')).matchAll(/path:\s*'([^']*)'\s*,\s*component:\s*(\w+)/g)) {
  (routed[m[2]] = routed[m[2]] || []).push('/' + m[1]);
}

const info = {};
for (const t of inv.files) {
  const comp = t.file.replace(/\.html$/, '.ts');
  const src = read(path.join(REPO, comp));
  const cls = (src.match(/export class (\w+)/) || [])[1];
  const sel = (src.match(/selector:\s*['"]([^'"]+)/) || [])[1];
  info[t.file] = { cls, sel, usages: t.count, routes: routed[cls] || [] };
}
// resolve child templates to the routes of whoever renders them (transitively)
function routesFor(file, seen = new Set()) {
  const i = info[file];
  if (!i || seen.has(file)) return [];
  seen.add(file);
  if (i.routes.length) return i.routes;
  const out = new Set();
  if (i.sel) {
    for (const [f, c] of [...html, ...ts]) {
      const rel = path.relative(REPO, f);
      if (rel === file || rel === file.replace(/\.html$/, '.ts')) continue;
      if (!c.includes('<' + i.sel)) continue;
      const tmpl = rel.endsWith('.html') ? rel : rel; // inline template: use the .ts as the key
      const key = Object.keys(info).find(k => k === tmpl || k.replace(/\.html$/, '.ts') === tmpl);
      if (key) routesFor(key, seen).forEach(r => out.add(r));
      else {
        // host is not itself in the inventory: look up its routes by class
        const hcls = (read(f.replace(/\.html$/, '.ts')).match(/export class (\w+)/) || [])[1];
        (routed[hcls] || []).forEach(r => out.add(r));
        if (!routed[hcls] && /app\.component\.ts$/.test(f)) out.add('(app root, every route)');
      }
    }
    // dialogs opened programmatically
    for (const [f, c] of ts) if (c.includes('open(' + i.cls)) out.add('dialog from ' + path.basename(f, '.ts'));
  }
  return [...out];
}

// match concrete route paths (with params) to the manifest's captured routes
function shotsFor(routePattern) {
  const re = new RegExp('^' + routePattern.replace(/:[^/]+/g, '[^/]+').replace(/\*\*/, '.*') + '$');
  return manifest.shots.filter(s => re.test(s.route) && !s.error);
}

const rows = [];
let covered = 0, notReachable = 0, redirected = 0;
for (const t of inv.files) {
  const routes = routesFor(t.file);
  let shots = [];
  routes.forEach(r => shots.push(...shotsFor(r)));
  shots = [...new Set(shots.map(s => s.id))];
  const redirectedIds = [...new Set(manifest.shots.filter(s => shots.includes(s.id) && s.finalUrl && s.finalUrl !== s.route).map(s => s.id))];
  let status;
  if (shots.length && redirectedIds.length === shots.length) { status = 'REDIRECTED'; redirected++; }
  else if (shots.length) { status = 'captured'; covered++; }
  else { status = 'NOT REACHABLE'; notReachable++; }
  rows.push({ file: t.file, usages: t.count, routes, shots, status });
}

const FILE_NOTES = {
  'src/app/features/accounts/components/export-transactions/export-transactions.component.html': 'Dialog opened from the transaction list Export button; the local BFF returns 404 for account details so the transaction list (and its Export button) never renders for the fixture customer.',
  'src/app/features/transfers/components/transfer-review-step/transfer-review-step.component.html': 'The review step redirects to /transfers/new when no draft transfer exists in the store; the wizard cannot progress with the local BFF (no accounts resolve), so the step is not renderable here.',
  'src/app/shell/auth-callback/auth-callback.component.ts': 'Transient page shown for < 1 s while the Keystone code is exchanged; not screenshot-stable. Inline template, 2 usages.',
  'src/app/shell/idle-warning-dialog/idle-warning-dialog.component.ts': 'Opened by the shell after the idle timeout (minutes); not triggered during capture. Inline template.',
  'src/app/shell/sw-update-banner/sw-update-banner.component.ts': 'Only shown when the service worker reports a new version; the dev server has no service worker. Inline template.',
};
const NOTES = {
  'NOT REACHABLE': 'Declared but never rendered by any route, dialog or host template in this checkout (dead template) - CSS conversion is verified by code review + unit tests only.',
  'REDIRECTED': 'Route redirects before the template renders with the local BFF (see manifest finalUrl).'
};
const lines = [];
lines.push('# Flex-layout visual baseline - route/template coverage', '');
lines.push(`Generated from \`00-baseline-14/flex-layout-inventory.json\` (${inv.files.length} templates, ${inv.files.reduce((a, t) => a + t.count, 0)} usages) and \`manifest.json\` (${manifest.shots.length} screenshots, ${manifest.shots.filter(s => s.error).length} failed).`, '');
lines.push(`* Templates rendered by at least one captured route: **${covered}**`);
lines.push(`* Templates whose only route redirected away (not rendered): **${redirected}**`);
lines.push(`* Templates not reachable at runtime (no route/dialog/host renders the selector): **${notReachable}**`, '');
lines.push('Each captured route exists at 1280x800 and 375x812 (`<id>--<w>x<h>.png`). Route ids are the `id` column of `capture.js`.', '');
lines.push('| Template | fx usages | Rendered on route(s) | Screenshot ids | Status |');
lines.push('|---|---:|---|---|---|');
for (const r of rows) lines.push(`| \`${r.file.replace('src/app/', '')}\` | ${r.usages} | ${r.routes.map(x => `\`${x}\``).join(', ') || '-'} | ${r.shots.join(', ') || '-'} | ${r.status}${FILE_NOTES[r.file] ? ' - ' + FILE_NOTES[r.file] : ''} |`);
lines.push('', '## Status notes', '');
for (const [k, v] of Object.entries(NOTES)) lines.push(`* **${k}** - ${v}`);
lines.push('', '## Per-route capture details', '', '| id | route | final URL | viewport | page size | page errors |', '|---|---|---|---|---|---|');
for (const s of manifest.shots) lines.push(`| ${s.id} | \`${s.route}\` | ${s.finalUrl !== s.route ? '`' + s.finalUrl + '`' : '=' } | ${s.viewport} | ${s.pageSize ? s.pageSize.w + 'x' + s.pageSize.h : '-'} | ${(s.pageErrors || []).length ? s.pageErrors.map(e => '`' + e.replace(/\|/g, '/') + '`').join('<br>') : '-'} |`);
fs.writeFileSync(OUT, lines.join('\n') + '\n');
fs.writeFileSync(OUT.replace(/\.md$/, '.json'), JSON.stringify(rows.map(r => ({ ...r, note: FILE_NOTES[r.file] || '' })), null, 2));
console.log(`covered=${covered} redirected=${redirected} notReachable=${notReachable} -> ${OUT}`);
for (const r of rows.filter(r => r.status !== 'captured')) console.log(' ', r.status, r.file, r.routes.join(','));
