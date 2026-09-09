# MOL-4471 flex-layout -> CSS visual evidence

Evidence for the human sign-off in Jira **KAN-30**. Nothing in this directory is a decision; it is
the before/after record of every route that renders one of the 95 templates in
`../00-baseline-14/flex-layout-inventory.md`.

| Directory | Content |
|---|---|
| `baseline/` | Angular 14.3.0 + `@angular/flex-layout` 14.0.0-beta.41 (develop `8b456b7`), 64 routes x 2 viewports = 128 PNGs, `manifest.json`, `COVERAGE.md`, `capture.log` |
| `candidate/` | Same routes after Angular 15 + Canopy 4 + flex-layout removal |
| `diff/` | Pixel diffs (`pixelmatch`) and `SUMMARY.md` (per route: template, changed pixels, %, explanation) |
| `tools/` | `capture.js` (Playwright, Chrome for Testing 137 headless=new), `coverage.js` (template -> route map), `lib.js` |

## How the baseline was captured

* Estate: `ESTATE_NO_DOCKER=1 ../northgate-mock-external/estate-up.sh` (Keystone mock 4400, Retail BFF
  4500, Verdaccio 4873, ...), retail-web served with `npm start -- --host 127.0.0.1 --port 4200`
  (dev server + `proxy.conf.json`) on Node 16.20.2.
* Fixture customer `rosalind.ekstrand` / `CUS-100000` (Keystone mock users at
  `http://localhost:4400/debug/users`, password `Passw0rd`, MFA `123456`). Real ids from the BFF:
  account `ACC-477215249`, card `CRD-980719437`, payee `PYE-904418309`.
* Viewports **1280x800** and **375x812**, `deviceScaleFactor: 1`, full-page screenshots,
  `animations: 'disabled'`, `reducedMotion: 'reduce'`, `--font-hinting=none --disable-lcd-text`.
* Navigation between routes is in-app (`history.pushState` + `popstate`) so the Keystone session and
  the lazily loaded modules are exercised the way a customer would; a full reload per route is not
  used because it re-runs the OIDC callback each time.
* `Date.prototype.getHours` is pinned to 18 so the dashboard greeting ("Good evening") does not
  depend on when the candidate run happens. A fully fixed clock was tried and rejected: it stalls
  RxJS `debounceTime`/router-store timers.
* `MfaStepUpGuard` reads the wizard's parked amount from `sessionStorage`
  (`mol.transfers.pendingAmount`); `/transfers/new/review`, `/transfers/payees/new` and
  `/bill-pay/bills/:id/pay` are captured with a below-threshold amount parked (see `capture.js`).
  Without it `/transfers/payees/new` (threshold 0) loops back to itself - pre-existing, not a
  migration issue, noted in REPORT.md.
* The Material Icons font is not committed (`src/assets/fonts/README.txt`, MOL-2101). For the
  capture `material-icons.woff2` from `material-icons@1.13.12` was copied into `src/assets/fonts/`
  locally (git-excluded), otherwise icon ligatures render as text and dominate every diff.

## Coverage (see `baseline/COVERAGE.md` for the per-template table)

* 83 / 95 templates render on at least one captured route.
* 1 template (`transfer-review-step`) redirects to `/transfers/new` because the wizard has no draft
  and the local BFF cannot resolve accounts for the wizard; it is not renderable in this estate.
* 11 templates are not reachable at runtime: 7 are declared components that nothing renders
  (`rename-account`, `test-alert`, `cancel-payment`, `lock-card`, `message-bubble`,
  `document-search`, `cancel-transfer` - dead templates), `export-transactions` is a dialog behind
  a list the BFF does not populate, and `auth-callback` / `idle-warning-dialog` / `sw-update-banner`
  are transient or timer/service-worker driven. Their CSS conversion is covered by code review and
  the unit tests only; this is recorded for KAN-30.

## Local BFF / fixture limitations visible in the screenshots (identical in baseline and candidate)

The Retail BFF at `4500` only implements `/accounts`, `/cards`, `/payees`, `/dashboard` for the
fixture customer; every other list endpoint returns `HTTP_404`. Pages therefore show the
documented empty / error-banner / skeleton states rather than populated tables. Two page-level
NgRx errors present on develop (`AccountsSummaryComponent.toItem`, `CardListComponent.last4`)
leave the dashboard "Your accounts" card and the card list partially rendered. These are the same
DOM in both runs and are excluded from the "unexplained" category in `diff/SUMMARY.md`.
