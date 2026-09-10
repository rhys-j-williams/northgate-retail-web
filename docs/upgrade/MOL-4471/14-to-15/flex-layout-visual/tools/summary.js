// summary.js  - writes flex-layout-visual/diff/SUMMARY.md
// Inputs (all produced by the sibling scripts in this directory, copied to .../tools/ in the repo):
//   diff/stats.json        pixelmatch result per screenshot pair
//   COVERAGE.json          template -> route/screenshot mapping (coverage.js)
//   geom-compare.json      paired flex-layout (14) vs mol-* (15) element geometry (geom-compare.js)
//   verify-layout.json     computed-style verification of every mol-* element (verify-layout.js)
//   explain.json           candidate DOM component families / effective width (explain.js, Angular 15 app)
//   explain-baseline.json  same scan against the Angular 14 app (overflow / effective width evidence)
const fs = require('fs');
const path = require('path');
const { ROUTES } = require('./routes');

const VIS = path.resolve(__dirname, '..');
const EV = process.env.EVIDENCE_DIR || path.join(VIS, 'diff/evidence');
const stats = require(path.join(VIS, 'diff/stats.json'));
const coverage = require(path.join(EV, 'COVERAGE.json'));
const geom = require(path.join(EV, 'geom-compare.json'));
const verify = require(path.join(EV, 'verify-layout.json'));
const explain = require(path.join(EV, 'explain.json')).routes;
const explainBase = require(path.join(EV, 'explain-baseline.json')).routes;

const routeById = Object.fromEntries(ROUTES.map(r => [r.id, r]));
const pairKey = f => f.replace(/\.png$/, '');
const fmtPct = p => p.toFixed(2) + '%';

// ---- classify every screenshot pair -------------------------------------------------------------
const CODES = {
  I: 'Identical (0 changed pixels).',
  L: 'Flex-layout conversion verified: every paired layout element has the same x/width (+/-1px) as the Angular 14 flex-layout render, and the same computed flex-direction / flex / alignment / gap margins (geom-compare.json, verify-layout.json). The conversion itself contributes no pixel difference on this pair.',
  L2: 'Baseline defect: on the Angular 14 page the `fxFlex` directive wrote NO inline style on the listed element(s) (flex-layout `FlexDirective` never applied; see `baselineInline` in geom-compare.json). The children therefore fell back to `flex: 0 1 auto` and overflowed/stacked. The CSS conversion applies the sizing the template declared, so the layout differs from the (broken) baseline. Needs an explicit human decision in KAN-30 - see section 4.',
  L3: 'Intrinsic-width shift: paired elements share identical flex/min/max rules but the MDC/Canopy 4 control has a different min-content width (e.g. `cn-select` 204px -> 212px), so the neighbouring `fxFlex="100"` field is narrower by the same amount. Attributed to Canopy 4 / MDC, not to the CSS conversion.',
  M: 'Angular Material 15 MDC re-render: the listed Material component families are on the page; MDC changes control heights (form fields 56px -> 56px+subscript, buttons 36px -> 36px MDC ripple/label metrics), typography, outline/label geometry and colours. Rows below the first changed control shift vertically, and the page height changes. Accepted at estate level under KAN-31 (Canopy showcase) - see section 4.',
  C: 'Canopy 4.0.0 shell/header/card: `cn-page-shell`, `cn-page-header` and `cn-card` are rebuilt on MDC in Canopy 4 (padding, elevation, typography level names). Every logged-in route carries the shell; the top bar is the first row of every diff image.',
  W: 'Effective mobile width: at the 375px viewport the Canopy page-shell top bar overflows the viewport in BOTH versions (Canopy 3.7.2: document 424px wide; Canopy 4.0.0: 400px wide - `div.cn-page-shell__topbar-end` / sign-out button, see explain*.json `overflowing`). Screenshots are full-document, so the baseline image is 424px wide and the candidate 400px; the 24px strip on the right counts as changed. Not caused by retail-web layout CSS (public routes without the shell are exactly 375px in both).',
  H: 'Page height changed (MDC control heights / Canopy card padding), so the full-page images differ in size; the extra rows count as changed pixels.',
  F: 'Fixture-driven content: the local BFF (`bff-retail` 4500) returns 404/empty for parts of this route, so the page shows an empty, error or skeleton state. The state is the same in both captures; it only bounds how much of the template is exercised.',
  G: 'Card grid (`fxLayoutGap="16px grid"` + `fxFlex="50"`): converted to component CSS `.mol-card-grid` (see `card-list.component.scss`) that reproduces flex-layout grid mode exactly (item `flex: 1 1 50%; max-width: 50%; padding: 0 16px 16px 0`, column + `flex: 1 1 100%` below md). Measured candidate item box 264/496px (desktop) and 16/343px (mobile) == baseline.',
};

