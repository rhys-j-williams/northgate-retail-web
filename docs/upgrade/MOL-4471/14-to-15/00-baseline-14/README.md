# 00-baseline-14 - Angular 14.3.0 baseline for MOL-4471 (captured before any change)

Captured on branch `feature/MOL-4471-angular-14-to-15` at `origin/develop` = `8b456b7`, Node 16.20.2 / npm 8.19.4,
Chrome Headless 137 (`CHROME_BIN`), `@northgate/*` served from local Verdaccio (`http://localhost:4873`, Stage 3 waiver on KAN-23).

| Gate | Result | Evidence |
|---|---|---|
| `npm ci` | PASS (second run) | `logs/npm-ci.log`; first run failed `EINTEGRITY` because the committed lockfile carried Artifactory integrity hashes for `@northgate/*` and the local Verdaccio tarballs differ (`logs/npm-ci-eintegrity-plat-2718.log`). Lockfile integrity for the three internal packages was refreshed with `npm install <pkg>@<same version> --package-lock-only --ignore-scripts`; no version changed. `postinstall` ran `ngcc` (Lantern 2.4.1 is View Engine). |
| `ng version` | Angular 14.3.0, CLI 14.2.13, Material/CDK 14.2.7, flex-layout 14.0.0-beta.41, TypeScript 4.7.4, rxjs 7.5.7 | `logs/ng-version.log` |
| `npm ls --depth=0` | PASS (no missing/invalid) | `logs/npm-ls.log` |
| `npm run build:prod` | PASS with pre-existing budget **warning**: initial 2.05 MB vs 2.00 MB `maximumWarning` (error budget is 3 MB) | `logs/build-prod.log`, `logs/build-prod-summary.txt`, `logs/bundle-sizes.txt` |
| `npm run lint` | PASS (0 errors) | `logs/lint.log` |
| `npm run test:ci` | PASS - 196 of 198 specs (2 skipped); lines 36.19% (threshold 30% in `karma.conf.js`) | `logs/test-ci.log`, `logs/coverage-by-module.md` |
| `npm audit` (full tree) | 62 vulnerabilities (7 critical, 29 high, 17 moderate, 9 low), 82 unique advisory ids | `logs/audit-full.log` (json), `logs/audit-full.txt`, `audit-full-ids.md` |
| `npm audit --production` | 7 vulnerabilities (5 high, 2 low), 21 unique advisory ids | `logs/audit-prod.log` (json), `logs/audit-prod.txt`, `audit-prod-ids.md` |
| flex-layout inventory | 724 usages in 95 templates (87 HTML + 8 inline), 101 responsive (`.lt-md`), 1 `FlexLayoutModule` import | `flex-layout-inventory.md`, `flex-layout-inventory.json`, `flex-inventory.js` |

## Per-module line coverage (KAN-25: transfers and bill pay)

| Module | Lines covered | Lines total | Line % |
|---|---|---|---|
| features/transfers | 32 | 352 | **9.09%** |
| features/bill-pay | 23 | 162 | **14.20%** |
| all modules | 1057 | 2920 | 36.19% |

Full table: `logs/coverage-by-module.md`.
