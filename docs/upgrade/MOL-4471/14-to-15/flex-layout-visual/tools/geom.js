// geom.js <baseline|candidate> <outJson> [routeFilter]
// Dumps, per route/viewport, every element that carries a flex-layout directive (baseline, Angular
// 14 app) or a mol-* layout class (candidate, Angular 15 app) in DOM order with its bounding box and
// inline style. geom-compare.js pairs the two dumps element-by-element and reports x/width (and
// the flex-layout-derived inline styles that were actually applied) so the conversion can be
// checked independently of MDC component heights.
const fs = require('fs');
const { launch, newPage, login, settle, nav, APP } = require('./lib');
const { ROUTES, VIEWPORTS, ACC } = require('./routes');

const MODE = process.argv[2];
const OUT = process.argv[3];
const FILTER = process.argv[4];
if (!['baseline', 'candidate'].includes(MODE) || !OUT) { console.error('usage: geom.js <baseline|candidate> <outJson> [filter]'); process.exit(2); }

function dump(mode) {
  const sel = mode === 'baseline'
    ? '[fxlayout],[fxlayoutgap],[fxlayoutalign],[fxflex],[fxlayout\\.lt-md],[fxlayoutgap\\.lt-md],[fxlayoutalign\\.lt-md],[fxflex\\.lt-md]'
    : '[class*="mol-flex"],[class*="mol-gap-"],[class*="mol-justify-"],[class*="mol-align-"]';
  const els = [...document.querySelectorAll(sel)].filter(el => mode === 'baseline' || [...el.classList].some(c => /^mol-(flex|gap|justify|align)/.test(c)));
  return els.map(el => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const directives = mode === 'baseline'
      ? [...el.attributes].filter(a => a.name.startsWith('fx')).map(a => `${a.name}="${a.value}"`).join(' ')
      : [...el.classList].filter(c => /^mol-(flex|gap|justify|align)/.test(c)).join(' ');
    return {
      tag: el.tagName.toLowerCase(), directives,
      x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height),
      display: cs.display, dir: cs.flexDirection, flex: cs.flex, jc: cs.justifyContent, ai: cs.alignItems,
      mr: cs.marginRight, mb: cs.marginBottom, minW: cs.minWidth, maxW: cs.maxWidth,
      inline: el.getAttribute('style') || '',
    };
  });
}

(async () => {
  const browser = await launch();
  const report = { mode: MODE, app: APP, at: new Date().toISOString(), routes: {} };
  for (const vp of VIEWPORTS) {
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
      const key = `${r.id}--${vp.width}x${vp.height}`;
      try {
        await page.evaluate(v => { if (v) sessionStorage.setItem('mol.transfers.pendingAmount', v); else sessionStorage.removeItem('mol.transfers.pendingAmount'); }, r.pendingAmount || '');
        await nav(page, routePath);
        if (!page.url().startsWith(APP)) { await login(page); await nav(page, routePath); }
        if (r.after) await r.after(page);
        await settle(page);
        const els = await page.evaluate(dump, MODE);
        report.routes[key] = { route: routePath, finalUrl: page.url().replace(APP, ''), docWidth: await page.evaluate(() => document.documentElement.scrollWidth), elements: els };
        console.log('ok  ', key, els.length, 'elements');
      } catch (e) {
        report.routes[key] = { route: routePath, error: e.message.split('\n')[0] };
        console.log('FAIL', key, e.message.split('\n')[0]);
      }
    }
    await ctx.close();
  }
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
