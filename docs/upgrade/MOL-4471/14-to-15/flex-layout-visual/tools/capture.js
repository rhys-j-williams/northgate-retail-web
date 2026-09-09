// capture.js <outDir> [routeFilter]
// Full-page screenshots of every retail-web route that renders a flex-layout template, at
// 1280x800 and 375x812, against the local estate (fixture user rosalind.ekstrand / CUS-100000).
const fs = require('fs');
const path = require('path');
const { launch, newPage, login, settle, nav, APP } = require('./lib');

const OUT = path.resolve(process.argv[2] || 'out');
const FILTER = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });

const ACC = 'ACC-477215249';      // Bills account (CHECKING) - has transactions
const CARD = 'CRD-980719437';
const PAYEE = 'PYE-904418309';
const FIXED_TIME = 'Date.prototype.getHours -> 18 (greeting pinned to evening)';

// id: file slug; path: route; opts.public: no shell login needed; opts.after: extra steps on the page
const ROUTES = [
  { id: 'dashboard', path: '/dashboard' },
  { id: 'accounts', path: '/accounts' },
  { id: 'accounts-detail', path: `/accounts/${ACC}` },
  { id: 'accounts-detail-export-dialog', path: `/accounts/${ACC}`, after: async p => clickText(p, /export/i) },
  { id: 'accounts-transaction-detail', path: `/accounts/${ACC}/transactions/__TX__` },
  { id: 'accounts-transaction-dispute', path: `/accounts/${ACC}/transactions/__TX__/dispute` },
  { id: 'transfers', path: '/transfers' },
  { id: 'transfers-new', path: '/transfers/new' },
  // MfaStepUpGuard reads the wizard's parked amount from sessionStorage; deep links without it loop
  // back to the wizard start, so park a below-threshold amount (threshold 250000 minor) first.
  { id: 'transfers-new-review', path: '/transfers/new/review', pendingAmount: '12500' },
  { id: 'transfers-confirmation', path: '/transfers/TRF-000001/confirmation' },
  { id: 'transfers-history', path: '/transfers/history' },
  { id: 'transfers-detail', path: '/transfers/TRF-000001' },
  { id: 'transfers-payees', path: '/transfers/payees' },
  { id: 'transfers-payees-new', path: '/transfers/payees/new', pendingAmount: '12500' }, // threshold 0: needs recent MFA (login < 10 min ago)
  { id: 'transfers-payee-verify', path: `/transfers/payees/${PAYEE}/verify` },
  { id: 'bill-pay', path: '/bill-pay' },
  { id: 'bill-pay-bill-detail', path: `/bill-pay/bills/${PAYEE}` },
  { id: 'bill-pay-pay-bill', path: `/bill-pay/bills/${PAYEE}/pay`, pendingAmount: '12500' },
  { id: 'bill-pay-scheduled', path: '/bill-pay/scheduled' },
  { id: 'bill-pay-history', path: '/bill-pay/history' },
  { id: 'bill-pay-payees-new', path: '/bill-pay/payees/new' },
  { id: 'bill-pay-autopay', path: `/bill-pay/bills/${PAYEE}/autopay` },
  { id: 'cards', path: '/cards' },
  { id: 'cards-detail', path: `/cards/${CARD}` },
  { id: 'cards-controls', path: `/cards/${CARD}/controls` },
  { id: 'cards-report', path: `/cards/${CARD}/report` },
  { id: 'cards-travel', path: `/cards/${CARD}/travel` },
  { id: 'cards-activate', path: `/cards/${CARD}/activate` },
  { id: 'statements', path: '/statements' },
  { id: 'statements-tax', path: '/statements/tax' },
  { id: 'statements-paperless', path: '/statements/paperless' },
  { id: 'statements-viewer', path: '/statements/STM-000001' },
  { id: 'alerts', path: '/alerts' },
  { id: 'alerts-history', path: '/alerts/history' },
  { id: 'profile', path: '/profile' },
  { id: 'profile-contact', path: '/profile/contact' },
  { id: 'profile-address', path: '/profile/address' },
  { id: 'profile-security', path: '/profile/security' },
  { id: 'profile-security-password', path: '/profile/security/password' },
  { id: 'profile-security-username', path: '/profile/security/username' },
  { id: 'profile-security-mfa', path: '/profile/security/mfa' },
  { id: 'profile-security-devices', path: '/profile/security/devices' },
  { id: 'profile-security-activity', path: '/profile/security/activity' },
  { id: 'messages', path: '/messages' },
  { id: 'messages-new', path: '/messages/new' },
  { id: 'messages-thread', path: '/messages/THR-000001' },
  { id: 'rewards', path: '/rewards' },
  { id: 'rewards-activity', path: '/rewards/activity' },
  { id: 'rewards-redeem', path: '/rewards/redeem' },
  // public tree
  { id: 'help', path: '/help', public: true },
  { id: 'help-faq', path: '/help/faq', public: true },
  { id: 'help-contact', path: '/help/contact', public: true },
  { id: 'disclosures', path: '/disclosures', public: true },
  { id: 'disclosures-viewer', path: '/disclosures/privacy-notice', public: true },
  { id: 'open-account', path: '/open-account', public: true },
  { id: 'open-account-identity', path: '/open-account/identity', public: true },
  { id: 'open-account-contact', path: '/open-account/contact', public: true },
  { id: 'open-account-product', path: '/open-account/product', public: true },
  { id: 'open-account-funding', path: '/open-account/funding', public: true },
  { id: 'open-account-review', path: '/open-account/review', public: true },
  { id: 'errors-not-found', path: '/not-found', public: true },
  { id: 'errors-forbidden', path: '/forbidden', public: true },
  { id: 'errors-generic', path: '/error', public: true },
  { id: 'logged-out', path: '/logged-out', public: true },
];

const VIEWPORTS = [{ width: 1280, height: 800 }, { width: 375, height: 812 }];

function withTimeout(p, ms, what) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`${what} timed out after ${ms}ms`)), ms))]);
}

async function clickText(page, re) {
  const btn = page.getByRole('button', { name: re }).first();
  if (await btn.count()) { await btn.click(); await page.waitForTimeout(600); return 'clicked'; }
  return 'button not found';
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
