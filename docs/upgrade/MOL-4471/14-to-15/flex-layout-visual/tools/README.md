# Visual evidence tooling (MOL-4471 flex-layout removal)

Playwright scripts used to produce `baseline/`, `candidate/`, `diff/` and `diff/SUMMARY.md`.
They run against the local estate (`ESTATE_NO_DOCKER=1 ../northgate-mock-external/estate-up.sh`)
with the app served on `http://localhost:4200` (`APP_URL` to override) and the fixture user
`rosalind.ekstrand` (`KEYSTONE_USER`). Node 16.20.2; `npm i` in this directory installs
`playwright-core`, `pixelmatch`, `pngjs` (Chrome binary via `CHROME_BIN`).

| Script | Purpose |
|---|---|
| `routes.js` | The 64 routes x 2 viewports (1280x800, 375x812) and fixture ids shared by every script |
| `lib.js` | Browser launch, Keystone login, navigation and settle helpers |
| `capture.js <outDir> [filter]` | Full-page screenshots + `manifest.json` (final URL, page size, page errors) |
| `coverage.js <manifest.json> <COVERAGE.md>` | Maps every template of the flex-layout inventory to the route(s)/screenshots that render it (+ `.json`) |
| `diff.js <baseline> <candidate> <diff>` | pixelmatch (threshold 0.1) per pair -> `<id>.diff.png`, `stats.json` |
| `geom.js <baseline|candidate> <out.json>` | Dumps every flex-layout element (14) or `mol-*` element (15) with box, computed flex styles and inline style |
| `geom-compare.js <base.json> <cand.json> <out.json>` | Pairs the two dumps in DOM order; flags x/width differences > 1px and baseline `fxFlex` elements that never received an inline style |
| `verify-layout.js` | Checks every candidate `mol-*` element's computed style against the rule flex-layout would have produced |
| `explain.js <out.json>` | Records Material MDC / Canopy component families, document size and overflowing elements per route (run against both apps) |
| `summary.js` | Combines the above into `diff/SUMMARY.md` (inputs in `diff/evidence/`) |
| `inspect.js <width> <route> <selector...>` | Ad-hoc box/computed-style dump for one route |

Order used for this hop: `capture.js` (Angular 14 worktree) -> `coverage.js` -> `capture.js` (Angular 15)
-> `diff.js` -> `geom.js` (both) -> `geom-compare.js` -> `verify-layout.js` -> `explain.js` (both)
-> `summary.js`.
