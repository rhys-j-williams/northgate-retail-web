// capture.js <outDir> [routeFilter]
// Full-page screenshots of every retail-web route that renders a flex-layout template, at
// 1280x800 and 375x812, against the local estate (fixture user rosalind.ekstrand / CUS-100000).
const fs = require('fs');
const path = require('path');
const { launch, newPage, login, settle, nav, APP } = require('./lib');

const OUT = path.resolve(process.argv[2] || 'out');
const FILTER = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });

const FIXED_TIME = 'Date.prototype.getHours -> 18 (greeting pinned to evening)';

// id: file slug; path: route; opts.public: no shell login needed; opts.after: extra steps on the page
const { ROUTES, VIEWPORTS, ACC, clickText } = require('./routes');

function withTimeout(p, ms, what) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`${what} timed out after ${ms}ms`)), ms))]);
}


(async () => {
  const browser = await launch();
  const manifest = { app: APP, capturedAt: new Date().toISOString(), fixedTime: FIXED_TIME, user: 'rosalind.ekstrand', shots: [] };
  for (const vp of VIEWPORTS) {
    const { ctx, page } = await newPage(browser, vp);
    // Pin the local hour only (greeting text); a fully fixed clock stalls RxJS debounce/timers.
    await page.addInitScript(() => { Date.prototype.getHours = function () { return 18; }; });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e).split('\n')[0].slice(0, 160)));
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
      errors.length = 0;
      const file = `${r.id}--${vp.width}x${vp.height}.png`;
      try {
        await page.evaluate(v => { if (v) sessionStorage.setItem('mol.transfers.pendingAmount', v); else sessionStorage.removeItem('mol.transfers.pendingAmount'); }, r.pendingAmount || '');
        await withTimeout(nav(page, routePath), 30000, 'nav');
        if (!page.url().startsWith(APP)) { // bounced to Keystone (step-up) - log in again and retry once
          await login(page); await withTimeout(nav(page, routePath), 30000, 'nav-retry');
        }
        let note = '';
        if (r.after) note = await r.after(page);
        await settle(page);
        const finalUrl = page.url().replace(APP, '');
        const title = await page.title();
        const text = (await page.innerText('body')).replace(/\s+/g, ' ').trim();
        await withTimeout(page.screenshot({ path: path.join(OUT, file), fullPage: true, animations: 'disabled', caret: 'hide' }), 30000, 'screenshot');
        const size = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight }));
        manifest.shots.push({ id: r.id, viewport: `${vp.width}x${vp.height}`, route: routePath, finalUrl, title, file, pageSize: size, textLength: text.length, textHead: text.slice(0, 120), note, pageErrors: [...new Set(errors)] });
        console.log(`ok   ${file}  ${finalUrl}${finalUrl !== routePath ? ' (redirected)' : ''} ${size.w}x${size.h} ${note}`);
      } catch (e) {
        manifest.shots.push({ id: r.id, viewport: `${vp.width}x${vp.height}`, route: routePath, file, error: e.message.split('\n')[0] });
        console.log(`FAIL ${file} ${e.message.split('\n')[0]}`);
      }
    }
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  await browser.close();
  console.log('shots:', manifest.shots.length, 'failed:', manifest.shots.filter(s => s.error).length);
})().catch(e => { console.error(e); process.exit(1); });
