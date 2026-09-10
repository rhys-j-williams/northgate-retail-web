<!-- Generated with AI assistance (AIT-014) on 2026-09-10; reviewed by <handle>. -->
# MOL-4471 compatibility matrix: Angular 14 -> 15

Repository: `northgate-retail-web` (Northgate Online, application, publishes no package). Hop 14.3.0 ->
15.2.10 (this hop, `14-to-15/`). Wave position: Stage 3 Tier 1 consumer, after the shared libraries
Canopy 4.0.0 (CNPY-2140) and Lantern 5.0.0 (LNTN-401) and the Iris widget (IRIS-0900) reached
Angular 15. Source for the framework ranges: https://angular.dev/reference/versions (row "15.0.x ||
15.1.x || 15.2.x"). Everything else is read from each package's own `peerDependencies` at the pinned
version in `package-lock.json` (`node_modules/<pkg>/package.json`). One column per hop; the next hop
(15 -> 16, not started) adds a column and reads only this one.

## Framework and toolchain

| item | 14 baseline (`develop` 8b456b7) | 15 target (this hop) | official 15.2 range / peer at pin | in range |
|---|---|---|---|---|
| `@angular/*` runtime (animations, common, compiler, core, forms, localize, platform-browser, platform-browser-dynamic, router, service-worker) | 14.3.0 | **15.2.10** | 15.x, one exact version across the set (15.2.10 is the last 15.x runtime) | yes |
| `@angular/compiler-cli` | 14.3.0 | **15.2.10** | same as core; peer `typescript >=4.8.2 <5.0` | yes |
| `@angular/cli`, `@angular-devkit/build-angular` | 14.2.13 | **15.2.11** | 15.x (last 15.x CLI); engines `node ^14.20.0 \|\| ^16.13.0 \|\| >=18.10.0` | yes |
| `@angular/material`, `@angular/cdk`, `@angular/material-moment-adapter` | 14.2.7 (legacy components) | **15.2.9** (MDC components after `mdc-migration`) | Material 15.2.9 peers `@angular/core ^15.0.0 \|\| ^16.0.0`, `@angular/cdk 15.2.9` (exact) | yes |
| TypeScript | 4.7.4 | **4.9.5** | `>=4.8.2 <5.0.0` | yes |
| RxJS | 7.5.7 | 7.5.7 (unchanged) | core `^6.5.3 \|\| ^7.4.0`; Lantern 5 / Canopy 4 `^7.5.0` | yes |
| zone.js | 0.11.8 | **0.12.0** | core `~0.11.4 \|\| ~0.12.0 \|\| ~0.13.0`; Iris manifest `zoneJsCompatible` 0.12.0 (KAN-40) | yes |
| tslib | 2.4.1 | unchanged | `^2.3.0` | yes |
| Node (`.nvmrc`) | 16.20.2 | **16.20.2** (unchanged) | `^14.20.0 \|\| ^16.13.0 \|\| ^18.10.0` | yes |
| npm | 8.19.4 (lockfile v2) | 8.19.4 (unchanged) | CLI 15 engines `^6.11.0 \|\| ^7.5.6 \|\| >=8.0.0` | yes |
| `@angular-eslint/*` | 14.4.0 | **15.2.1** | `eslint ^7.20.0 \|\| ^8.0.0`, `typescript *` | yes |
| eslint / `@typescript-eslint/*` | 8.28.0 / 5.43.0 | unchanged | see above | yes |
| `@angular/flex-layout` | 14.0.0-beta.41 (exact peer `@angular/core 14.0.x`, needed `legacy-peer-deps`) | **removed** (interim 15.0.0-beta.42 during the hop) | EOL; last release 15.0.0-beta.42 | n/a |
| `.npmrc` `legacy-peer-deps` | true (MOL-3611) | **removed**, strict peers | | |
| `postinstall` `ngcc` | required (Lantern 2.4.1 View Engine) | **removed** (0 `*.metadata.json`, 0 `__ivy_ngcc__`, ngcc dry run no-op) | ngcc removed in Angular 16 | |

## Shared Northgate libraries

| item | 14 baseline | 15 target | peers at pin | in range |
|---|---|---|---|---|
| `@northgate/canopy-ui` | 3.7.2 (Material 14 legacy) | **4.0.0** (CNPY-2140, Angular 15 / MDC, partial Ivy) | `@angular/{animations,cdk,common,core,forms,material,material-moment-adapter,router} ^15.0.0`, `moment ^2.29.0`, `ngx-mask ^15.0.0`, `rxjs ^7.5.0` | yes (moment 2.29.4, ngx-mask 15.2.3) |
| `@northgate/lantern-sdk` | 2.4.1 (View Engine) | **5.0.0** (LNTN-401, partial Ivy) | `@angular/{common,core,router} ^15.0.0`, `rxjs ^7.5.0` | yes |
| `@northgate/domain-fixtures` | 1.6.0 | 1.6.0 (unchanged) | none | yes |
| Registry | Artifactory | **local Verdaccio only for Canopy 4.0.0 / Lantern 5.0.0 (KAN-23 waiver)** | | must be on Artifactory before merge |

## Third-party Angular packages

| item | 14 baseline | 15 target | peers at pin | in range |
|---|---|---|---|---|
| `@ngrx/store`, `effects`, `entity`, `router-store`, `store-devtools`, `schematics` | 14.3.3 | **15.4.0** | `@angular/core ^15.0.0`, `rxjs ^6.5.3 \|\| ^7.5.0` | yes |
| `angular-oauth2-oidc` | 14.0.1 | **15.0.1** | `@angular/{common,core} >=14.0.0` | yes |
| `ngx-cookie-service` | 14.0.1 | **15.0.0** | `@angular/{common,core} ^15.0.0` | yes |
| `ngx-mask` | 14.3.3 (`NgxMaskModule.forRoot`) | **15.2.3** (`provideEnvironmentNgxMask`) | `@angular/{common,core,forms} >=14.0.0` | yes |
| `@ngx-translate/core` / `http-loader` | 14.0.0 / 7.0.0 | unchanged | `@angular/core >=13.0.0`, `rxjs ^6.5.3 \|\| ^7.4.0`; partial Ivy | yes |
| `moment` | 2.29.4 | unchanged | | yes |

## Format proof (ngcc)

Every Angular-declaring package in `node_modules` after a clean `npm ci` is Ivy (partial or full):
`14-to-15/logs/angular-packages-format.txt`, `14-to-15/logs/ngcc-proof.txt`. No View Engine package
remains, so no `ngcc` step is needed and the 16 hop's hard blocker from ADR 0014 item 3 is cleared
(Angular 16 itself is out of scope here).

## Estate alignment

| repo | Angular after its Stage | pins retail-web must match | status |
|---|---|---|---|
| canopy-ui 4.0.0 (PR #3, open) | 15.2.10 | consumer pin 4.0.0 | pinned |
| lantern-sdk 5.0.0 (PR #6, open) | 15.2.10 | consumer pin 5.0.0 | pinned |
| iris-widget (PR #3, open) | 15.2.10, Canopy 4.0.0, zone.js 0.12.0 | host zone.js 0.12.0 | matched; host integration absent (KAN-42) |
| business-web, ledgerline-web, keystone-web | Stage 3 siblings (own hops) | none (no cross-app dependency) | n/a |
