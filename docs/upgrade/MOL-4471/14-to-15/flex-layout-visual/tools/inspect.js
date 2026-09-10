// inspect.js <width> <route> <selector...>  - dump boxes + key computed styles of matching elements
const { launch, newPage, login, nav, settle } = require('./lib');
const [w, route, ...sels] = process.argv.slice(2);
(async () => {
  const browser = await launch();
  const { page } = await newPage(browser, { width: +w, height: 812 });
  await login(page);
  await nav(page, route);
  await settle(page);
  for (const sel of sels) {
    const rows = await page.$$eval(sel, els => els.slice(0, 12).map(el => {
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      return `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 4).join('.')} x=${r.x.toFixed(0)} y=${(r.y + scrollY).toFixed(0)} w=${r.width.toFixed(0)} h=${r.height.toFixed(0)} display=${cs.display} dir=${cs.flexDirection} gap=${cs.gap} m=${cs.margin} p=${cs.padding} flex=${cs.flex} minW=${cs.minWidth} maxW=${cs.maxWidth}`;
    }));
    console.log(`\n## ${sel}`); rows.forEach(r => console.log('  ' + r));
  }
  console.log('\nscrollWidth', await page.evaluate(() => [document.documentElement.scrollWidth, document.body.scrollWidth]));
  const wide = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 8).map(e => `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 3).join('.')} right=${e.getBoundingClientRect().right.toFixed(0)}`));
  console.log('overflowing:', wide);
  await browser.close();
})();
