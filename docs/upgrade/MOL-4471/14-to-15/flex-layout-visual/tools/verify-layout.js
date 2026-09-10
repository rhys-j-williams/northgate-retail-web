// verify-layout.js <outJson> [routeFilter]
// Computed-style equivalence check for the flex-layout -> CSS conversion (MOL-4471).
// For every element carrying a mol-* layout class on every captured route/viewport, derive the
// styles @angular/flex-layout 14 would have written inline for the original directive (the class
// names are a 1:1 rename, see tools/flex-layout-convert.js) and compare with getComputedStyle.
// A mismatch means a utility class is being overridden (e.g. by a component or Canopy rule) - the
// case flex-layout never had because inline styles win.
const fs = require('fs');
const { launch, newPage, login, settle, nav, APP } = require('./lib');
const { ROUTES, VIEWPORTS, ACC } = require('./routes');

const OUT = process.argv[2] || 'verify-layout.json';
const FILTER = process.argv[3];

// Runs in the page. Returns [{el, prop, expected, actual}] mismatches and a count of checks.
function checkPage(ltMd) {
  const px = v => `${v}px`;
  const has = (el, c) => el.classList.contains(c);
  const cls = el => [...el.classList].filter(c => c.startsWith('mol-')).join(' ');
  const describe = el => `${el.tagName.toLowerCase()}[${cls(el)}]`;
  const out = { checks: 0, elements: 0, mismatches: [] };
  const expect = (el, prop, expected) => {
    out.checks++;
    const actual = getComputedStyle(el)[prop];
    if (String(actual) !== String(expected)) out.mismatches.push({ el: describe(el), prop, expected: String(expected), actual: String(actual) });
  };
  // Effective direction of a container, as flex-layout's fxLayout / fxLayout.lt-md resolved it.
  const dirOf = el => {
    if (!el) return null;
    if (ltMd && has(el, 'mol-flex-col-reverse--lt-md')) return 'column-reverse';
    if (ltMd && has(el, 'mol-flex-col--lt-md')) return 'column';
    if (has(el, 'mol-flex-col')) return 'column';
    if (has(el, 'mol-flex-row')) return 'row';
    return null;
  };
  const els = [...document.querySelectorAll('[class*="mol-flex"], [class*="mol-gap-"], [class*="mol-justify-"], [class*="mol-align-"]')];
  for (const el of els) {
    if (!cls(el)) continue;
    out.elements++;
    const dir = dirOf(el);
    // ---- fxLayout
    if (dir) { expect(el, 'display', 'flex'); expect(el, 'flexDirection', dir); expect(el, 'boxSizing', 'border-box'); }
    // ---- fxLayoutAlign
    const j = { 'mol-justify-start': 'flex-start', 'mol-justify-center': 'center', 'mol-justify-end': 'flex-end', 'mol-justify-between': 'space-between' };
    for (const c in j) if (has(el, c)) expect(el, 'justifyContent', (ltMd && has(el, 'mol-justify-start--lt-md')) ? 'flex-start' : j[c]);
    if (ltMd && has(el, 'mol-justify-start--lt-md')) expect(el, 'justifyContent', 'flex-start');
    const a = { 'mol-align-start': 'flex-start', 'mol-align-center': 'center', 'mol-align-end': 'flex-end', 'mol-align-stretch': 'stretch' };
    let cross = null;
    for (const c in a) if (has(el, c)) cross = a[c];
    if (ltMd && has(el, 'mol-align-start--lt-md')) cross = 'flex-start';
    if (ltMd && has(el, 'mol-align-stretch--lt-md')) cross = 'stretch';
    if (cross) { expect(el, 'alignItems', cross); expect(el, 'alignContent', cross); }
    // ---- fxLayoutGap: margin on every child but the last, on the main axis
    const gapCls = [...el.classList].find(c => /^mol-gap-\d+$/.test(c));
    let gap = gapCls ? +gapCls.split('-')[2] : null;
    const gapLt = [...el.classList].find(c => /^mol-gap-\d+--lt-md$/.test(c));
    if (ltMd && gapLt) gap = +gapLt.split('-')[2];
    if (gap !== null) {
      const kids = [...el.children];
      const side = dir === 'column' ? 'marginBottom' : dir === 'column-reverse' ? 'marginTop' : 'marginRight';
      kids.forEach((k, i) => { if (i < kids.length - 1) expect(k, side, px(gap)); });
    }
    // ---- fxFlex (main axis from the parent's effective direction)
    const pdir = dirOf(el.parentElement) || 'row';
    const horiz = pdir === 'row';
    const [min, max] = horiz ? ['minWidth', 'maxWidth'] : ['minHeight', 'maxHeight'];
    const flexAuto = ltMd && has(el, 'mol-flex-auto--lt-md');
    const flexish = [...el.classList].some(c => /^mol-flex(-\d+-1-0|-100|-basis-\d+|-fixed-\d+)?$/.test(c));
    if (flexAuto) {
      expect(el, 'flexGrow', '1'); expect(el, 'flexShrink', '1'); expect(el, 'flexBasis', 'auto');
      expect(el, 'minWidth', 'auto'); expect(el, 'maxWidth', 'none'); expect(el, 'minHeight', 'auto'); expect(el, 'maxHeight', 'none');
    } else if (flexish) {
      expect(el, 'boxSizing', 'border-box');
      if (has(el, 'mol-flex')) { expect(el, 'flexGrow', '1'); expect(el, 'flexShrink', '1'); expect(el, 'flexBasis', horiz ? '0%' : '1e-09px'); }
      const grow = [...el.classList].map(c => /^mol-flex-(\d+)-1-0$/.exec(c)).find(Boolean);
      if (grow) { expect(el, 'flexGrow', grow[1]); expect(el, 'flexShrink', '1'); expect(el, 'flexBasis', '0%'); }
      if (has(el, 'mol-flex-100')) { expect(el, 'flexGrow', '1'); expect(el, 'flexShrink', '1'); expect(el, 'flexBasis', '100%'); expect(el, max, '100%'); }
      const basis = [...el.classList].map(c => /^mol-flex-basis-(\d+)$/.exec(c)).find(Boolean);
      if (basis) { expect(el, 'flexGrow', '1'); expect(el, 'flexShrink', '1'); expect(el, 'flexBasis', px(basis[1])); expect(el, min, px(basis[1])); expect(el, max, px(basis[1])); }
      const fixed = [...el.classList].map(c => /^mol-flex-fixed-(\d+)$/.exec(c)).find(Boolean);
      if (fixed) { expect(el, 'flexGrow', '0'); expect(el, 'flexShrink', '0'); expect(el, 'flexBasis', px(fixed[1])); expect(el, min, px(fixed[1])); expect(el, max, px(fixed[1])); }
    }
  }
  return out;
}

