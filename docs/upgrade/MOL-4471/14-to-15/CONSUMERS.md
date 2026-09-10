<!-- Generated with AI assistance (AIT-014) on 2026-09-10; reviewed by <handle>. -->
# Consumers and estate verification: MOL-4471 northgate-retail-web Angular 14 -> 15

retail-web is an application, not a library; nothing in the estate pins it. Per the LNTN-401
artefact convention this file records, in place of a consumer matrix, (1) the estate smoke with the
upgraded application, (2) what depends on retail-web at runtime, and (3) the Iris widget host check.

## 1. Estate smoke

Estate from `rhys-j-williams/northgate-mock-external` and the `northgate-cswt-workspace` README, on
the Stage 3 VM (Node 16.20.2, no Docker):

```
ESTATE_NO_DOCKER=1 ../northgate-mock-external/estate-up.sh      # Verdaccio 4873, mocks 4400-4608, platform services
../northgate-mock-external/smoke.sh                             # -> logs/estate-smoke.log
scripts/verify-estate.sh --quick retail-web                     # (cswt-workspace) -> logs/verify-estate-quick.log
npm run build:prod && ng serve --proxy-config proxy.conf.json   # Angular 15 retail-web on 4200 against the estate
```

| check | result | evidence |
|---|---|---|
| `smoke.sh` (12 service health checks + Keystone PKCE login + bff-retail balances vs Bedrock + Beacon alerts + documents PDF + Lantern collector + `lantern.min.js` + Splunk HEC/trace) | **20 passed, 0 failed, 0 skipped** | [`logs/estate-smoke.log`](logs/estate-smoke.log) |
| `verify-estate.sh --quick retail-web` (forbidden strings, no build output committed, exact dependency versions, `.nvmrc`, lockfile, history depth/authors/tags, en-US + es localised builds) | **pass 10, fail 0, skip 2** (`--quick` skips history scan and install/test/build, which ran separately, see REPORT.md section 4) | [`logs/verify-estate-quick.log`](logs/verify-estate-quick.log) |
| Angular 15 retail-web against the estate: Keystone OIDC PKCE login (`rosalind.ekstrand`), all **64 routes x 2 viewports** rendered and screenshotted (accounts, transactions, transfers incl. MFA step-up, bill pay, cards, alerts, statements, profile, help, shell states) | 128 / 128 captured, 0 failed | [`flex-layout-visual/candidate/manifest.json`](flex-layout-visual/candidate/manifest.json), [`flex-layout-visual/diff/SUMMARY.md`](flex-layout-visual/diff/SUMMARY.md) |
| Lantern 5.0.0 in the host: `LanternService` unchanged, page-view / track events reach `lantern-collector-mock` (4606) through the existing `/telemetry` proxy | pass (smoke `lantern track event ... stored`, `lantern.min.js served`) | [`logs/estate-smoke.log`](logs/estate-smoke.log) |

Baseline for comparison: the LNTN-401 Stage 2 estate smoke recorded 18 passed; the two extra checks
are the Splunk HEC/trace checks added to `smoke.sh` since.

## 2. Runtime relationships (unchanged by this hop)

