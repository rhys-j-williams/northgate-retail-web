// geom-compare.js <geom-baseline.json> <geom-candidate.json> <outJson>
// Pairs flex-layout elements (Angular 14 baseline) with mol-* elements (candidate) in DOM order,
// per route/viewport, and compares the horizontal geometry (x, width) plus the resolved flex
// properties. Heights/y are deliberately NOT compared: they move with the MDC component re-render.
// A pair is flagged when |dx| or |dw| > TOL px. Also reports elements whose flex-layout inline
// style was never written in the baseline (the directive did not apply, see SUMMARY.md).
const fs = require('fs');
const [B, C, OUT] = process.argv.slice(2);
const TOL = 1;
const b = JSON.parse(fs.readFileSync(B, 'utf8'));
const c = JSON.parse(fs.readFileSync(C, 'utf8'));

// Baseline elements inside Canopy 3.7.2 components (cn-page-shell/cn-page-header/...) also carried
// flex-layout directives; the candidate Canopy 4 replaces them with its own CSS, so they have no
// mol-* counterpart. Filter them out by directive signature.
const CANOPY_SIGS = new Set([
  'fxlayout="row" fxlayoutalign="space-between center" fxlayoutgap="12px"', // shell topbar
  'fxlayout="row" fxlayoutalign="start center" fxlayoutgap="8px"',         // shell topbar start
  'fxlayout="row" fxlayoutalign="end center" fxlayoutgap="4px"',           // shell topbar end
  'fxlayout="row" fxflex="1 1 auto"',                                      // shell body
  'fxflex="0 0 auto"',                                                     // shell nav
  'fxflex="1 1 auto"',                                                     // shell main / header titles
  'fxlayout="row" fxlayout.lt-md="column" fxlayoutalign="space-between flex-end" fxlayoutalign.lt-md="start stretch" fxlayoutgap="16px"', // header row
  'fxflex="0 0 auto" fxlayout="row" fxlayoutgap="8px"',                   // header actions
  'fxlayout="row wrap" fxlayoutalign="start center" fxlayoutgap="8px"',    // header breadcrumbs
]);
const norm = s => s.split(' ').sort().join(' ');
const canopySigs = new Set([...CANOPY_SIGS].map(norm));

const out = { tol: TOL, routes: {}, totals: { pairs: 0, flagged: 0, unpaired: 0, baselineInlineMissing: 0, canopyInternal: 0 } };
for (const key of Object.keys(b.routes)) {
  const rb = b.routes[key], rc = c.routes[key];
  if (!rb || !rc || rb.error || rc.error) { out.routes[key] = { error: (rb && rb.error) || (rc && rc.error) || 'missing' }; continue; }
  const be = rb.elements.filter(e => {
    const isCanopy = canopySigs.has(norm(e.directives)) && ['header', 'div', 'nav', 'main'].includes(e.tag);
    if (isCanopy) out.totals.canopyInternal++;
    return !isCanopy;
  });
  const ce = rc.elements;
  const n = Math.min(be.length, ce.length);
  const pairs = [];
  let flagged = 0, inlineMissing = 0;
  for (let i = 0; i < n; i++) {
    const x = be[i], y = ce[i];
    const dx = y.x - x.x, dw = y.w - x.w;
    const hasFx = /fxflex/.test(x.directives);
    const missing = hasFx && !/flex/.test(x.inline);
    if (missing) inlineMissing++;
    const flag = Math.abs(dx) > TOL || Math.abs(dw) > TOL || x.tag !== y.tag;
    if (flag) flagged++;
    pairs.push({ i, tag: `${x.tag}/${y.tag}`, baseline: x.directives, candidate: y.directives, bx: x.x, bw: x.w, cx: y.x, cw: y.w, dx, dw, bflex: x.flex, cflex: y.flex, bdir: x.dir, cdir: y.dir, baselineInline: x.inline, baselineInlineMissing: missing, flag });
  }
  out.routes[key] = { route: rb.route, docWidthBaseline: rb.docWidth, docWidthCandidate: rc.docWidth, baselineCount: be.length, candidateCount: ce.length, flagged, inlineMissing, pairs };
  out.totals.pairs += n; out.totals.flagged += flagged; out.totals.unpaired += Math.abs(be.length - ce.length); out.totals.baselineInlineMissing += inlineMissing;
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out.totals));
for (const [k, r] of Object.entries(out.routes)) {
  if (r.error) { console.log('ERR ', k, r.error); continue; }
  if (r.baselineCount !== r.candidateCount || r.flagged) {
    console.log(`${k}: baseline=${r.baselineCount} candidate=${r.candidateCount} flagged=${r.flagged} inlineMissing=${r.inlineMissing} docW ${r.docWidthBaseline}->${r.docWidthCandidate}`);
    for (const p of r.pairs.filter(p => p.flag).slice(0, 6)) console.log(`   #${p.i} ${p.tag} [${p.baseline}] -> [${p.candidate}] x ${p.bx}->${p.cx} w ${p.bw}->${p.cw} flex ${p.bflex}->${p.cflex}${p.baselineInlineMissing ? ' (baseline fxFlex inline style missing)' : ''}`);
  }
}
