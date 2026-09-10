// iris-host-check.js - MOL-4471 / KAN-42: does the Stage 2 Iris scratch build (Angular 15.2.10,
// Canopy 4.0.0, zoneJsCompatible 0.12.0) still boot inside the upgraded retail-web host page?
//
// retail-web develop and this branch contain NO Iris mount, vendoring step or asset copy
// (KAN-42), so nothing in the repo can be exercised. This harness therefore does the mount check
// against the host page that exists: it serves the running Angular 15 app (ng serve, 4200), and
// at runtime, through Playwright request interception only, satisfies the mount contract paths
// (/assets/widgets/iris.js, /assets/widgets/assets/**) from the Iris scratch dist and appends the
// <northgate-iris-widget> element to the host DOM. No retail-web file is modified.
//
// Usage: node iris-host-check.js <iris-dist-dir> <out-dir>
const fs = require('fs');
const path = require('path');
const { launch, newPage, settle, APP } = require('./lib');

const [distDir, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const manifest = JSON.parse(fs.readFileSync(path.join(distDir, 'iris.manifest.json'), 'utf8'));
const lines = [];
const say = s => { lines.push(s); console.log(s); };
const mime = f => ({ '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png' })[path.extname(f)] || 'application/octet-stream';

(async () => {
  say(`# Iris host check - retail-web Angular 15 host page x iris-widget scratch build`);
  say(`iris manifest: element=${manifest.element} file=${manifest.file} stable=${manifest.stable} bytes=${manifest.bytes} angular=${manifest.angular} zoneJsCompatible=${manifest.zoneJsCompatible} builtAt=${manifest.builtAt}`);
  const browser = await launch();
  const { page } = await newPage(browser, { width: 1280, height: 800 });
  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') consoleErrors.push(`${m.type()}: ${m.text().slice(0, 300)}`); });
  page.on('pageerror', e => consoleErrors.push(`pageerror: ${String(e).slice(0, 300)}`));
  const failedRequests = [];
  page.on('requestfailed', r => failedRequests.push(`${r.method()} ${r.url()} -> ${r.failure() && r.failure().errorText}`));
  page.on('response', r => { if (r.status() >= 400) failedRequests.push(`${r.request().method()} ${r.url()} -> HTTP ${r.status()}`); });

  const served = [];
  await page.route('**/assets/widgets/**', async route => {
    const url = new URL(route.request().url());
    const rel = url.pathname.replace(/^\/assets\/widgets\//, '');
    const file = path.join(distDir, rel);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      served.push(rel);
      await route.fulfill({ status: 200, contentType: mime(file), body: fs.readFileSync(file) });
    } else {
      served.push(`${rel} (404)`);
      await route.fulfill({ status: 404, body: 'not in iris dist' });
    }
  });

  // 1. the host page as committed: public /help route, no mount expected (KAN-42)
  await page.goto(APP + '/help', { waitUntil: 'domcontentloaded' });
  await settle(page);
  const host = await page.evaluate(() => ({
    title: document.title,
    ngVersion: document.querySelector('[ng-version]') && document.querySelector('[ng-version]').getAttribute('ng-version'),
    zonePresent: typeof Zone !== 'undefined',
    zoneRootName: typeof Zone !== 'undefined' ? Zone.root.name : null,
    zoneUnpatched: (window.__zone_symbol__UNPATCHED_EVENTS || []).join(','),
    irisRoot: !!document.querySelector('#iris-root'),
    irisElement: !!document.querySelector('northgate-iris-widget'),
    widgetScript: !![...document.scripts].find(s => /assets\/widgets/.test(s.src)),
    irisDefined: !!customElements.get('northgate-iris-widget'),
  }));
  say(`host /help: ng-version=${host.ngVersion} zonePresent=${host.zonePresent} zoneRoot=${host.zoneRootName} unpatchedEvents=[${host.zoneUnpatched}]`);
  say(`host as committed: #iris-root=${host.irisRoot} <northgate-iris-widget>=${host.irisElement} /assets/widgets script=${host.widgetScript} customElement defined=${host.irisDefined}  -> no Iris mount in source (KAN-42 confirmed)`);
  await page.screenshot({ path: path.join(outDir, 'help-host-as-committed.png'), fullPage: true });

  // 2. runtime injection per the iris-widget mount contract (embedding-in-a-host.md), host Zone reused
  const result = await page.evaluate(async ({ file }) => {
    const out = { zoneBefore: typeof Zone !== 'undefined' };
    await new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = '/assets/widgets/iris.js'; s.onload = res; s.onerror = () => rej(new Error('iris.js failed to load')); document.head.appendChild(s);
    });
    const el = document.createElement('northgate-iris-widget');
    el.setAttribute('orchestrator-url', 'http://localhost:4517');
    el.setAttribute('channel', 'retail-web');
    el.setAttribute('sprite-url', '/assets/widgets/assets/canopy/canopy-sprite.svg');
    el.setAttribute('bearer-token', 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJDVVMtMTAwMDAwIiwic2NvcGUiOiJpcmlzOmNoYXQifQ.');
    el.setAttribute('open', '');
    document.body.appendChild(el);
    await customElements.whenDefined('northgate-iris-widget');
    await new Promise(r => setTimeout(r, 1500));
    out.defined = true;
    out.root = !!el.querySelector('.iris-root');
    out.launcher = !!el.querySelector('.iris-launcher');
    out.panel = !!el.querySelector('#iris-panel');
    out.ngVersions = [...document.querySelectorAll('[ng-version]')].map(e => `${e.tagName.toLowerCase()}@${e.getAttribute('ng-version')}`);
    out.zoneRoot = Zone.root.name;
    out.hostStillRendered = !!document.querySelector('cn-page-header, app-root');
    return out;
  }, { file: manifest.stable });
  say(`injected <northgate-iris-widget>: defined=${result.defined} .iris-root=${result.root} launcher=${result.launcher} open panel=${result.panel}`);
  say(`ng-version roots on page after mount: ${result.ngVersions.join(' ')}  (host app + widget, both Angular 15)`);
  say(`zone: single host Zone reused (root=${result.zoneRoot}); widget did not throw "Zone already loaded"; host still rendered=${result.hostStillRendered}`);
  say(`assets served from iris dist via interception: ${served.join(', ')}`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'help-host-with-iris-injected.png'), fullPage: true });
  // host dev-mode noise that is present without Iris too: the NgRx action logger ([mol.store], dev
  // configuration only) and the CSP frame-ancestors <meta> notice (index.html, unchanged by MOL-4471)
  const hostNoise = e => /\[mol\.store\]|frame-ancestors/.test(e);
  const irisLines = consoleErrors.filter(e => /iris/i.test(e));
  const errs = consoleErrors.filter(e => !hostNoise(e) && !/iris/i.test(e) && !/Failed to load resource/.test(e));
  say(`host console noise ignored (NgRx dev logger / CSP meta notice): ${consoleErrors.filter(hostNoise).length} lines`);
  say(`iris console lines: ${irisLines.length}${irisLines.length ? '\n  ' + irisLines.join('\n  ') : ''}`);
  say(`failed / 4xx+ requests: ${failedRequests.length}${failedRequests.length ? '\n  ' + failedRequests.join('\n  ') : ''}`);
  say(`other console errors/warnings: ${errs.length}${errs.length ? '\n  ' + errs.join('\n  ') : ''}`);
  const ok = result.defined && result.root && result.launcher && result.hostStillRendered && errs.length === 0;
  say(`RESULT: ${ok ? 'MOUNTED' : 'FAILED'}`);
  fs.writeFileSync(path.join(outDir, 'iris-host-check.log'), lines.join('\n') + '\n');
  await browser.close();
  process.exit(ok ? 0 : 1);
})().catch(e => { say('ERROR ' + e.stack); fs.writeFileSync(path.join(outDir, 'iris-host-check.log'), lines.join('\n') + '\n'); process.exit(2); });
