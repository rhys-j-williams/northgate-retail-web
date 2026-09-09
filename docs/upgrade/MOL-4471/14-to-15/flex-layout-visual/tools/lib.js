// Shared helpers for the MOL-4471 flex-layout visual evidence capture.
const { chromium } = require('playwright-core');

const CHROME = process.env.CHROME_BIN || '/opt/.devin/chrome/chrome/linux-137.0.7118.2/chrome-linux64/chrome';
const APP = process.env.APP_URL || 'http://localhost:4200';
const USER = process.env.KEYSTONE_USER || 'rosalind.ekstrand';

async function launch() {
  return chromium.launch({ executablePath: CHROME, headless: true, ignoreDefaultArgs: ['--headless=old'], args: ['--headless=new', '--no-sandbox', '--disable-gpu', '--font-render-hinting=none', '--disable-lcd-text', '--hide-scrollbars'] });
}

async function newPage(browser, viewport) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'America/New_York', reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('  [pageerror]', String(e).slice(0, 200)));
  return { ctx, page };
}

async function login(page) {
  await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForURL(/localhost:4400/, { timeout: 30000 });
  await page.fill('input[name="username"]', USER);
  await page.fill('input[name="password"]', 'Passw0rd');
  await page.click('button[type="submit"]');
  await page.waitForSelector('input[name="code"]', { timeout: 15000 });
  await page.fill('input[name="code"]', '123456');
  await page.click('button[type="submit"]');
  await page.waitForURL(/localhost:4200\/dashboard/, { timeout: 30000 });
  await settle(page);
}

async function settle(page) {
  await page.waitForLoadState('networkidle', { timeout: 4000 }).catch(() => {});
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  // Wait for skeletons / spinners to leave, then a short quiet period for animations.
  await page.waitForFunction(() => !document.querySelector('mat-progress-spinner, mat-spinner, .mol-skeleton, cn-skeleton, [aria-busy="true"]'), { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(500);
}

// In-app (router) navigation: no full reload, so the bootstrapped session and the fixed clock survive.
async function nav(page, path) {
  await page.keyboard.press('Escape').catch(() => {});
  await page.evaluate(p => { history.pushState({}, '', p); dispatchEvent(new PopStateEvent('popstate', { state: {} })); }, path);
  await page.waitForTimeout(300);
  await settle(page);
}

module.exports = { launch, newPage, login, settle, nav, APP };
