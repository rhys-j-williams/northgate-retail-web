<!-- Generated with AI assistance (AIT-014) on 2026-09-10; reviewed by <handle>. -->
# MOL-4471 hop report: northgate-retail-web Angular 14 -> 15

| | |
|---|---|
| Repository | `rhys-j-williams/northgate-retail-web` (Northgate Online, Tier 1 consumer banking) |
| Branch | `feature/MOL-4471-angular-14-to-15` -> `develop` (base `8b456b7`) |
| Hop | Angular 14.3.0 -> **15.2.10** (CLI 14.2.13 -> 15.2.11), one major, no chaining to 16/17/18 |
| Library pins (this repo's own change) | `@northgate/canopy-ui` 3.7.2 -> **4.0.0**, `@northgate/lantern-sdk` 2.4.1 -> **5.0.0** (exact, `save-exact`) |
| Removed | `@angular/flex-layout` 14.0.0-beta.41 (724 usages / 95 templates -> 0), `postinstall` `ngcc`, `.npmrc` `legacy-peer-deps` |
| Node | 16.20.2 / npm 8.19.4, unchanged (`.nvmrc`) |
| Wave position | Stage 3 of the estate 14 -> 15 wave (after Canopy CNPY-2140 PR #3, Lantern LNTN-401 PR #6, Iris IRIS-0900 PR #3, all open, none merged). Runs under the KAN-23 gate waiver: Canopy 4.0.0 and Lantern 5.0.0 exist only on the sub-agent VM's Verdaccio (`http://localhost:4873`), not on Artifactory; **this PR must not merge until they are published there**. |
| Jira | MOL-4471 (epic); estate mirror KAN-23 (Stage 3 epic + waiver); blocked on KAN-25, KAN-30; respects KAN-31, KAN-33, KAN-34, KAN-27/28, KAN-32/37, KAN-40, KAN-42 (see section 9) |
| ADR | [`docs/adr/0015-angular-14-to-15.md`](../../../adr/0015-angular-14-to-15.md) (supersedes 0014) |
| Matrix | [`docs/upgrade/MOL-4471/COMPATIBILITY_MATRIX.md`](../COMPATIBILITY_MATRIX.md) |
| CAB | [`CAB_RECORD.md`](CAB_RECORD.md) (draft) |
| Consumers / estate | [`CONSUMERS.md`](CONSUMERS.md) |
| Deprecations | [`deprecations.log`](deprecations.log) |
| Baseline | [`00-baseline-14/`](00-baseline-14/README.md) |
| Flex-layout visual evidence | [`flex-layout-visual/`](flex-layout-visual/README.md), [`flex-layout-visual/diff/SUMMARY.md`](flex-layout-visual/diff/SUMMARY.md) |

Every log cited below is in [`logs/`](logs/) unless prefixed with `00-baseline-14/`.

## 1. Toolchain

| item | 14 baseline ([`00-baseline-14/logs/ng-version.log`](00-baseline-14/logs/ng-version.log)) | 15 ([`ng-version.log`](ng-version.log)) | Angular 15 range |
|---|---|---|---|
| `@angular/*` (11 runtime packages incl. localize, service-worker) | 14.3.0 | **15.2.10** | 15.2.x (last 15 runtime) |
| `@angular/cli`, `@angular-devkit/build-angular` | 14.2.13 | **15.2.11** | 15.2.x |
| `@angular/material`, `cdk`, `material-moment-adapter` | 14.2.7 | **15.2.9** | 15.2.x (last 15 Material) |
| `@angular/flex-layout` | 14.0.0-beta.41 | **removed** | EOL, no 15 release beyond beta.42 |
| `@northgate/canopy-ui` | 3.7.2 (Material 14 legacy) | **4.0.0** (Angular 15 / MDC, peers `^15`) | |
| `@northgate/lantern-sdk` | 2.4.1 (View Engine, needed `ngcc`) | **5.0.0** (partial Ivy, peers `@angular/* ^15.0.0`, `rxjs ^7.5.0`) | |
| `@ngrx/*` | 14.3.3 | 15.4.0 | |
| `angular-oauth2-oidc` / `ngx-cookie-service` / `ngx-mask` | 14.0.1 / 14.0.1 / 14.3.3 | 15.0.1 / 15.0.0 / 15.2.3 | |
| TypeScript | 4.7.4 | **4.9.5** | `>=4.8.2 <5.0.0` |
| RxJS | 7.5.7 | 7.5.7 (unchanged) | `^6.5.3 \|\| ^7.4.0` |
| zone.js | 0.11.8 | **0.12.0** (KAN-40: matches the Iris manifest `zoneJsCompatible`) | `~0.11.4 \|\| ~0.12.0` |
| angular-eslint / @typescript-eslint / eslint | 14.4.0 / 5.x / 8.x | 15.2.1 / unchanged / unchanged | |
| Node / npm | 16.20.2 / 8.19.4 | 16.20.2 / 8.19.4 (unchanged) | `^14.20.0 \|\| ^16.13.0 \|\| ^18.10.0` |
| TS target | es2017 | ES2022 + `useDefineForClassFields: false` (CLI 15 migration) | |
| `.npmrc` | `legacy-peer-deps=true` (MOL-3611, for flex-layout's exact 14.0 peer) | removed; lockfile resolves under strict peers ([`npm-ci-clean-no-ngcc.log`](logs/npm-ci-clean-no-ngcc.log)) | |
| `postinstall` | `ngcc ...` | removed (section 6) | |

No `Jenkinsfile` in this repository (shared `northgateNodePipeline`, Node from `.nvmrc`, coverage
threshold from `karma.conf.js` 30% lines). No toolchain change is needed in the shared library.

## 2. Commits (in order, `origin/develop..HEAD`)

| commit | milestone | scope |
|---|---|---|
| `1d57e9d` MOL-4471 Capture Angular 14 baseline gates and flex-layout inventory | baseline | `00-baseline-14/` (build, test+coverage by module, lint, audit full/prod, ng version, npm ls, exact flex-layout inventory) |
| `ec51d2d` MOL-4471 capture flex-layout visual baseline (64 routes x 1280x800/375x812) | visual baseline | `flex-layout-visual/baseline/` (128 full-page screenshots), `tools/` |
| `3c9cfd5` MOL-4471 pin @northgate/canopy-ui 4.0.0 and @northgate/lantern-sdk 5.0.0 | pins | `package.json`, `package-lock.json` |
| `646dcdf` MOL-4471 ng update @angular/core@15 @angular/cli@15 @angular-eslint/schematics@15, zone.js 0.12.0 | framework | `package.json`, lockfile, `angular.json`, `tsconfig.json`, `src/test.ts`, `src/app/app-routing.module.ts` |
| `7234e5a` MOL-4471 move @angular/flex-layout to 15.0.0-beta.42 as interim step before removal | framework | flex-layout beta.42 so the tree resolves on 15 until the conversion commit |
| `43aa848` MOL-4471 ng update @angular/material@15 (CDK/Material/moment-adapter 15.2.9, legacy imports) | Material | 11 `.ts` files rewritten to `Legacy*` imports by the schematic |
| `dc7ecce` MOL-4471 run Material MDC migration (dialog, form-field, input, paginator to MDC imports) | MDC | `ng generate @angular/material:mdc-migration` over `src`, all components; net result: the `Legacy*` imports go back to the MDC modules (transfers / bill-pay `.ts` net unchanged) |
| `7002a0c` MOL-4471 run canopy-4-theme-mixin migration (no typography overrides, no changes) | Canopy 4 | schematic ran, nothing to rewrite (section 3) |
| `6a61903` MOL-4471 update NgRx 15.4.0, angular-oauth2-oidc 15.0.1, ngx-cookie-service 15.0.0, ngx-mask 15.2.3 | third party | `package.json`, lockfile |
| `913abe3` MOL-4471 replace NgxMaskModule.forRoot with provideEnvironmentNgxMask for ngx-mask 15 | third party | `src/app/app.module.ts` |
| `e8ec0a3` MOL-4471 replace @angular/flex-layout with CSS layout utilities and drop the dependency | flex-layout | 95 templates, `src/styles/_layout.scss` (new), `src/styles.scss`, `card-list.component.scss`, `shared.module.ts`, `package.json`, lockfile, `flex-layout-removal/` inventory-after |
| `235fd27` MOL-4471 add flex-layout candidate screenshots, pixel diff, geometry evidence and SUMMARY.md | visual candidate/diff | `flex-layout-visual/candidate/`, `diff/`, `SUMMARY.md`, tooling |
| `9e58592` MOL-4471 remove ngcc postinstall and legacy-peer-deps, record final gates, estate smoke and Iris host check | ngcc + gates | `package.json`, `.npmrc`, `README.md`, `logs/`, `iris-host-check/`, audit id tables |
| docs commit (this report, CAB, CONSUMERS, deprecations, matrix, ADR 0015, CHANGELOG) | docs | `docs/**`, `CHANGELOG.md` |

AI-assisted labelling: the `AI-Assisted: AIT-014` / `AI-Assisted-Scope` trailers required by
`AI_ASSISTED_CODE_POLICY.md` 4.1 are present from `9e58592` onwards; the twelve earlier commits carry
only the `Co-Authored-By` line. They were pushed under the durability rule (push after each
milestone) and are not amended here. The PR description carries the **AI-assisted content** section
for the whole branch; whether to rebase the trailers in before merge is a reviewer decision
(section 10).

## 3. Migrations applied

Logs: [`ng-update-core-cli-15.log`](logs/ng-update-core-cli-15.log), [`ng-update-material-15.log`](logs/ng-update-material-15.log),
[`mdc-migration.log`](logs/mdc-migration.log), [`canopy-4-theme-mixin.log`](logs/canopy-4-theme-mixin.log),
[`ng-update-ngrx-15.log`](logs/ng-update-ngrx-15.log); per-item outcome in [`deprecations.log`](deprecations.log).

- **`ng update @angular/core@15 @angular/cli@15 @angular-eslint/schematics@15`**: `relativeLinkResolution`
  removed from the router config (`app-routing.module.ts`); `RouterLinkWithHref` nothing to do;
  Karma `require.context` boilerplate removed from `src/test.ts`; TS target ES2022 +
  `useDefineForClassFields: false`; angular-eslint 15 `schematics` block in `angular.json`; zone.js
  0.12.0. Test discovery and the coverage denominator (MOL-2911: whole `app/` tree, not just what
  the specs import) now come from `test.options.include` in `angular.json` because the CLI 15 Karma
  builder no longer supports `require.context`. Same 198 specs, same 2 skipped, same 36.19% lines.
- **`ng update @angular/material@15`**: 15.2.9; schematic rewrote 11 files to `MatLegacy*` imports.
- **MDC migration** (`@angular/material:mdc-migration`, all components, `src`): dialog, form-field,
  input, paginator moved to the MDC modules (`shared.module.ts`, `shell.component.ts`,
  `idle-warning-dialog.component.ts`); the other legacy imports written by the previous step were
  reverted to the standard MDC modules, so the eight transfers/bill-pay/cards/alerts/accounts `.ts`
  files are **net unchanged** against `develop`. No `.mat-*` class overrides existed in
  `src/styles.scss` (only `canopy.theme()` and tokens), so there was nothing to replace with Canopy
  4 APIs. Canopy is consumed only through its public entry points (`@northgate/canopy-ui`,
  `/layout`, `/overlays`, `/data-display`, the `themes`/`tokens` Sass entry). The one pre-existing
  selector that names Canopy-internal classes, the MOL-1522 print rule `cn-page-shell .cn-shell__nav,
  .cn-shell__topbar` in `src/styles.scss`, matches nothing on Canopy 3.7.2 or 4.0.0 (both use
  `cn-page-shell__nav` / `cn-page-shell__topbar`); it was already dead on 14, is left as is (canopy-ui
  ADR-0004: do not reach into internals) and is listed in section 10.
- **Canopy 4 `canopy-4-theme-mixin` schematic**: "no Canopy typography overrides found, nothing to
  do". retail-web uses `@include canopy.theme()` with defaults, so the KAN-33 typography rename table
  does not touch this repository today; if the table changes before Canopy 4.0.0 is published, the
  risk to retail-web is limited to Canopy-internal rendering, not to local code.
- **NgRx 15.4.0**: `ng update @ngrx/store@15` migrations ran with no changes. **ngx-mask 15**:
  `NgxMaskModule.forRoot()` -> `provideEnvironmentNgxMask()` + `NgxMaskDirective`/`NgxMaskPipe`
  (`app.module.ts`, the only non-mechanical third-party API change).
- **Interim Canopy components (KAN-27 / KAN-28)**: `cn-filter-chips` is used in 4 places
  (`transaction-filters` x2, `card-controls`, `channel-picker`) and keeps being used unchanged.
  `cn-amount-slider` is not used.

## 4. Gate results

| gate | baseline 14.3.0 | after hop 15.2.10 | log |
|---|---|---|---|
| Clean `npm ci` (strict peers, no `legacy-peer-deps`, no `postinstall`) | pass (with `legacy-peer-deps`, `ngcc` postinstall) | **pass**, exit 0 | [`npm-ci-clean-no-ngcc.log`](logs/npm-ci-clean-no-ngcc.log) |
| `ng version` | Angular 14.3.0 / CLI 14.2.13 / TS 4.7.4 | Angular 15.2.10 / CLI 15.2.11 / TS 4.9.5 / rxjs 7.5.7 / Node 16.20.2 | [`ng-version.log`](logs/ng-version.log) |
| `npm ls --depth=0` | pass | **pass** (no missing/invalid/extraneous) | [`npm-ls.log`](logs/npm-ls.log) |
| `npm run build:prod` (en-US + es) | pass, budget **warning** initial 2.05 MB > 2.00 MB `maximumWarning` (54 kB over) | **pass**, budget **warning** initial 2.27 MB (274.86 kB over; error budget 3 MB not hit); see section 7 | [`build-prod.log`](logs/build-prod.log), [`build-prod-summary.txt`](logs/build-prod-summary.txt), [`bundle-sizes.txt`](logs/bundle-sizes.txt) |
| `npm run lint` (angular-eslint 15) | 0 errors, 2 warnings | **0 errors**, same 2 pre-existing `no-explicit-any` warnings in `src/zone-flags.ts` | [`lint.log`](logs/lint.log) |
| `npm run test:ci` (Karma, ChromeHeadless, threshold 30% lines) | 196/198 executed (2 skipped), 36.19% lines | **196/198 executed (2 skipped, the same two)**, 36.19% lines / 35.82% statements / 24.15% branches / 28.95% functions | [`test-ci.log`](logs/test-ci.log), [`coverage-by-module.md`](logs/coverage-by-module.md), [`lcov.info`](logs/lcov.info) |
| `npm audit` (full tree) | 82 unique ids | **81 unique ids: 3 NEW, 4 resolved**; the 3 new are the expected CLI-15 dev-only ids under KAN-32/KAN-37 (section 5); no other new id | [`audit-full.txt`](logs/audit-full.txt), [`audit-full.json`](logs/audit-full.json), [`audit-full-ids.md`](audit-full-ids.md) |
| `npm audit --production` | 21 unique ids | **18 unique ids: 0 NEW, 3 resolved** (the three `minimatch` 5.x ReDoS ids `GHSA-23c5-xmqv-rm74`, `GHSA-3ppc-4f35-3m26`, `GHSA-7r86-cg39-jmmj`) | [`audit-prod.txt`](logs/audit-prod.txt), [`audit-prod.json`](logs/audit-prod.json), [`audit-prod-ids.md`](audit-prod-ids.md) |
| Bundle budgets (`angular.json`) | warning only | warning only (`anyComponentStyle` clean) | [`build-prod.log`](logs/build-prod.log) |
| Estate smoke (`mock-external/smoke.sh`) | 18 pass (Lantern 4.0.0 verification, LNTN-401) | **20 pass, 0 fail, 0 skip** | [`estate-smoke.log`](logs/estate-smoke.log) |
| `verify-estate.sh --quick retail-web` (cswt-workspace) | - | **10 pass, 0 fail, 2 skip (--quick)** | [`verify-estate-quick.log`](logs/verify-estate-quick.log) |
| Flex-layout inventory | 724 usages / 95 templates / 101 responsive / 1 `FlexLayoutModule` | **0 / 0 / 0 / 0**; no `@angular/flex-layout` in `package.json` or lockfile | [`flex-layout-removal/flex-layout-inventory-after.md`](flex-layout-removal/flex-layout-inventory-after.md) |
| Flex-layout visual diff | 128 baseline screenshots | 128 pairs: 22 identical, 106 explained, **0 unexplained**; 496 element pairs, 2,589 computed-style checks, 0 mismatches; human sign-off **blocked on KAN-30** | [`flex-layout-visual/diff/SUMMARY.md`](flex-layout-visual/diff/SUMMARY.md) |
| ngcc-free install proof | n/a (Lantern 2.4.1 was View Engine) | **pass** (section 6) | [`ngcc-proof.txt`](logs/ngcc-proof.txt), [`angular-packages-format.txt`](logs/angular-packages-format.txt) |
| Iris host check (Stage 2 scratch build) | - | widget **mounts** in the Angular 15 host page via runtime injection; no mount exists in source (KAN-42) | [`CONSUMERS.md`](CONSUMERS.md), [`iris-host-check/`](iris-host-check/) |

Note on the audit counts: `npm audit` reports 81 vulnerable paths (was 62) and `--production` 23
(was 7) even though no production advisory id is new. With `legacy-peer-deps` gone npm now follows
peer edges, so the same `@angular/core` advisories are attributed to every package that peers on it
(`@angular/cdk`, `@ngrx/*`, `@northgate/canopy-ui`, `@northgate/lantern-sdk`, ...). The unique
advisory id set is the governance measure (DEPENDENCY_POLICY) and it did not grow on the production
tree.

### 4.1 Per-module line coverage (KAN-25: transfers and bill pay)

| module | baseline 14 | after 15 | delta |
|---|---|---|---|
| `features/transfers` | 32 / 352 = **9.09%** | 32 / 352 = **9.09%** | 0 |
| `features/bill-pay` | 23 / 162 = **14.20%** | 23 / 162 = **14.20%** | 0 |
| all modules | 1057 / 2920 = 36.19% | 1057 / 2920 = 36.19% | 0 |

Transfers and bill-pay source was changed only by the mechanical flex-layout template conversion
(21 `.html` files, attribute -> class rewrites, no `.ts`/`.scss` net change, no form, routing or
MFA step-up logic touched); the KAN-25 coverage gap is unchanged and remains a human decision.
Full table: [`coverage-by-module.md`](logs/coverage-by-module.md).

## 5. Audit findings (governance)

New advisory ids versus the 14 baseline, full tree only, all dev-only (`@angular/cli` 15.2.11 tree),
already under GIS decision **KAN-32 / KAN-37**, no `overrides` added:

| id | severity | package | reached via |
|---|---|---|---|
| GHSA-52v5-jr5w-gjxr | high | `sigstore` | `@angular/cli` -> `pacote` -> `sigstore` (dev) |
| GHSA-73wf-gq98-2v4g | high | `browserslist` | `@angular-devkit/build-angular` (dev) |
| GHSA-c83g-rgw3-j3cx | high | `browserslist` | `@angular-devkit/build-angular` (dev) |

Resolved by the hop (no longer in the tree): 4 full-tree ids, the three `minimatch` 5.x ReDoS ids
(`GHSA-23c5-xmqv-rm74`, `GHSA-3ppc-4f35-3m26`, `GHSA-7r86-cg39-jmmj`, also the 3 that left the
production set) and `GHSA-wr3j-pwj9-hqq6` (`webpack-dev-middleware` path traversal, dev-only). The remaining
carried findings (Angular `<=19.2.x` advisories on `@angular/common|compiler|core`, `@babel/core`,
webpack/dev-server, `tar`, `path-to-regexp`, ...) are identical to the baseline set and their fixed
versions are Angular >= 17/19 or dev-only tooling outside the one-major rule; they are listed with
GIS references in `CAB_RECORD.md` section 6. `package.json` `overrides` (`minimist`, `loader-utils`,
GIS-2207) are unchanged.

## 6. ngcc removal proof

After `rm -rf node_modules && npm ci` on Node 16.20.2 / npm 8.19.4 with the `postinstall` script and
`legacy-peer-deps` removed ([`ngcc-proof.txt`](logs/ngcc-proof.txt)):

```
find node_modules -name '*.metadata.json' | wc -l                       -> 0
find node_modules -type d -name __ivy_ngcc__ | wc -l                    -> 0
grep -rl __processed_by_ivy_ngcc__ node_modules --include=package.json  -> 0
npx ngcc --properties es2015 browser module main --first-only --create-ivy-entry-points
                                                                        -> exit 0, no output, no markers written
```

[`angular-packages-format.txt`](logs/angular-packages-format.txt) lists every Angular-declaring
package in the tree with its format: `@northgate/lantern-sdk` 5.0.0 partial Ivy (7 `ɵɵngDeclare`
bundles), `@northgate/canopy-ui` 4.0.0 partial Ivy (109), `@ngrx/*`, `ngx-mask`, `ngx-cookie-service`,
`angular-oauth2-oidc`, `@ngx-translate/*` partial Ivy, `@angular/*` 15.2.x. **No View Engine package
remains**, so the `postinstall` `ngcc` step is removed. A View Engine package reintroduced later
fails at compile time ("not compatible with Angular Ivy") rather than at runtime. `README.md`
documents this.

## 7. Bundle and package delta

| chunk (prod, en-US) | 14 raw / transfer | 15 raw / transfer | delta raw |
|---|---|---|---|
| `main` | 1.77 MB / 366.42 kB | 1.89 MB / 374.76 kB | +120 kB (MDC components, Canopy 4, Angular 15 runtime) |
| `styles` | 236.32 kB / 15.88 kB | 338.17 kB / 20.85 kB | +102 kB (MDC + Canopy 4 theme CSS) |
| `polyfills` | 45.37 kB / 13.88 kB | 45.30 kB / 13.91 kB | 0 (zone.js 0.12.0) |
| **initial total** | **2.05 MB / 398.07 kB** | **2.27 MB / 411.43 kB** | **+220 kB raw / +13 kB transfer** |
| lazy `features-transfers` | 61.65 kB | 60.44 kB | -1.2 kB (flex-layout directives gone) |
| lazy `features-cards` | 44.38 kB | 54.26 kB | +9.9 kB (MDC dialog/chips) |

The `initial` `maximumWarning` (2 MB) was already exceeded on 14 by 54 kB; it is now exceeded by
274.86 kB. The `maximumError` (3 MB) is not hit and the budget was **not** changed. Raising the
warning budget, or trimming (e.g. lazy-loading `@angular/material-moment-adapter`), is a human
decision -> `new_jira_items_needed`. The Iris help-page growth (+40 kB raw / +8 kB gzip requested by
IRIS-0900) does not apply yet because retail-web does not vendor Iris (KAN-42, section 8).

## 8. Consumers, estate and Iris

See [`CONSUMERS.md`](CONSUMERS.md). Summary: estate up via `ESTATE_NO_DOCKER=1 estate-up.sh`
(Verdaccio, mocks, platform services), `smoke.sh` **20 pass / 0 fail / 0 skip**, `verify-estate.sh
--quick retail-web` **10 pass / 0 fail**, the built Angular 15 app served on 4200 against the estate
(login through Keystone as `rosalind.ekstrand`, all 64 routes x 2 viewports rendered for the visual
evidence). Iris: retail-web has **no** `#iris-root`, `<northgate-iris-widget>`, `scripts/vendor-iris.js`,
`iris.manifest.json`, `src/assets/widgets/`, `/iris` proxy entry or Jenkinsfile (KAN-42 confirmed;
`docs/architecture.md` is out of date). The Stage 2 Iris scratch build (`feature/IRIS-0900-angular-14-to-15`,
Angular 15.2.10, `zoneJsCompatible` 0.12.0) was therefore injected at runtime into the served Angular
15 `/help` page with the bundle intercepted from its dist: it defines, renders `.iris-root`, launcher
and panel, reuses the host's single zone.js 0.12.0 (KAN-40 resolved on the host side), and the host
keeps rendering. Its call to `localhost:4517/iris/v1/sessions` is refused by the host's CSP
`connect-src` (index.html), which is one more piece of the missing integration for KAN-42. No mount
was invented and no Iris file was changed.

## 9. Decisions not made (human, Jira)

| key | topic | what this hop did |
|---|---|---|
| KAN-30 | flex-layout -> CSS visual sign-off | produced 128 baseline/candidate pairs, pixel diffs, per-template SUMMARY.md with 0 unexplained; did not sign off |
| KAN-25 | transfers / bill-pay coverage gap | did not touch their `.ts`/`.scss`/routing; recorded 9.09% / 14.20% before and after |
| KAN-23 | Stage 3 waiver: Canopy 4.0.0 / Lantern 5.0.0 on local Verdaccio only | stated in PR body; PR must not merge until Artifactory has both |
| KAN-31 | Canopy 4 showcase visual acceptance | MDC/Canopy 4 visual differences in the app are classified (codes M/C in SUMMARY.md) for the KAN-30/31 reviewers, not accepted here |
| KAN-33 | Canopy typography rename table | schematic found no local overrides; nothing local depends on the table |
| KAN-34 | `dense` / -2 density | not used |
| KAN-27 / KAN-28 | interim `cn-filter-chips` / `cn-amount-slider` | `cn-filter-chips` kept in 4 places, `cn-amount-slider` not used |
| KAN-32 / KAN-37 | 3 new CLI-15 dev-only audit ids | listed, no overrides |
| KAN-40 | host zone.js vs Iris manifest | host is now 0.12.0 = manifest; recorded |
| KAN-42 | Iris mount / vendoring absent from retail-web | confirmed, recorded, mount checked by injection; not implemented |

## 10. New items for Jira (`new_jira_items_needed`)

1. Initial bundle `maximumWarning`: 2.27 MB vs 2 MB (+274.86 kB; was +54 kB on 14). Decide budget
   increase vs trimming before the CAB.
2. AI-Assisted trailers: commits `1d57e9d`..`235fd27` lack `AI-Assisted: AIT-014` (policy 4.1);
   decide whether to rebase them in before merge (rewrites a pushed branch) or accept the PR-level
   **AI-assisted content** section plus this note.
3. `docs/architecture.md` describes a `<div id="iris-root">` CDN mount that no longer exists in
   source; fold into KAN-42 or raise a docs item.
4. Iris host CSP: `connect-src` in `src/index.html` does not allow the orchestrator (4517) and there
   is no `/iris` proxy; needed whenever KAN-42 lands the vendoring (GIS reviewer required for CSP).
5. Low: the MOL-1522 print rule in `src/styles.scss` targets `.cn-shell__nav` / `.cn-shell__topbar`,
   which do not exist in Canopy 3.7.2 or 4.0.0, so statements print with the shell nav/topbar. Needs a
   public Canopy print hook (canopy-ui request) rather than a selector on `cn-page-shell__*` internals.

## 11. Rollback

Revert the branch merge on `develop` (single revert commit). Canopy 3.7.2 and Lantern 2.4.1 stay
published on Artifactory and the previous lockfile restores `legacy-peer-deps` and the `ngcc`
`postinstall` with it. No data migration, no service worker schema change (`ngsw-config.json`
untouched), so nothing has migrated; the runbook `docs/runbooks/rollback-failed-deploy.md` applies
unchanged.

## 12. Next

- Do **not** start 15 -> 16 from this branch (ADR 0015).
- Merge order: Canopy PR #3 and Lantern PR #6 published to Artifactory (KAN-23) -> this PR ->
  Iris KAN-42 vendoring as its own MOL story.
