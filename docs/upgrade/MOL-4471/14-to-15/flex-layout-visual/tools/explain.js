// explain.js <outJson> [routeFilter]
// For every captured route/viewport, records which Angular Material MDC / Canopy 4 component
// families are present in the candidate DOM and the rendered document width. Used by
// summary.js to attribute pixel differences (MDC re-render vs shell vs flex-layout conversion).
const fs = require('fs');
const { launch, newPage, login, settle, nav, APP } = require('./lib');
const { ROUTES, VIEWPORTS, ACC } = require('./routes');

const OUT = process.argv[2] || 'explain.json';
const FILTER = process.argv[3];

function scan() {
  const q = s => document.querySelectorAll(s).length;
  const fam = {
    'mat-form-field (MDC outline)': q('.mat-mdc-form-field'),
    'native date input': q('.mat-mdc-form-field input[type=date], .mat-mdc-form-field input[matdatepicker], .mat-mdc-form-field .mat-datepicker-toggle'),
    'mat-select (MDC)': q('.mat-mdc-select'),
    'button (MDC)': q('.mat-mdc-button-base'),
    'mat-checkbox (MDC)': q('.mat-mdc-checkbox'),
    'mat-radio (MDC)': q('.mat-mdc-radio-button'),
    'mat-slide-toggle (MDC)': q('.mat-mdc-slide-toggle'),
    'mat-table (MDC)': q('.mat-mdc-table'),
    'mat-paginator (MDC)': q('.mat-mdc-paginator'),
    'mat-tab (MDC)': q('.mat-mdc-tab, .mat-mdc-tab-group'),
    'mat-card (MDC)': q('.mat-mdc-card'),
    'mat-list (MDC)': q('.mat-mdc-list, .mat-mdc-list-base'),
    'mat-chip (MDC)': q('.mat-mdc-chip'),
    'mat-progress (MDC)': q('.mat-mdc-progress-bar, .mat-mdc-progress-spinner'),
    'mat-menu (MDC)': q('.mat-mdc-menu-trigger'),
    'mat-dialog (MDC)': q('.mat-mdc-dialog-container'),
    'mat-tooltip (MDC)': q('.mat-mdc-tooltip-trigger'),
    'cn-page-shell': q('cn-page-shell'),
    'cn-page-header': q('cn-page-header'),
    'cn-card': q('cn-card'),
    'cn-filter-chips (legacy, KAN-28)': q('cn-filter-chips'),
    'cn-amount-slider (interim, KAN-27)': q('cn-amount-slider'),
    'mol-* layout classes': q('[class*="mol-flex"], [class*="mol-gap-"]'),
  };
  for (const k of Object.keys(fam)) if (!fam[k]) delete fam[k];
  const templates = [...new Set([...document.querySelectorAll('*')].map(e => e.tagName.toLowerCase()).filter(t => t.startsWith('mol-')))];
  return {
    families: fam,
    molComponents: templates,
    docWidth: document.documentElement.scrollWidth,
    docHeight: document.documentElement.scrollHeight,
    overflowing: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 5)
      .map(e => `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 2).join('.')}`),
  };
}

(async () => {
  const browser = await launch();
  const report = { app: APP, at: new Date().toISOString(), routes: {} };
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
        report.routes[key] = { route: routePath, finalUrl: page.url().replace(APP, ''), ...(await page.evaluate(scan)) };
        console.log('ok  ', key, report.routes[key].docWidth + 'x' + report.routes[key].docHeight, Object.keys(report.routes[key].families).length, 'families');
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