| relationship | direction | status |
|---|---|---|
| Keystone IdP (`keystone-idp-mock` 4400 locally) | retail-web -> Keystone, OIDC PKCE via `angular-oauth2-oidc` 15.0.1 | login smoke pass; no config change |
| `bff-retail` (4500) `/api/v1` | retail-web -> BFF via `/api` proxy | account/transaction/transfer/bill-pay pages rendered from BFF data; no contract change |
| Semaphore flags (4608) `/flags`, Splunk HEC `/telemetry`, Lantern collector (4606) | retail-web -> mocks | smoke pass; CSP `connect-src` unchanged |
| `@northgate/canopy-ui` 4.0.0, `@northgate/lantern-sdk` 5.0.0 | retail-web pins (exact) | resolved from local Verdaccio only (**KAN-23 waiver**; not on Artifactory until Canopy PR #3 / Lantern PR #6 merge and publish) |
| `@northgate/domain-fixtures` 1.6.0 | unchanged | |
| iris-widget | retail-web is the intended host (see 3) | **no host integration exists in source (KAN-42)** |

## 3. Iris widget host check (IRIS-0900 scratch build, KAN-42 / KAN-40)

### 3.1 What retail-web contains today (KAN-42 confirmed)

The estate overview and `docs/architecture.md` say retail-web hosts the Iris bundle, vendored at
build time from `iris.manifest.json` (MOL-4133) by `scripts/vendor-iris.js` into
`src/assets/widgets/`. On `develop` `8b456b7` and on this branch **none of that exists**:

| looked for | found |
|---|---|
| `scripts/vendor-iris.js`, any `scripts/` directory | no (`tools/` exists but contains no Iris step) |
| `iris.manifest.json` (repo root, `src/`, `tools/`) | no |
| `src/assets/widgets/` or an `angular.json` `assets` entry for it | no |
| `#iris-root`, `<northgate-iris-widget>`, `iris.js` in `src/**` (`index.html`, shell, help page) | no |
| `/iris` route in `proxy.conf.json`, `localhost:4517` in the CSP `connect-src` | no |
| `Jenkinsfile` vendoring stage | no `Jenkinsfile` in the repository (shared pipeline) |
| `package.json` scripts referencing iris | no |
| `docs/architecture.md` | still documents the **pre-MOL-4133** CDN integration: "loads from the CDN into a `<div id="iris-root">` in `app.component.html`", i.e. neither the current source (no such div) nor the manifest mechanism |

So "vendored at build time" is documented but not implemented in this repository, and the older
CDN mount described in `docs/architecture.md` has also been removed from source. Recorded for
**KAN-42** (Medium); not worked around and no mount invented here.

### 3.2 Host check performed

Because there is no host mount or vendoring step to run the check *through*, the check was run
against the real Angular 15 host page with the Iris bundle injected at runtime by the harness only
([`tools/iris-host-check.js`](tools/iris-host-check.js), evidence in [`iris-host-check/`](iris-host-check/)):

1. Iris scratch build: `rhys-j-williams/northgate-iris-widget` at `feature/IRIS-0900-angular-14-to-15`
   (Angular 15.2.10, Canopy 4.0.0 from Verdaccio), `npm ci && npm run build:prod`, producing
   `dist/iris-widget/iris.js` and [`iris.manifest.scratch.json`](iris-host-check/iris.manifest.scratch.json)
   (`element: northgate-iris-widget`, `angular: 15.2.10`, `zoneJsCompatible: 0.12.0`, 480,207 bytes).
   The iris-widget repository was not modified.
2. Host: the Angular 15 retail-web served on 4200 against the estate, logged in, on `/help` (the
   customer-facing page a virtual assistant would sit on; `docs/architecture.md` places the old
   `#iris-root` in `app.component.html`, i.e. the shell around every route, which no longer exists
   either, so the check is host-page agnostic).
3. Harness: record the committed host state; intercept `/assets/widgets/**` and serve the scratch
   dist (standing in for the missing vendoring step); inject `<script src="/assets/widgets/iris.js">`;
   append `<northgate-iris-widget>`; open the panel; record versions, zone and console.

| assertion | result |
|---|---|
| Host page as committed contains `#iris-root` / `<northgate-iris-widget>` / `/assets/widgets` script | **false / false / false** (KAN-42) |
| Host Angular version, zone.js | `ng-version=15.2.10`, zone present, root zone, `unpatchedEvents=[scroll,mousemove]` |
| After injection: `customElements.get('northgate-iris-widget')` defined, `.iris-root` rendered, launcher rendered, panel opens | **true / true / true / true** |
| Angular roots on the page after mount | `mol-root@15.2.10`, `northgate-iris-widget@15.2.10` |
| zone.js | single host Zone reused; no "Zone already loaded" error; host still renders (**KAN-40**: host is now 0.12.0, equal to the Iris manifest `zoneJsCompatible`; it was 0.11.8 on 14) |
| Iris runtime errors | 2, both expected in this host: `POST http://localhost:4517/iris/v1/sessions` **refused by the host CSP** (`connect-src` lists 4400/4500/4606/4607/4608, not 4517) and the resulting `[iris-widget] session start failed`. There is also no `/iris` proxy entry. These are part of the missing integration (KAN-42), not a widget or upgrade defect |
| Other console errors | 0 (27 NgRx dev-logger / CSP-meta notice lines ignored; 1 unrelated pre-existing 404 for `assets/config/env.local.json`) |
| **Result** | **MOUNTED** in the Angular 15 host; integration itself absent |

Screenshots: [`help-host-as-committed.png`](iris-host-check/help-host-as-committed.png),
[`help-host-with-iris-injected.png`](iris-host-check/help-host-with-iris-injected.png); log
[`iris-host-check.log`](iris-host-check/iris-host-check.log).

### 3.3 Consequences for Iris asks

- Help-page growth (+40 kB raw / +8 kB gzip, IRIS-0900): not incurred, because retail-web does not
  ship the bundle. Applies when KAN-42 lands vendoring; note the initial-bundle warning budget is
  already exceeded (REPORT.md section 7).
- Host zone.js (KAN-40): 0.12.0 after this hop; compatible with the Iris manifest.
- Landing KAN-42 needs, in retail-web: the `scripts/vendor-iris.js` + `iris.manifest.json` step,
  `src/assets/widgets/` in `angular.json` assets, a host element on `/help` (or the shell), a `/iris`
  proxy entry, and a CSP `connect-src` change (GIS AppSec review). None of it is in this PR.

## 4. Other consumers of retail-web artefacts

None. retail-web publishes no package (`published_package: n/a`); its outputs are the container
image and Helm chart built by `northgateNodePipeline`, both unchanged in shape by this hop.