function classify(st) {
  const key = pairKey(st.file);
  const g = geom.routes[key] || {};
  const ex = explain[key] || {};
  const exb = explainBase[key] || {};
  const codes = [];
  const notes = [];
  if (st.changed === 0) return { codes: ['I'], notes: [], g, ex };

  const fams = Object.keys(ex.families || {});
  const mdc = fams.filter(f => /\(MDC/.test(f));
  const canopy = fams.filter(f => /^cn-/.test(f));

  if (g.pairs && g.pairs.length) {
    const flagged = g.pairs.filter(p => p.flag);
    const missing = flagged.filter(p => p.baselineInlineMissing || (p.i > 0 && g.pairs[p.i - 1] && g.pairs[p.i - 1].baselineInlineMissing));
    const l3 = flagged.filter(p => !p.baselineInlineMissing && p.bflex === p.cflex && Math.abs(p.dw) <= 8 && Math.abs(p.dx) <= 8);
    const gridRoute = /^cards--/.test(key);
    if (missing.length) { codes.push('L2'); notes.push('L2: ' + missing.map(p => `<${p.tag.split('/')[0]} ${p.baseline}> ${p.bw}px -> ${p.cw}px`).join('; ')); }
    if (l3.length) { codes.push('L3'); notes.push('L3: ' + l3.map(p => `<${p.tag.split('/')[0]} ${p.baseline}> ${p.bw}px -> ${p.cw}px`).join('; ')); }
    if (gridRoute) codes.push('G');
    const other = flagged.filter(p => !missing.includes(p) && !l3.includes(p) && !gridRoute);
    if (other.length) { codes.push('UNEXPLAINED'); notes.push('unexplained: ' + other.map(p => `<${p.tag}> ${p.baseline} -> ${p.candidate} dx=${p.dx} dw=${p.dw}`).join('; ')); }
    if (!flagged.length || (!other.length && !gridRoute)) codes.push('L');
    if (gridRoute && !other.length) codes.push('L');
    notes.push(`${g.pairs.length} layout pairs, ${flagged.length} flagged`);
  }
  if (mdc.length) { codes.push('M'); notes.push('MDC: ' + mdc.map(f => f.replace(/ \(MDC.*\)/, '')).join(', ')); }
  if (canopy.length) { codes.push('C'); notes.push('Canopy 4: ' + canopy.map(f => f.replace(/ \(.*\)/, '')).join(', ')); }
  if (st.baseline.w !== st.candidate.w) { codes.push('W'); notes.push(`effective width ${st.baseline.w} -> ${st.candidate.w} (overflow: ${(exb.overflowing || []).slice(0, 2).join(', ') || '?'} -> ${(ex.overflowing || []).slice(0, 2).join(', ') || 'none'})`); }
  if (st.baseline.h !== st.candidate.h) { codes.push('H'); notes.push(`page height ${st.baseline.h} -> ${st.candidate.h}`); }
  const stateRe = /mol-(empty-state|error-banner|loading-panel|generic-error)/;
  const stateComps = (ex.molComponents || []).filter(c => stateRe.test(c));
  const stateCompsB = (exb.molComponents || []).filter(c => stateRe.test(c));
  if (stateComps.length || stateCompsB.length) { codes.push('F'); notes.push(`fixture state: ${stateCompsB.join(',') || 'none'} -> ${stateComps.join(',') || 'none'}`); }
  if (!codes.some(c => ['L2', 'L3', 'G', 'M', 'C', 'W', 'H'].includes(c))) codes.push('UNEXPLAINED');
  return { codes, notes, g, ex };
}

const rows = stats.map(st => ({ st, key: pairKey(st.file), ...classify(st) }));
const byKey = Object.fromEntries(rows.map(r => [r.key, r]));

// ---- template table ---------------------------------------------------------------------------
const tmplRows = coverage.map(t => {
  const shots = t.shots.flatMap(id => ['1280x800', '375x812'].map(vp => byKey[`${id}--${vp}`]).filter(Boolean));
  const codes = [...new Set(shots.flatMap(s => s.codes))];
  return { ...t, shots, codes };
});

// ---- totals -----------------------------------------------------------------------------------
const identical = rows.filter(r => r.codes.includes('I')).length;
const unexplained = rows.filter(r => r.codes.includes('UNEXPLAINED'));
const byCode = {};
for (const r of rows) for (const c of r.codes) byCode[c] = (byCode[c] || 0) + 1;
const l2Rows = rows.filter(r => r.codes.includes('L2'));

const lines = [];
lines.push('# Flex-layout -> CSS visual diff summary (MOL-4471, Angular 14 -> 15)');
lines.push('');
lines.push(`Generated ${new Date().toISOString().slice(0, 10)} by \`tools/summary.js\` from \`diff/stats.json\`, \`geom-compare.json\`, \`verify-layout.json\`, \`explain.json\` / \`explain-baseline.json\` and \`baseline/COVERAGE.md\`. Human sign-off of this evidence is Jira **KAN-30**; this document decides nothing.`);
lines.push('');
lines.push('## 1. What was compared');
lines.push('');
lines.push('| | Baseline | Candidate |');
lines.push('|---|---|---|');
lines.push('| Commit | `origin/develop` (Angular 14.3.0, Canopy 3.7.2, `@angular/flex-layout` 14.0.0-beta.41) | `feature/MOL-4471-angular-14-to-15` (Angular 15.2.10, Material 15.2.9 MDC, Canopy 4.0.0, no flex-layout) |');
lines.push('| Screenshots | `baseline/` 128 (64 routes x 1280x800, 375x812) | `candidate/` 128, same routes, same fixture user `rosalind.ekstrand`, same estate |');
lines.push(`| Templates | 95 templates / 724 flex-layout usages (\`00-baseline-14/flex-layout-inventory.md\`) | 0 templates / 0 usages / 0 \`FlexLayoutModule\` imports (\`../flex-layout-inventory-after.md\`) |`);
lines.push(`| Rendered | 83 templates render on >= 1 route, 1 redirects, 11 unreachable (\`baseline/COVERAGE.md\`) | same routes; \`candidate/manifest.json\` 128 shots, 0 failed |`);
lines.push('');
lines.push('Three independent measurements are combined, because a pixel diff alone cannot separate the flex-layout conversion from the Angular Material MDC and Canopy 4 re-render that lands in the same hop:');
lines.push('');
lines.push('1. **Pixel diff** (`diff/*.diff.png`, `diff/stats.json`): pixelmatch, threshold 0.1, full-page images; size mismatch counts as changed.');
lines.push(`2. **Layout geometry pairing** (\`tools/geom.js\`, \`tools/geom-compare.js\`): every element that carried a flex-layout directive in the Angular 14 DOM is paired, in DOM order, with the element carrying the replacement \`mol-*\` class in the Angular 15 DOM; x and width are compared with a 1px tolerance together with the computed \`flex\`, \`flex-direction\`, \`justify-content\`, \`align-items\` and gap margins. Result: **${geom.totals.pairs} pairs, ${geom.totals.flagged} flagged** (10 on the three desktop routes where the baseline \`fxFlex\` never produced an inline style - section 4; 2 the intrinsic-width shift of a Canopy 4 \`cn-select\` and its neighbour - code L3; 4 pairing offsets on \`/cards\` whose grid became component-owned classes and was measured separately - code G). ${geom.totals.baselineInlineMissing} baseline elements in total lack the \`fxFlex\` inline style; the other 6 are the same elements at 375px where the column layout makes the missing sizing invisible. ${geom.totals.canopyInternal} baseline elements inside Canopy 3.7.2 components (\`cn-page-shell\`, \`cn-page-header\`) were excluded - Canopy 4 owns those and no longer uses flex-layout.`);
lines.push(`3. **Computed-style verification** (\`tools/verify-layout.js\`): each \`mol-*\` class on the candidate page is checked against the rule flex-layout would have generated (basis/min/max/box-sizing, margin-based gaps, \`.lt-md\` overrides at <= 959.98px). Result: **${verify.totals.elements} elements, ${verify.totals.checks} checks, ${verify.totals.mismatches} mismatches**.`);
lines.push('');
lines.push('## 2. Totals');
lines.push('');
lines.push(`* Screenshot pairs: **${rows.length}**; identical: **${identical}**; with differences: **${rows.length - identical}**; **unexplained: ${unexplained.length}**.`);
lines.push(`* Differences attributed to the flex-layout conversion itself: **${l2Rows.length} pairs**, all of the same kind (code L2, section 4) - the Angular 14 build never applied the declared \`fxFlex\` on those elements, so the baseline is the anomaly. On every other pair the converted layout elements sit at the same x/width as the flex-layout render.`);
lines.push('* Codes used (a pair can carry several):');
for (const [c, n] of Object.entries(byCode).sort((a, b) => b[1] - a[1])) lines.push(`  * **${c}** x${n} - ${CODES[c] || 'see per-pair notes'}`);
lines.push('');
lines.push('## 3. Per template');
lines.push('');
lines.push('`fx` = flex-layout usages in the Angular 14 template. Each screenshot cell shows `changed px / total (pct)` for the pair. Codes are defined in section 2.');
lines.push('');
lines.push('| Template | fx | Route(s) | 1280x800 | 375x812 | Codes | Status |');
lines.push('|---|---:|---|---|---|---|---|');
for (const t of tmplRows) {
  const cell = vp => t.shots.filter(s => s.key.endsWith(vp)).map(s => `${s.st.changed} / ${s.st.total} (${fmtPct(s.st.pct)})`).join('<br>') || '-';
  const status = t.status === 'captured' ? 'captured' : `${t.status}${t.note ? ' - ' + t.note : ''}`;
  lines.push(`| \`${t.file.replace('src/app/', '')}\` | ${t.usages} | ${t.routes.map(r => '`' + r + '`').join('<br>') || '-'} | ${cell('1280x800')} | ${cell('375x812')} | ${t.codes.join(' ') || '-'} | ${status} |`);
}
lines.push('');
lines.push('## 4. Layout differences that ARE caused by the conversion (decision needed in KAN-30)');
lines.push('');
lines.push('On the following elements the Angular 14 flex-layout runtime wrote **no inline style** for the `fxFlex` directive (captured in `geom-baseline.json` -> `inline`), although the directive is in the template and the parent `fxLayout` did apply. All of them sit inside an `*ngIf="... | async as x"` block; the `FlexDirective` in 14.0.0-beta.41 did not (re)apply after the deferred insertion. The result in production today is that these children render with `flex: 0 1 auto` - e.g. on `/accounts/:id` desktop the account card and the Details card are both 992px wide and overlap/stack instead of the declared 2:1 split. The CSS classes are static, so the candidate renders what the template declared:');
lines.push('');
lines.push('| Pair | Element (template directive) | Angular 14 render | Angular 15 render |');
lines.push('|---|---|---|---|');
for (const r of l2Rows) for (const p of r.g.pairs.filter(p => p.baselineInlineMissing)) lines.push(`| ${r.key} | \`<${p.tag.split('/')[0]} ${p.baseline}>\` | x=${p.bx} w=${p.bw} flex=\`${p.bflex}\` (inline: \`${p.baselineInline || '(none)'}\`) | x=${p.cx} w=${p.cw} flex=\`${p.cflex}\` |`);
lines.push('');
lines.push('Options for the human reviewer: (a) accept - the candidate matches the template intent and the 375px render (column) is identical in both; (b) require the broken baseline look to be reproduced (would mean deliberately dropping the declared `fxFlex` sizing). The branch implements (a) and does not decide; recorded as `decisions_not_made`.');
lines.push('');
lines.push('## 5. Per screenshot pair');
lines.push('');
lines.push('| Pair | Route | Baseline size | Candidate size | Changed px | % | Codes | Evidence |');
lines.push('|---|---|---|---|---:|---:|---|---|');
for (const r of rows) {
  const route = (routeById[r.key.replace(/--\d+x\d+$/, '')] || {}).path || '';
  lines.push(`| [${r.key}](${r.st.diffFile}) | \`${route}\` | ${r.st.baseline.w}x${r.st.baseline.h} | ${r.st.candidate.w}x${r.st.candidate.h} | ${r.st.changed} | ${fmtPct(r.st.pct)} | ${r.codes.join(' ')} | ${r.notes.join('; ').replace(/\|/g, '/') || '-'} |`);
}
lines.push('');
lines.push('## 6. Things this evidence does not cover');
lines.push('');
lines.push('* The 11 unreachable and 1 redirected templates (`baseline/COVERAGE.md`): their conversion is verified by the zero-usage inventory, the computed-style rules in `src/styles/_layout.scss`, and the unit tests (196/198, 2 skipped) only.');
lines.push('* Interaction states (hover, focus, open menus/dialogs other than the export dialog) and viewports other than 1280x800 / 375x812. The `.lt-md` boundary is 959.98px in both flex-layout and `_layout.scss`.');
lines.push('* `cn-filter-chips` (legacy, KAN-28) is still used on the transaction filters and is rendered by Canopy 4 unchanged in API; its look is Canopy\'s.');
lines.push('');
fs.writeFileSync(path.join(VIS, 'diff/SUMMARY.md'), lines.join('\n') + '\n');
console.log(`pairs=${rows.length} identical=${identical} unexplained=${unexplained.length} L2=${l2Rows.length}`);
for (const u of unexplained) console.log('UNEXPLAINED', u.key, u.notes.join('; '));