(async () => {
  const browser = await launch();
  const report = { app: APP, checkedAt: new Date().toISOString(), routes: [], totals: { elements: 0, checks: 0, mismatches: 0 } };
  for (const vp of VIEWPORTS) {
    const ltMd = vp.width <= 959.98;
    const { ctx, page } = await newPage(browser, vp);
    await page.addInitScript(() => { Date.prototype.getHours = function () { return 18; }; });
    await login(page);
    let tx = null;
    for (const r of ROUTES) {
      if (FILTER && !r.id.includes(FILTER)) continue;
      let routePath = r.path;
      if (routePath.includes('__TX__')) {
        if (!tx) {
          await nav(page, `/accounts/${ACC}`);
          const hrefs = await page.$$eval('a[href*="/transactions/"]', as => as.map(a => a.getAttribute('href')));
          tx = hrefs.length ? hrefs[0].split('/transactions/')[1].split('/')[0] : 'TXN-000001';
        }
        routePath = routePath.replace('__TX__', tx);
      }
      try {
        await page.evaluate(v => { if (v) sessionStorage.setItem('mol.transfers.pendingAmount', v); else sessionStorage.removeItem('mol.transfers.pendingAmount'); }, r.pendingAmount || '');
        await nav(page, routePath);
        if (!page.url().startsWith(APP)) { await login(page); await nav(page, routePath); }
        if (r.after) await r.after(page);
        await settle(page);
        const res = await page.evaluate(checkPage, ltMd);
        const finalUrl = page.url().replace(APP, '');
        report.routes.push({ id: r.id, viewport: `${vp.width}x${vp.height}`, route: routePath, finalUrl, ...res });
        report.totals.elements += res.elements; report.totals.checks += res.checks; report.totals.mismatches += res.mismatches.length;
        console.log(`${res.mismatches.length ? 'MISMATCH' : 'ok      '} ${r.id}--${vp.width}x${vp.height} elements=${res.elements} checks=${res.checks} mismatches=${res.mismatches.length}`);
        for (const m of res.mismatches.slice(0, 10)) console.log(`   ${m.el} ${m.prop}: expected ${m.expected}, got ${m.actual}`);
      } catch (e) {
        report.routes.push({ id: r.id, viewport: `${vp.width}x${vp.height}`, route: routePath, error: e.message.split('\n')[0] });
        console.log(`FAIL ${r.id}--${vp.width}x${vp.height} ${e.message.split('\n')[0]}`);
      }
    }
    await ctx.close();
  }
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  await browser.close();
  console.log('totals:', JSON.stringify(report.totals));
})().catch(e => { console.error(e); process.exit(1); });
